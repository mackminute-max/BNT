import {test} from 'node:test';import {checksum} from '../src/core/determinism.js';import assert from 'node:assert/strict';
import {createCareer,transact,validateState,migrateStateV1} from '../src/career/state.js';
import {emptyManagement,validateOwnershipGraph,REGISTRY_NAMES} from '../src/career/registries.js';
import {historyRetentionPlan,assertProtectedRetention,lookupCommitted,protectTransaction} from '../src/career/history.js';
import {CareerStore} from '../src/persistence/career-store.js';import {SAVE_KEY,makeEnvelope,parseEnvelope,seal} from '../src/persistence/envelope.js';
import {configuration} from '../src/dev/configuration.js';import {VERSION} from '../src/config/config.js';import {createRace,capture} from '../src/sim/race.js';
const fresh=()=>createCareer({profileId:'owner',careerId:'career'});
const oldTx=(i=0,delta=10)=>({id:'legacy-'+i,profileId:'owner',careerId:'career',expectedRevision:i,type:'developer.treasury.adjust',delta,reason:'Migration fixture'});
const tx=(s,id='new-command',effectId='effect-1',delta=5)=>({id,profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,type:'developer.treasury.adjust',delta,reason:'Schema 2 fixture',commandVersion:1,expectedMaintenanceRevision:s.maintenanceRevision,effectId});
class Memory{constructor(){this.value=null;this.writes=0;this.deny=false;}getItem(){if(this.deny)throw Error('Denied');return this.value;}setItem(k,v){if(this.deny)throw Error('Quota');this.value=v;this.writes++;}}
function loaded(state=fresh()){const storage=new Memory(),store=new CareerStore(storage);store.open();store.create(state);return {store,storage};}
function migrate(store){const s=store.state;return store.migrateSchema({confirmed:true,profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision??0});}
const record=(id,references={})=>({id,ownerCareerId:'career',references});

test('M2-A: clean migration preserves full M1 data and grants no Gold/assets/progress',()=>{
 const original=fresh(),before=structuredClone(original),next=migrateStateV1(original);assert.deepEqual(original,before);for(const k of ['profile','career','revision','transactions','provenance','pendingRace'])assert.deepEqual(next[k],original[k]);assert.equal(next.schema,2);assert.equal(next.maintenanceRevision,1);assert.equal(next.management.initialized,false);for(const name of REGISTRY_NAMES)assert.deepEqual(next.management.registries[name],{});assert.equal(next.migration.sourceRevision,0);assert.equal(next.career.treasury,0);
});
test('M2-A: edited migration retains original receipt identities, exact payloads and developer provenance',()=>{
 const old=transact(fresh(),oldTx()).state,next=migrateStateV1(old);assert.deepEqual(next.transactions,old.transactions);assert.deepEqual(next.provenance,old.provenance);assert.equal(next.career.treasury,10);assert.equal(next.revision,1);assert.equal(next.profile.developerEdited,true);assert.equal(next.history.commands[0].request.includes('legacy-0'),true);assert.equal(transact(next,oldTx()).duplicate,true);assert.throws(()=>transact(next,{...oldTx(),delta:11}),/Conflicting/);
});
test('M2-A: valid M1 pending checkpoint is retained byte-for-byte as inert starting data',()=>{
 const initial=fresh();initial.pendingRace={id:'pending',careerId:'career',engineVersion:VERSION,setup:configuration({seed:321,course:'mixed-rally',format:'Combat'}).setup};const before=JSON.stringify(initial.pendingRace),next=migrateStateV1(initial);assert.equal(JSON.stringify(next.pendingRace),before);assert.deepEqual(parseEnvelope(makeEnvelope(next,initial).text).primary.pendingRace,initial.pendingRace);
});
test('M2-A: incompatible or damaged M1 input fails migration rather than discarding its checkpoint',()=>{
 const original=fresh();original.pendingRace={id:'pending',careerId:'career',engineVersion:'unsupported',setup:configuration({}).setup};const copy=structuredClone(original);assert.throws(()=>migrateStateV1(original),/Incompatible/);assert.deepEqual(original,copy);const broken=fresh();broken.career.treasury=1;assert.throws(()=>migrateStateV1(broken));
});
test('M2-A: atomic explicit store migration retains exact old sealed checkpoint and both schema versions load',()=>{
 const old=transact(fresh(),oldTx()).state,{store,storage}=loaded(old),envelope=store.export();assert.equal(store.state.schema,1);const writes=storage.writes;migrate(store);assert.equal(storage.writes,writes+1);assert.equal(store.state.schema,2);assert.deepEqual(store.export().recovery,envelope.primary);assert.deepEqual(store.export().recovery.value,old);const reload=new CareerStore(storage);reload.open();assert.deepEqual(reload.state,store.state);assert.equal(migrate(reload).migrated,false);assert.equal(storage.writes,writes+1);
});
test('M2-A: migration confirmation, ownership and both revisions are mandatory; no writes on rejection',()=>{
 const {store,storage}=loaded(),before=storage.value;for(const options of [{},{confirmed:'yes'},{confirmed:true,profileId:'other',careerId:'career',expectedRevision:0,expectedMaintenanceRevision:0},{confirmed:true,profileId:'owner',careerId:'career',expectedRevision:0,expectedMaintenanceRevision:1}])assert.throws(()=>store.migrateSchema(options));assert.equal(storage.value,before);assert.equal(store.state.schema,1);
});
test('M2-A: migration write failure leaves original state/bytes intact and manual retry requires checkpoint acknowledgment',()=>{
 const {store,storage}=loaded(transact(fresh(),oldTx()).state),before=store.state,raw=storage.value;storage.setItem=()=>{throw Error('Quota');};assert.throws(()=>migrate(store),/rolled back/);assert.deepEqual(store.state,before);assert.equal(storage.value,raw);assert.equal(store.mode,'manual');assert.throws(()=>migrate(store),/checkpoint/);store.acknowledgeExport(store.export().primary.digest);migrate(store);assert.equal(store.state.schema,2);assert.equal(store.requiresCheckpoint,true);assert.equal(storage.value,raw);
});
test('M2-A: schema2 save exact roundtrip into fresh store preserves fields and accepts a versioned transaction',()=>{
 const {store}=loaded(transact(fresh(),oldTx()).state);migrate(store);const env=store.export(),other=new CareerStore(new Memory());other.open();other.importSave(JSON.stringify(env),{confirmed:true});assert.deepEqual(other.export(),env);const command=tx(other.state);other.transaction(command);assert.equal(other.state.career.treasury,15);assert.equal(other.state.revision,2);assert.equal(other.state.maintenanceRevision,1);assert.equal(other.transaction(command).duplicate,true);
});
test('M2-A: new commands require commandVersion, independent effect identity and both expected revisions',()=>{
 const s=migrateStateV1(fresh()),valid=tx(s);for(const patch of [{commandVersion:2},{expectedMaintenanceRevision:0},{expectedRevision:1},{careerId:'absent'},{effectId:''}])assert.throws(()=>transact(s,{...valid,...patch}));assert.throws(()=>transact(s,oldTx()));const next=transact(s,valid).state;assert.throws(()=>transact(next,tx(next,'other',valid.effectId)),/Effect identity/);assert.throws(()=>transact(next,{...valid,delta:6}),/Conflicting/);
});
test('M2-A: protected identities/effects survive older import and lost verbose result returns nonmutating ALREADY_COMMITTED',()=>{
 const {store,storage}=loaded();migrate(store);const earlier=JSON.stringify(store.export()),command=tx(store.state);store.transaction(command);store.importSave(earlier,{confirmed:true});assert.equal(store.state.career.treasury,0);assert.equal(store.state.revision,0);assert.equal(store.state.maintenanceRevision,2);assert.equal(store.state.history.commands.length,1);const raw=storage.value,writes=storage.writes,result=store.transaction(command);assert.equal(result.status,'ALREADY_COMMITTED');assert.equal(result.receipt,null);assert.equal(storage.writes,writes);assert.equal(storage.value,raw);assert.throws(()=>store.transaction(tx(store.state,'alias',command.effectId)),/Effect identity/);const reload=new CareerStore(storage);reload.open();assert.equal(reload.transaction(command).status,'ALREADY_COMMITTED');
});
test('M2-A: M1 provenance without a verbose receipt migrates to a protected identity without inventing balance/result',()=>{
 const {store}=loaded(),pristine=JSON.stringify(store.export());store.transaction(oldTx());store.importSave(pristine,{confirmed:true});assert.equal(store.state.transactions.length,0);migrate(store);assert.equal(store.state.career.treasury,0);assert.equal(store.state.revision,0);assert.equal(store.state.history.commands[0].balanceAfter,null);const result=store.transaction(oldTx());assert.equal(result.status,'ALREADY_COMMITTED');assert.equal(result.receipt,null);assert.equal(store.state.career.treasury,0);
});
test('M2-A: strict external schema1 downgrade is rejected; explicit import upgrade retains P0 and provenance',()=>{
 const {store,storage}=loaded(),legacy=JSON.stringify(store.export());migrate(store);store.transaction(tx(store.state));const raw=storage.value;assert.throws(()=>store.importSave(legacy,{confirmed:true}),/migration confirmation/);assert.equal(storage.value,raw);store.importSave(legacy,{confirmed:true,migrateLegacy:true});assert.equal(store.state.schema,2);assert.equal(store.state.career.treasury,0);assert.equal(store.state.career.developerEdited,true);assert.equal(store.state.history.commands.length,1);
});
test('M2-A: corrupt schema2 primary offers old schema1 recovery and re-upgrades explicitly without grants or duplicate effects',()=>{
 const {store,storage}=loaded(transact(fresh(),oldTx()).state);migrate(store);const corrupt=JSON.parse(storage.value);corrupt.primary.digest='00000000';storage.value=JSON.stringify(corrupt);const reload=new CareerStore(storage);reload.open();assert.equal(reload.mode,'recovery-required');const before=storage.value;assert.throws(()=>reload.recover(),/confirmation/);assert.equal(storage.value,before);reload.recover({confirmed:true});assert.equal(reload.state.schema,2);assert.equal(reload.state.career.treasury,10);assert.equal(reload.state.revision,1);assert.equal(reload.state.maintenanceRevision,2);assert.equal(reload.transaction(oldTx()).duplicate,true);
});
test('M2-A: protected-registry corruption and missing identities block load/import without overwriting valid state',()=>{
 const {store,storage}=loaded();migrate(store);store.transaction(tx(store.state));const before=storage.value;for(const change of [e=>e.protectedHistory.digest='00000000',e=>{e.protectedHistory=seal([]);},e=>{delete e.protectedHistory;}]){const e=store.export();change(e);assert.throws(()=>store.importSave(JSON.stringify(e),{confirmed:true}));assert.equal(storage.value,before);}const e=store.export();e.protectedHistory.digest='00000000';storage.value=JSON.stringify(e);const reload=new CareerStore(storage);reload.open();assert.equal(reload.mode,'blocked');assert.equal(reload.state,null);
});
test('M2-A: returned receipts are immutable isolated views; altered receipt/index facts fail validation',()=>{
 const {store}=loaded();migrate(store);store.transaction(tx(store.state));const s=store.state;assert.throws(()=>{s.transactions[0].balanceAfter=999;},TypeError);assert.throws(()=>{s.history.commands[0].request='changed';},TypeError);const bad=structuredClone(s);bad.transactions[0].balanceAfter=999;assert.throws(()=>validateState(bad));const badIndex=structuredClone(s);badIndex.history.commands[0].fingerprint='00000000';assert.throws(()=>validateState(badIndex));
});
test('M2-A: compaction preparation is pure and cannot discard protected identities or known effect facts',()=>{
 const s=migrateStateV1(transact(fresh(),oldTx()).state),before=structuredClone(s),plan=historyRetentionPlan(s);assert.equal(plan.canCompact,false);assert.deepEqual(plan.remove,[]);assert.deepEqual(plan.summarize,[]);assert.deepEqual(s,before);assert.equal(plan.classes.P0.includes('never'),true);assert.throws(()=>assertProtectedRetention(s.history.commands,[]),/lost/);assert.equal(assertProtectedRetention(s.history.commands,s.history.commands),true);const entry=protectTransaction(oldTx());assert.equal(lookupCommitted([entry],oldTx(),[]).status,'ALREADY_COMMITTED');
});
test('M2-A: initialization, asset grants, reward/cycle/Legacy actions remain disabled until their stage is authorized',()=>{
 const s=migrateStateV1(fresh());for(const type of ['career.initialize','asset.purchase','management.cycle','legacy.award','race.reward'])assert.throws(()=>transact(s,{...tx(s),type}));const initialized=structuredClone(s);initialized.management.initialized=true;assert.throws(()=>validateState(initialized),/M2-B/);const granted=structuredClone(s);granted.management.registries.beasts.beast=record('beast');assert.throws(()=>validateState(granted),/M2-B/);
});
test('M2-A: ownership reference graph validates typed owned entities and reciprocal equipment/property/employment links',()=>{
 const r=emptyManagement().registries;r.personnel.driver=record('driver',{contract:['contract']});r.contracts.contract=record('contract',{employee:['driver']});r.chariots.chariot=record('chariot',{equipment:['item']});r.equipment.item=record('item',{installedOn:['chariot']});r.properties.property=record('property',{facilities:['facility']});r.facilities.facility=record('facility',{property:['property']});assert.equal(validateOwnershipGraph(r,'career'),true);
 for(const mutate of [r=>r.personnel.driver.ownerCareerId='other',r=>r.beasts.driver=record('driver'),r=>r.chariots.chariot.references.equipment=['absent'],r=>r.chariots.chariot.references.equipment=['driver'],r=>r.equipment.item.references.installedOn=[],r=>r.contracts.contract.references.employee=['item'],r=>r.personnel.driver.references.contract=[],r=>r.facilities.facility.references.property=[]]){const invalid=structuredClone(r);mutate(invalid);assert.throws(()=>validateOwnershipGraph(invalid,'career'));}
});
test('M2-A: exclusive assignment identity and duplicate/unknown references are rejected without domain mutation',()=>{
 const r=emptyManagement().registries;r.beasts.beast=record('beast');r.projects.project=record('project',{subject:['beast']});r.assignments.one=record('one',{subject:['beast'],project:['project']});assert.equal(validateOwnershipGraph(r,'career'),true);r.assignments.two=record('two',{subject:['beast'],project:['project']});assert.throws(()=>validateOwnershipGraph(r,'career'),/exclusive/);delete r.assignments.two;r.projects.project.references.subject=['beast','beast'];assert.throws(()=>validateOwnershipGraph(r,'career'),/cardinality/);
});
test('M2-A: stale maintenance token after same-career import rejects a cached new command even if gameplay revision matches',()=>{
 const {store}=loaded();migrate(store);const command=tx(store.state),snapshot=JSON.stringify(store.export());store.importSave(snapshot,{confirmed:true});assert.equal(store.state.revision,0);assert.equal(store.state.maintenanceRevision,2);assert.throws(()=>store.transaction(command),/maintenance revision/);
});
test('M2-A: pending records stay inert across future engine versions rather than being discarded or executed',()=>{
 const s=migrateStateV1(fresh());s.pendingRace={id:'inert',careerId:'career',engineVersion:'future-engine-9',setup:configuration({}).setup};s.migration.sourcePendingDigest=checksum(s.pendingRace);const race=createRace(),before=capture(race);assert.equal(parseEnvelope(makeEnvelope(s).text).primary.pendingRace.engineVersion,'future-engine-9');assert.deepEqual(capture(race),before);
});

test('M2-A: migration and versioned history never change independent authoritative race state or RNG',()=>{
 const race=createRace(),before=capture(race),{store}=loaded(transact(fresh(),oldTx()).state);migrate(store);store.transaction(tx(store.state));store.export();assert.deepEqual(capture(race),before);
});
test('M2-A: large valid M1 pending payload survives migration above the legacy file limit without dropping data',()=>{
 const s=fresh(),setup=configuration({}).setup;setup.entrants[0].ru.fixtureNote='x'.repeat(1100000);s.pendingRace={id:'large-pending',careerId:'career',engineVersion:VERSION,setup};const original=makeEnvelope(s).text;assert.ok(original.length<2*1024*1024);const next=migrateStateV1(s),envelope=makeEnvelope(next,s);assert.ok(envelope.text.length>2*1024*1024);assert.equal(parseEnvelope(envelope.text).primary.pendingRace.setup.entrants[0].ru.fixtureNote.length,1100000);assert.deepEqual(envelope.envelope.recovery.value,s);
});

test('M2-A: recovery of a clean migration stays schema2 even with zero protected commands',()=>{
 const {store,storage}=loaded();migrate(store);const broken=store.export();assert.equal(broken.protectedHistory.value.length,0);broken.primary.digest='00000000';storage.value=JSON.stringify(broken);const next=new CareerStore(storage);next.open();next.recover({confirmed:true});assert.equal(next.state.schema,2);assert.equal(next.state.revision,0);assert.equal(next.state.maintenanceRevision,2);assert.equal(next.state.career.treasury,0);
});
test('M2-A: sealed maintenance clock survives corrupt primary and prevents revision reuse across old checkpoint recovery',()=>{
 const {store,storage}=loaded();migrate(store);const earlier=JSON.stringify(store.export());for(let i=0;i<4;i++)store.importSave(earlier,{confirmed:true});assert.equal(store.state.maintenanceRevision,5);const broken=store.export();broken.primary.digest='00000000';storage.value=JSON.stringify(broken);const next=new CareerStore(storage);next.open();assert.equal(next.maintenanceClock,5);next.recover({confirmed:true});assert.equal(next.state.maintenanceRevision,6);assert.equal(next.state.revision,0);assert.equal(next.export().maintenanceClock.value,6);
});
test('M2-A: malformed/falsy protected registries and forged clock cannot bypass typed envelope validation',()=>{
 const {store,storage}=loaded();migrate(store);const raw=storage.value;for(const change of [e=>e.protectedHistory=null,e=>e.protectedHistory=false,e=>delete e.maintenanceClock,e=>e.maintenanceClock=seal(-1),e=>e.maintenanceClock.digest='00000000']){const invalid=store.export();change(invalid);assert.throws(()=>store.importSave(JSON.stringify(invalid),{confirmed:true}));assert.equal(storage.value,raw);}
});

test('M2-A: known M1 identities belonging to previously replaced profiles survive later migration and profile restoration',()=>{
 const {store}=loaded(transact(fresh(),oldTx()).state),pristine=makeEnvelope(fresh()).envelope;
 const foreign=makeEnvelope(createCareer({profileId:'other-owner',careerId:'other-career'})).text;store.importSave(foreign,{confirmed:true});assert.equal(store.state.profile.developerEdited,false);migrate(store);assert.ok(store.export().protectedHistory.value.some(e=>e.id===oldTx().id));store.importSave(JSON.stringify(pristine),{confirmed:true,migrateLegacy:true});assert.equal(store.state.profile.id,'owner');assert.equal(store.state.career.treasury,0);assert.equal(store.state.profile.developerEdited,true);assert.equal(store.transaction(oldTx()).status,'ALREADY_COMMITTED');assert.equal(store.state.transactions.length,0);
});

test('M2-A: large mixed-schema envelope can recover a valid backup even when primary schema metadata is corrupt',()=>{
 const source=fresh(),setup=configuration({}).setup;setup.entrants[0].ru.fixtureNote='y'.repeat(1100000);source.pendingRace={id:'large-recovery',careerId:'career',engineVersion:VERSION,setup};const e=makeEnvelope(migrateStateV1(source),source).envelope;e.primary.value.schema=1;const storage=new Memory();storage.value=JSON.stringify(e);const store=new CareerStore(storage);store.open();assert.equal(store.mode,'recovery-required');assert.equal(store.recovery.pendingRace.setup.entrants[0].ru.fixtureNote.length,1100000);store.recover({confirmed:true});assert.equal(store.state.schema,2);assert.equal(store.state.career.treasury,0);assert.equal(store.state.pendingRace.setup.entrants[0].ru.fixtureNote.length,1100000);
});
