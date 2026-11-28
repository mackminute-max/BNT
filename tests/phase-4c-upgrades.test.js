import test from 'node:test';import assert from 'node:assert/strict';
import {fixture} from '../scripts/e5-d/m4/fixture.mjs';
import {validateM6} from '../src/career/m6/schema.js';
import {createM6,transactM6} from '../src/career/m6/current.js';
import {makeE5Command} from '../src/career/championships/e5/contracts.js';
import {initialFactions,wallet} from '../src/career/m6/factions.js';
import {UPGRADE_TREES,UPGRADES_BY_ID,validateUpgrades} from '../src/career/m6/upgrades.js';
import {quoteEconomy4} from '../src/career/cycles/schema4.js';
import {marketGrade,reputationGrade,MARKET_GRADES} from '../src/career/m6/markets.js';
import {buildPrice,upkeepFor,facilityLevels} from '../src/career/m6/facilities.js';
import {treePanel} from '../src/management/m6-pages.js';

const f=fixture('veteran','upgrade-test');
const initial=(rep=1000)=>{const s=validateM6(createM6(f.store.state,{version:1,nationality:'N1',ancestry:'A01',sex:'female',startingNation:'N1'}));s.m6.factions=initialFactions();s.championshipFoundation.facts.reputation=rep;return validateM6(s);};
let n=0;const buy=(s,upgradeId)=>transactM6(s,makeE5Command(s,'m6.buyUpgrade',{upgradeId,confirmed:true},'up'+(n++))).state;

test('three trees, every tier after the first needs the one before',()=>{
 assert.deepEqual(Object.keys(UPGRADE_TREES),['market','staff','facilities']);
 for(const node of Object.values(UPGRADES_BY_ID))if(node.after)assert.equal(UPGRADES_BY_ID[node.after].branch,node.branch);
 let s=initial();assert.throws(()=>buy(s,'haggle-2'),/previous tier/);
 s=buy(s,'haggle-1');assert.deepEqual(s.m6.upgrades.owned,['haggle-1']);assert.throws(()=>buy(s,'haggle-1'),/Already owned/);
});

test('upgrades spend from the shared Reputation wallet and are validated',()=>{
 let s=initial(200);const before=wallet(s);s=buy(s,'haggle-1');assert.equal(wallet(s),before-60);
 assert.throws(()=>buy(s,'eye-1'),/Needs 150/);
 const bad=structuredClone(s);bad.m6.upgrades.spent=1;assert.throws(()=>validateUpgrades(bad),/spent/);
 const skip=structuredClone(s);skip.m6.upgrades.owned=['haggle-2'];skip.m6.upgrades.spent=150;assert.throws(()=>validateUpgrades(skip),/owned/);
});

test('Haggler and Agent cut the price of their own offers only',()=>{
 let s=initial();const offers=Object.values(s.management.registries.marketOffers),beast=offers.find(o=>o.category==='beast'),driver=offers.find(o=>o.category==='driver');
 const q=(st,o)=>{const c=structuredClone(st);for(const p of Object.values(c.management.registries.properties))for(const k of Object.keys(p.capacities))p.capacities[k]+=9;return Math.abs(quoteEconomy4(c,'market.acquire',{offerId:o.id,term:o.category==='driver'?'standard':null}).delta);};
 const b0=q(s,beast),d0=q(s,driver);s=buy(s,'haggle-1');
 assert.equal(q(s,beast),b0-Math.floor(beast.price*5/100));assert.equal(q(s,driver),d0);
 s=buy(s,'agent-1');assert.equal(q(s,driver),d0-Math.floor(driver.price*5/100));
 s=buy(s,'handshake');assert.equal(q(s,driver),d0-Math.floor(driver.price*5/100)-50);
});

test('Trader’s Eye opens market grades above the Reputation grade',()=>{
 let s=initial(400);const r=MARKET_GRADES.indexOf(reputationGrade(s));s=buy(s,'eye-1');
 assert.equal(MARKET_GRADES.indexOf(marketGrade(s)),Math.min(MARKET_GRADES.length-1,r+1));
});

test('Builders’ Guild cuts build prices and upkeep',()=>{
 let s=initial();const full=buildPrice(s,'barn',0);s=buy(s,'guild-1');assert.equal(buildPrice(s,'barn',0),full-Math.floor(full/10));
 s=buy(s,'lean-1');assert.equal(upkeepFor(s,{...facilityLevels(s),barn:1}),10-Math.floor(10*25/100));
 assert.match(treePanel(s,'facilities'),/Owned/);
});
