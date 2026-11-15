import { clamp } from "../core/determinism.js";

// Decision estimates only. This module receives one actor and its perceived
// neighbors, never authoritative opponents, and makes no random draws.
export function contestChance(margin, noise) {
  if (noise <= 0) return margin > 0 ? 1 : 0;
  const span = 2 * noise;
  if (margin <= -span) return 0;
  if (margin >= span) return 1;
  return margin < 0
    ? (margin + span) ** 2 / (2 * span ** 2)
    : 1 - (span - margin) ** 2 / (2 * span ** 2);
}

export function combatValue(action, own, target, perceived, config, combat, utility, grip, terminalPhase = null) {
  const w = utility, ru = own.ru, p = ru.driver.personality;
  const skill = w.combatUnknownSkill;
  const rivalCombat = skill * (config.tuning.combatSkill + config.tuning.combatControl);
  // Assume a fresh reaction. Hidden reaction budgets, defending flags, skills,
  // armor, damage and RNG values are deliberately not consulted.
  const defense = skill * (combat.defenseDriving + combat.defenseControl) +
    rivalCombat * combat.defenseCombat + combat.reactionBonus;
  const margin = own.derived.combat * combat.attackSkillMultiplier - defense;
  const chance = contestChance(margin, combat.contestNoise);
  const protection = w.combatUnknownProtection;
  const condition = w.combatUnknownCondition;
  const targetResistance = Math.max(.1,
    (1 + config.attributeStrength * ((condition / 100) * .5 - .5)) *
    (combat.componentResistanceBase + skill / 100) *
    (1 + protection / 100 * combat.protectionStrength) * grip);
  const targetMass = Math.max(1, config.referenceMass * w.combatUnknownMassRatio);
  const reducedMass = own.derived.mass * targetMass / (own.derived.mass + targetMass);
  const closing = Math.abs(own.speed - target.speed);
  const energy = .5 * reducedMass * (closing ** 2 + combat.ramSpeed ** 2);
  const sideWeights = combat.sideDriver + combat.sideChariot + combat.sideBeasts;
  const selfResistance = toughness => Math.max(.1,
    own.derived.collisionResistance *
    Math.max(.1, combat.componentResistanceBase + toughness / 100) *
    (1 + ru.chariot.protection / 100 * combat.protectionStrength) * grip);
  const selfAbsorption = (
    combat.sideDriver / selfResistance(ru.chariot.protection) +
    combat.sideChariot / selfResistance(ru.chariot.durability) +
    combat.sideBeasts * ru.beasts.reduce((sum, b) => sum + 1 / selfResistance(b.toughness), 0) / ru.beasts.length
  ) / sideWeights;
  const ram = action === "ram";
  const targetDamage = chance * (ram
    ? energy * combat.sideGeometry * combat.damageScale * .5 / targetResistance
    : combat.attackDamage * (1 + Math.min(combat.marginDamageCap, Math.max(0, margin) / 100)) / targetResistance);
  const selfDamage = ram ? chance * energy * combat.sideGeometry * combat.damageScale * .5 * selfAbsorption : 0;
  const damageUnit = Math.max(1, w.combatDamageUnit);
  const speedUnit = Math.max(1, w.combatSpeedUnit);
  const weakCondition = Math.min(ru.driver.condition, ru.chariot.condition,
    ru.beasts.reduce((sum, b) => sum + b.condition, 0) / ru.beasts.length) / 100;
  const estimatedSelfShock = selfDamage * combat.damageInstability +
    (ram ? chance * energy * combat.sideGeometry * combat.energyInstability * .5 : 0);
  const consequenceRisk = clamp(
    (selfDamage / Math.max(1, weakCondition * 100)) ** 2 +
    (estimatedSelfShock / Math.max(1, combat.outOfControlThreshold - own.instability)) ** 2, 0, 2);
  const danger = clamp(1 - weakCondition + own.instability / combat.outOfControlThreshold, 0, 2);
  const clearAhead = !perceived.neighbors.some(n => n.lane === own.lane && n.gap > 0 && n.gap < w.overtakeGap);
  const passing = perceived.neighbors.some(n => n.lane === own.lane && n.gap > 0 && n.gap < w.overtakeGap);
  const leadingTarget = target.gap < 0;
  const nearFinish = terminalPhase ?? (own.hasEnteredCourse && own.completedLaps >= config.laps - 1);
  const racingCost = (clearAhead ? .5 : 0) + (passing ? .5 : 0) +
    (leadingTarget ? .5 : 0) + (nearFinish ? .5 : 0);
  const retaliation = contestChance(rivalCombat * combat.attackSkillMultiplier -
    (ru.driver.driving * combat.defenseDriving + own.derived.combat * combat.defenseCombat +
      own.derived.control * combat.defenseControl + combat.reactionBonus), combat.contestNoise);
  const exposure = Math.min(2, perceived.neighbors.filter(n =>
    n.status === "Racing" && n.physical === "Live" &&
    Math.abs(n.lane - own.lane) <= 1 && Math.abs(n.gap) <= combat.attackRange).length / 2);
  // Relative speed loss is a racing tradeoff: slowing a faster adjacent rival
  // may help; slowing oneself beside a slower rival is usually counterproductive.
  const speedDisruption = ram ? chance * (target.speed - own.speed) *
    (1 - combat.sideSpeedRetention) / speedUnit : targetDamage / 100;
  const features = {
    expectedDamage: w.combatDamageValue * clamp(targetDamage / damageUnit, 0, 2),
    disruption: w.combatDisruptionValue * clamp(speedDisruption, -2, 2),
    selfRisk: -w.combatSelfRisk * clamp(selfDamage / damageUnit * (1 + danger + p.caution / 100), 0, 2),
    racingCost: -w.combatProgressCost * clamp(racingCost * (1 + p.patience / 100) +
      (ram ? chance * own.speed * (1 - combat.sideSpeedRetention) / speedUnit : 0), 0, 2),
    retaliationRisk: -w.combatRetaliationCost * clamp(retaliation * exposure *
      (1 + danger + p.caution / 100), 0, 2),
    conditionRisk: -w.combatConditionCost * danger,
    controlRisk: -w.combatControlRisk * consequenceRisk,
    futileContest: -w.combatFutilityCost * (1 - chance),
  };
  return { features, estimate: {
    model: "perceived-combat-value-v1", chance, targetDamage, selfDamage,
    estimatedTargetMass: targetMass, estimatedTargetSkill: skill,
    estimatedTargetCondition: condition, estimatedTargetProtection: protection,
    observedRelativeSpeed: target.speed - own.speed, speedDisruption,
    racingCost, retaliation, danger, estimatedSelfShock, consequenceRisk, unknownOpponentProperties: true,
  }};
}
