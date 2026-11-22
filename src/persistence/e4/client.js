import {validateRuntime} from './runtime.js';
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
 constructor(backend,worker){this.backend=backend;this.worker=worker;this.busy=false;this.onProgress=()=>{};}
 progress(stage){this.onProgress({stage});}
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
 async capacityEstimate(bytes){try{const estimate=await globalThis.navigator?.storage?.estimate?.();return {requestedBytes:bytes,reportedQuota:estimate?.quota??null,reportedUsage:estimate?.usage??null,reportedHeadroom:estimate?.quota===undefined?null:estimate.quota-(estimate.usage??0),guaranteed:false};}catch{return {requestedBytes:bytes,reportedQuota:null,reportedUsage:null,reportedHeadroom:null,guaranteed:false};}}
 async locked(fn){const locks=globalThis.navigator?.locks;if(!locks?.request)throw Error('Coordinated writes require Web Locks');return locks.request('bnt.career.save.v1.writer',{mode:'exclusive'},fn);}
 async operate(operation,args={}){return this.exclusive(()=>this.locked(async()=>{
  const totalStarted=performance.now();this.progress('Reading durable generation');const snapshot=await this.backend.snapshot();if(args.expectedGeneration!==undefined&&args.expectedGeneration!==snapshot.generation)throw Error('STALE_WRITER: metadata generation changed');if(snapshot.restoreStage?.state==='PREPARED')throw Error('Recovery required: complete the staged restore before further changes');this.progress('Preparing and validating in worker');const candidate=await this.worker.call({type:'prepare',snapshot,operation,...args});
  const capacity=await this.capacityEstimate(candidate.records.reduce((n,[k,v])=>n+2*(k.length+v.length),0));if(capacity.reportedHeadroom!==null&&capacity.reportedHeadroom<capacity.requestedBytes)this.progress('Reported capacity is low; the atomic write may safely reject');try{this.progress('Committing IndexedDB generation');const commitStarted=performance.now();const committed=await this.backend.commit({expectedGeneration:snapshot.generation,readSet:snapshot.records,records:candidate.records,recordsHash:candidate.recordsHash,runtime:args.runtime,...(operation==='repair'?{previousOverride:{version:1,generation:snapshot.generation,records:candidate.records,recordsHash:candidate.recordsHash,runtime:snapshot.runtime}}:{})});
   // If this acknowledgement is lost, caller must reload the backend. It must
   // never retry against the earlier generation as if the write did not happen.
   await this.worker.call({type:'ack',token:candidate.token});return {...committed,...(candidate.viewer?{viewer:candidate.viewer}:{}),phase:candidate.phase,revision:candidate.revision,preparationMs:candidate.elapsedMs,capacity,commitMs:performance.now()-commitStarted,totalMs:performance.now()-totalStarted};
  }catch(e){await this.worker.call({type:'reset'}).catch(()=>{});throw e;}
 }));}
 async repair(){const previous=await this.backend.previous();return this.operate('repair',{previous});}
 async inspect(){return this.exclusive(async()=>{this.progress('Validating durable career and sessions');const snapshot=await this.backend.snapshot(),view=await this.worker.call({type:'inspect',snapshot});return {...view,hasAuthority:!!(snapshot.generation||snapshot.migration||snapshot.migrationStage||snapshot.restoreStage),runtime:snapshot.runtime,generation:snapshot.generation,restoreStage:snapshot.restoreStage,migrationStage:snapshot.migrationStage,migration:snapshot.migration};});}
 async previewCareer(method){if(!['previewEconomy','previewCycles'].includes(method))throw Error('Unsupported career preview');return this.exclusive(async()=>this.worker.call({type:'careerPreview',snapshot:await this.backend.snapshot(),method}));}
 async viewerRead(channel){return this.exclusive(async()=>{const snapshot=await this.backend.snapshot();const result=await this.worker.call({type:'viewerRead',snapshot,channel});return {durable:true,generation:snapshot.generation,...result.packet};});}
 async metadata(patch){const snapshot=await this.backend.snapshot(),runtime=validateRuntime({...snapshot.runtime,...patch});return this.operate('metadata',{runtime,expectedGeneration:snapshot.generation});}
 async career(method,args){return this.operate('career',{method,args});}
 async backup(){return this.exclusive(async()=>{this.progress('Validating complete backup');const snapshot=await this.backend.snapshot(),previous=await this.backend.previous(),result=await this.worker.call({type:'backup',snapshot,previous});const again=await this.backend.snapshot();if(again.generation!==snapshot.generation)throw Error('Authority changed during backup; retry');return result.text;});}
 async legacyExport(){return this.exclusive(async()=>{const snapshot=await this.backend.snapshot();return (await this.worker.call({type:'legacyExport',snapshot})).envelope;});}
 async restore(text,{confirmed=false,legacy=globalThis.localStorage,onBoundary=()=>{}}={}){return this.exclusive(()=>this.locked(async()=>{
  if(!confirmed)throw Error('Explicit complete replacement confirmation required');this.progress('Validating complete restore and protected history');const snapshot=await this.backend.snapshot();
  const baseline=[];if(!snapshot.records.length&&legacy?.getItem('bnt.career.save.v1')){for(let i=0;i<legacy.length;i++){const k=legacy.key(i);if(k==='bnt.career.save.v1'||k?.startsWith('bnt.race.foundation.v1.'))baseline.push([k,legacy.getItem(k)]);}}
  const plan=await this.worker.call({type:'prepareRestore',snapshot,baseline,text});if(plan.duplicate)return {duplicate:true,durable:true,generation:snapshot.generation};const b={digest:plan.digest};
  const capacity=await this.capacityEstimate(2*text.length+plan.records.reduce((n,[k,v])=>n+2*(k.length+v.length),0));if(capacity.reportedHeadroom!==null&&capacity.reportedHeadroom<capacity.requestedBytes)this.progress('Low reported restore capacity; activation remains atomic and may reject');
  const stage={version:1,state:'PREPARED',digest:b.digest,baseGeneration:snapshot.generation,text};await this.backend.stageRestore(stage,{expectedGeneration:snapshot.generation,readSet:snapshot.records});await onBoundary('staged');
  const root=plan.rootDigest;legacy.setItem(E4_DISCOVERY,JSON.stringify({version:1,database:this.backend.db.name,state:'PREPARED',digest:root}));await onBoundary('witnessed');
  this.progress('Activating validated restored generation');const migration=snapshot.migration??{version:2,source:'complete-restore',recordKeys:plan.records.map(([k])=>k),digest:root};
  const result=await this.backend.commit({expectedGeneration:snapshot.generation,readSet:snapshot.records,records:plan.records,runtime:plan.runtime,migration,...(!snapshot.generation&&plan.previous?{previousOverride:plan.previous,restoredGeneration:plan.sourceGeneration+1}:{}),restore:{digest:b.digest,receipts:plan.receipts}});await onBoundary('activated');
  try{legacy.setItem(E4_DISCOVERY,JSON.stringify({version:1,database:this.backend.db.name,state:'ACTIVATED',digest:root}));}catch{}
  await this.worker.call({type:'reset'});return result;
 }));}
 async resumeRestore(options={}){const stage=await this.backend.restoreStage();if(!stage||stage.state!=='PREPARED')throw Error('No staged restore');return this.restore(stage.text,options);}
 async publish(id,{expectedGeneration}={}){const snapshot=await this.backend.snapshot();if(expectedGeneration!==undefined&&snapshot.generation!==expectedGeneration)throw Error('STALE_WRITER: publication source changed');const view=await this.worker.call({type:'inspect',snapshot}),f=view.state?.championshipFoundation,x=f?.instances[f.activeId];if(!x)throw Error('No authoritative active championship');const expectedRaceId=x.raceId;await this.operate('nativePrepare',{id:'e4-prepare-'+id,expectedGeneration:snapshot.generation,expectedRaceId});return this.operate('official',{id,expectedRaceId});}
}
export {E4_DISCOVERY};
