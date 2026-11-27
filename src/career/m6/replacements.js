// Mack 2026-11-27: when a rival team is eliminated (can no longer start), a newly
// generated AI team takes its place, so the field stays full. Replacements stop
// before the Semifinal (second to last race) and the Championship (last race).
// The eliminated team keeps its points in the standings; the new team starts on 0.
import {hash} from '../../core/determinism.js';
import {teamProfile,freezeTeam,displayIdentity,profileNames} from '../m5/d2/generation.js';
import {initialCondition} from '../championships/condition.js';
import {refreshPresentationMetadata} from './presentation.js';

export const REPLACEMENT_RULES = 'p3-rival-replacements-v1';
// Is a replacement allowed for the race at `nextIndex`? Never for the last two races.
export const replacementWindow = (x, nextIndex) => nextIndex < x.offer.value.schedule.length - 2;
export const replacementCount = x => (x.m6?.replacements ?? []).length;

export function replaceEliminatedRivals(s, x, nextIndex, eligibilityFor) {
  if (!x.m6 || s.schema !== 8 || !replacementWindow(x, nextIndex)) return [];
  const out = x.eligibility.filter(r => !r.mayStart && r.entrantId !== x.playerId && !(x.m6.replacements ?? []).some(p => p.outId === r.entrantId));
  if (!out.length) return [];
  const m = s.m6, nationId = x.m6.nationId, tier = (x.economicContextId === 'iron-gauntlet' ? 'thunder-crown' : x.economicContextId);
  const used = [...Object.values(m.identities).map(p => p.name), ...Object.values(m.rivals).flatMap(p => p.organizations.flatMap(profileNames)), ...Object.values(x.m6.names).flatMap(n => [n.organization, n.driver, ...(n.beasts ?? []), n.chariot].filter(Boolean))];
  const added = [];
  x.m6.replacements ??= [];
  for (const r of out) {
    const context = [s.career.id, 'm6-replacement', x.id, nextIndex, r.entrantId];
    const p = teamProfile(s.career.id, tier, context, {nationId, usedNames: used});
    const id = 'e2-' + hash([REPLACEMENT_RULES, x.id, nextIndex, r.entrantId]).toString(16);
    const e = freezeTeam(p, id, 'replacement');
    x.entrants.push(e);
    x.m6.names[id] = {...displayIdentity(p), organizationId: p.id, memberIds: p.memberIds, kind: 'replacement'};
    if (x.m5Identities) x.m5Identities[id] = structuredClone(x.m6.names[id]);
    x.conditionState[id] = initialCondition(e, s);
    used.push(...profileNames(p));
    x.m6.replacements.push({outId: r.entrantId, inId: id, raceIndex: nextIndex, reason: r.reason});
    added.push(id);
  }
  x.eligibility = eligibilityFor(s, x);
  if (s.m6.presentation !== undefined) refreshPresentationMetadata(s);
  return added;
}
