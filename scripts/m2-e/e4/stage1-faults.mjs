import {chromium} from 'playwright-core';import {build} from 'esbuild';import {createServer} from 'node:http';import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
const out=process.env.BNT_E4_STAGE1_OUT??'/workspace/deliverables/m2e-e4-stage1';const html=await readFile('dist/Blood_and_Thunder.html');const server=createServer((q,r)=>{r.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,c=await chromium.launchPersistentContext(await mkdtemp('/tmp/bnt-e4-quota-'),{executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']}),p=await c.newPage(),q=await c.newPage();const results=[];
const bundle=await build({stdin:{contents:"export {IndexedRecords,E4_DISCOVERY} from './src/persistence/e4/indexeddb.js';",resolveDir:process.cwd()},bundle:true,format:'iife',globalName:'proof',write:false});
async function check(name,fn){try{results.push({name,pass:true,result:await fn()});console.log('PASS '+name);}catch(e){results.push({name,pass:false,error:e.message});console.log('FAIL '+name+': '+e.message);}}
try{for(const page of [p,q]){await page.goto(origin);await page.addScriptTag({content:bundle.outputFiles[0].text});await page.evaluate(async()=>window.db=await proof.IndexedRecords.open({name:'two-tab-proof'}));}
 await check('two distinct browser tabs cannot both commit the same generation',async()=>{
  const write=page=>page.evaluate(async()=>{try{return await db.commit({expectedGeneration:0,readSet:[],records:[['bnt.career.save.v1','CAS-test']]});}catch(e){return {error:e.message};}}),r=await Promise.all([write(p),write(q)]);if(r.filter(x=>x.durable).length!==1)throw Error('Both tabs committed');return r;
 });
 await check('migration interruption at every durable boundary; denied intent and missing database never fall back',()=>p.evaluate(async()=>{
  const records=[['bnt.career.save.v1','previous-validated-by-fixture']],rows=[];
  for(const boundary of ['staged','witnessed','activated','discovered']){
   const map=new Map(records),legacy={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)},name='migration-'+boundary;
   let b=await proof.IndexedRecords.open({name}),failed=false;
   try{await b.migrate({legacy,records,confirmed:true,validated:true,onBoundary:where=>{if(where===boundary)throw Error('Injected interruption at '+where);}});}catch{failed=true;}
   if(!failed)throw Error('Fault did not execute');b.close();b=await proof.IndexedRecords.open({name});const discovered=await b.discover(legacy);
   if(['staged','witnessed'].includes(boundary)&&discovered.backend!=='migration-pending')throw Error('Missing pending migration');
   if(['activated','discovered'].includes(boundary)&&discovered.backend!=='indexeddb')throw Error('Lost activated authority');
   const resumed=await b.migrate({legacy,records,confirmed:true,validated:true});if((await b.snapshot()).generation!==1||map.get(records[0][0])!==records[0][1])throw Error('Repeated migration or changed legacy');
   rows.push({boundary,backend:discovered.backend,duplicate:resumed.duplicate??false});b.close();
   if(boundary==='witnessed'){await new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase(name);r.onsuccess=resolve;r.onerror=()=>reject(r.error);});const lost=await proof.IndexedRecords.open({name});let denied=false;try{await lost.migrate({legacy,records,confirmed:true,validated:true});}catch{denied=true;}if(!denied)throw Error('Same-name database loss replayed stale legacy');lost.close();}
   if(map.has(proof.E4_DISCOVERY)){const missing=await proof.IndexedRecords.open({name:'missing-'+boundary});let rejected=false;try{await missing.migrate({legacy,records,confirmed:true,validated:true});}catch{rejected=true;}if(!rejected)throw Error('Database loss re-imported stale legacy');missing.close();}
  }
  const map=new Map(records);let denied=true;const legacy={getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(denied)throw Error('Intent denied');map.set(k,v);}},b=await proof.IndexedRecords.open({name:'intent-denial'});let rejected=false;try{await b.migrate({legacy,records,confirmed:true,validated:true});}catch{rejected=true;}
  if(!rejected||(await b.snapshot()).generation!==0||(await b.discover(legacy)).backend!=='migration-pending')throw Error('Denied intent activated backend');denied=false;await b.migrate({legacy,records,confirmed:true,validated:true});b.close();return {rows,intentDeniedWithoutActivation:rejected};
 }));
 await check('migration retry is independent of Web Storage key enumeration order',()=>p.evaluate(async()=>{
  const rows=[['bnt.race.foundation.v1.'+'a'.repeat(64),'synthetic-session'],['bnt.career.save.v1','synthetic-career']],map=new Map(rows),legacy={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)},b=await proof.IndexedRecords.open({name:'migration-key-order'});
  try{await b.migrate({legacy,records:rows,confirmed:true,validated:true,onBoundary:w=>{if(w==='staged')throw Error('Pause staging');}});}catch{}
  await b.migrate({legacy,records:[...rows].reverse(),confirmed:true,validated:true});const s=await b.snapshot();b.close();if(s.generation!==1||s.records[0][0]!=='bnt.career.save.v1')throw Error('Enumeration order changes migration identity');return {generation:s.generation,canonicalOrder:s.records.map(([k])=>k)};
 }));
 // A warm bucket can retain an earlier allowance for 30 seconds. Override
 // a separate fresh origin BEFORE app navigation/first IndexedDB access.
 // Keep the native QuotaExceededError and unchanged-generation assertions;
 // the helper additionally checks the prior head, reload, and exact retry.
 await check('real IndexedDB quota enforcement on a cold origin preserves head',async()=>{
  const {coldQuotaCase}=await import('./acceptance/quota.mjs');
  return coldQuotaCase({quotaBytes:200000,pressureBytes:8*1024*1024});
 });
}finally{await writeFile(out+'/fault-browser.json',JSON.stringify(results,null,2));await c.close();await new Promise(r=>server.close(r));}
if(results.some(x=>!x.pass))process.exitCode=1;
