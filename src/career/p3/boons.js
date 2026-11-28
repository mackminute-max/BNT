// Phase 3 Boon offers. An Endowment offer in an M6 career is three cards:
// a Boon, an Active Ability, and a Supplies card (the original Endowments).
// Boons last for the championship (they live in x.m4.run, which is cleared at
// settlement or withdrawal) and are handed to the race as `endowments`.
import {BOONS, STYLES, RARITY, LEVEL, ENDOWMENT_RULES, boonStrength, boonAmount, boonSeconds} from '../../sim/endowments.js';
import {fingerprint} from '../cycles/contracts.js';
import {ABILITIES as ABILITY_IDS, ABILITY_SLOTS as ABILITY_SLOT_LIMIT, M6_P1_INTERACTION} from '../../sim/m6-interaction.js';

export const P3_OFFER_RULES = 'p3-offers-v1';
export const RARITY_WEIGHTS = Object.freeze({Common: 70, Rare: 24, Epic: 6});
export const PACT_CHANCE = 4; // one Boon card in four is a Blood Pact
export const PACT_COST = 12;  // condition taken from the driver and both beasts
const NEXT_RARITY = {Common: 'Rare', Rare: 'Epic', Epic: 'Epic'};
const RANK = {Common: 0, Rare: 1, Epic: 2};

export const ownedBoons = x => (x?.m4?.run ?? []).filter(d => d.kind === 'boon');
export const styleCounts = x => Object.fromEntries(STYLES.map(st => [st, ownedBoons(x).filter(b => BOONS[b.boonId].style === st).length]));
export function endowmentsFor(x) {
  const boons = ownedBoons(x).map(b => ({id: b.boonId, level: b.level, rarity: b.rarity}));
  return boons.length ? {rules: ENDOWMENT_RULES, boons} : null;
}

const pct = n => Math.round(n * 100) + '%';
// Card text with numbers filled in for this level and rarity.
export function boonText(def, level, rarity) {
  const fx = def.effect, amount = boonAmount(def, level, rarity);
  return def.text
    .replaceAll('{seconds}', String(boonSeconds(def, level, rarity) ?? ''))
    .replaceAll('{amount}', String(Math.round(amount * 10) / 10))
    .replaceAll('{combat}', pct(amount)).replaceAll('{speed}', pct(amount)).replaceAll('{accel}', pct(amount))
    .replaceAll('{handling}', pct(amount)).replaceAll('{shield}', pct(amount));
}

export function boonDefinition(x, boonId, rarity, pact) {
  const def = BOONS[boonId];
  if (!def || !Object.hasOwn(RARITY, rarity)) throw Error('Unknown Boon');
  const owned = ownedBoons(x).find(b => b.boonId === boonId);
  const level = (owned?.level ?? 0) + 1;
  if (level > LEVEL.length) throw Error('This Boon is at its highest level');
  const shown = owned && RANK[owned.rarity] > RANK[rarity] ? owned.rarity : rarity;
  const roman = ['', ' II', ' III', ' IV'][level - 1];
  return {
    id: 'p3-boon-' + boonId, kind: 'boon', boonId, rarity, level, pact: !!pact, style: def.style,
    name: (pact ? 'Blood Pact: ' : '') + def.name + roman,
    category: `${def.style} Boon · ${shown}${owned ? ' · upgrade' : ''}`,
    description: boonText(def, level, shown) + (pact ? ` Costs ${PACT_COST} condition from your driver and both beasts now.` : ''),
    weight: 10,
  };
}

// Deterministic draw: `roll(i)` returns a big non-negative integer for draw i.
export function drawBoon(x, roll) {
  const counts = styleCounts(x), pool = [];
  for (const def of Object.values(BOONS)) {
    const owned = ownedBoons(x).find(b => b.boonId === def.id);
    if (owned && owned.level >= LEVEL.length) continue;
    pool.push({def, weight: (counts[def.style] ? 20 : 10) + (owned ? 5 : 0)});
  }
  if (!pool.length) return null;
  const total = pool.reduce((n, p) => n + p.weight, 0);
  let pick = Number(roll(0) % BigInt(total)), j = 0;
  for (; j < pool.length - 1; j++) { if (pick < pool[j].weight) break; pick -= pool[j].weight; }
  const r = Number(roll(1) % 100n);
  let rarity = r < RARITY_WEIGHTS.Common ? 'Common' : r < RARITY_WEIGHTS.Common + RARITY_WEIGHTS.Rare ? 'Rare' : 'Epic';
  const pact = roll(2) % BigInt(PACT_CHANCE) === 0n;
  if (pact) rarity = NEXT_RARITY[rarity];
  return boonDefinition(x, pool[j].def.id, rarity, pact);
}

// Checks a Boon card against current state and returns its canonical form.
export function boonPreviewDefinition(x, d, {driver, beasts}) {
  const c = boonDefinition(x, d.boonId, d.rarity, d.pact);
  if (c.id !== d.id || c.level !== d.level) throw Error('Boon terms changed');
  if (c.pact && [driver, ...beasts].some(a => a.condition <= PACT_COST + 5)) throw Error('Your team is too hurt to pay this Blood Pact');
  return c;
}

export function applyBoon(x, d, {driver, beasts}) {
  const run = x.m4.run, i = run.findIndex(b => b.kind === 'boon' && b.boonId === d.boonId);
  const prior = i >= 0 ? run[i] : null;
  const entry = {kind: 'boon', boonId: d.boonId, level: d.level, rarity: prior && RANK[prior.rarity] > RANK[d.rarity] ? prior.rarity : d.rarity};
  if (i >= 0) run[i] = entry; else run.push(entry);
  if (d.pact) for (const a of [driver, ...beasts]) a.condition = Math.max(1, a.condition - PACT_COST);
  return {boon: entry, pactCost: d.pact ? PACT_COST : 0};
}

// Rivals earn Endowments the way the player does (Mack, 2026-11-27): one per
// race they have run in this Series, drawn from the same Boon and Active
// Ability pools. Each rival leans toward one style. A repeat upgrades what it
// already holds. Replacement teams start fresh, because they have run no races
// yet. Deterministic from the Series id, the rival and the race count.
export const RIVAL_ENDOWMENT_RULES = 'p3-rival-endowments-v2';
export function rivalRacesRun(x, entrantId) {
  return (x?.raceResults ?? []).filter(r => r.kind !== 'NoStarters' && r.rows?.some(row => row.id === entrantId)).length;
}
export function rivalLoadout(x, entrantId) {
  const races = rivalRacesRun(x, entrantId);
  const h = k => BigInt('0x' + fingerprint([RIVAL_ENDOWMENT_RULES, x.id, entrantId, k]).slice(0, 12));
  const style = STYLES[Number(h('style') % BigInt(STYLES.length))];
  const combat = x?.m6?.competition?.events?.some?.(e => e?.format === 'Combat') ?? true;
  const boons = [], abilities = [];
  for (let k = 0; k < races; k++) {
    const wantsAbility = abilities.length < ABILITY_SLOT_LIMIT && Number(h('kind:' + k) % 100n) < 35;
    if (wantsAbility) {
      const pool = Object.keys(ABILITY_IDS).filter(id => combat || id !== 'savage-assault');
      const id = pool[Number(h('ability:' + k) % BigInt(pool.length))], held = abilities.find(a => a.id === id);
      if (held) held.level = Math.min(3, held.level + 1); else abilities.push({id, level: 1});
      continue;
    }
    const weighted = [];
    for (const b of Object.values(BOONS)) {
      if (b.effect.kind === 'charge' && !abilities.length) continue;
      const held = boons.find(x => x.id === b.id);
      if (held && held.level >= LEVEL.length) continue;
      weighted.push({b, w: (b.style === style ? 3 : 1) * 10 + (held ? 5 : 0)});
    }
    if (!weighted.length) continue;
    let pick = Number(h('boon:' + k) % BigInt(weighted.reduce((n, p) => n + p.w, 0))), j = 0;
    for (; j < weighted.length - 1; j++) { if (pick < weighted[j].w) break; pick -= weighted[j].w; }
    const r = Number(h('rarity:' + k) % 100n), rarity = r < RARITY_WEIGHTS.Common ? 'Common' : r < RARITY_WEIGHTS.Common + RARITY_WEIGHTS.Rare ? 'Rare' : 'Epic';
    const held = boons.find(x => x.id === weighted[j].b.id);
    if (held) { held.level++; if (RANK[rarity] > RANK[held.rarity]) held.rarity = rarity; }
    else boons.push({id: weighted[j].b.id, level: 1, rarity});
  }
  return {style, boons, abilities};
}
export function rivalEndowments(x, entrantId) {
  const {boons} = rivalLoadout(x, entrantId);
  return boons.length ? {rules: ENDOWMENT_RULES, boons} : null;
}
// Race input for a rival's Active Abilities (null when it holds none).
export function rivalAbilityContext(x, entrantId) {
  const {abilities} = rivalLoadout(x, entrantId);
  return abilities.length ? {version: 3, interactionRules: M6_P1_INTERACTION, abilityId: abilities[0].id, abilities, signBonus: 0, wearMultiplier: 1} : null;
}
