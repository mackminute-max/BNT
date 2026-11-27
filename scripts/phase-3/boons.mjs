// Phase 3 Boon probe: gives the player (or every entrant) a set of Boons and
// reports how often each fires, plus the effect on finishing position.
// Usage: KIND=Oval FORMAT=Combat TIER=1 SEEDS=3 node scripts/phase-3/boons.mjs <fields> '<boon ids comma>' [all]
import {fixture} from '../e5-d/m4/fixture.mjs';
import {createM6} from '../../src/career/m6/current.js';
import {denEvent} from '../../src/career/m6/den.js';
import {createRace, step, classification} from '../../src/sim/race.js';
import {ENDOWMENT_RULES, BOONS} from '../../src/sim/endowments.js';

const N = Number(process.argv[2] ?? 6), SEEDS = Number(process.env.SEEDS ?? 3), TIER = Number(process.env.TIER ?? 1);
const ids = (process.argv[3] ?? '').split(',').filter(Boolean), all = process.argv[4] === 'all';
const level = Number(process.env.LEVEL ?? 1), rarity = process.env.RARITY ?? 'Common';
const f = fixture('veteran', 'phase-3-probe');
const s = createM6(f.store.state, {version:1, nationality:'N1', ancestry:'A01', sex:'female', startingNation:'N1'});
const setups = Array.from({length:N}, (_, epoch) => denEvent(s, {version:1, epoch, index:0, nationId:'N1', tier:TIER, persistentIds:[]}).setup);
const terminal = r => ['Ended','Stalled','Error'].includes(r.status);
const endow = {rules: ENDOWMENT_RULES, boons: ids.map(id => ({id, level, rarity}))};
function race(setup, seed, withBoons) {
  const player = setup.playerId ?? setup.entrants[0].ru.id;
  const entrants = setup.entrants.map(e => withBoons && (all || e.ru.id === player) ? {...e, endowments: endow} : e);
  const r = createRace({...setup, entrants, seed, format: process.env.FORMAT ?? setup.format});
  let g = 0; while (!terminal(r) && g++ < 400000) step(r);
  const place = classification(r).find(x => x.id === player)?.place ?? null;
  const fired = {}; for (const e of r.events) if (e.type === 'BOON_FIRED') fired[e.effects.boonId] = (fired[e.effects.boonId] ?? 0) + 1;
  return {status: r.status, place, fired, wrecks: r.entrants.filter(x => x.physical === 'Wreck').length, events: r.events.length};
}
const out = {base: [], boon: []};
for (const setup of setups) for (let k = 0; k < SEEDS; k++) { const seed = 1000 + k;
  out.base.push(race(setup, seed, false)); out.boon.push(race(setup, seed, true)); }
const avg = a => a.length ? +(a.reduce((n, v) => n + v, 0) / a.length).toFixed(2) : null;
const fires = {}; for (const r of out.boon) for (const [k, v] of Object.entries(r.fired)) fires[k] = (fires[k] ?? 0) + v;
console.log(JSON.stringify({races: out.boon.length, statuses: [...new Set(out.boon.map(r => r.status))],
  basePlace: avg(out.base.map(r => r.place).filter(Boolean)), boonPlace: avg(out.boon.map(r => r.place).filter(Boolean)),
  firesPerRace: Object.fromEntries(Object.entries(fires).map(([k, v]) => [k, +(v / out.boon.length).toFixed(2)])),
  never: ids.filter(id => !fires[id])}, null, 1));
