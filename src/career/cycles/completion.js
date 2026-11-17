import {exact,id} from '../legacy-state.js';
import {freeze} from '../assets.js';
import {fingerprint,gold,RULES} from './contracts.js';
const trusted=new WeakSet();
export function contractSnapshot(state){return Object.values(state.management.registries.contracts).filter(c=>c.lifecycle==='active').sort((a,b)=>a.id<b.id?-1:1).map(c=>({contractId:c.id,personId:c.references.employee[0],wage:c.wage,cyclesRemaining:c.cyclesRemaining}));}
export function validateCompletion(c){
 exact(c,['kind','version','profileId','careerId','championshipId','outcome','completedOnce','state','roster','rulesVersion','resultVersion','rewards','authority','sourceFingerprint'],'championship completion');
 for(const k of ['profileId','careerId','championshipId','authority'])id(c[k]);
 if(c.kind!=='BNT-championship-completion'||c.version!==1||c.rulesVersion!==RULES||c.resultVersion!==1||c.completedOnce!==true||c.state!=='CHAMPIONSHIP_COMPLETED'||!['Completed','Withdrawn','Disqualified'].includes(c.outcome)||!Array.isArray(c.roster)||c.roster.length>1000||!Array.isArray(c.rewards)||c.rewards.length>100)throw Error('Invalid authoritative completion');
 const ids=new Set();for(const r of c.roster){exact(r,['contractId','personId','wage','cyclesRemaining'],'completion contract');id(r.contractId);id(r.personId);gold(r.wage);gold(r.cyclesRemaining);if(ids.has(r.contractId)||r.cyclesRemaining<1)throw Error('Invalid completion roster');ids.add(r.contractId);}
 const rewardIds=new Set();for(const r of c.rewards){exact(r,['id','amount'],'authorized income');id(r.id);gold(r.amount);if(rewardIds.has(r.id))throw Error('Duplicate reward');rewardIds.add(r.id);}
 if(c.sourceFingerprint!==fingerprint({...c,sourceFingerprint:null}))throw Error('Completion source fingerprint mismatch');return c;
}
export const requireTrustedCompletion=c=>{if(!trusted.has(c))throw Error('No trusted championship completion producer: arbitrary reward submission rejected');validateCompletion(c);};
// Future controller seam. Not imported by the production UI or exported on window.BNT.
// The caller must verify against its immutable authoritative result registry.
export function createCompletionBoundary(verifyAuthoritativeResult){
 if(typeof verifyAuthoritativeResult!=='function')throw Error('Completion authority verifier required');
 return Object.freeze({accept(record){validateCompletion(record);if(verifyAuthoritativeResult(record)!==true)throw Error('Unrecognized authoritative championship result');const copy=freeze(structuredClone(record));trusted.add(copy);return copy;}});
}
