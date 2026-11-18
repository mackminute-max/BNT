import {id} from '../legacy-state.js';
import {gold,fingerprint} from '../cycles/contracts.js';
export function championshipClassification(proof){
 const e=proof.championshipEvidence;if(!e||e.version!==1)throw Error('Missing authoritative championship participation/progress evidence');
 const progress=new Map(e.progress.map(x=>[x.id,x]));
 const finish=proof.classification.filter(x=>x.status==='Finished').map(x=>({...x,nativeStatus:x.status,started:e.starters.includes(x.id)}));
 const rest=proof.classification.filter(x=>x.status!=='Finished').map(x=>({...x,nativeStatus:x.status,status:x.status==='Retired'?'DNF':x.status,started:e.starters.includes(x.id)}));
 const dnfs=rest.filter(x=>x.status==='DNF').sort((a,b)=>(b.completedLaps-a.completedLaps)||(b.progress-a.progress)||first(a)-first(b)||(a.id<b.id?-1:1));
 function first(x){const p=progress.get(x.id);if(!p||p.progress!==x.progress||!Number.isFinite(p.firstTime))throw Error('Missing first-reached DNF progress');return p.firstTime;}
 let cursor=0;for(let i=0;i<rest.length;i++)if(rest[i].status==='DNF')rest[i]=dnfs[cursor++];
 return [...finish,...rest];
}
export function raceAwardEffects(rows,rules,{careerId,instanceId,raceId}){
 id(careerId);id(instanceId);id(raceId);const seen=new Set();return rows.map(row=>{if(seen.has(row.id))throw Error('Duplicate classification identity');seen.add(row.id);if(row.status==='Finished'&&(!row.started||!Number.isInteger(row.place)||row.place<1))throw Error('Invalid official finishing participation/place');const points=row.status==='Finished'?(rules.points[row.place-1]??0):row.status==='DNF'&&row.started&&row.classified===true?rules.dnfPoints:0;gold(points);return {entrantId:row.id,points,finishPlace:row.status==='Finished'?row.place:null,win:row.status==='Finished'&&row.place===1,pendingEntitlementId:row.started?'e2-claim-'+fingerprint([careerId,instanceId,raceId,row.id,'placement']).slice(0,48):null};});
}
export function standings(entrantIds,races){
 const rows=entrantIds.map(id=>({id,points:0,places:{},lastRank:Number.MAX_SAFE_INTEGER}));
 for(const race of races)for(const [rank,r] of race.rows.entries()){const row=rows.find(x=>x.id===r.id),effect=race.effects.find(x=>x.entrantId===r.id);if(!row||!effect)throw Error('Unknown standings entrant');row.points+=effect.points;gold(row.points);if(r.status==='Finished')row.places[r.place]=(row.places[r.place]??0)+1;row.lastRank=r.status==='Finished'?r.place:rank+1;}
 return rows.sort((a,b)=>{let d=b.points-a.points;if(d)return d;for(let p=1;p<=entrantIds.length;p++){d=(b.places[p]??0)-(a.places[p]??0);if(d)return d;}return a.lastRank-b.lastRank||(a.id<b.id?-1:1);});
}
export function titleCandidate(ordered,lastRace){const eligible=ordered.filter(x=>lastRace.some(r=>r.id===x.id&&r.started&&!['DNS','Disqualified','Withdrawn'].includes(r.status)));return eligible[0]?.id??null;}
