import {validateE5Entry} from '../championships/e5/contracts.js';
import {validateControllerEntry} from '../championships/controller-contracts.js';
import {validateFoundationEntry} from '../championships/contracts.js';
import {validateCycleMaintenance,validateCycleEntry} from '../cycles/contracts.js';
import { validateEconomicEntry } from './commands.js';
// Additive heterogeneous registry. Legacy v0/v1 validators remain untouched and strict.
import * as legacy from '../history.js';
import { canonical } from '../../core/determinism.js';
import { isMaintenance,validateMaintenance } from './maintenance-history.js';
export { isMaintenance } from './maintenance-history.js';
export const isLegacyEntry=e=>!Object.hasOwn(e,'kind')&&[0,1].includes(e.commandVersion);
export function validateEntry(e){return e?.kind==='championship-e5-gameplay'?validateE5Entry(e):e?.kind==='championship-gameplay'?validateControllerEntry(e):e?.kind==='foundation-maintenance'?validateFoundationEntry(e):e?.kind==='cycle-migration-maintenance'?validateCycleMaintenance(e):e?.kind==='cycle-gameplay'?validateCycleEntry(e):isMaintenance(e)?validateMaintenance(e):e?.commandVersion===2&&!Object.hasOwn(e,'kind')?validateEconomicEntry(e):legacy.validateProtected(e);}
export function mergeProtected(...lists){
  const ids=new Map(),effects=new Map(),owners=new Map();
  for(const e of lists.flat()){
    validateEntry(e);const previous=ids.get(e.id),fact=(isMaintenance(e)||e.kind==='cycle-migration-maintenance'||e.kind==='foundation-maintenance')?'acknowledgment':'balanceAfter';
    if(previous){
      if(canonical({...previous,[fact]:null})!==canonical({...e,[fact]:null}) || (previous[fact]!==null && e[fact]!==null && canonical(previous[fact])!==canonical(e[fact])))throw Error('Conflicting protected transaction ID');
      if(previous[fact]!==null)continue;
    }
    const key=e.careerId+':'+e.effectId;
    if(effects.has(key)&&effects.get(key)!==e.id)throw Error('Protected effect identity reused by another command');
    if(owners.has(e.careerId)&&owners.get(e.careerId)!==e.profileId)throw Error('Protected career ownership conflict');
    ids.set(e.id,structuredClone(e));effects.set(key,e.id);owners.set(e.careerId,e.profileId);
  }
  if(ids.size>legacy.MAX_PROTECTED_COMMANDS)throw Error('Protected history limit reached; no P0 identity was discarded');
  return [...ids.values()].sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
}
export function protectedFromState(s){return s?.schema>=2?s.history.commands:legacy.protectedFromState(s);}
export function completeProtectedRegistry(entries,marks){
  const base=mergeProtected(entries),known=new Set(base.map(e=>e.id));
  const missing=marks.filter(m=>!known.has(m.id)).map(m=>legacy.protectTransaction({id:m.id,profileId:m.profileId,careerId:m.careerId,expectedRevision:m.revision-1,type:m.type,delta:m.delta,reason:m.reason}));
  return mergeProtected(base,missing);
}
export function lookupCommitted(entries,tx,receipts=[]){
  if(entries.some(e=>e.id===tx.id&&isMaintenance(e)))throw Error('Use explicit migration confirmation for maintenance actions');
  return legacy.lookupCommitted(entries,tx,receipts);
}

export function historyRetentionPlan(state){
 if(state.schema<3)return legacy.historyRetentionPlan(state);
 return {gameplayRevision:state.revision,maintenanceRevision:state.maintenanceRevision,classes:{...legacy.RETENTION_CLASSES},protectedCommands:state.history.commands.map(e=>e.id),protectedEffects:state.history.commands.map(e=>e.effectId),remove:[],summarize:[],canCompact:false,reason:'M2-C preserves all P0 history; compaction is not implemented'};
}
