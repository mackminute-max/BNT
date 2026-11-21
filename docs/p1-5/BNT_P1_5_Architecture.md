# BNT P1.5 — Buffered Playback Architecture

Status: implemented locally for owner review. No career persistence, P2, merge or remote publication is included.

## Ownership and clocks

`src/prototype/buffered/worker.js` owns the unchanged native race engine, complete mutable race state, RNG, AI, combat, condition, events, native digest cadence and official clearance. Main-thread `client.js` owns a presentation clock and compact, read-only projections. `app.js` connects the existing Canvas camera/map, radio, HUD and controls. It does not calculate Worker race outcomes.

The three-second countdown uses real elapsed time. Native precomputation runs during it. Initial playback requires 0.75 native seconds, or a completed race; otherwise an explicit buffering state appears. Target lead is 1.0 native second, maximum permitted lead 2.0. At 4×, one native second protects only 250 ms of wall time. The native tick remains 0.05 s. Changing playback speed changes consumption, not native integration or RNG.

The Worker schedules at most four native ticks per task and receives credit referencing an actually issued presentation tick. It cannot compute the entire race ahead. Frames are bounded to 64; event queues/delivery are bounded to 8,192; messages contain at most 64 events. Native complete history remains in the Worker. Historical frame references retain 64 ticks. Command identities retain at most 1,024 requests. Capacity violations stop explicitly rather than dropping events or skipping native ticks. Diagnostic rolling samples are bounded.

## Versioned protocol

Envelope: `{version:1,generation,seq,type,...payload}`. Separate monotonic sequence streams cover main→Worker and Worker→main. A new Worker and generation are created on preparation/reset; stale generations are ignored. Gaps and conflicting duplicates reject. Duplicate command IDs with identical payload return the stored authoritative disposition; conflicting reuse rejects without another opportunity spend.

Requests: prepare, run, presentation credit, presentation-start notification, command, pause, native step, diagnostic native checkpoint/export, shutdown. Replies: ready, compact frame, event batch, command status, pause/step acknowledgment, completion, error and diagnostic export/checkpoint. Playback speed stays on the presentation side; credit communicates its resulting consumption. No per-render full checkpoint or full-history transfer occurs.

Static track/setup data is sent once. Per-tick projections include positions, status, progress, signs, condition, limited diagnostics and hazards. AI_DECISION presentation events omit candidate graphs but preserve native IDs, timestamps, participants and decision linkage. Native authoritative events are not modified. Event batches carry a presentation tick in addition to their unchanged native event tick/time; this prevents a tick-zero start event from appearing during countdown merely because it was computed early.

Every crossed presentation sample is consumed chronologically. Canvas-only interpolation uses adjacent native positions and stops across lap/checkpoint/course-entry/status/control changes. It cannot mutate native state. HUD, standings, effects and commentary consume the same presented sample. Future completion/classification stays withheld until the terminal sample is presented. Explicit Worker command acknowledgments and buffer diagnostics may refer to future authoritative work and are labeled as such.

## Underruns

The viewer holds its latest valid sample when it reaches the Worker. It never invents future positions. A refill threshold of 0.75 native seconds avoids rapid oscillation. Occupancy, lead, underflow count/duration, native tick/digest timing, message bytes, approximate transfer latency and main receive cost are measured separately. An underrun is a visible hold, not a skipped simulation interval.

## Strategy Signs and deterministic input

Native queue/cancel/lower actions retain their accepted semantics and opportunity accounting. Commands carry their unique ID and presented tick/time. Worker arrival determines a live acceptance tick, which is recorded in the native ordered command history. Replays use those native ticks/orders, not wall-clock arrival times.

A normal accepted queue waits for its next native start/finish or Rally Sign Point. If the *next boundary still eligible from the presented timeline* has already been simulated within the actual bounded lead, the Worker additionally records `buffer-delay-v1`. Its structured version-1 payload lives in the existing Sign command payload, with the queue order, presented reference, boundary event ID and pre-start flag. Native validation checks that proof against the existing event/command history.

`src/ai/buffered-signs.js` derives pending delayed authority from the native history and its SIGN_DELAY_REQUESTED proof event. There is no hidden Worker-only future action. The hook in `decide()` runs **after** the existing cadence/danger gate, before decision scoring. It activates at the next naturally occurring legal decision; it neither forces an extra decision nor rewinds movement, RNG, fatigue or combat. Existing physical constraints and exceptional driver resistance continue to apply.

Queueing spends one opportunity. The marker and activation spend none. Only successful cancellation/replacement supersedes a valid pending proof; rejected requests do not. Cancellation/replacement retain the existing no-refund policy. Received, accepted-queued, rejected, superseded/canceled, activated-normal/delayed and not-activated-at-race-end dispositions are explicit. An unexpected failure after native input acceptance blocks the Worker rather than falsely reporting rejection and continuing.

Replay schema 1 and the existing native checkpoint container remain unchanged. This is an additive, explicitly versioned Sign-action union. **P1.5 is required to understand P1.5 delay commands**; backward readability by an older executable is not promised. Historical actions and golden outputs remain unchanged. Pending delayed actions are restored from the ordinary checkpointed command/event history.

## Pause and single-step

Pause freezes presentation immediately, then waits for the Worker to acknowledge a native boundary. Buffered future samples remain intact. Resume consumes them chronologically; it never jumps to the Worker head.

Executing a native single-step while an unpresented tail exists would produce a misleading jump. The UI therefore provides **Present buffered tail** while the Worker remains confirmed paused. This only plays already-computed samples. Once the tail is drained, **Step** executes exactly one new native tick and presents it. Step is disabled during countdown and while pause acknowledgment or tail drainage is outstanding. This distinction is intentional and visible.

## Lifecycle and fallback

The standalone HTML contains an esbuild-bundled Worker string and creates a Blob Worker. No adjacent script or network service is needed. URLs are revoked after readiness or failure/reset; terminated generations cannot affect a replacement race. Initialization denial/time-out falls back, explicitly labeled, to the existing synchronous viewer with the same configuration. Runtime Worker failure stops the current race; there is **no silent mid-race fallback or fabricated recovery**. The player may explicitly restart the unfinished in-memory race.

Diagnostic preparation from an existing native checkpoint is supported and begins presentation at that checkpoint; it is not automatic live buffer restoration. Mid-race durability, transparent crash recovery and generalized rollback remain outside P1.5. The controlled A/B development harness remains available in explicitly selected synchronous mode.

## Build and isolation

`scripts/p1-5/build.mjs` bundles the new main entry and Worker separately and embeds both in `dist/Blood-and-Thunder-P1.5-Playable.html`. The existing P1.4 artifact, production career/E4 backend, migration formats, protected history and dependency stack are untouched. There are no new runtime dependencies or career writes.
