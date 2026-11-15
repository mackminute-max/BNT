import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createRace,
  step,
  run,
  capture,
  digest,
  issueSign,
  assertState,
  classification,
} from "../src/sim/race.js";
import { queueOverride, editRU } from "../src/dev/overrides.js";
import {
  configuration,
  parseConfiguration,
  editConfiguration,
  saveConfiguration,
  loadConfiguration,
} from "../src/dev/configuration.js";
import {
  verifyReplay,
  startReplay,
  advanceReplay,
} from "../src/replay/replay.js";
import { Commentary, narrative } from "../src/reporting/commentary.js";
import { statistics, results } from "../src/reporting/results.js";
import { batch, parseSeeds } from "../src/dev/batch.js";
import { entrant } from "./fixtures.js";
import { retire } from "../src/sim/consequences.js";
const one = () =>
  createRace({
    entrants: [entrant("A")],
    overrides: { laps: 1 },
    consequence: { incidentRate: 0 },
    checkpointInterval: 20,
  });
test("T22 paused live override queues without mutation, applies at boundary with old/new provenance", () => {
  const s = one(),
    old = s.config.speedReference;
  queueOverride(
    s,
    { target: "config", path: "speedReference", value: 21 },
    { paused: true },
  );
  assert.equal(s.config.speedReference, old);
  assert.equal(s.tick, 0);
  step(s);
  assert.equal(s.config.speedReference, 21);
  const e = s.events.find((e) => e.type === "OVERRIDE_APPLIED");
  assert.equal(e.time, 0);
  assert.equal(e.effects.old, old);
  assert.equal(e.effects.value, 21);
  assert.equal(e.effects.configRevision, 1);
  assert.equal(s.commands[0].type, "override");
});
test("Live edits reject running, unresolved, structural and invalid changes without corrupting state", () => {
  const s = one(),
    before = digest(s);
  assert.throws(() =>
    queueOverride(s, { target: "config", path: "speedReference", value: 20 }),
  );
  s.resolving = true;
  assert.throws(() =>
    queueOverride(
      s,
      { target: "config", path: "speedReference", value: 20 },
      { paused: true },
    ),
  );
  s.resolving = false;
  for (const edit of [
    { target: "config", path: "lanes", value: 3 },
    { target: "config", path: "dt", value: 0.1 },
    { target: "ru", id: "A", path: "driver.driving", value: 999 },
    { target: "autonomous", path: "signUses", value: 9 },
  ])
    assert.throws(() => queueOverride(s, edit, { paused: true }));
  assert.equal(digest(s), before);
});
test("Individual and bulk component edits validate every field and refresh derived performance", () => {
  const s = createRace({ consequence: { incidentRate: 0 } }),
    before = s.entrants[0].derived.maxSpeed;
  queueOverride(
    s,
    { target: "ru", id: "all", path: "beasts.*.speed", value: 95 },
    { paused: true },
  );
  step(s);
  assert.ok(s.entrants.every((r) => r.ru.beasts.every((b) => b.speed === 95)));
  assert.ok(s.entrants[0].derived.maxSpeed > before);
  assert.equal(s.events.filter((e) => e.type === "OVERRIDE_APPLIED").length, 8);
  const edited = editRU(s.entrants[0].ru, "driver.personality.caution", 75);
  assert.equal(edited.ru.driver.personality.caution, 75);
});
test("T23/E19 replay reconstructs paused signs, bulk overrides, checkpoints and exact final state", () => {
  const s = one();
  issueSign(s, "queue", "Conserve Strength");
  for (let i = 0; i < 30; i++) step(s);
  queueOverride(
    s,
    { target: "ru", id: "A", path: "beasts.*.power", value: 70 },
    { paused: true },
  );
  queueOverride(
    s,
    { target: "autonomous", path: "signStrength", value: 8 },
    { paused: true },
  );
  issueSign(s, "queue", "Push the Pace");
  run(s);
  const record = JSON.parse(JSON.stringify(capture(s)));
  const verified = verifyReplay(record);
  assert.equal(verified.checksum, digest(s));
  assert.ok(verified.checkpoints > 2);
  assert.deepEqual(verified.state.events, s.events);
});
test("Partial replay preserves unstepped signs and pending override transport", () => {
  const s = one();
  step(s);
  issueSign(s, "queue", "Conserve Strength");
  queueOverride(
    s,
    { target: "config", path: "speedReference", value: 20 },
    { paused: true },
  );
  const verified = verifyReplay(capture(s));
  assert.equal(digest(verified.state), digest(s));
  assert.equal(verified.state.tick, 1);
});
test("Replay reports the first event divergence and checkpoint corruption, never silently falls back", () => {
  const s = run(one()),
    record = capture(s);
  const bad = structuredClone(record);
  bad.events[0].effects.referenceDrivers = true;
  assert.throws(
    () => verifyReplay(bad),
    (e) => e.details?.category === "event" && e.details.eventId === 1,
  );
  const checkpoint = structuredClone(record);
  checkpoint.checkpoints[1].checksum = "00000000";
  assert.throws(
    () => verifyReplay(checkpoint),
    (e) => e.details?.category === "checkpoint",
  );
  const wrong = structuredClone(record);
  wrong.version = "old";
  assert.throws(() => startReplay(wrong), /Unsupported/);
});
test("Replay pause/step/restart uses the same authoritative engine", () => {
  const record = capture(run(one())),
    a = startReplay(record);
  advanceReplay(a);
  assert.equal(a.state.tick, 1);
  const b = startReplay(record);
  assert.equal(b.state.tick, 0);
  while (!a.done) advanceReplay(a);
  assert.equal(digest(a.state), record.checksum);
});
test("E14/E15 portable configuration validates, preserves good state and survives denied storage", () => {
  const doc = configuration(one().setup),
    text = JSON.stringify(doc);
  assert.deepEqual(parseConfiguration(text), doc);
  const bad = JSON.parse(text);
  bad.setup.overrides.lanes = -1;
  assert.throws(() => parseConfiguration(JSON.stringify(bad)));
  assert.deepEqual(parseConfiguration(text), doc);
  const denied = {
    setItem() {
      throw new Error("denied");
    },
    getItem() {
      throw new Error("denied");
    },
  };
  assert.equal(saveConfiguration(denied, doc).ok, false);
  assert.throws(() => loadConfiguration(denied), /Storage unavailable/);
  const map = new Map(),
    storage = { setItem: (k, v) => map.set(k, v), getItem: (k) => map.get(k) };
  assert.equal(saveConfiguration(storage, doc).ok, true);
  assert.deepEqual(loadConfiguration(storage), doc);
});
test("Configuration editor supports lineup geometry and independent/bulk attributes without touching its input", () => {
  const doc = configuration({}),
    next = editConfiguration(doc, {
      id: "all",
      path: "driver.driving",
      value: 90,
    });
  assert.ok(next.setup.entrants.every((e) => e.ru.driver.driving === 90));
  assert.notEqual(doc.setup.entrants[0].ru.driver.driving, 90);
  next.setup.overrides.innerRadius = 50;
  assert.equal(configuration(next.setup).setup.overrides.innerRadius, 50);
  assert.throws(() => configuration({ ...doc.setup, unknown: true }));
});
test("E18 commentary facts have event provenance and never alter authoritative state or RNG", () => {
  const a = one(),
    b = one(),
    radio = new Commentary();
  while (a.status !== "Ended") {
    step(a);
    radio.consume(a.events);
    step(b);
  }
  assert.equal(digest(a), digest(b));
  assert.ok(radio.lines.length > 0);
  assert.ok(radio.lines.every((l) => a.events.some((e) => e.id === l.eventId)));
  assert.deepEqual(
    narrative([
      { id: 1, type: "AI_DECISION", time: 0, participants: [], effects: {} },
    ]),
    [],
  );
  const disabled = new Commentary();
  assert.deepEqual(disabled.consume(a.events, { enabled: false }), []);
});
test("Official, narrative and technical results use authoritative outcomes and component data", () => {
  const s = run(one()),
    report = results(s);
  assert.deepEqual(report.official, classification(s));
  assert.equal(report.technical.finishes, 1);
  assert.equal(
    report.technical.entrants[0].fatigue[0],
    s.entrants[0].ru.beasts[0].fatigue,
  );
  assert.ok(report.narrative.some((e) => e.type === "RU_FINISHED"));
});
test("Batch yields, uses identical seeded mechanics and retains completed samples on cancellation", async () => {
  const setup = one().setup;
  let yields = 0;
  const report = await batch(setup, [1, 2], {
    yieldControl: async () => {
      yields++;
    },
  });
  assert.equal(report.completed, 2);
  assert.ok(yields > 2);
  assert.equal(
    report.races[0].checksum,
    digest(run(createRace({ ...setup, seed: 1 }))),
  );
  const controller = new AbortController();
  const cancelled = await batch(setup, [1, 2], {
    signal: controller.signal,
    onProgress: () => controller.abort(),
    yieldControl: async () => {},
  });
  assert.equal(cancelled.completed, 1);
  assert.equal(cancelled.cancelled, true);
  assert.deepEqual(parseSeeds("1-3,8"), [1, 2, 3, 8]);
  assert.throws(() => parseSeeds("5-1"));
});
test("T21/E12 closely queued finishers clear legally with locked times and no occupancy overlap", () => {
  const s = createRace({
    driverMode: "reference",
    entrants: Array.from({ length: 8 }, (_, i) =>
      entrant(`Q${i}`, 0, -0.5 - i, 10),
    ),
    consequence: { incidentRate: 0 },
    overrides: { laps: 1 },
  });
  for (const [i, r] of s.entrants.entries()) {
    r.q = s.track.cells - 0.5 - i;
    r.hasEnteredCourse = true;
    r.completedLaps = 0;
    r.lastCrossingQ = 0;
  }
  while (!["Ended", "Stalled", "Error"].includes(s.status)) {
    step(s);
    assertState(s);
  }
  assert.equal(s.status, "Ended");
  assert.ok(
    s.entrants.every((r) => r.finishTime !== null && r.physical === "Exited"),
  );
  assert.equal(s.events.filter((e) => e.type === "RU_EXITED").length, 8);
  for (const r of s.entrants)
    assert.equal(
      r.finishTime,
      s.events.find(
        (e) => e.type === "RU_FINISHED" && e.participants.includes(r.id),
      ).effects.time,
    );
});
test("Exit blockage preserves wrecks and official finish even if a safeguard ends clearing", () => {
  const s = createRace({
    entrants: [entrant("A", 0), entrant("B", 0, -3)],
    driverMode: "reference",
    overrides: { laps: 1, stallTime: 1 },
    consequence: { incidentRate: 0, damageScale: 0 },
  });
  const [a, b] = s.entrants;
  a.q = s.track.cells + 0.5;
  a.status = "Finished";
  a.physical = "Clearing";
  a.finishTime = 1;
  a.completedLaps = 1;
  b.q = 2.5;
  retire(s, b, "exit blocker");
  for (
    let i = 0;
    i < 200 && !["Ended", "Stalled", "Error"].includes(s.status);
    i++
  )
    step(s);
  assert.equal(a.finishTime, 1);
  assert.equal(a.status, "Finished");
  assert.equal(b.q, 2.5);
  assert.equal(b.physical, "Wreck");
  assert.ok(a.q < 2 + s.track.cells);
  assertState(s);
});

test("E17 different render frame rates use the same fixed ticks and authoritative result", async () => {
  const { advanceFrames } = await import("../src/ui/clock.js");
  const outcomes = [];
  for (const fps of [30, 144]) {
    const s = one(),
      radio = new Commentary();
    let remainder = 0;
    for (let frame = 0; frame < 60 * fps; frame++) {
      remainder = advanceFrames(
        remainder,
        1 / fps,
        1,
        s.config.dt,
        () => step(s),
        () => s.status === "Ended",
      );
      radio.consume(s.events);
    }
    assert.equal(s.status, "Ended");
    outcomes.push(digest(s));
  }
  assert.equal(outcomes[0], outcomes[1]);
});
test("Live weather/incident overrides are replayed, reschedule clocks and validate coefficients", () => {
  const s = one();
  queueOverride(
    s,
    { target: "environment", path: "visibility", value: 0.3 },
    { paused: true },
  );
  queueOverride(
    s,
    { target: "consequence", path: "incidentRate", value: 0.1 },
    { paused: true },
  );
  step(s);
  assert.equal(s.environment.visibility, 0.3);
  assert.ok(Number.isFinite(s.nextIncidentAt));
  run(s);
  assert.equal(verifyReplay(capture(s)).checksum, digest(s));
  assert.throws(() =>
    queueOverride(
      one(),
      { target: "environment", path: "grip", value: -1 },
      { paused: true },
    ),
  );
});
test("Bulk component scope applies only to RUs that actually have the selected team member", () => {
  const a = entrant("A"),
    b = entrant("B", 1);
  b.ru.beasts.pop();
  const doc = configuration({ entrants: [a, b] }),
    edited = editConfiguration(doc, {
      id: "all",
      path: "beasts.1.power",
      value: 90,
    });
  assert.equal(edited.setup.entrants[0].ru.beasts[1].power, 90);
  assert.equal(edited.setup.entrants[1].ru.beasts.length, 1);
  const bad = structuredClone(doc);
  bad.setup.entrants[0].ru.beasts[0].unused = 50;
  assert.throws(() => parseConfiguration(JSON.stringify(bad)));
});

test("Replay rejects removed or duplicated checkpoint evidence", () => {
  const record = capture(run(one())),
    removed = structuredClone(record);
  removed.checkpoints = [];
  assert.throws(
    () => verifyReplay(removed),
    (e) => e.details?.category === "checkpoint coverage",
  );
  const duplicate = structuredClone(record);
  duplicate.checkpoints.splice(1, 0, duplicate.checkpoints[0]);
  assert.throws(() => verifyReplay(duplicate), /Invalid checkpoint/);
});

test("Seed 3 braking-envelope regression completes without an instantaneous target-event cascade", () => {
  for (const format of ["Pure", "Combat"]) {
    const s = run(createRace({ seed: 3, format }));
    assert.equal(s.status, "Ended", JSON.stringify(s.events.at(-1).effects));
    assert.ok(s.diagnostics.maxGroups < s.config.maxSubevents);
    assertState(s);
  }
});

test("Crowd morale affects performance through Nerve without direct interference", () => {
  const a = createRace({
      entrants: [entrant("A")],
      environmentOverrides: { crowdMorale: 0.4 },
      consequence: { incidentRate: 0 },
    }),
    b = createRace({
      entrants: [entrant("A")],
      consequence: { incidentRate: 0 },
    });
  assert.ok(a.entrants[0].derived.control < b.entrants[0].derived.control);
  const ru = entrant("A");
  ru.ru.driver.nerve = 100;
  const steady = createRace({
    entrants: [ru],
    environmentOverrides: { crowdMorale: 0.4 },
    consequence: { incidentRate: 0 },
  });
  assert.equal(steady.entrants[0].derived.morale, 1);
  step(a);
  assert.ok(
    a.events.every((e) => !["ATTACK", "DAMAGE", "INCIDENT"].includes(e.type)),
  );
});

test("Technical compliance preserves an earlier sign sample after the active sign is lowered", () => {
  const s = one();
  s.events = [
    {
      type: "AI_DECISION",
      participants: ["A"],
      effects: { compliance: "Followed" },
    },
    { type: "AI_DECISION", participants: ["A"], effects: { compliance: null } },
    {
      type: "AI_EXECUTION_RESULT",
      participants: ["A"],
      effects: { compliance: null },
    },
  ];
  assert.deepEqual(statistics(s).signCompliance, { Followed: 1 });
});
