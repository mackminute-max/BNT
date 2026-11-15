import {defaultRU} from '../../src/model/ru.js';
import {weatherNames,profiles} from '../evaluation/scenarios.mjs';
const keys=['aggression','caution','patience','opportunism','staminaManagement','tacticalDiscipline'];
export const cohorts=['healthy','mixed','high-risk'];
export function profile(ru,name){ru.driver.personality=Object.fromEntries(keys.map((k,i)=>[k,profiles[name][i]]));return ru;}
export function buildJob(cohort,r,w,format='Combat'){
 const weather=weatherNames[w],degraded=r%2===1,open=Math.floor(r/2)%2===1,rotation=r%8;
 const entrants=Array.from({length:8},(_,slot)=>{
  const identity=(slot+rotation)%8,ru=defaultRU('RU'+(identity+1),46+identity*2);
  const personality=cohort==='healthy'?'generated':identity%2?'cautious':'aggressive';
  if(personality!=='generated')profile(ru,personality);
  const equipment=cohort==='healthy'?'standard':['light','heavy','protected','exposed'][identity%4];
  if(cohort!=='healthy'){
   Object.assign(ru.chariot,{weight:equipment==='heavy'?320:equipment==='light'?110:180,stability:equipment==='heavy'?75:45,durability:equipment==='heavy'?80:45,protection:equipment==='protected'?90:equipment==='exposed'?10:45,maneuverability:equipment==='light'?80:45});
   ru.equipment.combat=identity%2?10:40;
   ru.chariot.condition=cohort==='high-risk'?20+(identity%4)*7:100-(identity%4)*15;
   ru.chariot.wear=cohort==='high-risk'?60:identity%4*10;
   ru.driver.condition=cohort==='high-risk'?65:100;
   ru.beasts.forEach(b=>b.condition=cohort==='high-risk'?70:100);
   if(cohort==='high-risk'){
    profile(ru,'aggressive');
    ru.driver.driving=25+identity*5;ru.driver.beastHandling=30+identity*5;ru.driver.awareness=25+identity*5;ru.driver.nerve=30+identity*5;
    ru.chariot.stability=20+identity*5;
   }
  }
  return {ru,lane:slot%4,q:-.5-Math.floor(slot/4)*(open?6:2),speed:0};
 });
 const surfaces=degraded?Object.fromEntries(['north','east','south','west'].map(id=>[id,{grip:.7,roughness:.5,rollingResistance:1.1,hazardModifier:1}])):{};
 const id=`DR-${cohort}-${r}-${w}-${format}`;
 return {id,experiment:cohort,arm:degraded?'degraded':'neutral',block:`${r}-${w}`,cohort,rotation,traffic:open?'spread-rows':'standard-grid',surface:degraded?'degraded':'neutral',setup:{seed:4100+r,format,weather,entrants,surfaces,checkpointInterval:10000},labels:Object.fromEntries(entrants.map(({ru})=>[ru.id,{profile:cohort==='healthy'?'generated':cohort==='high-risk'?'aggressive':Number(ru.id.slice(2))%2?'aggressive':'cautious',equipment:cohort==='healthy'?'standard':['light','heavy','protected','exposed'][(Number(ru.id.slice(2))-1)%8%4]}]))};
}
export function buildJobs(){const jobs=[];for(let r=0;r<40;r++)for(let w=0;w<5;w++)for(const c of cohorts){jobs.push(buildJob(c,r,w));if(r%5===0)jobs.push(buildJob(c,r,w,'Pure'));}return jobs;}
// Additional paired role-swap panel; declared separately from the 600-race cohort study.
export function personalityJobs(){const jobs=[];for(let r=0;r<10;r++)for(let w=0;w<5;w++)for(const swap of [false,true]){
 const j=buildJob('healthy',r,w);j.id=`DR-personality-${r}-${w}-${swap}`;j.experiment=j.cohort='personality-control';j.block=`${r}-${w}`;j.arm=swap?'swap':'base';j.setup.seed=5100+r;j.setup.surfaces={};j.surface='neutral';j.setup.entrants.forEach(({ru})=>{const p=(Number(ru.id.slice(2))%2===0)!==swap?'aggressive':'cautious';const id=ru.id;Object.assign(ru,profile(defaultRU(id,50),p));j.labels[id]={profile:p,equipment:'standard'};});jobs.push(j);
 }return jobs;}
