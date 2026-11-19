// Diagnostic only. Apply the DevTools origin quota before FIRST IndexedDB
// access, or account for Chromium's existing bucket-space allowance cache.
// Does not modify production code, storage limits or browser policies.
import {chromium} from 'playwright-core';
import {build} from 'esbuild';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createCareer} from '../../../../src/career/state.js';
import {makeEnvelope} from '../../../../src/persistence/envelope.js';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const QUOTA=1024*1024;
const base=[['bnt.career.save.v1',makeEnvelope(createCareer({profileId:'quota-profile',careerId:'quota-career'})).text]];
const candidate=[...base,['bnt.race.foundation.v1.'+'a'.repeat(64),'q'.repeat(2*1024*1024)]];
// The additional record is a storage-pressure fixture, not an admissible native
// race/session or gameplay result. The baseline career is a real valid envelope.
const diagnostic=await build({stdin:{contents:"export {IndexedRecords} from './src/persistence/e4/indexeddb.js';",resolveDir:process.cwd()},bundle:true,format:'iife',globalName:'quotaKernel',write:false});
async function start(){
 const html=await readFile('dist/Blood_and_Thunder.html');const server=createServer((q,r)=>{r.setHeader('Content-Type','text/html');r.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']}),context=await browser.newContext(),page=await context.newPage(),session=await context.newCDPSession(page),origin='http://127.0.0.1:'+server.address().port;
 return {browser,context,page,session,origin,async close(){await browser.close();await new Promise(r=>server.close(r));}};
}
async function init(x){await x.page.goto(x.origin);await x.page.waitForFunction(()=>!!window.BNT);await x.page.addScriptTag({content:diagnostic.outputFiles[0].text});await x.page.evaluate(async records=>{window.quotaDb=await quotaKernel.IndexedRecords.open({name:'native-quota-proof'});await quotaDb.commit({expectedGeneration:0,readSet:[],records});},base);}
async function write(x,records){return x.page.evaluate(async records=>{const previous=()=>new Promise((resolve,reject)=>{const tx=quotaDb.db.transaction('authority','readonly'),r=tx.objectStore('authority').get('previous');r.onsuccess=()=>resolve(JSON.stringify(r.result??null));r.onerror=()=>reject(r.error);});const before=await quotaDb.snapshot(),previousBefore=await previous();let acknowledged=false,error=null;try{const result=await quotaDb.commit({expectedGeneration:before.generation,readSet:before.records,records});acknowledged=result.durable===true;}catch(e){error={name:e.name,message:e.message};}const after=await quotaDb.snapshot();return {acknowledged,error,beforeGeneration:before.generation,afterGeneration:after.generation,unchanged:JSON.stringify(before)===JSON.stringify(after),previousUnchanged:previousBefore===await previous()};},records);}
export async function coldQuotaCase({quotaBytes=QUOTA,pressureBytes=2*1024*1024}={}){
 const candidate=[...base,['bnt.race.foundation.v1.'+'a'.repeat(64),'q'.repeat(pressureBytes)]];
 const x=await start();try{
  // Crucially this precedes app navigation: the app itself opens IndexedDB.
  await x.session.send('Storage.overrideQuotaForOrigin',{origin:x.origin,quotaSize:quotaBytes});const beforeFirstAccess=await x.session.send('Storage.getUsageAndQuota',{origin:x.origin});
  if(!beforeFirstAccess.overrideActive||beforeFirstAccess.quota!==quotaBytes||beforeFirstAccess.usage!==0)throw Error('Not a clean overridden origin');
  await init(x);const result=await write(x,candidate);if(result.error?.name!=='QuotaExceededError'||result.acknowledged||!result.unchanged||!result.previousUnchanged||result.afterGeneration!==1)throw Error('Cold native-quota atomicity failure '+JSON.stringify(result));
  const usage=await x.session.send('Storage.getUsageAndQuota',{origin:x.origin});
  await x.page.evaluate(()=>quotaDb.close());await x.page.reload();await x.page.addScriptTag({content:diagnostic.outputFiles[0].text});const reopened=await x.page.evaluate(async()=>{const b=await quotaKernel.IndexedRecords.open({name:'native-quota-proof'});const s=await b.snapshot();b.close();return s;});
  if(reopened.generation!==1||JSON.stringify(reopened.records)!==JSON.stringify(base))throw Error('Failed write did not preserve career across reload');
  // Remove the TEST override and retry the same exact storage candidate. This
  // tests recoverability; it does not raise an application logical-record limit.
  await x.session.send('Storage.overrideQuotaForOrigin',{origin:x.origin});await x.page.evaluate(async()=>window.quotaDb=await quotaKernel.IndexedRecords.open({name:'native-quota-proof'}));const retry=await write(x,candidate);
  if(!retry.acknowledged||retry.afterGeneration!==2)throw Error('Same-candidate retry failed '+JSON.stringify(retry));await x.page.evaluate(()=>quotaDb.close());
  return {pass:true,browser:await x.browser.version(),origin:x.origin,quotaBytes,pressureBytes,beforeFirstAccess,result,usage,reopenedGeneration:reopened.generation,retry};
 }finally{await x.close();}
}
export async function warmQuotaCase(){
 const x=await start();try{
  await init(x);await x.session.send('Storage.overrideQuotaForOrigin',{origin:x.origin,quotaSize:QUOTA});const override=await x.session.send('Storage.getUsageAndQuota',{origin:x.origin}),immediate=await write(x,candidate);
  // Reproduce the previous incorrect assumption, rather than counting this
  // admitted warm write as proof of quota rejection.
  if(!immediate.acknowledged)throw Error('Warm-cache reproduction changed: '+JSON.stringify(immediate));
  const began=Date.now();await x.page.waitForTimeout(32000);const expired=await write(x,[...candidate,['bnt.race.foundation.v1.'+'b'.repeat(64),'r'.repeat(2*1024*1024)]]);
  if(expired.error?.name!=='QuotaExceededError'||expired.acknowledged||!expired.unchanged||!expired.previousUnchanged||expired.afterGeneration!==2)throw Error('Expired-cache rejection/atomicity failed '+JSON.stringify(expired));await x.page.evaluate(()=>quotaDb.close());
  return {pass:true,origin:x.origin,override,immediate,cacheExpiryWaitMs:Date.now()-began,expired};
 }finally{await x.close();}
}
export async function main(){
 const out=process.env.BNT_E4_ACCEPTANCE_OUT??'/workspace/deliverables/m2e-e4-followup';await mkdir(out,{recursive:true});const report={scope:'Native origin-quota enforcement, not physical disk exhaustion',cold:[],warm:null,failures:[]};
 for(let i=0;i<3;i++){try{report.cold.push(await coldQuotaCase());console.log('PASS cold '+(i+1));}catch(e){report.failures.push({phase:'cold-'+(i+1),error:e.stack});console.log('FAIL cold '+(i+1),e.message);}}
 try{report.warm=await warmQuotaCase();console.log('PASS warm and expired cache');}catch(e){report.failures.push({phase:'warm',error:e.stack});console.log('FAIL warm',e.message);}
 report.pass=report.failures.length===0&&report.cold.length===3&&report.warm?.pass===true;await writeFile(out+'/quota.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)await main();
