import {directiveCompliance} from './directives.js';
import { signPreference } from "./signs.js";
import { emit } from "../events/events.js";

// This module observes issued actions and resolved physics; it never chooses AI
// actions or changes movement, damage, pace, or sign influence.
export function compliance(d, tuning) {
  if(d.directive)return directiveCompliance(d);
  if (!d.sign) return null;
  if (!d.candidates.some(x => signPreference(d.sign, x.action, tuning) > 0))
    return "Inapplicable";
  if (d.executionError || d.stressError) return "Prevented";
  const pacePreferred = signPreference(d.sign, d.effective.pace, tuning) > 0;
  const positionPreferred = signPreference(d.sign, d.effective.position, tuning) > 0;
  const paceApplied = d.physicalOutcome.pace.status === "Applied" &&
    !(d.sign === "Push the Pace" && d.physicalOutcome.movement.status === "Blocked");
  const positionStatus = d.physicalOutcome.position.status;
  if (["Push the Pace", "Conserve Strength"].includes(d.sign))
    return pacePreferred ? (paceApplied ? "Followed" : "Prevented") : "Overridden";
  if (positionPreferred && positionStatus === "Pending") return null;
  const paceFollowed = pacePreferred && paceApplied;
  const positionFollowed = positionPreferred && positionStatus === "Succeeded";
  if (positionFollowed) return "Followed";
  if (paceFollowed) return "Partially Followed";
  if ((positionPreferred && positionStatus === "Prevented") || (pacePreferred && !paceApplied))
    return "Prevented";
  return "Overridden";
}
export function beginDecision(s, r, diagnostic, failed, position) {
  const pending = !failed && (position?.lane != null || ["attack", "ram"].includes(position?.action));
  const action = failed ? null : position?.action ?? null;
  const paceApplied = !failed && r.control !== "Out of Control";
  r.ai.diagnostics = {
    ...diagnostic,
    decisionId: s.events.length + 1,
    sign: r.signs.active,
    intended: { ...diagnostic.chosen, lane: position?.lane ?? null, target: position?.target ?? null },
    effective: { pace: failed ? null : r.pace, position: action, lane: failed ? null : position?.lane ?? null, target: failed ? null : position?.target ?? null },
    executed: { pace: paceApplied ? r.pace : null, position: pending ? null : action },
    physicalOutcome: {
      pace: { action: r.pace, status: paceApplied ? "Applied" : "Prevented", reason: failed ? "Driver error" : paceApplied ? null : "Out of control" },
      position: { action, status: failed ? "Prevented" : pending ? "Pending" : "Succeeded", lane: r.lane, reason: failed ? "Driver error" : null },
      movement: { status: r.blocked ? "Blocked" : "Not evaluated" },
    },
  };
  r.ai.diagnostics.compliance = compliance(r.ai.diagnostics, s.autonomous);
  emit(s, "AI_DECISION", [r.id], r.ai.diagnostics);
  return r.ai.diagnostics.decisionId;
}
export function resolveAction(s, r, decisionId, domain, succeeded, reason = null, details = {}) {
  const d = r?.ai.diagnostics;
  // Boundary/test commands have no decision link and must not rewrite an older
  // autonomous decision or a previous sign's reporting sample.
  if (!d || decisionId == null || d.decisionId !== decisionId) return;
  const outcome = domain === "movement"
    ? { status: succeeded ? "Moving" : "Blocked", reason, ...details }
    : { ...d.physicalOutcome[domain], status: succeeded ? (domain === "pace" ? "Applied" : "Succeeded") : "Prevented", reason, ...details };
  d.physicalOutcome[domain] = outcome;
  if (domain === "pace") d.executed.pace = succeeded ? d.effective.pace : null;
  if (domain === "position") d.executed.position = succeeded ? d.effective.position : null;
  d.compliance = compliance(d, s.autonomous);
  if (reason) d.reason = reason;
  emit(s, "AI_EXECUTION_RESULT", [r.id], {
    decisionId: d.decisionId, sign: d.sign, domain,
    effective: d.effective, executed: d.executed,
    physicalOutcome: d.physicalOutcome, compliance: d.compliance, reason: d.reason,
  });
}
