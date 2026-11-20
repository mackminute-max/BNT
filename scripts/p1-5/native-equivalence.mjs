import { NativeWorkerHost } from "../../src/prototype/buffered/worker.js";
import { raceSetup } from "../../src/prototype/session.js";
import * as current from "../../src/sim/race.js";
import * as ref from "/tmp/bnt-p15-reference/src/sim/race.js";
import { canonical } from "../../src/core/determinism.js";
import { writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
const rows = [];
for (const [course, format, fieldSize] of [["oval", "Pure", 4], ["oval", "Combat", 8], ["C01", "Pure", 8], ["C01", "Combat", 8], ["rally-short", "Combat", 8], ["rally-long", "Combat", 8]]) {
  const jobs = [], options = { course, format, fieldSize, seed: 145, pacing: "tactical", weather: "Clear", laps: 2 }, h = new NativeWorkerHost(() => {
  }, (f) => jobs.push(f));
  let seq = 0;
  const send = (type, p = {}) => h.receive({ version: 1, generation: "native-proof", seq: ++seq, type, ...p });
  send("prepare", { options });
  const a = ref.createRace(h.setup);
  ref.issueSign(a, "queue", "Push the Pace");
  send("command", { commandId: 1, action: "queue", sign: "Push the Pace", view: { tick: 0, time: 0 } });
  send("run");
  let n = 0;
  while (!["Ended", "Stalled", "Error"].includes(h.state.status) && n++ < 24e3) {
    while (jobs.length) jobs.shift()();
    while (a.tick < h.state.tick) ref.step(a);
    assert.equal(current.digest(h.state), ref.digest(a));
    send("credit", { view: { tick: h.state.tick, time: h.state.time } });
  }
  assert.equal(h.state.status, a.status);
  assert.deepEqual(current.capture(h.state), ref.capture(a));
  const hash = createHash("sha256").update(canonical(current.capture(h.state))).digest("hex");
  rows.push({ course, format, fieldSize, ticks: a.tick, status: a.status, checksum: ref.digest(a), fullReplaySHA256: hash, exactReplay: true });
  console.log(rows.at(-1));
  await writeFile("/workspace/deliverables/bnt-p1-5/evidence/native-equivalence.json", JSON.stringify({ reference: "3b0d043d0ca3b8e06bd0894ebff37d89be76e97e", rows }, null, 2));
}
