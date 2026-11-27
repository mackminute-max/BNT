// Persistent rivals and grudges (Phase 4: give the world faces).
// Each nation keeps four regular rival teams (see current.js freezeField). This
// module gives each one a face: a racing style, a signature driver with a
// nickname who ages, improves, gets hurt and dies, and a record against you.
// Grudges: when a driver wrecks yours, or you wreck theirs, both sides remember.
// Grudge holders hunt each other in Combat races (src/sim/grudges.js), and
// finishing a Series ahead of a nemesis pays Reputation.
import {fingerprint} from '../cycles/contracts.js';
import {teamProfile} from '../m5/d2/generation.js';
import {GRUDGE_RULES} from '../../sim/grudges.js';

export const RIVALRY_RULES = 'bnt-rivalry-v1';
const roll = (...k) => parseInt(fingerprint([RIVALRY_RULES, ...k]).slice(0, 8), 16);
export const STYLES = Object.freeze({
  brutal: {name: 'Brutal', text: 'Hits hard and keeps hitting.', nicknames: ['the Butcher', 'Ironjaw', 'the Hammer', 'Bonecrusher', 'the Anvil', 'Red Ruin']},
  precise: {name: 'Precise', text: 'Clean lines and very few mistakes.', nicknames: ['the Needle', 'Clockwork', 'the Surgeon', 'Silk', 'the Compass', 'Dead-Eye']},
  rich: {name: 'Rich', text: 'Buys the best gear money can find.', nicknames: ['Goldspur', 'the Baron', 'Silverhand', 'the Velvet', 'Moneybags', 'the Jewel']},
  dirty: {name: 'Dirty', text: 'Waits for you to look away, then strikes.', nicknames: ['the Viper', 'Snake-Eye', 'the Rat', 'Knives', 'the Jackal', 'Backstab']},
});
const STYLE_IDS = Object.keys(STYLES);
export const GRUDGES = Object.freeze(['None', 'Bad blood', 'Grudge', 'Blood feud']);
export const NEMESIS_REPUTATION = 5;
const RETIRE_AGE = 38, LOG = 12;
const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n)));

export const initialRivalry = () => ({version: 1, rules: RIVALRY_RULES, faces: {}, log: []});
const ensure = s => (s.m6.rivalry ??= initialRivalry());
function note(r, text) { r.log.unshift(text.slice(0, 200)); r.log = r.log.slice(0, LOG); }
const nickOf = (style, ...k) => STYLES[style].nicknames[roll(...k, 'nick') % STYLES[style].nicknames.length];
export const billed = (name, nickname) => { const i = name.indexOf(' '); return i < 0 ? `${name} “${nickname}”` : `${name.slice(0, i)} “${nickname}” ${name.slice(i + 1)}`; };

// The face of a regular rival team, made the first time you meet it.
export function faceFor(s, p, nationId) {
  const r = ensure(s);
  if (r.faces[p.id]) return r.faces[p.id];
  const style = STYLE_IDS[roll(s.career.id, p.id, 'style') % STYLE_IDS.length];
  return (r.faces[p.id] = {nationId, team: p.organization.name, style, driver: p.driver.name, ancestryId: p.driver.ancestryId ?? null, nickname: nickOf(style, s.career.id, p.id, 0), age: 21 + roll(s.career.id, p.id, 'age') % 12, form: 0, series: 0, met: 0, ahead: 0, behind: 0, theyWrecked: 0, youWrecked: 0, grudge: 0, out: 0, heirs: 0, reserve: null});
}
// A new driver for the team (a successor, or a reserve while the star is hurt).
function newDriver(s, face, orgId, kind, n) {
  const p = teamProfile(s.career.id, 'dustroad', [s.career.id, 'm6-rival-' + kind, orgId, n], {nationId: face.nationId, usedNames: [face.driver]});
  return {name: p.driver.name, ancestryId: p.driver.ancestryId ?? null};
}

// Style and form change the frozen turnout. Called as a Series is frozen.
export function applyFace(s, x, entrant, names, p) {
  const face = faceFor(s, p, x.m6.nationId), n = entrant.native, d = n.driver, pers = d.personality;
  const bump = (o, k, v) => { if (typeof o?.[k] === 'number') o[k] = clamp(o[k] + v); };
  if (face.style === 'brutal') { bump(d, 'combat', 6); bump(pers, 'aggression', 20); bump(pers, 'caution', -15); bump(n.chariot, 'protection', 4); }
  else if (face.style === 'precise') { bump(d, 'driving', 6); bump(d, 'awareness', 4); bump(pers, 'tacticalDiscipline', 10); bump(n.chariot, 'maneuverability', 4); }
  else if (face.style === 'rich') { for (const k of ['stability', 'durability', 'protection', 'rollingEfficiency', 'maneuverability']) bump(n.chariot, k, 6); for (const b of n.beasts) { bump(b, 'speed', 2); bump(b, 'power', 2); } }
  else { bump(d, 'combat', 4); bump(pers, 'opportunism', 25); bump(pers, 'aggression', 10); bump(pers, 'patience', -10); }
  const reserve = face.out > 0;
  for (const k of ['driving', 'beastHandling', 'combat', 'awareness', 'nerve']) bump(d, k, reserve ? -6 : face.form);
  if (reserve) {
    face.reserve ??= newDriver(s, face, p.id, 'reserve', face.series);
    names.driver = face.reserve.name; names.ancestryId = face.reserve.ancestryId ?? names.ancestryId; names.reserve = true;
  } else {
    names.driver = billed(face.driver, face.nickname);
    if (face.ancestryId) names.ancestryId = face.ancestryId;
  }
  names.organization = face.team;
  names.style = face.style;
  names.grudge = face.grudge;
  const feud = (x.m6.feud ??= {rules: RIVALRY_RULES, targets: [], wrecks: []});
  if ((face.grudge > 0 || face.style === 'dirty') && !feud.targets.includes(entrant.id)) feud.targets.push(entrant.id);
}

// Grudge context for a race setup (read by src/sim/grudges.js).
export function grudgeContextFor(x, e, starters) {
  const feud = x.m6?.feud;
  if (!feud?.targets.length) return null;
  const present = id => starters.some(o => o.id === id);
  if (e.player) { const targets = feud.targets.filter(present); return targets.length ? {rules: GRUDGE_RULES, targets} : null; }
  return feud.targets.includes(e.id) && present(x.playerId) ? {rules: GRUDGE_RULES, targets: [x.playerId]} : null;
}

// After each official race: wrecks between you and a rival start a grudge for the rest of the Series.
export function rivalryAfterRace(x, index, ledger) {
  if (!x.m6 || !ledger?.wrecks) return;
  const feud = (x.m6.feud ??= {rules: RIVALRY_RULES, targets: [], wrecks: []});
  for (const [victim, by] of ledger.wrecks) {
    if (!by || victim === by || (victim !== x.playerId && by !== x.playerId)) continue;
    const rival = victim === x.playerId ? by : victim;
    feud.wrecks.push([victim, by, index]);
    if (!feud.targets.includes(rival)) feud.targets.push(rival);
  }
  feud.wrecks = feud.wrecks.slice(-40);
}

// After a Series closes: records, aging, injuries, deaths and grudges. Returns the nemesis Reputation earned.
export function rivalryAfterSeries(s, x) {
  const r = s.m6.rivalry;
  if (!r) return 0;
  const feud = x.m6.feud ?? {targets: [], wrecks: []}, rank = new Map(x.standings.map((row, i) => [row.id, i]));
  let reputation = 0;
  for (const [id, names] of Object.entries(x.m6.names ?? {})) {
    if (names.kind !== 'persistent') continue;
    const face = r.faces[names.organizationId];
    if (!face) continue;
    const label = `${face.team}'s ${face.driver}`;
    const races = x.raceResults.map(res => [res.rows.find(row => row.id === x.playerId), res.rows.find(row => row.id === id)]).filter(([a, b]) => a?.started && b?.started);
    const done = row => row.status === 'Finished';
    for (const [me, them] of races) { if (done(them) && (!done(me) || them.place < me.place)) face.ahead++; else if (done(me)) face.behind++; }
    const theirs = feud.wrecks.filter(w => w[1] === id).length, mine = feud.wrecks.filter(w => w[0] === id).length;
    face.theyWrecked += theirs; face.youWrecked += mine;
    const before = face.grudge;
    if (races.length) {
      face.met++;
      if (before > 0 && (rank.get(x.playerId) ?? 99) < (rank.get(id) ?? 99)) { const pay = NEMESIS_REPUTATION * before; reputation += pay; note(r, `You finished ahead of your nemesis ${label}: +${pay} Reputation.`); }
    }
    if (theirs || mine) { face.grudge = Math.min(3, face.grudge + theirs + mine); if (face.grudge > before) note(r, `${label} ${theirs ? 'wrecked you' : 'was wrecked by you'}. ${GRUDGES[face.grudge]}.`); }
    else if (races.length && face.grudge > 0) face.grudge--;
    // The signature driver's career.
    const wasReserve = face.out > 0;
    if (wasReserve) { face.out--; if (!face.out) face.reserve = null; }
    face.series++;
    if (face.series % 3 === 0) face.age++;
    if (!wasReserve) face.form = clamp(face.form + (face.age < 30 ? 1 : face.age >= 34 ? -1 : 0), -8, 10);
    const died = (x.m6.casualties ?? []).some(c => c.entrantId === id && c.member === 'driver');
    const injury = x.conditionState?.[id]?.driver?.injury;
    if (died && !wasReserve) {
      const killer = feud.wrecks.some(w => w[0] === id && w[1] === x.playerId);
      succeed(s, face, names.organizationId, `${label} was killed on the track.`);
      if (killer) { face.grudge = 3; note(r, `${face.team} blames you. Blood feud.`); }
    } else if (!wasReserve && ['Major', 'Critical'].includes(injury)) {
      face.out = 1; note(r, `${label} is hurt and sits out the next Series. A reserve will drive.`);
    } else if (face.age >= RETIRE_AGE) succeed(s, face, names.organizationId, `${label} retired at ${face.age}.`);
  }
  return reputation;
}
function succeed(s, face, orgId, why) {
  const r = s.m6.rivalry;
  face.heirs++;
  const d = newDriver(s, face, orgId, 'heir', face.heirs);
  face.driver = d.name; face.ancestryId = d.ancestryId; face.nickname = nickOf(face.style, s.career.id, orgId, face.heirs);
  face.age = 19 + roll(s.career.id, orgId, face.heirs, 'age') % 5; face.form = 0; face.out = 0; face.reserve = null;
  note(r, `${why} ${billed(face.driver, face.nickname)} now leads ${face.team}.`);
}

export function validateRivalry(s) {
  const r = s.m6.rivalry;
  if (r === undefined) return;
  if (!r || r.version !== 1 || r.rules !== RIVALRY_RULES || Object.keys(r).sort().join(',') !== 'faces,log,rules,version' || !Array.isArray(r.log) || r.log.length > LOG || typeof r.faces !== 'object') throw Error('Invalid rivalry state');
  for (const f of Object.values(r.faces)) {
    if (!STYLES[f.style] || typeof f.driver !== 'string' || typeof f.team !== 'string' || typeof f.nickname !== 'string' || !Number.isInteger(f.grudge) || f.grudge < 0 || f.grudge > 3 || !Number.isInteger(f.age) || f.form < -8 || f.form > 10) throw Error('Invalid rival face');
    for (const k of ['series', 'met', 'ahead', 'behind', 'theyWrecked', 'youWrecked', 'out', 'heirs']) if (!Number.isInteger(f[k]) || f[k] < 0) throw Error('Invalid rival record');
  }
}
