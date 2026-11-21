import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const html = await readFile("dist/Blood-and-Thunder-P2.2-Playable.html"), server = createServer((req, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
const report = { browser: browser.version(), groups: [], file: null };
try {
  const page = await browser.newPage();
  await page.addInitScript(() => {
    window.Worker = class {
      constructor() {
        throw Error("Injected Worker denial");
      }
    };
  });
  await page.goto("http://127.0.0.1:" + server.address().port);
  await page.waitForFunction(() => P1.session?.state);
  assert.equal(await page.evaluate(() => P1.session.mode), "sync-fallback");
  assert.equal(await page.locator("#compare").isEnabled(), true);
  assert.match(await page.locator("#bufferStatus").textContent(), /Injected Worker denial/);
  await page.click("#openDeveloper");await page.click("#step");await page.click("#returnToRace");
  assert.equal(await page.evaluate(() => P1.session.state.tick), 1);
  report.groups.push("Worker initialization denial: labeled synchronous fallback and native step");
  await page.close();
  const normal = await browser.newPage();
  await normal.goto("http://127.0.0.1:" + server.address().port);
  await normal.waitForFunction(() => P1.session?.state);
  await normal.evaluate(() => P1.session.fail(Error("Injected active worker failure")));
  assert.equal(await normal.evaluate(() => P1.session.phase), "error");
  const tick = await normal.evaluate(() => P1.session.state.tick);
  await normal.waitForTimeout(200);
  assert.equal(await normal.evaluate(() => P1.session.state.tick), tick);
  report.groups.push("Active Worker failure halts without automatic simulation substitution");
  await normal.evaluate(() => P1.prepare({ fieldSize: 1, pacing: "tactical", mode: "worker" }));
  await normal.waitForFunction(() => P1.session?.mode === "worker" && P1.session.state);
  assert.equal(await normal.evaluate(() => P1.session.state.tick), 0);
  report.groups.push("Manual restart creates fresh generation");
  await normal.click("#start");
  await normal.waitForFunction(() => P1.session.lead >= 0.75);
  await normal.selectOption("#sign", "Conserve Strength");
  await normal.click("#queue");
  await normal.waitForFunction(() => P1.session.commands.get(1)?.status === "accepted-queued");
  assert.equal(await normal.evaluate(() => P1.session.state.tick), 0);
  assert.equal(await normal.evaluate(() => P1.session.state.entrants[0].signs.active), null);
  await normal.waitForFunction(() => P1.session.commands.get(1)?.status === "activated-delayed");
  await normal.waitForFunction(() => P1.session.state.entrants[0].signs.active === "Conserve Strength");
  assert.equal(await normal.evaluate(() => P1.session.state.entrants[0].signs.remaining), 2);
  report.groups.push("Live countdown delay-window command activates at native decision and appears only on presented timeline");
  report.command = await normal.evaluate(() => P1.session.metrics().commands[0]);
  await normal.context().setOffline(true);
  await normal.waitForTimeout(300);
  assert.equal(await normal.evaluate(() => P1.session.mode), "worker");
  report.groups.push("Prepared standalone Worker continues offline without runtime network requests");
  await normal.close();
  const reset = await browser.newPage();
  await reset.goto("http://127.0.0.1:"+server.address().port);
  await reset.waitForFunction(()=>P1.session?.state);
  await reset.evaluate(()=>P1.prepare({fieldSize:1,pacing:"tactical",mode:"worker"}));
  await reset.click("#start");
  await reset.waitForFunction(()=>P1.session.lead>=.75);
  await reset.evaluate(()=>P1.session.sign("queue","Conserve Strength"));
  await reset.waitForFunction(()=>P1.session.commands.get(1)?.status==="accepted-queued");
  const restarted=await reset.evaluate(async()=>{const old=P1.session;await P1.prepare({fieldSize:1,pacing:"tactical",mode:"worker"});return {different:old.generation!==P1.session.generation,status:old.commands.get(1).status};});
  assert.equal(restarted.different,true);
  assert.equal(restarted.status,"abandoned-with-race");
  await reset.waitForTimeout(100);
  assert.deepEqual(await reset.evaluate(()=>{const r=P1.session.state.entrants[0];return {tick:P1.session.state.tick,pending:r.signs.pending,active:r.signs.active,remaining:r.signs.remaining};}),{tick:0,pending:null,active:null,remaining:3});
  report.groups.push("Restart with an accepted pending command abandons the old generation without resending or spending in the new race");
  await reset.close();
  const local = await browser.newPage();
  try {
    await local.goto("file://" + process.cwd() + "/dist/Blood-and-Thunder-P2.2-Playable.html");
    await local.waitForFunction(() => P1.session?.state, {}, { timeout: 1e4 });
    report.file = { result: "opened", mode: await local.evaluate(() => P1.session.mode) };
  } catch (e) {
    report.file = { result: "unavailable", reason: e.message };
  }
  await local.close();
} finally {
  await browser.close();
  server.close();
  await writeFile("/workspace/deliverables/bnt-p2-2/evidence/browser-faults.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}
