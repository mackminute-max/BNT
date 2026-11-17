import {validateStateV2} from '../schema2.js';
import {canonical} from '../../core/determinism.js';
import {sha256} from './fingerprint.js';
import {generateMarket} from './market.js';
import {upgradeStarterRecords,addContract} from './records.js';
import {validateMigrationRequest,MIGRATION_VERSION,ADAPTER_VERSION,GENERATOR_VERSION,migrationEffect} from './maintenance-history.js';
import {freeze} from '../assets.js';
export const RULES_VERSION='m2c-economy-v1';
export function assertMigrationSource(source){
 for(const kind of ['personnel','beasts'])for(const r of Object.values(source?.management?.registries?.[kind]??{}))if(r?.injury!=='Healthy')throw Error('UNSUPPORTED_LEGACY_INJURY: '+r?.id);
 validateStateV2(source);
 if(!source.management.initialized)throw Error('Initialized M2-B owned assets required; consumed grants are never reconstructed');
 if(source.pendingRace!==null)throw Error('Pending race checkpoint is not an M2-C migration source');
}
export function migrationManifest(target){
 const r=target.management.registries;
 return {sourceSchema:2,targetSchema:3,sourceFingerprint:target.economy.migrationRequest.sourceFingerprint,migrationVersion:MIGRATION_VERSION,adapterVersion:ADAPTER_VERSION,generatorVersion:GENERATOR_VERSION,treasury:target.career.treasury,gameplayRevision:target.revision,maintenanceRevision:target.maintenanceRevision,
  assetIds:['personnel','beasts','chariots','equipment'].flatMap(k=>Object.keys(r[k])).sort(),contracts:Object.values(r.contracts),valuations:['personnel','beasts','chariots','equipment'].flatMap(kind=>Object.values(r[kind]).map(a=>({id:a.id,kind,...a.economics}))),properties:Object.values(r.properties),facilities:Object.values(r.facilities),assignments:Object.values(r.assignments),market:Object.values(r.marketOffers)};
}
export function buildEconomyBase(source,request){
 assertMigrationSource(source);validateMigrationRequest(request);
 if(request.profileId!==source.profile.id||request.careerId!==source.career.id||request.expectedRevision!==source.revision||request.expectedMaintenanceRevision!==source.maintenanceRevision||request.sourceFingerprint!==sha256(canonical(source)))throw Error('Migration source fingerprint/revision/ownership mismatch; preview again');
 const next=structuredClone(source);next.schema=3;next.maintenanceRevision++;next.management.registrySchema=3;
 const r=next.management.registries;upgradeStarterRecords(r);
 for(const person of Object.values(r.personnel))addContract(r,person,'standard',{grandfathered:true});
 r.marketOffers=generateMarket(source.career.id);
 next.economy={schema:1,rulesVersion:RULES_VERSION,origin:structuredClone(source),migrationRequest:structuredClone(request),manifestDigest:''};
 next.economy.manifestDigest=sha256(canonical(migrationManifest(next)));return next;
}
export function previewMigration(source){
 assertMigrationSource(source);const sourceFingerprint=sha256(canonical(source));
 const request={id:'migration-preview',profileId:source.profile.id,careerId:source.career.id,type:'career.migrate',maintenanceVersion:1,expectedRevision:source.revision,expectedMaintenanceRevision:source.maintenanceRevision,sourceSchema:2,targetSchema:3,sourceFingerprint,migrationVersion:MIGRATION_VERSION,adapterVersion:ADAPTER_VERSION,generatorVersion:GENERATOR_VERSION,confirmed:true,effectId:migrationEffect(source.career.id)};
 const next=buildEconomyBase(source,request);return freeze({sourceFingerprint,expectedRevision:source.revision,expectedMaintenanceRevision:source.maintenanceRevision,migrationVersion:MIGRATION_VERSION,adapterVersion:ADAPTER_VERSION,generatorVersion:GENERATOR_VERSION,manifest:migrationManifest(next),manifestDigest:next.economy.manifestDigest});
}
