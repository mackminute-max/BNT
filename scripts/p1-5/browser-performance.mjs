import { build } from "esbuild";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
const out = "/workspace/deliverables/bnt-p1-5/evidence", ref = "/tmp/bnt-p15-reference";
const bundle = await build({ stdin: { contents: `import '${ref}/src/prototype/app.js';import {restoreRace} from '${ref}/src/sim/foundation/checkpoint.js';window.__restore=x=>{P1.session.state=restoreRace(x);P1.draw();};`, resolveDir: process.cwd() }, bundle: true, format: "iife", platform: "browser", target: "es2020", write: false });
const old = (await readFile(ref + "/src/prototype/index.html", "utf8")).replace("<!-- BUNDLE -->", "<script>" + bundle.outputFiles[0].text.replaceAll("<\/script", "<\\/script") + "<\/script>"), now = await readFile("dist/Blood-and-Thunder-P1.5-Playable.html", "utf8");
const server = createServer((req, res) => res.end(req.url === "/reference" ? old : now));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
const result = { browser: browser.version(), windowMs: 1600, repeats: 1, notes: "Sequential single-observation windows. Same ordinary native checkpoint per phase. Restore and worker initial fill excluded; latency recorded separately. No concurrent verification jobs.", rows: [], errors: [] };
try {
  const fixtures = JSON.parse(await readFile(out + "/fixtures/index.json"));
  for (const mode of ["reference", "worker", "sync"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1e3 } });
    page.on("pageerror", (e) => result.errors.push({ mode, message: e.message }));
    await page.goto("http://127.0.0.1:" + server.address().port + (mode === "reference" ? "/reference" : "/candidate"));
    await page.waitForFunction(() => window.P1?.session?.state);
    for (const f of fixtures) for (const speed of [1, 2, 4]) {
      const checkpoint = JSON.parse(await readFile(out + "/fixtures/" + f.file));
      const setupMs = await page.evaluate(async ({ options, checkpoint: checkpoint2, mode: mode2 }) => {
        const t = performance.now();
        if (mode2 === "reference") {
          P1.prepare(options);
          __restore(checkpoint2);
        } else await P1.prepare({ ...options, checkpoint: checkpoint2, mode: mode2 });
        return performance.now() - t;
      }, { ...f, checkpoint, mode });
      if (mode === "worker") {
        await page.evaluate(() => {
          P1.session.send("credit", { view: P1.session.view() });
          P1.session.workerPaused = false;
          P1.session.send("run");
        });
        await page.waitForFunction(() => P1.session.lead >= 0.75);
      }
      await page.selectOption("#speed", String(speed));
      await page.evaluate(() => {
        for (const x of Object.values(P1.measurements)) if (Array.isArray(x)) x.length = 0;
        window.__start = performance.now();
        window.__tick = P1.session.state.tick;
        window.__lead = [];
        window.__heap = 0;
        const collect = () => {
          __lead.push(P1.session.lead ?? P1.playbackDebt);
          __heap = Math.max(__heap, performance.memory?.usedJSHeapSize ?? 0);
          window.__raf = requestAnimationFrame(collect);
        };
        __raf = requestAnimationFrame(collect);
      });
      await page.click("#start");
      await page.waitForTimeout(1600);
      await page.click("#pause");
      if (mode === "worker") await page.waitForFunction(() => P1.session.workerPaused);
      const sample = await page.evaluate(() => {
        cancelAnimationFrame(__raf);
        const stats = (xs) => {
          const a = [...xs].sort((a2, b) => a2 - b), q = (p) => a[Math.min(a.length - 1, Math.floor(a.length * p))] ?? null;
          return { n: a.length, median: q(0.5), p95: q(0.95), p99: q(0.99), max: a.at(-1) ?? null, over33: a.filter((x) => x > 33.3).length, over50: a.filter((x) => x > 50).length, over100: a.filter((x) => x > 100).length, over200: a.filter((x) => x > 200).length };
        };
        return { startTick: __tick, endTick: P1.session.state.tick, wallMs: performance.now() - __start, frames: stats(P1.measurements.frameIntervals), frameSamples: P1.measurements.frameIntervals, advance: stats(P1.measurements.advanceMs), draw: stats(P1.measurements.mainDrawMs), map: stats(P1.measurements.mapDrawMs), dom: stats(P1.measurements.domMs), effects: stats(P1.measurements.effectMs), longTasks: P1.measurements.longTasks.filter((x) => x.start >= __start), lead: stats(__lead), telemetry: P1.session.telemetry ?? null, maxHeap: __heap, error: P1.session.error ?? null };
      });
      result.rows.push({ mode, course: f.options.course, format: f.options.format, fieldSize: f.options.fieldSize, phase: f.phase, speed, setupMs, ...sample });
      console.log(mode, f.file, speed, sample.frames.p99, sample.error);
      await writeFile(out + "/performance-windows.json", JSON.stringify(result, null, 2));
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
if (result.errors.length || result.rows.some((x) => x.error)) process.exitCode = 1;
