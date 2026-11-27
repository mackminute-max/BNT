// Favor and Factions (systems phase, Mack 2026-11-27, decisions 6a/6b and 4a).
// Every faction keeps a favor meter from -100 to 100. Favor moves with what you
// do: Series results, where you race, how you bet, and themed quests. It pays
// out through the markets you deal with (regional discounts, unique beasts and
// chariots), a cosmetic banner, and favors you can call in between Series.
import {exact} from '../legacy-state.js';
import {fingerprint} from '../cycles/contracts.js';
import {WORLD_CONTENT} from './world-content.generated.js';

export const FACTION_RULES = 'bnt-factions-v1';
const NATIONS = WORLD_CONTENT.profiles.map(p => p.id);
const nationName = id => WORLD_CONTENT.profiles.find(p => p.id === id)?.name ?? id;
export const FACTIONS = Object.freeze({
  authority: {name: 'Racing Authority', job: 'Cares about clean racing and honest betting.', banner: 'Steward’s Laurel'},
  ring: {name: 'The Bookmakers’ Ring', job: 'Cares about your betting and your Den activity.', banner: 'Gilded Dice'},
  ...Object.fromEntries(NATIONS.map(id => ['house-' + id, {name: 'House of ' + nationName(id), job: `Cares about your results in ${nationName(id)}.`, banner: nationName(id) + ' Colours', nationId: id}])),
});
export const FACTION_IDS = Object.freeze(Object.keys(FACTIONS));
export const STANDINGS = Object.freeze([[-100, 'Hostile'], [-30, 'Wary'], [0, 'Neutral'], [25, 'Friendly'], [60, 'Allied']]);
export const standing = n => STANDINGS.filter(([at]) => n >= at).at(-1)[1];
const clamp = n => Math.max(-100, Math.min(100, Math.round(n)));

// Quests: one at a time per faction, taken from the World tab.
export const QUESTS = Object.freeze({
  'fix-is-in': {faction: 'ring', name: 'The Fix Is In', text: 'Win every race in a Series, then finish last in a later Championship.', favor: 30, gold: 400, stages: 2},
  'high-roller': {faction: 'ring', name: 'High Roller', text: 'Stake 300 Gold in the Race Book before your next Series ends.', favor: 12, gold: 100, stages: 1},
  'clean-sweep': {faction: 'authority', name: 'Clean Sweep', text: 'Finish a Series with no DNF and no one lost.', favor: 15, gold: 150, stages: 1},
  'podium-regular': {faction: 'authority', name: 'Podium Regular', text: 'Finish a Series in the top three.', favor: 12, gold: 150, stages: 1},
  'local-hero': {faction: 'house', name: 'Local Hero', text: 'Win a Series in this nation.', favor: 25, gold: 250, stages: 1},
});
// Favors you can call in between Series.
export const FAVORS = Object.freeze({
  authority: {name: 'Steward’s leniency', text: 'Your next Series entry fee is refunded when you register.', cost: 20},
  ring: {name: 'Bookie’s insurance', text: 'If your next Race Book race loses, your stakes come back.', cost: 20},
  house: {name: 'Local mechanic', text: 'Every chariot regains 30 condition and integrity, and every beast 20 condition, right now.', cost: 20},
});
const kindOf = id => id.startsWith('house-') ? 'house' : id;

export const initialFactions = () => ({version: 1, rules: FACTION_RULES, favor: Object.fromEntries(FACTION_IDS.map(id => [id, 0])), quests: {}, done: [], banner: null, pending: [], stocked: [], log: []});
export const factionsOf = s => s.m6.factions ?? initialFactions();
const ensure = s => (s.m6.factions ??= initialFactions());
function note(f, text) { f.log.unshift(text.slice(0, 200)); f.log = f.log.slice(0, 12); }
export function addFavor(s, id, amount, why) {
  const f = ensure(s), before = f.favor[id];
  f.favor[id] = clamp(before + amount);
  if (amount) note(f, `${FACTIONS[id].name} ${amount > 0 ? '+' : ''}${amount}: ${why}`);
  if (standing(before) !== standing(f.favor[id])) note(f, `${FACTIONS[id].name} is now ${standing(f.favor[id])}.`);
}

// ---- Effects other systems read ---------------------------------------------
// Market discount on recruits and stock from a nation whose House favors you.
export function factionDiscount(s, nationId) {
  const n = s?.m6?.factions?.favor?.['house-' + nationId] ?? 0;
  return n >= 60 ? 20 : n >= 25 ? 10 : 0;
}
// Houses at Allied stock one unique beast or chariot in your home market.
// The list is copied only when the market renews, so the stock stays fixed.
export const eligibleUnique = s => NATIONS.filter(id => (s.m6.factions?.favor?.['house-' + id] ?? 0) >= 60);
export function stockUnique(s) { if (s.m6.factions) s.m6.factions.stocked = eligibleUnique(s).slice(0, 3); }
export const bannersEarned = s => FACTION_IDS.filter(id => (s.m6.factions?.favor?.[id] ?? 0) >= 60);

// ---- Commands ----------------------------------------------------------------
export function takeQuest(s, {questId, factionId}) {
  if (s.championshipFoundation.activeId) throw Error('Take quests between Series');
  const q = QUESTS[questId];
  if (!q || !FACTIONS[factionId] || kindOf(factionId) !== q.faction) throw Error('Unknown quest');
  const f = ensure(s);
  if (f.quests[factionId]) throw Error('Finish that faction’s current quest first');
  if (standing(f.favor[factionId]) === 'Hostile') throw Error('This faction will not deal with you');
  f.quests[factionId] = {questId, stage: 0, staked: 0, nationId: FACTIONS[factionId].nationId ?? null};
  note(f, `Quest taken: ${q.name} for ${FACTIONS[factionId].name}.`);
  return {questId, factionId};
}
export function dropQuest(s, {factionId}) {
  const f = ensure(s);
  if (!f.quests[factionId]) throw Error('No quest to drop');
  delete f.quests[factionId];
  addFavor(s, factionId, -3, 'dropped a quest');
  return {factionId};
}
export function callFavor(s, {factionId}) {
  if (s.championshipFoundation.activeId) throw Error('Call in favors between Series');
  const f = ensure(s), k = kindOf(factionId), fav = FAVORS[k];
  if (!fav || !FACTIONS[factionId]) throw Error('Unknown faction');
  if (f.favor[factionId] < fav.cost) throw Error(`Needs ${fav.cost} favor`);
  if (k !== 'house' && f.pending.includes(k)) throw Error('That favor is already waiting to be used');
  addFavor(s, factionId, -fav.cost, 'called in ' + fav.name);
  if (k === 'house') {
    const r = s.management.registries, cap = n => Math.max(0, Math.min(100, n));
    for (const c of Object.values(r.chariots)) if (c.status !== 'Destroyed' && c.integrity > 0) { c.condition = cap(c.condition + 30); c.integrity = cap(c.integrity + 30); c.status = c.integrity >= 80 ? 'Functional' : c.integrity >= 60 ? 'Light' : c.integrity >= 30 ? 'Moderate' : 'Critical'; }
    for (const b of Object.values(r.beasts)) if (b.available !== false) b.condition = cap(b.condition + 20);
  } else f.pending.push(k);
  return {factionId, favor: fav.name};
}
export function setBanner(s, {factionId}) {
  const f = ensure(s);
  if (factionId !== null && !bannersEarned(s).includes(factionId)) throw Error('Reach Allied with this faction to fly its banner');
  f.banner = factionId;
  return {banner: factionId};
}
// Pending favors, used where they apply.
export function usePending(s, kind) { const f = s.m6.factions; if (!f?.pending.includes(kind)) return false; f.pending = f.pending.filter(k => k !== kind); note(f, `${FAVORS[kind].name} used.`); return true; }

// ---- Hooks --------------------------------------------------------------------
// After every closed Series.
export function factionsAfterSeries(s, x, summary) {
  const f = ensure(s), house = 'house-' + summary.nationId, rows = x.raceResults.flatMap(r => r.rows.filter(row => row.id === x.playerId));
  const raceWins = summary.raceWins, races = x.offer.value.schedule.length, last = summary.placement === x.entrants.length;
  const lost = (x.m6?.casualties ?? []).some(c => c.player);
  if (summary.starts > 0 && !summary.withdrawal) {
    addFavor(s, house, summary.won ? 8 : 3, summary.won ? 'won a Series here' : 'raced a Series here');
    addFavor(s, 'authority', summary.dnf === 0 && !lost ? 3 : 0, 'a clean Series');
  } else if (summary.withdrawal) addFavor(s, house, -2, 'withdrew from a Series');
  for (const [fid, q] of Object.entries({...f.quests})) {
    const d = QUESTS[q.questId];
    let done = false;
    if (q.questId === 'fix-is-in') {
      if (q.stage === 0 && raceWins === races && summary.starts === races) { q.stage = 1; note(f, 'The Fix Is In: every race won. Now lose the next Championship.'); }
      else if (q.stage === 1 && summary.starts > 0 && last) done = true;
    } else if (q.questId === 'high-roller') done = q.staked >= 300;
    else if (q.questId === 'clean-sweep') done = summary.starts > 0 && !summary.withdrawal && summary.dnf === 0 && !lost;
    else if (q.questId === 'podium-regular') done = summary.starts > 0 && !summary.withdrawal && summary.placement <= 3;
    else if (q.questId === 'local-hero') done = summary.won && summary.nationId === q.nationId;
    if (done) {
      delete f.quests[fid]; f.done.push(q.questId + ':' + fid); f.done = f.done.slice(-40);
      s.career.treasury += d.gold;
      addFavor(s, fid, d.favor, 'quest complete: ' + d.name);
    }
  }
  void rows;
}
// Race Book stakes count toward High Roller and build Ring favor.
export function factionsAfterBet(s, stake) {
  const f = s.m6.factions;
  if (f) for (const q of Object.values(f.quests)) if (q.questId === 'high-roller') q.staked += stake;
  if (stake >= 20) addFavor(s, 'ring', Math.min(3, Math.floor(stake / 50) + 1), 'a night at the Race Book');
}
// Betting against your own turnout: the Authority may find out.
export function layCaught(s, w) {
  const roll = parseInt(fingerprint([FACTION_RULES, s.career.id, w.eventId, 'lay']).slice(0, 8), 16) % 100;
  return roll < 35;
}
export function afterLay(s, w, won) {
  if (!won) return;
  if (layCaught(s, w)) { addFavor(s, 'authority', -25, 'caught betting against your own turnout'); addFavor(s, 'ring', 5, 'a profitable arrangement'); }
}

export function validateFactions(s) {
  const f = s.m6.factions;
  if (f === undefined) return;
  exact(f, ['version', 'rules', 'favor', 'quests', 'done', 'banner', 'pending', 'stocked', 'log']);
  if (f.version !== 1 || f.rules !== FACTION_RULES) throw Error('Unsupported faction rules');
  exact(f.favor, FACTION_IDS);
  for (const v of Object.values(f.favor)) if (!Number.isInteger(v) || v < -100 || v > 100) throw Error('Invalid favor');
  for (const [id, q] of Object.entries(f.quests)) if (!FACTIONS[id] || !QUESTS[q.questId] || kindOf(id) !== QUESTS[q.questId].faction) throw Error('Invalid quest');
  if (f.banner !== null && !FACTIONS[f.banner]) throw Error('Invalid banner');
  if (!Array.isArray(f.pending) || f.pending.some(k => !['authority', 'ring'].includes(k)) || !Array.isArray(f.stocked) || f.stocked.some(id => !NATIONS.includes(id)) || !Array.isArray(f.log) || f.log.length > 12 || !Array.isArray(f.done) || f.done.length > 40) throw Error('Invalid faction state');
}
