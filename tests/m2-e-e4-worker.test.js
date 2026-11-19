import test from 'node:test';import assert from 'node:assert/strict';
import {createWorkerService} from '../src/persistence/e4/worker-service.js';
import {checkRecords} from '../src/persistence/e4/indexeddb.js';
import {fixtureE4} from '../scripts/m2-e/e4/fixture.mjs';
import {mapCondition} from '../src/career/championships/condition.js';
import {initialCondition} from '../src/career/championships/condition.js';
import {pack,unpack} from '../src/sim/foundation/codec.js';
const send=(h,type,extra={})=>h({version:1,type,...extra});
test('E4 worker cold validation, exact-byte cache, revision invalidation and corruption rejection',async()=>{
 const f=fixtureE4({fieldSize:1,courses:[null]}),h=createWorkerService(),snapshot={generation:1,records:[...f.map]};
 assert.equal((await send(h,'validate',{snapshot})).cacheHit,false);assert.equal((await send(h,'validate',{snapshot})).cacheHit,true);
 assert.equal((await send(h,'validate',{snapshot:{...snapshot,generation:2}})).cacheHit,false);
 const bad=structuredClone(snapshot);bad.records[0][1]=bad.records[0][1].replace('"digest":"','"digest":"bad');await assert.rejects(send(h,'validate',{snapshot:bad}));
 assert.equal((await send(h,'validate',{snapshot})).durable,false);await assert.rejects(send(h,'validate',{snapshot,version:99}));
});
test('E4 worker D2 typed-wire parity preserves continuous values and never changes source',async()=>{
 const f=fixtureE4({fieldSize:1,courses:[null]}),e=f.x.entrants[0],start=e.native,final=structuredClone(start);final.driver.condition=59.5;final.beasts[0].condition=29.5;final.chariot.condition-=7.5;
 const input={instanceId:f.x.id,eventId:'event',resultId:'result',start,final,persistent:initialCondition(e,f.store.state),provenance:{version:1}},before=JSON.stringify(input),h=createWorkerService();
 assert.deepEqual(unpack((await send(h,'condition',{input:pack(input)})).result),mapCondition(input));assert.equal(JSON.stringify(input),before);
});
test('E4 worker candidate has no durable ack, pending work rejects and reset discards candidate',async()=>{
 const f=fixtureE4({fieldSize:1,courses:[null]}),h=createWorkerService(),snapshot={generation:0,records:[...f.map]},before=JSON.stringify(snapshot);
 const p=await send(h,'prepare',{snapshot,operation:'start',id:'start'});assert.equal(p.durable,false);assert.equal(p.phase,'RACE_START_PENDING');assert.equal(JSON.stringify(snapshot),before);
 await assert.rejects(send(h,'validate',{snapshot}),/pending/);await assert.rejects(send(h,'ack',{token:'wrong'}),/Unknown/);
 await send(h,'reset');assert.equal((await send(h,'validate',{snapshot})).revision,f.store.state.revision);
});
test('E4 record bounds and duplicate identities reject before writes',()=>{
 assert.throws(()=>checkRecords([['foreign','text']]));assert.throws(()=>checkRecords([['bnt.career.save.v1','x'],['bnt.career.save.v1','x']]));assert.throws(()=>checkRecords([['bnt.career.save.v1','x'.repeat(8*1024*1024+1)]]));
});
