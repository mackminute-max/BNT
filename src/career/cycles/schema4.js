import {validateStateV3,SCHEMA3_FIELDS} from '../economy/schema3.js';
import {validateGraph3} from '../economy/validation.js';
import {validateCommandV1,protectTransaction} from '../history.js';
import {executeEconomy,quoteEconomy,applyAssembly3} from '../economy/reducers.js';
import {validateEconomyCommand,protectEconomic} from '../economy/commands.js';
import {mergeProtected,lookupCommitted} from '../economy/protected-registry.js';
import {assertRevision} from '../schema2.js';
import {exact,MAX_RECEIPTS,mergeMarks,transactionMark} from '../legacy-state.js';
import {canonical} from '../../core/determinism.js';
import {freeze} from '../assets.js';
import {RULES,fingerprint,validateCycleMigration,protectCycleMigration,validateCycleCommand,protectCycle,assertCycleRestore,gold,plus} from './contracts.js';
import {reduceCycle,quoteCycle,cycleEffect} from './reducers.js';
import {requireTrustedCompletion} from './completion.js';
import {restrict,previewRU4} from './policy.js';
export function buildCycleBase(origin,request){
 validateStateV3(origin);validateCycleMigration(request);
 if(request.profileId!==origin.profile.id||request.careerId!==origin.career.id||request.sourceFingerprint!==fingerprint(origin)||request.expectedRevision!==origin.revision||request.expectedMaintenanceRevision!==origin.maintenanceRevision)throw Error('Stale cycle migration source/revisions');
 const next=structuredClone(origin);next.schema=4;next.maintenanceRevision++;next.management.registrySchema=4;
 for(const p of Object.values(next.management.registries.personnel)){p.recordVersion=3;p.personality=null;}
 for(const c of Object.values(next.management.registries.contracts)){c.recordVersion=3;c.duration=c.cyclesRemaining;c.lifecycle='active';c.emergency=false;c.previousContractId=null;}
 next.cycles={version:1,rulesVersion:RULES,origin:structuredClone(origin),migrationRequest:structuredClone(request),manifestDigest:'',number:0,streak:0,phase:'STABLE_PREPARATION',obligations:{},creditors:{},contractArchive:{},statements:{}};
 next.cycles.manifestDigest=fingerprint({management:next.management,rulesVersion:RULES,sourceFingerprint:request.sourceFingerprint});return next;
}
export function previewCycles(origin){validateStateV3(origin);return freeze({sourceFingerprint:fingerprint(origin),rulesVersion:RULES,sourceSchema:3,targetSchema:4,expectedRevision:origin.revision,expectedMaintenanceRevision:origin.maintenanceRevision,warning:'No cycle, income, wages, recovery or assets are granted by migration.'});}
export function quoteEconomy4(s,type,payload){restrict(s,type);if(type==='personnel.terminate'){const p=s.management.registries.personnel[payload.personId]??s.management.registries.specialists[payload.personId];if(p&&s.management.registries.contracts[p.references.contract[0]]?.emergency)throw Error('Emergency contract has no ordinary termination terms; explicitly release after expiry');}return quoteEconomy({...s,schema:3},type,payload);}
function execute4(s,tx,{historical=false,completion=null}={}){
 restrict(s,tx.type);
 if(tx.commandVersion===3){
  validateCycleCommand(tx);if(tx.type==='cycle.settle'&&!historical){requireTrustedCompletion(completion);if(canonical(completion)!==canonical(tx.payload.completion))throw Error('Completion capability differs from command');}
  const q=quoteCycle(s,tx.type,tx.payload);if(q.effectId!==tx.effectId||q.delta!==tx.delta)throw Error('Cycle quote/effect mismatch');const result=reduceCycle(s,tx.type,tx.payload);return {...result,delta:q.delta};
 }
 if(tx.commandVersion===2){
  validateEconomyCommand(tx);quoteEconomy4(s,tx.type,tx.payload);
  if(tx.type==='personnel.terminate'){const p=s.management.registries.personnel[tx.payload.personId]??s.management.registries.specialists[tx.payload.personId];if(p&&s.management.registries.contracts[p.references.contract[0]]?.emergency)throw Error('Emergency driver has no approved early-termination fee; release after one-cycle expiry');}
  const prior=structuredClone(s.management.registries);s.schema=3;const result=executeEconomy(s,tx);s.schema=4;
  if(tx.type==='market.acquire'&&['driver','specialist'].includes(result.details.category)){
   const r=s.management.registries,p=r[result.details.category==='driver'?'personnel':'specialists'][result.details.assetId],c=r.contracts[p.references.contract[0]];
   if(p.role==='driver'){p.recordVersion=3;p.personality=null;}Object.assign(c,{recordVersion:3,duration:c.cyclesRemaining,lifecycle:'active',emergency:false,previousContractId:null});
  }
  if(tx.type==='personnel.terminate'){const p=prior.personnel[tx.payload.personId]??prior.specialists[tx.payload.personId],c=prior.contracts[p.references.contract[0]];s.cycles.creditors[p.id]={id:p.id,name:p.name,role:p.role};s.cycles.contractArchive[c.id]={...c,closedReason:'paid-termination'};}
  return result;
 }
 validateCommandV1(tx);
 if(['ru.assemble','ru.disassemble'].includes(tx.type)){if(tx.type==='ru.assemble'){const p=previewRU4(s,tx,{assignmentId:tx.assignmentId});if(!p.eligible)throw Error(p.reasons.join('; '));}return applyAssembly3(s,tx);}
 if(tx.type==='developer.treasury.adjust'){const b=BigInt(s.career.treasury)+BigInt(tx.delta);if(b<0n||b>BigInt(Number.MAX_SAFE_INTEGER))throw Error('Invalid treasury adjustment');s.career.treasury=Number(b);s.provenance=mergeMarks(s.provenance,[transactionMark(tx)]);s.profile.developerEdited=s.career.developerEdited=true;return undefined;}
 throw Error('Unsupported schema-4 action');
}
const protect=(tx,b,r)=>tx.commandVersion===3?protectCycle(tx,b,r):tx.commandVersion===2?protectEconomic(tx,b,r):protectTransaction(tx,b);
function validateGraph4(s){
 // Validation-only compatibility projection: old validators and persisted records stay unchanged.
 const projected=structuredClone(s);projected.management.registrySchema=3;
 for(const p of Object.values(projected.management.registries.personnel)){if(p.recordVersion!==3)throw Error('Invalid lifecycle driver record');p.recordVersion=2;delete p.personality;}
 for(const c of Object.values(projected.management.registries.contracts)){
  exact(c,['id','ownerCareerId','references','recordVersion','name','term','cyclesRemaining','baseWage','wage','grandfathered','sourceOfferId','duration','lifecycle','emergency','previousContractId'],'lifecycle contract');gold(c.cyclesRemaining);gold(c.duration);
  if(c.recordVersion!==3||c.cyclesRemaining>c.duration||!['active','expired-pending-decision'].includes(c.lifecycle)||(c.cyclesRemaining===0)!==(c.lifecycle==='expired-pending-decision')||typeof c.emergency!=='boolean')throw Error('Invalid lifecycle contract');
  c.recordVersion=2;if(c.emergency){c.term='short';}c.cyclesRemaining=({short:3,standard:8,long:16})[c.term];for(const k of ['duration','lifecycle','emergency','previousContractId'])delete c[k];
 }
 validateGraph3(projected);
 let total=0;for(const o of Object.values(s.cycles.obligations)){gold(o.original);gold(o.paid);gold(o.balance);if(o.original!==plus(o.paid,o.balance)||o.payments.reduce((n,p)=>plus(n,gold(p.amount)),0)!==o.paid)throw Error('Wage balance conservation failed');total=plus(total,o.balance);}return total;
}
export function validateStateV4(s){
 exact(s,[...SCHEMA3_FIELDS,'cycles'],'schema-4 state');if(s.schema!==4||s.management.registrySchema!==4||s.pendingRace!==null)throw Error('Invalid schema-4 scope');
 exact(s.cycles,['version','rulesVersion','origin','migrationRequest','manifestDigest','number','streak','phase','obligations','creditors','contractArchive','statements'],'cycles state');
 if(s.cycles.version!==1||s.cycles.rulesVersion!==RULES||s.cycles.phase!=='STABLE_PREPARATION')throw Error('Invalid cycle rules');gold(s.cycles.number);gold(s.cycles.streak);
 const base=buildCycleBase(s.cycles.origin,s.cycles.migrationRequest),maint=protectCycleMigration(s.cycles.migrationRequest,base.cycles.manifestDigest);
 if(s.cycles.manifestDigest!==base.cycles.manifestDigest||s.history.schema!==1||!Number.isSafeInteger(s.maintenanceRevision)||s.maintenanceRevision<base.maintenanceRevision||s.revision!==s.transactions.length||s.transactions.length>MAX_RECEIPTS||canonical(s.transactions.slice(0,base.transactions.length))!==canonical(base.transactions))throw Error('Invalid cycle lineage/revision');
 const entries=mergeProtected(s.history.commands);if(canonical(entries)!==canonical(s.history.commands)||entries.some(e=>e.careerId!==s.career.id||e.profileId!==s.profile.id)||!entries.some(e=>canonical({...e,acknowledgment:null})===canonical({...maint,acknowledgment:null})))throw Error('Missing/invalid cycle protected history');base.history.commands=mergeProtected(base.history.commands,[maint]);
 for(const receipt of s.transactions.slice(base.transactions.length)){
  const tx=receipt.transaction;exact(receipt,['transaction','resultRevision','balanceAfter',...(tx.type==='developer.treasury.adjust'?[]:['result'])],'cycle gameplay receipt');
  if(tx.careerId!==s.career.id||tx.profileId!==s.profile.id||tx.expectedRevision!==base.revision||receipt.resultRevision!==base.revision+1||!Number.isSafeInteger(tx.expectedMaintenanceRevision)||tx.expectedMaintenanceRevision<base.maintenanceRevision||tx.expectedMaintenanceRevision>s.maintenanceRevision)throw Error('Invalid cycle receipt revision/owner');
  base.maintenanceRevision=tx.expectedMaintenanceRevision;const result=execute4(base,tx,{historical:true});if(receipt.balanceAfter!==base.career.treasury||canonical(result??null)!==canonical(receipt.result??null))throw Error('Cycle receipt does not reconstruct');
  const fact=protect(tx,receipt.balanceAfter,result);if(!entries.some(e=>canonical(e)===canonical(fact)))throw Error('Missing cycle protected gameplay');base.history.commands=mergeProtected(base.history.commands,[fact]);base.transactions.push(structuredClone(receipt));base.revision++;
 }
 assertCycleRestore(s,entries);
 const marks=mergeMarks(s.provenance);if(canonical(marks)!==canonical(s.provenance)||marks.some(m=>m.profileId!==s.profile.id))throw Error('Invalid cycle provenance');
 for(const mark of marks.filter(m=>m.careerId===s.career.id)){const e=entries.find(e=>e.id===mark.id);if(!e||canonical(transactionMark(JSON.parse(e.request)))!==canonical(mark))throw Error('Invalid retained developer fact');}
 for(const e of entries){if(JSON.parse(e.request).type==='developer.treasury.adjust'&&!marks.some(m=>m.id===e.id))throw Error('Developer fact lost');}
 base.profile.developerEdited=Boolean(marks.length);base.career.developerEdited=marks.some(m=>m.careerId===s.career.id);
 for(const field of ['management','cycles','career','profile','economy','migration'])if(canonical(s[field])!==canonical(base[field]))throw Error('Schema-4 '+field+' differs from reconstructed authoritative state');
 for(const e of base.cycles.origin.history.commands)if(!entries.some(k=>canonical(k)===canonical(e)))throw Error('Historical fact changed');validateGraph4(s);return s;
}
export function withKnownHistoryV4(s,marks,history){
 validateStateV4(s);assertCycleRestore(s,history);const n=structuredClone(s);n.provenance=mergeMarks(n.provenance,marks.filter(m=>m.profileId===s.profile.id));n.profile.developerEdited=Boolean(n.provenance.length);n.career.developerEdited=n.provenance.some(m=>m.careerId===n.career.id);n.history.commands=mergeProtected(n.history.commands,history.filter(e=>e.careerId===s.career.id&&e.profileId===s.profile.id));return validateStateV4(n);
}
export function transactV4(s,tx,options={}){
 validateStateV4(s);const old=lookupCommitted(s.history.commands,tx,s.transactions);if(old)return {...old,state:structuredClone(s)};
 if(tx.profileId!==s.profile.id||tx.careerId!==s.career.id)throw Error('Command ownership mismatch');assertRevision(s,tx.expectedRevision,tx.expectedMaintenanceRevision);
 if(s.transactions.length>=MAX_RECEIPTS||s.history.commands.some(e=>e.effectId===tx.effectId))throw Error('Receipt limit or already committed effect');
 const next=structuredClone(s),result=execute4(next,tx,options),receipt={transaction:structuredClone(tx),resultRevision:s.revision+1,balanceAfter:next.career.treasury,...(result===undefined?{}:{result})};next.transactions.push(receipt);next.revision++;next.history.commands=mergeProtected(next.history.commands,[protect(tx,receipt.balanceAfter,result)]);return {state:validateStateV4(next),receipt,duplicate:false};
}
