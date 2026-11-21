# BNT P1.5 — Implementation and Delivery

Date: November 20, 2026 (owner-facing Pacific date).

## Delivery assessment

Implemented locally for owner review. Windows direct-file acceptance remains pending. No P2, career writes, merge, push, release or deployment is included.

- Branch: `feat/p1-5-buffered-playback`.
- Verified P1.4 base: `3b0d043d0ca3b8e06bd0894ebff37d89be76e97e`.
- Retained P1.4 native optimization revision: `34ef7233f1323001d86924f4845f6196b4b066d4`.
- Initial P1.5 implementation: `9cf01bcb67d2caf67523cf3f1161b7497f7c0255`.
- Completion/lead diagnostic fix: `f8cf64a78dc257a322d39869dae5ea7e330af5b5`.
- Transport/conflict and synchronous-tooling hardening: `636e5d37683aacd4c3c9a13885398e533059bc02`.
- Pause/step and exact-boundary guards: `f36edc6d937baa71dc4ff4eeb406c17a18458aea`.
- Final application runtime: **`5d556f3adca146a6c17996234e34dcf4e98899db`**, preserving an accepted delayed request after rejected replacements.
- The final evidence/documentation commit follows this runtime. Its hash is given in the delivery response; it cannot contain its own immutable SHA. Application source and HTML must remain identical to the runtime above.

The unrelated, pre-existing untracked `docs/m2-e/BNT_M2_E_PRE_IMPLEMENTATION_TECHNICAL_READINESS_AUDIT.md` was preserved and excluded from commits.

## File inventory

| Files | Purpose |
|---|---|
| `src/prototype/buffered/{worker,client,projection,app}.js` | Native Worker ownership, ordered protocol, bounded presentation clock/buffer, existing UI integration |
| `src/ai/buffered-signs.js` | Versioned native delayed-Sign proof and derived pending authority |
| `src/ai/{driver,signs}.js`, `src/sim/race.js` | Narrow natural-decision hook, validated action union and cloned metadata |
| `src/prototype/interactions.js`, `src/reporting/commentary.js` | Incremental batch adapters preserving existing presentation behavior |
| `scripts/p1-5/` | Standalone builder; fixtures; performance/full-race measurements; native/replay/checkpoint/browser verification |
| `tests/p1-5.test.js` | 25 new functional and adversarial tests |
| `package.json` | Additive `build:p1-5` command; dependencies unchanged |
| `dist/Blood-and-Thunder-P1.5-Playable.html` | New standalone embedded-Worker deliverable |
| `docs/p1-5/` | Four individual reports and retained evidence |

Existing `src/prototype/app.js`, normal production build scripts, dependency lockfile, E4 persistence system and old P1.4 HTML were not replaced. The old P1.4 artifact retains SHA-256 `0ea8784671b473c9e95fe4eed4ba7379bf5cf06e966b2d16a3a383f1f1d2ad37`.

## Functional behavior

Default execution is the embedded Worker. Start initiates a three-second real-time countdown, with approximately one native second of pre-roll. Lead and frame/event capacities are bounded. The same headless native engine supplies movement, collisions, combat, AI, fatigue, condition, RNG, event order and clearance. Main-thread rendering receives compact projections and incrementally timed events.

Queued Signs retain the existing activation boundaries. The approved delay exception uses a native versioned command proof and activates at the next natural AI decision. It never rewinds or spends another opportunity. Rejected requests cannot cancel a previously accepted delay. Explicit command acknowledgments distinguish receipt, queueing, rejection, normal/delayed activation and cancellation/supersession.

Pause freezes the viewer immediately and confirms Worker pause. **Present buffered tail** plays already computed samples while the Worker stays paused. Only after that can **Step** execute one new native tick. Pending pause/step operations reject overlapping starts or steps. A terminal sample requires the Worker completion reply; delayed pause/step replies cannot erase final status or its checksum.

Initialization failure/time-out has a clearly labeled synchronous fallback. Runtime Worker failure stops the current unfinished race; it does not silently switch engines. Manual restart creates a new generation. The controlled comparison harness remains available in explicitly selected synchronous mode. No automatic persistent recovery is claimed.

## Executed verification

| Command | Actual result | Raw exit |
|---|---|---:|
| `npm test` | 630/630 passed; zero failed/skipped; 350.97 s | 0 |
| `node --test tests/p1-5.test.js` | 25/25 focused tests; all also included in the final full suite | 0 |
| `node scripts/p1-5/native-equivalence.mjs` | Six complete Worker/P1.4 races: exact native digests and complete replay equality | 0 |
| `node scripts/p1-5/checkpoint-compat.mjs` | 18 byte-identical legacy checkpoint wires and ten-tick restored continuations | 0 |
| `node scripts/p1-5/references.mjs` | 12 historical native and two payroll-context records match | 0 |
| `BNT_P12_OUT=…/evidence/prior-profile-parity node scripts/p1-2/verify.mjs` | Six accepted earlier-profile checksums match after copying original input fixtures | 0 |
| `BNT_P14_OUT=…/evidence node scripts/p1-4/tactical-references.mjs` | Three accepted P1.3 hashes, resources, classification and Sign streams match | 0 |
| `BNT_P14_REFERENCE=/tmp/bnt-p15-reference BNT_P14_OUT=…/evidence node scripts/p1-4/combat-equivalence.mjs` | Five contact/combat fixtures; 100 per-tick comparisons | 0 |
| `node scripts/p1-5/browser-native.mjs` | 100 Node/Chromium clock states; three exact full championship-context captures; delayed replay/checkpoint proof | 0 |
| `node scripts/p1-5/browser-smoke.mjs` | Two actual embedded-Worker UI groups, no page errors | 0 |
| `node scripts/p1-5/browser-faults.mjs` | Six initialization/runtime/restart/delay/offline/pending-reset groups; direct-file navigation separately unavailable | 0 |
| `node scripts/p1-5/legacy-browser-compat.mjs` | Four original prototype assertion runners adapted to explicit sync mode: 8/5/6/9 groups; each exit 0 | 0 |
| `BNT_P15_REPORT=performance-final.json node scripts/p1-5/browser-performance.mjs` | 162 controlled observations; no protocol/page errors; measurement revision 636e5d3 | 0 |
| `node scripts/p1-5/sustained.mjs` | Six complete 4× Chromium races across three modes; matched final classifications/checksums; measurement revision f8cf64a | 0 |
| `BNT_P15_MODES=worker BNT_P15_REPORT=sustained-underrun-trace-final.json node scripts/p1-5/sustained.mjs` | Final 5d556f3: complete Circuit/Long Rally, matched results and observed terminal-clearance waits | 0 |
| `npm run build:p1-5` twice | Identical 438,504-byte standalone; build dependency guard passes | 0 |
| `git diff --check` | No whitespace errors | 0 |


Fresh pre-change focused P1.4 baseline: 80/80, exit 0. The accepted P1.4 report's 605/605 full-suite result is historical evidence, not a newly executed baseline run. The final full-suite result above is newly executed against the final runtime. No old test, fixture, expected checksum, balance value or production persistence rule was weakened.

Relevant prototype browser coverage includes the four legacy functional assertion groups through a test-only synchronous-mode adapter, plus actual embedded-Worker smoke/failure/offline tests. The adapter selects synchronous execution before initialization; it does not filter external-resource assertions. Production-career/E4 and obsolete legacy browser runners were not rerun against unchanged old production HTML; no claim is made that every browser runner in the repository passed.

## Non-final failures and disposition

- Early smoke tests exposed missing presentation fields, pause refresh and tail-control enablement; fixed before final testing.
- An intermediate complete-race probe found final metrics could retain a null checksum until the client phase was marked finished. Native classification was intact. The probe was stopped; its partial evidence is retained separately. Terminal-frame/reply regression coverage was added.
- A reused transport sequence could otherwise introduce a different new command; it now rejects without effects.
- A rejected fourth queue could suppress an earlier valid delayed request. The final regression covers three accepted delayed queues, an exhausted replacement and illegal Pure-combat request; the third valid instruction activates once and replay matches.
- The first earlier-profile verifier invocation exited 1 because its expected reference input files were not copied into the new evidence folder. Original accepted inputs were supplied, not regenerated; the verifier passed on rerun.
- The first new browser-native probe exited 1 due to a test-server variable typo. The harness was corrected without game-source changes; the full clock/race/replay probe passed.
- Initial adapted legacy browser runs reported a local Blob Worker request because the test selected sync only after startup. Selecting sync before initialization removed the unintended Worker startup; original no-resource assertions stayed intact and all four runners passed.
- An initial supplemental underrun trace used an out-of-scope harness variable and exited 1. Its corrected trace and actual outcome are reported with performance evidence.

Raw nonzero exits remain in evidence; they are not described as passing first attempts.

## Artifact

- File: `Blood-and-Thunder-P1.5-Playable.html`.
- Size: **438,504 bytes**.
- SHA-256: **`f0380795cd81cd041b5138e6274c82149ffaf3396d60a9600b15bdb0c6dc287e`**.
- Build: `npm run build:p1-5` using the existing esbuild dependency.
- Packaging: inline JavaScript/CSS and embedded Blob Worker; no adjacent scripts, CDN, assets, server or Node installation needed to play.
- Two final builds exited 0 and produced the same bytes/hash; `evidence/artifact-verification.json` records the verification.

## Windows Chrome/Edge owner checklist

1. Download the individual HTML file and these Markdown reports. Keep the `.html` extension; do not open it as a text document. Optionally verify SHA-256 with PowerShell: `Get-FileHash .\Blood-and-Thunder-P1.5-Playable.html -Algorithm SHA256`.
2. Disconnect networking and double-click the HTML. Repeat in current Chrome and Edge. Confirm the address is `file:///...`, the header identifies P1.5, and status says **Buffered Worker**. If it says synchronous fallback, record the reason and browser version; that is fallback evidence, not acceptance of buffered mode.
3. Prepare Standard Oval / Pure / four entrants / seed 145 / tactical pacing. Queue Push before Start. Confirm a three-second countdown, then moving top-down view and tactical map. Check queued/active status and exactly one use spent.
4. Repeat C01 Broken Crown / Combat / eight entrants at 1×, 2× and 4×. Check radio, standings, native combat effects and condition. Observe lead/buffering diagnostics. Do not expect an identical outcome after changing player inputs.
5. Queue a Sign during the countdown after pre-roll has begun, or just before a visible crossing. Verify authoritative acknowledgment, eventual normal/delayed activation, no rewind and no second opportunity spend. Test rapid replacement, cancellation and the exhausted budget. A rejected replacement must leave an earlier accepted instruction intact.
6. Pause. Confirm the viewer freezes and Worker pause is confirmed. Use **Present buffered tail**; it must not execute native ticks. When Step becomes enabled, click once and verify presented tick increases exactly one. Resume without jumping to the Worker head. Try controls near acknowledgment boundaries; no duplicate native tick should occur.
7. Prepare Short, Medium and Long Rally. Check one/two/three intermediate Sign Points on the map and queued activation at them. Finish at least one Long Rally Combat eight-entrant race at 4×.
8. Finish a race and export metrics. Final checksum/classification should be present once native clearance and finish presentation are complete. A legitimate blocked native result must be labeled as blocked, not awarded a fabricated result.
9. Restart an unfinished race and change preparation repeatedly. No old-generation events or commands should appear in the replacement. Closing/reloading intentionally abandons the in-memory race; P1.5 does not save progression.
10. Record browser version, mode/fallback reason, seed/configuration, command inputs, any long holds or errors, and whether direct-file offline operation passed. Send those observations for owner acceptance.

Managed Linux navigation to the final artifact's `file://` URL is blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`. HTTP/offline-after-load tests are not a substitute for the Windows checks above. No Windows acceptance is claimed.

## Known limitations and next gate

Worker stepping begins after countdown and buffered-tail drainage; pre-start diagnostic stepping remains available in explicit synchronous mode. Native digest/history cost remains in the Worker, and Worker peak heap is not independently measured by Chromium's page heap API. One long frame remains in the phase measurements; short final-clearance holds are disclosed. Safe runtime crash behavior is stop/manual restart, not transparent or durable resume. Old executables are not promised to understand the new versioned Sign action, although old records remain readable by P1.5.

Review the four individual reports and test the new HTML on Windows. Stop here for owner review; P2 and remote publication remain unauthorized.
