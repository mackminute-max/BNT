import { transact, withProvenance, mergeMarks } from '../career/state.js';
import { SAVE_KEY, inspectEnvelope, parseEnvelope, makeEnvelope } from './envelope.js';

// Synchronous storage adapter: callers serialize UI actions and use Web Locks where available.
// Never writes on load, silently selects recovery, or mutates an authoritative race.
export class CareerStore {
  constructor(storage) {
    this.storage = storage; this.mode = 'automatic'; this.current = null; this.recovery = null;
    this.marks = []; this.raw = null; this.quarantine = null; this.problem = '';
    this.requiresCheckpoint = false; this.exportToken = null; this.recoveryPending = false;
  }
  get state() { return this.current ? structuredClone(this.current) : null; }
  open() {
    try { this.raw = this.storage.getItem(SAVE_KEY); }
    catch (e) { this.mode = 'manual'; this.problem = 'Browser storage unavailable: ' + e.message; return; }
    if (this.raw === null) return;
    try {
      const read = inspectEnvelope(this.raw); this.marks = read.marks; this.recovery = read.recovery;
      if (!read.primary || Object.keys(read.errors).length) {
        this.mode = read.recovery ? 'recovery-required' : 'blocked'; this.recoveryPending = Boolean(read.recovery); this.quarantine = this.raw;
        this.current = read.primary; // A valid primary remains exportable if only its backup is damaged.
        this.problem = 'Saved checkpoint is corrupt; automatic writes are blocked and original bytes preserved. ' + (read.primary ? 'Valid primary available for export. ' : 'No primary loaded. ') + JSON.stringify(read.errors); return;
      }
      this.current = read.primary;
    } catch (e) { this.mode = 'blocked'; this.quarantine = this.raw; this.problem = e.message + '; original bytes preserved.'; }
  }
  requireManualCheckpoint() { if (this.mode === 'manual' && this.requiresCheckpoint) throw Error('Export and explicitly confirm this manual checkpoint before another change'); }
  publish(candidate, { allowBlocked = false } = {}) {
    if (['blocked', 'recovery-required'].includes(this.mode) && !allowBlocked) throw Error('Resolve corrupt save explicitly before changing state');
    if (this.mode !== 'manual') {
      let raw;
      try { raw = this.storage.getItem(SAVE_KEY); }
      catch (e) { this.mode = 'manual'; this.problem = 'Storage denied; attempted change was rolled back. Retry in manual mode. ' + e.message; this.requiresCheckpoint = Boolean(this.current); throw Error(this.problem); }
      if (raw !== this.raw) throw Error('Browser save changed in another window; reload before editing');
      try { this.storage.setItem(SAVE_KEY, candidate.text); }
      catch (e) { this.mode = 'manual'; this.problem = 'Storage write failed; attempted change was rolled back. Retry in manual mode. ' + e.message; this.requiresCheckpoint = Boolean(this.current); throw Error(this.problem); }
      this.raw = candidate.text; this.mode = 'automatic'; this.problem = '';
    }
    const read = parseEnvelope(candidate.text);
    this.current = read.primary; this.recovery = read.recovery; this.marks = read.marks;
    this.requiresCheckpoint = this.mode === 'manual'; this.exportToken = null; this.recoveryPending = false;
    if (this.mode === 'manual') this.problem = 'Manual session: changes are in memory only; browser storage is not being updated. Export before leaving.';
  }
  create(state, { confirmed = false } = {}) {
    if ((this.current || this.raw !== null || this.quarantine) && confirmed !== true) throw Error('Confirm replacement of existing career/save');
    this.requireManualCheckpoint();
    const candidate = makeEnvelope(state, this.current, this.marks); this.publish(candidate, { allowBlocked: confirmed });
    return this.state;
  }
  transaction(tx) {
    if (!this.current) throw Error('No career loaded');
    const result = transact(this.current, tx);
    if (result.duplicate) return result;
    this.requireManualCheckpoint();
    this.publish(makeEnvelope(result.state, this.current, this.marks));
    return { ...result, state: this.state };
  }
  importSave(text, { confirmed = false } = {}) {
    const incoming = parseEnvelope(text); // Invalid input must not change mode, state, storage or provenance.
    if (confirmed !== true) throw Error('Confirm complete save replacement; Owner Legacy is replaced, never merged');
    this.requireManualCheckpoint();
    const marks = mergeMarks(this.marks, incoming.marks);
    const state = withProvenance(incoming.primary, marks);
    // Full-save import retains the imported recovery checkpoint; it never merges Legacy.
    const recovery = incoming.recovery;
    this.publish(makeEnvelope(state, recovery, marks), { allowBlocked: true });
    return this.state;
  }
  recover({ confirmed = false } = {}) {
    if (!this.recoveryPending || !this.recovery) throw Error('No valid recovery checkpoint is available');
    if (confirmed !== true) throw Error('Explicit recovery confirmation required');
    const state = withProvenance(this.recovery, this.marks);
    // Selecting a checkpoint is not a financial transaction or invented reward.
    this.publish(makeEnvelope(state, this.recovery, this.marks), { allowBlocked: true });
    return this.state;
  }
  export() {
    if (!this.current) throw Error('No valid loaded career to export');
    const candidate = makeEnvelope(this.current, this.recovery, this.marks);
    this.exportToken = candidate.envelope.primary.digest;
    return structuredClone(candidate.envelope);
  }
  acknowledgeExport(token) {
    if (!this.current || !this.exportToken || token !== this.exportToken || token !== makeEnvelope(this.current, this.recovery, this.marks).envelope.primary.digest) throw Error('Export the current checkpoint first');
    this.requiresCheckpoint = false;
    // This records the user's statement in this session, not verified disk durability.
  }
}
