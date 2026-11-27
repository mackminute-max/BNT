// Scouting notes (Phase 4): short facts about a rival turnout for betting and race
// preparation, like "has wrecked 3 turnouts this Series".
import {STYLES, GRUDGES} from './rivalry.js';
import {scoutReport} from './scouting.js';
const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;
const DRIVER_KEYS = ['driving', 'beastHandling', 'combat', 'awareness', 'nerve'];
export function faceByTeam(s, team) { return Object.values(s.m6?.rivalry?.faces ?? {}).find(f => f.team === team) ?? null; }
// `ru` is the native turnout, `x` the Series (optional), `id` its entrant id there.
export function scoutNotes(s, {team, ru = null, x = null, id = null, limit = 4}) {
  const notes = [], f = faceByTeam(s, team);
  if (f) {
    notes.push(`${STYLES[f.style].name}: ${STYLES[f.style].text.toLowerCase().replace(/\.$/, '')}`);
    if (f.out) notes.push('Signature driver hurt, a reserve drives');
    if (f.grudge) notes.push(`${GRUDGES[f.grudge]} with you`);
    if (f.theyWrecked) notes.push(`Has wrecked you ${plural(f.theyWrecked, 'time')}`);
    const together = f.ahead + f.behind;
    if (together) notes.push(`Finished ahead of you in ${f.ahead} of ${plural(together, 'race')}`);
  }
  if (x && id) {
    const t = x.m6?.tally?.[id];
    if (t?.wrecks) notes.push(`Has wrecked ${plural(t.wrecks, 'turnout')} this Series`);
    else if (t?.hits >= 5) notes.push(`Landed ${t.hits} hits this Series`);
    const rows = (x.raceResults ?? []).map(r => r.rows.find(row => row.id === id)).filter(Boolean);
    const wins = rows.filter(r => r.status === 'Finished' && r.place === 1).length, dnf = rows.filter(r => r.status === 'DNF' || r.status === 'Retired').length;
    if (wins) notes.push(`Won ${plural(wins, 'race')} this Series`);
    if (dnf) notes.push(`Failed to finish ${plural(dnf, 'time')} this Series`);
  }
  if (ru?.driver) {
    const attrs = Object.fromEntries(DRIVER_KEYS.map(k => [k, ru.driver[k]]));
    const r = scoutReport('driver', attrs, ru.driver.personality ?? null);
    if (r?.quirk) notes.push(`${r.quirk.name}: ${r.quirk.text.replace(/\.$/, '')}`);
    else if (r) notes.push(`Best at ${r.strengths[0]}, weak at ${r.weakness}`);
  }
  return notes.slice(0, limit);
}
