import {readCurrentEnvelope,currentEnvelope,foldCurrent} from './envelope.js';
import {validateCurrent} from './current.js';
import {validatePages,pageHistory} from './history.js';
import {fingerprint} from '../cycles/contracts.js';
// Explicitly confirmed recovery replaces progress, not writer chronology. Native
// mechanics are unchanged; the typed zero-Gold maintenance row records the skipped
// (quarantined) branch, and all subsequent commands use newer absolute revisions.
export function preparePreviousRecovery(previous,token){
 const map=new Map(previous.records),read=readCurrentEnvelope(map.get('bnt.career.save.v1'));validatePages(read.primary,{getItem:k=>map.get(k)??null});
 if(!Number.isSafeInteger(token.careerRevision)||!Number.isSafeInteger(token.maintenanceRevision)||token.careerRevision<read.primary.revision||token.generation<previous.generation)throw Error('Invalid recovery chronology');
 let state=structuredClone(read.primary);const previousRevision=state.revision;state.revision=token.careerRevision+1;state.maintenanceRevision=Math.max(state.maintenanceRevision,token.maintenanceRevision)+1;
 const recovery={version:1,previousRevision,currentRevision:token.careerRevision,fromGeneration:token.generation,previousGeneration:previous.generation,headHash:token.headHash,previousHash:token.previousHash};
 const row={kind:'operation',id:'m5-recovery-'+fingerprint(recovery).slice(0,40),revision:state.revision,type:'m5.recover',effectId:'m5-recover-'+token.generation,requestHash:fingerprint(recovery),balanceBefore:state.career.treasury,balanceAfter:state.career.treasury,result:null,retired:[],recovery};
 // A recovery checkpoint incorporates the old tail before publishing the new
 // maintenance revision. It is never represented as a fabricated native command.
 state.transactions=[];state.history.commands=[];state.m5.baseRevision=state.revision;
 const paged=pageHistory(state,[row]);state=foldCurrent(paged.state);validateCurrent(state);
 for(const [key,text]of paged.records)map.set(key,text);map.set('bnt.career.save.v1',currentEnvelope(state,state,read.presentation).text);validatePages(state,{getItem:k=>map.get(k)??null});
 return {version:1,records:[...map],runtime:previous.runtime,sourceToken:structuredClone(token),revision:state.revision,maintenanceRevision:state.maintenanceRevision,durable:false};
}
