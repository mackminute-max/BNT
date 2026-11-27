// Game frame behaviour for the management screens: navigation pictograms and
// centred contextual sub-tabs, so each destination fits one fixed screen
// instead of a long scrolling page. Presentation only; no game state is read
// or changed here.
import {icon} from './art.js';

// Sub-tab groups per destination, matched against each panel's heading.
// Panels that match nothing join the first tab, so no function is ever hidden.
const GROUPS = {
  overview: [['Overview', /stable progress/i, '.m3ui-identity,.hs-stats'], ['Legacy', /legacy/i, '#m4-legacy'], ['Career Highlights', /accomplishment|highlight/i]],
  roster: [['Turnout', /active racing unit|turnout/i], ['Owned Roster', /owned roster|roster/i]],
  gambling: [['Race Book', /race book|spectator/i], ['Bones', /^bones$/i], ['Beast Pit', /beast pit/i]],
  workshop: [['Facilities', /facilit/i], ['Workshop', /workshop|engineering|training/i]],
  services: [['Recovery & Services', /recovery|service|care|repair/i], ['Work Review', /work review/i]],
  championships: [['Active Series', /active|standings|schedule|next race|current|reward|endowment/i], ['Available Series', /your turnout|national championships|series|events|details|registration|loadout/i], ['Last Event', /last event|result/i]],
};
// Destinations where each headed panel simply becomes its own tab.
const PER_HEADING = new Set(['world', 'records', 'finances', 'facilities']);

// Market cards are split by asset type, matching the Market tabs in the interface bible.
const CARD_KINDS = ['Drivers', 'Draft Beasts', 'Chariots', 'Equipment'];
function cardKind(card) {
  const t = (card.querySelector('.a1-card-head small')?.textContent ?? '').toLowerCase();
  return /beast/.test(t) ? 'Draft Beasts' : /chariot/.test(t) ? 'Chariots' : /equipment/.test(t) ? 'Equipment' : 'Drivers';
}

const headingOf = el => (el.matches('h2,h3') ? el : el.querySelector('h2,h3'))?.textContent.trim() ?? '';
const visible = el => !el.hidden && el.tagName !== 'SCRIPT' && el.tagName !== 'TEMPLATE';

function grouping(page, children) {
  const rules = GROUPS[page];
  if (rules) {
    const groups = rules.map(([name]) => ({name, items: []}));
    for (const el of children) {
      const h = headingOf(el);
      // A panel may name its tab explicitly, so a renamed heading (for example a
      // Series name) can never drop it into the wrong tab.
      const tagged = el.dataset?.btTab ? rules.findIndex(([name]) => name === el.dataset.btTab) : -1;
      let i = tagged >= 0 ? tagged : rules.findIndex(([, re, sel]) => (sel && el.matches(sel)) || (h && re.test(h)));
      if (i < 0) i = 0;
      groups[i].items.push(el);
    }
    return groups.filter(g => g.items.length);
  }
  if (PER_HEADING.has(page)) {
    const groups = [];
    for (const el of children) {
      const h = headingOf(el);
      if (h && el.matches('section,article,div') && h.length < 48) groups.push({name: h, items: [el], hidden: el.hasAttribute('data-bt-hidden-tab')});
      else if (groups.length) groups.at(-1).items.push(el);
      else groups.push({name: 'Overview', items: [el]});
    }
    return groups.length > 1 && groups.filter(g => !g.hidden).length <= 10 ? groups : [];
  }
  return [];
}

export function installFrame() {
  const remembered = new Map(), signatures = new Map(), focuses = new Map();
  let observer = null, bar = null, applying = false, attachedTo = null;

  function decorateNav(nav) {
    for (const b of nav.querySelectorAll('button')) {
      if (b.querySelector('.bt-ico')) continue;
      const key = b.dataset.page ?? (b.id === 'hs-practice-button' ? 'practice' : null);
      if (key) b.insertAdjacentHTML('afterbegin', icon(key));
    }
  }

  function apply() {
    const content = document.getElementById('hs-content'), nav = document.getElementById('hs-nav');
    if (!content || !nav || applying) return;
    applying = true;
    try {
      decorateNav(nav);
      const page = nav.querySelector('[aria-current=true]')?.dataset.page ?? 'overview';
      const children = [...content.children].filter(visible);
      for (const el of children) el.removeAttribute('data-bt-off');
      for (const el of content.querySelectorAll('.a1-card[data-bt-off]')) el.removeAttribute('data-bt-off');
      const market = page === 'markets' && content.querySelector('#m4-ordinary-market');
      const cards = market ? [...market.querySelectorAll('.a1-card')] : [];
      const groups = content.hidden ? [] : market
        ? CARD_KINDS.map(name => ({name, items: cards.filter(c => cardKind(c) === name)})).filter(g => g.items.length)
        : grouping(page, children);
      if (!bar) {
        bar = document.createElement('nav');
        bar.id = 'bt-subtabs';
        bar.setAttribute('aria-label', 'Section tabs');
        nav.after(bar);
      }
      if (groups.length < 2) { bar.replaceChildren(); return; }
      // When the set of tabs changes (for example a championship becomes active),
      // start again on the first tab, which holds the most current content.
      const signature = groups.map(g => g.name).join('|');
      let active = signatures.get(page) === signature ? remembered.get(page) : groups[0].name;
      signatures.set(page, signature);
      // The panel holding the next action carries data-bt-focus. When that action
      // changes (race finished, Endowment chosen, Series ended), show its tab.
      const focusEl = content.querySelector('[data-bt-focus]');
      const focusKey = focusEl?.dataset.btFocus ?? null;
      let jumped = false;
      if (focusKey && focuses.get(page) !== focusKey) {
        const g = groups.find(g => g.items.some(el => el === focusEl || el.contains(focusEl)));
        if (g) { active = g.name; jumped = true; }
      }
      focuses.set(page, focusKey);
      if (!groups.some(g => g.name === active)) active = groups[0].name;
      remembered.set(page, active);
      // Pages can open a tab directly (the Racing Nations map opens a nation's page).
      globalThis.__btShowTab = name => { if (!groups.some(g => g.name === name)) return; remembered.set(page, name); apply(); content.scrollTop = 0; };
      bar.replaceChildren(...groups.filter(g => !g.hidden || g.name === active).map(g => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = g.name;
        b.className = g.name === active ? 'bt-active' : '';
        b.setAttribute('aria-pressed', String(g.name === active));
        b.onclick = () => { remembered.set(page, g.name); apply(); content.scrollTop = 0; };
        return b;
      }));
      for (const g of groups) if (g.name !== active) for (const el of g.items) el.setAttribute('data-bt-off', '');
      if (jumped) content.scrollTop = 0;
    } finally {
      applying = false;
    }
  }

  function attach() {
    const content = document.getElementById('hs-content'), nav = document.getElementById('hs-nav');
    if (!content || !nav || content === attachedTo) return;
    observer?.disconnect();
    attachedTo = content;
    bar = document.getElementById('bt-subtabs');
    observer = new MutationObserver(() => queueMicrotask(apply));
    observer.observe(content, {childList: true, subtree: true});
    observer.observe(nav, {attributes: true, subtree: true, attributeFilter: ['aria-current'], childList: true});
    // A section jump from elsewhere (for example "Legacy Upgrades in the Market")
    // must not land on a hidden tab: reveal whichever tab holds the focused panel.
    content.addEventListener('focusin', e => {
      const off = e.target.closest('[data-bt-off]');
      if (!off) return;
      const page = nav.querySelector('[aria-current=true]')?.dataset.page ?? 'overview';
      const group = grouping(page, [...content.children].filter(visible)).find(g => g.items.includes(off));
      if (group) { remembered.set(page, group.name); apply(); }
    });
    apply();
  }

  // The management screen can be mounted (or remounted) after start-up.
  new MutationObserver(attach).observe(document.body, {childList: true});
  attach();
  return {apply};
}
