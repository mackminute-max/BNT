import {m6Entrant,m6Boundary,abilityDerived} from './m6-interaction.js';
import {applyAffinity,validateAffinityContext} from '../model/affinity.js';
import {validateProgressionContext} from '../model/progression-context.js';
import {beginActionCosts,chargeAction,flushActionCosts,endActionCosts} from './action-costs.js';
import {INCIDENT_CLOCK_VERSION} from './deterministic-log.js';
import {validateCoaching} from '../ai/coaching.js';
import {applyPayrollControl,validatePayrollContext} from '../model/payroll-control.js';
import { resolveAction } from "../ai/telemetry.js";
import { applyOverride } from "../dev/overrides.js";
import {
  consequenceConfig,
  queueImpact,
  queueHazardImpact,
  flushImpacts,
  resolveAttacks,
  retire,
  updateControl,
  controlTime,
  recoverControl,
} from "./consequences.js";
import {
  validateIncidents,
  initializeIncidents,
  incidentTime,
  updateIncidents,
  hazardAt,
} from "./incidents.js";
import {
  weatherPresets,
  m2Config,
  integrateCondition,
  environmentConfig,
} from "./environment.js";
import { personality, tendencies, decide } from "../ai/driver.js";
import { signCommand, activateSign } from "../ai/signs.js";
import { config, VERSION } from "../config/config.js";
import { defaultRU, derive } from "../model/ru.js";
import { byId, random, streamingChecksum } from "../core/determinism.js";
import { ovalPresets, resolveCatalog } from "../track/catalog.js";
import { normalizeCourse } from "../track/course.js";
import { surfaceDefaults, surfaceRules, track, location, key, nextDistance, gap, forwardGap, finishQ } from "../track/oval.js";
import { emit } from "../events/events.js";
import { travel, arrival } from "./kinematics.js";

const sorted = (s) => [...s.entrants].sort(byId);
const physical = (r) => r.physical !== "Exited" && r.status !== "DNS";
export function createRace({
  seed = 145,
  overrides = {},
  entrants,
  format = "Pure",
  driverMode = "autonomous",
  weather = "Clear",
  autonomous = {},
  playerId = null,
  surfaces = {},
  consequences = true,
  consequence = {},
  scheduledIncidents = [],
  checkpointInterval = 100,
  environmentOverrides = {},
  course = null,
  championshipContext,
} = {}) {
  if (!Object.hasOwn(weatherPresets, weather))
    throw new Error("Invalid weather");
  if (!["reference", "autonomous"].includes(driverMode))
    throw new Error("Invalid driver mode");
  if (typeof consequences !== "boolean")
    throw new Error("Invalid consequences flag");
  if (
    !Number.isInteger(checkpointInterval) ||
    checkpointInterval < 1 ||
    checkpointInterval > 10000
  )
    throw new Error("Invalid checkpoint interval");
  const consequenceTuning = consequenceConfig(consequence);
  const tuning = m2Config(autonomous);
  const environment = environmentConfig(weather, environmentOverrides);
  course = resolveCatalog(course);
  const oval = typeof course === "string" && Object.hasOwn(ovalPresets, course) ? ovalPresets[course] : null;
  const c = config({ ...oval?.overrides, ...overrides }),
    t = track(c, course);
  if (!Number.isSafeInteger(seed))
    throw new Error("Seed must be a safe integer");
  if (!["Pure", "Combat"].includes(format))
    throw new Error("Invalid race format");
  const input =
    entrants ??
    Array.from({ length: 8 }, (_, i) => ({
      ru: defaultRU(`RU${i + 1}`, 46 + i * 2),
      lane: i % c.lanes,
      q: -c.gridOffset - Math.floor(i / c.lanes) * c.gridGap,
    }));
  if (!input.length || input.length > 64)
    throw new Error("Expected 1..64 entrants");
  for (const [id, patch] of Object.entries(surfaces)) {
    const segment = t.segments.find((x) => x.id === id);
    if (!segment || !patch || typeof patch !== "object")
      throw new Error("Invalid surface");
    for (const [k, v] of Object.entries(patch))
      if (
        !Object.hasOwn(surfaceDefaults, k) ||
        !Number.isFinite(v) ||
        v < surfaceRules[k][0] ||
        v > surfaceRules[k][1]
      )
        throw new Error("Invalid surface modifier");
    Object.assign(segment.surface, patch);
  }
  if(championshipContext!==undefined&&(!championshipContext||championshipContext.version!==1||(!['instanceId,raceId,version','clockVersion,instanceId,raceId,version'].includes(Object.keys(championshipContext).sort().join(','))||championshipContext.clockVersion!==undefined&&championshipContext.clockVersion!==INCIDENT_CLOCK_VERSION)||!['instanceId','raceId'].every(k=>typeof championshipContext[k]==='string'&&/^[a-zA-Z0-9_-]{1,128}$/.test(championshipContext[k]))))throw Error('Invalid championship race context');
  if(championshipContext)championshipContext={...championshipContext,clockVersion:INCIDENT_CLOCK_VERSION};
  const seen = new Set();
  const units = input.map((e, i) => {
    const ru = structuredClone(e.ru);
    ru.driver.personality ??= personality(
      Number(ru.id.replace(/\D/g, "")) || 0,
    );
    for (const k of tendencies)
      if (
        !Number.isFinite(ru.driver.personality[k]) ||
        ru.driver.personality[k] < 0 ||
        ru.driver.personality[k] > 100
      )
        throw new Error(`Invalid personality ${k}`);
    validateAffinityContext(e.affinityContext);validateCoaching(e.coachingContext);validateProgressionContext(e.progressionContext);if(e.progressionContext&&ru.id!==(playerId??input[0].ru.id))throw Error('Progression is player-only');
    if(e.coachingContext&&ru.id!==(playerId??input[0].ru.id))throw Error('Coaching is player-only');
    validatePayrollContext(e.payrollContext);
    const derived = applyPayrollControl(applyAffinity(derive(ru, {
      ...c,
      crowdMorale: environment.crowdMorale,
      grip: c.grip * environment.grip,
      speedReference: c.speedReference / environment.rolling,
    }),e.affinityContext,c),e.payrollContext);
    if (seen.has(ru.id)) throw new Error(`Duplicate ID ${ru.id}`);
    seen.add(ru.id);
    const lane = e.lane ?? i % c.lanes,
      q = e.q ?? -c.gridOffset - Math.floor(i / c.lanes) * c.gridGap,
      speed = e.speed ?? 0;
    if (
      !Number.isInteger(lane) ||
      lane < 0 ||
      lane >= c.lanes ||
      !Number.isFinite(q) ||
      q >= 0 ||
      q < -t.cells + 1 ||
      !Number.isFinite(speed) ||
      speed < 0 ||
      speed > 200
    )
      throw new Error(
        `Invalid initial position/speed ${ru.id}; grid must be behind common line`,
      );
    if (location(q, lane, c, t).type !== "straight")
      throw new Error("Starting grid must fit on approach straight");
    return {
      id: ru.id,
      ru,
      derived,
      ...(e.affinityContext?{affinityContext:structuredClone(e.affinityContext)}:{}),
      ...(e.progressionContext?{progressionContext:structuredClone(e.progressionContext)}:{}),
      ...(e.coachingContext ? {coachingContext:freezeCoaching(e.coachingContext)} : {}),
      ...(championshipContext ? {progressEvidence:{version:1,progress:q,firstTime:0,firstTick:0}} : {}),
      ...(e.payrollContext===undefined?{}:{payrollContext:structuredClone(e.payrollContext)}),
      lane,
      q,
      speed,
      status: "Racing",
      physical: "Live",
      control: "Normal",
      hasEnteredCourse: false,
      completedLaps: 0,
      lastCrossingTime: null,
      lastCrossingQ: null,
      ...(t.course && !t.closed ? { checkpointCursor: 0 } : {}),
      finishTime: null,
      finishSnapshot: null,
      retirement: null,
      pace: "Maintain",
      cornerVisits: 0,
      blocked: false,
      instability: 0,
      nextAttackTime: 0,
      reactionsRemaining: consequenceTuning.reactionBudget,
      defending: false,
      ...([2,3].includes(e.progressionContext?.version)?{m6:{charges:e.progressionContext.abilityId?1:0,pendingAbility:null,activeAbility:null,throughTick:0}}:{}),
      signs: { remaining: [2,3].includes(e.progressionContext?.version)?(t.course&&!t.closed?t.checkpoints.length+1:c.laps)+e.progressionContext.signBonus:e.progressionContext?Math.min(100,tuning.signUses+e.progressionContext.signBonus):tuning.signUses, pending: null, active: null },
      ai: {
        nextDecision: 0,
        goal: "hold",
        goalUntil: 0,
        perceived: null,
        diagnostics: null,
      },
    };
  });
  const s = {
    version: VERSION,
    ...(championshipContext ? {championshipContext:structuredClone(championshipContext)} : {}),
    seed,
    rng: { algorithm: "keyed-fnv-avalanche-v1", draws: 0 },
    config: c,
    track: t,
    format,
    consequences,
    consequence: consequenceTuning,
    driverMode,
    weather,
    environment,
    autonomous: tuning,
    playerId: playerId ?? units[0].id,
    hazards: [],
    wrecks: {},
    contactHistory: {},
    pendingImpacts: [],
    impactsThisTick: 0,
    nextImpact: 1,
    nextAttack: 1,
    incidentSchedule: validateIncidents(scheduledIncidents, c, t),
    status: "Ready",
    tick: 0,
    time: 0,
    entrants: units,
    events: [],
    commands: [],
    contacts: [],
    lastProgressTime: 0,
    diagnostics: { subevents: 0, maxGroups: 0 },
    setup: null,
    configRevision: 0,
    pendingOverrides: [],
    resolving: false,
    checkpointInterval,
    checkpoints: [],
    previousProgress: Object.fromEntries(
      units.map((r) => [r.id, { q: r.q, status: r.status }]),
    ),
    leader: null,
  };
  if (!units.some((r) => r.id === s.playerId))
    throw new Error("Invalid player RU");
  s.setup = {
    ...(t.course ? { course: normalizeCourse(course) } : t.ovalId ? { course: t.ovalId } : {}),
    seed,
    overrides: { ...c },
    entrants: units.map((r) => ({
      ru: structuredClone(r.ru),
      ...(r.affinityContext?{affinityContext:structuredClone(r.affinityContext)}:{}),
      ...(r.progressionContext?{progressionContext:structuredClone(r.progressionContext)}:{}),
      ...(r.coachingContext ? {coachingContext:freezeCoaching(r.coachingContext)} : {}),
      ...(r.payrollContext===undefined?{}:{payrollContext:structuredClone(r.payrollContext)}),
      lane: r.lane,
      q: r.q,
      speed: r.speed,
    })),
    format,
    driverMode,
    weather,
    autonomous: tuning,
    playerId: s.playerId,
    surfaces: structuredClone(surfaces),
    consequences,
    consequence: consequenceTuning,
    scheduledIncidents: structuredClone(scheduledIncidents),
    checkpointInterval,
    ...(championshipContext ? {championshipContext:structuredClone(championshipContext)} : {}),
    environmentOverrides: structuredClone(environmentOverrides),
  };
  if (driverMode === "autonomous")
    for (const r of units) r.derived = deriveAt(s, r);
  initializeIncidents(s);
  s.initialRng = structuredClone(s.rng);
  assertState(s);
  s.checkpoints.push({ tick: 0, checksum: digest(s) });
  return s;
}
export function assertState(s) {
  const occupied = new Set();
  for (const r of sorted(s)) {
    if (
      ![r.q, r.speed, s.time].every(Number.isFinite) ||
      r.speed < -s.config.epsilon ||
      !Number.isInteger(r.lane) ||
      r.lane < 0 ||
      r.lane >= s.config.lanes
    )
      throw new Error(`Invalid numeric state ${r.id}`);
    if (physical(r)) {
      const k = key(r.q, r.lane, s.track);
      if (occupied.has(k)) throw new Error(`Overlapping occupancy at ${k}`);
      occupied.add(k);
    }
    if (
      Object.hasOwn(s.wrecks, r.id) &&
      (r.physical !== "Wreck" ||
        r.q !== s.wrecks[r.id].q ||
        r.lane !== s.wrecks[r.id].lane)
    )
      throw new Error(`Wreck moved or removed ${r.id}`);
    if (
      s.consequences &&
      (!Number.isFinite(r.instability) ||
        r.ru.beasts.some(
          (b) =>
            !Number.isFinite(b.condition) ||
            b.condition < 0 ||
            b.condition > 100,
        ))
    )
      throw new Error(`Invalid damage state ${r.id}`);
    if (
      s.consequences &&
      r.physical === "Wreck" &&
      !Object.hasOwn(s.wrecks, r.id)
    )
      throw new Error(`Unregistered wreck ${r.id}`);
    if (r.physical === "Wreck" && r.speed !== 0)
      throw new Error(`Moving wreck ${r.id}`);
  }
}
export function snapshot(s) {
  return {
    version: s.version,
    seed: s.seed,
    config: s.config,
    configRevision: s.configRevision,
    pendingOverrides: s.pendingOverrides,
    checkpointInterval: s.checkpointInterval,
    previousProgress: s.previousProgress,
    leader: s.leader,
    format: s.format,
    driverMode: s.driverMode,
    weather: s.weather,
    environment: s.environment,
    autonomous: s.autonomous,
    playerId: s.playerId,
    hazards: s.hazards,
    consequences: s.consequences,
    consequence: s.consequence,
    wrecks: s.wrecks,
    contactHistory: s.contactHistory,
    pendingImpacts: s.pendingImpacts,
    impactsThisTick: s.impactsThisTick,
    nextImpact: s.nextImpact,
    nextAttack: s.nextAttack,
    incidentSchedule: s.incidentSchedule,
    incidentCursor: s.incidentCursor,
    nextIncidentAt: s.nextIncidentAt,
    nextIncident: s.nextIncident,
    track: s.track,
    contacts: [...s.contacts].sort(),
    lastProgressTime: s.lastProgressTime,
    diagnostics: s.diagnostics,
    time: s.time,
    tick: s.tick,
    status: s.status,
    rng: s.rng,
    entrants: sorted(s),
    commands: s.commands,
    events: s.events,
  };
}
export function digest(s) {
  return streamingChecksum(snapshot(s));
}
export function capture(s) {
  return structuredClone({
    version: s.version,
    setup: s.setup,
    commands: s.commands,
    events: s.events,
    checksum: digest(s),
    schema: 1,
    kind: "BNT-replay",
    tick: s.tick,
    time: s.time,
    status: s.status,
    initialRng: s.initialRng,
    checkpoints: s.checkpoints,
    pendingOverrides: s.pendingOverrides,
  });
}
export function classification(s) {
  const finished = sorted(s)
    .filter((r) => r.finishTime !== null)
    .sort((a, b) => a.finishTime - b.finishTime || byId(a, b));
  let groupTime = -Infinity,
    place = 0;
  const rows = finished.map((r, i) => {
    if (r.finishTime - groupTime > s.config.finishTolerance) {
      place = i + 1;
      groupTime = r.finishTime;
    }
    return {
      id: r.id,
      place,
      status: "Finished",
      time: r.finishTime,
      completedLaps: r.completedLaps,
      progress: r.retirement?.progress ?? finishQ(s),
    };
  });
  const rest = sorted(s)
    .filter((r) => r.finishTime === null)
    .sort(
      (a, b) =>
        (a.status === "DNS") - (b.status === "DNS") ||
        (b.retirement?.progress ?? b.q) - (a.retirement?.progress ?? a.q) ||
        byId(a, b),
    );
  return [
    ...rows,
    ...rest.map((r) => ({
      id: r.id,
      place: null,
      status: r.status,
      time: r.retirement?.time ?? null,
      completedLaps: r.completedLaps,
      progress: r.retirement?.progress ?? r.q,
      reason: r.retirement?.reason ?? null,
    })),
  ];
}
function deriveAt(s, r) {
  const surface = location(r.q, r.lane, s.config, s.track).surface;
  return abilityDerived(s,r,applyPayrollControl(applyAffinity(derive(r.ru, {
    ...s.config,
    crowdMorale: s.environment.crowdMorale,
    grip: s.config.grip * s.environment.grip * surface.grip,
    speedReference:
      s.config.speedReference /
      (s.environment.rolling * surface.rollingResistance),
  }),r.affinityContext,s.config),r.payrollContext));
}
function randomDraw(s, ...keys) {
  s.rng.draws++;
  return random(s.seed, ...keys);
}
function contact(s, ids, cause, options = {}) {
  const [a, b] = ids.map((id) => s.entrants.find((r) => r.id === id));
  queueImpact(s, a, b, cause, options);
}
function flush(s) {
  flushImpacts(s, (r) => {
    r.derived = deriveAt(s, r);
  });
}
function attacks(s, intents) {
  resolveAttacks(
    s,
    intents.filter((c) => c.type === "attack"),
    (r) => {
      r.derived = deriveAt(s, r);
    },
  );
}
function checkpoints(s, r) {
  if (!s.track.course || s.track.closed || r.status !== "Racing") return;
  while (s.track.checkpoints[r.checkpointCursor]?.q <= r.q) {
    const cp = s.track.checkpoints[r.checkpointCursor++];
    emit(s, "CHECKPOINT_CROSSED", [r.id], { checkpoint: cp.id, distance: cp.distance, q: cp.q });
    activateSign(s, r);
  }
}
function lockFinish(s, r) {
  r.finishTime = s.time;
  const finishSnapshot = Object.freeze({
    time: s.time,
    beasts: Object.freeze(r.ru.beasts.map((b, index) => Object.freeze({ index, fatigue: b.fatigue }))),
  });
  Object.defineProperty(r, "finishSnapshot", { value: finishSnapshot, enumerable: true, writable: false, configurable: false });
  r.status = "Finished";
  r.physical = "Clearing";
  emit(s, "RU_FINISHED", [r.id], { time: r.finishTime, finishSnapshot: r.finishSnapshot });
}
function crossing(s, r) {
  if (s.track.course && !s.track.closed) {
    if (r.status !== "Racing") return;
    if (r.q === 0 && !r.hasEnteredCourse) {
      r.hasEnteredCourse = true; r.lastCrossingQ = 0; r.lastCrossingTime = s.time;
      emit(s, "COURSE_ENTERED", [r.id], { track: s.track.name });
    }
    checkpoints(s, r);
    if (r.q === s.track.cells && r.hasEnteredCourse) lockFinish(s, r);
    return;
  }
  if (
    r.status !== "Racing" ||
    r.q % s.track.cells !== 0 ||
    r.lastCrossingQ === r.q
  )
    return;
  activateSign(s, r);
  r.lastCrossingQ = r.q;
  r.lastCrossingTime = s.time;
  if (!r.hasEnteredCourse) {
    r.hasEnteredCourse = true;
    emit(s, "LAP_ENTERED", [r.id], { completedLaps: 0 });
    if (s.config.laps === 1) emit(s, "FINAL_LAP", [r.id], { targetLaps: 1 });
  } else {
    r.completedLaps++;
    emit(s, "LAP_COMPLETED", [r.id], { completedLaps: r.completedLaps });
    if (r.completedLaps === s.config.laps - 1)
      emit(s, "FINAL_LAP", [r.id], { targetLaps: s.config.laps });
    if (r.completedLaps === s.config.laps) {
      lockFinish(s, r);
    }
  }
}
function corner(s, r) {
  if (r.status !== "Racing") return;
  const loc = location(r.q, r.lane, s.config, s.track);
  if (loc.type !== "turn") return;
  const safe = Math.sqrt(r.derived.lateral * loc.radius),
    excess = Math.max(0, r.speed / safe - 1);
  const probability = Math.min(1, s.config.cornerRisk * excess * excess);
  const roll = randomDraw(s, "corner", r.id, r.cornerVisits++);
  emit(s, "CORNER_EVALUATED", [r.id], {
    safe,
    speed: r.speed,
    probability,
    roll,
  });
  if (roll < probability) {
    if (s.consequences) {
      r.instability += s.consequence.cornerShock * excess;
      updateControl(s, r, "Corner overspeed");
    } else r.control = "Unstable";
    r.speed *= 1 - s.config.cornerSpeedLoss;
    emit(s, "CONTROL_CHANGED", [r.id], {
      control: r.control,
      speed: r.speed,
      cause: "corner overspeed",
    });
  } else if (!s.consequences) r.control = "Normal";
}
// Lateral sweeps are resolved from one immutable boundary snapshot. No swapping through another RU.
function laneChanges(s, commands) {
  const intents = [];
  const speeds = new Map(sorted(s).map((r) => [r.id, r.speed]));
  for (const cmd of commands) {
    const r = s.entrants.find((r) => r.id === cmd.id);
    if (
      !r ||
      r.status !== "Racing" ||
      r.control === "Out of Control" ||
      !Number.isInteger(cmd.lane) ||
      Math.abs(cmd.lane - r.lane) !== 1 ||
      cmd.lane < 0 ||
      cmd.lane >= s.config.lanes
    ) {
      resolveAction(s, r, cmd.decisionId, "position", false, "Illegal adjacent lane change");
      emit(s, "COMMAND_REJECTED", cmd.id ? [cmd.id] : [], {
        reason: "Illegal adjacent lane change",
      });
      continue;
    }
    intents.push({
      r,
      decisionId: cmd.decisionId,
      lane: cmd.lane,
      target: key(r.q, cmd.lane, s.track),
      rank: randomDraw(s, "lateral", s.tick, r.id),
      hazard: s.consequences && hazardAt(s, r.q, cmd.lane),
    });
    emit(s, "LANE_CHANGE_REQUESTED", [r.id], { lane: cmd.lane });
  }
  const occupied = new Map(
    sorted(s)
      .filter(physical)
      .map((r) => [key(r.q, r.lane, s.track), r]),
  );
  const accepted = new Set(),
    reserved = new Set();
  for (const intent of [...intents].sort(
    (a, b) => a.rank - b.rank || byId(a.r, b.r),
  )) {
    if (!intent.hazard && !occupied.has(intent.target) && !reserved.has(intent.target)) {
      accepted.add(intent.r.id);
      reserved.add(intent.target);
    }
  }
  const won = new Set();
  for (const intent of intents.sort(
    (a, b) => a.rank - b.rank || byId(a.r, b.r),
  )) {
    const blocker = occupied.get(intent.target);
    if (intent.hazard || blocker || won.has(intent.target)) {
      if (intent.hazard)
        queueHazardImpact(s, intent.r, intent.hazard, speeds.get(intent.r.id), true);
      if (blocker && accepted.has(blocker.id))
        emit(s, "MOVEMENT_CONFLICT", [intent.r.id, blocker.id], {
          cause: "Conservative lateral reservation; blocker vacating",
        });
      if (blocker && !accepted.has(blocker.id))
        contact(s, [intent.r.id, blocker.id], "lateral sweep blocked", {
          side: true,
          speeds,
        });
      emit(s, "LANE_CHANGE_REJECTED", [intent.r.id], {
        lane: intent.lane,
        reason: intent.hazard ? "Swept tile contains an incident" : "Swept tile occupied or contested",
      });
      resolveAction(s, intent.r, intent.decisionId, "position", false, "Physical execution blocked", { lane: intent.r.lane });
    } else {
      won.add(intent.target);
      const old = intent.r.lane;
      if (s.driverMode === "autonomous") {
        intent.r.ai.laneCooldown = s.tick + s.autonomous.goalTicks;
        const target = intent.r.ai.perceived?.neighbors
          .filter((o) => o.lane === old && o.gap > 0 && o.gap < 4)
          .sort((a, b) => a.gap - b.gap)[0];
        if (target) intent.r.ai.passTarget = target.id;
      }
      intent.r.lane = intent.lane;
      // Same longitudinal cross-section; no speed penalty or distance credit.
      emit(s, "LANE_CHANGE_COMPLETED", [intent.r.id], {
        from: old,
        to: intent.lane,
      });
      corner(s, intent.r);
      resolveAction(s, intent.r, intent.decisionId, "position", true, null, { lane: intent.r.lane });
    }
  }
  flush(s);
}
function applyCommands(s, commands) {
  const ids = new Set();
  for (const command of commands) {
    if (
      !command ||
      !["lane", "pace", "sign", "attack", "override"].includes(command.type) ||
      (!["sign", "override"].includes(command.type) &&
        ids.has(`${command.type}:${command.id}`))
    )
      throw new Error("Invalid/duplicate boundary command");
    ids.add(`${command.type}:${command.id}`);
    const fields =
      command.type === "override"
        ? ["type", "id", "target", "path", "value"]
        : command.type === "attack"
          ? ["type", "id", "target", "action"]
          : command.type === "sign"
            ? ["type", "id", "action", "sign"]
            : command.type === "lane"
              ? ["type", "id", "lane"]
              : ["type", "id", "pace"];
    if (
      typeof command.id !== "string" ||
      Object.keys(command).some((k) => !fields.includes(k))
    )
      throw new Error("Invalid command fields");
    if (
      command.type === "attack" &&
      (typeof command.target !== "string" ||
        !["attack", "ram"].includes(command.action))
    )
      throw new Error("Invalid combat intent");
    if (
      command.type === "pace" &&
      !["Conserve", "Maintain", "Push", "Sprint", "Brake"].includes(
        command.pace,
      )
    )
      throw new Error("Invalid pace");
  }
  const ordered = [
    ...commands.filter((c) => c.type === "sign"),
    ...commands.filter((c) => c.type === "override"),
    ...commands
      .filter((c) => !["sign", "override"].includes(c.type))
      .sort((a, b) => byId(a, b) || a.type.localeCompare(b.type)),
  ].map((c) => ({ ...c }));
  for (const cmd of ordered) {
    s.commands.push({ tick: s.tick, order: s.commands.length, ...cmd });
    if (cmd.type === "override") {
      try {
        applyOverride(s, cmd);
      } catch (error) {
        emit(s, "OVERRIDE_REJECTED", [cmd.id], { message: error.message });
      }
    }
    if (cmd.type === "sign") {
      if (cmd.id !== s.playerId)
        emit(s, "SIGN_REJECTED", [cmd.id], {
          reason: "Only player RU may receive signs",
        });
      else signCommand(s, cmd);
    }
    if (cmd.type === "pace") {
      const r = s.entrants.find(
        (r) => r.id === cmd.id && r.status === "Racing",
      );
      if (r) {
        r.pace = cmd.pace;
        emit(s, "PACE_CHANGED", [r.id], { pace: r.pace });
      } else emit(s, "COMMAND_REJECTED", [cmd.id], { reason: "Not racing" });
    }
  }
  attacks(s, ordered);
  laneChanges(
    s,
    ordered.filter((c) => c.type === "lane"),
  );
}
// Shared physical target integration; AI selects preferences, never physical outcomes.
function motion(s, r) {
  if (r.blocked || r.physical === "Wreck" || !physical(r))
    return {
      a: 0,
      limitTime: Infinity,
      boundaryTime: Infinity,
      envelopeTime: Infinity,
    };
  const c = s.config,
    w = c.tuning,
    loc = location(r.q, r.lane, c, s.track),
    d = r.derived;
  let target =
    r.physical === "Clearing"
      ? c.clearSpeed
      : d.maxSpeed *
        {
          Conserve: w.paceConserve,
          Maintain: w.paceMaintain,
          Push: w.pacePush,
          Sprint: w.paceSprint,
          Brake: 0,
        }[r.pace];
  const constraints = [];
  if (r.status === "Racing" && r.pace !== "Sprint") {
    const next = location(Math.floor(r.q) + 1, r.lane, c, s.track);
    if (loc.type === "turn")
      target = Math.min(
        target,
        Math.sqrt(d.lateral * loc.radius) * w.safeCornerFraction,
      );
    else if (next.type === "turn")
      constraints.push({
        speed: Math.sqrt(d.lateral * next.radius) * w.safeCornerFraction,
        distance: nextDistance(r, c, s.track),
      });
  }
  if (s.consequences && r.control === "Out of Control") target = 0;
  if (r.physical === "Clearing") {
    for (const other of sorted(s).filter(
      (o) => o.id !== r.id && physical(o) && o.lane === r.lane,
    )) {
      const gap = forwardGap(r.q, Math.floor(other.q), s.track);
      if (gap < 0) continue;
      if (gap <= s.config.exitTiles + 1) {
        let position = r.q,
          distance = 0,
          remaining = gap;
        while (remaining > s.config.positionEpsilon) {
          const portion = Math.min(
            remaining,
            Math.floor(position) + 1 - position,
          );
          distance += portion * location(position, r.lane, c, s.track).length;
          position += portion;
          remaining -= portion;
          if (portion === 0) break;
        }
        constraints.push({ speed: 0, distance });
      }
    }
  }
  // Follow a continuous braking envelope. Do not repeatedly chase its moving
  // instantaneous target: that creates a zero-time limit-event cascade.
  for (const constraint of constraints) {
    const envelope = Math.sqrt(
      constraint.speed ** 2 + 2 * d.braking * constraint.distance,
    );
    if (
      r.speed >= envelope - c.epsilon ||
      constraint.distance <= c.positionEpsilon * loc.length * 2
    )
      target = Math.min(target, constraint.speed);
  }
  const delta = target - r.speed;
  const a =
    Math.abs(delta) < c.epsilon ? 0 : delta > 0 ? d.acceleration : -d.braking;
  let envelopeTime = Infinity;
  if (a + d.braking > c.epsilon)
    for (const constraint of constraints) {
      const distance =
        (constraint.speed ** 2 +
          2 * d.braking * constraint.distance -
          r.speed ** 2) /
        (2 * (a + d.braking));
      if (
        distance > 0 &&
        r.speed <
          Math.sqrt(
            constraint.speed ** 2 + 2 * d.braking * constraint.distance,
          ) -
            c.epsilon
      )
        envelopeTime = Math.min(envelopeTime, arrival(r.speed, a, distance));
    }
  return {
    a,
    target,
    envelopeTime,
    limitTime: a ? delta / a : Infinity,
    boundaryTime: arrival(r.speed, a, nextDistance(r, c, s.track)),
  };
}
function resolveForward(s, movers) {
  const speeds = new Map(sorted(s).map((r) => [r.id, r.speed]));
  const occupied = new Map(
    sorted(s)
      .filter(physical)
      .map((r) => [key(r.q, r.lane, s.track), r]),
  );
  const intents = new Map(
    movers.map((r) => [r.id, { r, next: Math.floor(r.q) + 1 }]),
  );
  const decisions = new Map(),
    visiting = new Set();
  function allowed(id) {
    if (decisions.has(id)) return decisions.get(id);
    if (visiting.has(id)) return false; // Closed occupancy cycle has no free swept space.
    visiting.add(id);
    const { r, next } = intents.get(id),
      blocker = occupied.get(key(next, r.lane, s.track));
    const hazard = s.consequences && hazardAt(s, next, r.lane);
    const ok =
      !hazard &&
      (!blocker ||
        (blocker.id !== id && intents.has(blocker.id) && allowed(blocker.id)));
    visiting.delete(id);
    decisions.set(id, ok);
    return ok;
  }
  for (const r of movers) allowed(r.id);
  for (const r of movers) {
    const { next } = intents.get(r.id);
    if (decisions.get(r.id)) {
      const previousLocation = s.track.course ? location(r.q, r.lane, s.config, s.track) : null;
      r.q = next;
      observeProgress(s,r);
      if (s.track.course && r.status === "Racing") {
        const loc = location(r.q, r.lane, s.config, s.track);
        if (previousLocation.segment !== loc.segment) emit(s, "SEGMENT_ENTERED", [r.id], {
          segment: loc.segment, terrain: loc.terrain, type: loc.type, direction: loc.direction,
          radius: Number.isFinite(loc.radius) ? loc.radius : null,
        });
      }
      s.lastProgressTime = s.time;
      if (s.driverMode === "autonomous") r.derived = deriveAt(s, r);
      crossing(s, r);
      if (
        r.physical === "Clearing" &&
        r.q >= finishQ(s) + s.config.exitTiles
      ) {
        r.physical = "Exited";
        r.speed = 0;
        emit(s, "RU_EXITED", [r.id]);
      } else corner(s, r);
    } else {
      const blocker = occupied.get(key(next, r.lane, s.track));
      if (blocker)
        contact(s, [r.id, blocker.id], "forward occupancy", { speeds });
      const hazard = s.consequences && hazardAt(s, next, r.lane);
      if (hazard) queueHazardImpact(s, r, hazard, speeds.get(r.id));
      r.q = next - s.config.positionEpsilon;
      observeProgress(s,r);
      r.speed = 0;
      r.blocked = true;
      resolveAction(s, r, r.ai.diagnostics?.decisionId, "movement", false, "Forward path blocked");
      emit(s, "MOVEMENT_BLOCKED", [r.id], { tile: key(next, r.lane, s.track) });
    }
  }
  flush(s);
}
function endIfDone(s) {
  if (
    s.entrants.every((r) => r.status !== "Racing") &&
    s.entrants.every((r) => r.physical !== "Clearing")
  ) {
    s.status = "Ended";
    emit(s, "RACE_ENDED", [], { classification: classification(s) });
  } else if (
    s.time >= s.config.maxRaceTime ||
    s.time - s.lastProgressTime > s.config.stallTime
  ) {
    if (s.consequences)
      for (const r of sorted(s))
        if (r.status === "Racing")
          retire(s, r, "Race safeguard: stalled or time limit");
    s.status = "Stalled";
    emit(s, "RACE_STALLED", [], {
      reason:
        s.time >= s.config.maxRaceTime ? "Time limit" : "No tile progress",
      classification: classification(s),
    });
  }
}
export function step(s, commands = []) {
  if (["Ended", "Stalled", "Error"].includes(s.status)) return s;
  try {
    s.resolving = true;
    assertState(s);
    beginActionCosts(s);
    // Paused UI signs were already applied before this boundary in the original
    // run. Replay them before condition/retirement effects, preserving event order.
    for (const command of commands.filter(c => c?.phase === "paused")) {
      if (command.type !== "sign" || command.id !== s.playerId ||
          Object.keys(command).some(k => !["type", "id", "action", "sign", "phase"].includes(k)))
        throw new Error("Invalid paused sign command");
      issueSign(s, command.action, command.sign);
    }
    commands = commands.filter(c => c?.phase !== "paused");
    s.impactsThisTick = 0;
    for (const r of sorted(s)) {
      r.reactionsRemaining = s.consequence.reactionBudget;
      r.defending = r.ai.goal === "defendCombat";
    }
    if (s.consequences)
      for (const r of sorted(s)) updateControl(s, r, "Boundary condition");
    applyCommands(s, [...s.pendingOverrides.splice(0), ...commands]);
    for(const r of sorted(s))if(m6Entrant(r)){m6Boundary(s,r);activateSign(s,r,{m6Boundary:true});if(s.driverMode!=='autonomous')r.derived=deriveAt(s,r);}
    if (s.status === "Ready") {
      s.status = "Running";
      emit(s, "RACE_STARTED", [], {
        referenceDrivers: s.driverMode === "reference",
        ...(s.championshipContext ? {starters:sorted(s).filter(r=>r.status==='Racing').map(r=>r.id)} : {}),
      });
      for (const r of sorted(s)) activateSign(s, r);
    }
    if (s.consequences) {
      for (const r of sorted(s)) updateControl(s, r, "Initial condition");
      updateIncidents(s);
    }
    for (const r of sorted(s)) r.blocked = false;
    if (s.driverMode === "autonomous") {
      const intents = [];
      for (const r of sorted(s))
        if (r.status === "Racing") {
          r.derived = deriveAt(s, r);
          const result = decide(s, r);
          if (result) intents.push(...result);
        }
      attacks(s, intents);
      laneChanges(
        s,
        intents.filter((c) => c.type === "lane"),
      );
    }
    const end = (s.tick + 1) * s.config.dt;
    let groups = 0;
    while (s.time < end - s.config.epsilon) {
      if (++groups > s.config.maxSubevents)
        throw new Error("Subevent budget exceeded");
      const units = sorted(s).filter(physical),
        motions = new Map(
          units.map((r) => [
            r.id,
            {
              ...motion(s, r),
              controlTime: controlTime(s, r),
              nextQ: Math.floor(r.q) + 1,
            },
          ]),
        );
      if (s.track.course && !s.track.closed) for (const r of units) {
        const m = motions.get(r.id), cp = s.track.checkpoints[r.checkpointCursor];
        m.markerQ = r.status === "Racing" && cp && cp.q > r.q && cp.q <= m.nextQ ? cp.q : null;
        m.markerTime = m.markerQ !== null ? arrival(r.speed, m.a,
          (m.markerQ - r.q) * location(r.q, r.lane, s.config, s.track).length) : Infinity;
      }
      const elapsed = Math.min(
        end - s.time,
        incidentTime(s),
        ...[...motions.values()].flatMap((m) => [
          m.limitTime,
          m.boundaryTime,
          m.controlTime,
          m.envelopeTime,
          m.markerTime ?? Infinity,
        ]),
      );
      if (!Number.isFinite(elapsed) || elapsed < 0)
        throw new Error("Invalid elapsed time");
      for (const r of units) {
        const m = motions.get(r.id);
        if (s.driverMode === "autonomous") integrateCondition(s, r, elapsed);
        const distance = travel(r.speed, m.a, elapsed);
        r.q += distance / location(r.q, r.lane, s.config, s.track).length;
        // Keep ownership of source tile until the entire simultaneous group resolves.
        if (m.boundaryTime <= elapsed + s.config.epsilon)
          r.q = m.nextQ - s.config.positionEpsilon;
        const speedBefore=r.speed;
        r.speed = Math.max(0, r.speed + m.a * elapsed);
        if (Math.abs(m.limitTime - elapsed) <= s.config.epsilon)
          r.speed = m.target;
        if(s.autonomous.accelerationFatiguePerSpeed&&r.status==='Racing'&&r.speed>speedBefore+s.config.epsilon)chargeAction(s,r,'acceleration',{fatigue:s.autonomous.accelerationFatiguePerSpeed*(r.speed-speedBefore),magnitude:r.speed-speedBefore});
      }
      s.time += elapsed;
      for(const r of units)observeProgress(s,r);
      if (s.consequences) {
        for (const r of units) recoverControl(s, r, elapsed);
        updateIncidents(s);
      }
      const movers = units.filter(
        (r) => motions.get(r.id).boundaryTime <= elapsed + s.config.epsilon,
      );
      const markers = units.filter(r => (motions.get(r.id).markerTime ?? Infinity) <= elapsed + s.config.epsilon);
      if (movers.length || markers.length) {
        const eventStart = s.events.length;
        if (movers.length) resolveForward(s, movers);
        for (const r of markers) {
          const m = motions.get(r.id);
          if (!movers.includes(r)) { r.q = m.markerQ; observeProgress(s,r); }
          checkpoints(s, r);
        }
        if (s.driverMode === "autonomous") {
          const affected = new Set(
            s.events
              .slice(eventStart)
              .filter((e) =>
                [
                  "MOVEMENT_BLOCKED",
                  "CONTROL_CHANGED",
                  "SIGN_ACTIVATED",
                  "DAMAGE",
                ].includes(e.type),
              )
              .flatMap((e) => e.participants),
          );
          const reactions = [];
          for (const r of sorted(s))
            if (affected.has(r.id) && r.status === "Racing") {
              r.ai.nextDecision = s.tick;
              const intents = decide(s, r);
              if (intents) reactions.push(...intents);
            }
          const lanes = new Map(
            reactions
              .filter((c) => c.type === "lane")
              .map((c) => [c.id, s.entrants.find((r) => r.id === c.id).lane]),
          );
          attacks(s, reactions);
          laneChanges(
            s,
            reactions.filter((c) => c.type === "lane"),
          );
          for (const intent of reactions.filter((c) => c.type === "lane")) {
            const r = s.entrants.find((r) => r.id === intent.id);
            if (r.lane !== lanes.get(r.id)) {
              r.blocked = false;
              resolveAction(s, r, intent.decisionId, "movement", true);
            }
          }
        }
      }
      assertState(s);
      if (elapsed === 0 && !movers.length && incidentTime(s) === 0)
        throw new Error("Zero-time event without progress");
    }
    s.time = end;
    s.tick++;
    s.diagnostics.subevents += groups;
    s.diagnostics.maxGroups = Math.max(groups, s.diagnostics.maxGroups);
    // Contact identity survives only while the participants remain spatially adjacent.
    s.contacts = s.contacts.filter((pair) => {
      const [a, b] = pair
        .split("|")
        .map((id) => s.entrants.find((r) => r.id === id));
      return (
        physical(a) &&
        physical(b) &&
        Math.abs(a.lane - b.lane) <= 1 &&
        Math.abs(gap(a.q, b.q, s.track)) < 1.01
      );
    });
    logRacecraft(s);
    flushActionCosts(s);
    endIfDone(s);
    assertState(s);
    if (
      s.tick % s.checkpointInterval === 0 ||
      ["Ended", "Stalled"].includes(s.status)
    )
      s.checkpoints.push({ tick: s.tick, checksum: digest(s) });
  } catch (error) {
    flushActionCosts(s);
    s.status = "Error";
    emit(s, "INTEGRITY_ERROR", [], {
      message: error.message,
      context: sorted(s).map(({ id, q, lane, speed }) => ({
        id,
        q,
        lane,
        speed,
      })),
    });
  } finally {
    endActionCosts(s);
    s.resolving = false;
  }
  return s;
}
export function run(
  s,
  {
    commands = [],
    maxTicks = Math.ceil(s.config.maxRaceTime / s.config.dt) + 2,
  } = {},
) {
  while (!["Ended", "Stalled", "Error"].includes(s.status) && s.tick < maxTicks)
    step(
      s,
      commands
        .filter((c) => c.tick === s.tick)
        .map(({ tick, order, ...c }) => c),
    );
  return s;
}

// Paused sign controls apply at the current resolved tick boundary without advancing time.
export function issueSign(s, action, sign) {
  if (!["Ready", "Running"].includes(s.status)) return false;
  const command = {
    type: "sign",
    id: s.playerId,
    action,
    ...(sign === undefined ? {} : { sign: action==='buffer-delay-v1'?structuredClone(sign):sign }),
  };
  s.commands.push({ tick: s.tick, order: s.commands.length, phase: "paused", ...command });
  return signCommand(s, command);
}

function logRacecraft(s) {
  const racers = sorted(s).filter((r) => r.status === "Racing");
  for (let i = 0; i < racers.length; i++)
    for (let j = i + 1; j < racers.length; j++) {
      const a = racers[i],
        b = racers[j],
        pa = s.previousProgress[a.id],
        pb = s.previousProgress[b.id];
      if (
        pa?.status === "Racing" &&
        pb?.status === "Racing" &&
        (pa.q - pb.q) * (a.q - b.q) < 0 &&
        Math.abs(a.q - b.q) > s.config.positionEpsilon
      ) {
        const passer = a.q > b.q ? a : b,
          passed = passer === a ? b : a;
        emit(s, "OVERTAKE", [passer.id, passed.id], {
          passer: passer.id,
          passed: passed.id,
          observedAtTickBoundary: true,
        });
      }
    }
  if (!s.entrants.some((r) => r.finishTime !== null)) {
    const order = [...racers].sort((a, b) => b.q - a.q || byId(a, b));
    const leader =
      order[0] &&
      (!order[1] || order[0].q - order[1].q > s.config.positionEpsilon)
        ? order[0].id
        : null;
    if (leader && leader !== s.leader) {
      s.leader = leader;
      emit(s, "LEAD_CHANGED", [leader], { leader });
    }
  }
  s.previousProgress = Object.fromEntries(
    sorted(s).map((r) => [r.id, { q: r.q, status: r.status }]),
  );
}

function freezeCoaching(c){const n=structuredClone(c);Object.freeze(n.axes);Object.freeze(n.weights);return Object.freeze(n);}
function observeProgress(s,r){if(s.championshipContext&&r.status==='Racing'&&r.progressEvidence.progress!==r.q)r.progressEvidence={version:1,progress:r.q,firstTime:s.time,firstTick:s.tick};}
