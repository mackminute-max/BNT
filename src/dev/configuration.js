import { createRace } from "../sim/race.js";
import { VERSION } from "../config/config.js";
import { editRU, supportsPath } from "./overrides.js";
const fields = new Set([
  "seed",
  "overrides",
  "entrants",
  "format",
  "driverMode",
  "weather",
  "autonomous",
  "playerId",
  "surfaces",
  "consequences",
  "consequence",
  "scheduledIncidents",
  "checkpointInterval",
  "environmentOverrides",
]);
export function configuration(setup) {
  if (
    !setup ||
    typeof setup !== "object" ||
    Array.isArray(setup) ||
    Object.keys(setup).some((k) => !fields.has(k))
  )
    throw new Error("Invalid setup fields");
  const s = createRace(setup);
  return {
    kind: "BNT-configuration",
    schema: 1,
    version: VERSION,
    setup: structuredClone(s.setup),
  };
}
export function parseConfiguration(text) {
  const doc = JSON.parse(text);
  if (
    doc.kind !== "BNT-configuration" ||
    doc.schema !== 1 ||
    doc.version !== VERSION
  )
    throw new Error("Unsupported configuration version");
  return configuration(doc.setup);
}
export function editConfiguration(doc, { id, path, value }) {
  const next = structuredClone(doc);
  let count = 0;
  for (const e of next.setup.entrants)
    if (
      (id === "all" || e.ru.id === id) &&
      (id !== "all" || supportsPath(e.ru, path))
    ) {
      e.ru = editRU(e.ru, path, value).ru;
      count++;
    }
  if (!count) throw new Error("No eligible components");
  return configuration(next.setup);
}
export function saveConfiguration(storage, doc) {
  const valid = configuration(doc.setup);
  try {
    storage.setItem("bnt.configuration.v1", JSON.stringify(valid));
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      message: `Storage unavailable: ${e.message}. Use export instead.`,
    };
  }
}
export function loadConfiguration(storage) {
  let text;
  try {
    text = storage.getItem("bnt.configuration.v1");
  } catch (e) {
    throw new Error(`Storage unavailable: ${e.message}`);
  }
  if (!text) throw new Error("No saved configuration");
  return parseConfiguration(text);
}
