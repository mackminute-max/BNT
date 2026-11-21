import {paintCompactStandings} from './standings.js';
import {playbackControls} from './model.js';
const $ = id => document.getElementById(id);
function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}
const app = globalThis.P22 = {version: 1};
document.body.classList.add('p22'); document.title = 'Blood and Thunder — P2.2 Full-Screen Race';
document.querySelector('header small').textContent = 'P2.2 · Full-screen race interface · Temporary artwork';
document.querySelector('header .badge').textContent = 'P2.2 · No career writes';
const layout = document.querySelector('.race-layout'), racePanel = $('race').closest('.panel'),
 signPanel = document.querySelector('.p21-sign-bar'), profile = $('driverProfile'),
 mapPanel = $('map').closest('.panel'), radioPanel = $('radio').closest('.panel'),
 controls = document.querySelector('.p21-race-controls'), developer = $('developerView');
const left = node('section', 'p22-primary'), right = node('aside', 'p22-support'), row = node('section', 'p22-race-row');
left.id = 'p22Primary'; right.id = 'p22Support'; row.id = 'p22RaceRow';
layout.append(left, right);
const leaderboard = node('section', 'panel p22-standings'); leaderboard.id = 'compactStandingsPanel';
leaderboard.append(node('h2', '', 'Standings'));
const table = node('table'), header = document.createElement('thead'), headerRow = document.createElement('tr');
for (const label of ['Pos.', 'Stable']) { const th = node('th', '', label); th.scope = 'col'; headerRow.append(th); }
header.append(headerRow); const compact = document.createElement('tbody'); compact.id = 'compactStandings'; table.append(header, compact);
table.setAttribute('aria-label', 'Presented race positions and stable names'); leaderboard.append(table);
const fullStandings = $('standings').closest('.panel');
const fullDetails = node('details', 'panel p22-full-standings'); fullDetails.append(node('summary', '', 'Full native standings and classification diagnostics'), fullStandings); developer.append(fullDetails);
row.append(racePanel, leaderboard); left.append(row, signPanel, profile); right.append(mapPanel, radioPanel, controls);
// The old wrappers are now empty; remove them without cloning any control/canvas.
for (const child of [...layout.children]) if (child !== left && child !== right) child.remove();
const mapKey = mapPanel.querySelector('details'); if (mapKey) developer.append(mapKey);
const radioFooter = node('div', 'p22-radio-footer'); radioFooter.append($('radioLatest'), $('radioUnread')); radioPanel.append(radioFooter);
profile.querySelector('h2').textContent = 'Driver & Team Profile';
const identity = profile.querySelector('.p2-identity'), details = node('div', 'p22-profile-identity'), gauges = node('div', 'p22-profile-gauges'), endurance = profile.querySelector('.endurance-panel');
details.append(identity, $('p21DriverName'), $('p21Team'), $('p21DriverStatus'));
gauges.append($('p21DriverCondition').closest('label'), $('p21DriverStrain').closest('label'));
const profileHelp = [...profile.querySelectorAll(':scope > .hint')][0];
if (profileHelp) { const info = node('details', 'p22-profile-help'); info.append(node('summary', '', 'About condition and endurance'), profileHelp); details.append(info); }
const effects = $('p21Effects'), profileBody = node('div', 'p22-profile-body'); profileBody.append(details, gauges, endurance, effects); profile.append(profileBody);
// Original handlers stay attached. Diagnostics remain in the internal tools view.
const advanced = node('section', 'panel p22-playback-tools'); advanced.id = 'advancedPlayback'; advanced.append(node('h2', '', 'Playback and replay diagnostics'));
const advancedControls = node('div', 'controls'); advanced.append(advancedControls);
for (const id of ['step', 'speed', 'drain', 'restart']) {
  const element = $(id); advancedControls.append(element.tagName === 'SELECT' ? element.closest('label') : element);
}
for (const child of [...controls.children]) if (child !== controls.querySelector('h2') && !child.classList.contains('controls')) advanced.append(child);
developer.append(advanced);
const zoomLabel = $('zoom').closest('label'); zoomLabel.classList.add('p22-follow-zoom');
const controlRow = $('start').parentElement;
controlRow.append($('start'), $('pause'), zoomLabel);
const feedback = node('p', 'hint'); feedback.id = 'p22PlaybackState'; feedback.setAttribute('role', 'status'); controls.append(feedback);
const footerNote = document.querySelector('.p21-navigation .hint'); footerNote.textContent = 'P2.2 · In-memory race · Closing this page abandons the race';
function updateControls() {
  const session = globalThis.P1?.session;
  if (!session?.state) return;
  const state = session.state, flags = playbackControls({mode: session.mode, phase: session.phase,
    started: session.started, tick: state.tick, status: state.status,
    playing: globalThis.P21.contextPlaying, pausePending: !!session.pausePromise});
  const start = $('start'), pause = $('pause');
  if (start.textContent !== flags.startLabel) start.textContent = flags.startLabel;
  if (pause.textContent !== flags.pauseLabel) pause.textContent = flags.pauseLabel;
  if (flags.holdStart) start.disabled = true;
  const message = session.phase === 'error' ? `Playback error: ${session.error ?? 'Worker unavailable'}. Inspect or restart in Developer Tools.` : `${session.phase ?? (globalThis.P21.contextPlaying ? 'playing' : 'paused / ready')}${session.mode === 'worker' ? session.pausePromise ? ' · Pause acknowledgment pending' : session.workerPaused ? ' · pause confirmed' : '' : ' · synchronous execution'}`;
  if (feedback.textContent !== message) feedback.textContent = message;
}
app.afterRender = () => {
  const session = globalThis.P1?.session;
  if (!session?.state) return;
  paintCompactStandings($('standings'), compact, {entries: session.setup?.entrants ?? [], playerId: session.state.playerId, tick: session.state.tick});
  updateControls();
};
const frame = globalThis.P2.onFrame;
globalThis.P2.onFrame = state => { frame(state); updateControls(); };
// Synchronous fallback can produce its first render before this module mounts.
app.afterRender();
