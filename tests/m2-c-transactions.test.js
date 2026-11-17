import {test} from 'node:test';import assert from 'node:assert/strict';
import {canonical} from '../src/core/determinism.js';
import {validateState,transact} from '../src/career/state.js';
import {STARTING_PACKAGES} from '../src/career/packages.js';
import {CareerStore} from '../src/persistence/career-store.js';
import {makeEnvelope,parseEnvelope,seal,MAX_IMPORT_BYTES} from '../src/persistence/envelope.js';
import {quoteEconomy,previewRU3,executeEconomy} from '../src/career/economy/reducers.js';
import {UPGRADES,TERMS} from '../src/career/economy/catalog.js';
import {addContract} from '../src/career/economy/records.js';
import {protectMaintenance} from '../src/career/economy/maintenance-history.js';
import {starter,load,migrated,migrationRequest,economicCommand,commit,fund,buyUpgrade,propertyId,assemblyCommand,Memory} from './m2-c-helpers.js';
const wages={traditional:[35],beastmaster:[35],mechanist:[35],veteran:[60,35],scrappy:[35,20]};
for(const packageId of Object.keys(STARTING_PACKAGES))test('M2-C migration '+packageId+': exact source preservation, wages, basis, one maintenance increment and market',()=>{
 const original=starter(packageId),{store,storage}=load(original),oldBytes=storage.value,plan=store.previewEconomy();assert.equal(storage.value,oldBytes);assert.deepEqual(plan,store.previewEconomy());const request=migrationRequest(original,plan),result=store.migrateEconomy(request),s=store.state;
 assert.equal(s.schema,3);assert.equal(s.revision,original.revision);assert.deepEqual(s.transactions,original.transactions);assert.equal(s.maintenanceRevision,original.maintenanceRevision+1);assert.equal(s.career.treasury,original.career.treasury);assert.equal(s.career.developerEdited,false);assert.deepEqual(store.export().recovery.value,original);assert.equal(Object.keys(s.management.registries.marketOffers).length,23);
 const r=s.management.registries;assert.deepEqual(Object.values(r.contracts).map(c=>c.wage),wages[packageId]);for(const c of Object.values(r.contracts)){assert.equal(c.term,'standard');assert.equal(c.cyclesRemaining,8);assert.equal(c.grandfathered,true);}
 for(const [kind,records] of Object.entries(original.management.registries).filter(([kind])=>['personnel','beasts','chariots','equipment'].includes(kind)))for(const [key,a] of Object.entries(records)){const b=r[kind][key];assert.equal(a.name,b.name);if(a.attributes)assert.deepEqual(a.attributes,b.attributes);assert.equal(a.ownerCareerId,b.ownerCareerId);if(kind==='equipment'){assert.equal(b.economics.tier,'Budget');assert.equal(b.economics.acquisitionBasis,100);assert.deepEqual(b.references,a.references);}}
 assert.equal(result.acknowledgment.revision,original.revision);const raw=storage.value,writes=storage.writes;assert.equal(store.migrateEconomy(request).duplicate,true);assert.equal(storage.value,raw);assert.equal(storage.writes,writes);assert.throws(()=>store.migrateEconomy({...request,id:'alias'}),/already protected/);
});
test('M2-C persistent migration rejects stale canonical preview, both revisions, missing assets and malformed legacy injury',()=>{
 const {store,storage}=load(),plan=store.previewEconomy(),request=migrationRequest(store.state,plan),raw=storage.value;
 for(const patch of [{expectedRevision:0},{expectedMaintenanceRevision:2},{sourceFingerprint:'0'.repeat(64)},{confirmed:false},{migrationVersion:'v2'}]){assert.throws(()=>store.migrateEconomy({...request,...patch}));assert.equal(storage.value,raw);}
 const empty=load(createUninitializedCareer({profileId:'owner',careerId:'empty'}));assert.throws(()=>empty.store.previewEconomy(),/Initialized/);

 const bad=structuredClone(store.state);Object.values(bad.management.registries.personnel)[0].injury='Moderate';assert.throws(()=>makeEnvelope(bad));
});
import {createUninitializedCareer} from '../src/career/state.js';
test('M2-C exact roundtrip retains all fields and accepts a subsequent command v2 beside v1',()=>{
 const {store}=migrated(),save=JSON.stringify(store.export()),other=new CareerStore(new Memory());other.open();other.importSave(save,{confirmed:true});assert.deepEqual(other.state,store.state);const q=commit(other,'facility.purchase',{propertyId:propertyId(other.state),upgradeId:'staff-quarters'});assert.equal(other.state.career.treasury,900);assert.equal(q.receipt.transaction.commandVersion,2);fund(other,10);assert.equal(other.state.career.treasury,910);assert.equal(other.state.career.developerEdited,true);assert.equal(other.state.transactions.at(-1).transaction.commandVersion,1);validateState(other.state);
});
test('M2-C exact canonical retry returns original receipt; conflicting payload, IDs and effects never duplicate',()=>{
 const {store,storage}=migrated(),{command,receipt}=buyUpgrade(store,'staff-quarters'),raw=storage.value,writes=storage.writes;
 const duplicate=store.transaction(JSON.parse(JSON.stringify(command)));assert.equal(duplicate.duplicate,true);assert.deepEqual(duplicate.receipt,receipt);assert.equal(storage.value,raw);assert.equal(storage.writes,writes);
 for(const change of [{delta:0},{id:'alias'},{payload:{...command.payload,upgradeId:'workshop'}},{profileId:'foreign'}])assert.throws(()=>store.transaction({...command,...change}));assert.equal(storage.value,raw);
});
test('M2-C separate business operations have distinct effect IDs even at the same revision',()=>{
 const {store}=migrated(),s=store.state,property=propertyId(s),a=economicCommand(s,'facility.purchase',{propertyId:property,upgradeId:'staff-quarters'}),b=economicCommand(s,'facility.purchase',{propertyId:property,upgradeId:'workshop'});assert.notEqual(a.effectId,b.effectId);store.transaction(a);assert.throws(()=>store.transaction(b),/Stale/);
});
test('M2-C failed gameplay publish rolls back all state, offers, Gold and protected facts then manual retry is explicit',()=>{
 const {store,storage}=migrated(),before=store.state,raw=storage.value,history=structuredClone(store.protectedHistory),offer=Object.values(before.management.registries.marketOffers).find(o=>o.category==='equipment'),command=economicCommand(before,'market.acquire',{offerId:offer.id,term:null});
 storage.setItem=()=>{throw Error('Quota');};assert.throws(()=>store.transaction(command),/rolled back/);assert.equal(storage.value,raw);assert.deepEqual(store.state,before);assert.deepEqual(store.protectedHistory,history);assert.throws(()=>store.transaction(command),/checkpoint/);store.acknowledgeExport(store.export().primary.digest);store.transaction(command);assert.equal(store.state.management.registries.marketOffers[offer.id].available,false);assert.equal(store.requiresCheckpoint,true);assert.equal(storage.value,raw);
});
test('M2-C failed migration publication retains original valid schema-2 bytes and manual retry migrates once',()=>{
 const {store,storage}=load(),before=store.state,raw=storage.value,request=migrationRequest(before,store.previewEconomy());storage.setItem=()=>{throw Error('Quota');};assert.throws(()=>store.migrateEconomy(request),/rolled back/);assert.deepEqual(store.state,before);assert.equal(storage.value,raw);assert.equal(store.protectedHistory.some(e=>e.kind==='migration-maintenance'),false);assert.throws(()=>store.migrateEconomy(request),/checkpoint/);store.acknowledgeExport(store.export().primary.digest);store.migrateEconomy(request);assert.equal(store.state.schema,3);assert.equal(store.state.maintenanceRevision,2);
});
test('M2-C restoring pre-migration save preserves migration fact and blocks regeneration under new fingerprint',()=>{
 const {store,storage}=load(),old=JSON.stringify(store.export()),request=migrationRequest(store.state,store.previewEconomy());store.migrateEconomy(request);store.importSave(old,{confirmed:true});assert.equal(store.state.schema,2);assert.equal(store.state.maintenanceRevision,3);assert.equal(store.state.history.commands.some(e=>e.kind==='migration-maintenance'),false);assert.equal(store.migrateEconomy(request).status,'ALREADY_COMMITTED');assert.throws(()=>store.previewEconomy(),/retained timeline/);const raw=storage.value;assert.throws(()=>store.migrateEconomy({...request,id:'new',expectedMaintenanceRevision:3}),/already protected/);assert.equal(storage.value,raw);
});
test('M2-C older schema-3 restore retains purchased business effect; no offer can be purchased twice',()=>{
 const {store,storage}=migrated(),old=JSON.stringify(store.export()),offer=Object.values(store.state.management.registries.marketOffers).find(o=>o.category==='equipment'),{command}=commit(store,'market.acquire',{offerId:offer.id,term:null});store.importSave(old,{confirmed:true});assert.equal(store.state.management.registries.marketOffers[offer.id].available,false);assert.equal(store.transaction(command).receipt,null);assert.equal(store.transaction(command).status,'ALREADY_COMMITTED');const raw=storage.value;assert.throws(()=>store.transaction({...command,id:'alias'}),/Effect identity/);assert.throws(()=>quoteEconomy(store.state,'market.acquire',command.payload),/(unavailable|retained history)/);assert.equal(storage.value,raw);
});
test('M2-C metadata, price, ledger, native stats and forged receipt imports are rejected without replacement',()=>{
 const {store,storage}=migrated();buyUpgrade(store,'staff-quarters');const raw=storage.value,before=store.state;
 for(const mutate of [s=>s.career.treasury++,s=>Object.values(s.management.registries.marketOffers)[0].price=1,s=>Object.values(s.management.registries.equipment)[0].economics.acquisitionBasis=1000,s=>Object.values(s.management.registries.chariots)[0].attributes.stability++,s=>Object.values(s.management.registries.personnel)[0].xp=100,s=>s.transactions.at(-1).result.cost=0,s=>s.economy.manifestDigest='0'.repeat(64)]){
 const e=store.export();mutate(e.primary.value);e.primary=seal(e.primary.value);assert.throws(()=>store.importSave(JSON.stringify(e),{confirmed:true}));assert.equal(storage.value,raw);assert.deepEqual(store.state,before);}
});
test('M2-C state snapshots and migration plans are immutable; no storage writes during quote/preview',()=>{
 const {store,storage}=load(),raw=storage.value,plan=store.previewEconomy();assert.throws(()=>{plan.manifest.treasury=1;});assert.equal(storage.value,raw);store.migrateEconomy(migrationRequest(store.state,plan));assert.throws(()=>{Object.values(store.state.management.registries.marketOffers)[0].price=1;});const after=storage.value;quoteEconomy(store.state,'facility.purchase',{propertyId:propertyId(store.state),upgradeId:'staff-quarters'});assert.equal(storage.value,after);
});
test('M2-C acquisition enforces capacities, consumes one offer and provides persistent employment terms',()=>{
 const {store}=migrated();fund(store);const r=store.state.management.registries,specialist=Object.values(r.marketOffers).find(o=>o.category==='specialist');assert.throws(()=>economicCommand(store.state,'market.acquire',{offerId:specialist.id,term:'short'}),/Staff Quarters/);buyUpgrade(store,'staff-quarters');const result=commit(store,'market.acquire',{offerId:specialist.id,term:'long'}),person=store.state.management.registries.specialists[result.receipt.result.details.assetId],contract=store.state.management.registries.contracts[person.references.contract[0]];assert.equal(contract.term,'long');assert.equal(contract.cyclesRemaining,16);assert.equal(result.receipt.result.details.signingSurcharge,125);assert.equal(store.state.management.registries.marketOffers[specialist.id].available,false);assert.throws(()=>economicCommand(store.state,'market.acquire',{offerId:specialist.id,term:'long'}),/unavailable/);
 const drivers=Object.values(store.state.management.registries.marketOffers).filter(o=>o.category==='driver');commit(store,'market.acquire',{offerId:drivers[0].id,term:'short'});assert.throws(()=>economicCommand(store.state,'market.acquire',{offerId:drivers[1].id,term:'short'}),/Capacity/);
});
test('M2-C explicit detach updates both references; installed sale and assigned chariot sale reject',()=>{
 const {store}=migrated(),r=store.state.management.registries,item=Object.values(r.equipment)[0],chariot=Object.values(r.chariots)[0];assert.throws(()=>economicCommand(store.state,'asset.sell',{assetId:item.id}),/EQUIPMENT_INSTALLED/);assert.throws(()=>economicCommand(store.state,'asset.sell',{assetId:chariot.id}),/assigned/);
 commit(store,'equipment.detach',{equipmentId:item.id});assert.deepEqual(store.state.management.registries.equipment[item.id].references.installedOn,[]);assert.equal(store.state.management.registries.chariots[chariot.id].references.equipment.includes(item.id),false);const gold=store.state.career.treasury;commit(store,'asset.sell',{assetId:item.id});assert.equal(store.state.career.treasury,gold+40);assert.equal(store.state.management.registries.equipment[item.id],undefined);
 store.transaction(assemblyCommand(store.state));assert.throws(()=>economicCommand(store.state,'asset.sell',{assetId:chariot.id}),/detach all/);const other=Object.values(store.state.management.registries.equipment)[0];commit(store,'equipment.detach',{equipmentId:other.id});commit(store,'asset.sell',{assetId:chariot.id});assert.equal(Object.keys(store.state.management.registries.chariots).length,0);assert.ok(store.state.management.registries.equipment[other.id]);
});
test('M2-C v1 disassembly/reassembly survives migration and does not consume Gold, XP or time',()=>{
 const {store}=migrated(),s=store.state,a=Object.values(s.management.registries.assignments)[0],before=s.career.treasury;store.transaction(assemblyCommand(s));const command=assemblyCommand(store.state,'ru.assemble',{driverId:a.driverId,beastIds:a.beastIds,chariotId:a.chariotId});store.transaction(command);assert.equal(store.state.career.treasury,before);assert.equal(store.state.maintenanceRevision,s.maintenanceRevision);assert.equal(previewRU3(store.state,a,{assignmentId:a.id}).eligible,true);assert.equal(store.transaction(command).duplicate,true);
});
test('M2-C schema-3 injury preview flags ineligible RU without changing assignment; native condition remains separate',()=>{
 const {store}=migrated(),base=store.state,a=Object.values(base.management.registries.assignments)[0];for(const [injury,eligible] of [['Healthy',true],['Minor',true],['Major',false],['Critical',false]]){const copy=structuredClone(base);copy.management.registries.personnel[a.driverId].injury=injury;const p=previewRU3(copy,a,{assignmentId:a.id});assert.equal(p.eligible,eligible);assert.equal(p.assembled,true);assert.deepEqual(copy.management.registries.assignments,base.management.registries.assignments);}
});
test('M2-C seven permanent upgrades total 3050, increase correct capacities and never upgrade descriptive facilities',()=>{
 const {store}=migrated();assert.equal(Object.values(store.state.management.registries.facilities)[0].descriptiveOnly,true);fund(store);const before=store.state.career.treasury;for(const key of Object.keys(UPGRADES))buyUpgrade(store,key);assert.equal(before-store.state.career.treasury,3050);assert.deepEqual(Object.values(store.state.management.registries.properties)[0].capacities,{drivers:3,specialists:2,beasts:6,chariots:2});assert.equal(Object.keys(store.state.management.registries.facilities).length,8);assert.throws(()=>buyUpgrade(store,'workshop'),/already owned/);
});
test('M2-C engineering has exact incremental cost, persistent ledger, no resale uplift and ten lifetime increments',()=>{
 const {store}=migrated();fund(store);const c=Object.values(store.state.management.registries.chariots)[0],basis=c.economics.acquisitionBasis;commit(store,'engineering.apply',{assetId:c.id,attribute:'stability',points:5});commit(store,'engineering.apply',{assetId:c.id,attribute:'durability',points:5});const current=store.state.management.registries.chariots[c.id];assert.equal(current.engineering.spentGold,750);assert.equal(current.economics.acquisitionBasis,basis);assert.equal(current.integrity,100);assert.equal(current.condition,100);assert.throws(()=>economicCommand(store.state,'engineering.apply',{assetId:c.id,attribute:'protection',points:1}),/Lifetime/);
 const reload=new CareerStore(store.storage);reload.open();assert.deepEqual(reload.state,store.state);
});
test('M2-C real training rejects insufficient XP; no persistent grant or unapproved domain action exists',()=>{
 const {store,storage}=migrated(),d=Object.values(store.state.management.registries.personnel)[0],command=economicCommand(store.state,'training.apply',{assetId:d.id,attribute:'driving',points:1}),raw=storage.value;assert.throws(()=>store.transaction(command),/Insufficient XP/);assert.equal(storage.value,raw);
 for(const type of ['management.cycle','xp.award','market.refresh','wage.pay','contract.expire','race.reward','legacy.award'])assert.throws(()=>store.transaction({...command,type}));
});
test('M2-C cost, revision, ownership, bounds and invalid native field reject without mutations',()=>{
 const {store,storage}=migrated(),s=store.state,cmd=economicCommand(s,'facility.purchase',{propertyId:propertyId(s),upgradeId:'staff-quarters'}),raw=storage.value;
 for(const patch of [{delta:1},{delta:NaN},{effectId:'alias'},{commandVersion:1},{expectedRevision:0},{expectedMaintenanceRevision:1},{profileId:'foreign'},{payload:{...cmd.payload,extra:true}}])assert.throws(()=>store.transaction({...cmd,...patch}));assert.equal(storage.value,raw);
 const c=Object.values(s.management.registries.chariots)[0];for(const attribute of ['weight','capacity','integrity','condition','__proto__'])assert.throws(()=>economicCommand(s,'engineering.apply',{assetId:c.id,attribute,points:1}));
});
test('M2-C entire initial market can be consumed without replenishment while releasing capacity explicitly',()=>{
 const {store}=migrated();fund(store);buyUpgrade(store,'staff-quarters');buyUpgrade(store,'driver-quarters');buyUpgrade(store,'expanded-stables');buyUpgrade(store,'chariot-bay');const offers=Object.values(store.state.management.registries.marketOffers);
 for(const offer of offers){const result=commit(store,'market.acquire',{offerId:offer.id,term:['driver','specialist'].includes(offer.category)?'short':null}),assetId=result.receipt.result.details.assetId;
  if(['driver','specialist'].includes(offer.category))commit(store,'personnel.terminate',{personId:assetId});else commit(store,'asset.sell',{assetId});
 }
 assert.equal(Object.keys(store.state.management.registries.marketOffers).length,23);assert.equal(Object.values(store.state.management.registries.marketOffers).filter(o=>o.available).length,0);const reload=new CareerStore(store.storage);reload.open();assert.equal(Object.values(reload.state.management.registries.marketOffers).filter(o=>o.available).length,0);
});
test('M2-C protected migration without retained acknowledgment returns null without writes',()=>{
 const {store,storage,request}=migrated(),envelope=store.export();for(const container of [envelope.protectedHistory.value,envelope.primary.value.history.commands])container.find(e=>e.kind==='migration-maintenance').acknowledgment=null;envelope.protectedHistory=seal(envelope.protectedHistory.value);envelope.primary=seal(envelope.primary.value);const memory=new Memory();memory.value=JSON.stringify(envelope);const other=new CareerStore(memory);other.open();const raw=memory.value;assert.equal(other.migrateEconomy(request).acknowledgment,null);assert.equal(memory.value,raw);
});
test('M2-C import size bound and stale browser writer preserve current aggregate',()=>{
 const {store,storage}=migrated(),raw=storage.value;assert.throws(()=>store.importSave(' '.repeat(MAX_IMPORT_BYTES+1),{confirmed:true}),/oversized/);assert.equal(storage.value,raw);const second=new CareerStore(storage);second.open();buyUpgrade(store,'staff-quarters');const changed=storage.value;assert.throws(()=>buyUpgrade(second,'workshop'),/another window/);assert.equal(storage.value,changed);
});

test('M2-C engineering lifetime slots remain consumed after old schema-3 restore',()=>{
 const {store}=migrated();fund(store);const old=JSON.stringify(store.export()),c=Object.values(store.state.management.registries.chariots)[0];commit(store,'engineering.apply',{assetId:c.id,attribute:'stability',points:5});store.importSave(old,{confirmed:true});assert.throws(()=>economicCommand(store.state,'engineering.apply',{assetId:c.id,attribute:'durability',points:5}),/retained history/);
});
test('M2-C nonhealthy legacy input returns typed UNSUPPORTED_LEGACY_INJURY before any migration',()=>{
 const s=starter();Object.values(s.management.registries.beasts)[0].injury='Moderate';assert.throws(()=>previewMigration(s),/UNSUPPORTED_LEGACY_INJURY/);
});
import {previewMigration} from '../src/career/economy/base.js';
test('M2-C 1000-receipt boundary retains all original receipts and rejects new gameplay',()=>{
 const s=starter();for(let i=1;i<1000;i++){
  const tx={id:'limit-'+i,profileId:s.profile.id,careerId:s.career.id,expectedRevision:i,expectedMaintenanceRevision:1,commandVersion:1,type:'developer.treasury.adjust',effectId:'limit-effect-'+i,delta:0,reason:'Boundary fixture'};
  s.transactions.push({transaction:tx,resultRevision:i+1,balanceAfter:1200});s.provenance.push(transactionMark(tx));s.history.commands.push(protectTransaction(tx,1200));
 }
 s.revision=1000;s.profile.developerEdited=s.career.developerEdited=true;s.history.commands.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);s.provenance.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);validateState(s);
 const preview=previewMigration(s),request=migrationRequest(s,preview),next=buildEconomyBase(s,request);next.history.commands=mergeProtected(next.history.commands,[protectMaintenance(request,next.economy.manifestDigest)]);validateState(next);const before=canonical(next),command=economicCommand(next,'facility.purchase',{propertyId:propertyId(next),upgradeId:'staff-quarters'});assert.throws(()=>transact(next,command),/Transaction limit/);assert.equal(canonical(next),before);assert.equal(next.transactions.length,1000);
});
import {transactionMark} from '../src/career/legacy-state.js';import {protectTransaction} from '../src/career/history.js';import {buildEconomyBase} from '../src/career/economy/base.js';import {mergeProtected} from '../src/career/economy/protected-registry.js';

test('M2-C malformed retained economic result is rejected even when no active gameplay receipt survives',()=>{
 const {store,storage}=migrated(),earlier=JSON.stringify(store.export());buyUpgrade(store,'staff-quarters');store.importSave(earlier,{confirmed:true});const raw=storage.value,e=store.export();const p=e.protectedHistory.value.find(x=>x.commandVersion===2);p.result.cost=0;e.protectedHistory=seal(e.protectedHistory.value);assert.throws(()=>store.importSave(JSON.stringify(e),{confirmed:true}),/economic/);assert.equal(storage.value,raw);
});
