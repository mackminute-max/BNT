import {Worker} from 'node:worker_threads';
import {mkdirSync,writeFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {buildJobs} from '../dangerous-racing/scenarios.mjs';
const args=process.argv.slice(2),option=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const engine=resolve(option('--engine','.')),out=option('--out','docs/combat-ai-refinement/current');mkdirSync(out,{recursive:true});
const jobs=buildJobs().filter(j=>j.setup.format==='Combat'&&Number(j.block.split('-')[0])<20);
writeFileSync(out+'/jobs.json.gz',gzipSync(JSON.stringify(jobs)));
const results=[],configs={},errors=[],start=performance.now();let next=0,cancelled=false;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>cancelled=true);
await Promise.all(Array.from({length:4},()=>new Promise((resolveDone,reject)=>{
 const worker=new Worker(new URL('./worker.mjs',import.meta.url),{workerData:{module:pathToFileURL(engine+'/scripts/dangerous-racing/measure.mjs').href},resourceLimits:{maxOldGenerationSizeMb:1024}});let timer;
 function dispatch(){if(cancelled||next===jobs.length){worker.terminate();resolveDone();return;}const job=jobs[next++];timer=setTimeout(()=>{cancelled=true;worker.terminate();reject(Error('Worker 180-second bound exceeded: '+job.id));},180000);worker.postMessage(job);}
 worker.on('message',m=>{clearTimeout(timer);if(!m.ok){errors.push(m);cancelled=true;}else {results.push(m.result);configs[m.result.configId]=m.config;}if(results.length%20===0)console.log(JSON.stringify({completed:results.length,target:jobs.length,seconds:Math.round((performance.now()-start)/1000)}));dispatch();});
 worker.on('error',e=>{clearTimeout(timer);cancelled=true;worker.terminate();reject(e);});dispatch();
})));
results.sort((a,b)=>a.id.localeCompare(b.id));writeFileSync(out+'/races.jsonl.gz',gzipSync(results.map(r=>JSON.stringify(r)).join('\n')+'\n'));writeFileSync(out+'/configurations.json.gz',gzipSync(JSON.stringify(configs)));
const summary={target:jobs.length,completed:results.length,cancelled,errors,statuses:Object.fromEntries([...new Set(results.map(r=>r.status))].map(k=>[k,results.filter(r=>r.status===k).length])),wallSeconds:(performance.now()-start)/1000};writeFileSync(out+'/execution.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));if(cancelled||errors.length||results.length!==jobs.length)process.exitCode=1;
