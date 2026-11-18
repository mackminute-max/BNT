import {decimal,add} from '../economy/arithmetic.js';
import {integrityStatus,freeze} from '../assets.js';
import {INJURIES3} from '../economy/catalog.js';
import {validateRU} from '../../model/ru.js';
import {fingerprint} from '../cycles/contracts.js';
import {consequenceDefaults} from '../../sim/consequences.js';
export const CONDITION_MAPPING='m2e-condition-mapping-v1';
const rating=n=>{if(!Number.isFinite(n)||n<0||n>100)throw Error('Condition must be finite 0..100');return n;};
export const injuryFromCondition=c=>rating(c)>=80?'Healthy':c>=60?'Minor':c>=30?'Major':'Critical';
export function worseInjury(old,c){if(!INJURIES3.includes(old))throw Error('Invalid management injury');return INJURIES3[Math.max(INJURIES3.indexOf(old),INJURIES3.indexOf(injuryFromCondition(c)))];}
export function treatmentCondition(c,injury){rating(c);if(!INJURIES3.includes(injury))throw Error('Invalid treatment injury');return Math.min(100,Math.max(c,({Healthy:80,Minor:60,Major:30,Critical:0})[injury]));}
export function repairCondition(c,actual){rating(c);rating(actual);return Math.min(100,c+actual);}
export function initialCondition(entrant,state){
 const n=entrant.native;
 if(entrant.player){const ids=entrant.assetIds,r=state.management.registries,d=r.personnel[ids.driver],b=ids.beasts.map(id=>r.beasts[id]),c=r.chariots[ids.chariot];return {driver:{injury:d.injury,available:d.available},beasts:b.map(x=>({injury:x.injury,available:x.available})),chariot:{integrity:c.integrity,status:c.status,available:c.available}};}
 return {driver:{injury:'Healthy',available:true},beasts:n.beasts.map(()=>({injury:'Healthy',available:true})),chariot:{integrity:100,status:'Functional',available:true}};
}
export function nativeEligibility(native,persistent){
 validateRU(native);const reasons=[];if(!persistent.driver.available||['Major','Critical'].includes(persistent.driver.injury))reasons.push('Unavailable or Major/Critical driver');
 if(persistent.beasts.some(b=>!b.available||['Major','Critical'].includes(b.injury)))reasons.push('Unavailable or Major/Critical beast');
 if(!persistent.chariot.available||['Critical','Destroyed'].includes(persistent.chariot.status))reasons.push('Ineligible chariot');
 if(native.driver.condition<=consequenceDefaults.disabledCondition||native.chariot.condition<=consequenceDefaults.disabledCondition||native.beasts.every(b=>b.condition<=consequenceDefaults.minimumTeamCondition))reasons.push('Native disable threshold');
 return {eligible:reasons.length===0,reasons};
}
export function mapCondition({version=CONDITION_MAPPING,instanceId,eventId,resultId,start,final,persistent,provenance}){
 if(version!==CONDITION_MAPPING)throw Error('Unsupported condition mapping');validateRU(start);validateRU(final);if(start.id!==final.id||start.beasts.length!==final.beasts.length||persistent.beasts.length!==final.beasts.length)throw Error('Condition identity/team mismatch');
 const next=structuredClone(persistent);next.driver.injury=worseInjury(next.driver.injury,final.driver.condition);next.beasts.forEach((b,i)=>b.injury=worseInjury(b.injury,final.beasts[i].condition));
 const loss=Math.max(0,start.chariot.condition-final.chariot.condition);next.chariot.integrity=Math.max(0,Math.min(100,rating(next.chariot.integrity)-loss));next.chariot.status=integrityStatus(next.chariot.integrity);
 const audit={version,instanceId,eventId,resultId,entrantId:final.id,source:structuredClone(provenance),startFingerprint:fingerprint(start),finalFingerprint:fingerprint(final),chariotLoss:loss,effectId:'e3-condition-'+fingerprint([instanceId,eventId,resultId,final.id,version]).slice(0,40)};
 return freeze({native:structuredClone(final),persistent:next,eligibility:nativeEligibility(final,next),audit});
}
// Called only by the new controller version after the original paid reducer.
// Historical commands before explicit activation retain their original effects.
export function restoreServiceNative(state,tx,result){
 if(tx.commandVersion!==2||tx.type!=='service.apply')return;const d=result.details,r=state.management.registries;const record=r.personnel[d.assetId]??r.beasts[d.assetId]??r.chariots[d.assetId];if(!record)return;
 if(d.field==='injury')record.condition=treatmentCondition(record.condition,d.after);
 if(d.field==='integrity')record.condition=repairCondition(record.condition,decimal(add(d.after,-d.before)));
}
