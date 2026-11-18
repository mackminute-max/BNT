import {exact,id} from '../legacy-state.js';
import {fingerprint,gold} from '../cycles/contracts.js';
import {canonical} from '../../core/determinism.js';
export const FOUNDATION_VERSION='m2e-foundation-v1';
export const foundationEffect=careerId=>'m2e-schema5-'+careerId;
export function validateFoundationMigration(r){
  exact(r,['id','profileId','careerId','type','version','sourceSchema','targetSchema','expectedRevision','expectedMaintenanceRevision','sourceFingerprint','effectId','confirmed'],'foundation migration');
  for(const k of ['id','profileId','careerId'])id(r[k]);
  gold(r.expectedRevision);gold(r.expectedMaintenanceRevision);
  if(r.type!=='career.foundation.migrate'||r.version!==1||r.sourceSchema!==4||r.targetSchema!==5||r.confirmed!==true||r.effectId!==foundationEffect(r.careerId)||!/^[a-f0-9]{64}$/.test(r.sourceFingerprint)||r.expectedMaintenanceRevision>=Number.MAX_SAFE_INTEGER)throw Error('Invalid foundation migration/version');
  return r;
}
export function protectFoundationMigration(request){
  validateFoundationMigration(request);
  return {kind:'foundation-maintenance',recordVersion:1,id:request.id,profileId:request.profileId,careerId:request.careerId,request:canonical(request),fingerprint:fingerprint(request),effectId:request.effectId,revision:request.expectedRevision,maintenanceRevision:request.expectedMaintenanceRevision+1,acknowledgment:{kind:'BNT-foundation-migration',schema:5},retention:'P0'};
}
export function validateFoundationEntry(e){
  exact(e,['kind','recordVersion','id','profileId','careerId','request','fingerprint','effectId','revision','maintenanceRevision','acknowledgment','retention'],'foundation history');
  if(typeof e.request!=='string'||e.request.length>3000||canonical(e)!==canonical(protectFoundationMigration(JSON.parse(e.request))))throw Error('Invalid foundation protected identity');
  return e;
}
// Foundational types only: no registration, fees, scoring or authority producer.
export function validateInstanceIdentity(x){
  exact(x,['version','profileId','careerId','instanceId','configurationFingerprint','participants'],'instance identity');
  if(x.version!==1||!/^[a-f0-9]{64}$/.test(x.configurationFingerprint)||!Array.isArray(x.participants)||x.participants.length>64)throw Error('Invalid frozen instance');
  for(const k of ['profileId','careerId','instanceId'])id(x[k]);
  const seen=new Set();for(const p of x.participants){exact(p,['entrantId','assetIds'],'participant identity');id(p.entrantId);if(seen.has(p.entrantId)||!Array.isArray(p.assetIds)||new Set(p.assetIds).size!==p.assetIds.length)throw Error('Duplicate participant/asset identity');seen.add(p.entrantId);p.assetIds.forEach(id);}
  return x;
}
export function frozenInstanceIdentity(x){validateInstanceIdentity(x);const n=structuredClone(x);const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};return freeze(n);}
export function validateCheckpointReference(r){
  exact(r,['version','storageKey','identityFingerprint','revision','watermark','authorityHash'],'checkpoint reference');
  if(r.version!==1||typeof r.storageKey!=='string'||!r.storageKey.startsWith('bnt.race.foundation.v1.')||!['identityFingerprint','authorityHash'].every(k=>/^[a-f0-9]{64}$/.test(r[k])))throw Error('Invalid checkpoint manifest reference');gold(r.revision);gold(r.watermark);return r;
}
