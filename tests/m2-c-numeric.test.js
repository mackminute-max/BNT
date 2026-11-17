import {test} from 'node:test';import assert from 'node:assert/strict';
import {canonical} from '../src/core/determinism.js';
import {generateMarket,offerPrice,seedInteger,marketStream,integerDraw} from '../src/career/economy/market.js';
import {rounded,rational,mul} from '../src/career/economy/arithmetic.js';
import {tierFromRatings,valuationHealth} from '../src/career/economy/records.js';
import {incrementCost,resaleValue,quoteEconomy,executeEconomy} from '../src/career/economy/reducers.js';
import {validateRecord3} from '../src/career/economy/validation.js';
import {validateState} from '../src/career/state.js';
import {migrated,commit,fund,buyUpgrade} from './m2-c-helpers.js';
const TEST_NUMERIC_STATE=()=>{const {store}=migrated();fund(store);return structuredClone(store.state);};
function executeSynthetic(s,type,payload){const q=quoteEconomy(s,type,payload);return executeEconomy(s,{type,payload,delta:q.delta,effectId:q.effectId});}
test('M2-C exact price fixtures: native H, neutral specialist/equipment and positive decimal ties',()=>{
 assert.equal(offerPrice('driver','Budget',1,100),200);assert.equal(offerPrice('beast','Standard',1,50),275);assert.equal(offerPrice('chariot','Standard',1,80),590);assert.equal(offerPrice('specialist','Standard',1,0),375);assert.equal(offerPrice('equipment','Standard',1,0),275);
 assert.equal(rounded(rational(102.5),'half-up',5),105);assert.equal(rounded(rational(102.49),'half-up',5),100);assert.equal(rounded(mul(25.5,1)),26);assert.equal(rounded(rational(49.5),'ceil'),50);assert.equal(rounded(rational(293.75),'floor'),293);
 for(const value of [NaN,Infinity,-1,101,undefined])assert.throws(()=>offerPrice('beast','Budget',1,value));
});
test('M2-C corrected R2.1 starter fixture: mean 50 is Standard, basis 325 and current-H resale 138',()=>{
 const {store}=migrated(),b=structuredClone(Object.values(store.state.management.registries.beasts)[0]);assert.equal(tierFromRatings(b.economics.baseAttributes),'Standard');assert.equal(b.economics.quality,1);assert.equal(b.economics.acquisitionBasis,325);b.condition=50;assert.equal(resaleValue('beast',b),138);
});
test('M2-C valuation-health-v1 keeps integrity/condition/wear and fatigue separate',()=>{
 const {store}=migrated(),r=structuredClone(store.state.management.registries),c=Object.values(r.chariots)[0],b=Object.values(r.beasts)[0],d=Object.values(r.personnel)[0];
 c.integrity=80;c.condition=10;c.wear=90;assert.equal(valuationHealth('chariot',c),80);assert.equal(resaleValue('chariot',c),293);b.condition=50;b.fatigue=100;assert.equal(valuationHealth('beast',b),50);d.condition=70;d.strain=100;d.fatigue=100;assert.equal(valuationHealth('driver',d),70);assert.throws(()=>valuationHealth('chariot',{condition:100}));
 c.attributes.rollingEfficiency+=5;c.engineering.increments.rollingEfficiency+=5;c.engineering.spentGold=375;assert.equal(resaleValue('chariot',c),293);
});
test('M2-C fractional training and engineering cost bands use each pre-increment native rating',()=>{
 assert.equal(incrementCost(59,2),30);assert.equal(incrementCost(59.5,1),10);assert.equal(incrementCost(60.5,1),20);assert.equal(incrementCost(59.5,2,{discount:true}),27);assert.equal(incrementCost(74.5,2),55);assert.equal(incrementCost(74.5,2,{discount:true}),50);
 assert.equal(incrementCost(59,2,{engineering:true}),200);assert.equal(incrementCost(89.5,2,{engineering:true}),550);assert.equal(incrementCost(99,1,{engineering:true}),350);assert.throws(()=>incrementCost(99.5,1));assert.throws(()=>incrementCost(50,6));assert.throws(()=>incrementCost(NaN,1));
});
test('M2-C fixed market counts, templates, roles and neutral item records across deterministic careers',()=>{
 for(const careerId of ['career','A','career_42','a'.repeat(64)]){
  const market=generateMarket(careerId),offers=Object.values(market);assert.equal(offers.length,23);assert.equal(canonical(market),canonical(generateMarket(careerId)));const counts={Budget:0,Standard:0,Premium:0};for(const o of offers)counts[o.tier]++;assert.deepEqual(counts,{Budget:9,Standard:10,Premium:4});
  assert.deepEqual(offers.filter(o=>o.category==='specialist').map(o=>o.template.role),['Beast Handler','Mechanic','Physician']);
  for(const o of offers){assert.ok(o.quality>=0.85&&o.quality<=1.15);assert.equal(o.price%5,0);if(o.category==='equipment'){assert.equal(o.template.mass,0);assert.equal(o.template.combat,0);assert.notEqual(o.tier,'Premium');}if(o.template.attributes){const [lo,hi]={Budget:[30,49],Standard:[50,69],Premium:[70,89]}[o.tier];for(const n of Object.values(o.template.attributes))assert.ok(Number.isInteger(n)&&n>=lo&&n<=hi);assert.ok(o.template.condition>=70&&o.template.condition<=100);}if(o.category==='chariot'){assert.equal(o.template.weight,180);assert.equal(o.template.capacity,400);assert.equal(o.template.wear,0);}}
 }
 assert.notEqual(canonical(generateMarket('career')),canonical(generateMarket('different-career')));
});
test('M2-C generator rejection sampling handles inclusive edges without modulo bias',()=>{
 const draws=[0xffffffff,0,30],next=()=>draws.shift();assert.equal(integerDraw(next,70,100),70);assert.equal(integerDraw(next,70,100),100);assert.equal(seedInteger(''),2166136261);const a=marketStream(0),b=marketStream(0);for(let i=0;i<20;i++)assert.equal(a(),b());
});
// Synthetic reducer fixtures do not inject injuries, XP or wear into saved careers.
test('M2-C synthetic service fixtures: fixed partial recovery, injury treatment, repair and native-field separation',()=>{
 const s=TEST_NUMERIC_STATE(),r=s.management.registries,d=Object.values(r.personnel)[0],b=Object.values(r.beasts)[0],c=Object.values(r.chariots)[0];
 d.fatigue=90;d.strain=80;let result=executeSynthetic(s,'service.apply',{assetId:d.id,service:'driver-recovery',amount:null});assert.equal(result.cost,40);assert.equal(d.fatigue,65);assert.equal(d.strain,80);d.fatigue=10;executeSynthetic(s,'service.apply',{assetId:d.id,service:'driver-recovery',amount:null});assert.equal(d.fatigue,0);assert.throws(()=>executeSynthetic(s,'service.apply',{assetId:d.id,service:'driver-recovery',amount:null}),/no effect/);
 b.fatigue=10;assert.equal(executeSynthetic(s,'service.apply',{assetId:b.id,service:'beast-care',amount:null}).cost,30);assert.equal(b.fatigue,0);
 d.injury='Major';const dc=d.condition;assert.equal(executeSynthetic(s,'service.apply',{assetId:d.id,service:'driver-treatment',amount:null}).cost,100);assert.equal(d.injury,'Minor');assert.equal(d.condition,dc);
 c.integrity=95;c.status='Functional';c.condition=72;c.wear=10;assert.equal(executeSynthetic(s,'service.apply',{assetId:c.id,service:'chariot-repair',amount:5}).cost,8);assert.equal(c.integrity,100);assert.equal(c.condition,72);assert.equal(c.wear,10);assert.equal(executeSynthetic(s,'service.apply',{assetId:c.id,service:'chariot-refurbishment',amount:null}).cost,100);assert.equal(c.wear,0);assert.equal(c.condition,72);assert.throws(()=>executeSynthetic(s,'service.apply',{assetId:c.id,service:'chariot-refurbishment',amount:null}),/no effect/);
 assert.throws(()=>validateState(s));
});
test('M2-C synthetic funded XP reducer: fractional progression, exact discount and no saved XP grant',()=>{
 const s=TEST_NUMERIC_STATE(),d=Object.values(s.management.registries.personnel)[0];d.economics.baseAttributes.driving=59.5;d.attributes.driving=59.5;d.xp=100;
 const result=executeSynthetic(s,'training.apply',{assetId:d.id,attribute:'driving',points:2});assert.equal(result.details.xpCost,30);assert.equal(d.xp,70);assert.equal(d.attributes.driving,61.5);assert.equal(d.training.driving,2);validateRecord3('personnel',d);assert.throws(()=>validateState(s));
});
test('M2-C synthetic discounted service fixtures require active qualified specialist and purchased facility',()=>{
 const {store}=migrated();fund(store);buyUpgrade(store,'staff-quarters');buyUpgrade(store,'treatment-ward');buyUpgrade(store,'workshop');
 for(const role of ['Mechanic','Physician']){const o=Object.values(store.state.management.registries.marketOffers).find(o=>o.template.role===role);commit(store,'market.acquire',{offerId:o.id,term:'standard'});}
 const s=structuredClone(store.state),r=s.management.registries,d=Object.values(r.personnel)[0],b=Object.values(r.beasts)[0],c=Object.values(r.chariots)[0];d.injury='Major';assert.equal(executeSynthetic(s,'service.apply',{assetId:d.id,service:'driver-treatment',amount:null}).cost,75);b.injury='Critical';assert.equal(executeSynthetic(s,'service.apply',{assetId:b.id,service:'beast-treatment',amount:null}).cost,72);assert.equal(b.injury,'Major');
 c.integrity=95;c.status='Functional';assert.equal(executeSynthetic(s,'service.apply',{assetId:c.id,service:'chariot-repair',amount:5}).cost,6);c.integrity=80;c.status='Functional';assert.equal(executeSynthetic(s,'service.apply',{assetId:c.id,service:'chariot-repair',amount:20}).cost,23);c.wear=10;assert.equal(executeSynthetic(s,'service.apply',{assetId:c.id,service:'chariot-refurbishment',amount:null}).cost,75);
});

import {readFileSync} from 'node:fs';
const GOLDEN=JSON.parse(readFileSync(new URL('./data/m2-c-market-v1.json',import.meta.url),'utf8'));
for(const vector of GOLDEN.vectors)test('M2-C independent golden market vector '+vector.careerId,()=>{
 assert.equal(seedInteger(vector.seedMaterial),vector.seed);const next=marketStream(vector.seed);assert.deepEqual(Array.from({length:8},()=>next()),vector.firstWords);assert.deepEqual(generateMarket(vector.careerId),vector.offers);
});

test('M2-C exact decimal helpers handle high precision and subnormal finite native inputs',()=>{
 for(const rating of [0.1,59.12345678912345,1e-320]){const s=TEST_NUMERIC_STATE(),d=Object.values(s.management.registries.personnel)[0];d.economics.baseAttributes.driving=rating;d.attributes.driving=rating;d.xp=1000;executeSynthetic(s,'training.apply',{assetId:d.id,attribute:'driving',points:2});validateRecord3('personnel',d);assert.ok(Number.isFinite(d.attributes.driving));}
});

test('M2-C synthetic contract fixtures: short/standard/long wages, signing terms and termination fees',()=>{
 const s=TEST_NUMERIC_STATE(),r=s.management.registries,d=Object.values(r.personnel)[0];d.references.assignment=[];d.economics.baseWage=20;r.contracts={};
 for(const [term,wage,surcharge,fee] of [['short',25,0,20],['standard',20,50,40],['long',17,125,60]]){
  r.contracts={};d.references.contract=[];const key=addContract(r,d,term);assert.equal(r.contracts[key].wage,wage);assert.equal(TERMS[term].surcharge,surcharge);assert.equal(quoteEconomy(s,'personnel.terminate',{personId:d.id}).cost,fee);
 }
});
import {addContract} from '../src/career/economy/records.js';import {TERMS} from '../src/career/economy/catalog.js';
test('M2-C synthetic Beast Handler discount: care rounds 25.5 to 26; treatment plus ward is 60',()=>{
 const {store}=migrated();fund(store);buyUpgrade(store,'staff-quarters');buyUpgrade(store,'treatment-ward');const offer=Object.values(store.state.management.registries.marketOffers).find(o=>o.template.role==='Beast Handler');commit(store,'market.acquire',{offerId:offer.id,term:'short'});
 const s=structuredClone(store.state),b=Object.values(s.management.registries.beasts)[0];b.fatigue=10;assert.equal(executeSynthetic(s,'service.apply',{assetId:b.id,service:'beast-care',amount:null}).cost,26);b.injury='Minor';assert.equal(executeSynthetic(s,'service.apply',{assetId:b.id,service:'beast-treatment',amount:null}).cost,60);
 const specialist=Object.values(s.management.registries.specialists)[0];s.management.registries.contracts[specialist.references.contract[0]].cyclesRemaining=0;b.fatigue=10;assert.equal(quoteEconomy(s,'service.apply',{assetId:b.id,service:'beast-care',amount:null}).cost,30);
});
test('M2-C synthetic Training Grounds applies one final XP ceiling after summing increments',()=>{
 const {store}=migrated();fund(store);buyUpgrade(store,'training-grounds');const s=structuredClone(store.state),b=Object.values(s.management.registries.beasts)[0];b.economics.baseAttributes.speed=74.5;b.attributes.speed=74.5;b.xp=100;
 const result=executeSynthetic(s,'training.apply',{assetId:b.id,attribute:'speed',points:2});assert.equal(result.details.xpCost,50);assert.deepEqual(result.details.increments.map(i=>i.cost),[20,35]);assert.equal(b.xp,50);assert.equal(b.attributes.speed,76.5);
});
