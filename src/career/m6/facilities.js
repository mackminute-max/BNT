// Facilities (systems phase, Mack 2026-11-27, decisions 3a/3b): five buildings,
// three levels each. Every level has a clear effect and a running cost paid at the
// end of each Series. Facilities never act inside a Series: Championships stay
// sealed, so the levels a Series starts with are frozen into it (x.m6.facilities)
// and the between-Series care happens only when the Series closes.
import {INJURIES3} from '../economy/catalog.js';
import {integrityStatus} from '../assets.js';
import {exact} from '../legacy-state.js';
import {add,decimal} from '../economy/arithmetic.js';
import {buildCut,upkeepCut,cut} from './upgrades.js';
// Price of the next level after any Builders' Guild discount.
export const buildPrice = (s, id, level) => cut(FACILITIES[id].levels[level].cost, buildCut(s));
export const upkeepFor = (s, levels) => cut(upkeepOf(levels), upkeepCut(s));

export const FACILITY_RULES = 'bnt-facilities-v1';
export const FACILITY_IDS = Object.freeze(['barn', 'bunkhouse', 'workshop', 'yard', 'infirmary']);
const lv = (cost, upkeep, effect, extra) => Object.freeze({cost, upkeep, effect, ...extra});
export const FACILITIES = Object.freeze({
  barn: {name: 'Barn', icon: 'beast', job: 'Beasts rest and recover between Series.', levels: [
    lv(300, 10, '+2 beast stalls. After each Series, beasts shed 20 fatigue and regain 10 condition.', {stalls: 2, fatigue: 20, condition: 10, heal: 0}),
    lv(700, 25, '+2 more stalls. Beasts shed 35 fatigue, regain 20 condition, and minor injuries heal.', {stalls: 4, fatigue: 35, condition: 20, heal: 1}),
    lv(1500, 50, '+2 more stalls. Beasts shed 50 fatigue, regain 30 condition, and major injuries ease.', {stalls: 6, fatigue: 50, condition: 30, heal: 2}),
  ]},
  bunkhouse: {name: 'Bunk House', icon: 'driver', job: 'Room for more drivers, and rest for the ones you have.', levels: [
    lv(300, 10, '+1 driver bed. After each Series, drivers shed 20 fatigue and strain and regain 10 condition.', {beds: 1, fatigue: 20, condition: 10, heal: 0}),
    lv(700, 25, '+1 more bed. Drivers shed 35 fatigue and strain, regain 20 condition, and minor injuries heal.', {beds: 2, fatigue: 35, condition: 20, heal: 1}),
    lv(1500, 50, '+1 more bed and +1 specialist room. Drivers shed 50 fatigue and strain, regain 30 condition, and major injuries ease.', {beds: 3, rooms: 1, fatigue: 50, condition: 30, heal: 2}),
  ]},
  workshop: {name: 'Workshop', icon: 'chariot', job: 'Cheaper repairs and chariots that last longer.', levels: [
    lv(350, 10, 'Chariot repair services 10% cheaper. After each Series, chariots lose 10 wear and regain 10 condition and integrity.', {discount: 10, wear: 10, restore: 10}),
    lv(800, 25, 'Repairs 20% cheaper. Chariots lose 20 wear and regain 20 condition and integrity.', {discount: 20, wear: 20, restore: 20}),
    lv(1600, 50, '+1 chariot bay. Repairs 30% cheaper. Chariots lose 30 wear and regain 30 condition and integrity.', {discount: 30, wear: 30, restore: 30, bays: 1}),
  ]},
  yard: {name: 'Training Yard', icon: 'yard', job: 'The turnout that raced gets a little better each Series.', levels: [
    lv(400, 15, 'After each Series, the driver who raced gains +1 to their weakest rating.', {driver: 1, beasts: 0}),
    lv(900, 30, 'The driver and both beasts who raced gain +1 to their weakest rating.', {driver: 1, beasts: 1}),
    lv(1800, 60, 'The driver and both beasts who raced gain +2 to their weakest rating.', {driver: 2, beasts: 2}),
  ]},
  infirmary: {name: 'Infirmary', icon: 'infirmary', job: 'Better odds of surviving a deadly wreck, and cheaper care.', levels: [
    lv(400, 15, 'Your driver and beasts are 20% less likely to die in a wreck. Treatments and treatment services 10% cheaper.', {survive: 20, discount: 10}),
    lv(900, 30, '35% less likely to die in a wreck. Treatments 20% cheaper.', {survive: 35, discount: 20}),
    lv(1800, 60, '50% less likely to die in a wreck. Treatments 30% cheaper.', {survive: 50, discount: 30}),
  ]},
});
const ZERO = Object.freeze(Object.fromEntries(FACILITY_IDS.map(k => [k, 0])));
export const facilityLevels = s => s?.m6?.facilities?.levels ?? ZERO;
export const levelOf = (levels, id) => levels?.[id] ?? 0;
export const levelInfo = (id, level) => level > 0 ? FACILITIES[id].levels[level - 1] : null;
export const upkeepOf = levels => FACILITY_IDS.reduce((n, id) => n + (levelInfo(id, levelOf(levels, id))?.upkeep ?? 0), 0);

// Capacity the buildings add on top of the property and the older upgrades.
export function facilityCapacity(levels) {
  const b = levelInfo('barn', levelOf(levels, 'barn')), h = levelInfo('bunkhouse', levelOf(levels, 'bunkhouse')), w = levelInfo('workshop', levelOf(levels, 'workshop'));
  return {drivers: h?.beds ?? 0, specialists: h?.rooms ?? 0, beasts: b?.stalls ?? 0, chariots: w?.bays ?? 0};
}
// Discounts, frozen per Series where a Series uses them.
export const repairDiscount = levels => levelInfo('workshop', levelOf(levels, 'workshop'))?.discount ?? 0;
export const careDiscount = levels => levelInfo('infirmary', levelOf(levels, 'infirmary'))?.discount ?? 0;
export const survivalBonus = levels => levelInfo('infirmary', levelOf(levels, 'infirmary'))?.survive ?? 0;
export const seriesLevels = x => x?.m6?.facilities ?? ZERO;

export function validateFacilities(s) {
  const f = s.m6.facilities;
  if (f === undefined) return;
  exact(f, ['version', 'levels', 'report']);
  exact(f.levels, FACILITY_IDS);
  if (f.version !== 1 || FACILITY_IDS.some(k => !Number.isInteger(f.levels[k]) || f.levels[k] < 0 || f.levels[k] > 3)) throw Error('Invalid facility levels');
  if (f.report !== null) {
    exact(f.report, ['sequence', 'series', 'upkeep', 'paid', 'lines']);
    if (!Number.isSafeInteger(f.report.upkeep) || !Number.isSafeInteger(f.report.paid) || f.report.paid > f.report.upkeep || !Array.isArray(f.report.lines) || f.report.lines.length > 40 || f.report.lines.some(l => typeof l !== 'string' || l.length > 200)) throw Error('Invalid facility report');
  }
}

// m6.buildFacility: raise one building by a level, between Series only.
export function buildFacility(s, {facilityId}) {
  if (!FACILITY_IDS.includes(facilityId)) throw Error('Unknown facility');
  if (s.championshipFoundation.activeId) throw Error('Facilities can only be built between Series');
  const m = s.m6;
  m.facilities ??= {version: 1, levels: {...ZERO}, report: null};
  const now = m.facilities.levels[facilityId];
  if (now >= 3) throw Error('This facility is already at its top level');
  const next = FACILITIES[facilityId].levels[now];
  const price = buildPrice(s, facilityId, now);
  if (s.career.treasury < price) throw Error(`Building ${FACILITIES[facilityId].name} level ${now + 1} costs ${price} Gold`);
  const before = facilityCapacity(m.facilities.levels);
  s.career.treasury -= price;
  m.facilities.levels[facilityId] = now + 1;
  const after = facilityCapacity(m.facilities.levels), property = Object.values(s.management.registries.properties)[0];
  for (const k of Object.keys(after)) property.capacities[k] += after[k] - before[k];
  return {facilityId, level: now + 1, cost: price};
}

const cap = n => Math.max(0, Math.min(100, n));
const ease = (injury, steps) => {
  const i = INJURIES3.indexOf(injury);
  return i <= 0 || i === 3 || i > steps ? injury : INJURIES3[i - 1];
};
const weakest = a => Object.entries(a.attributes).filter(([k, v]) => v < 100 && a.training[k] < 100).sort((p, q) => p[1] - q[1] || p[0].localeCompare(q[0]))[0]?.[0];
function train(a, points, lines) {
  let gained = 0;
  for (let i = 0; i < points; i++) {
    const k = weakest(a);
    if (!k) break;
    a.training[k] += 1;
    a.attributes[k] = decimal(add(a.economics.baseAttributes[k], a.training[k]));
    gained++;
  }
  if (gained) lines.push(`${a.name} trained: +${gained} rating.`);
}

// Runs once when a Series closes: upkeep first, then the care each building gives.
export function facilitiesAfterSeries(s, x, summary) {
  const m = s.m6, levels = m.facilities?.levels;
  if (!levels || FACILITY_IDS.every(k => !levels[k])) return;
  const r = s.management.registries, lines = [], upkeep = upkeepFor(s, levels), paid = Math.min(upkeep, s.career.treasury);
  s.career.treasury -= paid;
  const short = paid < upkeep;
  if (short) lines.push(`Upkeep was ${upkeep - paid} Gold short. The buildings gave no care this time.`);
  else {
    const barn = levelInfo('barn', levels.barn), bunk = levelInfo('bunkhouse', levels.bunkhouse), shop = levelInfo('workshop', levels.workshop), yard = levelInfo('yard', levels.yard);
    const live = list => list.filter(a => a.available !== false && a.injury !== 'Critical');
    if (barn) { for (const b of live(Object.values(r.beasts))) { b.fatigue = cap(b.fatigue - barn.fatigue); b.condition = cap(b.condition + barn.condition); b.injury = ease(b.injury, barn.heal); } lines.push('Barn: beasts rested.'); }
    if (bunk) { for (const d of live(Object.values(r.personnel))) { d.fatigue = cap(d.fatigue - bunk.fatigue); d.strain = cap(d.strain - bunk.fatigue); d.condition = cap(d.condition + bunk.condition); d.injury = ease(d.injury, bunk.heal); } lines.push('Bunk House: drivers rested.'); }
    if (shop) { for (const c of Object.values(r.chariots).filter(c => c.status !== 'Destroyed' && c.integrity > 0)) { c.wear = cap(c.wear - shop.wear); c.condition = cap(c.condition + shop.restore); c.integrity = cap(c.integrity + shop.restore); c.status = integrityStatus(c.integrity); } lines.push('Workshop: chariots overhauled.'); }
    if (yard && summary.starts > 0) {
      const ids = x.entrants.find(e => e.player)?.assetIds;
      const d = ids && r.personnel[ids.driver];
      if (d && d.available !== false) train(d, yard.driver, lines);
      for (const id of ids?.beasts ?? []) { const b = r.beasts[id]; if (b && b.available !== false && yard.beasts) train(b, yard.beasts, lines); }
    }
  }
  m.facilities.report = {sequence: summary.sequence, series: summary.name.slice(0, 100), upkeep, paid, lines: lines.slice(0, 40)};
}
