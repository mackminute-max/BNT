import {reduceCycle} from '../../career/cycles/reducers.js';
import {actionQuote,actionCommand} from '../model.js';
import {acquireRecord,addContract} from '../../career/economy/records.js';
import {TERMS} from '../../career/economy/catalog.js';
import {activeTeam} from './active-team.js';
export const UI_P1=typeof BNT_M3UIP1_BUILD!=='undefined'&&BNT_M3UIP1_BUILD;
export function contextQuote(s,type,payload,id,presentation=null){
 const q=actionQuote(s,type,payload),command=actionCommand(s,type,payload,id);let contract=null;
 if(type==='market.acquire'){const o=s.management.registries.marketOffers[payload.offerId];if(['driver','specialist'].includes(o.category)){const person=acquireRecord(o,s.career.id),r={contracts:{}};addContract(r,person,payload.term);contract=Object.values(r.contracts)[0];}}
 if(['contract.renew','personnel.terminate','contract.release'].includes(type)){const p=s.management.registries.personnel[payload.personId]??s.management.registries.specialists[payload.personId];contract=s.management.registries.contracts[p.references.contract?.[0]]??null;}
 if(['asset.sell','personnel.terminate','contract.release'].includes(type)){const t=activeTeam(s,presentation),key=payload.assetId??payload.personId;if([t.driverId,...t.beastIds,t.chariotId].includes(key))throw Error('Deactivate this asset in Roster & Barn before removing it.');}
 if(['contract.renew','emergency.request'].includes(type)){const next=structuredClone(s),preview=reduceCycle(next,type,payload);contract=next.management.registries.contracts[preview.details.contractId];}
 const lines=[q.delta>0?`Receive ${q.delta} Gold`:`Cost: ${q.cost??Math.max(0,-q.delta)} Gold`,...(q.xpCost?[`Cost: ${q.xpCost} XP`]:[])];
 if(contract){lines.push(`Employment: ${contract.wage} Gold per championship cycle; ${contract.cyclesRemaining} cycles remaining`);if(type==='market.acquire')lines.push(`Signing surcharge: ${q.details.signingSurcharge} Gold (included); early termination: ${TERMS[payload.term].termination} base wage(s)`);}

 const details=q.details??{};if(details.field||details.attribute)lines.push(`${details.field??details.attribute}: ${details.before} → ${details.after}`);
 if(details.discountPercent!==undefined)lines.push(`Staff/facility discount: ${details.discountPercent}%`);
 if(['service.apply','training.apply','engineering.apply'].includes(type))lines.push('Completes immediately when confirmed.');
 if(type==='facility.purchase')lines.push('Available immediately after purchase.');
 if(type==='payroll.pay')for(const a of q.details.allocations??[]){const claim=s.cycles.obligations[a.obligationId];lines.push(`${claim?.creditor.name??'Wage claim'}: ${a.amount} Gold`);}
 if(type==='career.confirmFailure')lines.push('This permanently ends this career. '+(q.details.assessment?.reasons.join(' ')??''));
 if(type==='personnel.terminate')lines.push('Ends employment permanently; existing unpaid wage claims remain due.');
 return {quote:q,command,contract,lines,signature:JSON.stringify({revision:s.revision,maintenance:s.maintenanceRevision,quote:q,contract})};
}
export function actionLabel(type,payload,s){if(type==='market.acquire')return ['driver','specialist'].includes(s.management.registries.marketOffers[payload.offerId]?.category)?'Hire':'Purchase';return ({'asset.sell':'Sell','personnel.terminate':'End contract','equipment.detach':'Detach','facility.purchase':'Purchase','service.apply':'Apply service','training.apply':'Train','engineering.apply':'Improve chariot','contract.renew':'Renew contract','contract.release':'Release employee','payroll.pay':'Pay wages','emergency.request':'Request replacement driver','career.confirmFailure':'Confirm career failure'})[type]??'Confirm';}
