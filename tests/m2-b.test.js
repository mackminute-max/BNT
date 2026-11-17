import {verifyReplay} from '../src/replay/replay.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonical } from '../src/core/determinism.js';
import { createCareer,createUninitializedCareer,transact,validateState,withProvenance } from '../src/career/state.js';
import { STARTING_PACKAGES,buildPackage,assetId,initializationResult } from '../src/career/packages.js';
import { initializationEffect,assignmentEffect } from '../src/career/domain-commands.js';
import { previewRU } from '../src/career/assembly.js';
import { validateManagement, validateOwnershipGraph } from '../src/career/registries.js';
import { validateTypedRecord } from '../src/career/assets.js';
import { derive,validateRU } from '../src/model/ru.js';
import {config} from '../src/config/config.js';
import {CareerStore} from '../src/persistence/career-store.js';
import {SAVE_KEY,makeEnvelope,seal} from '../src/persistence/envelope.js';
import {createRace,capture,run,digest} from '../src/sim/race.js';
const fresh=(careerId='career')=>createUninitializedCareer({profileId:'owner',careerId});
const init=(s,packageId='traditional',id='initialize')=>({id,profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:1,type:'career.initialize',effectId:initializationEffect(s.career.id),delta:STARTING_PACKAGES[packageId].gold,reason:'Approved starting grant',packageId,catalogVersion:3,confirmed:true});
const edit=s=>({id:'edit',profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:1,type:'developer.treasury.adjust',effectId:'dev-effect',delta:1,reason:'Developer fixture'});
const initialized=(p='traditional')=>transact(fresh(),init(fresh(),p)).state;
const selection=s=>{const a=Object.values(s.management.registries.assignments)[0] ?? Object.values(buildPackage(s.career.id,'traditional').registries.assignments)[0];return {assignmentId:a.id,driverId:a.driverId,beastIds:[...a.beastIds],chariotId:a.chariotId};};
const assignment=(s,type='ru.assemble',patch={})=>({id:'command-'+s.revision,profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:1,type,effectId:assignmentEffect(s.career.id,s.revision,s.maintenanceRevision),delta:0,reason:'Assembly fixture',...(type==='ru.assemble'?selection(s):{assignmentId:selection(s).assignmentId}),...patch});
class Memory { value=null; writes=0; getItem(){return this.value;} setItem(k,v){this.value=v;this.writes++;} }
function loaded(s=fresh()){const storage=new Memory(),store=new CareerStore(storage);store.open();store.create(s);return {storage,store};}
const exactGold={traditional:1200,beastmaster:850,mechanist:800,veteran:650,scrappy:750};
for(const packageId of Object.keys(STARTING_PACKAGES)) {
 test('Draft3 '+packageId+': exact grants, native values, capacities and one assigned RU',()=>{
  const original=fresh(),before=canonical(original),tx=init(original,packageId),{state:s,receipt}=transact(original,tx),p=STARTING_PACKAGES[packageId],r=s.management.registries;
  assert.equal(canonical(original),before);assert.equal(s.career.treasury,exactGold[packageId]);assert.equal(s.revision,1);assert.equal(s.maintenanceRevision,1);assert.equal(s.career.developerEdited,false);assert.equal(s.profile.developerEdited,false);assert.deepEqual(s.provenance,[]);
  assert.equal(Object.keys(r.personnel).length,p.drivers.length);assert.equal(Object.keys(r.beasts).length,p.beasts.length);assert.equal(Object.keys(r.chariots).length,1);assert.equal(Object.keys(r.equipment).length,2);assert.equal(Object.keys(r.assignments).length,1);
  const prop=Object.values(r.properties)[0];assert.deepEqual(prop.capacities,{drivers:2,specialists:0,beasts:4,chariots:1});assert.equal(prop.packageId,packageId);assert.equal(prop.catalogVersion,3);
  assert.deepEqual(Object.values(r.personnel).map(x=>Object.values(x.attributes)),p.drivers);assert.deepEqual(Object.values(r.beasts).map(x=>Object.values(x.attributes)),p.beasts);assert.deepEqual(Object.values(Object.values(r.chariots)[0].attributes),p.chariot);
  for(const kind of ['personnel','beasts','chariots'])for(const x of Object.values(r[kind])){assert.equal(x.condition,100);assert.equal(x.xp,0);assert.equal(x.available,true);if(kind==='chariots'){assert.equal(x.status,'Functional');assert.equal(x.integrity,100);assert.equal(x.wear,0);assert.equal(x.weight,180);assert.equal(x.capacity,400);}else{assert.equal(x.injury,'Healthy');assert.equal(x.fatigue,0);if(kind==='personnel')assert.equal(x.strain,0);}}
  for(const kind of ['specialists','contracts','candidates','recruitmentOffers','marketOffers','projects','obligations','advancementChoices','achievements'])assert.deepEqual(r[kind],{});
  for(const item of Object.values(r.equipment)){assert.equal(item.mass,0);assert.equal(item.combat,0);}
  assert.equal(Object.values(r.facilities)[0].descriptiveOnly,true);assert.deepEqual(receipt.result,initializationResult('career',packageId));
  const ids=Object.values(r).flatMap(Object.keys);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(receipt.result.grantedIds,[...ids].sort());
  const a=selection(s),preview=previewRU(s,a,{assignmentId:a.assignmentId});assert.equal(preview.eligible,true);assert.equal(preview.assembled,true);validateRU(preview.native);assert.deepEqual(preview.derived,derive(preview.native,config()));assert.equal(Object.hasOwn(preview.native.chariot,'integrity'),false);assert.equal(Object.hasOwn(preview.native.driver,'id'),false);
  assert.equal(transact(s,tx).duplicate,true);assert.throws(()=>transact(s,init(s,packageId,'another')));assert.throws(()=>transact(s,{...tx,packageId:packageId==='traditional'?'scrappy':'traditional'}));
 });
}
test('Draft3: catalog literal values independently match approved tables',()=>{
 assert.deepEqual(STARTING_PACKAGES.veteran.drivers,[[80,60,60,70,80],[40,50,40,50,50]]);assert.deepEqual(STARTING_PACKAGES.scrappy.beasts,[[40,50,40,60,40,50],[50,40,40,60,40,50],[40,40,50,60,50,50]]);
 assert.deepEqual(STARTING_PACKAGES.beastmaster.beasts,[[70,60,60,70,70,60],[60,70,60,70,70,60],[50,50,60,60,60,50]]);assert.deepEqual(STARTING_PACKAGES.mechanist.chariot,[70,70,60,70,70]);assert.throws(()=>{STARTING_PACKAGES.scrappy.gold=1;});
});
test('Draft3: no implicit initialization on create, load, migration, preview or import',()=>{
 const {store,storage}=loaded(),before=storage.value;store.export();const other=new CareerStore(storage);other.open();assert.equal(storage.value,before);assert.equal(other.state.career.treasury,0);assert.equal(other.state.management.initialized,false);buildPackage('career','veteran');previewRU(other.state,{});assert.equal(storage.value,before);
 other.importSave(before,{confirmed:true});assert.equal(other.state.management.initialized,false);assert.equal(other.state.career.treasury,0);
});
test('Draft3: confirmations, identity, catalog, deltas, dual revisions and effect IDs fail without mutation',()=>{
 const {store,storage}=loaded(),original=store.state,raw=storage.value;
 for(const patch of [{confirmed:false},{confirmed:1},{packageId:'invented'},{catalogVersion:2},{delta:1199},{effectId:'attempt-based'},{profileId:'foreign'},{careerId:'foreign'},{expectedRevision:1},{expectedMaintenanceRevision:2},{commandVersion:2}]) {assert.throws(()=>store.transaction({...init(original),...patch}));assert.deepEqual(store.state,original);assert.equal(storage.value,raw);}
});
test('Draft3: active-career edits, transactions, zeroed prior balance and pending checkpoint block grant',()=>{
 let s=fresh();s=transact(s,edit(s)).state;assert.throws(()=>transact(s,init(s)),/pristine/);
 s=transact(s,{...edit(s),id:'zero-back',effectId:'zero-effect',delta:-1}).state;assert.equal(s.career.treasury,0);assert.throws(()=>transact(s,init(s)),/pristine/);
 const p=fresh();p.pendingRace={id:'pending',careerId:'career',engineVersion:'future',setup:{seed:1,entrants:[{ru:{id:'A'}}]}};p.migration.sourcePendingDigest=checksum(p.pendingRace);
 assert.throws(()=>transact(p,init(p)),/pending checkpoint/);
});
import {checksum} from '../src/core/determinism.js';
test('Draft3: other-career Owner Profile provenance does not contaminate pristine active career',()=>{
 const other=fresh('other-career'),edited=transact(other,edit(other)).state;
 const s=withProvenance(fresh(),edited.provenance,edited.history.commands);assert.equal(s.profile.developerEdited,true);assert.equal(s.career.developerEdited,false);
 const next=transact(s,init(s)).state;assert.equal(next.career.treasury,1200);assert.equal(next.career.developerEdited,false);assert.equal(next.profile.developerEdited,true);
});
test('Draft3: initialized export/import preserves every field and accepts another valid transaction',()=>{
 const {store}=loaded(initialized('scrappy')),save=JSON.stringify(store.export()),other=new CareerStore(new Memory());other.open();other.importSave(save,{confirmed:true});assert.deepEqual(other.state,store.state);other.transaction(edit(other.state));assert.equal(other.state.career.treasury,751);assert.equal(other.state.career.developerEdited,true);
});
test('Draft3: old-save restoration retains initialization tombstone; same and alternate commands cannot grant',()=>{
 const {store,storage}=loaded(),earlier=JSON.stringify(store.export()),tx=init(store.state);store.transaction(tx);store.importSave(earlier,{confirmed:true});assert.equal(store.state.management.initialized,false);assert.equal(store.state.career.treasury,0);const raw=storage.value;assert.equal(store.transaction(tx).status,'ALREADY_COMMITTED');assert.equal(store.transaction(tx).receipt,null);
 for(const p of Object.keys(STARTING_PACKAGES))assert.throws(()=>store.transaction(init(store.state,p,'alternate-'+p)),/Effect identity/);
 const reload=new CareerStore(storage);reload.open();assert.throws(()=>reload.transaction(init(reload.state,'veteran','new-click')));assert.equal(storage.value,raw);
});
test('Draft3: corrupt primary recovers pre-initialization checkpoint without second grant',()=>{
 const {store,storage}=loaded(),tx=init(store.state);store.transaction(tx);const e=store.export();e.primary.digest='00000000';storage.value=JSON.stringify(e);const reload=new CareerStore(storage);reload.open();assert.equal(reload.mode,'recovery-required');reload.recover({confirmed:true});assert.equal(reload.state.management.initialized,false);assert.equal(reload.state.career.treasury,0);assert.equal(reload.transaction(tx).status,'ALREADY_COMMITTED');assert.throws(()=>reload.transaction(init(reload.state,'scrappy','replacement')));
});
test('Draft3: mixed schema-1 recovery after initialization retains original history and prevents grant',()=>{
 const storage=new Memory(),store=new CareerStore(storage);store.open();const old=createCareer({profileId:'owner',careerId:'career'});store.create(old);store.migrateSchema({confirmed:true,profileId:'owner',careerId:'career',expectedRevision:0,expectedMaintenanceRevision:0});const migrated=store.export();store.transaction(init(store.state));const e=store.export();e.recovery=migrated.recovery;e.primary.digest='00000000';storage.value=JSON.stringify(e);const reload=new CareerStore(storage);reload.open();reload.recover({confirmed:true});assert.equal(reload.state.schema,2);assert.equal(reload.state.career.treasury,0);assert.throws(()=>reload.transaction(init(reload.state,'traditional','second')));
});
test('Draft3: failed atomic publish preserves original bytes, state, protected history and all assets',()=>{
 const {store,storage}=loaded(),raw=storage.value,before=store.state,history=structuredClone(store.protectedHistory),tx=init(before);storage.setItem=()=>{throw Error('Quota');};assert.throws(()=>store.transaction(tx),/rolled back/);assert.equal(storage.value,raw);assert.deepEqual(store.state,before);assert.deepEqual(store.protectedHistory,history);assert.equal(store.mode,'manual');assert.throws(()=>store.transaction(tx),/checkpoint/);store.acknowledgeExport(store.export().primary.digest);store.transaction(tx);assert.equal(store.state.career.treasury,1200);assert.equal(store.requiresCheckpoint,true);assert.equal(storage.value,raw);
});
test('M2-B: failed import and corrupted receipt or asset never replace a loaded career',()=>{
 const {store,storage}=loaded(initialized()),raw=storage.value,before=store.state;
 for(const mutate of [s=>s.career.treasury++,s=>s.transactions[0].result.grantedIds.pop(),s=>Object.values(s.management.registries.beasts)[0].attributes.speed=101,s=>Object.values(s.management.registries.personnel)[0].ownerCareerId='foreign',s=>Object.values(s.management.registries.chariots)[0].references.equipment=['absent'],s=>s.history.commands[0].result.treasuryGrant++]){
 const e=store.export();mutate(e.primary.value);e.primary=seal(e.primary.value);assert.throws(()=>store.importSave(JSON.stringify(e),{confirmed:true}));assert.equal(storage.value,raw);assert.deepEqual(store.state,before);}
});
test('M2-B: graph rejects bad references, reciprocity, wrong types and exclusive overlaps',()=>{
 const s=initialized(),original=s.management;
 for(const mutate of [m=>Object.values(m.registries.beasts)[0].ownerCareerId='other',m=>Object.values(m.registries.equipment)[0].references.installedOn=[],m=>Object.values(m.registries.facilities)[0].references.property=[],m=>Object.values(m.registries.chariots)[0].references.equipment=[Object.keys(m.registries.personnel)[0]],m=>Object.values(m.registries.beasts)[0].references.assignment=[],m=>{const a=Object.values(m.registries.assignments)[0];m.registries.assignments.second={...structuredClone(a),id:'second'};}]){const m=structuredClone(original);mutate(m);assert.throws(()=>validateManagement(m,'career','owner'));}
});
test('M2-B: typed validators reject invalid ranges, enums, capacity and unapproved effects',()=>{
 const s=initialized(),r=s.management.registries;
 for(const [kind,change] of [['personnel',x=>x.attributes.driving='50'],['beasts',x=>x.injury='Invented'],['chariots',x=>x.weight=0],['chariots',x=>x.status='Destroyed'],['equipment',x=>x.mass=1],['equipment',x=>x.combat=1],['facilities',x=>x.descriptiveOnly=false],['properties',x=>x.capacities.beasts=5]]) {const a=structuredClone(Object.values(r[kind])[0]);change(a);assert.throws(()=>validateTypedRecord(kind,a));}
 const m=structuredClone(s.management);const base=Object.values(m.registries.beasts)[0];for(let i=0;i<3;i++)m.registries.beasts['extra-'+i]={...structuredClone(base),id:'extra-'+i,references:{}};assert.throws(()=>validateManagement(m,'career','owner'),/capacity/);
});
test('M2-B: prospective assembly rejects missing/foreign/duplicate/unavailable and exclusive conflicts',()=>{
 const s=initialized(),a=selection(s);
 assert.equal(previewRU(s,{...a,beastIds:[a.beastIds[0],a.beastIds[0]]},{assignmentId:a.assignmentId}).eligible,false);
 assert.equal(previewRU(s,{...a,driverId:'missing'},{assignmentId:a.assignmentId}).eligible,false);
 assert.equal(previewRU(s,a).eligible,false);
 for(const change of [x=>x.available=false,x=>x.injury='Severe',x=>x.injury='Dead',x=>x.ownerCareerId='foreign',x=>x.condition=0]){const copy=structuredClone(s);change(copy.management.registries.personnel[a.driverId]);const p=previewRU(copy,a,{assignmentId:a.assignmentId});assert.equal(p.assembled,true);assert.equal(p.eligible,false);}
 for(const injury of ['Healthy','Minor','Moderate']){const copy=structuredClone(s);copy.management.registries.personnel[a.driverId].injury=injury;assert.equal(previewRU(copy,a,{assignmentId:a.assignmentId}).eligible,true);}
});
test('M2-B: preview is pure, deterministic, immutable and keeps management fatigue distinct',()=>{
 const s=initialized(),a=selection(s),before=canonical(s),p=previewRU(s,a,{assignmentId:a.assignmentId});assert.equal(canonical(s),before);assert.deepEqual(p,previewRU(s,a,{assignmentId:a.assignmentId}));assert.throws(()=>{p.native.beasts[0].speed=1;});const copy=structuredClone(s);copy.management.registries.personnel[a.driverId].fatigue=99;const q=previewRU(copy,a,{assignmentId:a.assignmentId});assert.equal(q.native.driver.strain,0);assert.deepEqual(q.derived,p.derived);assert.match(q.label,/no weather/);
});
test('M2-B: reassembly with reserves and disassembly are atomic idempotent and roundtrip',()=>{
 const {store,storage}=loaded(initialized('scrappy')),original=store.state,a=selection(original),r=original.management.registries;
 const tx=assignment(original,'ru.assemble',{driverId:Object.keys(r.personnel)[1],beastIds:[a.beastIds[0],Object.keys(r.beasts)[2]]});store.transaction(tx);assert.equal(store.state.career.treasury,750);assert.equal(store.state.revision,2);assert.equal(store.state.maintenanceRevision,1);assert.equal(store.state.career.developerEdited,false);const raw=storage.value;assert.equal(store.transaction(tx).duplicate,true);assert.equal(storage.value,raw);
 const reload=new CareerStore(storage);reload.open();assert.deepEqual(reload.state,store.state);const dis=assignment(store.state,'ru.disassemble');store.transaction(dis);assert.deepEqual(store.state.management.registries.assignments,{});assert.equal(store.transaction(dis).duplicate,true);const next=assignment(store.state,'ru.assemble',{...a,id:'reassemble'});store.transaction(next);assert.equal(Object.keys(store.state.management.registries.assignments).length,1);
});
test('M2-B: stale/reused assignment effects and invalid selection preserve loaded bytes',()=>{
 const {store,storage}=loaded(initialized());const s=store.state,raw=storage.value;
 for(const patch of [{expectedRevision:0},{expectedMaintenanceRevision:0},{effectId:'random-effect'},{driverId:'foreign'},{beastIds:[selection(s).beastIds[0],selection(s).beastIds[0]]},{delta:1}])assert.throws(()=>store.transaction(assignment(s,'ru.assemble',patch)));
 assert.equal(storage.value,raw);const tx=assignment(s);store.transaction(tx);assert.throws(()=>store.transaction({...assignment(store.state),effectId:tx.effectId}),/Effect identity/);
});
test('M2-B: public stored state and receipt results are isolated immutable snapshots',()=>{
 const {store}=loaded(initialized());assert.throws(()=>{Object.values(store.state.management.registries.beasts)[0].attributes.speed=1;});assert.throws(()=>{store.state.transactions[0].result.grantedIds.pop();});const tx=assignment(store.state);const result=store.transaction(tx);result.receipt.result.assignmentId='external';assert.notEqual(store.state.transactions.at(-1).result.assignmentId,'external');
});
test('Draft3: no later-stage actions or hidden grants are enabled',()=>{
 const s=initialized();for(const type of ['asset.purchase','asset.sell','management.cycle','legacy.award','race.reward','championship.enter','asset.repair','asset.treat','training.start'])assert.throws(()=>transact(s,{...edit(s),type}));
});
test('Draft3: deterministic racing, replay and RNG remain independent of stable operations',()=>{
 const race=createRace({seed:882,overrides:{laps:1},driverMode:'reference'}),before=capture(race);const {store}=loaded();store.transaction(init(store.state));store.transaction(assignment(store.state));store.export();assert.deepEqual(capture(race),before);run(race);assert.equal(verifyReplay(capture(race)).checksum,digest(race));const again=createRace({seed:882,overrides:{laps:1},driverMode:'reference'});run(again);assert.equal(digest(race),digest(again));
});

// A restored timeline is not a retry: the maintenance token gives a later operation its own effect slot.
test('M2-B: restored initialized save permits legitimate reassembly but retains exact old command identity',()=>{
 const {store}=loaded(initialized('scrappy')),earlier=JSON.stringify(store.export()),tx=assignment(store.state);
 store.transaction(tx);store.importSave(earlier,{confirmed:true});assert.equal(store.transaction(tx).status,'ALREADY_COMMITTED');
 const next=assignment(store.state,'ru.assemble',{id:'after-import'});assert.notEqual(next.effectId,tx.effectId);store.transaction(next);assert.equal(store.state.revision,2);assert.equal(store.state.history.commands.length,3);
});
test('M2-B: a failed initialization does not leak a protected fact through create or reload',()=>{
 const {store,storage}=loaded(),raw=storage.value;storage.setItem=()=>{throw Error('Denied');};assert.throws(()=>store.transaction(init(store.state)));
 const reload=new CareerStore(storage);reload.open();assert.equal(reload.state.history.commands.length,0);assert.equal(storage.value,raw);
 reload.storage.setItem=Memory.prototype.setItem.bind(storage);reload.transaction(init(reload.state));assert.equal(reload.state.career.treasury,1200);
});

test('M2-B: retained other-career edits in the real store allow a different pristine career',()=>{
 const {store}=loaded(fresh('other-career'));store.transaction(edit(store.state));
 store.create(fresh(),{confirmed:true});assert.equal(store.state.profile.developerEdited,true);assert.equal(store.state.career.developerEdited,false);
 store.transaction(init(store.state));assert.equal(store.state.career.treasury,1200);assert.equal(store.state.career.developerEdited,false);
});
