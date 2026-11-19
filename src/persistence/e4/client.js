import {IndexedRecords,E4_DISCOVERY} from './indexeddb.js';
// Replaced by esbuild with the embedded bundle. No worker URL or external asset.
const embedded=typeof BNT_E4_WORKER_SOURCE==='undefined'?'':BNT_E4_WORKER_SOURCE;
export class InlineWorkerClient {
 constructor({source=embedded,timeoutMs=300000}={}){this.source=source;this.timeoutMs=timeoutMs;this.pending=new Map();this.sequence=0;this.start();}
 start(){if(!this.source)throw Error('Embedded worker unavailable');const url=URL.createObjectURL(new Blob([this.source],{type:'text/javascript'}));try{this.worker=new Worker(url);}finally{URL.revokeObjectURL(url);}
  this.worker.onmessage=({data})=>{const p=this.pending.get(data.requestId);if(!p)return;clearTimeout(p.timer);this.pending.delete(data.requestId);if(data.error)p.reject(Error(data.error.message));else p.resolve(data.result);};
  this.worker.onerror=()=>this.fail('Worker failed; no durable acknowledgement; reload durable authority');this.worker.onmessageerror=()=>this.fail('Worker transport failed; reload durable authority');
 }
 fail(reason){this.worker?.terminate();for(const p of this.pending.values()){clearTimeout(p.timer);p.reject(Error(reason));}this.pending.clear();this.failed=true;}
 restart(){this.fail('Worker restarted; pending preparation discarded');this.failed=false;this.start();}
 close(){this.fail('Worker closed');}
 call(message){if(this.failed)return Promise.reject(Error('Worker unavailable; explicit restart required'));const requestId=++this.sequence;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>this.fail('Worker timed out; reload durable authority'),this.timeoutMs);this.pending.set(requestId,{resolve,reject,timer});this.worker.postMessage({requestId,message:{version:1,...message}});});}
}
export class E4Coordinator {
 static async open(options={}){const backend=await IndexedRecords.open(options);let worker;try{worker=new InlineWorkerClient(options);}catch(e){backend.close();throw e;}return new E4Coordinator(backend,worker);}
 constructor(backend,worker){this.backend=backend;this.worker=worker;this.busy=false;}
 close(){this.worker.close();this.backend.close();}
 async exclusive(operation){if(this.busy)throw Error('Operation pending; duplicate submission blocked');this.busy=true;try{return await operation();}finally{this.busy=false;}}
 async probe(){const worker=await this.worker.call({type:'probe'}),snapshot=await this.backend.snapshot();return {...worker,indexedDB:true,generation:snapshot.generation};}
 async validate(){return this.exclusive(async()=>{const snapshot=await this.backend.snapshot();return this.worker.call({type:'validate',snapshot});});}
 async migrate(legacy,{confirmed=false,locks=globalThis.navigator?.locks}={}){if(typeof locks?.request!=='function')throw Error('Migration requires the existing career writer lock');return this.exclusive(()=>locks.request('bnt.career.save.v1.writer',{mode:'exclusive'},async()=>{
  if(!confirmed)throw Error('Explicit migration confirmation required');const discovered=await this.backend.discover(legacy);if(discovered.migration)return {duplicate:true,generation:discovered.generation};
  const records=[];for(let i=0;i<legacy.length;i++){const k=legacy.key(i);if(k==='bnt.career.save.v1'||k?.startsWith('bnt.race.foundation.v1.'))records.push([k,legacy.getItem(k)]);}
  await this.worker.call({type:'validate',snapshot:{generation:0,records}});
  return this.backend.migrate({legacy,records,confirmed,validated:true});
 }));}
 async operate(operation,args={}){return this.exclusive(async()=>{
  const snapshot=await this.backend.snapshot(),candidate=await this.worker.call({type:'prepare',snapshot,operation,...args});
  try{const committed=await this.backend.commit({expectedGeneration:snapshot.generation,readSet:snapshot.records,records:candidate.records});
   // If this acknowledgement is lost, caller must reload the backend. It must
   // never retry against the earlier generation as if the write did not happen.
   await this.worker.call({type:'ack',token:candidate.token});return {...committed,phase:candidate.phase,revision:candidate.revision,preparationMs:candidate.elapsedMs};
  }catch(e){await this.worker.call({type:'reset'}).catch(()=>{});throw e;}
 });}
 async publish(id){await this.operate('nativePrepare',{id:'e4-prepare-'+id});return this.operate('official',{id});}
}
export {E4_DISCOVERY};
