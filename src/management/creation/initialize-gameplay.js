import {migrationEffect} from '../../career/economy/maintenance-history.js';
import {cycleMigrationEffect,RULES,fingerprint} from '../../career/cycles/contracts.js';
import {foundationEffect} from '../../career/championships/contracts.js';
import {makeControllerCommand} from '../../career/championships/controller.js';
import {makeE5Command} from '../../career/championships/e5/contracts.js';
// Only creation-v3 invokes this on its isolated, unpublished candidate.
// Historical careers retain their explicit existing upgrade workflows.
export function initializeGameplay(store,id){
 let s=store.state;
 if(s.schema===2){const p=store.previewEconomy();store.migrateEconomy({id:id+'-economy',profileId:s.profile.id,careerId:s.career.id,type:'career.migrate',maintenanceVersion:1,expectedRevision:p.expectedRevision,expectedMaintenanceRevision:p.expectedMaintenanceRevision,sourceSchema:2,targetSchema:3,sourceFingerprint:p.sourceFingerprint,migrationVersion:p.migrationVersion,adapterVersion:p.adapterVersion,generatorVersion:p.generatorVersion,confirmed:true,effectId:migrationEffect(s.career.id)});}
 s=store.state;if(s.schema===3){const p=store.previewCycles();store.migrateCycles({id:id+'-payroll',profileId:s.profile.id,careerId:s.career.id,type:'career.cycles.migrate',maintenanceVersion:1,expectedRevision:p.expectedRevision,expectedMaintenanceRevision:p.expectedMaintenanceRevision,sourceSchema:3,targetSchema:4,sourceFingerprint:p.sourceFingerprint,rulesVersion:RULES,effectId:cycleMigrationEffect(s.career.id),confirmed:true});}
 s=store.state;if(s.schema===4)store.migrateFoundation({id:id+'-foundation',profileId:s.profile.id,careerId:s.career.id,type:'career.foundation.migrate',version:1,sourceSchema:4,targetSchema:5,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,sourceFingerprint:fingerprint(s),effectId:foundationEffect(s.career.id),confirmed:true});
 if(store.state.championshipFoundation.version===1)store.transaction(makeControllerCommand(store.state,'controller.enable',{},id+'-controller'));
 if(store.state.championshipFoundation.version===2)store.transaction(makeControllerCommand(store.state,'controller.enableE3',{},id+'-races'));
 if(store.state.schema===5)store.transaction(makeE5Command(store.state,'e5.enable',{confirmed:true},id+'-championships'));
 if(store.state.schema!==6)throw Error('New career initialization is incomplete');
 return store.state;
}
