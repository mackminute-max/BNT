# BNT M2-E E2/E3 Test Evidence

Date: 2026-11-18. Exact source revision and machine-readable checks are in `evidence/revision.json`. All counts below refer to actually executed checks, not proposed acceptance tests. Historical reports remain unchanged.

## Environment and baseline

Node24.22.1, npm11.9.0, Chromium156.0.8078.79, esbuild0.28.2, playwright-core1.65.1. No dependency changes. Baseline `npm test`: **443 passed,0 failed,0 skipped**. Accepted baseline source-to-HTML exact parity:474374 bytes, SHA256 `fe48c76f4a7e6988db88fd334a746b62513e497480bd7cffe2831e806c40299a`.

Final exact counts, browser raw exits, build checksum, replay and measurement tables are appended from the preserved final run. Evidence-producing legacy scripts were run in an isolated repository copy to avoid changing historical reports. Earlier baseline replay verification ran in the actual repository; generated historical bytes remained identical. `git diff --check` passed.

## Commands executed

- `npm test` before implementation and against the frozen final source.
- `npm run build`; separate in-memory esbuild reconstruction exactly compared to both HTML aliases and checked external runtime references/network APIs.
- `node scripts/m2-d/verify.mjs`:12 historical replay references,5 native package migration adapters,5 independent payroll golden cycles,2 payroll-context replay reproductions.
- All available browser runners listed in the final browser table. Nonzero exit due to direct-file blocking remains nonzero; an HTTP fallback is not a direct-file pass.
- `node scripts/m2-e/championship-clock-parity.mjs`:100 exact initial states plus3 full native Node/Chromium race captures.
- `node scripts/m2-e/clock-parity.mjs`:deliberately retained failing legacy numerical parity reproducer, not a suppressed failure.
- `node scripts/m2-e/measure-e2-e3.mjs`:one synthetic Node-only four-entrant first-event storage/time diagnostic.

## New regression coverage

34 new test cases in `tests/m2-e-e2-e3.test.js`: explicit upgrade/history, qualification and native track validation; atomic fee and duplicate handling; insufficient fee; stale source/revisions/ownership; storage denial/lost acknowledgment; immutable ordered assets and exact receipt/provenance validation; management quote/command locks; known-history unsafe import; frozen seeds/grid/race birth and missing-authority failure; interrupted birth retry; all six Sign priority masks; coaching player-only/configured real choice/absent-context parity; Pure/Combat × Oval/Circuit/Rally checkpoint restoration; paused journal ordering and pre-race Sign usage; native clearance staging/fault/retry; stalled session publication rejection; initial voluntary withdrawal with AI-only execution; tied official places/full points; DNF first-reached progress; final participation/title/no-champion helpers; one-starter native DNF; trusted board refresh and off-board rejection; opt-in checkpoint protocol version; deterministic logarithm formula accuracy and clock-version validation.

Synthetic boundary/helper tests supplement native races; they do not establish complete multi-race condition carryover or a production zero-starter flow. Baseline foundation tests continue to cover missing journal, invalid sentinels/versions, previous-generation recovery and finalization faults; those are not newly claimed E3 end-to-end coverage.

## Required acceptance inventory

| Requested cases | Evidence / actual status |
|---|---|
|1–5 eligibility, fee, repeats, storage, revisions|Tested for delivered registration operations|
|6 repeat template with distinct instance after settlement|Fresh identity validation exists; end-to-end repeat entry deferred with settlement lifecycle|
|7–10 frozen schedule/composition, management restrictions, inspection|Tested; export remains available|
|11–14 manual sequencing/grid/formats/courses|First-event native orchestration tested; next-event advancement blocked by D2|
|15–18 Signs/coaching/no-context parity|Native Sign/checkpoint tests, six masks, player-only fixture, historical12 replay checks|
|19–21 condition/eligibility/no recovery|D2 mapping and committed carryover blocked; management guards prevent between-race services; no automatic recovery added|
|22–25 tied place/DNF/DNS/DQ|Authoritative and synthetic pure-helper tests; no production DQ controller or committed standings claimed|
|26 one starter|Real native race tested|
|27 zero starter|Foundation seam reusable; production controller outcome not implemented|
|28 voluntary withdrawal|Initial-intermission confirmation/no-refund tested|
|29 forced withdrawal|Blocked pending D2 committed eligibility|
|30 AI-only remaining races|First native AI-only race tested; full remaining schedule incomplete|
|31–33 final participation/DNF/null champion|Pure-helper tests only; not full terminal controller progression|
|34–37 stalled/idempotent/conflict/fault|Native session/staging tests; no permanent consequence publication, outer blocked transition incomplete|
|38 resume/journal|Native checkpoint/journal proof across representative formats; automatic viewer checkpoint scheduling excluded|
|39 M2-D settlement|Existing regression remains; this controller never invokes settlement or creates trusted completion authority|
|40 historical12 replay checksums|Compared to unchanged accepted reference values; final verification below|

## Limitations and failure disposition

- Managed `file://` navigation is blocked by administrator policy. HTTP-served document tests then disable network; they do not independently verify Windows double-click operation. Previous foundation owner acceptance does not cover this artifact.
- Obsolete circuit/rally runner selects an unavailable historical preset and fails; unchanged and outside authorization.
- Accepted baseline legacy native Math.log differs by a last-bit incident timer on Node/Chromium at seed1460515178. Preserved reproducer continues to fail. New explicitly versioned championship races evaluate the same formula deterministically; exact100-state/three-race comparisons cover the corrected path, not every possible configuration/platform.
- Storage/serialization timing is measured under concurrent CI test load, not a controlled benchmark. Synchronous validation is costly. The 8MiB import cap is not a browser localStorage quota guarantee. No authoritative evidence was discarded for size.
- D2 numerical conversion is intentionally unimplemented. Full E3 acceptance and subsequent phases remain blocked; passing the regression suite does not prove universal correctness.

## Final frozen-source results

`npm test`: **477 passed,0 failed,0 skipped**,242186.779ms (baseline443;34 additional executed cases). Both standalone aliases: **529698 bytes**, SHA256 `d7a6e145ddebe8085a98ac8b48e2251cf542badefb572e14e826b499597474b3`. Exact source-to-build equality and no external runtime dependency scan passed.

| Browser runner (`node <script>`) | Successful functional groups | Raw exit | Disposition |
|---|---:|---:|---|
|scripts/m2-d/browser.mjs|14|1|Functional PASS; direct file blocked|
|scripts/m2-c/browser.mjs|20|1|Functional PASS; direct file blocked|
|scripts/m2-b-browser.mjs|13|1|Functional PASS; direct file blocked|
|scripts/m2-a-browser.mjs|12|1|Functional PASS; direct file blocked|
|scripts/persistence-browser.mjs|18|1|Functional PASS; direct file blocked|
|scripts/browser-test.mjs|23|1|Functional PASS over HTTP; direct file blocked|
|scripts/track-expansion/browser.mjs|10|0|Functional PASS; file limitation remains disclosed in raw log|
|scripts/circuit-rally/browser.mjs|1 before failure|1|Known unchanged obsolete preset selection timeout|
|scripts/combat-ai-refinement/browser.mjs|7|0|Functional PASS; no independent Windows acceptance|
|scripts/m2-e/browser.mjs|10|1|Functional PASS; direct file blocked|
|scripts/m2-e/e2-e3-browser.mjs|8|1|Functional PASS; direct file blocked|

Total136 successful functional groups includes one group before the obsolete runner failure; it is **not**136 direct-file passes or an entirely passing browser suite. New controller browser replay checksum `e21f5539` reproduced exactly in Node. Full raw logs retain all errors and exits.

`championship-clock-parity.mjs`:exit0;100/100 exact initial-state checks,0 differences. Three complete eight-entrant native race captures matched Node/Chromium: Oval/Pure `a74e4f71`,C01/Combat `005252df`,mixed-rally/Combat `069e4340`; allEnded. These use seed1460515178 and explicitly versioned championship context.

`clock-parity.mjs`:exit1,known accepted-baseline legacy Math.log discrepancy remains independently reproducible. This is disclosed rather than changing legacy expected checksums. The fixed new-context clock and legacy reproducer are separate checks.

Historical and M2-D verification completed with exit0: **12/12 historical replay references unchanged,5/5 native package migration adapters,5/5 payroll golden cycles,2/2 payroll-context replays**. Structured details and replay files are in `evidence/historical-and-payroll-verification.json` and `payroll-*.json.gz`. No reference checksum was updated to conceal a difference.

## Storage and timing measurement

One synthetic four-entrant first-event run, no permanent condition commit. Wall times include concurrent regression load; not a representative balance/performance study.

| Stage | Elapsed ms | Career bytes | Session bytes | Career receipts |
|---|---:|---:|---:|---:|
|explicit-foundation|268.41|176532|0|1|
|enable|422.26|301466|0|2|
|registration|666.69|399678|0|3|
|manual-start|974.15|434777|0|4|
|durable-birth|2579.06|449301|17844|5|
|native-race|3782.57|449301|371553|5|
|stage-uncommitted-clearance|5563.09|479095|377614|6|

Final controller phase: `RECOVERY_REQUIRED`, as required by the D2 approval hold. No per-tick career receipts, official result/standings/condition publication or reward credit. Costly synchronous operations remain a UI responsiveness risk for full E4.
