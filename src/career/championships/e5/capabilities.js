import {nativeSettlementState} from '../../m6/schema.js';
import {SAVE_KEY,parseEnvelope} from '../../../persistence/envelope.js';
import {RaceSessionStore} from '../../../persistence/race/session-store.js';
import {wireHash} from '../../../sim/foundation/codec.js';
import {fingerprint} from '../../cycles/contracts.js';
const trusted=new WeakSet(),sources=new WeakMap();
// Not a public UI producer. It revalidates durable career and each retained
// native official authority. Worker preparation still is not durable publication.
export function createSettlementCapability(career,storage){
 const raw=storage.getItem(SAVE_KEY);if(career.mode!=='automatic'||career.raw!==raw)throw Error('Durable settlement source changed');
 const state=parseEnvelope(raw).primary;if(![6,7,8].includes(state.schema)||fingerprint(state)!==fingerprint(career.current))throw Error('Invalid settlement career authority');
 const x=state.championshipFoundation.instances[state.championshipFoundation.activeId];if(!x||x.phase!=='SETTLEMENT_PENDING'||x.raceResults.length!==x.offer.value.schedule.length)throw Error('Complete frozen schedule required');
 const records=[];for(const result of x.raceResults){if(result.kind==='NoStarters')continue;const text=storage.getItem(result.reference.storageKey);if(!text)throw Error('Missing official native session authority');const session=new RaceSessionStore(storage,{identity:result.proof.identity,getCareerAnchor:()=>result.anchor});const d=session.decode(text);if(d.a.operational!=='RESULT_COMMITTED'||wireHash(d.r.authority)!==result.reference.authorityHash||d.a.identity.raceId!==result.raceId)throw Error('Corrupt/conflicting official native authority');records.push([result.reference.storageKey,text]);}
 const cap=Object.freeze({source:fingerprint(state),instanceId:x.id});trusted.add(cap);sources.set(cap,{storage,raw,records,...(state.schema===8?{nativeSource:fingerprint(nativeSettlementState(state))}:{})});return cap;
}
export function requireSettlementCapability(cap,state){const source=sources.get(cap);if(!trusted.has(cap)||!source||(cap.source!==fingerprint(state)&&source.nativeSource!==fingerprint(state))||source.storage.getItem(SAVE_KEY)!==source.raw||source.records.some(([k,v])=>source.storage.getItem(k)!==v))throw Error('Trusted live E5 terminal capability required');}
