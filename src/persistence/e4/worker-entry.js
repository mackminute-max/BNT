import {recordTransport} from '../m5/record-transport.js';
import {createWorkerService} from './worker-service.js';
const send=recordTransport(),receive=recordTransport();
const handle=createWorkerService();let tail=Promise.resolve();
self.onmessage=event=>{const {requestId,message,transport}=event.data;tail=tail.then(async()=>{try{const result=await handle(transport?receive.decode(message):message);self.postMessage({requestId,transport,result:transport?send.encode(result):result});}catch(e){self.postMessage({requestId,error:{name:e.name,message:e.message}});}});};
