import {clearedNativeResult} from '../../sim/foundation/checkpoint.js';
import {createNoStarterTransfer,createRecoveryTransfer} from './clearance-transfer.js';
import {storedChampionshipAnchor} from './anchor.js';
import {RaceSessionStore,withRaceSessionLock} from '../../persistence/race/session-store.js';import {SAVE_KEY} from '../../persistence/envelope.js';import {makeControllerCommand,activeChampionship} from './controller.js';import {createClearanceTransfer,createBirthTransfer} from './clearance-transfer.js';import {fingerprint} from '../cycles/contracts.js';
export class ChampionshipRunner {
 constructor(careerStore,storage){this.career=careerStore;this.storage=storage;}
 identity(){const s=this.career.state,x=activeChampionship(s);if(!x?.raceId)throw Error('Start a championship race explicitly first');return {profileId:s.profile.id,careerId:s.career.id,instanceId:x.id,raceId:x.raceId};}
 session(){return new RaceSessionStore(this.storage,{identity:this.identity(),getCareerAnchor:()=>storedChampionshipAnchor(this.storage,this.identity().raceId)});}
 // Caller holds both the career lock and this race lock; no two-store official
 // consequences are published. Race proof is durable first, then only a protected
 // pre-commit candidate is staged in CareerStore. D2 remains approval-blocked.
 ensure(){if(this.career.mode!=='automatic')throw Error('Durable automatic career storage required for championship racing; export manual checkpoint first');const x=activeChampionship(this.career.state);if(!['RACE_START_PENDING','RACE_ACTIVE'].includes(x.phase))throw Error(x.blockedReason??'No active race');const session=this.session(),raw=this.storage.getItem(session.key);if(raw===null){if(x.phase!=='RACE_START_PENDING')throw Error('RECOVERY_REQUIRED: established race data missing; no restart/reroll');session.create(x.raceSetup);}else session.open();if(x.phase==='RACE_START_PENDING'){const birth=createBirthTransfer(session,this.career.state),tx=makeControllerCommand(this.career.state,'championship.bindRace',{instanceId:x.id,reference:birth.reference},'e2-birth-'+fingerprint([x.id,x.raceId]).slice(0,40));this.career.transaction(tx,{birth});}return session;}
 advance(id,ticks=1){const session=this.ensure();if(session.record.authority.value.operational==='RESULT_COMMITTED')return session;session.apply({id,expectedRevision:session.inspect().revision,tick:session.state.tick,phase:'advance',ticks,commands:[]});return session;}
 sign(id,action,sign){if(activeChampionship(this.career.state).withdrawal)throw Error('Player withdrawn; rival Sign control is forbidden');const session=this.ensure();session.apply({id,expectedRevision:session.inspect().revision,tick:session.state.tick,phase:'paused',ticks:0,commands:[{action,...(sign===undefined?{}:{sign})}]});return session;}
 stage(id){if(this.career.state.championshipFoundation.version===3)return this.publish(id);const x=activeChampionship(this.career.state);if(x.pendingClearance)return {duplicate:true,blocked:true,reason:x.blockedReason};const session=this.ensure(),r=session.finalize('e2-result-'+fingerprint([x.id,x.raceId]).slice(0,40),session.inspect().revision);if(r.blocked)return r;const transfer=createClearanceTransfer(session,this.career.state),payload={instanceId:x.id,reference:transfer.reference,candidate:transfer.candidate,setupFingerprint:transfer.setupFingerprint},tx=makeControllerCommand(this.career.state,'championship.stageClearance',payload,id);const result=this.career.transaction(tx,{clearance:transfer});return {...result,blocked:true,reason:activeChampionship(this.career.state).blockedReason};}
 command(type,payload,id,options={}){return this.career.transaction(makeControllerCommand(this.career.state,type,payload,id),options);}
 publish(id){
  const x=activeChampionship(this.career.state),prior=x.raceResults.find(r=>r.raceId===x.raceId);
  if(prior)return {duplicate:true,result:structuredClone(prior),durable:true};
  if(this.career.mode!=='automatic')throw Error('Durable automatic career storage required for official publication');
  if(x.phase==='NO_STARTERS_PENDING'){const noStarters=createNoStarterTransfer(this.career.state);return this.command('championship.noStarters',{instanceId:x.id,proof:noStarters.proof,evidence:noStarters.evidence},id,{noStarters});}
  if(['RACE_CLEARANCE_BLOCKED','RECOVERY_REQUIRED'].includes(x.phase))return {blocked:true,reason:x.blockedReason};
  let session;
  try{session=this.ensure();clearedNativeResult(session.state);}catch(e){
   const recovery=createRecoveryTransfer(this.session(),this.career.state),same=x.recoveryLog.at(-1);if(same?.reason===recovery.reason&&fingerprint(same.reference)===fingerprint(recovery.reference))return {blocked:true,reason:recovery.reason};
   this.command('championship.blockRace',{instanceId:x.id,reason:recovery.reason,reference:recovery.reference},id,{recovery});return {blocked:true,reason:recovery.reason};
  }
  session.finalize('e2-result-'+fingerprint([x.id,x.raceId]).slice(0,40),session.inspect().revision);
  const clearance=createClearanceTransfer(session,this.career.state);return this.command('championship.publish',{instanceId:x.id,reference:clearance.reference,candidate:clearance.candidate,setupFingerprint:clearance.setupFingerprint},id,{clearance});
 }
 retry(id){const x=activeChampionship(this.career.state);if(!['RACE_CLEARANCE_BLOCKED','RECOVERY_REQUIRED'].includes(x.phase))throw Error('No blocked race');const recovery=createRecoveryTransfer(this.session(),this.career.state,{retry:true});return this.command('championship.retryRace',{instanceId:x.id,reference:recovery.reference},id,{recovery});}
 async exclusive(operation){const locks=globalThis.navigator?.locks;if(!locks?.request)throw Error('Coordinated automatic championship writes require Web Locks; no unsafe fallback');return locks.request(SAVE_KEY+'.writer',{mode:'exclusive'},()=>withRaceSessionLock(this.identity(),operation,{locks}));}
}
