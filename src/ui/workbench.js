import {
  configuration,
  parseConfiguration,
  editConfiguration,
  saveConfiguration,
  loadConfiguration,
} from "../dev/configuration.js";
import { queueOverride } from "../dev/overrides.js";
import {
  startReplay,
  advanceReplay,
  verifyReplayAsync,
} from "../replay/replay.js";
import { batch, parseSeeds } from "../dev/batch.js";
import { createRace, step, capture } from "../sim/race.js";
import { defaults, tuningDefaults, rules } from "../config/config.js";
import { m2Defaults, weatherPresets } from "../sim/environment.js";
import { consequenceDefaults } from "../sim/consequences.js";
import { utilityDefaults } from "../ai/weights.js";
const $ = (id) => document.getElementById(id);
export function downloadJSON(value, name) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function mountWorkbench({
  getState,
  setState,
  isPlaying,
  pause,
  render,
}) {
  let replay = null,
    batchAbort = null,
    batchResult = null;
  const message = (text) => {
    $("developerStatus").textContent = text;
  };
  const act = (fn) => async () => {
    try {
      await fn();
    } catch (e) {
      message(e.details ? JSON.stringify(e.details, null, 2) : e.message);
    }
    render();
  };
  function setEditor(setup) {
    $("setupJSON").value = JSON.stringify(configuration(setup), null, 2);
    refreshComponents();
    refreshParameter();
  }
  function apply(doc) {
    replay = null;
    $("replayStatus").textContent = "Live race";
    setState(createRace(doc.setup));
    setEditor(doc.setup);
    message("Configuration applied to a new race.");
  }
  function selectedRU() {
    return (
      getState().entrants.find((r) => r.id === $("componentScope").value) ??
      getState().entrants[0]
    );
  }
  function refreshComponents() {
    const selection = $("componentScope").value;
    $("componentScope").replaceChildren();
    for (const [value, label] of [
      ["all", `All ${getState().entrants.length} RUs`],
      ...getState().entrants.map((r) => [r.id, r.id]),
    ]) {
      const o = new Option(label, value);
      $("componentScope").append(o);
    }
    if ([...$("componentScope").options].some((o) => o.value === selection))
      $("componentScope").value = selection;
    refreshObjects();
  }
  function refreshObjects() {
    const ru = selectedRU(),
      previous = $("componentObject").value;
    $("componentObject").replaceChildren();
    for (const value of [
      "driver",
      "driver.personality",
      "chariot",
      "equipment",
      "beasts.*",
      ...ru.ru.beasts.map((_, i) => `beasts.${i}`),
    ])
      $("componentObject").append(new Option(value, value));
    if ([...$("componentObject").options].some((o) => o.value === previous))
      $("componentObject").value = previous;
    refreshFields();
  }
  function refreshFields() {
    const ru = selectedRU().ru,
      path = $("componentObject").value.replace("*", "0"),
      obj = path.split(".").reduce((n, k) => n[k], ru);
    $("componentField").replaceChildren();
    for (const [key, v] of Object.entries(obj))
      if (typeof v === "number")
        $("componentField").append(new Option(key, key));
    refreshValue();
  }
  function refreshValue() {
    const path =
      $("componentObject").value.replace("*", "0") +
      "." +
      $("componentField").value;
    $("componentValue").value = path
      .split(".")
      .reduce((n, k) => n[k], selectedRU().ru);
    $("componentSummary").textContent =
      `Scope: ${$("componentScope").value}; ${$("componentObject").value}.${$("componentField").value}. Wildcard beasts.* edits every team member.`;
  }
  const parameterGroups = {
    config: { target: "config", source: () => getState().config, defaults },
    model: {
      target: "config",
      prefix: "tuning.",
      source: () => getState().config.tuning,
      defaults: tuningDefaults,
    },
    autonomous: {
      target: "autonomous",
      source: () => getState().autonomous,
      defaults: m2Defaults,
    },
    utility: {
      target: "autonomous",
      prefix: "utility.",
      source: () => getState().autonomous.utility,
      defaults: utilityDefaults,
    },
    environment: {
      target: "environment",
      source: () => getState().environment,
      defaults: () => weatherPresets[getState().weather],
    },
    consequence: {
      target: "consequence",
      source: () => getState().consequence,
      defaults: consequenceDefaults,
    },
  };
  function refreshParameter() {
    const g = parameterGroups[$("parameterGroup").value],
      previous = $("parameterField").value;
    $("parameterField").replaceChildren();
    for (const [key, v] of Object.entries(g.source()))
      if (typeof v === "number")
        $("parameterField").append(new Option(key, key));
    if ([...$("parameterField").options].some((o) => o.value === previous))
      $("parameterField").value = previous;
    refreshParameterValue();
  }
  function refreshParameterValue() {
    const g = parameterGroups[$("parameterGroup").value],
      key = $("parameterField").value;
    $("parameterValue").value = g.source()[key];
    const bounds = rules[key];
    $("parameterSummary").textContent =
      `Default ${(typeof g.defaults === "function" ? g.defaults() : g.defaults)[key]}; ${bounds ? `${bounds[0]}..${bounds[1]} ${bounds[2]}` : $("parameterGroup").value === "model" ? "0..2; normalized weight groups must sum to 1" : "See validated ranges in the configuration documentation"}. Structural settings require a new race.`;
  }
  $("applySetup").onclick = act(() =>
    apply(parseConfiguration($("setupJSON").value)),
  );
  $("resetSetup").onclick = act(() => apply(configuration({})));
  $("captureSetup").onclick = act(() => {
    const s = getState(),
      setup = structuredClone(s.setup);
    setup.overrides = s.config;
    setup.autonomous = s.autonomous;
    setup.consequence = s.consequence;
    setup.environmentOverrides = s.environment;
    for (const e of setup.entrants)
      e.ru = structuredClone(s.entrants.find((r) => r.id === e.ru.id).ru);
    setEditor(setup);
    message(
      "Copied current component conditions and tuning into the configuration editor; apply to start a new race.",
    );
  });
  $("saveSetup").onclick = act(() => {
    const doc = parseConfiguration($("setupJSON").value);
    let storage;
    try {
      storage = window.localStorage;
    } catch {}
    const result = saveConfiguration(storage, doc);
    message(result.ok ? "Configuration saved locally." : result.message);
  });
  $("loadSetup").onclick = act(() =>
    apply(loadConfiguration(window.localStorage)),
  );
  $("exportSetup").onclick = act(() =>
    downloadJSON(
      parseConfiguration($("setupJSON").value),
      "BNT-configuration.json",
    ),
  );
  $("setupFile").onchange = act(async () => {
    const file = $("setupFile").files[0];
    if (file) apply(parseConfiguration(await file.text()));
  });
  $("componentScope").onchange = refreshObjects;
  $("componentObject").onchange = refreshFields;
  $("componentField").onchange = refreshValue;
  $("applyComponent").onclick = act(() => {
    const edit = {
      id: $("componentScope").value,
      path: $("componentObject").value + "." + $("componentField").value,
      value: Number($("componentValue").value),
    };
    if ($("componentMode").value === "live") {
      if (replay) throw new Error("Replay is read-only");
      queueOverride(
        getState(),
        { target: "ru", ...edit },
        { paused: !isPlaying() },
      );
      message(
        `Component edit queued for tick ${getState().tick}. Step or Resume to apply.`,
      );
    } else
      apply(editConfiguration(parseConfiguration($("setupJSON").value), edit));
  });
  $("parameterGroup").onchange = refreshParameter;
  $("parameterField").onchange = refreshParameterValue;
  $("applyParameter").onclick = act(() => {
    const g = parameterGroups[$("parameterGroup").value],
      path = (g.prefix ?? "") + $("parameterField").value,
      value = Number($("parameterValue").value);
    if ($("parameterMode").value === "live") {
      if (replay) throw new Error("Replay is read-only");
      queueOverride(
        getState(),
        { target: g.target, path, value },
        { paused: !isPlaying() },
      );
      message(
        `Parameter edit queued for tick ${getState().tick}. Step or Resume to apply.`,
      );
    } else {
      const doc = parseConfiguration($("setupJSON").value),
        field =
          g.target === "config"
            ? "overrides"
            : g.target === "environment"
              ? "environmentOverrides"
              : g.target;
      doc.setup[field] ??= {};
      let obj = doc.setup[field];
      const keys = path.split(".");
      for (const k of keys.slice(0, -1)) obj = obj[k];
      obj[keys.at(-1)] = value;
      apply(configuration(doc.setup));
    }
  });
  $("applySurface").onclick = act(() => {
    const doc = parseConfiguration($("setupJSON").value);
    doc.setup.surfaces[$("surfaceSegment").value] ??= {};
    doc.setup.surfaces[$("surfaceSegment").value][$("surfaceField").value] =
      Number($("surfaceValue").value);
    apply(configuration(doc.setup));
  });
  $("replayFile").onchange = act(async () => {
    const file = $("replayFile").files[0];
    if (!file) return;
    pause();
    $("replayStatus").textContent = "Verifying events and checkpoints…";
    const record = JSON.parse(await file.text());
    const verified = await verifyReplayAsync(record);
    replay = startReplay(record);
    setState(replay.state);
    setEditor(record.setup);
    $("replayStatus").textContent =
      `Verified ${verified.events} events and ${verified.checkpoints} checkpoints. Press Start or Step to reconstruct playback.`;
    message(
      "Verified deterministic replay. Developer edits and sign input are disabled during playback.",
    );
  });
  $("restartReplay").onclick = act(() => {
    if (!replay) throw new Error("Import a replay first");
    pause();
    replay = startReplay(replay.record);
    setState(replay.state);
    $("replayStatus").textContent = "Replay reset to initial setup.";
  });
  $("verifyReplay").onclick = act(async () => {
    pause();
    const verified = await verifyReplayAsync(capture(getState()));
    $("replayStatus").textContent =
      `Verified ${verified.events} events, ${verified.checkpoints} checkpoints, checksum ${verified.checksum}.`;
  });
  $("batchRun").onclick = act(async () => {
    if (batchAbort) throw new Error("A batch is already running");
    const setup = parseConfiguration($("setupJSON").value).setup,
      seeds = parseSeeds($("batchSeeds").value);
    batchAbort = new AbortController();
    try {
      batchResult = await batch(setup, seeds, {
        signal: batchAbort.signal,
        onProgress: (n, total) => {
          $("batchStatus").textContent = `Completed ${n}/${total}`;
        },
      });
      $("batchStatus").textContent =
        `${batchResult.cancelled ? "Cancelled; " : "Finished; "}${batchResult.completed} completed races`;
      $("batchOutput").textContent = JSON.stringify(
        {
          completed: batchResult.completed,
          cancelled: batchResult.cancelled,
          winners: batchResult.winners,
          means: batchResult.means,
          signCompliance: batchResult.signCompliance,
        },
        null,
        2,
      );
    } finally {
      batchAbort = null;
    }
  });
  $("batchCancel").onclick = () => batchAbort?.abort();
  $("batchExport").onclick = act(() => {
    if (!batchResult) throw new Error("Run a batch first");
    downloadJSON(batchResult, "BNT-batch.json");
  });
  setEditor(getState().setup);
  return {
    advance() {
      if (replay) {
        advanceReplay(replay);
        if (replay.done) {
          pause();
          $("replayStatus").textContent =
            `Replay verified through tick ${replay.state.tick}, including final checksum.`;
        }
        return replay.state;
      }
      return step(getState());
    },
    isReplay: () => !!replay,
    isDone: () => replay?.done ?? false,
    clearReplay() {
      replay = null;
      $("replayStatus").textContent = "Live race";
    },
    refreshSetup: setEditor,
    render() {
      const s = getState();
      $("overrideStatus").textContent =
        `Configuration revision ${s.configRevision}; ${s.pendingOverrides.length} pending overrides. Last change: ${JSON.stringify(s.events.filter((e) => e.type === "OVERRIDE_APPLIED").at(-1)?.effects ?? "none")}`;
      for (const id of ["queueSign", "cancelSign", "lowerSign"])
        $(id).disabled =
          !!replay ||
          !["Ready", "Running"].includes(s.status) ||
          s.entrants.find((r) => r.id === s.playerId).status !== "Racing";
    },
  };
}
