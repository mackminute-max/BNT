import { test } from "node:test";
import assert from "node:assert/strict";
import { config } from "../src/config/config.js";
import {
  defaultRU,
  derive,
  beastAttributes,
  driverAttributes,
  chariotAttributes,
} from "../src/model/ru.js";
import { random } from "../src/core/determinism.js";
import { location, lapLength, track, key } from "../src/track/oval.js";
import {
  createRace as createEngineRace,
  run,
  step,
  classification,
  capture,
  digest,
  assertState,
} from "../src/sim/race.js";
import { arrival, travel } from "../src/sim/kinematics.js";
import { fixture, entrant } from "./fixtures.js";

const createRace = (options) =>
  createEngineRace({
    driverMode: "reference",
    consequences: false,
    ...options,
  });
const finish = (s) => {
  run(s);
  assert.equal(s.status, "Ended", JSON.stringify(s.events.at(-1)));
  return s;
};
const clone = (x) => structuredClone(x);

test("T24 configuration validates version, ranges, integer fields and unknown keys", () => {
  for (const overrides of [
    { dt: NaN },
    { dt: Infinity },
    { schema: 3 },
    { lanes: 2.5 },
    { innerRadius: -1 },
    { laps: 0 },
    { banana: 1 },
    { exitTiles: 10 },
  ])
    assert.throws(() => config(overrides));
  assert.equal(config().laps, 3);
});
test("T24 scenario rejects duplicate IDs, overlap, invalid components and initial state", () => {
  assert.throws(() =>
    createRace({ entrants: [entrant("A"), entrant("A", 1)] }),
  );
  assert.throws(() => createRace({ entrants: [entrant("A"), entrant("B")] }));
  assert.throws(() => createRace({ entrants: [entrant("A", 4)] }));
  assert.throws(() => createRace({ entrants: [entrant("A", 0, 0)] }));
  const e = entrant("A");
  e.ru.beasts[0].power = Infinity;
  assert.throws(() => createRace({ entrants: [e] }));
});
test("Seed draws are keyed, repeatable, bounded and independent of call order", () => {
  const a = random(7, "corner", "A", 0);
  random(7, "corner", "B", 0);
  assert.equal(a, random(7, "corner", "A", 0));
  assert.notEqual(a, random(8, "corner", "A", 0));
  assert.ok(a >= 0 && a < 1);
});
test("T06 mismatch bottleneck produces 70.5 speed, coordination reduces power", () => {
  const r = defaultRU("A");
  r.beasts[0].speed = 90;
  r.beasts[1].speed = 60;
  const d = derive(r, config());
  assert.equal(d.team.speed, 70.5);
  assert.ok(d.mismatch > 0);
  const same = defaultRU("A");
  same.beasts.forEach((b) => (b.speed = 75));
  assert.ok(d.coordination < derive(same, config()).coordination);
});
test("RU power sums; configurable team size; individual impairment applied before aggregation", () => {
  const r = defaultRU("A"),
    c = config(),
    base = derive(r, c);
  r.beasts.push(clone(r.beasts[0]));
  assert.equal(derive(r, c).team.power, base.team.power * 1.5);
  r.beasts[0].condition = 0;
  assert.equal(derive(r, c).effective[0].power, 0);
  assert.ok(derive(r, c).team.power < base.team.power * 1.5);
});
test("All component attributes have a testable derived effect", () => {
  for (const [name, attrs] of [
    ["beasts", beastAttributes],
    ["driver", driverAttributes],
    ["chariot", [...chariotAttributes, "weight", "capacity"]],
  ]) {
    const r = defaultRU("A");
    r.equipment.mass = 400;
    const before = derive(r, config());
    for (const attr of attrs) {
      const edited = clone(r);
      (name === "beasts" ? edited.beasts[0] : edited[name])[attr] += 10;
      const after = derive(edited, config());
      assert.ok(
        [
          "maxSpeed",
          "acceleration",
          "handling",
          "control",
          "endurance",
          "resilience",
          "combat",
          "awareness",
          "nerve",
        ].some((k) => after[k] !== before[k]),
        `${name}.${attr} must affect performance`,
      );
    }
  }
});
test("E20 lane geometry has unequal turn distance and radius, equal straights", () => {
  const c = config(),
    t = track(c),
    straight = 0,
    turn = c.straightTiles - Math.floor(c.straightTiles / 2);
  assert.equal(
    location(straight, 0, c, t).length,
    location(straight, 3, c, t).length,
  );
  assert.ok(location(turn, 3, c, t).length > location(turn, 0, c, t).length);
  assert.ok(lapLength(3, c) > lapLength(0, c));
  assert.ok(
    Math.abs(
      lapLength(0, c) - (2 * c.straightLength + 2 * Math.PI * c.innerRadius),
    ) < 1e-10,
  );
});
test("Constant acceleration travel and fractional arrival solve analytically", () => {
  assert.equal(travel(3, 2, 0.5), 1.75);
  assert.ok(Math.abs(arrival(3, 2, 1.75) - 0.5) < 1e-12);
  assert.equal(arrival(0, 0, 1), Infinity);
});
test("Standing grid is aligned on straight, stationary, row separated without distance credit", () => {
  const s = fixture("grid_eight");
  for (let i = 0; i < 8; i++) {
    const r = s.entrants[i];
    assert.equal(r.speed, 0);
    assert.equal(r.q, i < 4 ? -0.5 : -2.5);
    assert.equal(r.lane, i % 4);
    assert.equal(location(r.q, r.lane, s.config, s.track).type, "straight");
  }
});
test("T01 full eight-RU three-lap race repeats exact events and classification", () => {
  const a = finish(fixture("grid_eight")),
    b = finish(fixture("grid_eight"));
  assert.deepEqual(capture(a), capture(b));
  assert.equal(classification(a).length, 8);
  assert.ok(
    a.entrants.every((r) => r.completedLaps === 3 && r.physical === "Exited"),
  );
});
test("T02 full race is independent of entrant storage order", () => {
  const a = fixture("grid_eight"),
    b = fixture("grid_eight");
  b.entrants.reverse();
  finish(a);
  finish(b);
  assert.deepEqual(a.events, b.events);
  assert.equal(digest(a), digest(b));
});
test("T03 same destination lateral claim has one deterministic winner", () => {
  const a = fixture("lane_conflict"),
    b = fixture("lane_conflict");
  b.entrants.reverse();
  const commands = [
    { type: "lane", id: "A", lane: 1 },
    { type: "lane", id: "B", lane: 1 },
  ];
  step(a, commands);
  step(b, [...commands].reverse());
  assert.equal(a.entrants.filter((r) => r.lane === 1).length, 1);
  assert.deepEqual(a.events, b.events);
  assertState(a);
});
test("T04 lane swap checks swept occupancy and rejects both without overlap", () => {
  const s = fixture("lane_swap");
  step(s, [
    { type: "lane", id: "A", lane: 1 },
    { type: "lane", id: "B", lane: 0 },
  ]);
  assert.deepEqual(
    s.entrants.map((r) => r.lane),
    [0, 1],
  );
  assert.equal(s.events.filter((e) => e.type === "CONTACT").length, 1);
  assertState(s);
});
test("Adjacent lane change preserves speed with no arbitrary penalty; nonadjacent rejected", () => {
  const s = createRace({ entrants: [entrant("A", 0, -0.5, 5)] });
  step(s, [{ type: "lane", id: "A", lane: 1 }]);
  assert.equal(s.entrants[0].lane, 1);
  assert.ok(s.entrants[0].speed >= 5);
  step(s, [{ type: "lane", id: "A", lane: 3 }]);
  assert.equal(s.entrants[0].lane, 1);
  assert.ok(s.events.some((e) => e.type === "COMMAND_REJECTED"));
});
function obstruction() {
  const s = createRace({
    entrants: [entrant("A", 0, -4.1, 80), entrant("B", 0, -1.5)],
    overrides: { dt: 1 },
  });
  // Fixture obstacle adapter only; gameplay disablement/damage belongs to M3.
  const b = s.entrants[1];
  b.status = "Retired";
  b.physical = "Wreck";
  b.retirement = { time: 0, progress: b.q, reason: "fixture" };
  return s;
}
test("E01 high-speed path checks every swept tile; E04 contact stops remaining subinterval", () => {
  const s = obstruction();
  step(s, [{ type: "pace", id: "A", pace: "Sprint" }]);
  const a = s.entrants[0];
  assert.equal(Math.floor(a.q), -3);
  assert.equal(a.speed, 0);
  assert.notEqual(key(a.q, a.lane, s.track), key(s.entrants[1].q, 0, s.track));
  const e = s.events.find((e) => e.type === "CONTACT");
  assert.ok(e.time > 0 && e.time < 1);
  assertState(s);
});
test("E02 no stored blocked travel; E05 continuous stationary contact not duplicated", () => {
  const s = obstruction();
  step(s);
  const a = s.entrants[0];
  for (let i = 0; i < 5; i++) step(s);
  assert.equal(s.events.filter((e) => e.type === "CONTACT").length, 1);
  s.entrants[1].physical = "Exited";
  const before = a.q;
  step(s);
  assert.ok(a.q - before < 1);
  assert.ok(a.speed < 5);
});
test("E03 simultaneous forward convoy moves from snapshot independent of storage order", () => {
  const make = () =>
    createRace({
      entrants: [entrant("A", 0, -2.1, 10), entrant("B", 0, -1.1, 10)],
      overrides: { dt: 0.2 },
    });
  const a = make(),
    b = make();
  b.entrants.reverse();
  step(a);
  step(b);
  assert.deepEqual(a.events, b.events);
  assert.equal(digest(a), digest(b));
  assert.ok(a.entrants[0].q > -2);
  assertState(a);
});
test("T05 corner overspeed evaluates risk without hard speed cap", () => {
  const s = fixture("fast_corner");
  const r = s.entrants[0];
  r.q = 9.9; // Immediately before first turn (finish line is midpoint of straight).
  step(s, [{ type: "pace", id: "A", pace: "Sprint" }]);
  const e = s.events.find((e) => e.type === "CORNER_EVALUATED");
  assert.ok(e);
  assert.ok(e.effects.speed > e.effects.safe);
  assert.equal(e.effects.probability, 1);
  assert.equal(r.control, "Unstable");
  assert.ok(r.speed > e.effects.safe);
});
test("Braking changes continuous velocity, without negative speed", () => {
  const s = createRace({ entrants: [entrant("A", 0, -0.5, 10)] });
  step(s, [{ type: "pace", id: "A", pace: "Brake" }]);
  assert.ok(s.entrants[0].speed < 10);
  for (let i = 0; i < 50; i++) step(s);
  assert.equal(s.entrants[0].speed, 0);
});
test("T19 front/rear first entry completes zero laps and preserves rear disadvantage", () => {
  const s = fixture("rear_row_laps");
  while (!s.entrants.every((r) => r.hasEnteredCourse) && s.tick < 500) step(s);
  assert.ok(
    s.entrants.every((r) => r.hasEnteredCourse && r.completedLaps === 0),
  );
  const entries = s.events.filter((e) => e.type === "LAP_ENTERED");
  assert.ok(entries[0].time < entries[1].time);
  finish(s);
  for (const r of s.entrants) {
    assert.equal(
      s.events.filter(
        (e) => e.type === "LAP_COMPLETED" && e.participants.includes(r.id),
      ).length,
      3,
    );
    assert.equal(r.lastCrossingQ, s.track.cells * 3);
  }
});
test("T20 fractional finish times retained, official tie tolerance uses first group time", () => {
  const s = fixture("finish_photo");
  for (const [i, r] of s.entrants.entries()) {
    r.finishTime = 1.00001 + i * 0.0005;
    r.status = "Finished";
  }
  assert.deepEqual(
    classification(s).map((r) => r.place),
    [1, 1],
  );
  s.entrants[1].finishTime = 1.002;
  assert.deepEqual(
    classification(s).map((r) => r.place),
    [1, 2],
  );
  const done = finish(fixture("empty_track"));
  const time = done.entrants[0].finishTime;
  assert.notEqual(time / done.config.dt, Math.round(time / done.config.dt));
});
test("Basic finish clearing locks time, exits only after legal physical travel", () => {
  const s = fixture("empty_track");
  while (s.entrants[0].finishTime === null && s.tick < 5000) step(s);
  const r = s.entrants[0],
    time = r.finishTime;
  assert.equal(r.physical, "Clearing");
  assert.ok(r.q < s.config.laps * s.track.cells + s.config.exitTiles);
  finish(s);
  assert.equal(r.finishTime, time);
  assert.equal(r.physical, "Exited");
});
test("E16 invalid numeric state and subevent overflow stop with diagnostic", () => {
  const s = fixture("empty_track");
  s.entrants[0].q = NaN;
  step(s);
  assert.equal(s.status, "Error");
  assert.equal(s.events.at(-1).type, "INTEGRITY_ERROR");
  const fast = createRace({
    entrants: [entrant("A", 0, -5.5, 100)],
    overrides: { dt: 1, maxSubevents: 1 },
  });
  step(fast);
  assert.equal(fast.status, "Error");
  assert.match(fast.events.at(-1).effects.message, /budget/);
});
test("Time limit reports unfinished classification rather than fabricated finishes", () => {
  const s = createRace({ overrides: { maxRaceTime: 1 } });
  run(s);
  assert.equal(s.status, "Stalled");
  assert.ok(s.entrants.every((r) => r.finishTime === null));
  assert.ok(classification(s).every((r) => r.status === "Racing"));
});
test("DNF progress ordering and administrative stable-ID tie; DNS separate", () => {
  const s = fixture("grid_eight");
  for (const r of s.entrants) {
    r.status = "Retired";
    r.retirement = { time: 5, progress: 2, reason: "fixture" };
  }
  s.entrants[2].retirement.progress = 3;
  s.entrants[7].status = "DNS";
  const result = classification(s);
  assert.equal(result[0].id, "RU3");
  assert.equal(result[1].id, "RU1");
  assert.equal(result.find((r) => r.id === "RU8").status, "DNS");
});
test("Boundary command inputs captured and reproduce foundation events", () => {
  const commands = [
    { tick: 5, type: "pace", id: "RU1", pace: "Push" },
    { tick: 20, type: "pace", id: "RU1", pace: "Maintain" },
  ];
  const a = finish(run(fixture("grid_eight"), { commands }));
  const record = capture(a);
  const b = run(createRace(record.setup), { commands: record.commands });
  assert.equal(b.status, "Ended");
  assert.deepEqual(record.events, b.events);
  assert.equal(record.checksum, digest(b));
});
test("E20 short and long configured segments finish with correct common-line counts", () => {
  for (const geometry of [
    { straightLength: 10, innerRadius: 5 },
    { straightLength: 800, innerRadius: 80 },
  ]) {
    const s = createRace({
      entrants: [entrant("A")],
      overrides: { ...geometry, laps: 1, maxRaceTime: 1000 },
    });
    finish(s);
    assert.equal(s.entrants[0].completedLaps, 1);
    assert.equal(s.events.filter((e) => e.type === "LAP_ENTERED").length, 1);
  }
});
test("Batch invariants: seeds 1..8 complete without overlap or nonfinite state", () => {
  for (let seed = 1; seed <= 8; seed++) {
    const s = finish(createRace({ seed, overrides: { laps: 1 } }));
    assertState(s);
    assert.equal(s.entrants.filter((r) => r.finishTime !== null).length, 8);
    assert.ok(
      s.events.every((e, i) => i === 0 || e.time >= s.events[i - 1].time),
    );
  }
});

test("T20 actual simultaneous finish crossings yield equal unrounded timestamps and shared place", () => {
  const s = createRace({ entrants: [entrant("A", 0), entrant("B", 1)] });
  for (const r of s.entrants) {
    r.q = s.track.cells * 3 - 0.01;
    r.speed = 10;
    r.hasEnteredCourse = true;
    r.completedLaps = 2;
    r.lastCrossingQ = s.track.cells * 2;
  }
  step(s);
  const rows = classification(s);
  assert.equal(rows[0].time, rows[1].time);
  assert.deepEqual(
    rows.map((r) => r.place),
    [1, 1],
  );
  assert.ok(rows[0].time > 0 && rows[0].time < s.config.dt);
});
test("E11 obstruction before finish prevents crossing; contact beyond finish preserves official time", () => {
  const make = (offset) => {
    const s = createRace({
      entrants: [entrant("A", 0), entrant("B", 0, -3)],
      overrides: { dt: 1 },
    });
    const [a, b] = s.entrants;
    a.q = 3 * s.track.cells - 0.1;
    a.speed = 30;
    a.hasEnteredCourse = true;
    a.completedLaps = 2;
    a.lastCrossingQ = 2 * s.track.cells;
    b.q = offset;
    b.speed = 0;
    b.status = "Retired";
    b.physical = "Wreck";
    b.retirement = { time: 0, progress: offset, reason: "fixture" };
    return s;
  };
  const before = make(0.5);
  step(before);
  assert.equal(before.entrants[0].finishTime, null);
  assert.ok(before.events.some((e) => e.type === "CONTACT"));
  const after = make(1.5);
  step(after);
  assert.ok(after.entrants[0].finishTime > 0);
  const f = after.events.find((e) => e.type === "RU_FINISHED"),
    c = after.events.find((e) => e.type === "CONTACT");
  assert.ok(f.time < c.time);
  assert.equal(after.entrants[0].finishTime, f.time);
});
test("Repeated multi-RU lateral conflicts and permutations do not produce order bias", () => {
  for (let seed = 1; seed <= 10; seed++) {
    const a = createRace({
      seed,
      entrants: [
        entrant("A", 0),
        entrant("B", 2),
        entrant("C", 0, -2),
        entrant("D", 2, -2),
      ],
    });
    const b = clone(a);
    b.entrants.reverse();
    const cmds = a.entrants.map((r) => ({ type: "lane", id: r.id, lane: 1 }));
    step(a, cmds);
    step(b, [...cmds].reverse());
    assert.equal(digest(a), digest(b));
    assertState(a);
  }
});
test("Configurable balance overrides validate and change derivation", () => {
  assert.throws(() => config({ tuning: { impairment: 2 } }));
  assert.throws(() => config({ tuning: { handlingDriving: 1 } }));
  assert.throws(() => config({ tuning: { unknown: 0.5 } }));
  const r = defaultRU("A"),
    a = derive(r, config()),
    b = derive(r, config({ tuning: { coordinationBase: 0.5 } }));
  assert.ok(b.acceleration < a.acceleration);
});
test("Headless engine has no DOM, storage, wall-clock or global randomness dependencies", async () => {
  const { readFile } = await import("node:fs/promises");
  const { glob } = await import("node:fs/promises");
  for await (const path of glob(
    "src/{sim,model,track,core,events,config}/**/*.js",
  )) {
    const source = await readFile(path, "utf8");
    assert.doesNotMatch(
      source,
      /\b(?:document|window|localStorage|requestAnimationFrame)\b|Date\.now|Math\.random/,
      path,
    );
  }
});

test("Captured records are immutable snapshots and digest includes hidden resolver state", () => {
  const s = fixture("empty_track"),
    record = capture(s),
    before = digest(s);
  step(s);
  assert.equal(record.events.length, 0);
  assert.equal(record.checksum, before);
  const altered = clone(s);
  altered.contacts.push("A|fixture");
  assert.notEqual(digest(altered), digest(s));
  assert.throws(() => config(JSON.parse('{"constructor":1}')));
});
