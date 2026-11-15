import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {buildJobs,SignSchedule,archetypes,profiles} from '../scripts/evaluation/scenarios.mjs';
import {execute} from '../scripts/evaluation/measure.mjs';
import {defaultRU} from '../src/model/ru.js';
import {verifyReplay} from '../src/replay/replay.js';
const tiny=()=>({id:'unit',format:'Pure',seed:145,setup:{seed:145,entrants:[{ru:defaultRU('A'),lane:0,q:-.5}],overrides:{laps:1},checkpointInterval:10000},schedule:[{on:'start',action:'queue',sign:'Push the Pace'}]});
test('Phase 2 matrix has exactly 500 races per format, unique IDs, valid controls and all weather presets',()=>{
 const jobs=buildJobs();assert.equal(jobs.length,1000);assert.equal(new Set(jobs.map(x=>x.id)).size,1000);
 for(const format of ['Pure','Combat']){const selected=jobs.filter(x=>x.format===format);assert.equal(selected.length,500);assert.equal(new Set(selected.map(x=>x.weather)).size,5);}
 assert.ok(jobs.filter(x=>x.format==='Pure').every(x=>!x.schedule.some(s=>s.sign==='Engage Rivals')));
 for(const j of jobs.filter(j=>j.experiment==='D'&&j.arm!=='none')){const control=jobs.find(x=>x.experiment==='D'&&x.format===j.format&&x.block===j.block&&x.arm==='none');assert.deepEqual(j.setup,control.setup);}
});
test('Phase 2 archetypes and personalities have equal budgets with balanced grid exposure',()=>{
 for(const vector of [...Object.values(archetypes),...Object.values(profiles)])assert.equal(vector.reduce((a,b)=>a+b),300);
 const jobs=buildJobs().filter(j=>j.experiment==='B'&&j.format==='Pure'&&j.weather==='Clear');
 for(let slot=0;slot<8;slot++){const types={};for(const j of jobs){const type=j.labels[`RU${slot+1}`].archetype;types[type]=(types[type]??0)+1;}assert.deepEqual(Object.values(types),[4,4,4,4,4]);}
});
test('Phase 2 schedule is state/tick deterministic and respects entry delays',()=>{
 const schedule=new SignSchedule([{on:'start',action:'queue',sign:'Push the Pace'},{on:'entry',delay:1,action:'cancel'}]);
 const s={tick:0,playerId:'A',entrants:[{id:'A',hasEnteredCourse:false,completedLaps:0}]};
 assert.equal(schedule.due(s).length,1);assert.equal(schedule.due(s).length,0);
 s.tick=8;s.entrants[0].hasEnteredCourse=true;assert.equal(schedule.due(s).length,0);
 s.tick=9;assert.equal(schedule.due(s)[0].action,'cancel');assert.equal(schedule.due(s).length,0);
});
test('Phase 2 passive instrumentation preserves authoritative checksum/events/RNG and exact replay',()=>{
 const a=execute(tiny(),{includeReplay:true}),b=execute(tiny(),{instrument:false});
 assert.equal(a.result.checksum,b.result.checksum);assert.equal(a.result.eventsSHA256,b.result.eventsSHA256);assert.deepEqual(a.result.rng,b.result.rng);
 assert.equal(verifyReplay(a.replay).checksum,a.result.checksum);
 const saved=JSON.parse(JSON.stringify(a.result)),rerun=JSON.parse(JSON.stringify(execute(tiny()).result));
 delete saved.wallSeconds;delete rerun.wallSeconds;assert.deepEqual(rerun,saved);
 const ru=a.result.ru[0];assert.ok(Math.abs(Object.values(ru.paceSeconds).reduce((a,b)=>a+b,0)-ru.competitiveSeconds)<1e-7);
 assert.ok(ru.maxObservedSpeed>=ru.sampledAverageSpeed);assert.ok(ru.blockedSeconds<=ru.competitiveSeconds);
 assert.deepEqual(ru.finishFatigue,a.replay.events.find(e=>e.type==='RU_FINISHED').effects.finishSnapshot.beasts.map(b=>b.fatigue));
});
test('Phase 2 bounded runs never fabricate a finish or elapsed metric',()=>{
 const result=execute(tiny(),{maxTicks:0}).result;assert.equal(result.bounded,true);assert.equal(result.status,'Ready');assert.equal(result.ru[0].officialTime,null);assert.equal(result.ru[0].sampledAverageSpeed,null);assert.equal(result.race.finishes,0);
});
test('Phase 2 runner supports cancellation and preserves its actual completed count',async()=>{
 const path=await mkdtemp(join(tmpdir(),'bnt-evaluation-'));
 try{
 const child=spawn(process.execPath,['scripts/evaluation/run.mjs','--limit','20','--workers','1','--out',path],{cwd:process.cwd(),stdio:['ignore','pipe','pipe']});
 let output='',sent=false,errors='';child.stderr.on('data',x=>errors+=x);child.stdout.on('data',x=>{output+=x;if(!sent&&output.includes('"started":true')){sent=true;child.kill('SIGINT');}});
 const code=await new Promise((resolve,reject)=>{child.on('exit',resolve);child.on('error',reject);});
 assert.equal(code,1,errors);const report=JSON.parse(await readFile(path+'/execution.json','utf8'));
 assert.equal(report.cancelled,true);assert.equal(report.completed,report.runs.length);assert.ok(report.completed<report.target);assert.equal(report.toolErrors.length,0);
 }finally{await rm(path,{recursive:true,force:true});}
});

test('Phase 2 descriptive statistics do not coerce missing nonfinish times to zero',async()=>{
 const {describe,quantile}=await import('../scripts/evaluation/statistics.mjs');
 assert.deepEqual(describe([null,undefined,NaN]).n,0);assert.equal(describe([1,2,3,null]).mean,2);assert.equal(quantile([1,2,3,4],.5),2.5);
});
test('Phase 2 paired statistics match blocks and preserve complete-pair denominators',async()=>{
 const {paired}=await import('../scripts/evaluation/statistics.mjs');
 const result=paired([{seed:1,block:'a',time:12},{seed:2,block:'b',time:null}],[{seed:1,block:'a',time:10},{seed:2,block:'b',time:15}],{time:r=>r.time});
 assert.equal(result.pairs,2);assert.equal(result.metrics.time.n,1);assert.equal(result.metrics.time.mean,2);
});
test('Phase 2 confidence intervals resample independent seed clusters deterministically',async()=>{
 const {clustered,wilson}=await import('../scripts/evaluation/statistics.mjs');
 const records=[{seed:1,v:0},{seed:1,v:0},{seed:2,v:2},{seed:2,v:2}];
 const a=clustered(records,r=>r.v,'fixed'),b=clustered(records,r=>r.v,'fixed');
 assert.deepEqual(a,b);assert.equal(a.clusters,2);assert.equal(a.n,4);assert.equal(a.mean,1);assert.ok(wilson(0,20)[1]>0);
});

test('Phase 2 supplemental panel changes only player context and preserves matched sign controls',async()=>{
 const {buildSupplementJobs}=await import('../scripts/evaluation/scenarios.mjs');const jobs=buildSupplementJobs();
 assert.equal(jobs.length,130);assert.equal(jobs.filter(j=>j.format==='Pure').length,60);assert.equal(jobs.filter(j=>j.format==='Combat').length,70);
 for(const j of jobs){assert.equal(j.setup.playerId,'RU5');const c=jobs.find(x=>x.format===j.format&&x.block===j.block&&x.arm==='none');assert.deepEqual(j.setup,c.setup);}
});
