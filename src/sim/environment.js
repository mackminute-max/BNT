import {activeAbility} from './m6-interaction.js';
import { utilityConfig } from "../ai/weights.js";
import { location } from "../track/oval.js";
import { clamp } from "../core/determinism.js";
export const weatherPresets = Object.freeze({
  Clear: {
    grip: 1,
    visibility: 1,
    fatigue: 1,
    recovery: 1,
    rolling: 1,
    crowdMorale: 1,
  },
  Rain: {
    grip: 0.8,
    visibility: 0.8,
    fatigue: 1.1,
    recovery: 0.95,
    rolling: 1.05,
    crowdMorale: 1,
  },
  "Heavy Rain/Mud": {
    grip: 0.55,
    visibility: 0.6,
    fatigue: 1.35,
    recovery: 0.8,
    rolling: 1.3,
    crowdMorale: 1,
  },
  "Dust/Wind": {
    grip: 0.9,
    visibility: 0.45,
    fatigue: 1.15,
    recovery: 0.9,
    rolling: 1.1,
    crowdMorale: 1,
  },
  "Extreme Heat": {
    grip: 0.95,
    visibility: 0.9,
    fatigue: 1.7,
    recovery: 0.55,
    rolling: 1.05,
    crowdMorale: 1,
  },
});
export const m2Defaults = Object.freeze({
  decisionTicks: 10,
  perceptionTiles: 10,
  noise: 0.3,
  judgmentError: 0.08,
  executionError: 0.06,
  stressError: 0.08,
  goalTicks: 30,
  switchCost: 1.2,
  signUses: 3,
  signStrength: 5,
  fatigueRate: 0.13,
  recoveryRate: 0.2,
  strainRate: 0.025,
  wearRate: 0.001,
  recoveryThreshold: 0.6,
  exertionConserve: 0.45,
  exertionMaintain: 1,
  exertionPush: 1.75,
  exertionSprint: 3,
  signPush: 1,
  signConserve: 1,
  signOpen: 1,
  signDefensive: 1,
  signEngage: 1,
  signHold: 1,
});
export function m2Config(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Invalid autonomous tuning");
  const { utility, ...scalars } = input;
  const v = { ...m2Defaults, ...scalars };
  for (const [k, x] of Object.entries(v))
    if (
      (!Object.hasOwn(m2Defaults, k) && !['directiveAuthority','obedienceDisciplineCeiling','obedienceResistanceThreshold','accelerationFatiguePerSpeed','weaponStrainCost','ramStrainCost','ramFatigueCost'].includes(k)) ||
      !Number.isFinite(x) ||
      x < 0 ||
      x > 100
    )
      throw new Error(`Invalid autonomous tuning ${k}`);
  if(v.directiveAuthority!==undefined&&![0,1].includes(v.directiveAuthority))throw Error('Invalid directive authority');
  for (const k of ["decisionTicks", "goalTicks", "signUses"])
    if (!Number.isInteger(v[k]) || (k !== "signUses" && v[k] < 1))
      throw new Error(`Invalid ${k}`);
  for (const k of [
    "judgmentError",
    "executionError",
    "stressError",
    "recoveryThreshold",
  ])
    if (v[k] > 1) throw new Error(`Invalid probability ${k}`);
  return Object.freeze({ ...v, utility: utilityConfig(utility) });
}
export function integrateCondition(s, r, elapsed) {
  if (r.status !== "Racing") return;
  const w = s.environment,
    c = s.autonomous;
  const surface = location(r.q, r.lane, s.config, s.track).surface;
  const exertion = c[`exertion${r.pace}`] ?? 0;
  for (const b of r.ru.beasts) {
    const load = Math.max(1, r.derived.load);
    let generation =
      c.fatigueRate *
      exertion *
      load *
      w.fatigue *
      (1 + surface.roughness) *
      (1.5 - b.endurance / 100) *
      (1 + (100 - b.condition) / 100);
    if(r.affinityContext)generation/=r.affinityContext.multiplier;
    if(activeAbility(s,r,'second-wind'))generation*=.5;
    let recovery =
      exertion <= c.recoveryThreshold
        ? c.recoveryRate * w.recovery * (0.5 + b.endurance / 100)
        : 0;
    if(activeAbility(s,r,'steady-team'))recovery*=1.25;
    b.fatigue = clamp(b.fatigue + (generation - recovery) * elapsed, 0, 100);
  }
  r.ru.driver.strain = clamp(
    r.ru.driver.strain +
      c.strainRate * (exertion + (r.control === "Unstable" ? 1 : 0)) * elapsed,
    0,
    100,
  );
  r.ru.chariot.wear = clamp(
    r.ru.chariot.wear +
      (r.progressionContext ? c.wearRate * exertion * w.rolling * (1 + surface.roughness) * elapsed * r.progressionContext.wearMultiplier : c.wearRate * exertion * w.rolling * (1 + surface.roughness) * elapsed),
    0,
    100,
  );
}

export function environmentConfig(weather, overrides = {}) {
  if (
    !Object.hasOwn(weatherPresets, weather) ||
    !overrides ||
    typeof overrides !== "object" ||
    Array.isArray(overrides)
  )
    throw new Error("Invalid environment");
  const value = { ...weatherPresets[weather], ...overrides };
  for (const [key, v] of Object.entries(value))
    if (
      !Object.hasOwn(weatherPresets[weather], key) ||
      !Number.isFinite(v) ||
      v < 0.1 ||
      v > 3
    )
      throw new Error(`Invalid environment.${key}: 0.1..3`);
  return Object.freeze(value);
}
