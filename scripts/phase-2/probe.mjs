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
  let guard = 0;
  while (!terminal(r) && guard++ < 400000) step(r);
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
    console.log(`${kind.padEnd(7)} ${format.padEnd(6)} t${TIER} n=${rows.length} field=${rows[0].field} len=${f2(avg(rows, r => r.duration) / 60)}m atk=${f2(avg(rows, r => r.attacks))} hit=${f2(avg(rows, r => r.hits))} contact=${f2(avg(rows, r => r.contacts))} incid=${f2(avg(rows, r => r.incidents))} wreck=${f2(avg(rows, r => r.wrecks))} dnf=${f2(avg(rows, r => r.dnfs))} wreck|dnf=${pct(avg(rows, r => +(r.wrecks + r.dnfs > 0)))} hurt=${pct(avg(rows, r => +r.playerHurt))} pdmg=${f2(avg(rows, r => r.playerDamage))} fav=${pct(fav)} lateLead>=1=${pct(avg(rows, r => +(r.lateLead > 0)))} stalled=${rows.filter(r => r.status !== 'Ended').map(r => r.stallReason + '@' + r.duration.toFixed(0)).join(',') || 0}`);
  }
}
