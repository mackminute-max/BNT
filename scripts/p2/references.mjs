import { readFile, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import assert from "node:assert/strict";
import { verifyReplay } from "../../src/replay/replay.js";
import { createRace, run, digest, capture } from "../../src/sim/race.js";
const roots = ["docs/m2-c/evidence/implementation/", "docs/m2-d/evidence/implementation/"], historical = JSON.parse(await readFile(roots[0] + "parity.json")), payroll = JSON.parse(await readFile(roots[1] + "verification.json")), rows = [];
for (const x of historical.references) {
  const record = JSON.parse(gunzipSync(await readFile(roots[0] + x.replayFile))), actual = verifyReplay(record).checksum;
  assert.equal(actual, x.currentChecksum);
  rows.push({ kind: "historical", file: x.replayFile, expected: x.currentChecksum, actual });
}
for (const x of payroll.payrollReplays) {
  const record = JSON.parse(gunzipSync(await readFile(roots[1] + x.file))), actual = verifyReplay(record).checksum;
  assert.equal(actual, x.checksum);
  rows.push({ kind: "payroll", file: x.file, expected: x.checksum, actual });
}
await writeFile("/workspace/deliverables/bnt-p2/evidence/references.json", JSON.stringify({ rows }, null, 2));
console.log("Matched", rows.length, "historical/payroll references");
