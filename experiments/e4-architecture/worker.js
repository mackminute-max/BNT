// EXPERIMENT ONLY: worker owns an isolated prototype database using UNCHANGED
// production record validation, read sets, CAS, transaction completion and service.
import {RecordArchive} from './pages.js';
import {IndexedRecords} from '../../src/persistence/e4/indexeddb.js';
import {createWorkerService} from '../../src/persistence/e4/worker-service.js';
let backend,handle=createWorkerService();
async function operation(m){
 if(["seed","connect"].includes(m.type)&&!/^EXP-|^MEM-|^FAULT-/.test(m.name??""))throw Error("Prototype database prefix required");
 if(m.type==='connect'){backend=await IndexedRecords.open({name:m.name});return {connected:true,durable:false};}
 if(m.type==='seed'){backend=await IndexedRecords.open({name:m.name});const map=new Map(m.records),legacy={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};await handle({version:1,type:'validate',snapshot:{generation:0,records:m.records}});await backend.migrate({legacy,records:m.records,confirmed:true,validated:true});return {generation:(await backend.snapshot()).generation,durable:true};}
 if(m.type==='codecStats')return {stats:globalThis.__EXPERIMENT_CODEC_STATS??null,durable:false};
 if(m.type==='reset'){return handle({version:1,type:'reset'});}
 if(m.type==='records')return backend.snapshot();
 if(m.type==='inspect'){const s=await backend.snapshot(),r=await handle({version:1,type:'inspect',snapshot:s});const f=r.state?.championshipFoundation,x=f?.instances?.[f.activeId];return {generation:s.generation,phase:x?.phase,tick:r.frame?.tick??null,valid:!!r.state,reason:r.reason,durable:false};}
 if(m.type==='archiveStats'){const current=await backend.snapshot(),previous=await backend.previous(),a=new RecordArchive(),begin=performance.now(),heads=[current.records,...(previous?[previous.records]:[])],refs=[];for(const head of heads)refs.push(await a.encode(head));for(let i=0;i<heads.length;i++)if(JSON.stringify(await a.decode(refs[i]))!==JSON.stringify(heads[i]))throw Error('Raw archive mismatch');const bytes=x=>new TextEncoder().encode(JSON.stringify(x)).length;return {exact:true,heads:heads.length,legacyBytes:bytes(heads),factoredBytes:bytes([...a.blocks])+bytes(refs),uniqueRecords:a.blocks.size,elapsedMs:performance.now()-begin,durable:false};}
 if(m.type==='backup'){const snapshot=await backend.snapshot(),previous=await backend.previous(),r=await handle({version:1,type:'backup',snapshot,previous});return {bytes:new TextEncoder().encode(r.text).length,...(m.includeText?{text:r.text}:{}),durable:false};}
 if(m.type==='restore'){const snapshot=await backend.snapshot(),plan=await handle({version:1,type:'prepareRestore',snapshot,baseline:[],text:m.text});if(plan.duplicate)return {duplicate:true,durable:true,generation:snapshot.generation};await backend.stageRestore({version:1,state:'PREPARED',digest:plan.digest,baseGeneration:snapshot.generation,text:m.text},{expectedGeneration:snapshot.generation,readSet:snapshot.records});const r=await backend.commit({expectedGeneration:snapshot.generation,readSet:snapshot.records,records:plan.records,runtime:plan.runtime,restore:{digest:plan.digest,receipts:plan.receipts},abortBeforeComplete:m.abort===true});await handle({version:1,type:'reset'});return r;}
 if(m.type==='corruptForTest'){const tx=backend.db.transaction('authority','readwrite'),store=tx.objectStore('authority'),r=store.get('head');r.onsuccess=()=>{const h=r.result;h.records[0][1]='{}';store.put(h,'head');};await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onabort=reject;});return {injected:true};}
 if(m.type==='restoreProof'){const snapshot=await backend.snapshot(),previous=await backend.previous(),b=await handle({version:1,type:'backup',snapshot,previous});const r=await handle({version:1,type:'prepareRestore',snapshot,baseline:[],text:b.text});return {validated:true,duplicate:r.duplicate??false,bytes:b.text.length,durable:false};}
 if(m.type!=='operate')throw Error('Unknown experimental operation');
 const t=performance.now(),s=await backend.snapshot(),readMs=performance.now()-t;if(m.expectedGeneration!==s.generation)throw Error('STALE_WRITER');
 const p=await handle({version:1,type:'prepare',snapshot:s,operation:m.operation,...m.args});
 try{const begin=performance.now(),r=await backend.commit({expectedGeneration:s.generation,readSet:s.records,records:p.records,recordsHash:p.recordsHash,abortBeforeComplete:m.abort===true});const commitMs=performance.now()-begin;
  if(m.loseAck){await handle({version:1,type:'reset'});throw Error('Injected lost durable acknowledgment');}
  await handle({version:1,type:'ack',token:p.token});return {...r,readMs,preparationMs:p.elapsedMs,commitMs,totalMs:performance.now()-t};
 }catch(e){await handle({version:1,type:'reset'});throw e;}
}
let queue=Promise.resolve();self.onmessage=({data})=>{queue=queue.then(async()=>{try{const writes=['seed','operate','restore'].includes(data.message.type);if(writes&&!self.navigator?.locks)throw Error('Existing Web Locks required');const result=writes?await navigator.locks.request('bnt.career.save.v1.writer',{mode:'exclusive'},()=>operation(data.message)):await operation(data.message);self.postMessage({id:data.id,result});}catch(e){self.postMessage({id:data.id,error:e.message});}});};
