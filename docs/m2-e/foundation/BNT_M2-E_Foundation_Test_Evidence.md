# BNT M2-E Foundation Test Evidence

**Date:** 2026-11-18 (America/Los_Angeles). **Scope:** E0 + minimal E1 + early E4 only.

- Branch: `feat/m2-e-foundation`.
- Accepted M2-D baseline: `06fd511170148caf744abf57449c4cc5d6c4e2c5` (implementation `c8371a8e26115c04f86ff91e7f45f2cda4bafb13`; tree `0123fcb6544ff08aa98c6b3de2140b8c05c35e87`).
- Foundation implementation commit: **`5870d18c5fb6455767e918ad0df9e1e64cbecb2e`**. A subsequent documentation-only commit contains these reports/evidence.
- Owner Windows acceptance of M2-D is established by the current authorization; historical reports were retained without rewriting their earlier pending-acceptance statements.
- Local main remains `f66ec90a6659dd6bb675815bff4cc33e9850a643`. `git fetch origin` was attempted before work; accepted ancestry/source was verified locally. No substitution of older main occurred.
- Initial tracked tree clean; pre-existing `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` was preserved and excluded from commits.

## Executed gates and counts

| Gate | Actual command / method | Result |
|---|---|---|
| E0 accepted ancestry/source | git HEAD/tree/status, ancestry, fetch; existing artifact in-memory bundle comparison | Accepted06fd511 source, original hash matched |
| E0 complete Node | `npm test` before production changes | **409 passed,0 failed,0 skipped** |
| E0 browser | Nine existing scripts in isolated accepted-source copy |118 groups completed; known legacy selector timeout; direct-file policy blocks retained |
| E0 replay/native/numeric | `node scripts/m2-d/verify.mjs` |12 historical,5 package adapters,5 golden cycles,2 payroll replays passed |
| Final complete Node | `npm test` on final source | **443 passed,0 failed,0 cancelled,0 skipped**;409 retained+34 new;291543.94453ms under overlapping development/browser load |
| Final browser | Ten unmodified/current runners, including new foundation runner, on exact final artifact in isolated copy | See table; only known legacy selector runner fails |
| Final historical replay verification | `node scripts/m2-d/verify.mjs` on final source |12/12 unchanged;5 adapters,5 numeric cycles and2 payroll captures reproduced |
| Build | `npm run build` | Passed, aliases identical; existing no-external-runtime guard passed |
| Scope/whitespace | git diff comparison against accepted source and `git diff --check` | Engine/AI/tracks/replay/M2-D cycles/dependencies unchanged; whitespace clean |

Node final log: [evidence/final/node.log](evidence/final/node.log). Baseline log: [evidence/e0/node.log](evidence/e0/node.log). Current report results are fresh executions, not copied historical acceptance claims. No retained test or expected replay vector was weakened or replaced.

## Complete real-race resume comparisons

Eight entrants per race, seeded real simulator, full run after restoring a serialized tick30 checkpoint containing pre-race and paused Sign state. Zero random incident frequency deliberately exercises Infinity preservation. Full authoritative capture and complete encoded native state match uninterrupted runs; finish/clearance behavior is real simulation, not a fabricated finish fixture. Additional test covers nonzero incident scheduling/RNG and a scheduled hazard.

| Format | Course | Terminal tick | Checksum | Mid-race checkpoint bytes | Comparison |
|---|---|---:|---|---:|---|
| Pure | Oval | 1156 | `43edd74b` | 67460 | Exact match |
| Combat | Oval | 1156 | `03844c08` | 97000 | Exact match |
| Pure | C01 | 1966 | `801994b2` | 77480 | Exact match |
| Combat | C01 | 1966 | `e4479cb8` | 107056 | Exact match |
| Pure | mixed-rally | 1761 | `91a581b8` | 76040 | Exact match |
| Combat | mixed-rally | 1761 | `25aec856` | 105676 | Exact match |

[Machine-readable comparisons](evidence/final/resume-comparisons.json). Existing historical vectors are separately listed in [verification.json](evidence/final/verification.json); they were compared to accepted checksums, not updated. New payroll vectors remain Pure `ad509187` and Combat `f191ca35`; those are different fixtures from the six resume cases.

## Required technical proof inventory

| Requirement | Executed coverage |
|---|---|
|1 Uninterrupted versus restored | Six complete real Pure/Combat Oval/Circuit/Rally comparisons |
|2 RNG and incident schedule | Exact live RNG compare, nonzero scheduler and scheduled hazard test |
|3 Zero frequency sentinel | Infinity survives JSON; future captures remain equal/no added random incidents |
|4 Approved Sign boundaries | Pre-race/paused queue carried through six full native races; native Oval/Circuit/Rally activation preserved |
|5 No extra uses | Paused queue/replacement/reload/duplicate tests and browser storage proof |
|6 Paused order | Persistent operation IDs, total journal sequence, tick/phase/watermark and request fingerprints |
|7 Interrupted write | Denial before commit rolls back; lost acknowledgement after atomic write reopens committed result |
|8 Corrupt newest checkpoint | Previous validated generation plus complete committed tail reproduces head |
|9 Missing journal | Integrity/sequence/hash mismatch rejects; both bad generations RecoveryRequired |
|10 Incompatible versions/config | Direct checkpoint/session version, setup/entrant identity, ownership and unresolved-boundary rejection |
|11 Cleared commit once | Real Ended race publishes proof aggregate then reload returns duplicate |
|12 Stalled/uncleared reject | Explicit blocked state, no publication/advancement; no fabricated classifications |
|13 No duplicate consequences | Repeated result identity leaves native/standings/claim proof unchanged |
|14 Conflict rejection | Different finalization identity and conflicting input IDs reject |
|15 Storage atomicity | Failed result publication retains prior bytes/state; no partial conditions/standings/claims |
|16 Historical compatibility |12 accepted replays exact; all409 old tests retained |

Additional coverage: five package migrations and JSON round trips; old command accepted after migration; stale/foreign/unconfirmed/version/duplicate requests; failed migration persistence; protected-history cap and pre-foundation restore refusal; immutable identity/descriptor data; Unicode/high-entropy dictionary reset stress and decompression bounds; new browser Web Lock serializes competing writes and rejects stale operation rather than losing an acknowledged input.

Some failure/wreck and financial-change fixtures deliberately alter synthetic starting state or invoke test-only completion helpers. They verify downstream behavior, not naturally emerging healthy-race casualty rates. No proof result credits Gold or calls M2-D settlement.

## Browser results

Commands ran as `node <script>` from an isolated final-source copy to preserve historical evidence. Exit1 for file-policy blocks is not suppressed. Group counts are completed functional groups, not individual assertions/races.

| Script | Completed groups | Reported functional outcome | Exit |
|---|---:|---|---:|
| `scripts/m2-d/browser.mjs` | 14 | PASS | 1 |
| `scripts/m2-c/browser.mjs` | 20 | PASS | 1 |
| `scripts/m2-b-browser.mjs` | 13 | PASS | 1 |
| `scripts/m2-a-browser.mjs` | 12 | PASS | 1 |
| `scripts/persistence-browser.mjs` | 18 | PASS | 1 |
| `scripts/browser-test.mjs` | 23 | BLOCKED: functional checks passed over HTTP, actual file launch denied by browser policy | 1 |
| `scripts/track-expansion/browser.mjs` | 10 | PASS | 0 |
| `scripts/circuit-rally/browser.mjs` | 1 | FAIL | 1 |
| `scripts/combat-ai-refinement/browser.mjs` | 7 | functional checks passed | 0 |
| `scripts/m2-e/browser.mjs` | 10 | PASS | 1 |

**128 completed groups.** Nine runners finish their functional assertions; the historical circuit/rally runner completes the Oval group then times out selecting a no-longer-exposed preset. It is the owner's accepted separate maintenance issue, not a new regression; the runner and relevant selectors remain unchanged from the accepted baseline. Current track suite independently passes all15 fixed-track selections and full Oval/Circuit/Rally parity, without claiming it replaces every unexecuted historical assertion.

All ten direct-file attempts were blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`. HTTP fallback was the existing disclosed testing behavior; no administrator restriction was bypassed. Offline-after-load tests apply where runners implement them. New foundation browser assertions pass with no page errors/runtime resource requests, including real browser storage and Web Locks. This is **managed-browser HTTP verification**, not Windows `file://` acceptance.

[Browser summary](evidence/final/browser-summary.json) includes raw exits, errors and counts; individual JSON/log files preserve the exact failure and file-policy limitation.

## Storage sizing and performance

Final benchmark: eight default Combat entrants, Mixed-Terrain Rally, no Sign intervention, seed145, zero random incidents, complete native race and atomic proof publication.

- Terminal status **Ended**, tick **1485**.
- Serialized session before result **4086582 bytes**; after result **4094760 bytes**.
- Cleared publication **True**; unchanged8MiB encoded bound respected.
- Full create/advance/validate/finalize measurement **32192.88ms**. This includes simulation and multiple integrity/serialization passes; it is not per-frame or per-checkpoint latency.
- Automated regression for this case independently recorded **4094851 bytes** (different fixture instance IDs) and verified reload/idempotency.

[Size benchmark](evidence/final/size-benchmark.json). Browser quota may be lower than the codec bound. Large configurations can still reject safely or require manual mode; no universal capacity/performance guarantee is made. Full-E4 viewer integration must address synchronous cost and storage policy before automatic periodic use.

## Development failures retained

The original descriptor-heavy graph codec exceeded8MiB for normal eight-entrant data. The first compressed attempt passed22/23 focused cases but failed the final Combat Rally state size; an additional default eight-entrant durable Rally stress case exposed remaining overhead. Compact descriptors plus LZW16 transport fixed these within the same proof gate; limits and native data were not weakened. Initial failure logs are retained in this evidence directory. No failed expectation was changed into a weaker assertion; the stronger default Rally case became an automated test.

An obsolete pre-lock regression run was stopped after being superseded by the final frozen-source run, to remove redundant CPU load. Its interruption is not a final acceptance run; the completed final configured suite exited0 with443 passes and zero cancellations. Full suite/browser timing reflects development load, not a controlled performance benchmark.

No unresolved new assertion failure remains. Known legacy browser-runner failure and managed direct-file restriction remain explicitly separate.

## Artifact and source integrity

Both aliases: **474374 bytes**, SHA-256 **`fe48c76f4a7e6988db88fd334a746b62513e497480bd7cffe2831e806c40299a`**. Simulation version remains `0.6.0-tracks`; old replay format, formulas and numerical defaults are unchanged. Foundation wire/session versions are1 and compression is `lzw16-v1`. No new dependency or network runtime asset was added. New artifact owner Windows acceptance has not been claimed.
