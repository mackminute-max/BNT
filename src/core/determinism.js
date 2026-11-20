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

// Coarse shape lookup avoids JSON-encoding the complete key list on every
// streaming visit. The complete current ordered key list is always compared;
// the coarse key is never authority. Only property names/order are cached.
const streamShapes = new Map();
function streamingKeys(value) {
  const keys = Object.keys(value);
  if (keys.length > 64 || keys.some(key => key.length > 128)) return keys.sort();
  const signature = `${keys.length}:${keys[0] ?? ''}`;
  const old = streamShapes.get(signature);
  if (old) {
    let matches = true;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== old.ordered[i]) { matches = false; break; }
    }
    if (matches) return old.sorted;
  }
  const sorted = keys.slice().sort();
  if (streamShapes.size >= 256) streamShapes.clear();
  streamShapes.set(signature, { ordered: keys, sorted });
  return sorted;
}

// The same canonical character stream without constructing a full snapshot string.
// Deliberately no object/value cache: events and externally supplied snapshots may
// be mutable. Only bounded pure key/quote encodings above are cached.
export function writeCanonical(value, write, arraySlot = false) {
  if (Array.isArray(value)) {
    write('[');
    const length = value.length;
    for (let i = 0; i < length; i++) {
      if (i) write(',');
      // map(...).join(',') in canonical emits empty slots for holes/undefined.
      if (i in value) writeCanonical(value[i], write, true);
    }
    write(']');
  } else if (value && typeof value === 'object') {
    write('{');
    const keys = streamingKeys(value);
    for (let i = 0; i < keys.length; i++) {
      if (i) write(',');
      const key = keys[i];
      write(quote(key));
      write(':');
      writeCanonical(value[key], write);
    }
    write('}');
  } else {
    const encoded = typeof value === 'string' ? quote(value) : JSON.stringify(value);
    if (encoded !== undefined) write(encoded);
    else if (!arraySlot) write('undefined');
  }
}
// Fold with a local integer accumulator. A captured writer accumulator makes
// Chromium's hot character loop significantly slower; no callback per token.
function foldText(h, text) {
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    h = Math.imul(h ^ code, 16777619);
    // Match for...of + charCodeAt(0), including valid surrogate pairs.
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      const next = text.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) i++;
    }
  }
  return h;
}
function foldCanonical(value, h, arraySlot = false) {
  if (Array.isArray(value)) {
    h = Math.imul(h ^ 91, 16777619);
    const length = value.length;
    for (let i = 0; i < length; i++) {
      if (i) h = Math.imul(h ^ 44, 16777619);
      if (i in value) h = foldCanonical(value[i], h, true);
    }
    return Math.imul(h ^ 93, 16777619);
  }
  if (value && typeof value === 'object') {
    h = Math.imul(h ^ 123, 16777619);
    const keys = streamingKeys(value);
    for (let i = 0; i < keys.length; i++) {
      if (i) h = Math.imul(h ^ 44, 16777619);
      const key = keys[i];
      h = foldText(h, quote(key));
      h = Math.imul(h ^ 58, 16777619);
      h = foldCanonical(value[key], h);
    }
    return Math.imul(h ^ 125, 16777619);
  }
  const encoded = typeof value === 'string' ? quote(value) : JSON.stringify(value);
  return encoded !== undefined ? foldText(h, encoded) : arraySlot ? h : foldText(h, 'undefined');
}
export function streamingChecksum(value) {
  let h = foldCanonical(value, 2166136261);
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  return ((h ^ (h >>> 16)) >>> 0).toString(16).padStart(8, '0');
}
