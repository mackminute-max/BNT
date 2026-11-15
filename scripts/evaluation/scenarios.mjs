import { defaultRU } from '../../src/model/ru.js';
import { weatherPresets } from '../../src/sim/environment.js';

export const weatherNames = Object.keys(weatherPresets);
export const archetypes = {
  speed: [80,40,45,35,50,50], power: [45,85,40,35,45,50],
  handling: [45,40,80,40,60,35], endurance: [45,40,45,90,45,35], balanced: [50,50,50,50,50,50],
};
export const profiles = {
  aggressive: [85,25,35,70,35,50], cautious: [25,90,65,35,55,30],
  opportunistic: [60,30,30,95,35,50], disciplined: [40,45,50,40,35,90], balanced: [50,50,50,50,50,50],
};
const beastKeys=['speed','power','agility','endurance','discipline','toughness'];
const tendencyKeys=['aggression','caution','patience','opportunism','staminaManagement','tacticalDiscipline'];
export const signs=['Push the Pace','Conserve Strength','Seek Open Track','Race Defensively','Engage Rivals','Hold Position'];
function roster(kind='balanced', rotation=0) {
  const types=Object.keys(archetypes), personalities=Object.keys(profiles);
  return Array.from({length:8},(_,i)=>{
    const ru=defaultRU(`RU${i+1}`);
    const type=kind==='archetypes'?types[(i+rotation)%5]:'balanced';
    const profile=kind==='profiles'?personalities[(i+rotation)%5]:'balanced';
    ru.beasts.forEach(b=>beastKeys.forEach((k,j)=>b[k]=archetypes[type][j]));
    ru.driver.personality=Object.fromEntries(tendencyKeys.map((k,j)=>[k,profiles[profile][j]]));
    return {ru,lane:i%4,q:-.5-Math.floor(i/4)*2,speed:0};
  });
}
export function labels(kind, rotation=0) {
  return Object.fromEntries(Array.from({length:8},(_,i)=>[`RU${i+1}`,{
    archetype:kind==='archetypes'?Object.keys(archetypes)[(i+rotation)%5]:'balanced',
    profile:kind==='profiles'?Object.keys(profiles)[(i+rotation)%5]:'balanced',
  }]));
}
const singleSign = sign => sign ? [{on:'start', action:'queue', sign}] : [];
function lifecycle(cancel) {
  return [{on:'start',action:'queue',sign:'Push the Pace'},
    {on:'entry',action:'queue',sign:'Conserve Strength'},
    cancel?{on:'entry',delay:1,action:'cancel'}:{on:'entry',delay:1,action:'queue',sign:'Race Defensively'},
    ...(cancel?[{on:'entry',delay:2,action:'queue',sign:'Race Defensively'}]:[]),
    {on:'lap',lap:1,action:'lower'}];
}
export function buildJobs() {
  const jobs=[];
  function add(experiment, arm, format, weather, seed, block, extras={}) {
    const setup={seed,format,weather,checkpointInterval:10000,...extras.setup};
    jobs.push({id:`${experiment}-${format}-${block}-${arm}`,experiment,arm,format,weather,seed,block,
      setup,schedule:extras.schedule??[],labels:extras.labels??labels('balanced'),...(extras.metadata??{})});
  }
  for(const format of ['Pure','Combat']) {
    for(let w=0;w<5;w++)for(let r=0;r<20;r++){
      const weather=weatherNames[w];
      add('A','default',format,weather,1+r,`${w}-${r}`,{labels:Object.fromEntries(Array.from({length:8},(_,i)=>[`RU${i+1}`,{archetype:'default-graded',profile:'default-generated'}])),metadata:{rosterKind:'default'}});
      add('B','mixed-archetypes',format,weather,21+r,`${w}-${r}`,{setup:{entrants:roster('archetypes',r)},labels:labels('archetypes',r),metadata:{rosterKind:'archetypes'}});
      add('C','mixed-personalities',format,weather,41+r,`${w}-${r}`,{setup:{entrants:roster('profiles',r)},labels:labels('profiles',r),metadata:{rosterKind:'profiles'}});
    }
    for(const attribute of ['beasts.speed','beasts.power','beasts.agility','beasts.endurance','driver.driving'])for(let r=0;r<4;r++)for(const arm of ['control','plus10']){
      const entrants=roster();
      if(arm==='plus10'){
        const [object,key]=attribute.split('.');
        if(object==='beasts')entrants[0].ru.beasts.forEach(b=>b[key]+=10);else entrants[0].ru.driver[key]+=10;
      }
      add('S',`${attribute}-${arm}`,format,[weatherNames[0],weatherNames[1],weatherNames[2],weatherNames[4]][r],61+r,`${attribute}-${r}`,
        {setup:{entrants},metadata:{attribute,treatment:arm,rosterKind:'sensitivity'}});
    }
    for(let w=0;w<5;w++)for(let r=0;r<4;r++){
      const seed=101+w*4+r, weather=weatherNames[w], block=`${w}-${r}`;
      for(const sign of [null,...signs.filter(s=>format==='Combat'||s!=='Engage Rivals')])
        add('D',sign??'none',format,weather,seed,block,{setup:{entrants:roster()},schedule:singleSign(sign),metadata:{rosterKind:'balanced'}});
      if(format==='Pure')add('D',r%2?'lifecycle-cancel':'lifecycle-replace',format,weather,seed,block,
        {setup:{entrants:roster()},schedule:lifecycle(r%2===1),metadata:{rosterKind:'balanced'}});
    }
    for(let w=0;w<5;w++)for(let r=0;r<2;r++)for(const arm of ['neutral','degraded']){
      const surfaces=arm==='degraded'?Object.fromEntries(['north','east','south','west'].map((id,i)=>[id,{grip:.7,roughness:.5,rollingResistance:1.1,hazardModifier:[2,1,.5,.5][i]}])):{};
      add('E',arm,format,weatherNames[w],71+w*2+r,`${w}-${r}`,{setup:{entrants:roster('archetypes',r),surfaces},labels:labels('archetypes',r),metadata:{rosterKind:'archetypes'}});
    }
  }
  // Interleave formats and experiments to retain balanced coverage if interrupted.
  return jobs.sort((a,b)=>a.block.localeCompare(b.block)||a.experiment.localeCompare(b.experiment)||a.arm.localeCompare(b.arm)||a.format.localeCompare(b.format));
}
export class SignSchedule {
  constructor(items=[]){this.items=items.map(x=>({...x,delay:x.delay??0}));this.fired=new Set();this.seen=new Map();}
  due(s){
    const r=s.entrants.find(x=>x.id===s.playerId), result=[];
    this.items.forEach((item,i)=>{
      if(this.fired.has(i))return;
      const eligible=item.on==='start'?s.tick===0:item.on==='tick'?s.tick>=item.tick:item.on==='entry'?r.hasEnteredCourse:item.on==='lap'?r.completedLaps>=item.lap:false;
      if(eligible&&!this.seen.has(i))this.seen.set(i,s.tick);
      if(this.seen.has(i)&&s.tick-this.seen.get(i)>=item.delay){result.push(item);this.fired.add(i);}
    });return result;
  }
}

// Follow-up declared after the primary panel exposed a front-row win ceiling.
export function buildSupplementJobs(){
 const jobs=[];for(const format of ['Pure','Combat'])for(let w=0;w<5;w++)for(let r=0;r<2;r++){
  const seed=201+w*2+r,weather=weatherNames[w],block=`${w}-${r}`;
  for(const sign of [null,...signs.filter(s=>format==='Combat'||s!=='Engage Rivals')])jobs.push({
   id:`Drear-${format}-${block}-${sign??'none'}`,experiment:'Drear',arm:sign??'none',block,format,weather,seed,
   setup:{seed,format,weather,entrants:roster(),playerId:'RU5',checkpointInterval:10000},schedule:singleSign(sign),labels:labels('balanced'),rosterKind:'balanced',
  });
 }return jobs.sort((a,b)=>a.block.localeCompare(b.block)||a.arm.localeCompare(b.arm)||a.format.localeCompare(b.format));
}
