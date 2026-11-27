import {scaleM6Awards} from '../../m6/rewards.js';
import {generateRewardOffer} from '../reward-offers.js';import {fingerprint,gold,plus} from '../../cycles/contracts.js';
export function runEligibility(x,r){const row=r.rows.find(row=>row.id===x.playerId);return !!(row?.started&&!['DNS','DQ','Disqualified','Withdrawn'].includes(row.status)&&!x.withdrawal&&r.eventIndex+1<x.offer.value.schedule.length&&x.eligibility.find(e=>e.entrantId===x.playerId)?.mayStart);}
export function legacyEligibility(x,{versioned=true}={}){const started=x.raceResults.some(r=>r.participation.some(p=>p.entrantId===x.playerId&&p.started));const complete=x.raceResults.length===x.offer.value.schedule.length;return {version:1,eligible:versioned&&started&&complete&&x.withdrawal?.kind!=='Voluntary',started,complete,voluntary:x.withdrawal?.kind==='Voluntary',reason:!versioned?'Legacy offer without E5 reward terms':!started?'No legitimate start':!complete?'Schedule incomplete':x.withdrawal?.kind==='Voluntary'?'Voluntary withdrawal':'Earned participation'};}
export function offerFor(scope,s,x,sourceId,source){return generateRewardOffer({scope,profileId:s.profile.id,careerId:s.career.id,instanceId:x.id,sourceId,sourceFingerprint:fingerprint(source)});}
export function buildEntitlements(s,x,terms){
 if(!terms)return [];
 const out=[],add=(kind,entrantId,amount,source,assetId=null)=>{gold(amount);if(amount)out.push({id:'e5-award-'+fingerprint([s.career.id,x.id,source,entrantId,kind,assetId,terms.rulesVersion]).slice(0,40),kind,entrantId,assetId,amount,source});};
 for(const r of x.raceResults){for(const row of r.rows){if(!row.started)continue;const finish=row.status==='Finished',place=finish?row.place:null;
  add('Gold',row.id,finish?((terms.purses[r.eventIndex]??terms.purses.at(-1))[place-1]??0):row.status==='DNF'&&row.classified===true?terms.dnfPurse:0,r.resultId);
  if(row.id===x.playerId){const score=rules=>rules.start+(finish?rules.finish:0)+(finish&&place<=3?rules.podium:0)+(finish&&place===1?rules.win:0);const ids=x.entrants.find(e=>e.player).assetIds;for(const id of [ids.driver,...ids.beasts])add('XP',row.id,score(terms.xp),r.resultId,id);add('Reputation',row.id,score(terms.reputation),r.resultId);}
 }}
 x.standings.forEach((row,i)=>{add('Gold',row.id,terms.placement[i]??0,'placement');if(row.id===x.playerId)add('Reputation',row.id,terms.reputation.placement[i]??0,'placement');});
 if(x.officialFinal.championId){add('Gold',x.officialFinal.championId,terms.titleGold,'title');if(x.officialFinal.championId===x.playerId)add('Reputation',x.playerId,terms.titleRep,'title');}
 if(x.m4?.loadout.includes('patron')){const base=out.filter(e=>e.kind==='Gold'&&e.entrantId===x.playerId).reduce((n,e)=>n+e.amount,0);add('Gold',x.playerId,Math.min(1000,Math.floor(base/10)),'legacy-patron');}
 if(new Set(out.map(x=>x.id)).size!==out.length)throw Error('Duplicate E5 entitlement');return scaleM6Awards(s,x,out);
}
export const sumAwards=(awards,kind,entrantId)=>awards.filter(e=>e.kind===kind&&e.entrantId===entrantId).reduce((n,e)=>plus(n,e.amount),0);
