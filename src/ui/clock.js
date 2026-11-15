// Presentation scheduler only: it requests whole fixed ticks from the engine.
export function advanceFrames(
  accumulator,
  elapsed,
  speed,
  dt,
  advance,
  stopped,
) {
  if (
    ![accumulator, elapsed, speed, dt].every(Number.isFinite) ||
    elapsed < 0 ||
    speed < 0 ||
    dt <= 0
  )
    throw new Error("Invalid playback clock");
  accumulator += Math.min(elapsed, 0.25) * speed;
  while (accumulator + dt * 1e-9 >= dt && !stopped()) {
    if (advance() === false) break;
    accumulator = Math.max(0, accumulator - dt);
  }
  return accumulator;
}
