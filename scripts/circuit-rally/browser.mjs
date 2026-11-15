import {chromium} from 'playwright-core';import {readFileSync,writeFileSync} from 'node:fs';import {createServer} from 'node:http';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';import {gzipSync} from 'node:zlib';import assert from 'node:assert/strict';
import {createRace,run,capture,issueSign} from '../../src/sim/race.js';import {coursePresets} from '../../src/track/course.js';
const out='docs/circuit-rally/evidence',html=readFileSync('dist/Blood_and_Thunder.html','utf8'),browser=await chromium.launch({executablePath:process.env.BNT_BROWSER_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']}),report={checks:[],errors:[],requests:[]};let server;
try{
 const context=await browser.newContext({viewport:{width:1500,height:1000}}),page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));await context.setOffline(true);
 try{await page.goto(pathToFileURL(resolve('dist/Blood_and_Thunder.html')).href);await page.waitForFunction(()=>!!window.BNT);report.file='passed offline';}
 catch(e){if(!e.message.includes('ERR_BLOCKED_BY_ADMINISTRATOR'))throw e;report.file='blocked by administrator; HTTP diagnostics only';await context.setOffline(false);server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>!!window.BNT);}
 page.on('request',r=>report.requests.push(r.url()));
 for(const preset of ['oval',...Object.keys(coursePresets)]){
  const kind=preset==='oval'?'Oval':coursePresets[preset].kind;
  await page.selectOption('#raceKind',kind);await page.selectOption('#trackPreset',preset);await page.fill('#seed','701');if(kind!=='Rally')await page.fill('#lapCount','1');await page.selectOption('#format','Pure');await page.click('#reset');
  const setup=await page.evaluate(()=>window.BNT.getState().setup);assert.equal(setup.course?.id??'oval',preset);assert.ok((await page.locator('.legend').textContent()).includes(kind));
  if(kind==='Rally'){assert.equal(await page.locator('#progressHeading').textContent(),'Course %');assert.match(await page.locator('#standingsNote').textContent(),/terminal/);assert.equal(await page.locator('#lapCount').isDisabled(),true);assert.match(await page.locator('#signStatus').textContent(),/Next checkpoint: CP1/);}
  await page.selectOption('#sign','Push the Pace');await page.click('#queueSign');
  await page.screenshot({path:out+'/'+preset+'-grid.png',fullPage:true});
  await page.click('#step');assert.equal(await page.evaluate(()=>window.BNT.getState().tick),1);
  await page.click('#complete');await page.waitForFunction(()=>['Ended','Stalled','Error'].includes(window.BNT.getState().status),undefined,{timeout:120000});
  const actual=await page.evaluate(()=>window.BNT.capture(window.BNT.getState())),expected=createRace(setup);issueSign(expected,'queue','Push the Pace');run(expected);assert.deepEqual(actual,capture(expected));assert.equal(actual.status,'Ended');
  assert.ok(actual.events.some(e=>e.type==='RU_FINISHED'));if(kind==='Rally')assert.equal(actual.events.filter(e=>e.type==='CHECKPOINT_CROSSED').length,24);
  writeFileSync(out+'/browser-'+preset+'.replay.json.gz',gzipSync(JSON.stringify(actual)));
  await page.screenshot({path:out+'/'+preset+'-results.png',fullPage:true});
  report.checks.push(preset+': UI selection/grid/step/sign/finish, terrain/checkpoint display and exact browser/Node parity');
 }
 // Verify validated custom configuration rejection does not overwrite a working track.
 await page.locator('#developer > summary').click();const before=await page.evaluate(()=>window.BNT.getState().setup);const invalid=JSON.parse(await page.locator('#setupJSON').inputValue());invalid.setup.course.checkpoints[0].distance=-1;await page.fill('#setupJSON',JSON.stringify(invalid));await page.click('#applySetup');assert.deepEqual(await page.evaluate(()=>window.BNT.getState().setup),before);assert.match(await page.locator('#developerStatus').textContent(),/checkpoint/);report.checks.push('Invalid course checkpoint rejects and preserves current valid configuration');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.requests,[]);report.checks.push('No page errors or extra runtime resource requests');report.result='functional checks passed';
}catch(e){report.errors.push(e.stack);report.result='FAIL';process.exitCode=1;}finally{await browser.close();if(server)await new Promise(r=>server.close(r));writeFileSync(out+'/course-browser.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
