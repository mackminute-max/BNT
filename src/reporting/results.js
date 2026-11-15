import { classification } from "../sim/race.js";
import { narrative } from "./commentary.js";
export function statistics(s) {
  const count = (type) => s.events.filter((e) => e.type === type).length;
  const decisions = [];
  const latest = new Map();
  const byDecision = new Map();
  for (const e of s.events) {
    if (e.type === "AI_DECISION" && !e.effects.compliance)
      latest.delete(e.participants[0]);
    if (e.type === "AI_DECISION" && (e.effects.sign || e.effects.compliance)) {
      const sample = { ...e.effects };
      decisions.push(sample);
      latest.set(e.participants[0], sample);
      if (e.effects.decisionId != null) byDecision.set(e.effects.decisionId, sample);
    }
    if (e.type === "AI_EXECUTION_RESULT") {
      const sample = e.effects.decisionId != null
        ? byDecision.get(e.effects.decisionId)
        : latest.get(e.participants[0]);
      if (sample) sample.compliance = e.effects.compliance;
    }
  }
  const compliance = {};
  for (const d of decisions)
    if (d.compliance) compliance[d.compliance] = (compliance[d.compliance] ?? 0) + 1;
  const finishFatigue = s.entrants
    .filter((r) => r.finishTime !== null)
    .flatMap((r) => r.finishSnapshot?.beasts.map((b) => b.fatigue) ?? []);
  return {
    version: s.version,
    seed: s.seed,
    configRevision: s.configRevision,
    fatigueAtFinish: finishFatigue.length
      ? finishFatigue.reduce((a, b) => a + b, 0) / finishFatigue.length
      : null,
    duration: s.time,
    status: s.status,
    finishes: s.entrants.filter((r) => r.finishTime !== null).length,
    dnfs: s.entrants.filter((r) => r.status === "Retired").length,
    overtakes: count("OVERTAKE"),
    collisions: count("CONTACT"),
    attacks: count("ATTACK"),
    successfulAttacks: s.events.filter(
      (e) => e.type === "ATTACK" && e.effects.success,
    ).length,
    successfulDefenses: s.events.filter(
      (e) => e.type === "ATTACK" && !e.effects.success && e.effects.reacted,
    ).length,
    damageEvents: count("DAMAGE"),
    damage: s.events
      .filter((e) => e.type === "DAMAGE")
      .reduce((n, e) => n + e.effects.amount, 0),
    wrecks: Object.keys(s.wrecks).length,
    incidents: count("INCIDENT"),
    signQueues: count("SIGN_QUEUED"),
    signActivations: count("SIGN_ACTIVATED"),
    signCompliance: compliance,
    diagnostics: s.diagnostics,
    entrants: s.entrants.map((r) => ({
      id: r.id,
      status: r.status,
      physical: r.physical,
      condition: {
        driver: r.ru.driver.condition,
        chariot: r.ru.chariot.condition,
        beasts: r.ru.beasts.map((b) => b.condition),
      },
      fatigue: r.ru.beasts.map((b) => b.fatigue),
      finishSnapshot: r.finishSnapshot ? structuredClone(r.finishSnapshot) : null,
      strain: r.ru.driver.strain,
      wear: r.ru.chariot.wear,
      signs: r.signs,
      retirement: r.retirement,
    })),
  };
}
export function results(s) {
  return {
    version: s.version,
    seed: s.seed,
    setup: structuredClone(s.setup),
    official: classification(s),
    narrative: narrative(s.events),
    technical: statistics(s),
  };
}
