// Stable emblems: plain two-colour SVG on a 48x48 grid. They stay vector so
// they can later sit on top of PNG banners and other artwork (Mack 2026-11-27).
// The field uses the primary colour and the charge uses the secondary colour.
export const EMBLEM_SHAPES = Object.freeze({
  wheel: (p, s) => `<circle cx="24" cy="24" r="14.5" fill="none" stroke="${s}" stroke-width="3.5"/><circle cx="24" cy="24" r="4.5" fill="${s}"/><g stroke="${s}" stroke-width="2.6" stroke-linecap="round"><path d="M24 10v9.5M24 28.5V38M10 24h9.5M28.5 24H38M14 14l6.7 6.7M27.3 27.3 34 34M14 34l6.7-6.7M27.3 20.7 34 14"/></g>`,
  shield: (p, s) => `<path d="M12 9h24v13.5c0 8.6-5.6 14.6-12 17.5-6.4-2.9-12-8.9-12-17.5z" fill="${s}"/><path d="M16.5 19.5 24 26l7.5-6.5" fill="none" stroke="${p}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>`,
  bolt: (p, s) => `<path d="M28.5 5 12.5 27h10l-3 16 16.5-22.5h-10.5L30 5z" fill="${s}" stroke="${s}" stroke-width="1" stroke-linejoin="round"/>`,
  crown: (p, s) => `<path d="M9 33.5 7.5 15.5l8.5 7.5L24 11l8 12 8.5-7.5-1.5 18z" fill="${s}" stroke="${s}" stroke-width="1.2" stroke-linejoin="round"/><rect x="9" y="35.5" width="30" height="4.5" rx="1.5" fill="${s}"/><circle cx="24" cy="27" r="2.6" fill="${p}"/>`,
  skull: (p, s) => `<path d="M24 8c-8.3 0-14 6-14 13.6 0 5 2.7 8.4 6 9.8V37a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5.6c3.3-1.4 6-4.8 6-9.8C38 14 32.3 8 24 8z" fill="${s}"/><circle cx="18.6" cy="22.5" r="3.8" fill="${p}"/><circle cx="29.4" cy="22.5" r="3.8" fill="${p}"/><path d="M24 27.2 21.8 31h4.4z" fill="${p}"/><path d="M20 34.5v4.5M24 34.5v4.5M28 34.5v4.5" stroke="${p}" stroke-width="1.6"/>`,
  flame: (p, s) => `<path d="M24.5 5c1.6 7.4 11 10.6 11 21.5a11.5 11.5 0 0 1-23 0c0-5.6 3-9 5.4-11.8.2 4.3 2.2 6.6 4.4 7-1.4-6.6 1-12 2.2-16.7z" fill="${s}"/><path d="M24 25c.8 3.6 5 5 5 9.3a5 5 0 0 1-10 0c0-2.6 1.4-4 2.6-5.3.3 1.8 1.2 2.6 2 2.7-.5-2.6.1-4.6.4-6.7z" fill="${p}"/>`,
  star: (p, s) => `<path d="m24 6 5.3 11.6 12.7 1.3-9.5 8.6 2.7 12.5L24 33.6 12.8 40l2.7-12.5L6 18.9l12.7-1.3z" fill="${s}" stroke="${s}" stroke-width="1" stroke-linejoin="round"/>`,
  sun: (p, s) => `<circle cx="24" cy="24" r="8" fill="${s}"/><g fill="${s}"><path d="m24 4 3 8h-6zM24 44l-3-8h6zM4 24l8-3v6zM44 24l-8 3v-6zM9.9 9.9l7.8 3.5-4.3 4.3zM38.1 38.1l-7.8-3.5 4.3-4.3zM9.9 38.1l3.5-7.8 4.3 4.3zM38.1 9.9l-3.5 7.8-4.3-4.3z"/></g>`,
  hammer: (p, s) => `<rect x="11" y="9" width="26" height="10" rx="2" fill="${s}"/><rect x="21.5" y="19" width="5" height="21" rx="1.5" fill="${s}"/><path d="M15 14h18" stroke="${p}" stroke-width="1.6"/>`,
  horseshoe: (p, s) => `<path d="M12 9h7v14.5a5 5 0 0 0 10 0V9h7v14.5a12 12 0 0 1-24 0z" fill="${s}"/><g fill="${p}"><circle cx="15.5" cy="13" r="1.4"/><circle cx="15.5" cy="19" r="1.4"/><circle cx="32.5" cy="13" r="1.4"/><circle cx="32.5" cy="19" r="1.4"/><circle cx="17.5" cy="28.5" r="1.4"/><circle cx="30.5" cy="28.5" r="1.4"/></g>`,
  moon: (p, s) => `<path d="M30 7.5a17 17 0 1 0 0 33 13.5 13.5 0 1 1 0-33z" fill="${s}"/><path d="m33.5 15 1.3 2.8 3 .3-2.3 2 .7 3-2.7-1.6-2.7 1.6.7-3-2.3-2 3-.3z" fill="${s}"/>`,
  tower: (p, s) => `<path d="M12 9h5v4h4V9h6v4h4V9h5v9l-3 3v14l3 3v3H12v-3l3-3V21l-3-3z" fill="${s}"/><path d="M21 41v-7a3 3 0 0 1 6 0v7z" fill="${p}"/><rect x="22.5" y="22" width="3" height="6" rx="1.5" fill="${p}"/>`,
  spears: (p, s) => `<g stroke="${s}" stroke-width="3" stroke-linecap="round"><path d="M13 40 33.5 13M35 40 14.5 13"/></g><path d="M36.5 6.5 37 16l-6.3-4.2z" fill="${s}"/><path d="M11.5 6.5 11 16l6.3-4.2z" fill="${s}"/>`,
});

export function emblemSvg(emblem, primary, secondary, {title = null} = {}) {
  const shape = EMBLEM_SHAPES[emblem];
  if (!shape || !/^#[a-f0-9]{6}$/.test(primary) || !/^#[a-f0-9]{6}$/.test(secondary)) return '';
  return `<svg viewBox="0 0 48 48" ${title ? `role="img" aria-label="${title}"` : 'aria-hidden="true"'} style="background:${primary};color:${secondary}"><rect x="1" y="1" width="46" height="46" rx="7" fill="${primary}" stroke="${secondary}" stroke-width="1.5" stroke-opacity=".55"/><g stroke="none">${shape(primary, secondary)}</g></svg>`;
}
