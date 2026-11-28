import test from 'node:test';import assert from 'node:assert/strict';
import {BOONS,CAPS,RARITY,LEVEL,boonAmount,boonSeconds} from '../src/sim/endowments.js';
import {DEATH_ODDS} from '../src/career/p3/stakes.js';
// Playtest 4b (Mack 2026-11-27): every Boon upgrade must add something, and no
// single Boon may pass its stat's ceiling.
test('every Boon level and rarity upgrade improves strength or duration, never past the ceiling',()=>{
 for(const def of Object.values(BOONS)){if(def.effect.kind==='charge')continue;
  for(const rarity of Object.keys(RARITY)){let prev=null;for(let level=1;level<=LEVEL.length;level++){
   const a=boonAmount(def,level,rarity),sec=boonSeconds(def,level,rarity);
   if(def.effect.kind==='buff')assert.ok(a<=CAPS[def.effect.stat]+1e-9,`${def.id} ${rarity} ${level} passes the ceiling`);
   if(prev){assert.ok(a>prev.a+1e-6||sec>prev.sec,`${def.id} ${rarity} level ${level} adds nothing`);}
   prev={a,sec};}}}
});
test('Combat death odds are 15%',()=>assert.equal(DEATH_ODDS.Combat,15));
