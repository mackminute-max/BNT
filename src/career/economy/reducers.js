import {canonical} from '../../core/determinism.js';
import {freeze,integrityStatus} from '../assets.js';
import {defaultRU,validateRU,derive} from '../../model/ru.js';
import {config} from '../../config/config.js';
import {consequenceDefaults} from '../../sim/consequences.js';
import {id} from '../legacy-state.js';
import {TERMS,UPGRADES,SERVICES,INJURIES3,PRICES} from './catalog.js';
import {ratingKeys,acquireRecord,addContract,upgradeRecordId,valuationHealth} from './records.js';
import {rounded,mul,add,compare,conditionFactor,rational,decimal} from './arithmetic.js';
import {validateEconomyCommand,economicEffect} from './commands.js';
const CATEGORY_REGISTRY={driver:'personnel',beast:'beasts',chariot:'chariots',specialist:'specialists',equipment:'equipment'};
function asset(state,key,allowed=['personnel','beasts','chariots','equipment','specialists']){
 for(const kind of allowed)if(Object.hasOwn(state.management.registries[kind],key)){
  const record=state.management.registries[kind][key];if(record.ownerCareerId!==state.career.id)throw Error('Foreign owned asset');return {kind,record};
 }throw Error('Missing eligible owned asset: '+key);
}
export function hasUpgrade(state,key){return Object.values(state.management.registries.facilities).some(f=>f.descriptiveOnly===false&&f.upgradeId===key);}
function activeRole(state,role){const r=state.management.registries;return Object.values(r.specialists).some(p=>p.role===role&&p.available&&['Healthy','Minor'].includes(p.injury)&&p.references.contract?.length===1&&r.contracts[p.references.contract[0]]?.cyclesRemaining>0);}
function assigned(record){if(record.references.assignment?.length)throw Error('Asset is assigned: explicitly disassemble the RU first');}
function serviceDiscount(state,service){let discount=0;if(service.role&&activeRole(state,service.role))discount+=15;if(service.workshop&&hasUpgrade(state,'workshop'))discount+=10;if(service.ward&&hasUpgrade(state,'treatment-ward'))discount+=10;return Math.min(25,discount);}
export function resaleValue(category,record){
 const e=record.economics;if(category==='equipment')return Math.min(e.acquisitionBasis,rounded(mul(e.acquisitionBasis,0.4),'floor'));
 if(!['beast','chariot'].includes(category))throw Error('Personnel cannot be resold');
 return Math.min(e.acquisitionBasis,rounded(mul(mul(mul(PRICES[category][e.tier],e.quality),conditionFactor(valuationHealth(category,record))),0.5),'floor'));
}
export function incrementCost(current,points,{engineering=false,discount=false}={}){
 if(!Number.isFinite(current)||current<0||current>100||!Number.isInteger(points)||points<1||points>5||compare(add(current,points),100)>0)throw Error('Invalid full increments or native cap exceeded');
 let total=0;for(let i=0;i<points;i++){const value=add(current,i),band=compare(value,60)<0?0:compare(value,75)<0?1:compare(value,90)<0?2:3;total+=(engineering?[75,125,200,350]:[10,20,35,60])[band];}
 return discount?rounded(mul(total,0.9),'ceil'):total;
}
export function quoteEconomy(state,type,payload){
 if(state.schema!==3||!state.management.initialized||state.pendingRace!==null)throw Error('An initialized schema-3 stable without pending race is required');
 validateEconomyCommand({id:'quote',profileId:state.profile.id,careerId:state.career.id,expectedRevision:state.revision,expectedMaintenanceRevision:state.maintenanceRevision,commandVersion:2,type,effectId:'quote',delta:0,reason:'Read-only quote',payload});
 const r=state.management.registries;let cost=0,credit=0,details={},xpCost=0;
 if(type==='market.acquire'){
  const offer=r.marketOffers[payload.offerId];if(!offer||!offer.available)throw Error('Offer is unavailable or consumed');
  const kind=CATEGORY_REGISTRY[offer.category],cap={personnel:'drivers',specialists:'specialists',beasts:'beasts',chariots:'chariots'}[kind],property=Object.values(r.properties)[0];
  if(cap&&Object.keys(r[kind]).length>=property.capacities[cap])throw Error('Capacity exceeded: '+cap+(kind==='specialists'?' (purchase Staff Quarters first)':''));
  const personnel=['driver','specialist'].includes(offer.category);
  if(personnel&&!Object.hasOwn(TERMS,payload.term))throw Error('Choose a contract term');
  if(!personnel&&payload.term!==null)throw Error('Owned assets have no employment term');
  cost=offer.price+(personnel?TERMS[payload.term].surcharge:0);
  const acquired=acquireRecord(offer,state.career.id);details={offerId:offer.id,assetId:acquired.id,category:offer.category,price:offer.price,signingSurcharge:personnel?TERMS[payload.term].surcharge:0};
 }else if(type==='asset.sell'){
  const {kind,record}=asset(state,payload.assetId);assigned(record);
  const category={beasts:'beast',chariots:'chariot',equipment:'equipment'}[kind];if(!category)throw Error('Personnel cannot be resold');
  if(kind==='equipment'&&record.references.installedOn?.length)throw Error('EQUIPMENT_INSTALLED: explicitly detach first');
  if(kind==='chariots'&&record.references.equipment?.length)throw Error('Explicitly detach all installed equipment first');
  credit=resaleValue(category,record);details={assetId:record.id,name:record.name,category,proceeds:credit};
 }else if(type==='personnel.terminate'){
  const {kind,record}=asset(state,payload.personId,['personnel','specialists']);assigned(record);const contract=r.contracts[record.references.contract?.[0]];if(!contract)throw Error('No active contract');
  cost=contract.baseWage*TERMS[contract.term].termination;details={personId:record.id,kind,contractId:contract.id,fee:cost};
 }else if(type==='equipment.detach'){
  const {record}=asset(state,payload.equipmentId,['equipment']);const key=record.references.installedOn?.[0];if(!key||!r.chariots[key]?.references.equipment?.includes(record.id))throw Error('Equipment is already detached or references are inconsistent');details={equipmentId:record.id,chariotId:key};
 }else if(type==='facility.purchase'){
  const property=r.properties[payload.propertyId],upgrade=UPGRADES[payload.upgradeId];if(!property||!upgrade)throw Error('Invalid property or upgrade');if(hasUpgrade(state,payload.upgradeId))throw Error('Upgrade already owned');cost=upgrade.cost;details={propertyId:property.id,upgradeId:payload.upgradeId,facilityId:upgradeRecordId(property.id,payload.upgradeId)};
 }else if(type==='service.apply'){
  const service=SERVICES[payload.service];if(!service)throw Error('Unsupported service');const {record}=asset(state,payload.assetId,[service.registry]);let before=record[service.field],after;
  if(service.field==='injury'){
   const severity=INJURIES3.indexOf(before);if(severity<=0)throw Error('Service has no effect');after=INJURIES3[severity-1];
  }else if(service.field==='integrity'){
   if(payload.amount===null)throw Error('Specify requested integrity restoration');after=Math.min(100,decimal(add(before,payload.amount)));
  }else after=Math.max(0,decimal(add(before,-25)));
  if(service.field!=='integrity'&&payload.amount!==null)throw Error('Fixed services do not accept a custom amount');
  if(before===after)throw Error('Service has no effect');
  const actual=service.field==='integrity'?add(after,-before):null;
  const base=service.field==='integrity'?rounded(mul(actual,1.5),'ceil'):service.cost,discount=serviceDiscount(state,service);
  cost=Math.max(1,rounded(mul(base,(100-discount)/100)));details={assetId:record.id,service:payload.service,field:service.field,before,after,basePrice:base,discountPercent:discount};
 }else if(type==='training.apply'||type==='engineering.apply'){
  const engineering=type==='engineering.apply',{kind,record}=asset(state,payload.assetId,engineering?['chariots']:['personnel','beasts']);
  if(!ratingKeys[kind].includes(payload.attribute))throw Error('Unsupported native rating field');
  const before=record.attributes[payload.attribute];
  if(engineering&&Object.values(record.engineering.increments).reduce((a,b)=>a+b,0)+payload.points>10)throw Error('Lifetime engineering cap of 10 increments exceeded');
  const amount=incrementCost(before,payload.points,{engineering,discount:!engineering&&hasUpgrade(state,'training-grounds')});
  if(engineering)cost=amount;else xpCost=amount;
  details={assetId:record.id,attribute:payload.attribute,points:payload.points,before,after:decimal(add(before,payload.points)),xpCost,increments:Array.from({length:payload.points},(_,i)=>({before:decimal(add(before,i)),cost:incrementCost(decimal(add(before,i)),1,{engineering})}))};
 }
 const effectId=economicEffect(state,type,payload);
 if(state.history.commands.some(e=>e.effectId===effectId))throw Error('Business effect already committed on retained history');
 const person=payload.assetId?(()=>{try{return asset(state,payload.assetId).record;}catch{return null;}})():null;
 return freeze({type,cost,credit,delta:credit-cost,xpCost,effectId,canAfford:state.career.treasury>=cost&&(!xpCost||person?.xp>=xpCost),details});
}
export function executeEconomy(state,tx){
 const q=quoteEconomy(state,tx.type,tx.payload);if(tx.delta!==q.delta||tx.effectId!==q.effectId)throw Error('Economic delta/effect differs from authoritative quote');if(!q.canAfford)throw Error(q.xpCost?'Insufficient XP':'Insufficient Gold');
 const r=state.management.registries,p=tx.payload,d=q.details;
 if(tx.type==='market.acquire'){
  const offer=r.marketOffers[p.offerId],record=acquireRecord(offer,state.career.id),kind=CATEGORY_REGISTRY[offer.category];
  if(Object.values(r).some(records=>Object.hasOwn(records,record.id)))throw Error('Owned identity already exists');r[kind][record.id]=record;
  if(['driver','specialist'].includes(offer.category))addContract(r,record,p.term);offer.available=false;
 }else if(tx.type==='asset.sell'){const found=asset(state,p.assetId);delete r[found.kind][p.assetId];}
 else if(tx.type==='personnel.terminate'){delete r[d.kind][p.personId];delete r.contracts[d.contractId];}
 else if(tx.type==='equipment.detach'){r.chariots[d.chariotId].references.equipment=r.chariots[d.chariotId].references.equipment.filter(key=>key!==p.equipmentId);r.equipment[p.equipmentId].references.installedOn=[];}
 else if(tx.type==='facility.purchase'){
  const u=UPGRADES[p.upgradeId],property=r.properties[p.propertyId];r.facilities[d.facilityId]={id:d.facilityId,ownerCareerId:state.career.id,references:{property:[property.id]},recordVersion:2,name:u.name,descriptiveOnly:false,upgradeId:p.upgradeId};property.references.facilities.push(d.facilityId);if(u.capacity)property.capacities[u.capacity]+=u.amount;
 }else if(tx.type==='service.apply'){
  const {record}=asset(state,p.assetId);record[d.field]=d.after;if(d.field==='integrity')record.status=integrityStatus(d.after);
 }else if(tx.type==='training.apply'||tx.type==='engineering.apply'){
  const {record}=asset(state,p.assetId);record.attributes[p.attribute]=d.after;
  if(tx.type==='training.apply'){record.xp-=q.xpCost;record.training[p.attribute]+=p.points;}else{record.engineering.increments[p.attribute]+=p.points;record.engineering.spentGold+=q.cost;}
 }
 state.career.treasury+=q.delta;if(!Number.isSafeInteger(state.career.treasury)||state.career.treasury<0)throw Error('Invalid treasury result');
 return {type:tx.type,cost:q.cost,delta:q.delta,details:structuredClone(q.details)};
}
export function previewRU3(state,selection,{assignmentId=null}={}){
 const reasons=[],r=state.management.registries,{driverId,beastIds,chariotId}=selection??{},current=r.assignments[assignmentId];
 const assembled=Boolean(current&&current.driverId===driverId&&current.chariotId===chariotId&&canonical(current.beastIds)===canonical(beastIds));
 if(!Array.isArray(beastIds)||beastIds.length!==2||new Set(beastIds).size!==2)reasons.push('Select two distinct beasts');
 for(const [kind,key] of [['personnel',driverId],...(Array.isArray(beastIds)?beastIds:[]).map(k=>['beasts',k]),['chariots',chariotId]]){
  const a=r[kind][key];if(!a||a.ownerCareerId!==state.career.id){reasons.push('Missing/foreign component');continue;}
  if(a.references.assignment?.some(k=>k!==assignmentId))reasons.push('Exclusive assignment conflict');
  if(!a.available||['Major','Critical'].includes(a.injury)||['Critical','Destroyed'].includes(a.status))reasons.push('Unavailable/ineligible component: '+a.name);
 }
 if(reasons.length)return freeze({assembled,eligible:false,reasons,native:null,derived:null});
 const driver=r.personnel[driverId],beasts=beastIds.map(k=>r.beasts[k]),chariot=r.chariots[chariotId],native=defaultRU('management-preview');
 native.driver={...driver.attributes,condition:driver.condition,strain:driver.strain};native.beasts=beasts.map(b=>({...b.attributes,condition:b.condition,fatigue:b.fatigue}));native.chariot={...chariot.attributes,condition:chariot.condition,wear:chariot.wear,weight:chariot.weight,capacity:chariot.capacity};native.equipment={mass:0,combat:0};
 if(driver.condition<=consequenceDefaults.disabledCondition||chariot.condition<=consequenceDefaults.disabledCondition||beasts.every(b=>b.condition<=consequenceDefaults.minimumTeamCondition))reasons.push('Native engine disable threshold');
 try{validateRU(native);}catch(e){reasons.push(e.message);}if(reasons.length)return freeze({assembled,eligible:false,reasons,native:null,derived:null});
 return freeze({assembled,eligible:true,reasons:[],native,derived:derive(native,config()),label:'Baseline / no weather or surface adjustment; management fatigue and integrity are separate. Not competition entry.'});
}
export function applyAssembly3(state,tx){
 const r=state.management.registries,key=tx.assignmentId;id(key);const old=r.assignments[key];
 if(tx.type==='ru.disassemble'&&!old)throw Error('No prospective RU to disassemble');
 if(tx.type==='ru.assemble'){
  const preview=previewRU3(state,tx,{assignmentId:key});if(!preview.eligible)throw Error(preview.reasons.join('; '));
  if([state.profile.id,state.career.id].includes(key)||Object.entries(r).some(([kind,records])=>kind!=='assignments'&&Object.hasOwn(records,key)))throw Error('Assignment identity collision');
 }
 if(old){for(const subject of old.references.subject)for(const kind of ['personnel','beasts','chariots'])if(r[kind][subject])r[kind][subject].references.assignment=[];delete r.assignments[key];}
 if(tx.type==='ru.assemble'){
  const subjects=[tx.driverId,...tx.beastIds,tx.chariotId];r.assignments[key]={id:key,ownerCareerId:state.career.id,references:{subject:subjects},recordVersion:1,name:'Prospective Racing Unit',kind:'prospectiveRU',driverId:tx.driverId,beastIds:[...tx.beastIds],chariotId:tx.chariotId};
  for(const subject of subjects)for(const kind of ['personnel','beasts','chariots'])if(r[kind][subject])r[kind][subject].references.assignment=[key];
 }
 return {assignmentId:key,assembled:tx.type==='ru.assemble'};
}
