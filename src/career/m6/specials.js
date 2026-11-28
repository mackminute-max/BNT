// Special events (Phase 4c, Mack 2026-11-27): offered beside the Series on the
// Racing board.
//  - Always there: Big Buy-In (one race, entry 4x, winner takes most) and the
//    Drag Race (a straight sprint).
//  - On rotation, two at a time: Turnout Takedown (was Racing for Pinks) and Jousting.
//  - Duels (a field of two): the loser gets no Gold, XP or Reputation.
//  - Unlocked: each faction's Invitational once you have earned 50 Reputation
//    with it (a House only in its own nation).
// One-off races are sealed and carry no Endowments (there is no race after them).
import {FACTIONS, FACTION_IDS, factionsOf, addEarned} from './factions.js';
import {removeAsset} from '../p3/stakes.js';
import {exact} from '../legacy-state.js';
import {WORLD_CONTENT} from './world-content.generated.js';

// races: Series length. fee: entry fee times the board's normal fee.
// slot: always | rotation | unlocked.
export const SPECIALS = Object.freeze({
  buyin: {label: 'Big Buy-In', slot: 'always', races: 1, fee: 4, purse: 'winner-takes-most', short: 'Four times the fee; the winner takes most.', blurb: 'One race, four times the entry fee. The winner takes most of the pot, second gets a little, everyone else goes home poorer.'},
  drag: {label: 'Drag Race', slot: 'always', races: 1, fee: .5, purse: 'sprint', format: 'Pure', short: 'One flat-out sprint down a straight strip.', blurb: 'A straight sprint down a 600-metre strip. No corners, no tricks, just raw speed.'},
  pinks: {label: 'Turnout Takedown', slot: 'rotation', races: 1, fee: 0, purse: 'none', fieldSize: 2, short: 'Winner takes the loser’s chariot and beasts.', blurb: 'One rival, one race. Both sides stake their chariot and both beasts, and the winner takes them. The loser gets nothing else. Your driver stays yours.'},
  joust: {label: 'Jousting', slot: 'rotation', races: 1, fee: 1, purse: 'duel', fieldSize: 2, format: 'Combat', short: 'Duel across the partition until one is wrecked.', blurb: 'One rival on the narrow lists, half a lap apart, striking across the centre partition each time you pass. It ends when one turnout is wrecked, or on points if both last seven minutes. The loser gets nothing. Strategies are unlimited.'},
  invitational: {label: 'Invitational', slot: 'unlocked', races: 3, fee: 1.5, purseScale: 2, short: 'A faction’s private Series, double purses.', blurb: 'A faction’s private three-race Series, run their way. Double purses, and extra Reputation with the faction that invited you.'},
});
export const INVITATION_AT = 50;
// Duels where the loser earns nothing (Mack 2026-11-27).
export const LOSER_NOTHING = Object.freeze(['pinks', 'joust']);
export const INVITATION_BONUS = {start: 5, win: 10}; // extra Reputation earned with the faction

const nationName = id => (WORLD_CONTENT.profiles.find(p => p.id === id)?.name ?? id).split(' ')[0];
const BUYIN_NAMES = ['High Stakes Night', 'The Golden Gate', 'Purse of Iron', 'The Heavy Wallet', 'Kingmaker’s Pot', 'All-In Derby'];
const DRAG_NAMES = ['Straight Shot', 'Quarter-Mile Thunder', 'The Long Straight', 'Dead Run', 'Bolt Sprint', 'The Starting Gun'];
const JOUST_NAMES = ['Lists of Iron', 'The Broken Lance', 'Partition Duel', 'Tilt of Champions', 'The Crossing Blades'];
const PINKS_NAMES = ['Takedown Duel', 'Winner Takes the Turnout', 'Back-Alley Takedown', 'The Title Takedown'];
export function specialName(kind, factionId, nationId, h) {
  if (kind === 'invitational') return `${FACTIONS[factionId].name.replace(/^The /, '')} Invitational`;
  const pool = kind === 'buyin' ? BUYIN_NAMES : kind === 'drag' ? DRAG_NAMES : kind === 'joust' ? JOUST_NAMES : PINKS_NAMES;
  return `${nationName(nationId)} ${pool[h % pool.length]}`.slice(0, 100);
}
// An Invitational runs the faction's way: its preferred track kinds and format.
export function invitationRules(factionId) {
  const p = FACTIONS[factionId].prefers;
  return {kinds: p.kinds ?? null, format: p.formats?.[0] ?? null};
}
export function invitedFactions(s, nationId) {
  if (!s.m6.factions) return [];
  const f = factionsOf(s);
  return FACTION_IDS.filter(id => f.earned[id] >= INVITATION_AT && (!FACTIONS[id].nationId || FACTIONS[id].nationId === nationId));
}

// ---- After a special event closes ---------------------------------------------
// Invitationals pay extra Reputation with the faction. Pinks: the winner takes the
// loser's chariot and both beasts. Yours leave the stable; theirs wait in your
// Home Market for 1 Gold (the paperwork) until the next renewal.
export function specialsAfterSeries(s, x, summary) {
  const sp = x.m6?.competition?.special;
  if (!sp || summary.starts === 0 || summary.withdrawal) return null;
  if (sp.kind === 'invitational') {
    addEarned(s, sp.factionId, INVITATION_BONUS.start + (summary.won ? INVITATION_BONUS.win : 0), 'raced their Invitational');
    return null;
  }
  if (sp.kind !== 'pinks') return null;
  const player = x.entrants.find(e => e.player), rival = x.entrants.find(e => !e.player), names = x.m6.names ?? {};
  const theirs = names[rival?.id] ?? {}, mine = names[player.id] ?? {};
  s.m6.pinks ??= {version: 1, prize: null, log: []};
  const p = s.m6.pinks;
  if (summary.won) {
    p.prize = {sequence: x.m6.sequence, nationId: x.m6.nationId, from: String(theirs.organization ?? 'your rival').slice(0, 80), chariot: String(theirs.chariot ?? '').slice(0, 60), beasts: (theirs.beasts ?? []).slice(0, 2).map(n => String(n).slice(0, 60)), speciesId: theirs.speciesId ?? null};
    p.log.unshift(`Won the pink slips of ${p.prize.from}: their chariot and both beasts wait in your Home Market.`);
  } else {
    const a = player.assetIds;
    removeAsset(s, 'chariots', a.chariot);
    for (const b of a.beasts) removeAsset(s, 'beasts', b);
    p.prize = null;
    p.log.unshift(`Lost the pink slips to ${theirs.organization ?? 'a rival'}: ${mine.chariot ?? 'your chariot'} and ${(mine.beasts ?? []).join(' and ') || 'both beasts'} are gone.`);
  }
  p.log = p.log.slice(0, 8);
  return p.log[0];
}
export function validatePinks(s) {
  const p = s.m6.pinks;
  if (p === undefined) return;
  exact(p, ['version', 'prize', 'log']);
  if (p.version !== 1 || !Array.isArray(p.log) || p.log.length > 8 || p.log.some(l => typeof l !== 'string')) throw Error('Invalid pinks state');
  if (p.prize !== null) { exact(p.prize, ['sequence', 'nationId', 'from', 'chariot', 'beasts', 'speciesId']); if (!Array.isArray(p.prize.beasts) || p.prize.beasts.length > 2) throw Error('Invalid pinks prize'); }
}
