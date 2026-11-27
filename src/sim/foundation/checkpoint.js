import {combatLedger} from '../grudges.js';
import {validateM6Entrant} from '../m6-interaction.js';
import {validateAffinityContext} from '../../model/affinity.js';
import {validateCoaching} from '../../ai/coaching.js';
import {validateEndowments} from '../endowments.js';
import {canonical} from '../../core/determinism.js';
import {createRace,assertState,classification} from '../race.js';
import {VERSION,config} from '../../config/config.js';
import {derive} from '../../model/ru.js';
import {exact,id} from '../../career/legacy-state.js';
import {pack,unpack,sealWire,unsealWire,wireHash} from './codec.js';
export const RACE_STATE_VERSION='m2e-race-state-v1';
export const CHAMPIONSHIP_RACE_STATE_VERSION='m2e-race-state-v2';
export const AFFINITY_RACE_STATE_VERSION='m5-race-state-v3';
const stateProtocol=s=>s.entrants.some(r=>r.affinityContext)?AFFINITY_RACE_STATE_VERSION:s.championshipContext||s.entrants.some(r=>r.coachingContext||r.progressionContext)?CHAMPIONSHIP_RACE_STATE_VERSION:RACE_STATE_VERSION;
export function validateRaceBoundary(s){
  if(!s||s.version!==VERSION||s.resolving!==false||!['Ready','Running','Ended','Stalled'].includes(s.status)||!Number.isSafeInteger(s.tick)||s.tick<0||s.tick>1000000||!Number.isFinite(s.time)||s.time<0)throw Error('Invalid/incompatible resolved race boundary');
  const initial=createRace(s.setup);exact(s,Object.keys(initial),'full race state');
  if(s.seed!==initial.seed||s.rng.algorithm!==initial.rng.algorithm||!Number.isSafeInteger(s.rng.draws)||s.rng.draws<0||wireHash(pack(s.initialRng))!==wireHash(pack(initial.initialRng)))throw Error('Invalid RNG identity/state');
  config(s.config);
  if(s.entrants.length!==initial.entrants.length||new Set(s.entrants.map(r=>r.id)).size!==s.entrants.length||s.entrants.some(r=>!initial.entrants.some(e=>e.id===r.id)||r.id!==r.ru.id))throw Error('Invalid checkpoint entrant identity');
  if(!Array.isArray(s.events)||!Array.isArray(s.commands)||!Array.isArray(s.pendingImpacts)||!Array.isArray(s.pendingOverrides)||!Array.isArray(s.checkpoints))throw Error('Invalid race arrays');
  if(!(s.nextIncidentAt===Infinity||Number.isFinite(s.nextIncidentAt)))throw Error('Invalid incident sentinel');
  if(canonical(s.championshipContext??null)!==canonical(initial.championshipContext??null))throw Error('Championship context changed after start');
  for(const r of s.entrants){validateM6Entrant(s,r);
    validateAffinityContext(r.affinityContext);if(canonical(r.affinityContext??null)!==canonical(initial.entrants.find(e=>e.id===r.id)?.affinityContext??null))throw Error('Frozen affinity context changed');validateCoaching(r.coachingContext);validateEndowments(r.endowments);if(canonical(r.endowments??null)!==canonical(initial.entrants.find(e=>e.id===r.id)?.endowments??null))throw Error('Frozen endowments changed');if(r.endowments&&(!r.endow||!Array.isArray(r.endow.buffs)||typeof r.endow.cool!=='object'||typeof r.endow.damagedLap!=='boolean'))throw Error('Invalid endowment state');if(canonical(r.progressionContext??null)!==canonical(initial.entrants.find(e=>e.id===r.id)?.progressionContext??null))throw Error('Frozen progression context changed');const original=initial.entrants.find(e=>e.id===r.id);if(canonical(r.coachingContext??null)!==canonical(original.coachingContext??null))throw Error('Frozen coaching context changed');
    if(s.championshipContext){const p=r.progressEvidence;exact(p,['version','progress','firstTime','firstTick']);if(p.version!==1||!Number.isFinite(p.progress)||!Number.isFinite(p.firstTime)||p.firstTime<0||p.firstTime>s.time+s.config.epsilon||!Number.isInteger(p.firstTick)||p.firstTick<0||p.firstTick>s.tick||r.status==='Racing'&&p.progress!==r.q||r.status==='Retired'&&p.progress!==r.retirement?.progress)throw Error('Invalid authoritative first-progress evidence');}

    derive(r.ru,s.config);
    if(!['Racing','Finished','Retired','DNS'].includes(r.status)||!['Live','Clearing','Exited','Wreck'].includes(r.physical)||!r.ai||!Number.isFinite(r.ai.nextDecision)||!Number.isInteger(r.signs.remaining)||r.signs.remaining<0)throw Error('Invalid entrant checkpoint state');
    if(r.finishSnapshot&&(!Object.isFrozen(r.finishSnapshot)||Object.getOwnPropertyDescriptor(r,'finishSnapshot').writable!==false))throw Error('Lost historical finish immutability');
  }
  for(const k of Object.keys(s.wrecks))if(!Object.isFrozen(s.wrecks[k])||Object.getOwnPropertyDescriptor(s.wrecks,k).writable!==false)throw Error('Lost wreck immutability');
  assertState(s);return s;
}
export function validateIdentity(x){exact(x,['profileId','careerId','instanceId','raceId']);for(const v of Object.values(x))id(v);return x;}
export const setupFingerprint=s=>wireHash(pack(s.setup));
export function checkpointRace(s,identity,watermark=0){
  validateIdentity(identity);validateRaceBoundary(s);if(!Number.isSafeInteger(watermark)||watermark<0)throw Error('Invalid journal watermark');
  return sealWire({kind:'BNT-race-checkpoint',version:1,stateVersion:stateProtocol(s),simulationVersion:VERSION,identity:structuredClone(identity),setupFingerprint:setupFingerprint(s),watermark,tick:s.tick,state:pack(s)});
}
export function restoreRace(record,{identity,setupHash,watermark}={}){
  const x=unsealWire(record);exact(x,['kind','version','stateVersion','simulationVersion','identity','setupFingerprint','watermark','tick','state']);
  validateIdentity(x.identity);
  if(x.kind!=='BNT-race-checkpoint'||x.version!==1||![RACE_STATE_VERSION,CHAMPIONSHIP_RACE_STATE_VERSION,AFFINITY_RACE_STATE_VERSION].includes(x.stateVersion)||x.simulationVersion!==VERSION)throw Error('Incompatible race checkpoint version');
  if(identity&&wireHash(identity)!==wireHash(x.identity)||setupHash&&setupHash!==x.setupFingerprint||watermark!==undefined&&watermark!==x.watermark)throw Error('Incompatible race checkpoint identity/watermark');
  const s=validateRaceBoundary(unpack(x.state));
  if(x.stateVersion!==stateProtocol(s))throw Error('Incompatible checkpoint behavior version');
  if(x.tick!==s.tick||x.setupFingerprint!==setupFingerprint(s)||!Number.isSafeInteger(x.watermark)||x.watermark<0)throw Error('Checkpoint metadata mismatch');return s;
}
export function clearedNativeResult(s){
  validateRaceBoundary(s);
  if(s.status!=='Ended'||s.pendingImpacts.length||s.pendingOverrides.length||s.entrants.some(r=>r.status==='Racing'||r.physical==='Clearing')||!s.events.some(e=>e.type==='RACE_ENDED'))throw Error('RACE_CLEARANCE_BLOCKED: unresolved authoritative processing');
  const official=classification(s);if(official.length!==s.entrants.length||new Set(official.map(x=>x.id)).size!==s.entrants.length)throw Error('RACE_CLEARANCE_BLOCKED: classification identity');
  return {...(s.championshipContext ? {championshipEvidence:{version:1,context:structuredClone(s.championshipContext),starters:structuredClone(s.events.find(e=>e.type==='RACE_STARTED')?.effects.starters??[]),progress:s.entrants.map(r=>({id:r.id,...r.progressEvidence}))},ledger:combatLedger(s)} : {}),classification:official,conditions:s.entrants.map(r=>({entrantId:r.id,native:structuredClone(r.ru)}))};
}
