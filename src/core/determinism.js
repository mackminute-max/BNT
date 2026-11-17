// Keyed random draws isolate systems and entrants from iteration order.
export function hash(text) {
  let h = 2166136261;
  for (const c of String(text)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  return (h ^ (h >>> 16)) >>> 0;
}
export function random(seed, ...key) {
  return hash(JSON.stringify([seed, ...key])) / 4294967296;
}
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.keys(value)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
export function checksum(value) {
  return hash(canonical(value)).toString(16).padStart(8, "0");
}
export const byId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
export const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
