import {championshipAnchor} from './anchor.js';
import {RaceSessionStore} from '../../persistence/race/session-store.js';import {unpack,unsealWire,wireHash} from '../../sim/foundation/codec.js';import {fingerprint} from '../cycles/contracts.js';import {canonical} from '../../core/determinism.js';import {freeze} from '../assets.js';
const trusted=new WeakSet();
export function createClearanceTransfer(session,state){
 if(!(session instanceof RaceSessionStore)||session.mode!=='automatic')throw Error('Durable authoritative race session required');
 const raw=session.storage.getItem(session.key);if(raw!==session.raw)throw Error('Race authority changed');const d=session.decode(raw),a=d.a,x=state.championshipFoundation.instances?.[state.championshipFoundation.activeId];
 if(!x||x.phase!=='RACE_ACTIVE'||a.operational!=='RESULT_COMMITTED'||canonical(a.anchor)!==canonical(championshipAnchor(state))||a.identity.instanceId!==x.id||a.identity.raceId!==x.raceId||fingerprint(d.s.setup)!==fingerprint(x.raceSetup))throw Error('Clearance/career setup authority mismatch');
 const candidate=unpack(unsealWire(d.r.publication)),reference={version:1,storageKey:session.key,identityFingerprint:wireHash(a.identity),revision:a.revision,watermark:a.watermark,authorityHash:wireHash(d.r.authority)};
 const transfer=freeze({reference,candidate,setupFingerprint:fingerprint(d.s.setup),careerFingerprint:fingerprint(state)});trusted.add(transfer);return transfer;
}
export function requireClearanceTransfer(transfer,payload,state){if(!trusted.has(transfer)||transfer.careerFingerprint!==fingerprint(state)||canonical(transfer.reference)!==canonical(payload.reference)||canonical(transfer.candidate)!==canonical(payload.candidate)||transfer.setupFingerprint!==payload.setupFingerprint)throw Error('Trusted durable clearance transfer required');}

export function createBirthTransfer(session,state){
 if(!(session instanceof RaceSessionStore)||session.mode!=='automatic')throw Error('Durable race birth required');const raw=session.storage.getItem(session.key);if(raw!==session.raw)throw Error('Race birth authority changed');const d=session.decode(raw),x=state.championshipFoundation.instances[state.championshipFoundation.activeId];if(x.phase!=='RACE_START_PENDING'||d.s.status!=='Ready'||d.s.tick!==0||d.a.watermark!==0||d.a.identity.raceId!==x.raceId||d.a.identity.instanceId!==x.id||fingerprint(d.s.setup)!==fingerprint(x.raceSetup)||canonical(d.a.anchor)!==canonical(championshipAnchor(state)))throw Error('Invalid race birth proof');const reference={version:1,storageKey:session.key,identityFingerprint:wireHash(d.a.identity),revision:d.a.revision,watermark:0,authorityHash:wireHash(d.r.authority)};const transfer=freeze({kind:'birth',reference,careerFingerprint:fingerprint(state)});trusted.add(transfer);return transfer;
}
export function requireBirthTransfer(transfer,payload,state){if(!trusted.has(transfer)||transfer.kind!=='birth'||transfer.careerFingerprint!==fingerprint(state)||canonical(transfer.reference)!==canonical(payload.reference))throw Error('Trusted race birth capability required');}
