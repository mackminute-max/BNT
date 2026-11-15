import { resolveAction } from "../ai/telemetry.js";
import { byId, clamp, random } from "../core/determinism.js";
import { location, mod } from "../track/oval.js";
import { emit } from "../events/events.js";

export const consequenceDefaults = Object.freeze({
  componentResistanceBase: 0.5,
  damageScale: 0.003,
  protectionStrength: 1,
  minimumImpact: 0.2,
  renewedSpeed: 0.75,
  sideSpeed: 1.5,
  ramSpeed: 5,
  frontGeometry: 1,
  sideGeometry: 0.6,
  rearGeometry: 0.7,
  attackSpeedRetention: 1,
  struckSpeedRetention: 0.8,
  sideSpeedRetention: 0.9,
  maxChainEvents: 128,
  attackSkillMultiplier: 1.2,
  attackRange: 1.25,
  ramRange: 0.75,
  attackCooldown: 1.2,
  reactionBudget: 1,
  contestNoise: 8,
  reactionBonus: 10,
  defendingBonus: 12,
  attackDamage: 7,
  marginDamageCap: 1,
  defenseDriving: 0.4,
  defenseCombat: 0.4,
  defenseControl: 0.2,
  unstableThreshold: 15,
  outOfControlThreshold: 40,
  disabledThreshold: 100,
  damageInstability: 1,
  energyInstability: 0.0002,
  controlRecovery: 5,
  cornerShock: 22,
  disabledCondition: 5,
  minimumTeamCondition: 10,
  frontBeasts: 4,
  frontDriver: 0.5,
  frontChariot: 1,
  sideBeasts: 1,
  sideDriver: 2,
  sideChariot: 4,
  rearBeasts: 0.5,
  rearDriver: 1,
  rearChariot: 5,
  attackBeasts: 1,
  attackDriver: 3,
  attackChariot: 1,
  attackBase: 0.3,
  attackAggression: 3,
  attackOpportunity: 1.5,
  attackCaution: 2,
  ramBase: 0.2,
  ramAggression: 3,
  ramOpportunity: 1,
  ramCaution: 2,
  defendBase: 0.5,
  defendCaution: 3,
  disengageBase: 0.5,
  disengageCaution: 2,
  disengageFatigue: 2,
  incidentRate: 0.002,
  incidentDuration: 12,
  incidentMinimumInterval: 0.1,
  debrisWeight: 6,
  animalWeight: 2,
  spectatorWeight: 1,
  debrisMass: 20,
  animalMass: 100,
  spectatorMass: 70,
});
export function consequenceConfig(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Invalid consequence configuration");
  const c = { ...consequenceDefaults, ...input };
  for (const [key, value] of Object.entries(c))
    if (
      !Object.hasOwn(consequenceDefaults, key) ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 10000
    )
      throw new Error(`Invalid consequence.${key}`);
  for (const k of ["reactionBudget", "maxChainEvents"])
    if (!Number.isInteger(c[k])) throw new Error(`Invalid integer ${k}`);
  if (
    c.maxChainEvents < 1 ||
    c.attackCooldown <= 0 ||
    c.attackRange <= 0 ||
    c.ramRange <= 0 ||
    c.incidentDuration <= 0 ||
    c.incidentMinimumInterval <= 0 ||
    c.incidentRate > 1
  )
    throw new Error("Invalid consequence time/range");
  if (
    !(
      c.unstableThreshold < c.outOfControlThreshold &&
      c.outOfControlThreshold < c.disabledThreshold
    ) ||
    c.controlRecovery <= 0
  )
    throw new Error("Invalid control thresholds");
  for (const k of ["disabledCondition", "minimumTeamCondition"])
    if (c[k] > 100) throw new Error("Invalid condition threshold");
  for (const k of [
    "struckSpeedRetention",
    "sideSpeedRetention",
    "attackSpeedRetention",
  ])
    if (c[k] > 1) throw new Error("Invalid speed retention");
  for (const direction of ["front", "side", "rear", "attack"])
    if (
      c[direction + "Beasts"] +
        c[direction + "Driver"] +
        c[direction + "Chariot"] <=
      0
    )
      throw new Error("Empty component exposure");
  if (c.debrisWeight + c.animalWeight + c.spectatorWeight <= 0)
    throw new Error("Empty incident weights");
  return Object.freeze(c);
}
export function drawConsequence(s, ...keys) {
  s.rng.draws++;
  return random(s.seed, "consequences", ...keys);
}
export function retire(s, r, reason, cause = null) {
  if (r.physical === "Wreck" || r.physical === "Exited" || r.status === "DNS")
    return;
  if (r.finishTime === null) {
    r.status = "Retired";
    r.retirement = { time: s.time, progress: r.q, reason, cause };
    emit(s, "RU_RETIRED", [r.id], { ...r.retirement });
  }
  r.physical = "Wreck";
  r.speed = 0;
  r.control = "Disabled";
  r.instability = s.consequence.disabledThreshold;
  r.blocked = true;
  if (r.signs.pending) {
    r.signs.pending = null;
    emit(s, "SIGN_CANCELED", [r.id], {
      reason: "RU retired",
      remaining: r.signs.remaining,
    });
  }
  r.signs.active = null;
  const wreck = Object.freeze({
    id: r.id,
    q: r.q,
    lane: r.lane,
    time: s.time,
    cause,
  });
  Object.defineProperty(s.wrecks, r.id, {
    value: wreck,
    enumerable: true,
    writable: false,
    configurable: false,
  });
  emit(s, "CONTROL_CHANGED", [r.id], { control: "Disabled", cause });
  emit(s, "WRECK_CREATED", [r.id], wreck);
}
export function updateControl(s, r, cause = null) {
  if (r.physical === "Wreck" || r.physical === "Exited" || r.status === "DNS")
    return;
  const c = s.consequence;
  if (
    r.ru.driver.condition <= c.disabledCondition ||
    r.ru.chariot.condition <= c.disabledCondition ||
    r.ru.beasts.every((b) => b.condition <= c.minimumTeamCondition) ||
    r.instability >= c.disabledThreshold
  ) {
    retire(s, r, "Disabled by damage or control loss", cause);
    return;
  }
  const next =
    r.instability > c.outOfControlThreshold
      ? "Out of Control"
      : r.instability > c.unstableThreshold
        ? "Unstable"
        : "Normal";
  if (next !== r.control) {
    r.control = next;
    if (next === "Out of Control")
      resolveAction(s, r, r.ai.diagnostics?.decisionId, "pace", false, "Out of control requires braking");
    emit(s, "CONTROL_CHANGED", [r.id], {
      control: next,
      instability: r.instability,
      cause,
    });
  }
}
export function controlTime(s, r) {
  if (!s.consequences || r.physical === "Wreck" || r.instability <= 0)
    return Infinity;
  const c = s.consequence;
  const threshold =
    r.instability > c.outOfControlThreshold
      ? c.outOfControlThreshold
      : r.instability > c.unstableThreshold
        ? c.unstableThreshold
        : 0;
  // At an exact threshold, schedule its departure by a finite epsilon rather than a zero-time loop.
  return Math.max(
    s.config.epsilon * 2,
    (r.instability - threshold) / c.controlRecovery,
  );
}
export function recoverControl(s, r, elapsed) {
  if (s.consequences && r.physical !== "Wreck") {
    r.instability = Math.max(
      0,
      r.instability - s.consequence.controlRecovery * elapsed,
    );
    updateControl(s, r, "Recovery");
  }
}
function exposure(s, r, direction, id) {
  const c = s.consequence,
    d = ["front", "rear", "side", "attack"].includes(direction)
      ? direction
      : "side";
  const candidates = [
    {
      name: "driver",
      component: r.ru.driver,
      weight: c[d + "Driver"],
      toughness: r.ru.chariot.protection,
    },
    {
      name: "chariot",
      component: r.ru.chariot,
      weight: c[d + "Chariot"],
      toughness: r.ru.chariot.durability,
    },
    ...r.ru.beasts.map((b, i) => ({
      name: `beast:${i}`,
      component: b,
      weight: c[d + "Beasts"] / r.ru.beasts.length,
      toughness: b.toughness,
    })),
  ];
  const total = candidates.reduce((n, x) => n + x.weight, 0);
  let pick = drawConsequence(s, "component", id, r.id, d) * total;
  return (
    candidates.find((x) => {
      pick -= x.weight;
      return pick < 0;
    }) ?? candidates.at(-1)
  );
}
export function queueImpact(
  s,
  a,
  b,
  cause,
  { speeds = null, side = false, ram = false, parentId = null } = {},
) {
  const pair = [a.id, b.id].sort().join("|"),
    c = s.consequence;
  const av = speeds?.get(a.id) ?? a.speed,
    bv = speeds?.get(b.id) ?? b.speed;
  const closing = side ? Math.abs(av - bv) : Math.max(0, av - bv);
  const active = s.contacts.includes(pair),
    last = s.contactHistory[pair];
  if (active && !s.consequences) return;
  if (
    active &&
    !ram &&
    (!(closing > c.renewedSpeed && !side) || last?.time === s.time)
  )
    return;
  if (!active) s.contacts.push(pair);
  const id = `contact:${s.nextImpact++}`;
  s.contactHistory[pair] = { time: s.time, id };
  emit(s, "CONTACT", [a.id, b.id], {
    contactId: id,
    cause,
    closing,
    parentId,
    initiator: a.id,
    other: b.id,
  });
  if (!s.consequences) return;
  const lateral = ram
    ? c.ramSpeed
    : side && Math.max(av, bv) > 0
      ? c.sideSpeed
      : 0;
  const relative = Math.hypot(closing, lateral);
  const effective =
    b.physical === "Wreck"
      ? a.derived.mass
      : (a.derived.mass * b.derived.mass) / (a.derived.mass + b.derived.mass);
  const energy = 0.5 * effective * relative * relative;
  if (relative < c.minimumImpact) return;
  s.pendingImpacts.push({
    id,
    a: a.id,
    b: b.id,
    energy,
    side,
    kind: ram ? "ram" : "contact",
    parentId,
    direction: side ? "side" : "front",
  });
}
export function queueHazardImpact(s, r, h, speed, side = false) {
  const pair = `${r.id}|${h.id}`;
  const last = s.contactHistory[pair];
  if (last && (last.time === s.time || speed <= s.consequence.renewedSpeed))
    return;
  const id = `contact:${s.nextImpact++}`;
  s.contactHistory[pair] = { time: s.time, id };
  const mass = s.consequence[h.type + "Mass"];
  const effective = (r.derived.mass * mass) / (r.derived.mass + mass);
  emit(s, "INCIDENT_IMPACT", [r.id], {
    contactId: id,
    incidentId: h.id,
    type: h.type,
  });
  s.pendingImpacts.push({
    id,
    a: r.id,
    b: null,
    energy: 0.5 * effective * speed * speed,
    direction: side ? "side" : "front",
    kind: "incident",
    parentId: h.id,
  });
}
// All damage in a simultaneous physical group uses pre-effect resistance/condition data.
export function flushImpacts(s, refresh) {
  const impacts = s.pendingImpacts.splice(0);
  if (!impacts.length) return;
  s.impactsThisTick += impacts.length;
  if (s.impactsThisTick > s.consequence.maxChainEvents)
    throw new Error("Impact chain budget exceeded");
  const before = new Map(s.entrants.map((r) => [r.id, structuredClone(r)]));
  const effects = [];
  for (const impact of impacts.sort((a, b) => a.id.localeCompare(b.id))) {
    for (const [id, direction, share] of [
      [impact.a, impact.direction, impact.b ? 0.5 : 1],
      ...(impact.b ? [[impact.b, impact.side ? "side" : "rear", 0.5]] : []),
    ]) {
      const r = before.get(id),
        live = s.entrants.find((x) => x.id === id),
        target = exposure(s, live, direction, impact.id);
      const protection =
        1 + (r.ru.chariot.protection / 100) * s.consequence.protectionStrength;
      const surface = location(r.q, r.lane, s.config, s.track).surface;
      const resistance =
        Math.max(0.1, r.derived.collisionResistance) *
        Math.max(
          0.1,
          s.consequence.componentResistanceBase + target.toughness / 100,
        ) *
        protection *
        Math.max(0.1, s.environment.grip * surface.grip);
      const geometry = s.consequence[direction + "Geometry"] ?? 1;
      const amount =
        impact.amount === undefined
          ? (impact.energy * geometry * s.consequence.damageScale * share) /
            resistance
          : impact.amount / resistance;
      effects.push({
        r: live,
        target,
        amount,
        impact,
        shock:
          amount * s.consequence.damageInstability +
          impact.energy * geometry * s.consequence.energyInstability * share,
      });
      if (r.physical === "Wreck")
        emit(
          s,
          "WRECK_IMPACT",
          [id, impact.a === id ? impact.b : impact.a].filter(Boolean),
          { contactId: impact.id, energy: impact.energy, wreckId: r.id },
        );
    }
  }
  for (const effect of effects) {
    const { r, target, amount, impact } = effect,
      old = target.component.condition;
    target.component.condition = clamp(old - amount, 0, 100);
    emit(s, "DAMAGE", [r.id], {
      contactId: impact.id,
      kind: impact.kind,
      parentId: impact.parentId ?? impact.id,
      component: target.name,
      amount: old - target.component.condition,
      before: old,
      after: target.component.condition,
      energy: impact.energy,
    });
  }
  const touched = [...new Set(effects.map((e) => e.r.id))].sort();
  for (const id of touched) {
    const r = s.entrants.find((r) => r.id === id),
      own = effects.filter((e) => e.r.id === id);
    r.instability += own.reduce((n, e) => n + e.shock, 0);
    if (r.physical !== "Wreck")
      r.speed *= own.some(
        (e) =>
          !e.impact.side && e.impact.a === id && e.impact.kind !== "attack",
      )
        ? 0
        : own.some((e) => e.impact.side)
          ? s.consequence.sideSpeedRetention
          : own.some((e) => e.impact.kind !== "attack")
            ? s.consequence.struckSpeedRetention
            : s.consequence.attackSpeedRetention;
    refresh(r);
    updateControl(s, r, own.map((e) => e.impact.id).join(","));
  }
}
export function eligibleCombat(s, a, b, action) {
  if (
    !s.consequences ||
    s.format !== "Combat" ||
    !a ||
    !b ||
    a.id === b.id ||
    a.status !== "Racing" ||
    b.status !== "Racing" ||
    a.physical !== "Live" ||
    b.physical !== "Live" ||
    a.control === "Out of Control"
  )
    return false;
  const gap = Math.abs(
      mod(b.q - a.q + s.track.cells / 2, s.track.cells) - s.track.cells / 2,
    ),
    lanes = Math.abs(a.lane - b.lane);
  return action === "ram"
    ? lanes === 1 && gap <= s.consequence.ramRange
    : action === "attack" && lanes <= 1 && gap <= s.consequence.attackRange;
}
export function resolveAttacks(s, intents, refresh) {
  const ordered = [...intents].sort(
    (a, b) =>
      random(s.seed, "initiative", s.tick, a.id) -
        random(s.seed, "initiative", s.tick, b.id) || byId(a, b),
  );
  for (const intent of ordered) {
    const a = s.entrants.find((r) => r.id === intent.id),
      b = s.entrants.find((r) => r.id === intent.target),
      c = s.consequence;
    if (
      !eligibleCombat(s, a, b, intent.action) ||
      s.time + s.config.epsilon < a.nextAttackTime
    ) {
      resolveAction(s, a, intent.decisionId, "position", false, "Combat execution invalidated");
      emit(
        s,
        "ATTACK_INVALIDATED",
        [intent.id, intent.target].filter(Boolean),
        {
          action: intent.action,
          reason:
            s.format === "Pure"
              ? "Offensive action prohibited"
              : "Range, control, cooldown or participant state",
        },
      );
      continue;
    }
    a.nextAttackTime = s.time + c.attackCooldown;
    const id = `attack:${s.nextAttack++}`,
      react = b.reactionsRemaining > 0 && b.control !== "Out of Control";
    if (react) {
      b.reactionsRemaining--;
      emit(s, "REACTION", [b.id, a.id], {
        attackId: id,
        remaining: b.reactionsRemaining,
        defending: b.defending,
      });
    }
    const attack =
      a.derived.combat * c.attackSkillMultiplier +
      (drawConsequence(s, id, "attacker") * 2 - 1) * c.contestNoise;
    const defense =
      b.ru.driver.driving * c.defenseDriving +
      b.derived.combat * c.defenseCombat +
      b.derived.control * c.defenseControl +
      (react ? c.reactionBonus : 0) +
      (react && b.defending ? c.defendingBonus : 0) +
      (drawConsequence(s, id, "defender") * 2 - 1) * c.contestNoise;
    const margin = attack - defense,
      success = margin > 0;
    emit(s, "ATTACK", [a.id, b.id], {
      attackId: id,
      attacker: a.id,
      defender: b.id,
      action: intent.action,
      attack,
      defense,
      margin,
      success,
      reacted: react,
    });
    resolveAction(s, a, intent.decisionId, "position", true, null, { combatResult: success ? "Hit" : "Defended", attackId: id });
    if (!success) continue;
    if (intent.action === "ram")
      queueImpact(s, a, b, "Deliberate lateral ram", {
        side: true,
        ram: true,
        parentId: id,
      });
    else
      s.pendingImpacts.push({
        id,
        a: b.id,
        b: null,
        energy: 0,
        amount:
          c.attackDamage * (1 + Math.min(c.marginDamageCap, margin / 100)),
        direction: "attack",
        kind: "attack",
      });
    flushImpacts(s, refresh);
  }
}
