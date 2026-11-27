// Music and volume (Mack 2026-11-27).
//   Title screen: theme. Character creation: one of the two menu songs.
//   Menus: menu 1, menu 2, menu 1, menu 2, then the theme, and around again.
//   Races: one of the two race songs from the moment the race starts; the
//   Championship song plays for every Championship race and only those.
// Songs fade into each other. Settings persist per browser; the master volume
// starts at 15% (Mack 2026-11-27). The theme carries on from the title screen
// into the menus without a break (also across the reload that opens a career),
// then the menu cycle continues with menu 1. Sound effects will use the same settings when they arrive.
const KEY = 'bnt.audio.v1';
export const AUDIO_DEFAULTS = Object.freeze({master: 0.15, music: 1, effects: 1, muted: false, musicMuted: false, effectsMuted: false});
const FADE_MS = 2500, HANDOFF = 'bnt.music.handoff';

function load() {
  try { return {...AUDIO_DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? '{}')}; } catch { return {...AUDIO_DEFAULTS}; }
}
let settings = load();
export const audioSettings = () => ({...settings});
export function setAudio(patch) {
  settings = {...settings, ...patch};
  for (const k of ['master', 'music', 'effects']) settings[k] = Math.min(1, Math.max(0, Number(settings[k]) || 0));
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch {}
  player?.applyVolume();
}
export const musicVolume = () => settings.muted || settings.musicMuted ? 0 : settings.master * settings.music;
export const effectsVolume = () => settings.muted || settings.effectsMuted ? 0 : settings.master * settings.effects;

const track = name => globalThis.__BNT_MEDIA__?.music?.[name] ?? null;
const MENU_CYCLE = ['menu_01', 'menu_02', 'menu_01', 'menu_02', 'theme_01'];

class Player {
  constructor() {
    this.scene = null; this.current = null; this.menuStep = 0; this.waiting = false;
    this.decks = [new Audio(), new Audio()]; this.live = 0;
    for (const a of this.decks) { a.preload = 'auto'; a.addEventListener('ended', () => this.onEnded(a)); }
  }
  get deck() { return this.decks[this.live]; }
  applyVolume() { const v = musicVolume(); for (const a of this.decks) if (!a._fading) a.volume = a === this.deck ? v : 0; }
  fade(a, to, ms, done) {
    a._fading = true; const from = a.volume, t0 = performance.now();
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      a.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) requestAnimationFrame(tick); else { a._fading = false; done?.(); }
    };
    requestAnimationFrame(tick);
  }
  play(name, {loop = false, at = 0, fadeMs = FADE_MS} = {}) {
    const src = track(name);
    if (!src) return;
    if (this.current === name && !this.deck.paused) { this.deck.loop = loop; return; }
    const old = this.deck, next = this.decks[1 - this.live];
    this.live = 1 - this.live; this.current = name;
    next.src = src; next.loop = loop; next.volume = 0;
    try { next.currentTime = at; } catch {}
    if (at) next.addEventListener('loadedmetadata', () => { if (next.currentTime < at) next.currentTime = at; }, {once: true});
    const start = () => next.play().then(() => { this.waiting = false; this.fade(next, musicVolume(), fadeMs); }).catch(() => this.waitForGesture(start));
    if (!old.paused) this.fade(old, 0, FADE_MS, () => old.pause());
    start();
  }
  stop() {
    this.current = null;
    for (const a of this.decks) if (!a.paused) this.fade(a, 0, FADE_MS, () => a.pause());
  }
  // Browsers only allow sound after the player clicks or presses a key.
  waitForGesture(retry) {
    if (this.waiting) { this.retry = retry; return; }
    this.waiting = true; this.retry = retry;
    const go = () => { removeEventListener('pointerdown', go, true); removeEventListener('keydown', go, true); this.waiting = false; this.retry?.(); };
    addEventListener('pointerdown', go, true); addEventListener('keydown', go, true);
  }
  onEnded(a) {
    if (a !== this.deck) return;
    if (this.scene === 'menu') { this.menuStep = (this.menuStep + 1) % MENU_CYCLE.length; this.current = null; this.play(MENU_CYCLE[this.menuStep]); }
  }
  setScene(scene) {
    if (scene === this.scene) return;
    const prev = this.scene; this.scene = scene;
    const themeOn = this.current === 'theme_01' && !this.deck.paused;
    if (prev === null && (scene === 'title' || scene === 'menu') && this.handoff) {
      // Picking up the theme where it was before the page reloaded.
      this.play('theme_01', {loop: scene === 'title', at: this.handoff.t, fadeMs: 300});
      if (scene === 'menu') this.menuStep = MENU_CYCLE.length - 1;
      return;
    }
    if (scene === 'title') this.play('theme_01', {loop: true});
    else if (scene === 'creation') this.play(Math.random() < .5 ? 'menu_01' : 'menu_02', {loop: true});
    else if (scene === 'menu' && prev === 'title' && themeOn) { this.deck.loop = false; this.menuStep = MENU_CYCLE.length - 1; } // theme plays on, then menu 1
    else if (scene === 'menu') { if (prev !== 'menu') this.menuStep = 0; this.play(MENU_CYCLE[this.menuStep]); }
    else if (scene === 'race') this.play(Math.random() < .5 ? 'race_01' : 'race_02', {loop: true});
    else if (scene === 'championship') this.play('race_championship', {loop: true});
    else this.stop();
  }
}
let player = null;

// Works out what is on screen once a second and picks the music for it.
function sceneNow(doc) {
  const visible = el => !!el && !el.hidden && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const race = doc.getElementById('careerRace'), frame = doc.getElementById('careerRaceFrame');
  if (visible(race) && frame) {
    const status = frame.contentWindow?.P1?.session?.state?.status;
    if (!['Running', 'Ended', 'Stalled'].includes(status)) return 'pre-race';
    return /Championship/.test(race.querySelector('.career-toolbar strong')?.textContent ?? '') ? 'championship' : 'race';
  }
  if (doc.body.classList.contains('m2-creation-open')) return 'creation';
  if (visible(doc.getElementById('m1-title'))) return 'title';
  return 'menu';
}
export function installMusic(doc = globalThis.document) {
  if (player || !doc || !globalThis.__BNT_MEDIA__?.music) return null;
  player = new Player(); player.applyVolume(); globalThis.__BNT_MUSIC__ = player;
  try { const h = JSON.parse(sessionStorage.getItem(HANDOFF) ?? 'null'); sessionStorage.removeItem(HANDOFF); if (h && Date.now() - h.at < 20000) player.handoff = h; } catch {}
  addEventListener('pagehide', () => { try { const d = player.deck; if (player.current === 'theme_01' && !d.paused) sessionStorage.setItem(HANDOFF, JSON.stringify({t: d.currentTime, at: Date.now()})); } catch {} });
  const tick = () => { try { const sc = sceneNow(doc); player.setScene(sc === 'pre-race' ? 'silent' : sc); } catch {} };
  tick(); setInterval(tick, 1000);
  return player;
}

// Volume controls for Game Preferences.
export function audioControls(doc = globalThis.document) {
  const wrap = doc.createElement('section'); wrap.id = 'bt-audio-settings';
  wrap.innerHTML = '<h4>Sound</h4>';
  const row = (label, key, muteKey) => {
    const r = doc.createElement('div'); r.className = 'bt-audio-row';
    const l = doc.createElement('label'); l.textContent = label + ' ';
    const s = doc.createElement('input'); s.type = 'range'; s.min = '0'; s.max = '100'; s.step = '1'; s.value = String(Math.round(settings[key] * 100)); s.id = 'bt-vol-' + key; s.setAttribute('aria-label', label + ' volume');
    const out = doc.createElement('output'); out.textContent = s.value + '%';
    s.oninput = () => { out.textContent = s.value + '%'; setAudio({[key]: +s.value / 100}); };
    const m = doc.createElement('label'); m.className = 'bt-audio-mute';
    const c = doc.createElement('input'); c.type = 'checkbox'; c.checked = !!settings[muteKey]; c.id = 'bt-mute-' + key;
    c.onchange = () => setAudio({[muteKey]: c.checked});
    m.append(c, doc.createTextNode(' Mute'));
    l.append(s); r.append(l, out, m); return r;
  };
  wrap.append(row('Master', 'master', 'muted'), row('Music', 'music', 'musicMuted'), row('Sound effects', 'effects', 'effectsMuted'));
  const note = doc.createElement('p'); note.textContent = 'Sound effects are coming later; their volume is saved now.'; wrap.append(note);
  return wrap;
}
