import {chromium} from 'playwright-core';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createUninitializedCareer} from '../src/career/state.js';
import {STARTING_PACKAGES} from '../src/career/packages.js';
import {SAVE_KEY,makeEnvelope} from '../src/persistence/envelope.js';
const out='docs/m2-b/evidence/implementation';await mkdir(out,{recursive:true});
const html=await readFile('dist/Blood_and_Thunder.html','utf8'),fileURL=pathToFileURL(resolve('dist/Blood_and_Thunder.html')).href;
const report={checks:[],errors:[],requests:[],fileLaunch:'not attempted'};
const browser=await chromium.launch({executablePath:process.env.BNT_BROWSER_PATH??'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});let server;
const check=t=>{report.checks.push(t);console.log(t);};
try {
 report.browser=browser.version();const context=await browser.newContext({viewport:{width:1440,height:1100},acceptDownloads:true}),page=await context.newPage();let answer=true;
 function observe(p){p.on('pageerror',e=>report.errors.push(e.message));p.on('request',r=>{if(!r.isNavigationRequest())report.requests.push(r.url());});p.on('dialog',async d=>{const accept=answer;answer=true;await(accept?d.accept():d.dismiss());});}observe(page);
 let mode='file',url=fileURL;await context.setOffline(true);
 try{await page.goto(fileURL);await page.waitForFunction(()=>!!window.BNT,{timeout:5000});report.fileLaunch='PASS direct file offline';}
 catch(e){report.fileLaunch=e.message.split('\n')[0];if(!e.message.includes('ERR_BLOCKED_BY_ADMINISTRATOR'))throw e;mode='http';await context.setOffline(false);server=createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));url='http://127.0.0.1:'+server.address().port;await page.goto(url);await page.waitForFunction(()=>!!window.BNT);await context.setOffline(true);}
 report.mode=mode==='file'?'direct file offline':'HTTP diagnostic origin; offline after each document load';
 async function panels(p=page){for(const id of ['developer','careerSaves','stableFoundation'])await p.locator('#'+id).evaluate(e=>e.open=true);}
 const state=async(p=page)=>JSON.parse(await p.locator('#careerSaveInspect').textContent());
 async function waitNotice(pattern,p=page){await p.waitForFunction(pattern=>new RegExp(pattern).test(document.getElementById('careerSaveNotice').textContent),pattern);}
 async function reload(){if(mode==='http')await context.setOffline(false);await page.reload();await page.waitForFunction(()=>!!window.BNT);await context.setOffline(true);await panels();}
 async function exportFile(p=page){const event=p.waitForEvent('download');await p.click('#careerExport');return JSON.parse(await readFile(await(await event).path(),'utf8'));}
 async function upload(e,p=page){await p.setInputFiles('#careerImportFile',{name:'BNT-career.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(e))});await waitNotice('Import validated',p);}
 await panels();const raceDigest=await page.evaluate(()=>window.BNT.digest(window.BNT.getState()));
 for(const [key,p] of Object.entries(STARTING_PACKAGES)) {
  const clean=createUninitializedCareer({profileId:'browser-owner',careerId:'browser-'+key});
  await page.evaluate(([key,value])=>localStorage.setItem(key,value),[SAVE_KEY,makeEnvelope(clean).text]);await reload();
  const before=await page.evaluate(k=>localStorage.getItem(k),SAVE_KEY);await page.selectOption('#stablePackage',key);assert.equal(await page.evaluate(k=>localStorage.getItem(k),SAVE_KEY),before);
  answer=false;await page.click('#stableInitialize');assert.equal((await state()).management.initialized,false);
  await page.click('#stableInitialize');await waitNotice('initialized atomically');let s=await state();assert.equal(s.career.treasury,p.gold);assert.equal(s.revision,1);assert.equal(s.career.developerEdited,false);assert.equal(s.management.initialized,true);assert.equal(await page.locator('#stableInitialize').isDisabled(),true);assert.equal(JSON.parse(await page.locator('#stableRUPreview').textContent()).eligible,true);
  const raw=await page.evaluate(k=>localStorage.getItem(k),SAVE_KEY);await reload();assert.equal(await page.evaluate(k=>localStorage.getItem(k),SAVE_KEY),raw);assert.equal((await state()).revision,1);
  check(key+': pure preview, cancelled confirmation, exact one-time grant, legal initial RU and reload without repeat grant');
 }
 const initialized=await state(),env=await exportFile(),a=Object.values(initialized.management.registries.assignments)[0];
 await page.selectOption('#stableBeastB',a.beastIds[0]);assert.equal(await page.locator('#stableAssemble').isDisabled(),true);assert.match(await page.locator('#stableRUPreview').textContent(),/two distinct beasts/);assert.equal((await state()).revision,1);check('Duplicate beast produces a visible eligibility reason without a write');
 await page.selectOption('#stableBeastB',Object.keys(initialized.management.registries.beasts)[2]);await page.selectOption('#stableDriver',Object.keys(initialized.management.registries.personnel)[1]);await page.click('#stableAssemble');await waitNotice('assembly committed');assert.equal((await state()).revision,2);assert.equal((await state()).career.treasury,750);
 await page.click('#stableDisassemble');await waitNotice('disassembled');assert.equal((await state()).revision,3);assert.deepEqual((await state()).management.registries.assignments,{});await page.click('#stableAssemble');await waitNotice('assembly committed');assert.equal((await state()).revision,4);check('Reserve reassignment, disassembly and reassembly preserve treasury and commit only prospective assignments');
 const revised=await exportFile();await reload();assert.deepEqual(await state(),revised.primary.value);await upload(env);answer=false;await page.click('#careerImportApply');assert.equal((await state()).revision,4);await page.click('#careerImportApply');await waitNotice('imported');assert.equal((await state()).revision,1);assert.equal((await state()).history.commands.length,4);check('Export/reload and confirmed older import preserve protected initialization and assignment identities');
 await page.click('#stableAssemble');await waitNotice('assembly committed');assert.equal((await state()).revision,2);check('Fresh post-import maintenance token permits a new legitimate assembly without replaying a retained operation');
 const beforeFailure=await state(),raw=await page.evaluate(k=>localStorage.getItem(k),SAVE_KEY);
 await page.evaluate(key=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('M2-B quota fixture','QuotaExceededError');return original.call(this,k,v);};},SAVE_KEY);
 await page.click('#stableDisassemble');await waitNotice('rolled back');assert.deepEqual(await state(),beforeFailure);assert.equal(await page.evaluate(k=>localStorage.getItem(k),SAVE_KEY),raw);assert.equal(await page.locator('#stableAssemble').isDisabled(),true);const manual=await exportFile();await page.click('#careerAcknowledge');await page.click('#stableDisassemble');await waitNotice('disassembled');assert.equal((await state()).revision,3);check('Failed assignment publish rolls back bytes, assets and receipts; manual export acknowledgment gates retry');
 const denied=await browser.newContext({viewport:{width:1440,height:1100},acceptDownloads:true});await denied.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Storage denial fixture','SecurityError');}}));const p=await denied.newPage();observe(p);await p.goto(url);await p.waitForFunction(()=>!!window.BNT);await denied.setOffline(true);await panels(p);await upload(manual,p);await p.click('#careerImportApply');await waitNotice('imported',p);assert.deepEqual(await state(p),manual.primary.value);assert.match(await p.locator('#careerSaveStatus').textContent(),/MANUAL/);check('Storage-denied session imports the complete initialized stable into explicit manual mode');
 const fault=await browser.newContext({viewport:{width:1440,height:1100},acceptDownloads:true}),f=await fault.newPage();observe(f);await f.goto(url);await f.waitForFunction(()=>!!window.BNT);
 const clean=createUninitializedCareer({profileId:'fault-owner',careerId:'fault-career'}),cleanRaw=makeEnvelope(clean).text;await f.evaluate(([k,v])=>localStorage.setItem(k,v),[SAVE_KEY,cleanRaw]);await f.reload();await f.waitForFunction(()=>!!window.BNT);await fault.setOffline(true);await panels(f);
 await f.evaluate(key=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('Initialization quota fixture','QuotaExceededError');return original.call(this,k,v);};},SAVE_KEY);
 await f.click('#stableInitialize');await waitNotice('rolled back',f);assert.deepEqual(await state(f),clean);assert.equal(await f.evaluate(k=>localStorage.getItem(k),SAVE_KEY),cleanRaw);await exportFile(f);await f.click('#careerAcknowledge');await f.click('#stableInitialize');await waitNotice('initialized atomically',f);assert.equal((await state(f)).career.treasury,1200);assert.equal(await f.evaluate(k=>localStorage.getItem(k),SAVE_KEY),cleanRaw);await fault.close();check('Initialization quota failure publishes no assets or history; explicit manual retry grants exactly once');
 await page.screenshot({path:out+'/stable-foundation.png',fullPage:true});assert.equal(await page.evaluate(()=>window.BNT.digest(window.BNT.getState())),raceDigest);assert.deepEqual(report.requests,[]);assert.deepEqual(report.errors,[]);check('Stable operations leave authoritative race/RNG unchanged; no page errors or runtime network requests');
 await writeFile(out+'/browser-example-save.json',JSON.stringify(revised,null,2));await denied.close();await context.close();report.functional='PASS';report.result=mode==='file'?'PASS':'FUNCTIONAL_PASS_FILE_BLOCKED';
}catch(e){report.errors.push(e.stack);report.functional='FAIL';report.result='FAIL';}
finally{await browser.close();if(server)await new Promise(r=>server.close(r));await writeFile(out+'/browser.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}
if(report.result!=='PASS')process.exitCode=1;
