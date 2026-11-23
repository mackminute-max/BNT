# BNT E5-D M3-A — Test Evidence

## Environment and baseline

Linux managed workspace; Node v24.22.1, npm11.9.0; existing esbuild0.28.2/playwright-core1.65.1; Chromium156.0.8078.79. No dependency installation/update. The vanilla JavaScript repository has no separate configured lint/typecheck command.

HEAD `36b0048fac6d0b8c2e62f6c895ab624315e3f46f`, branch `feat/e5-d-m1-startup-slots-options`. Current owner-accepted M2 source was verified against its 20-file manifest before modification; accepted M2 HTML was verified at 2,341,979 bytes / SHA `96adf582c830722c7e0298ca2a45b61ca2c7e1317ab96a730aa59b4d3dbed574`. Its earlier 773-test result is historical baseline evidence, not a new test execution in this task.

M3-A artifact: **`Blood-and-Thunder-E5-D-M3-A-Playable.html`**, **2,367,872 bytes**, **SHA-256 `0cdf7c55300ea325f7b207770ded8cb58bfa94ffafa2487a4440643dbb5a7681`**. Evidence root is `/workspace/deliverables/e5d-m3-a/evidence/`. No new commit/branch exists; changes are intentionally uncommitted.

## Commands actually executed

| Command | Actual result | Raw exit |
|---|---|---:|
| `node scripts/e5-d/m3-a/compile-copy.mjs --write` | Generated reviewed text from 12 files / 89 records after validation | 0 final |
| `node --test tests/e5-d-m3-a.test.js` | **9 passed, 0 failed** | 0 final |
| `node --test tests/e5-d-m1.test.js tests/e5-d-m2.test.js tests/e5-d-m3-a.test.js` | **25 passed, 0 failed** after final UI placement | 0 |
| `npm test` | **782 passed, 0 failed, 0 skipped/cancelled** on final source (473.937 seconds) | 0 |
| `node scripts/e5-d/m3-a/build.mjs` twice after source finalized | Identical artifact report/bytes/SHA; offline and accepted-artifact guards pass | 0 each |
| `cmp /workspace/deliverables/e5d-m3-a/evidence/build-final.log /workspace/deliverables/e5d-m3-a/evidence/build-repeat.log` | Exact match | 0 |
| `node scripts/e5-d/m3-a/context-browser.mjs` | **4 groups pass**, final artifact SHA recorded | 0 |
| `node scripts/e5-d/m3-a/browser.mjs` final run | **15 groups pass**, final artifact SHA recorded | 0 |
| `node scripts/e5-d/m3-a/creation-browser.mjs` | **7 groups pass** | 0 |
| `node scripts/e5-d/m3-a/faults-browser.mjs` | **7 groups pass** | 0 |
| `node scripts/e5-d/m3-a/import-browser.mjs` | **3 groups pass** | 0 |
| `node scripts/e5-d/m3-a/regressions.mjs` | Seven subgroups pass; legacy file-policy block remains nonzero, details below | **1** |
| `node scripts/e5-d/m3-a/file-browser.mjs` | Managed offline `file://` navigation **BLOCKED** by `ERR_BLOCKED_BY_ADMINISTRATOR` | **2** |
| `node scripts/e5-d/m3-a/delivery-evidence.mjs` | Exactly six allowed pre-existing UI files changed; all other baseline files/artifacts preserved; 89-key mapping produced | 0 |
| `git diff --check` | No whitespace errors | 0 |

The final full run is `full-node-final.log` / `full-node-final.exit`; an earlier development run also passed 782 tests and is retained separately. Logs were redirected to the evidence directory; exact shell/process outcomes are retained in corresponding `.exit`, JSON and log files. The final end-to-end run is `gameplay-final-process.log`; `browser.json` records the final SHA. A previous development-artifact run is separate evidence and not substituted for final-artifact verification.

## Additive Node tests

The nine M3-A tests cover:

1. Exact whitelisted coverage, current native source parity, generated-text consistency, deeply immutable records.
2. Duplicate/prohibited fields, malformed JSON, non-finite numbers, size/nesting limits.
3. Unknown/duplicate/missing native IDs, unsupported schema/revision, extra fields, numerical/effect drift and invalid track flags.
4. HTML/attribute escaping and exact native fallback for absent/prototype-like keys.
5. Draft versus initialized context; real entitlement versus placeholder; pending versus credited; contract, lock, backup and schema6 Legacy guards.
6. Exact oval-string, null Standard Oval, circuit/legacy-object and unknown generated-track identity handling.
7. Six activation notes, selected Sign/current weather and help-only behavior, without reporter effects.
8. Complete career/envelope/initialization-receipt equality after passive lookup and page generation.
9. Exclusion of radio cues, artwork/source metadata, identity fields and simulator/storage/reporter imports from the runtime lookup.

Existing tests were not edited, removed or weakened. All new assertions are additive.

## Final packaged browser evidence

### Context consumer checks — 4 groups

The actual HTML reconstructs a pre-M1 schema6 fixture exactly. Browsing roster, Finance, all six service descriptions, three contract terms, seven facilities and all six championship selectors leaves **complete career state and primary save bytes unchanged**. Source names and offers remain native. Dustroad help distinguishes exact Short/Standard Oval IDs.

Global Help contains all six Signs, five weather states, three race incidents, nineteen track descriptions and three incident-overview entries. No inserted image/script nodes, JS errors, browser-native dialogs or external runtime requests were observed. Initialized headquarters do not show `new_career_empty`; backup/Legacy-slot help uses correct contexts. Active championship lock help remains read-only and does not invent an entitlement or service permission.

### End-to-end gameplay — 15 groups

The final hash completed two actual native championship races:

| Event | Seed | Terminal tick | Result |
|---|---:|---:|---|
| 1 | 2923477436 | 696 | Ended; original native `Hold Position` activation, opportunity count and input order retained |
| 2 | 3960592580 | 930 | Ended; official publication and final settlement path retained |

During an acknowledged pause, opening the new Help panel left **exact native state, accepted command ordering, radio text and complete career state unchanged**. Prior running/paused state and playback speed resume through existing authority.

The journey verifies pending award help appears only for trusted uncredited entitlements; inert Run/Legacy selection explanations remain separate; credited help appears only after actual final settlement. It then completes the existing permanent placeholder selection. No reward effect or financial formula was modified.

Also exercised: two independent UI-created careers, protected initialization/migrations, Run choice/reload, exact career isolation after another career's championship/Legacy progression, pending-transaction navigation guards, browser Back/focus, centralized developer/practice controls and **140 headquarters navigation actions** with single Continue/wheel/menu nodes and unchanged handlers.

### Creation, faults, import — 17 groups

M2 creation still compares the real five packages, preserves Back/Cancel/Enter/Escape and mobile layout, grants once under repeated confirmation, persists guide/cosmetics, recovers interrupted initialized activation, rejects conflicting retries and handles lost acknowledgments without a second grant.

Legacy compatibility/fault tests verify explicit durable migration preserving original bytes/IDs; malformed/unrelated import rejection; atomic save/navigation rollback; missing/corrupt independent slot isolation; retained legacy empty-slot recovery without grants; storage denial without false durability; complete pre-M1 active-race import with byte-exact session journals; duplicate ownership rejection; and retained corrupt-checkpoint recovery actions. Test fixtures use isolated browser contexts, not owner saves.

## Existing regression subgroups and deterministic references

Executed through `node scripts/e5-d/m3-a/regressions.mjs`; individual reproduction is `node scripts/e5-d/m3-a/regressions.mjs <name>`. Existing assertions/golden data remain unchanged; wrapper substitutions redirect evidence and select the candidate at existing UI seams.

| Subgroup | Actual result | Exit |
|---|---|---:|
| `references` | **12 historical + 2 payroll** expected/actual checksums exact | 0 |
| `layout-browser` | 5 responsive rows | 0 |
| `interface-browser` | 9 interface groups | 0 |
| `browser-native` | 100 championship-clock seed parity comparisons, 3 native race fixtures and buffered Sign checks | 0 |
| `checkpoint-compat` | 18 unchanged historical checkpoint rows | 0 |
| `player` | 13 existing player-interface groups | 0 |
| `e4` | 9 groups including auto-checkpoint/Sign/reload, complete restore/interruptions, quota/writer and recovery | 0 |
| `legacy` | 23 functional HTTP checks pass, no JS/network errors; direct file launch denied by browser policy | **1** |

The browser suite is therefore **not completely passing at process level**. Its inherited nonzero file-policy result was not suppressed or reclassified as a pass. The legacy runner uses retained `dist/Blood_and_Thunder.html`; it is compatibility evidence, not proof of M3-A direct-file operation.

Raw subgroup exits are in `regressions/all-exits.json`; exact historical expected/actual digests are in `regressions/references/references.json`. Payroll references remain Pure `ad509187` and Combat `f191ca35`. No historical golden file/checksum was updated. These checks do not claim numerical portability for every possible race/runtime combination.

## Development failures and limits

- Initial compiler implementation expected the legacy-track family name incorrectly. It rejected the input; the compiler was corrected to the actual approved `track_legacy_presets` value. No authored JSON or native track was changed.
- Initial test expectations used different rain wording and compared a class instance directly to its prototype-free structured clone. The harness now checks the exact approved “terrain remains unchanged” text and reporter data properties. Production copy/reporting was not changed to satisfy these assertions.
- An initial browser harness assumed a healthy asset could expose an enabled treatment action. That is correctly ineligible in the native rules; the run was canceled (exit130). The final harness uses passive service help and keeps native eligibility intact. Final targeted checks pass.
- Direct-file browser launch is blocked in this managed environment (exit2; legacy wrapper exit1). Windows Chrome/Edge owner acceptance remains required. No new Windows acceptance is claimed from M2 acceptance or HTTP testing.

No unresolved implementation failure is concealed by changing expected references. No benchmark/performance or aesthetic acceptance beyond these tests is claimed. No artwork, alternate radio, identity-pack activation, schema/save migration or later milestone is delivered.

**STOP — Await owner review and acceptance of E5-D M3-A.**
