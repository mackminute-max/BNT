export function emit(s, type, participants = [], effects = {}) {
  const event = {
    id: s.events.length + 1,
    type,
    time: s.time,
    tick: s.tick,
    fraction: (s.time - s.tick * s.config.dt) / s.config.dt,
    participants: [...participants].sort(),
    effects: structuredClone(effects),
  };
  s.events.push(event);
  return event;
}
