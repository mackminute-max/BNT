import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {fixture} from '../e5-d/m4/fixture.mjs';
import {M5CareerStore} from '../../src/persistence/m5-store.js';
import {CareerStore} from '../../src/persistence/career-store.js';
import {ChampionshipRunner} from '../../src/career/championships/orchestrator.js';
import {makeE5Command} from '../../src/career/championships/e5/contracts.js';
import {makeControllerCommand} from '../../src/career/championships/controller.js';
import {quoteEconomy4} from '../../src/career/cycles/schema4.js';
import {createSettlementCapability} from '../../src/career/championships/e5/capabilities.js';
const f=fixture('veteran','m5-early'),map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)},store=new M5CareerStore(storage);
store.createCurrent(f.store.state,f.store.presentation,{d2:true});
const runner=new ChampionshipRunner(store,storage),command=(type,payload,id=type.replaceAll('.','-')+'-'+store.current.revision)=>store.transaction(makeE5Command(store.state,type,payload,id),type==='e5.settle'?{settlement:createSettlementCapability(store,storage)}:{});
const a=Object.values(store.current.management.registries.assignments)[0],generated=store.current.e5.board.find(d=>d.d2?.economicContextId==='dustroad');command('e5.register',{templateId:generated.id,instanceId:'m5-native-proof',selection:{assignmentId:a.id,driverId:a.driverId,beastIds:a.beastIds,chariotId:a.chariotId}});
const instanceId=store.current.championshipFoundation.activeId;const races=[];let seq=0;
for(let i=0;i<2;i++){
 store.transaction(makeControllerCommand(store.state,'championship.start',{instanceId},'start-'+i));
 let session=runner.ensure();
 while(['Ready','Running'].includes(session.state.status)&&session.state.tick<30000)session=runner.advance('advance-'+(++seq),100);
 const outcome=runner.publish('publish-'+i);assert(!outcome.blocked,outcome.reason);
 const x=store.current.championshipFoundation.instances[instanceId];races.push({ticks:session.state.tick,result:x.raceResults.at(-1).resultId,phase:x.phase});
 const m=store.current.e5.instances[x.id],offer=m.runOffers.find(o=>!m.runSelections.some(r=>r.offerId===o.id));
 if(offer){const d=offer.choices[0];command('e5.selectRun',{offerId:offer.id,rewardId:d.id,quoteFingerprint:d.quoteFingerprint,confirmed:true});
 const region=store.current.m5.d2.regional;assert(region);const before=structuredClone(store.current),frozen=structuredClone(store.current.championshipFoundation.instances[instanceId].lockedSelection),item=Object.values(region.offers).find(o=>o.category==='beast'),payload={offerId:item.id,term:null},q=quoteEconomy4(store.state,'market.acquire',payload);assert(q.canAfford);const tx={id:'regional-acquire',profileId:before.profile.id,careerId:before.career.id,expectedRevision:before.revision,expectedMaintenanceRevision:before.maintenanceRevision,commandVersion:2,type:'market.acquire',payload,delta:q.delta,effectId:q.effectId,reason:'Regional native purchase'};store.transaction(tx);assert.equal(store.current.career.treasury,before.career.treasury-q.cost);assert.deepEqual(store.current.championshipFoundation.instances[instanceId].lockedSelection,frozen);assert(store.current.m5.d2.regional.consumed.includes(item.id));const after=store.current.career.treasury;store.transaction(tx);assert.equal(store.current.career.treasury,after);const reload=new CareerStore(storage);reload.open();assert.equal(reload.mode,'automatic',reload.problem);
 }
}
command('e5.settle',{instanceId,confirmed:true});
const terminal=Object.values(store.current.e5.terminalRegistry)[0];
if(terminal.legacyOffer){command('e5.selectLegacy',{offerId:terminal.legacyOffer.id,rewardId:terminal.legacyOffer.choices[0].id,confirmed:true});}
assert.equal(store.current.championshipFoundation.activeId,null);
const cold=new CareerStore(storage);cold.open();assert.equal(cold.mode,'automatic',cold.problem);assert.deepEqual(cold.current,store.current);
const result={stage:'early-native-loop',races,archived:store.current.e5.archives.length,revision:store.current.revision,coldReload:true,logicalRecords:map.size,affinity:store.current.m5.d2.pin.compatibility,generatedTemplate:generated.id,opportunityEpoch:store.current.m5.d2.opportunityEpoch,homeEpoch:store.current.m5.marketEpoch,bytes:[...map.values()].reduce((n,v)=>n+Buffer.byteLength(v),0)};
await writeFile('/workspace/deliverables/bnt-m5-d2/evidence/regional-proof.json',JSON.stringify(result,null,2));console.log(result);
