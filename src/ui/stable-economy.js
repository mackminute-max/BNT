import {controllerActive} from '../career/championships/controller.js';
import {canonical} from '../core/determinism.js';
import {sha256} from '../career/economy/fingerprint.js';
import {migrationEffect} from '../career/economy/maintenance-history.js';
import {quoteEconomy as quoteEconomy3} from '../career/economy/reducers.js';
import {quoteEconomy4} from '../career/cycles/schema4.js';
const quoteEconomy=(s,...args)=>s.schema>=4?quoteEconomy4(s,...args):quoteEconomy3(s,...args);
import {UPGRADES,SERVICES} from '../career/economy/catalog.js';
const $=id=>document.getElementById(id);
const ACTIONS={'market.acquire':'Acquire market offer','asset.sell':'Sell owned asset','personnel.terminate':'Terminate personnel contract','equipment.detach':'Detach installed equipment','facility.purchase':'Purchase facility upgrade','service.apply':'Apply immediate care or treatment','training.apply':'Train native rating with XP','engineering.apply':'Engineer chariot rating with Gold'};
function options(select,entries){const previous=select.value;select.replaceChildren();for(const [id,label] of entries)select.add(new Option(label,id));if([...select.options].some(o=>o.value===previous))select.value=previous;}
function cell(row,text){const td=document.createElement('td');td.textContent=String(text);row.append(td);return td;}
export function mountStableEconomy({store,act,newId,setNotice,download}){
 let plan=null;
 options($('economyAction'),Object.entries(ACTIONS));options($('economyTerm'),[['short','Short — 3 future cycles'],['standard','Standard — 8 future cycles'],['long','Long — 16 future cycles']]);$('economyTerm').value='standard';
 options($('economyUpgrade'),Object.entries(UPGRADES).map(([key,u])=>[key,`${u.name} — ${u.cost} Gold`]));
 options($('economyService'),Object.entries(SERVICES).map(([key])=>[key,key.replaceAll('-',' ')]));
 function payload(state){
  const type=$('economyAction').value,assetId=$('economyAsset').value;
  if(type==='market.acquire'){const offer=state.management.registries.marketOffers[$('economyOffer').value];return {offerId:offer?.id??'',term:['driver','specialist'].includes(offer?.category)?$('economyTerm').value:null};}
  if(type==='asset.sell')return {assetId};
  if(type==='personnel.terminate')return {personId:assetId};
  if(type==='equipment.detach')return {equipmentId:assetId};
  if(type==='facility.purchase')return {propertyId:Object.keys(state.management.registries.properties)[0],upgradeId:$('economyUpgrade').value};
  if(type==='service.apply')return {assetId,service:$('economyService').value,amount:$('economyService').value==='chariot-repair'?Number($('economyAmount').value):null};
  return {assetId,attribute:$('economyAttribute').value,points:Number($('economyPoints').value)};
 }
 function renderAction(){
  const s=store.state,ready=s?.schema>=3,blocked=['blocked','recovery-required'].includes(store.mode)||store.requiresCheckpoint||s?.career.status==='Failed'||controllerActive(s),type=$('economyAction').value;
  for(const [key,visible] of [['economyOfferFields',type==='market.acquire'],['economyAssetFields',['asset.sell','personnel.terminate','equipment.detach','service.apply','training.apply','engineering.apply'].includes(type)],['economyFacilityFields',type==='facility.purchase'],['economyServiceFields',type==='service.apply'],['economyTrainingFields',['training.apply','engineering.apply'].includes(type)]])$(key).hidden=!visible;
  $('economyControls').hidden=!ready;$('economyCommit').disabled=true;
  if(!ready){$('economyQuote').textContent='Initialize an M2-B stable, then preview and explicitly confirm the economy migration.';return;}
  const r=s.management.registries;
  options($('economyOffer'),Object.values(r.marketOffers).map(o=>[o.id,`${o.name} · ${o.price} Gold · ${o.available?'available':'consumed'}`]));
  let kinds=type==='asset.sell'?['beasts','chariots','equipment']:type==='personnel.terminate'?['personnel','specialists']:type==='equipment.detach'?['equipment']:type==='engineering.apply'?['chariots']:type==='training.apply'?['personnel','beasts']:type==='service.apply'?[SERVICES[$('economyService').value].registry]:['personnel','beasts','chariots','equipment','specialists'];
  const assets=kinds.flatMap(kind=>Object.values(r[kind]));options($('economyAsset'),assets.map(a=>[a.id,a.name]));
  const selected=assets.find(a=>a.id===$('economyAsset').value);options($('economyAttribute'),Object.keys(selected?.attributes??{}).map(k=>[k,k]));
  try{const quote=quoteEconomy(s,type,payload(s));$('economyQuote').textContent=JSON.stringify({...quote,funds:s.career.treasury,...(!quote.canAfford?{warning:quote.xpCost?'Insufficient XP. M2-C does not award XP.':'Insufficient Gold.'}:{})},null,2);$('economyCommit').disabled=blocked||!quote.canAfford;}catch(e){$('economyQuote').textContent=e.message;}
 }
 function render(){
  const s=store.state,ready=s?.schema>=3,blocked=['blocked','recovery-required'].includes(store.mode)||store.requiresCheckpoint||s?.career.status==='Failed'||controllerActive(s);
  $('economyPreviewMigration').disabled=!s||s.schema!==2||!s.management.initialized||blocked;
  $('economyConfirmMigration').disabled=!plan||!s||s.schema!==2||blocked;
  if(plan&&s?.schema===2&&plan.sourceFingerprint!==sha256(canonical(s)))$('economyConfirmMigration').disabled=true;
  $('economyMigrationPreview').textContent=plan?JSON.stringify(plan,null,2):'Preview is read-only. Confirmation preserves Gold, starter assets and gameplay receipts and creates the initial market once.';
  $('economyStatus').textContent=ready?`Economy active · ${s.career.treasury} Gold · ${Object.values(s.management.registries.marketOffers).filter(o=>o.available).length}/23 offers available · no cycle progression`:'Economy not migrated. Existing M1/M2-B saves are not upgraded automatically.';
  const market=$('economyMarketRows'),roster=$('economyRosterRows'),contracts=$('economyContractRows'),facilities=$('economyFacilityRows');for(const el of [market,roster,contracts,facilities])el.replaceChildren();
  if(ready){
   const r=s.management.registries;
   for(const offer of Object.values(r.marketOffers)){const tr=document.createElement('tr');tr.dataset.offerId=offer.id;cell(tr,offer.name);cell(tr,offer.category);cell(tr,offer.tier);cell(tr,offer.price+' G');cell(tr,offer.available?'Available':'Consumed');const b=document.createElement('button');b.textContent='Select';b.onclick=()=>{$('economyAction').value='market.acquire';renderAction();$('economyOffer').value=offer.id;renderAction();};cell(tr,'').append(b);market.append(tr);}
   for(const kind of ['personnel','beasts','chariots','equipment','specialists'])for(const a of Object.values(r[kind])){
    const tr=document.createElement('tr');cell(tr,a.name);cell(tr,kind);cell(tr,a.injury??a.status??'Neutral');cell(tr,a.condition??'—');cell(tr,a.fatigue??'—');cell(tr,a.strain??'—');cell(tr,a.integrity??'—');cell(tr,a.wear??'—');cell(tr,a.xp??'—');cell(tr,a.economics.acquisitionBasis+' G');cell(tr,a.references.assignment?.length?'RU assigned':a.references.installedOn?.length?'Installed':'Unassigned');roster.append(tr);
   }
   for(const c of Object.values(r.contracts)){const tr=document.createElement('tr');const employee=r.personnel[c.references.employee[0]]??r.specialists[c.references.employee[0]];cell(tr,employee.name);cell(tr,c.term);cell(tr,c.cyclesRemaining);cell(tr,c.baseWage+' G');cell(tr,c.wage+' G');cell(tr,c.grandfathered?'Grandfathered — no signing debit':'Hired');contracts.append(tr);}
   for(const f of Object.values(r.facilities)){const tr=document.createElement('tr');cell(tr,f.name);cell(tr,f.descriptiveOnly?'Descriptive only — no benefit':'Purchased upgrade');facilities.append(tr);}
   $('economyCapacity').textContent=JSON.stringify(Object.values(r.properties)[0].capacities);
  }else $('economyCapacity').textContent='No economy roster loaded';
  renderAction();
 }
 $('economyPreviewMigration').onclick=act(()=>{plan=store.previewEconomy();setNotice('Read-only economy migration preview prepared. Nothing saved or granted.');});
 $('economyConfirmMigration').onclick=act(()=>{
  if(!plan)throw Error('Preview migration first');const s=store.state;
  if(!window.confirm('Migrate this stable to M2-C? Preserve Gold and owned assets; add grandfathered contracts, valuation metadata and the initial 23-offer market. Export a backup first.'))return;
  const request={id:newId('migration'),profileId:s.profile.id,careerId:s.career.id,type:'career.migrate',maintenanceVersion:1,expectedRevision:plan.expectedRevision,expectedMaintenanceRevision:plan.expectedMaintenanceRevision,sourceSchema:2,targetSchema:3,sourceFingerprint:plan.sourceFingerprint,migrationVersion:plan.migrationVersion,adapterVersion:plan.adapterVersion,generatorVersion:plan.generatorVersion,confirmed:true,effectId:migrationEffect(s.career.id)};
  store.migrateEconomy(request);plan=null;setNotice('Economy migration committed atomically. Gameplay revision and Gold preserved; maintenance advanced once.');
 });
 $('economyExportPreview').onclick=act(()=>{if(!plan)throw Error('Preview migration first');download(plan,'BNT-M2C-migration-preview.json');setNotice('Read-only preview download requested; this is not a career save.');});
 $('economyCommit').onclick=act(()=>{
  const s=store.state,type=$('economyAction').value,p=payload(s),q=quoteEconomy(s,type,p);
  if(!window.confirm(`${ACTIONS[type]}? Cost ${q.cost} Gold and ${q.xpCost} XP; proceeds ${q.credit} Gold. This action is committed immediately.`))return;
  store.transaction({id:newId('economy'),profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:2,type,effectId:q.effectId,delta:q.delta,reason:ACTIONS[type],payload:p});plan=null;setNotice('Economy action committed: '+ACTIONS[type]+'. No management cycle advanced.');
 });
 for(const key of ['economyAction','economyOffer','economyTerm','economyAsset','economyUpgrade','economyService','economyAttribute'])$(key).onchange=renderAction;
 for(const key of ['economyAmount','economyPoints'])$(key).oninput=renderAction;
 return render;
}
