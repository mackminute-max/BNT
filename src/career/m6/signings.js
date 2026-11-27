// Rival signings (systems phase, decision 2a): rivals shop in the same Market.
// When a Series closes, the drivers and beasts you passed on stay in a small
// pool. Local rival teams in your next Series sign any of them that would be an
// upgrade, so a recruit you skipped can turn up racing against you.
const POOL = 6, HISTORY = 8;
const sum = a => Object.values(a).reduce((n, v) => n + (Number.isFinite(v) ? v : 0), 0);
const avgOf = (o, keys) => keys.reduce((n, k) => n + (o[k] ?? 0), 0) / keys.length;

// Called just before the home market renews.
export function rememberPassed(s) {
  const m = s.m6, offers = Object.values(s.management.registries.marketOffers).filter(o => o.available && ['driver', 'beast'].includes(o.category) && !m.market.regional?.offers?.[o.id]);
  const pool = offers.map(o => {
    const p = m.identities[o.id];
    return p && {category: o.category, name: p.name, attributes: structuredClone(o.template.attributes), personality: p.personality ? structuredClone(p.personality) : null, ancestryId: p.ancestryId ?? null, speciesId: p.speciesId ?? null};
  }).filter(Boolean).sort((a, b) => sum(b.attributes) - sum(a.attributes) || a.name.localeCompare(b.name)).slice(0, POOL);
  m.signings = {version: 1, pool, history: m.signings?.history ?? []};
}

// Called for each local rival team as a Series is frozen.
export function signFromPool(s, x, entrant, names, usedNames) {
  const sg = s.m6.signings;
  if (!sg?.pool.length) return;
  const n = entrant.native, signed = [];
  const di = sg.pool.findIndex(c => c.category === 'driver' && !usedNames.includes(c.name) && avgOf(c.attributes, Object.keys(c.attributes)) > avgOf(n.driver, Object.keys(c.attributes)));
  if (di >= 0) {
    const c = sg.pool.splice(di, 1)[0];
    Object.assign(n.driver, c.attributes);
    if (c.personality && n.driver.personality) n.driver.personality = c.personality;
    names.driver = c.name;
    if (c.ancestryId) names.ancestryId = c.ancestryId;
    signed.push(c.name);
  }
  n.beasts.forEach((b, i) => {
    const bi = sg.pool.findIndex(c => c.category === 'beast' && c.speciesId === names.speciesId && !usedNames.includes(c.name) && avgOf(c.attributes, Object.keys(c.attributes)) > avgOf(b, Object.keys(c.attributes)));
    if (bi < 0) return;
    const c = sg.pool.splice(bi, 1)[0];
    Object.assign(b, c.attributes);
    names.beasts[i] = c.name;
    signed.push(c.name);
  });
  if (!signed.length) return;
  names.signed = signed;
  usedNames.push(...signed);
  for (const name of signed) sg.history.unshift({name, team: names.organization, series: x.offer.value.name});
  sg.history = sg.history.slice(0, HISTORY);
}

export function validateSignings(s) {
  const g = s.m6.signings;
  if (g === undefined) return;
  if (!g || g.version !== 1 || !Array.isArray(g.pool) || g.pool.length > POOL || !Array.isArray(g.history) || g.history.length > HISTORY) throw Error('Invalid rival signings');
  for (const c of g.pool) if (!['driver', 'beast'].includes(c.category) || typeof c.name !== 'string' || c.name.length > 100 || !c.attributes || typeof c.attributes !== 'object') throw Error('Invalid rival signing');
  for (const h of g.history) if ([h.name, h.team, h.series].some(t => typeof t !== 'string' || t.length > 120)) throw Error('Invalid rival signing history');
}
