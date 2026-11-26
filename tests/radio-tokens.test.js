import test from 'node:test';
import assert from 'node:assert/strict';
import {alternateLine} from '../src/presentation/content/m3-bc.js';

// Regression: tokens containing digits (time_4dp) were left as literal "{time_4dp}" in Race Radio.
test('alternate radio fills every token in finish lines', () => {
  const presentation = {radio: {version: 1, enabled: true}};
  for (let id = 1; id <= 30; id++) {
    const event = {id, time: 10, type: 'RU_FINISHED', participants: ['Iron Hoof Stables'], effects: {time: 86.34567}};
    const line = {eventId: id, time: 10, type: 'RU_FINISHED', text: 'native'};
    const out = alternateLine(line, event, presentation);
    assert.doesNotMatch(out.text, /[{}]/);
    if (out.text !== 'native') assert.match(out.text, /86\.35/);
  }
});
