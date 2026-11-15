// Audit probes, not fixes or additions to the game regression suite.
// Run from any directory: node docs/audits/evidence/reproduce-findings.mjs
import { spawnSync } from "node:child_process";
import { createRace, step, issueSign } from "../../../src/sim/race.js";
import { entrant } from "../../../tests/fixtures.js";

const hazardRace = createRace({
  seed: 145,
  driverMode: "reference",
  entrants: [entrant("A")],
  consequence: { incidentRate: 0 },
  scheduledIncidents: [
    { time: 0, type: "debris", lane: 1, tile: 79, duration: 12 },
  ],
});
step(hazardRace); // Generate debris in an empty adjacent tile first.
step(hazardRace, [{ type: "lane", id: "A", lane: 1 }]);
const ru = hazardRace.entrants[0];
const tile = ((Math.floor(ru.q) % hazardRace.track.cells) + hazardRace.track.cells) % hazardRace.track.cells;
const hazardOverlap = hazardRace.hazards.some(h => h.lane === ru.lane && h.q === tile);

const a = entrant("A", 0, -1.1);
a.ru.driver.personality = {
  aggression: 100, caution: 100, patience: 0, opportunism: 0,
  staminaManagement: 0, tacticalDiscipline: 100,
};
const signRace = createRace({
  seed: 145,
  entrants: [a, entrant("B", 0, -0.5), entrant("C", 1, -1.1)],
  consequence: { incidentRate: 0 },
  autonomous: { executionError: 0, judgmentError: 0, stressError: 0 },
});
issueSign(signRace, "queue", "Push the Pace");
step(signRace);
const driver = signRace.entrants[0];

// Isolate a known nonterminating parser input so this audit cannot hang itself.
const moduleURL = new URL("../../../src/dev/batch.js", import.meta.url).href;
const parser = spawnSync(process.execPath, [
  "--input-type=module", "-e",
  `import {parseSeeds} from ${JSON.stringify(moduleURL)}; console.log(parseSeeds('9007199254740992-9007199254740992'));`,
], { timeout: 1000, encoding: "utf8", maxBuffer: 4096 });

console.log(JSON.stringify({
  A01: {
    reproduced: hazardOverlap && hazardRace.events.some(e => e.type === "LANE_CHANGE_COMPLETED"),
    status: hazardRace.status, lane: ru.lane, tile, q: ru.q,
    hazards: hazardRace.hazards,
    eventTypes: hazardRace.events.map(e => e.type),
  },
  A02: {
    reproduced: parser.error?.code === "ETIMEDOUT",
    input: "9007199254740992-9007199254740992",
    error: parser.error?.code ?? null, signal: parser.signal, status: parser.status,
  },
  A03: {
    reproduced: driver.pace === "Conserve" && driver.ai.diagnostics.compliance === "Followed",
    activeSign: driver.signs.active,
    chosen: driver.ai.diagnostics.chosen,
    executedPace: driver.pace,
    reportedCompliance: driver.ai.diagnostics.compliance,
  },
}, null, 2));
