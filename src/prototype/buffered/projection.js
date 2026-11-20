function staticView(s) {
  return { version: s.version, seed: s.seed, config: s.config, track: s.track, format: s.format, playerId: s.playerId, environment: s.environment, autonomous: s.autonomous, weather: s.weather };
}
function frameView(s, revision = 0) {
  return { tick: s.tick, time: s.time, status: s.status, revision, eventCount: s.events.length, hazards: s.hazards.map((h) => ({ ...h })), entrants: s.entrants.map((r) => ({ id: r.id, q: r.q, lane: r.lane, speed: r.speed, pace: r.pace, status: r.status, physical: r.physical, control: r.control, blocked: r.blocked, completedLaps: r.completedLaps, hasEnteredCourse: r.hasEnteredCourse, checkpointCursor: r.checkpointCursor, finishTime: r.finishTime, signs: { ...r.signs }, ru: { driver: { condition: r.ru.driver.condition, strain: r.ru.driver.strain }, beasts: r.ru.beasts.map((b) => ({ fatigue: b.fatigue, condition: b.condition })), chariot: { condition: r.ru.chariot.condition, wear: r.ru.chariot.wear } }, ai: { diagnostics: r.ai.diagnostics ? { sign: r.ai.diagnostics.sign, directive: r.ai.diagnostics.directive, reason: r.ai.diagnostics.reason, compliance: r.ai.diagnostics.compliance, effective: r.ai.diagnostics.effective, executionError: r.ai.diagnostics.executionError, stressError: r.ai.diagnostics.stressError } : null } })) };
}
function eventView(e) {
  if (e.type !== "AI_DECISION") return e;
  const d = e.effects;
  return { ...e, effects: { decisionId: d.decisionId, directive: d.directive, sign: d.sign, reason: d.reason, compliance: d.compliance, executionError: d.executionError, stressError: d.stressError } };
}
export {
  eventView,
  frameView,
  staticView
};
