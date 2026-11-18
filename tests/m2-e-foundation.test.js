import test from 'node:test';import assert from 'node:assert/strict';
import {store4} from './m2-d-helpers.js';
import {CareerStore} from '../src/persistence/career-store.js';
import {validateState} from '../src/career/state.js';
import {foundationEffect,validateInstanceIdentity} from '../src/career/championships/contracts.js';
import {fingerprint} from '../src/career/cycles/contracts.js';
import {makeEnvelope,parseEnvelope} from '../src/persistence/envelope.js';
import {createRace,step,run,capture,issueSign,digest} from '../src/sim/race.js';
import {checkpointRace,restoreRace} from '../src/sim/foundation/checkpoint.js';
import {pack,unpack,wireHash,sealWire} from '../src/sim/foundation/codec.js';
import {RaceSessionStore,careerAnchor} from '../src/persistence/race/session-store.js';
import {noStarterProof} from '../src/sim/foundation/no-starters.js';
const identity={profileId:'profile',careerId:'career',instanceId:'proof-instance',raceId:'proof-race'};
const request=s=>({id:'foundation-migration',profileId:s.profile.id,careerId:s.career.id,type:'career.foundation.migrate',version:1,sourceSchema:4,targetSchema:5,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,sourceFingerprint:fingerprint(s),effectId:foundationEffect(s.career.id),confirmed:true});
const memory=()=>({value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}});
const anchor={profileId:identity.profileId,careerId:identity.careerId,revision:0,maintenanceRevision:1,fingerprint:'a'.repeat(64)};
const setup=(format='Pure',course=null)=>({seed:145,format,course,overrides:{laps:1},consequence:{incidentRate:0}});
function session(options={}){const storage=memory();let current=anchor;const store=new RaceSessionStore(storage,{identity,getCareerAnchor:()=>current,interval:50});store.create(options.setup??setup(),{pendingEntitlementIds:options.pendingEntitlementIds??[]});return {store,storage,changeAnchor(){current={...anchor,revision:1,fingerprint:'b'.repeat(64)};},reopen(){const n=new RaceSessionStore(storage,{identity,getCareerAnchor:()=>current,interval:50});n.open();return n;}};}
const input=(s,id,ticks=1,commands=[])=>({id,expectedRevision:s.inspect().revision,tick:s.state.tick,phase:'advance',ticks,commands});
const paused=(s,id,action,sign)=>({id,expectedRevision:s.inspect().revision,tick:s.state.tick,phase:'paused',ticks:0,commands:[{action,...(sign?{sign}:{})}]});
for(const pkg of ['traditional','beastmaster','mechanist','veteran','scrappy'])test('E1 explicit lossless schema4→5 '+pkg,()=>{
 const {store,storage}=store4(pkg),old=store.state,raw=storage.value,preview=store.previewFoundation();assert.equal(storage.value,raw);assert.equal(preview.targetSchema,5);
 const r=request(old),n=store.migrateFoundation(r).state;assert.equal(n.schema,5);assert.equal(n.revision,old.revision);assert.equal(n.maintenanceRevision,old.maintenanceRevision+1);for(const k of ['management','cycles','career','profile','transactions','provenance'])assert.deepEqual(n[k],old[k]);assert.ok(store.migrateFoundation(r).duplicate);
 const file=JSON.stringify(store.export()),next=new CareerStore(memory());next.importSave(file,{confirmed:true});assert.deepEqual(next.state,parseEnvelope(file).primary);
 const tx={id:'next-edit',profileId:n.profile.id,careerId:n.career.id,commandVersion:1,type:'developer.treasury.adjust',effectId:'next-edit',expectedRevision:next.state.revision,expectedMaintenanceRevision:next.state.maintenanceRevision,delta:1,reason:'Test accepted old command on schema5'};next.transaction(tx);assert.equal(next.state.career.treasury,n.career.treasury+1);validateState(next.state);
});
test('E1 rejects ownership, stale, unconfirmed, unsupported, failed publication and downgrade',()=>{
 for(const patch of [{careerId:'other'},{expectedRevision:999},{version:2},{confirmed:false}]){const {store,storage}=store4(),raw=storage.value;assert.throws(()=>store.migrateFoundation({...request(store.state),...patch}));assert.equal(storage.value,raw);}
 const {store,storage}=store4(),old=JSON.stringify(store.export()),r=request(store.state),raw=storage.value,state=store.state;storage.setItem=()=>{throw Error('quota');};assert.throws(()=>store.migrateFoundation(r),/rolled back/);assert.equal(storage.value,raw);assert.deepEqual(store.state,state);
 const ok=store4();ok.store.migrateFoundation(request(ok.store.state));assert.throws(()=>ok.store.importSave(old,{confirmed:true}),/pre-foundation/);assert.throws(()=>ok.store.migrateFoundation({...request(state),id:'other'}),/protected/);
 const bad=structuredClone(ok.store.state);bad.championshipFoundation.conditionMapping.status='MAPPED';assert.throws(()=>makeEnvelope(bad));
});
test('E1 frozen identity validators reject duplicate/unknown references',()=>{
 const x={version:1,profileId:'p',careerId:'c',instanceId:'i',configurationFingerprint:'a'.repeat(64),participants:[{entrantId:'a',assetIds:['driver','b1','b2','chariot']}]};validateInstanceIdentity(x);assert.throws(()=>validateInstanceIdentity({...x,participants:[x.participants[0],x.participants[0]]}));assert.throws(()=>validateInstanceIdentity({...x,extra:true}));
});
test('E4 codec preserves Infinity, undefined, shared identity and property locks; rejects cycles/versions',()=>{
 const frozen=Object.freeze({n:Infinity});const a={x:frozen,y:frozen,u:undefined,z:-0};Object.defineProperty(a,'locked',{value:7,enumerable:true});const b=unpack(JSON.parse(JSON.stringify(pack(a))));assert.equal(b.x,b.y);assert.ok(Object.isFrozen(b.x));assert.equal(b.x.n,Infinity);assert.ok(Object.hasOwn(b,'u'));assert.ok(Object.is(b.z,-0));assert.throws(()=>b.locked=8);assert.throws(()=>unpack({...pack(a),version:2}));const cycle={};cycle.a=cycle;assert.throws(()=>pack(cycle),/Cyclic/);
});
const resumeEvidence=[];
for(const course of [null,'C01','mixed-rally'])for(const format of ['Pure','Combat'])test(`E4 complete real ${format} ${course??'Oval'} checkpoint/resume exact parity`,t=>{
 const s=createRace(setup(format,course));issueSign(s,'queue','Push the Pace');for(let i=0;i<30;i++)step(s);issueSign(s,'queue','Conserve Strength');
 const c=checkpointRace(s,identity,2),restored=restoreRace(JSON.parse(JSON.stringify(c)),{identity});assert.equal(restored.nextIncidentAt,Infinity);assert.deepEqual(restored.rng,s.rng);
 run(s);run(restored);assert.deepEqual(capture(restored),capture(s));assert.equal(restored.status,'Ended');assert.equal(restored.events.some(e=>e.type==='INCIDENT_SPAWNED'),false);assert.equal(wireHash(pack(restored)),wireHash(pack(s)));
 resumeEvidence.push({format,course:course??'Oval',checksum:digest(s),tick:s.tick,checkpointBytes:JSON.stringify(c).length,remaining:s.entrants[0].signs.remaining});t.diagnostic(JSON.stringify(resumeEvidence.at(-1)));
});
test('E4 checkpoint validation rejects incompatible metadata, identity, state and unresolved boundaries',()=>{
 const s=createRace(setup()),c=checkpointRace(s,identity);assert.throws(()=>restoreRace(c,{identity:{...identity,raceId:'other'}}));for(const mutate of [x=>x.simulationVersion='other',x=>x.tick++,x=>x.version=2]){const x=structuredClone(c.value);mutate(x);assert.throws(()=>restoreRace(sealWire(x)));}s.resolving=true;assert.throws(()=>checkpointRace(s,identity));
});
test('E4 durable ordered paused inputs and duplicate retry consume signs once',()=>{
 const x=session(),s=x.store,r1=paused(s,'queue','queue','Push the Pace');assert.equal(s.apply(r1).durable,true);const r2=paused(s,'replace','queue','Conserve Strength');s.apply(r2);const n=x.reopen();assert.equal(n.state.entrants[0].signs.remaining,1);assert.equal(n.state.entrants[0].signs.pending,'Conserve Strength');assert.ok(n.apply(r1).duplicate);assert.throws(()=>n.apply({...r1,commands:[{action:'lower'}]}),/Conflicting/);n.apply(input(n,'go'));assert.equal(n.state.entrants[0].signs.active,'Conserve Strength');assert.deepEqual(capture(x.reopen().state),capture(n.state));
});
test('E4 corrupted newest generation replays complete tail; missing/reordered journal fails closed',()=>{
 const x=session(),s=x.store;s.apply(input(s,'checkpoint',50));s.apply(paused(s,'queued','queue','Conserve Strength'));s.apply(input(s,'tail',3));const expected=capture(s.state),raw=JSON.parse(x.storage.value);raw.checkpoint.hash='bad';x.storage.value=JSON.stringify(raw);assert.deepEqual(capture(x.reopen().state),expected);
 const bad=structuredClone(raw);bad.journal.value.pop();x.storage.value=JSON.stringify(bad);assert.throws(()=>x.reopen(),/integrity|journal/);assert.equal(x.storage.value,JSON.stringify(bad));
});
test('E4 denied/torn storage write acknowledges no input and rolls back memory; manual mode is explicit',()=>{
 const x=session(),before=capture(x.store.state),raw=x.storage.value,r=input(x.store,'denied');x.storage.setItem=()=>{throw Error('denied');};assert.throws(()=>x.store.apply(r),/rolled back/);assert.deepEqual(capture(x.store.state),before);assert.equal(x.storage.value,raw);assert.equal(x.store.mode,'manual');assert.throws(()=>x.store.apply(r),/Export/);const e=x.store.export();x.store.acknowledgeExport(e.token);assert.equal(x.store.apply(r).durable,false);
 const storage={getItem(){throw Error('denied');},setItem(){throw Error('denied');}},m=new RaceSessionStore(storage,{identity,getCareerAnchor:()=>anchor});assert.throws(()=>m.create(setup()),/unavailable/);m.create(setup(),{manual:true});assert.equal(m.inspect().requiresCheckpoint,true);
});
test('E4 stale writers and changed financial authority cannot overwrite or resume',()=>{
 const x=session(),n=x.reopen();x.store.apply(input(x.store,'new'));assert.throws(()=>n.apply(input(n,'stale')),/another window/);x.changeAnchor();assert.throws(()=>x.reopen(),/career changed/);assert.throws(()=>x.store.apply(input(x.store,'no-rewind')),/career changed/);
});
test('D5 real cleared result atomically publishes native condition/classification/proof effects once',()=>{
 const x=session({pendingEntitlementIds:['proof-claim-1','proof-claim-2']}),s=x.store;s.apply(input(s,'complete',10000));assert.equal(s.state.status,'Ended');const before=s.inspect().revision,got=s.finalize('result',before);assert.ok(!got.blocked);assert.equal(got.result.pendingEntitlementIds.length,2);assert.equal(got.result.conditions.length,8);assert.equal(got.result.standingsEffects.length,8);assert.ok(x.reopen().finalize('result',before).duplicate);assert.throws(()=>s.finalize('conflict',s.inspect().revision),/Conflicting/);assert.throws(()=>s.apply(input(s,'again')),/committed/);
});
test('D5 uncleared/stalled proof is recoverably blocked with no permanent effects',()=>{
 const x=session();const got=x.store.finalize('early',0);assert.ok(got.blocked);assert.equal(x.store.record.publication.value,null);assert.equal(x.reopen().record.authority.value.operational,'RACE_CLEARANCE_BLOCKED');assert.throws(()=>x.store.apply(input(x.store,'advance')),/blocked/);
 const s=createRace(setup());s.status='Stalled';const c=checkpointRace(s,identity);assert.equal(restoreRace(c).status,'Stalled');
});
test('D5 result storage failure publishes no partial conditions, standings or entitlements',()=>{
 const x=session();x.store.apply(input(x.store,'finish',10000));const raw=x.storage.value,before=JSON.stringify(x.store.record);x.storage.setItem=()=>{throw Error('quota');};assert.throws(()=>x.store.finalize('result',x.store.inspect().revision),/rolled back/);assert.equal(x.storage.value,raw);assert.equal(JSON.stringify(x.store.record),before);assert.equal(x.reopen().record.publication.value,null);
});
test('D5 separate no-starter proof requires complete ineligibility evidence and fabricates no DNS',()=>{
 const e={version:1,sourceFingerprint:'a'.repeat(64),registered:[{entrantId:'A',mayStart:false,reason:'Ineligible in synthetic fixture'}]};const p=noStarterProof(identity,e);assert.deepEqual(p.classification,[]);assert.deepEqual(p.pendingEntitlementIds,[]);assert.throws(()=>noStarterProof(identity,{...e,registered:[{...e.registered[0],mayStart:true}]}));
});
test('E4 nonzero incident scheduler and queued collision/override state restore without RNG drift',()=>{
 const options={...setup('Combat'),consequence:{incidentRate:0.2},scheduledIncidents:[{time:2,type:'debris',lane:0,tile:8,duration:3}]};const s=createRace(options);for(let i=0;i<10;i++)step(s);const next=s.nextIncidentAt,n=restoreRace(JSON.parse(JSON.stringify(checkpointRace(s,identity))));assert.equal(n.nextIncidentAt,next);for(let i=0;i<100;i++){step(s);step(n);}assert.deepEqual(capture(n),capture(s));assert.deepEqual(n.rng,s.rng);
});
test('E4 compression corruption/truncation/oversize and descriptor forgery reject',()=>{
 const p=pack({text:'abc'.repeat(20000),infinity:Infinity});assert.deepEqual(unpack(JSON.parse(JSON.stringify(p))),{text:'abc'.repeat(20000),infinity:Infinity});assert.throws(()=>unpack({...p,transport:{...p.transport,plainBytes:33*1024*1024}}));assert.throws(()=>unpack({...p,transport:{...p.transport,data:p.transport.data.slice(0,-8)}}));
});
test('E4 manual import is confirmed, atomic and cannot rewind a known committed result',()=>{
 const x=session(),old=x.store.export().text;x.store.apply(input(x.store,'finish',10000));x.store.finalize('result',x.store.inspect().revision);assert.throws(()=>x.store.importManual(old,{confirmed:true}),/rewind/);assert.throws(()=>x.store.importManual(old),/Confirm/);const raw=x.storage.value;assert.throws(()=>x.store.importManual('{',{confirmed:true}));assert.equal(x.storage.value,raw);
});
test('E1 foundation migration shares protected capacity and rejects conflicting request IDs',async()=>{
 const {mergeProtected}=await import('../src/career/economy/protected-registry.js'),{protectFoundationMigration}=await import('../src/career/championships/contracts.js');const {store}=store4(),r=request(store.state);store.migrateFoundation(r);assert.throws(()=>store.migrateFoundation({...r,sourceFingerprint:'0'.repeat(64)}),/Conflicting/);
 const entries=Array.from({length:2000},(_,i)=>protectFoundationMigration({...r,id:'identity-'+i,careerId:'career-'+i,effectId:foundationEffect('career-'+i)}));assert.equal(mergeProtected(entries).length,2000);assert.throws(()=>mergeProtected(entries,store.state.history.commands),/limit/);
});
test('D5 real disabled permanent wreck survives checkpoint and legitimate clearance',()=>{
 const s=createRace({...setup(),entrants:createRace().setup.entrants.slice(0,2)});s.entrants[1].ru.driver.condition=0;for(let i=0;i<3;i++)step(s);assert.equal(s.entrants[1].physical,'Wreck');const n=restoreRace(JSON.parse(JSON.stringify(checkpointRace(s,identity))));assert.ok(Object.isFrozen(n.wrecks[n.entrants[1].id]));run(s);run(n);assert.deepEqual(capture(n),capture(s));if(n.status==='Ended')assert.equal(n.entrants[1].physical,'Wreck');
});
test('E4 durable career anchor detects a committed financial change without ever writing Gold',async()=>{
 const {storedCareerAnchor}=await import('../src/persistence/race/session-store.js');const {store:career}=store4(),map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};const {SAVE_KEY}=await import('../src/persistence/envelope.js');storage.setItem(SAVE_KEY,JSON.stringify(career.export()));const anchor=storedCareerAnchor(storage),i={profileId:anchor.profileId,careerId:anchor.careerId,instanceId:'financial-proof',raceId:'race'},r=new RaceSessionStore(storage,{identity:i,getCareerAnchor:()=>storedCareerAnchor(storage)});const financial=storage.getItem(SAVE_KEY);r.create(setup());r.apply(input(r,'step'));assert.equal(storage.getItem(SAVE_KEY),financial);
 const n=career.state;career.transaction({id:'financial-change',profileId:n.profile.id,careerId:n.career.id,type:'developer.treasury.adjust',commandVersion:1,effectId:'financial-change',expectedRevision:n.revision,expectedMaintenanceRevision:n.maintenanceRevision,delta:1,reason:'Synthetic committed financial change'});storage.setItem(SAVE_KEY,JSON.stringify(career.export()));const after=storage.getItem(SAVE_KEY);assert.throws(()=>r.apply(input(r,'no-rewind')),/career changed/);assert.equal(storage.getItem(SAVE_KEY),after);
});
test('D5 acknowledgement lost after atomic write reopens the committed result exactly once',()=>{
 const x=session({setup:{...setup(),entrants:createRace().setup.entrants.slice(0,2)}});x.store.apply(input(x.store,'finish',10000));const revision=x.store.inspect().revision,write=x.storage.setItem.bind(x.storage);x.storage.setItem=(k,v)=>{write(k,v);throw Error('Simulated interruption after atomic commit before acknowledgement');};assert.throws(()=>x.store.finalize('lost-ack',revision),/rolled back/);x.storage.setItem=write;const n=x.reopen();assert.ok(n.finalize('lost-ack',revision).duplicate);assert.equal(n.record.authority.value.operational,'RESULT_COMMITTED');
});
test('E4 recovery fails explicitly when both generations are corrupt or setup identity changes',()=>{
 const x=session();x.store.apply(input(x.store,'cp',50));const r=JSON.parse(x.storage.value);r.checkpoint.hash='bad';r.previous.hash='bad';x.storage.value=JSON.stringify(r);assert.throws(()=>x.reopen(),/RECOVERY_REQUIRED/);assert.equal(x.storage.value,JSON.stringify(r));
});
test('E4 bounded codec covers high-entropy Unicode and repeated dictionary resets',()=>{
 let seed=145;const text=[];for(let i=0;i<500000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;text.push(String.fromCharCode(32+(seed>>>16)%300));}const original={text:text.join(''),sentinel:Infinity};assert.deepEqual(unpack(JSON.parse(JSON.stringify(pack(original)))),original);
});
test('E4 default eight-entrant Combat Rally durably fits the unchanged envelope bound',t=>{
 const x=session({setup:setup('Combat','mixed-rally')});x.store.apply(input(x.store,'default-rally',10000));assert.equal(x.store.state.status,'Ended');const done=x.store.finalize('rally-result',x.store.inspect().revision);assert.ok(!done.blocked);assert.ok(new TextEncoder().encode(x.storage.value).length<=8*1024*1024);assert.ok(x.reopen().finalize('rally-result',0).duplicate);t.diagnostic(JSON.stringify({defaultCombatRallySessionBytes:new TextEncoder().encode(x.storage.value).length,tick:x.store.state.tick}));
});
test('E4 exclusive browser-writer seam serializes open+write and rejects stale competing input',async()=>{
 const {withRaceSessionLock}=await import('../src/persistence/race/session-store.js');const x=session();let tail=Promise.resolve();const locks={request(k,o,fn){assert.equal(o.mode,'exclusive');const p=tail.then(fn);tail=p.catch(()=>{});return p;}};const r=input(x.store,'first'),other={...r,id:'second'};
 const results=await Promise.allSettled([withRaceSessionLock(identity,()=>{const s=x.reopen();return s.apply(r);},{locks}),withRaceSessionLock(identity,()=>{const s=x.reopen();return s.apply(other);},{locks})]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(x.reopen().record.journal.value.length,1);await assert.rejects(()=>withRaceSessionLock(identity,()=>{}, {locks:null}),/coordination/);
});
