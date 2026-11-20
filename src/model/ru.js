import { clamp } from "../core/determinism.js";
export const beastAttributes = [
  "speed",
  "power",
  "agility",
  "endurance",
  "discipline",
  "toughness",
];
export const driverAttributes = [
  "driving",
  "beastHandling",
  "combat",
  "awareness",
  "nerve",
];
export const chariotAttributes = [
  "stability",
  "durability",
  "protection",
  "rollingEfficiency",
  "maneuverability",
];
export function component(keys, value = 50) {
  return Object.fromEntries([
    ...keys.map((k) => [k, value]),
    ["condition", 100],
  ]);
}
export function defaultRU(id, value = 50) {
  return {
    id,
    driver: { ...component(driverAttributes, value), strain: 0 },
    beasts: [0, 1].map(() => ({
      ...component(beastAttributes, value),
      fatigue: 0,
    })),
    chariot: {
      ...component(chariotAttributes, value),
      weight: 180,
      capacity: 400,
      wear: 0,
    },
    equipment: { mass: 0, combat: 0 },
  };
}
function bounded(x, path, lo = 0, hi = 100) {
  if (!Number.isFinite(x) || x < lo || x > hi)
    throw new Error(`Invalid ${path}: ${lo}..${hi}`);
}
export function validateRU(ru) {
  if (
    !ru ||
    typeof ru.id !== "string" ||
    ru.id === "all" ||
    !/^[a-zA-Z0-9_-]{1,64}$/.test(ru.id)
  )
    throw new Error("Invalid RU id");
  if (!Array.isArray(ru.beasts) || ru.beasts.length < 1 || ru.beasts.length > 8)
    throw new Error(`Invalid beast team: ${ru.id}`);
  for (const [name, obj, attrs] of [
    ["driver", ru.driver, [...driverAttributes, "strain"]],
    ["chariot", ru.chariot, [...chariotAttributes, "wear"]],
    ...ru.beasts.map((b, i) => [
      `beast${i}`,
      b,
      [...beastAttributes, "fatigue"],
    ]),
  ]) {
    if (!obj) throw new Error(`Missing ${name}`);
    const allowed = new Set([
      ...attrs,
      "condition",
      ...(name === "driver"
        ? ["personality"]
        : name === "chariot"
          ? ["weight", "capacity"]
          : []),
    ]);
    if (Object.keys(obj).some((k) => !allowed.has(k)))
      throw new Error(`Unknown ${name} attribute`);
    for (const k of [...attrs, "condition"])
      bounded(obj[k], `${ru.id}.${name}.${k}`);
  }
  if (ru.driver.personality !== undefined) {
    const keys = [
      "aggression",
      "caution",
      "patience",
      "opportunism",
      "staminaManagement",
      "tacticalDiscipline",
    ];
    if (
      !ru.driver.personality ||
      typeof ru.driver.personality !== "object" ||
      Array.isArray(ru.driver.personality) ||
      Object.keys(ru.driver.personality).some((k) => !keys.includes(k))
    )
      throw new Error("Invalid personality fields");
    for (const key of keys)
      bounded(ru.driver.personality[key], `personality.${key}`);
  }
  bounded(ru.chariot.weight, "chariot weight", 1, 5000);
  bounded(ru.chariot.capacity, "capacity", 1, 10000);
  if (
    !ru.equipment ||
    Object.keys(ru.equipment).some((k) => !["mass", "combat"].includes(k))
  )
    throw new Error("Unknown equipment effect");
  bounded(ru.equipment?.mass, "equipment mass", 0, 10000);
  bounded(ru.equipment?.combat, "equipment combat", 0, 100);
}
// Optional prototype exhaustion curve. No extra arithmetic on legacy paths.
export function beastExhaustionFactor(fatigue, tuning) {
  if (!tuning.beastExhaustionStrength) return 1;
  const start = tuning.beastExhaustionStart ?? .65;
  const x = clamp((fatigue / 100 - start) / (1 - start), 0, 1);
  return 1 - tuning.beastExhaustionStrength * x * x * (3 - 2 * x);
}
export function derive(ru, c) {
  validateRU(ru);
  const w = c.tuning;
  const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const mult = (x) => 1 + c.attributeStrength * (x / 100 - 0.5);
  // Individual impairment is applied once, before aggregation, not again to final acceleration.
  const effective = ru.beasts.map((b) =>
    Object.fromEntries(
      beastAttributes.map((k) => [
        k,
        w.beastExhaustionStrength
          ? b[k] * (b.condition / 100) * (1 - (w.impairment * b.fatigue) / 100) * beastExhaustionFactor(b.fatigue, w)
          : b[k] * (b.condition / 100) * (1 - (w.impairment * b.fatigue) / 100),
      ]),
    ),
  );
  const values = (k) => effective.map((b) => b[k]);
  const bottleneck = (k) =>
    (1 - c.bottleneck) * mean(values(k)) +
    c.bottleneck * Math.min(...values(k));
  const mismatch =
    mean(
      ["speed", "agility", "discipline"].map(
        (k) => (Math.max(...values(k)) - Math.min(...values(k))) / 100,
      ),
    ) * c.mismatchWeight;
  const d = ru.driver,
    ch = ru.chariot;
  const coordination = clamp(
    w.coordinationBase +
      (w.coordinationDiscipline * mean(values("discipline"))) / 100 +
      (w.coordinationHandling * d.beastHandling) / 100 -
      mismatch,
    w.coordinationMin,
    w.coordinationMax,
  );
  const team = {
    speed: bottleneck("speed"),
    power: coordination * values("power").reduce((a, b) => a + b, 0),
    agility: bottleneck("agility"),
    endurance: mean(values("endurance")),
    discipline: Math.min(...values("discipline")),
    toughness: mean(values("toughness")),
  };
  const driverCondition =
    (d.condition / 100) * (1 - (w.impairment * d.strain) / 100);
  const chariotCondition =
    (ch.condition / 100) * (1 - (w.impairment * ch.wear) / 100);
  const mass =
    ch.weight +
    c.driverMass +
    ru.beasts.length * c.beastLoadMass +
    ru.equipment.mass;
  const load = (c.driverMass + ru.equipment.mass) / ch.capacity;
  const massFactor =
    Math.pow(c.referenceMass / mass, w.massExponent) / Math.max(1, load);
  const handling =
    (team.agility * w.handlingAgility +
      ch.maneuverability * w.handlingManeuverability +
      d.driving * driverCondition * w.handlingDriving +
      ch.stability * w.handlingStability) *
    chariotCondition;
  const morale =
    1 + ((c.crowdMorale ?? 1) - 1) * (1 - d.nerve / 100) * w.crowdSensitivity;
  const baseControl =
    (team.discipline * w.controlDiscipline +
      d.driving * driverCondition * w.controlDriving +
      d.beastHandling * driverCondition * w.controlHandling +
      ch.stability * w.controlStability) *
    chariotCondition;
  const control = clamp(baseControl * morale, 0, 100);
  const maxSpeed =
    c.speedReference *
    mult(team.speed) *
    mult(ch.rollingEfficiency) *
    Math.pow(massFactor, w.speedMassExponent) *
    (w.chariotSpeedFloor + (1 - w.chariotSpeedFloor) * chariotCondition);
  const acceleration = Math.min(
    c.accelerationLimit,
    ((c.accelerationReference * team.power) / c.referencePower) *
      massFactor *
      c.grip *
      mult(handling),
  );
  const endurance = team.endurance / Math.max(1, load);
  const resilience =
    ((team.toughness + ch.protection + ch.durability) / 3) * chariotCondition;
  const combat =
    (d.combat * w.combatSkill +
      ru.equipment.combat * w.combatEquipment +
      control * w.combatControl) *
    driverCondition;
  const braking = c.brakingReference * mult(handling) * c.grip;
  const lateral = c.lateralReference * mult(handling) * mult(control) * c.grip;
  return {
    team,
    morale,
    coordination,
    mismatch,
    mass,
    load,
    effective,
    maxSpeed,
    acceleration,
    handling,
    control,
    endurance,
    resilience,
    combat,
    braking,
    lateral,
    fatigueRate: 1 / mult(endurance),
    recovery: mult(endurance),
    collisionResistance: mult(resilience),
    awareness: d.awareness * driverCondition,
    nerve: d.nerve * driverCondition,
  };
}
