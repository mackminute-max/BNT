import {parentPort,workerData} from 'node:worker_threads';
const {executeDanger}=await import(workerData.module);
parentPort.on('message',job=>{try{const {result,config}=executeDanger(job);parentPort.postMessage({ok:true,result,config});}catch(e){parentPort.postMessage({ok:false,id:job.id,message:e.message});}});
