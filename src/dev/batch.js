import { createRace, step, digest, classification } from "../sim/race.js";
import { statistics } from "../reporting/results.js";
export function parseSeeds(text) {
  if (typeof text !== "string") throw new Error("Invalid seed list");
  const result = [];
  for (const token of text
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)) {
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const a = Number(range[1]),
        b = Number(range[2]);
      if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || b < a || b - a > 999)
        throw new Error("Invalid seed range: use safe integers and at most 1000 seeds");
      const count = b - a + 1;
      if (result.length + count > 1000) throw new Error("Choose 1..1000 seeds");
      for (let offset = 0; offset < count; offset++) result.push(a + offset);
    } else {
      const seed = Number(token);
      if (!Number.isSafeInteger(seed)) throw new Error("Invalid seed");
      if (result.length === 1000) throw new Error("Choose 1..1000 seeds");
      result.push(seed);
    }
  }
  if (!result.length || result.length > 1000)
    throw new Error("Choose 1..1000 seeds");
  return result;
}
export async function batch(
  setup,
  seeds,
  {
    signal,
    onProgress = () => {},
    yieldControl = () => new Promise((r) => setTimeout(r, 0)),
  } = {},
) {
  const races = [];
  for (const seed of seeds) {
    const s = createRace({ ...setup, seed });
    while (!["Ended", "Stalled", "Error"].includes(s.status)) {
      for (
        let i = 0;
        i < 100 && !["Ended", "Stalled", "Error"].includes(s.status);
        i++
      )
        step(s);
      if (signal?.aborted) return summarize(races, true);
      await yieldControl();
    }
    races.push({
      seed,
      checksum: digest(s),
      ...statistics(s),
      winners: classification(s)
        .filter((r) => r.place === 1)
        .map((r) => r.id),
    });
    onProgress(races.length, seeds.length);
    await yieldControl();
  }
  return summarize(races, false);
}
export function summarize(races, cancelled) {
  const winners = Object.create(null),
    totals = {},
    counts = {};
  for (const r of races) {
    for (const winner of r.winners ?? (r.winner ? [r.winner] : []))
      winners[winner] = (winners[winner] ?? 0) + 1;
    for (const key of [
      "duration",
      "fatigueAtFinish",
      "finishes",
      "dnfs",
      "overtakes",
      "collisions",
      "attacks",
      "successfulAttacks",
      "successfulDefenses",
      "damage",
      "wrecks",
      "incidents",
      "signQueues",
    ])
      if (Number.isFinite(r[key])) {
        totals[key] = (totals[key] ?? 0) + r[key];
        counts[key] = (counts[key] ?? 0) + 1;
      }
  }
  return {
    completed: races.length,
    cancelled,
    winners,
    means: Object.fromEntries(
      Object.entries(totals).map(([k, v]) => [k, v / counts[k]]),
    ),
    races,
    signCompliance: races.reduce((counts, r) => {
      for (const [k, v] of Object.entries(r.signCompliance))
        counts[k] = (counts[k] ?? 0) + v;
      return counts;
    }, {}),
  };
}
