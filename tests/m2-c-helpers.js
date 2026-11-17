import {createUninitializedCareer,transact} from '../src/career/state.js';
import {STARTING_PACKAGES} from '../src/career/packages.js';
import {CareerStore} from '../src/persistence/career-store.js';
import {migrationEffect} from '../src/career/economy/maintenance-history.js';
import {quoteEconomy} from '../src/career/economy/reducers.js';
export class Memory{value=null;writes=0;getItem(){return this.value;}setItem(k,v){this.value=v;this.writes++;}}
export function starter(packageId='traditional',careerId='career'){
 const s=createUninitializedCareer({profileId:'owner',careerId});return transact(s,{id:'initialize-'+packageId,profileId:s.profile.id,careerId:s.career.id,expectedRevision:0,expectedMaintenanceRevision:1,commandVersion:1,type:'career.initialize',effectId:'initialize-'+s.career.id,delta:STARTING_PACKAGES[packageId].gold,reason:'Approved starting package',packageId,catalogVersion:3,confirmed:true}).state;
}
export function load(state=starter()){const storage=new Memory(),store=new CareerStore(storage);store.open();store.create(state);return {store,storage};}
export function migrationRequest(s,plan,id='migrate'){
 return {id,profileId:s.profile.id,careerId:s.career.id,type:'career.migrate',maintenanceVersion:1,expectedRevision:plan.expectedRevision,expectedMaintenanceRevision:plan.expectedMaintenanceRevision,sourceSchema:2,targetSchema:3,sourceFingerprint:plan.sourceFingerprint,migrationVersion:plan.migrationVersion,adapterVersion:plan.adapterVersion,generatorVersion:plan.generatorVersion,confirmed:true,effectId:migrationEffect(s.career.id)};
}
export function migrated(packageId='traditional'){
 const {store,storage}=load(starter(packageId)),plan=store.previewEconomy(),request=migrationRequest(store.state,plan);store.migrateEconomy(request);return {store,storage,plan,request};
}
let sequence=0;
export function economicCommand(s,type,payload,id='economic-'+(++sequence)){
 const q=quoteEconomy(s,type,payload);return {id,profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:2,type,effectId:q.effectId,delta:q.delta,reason:'M2-C acceptance fixture',payload};
}
export function commit(store,type,payload,id){const command=economicCommand(store.state,type,payload,id);return {command,...store.transaction(command)};}
export function fund(store,delta=100000){const s=store.state;return store.transaction({id:'fund-'+(++sequence),profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:1,type:'developer.treasury.adjust',effectId:'dev-fund-'+sequence,delta,reason:'Explicit developer-funded acceptance fixture'});}
export function propertyId(s){return Object.keys(s.management.registries.properties)[0];}
export function buyUpgrade(store,upgradeId){return commit(store,'facility.purchase',{propertyId:propertyId(store.state),upgradeId});}
export function assemblyCommand(s,type='ru.disassemble',selection={}){
 const a=Object.values(s.management.registries.assignments)[0];return {id:'assembly-'+(++sequence),profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:1,type,effectId:`assembly-${s.career.id}-${s.revision}-${s.maintenanceRevision}`,delta:0,reason:'M2-B v1 assembly compatibility',assignmentId:a?.id??Object.values(s.economy.origin.management.registries.assignments)[0].id,...(type==='ru.assemble'?selection:{})};
}
