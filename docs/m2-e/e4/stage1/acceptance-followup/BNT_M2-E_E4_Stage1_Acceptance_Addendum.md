# BNT M2-E4 — Stage 1 acceptance addendum

Date: November 18, 2026 (America/Los_Angeles).

**Result: quota diagnostic resolved; final-runtime automated verification passes. Windows owner acceptance remains pending. Stage 2 has not begun.** This is not owner acceptance of Stage 1 or completion of E4.

## 1. Exact tested source

- Branch: `feat/m2-e-e4-persistence-recovery`.
- Final Stage 1 runtime: **`1cde0b0a6d6f49fc3a87ca886e87fd79cd501948`**.
- Repository HEAD: `5e9619652a995a321fd5932224e10f059e10f1dd` (subsequent documentation only).
- `git diff --exit-code 1cde0b0a6d6f49fc3a87ca886e87fd79cd501948 -- src tests dist package.json package-lock.json scripts/build.mjs` exits **0**.

The complete Node suite was rerun against these final runtime files, including the final migration ordering and legacy/manual compatibility fixes—not just the earlier `3301eb6` intermediate tree. This follow-up changes only development diagnostics and documentation. No production source, application limits, schemas, dependencies, gameplay, or artifact bytes changed. No new commit, merge, push, release or deployment was performed. The pre-existing untracked audit was preserved.

Environment: Node 24.22.1; npm 11.9.0; Chromium 156.0.8078.79; existing esbuild 0.28.2 and playwright-core 1.65.1. No dependencies were installed or updated.

## 2. Quota finding and disposition

**Classification: incorrect diagnostic timing assumption, explained by Chromium behavior; no coordinator implementation defect was demonstrated.**

The original script opened/wrote IndexedDB before applying the lower origin quota. Chromium can reuse a decaying cached bucket-space allowance instead of immediately querying its quota manager. A quota override can therefore report active while a warm bucket temporarily admits a write. `navigator.storage.estimate()` is not an authoritative assertion that this DevTools override was applied or ignored.

The controlled experiment confirms the distinction:

| Case | Observation |
|---|---|
|Original diagnostic, reconstructed without assertion changes|Failure reproduced, exit **1**: warm write admitted despite active 200000-byte override|
|Three fresh origins, override applied **before app navigation or any IndexedDB access**|All three native `QuotaExceededError` rejections; current and previous heads unchanged; no durable acknowledgment; generation 1 survives reload|
|Exact same candidate after removal of the test override|All three retries commit generation 2|
|Warm-origin control|Immediate write admitted; after **32272 ms**, another write is rejected with native `QuotaExceededError`, preserving current/previous heads and generation 2|
|Corrected original fault runner|All **4 groups pass**, exit **0**; cold-origin 200000-byte quota rejects an **8 MiB** logical-record pressure fixture|

The three repeated cold cases use 1 MiB origin quotas and 2 MiB pressure values; the corrected original runner retains the original 200000-byte limit and exercises the existing 8 MiB logical record ceiling. The baseline is a real validated M1 career envelope. The added pressure record is a **synthetic storage fixture**, not an admissible native session or gameplay result. These tests exercise the actual IndexedDB coordinator and native browser quota enforcement, without monkey-patching errors. They do not fill the host disk or establish universal browser quotas.

Upstream Chromium independently documents a 30-second bucket-space cache: [bucket_context.h](https://github.com/chromium/chromium/blob/main/content/browser/indexed_db/instance/bucket_context.h), `kBucketSpaceCacheTimeLimit` and its comment; [bucket_context.cc](https://github.com/chromium/chromium/blob/main/content/browser/indexed_db/instance/bucket_context.cc), `CheckCanUseDiskSpace` / `GetBucketSpaceToAllot`. The downloaded upstream snapshot supports the explanation; it is not claimed to be the exact source revision of the managed browser. Native cold/warm/expiry behavior was measured directly.

The corrected test strengthens the assertions: native error required, no false acknowledgment, unchanged current **and previous** generation, reload preservation, and same-candidate recovery. Existing injected quota-denial and transaction-abort assertions are unchanged. The old failed output is retained. **No quota waiver or owner disposition is needed for the previously unresolved diagnostic:** a supported, reproducible native-origin-quota test is now established. Real disk-full/eviction behavior and Windows quotas remain outside this claim.

## 3. Commands, results and raw exits

Executed from `/workspace/BNT` unless noted. Evidence is in [evidence](evidence/). `OUT` below is `/workspace/deliverables/m2e-e4-followup`; environment-output paths avoid overwriting accepted historical reports.

| Exact command | Actual result | Exit |
|---|---|---:|
|`npm test`|**512 passed, 0 failed, 0 skipped**, 499741.668 ms|0|
|`node scripts/m2-d/verify.mjs` from isolated `/tmp/bnt-e4-followup-verify` snapshot|12 historical references; 5 native package adapters; 5 payroll golden cycles; 2 payroll replays pass|0|
|`node scripts/m2-e/e4/acceptance/references.mjs`|Fresh 12 historical/2 payroll references exactly match retained accepted values; retained payroll artifacts themselves replay correctly|0|
|`BNT_CHAMP_CLOCK_EVIDENCE_DIR=$OUT/clock node scripts/m2-e/championship-clock-parity.mjs`|100 initial states and 3 full Node/Chromium captures match|0|
|`node scripts/m2-e/e4/acceptance/quota.mjs`|3 cold repetitions plus warm/cache-expiry proof pass|0|
|`BNT_E4_STAGE1_OUT=$OUT node scripts/m2-e/e4/stage1-faults.mjs`|4/4 groups pass, including corrected native quota case|0|
|`BNT_E4_STAGE1_OUT=$OUT/publication node scripts/m2-e/e4/stage1-browser.mjs --publication-only`|6/6 groups pass, including unchanged injected quota/abort tests, stale/conflicting writer, migration, worker restart, corrupt/missing evidence, pre-commit failure and lost-ack official publication|0|
|`node scripts/m2-e/e4/acceptance/windows-api.mjs`|Exact documented snippets work through DevTools REPL APIs; expected HTTP direct-file rejection retained; **not Windows acceptance**|0|
|`npm run build` (twice)|Identical final artifact and identical aliases; external-runtime-dependency scan passes|0, 0|
|`node /tmp/bnt-e4-followup-verify/historical-faults.mjs`|Intentional reproduction of the original erroneous warm-origin assertion; output directory substitution only|**1**|

This is the full configured Node suite plus targeted follow-up browser checks, **not a claim that every historical browser runner is green**. The known obsolete selector/legacy numerical diagnostics were not altered or retired. Initial diagnostic attempts included an unavailable browser-command-line inspection and a Windows-snippet checker using ordinary eval, which does not support console top-level await; those failed attempts are retained. The checker was corrected to DevTools REPL mode without weakening the documented acceptance checks.

Payroll checksums remain **Pure `ad509187` / Combat `f191ca35`**. Full championship-clock captures remain **Oval Pure `a74e4f71`**, **C01 Combat `005252df`**, **mixed-rally Combat `069e4340`**. No expected replay values were rewritten.

## 4. Standalone artifact

`dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html` remain byte-identical:

- **988319 bytes**.
- **SHA-256 `5d03542c2f7c45cf76a920a5a0591047b4c571535960864ea2d41bce84135a51`**.

Two builds reproduce the previous final Stage 1 artifact exactly. The downloadable `Blood-and-Thunder-E4-Stage1-Proof.html` is a copy of those exact bytes. It embeds the worker; no new runtime dependency or server requirement was introduced.

## 5. Windows acceptance preparation

Use [the final Windows instructions](BNT_M2-E_E4_Windows_Proof_Final.md). They identify the exact hash/size, print the initial generation explicitly, reject nonempty proof databases, require the recorded positive N after full browser exit/reopen, and check protocol, secure context, Web Locks, IndexedDB, embedded worker, typed sentinels and generation.

The actual snippet/API check runs offline after HTTP document loading and deliberately reports `directFile:false`, producing the expected acceptance rejection. It verifies API names and arguments, not Windows behavior. **The owner must still run the final artifact directly through `file:///` on Windows and return both printed JSON records.** Managed direct-file restrictions were not bypassed. No owner Windows acceptance is inferred from HTTP reload.

## 6. Remaining gates and scope

The quota diagnostic and final-source regression gaps are closed by this evidence. **Remaining acceptance gate: owner Windows direct-file results and review.** Earlier Stage 1 responsiveness/capacity qualifications remain unchanged; this follow-up is not a new maximum-field performance study or physical disk-exhaustion certification.

No automatic checkpoints, recovery UI, coordinated backup/restore, E5 settlement, E6 content or unrelated gameplay changes were implemented. Stage 2 remains unauthorized. Stop here for owner review; do not infer further implementation authorization from passing diagnostics.
