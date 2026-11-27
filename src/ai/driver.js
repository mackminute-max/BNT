import { grudgeValue, huntTerms } from "../sim/grudges.js";
import {activeAbility} from '../sim/m6-interaction.js';
import {pendingDelay} from './buffered-signs.js';
import {paceDirective} from './directives.js';
import {finishUtility} from './finish-utility.js';
import {coachingUtility} from './coaching.js';
import { combatValue } from "./combat-value.js";
import { location } from "../track/oval.js";
import { beginDecision } from "./telemetry.js";
import { random, byId } from "../core/determinism.js";
import { routePreview } from "../track/course.js";
import { mod, gap, forwardGap, key } from "../track/oval.js";
import { activateSign, signPreference } from "./signs.js";
export const tendencies = [
  "aggression",
  "caution",
  "patience",
  "opportunism",
  "staminaManagement",
  "tacticalDiscipline",
];
export function personality(index = 0) {
  return Object.fromEntries(
    tendencies.map((k, i) => [k, 25 + ((index * 23 + i * 17) % 61)]),
  );
}
export function perceive(s, r) {
  const w = s.autonomous.utility;
  const range =
    s.autonomous.perceptionTiles *
    s.environment.visibility *
    (w.perceptionBase + (w.perceptionSkill * r.derived.awareness) / 100);
  const neighbors = s.entrants
    .filter(
      (o) => o.id !== r.id && o.physical !== "Exited" && o.status !== "DNS",
    )
    .map((o) => {
      const separation = gap(r.q, o.q, s.track);
      return {
        id: o.id,
        lane: o.lane,
        gap: separation,
        speed: o.speed,
        physical: o.physical,
        status: o.status,
      };
    })
    .filter((o) => Math.abs(o.gap) <= range)
    .sort(byId);
  const hazards = (s.hazards ?? [])
    .filter(
      (h) =>
        Math.abs(gap(r.q, h.q, s.track)) <= range,
    )
    .map((h) => ({ ...h }));
  return {
    ...(s.track.course ? { course: routePreview(r.q, r.lane, s.config, s.track) } : {}),
    range,
    neighbors,
    hazards,
    weather: s.weather,
    visibility: s.environment.visibility,
  };
}
function draw(s, r, kind) {
  s.rng.draws++;
  return random(s.seed, "ai", kind, r.id, s.tick, r.ai.evaluation);
}
// Phase 2 racecraft (config schema 2): drivers race the line, not the lane.
// They take the inside line into corners, dive inside a rival ahead before a
// corner, and move across to block a rival closing from behind.
const RACECRAFT = Object.freeze({setup: 2.8, line: 3.2, unwind: 2.4, dive: 2.2, block: 2.6, pass: 3, apexTiles: 3, entryTiles: 8, exitTiles: 3, diveGap: 5, blockGap: 5, passGap: 6});
// Nearest corner ahead (tiles, and +1/-1 for which lane direction is inside)
// and whether a corner was just left behind.
function cornerPhase(s, r, route) {
  const at = k => location(Math.floor(r.q) + k, r.lane, s.config, s.track);
  let ahead = null;
  if (route) { if (route.corner) ahead = {tiles: route.corner.tilesAhead, inside: route.corner.direction}; }
  else for (let k = 0; k <= RACECRAFT.entryTiles; k++) if (at(k).type === "turn") { ahead = {tiles: k, inside: -1}; break; }
  let behind = false;
  if (!ahead || ahead.tiles > 0) for (let k = 1; k <= RACECRAFT.exitTiles; k++) if (Math.floor(r.q) - k >= 0 && at(-k).type === "turn") { behind = true; break; }
  return {ahead, behind};
}
function racecraft(s, r, perceived, action, lane, route, p) {
  if (s.config.schema < 2) return {};
  const R = RACECRAFT, aggression = p.aggression / 100, terms = {}, dir = action === "outward" ? 1 : -1;
  const {ahead, behind} = cornerPhase(s, r, route);
  // Racing line: wide on entry, inside at the apex, run wide on exit.
  if (ahead && ahead.tiles <= R.apexTiles) {
    if (dir === ahead.inside) {
      terms.line = R.line;
      if (perceived.neighbors.some(o => o.status === "Racing" && o.gap > 0 && o.gap < R.diveGap && Math.abs(o.lane - r.lane) <= 1))
        terms.dive = R.dive * (0.4 + aggression);
    }
  } else if (ahead) { if (dir === -ahead.inside) terms.line = R.setup; }
  else if (behind && dir === 1 && !route) terms.line = R.unwind;
  if (perceived.neighbors.some(o => o.status === "Racing" && o.lane === lane && o.gap < 0 && o.gap > -R.blockGap))
    terms.block = R.block * (0.3 + aggression);
  // Stuck behind a rival in our lane: swing out (or in) to pass if the
  // target lane is clear just ahead.
  const blocked = perceived.neighbors.some(o => o.status === "Racing" && o.lane === r.lane && o.gap > 0 && o.gap < R.passGap),
    clear = !perceived.neighbors.some(o => o.lane === lane && o.gap > -1 && o.gap < R.passGap);
  if (blocked && clear) terms.pass = R.pass * (0.4 + aggression);
  return terms;
}
export function decide(s, r) {
  const perceived = perceive(s, r),
    p = r.ru.driver.personality,
    c = s.autonomous,
    w = c.utility;
  r.ai.perceived = perceived;
  const ahead = perceived.neighbors
    .filter((o) => o.lane === r.lane && o.gap > 0)
    .sort((a, b) => a.gap - b.gap)[0];
  const danger =
    (ahead && ahead.gap < w.dangerGap) ||
    perceived.hazards.some(
      (h) => h.lane === r.lane && forwardGap(r.q, h.q, s.track) >= 0 && forwardGap(r.q, h.q, s.track) < w.hazardGap,
    );
  // Tactical danger is reconsidered every tick; strategy is periodic and goals persist.
  if (s.tick < r.ai.nextDecision && !danger) return null;
  const delayed=pendingDelay(s,r);if(delayed)activateSign(s,r,delayed);
  r.ai.evaluation = (r.ai.evaluation ?? 0) + 1;
  r.ai.nextDecision = s.tick + c.decisionTicks;
  const fatigue =
    r.ru.beasts.reduce((n, b) => n + b.fatigue, 0) / r.ru.beasts.length / 100;
  const errorFactor=activeAbility(s,r,'absolute-focus')?.5:1;
  const judgment =
    draw(s, r, "judgment") < c.judgmentError * (1 - r.derived.awareness / 100) * errorFactor;
  const stress =
    (r.ru.driver.strain / 100 +
      (r.control === "Unstable" ? w.stressInstability : 0)) *
    (1 - r.derived.nerve / 100);
  const stressFailure = draw(s, r, "stress") < c.stressError * stress * errorFactor;
  const noise = (action) => {
    s.rng.draws++;
    return (
      (random(s.seed, "ai", "utility", r.id, s.tick, r.ai.evaluation, action) -
        0.5) *
      c.noise
    );
  };
  const available = (lane) =>
    r.control !== "Out of Control" &&
    s.tick >= (r.ai.laneCooldown ?? 0) &&
    !perceived.neighbors.some(
      (o) =>
        o.id === r.ai.passTarget &&
        o.lane === lane &&
        o.gap > -w.passClearance &&
        o.gap < w.passLookahead,
    ) &&
    lane >= 0 &&
    lane < s.config.lanes &&
    !perceived.neighbors.some(
      (o) => o.lane === lane && Math.floor(r.q + o.gap) === Math.floor(r.q),
    ) &&
    !perceived.hazards.some(
      (h) =>
        h.lane === lane &&
        key(h.q, lane, s.track) === key(r.q, lane, s.track),
    );
  const sign = r.signs.active,
    responsiveness = p.tacticalDiscipline / 100;
  const candidates = [];
  function add(
    action,
    base,
    features = {},
    legal = true,
    lane = null,
    target = null,
    assessment = null,
  ) {
    if (!legal) return;
    const influence =
      c.signStrength * responsiveness * signPreference(sign, action, c);
    const persistence =
      r.ai.goal === action && s.tick < r.ai.goalUntil ? c.switchCost : 0;
    const terms = {
      base,
      ...features,
      ...(w.finishUrgency ? {finishEffort:finishUtility(s,r,action,p)} : {}),
      ...(r.coachingContext ? {coaching:coachingUtility(r.coachingContext,action,sign)} : {}),
      sign: influence,
      persistence,
      noise: noise(action),
    };
    candidates.push({
      action,
      lane,
      target,
      ...(assessment ? { assessment } : {}),
      terms,
      score: Object.values(terms).reduce((a, b) => a + b, 0),
    });
  }
  const threat = judgment ? 0 : danger ? 1 : 0;
  add("Conserve", w.conserveBase, {
    fatigue:
      fatigue *
      (w.conserveFatigueBase + (p.staminaManagement / 100) * w.conserveStamina),
    caution: (p.caution / 100) * w.conserveCaution,
  });
  add("Maintain", w.maintainBase, {
    patience: (p.patience / 100) * w.maintainPatience,
  });
  add("Push", w.pushBase, {
    aggression: (p.aggression / 100) * w.pushAggression,
    fatigue: -fatigue * w.pushFatigue,
  });
  add("Sprint", w.sprintBase, {
    opportunity: (p.opportunism / 100) * w.sprintOpportunity,
    aggression: (p.aggression / 100) * w.sprintAggression,
    fatigue: -fatigue * w.sprintFatigue,
  });
  const route = perceived.course;
  const cornerRisk = route?.corner ? Math.max(0, r.derived.maxSpeed /
    Math.sqrt(r.derived.lateral * route.corner.radius) - 1) : 0;
  if (route) for (const candidate of candidates) {
    const effort = { Conserve: 0, Maintain: 0, Push: .5, Sprint: 1 }[candidate.action];
    candidate.terms.courseCorner = -c.utility.courseCornerRisk * Math.min(2, cornerRisk) * effort * (1 + p.caution / 100);
    candidate.terms.courseTerrain = -c.utility.courseTerrainRisk * effort *
      Math.max(route.current.surface.roughness, 1 - route.current.surface.grip) * (p.staminaManagement / 100);
    candidate.score = Object.values(candidate.terms).reduce((a, b) => a + b, 0);
  }
  const laneScores = [];
  add("hold", w.holdBase, {
    patience: (p.patience / 100) * w.holdPatience,
    danger: -threat * w.holdDanger,
  });
  for (const [action, lane] of [
    ["inward", r.lane - 1],
    ["outward", r.lane + 1],
  ]) {
    const blocked = perceived.neighbors.some(
      (o) => o.lane === lane && o.gap > 0 && o.gap < w.laneTrafficGap,
    );
    const before = candidates.length;
    add(
      action,
      w.laneBase,
      {
        distance: route ? (route.corner && (action === "outward" ? 1 : -1) === route.corner.direction ? w.insideBonus : 0) : action === "inward" ? w.insideBonus : 0,
        ...racecraft(s, r, perceived, action, lane, route, p),
        ...(route?.corner ? { courseLaneRisk: -w.courseLaneRisk * Math.min(2,
          Math.max(0, r.derived.maxSpeed / Math.sqrt(r.derived.lateral *
            (s.track.segments.find(x => x.id === route.corner.segment).radius - route.corner.direction * lane * s.config.laneWidth)) - 1)) } : {}),
        opportunity:
          threat *
          (w.laneOpportunityBase + (p.opportunism / 100) * w.laneOpportunism),
        traffic: blocked ? -w.laneTrafficPenalty : 0,
      },
      available(lane),
      lane,
    );
    if (candidates.length > before) laneScores.push(candidates.at(-1));
  }
  add(
    "overtake",
    w.overtakeBase,
    {
      opportunity: (p.opportunism / 100) * w.overtakeOpportunity,
      aggression: (p.aggression / 100) * w.overtakeAggression,
    },
    !!ahead && ahead.gap < w.overtakeGap && laneScores.length > 0,
    laneScores[0]?.lane,
  );
  add(
    "avoid",
    threat ? w.avoidBase : 0,
    { caution: (p.caution / 100) * w.avoidCaution },
    !!threat && laneScores.length > 0,
    laneScores.sort((a, b) => b.score - a.score)[0]?.lane,
  );
  add(
    "yield",
    threat ? w.yieldBase : 0,
    { caution: (p.caution / 100) * w.yieldCaution },
    !!threat,
  );
  add(
    "defend",
    w.defendBase,
    { aggression: (p.aggression / 100) * w.defendAggression },
    perceived.neighbors.some((o) => o.gap < 0 && o.gap > -w.defendGap),
  );
  if (s.consequences && s.format === "Combat") {
    const combat = s.consequence;
    const rivals = perceived.neighbors.filter(
      (o) =>
        o.status === "Racing" &&
        o.physical === "Live" &&
        Math.abs(o.lane - r.lane) <= 1 &&
        Math.abs(o.gap) <= combat.attackRange,
    );
    const grip = Math.max(.1, s.environment.grip * location(r.q, r.lane, s.config, s.track).surface.grip);
    const canAct = s.time + s.config.epsilon >= r.nextAttackTime && r.control !== "Out of Control";
    const evaluated = action => rivals
      .filter(o => action !== "ram" || (Math.abs(o.lane - r.lane) === 1 && Math.abs(o.gap) <= combat.ramRange))
      .map(o => ({ target: o, value: grudgeValue(r, o, combatValue(action, r, o, perceived, s.config, combat, w, grip, s.track.course && !s.track.closed ? r.q >= s.track.checkpoints.at(-1).q : null)) }))
      .sort((a, b) => Object.values(b.value.features).reduce((x, y) => x + y, 0) -
        Object.values(a.value.features).reduce((x, y) => x + y, 0) || byId(a.target, b.target))[0];
    const target = rivals[0];
    for (const action of ["attack", "ram"]) {
      const best = canAct ? evaluated(action) : null;
      add(action, combat[action + "Base"], {
        aggression: p.aggression / 100 * combat[action + "Aggression"],
        opportunity: p.opportunism / 100 * combat[action + "Opportunity"],
        caution: -p.caution / 100 * combat[action + "Caution"] * (best?.value.features.grudge ? .5 : 1),
        ...(best?.value.features ?? {}),
      }, !!best, null, best?.target.id, best?.value.estimate);
    }
    add(
      "defendCombat",
      combat.defendBase,
      { caution: (p.caution / 100) * combat.defendCaution },
      !!target,
    );
    add(
      "disengage",
      combat.disengageBase,
      {
        caution: (p.caution / 100) * combat.disengageCaution,
        fatigue: fatigue * combat.disengageFatigue,
      },
      !!target,
      laneScores[0]?.lane ?? null,
    );
  }
  if (r.grudgeContext && s.format === "Combat") huntTerms(r, candidates, s.entrants
    .filter(o => r.grudgeContext.targets.includes(o.id) && o.status === "Racing" && o.physical === "Live")
    .map(o => ({ id: o.id, lane: o.lane, gap: gap(r.q, o.q, s.track) })), perceived.range);
  let pace = candidates
    .filter((x) =>
      ["Conserve", "Maintain", "Push", "Sprint"].includes(x.action),
    )
    .sort((a, b) => b.score - a.score || a.action.localeCompare(b.action))[0];
  let position = candidates
    .filter(
      (x) => !["Conserve", "Maintain", "Push", "Sprint"].includes(x.action),
    )
    .sort((a, b) => b.score - a.score || a.action.localeCompare(b.action))[0];
  const directive=paceDirective(s,r,candidates);
  if(directive){pace=candidates.find(x=>x.action===directive.selected)??pace;if(directive.decision==='Obeying'&&directive.requested==='Sprint'&&['yield','disengage'].includes(position?.action))position=candidates.filter(x=>!['Conserve','Maintain','Push','Sprint','yield','disengage'].includes(x.action)).sort((a,b)=>b.score-a.score||a.action.localeCompare(b.action))[0];}
  const executionFailure =
    draw(s, r, "execution") <
    c.executionError * (1 - r.ru.driver.driving / 100) * errorFactor;
  const failed = executionFailure || stressFailure;
  const commands = [];
  if (!failed) {
    r.pace = ["yield", "disengage"].includes(position?.action)
      ? "Conserve"
      : pace.action;
    r.defending = position?.action === "defendCombat";
    if (["attack", "ram"].includes(position?.action))
      commands.push({
        type: "attack",
        id: r.id,
        target: position.target,
        action: position.action,
      });
    if (position?.lane !== null && position?.lane !== undefined)
      commands.push({ type: "lane", id: r.id, lane: position.lane });
  }
  if (position) {
    r.ai.goal = position.action;
    r.ai.goalUntil = s.tick + c.goalTicks;
  }
  const preferred = candidates.some(x => signPreference(sign, x.action, c) > 0);
  const decisionId = beginDecision(s, r, {
    tick: s.tick,
    ...(directive?{directive}:{}),
    perceived,
    candidates,
    chosen: { pace: pace.action, position: position?.action },
    judgmentError: judgment,
    executionError: executionFailure,
    stressError: stressFailure,
    reason: failed
      ? "Driver error"
      : !preferred && sign
        ? "No applicable legal action"
        : r.pace !== pace.action
          ? `${position?.action} requires ${r.pace}; selected pace ${pace.action} was overridden`
          : null,
  }, failed, position);
  return commands.map(command => ({ ...command, decisionId }));
}
