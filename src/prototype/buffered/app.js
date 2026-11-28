import { restoreRace } from "../../sim/foundation/checkpoint.js";
import { isJoust, JOUST_TIME } from "../../sim/joust.js";
import { BufferedSession } from "./client.js";
import { InteractionFeed, signFeedback } from "../interactions.js";
import { PlayableSession, playback } from "../session.js";
import { geometry, drawCourse, cameraTarget, drawInteractions } from "../view.js";
import { fatigueDisplay } from "../pacing.js";
import { point } from "../../track/oval.js";
import { courseDistance } from "../../track/course.js";
import { trackChoices } from "../../track/catalog.js";
import { weatherPresets } from "../../sim/environment.js";
import { signs } from "../../ai/signs.js";
import { coachingProfile, coachingAxes } from "../../ai/coaching.js";
import { RaceRadio as Commentary } from "../../reporting/radio.js";
import { classification } from "../../sim/race.js";
const $ = (id) => document.getElementById(id), options = [];
for (const kind of ["Oval", "Circuit", "Rally"]) {
  const group = document.createElement("optgroup");
  group.label = kind;
  for (const [id, name] of trackChoices(kind)) {
    const option = document.createElement("option");
    option.value = id.startsWith("generated-") ? id.replace("generated-", "rally-") : id;
    option.textContent = name;
    group.append(option);
  }
  options.push(group);
}
$("course").replaceChildren(...options);
$("weather").replaceChildren(...Object.keys(weatherPresets).map((name) => new Option(name, name)));
$("sign").replaceChildren(...signs.map((name) => new Option(name, name)));
for (const axis of coachingAxes) {
  const label = document.createElement("label");
  label.textContent = axis;
  const select = document.createElement("select");
  select.id = "coach-" + axis;
  for (const value of [-1, -0.5, 0, 0.5, 1]) select.append(new Option(String(value), String(value)));
  select.value = "0";
  label.append(select);
  $("coachAxes").append(label);
}
let effects = new InteractionFeed(), effectFrame = null, lastEffectTick = -1, lastEffectPlaying = false;
const tableRows = /* @__PURE__ */ new Map();
function text(id, value) {
  const el = $(id);
  if (el.textContent !== value) el.textContent = value;
}
let session, g, radio, playing = false, debt = 0, last = null, lastRender = 0, terminal = null, camera = null, comparisonBusy = false, lastDomKey = null;
const measurements = { frames: 0, frameIntervals: [], advanceMs: [], cameraMs: [], effectMs: [], mainDrawMs: [], mapDrawMs: [], domMs: [], longTasks: [], inputMs: [], fullRaceWallMs: null };
let startedAt = null;
let frameAt = null;
try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      measurements.longTasks.push({ start: e.startTime, ms: e.duration });
      if (measurements.longTasks.length > 1e3) measurements.longTasks.shift();
    }
  }).observe({ type: "longtask", buffered: true });
} catch {
}
function record(key, value) {
  measurements[key].push(value);
  if (measurements[key].length > 2e3) measurements[key].shift();
}
function settings() {
  return { course: $("course").value, seed: Number($("seed").value), format: $("format").value, weather: $("weather").value, build: $("build").value, value: Number($("value").value), fieldSize: Number($("field").value), laps: Number($("laps").value), pacing: $("pacingPolicy").value, personality: $("personality").value, boons: document.getElementById("boons")?.value ?? "", rivalBoons: document.getElementById("rivalBoons")?.value ?? "", boonLevel: Number(document.getElementById("boonLevel")?.value ?? 1), ...$("customCoach").checked ? { coaching: coachingProfile(Object.fromEntries(coachingAxes.map((k) => [k, Number($("coach-" + k).value)]))) } : {} };
}
let pendingPreparation = null, preparing = 0;
async function prepare(config = settings()) {
  const serial = ++preparing;
  pendingPreparation?.shutdown();
  pendingPreparation = null;
  session?.shutdown?.();
  session = null;
  playing = false;
  for (const id of ["start", "pause", "step", "queue", "cancel", "lower", "drain", "compare"]) $(id).disabled = true;
  text("status", "Preparing authoritative race\u2026");
  let next;
  if ((config.mode ?? $("engine").value) === "sync") {
    next = new PlayableSession(config);
    next.mode = "sync";
    if (config.checkpoint) next.state = restoreRace(config.checkpoint);
  } else {
    try {
      next = new BufferedSession(config);
      pendingPreparation = next;
      await next.ready;
    } catch (error) {
      next?.shutdown();
      if (serial !== preparing) return;
      next = new PlayableSession(config);
      next.mode = "sync-fallback";
      if (config.checkpoint) next.state = restoreRace(config.checkpoint);
      next.fallbackReason = error.message;
    }
  }
  if (serial !== preparing) {
    next.shutdown?.();
    return;
  }
  pendingPreparation = null;
  const nextGeometry = geometry(next.state);
  playing = false;
  session = next;
  g = nextGeometry;
  radio = new Commentary({channel: radioChannelPref()});
  effects = new InteractionFeed();
  effectFrame = null;
  lastEffectTick = -1;
  lastEffectPlaying = false;
  tableRows.clear();
  $("standings").replaceChildren();
  debt = 0;
  last = null;
  terminal = null;
  camera = null;
  startedAt = null;
  lastDomKey = null;
  $("radio").replaceChildren();
  $("error").textContent = "";
  $("comparison").textContent = "";
  for (const key of ["frameIntervals", "advanceMs", "cameraMs", "effectMs", "mainDrawMs", "mapDrawMs", "domMs", "longTasks", "inputMs"]) measurements[key] = [];
  measurements.fullRaceWallMs = null;
  render();
}
function safe(fn) {
  return async () => {
    if (comparisonBusy) return;
    try {
      await fn();
    } catch (e) {
      playing = false;
      $("error").textContent = e.message;
    }
    render();
  };
}
function input(action) {
  const t = performance.now();
  if (!session.sign(action, action === "queue" ? $("sign").value : void 0)) $("error").textContent = "Sign rejected by native rules: check format, phase, player condition and remaining opportunities.";
  else $("error").textContent = "";
  record("inputMs", performance.now() - t);
}
function finish() {
  if (!terminal && ["Ended", "Stalled", "Error"].includes(session.state.status)) {
    playing = false;
    terminal = session.official();
    measurements.fullRaceWallMs = startedAt === null ? null : performance.now() - startedAt;
  }
}
function render() {
  if (!session?.state) return;
  finish();
  const s = session.state, drawState = session.renderState?.() ?? s, p = s.entrants.find((r) => r.id === s.playerId), now = performance.now();
  const batch = session.drainEvents?.();
  const cameraAt = performance.now();
  const actor = cameraTarget(drawState), target = point(actor.q, actor.lane, s.config, s.track);
  if (!camera) camera = { ...target, scale: Number($("zoom").value) };
  else {
    camera.x += (target.x - camera.x) * 0.35;
    camera.y += (target.y - camera.y) * 0.35;
    camera.scale = Number($("zoom").value);
  }
  record("cameraMs", performance.now() - cameraAt);
  const mainCamera = drawCourse($("race"), drawState, g, { camera });
  record("mainDrawMs", performance.now() - now);
  const mapAt = performance.now();
  drawCourse($("map"), drawState, g, { map: true });
  record("mapDrawMs", performance.now() - mapAt);
  const effectAt = performance.now(), effectNow = performance.now();
  if (batch) effects.consumeBatch(batch, { stepped: !playing && s.tick !== lastEffectTick });
  else effects.consume(s, { stepped: !playing && s.tick !== lastEffectTick });
  const activeEffects = effects.advance(effectFrame === null || !lastEffectPlaying ? 0 : Math.max(0, effectNow - effectFrame), { paused: !playing });
  effectFrame = effectNow;
  lastEffectPlaying = playing;
  lastEffectTick = s.tick;
  drawInteractions($("race"), drawState, activeEffects, mainCamera);
  text("signResponse", signFeedback(s, effects));
  text("interactionStatus", `${effects.total} native interactions \xB7 ${effects.pending.length} queued \xB7 ${effects.overflow} additional events summarized`);
  record("effectMs", performance.now() - effectAt);
  text("bufferStatus", session.mode === "worker" ? `Buffered Worker \xB7 ${session.phase} \xB7 ${session.phase === "countdown" ? Math.ceil(session.countdownLeft) + "\u2026 \xB7 " : ""}Lead ${session.lead.toFixed(2)} native s \xB7 ${session.frames.size} frames \xB7 ${session.telemetry.underruns} underruns \xB7 ${session.workerPaused ? "worker pause confirmed" : "worker running/pause pending"}${session.error ? " \xB7 " + session.error : ""}` : `Synchronous ${session.mode} \xB7 ${session.fallbackReason ?? "known digest hitches remain"}`);
  text("commandStatus", session.commands ? [...session.commands.values()].slice(-4).map((c) => `#${c.commandId} ${c.action}: ${c.status}${c.remaining !== void 0 ? " \xB7 authoritative uses " + c.remaining : ""}${c.reason ? " \xB7 " + c.reason : ""}${c.lastConflict ? " \xB7 conflicting retry rejected" : ""}${c.visibleFromTick > s.tick ? " \xB7 worker confirmed; presentation pending" : ""}`).join(" | ") : "Native synchronous command path");
  const domAt = performance.now(), domKey = [s.tick, playing, session.phase, session.workerPaused, session.commands?.size, p.signs.remaining, p.signs.active, p.signs.pending, comparisonBusy].join("|");
  if (lastDomKey === domKey && !batch?.length) return;
  lastDomKey = domKey;
  const open = s.track.course && !s.track.closed, progress = (r) => open ? Math.max(0, Math.min(100, courseDistance(r.q, s.track) / s.track.length * 100)).toFixed(1) + "%" : `lap ${Math.min(s.config.laps, r.completedLaps + 1)}/${s.config.laps}`;
  $("status").textContent = terminal ? terminal.cleared ? "Official native clearance established. No rewards or career changes." : "Blocked native result: " + terminal.reason : `${playing ? "Racing" : "Paused / Ready"} \xB7 ${s.status} \xB7 tick ${s.tick} \xB7 ${s.time.toFixed(2)}s \xB7 ${session.options.course}`;
  $("hud").textContent = `RU1: ${p.status} \xB7 ${progress(p)} \xB7 ${p.speed.toFixed(1)} native speed \xB7 Driver ${p.ru.driver.condition.toFixed(1)} / strain ${p.ru.driver.strain.toFixed(1)} \xB7 Chariot ${p.ru.chariot.condition.toFixed(1)} / wear ${p.ru.chariot.wear.toFixed(1)} \xB7 Beasts fatigue ${p.ru.beasts.map((b) => b.fatigue.toFixed(1)).join(" / ")}`;
  const endurance = fatigueDisplay(p.ru, session.previousFatigue);
  $("endurance").value = endurance.remaining;
  $("endurance").dataset.state = endurance.status.toLowerCase();
  $("enduranceLabel").textContent = `TEAM ENDURANCE ${endurance.remaining.toFixed(1)}% \xB7 ${endurance.status}`;
  $("enduranceTrend").textContent = `${endurance.trend === "increasing" ? "\u2191" : endurance.trend === "decreasing" ? "\u2193" : "\u2192"} Fatigue ${endurance.trend}${playing ? "" : " \xB7 paused / last native tick"}`;
  const exertion = s.autonomous["exertion" + p.pace] ?? 0, receipt = effects.lastExertionByActor.get(p.id), recent = receipt && s.time - receipt.time <= 2;
  const cost = recent ? ` \xB7 Recent additional cost: beasts +${receipt.effects.beastFatigue.map((x) => x.toFixed(2)).join("/")} fatigue, driver +${receipt.effects.driverStrain.toFixed(2)} strain` : "";
  text("exertionState", `Current exertion ${exertion.toFixed(2)} \xB7 ${endurance.trend === "decreasing" ? "Recovering" : endurance.trend === "increasing" ? "Expending endurance" : "Stable"}${cost}`);
  $("signState").textContent = `Active: ${p.signs.active ?? "none"} \xB7 Queued: ${p.signs.pending ?? "none"} \xB7 Uses remaining: ${p.signs.remaining}`;
  $("progress").textContent = open ? `Sign Points crossed: ${p.checkpointCursor}/${s.track.checkpoints.length} \xB7 Next: ${s.track.checkpoints[p.checkpointCursor]?.id ?? "finish"}` : isJoust(s) ? `${s.format} \xB7 Joust \xB7 ${Math.max(0, Math.ceil(JOUST_TIME - s.time))} s to the stewards\u2019 call` : `${s.format} \xB7 ${s.config.laps} laps \xB7 Player ${progress(p)}`;
  const official = terminal?.cleared ? terminal.classification : null, rows = official ?? [...s.entrants].sort((a, b) => (a.finishTime === null) - (b.finishTime === null) || (a.finishTime ?? 0) - (b.finishTime ?? 0) || b.q - a.q || a.id.localeCompare(b.id)).map((r, i) => ({ id: r.id, place: i + 1, status: r.status, time: r.finishTime }));
  const desired = [];
  for (const row of rows) {
    let tr = tableRows.get(row.id);
    if (!tr) {
      tr = document.createElement("tr");
      for (let i = 0; i < 3; i++) tr.append(document.createElement("td"));
      tableRows.set(row.id, tr);
    }
    tr.className = row.id === s.playerId ? "player" : "";
    const r = s.entrants.find((r2) => r2.id === row.id), values = [String(row.place ?? "\u2014"), row.id, row.status === "Finished" ? `${row.time.toFixed(3)}s` : row.status === "Racing" ? progress(r) : row.status];
    values.forEach((value, i) => {
      if (tr.children[i].textContent !== value) tr.children[i].textContent = value;
    });
    desired.push(tr);
  }
  desired.forEach((tr, i) => {
    if ($("standings").children[i] !== tr) $("standings").insertBefore(tr, $("standings").children[i] ?? null);
  });
  $("clearance").textContent = terminal ? terminal.cleared ? "Official placement uses native full precision and tie tolerance." : "Uncleared: no official result. Restart or inspect diagnostics." : "Live order is provisional.";
  const n = radio.lines.length;
  if (batch) radio.consumeBatch(batch);
  else radio.consume(s.events);
  const added = radio.lines.slice(n);
  for (const line of added) $("radio").append(radioLineNode(line));
  while ($("radio").children.length > 160) $("radio").firstChild.remove();
  radio.lines = radio.lines.slice(-200);
  if (added.length) $("radio").scrollTop = $("radio").scrollHeight;
  for (const option of $("sign").options) option.disabled = option.value === "Engage Rivals" && s.format === "Pure";
  if ($("sign").selectedOptions[0]?.disabled) $("sign").value = signs[0];
  const stopped = session.phase === "error" || ["Ended", "Stalled", "Error"].includes(s.status);
  $("drain").disabled = session.mode !== "worker" || session.phase !== "paused" || !session.workerPaused || session.lead < 1e-7 || !session.started;
  $("queue").disabled = comparisonBusy || stopped || p.signs.remaining === 0 || p.status !== "Racing";
  $("cancel").disabled = comparisonBusy || stopped || !p.signs.pending;
  $("lower").disabled = comparisonBusy || stopped || !p.signs.active;
  for (const id of ["start", "step"]) $(id).disabled = comparisonBusy || stopped;
  $("pause").disabled = comparisonBusy || !playing;
  $("compare").disabled = comparisonBusy || session.mode === "worker";
  if (session.mode === "worker") {
    $("step").disabled = !session.steppingReady;
    $("start").disabled = stopped || Boolean(session.pausePromise || session.stepResolve);
    $("compare").disabled = true;
  }
  if ($("diagnostics").parentElement.open) $("diagnostics").textContent = JSON.stringify({ prototype: "p1.5-playable-v1", individualBeastFatigue: endurance.individual, meanFatigue: endurance.fatigue, presetChanges: session.changes, coaching: session.setup.entrants[0].coachingContext ?? null, simulationVersion: s.version, seed: s.seed, tick: s.tick, events: s.eventCount ?? s.events.length, maxTickMs: session.maxTickMs, rollingTickSamples: session.timings.length, geometrySamples: g.samples, clearance: terminal?.cleared ?? false }, null, 2);
  record("domMs", performance.now() - domAt);
  measurements.frames++;
}
$("prepare").onclick = safe(() => prepare());
$("restart").onclick = safe(() => prepare(session.options));
$("start").onclick = safe(() => {
  session.start?.();
  playing = true;
  last = null;
  startedAt ??= performance.now();
});
$("pause").onclick = safe(async () => {
  playing = false;
  last = null;
  await session.pause?.();
});
$("step").onclick = safe(async () => {
  playing = false;
  startedAt ??= performance.now();
  if (session.mode === "worker") await session.step();
  else session.tick();
});
$("drain").onclick = safe(() => {
  session.tail();
  playing = true;
  last = null;
});
for (const [id, action] of [["queue", "queue"], ["cancel", "cancel"], ["lower", "lower"]]) $(id).onclick = safe(() => input(action));
function download(data, name) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
$("export").onclick = safe(() => download({ ...session.metrics(), setup: session.setup, changes: session.changes, performance: measurements }, "BNT-P1-race-metrics.json"));
async function compare() {
  if (comparisonBusy) return;
  if (session.mode === "worker") {
    text("comparison", "Controlled A/B is available in synchronous mode; the Worker race is unchanged.");
    return;
  }
  playing = false;
  comparisonBusy = true;
  for (const b of document.querySelectorAll("button,input,select")) b.disabled = true;
  const output = [];
  try {
    const config = settings();
    delete config.coaching;
    const rivals = [];
    for (const build of ["contact", "handling"]) {
      const test = new PlayableSession({ ...config, build });
      rivals.push(JSON.stringify(test.setup.entrants.slice(1)));
      while (!["Ended", "Stalled", "Error"].includes(test.state.status) && test.state.tick < 2e4) {
        const start = performance.now();
        do {
          test.tick();
        } while (!["Ended", "Stalled", "Error"].includes(test.state.status) && test.state.tick < 2e4 && performance.now() - start < 8);
        $("comparison").textContent = `Running ${build} \xB7 tick ${test.state.tick}. No Strategy Sign inputs; controls locked during comparison.`;
        await new Promise((r) => setTimeout(r, 0));
      }
      output.push(test.metrics());
    }
    if (rivals[0] !== rivals[1]) throw Error("Comparison rival configuration mismatch");
    window.P1.lastComparison = output;
    $("comparison").replaceChildren();
    for (const m of output) {
      const pre = document.createElement("pre");
      pre.textContent = JSON.stringify({ build: m.build, status: m.status, cleared: m.clearance.cleared, checksum: m.checksum, player: m.player }, null, 2);
      $("comparison").append(pre);
    }
  } catch (e) {
    $("error").textContent = e.message;
  } finally {
    comparisonBusy = false;
    for (const b of document.querySelectorAll("button,input,select")) b.disabled = false;
    lastDomKey = null;
    render();
  }
}
$("compare").onclick = compare;
$("diagnostics").parentElement.ontoggle = () => {
  lastDomKey = null;
  render();
};
function frame(now) {
  if (frameAt !== null) record("frameIntervals", now - frameAt);
  frameAt = now;
  try {
    if (playing && !comparisonBusy) {
      if (last !== null) {
        const advanceAt = performance.now();
        if (session.mode === "worker") {
          session.advancePresentation((now - last) / 1e3, Number($("speed").value));
          if (["paused", "finished", "error"].includes(session.phase)) playing = false;
        } else {
          const r = playback(session, debt, (now - last) / 1e3, Number($("speed").value));
          debt = r.accumulator;
        }
        record("advanceMs", performance.now() - advanceAt);
      }
      last = now;
      finish();
    }
    if ((playing || now - lastRender > 200) && !comparisonBusy) {
      render();
      lastRender = now;
    }
  } catch (e) {
    playing = false;
    $("error").textContent = e.message;
  }
  requestAnimationFrame(frame);
}
window.P1 = { version: "p1.5-playable-v1", get session() {
  return session;
}, get measurements() {
  return measurements;
}, get playbackDebt() {
  return debt;
}, get interactions() {
  return effects;
}, prepare, compare, classification, draw: render, lastComparison: null };
prepare();
requestAnimationFrame(frame);

// Radio channels (Phase 4c): WBNT (color and highlights) or play-by-play.
function radioLineNode(line) {
  const div = document.createElement("div");
  div.dataset.speaker = line.speaker ?? "";
  div.textContent = `${line.time.toFixed(2)} \xB7 ${line.text}`;
  return div;
}
function radioChannelPref() { try { return localStorage.getItem("bnt.radio.channel") || "wbnt"; } catch { return "wbnt"; } }
globalThis.__btRadioTune = channel => {
  try { localStorage.setItem("bnt.radio.channel", channel); } catch {}
  if (!radio) return;
  radio.tune(channel);
  $("radio").replaceChildren(...radio.lines.slice(-160).map(radioLineNode));
  $("radio").scrollTop = $("radio").scrollHeight;
};
globalThis.__btRadioChannel = () => radio?.channel ?? radioChannelPref();
