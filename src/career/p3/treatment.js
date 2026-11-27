// Phase 3 Treatment: taken INSTEAD of a reward card. The player pays Gold to
// patch up one part of the turnout and keep the Series run alive.
// Mack (2026-11-26): healing is a sacrifice of an Endowment, not automatic.
import {BONUS_TIERS} from '../m4/catalog.js';
import {INJURIES3} from '../economy/catalog.js';
import {integrityStatus} from '../assets.js';

export const TREATMENT = Object.freeze({restore: 35, wear: 10, price: {driver: 120, beast: 90, chariot: 80}});
const cap = n => Math.max(0, Math.min(100, n));
export const treatmentTier = x => BONUS_TIERS[x.economicContextId ?? x.offer?.value?.templateId] ?? 1;
export const TREATMENT_TARGETS = ['driver', 'beast-0', 'beast-1', 'chariot'];

function target(who, key) {
  if (key === 'driver') return {kind: 'driver', asset: who.driver};
  if (key === 'chariot') return {kind: 'chariot', asset: who.chariot};
  const m = /^beast-(\d)$/.exec(key), b = m && who.beasts[Number(m[1])];
  if (!b) throw Error('Unknown treatment target');
  return {kind: 'beast', asset: b};
}
export function treatmentDefinition(x, key, who) {
  const {kind, asset} = target(who, key), price = TREATMENT.price[kind] * treatmentTier(x);
  const verb = kind === 'chariot' ? `Repair ${asset.name}` : `Treat ${asset.name}`;
  const what = kind === 'chariot'
    ? `Restore up to ${TREATMENT.restore} condition and integrity and remove ${TREATMENT.wear} wear.`
    : `Restore up to ${TREATMENT.restore} condition and ease the injury by one level.`;
  return {id: 'p3-treatment-' + key, kind: 'treatment', target: key, price, name: verb, category: 'Treatment', description: `${what} Costs ${price} Gold and replaces this reward.`, weight: 0};
}
export function treatmentPreview(s, x, d, who) {
  const c = treatmentDefinition(x, d.target, who), {kind, asset} = target(who, d.target);
  if (c.id !== d.id || c.price !== d.price) throw Error('Treatment terms changed');
  const hurt = kind === 'chariot' ? asset.condition < 100 || asset.integrity < 100 || asset.wear > 0 : asset.condition < 100 || (asset.injury && asset.injury !== 'Healthy');
  if (!hurt) throw Error('Nothing to treat');
  if (s.career.treasury < c.price) throw Error(`Needs ${c.price} Gold`);
  return c;
}
export function applyTreatment(s, d, who) {
  const {kind, asset} = target(who, d.target);
  s.career.treasury -= d.price;
  if (kind === 'chariot') {
    asset.condition = cap(asset.condition + TREATMENT.restore);
    asset.integrity = cap(asset.integrity + TREATMENT.restore);
    asset.status = integrityStatus(asset.integrity);
    asset.wear = Math.max(0, asset.wear - TREATMENT.wear);
  } else {
    asset.condition = cap(asset.condition + TREATMENT.restore);
    const i = INJURIES3.indexOf(asset.injury);
    if (i > 0) asset.injury = INJURIES3[i - 1];
  }
  return {target: d.target, paid: d.price};
}
