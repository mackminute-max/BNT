// Scout reports (systems phase, Market): every driver, beast and chariot shows
// its strengths, its style fit (Bruiser, Speedster, Stayer, Schemer) and one
// quirk. Everything here is read from the real ratings and temperament, so the
// report never promises a hidden bonus.
const LABEL = {
  driving: 'Driving', beastHandling: 'Beast handling', combat: 'Combat', awareness: 'Awareness', nerve: 'Nerve',
  speed: 'Speed', power: 'Power', agility: 'Agility', endurance: 'Endurance', discipline: 'Discipline', toughness: 'Toughness',
  stability: 'Stability', durability: 'Durability', protection: 'Protection', rollingEfficiency: 'Rolling efficiency', maneuverability: 'Maneuverability',
};
const STYLES = {
  driver: {Bruiser: ['combat', 'nerve'], Speedster: ['driving', 'beastHandling'], Stayer: ['awareness', 'beastHandling'], Schemer: ['awareness', 'driving']},
  beast: {Bruiser: ['power', 'toughness'], Speedster: ['speed', 'agility'], Stayer: ['endurance', 'discipline']},
  chariot: {Bruiser: ['protection', 'durability'], Speedster: ['rollingEfficiency', 'maneuverability'], Stayer: ['durability', 'stability']},
};
export const STYLE_HINT = Object.freeze({
  Bruiser: 'Built for Combat races and Engage Rivals.',
  Speedster: 'Built to Push the Pace and break away.',
  Stayer: 'Built to Conserve Strength and finish strong.',
  Schemer: 'Built to Ride the Slipstream and pick the moment.',
});
const QUIRKS = {
  aggression: [70, 'Hothead', 'Goes for hits and gaps that others leave alone.'],
  caution: [70, 'Careful', 'Backs off in traffic and tight corners.'],
  patience: [70, 'Patient', 'Happy to sit and wait for the finish.'],
  opportunism: [70, 'Opportunist', 'Pounces on any opening.'],
  staminaManagement: [70, 'Saver', 'Spares the beasts early.'],
  tacticalDiscipline: [70, 'By the book', 'Sticks to the called Strategy.'],
};
const LOW_QUIRK = {
  speed: ['Plodder', 'Slow on the straights.'], power: ['Light pull', 'Struggles out of corners.'], agility: ['Wide turner', 'Loses ground in the bends.'],
  endurance: ['Fades late', 'Tires before the finish.'], discipline: ['Skittish', 'Hard to keep in line.'], toughness: ['Fragile', 'Hurts easily in a wreck.'],
  stability: ['Twitchy', 'Unsettled at speed.'], durability: ['Brittle', 'Wears out fast.'], protection: ['Thin-walled', 'Little shelter in a hit.'],
  rollingEfficiency: ['Heavy roller', 'Drags on long straights.'], maneuverability: ['Stiff', 'Slow to change lanes.'],
  driving: ['Raw', 'Loose on the racing line.'], beastHandling: ['Heavy hands', 'Beasts fight the reins.'], combat: ['Gentle', 'Rarely lands a hit.'],
  awareness: ['Tunnel vision', 'Misses what is coming from behind.'], nerve: ['Jumpy', 'Rattled by close racing.'],
};
const kindOf = k => ({driver: 'driver', personnel: 'driver', beast: 'beast', beasts: 'beast', chariot: 'chariot', chariots: 'chariot'})[k] ?? null;

export function scoutReport(kind, attributes, personality = null) {
  const k = kindOf(kind);
  if (!k || !attributes) return null;
  const entries = Object.entries(attributes).filter(([, v]) => Number.isFinite(v)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (!entries.length) return null;
  const avg = (keys) => keys.reduce((n, key) => n + (attributes[key] ?? 0), 0) / keys.length;
  let style = Object.entries(STYLES[k]).map(([name, keys]) => [name, avg(keys)]).sort((a, b) => b[1] - a[1])[0][0];
  if (k === 'driver' && personality && (personality.opportunism ?? 0) + (personality.tacticalDiscipline ?? 0) >= 140) style = 'Schemer';
  const strengths = entries.slice(0, 2).map(([key, v]) => `${LABEL[key] ?? key} ${Math.round(v)}`);
  const [lowKey, lowV] = entries.at(-1);
  let quirk = null;
  if (personality) {
    const top = Object.entries(personality).filter(([key, v]) => QUIRKS[key] && v >= QUIRKS[key][0]).sort((a, b) => b[1] - a[1])[0];
    if (top) quirk = {name: QUIRKS[top[0]][1], text: QUIRKS[top[0]][2]};
  }
  if (!quirk && LOW_QUIRK[lowKey]) quirk = {name: LOW_QUIRK[lowKey][0], text: LOW_QUIRK[lowKey][1]};
  return {style, hint: STYLE_HINT[style], strengths, weakness: `${LABEL[lowKey] ?? lowKey} ${Math.round(lowV)}`, quirk};
}

export function scoutHtml(kind, attributes, personality, esc) {
  const r = scoutReport(kind, attributes, personality);
  if (!r) return '';
  return `<div class="bt-scout"><p><span class="bt-style bt-style-${r.style.toLowerCase()}">${esc(r.style)}</span> <small>${esc(r.hint)}</small></p><p><strong>Strong:</strong> ${esc(r.strengths.join(', '))} · <strong>Weak:</strong> ${esc(r.weakness)}</p>${r.quirk ? `<p><strong>Quirk: ${esc(r.quirk.name)}.</strong> ${esc(r.quirk.text)}</p>` : ''}</div>`;
}
export const SCOUT_CSS = `.bt-scout{border-top:1px solid rgba(201,167,90,.35);margin-top:4px;padding-top:4px}.bt-scout p{margin:2px 0}
.bt-style{display:inline-block;padding:1px 8px;font-weight:bold;letter-spacing:.04em;text-transform:uppercase;font-size:.8em;border:1px solid currentColor}
.bt-style-bruiser{color:#e0715a}.bt-style-speedster{color:#e8c15a}.bt-style-stayer{color:#8fc98a}.bt-style-schemer{color:#9fb7e4}`;
