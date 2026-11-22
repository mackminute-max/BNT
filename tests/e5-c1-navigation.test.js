import test from 'node:test';
import assert from 'node:assert/strict';
import {continuationNavigation} from '../src/management/playable.js';
const instance=(phase='INTERMISSION_READY',status='ACTIVE')=>{const x={id:'run',phase};return {active:x,state:{championshipFoundation:{activeId:x.id,instances:{[x.id]:x}},e5:{instances:{[x.id]:{status,runOffers:[],runSelections:[]}}}}};};
test('E5-C.1 continuation is available throughout authoritative active/reward/settlement/recovery phases',()=>{
 for(const [phase,status] of [['INTERMISSION_READY','ACTIVE'],['RACE_ACTIVE','ACTIVE'],['SETTLEMENT_PENDING','ACTIVE'],['SETTLEMENT_PENDING','LEGACY_SELECTION_PENDING'],['RECOVERY_REQUIRED','ACTIVE']]){const v=instance(phase,status),n=continuationNavigation(v);assert.equal(n.visible,true);assert.equal(n.disabled,false);assert.equal(n.page,'championships');assert.equal(continuationNavigation(v,true).disabled,true);}
 const v=instance();v.state.e5.instances.run.runOffers=[{id:'offer'}];assert.match(continuationNavigation(v).label,/Run Reward/);
 assert.match(continuationNavigation(instance(),false,{reason:'Corrupt session'}).label,/recovery/);
});
test('E5-C.1 fresh and archived careers hide/disable continuation; unresolved durable recovery remains reachable',()=>{
 for(const v of [{active:null,state:null},{active:null,state:{championshipFoundation:{activeId:null,instances:{archived:{}}}}}]){assert.deepEqual(continuationNavigation(v),{visible:false,disabled:true,page:'championships',label:'No championship to continue'});}
 const recovery=continuationNavigation({active:null,state:null},false,{hasAuthority:true,reason:'Career needs recovery'});assert.equal(recovery.visible,true);assert.equal(recovery.disabled,false);assert.equal(recovery.page,'saves');
});
