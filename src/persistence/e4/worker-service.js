import {DenAttempt} from '../../career/m6/den-runtime.js';
import {prepareQuote} from '../../career/m6/bookmaker.js';
import {prepareM6Recovery} from '../m6/recovery.js';
import {preparePreviousRecovery} from '../../career/m5/recovery.js';
import {prepareCreation} from '../../management/creation/model.js';
import {requireCurrentM4} from '../m4-policy.js';
import {MemoryAttempt} from '../race/memory-attempt.js';
import {assertPresentationRestore} from '../career-presentation.js';
import {validateRuntime,defaultRuntime} from './runtime.js';
import {validatePresentationOwner,preservePresentation} from './presentation.js';
import {ChampionshipViewer} from '../../career/championships/viewer.js';
import {makeE5Command} from '../../career/championships/e5/contracts.js';
import {createSettlementCapability} from '../../career/championships/e5/capabilities.js';
import {CareerStore} from '../career-store.js';
import {SAVE_KEY} from '../envelope.js';
import {RaceSessionStore} from '../race/session-store.js';
import {checkpointRace,restoreRace} from '../../sim/foundation/checkpoint.js';
import {createRace} from '../../sim/race.js';
import {unsealWire} from '../../sim/foundation/codec.js';
import {financialAnchorValue} from '../../career/championships/anchor.js';
import {ChampionshipRunner} from '../../career/championships/orchestrator.js';
import {activeChampionship,makeControllerCommand} from '../../career/championships/controller.js';
import {wireHash,pack,unpack} from '../../sim/foundation/codec.js';
import {capture,digest} from '../../sim/race.js';
import {verifyReplay} from '../../replay/replay.js';
import {fingerprint} from '../../career/cycles/contracts.js';
import {mapCondition} from '../../career/championships/condition.js';
import {encodeBackup,decodeBackup,digestText,mergeRestoreReceipts} from './backup.js';
import {developmentOffer,createCatalogBoundary} from '../../career/championships/offers.js';
import {checkRecords,sameRecords} from './indexeddb.js';
// A private one-entry cache, bound to exact bytes AND generation. Nothing from
// persistent storage is trusted because a sender supplies a hash or cache token.
// CareerStore.open/publish already fully validates the exact raw envelope.
// This private worker adapter can reuse that result only while raw bytes match.
// Untrusted cold loads still execute CareerStore.open and every native decoder.
function validatedAnchor(career,storage,raceId){
 if(career.mode!=='automatic'||!career.current||storage.getItem(SAVE_KEY)!==career.raw)throw Error('RECOVERY_REQUIRED: validated career authority changed');
 const s=career.current,x=s.championshipFoundation.instances?.[s.championshipFoundation.activeId];if(!x)throw Error('No active championship financial authority');
 return x.raceResults.find(r=>r.raceId===raceId)?.anchor??x.raceAnchor??financialAnchorValue(s,x);
}
function snapshotKey(snapshot){return {meta:JSON.stringify({...snapshot,records:undefined}),records:snapshot.records.map(([k,v])=>[k,v])};}
const sameSnapshot=(a,b)=>a?.meta===b.meta&&sameRecords(a.records,b.records);
class CachedSession extends RaceSessionStore {
 open(){if(this.state&&this.raw!==null&&this.storage.getItem(this.key)===this.raw){this.assertAnchor(this.record.authority.value.anchor);return this.inspect();}return super.open();}
 decode(text){if(text===this.decodedText&&this.storage.getItem(this.key)===this.raw){this.assertAnchor(this.decoded.a.anchor);return this.decoded;}const d=super.decode(text);this.decodedText=text;this.decoded=d;return d;}
}
class DurableRunner extends ChampionshipRunner {
 session(){const identity=this.identity();if(this.cached?.identity.raceId===identity.raceId&&this.cached.mode==='automatic')return this.cached;let raw=null,anchor;
  this.cached=new CachedSession(this.storage,{identity,interval:1,fallback:'birth',getCareerAnchor:()=>{const next=this.storage.getItem(SAVE_KEY);if(next!==raw){anchor=validatedAnchor(this.career,this.storage,identity.raceId);raw=next;}return anchor;}});return this.cached;
 }
}
function view(career,runner){const s=career.state,x=activeChampionship(s);let frame=null,reason=null,operational=null,watermark=null,sessionRevision=null,warning=null;try{if(x?.raceId&&x.phase!=='NO_STARTERS_PENDING'&&!x.raceResults.some(r=>r.raceId===x.raceId&&r.kind==='NoStarters')){const session=runner.session();session.open();const n=session.state;operational=session.record.authority.value.operational;watermark=session.record.authority.value.watermark;sessionRevision=session.record.authority.value.revision;warning=session.problem;frame={tick:n.tick,time:n.time,status:n.status,config:n.config,track:n.track,playerId:n.playerId,entrants:n.entrants.map(r=>({id:r.id,q:r.q,lane:r.lane,status:r.status,physical:r.physical,speed:r.speed,signs:r.signs,ru:r.ru}))};}}catch(e){reason=e.message;}return {state:s,presentation:structuredClone(career.presentation),frame,operational,watermark,sessionRevision,warning,reason};}
// Retained race sessions already fully verified in this worker, keyed by exact
// record text. Bounded so long careers cannot grow memory without limit.
const VERIFIED=new Map(),VERIFIED_LIMIT=24;
function remember(text,proof){let set=VERIFIED.get(text);if(set)VERIFIED.delete(text);else set=new Set();set.add(proof);VERIFIED.set(text,set);while(VERIFIED.size>VERIFIED_LIMIT)VERIFIED.delete(VERIFIED.keys().next().value);}
export function createWorkerService(){
 let cache=null,pending=null,serial=0,attempt=null,denAttempt=null;
 function load(snapshot,tolerant=false){
  checkRecords(snapshot.records);if(!Number.isSafeInteger(snapshot.generation)||snapshot.generation<0)throw Error('Invalid generation');
  validateRuntime(snapshot.runtime??defaultRuntime());
  const key=snapshotKey(snapshot);
  if(cache&&sameSnapshot(cache.key,key))return {hit:true,...cache};
  const map=new Map(snapshot.records),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
  if(!map.has(SAVE_KEY))throw Error('No career authority');if(typeof BNT_M5_BUILD!=='undefined'&&BNT_M5_BUILD){let kind;try{kind=JSON.parse(map.get(SAVE_KEY)).kind;}catch{}if(kind!=='BNT-M5-current-save')throw Error('Incompatible or corrupt M5 save. Older development saves must be opened with their original HTML; none was migrated or replaced.');}// CareerStore.open below performs the full untrusted envelope validation once.
  const career=new CareerStore(storage);career.open();if(career.mode!=='automatic'||!career.current)throw Error('Corrupt/untrusted career authority: '+career.problem);
  if(typeof BNT_M4_BUILD!=='undefined'&&BNT_M4_BUILD)requireCurrentM4(career.current);validatePresentationOwner(snapshot.runtime,career);
  if(career.current.schema===7)for(const key of map.keys())if(key.startsWith('bnt.m5.history.')&&!career.current.m5.historyPages.includes(key))throw Error('Unreferenced/foreign M5 history page');
  let problem=null;try{
  for(const x of Object.values(career.state.championshipFoundation?.instances??{})){
   for(const result of x.raceResults??[])if(result.kind==='NativeCleared'&&!map.has(result.reference.storageKey))throw Error('Missing retained official session authority');
   if(x.checkpointRef?.storageKey&&!map.has(x.checkpointRef.storageKey))throw Error('Missing active session authority');
  }
  // Validate each retained session against its own frozen career anchor. Current
  // active session uses the live race anchor; older session anchors remain
  // historical, with full native/codec/journal checks still enforced.
  for(const[k,text]of map){if(k===SAVE_KEY||career.current.schema===7&&k.startsWith('bnt.m5.history.'))continue;const r=JSON.parse(text),a=r.authority?.value;if(!a?.identity)throw Error('Missing session identity');
   const state=career.state,x=state.championshipFoundation.instances?.[a.identity.instanceId],archived=x?.raceResults.find(r=>r.raceId===a.identity.raceId);
   if(!x||a.identity.profileId!==state.profile.id||a.identity.careerId!==state.career.id||(!archived&&x.raceId!==a.identity.raceId))throw Error('Unrelated retained session authority');
   const anchor=archived?.anchor??validatedAnchor(career,storage,a.identity.raceId),session=new RaceSessionStore(storage,{identity:a.identity,getCareerAnchor:()=>anchor});if(session.key!==k)throw Error('Session key/identity mismatch');
   // Full decode replays and re-hashes the whole race (about a second per race).
   // The outcome depends only on the record text, identity and anchor, so a
   // record already proven under the same inputs is not proven again.
   const proof=k+'\u0000'+wireHash(anchor),decoded=VERIFIED.get(text)?.has(proof)?{r}:session.decode(text);remember(text,proof);if(archived&&career.current.schema===7&&fingerprint(unpack(unsealWire(decoded.r.publication)))!==fingerprint(archived.proof))throw Error('Official proof differs from durable native publication');if(archived&&archived.reference.authorityHash!==wireHash(decoded.r.authority))throw Error('Retained official authority mismatch');
  }
  }catch(e){if(!tolerant)throw e;problem=e.message;}
  const loaded={key,map,storage,career,runner:new DurableRunner(career,storage),problem};cache=problem?null:loaded;return {hit:false,...loaded};
 }
 return async function handle(message){
  const started=performance.now();if(message.version!==1)throw Error('Unsupported worker protocol');
  if(message.type==='previousCandidate'){const loaded=load(message.previous);if(loaded.career.current.schema===8)return prepareM6Recovery(message.previous,message.token);if(loaded.career.current.schema!==7)throw Error('M5 recovery only');return preparePreviousRecovery(message.previous,message.token);}
  if(message.type==='creationCandidate'){if(!(typeof BNT_M5_BUILD!=='undefined'&&BNT_M5_BUILD)&&!(typeof BNT_M6_BUILD!=='undefined'&&BNT_M6_BUILD))throw Error('Current creation producer unavailable');return {...prepareCreation(message.request),durable:false};}
  if(message.type==='probe'){const roundTrip=unpack(pack({positiveInfinity:Infinity,negativeInfinity:-Infinity}));return {version:1,worker:true,typedSentinels:roundTrip.positiveInfinity===Infinity&&roundTrip.negativeInfinity===-Infinity,durable:false};}
  if(message.type==='reset'){cache=null;pending=null;if(message.discardAttempt===true)attempt=null;return {version:1,reset:true,durable:false};}
  if(message.type==='ack'){
   if(!pending||pending.token!==message.token)throw Error('Unknown candidate acknowledgement');
   // Durable commit is checked by the coordinator, never asserted by this worker.
   cache=pending.validated;if(attempt){if(pending.operation==='memoryPrepare')attempt.prepared=true;else if(['metadata','presentation'].includes(pending.operation))attempt.rebase({...cache.key,generation:pending.generation,records:pending.records},cache.career);else if(pending.operation==='official')attempt=null;}pending=null;return {version:1,accepted:true,durable:false};
  }
  if(pending)throw Error('Candidate pending; commit or reset first');
  if(message.type==='condition')return {version:1,result:pack(mapCondition(unpack(message.input))),durable:false};
  if(message.type==='attemptInfo')return {available:!!attempt&&attempt.identity.raceId===message.raceId,durable:false};
  if(message.type==='attemptExecute'){if(!attempt)throw Error('Unsaved attempt unavailable; restart from the saved starting state');return attempt.execute(message);}
  if(['m6DenRead','m6DenAdvance'].includes(message.type)){const loaded=load(message.snapshot);if(!denAttempt||denAttempt.eventId!==loaded.career.current.m6.gambling.den.active?.eventId)denAttempt=new DenAttempt(loaded.career);return message.type==='m6DenRead'?denAttempt.read(loaded.career,message.channel):denAttempt.advance(loaded.career,message);}
  if(message.type==='attemptRead'){if(message.snapshot.recordsHash&&message.snapshot.recordsHash!==await digestText(JSON.stringify(message.snapshot.records)))throw Error('RECOVERY_REQUIRED: durable record manifest mismatch');const loaded=load(message.snapshot),x=activeChampionship(loaded.career.current);if(!attempt||attempt.identity.raceId!==x?.raceId)attempt=new MemoryAttempt(loaded,message.snapshot,message.channel);else if(attempt.generation!==message.snapshot.generation)throw Error('STALE_WRITER: race changed; reload before restarting');return attempt.read(message.channel);}
  if(message.type==='prepareRestore'){
   const b=await decodeBackup(message.text),source=load({generation:b.payload.sourceGeneration,records:b.payload.records,runtime:b.payload.runtime});
   if(source.career.current.profile.id!==b.payload.profileId||source.career.current.career.id!==b.payload.careerId)throw Error('Backup career ownership mismatch');
   if(b.payload.previous){const prior=load(b.payload.previous);if(prior.career.current.profile.id!==b.payload.profileId||prior.career.current.career.id!==b.payload.careerId)throw Error('Foreign previous career in backup');}
   const target=new Map(b.payload.records),matched=message.snapshot.recordsHash&&message.snapshot.recordsHash===b.payload.sourceRecordsHash&&message.snapshot.generation===b.payload.sourceGeneration&&message.snapshot.migration?.digest===b.payload.rootDigest;if(message.snapshot.recoveryOnly&&(!matched||message.snapshot.profileId!==b.payload.profileId||message.snapshot.careerId!==b.payload.careerId))throw Error('Corrupt M5 authority requires its exact matching complete backup');let old=null;try{old=message.snapshot.records.length?load(message.snapshot,true):message.baseline?.length?load({generation:0,records:message.baseline}):null;}catch(e){if(!matched)throw e;}if(old?.problem&&!matched)throw Error('Corrupt authority requires an exact generation/record-manifest backup');
   if(old){assertPresentationRestore(old.career.presentation,source.career.presentation,{existing:true});preservePresentation(message.snapshot.runtime,b.payload.runtime);if(old.career.current.profile.id!==b.payload.profileId||old.career.current.career.id!==b.payload.careerId)throw Error('Unrelated career would be overwritten; use an empty destination');
    for(const[k,v]of old.map){if(k===SAVE_KEY||matched&&old.problem)continue;if(old.career.current.schema===7&&k.startsWith('bnt.m5.history.')){if(target.get(k)!==v)throw Error('Restore would discard protected M5 history');continue;}const next=target.get(k);if(!next)throw Error('Restore would discard retained session authority');const a=JSON.parse(v),n=JSON.parse(next),av=a.authority.value,nv=n.authority.value;
     const forward=n.version===2&&av.operational==='ACTIVE'&&nv.operational==='RESULT_COMMITTED'&&n.boundary?.value?.sourceAuthorityHash===wireHash(a.authority);if(nv.setupHash!==av.setupHash||(!forward&&(nv.revision<av.revision||JSON.stringify(n.journal.value.slice(0,a.journal.value.length))!==JSON.stringify(a.journal.value))))throw Error('Restore would rewind/conflict with acknowledged inputs');
     if(av.operational==='RESULT_COMMITTED'&&JSON.stringify(a)!==JSON.stringify(n))throw Error('Restore conflicts with immutable official result');
    }
    cache=null;if(target.get(SAVE_KEY)!==old.map.get(SAVE_KEY)){old.career.importSave(target.get(SAVE_KEY),{confirmed:true,completeM5:old.career.current.schema===7,completeM6:old.career.current.schema===8});target.set(SAVE_KEY,old.map.get(SAVE_KEY));}
   }
   const records=[...target].sort(([a],[b])=>a<b?-1:a>b?1:0);load({...message.snapshot,records,runtime:b.payload.runtime});cache=null;
   const receipts=mergeRestoreReceipts(message.snapshot.restoreReceipts??[],b.payload.restoreReceipts),prior=receipts.find(r=>r.digest===b.digest);
   if(prior){const currentHash=await digestText(JSON.stringify(message.snapshot.records));if(prior.resultHash!==currentHash)throw Error('Restore already consumed and authority advanced; no rollback');return {duplicate:true,durable:false};}
   const resultHash=await digestText(JSON.stringify(records));return {durable:false,records,runtime:b.payload.runtime,receipt:{digest:b.digest,resultHash},receipts:mergeRestoreReceipts(receipts,[{digest:b.digest,resultHash}]),digest:b.digest,previous:b.payload.previous,sourceGeneration:b.payload.sourceGeneration,sourceRecordsHash:b.payload.sourceRecordsHash,rootDigest:message.snapshot.migration?.digest??b.payload.rootDigest,profileId:b.payload.profileId,careerId:b.payload.careerId};
  }
  const altered=message.snapshot.recordsHash&&message.snapshot.recordsHash!==await digestText(JSON.stringify(message.snapshot.records));if(altered&&!['inspect','legacyExport'].includes(message.type)&&message.operation!=='repair')throw Error('RECOVERY_REQUIRED: durable record manifest mismatch');
  let loaded;try{loaded=load(message.snapshot,['inspect','legacyExport'].includes(message.type)||message.operation==='repair');}catch(e){if(message.type==='inspect')return {version:1,state:null,frame:null,reason:e.message,durable:false};throw e;}
  const {map,storage,career}=loaded;
  loaded.runner.viewer??=new ChampionshipViewer(loaded.runner,career);
  if(message.type==='viewerRead')return {version:1,durable:false,packet:loaded.runner.viewer.init(message.channel)};
  if(message.type==='backup'){if(message.previous)load(message.previous);const {hit,...verified}=loaded;cache=verified;return {durable:false,text:await encodeBackup(message.snapshot,career.current,message.previous??null)};}
  if(message.type==='careerPreview'){if(!['previewEconomy','previewCycles'].includes(message.method))throw Error('Unsupported career preview');return career[message.method]();}
  if(message.type==='legacyExport')return {durable:false,envelope:career.export()};

  if(message.type==='inspect'){const observed=view(career,loaded.runner);return {version:1,...observed,reason:loaded.problem??(altered?'Durable record manifest mismatch; repair or matching complete backup required':observed.reason),durable:false};}
  if(message.type==='validate')return {version:1,cacheHit:loaded.hit,durable:false,elapsedMs:performance.now()-started,revision:career.current.revision,maintenanceRevision:career.current.maintenanceRevision};
  if(message.type==='replay'){
   const checks=[];for(const[k,text]of map){if(k===SAVE_KEY||career.current.schema===7&&k.startsWith('bnt.m5.history.'))continue;const a=JSON.parse(text).authority.value;if(message.raceId&&a.identity.raceId!==message.raceId)continue;
    const x=career.state.championshipFoundation.instances[a.identity.instanceId],archived=x.raceResults.find(r=>r.raceId===a.identity.raceId);
    const session=new RaceSessionStore(storage,{identity:a.identity,getCareerAnchor:()=>archived?.anchor??validatedAnchor(career,storage,a.identity.raceId)});session.open();
    const record=capture(session.state),replayed=verifyReplay(record);if(replayed.checksum!==digest(session.state))throw Error('Replay mismatch');checks.push({raceId:a.identity.raceId,checksum:record.checksum});
   }return {version:1,checks,durable:false};
  }
  if(message.type!=='prepare')throw Error('Unknown worker operation');
  // Candidate mutations never survive failed storage publication. The source
  // cache is invalidated before the first mutation, even if domain validation fails.
  cache=null;const runner=loaded.runner,op=message.operation;let viewerPacket=null;if(message.expectedRaceId!==undefined&&activeChampionship(career.state)?.raceId!==message.expectedRaceId)throw Error('STALE_WRITER: frozen race identity changed');
  if(op==='viewer'){viewerPacket=runner.viewer.execute(message);}
  else if(op==='repair'){
   const expected=message.snapshot.recordsHash,prior=message.previous;
   if(prior&&expected&&await digestText(JSON.stringify(prior.records))===expected){map.clear();for(const row of prior.records)map.set(...row);}
   else for(const[k,text]of map){if(k===SAVE_KEY||career.current.schema===7&&k.startsWith('bnt.m5.history.'))continue;const r=JSON.parse(text),a=unsealWire(r.authority),oldText=prior?.records.find(([key])=>key===k)?.[1],old=oldText?JSON.parse(oldText):null;const x=career.current.championshipFoundation.instances[a.identity.instanceId];
    let setup=x.raceId===a.identity.raceId?x.raceSetup:null;for(const candidate of [r.checkpoint,r.previous,old?.checkpoint,old?.previous]){try{setup=restoreRace(candidate,{identity:a.identity,setupHash:a.setupHash}).setup;break;}catch{}}if(!setup)throw Error('No validated frozen setup for checkpoint repair');const initial=checkpointRace(createRace(setup),a.identity,0),choices=[r.checkpoint,r.previous,old?.checkpoint,old?.previous,initial].filter(Boolean);
    const find=hash=>choices.find(cp=>wireHash(cp)===hash);
    let cp=find(a.checkpointHash),prev=a.previousHash?find(a.previousHash):null;
    if(!cp){const session=new RaceSessionStore(storage,{identity:a.identity,getCareerAnchor:()=>a.anchor});try{const d=session.decode(text),candidate=checkpointRace(d.s,a.identity,a.watermark);if(wireHash(candidate)===a.checkpointHash)cp=candidate;}catch{}}
    if(!cp||a.previousHash&&!prev)throw Error('Checkpoint cannot be reconstructed exactly; complete matching backup required');r.checkpoint=cp;r.previous=prev;map.set(k,JSON.stringify(r));
   }
   if(expected&&await digestText(JSON.stringify([...map]))!==expected)throw Error('Repair cannot prove the original durable record manifest');
   const repaired=load({...message.snapshot,records:[...map]});assertPresentationRestore(career.presentation,repaired.career.presentation,{existing:true});cache=null;
  }
  else if(op==='activeTeam'){career.setActiveTeam(message.request);}
  else if(op==='career'){if([7,8].includes(career.current.schema)&&(message.method==='importSave'||message.method==='transaction'&&(message.args.length!==1||message.args[0]?.commandVersion>=4)))throw Error('Use protected M5 controller or complete restore operations; caller transaction options are not authority');if(!['transaction','migrateFoundation','migrateCycles','migrateEconomy','migrateSchema','create','importSave','recover'].includes(message.method))throw Error('Unsupported career method');if(message.method==='transaction'&&['cycle.settle','e5.settle'].includes(message.args[0]?.type))throw Error('E5 completion authority is unavailable');if(['create','importSave','recover'].includes(message.method)&&[...map.keys()].some(k=>k!==SAVE_KEY))throw Error('Use complete backup restoration; career-only replacement cannot discard session authority');career[message.method](...message.args);}
  else if(op==='m6DenSettle'){const ack=career.current.m6.acks.find(a=>a.id===message.id);if(ack){if(ack.request?.type!=='m6.denSettle')throw Error('Conflicting spectator settlement identity');career.transaction(ack.request);}else{if(!denAttempt)throw Error('Reopen and run the saved spectator event first');const cap=denAttempt.completion(career,storage);career.transaction(makeE5Command(career.state,'m6.denSettle',{eventId:denAttempt.eventId,confirmed:true},message.id),{spectator:cap});denAttempt=null;}}
  else if(op==='m6quote'){if(career.current.schema!==8)throw Error('M6 bookmaker unavailable');const ack=career.current.m6.acks.find(a=>a.id===message.id);if(ack){if(ack.request?.type!=='m6.quote')throw Error('Conflicting quote identity');career.transaction(ack.request);}else{const cap=prepareQuote(career.state,{scope:message.scope??'championship'});career.transaction(makeE5Command(career.state,'m6.quote',{quote:cap.quote},message.id),{bookmaker:cap});}}
  else if(op==='e5'){if(!['m6.train','m6.rename','m6.denStart','m6.wager','m6.selectNation','m6.buildFacility','m6.denSlip','m6.denLive','m6.bonesStart','m6.bonesHold','m6.pitStart','m6.pitMove','m6.takeQuest','m6.dropQuest','m6.callFavor','m6.buyUpgrade','m6.setBanner','m6.eventChoose','m6.layWager','e5.enableM4','m4.buyLegacy','m4.equipLegacy','e5.enable','e5.refresh','e5.register','e5.selectRun','e5.settle','e5.selectLegacy'].includes(message.command))throw Error('Unsupported E5 operation');const command=makeE5Command(career.state,message.command,message.payload,message.id);career.transaction(command,(message.command==='e5.settle'||(career.current.schema===8&&message.command==='e5.selectLegacy'))&&!career.current.m6?.acks.some(a=>a.id===message.id)&&!career.current.transactions.some(r=>r.transaction.type==='e5.settle'&&r.transaction.payload.instanceId===message.payload.instanceId)?{settlement:createSettlementCapability(career,storage)}:{});}
  else if(op==='controller'){const type=message.command;if(!['controller.enable','controller.enableE3','championship.register','championship.coach','championship.withdraw'].includes(type))throw Error('Unsupported controller command');career.transaction(makeControllerCommand(career.state,type,message.payload,message.id));}
  else if(op==='refreshOffers'){const offers=[developmentOffer()];career.transaction(makeControllerCommand(career.state,'championship.refreshOffers',{offers},message.id),{catalog:createCatalogBoundary(v=>fingerprint(v)===fingerprint(offers)).accept(offers)});}
  else if(op==='memoryPrepare'){if(!attempt)throw Error('Unsaved attempt unavailable; cannot fabricate a result');attempt.prepare(loaded,message.snapshot,'e2-result-'+fingerprint([activeChampionship(career.state).id,activeChampionship(career.state).raceId]).slice(0,40));loaded.runner.cached=null;}
  else if(op==='presentation'){career.setRadioPreference(message.enabled,message.expectedPresentationRevision);}
  else if(op==='metadata'){validateRuntime(message.runtime);preservePresentation(message.snapshot.runtime,message.runtime);}
  else if(op==='retry')runner.retry(message.id);
  else if(op==='start')career.transaction(makeControllerCommand(career.state,'championship.start',{instanceId:activeChampionship(career.state).id},message.id));
  else if(op==='birth'){if(activeChampionship(career.state)?.phase!=='NO_STARTERS_PENDING')runner.ensure();}
  else if(op==='advance'||op==='sign'){
   const session=runner.ensure(),old=session.record.journal.value.find(j=>j.request.id===message.id),commands=op==='advance'?[]:[{action:message.action,...(message.sign===undefined?{}:{sign:message.sign})}];
   if(old){if(old.request.phase!==(op==='advance'?'advance':'paused')||old.request.ticks!==(op==='advance'?message.ticks:0)||JSON.stringify(old.request.commands)!==JSON.stringify(commands))throw Error('Conflicting accepted input ID');}
   else if(op==='advance')runner.advance(message.id,message.ticks);else runner.sign(message.id,message.action,message.sign);
  }
  else if(op==='nativePrepare'){const x=activeChampionship(career.state);if(x.phase!=='NO_STARTERS_PENDING'&&!x.raceResults.some(r=>r.raceId===x.raceId)){const session=runner.ensure();if(['Ready','Running'].includes(session.state.status))throw Error('Race is still active; clearance is not yet applicable');session.finalize('e2-result-'+fingerprint([x.id,x.raceId]).slice(0,40),session.inspect().revision);}}
  else if(op==='official'){
   const x=activeChampionship(career.state);
   if(x.phase!=='NO_STARTERS_PENDING'&&!x.raceResults.some(r=>r.raceId===x.raceId)){
    const session=runner.session();session.open();if(!['RESULT_COMMITTED','RACE_CLEARANCE_BLOCKED'].includes(session.record.authority.value.operational))throw Error('Durable native prepare required before official commit');
   }
   runner.publish(message.id);
  }else throw Error('Unsupported prepared operation');
  if([7,8].includes(career.current.schema)&&career.current.championshipFoundation.activeId===null){runner.cached=null;runner.viewer=null;attempt=null;}
  if(typeof BNT_M4_BUILD!=='undefined'&&BNT_M4_BUILD)requireCurrentM4(career.current);
  validatePresentationOwner(message.runtime??message.snapshot.runtime,career);
  const records=[...map];checkRecords(records);const candidateHash=await digestText(JSON.stringify(records));pending={operation:op,generation:message.snapshot.generation+1,records,token:'candidate-'+(++serial),validated:{key:snapshotKey({...message.snapshot,generation:message.snapshot.generation+1,records,...(Object.hasOwn(message.snapshot,'recordsHash')?{recordsHash:candidateHash}:{}),...(message.runtime?{runtime:message.runtime}:{})}),map,storage,career,runner}};
  return {version:1,token:pending.token,records,recordsHash:candidateHash,...(viewerPacket?{viewer:viewerPacket}:{}),durable:false,elapsedMs:performance.now()-started,phase:activeChampionship(career.state)?.phase,revision:career.current.revision};
 };
}
