// Phase 3 stakes (Mack, 2026-11-26): when a turnout is wrecked, a driver or beast
// that was beaten down to nothing may die (15% in Combat, 5% in Pure), and a
// chariot smashed to nothing is destroyed. The rolls happen once, when the official
// result is published, and are seeded from the result so replays agree.
// A loss ends that turnout's Series. The player's fallen are removed from the
// stable once the Series is fully settled, and remembered in the Hall of Records.
import {fingerprint} from '../cycles/contracts.js';
import {consequenceDefaults} from '../../sim/consequences.js';

export const STAKES_RULES = 'p3-stakes-v1';
export const DEATH_ODDS = Object.freeze({Combat: 15, Pure: 5});
const roll = (...k) => parseInt(fingerprint([STAKES_RULES, ...k]).slice(0, 8), 16) % 100;

// Which parts of a wrecked turnout are lost. `final` is the native RU at the end of the race.
// `survive` is the Infirmary's cut to the death odds, in percent (player only).
export function rollCasualties({instanceId, resultId, entrantId, format, wrecked, final, survive = 0}) {
  if (!wrecked) return [];
  const odds = (DEATH_ODDS[format] ?? DEATH_ODDS.Pure) * (100 - survive) / 100, out = [];
  const {disabledCondition, minimumTeamCondition} = consequenceDefaults;
  if (final.driver.condition <= disabledCondition && roll(instanceId, resultId, entrantId, 'driver') < odds) out.push({member: 'driver', kind: 'death'});
  final.beasts.forEach((b, i) => { if (b.condition <= minimumTeamCondition && roll(instanceId, resultId, entrantId, 'beast', i) < odds) out.push({member: 'beast-' + i, kind: 'death'}); });
  if (final.chariot.condition <= disabledCondition) out.push({member: 'chariot', kind: 'destroyed'});
  return out;
}

// Marks losses in the Series condition state, so the turnout can no longer start.
export function applyCasualtiesToPersistent(persistent, casualties) {
  for (const c of casualties) {
    if (c.member === 'driver') { persistent.driver.available = false; persistent.driver.injury = 'Critical'; }
    else if (c.member === 'chariot') { persistent.chariot.integrity = 0; persistent.chariot.status = 'Destroyed'; persistent.chariot.available = false; }
    else { const b = persistent.beasts[Number(c.member.split('-')[1])]; b.available = false; b.injury = 'Critical'; }
  }
}

// The player's registry records for the lost parts, flagged unavailable right away.
export function playerAssetId(e, member) {
  if (member === 'driver') return e.assetIds.driver;
  if (member === 'chariot') return e.assetIds.chariot;
  return e.assetIds.beasts[Number(member.split('-')[1])];
}
export function applyCasualtiesToPlayer(s, e, casualties) {
  const r = s.management.registries;
  for (const c of casualties) {
    const id = playerAssetId(e, c.member);
    if (c.member === 'chariot') { const a = r.chariots[id]; a.integrity = 0; a.status = 'Destroyed'; a.condition = 0; a.available = false; }
    else { const a = c.member === 'driver' ? r.personnel[id] : r.beasts[id]; a.available = false; a.injury = 'Critical'; a.condition = 0; }
  }
}

export const isLost = (x, entrantId) => (x?.m6?.casualties ?? []).some(c => c.entrantId === entrantId);
export function casualtyText(c) {
  return c.kind === 'destroyed' ? `${c.name} was destroyed` : `${c.name} was killed`;
}

// Once a Series is fully settled: the player's fallen leave the stable, and every
// loss in the Series (the player's and rivals') goes on the memorial.
export const MEMORIAL_LIMIT = 200;
// A chariot or beast leaves the stable for good (killed, destroyed, or lost in a
// race for pinks): its turnout assignment is dissolved and fitted gear comes off.
export function removeAsset(s, kind, id) {
  const r = s.management.registries, a = r[kind][id];
  if (!a) return false;
  for (const key of [...(a.references.assignment ?? [])]) {
    const asg = r.assignments[key];
    if (!asg) continue;
    for (const k of ['personnel', 'beasts', 'chariots']) for (const subject of asg.references.subject) if (r[k][subject]) r[k][subject].references.assignment = [];
    delete r.assignments[key];
  }
  if (kind === 'chariots') for (const eq of a.references.equipment ?? []) if (r.equipment[eq]) r.equipment[eq].references.installedOn = [];
  delete r[kind][id];
  return true;
}
export function buryFallen(s, x, removePerson) {
  const lost = x?.m6?.casualties ?? [];
  if (!lost.length) return;
  const r = s.management.registries, m = s.m6, player = x.entrants.find(e => e.player);
  m.fallen ??= [];
  for (const c of lost) {
    m.fallen.push({name: c.name, team: c.team, role: c.member === 'driver' ? 'Driver' : c.member === 'chariot' ? 'Chariot' : 'Beast', kind: c.kind, series: x.offer.value.name, race: c.raceIndex + 1, player: c.player, nationId: x.m6.nationId});
    if (!c.player) continue;
    const id = playerAssetId(player, c.member);
    if (c.member === 'driver') { const p = r.personnel[id]; if (p) removePerson(s, p, {resolveAssignment: true, reason: 'died'}); continue; }
    removeAsset(s, c.member === 'chariot' ? 'chariots' : 'beasts', id);
  }
  if (m.fallen.length > MEMORIAL_LIMIT) m.fallen.splice(0, m.fallen.length - MEMORIAL_LIMIT);
}
