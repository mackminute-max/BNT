import {componentReasons} from '../../career/component-eligibility.js';
import {consequenceDefaults} from '../../sim/consequences.js';
import {selectionPreview} from '../model.js';
export const emptyTeam=()=>({version:1,driverId:null,beastIds:[null,null],chariotId:null});
export function activeTeam(state,presentation){const a=Object.values(state?.management?.registries?.assignments??{})[0];return structuredClone(presentation?.version===2?presentation.activeTeam:a?{version:1,driverId:a.driverId,beastIds:[...a.beastIds],chariotId:a.chariotId}:emptyTeam());}
export function componentEligibility(s,kind,key){
 if(!['personnel','beasts','chariots'].includes(kind))return {eligible:false,reasons:['Not a Racing Unit component']};
 const a=Object.values(s.management.registries.assignments)[0],reasons=componentReasons(s,kind,key,a?.id),asset=s.management.registries[kind][key];
 if(asset&&['personnel','chariots'].includes(kind)&&asset.condition<=consequenceDefaults.disabledCondition)reasons.push('Native engine component disable threshold reached');
 if(asset&&kind==='personnel'&&s.schema>=4){const c=s.management.registries.contracts[asset.references.contract?.[0]];if(c?.lifecycle!=='active'||c.cyclesRemaining<1)reasons.push('Driver contract is expired or unavailable');}
 return {eligible:!reasons.length,reasons};
}
export function changeTeam(state,team,kind,key,slot=null){
 const t=structuredClone(team),active=kind==='personnel'?t.driverId===key:kind==='chariots'?t.chariotId===key:t.beastIds.includes(key);
 if(!active){const p=componentEligibility(state,kind,key);if(!p.eligible)throw Error(p.reasons.join('; '));}
 if(kind==='personnel')t.driverId=active?null:key;else if(kind==='chariots')t.chariotId=active?null:key;
 else if(kind==='beasts'){if(active)t.beastIds[t.beastIds.indexOf(key)]=null;else{const n=t.beastIds.indexOf(null);if(n>=0)t.beastIds[n]=key;else{if(![0,1].includes(slot))throw Error('Choose which beast slot to replace');t.beastIds[slot]=key;}}}else throw Error('Invalid component kind');
 return t;
}
export function teamReadiness(s,t){return selectionPreview(s,{driverId:t.driverId,beastIds:[...t.beastIds],chariotId:t.chariotId},Object.values(s.management.registries.assignments)[0]?.id);}
