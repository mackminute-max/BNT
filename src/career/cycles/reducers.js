import {canonical} from '../../core/determinism.js';
import {freeze} from '../assets.js';
import {TERMS} from '../economy/catalog.js';
import {rounded,mul} from '../economy/arithmetic.js';
import {economics} from '../economy/records.js';
import {validateCompletion,contractSnapshot} from './completion.js';
import {RULES,key,fingerprint,gold,plus,validateCycleCommand} from './contracts.js';
import {restrict,requirePreparation,eligibleDrivers,normalDriverRecruitment,assessViability,outstanding,RECOVERY} from './policy.js';
export const sourceFingerprint=s=>fingerprint({career:s.career,profileId:s.profile.id,revision:s.revision,maintenanceRevision:s.maintenanceRevision,management:s.management,cycles:s.cycles});
export function cycleEffect(s,type,p){return type==='cycle.settle'?key(s.career.id,'settlement',p.completion.championshipId):key(s.career.id,type,s.revision,s.maintenanceRevision);}
const persons=s=>[...Object.values(s.management.registries.personnel),...Object.values(s.management.registries.specialists)].sort((a,b)=>a.id<b.id?-1:1);
function archiveCreditor(s,p){const snapshot={id:p.id,name:p.name,role:p.role};const prior=s.cycles.creditors[p.id];if(prior&&canonical(prior)!==canonical(snapshot))throw Error('Creditor identity reuse');s.cycles.creditors[p.id]=snapshot;return snapshot;}
function pay(s,amount,paymentId){
 const claims=Object.values(s.cycles.obligations).filter(o=>o.balance>0).sort((a,b)=>a.cycle-b.cycle||(a.creditor.id<b.creditor.id?-1:a.creditor.id>b.creditor.id?1:0)||(a.id<b.id?-1:1));
 let left=amount;const allocations=[];for(const o of claims){const paid=Math.min(left,o.balance);if(paid){o.paid=plus(o.paid,paid);o.balance-=paid;o.payments.push({id:paymentId,amount:paid});allocations.push({obligationId:o.id,amount:paid});left-=paid;}}
 const spent=amount-left;s.career.treasury-=spent;return {spent,allocations};
}
export function removePerson(s,p,{resolveAssignment=false,reason}){
 const r=s.management.registries;
 if(p.references.assignment?.length){if(!resolveAssignment)throw Error('Explicit assignment resolution required');for(const id of [...p.references.assignment]){const a=r.assignments[id];for(const k of ['personnel','beasts','chariots'])for(const subject of a.references.subject)if(r[k][subject])r[k][subject].references.assignment=[];delete r.assignments[id];}}
 archiveCreditor(s,p);const c=r.contracts[p.references.contract[0]];s.cycles.contractArchive[c.id]={...structuredClone(c),closedReason:reason};delete r.contracts[c.id];delete r[p.role==='driver'?'personnel':'specialists'][p.id];
}
function recovery(s){for(const k of ['personnel','beasts','specialists'])for(const p of Object.values(s.management.registries[k])){if(k==='personnel')p.fatigue=Math.max(0,p.fatigue-RECOVERY.driverFatigue);if(k==='beasts')p.fatigue=Math.max(0,p.fatigue-RECOVERY.beastFatigue);if(p.injury==='Minor')p.injury='Healthy';else if(p.injury==='Major')p.injury='Minor';}}
export function reduceCycle(s,type,p){
 restrict(s,type);const r=s.management.registries;let cost=0,details={};
 if(type==='cycle.settle'){
  validateCompletion(p.completion);const c=p.completion;
  if(p.sourceFingerprint!==sourceFingerprint(s))throw Error('Stale settlement fingerprint');
  if(c.profileId!==s.profile.id||c.careerId!==s.career.id||canonical(c.roster)!==canonical(contractSnapshot(s)))throw Error('Completion ownership/contract snapshot mismatch');
  if(s.cycles.statements[c.championshipId])throw Error('Championship already settled');
  const before=s.career.treasury;let income=0;for(const reward of c.rewards)income=plus(income,reward.amount);s.career.treasury=plus(before,income);
  const cycle=s.cycles.number+1,old=pay(s,s.career.treasury,key(c.championshipId,'old'));
  const assessed=[];for(const person of persons(s)){
   const contract=r.contracts[person.references.contract[0]];if(contract.lifecycle!=='active')continue;
   const id=key(s.career.id,c.championshipId,person.id),creditor=archiveCreditor(s,person);
   const o={kind:'wage-obligation',version:1,id,careerId:s.career.id,championshipId:c.championshipId,cycle,creditor:structuredClone(creditor),contractId:contract.id,original:contract.wage,paid:0,balance:contract.wage,payments:[]};if(s.cycles.obligations[id])throw Error('Duplicate wage obligation');s.cycles.obligations[id]=o;assessed.push(id);
  }
  const current=pay(s,s.career.treasury,key(c.championshipId,'current'));s.cycles.number=cycle;s.cycles.streak=outstanding(s)>0?s.cycles.streak+1:0;
  // Recovery precedes term progression and departure eligibility; every charged final
  // cycle is assessed before expiry. Departures see the recovered, post-expiry roster.
  recovery(s);const expired=[];for(const contract of Object.values(r.contracts))if(contract.lifecycle==='active'){contract.cyclesRemaining--;if(contract.cyclesRemaining===0){contract.lifecycle='expired-pending-decision';expired.push(contract.id);}}
  const departure={personId:null,deferred:[]};
  if(s.cycles.streak>=5){const debt=id=>Object.values(s.cycles.obligations).filter(o=>o.creditor.id===id).reduce((n,o)=>plus(n,o.balance),0);
   const candidates=persons(s).filter(p=>r.contracts[p.references.contract[0]].lifecycle==='active'&&debt(p.id)>0).sort((a,b)=>debt(b.id)-debt(a.id)||(a.id<b.id?-1:1));
   for(const person of candidates){if(person.references.assignment?.length){departure.deferred.push({personId:person.id,reason:'Assigned employee; no implicit unassignment'});continue;}if(person.role==='driver'&&eligibleDrivers(s).some(d=>d.id===person.id)&&eligibleDrivers(s).length<=1){departure.deferred.push({personId:person.id,reason:'Last entry-eligible contracted driver'});continue;}departure.personId=person.id;removePerson(s,person,{reason:'payroll-default'});break;}
   if(!departure.personId&&!departure.deferred.length)departure.deferred.push({personId:null,reason:'No eligible active unpaid employee'});
  }
  details={kind:'settlement-statement',version:1,championshipId:c.championshipId,cycle,outcome:c.outcome,completion:structuredClone(c),income,treasuryBefore:before,treasuryAfter:s.career.treasury,oldPayments:old.allocations,currentPayments:current.allocations,assessed,arrears:outstanding(s),streak:s.cycles.streak,expired,departure};s.cycles.statements[c.championshipId]=structuredClone(details);cost=old.spent+current.spent;
 }else if(type==='payroll.pay'){
  gold(p.amount);if(p.amount===0||p.amount>s.career.treasury||p.amount>outstanding(s))throw Error('Payment exceeds Gold or outstanding wages');details=pay(s,p.amount,key('voluntary',s.revision,s.maintenanceRevision));cost=details.spent;if(outstanding(s)===0)s.cycles.streak=0;
 }else if(type==='contract.renew'){
  const person=r.personnel[p.personId]??r.specialists[p.personId],old=person&&r.contracts[person.references.contract[0]];if(!old||old.lifecycle!=='expired-pending-decision'||old.emergency)throw Error('Only expired ordinary contracts can be renewed');const term=TERMS[p.term];if(!term)throw Error('Invalid renewal');cost=term.surcharge;if(cost>s.career.treasury)throw Error('Insufficient Gold');
  const id=key('renewal',s.career.id,p.personId,s.revision,s.maintenanceRevision);s.cycles.contractArchive[old.id]={...structuredClone(old),closedReason:'renewed'};delete r.contracts[old.id];r.contracts[id]={...structuredClone(old),id,term:p.term,duration:term.duration,cyclesRemaining:term.duration,wage:rounded(mul(old.baseWage,term.multiplier)),lifecycle:'active',grandfathered:false,previousContractId:old.id};person.references.contract=[id];s.career.treasury-=cost;details={personId:person.id,contractId:id,signing:cost};
 }else if(type==='contract.release'){
  const person=r.personnel[p.personId]??r.specialists[p.personId];if(!person)throw Error('Missing employee');const c=r.contracts[person.references.contract[0]];if(c.lifecycle!=='expired-pending-decision')throw Error('Active contracts require existing paid termination');details={personId:person.id,contractId:c.id,assignmentIds:[...(person.references.assignment??[])]};removePerson(s,person,{resolveAssignment:p.resolveAssignment,reason:'explicit-expired-release'});
 }else if(type==='emergency.request'){
  if(eligibleDrivers(s).length||normalDriverRecruitment(s))throw Error('A driver can be fielded or ordinarily recruited');if(Object.values(r.contracts).some(c=>c.emergency&&c.lifecycle==='active'))throw Error('An emergency driver is already active');const cap=Object.values(r.properties)[0].capacities.drivers;if(Object.keys(r.personnel).length>=cap)throw Error('Driver capacity full; explicitly free capacity first');
  const id=key('emergency',s.career.id,s.revision,s.maintenanceRevision),contractId=key(id,'contract');
  const person={id,ownerCareerId:s.career.id,references:{contract:[contractId]},recordVersion:3,name:'Emergency Replacement Driver',role:'driver',attributes:{driving:40,beastHandling:40,combat:40,awareness:40,nerve:40},condition:100,injury:'Healthy',fatigue:0,strain:0,xp:0,available:true,training:{driving:0,beastHandling:0,combat:0,awareness:0,nerve:0},personality:{aggression:50,caution:50,patience:50,opportunism:50,staminaManagement:50,tacticalDiscipline:50}};
  person.economics=economics('driver',person,{tier:'Budget',quality:1,wageQuality:1});r.personnel[id]=person;r.contracts[contractId]={id:contractId,ownerCareerId:s.career.id,references:{employee:[id]},recordVersion:3,name:'Emergency driver contract',term:'emergency',duration:1,cyclesRemaining:1,baseWage:20,wage:20,grandfathered:false,sourceOfferId:null,lifecycle:'active',emergency:true,previousContractId:null};details={profileVersion:'m2d-emergency-driver-v1',personId:id,contractId,wage:20};
 }else if(type==='career.confirmFailure'){
  if(p.sourceFingerprint!==sourceFingerprint(s)||p.confirmed!==true||!assessViability(s).canConfirm)throw Error('Failure is not proven or confirmation is stale');s.career.status='Failed';details={assessment:assessViability({...s,career:{...s.career,status:'Foundation'}}),confirmed:true};
 }else throw Error('Unknown cycle action');
 return {type,cost,details};
}
export function quoteCycle(s,type,payload){
 const qtx={id:'quote',profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:3,type,effectId:'quote',delta:0,reason:'Pure cycle quote',payload};validateCycleCommand(qtx);
 const next=structuredClone(s),before=next.career.treasury,result=reduceCycle(next,type,payload);return freeze({...result,delta:next.career.treasury-before,effectId:cycleEffect(s,type,payload),canAfford:true});
}
