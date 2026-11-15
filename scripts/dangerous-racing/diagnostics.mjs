import {mkdirSync,writeFileSync} from 'node:fs';import {gzipSync} from 'node:zlib';
import {createRace,step,capture,digest,assertState} from '../../src/sim/race.js';
import {derive,defaultRU} from '../../src/model/ru.js';import {decide} from '../../src/ai/driver.js';
import {eligibleCombat,queueImpact,flushImpacts,updateControl,recoverControl,retire,resolveAttacks} from '../../src/sim/consequences.js';
import {verifyReplay} from '../../src/replay/replay.js';import {profile} from './scenarios.mjs';
const out='docs/phase2/dangerous-racing';mkdirSync(out+'/mechanisms',{recursive:true});
const refresh=s=>r=>r.derived=derive(r.ru,{...s.config,grip:s.config.grip*s.environment.grip,speedReference:s.config.speedReference/s.environment.rolling,crowdMorale:s.environment.crowdMorale});
export function duel(seed=1,{mode='reference',gap=0,lanes=[0,1],patch=()=>{},speed=[10,10],weather='Clear'}={}){const a=defaultRU('A'),b=defaultRU('B');profile(a,'aggressive');profile(b,'cautious');patch(a,b);return createRace({seed,format:'Combat',driverMode:mode,weather,checkpointInterval:10000,entrants:[{ru:a,lane:lanes[0],q:-2.5,speed:speed[0]},{ru:b,lane:lanes[1],q:-2.5+gap,speed:speed[1]}]});}
const aiCases={both:{},weaponOnly:{gap:1},neither:{gap:-3},heavyFavorable:{patch:(a,b)=>{a.chariot.weight=320;b.chariot.weight=110;a.chariot.protection=80;b.chariot.protection=10;}},lightVsHeavy:{patch:(a,b)=>{a.chariot.weight=110;b.chariot.weight=320;a.chariot.protection=10;b.chariot.protection=80;}},highAggressionLowOpportunity:{patch:a=>Object.assign(a.driver.personality,{aggression:100,opportunism:0,caution:0,patience:0})},highOpportunityLowAggression:{patch:a=>Object.assign(a.driver.personality,{aggression:0,opportunism:100,caution:20})},damaged:{patch:a=>{a.chariot.condition=25;a.driver.condition=45;}},valuablePosition:{gap:-.5},compromisedControl:{forced:s=>{s.entrants[0].instability=45;updateControl(s,s.entrants[0],'diagnostic forced instability');}},existingRamGoal:{forced:s=>{s.entrants[0].ai.goal='ram';s.entrants[0].ai.goalUntil=100;}},existingAttackGoal:{forced:s=>{s.entrants[0].ai.goal='attack';s.entrants[0].ai.goalUntil=100;}}};
const ai=[];const physical=[];const replays=[];
for(const [name,options] of Object.entries(aiCases))for(let seed=1;seed<=64;seed++){
 const s=duel(seed,{...options,mode:'autonomous'});options.forced?.(s);const initial={eligible:{attack:eligibleCombat(s,...s.entrants,'attack'),ram:eligibleCombat(s,...s.entrants,'ram')},derived:s.entrants.map(r=>r.derived)};
 for(let t=0;t<100&&!['Ended','Error','Stalled'].includes(s.status);t++)step(s);
 const record=capture(s),decision=s.events.find(e=>e.type==='AI_DECISION'&&e.participants[0]==='A');
 ai.push({id:`AI-${name}-${seed}`,name,seed,forcedState:!!options.forced,initial,decision:decision?.effects,execution:s.events.filter(e=>e.type==='AI_EXECUTION_RESULT'&&e.participants[0]==='A'),attacks:s.events.filter(e=>e.type==='ATTACK').map(e=>({time:e.time,...e.effects})),consequences:s.events.filter(e=>['DAMAGE','CONTROL_CHANGED','WRECK_CREATED','RU_RETIRED'].includes(e.type)),final:s.entrants.map(r=>({id:r.id,q:r.q,speed:r.speed,control:r.control,condition:r.ru.driver.condition,chariot:r.ru.chariot.condition})),checksum:digest(s)});
 if(seed===1&&!options.forced&&['both','heavyFavorable','highAggressionLowOpportunity'].includes(name)){verifyReplay(record);writeFileSync(`${out}/evidence/AI-${name}-1.replay.json.gz`,gzipSync(JSON.stringify(record)));replays.push({id:`AI-${name}-1`,checksum:record.checksum,events:record.events.length});}
}
const physicalCases={standard:{},heavyIntoLight:{patch:(a,b)=>{a.chariot.weight=320;b.chariot.weight=110;}},lightIntoHeavy:{patch:(a,b)=>{a.chariot.weight=110;b.chariot.weight=320;}},closing10:{speed:[20,10]},closing20:{speed:[30,10]},protected:{patch:(a,b)=>b.chariot.protection=90},unprotected:{patch:(a,b)=>b.chariot.protection=10},durable:{patch:(a,b)=>b.chariot.durability=90},stable:{patch:(a,b)=>b.chariot.stability=90},maneuverable:{patch:(a,b)=>b.chariot.maneuverability=90},driverDriving:{patch:(a,b)=>b.driver.driving=90},driverHandling:{patch:(a,b)=>b.driver.beastHandling=90},driverCombat:{patch:(a,b)=>b.driver.combat=90},driverAwareness:{patch:(a,b)=>b.driver.awareness=90},driverNerve:{patch:(a,b)=>b.driver.nerve=90},strongAttacker:{patch:(a,b)=>{a.driver.combat=90;a.equipment.combat=60;b.driver.combat=25;b.driver.driving=25;}},wornTarget:{patch:(a,b)=>b.chariot.condition=20},lowSkillTarget:{patch:(a,b)=>{b.driver.driving=20;b.driver.beastHandling=20;b.driver.combat=20;}},mud:{weather:'Heavy Rain/Mud'}};
for(const [name,options] of Object.entries(physicalCases))for(let seed=1;seed<=32;seed++)for(const action of ['attack','ram','none']){
 const s=duel(seed,options),initial=s.entrants.map(r=>({id:r.id,derived:r.derived,ru:structuredClone(r.ru)}));
 for(let t=0;t<100&&!['Ended','Error','Stalled'].includes(s.status);t++)step(s,t===0&&action!=='none'?[{type:'attack',id:'A',target:'B',action}]:[]);
 assertState(s);const record=capture(s);
 physical.push({id:`PH-${name}-${seed}-${action}`,name,seed,action,initial,setup:s.setup,events:s.events.filter(e=>['ATTACK','ATTACK_INVALIDATED','REACTION','DAMAGE','CONTACT','CONTROL_CHANGED','WRECK_CREATED','RU_RETIRED','INCIDENT_IMPACT'].includes(e.type)),final:s.entrants.map(r=>({id:r.id,q:r.q,speed:r.speed,condition:r.ru,derived:r.derived,control:r.control,physical:r.physical})),checksum:digest(s)});
 if(seed===1&&['heavyIntoLight','strongAttacker'].includes(name)&&action!=='none'){verifyReplay(record);writeFileSync(`${out}/evidence/PH-${name}-1-${action}.replay.json.gz`,gzipSync(JSON.stringify(record)));replays.push({id:`PH-${name}-1-${action}`,checksum:record.checksum,events:record.events.length});}
}
// Isolated exposure series: imposed contacts are NOT ordinary race outcomes.
const accumulation=[];
for(const kind of ['weapon','ram','rear','side','wreck'])for(const condition of [100,40,15])for(const closing of [0,10,25])for(let seed=1;seed<=16;seed++){
 const s=duel(seed,{patch:(a,b)=>{a.driver.combat=90;a.equipment.combat=60;b.driver.combat=25;b.driver.driving=25;b.chariot.condition=condition;}});const [a,b]=s.entrants;const initial=structuredClone(s.setup);
 if(kind==='wreck')retire(s,b,'forced diagnostic obstruction');
 for(let hit=0;hit<30&&a.physical==='Live'&&(b.physical==='Live'||kind==='wreck');hit++){
  s.time=hit*1.25;s.tick=hit*25;s.impactsThisTick=0;s.contacts=[];a.nextAttackTime=0;b.reactionsRemaining=s.consequence.reactionBudget;
  recoverControl(s,a,1.25);recoverControl(s,b,1.25);
  if(kind==='weapon')resolveAttacks(s,[{id:'A',target:'B',action:'attack'}],refresh(s));
  else {queueImpact(s,a,b,'imposed diagnostic '+kind,{side:kind==='ram'||kind==='side',ram:kind==='ram',speeds:new Map([['A',10+closing],['B',10]])});flushImpacts(s,refresh(s));}
 }
 accumulation.push({id:`AC-${kind}-${condition}-${closing}-${seed}`,kind,condition,closing,seed,forcedExposure:true,setup:initial,events:s.events,final:s.entrants.map(r=>({id:r.id,physical:r.physical,control:r.control,ru:r.ru,instability:r.instability}))});
}
writeFileSync(out+'/mechanisms/ai.json.gz',gzipSync(JSON.stringify(ai)));
writeFileSync(out+'/mechanisms/physical.json.gz',gzipSync(JSON.stringify(physical)));
writeFileSync(out+'/mechanisms/imposed-exposure.json.gz',gzipSync(JSON.stringify(accumulation)));
writeFileSync(out+'/evidence/mechanism-replays.json',JSON.stringify(replays,null,2));
console.log(JSON.stringify({ai:ai.length,physical:physical.length,imposedExposure:accumulation.length,replays:replays.length,ramFirstChoices:ai.filter(r=>r.decision?.chosen.position==='ram').map(r=>r.id)}));
