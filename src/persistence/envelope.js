import { isMaintenance } from '../career/economy/maintenance-history.js';
import { isDomainCommand } from '../career/domain-commands.js';
import { checksum, canonical } from '../core/determinism.js';
import { exact, validateState, mergeMarks, withProvenance } from '../career/state.js';
import { FOUNDATION_LIMITS } from '../career/foundation-catalog.js';
import { mergeProtected, protectedFromState, completeProtectedRegistry } from '../career/economy/protected-registry.js';
export const SAVE_KEY = 'bnt.career.save.v1';
export const MAX_SAVE_BYTES = FOUNDATION_LIMITS.schema1SaveBytes;
export const MAX_IMPORT_BYTES = FOUNDATION_LIMITS.schema2SaveBytes;
// Accidental-corruption diagnostics, not authentication or protection against a save editor.
export function seal(value) { return { value: structuredClone(value), digest: checksum(value) }; }
function unseal(record) {
  exact(record, ['value', 'digest'], 'sealed checkpoint');
  if (typeof record.digest !== 'string' || !/^[0-9a-f]{8}$/.test(record.digest) || checksum(record.value) !== record.digest) throw Error('Checkpoint integrity mismatch');
  return record.value;
}
export function inspectEnvelope(text) {
  if (typeof text !== 'string') throw Error('Invalid career save');
  const bytes = new TextEncoder().encode(text).length;
  if (bytes > MAX_IMPORT_BYTES) throw Error('Invalid or oversized career save');
  let envelope;
  try { envelope = JSON.parse(text); } catch (error) { if (bytes > MAX_SAVE_BYTES) throw Error('Invalid or oversized career save'); throw error; }
  if (bytes > MAX_SAVE_BYTES && !Object.hasOwn(envelope ?? {}, 'protectedHistory')) throw Error('Invalid or oversized schema-1 save');
  exact(envelope, ['kind', 'schema', 'primary', 'recovery', 'provenance', ...(Object.hasOwn(envelope, 'protectedHistory') ? ['protectedHistory', 'maintenanceClock'] : [])], 'game save');
  if (envelope.kind !== 'BNT-game-save' || envelope.schema !== 1) throw Error('Incompatible game save type/schema');
  const rawMarks = unseal(envelope.provenance);
  if (!Array.isArray(rawMarks)) throw Error('Invalid provenance registry');
  const marks = mergeMarks(rawMarks);
  if (marks.length !== rawMarks.length) throw Error('Duplicate provenance registry');
  const hasHistory = Object.hasOwn(envelope, 'protectedHistory');
  const rawHistory = hasHistory ? unseal(envelope.protectedHistory) : [];
  const maintenanceClock = hasHistory ? unseal(envelope.maintenanceClock) : 0;
  if (!Number.isSafeInteger(maintenanceClock) || maintenanceClock < (hasHistory ? 1 : 0)) throw Error('Invalid maintenance clock');
  if (!Array.isArray(rawHistory)) throw Error('Invalid protected history registry');
  const protectedHistory = mergeProtected(rawHistory);
  if (protectedHistory.length !== rawHistory.length) throw Error('Duplicate protected registry identity');
  if (hasHistory) {
    for (const mark of marks) if (!protectedHistory.some(e => e.id === mark.id)) throw Error('Known provenance identity missing from protected registry');
    for (const entry of protectedHistory) {
      if (isMaintenance(entry) || entry.commandVersion === 2) continue;
      const tx = JSON.parse(entry.request);
      if (!isDomainCommand(tx) && !marks.some(m => m.id === entry.id && m.profileId === tx.profileId && m.careerId === tx.careerId && m.revision === tx.expectedRevision + 1 && m.type === tx.type && m.reason === tx.reason && m.delta === tx.delta)) throw Error('Protected registry/provenance mismatch');
    }
  }
  const errors = {}, valid = {};
  for (const key of ['primary', 'recovery']) {
    if (key === 'recovery' && envelope[key] === null) { valid[key] = null; continue; }
    try {
      const state = validateState(unseal(envelope[key]));
      for (const m of state.provenance) if (!marks.some(k => canonical(k) === canonical(m))) throw Error('Checkpoint provenance missing from registry');
      // Primary cannot clear known marks; a historical recovery checkpoint may predate them.
      if (state.schema >= 2 && !Object.hasOwn(envelope, 'protectedHistory')) throw Error('Schema-2 checkpoint requires protected registry');
      if (state.schema >= 2 && (state.maintenanceRevision > maintenanceClock || (key === 'primary' && state.maintenanceRevision !== maintenanceClock))) throw Error('Maintenance clock/checkpoint mismatch');
      if (key === 'primary' && state.schema < 2 && Object.hasOwn(envelope, 'protectedHistory')) throw Error('Cannot downgrade a protected save to schema 1');
      for (const entry of state.schema >= 2 ? state.history.commands : []) {
        if (!protectedHistory.some(e => e.id === entry.id && e.request === entry.request && (entry.balanceAfter === null || e.balanceAfter === entry.balanceAfter))) throw Error('Checkpoint loses protected identity/effect facts');
      }
      if (key === 'primary' && canonical(withProvenance(state, marks, protectedHistory)) !== canonical(state)) throw Error('Primary clears known developer provenance');
      valid[key] = structuredClone(state);
    } catch (e) { errors[key] = e.message; valid[key] = null; }
  }
  return { envelope, marks, protectedHistory, maintenanceClock, primary: valid.primary, recovery: valid.recovery, errors };
}
export function parseEnvelope(text) {
  const result = inspectEnvelope(text);
  if (!result.primary || Object.keys(result.errors).length) throw Error('Invalid career save: ' + JSON.stringify(result.errors));
  return result;
}
export function makeEnvelope(primary, recovery = null, knownMarks = [], knownHistory = [], knownMaintenance = 0) {
  const marks = mergeMarks(knownMarks, primary.provenance, recovery?.provenance ?? []);
  const useHistory = primary.schema >= 2 || recovery?.schema >= 2 || knownHistory.length > 0;
  const protectedHistory = useHistory ? completeProtectedRegistry(mergeProtected(knownHistory, protectedFromState(primary), protectedFromState(recovery)), marks) : [];
  const state = withProvenance(primary, marks, protectedHistory);
  const maintenanceClock = Math.max(knownMaintenance, primary.maintenanceRevision ?? 0, recovery?.maintenanceRevision ?? 0);
  const envelope = { kind: 'BNT-game-save', schema: 1, primary: seal(state), recovery: recovery ? seal(validateState(recovery)) : null, provenance: seal(marks), ...(useHistory ? { protectedHistory: seal(protectedHistory), maintenanceClock: seal(maintenanceClock) } : {}) };
  const text = JSON.stringify(envelope); parseEnvelope(text);
  return { envelope, text, state };
}
