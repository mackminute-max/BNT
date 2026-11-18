import {validateIdentity} from './checkpoint.js';
import {exact,id} from '../../career/legacy-state.js';
import {wireHash} from './codec.js';
// Typed proof seam only. Later orchestration must supply authoritative eligibility evidence.
// No entrants, DNS outcomes, points, purses or championship advancement are fabricated.
export function noStarterProof(identity,evidence){
  validateIdentity(identity);exact(evidence,['version','sourceFingerprint','registered'],'no-starter evidence');
  if(evidence.version!==1||!/^[a-f0-9]{64}$/.test(evidence.sourceFingerprint)||!Array.isArray(evidence.registered)||evidence.registered.length<1||evidence.registered.length>64)throw Error('Invalid no-starter evidence');
  const ids=new Set();for(const r of evidence.registered){exact(r,['entrantId','mayStart','reason']);id(r.entrantId);if(ids.has(r.entrantId)||r.mayStart!==false||typeof r.reason!=='string'||!r.reason.trim()||r.reason.length>500)throw Error('No-starter proof requires distinct, ineligible registered entrants');ids.add(r.entrantId);}
  return {kind:'BNT-no-starter-proof',version:1,identity:structuredClone(identity),sourceFingerprint:wireHash(evidence),classification:[],conditions:[],standingsEffects:[],pendingEntitlementIds:[]};
}
