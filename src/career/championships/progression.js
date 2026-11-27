import {survivalBonus,seriesLevels} from '../m6/facilities.js';
import {createRace} from '../../sim/race.js';
import {hash} from '../../core/determinism.js';
import {mapCondition,initialCondition,nativeEligibility,CONDITION_MAPPING} from './condition.js';
import {previewRU4} from '../cycles/policy.js';
import {fingerprint} from '../cycles/contracts.js';
import {championshipClassification,raceAwardEffects,standings,titleCandidate} from './scoring.js';
import {financialAnchorValue} from './anchor.js';
import {noStarterProof} from '../../sim/foundation/no-starters.js';
import {canonical} from '../../core/determinism.js';
import {replaceEliminatedRivals} from '../m6/replacements.js';
import {rollCasualties,applyCasualtiesToPersistent,applyCasualtiesToPlayer} from '../p3/stakes.js';
export const E3_RULES='m2e-controller-e3-v1';
export const raceIdFor=(x,index=x.raceIndex)=>'e2-race-'+fingerprint([x.id,index]).slice(0,40);
export function enableE3(s){
 const f=s.championshipFoundation;if(f.version!==2)throw Error('Explicit E2 controller source required');f.version=3;f.rulesVersion=E3_RULES;
 for(const x of Object.values(f.instances)){freezeNativeProfiles(x);x.conditionMapping={version:CONDITION_MAPPING,status:'ACTIVE',historicalFieldsPreserved:true};x.conditionState=Object.fromEntries(x.entrants.map(e=>[e.id,initialCondition(e,s)]));x.eligibility=eligibility(s,x);x.officialFinal=null;x.recoveryLog=[];x.raceAnchor=x.raceId?financialAnchorValue(s,x):null;}
}
function freezeNativeProfiles(x){const normalized=createRace({seed:hash(['m2e-registered-profiles-v1',x.id]),entrants:x.entrants.map(e=>({ru:e.native}))}).setup.entrants;for(const e of x.entrants){const native=x.raceSetup?.entrants.find(r=>r.ru.id===e.id)?.ru??normalized.find(r=>r.ru.id===e.id).ru;e.native.driver.personality=structuredClone(native.driver.personality);}}
export function initializeE3Instance(s,x){freezeNativeProfiles(x);x.conditionMapping={version:CONDITION_MAPPING,status:'ACTIVE',historicalFieldsPreserved:true};x.conditionState=Object.fromEntries(x.entrants.map(e=>[e.id,initialCondition(e,s)]));x.eligibility=eligibility(s,x);x.officialFinal=null;x.recoveryLog=[];x.raceAnchor=null;}
export function eligibility(s,x){return x.entrants.map(e=>{
 const r=e.player?previewRU4(s,x.lockedSelection,{assignmentId:x.lockedSelection.assignmentId}):nativeEligibility(e.native,x.conditionState[e.id]);
 const withdrawn=e.player&&!!x.withdrawal;return {entrantId:e.id,mayStart:!withdrawn&&r.eligible,reason:withdrawn?'Player withdrew':r.eligible?'Eligible':r.reasons.join('; ')};
});}
export function noStarterCandidate(s,x){
 if(x.phase!=='NO_STARTERS_PENDING'||!x.eligibility||x.eligibility.some(r=>r.mayStart))throw Error('No-starter event requires authoritative ineligibility');
 const current=eligibility(s,x);if(canonical(current)!==canonical(x.eligibility))throw Error('Eligibility changed');
 const evidence={version:1,sourceFingerprint:fingerprint({instanceId:x.id,event:x.raceIndex,entrants:x.entrants,condition:x.conditionState,eligibility:current}),registered:current};
 const proof=noStarterProof({profileId:s.profile.id,careerId:s.career.id,instanceId:x.id,raceId:x.raceId},evidence);return {proof,evidence};
}
function applyPlayer(s,e,mapped){
 const r=s.management.registries,ids=e.assetIds,d=r.personnel[ids.driver],c=r.chariots[ids.chariot],n=mapped.native,p=mapped.persistent;
 d.condition=n.driver.condition;d.strain=n.driver.strain;d.injury=p.driver.injury;
 ids.beasts.forEach((id,i)=>{const b=r.beasts[id];b.condition=n.beasts[i].condition;b.fatigue=n.beasts[i].fatigue;b.injury=p.beasts[i].injury;});
 c.condition=n.chariot.condition;c.wear=n.chariot.wear;c.integrity=p.chariot.integrity;c.status=p.chariot.status;
 // No availability restoration, driver management-fatigue conversion, XP or equipment changes.
}
// Phase 3: a wrecked turnout may lose its driver or a beast (death) or its chariot (destroyed).
function stakes(s,x,e,index,resultId,row,final){const format=x.offer.value.schedule[index].format,lost=rollCasualties({instanceId:x.id,resultId,entrantId:e.id,format,wrecked:row?.nativeStatus==='Retired',final,survive:e.player?100-(100-survivalBonus(seriesLevels(x)))*(x.m4?.loadout?.includes('ironhide')?.5:1):0});if(!lost.length)return;applyCasualtiesToPersistent(x.conditionState[e.id],lost);if(e.player)applyCasualtiesToPlayer(s,e,lost);const n=x.m6.names[e.id]??{};x.m6.casualties??=[];for(const c of lost)x.m6.casualties.push({entrantId:e.id,member:c.member,kind:c.kind,raceIndex:index,resultId,team:e.player?s.career.name:n.organization??'Rival',name:c.member==='driver'?n.driver:c.member==='chariot'?n.chariot:n.beasts?.[Number(c.member.split('-')[1])]??'Beast',player:!!e.player});}
export function publishOfficial(s,x,{candidate,reference,setupFingerprint},noStarter=false){
 if(x.raceResults.some(r=>r.raceId===x.raceId))throw Error('Official race identity already committed');
 const index=x.raceIndex,eventId=raceIdFor(x),resultId=noStarter?'e3-no-starters-'+fingerprint([x.id,index]).slice(0,40):candidate.resultId;
 if(eventId!==x.raceId)throw Error('Scheduled race identity mismatch');if(Object.values(s.championshipFoundation.instances).some(a=>a.raceResults.some(r=>r.resultId===resultId)))throw Error('Conflicting/reused official result identity');
 let rows=[],effects=[],mappings=[];
 if(!noStarter){
  if(candidate.kind!=='BNT-cleared-race-proof'||candidate.version!==1||candidate.identity.profileId!==s.profile.id||candidate.identity.careerId!==s.career.id||candidate.identity.instanceId!==x.id||candidate.identity.raceId!==x.raceId||candidate.watermark!==reference.watermark||candidate.sourceRevision+1!==reference.revision||typeof candidate.resultId!=='string')throw Error('Invalid official proof scope/revision');
  if(!x.raceSetup||setupFingerprint!==fingerprint(x.raceSetup))throw Error('Official setup mismatch');
  rows=championshipClassification(candidate);const starters=new Set(x.raceSetup.entrants.map(e=>e.ru.id));
  if(rows.length!==starters.size||candidate.conditions.length!==starters.size||new Set(candidate.conditions.map(c=>c.entrantId)).size!==starters.size||rows.some(r=>!starters.has(r.id)))throw Error('Official participant identities mismatch');
  for(const condition of candidate.conditions){const e=x.entrants.find(e=>e.id===condition.entrantId),start=x.raceSetup.entrants.find(e=>e.ru.id===condition.entrantId);if(!e||!start||e.native.id!==condition.native.id)throw Error('Foreign native consequence');
   const mapped=mapCondition({instanceId:x.id,eventId,resultId,start:start.ru,final:condition.native,persistent:x.conditionState[e.id],provenance:{reference,setupFingerprint,stateFingerprint:candidate.stateFingerprint}});x.conditionState[e.id]=structuredClone(mapped.persistent);e.native=structuredClone(mapped.native);if(e.player)applyPlayer(s,e,mapped);if(x.m6&&s.schema===8)stakes(s,x,e,index,resultId,rows.find(r=>r.id===e.id),condition.native);mappings.push(structuredClone(mapped.audit));
  }
  effects=raceAwardEffects(rows,{points:x.offer.value.points,dnfPoints:x.offer.value.dnfPoints},{careerId:s.career.id,instanceId:x.id,raceId:x.raceId});
 }
 const participation=x.entrants.map(e=>({entrantId:e.id,started:rows.some(r=>r.id===e.id&&r.started),eligibility:structuredClone(x.eligibility.find(a=>a.entrantId===e.id))}));
 const record={version:1,raceId:x.raceId,eventIndex:index,resultId,kind:noStarter?'NoStarters':'NativeCleared',proofFingerprint:fingerprint(candidate),proof:structuredClone(candidate),reference:structuredClone(reference),anchor:structuredClone(x.raceAnchor),setupFingerprint,rows,effects,mappings,participation};
 x.raceResults.push(record);x.pendingClearance=null;x.blockedReason=null;x.checkpointRef=null;x.standings=standings(x.entrants.map(e=>e.id),x.raceResults);x.eligibility=eligibility(s,x);
 if(index+1===x.offer.value.schedule.length){x.phase='SETTLEMENT_PENDING';x.officialFinal={version:1,standings:structuredClone(x.standings),championId:titleCandidate(x.standings,rows),finalParticipation:participation,resultIds:x.raceResults.map(r=>r.resultId),pendingEntitlementIds:x.raceResults.flatMap(r=>r.effects.map(e=>e.pendingEntitlementId).filter(Boolean)),settled:false};x.officialFinal.fingerprint=fingerprint(x.officialFinal);}
 else{const player=x.eligibility.find(e=>e.entrantId===x.playerId),defer=x.m6&&s.schema===8&&!(x.m6.casualties??[]).some(c=>c.player);if(!x.withdrawal&&!player.mayStart&&!defer)x.withdrawal={kind:'Forced',raceIndex:index+1,sourceResultId:resultId,reason:player.reason};x.raceIndex++;if(replaceEliminatedRivals(s,x,x.raceIndex,eligibility).length)x.standings=standings(x.entrants.map(e=>e.id),x.raceResults);x.phase=x.withdrawal?'AI_CONTINUATION':'INTERMISSION_READY';}
 return {instanceId:x.id,raceId:record.raceId,resultId,proofFingerprint:record.proofFingerprint,phase:x.phase,mappingVersion:CONDITION_MAPPING};
}
