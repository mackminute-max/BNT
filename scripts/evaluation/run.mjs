import {Worker} from 'node:worker_threads';
import {createWriteStream} from 'node:fs';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {createGzip,gzipSync} from 'node:zlib';
import {pipeline} from 'node:stream/promises';
import {once} from 'node:events';
import {availableParallelism} from 'node:os';
import {buildJobs,buildSupplementJobs} from './scenarios.mjs';
import {execute,sha} from './measure.mjs';
const args=process.argv.slice(2), option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const out=option('--out','docs/phase2/data');await mkdir(out,{recursive:true});
const jobs=args.includes('--supplement')?buildSupplementJobs():buildJobs();
if(args.includes('--run-id')){
  const job=jobs.find(j=>j.id===option('--run-id'));if(!job)throw Error('Unknown run ID');
  console.log(JSON.stringify(execute(job,{includeReplay:args.includes('--replay')}),null,2));process.exit(0);
}
const limit=Number(option('--limit',jobs.length)),workers=Number(option('--workers',Math.min(4,availableParallelism())));
if(!Number.isInteger(limit)||limit<1||limit>jobs.length||!Number.isInteger(workers)||workers<1||workers>8)throw Error('Invalid limit/worker count');
const selected=jobs.slice(0,limit);
await writeFile(out+'/jobs.json.gz',gzipSync(JSON.stringify(selected)));
const catalog={},errors=[],completed=[],start=performance.now();let next=0,cancelled=false,active=0;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{cancelled=true;console.log('Cancellation requested; retaining completed races.');});
function compressed(name){const stream=createGzip();const done=pipeline(stream,createWriteStream(out+'/'+name));return {stream,done};}
const races=compressed('races.jsonl.gz'),events=compressed('events.jsonl.gz');
const csv=createWriteStream(out+'/races.csv');
const columns=['id','experiment','arm','block','format','weather','seed','configId','status','bounded','duration','winnerGap','fieldFinishSpan','officialTies','finishes','dnfs','dns','overtakes','collisions','attacks','ramContests','successfulAttacks','successfulDefenses','damage','wrecks','incidents','laneAttempts','laneSuccesses','laneRejected','controlLossEvents','checksum','wallSeconds'];
csv.write(columns.join(',')+'\n');const escape=x=>'"'+String(x??'').replaceAll('"','""')+'"';
async function save(message){
  if(!message.ok){errors.push(message);return;}
  const {result,config,eventRows}=message;
  if(catalog[result.configId]&&sha(catalog[result.configId])!==sha(config))throw Error('Configuration hash collision');
  catalog[result.configId]=config;
  if(!races.stream.write(JSON.stringify(result)+'\n'))await once(races.stream,'drain');
  for(const e of eventRows)if(!events.stream.write(JSON.stringify(e)+'\n'))await once(events.stream,'drain');
  const flat={...result,...result.race};if(!csv.write(columns.map(k=>escape(flat[k])).join(',')+'\n'))await once(csv,'drain');
  completed.push({id:result.id,format:result.format,status:result.status,bounded:result.bounded,wallSeconds:result.wallSeconds});
  if(completed.length%20===0||completed.length===selected.length){const elapsed=(performance.now()-start)/1000;
    console.log(JSON.stringify({completed:completed.length,target:selected.length,seconds:Math.round(elapsed),perMinute:Math.round(completed.length/elapsed*60),errors:completed.filter(x=>x.status==='Error').length,stalls:completed.filter(x=>x.status==='Stalled').length}));}
}
console.log(JSON.stringify({started:true,target:selected.length,workers}));
await new Promise((resolve,reject)=>{
  let remaining=workers;
  for(let i=0;i<workers;i++){
    const worker=new Worker(new URL('./worker.mjs',import.meta.url),{resourceLimits:{maxOldGenerationSizeMb:1024}});let current=null,timer;
    const stop=()=>{clearTimeout(timer);worker.terminate();if(--remaining===0)resolve();};
    function dispatch(){if(cancelled||next>=selected.length){stop();return;}current=selected[next++];active++;
      timer=setTimeout(()=>{errors.push({id:current.id,error:{message:'Worker exceeded 180 second wall-time bound'}});active--;cancelled=true;stop();},180000);
      worker.postMessage(current);
    }
    worker.on('message',async message=>{clearTimeout(timer);active--;try{await save(message);dispatch();}catch(e){cancelled=true;reject(e);worker.terminate();}});
    worker.on('error',e=>{clearTimeout(timer);errors.push({id:current?.id,error:{message:e.message}});cancelled=true;stop();});
    dispatch();
  }
});
races.stream.end();events.stream.end();csv.end();await Promise.all([races.done,events.done,once(csv,'finish')]);
await writeFile(out+'/configurations.json.gz',gzipSync(JSON.stringify(catalog)));
const summary={target:selected.length,completed:completed.length,cancelled,toolErrors:errors,countsByFormat:Object.fromEntries(['Pure','Combat'].map(f=>[f,completed.filter(x=>x.format===f).length])),
  statuses:Object.fromEntries([...new Set(completed.map(x=>x.status))].map(status=>[status,completed.filter(x=>x.status===status).length])),bounded:completed.filter(x=>x.bounded).length,workers,wallSeconds:(performance.now()-start)/1000,runs:completed};
await writeFile(out+'/execution.json',JSON.stringify(summary,null,2));console.log(JSON.stringify({done:true,...Object.fromEntries(Object.entries(summary).filter(([k])=>k!=='runs'))}));
if(errors.length||completed.length!==selected.length)process.exitCode=1;
