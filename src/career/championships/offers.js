import {exact,id} from '../legacy-state.js';import {fingerprint,gold} from '../cycles/contracts.js';import {freeze} from '../assets.js';import {createRace} from '../../sim/race.js';
export function qualifies(q,facts){
 if(!q||typeof q!=='object'||Array.isArray(q))throw Error('Invalid qualification');
 const [type]=Object.keys(q);exact(q,[type]);
 if(type==='all'||type==='any'){if(!Array.isArray(q[type])||q[type].length>32)throw Error('Invalid qualification expression');const a=q[type].map(x=>qualifies(x,facts));return type==='all'?a.every(Boolean):a.some(Boolean);}
 if(type==='reputationAtLeast'){gold(q[type]);return facts.reputation>=q[type];}
 if(type==='hasTrophy'){id(q[type]);return facts.trophies.includes(q[type]);}
 if(type==='victoryCountAtLeast'){exact(q[type],['templateId','count']);id(q[type].templateId);gold(q[type].count);return (facts.victories[q[type].templateId]??0)>=q[type].count;}
 throw Error('Unsupported qualification predicate');
}
export function freezeOffer(t){
 exact(t,['kind','version','templateId','name','entryFee','fieldSize','qualification','schedule','points','dnfPoints']);
 if(t.kind!=='BNT-championship-template'||t.version!==1||typeof t.name!=='string'||!t.name.trim()||t.name.length>100||!Number.isInteger(t.fieldSize)||t.fieldSize<1||t.fieldSize>8||!Array.isArray(t.schedule)||t.schedule.length<1||t.schedule.length>12||!Array.isArray(t.points)||t.points.length!==t.fieldSize)throw Error('Invalid championship template');id(t.templateId);gold(t.entryFee);gold(t.dnfPoints);t.points.forEach(gold);qualifies(t.qualification,{reputation:0,trophies:[],victories:{}});
 const schedule=t.schedule.map((r,i)=>{
  exact(r,['course','format','weather','laps','grid']);if(!['random','standings','reverse'].includes(r.grid))throw Error('Invalid grid policy');
  const native=createRace({course:r.course,format:r.format,weather:r.weather,overrides:{laps:r.laps},entrants:createRace().setup.entrants.slice(0,t.fieldSize)});
  return {...structuredClone(r),course:structuredClone(native.setup.course??null),config:structuredClone(native.config),raceOrdinal:i};
 });
 const value={...structuredClone(t),schedule,rulesVersion:'m2e-controller-v1'};return freeze({kind:'BNT-championship-offer',version:1,value,fingerprint:fingerprint(value)});
}
export function validateOffer(o){exact(o,['kind','version','value','fingerprint']);if(o.kind!=='BNT-championship-offer'||o.version!==1||o.fingerprint!==fingerprint(o.value))throw Error('Invalid frozen offer');const t=structuredClone(o.value);if(t.rulesVersion!=='m2e-controller-v1')throw Error('Unsupported offer rules');delete t.rulesVersion;t.schedule=t.schedule.map(r=>{exact(r,['course','format','weather','laps','grid','config','raceOrdinal']);return {course:r.course,format:r.format,weather:r.weather,laps:r.laps,grid:r.grid};});if(freezeOffer(t).fingerprint!==o.fingerprint)throw Error('Offer is not canonical/valid');return o;}
// Explicit development fixture; no production championship catalog or rewards.
export const developmentOffer=()=>freezeOffer({kind:'BNT-championship-template',version:1,templateId:'controller-fixture',name:'Development Championship Fixture',entryFee:25,fieldSize:4,qualification:{reputationAtLeast:0},schedule:[{course:null,format:'Pure',weather:'Clear',laps:1,grid:'random'},{course:'C01',format:'Combat',weather:'Clear',laps:1,grid:'standings'}],points:[10,8,6,5],dnfPoints:0});
const catalogCapabilities=new WeakSet();
// Future catalog authority seam; test fixtures supply an explicit verifier.
// No arbitrary offer-list producer is exposed by the production UI.
export function createCatalogBoundary(verify){if(typeof verify!=='function')throw Error('Catalog verifier required');return {accept(offers){if(!Array.isArray(offers)||verify(offers)!==true)throw Error('Unrecognized catalog');offers.forEach(validateOffer);const c=freeze(structuredClone(offers));catalogCapabilities.add(c);return c;}};}
export function requireCatalog(cap,offers){if(!catalogCapabilities.has(cap)||fingerprint(cap)!==fingerprint(offers))throw Error('Trusted catalog producer required');}
