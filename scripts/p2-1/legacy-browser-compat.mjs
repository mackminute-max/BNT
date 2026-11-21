import { readFile, writeFile, unlink, mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
const out = "/workspace/deliverables/bnt-p2-1/evidence", rows = [];
for (const [name, key] of [["p1", "BNT_P1_OUT"], ["p1-1", "BNT_P11_OUT"], ["p1-2", "BNT_P12_OUT"], ["p1-3", "BNT_P13_OUT"]]) {
  const source = await readFile("scripts/" + name + "/browser.mjs", "utf8"), runtime = source.replaceAll("'dist/Blood-and-Thunder-P1-Playable.html'", "'dist/Blood-and-Thunder-P2.1-Playable.html'").replace("const server=createServer", `const originalHTML=html;const adaptedHTML=Buffer.from(html.toString().replaceAll("<details", "<details open").replace('<script>','<script>document.getElementById("engine").value="sync";<\/script><script>').replace('</body>','<script>document.querySelectorAll("details").forEach(d=>d.open=true);for(const id of ["playerView","developerView"]){const view=document.getElementById(id);view.hidden=false;view.inert=false;}document.getElementById("engine").value="sync";const originalPrepare=P1.prepare;P1.prepare=x=>x===undefined?originalPrepare():originalPrepare({...x,mode:"sync"});P1.prepare();<\/script></body>'));const server=createServer`).replaceAll("res.end(html)", "res.end(adaptedHTML)");
  const path = "scripts/p2-1/.legacy-" + name + ".mjs";
  await writeFile(path, runtime);
  try {
    const result = spawnSync(process.execPath, [path], { env: { ...process.env, [key]: out + "/compat-" + name }, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
    await writeFile(out + "/legacy-" + name + ".log", result.stdout + result.stderr);
    rows.push({ name, exit: result.status, signal: result.signal });
    console.log(name, result.status);
  } finally {
    await unlink(path);
  }
}
await writeFile(out + "/legacy-browser-exits.json", JSON.stringify({ adaptation: "P2.1 HTML in explicitly synchronous mode; both internal views and details exposed only by this legacy compatibility harness, original assertions retained. Actual navigation is tested separately. Original assertions retained; P1.1 default zoom=6 is intentionally obsolete (P2 uses 8 CSS px/world). Worker UI verified separately.", rows }, null, 2));
if (rows.some((x) => x.exit !== 0)) process.exitCode = 1;
