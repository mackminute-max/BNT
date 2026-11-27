import { test } from "node:test";
import assert from "node:assert/strict";
import { createRace, step, run, capture, digest, issueSign, classification, assertState } from "../src/sim/race.js";
import { configuration, parseConfiguration } from "../src/dev/configuration.js";
import { queueOverride } from "../src/dev/overrides.js";
import { verifyReplay } from "../src/replay/replay.js";
import { results, statistics } from "../src/reporting/results.js";
import { batch, summarize } from "../src/dev/batch.js";
import { decide } from "../src/ai/driver.js";
import { retire, resolveAttacks } from "../src/sim/consequences.js";
import { derive } from "../src/model/ru.js";
import { location } from "../src/track/oval.js";
import { entrant, scenario, fixtureCatalog } from "./fixtures.js";

function laneRace(format, sign, blocked) {
  const a = entrant("A");
  a.ru.driver.awareness = 0;
  a.ru.driver.personality = { aggression: 100, caution: 0, patience: 0, opportunism: 0, staminaManagement: 0, tacticalDiscipline: 100 };
  const s = createRace({ seed: 145, format, entrants: [a], environmentOverrides: { visibility: .1 },
    autonomous: { noise: 0, executionError: 0, judgmentError: 0, stressError: 0, utility: { laneBase: 100 } },
    consequence: { incidentRate: 0 }, scheduledIncidents: blocked ? [{ time: 0, type: "debris", lane: 1, tile: 79, duration: 12 }] : [] });
  issueSign(s, "queue", sign); step(s); return s;
}
for (const format of ["Pure", "Combat"]) {
  for (const blocked of [false, true]) {
    test(`B01 ${format}: ${blocked ? "failed" : "successful"} lane movement preserves unrelated Push compliance`, () => {
      const s = laneRace(format, "Push the Pace", blocked), r = s.entrants[0], d = r.ai.diagnostics;
      assert.equal(d.intended.pace, "Push");
      assert.equal(d.effective.position, "outward");
      assert.equal(d.physicalOutcome.position.status, blocked ? "Prevented" : "Succeeded");
      assert.equal(d.executed.position, blocked ? null : "outward");
      assert.equal(d.executed.pace, "Push");
      assert.equal(d.compliance, "Followed");
      assert.equal(r.lane, blocked ? 0 : 1);
      assert.equal(d.perceived.hazards.length, 0);
      const decision = s.events.find(e => e.type === "AI_DECISION");
      const outcome = s.events.find(e => e.type === "AI_EXECUTION_RESULT");
      assert.equal(outcome.effects.decisionId, decision.id);
      assert.equal(decision.effects.physicalOutcome.position.status, "Pending");
      assert.equal(decision.effects.executed.position, null); // immutable intention-time record
      assert.deepEqual(statistics(s).signCompliance, { Followed: 1 });
      assert.equal(verifyReplay(JSON.parse(JSON.stringify(capture(s)))).checksum, digest(s));
      assertState(s);
    });
    test(`B01 ${format}: open-track compliance requires a resolved ${blocked ? "blocked" : "successful"} maneuver`, () => {
      const s = laneRace(format, "Seek Open Track", blocked), d = s.entrants[0].ai.diagnostics;
      assert.equal(d.compliance, blocked ? "Prevented" : "Followed");
      assert.equal(s.events.find(e => e.type === "AI_DECISION").effects.compliance, null);
      assert.deepEqual(statistics(s).signCompliance, { [blocked ? "Prevented" : "Followed"]: 1 });
      assert.equal(verifyReplay(capture(s)).checksum, digest(s));
    });
  }
  test(`B01 ${format}: contextual yield separates intended, effective and physical pace`, () => {
    const a = entrant("A", 0, -1.1);
    a.ru.driver.personality = { aggression: 100, caution: 100, patience: 0, opportunism: 0, staminaManagement: 0, tacticalDiscipline: 100 };
    const s = createRace({ format, entrants: [a, entrant("B", 0, -.5), entrant("C", 1, -1.1)], consequence: { incidentRate: 0 }, autonomous: { executionError: 0, judgmentError: 0, stressError: 0 } });
    issueSign(s, "queue", "Push the Pace"); step(s);
    const d = s.entrants[0].ai.diagnostics;
    assert.equal(d.intended.pace, "Push"); assert.equal(d.effective.pace, "Conserve");
    assert.equal(d.executed.pace, "Conserve"); assert.equal(d.compliance, "Overridden");
    assert.deepEqual(statistics(s).signCompliance, { Overridden: 1 });
    assert.equal(verifyReplay(capture(s)).checksum, digest(s));
  });
  test(`B01 ${format}: forward blockage prevents Push while retaining the physical constraint`, () => {
    const a = entrant("A", 0, -1.1, 30), b = entrant("B"); b.ru.driver.condition = 0;
    a.ru.driver.personality = { aggression: 100, caution: 0, patience: 100, opportunism: 0, staminaManagement: 0, tacticalDiscipline: 100 };
    const s = createRace({ format, entrants: [a, b], consequence: { incidentRate: 0, damageScale: 0, energyInstability: 0 }, autonomous: { executionError: 0, judgmentError: 0, stressError: 0, utility: { holdBase: 100 } } });
    issueSign(s, "queue", "Push the Pace"); step(s);
    assert.equal(s.entrants[0].speed, 0);
    assert.equal(s.entrants[0].ai.diagnostics.compliance, "Prevented");
    assert.ok(s.events.some(e => e.type === "AI_EXECUTION_RESULT" && e.effects.domain === "movement" && e.effects.compliance === "Prevented"));
    assert.equal(verifyReplay(capture(s)).checksum, digest(s));
  });
}
test("B01 invalidated combat cannot invalidate a successful pace sign; external commands cannot rewrite an older decision", () => {
  const a = entrant("A"), b = entrant("B", 1);
  a.ru.driver.personality = { aggression: 100, caution: 0, patience: 0, opportunism: 0, staminaManagement: 0, tacticalDiscipline: 100 };
  const s = createRace({ format: "Combat", entrants: [a, b], consequence: { incidentRate: 0, attackBase: 100 }, autonomous: { noise: 0, executionError: 0, judgmentError: 0, stressError: 0 } });
  issueSign(s, "queue", "Push the Pace"); step(s);
  const r = s.entrants[0]; r.ai.nextDecision = s.tick;
  r.nextAttackTime = 0;
  const intentions = decide(s, r);
  assert.equal(intentions[0].type, "attack");
  retire(s, s.entrants[1], "Earlier simultaneous action");
  resolveAttacks(s, intentions, r => r.derived = derive(r.ru, s.config));
  assert.equal(r.ai.diagnostics.physicalOutcome.position.status, "Prevented");
  assert.equal(r.ai.diagnostics.compliance, "Followed");
  const before = JSON.stringify(r.ai.diagnostics);
  resolveAttacks(s, [{ type: "attack", id: "A", target: "B", action: "attack" }], () => {});
  assert.equal(JSON.stringify(r.ai.diagnostics), before);
});
test("B01 technical and batch totals agree with linked execution outcomes", async () => {
  const s = laneRace("Pure", "Push the Pace", true);
  const report = summarize([{ ...statistics(s), winners: [] }], false);
  assert.deepEqual(report.signCompliance, { Followed: 1 });
  // An interleaved old result must update its own decision, not the latest sign.
  const synthetic = createRace({ entrants: [entrant("A")] });
  synthetic.events = [
    { type: "AI_DECISION", participants: ["A"], effects: { decisionId: 1, sign: "Seek Open Track", compliance: null } },
    { type: "AI_DECISION", participants: ["A"], effects: { decisionId: 2, sign: "Push the Pace", compliance: "Followed" } },
    { type: "AI_EXECUTION_RESULT", participants: ["A"], effects: { decisionId: 1, compliance: "Prevented" } },
  ];
  assert.deepEqual(statistics(synthetic).signCompliance, { Prevented: 1, Followed: 1 });
});

const surfaces = value => Object.fromEntries(["north", "east", "south", "west"].map(id => [id, { hazardModifier: value }]));
for (const format of ["Pure", "Combat"]) {
  test(`B02 ${format}: explicit neutral surfaces preserve events, RNG and state`, () => {
    const setup = { seed: 9, format, overrides: { laps: 1 }, consequence: { incidentRate: .1 } };
    const a = run(createRace(setup)), b = run(createRace({ ...setup, surfaces: surfaces(1) }));
    assert.deepEqual(a.events, b.events); assert.deepEqual(a.rng, b.rng); assert.equal(digest(a), digest(b));
    assert.equal(verifyReplay(capture(b)).checksum, digest(b));
  });
  test(`B02 ${format}: increased/decreased surface weights change incident placement deterministically`, () => {
    const counts = [];
    for (const hazardModifier of [.25, 1, 2]) {
      let north = 0;
      for (let seed = 1; seed <= 96; seed++) {
        const s = createRace({ seed, format, driverMode: "reference", entrants: [entrant("A")], surfaces: { north: { hazardModifier } }, consequence: { incidentRate: 1 } });
        for (let i = 0; i < 1000 && !s.events.some(e => e.type === "INCIDENT"); i++) step(s);
        const e = s.events.find(e => e.type === "INCIDENT"); assert.ok(e);
        if (location(e.effects.q, e.effects.lane, s.config, s.track).segment === "north") north++;
      }
      counts.push(north);
    }
    assert.ok(counts[0] < counts[1] && counts[1] < counts[2], counts.join(","));
  });
  test(`B02 ${format}: disabled incidents and zero frequency remain disabled`, () => {
    for (const mode of ["disabled", "zero"]) {
      const s = createRace({ format, consequences: mode !== "disabled", entrants: [entrant("A")], surfaces: surfaces(2), consequence: { incidentRate: mode === "zero" ? 0 : 1 } });
      for (let i = 0; i < 100; i++) step(s);
      assert.equal(s.nextIncidentAt, Infinity);
      assert.equal(s.hazards.length, 0); assert.ok(!s.events.some(e => e.type === "INCIDENT"));
    }
  });
  test(`B02 ${format}: zero surface excludes scheduled placement, and nonneutral configuration round-trips/replays`, () => {
    const setup = { format, entrants: [entrant("A")], surfaces: { north: { hazardModifier: 0 }, east: { hazardModifier: 2 }, south: { hazardModifier: .25 } }, consequence: { incidentRate: 1 }, overrides: { maxRaceTime: 2 },
      scheduledIncidents: [{ time: 0, type: "debris", lane: 1, tile: 79, duration: 12 }] };
    const doc = configuration(setup), imported = parseConfiguration(JSON.stringify(doc));
    assert.deepEqual(imported, doc);
    const s = run(createRace(imported.setup));
    assert.ok(s.events.some(e => e.type === "INCIDENT_SKIPPED"));
    assert.ok(s.hazards.every(h => location(h.q, h.lane, s.config, s.track).segment !== "north"));
    assert.equal(verifyReplay(JSON.parse(JSON.stringify(capture(s)))).checksum, digest(s));
  });
}
test("B02 surface modifier rejects invalid numbers, unknown fields and segments without changing a valid setup", () => {
  const original = configuration({ seed: 145 });
  for (const bad of [-1, 2.1, NaN, Infinity, "1", null]) assert.throws(() => createRace({ surfaces: { north: { hazardModifier: bad } } }));
  assert.throws(() => createRace({ surfaces: { missing: { hazardModifier: 1 } } }));
  assert.throws(() => createRace({ surfaces: { north: { imaginary: 1 } } }));
  const corrupt = structuredClone(original); corrupt.setup.surfaces = { north: { hazardModifier: -1 } };
  assert.throws(() => parseConfiguration(JSON.stringify(corrupt)));
  assert.deepEqual(configuration(original.setup), original);
  const excluded = createRace({ surfaces: surfaces(0), consequence: { incidentRate: 1 }, overrides: { maxRaceTime: 2 } });
  run(excluded); assert.equal(excluded.hazards.length, 0);
});

for (const format of ["Pure", "Combat"]) {
  test(`B03 ${format}: finish snapshot survives live override, clearance, export and replay`, () => {
    const s = createRace({ seed: 145, format, entrants: [entrant("A", 0, -.5, 0, 80), entrant("B", 1, -.5, 0, 20)], overrides: { laps: 1 }, consequence: { incidentRate: 0 }, checkpointInterval: 1000 });
    for (let i = 0; i < 20000 && !s.entrants.some(r => r.finishTime !== null); i++) step(s);
    const r = s.entrants.find(r => r.finishTime !== null); assert.ok(r);
    const original = structuredClone(r.finishSnapshot), time = r.finishTime;
    assert.equal(original.time, time);
    assert.deepEqual(original.beasts.map(b => b.fatigue), r.ru.beasts.map(b => b.fatigue));
    assert.ok(Object.isFrozen(r.finishSnapshot) && Object.isFrozen(r.finishSnapshot.beasts));
    assert.throws(() => r.finishSnapshot.beasts[0].fatigue = 100);
    assert.throws(() => r.finishSnapshot = null);
    const before = statistics(s).fatigueAtFinish;
    queueOverride(s, { target: "ru", id: r.id, path: "beasts.*.fatigue", value: 100 }, { paused: true }); step(s);
    assert.ok(r.ru.beasts.every(b => b.fatigue === 100));
    assert.equal(statistics(s).fatigueAtFinish, before);
    assert.deepEqual(r.finishSnapshot, original); assert.equal(r.finishTime, time);
    const partial = verifyReplay(JSON.parse(JSON.stringify(capture(s))));
    assert.deepEqual(partial.state.entrants.find(x => x.id === r.id).finishSnapshot, original);
    run(s); assert.equal(r.physical, "Exited"); assert.equal(r.finishTime, time);
    assert.deepEqual(r.finishSnapshot, original);
    const exported = JSON.parse(JSON.stringify(results(s)));
    const row = exported.technical.entrants.find(x => x.id === r.id);
    assert.deepEqual(row.finishSnapshot, original);
    assert.deepEqual(row.fatigue, [100, 100]);
    const fatigueAtFinish = s.entrants.filter(x => x.finishSnapshot).flatMap(x => x.finishSnapshot.beasts.map(b => b.fatigue));
    assert.equal(statistics(s).fatigueAtFinish, fatigueAtFinish.reduce((a,b) => a+b, 0)/fatigueAtFinish.length);
    assert.equal(verifyReplay(capture(s)).checksum, digest(s));
    assert.deepEqual(s.events.find(e => e.type === "RU_FINISHED" && e.participants[0] === r.id).effects.finishSnapshot, original);
    row.finishSnapshot.beasts[0].fatigue = 0; assert.deepEqual(r.finishSnapshot, original);
  });
  test(`B04 ${format}: named standing-start photo fixture produces a real deterministic official tie`, () => {
    const setup = { ...fixtureCatalog.finish_photo.setup, format };
    const s = run(createRace(setup)), rows = classification(s);
    assert.equal(s.status, "Ended"); assert.equal(s.config.finishTolerance, .001);
    const gap = Math.abs(rows[0].time - rows[1].time);
    assert.ok(gap > .00049 && gap < .00051, String(gap));
    assert.deepEqual(rows.map(r => r.place), [1, 1]);
    assert.ok(s.entrants.every(r => r.hasEnteredCourse && r.completedLaps === 1 && r.physical === "Exited"));
    assert.ok(s.entrants.every(r => r.finishTime !== Number(r.finishTime.toFixed(3))));
    assert.equal(s.events.filter(e => e.type === "LAP_ENTERED").length, 2);
    assert.equal(verifyReplay(capture(s)).checksum, digest(s));
    const reversed = run(createRace({ ...setup, entrants: [...setup.entrants].reverse(), playerId: setup.playerId }));
    assert.deepEqual(classification(reversed), rows); assert.equal(digest(reversed), digest(s));
    const strict = run(createRace({ ...setup, overrides: { ...setup.overrides, finishTolerance: .0001 } }));
    assert.deepEqual(classification(strict).map(r => r.place), [1, 2]);
    assert.deepEqual(strict.entrants.map(r => r.finishTime), s.entrants.map(r => r.finishTime));
    assert.deepEqual(s.setup.entrants.map(r => r.speed), [0, 0]);
  });
}

test("B01 simultaneous AI lane claims have linked physical outcomes independent of entrant order", () => {
  const make = reverse => {
    const entrants = [entrant("A", 0), entrant("B", 2)];
    for (const e of entrants) e.ru.driver.personality = { aggression: 100, caution: 0, patience: 0, opportunism: 0, staminaManagement: 0, tacticalDiscipline: 100 };
    const s = createRace({ seed: 17, playerId: "A", entrants: reverse ? entrants.reverse() : entrants, consequence: { incidentRate: 0 }, autonomous: { noise: 0, executionError: 0, judgmentError: 0, stressError: 0, utility: { laneBase: 100 } } });
    issueSign(s, "queue", "Seek Open Track"); step(s);
    assert.equal(s.entrants.filter(r => r.lane === 1).length, 1);
    for (const r of s.entrants) {
      const d = r.ai.diagnostics;
      assert.equal(d.physicalOutcome.position.status, r.lane === 1 ? "Succeeded" : "Prevented");
      assert.equal(d.executed.position, r.lane === 1 ? d.intended.position : null);
    }
    assert.equal(verifyReplay(capture(s)).checksum, digest(s)); assertState(s); return s;
  };
  const a = make(false), b = make(true);
  assert.deepEqual(a.events, b.events); assert.equal(digest(a), digest(b));
});
test("B01 control loss records constrained pace without forcing sign obedience", () => {
  const a = entrant("A", 0, -.5, 80);
  a.ru.driver.personality = { aggression: 100, caution: 0, patience: 0, opportunism: 0, staminaManagement: 0, tacticalDiscipline: 100 };
  const s = createRace({ entrants: [a], overrides: { cornerRisk: 10, cornerSpeedLoss: 0 }, consequence: { incidentRate: 0, cornerShock: 100, disabledThreshold: 10000 }, autonomous: { noise: 0, executionError: 0, judgmentError: 0, stressError: 0, utility: { sprintBase: 100 } } });
  issueSign(s, "queue", "Push the Pace");
  for (let i = 0; i < 1000 && s.entrants[0].control !== "Out of Control"; i++) step(s);
  const d = s.entrants[0].ai.diagnostics;
  assert.equal(s.entrants[0].control, "Out of Control");
  assert.equal(d.effective.pace, "Sprint"); assert.equal(d.executed.pace, null);
  assert.equal(d.physicalOutcome.pace.status, "Prevented");
  assert.equal(d.compliance, "Prevented");
  assert.equal(verifyReplay(capture(s)).checksum, digest(s));
});
test("B03 batch statistics use the same finish measurements as reconstructed single races", async () => {
  const setup = { entrants: [entrant("A")], overrides: { laps: 1 }, consequence: { incidentRate: 0 }, checkpointInterval: 1000 };
  const b = await batch(setup, [145, 146], { yieldControl: async () => {} });
  const fatigue = [145, 146].map(seed => {
    const s = run(createRace({ ...setup, seed }));
    const values = s.entrants[0].finishSnapshot.beasts.map(b => b.fatigue);
    return values.reduce((a,b) => a+b, 0)/values.length;
  });
  assert.deepEqual(b.races.map(r => r.fatigueAtFinish), fatigue);
  assert.equal(b.means.fatigueAtFinish, (fatigue[0]+fatigue[1])/2);
});
