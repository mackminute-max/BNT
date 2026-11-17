import {test} from 'node:test';import assert from 'node:assert/strict';
import {createRace,run,step,capture,digest,issueSign} from '../src/sim/race.js';import {verifyReplay} from '../src/replay/replay.js';
import {ovalPresets,circuitCatalog,trackChoices} from '../src/track/catalog.js';import {generateRally,generationOptions,rallyChunks} from '../src/track/rally-generator.js';
import {validateFootprint,trackDiagnostics} from '../src/track/validation.js';import {configuration,parseConfiguration} from '../src/dev/configuration.js';

test('Track expansion: all fifteen fixed courses validate and twelve circuit geometries are distinct',()=>{
 const hashes=new Set();for(const course of [...Object.keys(ovalPresets),...Object.keys(circuitCatalog)]){const s=createRace({course});assert.equal(validateFootprint(s.track,s.config).valid,true);assert.equal(s.entrants.length,8);if(course.startsWith('C')){assert.ok(s.track.segments.some(x=>x.direction<0));assert.ok(s.track.segments.some(x=>x.direction>0));hashes.add(JSON.stringify(s.track.segments.map(x=>[x.length,x.angle])));}}
 assert.equal(hashes.size,12);assert.deepEqual(['Oval','Circuit','Rally'].map(k=>trackChoices(k).length),[3,12,3]);
});
test('Track expansion: oval geometry differs while standard adapter retains its original configuration',()=>{
 const a=createRace({course:'short-oval'}),b=createRace(),c=createRace({course:'grand-oval'});assert.ok(a.config.straightLength<b.config.straightLength&&b.config.straightLength<c.config.straightLength);assert.ok(a.track.cells<b.track.cells&&b.track.cells<c.track.cells);assert.deepEqual(createRace({course:'oval'}).track,b.track);
 for(const s of [a,b,c]){const doc=configuration(s.setup);assert.deepEqual(parseConfiguration(JSON.stringify(doc)),doc);}
});
test('Track expansion: 300 generated seeds validate, repeat and give valid unique checkpoints',()=>{
 for(const category of ['short','medium','long'])for(let seed=1;seed<=100;seed++){const a=generateRally({seed,category}),b=generateRally({seed,category});assert.deepEqual(a,b);const s=createRace({course:a});assert.equal(validateFootprint(s.track,s.config).valid,true);assert.equal(new Set(s.track.checkpoints.map(p=>p.q)).size,3);assert.ok(s.track.checkpoints.every(p=>p.q>0&&p.q<s.track.cells));assert.equal(a.generation.fallback,false);}
});
test('Track expansion: rally lengths, terrain and turn controls change actual geometry',()=>{
 const samples=['short','medium','long'].map(category=>createRace({course:generateRally({seed:42,category})}));assert.ok(samples[0].track.length<samples[1].track.length&&samples[1].track.length<samples[2].track.length);
 const straight=generateRally({seed:7,turnFrequency:0}),turning=generateRally({seed:7,turnFrequency:1,turnSeverity:1});assert.ok(straight.segments.every(s=>s.turn===0));assert.ok(turning.segments.some(s=>s.turn!==0));
 const road=generateRally({seed:8,terrainWeights:{stone:1}});assert.ok(road.segments.every(s=>s.terrain==='stone'));
 const gentle=generateRally({seed:8,turnFrequency:1,turnSeverity:0});assert.ok(gentle.segments.every(s=>Math.abs(s.turn)<=45));
});
test('Track expansion: generator rejects invalid settings and explicitly falls back after bounded geometry failures',()=>{
 for(const input of [{seed:NaN},{category:'huge'},{turnFrequency:2},{turnSeverity:-1},{chunks:200},{terrainWeights:{mud:0}},{terrainWeights:{lava:1}},{maxAttempts:0},{chunkLibrary:{bad:[{length:-1,turn:0}]}}])assert.throws(()=>generateRally(input));
 const r=generateRally({seed:4,chunks:4,turnFrequency:1,turnSeverity:1,maxAttempts:2,chunkLibrary:{bad:[{length:1,turn:160},{length:1,turn:-160}]}});assert.equal(r.generation.fallback,true);assert.equal(r.generation.attempt,2);assert.equal(r.generation.failures.length,2);assert.equal(validateFootprint(createRace({course:r}).track,createRace({course:r}).config).valid,true);
});
test('Track expansion: generation does not consume or mutate authoritative race RNG/state or use global randomness',()=>{
 const s=createRace(),before=capture(s),original=Math.random;Math.random=()=>{throw Error('Global RNG prohibited');};try{generateRally({seed:1337});}finally{Math.random=original;}assert.deepEqual(capture(s),before);
});
test('Track expansion: route import/export preserves exact generated definition and recipe',()=>{
 const course=generateRally({seed:-123,category:'short',terrainProfile:'road'});assert.deepEqual(generateRally(course.generation.options),course);const doc=configuration({course});assert.deepEqual(parseConfiguration(JSON.stringify(doc)),doc);assert.equal(trackDiagnostics(createRace(doc.setup)).seed,-123);
});
test('Track expansion: checkpoints and sign counts scale with generated rally length and replay exactly',()=>{
 for(const category of ['short','medium','long']){const s=createRace({course:generateRally({seed:21,category}),checkpointInterval:10000});issueSign(s,'queue','Push the Pace');run(s);assert.equal(s.status,'Ended');for(const r of s.entrants){assert.equal(r.checkpointCursor,3);assert.equal(r.physical,'Exited');}assert.equal(s.events.filter(e=>e.type==='CHECKPOINT_CROSSED').length,24);assert.equal(s.entrants[0].signs.remaining,2);assert.equal(verifyReplay(capture(s)).checksum,digest(s));}
});
test('Track expansion: sampled corridor validator detects a crossing open route',()=>{
 const s=createRace({course:generateRally({seed:3,turnFrequency:0})}),copy=structuredClone(s.track);copy.segments[1].x=copy.segments[0].x;copy.segments[1].y=copy.segments[0].y;assert.equal(validateFootprint(copy,s.config).valid,false);
});
