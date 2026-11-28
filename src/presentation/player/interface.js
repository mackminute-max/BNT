import { isJoust } from '../../sim/joust.js';
import {playerProfile, StartSequence, nearRadioBottom} from './model.js';
const $ = id => document.getElementById(id);
function node(tag, className, text) {
  const value = document.createElement(tag);
  if (className) value.className = className;
  if (text) value.textContent = text;
  return value;
}
function text(element, value) { if (element.textContent !== value) element.textContent = value; }
const app = globalThis.P21 = {version: 1, view: 'race', contextPlaying: false, setContext({playing}) { this.contextPlaying = playing; }};
document.body.classList.add('p21');
document.title = 'Blood and Thunder — P2.1 Player Race';
text(document.querySelector('header small'), 'P2.1 · Player race interface · Temporary artwork');
const main = document.querySelector('main');
const raceView = node('section', 'p21-race-view'); raceView.id = 'playerView';
const developerView = node('section', 'p21-developer-view'); developerView.id = 'developerView'; developerView.hidden = true; developerView.inert = true;
main.append(raceView, developerView);
const devTitle = node('h2', '', 'Developer Tools'); devTitle.tabIndex = -1;
const returnButton = node('button', '', 'Return to Race'); returnButton.id = 'returnToRace'; returnButton.type = 'button';
developerView.append(devTitle, returnButton);
const devInfo = node('p', 'hint', 'Settings take effect only through Prepare / New race. Navigation does not pause or restart a race.');
developerView.append(devInfo);
const setup = document.querySelector('.p2-setup'), proof = document.querySelector('.p2-proof-controls'), compare = document.querySelector('.p2-comparison');
setup.open = true; compare.open = true;
developerView.append(setup, proof, compare);
const diagnostics = node('section', 'panel'); diagnostics.append(node('h2', '', 'Presented state and Worker diagnostics'));
for (const id of ['p2EventTitle', 'status', 'hud']) diagnostics.append($(id));
const oldCommandDetails = $('commandStatus').closest('details'); if (oldCommandDetails) diagnostics.append(oldCommandDetails);
developerView.append(diagnostics);
const layout = document.querySelector('.race-layout'), primary = layout.querySelector('.p2-primary'), radioColumn = layout.querySelector('.p2-radio-column');
const racePanel = $('race').closest('.panel'), signPanel = $('sign').closest('.panel'), controls = document.querySelector('.p2-playback'), identity = document.querySelector('.p2-identity');
const deck = document.querySelector('.command-deck');
primary.append(signPanel, controls); deck.remove();
signPanel.classList.add('p21-sign-bar'); controls.classList.add('panel', 'p21-race-controls');
text(signPanel.querySelector('h2'), 'STRATEGY'); text(controls.querySelector('h2'), 'Race Controls');
const remaining = node('span', 'p21-opportunities'); remaining.id = 'p21Opportunities'; remaining.setAttribute('role', 'status'); signPanel.querySelector('h2').append(remaining);
// The six cards and original queue/select/cancel/lower controls are moved, never cloned.
const hint = signPanel.querySelector('#p2SignChoices + .hint'); if (hint) hint.hidden = true;
const response = $('signResponse');
const originalHelp = response.closest('details');
if (originalHelp) { signPanel.append(response); developerView.append(originalHelp); }
$('signState').classList.add('p21-sign-state');
const acknowledgement = $('p2Ack'); acknowledgement.classList.add('p21-ack');
const controlsHint = node('p', 'hint', 'Pause, then present the buffered tail before stepping. Restart discards this in-memory race.');
controls.append(controlsHint);
const responseDetails = node('details', 'p21-response'), responseSummary = node('summary', '', 'Driver response and command acknowledgment'); responseDetails.append(responseSummary, response, acknowledgement); controls.append(responseDetails);
const exertionDetails = $('exertionState').closest('details'); if (exertionDetails) developerView.append(exertionDetails);
$('start').textContent = 'Start Race'; $('step').textContent = 'Single tick';
const reduced = $('p2Reduced').closest('label'); controls.append(reduced);

const raceTitle = node('h2'); raceTitle.id = 'p21RaceTitle'; racePanel.prepend(raceTitle);
const raceTitleName = node('span'), raceTitleMeta = node('small', 'p21-race-meta'); raceTitleMeta.id = 'p21RaceMeta'; raceTitle.append(raceTitleName, raceTitleMeta);
const stage = node('div', 'p21-race-stage'), raceCanvas = $('race'); raceCanvas.replaceWith(stage); stage.append(raceCanvas);
const overlay = node('div', 'p21-countdown'); overlay.id = 'p21Countdown'; overlay.hidden = true;
const countdownWord = node('strong'), countdownDetail = node('span');
overlay.append(countdownWord, countdownDetail); overlay.setAttribute('role', 'status'); overlay.setAttribute('aria-live', 'polite'); stage.append(overlay);
const profile = node('section', 'panel p21-profile'); profile.id = 'driverProfile';
profile.append(node('h2', '', 'Driver Profile'), identity); radioColumn.prepend(profile);
const name = node('strong'), team = node('span', 'hint'); name.id = 'p21DriverName'; team.id = 'p21Team';
const conditionLabel = node('label', '', 'Driver condition'), condition = node('progress'); condition.id = 'p21DriverCondition'; condition.max = 100; condition.setAttribute('aria-label', 'Native driver condition'); const conditionText = node('span'); conditionLabel.append(condition, conditionText);
const strainLabel = node('label', '', 'Driver strain'), strain = node('progress'); strain.id = 'p21DriverStrain'; strain.max = 100; strain.setAttribute('aria-label', 'Native driver strain, not fatigue'); const strainText = node('span'); strainLabel.append(strain, strainText);
const physical = node('p', 'p21-profile-status'); physical.id = 'p21DriverStatus';
const profileHelp = node('p', 'hint', 'Condition and strain are separate native values. Team endurance below reflects beast fatigue, not driver fatigue.');
const endurancePanel = identity.querySelector('.endurance-panel');
profile.append(name, team, conditionLabel, strainLabel, physical, profileHelp, endurancePanel);
const buffs = node('div', 'p21-buffs'); buffs.id = 'p21Effects'; buffs.append(node('span', 'hint', 'Run effects · reserved for future data'));
for (let i = 0; i < 3; i++) { const slot = node('span', 'p21-empty-slot', '—'); slot.setAttribute('aria-label', 'Empty reserved effect slot'); buffs.append(slot); }
profile.append(buffs);

const transcript = $('radio'), radioPanel = transcript.closest('.panel');
text(radioPanel.querySelector('h2'), 'Race Radio');
const latest = node('button', 'p21-latest', 'Latest commentary'); latest.id = 'radioLatest'; latest.type = 'button';
const radioNotice = node('span', 'hint'); radioNotice.id = 'radioUnread'; radioPanel.append(latest, radioNotice);
// Radio dials (Phase 4c, Mack 2026-11-27): tune WBNT (color and highlights) or the
// play-by-play channel, and a knob to mute the music.
const tuner = node('div', 'bt-tuner');
const dial = node('div', 'bt-dial'), needle = node('span', 'bt-needle');
const stations = [['wbnt', 'WBNT', '101.3'], ['pbp', 'Play-by-play', '88.7']];
dial.append(node('span', 'bt-ticks'), needle);
const stationButtons = stations.map(([id, name, freq], i) => { const b = node('button', 'bt-station'); b.type = 'button'; b.dataset.channel = id; b.style.left = (i ? 70 : 8) + '%'; b.append(node('strong', '', name), node('small', '', freq)); b.onclick = () => tune(id); dial.append(b); return b; });
const musicKnob = node('button', 'bt-knob'); musicKnob.type = 'button'; musicKnob.id = 'btMusicKnob';
const audio = () => { try { return parent.__btAudio?.() ?? null; } catch { return null; } };
const drawKnob = () => { const muted = !!audio()?.musicMuted; musicKnob.dataset.off = String(muted); text(musicKnob, muted ? '♪ Music off' : '♪ Music on'); musicKnob.setAttribute('aria-pressed', String(muted)); };
musicKnob.onclick = () => { try { const a = audio(); parent.__btSetAudio?.({musicMuted: !a?.musicMuted}); } catch {} drawKnob(); };
const tagline = node('p', 'bt-tuner-tag');
function tune(id) { globalThis.__btRadioTune?.(id); drawTuner(); }
function drawTuner() { const ch = globalThis.__btRadioChannel?.() ?? 'wbnt'; stationButtons.forEach(b => b.dataset.on = String(b.dataset.channel === ch)); needle.style.left = ch === 'pbp' ? '78%' : '17%'; text(tagline, ch === 'pbp' ? 'Play-by-play: every move, called live by Rook Calloway.' : 'WBNT radio: Home of the Sundaran Open Cup and the Founders’ Cup.'); }
tuner.append(dial, musicKnob); radioPanel.querySelector('h2').after(tuner, tagline); drawTuner(); drawKnob();
let unread = 0, radioGeneration = null, hiddenRadioPosition = null;
const updateUnread = () => { latest.disabled = nearRadioBottom(transcript); text(radioNotice, unread ? `${unread} new message${unread === 1 ? '' : 's'}` : 'Presented events · chronological order'); };
latest.onclick = () => { transcript.scrollTop = transcript.scrollHeight; unread = 0; updateUnread(); };
transcript.addEventListener('scroll', () => { if (nearRadioBottom(transcript)) unread = 0; updateUnread(); }, {passive: true});
app.radioBefore = () => {
  if (app.view === 'developer' && hiddenRadioPosition) return {...hiddenRadioPosition, hidden: true};
  const rectangle = transcript.getBoundingClientRect();
  const anchor = [...transcript.children].find(child => child.getBoundingClientRect().bottom > rectangle.top + 2);
  return {atBottom: nearRadioBottom(transcript), top: transcript.scrollTop, anchor, offset: anchor?.getBoundingClientRect().top, relativeOffset: anchor ? anchor.getBoundingClientRect().top - rectangle.top : 0};
};
app.radioAfter = (before, count) => {
  if (radioGeneration !== globalThis.P1?.session) { radioGeneration = globalThis.P1?.session; unread = 0; before = {atBottom: true}; if (app.view === 'developer') hiddenRadioPosition = {atBottom: true}; }
  if (app.view === 'developer') { if (count && !hiddenRadioPosition?.atBottom) unread += count; return; }
  if (count && before?.atBottom) { transcript.scrollTop = transcript.scrollHeight; unread = 0; }
  else if (count) {
    if (before?.anchor?.isConnected) transcript.scrollTop += before.anchor.getBoundingClientRect().top - before.offset;
    else transcript.scrollTop = before?.top ?? 0;
    unread += count;
  }
  updateUnread();
};

const raceInfo = node('p', 'p21-race-info'); raceInfo.id = 'p21RaceInfo'; raceInfo.setAttribute('role', 'status');
main.prepend($('error')); raceView.append(raceInfo, layout);
const footer = node('footer', 'p21-navigation'), developerButton = node('button', '', 'Developer Tools'); developerButton.id = 'openDeveloper'; developerButton.type = 'button'; developerButton.setAttribute('aria-controls', 'developerView');
footer.append(node('span', 'hint', 'P2.1 · In-memory race · Closing this page abandons the race'), developerButton); raceView.append(footer);
main.append(raceView, developerView);
// Keep the header compact and all original state text reachable in Developer Tools.
const headerBadge = document.querySelector('header .badge'); text(headerBadge, 'P2.1 · No career writes');
app.showView = value => {
  if (!['race', 'developer'].includes(value)) throw Error('Unknown presentation view');
  if (value === 'developer' && app.view === 'race') hiddenRadioPosition = app.radioBefore();
  app.view = value; raceView.hidden = value !== 'race'; raceView.inert = value !== 'race'; developerView.hidden = value !== 'developer'; developerView.inert = value !== 'developer';
  developerButton.setAttribute('aria-expanded', String(value === 'developer'));
  (value === 'developer' ? devTitle : developerButton).focus();
  if (value === 'race') {
    if (hiddenRadioPosition?.atBottom) transcript.scrollTop = transcript.scrollHeight;
    else if (hiddenRadioPosition?.anchor?.isConnected) transcript.scrollTop += hiddenRadioPosition.anchor.getBoundingClientRect().top - transcript.getBoundingClientRect().top - hiddenRadioPosition.relativeOffset;
    else if (hiddenRadioPosition) transcript.scrollTop = hiddenRadioPosition.top ?? 0;
    hiddenRadioPosition = null; updateUnread(); globalThis.P1?.draw();
  }
};
developerButton.onclick = () => app.showView('developer'); returnButton.onclick = () => app.showView('race');
let sequence = new StartSequence(), generation = null;
$('start').addEventListener('click', () => sequence.request());
const originalFrame = globalThis.P2.onFrame;
app.renderMetadata = (state = globalThis.P2.currentSnapshot?.state) => {
  const session = globalThis.P1?.session;
  if (!state || !session) return;
  if (generation !== session) { generation = session; sequence = new StartSequence(); }
  const values = playerProfile(state);
  text(name, values.driverName ?? 'Driver name unavailable');
  text(team, values.teamName ?? 'No team name supplied');
  text($('p2Identity'), `Racing Unit ${values.ruId}`);
  for (const [bar, label, value] of [[condition, conditionText, values.condition], [strain, strainText, values.strain]]) {
    bar.hidden = value === null; if (value !== null) bar.value = value;
    text(label, value === null ? 'Unavailable' : `${value.toFixed(1)} / 100`);
  }
  text(physical, `${values.status}${values.control ? ' · ' + values.control : ''}${values.physical ? ' · ' + values.physical : ''}`);
  const actual = state.entrants.find(r => r.id === state.playerId);
  text(remaining, actual ? ` ${actual.signs.remaining} opportunities remaining` : ' Unavailable');
  for (const card of $('p2SignChoices').children) {
    const sign = card.firstElementChild.textContent, labels = [];
    if (actual?.signs.active === sign) labels.push('Active');
    if (actual?.signs.pending === sign) labels.push('Queued');
    if ($('sign').value === sign) labels.push('Selected');
    // The legacy comparison harness re-enables every button when it finishes.
    // Re-project availability from the same native facts as Queue, not stale DOM.
    const unavailable = !actual || (state.format === 'Pure' && sign === 'Engage Rivals') || actual.status !== 'Racing' || actual.signs.remaining === 0 || session.phase === 'error' || ['Ended', 'Stalled', 'Error'].includes(state.status);
    card.disabled = unavailable;
    if (unavailable) labels.push('Unavailable');
    if (!labels.length) labels.push('Available');
    text(card.lastElementChild, labels.join(' · ')); card.setAttribute('aria-label', sign + ' — ' + labels.join(', '));
  }
  text(raceTitleName, state.track.name ?? session.options.course);
  // Mack 2026-11-27: race type and distance beside the track name; rallies read "Point to Point".
  const p2p = state.track.course && !state.track.closed;
  text(raceTitleMeta, ` · ${state.format} · ${isJoust(state) ? 'Joust: until one is wrecked' : p2p ? 'Point to Point' : state.config.laps + (state.config.laps === 1 ? ' lap' : ' laps')}`);
  const weather = typeof session.options.weather === 'string' ? session.options.weather : null;
  // Mack 2026-11-27: the status line is hidden on the race page; it only appears to report a worker problem.
  raceInfo.hidden = !(session.error || session.fallbackReason);
  text(raceInfo, `${state.format} · ${state.entrants.length} entrants${weather ? ' · ' + weather : ''} · ${state.time.toFixed(2)}s · ${state.status}${session.phase ? ' · ' + session.phase : ''}${session.error ? ' · Worker error: ' + session.error : ''}${session.fallbackReason ? ' · Synchronous fallback: ' + session.fallbackReason : ''}`);
  const current = sequence.project({phase: session.phase, started: session.started, tick: state.tick, countdownLeft: session.countdownLeft, mode: session.mode, playing: app.contextPlaying, terminal: ['Ended', 'Stalled', 'Error'].includes(state.status)}, performance.now());
  overlay.hidden = current.stage === 'hidden'; overlay.dataset.stage = current.stage; overlay.dataset.presentedTick = state.tick;
  text(countdownWord, current.word); text(countdownDetail, current.detail);
  text($('start'), session.mode === 'worker' ? session.started ? 'Resume Race' : 'Start Race' : state.tick > 0 ? 'Resume Race' : 'Start Race');
};
globalThis.P2.onFrame = state => { originalFrame(state); app.renderMetadata(globalThis.P2.currentSnapshot?.state ?? state); };
$('p2SignChoices').addEventListener('click', () => app.renderMetadata());
updateUnread();

// Existing preparation/error text stays authoritative and visible in either view.
new MutationObserver(() => { if (!globalThis.P1?.session) text(raceInfo, 'Preparing race — playback controls remain disabled until ready'); }).observe($('status'), {childList: true});
