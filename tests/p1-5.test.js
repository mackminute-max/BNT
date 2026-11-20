import test from "node:test";
import assert from "node:assert/strict";
import { createRace, step, issueSign, capture, digest } from "../src/sim/race.js";
import { raceSetup } from "../src/prototype/session.js";
import { verifyReplay } from "../src/replay/replay.js";
import { checkpointRace, restoreRace } from "../src/sim/foundation/checkpoint.js";
import { BUFFERED_SIGN_ACTION } from "../src/ai/buffered-signs.js";
import { NativeWorkerHost } from "../src/prototype/buffered/worker.js";
import { BufferedSession } from "../src/prototype/buffered/client.js";
function marker(s, name = "Conserve Strength", viewTime = 0, preStart = true) {
  const order = s.commands.length;
  assert.equal(issueSign(s, "queue", name), true);
  const e = s.events.find((e2) => e2.type === "RACE_STARTED");
  const payload = { version: 1, sign: name, queueOrder: order, viewTick: 0, viewTime, boundaryEventId: e.id, preStart };
  return { payload, accepted: issueSign(s, BUFFERED_SIGN_ACTION, payload) };
}
const state = () => createRace(raceSetup({ fieldSize: 1, pacing: "tactical", personality: "balanced" }).setup);
test("P1.5 delayed request activates only at natural decision and schema1 replay/old checkpoint container restore exactly", () => {
  const s = state();
  for (let i = 0; i < 21; i++) step(s);
  const r = s.entrants[0], next = r.ai.nextDecision, oldEval = r.ai.evaluation, { accepted } = marker(s);
  assert.ok(accepted);
  const cp = checkpointRace(s, { profileId: "p", careerId: "c", instanceId: "i", raceId: "r" }), restored = restoreRace(cp);
  while (s.tick <= next) {
    step(s);
    step(restored);
  }
  assert.equal(r.signs.active, "Conserve Strength");
  const event = s.events.find((e) => e.type === "SIGN_ACTIVATED");
  assert.equal(event.tick, next);
  assert.equal(event.effects.mode, BUFFERED_SIGN_ACTION);
  assert.equal(r.ai.evaluation, oldEval + 1);
  assert.equal(r.signs.remaining, 2);
  assert.equal(digest(s), digest(restored));
  assert.equal(capture(s).schema, 1);
  assert.equal(verifyReplay(capture(s)).checksum, digest(s));
});
test("P1.5 invalid/expired delay proofs cannot activate; cancellation/supersession preserves opportunity rules", () => {
  for (const invalid of ["expired", "outside", "cancel"]) {
    const s = state();
    for (let i = 0; i < (invalid === "expired" ? 61 : 21); i++) step(s);
    const { accepted } = marker(s, "Conserve Strength", invalid === "outside" ? s.time : 0, invalid !== "outside");
    if (invalid === "cancel") {
      assert.ok(accepted);
      issueSign(s, "cancel");
    } else assert.equal(accepted, false);
    for (let i = 0; i < 20; i++) step(s);
    assert.equal(s.events.some((e) => e.type === "SIGN_ACTIVATED" && e.effects.mode === BUFFERED_SIGN_ACTION), false);
    assert.equal(s.entrants[0].signs.remaining, 2);
  }
});
test("P1.5 replacing delayed queue never activates the superseded order or spends activation uses", () => {
  const s = state();
  for (let i = 0; i < 21; i++) step(s);
  marker(s, "Push the Pace");
  issueSign(s, "queue", "Conserve Strength");
  for (let i = 0; i < 20; i++) step(s);
  assert.equal(s.events.some((e) => e.type === "SIGN_ACTIVATED" && e.effects.mode === BUFFERED_SIGN_ACTION), false);
  assert.equal(s.entrants[0].signs.remaining, 1);
  assert.equal(verifyReplay(capture(s)).checksum, digest(s));
});
function host(options = { fieldSize: 1, pacing: "tactical" }) {
  const messages = [], jobs = [], h = new NativeWorkerHost((m) => messages.push(structuredClone(m)), (fn) => jobs.push(fn));
  let seq = 0;
  const send = (type, p = {}) => h.receive({ version: 1, generation: "test", seq: ++seq, type, ...p }), flush = () => {
    let n = 0;
    while (jobs.length) {
      jobs.shift()();
      if (n++ > 1e3) throw Error("Unbounded worker");
    }
  };
  send("prepare", { options });
  return { h, messages, send, flush };
}
test("P1.5 worker pre-roll is bounded and ordinary inputs exactly match native execution", () => {
  const x = host(), s = createRace(x.h.setup);
  x.send("command", { commandId: 1, action: "queue", sign: "Push the Pace", view: { tick: 0, time: 0 } });
  issueSign(s, "queue", "Push the Pace");
  x.send("run");
  x.flush();
  assert.equal(x.h.state.tick, 20);
  assert.ok(x.h.state.time <= 1 + 1e-9);
  for (let i = 0; i < 20; i++) step(s);
  assert.equal(digest(x.h.state), digest(s));
  assert.ok(x.messages.filter((m) => m.type === "events").every((m) => m.events.length <= 64));
  x.send("pause");
  assert.equal(x.h.running, false);
});
test("P1.5 duplicate/conflicting commands, gaps, stale generations and full budget are explicit", () => {
  const x = host(), view = { tick: 0, time: 0 };
  for (let i = 1; i <= 4; i++) x.send("command", { commandId: i, action: "queue", sign: "Push the Pace", view });
  assert.equal(x.h.state.entrants[0].signs.remaining, 0);
  const n = x.h.state.commands.length;
  x.send("command", { commandId: 3, action: "queue", sign: "Push the Pace", view });
  assert.equal(x.h.state.commands.length, n);
  x.send("command", { commandId: 3, action: "queue", sign: "Conserve Strength", view });
  assert.match(x.messages.at(-1).reason, /Conflicting/);
  x.h.receive({ version: 1, generation: "stale", seq: 100, type: "step" });
  assert.equal(x.h.state.tick, 0);
  x.h.receive({ version: 1, generation: "test", seq: 100, type: "step" });
  assert.equal(x.messages.at(-1).type, "error");
});
test("P1.5 no future event or frame is presented, countdown is wall time and replaying a tail is not native step", async () => {
  let h;
  const jobs = [], w = { postMessage: (m) => queueMicrotask(() => h.receive(m)), terminate() {
  } };
  h = new NativeWorkerHost((m) => queueMicrotask(() => w.onmessage({ data: structuredClone(m) })), (f) => jobs.push(f));
  const c = new BufferedSession({ fieldSize: 1, pacing: "tactical" }, { source: "fake", workerFactory: () => w });
  await c.ready;
  c.start();
  await new Promise((r) => setImmediate(r));
  while (jobs.length) jobs.shift()();
  await new Promise((r) => setImmediate(r));
  assert.equal(c.state.tick, 0);
  assert.equal(c.drainEvents().some((e) => e.type === "RACE_STARTED"), false);
  c.advancePresentation(2.9, 4);
  assert.equal(c.state.tick, 0);
  c.advancePresentation(0.11, 4);
  c.advancePresentation(0.1, 1);
  assert.equal(c.state.tick, 2);
  assert.ok(c.drainEvents().every((e) => e.time <= c.state.time + 1e-9));
  const pause = c.pause();
  await pause;
  assert.ok(c.workerPaused);
  assert.equal(c.steppingReady, false);
  await assert.rejects(async () => c.step(), /buffered tail/);
  const tick = h.state.tick;
  c.tail();
  c.advancePresentation(2, 1);
  assert.equal(h.state.tick, tick);
  assert.ok(c.steppingReady);
  await c.step();
  assert.equal(h.state.tick, tick + 1);
  assert.equal(c.state.tick, tick + 1);
  c.shutdown();
});
test("P1.5 worker delayed/normal acknowledgments are native results, not retroactive frame edits", () => {
  const x = host();
  x.send("run");
  x.flush();
  const before = capture(x.h.state);
  x.send("command", { commandId: 1, action: "queue", sign: "Conserve Strength", view: { tick: 0, time: 0 } });
  assert.ok(x.h.state.events.some((e) => e.type === "SIGN_DELAY_REQUESTED"));
  assert.deepEqual(x.h.state.events.slice(0, before.events.length), before.events);
  x.send("present-start");
  x.send("credit", { view: { tick: 2, time: 0.1 } });
  x.flush();
  assert.ok(x.messages.some((m) => m.type === "command-status" && m.status === "activated-delayed"));
  assert.equal(x.h.state.entrants[0].signs.remaining, 2);
  assert.equal(verifyReplay(capture(x.h.state)).checksum, digest(x.h.state));
});
test("P1.5 a presented boundary already consumed cannot use the delay exception", () => {
  const x = host();
  x.send("run");
  x.flush();
  x.send("present-start");
  x.send("command", { commandId: 1, action: "queue", sign: "Conserve Strength", view: { tick: x.h.state.tick, time: x.h.state.time } });
  assert.equal(x.h.state.events.some((e) => e.type === "SIGN_DELAY_REQUESTED"), false);
  assert.equal(x.h.state.entrants[0].signs.remaining, 2);
});
test("P1.5 stale prepare and old-generation pending messages cannot reset another race", () => {
  const x = host();
  const before = digest(x.h.state);
  x.h.receive({ version: 1, generation: "old", seq: 1, type: "prepare", options: { fieldSize: 8 } });
  x.h.receive({ version: 1, generation: "old", seq: 2, type: "command", commandId: 1, action: "queue", sign: "Push the Pace", view: { tick: 0, time: 0 } });
  assert.equal(digest(x.h.state), before);
});
test("P1.5 bounded capacity and protocol gap failures stop explicitly without fictional progression", () => {
  const x = host();
  x.send("run");
  x.flush();
  const c = new BufferedSession({}, { source: null });
  c.ready.catch(() => {
  });
  c.generation = "test";
  c.phase = "ready";
  c.outputSeq = 0;
  assert.throws(() => c.receive({ generation: "test", version: 1, seq: 2, type: "frame" }), /Gap/);
  c.config.maxEvents = 1;
  c.receive({ generation: "test", version: 1, seq: 1, type: "events", events: [{ id: 1, time: 0, presentationTick: 0 }] });
  assert.throws(() => c.receive({ generation: "test", version: 1, seq: 2, type: "events", events: [{ id: 2, time: 0, presentationTick: 0 }] }), /capacity/);
});
for (const course of ["rally-short", "rally-medium", "rally-long"]) test("P1.5 " + course + " delayed Sign Points use native identity and replay", () => {
  const s = createRace(raceSetup({ course, fieldSize: 1, pacing: "tactical", personality: "balanced" }).setup);
  let e;
  while (!e && s.tick < 5e3) {
    step(s);
    e = s.events.find((e2) => e2.type === "CHECKPOINT_CROSSED");
  }
  assert.ok(e);
  const order = s.commands.length;
  issueSign(s, "queue", "Conserve Strength");
  const time = Math.max(0, e.time - s.config.dt);
  assert.equal(issueSign(s, BUFFERED_SIGN_ACTION, { version: 1, sign: "Conserve Strength", queueOrder: order, viewTick: Math.floor(time / s.config.dt), viewTime: time, boundaryEventId: e.id, preStart: false }), true);
  for (let i = 0; i < 20; i++) step(s);
  assert.ok(s.events.some((e2) => e2.type === "SIGN_ACTIVATED" && e2.effects.mode === BUFFERED_SIGN_ACTION));
  assert.equal(verifyReplay(capture(s)).checksum, digest(s));
});
test("P1.5 invalid presentation configuration rejects and client packet conflicts are explicit", () => {
  assert.throws(() => new BufferedSession({}, { source: "fake", config: { minLead: 2 } }), /configuration/);
  const c = new BufferedSession({}, { source: null });
  c.ready.catch(() => {
  });
  c.generation = "test";
  c.phase = "ready";
  const packet = { generation: "test", version: 1, seq: 1, type: "running" };
  c.receive(packet);
  c.receive(packet);
  assert.throws(() => c.receive({ ...packet, type: "paused" }), /Conflicting/);
});
test("P1.5 worker forbids native step while future presentation tail remains", () => {
  const x = host();
  x.send("run");
  x.flush();
  x.send("pause");
  const tick = x.h.state.tick;
  x.send("step", { view: { tick: 0, time: 0 } });
  assert.equal(x.h.state.tick, tick);
  assert.match(x.messages.at(-1).message, /buffered tail/);
});
test("P1.5 cancellation and invalid Pure attack have native dispositions without refunds", () => {
  const x = host(), view = { tick: 0, time: 0 };
  x.send("command", { commandId: 1, action: "queue", sign: "Conserve Strength", view });
  x.send("command", { commandId: 2, action: "cancel", view });
  assert.equal(x.h.commands.get(1).ack.status, "canceled");
  assert.equal(x.h.state.entrants[0].signs.remaining, 2);
  x.send("command", { commandId: 3, action: "queue", sign: "Engage Rivals", view });
  assert.equal(x.h.commands.get(3).ack.status, "rejected");
  assert.equal(x.h.state.entrants[0].signs.remaining, 2);
});
test("P1.5 native checkpoint preparation skips already historical presentation events and preserves next native step", () => {
  const s = state();
  for (let i = 0; i < 98; i++) step(s);
  const cp = checkpointRace(s, { profileId: "p", careerId: "c", instanceId: "i", raceId: "r" }), messages = [], h = new NativeWorkerHost((m) => messages.push(m));
  h.receive({ version: 1, generation: "restored", seq: 1, type: "prepare", options: { fieldSize: 1 }, checkpoint: cp });
  assert.equal(messages[0].eventCursor, s.events.length);
  assert.equal(messages.some((x) => x.type === "events"), false);
  h.receive({ version: 1, generation: "restored", seq: 2, type: "step", view: { tick: s.tick, time: s.time } });
  step(s);
  assert.equal(digest(h.state), digest(s));
});
for (const personality of ["balanced", "headstrong"]) test("P1.5 delayed Conserve preserves " + personality + " native obedience at natural cadence", () => {
  const x = host({ fieldSize: 1, pacing: "tactical", personality });
  x.send("run");
  x.flush();
  const next = x.h.state.entrants[0].ai.nextDecision;
  x.send("command", { commandId: 1, action: "queue", sign: "Conserve Strength", view: { tick: 0, time: 0 } });
  x.send("present-start");
  while (x.h.state.tick <= next) {
    x.send("credit", { view: { tick: x.h.state.tick, time: x.h.state.time } });
    x.flush();
  }
  const r = x.h.state.entrants[0];
  assert.equal(r.signs.active, "Conserve Strength");
  assert.equal(r.ai.diagnostics.directive.decision, personality === "headstrong" ? "Resisting" : "Obeying");
  assert.equal(r.signs.remaining, 2);
  assert.equal(verifyReplay(capture(x.h.state)).checksum, digest(x.h.state));
});
test("P1.5 delayed instruction cannot override native physical inability", async () => {
  const { paceDirective } = await import("../src/ai/directives.js");
  const s = state();
  for (let i = 0; i < 21; i++) step(s);
  marker(s, "Push the Pace");
  const r = s.entrants[0];
  r.control = "Out of Control";
  const { pendingDelay } = await import("../src/ai/buffered-signs.js");
  const { activateSign } = await import("../src/ai/signs.js");
  activateSign(s, r, pendingDelay(s, r));
  assert.equal(paceDirective(s, r, []).decision, "Constrained");
  assert.equal(paceDirective(s, r, []).selected, "Conserve");
  assert.equal(r.signs.remaining, 2);
});
