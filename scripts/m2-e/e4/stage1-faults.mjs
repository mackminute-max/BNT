import {chromium} from 'playwright-core';import {build} from 'esbuild';import {createServer} from 'node:http';import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
const out='/workspace/deliverables/m2e-e4-stage1';const html=await readFile('dist/Blood_and_Thunder.html');const server=createServer((q,r)=>{r.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,c=await chromium.launchPersistentContext(await mkdtemp('/tmp/bnt-e4-quota-'),{executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']}),p=await c.newPage(),q=await c.newPage();const results=[];
const bundle=await build({stdin:{contents:"export {IndexedRecords,E4_DISCOVERY} from './src/persistence/e4/indexeddb.js';",resolveDir:process.cwd()},bundle:true,format:'iife',globalName:'proof',write:false});
async function check(name,fn){try{results.push({name,pass:true,result:await fn()});console.log('PASS '+name);}catch(e){results.push({name,pass:false,error:e.message});console.log('FAIL '+name+': '+e.message);}}
try{for(const page of [p,q]){await page.goto(origin);await page.addScriptTag({content:bundle.outputFiles[0].text});await page.evaluate(async()=>window.db=await proof.IndexedRecords.open({name:'two-tab-proof'}));}
 await check('two distinct browser tabs cannot both commit the same generation',async()=>{
  const write=page=>page.evaluate(async()=>{try{return await db.commit({expectedGeneration:0,readSet:[],records:[['bnt.career.save.v1','CAS-test']]});}catch(e){return {error:e.message};}}),r=await Promise.all([write(p),write(q)]);if(r.filter(x=>x.durable).length!==1)throw Error('Both tabs committed');return r;
 });
 await check('migration interrupts before commit, after activation, after witness and stale discovery',()=>p.evaluate(async()=>{
  const records=[['bnt.career.save.v1','previous-validated-by-fixture']],map=new Map(records),legacy={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
  const b=await proof.IndexedRecords.open({name:'migration-interrupt'});let denied=false;
  try{await b.migrate({legacy,records,confirmed:false,validated:true});}catch{denied=true;}if(!denied||(await b.snapshot()).generation)throw Error('Unconfirmed mutation');
  const nativeCommit=b.commit.bind(b);b.commit=()=>Promise.reject(Error('Interrupted before IDB commit'));try{await b.migrate({legacy,records,confirmed:true,validated:true});}catch{}
  if((await b.snapshot()).generation||map.has(proof.E4_DISCOVERY))throw Error('Partial pre-commit migration');b.commit=nativeCommit;
  // Database activation commits, witness write is denied: database marker alone
  // forbids fallback. Reopening discovers the committed migration.
  const deniedWitness={getItem:legacy.getItem,setItem:()=>{throw Error('Interrupted witness');}};const moved=await b.migrate({legacy:deniedWitness,records,confirmed:true,validated:true});b.close();
  const reopened=await proof.IndexedRecords.open({name:'migration-interrupt'});if((await reopened.discover(legacy)).backend!=='indexeddb')throw Error('Fallback to legacy');
  map.set(proof.E4_DISCOVERY,'witness');const duplicate=await reopened.migrate({legacy,records,confirmed:true,validated:true});if(!duplicate.duplicate)throw Error('Migration duplicated');
  const empty=await proof.IndexedRecords.open({name:'missing-migrated-db'});let stale=false;try{await empty.discover(legacy);}catch{stale=true;}if(!stale)throw Error('Missing database uses stale legacy');empty.close();reopened.close();return {denied,moved,duplicate:duplicate.duplicate,stale,legacyPreserved:map.get(records[0][0])===records[0][1]};
 }));
 await check('real IndexedDB quota enforcement through Chromium quota override preserves head',async()=>{
  const session=await c.newCDPSession(p);const override=await session.send('Storage.overrideQuotaForOrigin',{origin,quotaSize:200000});const quotaDiagnostic=await session.send('Storage.getUsageAndQuota',{origin});console.log(JSON.stringify({origin,override,quotaDiagnostic}));
  const result=await p.evaluate(async()=>{const b=await proof.IndexedRecords.open({name:'quota-real'});let error=null;try{await b.commit({expectedGeneration:0,readSet:[],records:[['bnt.career.save.v1',Array.from({length:64},()=>Array.from(crypto.getRandomValues(new Uint32Array(16384)),n=>n.toString(16)).join('')).join('')]]});}catch(e){error={name:e.name,message:e.message};}const snapshot=await b.snapshot();b.close();return {error,generation:snapshot.generation,estimate:await navigator.storage.estimate()};});await session.send('Storage.overrideQuotaForOrigin',{origin});
  if(result.error?.name!=='QuotaExceededError'||result.generation!==0)throw Error(JSON.stringify(result));return result;
 });
}finally{await writeFile(out+'/fault-browser.json',JSON.stringify(results,null,2));await c.close();await new Promise(r=>server.close(r));}
if(results.some(x=>!x.pass))process.exitCode=1;
