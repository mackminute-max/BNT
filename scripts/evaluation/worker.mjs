import {parentPort} from 'node:worker_threads';
import {execute} from './measure.mjs';
parentPort.on('message',job=>{
  try{parentPort.postMessage({ok:true,...execute(job)});}
  catch(error){parentPort.postMessage({ok:false,id:job.id,error:{name:error.name,message:error.message,stack:error.stack}});}
});
