import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
const out = "/workspace/deliverables/bnt-p2-1/evidence", fixtureRoot = "/workspace/deliverables/bnt-p1-5/evidence";
const old = await readFile("dist/Blood-and-Thunder-P2-Playable.html", "utf8"), now=await readFile("dist/Blood-and-Thunder-P2.1-Playable.html","utf8");
const server = createServer((req, res) => res.end(req.url === "/reference" ? old : now));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
const nativeOnly=process.env.BNT_P2_WORKER_SAMPLE==="1",reportName=nativeOnly?"worker-timing-windows.json":"performance-windows.json";
const result = { browser: browser.version(), windowMs: 1600, repeats: 1, notes: "Bounded P2.1 regression only: accepted P2 vs P2.1, C01 and Long Rally Combat8, three phases,4x;12 sequential1.6s windows. Same checkpoints, no concurrent verification jobs; not a new optimization campaign.", rows: [], errors: [] };
try {
  const fixtures = JSON.parse(await readFile(fixtureRoot + "/fixtures/index.json"));
  for (const mode of ["reference","candidate"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1e3 } });
    page.on("pageerror", (e) => result.errors.push({ mode, message: e.message }));
    await page.goto("http://127.0.0.1:" + server.address().port + (mode === "reference" ? "/reference" : "/candidate"));
    await page.waitForFunction(() => window.P1?.session?.state);
    if(mode==="candidate")await page.evaluate(()=>P2.assets.ready);
    for (const f of fixtures.filter(f=>f.options.fieldSize===8&&f.options.format==="Combat"&&["C01","rally-long"].includes(f.options.course))) for (const speed of [4]) {
      const checkpoint = JSON.parse(await readFile(fixtureRoot + "/fixtures/" + f.file));
      const setupMs = await page.evaluate(async ({ options, checkpoint: checkpoint2, mode: mode2 }) => {
        const t = performance.now();
        await P1.prepare({ ...options, checkpoint: checkpoint2, mode: "worker" });
        return performance.now() - t;
      }, { ...f, checkpoint, mode });
      if(nativeOnly)await page.evaluate(()=>{globalThis.__workerSamples=[];const s=P1.session,receive=s.receive.bind(s);s.receive=m=>{if(m.type==="frame"&&m.worker)__workerSamples.push({...m.worker});receive(m);};});
      if (true) {
        await page.evaluate(() => {
          P1.session.send("credit", { view: P1.session.view() });
          P1.session.workerPaused = false;
          P1.session.send("run");
        });
        await page.waitForFunction(() => P1.session.lead >= 0.75);
      }
      await page.selectOption("#speed", String(speed));
      await page.evaluate(() => {
        scrollTo(0,0);if(globalThis.__workerSamples)__workerSamples.length=0;
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
      await page.evaluate(()=>document.getElementById("start").click());
      await page.waitForTimeout(1600);
      await page.evaluate(()=>document.getElementById("pause").click());
      if (true) await page.waitForFunction(() => P1.session.workerPaused);
      const sample = await page.evaluate(() => {
        cancelAnimationFrame(__raf);
        const stats = (xs) => {
          const a = [...xs].sort((a2, b) => a2 - b), q = (p) => a[Math.min(a.length - 1, Math.floor(a.length * p))] ?? null;
          return { n: a.length, median: q(0.5), p95: q(0.95), p99: q(0.99), max: a.at(-1) ?? null, over33: a.filter((x) => x > 33.3).length, over50: a.filter((x) => x > 50).length, over100: a.filter((x) => x > 100).length, over200: a.filter((x) => x > 200).length };
        };
        return { startTick: __tick, endTick: P1.session.state.tick, wallMs: performance.now() - __start, frames: stats(P1.measurements.frameIntervals), frameSamples: P1.measurements.frameIntervals, advance: stats(P1.measurements.advanceMs), draw: stats(P1.measurements.mainDrawMs), map: stats(P1.measurements.mapDrawMs), dom: stats(P1.measurements.domMs), effects: stats(P1.measurements.effectMs), longTasks: P1.measurements.longTasks.filter((x) => x.start >= __start), lead: stats(__lead), telemetry: P1.session.telemetry ?? null, maxHeap: __heap, workerSamples:globalThis.__workerSamples??null,presentation:globalThis.P2?.inspect()??null, error: P1.session.error ?? null };
      });
      if(mode==="candidate"&&speed===4&&f.phase==="late")await page.screenshot({path:out+"/late-"+f.options.course+"-"+f.options.format+".png",fullPage:true});
      result.rows.push({ mode, course: f.options.course, format: f.options.format, fieldSize: f.options.fieldSize, phase: f.phase, speed, setupMs, ...sample });
      console.log(mode, f.file, speed, sample.frames.p99, sample.error);
      await writeFile(out + "/" + reportName, JSON.stringify(result, null, 2));
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
if (result.errors.length || result.rows.some((x) => x.error)) process.exitCode = 1;
