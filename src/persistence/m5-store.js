import {initializeD2} from '../career/m5/d2/lifecycle.js';
import {exact,id} from '../career/legacy-state.js';
import {validatePages} from '../career/m5/history.js';
import {validateCurrent,transactCurrent,prepareNewCurrent,M5_TAIL_LIMIT} from '../career/m5/current.js';
import {currentEnvelope,readCurrentEnvelope,foldCurrent} from '../career/m5/envelope.js';
import {validateCareerPresentation,radioPreference,assertPresentationRestore} from './career-presentation.js';
import {activeTeam,changeTeam,teamReadiness} from '../management/headquarters/active-team.js';
import {managementView,assemblyCommand} from '../management/model.js';
import {assetId} from '../career/packages.js';
import {fingerprint} from '../career/cycles/contracts.js';
const KEY='bnt.career.save.v1';
// Synchronous *preparation* adapter. The awaited worker/IDB coordinator publishes
// all logical records atomically; this adapter never claims a Map is browser durability.
export class M5CareerStore {
 constructor(storage){this.storage=storage;this.mode='automatic';this.current=null;this.raw=null;this.presentation=null;this.base=null;this.problem='';this.marks=[];this.protectedHistory=[];this.maintenanceClock=0;this.requiresCheckpoint=false;this.recovery=null;this.recoveryPending=false;}
 get state(){return structuredClone(this.current);}
 open(){try{this.raw=this.storage.getItem(KEY);if(this.raw===null)return;const read=readCurrentEnvelope(this.raw);validatePages(read.primary,this.storage);this.current=read.primary;this.base=structuredClone(read.envelope.base.value);this.presentation=read.presentation;this.protectedHistory=read.protectedHistory;this.maintenanceClock=this.current.maintenanceRevision;}catch(e){this.mode='blocked';this.problem=e.message;}}
 publish(state,presentation=this.presentation,{fold=false}={}){
 if(this.mode!=='automatic')throw Error('M5 authority is blocked; no write accepted');
 if(this.storage.getItem(KEY)!==this.raw)throw Error('STALE_WRITER: source save changed');
 assertPresentationRestore(this.presentation,presentation);
 const next=fold?foldCurrent(state):state,base=fold?next:this.base??next,candidate=currentEnvelope(next,base,presentation);
 // Fully revalidate the serialized candidate before exposing even prepared state.
 // The candidate and its base were just validated above. Cold bytes always replay
 // in open(); repeating that replay here adds no independent trust boundary.
 this.storage.setItem(KEY,candidate.text);
 this.raw=candidate.text;this.current=structuredClone(next);this.base=structuredClone(base);this.presentation=structuredClone(presentation);this.protectedHistory=this.current.history.commands;this.maintenanceClock=next.maintenanceRevision;
 return this.state;
 }
 createCurrent(native,presentation,{d2=typeof BNT_M5_D2_BUILD!=='undefined'&&BNT_M5_D2_BUILD}={}){if(this.raw!==null||this.current)throw Error('M5 creation cannot replace an existing career');const original=prepareNewCurrent(native),s=d2?initializeD2(original):original;this.base=s;return this.publish(s,presentation);}
 transaction(tx,options={}){if(!this.current)throw Error('No M5 career');const result=transactCurrent(this.current,tx,options);if(!result.duplicate){for(const [k,v]of result.pageRecords??[])this.storage.setItem(k,v);this.publish(result.state,this.presentation,{fold:result.archived>0||result.state.transactions.length===M5_TAIL_LIMIT});for(const k of result.retiredKeys??[])this.storage.removeItem?.(k);}return {...result,state:this.state};}
 setRadioPreference(enabled,expectedRevision){const p=radioPreference(this.presentation,this.current,enabled,expectedRevision);this.publish(this.current,p);return structuredClone(p);}
 setActiveTeam(r){
 exact(r,['kind','assetId','slot','expectedRevision','expectedMaintenanceRevision','expectedPresentationRevision','id']);id(r.id);id(r.assetId);if(![null,0,1].includes(r.slot))throw Error('Invalid beast slot');
 const s=this.current;if(s.revision!==r.expectedRevision||s.maintenanceRevision!==r.expectedMaintenanceRevision||(this.presentation?.revision??0)!==r.expectedPresentationRevision)throw Error('Stale active-team selection');
 const v=managementView(s,{mode:this.mode,requiresCheckpoint:false});if(v.blocked)throw Error(v.restriction);
 const team=changeTeam(s,activeTeam(s,this.presentation),r.kind,r.assetId,r.slot),p=structuredClone(this.presentation);p.version=2;p.activeTeam=team;p.revision++;
 let state=s;const ready=teamReadiness(s,team),a=v.assignment;
 if(ready.eligible||a){const command=assemblyCommand(s,ready.eligible?{driverId:team.driverId,beastIds:team.beastIds,chariotId:team.chariotId}:null,r.id,{disassemble:!ready.eligible,assignmentId:a?.id??assetId(s.career.id,'ru')});const prepared=transactCurrent(s,command);for(const [k,v]of prepared.pageRecords??[])this.storage.setItem(k,v);state=prepared.state;}
 validateCareerPresentation(p,state);this.publish(state,p,{fold:state.transactions.length===M5_TAIL_LIMIT});return {team:structuredClone(team),durable:false};
 }
 requireManualCheckpoint(){if(this.mode!=='automatic')throw Error('M5 save unavailable');}
 export(){if(!this.current)throw Error('No M5 career');const e=JSON.parse(this.raw);this.exportToken=fingerprint(e);return e;}
 acknowledgeExport(token){if(token!==this.exportToken)throw Error('Export the current save first');}
 importSave(text,{confirmed=false,completeM5=false}={}){if(!confirmed)throw Error('Confirm complete replacement');const read=readCurrentEnvelope(text);if(this.current&&(read.primary.profile.id!==this.current.profile.id||read.primary.career.id!==this.current.career.id))throw Error('Unrelated career replacement rejected');assertPresentationRestore(this.presentation,read.presentation,{existing:!!this.current});if(!completeM5)throw Error('Use complete M5 backup restore; career-only import cannot omit paged history/session authority');if(this.current&&read.primary.revision<this.current.revision)throw Error('Older M5 backup cannot silently roll back accepted progress; use explicit previous-generation recovery');if(this.storage.getItem(KEY)!==this.raw)throw Error('STALE_WRITER');this.storage.setItem(KEY,text);this.raw=text;this.current=read.primary;this.base=read.envelope.base.value;this.presentation=read.presentation;return this.state;}
}
