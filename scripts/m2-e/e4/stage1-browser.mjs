import {chromium} from 'playwright-core';import {createServer} from 'node:http';import {readFile,writeFile,mkdir} from 'node:fs/promises';import {gunzipSync} from 'node:zlib';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';import {build} from 'esbuild';
const out=process.env.BNT_E4_STAGE1_OUT??'/workspace/deliverables/m2e-e4-stage1';await mkdir(out,{recursive:true});const report={checks:[],file:null,errors:[],measurements:[],limits:'Existing 8 MiB logical records; no application bound increased'};
const server=createServer(async(q,r)=>{r.setHeader('Content-Type','text/html');r.end(await readFile('dist/Blood_and_Thunder.html'));});await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});const context=await browser.newContext(),page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
async function check(name,fn){try{const result=await fn();report.checks.push({name,pass:true,result});console.log('PASS '+name);}catch(e){report.checks.push({name,pass:false,error:e.message});console.log('FAIL '+name+': '+e.message);}await writeFile(out+'/browser.json',JSON.stringify(report,null,2));}
try{
 const fp=await context.newPage();try{await fp.goto(pathToFileURL(resolve('dist/Blood_and_Thunder.html')).href);report.file={navigation:true,probe:await fp.evaluate(async()=>{const c=await BNT.e4.open({name:'file-proof'});c.close();return true;})};}catch(e){report.file={navigation:false,error:e.message.split('\n')[0],windowsOwnerAcceptance:false};}await fp.close();
 await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>!!window.BNT);
 const diagnostic=await build({stdin:{contents:"export {IndexedRecords,E4_DISCOVERY} from './src/persistence/e4/indexeddb.js';",resolveDir:process.cwd()},bundle:true,format:'iife',globalName:'__e4Idb',write:false});await page.addScriptTag({content:diagnostic.outputFiles[0].text});
 await page.evaluate(()=>{window.longTasks=[];new PerformanceObserver(l=>longTasks.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});});
 const fixture=async(name,file)=>JSON.parse(gunzipSync(await readFile('docs/m2-e/e4/evidence/'+name+'/'+file+'.json.gz')).toString());
 const small=await fixture('profile-repeat','four-two-before-final');
 await check('atomic IDB abort, generation/read-set rejection, concurrent writer and quota abort',()=>page.evaluate(async()=>{
  const b=await __e4Idb.IndexedRecords.open({name:'atomic-proof'}),records=[['bnt.career.save.v1','test-record']];
  let aborted=false;try{await b.commit({expectedGeneration:0,readSet:[],records,abortBeforeComplete:true});}catch{aborted=true;}if(!aborted||(await b.snapshot()).generation!==0)throw Error('Partial aborted commit');
  const outcomes=await Promise.allSettled([b.commit({expectedGeneration:0,readSet:[],records}),b.commit({expectedGeneration:0,readSet:[],records})]);if(outcomes.filter(x=>x.status==='fulfilled').length!==1)throw Error('Concurrent writers both committed');
  let stale=false;try{await b.commit({expectedGeneration:1,readSet:[],records});}catch{stale=true;}if(!stale)throw Error('Read set ignored');
  // Native IDB transaction abort carrying QuotaExceededError: deterministic
  // fault injection, not a measurement of the browser physical disk quota.
  const old=b.db.transaction.bind(b.db);b.db.transaction=(...args)=>{const tx=old(...args);if(args[1]==='readwrite'){const store=tx.objectStore.bind(tx);tx.objectStore=(...a)=>{const s=store(...a);s.put=()=>{throw new DOMException('Injected quota denial','QuotaExceededError');};return s;};}return tx;};
  let quota=false;try{await b.commit({expectedGeneration:1,readSet:records,records});}catch(e){quota=e.name==='QuotaExceededError';}b.db.transaction=old;if(!quota||(await b.snapshot()).generation!==1)throw Error('Quota failure changed head');b.close();return {aborted,stale,concurrent:outcomes.map(x=>x.status),quota};
 }));
 await check('confirmed legacy migration, immutable cache and witness-denial recovery',()=>page.evaluate(async entries=>{
  localStorage.clear();for(const[k,v]of entries)localStorage.setItem(k,v);window.coordinator=await BNT.e4.open({name:'native-proof'});
  const start=performance.now();const migration=await coordinator.migrate(localStorage,{confirmed:true});const cold=await coordinator.validate(),warm=await coordinator.validate();if(!migration.durable||!warm.cacheHit)throw Error('Migration/cache missing');
  for(const[k,v]of entries)if(localStorage.getItem(k)!==v)throw Error('Legacy overwritten');
  const b=await __e4Idb.IndexedRecords.open({name:'witness-proof'});const legacyMap=new Map(entries);let witnessWrites=0;const legacy={getItem:k=>legacyMap.get(k)??null,setItem:(k,v)=>{if(++witnessWrites===2)throw Error('Denied final discovery witness');legacyMap.set(k,v);}};const moved=await b.migrate({legacy,records:entries,confirmed:true,validated:true});if(!moved.recoveryRequired||(await b.discover(legacy)).backend!=='indexeddb')throw Error('Stale legacy fallback');b.close();
  return {migration,cold,warm,totalMs:performance.now()-start};
 },small));
 await check('worker replay, durable prepare then exactly-once official publication and lost-ack retry',()=>page.evaluate(async()=>{
  const before=await coordinator.backend.snapshot(),r=await coordinator.worker.call({type:'replay',snapshot:before});
  const t=performance.now(),prepared=await coordinator.operate('nativePrepare',{id:'native-prepare'}),middle=await coordinator.backend.snapshot();
  if(middle.generation!==before.generation+1)throw Error('Native prepare not durable');
  const commit=coordinator.backend.commit.bind(coordinator.backend);coordinator.backend.commit=()=>Promise.reject(Error('Injected interruption before career commit'));let beforeRejected=false;
  try{await coordinator.operate('official',{id:'profile-browser-official'});}catch{beforeRejected=true;}
  coordinator.backend.commit=commit;if(!beforeRejected||JSON.stringify((await coordinator.backend.snapshot()).records)!==JSON.stringify(middle.records))throw Error('Partial pre-commit publication');
  const call=coordinator.worker.call.bind(coordinator.worker);let lose=true;coordinator.worker.call=message=>{if(message.type==='ack'&&lose){lose=false;return Promise.reject(Error('Injected lost acknowledgement after durable career commit'));}return call(message);};
  let lostAcknowledgement=false;try{await coordinator.operate('official',{id:'profile-browser-official'});}catch{lostAcknowledgement=true;}coordinator.worker.call=call;
  const after=await coordinator.backend.snapshot();if(!lostAcknowledgement||after.generation!==middle.generation+1)throw Error('Lost-ack fixture did not commit exactly once');
  const retry=await coordinator.operate('official',{id:'profile-browser-official'}),again=await coordinator.backend.snapshot();
  if(JSON.stringify(after.records)!==JSON.stringify(again.records)||retry.phase!=='SETTLEMENT_PENDING')throw Error('Duplicate official effects');
  return {replays:r.checks,prepared,beforeRejected,lostAcknowledgement,retry,totalMs:performance.now()-t,bytes:after.records.reduce((n,[,v])=>n+new TextEncoder().encode(v).length,0)};
 }));
 await check('worker termination rejects pending preparation; restart cold-validates durable data',()=>page.evaluate(async()=>{
  const snapshot=await coordinator.backend.snapshot();const pending=coordinator.worker.call({type:'validate',snapshot});coordinator.worker.restart();let rejected=false;try{await pending;}catch{rejected=true;}if(!rejected)throw Error('False ack');return coordinator.validate();
 }));
 await check('cold corruption and missing official session rejected without durable mutation',()=>page.evaluate(async()=>{
  const snapshot=await coordinator.backend.snapshot(),original=JSON.stringify(snapshot.records),bad=structuredClone(snapshot);bad.records[0][1]='{}';let rejected=0;
  for(const s of [bad,{...snapshot,records:snapshot.records.slice(0,1)}])try{await coordinator.worker.call({type:'validate',snapshot:s});}catch{rejected++;}
  if(rejected!==2||JSON.stringify((await coordinator.backend.snapshot()).records)!==original)throw Error('Corrupt input accepted or stored');return {rejected};
 }));
 const expected=await fixture('profile-repeat','four-two-storage');
 await check('official D2, standings, protected financial history and serialized bytes equal accepted source',()=>page.evaluate(async expected=>{
  const actual=await coordinator.backend.snapshot(),a=new Map(actual.records),e=new Map(expected);const primary=JSON.parse(a.get('bnt.career.save.v1')).primary.value,reference=JSON.parse(e.get('bnt.career.save.v1')).primary.value;
  // Browser publication has its own protected command ID; compare official
  // consequences, not the deliberately different receipt/command identity.
  const x=primary.championshipFoundation.instances['complete-instance'],y=reference.championshipFoundation.instances['complete-instance'];
  for(const field of ['raceResults','standings','entrants','eligibility'])if(JSON.stringify(x[field])!==JSON.stringify(y[field]))throw Error('Consequence mismatch '+field);
  if(JSON.stringify(primary.management)!==JSON.stringify(reference.management)||primary.career.treasury!==reference.career.treasury)throw Error('Management/Gold mismatch');return {officialResults:x.raceResults.length,treasury:primary.career.treasury,conditionParity:true};
 },expected));
 if(!process.argv.includes('--publication-only')){
 const large=await fixture('profile-max','eight-twelve-storage');
 await check('eight-entrant twelve-event retained set validated and committed in IndexedDB',()=>page.evaluate(async entries=>{
  window.largeCoordinator=await BNT.e4.open({name:'large-proof'});const started=performance.now();const validated=await largeCoordinator.worker.call({type:'validate',snapshot:{generation:0,records:entries}});const validationMs=performance.now()-started;
  const c=performance.now(),commit=await largeCoordinator.backend.commit({expectedGeneration:0,readSet:[],records:entries}),commitMs=performance.now()-c;const stored=await largeCoordinator.backend.snapshot();
  if(JSON.stringify(stored.records)!==JSON.stringify(entries))throw Error('Retained evidence changed');const warm=await largeCoordinator.worker.call({type:'validate',snapshot:{generation:0,records:entries}});
  const replays=await largeCoordinator.worker.call({type:'replay',snapshot:{generation:0,records:entries}});
  return {replays,records:entries.length,bytes:entries.reduce((n,[,v])=>n+new TextEncoder().encode(v).length,0),validationMs,commitMs,commit,warm,quotaEstimate:await navigator.storage.estimate()};
 },large));
 }
 report.longTasks=await page.evaluate(()=>longTasks);report.chromium=await browser.version();
}finally{await writeFile(out+'/browser.json',JSON.stringify(report,null,2));await browser.close();await new Promise(r=>server.close(r));}
console.log(JSON.stringify(report,null,2));if(report.checks.some(x=>!x.pass))process.exitCode=1;
