import {chromium} from 'playwright-core';
import {readFileSync,writeFileSync} from 'node:fs';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {createRace,step,capture} from '../../src/sim/race.js';
import {tacticalScenario} from './scenarios.mjs';
const browser=await chromium.launch({executablePath:process.env.BNT_BROWSER_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']}),report={checks:[],errors:[],requests:[],fileLaunch:null};let server;
try{
 const context=await browser.newContext(),page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 const html=readFileSync('dist/Blood_and_Thunder.html','utf8');await context.setOffline(true);
 try{await page.goto(pathToFileURL(resolve('dist/Blood_and_Thunder.html')).href);await page.waitForFunction(()=>!!window.BNT);report.fileLaunch='passed offline';}
 catch(e){if(!e.message.includes('ERR_BLOCKED_BY_ADMINISTRATOR'))throw e;report.fileLaunch='blocked by administrator; HTTP diagnostic only';await context.setOffline(false);server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>!!window.BNT);}
 page.on('request',r=>report.requests.push(r.url()));
 for(const kind of ['weapon','ram','unsafe-ram','damaged','race-on']){const setup=tacticalScenario(kind),s=createRace(setup);for(let i=0;i<40;i++)step(s);const actual=await page.evaluate(setup=>{const s=window.BNT.createRace(setup);for(let i=0;i<40;i++)window.BNT.step(s);return window.BNT.capture(s);},setup);assert.deepEqual(actual,capture(s));report.checks.push(kind+': exact bundled/headless event/state/checkpoint parity');}
 await page.locator('#developer > summary').click();
 await page.selectOption('#parameterGroup','utility');const fields=await page.locator('#parameterField option').allTextContents();assert.ok(fields.includes('combatSelfRisk'));assert.ok(fields.includes('combatControlRisk'));report.checks.push('New combat coefficients are exposed in existing utility developer editor');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.requests,[]);report.checks.push('No page errors or extra runtime requests');report.result='functional checks passed';
}catch(e){report.result='FAIL';report.errors.push(e.stack);process.exitCode=1;}finally{await browser.close();if(server)await new Promise(r=>server.close(r));writeFileSync('docs/combat-ai-refinement/evidence/combat-browser.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
