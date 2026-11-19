import {controllerActive} from '../career/championships/controller.js';
import {previewRU4} from '../career/cycles/policy.js';
import { previewRU3 } from '../career/economy/reducers.js';
import { createUninitializedCareer } from '../career/state.js';
import { STARTING_PACKAGES, CATALOG_VERSION, buildPackage, assetId } from '../career/packages.js';
import { assertPristine, initializationEffect, assignmentEffect } from '../career/domain-commands.js';
import { previewRU } from '../career/assembly.js';
const $ = id => document.getElementById(id);
export function mountStableFoundation({store,act,newId,setNotice}) {
  for (const [value,p] of Object.entries(STARTING_PACKAGES)) $('stablePackage').add(new Option(p.name,value));
  function command(type, fields) {
    const s=store.state;
    return {id:newId('domain'),profileId:s.profile.id,careerId:s.career.id,expectedRevision:s.revision,expectedMaintenanceRevision:s.maintenanceRevision,commandVersion:1,type,reason:'M2-B '+type,delta:0,effectId:assignmentEffect(s.career.id,s.revision,s.maintenanceRevision),...fields};
  }
  function currentSelection() { return {driverId:$('stableDriver').value,beastIds:[$('stableBeastA').value,$('stableBeastB').value],chariotId:$('stableChariot').value}; }
  function render() {
    const s=store.state, ready=s?.schema>=2 && s.management.initialized, blocked=['blocked','recovery-required'].includes(store.mode)||store.requiresCheckpoint||s?.career.status==='Failed'||controllerActive(s);
    if (ready) $('stablePackage').value=Object.values(s.management.registries.properties)[0].packageId;
    const packageId=$('stablePackage').value,p=STARTING_PACKAGES[packageId];
    $('stablePackagePreview').textContent=JSON.stringify({catalogVersion:CATALOG_VERSION,...p,purchasePrice:0,property:{tier:'Basic',drivers:2,specialists:0,beasts:4,chariots:1},equipmentEffects:{mass:0,combat:0},facilityEffects:'Descriptive only',initialRU:'Primary driver, Lead A, Lead B, sole chariot; reserves unassigned'},null,2);
    let reason='Create or explicitly migrate to schema 2 first';
    if(s?.schema===2) { try{assertPristine(s);reason='Eligible for explicit one-time initialization';}catch(e){reason=e.message;} }
    $('stableStatus').textContent=ready?'Initialized stable · prospective assembly only · no competition entry':reason;
    $('stableInitialize').disabled=blocked||!s||s.schema!==2||reason!=='Eligible for explicit one-time initialization';
    $('stablePackage').disabled=Boolean(ready);
    const r=ready?s.management.registries:null,a=r?Object.values(r.assignments)[0]:null;
    const controls=[['stableDriver','personnel',a?.driverId],['stableBeastA','beasts',a?.beastIds[0]],['stableBeastB','beasts',a?.beastIds[1]],['stableChariot','chariots',a?.chariotId]];
    for(const [key,kind,preferred] of controls) {
      const select=$(key),old=select.value; select.replaceChildren();
      if(r)for(const asset of Object.values(r[kind]))select.add(new Option(asset.name,asset.id));
      if([...select.options].some(o=>o.value===old))select.value=old;
      else if(preferred)select.value=preferred;
      select.disabled=!ready;
    }
    $('stableRoster').textContent=r?JSON.stringify({package:Object.values(r.properties)[0].packageId,capacities:Object.values(r.properties)[0].capacities,roster:r,lastReceipt:s.transactions.at(-1)},null,2):'No owned assets. Previewing a package grants nothing.';
    const preview=ready?(s.schema>=4?previewRU4:s.schema===3?previewRU3:previewRU)(s,currentSelection(),{assignmentId:a?.id??null}):null;
    $('stableRUPreview').textContent=preview?JSON.stringify(preview,null,2):'Initialize before assembling.';
    $('stableAssemble').disabled=!ready||blocked||!preview?.eligible;
    $('stableDisassemble').disabled=!a||blocked;
  }
  $('stableNewCareer').onclick=act(async()=>{
    const existing=store.state||store.raw!==null||store.quarantine;
    if(existing&&!window.confirm('Replace the loaded career with an empty schema-2 foundation? Export a backup first. Owner Legacy is replaced, never merged.'))return;
    await store.create(createUninitializedCareer({profileId:newId('profile'),careerId:newId('career'),ownerName:$('careerOwnerName').value,careerName:$('careerName').value}),{confirmed:Boolean(existing)});
    setNotice('Empty schema-2 career created. Choose a package and confirm initialization separately.');
  });
  $('stableInitialize').onclick=act(async()=>{
    const s=store.state,packageId=$('stablePackage').value,p=STARTING_PACKAGES[packageId];
    if(!window.confirm(`Initialize this career once with ${p.name}, ${p.gold} Gold and the previewed assets? Package selection cannot be changed after initialization.`))return;
    await store.transaction(command('career.initialize',{packageId,catalogVersion:CATALOG_VERSION,confirmed:true,delta:p.gold,effectId:initializationEffect(s.career.id)}));
    setNotice('Starting stable initialized atomically. Initial RU assembled; no race entered.');
  });
  $('stableAssemble').onclick=act(async()=>{
    const s=store.state,a=Object.values(s.management.registries.assignments)[0];
    await store.transaction(command('ru.assemble',{assignmentId:a?.id??assetId(s.career.id,'ru'),...currentSelection()}));
    setNotice('Prospective RU assembly committed. No Gold, time or fatigue consumed; no competition entry.');
  });
  $('stableDisassemble').onclick=act(async()=>{
    const a=Object.values(store.state.management.registries.assignments)[0];
    await store.transaction(command('ru.disassemble',{assignmentId:a.id}));setNotice('Prospective RU disassembled; owned assets retained.');
  });
  for(const key of ['stablePackage','stableDriver','stableBeastA','stableBeastB','stableChariot'])$(key).onchange=render;
  return render;
}
