import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRace, step, run, issueSign, capture, digest, assertState } from '../src/sim/race.js';
import { perceive } from '../src/ai/driver.js';
import { parseSeeds } from '../src/dev/batch.js';
import { verifyReplay } from '../src/replay/replay.js';
import { statistics } from '../src/reporting/results.js';
import { queueOverride } from '../src/dev/overrides.js';
import { entrant, fixtureCatalog, scenario } from './fixtures.js';

for (const format of ['Pure', 'Combat']) {
  for (const type of ['debris', 'animal', 'spectator']) {
    test(`A01 ${format} lateral ${type} impact blocks visible and hidden hazards deterministically`, () => {
      for (const visibility of [1, 0.1]) {
        const make = reverse => {
          const entrants = [entrant('A', 0, -.5, 10), entrant('B', 2, -.5, 10)];
          entrants.forEach(e => e.ru.driver.awareness = 0);
          const s = createRace({ seed: 145, format, playerId: 'A', driverMode: 'reference', entrants: reverse ? entrants.reverse() : entrants,
            environmentOverrides: { visibility }, consequence: { incidentRate: 0 },
            scheduledIncidents: [{ time: 0, type, lane: 1, tile: 79, duration: 12 }] });
          step(s);
          if (visibility === .1) assert.equal(perceive(s, s.entrants[0]).hazards.length, 0);
          step(s, [{ type: 'lane', id: 'A', lane: 1 }, { type: 'lane', id: 'B', lane: 1 }]);
          assertState(s);
          assert.equal(s.status, 'Running');
          assert.equal(s.events.filter(e => e.type === 'LANE_CHANGE_COMPLETED').length, 0);
          assert.equal(s.events.filter(e => e.type === 'LANE_CHANGE_REJECTED').length, 2);
          assert.equal(s.events.filter(e => e.type === 'INCIDENT_IMPACT').length, 2);
          assert.ok(s.events.some(e => e.type === 'DAMAGE'));
          assert.ok(s.entrants.every(r => r.lane !== 1));
          assert.equal(verifyReplay(capture(s)).checksum, digest(s));
          return s;
        };
        const a = make(false), b = make(true);
        assert.deepEqual(a.events, b.events);
        assert.equal(digest(a), digest(b));
      }
    });
  }
}
test('A01 expiry allows lateral entry and unchanged stationary contact does not repeat damage', () => {
  const s = createRace({ driverMode: 'reference', entrants: [entrant('A')], consequence: { incidentRate: 0 },
    scheduledIncidents: [{ time: 0, type: 'debris', lane: 1, tile: 79, duration: .15 }] });
  step(s);
  for (let i = 0; i < 2; i++) step(s, [{ type: 'lane', id: 'A', lane: 1 }]);
  assert.equal(s.events.filter(e => e.type === 'INCIDENT_IMPACT').length, 1);
  step(s, [{ type: 'lane', id: 'A', lane: 1 }]);
  assert.equal(s.entrants[0].lane, 1);
  assertState(s);
});

test('A02 seed ranges reject unsafe endpoints and cumulative overflow before expansion', () => {
  for (const text of ['9007199254740992-9007199254740992', `${'9'.repeat(400)}-${'9'.repeat(400)}`, '1-1001', '1-1000,1', '1-600,1-600', '4-2'])
    assert.throws(() => parseSeeds(text));
  assert.throws(() => parseSeeds(null));
  assert.throws(() => parseSeeds(''));
  assert.deepEqual(parseSeeds('9007199254740990-9007199254740991'), [9007199254740990, Number.MAX_SAFE_INTEGER]);
  assert.deepEqual(parseSeeds('-9007199254740991,0,1-3'), [Number.MIN_SAFE_INTEGER, 0, 1, 2, 3]);
  assert.equal(parseSeeds('1-1000').length, 1000);
});
function conflict({ sign = 'Push the Pace', disengage = false, failure = false } = {}) {
  const a = entrant('A', 0, -1.1);
  a.ru.driver.personality = { aggression: 100, caution: 100, patience: 0, opportunism: 0, staminaManagement: 0, tacticalDiscipline: 100 };
  if (failure) a.ru.driver.driving = 0;
  const s = createRace({ seed: 145, format: disengage ? 'Combat' : 'Pure', entrants: [a, entrant('B', 0, -.5), entrant('C', 1, -1.1)],
    consequence: { incidentRate: 0, ...(disengage ? { disengageBase: 100 } : {}) },
    autonomous: { executionError: failure ? 1 : 0, judgmentError: 0, stressError: 0 } });
  issueSign(s, 'queue', sign); step(s); return s;
}
for (const disengage of [false, true]) {
  test(`A03 executed ${disengage ? 'disengage' : 'yield'} overrides Push compliance in diagnostics, events and totals`, () => {
    const s = conflict({ disengage }), r = s.entrants[0], d = r.ai.diagnostics;
    assert.equal(d.chosen.pace, 'Push');
    assert.equal(d.chosen.position, disengage ? 'disengage' : 'yield');
    assert.equal(d.executed.pace, 'Conserve');
    assert.equal(r.pace, 'Conserve');
    assert.equal(d.compliance, 'Overridden');
    assert.match(d.reason, /requires Conserve/);
    assert.equal(s.events.find(e => e.type === 'AI_DECISION' && e.participants[0] === 'A').effects.compliance, 'Overridden');
    assert.deepEqual(statistics(s).signCompliance, { Overridden: 1 });
    assert.equal(verifyReplay(capture(s)).checksum, digest(s));
  });
}
test('A03 effective Conserve obeys its sign; an execution failure remains Prevented', () => {
  const obey = conflict({ sign: 'Conserve Strength' });
  assert.equal(obey.entrants[0].ai.diagnostics.compliance, 'Followed');
  const fail = conflict({ failure: true });
  assert.equal(fail.entrants[0].ai.diagnostics.compliance, 'Prevented');
  assert.equal(fail.entrants[0].ai.diagnostics.executed.position, null);
});

test('A05 all twenty named scenarios hold normalized reproducible snapshots and explicit invariants', () => {
  assert.equal(Object.keys(fixtureCatalog).length, 20);
  for (const [name, meta] of Object.entries(fixtureCatalog)) {
    assert.ok(meta.expectedInvariants.length, name);
    assert.equal(meta.seed, meta.setup.seed);
    assert.ok(meta.setup.config || meta.setup.overrides, name);
    const a = scenario(name), b = scenario(name);
    assert.equal(digest(a), digest(b), name);
    step(a, meta.openingCommands); step(b, meta.openingCommands);
    assertState(a); assertState(b);
    assert.notEqual(a.status, 'Error', name);
    assert.equal(digest(a), digest(b), name);
  }
  assert.throws(() => scenario('missing'));
});
test('A05 reusable Sprint, retirement, blockage and clearing scenarios exercise documented outcomes', () => {
  const sprint = scenario('fatigue_sprint');
  for (let i = 0; i < 20; i++) step(sprint, i ? [] : fixtureCatalog.fatigue_sprint.openingCommands);
  assert.ok(sprint.entrants[0].ru.beasts.every(b => b.fatigue > 0));
  const dead = run(scenario('all_retired'));
  assert.equal(dead.status, 'Ended');
  assert.equal(Object.keys(dead.wrecks).length, 2);
  const blocked = run(scenario('four_lane_blockage'));
  assert.equal(blocked.status, 'Stalled');
  assert.ok(blocked.entrants.every(r => r.finishTime === null));
  const exit = run(scenario('finish_exit_queue'));
  assert.equal(exit.status, 'Ended');
  assert.ok(exit.entrants.every(r => r.finishTime !== null && r.physical === 'Exited'));
});
test('A05 reusable replacement, pending-retirement and paused-override replay scenarios', () => {
  const replace = scenario('sign_replace');
  issueSign(replace, 'queue', 'Push the Pace'); step(replace);
  issueSign(replace, 'queue', 'Conserve Strength'); issueSign(replace, 'queue', 'Hold Position');
  assert.equal(replace.entrants[0].signs.active, 'Push the Pace');
  assert.equal(replace.entrants[0].signs.pending, 'Hold Position');
  assert.equal(replace.entrants[0].signs.remaining, 0);
  const retiring = scenario('sign_before_retirement');
  issueSign(retiring, 'queue', 'Push the Pace'); step(retiring);
  assert.equal(retiring.entrants[0].status, 'Retired');
  assert.equal(retiring.entrants[0].signs.remaining, 2);
  assert.ok(!retiring.events.some(e => e.type === 'SIGN_ACTIVATED'));
  const replay = scenario('override_replay');
  queueOverride(replay, { target: 'config', path: 'speedReference', value: 21 }, { paused: true });
  run(replay);
  assert.equal(verifyReplay(capture(replay)).checksum, digest(replay));
});
