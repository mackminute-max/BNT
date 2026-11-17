import { rescheduleIncidents } from "../sim/incidents.js";
import { config } from "../config/config.js";
import { m2Config, environmentConfig } from "../sim/environment.js";
import { consequenceConfig } from "../sim/consequences.js";
import { derive, validateRU } from "../model/ru.js";
import { tendencies } from "../ai/driver.js";
import { location } from "../track/oval.js";
import { emit } from "../events/events.js";
export const structural = new Set([
  "schema",
  "dt",
  "epsilon",
  "positionEpsilon",
  "maxSubevents",
  "laps",
  "lanes",
  "straightLength",
  "innerRadius",
  "laneWidth",
  "straightTiles",
  "turnTiles",
  "gridGap",
  "gridOffset",
  "exitTiles",
]);
export function setNumeric(object, path, value) {
  if (!Number.isFinite(value)) throw new Error("Value must be finite");
  const keys = path.split(".");
  if (
    keys.some(
      (k) => !k || ["__proto__", "prototype", "constructor"].includes(k),
    )
  )
    throw new Error("Invalid parameter path");
  let node = object;
  for (const key of keys.slice(0, -1)) {
    if (!node || !Object.hasOwn(node, key))
      throw new Error(`Unknown path ${path}`);
    node = node[key];
  }
  const key = keys.at(-1);
  if (!node || !Object.hasOwn(node, key) || typeof node[key] !== "number")
    throw new Error(`Not a numeric parameter: ${path}`);
  const old = node[key];
  node[key] = value;
  return old;
}
function componentPaths(ru, path) {
  if (!path.includes("*")) return [path];
  if (!path.startsWith("beasts.*.") || path.slice(9).includes("."))
    throw new Error("Only beasts.*.<attribute> wildcard is supported");
  return ru.beasts.map((_, i) => path.replace("*", i));
}
export function supportsPath(ru, path) {
  try {
    return componentPaths(ru, path).every((p) => {
      let node = ru;
      for (const k of p.split(".")) {
        if (!node || !Object.hasOwn(node, k)) return false;
        node = node[k];
      }
      return typeof node === "number";
    });
  } catch {
    return false;
  }
}
export function editRU(ru, path, value) {
  const next = structuredClone(ru),
    changes = [];
  for (const p of componentPaths(next, path))
    changes.push({ path: p, old: setNumeric(next, p, value), value });
  validateRU(next);
  for (const k of tendencies)
    if (
      !Number.isFinite(next.driver.personality?.[k]) ||
      next.driver.personality[k] < 0 ||
      next.driver.personality[k] > 100
    )
      throw new Error(`Invalid personality ${k}`);
  return { ru: next, changes };
}
export function prepareOverride(s, edit) {
  if (
    !edit ||
    !["config", "autonomous", "consequence", "ru", "environment"].includes(
      edit.target,
    ) ||
    typeof edit.path !== "string" ||
    !Number.isFinite(edit.value)
  )
    throw new Error("Invalid override");
  if (edit.target === "ru") {
    const targets = s.entrants.filter(
      (r) =>
        (edit.id === "all" || r.id === edit.id) &&
        (edit.id !== "all" || supportsPath(r.ru, edit.path)),
    );
    if (!targets.length) throw new Error("No eligible RUs");
    return {
      target: "ru",
      updates: targets.map((r) => ({
        id: r.id,
        ...editRU(r.ru, edit.path, edit.value),
      })),
    };
  }
  if (edit.target === "config" && structural.has(edit.path.split(".")[0]))
    throw new Error("Structural edit requires a new race");
  if (edit.target === "autonomous" && edit.path === "signUses")
    throw new Error("Sign allowance requires a new race");
  const field = edit.target === "config" ? "config" : edit.target;
  const next = structuredClone(s[field]),
    old = setNumeric(next, edit.path, edit.value);
  const validated =
    edit.target === "config"
      ? config(next)
      : edit.target === "autonomous"
        ? m2Config(next)
        : edit.target === "environment"
          ? environmentConfig(s.weather, next)
          : consequenceConfig(next);
  return { target: field, value: validated, old };
}
export function queueOverride(s, edit, { paused = false } = {}) {
  if (!paused || s.resolving)
    throw new Error("Pause at a resolved tick boundary before editing");
  if (!["Ready", "Running"].includes(s.status))
    throw new Error("Create a new race before editing completed results");
  prepareOverride(s, edit);
  s.pendingOverrides.push(
    structuredClone({ ...edit, type: "override", id: edit.id ?? edit.target }),
  );
  return s.pendingOverrides.length;
}
export function applyOverride(s, edit) {
  const prepared = prepareOverride(s, edit);
  s.configRevision++;
  if (prepared.target === "ru")
    for (const u of prepared.updates) {
      const r = s.entrants.find((r) => r.id === u.id);
      r.ru = u.ru;
      emit(s, "OVERRIDE_APPLIED", [r.id], {
        target: "ru",
        changes: u.changes,
        configRevision: s.configRevision,
        version: s.version,
        order: s.commands.length - 1,
      });
    }
  else {
    s[prepared.target] = prepared.value;
    emit(s, "OVERRIDE_APPLIED", [], {
      target: edit.target,
      path: edit.path,
      old: prepared.old,
      value: edit.value,
      configRevision: s.configRevision,
      version: s.version,
      order: s.commands.length - 1,
    });
  }
  if (edit.target === "consequence" && edit.path === "incidentRate")
    rescheduleIncidents(s);
  if (edit.target === "consequence" && edit.path === "reactionBudget")
    for (const r of s.entrants)
      r.reactionsRemaining = s.consequence.reactionBudget;
  for (const r of s.entrants) {
    const surface = location(r.q, r.lane, s.config, s.track).surface;
    r.derived = derive(r.ru, {
      ...s.config,
      crowdMorale: s.environment.crowdMorale,
      grip: s.config.grip * s.environment.grip * surface.grip,
      speedReference:
        s.config.speedReference /
        (s.environment.rolling * surface.rollingResistance),
    });
    r.ai.nextDecision = s.tick;
  }
}
