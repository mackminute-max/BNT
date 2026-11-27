import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareCreation} from '../src/management/creation/model.js';
import {M6CareerStore} from '../src/persistence/m6/store.js';
import {makeE5Command} from '../src/career/championships/e5/contracts.js';
import {rollCasualties, applyCasualtiesToPersistent, applyCasualtiesToPlayer, buryFallen, DEATH_ODDS} from '../src/career/p3/stakes.js';
import {removePerson} from '../src/career/cycles/reducers.js';
import {validateCareerGraphV4 as validateGraph} from '../src/career/cycles/schema4.js';
import {eligibility} from '../src/career/championships/progression.js';
import {previewRU4} from '../src/career/cycles/policy.js';

const ru = (d, b0, b1, c) => ({driver: {condition: d}, beasts: [{condition: b0}, {condition: b1}], chariot: {condition: c}});

test('Phase 3 death rolls only happen in a wreck, at the right odds', () => {
  assert.deepEqual(rollCasualties({instanceId: 'i', resultId: 'r', entrantId: 'e', format: 'Combat', wrecked: false, final: ru(0, 0, 0, 0)}), []);
  for (const [format, odds] of Object.entries(DEATH_ODDS)) {
    let deaths = 0, n = 4000;
    for (let i = 0; i < n; i++) deaths += rollCasualties({instanceId: 'i', resultId: 'r' + i, entrantId: 'e', format, wrecked: true, final: ru(2, 50, 50, 50)}).filter(c => c.member === 'driver').length;
    assert.ok(Math.abs(deaths / n * 100 - odds) < 2.5, `${format} driver deaths ${deaths / n}`);
  }
  // A healthy driver in a wreck never dies; a smashed chariot is always destroyed.
  const c = rollCasualties({instanceId: 'i', resultId: 'r', entrantId: 'e', format: 'Combat', wrecked: true, final: ru(60, 60, 60, 3)});
  assert.deepEqual(c, [{member: 'chariot', kind: 'destroyed'}]);
  assert.deepEqual(rollCasualties({instanceId: 'i', resultId: 'r', entrantId: 'e', format: 'Combat', wrecked: true, final: ru(1, 1, 1, 1)}), rollCasualties({instanceId: 'i', resultId: 'r', entrantId: 'e', format: 'Combat', wrecked: true, final: ru(1, 1, 1, 1)}), 'deterministic');
});

const request = {version: 5, id: 'p3-stakes', slotId: 'slot-33333333-3333-3333-3333-333333333333', profileId: 'p3-stakes-owner', careerId: 'p3-stakes-career', ownerName: 'Owner', careerName: 'Stable', packageId: 'veteran', emblem: 'wheel', primary: '#203944', secondary: '#dfb863', recruitIdentities: true, ownerIdentity: {version: 1, nationality: 'N1', ancestry: 'A01', sex: 'female', startingNation: 'N1'}};
function registered() {
  const c = prepareCreation(request), map = new Map(c.records), storage = {getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, v), removeItem: k => map.delete(k)}, store = new M6CareerStore(storage);
  store.open();
  const s = store.state, d = s.e5.board[0], a = Object.values(s.management.registries.assignments)[0];
  store.transaction(makeE5Command(s, 'e5.register', {templateId: d.id, instanceId: 'ignored', selection: {assignmentId: a.id, driverId: a.driverId, beastIds: a.beastIds, chariotId: a.chariotId}}, 'p3-stakes-entry'));
  const after = structuredClone(store.state);
  return {s: after, x: after.championshipFoundation.instances[after.championshipFoundation.activeId]};
}

test('Phase 3 a dead driver ends the turnout\'s Series, and is buried after it', () => {
  const {s, x} = registered(), player = x.entrants.find(e => e.player), r = s.management.registries;
  const lost = [{member: 'driver', kind: 'death'}, {member: 'chariot', kind: 'destroyed'}];
  applyCasualtiesToPersistent(x.conditionState[player.id], lost);
  applyCasualtiesToPlayer(s, player, lost);
  assert.equal(previewRU4(s, x.lockedSelection, {assignmentId: x.lockedSelection.assignmentId}).eligible, false);
  assert.equal(eligibility(s, x).find(e => e.entrantId === player.id).mayStart, false);
  x.m6.casualties = lost.map(c => ({...c, entrantId: player.id, raceIndex: 0, resultId: 'r', team: 'Stable', name: c.member, player: true}));
  const driverId = player.assetIds.driver, chariotId = player.assetIds.chariot, beasts = player.assetIds.beasts;
  buryFallen(s, x, removePerson);
  assert.equal(r.personnel[driverId], undefined);
  assert.equal(r.chariots[chariotId], undefined);
  assert.ok(beasts.every(id => r.beasts[id] && r.beasts[id].references.assignment.length === 0), 'surviving beasts stay, unassigned');
  assert.equal(Object.values(r.assignments).some(a => a.driverId === driverId), false);
  assert.equal(s.m6.fallen.length, 2);
  validateGraph(s);
});
