# BNT M2-E E4 — Stage 1 Next-Gate Readiness

**Verdict: CONDITIONAL architecture proof / BLOCKED for Stage 2. Full E4 is not delivered.** No owner acceptance or deployment is claimed.

| Gate | Status | Evidence / limitation |
|---|---|---|
|B1 worker, validation, cache, determinism|PASS with performance qualifications|Five Node tests; real worker native replays, D2/standings comparison, corruption/missing-session rejection, restart, candidate reset and exact generation/byte cache checks. Total latency remains high; main-thread tasks still exceed the preferred 100 ms target|
|B2 coordinator/migration|CONDITIONAL PASS|Atomic database aborts, expected generation/read-set rejection, two-tab contention, durable native prepare, exactly-once official result, pre-commit failure and lost-ack retry; staged migration and witnesses tested at all durable boundaries. Injected quota failure preserves head. Actual quota override diagnostic exits 1 and does not establish real exhaustion recovery|
|B3 standalone direct-file|BLOCKED / unverified|Embedded bundle and HTTP reload/worker/IndexedDB/sentinel/legacy-guard proof pass. Managed file navigation is ERR_BLOCKED_BY_ADMINISTRATOR. Windows direct-file behavior has not been established|
|Stage 2 automatic checkpoints/recovery/backup|NOT STARTED|Authorization requires all mandatory Stage 1 proofs before continuation|
|Full E4 final acceptance|NOT READY|Incomplete Stage 2, Windows proof and quota evidence; no complete eight-entrant/twelve-event viewer-resume claim|

## Verified capacity versus missing coverage

The complete accepted reference set, thirteen logical records totaling 29,962,817 bytes, was validated, stored in IndexedDB and replay-checked across twelve eight-entrant events. No per-record bound was increased. This resolves the demonstrated Web Storage retention problem for that set in this HTTP Chromium origin. It does not prove every browser's quota, uninterrupted physical disk durability, eviction resistance, or a newly played automatic-checkpoint championship.

The database retains the prior head on subsequent commits. Physical duplication, staged migration copy retention and future live journal/checkpoint growth must be measured during Stage 2. No authoritative evidence was deleted to make the test fit. The largest tested decoded session and the 8 MiB logical record cap remain separate concepts.

## Remaining risks

- Main-thread transfer/database/serialization tasks remain above the 100 ms preference in observed runs; total worker preparation remains seconds to minutes for large cold validation. No total-latency speedup is claimed.
- IndexedDB capacity is finite and browser-specific. The Chromium quota-override command reports active but did not reject the test write; the failed diagnostic remains visible, separate from passing injected-abort checks.
- Direct-file IndexedDB and Blob-worker behavior depends on supported Windows browser context. HTTP tests cannot establish it.
- The ordinary career/championship UI has not been switched to the new coordinator. Explicit diagnostic migration blocks legacy management writes; full recovery UI is not yet available.
- Periodic viewer scheduling, durable tick/input acknowledgment coordination, browser-close race recovery, complete backup/restore activation and practical near-quota reserves remain unimplemented.
- Existing browser runners retain nonzero exits from direct-file restrictions, the obsolete circuit/rally selector and the legacy numerical diagnostic; consult raw exit codes rather than a blanket browser-pass claim.

## Required next action

1. Review the Stage 1 implementation and test evidence.
2. Run the [Windows direct-file proof](BNT_M2-E_E4_Windows_Stage1_Proof.md) and return exact outputs. Do not substitute HTTP or accept the complete milestone from this small probe.
3. Resolve or explicitly disposition the real-quota diagnostic with a supported browser quota/failure reproduction. The coordinator's injected denial safety is demonstrated; actual disk quota exhaustion is not.
4. Only once the mandatory proofs are satisfied, continue within the already bounded Stage 2 scope: scheduler, recovery UI, interrupted-operation handling, complete backup/restore, capacity and final regressions.

No new gameplay-policy decision is requested. The approved architecture direction is implemented in bounded form; the missing proof is operational/browser evidence. E5/E6, payroll redesign, rewards, registration unlock, merge, push and deployment remain unauthorized.
