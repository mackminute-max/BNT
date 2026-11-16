import { exact, id } from './legacy-state.js';
import { CATALOG_VERSION, packageById, buildPackage, initializationResult } from './packages.js';
import { applyAssembly } from './assembly.js';
export const isDomainCommand = tx => ['career.initialize','ru.assemble','ru.disassemble'].includes(tx?.type);
export const initializationEffect = careerId => 'initialize-' + careerId;
export const assignmentEffect = (careerId, revision, maintenanceRevision) => 'assembly-' + careerId + '-' + revision + '-' + maintenanceRevision;
export function validateDomainCommand(tx) {
  const common = ['id','profileId','careerId','expectedRevision','type','delta','reason','commandVersion','expectedMaintenanceRevision','effectId'];
  exact(tx,[...common,...(tx.type === 'career.initialize' ? ['packageId','catalogVersion','confirmed'] : tx.type === 'ru.assemble' ? ['assignmentId','driverId','beastIds','chariotId'] : ['assignmentId'])],'M2-B domain command');
  for (const k of ['id','profileId','careerId']) id(tx[k]);
  if (tx.commandVersion !== 1 || !Number.isSafeInteger(tx.expectedRevision) || tx.expectedRevision < 0 || !Number.isSafeInteger(tx.expectedMaintenanceRevision) || tx.expectedMaintenanceRevision < 1 || typeof tx.reason !== 'string' || !tx.reason.trim() || tx.reason.length > 500) throw Error('Invalid M2-B command/version/revisions');
  if (tx.type === 'career.initialize') {
    if (tx.confirmed !== true || tx.catalogVersion !== CATALOG_VERSION || tx.delta !== packageById(tx.packageId).gold || tx.effectId !== initializationEffect(tx.careerId)) throw Error('Invalid confirmed initialization grant/catalog/effect');
  } else {
    if (tx.delta !== 0 || tx.effectId !== assignmentEffect(tx.careerId,tx.expectedRevision,tx.expectedMaintenanceRevision)) throw Error('Invalid assembly delta/effect identity');
    id(tx.assignmentId);
    if (tx.type === 'ru.assemble') { id(tx.driverId); id(tx.chariotId); if (!Array.isArray(tx.beastIds) || tx.beastIds.length !== 2 || new Set(tx.beastIds).size !== 2) throw Error('RU requires two distinct beasts'); tx.beastIds.forEach(id); }
  }
}
export function assertPristine(state) {
  const reasons = [];
  if (state.management.initialized || state.management.registrySchema !== 1 || Object.values(state.management.registries).some(r=>Object.keys(r).length)) reasons.push('management is not empty/uninitialized');
  if (state.career.treasury !== 0) reasons.push('treasury is not zero');
  if (state.transactions.length || state.history.commands.length || state.provenance.some(m=>m.careerId === state.career.id) || state.career.developerEdited) reasons.push('active-career transaction/edit/protected history exists');
  if (state.pendingRace !== null) reasons.push('pending checkpoint exists');
  if (reasons.length) throw Error('Initialization requires pristine career: '+reasons.join('; '));
}
export function applyDomainCommand(next, tx) {
  if (tx.type === 'career.initialize') { assertPristine(next); next.management = buildPackage(next.career.id,tx.packageId); }
  else applyAssembly(next,tx);
}
export function domainResult(tx) {
  return tx.type === 'career.initialize' ? initializationResult(tx.careerId,tx.packageId) : {assignmentId:tx.assignmentId,assembled:tx.type === 'ru.assemble'};
}
