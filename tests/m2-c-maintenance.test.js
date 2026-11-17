import {test} from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {canonical} from '../src/core/determinism.js';import {createUninitializedCareer,transact} from '../src/career/state.js';
import * as old from '../src/career/history.js';
import {mergeProtected} from '../src/career/economy/protected-registry.js';
import {protectMaintenance,validateMaintenance,lookupMaintenance,migrationEffect} from '../src/career/economy/maintenance-history.js';
import {sha256} from '../src/career/economy/fingerprint.js';
import {CareerStore} from '../src/persistence/career-store.js';import {makeEnvelope,parseEnvelope} from '../src/persistence/envelope.js';
const source=()=>createUninitializedCareer({profileId:'owner',careerId:'career'});
const request=s=>({id:'migration',profileId:s.profile.id,careerId:s.career.id,type:'career.migrate',maintenanceVersion:1,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,sourceSchema:2,targetSchema:3,sourceFingerprint:sha256(canonical(s)),migrationVersion:'m2c-migration-v1',adapterVersion:'valuation-health-v1',generatorVersion:'market-generator-v1',confirmed:true,effectId:migrationEffect(s.career.id)});
const manifest=sha256('Gate fixture: restored source checkpoint with known future migration fact');
class Memory{value=null;writes=0;getItem(){return this.value;}setItem(k,v){this.value=v;this.writes++;}}
test('M2-C first gate: portable SHA-256 matches independent Node vectors and Unicode',()=>{for(const text of ['', 'abc','a'.repeat(1000),'BNT|M2-C|market-generator-v1|career','Å🐎'])assert.equal(sha256(text),createHash('sha256').update(text).digest('hex'));});
test('M2-C first gate: old validators and exact old entry bytes remain unchanged and strict',()=>{
 const s=source(),tx={id:'edit',profileId:'owner',careerId:'career',expectedRevision:0,expectedMaintenanceRevision:1,commandVersion:1,type:'developer.treasury.adjust',effectId:'edit-effect',delta:1,reason:'Gate fixture'},entry=old.protectTransaction(tx,1),bytes=JSON.stringify(entry),marker=protectMaintenance(request(s),manifest);
 assert.deepEqual(mergeProtected([entry],[marker]).find(e=>e.id==='edit'),entry);assert.equal(JSON.stringify(entry),bytes);assert.throws(()=>old.validateProtected({...entry,recordKind:'maintenance'}));assert.throws(()=>mergeProtected([{...entry,fingerprint:'invalid'}]));assert.throws(()=>old.validateProtected(marker));
 const legacy={id:'legacy',profileId:'owner',careerId:'career',expectedRevision:0,type:'developer.treasury.adjust',delta:0,reason:'M1 fixture'};assert.deepEqual(mergeProtected([old.protectTransaction(legacy,0)]),[old.protectTransaction(legacy,0)]);
});
test('M2-C first gate: maintenance acknowledgment has no gameplay receipt or revision effect',()=>{
 const s=source(),r=request(s),marker=protectMaintenance(r,manifest),original=canonical(s);validateMaintenance(marker);assert.equal(marker.revision,s.revision);assert.equal(marker.maintenanceRevision,s.maintenanceRevision+1);assert.equal(marker.acknowledgment.revision,0);assert.equal(canonical(s),original);assert.equal(s.transactions.length,s.revision);assert.equal(Object.hasOwn(marker,'commandVersion'),false);assert.equal(Object.hasOwn(marker,'resultRevision'),false);
});
test('M2-C first gate: exact retry returns same acknowledgment; protected tombstone never invents result',()=>{
 const r=request(source()),m=protectMaintenance(r,manifest);assert.deepEqual(lookupMaintenance([m],r).acknowledgment,m.acknowledgment);assert.equal(lookupMaintenance([protectMaintenance(r,manifest,false)],r).acknowledgment,null);assert.throws(()=>lookupMaintenance([m],{...r,sourceFingerprint:sha256('different')}),/Conflicting/);assert.throws(()=>mergeProtected([m],[protectMaintenance({...r,id:'alias'},manifest)]),/effect identity/);assert.deepEqual(mergeProtected([protectMaintenance(r,manifest,false)],[m]),[m]);
});
test('M2-C first gate: shared 2000 cap includes maintenance; no protected facts discarded',()=>{
 const entries=Array.from({length:2000},(_,i)=>protectMaintenance(request(createUninitializedCareer({profileId:'owner',careerId:'career-'+i})),manifest));
 entries.forEach((e,i)=>{const r=JSON.parse(e.request);r.id='migration-'+i;entries[i]=protectMaintenance(r,manifest);});assert.equal(mergeProtected(entries).length,2000);
 const r=request(createUninitializedCareer({profileId:'owner',careerId:'extra'}));r.id='extra';assert.throws(()=>mergeProtected(entries,[protectMaintenance(r,manifest)]),/limit/);
});
test('M2-C first gate: outer history v1 preserves marker across old checkpoint import and reload',()=>{
 const s=source(),m=protectMaintenance(request(s),manifest),storage=new Memory(),store=new CareerStore(storage);store.open();store.create(s);const earlier=JSON.stringify(store.export());
 const carrier=structuredClone(s);carrier.maintenanceRevision++;store.publish(makeEnvelope(carrier,s,[],[m]));assert.equal(store.state.revision,0);assert.equal(store.state.transactions.length,0);assert.equal(store.state.history.schema,1);assert.deepEqual(store.state.history.commands,[]);assert.deepEqual(store.protectedHistory,[m]);
 store.importSave(earlier,{confirmed:true});assert.equal(store.state.revision,0);assert.equal(store.state.maintenanceRevision,3);assert.deepEqual(store.protectedHistory,[m]);const reload=new CareerStore(storage);reload.open();assert.deepEqual(reload.protectedHistory,[m]);assert.deepEqual(reload.state.transactions,[]);
 assert.equal(parseEnvelope(JSON.stringify(reload.export())).envelope.schema,1);
});
test('M2-C first gate: retained maintenance survives corrupt-primary recovery and explicit mixed checkpoint handling',()=>{
 const s=source(),m=protectMaintenance(request(s),manifest),carrier=structuredClone(s);carrier.maintenanceRevision++;const envelope=makeEnvelope(carrier,s,[],[m]).envelope;envelope.primary.digest='00000000';const storage=new Memory();storage.value=JSON.stringify(envelope);const store=new CareerStore(storage);store.open();assert.equal(store.mode,'recovery-required');store.recover({confirmed:true});assert.equal(store.state.revision,0);assert.equal(store.state.transactions.length,0);assert.equal(store.state.maintenanceRevision,3);assert.deepEqual(store.protectedHistory,[m]);
});
test('M2-C first gate: atomic write failure keeps previous bytes/state/protection and manual export remains valid',()=>{
 const s=source(),storage=new Memory(),store=new CareerStore(storage);store.open();store.create(s);const raw=storage.value,before=store.state,m=protectMaintenance(request(s),manifest),carrier=structuredClone(s);carrier.maintenanceRevision++;storage.setItem=()=>{throw Error('Denied');};assert.throws(()=>store.publish(makeEnvelope(carrier,s,[],[m])),/rolled back/);assert.equal(storage.value,raw);assert.deepEqual(store.state,before);assert.deepEqual(store.protectedHistory,[]);assert.equal(store.mode,'manual');parseEnvelope(JSON.stringify(store.export()));
});

import {buildEconomyBase,previewMigration} from '../src/career/economy/base.js';
import {validateState} from '../src/career/state.js';
function initialized(){let s=source();return transact(s,{id:'initialize',profileId:s.profile.id,careerId:s.career.id,expectedRevision:0,expectedMaintenanceRevision:1,commandVersion:1,type:'career.initialize',effectId:'initialize-career',delta:1200,reason:'Approved Traditional',packageId:'traditional',catalogVersion:3,confirmed:true}).state;}
function staged(s){const r=request(s),next=buildEconomyBase(s,r),marker=protectMaintenance(r,next.economy.manifestDigest);next.history.commands=mergeProtected(next.history.commands,[marker]);return {r,next,marker};}
test('M2-C first gate: pure actual schema-3 target keeps every gameplay receipt, +1 maintenance and one protected fact',()=>{
 const s=initialized(),bytes=canonical(s),{next,marker}=staged(s);validateState(next);assert.equal(next.schema,3);assert.equal(next.revision,s.revision);assert.deepEqual(next.transactions,s.transactions);assert.equal(next.maintenanceRevision,s.maintenanceRevision+1);assert.equal(next.career.treasury,s.career.treasury);assert.equal(next.history.commands.filter(e=>e.kind==='migration-maintenance').length,1);assert.deepEqual(next.history.commands.filter(e=>e.kind!=='migration-maintenance'),s.history.commands);assert.equal(canonical(s),bytes);assert.equal(Object.keys(next.management.registries.marketOffers).length,23);assert.equal(marker.acknowledgment.maintenanceRevision,2);
});
test('M2-C first gate: fingerprint, both revisions and all versions checked before publishing schema-3 target',()=>{
 const s=initialized(),r=request(s),before=canonical(s);for(const patch of [{sourceFingerprint:sha256('stale')},{expectedRevision:0},{expectedMaintenanceRevision:2},{migrationVersion:'wrong'},{adapterVersion:'wrong'},{generatorVersion:'wrong'},{confirmed:false},{profileId:'other'}])assert.throws(()=>buildEconomyBase(s,{...r,...patch}));assert.equal(canonical(s),before);assert.deepEqual(previewMigration(s),previewMigration(s));
});
test('M2-C first gate: real schema-3 candidate atomic publish, import/recovery and quota rollback preserve old source',()=>{
 const s=initialized(),storage=new Memory(),store=new CareerStore(storage);store.open();store.create(s);const oldRaw=storage.value,{next,marker}=staged(s);
 const failing=new CareerStore(storage);failing.open();const oldSet=storage.setItem.bind(storage);storage.setItem=()=>{throw Error('Quota');};assert.throws(()=>failing.publish(makeEnvelope(next,s,[],[marker])),/rolled back/);assert.equal(storage.value,oldRaw);assert.equal(failing.state.schema,2);assert.equal(failing.protectedHistory.some(e=>e.kind==='migration-maintenance'),false);storage.setItem=oldSet;
 store.publish(makeEnvelope(next,s,[],[marker]));assert.equal(store.state.schema,3);assert.equal(store.state.revision,s.revision);assert.deepEqual(store.export().recovery.value,s);const broken=store.export();broken.primary.digest='00000000';storage.value=JSON.stringify(broken);const recovery=new CareerStore(storage);recovery.open();recovery.recover({confirmed:true});assert.equal(recovery.state.schema,2);assert.equal(recovery.state.revision,s.revision);assert.equal(recovery.protectedHistory.filter(e=>e.kind==='migration-maintenance').length,1);assert.equal(recovery.state.history.commands.some(e=>e.kind==='migration-maintenance'),false);
});
