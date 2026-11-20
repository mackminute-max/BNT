import {validateRU} from '../model/ru.js';
import {coachingProfile} from '../ai/coaching.js';
import {freeze} from '../career/assets.js';
// Experimental development presets, not earned upgrades or production balance.
export const builds=freeze({
 baseline:{name:'Unmodified baseline',deltas:{driver:{},beasts:{},chariot:{}},coaching:null},
 contact:{name:'Contact Specialist · experimental',deltas:{driver:{combat:12},beasts:{endurance:-4},chariot:{protection:10,stability:8,weight:20,rollingEfficiency:-5}},coaching:{aggression:.8,conservation:-.3,positioning:.4,riskTolerance:.5}},
 handling:{name:'Handling / Endurance · experimental',deltas:{driver:{combat:-6},beasts:{agility:10,endurance:12,power:-4},chariot:{maneuverability:10,protection:-6}},coaching:{aggression:-.5,conservation:.8,positioning:.8,riskTolerance:-.5}},
});
export function compileBuild(base,id='baseline'){
 validateRU(base);const definition=builds[id];if(!definition)throw Error('Unknown experimental build');
 const ru=structuredClone(base),changes=[];
 const apply=(obj,delta,path)=>{for(const [key,change]of Object.entries(delta)){const before=obj[key];const lo=key==='weight'?1:0,hi=key==='weight'?5000:100;obj[key]=Math.min(hi,Math.max(lo,before+change));changes.push({path:path+'.'+key,before,delta:change,after:obj[key]});}};
 apply(ru.driver,definition.deltas.driver,'driver');ru.beasts.forEach((b,i)=>apply(b,definition.deltas.beasts,'beasts.'+i));apply(ru.chariot,definition.deltas.chariot,'chariot');validateRU(ru);
 return {ru,coachingContext:definition.coaching?coachingProfile(definition.coaching):null,changes};
}
