import {id} from '../legacy-state.js';
import {driverAttributes,beastAttributes,chariotAttributes} from '../../model/ru.js';
import {COUNTS,PRICES,TIERS} from './catalog.js';
import {rounded,mul,conditionFactor} from './arithmetic.js';
import {GENERATOR_VERSION} from './maintenance-history.js';
export const MARKET_ALGORITHM='fnv1a32-utf8-mulberry32-rejection-v1';
export function seedInteger(text){let h=2166136261;for(const byte of new TextEncoder().encode(text)){h^=byte;h=Math.imul(h,16777619);}return h>>>0;}
export function marketStream(seed){let state=seed>>>0;return ()=>{state=(state+0x6d2b79f5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return (t^(t>>>14))>>>0;};}
export function integerDraw(next,lo,hi){const size=hi-lo+1,limit=Math.floor(0x100000000/size)*size;let x;do{x=next();}while(x>=limit);return lo+x%size;}
export function offerPrice(category,tier,quality,health=null){
 if(!Object.hasOwn(PRICES,category)||!Object.hasOwn(PRICES[category],tier)||!Number.isFinite(quality)||quality<0.85||quality>1.15)throw Error('Invalid offer price inputs');
 const neutral=['specialist','equipment'].includes(category);
 if(!neutral&&(!Number.isFinite(health)||health<0||health>100))throw Error('Invalid valuation health');
 return rounded(mul(mul(PRICES[category][tier],quality),neutral?1:conditionFactor(health)),'half-up',5);
}
export function generateMarket(careerId){
 id(careerId);const seedMaterial='BNT|M2-C|'+GENERATOR_VERSION+'|'+careerId,next=marketStream(seedInteger(seedMaterial));
 const offers={};
 for(const [category,counts] of Object.entries(COUNTS))for(const [index,count] of counts.entries())for(let ordinal=1;ordinal<=count;ordinal++){
  const tier=TIERS[index],key=`m2c-offer-${category}-${tier.toLowerCase()}-${ordinal}`,draw=(a,b)=>integerDraw(next,a,b);
  let template;
  if(['driver','beast','chariot'].includes(category)){
   const keys={driver:driverAttributes,beast:beastAttributes,chariot:chariotAttributes}[category],ranges=[[30,49],[50,69],[70,89]];
   template={attributes:Object.fromEntries(keys.map(k=>[k,draw(...ranges[index])])),condition:draw(70,100)};
   if(category==='driver')Object.assign(template,{strain:0,fatigue:0,injury:'Healthy',xp:0});
   if(category==='beast')Object.assign(template,{species:'generic_draft_beast',fatigue:0,injury:'Healthy',xp:0});
   if(category==='chariot')Object.assign(template,{integrity:draw(70,100),wear:0,weight:180,capacity:400,xp:0});
  }else if(category==='specialist')template={role:['Beast Handler','Mechanic','Physician'][index],injury:'Healthy'};
  else template={mass:0,combat:0};
  // Draw schedule v1: ratings, condition, chariot integrity; Q; personnel wage quality.
  const quality=draw(85,115)/100,wageQuality=['driver','specialist'].includes(category)?draw(90,110)/100:null;
  const health=category==='chariot'?template.integrity:['driver','beast'].includes(category)?template.condition:null;
  const price=offerPrice(category,tier,quality,health);
  offers[key]={id:key,ownerCareerId:careerId,references:{},recordVersion:2,name:category==='equipment'?`${tier==='Budget'?'Basic':'Standard'} equipment ${ordinal}`:`${tier} ${category} ${ordinal}`,category,tier,ordinal,generatorVersion:GENERATOR_VERSION,algorithm:MARKET_ALGORITHM,seedMaterial,quality,wageQuality,health,price,available:true,template};
 }
 return offers;
}
