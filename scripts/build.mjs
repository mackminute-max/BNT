import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const worker = await build({entryPoints:["src/persistence/e4/worker-entry.js"],bundle:true,format:"iife",platform:"browser",target:"es2020",write:false,legalComments:"none"});
const result = await build({
  define: {BNT_E4_WORKER_SOURCE: JSON.stringify(worker.outputFiles[0].text)},
  entryPoints: ["src/ui/app.js"],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  write: false,
  legalComments: "none",
});
const js = result.outputFiles[0].text.replaceAll("</script", "<\\/script");
const template = await readFile("src/ui/index.html", "utf8");
const html = template.replace("<!-- BUNDLE -->", `<script>${js}</script>`);
if (
  /<(?:script|link|img|iframe)\b[^>]*(?:src|href)\s*=\s*["'](?!data:|#)/i.test(
    html,
  ) ||
  /\b(?:import\s*\(|fetch\s*\(|new\s+WebSocket\s*\()/m.test(js)
)
  throw new Error("External runtime dependency found");
await mkdir("dist", { recursive: true });
await writeFile("dist/Blood_and_Thunder.html", html);
await writeFile("dist/Blood-and-Thunder-Track-Test.html", html);
console.log(
  `Built dist/Blood_and_Thunder.html (${Buffer.byteLength(html)} bytes)`,
);
