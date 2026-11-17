import {migrated,Memory} from './m2-c-helpers.js';
import {buildCycleBase} from '../src/career/cycles/schema4.js';
import {RULES,fingerprint,cycleMigrationEffect,protectCycleMigration} from '../src/career/cycles/contracts.js';
import {mergeProtected} from '../src/career/economy/protected-registry.js';
import {CareerStore} from '../src/persistence/career-store.js';
import {quoteCycle,sourceFingerprint} from '../src/career/cycles/reducers.js';
import {contractSnapshot,createCompletionBoundary} from '../src/career/cycles/completion.js';
let sequence=0;
export function request4(s,id='migrate-cycles'){return {id,profileId:s.profile.id,careerId:s.career.id,type:'career.cycles.migrate',maintenanceVersion:1,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,sourceSchema:3,targetSchema:4,sourceFingerprint:fingerprint(s),rulesVersion:RULES,effectId:cycleMigrationEffect(s.career.id),confirmed:true};}
export function pure4(packageId='traditional'){const origin=migrated(packageId).store.state,request=request4(origin),s=buildCycleBase(origin,request);s.history.commands=mergeProtected(s.history.commands,[protectCycleMigration(request,s.cycles.manifestDigest)]);return s;}
export function store4(packageId='traditional'){const storage=new Memory(),store=new CareerStore(storage);store.open();store.create(pure4(packageId));return {store,storage};}
export function command4(s,type,payload,id='cycle-tx-'+(++sequence)){const q=quoteCycle(s,type,payload);return {id,profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:3,type,effectId:q.effectId,delta:q.delta,reason:'Synthetic M2-D acceptance fixture',payload};}
// Test-only immutable authority registry, never imported by application code.
const authorized=new Map(),boundary=createCompletionBoundary(c=>authorized.get(c.championshipId)===fingerprint(c));
export function completion4(s,{income=0,outcome='Completed',id='synthetic-championship-'+(++sequence)}={}){const record={kind:'BNT-championship-completion',version:1,profileId:s.profile.id,careerId:s.career.id,championshipId:id,outcome,completedOnce:true,state:'CHAMPIONSHIP_COMPLETED',roster:contractSnapshot(s),rulesVersion:RULES,resultVersion:1,rewards:income?[{id:'synthetic-authorized-income',amount:income}]:[],authority:'test-only-controller',sourceFingerprint:null};record.sourceFingerprint=fingerprint(record);authorized.set(id,fingerprint(record));return boundary.accept(record);}
export function settle4(store,opts={}){const completion=completion4(store.state,opts),tx=command4(store.state,'cycle.settle',{completion,sourceFingerprint:sourceFingerprint(store.state)});return {tx,completion,...store.transaction(tx,{completion})};}
