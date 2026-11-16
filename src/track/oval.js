import { ovalPresets, resolveCatalog } from "./catalog.js";
import { compileCourse, courseLocation, coursePoint } from "./course.js";
import { surfaceDefaults } from "./surfaces.js";
export { surfaceDefaults, surfaceRules } from "./surfaces.js";
export const mod = (n, d) => ((n % d) + d) % d;
export function track(c, definition = null) {
  definition = resolveCatalog(definition);
  const ovalId = typeof definition === "string" && Object.hasOwn(ovalPresets, definition) ? definition : null;
  if (ovalId) definition = null;
  if (definition !== null && definition !== undefined && definition !== "oval") return compileCourse(definition, c);
  const segments = [
    { id: "north", type: "straight", tiles: c.straightTiles, direction: 0 },
    { id: "east", type: "turn", tiles: c.turnTiles, direction: 1 },
    { id: "south", type: "straight", tiles: c.straightTiles, direction: 0 },
    { id: "west", type: "turn", tiles: c.turnTiles, direction: 1 },
  ];
  let start = 0;
  for (const s of segments) {
    s.start = start;
    start += s.tiles;
    s.surface = { ...surfaceDefaults };
  }
  return { segments, cells: start, lanes: c.lanes, ...(ovalId && ovalId !== "oval" ? { ovalId, name: ovalPresets[ovalId].name } : {}) };
}
export function location(q, lane, c, t) {
  if (t.course) return courseLocation(q, lane, c, t);
  const tile = mod(Math.floor(q) + Math.floor(c.straightTiles / 2), t.cells);
  const s = t.segments.find((s) => tile >= s.start && tile < s.start + s.tiles);
  const radius = c.innerRadius + lane * c.laneWidth;
  return {
    tile,
    segment: s.id,
    type: s.type,
    radius: s.type === "turn" ? radius : Infinity,
    length:
      s.type === "turn"
        ? (Math.PI * radius) / s.tiles
        : c.straightLength / s.tiles,
    surface: s.surface,
  };
}
export function lapLength(lane, c) {
  return (
    c.straightLength * 2 + Math.PI * 2 * (c.innerRadius + lane * c.laneWidth)
  );
}
export function key(q, lane, t) {
  return `${lane}:${t.course && !t.closed ? Math.floor(q) : mod(Math.floor(q), t.cells)}`;
}
export function nextDistance(ru, c, t) {
  return (Math.floor(ru.q) + 1 - ru.q) * location(ru.q, ru.lane, c, t).length;
}
// Drawing coordinates share segment/angle mapping with authoritative lane geometry.
export function point(q, lane, c, t) {
  if (t.course) return coursePoint(q, lane, c, t);
  const x = mod(q + Math.floor(c.straightTiles / 2), t.cells),
    n = c.straightTiles,
    k = c.turnTiles;
  const r = c.innerRadius + lane * c.laneWidth,
    l = c.straightLength;
  if (x < n) return { x: (x / n) * l, y: -r };
  if (x < n + k) {
    const a = -Math.PI / 2 + ((x - n) / k) * Math.PI;
    return { x: l + r * Math.cos(a), y: r * Math.sin(a) };
  }
  if (x < 2 * n + k) return { x: l * (1 - (x - n - k) / n), y: r };
  const a = Math.PI / 2 + ((x - 2 * n - k) / k) * Math.PI;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
}

// All spatial consumers use the same topology; open courses never alias endpoints.
export function gap(from, to, t) {
  return t.course && !t.closed ? to - from : mod(to - from + t.cells / 2, t.cells) - t.cells / 2;
}
export function forwardGap(from, to, t) {
  return t.course && !t.closed ? to - from : mod(to - from, t.cells);
}
export function finishQ(s) { return s.track.course && !s.track.closed ? s.track.cells : s.config.laps * s.track.cells; }
