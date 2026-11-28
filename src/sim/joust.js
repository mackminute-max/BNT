// Jousting (Phase 4c, Mack 2026-11-27): a 1v1 duel on a narrow dumbbell track.
// Both turnouts run the same loop half a lap apart, so they meet head-on along
// the two long straights, either side of the centre partition. Attacks land only
// across the partition. The joust runs until one turnout is wrecked; if both are
// still standing at the time limit, the less battered turnout wins on points.
// A course whose id starts with "joust-" and a field of two make a joust.
import { coursePoint, makeCircuit } from "../track/course.js";
import { location } from "../track/oval.js";

export const JOUST_RULES = "bnt-joust-v1";
export const JOUST_TIME = 420; // seconds before the stewards call it on points
export const JOUST_REACH = 20; // metres between turnouts across the partition
export const JOUST_PREFIX = "joust-";
export const JOUST_BLOW = 1.3; // a lance blow across the partition hits harder than a whip
export const JOUST_EAGERNESS = 6; // a jouster lowers the lance whenever the rival is in reach
export const JOUST_SPACING = 0.45; // share of a lap a turnout may not close below

export const isJoust = (s) => !!s.track?.course && String(s.track.id ?? "").startsWith(JOUST_PREFIX) && s.entrants.length === 2;
export const joustCourseId = (id) => String(id ?? "").startsWith(JOUST_PREFIX);

// The arena: two 194 m straights with a 6 m partition between the inner lanes,
// joined by bulbs at each end. Lane 3 (the innermost) runs along the partition.
export function joustCourse(id = "joust-arena", name = "Jousting Lists") {
  const L = 200, D = 30, a = 60, b = 20;
  return makeCircuit(JOUST_PREFIX + String(id).replace(/^joust-/, ""), name,
    [[0, 0], [L, 0], [L + a, -b], [L + a, D + b], [L, D], [0, D], [-a, D + b], [-a, -b]],
    [20, 20, 20, 20, 20, 20, 20, 20]);
}

// Starting places: the innermost lane, half a lap apart, both on a straight.
// Each starts at the near end of its straight, so the first pass comes after a run-up.
export function joustGrid(t, c) {
  const lane = c.lanes - 1, half = Math.floor(t.cells / 2), first = t.segments[0].id;
  let q = -1;
  for (let at = -2; at > -half; at--) if (location(at, lane, c, t).segment === first && location(at - 1, lane, c, t).segment !== first) { q = at; break; }
  return [{ lane, q }, { lane, q: q - half }];
}

// Across the partition: both on (different) straights and close enough to strike.
export function acrossPartition(s, a, b) {
  const la = location(a.q, a.lane, s.config, s.track), lb = location(b.q, b.lane, s.config, s.track);
  if (la.type !== "straight" || lb.type !== "straight" || la.segment === lb.segment) return false;
  const pa = coursePoint(a.q, a.lane, s.config, s.track), pb = coursePoint(b.q, b.lane, s.config, s.track);
  return Math.hypot(pa.x - pb.x, pa.y - pb.y) <= JOUST_REACH;
}

// How battered a turnout is: driver, chariot and the beasts' average condition.
export const joustHealth = (r) => r.ru.driver.condition + r.ru.chariot.condition +
  r.ru.beasts.reduce((n, b) => n + b.condition, 0) / Math.max(1, r.ru.beasts.length);

// Called each tick. Returns the decision, or null while the joust goes on.
export function joustVerdict(s) {
  if (!isJoust(s) || s.entrants.some((r) => r.finishTime !== null)) return null;
  const [a, b] = s.entrants, standing = [a, b].filter((r) => r.status === "Racing" && r.physical === "Live");
  if (standing.length === 1) return { winner: standing[0], loser: standing[0] === a ? b : a, reason: "wreck" };
  if (standing.length === 0) return { winner: null, loser: null, reason: "double" };
  if (s.time >= JOUST_TIME) {
    const ha = joustHealth(a), hb = joustHealth(b), winner = ha === hb ? (a.id < b.id ? a : b) : ha > hb ? a : b;
    return { winner, loser: winner === a ? b : a, reason: "points" };
  }
  return null;
}
