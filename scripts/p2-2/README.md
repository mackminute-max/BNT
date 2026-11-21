# P2.2 verification

Run from repository root with the existing Node/esbuild/Playwright setup and `/usr/bin/chromium`. Playing the HTML requires none of these development tools.

- `npm run build:p2-2`: separate P2.2 HTML only.
- `npm test`: all configured Node tests, including23 P2.2 projection/control tests.
- `node scripts/p2-2/layout-browser.mjs`:1920×1080,2560×1440,1366×768,1024×768,390×844; hierarchy, row/column association, 1080p fit, no overflow, simplified controls and screenshots.
- `node scripts/p2-2/standings-browser.mjs`: synthetic UI identity/truncation/tie/elimination fixtures plus actual Worker-head-ahead/presented-only proof.
- `node scripts/p2-2/interface-browser.mjs`: P2.1 functionality adapted to actual diagnostic relocation; real navigation is used to reach Step/Restart/Tail, original handlers remain.
- `node scripts/p2-2/resize-browser.mjs`: Native session/camera continuity, uniform Canvas X/Y mapping, keyboard zoom and actual Chromium fullscreen API enter/exit.
- `node scripts/p2-2/keyboard.mjs`: focus, internal views and original Queue behavior.
- `node scripts/p2-2/browser-faults.mjs`: original Native fault/delayed-Sign/offline tests; Step reached through tools, direct-file attempt reported separately.
- `node scripts/p2-2/references.mjs`, `native-equivalence.mjs`, `checkpoint-compat.mjs`, `browser-native.mjs`: historical/payroll/native/checkpoint/clock checks. Native frozen P1.4 reference must exist at `/tmp/bnt-p15-reference`; recreate from `git archive 3b0d043 src package.json` in that disposable directory if absent.
- `node scripts/p2-2/art-parity-fast.mjs`:12 complete actual Worker races/replay exports, also verifying compact order equals the original full standings at completion. The immutable P1.5 HTML reference is `/workspace/deliverables/bnt-p2/evidence/baseline/P1.5-reference.html`, recoverable from Git04df5ef.
- `node scripts/p2-2/assets-browser.mjs`, `geometry-browser.mjs`, `durable-browser.mjs`: shared P2 assets/DPR/geometry and unchanged accepted durable companion. Durable fixtures are fresh synthetic data, never owner careers.
- `node scripts/p2-2/legacy-browser-compat.mjs`: original assertions in sync mode with both internal views exposed for legacy selectors only. Expected aggregate1 at obsolete P1.1 zoom6 assertion; actual navigation tested separately.
- `node scripts/p2-2/performance.mjs`: bounded12-window comparison, P2.1 vs P2.2 at1920×1080, C01 and Long Rally Combat8, early/middle/late,4x. Uses actual tools navigation for hidden speed selector. Run alone after correctness jobs finish.
- `node scripts/p2-2/performance-repeat.mjs`: two-window early Long Rally follow-up for the isolated75ms task; preserves initial results.
- `node scripts/p2-2/summarize-performance.mjs`: validates12 rows, fixture identity and no session/page errors.
- `node scripts/p2-2/build-verify.mjs`: repeatable build, identical Native Worker and protected-source/accepted-artifact preservation.

Native benchmark checkpoints are under `/workspace/deliverables/bnt-p1-5/evidence/fixtures`; regenerate with existing `scripts/p1-5/fixtures.mjs` if necessary. Evidence outputs use `/workspace/deliverables/bnt-p2-2/evidence`. Windows file-origin/toolbar zoom and owner visual acceptance remain separate. No old assertion, golden, Native/persistence source or accepted artifact is changed by these harnesses.
