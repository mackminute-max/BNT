# M3-BC-P1 race boundary protocol

The original mechanical career schema, native engine, reporter, D5 clearance and protected official publication remain authoritative. The new player path is explicitly selected by the P1 build. Existing durable E4 APIs remain available for historical tooling and supported old saves.

## Durable and transient authority

1. Registration, fee and frozen setup are committed by existing career commands. Race birth is the existing durable tick-zero session and bindRace command.
2. The same embedded E4 worker creates a private `memory-attempt-v1` from the exact career-frozen setup. It runs the existing createRace/step/issueSign code through the existing bounded viewer. Playback and Sign acknowledgments explicitly mean **in-memory acceptance, not a saved checkpoint**. No backend snapshot, hashes, journal encoding, IDB generation commit or management redraw occurs per advance.
3. Pause/return within the same live worker retains this transient attempt. Worker/browser loss discards it. Reopen creates the same seeded starting state; old partially advanced checkpoints are validated for integrity but are not resumed. Corrupt/missing required authority blocks safely. A durable native-prepared/official result is never restarted.
4. At finalization, retain all native input effects, including rejected inputs and buffered Sign delay commands. Compact only empty advance intervals into native-equivalent segments (maximum 10000 ticks). Replay from frozen birth and compare the complete final state hash. Do not discard native events, precision, commands or RNG draws.
5. Publish the validated terminal native session as a session-v2 record, then use the unchanged trusted clearance capability and single protected official CareerStore commit. No reward or condition is invented by the viewer. Lost acknowledgment is recovered from these durable boundaries; repetition is idempotent and conflicting/stale source bytes reject.

## Session v2

The existing session fields and full validation remain. V2 adds sealed `boundary` metadata and the authority adds `boundaryHash` with authority version2. Metadata is exactly `{kind:'BNT-boundary-attempt',version:1,policy:'restart-seeded-v1',attemptId,sourceAuthorityHash,sourceRevision}`. All checkpoint, journal, result and record limits are retained. Native result/proof and controller reference schemas are unchanged. Old session-v1 records remain readable; old readers reject v2 instead of silently interpreting it.

A v2 replacement may supersede only its exact uncommitted source authority. Official results are immutable. Complete restore can recognize this exact forward replacement; other journal rewinds/conflicts remain rejected. Completed historical sessions are not rewritten or pruned. Unfinished-attempt inputs may be lost as explicitly authorized; completed protected history is retained.

## Concurrency and failures

Memory accepts are serialized in the worker with existing channel, binding, view and input identity checks. Final publication requires the original durable generation/read-set. Only this coordinator's acknowledged presentation/metadata-only commit may rebase the attempt to the new exact bytes; unrelated writers cannot rebase it. Storage, worker or stale-generation errors never claim saved progress. Native prepare and official commit are distinct durable steps; recovery distinguishes them.

Backup during an unfinished race contains the durable starting boundary, not transient race progress, and says so. Career-only and complete exports retain M3-BC pins/preferences. No mechanical migration, new simulation authority, forced finish or mid-race recovery guarantee is introduced.

## Signs

Preserve native queue, replacement cost, cancellation/no-refund, crossing activation and diagnostics. Use existing start signal, lap line and actual Rally Sign Points (Short 50%, Medium thirds, Long quarters); do not change track geometry to turn every Rally into Long. Optimization removes persistence and redundant UI work, not native decision rules. Inputs remain available throughout permitted playback.
