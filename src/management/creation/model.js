import {upgradeStarterRecords,addContract} from '../../career/economy/records.js';
import {initializeGameplay} from './initialize-gameplay.js';
import {createUninitializedCareer} from '../../career/state.js';
import {CareerStore} from '../../persistence/career-store.js';
import {STARTING_PACKAGES,CATALOG_VERSION,packageById,buildPackage} from '../../career/packages.js';
import {initializationEffect} from '../../career/domain-commands.js';
import {defaultRuntime,validateRuntime} from '../../persistence/e4/runtime.js';
import {exact,id} from '../../career/legacy-state.js';
export function packageChoices(){return Object.entries(STARTING_PACKAGES).map(([key,p])=>({key,name:p.name,available:true,explanation:'Available — no additional unlock requirement exists in the current catalog.'}));}
export function packagePreview(key){packageById(key);return {key,package:structuredClone(STARTING_PACKAGES[key]),management:buildPackage('preview',key)};}
export function validateCreationRequest(r){
 exact(r,['version','id','slotId','profileId','careerId','ownerName','careerName','packageId','emblem','primary','secondary',...(r.version>=2?['recruitIdentities']:[])],'creation request');
 if(![1,2,3].includes(r.version)||(r.version>=2&&typeof r.recruitIdentities!=='boolean')||!/^slot-[a-f0-9-]{36}$/.test(r.slotId))throw Error('Invalid creation request version/slot');for(const k of ['id','profileId','careerId'])id(r[k]);
 for(const k of ['ownerName','careerName'])if(typeof r[k]!=='string'||r[k]!==r[k].trim()||!r[k]||r[k].length>100)throw Error('Enter owner and stable names of 1–100 characters');
 packageById(r.packageId);return r;
}
export function creationRuntime(r){validateCreationRequest(r);return validateRuntime({...defaultRuntime(),version:2,presentation:{kind:'BNT-stable-presentation',version:1,profileId:r.profileId,careerId:r.careerId,creationId:r.id,packageId:r.packageId,emblem:r.emblem,primary:r.primary,secondary:r.secondary,onboarding:{version:1,status:'active',step:0}}});}
export function prepareCreation(request){
 const r=structuredClone(validateCreationRequest(request)),runtime=creationRuntime(r),map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v))},store=new CareerStore(storage);store.open();store.create(createUninitializedCareer(r));
 const s=store.state,p=packageById(r.packageId);
 store.transaction({id:r.id+'-grant',profileId:r.profileId,careerId:r.careerId,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:1,type:'career.initialize',packageId:r.packageId,catalogVersion:CATALOG_VERSION,confirmed:true,reason:'Owner-confirmed starting package at career creation',delta:p.gold,effectId:initializationEffect(r.careerId)});
 if(r.version>=2)store.activateCreationPresentation({recruitIdentities:r.recruitIdentities});
 if(r.version===3)initializeGameplay(store,r.id);
 return {records:[...map],state:store.state,runtime};
}

export function packageEmployment(packageId){const r=buildPackage('preview',packageId).registries;r.contracts={};upgradeStarterRecords(r);for(const person of Object.values(r.personnel))addContract(r,person,'standard',{grandfathered:true});return Object.values(r.contracts).map(c=>({name:c.name,wage:c.wage,cycles:c.cyclesRemaining}));}
