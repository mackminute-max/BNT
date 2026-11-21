import {readFile,writeFile,unlink,mkdir} from 'node:fs/promises';import {spawnSync} from 'node:child_process';
const out='/workspace/deliverables/bnt-e5-a1/evidence/e4';await mkdir(out,{recursive:true});
let source=await readFile('scripts/m2-e/e4/stage2-browser.mjs','utf8');
source=source.replace("readFile('dist/Blood_and_Thunder.html')","readFile('dist/Blood-and-Thunder-E5-A1-Playable-Stable.html')");
const needle="await page.goto('http://127.0.0.1:'+server.address().port);";
if(source.split(needle).length!==2)throw Error('Review changed original runner seam');
source=source.replace(needle,needle+"await page.waitForSelector('#homeStable');await page.click('#hs-developer-bottom');await page.click('[data-dev=save]');");
const tmp='scripts/m2-e/e4/.e5-a-regression.mjs';await writeFile(tmp,source);let result;
try{result=spawnSync(process.execPath,[tmp],{encoding:'utf8',maxBuffer:8*1024*1024,timeout:300000,env:{...process.env,BNT_E4_STAGE2_OUT:out}});}finally{await unlink(tmp);}
await writeFile(out+'/process.log',(result.stdout??'')+(result.stderr??''));await writeFile(out+'/exit.json',JSON.stringify({exit:result.status,signal:result.signal,error:result.error?.message??null},null,2));console.log(JSON.stringify({exit:result.status,signal:result.signal}));if(result.status!==0)process.exitCode=1;
