import {defaultRuntime,validateRuntime} from './runtime.js';
// Versioned durable record coordinator. Domain records retain their original bytes
// and bounds; a completed IDB transaction, never worker preparation, is the ack.
export const E4_DB_VERSION=1;
const STORE='authority',HEAD='head',MIGRATION='migration',STAGE='migration-stage';
export const E4_DISCOVERY='bnt.e4.discovery.v1';
export const recordsDigest=async records=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(records)))),b=>b.toString(16).padStart(2,'0')).join('');
export const recordBytes=text=>new TextEncoder().encode(text).length;
export function checkRecords(records){
 if(!Array.isArray(records))throw Error('Invalid durable records');
 const seen=new Set();for(const row of records){if(!Array.isArray(row)||row.length!==2)throw Error('Invalid durable record');const[k,v]=row;if(typeof k!=='string'||!(k==='bnt.career.save.v1'||/^bnt\.race\.foundation\.v1\.[a-f0-9]{64}$/.test(k))||seen.has(k)||typeof v!=='string'||recordBytes(v)>8*1024*1024)throw Error('Invalid identity/duplicate/oversized logical record');seen.add(k);}
}
// String-pair equality is exactly the previous JSON read-set comparison for
// validated records, without allocating two escaped copies of the entire history.
export function sameRecords(a,b){return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((row,i)=>Array.isArray(row)&&Array.isArray(b[i])&&row.length===2&&b[i].length===2&&row[0]===b[i][0]&&row[1]===b[i][1]);}
const request=req=>new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('Database upgrade blocked by another tab; close older writers'));});
const finished=tx=>new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error??Error('Durable transaction aborted'));tx.onerror=()=>{};});
export class IndexedRecords {
 static async open({indexedDB=globalThis.indexedDB,name='BNT-E4-v1'}={}){
  if(!indexedDB)throw Error('IndexedDB unavailable; no automatic fallback');const r=indexedDB.open(name,E4_DB_VERSION);
  r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE);};
  const db=await request(r);db.onversionchange=()=>db.close();return new IndexedRecords(db);
 }
 constructor(db){this.db=db;}
 validateHead(head){if(head&&(head.version!==1||!Number.isSafeInteger(head.generation)||head.generation<1))throw Error('Unsupported/corrupt durable head');if(head)checkRecords(head.records);return head;}
 close(){this.db.close();}
 async snapshot(){const tx=this.db.transaction(STORE,'readonly'),done=finished(tx),s=tx.objectStore(STORE);const [head,migration,stage,restoreStage,restoreReceipts]=await Promise.all([request(s.get(HEAD)),request(s.get(MIGRATION)),request(s.get(STAGE)),request(s.get('restore-stage')),request(s.get('restore-receipts'))]);await done;this.validateHead(head);if(migration&&(!((migration.version===1&&migration.source==='web-storage')||(migration.version===2&&migration.source==='complete-restore'))||!Array.isArray(migration.recordKeys)))throw Error('Unsupported migration witness');return {recordsHash:head?.recordsHash??null,runtime:validateRuntime(head?.runtime??defaultRuntime()),restoreStage:restoreStage?{version:restoreStage.version,state:restoreStage.state,digest:restoreStage.digest,baseGeneration:restoreStage.baseGeneration}:null,restoreReceipts:restoreReceipts??[],generation:head?.generation??0,records:head?.records??[],migration:migration??null,migrationStage:stage?{version:stage.version,digest:stage.digest,state:stage.state}:null};}
 async commit({expectedGeneration,readSet,records,migration=null,stageDigest=null,recordsHash,runtime,restore=null,previousOverride,restoredGeneration,abortBeforeComplete=false}){
  checkRecords(records);checkRecords(readSet);recordsHash=recordsHash??await recordsDigest(records);if(restoredGeneration!==undefined&&(!restore||expectedGeneration!==0||!Number.isSafeInteger(restoredGeneration)||restoredGeneration<1))throw Error('Invalid restored generation');if(!Number.isSafeInteger(expectedGeneration)||expectedGeneration<0)throw Error('Invalid expected generation');
  const tx=this.db.transaction(STORE,'readwrite',{durability:'strict'}),done=finished(tx),s=tx.objectStore(STORE);
  try{const head=this.validateHead(await request(s.get(HEAD))),actual=head?.records??[];
   if((head?.generation??0)!==expectedGeneration||!sameRecords(actual,readSet))throw Error('STALE_WRITER: generation/read-set conflict');
   if(stageDigest!==null){const stage=await request(s.get(STAGE));if(!stage||stage.state!=='PREPARED'||stage.digest!==stageDigest)throw Error('Migration stage conflict');s.put({...stage,state:'ACTIVATED'},STAGE);}
   // Previous generation is retained in the same atomic transaction. No pruning
   // of journals, receipts or logical session records occurs.
   if(previousOverride!==undefined){if(previousOverride!==null)s.put(previousOverride,'previous');}else if(head)s.put(head,'previous');s.put({version:1,generation:restoredGeneration??expectedGeneration+1,records,recordsHash,runtime:validateRuntime(runtime??head?.runtime??defaultRuntime())},HEAD);
   if(restore){const stage=await request(s.get('restore-stage'));if(!stage||stage.state!=='PREPARED'||stage.digest!==restore.digest||stage.baseGeneration!==expectedGeneration)throw Error('Restore stage conflict');s.put({...stage,state:'ACTIVATED'},'restore-stage');s.put(restore.receipts,'restore-receipts');}
   if(migration!==null)s.put(migration,MIGRATION);
   if(abortBeforeComplete)throw Error('Injected pre-completion interruption');
  }catch(e){tx.abort();await done.catch(()=>{});throw e;}
  await done;return {durable:true,generation:restoredGeneration??expectedGeneration+1};
 }
 async previous(){const tx=this.db.transaction(STORE,'readonly'),done=finished(tx),head=await request(tx.objectStore(STORE).get('previous'));await done;this.validateHead(head);return head??null;}
 async restoreStage(){const tx=this.db.transaction(STORE,'readonly'),done=finished(tx),stage=await request(tx.objectStore(STORE).get('restore-stage'));await done;return stage??null;}
 async stageRestore(stage,{expectedGeneration,readSet}){const tx=this.db.transaction(STORE,'readwrite',{durability:'strict'}),done=finished(tx),s=tx.objectStore(STORE);try{const head=await request(s.get(HEAD));if((head?.generation??0)!==expectedGeneration||!sameRecords(head?.records??[],readSet))throw Error('STALE_WRITER: restore source changed');const old=await request(s.get('restore-stage'));if(old?.state==='PREPARED'&&old.digest!==stage.digest)throw Error('Another restore is pending');s.put(stage,'restore-stage');}catch(e){tx.abort();await done.catch(()=>{});throw e;}await done;return {staged:true,durable:true};}
 async discover(legacy){
  const snapshot=await this.snapshot();let witness=null;try{witness=legacy?.getItem(E4_DISCOVERY);}catch{}
  if(witness){let w;try{w=JSON.parse(witness);}catch{throw Error('RECOVERY_REQUIRED: corrupt discovery witness');}
   if(w.version!==1||w.database!==this.db.name||!['PREPARED','ACTIVATED'].includes(w.state)||!/^[a-f0-9]{64}$/.test(w.digest))throw Error('RECOVERY_REQUIRED: incompatible/foreign discovery witness');
   if(snapshot.migration?.digest&&snapshot.migration.digest!==w.digest)throw Error('RECOVERY_REQUIRED: migration witness conflict');
  }
  if(snapshot.migration)return {...snapshot,backend:'indexeddb'};
  if(snapshot.generation>0)throw Error('RECOVERY_REQUIRED: orphaned durable authority; no legacy fallback');
  if(snapshot.restoreStage?.state==='PREPARED')return {...snapshot,backend:'restore-pending'};
  if(snapshot.migrationStage){if(snapshot.migrationStage.version!==1||snapshot.migrationStage.state!=='PREPARED')throw Error('RECOVERY_REQUIRED: incompatible migration stage');return {...snapshot,backend:'migration-pending'};}
  if(witness)throw Error('RECOVERY_REQUIRED: migrated/staged database missing; stale legacy fallback forbidden');
  return {...snapshot,backend:'uninitialized'};
 }
 async migrate({legacy,records,confirmed=false,validated=false,onBoundary=()=>{}}){
  if(!confirmed||!validated)throw Error('Explicit confirmation and validated worker records required');checkRecords(records);
  // Web Storage key enumeration may change when the witness key is inserted.
  // Bind the same byte records independently of enumeration order on resume.
  records=records.map(([k,v])=>[k,v]).sort(([a],[b])=>a<b?-1:a>b?1:0);
  const old=await this.discover(legacy);if(old.migration)return {duplicate:true,...old};if(old.generation!==0)throw Error('Existing durable authority; migration cannot replace');
  for(const[k,v]of records)if(legacy.getItem(k)!==v)throw Error('Legacy changed during migration');
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(records)))),b=>b.toString(16).padStart(2,'0')).join('');
  // The staged copy is durable BEFORE the intent witness. Only this retained,
  // unactivated stage can authorize resumption. A witness with a missing DB can
  // never authorize re-import of stale legacy bytes after newer facts were lost.
  const tx=this.db.transaction(STORE,'readwrite',{durability:'strict'}),done=finished(tx),store=tx.objectStore(STORE);
  try{const [head,migration,stage]=await Promise.all([request(store.get(HEAD)),request(store.get(MIGRATION)),request(store.get(STAGE))]);
   if(head||migration)throw Error('Migration authority changed');
   if(stage&&(stage.version!==1||stage.state!=='PREPARED'||stage.digest!==digest||!sameRecords(stage.records,records)))throw Error('Conflicting staged migration');
   if(!stage)store.put({version:1,state:'PREPARED',digest,records},STAGE);
  }catch(e){tx.abort();await done.catch(()=>{});throw e;}await done;await onBoundary('staged');
  // Denial here does NOT activate a new backend. The retained stage remains
  // explicitly pending, with unchanged source saves, for a confirmed retry.
  legacy.setItem(E4_DISCOVERY,JSON.stringify({version:1,database:this.db.name,state:'PREPARED',digest}));await onBoundary('witnessed');
  for(const[k,v]of records)if(legacy.getItem(k)!==v)throw Error('Legacy changed during migration');
  const migration={version:1,source:'web-storage',recordKeys:records.map(([k])=>k),digest};
  const result=await this.commit({expectedGeneration:0,readSet:[],records,migration,stageDigest:digest});await onBoundary('activated');let discoveryPublished=false;
  try{legacy.setItem(E4_DISCOVERY,JSON.stringify({version:1,database:this.db.name,state:'ACTIVATED',digest}));discoveryPublished=true;}catch{}
  await onBoundary('discovered');return {...result,discoveryPublished,recoveryRequired:!discoveryPublished};
 }
}
