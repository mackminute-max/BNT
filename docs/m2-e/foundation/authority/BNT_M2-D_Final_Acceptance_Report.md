# BNT M2-D Final Acceptance Report

**Review date:** 2026-11-18 (America/Los_Angeles).  
**Technical verdict: CONDITIONAL ACCEPT.** The inspected M2-D subsystem satisfies the available approved policy/test gates with no identified critical or major implementation defect. Outstanding conditions are independent Windows direct-file operation/persistence verification for this exact artifact and explicit disposition of the obsolete circuit/rally browser runner failure. Managed browser policy prevents that verification here. This report recommends acceptance subject to that condition; it does not record formal owner acceptance or authorize merge/M2-E.

## 1. Exact source and repository verification

| Item | Verified value |
|---|---|
| Repository | `https://github.com/mackminute-max/BNT.git` |
| Inspected local path | `/workspace/BNT` |
| Branch | `feat/m2-d-payroll-lifecycle` |
| HEAD | `06fd511170148caf744abf57449c4cc5d6c4e2c5` — M2-D documentation/evidence |
| Implementation commit | `c8371a8e26115c04f86ff91e7f45f2cda4bafb13` |
| HEAD tree | `0123fcb6544ff08aa98c6b3de2140b8c05c35e87` |
| Local main / merge base | `f66ec90a6659dd6bb675815bff4cc33e9850a643` — accepted M2-C |
| Relationship | main is an ancestor; feature branch is two commits ahead, zero behind local main |
| Remote observation | Read-only `git ls-remote origin refs/heads/main refs/heads/feat/m2-d-payroll-lifecycle` returned main at `f66ec90…`; no matching remote feature-branch ref was returned |
| Tracked working tree | Clean at start and end |
| Pre-existing untracked state | `docs/m2-e/`, including the earlier readiness audit; left untouched |

`git diff --numstat c8371a8 HEAD -- src tests scripts dist` was empty: the delivery HEAD contains the same implementation, tests, scripts and artifacts as the reported implementation commit. The second commit adds documentation/evidence. No M2-E controller implementation was found in the M2-D source diff. Source is available locally; the feature commit must not be assumed already pushed or merged.

Runtime: Node **v24.22.1**, npm **11.9.0**, Chromium **156.0.8078.79**; existing esbuild **0.28.2**, playwright-core **1.65.1**. No installation or dependency/configuration changes were made.

## 2. Approved requirements and records available

The complete approved Revision1 M2-D authority was present under `docs/m2-d/authority/` and reviewed in prescribed order:

1. `00_START_HERE.md` — scope, source baseline, hard boundaries.
2. `01_APPROVED_RULES.md` — payroll, restrictions, morale, contracts, departures, emergency, recovery, confirmed failure.
3. `02_SCHEMA_AND_TRANSACTIONS.md` — schema/history/trust/atomicity/recovery requirements.
4. `03_INTEGRATION_AND_IMPLEMENTATION.md` — staged gates and compatibility requirements.
5. `04_ACCEPTANCE_MATRIX.md` — A01–A14 and mandatory fault cases.
6. `05_SOURCE_PREFLIGHT_RESOLUTION.md` — approved preflight resolutions and conservative failure fallback.

`sha256sum -c SHA256SUMS.txt` in that directory passed **6/6** supplied authority files. Also reviewed: `M2_D_IMPLEMENTATION_REPORT.md`, `SCHEMA_AND_TRANSACTION_API.md`, preflight records and `WINDOWS_ACCEPTANCE.md`. They accurately distinguish the future completion seam from a live championship controller and separate historical HTTP browser evidence from pending Windows acceptance.

No owner record confirming M2-D Windows acceptance or formal acceptance was supplied or found in the available delivery records. Prior acceptance of M2-C is not acceptance of M2-D. The lack of live championship orchestration is an explicit approved exclusion, not a missing M2-D feature.

## 3. Test execution and evidence preservation

The full documented Node suite was run against the original source. Browser and verification scripts write evidence by design, so they ran against an unmodified isolated copy at `/tmp/bnt-m2d-final-review`, with the same source/artifact bytes and existing dependencies. No scripts/tests were edited. Their generated outputs stayed in the copy; fresh logs and result JSON were copied to the standalone deliverable evidence directory. Repository historical evidence was not overwritten.

### Node regressions

Actual command: `npm test` → `node --test tests/*.test.js`.

**409 tests passed, 0 failed, 0 cancelled, 0 skipped, 0 todo; 127637.209408ms (~127.64s).** This is the complete available configured Node suite: 351 retained tests plus58 new M2-D tests. Earlier tests were not deleted or changed: the `main..HEAD` test diff contains only the new M2-D helper, fixture and three test files.

Log: [node-tests.log](m2d-final-evidence/node-tests.log).

### Browser suites — all nine available browser runners

Each runner was executed unmodified using `node <script>` in the isolated copy. These rows count functional check groups, not individual assertions or independent races. The six current acceptance runners comprise100 groups; the additional historical track/circuit/combat runners add their own checks and are reported separately rather than silently omitted.

| Actual command suffix | Functional groups completed | Assertion outcome | Exit code | Elapsed |
|---|---:|---|---:|---:|
| `scripts/m2-d/browser.mjs` | 14 | Functional checks passed | 1 | 47.91s |
| `scripts/m2-c/browser.mjs` | 20 | Functional checks passed | 1 | 18.85s |
| `scripts/m2-b-browser.mjs` | 13 | Functional checks passed | 1 | 7.44s |
| `scripts/m2-a-browser.mjs` | 12 | Functional checks passed | 1 | 4.98s |
| `scripts/persistence-browser.mjs` | 18 | Functional checks passed | 1 | 5.26s |
| `scripts/browser-test.mjs` | 23 | Functional checks passed | 1 | 35.91s |
| `scripts/track-expansion/browser.mjs` | 10 | Functional checks passed | 0 | 61.81s |
| `scripts/circuit-rally/browser.mjs` | 1 | FAIL — see evidence | 1 | 36.53s |
| `scripts/combat-ai-refinement/browser.mjs` | 7 | Functional checks passed | 0 | 1.5s |

**Total: 118 functional groups completed successfully, with one browser runner failing on a preset-selection timeout.** Eight runners completed their functional checks; the ninth (legacy circuit/rally) completed one check before failing. This is not an all-browser-suite pass. All nine attempted direct `file://` access and encountered the managed browser administrator restriction. The six current acceptance runners intentionally exit1 despite passing their HTTP functional assertions. Some historical runners exit0 after HTTP checks even with file access blocked; that is not evidence of direct-file acceptance. Exit codes are preserved above, not relabeled as successful direct-file tests.

HTTP fallback was the existing disclosed runner behavior; no administrator restrictions were bypassed. Offline-after-load behavior is tested where implemented in each runner. Circuit/rally and Combat AI historical HTTP checks do not establish offline-origin persistence. No page errors or unexpected runtime requests were reported by the eight successful functional suites. The legacy circuit/rally runner records its selection timeout in its errors list. Browser/Node parity includes full capture comparisons, not only displayed placements.

Evidence: [browser-exits.json](m2d-final-evidence/browser-exits.json) and one `<name>-browser.json` / `<name>-browser.log` pair per table row. Browser JSON contains the direct-file block and detailed check descriptions. The M2-D browser payroll-context Combat checksum was **`d8553fdb`**; the general racing/workbench fixture checksum was **`43ba2ec0`**, Combat fixture **`b1145632`**. These are different defined fixtures, not conflicting checksums for the same input.

### Deterministic/native/numeric verification

Actual command: `node scripts/m2-d/verify.mjs` in the isolated copy, exit0.

- **12/12** accepted historical replay checksums matched.
- **5/5** starting-package migration/native adapters matched before/after migration.
- **5/5** fixed zero-income payroll cycles matched the independently specified golden numeric fixture (35 Gold assessed per cycle; 175 arrears after five).
- **2/2** new full-race payroll-context replays reproduced exactly: Pure **`ad509187`**, Combat **`f191ca35`**.

These categories are separate checks, not additions to the409 Node test count. Records are synthetic diagnostic fixtures, not proof that ordinary live championships already exist.

Evidence: [verification.json](m2d-final-evidence/verification.json), [verify.log](m2d-final-evidence/verify.log), `payroll-Pure.json.gz`, `payroll-Combat.json.gz`.

## 4. Requirements coverage — A01–A14

Every acceptance family is represented by existing source, executed Node tests and/or executed browser groups. Coverage does not imply exhaustive proof of all possible states.

| Requirement | Source evidence | Executed coverage / assessment |
|---|---|---|
| A01 Pure previews, stale revisions/fingerprint | `cycles/reducers.js:66–68`; `schema4.js:85–89`; `career-store.js:93–116` | Repeated pure quote, stale source/dual revisions/cross-career rejection; browser migration preview/cancel |
| A02 Once-per-championship settlement | `cycles/reducers.js:9–10,26–30`; `schema4.js:28–30,85–89`; `career-store.js:105–116` | Trusted completion only, request/effect retry/conflict, tombstone, no per-race payroll |
| A03 Exact wages/allocation/conservation | `cycles/reducers.js:11–16,31–48`; `contracts.js:8–9,38–60` | Zero/partial/full income, specialist/reserve wages, old-first ordering, stable-ID ties, overflow and fixed golden cycles |
| A04 Voluntary repayment/archive | `cycles/reducers.js:18–21,49–50` | Partial/full payment, immediate streak reset, historical claims after release and later repayment |
| A05 Debt states/restrictions | `cycles/policy.js:6–9`; `schema4.js:25–34` | All debt thresholds; discretionary quotes/reducers incl XP training restricted; essential paths retained; browser Default/payment reset |
| A06 Payroll control adapter | `model/payroll-control.js:1–8`; `cycles/racing-adapter.js:6–9`; `sim/race.js:117–122,147,231,402–413`; `dev/overrides.js:168–178` | All statuses, malformed contexts, per-entrant isolation/frozen input, dynamic and paused/reference derivation paths, serialized replay and exact bundled/Node parity |
| A07 Expiry/renewal/release | `cycles/reducers.js:41,51–55`; `policy.js:11–16` | Final wage before expiry; all3 terms/new identity/signing/wage; expiry eligibility; explicit assigned release with no dangling references |
| A08 Default departures | `cycles/reducers.js:42–46` | No fourth-settlement departure; fifth opportunity, one max, deterministic order, assigned deferral/last eligible driver protection and retained claims |
| A09 Emergency driver only | `cycles/reducers.js:56–60`; `policy.js:16–19` | Fixed native/personality/condition fields; one-cycle20 wage/zero signing, max one, normal recruitment/capacity gates, expiry; no other grant |
| A10 Confirmed failure | `cycles/policy.js:20–32`; `reducers.js:61–62`; `policy.js:8` | Operational/Blocked versus proven supply exhaustion; source revalidation, explicit failure/cancel/retry; terminal read-only/export/history |
| A11 Recovery | `cycles/reducers.js:23,38–45` | Synthetic nonzero injury/fatigue fixture, legal clamps, Critical unchanged, no strain/integrity/wear changes; ordering verified in source |
| A12 Persistence/protected history | `cycles/contracts.js:69–75`; `schema4.js:61–89`; `career-store.js:25–50,119–158` | Primary write denial/rollback/manual checkpoint, failed migration, corrupt primary/explicit recovery, old checkpoint refusal, complete newer import, malformed/ownership/revision/result checks, retained caps |
| A13 Earlier milestones/replay/standalone | All409 Node tests;12 references; source comparison; in-memory build | Retained tests and accepted modules unchanged; five package/native comparisons; existing HTML source parity. Windows direct-file acceptance remains missing |
| A14 Completion-only boundary/scope | `cycles/completion.js:4–19`; `schema4.js:28–30`; `ui/stable-cycles.js:25–28,38–39` | Arbitrary untrusted completion rejects, terminal withdrawal/DQ fixtures, production settlement disabled without authority; no championship controller or reward schedule introduced |

Test details: `tests/m2-d-maintenance.test.js:9–19`, `tests/m2-d-transactions.test.js:13–37`, `tests/m2-d-racing.test.js:1–11`; independent fixed values in `tests/data/m2-d-payroll-v1.json`. Some numerical/condition fixtures deliberately call pure reducers on synthetic state; persistence reconstruction/import/rollback is separately exercised through CareerStore tests. Do not present all reducer fixtures as naturally reached career saves.

### Important verified accounting and lifecycle rules

Settlement preserves the approved order: authorized income → old claims → all active current wages → debt streak → recovery → decrement/expiry → deterministic departure/defer → immutable statement. Treasury never intentionally becomes negative; safe integer overflow rejects. The complete active contract roster is checked against the completion, including reserves and specialists.

Driver-only emergency assistance is explicit, respects capacity and recruitment blockage, has no ordinary early-termination fee invented for its special term, and can be released at expiry. It grants no beasts/chariots/equipment/staff/Gold. No cycle or payroll occurs on migration, race completion, refresh or departure.

Failure assessment is deliberately conservative: it proves failure only when the optimistic superset of all owned and remaining-market indispensable beasts/chariots is insufficient. Other uncertain cases remain Blocked. This conforms to the approved fallback; it is not a full viability solver. Confirmation is never automatic.

M2-D recovery intentionally changes management driver fatigue, beast fatigue and allowed injury labels only; native strain/integrity/wear remain unchanged. The future M2-E integrated condition mapping is not an M2-D defect or an authorization to change those semantics during this review.

## 5. Determinism and backward compatibility

Freshly verified historical vectors:

| Seed | Format | Course | Driver mode | Checksum | Outcome |
|---|---|---|---|---|---|
| 145 | Pure | oval | reference | `fe1bfab8` | Match |
| 145 | Pure | C01 | reference | `1e9d7e68` | Match |
| 145 | Pure | mixed-rally | reference | `d13a8fdf` | Match |
| 145 | Combat | oval | reference | `79dec048` | Match |
| 145 | Combat | C01 | reference | `cd29b4b3` | Match |
| 145 | Combat | mixed-rally | reference | `38fdb4e1` | Match |
| 145 | Pure | oval | autonomous | `821eca67` | Match |
| 145 | Pure | C01 | autonomous | `c1730efa` | Match |
| 145 | Pure | mixed-rally | autonomous | `4120f7c5` | Match |
| 145 | Combat | oval | autonomous | `c8fd3ca0` | Match |
| 145 | Combat | C01 | autonomous | `3ef47ff6` | Match |
| 145 | Combat | mixed-rally | autonomous | `fd015e71` | Match |

The verifier compares captured historical checksums, not regenerated expected values. Payroll-context replay uses an explicit opt-in version; no-context preserves original native shape and numerical path. Source inspection confirms only the authorized control wrapper was added at initial, dynamic and paused-override derivations. No AI/physics/track coefficient changes were found.

`git diff --quiet main HEAD --` over native RU formulas, AI, track, config, replay, M1 legacy-state, M2-A/B schema2/history, M2-C schema3/validation/base/maintenance-history/reducers, package manifests and build script returned0. Those accepted modules remain byte-identical. Existing tests are retained unchanged. New schema4 validates/reconstructs its origin and command history rather than editing old schema records in place (`schema4.js:61–80`).

Existing envelope/history stay version1; schema/registry4, command3 and versioned3→4 maintenance are dispatched additively. Tests cover mixed history and old import compatibility. This establishes tested compatibility, not an unlimited guarantee for all possible user-created files or future versions.

## 6. Source/build and standalone verification

Both existing standalone aliases are identical:

- `dist/Blood_and_Thunder.html`
- `dist/Blood-and-Thunder-Track-Test.html`
- Size: **436032 bytes each**.
- SHA-256: **`d1a586a64066b40e40fb540e090c61d48b975d89cecca92e1377aa5b4af3a1a7`**.

A non-writing esbuild invocation reproduced the existing build options (`src/ui/app.js`, browser IIFE, es2020, legal comments none, `write:false`), embedded the bundle in the existing HTML template and compared the entire generated string to both artifacts. Exact equality and the build script's external-runtime-dependency guard both passed. No replacement artifact was written. This verifies source-to-artifact parity under the installed toolchain without modifying deliverables.

`npm run build`/`npm run check` were deliberately not invoked in the repository because they write outputs; equivalent build computation ran in memory and browser tests ran on the already-delivered HTML. No dependency installation, typecheck or lint command was needed; no typecheck/lint scripts are configured. Source/test/script whitespace diff check passed. A final comparison of every tracked source/test/script/artifact file in the isolated copy matched the original repository; see [source-and-artifact-verification.json](m2d-final-evidence/source-and-artifact-verification.json).

A first in-memory-build diagnostic used the authority-directory working directory and could not resolve `src/ui/app.js`; it was rerun from the repository root and passed without changing any file or configuration. Two initial test launches attempted to write external logs before the isolated-copy setup had completed; they did not run the verifier/browser tests. Both were rerun successfully after setup. These invocation mistakes are not suppressed implementation failures or modifications to tests.

All browser runners attempted file-origin navigation. All were blocked with `ERR_BLOCKED_BY_ADMINISTRATOR`. Existing HTTP diagnostic behavior was used, not a workaround claiming direct-file success. Browser persistence checks demonstrate HTTP-origin write/read/reload/import/manual behavior, not Windows file-origin behavior. A browser download event or manual checkpoint acknowledgement does not prove durable disk storage (`career-store.js:154–157`).

## 7. Findings by severity

### Critical findings

**None identified** in reviewed M2-D source, source comparisons and executed tests. No unauthorized reward producer, duplicate-settlement path, false automatic failure or historical replay regression was demonstrated.

### Major findings

**None identified as an implementation defect.** The unavailable direct-file verification is a release/acceptance gate below, not evidence the artifact is broken.

### Minor findings and evidence gaps

| ID | Classification | Finding | Required disposition |
|---|---|---|---|
| T01 | Minor test-tooling defect, pre-existing | `scripts/circuit-rally/browser.mjs:10–11` iterates legacy `technical-circuit`/`fast-circuit` preset IDs; `src/ui/app.js:28–43` exposes the newer circuit catalog instead. After the Oval check, selecting the first absent preset times out. Runner, course presets and selector source are byte-identical to accepted main, so this is not an M2-D regression. Current track suite passes all15 fixed-track selection/step checks and three complete browser/Node races, but does not complete every assertion in the failed legacy runner | Preserve failure; separately authorize updating the legacy runner to current UI/API or explicitly retire/replace it with equivalent coverage. No test was changed here |
| V01 | Acceptance evidence gap | Managed browser cannot verify this artifact under Windows `file://`, including origin persistence/download/reload | Owner runs existing `docs/m2-d/WINDOWS_ACCEPTANCE.md` against exact hash; record browser/version/mode/results before unconditional acceptance |
| V02 | Approval/provenance gate | Local source verified; remote main remains M2-C and no remote feature ref was returned; formal M2-D acceptance not established | Owner reviews this report and designates accepted SHA. Push/merge require separate authorization |
| L01 | Approved limitation | No production championship completion producer; ordinary standalone races do not accrue career payroll/results | Expected M2-D boundary, not a defect; M2-E must provide registry-backed authority |
| L02 | Approved conservative behavior | Complex irrecoverable states may remain Blocked rather than permitting failure confirmation | Retain conservative behavior; do not expand assistance or infer failure from debt alone |
| L03 | Storage/integrity limits | 1000 receipts/2000 identities/8MiB plus browser quota; client history cannot recover facts absent from every supplied source | Existing fail-closed/manual warnings; no durability/security/cross-device authority claims |

A development-test maintenance correction is recommended for T01 under separate authorization; no production code correction is proposed. Known limitations are not relabeled as newly approved gameplay changes. Passing tests cannot establish universal correctness.

## 8. Suitability as M2-E baseline

**Technically suitable, conditionally:** source, replay compatibility, accounting and protected transaction seams are verified. The exact proposed baseline is HEAD `06fd511…` containing implementation `c8371a8…`, not current main. Before M2-E integration, establish formal M2-D acceptance and the designated integrated revision.

M2-E must reuse rather than bypass the trusted completion boundary. `createCompletionBoundary(verifier)` validates an exact record and grants a process-local WeakSet capability only after verifier strict-true acceptance (`completion.js:14–19`). A future persistent authoritative championship registry must revalidate/recreate that capability after reload; the completion's own fingerprint is not authority. M2-D deliberately does not implement durable mid-race state, championship schedules, condition carryover or career race-result ingestion. These future integration requirements do not make the delivered M2-D scope incomplete.

The future controller must freeze the entrant's payroll context, include all active home-stable contracts in settlement, use unique championship instance IDs, prevent duplicate Gold/recovery/payroll, and preserve original schema/replay paths. Changes for future integrated recovery require an explicitly versioned path, not retroactive changes to M2-D histories. This review authorizes none of that implementation.

## 9. Final verdict and next action

**CONDITIONAL ACCEPT** for the inspected M2-D implementation, with no observed critical/major regression, the direct-file owner acceptance requirement outstanding, and one pre-existing browser-tooling failure requiring explicit disposition.

1. Owner verifies the exact436032-byte/hash artifact using `docs/m2-d/WINDOWS_ACCEPTANCE.md`, including storage-denied/manual mode if applicable and actual JSON export/import/reload.
2. Resolve or explicitly disposition T01 under separate test-maintenance authorization; rerun that suite if repaired. The current review retains its failure and does not claim complete browser success.
3. Owner records formal M2-D acceptance for the designated SHA if those checks pass. This report is a technical recommendation, not that acceptance record.
4. Only under separate authorization, perform the requested integration/push/merge with a fresh source/test gate. Do not infer permission from this review.
5. Begin M2-E only after separate explicit implementation authorization and its proof-first readiness gates.

All inspection/test/documentation work is complete. No implementation/test/source/save/schema modification, branch creation, commit, merge, push or deployment occurred. Original tracked state and standalone artifact hashes were unchanged; only standalone report/evidence and disposable test outputs outside the repository were created.
