import {createWorkerService} from './worker-service.js';
const handle=createWorkerService();let tail=Promise.resolve();
self.onmessage=event=>{const {requestId,message}=event.data;tail=tail.then(async()=>{try{self.postMessage({requestId,result:await handle(message)});}catch(e){self.postMessage({requestId,error:{name:e.name,message:e.message}});}});};
