import { build } from "esbuild";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { createRace, digest, run, capture } from "../../src/sim/race.js";
const bundle = await build({ stdin: { contents: `import * as race from './src/sim/race.js';import * as cp from './src/sim/foundation/checkpoint.js';import {verifyReplay} from './src/replay/replay.js';import {raceSetup} from './src/prototype/session.js';window.native={...race,...cp,verifyReplay,raceSetup};`, resolveDir: process.cwd() }, bundle: true, format: "iife", platform: "browser", write: false }), html = "<script>" + bundle.outputFiles[0].text.replaceAll("<\/script", "<\\/script") + "<\/script>", server = createServer((q, r) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
const report = { browser: browser.version(), clock: [], races: [], delayed: null };
try {
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:" + server.address().port);
  for (let seed = 100; seed < 200; seed++) {
    const setup = { seed, overrides: { laps: 1 }, championshipContext: { version: 1, instanceId: "clock-proof", raceId: "race" } }, s = createRace(setup), actual = await page.evaluate((setup2) => {
      const s2 = native.createRace(setup2);
      return { checksum: native.digest(s2), nextIncidentAt: s2.nextIncidentAt };
    }, setup);
    assert.equal(actual.checksum, digest(s));
    assert.equal(actual.nextIncidentAt, s.nextIncidentAt);
    report.clock.push({ seed, checksum: actual.checksum });
  }
  for (const [course, format] of [[null, "Pure"], ["C01", "Combat"], ["mixed-rally", "Combat"]]) {
    const setup = { seed: 1460515178, course, format, overrides: { laps: 1 }, championshipContext: { version: 1, instanceId: "clock-proof", raceId: "race" } }, expected = capture(run(createRace(setup))), actual = await page.evaluate((setup2) => native.capture(native.run(native.createRace(setup2))), setup);
    assert.deepEqual(actual, expected);
    report.races.push({ course, format, checksum: actual.checksum, exactCapture: true });
  }
  report.delayed = await page.evaluate(() => {
    const s = native.createRace(native.raceSetup({ fieldSize: 1, pacing: "tactical" }).setup);
    for (let i = 0; i < 21; i++) native.step(s);
    const order = s.commands.length;
    native.issueSign(s, "queue", "Conserve Strength");
    const boundary = s.events.find((e) => e.type === "RACE_STARTED");
    if (!native.issueSign(s, "buffer-delay-v1", { version: 1, sign: "Conserve Strength", queueOrder: order, viewTick: 0, viewTime: 0, boundaryEventId: boundary.id, preStart: true })) throw Error("Delay rejected");
    const cp = native.checkpointRace(s, { profileId: "p", careerId: "c", instanceId: "i", raceId: "r" }), copy = native.restoreRace(cp);
    for (let i = 0; i < 40; i++) {
      native.step(s);
      native.step(copy);
    }
    const replay = native.verifyReplay(native.capture(s));
    if (native.digest(s) !== native.digest(copy) || replay.checksum !== native.digest(s)) throw Error("Replay/restore mismatch");
    return { checksum: replay.checksum, activation: s.events.find((e) => e.type === "SIGN_ACTIVATED"), checkpointRestored: true };
  });
  console.log("100 clock states, 3 full championship-context captures and delayed replay/checkpoint passed");
} finally {
  await browser.close();
  server.close();
  await writeFile("/workspace/deliverables/bnt-p1-5/evidence/browser-native.json", JSON.stringify(report, null, 2));
}
