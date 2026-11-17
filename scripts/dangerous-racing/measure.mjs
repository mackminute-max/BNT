import {execute} from '../evaluation/measure.mjs';
export function diagnose(record){
 const {events,setup}=record,decisions=events.filter(e=>e.type==='AI_DECISION');
 const attacks=events.filter(e=>e.type==='ATTACK'),reaction=new Map(events.filter(e=>e.type==='REACTION').map(e=>[e.effects.attackId,e.effects]));
 const sum=a=>a.reduce((n,v)=>n+v,0);
 const actualAttackDamage=new Map();for(const e of events)if(e.type==='DAMAGE'&&e.effects.kind==='attack')actualAttackDamage.set(e.effects.contactId,e.effects.amount);
 const contested=attacks.map(e=>{const x=e.effects,rx=reaction.get(x.attackId),bonus=x.reacted?(setup.consequence.reactionBonus+(rx?.defending?setup.consequence.defendingBonus:0)):0;return {time:e.time,...x,defending:rx?.defending??false,remaining:rx?.remaining??null,reactiveBonus:bonus,noReactionMargin:x.margin+bonus,reactionThresholdFlip:!x.success&&x.margin+bonus>0,damage:actualAttackDamage.get(x.attackId)??0};});
 const both=decisions.filter(e=>['attack','ram'].every(a=>e.effects.candidates.some(c=>c.action===a)));
 const ram=decisions.filter(e=>e.effects.candidates.some(c=>c.action==='ram'));
 const gaps=both.map(e=>{const a=e.effects.candidates.find(c=>c.action==='attack'),b=e.effects.candidates.find(c=>c.action==='ram');return a.score-b.score;});
 const perRU=Object.fromEntries(setup.entrants.map(({ru})=>{
  const finished=events.find(e=>e.type==='RU_FINISHED'&&e.participants.includes(ru.id));const retired=events.find(e=>e.type==='RU_RETIRED'&&e.participants.includes(ru.id));const stop=finished?.time??retired?.time??record.time;
  const ev=events.filter(e=>e.time<=stop&&e.participants.includes(ru.id));
  const damage=ev.filter(e=>e.type==='DAMAGE'&&e.participants[0]===ru.id);
  const own=contested.filter(e=>e.defender===ru.id);
  const min={driver:ru.driver.condition,chariot:ru.chariot.condition,...Object.fromEntries(ru.beasts.map((b,i)=>['beast:'+i,b.condition]))};
  const byKind={},byComponent={};for(const e of damage){min[e.effects.component]=Math.min(min[e.effects.component],e.effects.after);byKind[e.effects.kind]=(byKind[e.effects.kind]??0)+e.effects.amount;byComponent[e.effects.component]=(byComponent[e.effects.component]??0)+e.effects.amount;}
  const d=decisions.filter(e=>e.participants[0]===ru.id),a=attacks.filter(e=>e.effects.attacker===ru.id);
  return [ru.id,{minimumCondition:min,newSeriousDamage:damage.some(e=>e.effects.before>25&&e.effects.after<=25),startsSerious:Object.values({driver:ru.driver.condition,chariot:ru.chariot.condition,...Object.fromEntries(ru.beasts.map((b,i)=>['beast:'+i,b.condition]))}).some(v=>v<=25),endsSerious:Object.values(min).some(v=>v<=25),damageByKind:byKind,damageByComponent:byComponent,
   ramOpportunities:d.filter(e=>e.effects.candidates.some(c=>c.action==='ram')).length,ramSelected:d.filter(e=>e.effects.chosen.position==='ram').length,attackSelected:d.filter(e=>e.effects.chosen.position==='attack').length,ramContests:a.filter(e=>e.effects.action==='ram').length,
   attacksFaced:own.length,reactions:own.filter(e=>e.reacted).length,reactiveSuccesses:own.filter(e=>e.reacted&&!e.success).length,reactionFlips:own.filter(e=>e.reactionThresholdFlip).length,unreacted:own.filter(e=>!e.reacted).length,
   controls:ev.filter(e=>e.type==='CONTROL_CHANGED').map(e=>({time:e.time,...e.effects})),stop}];
 }));
 return {decisions:decisions.length,ramOpportunities:ram.length,bothCandidates:both.length,ramOnly:ram.filter(e=>!e.effects.candidates.some(c=>c.action==='attack')).length,ramSelected:decisions.filter(e=>e.effects.chosen.position==='ram').length,
  attackSelected:decisions.filter(e=>e.effects.chosen.position==='attack').length,attackMinusRam:gaps.length?{n:gaps.length,min:Math.min(...gaps),max:Math.max(...gaps),mean:sum(gaps)/gaps.length}:null,
  contests:contested,perRU,examples:both.slice(0,2).map(e=>({time:e.time,ru:e.participants[0],effects:e.effects})),newSeriousEntries:Object.values(perRU).filter(x=>x.newSeriousDamage).length,
  outOfControl:events.filter(e=>e.type==='CONTROL_CHANGED'&&e.effects.control==='Out of Control').length,unstable:events.filter(e=>e.type==='CONTROL_CHANGED'&&e.effects.control==='Unstable').length,
  wrecks:events.filter(e=>e.type==='WRECK_CREATED').length,incidentImpacts:events.filter(e=>e.type==='INCIDENT_IMPACT').length,cornerEvents:events.filter(e=>e.type==='CONTROL_CHANGED'&&e.effects.cause==='corner overspeed').length,
  damageByKind:events.filter(e=>e.type==='DAMAGE').reduce((o,e)=>(o[e.effects.kind]=(o[e.effects.kind]??0)+e.effects.amount,o),{})};
}
export function executeDanger(job,{observe=true,includeReplay=false}={}){
 const result=execute(job,{instrument:observe,includeReplay:true});
 if(observe)result.result.danger={...diagnose(result.replay),cohort:job.cohort,rotation:job.rotation,traffic:job.traffic,surface:job.surface};
 if(!includeReplay)delete result.replay;
 return result;
}
