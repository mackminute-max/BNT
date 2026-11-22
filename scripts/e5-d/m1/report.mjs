import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const root='/workspace/deliverables/e5d-m1',e=root+'/evidence',json=async p=>JSON.parse(await readFile(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const baseline=await readFile(root+'/baseline-frozen-node.log','utf8'),final=await readFile(root+'/final-frozen-node.log','utf8'),stat=s=>Object.fromEntries(['tests','pass','fail','cancelled','skipped'].map(k=>[k,Number(s.match(new RegExp('ℹ '+k+' (\\d+)'))?.[1]??NaN)]));const a=stat(baseline),b=stat(final);assert.equal(a.pass,757);assert.equal(a.fail,0);assert.equal(b.tests,b.pass);assert.equal(b.fail,0);assert.equal(Number(await readFile(e+'/node.exit','utf8')),0);
const browser=await json(e+'/browser.json'),faults=await json(e+'/faults-browser.json'),imports=await json(e+'/import-browser.json'),native=await json(e+'/final-native.json');for(const x of [browser,faults,imports,native])assert.equal(x.result,'PASS');const html=await readFile('dist/Blood-and-Thunder-E5-D-M1-Playable.html');assert.equal(native.sha256,sha(html));assert.equal(await readFile(root+'/build-final.log','utf8'),await readFile(root+'/build-repeated.log','utf8'));
const references=await json(e+'/regressions/references/references.json');assert.ok(references.rows.every(r=>r.actual===r.expected));const checksums=references.rows.map(r=>`| ${r.kind} | ${r.file} | \`${r.actual}\` | Match |`).join('\n');
const report=`# Blood and Thunder — E5-D M1 Test Evidence

Date: November 22, 2026 (America/Los_Angeles). Source HEAD/base: \`a70ec6e836b765488dbe793606e8c103b8dad3da\`, branch \`feat/m2-e5-c1-navigation-correction\`, plus the delivered uncommitted M1 source manifest. No M1 source commit or owner acceptance is claimed.

## Executed summary

- Isolated, tracked E5-C.1 baseline: **${a.pass}/${a.tests} Node tests passed**, zero failures/cancellations/skips; exit **0**.
- M1 full working-tree suite: **${b.pass}/${b.tests} Node tests passed**, zero failures/cancellations/skips; exit **0**. Four additive M1 tests; no historical expected checksums changed. The final focused M1 suite also passed **4/4** after the timestamp ambiguity guard.
- M1 packaged browser journey: **${browser.groups.length} groups passed**, zero page errors, browser dialogs or external runtime requests; exit **0**. Includes two actual native races, official publication, pending Run reload, trusted final settlement, permanent Legacy choice, exact A/B isolation, 140 navigation actions, pending-operation guard, Back/focus, central Developer Tools and independent practice.
- Fault/legacy/storage browser suite: **${faults.groups.length} groups passed**, exit **0**.
- Complete import/duplicate ownership/active recovery UI: **${imports.groups.length} groups passed**, exit **0**.
- Exact final artifact native proof: **${native.groups.length} group passed**, exit **0**; native seed **${native.native.seed}**, ended at tick **${native.native.tick}**, exactly **${native.official.results}** official result, terminal **${native.official.phase}**. Both running and already-paused Options paths were asserted through the actual viewer pause acknowledgment.
- Historical replay references **12/12**, payroll references **2/2** matched exactly.
- Existing browser/regression inventory: seven runners exited **0**; the original legacy runner exited **1** with its 23 HTTP functional checks passing and direct-file launch blocked by managed browser policy. **The entire browser inventory is not described as wholly passing.**

## Environment and exact commands

Node **v24.22.1**, npm **11.9.0**, esbuild **0.28.2**, playwright-core **1.65.1**, Chromium **156.0.8078.79** (headless Debian Linux). Existing installed dependencies were reused; no install/update/new dependency. No configured lint/type-check command was invented.

| Command | Actual result / raw exit |
|---|---|
| \`git status --short\`, \`git branch --show-current\`, \`git rev-parse HEAD\`, \`git log -3 --oneline\` | Verified baseline/worktree; 0 |
| \`git archive a70ec6e836b765488dbe793606e8c103b8dad3da\` extracted to \`/tmp/bnt-e5d-m1-baseline-a70\`; existing node_modules symlink; \`npm test\` there | ${a.pass}/${a.tests}; 0 |
| \`npm test\` in \`/workspace/BNT\` | ${b.pass}/${b.tests}; 0 |
| \`node --test tests/e5-d-m1.test.js\` | 4/4; 0 |
| \`node scripts/e5-d/m1/build.mjs\` twice | Identical size/SHA/output; 0, 0 |
| \`node scripts/e5-d/m1/browser.mjs\` | ${browser.groups.length} groups; 0 |
| \`node scripts/e5-d/m1/faults-browser.mjs\` | ${faults.groups.length} groups; 0 |
| \`node scripts/e5-d/m1/import-browser.mjs\` | ${imports.groups.length} groups; 0 |
| \`node scripts/e5-d/m1/final-native.mjs\` | Final hashed artifact actual Worker race/publication; 0 |
| \`node scripts/e5-d/m1/regressions.mjs\` | Preserved inventory, raw runner exits below; overall 1 due known legacy file restriction |
| \`node scripts/e5-d/m1/regressions.mjs e4\` | Final M1 coordinator/UI rerun, nine checks; 0 |
| \`node scripts/e5-d/m1/file-browser.mjs\` | **BLOCKED**, raw exit **2**, \`ERR_BLOCKED_BY_ADMINISTRATOR\` on file:// before application execution |
| \`git diff --check\` | 0 |

An initial working-tree run also passed 757 tests. The separate archive run removes ambiguity from subsequent concurrent edits. One intermediate full run was intentionally interrupted to restart after source stabilization; its partial output is not counted as a pass. Early development exposed and fixed a staged-recovery worker-close timing error and handling of absent historical navigation metadata. Test-harness async-confirmation timing and an invalid Sign fixture were corrected. Final results above supersede intermediate attempts; no production validator or golden was weakened.

Full-suite wall durations were approximately **${(Number(baseline.match(/duration_ms ([\d.]+)/)?.[1])/1000).toFixed(1)} s baseline** and **${(Number(final.match(/duration_ms ([\d.]+)/)?.[1])/1000).toFixed(1)} s M1**, under concurrent verification load. These are **not controlled performance comparisons** and establish no speedup claim.

## Preserved regression inventory

| Runner selected by regressions.mjs | Verified scope | Exit |
|---|---|---:|
| references | Current source against 12 historical + 2 payroll references | 0 |
| layout-browser | Preserved P2.2 artifact, 5 layout rows, no JS errors | 0 |
| interface-browser | Preserved P2.2 artifact, 9 groups | 0 |
| browser-native | 100 championship-clock Node/Chromium seeds + 3 native races | 0 |
| checkpoint-compat | 18 checkpoint/restore/input combinations | 0 |
| player | Preserved C.1 artifact, 13 groups, all 162 original controls connected, 14 layout samples | 0 |
| e4 | New M1 artifact via explicit legacy route and styled confirmation automation; 9 migration, journal, backup, fault, repair, restart/publication groups | 0 |
| legacy | Original historical artifact and assertions, 23 HTTP functional checks, no JS/network errors; actual file launch forbidden | 1 |

The wrapper redirects evidence and adapts only M1 entry/menu/confirmation navigation where needed. It does not edit accepted original runners/assertions or golden data. Original-artifact tests are explicitly distinguished from the new M1 journey/fault/import/final-native tests.

## Acceptance matrix

| ID | Status | Executed evidence |
|---|---|---|
| M1-01 | CONDITIONAL | Loading/title and embedded runtime over managed HTTP; actual file:// blocked |
| M1-02 | PASS | Fresh title, disabled Continue, explicit New Game |
| M1-03 | PASS | New career A, existing protected package, durable owned state |
| M1-04 | PASS | Separate B slot/profile/career, A unchanged |
| M1-05 | PASS | Exact serialized A/B state on switching; complete active session imported byte-for-byte |
| M1-06 | PASS | B remains Continue target after viewing A; unknown/tied latest times covered by focused tests |
| M1-07 | PASS | Pre-M1 schema6 indexed read-only; explicit migration and complete restore preserve IDs/history; older schemas covered by full suite |
| M1-08 | PASS | Index denial, retained creation-stage retry, atomic head/navigation rollback |
| M1-09 | PASS | Missing/corrupt slot isolated; valid legacy career explicitly reloads alongside both |
| M1-10 | PASS | Malformed/foreign replacement rejected; duplicate new-slot ownership rejected |
| M1-11 | PASS | Keyboard wheel, dialog/Escape/focus |
| M1-12 | PASS | Title, creation, HQ, native race, Run choice, settlement, Legacy, recovery and practice wheel paths |
| M1-13 | PASS | Actual running native Worker pause acknowledged; no advancement while Options open; resume |
| M1-14 | PASS | Already-paused pre-start and active-race Options remain paused |
| M1-15 | PASS | Queued Hold Position, remaining budget and speed retained; activation acknowledged at original start boundary |
| M1-16 | PASS | Unfinished/pending-choice leave confirmation, safe reload and exact state; common guard used for slot switch |
| M1-17 | PASS | Pending protected queue prevents title navigation; cancel retains current progress |
| M1-18 | PASS | Real durable status, slot list, complete/legacy backup paths; validated new-slot complete restore |
| M1-19 | PASS | Central wheel entry; original workbench retained; extra normal developer entries hidden |
| M1-20 | PASS | Existing native playback/Signs and management actions; unchanged original control inventory |
| M1-21 | PASS | Styled confirmations, Escape, browser Back, focus, zero browser dialogs in new suites |
| M1-22 | PASS | Full ${b.pass}/${b.tests} Node tests |
| M1-23 | CONDITIONAL | Seven existing runners exit0; original legacy runner exits1 only for known direct-file policy restriction |
| M1-24 | PASS | Actual native races -> official results -> durable career; exact final HTML hash proof |
| M1-25 | CONDITIONAL | Self-contained/reproducible build passes; Windows direct-file acceptance remains owner work |
| M1-26 | PASS | Pending Run reload, retained active journal, staged recovery, nine E4 interruption/exactly-once tests |
| M1-27 | PASS | Career A exact after B owns Legacy; no merge/renaming/duplicate ownership import |
| M1-28 | PASS | Source scope inspected: no simulation/economy/catalog/reward-effect/M2–M7 implementation |

## Replay references

| Kind | Record | Actual checksum | Result |
|---|---|---|---|
${checksums}

## Standalone delivery

- File: \`dist/Blood-and-Thunder-E5-D-M1-Playable.html\`
- Bytes: **${html.length.toLocaleString('en-US')}**
- SHA-256: \`${sha(html)}\`
- Embedded authority worker, accepted race viewer/practice, existing proof assets; no external runtime dependency required.
- Independent build repetition gives identical bytes/hash. The final-native JSON binds a real race/publication test to this exact hash.
- Accepted C.1 preserved SHA-256: \`c508aea1093cbfd6758592866ce36a501d3034ef27c02f9ffab3bb6dc1558f3d\`; C/B/P2.2 checks are enforced by the M1 builder.

## Evidence and limits

Evidence directory: \`/workspace/deliverables/e5d-m1\`: frozen baseline/final Node logs, focused M1 log, raw process logs/exits, JSON browser reports, 14 exact reference comparisons, reproducible scripts in \`scripts/e5-d/m1\`, source SHA-256 manifest, working-tree inventory, remaining-dialog inventory, and native Options screenshot. Historical accepted evidence directories were not overwritten.

Windows/Edge direct-file owner testing is not claimed. Chrome/Edge storage treatment of local files, downloaded-file paths, browser profiles and persistence permissions must be tested with the new artifact. HTTP tests and offline-resource scans do not substitute. No arbitrary interrupted checkpoint, penalty, recovery reward or race result was invented to obtain a pass.
`;
await writeFile('docs/e5-d/BNT_E5-D_M1_Test_Evidence.md',report);await mkdir(root,{recursive:true});for(const name of ['BNT_E5-D_M1_Implementation_Report.md','BNT_E5-D_M1_Test_Evidence.md','BNT_E5-D_M1_Windows_Acceptance.md'])await copyFile('docs/e5-d/'+name,root+'/'+name);
await writeFile(e+'/summary.json',JSON.stringify({baseline:a,final:b,browserGroups:browser.groups.length,faultGroups:faults.groups.length,importGroups:imports.groups.length,native,artifact:{bytes:html.length,sha256:sha(html)},windowsAcceptance:'PENDING',legacyRunnerExit:1,fileRunnerExit:2},null,2));console.log(JSON.stringify({node:b,artifact:sha(html),reportsWritten:true}));
