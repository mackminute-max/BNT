import {previewRU} from '../career/assembly.js';
import {previewRU3,quoteEconomy} from '../career/economy/reducers.js';
import {previewRU4,assessViability,debtStatus,outstanding} from '../career/cycles/policy.js';
import {quoteEconomy4} from '../career/cycles/schema4.js';
import {quoteCycle} from '../career/cycles/reducers.js';
import {activeChampionship,controllerOffers} from '../career/championships/controller.js';
import {assignmentEffect} from '../career/domain-commands.js';
export function selectionPreview(state, selection, assignmentId=null) {
  if (!state?.management?.initialized) return {eligible:false,reasons:['Initialize a starting stable first']};
  return (state.schema>=4?previewRU4:state.schema===3?previewRU3:previewRU)(state,selection,{assignmentId});
}
export function managementView(state,{mode='automatic',requiresCheckpoint=false,reason=''}={}) {
  const r=state?.management?.registries, active=state?activeChampionship(state):null;
  const blocked=!!reason||['blocked','recovery-required'].includes(mode)||requiresCheckpoint||state?.career.status==='Failed'||!!active;
  const restriction=reason|| (active?'This championship is active or awaiting settlement. Home Stable is read-only.':state?.career.status==='Failed'?'This career has ended; inspection and export remain available.':requiresCheckpoint?'Export and confirm the manual checkpoint before another change.':['blocked','recovery-required'].includes(mode)?'Save recovery is required before changes.':'');
  const a=r?Object.values(r.assignments)[0]:null;
  const selection=a?{driverId:a.driverId,beastIds:[...a.beastIds],chariotId:a.chariotId}:null;
  return {state,registries:r,active,blocked,restriction,assignment:a,selection,
    readiness:selectionPreview(state,selection,a?.id),
    viability:state?.schema>=4?assessViability(state):null,
    payroll:state?.schema>=4?{debt:outstanding(state),status:debtStatus(state.cycles.streak),cycles:state.cycles.number}:null,
    offers:state?.championshipFoundation?.version>=2?controllerOffers(state):[],
    capacity:r?Object.values(r.properties)[0]?.capacities??{}:{}};
}
export function assemblyCommand(state,selection,id,{disassemble=false,assignmentId}={}) {
  return {id,profileId:state.profile.id,careerId:state.career.id,expectedRevision:state.revision,expectedMaintenanceRevision:state.maintenanceRevision,commandVersion:1,type:disassemble?'ru.disassemble':'ru.assemble',delta:0,reason:'Home Stable racing unit selection',effectId:assignmentEffect(state.career.id,state.revision,state.maintenanceRevision),assignmentId,...(!disassemble?selection:{})};
}
export function actionQuote(state,type,payload) {
  if(type==='cycle.settle'||type.startsWith('championship.'))throw Error('Championship progression and settlement are reserved for E5-B');
  if(['payroll.pay','contract.renew','contract.release','emergency.request','career.confirmFailure'].includes(type)) {
    if(state.schema<4)throw Error('Enable payroll compatibility first');return {version:3,...quoteCycle(state,type,payload)};
  }
  if(state.schema<3)throw Error('Enable economy compatibility first');
  return {version:2,...(state.schema>=4?quoteEconomy4:quoteEconomy)(state,type,payload)};
}
export function actionCommand(state,type,payload,id) {
  const q=actionQuote(state,type,payload);
  return {id,profileId:state.profile.id,careerId:state.career.id,expectedRevision:state.revision,expectedMaintenanceRevision:state.maintenanceRevision,commandVersion:q.version,type,effectId:q.effectId,delta:q.delta,reason:'Confirmed Home Stable action: '+type,payload};
}
