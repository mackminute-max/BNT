import { isDomainCommand, validateDomainCommand, domainResult } from './domain-commands.js';
import { canonical, checksum } from '../core/determinism.js';
import { exact, id, validateTransaction as validateLegacyTransaction } from './legacy-state.js';
export const MAX_PROTECTED_COMMANDS = 2000;
export const RETENTION_CLASSES = Object.freeze({ P0: 'Protected identities, requests and effects: never discarded', P1: 'Summarizable detail: future explicit confirmation', P2: 'Provably redundant detail: future safe maintenance only' });
export function validateCommandV1(tx) {
  if (isDomainCommand(tx)) { validateDomainCommand(tx); return; }
  exact(tx, ['id', 'profileId', 'careerId', 'expectedRevision', 'type', 'delta', 'reason', 'commandVersion', 'expectedMaintenanceRevision', 'effectId'], 'versioned command');
  validateLegacyTransaction(legacyRequest(tx));
  if (tx.commandVersion !== 1 || !Number.isSafeInteger(tx.expectedMaintenanceRevision) || tx.expectedMaintenanceRevision < 0) throw Error('Invalid command/maintenance version');
  effectId(tx.effectId);
}
export function legacyRequest(tx) {
  return Object.fromEntries(['id', 'profileId', 'careerId', 'expectedRevision', 'type', 'delta', 'reason'].map(k => [k, tx[k]]));
}
function effectId(value) { if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(value)) throw Error('Invalid protected effect ID'); }
export function protectTransaction(tx, balanceAfter = null) {
  const version = Object.hasOwn(tx, 'commandVersion') ? 1 : 0;
  if (version) validateCommandV1(tx); else validateLegacyTransaction(tx);
  return { id: tx.id, profileId: tx.profileId, careerId: tx.careerId, commandVersion: version,
    request: canonical(tx), fingerprint: checksum(tx), resultRevision: tx.expectedRevision + 1,
    effectId: version ? tx.effectId : 'legacy-' + tx.id, delta: tx.delta, balanceAfter, retention: 'P0', ...(isDomainCommand(tx) ? { result: domainResult(tx) } : {}) };
}
export function validateProtected(entry) {
  exact(entry, ['id', 'profileId', 'careerId', 'commandVersion', 'request', 'fingerprint', 'resultRevision', 'effectId', 'delta', 'balanceAfter', 'retention', ...(Object.hasOwn(entry, 'result') ? ['result'] : [])], 'protected history identity');
  id(entry.id); id(entry.profileId); id(entry.careerId); effectId(entry.effectId);
  if (typeof entry.request !== 'string' || entry.request.length > 3000 || entry.retention !== 'P0' || ![0, 1].includes(entry.commandVersion)) throw Error('Invalid protected request');
  const request = JSON.parse(entry.request);
  if (entry.commandVersion === 0) validateLegacyTransaction(request); else validateCommandV1(request);
  const expected = protectTransaction(request, entry.balanceAfter);
  if (!Number.isSafeInteger(entry.resultRevision) || entry.resultRevision < 1) throw Error('Invalid protected result revision');
  if (canonical(expected) !== canonical(entry) || (entry.balanceAfter !== null && (!Number.isSafeInteger(entry.balanceAfter) || entry.balanceAfter < 0))) throw Error('Protected request fingerprint/effect mismatch');
  return entry;
}
export function mergeProtected(...lists) {
  const commands = new Map(), effects = new Map(), owners = new Map();
  for (const incoming of lists.flat()) {
    validateProtected(incoming); const previous = commands.get(incoming.id);
    if (previous) {
      const a = { ...previous, balanceAfter: null }, b = { ...incoming, balanceAfter: null };
      if (canonical(a) !== canonical(b) || (previous.balanceAfter !== null && incoming.balanceAfter !== null && previous.balanceAfter !== incoming.balanceAfter)) throw Error('Conflicting protected transaction ID');
      if (previous.balanceAfter !== null) continue;
    }
    const key = incoming.careerId + ':' + incoming.effectId;
    if (effects.has(key) && effects.get(key) !== incoming.id) throw Error('Protected effect identity reused by another command');
    if (owners.has(incoming.careerId) && owners.get(incoming.careerId) !== incoming.profileId) throw Error('Protected career ownership conflict');
    effects.set(key, incoming.id); owners.set(incoming.careerId, incoming.profileId);
    commands.set(incoming.id, structuredClone(incoming));
  }
  if (commands.size > MAX_PROTECTED_COMMANDS) throw Error('Protected history limit reached; no P0 identity was discarded');
  return [...commands.values()].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}
export function completeProtectedRegistry(entries, legacyMarks) {
  const base = mergeProtected(entries), known = new Set(base.map(e => e.id));
  const missing = legacyMarks.filter(m => !known.has(m.id)).map(m => protectTransaction({
    id: m.id, profileId: m.profileId, careerId: m.careerId, expectedRevision: m.revision - 1,
    type: m.type, delta: m.delta, reason: m.reason,
  }));
  return mergeProtected(base, missing);
}
export function protectedFromState(state) {
  if (!state) return [];
  if (state.schema === 2) return state.history.commands;
  const receipts = state.transactions.map(r => protectTransaction(r.transaction, r.balanceAfter));
  // M1 provenance exactly records these request fields, even when its receipt was lost
  // through an earlier explicit recovery. Never fabricate a balance/result receipt.
  const tombstones = state.provenance.map(m => protectTransaction({ id: m.id, profileId: m.profileId, careerId: m.careerId, expectedRevision: m.revision - 1, type: m.type, delta: m.delta, reason: m.reason }));
  return mergeProtected(receipts, tombstones);
}
export function lookupCommitted(entries, tx, receipts = []) {
  const previous = entries.find(e => e.id === tx.id);
  if (!previous) return null;
  if (previous.request !== canonical(tx)) throw Error('Conflicting protected transaction ID');
  return { status: 'ALREADY_COMMITTED', duplicate: true, receipt: structuredClone(receipts.find(r => r.transaction.id === tx.id) ?? null) };
}
export function assertProtectedRetention(before, after) {
  const merged = mergeProtected(before, after);
  if (canonical(merged) !== canonical(mergeProtected(after))) throw Error('P0 protected identities or known effect facts would be lost');
  return true;
}
export function historyRetentionPlan(state) {
  return { gameplayRevision: state.revision, maintenanceRevision: state.maintenanceRevision ?? 0,
    classes: { ...RETENTION_CLASSES }, protectedCommands: protectedFromState(state).map(e => e.id),
    protectedEffects: protectedFromState(state).map(e => e.effectId), remove: [], summarize: [],
    canCompact: false, reason: 'Compaction execution is deferred to M2-E; no history is removed in M2-A' };
}
