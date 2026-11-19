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
// Bounded caches contain only pure encodings/key orders, never validation results.
const quotedStrings=new Map(),sortedShapes=new Map();
function quote(text){
  if(text.length>128)return JSON.stringify(text);
  const old=quotedStrings.get(text);if(old!==undefined)return old;
  const encoded=JSON.stringify(text);if(quotedStrings.size>=2048)quotedStrings.clear();quotedStrings.set(text,encoded);return encoded;
}
function sortedKeys(value){
  const keys=Object.keys(value);
  if(keys.length>64||keys.some(k=>k.length>128))return keys.sort();
  const signature=JSON.stringify(keys),old=sortedShapes.get(signature);if(old)return old;
  const sorted=keys.sort();if(sortedShapes.size>=256)sortedShapes.clear();sortedShapes.set(signature,sorted);return sorted;
}
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${sortedKeys(value).map((k) => `${quote(k)}:${canonical(value[k])}`).join(",")}}`;
  return typeof value==='string'?quote(value):JSON.stringify(value);
}
export function checksum(value) {
  return hash(canonical(value)).toString(16).padStart(8, "0");
}
export const byId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
export const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
