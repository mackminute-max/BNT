// E5-B pure preparation only. This module does not authorize eligibility,
// publish a selection, change a career or grant mechanical effects.
import {id,exact} from '../legacy-state.js';
import {fingerprint} from '../cycles/contracts.js';
import {canonical} from '../../core/determinism.js';
import {freeze} from '../assets.js';
export const REWARD_CATALOG_VERSION='e5b-placeholder-rewards-v1';
const run=[['driver-notes','Driver Notes','Driver development'],['beast-notes','Beast Conditioning Notes','Beast development'],['chariot-notes','Chariot Workshop Notes','Chariot improvements'],['equipment-notes','Equipment Notes','Equipment'],['racing-notes','Racing Insights','Racing advantages'],['support-notes','Support Plan','Recovery and support'],['opportunity-notes','Trading Opportunity Notes','Financial opportunities']];
const legacy=[['stable-notes','Stable Development Notes','Permanent stable development'],['owner-notes','Owner Notebook','Owner Legacy perks'],['invitation-notes','Invitation Dossier','Future championship access'],['recruitment-notes','Recruitment Contacts','Recruitment opportunities'],['package-notes','Starting Package Notes','Starting-package improvements'],['facility-notes','Facility Dossier','Permanent facility opportunities'],['distinction-notes','Stable Distinction','Cosmetic stable distinctions']];
const catalog=(scope,rows)=>rows.map(([key,name,category])=>({id:`${scope}-${key}`,catalogVersion:REWARD_CATALOG_VERSION,name,category,description:'Provisional placeholder. Records a selection only; no current stat, Gold, recovery, unlock or other mechanical effect.',scope,implementationStatus:'PLACEHOLDER',effect:'DEFERRED'}));
export const REWARD_CATALOG=freeze([...catalog('run',run),...catalog('legacy',legacy)]);
export function validateDefinition(d){exact(d,['id','catalogVersion','name','category','description','scope','implementationStatus','effect']);id(d.id);if(d.catalogVersion!==REWARD_CATALOG_VERSION||!['run','legacy'].includes(d.scope)||!d.id.startsWith(d.scope+'-')||d.implementationStatus!=='PLACEHOLDER'||d.effect!=='DEFERRED'||['name','category','description'].some(k=>typeof d[k]!=='string'||!d[k].trim()||d[k].length>500))throw Error('Invalid reward definition');return d;}
export function generateRewardOffer(input){
 exact(input,['scope','profileId','careerId','instanceId','sourceId','sourceFingerprint']);for(const k of ['profileId','careerId','instanceId','sourceId'])id(input[k]);
 if(!['run','legacy'].includes(input.scope)||!/^[a-f0-9]{64}$/.test(input.sourceFingerprint))throw Error('Invalid reward offer source');
 const eligible=REWARD_CATALOG.filter(x=>x.scope===input.scope);eligible.forEach(validateDefinition);
 const choices=eligible.map(x=>({definition:x,rank:fingerprint(['e5b-reward-order-v1',input,x.id])})).sort((a,b)=>a.rank<b.rank?-1:a.rank>b.rank?1:a.definition.id<b.definition.id?-1:1).slice(0,3).map(x=>structuredClone(x.definition));
 const value={kind:'BNT-reward-offer',version:1,catalogVersion:REWARD_CATALOG_VERSION,source:structuredClone(input),choices};return freeze({...value,id:'e5b-offer-'+fingerprint(value).slice(0,48)});
}
export function validateRewardOffer(o){exact(o,['kind','version','catalogVersion','source','choices','id']);if(canonical(generateRewardOffer(o.source))!==canonical(o))throw Error('Reward offer differs from deterministic catalog/source');return o;}
export function previewRewardSelection(offer,rewardId,scope){validateRewardOffer(offer);if(scope!==offer.source.scope)throw Error('Wrong reward scope');const definition=offer.choices.find(c=>c.id===rewardId);if(!definition)throw Error('Reward is not a choice in this offer');return freeze({offerId:offer.id,rewardId,scope,definition:structuredClone(definition)});}
