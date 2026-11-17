import {exact,id} from '../legacy-state.js';
import {canonical} from '../../core/determinism.js';
import {sha256} from './fingerprint.js';
export const ECONOMY_TYPES=Object.freeze(['market.acquire','asset.sell','personnel.terminate','equipment.detach','facility.purchase','service.apply','training.apply','engineering.apply']);
const SHAPES={'market.acquire':['offerId','term'],'asset.sell':['assetId'],'personnel.terminate':['personId'],'equipment.detach':['equipmentId'],'facility.purchase':['propertyId','upgradeId'],'service.apply':['assetId','service','amount'],'training.apply':['assetId','attribute','points'],'engineering.apply':['assetId','attribute','points']};
export function validateEconomyCommand(tx){
 exact(tx,['id','profileId','careerId','expectedRevision','expectedMaintenanceRevision','commandVersion','type','effectId','delta','reason','payload'],'M2-C command v2');
 for(const key of ['id','profileId','careerId'])id(tx[key]);
 if(tx.commandVersion!==2||!Object.hasOwn(SHAPES,tx.type)||!Number.isSafeInteger(tx.expectedRevision)||tx.expectedRevision<0||!Number.isSafeInteger(tx.expectedMaintenanceRevision)||tx.expectedMaintenanceRevision<1||!Number.isSafeInteger(tx.delta)||typeof tx.reason!=='string'||!tx.reason.trim()||tx.reason.length>500||typeof tx.effectId!=='string'||!/^[a-zA-Z0-9_-]{1,128}$/.test(tx.effectId))throw Error('Invalid economic command/version/revision');
 exact(tx.payload,SHAPES[tx.type],'economic payload');
 for(const key of ['offerId','assetId','personId','equipmentId','propertyId'])if(Object.hasOwn(tx.payload,key))id(tx.payload[key]);
 for(const key of ['term','upgradeId','service','attribute'])if(Object.hasOwn(tx.payload,key)&&tx.payload[key]!==null&&(typeof tx.payload[key]!=='string'||!tx.payload[key].length||tx.payload[key].length>64))throw Error('Invalid economic selector');
 if(Object.hasOwn(tx.payload,'points')&&(!Number.isInteger(tx.payload.points)||tx.payload.points<1||tx.payload.points>5))throw Error('Request 1–5 full increments');
 if(Object.hasOwn(tx.payload,'amount')&&tx.payload.amount!==null&&(!Number.isFinite(tx.payload.amount)||tx.payload.amount<=0||tx.payload.amount>100))throw Error('Invalid requested service amount');
}
export function economicEffect(state,type,payload){
 let key;
 if(type==='market.acquire')key=['acquire',payload.offerId];
 else if(type==='asset.sell')key=['sell',payload.assetId];
 else if(type==='personnel.terminate')key=['terminate',payload.personId];
 else if(type==='equipment.detach')key=['detach',payload.equipmentId];
 else if(type==='facility.purchase')key=['facility',payload.propertyId,payload.upgradeId];
 else if(type==='engineering.apply')key=['engineering',payload.assetId,Object.values(state.management.registries.chariots[payload.assetId]?.engineering.increments??{}).reduce((a,b)=>a+b,0)];
 else key=[type,payload.assetId,payload.service??payload.attribute,state.revision,state.maintenanceRevision];
 return 'economy-'+sha256(canonical([state.career.id,...key])).slice(0,48);
}
function validateResult(tx,result){
 exact(result,['type','cost','delta','details'],'economic result');
 if(result.type!==tx.type||result.delta!==tx.delta||!Number.isSafeInteger(result.cost)||result.cost<0)throw Error('Inconsistent protected economic result');
 const fields={
  'market.acquire':['offerId','assetId','category','price','signingSurcharge'],
  'asset.sell':['assetId','name','category','proceeds'],
  'personnel.terminate':['personId','kind','contractId','fee'],
  'equipment.detach':['equipmentId','chariotId'],
  'facility.purchase':['propertyId','upgradeId','facilityId'],
  'service.apply':['assetId','service','field','before','after','basePrice','discountPercent'],
  'training.apply':['assetId','attribute','points','before','after','xpCost','increments'],
  'engineering.apply':['assetId','attribute','points','before','after','xpCost','increments'],
 }[tx.type];exact(result.details,fields,'economic result details');const d=result.details;
 for(const key of ['assetId','offerId','personId','contractId','equipmentId','chariotId','propertyId','facilityId'])if(Object.hasOwn(d,key))id(d[key]);
 for(const key of ['assetId','offerId','personId','equipmentId','propertyId','upgradeId','service','attribute','points'])if(Object.hasOwn(tx.payload,key)&&Object.hasOwn(d,key)&&tx.payload[key]!==d[key])throw Error('Economic result target mismatch');
 const integer=n=>{if(!Number.isSafeInteger(n)||n<0)throw Error('Invalid economic result integer');};
 for(const key of ['price','signingSurcharge','proceeds','fee','basePrice','discountPercent','xpCost'])if(Object.hasOwn(d,key))integer(d[key]);
 if(tx.type==='asset.sell'){if(result.cost!==0||tx.delta!==d.proceeds)throw Error('Inconsistent resale facts');}
 else if(tx.delta!==-result.cost)throw Error('Inconsistent economic debit');
 if(tx.type==='market.acquire'&&result.cost!==d.price+d.signingSurcharge)throw Error('Inconsistent acquisition cost');
 if(tx.type==='personnel.terminate'&&result.cost!==d.fee)throw Error('Inconsistent termination fee');
 if(tx.type==='equipment.detach'&&result.cost!==0)throw Error('Detach must be free');
 if(tx.type==='service.apply'&&d.discountPercent>25)throw Error('Invalid discount facts');
 if(['training.apply','engineering.apply'].includes(tx.type)){
  if(!Number.isFinite(d.before)||!Number.isFinite(d.after)||d.before<0||d.after>100||!Array.isArray(d.increments)||d.increments.length!==tx.payload.points)throw Error('Invalid permanent-increment result');
  for(const i of d.increments){exact(i,['before','cost'],'increment cost detail');integer(i.cost);if(!Number.isFinite(i.before)||i.before<0||i.before>=100)throw Error('Invalid incremental rating');}
  if(tx.type==='training.apply'&&result.cost!==0)throw Error('Training must spend XP only');
  if(tx.type==='engineering.apply'&&d.xpCost!==0)throw Error('Engineering must spend Gold only');
 }
}
export function protectEconomic(tx,balanceAfter,result){
 validateEconomyCommand(tx);validateResult(tx,result);return {commandVersion:2,id:tx.id,profileId:tx.profileId,careerId:tx.careerId,request:canonical(tx),fingerprint:sha256(canonical(tx)),effectId:tx.effectId,resultRevision:tx.expectedRevision+1,delta:tx.delta,balanceAfter,result:structuredClone(result),retention:'P0'};
}
export function validateEconomicEntry(e){
 exact(e,['commandVersion','id','profileId','careerId','request','fingerprint','effectId','resultRevision','delta','balanceAfter','result','retention'],'protected economy entry');
 if(typeof e.request!=='string'||e.request.length>3000||!Number.isSafeInteger(e.balanceAfter)||e.balanceAfter<0)throw Error('Invalid protected economy request/balance');
 const request=JSON.parse(e.request);const expected=protectEconomic(request,e.balanceAfter,e.result);
 if(canonical(expected)!==canonical(e))throw Error('Protected economy facts mismatch');return e;
}
