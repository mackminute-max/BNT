import {CATALOGS as C,METADATA as M,CONTENT_PIN} from './content.generated.js';
import {fingerprint} from '../cycles/contracts.js';
import {marketStream,seedInteger,integerDraw,generateMarket,offerPrice} from '../economy/market.js';
import {defaultRU,validateRU} from '../../model/ru.js';
export {CONTENT_PIN};
const all=new Map(Object.values(C).flat().map(r=>[r.id,r]));
const lookup=id=>{const r=all.get(id);if(!r)throw Error('Unknown pinned content profile '+id);return r;};
const stream=(context,domain)=>marketStream(seedInteger(JSON.stringify(['m5-generation-v1',CONTENT_PIN.digest,context,domain])));
const pick=(next,list)=>{if(!Array.isArray(list)||!list.length)throw Error('Empty generation pool');return list[integerDraw(next,0,list.length-1)];};
export function weighted(next,rows){const sorted=[...rows].sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0),weights=sorted.map(r=>Math.round(r.weight*1000));if(weights.some(n=>!Number.isSafeInteger(n)||n<0)||weights.reduce((a,b)=>a+b,0)<1)throw Error('Invalid weighted pool');let n=integerDraw(next,1,weights.reduce((a,b)=>a+b,0));for(let i=0;i<sorted.length;i++){n-=weights[i];if(n<=0)return sorted[i].id;}throw Error('Weighted generation failed');}
const sample=(next,d)=>{if(d.kind!=='uniform'||d.step!==1||!Number.isInteger(d.min)||!Number.isInteger(d.max))throw Error('Unsupported content distribution');return integerDraw(next,d.min,d.max);};
const clamp=n=>Math.min(100,Math.max(0,n));
function vector(next,base,...offsets){return Object.fromEntries(Object.entries(base).map(([key,d])=>[key,clamp(sample(next,d)+offsets.reduce((n,o)=>n+(o[key]??0),0))]));}
function varied(next,base,variation,...offsets){const offset=integerDraw(next,-variation,variation);return vector(next,base,...offsets,Object.fromEntries(Object.keys(base).map(k=>[k,offset])));}
function blended(a,b){return a.map(r=>({id:r.id,weight:r.weight*(b.find(x=>x.id===r.id)?.weight??0)}));}
const reserved=new Set(M['name-reservations'].records.map(r=>r.displayName.toLowerCase()));
export function generateIdentity(context,{category,tier='Standard',nationId=null,ancestryId=null,speciesId=null,usedNames=[],authoredName=null,nativeRole=null,qualityId=null,namingVersion=1}={}){
 const identity=stream(context,'identity'),stats=stream(context,'stats'),personality=stream(context,'personality'),names=stream(context,'names');
 const nation=nationId?C.nation.find(n=>n.canonicalNationId===nationId):pick(identity,C.nation);if(!nation)throw Error('Unknown national source');
 const imported=integerDraw(identity,0,999)<Math.round(nation.importWeight*1000),origin=imported?pick(identity,C.nation.filter(n=>n.id!==nation.id)):nation;
 const culture=lookup(weighted(identity,nation.cultureWeights));
 const grade=qualityId?lookup(qualityId):lookup(weighted(stats,C.qualityRarity.filter(q=>q.tier===tier).map(q=>({id:q.id,weight:q.weight}))));if(grade.tier!==tier)throw Error('Quality/tier mismatch');
 const out={version:1,algorithm:'m5-generation-v1',pin:CONTENT_PIN,contextFingerprint:fingerprint(context),category,residentNationId:nation.canonicalNationId,residentNationLabel:nation.label,originNationId:origin.canonicalNationId,originNationLabel:origin.label,cultureProfileId:culture.id,qualityProfileId:grade.id,qualityLabel:grade.label,valuation:structuredClone(grade.valuation),name:null,attributes:null,personality:null};
 if(category==='driver'){
  const ancestry=ancestryId?C.ancestryGameplay.find(a=>a.canonicalAncestryId===ancestryId):lookup(weighted(identity,origin.ancestryWeights));if(!ancestry)throw Error('Unknown ancestry');
  const background=lookup(weighted(stats,blended(ancestry.backgroundWeights,nation.backgroundWeights))),experience=(()=>{const key=weighted(stats,background.experienceLevels);return background.experienceLevels.find(e=>e.id===key);})();
  if(out.originNationId==='N8'&&ancestry.canonicalAncestryId!=='A08')out.originNationId=pick(identity,C.nation.filter(n=>n.canonicalNationId!=='N8')).canonicalNationId;out.ancestryId=ancestry.canonicalAncestryId;out.ancestryLabel=ancestry.label;out.originNationLabel=C.nation.find(n=>n.canonicalNationId===out.originNationId).label;out.backgroundId=background.id;out.backgroundLabel=background.label;out.experienceId=experience.id;
  out.attributes=varied(stats,ancestry.baseline,ancestry.individualVariation,ancestry.ancestryDelta,ancestry.experienceDelta,background.attributeDelta,experience.attributeDelta,grade.driverDelta);
  const ai=lookup(weighted(personality,blended(background.aiProfileWeights,nation.aiWeights)));out.aiProfileId=ai.id;out.aiLabel=ai.label;out.personality=varied(personality,ai.traits,ai.individualVariation);
 }else if(category==='beast'){
  const species=speciesId?C.beastSpecies.find(s=>s.canonicalSpeciesId===speciesId):lookup(weighted(identity,origin.speciesWeights));if(!species)throw Error('Unknown canonical species');
  const stock=lookup(weighted(stats,species.stockProfileIds.map(id=>({id,weight:origin.stockWeights.find(r=>r.id===id)?.weight??1})))),temperament=lookup(weighted(stats,stock.temperamentWeights));
  out.speciesId=species.canonicalSpeciesId;out.speciesLabel=species.label;out.stockLabel=stock.label;out.stockProfileId=stock.id;out.temperamentId=temperament.id;out.attributes=varied(stats,species.baseline,species.individualVariation,stock.statDelta,temperament.attributeDelta,grade.beastDelta);
 }else if(!['chariot','equipment','specialist','organization'].includes(category))throw Error('Unsupported native generation category');
 if(category==='specialist'){if(!['Beast Handler','Mechanic','Physician'].includes(nativeRole))throw Error('Unknown functional profession');out.nativeRole=nativeRole;const profession=C.staffProfession.find(p=>p.nativeRole===nativeRole&&nation.staffWeights.some(w=>w.id===p.id));if(!profession)throw Error('Missing national profession binding');out.staffProfileId=profession.id;out.expertiseProfileId='expertise.practiced';out.qualityLabel=nativeRole;}
 const occupied=new Set(usedNames.map(n=>n.toLowerCase()));
 for(let retry=0;retry<64;retry++){
  let name;
  if(authoredName)name=authoredName;
  else if(['driver','specialist'].includes(category))name=pick(names,culture.given)+' '+pick(names,culture.family);
  else if(category==='beast')name=pick(names,culture.beastNames);
  else if(category==='organization')name=pick(names,culture.organizationRoots)+' '+pick(names,culture.organizationEndings);
  else{const naming=lookup(category==='chariot'?'chariot.'+nation.canonicalNationId.toLowerCase():nation.equipmentPreferences[0]);name=pick(names,naming.manufacturers)+' '+pick(names,naming.modelNames);}
  if(namingVersion===2&&!authoredName&&['beast','organization','chariot','equipment'].includes(category))name+=' of '+pick(names,culture.family);
  if(name.length<=100&&!occupied.has(name.toLowerCase())&&(authoredName||!reserved.has(name.toLowerCase()))){out.name=name;return out;}
  if(authoredName)break;
 }
 throw Error('Generation name capacity exhausted; no generic fallback or epoch consumed');
}
export function homeBatch(careerId,epoch,{recruiters=false,existingNames=[]}={}){
 if(!Number.isSafeInteger(epoch)||epoch<0)throw Error('Invalid Home epoch');
 const native=Object.values(generateMarket('m5-market-'+fingerprint([careerId,epoch]).slice(0,32))),offers={},identities={},used=[...existingNames];
 if(recruiters){const p=structuredClone(native.find(o=>o.category==='driver'&&o.tier==='Premium'));p.id+='-recruiters';p.ordinal+=100;native.push(p);}
 for(const source of native){const offer=structuredClone(source),key='m5-offer-'+fingerprint([careerId,epoch,source.id]).slice(0,40),authored=epoch===0?M['authored-identity-preservation'].records.find(r=>r.sourceOfferId===source.id):null;
 const identity=generateIdentity([careerId,'Home',epoch,source.id],{category:offer.category,tier:offer.tier,usedNames:used,authoredName:authored?.source_name??null,nationId:authored?.presentation_identity?.national_origin??null,ancestryId:authored?.presentation_identity?.ancestry_id??null,speciesId:authored?.presentation_identity?.species_id??null,nativeRole:offer.template.role});
 if(authored)identity.authored=structuredClone(authored.presentation_identity);used.push(identity.name);offer.id=key;offer.ownerCareerId=careerId;offer.name=identity.name;offer.seedMaterial=JSON.stringify(['m5-home-v1',CONTENT_PIN.digest,careerId,epoch,source.id]);offer.algorithm='m5-generation-v1';offer.generatorVersion='m5-home-v1';
 if(['driver','beast'].includes(offer.category)){offer.template.attributes=identity.attributes;offer.quality=identity.valuation.quality;offer.wageQuality=offer.category==='driver'?identity.valuation.wageQuality:null;}
 // Chariots/equipment/staff retain native template values and actual role prices.
 offer.price=offerPrice(offer.category,offer.tier,offer.quality,offer.health);offers[key]=offer;identities[key]={...identity,sourceOfferId:source.id,offerEpoch:epoch};
 }
 return {version:1,epoch,pin:CONTENT_PIN,offers,identities};
}
export function rivalPopulation(careerId,tier,{count=4}={}){
 const binding=M['championship-difficulty-bindings'].records.find(r=>r.templateId===tier);if(!binding||!Number.isSafeInteger(count)||count<1||count>128)throw Error('Invalid rival population context');
 const used=[],organizations=[];
 for(let i=0;i<count;i++){
  const context=[careerId,'persistent-rival',tier,i],select=stream(context,'tier-quality'),quality=lookup(weighted(select,binding.qualityWeights)),org=generateIdentity(context,{category:'organization',tier:quality.tier,usedNames:used});used.push(org.name);
  const driver=generateIdentity([...context,'driver'],{category:'driver',tier:quality.tier,nationId:org.residentNationId,usedNames:used});used.push(driver.name);
  const beasts=[0,1].map(j=>{const b=generateIdentity([...context,'beast',j],{category:'beast',tier:quality.tier,nationId:org.residentNationId,usedNames:used});used.push(b.name);return b;});
  const chariot=generateIdentity([...context,'chariot'],{category:'chariot',tier:quality.tier,nationId:org.residentNationId,usedNames:used});used.push(chariot.name);
  const id='m5-rival-'+fingerprint(context).slice(0,32),native=defaultRU(id,quality.tier==='Budget'?42:quality.tier==='Standard'?55:70);
  Object.assign(native.driver,driver.attributes,{personality:driver.personality});beasts.forEach((b,j)=>Object.assign(native.beasts[j],b.attributes));validateRU(native);
  const recipe=C.rivalGeneration.find(r=>lookup(r.identityProfileId).canonicalNationId===org.residentNationId&&binding.rivalProfileIds.includes(r.id));if(!recipe)throw Error('Missing fixed rival recipe');organizations.push({version:1,id,tier,generationProfileId:recipe.id,organization:org,driver,beasts,chariot,native,memberIds:{driver:id+'-d',beasts:[id+'-b1',id+'-b2'],chariot:id+'-c'}});
 }
 return {version:1,tier,pin:CONTENT_PIN,organizations};
}
export function freezeRival(profile,entrantId){const native=structuredClone(profile.native);native.id=entrantId;validateRU(native);return {id:entrantId,player:false,native,assetIds:null,organizationId:profile.id,memberIds:structuredClone(profile.memberIds)};}
