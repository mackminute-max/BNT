import {validateState} from '../state.js';import {fingerprint} from '../cycles/contracts.js';import {parseEnvelope,SAVE_KEY} from '../../persistence/envelope.js';
// Versioned financial anchor: zero-Gold controller operations do not invalidate
// the race, but every career/economic/native asset change does. Source is validated
// from the actual career envelope, never an unverified caller's serialized flag.
export function championshipAnchor(s){validateState(s);const f=s.championshipFoundation,x=f.instances?.[f.activeId];if(!x)throw Error('No active championship financial authority');return {profileId:s.profile.id,careerId:s.career.id,revision:x.registrationRevision,maintenanceRevision:x.registrationMaintenanceRevision,fingerprint:fingerprint({kind:'m2e-financial-anchor-v1',profileId:s.profile.id,career:s.career,management:s.management,cycles:s.cycles,facts:f.facts,instanceId:x.id,registrationId:x.registrationId,offer:x.offer.fingerprint,lockedSelection:x.lockedSelection})};}
export function storedChampionshipAnchor(storage){const text=storage.getItem(SAVE_KEY);if(text===null)throw Error('No durable championship career');return championshipAnchor(parseEnvelope(text).primary);}
