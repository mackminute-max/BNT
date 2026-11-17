import { tacticalScenario } from "./combat-ai-refinement/scenarios.mjs";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { canonical } from "../src/core/determinism.js";
import { createHash } from "node:crypto";
// Fail with a bounded diagnostic before deepEqual can format a multi-megabyte diff.
function assertReplayEqual(actual, expected) {
  const hash = value => createHash("sha256").update(canonical(value)).digest("hex");
  assert.equal(hash(actual), hash(expected), JSON.stringify({message:"Browser/Node replay differs", actual:{checksum:actual.checksum,course:actual.setup.course,straightLength:actual.setup.overrides.straightLength},expected:{checksum:expected.checksum,course:expected.setup.course,straightLength:expected.setup.overrides.straightLength}, firstEventDifference:actual.events.findIndex((e,i)=>canonical(e)!==canonical(expected.events[i]))}));
  assert.deepEqual(actual, expected);
}

import { createRace, run, step, capture, issueSign } from "../src/sim/race.js";

import { configuration } from "../src/dev/configuration.js";
import { verifyReplay } from "../src/replay/replay.js";
import { entrant, fixtureCatalog } from "../tests/fixtures.js";

const htmlPath = resolve("dist/Blood_and_Thunder.html");
const html = await readFile(htmlPath, "utf8");
const fileURL = pathToFileURL(htmlPath).href;
await mkdir("artifacts", { recursive: true });
const report = {
  browser: null,
  fileLaunch: "not attempted",
  checks: [],
  errors: [],
  networkRequests: [],
};
const pushCheck = report.checks.push.bind(report.checks);
report.checks.push = (...checks) => { console.log(checks.join("\n")); return pushCheck(...checks); };
const browser = await chromium.launch({
  executablePath: process.env.BNT_BROWSER_PATH || "/usr/bin/chromium",
  headless: true,
  timeout: 15000,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
let server;
try {
  report.browser = browser.version();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => report.errors.push(e.message));
  const documentURLs = new Set([fileURL]);
  page.on("request", (request) => {
    if (!(request.isNavigationRequest() && documentURLs.has(request.url()))) {
      report.networkRequests.push(request.url());
    }
  });
  let mode = "file";
  try {
    await context.setOffline(true);
    await page.goto(fileURL, { timeout: 10000 });
    await page.waitForFunction(() => !!window.BNT, { timeout: 5000 });
    report.fileLaunch = "passed offline";
  } catch (e) {
    report.fileLaunch = `blocked: ${e.message.split("\n")[0]}`;
    if (!e.message.includes("ERR_BLOCKED_BY_ADMINISTRATOR")) throw e;
    mode = "http diagnostic only";
    await context.setOffline(false);
    server = createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const diagnosticURL = `http://127.0.0.1:${server.address().port}/`;
    documentURLs.add(diagnosticURL);
    await page.goto(diagnosticURL, {
      timeout: 10000,
    });
    await page.waitForFunction(() => !!window.BNT, { timeout: 5000 });
    await context.setOffline(true);
  }
  report.mode = mode;
  assert.equal(await page.title(), "Blood and Thunder · Racing Prototype");
  assert.equal(await page.locator("#trackPreset").inputValue(), "oval");
  report.checks.push("Artifact loads with original Standard Oval selected and Canvas UI initializes");
  await page.click("#step");
  assert.equal(await page.locator("#tick").textContent(), "1");
  await page.waitForTimeout(100);
  assert.equal(await page.locator("#tick").textContent(), "1");
  report.checks.push("Step advances exactly one tick and remains paused");
  await page.click("#reset");
  assert.equal(await page.locator("#tick").textContent(), "0");
  await page.click("#play");
  await page.waitForFunction(() => window.BNT.getState().tick > 2);
  await page.click("#play");
  const paused = await page.locator("#tick").textContent();
  await page.waitForTimeout(150);
  assert.equal(await page.locator("#tick").textContent(), paused);
  report.checks.push("Start and pause control simulation advancement");
  await page.click("#reset");
  await page.screenshot({ path: "artifacts/m4-grid.png", fullPage: true });
  await page.selectOption("#sign", "Conserve Strength");
  await page.click("#queueSign");
  assert.match(
    await page.locator("#signStatus").textContent(),
    /Uses 2.*Pending: Conserve Strength/,
  );
  await page.click("#step");
  assert.match(
    await page.locator("#signStatus").textContent(),
    /Active: Conserve Strength/,
  );
  await page.click("#lowerSign");
  assert.match(await page.locator("#signStatus").textContent(), /Active: none/);
  report.checks.push(
    "Pre-race sign queue, starting activation and free paused lowering work",
  );
  await page.click("#reset");
  await page.click("#complete");
  await page.waitForFunction(
    () => document.getElementById("state").textContent === "Ended",
    undefined,
    { timeout: 60000 },
  );
  assert.equal(await page.locator("#state").textContent(), "Ended");
  const actual = await page.evaluate(() =>
    window.BNT.capture(window.BNT.getState()),
  );
  const expected = capture(run(createRace()));
  assertReplayEqual(actual, expected);
  report.checks.push(
    "Bundled browser eight-RU race matches Node events, commands and checksum exactly",
  );
  const download = page.waitForEvent("download");
  await page.click("#export");
  const exported = await download;
  const file = await exported.path();
  const exportedData = JSON.parse(await readFile(file, "utf8"));
  assert.equal(exportedData.checksum, actual.checksum);
  report.checks.push("Input/event export produces valid matching JSON");
  await page.screenshot({ path: "artifacts/m4-results.png", fullPage: true });
  await page.selectOption("#format", "Combat");
  await page.click("#reset");
  // A positive-value engagement, rather than assuming every default sign must attack.
  await page.locator("#developer > summary").click();
  const combatSetup = tacticalScenario("weapon");
  await page.fill("#setupJSON", JSON.stringify(configuration(combatSetup)));
  await page.click("#applySetup");
  await page.selectOption("#sign", "Engage Rivals");
  await page.click("#queueSign");
  await page.click("#complete");
  await page.waitForFunction(
    () => document.getElementById("state").textContent === "Ended",
    undefined,
    { timeout: 60000 },
  );
  const combatActual = await page.evaluate(() =>
    window.BNT.capture(window.BNT.getState()),
  );
  const combatExpected = createRace(combatSetup);
  issueSign(combatExpected, "queue", "Engage Rivals");
  run(combatExpected);
  assertReplayEqual(combatActual, capture(combatExpected));
  assert.ok(combatActual.events.some((e) => e.type === "ATTACK"));
  report.combatChecksum = combatActual.checksum;
  report.checks.push(
    "Combat format and Engage Rivals reproduce Node events and checksum",
  );
  await page.screenshot({ path: "artifacts/m4-combat.png", fullPage: true });
  await page.fill("#setupJSON", JSON.stringify(configuration({})));
  await page.click("#applySetup");
  await page.locator("#developer > summary").click();
  await page.selectOption("#format", "Pure");
  await page.fill("#damageScale", "1");
  await page.click("#reset");
  await page.click("#complete");
  await page.waitForFunction(
    () => document.getElementById("state").textContent === "Ended",
    undefined,
    { timeout: 60000 },
  );
  const damaged = await page.evaluate(() => window.BNT.getState());
  assert.ok(Object.keys(damaged.wrecks).length > 0);
  assert.match(await page.locator("#standings").textContent(), /DNF/);
  assert.match(
    await page.locator("#consequenceStatus").textContent(),
    /Wrecks [1-9]/,
  );
  await page.screenshot({ path: "artifacts/m4-wrecks.png", fullPage: true });
  report.checks.push(
    "High-damage scenario shows permanent wrecks and DNF classification",
  );
  await page.fill("#damageScale", "0.003");
  await page.selectOption("#weather", "Rain");
  await page.fill("#signStrength", "8");
  await page
    .getByText("AI and per-sign tuning (new race)", { exact: true })
    .click();
  await page.locator('[data-key="signPush"]').fill("1.5");
  await page.click("#reset");
  const configured = await page.evaluate(() => window.BNT.getState());
  assert.equal(configured.weather, "Rain");
  assert.equal(configured.autonomous.signStrength, 8);
  assert.equal(configured.autonomous.signPush, 1.5);
  report.checks.push(
    "New-race weather, global and per-sign tuning are applied",
  );
  await page.locator("#developer > summary").click();
  await page.selectOption("#componentScope", "RU1");
  await page.selectOption("#componentObject", "beasts.0");
  await page.selectOption("#componentField", "speed");
  await page.fill("#componentValue", "93");
  await page.selectOption("#componentMode", "live");
  await page.click("#applyComponent");
  assert.equal(
    await page.evaluate(() => window.BNT.getState().pendingOverrides.length),
    1,
  );
  await page.click("#step");
  assert.equal(
    await page.evaluate(
      () => window.BNT.getState().entrants[0].ru.beasts[0].speed,
    ),
    93,
  );
  assert.match(
    await page.locator("#overrideStatus").textContent(),
    /revision 1/,
  );
  report.checks.push(
    "Paused component override queues, applies at boundary and logs its revision",
  );
  await page.click("#verifyReplay");
  await page.waitForFunction(
    () =>
      document
        .getElementById("replayStatus")
        .textContent.startsWith("Verified "),
    undefined,
    { timeout: 60000 },
  );
  const replayDownloadPromise = page.waitForEvent("download");
  await page.click("#export");
  const replayDownload = await replayDownloadPromise;
  const replayBytes = await readFile(await replayDownload.path());
  const partial = JSON.parse(replayBytes.toString());
  await page.setInputFiles("#replayFile", {
    name: "replay.json",
    mimeType: "application/json",
    buffer: replayBytes,
  });
  await page.waitForFunction(
    () =>
      document
        .getElementById("replayStatus")
        .textContent.includes("Press Start or Step"),
    undefined,
    { timeout: 60000 },
  );
  assert.equal(await page.evaluate(() => window.BNT.getState().tick), 0);
  assert.equal(await page.locator("#queueSign").isDisabled(), true);
  await page.click("#step");
  assert.equal(
    await page.evaluate(() => window.BNT.digest(window.BNT.getState())),
    partial.checksum,
  );
  await page.click("#restartReplay");
  assert.equal(await page.evaluate(() => window.BNT.getState().tick), 0);
  report.checks.push(
    "Replay import verifies events/checkpoints, reconstructs overrides, steps and restarts",
  );
  await page.selectOption("#componentScope", "all");
  await page.selectOption("#componentObject", "beasts.*");
  await page.selectOption("#componentField", "power");
  await page.fill("#componentValue", "80");
  await page.selectOption("#componentMode", "new");
  await page.click("#applyComponent");
  assert.equal(
    await page.evaluate(() =>
      window.BNT.getState().entrants.every((r) =>
        r.ru.beasts.every((b) => b.power === 80),
      ),
    ),
    true,
  );
  report.checks.push(
    "Bulk component editor applies the selected attribute to all teams in a new race",
  );
  await page.selectOption("#parameterGroup", "environment");
  await page.selectOption("#parameterField", "visibility");
  await page.fill("#parameterValue", "0.3");
  await page.click("#applyParameter");
  assert.equal(
    await page.evaluate(() => window.BNT.getState().environment.visibility),
    0.3,
  );
  await page.click("#saveSetup");
  await page.waitForFunction(() =>
    document
      .getElementById("developerStatus")
      .textContent.includes("saved locally"),
  );
  const configurationDownloadPromise = page.waitForEvent("download");
  await page.click("#exportSetup");
  const configurationDownload = await configurationDownloadPromise;
  const configurationBytes = await readFile(await configurationDownload.path());
  const beforeInvalid = await page.evaluate(() =>
    window.BNT.digest(window.BNT.getState()),
  );
  await page.setInputFiles("#setupFile", {
    name: "corrupt.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"schema":999}'),
  });
  await page.waitForFunction(() =>
    document
      .getElementById("developerStatus")
      .textContent.includes("Unsupported configuration"),
  );
  assert.equal(
    await page.evaluate(() => window.BNT.digest(window.BNT.getState())),
    beforeInvalid,
  );
  await page.click("#resetSetup");
  await page.click("#loadSetup");
  assert.equal(
    await page.evaluate(() => window.BNT.getState().environment.visibility),
    0.3,
  );
  await page.setInputFiles("#setupFile", {
    name: "configuration.json",
    mimeType: "application/json",
    buffer: configurationBytes,
  });
  report.checks.push(
    "Versioned configuration saves, loads, exports, imports and rejects corrupt input safely",
  );
  await page.evaluate(() =>
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    }),
  );
  await page.click("#saveSetup");
  await page.waitForFunction(() =>
    document
      .getElementById("developerStatus")
      .textContent.includes("Storage unavailable"),
  );
  await page.click("#step");
  assert.equal(await page.evaluate(() => window.BNT.getState().tick), 1);
  report.checks.push(
    "Denied browser storage preserves playable in-memory configuration and export",
  );
  const batchDoc = JSON.parse(await page.locator("#setupJSON").inputValue());
  batchDoc.setup.entrants = batchDoc.setup.entrants.slice(0, 1);
  batchDoc.setup.overrides.laps = 1;
  batchDoc.setup.consequence.incidentRate = 0;
  await page.fill("#setupJSON", JSON.stringify(batchDoc));
  await page.click("#applySetup");
  for (const invalid of ["9007199254740992-9007199254740992", "1-600,1-600"]) {
    await page.fill("#batchSeeds", invalid);
    await page.click("#batchRun");
    await page.waitForFunction(() => /Invalid seed range|Choose 1\.\.1000 seeds/.test(document.getElementById("developerStatus").textContent));
    assert.equal(await page.evaluate(() => window.BNT.getState().tick), 0);
    await page.click("#step");
    assert.equal(await page.evaluate(() => window.BNT.getState().tick), 1);
    await page.click("#applySetup");
  }
  report.checks.push("Unsafe and oversized batch ranges show diagnostics without freezing or corrupting the live race");
  await page.fill("#batchSeeds", "5,6");
  await page.click("#batchRun");
  await page.click("#step");
  await page.waitForFunction(
    () =>
      document
        .getElementById("batchStatus")
        .textContent.includes("2 completed races"),
    undefined,
    { timeout: 60000 },
  );
  const batchOutput = JSON.parse(
    await page.locator("#batchOutput").textContent(),
  );
  assert.equal(batchOutput.completed, 2);
  assert.equal(batchOutput.means.finishes, 1);
  assert.equal(await page.evaluate(() => window.BNT.getState().tick), 1);
  report.checks.push(
    "Responsive batch analysis uses independent races while the live viewer can step",
  );
  await page.selectOption("#resultsView", "technical");
  assert.equal(
    JSON.parse(await page.locator("#resultsOutput pre").textContent()).entrants
      .length,
    1,
  );
  assert.ok((await page.locator("#commentary").textContent()).length > 0);
  await page.screenshot({ path: "artifacts/m4-workbench.png", fullPage: true });
  report.checks.push(
    "Commentary, official/narrative/technical results and developer diagnostics render",
  );
  await page.setViewportSize({ width: 800, height: 900 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  report.checks.push("800px viewport has no horizontal overflow");
  // Corrective-pass workflows use public UI controls and the bundled engine.
  const correctiveA = entrant("A");
  correctiveA.ru.driver.awareness = 0;
  correctiveA.ru.driver.personality = { aggression: 100, caution: 0, patience: 0, opportunism: 0, staminaManagement: 0, tacticalDiscipline: 100 };
  const correctiveSetup = { seed: 145, entrants: [correctiveA], environmentOverrides: { visibility: .1 },
    autonomous: { noise: 0, executionError: 0, judgmentError: 0, stressError: 0, utility: { laneBase: 100 } },
    consequence: { incidentRate: 0 }, scheduledIncidents: [{ time: 0, type: "debris", lane: 1, tile: 79, duration: 12 }] };
  await page.fill("#setupJSON", JSON.stringify(configuration(correctiveSetup)));
  await page.click("#applySetup");
  await page.selectOption("#sign", "Push the Pace");
  await page.click("#queueSign"); await page.click("#step");
  const corrected = await page.evaluate(() => window.BNT.getState());
  assert.equal(corrected.entrants[0].ai.diagnostics.compliance, "Followed");
  assert.equal(corrected.entrants[0].ai.diagnostics.executed.position, null);
  assert.equal(corrected.entrants[0].lane, 0);
  assert.match(await page.locator("#signStatus").textContent(), /Followed/);
  const correctiveExpected = createRace(correctiveSetup);
  issueSign(correctiveExpected, "queue", "Push the Pace"); step(correctiveExpected);
  assertReplayEqual(await page.evaluate(() => window.BNT.capture(window.BNT.getState())), capture(correctiveExpected));
  report.checks.push("B01 blocked positional maneuver preserves pace compliance and bundled/Node event parity");

  await page.selectOption("#surfaceSegment", "north");
  await page.selectOption("#surfaceField", "hazardModifier");
  await page.fill("#surfaceValue", "2"); await page.click("#applySurface");
  assert.equal(await page.evaluate(() => window.BNT.getState().track.segments[0].surface.hazardModifier), 2);
  const surfaceDigest = await page.evaluate(() => window.BNT.digest(window.BNT.getState()));
  await page.fill("#surfaceValue", "-1"); await page.click("#applySurface");
  assert.match(await page.locator("#developerStatus").textContent(), /Invalid surface modifier/);
  assert.equal(await page.evaluate(() => window.BNT.digest(window.BNT.getState())), surfaceDigest);
  assert.equal(JSON.parse(await page.locator("#setupJSON").inputValue()).setup.surfaces.north.hazardModifier, 2);
  report.checks.push("B02 hazard modifier is tunable, serialized and validated without corrupting the live setup");

  const fatigueSetup = { seed: 145, entrants: [entrant("A", 0, -.5, 0, 80), entrant("B", 1, -.5, 0, 20)], overrides: { laps: 1 }, consequence: { incidentRate: 0 }, checkpointInterval: 1000 };
  await page.fill("#setupJSON", JSON.stringify(configuration(fatigueSetup))); await page.click("#applySetup");
  await page.selectOption("#speed", "16"); await page.click("#play");
  await page.waitForFunction(() => window.BNT.getState().entrants.some(r => r.finishTime !== null), undefined, { timeout: 60000 });
  await page.click("#play");
  const finishedBefore = await page.evaluate(() => window.BNT.getState().entrants.find(r => r.finishTime !== null));
  const fatigueBefore = await page.evaluate(() => window.BNT.results(window.BNT.getState()).technical.fatigueAtFinish);
  await page.selectOption("#componentScope", finishedBefore.id);
  await page.selectOption("#componentObject", "beasts.*"); await page.selectOption("#componentField", "fatigue");
  await page.selectOption("#componentMode", "live"); await page.fill("#componentValue", "100");
  await page.click("#applyComponent"); await page.click("#step");
  assert.equal(await page.evaluate(() => window.BNT.results(window.BNT.getState()).technical.fatigueAtFinish), fatigueBefore);
  const fatigueRecord = await page.evaluate(() => window.BNT.capture(window.BNT.getState()));
  const fatigueVerified = verifyReplay(fatigueRecord);
  assert.equal(fatigueVerified.checksum, fatigueRecord.checksum);
  const resultDownload = page.waitForEvent("download"); await page.click("#exportResults");
  const resultJSON = JSON.parse(await readFile(await (await resultDownload).path(), "utf8"));
  assert.deepEqual(resultJSON.technical.entrants.find(r => r.id === finishedBefore.id).finishSnapshot, finishedBefore.finishSnapshot);
  await page.click("#complete");
  await page.waitForFunction(() => document.getElementById("state").textContent === "Ended", undefined, { timeout: 60000 });
  assert.deepEqual(await page.evaluate(id => window.BNT.getState().entrants.find(r => r.id === id).finishSnapshot, finishedBefore.id), finishedBefore.finishSnapshot);
  report.checks.push("B03 finished RU can be live-edited while historical fatigue survives export, replay and exit clearance");

  await page.fill("#setupJSON", JSON.stringify(configuration(fixtureCatalog.finish_photo.setup))); await page.click("#applySetup");
  await page.click("#complete");
  await page.waitForFunction(() => document.getElementById("state").textContent === "Ended", undefined, { timeout: 60000 });
  const photo = await page.evaluate(() => window.BNT.capture(window.BNT.getState()));
  assertReplayEqual(photo, capture(run(createRace(fixtureCatalog.finish_photo.setup))));
  assert.deepEqual(await page.evaluate(() => window.BNT.classification(window.BNT.getState()).map(r => r.place)), [1, 1]);
  report.checks.push("B04 named photo-finish fixture produces official ties with exact bundled/Node parity");
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.networkRequests, []);
  report.checks.push(
    "No JavaScript errors or runtime network requests (including initial load)",
  );
  report.checksum = actual.checksum;
  report.result =
    mode === "file"
      ? "PASS"
      : "BLOCKED: functional checks passed over HTTP, actual file launch denied by browser policy";
} catch (e) {
  report.errors.push(e.stack);
  report.result = "FAIL";
} finally {
  await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  await mkdir("artifacts", { recursive: true });
  await writeFile(
    "artifacts/browser-report.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
}
if (report.result !== "PASS") process.exitCode = 1;
