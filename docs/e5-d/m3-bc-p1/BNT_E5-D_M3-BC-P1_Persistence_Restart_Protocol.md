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

## Compatibility matrix

| Record/context | New candidate | Older M3-BC runtime |
|---|---|---|
| Legacy envelope-v1 career | Readable under existing supported migration/import rules; no destructive automatic migration | Existing behavior |
| Envelope-v2 M3-BC sidecar | Preserves profile/career identity, immutable pack pin and mutable commentary preference | Existing behavior |
| Native session-v1 ACTIVE | Fully validated; cold P1 gameplay starts from frozen tick-zero setup, not old partial progress | Original durable resume |
| Native session-v1 terminal/prepared | Recover/publish existing authority; never restart a completed race | Original behavior |
| Session-v2 committed boundary proof | Strict validation and existing official publication/recovery | Unsupported version rejects safely |
| Complete backup containing session-v2 | Retains journal, native proof, boundary seal and career sidecar; exact compatible forward source transition supported | Unsupported new session rejects |
| Unfinished P1 attempt backup | Contains durable starting boundary; transient attempt/inputs are explicitly excluded | No claim of mid-race continuation |

Mechanical career schema remains 6; envelope remains 2 with envelope-1 compatibility; native checkpoint format is unchanged. The new session record version is not a mechanical save migration.

## Exact commit/restart sequence

1. Existing protected registration and fee commit.
2. Existing durable race birth and controller bind commit; seed/setup/entrant IDs become restart authority.
3. Transient worker advancement and native Sign transcript. UI says unsaved; no durable tick acknowledgment.
4. Final replay and full-state equality; native clearance required.
5. Terminal session-v2 prepare committed through IndexedDB read-set/generation checks.
6. Existing capability validation and protected official CareerStore commit apply all result/condition/standings effects once.
7. Existing reward and settlement commands are separate consequential durable decisions.

On closure before step5, discard the unfinished attempt and reconstruct step2. Between5/6, recover prepared native proof. After6, use the existing official record even if the response was lost. No new fee, package grant or event result is created during restart. No unsafe legacy fallback is added.

Cold snapshot manifest bytes are checked before creating an attempt. Same-tab re-entry reuses the same worker attempt; own acknowledged metadata/presentation changes may rebase only when career mechanics and source-session bytes are unchanged. Foreign generation changes reject. No cache token supplied by a caller is accepted as authority.

## Career deletion and recovery

# Career deletion protocol

A confirmed deletion requires a fresh validated slot/profile/career/generation selection and the existing writer lock. The selected slot's IndexedDB authority is cleared in one strict transaction. A small `deleted-career` marker plus an empty advanced-generation head remain, so new readers forbid legacy fallback and both new and older stale writers fail their generation/read-set checks.

Only that database is cleared. No other slot/database, shared configuration or unrelated profile is traversed for deletion. Current profiles and Legacy ownership are embedded in individual careers; no shared Owner Legacy database exists in this source. This change does not introduce a new account/profile store or merge Legacy. Every other stored profile/Legacy copy remains unchanged.

For the legacy slot, only its validated career key, matching profile/career race-session keys and its own discovery witness are removed. Unrelated Web Storage keys remain. Unknown ownership or corruption is rejected rather than guessed.

The catalog entry is removed only after authority retirement and legacy cleanup commit. Cross-database writes are not claimed atomic. If cleanup/index removal fails after retirement, the slot is quarantined as “Finish deleting career”; its marker permits an idempotent, ownership-checked retry. It is never advertised as playable or successfully deleted before this completes. A failed retirement transaction leaves the original authority intact.

Deleting the active slot first pauses through the existing Options barrier, then returns to title after successful deletion. Other careers remain available. External backups are not deleted; restoring one intentionally uses an empty destination, not a stale write to the retired database.
