import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createCareer,transact,validateState} from '../src/career/state.js';
import {SAVE_KEY,seal,makeEnvelope,parseEnvelope,inspectEnvelope} from '../src/persistence/envelope.js';
import {CareerStore} from '../src/persistence/career-store.js';
import {configuration} from '../src/dev/configuration.js';
import {VERSION} from '../src/config/config.js';
import {createRace,capture} from '../src/sim/race.js';
const fresh=()=>createCareer({profileId:'profile-1',careerId:'career-1'});
const tx=(revision=0,delta=100,id='tx-1')=>({id,profileId:'profile-1',careerId:'career-1',expectedRevision:revision,type:'developer.treasury.adjust',delta,reason:'Regression fixture'});
class MemoryStorage { constructor(){this.map=new Map();this.denied=false;this.writes=0;}getItem(k){if(this.denied)throw Error('Denied');return this.map.get(k)??null;}setItem(k,v){if(this.denied)throw Error('Quota exceeded');this.map.set(k,v);this.writes++;} }
function loaded(){const storage=new MemoryStorage(),store=new CareerStore(storage);store.open();store.create(fresh());return {storage,store};}

test('Persistence: complete profile/career export/import preserves every field and ID and accepts another transaction',()=>{
 const {store}=loaded();store.transaction(tx());const envelope=store.export(),other=new CareerStore(new MemoryStorage());other.open();other.importSave(JSON.stringify(envelope),{confirmed:true});assert.deepEqual(other.export(),envelope);other.transaction(tx(1,50,'tx-2'));assert.equal(other.state.career.treasury,150);assert.equal(other.state.revision,2);
});
test('Persistence: reload preserves duplicate receipt and rejects conflicting transaction ID before revision evaluation',()=>{
 const {storage,store}=loaded();store.transaction(tx());const reloaded=new CareerStore(storage);reloaded.open();const writes=storage.writes;assert.equal(reloaded.transaction(tx()).duplicate,true);assert.equal(storage.writes,writes);assert.equal(reloaded.state.career.treasury,100);assert.throws(()=>reloaded.transaction(tx(0,101)),/Conflicting/);assert.equal(reloaded.state.revision,1);
});
test('Persistence: stale revision and foreign entity transaction leave save and state unchanged',()=>{
 const {store,storage}=loaded();store.transaction(tx());const before=store.state,raw=storage.getItem(SAVE_KEY);for(const bad of [tx(0,10,'tx-2'),{...tx(1,10,'tx-2'),careerId:'other'},{...tx(1,10,'tx-2'),profileId:'other'}])assert.throws(()=>store.transaction(bad));assert.deepEqual(store.state,before);assert.equal(storage.getItem(SAVE_KEY),raw);
});
test('Persistence: unsafe, fractional, NaN, negative resulting treasury and overflow edits roll back',()=>{
 const {store,storage}=loaded();for(const delta of [-1,0.1,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>store.transaction(tx(0,delta)));assert.equal(store.state.revision,0);assert.equal(storage.writes,1);store.transaction(tx(0,Number.MAX_SAFE_INTEGER));assert.throws(()=>store.transaction(tx(1,1,'tx-2')));assert.equal(store.state.career.treasury,Number.MAX_SAFE_INTEGER);
});
test('Persistence: developer provenance is sticky, detailed and exported through reload/import',()=>{
 const {store,storage}=loaded();store.transaction(tx());const s=store.state;assert.equal(s.profile.developerEdited,true);assert.equal(s.career.developerEdited,true);assert.deepEqual(s.provenance[0],{id:'tx-1',profileId:'profile-1',careerId:'career-1',type:'developer.treasury.adjust',delta:100,reason:'Regression fixture',revision:1});const other=new CareerStore(storage);other.open();assert.deepEqual(other.state,s);
});
test('Persistence: invalid imports never alter loaded state, storage, mode or provenance',()=>{
 const {store,storage}=loaded();store.transaction(tx());const before=store.state,raw=storage.getItem(SAVE_KEY);for(const bad of ['{bad',JSON.stringify(configuration({})),JSON.stringify({kind:'BNT-replay'}),JSON.stringify({...store.export(),schema:999})])assert.throws(()=>store.importSave(bad,{confirmed:true}));assert.deepEqual(store.state,before);assert.equal(storage.getItem(SAVE_KEY),raw);assert.equal(store.mode,'automatic');
});
test('Persistence: replacement requires explicit confirmation, preserves loaded career on cancel and does not merge Legacy',()=>{
 const {store}=loaded();const incoming=makeEnvelope(createCareer({profileId:'profile-2',careerId:'career-2'})).text;assert.throws(()=>store.importSave(incoming),/Confirm/);assert.equal(store.state.profile.id,'profile-1');store.importSave(incoming,{confirmed:true});assert.equal(store.state.profile.id,'profile-2');assert.deepEqual(store.state.profile.legacy,{records:[]});const bad=store.state;bad.profile.legacy.records.push({careerId:'invented'});assert.throws(()=>validateState(bad),/Legacy/);
});
test('Persistence: import of older same-identity save cannot clear marks or reuse a lost transaction ID',()=>{
 const {store}=loaded();const pristine=JSON.stringify(store.export());store.transaction(tx());store.importSave(pristine,{confirmed:true});assert.equal(store.state.revision,0);assert.equal(store.state.career.treasury,0);assert.equal(store.state.career.developerEdited,true);assert.throws(()=>store.transaction(tx()),/previous imported/);store.transaction(tx(0,25,'tx-new'));assert.equal(store.state.career.treasury,25);
});
test('Persistence: corrupt primary offers valid previous checkpoint without writes, confirmation required, marks survive recovery',()=>{
 const {store,storage}=loaded();store.transaction(tx());const raw=JSON.parse(storage.getItem(SAVE_KEY));raw.primary.value.career.treasury=999;const corrupt=JSON.stringify(raw);storage.setItem(SAVE_KEY,corrupt);const writes=storage.writes,reload=new CareerStore(storage);reload.open();assert.equal(reload.mode,'recovery-required');assert.equal(reload.state,null);assert.equal(storage.writes,writes);assert.equal(storage.getItem(SAVE_KEY),corrupt);assert.throws(()=>reload.recover(),/confirmation/);reload.recover({confirmed:true});assert.equal(reload.state.career.treasury,0);assert.equal(reload.state.revision,0);assert.equal(reload.state.transactions.length,0);assert.equal(reload.state.career.developerEdited,true);assert.equal(reload.quarantine,corrupt);assert.equal(parseEnvelope(storage.getItem(SAVE_KEY)).primary.career.treasury,0);
});
test('Persistence: unreadable envelope, corrupt guard, both corrupt or future schema blocks automatic writes',()=>{
 for(const corrupt of ['{broken',JSON.stringify({...makeEnvelope(fresh()).envelope,schema:2}),(()=>{const e=makeEnvelope(fresh()).envelope;e.provenance.digest='00000000';return JSON.stringify(e);})()]){const storage=new MemoryStorage();storage.setItem(SAVE_KEY,corrupt);const s=new CareerStore(storage);s.open();assert.equal(s.mode,'blocked');assert.equal(s.state,null);assert.equal(storage.getItem(SAVE_KEY),corrupt);assert.throws(()=>s.recover({confirmed:true}));assert.throws(()=>s.create(fresh()),/Confirm/);}
});
test('Persistence: denied storage starts manual mode, gates changes behind export and explicit acknowledgement',()=>{
 const storage=new MemoryStorage();storage.denied=true;const s=new CareerStore(storage);s.open();assert.equal(s.mode,'manual');s.create(fresh());assert.equal(s.requiresCheckpoint,true);assert.throws(()=>s.transaction(tx()),/checkpoint/);assert.throws(()=>s.acknowledgeExport('not-exported'));const exported=s.export();assert.equal(s.requiresCheckpoint,true);s.acknowledgeExport(exported.primary.digest);s.transaction(tx());assert.equal(s.state.career.treasury,100);assert.equal(s.requiresCheckpoint,true);assert.throws(()=>s.acknowledgeExport(exported.primary.digest));
});
test('Persistence: failed automatic write rolls back transaction, switches to manual and retry applies once',()=>{
 const {store,storage}=loaded(),before=store.state;storage.denied=true;assert.throws(()=>store.transaction(tx()),/rolled back/);assert.deepEqual(store.state,before);assert.equal(store.mode,'manual');store.acknowledgeExport(store.export().primary.digest);store.transaction(tx());assert.equal(store.state.career.treasury,100);assert.equal(store.transaction(tx()).duplicate,true);
});
test('Persistence: setItem quota failure and failed import replacement leave previous state and raw bytes intact',()=>{
 const {store,storage}=loaded(),raw=storage.getItem(SAVE_KEY),before=store.state;storage.setItem=()=>{throw Error('Quota');};const other=makeEnvelope(createCareer({profileId:'profile-2',careerId:'career-2'})).text;assert.throws(()=>store.importSave(other,{confirmed:true}),/rolled back/);assert.deepEqual(store.state,before);assert.equal(storage.getItem(SAVE_KEY),raw);assert.equal(store.mode,'manual');
});
test('Persistence: concurrent store detects stale browser bytes without falling back to manual or overwriting',()=>{
 const {store,storage}=loaded(),other=new CareerStore(storage);other.open();store.transaction(tx());const raw=storage.getItem(SAVE_KEY);assert.throws(()=>other.transaction(tx(0,50,'tx-other')),/another window/);assert.equal(other.state.career.treasury,0);assert.equal(other.mode,'automatic');assert.equal(storage.getItem(SAVE_KEY),raw);
});
test('Persistence: sealed-but-inconsistent financial, receipt, provenance and ownership fields are rejected',()=>{
 for(const change of [s=>s.career.treasury=2,s=>s.career.ownerProfileId='absent',s=>s.profile.developerEdited=true,s=>s.revision=1,s=>s.unknown=1,s=>s.career.status='Championship']){const s=fresh();change(s);assert.throws(()=>makeEnvelope(s));}
 const {store}=loaded();store.transaction(tx());for(const change of [s=>s.transactions[0].balanceAfter++,s=>s.transactions[0].transaction.expectedRevision++,s=>s.provenance[0].profileId='missing',s=>s.transactions.push(s.transactions[0])]){const s=store.state;change(s);assert.throws(()=>makeEnvelope(s));}
});
test('Persistence: pending checkpoint preserves complete normalized race data and rejects missing/defaulted inputs or incompatible references',()=>{
 const setup=configuration({course:'C01',seed:44,format:'Combat'}).setup,pendingRace={id:'race-1',careerId:'career-1',engineVersion:VERSION,setup};const s=createCareer({profileId:'profile-1',careerId:'career-1',pendingRace});assert.deepEqual(parseEnvelope(makeEnvelope(s).text).primary.pendingRace,pendingRace);for(const change of [s=>s.pendingRace.careerId='missing',s=>s.pendingRace.engineVersion='old',s=>delete s.pendingRace.setup.entrants]){const bad=structuredClone(s);change(bad);assert.throws(()=>validateState(bad));}
});
test('Persistence: corrupt or wrong-type recovery in external file is rejected and input objects/returned state never alias the store',()=>{
 const {store}=loaded();store.transaction(tx());const e=store.export();e.recovery.value.kind='BNT-configuration';assert.throws(()=>store.importSave(JSON.stringify(e),{confirmed:true}));const returned=store.state;returned.career.treasury=999;assert.equal(store.state.career.treasury,100);const output=store.export();output.primary.value.career.name='mutated';assert.notEqual(store.state.career.name,'mutated');
});
test('Persistence: unsupported transactions and altered duplicate provenance are rejected; no speculative recovery action is supported',()=>{
 const s=fresh();for(const type of ['recovery.reward','race.reward','legacy.merge','asset.edit'])assert.throws(()=>transact(s,{...tx(),type}));const {store}=loaded();store.transaction(tx());const incoming=store.export();incoming.provenance.value[0].reason='conflict';incoming.provenance=seal(incoming.provenance.value);assert.throws(()=>store.importSave(JSON.stringify(incoming),{confirmed:true}));
});
test('Persistence: persistence operations cannot change an independent race capture or consume its RNG',()=>{
 const race=createRace(),before=capture(race),{store}=loaded();store.transaction(tx());const other=new CareerStore(new MemoryStorage());other.open();other.importSave(JSON.stringify(store.export()),{confirmed:true});assert.deepEqual(capture(race),before);
});

test('Persistence: profile developer provenance survives importing a different career for the same owner without merging Legacy',()=>{
 const {store}=loaded();store.transaction(tx());const imported=makeEnvelope(createCareer({profileId:'profile-1',careerId:'career-new'})).text;store.importSave(imported,{confirmed:true});assert.equal(store.state.profile.developerEdited,true);assert.equal(store.state.career.developerEdited,false);assert.equal(store.state.provenance[0].careerId,'career-1');assert.deepEqual(store.state.profile.legacy,{records:[]});const other=makeEnvelope(createCareer({profileId:'profile-other',careerId:'career-1'})).text;assert.throws(()=>store.importSave(other,{confirmed:true}),/different Owner/);
});

test('Persistence: denied write during explicit recovery rolls back and permits a manual recovery retry',()=>{
 const {store,storage}=loaded();store.transaction(tx());const e=JSON.parse(storage.getItem(SAVE_KEY));e.primary.digest='00000000';storage.setItem(SAVE_KEY,JSON.stringify(e));const next=new CareerStore(storage);next.open();storage.setItem=()=>{throw Error('Quota');};assert.throws(()=>next.recover({confirmed:true}),/rolled back/);assert.equal(next.state,null);assert.equal(next.mode,'manual');assert.equal(next.recoveryPending,true);next.recover({confirmed:true});assert.equal(next.state.career.treasury,0);assert.equal(next.state.career.developerEdited,true);assert.equal(next.requiresCheckpoint,true);assert.equal(next.recoveryPending,false);
});
test('Persistence: individually valid conflicting imported transaction histories cannot replace a loaded save',()=>{
 const {store,storage}=loaded();store.transaction(tx());const alternate=transact(fresh(),{...tx(),reason:'Conflicting history'}).state,raw=storage.getItem(SAVE_KEY),before=store.state;assert.throws(()=>store.importSave(makeEnvelope(alternate).text,{confirmed:true}),/Conflicting/);assert.deepEqual(store.state,before);assert.equal(storage.getItem(SAVE_KEY),raw);
});
test('Persistence: oversized input and unknown state fields fail without replacing a loaded career',()=>{
 const {store,storage}=loaded(),before=store.state,raw=storage.getItem(SAVE_KEY);assert.throws(()=>store.importSave(' '.repeat(2*1024*1024+1),{confirmed:true}),/oversized/);const invalid=fresh();invalid.career.assets=[];assert.throws(()=>makeEnvelope(invalid),/fields/);assert.deepEqual(store.state,before);assert.equal(storage.getItem(SAVE_KEY),raw);
});

test('Persistence: valid primary with damaged backup remains exportable without silently overwriting corruption',()=>{
 const {store,storage}=loaded();store.transaction(tx());const envelope=store.export();envelope.recovery.digest='00000000';const raw=JSON.stringify(envelope);storage.setItem(SAVE_KEY,raw);const next=new CareerStore(storage);next.open();assert.equal(next.mode,'blocked');assert.equal(next.state.career.treasury,100);assert.equal(next.export().primary.value.career.treasury,100);assert.equal(storage.getItem(SAVE_KEY),raw);assert.throws(()=>next.transaction(tx(1,2,'tx-2')),/corrupt save/);
});
test('Persistence: truthy nonboolean confirmations cannot replace or recover a save',()=>{
 const {store}=loaded(),incoming=makeEnvelope(fresh()).text;assert.throws(()=>store.importSave(incoming,{confirmed:'yes'}),/Confirm/);assert.throws(()=>store.create(fresh(),{confirmed:'yes'}),/Confirm/);
});
