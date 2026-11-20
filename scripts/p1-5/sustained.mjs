import { build } from "esbuild";
import { chromium } from "playwright-core";
import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import assert from "node:assert/strict";
const out = "/workspace/deliverables/bnt-p1-5/evidence", root = "/tmp/bnt-p15-reference", b = await build({ entryPoints: [root + "/src/prototype/app.js"], bundle: true, format: "iife", platform: "browser", target: "es2020", write: false }), old = (await readFile(root + "/src/prototype/index.html", "utf8")).replace("<!-- BUNDLE -->", "<script>" + b.outputFiles[0].text.replaceAll("<\/script", "<\\/script") + "<\/script>"), now = await readFile("dist/Blood-and-Thunder-P1.5-Playable.html"), server = createServer((req, res) => res.end(req.url === "/reference" ? old : now));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
const report = { browser: browser.version(), rows: [], errors: [], notes: "Full uninterrupted ordinary viewer races, 4x speed; one sample each; countdown included in wall time. Sequential, no concurrent verification load." };
try {
  for (const course of ["C01", "rally-long"]) for (const mode of (process.env.BNT_P15_MODES ?? "reference,worker,sync").split(",")) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1e3 } });
    page.on("pageerror", (e) => report.errors.push(e.message));
    await page.goto("http://127.0.0.1:" + server.address().port + (mode === "reference" ? "/reference" : "/candidate"));
    await page.waitForFunction(() => P1.session?.state);
    const options = { course, format: "Combat", fieldSize: 8, pacing: "tactical", seed: 145, laps: 2, weather: "Clear" };
    await page.evaluate(async ({ mode: mode2, options: options2 }) => {
      await P1.prepare({ ...options2, mode: mode2 === "reference" ? void 0 : mode2 });
      P1.session.sign("queue", "Push the Pace");
      window.__frames = [];
      window.__peak = 0;
      let last;
      function frame(now2) {
        if (last) __frames.push(now2 - last);
        last = now2;
        __peak = Math.max(__peak, performance.memory?.usedJSHeapSize ?? 0);
        window.__raf = requestAnimationFrame(frame);
      }
      __raf = requestAnimationFrame(frame);
      window.__start = performance.now();
    }, { mode, options });
    if (mode === "worker") await page.waitForFunction(() => P1.session.commands.get(1)?.status === "accepted-queued");
    await page.selectOption("#speed", "4");
    await page.click("#start");
    await page.waitForFunction(() => ["Ended", "Stalled", "Error"].includes(P1.session.state.status), null, { timeout: 3e5 });
    const row = await page.evaluate(() => {
      cancelAnimationFrame(__raf);
      const a = [...__frames].sort((x, y) => x - y), q = (p) => a[Math.min(a.length - 1, Math.floor(a.length * p))], metrics = P1.session.metrics();
      return { wallMs: performance.now() - __start, status: P1.session.state.status, ticks: P1.session.state.tick, checksum: metrics.checksum, classification: P1.session.official().classification, frames: { n: a.length, median: q(0.5), p95: q(0.95), p99: q(0.99), max: a.at(-1), over50: a.filter((x) => x > 50).length, over100: a.filter((x) => x > 100).length, over200: a.filter((x) => x > 200).length }, frameSamples: __frames, maxHeap: __peak, metrics, error: P1.session.error ?? null };
    });
    report.rows.push({ mode, options, ...row });
    console.log(mode, course, row.status, row.ticks, row.checksum, row.frames);
    await writeFile(out + "/" + (process.env.BNT_P15_REPORT ?? "sustained.json"), JSON.stringify(report, null, 2));
    await page.close();
  }
  for (const course of ["C01", "rally-long"]) {
    const rows = report.rows.filter((x) => x.options.course === course);
    for (const r of rows.slice(1)) {
      assert.equal(r.checksum, rows[0].checksum);
      assert.deepEqual(r.classification, rows[0].classification);
    }
  }
  assert.deepEqual(report.errors, []);
} finally {
  await browser.close();
  server.close();
}
