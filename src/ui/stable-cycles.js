import {quoteCycle,sourceFingerprint} from '../career/cycles/reducers.js';
import {debtStatus,outstanding,assessViability,moraleMultiplier} from '../career/cycles/policy.js';
import {cycleMigrationEffect,RULES} from '../career/cycles/contracts.js';
import {requireTrustedCompletion} from '../career/cycles/completion.js';
const $=id=>document.getElementById(id);
export function mountStableCycles({store,act,newId,setNotice,getCompletion=()=>null}){
 let migration=null,settlement=null;
 function command(type,payload){const s=store.state,q=quoteCycle(s,type,payload);return {id:newId('cycles'),profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:3,type,effectId:q.effectId,delta:q.delta,reason:'Explicit stable management action: '+type,payload};}
 function commit(type,payload,label){const tx=command(type,payload);if(!window.confirm(label+'? Review the quote below. This commits immediately.'))return;store.transaction(tx);setNotice(label+' committed.');}
 function selection(){return {personId:$('cyclePerson').value,term:$('cycleTerm').value};}
 function render(){
  const s=store.state,ready=s?.schema===4,blocked=['blocked','recovery-required'].includes(store.mode)||store.requiresCheckpoint,failed=s?.career.status==='Failed';
  $('cyclePreviewMigration').disabled=s?.schema!==3||blocked;$('cycleConfirmMigration').disabled=!migration||s?.schema!==3||blocked;
  $('cycleMigrationPreview').textContent=migration?JSON.stringify(migration,null,2):'Explicit schema 3 → 4 migration. No wages or cycle on migration.';
  $('cycleControls').hidden=!ready;
  if(!ready){$('cycleStatus').textContent='M2-D is not enabled for this career. Existing saves are unchanged until confirmed migration.';$('cycleInspect').textContent='';return;}
  const status=debtStatus(s.cycles.streak),viability=assessViability(s);
  $('cycleStatus').textContent=`${s.career.treasury} Gold · ${outstanding(s)} Gold wage arrears · ${status} · Effective driver control × ${moraleMultiplier(status)} · ${viability.status} · ${s.cycles.number} completed settlements`;
  $('cycleViability').textContent=viability.reasons.join(' ');
  const prev=$('cyclePerson').value;$('cyclePerson').replaceChildren();for(const p of [...Object.values(s.management.registries.personnel),...Object.values(s.management.registries.specialists)]){const c=s.management.registries.contracts[p.references.contract[0]];$('cyclePerson').add(new Option(`${p.name} · ${c.lifecycle} · ${c.cyclesRemaining} cycles · ${c.wage} G${c.emergency?' · emergency':''}`,p.id));}if([...$('cyclePerson').options].some(o=>o.value===prev))$('cyclePerson').value=prev;
  for(const id of ['cyclePay','cycleRenew','cycleRelease','cycleEmergency'])$(id).disabled=blocked||failed;
  const quotes={};for(const [type,payload] of [['payroll.pay',{amount:Number($('cyclePayment').value)}],['contract.renew',selection()],['contract.release',{personId:$('cyclePerson').value,resolveAssignment:$('cycleResolveAssignment').checked}],['emergency.request',{}]]){try{quotes[type]=quoteCycle(s,type,payload);}catch(e){quotes[type]={blocked:e.message};}}
  for(const [id,type] of [['cyclePay','payroll.pay'],['cycleRenew','contract.renew'],['cycleRelease','contract.release'],['cycleEmergency','emergency.request']])$(id).disabled=blocked||failed||!!quotes[type].blocked;
  $('cycleQuotes').textContent=JSON.stringify(quotes,null,2);$('cycleFailure').disabled=blocked||failed||!viability.canConfirm;
  const completion=getCompletion();let trusted=false;if(completion)try{requireTrustedCompletion(completion);trusted=true;}catch{}
  $('cyclePreviewSettlement').disabled=blocked||failed||!trusted;$('cycleConfirmSettlement').disabled=blocked||failed||!settlement;
  $('cycleCompletionStatus').textContent=trusted?'Authoritative championship completion available. Preview before confirming.':'No authoritative championship completion available. Standalone races do not advance payroll. No championship controller is included.';
  $('cycleSettlementPreview').textContent=settlement?JSON.stringify(settlement.quote,null,2):'No pending settlement preview.';
  $('cycleInspect').textContent=JSON.stringify({arrears:s.cycles.obligations,creditors:s.cycles.creditors,statements:s.cycles.statements,contractArchive:s.cycles.contractArchive},null,2);
 }
 $('cyclePreviewMigration').onclick=act(()=>{migration=store.previewCycles();setNotice('Read-only M2-D migration preview prepared. Nothing changed.');});
 $('cycleConfirmMigration').onclick=act(()=>{if(!migration)throw Error('Preview migration first');if(!window.confirm('Enable M2-D payroll and lifecycle for this career? No championship or income is created. Export a backup first.'))return;const s=store.state;store.migrateCycles({id:newId('cycle-migration'),profileId:s.profile.id,careerId:s.career.id,type:'career.cycles.migrate',maintenanceVersion:1,expectedRevision:migration.expectedRevision,expectedMaintenanceRevision:migration.expectedMaintenanceRevision,sourceSchema:3,targetSchema:4,sourceFingerprint:migration.sourceFingerprint,rulesVersion:RULES,effectId:cycleMigrationEffect(s.career.id),confirmed:true});migration=null;setNotice('M2-D migration committed atomically. No cycle or wage assessed.');});
 $('cyclePay').onclick=act(()=>commit('payroll.pay',{amount:Number($('cyclePayment').value)},'Pay oldest wage claims'));
 $('cycleRenew').onclick=act(()=>commit('contract.renew',selection(),'Renew selected expired ordinary contract'));
 $('cycleRelease').onclick=act(()=>commit('contract.release',{personId:$('cyclePerson').value,resolveAssignment:$('cycleResolveAssignment').checked},'Release selected expired employee and explicitly resolve any selected assignment'));
 $('cycleEmergency').onclick=act(()=>commit('emergency.request',{},'Contract one replacement driver, zero signing Gold, 20 G payable next championship return'));
 $('cycleFailure').onclick=act(()=>commit('career.confirmFailure',{sourceFingerprint:sourceFingerprint(store.state),confirmed:true},'Confirm permanent career failure; history and assets remain inspectable, gameplay stops'));
 $('cyclePreviewSettlement').onclick=act(()=>{const completion=getCompletion();requireTrustedCompletion(completion);const payload={completion,sourceFingerprint:sourceFingerprint(store.state)};settlement={completion,payload,quote:quoteCycle(store.state,'cycle.settle',payload)};setNotice('Read-only settlement preview prepared. Nothing committed.');});
 $('cycleConfirmSettlement').onclick=act(()=>{if(!settlement)throw Error('Preview first');const tx=command('cycle.settle',settlement.payload);if(!window.confirm('Commit the authoritative championship return, wages, recovery and contract progression once?'))return;store.transaction(tx,{completion:settlement.completion});settlement=null;setNotice('Championship settlement committed atomically.');});
 for(const id of ['cyclePerson','cycleTerm','cycleResolveAssignment'])$(id).onchange=render;$('cyclePayment').oninput=render;return render;
}
