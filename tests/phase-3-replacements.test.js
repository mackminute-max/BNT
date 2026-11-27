import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareCreation} from '../src/management/creation/model.js';
import {M6CareerStore} from '../src/persistence/m6/store.js';
import {validateM6} from '../src/career/m6/schema.js';
import {makeE5Command} from '../src/career/championships/e5/contracts.js';
import {replaceEliminatedRivals, replacementWindow} from '../src/career/m6/replacements.js';
import {eligibility} from '../src/career/championships/progression.js';
import {standings} from '../src/career/championships/scoring.js';
import {prepareRace} from '../src/career/championships/controller.js';

const request = {version: 5, id: 'p3-repl', slotId: 'slot-22222222-2222-2222-2222-222222222222', profileId: 'p3-repl-owner', careerId: 'p3-repl-career', ownerName: 'Owner', careerName: 'Stable', packageId: 'veteran', emblem: 'wheel', primary: '#203944', secondary: '#dfb863', recruitIdentities: true, ownerIdentity: {version: 1, nationality: 'N1', ancestry: 'A01', sex: 'female', startingNation: 'N1'}};
function registered() {
  const c = prepareCreation(request), map = new Map(c.records), storage = {getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, v), removeItem: k => map.delete(k)}, store = new M6CareerStore(storage);
  store.open();
  const s = store.state, d = s.e5.board[0], a = Object.values(s.management.registries.assignments)[0];
  store.transaction(makeE5Command(s, 'e5.register', {templateId: d.id, instanceId: 'ignored', selection: {assignmentId: a.id, driverId: a.driverId, beastIds: a.beastIds, chariotId: a.chariotId}}, 'p3-repl-entry'));
  const after = structuredClone(store.state);
  return {s: after, x: after.championshipFoundation.instances[after.championshipFoundation.activeId]};
}

test('Phase 3 an eliminated rival is replaced by a new AI team before the Semifinal', () => {
  const {s, x} = registered();
  // Pretend the Series is 5 races long so race 2 is inside the replacement window.
  while (x.offer.value.schedule.length < 5) x.offer.value.schedule.push(x.offer.value.schedule.at(-1));
  const out = x.entrants.find(e => !e.player);
  x.conditionState[out.id].driver.injury = 'Critical';
  x.eligibility = eligibility(s, x);
  const before = x.entrants.length;
  const added = replaceEliminatedRivals(s, x, 1, eligibility);
  assert.equal(added.length, 1);
  assert.equal(x.entrants.length, before + 1);
  assert.ok(x.m6.names[added[0]].organization, 'the new team has a name');
  assert.notEqual(x.m6.names[added[0]].organization, x.m6.names[out.id].organization);
  assert.ok(x.eligibility.find(r => r.entrantId === added[0]).mayStart);
  assert.equal(replaceEliminatedRivals(s, x, 1, eligibility).length, 0, 'never replaced twice');
  const setup = prepareRace(x, 1), ids = setup.entrants.map(e => e.ru.id);
  assert.ok(ids.includes(added[0]) && !ids.includes(out.id));
  assert.equal(ids.length, x.offer.value.fieldSize);
  assert.deepEqual(standings(x.entrants.map(e => e.id), []).length, x.entrants.length);
});

test('Phase 3 no replacements for the Semifinal or the Championship', () => {
  const {s, x} = registered();
  while (x.offer.value.schedule.length < 5) x.offer.value.schedule.push(x.offer.value.schedule.at(-1));
  assert.equal(replacementWindow(x, 2), true);
  assert.equal(replacementWindow(x, 3), false);
  assert.equal(replacementWindow(x, 4), false);
  const out = x.entrants.find(e => !e.player);
  x.conditionState[out.id].driver.injury = 'Critical';
  x.eligibility = eligibility(s, x);
  assert.equal(replaceEliminatedRivals(s, x, 3, eligibility).length, 0);
});

test('Phase 3 a saved career with a replacement still validates', () => {
  const {s, x} = registered();
  const out = x.entrants.find(e => !e.player);
  x.conditionState[out.id].driver.injury = 'Critical';
  x.eligibility = eligibility(s, x);
  // The intro Series is 3 races, so only race 1 is in the window; force it for the check.
  const n = x.offer.value.schedule.length;
  assert.equal(replaceEliminatedRivals(s, x, n - 2, eligibility).length, 0);
  x.m6.replacements = [];
  x.offer = x.offer; // unchanged offer keeps the board fingerprint valid
  const added = replaceEliminatedRivals(s, x, 0, eligibility);
  assert.equal(added.length, 1);
  x.standings = x.entrants.map(e => ({id: e.id, points: 0}));
  validateM6(s);
});
