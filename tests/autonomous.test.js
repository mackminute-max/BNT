import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createRace,
  step,
  run,
  issueSign,
  capture,
  digest,
} from "../src/sim/race.js";
import { defaultRU } from "../src/model/ru.js";
import { perceive, decide, personality } from "../src/ai/driver.js";
import { integrateCondition, weatherPresets } from "../src/sim/environment.js";
import { activateSign, signs } from "../src/ai/signs.js";
const one = (opts) =>
  createRace({ entrants: [{ ru: defaultRU("A"), lane: 0, q: -0.5 }], ...opts });
test("T16 pre-race sign activates at starting signal, not while queued", () => {
  const s = one();
  issueSign(s, "queue", signs[0]);
  assert.equal(s.entrants[0].signs.active, null);
  step(s);
  assert.equal(s.entrants[0].signs.active, signs[0]);
  assert.equal(s.entrants[0].signs.remaining, 2);
});
test("T16 running sign activates only on next forward line crossing", () => {
  const s = one();
  step(s);
  issueSign(s, "queue", signs[1]);
  assert.equal(s.entrants[0].signs.active, null);
  while (!s.entrants[0].hasEnteredCourse && s.tick < 500) step(s);
  assert.equal(s.entrants[0].signs.active, signs[1]);
});
test("T17/T18 replacement consumes another use, cancellation has no refund, lowering free", () => {
  const s = one();
  issueSign(s, "queue", signs[0]);
  step(s);
  issueSign(s, "queue", signs[1]);
  issueSign(s, "queue", signs[2]);
  const r = s.entrants[0];
  assert.equal(r.signs.active, signs[0]);
  assert.equal(r.signs.pending, signs[2]);
  assert.equal(r.signs.remaining, 0);
  issueSign(s, "cancel");
  assert.equal(r.signs.pending, null);
  assert.equal(r.signs.remaining, 0);
  issueSign(s, "lower");
  assert.equal(r.signs.active, null);
  assert.equal(s.tick, 1);
  assert.equal(issueSign(s, "queue", signs[0]), false);
});
test("E09 invalid Pure sign rejected without charge; Combat sign valid but no nearby rival is inapplicable", () => {
  const s = one();
  assert.equal(issueSign(s, "queue", "Engage Rivals"), false);
  assert.equal(s.entrants[0].signs.remaining, 3);
  const c = one({ format: "Combat" });
  issueSign(c, "queue", "Engage Rivals");
  step(c);
  assert.equal(c.entrants[0].ai.diagnostics.compliance, "Inapplicable");
  assert.ok(
    c.entrants[0].ai.diagnostics.candidates.every(
      (x) => !["attack", "ram"].includes(x.action),
    ),
  );
});
test("T07 Sprint raises individual fatigue; T08 Conserve conditionally recovers", () => {
  const s = one(),
    r = s.entrants[0];
  r.pace = "Sprint";
  r.ru.beasts[1].endurance = 90;
  integrateCondition(s, r, 10);
  assert.ok(r.ru.beasts[0].fatigue > r.ru.beasts[1].fatigue);
  assert.ok(r.ru.driver.strain > 0 && r.ru.chariot.wear > 0);
  r.ru.beasts.forEach((b) => (b.fatigue = 40));
  r.pace = "Conserve";
  integrateCondition(s, r, 10);
  assert.ok(r.ru.beasts.every((b) => b.fatigue < 40));
  r.pace = "Push";
  const before = r.ru.beasts[0].fatigue;
  integrateCondition(s, r, 10);
  assert.ok(r.ru.beasts[0].fatigue > before);
});
test("Elapsed partition does not double-count fatigue", () => {
  const a = one(),
    b = one();
  a.entrants[0].pace = b.entrants[0].pace = "Sprint";
  integrateCondition(a, a.entrants[0], 1);
  for (let i = 0; i < 10; i++) integrateCondition(b, b.entrants[0], 0.1);
  assert.ok(
    Math.abs(
      a.entrants[0].ru.beasts[0].fatigue - b.entrants[0].ru.beasts[0].fatigue,
    ) < 1e-12,
  );
});
test("T09 five weather presets change grip, visibility, fatigue and rolling outcomes", () => {
  const results = Object.keys(weatherPresets).map((weather) => {
    const s = one({ weather }),
      r = s.entrants[0];
    r.pace = "Sprint";
    integrateCondition(s, r, 10);
    return {
      weather,
      lateral: r.derived.lateral,
      range: perceive(s, r).range,
      fatigue: r.ru.beasts[0].fatigue,
    };
  });
  assert.equal(results.length, 5);
  assert.ok(results[2].lateral < results[0].lateral);
  assert.ok(results[3].range < results[0].range);
  assert.ok(results[4].fatigue > results[0].fatigue);
  assert.throws(() => one({ weather: "Snow" }));
});
test("Perception excludes hidden hazards and competitors and never leaks into utility", () => {
  const a = one(),
    b = one();
  a.hazards = [{ id: "hidden", lane: 0, q: 25 }];
  const ar = a.entrants[0],
    br = b.entrants[0];
  assert.deepEqual(perceive(a, ar), perceive(b, br));
  decide(a, ar);
  decide(b, br);
  assert.deepEqual(ar.ai.diagnostics, br.ai.diagnostics);
});
test("Different personalities choose distinguishable paces; sign changes preference without stat buff", () => {
  const a = one({
      autonomous: {
        noise: 0,
        judgmentError: 0,
        executionError: 0,
        stressError: 0,
      },
    }),
    b = structuredClone(a);
  a.entrants[0].ru.driver.personality = {
    ...personality(),
    aggression: 100,
    opportunism: 100,
    patience: 0,
    caution: 0,
  };
  b.entrants[0].ru.driver.personality = {
    ...personality(),
    aggression: 0,
    opportunism: 0,
    patience: 100,
    caution: 100,
  };
  step(a);
  step(b);
  assert.notEqual(a.entrants[0].pace, b.entrants[0].pace);
  const c = one();
  const d = structuredClone(c.entrants[0].derived);
  issueSign(c, "queue", "Conserve Strength");
  step(c);
  assert.deepEqual(c.entrants[0].derived, d);
  assert.ok(
    c.entrants[0].ai.diagnostics.candidates.find((x) => x.action === "Conserve")
      .terms.sign > 0,
  );
});
test("Execution errors prevent selected actions and produce compliance diagnostics", () => {
  const s = one({ autonomous: { executionError: 1 } }),
    r = s.entrants[0];
  r.ru.driver.driving = 0;
  issueSign(s, "queue", "Push the Pace");
  step(s);
  assert.equal(r.ai.diagnostics.executionError, true);
  assert.equal(r.ai.diagnostics.compliance, "Prevented");
  assert.equal(r.pace, "Maintain");
});
test("Autonomous seeded race and paused sign commands reproduce exact events", () => {
  const a = one({ overrides: { laps: 1 } });
  issueSign(a, "queue", "Conserve Strength");
  for (let i = 0; i < 20; i++) step(a);
  issueSign(a, "queue", "Push the Pace");
  issueSign(a, "lower");
  run(a);
  assert.equal(a.status, "Ended");
  const record = capture(a),
    b = run(createRace(record.setup), { commands: record.commands });
  assert.deepEqual(a.events, b.events);
  assert.equal(digest(a), digest(b));
});
test("Autonomous entrant permutation invariance and bounded lane switching", () => {
  const a = createRace({ overrides: { laps: 1 } }),
    b = createRace({ overrides: { laps: 1 } });
  b.entrants.reverse();
  run(a);
  run(b);
  assert.equal(a.status, "Ended");
  assert.equal(digest(a), digest(b));
  const changes = a.events.filter((e) => e.type === "LANE_CHANGE_COMPLETED");
  assert.ok(changes.length < 150);
});

test("Surface grip, rolling resistance and roughness affect physics and exertion", () => {
  const a = one(),
    b = one({
      surfaces: { north: { grip: 0.5, rollingResistance: 1.5, roughness: 1 } },
    });
  assert.ok(b.entrants[0].derived.lateral < a.entrants[0].derived.lateral);
  assert.ok(b.entrants[0].derived.maxSpeed < a.entrants[0].derived.maxSpeed);
  a.entrants[0].pace = b.entrants[0].pace = "Sprint";
  integrateCondition(a, a.entrants[0], 1);
  integrateCondition(b, b.entrants[0], 1);
  assert.ok(
    b.entrants[0].ru.beasts[0].fatigue > a.entrants[0].ru.beasts[0].fatigue,
  );
  assert.throws(() => one({ surfaces: { north: { grip: -1 } } }));
});
test("Pending activation replaces active atomically at crossing and retirement prevents activation", () => {
  const s = one();
  issueSign(s, "queue", signs[0]);
  step(s);
  issueSign(s, "queue", signs[1]);
  const r = s.entrants[0];
  activateSign(s, r);
  assert.equal(r.signs.active, signs[1]);
  assert.equal(r.signs.pending, null);
  issueSign(s, "queue", signs[2]);
  r.status = "Retired";
  activateSign(s, r);
  assert.equal(r.signs.active, signs[1]);
  assert.equal(r.signs.remaining, 0);
});
test("Weather races remain deterministic and complete in every preset", () => {
  for (const weather of Object.keys(weatherPresets)) {
    const a = one({ weather, overrides: { laps: 1 } }),
      b = one({ weather, overrides: { laps: 1 } });
    run(a);
    run(b);
    assert.equal(a.status, "Ended", weather);
    assert.equal(digest(a), digest(b));
  }
});

test("Judgment and stress errors are independent diagnostics with bounded inputs", () => {
  const s = one({
      autonomous: { judgmentError: 1, stressError: 1, executionError: 0 },
    }),
    r = s.entrants[0];
  r.ru.driver.awareness = 0;
  r.ru.driver.nerve = 0;
  r.ru.driver.strain = 100;
  step(s);
  assert.equal(r.ai.diagnostics.judgmentError, true);
  assert.equal(r.ai.diagnostics.stressError, true);
  assert.equal(r.ai.diagnostics.executionError, false);
});
test("All sign controls and replacements replay in original boundary order", () => {
  const s = one({ overrides: { laps: 1 } });
  issueSign(s, "queue", signs[0]);
  issueSign(s, "queue", signs[1]);
  issueSign(s, "cancel");
  issueSign(s, "queue", signs[2]);
  step(s);
  issueSign(s, "lower");
  run(s);
  const replay = run(createRace(capture(s).setup), { commands: s.commands });
  assert.equal(digest(s), digest(replay));
});
