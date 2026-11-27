import {exact,id} from '../../career/legacy-state.js';
import {canonical} from '../../core/determinism.js';
import {packageById,CATALOG_VERSION} from '../../career/packages.js';
export const EMBLEMS=Object.freeze(['wheel','shield','bolt','crown','skull','flame','star','sun','hammer','horseshoe','moon','tower','spears']);
export const GUIDE_STEPS=6;
export function validatePresentation(p){
 exact(p,['kind','version','profileId','careerId','creationId','packageId','emblem','primary','secondary','onboarding'],'stable presentation');
 if(p.kind!=='BNT-stable-presentation'||p.version!==1)throw Error('Unsupported stable presentation version');
 for(const k of ['profileId','careerId','creationId'])id(p[k]);packageById(p.packageId);
 if(!EMBLEMS.includes(p.emblem)||!/^#[a-f0-9]{6}$/.test(p.primary)||!/^#[a-f0-9]{6}$/.test(p.secondary))throw Error('Invalid cosmetic emblem or colors');
 exact(p.onboarding,['version','status','step'],'onboarding');if(p.onboarding.version!==1||!['active','skipped','completed'].includes(p.onboarding.status)||!Number.isSafeInteger(p.onboarding.step)||p.onboarding.step<0||p.onboarding.step>=GUIDE_STEPS)throw Error('Invalid onboarding progress');return p;
}
export function presentationIdentity(p){validatePresentation(p);return canonical(Object.fromEntries(Object.entries(p).filter(([key])=>key!=='onboarding')));}
export function preservePresentation(oldRuntime,newRuntime){
 if(oldRuntime?.version===2&&(newRuntime?.version!==2||presentationIdentity(oldRuntime.presentation)!==presentationIdentity(newRuntime.presentation)))throw Error('Stable cosmetic creation identity cannot be replaced or discarded');
}
export function validatePresentationOwner(runtime,career){
 if(runtime?.version!==2)return;
 const p=validatePresentation(runtime.presentation),s=career.current;
 if(!s||p.profileId!==s.profile.id||p.careerId!==s.career.id||!s.management?.initialized)throw Error('Stable presentation ownership/initialized-career mismatch');
 const proof=(career.protectedHistory??[]).find(e=>e.id===p.creationId+'-grant')??(s.schema===8&&s.m6.initialization.id===p.creationId+'-grant'?s.m6.initialization:null)??(s.schema===7&&s.m5.initialization.id===p.creationId+'-grant'?s.m5.initialization:null);if(!proof)throw Error('Missing protected starting-package provenance');
 const tx=JSON.parse(proof.request);
 if(tx.type!=='career.initialize'||tx.commandVersion!==1||tx.profileId!==p.profileId||tx.careerId!==p.careerId||tx.packageId!==p.packageId||tx.catalogVersion!==CATALOG_VERSION||tx.confirmed!==true)throw Error('Stable presentation starting-package provenance mismatch');
}
