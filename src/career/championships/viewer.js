import {staticView,frameView,eventView} from '../../prototype/buffered/projection.js';
import {eligibleBoundary,BUFFERED_SIGN_ACTION} from '../../ai/buffered-signs.js';
import {setupFingerprint,clearedNativeResult} from '../../sim/foundation/checkpoint.js';
import {canonical} from '../../core/determinism.js';
import {activeChampionship} from './controller.js';
import {exact,id} from '../legacy-state.js';

// Ephemeral presentation references only. Exact persisted career/session bytes
// remain the authority, and cold loads still undergo all existing validation.
export class ChampionshipViewer {
 constructor(runner,career){this.runner=runner;this.career=career;this.refs=new Map();this.channel=null;this.cursor=0;this.viewTime=0;}
 session(){const session=this.runner.session();session.open();return session;}
 binding(session=this.session()){const s=this.career.current,x=activeChampionship(s);if(!x||!['RACE_ACTIVE','RACE_CLEARANCE_BLOCKED','RECOVERY_REQUIRED'].includes(x.phase))throw Error('No current championship race to view');return {version:1,profileId:s.profile.id,careerId:s.career.id,instanceId:x.id,raceId:x.raceId,eventIndex:x.raceIndex,revision:s.revision,maintenanceRevision:s.maintenanceRevision,setupHash:setupFingerprint(session.state)};}
 check(binding,channel){if(channel!==this.channel||canonical(binding)!==canonical(this.binding()))throw Error('Race changed or viewer disconnected; reopen the saved race');}
 init(channel){id(channel);const session=this.session(),s=session.state;this.channel=channel;this.refs.clear();this.viewTime=s.time;this.cursor=Math.max(0,s.events.length-200);const eventCursor=this.cursor;const packet={binding:this.binding(session),base:structuredClone(staticView(s)),setup:structuredClone(s.setup),eventCursor,dt:s.config.dt,frames:[],events:[]};this.capture(s,packet,session.record.authority.value.revision);this.complete(s,packet);return packet;}
 capture(s,packet,revision=0){const f=frameView(s,revision);this.refs.set(f.tick,{time:f.time});while(this.refs.size>64)this.refs.delete(this.refs.keys().next().value);packet.events.push(...s.events.slice(this.cursor).map(e=>({...structuredClone(eventView(e)),presentationTick:s.tick})));this.cursor=s.events.length;packet.frames.push(f);}
 complete(s,packet){if(['Ended','Stalled','Error'].includes(s.status)){let clearance;try{clearance={cleared:true,...clearedNativeResult(s)};}catch(e){clearance={cleared:false,reason:e.message};}packet.completion={tick:s.tick,time:s.time,clearance};}}
 checkView(s,v){const ref=this.refs.get(v?.tick);if(!ref||!Number.isFinite(v.time)||v.time<this.viewTime-1e-9||v.time<ref.time-1e-9||v.time>ref.time+s.config.dt+1e-9||v.time>s.time+1e-9||s.time-v.time>2+s.config.dt)throw Error('Stale or invalid presented reference; reopen at the saved race state');this.viewTime=v.time;}
 execute(message){this.check(message.binding,message.channel);const session=this.session(),s=session.state;this.checkView(s,message.view);const packet={binding:this.binding(session),frames:[],events:[]};
  if(message.action==='advance'){
   if(!Number.isInteger(message.ticks)||message.ticks<1||message.ticks>20||s.time-message.view.time+message.ticks*s.config.dt>2+s.config.dt+1e-9)throw Error('Invalid bounded viewer advance');
   session.apply({id:message.id,expectedRevision:session.record.authority.value.revision,tick:s.tick,phase:'advance',ticks:message.ticks,commands:[]},{onStep:n=>this.capture(n,packet)});
  }else if(message.action==='sign'){
   if(activeChampionship(this.career.current).withdrawal)throw Error('Withdrawn player cannot control rivals');
   if(!['queue','cancel','lower',...(s.entrants.find(r=>r.id===s.playerId)?.progressionContext?.version===2?['ability']:[])].includes(message.signAction))throw Error('Invalid viewer Sign action');
   const order=s.commands.length,eventStart=s.events.length;
   session.apply({id:message.id,expectedRevision:session.record.authority.value.revision,tick:s.tick,phase:'paused',ticks:0,commands:[{action:message.signAction,...(message.sign===undefined?{}:{sign:message.sign})}]});
   const accepted=session.state.events.slice(eventStart).some(e=>e.type==='ABILITY_QUEUED'||e.type==='SIGN_UNCHANGED'||e.type==='SIGN_QUEUED'||e.type==='SIGN_CANCELED'||e.type==='SIGN_LOWERED');
   if(accepted&&message.signAction==='queue'&&s.entrants.find(r=>r.id===s.playerId)?.progressionContext?.version!==2){
    const n=session.state,first=eligibleBoundary(n,{viewTick:message.view.tick,viewTime:message.view.time,preStart:message.preStart===true});
    if(first)session.apply({id:message.id+'-delay',expectedRevision:session.record.authority.value.revision,tick:n.tick,phase:'paused',ticks:0,commands:[{action:BUFFERED_SIGN_ACTION,sign:{version:1,sign:message.sign,queueOrder:order,viewTick:message.view.tick,viewTime:message.view.time,boundaryEventId:first.id,preStart:message.preStart===true}}]});
   }
   this.capture(session.state,packet,session.record.authority.value.revision);
   packet.command={accepted,...(s.entrants.find(r=>r.id===s.playerId)?.progressionContext?.version===2?{unchanged:session.state.events.slice(eventStart).some(e=>e.type==='SIGN_UNCHANGED')} : {}),queueOrder:order,remaining:session.state.entrants.find(e=>e.id===session.state.playerId)?.signs.remaining,acceptanceTick:session.state.tick,acceptanceTime:session.state.time,reason:accepted?null:session.state.events.at(-1)?.effects?.reason??'Native command rejected'};
  }else throw Error('Unknown career viewer operation');
  this.complete(session.state,packet);return packet;
 }
}
