import test from 'node:test';import assert from 'node:assert/strict';
import {fixture} from '../scripts/e5-d/m4/fixture.mjs';
import {validateM6} from '../src/career/m6/schema.js';
import {createM6,transactM6} from '../src/career/m6/current.js';
import {makeE5Command} from '../src/career/championships/e5/contracts.js';
import {initialFactions,wallet} from '../src/career/m6/factions.js';
import {repPerPoint,GOLD_PER_REP} from '../src/career/m6/stable-care.js';
const f=fixture('veteran','corrective-test');
const initial=(rep=500)=>{const s=validateM6(createM6(f.store.state,{version:1,nationality:'N6',ancestry:'A02',sex:'female',startingNation:'N6'}));s.m6.factions=initialFactions();s.championshipFoundation.facts.reputation=rep;return validateM6(s);};
let n=0;const cmd=(s,type,p)=>transactM6(s,makeE5Command(s,type,{...p,confirmed:true},'cp'+(n++))).state;
test('training is paid in Reputation or Gold, Gold costing more',()=>{
 let s=initial();const id=Object.keys(s.management.registries.personnel)[0],before=s.management.registries.personnel[id].attributes.driving,w=wallet(s),g=s.career.treasury;
 s=cmd(s,'m6.train',{assetId:id,attribute:'driving',points:2,currency:'rep'});
 const rep=repPerPoint(before)+repPerPoint(before+1);
 assert.equal(s.management.registries.personnel[id].attributes.driving,before+2);assert.equal(wallet(s),w-rep);assert.equal(s.career.treasury,g);
 s=cmd(s,'m6.train',{assetId:id,attribute:'driving',points:1,currency:'gold'});
 assert.equal(s.career.treasury,g-repPerPoint(before+2)*GOLD_PER_REP);assert(GOLD_PER_REP>1);
 assert.throws(()=>cmd(initial(0),'m6.train',{assetId:id,attribute:'driving',points:1,currency:'rep'}),/Reputation/);
 validateM6(s);
});
test('owned drivers, beasts and chariots can be renamed; market stock cannot',()=>{
 let s=initial();const r=s.management.registries;
 for(const k of ['personnel','beasts','chariots']){const id=Object.keys(r[k])[0];s=cmd(s,'m6.rename',{assetId:id,name:'  Old   Faithful '});assert.equal(s.management.registries[k][id].name,'Old Faithful');}
 const offer=Object.keys(s.management.registries.marketOffers)[0];assert.throws(()=>cmd(s,'m6.rename',{assetId:offer,name:'Mine'}),/your own/);
 assert.throws(()=>cmd(s,'m6.rename',{assetId:Object.keys(s.management.registries.beasts)[0],name:'x'.repeat(41)}),/at most/);
 validateM6(s);
});
test('new careers name chariots "Model by Manufacturer"',()=>{
 const s=initial();for(const c of Object.values(s.management.registries.chariots))assert.match(c.name,/^[^ ].* by .+$/);assert.equal(s.m6.naming,3);
});
