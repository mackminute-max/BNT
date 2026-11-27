// Gambling Den, systems phase (Mack 2026-11-27, decision 4 and the racing and
// betting case study). A fixed-price bookmaker: every price comes from the same
// win probabilities the house quotes (known stats and headless races, no hidden
// dice), terms never change after a bet is struck, and exotics are priced from
// those win chances with the Harville formula. One in-race bet is allowed per
// race; its price moves with the race and a late bet pays less.
// Also here: the two parlor games, Bones (dice) and Beast Pit (a blackjack
// variant), each playable once per Series.
import {fingerprint} from '../cycles/contracts.js';
import {gold} from '../cycles/contracts.js';
import {createRace,step} from '../../sim/race.js';
import {exact} from '../legacy-state.js';
import {factionsAfterBet} from './factions.js';

export const PARLOR_RULES = 'bnt-parlor-v1';
export const BET_TYPES = Object.freeze({
  win: {name: 'Win', picks: 1, minField: 2, margin: .10, help: 'Your pick finishes first.'},
  place: {name: 'Place', picks: 1, minField: 3, margin: .12, help: 'Your pick finishes first or second.'},
  show: {name: 'Show', picks: 1, minField: 5, margin: .12, help: 'Your pick finishes in the top three.'},
  h2h: {name: 'Head-to-head', picks: 2, minField: 2, margin: .08, help: 'Your first pick finishes ahead of your second. Void if neither finishes.'},
  quinella: {name: 'Quinella', picks: 2, minField: 3, margin: .15, help: 'Your two picks finish first and second, in either order.'},
  exacta: {name: 'Exacta', picks: 2, minField: 3, margin: .15, help: 'Your two picks finish first and second, in that order.'},
  trifecta: {name: 'Trifecta', picks: 3, minField: 4, margin: .20, help: 'Your three picks finish first, second and third, in that order.'},
});
export const SLIP_LIMIT = 3, MAX_ODDS = 500, LIVE_MARGIN = .22, LIVE_CLOSE = .75;

const priceOf = (prob, margin) => Math.max(1.01, Math.min(MAX_ODDS, Math.floor(100 / (Math.max(prob, 1e-6) * (1 + margin))) / 100));
export const payoutOf = (stake, odds, share = 1) => Math.floor(stake * Math.round(odds * 100) / (100 * share));

// Probability a bet lands, from the house win chances (Harville).
export function betProbability(type, picks, ids, probs) {
  const p = id => probs[ids.indexOf(id)] ?? 0;
  const ex = (a, b) => p(a) * p(b) / Math.max(1e-9, 1 - p(a));
  const tri = (a, b, c) => ex(a, b) * p(c) / Math.max(1e-9, 1 - p(a) - p(b));
  const [a, b, c] = picks;
  if (type === 'win') return p(a);
  if (type === 'place') return p(a) + ids.filter(j => j !== a).reduce((n, j) => n + ex(j, a), 0);
  if (type === 'show') {
    let n = betProbability('place', [a], ids, probs);
    for (const j of ids) for (const k of ids) if (j !== k && j !== a && k !== a) n += tri(j, k, a);
    return n;
  }
  if (type === 'h2h') return p(a) / Math.max(1e-9, p(a) + p(b));
  if (type === 'exacta') return ex(a, b);
  if (type === 'quinella') return ex(a, b) + ex(b, a);
  if (type === 'trifecta') return tri(a, b, c);
  throw Error('Unknown bet type');
}
export const betOdds = (type, picks, ids, probs) => priceOf(betProbability(type, picks, ids, probs), BET_TYPES[type].margin);

export function checkBet(bet, ids) {
  const t = BET_TYPES[bet?.type];
  if (!t || !Array.isArray(bet.picks) || bet.picks.length !== t.picks || new Set(bet.picks).size !== t.picks || bet.picks.some(id => !ids.includes(id)) || ids.length < t.minField) throw Error('Invalid bet');
  gold(bet.stake);
  if (bet.stake < 1) throw Error('Each bet needs a stake');
}

// How one bet ends, from the official classification.
export function betOutcome(bet, rows) {
  const place = id => { const r = rows.find(r => r.id === id); return r?.status === 'Finished' && Number.isInteger(r.place) ? r.place : null; };
  const finished = rows.filter(r => r.status === 'Finished' && Number.isInteger(r.place));
  if (!finished.length) return {outcome: 'Void', payout: bet.stake};
  const [a, b, c] = bet.picks.map(place), heat = n => finished.filter(r => r.place === n).length;
  let won = false, share = 1;
  if (bet.type === 'win') { won = a === 1; share = won ? heat(1) : 1; }
  else if (bet.type === 'place') won = a !== null && a <= 2;
  else if (bet.type === 'show') won = a !== null && a <= 3;
  else if (bet.type === 'exacta') won = a === 1 && b === 2;
  else if (bet.type === 'quinella') won = (a === 1 && b === 2) || (a === 2 && b === 1);
  else if (bet.type === 'trifecta') won = a === 1 && b === 2 && c === 3;
  else if (bet.type === 'h2h') {
    if (a === null && b === null) return {outcome: 'Void', payout: bet.stake};
    if (a !== null && a === b) return {outcome: 'Void', payout: bet.stake};
    won = a !== null && (b === null || a < b);
  }
  return won ? {outcome: share > 1 ? 'Dead heat' : 'Won', payout: payoutOf(bet.stake, bet.odds, share)} : {outcome: 'Lost', payout: 0};
}
export const betLabel = (bet, names) => `${BET_TYPES[bet.type].name}: ${bet.picks.map(id => names[id]?.organization ?? id).join(bet.type === 'h2h' ? ' over ' : bet.type === 'quinella' ? ' & ' : ' → ')}`;

// ---- In-race price -------------------------------------------------------
const distance = (track, laps) => track.course && !track.closed ? track.cells : track.cells * laps;
export function raceProgress(view) {
  const d = distance(view.track, view.laps), racing = view.entrants.filter(r => r.status === 'Racing' || r.status === 'Finished');
  return racing.length ? Math.max(0, Math.min(1, Math.max(...racing.map(r => r.status === 'Finished' ? d : r.q)) / d)) : 0;
}
// Live win chances: blend the house's starting view with the running order.
export function liveProbabilities(view, ids, probs) {
  const w = raceProgress(view), lead = Math.max(...view.entrants.map(r => r.q)), scale = Math.max(4, view.track.cells / 10);
  const score = ids.map((id, i) => {
    const r = view.entrants.find(e => e.id === id);
    if (!r || !['Racing', 'Finished'].includes(r.status)) return 0;
    if (r.status === 'Finished') return r.place === 1 ? 1e6 : 0;
    return Math.pow(probs[i], 1 - w) * Math.exp(-w * 2.5 * (lead - r.q) / scale);
  });
  const sum = score.reduce((a, b) => a + b, 0) || 1;
  return score.map(v => v / sum);
}
export function liveOdds(view, ids, probs) {
  const live = liveProbabilities(view, ids, probs), w = raceProgress(view);
  return live.map(p => p <= 0 ? null : priceOf(p, LIVE_MARGIN + w * .2));
}
export const liveOpen = view => view.status !== 'Ended' && raceProgress(view) < LIVE_CLOSE && view.tick > 0;
export const viewOfState = s => ({tick: s.tick, status: s.status, entrants: s.entrants.map(r => ({id: r.id, q: r.q, status: r.status, place: r.place ?? null})), track: s.track, laps: s.config.laps});

// ---- Den commands -----------------------------------------------------------
// m6.denSlip: start a spectator race with a slip of up to three bets.
export function slipStart(s, p, nextDenEvent, validateQuote) {
  const event = nextDenEvent(s), g = s.m6.gambling, q = validateQuote(g.quote);
  if (p.eventId !== event.id || p.confirmed !== true || q.scope !== 'den' || q.eventId !== event.id || q.setupHash !== event.setupHash || q.issuedRevision + 1 !== s.revision || q.treasury !== s.career.treasury || p.quoteFingerprint !== q.fingerprint) throw Error('Stale odds: get a fresh quote');
  if (!Array.isArray(p.slip) || p.slip.length < 1 || p.slip.length > SLIP_LIMIT) throw Error(`A slip holds one to ${SLIP_LIMIT} bets`);
  const slip = p.slip.map(b => {
    exact(b, ['type', 'picks', 'stake', 'odds']);
    checkBet(b, q.entrantIds);
    const odds = betOdds(b.type, b.picks, q.entrantIds, q.probabilities);
    if (odds !== b.odds) throw Error('The price changed: review the slip again');
    return {type: b.type, picks: [...b.picks], stake: b.stake, odds};
  });
  const stake = slip.reduce((n, b) => n + b.stake, 0);
  if (stake > q.maxStake || stake > s.career.treasury) throw Error(`Total stake is over the ${q.maxStake} Gold limit`);
  s.career.treasury -= stake;
  g.totals.staked += stake; g.totals.bets++; g.totals.viewed++;
  g.den.active = {version: 1, eventId: event.id, event: structuredClone(event), stake, entrantId: slip[0].picks[0], odds: Math.min(50, slip[0].odds), quoteFingerprint: q.fingerprint, slip, maxStake: q.maxStake, entrantIds: [...q.entrantIds], probabilities: [...q.probabilities], live: null};
  g.den.events[g.den.cursor] = null; g.den.cursor++; g.quote = null;
  factionsAfterBet(s, stake);
  return {eventId: event.id, stake, bets: slip.length};
}
// m6.denLive: one Win bet while the race runs, at the price of that moment.
export function liveBet(s, p) {
  const g = s.m6.gambling, a = g.den.active;
  if (!a || a.eventId !== p.eventId || p.confirmed !== true) throw Error('No spectator race running');
  if (a.live) throw Error('One in-race bet per race');
  if (!Number.isSafeInteger(p.tick) || p.tick < 1 || p.tick > 20000) throw Error('Invalid race moment');
  gold(p.stake);
  const ids = a.entrantIds ?? a.event.setup.entrants.map(e => e.ru.id), probs = a.probabilities ?? ids.map(() => 1 / ids.length), room = (a.maxStake ?? Math.floor(s.career.treasury / 10)) - (a.slip ? a.stake : 0);
  if (p.stake < 1 || p.stake > room || p.stake > s.career.treasury) throw Error(`In-race stake must be 1 to ${Math.max(0, room)} Gold`);
  const race = createRace(a.event.setup);
  while (race.tick < p.tick && ['Ready', 'Running'].includes(race.status)) step(race);
  if (race.tick !== p.tick) throw Error('That moment of the race has passed');
  const view = viewOfState(race);
  if (!liveOpen(view)) throw Error('In-race betting has closed');
  const i = ids.indexOf(p.entrantId), odds = liveOdds(view, ids, probs)[i];
  if (i < 0 || !odds) throw Error('That team is out of the race');
  if (odds !== p.odds) throw Error('The price moved: try again');
  if (!a.stake) g.totals.bets++;
  s.career.treasury -= p.stake; a.stake += p.stake; g.totals.staked += p.stake;
  if (!a.slip) { a.slip = []; a.maxStake ??= room; a.entrantId = p.entrantId; a.odds = Math.min(50, odds); }
  a.live = {type: 'win', picks: [p.entrantId], stake: p.stake, odds, tick: p.tick};
  factionsAfterBet(s, p.stake);
  return {stake: p.stake, odds};
}
// Settles a slip and any live bet; returns the same shape the old single bet did.
export function slipOutcome(a, rows) {
  const bets = [...(a.slip ?? []), ...(a.live ? [a.live] : [])], results = bets.map(b => ({...b, ...betOutcome(b, rows)}));
  const payout = results.reduce((n, r) => n + r.payout, 0), allVoid = results.every(r => r.outcome === 'Void');
  return {outcome: allVoid ? 'Void' : payout > a.stake ? 'Won' : payout > 0 ? 'Partly won' : 'Lost', payout, bets: results};
}

// ---- Parlor games ----------------------------------------------------------
const rng = (...key) => { let h = parseInt(fingerprint([PARLOR_RULES, ...key]).slice(0, 8), 16) >>> 0; return () => { h = (h + 0x6d2b79f5) >>> 0; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
export const GAME_CAPS = [50, 100, 200, 400, 800, 800];
export const parlorEpoch = s => s.m6.gambling.den?.epoch ?? 0;
export function parlorState(s) {
  const e = parlorEpoch(s), p = s.m6.parlor;
  return p && (p.epoch === e || p.bones?.open || p.pit?.open) ? p : {version: 1, epoch: e, bones: null, pit: null, played: [], totals: p?.totals ?? {staked: 0, paid: 0, games: 0}};
}
export function gameCap(s) { const tier = s.m6.world?.nations?.[s.m6.world.currentNation]?.tier ?? 1; return Math.min(GAME_CAPS[tier - 1] ?? 50, Math.floor(s.career.treasury / 5)); }
function begin(s, game, stake) {
  if (s.championshipFoundation.activeId) throw Error('The parlor games open between Series');
  const p = parlorState(s);
  if (p.played.includes(game)) throw Error('Once per Series: come back after your next Series');
  if (p.bones?.open || p.pit?.open) throw Error('Finish the game on the table first');
  gold(stake);
  const cap = gameCap(s);
  if (stake < 1 || stake > cap) throw Error(`Stake must be 1 to ${cap} Gold`);
  s.career.treasury -= stake; p.played.push(game); p.totals.staked += stake; p.totals.games++;
  s.m6.parlor = p;
  return p;
}
function finishGame(s, p, g, payout) { g.open = false; g.payout = payout; s.career.treasury += payout; p.totals.paid += payout; }

// Bones: you and the house roll three bones. Triples beat pairs beat totals.
// You may re-roll any of yours once; the house re-rolls anything not in a pair.
// Ties go to the house. A win pays even money; a winning triple pays 3 to 2.
export const rankBones = d => { const c = {}; for (const v of d) c[v] = (c[v] ?? 0) + 1; const n = Math.max(...Object.values(c)), k = Number(Object.keys(c).find(v => c[v] === n)), sum = d.reduce((a, b) => a + b, 0); return n === 3 ? 200 + k : n === 2 ? 100 + k * 10 + (sum - 2 * k) : sum; };
export const bonesName = d => { const r = rankBones(d); return r >= 200 ? 'Triple ' + d[0] + 's' : r >= 100 ? 'Pair of ' + Math.floor((r - 100) / 10) + 's' : 'Total ' + r; };
export function bonesStart(s, {stake}) {
  const p = begin(s, 'bones', stake), roll = rng(s.career.id, p.epoch, 'bones');
  p.bones = {open: true, stake, player: [1, 2, 3].map(() => 1 + Math.floor(roll() * 6)), house: null, payout: 0, result: null};
  return {dice: p.bones.player};
}
export function bonesHold(s, {hold}) {
  const p = s.m6.parlor, b = p?.bones;
  if (!b?.open) throw Error('No Bones game on the table');
  if (!Array.isArray(hold) || hold.length !== 3 || hold.some(h => typeof h !== 'boolean')) throw Error('Choose which bones to keep');
  const roll = rng(s.career.id, p.epoch, 'bones', 'second');
  b.player = b.player.map((v, i) => hold[i] ? v : 1 + Math.floor(roll() * 6));
  const house = [1, 2, 3].map(() => 1 + Math.floor(roll() * 6)), keep = house.map(v => house.filter(x => x === v).length > 1);
  b.house = house.map((v, i) => keep[i] ? v : 1 + Math.floor(roll() * 6));
  const me = rankBones(b.player), them = rankBones(b.house);
  b.result = me > them ? 'Won' : 'Lost';
  finishGame(s, p, b, b.result === 'Won' ? Math.floor(b.stake * (me >= 200 ? 5 : 4) / 2) : 0);
  return {player: b.player, house: b.house, result: b.result, payout: b.payout};
}

// Beast Pit: blackjack with beasts. Cards are beasts worth 2 to 10, and Thunder
// cards worth 1 or 11. Your own stable's beasts are in the deck; drawing one
// rouses the home crowd and adds +1 to that card. Five cards without busting is
// a Full Pack and pays 2 to 1. The Pit Master draws to 17.
export function pitDeck(s, epoch) {
  const own = Object.values(s.management.registries.beasts).map(b => b.name).slice(0, 6);
  const rivals = Object.values(s.m6.rivals ?? {}).flatMap(p => p.organizations.flatMap(o => o.beasts?.map(b => b.name) ?? [])).slice(0, 24);
  const fill = ['Ashmane', 'Brute', 'Cinderhoof', 'Dusk', 'Ember', 'Grit', 'Hollow', 'Ironjaw', 'Kestrel', 'Mire', 'Quarrel', 'Rook', 'Scald', 'Thorn', 'Vex', 'Warden'];
  const names = [...own, ...rivals, ...fill];
  const cards = [];
  for (let v = 2; v <= 10; v++) for (let i = 0; i < 4; i++) cards.push({value: v, name: names[(v * 4 + i) % names.length]});
  for (let i = 0; i < 4; i++) cards.push({value: 11, name: 'Thunder', thunder: true});
  for (const c of cards) c.own = own.includes(c.name);
  const roll = rng(s.career.id, epoch, 'pit');
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(roll() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
}
export function pitTotal(hand, home = true) {
  let total = 0, thunder = 0;
  for (const c of hand) { total += c.thunder ? 11 : c.value + (home && c.own ? 1 : 0); if (c.thunder) thunder++; }
  while (total > 21 && thunder) { total -= 10; thunder--; }
  return total;
}
export function pitStart(s, {stake}) {
  const p = begin(s, 'pit', stake), deck = pitDeck(s, p.epoch);
  p.pit = {open: true, stake, cursor: 4, player: [deck[0], deck[2]], dealer: [deck[1], deck[3]], payout: 0, result: null};
  if (pitTotal(p.pit.player) === 21) pitSettle(s, p, deck);
  return pitView(p.pit);
}
export function pitMove(s, {move}) {
  const p = s.m6.parlor, t = p?.pit;
  if (!t?.open) throw Error('No Beast Pit hand on the table');
  const deck = pitDeck(s, p.epoch);
  if (move === 'hit') {
    t.player.push(deck[t.cursor++]);
    if (pitTotal(t.player) > 21 || t.player.length === 5) pitSettle(s, p, deck);
  } else if (move === 'stand') pitSettle(s, p, deck);
  else throw Error('Hit or stand');
  return pitView(t);
}
function pitSettle(s, p, deck) {
  const t = p.pit, me = pitTotal(t.player);
  if (me > 21) { t.result = 'Bust'; return finishGame(s, p, t, 0); }
  if (t.player.length === 5) { t.result = 'Full Pack'; return finishGame(s, p, t, t.stake * 3); }
  if (me === 21 && t.player.length === 2) { t.result = 'Thunderclap'; return finishGame(s, p, t, Math.floor(t.stake * 5 / 2)); }
  while (pitTotal(t.dealer, false) < 17) t.dealer.push(deck[t.cursor++]);
  const them = pitTotal(t.dealer, false);
  t.result = them > 21 || me > them ? 'Won' : me === them ? 'Push' : 'Lost';
  finishGame(s, p, t, t.result === 'Won' ? t.stake * 2 : t.result === 'Push' ? t.stake : 0);
}
export const pitView = t => ({player: t.player, dealer: t.open ? [t.dealer[0]] : t.dealer, total: pitTotal(t.player), dealerTotal: t.open ? null : pitTotal(t.dealer, false), result: t.result, payout: t.payout, open: t.open});

export function validateParlor(s) {
  const p = s.m6.parlor;
  if (p === undefined) return;
  exact(p, ['version', 'epoch', 'bones', 'pit', 'played', 'totals']);
  if (p.version !== 1 || !Number.isSafeInteger(p.epoch) || !Array.isArray(p.played) || p.played.some(g => !['bones', 'pit'].includes(g)) || new Set(p.played).size !== p.played.length) throw Error('Invalid parlor state');
  exact(p.totals, ['staked', 'paid', 'games']);
  Object.values(p.totals).forEach(gold);
}
