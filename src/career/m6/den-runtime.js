import {spectatorFatigue} from '../../presentation/spectator-fatigue.js';
import {createRace,step} from '../../sim/race.js';
import {clearedNativeResult} from '../../sim/foundation/checkpoint.js';
import {fingerprint} from '../cycles/contracts.js';
import {frameView,staticView,eventView} from '../../prototype/buffered/projection.js';
const capabilities=new WeakSet(),sources=new WeakMap();
export class DenAttempt{
 constructor(career){const s=career.current,a=s.m6.gambling.den.active;if(s.championshipFoundation.activeId||!a)throw Error('No spectator race available outside championships');this.eventId=a.eventId;this.setupHash=a.event.setupHash;this.state=createRace(a.event.setup);this.cursor=0;this.channel=null;this.fatigue=spectatorFatigue(this.state,this.eventId);this.observations=[];}
 read(career,channel){this.check(career);this.channel=channel;this.cursor=Math.max(0,this.state.events.length-100);return this.packet(true);}
 check(career){const a=career.current.m6.gambling.den.active;if(career.current.championshipFoundation.activeId||!a||a.eventId!==this.eventId||a.event.setupHash!==this.setupHash)throw Error('Spectator authority changed; reopen the parlor');}
 advance(career,{channel,tick,ticks}){this.check(career);if(channel!==this.channel||tick!==this.state.tick||!Number.isInteger(ticks)||ticks<1||ticks>200)throw Error('Stale or invalid spectator advance');for(let i=0;i<ticks&&['Ready','Running'].includes(this.state.status);i++){step(this.state);this.observations.push(...this.fatigue.sample(this.state));}return this.packet(false);}
 packet(base){const s=this.state,packet={eventId:this.eventId,frame:frameView(s),events:s.events.slice(this.cursor).map(eventView),observations:this.observations,...(base?{base:staticView(s)}:{}),durable:false,persistence:'spectator-seeded-restart-v1'};this.cursor=s.events.length;this.observations=[];if(['Ended','Stalled','Error'].includes(s.status)){try{clearedNativeResult(s);packet.clearance={cleared:true};}catch(e){packet.clearance={cleared:false,reason:e.message};}}return packet;}
 completion(career,storage){this.check(career);const raw=storage.getItem('bnt.career.save.v1');if(raw!==career.raw||career.mode!=='automatic')throw Error('Spectator durable source changed');if(fingerprint(this.state.setup)!==this.setupHash)throw Error('Spectator setup identity changed');const proof=clearedNativeResult(this.state),cap=Object.freeze({source:fingerprint(career.current),eventId:this.eventId,rows:proof.classification});capabilities.add(cap);sources.set(cap,{storage,raw});return cap;}
}
export function requireDenCompletion(cap,state){const source=sources.get(cap);if(!capabilities.has(cap)||cap.source!==fingerprint(state)||source.storage.getItem('bnt.career.save.v1')!==source.raw||cap.eventId!==state.m6.gambling.den.active?.eventId)throw Error('Trusted actual native spectator clearance required');return structuredClone(cap.rows);}
