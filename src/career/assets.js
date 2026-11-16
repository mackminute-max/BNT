import { exact } from './legacy-state.js';
import { driverAttributes, beastAttributes, chariotAttributes } from '../model/ru.js';
export const BASIC_CAPACITY = Object.freeze({ drivers: 2, specialists: 0, beasts: 4, chariots: 1 });
export const INJURIES = Object.freeze(['Healthy', 'Minor', 'Moderate', 'Severe', 'Dead']);
export function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
function number(value, lo = 0, hi = 100) { if (!Number.isFinite(value) || value < lo || value > hi) throw Error('Invalid native asset number'); }
function stats(value, keys) { exact(value, keys, 'native attributes'); Object.values(value).forEach(v => number(v)); }
export function integrityStatus(n) { number(n); return n >= 80 ? 'Functional' : n >= 60 ? 'Light' : n >= 30 ? 'Moderate' : n > 0 ? 'Critical' : 'Destroyed'; }
export function validateTypedRecord(kind, r) {
  const fields = {
    personnel: ['role', 'attributes', 'condition', 'injury', 'fatigue', 'strain', 'xp', 'available'],
    beasts: ['species', 'attributes', 'condition', 'injury', 'fatigue', 'xp', 'available'],
    chariots: ['attributes', 'condition', 'wear', 'integrity', 'status', 'weight', 'capacity', 'xp', 'available'],
    equipment: ['mass', 'combat'], properties: ['tier', 'capacities', 'packageId', 'catalogVersion'], facilities: ['descriptiveOnly'],
    assignments: ['kind', 'driverId', 'beastIds', 'chariotId'],
  }[kind];
  if (!fields) throw Error('Registry content is outside M2-B');
  exact(r, ['id', 'ownerCareerId', 'references', 'recordVersion', 'name', ...fields], 'typed M2-B ' + kind);
  if (r.recordVersion !== 1 || typeof r.name !== 'string' || !r.name.trim() || r.name.length > 100) throw Error('Invalid asset version/name');
  if (kind === 'personnel' || kind === 'beasts') {
    stats(r.attributes, kind === 'personnel' ? driverAttributes : beastAttributes);
    number(r.condition); number(r.fatigue);
    if (!INJURIES.includes(r.injury)) throw Error('Invalid injury label');
    if (kind === 'personnel') { if (r.role !== 'driver') throw Error('Only drivers supported in M2-B'); number(r.strain); }
    else if (r.species !== 'generic_draft_beast') throw Error('Unsupported management beast type');
  }
  if (kind === 'chariots') {
    stats(r.attributes, chariotAttributes); number(r.condition); number(r.wear); number(r.integrity);
    if (r.status !== integrityStatus(r.integrity)) throw Error('Inconsistent management integrity/status');
    number(r.weight, 1, 5000); number(r.capacity, 1, 10000);
  }
  if (['personnel', 'beasts', 'chariots'].includes(kind) && (r.xp !== 0 || typeof r.available !== 'boolean')) throw Error('Invalid M2-B XP/availability');
  if (kind === 'equipment' && (r.mass !== 0 || r.combat !== 0)) throw Error('M2-B equipment must remain neutral');
  if (kind === 'facilities' && r.descriptiveOnly !== true) throw Error('M2-B facilities have no mechanical effects');
  if (kind === 'properties') {
    exact(r.capacities, Object.keys(BASIC_CAPACITY), 'Basic capacities');
    if (r.tier !== 'Basic' || Object.keys(BASIC_CAPACITY).some(k => r.capacities[k] !== BASIC_CAPACITY[k]) || r.catalogVersion !== 3 || typeof r.packageId !== 'string') throw Error('Invalid Basic property/catalog');
  }
  if (kind === 'assignments' && (r.kind !== 'prospectiveRU' || !Array.isArray(r.beastIds) || r.beastIds.length !== 2 || new Set(r.beastIds).size !== 2)) throw Error('RU requires two distinct beasts');
}
export function validateStable(registries) {
  const list = k => Object.values(registries[k]);
  if (list('properties').length !== 1 || list('facilities').length !== 1) throw Error('M2-B requires one Basic property and descriptive facility');
  for (const [kind, records] of Object.entries(registries)) for (const r of Object.values(records)) validateTypedRecord(kind, r);
  for (const [kind, cap] of [['personnel', 'drivers'], ['specialists', 'specialists'], ['beasts', 'beasts'], ['chariots', 'chariots']]) if (list(kind).length > BASIC_CAPACITY[cap]) throw Error('Basic property capacity exceeded: ' + kind);
  for (const r of list('personnel').concat(list('beasts'), list('chariots'))) {
    const assigned = list('assignments').filter(a => a.references.subject.includes(r.id)).map(a => a.id).sort();
    if (JSON.stringify([...(r.references.assignment ?? [])].sort()) !== JSON.stringify(assigned)) throw Error('Nonreciprocal RU assignment');
  }
  for (const a of list('assignments')) {
    const expected = [a.driverId, ...a.beastIds, a.chariotId];
    if (a.references.subject.length !== 4 || expected.some(id => !a.references.subject.includes(id)) || new Set(expected).size !== 4 || !registries.personnel[a.driverId] || !registries.chariots[a.chariotId] || a.beastIds.some(id => !registries.beasts[id])) throw Error('Invalid typed RU assignment');
  }
}
