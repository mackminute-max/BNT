// Phase 3 Boon offers. A Run Reward offer in an M6 career is three cards:
// a Boon, an Active Ability, and a Supplies card (the original Run Rewards).
// Boons last for the championship (they live in x.m4.run, which is cleared at
// settlement or withdrawal) and are handed to the race as `endowments`.
import {BOONS, STYLES, RARITY, LEVEL, ENDOWMENT_RULES, boonStrength} from '../../sim/endowments.js';
import {fingerprint} from '../cycles/contracts.js';

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
  const k = boonStrength(def, level, rarity), fx = def.effect, amount = (fx.amount ?? 0) * k;
  return def.text
    .replaceAll('{seconds}', String(fx.seconds ?? ''))
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

// Rivals carry Boons too (Mack, 2026-11-26): 2 to 5 by tier, mostly from one
// style so each rival plays a recognisable way. Charge Boons are left out
// because rivals have no Active Ability.
export function rivalEndowments(x, entrantId) {
  const tier = x?.m6?.competition?.tier ?? 1, intro = x?.m6?.type === 'intro' || x?.m6?.competition?.type === 'intro';
  const count = intro ? 1 : Math.min(5, tier + 1);
  const h = k => BigInt('0x' + fingerprint(['p3-rival-boons-v1', x.id, entrantId, k]).slice(0, 12));
  const style = STYLES[Number(h('style') % BigInt(STYLES.length))];
  const usable = Object.values(BOONS).filter(b => b.effect.kind !== 'charge');
  const pool = [...usable.filter(b => b.style === style), ...usable.filter(b => b.style === style), ...usable.filter(b => b.style !== style)];
  const picked = [];
  for (let i = 0; picked.length < count && i < 40; i++) { const b = pool[Number(h('pick:' + i) % BigInt(pool.length))]; if (!picked.includes(b)) picked.push(b); }
  const rarity = tier >= 4 ? 'Rare' : 'Common';
  return {rules: ENDOWMENT_RULES, boons: picked.map(b => ({id: b.id, level: 1, rarity}))};
}
