import {AFFINITY_RULES as R} from './affinity.generated.js';
import {clamp} from '../core/determinism.js';
export const AFFINITY_VERSION='m5-affinity-v1';
export function affinityContext(ancestryId,speciesId){const relationship=Object.hasOwn(R.matrix,ancestryId)&&Object.hasOwn(R.matrix[ancestryId],speciesId)?R.matrix[ancestryId][speciesId]:null;if(!relationship)throw Error('Unknown canonical ancestry/species');return Object.freeze({version:1,rulesVersion:AFFINITY_VERSION,ancestryId,speciesId,multiplier:1+R.modifiers[relationship]});}
export function validateAffinityContext(c){if(c===undefined)return;if(!c||Object.keys(c).sort().join(',')!=='ancestryId,multiplier,rulesVersion,speciesId,version'||c.version!==1||c.rulesVersion!==AFFINITY_VERSION||c.multiplier!==affinityContext(c.ancestryId,c.speciesId).multiplier)throw Error('Invalid/version-incompatible frozen affinity context');return c;}
// Final independent derived targets: adjusted handling/control never feed back
// into acceleration/braking/lateral/combat, so each target receives one factor.
export function applyAffinity(d,context,config){validateAffinityContext(context);if(context===undefined)return d;const f=context.multiplier;return {...d,maxSpeed:d.maxSpeed*f,acceleration:Math.min(config.accelerationLimit,d.acceleration*f),handling:clamp(d.handling*f,0,100),control:clamp(d.control*f,0,100),braking:d.braking*f,lateral:d.lateral*f,fatigueRate:d.fatigueRate/f};}
export const affinityRelationship=(ancestryId,speciesId)=>R.matrix[ancestryId]?.[speciesId]??null;
export const affinityLabel=(c)=>{validateAffinityContext(c);return R.ancestries[c.ancestryId]+' / '+R.species[c.speciesId]+': '+(c.multiplier>1?'+5%':c.multiplier<1?'−5%':'neutral')+' beast-linked performance';};
