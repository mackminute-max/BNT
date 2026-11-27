// Placeholder art for the game frame. Everything here is drawn in code so the
// prototype stays one offline file; owner-supplied artwork replaces it later.
const LIGHTNING = '<svg viewBox="0 0 200 24" aria-hidden="true"><path d="M0 14 L120 10 L112 4 L200 12 L84 16 L92 22 Z" fill="#FFBC19" stroke="#3a1a02" stroke-width="2"/></svg>';

/** Placeholder wordmark: red BLOOD & above gold THUNDER with a lightning underline. */
export const logo = (extra = '') => `<span class="bt-logo ${extra}" role="img" aria-label="Blood and Thunder"><span class="bt-blood">Blood &amp;</span><span class="bt-thunder">Thunder</span>${LIGHTNING}</span>`;

/** A ram-drawn chariot silhouette, facing right, roughly 220 x 90 units. */
export function chariot(x, y, s = 1, fill = '#1a0c10') {
  const ram = dx => `<g transform="translate(${dx} 0)"><ellipse cx="0" cy="40" rx="26" ry="13"/><path d="M-20 48l-4 22h5l5-18zM16 48l4 22h5l-3-22z"/><path d="M18 34c6-14 16-18 24-12l-4 10c-4-2-8 0-10 6z"/><circle cx="34" cy="22" r="8" fill="none" stroke="${fill}" stroke-width="5"/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">${ram(150)}${ram(110)}<path d="M40 44h70v4H40z"/><path d="M6 20h40l-6 34H2z"/><circle cx="22" cy="62" r="22" fill="none" stroke="${fill}" stroke-width="6"/><path d="M22 40v44M0 62h44M7 47l30 30M7 77l30-30" stroke="${fill}" stroke-width="3"/><path d="M24 20c-2-12 2-20 8-22 6 0 8 6 6 12l10 10-4 4-8-6z"/><path d="M36 6l34 26" stroke="${fill}" stroke-width="3"/></g>`;
}

/** Splash scene: arena silhouette and a charging chariot across the horizon. */
export function splashScene() {
  return `<svg class="bt-splash-scene" viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <path d="M0 260 Q400 200 800 230 T1600 220 V420 H0Z" fill="#3b0f24"/>
  <g fill="#2a0a1c">${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 104}" y="${170 + (i % 3) * 14}" width="70" height="120"/><rect x="${i * 104 + 24}" y="${110 + (i % 3) * 14}" width="4" height="64"/><path d="M${i * 104 + 28} ${112 + (i % 3) * 14}h34l-8 10 8 10h-34z" fill="#a61924"/>`).join('')}</g>
  <path d="M0 300 Q800 250 1600 300 V420 H0Z" fill="#1a0610"/>
  ${chariot(1080, 205, 1.5, '#0e0408')}
  <text x="20" y="410" fill="#ffffff55" font-family="Helvetica,Arial" font-size="13" letter-spacing="3">PLACEHOLDER ART</text></svg>`;
}

/** Main menu scene: race-day preparations at a track. */
export function menuScene() {
  const flags = Array.from({ length: 14 }, (_, i) => { const x = 60 + i * 110, c = ['#a61924', '#FFBC19', '#2f5d3a', '#24476b'][i % 4]; return `<rect x="${x}" y="150" width="4" height="70" fill="#4a2f1c"/><path d="M${x + 4} 152h34l-9 11 9 11h-34z" fill="${c}"/>`; }).join('');
  const crowd = Array.from({ length: 90 }, (_, i) => `<circle cx="${(i * 37) % 1600 + 10}" cy="${235 + (i % 4) * 14}" r="6" fill="${['#6b4a3a', '#8a5a40', '#a67c52', '#5a3a2e'][i % 4]}"/>`).join('');
  return `<svg class="bt-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs><linearGradient id="btSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b6fa3"/><stop offset=".55" stop-color="#9cc6e0"/><stop offset="1" stop-color="#f1d9a0"/></linearGradient>
  <linearGradient id="btDirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c89a63"/><stop offset="1" stop-color="#8a5f37"/></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#btSky)"/>
  <path d="M0 260 Q300 170 600 230 T1200 200 T1600 230 V330 H0Z" fill="#5f7d4a"/>
  <g fill="#7d6a5a"><rect x="980" y="120" width="40" height="110"/><rect x="1040" y="90" width="50" height="140"/><rect x="1110" y="130" width="36" height="100"/><path d="M1040 90l25-36 25 36z" fill="#a61924"/><path d="M980 120l20-28 20 28z" fill="#a61924"/></g>
  <rect x="0" y="220" width="1600" height="90" fill="#6d4a2f"/>${crowd}
  <rect x="0" y="300" width="1600" height="16" fill="#3a2415"/>${flags}
  <path d="M0 330 H1600 V900 H0Z" fill="url(#btDirt)"/>
  <path d="M0 420 Q800 360 1600 430" stroke="#f4e3c0" stroke-width="6" fill="none" opacity=".5"/>
  <g><rect x="120" y="470" width="300" height="20" fill="#5a3320"/><path d="M100 470l170-80 170 80z" fill="#a61924"/><path d="M130 470l140-62 140 62z" fill="#FFBC19" opacity=".35"/><rect x="130" y="490" width="10" height="150" fill="#3a2415"/><rect x="400" y="490" width="10" height="150" fill="#3a2415"/>
  <rect x="160" y="560" width="210" height="80" fill="#4a2f1c"/><ellipse cx="200" cy="560" rx="26" ry="10" fill="#7a5233"/><ellipse cx="320" cy="560" rx="26" ry="10" fill="#7a5233"/></g>
  ${chariot(720, 520, 2.2, '#2a1410')}
  <g fill="#3a2015"><circle cx="1330" cy="560" r="20"/><path d="M1308 580h44l10 90h-64z"/><circle cx="1430" cy="600" r="18"/><path d="M1412 618h36l6 60h-48z"/></g>
  <g fill="#6b4a2c" stroke="#3a2415" stroke-width="5"><ellipse cx="1450" cy="790" rx="70" ry="22"/><rect x="1380" y="790" width="140" height="110"/><ellipse cx="1300" cy="830" rx="55" ry="18"/><rect x="1245" y="830" width="110" height="80"/></g>
  <text x="1580" y="885" text-anchor="end" fill="#00000088" font-family="Helvetica,Arial" font-size="15" letter-spacing="3">PLACEHOLDER ART</text></svg>`;
}

/** Small footer strip for New Career: a gold chariot silhouette on a dark band. */
export const footerChariot = () => `<svg class="bt-footer-art" viewBox="0 0 600 50" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${chariot(200, 2, .5, '#B88742')}</svg>`;

/** Placeholder homeland landscape coloured from a nation palette. */
export function nationArt(nation) {
  const [sky, hill, accent] = NATION_COLORS[nation] ?? ['#466', '#354', '#a61924'];
  return `<svg class="bt-nation-art" viewBox="0 0 600 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="600" height="180" fill="${sky}"/><path d="M0 120 Q120 60 240 110 T480 90 T600 110 V180 H0Z" fill="${hill}"/><path d="M0 150 Q200 120 400 145 T600 140 V180 H0Z" fill="#00000040"/><g fill="${accent}"><rect x="420" y="50" width="6" height="70"/><path d="M426 52h40l-10 13 10 13h-40z"/></g><text x="590" y="172" text-anchor="end" fill="#ffffff99" font-family="Helvetica,Arial" font-size="10" letter-spacing="2">PLACEHOLDER ART</text></svg>`;
}

/** Placeholder owner portrait; silhouettes vary a little by ancestry and sex. */
export function portrait(ancestry, sex, index = 0) {
  const tone = ['#c99b77', '#7f9a5a', '#a7a7b3', '#c08a68', '#b07a58', '#d2a684', '#d9b28f', '#e5c7a4', '#9cc2b8', '#d8ab86', '#6f9550', '#b5523d', '#6c8f6a'][Number(String(ancestry).slice(1)) - 1] ?? '#c99b77';
  const cloth = ['#a61924', '#2f5d3a', '#24476b', '#633018', '#5a2a6b'][index % 5];
  const hair = sex === 'female' ? '<path d="M58 50c0-26 84-26 84 0v60h-14V60H72v50H58z" fill="#3a2415"/>' : '<path d="M62 48c4-20 72-20 76 0v8H62z" fill="#3a2415"/>';
  const ears = ['A07', 'A08', 'A09'].includes(ancestry) ? '<path d="M64 70l-14-16 6 26zM136 70l14-16-6 26z" fill="' + tone + '"/>' : '';
  const horns = ancestry === 'A12' ? '<path d="M70 40l-12-22 22 14zM130 40l12-22-22 14z" fill="#e6d3a3"/>' : '';
  const beard = sex !== 'female' && ['A04', 'A05'].includes(ancestry) ? '<path d="M70 92q30 40 60 0v14q-30 30-60 0z" fill="#b0521f"/>' : '';
  return `<svg class="bt-portrait" viewBox="0 10 200 200" aria-hidden="true"><rect width="200" height="260" fill="#2a1d14"/><path d="M0 200 Q100 160 200 200 V260 H0Z" fill="#3d2a1c"/>${hair}${horns}${ears}<ellipse cx="100" cy="80" rx="38" ry="44" fill="${tone}"/>${beard}<path d="M40 260c0-60 26-90 60-90s60 30 60 90z" fill="${cloth}"/><path d="M84 170h32l-16 30z" fill="#FFBC19"/><text x="100" y="204" text-anchor="middle" fill="#ffffff88" font-family="Helvetica,Arial" font-size="9" letter-spacing="2">PLACEHOLDER PORTRAIT</text></svg>`;
}

/** Placeholder package illustration: a small stable yard tinted per package. */
export function packageArt(key) {
  const tint = { traditional: '#8a5a32', beastmaster: '#4d6b2f', mechanist: '#2f6d8a', veteran: '#6b4a8a', scrappy: '#8a2430' }[key] ?? '#7a5a3a';
  return `<svg class="bt-package-hero" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="150" fill="#8fb4cf"/><path d="M0 110 Q200 80 400 110 V150 H0Z" fill="#6d8a4a"/><path d="M60 110V60l60-30 60 30v50z" fill="${tint}"/><rect x="100" y="78" width="40" height="32" fill="#2a1a10"/><path d="M50 62l70-38 70 38" stroke="#3a2415" stroke-width="8" fill="none"/>${chariot(230, 66, .6, '#2a1410')}<text x="392" y="144" text-anchor="end" fill="#ffffffaa" font-family="Helvetica,Arial" font-size="9" letter-spacing="2">PLACEHOLDER ART</text></svg>`;
}

export const NATION_COLORS = Object.freeze({
  N1: ['#8fa6b8', '#5d6f5a', '#24476b'], N2: ['#c9dbe6', '#e8eef2', '#3e6f9a'], N3: ['#9cc6e0', '#5f8f4a', '#2f5d3a'], N4: ['#8f8a86', '#5a4a3e', '#a64b20'],
  N5: ['#f2c97a', '#c8a15a', '#a61924'], N6: ['#e0a86a', '#9a5a32', '#633018'], N7: ['#b9a6d6', '#6a6f8f', '#5a2a6b'], N8: ['#f5d38a', '#d9a65a', '#b88742'],
});

/** Navigation pictograms (24 x 24), keyed by management page. */
export const NAV_ICONS = Object.freeze({
  overview: 'M3 11 12 3l9 8v10h-6v-6H9v6H3z',
  roster: 'M6 21c0-4 1-7 3-9L6 9l2-1 1-4 3 3c4 0 8 3 8 8v6h-4v-5l-2-1-2 2v4z',
  markets: 'M3 18h12v3H3zm2-4h12v3H5zm-2-4h12v3H3zm14-5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
  facilities: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-4 3-7 6-7s6 3 6 7zm10.5 0c.4-2.6 1.6-4.8 3.5-6.4 3 .4 6 3 6 6.4z',
  workshop: 'M2 6h14c0 3 2 4 6 4v2c-3 0-5 1-6 3v2h3v3H5v-3h3v-2c-2-2-4-3-6-3z',
  services: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',
  finances: 'M3 17h8v4H3zm10-4h8v8h-8zM3 11h8v4H3zm10-6h8v6h-8z',
  championships: 'M6 3h12v3h3c0 4-2 6-5 6.5A5 5 0 0 1 13 15v3h3v3H8v-3h3v-3a5 5 0 0 1-3-2.5C5 12 3 10 3 6h3zM5 8c.3 1.5 1 2.5 2 3V8zm14 0h-2v3c1-.5 1.7-1.5 2-3z',
  world: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2c1.5 2 2.3 4.6 2.5 7h-5C9.7 8.6 10.5 6 12 4zM4.1 11A8 8 0 0 1 8.4 4.8C7.6 6.7 7.1 8.8 7 11zm0 2H7c.1 2.2.6 4.3 1.4 6.2A8 8 0 0 1 4.1 13zm5.4 0h5c-.2 2.4-1 5-2.5 7-1.5-2-2.3-4.6-2.5-7zm7.5 0h2.9a8 8 0 0 1-4.3 6.2c.8-1.9 1.3-4 1.4-6.2zm0-2c-.1-2.2-.6-4.3-1.4-6.2A8 8 0 0 1 19.9 11z',
  gambling: 'M4 4h16v16H4zm4 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  records: 'M5 3h11l3 3v15H5zm3 5h8v2H8zm0 4h8v2H8zm0 4h5v2H8z',
  practice: 'M4 2h2v20H4zm3 1h3v3H7zm6 0h3v3h-3zm-3 3h3v3h-3zm6 0h3v3h-3zm-9 3h3v3H7zm6 0h3v3h-3zm-3 3h3v2h-3zm6 0h3v2h-3z',
});
export const icon = key => NAV_ICONS[key] ? `<svg class="bt-ico" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="${NAV_ICONS[key]}"/></svg>` : '';
