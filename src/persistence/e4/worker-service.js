import {CareerStore} from '../career-store.js';
import {SAVE_KEY} from '../envelope.js';
import {RaceSessionStore} from '../race/session-store.js';
import {storedChampionshipAnchor} from '../../career/championships/anchor.js';
import {ChampionshipRunner} from '../../career/championships/orchestrator.js';
import {activeChampionship,makeControllerCommand} from '../../career/championships/controller.js';
import {wireHash,pack,unpack} from '../../sim/foundation/codec.js';
import {capture,digest} from '../../sim/race.js';
import {verifyReplay} from '../../replay/replay.js';
import {fingerprint} from '../../career/cycles/contracts.js';
import {mapCondition} from '../../career/championships/condition.js';
import {checkRecords} from './indexeddb.js';
// A private one-entry cache, bound to exact bytes AND generation. Nothing from
// persistent storage is trusted because a sender supplies a hash or cache token.
export function createWorkerService(){
 let cache=null,pending=null,serial=0;
 function load(snapshot){
  checkRecords(snapshot.records);if(!Number.isSafeInteger(snapshot.generation)||snapshot.generation<0)throw Error('Invalid generation');
  const key=JSON.stringify(snapshot);
  if(cache?.key===key)return {hit:true,...cache};
  const map=new Map(snapshot.records),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
  if(!map.has(SAVE_KEY))throw Error('No career authority');// CareerStore.open below performs the full untrusted envelope validation once.
  const career=new CareerStore(storage);career.open();if(career.mode!=='automatic'||!career.current)throw Error('Corrupt/untrusted career authority: '+career.problem);
  for(const x of Object.values(career.state.championshipFoundation?.instances??{})){
   for(const result of x.raceResults??[])if(result.kind==='NativeCleared'&&!map.has(result.reference.storageKey))throw Error('Missing retained official session authority');
   if(x.checkpointRef?.storageKey&&!map.has(x.checkpointRef.storageKey))throw Error('Missing active session authority');
  }
  // Validate each retained session against its own frozen career anchor. Current
  // active session uses the live race anchor; older session anchors remain
  // historical, with full native/codec/journal checks still enforced.
  for(const[k,text]of map){if(k===SAVE_KEY)continue;const r=JSON.parse(text),a=r.authority?.value;if(!a?.identity)throw Error('Missing session identity');
   const state=career.state,x=state.championshipFoundation.instances?.[a.identity.instanceId],archived=x?.raceResults.find(r=>r.raceId===a.identity.raceId);
   if(!x||a.identity.profileId!==state.profile.id||a.identity.careerId!==state.career.id||(!archived&&x.raceId!==a.identity.raceId))throw Error('Unrelated retained session authority');
   const session=new RaceSessionStore(storage,{identity:a.identity,getCareerAnchor:()=>archived?.anchor??storedChampionshipAnchor(storage,a.identity.raceId)});if(session.key!==k)throw Error('Session key/identity mismatch');session.open();if(archived&&archived.reference.authorityHash!==wireHash(session.record.authority))throw Error('Retained official authority mismatch');
  }
  cache={key,map,storage,career};return {hit:false,...cache};
 }
 return async function handle(message){
  const started=performance.now();if(message.version!==1)throw Error('Unsupported worker protocol');
  if(message.type==='probe'){const roundTrip=unpack(pack({positiveInfinity:Infinity,negativeInfinity:-Infinity}));return {version:1,worker:true,typedSentinels:roundTrip.positiveInfinity===Infinity&&roundTrip.negativeInfinity===-Infinity,durable:false};}
  if(message.type==='reset'){cache=null;pending=null;return {version:1,reset:true,durable:false};}
  if(message.type==='ack'){
   if(!pending||pending.token!==message.token)throw Error('Unknown candidate acknowledgement');
   // Durable commit is checked by the coordinator, never asserted by this worker.
   cache=pending.validated;pending=null;return {version:1,accepted:true,durable:false};
  }
  if(pending)throw Error('Candidate pending; commit or reset first');
  if(message.type==='condition')return {version:1,result:pack(mapCondition(unpack(message.input))),durable:false};
  const loaded=load(message.snapshot),{map,storage,career}=loaded;
  if(message.type==='validate')return {version:1,cacheHit:loaded.hit,durable:false,elapsedMs:performance.now()-started,revision:career.current.revision,maintenanceRevision:career.current.maintenanceRevision};
  if(message.type==='replay'){
   const checks=[];for(const[k,text]of map){if(k===SAVE_KEY)continue;const a=JSON.parse(text).authority.value;if(message.raceId&&a.identity.raceId!==message.raceId)continue;
    const x=career.state.championshipFoundation.instances[a.identity.instanceId],archived=x.raceResults.find(r=>r.raceId===a.identity.raceId);
    const session=new RaceSessionStore(storage,{identity:a.identity,getCareerAnchor:()=>archived?.anchor??storedChampionshipAnchor(storage,a.identity.raceId)});session.open();
    const record=capture(session.state),replayed=verifyReplay(record);if(replayed.checksum!==digest(session.state))throw Error('Replay mismatch');checks.push({raceId:a.identity.raceId,checksum:record.checksum});
   }return {version:1,checks,durable:false};
  }
  if(message.type!=='prepare')throw Error('Unknown worker operation');
  // Candidate mutations never survive failed storage publication. The source
  // cache is invalidated before the first mutation, even if domain validation fails.
  cache=null;const runner=new ChampionshipRunner(career,storage),op=message.operation;
  if(op==='start')career.transaction(makeControllerCommand(career.state,'championship.start',{instanceId:activeChampionship(career.state).id},message.id));
  else if(op==='birth')runner.ensure();
  else if(op==='advance')runner.advance(message.id,message.ticks);
  else if(op==='sign')runner.sign(message.id,message.action,message.sign);
  else if(op==='nativePrepare'){const x=activeChampionship(career.state);if(x.phase!=='NO_STARTERS_PENDING'&&!x.raceResults.some(r=>r.raceId===x.raceId)){const session=runner.ensure();session.finalize('e2-result-'+fingerprint([x.id,x.raceId]).slice(0,40),session.inspect().revision);}}
  else if(op==='official'){
   const x=activeChampionship(career.state);
   if(x.phase!=='NO_STARTERS_PENDING'&&!x.raceResults.some(r=>r.raceId===x.raceId)){
    const session=runner.session();session.open();if(session.record.authority.value.operational!=='RESULT_COMMITTED')throw Error('Durable native prepare required before official commit');
   }
   runner.publish(message.id);
  }else throw Error('Unsupported prepared operation');
  const records=[...map];checkRecords(records);pending={token:'candidate-'+(++serial),validated:{key:JSON.stringify({...message.snapshot,generation:message.snapshot.generation+1,records}),map,storage,career}};
  return {version:1,token:pending.token,records,durable:false,elapsedMs:performance.now()-started,phase:activeChampionship(career.state)?.phase,revision:career.current.revision};
 };
}
