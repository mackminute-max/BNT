import { consequenceDefaults } from '../sim/consequences.js';
import { defaultRU, validateRU, derive } from '../model/ru.js';
import { config } from '../config/config.js';
import { id } from './legacy-state.js';
import { freeze } from './assets.js';
export function previewRU(state, selection, { assignmentId = null } = {}) {
  const reasons = [], r = state.management?.registries;
  if (state.schema !== 2 || !state.management?.initialized || !r) return freeze({ assembled:false, eligible:false, reasons:['Initialize a schema-2 stable first'], native:null, derived:null });
  const { driverId, beastIds, chariotId } = selection ?? {};
  const current = r.assignments[assignmentId];
  const assembled = Boolean(current && current.driverId === driverId && current.chariotId === chariotId && JSON.stringify(current.beastIds) === JSON.stringify(beastIds));
  if (!Array.isArray(beastIds) || beastIds.length !== 2 || new Set(beastIds).size !== 2) reasons.push('Select two distinct beasts');
  const specs = [['personnel',driverId],...(Array.isArray(beastIds)?beastIds:[]).map(id=>['beasts',id]),['chariots',chariotId]];
  for (const [kind, key] of specs) {
    const a = Object.hasOwn(r[kind], key) ? r[kind][key] : null;
    if (!a || a.ownerCareerId !== state.career.id) { reasons.push('Missing or foreign owned '+kind+': '+String(key)); continue; }
    if ((a.references.assignment ?? []).some(key=>key !== assignmentId)) reasons.push('Asset already exclusively assigned: '+a.name);
    if (!a.available) reasons.push('Asset unavailable: '+a.name);
    if (['Severe','Dead'].includes(a.injury) || ['Critical','Destroyed'].includes(a.status)) reasons.push('Ineligible condition: '+a.name);
  }
  if (reasons.length) return freeze({assembled,eligible:false,reasons,native:null,derived:null});
  const driver = r.personnel[driverId], beasts = beastIds.map(id=>r.beasts[id]), chariot = r.chariots[chariotId];
  const native = defaultRU('management-preview');
  if (driver.condition <= consequenceDefaults.disabledCondition || chariot.condition <= consequenceDefaults.disabledCondition || beasts.every(b=>b.condition <= consequenceDefaults.minimumTeamCondition)) reasons.push('Native engine component disable threshold reached');
  native.driver = {...driver.attributes,condition:driver.condition,strain:driver.strain};
  native.beasts = beasts.map(b=>({...b.attributes,condition:b.condition,fatigue:b.fatigue}));
  native.chariot = {...chariot.attributes,condition:chariot.condition,wear:chariot.wear,weight:chariot.weight,capacity:chariot.capacity};
  native.equipment = {mass:0,combat:0};
  for (const key of chariot.references.equipment ?? []) {
    const item = r.equipment[key];
    if (!item || item.ownerCareerId !== state.career.id || item.references.installedOn?.[0] !== chariot.id) reasons.push('Invalid installed equipment');
    else { native.equipment.mass += item.mass; native.equipment.combat += item.combat; }
  }
  try { validateRU(native); } catch(e) { reasons.push(e.message); }
  if (reasons.length) return freeze({assembled,eligible:false,reasons,native:null,derived:null});
  return freeze({assembled,eligible:true,reasons:[],native,derived:derive(native,config()),label:'Baseline / no weather or surface adjustment; not competition entry. Management driver fatigue is not mapped to strain.'});
}
export function applyAssembly(state, tx) {
  const r = state.management.registries, key = tx.assignmentId; id(key);
  if (!state.management.initialized || state.pendingRace !== null) throw Error('Initialized stable without pending checkpoint required');
  const existing = r.assignments[key];
  if (tx.type === 'ru.disassemble' && !existing) throw Error('No assembled RU with this identity');
  if (tx.type === 'ru.assemble') {
    const preview = previewRU(state,tx,{assignmentId:key});
    if (!preview.eligible) throw Error(preview.reasons.join('; '));
    for (const [kind,records] of Object.entries(r)) if (kind !== 'assignments' && Object.hasOwn(records,key)) throw Error('Assignment identity collides with owned asset');
    if ([state.profile.id,state.career.id].includes(key)) throw Error('Assignment identity is reserved');
  }
  if (existing) {
    for (const subject of existing.references.subject) for (const kind of ['personnel','beasts','chariots']) if (r[kind][subject]) r[kind][subject].references.assignment = [];
    delete r.assignments[key];
  }
  if (tx.type === 'ru.assemble') {
    const subjects = [tx.driverId,...tx.beastIds,tx.chariotId];
    r.assignments[key] = {id:key,ownerCareerId:state.career.id,references:{subject:subjects},recordVersion:1,name:'Prospective Racing Unit',kind:'prospectiveRU',driverId:tx.driverId,beastIds:[...tx.beastIds],chariotId:tx.chariotId};
    for (const subject of subjects) for (const kind of ['personnel','beasts','chariots']) if (r[kind][subject]) r[kind][subject].references.assignment = [key];
  }
}
