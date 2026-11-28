// Factions (Phase 4c rework, Mack 2026-11-27). Reputation is a currency.
//  - Your career Reputation stays a lifetime total (it still gates Series and
//    markets). The Reputation you spend comes out of a wallet: lifetime minus spent.
//  - Each faction tracks the Reputation you EARNED its way: at its preferred
//    tracks and in its preferred format, plus its quests and its own actions
//    (the old Favor actions). That earned total is your standing with it, and it
//    caps how much Reputation you can spend on that faction. Spending never
//    lowers standing.
//  - Each faction sells unlocks (favors, market perks, a banner, its unique stock)
//    and, as the marquee unlock, a signature Endowment in three tiers.
// Every nation has a faction of its own (its racing house), plus two that span
// the continent: the Racing Authority and the Bookmakers' Ring.
import {trainingRepSpent} from './stable-care.js';
import {upgradeSpent} from './upgrades.js';
import {exact} from '../legacy-state.js';
import {fingerprint} from '../cycles/contracts.js';
import {WORLD_CONTENT} from './world-content.generated.js';

export const FACTION_RULES = 'bnt-factions-v2';
const NATIONS = WORLD_CONTENT.profiles.map(p => p.id);
const nationName = id => WORLD_CONTENT.profiles.find(p => p.id === id)?.name ?? id;

// prefers: track kinds and formats this faction rewards, and the exact track types
// (Short Oval, Grand Oval, Long Rally...) its quests name. questFormats: formats its
// quests name when it rewards any format. boon: its signature Endowment.
const F = (name, job, prefers, banner, boon, extra = {}) => ({name, job, prefers, banner, boon, ...extra});
export const FACTIONS = Object.freeze({
  authority: F('Racing Authority', 'The stewards of Vaern. They reward clean Pure racing and honest betting.', {formats: ['Pure'], types: ['Oval', 'Grand Oval', 'Circuit']}, 'Steward’s Laurel', 'stewards-blessing'),
  ring: F('The Bookmakers’ Ring', 'Odds-makers in every city. They reward Combat racing and money on the table.', {formats: ['Combat'], types: ['Short Oval', 'Short Rally', 'Oval']}, 'Gilded Dice', 'house-edge'),
  'house-N1': F('The Six Banners Council', 'Northreach’s six territories, forever arguing. They respect hard Circuit racing.', {kinds: ['Circuit'], questFormats: ['Combat', 'Pure'], types: ['Circuit']}, 'Six Banners', 'banner-charge', {nationId: 'N1'}),
  'house-N2': F('The Twin Crown Court', 'Frosthall’s royal racing court. They prize disciplined Pure racing on the Oval.', {kinds: ['Oval'], formats: ['Pure'], types: ['Oval', 'Grand Oval']}, 'Twin Crowns', 'crown-discipline', {nationId: 'N2'}),
  'house-N3': F('The Commonwealth Turf Club', 'Greenvale’s gentlemen breeders. They love long Circuits and well-kept beasts.', {kinds: ['Circuit'], formats: ['Pure'], types: ['Circuit', 'Long Rally']}, 'Green Turf', 'greenvale-stride', {nationId: 'N3'}),
  'house-N4': F('The Forge-Clan Circle', 'Ironhold’s clan chiefs. They want iron, blood and Combat on the Oval.', {kinds: ['Oval'], formats: ['Combat'], types: ['Short Oval', 'Oval']}, 'Anvil and Chain', 'anvil-hide', {nationId: 'N4'}),
  'house-N5': F('The Sundaran League Office', 'The league that runs the Prestige of Prestiges. Only champions on every track impress them.', {kinds: ['Oval', 'Circuit', 'Rally'], questFormats: ['Pure', 'Combat'], types: ['Grand Oval', 'Circuit', 'Long Rally']}, 'Sundaran Sun', 'league-pedigree', {nationId: 'N5'}),
  'house-N6': F('The Grand Moot', 'Karthen’s gathering of hordes. They want long Rallies and Combat.', {kinds: ['Rally'], formats: ['Combat'], types: ['Long Rally', 'Medium Rally']}, 'Horde Standard', 'horde-fury', {nationId: 'N6'}),
  'house-N7': F('The Velmoran Merchant Syndicate', 'Velmora’s money men. They back tidy Pure racing on the Oval, and they pay well.', {kinds: ['Oval'], formats: ['Pure'], types: ['Oval', 'Short Oval']}, 'Syndicate Seal', 'paid-escort', {nationId: 'N7'}),
  'house-N8': F('The Court of Zaraveth', 'The Zarashi throne’s racing court. They love Rallies across open sand.', {kinds: ['Rally'], questFormats: ['Pure', 'Combat'], types: ['Short Rally', 'Long Rally']}, 'Crown of Sands', 'sandstorm-veil', {nationId: 'N8'}),
});
export const FACTION_IDS = Object.freeze(Object.keys(FACTIONS));
const kindOf = id => id.startsWith('house-') ? 'house' : id;
export const factionForNation = nationId => 'house-' + nationId;

// Standing names now follow earned Reputation (never lowered by spending).
export const STANDINGS = Object.freeze([[0, 'Unknown'], [25, 'Known'], [75, 'Respected'], [150, 'Honoured'], [300, 'Legend']]);
export const standing = n => STANDINGS.filter(([at]) => n >= at).at(-1)?.[1] ?? 'Unknown';

// ---- Unlocks ------------------------------------------------------------------
// need: earned Reputation with the faction. cost: Reputation spent. repeat: a
// favor that can be bought again once used. Tiers of the signature Endowment
// unlock the faction's Boon in your Endowment offers at that tier.
const U = (id, name, text, cost, need, extra = {}) => ({id, name, text, cost, need, ...extra});
const FAVOR = {
  authority: U('favor', 'Steward’s leniency', 'Your next Series entry fee is refunded when you register.', 15, 0, {repeat: true, pending: 'authority'}),
  ring: U('favor', 'Bookie’s insurance', 'If your next Race Book race loses, your stakes come back.', 15, 0, {repeat: true, pending: 'ring'}),
  house: U('favor', 'Local mechanic', 'Every chariot regains 30 condition and integrity, and every beast 20 condition, right now.', 15, 0, {repeat: true}),
};
const ENDOWMENT_TIERS = [U('boon-1', 'Signature Endowment I', '', 30, 50), U('boon-2', 'Signature Endowment II', '', 60, 150), U('boon-3', 'Signature Endowment III', '', 100, 300)];
export function unlocksFor(id) {
  const k = kindOf(id), f = FACTIONS[id];
  const list = [FAVOR[k]];
  if (k === 'house') list.push(
    U('discount-1', 'Trade terms', `10% off recruits and stock from ${nationName(f.nationId)} in your markets.`, 25, 30),
    U('discount-2', 'Preferred buyer', `20% off recruits and stock from ${nationName(f.nationId)} (replaces Trade terms).`, 50, 90, {after: 'discount-1'}),
    U('unique', 'House stock', `${f.name} sends one unique beast or chariot to your Home Market at each renewal.`, 60, 120),
  );
  if (k === 'authority') list.push(U('ledger', 'Clean ledger', 'Your next time caught betting against your own turnout costs no standing.', 20, 40, {repeat: true, pending: 'ledger'}));
  if (k === 'ring') list.push(U('odds', 'Inside odds', 'The Race Book shows you the house’s true win chances before you bet, for the rest of the career.', 35, 60));
  list.push(U('banner', 'Banner', `Fly the “${f.banner}” banner over your stable.`, 20, 40));
  for (const t of ENDOWMENT_TIERS) list.push({...t, text: `${FACTION_BOON_TEXT[f.boon] ?? ''} Tier ${t.id.slice(-1)}: appears in your Endowment offers at Level ${t.id.slice(-1)}.`, after: t.id === 'boon-1' ? undefined : 'boon-' + (Number(t.id.slice(-1)) - 1)});
  return list;
}
// Plain words for each faction's Boon (filled in by the Boon catalog at import).
export const FACTION_BOON_TEXT = {};

// ---- Quests ---------------------------------------------------------------------
// Phase 4c rework (Mack 2026-11-27): every quest names its exact requirement
// ("Win a Combat race on a Short Oval"). Each faction has a pool built from its
// preferred formats and track types; three of them are offered at a time and the
// offer rotates after every Series. A House's quests pay in full in its own nation
// and half anywhere else. At most three quests are active at once (one per faction),
// and only active quests earn credit.
// check(ctx): ctx = {summary, races:[{format, kind, type, finished, place, dnf}], lost}
export const QUEST_LIMIT = 3;
export const QUESTS_OFFERED = 3;
const TYPE_BY_GEOMETRY = {'geometry.short-oval': 'Short Oval', 'geometry.oval': 'Oval', 'geometry.grand-oval': 'Grand Oval', 'geometry.generated-short': 'Short Rally', 'geometry.generated-medium': 'Medium Rally', 'geometry.generated-long': 'Long Rally', 'geometry.drag-strip': 'Drag Strip', 'geometry.joust-lists': 'Jousting Lists'};
export const trackType = (geometryId, kind) => TYPE_BY_GEOMETRY[geometryId] ?? (/^geometry\.c\d/.test(geometryId ?? '') ? 'Circuit' : kind ?? 'Oval');
const an = w => (/^[AEIOU]/.test(w) ? 'an ' : 'a ') + w;
const fits = (format, type) => r => (format === 'any' || r.format === format) && (type === 'any' || r.type === type);
const what = (format, type, plural) => `${format === 'any' ? '' : format + ' '}${plural ? 'races' : 'race'}${type === 'any' ? '' : ' on ' + an(type)}`;
const wins = (ctx, f = () => true) => ctx.races.filter(r => r.finished && r.place === 1 && f(r)).length;
const podiums = (ctx, f) => ctx.races.filter(r => r.finished && r.place <= 3 && f(r)).length;
const label = (ty, name) => ty === 'any' ? name : `${ty} ${name}`;
const seriesDone = c => c.summary.starts > 0 && !c.summary.withdrawal;
// Templates. Parameterised ones take "template|format|type".
const TEMPLATES = {
  // Counting quests add up across Series, but only while the quest is active.
  'win-1': (fm, ty) => ({name: label(ty, 'Proving Run'), text: `Win ${an(what(fm, ty))}.`, rep: 12, gold: 120, need: 1, count: c => wins(c, fits(fm, ty))}),
  'win-2': (fm, ty) => ({name: label(ty, 'Brace of Laurels'), text: `Win two ${what(fm, ty, true)}.`, rep: 22, gold: 240, need: 2, count: c => wins(c, fits(fm, ty))}),
  'podium-3': (fm, ty) => ({name: label(ty, 'Steady Hand'), text: `Finish in the top three in three ${what(fm, ty, true)}.`, rep: 18, gold: 180, need: 3, count: c => podiums(c, fits(fm, ty))}),
  'series-win': () => ({name: 'Champion’s Ride', text: 'Win a Series.', rep: 25, gold: 250, check: c => seriesDone(c) && c.summary.won}),
  'series-podium': () => ({name: 'Podium Regular', text: 'Finish a Series in the top three.', rep: 12, gold: 150, check: c => seriesDone(c) && c.summary.placement <= 3}),
  'iron-season': () => ({name: 'Iron Season', text: 'Finish every race of a Series without a DNF.', rep: 15, gold: 150, check: c => seriesDone(c) && c.summary.dnf === 0}),
  'clean-sweep': () => ({name: 'Clean Sweep', text: 'Finish a Series with no DNF and no one lost.', rep: 15, gold: 150, check: c => seriesDone(c) && c.summary.dnf === 0 && !c.lost}),
  'fix-is-in': () => ({name: 'The Fix Is In', text: 'Win every race in a Series, then finish last in a later Championship.', rep: 30, gold: 400, stages: 2, check: null}),
  'high-roller': () => ({name: 'High Roller', text: 'Stake 300 Gold in the Race Book before your next Series ends.', rep: 12, gold: 100, check: null}),
};
const GENERIC = {house: ['series-win', 'series-podium', 'iron-season'], authority: ['clean-sweep', 'series-podium', 'iron-season'], ring: ['fix-is-in', 'high-roller', 'series-win']};
// Quests taken before the rework keep working under their new wording.
const LEGACY = {'local-hero': () => 'series-win', 'podium-regular': () => 'series-podium', 'pure-form': () => 'win-2|Pure|any', 'blood-money': () => 'win-2|Combat|any', 'home-track': id => `win-1|any|${FACTIONS[id].prefers.types[0]}`};
export function questPool(id) {
  const p = FACTIONS[id].prefers, formats = p.questFormats ?? p.formats ?? ['any'], out = [];
  for (const fm of formats) for (const ty of p.types) out.push(`win-1|${fm}|${ty}`, `win-2|${fm}|${ty}`, `podium-3|${fm}|${ty}`);
  return out.concat(GENERIC[kindOf(id)]);
}
export function questDef(id, questId) {
  if (!FACTIONS[id] || typeof questId !== 'string') return null;
  const key = LEGACY[questId]?.(id) ?? questId, [tpl, fm, ty] = key.split('|');
  if (!TEMPLATES[tpl] || !(LEGACY[questId] || questPool(id).includes(questId))) return null;
  return {id: questId, faction: kindOf(id), ...TEMPLATES[tpl](fm, ty)};
}
// A House pays half outside its own nation; the other factions have no nation.
export const questReward = (id, d, nationId) => { const away = FACTIONS[id].nationId && nationId && FACTIONS[id].nationId !== nationId; return {rep: away ? Math.floor(d.rep / 2) : d.rep, gold: away ? Math.floor(d.gold / 2) : d.gold, away: !!away}; };
// Three offers per faction, reshuffled after every Series.
export function questOffers(s, id) {
  const turn = s.m6.closedThrough ?? 0, key = q => fingerprint([FACTION_RULES, s.career.id, turn, id, q]);
  return questPool(id).map(q => [key(q), q]).sort((a, b) => a[0] < b[0] ? -1 : 1).slice(0, QUESTS_OFFERED).map(([, q]) => q);
}
// Kept for callers that list quests by id.
export const QUESTS = new Proxy({}, {get: (_, k) => typeof k === 'string' ? questDef(FACTION_IDS.find(id => questDef(id, k)) ?? 'authority', k) ?? undefined : undefined});

export const initialFactions = () => ({version: 2, rules: FACTION_RULES, earned: Object.fromEntries(FACTION_IDS.map(id => [id, 0])), spentOn: Object.fromEntries(FACTION_IDS.map(id => [id, 0])), spent: 0, owned: Object.fromEntries(FACTION_IDS.map(id => [id, []])), quests: {}, done: [], banner: null, pending: [], stocked: [], log: []});
// Older careers (favor meters) carry their positive favor over as earned Reputation.
function upgrade(f) {
  if (f?.version === 2) return f;
  const n = initialFactions();
  if (f?.favor) for (const id of FACTION_IDS) n.earned[id] = Math.max(0, f.favor[id] ?? 0);
  if (f) { n.quests = f.quests ?? {}; n.done = f.done ?? []; n.log = f.log ?? []; }
  for (const [id, q] of Object.entries(n.quests)) if (!questDef(id, q.questId)) delete n.quests[id];
  return n;
}
export const factionsOf = s => upgrade(s.m6.factions);
const ensure = s => (s.m6.factions = upgrade(s.m6.factions));
function note(f, text) { f.log.unshift(text.slice(0, 200)); f.log = f.log.slice(0, 12); }
export const wallet = s => Math.max(0, (s.championshipFoundation?.facts?.reputation ?? 0) - (s.m6.factions?.spent ?? 0) - upgradeSpent(s) - trainingRepSpent(s));
export const credit = (s, id) => { const f = factionsOf(s); return Math.max(0, f.earned[id] - f.spentOn[id]); };
export const owns = (s, id, unlockId) => !!s?.m6?.factions?.owned?.[id]?.includes(unlockId);

// Earned Reputation with one faction (quests, faction actions, Series credit).
export function addEarned(s, id, amount, why) {
  const f = ensure(s), before = f.earned[id];
  f.earned[id] = Math.max(0, Math.round(before + amount));
  if (amount) note(f, `${FACTIONS[id].name} ${amount > 0 ? '+' : ''}${amount}: ${why}`);
  if (standing(before) !== standing(f.earned[id])) note(f, `You are now ${standing(f.earned[id])} with ${FACTIONS[id].name}.`);
}
export const addFavor = addEarned; // older callers (Trackside Events)

// ---- Effects other systems read ---------------------------------------------
export function factionDiscount(s, nationId) {
  const id = factionForNation(nationId);
  return owns(s, id, 'discount-2') ? 20 : owns(s, id, 'discount-1') ? 10 : 0;
}
export const eligibleUnique = s => NATIONS.filter(id => owns(s, factionForNation(id), 'unique'));
export function stockUnique(s) { if (s.m6.factions) s.m6.factions.stocked = eligibleUnique(s).slice(0, 3); }
export const bannersEarned = s => FACTION_IDS.filter(id => owns(s, id, 'banner'));
export const insideOdds = s => owns(s, 'ring', 'odds');
// Highest signature Endowment tier unlocked per faction: [{factionId, boonId, tier}].
export function factionBoons(s) {
  return FACTION_IDS.flatMap(id => { const t = [3, 2, 1].find(n => owns(s, id, 'boon-' + n)); return t ? [{factionId: id, boonId: FACTIONS[id].boon, tier: t}] : []; });
}

// ---- Commands ----------------------------------------------------------------
export function takeQuest(s, {questId, factionId}) {
  if (s.championshipFoundation.activeId) throw Error('Take quests between Series');
  const q = questDef(factionId, questId);
  if (!q || LEGACY[questId]) throw Error('Unknown quest');
  const f = ensure(s);
  if (f.quests[factionId]) throw Error('Finish that faction’s current quest first');
  if (Object.keys(f.quests).length >= QUEST_LIMIT) throw Error(`You already have ${QUEST_LIMIT} active quests. Finish or drop one first`);
  f.quests[factionId] = {questId, stage: 0, staked: 0, progress: 0, nationId: FACTIONS[factionId].nationId ?? null};
  note(f, `Quest taken: ${q.name} for ${FACTIONS[factionId].name}.`);
  return {questId, factionId};
}
export function dropQuest(s, {factionId}) {
  const f = ensure(s);
  if (!f.quests[factionId]) throw Error('No quest to drop');
  delete f.quests[factionId];
  addEarned(s, factionId, -3, 'dropped a quest');
  return {factionId};
}
// Buy an unlock with Reputation (the command keeps its old name, m6.callFavor).
export function callFavor(s, {factionId, unlockId = 'favor'}) {
  if (s.championshipFoundation.activeId) throw Error('Spend Reputation between Series');
  if (!FACTIONS[factionId]) throw Error('Unknown faction');
  const f = ensure(s), u = unlocksFor(factionId).find(x => x.id === unlockId);
  if (!u) throw Error('Unknown unlock');
  if (f.earned[factionId] < u.need) throw Error(`Needs ${u.need} Reputation earned with ${FACTIONS[factionId].name}`);
  if (u.after && !f.owned[factionId].includes(u.after)) throw Error('Unlock the previous step first');
  if (!u.repeat && f.owned[factionId].includes(u.id)) throw Error('Already unlocked');
  if (u.pending && f.pending.includes(u.pending)) throw Error('That favor is already waiting to be used');
  if (credit(s, factionId) < u.cost) throw Error(`You can spend only ${credit(s, factionId)} Reputation with ${FACTIONS[factionId].name}: earn more their way`);
  if (wallet(s) < u.cost) throw Error(`Needs ${u.cost} Reputation; you have ${wallet(s)}`);
  f.spent += u.cost; f.spentOn[factionId] += u.cost;
  if (!u.repeat) f.owned[factionId].push(u.id);
  note(f, `Spent ${u.cost} Reputation with ${FACTIONS[factionId].name}: ${u.name}.`);
  if (u.id === 'favor' && kindOf(factionId) === 'house') {
    const r = s.management.registries, cap = n => Math.max(0, Math.min(100, n));
    for (const c of Object.values(r.chariots)) if (c.status !== 'Destroyed' && c.integrity > 0) { c.condition = cap(c.condition + 30); c.integrity = cap(c.integrity + 30); c.status = c.integrity >= 80 ? 'Functional' : c.integrity >= 60 ? 'Light' : c.integrity >= 30 ? 'Moderate' : 'Critical'; }
    for (const b of Object.values(r.beasts)) if (b.available !== false) b.condition = cap(b.condition + 20);
  } else if (u.pending) f.pending.push(u.pending);
  return {factionId, unlockId: u.id, cost: u.cost};
}
export function setBanner(s, {factionId}) {
  const f = ensure(s);
  if (factionId !== null && !bannersEarned(s).includes(factionId)) throw Error('Unlock this faction’s banner first');
  f.banner = factionId;
  return {banner: factionId};
}
const PENDING_NAMES = {authority: 'Steward’s leniency', ring: 'Bookie’s insurance', ledger: 'Clean ledger'};
export const pendingName = k => PENDING_NAMES[k] ?? k;
export function usePending(s, kind) { const f = s.m6.factions; if (!f?.pending?.includes(kind)) return false; f.pending = f.pending.filter(k => k !== kind); note(f, `${pendingName(kind)} used.`); return true; }

// ---- Hooks --------------------------------------------------------------------
// How well a race matches a faction's preferences (0 to 1).
export function matchShare(id, races, nationId) {
  const p = FACTIONS[id].prefers, house = FACTIONS[id].nationId;
  if (house && house !== nationId) return 0;
  if (!races.length) return 0;
  const fit = r => (!p.formats || p.formats.includes(r.format)) ? (p.types?.includes(r.type) ? 1 : !p.kinds || p.kinds.includes(r.kind) ? (p.types ? .5 : 1) : 0) : 0;
  const share = races.reduce((n, r) => n + fit(r), 0) / races.length;
  return house ? .5 + .5 * share : share; // racing in a nation always counts half for its house
}
function raceFacts(x) {
  const sched = x.offer.value.schedule;
  return x.raceResults.map((r, i) => {
    const row = r.rows?.find(w => w.id === x.playerId), ev = x.m6?.competition?.events?.[i] ?? {};
    const kind = ev.geometryKind ?? sched[i]?.course?.kind ?? 'Oval';
    return {format: sched[i]?.format ?? ev.format, kind, type: trackType(ev.geometryId, kind), started: !!row?.started, finished: row?.status === 'Finished', place: row?.place ?? null, dnf: row?.status === 'DNF'};
  }).filter(r => r.started);
}
// After every closed Series: share the Series' Reputation out to the factions
// whose way you raced, then check quests.
export function factionsAfterSeries(s, x, summary) {
  const f = ensure(s), races = raceFacts(x), lost = (x.m6?.casualties ?? []).some(c => c.player);
  if (summary.starts > 0 && !summary.withdrawal) {
    const rep = Math.max(0, summary.reputation ?? 0);
    for (const id of FACTION_IDS) { const n = Math.round(rep * matchShare(id, races, summary.nationId)); if (n) addEarned(s, id, n, 'raced their way'); }
    if (summary.dnf === 0 && !lost) addEarned(s, 'authority', 3, 'a clean Series');
  } else if (summary.withdrawal) addEarned(s, factionForNation(summary.nationId), -2, 'withdrew from a Series');
  const last = summary.placement === x.entrants.length, allWon = summary.starts > 0 && summary.raceWins === x.offer.value.schedule.length;
  for (const [fid, q] of Object.entries({...f.quests})) {
    const d = questDef(fid, q.questId), ctx = {summary, races, lost};
    if (!d) { delete f.quests[fid]; continue; }
    let done = false;
    if (q.questId === 'fix-is-in') {
      if (q.stage === 0 && allWon) { q.stage = 1; note(f, 'The Fix Is In: every race won. Now lose the next Championship.'); }
      else if (q.stage === 1 && summary.starts > 0 && last) done = true;
    } else if (q.questId === 'high-roller') done = q.staked >= 300;
    else if (d.need) { q.progress = Math.min(d.need, (q.progress ?? 0) + d.count(ctx)); done = q.progress >= d.need; }
    else done = !!d.check?.(ctx, FACTIONS[fid]);
    if (done) {
      delete f.quests[fid]; f.done.push(q.questId + ':' + fid); f.done = f.done.slice(-40);
      const r = questReward(fid, d, summary.nationId);
      s.career.treasury += r.gold;
      addEarned(s, fid, r.rep, 'quest complete: ' + d.name + (r.away ? ' (away from home: half reward)' : ''));
    }
  }
}
// Race Book stakes count toward High Roller and earn standing with the Ring.
export function factionsAfterBet(s, stake) {
  const f = ensure(s);
  for (const q of Object.values(f.quests)) if (q.questId === 'high-roller') q.staked += stake;
  if (stake >= 20) addEarned(s, 'ring', Math.min(3, Math.floor(stake / 50) + 1), 'a night at the Race Book');
}
// Betting against your own turnout: the Authority may find out.
export function layCaught(s, w) {
  const roll = parseInt(fingerprint([FACTION_RULES, s.career.id, w.eventId, 'lay']).slice(0, 8), 16) % 100;
  return roll < 35;
}
export function afterLay(s, w, won) {
  if (!won) return;
  if (layCaught(s, w)) { if (!usePending(s, 'ledger')) addEarned(s, 'authority', -25, 'caught betting against your own turnout'); addEarned(s, 'ring', 5, 'a profitable arrangement'); }
}

export function validateFactions(s) {
  const f = s.m6.factions;
  if (f === undefined) return;
  if (f.version === 1) return; // upgraded on first use
  exact(f, ['version', 'rules', 'earned', 'spentOn', 'spent', 'owned', 'quests', 'done', 'banner', 'pending', 'stocked', 'log']);
  if (f.version !== 2 || f.rules !== FACTION_RULES) throw Error('Unsupported faction rules');
  exact(f.earned, FACTION_IDS); exact(f.spentOn, FACTION_IDS); exact(f.owned, FACTION_IDS);
  for (const id of FACTION_IDS) {
    if (!Number.isInteger(f.earned[id]) || f.earned[id] < 0 || !Number.isInteger(f.spentOn[id]) || f.spentOn[id] < 0) throw Error('Invalid faction Reputation');
    if (!Array.isArray(f.owned[id]) || f.owned[id].some(u => !unlocksFor(id).some(x => x.id === u))) throw Error('Invalid faction unlock');
  }
  if (!Number.isInteger(f.spent) || f.spent !== Object.values(f.spentOn).reduce((a, b) => a + b, 0)) throw Error('Invalid Reputation spent');
  if (Object.keys(f.quests).length > FACTION_IDS.length) throw Error('Invalid quest');
  for (const [id, q] of Object.entries(f.quests)) if (!FACTIONS[id] || !questDef(id, q.questId)) throw Error('Invalid quest');
  if (f.banner !== null && !FACTIONS[f.banner]) throw Error('Invalid banner');
  if (!Array.isArray(f.pending) || f.pending.some(k => !PENDING_NAMES[k]) || !Array.isArray(f.stocked) || f.stocked.some(id => !NATIONS.includes(id)) || !Array.isArray(f.log) || f.log.length > 12 || !Array.isArray(f.done) || f.done.length > 40) throw Error('Invalid faction state');
}
