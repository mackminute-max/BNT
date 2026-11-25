import {BUFFERED_SIGN_ACTION} from '../../ai/buffered-signs.js';
import {createRace,step,issueSign} from '../../sim/race.js';
import {RaceSessionStore} from './session-store.js';
import {ChampionshipViewer} from '../../career/championships/viewer.js';
import {activeChampionship} from '../../career/championships/controller.js';
import {clearedNativeResult} from '../../sim/foundation/checkpoint.js';
import {pack,wireHash,sealWire,unsealWire} from '../../sim/foundation/codec.js';
import {exact,id} from '../../career/legacy-state.js';
import {fingerprint} from '../../career/cycles/contracts.js';
const stateHash=s=>wireHash(pack(s));
function segmentCount(inputs,tick){let previous=0,count=0;for(const p of inputs){count+=Math.ceil((p.tick-previous)/10000)+1;previous=p.tick;}return count+Math.ceil((tick-previous)/10000);}
class MemorySession {
 constructor(setup){this.state=createRace(setup);this.record={authority:{value:{revision:0,operational:'ACTIVE'}}};this.inputs=[];this.ids=new Map();this.failed=null;}
 open(){if(this.failed)throw Error(this.failed);return {revision:this.record.authority.value.revision};}
 apply(input,{onStep=null}={}){
  this.open();exact(input,['id','expectedRevision','tick','phase','ticks','commands']);id(input.id);const a=this.record.authority.value,s=this.state,encoded=JSON.stringify(input),old=this.ids.get(input.id);
  if(old){if(old!==encoded)throw Error('Conflicting memory input identity');return {duplicate:true,durable:false};}
  if(input.expectedRevision!==a.revision||input.tick!==s.tick||!['Ready','Running'].includes(s.status))throw Error('Stale or terminal memory attempt');
  if(input.phase==='paused'){
   if(input.ticks!==0||input.commands.length!==1)throw Error('Invalid paused memory input');const c=input.commands[0];exact(c,['action',...(Object.hasOwn(c,'sign')?['sign']:[])]);
   if(!['queue','cancel','lower',BUFFERED_SIGN_ACTION,...(s.entrants.find(r=>r.id===s.playerId)?.progressionContext?.version===2?['ability']:[])].includes(c.action))throw Error('Invalid memory Sign action');
   const next=[...this.inputs,{tick:s.tick,command:structuredClone(c)}];if(segmentCount(next,s.tick)+1>1000)throw Error('Session journal limit; no input accepted');
   issueSign(s,c.action,c.sign);this.inputs=next;
  }else{
   if(input.phase!=='advance'||!Number.isInteger(input.ticks)||input.ticks<1||input.ticks>10000||input.commands.length)throw Error('Invalid memory advance');
   if(segmentCount(this.inputs,s.tick+input.ticks)>1000)throw Error('Session journal limit; progress not advanced');
   try{for(let i=0;i<input.ticks&&['Ready','Running'].includes(s.status);i++){step(s);onStep?.(s);}if(s.status==='Error')throw Error('Native integrity failure');}catch(e){this.failed='Unsaved attempt blocked: '+e.message;throw Error(this.failed);}
  }
  a.revision++;this.ids.set(input.id,encoded);if(this.ids.size>64)this.ids.delete(this.ids.keys().next().value);return {durable:false,revision:a.revision};
 }
}
export class MemoryAttempt {
 constructor(loaded,snapshot,channel){
  const x=activeChampionship(loaded.career.current);if(!x||x.phase!=='RACE_ACTIVE')throw Error('Durable frozen race birth required');const source=loaded.runner.session();source.open();
  if(fingerprint(source.state.setup)!==fingerprint(x.raceSetup))throw Error('Frozen race setup/session mismatch; validated recovery required');
  if(source.record.authority.value.operational!=='ACTIVE'||!['Ready','Running'].includes(source.state.status))throw Error('Publish or recover existing terminal authority before racing');
  this.identity=structuredClone(source.identity);this.source=source.raw;this.key=source.key;this.anchor=structuredClone(source.record.authority.value.anchor);this.generation=snapshot.generation;this.records=snapshot.records.map(row=>[...row]);this.careerFingerprint=fingerprint(loaded.career.current);this.session=new MemorySession(x.raceSetup);this.career=loaded.career;
  this.viewer=new ChampionshipViewer({session:()=>this.session},this.career);this.attemptId=channel;this.restarted=source.state.tick>0||source.state.commands.length>0;this.openCount=0;this.prepared=false;
 }
 read(channel){const packet=this.viewer.init(channel);return {...packet,durable:false,persistence:'between-races-v1',attemptId:this.attemptId,restarted:this.restarted,notice:this.openCount++?'Resumed the unsaved race in this tab. Browser closure restarts this event.':this.restarted?'Interrupted race restarted from its original seeded state; unfinished inputs were discarded.':'Starting from the original race seed. If this race was interrupted, it has restarted and unfinished progress and Signs were discarded. Closing the browser restarts this unfinished race.'};}
 execute(message){const started=performance.now();if(this.prepared)throw Error('Race already durably prepared; publish official result');const packet=this.viewer.execute(message);return {...packet,durable:false,persistence:'between-races-v1',attemptId:this.attemptId,workerMs:performance.now()-started};}
 rebase(snapshot,career){if(fingerprint(career.current)!==this.careerFingerprint||new Map(snapshot.records).get(this.key)!==this.source)throw Error('Cannot rebase changed race authority');this.generation=snapshot.generation;this.records=snapshot.records.map(row=>[...row]);}
 prepare(loaded,snapshot,resultId){
  if(snapshot.generation!==this.generation||JSON.stringify(snapshot.records)!==JSON.stringify(this.records)||fingerprint(loaded.career.current)!==this.careerFingerprint||loaded.storage.getItem(this.key)!==this.source)throw Error('STALE_WRITER: in-memory race source changed; no result published');
  this.session.open();clearedNativeResult(this.session.state);const original=JSON.parse(this.source),sourceAuthority=unsealWire(original.authority),map=new Map(loaded.map);map.delete(this.key);const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)},session=new RaceSessionStore(storage,{identity:this.identity,getCareerAnchor:()=>this.anchor,interval:10000,fallback:'birth'});session.create(this.session.state.setup);let sequence=0;
  const apply=(phase,ticks,commands=[])=>session.apply({id:'boundary-'+fingerprint([this.attemptId,++sequence]).slice(0,40),expectedRevision:session.record.authority.value.revision,tick:session.state.tick,phase,ticks,commands});
  const advance=target=>{while(session.state.tick<target){if(!['Ready','Running'].includes(session.state.status))throw Error('Attempt transcript crossed terminal boundary');apply('advance',Math.min(10000,target-session.state.tick));}};
  for(const p of this.session.inputs){advance(p.tick);apply('paused',0,[p.command]);}advance(this.session.state.tick);
  if(stateHash(session.state)!==stateHash(this.session.state))throw Error('Attempt replay mismatch; no native proof published');
  session.finalize(resultId,session.record.authority.value.revision);
  const record=structuredClone(session.record),boundary={kind:'BNT-boundary-attempt',version:1,policy:'restart-seeded-v1',attemptId:this.attemptId,sourceAuthorityHash:wireHash(original.authority),sourceRevision:sourceAuthority.revision};record.version=2;record.boundary=sealWire(boundary);record.authority=sealWire({...unsealWire(record.authority),version:2,boundaryHash:wireHash(record.boundary)});const text=JSON.stringify(record);session.decode(text);loaded.storage.setItem(this.key,text);return {resultId,tick:this.session.state.tick,journalEntries:sequence,durable:false};
 }
}
