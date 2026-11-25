import {validateCurrent,transactCurrent,M5_FAMILY,M5_TAIL_LIMIT} from './current.js';
import {canonical} from '../../core/determinism.js';
import {fingerprint} from '../cycles/contracts.js';
import {exact} from '../legacy-state.js';
import {validateCareerPresentation} from '../../persistence/career-presentation.js';
export const M5_SAVE='BNT-M5-current-save',M5_RECORD_BYTES=8*1024*1024;
export function readCurrentEnvelope(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>M5_RECORD_BYTES)throw Error('Oversized/incompatible M5 save');
 const e=JSON.parse(text);exact(e,['kind','version','family','base','tail','currentHash','presentation']);
 if(e.kind!==M5_SAVE||e.version!==1||e.family!==M5_FAMILY||!e.base||e.base.hash!==fingerprint(e.base.value)||!Array.isArray(e.tail)||e.tail.length>M5_TAIL_LIMIT)throw Error('Corrupt/incompatible M5 save family');
 let state=validateCurrent(structuredClone(e.base.value));if(state.transactions.length||state.history.commands.length||state.revision!==state.m5.baseRevision)throw Error('Invalid checkpoint base');
 for(const receipt of e.tail){const next=transactCurrent(state,receipt.transaction,{historical:true});if(next.duplicate||canonical(next.receipt)!==canonical(receipt))throw Error('Native tail reconstruction mismatch');state=next.state;}
 if(fingerprint(state)!==e.currentHash)throw Error('Current checkpoint/tail mismatch');
 const presentation=e.presentation===null?null:validateCareerPresentation(e.presentation,state);
 return {envelope:e,primary:state,recovery:null,marks:[],protectedHistory:state.history.commands,maintenanceClock:state.maintenanceRevision,presentation,errors:{}};
}
export function currentEnvelope(state,base,presentation){
 validateCurrent(state);validateCurrent(base);
 const envelope={kind:M5_SAVE,version:1,family:M5_FAMILY,base:{value:structuredClone(base),hash:fingerprint(base)},tail:structuredClone(state.transactions),currentHash:fingerprint(state),presentation:presentation===null?null:validateCareerPresentation(presentation,state)};
 const text=JSON.stringify(envelope);if(new TextEncoder().encode(text).length>M5_RECORD_BYTES)throw Error('M5 logical record capacity exceeded; no state committed');
 return {envelope,text,state};
}
export function foldCurrent(s){const n=structuredClone(validateCurrent(s));n.m5.baseRevision=n.revision;n.m5.checkpoint++;n.transactions=[];n.history.commands=[];return validateCurrent(n);}
