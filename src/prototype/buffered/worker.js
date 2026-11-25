import { raceSetup } from "../session.js";
import { createRace, step, issueSign, capture, digest, classification } from "../../sim/race.js";
import { clearedNativeResult, checkpointRace, restoreRace } from "../../sim/foundation/checkpoint.js";
import { eligibleBoundary, BUFFERED_SIGN_ACTION } from "../../ai/buffered-signs.js";
import { canonical } from "../../core/determinism.js";
import { staticView, frameView, eventView } from "./projection.js";
const protocolVersion = 1;
class NativeWorkerHost {
  constructor(send, schedule = (fn) => setTimeout(fn, 0)) {
    this.sendRaw = send;
    this.schedule = schedule;
    this.generation = null;
    this.output = 0;
    this.lastInput = 0;
    this.inputPackets = /* @__PURE__ */ new Map();
    this.commands = /* @__PURE__ */ new Map();
    this.refs = /* @__PURE__ */ new Map();
    this.running = false;
    this.scheduled = false;
    this.cursor = 0;
    this.revision = 0;
    this.viewTime = 0;
    this.goal = 0;
    this.beforeSignal = true;
    this.metrics = { steps: 0, stepMs: 0, maxStepMs: 0, digestMs: [], messages: 0, bytes: 0 };
  }
  send(type, payload = {}) {
    const message = { version: 1, generation: this.generation, seq: ++this.output, type, sentEpoch: performance.timeOrigin + performance.now(), ...payload };
    this.metrics.messages++;
    this.metrics.bytes += new TextEncoder().encode(JSON.stringify(message)).length;
    const t = performance.now();
    this.sendRaw(message);
    this.metrics.postMs = (this.metrics.postMs ?? 0) + performance.now() - t;
  }
  fail(error) {
    this.running = false;
    this.send("error", { message: error.message });
  }
  receive(m) {
    try {
      if (!m || m.version !== 1 || !Number.isSafeInteger(m.seq) || m.seq < 1) throw Error("Invalid worker protocol");
      if (m.type === "prepare") {
        if (this.generation !== null) return;
        this.leadConfig = m.buffer ?? { targetLead: 1, maxLead: 2 };
        if (!Number.isFinite(this.leadConfig.targetLead) || !Number.isFinite(this.leadConfig.maxLead) || this.leadConfig.targetLead < 0.05 || this.leadConfig.targetLead > this.leadConfig.maxLead || this.leadConfig.maxLead > 2) throw Error("Invalid lead bounds");
        this.generation = m.generation;
        this.output = 0;
        this.lastInput = m.seq;
        this.inputPackets.set(m.seq, JSON.stringify(m));
        this.running = false;
        this.completed = false;
        this.commands.clear();
        this.refs.clear();
        this.cursor = 0;
        this.revision = 0;
        this.viewTime = 0;
        this.goal = 0;
        this.beforeSignal = true;
        const x = raceSetup(m.options);
        this.state = m.checkpoint ? restoreRace(m.checkpoint) : createRace(x.setup);
        this.setup = this.state.setup;
        if (m.checkpoint) {
          this.cursor = this.state.events.length;
          this.viewTime = this.state.time;
          this.beforeSignal = false;
        }
        this.send("ready", { base: staticView(this.state), setup: this.setup, eventCursor: this.cursor, changes: x.changes, dt: this.state.config.dt });
        this.publish();
        return;
      }
      if (m.generation !== this.generation) return;
      if (m.seq <= this.lastInput) {
        const cached = this.inputPackets.get(m.seq);
        if (cached !== void 0 && cached !== JSON.stringify(m)) throw Error("Conflicting duplicate worker input sequence");
        if (cached !== void 0 && m.type === "command" && this.commands.has(m.commandId)) this.command(m);
        return;
      }
      if (m.seq !== this.lastInput + 1) throw Error("Gap in worker input messages");
      this.lastInput = m.seq;
      this.inputPackets.set(m.seq, JSON.stringify(m));
      if (this.inputPackets.size > 32) this.inputPackets.delete(this.inputPackets.keys().next().value);
      if (m.type === "command") this.command(m);
      else if (m.type === "run") {
        this.running = true;
        this.goal = this.viewTime + this.leadConfig.targetLead;
        this.pump();
        this.send("running");
      } else if (m.type === "credit") {
        this.checkView(m.view);
        this.viewTime = m.view.time;
        this.goal = this.viewTime + this.leadConfig.targetLead;
        this.pump();
      } else if (m.type === "present-start") {
        this.beforeSignal = false;
      } else if (m.type === "pause") {
        this.running = false;
        this.send("paused", { tick: this.state.tick });
      } else if (m.type === "step") {
        if (this.running) throw Error("Worker pause confirmation required");
        this.checkView(m.view);
        if (m.view.tick !== this.state.tick) throw Error("Present buffered tail before native step");
        if (!this.advance()) throw Error("Race cannot step");
        this.publish();
        this.send("stepped", { tick: this.state.tick });
      } else if (m.type === "checkpoint") {
        this.send("checkpoint", { requestId: m.requestId, record: checkpointRace(this.state, m.identity) });
      } else if (m.type === "export") {
        this.send("export", { requestId: m.requestId, replay: capture(this.state), metrics: this.metrics, classification: classification(this.state) });
      } else if (m.type === "shutdown") {
        this.running = false;
        this.send("shutdown");
      } else throw Error("Unknown worker message");
    } catch (error) {
      this.fail(error);
    }
  }
  checkView(v) {
    const ref = this.refs.get(v?.tick);
    if (!ref || !Number.isFinite(v.time) || v.time < this.viewTime - 1e-9 || v.time < ref.time - 1e-9 || v.time > ref.time + this.state.config.dt + 1e-9 || v.time > this.state.time + 1e-9 || this.state.time - v.time > 2 + this.state.config.dt) throw Error("Stale or invalid presented reference");
    return ref;
  }
  command(m) {
    const key = m.commandId, encoded = canonical({ action: m.action, sign: m.sign, view: m.view });
    if (!Number.isSafeInteger(key) || key < 1) throw Error("Invalid command sequence");
    const old = this.commands.get(key);
    if (old) {
      if (old.encoded !== encoded) {
        this.send("command-status", { commandId: key, status: "rejected", conflict: true, reason: "Conflicting command identity" });
        return;
      }
      this.send("command-status", { ...old.ack, duplicate: true });
      return;
    }
    if (this.commands.size >= 1024) throw Error("Command limit reached");
    this.send("command-status", { commandId: key, status: "received" });
    let ack, didAccept = false;
    try {
      if (!["queue", "cancel", "lower"].includes(m.action)) throw Error("Unsupported player command");
      const ref = this.checkView(m.view);
      const s = this.state, r = s.entrants.find((r2) => r2.id === s.playerId), order = s.commands.length;
      const accepted = issueSign(s, m.action, m.sign);
      didAccept = accepted;
      if (!accepted) {
        ack = { commandId: key, status: "rejected", reason: s.events.at(-1)?.effects.reason ?? "Native race cannot accept commands", acceptanceTick: s.tick };
      } else {
        if (m.action === "queue") {
          for (const value of this.commands.values()) if (value.ack.status === "accepted-queued") {
            value.ack = { ...value.ack, status: "superseded" };
            this.send("command-status", value.ack);
          }
          const first = eligibleBoundary(s, { viewTick: m.view.tick, viewTime: m.view.time, preStart: this.beforeSignal });
          if (first&&r.progressionContext?.version!==2) {
            const p = { version: 1, sign: m.sign, queueOrder: order, viewTick: m.view.tick, viewTime: m.view.time, boundaryEventId: first.id, preStart: this.beforeSignal };
            if (!issueSign(s, BUFFERED_SIGN_ACTION, p)) throw Error("Validated delay request rejected");
          }
        }
        if (m.action === "cancel") {
          for (const value of this.commands.values()) if (value.ack.status === "accepted-queued") {
            value.ack = { ...value.ack, status: "canceled" };
            this.send("command-status", value.ack);
          }
        }
        ack = { commandId: key, status: m.action === "queue" ? "accepted-queued" : "accepted", acceptanceTick: s.tick, acceptanceTime: s.time, viewTick: m.view.tick, queueOrder: order, remaining: r.signs.remaining };
      }
      this.revision++;
      this.publish();
    } catch (error) {
      ack = { commandId: key, status: didAccept ? "accepted-blocked" : "rejected", reason: error.message, acceptanceTick: this.state.tick };
      if (didAccept) this.fail(Error("Accepted input blocked; abandon or inspect native checkpoint: " + error.message));
    }
    this.commands.set(key, { encoded, ack });
    this.send("command-status", ack);
  }
  advance() {
    const s = this.state;
    if (["Ended", "Stalled", "Error"].includes(s.status)) return false;
    const t = performance.now(), n = s.checkpoints.length;
    step(s);
    const ms = performance.now() - t;
    this.metrics.lastTickMs = ms;
    this.metrics.steps++;
    this.metrics.stepMs += ms;
    this.metrics.maxStepMs = Math.max(this.metrics.maxStepMs, ms);
    if (s.checkpoints.length > n) {
      this.metrics.digestMs.push({ tick: s.tick, ms });
      if (this.metrics.digestMs.length > 512) this.metrics.digestMs.shift();
    }
    this.revision = 0;
    return true;
  }
  publish() {
    const s = this.state, events = s.events.slice(this.cursor).map((e) => ({ ...eventView(e), presentationTick: s.tick }));
    this.cursor = s.events.length;
    for (const e of events) if (e.type === "SIGN_ACTIVATED") {
      for (const value of this.commands.values()) if (value.ack.status === "accepted-queued" && value.ack.queueOrder !== void 0) {
        const queued = s.commands[value.ack.queueOrder];
        if (queued?.sign === e.effects.sign) {
          value.ack = { ...value.ack, status: e.effects.mode === BUFFERED_SIGN_ACTION ? "activated-delayed" : "activated-normal", activationTick: e.tick, activationTime: e.time, visibleFromTick: e.presentationTick };
          this.send("command-status", value.ack);
          break;
        }
      }
    }
    for (let i = 0; i < events.length; i += 64) this.send("events", { events: events.slice(i, i + 64) });
    const frame = frameView(s, this.revision);
    this.refs.set(frame.tick, { time: frame.time, revision: frame.revision });
    while (this.refs.size > 64) this.refs.delete(this.refs.keys().next().value);
    this.send("frame", { frame, eventWatermark: this.cursor, worker: { tick: s.tick, lastTickMs: this.metrics.lastTickMs ?? 0, maxTickMs: this.metrics.maxStepMs, lastDigest: this.metrics.digestMs.at(-1) ?? null } });
    if (["Ended", "Stalled", "Error"].includes(s.status) && !this.completed) {
      this.completed = true;
      this.running = false;
      for (const value of this.commands.values()) if (value.ack.status === "accepted-queued") {
        value.ack = { ...value.ack, status: "not-activated", reason: "Native race ended before a legal activation" };
        this.send("command-status", value.ack);
      }
      let clearance;
      try {
        clearance = { cleared: true, ...clearedNativeResult(s) };
      } catch (error) {
        clearance = { cleared: false, reason: error.message };
      }
      this.send("complete", { tick: s.tick, time: s.time, clearance, checksum: digest(s), metrics: this.metrics });
    }
  }
  pump() {
    if (this.scheduled || !this.running) return;
    this.scheduled = true;
    this.schedule(() => {
      this.scheduled = false;
      if (!this.running) return;
      try {
        let n = 0;
        while (n++ < 4 && this.state.time + this.state.config.dt <= Math.min(this.goal, this.viewTime + this.leadConfig.maxLead) + 1e-9) {
          if (!this.advance()) break;
          this.publish();
        }
        if (this.running && this.state.time + this.state.config.dt <= Math.min(this.goal, this.viewTime + this.leadConfig.maxLead) + 1e-9) this.pump();
      } catch (error) {
        this.fail(error);
      }
    });
  }
}
if (typeof self !== "undefined" && typeof document === "undefined") {
  const host = new NativeWorkerHost((m) => self.postMessage(m));
  self.onmessage = (e) => host.receive(e.data);
}
export {
  NativeWorkerHost,
  protocolVersion
};
