// Strategy cards in the race view (Mack 2026-11-27): styled like the main nav
// buttons (same shape and font) in a steel-blue colorway so they never read as
// navigation (Mack 2026-11-27), each with an icon and its gain and cost in plain words.
import {STRATEGIES} from '../../sim/strategies.js';

const PATHS = {
  flame: 'M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 1.6-4.8 3-6.3.1 2.2 1.1 3.4 2.3 3.6C10.5 8 11.4 5 12 2z',
  leaf: 'M20 4C10 4 4 9 4 16c0 1.5.3 2.8.8 4l1.6-1.6C9 14 13 11 17 9.5 13 12 9.6 15 7.6 19.4 9 20 10.4 20 12 20c6 0 8-7 8-16z',
  arrows: 'M4 11h11.2l-3.6-3.6L13 6l6 6-6 6-1.4-1.4 3.6-3.6H4zM4 4h2v16H4z',
  wind: 'M3 8h10a3 3 0 1 0-3-3h2a1 1 0 1 1 1 1H3zm0 4h15a3 3 0 1 1-3 3h2a1 1 0 1 0 1-1H3zm0 4h8v2H3z',
  wall: 'M2 5h20v4H2zm0 5h9v4H2zm11 0h9v4h-9zM2 15h20v4H2z',
  shield: 'M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z',
  swords: 'M3 3h4l9 9-2 2-9-9zm18 0v4l-9 9-2-2 9-9zM4 17l3-3 3 3-3 3H4zm16 0v3h-3l-3-3 3-3z',
  anchor: 'M11 2h2v3.2a3 3 0 1 1-2 0zm1 5a1 1 0 1 0 0-.1zM11 9h2v11c3 0 5-2 5.6-4H16l3-4 3 4h-1.4c-.8 3.6-4.6 6-8.6 6h-2c-4 0-7.8-2.4-8.6-6H1l3-4 3 4H5.4C6 18 8 20 11 20z',
  ban: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 6.3 12.9L7.1 5.7A8 8 0 0 1 12 4zM5.7 7.1l11.2 11.2A8 8 0 0 1 5.7 7.1z',
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6z',
};
export const strategyIcon = key => PATHS[key] ? `<svg class="bt-strat-ico" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="${PATHS[key]}"/></svg>` : '';

export function decorateCard(card) {
  if (!card || card.dataset.decorated) return;
  const label = card.firstElementChild, name = label?.textContent.trim();
  const st = STRATEGIES[name];
  const key = st?.icon ?? (card.id === 'm6-no-sign' ? 'ban' : card.id === 'm6-active-ability' || card.classList.contains('m6-ability-card') ? 'bolt' : null);
  if (!key) return;
  card.dataset.decorated = '1';
  label.insertAdjacentHTML('afterbegin', strategyIcon(key));
  if (st) {
    const fx = document.createElement('span');
    fx.className = 'bt-strat-fx';
    fx.innerHTML = `<span class="bt-strat-gain">▲ ${st.gain}</span><span class="bt-strat-cost">▼ ${st.cost}</span>`;
    card.insertBefore(fx, card.lastElementChild);
    card.title = st.job;
  } else if (card.id === 'm6-no-sign') {
    const fx = document.createElement('span');
    fx.className = 'bt-strat-fx';
    fx.innerHTML = '<span class="bt-strat-gain">Driver races on instinct</span><span class="bt-strat-cost">No gain, no cost</span>';
    card.insertBefore(fx, card.lastElementChild);
  }
}
export function decorateStrategyCards(root) {
  if (!root) return;
  for (const card of root.children) decorateCard(card);
  new MutationObserver(() => { for (const card of root.children) decorateCard(card); }).observe(root, {childList: true});
}

export const STRATEGY_CSS = `
.p21 #p2SignChoices,#p2SignChoices{display:grid;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:6px!important}
#p2SignChoices button.p2-sign-card{height:auto!important;min-height:86px!important;display:flex!important;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:3px;padding:6px 8px!important;
 background:linear-gradient(180deg,#24475c 0%,#17323f 60%,#0e1f28 100%)!important;border:2px solid #9fb7c4!important;border-radius:0!important;color:#f3e9d6!important;text-align:left;
 clip-path:polygon(0 7px,7px 0,calc(100% - 7px) 0,100% 7px,100% calc(100% - 7px),calc(100% - 7px) 100%,7px 100%,0 calc(100% - 7px))!important}
#p2SignChoices button.p2-sign-card>span:first-child{display:flex;align-items:center;gap:6px;font-family:var(--bt-display,'Bangers',sans-serif)!important;font-weight:400!important;font-size:17px!important;letter-spacing:.04em;line-height:1.05;text-transform:uppercase;color:#fff}
#p2SignChoices .bt-strat-ico{width:20px;height:20px;flex:none;fill:#e6f2f8}
#p2SignChoices .bt-strat-fx{display:flex;flex-direction:column;gap:1px;font:500 11.5px/1.25 system-ui,sans-serif}
#p2SignChoices .bt-strat-gain{color:#b9e7a5}
#p2SignChoices .bt-strat-cost{color:#ffb0a3}
#p2SignChoices button.p2-sign-card>small{margin-top:auto;font:600 11px/1.2 system-ui,sans-serif;color:#e9d3a8;opacity:.9}
#p2SignChoices button.p2-sign-card[data-active=true]{background:linear-gradient(180deg,#ffd666,#f2b91f 60%,#c98f10)!important;border-color:#fff1c2!important;box-shadow:none!important}
#p2SignChoices button.p2-sign-card[data-active=true],#p2SignChoices button.p2-sign-card[data-active=true]>span:first-child,#p2SignChoices button.p2-sign-card[data-active=true] .bt-strat-fx span,#p2SignChoices button.p2-sign-card[data-active=true]>small{color:#1d1410!important}
#p2SignChoices button.p2-sign-card[data-active=true] .bt-strat-ico{fill:#1d1410}
#p2SignChoices button.p2-sign-card[data-queued=true]:not([data-active=true]){border:2px dashed #ffc94a!important}
#p2SignChoices button.p2-sign-card:hover:enabled:not([data-active=true]){background:linear-gradient(180deg,#2f5d77,#1e4253 60%,#132b36)!important;border-color:#ffc94a!important}
#p2SignChoices button.p2-sign-card:disabled{filter:grayscale(.85) brightness(.7);cursor:not-allowed}
@media (max-width:1100px){.p21 #p2SignChoices,#p2SignChoices{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
@media (max-width:700px){.p21 #p2SignChoices,#p2SignChoices{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
`;
