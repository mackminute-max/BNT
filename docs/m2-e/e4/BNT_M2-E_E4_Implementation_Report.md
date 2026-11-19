# BNT M2-E E4 Implementation Report

**Status: STOPPED AFTER GATE A. E4 runtime integration is not implemented or accepted.** Date: November18,2026 (America/Los_Angeles).

## Authorization boundary and result

The profiling and capacity evidence establishes that the accepted storage representation cannot retain the measured maximum-field championship in the tested Chromium Web Storage origin. The recommended solution requires a major storage/coordinator change. The owner authorization Section14.8 explicitly requires stopping when **“A major storage architecture replacement becomes necessary.”** No such replacement, production optimization, automatic scheduler or restore implementation was undertaken without that review.

This is a measured technical blocker and architecture proposal, not an E4 completion claim. The accepted E3 implementation remains unchanged. No E5/E6, gameplay, balance, payroll, financial authority, merge, push, release or deployment changes.

## Exact baseline

- Repository: `mackminute-max/BNT`.
- Local branch: `feat/m2-e-e4-persistence-recovery`.
- Accepted runtime source: `8d5abe9442e93cb318ef87d4ef47ee0de0e457e2`.
- Initial HEAD: documentation-only `56111653b7d97e2d16203968e397f305d4e0968f`; source/tests/scripts-built-application comparison against accepted E3 verified.
- Accepted ancestors E2/E3`770d994a5c61dc0d3cf37a74d170fe654374e63b`, foundation`5870d18c5fb6455767e918ad0df9e1e64cbecb2e`, M2-D`06fd511170148caf744abf57449c4cc5d6c4e2c5` retained. Older main was not substituted.
- Diagnostic tooling commit: `0d8c061c9b32fce1fadde55469fac5dd3bbed012`. Documentation commit is reported at delivery; it cannot contain its own immutable hash.
- Pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` preserved and excluded.

Source authority reviewed: approved58-policy specification, D1–D5 addendum, reconciliation/plan/readiness, accepted foundation/E2/E3 reports and E3 completion reports. Current authority and accepted source were compared; historical reports were not rewritten. D2 Mapping v1 and the E3 durable-prepare→single-career-commit boundary remain intact.

## Files added

| File | Purpose |
|---|---|
|`scripts/m2-e/e4/profile.mjs`|Fixed-seed headless fixtures, per-operation timing, delegating diagnostic observers, sampled CPU, memory/size/journal observations and native replay assertions|
|`scripts/m2-e/e4/fixture.mjs`|Development-only accepted-fixture adapter with valid nonnegative eight-entrant test points; no production catalog or scoring change|
|`scripts/m2-e/e4/browser-profile.mjs`|Isolated Chromium quota/storage/load/publication/long-task diagnostic; direct-file attempt and explicit HTTP fallback; source-built diagnostic namespace injected only into the test page|
|`scripts/m2-e/e4/analyze.mjs`|Inclusive sampled-call ancestry analysis; overlapping categories explicitly labeled|
|`docs/m2-e/e4/`|Required reports, profiling report, architecture proposal, deferred Windows checklist and reproducible evidence|

No files under `src`, existing `tests`, package manifests or application configuration changed. The existing build was executed and produced byte-identical HTML aliases. No migrations or existing save edits occurred. In-process observers run only in the separate development benchmark process and preserve native state/RNG;32 native capture/replay assertions and12 prior E3 proof references matched.

## Profiling findings

See [Profiling Report](BNT_M2-E_E4_Profiling_Report.md) for the full matrix. The principal costs are repeated reconstruction, canonical serialization/hashing, codec work and cloning, not the measured storage-write duration. Inclusive sampled career reconstruction accounts for80.35% of active samples; inclusive hashing60.55% overlaps that category. Exclusive SHA-256 plus canonical-serialization frames account for about70.6% of all samples. These percentages must not be added across inclusive categories.

Confirmed call paths:

- `src/persistence/envelope.js:69`: `makeEnvelope` validates provenance/history and parses its newly serialized result.
- `src/persistence/career-store.js:38`: `publish` parses/validates that candidate again before its byte-CAS/storage write.
- `src/career/championships/anchor.js:6`: stored-anchor reads parse the envelope then call `validateState` again.
- `src/career/championships/controller.js:79`: reconstruction iterates receipts and repeatedly merges/protects history.
- `src/persistence/race/session-store.js:51`: decode includes checkpoint/journal/native validation and financial-anchor checks; publication decodes the staged record again.

The measured browser four-entrant publication occupied one approximately12.245s main-thread task. Eight-entrant twelve-event Node publication reached74.200s, and transitions reached15.223s. The100ms preference is not met by the accepted implementation. No before/after improvement is claimed: no production optimization was made.

## Capacity blocker

The complete eight-entrant twelve-event fixture finished in the headless engine with all8 actual entrants in every event. Every native capture replay matched; all events reached Ended and the championship reached SETTLEMENT_PENDING. Final career:2,246,709 bytes; largest session:4,886,153 bytes. Each stayed below its existing8MiB bound. All retained career/session values total **29,962,817 bytes**, across13 keys.

In a fresh Chromium origin, copying the validated final set failed with `QuotaExceededError` at the second session record. This is a capacity probe, **not a successful restore or a tested restore protocol**. The pre-final set also could not fit, so browser publication for that workload was not attempted. In the measured live-growth data, retained values already totaled6,640,590 bytes after event3; crossing the observed quota there is an inference from the measured sizes, not a claim of an executed browser live-race failure at that exact tick.

The separate ASCII quota probe stored19×262,144-character chunks, then rejected the next while preserving its sentinel. State bytes/code units are distinguished in the datasets; this is tested origin capacity, not a universal browser or disk-byte quota claim.

Whole-set diagnostic compression produced20,841,041-byte gzip and20,599,868-byte Brotli-quality5 payloads. Even hypothetical16-bit packing of the latter requires10,299,934 code units before metadata, beyond this tested origin's capacity. Neither codec was installed in the game. This does not prove that every possible domain-specific lossless encoding is impossible; a new authority representation would itself require substantial compatibility proof.

## Recommended bounded continuation

[Architecture Proposal](BNT_M2-E_E4_Architecture_Proposal.md) requests explicit approval for a native IndexedDB coordinator plus an inline worker. Preserve synchronous domain-store APIs and existing logical record bounds; do not inject an async `setItem` into them. Move preparation/validation to a worker, commit through revision/read-set-checked durable transactions, acknowledge only after completion, and retain E3's native prepare then official career commit protocol.

Before that major change, safe reuse opportunities have been identified, but not implemented: private immutable validated snapshots keyed by exact bytes/identity/revision; removal of repeated validation within one trusted operation; indexed protected lookups; lightweight UI projections. These alone do not supply storage capacity or remove the requirement to fully validate untrusted cold loads.

## Features deferred at the stop

Automatic periodic checkpoint scheduling, new recovery UI/state integration, coordinated backup format, restore transaction protocol, backend migration, quota preflight and full E4 fault/cross-browser acceptance are **not implemented**. Existing E3 recovery/checkpoint APIs remain available with their accepted limitations. No new backup format, storage limit or checkpoint encoding was silently introduced.

## Standalone reference and Windows

`npm run build` succeeded. Both existing aliases remain553640 bytes, SHA256 **`3de9bb977a50022f0bf9488b3922129aa09ee819f03e402638c4f68795d35a65`**. This is the accepted E3 application rebuilt identically, **not a new E4 feature build**. Managed direct-file navigation remained administrator-blocked; HTTP profiling does not verify Windows file-origin interruption robustness.

The [Windows acceptance checklist](BNT_M2-E_E4_Windows_Acceptance.md) is explicitly deferred until E4 exists. E3 owner acceptance is established by the present authorization; new E4 owner acceptance is not claimed.
