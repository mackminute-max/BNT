import {exact,id as validateId} from '../career/legacy-state.js';
import {radioPreference,validateCareerPresentation} from './career-presentation.js';
import {activeTeam,changeTeam,teamReadiness} from '../management/headquarters/active-team.js';
import {managementView,assemblyCommand} from '../management/model.js';
import {assetId} from '../career/packages.js';
import {makeEnvelope,SAVE_KEY} from './envelope.js';
// Run existing protected assignment commands in an isolated synchronous candidate,
// then publish assignment + partial selection in ONE authoritative envelope commit.
export function selectActiveTeam(store,request,Store){
 exact(request,['kind','assetId','slot','expectedRevision','expectedMaintenanceRevision','expectedPresentationRevision','id'],'active-team request');validateId(request.id);validateId(request.assetId);if(!['personnel','beasts','chariots'].includes(request.kind)||![null,0,1].includes(request.slot))throw Error('Invalid active-team operation');
 const {kind,assetId:key,slot=null,expectedRevision,expectedMaintenanceRevision,expectedPresentationRevision,id}=request,s=store.current;
 if(!s||s.revision!==expectedRevision||s.maintenanceRevision!==expectedMaintenanceRevision||(store.presentation?.revision??0)!==expectedPresentationRevision)throw Error('Stale active-team selection');
 const v=managementView(s,{mode:store.mode,requiresCheckpoint:store.requiresCheckpoint});if(v.blocked)throw Error(v.restriction);
 const team=changeTeam(s,activeTeam(s,store.presentation),kind,key,slot),p=store.presentation?structuredClone(store.presentation):radioPreference(null,s,false,0);p.version=2;p.activeTeam=team;p.revision=(store.presentation?.revision??0)+1;validateCareerPresentation(p,s);
 const map=new Map([[SAVE_KEY,store.raw]]),shadow=new Store({getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)});shadow.open();if(shadow.mode!=='automatic')throw Error('Cannot prepare active team from invalid authority');
 const ready=teamReadiness(s,team),a=v.assignment;
 if(ready.eligible)shadow.transaction(assemblyCommand(s,{driverId:team.driverId,beastIds:team.beastIds,chariotId:team.chariotId},id,{assignmentId:a?.id??assetId(s.career.id,'ru')}));
 else if(a)shadow.transaction(assemblyCommand(s,null,id,{disassemble:true,assignmentId:a.id}));
 store.requireManualCheckpoint();store.publish(makeEnvelope(shadow.current,store.current,shadow.marks,shadow.protectedHistory,shadow.maintenanceClock,p));return {durable:store.mode!=='manual',team:structuredClone(team)};
}
