import {canonical} from '../../core/determinism.js';
import {sha256} from '../economy/fingerprint.js';
import {exact,id} from '../legacy-state.js';
import {validateCompletion} from './completion.js';
export const RULES='m2d-cycles-v1';
export const fingerprint=value=>sha256(canonical(value));
export const key=(...parts)=>'m2d-'+fingerprint(parts).slice(0,48);
export const gold=n=>{if(!Number.isSafeInteger(n)||n<0)throw Error('Invalid nonnegative exact Gold');return n;};
export const plus=(a,b)=>{const n=BigInt(gold(a))+BigInt(gold(b));if(n>BigInt(Number.MAX_SAFE_INTEGER))throw Error('Gold overflow');return Number(n);};
export const cycleMigrationEffect=careerId=>key('migration',careerId,3,4);
export function validateCycleMigration(r){
 exact(r,['id','profileId','careerId','type','maintenanceVersion','expectedRevision','expectedMaintenanceRevision','sourceSchema','targetSchema','sourceFingerprint','rulesVersion','effectId','confirmed'],'cycle migration');
 for(const k of ['id','profileId','careerId'])id(r[k]);gold(r.expectedRevision);gold(r.expectedMaintenanceRevision);
 if(r.type!=='career.cycles.migrate'||r.maintenanceVersion!==1||r.sourceSchema!==3||r.targetSchema!==4||r.rulesVersion!==RULES||r.confirmed!==true||r.effectId!==cycleMigrationEffect(r.careerId)||!/^[a-f0-9]{64}$/.test(r.sourceFingerprint)||r.expectedMaintenanceRevision>=Number.MAX_SAFE_INTEGER)throw Error('Invalid cycle migration contract');
 return r;
}
export function protectCycleMigration(r,manifestDigest,retained=true){
 validateCycleMigration(r);if(!/^[a-f0-9]{64}$/.test(manifestDigest))throw Error('Invalid cycle manifest');
 return {kind:'cycle-migration-maintenance',recordVersion:1,id:r.id,profileId:r.profileId,careerId:r.careerId,request:canonical(r),fingerprint:fingerprint(r),effectId:r.effectId,revision:r.expectedRevision,maintenanceRevision:r.expectedMaintenanceRevision+1,manifestDigest,acknowledgment:retained?{kind:'BNT-cycle-migration-ack',careerSchema:4,revision:r.expectedRevision,maintenanceRevision:r.expectedMaintenanceRevision+1,manifestDigest}:null,retention:'P0'};
}
export function validateCycleMaintenance(e){
 exact(e,['kind','recordVersion','id','profileId','careerId','request','fingerprint','effectId','revision','maintenanceRevision','manifestDigest','acknowledgment','retention'],'cycle maintenance record');
 if(typeof e.request!=='string'||e.request.length>3000||canonical(e)!==canonical(protectCycleMigration(JSON.parse(e.request),e.manifestDigest,e.acknowledgment!==null)))throw Error('Invalid cycle maintenance fact');return e;
}
const shapes={'cycle.settle':['completion','sourceFingerprint'],'payroll.pay':['amount'],'contract.renew':['personId','term'],'contract.release':['personId','resolveAssignment'],'emergency.request':[],'career.confirmFailure':['sourceFingerprint','confirmed']};
export function validateCycleCommand(tx){
 exact(tx,['id','profileId','careerId','expectedRevision','expectedMaintenanceRevision','commandVersion','type','effectId','delta','reason','payload'],'M2-D command');
 for(const k of ['id','profileId','careerId','effectId'])id(tx[k]);gold(tx.expectedRevision);gold(tx.expectedMaintenanceRevision);
 if(tx.commandVersion!==3||!Object.hasOwn(shapes,tx.type)||!Number.isSafeInteger(tx.delta)||typeof tx.reason!=='string'||!tx.reason.trim()||tx.reason.length>500)throw Error('Invalid cycle command');
 exact(tx.payload,shapes[tx.type],'cycle payload');
 if(Object.hasOwn(tx.payload,'personId'))id(tx.payload.personId);
 if(tx.type==='payroll.pay'&&gold(tx.payload.amount)===0)throw Error('Payment must be positive');
 if(tx.type==='contract.renew'&&!['short','standard','long'].includes(tx.payload.term))throw Error('Invalid renewal term');
 if(tx.type==='contract.release'&&typeof tx.payload.resolveAssignment!=='boolean')throw Error('Explicit assignment decision required');
 if(['cycle.settle','career.confirmFailure'].includes(tx.type)&&!/^[a-f0-9]{64}$/.test(tx.payload.sourceFingerprint))throw Error('Invalid source fingerprint');
 if(tx.type==='career.confirmFailure'&&tx.payload.confirmed!==true)throw Error('Explicit failure confirmation required');
}
export function protectCycle(tx,balanceAfter,result){
 validateCycleCommand(tx);gold(balanceAfter);exact(result,['type','cost','delta','details'],'cycle result');gold(result.cost);
 if(result.type!==tx.type||result.delta!==tx.delta||typeof result.details!=='object'||result.details===null||Array.isArray(result.details))throw Error('Invalid protected cycle result');
 const d=result.details;
 const shapes={'cycle.settle':['kind','version','championshipId','cycle','outcome','completion','income','treasuryBefore','treasuryAfter','oldPayments','currentPayments','assessed','arrears','streak','expired','departure'],'payroll.pay':['spent','allocations'],'contract.renew':['personId','contractId','signing'],'contract.release':['personId','contractId','assignmentIds'],'emergency.request':['profileVersion','personId','contractId','wage'],'career.confirmFailure':['assessment','confirmed']};
 exact(d,shapes[tx.type],'protected cycle result details');
 for(const k of ['personId','contractId'])if(Object.hasOwn(d,k))id(d[k]);
 const allocations=list=>{if(!Array.isArray(list)||list.length>1000)throw Error('Invalid allocation list');for(const a of list){exact(a,['obligationId','amount'],'wage allocation');id(a.obligationId);if(gold(a.amount)===0)throw Error('Zero allocation');}return list.reduce((n,a)=>plus(n,a.amount),0);};
 if(tx.type==='cycle.settle'){
  validateCompletion(d.completion);if(canonical(d.completion)!==canonical(tx.payload.completion)||d.kind!=='settlement-statement'||d.version!==1||d.championshipId!==d.completion.championshipId||d.outcome!==d.completion.outcome||gold(d.cycle)<1)throw Error('Invalid protected settlement identity');
  for(const k of ['income','treasuryBefore','treasuryAfter','arrears','streak'])gold(d[k]);
  const income=d.completion.rewards.reduce((n,r)=>plus(n,r.amount),0),spent=plus(allocations(d.oldPayments),allocations(d.currentPayments));
  if(income!==d.income||spent!==result.cost||tx.delta!==income-spent||d.treasuryAfter!==balanceAfter||BigInt(d.treasuryBefore)+BigInt(tx.delta)!==BigInt(balanceAfter))throw Error('Settlement conservation mismatch');
  for(const list of [d.assessed,d.expired]){if(!Array.isArray(list)||new Set(list).size!==list.length)throw Error('Invalid settlement identities');list.forEach(id);}
  exact(d.departure,['personId','deferred'],'departure result');if(d.departure.personId!==null)id(d.departure.personId);if(!Array.isArray(d.departure.deferred))throw Error('Invalid deferred departures');for(const x of d.departure.deferred){exact(x,['personId','reason'],'deferred departure');if(x.personId!==null)id(x.personId);if(typeof x.reason!=='string'||!x.reason.trim())throw Error('Invalid deferral reason');}
 }else if(tx.type==='payroll.pay'){if(allocations(d.allocations)!==gold(d.spent)||d.spent!==result.cost||tx.delta!==-d.spent||d.spent!==tx.payload.amount)throw Error('Payment facts mismatch');}
 else if(tx.type==='contract.renew'){if(d.personId!==tx.payload.personId||gold(d.signing)!==result.cost||tx.delta!==-d.signing)throw Error('Renewal facts mismatch');}
 else{
  if(result.cost!==0||tx.delta!==0)throw Error('Free lifecycle action has invalid Gold effect');
  if(tx.type==='contract.release'){if(d.personId!==tx.payload.personId||!Array.isArray(d.assignmentIds))throw Error('Release facts mismatch');d.assignmentIds.forEach(id);}
  if(tx.type==='emergency.request'&&(d.profileVersion!=='m2d-emergency-driver-v1'||d.wage!==20))throw Error('Emergency facts mismatch');
  if(tx.type==='career.confirmFailure'){exact(d.assessment,['status','reasons','canConfirm'],'failure assessment');if(d.confirmed!==true||d.assessment.status!=='FailurePending'||d.assessment.canConfirm!==true||!Array.isArray(d.assessment.reasons))throw Error('Failure facts mismatch');}
 }

 return {kind:'cycle-gameplay',recordVersion:1,commandVersion:3,id:tx.id,profileId:tx.profileId,careerId:tx.careerId,request:canonical(tx),fingerprint:fingerprint(tx),effectId:tx.effectId,resultRevision:tx.expectedRevision+1,delta:tx.delta,balanceAfter,result:structuredClone(result),retention:'P0'};
}
export function validateCycleEntry(e){
 exact(e,['kind','recordVersion','commandVersion','id','profileId','careerId','request','fingerprint','effectId','resultRevision','delta','balanceAfter','result','retention'],'protected cycle fact');
 if(typeof e.request!=='string'||e.request.length>64000||canonical(e)!==canonical(protectCycle(JSON.parse(e.request),e.balanceAfter,e.result)))throw Error('Invalid protected cycle fact');return e;
}
// Fail closed, never apply missing financial/lifecycle effects to an older timeline.
export function assertCycleRestore(state,history){
 const own=history.filter(e=>e.careerId===state.career.id);
 const migrations=own.filter(e=>e.kind==='cycle-migration-maintenance');
 for(const e of own){
  const later=e.kind==='cycle-gameplay'||(e.resultRevision!==undefined&&migrations.some(m=>e.resultRevision>m.revision));
  if(later&&!state.transactions.some(r=>r.transaction.id===e.id&&canonical(r.transaction)===e.request))throw Error('UNSAFE_CYCLE_RESTORE: checkpoint lacks known payroll/lifecycle effects; retain/export current state or restore a complete newer backup');
 }
}
