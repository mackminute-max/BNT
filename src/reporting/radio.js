// Race Radio (Phase 4): a two-person broadcast booth over the existing event feed.
// Simulator events trigger play-by-play lines (Rook); color lines (Mags) fill the
// quiet stretches with lore, sponsor ads, betting talk and rivalry history. Lines
// are picked by context (player, grudge, last lap, weather, style) with priorities,
// cooldowns and no repeats. Display only: it never changes the race.
// Same interface as Commentary: `lines`, consume(events), consumeBatch(events).
import {hash} from '../core/determinism.js';
import {BOONS} from '../sim/endowments.js';
import {ABILITIES} from '../sim/m6-interaction.js';
import {LINES, COLOR_KEYS, ANNOUNCERS, SPONSORS} from './radio-lines.js';

const PRIORITY = new Set(['RACE_STARTED', 'RU_FINISHED', 'RACE_ENDED', 'RACE_STALLED', 'RU_RETIRED', 'FINAL_LAP', 'LEAD_CHANGED']);
const GAP = 1.2, QUIET = 7, COLOR_GAP = 12;
const WEATHER = {Rain: 'rain', 'Heavy Rain': 'rain', Mud: 'mud', Dust: 'dust', Wind: 'wind', 'Extreme Heat': 'heat'};
const COLOR_ORDER = ['rivalry', 'style', 'sponsor', 'player', 'lore', 'betting', 'weather', 'quiet', 'lore', 'sponsor', 'betting'];
const defaultContext = () => globalThis.P1?.session?.display?.radio ?? null;

export class RaceRadio {
  constructor({context = defaultContext} = {}) { this.context = context; this.reset(); }
  reset() {
    this.cursor = 0; this.lines = []; this.last = new Map(); this.used = new Map();
    this.lastTime = -Infinity; this.lastColor = -Infinity; this.colorTurn = 0;
    this.started = false; this.ended = false; this.finishers = 0; this.finalLap = false;
    this.hitBy = new Map(); this.leader = null; this.retired = new Map(); this.playerPlace = null; this.playerOut = false;
  }
  consumeBatch(events, options = {}) { this.cursor = 0; const lines = this.consume(events, options); this.cursor = 0; return lines; }
  consume(events, {enabled = true} = {}) {
    const ctx = this.ctx = safe(this.context);
    for (const e of events.slice(this.cursor)) { if (enabled) this.event(e, ctx); }
    this.cursor = events.length;
    return this.lines;
  }
  // ---- helpers ---------------------------------------------------------------
  entry(id) { return this.ctx?.entrants?.find(x => x.id === id) ?? null; }
  isPlayer(id) { return !!id && (this.ctx?.playerId ? this.ctx.playerId === id : false); }
  grudge(a, b) { return !!this.ctx?.grudges?.some(([x, y]) => (x === a && y === b) || (x === b && y === a)); }
  tokens(e, a = null, b = null, extra = {}) {
    const c = this.ctx ?? {}, da = this.entry(a)?.driver ?? a, db = this.entry(b)?.driver ?? b;
    return {a, b, da, db, venue: c.venue ?? 'the track', series: c.series, race: c.race, races: c.races, laps: c.laps, sponsor: SPONSORS[hash(`${e.id}:sponsor`) % SPONSORS.length], ...extra};
  }
  cool(key, time, seconds) { if (time - (this.last.get(key) ?? -Infinity) < seconds) return false; this.last.set(key, time); return true; }
  say(e, key, tokens, {force = false} = {}) {
    const pool = LINES[key];
    if (!pool?.length) return false;
    if (!force && e.time - this.lastTime < GAP) return false;
    const used = this.used.get(key) ?? new Set();
    if (used.size >= pool.length) used.clear();
    const free = pool.map((_, i) => i).filter(i => !used.has(i)), start = hash(`${e.id}:${key}:${this.lines.length}`) % free.length;
    for (let k = 0; k < free.length; k++) {
      const i = free[(start + k) % free.length], text = fill(pool[i], tokens);
      if (text === null) continue;
      used.add(i); this.used.set(key, used);
      const speaker = COLOR_KEYS.has(key) ? 'color' : 'pbp';
      this.lines.push({eventId: e.id, time: e.time, type: 'RADIO', key, speaker, text: `${ANNOUNCERS[speaker].short}: ${text}`});
      this.lastTime = e.time;
      if (speaker === 'color') this.lastColor = e.time;
      return true;
    }
    return false;
  }
  follow(e, key, tokens, chance = 2) { if (hash(`${e.id}:follow:${key}`) % chance === 0) this.say(e, key, tokens, {force: true}); }
  // ---- events ----------------------------------------------------------------
  event(e, ctx) {
    const p = e.participants ?? [], fx = e.effects ?? {}, force = PRIORITY.has(e.type);
    switch (e.type) {
      case 'RACE_STARTED': {
        if (this.started) return; this.started = true;
        this.intro(e, ctx);
        this.say(e, 'start', this.tokens(e), {force: true});
        return;
      }
      case 'OVERTAKE': {
        const [a, b] = [fx.passer, fx.passed];
        if (!a || !b || !this.cool('ov:' + a + b, e.time, 6)) return;
        const key = this.grudge(a, b) ? 'overtake_grudge' : this.isPlayer(a) ? 'overtake_player' : this.isPlayer(b) ? 'overtake_on_player' : 'overtake';
        this.say(e, key, this.tokens(e, a, b));
        break;
      }
      case 'LEAD_CHANGED': {
        const a = fx.leader;
        if (a) this.leader = a;
        if (!a || e.time < 2 || !this.cool('lead', e.time, 4)) return;
        if (this.say(e, this.isPlayer(a) ? 'lead_player' : 'lead', this.tokens(e, a), {force}) && this.isPlayer(a)) this.follow(e, 'player_lead_color', this.tokens(e, a), 3);
        break;
      }
      case 'ATTACK': {
        const a = fx.attacker, b = fx.defender;
        if (!a || !b) return;
        if (fx.success) this.hitBy.set(b, a);
        const grudge = this.grudge(a, b), ram = fx.action === 'ram';
        let key;
        if (grudge) key = 'attack_grudge';
        else if (fx.success && fx.crit) key = 'attack_crit';
        else if (fx.success && this.isPlayer(a)) key = 'attack_player_hit';
        else if (fx.success && this.isPlayer(b)) key = 'attack_on_player';
        else if (ram) key = fx.success ? 'ram_hit' : 'ram_miss';
        else key = fx.success ? 'attack_hit' : 'attack_miss';
        if (!fx.success && !grudge && !this.cool('miss', e.time, 6)) return;
        if (!this.cool('atk:' + a + b, e.time, grudge ? 3 : 4)) return;
        if (this.say(e, key, this.tokens(e, a, b), {force: grudge || !!fx.crit}) && (fx.crit || (grudge && fx.success))) this.follow(e, 'carnage', this.tokens(e, a, b));
        break;
      }
      case 'CONTACT': {
        const [a, b] = p;
        if (!a || !b || !this.cool('contact:' + a + b, e.time, 8) || !this.cool('contact', e.time, 3)) return;
        this.say(e, 'contact', this.tokens(e, a, b));
        break;
      }
      case 'DAMAGE': {
        const a = p[0];
        if (!a || !(fx.amount >= 15) || !this.cool('dmg:' + a, e.time, 8)) return;
        this.say(e, 'damage_big', this.tokens(e, a, null, {component: componentName(fx.component)}));
        break;
      }
      case 'CONTROL_CHANGED': {
        const a = p[0];
        if (!a) return;
        if (fx.control === 'Out of Control' && this.cool('ooc:' + a, e.time, 8)) this.say(e, 'out_of_control', this.tokens(e, a));
        else if (fx.control === 'Unstable' && /corner/i.test(String(fx.cause)) && this.cool('unst:' + a, e.time, 15) && this.cool('unst', e.time, 6)) this.say(e, 'unstable', this.tokens(e, a));
        break;
      }
      case 'RU_RETIRED': {
        const a = p[0];
        if (!a || this.retired.has(a)) return;
        this.retired.set(a, e.time);
        const by = this.hitBy.get(a) ?? null;
        if (this.isPlayer(a)) { this.playerOut = true; this.say(e, 'retired_player', this.tokens(e, a), {force: true}); }
        else if (by && this.grudge(a, by)) this.say(e, 'retired_grudge', this.tokens(e, a, by), {force: true});
        else if (by) this.say(e, 'retired_by', this.tokens(e, a, by), {force: true});
        else this.say(e, 'retired', this.tokens(e, a), {force: true});
        this.follow(e, 'carnage', this.tokens(e, a, by), by ? 1 : 2);
        break;
      }
      case 'WRECK_CREATED': {
        const a = p[0];
        if (!a || e.time - (this.retired.get(a) ?? -Infinity) < 1 || !this.cool('wreck', e.time, 4)) return;
        this.say(e, 'wreck', this.tokens(e, a));
        break;
      }
      case 'WRECK_IMPACT': case 'INCIDENT_IMPACT': {
        if (this.cool('wimp', e.time, 6)) this.say(e, 'wreck_impact', this.tokens(e, p[0]));
        break;
      }
      case 'INCIDENT': {
        const key = {debris: 'incident_debris', animal: 'incident_animal', spectator: 'incident_spectator'}[fx.type];
        if (key && this.cool('inc', e.time, 4)) this.say(e, key, this.tokens(e, null, null, {lane: Number.isSafeInteger(fx.lane) ? String(fx.lane + 1) : null}), {force: true});
        break;
      }
      case 'INCIDENT_CLEARED': { if (this.cool('incc', e.time, 6)) this.say(e, 'incident_cleared', this.tokens(e)); break; }
      case 'SIGN_ACTIVATED': {
        const a = p[0];
        if (!a || !fx.sign || (this.ctx?.playerId && !this.isPlayer(a)) || e.time < 1) return;
        this.say(e, 'strategy_player', this.tokens(e, a, null, {sign: fx.sign}), {force: true});
        break;
      }
      case 'RIVAL_STRATEGY': {
        const a = p[0];
        if (!a || !fx.sign || !this.cool('rstrat', e.time, 10)) return;
        this.say(e, 'rival_strategy', this.tokens(e, a, null, {sign: fx.sign}));
        break;
      }
      case 'BOON_FIRED': {
        const a = p[0], boon = BOONS[fx.boonId]?.name;
        if (!a || !boon || !this.cool('boon:' + a, e.time, 12)) return;
        this.say(e, 'boon', this.tokens(e, a, null, {boon}));
        break;
      }
      case 'ABILITY_ACTIVATED': {
        const a = p[0], ability = ABILITIES[fx.abilityId]?.name;
        if (a && ability) this.say(e, 'ability', this.tokens(e, a, null, {ability}), {force: true});
        break;
      }
      case 'FINAL_LAP': {
        if (this.finalLap || !p[0]) return; this.finalLap = true;
        this.say(e, 'final_lap', this.tokens(e, p[0]), {force: true});
        break;
      }
      case 'RU_FINISHED': {
        const a = p[0];
        if (!a) return;
        const n = ++this.finishers, player = this.isPlayer(a), t = this.tokens(e, a, null, {n: String(n)});
        if (player) this.playerPlace = n;
        if (n === 1) { this.say(e, player ? 'win_player' : 'win', t, {force: true}); if (!player && this.ctx?.grudges?.some(g => g.includes(a))) this.say(e, 'win_grudge', t, {force: true}); }
        else if (player) this.say(e, n <= 3 ? 'podium_player' : 'finish_back_player', t, {force: true});
        else this.say(e, n <= 3 ? 'podium' : 'finish_back', t, {force: n <= 3});
        break;
      }
      case 'RACE_ENDED': case 'RACE_STALLED': {
        if (this.ended) return; this.ended = true;
        this.say(e, 'race_end', this.tokens(e), {force: true});
        const pid = this.ctx?.playerId;
        if (pid) {
          const t = this.tokens(e, pid, null, {n: this.playerPlace ? String(this.playerPlace) : null});
          this.say(e, this.playerPlace === 1 ? 'wrap_player_win' : this.playerPlace && this.playerPlace <= 3 ? 'wrap_player_podium' : this.playerPlace ? 'wrap_player_back' : 'wrap_player_out', t, {force: true});
        }
        this.say(e, 'wrap_sign_off', this.tokens(e), {force: true});
        return;
      }
      default: break;
    }
    this.quiet(e);
  }
  // Pre-race introductions.
  intro(e, c) {
    const t = this.tokens(e), f = {force: true};
    this.say(e, 'intro_venue', t, f);
    if (c?.series && c.race) this.say(e, 'intro_series', t, f);
    if (c?.format) this.say(e, c.format === 'Combat' ? 'intro_combat' : 'intro_pure', t, f);
    const w = WEATHER[c?.weather];
    if (w) this.say(e, 'intro_weather_' + w, t, f);
    else if (c?.laps > 1) this.say(e, 'intro_laps', t, f);
    const rivals = (c?.entrants ?? []).filter(x => !x.player && x.style).slice(0, 2);
    for (const r of rivals) this.say(e, 'intro_rival_' + r.style, this.tokens(e, r.id), f);
    const g = c?.grudges?.[0];
    if (g) this.say(e, 'intro_grudge', this.tokens(e, g[1], g[0]), f);
  }
  // Color commentary on quiet stretches.
  quiet(e) {
    if (!this.started || this.ended || e.time - this.lastTime < QUIET || e.time - this.lastColor < COLOR_GAP) return;
    const c = this.ctx, styled = (c?.entrants ?? []).filter(x => !x.player && x.style);
    for (let k = 0; k < COLOR_ORDER.length; k++) {
      const kind = COLOR_ORDER[(this.colorTurn + k) % COLOR_ORDER.length];
      let ok = false;
      if (kind === 'rivalry' && c?.grudges?.length) { const g = c.grudges[hash(`${e.id}:g`) % c.grudges.length]; ok = this.say(e, 'rivalry', this.tokens(e, g[1], g[0]), {force: true}); }
      else if (kind === 'style' && styled.length) { const r = styled[hash(`${e.id}:s`) % styled.length]; ok = this.say(e, 'style_' + r.style, this.tokens(e, r.id), {force: true}); }
      else if (kind === 'weather' && WEATHER[c?.weather]) ok = this.say(e, 'weather_' + WEATHER[c.weather], this.tokens(e), {force: true});
      else if (kind === 'player' && c?.playerId && !this.playerOut && this.leader) ok = this.say(e, this.leader === c.playerId ? 'player_lead_color' : 'player_back_color', this.tokens(e, c.playerId), {force: true});
      else if (kind === 'betting') ok = this.say(e, 'betting', this.tokens(e, c?.favourite ?? null), {force: true});
      else if (['sponsor', 'lore', 'quiet'].includes(kind)) ok = this.say(e, kind, this.tokens(e), {force: true});
      if (ok) { this.colorTurn = (this.colorTurn + k + 1) % COLOR_ORDER.length; return; }
    }
  }
}
function safe(f) { try { return f?.() ?? null; } catch { return null; } }
function fill(template, tokens) {
  let missing = false;
  const text = template.replace(/\{([a-z]+)\}/g, (_, k) => { const v = tokens[k]; if (v === null || v === undefined || v === '') { missing = true; return ''; } return String(v); });
  return missing ? null : text;
}
const componentName = c => ({driver: 'driver', chariot: 'chariot', beasts: 'team', beast: 'team'})[c] ?? (typeof c === 'string' ? c.replace(/[-_]/g, ' ') : null);
export function broadcast(events, context = null) { return new RaceRadio({context: () => context}).consume(events); }
