import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createRace,
  step,
  run,
  digest,
  capture,
  assertState,
  classification,
  issueSign,
} from "../src/sim/race.js";
import { defaultRU, derive } from "../src/model/ru.js";
import {
  retire,
  updateControl,
  queueImpact,
  queueHazardImpact,
  flushImpacts,
  resolveAttacks,
} from "../src/sim/consequences.js";
import { updateIncidents } from "../src/sim/incidents.js";
import { entrant } from "./fixtures.js";
const race = (opts) =>
  createRace({
    driverMode: "reference",
    consequence: { incidentRate: 0 },
    ...opts,
  });
const refresh = (s) => (r) => {
  r.derived = derive(r.ru, s.config);
};
function duel(options = {}) {
  const a = entrant("A", 0, -0.5, 10),
    b = entrant("B", 1, -0.5, 10);
  a.ru.driver.combat = 100;
  a.ru.equipment.combat = 100;
  b.ru.driver.combat = 0;
  b.ru.driver.driving = 0;
  return race({ format: "Combat", entrants: [a, b], ...options });
}
test("T10 Pure rejects offensive intents, while incidental contact still causes damage", () => {
  const s = duel({ format: "Pure" });
  step(s, [{ type: "attack", id: "A", target: "B", action: "attack" }]);
  assert.equal(s.events.filter((e) => e.type === "ATTACK").length, 0);
  assert.ok(s.events.some((e) => e.type === "ATTACK_INVALIDATED"));
  assert.equal(s.events.filter((e) => e.type === "DAMAGE").length, 0);
  const c = race({
    entrants: [entrant("A", 0, -3.1, 40), entrant("B", 0, -0.5)],
    overrides: { dt: 1 },
  });
  step(c);
  assert.ok(c.events.some((e) => e.type === "DAMAGE"));
  assert.ok(c.events.find((e) => e.type === "CONTACT").time < 1);
  assertState(c);
});
test("T11 contest margin produces component damage and cooldown prevents repeated attacks", () => {
  const s = duel({
    consequence: { incidentRate: 0, contestNoise: 0, reactionBonus: 0 },
  });
  const before = s.entrants[1].ru.driver.condition;
  step(s, [{ type: "attack", id: "A", target: "B", action: "attack" }]);
  const attack = s.events.find((e) => e.type === "ATTACK");
  assert.ok(attack.effects.margin > 0 && attack.effects.success);
  assert.ok(s.events.some((e) => e.type === "DAMAGE"));
  const count = s.events.filter((e) => e.type === "ATTACK").length;
  step(s, [{ type: "attack", id: "A", target: "B", action: "attack" }]);
  assert.equal(s.events.filter((e) => e.type === "ATTACK").length, count);
  assert.ok(
    s.events.some(
      (e) =>
        e.type === "ATTACK_INVALIDATED" &&
        e.effects.reason.includes("cooldown"),
    ),
  );
});
test("T11 reaction budget is shared across simultaneous attackers and deterministic under permutation", () => {
  const make = () =>
    race({
      format: "Combat",
      entrants: [entrant("A", 0), entrant("B", 2), entrant("C", 1)],
      consequence: { incidentRate: 0, attackDamage: 1 },
    });
  const a = make(),
    b = make();
  b.entrants.reverse();
  const intents = [
    { type: "attack", id: "A", target: "C", action: "attack" },
    { type: "attack", id: "B", target: "C", action: "attack" },
  ];
  resolveAttacks(a, intents, refresh(a));
  resolveAttacks(b, [...intents].reverse(), refresh(b));
  assert.equal(a.events.filter((e) => e.type === "ATTACK").length, 2);
  assert.equal(
    a.events.filter(
      (e) => e.type === "REACTION" && e.participants.includes("C"),
    ).length,
    1,
  );
  assert.equal(a.entrants.find((r) => r.id === "C").reactionsRemaining, 0);
  assert.equal(digest(a), digest(b));
});
test("Same-time lethal attack invalidates the later initiative action without spending another reaction", () => {
  const a = duel({
    consequence: {
      incidentRate: 0,
      contestNoise: 0,
      reactionBonus: 0,
      attackSkillMultiplier: 100,
      attackDamage: 10000,
      attackDriver: 1,
      attackBeasts: 0,
      attackChariot: 0,
    },
  });
  a.entrants[1].ru.driver.combat = 100;
  a.entrants[1].derived = derive(a.entrants[1].ru, a.config);
  resolveAttacks(
    a,
    [
      { id: "A", target: "B", action: "attack" },
      { id: "B", target: "A", action: "attack" },
    ],
    refresh(a),
  );
  assert.equal(a.events.filter((e) => e.type === "ATTACK").length, 1);
  assert.equal(
    a.events.filter((e) => e.type === "ATTACK_INVALIDATED").length,
    1,
  );
  assert.equal(a.entrants.filter((r) => r.physical === "Wreck").length, 1);
  assertState(a);
});
test("Lateral ram has separate physical energy, recoil and unique contact provenance", () => {
  const s = duel({
    consequence: { incidentRate: 0, contestNoise: 0, reactionBonus: 0 },
  });
  step(s, [{ type: "attack", id: "A", target: "B", action: "ram" }]);
  assert.ok(
    s.events.some(
      (e) =>
        e.type === "ATTACK" && e.effects.action === "ram" && e.effects.success,
    ),
  );
  const hit = s.events.filter((e) => e.type === "DAMAGE");
  assert.equal(hit.length, 2);
  assert.ok(hit.every((e) => e.effects.energy > 0 && e.effects.kind === "ram"));
  assert.equal(hit[0].effects.contactId, hit[1].effects.contactId);
  assertState(s);
});
test("T12 control progression and disabled components create persistent stationary one-tile wreck", () => {
  const s = duel(),
    r = s.entrants[0];
  r.instability = 20;
  updateControl(s, r);
  assert.equal(r.control, "Unstable");
  r.instability = 50;
  updateControl(s, r);
  assert.equal(r.control, "Out of Control");
  r.ru.driver.condition = 0;
  updateControl(s, r, "fixture damage");
  assert.equal(r.status, "Retired");
  assert.equal(r.physical, "Wreck");
  assert.equal(r.speed, 0);
  const anchored = { q: r.q, lane: r.lane };
  for (let i = 0; i < 50; i++) step(s);
  assert.deepEqual({ q: r.q, lane: r.lane }, anchored);
  assert.equal(
    s.events.filter(
      (e) => e.type === "WRECK_CREATED" && e.participants.includes(r.id),
    ).length,
    1,
  );
  assertState(s);
});
test("T13/T14/E05 stationary contact does not repeat damage; renewed closing motion causes new impact", () => {
  const s = race({
    entrants: [entrant("A", 0, -3.1, 30), entrant("B", 0, -0.5)],
    overrides: { dt: 1 },
    consequence: {
      incidentRate: 0,
      damageScale: 0.00001,
      energyInstability: 0,
    },
  });
  retire(s, s.entrants[1], "fixture");
  step(s);
  const first = s.events.filter((e) => e.type === "DAMAGE").length;
  assert.ok(first > 0);
  for (let i = 0; i < 4; i++) step(s);
  assert.equal(s.events.filter((e) => e.type === "DAMAGE").length, first);
  s.entrants[0].speed = 10;
  step(s);
  assert.ok(s.events.filter((e) => e.type === "DAMAGE").length > first);
  assert.equal(s.entrants[1].q, -0.5);
  assert.ok(s.events.some((e) => e.type === "WRECK_IMPACT"));
  assertState(s);
});
test("E06 high-speed wreck chain creates additional permanent wrecks without phasing", () => {
  const a = entrant("A", 0, -0.5),
    b = entrant("B", 0, -2.1, 60),
    c = entrant("C", 0, -4.1, 60);
  a.ru.driver.condition = 0;
  const s = race({
    entrants: [a, b, c],
    overrides: { dt: 1 },
    consequence: {
      incidentRate: 0,
      damageScale: 10,
      frontDriver: 1,
      frontBeasts: 0,
      frontChariot: 0,
    },
  });
  step(s);
  for (let i = 0; i < 3 && s.status === "Running"; i++) step(s);
  assert.equal(s.entrants.filter((r) => r.physical === "Wreck").length, 3);
  assert.equal(s.status, "Ended");
  assert.ok(s.events.filter((e) => e.type === "WRECK_IMPACT").length >= 2);
  assert.ok(
    classification(s).every((r) => r.status === "Retired" && r.time !== null),
  );
  assertState(s);
});
test("T15 four-lane wreck barrier terminates explicitly with DNF reasons, no invented finish", () => {
  const s = createRace({
    consequence: { incidentRate: 0, damageScale: 0, energyInstability: 0 },
    overrides: { stallTime: 1, maxRaceTime: 20 },
  });
  for (const r of s.entrants.slice(0, 4)) r.ru.driver.condition = 0;
  run(s);
  assert.equal(s.status, "Stalled");
  assert.ok(s.events.some((e) => e.type === "RACE_STALLED"));
  assert.ok(
    s.entrants.every((r) => r.finishTime === null && r.status === "Retired"),
  );
  assert.ok(s.entrants.every((r) => r.retirement.reason));
  assertState(s);
});
test("E07 all entrants retired yields valid classification and race end", () => {
  const s = duel();
  for (const r of s.entrants) retire(s, r, "all retired");
  step(s);
  assert.equal(s.status, "Ended");
  assert.ok(classification(s).every((r) => r.status === "Retired"));
});
test("E08 retirement cancels pending sign with no refund and no subsequent activation", () => {
  const s = duel();
  issueSign(s, "queue", "Push the Pace");
  const r = s.entrants[0];
  retire(s, r, "fixture");
  step(s);
  assert.equal(r.signs.remaining, 2);
  assert.equal(r.signs.pending, null);
  assert.equal(s.events.filter((e) => e.type === "SIGN_ACTIVATED").length, 0);
});
test("Damage exposure is directional, targets individual beasts/driver/chariot and impairs performance", () => {
  const seen = new Set();
  for (let seed = 1; seed <= 60; seed++) {
    const s = race({ seed, entrants: [entrant("A")] }),
      r = s.entrants[0];
    queueHazardImpact(s, r, { id: "sample", type: "animal" }, 20);
    flushImpacts(s, refresh(s));
    for (const e of s.events.filter((e) => e.type === "DAMAGE"))
      seen.add(e.effects.component);
  }
  assert.deepEqual([...seen].sort(), [
    "beast:0",
    "beast:1",
    "chariot",
    "driver",
  ]);
  const s = race({
      entrants: [entrant("A")],
      consequence: {
        incidentRate: 0,
        frontBeasts: 1,
        frontDriver: 0,
        frontChariot: 0,
      },
    }),
    r = s.entrants[0],
    before = r.derived.acceleration;
  queueHazardImpact(s, r, { id: "sample", type: "animal" }, 20);
  flushImpacts(s, refresh(s));
  assert.ok(r.derived.acceleration < before);
  assert.ok(
    s.events
      .find((e) => e.type === "DAMAGE")
      .effects.component.startsWith("beast:"),
  );
});
test("E13 incidents cannot be placed on occupied or exit tiles; expiry is chronological", () => {
  const s = race({
    entrants: [entrant("A")],
    scheduledIncidents: [
      { time: 0.025, type: "debris", lane: 0, tile: 79, duration: 1 },
      { time: 0.025, type: "animal", lane: 1, tile: 5, duration: 0.1 },
    ],
  });
  step(s);
  assert.equal(s.events.filter((e) => e.type === "INCIDENT_SKIPPED").length, 1);
  const event = s.events.find((e) => e.type === "INCIDENT");
  assert.equal(event.time, 0.025);
  assert.equal(s.hazards.length, 1);
  step(s);
  step(s);
  assert.equal(s.hazards.length, 0);
  assert.ok(
    Math.abs(s.events.find((e) => e.type === "INCIDENT_CLEARED").time - 0.125) <
      1e-9,
  );
});
test("Incident obstruction is checked by swept paths and impacts cause damage", () => {
  const s = race({
    entrants: [entrant("A", 0, -0.5, 40)],
    overrides: { dt: 1 },
    scheduledIncidents: [
      { time: 0, type: "debris", lane: 0, tile: 4, duration: 5 },
    ],
  });
  step(s);
  assert.ok(s.events.some((e) => e.type === "INCIDENT_IMPACT"));
  assert.ok(s.events.some((e) => e.type === "DAMAGE"));
  assert.ok(s.entrants[0].q < 4);
  assertState(s);
});
test("Incident generation is optional, weighted and repeatable; schedule/config validation rejects bad inputs", () => {
  const a = race({ consequence: { incidentRate: 0.2 } }),
    b = race({ consequence: { incidentRate: 0.2 } });
  run(a);
  run(b);
  assert.ok(a.events.some((e) => e.type === "INCIDENT"));
  assert.equal(digest(a), digest(b));
  const none = run(race({ overrides: { laps: 1 } }));
  assert.equal(none.events.filter((e) => e.type === "INCIDENT").length, 0);
  assert.throws(() => race({ consequence: { reactionBudget: 1.5 } }));
  assert.throws(() =>
    race({
      scheduledIncidents: [
        { time: 0, type: "dragon", lane: 0, tile: 5, duration: 1 },
      ],
    }),
  );
});
test("E16 impact-chain overflow and moved wreck are explicit integrity errors", () => {
  const s = race({
    entrants: [
      entrant("A", 0, -3.1, 40),
      entrant("B", 0, -0.5),
      entrant("C", 1, -3.1, 40),
      entrant("D", 1, -0.5),
    ],
    overrides: { dt: 1 },
    consequence: { incidentRate: 0, maxChainEvents: 1 },
  });
  step(s);
  assert.equal(s.status, "Error");
  assert.match(s.events.at(-1).effects.message, /chain budget/);
  const w = duel();
  retire(w, w.entrants[0], "fixture");
  w.entrants[0].q += 1;
  step(w);
  assert.equal(w.status, "Error");
  assert.match(w.events.at(-1).effects.message, /Wreck moved/);
});
test("Finished classification remains locked after a disabling clearing collision", () => {
  const s = duel();
  const r = s.entrants[0];
  r.status = "Finished";
  r.physical = "Clearing";
  r.finishTime = 1.23456;
  r.ru.driver.condition = 0;
  updateControl(s, r, "post-finish impact");
  assert.equal(r.physical, "Wreck");
  assert.equal(r.status, "Finished");
  assert.equal(r.finishTime, 1.23456);
  assert.equal(classification(s)[0].status, "Finished");
  assertState(s);
});
test("Pure and Combat full consequences reproduce across entrant order and captured commands", () => {
  for (const format of ["Pure", "Combat"]) {
    const a = createRace({
        format,
        overrides: { laps: 1 },
        consequence: { incidentRate: 0.02 },
      }),
      b = createRace(a.setup);
    b.entrants.reverse();
    run(a);
    run(b);
    assert.notEqual(a.status, "Error");
    assert.equal(digest(a), digest(b));
    const record = capture(a),
      replay = run(createRace(record.setup), { commands: record.commands });
    assert.equal(digest(a), digest(replay));
    if (format === "Pure")
      assert.equal(a.events.filter((e) => e.type === "ATTACK").length, 0);
    assertState(a);
  }
});

test("E11 lethal contact before finish prevents qualification; post-finish impact preserves official time", () => {
  const make = (offset) => {
    const s = race({
      entrants: [entrant("A", 0), entrant("B", 0, -3)],
      overrides: { dt: 1 },
      consequence: {
        incidentRate: 0,
        damageScale: 10,
        frontDriver: 1,
        frontBeasts: 0,
        frontChariot: 0,
      },
    });
    const [a, b] = s.entrants;
    a.q = 3 * s.track.cells - 0.1;
    a.speed = 30;
    a.hasEnteredCourse = true;
    a.completedLaps = 2;
    a.lastCrossingQ = 2 * s.track.cells;
    b.q = offset;
    retire(s, b, "fixture");
    return s;
  };
  const before = make(0.5);
  step(before);
  assert.equal(before.entrants[0].finishTime, null);
  assert.equal(before.entrants[0].status, "Retired");
  const after = make(1.5);
  step(after);
  const r = after.entrants[0];
  assert.ok(r.finishTime > 0);
  assert.equal(r.status, "Finished");
  assert.equal(r.physical, "Wreck");
  assert.ok(
    after.events.find((e) => e.type === "RU_FINISHED").time <
      after.events.find(
        (e) => e.type === "DAMAGE" && e.participants.includes("A"),
      ).time,
  );
  assertState(after);
});
test("Out-of-control braking and recovery are scheduled within the physical clock", () => {
  const s = race({
      entrants: [entrant("A", 0, -0.5, 10)],
      overrides: { dt: 1 },
    }),
    r = s.entrants[0];
  r.instability = 45;
  updateControl(s, r);
  assert.equal(r.control, "Out of Control");
  step(s);
  assert.equal(r.control, "Unstable");
  assert.ok(r.speed < 10);
  assert.ok(
    s.events.some(
      (e) => e.type === "CONTROL_CHANGED" && e.effects.cause === "Recovery",
    ),
  );
});
test("Engage Rivals influences real legal Combat choices without physical stat buffs", () => {
  const a = entrant("A", 0),
    b = entrant("B", 1);
  a.ru.driver.personality = {
    aggression: 100,
    caution: 0,
    patience: 0,
    opportunism: 100,
    staminaManagement: 50,
    tacticalDiscipline: 100,
  };
  const s = createRace({
    format: "Combat",
    entrants: [a, b],
    autonomous: {
      noise: 0,
      judgmentError: 0,
      executionError: 0,
      stressError: 0,
      signStrength: 100,
    },
    consequence: { incidentRate: 0 },
  });
  issueSign(s, "queue", "Engage Rivals");
  step(s);
  assert.ok(
    s.events.some((e) => e.type === "ATTACK" && e.participants.includes("A")),
  );
  assert.ok(
    s.entrants[0].ai.diagnostics.candidates.some(
      (c) => ["attack", "ram"].includes(c.action) && c.terms.sign > 0,
    ),
  );
});
test("Structured event history does not change when live diagnostics change", () => {
  const s = createRace({
    overrides: { laps: 1 },
    consequence: { incidentRate: 0 },
  });
  step(s);
  const event = s.events.find((e) => e.type === "AI_DECISION"),
    saved = JSON.stringify(event);
  s.entrants.find((r) =>
    event.participants.includes(r.id),
  ).ai.diagnostics.compliance = "test mutation";
  assert.equal(JSON.stringify(event), saved);
});

test("Reaction budget is retained across subevent calls and refreshed only at next tick", () => {
  const s = race({
    format: "Combat",
    entrants: [entrant("A", 0), entrant("B", 2), entrant("C", 1)],
    consequence: { incidentRate: 0, attackDamage: 0 },
  });
  resolveAttacks(s, [{ id: "A", target: "C", action: "attack" }], refresh(s));
  resolveAttacks(s, [{ id: "B", target: "C", action: "attack" }], refresh(s));
  const r = s.entrants.find((r) => r.id === "C");
  assert.equal(r.reactionsRemaining, 0);
  assert.equal(s.events.filter((e) => e.type === "REACTION").length, 1);
  step(s);
  assert.equal(r.reactionsRemaining, 1);
});
test("Active combat defense changes contest strength; out-of-control defender cannot react", () => {
  const a = duel({ consequence: { incidentRate: 0, contestNoise: 0 } }),
    b = duel({ consequence: { incidentRate: 0, contestNoise: 0 } });
  b.entrants[1].defending = true;
  resolveAttacks(a, [{ id: "A", target: "B", action: "attack" }], refresh(a));
  resolveAttacks(b, [{ id: "A", target: "B", action: "attack" }], refresh(b));
  assert.ok(
    b.events.find((e) => e.type === "ATTACK").effects.defense >
      a.events.find((e) => e.type === "ATTACK").effects.defense,
  );
  const c = duel();
  c.entrants[1].control = "Out of Control";
  resolveAttacks(c, [{ id: "A", target: "B", action: "attack" }], refresh(c));
  assert.equal(c.events.filter((e) => e.type === "REACTION").length, 0);
});
test("Overspeed corner can crash into a permanent wreck at its final resolved tile", () => {
  const s = race({
      entrants: [entrant("A", 0, -0.5, 70)],
      overrides: { cornerRisk: 10 },
      consequence: { incidentRate: 0, cornerShock: 100 },
    }),
    r = s.entrants[0];
  r.q = 9.9;
  step(s, [{ type: "pace", id: "A", pace: "Sprint" }]);
  assert.equal(r.status, "Retired");
  assert.equal(r.physical, "Wreck");
  assert.equal(r.q, 10);
  assert.equal(r.speed, 0);
  assertState(s);
});
test("E03 simultaneous physical contact groups use shared pre-effect inputs", () => {
  const entries = [
    entrant("A", 0, -3.1, 40),
    entrant("B", 0, -0.5),
    entrant("C", 1, -3.1, 40),
    entrant("D", 1, -0.5),
  ];
  entries[1].ru.driver.condition = entries[3].ru.driver.condition = 0;
  const a = race({ entrants: entries, overrides: { dt: 1 } }),
    b = createRace(a.setup);
  b.entrants.reverse();
  step(a);
  step(b);
  assert.equal(digest(a), digest(b));
  const contacts = a.events.filter((e) => e.type === "CONTACT");
  assert.equal(contacts.length, 2);
  assert.equal(contacts[0].time, contacts[1].time);
  assertState(a);
});

test("Vacating lateral reservation rejects the trailing intent without fabricated impact damage", () => {
  const s = race({
    entrants: [entrant("A", 0, -0.5, 10), entrant("B", 1, -0.5, 10)],
  });
  step(s, [
    { type: "lane", id: "A", lane: 1 },
    { type: "lane", id: "B", lane: 2 },
  ]);
  assert.deepEqual(
    s.entrants.map((r) => r.lane),
    [0, 2],
  );
  assert.equal(s.events.filter((e) => e.type === "DAMAGE").length, 0);
  assert.ok(s.events.some((e) => e.type === "MOVEMENT_CONFLICT"));
  assertState(s);
});

test("Stable RU IDs cannot collide with object prototype names in the wreck registry", () => {
  for (const id of ["constructor", "__proto__"]) {
    const s = race({ entrants: [entrant(id)] });
    retire(s, s.entrants[0], "fixture");
    assert.ok(Object.hasOwn(s.wrecks, id));
    assert.equal(Object.values(s.wrecks).length, 1);
    assertState(s);
    step(s);
    assert.equal(s.status, "Ended");
  }
});
