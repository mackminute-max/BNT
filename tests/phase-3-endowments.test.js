import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace, run, capture, digest} from '../src/sim/race.js';
import {verifyReplay} from '../src/replay/replay.js';
import {BOONS, STYLES, ENDOWMENT_RULES, validateEndowments, boonStrength, endowBonus, CAPS} from '../src/sim/endowments.js';
import {entrant} from './fixtures.js';

const boons = ids => ({rules: ENDOWMENT_RULES, boons: ids.map(id => ({id, level: 1, rarity: 'Common'}))});
const field = (endow) => ['A', 'B', 'C', 'D'].map((id, i) => ({...entrant(id, i % 3, -0.5 - i * 0.6, 0, 50 + i * 4), ...(endow?.[id] ? {endowments: endow[id]} : {})}));
const race = (endow, seed = 21) => run(createRace({seed, format: 'Combat', entrants: field(endow), overrides: {laps: 3}}));

test('Phase 3 catalog: six Boons per style, each with readable text', () => {
  for (const style of STYLES) assert.equal(Object.values(BOONS).filter(b => b.style === style).length, 6, style);
  for (const b of Object.values(BOONS)) assert.ok(b.name && b.text && b.trigger && b.effect.kind, b.id);
  assert.equal(boonStrength(BOONS['blood-rush'], 2, 'Rare'), 2.6);
});

test('Phase 3 endowments are validated strictly', () => {
  validateEndowments(undefined);
  validateEndowments(boons(['blood-rush', 'iron-hide']));
  assert.throws(() => validateEndowments({rules: 'x', boons: []}));
  assert.throws(() => validateEndowments(boons(['no-such-boon'])));
  assert.throws(() => validateEndowments(boons(['grudge', 'grudge'])));
  assert.throws(() => validateEndowments({rules: ENDOWMENT_RULES, boons: [{id: 'grudge', level: 5, rarity: 'Common'}]}));
  assert.throws(() => validateEndowments({rules: ENDOWMENT_RULES, boons: [{id: 'grudge', level: 1, rarity: 'Mythic'}]}));
  assert.throws(() => createRace({entrants: [{...entrant('A'), endowments: boons(['nope'])}]}));
});

test('Phase 3 races without endowments are unchanged and emit no Boon events', () => {
  const a = race(), b = race({});
  assert.equal(digest(a), digest(b));
  assert.equal(a.events.some(e => e.type === 'BOON_FIRED'), false);
  assert.equal('endowCursor' in a, false);
});

test('Phase 3 Boons fire, are deterministic, and replay exactly', () => {
  const all = boons(Object.keys(BOONS));
  const endow = {A: all, B: all, C: all, D: all};
  const a = race(endow), b = race(endow);
  assert.equal(digest(a), digest(b));
  const fired = new Set(a.events.filter(e => e.type === 'BOON_FIRED').map(e => e.effects.boonId));
  for (const id of ['launch-control', 'iron-lungs', 'home-straight']) assert.ok(fired.has(id), id);
  assert.notEqual(digest(a), digest(race()));
  assert.equal(verifyReplay(capture(a)).checksum, digest(a));
});

test('Phase 3 Boon bonuses stack within their caps', () => {
  const s = createRace({seed: 3, entrants: [{...entrant('A'), endowments: boons(['blood-rush', 'grudge'])}, entrant('B', 1)]});
  const a = s.entrants.find(r => r.id === 'A');
  a.endow.buffs.push({id: 'x', stat: 'combat', amount: .2, until: 99}, {id: 'y', stat: 'combat', amount: .2, until: 99});
  assert.equal(endowBonus(s, a, 'combat'), CAPS.combat);
  assert.equal(endowBonus(s, s.entrants.find(r => r.id === 'B'), 'combat'), 0);
});
