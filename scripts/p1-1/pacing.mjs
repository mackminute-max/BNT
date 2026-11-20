import {createRace,step,digest,issueSign} from '../../src/sim/race.js';
import {m2Config} from '../../src/sim/environment.js';
import {defaultRU} from '../../src/model/ru.js';import {raceSetup} from '../../src/prototype/session.js';import {pacingProfiles} from '../../src/prototype/pacing.js';import {mkdir,writeFile} from 'node:fs/promises';
const out=process.env.BNT_P11_OUT??'/workspace/deliverables/bnt-p1-1/evidence';await mkdir(out,{recursive:true});const rows=[];
export function pacingTrial({course='short-oval',endurance=55,weather='Clear',strategy='Maintain',profile='legacy',seed=17,autonomous=false}={}){
 const ru=defaultRU('P',55);ru.beasts.forEach(b=>b.endurance=endurance);
 const base=raceSetup({course,seed,fieldSize:1,laps:course==='C01'?2:2}),cfg=pacingProfiles[profile];
 const s=createRace({...base.setup,seed,entrants:[{ru,lane:0,q:-.5}],playerId:'P',driverMode:'autonomous',weather,autonomous:cfg.autonomous,overrides:{...base.setup.overrides,tuning:cfg.tuning},consequence:{incidentRate:0}});
 let switched=false;let last=null,peak=0,speedSum=0,n=0,modeTime={},samples=[],previousFatigue=0,recovered=0;
 const target=(s.track.cells*s.config.laps),open=s.track.course&&!s.track.closed,total=open?s.track.cells:target;
 if(autonomous&&strategy!=='Maintain')issueSign(s,'queue',strategy.startsWith('Conserve')?'Conserve Strength':'Push the Pace');
 while(!['Ended','Stalled','Error'].includes(s.status)&&s.tick<20000){const r=s.entrants[0],half=r.q>=total/2;
  const pace=strategy==='PushThenConserve'?(half?'Conserve':'Push'):strategy==='ConserveThenPush'?(half?'Push':'Conserve'):strategy;
  if(!autonomous&&pace!==last){s.autonomous=m2Config({...cfg.autonomous,utility:{...cfg.autonomous.utility,conserveBase:0,maintainBase:0,pushBase:0,sprintBase:0,holdBase:40,[{Conserve:'conserveBase',Maintain:'maintainBase',Push:'pushBase',Sprint:'sprintBase'}[pace]]:40}});r.ai.nextDecision=s.tick;}last=pace;const commands=[];if(autonomous&&!switched&&r.q>=total*.4&&['PushThenConserve','ConserveThenPush'].includes(strategy)){issueSign(s,'queue',strategy==='PushThenConserve'?'Conserve Strength':'Push the Pace');switched=true;}
  const before=s.time,was=r.status;step(s,commands);if(was==='Racing'){modeTime[r.pace]=(modeTime[r.pace]??0)+(s.time-before);speedSum+=r.speed;n++;peak=Math.max(peak,r.speed);const fatigue=r.ru.beasts.reduce((n,b)=>n+b.fatigue,0)/2;recovered+=Math.max(0,previousFatigue-fatigue);previousFatigue=fatigue;if(s.tick%200===0||r.status!=='Racing')samples.push({time:s.time,q:r.q,speed:r.speed,fatigue,pace:r.pace});}
 }
 const r=s.entrants[0];return {course,endurance,weather,strategy,profile,seed,control:autonomous?'native autonomous, pre-race Sign only':'native autonomous physics/condition; diagnostic utility bases select requested pace and hold lane; switch at half-route (not player Signs)',status:s.status,finishTime:r.finishTime,averageTickSpeed:speedSum/n,peakSpeed:peak,finalFatigue:previousFatigue,recovered,modeTime,samples,signEvents:s.events.filter(e=>['SIGN_QUEUED','SIGN_ACTIVATED'].includes(e.type)).map(e=>({type:e.type,time:e.time,tick:e.tick,effects:e.effects})),checksum:digest(s)};
}
if(process.argv[1]?.endsWith('/pacing.mjs')){
 for(const profile of ['legacy','endurance'])for(const course of ['short-oval','C01','rally-long'])for(const endurance of [30,80])for(const weather of ['Clear','Extreme Heat'])for(const strategy of ['Maintain','Push','PushThenConserve','ConserveThenPush','Sprint']){const row=pacingTrial({profile,course,endurance,weather,strategy});rows.push(row);console.log(profile,course,endurance,weather,strategy,row.finishTime?.toFixed(2),row.finalFatigue.toFixed(1));}
 const signs=[];for(const profile of ['legacy','endurance'])for(const course of ['short-oval','C01','rally-long'])for(const strategy of ['Maintain','Push','Conserve','PushThenConserve','ConserveThenPush'])signs.push(pacingTrial({profile,course,strategy,autonomous:true}));
 await writeFile(out+'/pacing.json',JSON.stringify({rows,signs,notes:'Single entrant, Pure, fixed seed 17, matched native assets; incident frequency zero for isolation. High-utility pacing controls are internal diagnostic controls, not unlimited player Sign inputs. Average speed uses resolved tick samples; finish time is authoritative.'},null,2));
}
