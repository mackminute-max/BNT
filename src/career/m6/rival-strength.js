// Rival strength by Series tier (balance pass, 2026-11-27).
// Simulated Series showed a new flat-50 turnout winning about 40% of 4-car
// Dustroad races against rivals as generated (fair share is 25%), before any
// Endowments or Strategies. Rivals in Dustroad Series after the intro Cup are
// raised so an even fight is the starting point; the intro Cup stays gentle.
// Higher tiers already field rivals above the starting turnout.
export const RIVAL_STRENGTH_RULES = 'm6-rival-strength-v1';
export const TIER_OFFSET = Object.freeze({dustroad: 4});
const FIXED = new Set(['condition', 'strain', 'fatigue', 'wear', 'weight', 'capacity']);
export function seriesIsIntro(x, d = null) {
  return [x?.m6?.type, x?.m6?.competition?.type, d?.m6?.type].includes('intro') || [d?.templateId, x?.offer?.value?.templateId].includes('m6-intro');
}
export function toughenRival(native, tier, intro = false) {
  const offset = intro ? 0 : TIER_OFFSET[tier] ?? 0;
  if (!offset || !native) return native;
  for (const part of [native.driver, ...(native.beasts ?? []), native.chariot]) {
    if (!part) continue;
    for (const [k, v] of Object.entries(part)) if (typeof v === 'number' && !FIXED.has(k)) part[k] = Math.max(0, Math.min(100, v + offset));
  }
  return native;
}
