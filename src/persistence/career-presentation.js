import {exact,id} from '../career/legacy-state.js';
import {canonical} from '../core/determinism.js';
import {PACK_VERSION,PACK_DIGEST} from '../presentation/content/m3-bc-data.js';
export function validateCareerPresentation(p,state=null,{owned=true}={}){
 exact(p,['kind','version','profileId','careerId','revision','cohort','identityPack','radio',...(p?.version===2?['activeTeam']:[])],'career presentation');
 if(p.kind!=='BNT-career-presentation'||![1,2].includes(p.version)||!['m3-bc','legacy'].includes(p.cohort)||!Number.isSafeInteger(p.revision)||p.revision<1)throw Error('Unsupported career presentation version/revision');
 id(p.profileId);id(p.careerId);exact(p.radio,['version','enabled'],'radio preference');if(p.radio.version!==1||typeof p.radio.enabled!=='boolean')throw Error('Unsupported radio preference');
 if(p.identityPack!==null){exact(p.identityPack,['version','digest'],'identity pack');if(p.cohort!=='m3-bc'||p.identityPack.version!==PACK_VERSION||p.identityPack.digest!==PACK_DIGEST)throw Error('Unsupported/contradictory identity pack');}
 if(p.version===2){const t=p.activeTeam;exact(t,['version','driverId','beastIds','chariotId'],'active team');if(t.version!==1||!Array.isArray(t.beastIds)||t.beastIds.length!==2)throw Error('Unsupported active team');const ids=[t.driverId,...t.beastIds,t.chariotId].filter(v=>v!==null);for(const k of ids)id(k);if(new Set(ids).size!==ids.length)throw Error('Duplicate active asset');if(state&&owned){const r=state.management?.registries;for(const [kind,k]of [['personnel',t.driverId],...t.beastIds.map(k=>['beasts',k]),['chariots',t.chariotId]])if(k!==null&&(!r?.[kind]?.[k]||r[kind][k].ownerCareerId!==state.career.id))throw Error('Missing/foreign active asset');}}
 if(state&&(state.profile.id!==p.profileId||state.career.id!==p.careerId))throw Error('Presentation career ownership/initialization mismatch');return p;
}
export function presentationPin(p){validateCareerPresentation(p);return canonical({profileId:p.profileId,careerId:p.careerId,cohort:p.cohort,identityPack:p.identityPack});}
export function assertPresentationRestore(old,next,{existing=false}={}){
 if(!old){if(existing&&next?.cohort==='m3-bc')throw Error('Cannot retrofit a new-career presentation cohort into an unmarked career');return;}validateCareerPresentation(old);if(!next)throw Error('Presentation downgrade: marked career requires a compatible marked backup');validateCareerPresentation(next);
 if(old.version===2&&next.version!==2)throw Error('Active-team sidecar downgrade rejected');
 if(presentationPin(old)!==presentationPin(next))throw Error('Contradictory presentation ownership/cohort/pack pin');
 if(next.revision<old.revision||next.revision===old.revision&&canonical(old)!==canonical(next))throw Error('Stale/conflicting presentation revision');
}
export function newCareerPresentation(state,{recruitIdentities=false}={}){
 if(typeof recruitIdentities!=='boolean'||state.schema!==2||state.revision!==1||!state.management?.initialized||state.transactions.length!==1||state.transactions[0].transaction.type!=='career.initialize')throw Error('Presentation activation requires the pristine native initial grant');
 return validateCareerPresentation({kind:'BNT-career-presentation',version:1,profileId:state.profile.id,careerId:state.career.id,revision:1,cohort:'m3-bc',identityPack:recruitIdentities?{version:PACK_VERSION,digest:PACK_DIGEST}:null,radio:{version:1,enabled:true}},state);
}
export function radioPreference(old,state,enabled,expectedRevision){
 if(!state?.management?.initialized)throw Error('Initialize career before opting into presentation');
 if(typeof enabled!=='boolean'||expectedRevision!==(old?.revision??0))throw Error('Stale/invalid presentation preference');
 const p=old?structuredClone(validateCareerPresentation(old,state)):{kind:'BNT-career-presentation',version:1,profileId:state.profile.id,careerId:state.career.id,revision:0,cohort:'legacy',identityPack:null,radio:{version:1,enabled:false}};
 p.revision++;p.radio.enabled=enabled;return validateCareerPresentation(p,state);
}
