import { createRace } from "../src/sim/race.js";
import { defaultRU } from "../src/model/ru.js";
export function entrant(id, lane = 0, q = -0.5, speed = 0, value = 50) {
  return { ru: defaultRU(id, value), lane, q, speed };
}
export const fixtureDefinitions = {
  grid_eight: { seed: 145 },
  empty_track: { seed: 7, entrants: [entrant("A")] },
  lane_conflict: { seed: 17, entrants: [entrant("A", 0), entrant("B", 2)] },
  lane_swap: { seed: 17, entrants: [entrant("A", 0), entrant("B", 1)] },
  fast_corner: {
    seed: 17,
    entrants: [entrant("A", 0, -0.5, 70)],
    overrides: { cornerRisk: 10 },
  },
  mismatched_team: { seed: 19, entrants: [entrant("A")] },
  finish_photo: {
    seed: 23,
    entrants: [entrant("A", 0), entrant("B", 1)],
    // Precision tie fixture: calibrated to the original physics (schema 1, no
    // pack racing or race-day form, original attribute strength).
    overrides: { laps: 1, schema: 1, attributeStrength: 0.8 },
    consequence: { incidentRate: 0 },
  },
  rear_row_laps: {
    seed: 29,
    entrants: [entrant("A", 0, -0.5), entrant("B", 1, -2.5)],
  },
};
export function fixture(name, changes = {}) {
  return createRace({
    driverMode: "reference",
    consequences: false,
    ...structuredClone(fixtureDefinitions[name]),
    ...changes,
  });
}

// Complete mandatory catalog from document 05. Normalized setup snapshots below
// include the model version and every default; callers receive independent clones.
Object.assign(fixtureDefinitions, {
  fatigue_sprint: { seed: 31, driverMode: "autonomous", autonomous: { noise: 0, executionError: 0, judgmentError: 0, stressError: 0, utility: { sprintBase: 100 } }, entrants: [entrant("A")], consequence: { incidentRate: 0 } },
  rain_turn: { seed: 37, weather: "Rain", entrants: [entrant("A", 0, -0.5, 30)], overrides: { laps: 1 } },
  pure_contact: { seed: 41, format: "Pure", entrants: [entrant("A", 0, -1.1, 30), entrant("B")] },
  combat_duel: { seed: 43, format: "Combat", entrants: [entrant("A", 0, -0.5, 10), entrant("B", 1, -0.5, 10)] },
  single_wreck: { seed: 47, entrants: [entrant("A", 0, -1.1, 30), entrant("B")] },
  wreck_chain: { seed: 53, entrants: [entrant("A", 0, -2.1, 40), entrant("B", 0, -1.1, 20), entrant("C")], consequence: { incidentRate: 0, damageScale: 2 } },
  four_lane_blockage: { seed: 59, driverMode: "autonomous", overrides: { stallTime: 1, maxRaceTime: 20 }, consequence: { incidentRate: 0, damageScale: 0, energyInstability: 0 } },
  finish_exit_queue: { seed: 61, overrides: { laps: 1 }, driverMode: "autonomous", consequence: { incidentRate: 0 } },
  sign_replace: { seed: 67, entrants: [entrant("A")], driverMode: "autonomous" },
  sign_before_retirement: { seed: 71, entrants: [entrant("A")], driverMode: "autonomous" },
  override_replay: { seed: 73, entrants: [entrant("A")], driverMode: "autonomous", overrides: { laps: 1 }, checkpointInterval: 20 },
  all_retired: { seed: 79, entrants: [entrant("A"), entrant("B", 1)] },
});
// Fixture-only compensation for the outer lane's longer physical circuit.
// Standing start, unchanged tie tolerance, no position/lap/timestamp injection.
fixtureDefinitions.finish_photo.entrants[1].ru.chariot.rollingEfficiency = 57.34996687475359;
fixtureDefinitions.mismatched_team.entrants[0].ru.beasts[1].speed = 20;
fixtureDefinitions.mismatched_team.entrants[0].ru.beasts[1].agility = 20;
// Disablement is part of initial component configuration, not an unlogged live edit.
for (const name of ["single_wreck", "wreck_chain"])
  fixtureDefinitions[name].entrants.at(-1).ru.driver.condition = 0;
fixtureDefinitions.sign_before_retirement.entrants[0].ru.driver.condition = 0;
fixtureDefinitions.all_retired.entrants.forEach(e => e.ru.driver.condition = 0);
fixtureDefinitions.four_lane_blockage.entrants = Array.from({ length: 8 }, (_, i) => {
  const e = entrant(`RU${i + 1}`, i % 4, i < 4 ? -0.5 : -2.5);
  if (i < 4) e.ru.driver.condition = 0;
  return e;
});
const expectations = {
  empty_track: ["one entrant finishes without occupancy conflict"],
  grid_eight: ["eight stationary entrants in two aligned rows", "one occupant per lane/tile"],
  lane_conflict: ["one deterministic winner for a common target tile"],
  lane_swap: ["occupied swept paths prevent an impossible simultaneous swap"],
  fast_corner: ["overspeed creates seeded corner risk rather than a hard speed cap"],
  mismatched_team: ["weaker beast changes bottleneck and coordination performance"],
  fatigue_sprint: ["Sprint increases per-beast fatigue, strain and wear"],
  rain_turn: ["rain changes grip and safe corner speed"],
  pure_contact: ["incidental contact causes consequences", "offensive attacks are rejected"],
  combat_duel: ["legal attack produces a contest and consumes limited defense reactions"],
  single_wreck: ["disabled B remains a stationary one-tile obstruction"],
  wreck_chain: ["new impacts may disable another entrant without moving the original wreck"],
  four_lane_blockage: ["explicit stalled termination without fabricated finishes"],
  finish_photo: ["same-time finishers share official place within tolerance"],
  rear_row_laps: ["first crossing enters lap one rather than completing a lap"],
  finish_exit_queue: ["all finishers keep locked times and clear legally"],
  sign_replace: ["replacement consumes another use and pending differs from active"],
  sign_before_retirement: ["retired entrant never activates pending sign or refunds allowance"],
  override_replay: ["paused boundary override logs old/new and reconstructs exactly"],
  all_retired: ["race ends with valid DNF classification and persistent wrecks"],
};
const openingCommands = {
  lane_conflict: [{ type: "lane", id: "A", lane: 1 }, { type: "lane", id: "B", lane: 1 }],
  lane_swap: [{ type: "lane", id: "A", lane: 1 }, { type: "lane", id: "B", lane: 0 }],
  fatigue_sprint: [{ type: "pace", id: "A", pace: "Sprint" }],
  combat_duel: [{ type: "attack", id: "A", target: "B", action: "attack" }],
};
export const fixtureCatalog = Object.fromEntries(Object.entries(fixtureDefinitions).map(([name, setup]) => {
  const s = createRace({ driverMode: "reference", consequences: true, consequence: { incidentRate: 0 }, ...structuredClone(setup) });
  return [name, {
    version: s.version,
    seed: s.seed,
    setup: structuredClone(s.setup),
    openingCommands: openingCommands[name] ?? [],
    expectedInvariants: expectations[name],
  }];
}));
export function scenario(name) {
  if (!Object.hasOwn(fixtureCatalog, name)) throw new Error(`Unknown scenario ${name}`);
  return createRace(structuredClone(fixtureCatalog[name].setup));
}
