import * as legacy from './legacy-state.js';
import { canonical, checksum } from '../core/determinism.js';
import { configuration } from '../dev/configuration.js';
import { VERSION } from '../config/config.js';
import { emptyManagement, validateManagement } from './registries.js';
import { mergeProtected, protectedFromState, protectTransaction, validateCommandV1, legacyRequest, lookupCommitted } from './history.js';

const CORE_FIELDS = ['kind', 'schema', 'revision', 'profile', 'career', 'pendingRace', 'transactions', 'provenance'];
export const SCHEMA2_FIELDS = [...CORE_FIELDS, 'maintenanceRevision', 'management', 'history', 'migration'];
export function revisionToken(state) { return { revision: state.revision, maintenanceRevision: state.maintenanceRevision ?? 0 }; }
export function assertRevision(state, revision, maintenance) {
  if (revision !== state.revision || maintenance !== (state.maintenanceRevision ?? 0)) throw Error('Stale gameplay or persistence-maintenance revision');
}
function validateInertPending(pending, state) {
  if (pending === null) return;
  legacy.exact(pending, ['id', 'careerId', 'engineVersion', 'setup'], 'inert pending checkpoint');
  legacy.id(pending.id); legacy.id(pending.careerId);
  if (pending.careerId !== state.career.id || [state.profile.id, state.career.id].includes(pending.id) || typeof pending.engineVersion !== 'string' || !pending.engineVersion.length || pending.engineVersion.length > 100) throw Error('Invalid inert checkpoint reference/version');
  if (!pending.setup || typeof pending.setup !== 'object' || Array.isArray(pending.setup) || !Array.isArray(pending.setup.entrants) || !pending.setup.entrants.length || !Number.isSafeInteger(pending.setup.seed)) throw Error('Incomplete inert pending record');
  if (pending.engineVersion === VERSION && canonical(configuration(pending.setup).setup) !== canonical(pending.setup)) throw Error('Pending record must retain complete normalized setup');
  // Other engine versions are inert data, never executed or silently replaced here.
  const seen = new Set();
  for (const entrant of pending.setup.entrants) { legacy.id(entrant?.ru?.id); if (seen.has(entrant.ru.id)) throw Error('Duplicate inert entrant identity'); seen.add(entrant.ru.id); }
}
export function validateStateV2(state) {
  legacy.exact(state, SCHEMA2_FIELDS, 'schema-2 career state');
  if (state.schema !== 2 || !Number.isSafeInteger(state.maintenanceRevision) || state.maintenanceRevision < 1) throw Error('Invalid schema-2 maintenance revision');
  const projection = Object.fromEntries(CORE_FIELDS.map(k => [k, state[k]]));
  projection.schema = 1; projection.pendingRace = null;
  projection.transactions = state.transactions?.map(r => ({ ...r, transaction: legacyRequest(r.transaction) }));
  legacy.validateState(projection);
  validateInertPending(state.pendingRace, state); validateManagement(state.management, state.career.id, state.profile.id);
  legacy.exact(state.history, ['schema', 'commands'], 'protected history');
  if (state.history.schema !== 1 || !Array.isArray(state.history.commands)) throw Error('Invalid protected history schema');
  const entries = mergeProtected(state.history.commands);
  if (canonical(entries) !== canonical(state.history.commands)) throw Error('Protected history must be unique and canonically ordered');
  for (const entry of entries) {
    if (entry.profileId !== state.profile.id || entry.careerId !== state.career.id) throw Error('Protected history entity reference mismatch');
    if (!state.provenance.some(m => canonical(m) === canonical(legacy.transactionMark(JSON.parse(entry.request))))) throw Error('Protected developer command lacks provenance');
  }
  for (const mark of state.provenance.filter(m => m.careerId === state.career.id)) if (!entries.some(e => e.id === mark.id)) throw Error('Developer identity missing from protected history');
  for (const r of state.transactions) {
    const expected = protectTransaction(r.transaction, r.balanceAfter);
    if (!entries.some(e => canonical(e) === canonical(expected))) throw Error('Receipt changed or missing protected request/effect fact');
    if (expected.commandVersion === 1 && r.transaction.expectedMaintenanceRevision > state.maintenanceRevision) throw Error('Receipt from a future maintenance revision');
  }
  const m = state.migration;
  legacy.exact(m, ['fromSchema', 'toSchema', 'sourceProfileId', 'sourceCareerId', 'sourceRevision', 'sourceTreasury', 'sourcePendingDigest', 'sourceStateDigest'], 'migration lineage');
  if (m.fromSchema !== 1 || m.toSchema !== 2 || m.sourceProfileId !== state.profile.id || m.sourceCareerId !== state.career.id || !Number.isSafeInteger(m.sourceRevision) || m.sourceRevision < 0 || m.sourceRevision > state.revision || !/^[0-9a-f]{8}$/.test(m.sourceStateDigest) || m.sourcePendingDigest !== (state.pendingRace === null ? null : checksum(state.pendingRace))) throw Error('Invalid migration identity/revision/checkpoint lineage');
  if (m.sourceTreasury !== (m.sourceRevision ? state.transactions[m.sourceRevision - 1].balanceAfter : 0)) throw Error('Migration treasury lineage mismatch');
  for (const [i, r] of state.transactions.entries()) {
    if (i < m.sourceRevision) legacy.validateTransaction(r.transaction);
    else validateCommandV1(r.transaction);
  }
  return state;
}
export function migrateStateV1(source) {
  legacy.validateState(source);
  const next = structuredClone(source);
  next.schema = 2; next.maintenanceRevision = 1; next.management = emptyManagement();
  next.history = { schema: 1, commands: protectedFromState(source).filter(e => e.profileId === source.profile.id && e.careerId === source.career.id) };
  next.migration = { fromSchema: 1, toSchema: 2, sourceProfileId: source.profile.id, sourceCareerId: source.career.id,
    sourceRevision: source.revision, sourceTreasury: source.career.treasury,
    sourcePendingDigest: source.pendingRace === null ? null : checksum(source.pendingRace), sourceStateDigest: checksum(source) };
  return validateStateV2(next);
}
export function withKnownHistoryV2(state, knownMarks, knownHistory = []) {
  validateStateV2(state);
  if (knownMarks.some(m => m.careerId === state.career.id && m.profileId !== state.profile.id) || knownHistory.some(e => e.careerId === state.career.id && e.profileId !== state.profile.id)) throw Error('Career history belongs to a different Owner Profile');
  const next = structuredClone(state);
  next.provenance = legacy.mergeMarks(next.provenance, knownMarks.filter(m => m.profileId === next.profile.id));
  next.profile.developerEdited = Boolean(next.provenance.length);
  next.career.developerEdited = next.provenance.some(m => m.careerId === next.career.id);
  next.history.commands = mergeProtected(next.history.commands, knownHistory.filter(e => e.profileId === next.profile.id && e.careerId === next.career.id));
  return validateStateV2(next);
}
export function transactV2(state, tx) {
  validateStateV2(state);
  const committed = lookupCommitted(state.history.commands, tx, state.transactions);
  if (committed) return { ...committed, state: structuredClone(state) };
  if (tx.type === 'career.initialize') throw Error('Career initialization requires the separately authorized M2-B transaction');
  validateCommandV1(tx);
  if (tx.profileId !== state.profile.id || tx.careerId !== state.career.id) throw Error('Command ownership mismatch');
  assertRevision(state, tx.expectedRevision, tx.expectedMaintenanceRevision);
  if (state.history.commands.some(e => e.effectId === tx.effectId)) throw Error('Effect identity already committed');
  if (state.transactions.length >= legacy.MAX_RECEIPTS) throw Error('Transaction limit reached; no protected history was discarded');
  const balance = BigInt(state.career.treasury) + BigInt(tx.delta);
  if (balance < 0n || balance > BigInt(Number.MAX_SAFE_INTEGER)) throw Error('Treasury must be a nonnegative safe integer');
  const next = structuredClone(state), receipt = { transaction: structuredClone(tx), resultRevision: state.revision + 1, balanceAfter: Number(balance) };
  next.revision++; next.career.treasury = Number(balance); next.transactions.push(receipt);
  next.provenance = legacy.mergeMarks(next.provenance, [legacy.transactionMark(tx)]);
  next.profile.developerEdited = next.career.developerEdited = true;
  next.history.commands = mergeProtected(next.history.commands, [protectTransaction(tx, Number(balance))]);
  return { state: validateStateV2(next), duplicate: false, receipt: structuredClone(receipt) };
}

// Isolated read views: callers cannot edit committed receipt or protected-history facts.
export function immutableHistoryView(state) {
  const view = structuredClone(state);
  const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
  freeze(view.transactions); freeze(view.history); freeze(view.migration);
  return view;
}
