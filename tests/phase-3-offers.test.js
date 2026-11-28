import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from '../scripts/e5-d/m4/fixture.mjs';
import {runOffer, selectRun} from '../src/career/m4/progression.js';
import {endowmentsFor, ownedBoons, PACT_COST} from '../src/career/p3/boons.js';
import {validateEndowments} from '../src/sim/endowments.js';
import {prepareRace} from '../src/career/championships/controller.js';
import {createRace} from '../src/sim/race.js';

const setup = () => { const f = fixture('veteran', 'p3-offers'), x0 = f.register(), s = structuredClone(f.store.state), x = s.championshipFoundation.instances[x0.id]; x.m6 = {interactionVersion: 3, activeAbility: null}; return {s, x}; };
const pick = (s, x, o, c, id) => selectRun(s, x, o, {rewardId: c.id, quoteFingerprint: c.quoteFingerprint}, id);

test('Phase 3 offers are one Boon, one Ability and one Supplies card, deterministically', () => {
  const {s, x} = setup();
  const o = runOffer(s, x, 'result-1');
  assert.deepEqual(runOffer(s, x, 'result-1'), o);
  assert.deepEqual(o.choices.map(c => c.kind === 'boon' ? 'boon' : c.kind === 'ability' ? 'ability' : 'supplies'), ['boon', 'ability', 'supplies']);
  assert.match(o.choices[2].category, /^Supplies · /);
});

test('Phase 3 picking Boons levels them up and reaches the race as endowments', () => {
  const {s, x} = setup();
  let pacts = 0;
  for (let i = 0; i < 30; i++) {
    const o = runOffer(s, x, 'r' + i), b = o.choices.find(c => c.kind === 'boon');
    const before = s.management.registries.personnel[x.entrants.find(e => e.player).assetIds.driver].condition;
    pick(s, x, o, b, 'sel-' + i);
    const after = s.management.registries.personnel[x.entrants.find(e => e.player).assetIds.driver].condition;
    if (b.pact) { pacts++; assert.equal(after, Math.max(1, before - PACT_COST)); }
  }
  assert.ok(pacts > 0, 'some Blood Pacts were offered');
  const owned = ownedBoons(x);
  assert.ok(owned.some(b => b.level > 1), 'repeat picks level a Boon up');
  assert.ok(owned.every(b => b.level <= 4));
  const e = endowmentsFor(x); validateEndowments(e);
  const race = createRace(prepareRace(x, 0));
  assert.deepEqual(race.entrants.find(r => r.id === race.playerId).endowments, e);
  assert.ok(race.entrants.filter(r => r.id !== race.playerId).every(r => !r.endowments), 'rivals start a Series with no Endowments');
});

test('Phase 3 offers fall back to the original Run Rewards outside M6 careers', () => {
  const {s, x} = setup(); delete x.m6;
  assert.ok(runOffer(s, x, 'r').choices.every(c => c.kind !== 'boon'));
});

test('Phase 3 Treatment replaces a reward: pay Gold to heal or repair', () => {
  const {s, x} = setup(), r = s.management.registries, ids = x.entrants.find(e => e.player).assetIds;
  r.personnel[ids.driver].condition = 40; r.personnel[ids.driver].injury = 'Major'; r.chariots[ids.chariot].condition = 50;
  s.career.treasury = 1000;
  const o = runOffer(s, x, 'hurt'), t = o.choices.filter(c => c.kind === 'treatment');
  assert.deepEqual(t.map(c => c.target), ['driver', 'chariot']);
  pick(s, x, o, t[0], 'treat-1');
  assert.equal(r.personnel[ids.driver].condition, 75);
  assert.equal(r.personnel[ids.driver].injury, 'Minor');
  assert.equal(s.career.treasury, 1000 - t[0].price);
  s.career.treasury = 0;
  const o2 = runOffer(s, x, 'broke'), c = o2.choices.find(c => c.target === 'chariot');
  assert.throws(() => pick(s, x, o2, c, 'treat-2'), /Gold/);
});

test('Phase 3 Series lengths: intro 3, then 5, 7 and 9 races', async () => {
  const {nationalBoard} = await import('../src/career/m6/world.js');
  assert.deepEqual(nationalBoard('c', 'N1', {tier: 1, epoch: 0, localWins: 0, prestigeWon: false}, false).map(d => d.offer.value.schedule.length), [3]);
  assert.deepEqual(nationalBoard('c', 'N1', {tier: 1, epoch: 1, localWins: 0, prestigeWon: false}, true).filter(d => !d.m6.special).map(d => d.offer.value.schedule.length), [5, 7, 9]);
  assert.deepEqual(nationalBoard('c', 'N1', {tier: 1, epoch: 1, localWins: 2, prestigeWon: false}, true).filter(d => !d.m6.special).map(d => d.offer.value.schedule.length), [5, 7, 9]);
  // Every race needs a purse row, or publishing that race fails (Mack's intro race 3 bug).
  for (const [nation, n, intro] of [['N1', {tier: 1, epoch: 0, localWins: 0, prestigeWon: false}, false], ['N1', {tier: 1, epoch: 1, localWins: 2, prestigeWon: false}, true], ['N2', {tier: 3, epoch: 1, localWins: 0, prestigeWon: true}, true], ['N5', {tier: 6, epoch: 0, localWins: 0, prestigeWon: false}, true]])
    for (const d of nationalBoard('c', nation, n, intro)) { assert.equal(d.terms.purses.length, d.offer.value.schedule.length, d.id); assert.ok(d.terms.purses.every(p => p.length === d.offer.value.fieldSize)); }
});

test('Phase 3 rivals earn one Endowment per race run; replacements start fresh', async () => {
  const {rivalEndowments, rivalLoadout, rivalAbilityContext} = await import('../src/career/p3/boons.js');
  const {validateProgressionContext} = await import('../src/model/progression-context.js');
  const row = id => ({id});
  const x = (n, ids = ['e1']) => ({id: 'inst', m6: {type: 'local', competition: {tier: 2, events: [{format: 'Combat'}]}}, raceResults: Array.from({length: n}, (_, i) => ({eventIndex: i, kind: 'Official', rows: ids.map(row)}))});
  assert.equal(rivalEndowments(x(0), 'e1'), null);
  assert.equal(rivalAbilityContext(x(0), 'e1'), null);
  for (const n of [1, 3, 5, 8]) {
    const l = rivalLoadout(x(n), 'e1');
    assert.equal(l.boons.reduce((k, b) => k + b.level, 0) + l.abilities.reduce((k, a) => k + a.level, 0), n, 'one Endowment (or upgrade) per race run');
    assert.ok(l.abilities.length <= 3);
  }
  assert.deepEqual(rivalLoadout(x(5), 'e1'), rivalLoadout(x(5), 'e1'));
  assert.equal(rivalEndowments(x(5, ['e1']), 'late-joiner'), null, 'a replacement that has run no races holds nothing');
  for (let i = 0; i < 20; i++) {
    const e = rivalEndowments(x(6, ['e' + i]), 'e' + i); if (e) validateEndowments(e);
    const c = rivalAbilityContext(x(6, ['e' + i]), 'e' + i); if (c) validateProgressionContext(c);
  }
});
