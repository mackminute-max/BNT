# M2-D preflight — fresh verification

2026-11-17. Source HEAD `f66ec90a6659dd6bb675815bff4cc33e9850a643` on clean `main` before documentation additions. No production/source/test/dependency/save edits, migration, branch changes, commits or push. No M2-D code tested or implemented.

## Executed commands and outcomes

| Command | Location / result |
|---|---|
| `git status --short --branch`, `git log -3 --oneline`, `git rev-parse HEAD HEAD^{tree}`, `git show -s --format=fuller HEAD`, `git remote -v` | Accepted checkout; clean tree, main, verified owner-accepted merge and source tree |
| `git ls-remote origin refs/heads/main refs/heads/feat/m2-c-economy` | Read-only remote inspection: main matches HEAD; no feature branch ref returned |
| `git diff --exit-code 79447d8 HEAD` | Exit 0; accepted implementation and merge have identical files |
| `node --version`, `npm --version` | v24.22.1 / 11.9.0 |
| `npm test > /tmp/bnt-m2d-preflight-tests.log 2>&1` | Accepted checkout; exit 0; **351 passed, 0 failed, 0 skipped**, 131507.815 ms |
| `git archive HEAD` extracted to `/tmp/bnt-m2d-preflight/checkout` | Isolated accepted-source export; existing node_modules linked, no dependency install |
| `npm run build` | Isolated copy; exit 0; both HTML aliases 380462 bytes, byte-equivalent checksum to accepted artifacts; existing external-dependency guard passed |
| `node scripts/m2-c/browser.mjs` | Isolated copy; **20 functional groups**, no page errors; exit 1 due direct-file policy block |
| `BNT_M2B_EVIDENCE_DIR=/tmp/bnt-m2d-preflight/m2b node scripts/m2-b-browser.mjs` | Isolated copy; **13 functional groups**, no page errors; file-policy exit 1 |
| `BNT_M2A_EVIDENCE_DIR=/tmp/bnt-m2d-preflight/m2a node scripts/m2-a-browser.mjs` | Isolated copy; **12 functional groups**, no page errors; file-policy exit 1 |
| `BNT_PERSISTENCE_EVIDENCE_DIR=/tmp/bnt-m2d-preflight/m1 node scripts/persistence-browser.mjs` | Isolated copy; **18 functional groups**, no page errors; file-policy exit 1 |
| `npm run test:browser` | Isolated copy; **23 racing/workbench functional groups**, bundled/Node parity, no page errors or runtime network requests; file-policy exit 1 |
| Inline Node ESM replay verification | Loaded all 12 accepted M2-C gzip replay captures, called existing `verifyReplay`, asserted each checksum equals its historical `parity.json` currentChecksum; **12 matched**, exit 0 |
| `sha256sum dist/*.html`, `wc -c dist/*.html`; isolated equivalents | Original and rebuilt aliases match: `13b2b1e3898c5df30f5b97b9b37c2bb033fc01c5ae9f43fd64bd89a3fc3e938f`, 380462 bytes each |
| `git diff --exit-code HEAD -- src tests scripts package.json package-lock.json dist` | Exit 0: no changes to accepted implementation/tests/dependencies/build artifacts |
| Inline native emergency-profile feasibility check | Created an in-memory `defaultRU`, set five driver ratings to 40 and six personality tendencies to 50, then called unchanged `validateRU` and `derive(config())`; exit 0. This validates native input feasibility only, not an emergency grant, owner approval, economic metadata or a new saved record. |

Browser total: **86 functional groups**. Each runner attempted a real `file://` navigation and received `ERR_BLOCKED_BY_ADMINISTRATOR`. Existing runners then used their disclosed HTTP diagnostics, with offline context after document loading where supported. Their exit code 1 is retained, not reported as an unrestricted browser pass. No administrator restriction was bypassed. These results do not verify file-origin persistence or Windows downloads. Owner-confirmed local Windows acceptance of the exact accepted M2-C artifact remains separate evidence; no M2-D acceptance exists.

Reproduction of the inline replay check (existing functions only):

```js
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {verifyReplay} from './src/replay/replay.js';
const root = 'docs/m2-c/evidence/implementation/';
const p = JSON.parse(await readFile(root + 'parity.json', 'utf8'));
for (const ref of p.references) {
  const record = JSON.parse(gunzipSync(await readFile(root + ref.replayFile)));
  assert.equal(verifyReplay(record).checksum, ref.currentChecksum);
}
```

No new race outcomes or balance experiments were needed for this source-readiness preflight. Existing replay captures cover reference/autonomous × Pure/Combat × oval/C01/mixed-rally. The current full suite also exercises existing deterministic racing, market, economic and persistence cases. Passing these cases is not a claim of universal correctness or a test of future payroll mechanics.

Evidence: [manifest](evidence/manifest.json), [automated log](evidence/automated-tests.log), [build log](evidence/build.log), [replays](evidence/replay.json), and the five `*-browser.json` / `*-browser.log` files in [evidence](evidence/).

The only intended final worktree addition is `docs/m2-d/` (report, this verification note and fresh logs/JSON). All previous reports/evidence are unchanged. Generated screenshots/synthetic browser saves remain in the isolated temporary export, not in historical evidence or production storage. Typecheck/lint commands are not configured; no dependency or script was added to invent one.
