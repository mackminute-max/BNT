import test from 'node:test';
import assert from 'node:assert/strict';
import {trackNames} from '../src/career/m5/team-name.js';
import {interaction} from '../src/prototype/interactions.js';
import {config} from '../src/config/config.js';

test('Phase 2b on-track names keep only the team ending, unless generic or shared', () => {
  assert.deepEqual(trackNames(['Hearthvale Thunderhorns of Stonevein', 'Ironmarch Racing House of Ironhand', 'Keldhaven Blue Standards of Stonewick', 'Frostmere Blue Standards of Deepgate', null]),
    ['Thunderhorns', 'Ironmarch Racing House', 'Keldhaven Blue Standards', 'Frostmere Blue Standards', null]);
});

test('Phase 2b critical hits are shown as crits on attack and damage', () => {
  const evt = (type, effects) => ({id: 1, tick: 1, time: 1, type, participants: ['a', 'b'], effects});
  const hit = interaction(evt('ATTACK', {success: true, crit: true, attacker: 'a', defender: 'b'}));
  assert.equal(hit.label, 'CRITICAL HIT');
  assert.equal(hit.crit, true);
  assert.equal(interaction(evt('ATTACK', {success: true})).label, 'HIT');
  assert.equal(interaction(evt('DAMAGE', {amount: 12, component: 'chariot', crit: true})).crit, true);
});

test('Phase 2b pack dead zone is a schema 2 field only', () => {
  assert.equal(config().packDeadzone, 0);
  assert.equal('packDeadzone' in config({schema: 1}), false);
  assert.throws(() => config({schema: 1, packDeadzone: 3}));
});
