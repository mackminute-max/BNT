# Blood and Thunder — E5-D M3-BC-P1 Implementation Report

**Candidate:** corrective implementation complete; owner Windows acceptance pending.

## Exact baseline and candidate

- Branch: `feat/e5-d-m1-startup-slots-options`; unchanged Git HEAD: `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`.
- Accepted Main M3 and M3-BC source were already uncommitted. Their working-tree manifest was verified before edits; this candidate is identified by the supplied source manifest, not by HEAD alone.
- Original M3-BC HTML remains byte-for-byte unchanged: SHA-256 `ec2283def7e3b391bff520b3390bdafad7bdb2e9cab79b066da73df30ec206ae`.
- Original Main M3 remains unchanged: `ffa0784406a0e2156a4bef2b9343a8b30bf1baf18a2336e40f86f2cf1ea0c16f`.
- New artifact: `Blood-and-Thunder-E5-D-M3-BC-P1-Playable.html`, **3,088,430 bytes**, SHA-256 `5996a56df462c320374dc334501fc93781d4ed79f23cf845d2742b2e8629dbe8`.
- Source manifest SHA-256: `ddbd974bcffd521d625b13c291524d8291f754b461ff605c8ad5d6d5f426248b`. The manifest covers frozen `src`, `tests`, `scripts`, and `content` bytes. Reports are separate deliverables. No branch, commit, push, merge, release or deployment was performed.

## Verified root cause

The old player path called the durable coordinator for small viewer advances and Signs. Each request reconstructed and validated session/career authority, encoded and hashed native state and journal data, committed a new IndexedDB generation, then refreshed the management surface. The status also labeled some read/control operations as saving. This was genuine avoidable persistence overhead, not merely a misleading indicator. Raw native simulation and alternate commentary were much cheaper than the old durable request path. See the separate performance report and raw JSON.

## Delivered changes

| Requirement | Implementation and source |
|---|---|
| In-memory player race | `src/persistence/race/memory-attempt.js`: `MemoryAttempt` and narrow `MemorySession` run the existing `createRace`, `step` and `issueSign` through the existing `ChampionshipViewer`. No alternate physics or outcome calculator. |
| Worker and durable boundary | `src/persistence/e4/worker-service.js`: `attemptRead`, `attemptExecute`, `memoryPrepare`; `src/persistence/e4/client.js:44–46`: attempt APIs and `finishAttempt`. Exact source generation/read-set checks remain. |
| Explicit protocol compatibility | `src/persistence/race/session-store.js:56–58`: session-v1 remains readable; sealed session-v2 boundary metadata is allowed only for a terminal native result. No mechanical career-schema change. |
| No per-tick management rebuild | `src/ui/durable-championships.js`, `src/ui/career-saves.js`: dedicated transient race transport; native preparation and official publication still use the durable coordinator. |
| Buffered viewer retained | `src/management/career-race/buffered-session.js`, `host.js`: accepts explicitly identified memory packets, preserves tick/event delivery, pause, playback speed, queued Signs and view-bound input checks. |
| Honest save status | Host distinguishes unsaved memory acceptance from final validation/saving; the same worker can retain a paused attempt during navigation, while browser/worker loss restarts it. |
| Clear result continuation | `host.js`: one `#careerRaceContinue` finalizes then publishes. `flow.js`: authoritative pending Run/Legacy states show Continue to Rewards; settlement and recovery remain accurately labeled. |
| Confirmed career deletion | `src/management/startup/shell.js`, `slots.js`: selected identity/generation checks, named styled confirmation, cancel, inactive/active handling, cleanup retry. |
| Retired database safety | `src/persistence/e4/indexeddb.js:27–28`: atomic selected-authority retirement, deletion marker and advanced empty generation; stale writers cannot recreate the career. |
| Isolated candidate build | `src/management/startup/entry.js:4` and `scripts/e5-d/m3-bc-p1/build.mjs`: P1 build flag; preserved earlier standalone artifacts. |

## Finalization and failure safety

Race birth/frozen configuration remains durable. Ordinary advances and accepted Signs are transient and explicitly labeled unsaved. At completion, replay the ordered native input transcript from the exact frozen setup, compare the complete native state hash, require existing D5 clearance, persist native terminal evidence, then perform the existing single protected official CareerStore transaction. These are distinct durable boundaries; they are not misrepresented as a multi-key atomic write.

Failure before native prepare leaves career consequences unchanged. Failure between prepare and publication leaves recoverable prepared evidence. Lost official acknowledgment is resolved from the committed career rather than by applying effects twice. Unfinished, corrupt, conflicting or stale attempts reject. No forced finish, invented retirement, extra reward or relaxed validator was added.

## Deletion semantics

Only the selected slot's database and matching legacy keys are removed. A small retirement marker and empty advanced-generation head remain to prevent resurrection. Slot-index cleanup follows retirement; if cleanup fails, the career is quarantined as **Finish deleting career** and cannot load. The UI never reports this as successful deletion or falsely promises all data remains intact. Active deletion returns safely to title. Full behavior is documented in `CAREER_DELETION_PROTOCOL.md`.

The current source embeds Owner/Profile Legacy ownership in career saves; it does not implement a separate shared Legacy database. Other careers, profiles, Legacy copies and shared configuration are not traversed or changed. External backup files remain the user's responsibility.

## Preserved contracts

The baseline-file comparison found no changes to `src/sim`, `src/ai`, `src/core`, `src/career`, native reporting, tracks, accepted reference fixtures, package grants, financial formulas, protected career history or old tests. M3-B immutable pins and M3-C preference remain in the approved envelope sidecar. All 23 source recruitment offers retain original IDs. Commentary uses the same authoritative event stream; turning alternate wording off restores native presentation. No new content, reward mechanic, dependency or later milestone was introduced.

## Limitations and acceptance

- Unfinished race progress and Signs may intentionally be lost on browser reload/closure or worker loss. Restart uses the same saved setup, not a new seed. A corrupt or missing required birth/session blocks instead of rerolling.
- Final replay, validation, backup and official commit remain potentially expensive. This milestone removes them from ordinary playback, not from necessary durable boundaries.
- Session-v2 is backward-readable in this candidate; older software rejects it. Preserve earlier backups and artifacts. Restoring into an unrelated/retired destination is not permitted silently.
- Existing logical journal/record limits remain. Memory input history is checked before acceptance; the work is not a capacity increase or historical evidence pruning.
- Managed Chromium blocks direct `file://` launch. Actual Windows Chrome/Edge acceptance remains required. No browser storage or download can be promised permanent.
- Existing developer/E4 diagnostic APIs retain their durable behavior; the new normal player path uses boundary saving.

See the individual test evidence, restart protocol, Sign findings, performance report, changed-file CSV and Windows checklist. Stop here for owner review.
