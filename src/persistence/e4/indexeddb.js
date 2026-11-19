// Versioned durable record coordinator. Domain records retain their original bytes
// and bounds; a completed IDB transaction, never worker preparation, is the ack.
export const E4_DB_VERSION=1;
const STORE='authority',HEAD='head',MIGRATION='migration';
export const E4_DISCOVERY='bnt.e4.discovery.v1';
export const recordBytes=text=>new TextEncoder().encode(text).length;
export function checkRecords(records){
 if(!Array.isArray(records))throw Error('Invalid durable records');
 const seen=new Set();for(const row of records){if(!Array.isArray(row)||row.length!==2)throw Error('Invalid durable record');const[k,v]=row;if(typeof k!=='string'||!(k==='bnt.career.save.v1'||/^bnt\.race\.foundation\.v1\.[a-f0-9]{64}$/.test(k))||seen.has(k)||typeof v!=='string'||recordBytes(v)>8*1024*1024)throw Error('Invalid identity/duplicate/oversized logical record');seen.add(k);}
}
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
 async snapshot(){const tx=this.db.transaction(STORE,'readonly'),done=finished(tx),s=tx.objectStore(STORE);const [head,migration]=await Promise.all([request(s.get(HEAD)),request(s.get(MIGRATION))]);await done;this.validateHead(head);if(migration&&(migration.version!==1||migration.source!=='web-storage'||!Array.isArray(migration.recordKeys)))throw Error('Unsupported migration witness');return {generation:head?.generation??0,records:head?.records??[],migration:migration??null};}
 async commit({expectedGeneration,readSet,records,migration=null,abortBeforeComplete=false}){
  checkRecords(records);checkRecords(readSet);if(!Number.isSafeInteger(expectedGeneration)||expectedGeneration<0)throw Error('Invalid expected generation');
  const tx=this.db.transaction(STORE,'readwrite',{durability:'strict'}),done=finished(tx),s=tx.objectStore(STORE);
  try{const head=this.validateHead(await request(s.get(HEAD))),actual=head?.records??[];
   if((head?.generation??0)!==expectedGeneration||JSON.stringify(actual)!==JSON.stringify(readSet))throw Error('STALE_WRITER: generation/read-set conflict');
   // Previous generation is retained in the same atomic transaction. No pruning
   // of journals, receipts or logical session records occurs.
   if(head)s.put(head,'previous');s.put({version:1,generation:expectedGeneration+1,records},HEAD);
   if(migration!==null)s.put(migration,MIGRATION);
   if(abortBeforeComplete)throw Error('Injected pre-completion interruption');
  }catch(e){tx.abort();await done.catch(()=>{});throw e;}
  await done;return {durable:true,generation:expectedGeneration+1};
 }
 async discover(legacy){const snapshot=await this.snapshot();let witness=null;try{witness=legacy?.getItem(E4_DISCOVERY);}catch{}if(witness&&!snapshot.migration)throw Error('RECOVERY_REQUIRED: migrated database missing; stale legacy fallback forbidden');return {...snapshot,backend:snapshot.migration?'indexeddb':witness?'blocked':'uninitialized'};}
 async migrate({legacy,records,confirmed=false,validated=false}){
  if(!confirmed||!validated)throw Error('Explicit confirmation and validated worker records required');
  const old=await this.discover(legacy);if(old.migration)return {duplicate:true,...old};if(old.generation!==0)throw Error('Existing durable authority; migration cannot replace');
  // Check exact legacy bytes immediately before IDB activation. Legacy originals
  // remain untouched. The database marker is authoritative even if witness fails.
  for(const[k,v]of records)if(legacy.getItem(k)!==v)throw Error('Legacy changed during migration');
  const migration={version:1,source:'web-storage',recordKeys:records.map(([k])=>k)};
  const result=await this.commit({expectedGeneration:0,readSet:[],records,migration});let discoveryPublished=false;
  try{legacy.setItem(E4_DISCOVERY,JSON.stringify({version:1,database:this.db.name}));discoveryPublished=true;}catch{}
  return {...result,discoveryPublished,recoveryRequired:!discoveryPublished};
 }
}
