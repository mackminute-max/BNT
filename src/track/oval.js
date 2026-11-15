export const mod = (n, d) => ((n % d) + d) % d;
export function track(c) {
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
    s.surface = { grip: 1, roughness: 0, rollingResistance: 1 };
  }
  return { segments, cells: start, lanes: c.lanes };
}
export function location(q, lane, c, t) {
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
  return `${lane}:${mod(Math.floor(q), t.cells)}`;
}
export function nextDistance(ru, c, t) {
  return (Math.floor(ru.q) + 1 - ru.q) * location(ru.q, ru.lane, c, t).length;
}
// Drawing coordinates share segment/angle mapping with authoritative lane geometry.
export function point(q, lane, c, t) {
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
