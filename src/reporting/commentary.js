import { hash } from "../core/determinism.js";
const templates = {
  RACE_STARTED: () => [
    "And they’re away! The field launches from the standing grid.",
    "The signal is given—Blood and Thunder is under way!",
  ],
  OVERTAKE: (e) => [
    `${e.effects.passer} gets ahead of ${e.effects.passed}!`,
    `${e.effects.passer} moves past ${e.effects.passed} in the order.`,
  ],
  LEAD_CHANGED: (e) => [`${e.effects.leader} takes the lead!`],
  CONTACT: (e) => [`Contact between ${e.participants.join(" and ")}!`],
  ATTACK: (e) => [
    `${e.effects.attacker} against ${e.effects.defender}: ${e.effects.action} ${e.effects.success ? "connects" : "is resisted"}.`,
  ],
  DAMAGE: (e) => [
    `${e.participants[0]} takes ${e.effects.amount.toFixed(1)} damage to ${e.effects.component}.`,
  ],
  CONTROL_CHANGED: (e) => [
    `${e.participants[0]} is ${e.effects.control.toLowerCase()}.`,
  ],
  RU_RETIRED: (e) => [`${e.participants[0]} is out: ${e.effects.reason}.`],
  WRECK_CREATED: (e) => [
    `${e.participants[0]} remains on the track as a stationary wreck.`,
  ],
  WRECK_IMPACT: (e) => [`Another impact at the wreck of ${e.effects.wreckId}.`],
  INCIDENT: (e) => [
    `A ${e.effects.type} intrusion obstructs lane ${e.effects.lane + 1}!`,
  ],
  INCIDENT_CLEARED: () => ["The temporary track obstruction has cleared."],
  SIGN_ACTIVATED: (e) => [
    `${e.participants[0]} receives the sign: ${e.effects.sign}.`,
  ],
  COURSE_ENTERED: e => [`${e.participants[0]} is away on ${e.effects.track}.`],
  SEGMENT_ENTERED: e => [`${e.participants[0]} reaches ${e.effects.terrain}${e.effects.type === "turn" ? ", turning " + (e.effects.direction > 0 ? "right" : "left") : " straightaway"}.`],
  CHECKPOINT_CROSSED: e => [`${e.participants[0]} sweeps through checkpoint ${e.effects.checkpoint}.`],
  FINAL_LAP: (e) => [`${e.participants[0]} begins the final lap!`],
  RU_FINISHED: (e) => [
    `${e.participants[0]} crosses the finish in ${e.effects.time.toFixed(4)} seconds!`,
  ],
  RU_EXITED: (e) => [`${e.participants[0]} has safely cleared the track exit.`],
  RACE_STALLED: () => [
    "Race control ends the stalled race. Unfinished entries receive no finish time.",
  ],
  RACE_ENDED: () => ["The race is over. The official classification is ready."],
  INTEGRITY_ERROR: () => [
    "Race stopped: an integrity diagnostic requires attention.",
  ],
};
const priority = new Set([
  "RU_FINISHED",
  "RU_RETIRED",
  "WRECK_CREATED",
  "FINAL_LAP",
  "LEAD_CHANGED",
  "RACE_ENDED",
  "RACE_STALLED",
  "SIGN_ACTIVATED",
  "CHECKPOINT_CROSSED",
  "INTEGRITY_ERROR",
]);
export class Commentary {
  constructor() {
    this.cursor = 0;
    this.lines = [];
    this.last = new Map();
  }
  consumeBatch(events, options={}){this.cursor=0;const lines=this.consume(events,options);this.cursor=0;return lines;}
  consume(events, { enabled = true } = {}) {
    for (const e of events.slice(this.cursor)) {
      const directive=e.type==='AI_DECISION'?e.effects.directive:null;if(enabled&&directive?.decision==='Resisting'&&!e.effects.executionError&&!e.effects.stressError){const key='directive-refusal:'+e.participants[0];if(e.time-(this.last.get(key)??-Infinity)>=8){this.lines.push({eventId:e.id,time:e.time,type:'DIRECTIVE_RESISTANCE',text:`${e.participants[0]} resists ${directive.sign}, choosing ${directive.selected}: ${directive.reason}.`});this.last.set(key,e.time);}continue;}
      if (!enabled || !templates[e.type]) continue;
      const key = e.type === "SEGMENT_ENTERED" ? e.type : `${e.type}:${e.participants.join(",")}`;
      if (
        !priority.has(e.type) &&
        e.time - (this.last.get(key) ?? -Infinity) < (e.type === "SEGMENT_ENTERED" ? 3 : 1)
      )
        continue;
      const options = templates[e.type](e);
      this.lines.push({
        eventId: e.id,
        time: e.time,
        type: e.type,
        text: options[hash(`${e.id}:${e.type}`) % options.length],
      });
      this.last.set(key, e.time);
    }
    this.cursor = events.length;
    return this.lines;
  }
}
export function narrative(events) {
  return new Commentary().consume(events);
}
