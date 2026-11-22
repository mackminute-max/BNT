# BNT E5-C — Lifecycle and Authority Integration Contract

Verification date: November 21, 2026 (America/Los_Angeles). Branch: `feat/m2-e5-c-integrated-career-loop`. Frozen runtime: `646fad6b7a6dff3b10d9718286840cc7b3c3bc97`. Accepted E5-B delivery baseline: `ee6963c41accad23a09981007eb1daa78f56f912` (runtime `4322672749091d8f0c7121d7f2d14f3d5bba67a7`). Local delivery only; no merge, push, release or deployment.

## Ownership

CareerStore owns career, official championship consequences, protected history and reward ownership. RaceSessionStore owns native checkpoints, accepted ordered inputs and prepared native results. IndexedDB coordinator owns durable generations/readsets. The worker prepares and validates; the iframe renders. Neither a frame, a finish animation nor a postMessage supplies an official result.

## Lifecycle

| Player action/state | Authority and allowed next step |
|---|---|
| Choose offer and assignment | Normal UI discloses actual ordered driver/beasts/chariot; confirmed existing registration commits fee and immutable setup once. |
| Preparation | Existing coaching command only; registered identity and condition remain locked. Manual Start required. |
| Active/paused race | E4 native advancement and journal authority; accepted packets become visible only after commit. Resume uses latest valid head. |
| Native resolved | Staged evidence only. Explicit existing D5 publication is required. |
| Official nonfinal result | Existing condition, standings and pending entitlement commit. Eligible mandatory Run selection blocks next event. No per-event championship payout/payroll/recovery. |
| Intermission | Only approved actions; next event starts manually, using frozen schedule and carried condition. |
| Elimination/withdrawal | Existing confirmed rules; rivals complete remaining schedule through the same native authority. No player rescue/refund. |
| No eligible starters | Typed authoritative eligibility evidence, no fabricated entrant, participation, condition change or award. |
| Terminal pending settlement | Existing dedicated trusted E5-B producer and M2-D settlement; generic UI completion objects are not accepted. |
| Pending Legacy | Eligible permanent one-of-three choice commits once. Recovery problems take priority and hide unsafe choices. |
| Archived | Stable unlocks under existing rules; selected Legacy persists into next championship. |

## Viewer protocol

Binding fields are `{version:1, profileId, careerId, instanceId, raceId, eventIndex, revision, maintenanceRevision, setupHash}`. Host establishes source-checked, token-bound MessageChannel. Requests have an ordered sequence and fixed binding. Native advance batches are bounded to 1–20 ticks. Display references include presented tick/time and bounded lead; forged/stale/cross-race references reject before writes.

`viewerRead(channel)` reconstructs a validated current session. Prepared `viewer` results initially say `durable:false`; only coordinator commit/ack exposes them as accepted. The original BufferedSession presentation chronology, interpolation and event validation remain in use. Internal observers read actual native steps, not a cloned practice simulator. No result-submission API is exposed to the iframe.

Native Sign commands are reused. A delayed displayed boundary uses existing `eligibleBoundary` and `buffer-delay-v1`, atomically with the queued command. Pause/step ordering remains journal-authoritative. Presentation retry cache is bounded32; source reference cache64; visual event tail200 does not prune authoritative history.

## Failure boundary

Worker restart, stale writer, quota failure, invalid reference or lost acknowledgment never authorize an invented input/result. Reopen/repair use existing latest durable authority. A failed pause can be reported while safely returning to management. Missing real race evidence blocks continuation; official typed no-starter evidence is explicitly distinct. No silent practice fallback, reroll, healing or second financial authority exists.

Complete career/session export and staged restore remain the existing E4 formats. Renderer packets are not backups. Advanced tooling remains available but the ordinary two-championship journey does not require it.
