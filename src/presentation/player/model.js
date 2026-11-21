// Read-only UI projections. No RNG, simulation advancement or command authority.
export function playerProfile(state) {
  const entrant = state?.entrants?.find(r => r.id === state.playerId);
  const ru = entrant?.ru, driver = ru?.driver;
  const finite = value => Number.isFinite(value) ? value : null;
  return {
    ruId: entrant?.id ?? 'Unavailable',
    driverName: typeof driver?.name === 'string' && driver.name.trim() ? driver.name : null,
    teamName: typeof ru?.teamName === 'string' && ru.teamName.trim() ? ru.teamName : null,
    condition: finite(driver?.condition), strain: finite(driver?.strain),
    chariotCondition: finite(ru?.chariot?.condition), chariotWear: finite(ru?.chariot?.wear),
    beastFatigue: (ru?.beasts ?? []).map(b => finite(b.fatigue)),
    status: entrant?.status ?? 'Unavailable', control: entrant?.control ?? null,
    physical: entrant?.physical ?? null
  };
}

// Cosmetic words derive from the existing countdown/playing state. In particular,
// elapsed countdown alone can never authorize GO. A new session owns a new model.
export class StartSequence {
  constructor() { this.requested = false; this.seenCountdown = false; this.goAt = null; this.usedGo = false; }
  request() { this.requested = true; }
  project({phase, started, tick, countdownLeft, mode, playing = false, terminal = false}, now) {
    if (terminal || phase === 'error' || phase === 'closed') return {word: '', detail: '', stage: 'hidden'};
    if (phase === 'countdown' || phase === 'countdown-paused') {
      this.seenCountdown = true;
      const word = countdownLeft > 1.5 ? 'READY' : 'SET';
      return {word, detail: phase === 'countdown-paused' ? 'Paused before playback' : 'Preparing race playback', stage: word.toLowerCase()};
    }
    if (phase === 'initial-buffering') {
      this.seenCountdown = true;
      return {word: 'SET', detail: 'Waiting for the race buffer — playback has not started', stage: 'set'};
    }
    const advancing = mode === 'worker' ? started && phase === 'playing' && tick > 0 : this.requested && playing && tick > 0;
    if (!advancing && this.usedGo) this.goAt = null;
    if (!this.usedGo && advancing && (this.requested || this.seenCountdown)) {
      this.usedGo = true; this.goAt = now;
    }
    if (advancing && this.goAt !== null && now - this.goAt < 850) return {word: 'GO!', detail: 'Race playback started', stage: 'go'};
    if (phase === 'buffering') return {word: '', detail: 'Buffering — presented race held', stage: 'waiting'};
    return {word: '', detail: '', stage: 'hidden'};
  }
}

export function nearRadioBottom({scrollHeight, scrollTop, clientHeight}, tolerance = 24) {
  return scrollHeight - scrollTop - clientHeight <= tolerance;
}
