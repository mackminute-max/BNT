import {driverPersonalities} from './personalities.js';
import {createRace,step,issueSign,digest,classification} from '../sim/race.js';
import {clearedNativeResult} from '../sim/foundation/checkpoint.js';
import {generateRally} from '../track/rally-generator.js';
import {normalizeCourse} from '../track/course.js';
import {meanFatigue,pacingProfiles,PACING_VERSION} from './pacing.js';
import {compileBuild} from './builds.js';
import {BOONS,STYLES,ENDOWMENT_RULES} from '../sim/endowments.js';
import {random as qrRandom} from '../core/determinism.js';
export const PROTOTYPE_VERSION='p1.4-playable-v1';
export function prototypeRally(category,seed){
 const course=generateRally({seed,category}),fractions=({short:[1/2],medium:[1/3,2/3],long:[1/4,1/2,3/4]})[category];
 const length=course.segments.reduce((n,s)=>n+s.length,0);course.signPointPolicy={version:1,category};course.checkpoints=fractions.map((f,i)=>({id:'SP'+(i+1),distance:length*f}));return normalizeCourse(course);
}
export function testBoons(kind,seed,id,level=1){const all=Object.values(BOONS),lv=Math.max(1,Math.min(4,Math.round(level)||1));let pick;if(STYLES.includes(kind))pick=all.filter(b=>b.style===kind);else if(kind==='random')pick=all.map(b=>[qrRandom(seed,'qr-boon:'+id+':'+b.id),b]).sort((a,b)=>a[0]-b[0]).slice(0,3).map(x=>x[1]);else if(BOONS[kind])pick=[BOONS[kind]];else throw Error('Unknown test Boons');return {rules:ENDOWMENT_RULES,boons:pick.map(b=>({id:b.id,level:lv,rarity:'Common'}))};}
export function raceSetup({course='short-oval',seed=145,format='Pure',weather='Clear',build='baseline',value=55,coaching=null,fieldSize=8,laps=2,pacing='competitive',personality='native',nativeSetup=null,boons='',rivalBoons='',boonLevel=1}={}){
 if(nativeSetup!==null){if(!(typeof BNT_M6_BUILD!=='undefined'&&BNT_M6_BUILD))throw Error('Owned practice setup unavailable');const native=createRace(nativeSetup);if(native.entrants.length!==1||native.setup.course!=='short-oval'||native.config.laps!==3||native.format!=='Pure'||native.championshipContext||native.entrants[0].progressionContext?.abilityId!==null)throw Error('Invalid owned practice setup');return {setup:native.setup,changes:[]};}
 if(!Number.isInteger(fieldSize)||fieldSize<1||fieldSize>8)throw Error('Field must contain 1..8 entrants');
 if(!Number.isFinite(value)||value<0||value>100)throw Error('Base attributes must be 0..100');
 const profile=pacingProfiles[pacing];if(!profile)throw Error('Unknown prototype pacing profile');
 const definition=course.startsWith('rally-')?prototypeRally(course.slice(6),seed):course;
 const initial=createRace({seed,course:definition,format,weather,overrides:{laps}});
 const entrants=structuredClone(initial.setup.entrants.slice(0,fieldSize)),player=entrants[0];
 // Normalize a configurable immutable baseline without touching rival attributes/personality.
 for(const part of [player.ru.driver,...player.ru.beasts,player.ru.chariot])for(const key of Object.keys(part))if(!['condition','strain','fatigue','wear','weight','capacity','personality'].includes(key))part[key]=value;
 const compiled=compileBuild(player.ru,build);player.ru=compiled.ru;if(personality!=='native'){if(!driverPersonalities[personality])throw Error('Unknown driver personality');player.ru.driver.personality=structuredClone(driverPersonalities[personality]);}
 if(coaching??compiled.coachingContext)player.coachingContext=coaching??compiled.coachingContext;
 // Quick Race test Boons: a whole style, or three seeded random Boons.
 if(boons)player.endowments=testBoons(boons,seed,player.ru.id,boonLevel);if(rivalBoons)for(const e of entrants.slice(1))e.endowments=testBoons(rivalBoons,seed,e.ru.id,boonLevel);
 return {setup:{seed,course:definition,format,weather,autonomous:profile.autonomous,overrides:{laps,tuning:profile.tuning},entrants,playerId:player.ru.id},changes:compiled.changes};
}
export class PlayableSession{
 constructor(options={}){const {setup,changes}=raceSetup(options);this.options=structuredClone(options);this.setup=structuredClone(setup);this.changes=changes;this.state=createRace(setup);this.previousFatigue=null;this.inputs=[];this.timings=[];this.maxTickMs=0;this.totalTickMs=0;}
 tick(){if(['Ended','Stalled','Error'].includes(this.state.status))return false;this.previousFatigue=meanFatigue(this.state.entrants.find(r=>r.id===this.state.playerId).ru);const t=performance.now();step(this.state);const ms=performance.now()-t;this.maxTickMs=Math.max(ms,this.maxTickMs);this.totalTickMs+=ms;this.timings.push(ms);if(this.timings.length>2000)this.timings.shift();return true;}
 sign(action,sign){const tick=this.state.tick,order=this.inputs.length;const accepted=issueSign(this.state,action,sign);this.inputs.push({tick,order,action,sign,accepted});return accepted;}
 official(){try{return {cleared:true,...clearedNativeResult(this.state)};}catch(error){return {cleared:false,reason:error.message};}}
 metrics(){const s=this.state,p=s.entrants.find(r=>r.id===s.playerId),events=s.events.filter(e=>e.participants.includes(p.id)),actions={};for(const e of events)if(e.type==='AI_DECISION'){for(const a of Object.values(e.effects.executed??e.effects.chosen??{}))if(typeof a==='string')actions[a]=(actions[a]??0)+1;}
 return {version:PROTOTYPE_VERSION,pacingVersion:this.options.pacing==='legacy'?'legacy':this.options.pacing==='endurance'?'p1.1-endurance-v1':(this.options.pacing??'competitive')==='competitive'?'p1.2-competitive-v1':PACING_VERSION,seed:s.seed,format:s.format,build:this.options.build??'baseline',tick:s.tick,status:s.status,clearance:this.official(),checksum:digest(s),official:classification(s),player:{id:p.id,actions,finishTime:p.finishTime,status:p.status,driver:p.ru.driver.condition,chariot:p.ru.chariot.condition,beastFatigue:p.ru.beasts.map(b=>b.fatigue),wear:p.ru.chariot.wear,contacts:events.filter(e=>e.type==='CONTACT').length,attacks:events.filter(e=>e.type==='ATTACK').length,overtakes:events.filter(e=>e.type==='OVERTAKE'&&e.effects.passer===p.id).length,signs:events.filter(e=>e.type==='SIGN_ACTIVATED').length},maxTickMs:this.maxTickMs,totalTickMs:this.totalTickMs,events:s.events.length,inputs:structuredClone(this.inputs)};}
}
// Whole-tick bounded scheduling: keep debt; never alter native dt or drop owed ticks.
export function playback(session,accumulator,elapsed,speed,{budgetMs=8,maxTicks=40}={}){
 if(![accumulator,elapsed,speed].every(Number.isFinite)||accumulator<0||elapsed<0||speed<=0)throw Error('Invalid prototype playback clock');
 accumulator+=elapsed*speed;const t=performance.now();let count=0;
 while(accumulator+session.state.config.dt*1e-9>=session.state.config.dt&&count<maxTicks){if(!session.tick())break;accumulator=Math.max(0,accumulator-session.state.config.dt);count++;if(performance.now()-t>=budgetMs)break;}
 return {accumulator,count};
}
