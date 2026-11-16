import { exact, id } from './legacy-state.js';
import { validateTypedRecord, validateStable } from './assets.js';

// Reference scaffolding only. No assets, prices, packages or domain actions are generated here.
export const REGISTRY_LINKS = Object.freeze({
  personnel: { contract: ['contracts'], assignment: ['assignments'] }, specialists: { contract: ['contracts'] }, beasts: { assignment: ['assignments'] },
  chariots: { equipment: ['equipment'], assignment: ['assignments'] }, equipment: { installedOn: ['chariots'] },
  contracts: { employee: ['personnel', 'specialists'] }, candidates: {},
  recruitmentOffers: { candidate: ['candidates'] }, marketOffers: { candidate: ['candidates'] },
  properties: { facilities: ['facilities'] }, facilities: { property: ['properties'] },
  projects: { subject: ['personnel', 'beasts', 'chariots', 'equipment'], specialist: ['specialists'], facility: ['facilities'] },
  assignments: { subject: ['personnel', 'specialists', 'beasts', 'chariots', 'equipment'], project: ['projects'] },
  obligations: { liableEntity: ['personnel', 'specialists', 'contracts', 'properties'] },
  advancementChoices: { subject: ['personnel', 'beasts'] }, achievements: {},
});
export const REGISTRY_NAMES = Object.freeze(Object.keys(REGISTRY_LINKS));
export function emptyManagement() {
  return { initialized: false, registrySchema: 1, registries: Object.fromEntries(REGISTRY_NAMES.map(k => [k, {}])) };
}
export function validateOwnershipGraph(registries, careerId, reservedIds = []) {
  id(careerId); reservedIds.forEach(id); exact(registries, REGISTRY_NAMES, 'management registries');
  const entities = new Map();
  for (const registry of REGISTRY_NAMES) {
    const records = registries[registry];
    if (!records || typeof records !== 'object' || Array.isArray(records) || ![Object.prototype, null].includes(Object.getPrototypeOf(records)) || Object.keys(records).length > 1000) throw Error('Invalid registry ' + registry);
    for (const [key, record] of Object.entries(records)) {
      id(key); if (Object.hasOwn(record, 'recordVersion')) validateTypedRecord(registry, record);
      else exact(record, ['id', 'ownerCareerId', 'references'], 'registry record');
      id(record.id); id(record.ownerCareerId);
      if (record.id !== key || record.ownerCareerId !== careerId || entities.has(key) || key === careerId || reservedIds.includes(key)) throw Error('Duplicate identity or invalid entity ownership');
      if (!record.references || typeof record.references !== 'object' || Array.isArray(record.references) || ![Object.prototype, null].includes(Object.getPrototypeOf(record.references)) || Object.keys(record.references).some(k => !Object.hasOwn(REGISTRY_LINKS[registry], k))) throw Error('Invalid reference relation');
      entities.set(key, { registry, record });
    }
  }
  for (const { registry, record } of entities.values()) for (const [relation, targets] of Object.entries(record.references)) {
    if (!Array.isArray(targets) || targets.length > 1000 || new Set(targets).size !== targets.length || (!['equipment', 'facilities', 'subject'].includes(relation) && targets.length > 1)) throw Error('Invalid reference cardinality');
    for (const target of targets) {
      id(target); const found = entities.get(target);
      if (!found || !REGISTRY_LINKS[registry][relation].includes(found.registry)) throw Error('Dangling or wrong-type entity reference');
    }
  }
  const checkReciprocal = (sourceRegistry, relation, targetRegistry, inverse) => {
    for (const record of Object.values(registries[sourceRegistry])) for (const target of record.references[relation] ?? []) {
      if (!(registries[targetRegistry][target].references[inverse] ?? []).includes(record.id)) throw Error('Nonreciprocal ownership/assignment reference');
    }
  };
  checkReciprocal('chariots', 'equipment', 'equipment', 'installedOn');
  checkReciprocal('equipment', 'installedOn', 'chariots', 'equipment');
  checkReciprocal('properties', 'facilities', 'facilities', 'property');
  checkReciprocal('facilities', 'property', 'properties', 'facilities');
  for (const contract of Object.values(registries.contracts)) {
    if (contract.references.employee?.length !== 1) throw Error('Contract needs one employee reference');
    const employee = entities.get(contract.references.employee[0]).record;
    if (employee.references.contract?.length !== 1 || employee.references.contract[0] !== contract.id) throw Error('Nonreciprocal employment reference');
  }
  for (const kind of ['personnel', 'specialists']) for (const record of Object.values(registries[kind])) for (const target of record.references.contract ?? []) {
    if (registries.contracts[target].references.employee?.[0] !== record.id) throw Error('Conflicting employment reference');
  }
  for (const record of Object.values(registries.facilities)) if (record.references.property?.length !== 1) throw Error('Facility needs one owned property');
  const assigned = new Set();
  for (const record of Object.values(registries.assignments)) {
    if ((record.kind !== 'prospectiveRU' && record.references.project?.length !== 1) || !record.references.subject?.length) throw Error('Assignment needs project and subject references');
    for (const target of record.references.subject) { if (assigned.has(target)) throw Error('Conflicting exclusive assignment'); assigned.add(target); }
  }
  return true;
}
export function validateManagement(management, careerId, profileId) {
  exact(management, ['initialized', 'registrySchema', 'registries'], 'management foundation');
  if (![1, 2].includes(management.registrySchema)) throw Error('Unsupported management registry schema');
  validateOwnershipGraph(management.registries, careerId, profileId ? [profileId] : []);
  if (management.registrySchema === 1) {
    if (management.initialized !== false || REGISTRY_NAMES.some(k => Object.keys(management.registries[k]).length)) throw Error('M2-B initialization requires typed registry schema 2');
  } else {
    if (management.initialized !== true) throw Error('Typed M2-B stable must be initialized');
    validateStable(management.registries);
  }
}
