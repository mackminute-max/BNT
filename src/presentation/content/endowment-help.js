// Player-facing explanations for Endowment tags and the small icons that stand
// for Endowments on the race screen (Mack 2026-11-27: clickable tooltips that
// also explain how things connect, such as Boon styles and their capstones).
import {CAPSTONES, CAPSTONE_AT, RARITY, STYLES} from '../../sim/endowments.js';

const STYLE_FEEL = {
  Bruiser: 'hits harder and wins fights',
  Speedster: 'goes faster and gets away',
  Stayer: 'soaks up punishment and outlasts the field',
  Schemer: 'handles better and uses its Boons more often',
};
const pct = n => Math.round((n - 1) * 100) + '%';

const SUPPLY_HELP = {
  'Beast Conditioning': 'Improves your beasts for the rest of this Series.',
  'Chariot Improvements': 'Strengthens or repairs your chariot for the rest of this Series.',
  'Driver Development': 'Improves your driver for the rest of this Series.',
  Equipment: 'Buys or upgrades equipment for your turnout at a discount.',
  'Racing Insights': 'Race knowledge that improves how your turnout performs.',
  'Support and Recovery': 'Restores condition or eases fatigue right away.',
  'Trading Opportunities': 'A deal: Gold now or a discounted purchase.',
};

// counts: {Bruiser: n, ...} of Boons already held this Series, when known.
export function tagHelp(tag, counts = null) {
  const t = String(tag).trim();
  const style = STYLES.find(st => t === st + ' Boon');
  if (style) {
    const cap = CAPSTONES[style], have = counts?.[style] ?? null;
    return `${style} Boons make a turnout that ${STYLE_FEEL[style]}. A Boon lasts for the rest of this Series and fires on its own in every race when its moment comes. `
      + `Hold ${CAPSTONE_AT} ${style} Boons to unlock the ${cap.name} capstone: ${cap.text}`
      + (have !== null ? ` You hold ${have} of ${CAPSTONE_AT}.` : '');
  }
  if (Object.hasOwn(RARITY, t)) {
    return `Rarity sets a Boon's strength. Common is base strength, Rare is ${pct(RARITY.Rare)} stronger and Epic is ${pct(RARITY.Epic)} stronger. Blood Pact Boons always come one rarity higher.`;
  }
  if (t === 'upgrade') return 'You already hold this Boon. Taking it again raises its level, which makes it stronger.';
  if (t === 'Active Ability') return 'You trigger an Active Ability yourself from the Strategy panel during a race, once per race. You have 3 ability slots. Taking an ability you already hold upgrades it to II, then III: stronger and longer lasting.';
  if (t === 'Supplies') return 'Supplies are practical help for your turnout: stat improvements, repairs, recovery and equipment. They last until the Series ends. Caps still apply.';
  if (t === 'Purse' || t === 'banked') return 'Gold Endowments go into the Series Purse at double value. You collect the Purse only if you finish the Series. Withdraw or get knocked out and it is lost.';
  if (t === 'Blood Pact') return 'A Blood Pact is a Boon one rarity stronger than usual, paid for in blood: your driver and both beasts lose condition the moment you take it. You cannot take one if your team is already badly hurt.';
  if (t === 'Treatment') return 'Instead of an Endowment, pay Gold to heal an injury or repair your chariot. Use it to save a run when your turnout could not otherwise start the next race.';
  if (t === 'Capstone') return `A capstone is an always-on bonus for holding ${CAPSTONE_AT} Boons of one style. Butcher (Bruiser), Quicksilver (Speedster), Ironclad (Stayer), Mastermind (Schemer).`;
  if (SUPPLY_HELP[t]) return SUPPLY_HELP[t];
  return null;
}

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// A tag that opens its explanation when clicked (see presentation/frame/tips.js).
// Terms are small chips, not game buttons (Mack 2026-11-27): a span, so the
// game's button styling never applies to them.
export function tagButton(tag, counts = null, extraClass = '') {
  const help = tagHelp(tag, counts);
  return help
    ? `<span role="button" tabindex="0" class="bt-tag ${extraClass}" data-tip="${esc(help)}" aria-label="${esc(tag)}: what this means">${esc(tag)}</span>`
    : `<span class="bt-tag bt-tag-plain ${extraClass}">${esc(tag)}</span>`;
}
export function categoryTags(category, counts = null) {
  return String(category ?? '').split(' · ').filter(Boolean).map(t => tagButton(t, counts)).join('');
}

// 24x24 placeholder icons, plain SVG so final art can replace them later.
const PATHS = {
  Bruiser: '<path d="M4 20 15 9M9 4l11 11M14 4l6 6-2 2-6-6zM4 14l6 6-2 2-6-6z" stroke-width="2"/>',
  Speedster: '<path d="M13 2 5 13h6l-1 9 9-12h-6z"/>',
  Stayer: '<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/>',
  Schemer: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3" fill="#1d1410"/>',
  ability: '<path d="m12 2 2.6 6.6L21 9l-5 4.6L17.5 21 12 17.3 6.5 21 8 13.6 3 9l6.4-.4z"/>',
  supplies: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10" stroke="#1d1410" stroke-width="1.5" fill="none"/>',
  purse: '<path d="M8 4h8l-2 3h-4zM6 9h12c2 3 3 6 3 8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3c0-2 1-5 3-8z"/>',
  capstone: '<path d="M3 18h18l-1.5-10-4.5 4-3-7-3 7-4.5-4z"/>',
};
const COLORS = {Bruiser: '#d2483a', Speedster: '#f2c14e', Stayer: '#6aa7d8', Schemer: '#a77bd6', ability: '#ffb347', supplies: '#9bc27a', purse: '#e6c35c', capstone: '#ffd166'};
export function endowmentIcon(key) {
  const k = PATHS[key] ? key : 'supplies', c = COLORS[k];
  const strokeOnly = k === 'Bruiser';
  return `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" ${strokeOnly ? `fill="none" stroke="${c}" stroke-linecap="round"` : `fill="${c}"`}>${PATHS[k]}</svg>`;
}
// Which icon an Endowment definition uses.
export function iconKey(d) {
  if (d?.kind === 'boon') return d.style ?? 'Stayer';
  if (d?.kind === 'ability') return 'ability';
  if (d?.kind === 'gold' || /purse/i.test(d?.category ?? '')) return 'purse';
  return 'supplies';
}
