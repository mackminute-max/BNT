import { exact,id } from '../legacy-state.js';
import { canonical } from '../../core/determinism.js';
import { sha256 } from './fingerprint.js';
export const MIGRATION_VERSION='m2c-migration-v1', ADAPTER_VERSION='valuation-health-v1', GENERATOR_VERSION='market-generator-v1';
export const isMaintenance=e=>e?.kind==='migration-maintenance';
export const migrationEffect=careerId=>'migrate-'+careerId+'-2-3';
export function validateMigrationRequest(r){
  exact(r,['id','profileId','careerId','type','maintenanceVersion','expectedRevision','expectedMaintenanceRevision','sourceSchema','targetSchema','sourceFingerprint','migrationVersion','adapterVersion','generatorVersion','confirmed','effectId'],'migration maintenance request');
  for(const k of ['id','profileId','careerId'])id(r[k]);
  if(r.type!=='career.migrate' || r.maintenanceVersion!==1 || r.sourceSchema!==2 || r.targetSchema!==3 || r.migrationVersion!==MIGRATION_VERSION || r.adapterVersion!==ADAPTER_VERSION || r.generatorVersion!==GENERATOR_VERSION || r.confirmed!==true || r.effectId!==migrationEffect(r.careerId) || !/^[a-f0-9]{64}$/.test(r.sourceFingerprint))throw Error('Invalid migration contract/version/identity');
  if(!Number.isSafeInteger(r.expectedRevision)||r.expectedRevision<0||!Number.isSafeInteger(r.expectedMaintenanceRevision)||r.expectedMaintenanceRevision<1||r.expectedMaintenanceRevision>=Number.MAX_SAFE_INTEGER)throw Error('Invalid migration revisions');
  return r;
}
function acknowledgment(r,digest){return {kind:'BNT-migration-ack',sourceFingerprint:r.sourceFingerprint,manifestDigest:digest,careerSchema:3,revision:r.expectedRevision,maintenanceRevision:r.expectedMaintenanceRevision+1};}
export function protectMaintenance(r,manifestDigest,retainAcknowledgment=true){
  validateMigrationRequest(r);if(!/^[a-f0-9]{64}$/.test(manifestDigest))throw Error('Invalid migration manifest fingerprint');
  return {kind:'migration-maintenance',recordVersion:1,id:r.id,profileId:r.profileId,careerId:r.careerId,request:canonical(r),fingerprint:sha256(canonical(r)),effectId:r.effectId,revision:r.expectedRevision,maintenanceRevision:r.expectedMaintenanceRevision+1,manifestDigest,acknowledgment:retainAcknowledgment?acknowledgment(r,manifestDigest):null,retention:'P0'};
}
export function validateMaintenance(e){
  exact(e,['kind','recordVersion','id','profileId','careerId','request','fingerprint','effectId','revision','maintenanceRevision','manifestDigest','acknowledgment','retention'],'protected maintenance identity');
  if(typeof e.request!=='string'||e.request.length>3000)throw Error('Invalid maintenance request');
  const expected=protectMaintenance(JSON.parse(e.request),e.manifestDigest,e.acknowledgment!==null);
  if(canonical(e)!==canonical(expected))throw Error('Protected maintenance facts mismatch');return e;
}
export function lookupMaintenance(entries,request){
  validateMigrationRequest(request);const e=entries.find(e=>e.id===request.id);
  if(!e)return null;
  if(!isMaintenance(e)||e.request!==canonical(request))throw Error('Conflicting protected migration ID');
  validateMaintenance(e);return {status:'ALREADY_COMMITTED',duplicate:true,acknowledgment:structuredClone(e.acknowledgment)};
}
