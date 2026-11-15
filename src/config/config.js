export const VERSION = "0.4.1-m4";
// Bounds and units are shared by validation and diagnostic UI.
export const rules = {
  dt: [0.001, 1, "s"],
  epsilon: [1e-12, 1e-7, "s"],
  positionEpsilon: [1e-10, 1e-5, "tile"],
  maxSubevents: [1, 10000, "groups/tick"],
  laps: [1, 100, "laps"],
  lanes: [1, 8, "lanes"],
  straightLength: [1, 2000, "m"],
  innerRadius: [2, 500, "m"],
  laneWidth: [1, 10, "m"],
  straightTiles: [2, 200, "tiles/straight"],
  turnTiles: [2, 200, "tiles/turn"],
  gridGap: [1, 10, "tiles"],
  gridOffset: [0.05, 0.95, "tile"],
  grip: [0.1, 2, "multiplier"],
  speedReference: [1, 100, "m/s"],
  accelerationReference: [0.1, 30, "m/s²"],
  accelerationLimit: [0.1, 50, "m/s²"],
  brakingReference: [0.1, 50, "m/s²"],
  lateralReference: [0.1, 30, "m/s²"],
  referenceMass: [1, 5000, "kg"],
  referencePower: [1, 1000, "score"],
  driverMass: [1, 300, "kg"],
  beastLoadMass: [0, 1000, "kg/beast"],
  bottleneck: [0, 1, "weight"],
  mismatchWeight: [0, 0.5, "weight"],
  attributeStrength: [0, 1.8, "strength"],
  cornerRisk: [0, 10, "risk coefficient"],
  cornerSpeedLoss: [0, 0.9, "fraction"],
  clearSpeed: [1, 50, "m/s"],
  exitTiles: [1, 10, "tiles after line"],
  finishTolerance: [0, 0.1, "s"],
  maxRaceTime: [1, 20000, "s"],
  stallTime: [1, 1000, "s"],
};
export const defaults = {
  schema: 1,
  dt: 0.05,
  epsilon: 1e-9,
  positionEpsilon: 1e-8,
  maxSubevents: 1024,
  laps: 3,
  lanes: 4,
  straightLength: 160,
  innerRadius: 35,
  laneWidth: 4,
  straightTiles: 20,
  turnTiles: 20,
  gridGap: 2,
  gridOffset: 0.5,
  grip: 1,
  speedReference: 18,
  accelerationReference: 3,
  accelerationLimit: 8,
  brakingReference: 6,
  lateralReference: 5,
  referenceMass: 300,
  referencePower: 100,
  driverMass: 75,
  beastLoadMass: 10,
  bottleneck: 0.3,
  mismatchWeight: 0.12,
  attributeStrength: 0.8,
  cornerRisk: 0.4,
  cornerSpeedLoss: 0.25,
  clearSpeed: 10,
  exitTiles: 3,
  finishTolerance: 0.001,
  maxRaceTime: 1200,
  stallTime: 20,
};
// Numerical balance weights live here; config({ tuning: {...} }) validates overrides.
export const tuningDefaults = Object.freeze({
  crowdSensitivity: 0.2,
  coordinationBase: 0.65,
  coordinationDiscipline: 0.25,
  coordinationHandling: 0.2,
  coordinationMin: 0.5,
  coordinationMax: 1.1,
  impairment: 0.5,
  handlingAgility: 0.35,
  handlingManeuverability: 0.25,
  handlingDriving: 0.25,
  handlingStability: 0.15,
  controlDiscipline: 0.3,
  controlDriving: 0.25,
  controlHandling: 0.25,
  controlStability: 0.2,
  massExponent: 0.5,
  speedMassExponent: 0.25,
  chariotSpeedFloor: 0.5,
  combatSkill: 0.6,
  combatEquipment: 0.2,
  combatControl: 0.2,
  paceConserve: 0.6,
  paceMaintain: 0.85,
  pacePush: 0.95,
  paceSprint: 1,
  safeCornerFraction: 0.95,
});
const integers = new Set([
  "maxSubevents",
  "laps",
  "lanes",
  "straightTiles",
  "turnTiles",
  "gridGap",
  "exitTiles",
]);
export function config(overrides = {}) {
  if (!overrides || typeof overrides !== "object" || Array.isArray(overrides))
    throw new Error("Configuration must be an object");
  for (const k of Object.keys(overrides))
    if (!Object.hasOwn(defaults, k) && k !== "tuning")
      throw new Error(`Unknown configuration field: ${k}`);
  const tuning = { ...tuningDefaults, ...overrides.tuning };
  if (
    overrides.tuning !== undefined &&
    (!overrides.tuning ||
      typeof overrides.tuning !== "object" ||
      Array.isArray(overrides.tuning))
  )
    throw new Error("Invalid tuning object");
  for (const [k, v] of Object.entries(tuning))
    if (
      !Object.hasOwn(tuningDefaults, k) ||
      !Number.isFinite(v) ||
      v < 0 ||
      v > 2
    )
      throw new Error(`Invalid tuning.${k}: expected 0..2`);
  if (
    tuning.crowdSensitivity > 1 ||
    tuning.impairment > 1 ||
    tuning.chariotSpeedFloor > 1 ||
    tuning.coordinationMin > tuning.coordinationMax
  )
    throw new Error("Invalid tuning limits");
  for (const group of [
    [
      "handlingAgility",
      "handlingManeuverability",
      "handlingDriving",
      "handlingStability",
    ],
    [
      "controlDiscipline",
      "controlDriving",
      "controlHandling",
      "controlStability",
    ],
    ["combatSkill", "combatEquipment", "combatControl"],
  ])
    if (Math.abs(group.reduce((sum, k) => sum + tuning[k], 0) - 1) > 1e-9)
      throw new Error("Tuning weight group must sum to 1");
  const c = { ...defaults, ...overrides, tuning: Object.freeze(tuning) };
  if (c.schema !== 1) throw new Error("Unsupported configuration schema");
  for (const [k, [lo, hi]] of Object.entries(rules)) {
    if (
      !Number.isFinite(c[k]) ||
      c[k] < lo ||
      c[k] > hi ||
      (integers.has(k) && !Number.isInteger(c[k]))
    )
      throw new Error(
        `Invalid ${k}: expected ${lo}..${hi}${integers.has(k) ? " integer" : ""}`,
      );
  }
  if (c.exitTiles >= c.straightTiles - Math.floor(c.straightTiles / 2))
    throw new Error("Exit must fit inside first straight");
  if (c.epsilon >= c.dt / 1000)
    throw new Error("Event epsilon too large for tick");
  return Object.freeze(c);
}
