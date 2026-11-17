import {BASIC_CAPACITY,integrityStatus} from '../assets.js';
import {driverAttributes,beastAttributes,chariotAttributes} from '../../model/ru.js';
import {PRICES,TERMS,WAGES} from './catalog.js';
import {mean,compare,qualityFromRatings,decimal,rounded,mul,conditionFactor} from './arithmetic.js';
import {sha256} from './fingerprint.js';
export const ownedId=(careerId,offerId)=>'owned-'+sha256(careerId+'|'+offerId).slice(0,32);
export const contractId=(careerId,personId)=>'contract-'+sha256(careerId+'|'+personId).slice(0,32);
export const upgradeRecordId=(propertyId,upgrade)=>'upgrade-'+sha256(propertyId+'|'+upgrade).slice(0,32);
export const tierFromRatings=a=>compare(mean(Object.values(a)),45)<0?'Budget':compare(mean(Object.values(a)),65)<0?'Standard':'Premium';
export function valuationHealth(category,record){const value=category==='chariot'?record.integrity:record.condition;if(!Number.isFinite(value)||value<0||value>100)throw Error('Invalid valuation-health-v1 input');return value;}
export function economics(category,record,{tier,quality,wageQuality=null,paid=null,sourceOfferId=null}={}){
 const baseAttributes=record.attributes?structuredClone(record.attributes):null;
 tier??=category==='equipment'?'Budget':tierFromRatings(record.attributes);
 quality??=baseAttributes?decimal(qualityFromRatings(baseAttributes)):1;
 const originalHealth=['driver','beast','chariot'].includes(category)?valuationHealth(category,record):null;
 const acquisitionBasis=paid??(category==='driver'||category==='specialist'?0:category==='equipment'?100:rounded(mul(mul(PRICES[category][tier],quality),conditionFactor(originalHealth)),'half-up',5));
 return {tier,quality,baseAttributes,originalHealth,acquisitionBasis,sourceOfferId,wageQuality,baseWage:wageQuality===null?null:rounded(mul(WAGES[category][tier],wageQuality))};
}
export function upgradeStarterRecords(registries){
 for(const [registry,category] of [['personnel','driver'],['beasts','beast'],['chariots','chariot'],['equipment','equipment']])for(const r of Object.values(registries[registry])){
  r.recordVersion=2;r.economics=economics(category,r,{wageQuality:category==='driver'?1:null});
  if(category==='driver'||category==='beast')r.training=Object.fromEntries(Object.keys(r.attributes).map(k=>[k,0]));
  if(category==='chariot')r.engineering={increments:Object.fromEntries(chariotAttributes.map(k=>[k,0])),spentGold:0};
 }
 for(const r of Object.values(registries.properties))r.recordVersion=2;
}
export function addContract(registries,person,term,{grandfathered=false}={}){
 const terms=TERMS[term];if(!terms)throw Error('Invalid contract term');const key=contractId(person.ownerCareerId,person.id);
 if(registries.contracts[key])throw Error('Contract identity already exists');
 const baseWage=person.economics.baseWage;
 registries.contracts[key]={id:key,ownerCareerId:person.ownerCareerId,references:{employee:[person.id]},recordVersion:2,name:person.name+' contract',term,cyclesRemaining:terms.duration,baseWage,wage:rounded(mul(baseWage,terms.multiplier)),grandfathered,sourceOfferId:person.economics.sourceOfferId};
 person.references.contract=[key];return key;
}
export function acquireRecord(offer,careerId){
 const key=ownedId(careerId,offer.id),r={id:key,ownerCareerId:careerId,references:{},recordVersion:2,name:offer.name,...structuredClone(offer.template)};
 if(offer.category!=='equipment')r.available=true;
 if(offer.category==='driver')r.role='driver';
 if(offer.category==='chariot'){r.status=integrityStatus(r.integrity);r.engineering={increments:Object.fromEntries(chariotAttributes.map(k=>[k,0])),spentGold:0};}
 if(offer.category==='driver'||offer.category==='beast')r.training=Object.fromEntries(Object.keys(r.attributes).map(k=>[k,0]));
 r.economics=economics(offer.category,r,{tier:offer.tier,quality:offer.quality,wageQuality:offer.wageQuality,paid:offer.price,sourceOfferId:offer.id});
 return r;
}
export const ratingKeys={personnel:driverAttributes,beasts:beastAttributes,chariots:chariotAttributes};
