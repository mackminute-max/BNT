import {validateControllerState,transactController} from './controller.js';
import {assertControllerRestore} from './controller-contracts.js';
import {validateStateV4,transactV4,withKnownHistoryV4} from '../cycles/schema4.js';
import {exact,mergeMarks} from '../legacy-state.js';
import {canonical} from '../../core/determinism.js';
import {fingerprint} from '../cycles/contracts.js';
import {mergeProtected} from '../economy/protected-registry.js';
import {FOUNDATION_VERSION,validateFoundationMigration,protectFoundationMigration} from './contracts.js';
const project=s=>{const n=structuredClone(s);n.schema=4;delete n.championshipFoundation;return n;};
export function previewFoundation(s){validateStateV4(s);return Object.freeze({sourceSchema:4,targetSchema:5,sourceFingerprint:fingerprint(s),expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,warning:'Foundation only: no registration, fees, grants, condition conversion or championship.'});}
export function buildFoundation(s,r){
  validateStateV4(s);validateFoundationMigration(r);
  if(r.profileId!==s.profile.id||r.careerId!==s.career.id||r.expectedRevision!==s.revision||r.expectedMaintenanceRevision!==s.maintenanceRevision||r.sourceFingerprint!==fingerprint(s))throw Error('Stale foundation source/revision/ownership');
  const n=structuredClone(s);n.schema=5;n.maintenanceRevision++;
  n.championshipFoundation={version:1,rulesVersion:FOUNDATION_VERSION,origin:structuredClone(s),migration:structuredClone(r),conditionMapping:{version:1,status:'UNMAPPED',legacyFieldsPreserved:true},instances:{},operations:{},terminalRegistry:{},checkpointRefs:{},recovery:{status:'IDLE',reason:null}};
  n.history.commands=mergeProtected(n.history.commands,[protectFoundationMigration(r)]);return validateStateV5(n);
}
export function validateStateV5(s){
  if(s?.championshipFoundation?.version>=2)return validateControllerState(s);
  if(s?.schema!==5)throw Error('Unsupported foundation schema');
  // Reuse the unchanged schema-4 validator: it rejects unknown top-level fields.
  validateStateV4(project(s));
  const f=s.championshipFoundation;
  exact(f,['version','rulesVersion','origin','migration','conditionMapping','instances','operations','terminalRegistry','checkpointRefs','recovery'],'championship foundation');
  if(f.version!==1||f.rulesVersion!==FOUNDATION_VERSION)throw Error('Unsupported foundation version');
  validateStateV4(f.origin);validateFoundationMigration(f.migration);
  const r=f.migration;
  if(r.profileId!==s.profile.id||r.careerId!==s.career.id||r.profileId!==f.origin.profile.id||r.careerId!==f.origin.career.id||r.sourceFingerprint!==fingerprint(f.origin)||r.expectedRevision!==f.origin.revision||r.expectedMaintenanceRevision!==f.origin.maintenanceRevision||s.maintenanceRevision<r.expectedMaintenanceRevision+1||canonical(s.transactions.slice(0,f.origin.transactions.length))!==canonical(f.origin.transactions))throw Error('Invalid foundation lineage/ownership');
  if(!s.history.commands.some(e=>canonical(e)===canonical(protectFoundationMigration(r))))throw Error('Missing foundation protected migration');
  exact(f.conditionMapping,['version','status','legacyFieldsPreserved']);if(f.conditionMapping.version!==1||f.conditionMapping.status!=='UNMAPPED'||f.conditionMapping.legacyFieldsPreserved!==true)throw Error('Condition conversion is outside foundation scope');
  // These are typed reserved registries. Real instance/terminal writers are not yet authorized.
  for(const k of ['instances','operations','terminalRegistry','checkpointRefs'])exact(f[k],[],k);
  exact(f.recovery,['status','reason']);if(f.recovery.status!=='IDLE'||f.recovery.reason!==null)throw Error('Unsupported career recovery state');
  return s;
}
export function transactV5(s,tx,options){if(s.championshipFoundation.version>=2||tx.commandVersion===4)return transactController(s,tx,options);validateStateV5(s);const r=transactV4(project(s),tx,options);r.state={...r.state,schema:5,championshipFoundation:structuredClone(s.championshipFoundation)};validateStateV5(r.state);return r;}
export function withKnownHistoryV5(s,marks,history){validateStateV5(s);if(s.championshipFoundation.version>=2){assertControllerRestore(s,history);const n=structuredClone(s);n.provenance=mergeMarks(n.provenance,marks.filter(m=>m.profileId===s.profile.id));n.profile.developerEdited=Boolean(n.provenance.length);n.career.developerEdited=n.provenance.some(m=>m.careerId===n.career.id);n.history.commands=mergeProtected(n.history.commands,history.filter(e=>e.careerId===s.career.id));return validateControllerState(n);}const p=withKnownHistoryV4(project(s),marks,history);return validateStateV5({...p,schema:5,championshipFoundation:structuredClone(s.championshipFoundation)});}
