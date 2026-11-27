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
  assert.ok(race.entrants.filter(r => r.id !== race.playerId).every(r => !r.endowments));
});

test('Phase 3 offers fall back to the original Run Rewards outside M6 careers', () => {
  const {s, x} = setup(); delete x.m6;
  assert.ok(runOffer(s, x, 'r').choices.every(c => c.kind !== 'boon'));
});
