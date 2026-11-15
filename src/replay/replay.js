import { createRace, step, capture, digest, issueSign } from "../sim/race.js";
import { canonical } from "../core/determinism.js";
import { VERSION } from "../config/config.js";
import { queueOverride } from "../dev/overrides.js";
function divergence(tick, category, details) {
  const error = new Error(`Replay divergence at tick ${tick}: ${category}`);
  error.details = { tick, category, ...details };
  throw error;
}
export function startReplay(record) {
  if (
    !record ||
    record.kind !== "BNT-replay" ||
    record.schema !== 1 ||
    record.version !== VERSION
  )
    throw new Error("Unsupported replay version");
  if (
    !Array.isArray(record.events) ||
    !Array.isArray(record.commands) ||
    !Array.isArray(record.checkpoints) ||
    !Number.isInteger(record.tick) ||
    record.tick < 0 ||
    record.tick > 1000000
  )
    throw new Error("Invalid replay structure");
  if (
    record.commands.some(
      (c, i) =>
        c.order !== i ||
        !Number.isInteger(c.tick) ||
        c.tick < 0 ||
        c.tick > record.tick,
    )
  )
    throw new Error("Invalid command order or tick");
  if (
    record.checkpoints.some(
      (c, i) =>
        !Number.isInteger(c.tick) ||
        c.tick < 0 ||
        c.tick > record.tick ||
        (i > 0 && c.tick <= record.checkpoints[i - 1].tick) ||
        typeof c.checksum !== "string",
    )
  )
    throw new Error("Invalid checkpoint structure");
  const state = createRace(record.setup),
    session = {
      record: structuredClone(record),
      state,
      eventCursor: 0,
      done: false,
    };
  if (canonical(state.initialRng) !== canonical(record.initialRng))
    divergence(0, "initial RNG", {});
  checkCheckpoint(session);
  return session;
}
function checkCheckpoint(session) {
  const tick = session.state.tick,
    expected = session.record.checkpoints.find((c) => c.tick === tick),
    actual = session.state.checkpoints.find((c) => c.tick === tick);
  if (Boolean(actual) !== Boolean(expected))
    divergence(tick, "checkpoint coverage", { expected, actual });
  if (actual && actual.checksum !== expected.checksum)
    divergence(tick, "checkpoint", {
      expected: expected.checksum,
      actual: actual.checksum,
    });
}
function checkEvents(session) {
  const { state, record } = session;
  for (; session.eventCursor < state.events.length; session.eventCursor++) {
    const actual = state.events[session.eventCursor],
      expected = record.events[session.eventCursor];
    if (canonical(actual) !== canonical(expected))
      divergence(state.tick, "event", { eventId: actual.id, expected, actual });
  }
}
export function advanceReplay(session) {
  if (session.done) return session.state;
  const { state, record } = session;
  if (state.tick < record.tick) {
    if (["Ended", "Stalled", "Error"].includes(state.status))
      divergence(state.tick, "early termination", { actual: state.status });
    const commands = record.commands
      .filter((c) => c.tick === state.tick)
      .map(({ tick, order, ...c }) => c);
    step(state, commands);
    checkEvents(session);
    checkCheckpoint(session);
  }
  if (state.tick === record.tick) {
    for (const command of record.commands.filter(
      (c) => c.tick === record.tick,
    )) {
      if (command.type !== "sign")
        divergence(state.tick, "unapplied final command", { command });
      issueSign(state, command.action, command.sign);
    }
    for (const edit of record.pendingOverrides ?? [])
      queueOverride(state, edit, { paused: true });
    checkEvents(session);
    if (state.events.length !== record.events.length)
      divergence(state.tick, "event count", {
        expected: record.events.length,
        actual: state.events.length,
      });
    if (digest(state) !== record.checksum)
      divergence(state.tick, "final checksum", {
        expected: record.checksum,
        actual: digest(state),
      });
    if (state.status !== record.status || state.time !== record.time)
      divergence(state.tick, "final metadata", {});
    session.done = true;
  }
  return state;
}
export function verifyReplay(record) {
  const session = startReplay(record);
  while (!session.done) advanceReplay(session);
  return {
    state: session.state,
    checksum: digest(session.state),
    checkpoints: record.checkpoints.length,
    events: record.events.length,
  };
}
export async function verifyReplayAsync(
  record,
  { yieldControl = () => new Promise((r) => setTimeout(r, 0)) } = {},
) {
  const session = startReplay(record);
  while (!session.done) {
    for (let i = 0; i < 100 && !session.done; i++) advanceReplay(session);
    await yieldControl();
  }
  return {
    state: session.state,
    checksum: digest(session.state),
    checkpoints: record.checkpoints.length,
    events: record.events.length,
  };
}
