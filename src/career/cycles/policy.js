import {consequenceDefaults} from '../../sim/consequences.js';
import {plus} from './contracts.js';
import {previewRU3,quoteEconomy} from '../economy/reducers.js';
import {freeze} from '../assets.js';
export const RECOVERY=freeze({version:1,driverFatigue:20,beastFatigue:20});
export const debtStatus=streak=>streak===0?'Current':streak===1?'Overdue':streak===2?'Delinquent':streak===3?'Critical':'Default';
export const moraleMultiplier=status=>({Current:1,Overdue:1,Delinquent:.95,Critical:.9,Default:.85})[status];
export function requirePreparation(s){if(s.cycles.phase!=='STABLE_PREPARATION'||s.career.status==='Failed')throw Error('Career is not in playable stable preparation');}
export function restrict(s,type){requirePreparation(s);if(s.cycles.streak>=2&&['market.acquire','facility.purchase','training.apply','engineering.apply'].includes(type))throw Error('Payroll '+debtStatus(s.cycles.streak)+': discretionary action restricted');if(s.cycles.streak>=3&&type==='contract.renew')throw Error('Payroll Critical/Default: renewal blocked');}
export const outstanding=s=>Object.values(s.cycles.obligations).reduce((sum,o)=>plus(sum,o.balance),0);
export function previewRU4(s,selection,options={}){
 const p=previewRU3(s,selection,options),d=s.management.registries.personnel[selection?.driverId],c=s.management.registries.contracts[d?.references.contract?.[0]];
 if(!c||c.lifecycle!=='active'||c.cyclesRemaining<1)return freeze({...p,eligible:false,reasons:[...p.reasons,'Driver contract is expired or unavailable'],native:null,derived:null});
 if(p.native&&d.personality){const copy=structuredClone(p);copy.native.driver.personality=structuredClone(d.personality);return freeze(copy);}return p;
}
export function eligibleDrivers(s){return Object.values(s.management.registries.personnel).filter(p=>{const c=s.management.registries.contracts[p.references.contract?.[0]];return p.available&&['Healthy','Minor'].includes(p.injury)&&p.condition>consequenceDefaults.disabledCondition&&c?.lifecycle==='active'&&c.cyclesRemaining>0;});}
export function normalDriverRecruitment(s){
 for(const offer of Object.values(s.management.registries.marketOffers).filter(o=>o.category==='driver'&&o.available))try{restrict(s,'market.acquire');const q=quoteEconomy({...s,schema:3},'market.acquire',{offerId:offer.id,term:'short'});if(q.canAfford)return true;}catch{}
 return false;
}
export function assessViability(s){
 if(s.career.status==='Failed')return freeze({status:'Failed',reasons:['Career failure was explicitly confirmed'],canConfirm:false});
 const r=structuredClone(s.management.registries);for(const k of ['personnel','beasts','chariots'])for(const a of Object.values(r[k]))a.references.assignment=[];
 r.assignments={};const shadow={...s,management:{...s.management,registries:r}},bs=Object.values(r.beasts);
 for(const d of eligibleDrivers(shadow))for(const c of Object.values(r.chariots))for(let i=0;i<bs.length;i++)for(let j=i+1;j<bs.length;j++)if(previewRU4(shadow,{driverId:d.id,beastIds:[bs[i].id,bs[j].id],chariotId:c.id}).eligible)return freeze({status:'Operational',reasons:['A legal Racing Unit can be assembled'],canConfirm:false});
 // Optimistic upper bound: count every owned asset (even ineligible), every unconsumed
 // offer (even unaffordable/restricted), and unlimited hypothetical driver recovery.
 // If even this superset lacks an indispensable resource, no permitted sequence can work.
 const potential=kind=>Object.keys(r[kind]).length+Object.values(r.marketOffers).filter(o=>o.available&&o.category===({beasts:'beast',chariots:'chariot'}[kind])).length;
 const reasons=[];if(potential('beasts')<2)reasons.push('Fewer than two beasts exist across owned assets and all remaining offers; no beast assistance or refresh exists');if(potential('chariots')<1)reasons.push('No chariot exists among owned assets or remaining offers; no chariot assistance or refresh exists');
 return freeze(reasons.length?{status:'FailurePending',reasons,canConfirm:true}:{status:'Blocked',reasons:['No legal RU now; permitted recovery reachability is not proven exhausted. Inspect care, sales, renewal, recruitment or driver-only emergency options.'],canConfirm:false});
}
