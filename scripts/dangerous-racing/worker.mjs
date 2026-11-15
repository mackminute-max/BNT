import {parentPort} from 'node:worker_threads';
import {executeDanger} from './measure.mjs';
parentPort.on('message',job=>{try{parentPort.postMessage({ok:true,...executeDanger(job)});}catch(error){parentPort.postMessage({ok:false,id:job.id,error:{message:error.message,stack:error.stack}});}});
