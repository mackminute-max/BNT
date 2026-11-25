import {emit} from '../events/events.js';
// Transient resolved-tick accounting only: all resource changes apply immediately.
// Nothing in this collector is needed after step returns or after checkpoint restore.
const collectors=new WeakMap();
export function beginActionCosts(s){if(s.autonomous.accelerationFatiguePerSpeed||s.autonomous.weaponStrainCost||s.autonomous.ramStrainCost||s.autonomous.ramFatigueCost)collectors.set(s,{from:s.time,actors:new Map()});}
export function chargeAction(s,r,kind,{fatigue=0,strain=0,magnitude=1,sourceId=null}={}){
 if(![fatigue,strain,magnitude].every(n=>Number.isFinite(n)&&n>=0))throw Error('Invalid action resource cost');
 if(r.status!=='Racing'||(!fatigue&&!strain))return;
 const actualFatigue=r.ru.beasts.map(b=>{const old=b.fatigue;b.fatigue=Math.min(100,Math.max(0,old+(r.affinityContext?fatigue/r.affinityContext.multiplier:fatigue)*(1.5-b.endurance/100)));return b.fatigue-old;});
 const before=r.ru.driver.strain;r.ru.driver.strain=Math.min(100,Math.max(0,before+strain));const actualStrain=r.ru.driver.strain-before;
 const collector=collectors.get(s),record=collector?.actors.get(r.id)??{beastFatigue:r.ru.beasts.map(()=>0),driverStrain:0,sources:{}};
 actualFatigue.forEach((n,i)=>record.beastFatigue[i]+=n);record.driverStrain+=actualStrain;
 const source=record.sources[kind]??{count:0,magnitude:0,sourceIds:[]};source.count++;source.magnitude+=magnitude;if(sourceId)source.sourceIds.push(sourceId);record.sources[kind]=source;
 if(collector)collector.actors.set(r.id,record);else emit(s,'ACTION_EXERTION',[r.id],{version:1,from:s.time,through:s.time,...record});
}
export function flushActionCosts(s){const c=collectors.get(s);if(!c)return;for(const [id,record]of [...c.actors].sort(([a],[b])=>a<b?-1:a>b?1:0))emit(s,'ACTION_EXERTION',[id],{version:1,from:c.from,through:s.time,...record});collectors.delete(s);}
export function endActionCosts(s){collectors.delete(s);}
