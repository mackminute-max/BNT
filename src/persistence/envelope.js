import { checksum, canonical } from '../core/determinism.js';
import { exact, validateState, mergeMarks, withProvenance } from '../career/state.js';
export const SAVE_KEY = 'bnt.career.save.v1';
export const MAX_SAVE_BYTES = 2 * 1024 * 1024;
// Accidental-corruption diagnostics, not authentication or protection against a save editor.
export function seal(value) { return { value: structuredClone(value), digest: checksum(value) }; }
function unseal(record) {
  exact(record, ['value', 'digest'], 'sealed checkpoint');
  if (typeof record.digest !== 'string' || !/^[0-9a-f]{8}$/.test(record.digest) || checksum(record.value) !== record.digest) throw Error('Checkpoint integrity mismatch');
  return record.value;
}
export function inspectEnvelope(text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_SAVE_BYTES) throw Error('Invalid or oversized career save');
  const envelope = JSON.parse(text);
  exact(envelope, ['kind', 'schema', 'primary', 'recovery', 'provenance'], 'game save');
  if (envelope.kind !== 'BNT-game-save' || envelope.schema !== 1) throw Error('Incompatible game save type/schema');
  const rawMarks = unseal(envelope.provenance);
  if (!Array.isArray(rawMarks)) throw Error('Invalid provenance registry');
  const marks = mergeMarks(rawMarks);
  if (marks.length !== rawMarks.length) throw Error('Duplicate provenance registry');
  const errors = {}, valid = {};
  for (const key of ['primary', 'recovery']) {
    if (key === 'recovery' && envelope[key] === null) { valid[key] = null; continue; }
    try {
      const state = validateState(unseal(envelope[key]));
      for (const m of state.provenance) if (!marks.some(k => canonical(k) === canonical(m))) throw Error('Checkpoint provenance missing from registry');
      // Primary cannot clear known marks; a historical recovery checkpoint may predate them.
      if (key === 'primary' && canonical(withProvenance(state, marks)) !== canonical(state)) throw Error('Primary clears known developer provenance');
      valid[key] = structuredClone(state);
    } catch (e) { errors[key] = e.message; valid[key] = null; }
  }
  return { envelope, marks, primary: valid.primary, recovery: valid.recovery, errors };
}
export function parseEnvelope(text) {
  const result = inspectEnvelope(text);
  if (!result.primary || Object.keys(result.errors).length) throw Error('Invalid career save: ' + JSON.stringify(result.errors));
  return result;
}
export function makeEnvelope(primary, recovery = null, knownMarks = []) {
  const marks = mergeMarks(knownMarks, primary.provenance, recovery?.provenance ?? []);
  const state = withProvenance(primary, marks);
  const envelope = { kind: 'BNT-game-save', schema: 1, primary: seal(state), recovery: recovery ? seal(validateState(recovery)) : null, provenance: seal(marks) };
  const text = JSON.stringify(envelope); parseEnvelope(text);
  return { envelope, text, state };
}
