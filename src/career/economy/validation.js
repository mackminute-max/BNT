import {exact,id} from '../legacy-state.js';
import {validateTypedRecord,integrityStatus,BASIC_CAPACITY} from '../assets.js';
import {REGISTRY_NAMES,REGISTRY_LINKS} from '../registries.js';
import {INJURIES3,TIERS,TERMS,UPGRADES} from './catalog.js';
import {ratingKeys} from './records.js';
import {compare,add,decimal} from './arithmetic.js';
function number(n,min=0,max=100){if(!Number.isFinite(n)||n<min||n>max)throw Error('Invalid economy record number');}
function integer(n,min=0,max=Number.MAX_SAFE_INTEGER){if(!Number.isSafeInteger(n)||n<min||n>max)throw Error('Invalid economy record integer');}
const COMMON=['id','ownerCareerId','references','recordVersion','name'];
export function validateRecord3(kind,r){
 if(r.recordVersion===1){if(!['assignments','facilities'].includes(kind))throw Error('Unsupported unchanged record version');validateTypedRecord(kind,r);return;}
 const fields={personnel:['role','attributes','condition','injury','fatigue','strain','xp','available','economics','training'],beasts:['species','attributes','condition','injury','fatigue','xp','available','economics','training'],chariots:['attributes','condition','wear','integrity','status','weight','capacity','xp','available','economics','engineering'],equipment:['mass','combat','economics'],specialists:['role','injury','available','economics'],properties:['tier','capacities','packageId','catalogVersion'],facilities:['descriptiveOnly','upgradeId'],contracts:['term','cyclesRemaining','baseWage','wage','grandfathered','sourceOfferId'],marketOffers:['category','tier','ordinal','generatorVersion','algorithm','seedMaterial','quality','wageQuality','health','price','available','template']}[kind];
 if(!fields)throw Error('Registry outside M2-C scope');exact(r,[...COMMON,...fields],'schema-3 '+kind);
 if(r.recordVersion!==2||typeof r.name!=='string'||!r.name.trim()||r.name.length>100)throw Error('Invalid record version/name');
 if(['personnel','beasts','chariots','equipment','specialists'].includes(kind)){
  const e=r.economics;exact(e,['tier','quality','baseAttributes','originalHealth','acquisitionBasis','sourceOfferId','wageQuality','baseWage'],'immutable economics');
  if(!TIERS.includes(e.tier))throw Error('Invalid economic tier');number(e.quality,0.85,1.15);integer(e.acquisitionBasis);
  if(e.sourceOfferId!==null)id(e.sourceOfferId);
  if(e.originalHealth!==null)number(e.originalHealth);
  if(['personnel','specialists'].includes(kind)){number(e.wageQuality,0.9,1.1);integer(e.baseWage,1);}else if(e.wageQuality!==null||e.baseWage!==null)throw Error('Owned assets cannot have wages');
  if(['personnel','beasts','chariots'].includes(kind)){
   const keys=ratingKeys[kind];exact(r.attributes,keys,'native ratings');Object.values(r.attributes).forEach(n=>number(n));exact(e.baseAttributes,keys,'original native ratings');Object.values(e.baseAttributes).forEach(n=>number(n));
   number(r.condition);integer(r.xp);if(typeof r.available!=='boolean')throw Error('Invalid availability');
   const increments=kind==='chariots'?r.engineering.increments:r.training;exact(increments,keys,'permanent increment ledger');
   for(const k of keys){integer(increments[k],0,100);if(r.attributes[k]!==decimal(add(e.baseAttributes[k],increments[k])))throw Error('Native attributes disagree with permanent increment ledger');}
   if(kind==='chariots'){exact(r.engineering,['increments','spentGold'],'engineering ledger');integer(r.engineering.spentGold);if(Object.values(increments).reduce((a,b)=>a+b,0)>10)throw Error('Lifetime engineering cap');number(r.integrity);number(r.wear);number(r.weight,1,5000);number(r.capacity,1,10000);if(r.status!==integrityStatus(r.integrity)||r.xp!==0)throw Error('Invalid chariot management state');}
   else{number(r.fatigue);if(!INJURIES3.includes(r.injury))throw Error('Invalid schema-3 injury');if(kind==='personnel'){number(r.strain);if(r.role!=='driver')throw Error('Invalid driver role');}else if(r.species!=='generic_draft_beast')throw Error('Unsupported species');}
  }else if(e.baseAttributes!==null)throw Error('No invented ratings for equipment/specialists');
  if(kind==='equipment'&&(r.mass!==0||r.combat!==0))throw Error('Equipment effects remain neutral');
  if(kind==='specialists'&&(!['Beast Handler','Mechanic','Physician'].includes(r.role)||!INJURIES3.includes(r.injury)||typeof r.available!=='boolean'))throw Error('Invalid specialist');
 }
 if(kind==='properties'){exact(r.capacities,Object.keys(BASIC_CAPACITY),'property capacities');Object.values(r.capacities).forEach(n=>integer(n));if(r.tier!=='Basic'||r.catalogVersion!==3)throw Error('Invalid starting property');}
 if(kind==='facilities'&&(r.descriptiveOnly!==false||!Object.hasOwn(UPGRADES,r.upgradeId)))throw Error('Invalid purchased upgrade');
 if(kind==='contracts'){if(!Object.hasOwn(TERMS,r.term)||r.cyclesRemaining!==TERMS[r.term].duration||typeof r.grandfathered!=='boolean')throw Error('Invalid static M2-C contract');integer(r.baseWage,1);integer(r.wage,1);if(r.sourceOfferId!==null)id(r.sourceOfferId);}
 if(kind==='marketOffers'){if(!['driver','beast','chariot','specialist','equipment'].includes(r.category)||!TIERS.includes(r.tier)||typeof r.available!=='boolean')throw Error('Invalid market offer');integer(r.price,1);integer(r.ordinal,1);}
}
export function validateGraph3(state){
 const m=state.management,r=m.registries;exact(m,['initialized','registrySchema','registries'],'M2-C management');exact(r,REGISTRY_NAMES,'registries');
 if(m.initialized!==true||m.registrySchema!==3)throw Error('Invalid schema-3 management');const entities=new Map();
 for(const [kind,records] of Object.entries(r)){
  if(!records||typeof records!=='object'||Array.isArray(records)||Object.keys(records).length>1000)throw Error('Invalid registry');
  for(const [key,a] of Object.entries(records)){
   id(key);id(a.id);id(a.ownerCareerId);validateRecord3(kind,a);
   if(key!==a.id||a.ownerCareerId!==state.career.id||entities.has(key)||[state.career.id,state.profile.id].includes(key))throw Error('Duplicate/reserved identity or ownership');
   if(!a.references||typeof a.references!=='object'||Array.isArray(a.references)||Object.keys(a.references).some(k=>!Object.hasOwn(REGISTRY_LINKS[kind],k)))throw Error('Invalid references');entities.set(key,{kind,a});
  }
 }
 for(const {kind,a} of entities.values())for(const [relation,targets] of Object.entries(a.references)){
  if(!Array.isArray(targets)||new Set(targets).size!==targets.length||targets.length>1000||(!['equipment','facilities','subject'].includes(relation)&&targets.length>1))throw Error('Invalid reference cardinality');
  for(const target of targets)if(!entities.has(target)||!REGISTRY_LINKS[kind][relation].includes(entities.get(target).kind))throw Error('Dangling/cross-type reference');
 }
 const inverse=(from,rel,to,back)=>{for(const a of Object.values(r[from]))for(const key of a.references[rel]??[])if(!(r[to][key].references[back]??[]).includes(a.id))throw Error('Nonreciprocal '+rel);};
 inverse('chariots','equipment','equipment','installedOn');inverse('equipment','installedOn','chariots','equipment');inverse('properties','facilities','facilities','property');inverse('facilities','property','properties','facilities');
 const used=new Set();for(const a of Object.values(r.assignments)){
  const ids=[a.driverId,...a.beastIds,a.chariotId];if(a.references.subject.length!==4||new Set(ids).size!==4||ids.some(key=>!a.references.subject.includes(key))||!r.personnel[a.driverId]||a.beastIds.some(key=>!r.beasts[key])||!r.chariots[a.chariotId])throw Error('Invalid prospective RU');
  for(const key of ids){if(used.has(key))throw Error('Exclusive assignment overlap');used.add(key);if(entities.get(key).a.references.assignment?.[0]!==a.id)throw Error('Nonreciprocal assignment');}
 }
 for(const kind of ['personnel','beasts','chariots'])for(const a of Object.values(r[kind]))for(const key of a.references.assignment??[])if(!r.assignments[key].references.subject.includes(a.id))throw Error('Nonreciprocal assignment subject');
 for(const kind of ['personnel','specialists'])for(const a of Object.values(r[kind])){const key=a.references.contract?.[0];if(!key||r.contracts[key]?.references.employee?.[0]!==a.id)throw Error('Missing/nonreciprocal active contract');}
 for(const c of Object.values(r.contracts)){const key=c.references.employee?.[0];if(c.references.employee?.length!==1||entities.get(key)?.a.references.contract?.[0]!==c.id)throw Error('Nonreciprocal employment');}
 const properties=Object.values(r.properties);if(properties.length!==1||Object.values(r.facilities).filter(f=>f.descriptiveOnly===true).length!==1)throw Error('Invalid stable home');
 const property=properties[0],caps={...BASIC_CAPACITY},upgrades=new Set();
 for(const f of Object.values(r.facilities)){if(f.references.property?.[0]!==property.id)throw Error('Facility property mismatch');if(f.descriptiveOnly===false){if(upgrades.has(f.upgradeId))throw Error('Duplicate permanent upgrade');upgrades.add(f.upgradeId);const u=UPGRADES[f.upgradeId];if(u.capacity)caps[u.capacity]+=u.amount;}}
 for(const k of Object.keys(caps))if(property.capacities[k]!==caps[k])throw Error('Facility capacity discrepancy');
 for(const [kind,cap] of [['personnel','drivers'],['specialists','specialists'],['beasts','beasts'],['chariots','chariots']])if(Object.keys(r[kind]).length>caps[cap])throw Error('Capacity exceeded: '+cap);
}
