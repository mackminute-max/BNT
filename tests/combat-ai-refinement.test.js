import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRace,step,run,capture,digest,issueSign,assertState} from '../src/sim/race.js';
import {verifyReplay} from '../src/replay/replay.js';
import {configuration,parseConfiguration} from '../src/dev/configuration.js';
import {queueOverride} from '../src/dev/overrides.js';
import {contestChance,combatValue} from '../src/ai/combat-value.js';
import {perceive} from '../src/ai/driver.js';
import {utilityConfig} from '../src/ai/weights.js';
import {tacticalScenario} from '../scripts/combat-ai-refinement/scenarios.mjs';
const first=s=>s.events.find(e=>e.type==='AI_DECISION'&&e.participants[0]==='A').effects;
const prepare=kind=>{const s=createRace(tacticalScenario(kind));step(s);return s;};

test('Combat refinement: weapon is preferred at equal speed without bilateral ram benefit',()=>{
 const s=prepare('weapon'),d=first(s),weapon=d.candidates.find(c=>c.action==='attack'),ram=d.candidates.find(c=>c.action==='ram');
 assert.equal(d.chosen.position,'attack');assert.ok(weapon.score>ram.score);assert.equal(weapon.assessment.selfDamage,0);assert.ok(ram.assessment.selfDamage>0);
 assert.equal(d.effective.position,'attack');assert.ok(s.events.some(e=>e.type==='ATTACK'&&e.effects.action==='attack'&&e.effects.success));assertState(s);
});
test('Combat refinement: protected slower RU autonomously rams a faster adjacent rival',()=>{
 const s=prepare('ram'),d=first(s);assert.equal(d.chosen.position,'ram');assert.equal(d.effective.position,'ram');assert.equal(s.commands.filter(c=>c.type==='attack').length,0,'no player attack forced');
 const ram=d.candidates.find(c=>c.action==='ram');assert.ok(ram.assessment.observedRelativeSpeed>0);assert.ok(ram.terms.disruption>0);assert.ok(ram.terms.selfRisk<0);assert.ok(ram.terms.racingCost<0);
 assert.ok(s.events.some(e=>e.type==='ATTACK'&&e.effects.action==='ram'&&e.effects.success));
 assert.equal(s.events.filter(e=>e.type==='DAMAGE'&&e.effects.kind==='ram').length,2);assertState(s);
});
test('Combat refinement: inadequate protection makes the same ram opportunity unacceptable',()=>{
 const safe=first(prepare('ram')),unsafe=first(prepare('unsafe-ram'));assert.equal(unsafe.chosen.position,'attack');
 assert.ok(unsafe.candidates.find(c=>c.action==='ram').assessment.selfDamage>safe.candidates.find(c=>c.action==='ram').assessment.selfDamage);
});
test('Combat refinement: ordinary low-payoff offense yields to racing with clear track',()=>{
 const s=prepare('race-on'),d=first(s);assert.equal(d.chosen.position,'hold');assert.equal(s.events.filter(e=>e.type==='ATTACK').length,0);assert.ok(d.candidates.some(c=>c.action==='attack'));
});
test('Combat refinement: compromised own components change the favorable ram decision to self-preservation',()=>{
 const healthy=first(prepare('ram')),hurt=first(prepare('damaged'));assert.equal(healthy.chosen.position,'ram');assert.equal(hurt.chosen.position,'hold');assert.ok(hurt.candidates.find(c=>c.action==='ram').terms.conditionRisk<healthy.candidates.find(c=>c.action==='ram').terms.conditionRisk);
});
test('Combat refinement: personality changes tactical preferences without changing equipment or skill',()=>{
 const aggressive=prepare('weapon'),cautious=prepare('cautious');assert.equal(first(aggressive).chosen.position,'attack');assert.equal(first(cautious).chosen.position,'defendCombat');
 assert.deepEqual(aggressive.setup.entrants[0].ru.chariot,cautious.setup.entrants[0].ru.chariot);
});
test('Combat refinement: hidden rival skills, armor, mass, condition and reactions do not leak into scores',()=>{
 const base=tacticalScenario('ram'),altered=structuredClone(base),rival=altered.entrants[1].ru;
 rival.chariot.weight=400;rival.chariot.protection=0;rival.chariot.condition=12;rival.driver.combat=100;rival.driver.driving=0;rival.driver.condition=20;rival.equipment.combat=100;
 const a=createRace(base),b=createRace(altered);b.entrants[1].reactionsRemaining=0;b.entrants[1].defending=true;step(a);step(b);
 assert.deepEqual(first(a).perceived,first(b).perceived);assert.deepEqual(first(a).candidates,first(b).candidates);assert.deepEqual(first(a).chosen,first(b).chosen);
});
test('Combat refinement: cost of risking a local lead and final-lap position is observable and increases',()=>{
 const s=createRace(tacticalScenario('weapon')),r=s.entrants[0],perceived=perceive(s,r),target=perceived.neighbors[0];
 const assess=(a,t)=>combatValue('attack',a,t,perceived,s.config,s.consequence,s.autonomous.utility,1);
 const before=assess(r,target),late=assess({...r,hasEnteredCourse:true,completedLaps:2},{...target,gap:-.5});assert.ok(late.features.racingCost<before.features.racingCost);
});
test('Combat refinement: every Pure scenario excludes deliberate offensive candidates and events',()=>{
 for(const kind of ['weapon','ram','unsafe-ram','damaged','race-on']){const setup=tacticalScenario(kind);setup.format='Pure';const s=createRace(setup);for(let i=0;i<20;i++)step(s);assert.ok(s.events.filter(e=>e.type==='AI_DECISION').every(e=>e.effects.candidates.every(c=>!['attack','ram'].includes(c.action))));assert.equal(s.events.filter(e=>e.type==='ATTACK').length,0);}
});
test('Combat refinement: queued Engage affects utility, retains accounting and reports actual ram resolution',()=>{
 const s=createRace(tacticalScenario('ram'));issueSign(s,'queue','Engage Rivals');step(s);const d=first(s),execution=s.events.find(e=>e.type==='AI_EXECUTION_RESULT'&&e.effects.decisionId===d.decisionId&&e.effects.domain==='position');
 assert.equal(d.sign,'Engage Rivals');assert.equal(d.executed.position,null);assert.equal(execution.effects.executed.position,'ram');assert.equal(execution.effects.physicalOutcome.position.status,'Succeeded');assert.equal(execution.effects.compliance,'Followed');assert.equal(s.entrants[0].signs.remaining,2);assert.equal(verifyReplay(capture(s)).checksum,digest(s));
});
test('Combat refinement: all six signs preserve input legality, accounting and deterministic replay',()=>{
 for(const sign of ['Push the Pace','Conserve Strength','Seek Open Track','Race Defensively','Engage Rivals','Hold Position']){const s=createRace(tacticalScenario('ram'));issueSign(s,'queue',sign);for(let i=0;i<40;i++)step(s);assert.equal(s.entrants[0].signs.remaining,2);assert.ok(s.events.some(e=>e.type==='SIGN_ACTIVATED'&&e.effects.sign===sign));assert.equal(verifyReplay(capture(s)).checksum,digest(s));}
});
test('Combat refinement: validation rejects invalid terms, zero normalizers remain finite and config round-trips',()=>{
 for(const value of [-1,101,NaN,Infinity])assert.throws(()=>utilityConfig({combatSelfRisk:value}));assert.throws(()=>utilityConfig({combatMadeUp:1}));
 const setup=tacticalScenario('ram');setup.autonomous={utility:{combatSpeedUnit:0,combatDamageUnit:0,combatUnknownMassRatio:0}};const s=createRace(setup);step(s);assert.ok(first(s).candidates.every(c=>Number.isFinite(c.score)));const doc=configuration(s.setup);assert.deepEqual(parseConfiguration(JSON.stringify(doc)),doc);
});
test('Combat refinement: paused utility override is validated, logged and reconstructs exactly',()=>{
 const s=createRace(tacticalScenario('ram'));queueOverride(s,{target:'autonomous',path:'utility.combatSelfRisk',value:8},{paused:true});step(s);assert.equal(s.autonomous.utility.combatSelfRisk,8);assert.equal(verifyReplay(capture(s)).checksum,digest(s));
});
test('Combat refinement: strong perception constraints and stable target ties preserve permutation and replay',()=>{
 for(const kind of ['weapon','ram','damaged']){const setup=tacticalScenario(kind),a=createRace(setup),b=createRace(setup);b.entrants.reverse();for(let i=0;i<100;i++){step(a);step(b);}assert.equal(digest(a),digest(b));assert.equal(verifyReplay(capture(a)).checksum,digest(a));assert.notEqual(a.status,'Error');}
});
test('Combat refinement: chance model respects contested tie rule, bounded triangular noise and no simulation RNG',()=>{
 assert.equal(contestChance(0,0),0);assert.equal(contestChance(1,0),1);assert.equal(contestChance(-16,8),0);assert.equal(contestChance(16,8),1);assert.equal(contestChance(0,8),.5);assert.equal(contestChance(-8,8),.125);
 const s=createRace(tacticalScenario('ram')),r=s.entrants[0],p=perceive(s,r),before=capture(s);combatValue('ram',r,p.neighbors[0],p,s.config,s.consequence,s.autonomous.utility,1);assert.deepEqual(capture(s),before);
});

test('Combat refinement: extreme legal closing speed cannot hide catastrophic recoil behind capped benefit terms',()=>{
 const setup=tacticalScenario('ram');setup.entrants[1].speed=200;const s=createRace(setup);step(s);const d=first(s);assert.notEqual(d.chosen.position,'ram');assert.ok(d.candidates.find(c=>c.action==='ram').assessment.selfDamage>100);
});
