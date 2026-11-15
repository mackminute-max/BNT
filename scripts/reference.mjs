import {
  createRace,
  run,
  capture,
  digest,
  issueSign,
} from "../src/sim/race.js";
import { batch } from "../src/dev/batch.js";
import { verifyReplay } from "../src/replay/replay.js";
import { results } from "../src/reporting/results.js";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const reportTag = process.env.BNT_REPORT_TAG || "milestone-4";
const html = await readFile("dist/Blood_and_Thunder.html");
const report = {
  version: createRace().version,
  artifactBytes: html.length,
  artifactSHA256: createHash("sha256").update(html).digest("hex"),
  references: [],
  batches: [],
};
for (const format of ["Pure", "Combat"]) {
  const s = run(createRace({ format })),
    record = capture(s),
    verified = verifyReplay(record);
  report.references.push({
    format,
    seed: s.seed,
    ticks: s.tick,
    time: s.time,
    status: s.status,
    events: s.events.length,
    checkpoints: s.checkpoints.length,
    checksum: digest(s),
    verifiedChecksum: verified.checksum,
    ...results(s),
  });
  const sample = await batch(s.setup, [1, 2, 3, 4, 5, 6, 7, 8], {
    yieldControl: async () => {},
  });
  report.batches.push({ format, ...sample });
  console.log(
    JSON.stringify({
      format,
      checksum: digest(s),
      sampleCount: sample.completed,
      winners: sample.winners,
      means: sample.means,
      errors: sample.races
        .filter((r) => r.status === "Error")
        .map((r) => r.seed),
      stalled: sample.races
        .filter((r) => r.status === "Stalled")
        .map((r) => r.seed),
    }),
  );
}
const signs = createRace({ format: "Combat" });
issueSign(signs, "queue", "Engage Rivals");
run(signs);
report.combatSignChecksum = digest(signs);
await mkdir("reports", { recursive: true });
await writeFile(
  `reports/${reportTag}-reference.json`,
  JSON.stringify(report, null, 2),
);
await writeFile(
  `reports/${reportTag === "milestone-4" ? "seed-145" : reportTag + "-seed-145"}-replay.json`,
  JSON.stringify(capture(run(createRace())), null, 2),
);
if (report.batches.some((b) => b.races.some((r) => r.status === "Error")))
  process.exitCode = 1;
