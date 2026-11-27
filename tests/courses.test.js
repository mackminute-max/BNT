import {test} from 'node:test';import assert from 'node:assert/strict';
import {createRace,step,run,capture,digest,classification,issueSign,assertState} from '../src/sim/race.js';
import {track,point,location,key,gap} from '../src/track/oval.js';
import {config, VERSION} from '../src/config/config.js';import {coursePresets,normalizeCourse} from '../src/track/course.js';
import {defaultRU} from '../src/model/ru.js';import {verifyReplay} from '../src/replay/replay.js';
import {configuration,parseConfiguration} from '../src/dev/configuration.js';import {retire,eligibleCombat} from '../src/sim/consequences.js';
import {perceive} from '../src/ai/driver.js';import {results} from '../src/reporting/results.js';
function straightCourse(){return {id:'test-rally',name:'Straight test rally',kind:'Rally',closed:false,lanes:4,segments:[{id:'start',length:8,tiles:8,turn:0,next:'finish'},{id:'finish',length:8,tiles:8,turn:0,next:null}],checkpoints:[{id:'a',distance:4.25},{id:'b',distance:8.5},{id:'c',distance:12.75}]};}
const setup=(course,extra={})=>({course,checkpointInterval:10000,...extra});
const until=(s,p,max=30000)=>{while(!p(s)&&!['Ended','Stalled','Error'].includes(s.status)&&s.tick<max)step(s);assert.notEqual(s.status,'Error');};

test('Courses: four irregular presets validate; closed geometry has continuous position and heading',()=>{
 for(const id of Object.keys(coursePresets)){const c=config(),t=track(c,id);assert.equal(t.lanes,4);assert.ok(t.segments.some(s=>s.direction===1));assert.ok(t.segments.some(s=>s.direction===-1));
 for(const s of t.segments.slice(0,-1)){const q=s.start+s.tiles-t.offset;for(let lane=0;lane<4;lane++){const a=point(q-1e-8,lane,c,t),b=point(q+1e-8,lane,c,t);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<1e-5);}}
 if(t.closed)for(let lane=0;lane<4;lane++)assert.ok(Math.hypot(point(0,lane,c,t).x-point(t.cells,lane,c,t).x,point(0,lane,c,t).y-point(t.cells,lane,c,t).y)<1e-8);
 }
});
test('Courses: lane arc distance and rendering derivatives agree; right/left inner lanes reverse',()=>{
 const c=config(),t=track(c,'technical-circuit');for(const s of t.segments.filter(s=>s.type==='turn')){const q=s.start+s.tiles/2-t.offset;const inner=location(q,3,c,t).length,outer=location(q,0,c,t).length;assert.equal(inner<outer,s.direction===1);
 for(let lane=0;lane<4;lane++){const a=point(q,lane,c,t),b=point(q+1e-5,lane,c,t);assert.ok(Math.abs(Math.hypot(a.x-b.x,a.y-b.y)/1e-5-location(q,lane,c,t).length)<1e-6);}}
});
test('Courses: malformed segments, connections, topology, surfaces, checkpoints and closure reject',()=>{
 const mutations=[x=>x.segments=[],x=>x.segments[0].length=0,x=>x.segments[1].id='start',x=>x.segments[0].next='missing',x=>x.closed=true,x=>x.segments[0].surface={grip:NaN},x=>x.segments[0].surface={alien:1},x=>x.checkpoints[0].distance=-1,x=>x.checkpoints[1].distance=x.checkpoints[0].distance,x=>x.checkpoints[2].distance=16,x=>x.lanes=3,x=>x.segments.at(-1).turn=90];
 for(const change of mutations){const x=straightCourse();change(x);assert.throws(()=>createRace(setup(x)));}
 const closed=structuredClone(coursePresets['technical-circuit']);closed.segments[0].length+=10;assert.throws(()=>createRace(setup(closed)),/connect/);
 const narrow=structuredClone(coursePresets['technical-rally']);narrow.segments[1].length=1;assert.throws(()=>createRace(setup(narrow)),/radius/);
});
test('Courses: eight aligned stationary grid entrants and mass start operate for every preset',()=>{
 for(const id of Object.keys(coursePresets)){const s=createRace(setup(id));assert.equal(s.entrants.length,8);assert.ok(s.entrants.every(r=>r.speed===0));assert.deepEqual(s.entrants.map(r=>r.q),[-.5,-.5,-.5,-.5,-2.5,-2.5,-2.5,-2.5]);step(s);assert.equal(s.events.filter(e=>e.type==='RACE_STARTED').length,1);assertState(s);}
});
test('Courses: open keys, perception, hazard and combat range never wrap finish back to start',()=>{
 const s=createRace(setup(straightCourse()));assert.notEqual(key(0,0,s.track),key(s.track.cells,0,s.track));assert.equal(gap(0,s.track.cells,s.track),s.track.cells);
 s.entrants=s.entrants.slice(0,2);const [a,b]=s.entrants;b.q=s.track.cells-.1;a.q=-.5;s.format='Combat';assert.equal(eligibleCombat(s,a,b,'attack'),false);assert.equal(perceive(s,a).neighbors.length,0);
});
test('Courses: Rally terminal finish locks full precision, no laps, rear row physical disadvantage and safe exit',()=>{
 const s=run(createRace(setup(straightCourse(),{driverMode:'reference',consequence:{incidentRate:0}})));assert.equal(s.status,'Ended');const a=classification(s);assert.ok(a.every(r=>r.completedLaps===0&&r.status==='Finished'));assert.ok(s.entrants.every(r=>r.q===s.track.cells+s.config.exitTiles&&r.physical==='Exited'));assert.ok(a.find(r=>r.id==='RU5').time>a.find(r=>r.id==='RU1').time);assert.ok(a.some(r=>r.time!==Math.round(r.time*1000)/1000));assert.equal(s.events.filter(e=>e.type==='LAP_COMPLETED').length,0);
});
test('Courses: Rally pre-signal sign activates at start and one cursor crosses each checkpoint once',()=>{
 const s=createRace(setup(straightCourse()));issueSign(s,'queue','Push the Pace');step(s);assert.equal(s.entrants[0].signs.active,'Push the Pace');run(s);for(const r of s.entrants){assert.equal(r.checkpointCursor,3);assert.equal(s.events.filter(e=>e.type==='CHECKPOINT_CROSSED'&&e.participants[0]===r.id).length,3);}assert.equal(s.events.filter(e=>e.type==='SIGN_ACTIVATED').length,1);assert.equal(s.entrants[0].signs.remaining,2);assert.equal(verifyReplay(capture(s)).checksum,digest(s));
});
test('Courses: in-race Rally signs wait for checkpoints, replacements and lowering retain accounting',()=>{
 const s=createRace(setup(straightCourse()));step(s);issueSign(s,'queue','Push the Pace');assert.equal(s.entrants[0].signs.active,null);until(s,x=>x.entrants[0].checkpointCursor===1);assert.equal(s.entrants[0].signs.active,'Push the Pace');issueSign(s,'queue','Conserve Strength');issueSign(s,'queue','Hold Position');assert.equal(s.entrants[0].signs.remaining,0);assert.equal(s.entrants[0].signs.active,'Push the Pace');until(s,x=>x.entrants[0].checkpointCursor===2);assert.equal(s.entrants[0].signs.active,'Hold Position');issueSign(s,'lower');assert.equal(s.entrants[0].signs.active,null);assert.equal(verifyReplay(capture(s)).checksum,digest(s));
});
test('Courses: a Rally sign queued after last checkpoint remains pending and never activates at terminal',()=>{
 const s=createRace(setup(straightCourse()));until(s,x=>x.entrants[0].checkpointCursor===3);issueSign(s,'queue','Conserve Strength');run(s);assert.equal(s.entrants[0].signs.active,null);assert.equal(s.entrants[0].signs.pending,'Conserve Strength');assert.equal(s.entrants[0].signs.remaining,2);assert.equal(s.events.filter(e=>e.type==='SIGN_ACTIVATED').length,0);assert.equal(verifyReplay(capture(s)).checksum,digest(s));
});
test('Courses: fractional checkpoints and several tile boundaries resolve chronologically in one tick',()=>{
 const course=straightCourse();course.checkpoints=[{id:'a',distance:.25},{id:'b',distance:.5},{id:'c',distance:.75}];const ru=defaultRU('A');const s=createRace(setup(course,{driverMode:'reference',entrants:[{ru,lane:0,q:-1.5,speed:60}],overrides:{dt:.1}}));step(s);assert.equal(s.entrants[0].checkpointCursor,3);const cp=s.events.filter(e=>e.type==='CHECKPOINT_CROSSED');assert.deepEqual(cp.map(e=>e.effects.q),[.25,.5,.75]);assert.ok(cp[0].time<cp[1].time&&cp[1].time<cp[2].time);assert.ok(s.entrants[0].q>4);assertState(s);assert.equal(verifyReplay(capture(s)).checksum,digest(s));
});
test('Courses: Circuit line activation preserves initial entry and full completed laps',()=>{
 const s=createRace(setup('technical-circuit',{overrides:{laps:1}}));step(s);issueSign(s,'queue','Conserve Strength');until(s,x=>x.entrants[0].hasEnteredCourse);assert.equal(s.entrants[0].completedLaps,0);assert.equal(s.entrants[0].signs.active,'Conserve Strength');run(s);assert.ok(s.entrants.every(r=>r.completedLaps===1&&r.finishTime!==null));
});
test('Courses: terrain applies existing movement/fatigue model and survives configuration roundtrip',()=>{
 const a=straightCourse(),b=straightCourse();b.segments.forEach(s=>s.terrain='mud');const fast=run(createRace(setup(a))),slow=run(createRace(setup(b)));assert.ok(slow.entrants[0].finishTime>fast.entrants[0].finishTime);assert.ok(slow.entrants[0].finishSnapshot.beasts[0].fatigue>fast.entrants[0].finishSnapshot.beasts[0].fatigue);const doc=configuration(slow.setup);assert.deepEqual(parseConfiguration(JSON.stringify(doc)),doc);
});
test('Courses: wreck occupancy across a segment boundary blocks movement without phasing',()=>{
 const course=straightCourse(),s=createRace(setup(course,{driverMode:'reference',entrants:[{ru:defaultRU('A'),lane:0,q:-.5,speed:50},{ru:defaultRU('B'),lane:0,q:-2.5,speed:50}]}));const [a,b]=s.entrants;a.q=8;a.speed=0;b.q=6.9;retire(s,a,'test boundary wreck');step(s);assert.ok(b.q<8);assert.equal(a.q,8);assert.equal(a.physical,'Wreck');assert.ok(s.events.some(e=>e.type==='WRECK_IMPACT'));assertState(s);
});
test('Courses: deterministic full races, storage permutation and selected-track replay',()=>{
 for(const course of Object.keys(coursePresets)){const setupDoc=setup(course,{format:'Combat',overrides:{laps:1}}),a=createRace(setupDoc),b=createRace(setupDoc);b.entrants.reverse();run(a);run(b);assert.equal(a.status,'Ended');assert.equal(digest(a),digest(b));assert.equal(verifyReplay(capture(a)).checksum,digest(a));assert.ok(results(a).technical.track);}
});

test('Courses: multiple distinct segments, checkpoints, finish and terminal exit can resolve in one tick',()=>{
 const course=straightCourse();course.segments=[{id:'start',length:1,tiles:8,turn:0,next:'s1'},{id:'s1',length:1,tiles:1,turn:0,next:'s2'},{id:'s2',length:1,tiles:1,turn:0,next:'finish'},{id:'finish',length:1,tiles:1,turn:0,next:null}];course.checkpoints=[{id:'a',distance:.5},{id:'b',distance:1.5},{id:'c',distance:2.5}];
 const s=createRace(setup(course,{driverMode:'reference',consequences:false,entrants:[{ru:defaultRU('A'),q:-.5,lane:0,speed:100}],overrides:{dt:.1}}));step(s);assert.equal(s.status,'Ended');assert.equal(s.entrants[0].physical,'Exited');assert.equal(s.entrants[0].q,14);assert.equal(s.events.filter(e=>e.type==='SEGMENT_ENTERED').length,3);assert.equal(s.entrants[0].checkpointCursor,3);assert.ok(s.entrants[0].finishTime<.1);assert.equal(verifyReplay(capture(s)).checksum,digest(s));
});
test('Courses: precise simultaneous Rally finish ties use unchanged tolerance and a common terminal line',()=>{
 const entrants=[0,1,2,3].map(i=>({ru:defaultRU('R'+i),lane:i,q:-.5}));const s=run(createRace(setup(straightCourse(),{driverMode:'reference',entrants})));assert.deepEqual(classification(s).map(r=>r.place),[1,1,1,1]);assert.equal(new Set(s.entrants.map(r=>r.finishTime)).size,1);
});
test('Courses: combat actions and bilateral damage work on every new geometry; Pure remains prohibited',async()=>{
 const {tacticalScenario}=await import('../scripts/combat-ai-refinement/scenarios.mjs');for(const course of Object.keys(coursePresets))for(const format of ['Pure','Combat']){const s=createRace({...tacticalScenario('ram'),course,format});step(s);if(format==='Combat'){assert.ok(s.events.some(e=>e.type==='ATTACK'&&e.effects.action==='ram'));assert.equal(s.events.filter(e=>e.type==='DAMAGE'&&e.effects.kind==='ram').length,2);}else assert.equal(s.events.filter(e=>e.type==='ATTACK').length,0);assertState(s);}
});
test('Courses: terminal wreck obstruction preserves finished classification; schema 1 stalls, schema 2 ends the race',()=>{
 for(const schema of [1,null]){const s=createRace(setup(straightCourse(),{driverMode:'reference',entrants:[{ru:defaultRU('A'),lane:0,q:-.5,speed:2},{ru:defaultRU('B'),lane:0,q:-2.5}],overrides:{stallTime:1,...(schema?{schema}:{})}}));const [a,b]=s.entrants;a.q=15.8;a.hasEnteredCourse=true;b.q=17;retire(s,b,'forced terminal obstruction');until(s,x=>x.entrants[0].finishTime!==null);const time=a.finishTime,snapshot=a.finishSnapshot;run(s);assert.equal(s.status,schema===1?'Stalled':'Ended');assert.equal(a.status,'Finished');assert.equal(a.finishTime,time);assert.deepEqual(a.finishSnapshot,snapshot);assert.equal(b.q,17);assert.equal(b.physical,'Wreck');assert.ok(a.q<17);assertState(s);}
});
test('Courses: static course preview is visible, hidden hazards remain hidden, and left/right lane utility follows geometry',()=>{
 for(const direction of [-1,1]){const s=createRace(setup('technical-circuit')),r=s.entrants[0],turn=s.track.segments.find(x=>x.direction===direction);r.q=turn.start+1-s.track.offset;r.lane=1;s.autonomous={...s.autonomous,noise:0,executionError:0,judgmentError:0,stressError:0,utility:{...s.autonomous.utility,courseLaneRisk:0}};s.hazards=[{id:'hidden',lane:1,q:r.q+30}];s.entrants=s.entrants.slice(0,1);step(s);const d=s.events.find(e=>e.type==='AI_DECISION').effects;assert.equal(d.perceived.course.corner.direction,direction);assert.equal(d.perceived.hazards.length,0);const inward=d.candidates.find(c=>c.action==='inward'),outward=d.candidates.find(c=>c.action==='outward');assert.equal((outward.terms.distance>inward.terms.distance),direction===1);}
});
test('Courses: existing latest oval configurations migrate explicitly; old replays remain version specific',()=>{
 const old=configuration({});old.version='0.4.3-combat-ai';assert.equal(parseConfiguration(JSON.stringify(old)).version,VERSION);const altered=configuration({course:'mixed-rally'});altered.version='0.4.3-combat-ai';assert.throws(()=>parseConfiguration(JSON.stringify(altered)),/version/);
});

test('Courses: Rally ignores closed-lap configuration in movement, finish, and combat racing priorities',()=>{
 const a=run(createRace(setup('technical-rally',{format:'Combat',overrides:{laps:1}}))),b=run(createRace(setup('technical-rally',{format:'Combat',overrides:{laps:7}})));assert.deepEqual(a.events,b.events);assert.deepEqual(a.rng,b.rng);assert.deepEqual(classification(a),classification(b));assert.equal(a.status,'Ended');
});

test('Courses: malformed course scalar cannot silently select the oval adapter',()=>{
 for(const course of [false,0,'',[],{},'unknown'])assert.throws(()=>createRace({course}));assert.equal(createRace({course:'oval'}).track.course,undefined);
});
test('Courses: checkpoint-triggered Push diagnostics and technical compliance describe the applied pace',()=>{
 const ru=defaultRU('A');ru.driver.personality={aggression:100,caution:0,patience:0,opportunism:0,staminaManagement:0,tacticalDiscipline:100};const s=createRace(setup(straightCourse(),{entrants:[{ru,lane:0,q:-.5}]}));step(s);issueSign(s,'queue','Push the Pace');until(s,x=>x.entrants[0].checkpointCursor===1);const r=s.entrants[0];assert.equal(r.signs.active,'Push the Pace');assert.equal(r.ai.diagnostics.effective.pace,'Push');assert.equal(r.ai.diagnostics.physicalOutcome.pace.status,'Applied');assert.equal(r.ai.diagnostics.compliance,'Followed');assert.ok(results(s).technical.signCompliance.Followed>0);assert.equal(verifyReplay(capture(s)).checksum,digest(s));
});

test('Courses: lethal contact before terminal prevents a finish, post-terminal collision keeps its locked time',()=>{
 for(const after of [false,true]){const s=createRace(setup(straightCourse(),{driverMode:'reference',entrants:[{ru:defaultRU('A'),lane:0,q:-.5},{ru:defaultRU('B'),lane:0,q:-2.5}],overrides:{dt:1},consequence:{incidentRate:0,damageScale:10,frontDriver:1,frontBeasts:0,frontChariot:0}}));const [a,b]=s.entrants;a.q=15.8;a.speed=30;a.hasEnteredCourse=true;b.q=after?17.5:16.5;retire(s,b,'forced finish obstruction');step(s);if(after){assert.equal(a.status,'Finished');assert.ok(a.finishTime>0);assert.ok(s.events.find(e=>e.type==='RU_FINISHED').time<s.events.find(e=>e.type==='DAMAGE'&&e.participants[0]==='A').time);}else{assert.equal(a.status,'Retired');assert.equal(a.finishTime,null);}assert.equal(a.physical,'Wreck');assertState(s);}
});
test('Courses: legal adjacent lane change at a segment boundary retains continuous speed and progress',()=>{
 const make=()=>createRace(setup(straightCourse(),{driverMode:'reference',entrants:[{ru:defaultRU('A'),lane:0,q:-.5,speed:10}]}));const a=make(),b=make();a.entrants[0].q=b.entrants[0].q=7.99;step(a,[{type:'lane',id:'A',lane:1}]);step(b);assert.equal(a.entrants[0].lane,1);assert.equal(a.entrants[0].q,b.entrants[0].q);assert.equal(a.entrants[0].speed,b.entrants[0].speed);assert.ok(a.events.some(e=>e.type==='SEGMENT_ENTERED'&&e.effects.segment==='finish'));assertState(a);
});
