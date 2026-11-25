import {m6Entrant,abilityRequest} from '../sim/m6-interaction.js';
import {BUFFERED_SIGN_ACTION,requestDelay} from './buffered-signs.js';
import { emit } from "../events/events.js";
export const signs = [
  "Push the Pace",
  "Conserve Strength",
  "Seek Open Track",
  "Race Defensively",
  "Engage Rivals",
  "Hold Position",
];
export function signCommand(s, cmd) {
  const r = s.entrants.find((r) => r.id === s.playerId);
  const reject = (reason) => {
    emit(s, "SIGN_REJECTED", [s.playerId], { reason });
    return false;
  };
  if (!r || r.status !== "Racing") return reject("Player is not racing");
  if(cmd.action==='ability'){if(abilityRequest(s,r))return true;return reject('Active Ability unavailable');}if(cmd.action===BUFFERED_SIGN_ACTION&&m6Entrant(r))return reject('M6 Signs use the next simulation tick');
  if(cmd.action===BUFFERED_SIGN_ACTION){try{const proof=requestDelay(s,r,cmd.sign);emit(s,"SIGN_DELAY_REQUESTED",[r.id],proof);return true;}catch(error){return reject(error.message);}}
  if (cmd.action === "queue") {
    if (
      !signs.includes(cmd.sign) ||
      (cmd.sign === "Engage Rivals" && s.format === "Pure")
    )
      return reject("Sign illegal for format");
    if(m6Entrant(r)&&(r.signs.active===cmd.sign&&!r.signs.pending||r.signs.pending===cmd.sign)){emit(s,'SIGN_UNCHANGED',[r.id],{sign:cmd.sign,remaining:r.signs.remaining});return true;}
    if (!r.signs.remaining) return reject("No sign uses remaining");
    r.signs.remaining--;
    r.signs.pending = cmd.sign;
    emit(s, "SIGN_QUEUED", [r.id], {
      sign: cmd.sign,
      remaining: r.signs.remaining,
    });
  } else if (cmd.action === "cancel") {
    r.signs.pending = null;
    emit(s, "SIGN_CANCELED", [r.id], { remaining: r.signs.remaining });
  } else if (cmd.action === "lower") {
    r.signs.active = null;if(m6Entrant(r))r.signs.pending=null;
    r.ai.nextDecision = s.tick;
    emit(s, "SIGN_LOWERED", [r.id]);
  } else return reject("Unknown sign action");
  return true;
}
export function activateSign(s, r, metadata = null) {
  if (r.status !== "Racing" || !r.signs.pending) return;if(m6Entrant(r)&&metadata?.m6Boundary!==true)return;
  r.signs.active = r.signs.pending;
  r.signs.pending = null;
  r.ai.nextDecision = s.tick;
  emit(s, "SIGN_ACTIVATED", [r.id], { sign: r.signs.active, ...(metadata??{}) });
}
export function signPreference(sign, action, c) {
  if (sign === "Push the Pace")
    return ["Push", "Sprint"].includes(action) ? c.signPush : 0;
  if (sign === "Conserve Strength")
    return action === "Conserve" ? c.signConserve : 0;
  if (sign === "Seek Open Track")
    return ["inward", "outward", "overtake"].includes(action) ? c.signOpen : 0;
  if (sign === "Race Defensively")
    return [
      "Conserve",
      "avoid",
      "yield",
      "hold",
      "defendCombat",
      "disengage",
    ].includes(action)
      ? c.signDefensive
      : 0;
  if (sign === "Hold Position")
    return ["hold", "defend", "Maintain"].includes(action) ? c.signHold : 0;
  if (sign === "Engage Rivals")
    return ["attack", "ram"].includes(action) ? c.signEngage : 0;
  return 0;
}
