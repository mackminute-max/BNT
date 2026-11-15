// Read-only audit probes. Run: node docs/audits/m4-update-evidence/reproduce-findings.mjs
import { createRace, step, run, issueSign, classification } from '../../../src/sim/race.js';
import { statistics } from '../../../src/reporting/results.js';
import { queueOverride } from '../../../src/dev/overrides.js';
import { entrant, scenario, fixtureCatalog } from '../../../tests/fixtures.js';

const a = entrant('A');
a.ru.driver.awareness = 0;
a.ru.driver.personality = { aggression: 100, caution: 0, patience: 0, opportunism: 0, staminaManagement: 0, tacticalDiscipline: 100 };
const sign = createRace({ seed: 145, entrants: [a], environmentOverrides: { visibility: .1 },
  autonomous: { noise: 0, executionError: 0, judgmentError: 0, stressError: 0, utility: { laneBase: 100 } },
  consequence: { incidentRate: 0 },
  scheduledIncidents: [{ time: 0, type: 'debris', lane: 1, tile: 79, duration: 12 }] });
issueSign(sign, 'queue', 'Push the Pace'); step(sign);
const ru = sign.entrants[0];
let surfaceError = null;
try { createRace({ surfaces: { north: { hazardModifier: 2 } } }); }
catch (e) { surfaceError = e.message; }

const fatigue = createRace({ seed: 145,
  entrants: [entrant('A', 0, -.5, 0, 80), entrant('B', 1, -.5, 0, 20)],
  overrides: { laps: 1 }, consequence: { incidentRate: 0 }, checkpointInterval: 1000 });
for (let i = 0; i < 20000 && !fatigue.entrants.some(r => r.finishTime !== null); i++) step(fatigue);
const finished = fatigue.entrants.find(r => r.finishTime !== null);
if (!finished) throw Error('Fatigue probe failed to reach a finish');
const before = { tick: fatigue.tick, status: fatigue.status, id: finished.id,
  finishTime: finished.finishTime, reportedFatigueAtFinish: statistics(fatigue).fatigueAtFinish };
queueOverride(fatigue, { target: 'ru', id: finished.id, path: 'beasts.*.fatigue', value: 100 }, { paused: true });
step(fatigue);
const after = { tick: fatigue.tick, status: fatigue.status, finishTime: finished.finishTime,
  reportedFatigueAtFinish: statistics(fatigue).fatigueAtFinish, finishes: statistics(fatigue).finishes };
const photo = run(scenario('finish_photo'));
const rows = classification(photo);
console.log(JSON.stringify({
  B01: { reproduced: ru.pace === 'Push' && ru.ai.diagnostics.compliance === 'Prevented',
    actualLane: ru.lane, actualPace: ru.pace, chosen: ru.ai.diagnostics.chosen,
    reportedExecuted: ru.ai.diagnostics.executed, compliance: ru.ai.diagnostics.compliance,
    perceivedHazards: ru.ai.diagnostics.perceived.hazards, totals: statistics(sign).signCompliance,
    events: sign.events.filter(e => ['LANE_CHANGE_REJECTED', 'AI_EXECUTION_RESULT'].includes(e.type)) },
  B02: { surfaceFields: Object.keys(createRace().track.segments[0].surface), illustrativeUnknownField: 'hazardModifier', error: surfaceError },
  B03: { reproduced: before.finishTime === after.finishTime && before.reportedFatigueAtFinish !== after.reportedFatigueAtFinish,
    before, after },
  B04: { status: photo.status, rows, fixtureCommands: fixtureCatalog.finish_photo.openingCommands,
    finishTimeGap: Math.abs(rows[0].time - rows[1].time), tolerance: photo.config.finishTolerance,
    distinctPlaces: rows[0].place !== rows[1].place },
}, null, 2));
