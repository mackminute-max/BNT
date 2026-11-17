import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {gunzipSync,gzipSync,createGunzip} from 'node:zlib';
import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import {describe,clustered,paired,mean,wilson} from './statistics.mjs';
const root='docs/phase2/',input=JSON.parse(await readFile(root+'data/execution.json','utf8'));
const rows=gunzipSync(await readFile(root+'data/races.jsonl.gz')).toString().trim().split('\n').filter(Boolean).map(JSON.parse).sort((a,b)=>a.id.localeCompare(b.id));
const valid=rows.filter(r=>!r.bounded&&r.status!=='Error');
const byId=new Map(rows.map(r=>[r.id,r])),attackLinks=new Map();let unlinkedCombatDamage=0;
for(const r of rows)for(const u of r.ru)u.combatDamageDealt=0;
const lines=createInterface({input:createReadStream(root+'data/events.jsonl.gz').pipe(createGunzip()),crlfDelay:Infinity});
for await(const line of lines){if(!line)continue;const e=JSON.parse(line),x=e.effects;
 if(e.type==='ATTACK')attackLinks.set(e.raceId+':'+x.attackId,x.attacker);
 if(e.type==='DAMAGE'&&['attack','ram'].includes(x.kind)){
  const id=[x.parentId,x.contactId].find(s=>s?.startsWith('attack:'));
  const attacker=attackLinks.get(e.raceId+':'+id),race=byId.get(e.raceId);
  if(attacker&&race){if(e.participants[0]!==attacker)race.ru.find(r=>r.id===attacker).combatDamageDealt+=x.amount;}
  else unlinkedCombatDamage++;
 }
}

const formats=['Pure','Combat'];
const ru1=r=>r.ru.find(x=>x.id==='RU1');
const fatigue=ru=>ru?.finishFatigue?mean(ru.finishFatigue):null;
const pace=(ru,name)=>ru?.competitiveSeconds>0?(ru.paceSeconds[name]??0)/ru.competitiveSeconds:null;
const sum=(rows,fn)=>rows.reduce((s,r)=>s+(fn(r)??0),0);
const counter=(array,key)=>Object.fromEntries([...new Set(array.map(key))].map(k=>[k,array.filter(r=>key(r)===k).length]));
function raceSummary(group){return{n:group.length,uniqueSeeds:new Set(group.map(r=>r.seed)).size,
 duration:clustered(group,r=>r.duration),winnerGap:clustered(group,r=>r.winnerGap),fieldFinishSpan:clustered(group,r=>r.fieldFinishSpan),
 overtakes:clustered(group,r=>r.race.overtakes),collisions:clustered(group,r=>r.race.collisions),attacks:clustered(group,r=>r.race.attacks),rams:clustered(group,r=>r.race.ramContests),
 damage:clustered(group,r=>r.race.damage),fatigueAtFinish:clustered(group,r=>r.race.fatigueAtFinish),incidents:sum(group,r=>r.race.incidents),
 entries:group.reduce((s,r)=>s+r.ru.length,0),finishes:sum(group,r=>r.race.finishes),dnfs:sum(group,r=>r.race.dnfs),dns:sum(group,r=>r.race.dns),
 wrecks:sum(group,r=>r.race.wrecks),controlLossEvents:sum(group,r=>r.race.controlLossEvents),reactions:sum(group,r=>r.race.reactions),
 successfulAttacks:sum(group,r=>r.race.successfulAttacks),successfulDefenses:sum(group,r=>r.race.successfulDefenses),
 laneAttempts:sum(group,r=>r.race.laneAttempts),laneSuccesses:sum(group,r=>r.race.laneSuccesses),laneRejected:sum(group,r=>r.race.laneRejected),
 repeatedBlockedAttempts:sum(group,r=>sum(r.ru,u=>u.repeatedBlockedAttempts)),rapidReversals:sum(group,r=>sum(r.ru,u=>u.rapidReversals)),
 meanBlockedSecondsPerEntry:mean(group.flatMap(r=>r.ru.map(u=>u.blockedSeconds))),
 maximumLoggedImpactEnergy:describe(group.map(r=>r.race.maxLoggedImpactEnergy)),
 };}
function entrySummary(group,field,label){
 const entries=group.flatMap(r=>r.ru.map(u=>({...u,seed:r.seed,raceId:r.id,weather:r.weather}))),names=[...new Set(entries.map(u=>u[field]))];
 return names.map(name=>{const a=entries.filter(u=>u[field]===name);return{name,n:a.length,races:new Set(a.map(r=>r.raceId)).size,
 winRate:clustered(a,r=>r.finishPlace===1?1:0,label+name+'wins'),podiumRate:clustered(a,r=>r.finishPlace!=null&&r.finishPlace<=3?1:0,label+name+'podium'),
 finishRate:clustered(a,r=>r.officialTime!=null?1:0,label+name+'finish'),finishPosition:clustered(a,r=>r.finishPlace,label+name+'place'),officialTime:clustered(a,r=>r.officialTime,label+name+'time'),
 fatigue:clustered(a,r=>fatigue(r),label+name+'fatigue'),damage:clustered(a,r=>r.damage,label+name+'damage'),combatDamageDealt:clustered(a,r=>r.combatDamageDealt,label+name+'dealt'),overtakes:clustered(a,r=>r.overtakes,label+name+'pass'),
 laneAttempts:clustered(a,r=>r.laneAttempts,label+name+'attempts'),laneSuccesses:clustered(a,r=>r.laneSuccesses,label+name+'lanes'),attacks:clustered(a,r=>r.attacks,label+name+'attacks'),
 defensiveDecisions:clustered(a,r=>(r.intendedPosition.defend??0)+(r.intendedPosition.defendCombat??0),label+name+'defend'),
 blockedSeconds:clustered(a,r=>r.blockedSeconds,label+name+'blocking'),rapidReversals:clustered(a,r=>r.rapidReversals,label+name+'reversals'),
 paceShares:Object.fromEntries(['Conserve','Maintain','Push','Sprint'].map(p=>[p,clustered(a,r=>pace(r,p),label+name+p)])),
 byWeather:Object.fromEntries([...new Set(a.map(r=>r.weather))].map(w=>[w,{n:a.filter(r=>r.weather===w).length,meanPosition:describe(a.filter(r=>r.weather===w).map(r=>r.finishPlace)),winRate:mean(a.filter(r=>r.weather===w).map(r=>r.finishPlace===1?1:0)),fatigue:describe(a.filter(r=>r.weather===w).map(r=>fatigue(r)))}])),
 };});
}
const playerMetrics={position:r=>ru1(r).finishPlace,time:r=>ru1(r).officialTime,fatigue:r=>fatigue(ru1(r)),damage:r=>ru1(r).damage,
 overtakes:r=>ru1(r).overtakes,attacks:r=>ru1(r).attacks,combatDamageDealt:r=>ru1(r).combatDamageDealt,blockedSeconds:r=>ru1(r).blockedSeconds,
 conserveShare:r=>pace(ru1(r),'Conserve'),fastPaceShare:r=>(pace(ru1(r),'Push')??0)+(pace(ru1(r),'Sprint')??0)};
const raceMetrics={duration:r=>r.duration,damage:r=>r.race.damage,attacks:r=>r.race.attacks,overtakes:r=>r.race.overtakes,dnfs:r=>r.race.dnfs,fatigue:r=>r.race.fatigueAtFinish,collisions:r=>r.race.collisions};
const analysis={unlinkedCombatDamage,version:rows[0]?.version,execution:{target:input.target,completed:input.completed,countsByFormat:input.countsByFormat,statuses:input.statuses,toolErrors:input.toolErrors,cancelled:input.cancelled,wallSeconds:input.wallSeconds,workers:input.workers},
 actualCounts:counter(rows,r=>r.format+'/'+r.experiment),validRows:valid.length,excluded:rows.filter(r=>!valid.includes(r)).map(r=>({id:r.id,status:r.status,bounded:r.bounded,error:r.error})),
 overall:{},baseline:{},archetypes:{},personalities:{},signs:{},sensitivity:{},surface:{},weather:{}};
for(const format of formats){
 const field=valid.filter(r=>r.format===format),a=field.filter(r=>r.experiment==='A');
 analysis.overall[format]=raceSummary(field);analysis.baseline[format]=raceSummary(a);
 analysis.archetypes[format]=entrySummary(field.filter(r=>r.experiment==='B'),'archetype',format+'-B-');
 analysis.personalities[format]=entrySummary(field.filter(r=>r.experiment==='C'),'profile',format+'-C-');
 const d=field.filter(r=>r.experiment==='D'),controls=d.filter(r=>r.arm==='none');
 analysis.signs[format]=[...new Set(d.filter(r=>r.arm!=='none').map(r=>r.arm))].map(arm=>{
 const group=d.filter(r=>r.arm===arm),comp={};for(const r of group)for(const [k,v]of Object.entries(ru1(r).signCompliance))comp[k]=(comp[k]??0)+v;
 const decisions=Object.values(comp).reduce((a,b)=>a+b,0),applicable=decisions-(comp.Inapplicable??0)-(comp.Unresolved??0);
 return{arm,n:group.length,compliance:comp,applicable,fullComplianceRate:applicable?(comp.Followed??0)/applicable:null,inapplicableRate:decisions?(comp.Inapplicable??0)/decisions:null,
 uses:describe(group.map(r=>ru1(r).signUsesConsumed)),queued:sum(group,r=>ru1(r).signs.queued),activated:sum(group,r=>ru1(r).signs.activated),pendingReplacements:sum(group,r=>ru1(r).signs.pendingReplacements),activeReplacements:sum(group,r=>ru1(r).signs.activeReplacements),canceled:sum(group,r=>ru1(r).signs.canceled),lowered:sum(group,r=>ru1(r).signs.lowered),
 unactivatedAtTermination:sum(group,r=>ru1(r).pendingSignAtTermination?1:0),comparison:paired(group,controls,playerMetrics,{label:format+'-'+arm})};});
 const sensitivity=field.filter(r=>r.experiment==='S');
 analysis.sensitivity[format]=[...new Set(sensitivity.map(r=>r.attribute))].map(attribute=>({attribute,comparison:paired(sensitivity.filter(r=>r.attribute===attribute&&r.treatment==='plus10'),sensitivity.filter(r=>r.attribute===attribute&&r.treatment==='control'),playerMetrics,{label:format+attribute})}));
 const e=field.filter(r=>r.experiment==='E');analysis.surface[format]=paired(e.filter(r=>r.arm==='degraded'),e.filter(r=>r.arm==='neutral'),raceMetrics,{label:format+'-surface'});
 const clear=a.filter(r=>r.weather==='Clear');
 analysis.weather[format]=Object.fromEntries([...new Set(a.map(r=>r.weather))].map(w=>[w,{summary:raceSummary(a.filter(r=>r.weather===w)),versusClear:paired(a.filter(r=>r.weather===w),clear,raceMetrics,{key:r=>r.seed,label:format+'-'+w})}]));
 const entryRows=a.flatMap(r=>r.ru.map(u=>({...u,seed:r.seed})));
 analysis.baseline[format].entryMetrics={sampledAverageSpeed:clustered(entryRows,u=>u.sampledAverageSpeed,format+'-A-speed'),maxObservedSpeed:clustered(entryRows,u=>u.maxObservedSpeed,format+'-A-maxspeed'),
  paceShares:Object.fromEntries(['Conserve','Maintain','Push','Sprint'].map(p=>[p,clustered(entryRows,u=>pace(u,p),format+'-A-'+p)])),
  sampledLaneShares:Object.fromEntries([0,1,2,3].map(l=>[l,sum(entryRows,u=>u.sampledLaneSeconds[l]??0)/sum(entryRows,u=>u.competitiveSeconds)])),
  decisions:Object.fromEntries(['total','boundaryDue','boundaryEarly','boundaryRepeat','subevent'].map(k=>[k,sum(entryRows,u=>u.decisions[k])])),
  strain:clustered(entryRows,u=>u.strain,format+'-A-strain'),wear:clustered(entryRows,u=>u.wear,format+'-A-wear')};
 const seedFlags=new Map();for(const r of a)seedFlags.set(r.seed,(seedFlags.get(r.seed)??false)||r.race.dnfs>0);
 analysis.baseline[format].retirementSeedContext={seeds:seedFlags.size,seedsWithAnyRetirement:[...seedFlags.values()].filter(Boolean).length,wilsonCI95:wilson([...seedFlags.values()].filter(Boolean).length,seedFlags.size),definition:'Probability of any retirement across five selected weather contexts per seed, not per-entry or per-race retirement risk'};
}
analysis.formatContrast=paired(valid.filter(r=>r.experiment==='A'&&r.format==='Combat'),valid.filter(r=>r.experiment==='A'&&r.format==='Pure'),raceMetrics,{label:'A Combat minus Pure'});
analysis.loopOutliers=valid.flatMap(r=>r.ru.map(u=>({raceId:r.id,format:r.format,experiment:r.experiment,arm:r.arm,weather:r.weather,seed:r.seed,ru:u.id,profile:u.profile,archetype:u.archetype,repeatedBlockedAttempts:u.repeatedBlockedAttempts,rapidReversals:u.rapidReversals,laneAttempts:u.laneAttempts,laneSuccesses:u.laneSuccesses,blockedSeconds:u.blockedSeconds,finishPlace:u.finishPlace}))).sort((a,b)=>b.repeatedBlockedAttempts-a.repeatedBlockedAttempts||b.rapidReversals-a.rapidReversals).slice(0,20);
const duplicates=new Map();for(const r of rows){const k=r.configId+':'+r.seed;const group=duplicates.get(k)??[];group.push(r);duplicates.set(k,group);}
analysis.replications={uniqueConfigurations:new Set(rows.map(r=>r.configId)).size,uniqueSeededConfigurations:duplicates.size,duplicateExecutions:rows.length-duplicates.size,allDuplicateChecksumsMatch:[...duplicates.values()].every(a=>a.every(r=>r.checksum===a[0].checksum&&r.eventsSHA256===a[0].eventsSHA256))};
analysis.performance={wallSeconds:input.wallSeconds,individualWallSeconds:describe(rows.map(r=>r.wallSeconds)),totalTicks:sum(rows,r=>r.ticks),totalEvents:sum(rows,r=>r.race.eventCount)};
await writeFile(root+'data/analysis.json',JSON.stringify(analysis,null,2));
const columns=['raceId','experiment','arm','format','weather','seed','id','archetype','profile','startSlot','startRow','finishPlace','officialTime','status','competitiveSeconds','maxObservedSpeed','sampledAverageSpeed','blockedSeconds','avoidanceIntentSeconds','overtakes','lostPositions','laneAttempts','laneSuccesses','laneRejected','repeatedBlockedAttempts','rapidReversals','damage','combatDamageDealt','controlLossEvents','attacks','rams','reactions','strain','wear','finishFatigue','finalFatigue'];
const quote=x=>'"'+String(x??'').replaceAll('"','""')+'"';
const csv=[columns.join(',')];for(const r of rows)for(const u of r.ru){const flat={...u,raceId:r.id,experiment:r.experiment,arm:r.arm,format:r.format,weather:r.weather,seed:r.seed,finishFatigue:u.finishFatigue?JSON.stringify(u.finishFatigue):null,finalFatigue:JSON.stringify(u.finalFatigue)};csv.push(columns.map(c=>quote(flat[c])).join(','));}
await writeFile(root+'data/ru.csv.gz',gzipSync(csv.join('\n')+'\n'));
await writeFile(root+'data/analysis-summary.json',JSON.stringify({execution:analysis.execution,replications:analysis.replications,baseline:analysis.baseline,formatContrast:analysis.formatContrast,excluded:analysis.excluded},null,2));
console.log(JSON.stringify({analyzed:rows.length,valid:valid.length,excluded:analysis.excluded.length,replications:analysis.replications}));
