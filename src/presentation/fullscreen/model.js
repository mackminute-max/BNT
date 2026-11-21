export const UNAVAILABLE_STABLE = 'Stable name unavailable';
// Only explicitly organizational metadata is eligible. Never infer a stable name
// from an RU ID, a generic entry.name, a driver, a beast or an unrelated career.
export function stableIdentity(id, entries = []) {
  const matches = entries.filter(entry => (entry?.ru?.id ?? entry?.id) === id);
  const names = new Set();
  for (const entry of matches) {
    const value = [entry.stableName, entry.teamName, entry.stable?.name, entry.team?.name, entry.ru?.stableName, entry.ru?.teamName]
      .find(value => typeof value === 'string' && value.trim());
    if (value) names.add(value.trim());
  }
  const known = names.size === 1;
  return {id, name: known ? [...names][0] : UNAVAILABLE_STABLE, known};
}
export function compactOrder(presentedRows, entries, playerId) {
  // Input order and positions come directly from the original standings, including
  // native ties/nonfinishers. This function contains no sort/ranking calculation.
  return presentedRows.map(row => ({id: row.id, position: String(row.position),
    ...stableIdentity(row.id, entries), player: row.id === playerId}));
}
export function playbackControls({mode, phase, started, tick, status, playing, pausePending}) {
  const terminal = ['Ended', 'Stalled', 'Error'].includes(status);
  const stopped = terminal || phase === 'error' || phase === 'closed';
  let startLabel = (mode === 'worker' ? started : tick > 0) ? 'Resume Race' : 'Start Race';
  if (stopped) startLabel = status === 'Ended' ? 'Race ended' : 'Playback stopped';
  else if (playing) startLabel = ['countdown', 'initial-buffering'].includes(phase) ? 'Starting…' : phase === 'buffering' ? 'Waiting…' : 'Racing';
  return {startLabel, pauseLabel: pausePending ? 'Pausing…' : 'Pause',
    holdStart: stopped || !!playing || !!pausePending};
}
