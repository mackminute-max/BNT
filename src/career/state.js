import {validateM6} from './m6/schema.js';
import {validateCurrent,transactCurrent} from './m5/current.js';
import {validateStateV6,withKnownHistoryV6,transactV6} from './championships/e5/schema6.js';
import {validateE5Command,assertE5Restore} from './championships/e5/contracts.js';
import {validateControllerCommand,assertControllerRestore} from './championships/controller-contracts.js';
import {validateStateV5,withKnownHistoryV5,transactV5} from './championships/schema5.js';
import {validateStateV4,withKnownHistoryV4,transactV4} from './cycles/schema4.js';
import {validateCycleCommand,assertCycleRestore} from './cycles/contracts.js';
import { validateStateV3, withKnownHistoryV3, transactV3 } from './economy/schema3.js';
import { validateEconomyCommand } from './economy/commands.js';
import { mergeProtected, isLegacyEntry } from './economy/protected-registry.js';
// Schema dispatch. The unchanged M1 API remains available for old saves and tests.
import * as legacy from './legacy-state.js';
import { validateCommandV1 } from './history.js';
import { validateStateV2, withKnownHistoryV2, transactV2, migrateStateV1 } from './schema2.js';
export { id, exact, MAX_RECEIPTS, MAX_MARKS, validateMark, mergeMarks, transactionMark } from './legacy-state.js';
export { migrateStateV1, revisionToken, assertRevision } from './schema2.js';
export const CAREER_SCHEMA = 6;
export const createCareer = legacy.createCareer;
export function createUninitializedCareer(options) { return migrateStateV1(legacy.createCareer(options)); }
export function validateState(state) { return state?.schema === 8 ? validateM6(state) : state?.schema === 7 ? validateCurrent(state) : state?.schema === 6 ? validateStateV6(state) : state?.schema === 5 ? validateStateV5(state) : state?.schema === 4 ? validateStateV4(state) : state?.schema === 3 ? validateStateV3(state) : state?.schema === 2 ? validateStateV2(state) : legacy.validateState(state); }
export function validateTransaction(tx) { return tx?.commandVersion === 5 ? validateE5Command(tx) : tx?.commandVersion === 4 ? validateControllerCommand(tx) : tx?.commandVersion === 3 ? validateCycleCommand(tx) : tx?.commandVersion === 2 ? validateEconomyCommand(tx) : tx && Object.hasOwn(tx, 'commandVersion') ? validateCommandV1(tx) : legacy.validateTransaction(tx); }
export function withProvenance(state, marks, protectedHistory = []) {
  if (protectedHistory.some(e=>e.careerId===state.career.id && e.profileId!==state.profile.id)) throw Error('Career history belongs to a different Owner Profile');
  assertE5Restore(state, protectedHistory);
  if(state?.schema===6)return withKnownHistoryV6(state,marks,protectedHistory);
  assertCycleRestore(state, protectedHistory);
  assertControllerRestore(state,protectedHistory);
  if(state?.schema<5&&protectedHistory.some(e=>e.kind==='foundation-maintenance'&&e.careerId===state.career.id))throw Error('Cannot restore pre-foundation career over protected schema-5 migration');
  if(state?.schema===5)return withKnownHistoryV5(state,marks,protectedHistory);
  if(state?.schema===4)return withKnownHistoryV4(state,marks,protectedHistory);
  protectedHistory=protectedHistory.filter(e=>e.kind!=='cycle-migration-maintenance'&&e.kind!=='cycle-gameplay');
  if (state?.schema === 3) return withKnownHistoryV3(state, marks, protectedHistory);
  return state?.schema === 2 ? withKnownHistoryV2(state, marks, mergeProtected(protectedHistory).filter(isLegacyEntry)) : legacy.withProvenance(state, marks);
}
export function transact(state, tx, options = {}) { return state?.schema===7 ? transactCurrent(state,tx,options) : state?.schema===6 || ['e5.enable','e5.enableM4'].includes(tx?.type) ? transactV6(state,tx,options) : state?.schema===5 ? transactV5(state,tx,options) : state?.schema===4 ? transactV4(state,tx,options) : state?.schema === 3 ? transactV3(state, tx) : state?.schema === 2 ? transactV2(state, tx) : legacy.transact(state, tx); }
