import { writeFile, mkdir } from "node:fs/promises";
import { raceSetup } from "../../src/prototype/session.js";
import { createRace, step, issueSign } from "../../src/sim/race.js";
import { checkpointRace } from "../../src/sim/foundation/checkpoint.js";
const cases = [["oval", "Pure", 4], ["oval", "Combat", 8], ["C01", "Pure", 8], ["C01", "Combat", 8], ["rally-short", "Combat", 8], ["rally-long", "Combat", 8]];
const out = "/workspace/deliverables/bnt-p1-5/evidence/fixtures";
await mkdir(out, { recursive: true });
const rows = [];
for (const [course, format, fieldSize] of cases) {
  const options = { course, format, fieldSize, seed: 145, pacing: "tactical", weather: "Clear", laps: 2 }, s = createRace(raceSetup(options).setup);
  issueSign(s, "queue", "Push the Pace");
  const ticks = course === "C01" ? [98, 998, 2198] : course === "rally-long" ? [98, 1798, 2998] : course === "oval" ? [98, 798, 1398] : [98, 598, 998];
  for (let phase = 0; phase < 3; phase++) {
    while (s.tick < ticks[phase]) step(s);
    const cp = checkpointRace(s, { profileId: "bench", careerId: "bench", instanceId: "bench", raceId: "bench" }), name = course + "-" + format + "-" + phase + ".json";
    await writeFile(out + "/" + name, JSON.stringify(cp));
    rows.push({ options, phase: ["early", "middle", "late"][phase], tick: s.tick, file: name });
  }
}
await writeFile(out + "/index.json", JSON.stringify(rows));
console.log("Prepared", rows.length, "native checkpoint fixtures");
export {
  cases
};
