import { canonical } from '../core/determinism.js';
import { configuration } from '../dev/configuration.js';
import { VERSION } from '../config/config.js';

export const CAREER_SCHEMA = 1;
export const MAX_RECEIPTS = 1000;
export const MAX_MARKS = 2000;
const TYPE = 'developer.treasury.adjust';
const idPattern = /^[a-zA-Z0-9_-]{1,64}$/;
export function id(value) {
  if (typeof value !== 'string' || !idPattern.test(value) || ['__proto__', 'constructor', 'prototype', 'all'].includes(value)) throw Error('Invalid persistent ID');
}
export function exact(value, fields, label = 'object') {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) || Object.keys(value).length !== fields.length || fields.some(k => !Object.hasOwn(value, k))) throw Error('Invalid ' + label + ' fields');
}
function text(value, max = 100) { if (typeof value !== 'string' || !value.trim() || value.length > max) throw Error('Invalid text'); }
function integer(value, min = 0) { if (!Number.isSafeInteger(value) || value < min) throw Error('Invalid financial/revision integer'); }
export function validateMark(mark) {
  exact(mark, ['id', 'profileId', 'careerId', 'type', 'reason', 'delta', 'revision'], 'provenance');
  for (const key of ['id', 'profileId', 'careerId']) id(mark[key]);
  if (mark.type !== TYPE || !Number.isSafeInteger(mark.delta)) throw Error('Unsupported developer provenance');
  integer(mark.revision, 1); text(mark.reason, 500);
}
export function mergeMarks(...lists) {
  const marks = new Map();
  for (const mark of lists.flat()) {
    validateMark(mark);
    if (marks.has(mark.id) && canonical(marks.get(mark.id)) !== canonical(mark)) throw Error('Conflicting transaction provenance ID');
    marks.set(mark.id, structuredClone(mark));
  }
  const owners = new Map();
  for (const mark of marks.values()) {
    if (owners.has(mark.careerId) && owners.get(mark.careerId) !== mark.profileId) throw Error('Conflicting career ownership provenance');
    owners.set(mark.careerId, mark.profileId);
  }
  if (marks.size > MAX_MARKS) throw Error('Provenance limit reached; no records were discarded');
  return [...marks.values()].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}
export function validateTransaction(tx) {
  exact(tx, ['id', 'profileId', 'careerId', 'expectedRevision', 'type', 'delta', 'reason'], 'transaction');
  for (const key of ['id', 'profileId', 'careerId']) id(tx[key]);
  integer(tx.expectedRevision); text(tx.reason, 500);
  if (tx.type !== TYPE || !Number.isSafeInteger(tx.delta)) throw Error('Unsupported transaction or invalid treasury adjustment');
}
export function transactionMark(tx) {
  return { id: tx.id, profileId: tx.profileId, careerId: tx.careerId, type: tx.type, reason: tx.reason, delta: tx.delta, revision: tx.expectedRevision + 1 };
}
export function validateState(state) {
  exact(state, ['kind', 'schema', 'revision', 'profile', 'career', 'pendingRace', 'transactions', 'provenance'], 'career state');
  if (state.kind !== 'BNT-career-state' || state.schema !== CAREER_SCHEMA) throw Error('Unsupported career state schema');
  integer(state.revision);
  exact(state.profile, ['id', 'name', 'legacy', 'developerEdited'], 'Owner Profile');
  exact(state.profile.legacy, ['records'], 'Owner Legacy');
  // No Legacy progression policy is implemented in M1. Future content needs an explicit migration.
  if (!Array.isArray(state.profile.legacy.records) || state.profile.legacy.records.length) throw Error('Owner Legacy progression is not supported by M1');
  exact(state.career, ['id', 'ownerProfileId', 'name', 'status', 'treasury', 'developerEdited'], 'Career State');
  id(state.profile.id); id(state.career.id); id(state.career.ownerProfileId);
  text(state.profile.name); text(state.career.name); integer(state.career.treasury);
  if (state.profile.id === state.career.id || state.career.ownerProfileId !== state.profile.id || state.career.status !== 'Foundation') throw Error('Invalid career ownership/status reference');
  if (!Array.isArray(state.transactions) || state.transactions.length > MAX_RECEIPTS || state.revision !== state.transactions.length || !Array.isArray(state.provenance) || state.provenance.length > MAX_MARKS) throw Error('Invalid transaction history');
  const marks = mergeMarks(state.provenance), seen = new Set();
  if (marks.length !== state.provenance.length) throw Error('Duplicate provenance');
  for (const mark of marks) if (mark.profileId !== state.profile.id) throw Error('Invalid provenance entity reference');
  let balance = 0n;
  for (const [index, receipt] of state.transactions.entries()) {
    exact(receipt, ['transaction', 'resultRevision', 'balanceAfter'], 'receipt');
    const tx = receipt.transaction; validateTransaction(tx);
    if (seen.has(tx.id) || tx.profileId !== state.profile.id || tx.careerId !== state.career.id || tx.expectedRevision !== index || receipt.resultRevision !== index + 1) throw Error('Invalid receipt ID/revision/reference');
    seen.add(tx.id); balance += BigInt(tx.delta);
    if (balance < 0n || balance > BigInt(Number.MAX_SAFE_INTEGER) || receipt.balanceAfter !== Number(balance)) throw Error('Inconsistent treasury ledger');
    if (!marks.some(m => canonical(m) === canonical(transactionMark(tx)))) throw Error('Missing developer provenance');
  }
  if (Number(balance) !== state.career.treasury || state.profile.developerEdited !== Boolean(marks.length) || state.career.developerEdited !== marks.some(m => m.careerId === state.career.id)) throw Error('Inconsistent financial/developer-edited state');
  if (state.pendingRace !== null) {
    const p = state.pendingRace;
    exact(p, ['id', 'careerId', 'engineVersion', 'setup'], 'pending race checkpoint'); id(p.id); id(p.careerId);
    if (p.id === state.career.id || p.id === state.profile.id || p.careerId !== state.career.id || p.engineVersion !== VERSION) throw Error('Incompatible pending race version/reference');
    // Require a complete normalized start, never manufacture missing entrants/default assets.
    const normalized = configuration(p.setup).setup;
    if (canonical(normalized) !== canonical(p.setup)) throw Error('Pending race requires a complete normalized starting configuration');
  }
  return state;
}
export function withProvenance(state, knownMarks) {
  const next = structuredClone(validateState(state));
  if (knownMarks.some(m => m.careerId === next.career.id && m.profileId !== next.profile.id)) throw Error('Career provenance belongs to a different Owner Profile');
  next.provenance = mergeMarks(next.provenance, knownMarks.filter(m => m.profileId === next.profile.id));
  next.profile.developerEdited = Boolean(next.provenance.length);
  next.career.developerEdited = next.provenance.some(m => m.careerId === next.career.id);
  return validateState(next);
}
export function createCareer({ profileId, careerId, ownerName = 'Owner', careerName = 'M1 Foundation', pendingRace = null }) {
  return validateState({ kind: 'BNT-career-state', schema: CAREER_SCHEMA, revision: 0,
    profile: { id: profileId, name: ownerName, legacy: { records: [] }, developerEdited: false },
    career: { id: careerId, ownerProfileId: profileId, name: careerName, status: 'Foundation', treasury: 0, developerEdited: false },
    pendingRace: structuredClone(pendingRace), transactions: [], provenance: [] });
}
export function transact(state, transaction) {
  validateState(state); validateTransaction(transaction);
  if (transaction.profileId !== state.profile.id || transaction.careerId !== state.career.id) throw Error('Transaction entity reference mismatch');
  const previous = state.transactions.find(r => r.transaction.id === transaction.id);
  if (previous) {
    if (canonical(previous.transaction) !== canonical(transaction)) throw Error('Conflicting transaction ID');
    return { state: structuredClone(state), duplicate: true, receipt: structuredClone(previous) };
  }
  if (state.provenance.some(m => m.id === transaction.id)) throw Error('Transaction ID belongs to a previous imported/recovered timeline');
  if (transaction.expectedRevision !== state.revision) throw Error('Stale career revision');
  if (state.transactions.length >= MAX_RECEIPTS) throw Error('Transaction limit reached; no receipts were pruned');
  const balance = BigInt(state.career.treasury) + BigInt(transaction.delta);
  if (balance < 0n || balance > BigInt(Number.MAX_SAFE_INTEGER)) throw Error('Treasury must be a nonnegative safe integer');
  const next = structuredClone(state), receipt = { transaction: structuredClone(transaction), resultRevision: state.revision + 1, balanceAfter: Number(balance) };
  next.revision++; next.career.treasury = Number(balance); next.transactions.push(receipt);
  next.provenance = mergeMarks(next.provenance, [transactionMark(transaction)]);
  next.profile.developerEdited = next.career.developerEdited = true;
  validateState(next);
  return { state: next, duplicate: false, receipt: structuredClone(receipt) };
}
