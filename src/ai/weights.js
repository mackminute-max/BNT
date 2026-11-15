// Provisional additive utility and perception weights. All overrides are validated.
export const utilityDefaults = Object.freeze({
  // Provisional combat-value preferences/priors; normalized features are bounded.
  combatDamageValue: 4,
  combatDisruptionValue: 4,
  combatSelfRisk: 4,
  combatControlRisk: 8,
  combatProgressCost: 1,
  combatRetaliationCost: 1,
  combatConditionCost: 3,
  combatFutilityCost: 3,
  combatDamageUnit: 10,
  combatSpeedUnit: 2,
  combatUnknownSkill: 50,
  combatUnknownProtection: 50,
  combatUnknownCondition: 100,
  combatUnknownMassRatio: 1,
  perceptionBase: 0.2,
  perceptionSkill: 0.8,
  dangerGap: 1.5,
  hazardGap: 2,
  passClearance: 2,
  passLookahead: 5,
  laneTrafficGap: 3,
  overtakeGap: 4,
  defendGap: 3,
  stressInstability: 0.5,
  conserveBase: 1,
  conserveFatigueBase: 2,
  conserveStamina: 6.666666666666667,
  conserveCaution: 1,
  maintainBase: 2,
  maintainPatience: 1,
  pushBase: 1.6,
  pushAggression: 1.6666666666666667,
  pushFatigue: 5,
  sprintBase: 0.7,
  sprintOpportunity: 2,
  sprintAggression: 1,
  sprintFatigue: 8,
  holdBase: 2,
  holdPatience: 1.25,
  holdDanger: 5,
  laneBase: 0.3,
  insideBonus: 0.8,
  laneOpportunityBase: 2,
  laneOpportunism: 4,
  laneTrafficPenalty: 4,
  overtakeBase: 2,
  overtakeOpportunity: 3.3333333333333335,
  overtakeAggression: 1,
  avoidBase: 4,
  avoidCaution: 3.3333333333333335,
  yieldBase: 3,
  yieldCaution: 2.5,
  defendBase: 1,
  defendAggression: 1,
});
export function utilityConfig(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Invalid utility weights");
  const result = { ...utilityDefaults, ...input };
  for (const [key, value] of Object.entries(result))
    if (
      !Object.hasOwn(utilityDefaults, key) ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    )
      throw new Error(`Invalid utility weight ${key}`);
  return Object.freeze(result);
}
