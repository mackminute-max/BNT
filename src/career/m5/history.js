import {canonical} from '../../core/determinism.js';
import {fingerprint} from '../cycles/contracts.js';
import {exact} from '../legacy-state.js';
export const pageKey=page=>'bnt.m5.history.'+fingerprint(page);
export function validatePage(key,text,owner){
 const page=JSON.parse(text);exact(page,['kind','version','profileId','careerId','ordinal','previous','rows']);
 if(page.kind!=='M5-protected-history-page'||page.version!==1||page.profileId!==owner.profile.id||page.careerId!==owner.career.id||pageKey(page)!==key||!Number.isSafeInteger(page.ordinal)||page.ordinal<0||!Array.isArray(page.rows)||!page.rows.length||page.rows.length>128)throw Error('Invalid/missing/foreign protected history page');
 return page;
}
export function validatePages(s,storage){let previous=null,lastRevision=s.m5.firstRevision,balance=s.m5.finance.opening,credits=0,debits=0;const seen=new Set(),championships=new Map();
 const check=row=>{if(!row||typeof row.kind!=='string'||typeof row.id!=='string'||seen.has(row.id))throw Error('Duplicate/invalid protected historical effect');seen.add(row.id);if(row.kind==='championship'){if(!row.instanceId||championships.has(row.instanceId)||!row.archive||!Array.isArray(row.races))throw Error('Invalid archived championship summary');championships.set(row.instanceId,row);}else if(!['operation','paid-wage'].includes(row.kind))throw Error('Unsupported protected history row');if(row.kind==='operation'){const recovery=row.type==='m5.recover';if(recovery){const r=row.recovery;if(r?.version!==1||r.previousRevision!==lastRevision||r.currentRevision<lastRevision||row.revision!==r.currentRevision+1||!/^[a-f0-9]{64}$/.test(r.headHash)||!/^[a-f0-9]{64}$/.test(r.previousHash)||row.balanceBefore!==row.balanceAfter)throw Error('Invalid confirmed recovery boundary');}if((!recovery&&row.revision!==lastRevision+1)||row.balanceBefore!==balance||!Number.isSafeInteger(row.balanceAfter)||row.balanceAfter<0)throw Error('Historical operation/financial continuity mismatch');const delta=row.balanceAfter-balance;credits+=Math.max(0,delta);debits+=Math.max(0,-delta);balance=row.balanceAfter;lastRevision=row.revision;const ack=s.m5.acks.find(a=>a.id===row.id);if(ack&&(ack.requestHash!==row.requestHash||ack.revision!==row.revision||ack.balanceAfter!==row.balanceAfter))throw Error('Acknowledgment/history mismatch');}};
 for(let i=0;i<s.m5.historyPages.length;i++){
 const key=s.m5.historyPages[i],text=storage.getItem(key);if(text===null)throw Error('Missing required protected page');const p=validatePage(key,text,s);if(p.ordinal!==i||p.previous!==previous)throw Error('Protected page continuity mismatch');for(const row of p.rows)check(row);previous=key;
 }
 for(const row of s.m5.historyTail)check(row);
 if(championships.size!==s.e5.archives.length)throw Error('Archive index/history count mismatch');for(const a of s.e5.archives){const c=championships.get(a.instanceId);if(!c||canonical(c.archive.standings)!==canonical(a.standings)||canonical(c.archive.legacySelection)!==canonical(a.legacySelection)||c.archive.settlementId!==a.settlementId||c.name!==a.summary?.name)throw Error('Archive index/history facts mismatch');}
 if(lastRevision!==s.revision||balance!==s.career.treasury||credits!==s.m5.finance.credits||debits!==s.m5.finance.debits)throw Error('Protected financial ledger/current state mismatch');
 return {pages:s.m5.historyPages.length,lastRevision};}
export function pageHistory(state,rows){const s=structuredClone(state),records=[];let tail=[],bytes=0;
 const flush=()=>{if(!tail.length)return;const page={kind:'M5-protected-history-page',version:1,profileId:s.profile.id,careerId:s.career.id,ordinal:s.m5.historyPages.length,previous:s.m5.historyPages.at(-1)??null,rows:tail},key=pageKey(page),text=canonical(page);if(new TextEncoder().encode(text).length>8*1024*1024)throw Error('Protected history record exceeds 8 MiB; nothing pruned');records.push([key,text]);s.m5.historyPages.push(key);tail=[];bytes=0;};
 for(const row of [...s.m5.historyTail,...rows]){const size=new TextEncoder().encode(canonical(row)).length;if(tail.length&&(tail.length>=128||bytes+size>512*1024))flush();tail.push(row);bytes+=size;if(tail.length===128||bytes>=512*1024)flush();}
 s.m5.historyTail=tail;return {state:s,records};}
// Only finalized and selection-complete instances can retire detailed native
// evidence. Exact official classifications/conditions/financial facts survive.
export function compactArchived(state){const s=structuredClone(state),rows=[],retiredKeys=[],instanceIds=[];
 for(const archive of s.e5.archives){const x=s.championshipFoundation.instances[archive.instanceId];if(!x)continue;
 const m=s.e5.instances[x.id],terminal=s.e5.terminalRegistry[m?.settlementId];
 if(x.phase!=='COMPLETED_ARCHIVED'||s.championshipFoundation.activeId===x.id||!terminal?.settled||(terminal.legacyOffer&&!terminal.legacySelection))throw Error('Unresolved championship evidence cannot compact');
 archive.summary={name:x.offer.value.name,playerId:x.playerId,...(x.economicContextId?{economicContextId:x.economicContextId}:{}),...(x.m5Competition?{competition:structuredClone(x.m5Competition)}:{}),entrants:x.entrants.map(e=>({id:e.id})),raceResults:x.raceResults.map(r=>({eventIndex:r.eventIndex,kind:r.kind,rows:r.rows})),statement:structuredClone(s.cycles.statements[x.id])};instanceIds.push(x.id);rows.push({kind:'championship',id:'summary-'+x.id,instanceId:x.id,name:x.offer.value.name,templateId:x.offer.value.templateId,...(x.m5Competition?{competition:structuredClone(x.m5Competition)}:{}),identities:structuredClone(x.m5Identities??{}),entrants:x.entrants.map(e=>({id:e.id,player:e.player,assetIds:e.assetIds,native:structuredClone(e.native)})),officialFinal:structuredClone(x.officialFinal),races:x.raceResults.map(r=>({raceId:r.raceId,resultId:r.resultId,eventIndex:r.eventIndex,kind:r.kind,proofFingerprint:r.proofFingerprint,rows:r.rows,effects:r.effects,mappings:r.mappings,participation:r.participation})),settlement:structuredClone(s.cycles.statements[x.id]),obligations:structuredClone(Object.values(s.cycles.obligations).filter(o=>o.championshipId===x.id)),terminal:structuredClone(terminal),archive:structuredClone(archive)});
 for(const r of x.raceResults)if(r.kind==='NativeCleared')retiredKeys.push(r.reference.storageKey);
 delete s.championshipFoundation.instances[x.id];delete s.e5.instances[x.id];delete s.e5.terminalRegistry[m.settlementId];delete s.cycles.statements[x.id];s.m5.lastArchive=x.id;
 // Settled paid claims no longer affect payroll; unpaid liabilities remain live.
 for(const [key,o]of Object.entries(s.cycles.obligations))if(o.balance===0){rows.push({kind:'paid-wage',id:'paid-'+o.id,obligation:structuredClone(o)});delete s.cycles.obligations[key];}
 }
 const latest=s.e5.archives.at(-1)?.instanceId;for(const a of s.e5.archives)if(a.instanceId!==latest&&a.summary){a.summary={name:a.summary.name,playerId:a.summary.playerId,...(a.economicContextId?{economicContextId:a.economicContextId}:{})};delete a.runSelections;}return {...pageHistory(s,rows),retiredKeys,instanceIds,archived:instanceIds.length};
}
