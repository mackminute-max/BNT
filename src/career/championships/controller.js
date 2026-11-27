import {regionalAllowed} from '../m5/d2/markets.js';
import {effectiveRU,raceProgression} from '../m4/progression.js';
import {endowmentsFor,rivalEndowments} from '../p3/boons.js';
import {enableE3,initializeE3Instance,eligibility,noStarterCandidate,publishOfficial,E3_RULES} from './progression.js';
import {restoreServiceNative} from './condition.js';
import {financialAnchorValue} from './anchor.js';
import {requireNoStarterTransfer,requireRecoveryTransfer} from './clearance-transfer.js';
import {requireClearanceTransfer,requireBirthTransfer} from './clearance-transfer.js';
import {validateRU} from '../../model/ru.js';
import {validateStateV5} from './schema5.js';import {executeCareerCandidateV4} from '../cycles/schema4.js';
import {validateCommandV1,protectTransaction} from '../history.js';import {validateEconomyCommand,protectEconomic} from '../economy/commands.js';import {validateCycleCommand,protectCycle,fingerprint,gold} from '../cycles/contracts.js';
import {mergeProtected,lookupCommitted} from '../economy/protected-registry.js';import {exact,id,MAX_RECEIPTS,mergeMarks,transactionMark} from '../legacy-state.js';import {assertRevision} from '../schema2.js';import {canonical,hash,random} from '../../core/determinism.js';
import {commitEntrant} from '../cycles/racing-adapter.js';import {freeze} from '../assets.js';import {defaultRU} from '../../model/ru.js';import {createRace} from '../../sim/race.js';import {validateCoaching} from '../../ai/coaching.js';import {validateCheckpointReference} from './contracts.js';
import {CONTROLLER_RULES,validateControllerCommand,protectController,controllerEffect,assertControllerRestore} from './controller-contracts.js';import {validateOffer,qualifies,developmentOffer,requireCatalog} from './offers.js';
export const controllerSource=s=>fingerprint({career:s.career,profileId:s.profile.id,revision:s.revision,maintenanceRevision:s.maintenanceRevision,management:s.management,cycles:s.cycles,championshipFoundation:s.championshipFoundation});
export const controllerActive=s=>s?.championshipFoundation?.version>=2&&s.championshipFoundation.activeId!==null;
export function activeChampionship(s){return controllerActive(s)?s.championshipFoundation.instances[s.championshipFoundation.activeId]:null;}
function empty(s,tx){return {version:2,rulesVersion:CONTROLLER_RULES,origin:structuredClone(s),enabledBy:structuredClone(tx),activeId:null,instances:{},offers:[developmentOffer()],facts:{reputation:0,trophies:[],victories:{}}};}
function expectedEffect(s,t){if(['championship.stageClearance','championship.publish','championship.noStarters'].includes(t.type))return controllerEffect(s.career.id,t.type,t.payload.instanceId,s.championshipFoundation.instances[t.payload.instanceId]?.raceId);return controllerEffect(s.career.id,t.type,t.payload.instanceId??'foundation',['controller.enable','controller.enableE3','championship.register'].includes(t.type)?null:s.revision);}
function apply(s,t,{historical=false,clearance=null,birth=null,catalog=null,recovery=null,noStarters=null}={}){
 if(t.commandVersion!==4){const regional=regionalAllowed(s,t.type,t.payload);if(controllerActive(s)&&!regional)throw Error('Stable management is read-only while championship is active or unsettled');let result;const active=s.championshipFoundation.activeId;if(regional)s.championshipFoundation.activeId=null;try{result=executeCareerCandidateV4(s,t,{historical});}finally{if(regional)s.championshipFoundation.activeId=active;}if(s.championshipFoundation.version===3)restoreServiceNative(s,t,result);s.schema=5;return result;}
 validateControllerCommand(t);if(t.sourceFingerprint!==controllerSource(s))throw Error('Stale championship source');if(t.effectId!==expectedEffect(s,t))throw Error('Invalid championship effect identity');
 const p=t.payload,before=s.career.treasury;let details;
 if(t.type==='controller.enable'){
  if(s.championshipFoundation.version!==1||t.expectedInstanceRevision!==null)throw Error('Controller already enabled');s.championshipFoundation=empty(s,t);details={version:2};
 }else{
  const f=s.championshipFoundation;if(![2,3].includes(f.version))throw Error('Enable championship controller explicitly');
  if(t.type==='controller.enableE3'){enableE3(s);details={version:3,rulesVersion:E3_RULES};
  }else if(t.type==='championship.refreshOffers'){
   if(!historical)requireCatalog(catalog,p.offers);
   if(f.activeId!==null||!Array.isArray(p.offers)||p.offers.length<1||p.offers.length>32)throw Error('Offer refresh requires stable preparation and bounded offers');p.offers.forEach(validateOffer);if(new Set(p.offers.map(o=>o.value.templateId)).size!==p.offers.length)throw Error('Duplicate offer template identities');f.offers=structuredClone(p.offers);details={offerFingerprints:f.offers.map(o=>o.fingerprint)};
  }else if(t.type==='championship.register'){
   if(f.activeId!==null||t.expectedInstanceRevision!==null)throw Error('An active or unsettled championship already exists');id(p.instanceId);validateOffer(p.offer);if(!f.offers.some(o=>o.fingerprint===p.offer.fingerprint))throw Error('Offer is not on the authoritative board');if(f.instances[p.instanceId])throw Error('Championship instance identity reused');if(s.career.status==='Failed'||!qualifies(p.offer.value.qualification,f.facts))throw Error('Championship qualification/career gate failed');
   exact(p.selection,['assignmentId','driverId','beastIds','chariotId']);const committed=commitEntrant(s,p.instanceId,p.selection,{assignmentId:p.selection.assignmentId});const fee=p.offer.value.entryFee;if(fee>s.career.treasury)throw Error('Insufficient entry fee');
   const r=s.management.registries,chariot=r.chariots[p.selection.chariotId];const entrants=[{id:'e2-'+hash([p.instanceId,'player']).toString(16),player:true,native:structuredClone(committed.ru),payrollContext:structuredClone(committed.payrollContext),assetIds:{driver:p.selection.driverId,beasts:[...p.selection.beastIds],chariot:p.selection.chariotId,equipment:[...(chariot.references.equipment??[])]}}];
   entrants[0].native.id=entrants[0].id;
   for(let i=1;i<p.offer.value.fieldSize;i++){const entrantId='e2-'+hash([p.instanceId,'rival',i]).toString(16),native=defaultRU(entrantId,46+i*2);entrants.push({id:entrantId,player:false,native,assetIds:null});}
   const instance={version:1,id:p.instanceId,revision:0,phase:'INTERMISSION_READY',offer:structuredClone(p.offer),registrationId:t.id,registrationRevision:s.revision+1,registrationMaintenanceRevision:s.maintenanceRevision,fee,lockedSelection:structuredClone(p.selection),entrants,playerId:entrants[0].id,coaching:null,raceIndex:0,raceSetup:null,raceId:null,checkpointRef:null,pendingClearance:null,withdrawal:null,standings:entrants.map(e=>({id:e.id,points:0})),raceResults:[],conditionMapping:{version:1,status:'UNAPPROVED'},blockedReason:null};
   if(f.version===3)initializeE3Instance(s,instance);
   // Capacity and setup validation against every frozen event precedes the debit.
   for(let i=0;i<instance.offer.value.schedule.length;i++)prepareRace(instance,i);
   s.career.treasury-=fee;f.instances[instance.id]=instance;f.activeId=instance.id;details={instanceId:instance.id,offerFingerprint:p.offer.fingerprint,entryFee:fee};
  }else{
   const x=f.instances[p.instanceId];if(!x||f.activeId!==p.instanceId||t.expectedInstanceRevision!==x.revision)throw Error('Stale or unknown active instance');
   if(t.type==='championship.coach'){
    if(x.phase!=='INTERMISSION_READY')throw Error('Coaching is frozen at race start');validateCoaching(p.coaching);x.coaching=structuredClone(p.coaching);details={instanceId:x.id,coaching:x.coaching};
   }else if(t.type==='championship.start'){
    if(!['INTERMISSION_READY','AI_CONTINUATION'].includes(x.phase))throw Error('Race requires manual start from an eligible intermission');if(f.version===3)x.eligibility=eligibility(s,x);x.raceSetup=prepareRace(x,x.raceIndex);x.raceId='e2-race-'+fingerprint([x.id,x.raceIndex]).slice(0,40);x.phase=x.raceSetup?'RACE_START_PENDING':'NO_STARTERS_PENDING';if(f.version===3)x.raceAnchor=financialAnchorValue(s,x);details={instanceId:x.id,raceId:x.raceId,setupFingerprint:fingerprint(x.raceSetup)};
   }else if(t.type==='championship.bindRace'){
    if(x.phase!=='RACE_START_PENDING')throw Error('Race birth already bound or phase invalid');validateCheckpointReference(p.reference);if(!historical)requireBirthTransfer(birth,p,s);x.checkpointRef=structuredClone(p.reference);x.phase='RACE_ACTIVE';details={instanceId:x.id,reference:x.checkpointRef};
   }else if(t.type==='championship.publish'){
    if(f.version!==3||!['RACE_ACTIVE','RECOVERY_REQUIRED','RACE_CLEARANCE_BLOCKED'].includes(x.phase))throw Error('No publishable E3 race');validateCheckpointReference(p.reference);if(!historical)requireClearanceTransfer(clearance,p,s);details=publishOfficial(s,x,p);
   }else if(t.type==='championship.noStarters'){
    if(f.version!==3)throw Error('Enable E3');if(!historical)requireNoStarterTransfer(noStarters,p,s);const expected=noStarterCandidate(s,x);if(canonical(expected.proof)!==canonical(p.proof)||canonical(expected.evidence)!==canonical(p.evidence))throw Error('Unproven no-starter result');details=publishOfficial(s,x,{candidate:p.proof,reference:{kind:'eligibility',evidence:p.evidence},setupFingerprint:null},true);
   }else if(t.type==='championship.blockRace'){
    if(f.version!==3||!['RACE_START_PENDING','RACE_ACTIVE','RACE_CLEARANCE_BLOCKED','RECOVERY_REQUIRED'].includes(x.phase))throw Error('No blockable race');if(!historical)requireRecoveryTransfer(recovery,p,s,'block');if(typeof p.reason!=='string'||!p.reason||p.reason.length>2000)throw Error('Invalid recovery reason');x.phase=p.reason.startsWith('RACE_CLEARANCE_BLOCKED')?'RACE_CLEARANCE_BLOCKED':'RECOVERY_REQUIRED';x.blockedReason=p.reason;x.recoveryLog.push({kind:'blocked',raceId:x.raceId,reason:p.reason,reference:structuredClone(p.reference)});details={instanceId:x.id,phase:x.phase,reason:p.reason};
   }else if(t.type==='championship.retryRace'){
    if(f.version!==3||!['RACE_CLEARANCE_BLOCKED','RECOVERY_REQUIRED'].includes(x.phase))throw Error('No recoverable race');if(!historical)requireRecoveryTransfer(recovery,p,s,'retry');x.phase=x.checkpointRef?'RACE_ACTIVE':'RACE_START_PENDING';x.blockedReason=null;x.recoveryLog.push({kind:'retry',raceId:x.raceId,reference:structuredClone(p.reference)});details={instanceId:x.id,phase:x.phase};
   }else if(t.type==='championship.stageClearance'){
    if(!['RACE_ACTIVE','RECOVERY_REQUIRED'].includes(x.phase))throw Error('No active race to stage');validateCheckpointReference(p.reference);if(!historical)requireClearanceTransfer(clearance,p,s);
    const c=p.candidate;if(!c||c.kind!=='BNT-cleared-race-proof'||c.version!==1||c.identity.careerId!==s.career.id||c.identity.profileId!==s.profile.id||c.identity.instanceId!==x.id||c.identity.raceId!==x.raceId||p.setupFingerprint!==fingerprint(x.raceSetup)||!Array.isArray(c.conditions)||!Array.isArray(c.classification)||c.conditions.length!==x.raceSetup.entrants.length||c.classification.length!==c.conditions.length)throw Error('Invalid staged clearance evidence');
    const expected=new Set(x.raceSetup.entrants.map(e=>e.ru.id));for(const row of c.conditions){if(!expected.delete(row.entrantId)||row.native.id!==row.entrantId)throw Error('Foreign/duplicate cleared native identity');validateRU(row.native);}if(expected.size||new Set(c.classification.map(r=>r.id)).size!==c.conditions.length||c.classification.some(r=>!c.conditions.some(e=>e.entrantId===r.id)))throw Error('Invalid clearance classification identities');
    x.pendingClearance={candidate:structuredClone(c),setupFingerprint:p.setupFingerprint,reference:structuredClone(p.reference)};x.checkpointRef=structuredClone(p.reference);x.phase='RECOVERY_REQUIRED';x.blockedReason='D2 numerical condition mapping is not owner-approved. Cleared evidence is retained; no official result, condition, standings or entitlement has been committed.';details={instanceId:x.id,reference:x.checkpointRef,status:x.phase};
   }else if(t.type==='championship.withdraw'){
    if(x.phase!=='INTERMISSION_READY'||p.confirmed!==true)throw Error('Withdrawal requires explicit confirmation at intermission');x.withdrawal={kind:'Voluntary',raceIndex:x.raceIndex};x.phase='AI_CONTINUATION';details={instanceId:x.id,withdrawal:x.withdrawal,entryFeeRefund:0};
   }else throw Error('Unsupported controller operation');x.revision++;
  }
 }
 const delta=s.career.treasury-before;if(t.delta!==delta)throw Error('Championship quote/delta mismatch');return {type:t.type,delta,details};
}
export function prepareRace(instance,index){
 const event=instance.offer.value.schedule[index];if(!event)throw Error('Invalid race index');const seed=hash(['m2e-race-seed-v1',instance.id,index]),gridSeed=hash(['m2e-grid-seed-v1',instance.id,index]);
 let entrants=instance.entrants.filter(e=>(!instance.withdrawal||!e.player)&&(!instance.conditionState||instance.eligibility.find(a=>a.entrantId===e.id)?.mayStart)).map(e=>({...e}));if(!entrants.length){if(instance.conditionState)return null;throw Error('No starters: authoritative eligibility/no-starter controller required');}
 const seeded=(a,b)=>random(gridSeed,a.id)-random(gridSeed,b.id)||(a.id<b.id?-1:1);
 if(index===0||event.grid==='random')entrants.sort(seeded);else{const ranks=new Map(instance.standings.map((x,i)=>[x.id,i]));entrants.sort((a,b)=>(event.grid==='reverse'?-1:1)*((ranks.get(a.id)??0)-(ranks.get(b.id)??0))||seeded(a,b));}
 const initial=createRace({...(event.surfaces?{surfaces:event.surfaces}:{}),course:event.course,overrides:event.config,format:event.format,weather:event.weather,entrants:entrants.map(e=>({ru:e.native}))});
 const nativeEntrants=entrants.map((e,i)=>({ru:e.player&&instance.m4?effectiveRU(e.native,instance.m4):structuredClone(e.native),...(e.player&&instance.m4?{progressionContext:instance.m6?{...raceProgression(instance.m4),version:instance.m6.interactionVersion===3?3:2,interactionRules:instance.m6.interactionVersion===3?'m6-p1-immediate-signs-abilities-v1':'m6-immediate-signs-abilities-v1',abilityId:instance.m6.activeAbility??null}:raceProgression(instance.m4)}:{}),q:initial.setup.entrants[i].q,lane:initial.setup.entrants[i].lane,...(e.affinityContext?{affinityContext:e.affinityContext}:{}),...(e.payrollContext?{payrollContext:e.payrollContext}:{}),...(e.player&&instance.coaching?{coachingContext:instance.coaching}:{}),...(e.player&&instance.m4&&endowmentsFor(instance)?{endowments:endowmentsFor(instance)}:{}),...(!e.player&&instance.m6?{endowments:rivalEndowments(instance,e.id)}:{})}));
 const raceId='e2-race-'+fingerprint([instance.id,index]).slice(0,40);
 return createRace({seed,...(event.surfaces?{surfaces:event.surfaces}:{}),course:event.course,overrides:event.config,format:event.format,weather:event.weather,entrants:nativeEntrants,playerId:entrants.find(e=>e.player)?.id??entrants[0].id,championshipContext:{version:1,instanceId:instance.id,raceId}}).setup;
}
const fact=(t,b,r)=>t.commandVersion===4?protectController(t,b,r):t.commandVersion===3?protectCycle(t,b,r):t.commandVersion===2?protectEconomic(t,b,r):protectTransaction(t,b);
export function validateControllerState(s){
 const f=s.championshipFoundation;exact(f,['version','rulesVersion','origin','enabledBy','activeId','instances','offers','facts']);if(![2,3].includes(f.version)||f.rulesVersion!==(f.version===2?CONTROLLER_RULES:E3_RULES)||f.origin.championshipFoundation.version!==1)throw Error('Unsupported controller aggregate');validateStateV5(f.origin);
 let n=structuredClone(f.origin);const start=n.transactions.length;
 if(s.transactions.length<=start||s.transactions.length>MAX_RECEIPTS||canonical(s.transactions.slice(0,start))!==canonical(n.transactions)||s.revision!==s.transactions.length)throw Error('Invalid controller transaction lineage');
 for(const receipt of s.transactions.slice(start)){
  const t=receipt.transaction;exact(receipt,['transaction','resultRevision','balanceAfter',...(t.type==='developer.treasury.adjust'?[]:['result'])],'controller receipt');if(t.profileId!==n.profile.id||t.careerId!==n.career.id||t.expectedRevision!==n.revision||t.expectedMaintenanceRevision<n.maintenanceRevision||t.expectedMaintenanceRevision>s.maintenanceRevision||receipt.resultRevision!==n.revision+1)throw Error('Invalid controller revision/ownership');
  n.maintenanceRevision=t.expectedMaintenanceRevision;const result=apply(n,t,{historical:true});if(receipt.balanceAfter!==n.career.treasury||canonical(result??null)!==canonical(receipt.result??null))throw Error('Controller receipt reconstruction failed');
  n.transactions.push(structuredClone(receipt));n.revision++;n.history.commands=mergeProtected(n.history.commands,[fact(t,n.career.treasury,result)]);
 }
 for(const m of n.provenance)if(!s.provenance.some(x=>canonical(x)===canonical(m)))throw Error('Controller provenance lost');for(const m of s.provenance.filter(x=>x.careerId===s.career.id)){const e=s.history.commands.find(e=>e.id===m.id);if(!e||canonical(transactionMark(JSON.parse(e.request)))!==canonical(m))throw Error('Forged controller provenance');}
 const expectedMarks=mergeMarks(s.provenance);if(expectedMarks.some(m=>m.profileId!==s.profile.id))throw Error('Controller provenance belongs to another Owner Profile');n.profile.developerEdited=Boolean(expectedMarks.length);n.career.developerEdited=expectedMarks.some(x=>x.careerId===n.career.id);n.provenance=expectedMarks;
 n.maintenanceRevision=s.maintenanceRevision;n.history.commands=mergeProtected(n.history.commands);
 if(canonical(n)!==canonical(s))throw Error('Controller state differs from authoritative reconstruction');assertControllerRestore(s,s.history.commands);return s;
}
export function transactController(s,t,options={}){
 if(s.championshipFoundation.version>=2)validateControllerState(s);else validateStateV5(s);
 const old=lookupCommitted(s.history.commands,t,s.transactions);if(old)return {...old,state:structuredClone(s)};
 if(t.profileId!==s.profile.id||t.careerId!==s.career.id)throw Error('Championship ownership mismatch');assertRevision(s,t.expectedRevision,t.expectedMaintenanceRevision);if(s.transactions.length>=MAX_RECEIPTS||s.history.commands.some(e=>e.effectId===t.effectId))throw Error('Receipt/effect limit');
 const n=structuredClone(s),result=apply(n,t,options),receipt={transaction:structuredClone(t),resultRevision:s.revision+1,balanceAfter:n.career.treasury,...(result===undefined?{}:{result})};n.transactions.push(receipt);n.revision++;n.history.commands=mergeProtected(n.history.commands,[fact(t,n.career.treasury,result)]);validateControllerState(n);return {state:n,receipt,duplicate:false};
}
export function makeControllerCommand(s,type,payload,idValue){
 const instance=payload.instanceId?s.championshipFoundation.instances?.[payload.instanceId]:null;
 return {id:idValue,profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:4,expectedInstanceRevision:type==='championship.register'||type==='controller.enable'?null:instance?.revision??null,sourceFingerprint:controllerSource(s),type,effectId:controllerEffect(s.career.id,type,payload.instanceId??'foundation',['controller.enable','controller.enableE3','championship.register'].includes(type)?null:(['championship.stageClearance','championship.publish','championship.noStarters'].includes(type)?instance?.raceId:s.revision)),delta:type==='championship.register'?-payload.offer.value.entryFee:0,reason:'Explicit championship operation',payload:structuredClone(payload)};
}
export function controllerOffers(s,offers=s.championshipFoundation.offers??[developmentOffer()]){const f=s.championshipFoundation;return offers.map(offer=>({offer,qualified:qualifies(validateOffer(offer).value.qualification,f.version>=2?f.facts:{reputation:0,trophies:[],victories:{}}),active:controllerActive(s),canAfford:s.career.treasury>=offer.value.entryFee}));}

// Internal candidate seam: callers retain the protected atomic publication boundary.
export function executeControllerCandidate(state,command,options={}){return apply(state,command,options);}
