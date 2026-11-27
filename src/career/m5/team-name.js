import {CATALOGS as C} from './content.generated.js';
// Generated teams are named "<root> <ending> of <family>". On track only the
// ending is shown ("Blue Standards"); if two teams in a field share an ending,
// their root is kept so the labels stay distinct. Generic endings ("Racing
// House", "Trail Club") keep their root too, since alone they read as a type.
const GENERIC = /^Racing |^Road Collegium$|^Stone Circuit$|^Wheel Circle$| Club$/;
const ENDINGS = [...new Set(C.culturalNaming.flatMap(c => c.organizationEndings ?? []))].sort((a, b) => b.length - a.length);
function parts(name) {
  const base = String(name).replace(/ of [^ ].*$/, '');
  const ending = ENDINGS.find(e => base.endsWith(' ' + e));
  return {base, ending: ending && !GENERIC.test(ending) ? ending : base};
}
export function trackNames(names) {
  const p = names.map(n => n == null ? null : parts(n)), count = {};
  for (const x of p) if (x) count[x.ending] = (count[x.ending] ?? 0) + 1;
  return p.map(x => x == null ? null : count[x.ending] > 1 ? x.base : x.ending);
}
