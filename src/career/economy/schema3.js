import * as legacy from '../legacy-state.js';
import {SCHEMA2_FIELDS,assertRevision} from '../schema2.js';
import {validateCommandV1,protectTransaction} from '../history.js';
import {canonical} from '../../core/determinism.js';
import {buildEconomyBase,RULES_VERSION} from './base.js';
import {mergeProtected,lookupCommitted} from './protected-registry.js';
import {isMaintenance,protectMaintenance} from './maintenance-history.js';
import {validateEconomyCommand,protectEconomic} from './commands.js';
import {executeEconomy,applyAssembly3} from './reducers.js';
import {validateGraph3} from './validation.js';
export const SCHEMA3_FIELDS=[...SCHEMA2_FIELDS,'economy'];
function applyGameplay(next,tx){
 if(tx.commandVersion===2){validateEconomyCommand(tx);return executeEconomy(next,tx);}
 validateCommandV1(tx);
 if(tx.type==='developer.treasury.adjust'){
  const sum=BigInt(next.career.treasury)+BigInt(tx.delta);if(sum<0n||sum>BigInt(Number.MAX_SAFE_INTEGER))throw Error('Invalid treasury adjustment');next.career.treasury=Number(sum);next.provenance=legacy.mergeMarks(next.provenance,[legacy.transactionMark(tx)]);next.profile.developerEdited=next.career.developerEdited=true;return undefined;
 }
 if(['ru.assemble','ru.disassemble'].includes(tx.type))return applyAssembly3(next,tx);
 throw Error('No second career initialization is permitted');
}
function protect(tx,balance,result){return tx.commandVersion===2?protectEconomic(tx,balance,result):protectTransaction(tx,balance);}
export function validateStateV3(state){
 legacy.exact(state,SCHEMA3_FIELDS,'schema-3 career state');
 legacy.exact(state.economy,['schema','rulesVersion','origin','migrationRequest','manifestDigest'],'economy lineage');
 if(state.schema!==3||state.kind!=='BNT-career-state'||state.economy.schema!==1||state.economy.rulesVersion!==RULES_VERSION||state.pendingRace!==null)throw Error('Invalid schema-3 scope/version');
 const base=buildEconomyBase(state.economy.origin,state.economy.migrationRequest);
 if(state.economy.manifestDigest!==base.economy.manifestDigest)throw Error('Migration manifest mismatch');
 if(!Number.isSafeInteger(state.maintenanceRevision)||state.maintenanceRevision<base.maintenanceRevision||!Number.isSafeInteger(state.revision)||!Array.isArray(state.transactions)||state.transactions.length>legacy.MAX_RECEIPTS||state.revision!==state.transactions.length)throw Error('Invalid gameplay/maintenance ledger');
 if(canonical(state.transactions.slice(0,base.transactions.length))!==canonical(base.transactions)||canonical(state.migration)!==canonical(base.migration))throw Error('Original M1/M2-B receipts/lineage changed');
 legacy.exact(state.history,['schema','commands'],'history');if(state.history.schema!==1)throw Error('Protected outer schema must remain 1');
 const entries=mergeProtected(state.history.commands);if(canonical(entries)!==canonical(state.history.commands))throw Error('Protected history not canonical');
 for(const entry of entries)if(entry.profileId!==state.profile.id||entry.careerId!==state.career.id)throw Error('Protected ownership mismatch');
 const maintenance=protectMaintenance(state.economy.migrationRequest,state.economy.manifestDigest);
 if(!entries.some(e=>isMaintenance(e)&&canonical({...e,acknowledgment:null})===canonical({...maintenance,acknowledgment:null})))throw Error('Missing migration protection');
 base.history.commands=mergeProtected(base.history.commands,[maintenance]);
 for(const r of state.transactions.slice(base.transactions.length)){
  const tx=r.transaction;legacy.exact(r,['transaction','resultRevision','balanceAfter',...(tx.type==='developer.treasury.adjust'?[]:['result'])],'gameplay receipt');
  if(tx.profileId!==state.profile.id||tx.careerId!==state.career.id||tx.expectedRevision!==base.revision||r.resultRevision!==base.revision+1||!Number.isSafeInteger(tx.expectedMaintenanceRevision)||tx.expectedMaintenanceRevision<base.maintenanceRevision||tx.expectedMaintenanceRevision>state.maintenanceRevision)throw Error('Receipt ownership/revision mismatch');
  // A historical operation is replayed at its own maintenance token, not current eligibility/history.
  base.maintenanceRevision=tx.expectedMaintenanceRevision;
  const result=applyGameplay(base,tx);
  if(r.balanceAfter!==base.career.treasury||(result!==undefined&&canonical(result)!==canonical(r.result)))throw Error('Noncanonical economic receipt result');
  const p=protect(tx,r.balanceAfter,result);if(!entries.some(e=>canonical(e)===canonical(p)))throw Error('Missing/changed protected gameplay fact');
  base.transactions.push(structuredClone(r));base.revision++;base.history.commands=mergeProtected(base.history.commands,[p]);
 }
 // Retained fulfillment facts suppress availability after an older checkpoint is restored.
 // This never replays a debit or reconstructs the absent owned asset.
 for(const entry of entries)if(entry.commandVersion===2){const tx=JSON.parse(entry.request);if(tx.type==='market.acquire'&&base.management.registries.marketOffers[tx.payload.offerId])base.management.registries.marketOffers[tx.payload.offerId].available=false;}
 if(canonical(base.management)!==canonical(state.management)||base.career.treasury!==state.career.treasury)throw Error('Assets, offers, XP, Gold or ledgers disagree with committed effects');
 const flags=legacy.mergeMarks(state.provenance);
 if(flags.length!==state.provenance.length||flags.some(m=>m.profileId!==state.profile.id)||state.profile.developerEdited!==Boolean(flags.length)||state.career.developerEdited!==flags.some(m=>m.careerId===state.career.id))throw Error('Invalid developer provenance');
 for(const mark of flags.filter(m=>m.careerId===state.career.id)){
  const e=entries.find(e=>e.id===mark.id);if(!e||JSON.parse(e.request).type!=='developer.treasury.adjust'||canonical(legacy.transactionMark(JSON.parse(e.request)))!==canonical(mark))throw Error('Developer mark missing exact protected request');
 }
 for(const e of entries){const tx=JSON.parse(e.request);if(tx.type==='developer.treasury.adjust'&&!flags.some(m=>canonical(m)===canonical(legacy.transactionMark(tx))))throw Error('Protected developer command lacks provenance');}
 for(const r of state.transactions.filter(r=>r.transaction.type==='developer.treasury.adjust'))if(!flags.some(m=>canonical(m)===canonical(legacy.transactionMark(r.transaction))))throw Error('Missing developer edit mark');
 if(canonical({...state.profile,developerEdited:false})!==canonical({...base.profile,developerEdited:false})||canonical({...state.career,treasury:0,developerEdited:false})!==canonical({...base.career,treasury:0,developerEdited:false}))throw Error('Profile/career identity changed');
 for(const original of state.economy.origin.history.commands)if(!entries.some(e=>canonical(e)===canonical(original)))throw Error('M2-B protected identity lost');
 validateGraph3(state);return state;
}
export function withKnownHistoryV3(state,marks,history=[]){
 validateStateV3(state);if(history.some(e=>e.careerId===state.career.id&&e.profileId!==state.profile.id)||marks.some(m=>m.careerId===state.career.id&&m.profileId!==state.profile.id))throw Error('Career ownership conflict');
 const next=structuredClone(state);next.provenance=legacy.mergeMarks(next.provenance,marks.filter(m=>m.profileId===next.profile.id));next.profile.developerEdited=Boolean(next.provenance.length);next.career.developerEdited=next.provenance.some(m=>m.careerId===next.career.id);next.history.commands=mergeProtected(next.history.commands,history.filter(e=>e.profileId===next.profile.id&&e.careerId===next.career.id));for(const e of next.history.commands)if(e.commandVersion===2){const tx=JSON.parse(e.request);if(tx.type==='market.acquire'&&next.management.registries.marketOffers[tx.payload.offerId])next.management.registries.marketOffers[tx.payload.offerId].available=false;}return validateStateV3(next);
}
export function transactV3(state,tx){
 validateStateV3(state);const previous=lookupCommitted(state.history.commands,tx,state.transactions);if(previous)return {...previous,state:structuredClone(state)};
 if(tx.commandVersion===2)validateEconomyCommand(tx);else validateCommandV1(tx);
 if(tx.profileId!==state.profile.id||tx.careerId!==state.career.id)throw Error('Command ownership mismatch');assertRevision(state,tx.expectedRevision,tx.expectedMaintenanceRevision);
 if(state.history.commands.some(e=>e.effectId===tx.effectId))throw Error('Effect identity already committed');if(state.transactions.length>=legacy.MAX_RECEIPTS)throw Error('Transaction limit reached; no pruning');
 const next=structuredClone(state),result=applyGameplay(next,tx),receipt={transaction:structuredClone(tx),resultRevision:state.revision+1,balanceAfter:next.career.treasury,...(result===undefined?{}:{result})};
 next.revision++;next.transactions.push(receipt);next.history.commands=mergeProtected(next.history.commands,[protect(tx,receipt.balanceAfter,result)]);
 return {state:validateStateV3(next),duplicate:false,receipt:structuredClone(receipt)};
}
