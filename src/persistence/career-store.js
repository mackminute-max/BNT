import { transact, withProvenance, mergeMarks, migrateStateV1, assertRevision, id } from '../career/state.js';
import { immutableHistoryView } from '../career/schema2.js';
import { mergeProtected, lookupCommitted, completeProtectedRegistry } from '../career/history.js';
import { SAVE_KEY, inspectEnvelope, parseEnvelope, makeEnvelope } from './envelope.js';

// Synchronous storage adapter: callers serialize UI actions and use Web Locks where available.
// Never writes on load, silently selects recovery, or mutates an authoritative race.
export class CareerStore {
  constructor(storage) {
    this.storage = storage; this.mode = 'automatic'; this.current = null; this.recovery = null;
    this.marks = []; this.protectedHistory = []; this.maintenanceClock = 0; this.schema2Session = false; this.raw = null; this.quarantine = null; this.problem = '';
    this.requiresCheckpoint = false; this.exportToken = null; this.recoveryPending = false;
  }
  get state() { return this.current?.schema === 2 ? immutableHistoryView(this.current) : this.current ? structuredClone(this.current) : null; }
  open() {
    try { this.raw = this.storage.getItem(SAVE_KEY); }
    catch (e) { this.mode = 'manual'; this.problem = 'Browser storage unavailable: ' + e.message; return; }
    if (this.raw === null) return;
    try {
      const read = inspectEnvelope(this.raw); this.marks = read.marks; this.protectedHistory = read.protectedHistory; this.maintenanceClock = read.maintenanceClock; this.schema2Session = Object.hasOwn(read.envelope, 'protectedHistory'); this.recovery = read.recovery;
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
    const read = parseEnvelope(candidate.text); // Validate before the atomic storage write.
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
    this.current = read.primary; this.recovery = read.recovery; this.marks = read.marks; this.protectedHistory = read.protectedHistory; this.maintenanceClock = read.maintenanceClock; this.schema2Session = Object.hasOwn(read.envelope, 'protectedHistory');
    this.requiresCheckpoint = this.mode === 'manual'; this.exportToken = null; this.recoveryPending = false;
    if (this.mode === 'manual') this.problem = 'Manual session: changes are in memory only; browser storage is not being updated. Export before leaving.';
  }
  create(state, { confirmed = false } = {}) {
    if ((this.current || this.raw !== null || this.quarantine) && confirmed !== true) throw Error('Confirm replacement of existing career/save');
    this.requireManualCheckpoint();
    if (this.schema2Session && state.schema !== 2) throw Error('Protected session requires explicit schema-2 creation, not downgrade');
    if (state.schema === 2 && this.schema2Session) { state = structuredClone(state); state.maintenanceRevision = Math.max(state.maintenanceRevision, this.maintenanceClock + 1); }
    const candidate = makeEnvelope(state, this.current, this.marks, this.protectedHistory, this.maintenanceClock); this.publish(candidate, { allowBlocked: confirmed });
    return this.state;
  }
  migrateSchema({ confirmed = false, profileId, careerId, expectedRevision, expectedMaintenanceRevision } = {}) {
    if (!this.current) throw Error('No career loaded');
    if (confirmed !== true) throw Error('Explicit migration confirmation required');
    id(profileId); id(careerId);
    if (profileId !== this.current.profile.id || careerId !== this.current.career.id) throw Error('Migration ownership mismatch');
    assertRevision(this.current, expectedRevision, expectedMaintenanceRevision);
    if (this.current.schema === 2) return { migrated: false, state: this.state };
    this.requireManualCheckpoint();
    const state = migrateStateV1(this.current);
    this.publish(makeEnvelope(state, this.current, this.marks, this.protectedHistory, this.maintenanceClock));
    return { migrated: true, state: this.state };
  }
  transaction(tx) {
    if (!this.current) throw Error('No career loaded');
    if (this.current.schema === 2) {
      const prior = lookupCommitted(this.protectedHistory, tx, this.current.transactions);
      if (prior) return { ...prior, state: this.state };
      if (this.protectedHistory.some(e => e.careerId === tx.careerId && e.effectId === tx.effectId)) throw Error('Effect identity already committed on a retained timeline');
    }
    const result = transact(this.current, tx);
    if (result.duplicate) return result;
    this.requireManualCheckpoint();
    this.publish(makeEnvelope(result.state, this.current, this.marks, this.protectedHistory, this.maintenanceClock));
    return { ...result, state: this.state };
  }
  importSave(text, { confirmed = false, migrateLegacy = false } = {}) {
    const incoming = parseEnvelope(text); // Invalid input must not change mode, state, storage or provenance.
    if (confirmed !== true) throw Error('Confirm complete save replacement; Owner Legacy is replaced, never merged');
    this.requireManualCheckpoint();
    const marks = mergeMarks(this.marks, incoming.marks);
    const useProtected = this.schema2Session || incoming.primary.schema === 2 || incoming.protectedHistory.length || migrateLegacy === true;
    const protectedHistory = useProtected ? completeProtectedRegistry(mergeProtected(this.protectedHistory, incoming.protectedHistory), marks) : [];
    let target = incoming.primary;
    if (target.schema === 1 && (this.schema2Session || protectedHistory.length || migrateLegacy)) {
      if (migrateLegacy !== true) throw Error('Explicit schema-1 migration confirmation is required; protected saves cannot downgrade');
      target = migrateStateV1(target);
    }
    let state = withProvenance(target, marks, protectedHistory);
    if (state.schema === 2 && (this.current || this.schema2Session)) state.maintenanceRevision = Math.max(state.maintenanceRevision, this.maintenanceClock, incoming.maintenanceClock) + 1;
    // Full-save import retains the imported recovery checkpoint; it never merges Legacy.
    const recovery = incoming.recovery;
    this.publish(makeEnvelope(state, recovery, marks, protectedHistory, Math.max(this.maintenanceClock, incoming.maintenanceClock)), { allowBlocked: true });
    return this.state;
  }
  recover({ confirmed = false } = {}) {
    if (!this.recoveryPending || !this.recovery) throw Error('No valid recovery checkpoint is available');
    if (confirmed !== true) throw Error('Explicit recovery confirmation required');
    let target = this.recovery;
    if (target.schema === 1 && (this.schema2Session || this.protectedHistory.length)) target = migrateStateV1(target);
    const state = withProvenance(target, this.marks, this.protectedHistory);
    if (state.schema === 2) state.maintenanceRevision = Math.max(state.maintenanceRevision, this.maintenanceClock) + 1;
    // Selecting a checkpoint is not a financial transaction or invented reward.
    this.publish(makeEnvelope(state, this.recovery, this.marks, this.protectedHistory, this.maintenanceClock), { allowBlocked: true });
    return this.state;
  }
  export() {
    if (!this.current) throw Error('No valid loaded career to export');
    const candidate = makeEnvelope(this.current, this.recovery, this.marks, this.protectedHistory, this.maintenanceClock);
    this.exportToken = candidate.envelope.primary.digest;
    return structuredClone(candidate.envelope);
  }
  acknowledgeExport(token) {
    if (!this.current || !this.exportToken || token !== this.exportToken || token !== makeEnvelope(this.current, this.recovery, this.marks, this.protectedHistory, this.maintenanceClock).envelope.primary.digest) throw Error('Export the current checkpoint first');
    this.requiresCheckpoint = false;
    // This records the user's statement in this session, not verified disk durability.
  }
}
