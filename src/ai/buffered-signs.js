const BUFFERED_SIGN_ACTION = "buffer-delay-v1";
function boundaryEvents(s) {
  return s.events.filter((e) => e.type === "RACE_STARTED" || e.participants.includes(s.playerId) && ["LAP_ENTERED", "LAP_COMPLETED", "CHECKPOINT_CROSSED"].includes(e.type));
}
function eligibleBoundary(s, view) {
  return boundaryEvents(s).find((e) => e.type === "RACE_STARTED" ? view.preStart && view.viewTick === 0 && view.viewTime === 0 : e.time > view.viewTime + s.config.epsilon || e.tick === view.viewTick && e.time >= view.viewTime - s.config.epsilon);
}
function requestDelay(s, r, p) {
  const fields = ["version", "sign", "queueOrder", "viewTick", "viewTime", "boundaryEventId", "preStart"];
  if (!p || typeof p !== "object" || Object.keys(p).length !== fields.length || Object.keys(p).some((k) => !fields.includes(k)) || p.version !== 1 || typeof p.sign !== "string" || typeof p.preStart !== "boolean" || ![p.queueOrder, p.viewTick, p.boundaryEventId].every(Number.isSafeInteger) || p.queueOrder < 0 || p.viewTick < 0 || p.viewTick > s.tick || !Number.isFinite(p.viewTime) || p.viewTime < 0 || p.viewTime > s.time || p.viewTime < p.viewTick * s.config.dt - s.config.epsilon || p.viewTime > (p.viewTick + 1) * s.config.dt + s.config.epsilon || s.time - p.viewTime > 2 + s.config.dt + s.config.epsilon) throw Error("Invalid buffered Sign window");
  const queue = s.commands[p.queueOrder];
  if (!queue || queue.type !== "sign" || queue.action !== "queue" || queue.sign !== p.sign || queue.tick !== s.tick || r.signs.pending !== p.sign) throw Error("Buffered Sign must follow its accepted queue");
  if (s.commands.slice(p.queueOrder + 1, -1).some((c) => c.type === "sign")) throw Error("Buffered Sign was superseded or already marked");
  const e = eligibleBoundary(s, p);
  if (!e || e.id !== p.boundaryEventId || e.time > s.time + s.config.epsilon) throw Error("Boundary is not the next eligible presented crossing");
  return { requestOrder: s.commands.length - 1, sign: p.sign, queueOrder: p.queueOrder, boundaryEventId: e.id, boundaryTick: e.tick, acceptedTick: s.tick };
}
function pendingDelay(s, r) {
  if (r.id !== s.playerId || !r.signs.pending) return null;
  for (let i = s.commands.length - 1; i >= 0; i--) {
    const c = s.commands[i];
    if (c.type !== "sign") continue;
    if (c.action === "cancel" || c.action === "queue") return null;
    if (c.action === BUFFERED_SIGN_ACTION) {
      if (!s.events.some((e) => e.type === "SIGN_DELAY_REQUESTED" && e.effects.requestOrder === i)) continue;
      const p = c.sign, q = s.commands[p?.queueOrder];
      if (q?.action !== "queue" || q.sign !== r.signs.pending || p.sign !== r.signs.pending) return null;
      return { mode: BUFFERED_SIGN_ACTION, boundaryEventId: p.boundaryEventId, queueOrder: p.queueOrder, acceptedTick: c.tick };
    }
  }
  return null;
}
export {
  BUFFERED_SIGN_ACTION,
  boundaryEvents,
  eligibleBoundary,
  pendingDelay,
  requestDelay
};
