// Presentation projections only. Native event history remains intact.
export function interaction(event){
 const e=event.effects??{},ids=event.participants??[];
 const base={id:event.id,tick:event.tick,time:event.time,participants:[...ids],entityId:ids[0],source:event.type};
 if(event.type==='CONTACT')return {...base,kind:'contact',contactId:e.contactId,label:'CONTACT',color:'#ffd369'};
 if(event.type==='DAMAGE'&&Number.isFinite(e.amount)&&e.amount>0)return {...base,kind:'damage',label:`−${(e.amount<.1?e.amount.toPrecision(2):e.amount.toFixed(1))} ${e.component}`,amount:e.amount,contactId:e.contactId,color:'#ff8a79'};
 if(event.type==='ATTACK'&&typeof e.success==='boolean')return {...base,kind:e.success?'hit':'defense',entityId:e.defender??ids[1],label:e.success?'HIT':e.reacted?'DEFENDED':'ATTACK RESISTED',color:e.success?'#ffbb80':'#8bd8ff',attacker:e.attacker,defender:e.defender};
 if(event.type==='ATTACK_INVALIDATED')return {...base,kind:'invalid',label:'ATTACK NOT EXECUTED',reason:e.reason,color:'#b3bfcb'};
 if(event.type==='WRECK_IMPACT')return {...base,kind:'impact',label:'WRECK IMPACT',color:'#ffb587'};
 if(event.type==='CONTROL_CHANGED'&&e.control)return {...base,kind:'control',label:e.control==='Normal'?'CONTROL RESTORED':`CONTROL: ${e.control}`,color:e.control==='Normal'?'#86e0bd':'#f5a9f4'};
 return null;
}
export class InteractionFeed{
 constructor({limit=128,visible=12,lifetime=900}={}){if(!Number.isInteger(limit)||limit<1||!Number.isInteger(visible)||visible<1||visible>limit||!Number.isFinite(lifetime)||lifetime<=0)throw Error('Invalid interaction queue bounds');this.limit=limit;this.visible=visible;this.lifetime=lifetime;this.cursor=0;this.pending=[];this.active=[];this.total=0;this.overflow=0;this.counts={};this.lastByActor=new Map();this.lastOffenseByActor=new Map();this.lastActivationByActor=new Map();this.lastExertionByActor=new Map();}
 consume(state,{stepped=false}={}){if(this.cursor>state.events.length)throw Error('Interaction event stream replaced without reset');if(stepped&&state.events.slice(this.cursor).some(e=>interaction(e))){this.overflow+=this.pending.length;this.pending=[];this.active=[];}let added=0;for(let i=this.cursor;i<state.events.length;i++){const event=state.events[i];if(event.type==='ACTION_EXERTION')this.lastExertionByActor.set(event.participants[0],event);if(event.type==='SIGN_ACTIVATED')this.lastActivationByActor.set(event.participants[0],{id:event.id,time:event.time});const effect=interaction(event);if(!effect)continue;this.total++;added++;if(['ATTACK','ATTACK_INVALIDATED'].includes(effect.source))this.lastOffenseByActor.set(effect.attacker??effect.participants[0],effect);this.counts[effect.kind]=(this.counts[effect.kind]??0)+1;for(const id of effect.participants)this.lastByActor.set(id,effect);if(this.pending.length===this.limit){this.pending.shift();this.overflow++;}this.pending.push(effect);}this.cursor=state.events.length;if(stepped&&added)this.active=[];return added;}
 advance(ms,{paused=false}={}){if(!Number.isFinite(ms)||ms<0)throw Error('Invalid presentation elapsed time');if(!paused)this.active=this.active.map(x=>({...x,age:x.age+ms})).filter(x=>x.age<this.lifetime);while(this.active.length<this.visible&&this.pending.length)this.active.push({...this.pending.shift(),age:0});return this.active;}
 consumeBatch(events,options={}){this.cursor=0;const n=this.consume({events},options);this.cursor=0;return n;}
 status(){return {observed:this.total,visible:this.active.length,queued:this.pending.length,summarized:this.overflow,counts:{...this.counts}};}
}
export function signFeedback(state,feed){
 const r=state.entrants.find(r=>r.id===state.playerId),sign=r?.signs.active;if(!r)return 'Player RU unavailable';
 const queued=r.signs.pending?`Queued: ${r.signs.pending} — awaiting native activation. `:'';
 if(r.status!=='Racing')return queued+`RU ${r.status} — no further tactical actions${sign?` · Last active Sign: ${sign}`:''}`;
 if(!sign)return queued+`No active Sign · Current autonomous pace: ${r.pace}`;
 const recent=feed?.lastByActor.get(r.id),fresh=recent&&state.time>=recent.time&&state.time-recent.time<=2;
 const directive=r.ai?.diagnostics?.directive;if(directive&&r.ai.diagnostics.sign===sign){const d=r.ai.diagnostics,status=(r.control==='Out of Control'||r.blocked)?'Constrained':d.compliance,label=({Obeying:'Following Orders',Constrained:'Physically Constrained',Resisting:'Resisting Orders',Inapplicable:'Unable to Act'})[status]??'Awaiting execution';return queued+`${sign} — ${label} · Requested ${directive.requested} · Actual pace ${r.pace} · ${r.control==='Out of Control'?'Native loss of control requires braking':r.blocked?'Forward path blocked':d.reason??directive.reason}`;}
 if(sign==='Engage Rivals'){
  const offense=feed?.lastOffenseByActor.get(r.id),activation=feed?.lastActivationByActor.get(r.id),isRecent=offense&&(!activation||offense.id>=activation.id)&&state.time>=offense.time&&state.time-offense.time<=2;const action=isRecent?`Native attack outcome: ${offense.label}`:'Seeking Opportunity';
  return queued+`Engage Rivals — ${action} · Current autonomous pace: ${r.pace}`;
 }
 const d=r.ai?.diagnostics,position=d?.executed?.position;
 return queued+`${sign} — active instruction · Current autonomous pace: ${r.pace}${position?` · Recorded decision (tick ${d.tick}): ${position}`:''}${fresh?` · ${recent.label}`:''}`;
}
