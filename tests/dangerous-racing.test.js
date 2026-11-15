import {test} from 'node:test';import assert from 'node:assert/strict';
import {buildJobs,buildJob} from '../scripts/dangerous-racing/scenarios.mjs';
import {executeDanger,diagnose} from '../scripts/dangerous-racing/measure.mjs';
import {createRace} from '../src/sim/race.js';import {eligibleCombat} from '../src/sim/consequences.js';
import {verifyReplay} from '../src/replay/replay.js';import {defaultRU} from '../src/model/ru.js';
test('DR frozen allocation is 600 Combat and 120 exact matched Pure controls',()=>{
 const jobs=buildJobs();assert.equal(jobs.length,720);assert.equal(new Set(jobs.map(j=>j.id)).size,720);
 for(const cohort of ['healthy','mixed','high-risk']){const a=jobs.filter(j=>j.cohort===cohort);assert.equal(a.filter(j=>j.setup.format==='Combat').length,200);assert.equal(a.filter(j=>j.setup.format==='Pure').length,40);for(const j of a.filter(j=>j.setup.format==='Pure')){const c=a.find(x=>x.id===j.id.replace('Pure','Combat'));assert.deepEqual({...j.setup,format:'Combat'},c.setup);}}
});
test('DR all cohort configurations validate and start above disablement limits without injected incidents',()=>{
 for(const c of ['healthy','mixed','high-risk'])for(let r=0;r<8;r++)for(let w=0;w<5;w++){const j=buildJob(c,r,w),s=createRace(j.setup);assert.equal(s.entrants.length,8);assert.equal(s.config.laps,3);assert.equal(s.incidentSchedule.length,0);for(const e of s.entrants){assert.ok(e.ru.driver.condition>5&&e.ru.chariot.condition>5);assert.ok(e.ru.beasts.every(b=>b.condition>10));assert.equal(e.speed,0);assert.equal(e.physical,'Live');}}
});
test('DR ram legality is contained in attack legality throughout tested geometry and formats',()=>{
 for(const format of ['Pure','Combat'])for(const gap of [-2,-1,-.75,0,.75,1,2])for(const lane of [0,1,2]){if(lane===0&&Math.floor(-3.5)===Math.floor(-3.5+gap))continue;const s=createRace({format,entrants:[{ru:defaultRU('A'),lane:0,q:-3.5},{ru:defaultRU('B'),lane,q:-3.5+gap}]});const [a,b]=s.entrants;if(eligibleCombat(s,a,b,'ram'))assert.equal(eligibleCombat(s,a,b,'attack'),true);if(format==='Pure')assert.equal(eligibleCombat(s,a,b,'ram'),false);}
});
test('DR observation preserves full event/RNG/state checksums and actual replay for each cohort',()=>{
 for(const c of ['healthy','mixed','high-risk']){const job=buildJob(c,1,2),a=executeDanger(job,{includeReplay:true}),b=executeDanger(job,{observe:false,includeReplay:true});assert.equal(a.result.checksum,b.result.checksum);assert.equal(a.result.eventsSHA256,b.result.eventsSHA256);assert.deepEqual(a.replay,b.replay);assert.equal(verifyReplay(a.replay).checksum,a.replay.checksum);}
});
test('DR defense threshold contrast excludes passive defense and records actual damage only',()=>{
 const r={time:1,setup:{entrants:[],consequence:{reactionBonus:10,defendingBonus:12}},events:[{type:'REACTION',effects:{attackId:'a',defending:true,remaining:0}},{type:'ATTACK',time:0,effects:{attackId:'a',attacker:'A',defender:'B',margin:-20,success:false,reacted:true}},{type:'ATTACK',time:1,effects:{attackId:'b',attacker:'A',defender:'B',margin:-20,success:false,reacted:false}}]};
 const d=diagnose(r);assert.equal(d.contests[0].noReactionMargin,2);assert.equal(d.contests[0].reactionThresholdFlip,true);assert.equal(d.contests[0].damage,0);assert.equal(d.contests[1].reactionThresholdFlip,false);
});
test('DR initially worn components are distinct from new threshold crossings',()=>{
 const ru=defaultRU('A');ru.chariot.condition=20;const r={time:1,setup:{entrants:[{ru}],consequence:{}},events:[{type:'DAMAGE',time:.5,participants:['A'],effects:{kind:'contact',component:'chariot',before:20,after:18,amount:2}}]};const d=diagnose(r).perRU.A;assert.equal(d.startsSerious,true);assert.equal(d.newSeriousDamage,false);assert.equal(d.endsSerious,true);
});
test('DR grid rotations and composite surface/traffic strata are balanced by cohort',()=>{
 for(const c of ['healthy','mixed','high-risk']){const a=buildJobs().filter(j=>j.cohort===c&&j.setup.format==='Combat');for(const surface of ['neutral','degraded'])assert.equal(a.filter(j=>j.surface===surface).length,100);for(const traffic of ['standard-grid','spread-rows'])assert.equal(a.filter(j=>j.traffic===traffic).length,100);for(let slot=0;slot<8;slot++)for(let n=1;n<=8;n++)assert.equal(a.filter(j=>j.setup.entrants[slot].ru.id==='RU'+n).length,25);}
});

test('DR historical condition derivation respects event order at an identical finish timestamp',async()=>{
 const {conditionAtStop}=await import('../scripts/dangerous-racing/finish-condition.mjs');const ru=defaultRU('A');
 const events=[{id:1,time:1,type:'DAMAGE',participants:['A'],effects:{component:'driver',after:80}},{id:2,time:1,type:'RU_FINISHED',participants:['A'],effects:{}},{id:3,time:1,type:'DAMAGE',participants:['A'],effects:{component:'driver',after:10}}];
 const result=conditionAtStop(ru,[...events].reverse());assert.equal(result.condition.driver,80);assert.equal(result.status,'Finished');assert.equal(result.stopEventId,2);assert.equal(ru.driver.condition,100);
});
