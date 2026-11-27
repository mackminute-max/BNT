import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from '../scripts/e5-d/m4/fixture.mjs';
import {runOffer, selectRun, runPreview} from '../src/career/m4/progression.js';
import {prepareRace} from '../src/career/championships/controller.js';
import {createRace, step, issueSign} from '../src/sim/race.js';
import {ABILITIES, validateM6Entrant} from '../src/sim/m6-interaction.js';
import {capstones, endowBonus, CAPSTONES} from '../src/sim/endowments.js';

const setup = () => { const f = fixture('veteran', 'p3-abil'), x0 = f.register(), s = structuredClone(f.store.state), x = s.championshipFoundation.instances[x0.id]; x.m6 = {interactionVersion: 3, activeAbility: null, abilities: []}; return {s, x}; };
const abilityCard = (s, x, i) => { for (let k = 0; k < 200; k++) { const o = runOffer(s, x, 'r' + i + '-' + k), c = o.choices.find(c => c.kind === 'ability'); if (c) return {o, c}; } throw Error('no ability card'); };

test('Phase 3 abilities fill three slots, then only upgrades are offered, up to III', () => {
  const {s, x} = setup();
  for (let i = 0; i < 40; i++) {
    const {o, c} = abilityCard(s, x, i);
    selectRun(s, x, o, {rewardId: c.id, quoteFingerprint: c.quoteFingerprint}, 'sel-' + i);
    assert.ok(x.m6.abilities.length <= 3);
    assert.ok(x.m6.abilities.every(a => a.level >= 1 && a.level <= 3));
    if (x.m6.abilities.length === 3 && x.m6.abilities.every(a => a.level === 3)) break;
  }
  assert.equal(x.m6.abilities.length, 3);
  assert.equal(x.m6.activeAbility, x.m6.abilities[0].id);
  const spare = Object.keys(ABILITIES).find(id => !x.m6.abilities.some(a => a.id === id));
  assert.throws(() => runPreview(s, x, {id: 'm6-ability-' + spare, kind: 'ability', abilityId: spare}), /slots are full/);
});

test('Phase 3 each equipped ability fires once per race, and higher levels last longer', () => {
  const {s, x} = setup();
  x.m6.abilities = [{id: 'thunder-burst', level: 1}, {id: 'perfect-line', level: 3}];
  x.m6.activeAbility = 'thunder-burst';
  let r = createRace(prepareRace(x, 0));
  const me = () => r.entrants.find(e => e.id === r.playerId);
  assert.deepEqual(me().progressionContext.abilities, x.m6.abilities);
  assert.equal(me().m6.charges, 2);
  r.status = r.status === 'Ready' ? r.status : r.status;
  while (r.tick < 40) r = step(r) ?? r;
  assert.equal(issueSign(r, 'ability', 'perfect-line'), true);
  r = step(r) ?? r;
  const long = me().m6.throughTick - r.tick;
  assert.ok(Math.abs(long * r.config.dt - ABILITIES['perfect-line'].seconds * 2) < 1, 'level III doubles the duration');
  assert.equal(issueSign(r, 'ability', 'perfect-line'), false, 'used once per race');
  assert.equal(issueSign(r, 'ability', 'thunder-burst'), false, 'one active at a time');
  validateM6Entrant(r, me());
  while (me().m6.activeAbility && r.tick < 3000) r = step(r) ?? r;
  assert.equal(issueSign(r, 'ability', 'thunder-burst'), true);
  r = step(r) ?? r;
  assert.deepEqual(me().m6.spent, ['perfect-line', 'thunder-burst']);
  assert.equal(me().m6.charges, 0);
  validateM6Entrant(r, me());
});

test('Phase 3 three Boons of one style unlock its capstone', () => {
  const three = [{id: 'blood-rush'}, {id: 'iron-hide'}, {id: 'grudge'}];
  assert.deepEqual(capstones(three), ['Bruiser']);
  assert.deepEqual(capstones(three.slice(0, 2)), []);
  const r = {endowments: {boons: three.map(b => ({...b, level: 1, rarity: 'Common'}))}, endow: {buffs: [], cool: {}}, status: 'Racing'};
  assert.equal(endowBonus({tick: 0, entrants: [r]}, r, 'combat'), CAPSTONES.Bruiser.amount);
});
