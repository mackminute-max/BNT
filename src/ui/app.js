import * as championships from '../career/championships/api.js';
import * as foundation from '../sim/foundation/api.js';
import { generateMarket, seedInteger, marketStream } from '../career/economy/market.js';
import { advanceFrames } from "./clock.js";
import { mountWorkbench, downloadJSON } from "./workbench.js";
import { Commentary, narrative } from "../reporting/commentary.js";
import { results } from "../reporting/results.js";
import { verifyReplay, startReplay, advanceReplay } from "../replay/replay.js";
import { queueOverride } from "../dev/overrides.js";
import { trackChoices, ovalPresets } from "../track/catalog.js";
import { generateRally } from "../track/rally-generator.js";
import { trackDiagnostics } from "../track/validation.js";
import { coursePresets, courseDistance } from "../track/course.js";
import { location } from "../track/oval.js";
import { weatherPresets, m2Defaults } from "../sim/environment.js";
import { signs } from "../ai/signs.js";
import {
  createRace,
  step,
  run,
  classification,
  capture,
  digest,
  issueSign,
} from "../sim/race.js";
import { point } from "../track/oval.js";
const $ = (id) => document.getElementById(id);
const colors = [
  "#ecbd6c",
  "#67bbd4",
  "#e68080",
  "#a8ca70",
  "#c699db",
  "#71cfb4",
  "#dd9d63",
  "#b4c3df",
];
const presetId = course => typeof course === "string" ? course : course?.generation ? "generated-" + course.generation.category : course?.id ?? "oval";
function populateTracks(course = null) {
  const kind = $("raceKind").value, choices = trackChoices(kind), id = presetId(course);
  if (course && !choices.some(([key]) => key === id)) choices.push([id, course.name ?? id]);
  $("trackPreset").replaceChildren(...choices.map(([id,name]) => new Option(name,id)));
  if (course) $("trackPreset").value = id;
  else if (kind === "Oval") $("trackPreset").value = "oval";
  else if (kind === "Rally") $("trackPreset").value = "generated-" + $("rallyCategory").value;
  $("lapCount").disabled = kind === "Rally";
  $("rallyControls").hidden = kind !== "Rally";
}
$("raceKind").onchange = () => populateTracks();
$("trackPreset").onchange = () => { if ($("trackPreset").value.startsWith("generated-")) $("rallyCategory").value = $("trackPreset").value.slice(10); };
$("rallyCategory").onchange = () => $("trackPreset").value = "generated-" + $("rallyCategory").value;
$("regenerateRally").onclick = () => reset(true);
populateTracks(); $("trackPreset").value = "oval";
let state = createRace(),
  playing = false,
  previous = null,
  accumulator = 0;
let workbench,
  devSetup = state.setup,
  radio = new Commentary(),
  completing = false,
  transportEpoch = 0;
const canvas = $("race"),
  ctx = canvas.getContext("2d");
function reset(forceGeneration = false) {
  try {
    const selected = $("trackPreset").value, previous = presetId(devSetup.course);
    let course = selected === "oval" ? null : selected === previous ? devSetup.course : selected;
    const overrides = { ...devSetup.overrides, laps: Number($("lapCount").value) };
    if (Object.hasOwn(ovalPresets, selected) && selected !== previous) Object.assign(overrides, ovalPresets[selected].overrides);
    if (selected.startsWith("generated-")) {
      const old = devSetup.course?.generation, category = selected.slice(10), terrainProfile = $("rallyTerrain").value;
      const options = { ...(old?.category === category ? old.options : {}), seed: Number($("rallySeed").value), category, terrainProfile,
        turnFrequency: Number($("rallyTurns").value), turnSeverity: Number($("rallyComplexity").value), laneWidth: overrides.laneWidth ?? 4 };
      if (old?.terrainProfile !== terrainProfile) delete options.terrainWeights;
      const same = old && ["seed","category","terrainProfile","turnFrequency","turnSeverity"].every(k => options[k] === old.options[k]);
      course = !forceGeneration && same ? devSetup.course : generateRally(options);
    }
    const next = createRace({
      ...devSetup,
      course,
      surfaces: selected === previous && !forceGeneration ? devSetup.surfaces : {},
      overrides,
      seed: Number($("seed").value),
      weather: $("weather").value,
      format: $("format").value,
      consequence: {
        ...devSetup.consequence,
        damageScale: Number($("damageScale").value),
        incidentRate: Number($("incidentRate").value),
      },
      autonomous: {
        ...devSetup.autonomous,
        ...Object.fromEntries(
          [...document.querySelectorAll("#tuners input")].map((input) => [
            input.dataset.key,
            Number(input.value),
          ]),
        ),
        signStrength: Number($("signStrength").value),
        fatigueRate: Number($("fatigueRate").value),
      },
    });
    replaceRace(next);
    workbench?.clearReplay();
    workbench?.refreshSetup(next.setup);
    $("error").textContent = "";
    render();
  } catch (e) {
    $("error").textContent = e.message;
  }
}
function draw() {
  const c = state.config,
    t = state.track,
    outer = c.innerRadius + (c.lanes - 0.5) * c.laneWidth;
  const scale = Math.min(
    850 / (c.straightLength + 2 * outer),
    360 / (2 * outer),
  );
  let framing = null;
  if (t.course) {
    const samples = [];
    for (let q = Math.min(-c.gridGap - 2, ...state.setup.entrants.map(r => r.q)); q <= t.cells + c.exitTiles + 1; q += .5)
      for (const lane of [-.5, c.lanes - .5]) samples.push(point(q, lane, c, t));
    const minX = Math.min(...samples.map(p => p.x)), maxX = Math.max(...samples.map(p => p.x));
    const minY = Math.min(...samples.map(p => p.y)), maxY = Math.max(...samples.map(p => p.y));
    framing = { x: (minX + maxX) / 2, y: (minY + maxY) / 2,
      scale: Math.min(900 / Math.max(1, maxX - minX), 390 / Math.max(1, maxY - minY)) };
  }
  const overview = framing;
  const follow = t.course && !t.closed && ($("cameraMode").value === "follow" ||
    ($("cameraMode").value === "auto" && t.length > 1600 && state.status !== "Ready"));
  if (follow) {
    const actor = state.entrants.find(r => r.id === $("inspect").value) ?? state.entrants.find(r => r.id === state.playerId);
    const p = point(actor.q, actor.lane, c, t);
    framing = {x:p.x,y:p.y,scale:1.8};
  }
  const xy = (q, lane) => {
    const p = point(q, lane, c, t);
    return framing ? [500 + (p.x - framing.x) * framing.scale, 265 + (p.y - framing.y) * framing.scale] :
      [500 + (p.x - c.straightLength / 2) * scale, 285 + p.y * scale];
  };
  const displayScale = framing?.scale ?? scale;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let lane = c.lanes - 1; lane >= 0; lane--) {
    if (t.course) {
      for (const segment of t.segments) {
        ctx.beginPath();
        const begin = segment.start - t.offset, end = begin + segment.tiles;
        for (let i = 0; i <= segment.tiles * 10; i++) {
          const p = xy(begin + i / 10, lane);
          if (!i) ctx.moveTo(...p); else ctx.lineTo(...p);
        }
        ctx.lineWidth = c.laneWidth * displayScale * .96;
        ctx.strokeStyle = { dirt: "#6b5942", stone: "#727b7e", gravel: "#827664", sand: "#ad9258", mud: "#55402e" }[segment.terrain];
        ctx.stroke();
      }
      if (!t.closed) for (const [start, end] of [[-c.gridGap - 2, 0], [t.cells, t.cells + c.exitTiles + 1]]) {
        ctx.beginPath();ctx.moveTo(...xy(start, lane));ctx.lineTo(...xy(end, lane));ctx.strokeStyle="#35444b";ctx.lineWidth=c.laneWidth*displayScale*.96;ctx.stroke();
      }
      continue;
    }
    ctx.beginPath();
    for (let q = 0; q <= t.cells; q += 0.1) {
      const [x, y] = xy(q, lane);
      if (q === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = lane % 2 ? "#35444b" : "#3d4c51";
    ctx.lineWidth = c.laneWidth * scale * 0.96;
    ctx.stroke();
  }
  for (let lane = -0.5; lane < c.lanes; lane++) {
    ctx.beginPath();
    for (let q = 0; q <= t.cells; q += 0.2) {
      const [x, y] = xy(q, lane);
      if (q === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    if (!t.course || t.closed) ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#91a3a066";
    ctx.stroke();
  }
  for (const [q, text, color] of [
    [0, t.course && !t.closed ? "START" : "START / FINISH", "#f3d69c"],
    [t.course && !t.closed ? t.cells : c.exitTiles, t.course && !t.closed ? "FINISH →" : "EXIT →", "#7cc5ae"],
    ...(t.course && !t.closed ? t.checkpoints.map(cp => [cp.q, cp.id, "#82cde0"]) : []),
  ]) {
    const a = xy(q, -0.5),
      b = xy(q, c.lanes - 0.5);
    ctx.beginPath();
    ctx.moveTo(...a);
    ctx.lineTo(...b);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "12px system-ui";
    ctx.fillText(text, a[0] - 35, t.course && q === 0 ? Math.min(a[1], b[1]) - 12 : b[1] - (q === 0 ? 15 : 35));
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "#a9b8bd";
  ctx.font = "16px Georgia";
  ctx.fillText(t.course ? t.name : "BLOOD AND THUNDER", 500, t.course ? 485 : 275);
  ctx.font = "12px system-ui";
  ctx.fillText(t.course ? `${t.raceType} · ${t.closed ? c.laps + " laps" : "point to point"}` : "AUTONOMOUS RACING · FOUR-LANE OVAL", 500, t.course ? 505 : 300);
  for (const [i, r] of [...state.entrants]
    .sort((a, b) => a.id.localeCompare(b.id))
    .entries()) {
    if (r.physical === "Exited") continue;
    const [x, y] = xy(r.q, r.lane);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = r.physical === "Wreck" ? "#c56d5c" : colors[i % 8];
    ctx.fill();
    if (r.physical === "Wreck") {
      ctx.fillRect(x - 7, y - 5, 14, 10);
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 6);
      ctx.lineTo(x + 6, y + 6);
      ctx.moveTo(x + 6, y - 6);
      ctx.lineTo(x - 6, y + 6);
      ctx.strokeStyle = "#fce4d7";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.strokeStyle = "#10161b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = "bold 9px system-ui";
    ctx.fillStyle = "#10161b";
    ctx.fillText(r.id.replace("RU", ""), x, y + 3);
  }
  for (const h of state.hazards) {
    const [x, y] = xy(h.q + 0.5, h.lane);
    ctx.beginPath();
    ctx.moveTo(x, y - 7);
    ctx.lineTo(x + 7, y + 6);
    ctx.lineTo(x - 7, y + 6);
    ctx.closePath();
    ctx.fillStyle = "#e0b350";
    ctx.fill();
  }
  if (t.course) {
    // Direction arrows and follow-view minimap share the same analytic path.
    ctx.fillStyle = "#e4e2c1";
    for (let q = 1; q < t.cells; q += Math.max(4, t.cells / 12)) {
      const a = xy(q, 1.5), b = xy(q + .3, 1.5), h = Math.atan2(b[1]-a[1],b[0]-a[0]);
      ctx.beginPath();ctx.moveTo(a[0]+5*Math.cos(h),a[1]+5*Math.sin(h));
      ctx.lineTo(a[0]+4*Math.cos(h+2.4),a[1]+4*Math.sin(h+2.4));ctx.lineTo(a[0]+4*Math.cos(h-2.4),a[1]+4*Math.sin(h-2.4));ctx.fill();
    }
    if (follow && overview) {
      const mini = (q,lane) => {const p=point(q,lane,c,t);return [870+(p.x-overview.x)*overview.scale*.22,65+(p.y-overview.y)*overview.scale*.22];};
      ctx.fillStyle="#10191eee";ctx.fillRect(755,10,235,110);ctx.beginPath();
      for(let q=0;q<=t.cells;q+=.5){const p=mini(q,1.5);if(q===0)ctx.moveTo(...p);else ctx.lineTo(...p);}ctx.strokeStyle="#a4b9b8";ctx.lineWidth=2;ctx.stroke();
      for(const [i,r] of state.entrants.entries()){const p=mini(r.q,r.lane);ctx.beginPath();ctx.arc(...p,3,0,Math.PI*2);ctx.fillStyle=colors[i%8];ctx.fill();}
    }
  }
  ctx.textAlign = "left";
}
function normalizedInputs(object, exclude = []) {
  return Object.fromEntries(
    Object.entries(object)
      .filter(([k, v]) => typeof v === "number" && !exclude.includes(k))
      .map(([k, v]) => [k, v / 100]),
  );
}
function render() {
  workbench?.render();
  syncSignOptions();
  $("playerLabel").textContent = state.playerId;
  $("trackDiagnostics").textContent = JSON.stringify(trackDiagnostics(state), null, 2);
  const rally = state.track.course && !state.track.closed;
  $("progressHeading").textContent = rally ? "Course %" : "Full laps";
  $("standingsNote").textContent = (rally ? "Common terminal finish; signs activate at intermediate checkpoints. " : "Initial line entry starts lap 1; it does not complete a lap. ") + "Official ties share a place. DNF/DNS remain separate from finishers.";
  const lines = radio.consume(state.events, {
    enabled: $("commentaryEnabled").checked,
  });
  $("commentary").replaceChildren(
    ...($("commentaryEnabled").checked ? lines : []).slice(-60).map((line) => {
      const p = document.createElement("p");
      p.textContent = `${line.time.toFixed(2)} · ${line.text}`;
      return p;
    }),
  );
  if (!lines.length && $("commentaryEnabled").checked) {
    const p = document.createElement("p");
    p.className = "radio-empty";
    p.textContent =
      "Ready at the starting signal. Commentary follows verified race events.";
    $("commentary").append(p);
  }
  $("commentary").scrollTop = $("commentary").scrollHeight;
  const report = results(state),
    view = $("resultsView").value;
  const output = $("resultsOutput");
  output.replaceChildren();
  if (view === "official") {
    if (state.status === "Ready") {
      const p = document.createElement("p");
      p.textContent =
        "Start a race to record the official classification. Live standings are above.";
      output.append(p);
    } else {
      const table = document.createElement("table"),
        header = document.createElement("tr");
      for (const text of [
        "Place",
        "RU",
        "Status",
        "Official time",
        state.track.course && !state.track.closed ? "Checkpoints" : "Full laps",
        state.track.course && !state.track.closed ? "Course fraction" : "Progress (circuits)",
        "Reason",
      ]) {
        const th = document.createElement("th");
        th.textContent = text;
        header.append(th);
      }
      table.append(header);
      for (const row of report.official) {
        const tr = document.createElement("tr");
        const tied =
          row.place !== null &&
          report.official.filter((r) => r.place === row.place).length > 1;
        for (const value of [
          row.place === null ? "—" : `${tied ? "=" : ""}${row.place}`,
          row.id,
          row.status,
          row.status === "Finished" ? `${row.time.toFixed(4)} s` : "—",
          state.track.course && !state.track.closed ? state.entrants.find(r => r.id === row.id).checkpointCursor + "/3" : row.completedLaps,
          (state.track.course && !state.track.closed ? Math.max(0, Math.min(1, courseDistance(row.progress, state.track) / state.track.length)) : row.progress / state.track.cells).toFixed(3),
          row.reason ?? "",
        ]) {
          const td = document.createElement("td");
          td.textContent = String(value);
          tr.append(td);
        }
        table.append(tr);
      }
      output.append(table);
    }
  } else if (view === "narrative") {
    for (const line of report.narrative) {
      const p = document.createElement("p");
      p.textContent = `${line.time.toFixed(3)} · ${line.text}`;
      output.append(p);
    }
  } else {
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(report.technical, null, 2);
    output.append(pre);
  }
  document.querySelector(".legend").textContent =
    `${state.track.name ?? "Existing Oval"} · ${state.track.raceType ?? "Oval"} · ${state.config.lanes} lanes · ${state.track.course && !state.track.closed ? "Terminal finish; no laps" : state.config.laps + " full laps after initial line entry"} · ${state.weather} · Exit beyond finish · Wrecks remain through race end`;

  $("consequenceStatus").textContent =
    `${state.format} · ${state.weather} · Attacks ${state.events.filter((e) => e.type === "ATTACK").length} · Damage events ${state.events.filter((e) => e.type === "DAMAGE").length} · Wrecks ${Object.keys(state.wrecks).length} · Incidents ${state.events.filter((e) => e.type === "INCIDENT").length}`;
  const player = state.entrants.find((r) => r.id === state.playerId);
  $("signStatus").textContent =
    `Uses ${player.signs.remaining} · Pending: ${player.signs.pending ?? "none"} · Active: ${player.signs.active ?? "none"} · ${player.signs.active ? (player.ai.diagnostics?.compliance ?? "Awaiting evaluation") : "Base autonomous AI"}${state.track.course && !state.track.closed ? " · Next checkpoint: " + (state.track.checkpoints[player.checkpointCursor] ? `${state.track.checkpoints[player.checkpointCursor].id} at ${state.track.checkpoints[player.checkpointCursor].distance.toFixed(0)} m` : "none before finish") : ""}`;
  const inspect =
    state.entrants.find((r) => r.id === $("inspect").value) ?? player;
  $("aiDiagnostics").textContent = JSON.stringify(
    {
      control: inspect.control,
      instability: inspect.instability,
      conditions: {
        driver: inspect.ru.driver.condition,
        chariot: inspect.ru.chariot.condition,
        beasts: inspect.ru.beasts.map((b) => b.condition),
      },
      reactionsRemaining: inspect.reactionsRemaining,
      fatigue: inspect.ru.beasts.map((b) => Number(b.fatigue.toFixed(2))),
      strain: inspect.ru.driver.strain,
      wear: inspect.ru.chariot.wear,
      pace: inspect.pace,
      personality: inspect.ru.driver.personality,
      ...inspect.ai.diagnostics,
    },
    null,
    2,
  );

  draw();
  $("clock").textContent = state.time.toFixed(3);
  $("state").textContent = state.status;
  $("tick").textContent = state.tick;
  $("play").textContent =
    playing || completing
      ? "Pause"
      : state.status === "Ready"
        ? "Start race"
        : "Resume";
  const official = classification(state),
    rows =
      state.status === "Ended"
        ? official
        : [...official].sort((a, b) => {
            const ar = state.entrants.find((r) => r.id === a.id),
              br = state.entrants.find((r) => r.id === b.id);
            const category = (r) =>
              r.finishTime !== null
                ? 0
                : r.status === "Racing"
                  ? 1
                  : r.status === "Retired"
                    ? 2
                    : 3;
            return (
              category(ar) - category(br) ||
              (ar.finishTime !== null && br.finishTime !== null
                ? ar.finishTime - br.finishTime
                : (br.retirement?.progress ?? br.q) -
                  (ar.retirement?.progress ?? ar.q))
            );
          });
  $("standings").replaceChildren(
    ...rows.map((row) => {
      const r = state.entrants.find((r) => r.id === row.id),
        tr = document.createElement("tr");
      tr.title = r.retirement?.reason ?? r.physical;
      for (const value of [
        r.finishTime === null ? r.id : `${row.place}. ${r.id}`,
        state.track.course && !state.track.closed ? `${(Math.max(0, Math.min(1, courseDistance(r.q, state.track) / state.track.length)) * 100).toFixed(1)}%` : `${r.completedLaps}/${state.config.laps}`,
        r.speed.toFixed(2),
        r.finishTime === null
          ? r.status === "Retired"
            ? `DNF / ${r.retirement?.time.toFixed(3)} s`
            : r.status === "DNS"
              ? "DNS"
              : r.hasEnteredCourse
                ? r.status
                : "Grid / entry"
          : `${r.finishTime.toFixed(4)} s`,
      ]) {
        const td = document.createElement("td");
        td.textContent = value;
        tr.append(td);
      }
      return tr;
    }),
  );
  if (!$("inspect").options.length)
    for (const r of state.entrants) {
      const o = document.createElement("option");
      o.value = o.textContent = r.id;
      $("inspect").append(o);
    }
  const r =
      state.entrants.find((r) => r.id === $("inspect").value) ??
      state.entrants[0],
    d = r.derived;
  $("derived").textContent =
    `\nTeam speed     ${d.team.speed.toFixed(2)}\nTeam power     ${d.team.power.toFixed(2)}\nCoordination   ${d.coordination.toFixed(3)}\nMismatch       ${d.mismatch.toFixed(3)}\nMass           ${d.mass.toFixed(1)} kg\nMax speed      ${d.maxSpeed.toFixed(3)} m/s\nAcceleration   ${d.acceleration.toFixed(3)} m/s²\nHandling       ${d.handling.toFixed(2)}\nControl        ${d.control.toFixed(2)}\nEndurance      ${d.endurance.toFixed(2)}\nResilience     ${d.resilience.toFixed(2)}\nCombat score   ${d.combat.toFixed(2)}\nBraking        ${d.braking.toFixed(3)} m/s²\nCorner lateral ${d.lateral.toFixed(3)} m/s²\nLane / tile    ${r.lane + 1} / ${r.q.toFixed(4)}`;
  $("derivedDetails").textContent = JSON.stringify(
    {
      base: r.ru,
      normalized: {
        driver: normalizedInputs(r.ru.driver),
        personality: normalizedInputs(r.ru.driver.personality),
        chariot: normalizedInputs(r.ru.chariot, ["weight", "capacity"]),
        beasts: r.ru.beasts.map((b) =>
          Object.fromEntries(
            Object.entries(b)
              .filter(([, v]) => typeof v === "number")
              .map(([k, v]) => [k, v / 100]),
          ),
        ),
      },
      derived: r.derived,
      environment: state.environment,
      surface: location(r.q, r.lane, state.config, state.track).surface,
      coefficients: state.config.tuning,
      configurationRevision: state.configRevision,
      overrides: state.events
        .filter(
          (e) =>
            e.type === "OVERRIDE_APPLIED" &&
            (!e.participants.length || e.participants.includes(r.id)),
        )
        .map((e) => e.effects),
    },
    null,
    2,
  );
  $("log").textContent = state.events
    .slice($("fullLog").checked ? 0 : -60)
    .map(
      (e) =>
        `${e.time.toFixed(6)}  ${e.type}  ${e.participants.join(", ")}  ${JSON.stringify(e.effects)}`,
    )
    .join("\n");
  const terminal =
    ["Ended", "Stalled", "Error"].includes(state.status) || workbench?.isDone();
  for (const id of ["play", "step", "complete"])
    $(id).disabled = terminal || (id === "complete" && completing);
  if (terminal) {
    playing = false;
    $("play").textContent = "Race ended";
    $("checksum").textContent = `Checksum ${digest(state)}`;
  } else $("checksum").textContent = "";
  $("log").scrollTop = $("log").scrollHeight;
  if (state.status === "Error")
    $("error").textContent = JSON.stringify(
      state.events.at(-1).effects,
      null,
      2,
    );
}
for (const key of [
  "noise",
  "judgmentError",
  "executionError",
  "stressError",
  "signPush",
  "signConserve",
  "signOpen",
  "signDefensive",
  "signEngage",
  "signHold",
]) {
  const label = document.createElement("label");
  label.textContent = key.replace(/([A-Z])/g, " $1") + " ";
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.max = ["judgmentError", "executionError", "stressError"].includes(key)
    ? "1"
    : "100";
  input.step = "0.05";
  input.value = m2Defaults[key];
  input.dataset.key = key;
  label.append(input);
  $("tuners").append(label);
}
for (const weather of Object.keys(weatherPresets)) {
  const option = document.createElement("option");
  option.value = option.textContent = weather;
  $("weather").append(option);
}
for (const sign of signs) {
  const option = document.createElement("option");
  option.value = option.textContent = sign;
  $("sign").append(option);
}
for (const [id, action] of [
  ["queueSign", "queue"],
  ["cancelSign", "cancel"],
  ["lowerSign", "lower"],
])
  $(id).onclick = () => {
    if (!workbench?.isReplay())
      issueSign(
        state,
        action,
        action === "queue" ? $("sign").value : undefined,
      );
    render();
  };
function syncSignOptions() {
  for (const option of $("sign").options)
    option.disabled =
      option.value === "Engage Rivals" && state.format === "Pure";
  if ($("sign").selectedOptions[0]?.disabled) $("sign").value = signs[0];
}
$("format").onchange = syncSignOptions;
syncSignOptions();
$("reset").onclick = () => reset();
$("play").onclick = () => {
  if (completing) pausePlayback();
  else playing = !playing;
  render();
};
$("step").onclick = () => {
  pausePlayback();
  advance();
  render();
};
$("inspect").onchange = render;
$("complete").onclick = () => {
  playing = false;
  complete();
};
$("export").textContent = "Export replay & evidence";
$("export").onclick = () =>
  downloadJSON(capture(state), `BNT-M4-seed-${state.seed}.json`);
$("exportResults").onclick = () =>
  downloadJSON(results(state), `BNT-results-${state.seed}.json`);
$("resultsView").onchange = render;
$("fullLog").onchange = render;
$("commentaryEnabled").onchange = render;
function pausePlayback() {
  playing = false;
  completing = false;
  transportEpoch++;
}
function replaceRace(next) {
  pausePlayback();
  state = next;
  devSetup = next.setup;
  $("raceKind").value = next.track.raceType ?? "Oval";
  populateTracks(next.setup.course);
  if (next.setup.course?.generation) {
    const g = next.setup.course.generation;
    $("rallySeed").value = g.seed; $("rallyCategory").value = g.category;
    $("rallyTerrain").value = g.terrainProfile; $("rallyTurns").value = g.options.turnFrequency; $("rallyComplexity").value = g.options.turnSeverity;
  }
  $("lapCount").value = next.config.laps;
  $("lapCount").disabled = next.track.course && !next.track.closed;
  playing = false;
  accumulator = 0;
  radio = new Commentary();
  $("inspect").replaceChildren();
  $("seed").value = next.seed;
  $("weather").value = next.weather;
  $("format").value = next.format;
  $("damageScale").value = next.consequence.damageScale;
  $("incidentRate").value = next.consequence.incidentRate;
  $("signStrength").value = next.autonomous.signStrength;
  $("fatigueRate").value = next.autonomous.fatigueRate;
  for (const input of document.querySelectorAll("#tuners input"))
    input.value = next.autonomous[input.dataset.key];
}
function advance() {
  try {
    if (workbench) workbench.advance();
    else step(state);
    if (workbench?.isDone()) playing = false;
    return true;
  } catch (e) {
    playing = false;
    $("error").textContent = e.details
      ? JSON.stringify(e.details, null, 2)
      : e.message;
    return false;
  }
}
async function complete() {
  if (completing) return;
  const epoch = ++transportEpoch;
  completing = true;
  playing = false;
  try {
    while (
      !["Ended", "Stalled", "Error"].includes(state.status) &&
      !workbench?.isDone() &&
      epoch === transportEpoch
    ) {
      for (
        let i = 0;
        i < 100 &&
        !["Ended", "Stalled", "Error"].includes(state.status) &&
        !workbench?.isDone();
        i++
      )
        if (!advance()) return;
      render();
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  } finally {
    if (epoch === transportEpoch) completing = false;
    render();
  }
}
function frame(now) {
  if (previous !== null && playing) {
    accumulator = advanceFrames(
      accumulator,
      (now - previous) / 1000,
      Number($("speed").value),
      state.config.dt,
      advance,
      () =>
        !playing ||
        ["Ended", "Stalled", "Error"].includes(state.status) ||
        workbench?.isDone(),
    );
    render();
  }
  previous = now;
  requestAnimationFrame(frame);
}
// Read-only data access plus headless run entrypoint for artifact parity tests.
window.BNT = {
  championships,
  foundation,
  managementDiagnostics: { generateMarket, seedInteger, marketStream },
  createRace,
  run,
  step,
  classification,
  capture,
  digest,
  issueSign,
  queueOverride,
  verifyReplay,
  startReplay,
  advanceReplay,
  results,
  getState: () => structuredClone(state),
};
workbench = mountWorkbench({
  getState: () => state,
  setState: replaceRace,
  isPlaying: () => playing || completing,
  pause: pausePlayback,
  render,
});
const signbar = document.createElement("div");
signbar.className = "signbar";
const signControls = $("sign").parentElement;
signbar.append(signControls, $("signStatus"));
document.querySelector(".metrics").before(signbar);
document
  .querySelector("aside")
  .prepend(document.querySelector(".commentary-panel"));
const topControls = document.querySelector("main .panel .controls");
topControls.insertBefore($("weather").parentElement, $("reset"));
topControls.insertBefore($("format").parentElement, $("reset"));
render();
requestAnimationFrame(frame);
