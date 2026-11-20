const bufferConfig = Object.freeze({ countdown: 3, targetLead: 1, minLead: 0.75, maxLead: 2, maxFrames: 64, maxEvents: 8192 });
let generationCounter = 0;
class BufferedSession {
  constructor(options = {}, { workerFactory = null, source = globalThis.__BNT_WORKER_SOURCE__, config = {} } = {}) {
    this.options = structuredClone(options);
    this.mode = "worker";
    this.config = { ...bufferConfig, ...config };
    if (!Number.isFinite(this.config.minLead) || this.config.minLead < 0 || this.config.minLead > this.config.targetLead || !Number.isSafeInteger(this.config.maxFrames) || this.config.maxFrames < 1 || !Number.isSafeInteger(this.config.maxEvents) || this.config.maxEvents < 1 || !Number.isFinite(this.config.countdown) || this.config.countdown < 0) throw Error("Invalid presentation buffer configuration");
    this.generation = "p15-" + ++generationCounter;
    this.inputSeq = 0;
    this.outputSeq = 0;
    this.packetCache = /* @__PURE__ */ new Map();
    this.commandSeq = 0;
    this.frames = /* @__PURE__ */ new Map();
    this.eventQueue = [];
    this.eventId = 0;
    this.deliveredEvents = [];
    this.commands = /* @__PURE__ */ new Map();
    this.clock = 0;
    this.countdownLeft = this.config.countdown;
    this.phase = "preparing";
    this.workerPaused = true;
    this.started = false;
    this.error = null;
    this.completion = null;
    this.timings = [];
    this.maxTickMs = 0;
    this.totalTickMs = 0;
    this.previousFatigue = null;
    this.lastCredit = -1;
    this.telemetry = { receivedFrames: 0, underruns: 0, underrunMs: 0, maxLead: 0, maxFrames: 0, maxEvents: 0, ackMs: [], transfers: [], messageBytes: 0 };
    this.ready = new Promise((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
    if (!source) {
      this.rejectReady(Error("Embedded Worker unavailable"));
      return;
    }
    try {
      if (workerFactory) this.worker = workerFactory(source);
      else {
        this.url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
        this.worker = new Worker(this.url);
      }
      this.readyTimer = setTimeout(() => this.fail(Error("Worker initialization timed out")), 15e3);
      this.worker.onmessage = (e) => {
        try {
          const t = performance.now();
          this.receive(e.data);
          (this.telemetry.receiveMs ??= []).push(performance.now() - t);
          if (this.telemetry.receiveMs.length > 512) this.telemetry.receiveMs.shift();
        } catch (error) {
          this.fail(error);
        }
      };
      this.worker.onerror = (e) => this.fail(Error(e.message || "Worker failed"));
      this.send("prepare", { options, ...options.checkpoint ? { checkpoint: options.checkpoint } : {}, buffer: { targetLead: this.config.targetLead, maxLead: this.config.maxLead } });
    } catch (error) {
      this.rejectReady(error);
    }
  }
  send(type, payload = {}) {
    if (!this.worker) throw Error("Worker unavailable");
    this.worker.postMessage({ version: 1, generation: this.generation, seq: ++this.inputSeq, type, ...payload });
  }
  fail(error) {
    clearTimeout(this.readyTimer);
    if (this.url) {
      URL.revokeObjectURL(this.url);
      this.url = null;
    }
    this.error = error.message;
    this.phase = "error";
    this.workerPaused = false;
    this.rejectReady(error);
    for (const cmd of this.commands.values()) if (["sent", "received", "accepted-queued"].includes(cmd.status)) cmd.status = "abandoned-with-race";
    this.pauseReject?.(error);
    this.stepReject?.(error);
    this.worker?.terminate();
  }
  receive(m) {
    if (this.phase === "closed") return;
    if (m.generation !== this.generation) return;
    if (m.version !== 1 || !Number.isSafeInteger(m.seq)) throw Error("Invalid worker output");
    if (m.seq <= this.outputSeq) {
      const old = this.packetCache.get(m.seq);
      if (old !== void 0 && old !== JSON.stringify(m)) throw Error("Conflicting duplicate worker packet");
      return;
    }
    if (m.seq !== this.outputSeq + 1) throw Error("Gap in worker output");
    if (Number.isFinite(m.sentEpoch)) {
      this.telemetry.transfers.push(Math.max(0, performance.timeOrigin + performance.now() - m.sentEpoch));
      if (this.telemetry.transfers.length > 512) this.telemetry.transfers.shift();
    }
    this.outputSeq = m.seq;
    this.packetCache.set(m.seq, JSON.stringify(m));
    if (this.packetCache.size > 16) this.packetCache.delete(this.packetCache.keys().next().value);
    this.telemetry.messageBytes += new TextEncoder().encode(JSON.stringify(m)).length;
    if (m.type === "ready" || m.type === "restored") {
      this.base = m.base;
      this.eventId = m.eventCursor ?? 0;
      this.changes = m.changes ?? [];
      this.setup = m.setup;
      this.dt = m.dt ?? m.base.config.dt;
    } else if (m.type === "events") {
      for (const e of m.events) {
        if (e.id !== this.eventId + 1) throw Error("Native event gap/duplicate");
        if (this.eventQueue.length >= this.config.maxEvents) throw Error("Presentation event capacity exceeded");
        this.eventId = e.id;
        this.eventQueue.push(e);
      }
      this.telemetry.maxEvents = Math.max(this.telemetry.maxEvents, this.eventQueue.length);
    } else if (m.type === "frame") {
      if (m.worker) {
        this.workerMetrics = m.worker;
        this.maxTickMs = m.worker.maxTickMs;
        if (m.worker.lastDigest && this.lastDigestTick !== m.worker.lastDigest.tick) {
          this.lastDigestTick = m.worker.lastDigest.tick;
          (this.telemetry.digestSamples ??= []).push(m.worker.lastDigest);
          if (this.telemetry.digestSamples.length > 512) this.telemetry.digestSamples.shift();
        }
      }
      const f = m.frame, old = this.frames.get(f.tick);
      if (old && f.revision === old.revision) {
        if (JSON.stringify(old) !== JSON.stringify(f)) throw Error("Conflicting presentation frame revision");
        return;
      }
      if (old && f.revision < old.revision) throw Error("Stale presentation frame revision");
      if (!old && this.latestTick !== void 0 && f.tick !== this.latestTick + 1) throw Error("Presentation frame gap");
      if (!old && this.frames.size >= this.config.maxFrames) throw Error("Presentation frame capacity exceeded");
      if (m.eventWatermark > this.eventId) throw Error("Frame precedes native event authority");
      this.frames.set(f.tick, f);
      this.latestTick = Math.max(this.latestTick ?? 0, f.tick);
      this.telemetry.receivedFrames++;
      this.telemetry.maxFrames = Math.max(this.telemetry.maxFrames, this.frames.size);
      this.telemetry.maxLead = Math.max(this.telemetry.maxLead, f.time - (this.phase === "preparing" ? f.time : this.clock));
      if (this.phase === "preparing") {
        this.clock = f.time;
        this.state = { ...this.base, ...f, events: [] };
        this.started = f.tick > 0;
        this.phase = this.started ? "paused" : "ready";
        if (this.url) {
          URL.revokeObjectURL(this.url);
          this.url = null;
        }
        clearTimeout(this.readyTimer);
        this.resolveReady(this);
      }
      if (this.phase === "ready" || this.phase === "paused" && f.tick === this.state.tick) this.present();
    } else if (m.type === "command-status") {
      const c = this.commands.get(m.commandId);
      if (c) {
        if (m.conflict) {
          c.lastConflict = m.reason;
          return;
        }
        Object.assign(c, m);
        if (m.status.startsWith("activated")) c.activationAckMs = performance.now() - c.sentAt;
        if (m.status === "received") c.receivedMs = performance.now() - c.sentAt;
        if (["accepted", "accepted-queued", "rejected"].includes(m.status) && !c.acknowledged) {
          c.acknowledged = true;
          this.telemetry.ackMs.push(performance.now() - c.sentAt);
        }
      }
    } else if (m.type === "paused") {
      this.workerPaused = true;
      if (!["error", "finished"].includes(this.phase)) this.phase = this.started ? "paused" : "countdown-paused";
      this.pauseResolve?.();
      this.pauseResolve = null;
      this.pausePromise = null;
      this.pauseReject = null;
    } else if (m.type === "stepped") {
      this.clock = m.tick * this.dt;
      this.present();
      if (this.phase !== "finished") this.phase = "paused";
      this.stepResolve?.();
      this.stepResolve = null;
      this.stepReject = null;
    } else if (m.type === "complete") {
      this.completion = m;
      this.present();
    } else if (m.type === "error") this.fail(Error(m.message));
    else if (m.type === "export") {
      this.exportResolve?.(m);
      this.exportResolve = null;
    }
  }
  get lead() {
    return Math.max(0, (this.frames.get(this.latestTick)?.time ?? 0) - this.clock);
  }
  get steppingReady() {
    return this.started && this.workerPaused && this.lead < 1e-7 && this.phase === "paused";
  }
  view() {
    return { tick: this.state.tick, time: this.state.time };
  }
  sign(action, sign) {
    const commandId = ++this.commandSeq;
    const view = this.view();
    this.commands.set(commandId, { commandId, action, sign, view, status: "sent", sentAt: performance.now() });
    this.send("command", { commandId, action, sign, view });
    return commandId;
  }
  start() {
    if (this.phase === "error") return;
    if (this.pausePromise || this.stepResolve) throw Error("Wait for native pause/step acknowledgment");
    if (!this.started) {
      this.phase = "countdown";
    } else {
      this.phase = this.lead >= this.config.minLead ? "playing" : "buffering";
      this.bufferReason = "resume";
    }
    this.workerPaused = false;
    this.send("credit", { view: this.view() });
    this.send("run");
  }
  pause() {
    if (this.pausePromise) return this.pausePromise;
    this.phase = this.started ? "paused" : "countdown-paused";
    this.workerPaused = false;
    this.pausePromise = new Promise((r, j) => {
      this.pauseResolve = r;
      this.pauseReject = j;
    });
    this.send("pause");
    return this.pausePromise;
  }
  tail() {
    if (!this.workerPaused || !this.started || this.phase !== "paused" || this.pausePromise || this.stepResolve) throw Error("Confirm worker pause first");
    this.phase = "tail";
  }
  step() {
    if (!this.steppingReady) throw Error("Pause and present buffered tail before native step");
    this.phase = "stepping";
    this.send("step", { view: this.view() });
    return new Promise((r, j) => {
      this.stepResolve = r;
      this.stepReject = j;
    });
  }
  advancePresentation(elapsed, speed) {
    if (this.phase === "countdown") {
      this.countdownLeft = Math.max(0, this.countdownLeft - elapsed);
      if (this.countdownLeft <= 0) {
        if (this.lead >= this.config.minLead || this.completion) {
          this.started = true;
          this.phase = "playing";
          this.send("present-start");
          this.present();
        } else this.phase = "initial-buffering";
      }
      return;
    }
    if (this.phase === "initial-buffering") {
      if (this.lead >= this.config.minLead || this.completion) {
        this.started = true;
        this.phase = "playing";
        this.send("present-start");
        this.present();
      }
      return;
    }
    if (this.phase === "buffering") {
      if (this.bufferReason === "underrun") this.telemetry.underrunMs += elapsed * 1e3;
      else this.telemetry.initialWaitMs = (this.telemetry.initialWaitMs ?? 0) + elapsed * 1e3;
      if (this.lead >= this.config.minLead || this.completion) this.phase = "playing";
      return;
    }
    if (!["playing", "tail"].includes(this.phase)) return;
    const latest = this.frames.get(this.latestTick)?.time ?? this.clock, target = this.clock + elapsed * speed;
    this.clock = Math.min(target, latest);
    this.present();
    if (this.state.status === "Ended" || ["Stalled", "Error"].includes(this.state.status)) {
      this.phase = "finished";
      return;
    }
    if (target > latest + 1e-8) {
      if (this.phase === "tail") this.phase = "paused";
      else {
        this.phase = "buffering";
        this.bufferReason = "underrun";
        this.telemetry.underruns++;
      }
    }
    if (!this.workerPaused && this.state.tick !== this.lastCredit) {
      this.lastCredit = this.state.tick;
      this.send("credit", { view: this.view() });
    }
  }
  present() {
    const tick = Math.floor((this.clock + 1e-8) / this.dt);
    let start = this.state?.tick ?? tick;
    for (let n = start; n <= tick; n++) {
      const f = this.frames.get(n);
      if (!f) throw Error("Gap in chronological presentation");
      if (["Ended", "Stalled", "Error"].includes(f.status) && !this.completion) return;
      const team = this.state?.entrants.find((r) => r.id === this.state.playerId)?.ru.beasts;
      if (n > start) this.previousFatigue = team ? team.reduce((a, b) => a + b.fatigue, 0) / team.length : null;
      this.state = { ...this.base, ...f, events: [] };
      if (n > start) this.telemetry.presentedTicks = (this.telemetry.presentedTicks ?? 0) + 1;
      if (this.started || this.phase === "ready") {
        while ((this.eventQueue[0]?.presentationTick ?? Infinity) <= f.tick && this.eventQueue[0].time <= f.time + 1e-9) {
          if (this.deliveredEvents.length >= this.config.maxEvents) throw Error("Presented event delivery capacity exceeded");
          const event = this.eventQueue.shift();
          this.deliveredEvents.push(event);
          if (event.type === "SIGN_ACTIVATED") {
            for (const c of this.commands.values()) if (c.activationTick === event.tick && !c.presentedActivationMs) c.presentedActivationMs = performance.now() - c.sentAt;
          }
        }
      }
    }
    for (const key of this.frames.keys()) if (key < tick) this.frames.delete(key);
    if (this.completion && this.state.tick >= this.completion.tick && ["Ended", "Stalled", "Error"].includes(this.state.status)) this.phase = "finished";
  }
  renderState() {
    const s = this.state, n = this.frames.get(s.tick + 1);
    if (!n) return s;
    const a = Math.max(0, Math.min(1, (this.clock - s.time) / this.dt));
    return { ...s, entrants: s.entrants.map((r) => {
      const next = n.entrants.find((x) => x.id === r.id);
      if (!next || next.status !== r.status || next.physical !== r.physical || next.control !== r.control || next.completedLaps !== r.completedLaps || next.checkpointCursor !== r.checkpointCursor || next.hasEnteredCourse !== r.hasEnteredCourse) return r;
      return { ...r, q: r.q + (next.q - r.q) * a, lane: r.lane + (next.lane - r.lane) * a };
    }) };
  }
  drainEvents() {
    return this.deliveredEvents.splice(0);
  }
  official() {
    return this.completion && this.state.tick >= this.completion.tick ? this.completion.clearance : { cleared: false, reason: "Presentation has not reached authoritative completion" };
  }
  metrics() {
    return { version: "p1.5-playable-v1", mode: this.mode, presentedTick: this.state.tick, status: this.state.status, checksum: this.phase === "finished" ? this.completion?.checksum : null, official: this.phase === "finished" ? this.completion?.clearance : null, buffer: { phase: this.phase, lead: this.lead, frames: this.frames.size, events: this.eventQueue.length }, commands: [...this.commands.values()], telemetry: this.telemetry, worker: this.phase === "finished" ? this.completion?.metrics : null };
  }
  shutdown() {
    clearTimeout(this.readyTimer);
    this.pauseReject?.(Error("Race reset"));
    this.stepReject?.(Error("Race reset"));
    this.rejectReady(Error("Race reset before readiness"));
    if (this.url) URL.revokeObjectURL(this.url);
    this.worker?.terminate();
    this.phase = "closed";
    for (const c of this.commands.values()) if (["sent", "received", "accepted-queued"].includes(c.status)) c.status = "abandoned-with-race";
  }
}
export {
  BufferedSession,
  bufferConfig
};
