// Placeholder art lookup (Mack 2026-11-27). Art files are named
//   BNT_ART_<Kind>_<Nation>_<Ancestry>_<Sex>_<Role>_<NN>
// and any of the middle parts may be missing. For a character we keep only the
// files that do not contradict it, rank them by what they match (Role, then
// Ancestry, then Sex, then Nation) and pick among the best at random, stably
// per character. Humans from a nation where Human is not one of the two main
// peoples use the generic human files. Images come from the build
// (globalThis.__BNT_MEDIA__); without them every lookup returns null and the
// caller keeps its drawn placeholder. A character whose ancestry has no file
// gets a generic silhouette (BNT_ART_Portrait_Generic_<Sex>_NN).
import {AFFINITY_RULES} from '../../model/affinity.generated.js';
import {CATALOGS} from '../../career/m5/content.generated.js';

export const NATION_TOKENS = Object.freeze({N1: 'Northreach', N2: 'Frosthall', N3: 'Greenvale', N4: 'Ironhold', N5: 'Sundaran', N6: 'Karthen', N7: 'Velmora', N8: 'Zarashi'});
const GENERIC = new Set(['Generic', 'Genaric', 'Default', 'Any']);
const ROLES = {owner: 'Owner', driver: 'Driver', staff: 'Staff', specialist: 'Staff', trainer: 'Trainer', mechanic: 'Mechanic', bookmaker: 'Bookmaker'};
const token = s => String(s ?? '').replace(/[^A-Za-z]/g, '');
const ANCESTRY_TOKENS = Object.fromEntries(Object.entries(AFFINITY_RULES.ancestries).map(([id, label]) => [id, token(label)]));
const ANCESTRY_BY_TOKEN = Object.fromEntries(Object.entries(ANCESTRY_TOKENS).map(([id, t]) => [t.toLowerCase(), id]));
const NATION_BY_TOKEN = Object.fromEntries(Object.entries(NATION_TOKENS).map(([id, t]) => [t.toLowerCase(), id]));
const ROLE_TOKENS = new Set(Object.values(ROLES).map(r => r.toLowerCase()));

export function parseArtName(name) {
  const parts = String(name).replace(/\.[a-z0-9]+$/i, '').split('_');
  if (parts[0] !== 'BNT' || parts[1] !== 'ART' || parts.length < 3) return null;
  const out = {name, kind: parts[2], nation: null, generic: false, ancestry: null, sex: null, role: null, tags: []};
  for (const raw of parts.slice(3)) {
    const t = raw.toLowerCase();
    if (/^\d+$/.test(t)) continue;
    if (GENERIC.has(raw)) out.generic = true;
    else if (NATION_BY_TOKEN[t]) out.nation = NATION_BY_TOKEN[t];
    else if (ANCESTRY_BY_TOKEN[t]) out.ancestry = ANCESTRY_BY_TOKEN[t];
    else if (t === 'male' || t === 'female') out.sex = t;
    else if (ROLE_TOKENS.has(t)) out.role = t;
    else out.tags.push(t);
  }
  return out;
}

// Nations where Human is one of the two most common peoples.
const humanHome = nationId => {
  const rows = [...(CATALOGS.nation.find(n => n.canonicalNationId === nationId)?.ancestryWeights ?? [])].sort((a, b) => b.weight - a.weight);
  return rows.slice(0, 2).some(r => r.id === 'ancestry.a01');
};

const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; };
let catalog = null;
function files() {
  const media = globalThis.__BNT_MEDIA__;
  if (!media?.art) return [];
  if (!catalog) catalog = Object.keys(media.art).map(parseArtName).filter(Boolean);
  return catalog;
}

// who: {role, ancestry (A01..A13), sex ('male'|'female'), nation (N1..N8), key}
export function pickArt(kind, who = {}) {
  const role = who.role ? (ROLES[who.role] ?? who.role).toLowerCase() : null;
  let pool = files().filter(f => f.kind === kind
    && (!f.role || !role || f.role === role)
    && (!f.ancestry || !who.ancestry || f.ancestry === who.ancestry)
    && (!f.sex || !who.sex || f.sex === who.sex));
  if (kind === 'Portrait') {
    // Never borrow another people's face: with no file for the ancestry, use
    // the generic silhouettes (files that name no ancestry).
    if (who.ancestry) { const own = pool.filter(f => f.ancestry === who.ancestry); pool = own.length ? own : pool.filter(f => !f.ancestry); }
    if (who.ancestry === 'A01' && who.nation && !humanHome(who.nation)) {
      const generic = pool.filter(f => f.generic);
      if (generic.length) pool = generic;
    }
  }
  if (!pool.length) return null;
  const score = f => (role && f.role === role ? 8 : 0) + (who.ancestry && f.ancestry === who.ancestry ? 4 : 0) + (who.sex && f.sex === who.sex ? 2 : 0) + (who.nation && f.nation === who.nation ? 1 : 0);
  const best = Math.max(...pool.map(score)), top = pool.filter(f => score(f) === best).sort((a, b) => a.name < b.name ? -1 : 1);
  const chosen = top[hash(who.key ?? JSON.stringify(who)) % top.length];
  return {name: chosen.name, src: globalThis.__BNT_MEDIA__.art[chosen.name]};
}
export const portraitFor = who => pickArt('Portrait', who);
export const stableArt = who => pickArt('Stable', who);

// Pulls the facts a portrait needs from a saved career, for any person record.
export function personFacts(state, id, role) {
  if (state?.schema !== 8) return null;
  const p = state.m6.identities?.[id];
  const staff = state.m6.presentation?.staff?.[id];
  const ancestry = p?.ancestryId ?? staff?.ancestryId ?? null;
  const sexKnown = state.m6.driverVisuals?.[id]?.sex ?? staff?.sex ?? p?.authored?.sex ?? null;
  const sex = sexKnown ?? (hash('sex:' + id) % 2 ? 'female' : 'male');
  return {role, ancestry, sex, nation: p?.originNationId ?? p?.residentNationId ?? null, key: id};
}
export function ownerFacts(state) {
  const o = state?.m6?.owner;
  return o ? {role: 'owner', ancestry: o.ancestry, sex: o.sex, nation: o.nationality, key: 'owner:' + o.ancestry + o.sex + o.nationality} : null;
}
export function ownerDraftFacts(o) { return {role: 'owner', ancestry: o.ancestry, sex: o.sex, nation: o.nationality, key: 'owner:' + o.ancestry + o.sex + o.nationality}; }
// An <img> for a picked portrait, or '' when none fits.
export function portraitImg(who, cls = 'bt-portrait-img', alt = '') {
  const art = who && portraitFor(who);
  return art ? `<img class="${cls}" src="${art.src}" alt="${String(alt).replace(/"/g, '&quot;')}" data-art="${art.name}" loading="lazy" decoding="async">` : '';
}
