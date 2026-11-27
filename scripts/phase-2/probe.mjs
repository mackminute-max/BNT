// Phase 2 tuning probe: runs realistic generated fields (career rivals, real venues)
// under a candidate tuning and reports the plan's "how we'll know it's fun" numbers.
// Usage: KIND=Oval|Circuit|Rally FORMAT=Combat|Pure TIER=1..6 SEEDS=3 \
//   node scripts/phase-2/probe.mjs <fields> '<variant json: {consequence, overrides}>'
import {fixture} from '../e5-d/m4/fixture.mjs';
import {createM6} from '../../src/career/m6/current.js';
import {denEvent} from '../../src/career/m6/den.js';
import {createRace, step, classification} from '../../src/sim/race.js';

const N = Number(process.argv[2] ?? 10), SEEDS = Number(process.env.SEEDS ?? 6), TIER = Number(process.env.TIER ?? 1);
const variant = JSON.parse(process.argv[3] ?? '{}');
const f = fixture('veteran', 'phase-2-probe');
const s = createM6(f.store.state, {version:1, nationality:'N1', ancestry:'A01', sex:'female', startingNation:'N1'});
const setups = k => Array.from({length:N}, (_, epoch) =>
  denEvent(s, {version:1, epoch, index:k, nationId:'N1', tier:TIER, persistentIds:[]}).setup);
const terminal = r => ['Ended','Stalled','Error'].includes(r.status);

function run(setup, format, seed) {
  const r = createRace({...setup, seed, format,
    consequence:{...(setup.consequence??{}), ...(variant.consequence??{})},
    overrides:{...setup.overrides, ...(variant.overrides??{})},
    autonomous:{...setup.autonomous, utility:{...setup.autonomous?.utility, ...(variant.utility??{})}}});
  const strength = Object.fromEntries(r.entrants.map(x => [x.id, x.derived.maxSpeed * Math.sqrt(x.derived.lateral)]));
  let guard = 0, lanes = 0, next = 0; const lane = {}, spread = [];
  while (!terminal(r) && guard++ < 400000) { step(r);
    for (const x of r.entrants) { if (lane[x.id] !== undefined && lane[x.id] !== x.lane) lanes++; lane[x.id] = x.lane; }
    if (r.time >= next) { next += 5; const q = r.entrants.filter(x => x.status === 'Racing').map(x => x.q);
      if (q.length > 1) { q.sort((a, b) => a - b); spread.push(q.filter((v, i) => (i > 0 && v - q[i - 1] <= 4) || (i < q.length - 1 && q[i + 1] - v <= 4)).length / q.length); } } }
  const third = k => { const a = spread.slice(Math.floor(spread.length * k / 3), Math.floor(spread.length * (k + 1) / 3)); return a.length ? a.reduce((n, v) => n + v, 0) / a.length : 0; };
  const ev = t => r.events.filter(e => e.type === t);
  const player = r.playerId;
  return {
    seed, duration: r.time, status: r.status, stallReason: ev('RACE_STALLED')[0]?.effects.reason, field: r.entrants.length,
    attacks: ev('ATTACK').length, hits: ev('ATTACK').filter(e => e.effects.success).length,
    contacts: ev('CONTACT').length, incidents: ev('INCIDENT_IMPACT').length,
    wrecks: r.entrants.filter(x => x.physical === 'Wreck').length,
    dnfs: r.entrants.filter(x => x.status === 'Retired').length,
    playerHurt: ev('DAMAGE').some(e => e.participants[0] === player && e.effects.component === 'driver' && e.effects.amount > 0),
    playerDamage: ev('DAMAGE').filter(e => e.participants[0] === player).reduce((n, e) => n + e.effects.amount, 0),
    winner: classification(r).find(x => x.place === 1)?.id ?? null,
    crits: ev('ATTACK').filter(e => e.effects.crit).length,
    playerAttacks: ev('ATTACK').filter(e => e.participants[0] === player).length,
    lanesPerMin: lanes / r.entrants.length / (r.time / 60),
    spread: [0, 1, 2].map(third),
    rho: (() => { const c = classification(r).filter(x => x.place != null), n = c.length; if (n < 3) return 0;
      const byS = [...c].sort((a, b) => strength[b.id] - strength[a.id]).map(x => x.id), d = c.reduce((t, x) => t + (x.place - 1 - byS.indexOf(x.id)) ** 2, 0);
      return 1 - 6 * d / (n * (n * n - 1)); })(),
    lateLead: ev('LEAD_CHANGED').filter(e => e.time > r.time * 2 / 3).length,
  };
}
const avg = (a, g) => a.reduce((n, x) => n + g(x), 0) / a.length, f2 = v => v.toFixed(2), pct = v => (v * 100).toFixed(0) + '%';
const only = process.env.KIND, formats = process.env.FORMAT ? [process.env.FORMAT] : ['Combat', 'Pure'];
for (const [ki, kind] of ['Oval', 'Circuit', 'Rally'].entries()) {
  if (only && only !== kind) continue;
  const list = setups(ki);
  for (const format of formats) {
    const groups = list.map((x, i) => Array.from({length:SEEDS}, (_, j) => run(x, format, 7000 + i * 31 + j)));
    const rows = groups.flat();
    // Favourite = the most frequent winner over the first half of the seeds;
    // its win rate is then measured on the second half (held out).
    const fav = avg(groups, g => { const h = Math.floor(g.length / 2), w = {}; for (const r of g.slice(0, h)) if (r.winner) w[r.winner] = (w[r.winner] ?? 0) + 1;
      const f = Object.entries(w).sort((a, b) => b[1] - a[1])[0]?.[0]; return g.slice(h).filter(r => r.winner === f).length / (g.length - h); });
    console.log(`${kind.padEnd(7)} ${format.padEnd(6)} t${TIER} n=${rows.length} field=${rows[0].field} len=${f2(avg(rows, r => r.duration) / 60)}m atk=${f2(avg(rows, r => r.attacks))} hit=${f2(avg(rows, r => r.hits))} contact=${f2(avg(rows, r => r.contacts))} incid=${f2(avg(rows, r => r.incidents))} wreck=${f2(avg(rows, r => r.wrecks))} dnf=${f2(avg(rows, r => r.dnfs))} wreck|dnf=${pct(avg(rows, r => +(r.wrecks + r.dnfs > 0)))} hurt=${pct(avg(rows, r => +r.playerHurt))} pdmg=${f2(avg(rows, r => r.playerDamage))} fav=${pct(fav)} rho=${f2(avg(rows, r => r.rho))} crit=${f2(avg(rows, r => r.crits))} patk=${f2(avg(rows, r => r.playerAttacks))} lane/min=${f2(avg(rows, r => r.lanesPerMin))} close=${[0,1,2].map(k => pct(avg(rows, r => r.spread[k]))).join('/')} lateLead>=1=${pct(avg(rows, r => +(r.lateLead > 0)))} stalled=${rows.filter(r => r.status !== 'Ended').map(r => r.stallReason + '@' + r.duration.toFixed(0)).join(',') || 0}`);
  }
}
