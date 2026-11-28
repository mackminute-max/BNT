// Phase 3 Endowments: in-race Boons. Each Boon is one trigger (an event the
// sim already emits) plus one bounded effect. Boon effects never trigger other
// Boons: the boundary reads only native events and skips its own BOON_FIRED.
// Everything is deterministic: state lives on the entrant, inputs are events.
import {emit} from '../events/events.js';

export const ENDOWMENT_RULES = 'p3-endowments-v1';
export const STYLES = Object.freeze(['Bruiser', 'Speedster', 'Stayer', 'Schemer']);
export const RARITY = Object.freeze({Common: 1, Rare: 1.3, Epic: 1.6});
// Level n strength = base * LEVEL[n-1]: +100%, then +60%, then +40% of base.
export const LEVEL = Object.freeze([1, 2, 2.6, 3]);
export const CAPS = Object.freeze({speed: .2, accel: .25, handling: .25, combat: .3, shield: .5});

const boon = (id, name, style, trigger, effect, cooldown, text) => Object.freeze({id, name, style, trigger, effect: Object.freeze(effect), cooldown, text});
// effect kinds: buff {stat, amount, seconds} · fatigue {amount} · strain {amount} · charge {} (refund one ability charge)
export const BOONS = Object.freeze(Object.fromEntries([
  // Bruiser: hits, rams, wrecks
  boon('blood-rush', 'Blood Rush', 'Bruiser', 'hit', {kind: 'buff', stat: 'combat', amount: .15, seconds: 5}, 0, 'A landed hit gives +{combat} combat for {seconds} s.'),
  boon('iron-hide', 'Iron Hide', 'Bruiser', 'hurt', {kind: 'buff', stat: 'shield', amount: .4, seconds: 3}, 20, 'Taking damage gives {shield} damage reduction for {seconds} s (every 20 s).'),
  boon('trophy-hunter', 'Trophy Hunter', 'Bruiser', 'wreck', {kind: 'charge'}, 0, 'Wrecking a rival refunds your ability charge.'),
  boon('red-mist', 'Red Mist', 'Bruiser', 'crit', {kind: 'buff', stat: 'speed', amount: .08, seconds: 4}, 0, 'A critical hit gives +{speed} speed for {seconds} s.'),
  boon('grudge', 'Grudge', 'Bruiser', 'hurt', {kind: 'buff', stat: 'combat', amount: .2, seconds: 6}, 10, 'Taking damage gives +{combat} combat for {seconds} s (every 10 s).'),
  boon('thick-skull', 'Thick Skull', 'Bruiser', 'contact', {kind: 'strain', amount: 4}, 5, 'Contact removes {amount} driver strain (every 5 s).'),
  // Speedster: overtakes, pace, the lead
  boon('slipstream-thief', 'Slipstream Thief', 'Speedster', 'overtake', {kind: 'buff', stat: 'speed', amount: .08, seconds: 4}, 3, 'An overtake gives +{speed} speed for {seconds} s.'),
  boon('late-dive', 'Late Dive', 'Speedster', 'overtake', {kind: 'buff', stat: 'handling', amount: .12, seconds: 4}, 3, 'An overtake gives +{handling} handling for {seconds} s.'),
  boon('front-runner', 'Front Runner', 'Speedster', 'leading', {kind: 'buff', stat: 'accel', amount: .06}, 0, 'While leading, +{accel} acceleration.'),
  boon('launch-control', 'Launch Control', 'Speedster', 'start', {kind: 'buff', stat: 'accel', amount: .2, seconds: 6}, 0, 'Race start: +{accel} acceleration for {seconds} s.'),
  boon('breakaway', 'Breakaway', 'Speedster', 'lead', {kind: 'buff', stat: 'speed', amount: .06, seconds: 6}, 10, 'Taking the lead gives +{speed} speed for {seconds} s.'),
  boon('home-straight', 'Home Straight', 'Speedster', 'finalLap', {kind: 'buff', stat: 'speed', amount: .05, seconds: 600}, 0, 'Final lap: +{speed} speed to the line.'),
  // Stayer: fatigue, endurance, clean laps
  boon('second-breath', 'Second Breath', 'Stayer', 'cleanLap', {kind: 'fatigue', amount: 6}, 0, 'A lap without damage removes {amount} fatigue from both beasts.'),
  boon('iron-lungs', 'Iron Lungs', 'Stayer', 'lap', {kind: 'fatigue', amount: 3}, 0, 'Every lap removes {amount} fatigue from both beasts.'),
  boon('steady-hands', 'Steady Hands', 'Stayer', 'controlRegained', {kind: 'buff', stat: 'shield', amount: .25, seconds: 4}, 0, 'Regaining control gives {shield} damage reduction for {seconds} s.'),
  boon('last-reserves', 'Last Reserves', 'Stayer', 'finalLapFresh', {kind: 'buff', stat: 'speed', amount: .1, seconds: 600}, 0, 'Final lap with beasts under 50% fatigue: +{speed} speed to the line.'),
  boon('unbowed', 'Unbowed', 'Stayer', 'hurt', {kind: 'strain', amount: 3}, 6, 'Taking damage removes {amount} driver strain (every 6 s).'),
  boon('measured-strike', 'Measured Strike', 'Stayer', 'cleanLap', {kind: 'buff', stat: 'combat', amount: .12, seconds: 8}, 0, 'A lap without damage gives +{combat} combat for {seconds} s.'),
  // Schemer: abilities, the field, opportunities
  boon('double-down', 'Double Down', 'Schemer', 'ability', {kind: 'buff', stat: 'speed', amount: .06, seconds: 6}, 0, 'Using your ability also gives +{speed} speed for {seconds} s.'),
  boon('vulture', 'Vulture', 'Schemer', 'anyWreck', {kind: 'charge'}, 9999, 'The first wreck of the race, by anyone, refunds your ability charge.'),
  boon('opportunist', 'Opportunist', 'Schemer', 'anyWreck', {kind: 'buff', stat: 'speed', amount: .06, seconds: 4}, 0, 'Any wreck gives +{speed} speed for {seconds} s.'),
  boon('counterpunch', 'Counterpunch', 'Schemer', 'overtaken', {kind: 'buff', stat: 'combat', amount: .15, seconds: 5}, 3, 'Being overtaken gives +{combat} combat for {seconds} s.'),
  boon('war-chest', 'War Chest', 'Schemer', 'lead', {kind: 'charge'}, 9999, 'The first time you take the lead, refund your ability charge.'),
  boon('smoke-screen', 'Smoke Screen', 'Schemer', 'contact', {kind: 'buff', stat: 'shield', amount: .2, seconds: 3}, 4, 'Contact gives {shield} damage reduction for {seconds} s (every 4 s).'),
].map(b => [b.id, b])));

// Capstones (Phase 3): holding 3 or more Boons of one style unlocks that style's
// always-on bonus for the rest of the Series.
export const CAPSTONE_AT = 3;
export const CAPSTONES = Object.freeze({
  Bruiser: Object.freeze({name: 'Butcher', stat: 'combat', amount: .1, text: '+10% combat at all times.'}),
  Speedster: Object.freeze({name: 'Quicksilver', stat: 'speed', amount: .04, text: '+4% top speed at all times.'}),
  Stayer: Object.freeze({name: 'Ironclad', stat: 'shield', amount: .15, text: '15% damage reduction at all times.'}),
  Schemer: Object.freeze({name: 'Mastermind', stat: 'handling', amount: .05, text: '+5% handling, and your Boons recharge twice as fast.'}),
});
export function capstones(boons) {
  const n = {};
  for (const b of boons ?? []) { const st = BOONS[b.id]?.style; if (st) n[st] = (n[st] ?? 0) + 1; }
  return STYLES.filter(st => (n[st] ?? 0) >= CAPSTONE_AT);
}
// Soft ceiling (2026-11-27): a single Boon's buff bends toward its stat's ceiling
// instead of passing it, so every level and rarity upgrade still adds something.
// Values up to half the ceiling are unchanged.
export function softAmount(stat, raw) {
  const cap = CAPS[stat];
  if (!cap || raw <= cap / 2) return raw;
  const h = cap / 2;
  return h + h * (1 - Math.exp(-(raw - h) / h));
}
// Strength the ceiling bends away is paid out as extra duration, so an upgrade
// near the ceiling lasts longer instead of doing nothing. Rounded to 0.5 s.
export function boonSeconds(def, level, rarity) {
  const fx = def.effect;
  if (fx.kind !== 'buff' || !fx.seconds || fx.seconds >= 600) return fx.seconds;
  const raw = (fx.amount ?? 0) * boonStrength(def, level, rarity), amount = softAmount(fx.stat, raw);
  return Math.round(fx.seconds * (amount > 0 ? raw / amount : 1) * 2) / 2;
}
export function boonAmount(def, level, rarity) {
  const raw = (def.effect.amount ?? 0) * boonStrength(def, level, rarity);
  return def.effect.kind === 'buff' ? softAmount(def.effect.stat, raw) : raw;
}
export function boonStrength(b, level, rarity) { return (RARITY[rarity] ?? 1) * LEVEL[Math.min(LEVEL.length, level) - 1]; }
export function validateEndowments(e) {
  if (e === undefined) return;
  if (!e || e.rules !== ENDOWMENT_RULES || !Array.isArray(e.boons) || Object.keys(e).sort().join(',') !== 'boons,rules') throw Error('Invalid endowments');
  const seen = new Set();
  for (const b of e.boons) {
    if (!b || Object.keys(b).sort().join(',') !== 'id,level,rarity' || !BOONS[b.id] || seen.has(b.id) || !Number.isSafeInteger(b.level) || b.level < 1 || b.level > 4 || !Object.hasOwn(RARITY, b.rarity)) throw Error('Invalid boon');
    seen.add(b.id);
  }
}
export const endowed = r => !!r?.endowments?.boons?.length;
export function initialEndowState() { return {cool: {}, buffs: [], damagedLap: false}; }

const leader = s => { let best = null; for (const o of s.entrants) if (o.status === 'Racing' && (!best || o.q > best.q || o.q === best.q && o.id < best.id)) best = o; return best; };
function triggered(s, r, e, attackers) {
  const p = e.participants ?? [], fx = e.effects ?? {}, me = r.id;
  switch (e.type) {
    case 'ATTACK': return fx.success && fx.attacker === me ? (fx.crit ? ['hit', 'crit'] : ['hit']) : [];
    case 'DAMAGE': return p[0] === me && fx.amount > 0 ? ['hurt'] : [];
    case 'CONTACT': return p.includes(me) ? ['contact'] : [];
    case 'OVERTAKE': return fx.passer === me ? ['overtake'] : fx.passed === me ? ['overtaken'] : [];
    case 'LEAD_CHANGED': return fx.leader === me ? ['lead'] : [];
    case 'LAP_COMPLETED': return p[0] === me ? ['lap', ...(r.endow.damagedLap ? [] : ['cleanLap'])] : [];
    case 'FINAL_LAP': return p[0] === me ? ['finalLap', ...(r.ru.beasts.every(b => b.fatigue < 50) ? ['finalLapFresh'] : [])] : [];
    case 'ABILITY_ACTIVATED': return p[0] === me ? ['ability'] : [];
    case 'CONTROL_CHANGED': return p[0] === me && fx.control === 'Normal' ? ['controlRegained'] : [];
    case 'RACE_STARTED': return ['start'];
    case 'WRECK_CREATED': { if (p[0] === me) return []; const by = attackers[String(fx.cause ?? '')]; return by === me ? ['wreck', 'anyWreck'] : ['anyWreck']; }
    default: return [];
  }
}
function apply(s, r, b, def) {
  const k = boonStrength(def, b.level, b.rarity), fx = def.effect, dt = s.config.dt;
  if (fx.kind === 'buff') {
    if (!fx.seconds) return null;
    r.endow.buffs = r.endow.buffs.filter(x => x.id !== def.id);
    const amount = boonAmount(def, b.level, b.rarity), seconds = boonSeconds(def, b.level, b.rarity);
    r.endow.buffs.push({id: def.id, stat: fx.stat, amount, until: s.tick + Math.ceil(seconds / dt)});
    return {stat: fx.stat, amount, seconds};
  }
  if (fx.kind === 'fatigue') { const n = fx.amount * k; for (const x of r.ru.beasts) x.fatigue = Math.max(0, x.fatigue - n); return {fatigue: -n}; }
  if (fx.kind === 'strain') { const n = fx.amount * k; r.ru.driver.strain = Math.max(0, r.ru.driver.strain - n); return {strain: -n}; }
  if (fx.kind === 'charge') {
    const m = r.m6; if (!m || m.activeAbility || m.pendingAbility || !r.progressionContext?.abilityId) return null;
    if (m.spent) { if (!m.spent.length) return null; m.spent.pop(); m.charges++; return {charges: m.charges}; }
    if (m.charges !== 0) return null;
    m.charges = 1; return {charges: 1};
  }
  return null;
}
// Called once per tick boundary. Reads the native events written since the
// last boundary; BOON_FIRED events it emits are skipped by the next pass.
export function endowBoundary(s) {
  const from = s.endowCursor ?? 0, to = s.events.length;
  const users = s.entrants.filter(endowed);
  if (!users.length) { s.endowCursor = to; return; }
  const attackers = s.endowAttackers ??= {};
  for (let i = from; i < to; i++) {
    const e = s.events[i];
    if (e.type === 'BOON_FIRED') continue;
    if (e.type === 'ATTACK' && e.effects?.attackId) attackers['attack:' + String(e.effects.attackId).replace(/^attack:/, '')] = e.effects.attacker;
    for (const r of users) {
      r.endow ??= initialEndowState();
      if (e.type === 'DAMAGE' && e.participants?.[0] === r.id && e.effects?.amount > 0) r.endow.damagedLap = true;
      if (r.status !== 'Racing') continue;
      const keys = triggered(s, r, e, attackers);
      if (e.type === 'LAP_COMPLETED' && e.participants?.[0] === r.id) r.endow.damagedLap = false;
      if (!keys.length) continue;
      for (const b of r.endowments.boons) {
        const def = BOONS[b.id];
        if (!keys.includes(def.trigger) || s.tick < (r.endow.cool[b.id] ?? 0)) continue;
        const result = apply(s, r, b, def);
        if (!result) continue;
        if (def.cooldown) r.endow.cool[b.id] = s.tick + Math.ceil(def.cooldown / s.config.dt / (capstones(r.endowments.boons).includes('Schemer') ? 2 : 1));
        emit(s, 'BOON_FIRED', [r.id], {boonId: b.id, trigger: def.trigger, ...result});
      }
    }
  }
  for (const r of users) if (r.endow) r.endow.buffs = r.endow.buffs.filter(x => x.until > s.tick);
  s.endowCursor = s.events.length;
}
export function endowBonus(s, r, stat) {
  if (!endowed(r) || !r.endow) return 0;
  let n = 0;
  for (const x of r.endow.buffs) if (x.stat === stat && x.until > s.tick) n += x.amount;
  if (stat === 'accel') for (const b of r.endowments.boons) {
    const def = BOONS[b.id];
    if (def.trigger === 'leading' && r.status === 'Racing' && leader(s)?.id === r.id) n += boonAmount(def, b.level, b.rarity);
  }
  for (const st of capstones(r.endowments.boons)) if (CAPSTONES[st].stat === stat) n += CAPSTONES[st].amount;
  return Math.min(CAPS[stat] ?? n, n);
}
export function endowDerived(s, r, d) {
  if (!endowed(r)) return d;
  const sp = endowBonus(s, r, 'speed'), ac = endowBonus(s, r, 'accel'), hd = endowBonus(s, r, 'handling');
  if (!sp && !ac && !hd) return d;
  return {...d, maxSpeed: d.maxSpeed * (1 + sp), acceleration: Math.min(s.config.accelerationLimit, d.acceleration * (1 + ac)), lateral: d.lateral * (1 + hd), handling: Math.min(100, d.handling * (1 + hd))};
}
