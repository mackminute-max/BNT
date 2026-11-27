// Mack 2026-11-27: a new stable's starting turnout belongs to its starting
// nation. Drivers are drawn from that nation's main peoples (plus Human; Zarashi
// is High Elf only), every starting beast is the nation's signature species,
// and all names come from that nation's naming traditions. Attributes and
// personalities stay exactly as the starting package defines them.
import {generateIdentity} from '../m5/generation.js';
import {CATALOGS as C} from '../m5/content.generated.js';
import {fingerprint} from '../cycles/contracts.js';

const canonicalAncestry = id => C.ancestryGameplay.find(a => a.id === id)?.canonicalAncestryId;
const canonicalSpecies = id => C.beastSpecies.find(b => b.id === id)?.canonicalSpeciesId;

export function nationPeoples(nationId) {
  if (nationId === 'N8') return [{id: 'A08', weight: 1}];
  const rows = (C.nation.find(n => n.canonicalNationId === nationId)?.ancestryWeights ?? [])
    .map(r => ({id: canonicalAncestry(r.id), weight: r.weight})).filter(r => r.id).sort((a, b) => b.weight - a.weight);
  const others = rows.filter(r => r.id !== 'A01'), bar = Math.max(5, others[1]?.weight ?? Infinity);
  const human = rows.find(r => r.id === 'A01') ?? {id: 'A01', weight: 1};
  return [human, ...others.filter(r => r.weight >= bar)];
}
export function nationSpecies(nationId) {
  const rows = [...(C.nation.find(n => n.canonicalNationId === nationId)?.speciesWeights ?? [])].sort((a, b) => b.weight - a.weight);
  return canonicalSpecies(rows[0]?.id) ?? 'B01';
}
function draw(key, rows) {
  const total = rows.reduce((n, r) => n + r.weight, 0);
  let x = parseInt(fingerprint(key).slice(0, 8), 16) / 0x100000000 * total;
  for (const r of rows) { x -= r.weight; if (x < 0) return r.id; }
  return rows.at(-1).id;
}

// Works on a schema-7 state (s.m5.identities) right after D2 initialization.
export function nationalizeStarters(s, nationId) {
  if (!C.nation.some(n => n.canonicalNationId === nationId)) throw Error('Unknown starting nation');
  const ids = s.m5.identities, r = s.management.registries, peoples = nationPeoples(nationId), speciesId = nationSpecies(nationId);
  const used = Object.values(r.marketOffers ?? {}).map(o => o.name);
  const rename = (asset, name) => {
    asset.name = name; used.push(name);
    for (const contractId of asset.references?.contract ?? []) if (r.contracts[contractId]) r.contracts[contractId].name = name + ' contract';
  };
  const base = (kind, category, extra) => {
    for (const asset of Object.values(r[kind])) {
      const prior = ids[asset.id];
      if (!prior || prior.category !== category) continue;
      const p = generateIdentity([s.career.id, 'm6-national-starter', nationId, asset.id], {
        category, tier: asset.economics.tier, nationId, usedNames: used, nativeRole: asset.role, namingVersion: 2, domestic: true, ...extra(asset),
      });
      for (const k of ['sourceName', 'attributeSource', 'backgroundLabel', 'aiLabel', 'amendment']) if (k in prior) p[k] = prior[k];
      p.attributes = structuredClone(asset.economics.baseAttributes);
      if (category === 'driver') p.personality = structuredClone(asset.personality ?? null);
      ids[asset.id] = p;
      rename(asset, p.name);
    }
  };
  base('personnel', 'driver', asset => ({ancestryId: draw(['m6-starter-ancestry', s.career.id, asset.id], peoples)}));
  base('beasts', 'beast', () => ({speciesId}));
  base('chariots', 'chariot', () => ({}));
  return s;
}
