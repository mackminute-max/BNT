import { checksum } from '../core/determinism.js';
import { driverAttributes, beastAttributes, chariotAttributes } from '../model/ru.js';
import { emptyManagement } from './registries.js';
import { BASIC_CAPACITY, freeze } from './assets.js';
export const CATALOG_VERSION = 3;
const equal = n => Array(n).fill(50);
export const STARTING_PACKAGES = freeze({
  traditional: { name: 'Traditional', gold: 1200, drivers: [equal(5)], beasts: [equal(6), equal(6)], chariot: equal(5), equipment: ['Standard harness', 'Standard wheels'], facility: 'Basic Stable' },
  beastmaster: { name: 'Beastmaster Yard', gold: 850, drivers: [[50,70,40,50,50]], beasts: [[70,60,60,70,70,60],[60,70,60,70,70,60],[50,50,60,60,60,50]], chariot: equal(5), equipment: ['Standard harness', 'Standard wheels'], facility: 'Animal Yard' },
  mechanist: { name: 'Mechanist Workshop', gold: 800, drivers: [[50,40,50,60,50]], beasts: [equal(6),equal(6)], chariot: [70,70,60,70,70], equipment: ['Reinforced harness', 'Precision wheels'], facility: 'Workshop Shed' },
  veteran: { name: 'Veteran Outfit', gold: 650, drivers: [[80,60,60,70,80],[40,50,40,50,50]], beasts: [equal(6),equal(6)], chariot: equal(5), equipment: ['Standard harness', 'Standard wheels'], facility: 'Veteran Quarters' },
  scrappy: { name: 'Scrappy Underdog', gold: 750, drivers: [[40,50,40,50,60],[30,40,40,40,50]], beasts: [[40,50,40,60,40,50],[50,40,40,60,40,50],[40,40,50,60,50,50]], chariot: [40,40,40,40,40], equipment: ['Patched harness', 'Worn wheels'], facility: 'Makeshift Yard' },
});
export function packageById(id) { if (!Object.hasOwn(STARTING_PACKAGES, id)) throw Error('Unknown approved starting package'); return STARTING_PACKAGES[id]; }
export function assetId(careerId, tag) { return 'starter-' + checksum(careerId) + '-' + tag; }
export function buildPackage(careerId, packageId) {
  const p = packageById(packageId), management = emptyManagement(), r = management.registries;
  management.initialized = true; management.registrySchema = 2;
  const aid = tag => assetId(careerId, tag), assignment = aid('ru');
  function record(kind, tag, name, fields, references = {}) {
    const id = aid(tag); r[kind][id] = { id, ownerCareerId: careerId, references, recordVersion: 1, name, ...fields }; return id;
  }
  const attributes = (keys, values) => Object.fromEntries(keys.map((k,i) => [k,values[i]]));
  p.drivers.forEach((values,i) => record('personnel','driver-'+i,p.name+' '+(i ? 'Reserve Driver' : 'Primary Driver'), {role:'driver',attributes:attributes(driverAttributes,values),condition:100,injury:'Healthy',fatigue:0,strain:0,xp:0,available:true}, i ? {} : {assignment:[assignment]}));
  p.beasts.forEach((values,i) => record('beasts','beast-'+i,p.name+' '+(['Lead A','Lead B','Reserve Beast'][i]), {species:'generic_draft_beast',attributes:attributes(beastAttributes,values),condition:100,injury:'Healthy',fatigue:0,xp:0,available:true}, i < 2 ? {assignment:[assignment]} : {}));
  const chariotId = record('chariots','chariot',packageId === 'mechanist' ? 'Workshop-tuned chariot' : packageId === 'scrappy' ? 'Salvaged racing chariot' : 'Standard racing chariot',{attributes:attributes(chariotAttributes,p.chariot),condition:100,wear:0,integrity:100,status:'Functional',weight:180,capacity:400,xp:0,available:true},{equipment:[aid('equipment-0'),aid('equipment-1')],assignment:[assignment]});
  p.equipment.forEach((name,i)=>record('equipment','equipment-'+i,name,{mass:0,combat:0},{installedOn:[chariotId]}));
  record('properties','property','Basic Property',{tier:'Basic',capacities:{...BASIC_CAPACITY},packageId,catalogVersion:CATALOG_VERSION},{facilities:[aid('facility')]});
  record('facilities','facility',p.facility,{descriptiveOnly:true},{property:[aid('property')]});
  const driverId = aid('driver-0'), beastIds = [aid('beast-0'),aid('beast-1')];
  record('assignments','ru','Prospective Racing Unit',{kind:'prospectiveRU',driverId,beastIds,chariotId},{subject:[driverId,...beastIds,chariotId]});
  return management;
}
export function initializationResult(careerId, packageId) {
  const management = buildPackage(careerId,packageId);
  return { packageId, catalogVersion: CATALOG_VERSION, treasuryGrant: packageById(packageId).gold,
    grantedIds: Object.values(management.registries).flatMap(r=>Object.keys(r)).sort() };
}
