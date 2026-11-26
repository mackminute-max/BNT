import {fingerprint} from '../cycles/contracts.js';
import {canonical} from '../../core/determinism.js';
import {CATALOGS} from '../m5/content.generated.js';
const sex=(career,key)=>parseInt(fingerprint(['m6-p1-presentation-sex-v1',career,key]).slice(0,8),16)%2?'female':'male';
const person=(s,key,ancestryId)=>({version:1,ancestryId,sex:sex(s.career.id,key)});
// Pure, bounded by live identities. Never consumes a market or simulation stream.
export function presentationMetadata(s){
 const drivers={},staff={},add=(key,ancestry)=>{if(!key||!/^A(?:0[1-9]|1[0-3])$/.test(ancestry))throw Error('Invalid racing driver presentation source');drivers[key]=person(s,key,ancestry);};
 for(const pool of Object.values(s.m6.rivals))for(const p of pool.organizations)add(p.memberIds.driver,p.driver.ancestryId);
 for(const x of Object.values(s.championshipFoundation.instances))for(const n of Object.values(x.m6?.names??{}))if(n.memberIds)add(n.memberIds.driver,n.ancestryId);
 const den=s.m6.gambling.den;
 for(const e of [...(den?.events??[]),den?.active?.event].filter(Boolean))for(const [i,entry]of e.setup.entrants.entries()){
  const fixed=s.m6.rivals[e.nationId]?.organizations.find(p=>p.id===e.source.persistentIds[i]);
  add(fixed?.memberIds.driver??'den-driver-'+fingerprint([e.id,entry.ru.id]).slice(0,40),e.names[entry.ru.id].ancestryId);
 }
 for(const [id,p]of Object.entries(s.m6.identities))if(p.category==='specialist'){
  const nation=CATALOGS.nation.find(n=>n.canonicalNationId===p.originNationId),rows=nation?.ancestryWeights??[];
  const total=rows.reduce((n,r)=>n+r.weight,0);let draw=parseInt(fingerprint(['m6-p1-staff-ancestry-v1',s.career.id,p.contextFingerprint]).slice(0,8),16)/0x100000000*total,chosen=rows.at(-1)?.id;
  for(const r of rows){draw-=r.weight;if(draw<0){chosen=r.id;break;}}
  const existing=p.ancestryId??p.authored?.ancestry_id,ancestry=CATALOGS.ancestryGameplay.find(a=>a.canonicalAncestryId===existing)?.canonicalAncestryId??CATALOGS.ancestryGameplay.find(a=>a.id===chosen)?.canonicalAncestryId;
  if(!ancestry)throw Error('Missing canonical staff ancestry pool');
  staff[id]={...person(s,p.contextFingerprint,ancestry),...(['male','female'].includes(p.authored?.sex)?{sex:p.authored.sex}:{})};
 }
 return {version:1,drivers,staff};
}
export function validatePresentationMetadata(s){if(s.m6.presentation!==undefined&&canonical(s.m6.presentation)!==canonical(presentationMetadata(s)))throw Error('Invalid M6 presentation metadata version, ownership or identity');}
export function refreshPresentationMetadata(s){s.m6.presentation=presentationMetadata(s);}
