import {BufferedSession} from '../../prototype/buffered/client.js';

class CareerRPC {
 constructor(){this.seq=0;this.pending=new Map();this.ready=new Promise((resolve,reject)=>{this.timer=setTimeout(()=>reject(Error('Career connection unavailable; reopen the saved race')),15000);const listen=e=>{if(e.source!==parent||e.data?.kind!=='BNT-career-port'||e.data.token!==globalThis.__BNT_CAREER_TOKEN__||!e.ports[0])return;removeEventListener('message',listen);clearTimeout(this.timer);this.port=e.ports[0];this.port.onmessage=({data})=>{const p=this.pending.get(data.id);if(!p)return;this.pending.delete(data.id);data.error?p.reject(Error(data.error)):p.resolve(data.result);};resolve();};addEventListener('message',listen);parent.postMessage({kind:'BNT-career-connect',token:globalThis.__BNT_CAREER_TOKEN__},'*');});}
 async call(type,payload={}){await this.ready;const id=++this.seq;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.port.postMessage({id,type,payload});});}
 close(){clearTimeout(this.timer);for(const p of this.pending.values())p.reject(Error('Viewer disconnected; saved progress remains'));this.pending.clear();this.port?.close();}
}

// Same P1.5/P2.2 output protocol and BufferedSession chronology. This transport
// contains no simulation. Legacy projections are durable; P1 projections carry
// explicit matching in-memory attempt identity and never claim to be saved.
export class DurableViewerTransport {
 constructor({rpc=new CareerRPC(),schedule=fn=>setTimeout(fn,0)}={}){this.rpc=rpc;this.schedule=schedule;this.output=0;this.input=0;this.commandSeq=0;this.generation=null;this.chain=Promise.resolve();this.running=false;this.closed=false;this.commands=new Map();this.packetCache=new Map();this.beforeSignal=true;this.counter=0;this.view={tick:0,time:0};}
 emit(type,payload={}){if(this.closed)return;this.onmessage?.({data:{version:1,generation:this.generation,seq:++this.output,type,...payload}});}
 postMessage(m){if(this.closed)return;this.chain=this.chain.then(()=>this.handle(m)).catch(e=>{this.running=false;this.emit('error',{message:e.message});});}
 async handle(m){if(m.version!==1||!Number.isSafeInteger(m.seq)||m.seq<1)throw Error('Invalid viewer input sequence');if(m.seq<=this.input){if(this.packetCache.get(m.seq)!==JSON.stringify(m))throw Error('Conflicting duplicate viewer input');if(m.type==='command'&&this.commands.has(m.commandId))await this.command(m);return;}if(m.seq!==this.input+1)throw Error('Missing viewer input');this.input=m.seq;this.packetCache.set(m.seq,JSON.stringify(m));if(this.packetCache.size>32)this.packetCache.delete(this.packetCache.keys().next().value);
  if(m.type==='prepare'){if(this.generation!==null)throw Error('Career race already connected');this.generation=m.generation;const p=await this.rpc.call('read');this.persistence=p.persistence;this.attemptId=p.attemptId;this.binding=p.binding;this.setupM6=p.setup.entrants.some(e=>e.progressionContext?.version===2);this.display=p.display;this.head=p.frames.at(-1);this.view={tick:this.head.tick,time:this.head.time};this.beforeSignal=this.head.tick===0;this.cursor=p.eventCursor;this.dt=p.dt;this.emit('ready',{base:p.display?.trackName?{...p.base,track:{...p.base.track,name:p.display.trackName}}:p.base,setup:p.setup,eventCursor:p.eventCursor,dt:p.dt,changes:[]});this.deliver(p);return;}
  if(m.generation!==this.generation)throw Error('Stale viewer generation');
  if(m.type==='credit'){this.view=m.view;this.pumpSoon();}
  else if(m.type==='present-start')this.beforeSignal=false;
  else if(m.type==='run'){await this.rpc.call('metadata',{paused:false});this.running=true;this.emit('running');this.pumpSoon();}
  else if(m.type==='pause'){this.running=false;await this.rpc.call('metadata',{paused:true});this.emit('paused');}
  else if(m.type==='step'){this.running=false;this.view=m.view;const p=await this.rpc.call('advance',{view:m.view,ticks:1,id:this.nextId('step')});this.deliver(p);this.emit('stepped',{tick:this.head.tick});}
  else if(m.type==='command')await this.command(m);
  else throw Error('Unsupported career viewer command');
 }
 nextId(label){return globalThis.__BNT_CAREER_TOKEN__+'-'+label+'-'+(++this.counter);}
 pumpSoon(){if(this.scheduled||!this.running||this.closed)return;this.scheduled=true;this.schedule(()=>{this.scheduled=false;this.chain=this.chain.then(async()=>{if(!this.running||this.closed||!['Ready','Running'].includes(this.head.status))return;const dt=this.dt,missing=this.view.time+1-this.head.time;if(missing<dt*.5)return;const ticks=Math.min(20,Math.max(1,Math.ceil((missing-1e-8)/dt)));const p=await this.rpc.call('advance',{view:this.view,ticks,id:this.nextId('advance')});this.deliver(p);}).catch(e=>{this.running=false;this.emit('error',{message:e.message});});});}
 async command(m){if(!Number.isSafeInteger(m.commandId)||m.commandId<1||!['queue','cancel','lower',...(this.setupM6?['ability']:[])].includes(m.action))throw Error('Invalid career Sign request');const encoded=JSON.stringify([m.action,m.sign,m.view]),old=this.commands.get(m.commandId);if(old){if(old.encoded!==encoded){this.emit('command-status',{commandId:m.commandId,status:'rejected',conflict:true,reason:'Conflicting command identity'});return;}this.emit('command-status',old.ack);return;}
  this.emit('command-status',{commandId:m.commandId,status:'received'});const p=await this.rpc.call('sign',{id:this.nextId('sign'),view:m.view,signAction:m.action,...(m.sign===undefined?{}:{sign:m.sign}),preStart:this.beforeSignal});const c=p.command;
  if(c.accepted&&['queue','cancel'].includes(m.action))for(const previous of this.commands.values())if(previous.ack.status==='accepted-queued'){previous.ack={...previous.ack,status:m.action==='queue'?'superseded':'canceled'};this.emit('command-status',previous.ack);}
  const ack={commandId:m.commandId,status:c.accepted?(m.action==='queue'&&!c.unchanged?'accepted-queued':'accepted'):'rejected',acceptanceTick:c.acceptanceTick,acceptanceTime:c.acceptanceTime,viewTick:m.view.tick,queueOrder:c.queueOrder,remaining:c.remaining,reason:c.reason};this.commands.set(m.commandId,{encoded,ack});this.deliver(p);this.emit('command-status',ack);
 }
 deliver(p){if(p.durable!==true&&!(this.persistence==='between-races-v1'&&p.persistence===this.persistence&&p.attemptId===this.attemptId))throw Error('Race data has neither durable nor matching in-memory authority');if(JSON.stringify(p.binding)!==JSON.stringify(this.binding))throw Error('Career race binding changed');
  for(const event of p.events){if(event.type==='SIGN_ACTIVATED')for(const c of this.commands.values())if(c.ack.status==='accepted-queued'&&c.ack.queueOrder!==undefined){c.ack={...c.ack,status:event.effects.mode==='buffer-delay-v1'?'activated-delayed':'activated-normal',activationTick:event.tick,activationTime:event.time,visibleFromTick:event.presentationTick};this.emit('command-status',c.ack);break;}}
  for(let i=0;i<p.events.length;i+=64)this.emit('events',{events:p.events.slice(i,i+64)});this.cursor+=p.events.length;
  for(const frame of p.frames){this.head=frame;this.emit('frame',{frame,eventWatermark:this.cursor});}
  if(p.completion){this.running=false;for(const c of this.commands.values())if(c.ack.status==='accepted-queued'){c.ack={...c.ack,status:'not-activated',reason:'Native race ended before activation'};this.emit('command-status',c.ack);}this.emit('complete',p.completion);}
 }
 terminate(){this.closed=true;this.running=false;this.rpc.close();}
}

export class CareerBufferedSession extends BufferedSession {
 constructor(options={}){super(options,{source:'durable-career',workerFactory:()=>new DurableViewerTransport()});this.ready.then(()=>{this.display=this.worker.display;this.options={...this.options,course:this.state.track.name,weather:typeof this.setup.weather==='string'?this.setup.weather:this.state.weather?.name??'Configured weather'};},()=>{});}
}
export {CareerBufferedSession as BufferedSession};
