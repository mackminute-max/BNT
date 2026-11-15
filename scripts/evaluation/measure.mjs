import { createHash } from 'node:crypto';
import { createRace, step, digest, capture, issueSign, classification } from '../../src/sim/race.js';
import { statistics } from '../../src/reporting/results.js';
import { canonical } from '../../src/core/determinism.js';
import { SignSchedule } from './scenarios.mjs';
export const sha = value => createHash('sha256').update(typeof value==='string'?value:canonical(value)).digest('hex');
const bump=(o,k,n=1)=>o[k??'none']=(o[k??'none']??0)+n;
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
const count=(events,type)=>events.filter(e=>e.type===type).length;
const terminal=s=>['Ended','Stalled','Error'].includes(s.status);
function accumulator(r,i,label={}) {
  return {id:r.id,...label,startSlot:i+1,startLane:r.lane,startQ:r.q,startRow:Math.floor(i/4)+1,
    sampledSpeedIntegral:0,sampledSeconds:0,maxObservedSpeed:r.speed,blockedSeconds:0,sampledLaneSeconds:{},fatigueTrace:[{time:0,fatigue:r.ru.beasts.map(b=>b.fatigue),strain:r.ru.driver.strain,wear:r.ru.chariot.wear}],
    decisions:{total:0,boundaryDue:0,boundaryEarly:0,boundaryRepeat:0,subevent:0},intendedPace:{},intendedPosition:{},effectivePace:{},effectivePosition:{},
    utility:{},laneAttempts:0,laneSuccesses:0,laneRejected:0,rapidReversals:0,reversals:0,repeatedBlockedAttempts:0,
    overtakes:0,lostPositions:0,attacks:0,rams:0,successfulAttacks:0,reactions:0,successfulDefenses:0,
    incidentImpacts:0,controlLossEvents:0,damage:0,damageByComponent:{},wreckImpacts:0,controlEvents:0,
    _lane:r.lane,_direction:0,_lastChange:-Infinity,_lastBlocked:null,_goal:'hold',_goalTime:0,_avoidSeconds:0,
    _pace:r.pace,_paceTime:0,_paceIntervals:[],_pending:null,_active:null,
    signs:{queued:0,activated:0,pendingReplacements:0,replacementQueues:0,activeReplacements:0,canceled:0,lowered:0,rejected:0},
  };
}
function sample(before,s,events,rows) {
  for(const old of before){const r=s.entrants.find(x=>x.id===old.id),a=rows.get(r.id);
    if(old.status!=='Racing')continue;
    const stop=r.finishTime??r.retirement?.time??s.time;
    const end=Math.min(s.time,stop),seconds=Math.max(0,end-old.time);
    a.maxObservedSpeed=Math.max(a.maxObservedSpeed,old.speed,r.status==='Racing'?r.speed:0);
    a.sampledSpeedIntegral+=(old.speed+(r.status==='Racing'?r.speed:old.speed))/2*seconds;a.sampledSeconds+=seconds;
    bump(a.sampledLaneSeconds,old.lane,seconds);
    let blocked=null;
    for(const e of events){if(e.time<old.time||e.time>end||!e.participants.includes(r.id))continue;
      if(e.type==='MOVEMENT_BLOCKED'&&blocked===null)blocked=e.time;
      if(e.type==='LANE_CHANGE_COMPLETED'&&blocked!==null){a.blockedSeconds+=Math.max(0,e.time-blocked);blocked=null;}
    }
    if(blocked!==null)a.blockedSeconds+=Math.max(0,end-blocked);
  }
}
function observeEvent(e,rows,decisions,energies){
  const a=rows.get(e.participants[0]),x=e.effects;
  if(e.type==='AI_DECISION'){
    const row=rows.get(e.participants[0]);row.decisions.total++;
    if(e.fraction>1e-8)row.decisions.subevent++;else if(row._boundarySeen)row.decisions.boundaryRepeat++;else {row._boundarySeen=true;if(e.tick>=row._nextDecision)row.decisions.boundaryDue++;else row.decisions.boundaryEarly++;}
    bump(row.intendedPace,x.intended?.pace??x.chosen?.pace);bump(row.intendedPosition,x.intended?.position??x.chosen?.position);
    bump(row.effectivePace,x.effective?.pace);bump(row.effectivePosition,x.effective?.position);
    if(x.effective?.pace!=null){row._paceIntervals.push({pace:row._pace,start:row._paceTime,end:e.time});row._pace=x.effective.pace;row._paceTime=e.time;}
    if(['avoid','yield'].includes(row._goal))row._avoidSeconds+=Math.max(0,e.time-row._goalTime);
    row._goal=x.chosen?.position;row._goalTime=e.time;
    decisions.set(x.decisionId,{ru:row.id,time:e.time,sign:x.sign,compliance:x.compliance,reason:x.reason,physicalOutcome:x.physicalOutcome});
    for(const c of x.candidates){const u=row.utility[c.action]??={n:0,sum:0,sumSq:0,min:Infinity,max:-Infinity};u.n++;u.sum+=c.score;u.sumSq+=c.score*c.score;u.min=Math.min(u.min,c.score);u.max=Math.max(u.max,c.score);}
  }
  if(e.type==='AI_EXECUTION_RESULT'){
    const d=decisions.get(x.decisionId);if(d){d.compliance=x.compliance;d.reason=x.reason;d.physicalOutcome=x.physicalOutcome;}
  }
  if(e.type==='CORNER_EVALUATED'&&a)a.maxObservedSpeed=Math.max(a.maxObservedSpeed,x.speed);
  if(e.type==='LANE_CHANGE_REQUESTED'){a.laneAttempts++;a._requestedLane=x.lane;}
  if(e.type==='LANE_CHANGE_COMPLETED'){
    a.laneSuccesses++;const direction=Math.sign(x.to-x.from);
    if(a._direction&&direction!==a._direction){a.reversals++;if(e.time-a._lastChange<=2)a.rapidReversals++;}
    a._direction=direction;a._lastChange=e.time;a._lastBlocked=null;a._lane=x.to;
  }
  if(['LANE_CHANGE_REJECTED','MOVEMENT_BLOCKED'].includes(e.type)&&a){
    if(e.type==='LANE_CHANGE_REJECTED')a.laneRejected++;
    const target=e.type==='MOVEMENT_BLOCKED'?x.tile:`lane:${a._requestedLane}`;
    if(a._lastBlocked?.target===target&&e.time-a._lastBlocked.time<=2)a.repeatedBlockedAttempts++;
    a._lastBlocked={target,time:e.time};
  }
  if(e.type==='OVERTAKE'){rows.get(x.passer).overtakes++;rows.get(x.passed).lostPositions++;}
  if(e.type==='ATTACK'){
    const attacker=rows.get(x.attacker),defender=rows.get(x.defender);attacker.attacks++;
    if(x.action==='ram')attacker.rams++;if(x.success)attacker.successfulAttacks++;
    if(!x.success&&x.reacted)defender.successfulDefenses++;
  }
  // REACTION participants are sorted; the defender is identified by the linked ATTACK below in finish().
  if(e.type==='DAMAGE'){a.damage+=x.amount;bump(a.damageByComponent,x.component,x.amount);if(x.kind!=='attack')energies.set(x.contactId,x.energy);}
  if(e.type==='CONTROL_CHANGED'){a.controlEvents++;if(x.control==='Out of Control')a.controlLossEvents++;}
  if(e.type==='WRECK_IMPACT'){rows.get(x.wreckId).wreckImpacts++;energies.set(x.contactId,x.energy);}
  if(e.type==='INCIDENT_IMPACT')a.incidentImpacts++;
  if(e.type==='SIGN_QUEUED'){
    a.signs.queued++;if(a._pending)a.signs.pendingReplacements++;if(a._active)a.signs.replacementQueues++;a._pending=x.sign;
  }
  if(e.type==='SIGN_ACTIVATED'){a.signs.activated++;if(a._active)a.signs.activeReplacements++;a._active=x.sign;a._pending=null;}
  if(e.type==='SIGN_CANCELED'){a.signs.canceled++;a._pending=null;}
  if(e.type==='SIGN_LOWERED'){a.signs.lowered++;a._active=null;}
  if(e.type==='SIGN_REJECTED')a.signs.rejected++;
}
const relevant=new Set(['OVERTAKE','CONTACT','ATTACK','ATTACK_INVALIDATED','REACTION','DAMAGE','CONTROL_CHANGED','RU_RETIRED','WRECK_CREATED','WRECK_IMPACT','INCIDENT','INCIDENT_IMPACT','INCIDENT_SKIPPED','SIGN_QUEUED','SIGN_ACTIVATED','SIGN_CANCELED','SIGN_LOWERED','SIGN_REJECTED','RU_FINISHED','RACE_STALLED','INTEGRITY_ERROR','LANE_CHANGE_REJECTED']);
export function execute(job,{instrument=true,maxTicks=30000,includeReplay=false}={}){
  const start=performance.now(),s=createRace(job.setup),scheduler=new SignSchedule(job.schedule);
  const rows=new Map(s.entrants.map((r,i)=>[r.id,accumulator(r,i,job.labels?.[r.id])])),decisions=new Map(),energies=new Map();
  let cursor=0,nextTrace=20;
  while(!terminal(s)&&s.tick<maxTicks){
    for(const command of scheduler.due(s))issueSign(s,command.action,command.sign);
    const before=instrument?s.entrants.map(r=>({id:r.id,status:r.status,speed:r.speed,lane:r.lane,time:s.time})):null;
    if(instrument)for(const r of s.entrants){rows.get(r.id)._nextDecision=r.ai.nextDecision;rows.get(r.id)._boundarySeen=false;}
    step(s);
    if(instrument){const events=s.events.slice(cursor);sample(before,s,events,rows);for(const e of events)observeEvent(e,rows,decisions,energies);cursor=s.events.length;
      if(s.time>=nextTrace){for(const r of s.entrants)if(r.status==='Racing')rows.get(r.id).fatigueTrace.push({time:s.time,fatigue:r.ru.beasts.map(b=>b.fatigue),strain:r.ru.driver.strain,wear:r.ru.chariot.wear});nextTrace+=20;}
    }
  }
  const engineChecksum=s.checkpoints.at(-1)?.tick===s.tick?s.checkpoints.at(-1).checksum:digest(s);
  const official=classification(s),stats=statistics(s);
  const normalizedSetup={...s.setup,seed:0},config={version:s.version,setup:normalizedSetup,schedule:job.schedule??[]};
  const configId=sha(config).slice(0,20);
  const ru=[];
  if(instrument){
    const reactionIds=new Set(s.events.filter(e=>e.type==='REACTION').map(e=>e.effects.attackId));
    for(const e of s.events)if(e.type==='ATTACK'&&reactionIds.has(e.effects.attackId))rows.get(e.effects.defender).reactions++;
    const allCompliance={};
    for(const r of s.entrants){const a=rows.get(r.id),row=official.find(x=>x.id===r.id),stop=r.finishTime??r.retirement?.time??s.time;
      const paceSeconds={};for(const p of [...a._paceIntervals,{pace:a._pace,start:a._paceTime,end:stop}])bump(paceSeconds,p.pace,Math.max(0,Math.min(p.end,stop)-Math.min(p.start,stop)));
      if(['avoid','yield'].includes(a._goal))a._avoidSeconds+=Math.max(0,stop-a._goalTime);
      const d=[...decisions.values()].filter(x=>x.ru===r.id),comp={},outcomes={},contexts={};
      for(const x of d){bump(outcomes,x.physicalOutcome?.position?.status);if(x.sign){bump(comp,x.compliance??'Unresolved');if(x.compliance)bump(allCompliance,x.compliance);if(x.reason)bump(contexts,x.reason);}}
      const utility=Object.fromEntries(Object.entries(a.utility).map(([key,u])=>[key,{n:u.n,mean:u.sum/u.n,sd:Math.sqrt(Math.max(0,(u.sumSq-u.sum*u.sum/u.n)/Math.max(1,u.n-1))),min:u.min,max:u.max}]));
      const clean=Object.fromEntries(Object.entries(a).filter(([k])=>!k.startsWith('_')&&!['sampledSpeedIntegral','sampledSeconds','utility'].includes(k)));
      ru.push({...clean,utility,status:r.status,physical:r.physical,finishPlace:row.place,officialTime:r.finishTime,retirement:r.retirement,finishSnapshot:r.finishSnapshot,
        competitiveSeconds:stop,sampledAverageSpeed:a.sampledSeconds?a.sampledSpeedIntegral/a.sampledSeconds:null,paceSeconds,avoidanceIntentSeconds:a._avoidSeconds,
        finalFatigue:r.ru.beasts.map(b=>b.fatigue),finishFatigue:r.finishSnapshot?.beasts.map(b=>b.fatigue)??null,
        finalCondition:{driver:r.ru.driver.condition,chariot:r.ru.chariot.condition,beasts:r.ru.beasts.map(b=>b.condition)},strain:r.ru.driver.strain,wear:r.ru.chariot.wear,
        signCompliance:comp,signDecisionOpportunities:d.filter(x=>x.sign&&x.compliance!=='Inapplicable').length,signContexts:contexts,physicalOutcomes:outcomes,
        signUsesConsumed:s.autonomous.signUses-r.signs.remaining,activeSignAtTermination:r.signs.active,pendingSignAtTermination:r.signs.pending});
    }
    if(canonical(allCompliance)!==canonical(stats.signCompliance))throw Error('Evaluation compliance differs from authoritative report');
  }
  const finishTimes=official.filter(x=>x.status==='Finished').map(x=>x.time).sort((a,b)=>a-b);
  const result={id:job.id,experiment:job.experiment,arm:job.arm,block:job.block,attribute:job.attribute??null,treatment:job.treatment??null,
    seed:s.seed,format:s.format,weather:s.weather,playerId:s.playerId,configId,version:s.version,status:s.status,bounded:!terminal(s),ticks:s.tick,
    duration:s.time,checksum:engineChecksum,eventsSHA256:sha(JSON.stringify(s.events)),rng:s.rng,official,
    winnerGap:finishTimes.length>1?finishTimes[1]-finishTimes[0]:null,fieldFinishSpan:finishTimes.length>1?finishTimes.at(-1)-finishTimes[0]:null,
    officialTies:finishTimes.length-new Set(official.filter(x=>x.status==='Finished').map(x=>x.place)).size,
    race:{...Object.fromEntries(Object.entries(stats).filter(([k])=>!['entrants','diagnostics','version','seed','status','duration'].includes(k))),dns:s.entrants.filter(r=>r.status==='DNS').length,
      reactions:count(s.events,'REACTION'),ramContests:s.events.filter(e=>e.type==='ATTACK'&&e.effects.action==='ram').length,invalidatedAttacks:count(s.events,'ATTACK_INVALIDATED'),
      laneAttempts:count(s.events,'LANE_CHANGE_REQUESTED'),laneSuccesses:count(s.events,'LANE_CHANGE_COMPLETED'),laneRejected:count(s.events,'LANE_CHANGE_REJECTED'),
      wreckImpacts:count(s.events,'WRECK_IMPACT'),incidentImpacts:count(s.events,'INCIDENT_IMPACT'),controlLossEvents:s.events.filter(e=>e.type==='CONTROL_CHANGED'&&e.effects.control==='Out of Control').length,
      knownPhysicalImpactCount:energies.size,maxLoggedImpactEnergy:energies.size?Math.max(...energies.values()):null,meanLoggedImpactEnergy:avg([...energies.values()]),
      eventCount:s.events.length,maxSubeventGroups:s.diagnostics.maxGroups},
    error:s.events.find(e=>e.type==='INTEGRITY_ERROR')?.effects??null,wallSeconds:(performance.now()-start)/1000,ru,commands:s.commands,
    decisionExamples:s.events.filter(e=>e.type==='AI_DECISION').slice(0,3).map(e=>({time:e.time,ru:e.participants[0],effects:e.effects}))};
  const eventRows=instrument?s.events.filter(e=>relevant.has(e.type)).map(e=>({raceId:job.id,...e})):[];
  return {result,config,eventRows,...(includeReplay?{replay:capture(s)}:{})};
}
