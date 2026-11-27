// Grudges (Phase 4): a turnout that holds a grudge against another values
// attacking it more, so grudge holders go hunting for each other in Combat races.
export const GRUDGE_RULES = 'bnt-grudges-v1';
export const GRUDGE_VALUE = 2;
export function validateGrudge(g) {
  if (g === undefined) return;
  if (!g || g.rules !== GRUDGE_RULES || Object.keys(g).sort().join(',') !== 'rules,targets' || !Array.isArray(g.targets) || !g.targets.length || g.targets.length > 12 || g.targets.some(t => typeof t !== 'string')) throw Error('Invalid grudge context');
}
export function grudgeValue(r, o, value) {
  if (r.grudgeContext?.targets.includes(o.id)) value.features.grudge = GRUDGE_VALUE;
  return value;
}
// Hunting: a grudge holder pushes to close on its target and steers toward its lane.
export const HUNT_VALUE = 0.3;
export function huntTerms(r, candidates, targets, range) {
  if (!targets.length) return;
  const t = targets.reduce((a, b) => Math.abs(b.gap) < Math.abs(a.gap) ? b : a);
  for (const c of candidates) {
    let v = 0;
    if (t.gap > 0 && ['Push', 'Sprint'].includes(c.action)) v = HUNT_VALUE * (c.action === 'Sprint' && t.gap > range ? 1 : .6);
    else if (t.gap < 0 && Math.abs(t.gap) < range && c.action === 'Maintain') v = HUNT_VALUE * .5;
    else if (Math.abs(t.gap) <= range && c.lane !== null && c.lane !== undefined && ['inward', 'outward'].includes(c.action)) v = Math.abs(c.lane - t.lane) < Math.abs(r.lane - t.lane) ? HUNT_VALUE : 0;
    else if (Math.abs(t.gap) <= range && c.action === 'hold' && Math.abs(r.lane - t.lane) <= 1) v = HUNT_VALUE * .5;
    if (!v) continue;
    c.terms.hunt = v;
    c.score = Object.values(c.terms).reduce((a, b) => a + b, 0);
  }
}
// Who hit whom, and who finished whom, for the career layer.
export function combatLedger(s) {
  const hits = new Map(), last = new Map(), wrecks = [];
  for (const e of s.events) {
    if (e.type === 'ATTACK' && e.effects?.success) {
      const k = e.effects.attacker + '>' + e.effects.defender;
      hits.set(k, (hits.get(k) ?? 0) + 1);
      last.set(e.effects.defender, e.effects.attacker);
    } else if (e.type === 'RU_RETIRED') {
      const id = e.participants[0];
      if (id) wrecks.push([id, last.get(id) ?? null]);
    }
  }
  return {rules: GRUDGE_RULES, hits: [...hits].map(([k, n]) => [...k.split('>'), n]).sort((a, b) => (a[0] + a[1]).localeCompare(b[0] + b[1])), wrecks};
}
