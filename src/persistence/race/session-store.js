import {BUFFERED_SIGN_ACTION} from '../../ai/buffered-signs.js';
import {parseEnvelope,SAVE_KEY} from '../envelope.js';
import {createRace,step,issueSign} from '../../sim/race.js';
import {checkpointRace,restoreRace,validateIdentity,setupFingerprint,clearedNativeResult} from '../../sim/foundation/checkpoint.js';
import {pack,unpack,wireHash,sealWire,unsealWire,MAX_CHECKPOINT_BYTES} from '../../sim/foundation/codec.js';
import {validateState} from '../../career/state.js';
import {exact,id} from '../../career/legacy-state.js';
import {fingerprint} from '../../career/cycles/contracts.js';
export const raceStorageKey=identity=>'bnt.race.foundation.v1.'+wireHash(validateIdentity(identity));
export function careerAnchor(state){validateState(state);return {profileId:state.profile.id,careerId:state.career.id,revision:state.revision,maintenanceRevision:state.maintenanceRevision??0,fingerprint:fingerprint(state)};}
export function storedCareerAnchor(storage){const raw=storage.getItem(SAVE_KEY);if(raw===null)throw Error('RECOVERY_REQUIRED: no durable career anchor');return careerAnchor(parseEnvelope(raw).primary);}
const clone=x=>structuredClone(x);
const cloneState=s=>unpack(pack(s));
const stateHash=s=>wireHash(pack(s));
function execute(s,r,onStep=null){
  if(r.tick!==s.tick||!['Ready','Running'].includes(s.status))throw Error('RECOVERY_REQUIRED: input boundary mismatch');
  if(r.phase==='paused'){
    if(r.ticks!==0||r.commands.length!==1)throw Error('Invalid paused input');const c=r.commands[0];
    exact(c,['action',...(Object.hasOwn(c,'sign')?['sign']:[])]);
    if(!['queue','cancel','lower',BUFFERED_SIGN_ACTION,...([2,3].includes(s.entrants.find(r=>r.id===s.playerId)?.progressionContext?.version)?['ability']:[])].includes(c.action))throw Error('Invalid paused sign');issueSign(s,c.action,c.sign);
  }else{
    if(r.phase!=='advance'||!Number.isInteger(r.ticks)||r.ticks<1||r.ticks>10000)throw Error('Invalid advance request');
    for(let i=0;i<r.ticks&&['Ready','Running'].includes(s.status);i++){step(s,i===0?r.commands:[]);onStep?.(s);}
  }
  if(s.status==='Error')throw Error('RECOVERY_REQUIRED: simulator rejected input');return s;
}
function request(r){
  exact(r,['id','expectedRevision','tick','phase','ticks','commands'],'race input');id(r.id);
  if(!Number.isSafeInteger(r.expectedRevision)||r.expectedRevision<0||!Number.isSafeInteger(r.tick)||r.tick<0||!Array.isArray(r.commands))throw Error('Invalid input order');
  return r;
}
/** Single atomic storage value owns checkpoint generations, journal, head and proof aggregate.
 * It never writes CareerStore or Gold. Every read/write verifies the live career anchor.
 * Manual acknowledgements are explicitly NOT durable input acknowledgements.
 */
export class RaceSessionStore {
  constructor(storage,{identity,getCareerAnchor,interval=100,fallback='previous'}={}){
    validateIdentity(identity);if(typeof getCareerAnchor!=='function'||!Number.isInteger(interval)||interval<1||interval>10000)throw Error('Career authority/interval required');
    this.storage=storage;this.identity=clone(identity);this.getCareerAnchor=getCareerAnchor;if(!['previous','birth'].includes(fallback))throw Error('Invalid fallback policy');this.fallback=fallback;this.interval=interval;this.key=raceStorageKey(identity);this.raw=null;this.record=null;this.state=null;this.mode='automatic';this.requiresCheckpoint=false;this.problem=null;this.exportToken=null;
  }
  anchor(){const a=this.getCareerAnchor();exact(a,['profileId','careerId','revision','maintenanceRevision','fingerprint']);if(a.profileId!==this.identity.profileId||a.careerId!==this.identity.careerId||!Number.isSafeInteger(a.revision)||a.revision<0||!Number.isSafeInteger(a.maintenanceRevision)||a.maintenanceRevision<0||!/^[a-f0-9]{64}$/.test(a.fingerprint))throw Error('RECOVERY_REQUIRED: invalid career anchor');return a;}
  assertAnchor(a){if(wireHash(a)!==wireHash(this.anchor()))throw Error('RECOVERY_REQUIRED: career changed; race cannot rewind financial state');}
  create(setup,{manual=false,pendingEntitlementIds=[]}={}){
    if(!Array.isArray(pendingEntitlementIds)||pendingEntitlementIds.length>100||new Set(pendingEntitlementIds).size!==pendingEntitlementIds.length)throw Error('Invalid pending entitlement identities');pendingEntitlementIds.forEach(id);
    let old;try{old=this.storage.getItem(this.key);}catch(e){this.mode='manual';this.problem='Storage unavailable; manual export only';if(!manual)throw Error(this.problem);old=null;}
    if(old!==null||this.record)throw Error('Race identity already exists; load instead of restart');
    const s=createRace(setup),a=this.anchor(),cp=checkpointRace(s,this.identity,0);
    const r={kind:'BNT-race-session',version:1,authority:null,journal:sealWire([]),checkpoint:cp,previous:null,publication:sealWire(null)};
    this.raw=old;this.publish(r,s,{revision:0,anchor:a,watermark:0,operational:'ACTIVE',reason:null,proofEntitlementIds:pendingEntitlementIds});return this.inspect();
  }
  inspect(){return {mode:this.mode,requiresCheckpoint:this.requiresCheckpoint,problem:this.problem,revision:this.record?unsealWire(this.record.authority).revision:null,state:this.state?clone(this.state):null};}
  decode(text){
    if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_CHECKPOINT_BYTES)throw Error('RECOVERY_REQUIRED: oversized race session');
    const r=JSON.parse(text);exact(r,['kind','version','authority','journal','checkpoint','previous','publication',...(r.version===2?['boundary']:[])]);
    if(r.kind!=='BNT-race-session'||![1,2].includes(r.version))throw Error('RECOVERY_REQUIRED: incompatible race session');
    const a=unsealWire(r.authority);exact(a,['version','identity','anchor','revision','watermark','headHash','setupHash','journalHash','checkpointHash','previousHash','publicationHash','operational','reason','proofEntitlementIds',...(r.version===2?['boundaryHash']:[])]);
    if(a.version!==r.version||wireHash(a.identity)!==wireHash(this.identity)||!Number.isSafeInteger(a.revision)||a.revision<0||!['ACTIVE','RACE_CLEARANCE_BLOCKED','RESULT_COMMITTED'].includes(a.operational))throw Error('RECOVERY_REQUIRED: invalid session authority');this.assertAnchor(a.anchor);
    if(r.version===2){const b=unsealWire(r.boundary);exact(b,['kind','version','policy','attemptId','sourceAuthorityHash','sourceRevision']);id(b.attemptId);if(b.kind!=='BNT-boundary-attempt'||b.version!==1||b.policy!=='restart-seeded-v1'||!/^[a-f0-9]{64}$/.test(b.sourceAuthorityHash)||!Number.isSafeInteger(b.sourceRevision)||b.sourceRevision<0||a.boundaryHash!==wireHash(r.boundary)||a.operational!=='RESULT_COMMITTED')throw Error('RECOVERY_REQUIRED: invalid boundary attempt');}
    if(!Array.isArray(a.proofEntitlementIds)||a.proofEntitlementIds.length>100||new Set(a.proofEntitlementIds).size!==a.proofEntitlementIds.length)throw Error('Invalid proof entitlement identities');a.proofEntitlementIds.forEach(id);
    const journal=unsealWire(r.journal);if(!Array.isArray(journal)||journal.length>1000||journal.length!==a.watermark||wireHash(journal)!==a.journalHash)throw Error('RECOVERY_REQUIRED: missing journal');
    const ids=new Set();for(let i=0;i<journal.length;i++){const j=journal[i];exact(j,['sequence','request','requestHash','before','after']);request(j.request);if(j.sequence!==i+1||j.request.expectedRevision!==i||ids.has(j.request.id)||j.requestHash!==wireHash(j.request)||i&&j.before!==journal[i-1].after)throw Error('RECOVERY_REQUIRED: incomplete/reordered journal');ids.add(j.request.id);}
    if(wireHash(r.publication)!==a.publicationHash)throw Error('RECOVERY_REQUIRED: result registry integrity');
    const published=unsealWire(r.publication);if(published!==null){const p=unpack(published);if(a.operational!=='RESULT_COMMITTED'||p.stateFingerprint!==a.headHash||wireHash(p.identity)!==wireHash(this.identity))throw Error('RECOVERY_REQUIRED: result registry mismatch');}
    else if(a.operational==='RESULT_COMMITTED')throw Error('RECOVERY_REQUIRED: missing committed result');
    let s,recovered=false;
    for(const [cp,h] of [[r.checkpoint,a.checkpointHash],[r.previous,a.previousHash]]){
      try{
        if(!cp||wireHash(cp)!==h)throw Error('Invalid checkpoint generation');const m=unsealWire(cp);
        s=restoreRace(cp,{identity:this.identity,setupHash:a.setupHash});
        if(m.watermark>journal.length)throw Error('Checkpoint watermark mismatch');
        // This restored state is local and changes only through execute below.
        // Carry its exact hash across unchanged boundaries; all comparisons and
        // full hash recomputation after every accepted input remain required.
        let currentHash=stateHash(s);
        if(m.watermark>0&&journal[m.watermark-1].after!==currentHash)throw Error('Checkpoint watermark mismatch');
        for(const j of journal.slice(m.watermark)){if(j.before!==currentHash)throw Error('Journal before-state mismatch');execute(s,j.request);currentHash=stateHash(s);if(j.after!==currentHash)throw Error('Journal replay mismatch');}
        if(currentHash!==a.headHash)throw Error('Authoritative head mismatch');
        if(published!==null){
          const p=unpack(published);exact(p,['kind','version','resultId','identity','setupFingerprint','stateFingerprint','tick','watermark','sourceRevision','classification','conditions','standingsEffects','pendingEntitlementIds',...(Object.hasOwn(p,'championshipEvidence')?['championshipEvidence']:[])]);id(p.resultId);
          const native=clearedNativeResult(s);
          if(wireHash(p.championshipEvidence??null)!==wireHash(native.championshipEvidence??null)||p.kind!=='BNT-cleared-race-proof'||p.version!==1||p.setupFingerprint!==a.setupHash||p.tick!==s.tick||p.watermark!==a.watermark||p.sourceRevision!==a.revision-1||wireHash(pack(native.classification))!==wireHash(pack(p.classification))||wireHash(pack(native.conditions))!==wireHash(pack(p.conditions))||wireHash(p.standingsEffects)!==wireHash(native.classification.map(x=>({entrantId:x.id,classified:true})))||wireHash(p.pendingEntitlementIds)!==wireHash(a.proofEntitlementIds))throw Error('Invalid authoritative result/condition proof');
        }
        break;
      }catch(e){s=null;recovered=true;}
    }
    if(!s)throw Error('RECOVERY_REQUIRED: no valid checkpoint with complete committed journal');
    return {r,a,s,recovered};
  }
  open(){
    try{const raw=this.storage.getItem(this.key);if(raw===null)throw Error('RECOVERY_REQUIRED: no saved race; no automatic restart');const d=this.decode(raw);this.record=d.r;this.state=d.s;this.raw=raw;this.mode='automatic';this.problem=d.recovered?'Recovered previous generation plus complete committed journal':null;return this.inspect();}
    catch(e){this.mode='recovery-required';this.problem=e.message;throw e;}
  }
  publish(r,s,{revision,anchor,watermark,operational,reason,proofEntitlementIds}){
    this.assertAnchor(anchor);
    const a={version:r.version,...(r.version===2?{boundaryHash:wireHash(r.boundary)}:{}),identity:this.identity,anchor,revision,watermark,headHash:stateHash(s),setupHash:setupFingerprint(s),journalHash:wireHash(unsealWire(r.journal)),checkpointHash:wireHash(r.checkpoint),previousHash:r.previous?wireHash(r.previous):null,publicationHash:wireHash(r.publication),operational,reason,proofEntitlementIds};
    r.authority=sealWire(a);const text=JSON.stringify(r);this.decode(text); // complete validation before publication
    if(new TextEncoder().encode(text).length>MAX_CHECKPOINT_BYTES)throw Error('Race session exceeds 8 MiB; not committed');
    if(this.mode!=='manual'){
      try{if(this.storage.getItem(this.key)!==this.raw)throw Error('Race save changed in another window');this.assertAnchor(anchor);this.storage.setItem(this.key,text);}
      catch(e){if(e.message.includes('another window')||e.message.includes('career changed'))throw e;this.mode='manual';this.requiresCheckpoint=!!this.record;this.problem='Storage failure: operation rolled back; no durable acknowledgement';throw Error(this.problem+': '+e.message);}
      this.raw=text;
    }
    this.record=r;this.state=s;this.requiresCheckpoint=this.mode==='manual';this.exportToken=null;
  }
  apply(input,{onStep=null}={}){
    request(input);if(!this.record||this.mode==='recovery-required')throw Error('RECOVERY_REQUIRED: load a valid race');
    const a=unsealWire(this.record.authority);this.assertAnchor(a.anchor);const journal=unsealWire(this.record.journal),old=journal.find(j=>j.request.id===input.id);
    if(old){if(old.requestHash!==wireHash(input))throw Error('Conflicting input identity');return {duplicate:true,durable:this.mode==='automatic',revision:a.revision};}
    if(a.operational!=='ACTIVE'||input.expectedRevision!==a.revision||input.tick!==this.state.tick)throw Error('Race is blocked/committed or revision is stale');
    if(this.mode==='manual'&&this.requiresCheckpoint)throw Error('Export and confirm the current manual checkpoint before changing state');
    if(journal.length>=1000)throw Error('Journal limit reached; no inputs discarded');
    const s=cloneState(this.state),before=stateHash(s);execute(s,input,onStep);const next=[...journal,{sequence:journal.length+1,request:clone(input),requestHash:wireHash(input),before,after:stateHash(s)}],r=clone(this.record);
    r.journal=sealWire(next);
    if(this.fallback==='birth'||s.tick-this.record.checkpoint.value.tick>=this.interval||!['Ready','Running'].includes(s.status)){
      try{restoreRace(r.checkpoint);}catch{r.checkpoint=r.previous;}
      if(this.fallback==='birth'){
        // Retain a small verified birth image plus the COMPLETE journal. The
        // IndexedDB coordinator separately retains the immediately prior head.
        // This avoids two near-terminal full images overflowing one 8 MiB
        // logical session; no journal or authoritative consequence is removed.
        let base=r.previous?.value?.watermark===0?r.previous:r.checkpoint?.value?.watermark===0?r.checkpoint:null;
        if(!base){const initial=createRace(s.setup);if(next[0].before!==stateHash(initial))throw Error('Cannot establish birth checkpoint identity');base=checkpointRace(initial,this.identity,0);const replay=cloneState(initial);for(const j of next){if(j.before!==stateHash(replay))throw Error('Birth rebase journal mismatch');execute(replay,j.request);if(j.after!==stateHash(replay))throw Error('Birth rebase outcome mismatch');}if(stateHash(replay)!==stateHash(s))throw Error('Birth rebase head mismatch');}
        r.previous=base;
      }else r.previous=r.checkpoint;
      r.checkpoint=checkpointRace(s,this.identity,next.length);
    }
    this.publish(r,s,{...a,revision:a.revision+1,watermark:next.length,operational:'ACTIVE',reason:null});return {duplicate:false,durable:this.mode==='automatic',revision:a.revision+1};
  }
  finalize(resultId,expectedRevision){
    id(resultId);if(!this.record)throw Error('No race');const a=unsealWire(this.record.authority);this.assertAnchor(a.anchor);
    const existing=unsealWire(this.record.publication);
    if(existing){const p=unpack(existing);if(p.resultId!==resultId||p.stateFingerprint!==stateHash(this.state))throw Error('Conflicting finalization');return {duplicate:true,result:clone(p),durable:this.mode==='automatic'};}
    if(expectedRevision!==a.revision)throw Error('Stale result revision');if(this.mode==='manual'&&this.requiresCheckpoint)throw Error('Manual checkpoint required');
    let native;try{native=clearedNativeResult(this.state);}catch(e){
      const r=clone(this.record);this.publish(r,this.state,{...a,revision:a.revision+1,operational:'RACE_CLEARANCE_BLOCKED',reason:e.message});return {blocked:true,reason:e.message,durable:this.mode==='automatic'};
    }
    const result={kind:'BNT-cleared-race-proof',version:1,resultId,identity:this.identity,setupFingerprint:a.setupHash,stateFingerprint:a.headHash,tick:this.state.tick,watermark:a.watermark,sourceRevision:a.revision,...native,standingsEffects:native.classification.map(x=>({entrantId:x.id,classified:true})),pendingEntitlementIds:clone(a.proofEntitlementIds)};
    const r=clone(this.record);r.publication=sealWire(pack(result));
    this.publish(r,this.state,{...a,revision:a.revision+1,operational:'RESULT_COMMITTED',reason:null});return {duplicate:false,result:clone(result),durable:this.mode==='automatic'};
  }
  export(){if(!this.record)throw Error('No valid race to export');this.assertAnchor(unsealWire(this.record.authority).anchor);const text=JSON.stringify(this.record);this.exportToken=wireHash(text);return {text,token:this.exportToken,warning:'A download is not verified durable storage. Manual acknowledgements are not durable input commits.'};}
  acknowledgeExport(token){if(token!==this.exportToken||!token)throw Error('Export current manual checkpoint first');this.requiresCheckpoint=false;}
  importManual(text,{confirmed=false}={}){
    if(!confirmed)throw Error('Confirm race checkpoint replacement');const d=this.decode(text);
    if(this.record){const current=unsealWire(this.record.authority);if(d.a.revision<current.revision||unsealWire(this.record.publication)!==null&&wireHash(this.record.publication)!==wireHash(d.r.publication))throw Error('Cannot rewind committed race authority');}
    this.mode='manual';this.record=d.r;this.state=d.s;this.requiresCheckpoint=true;this.exportToken=null;return this.inspect();
  }
}
// Synchronous store methods require one serialized writer, as CareerStore does.
// Browser integration must hold this exclusive lock around open + operation.
// Refuse an uncoordinated automatic fallback if Web Locks are unavailable.
export async function withRaceSessionLock(identity,operation,{locks=globalThis.navigator?.locks}={}){
  validateIdentity(identity);if(typeof operation!=='function'||typeof locks?.request!=='function')throw Error('Automatic race coordination unavailable; use explicit manual/single-writer tooling');
  return locks.request(raceStorageKey(identity),{mode:'exclusive'},operation);
}
