import {deterministicLog,INCIDENT_CLOCK_VERSION} from './deterministic-log.js';
import { key, mod, location } from "../track/oval.js";
import { emit } from "../events/events.js";
import { drawConsequence } from "./consequences.js";
export const incidentTypes = ["debris", "animal", "spectator"];
export function validateIncidents(schedule, c, t) {
  if (!Array.isArray(schedule)) throw new Error("Invalid incident schedule");
  return schedule
    .map((x, index) => {
      if (
        !x ||
        !Number.isFinite(x.time) ||
        x.time < 0 ||
        !incidentTypes.includes(x.type) ||
        !Number.isInteger(x.lane) ||
        x.lane < 0 ||
        x.lane >= c.lanes ||
        !Number.isInteger(x.tile) ||
        x.tile < 0 ||
        x.tile >= t.cells ||
        !Number.isFinite(x.duration) ||
        x.duration <= 0 ||
        x.duration > 1000
      )
        throw new Error("Invalid scheduled incident");
      return { ...x, index };
    })
    .sort((a, b) => a.time - b.time || a.index - b.index);
}
function nextRandom(s) {
  if (!s.consequences || s.consequence.incidentRate === 0) return Infinity;
  return (
    s.time +
    Math.max(
      s.consequence.incidentMinimumInterval,
      -(s.championshipContext?.clockVersion===INCIDENT_CLOCK_VERSION?deterministicLog:Math.log)(
        Math.max(
          1e-12,
          1 - drawConsequence(s, "incident-clock", s.nextIncident),
        ),
      ) / s.consequence.incidentRate,
    )
  );
}
export function initializeIncidents(s) {
  s.nextIncident = 1;
  s.incidentCursor = 0;
  s.nextIncidentAt = nextRandom(s);
}
export function incidentTime(s) {
  if (!s.consequences) return Infinity;
  return Math.max(
    0,
    Math.min(
      s.nextIncidentAt,
      s.incidentSchedule[s.incidentCursor]?.time ?? Infinity,
      ...s.hazards.map((h) => h.expires),
    ) - s.time,
  );
}
export function updateIncidents(s) {
  if (!s.consequences) return;
  for (const h of s.hazards.filter(
    (h) => h.expires <= s.time + s.config.epsilon,
  ))
    emit(s, "INCIDENT_CLEARED", [], { incidentId: h.id });
  s.hazards = s.hazards.filter((h) => h.expires > s.time + s.config.epsilon);
  const requests = [];
  while (
    s.incidentSchedule[s.incidentCursor]?.time <=
    s.time + s.config.epsilon
  )
    requests.push(s.incidentSchedule[s.incidentCursor++]);
  if (s.nextIncidentAt <= s.time + s.config.epsilon) {
    const c = s.consequence,
      total = incidentTypes.reduce((n, k) => n + c[k + "Weight"], 0);
    let pick = drawConsequence(s, "incident-type", s.nextIncident) * total;
    const type =
      incidentTypes.find((k) => {
        pick -= c[k + "Weight"];
        return pick < 0;
      }) ?? "debris";
    requests.push({ type, duration: c.incidentDuration });
    // The clock is rearmed after assigning the next incident ID below.
  }
  for (const request of requests) {
    const id = `incident:${s.nextIncident++}`;
    const occupied = new Set(
      s.entrants
        .filter((r) => r.physical !== "Exited" && r.status !== "DNS")
        .map((r) => key(r.q, r.lane, s.track)),
    );
    for (const h of s.hazards) occupied.add(key(h.q, h.lane, s.track));
    const eligible = [];
    for (let lane = 0; lane < s.config.lanes; lane++)
      for (let tile = s.config.exitTiles + 1; tile < s.track.cells; tile++)
        if (!occupied.has(key(tile, lane, s.track))) {
          const weight = location(tile, lane, s.config, s.track).surface.hazardModifier;
          if (weight > 0) eligible.push({ lane, tile, weight });
        }
    let placement;
    if (request.tile === undefined) {
      // The race-wide incident clock is unchanged. Surface coefficients weight
      // eligible placement cells; neutral weights reproduce the old uniform draw.
      let pick = drawConsequence(s, "incident-placement", id) *
        eligible.reduce((sum, cell) => sum + cell.weight, 0);
      placement = eligible.find(cell => { pick -= cell.weight; return pick < 0; });
    } else {
      placement = eligible.find(p => p.lane === request.lane && p.tile === request.tile);
    }
    if (!placement) {
      emit(s, "INCIDENT_SKIPPED", [], {
        incidentId: id,
        reason: "No eligible unoccupied tile",
        requested: request,
      });
      continue;
    }
    const hazard = {
      id,
      type: request.type,
      lane: placement.lane,
      q: placement.tile,
      created: s.time,
      expires: s.time + request.duration,
    };
    s.hazards.push(hazard);
    emit(s, "INCIDENT", [], hazard);
  }
  if (s.nextIncidentAt <= s.time + s.config.epsilon)
    s.nextIncidentAt = nextRandom(s);
}
export function hazardAt(s, q, lane) {
  return s.hazards.find(
    (h) =>
      h.lane === lane &&
      key(h.q, lane, s.track) === key(q, lane, s.track),
  );
}

export function rescheduleIncidents(s) {
  s.nextIncidentAt = nextRandom(s);
}
