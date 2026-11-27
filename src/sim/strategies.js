// Strategies (Mack 2026-11-27): each one has a visible gain, a visible cost and
// its own job in a race. The effects here apply while a Strategy is active, on
// top of how the driver's AI leans (src/ai/signs.js signPreference).
// Multipliers are 1 when unchanged; additive bonuses are fractions (0.07 = +7%).
export const STRATEGY_RULES = 'bnt-strategies-v1';

export const STRATEGIES = Object.freeze({
  'Push the Pace': {
    icon: 'flame', job: 'Close a gap or break away late.',
    gain: '+9% top speed, +12% acceleration', cost: 'Beasts tire 60% faster, chariot wears 30% faster',
    speed: .09, accel: .12, fatigue: 1.6, wear: 1.3,
  },
  'Conserve Strength': {
    icon: 'leaf', job: 'Save the beasts for the finish.',
    gain: 'Beasts tire 60% slower and recover 50% faster', cost: '−3% top speed',
    speed: -.03, fatigue: .4, recovery: 1.5,
  },
  'Seek Open Track': {
    icon: 'arrows', job: 'Get out of traffic and around a slow pack.',
    gain: '+8% handling, faster lane changes', cost: 'No slipstream bonus, beasts tire 25% faster',
    handling: .08, noDraft: true, fatigue: 1.25,
  },
  'Ride the Slipstream': {
    icon: 'wind', job: 'Sit on a rival\'s tail and save effort.',
    gain: 'Slipstream bonus doubled, beasts tire 25% slower while drafting', cost: '−3% top speed in clean air',
    draft: 2, draftFatigue: .75, cleanAirSpeed: -.03,
  },
  'Hold Position': {
    icon: 'wall', job: 'Protect a lead or a place.',
    gain: 'Rivals behind you get no slipstream from you, +6% handling', cost: '−6% top speed, −8% acceleration',
    blockDraft: true, handling: .06, speed: -.06, accel: -.08,
  },
  'Race Defensively': {
    icon: 'shield', job: 'Survive a rough race.',
    gain: 'Take 30% less damage', cost: '−5% top speed, your hits 50% weaker',
    shield: .30, speed: -.05, combat: -.5,
  },
  'Engage Rivals': {
    icon: 'swords', job: 'Hurt the rivals near you (Combat only).',
    gain: 'Your hits 30% stronger', cost: 'Take 20% more damage, beasts tire 30% faster',
    combat: .30, shield: -.20, fatigue: 1.3, combatOnly: true,
  },
  'Play It Safe': {
    icon: 'anchor', job: 'Get through bad corners, weather or a hurt turnout.',
    gain: 'Corner crash risk halved, driver strain builds 50% slower', cost: '−4% top speed',
    cornerRisk: .5, strain: .5, speed: -.04,
  },
});
export const STRATEGY_NAMES = Object.freeze(Object.keys(STRATEGIES));

export const strategyOf = r => (r?.status === 'Racing' && r.signs?.active ? STRATEGIES[r.signs.active] ?? null : null);
export const strategyMul = (r, key) => strategyOf(r)?.[key] ?? 1;
export const strategyAdd = (r, key) => strategyOf(r)?.[key] ?? 0;

// Speed, acceleration and handling while a Strategy is active.
export function strategyDerived(s, r, d, drafting = false) {
  const st = strategyOf(r);
  if (!st) return d;
  const sp = (st.speed ?? 0) + (!drafting ? st.cleanAirSpeed ?? 0 : 0), ac = st.accel ?? 0, hd = st.handling ?? 0;
  if (!sp && !ac && !hd) return d;
  return {...d, maxSpeed: d.maxSpeed * (1 + sp), acceleration: Math.min(s.config.accelerationLimit, d.acceleration * (1 + ac)), lateral: d.lateral * (1 + hd), handling: Math.min(100, d.handling * (1 + hd))};
}

// Slipstream: a rival ahead in the same lane within draftTiles. Strategies can
// switch it off (Seek Open Track) or deny it to followers (Hold Position).
export function drafting(s, r) {
  const c = s.config;
  if (c.schema < 2 || !c.draftBonus || r.status !== 'Racing' || strategyOf(r)?.noDraft) return false;
  for (const o of s.entrants)
    if (o.status === 'Racing' && o.id !== r.id && o.lane === r.lane && o.q > r.q && o.q - r.q <= c.draftTiles && !strategyOf(o)?.blockDraft) return true;
  return false;
}

// Rival coaches (Mack 2026-11-27, decision 1a): rivals call Strategies by the
// same rules as the player, at the same sign points, with the same number of
// uses. Each coach has a fixed temperament from the race seed: some lean on
// aggression, some on patience. Pure function of race state.
const progressOf = (s, r) => s.track.course && !s.track.closed
  ? (r.checkpointCursor ?? 0) / ((s.track.checkpoints?.length ?? 0) + 1)
  : (r.completedLaps ?? 0) / Math.max(1, s.config.laps);
export function coachPick(s, r, temper) {
  const beasts = r.ru.beasts, tired = beasts.reduce((n, b) => n + (b.fatigue ?? 0), 0) / Math.max(1, beasts.length);
  const hurt = Math.min(r.ru.driver.condition ?? 100, r.ru.chariot.condition ?? 100);
  const racing = s.entrants.filter(o => o.status === 'Racing').sort((a, b) => b.q - a.q), place = racing.findIndex(o => o.id === r.id);
  const late = progressOf(s, r) >= .6, combat = s.format === 'Combat';
  const near = racing.some(o => o.id !== r.id && Math.abs(o.q - r.q) <= 3);
  const ahead = racing.some(o => o.id !== r.id && o.lane === r.lane && o.q > r.q && o.q - r.q <= (s.config.draftTiles ?? 6));
  if (hurt < 45) return combat ? 'Race Defensively' : 'Play It Safe';
  if (tired > 70 && !late) return 'Conserve Strength';
  if (late) return place === 0 ? 'Hold Position' : 'Push the Pace';
  if (combat && near && temper > .55) return 'Engage Rivals';
  if (ahead) return temper < .4 ? 'Ride the Slipstream' : 'Seek Open Track';
  return temper < .3 ? 'Conserve Strength' : null;
}
