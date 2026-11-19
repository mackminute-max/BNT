import pathlib,json,re
p=pathlib.Path('/workspace/deliverables/e4-optimization');dest=pathlib.Path('/workspace/BNT/docs/m2-e/e4/performance')
def summary(n):
 text=(p/(n+'.log')).read_text();return {k:int(re.search(r'ℹ '+k+r' (\d+)',text).group(1)) for k in ['tests','pass','fail','cancelled','skipped']}
base,final=summary('baseline-node'),summary('regression-node');results=json.loads((p/'regression/results.json').read_text());refs=json.loads((p/'references/reference-comparison.json').read_text())
def table(headers,rows):return '| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(map(str,r))+' |' for r in rows)+'\n'
rows=[]
for r in results:
 path=r['script'];code=r['exit'];kind='PASS' if code==0 else 'Known direct-file policy block; HTTP functional groups pass'
 if path=='scripts/circuit-rally/browser.mjs':kind='Known obsolete trackPreset option timeout; runner unmodified'
 if path=='scripts/m2-e/clock-parity.mjs':kind='Known legacy native Math.log numerical diagnostic mismatch; runner unmodified'
 if '/e4/' in path and code:kind='FAIL — inspect evidence; not waived'
 rows.append([f'node {path}',code,kind])
reference=json.loads(pathlib.Path('/tmp/bnt-perf-regression/docs/m2-d/evidence/implementation/verification.json').read_text())
replayrows=[[r['setup']['driverMode'],r['setup']['format'],r['setup']['course'],r['checksum'],'matched'] for r in reference['historicalReplays']]
text=f'''# BNT M2-E4 — Optimization Test and Compatibility Evidence

## Frozen source and actual results

Baseline runtime: `a07c3d2ef3a97d47f349440e0533706d24f4a50f`; final runtime: `b8c090057052ac03bbed73d9487093da61381451`; branch `feat/m2-e-e4-persistence-recovery`. Full regressions ran against that final runtime and separately against the archived baseline. No expected historical outputs were changed. Source verification records the empty native racing/AI/track/championship-policy diff and unchanged dependency files.

| Command / scope | Actual outcome | Raw exit |
| --- | --- | --- |
| `npm test`, archived baseline | {base['pass']}/{base['tests']} passed; {base['fail']} failed; {base['skipped']} skipped; {base['cancelled']} cancelled | {(p/'baseline-node.exit').read_text().strip()} |
| `npm test`, frozen final runtime | {final['pass']}/{final['tests']} passed; {final['fail']} failed; {final['skipped']} skipped; {final['cancelled']} cancelled | {(p/'regression-node.exit').read_text().strip()} |
| `node --test tests/m2-e-foundation.test.js tests/m2-e-performance.test.js` | 41/41 passed (final runtime source) | 0 |
| `node --test tests/m2-e-performance.test.js` | 7/7 passed (inverse-cache source; subsequently included in final full suite) | 0 |
| `node --test tests/m2-e-e4-worker.test.js tests/m2-e-performance.test.js` | 10/10 passed at combined-cache intermediate revision, before final two new cases | 0 |
| `node scripts/m2-d/verify.mjs`, final archived copy | twelve historical plus two payroll references regenerated | {(p/'verify-final.exit').read_text().strip()} |
| `BNT_E4_ACCEPTANCE_OUT=<out> node scripts/m2-e/e4/acceptance/references.mjs <fresh-verification.json>` | 12 historical / 2 fresh payroll compared; 2 retained payroll artifacts replayed | {(p/'references.exit').read_text().strip()} |
| `npm run build`, twice with captured exits | identical committed HTML; external-runtime guard passed | 0 / 0 |
| `npm ls --depth=0` | locked esbuild 0.28.2 / playwright-core 1.65.1, no additions | {(p/'dependencies.exit').read_text().strip()} |

Regressions ran concurrently after all controlled performance measurements finished. Their elapsed times are not benchmark data. Legacy browser runners ran in `/tmp/bnt-perf-regression`, an archive of final runtime with a node_modules symlink, to avoid overwriting historical reports in the working repository. E4 runners used unique `BNT_E4_STAGE2_OUT` / `BNT_E4_STAGE1_OUT` directories. No source/test changes were made to produce passes.

## Executed browser/clock inventory — actual process exits

'''+table(['Exact command','Exit','Disposition'],rows)+f'''
There are {len(results)} runners: {sum(r['exit']==0 for r in results)} exit 0, {sum(r['exit']!=0 for r in results)} exit nonzero. The browser inventory is **not entirely passing**. The nine legacy file-policy blocks, obsolete circuit/rally selector timeout and native logarithm diagnostic remain separate from new E4 correctness checks. Per-run logs preserve their complete functional groups and errors. Managed HTTP success is not Windows direct-file acceptance.

Championship-clock parity passes 100 initial states and three complete races (Oval Pure `a74e4f71`, C01 Combat `005252df`, mixed Rally Combat `069e4340`). Legacy native-log diagnostic still differs: Node nextIncidentAt `313.0384349330031`, browser `313.03843493300315`; unchanged references remain `f9ba1205` / `b00ad2d3`.

## Actual E4 workflow and fault coverage

- Stage2 UI: 9 groups cover explicit migration/manual birth, paused Sign and automatic checkpoint/reload ordering, complete backup duplicate/interrupted restore, activation quota/lost acknowledgment, malformed/missing backups, exact-evidence checkpoint repair, empty-destination previous generation, committed-input acknowledgment loss, worker restart and full-race exactly-once publication.
- Visible files: 3 groups verify complete-container download content, file chooser plus confirmed restore, and separately warned career-only JSON. This is browser download testing, not a general claim that users' downloads are durably stored.
- Full browser close/reopen: 2 real-process sessions preserve durable progress/Signs and resume with matching native replay.
- Real quota runner preserves the corrected supported pre-origin Chromium quota setup, failed durable advance/head preservation and safe retry. All injected quota/transaction-abort tests remain intact.
- Retained runner validates final publication, complete backup/restore, retained sessions and twelve exact full native replays. It reuses the retained baseline aggregate; it is not a newly simulated twelve-event championship in this pass.
- Stage1 worker/coordinator runner validates atomic abort/CAS, migration, exact-byte caches, failure/restart, cold corruption/missing evidence, D2/standings/financial source parity and large retained storage.
- Stage1 fault runner covers four groups: concurrent tabs, every migration boundary including denied intent/witness, enumeration-order-independent migration retry, and real cold-origin quota denial/retry. Raw outcomes are retained; no assertion was weakened.

The full Node suite also exercises D2 thresholds, stale revisions, protected transaction history, duplicate/conflicting publication, missing journals, no-starter/withdrawal/title cases and rollback. These are reused accepted tests, not newly invented gameplay requirements.

## Replay compatibility — fresh comparisons

'''+table(['Driver mode','Format','Track','Checksum','Outcome'],replayrows)+'''
Payroll: Pure `ad509187`, Combat `f191ca35`; fresh generation and retained compressed-artifact replays match. Native package/payroll/browser compatibility remains covered by M2-B/M2-D runners and full Node suite.

Four full profiling native checksums match baseline: one-short `428bd803`, four-circuit `8a29f348`, eight-oval `95ad74b4`, eight-long Node `3cc91b8c`. All paired browser logical record byte counts match baseline. Codec golden fixtures were captured before implementation, not updated to match candidate output. The large native codec comparison confirms the complete 6,955,742-byte wire is identical, including LZW resets and little-endian bytes.

Recovery diagnostic: baseline and candidate serialized three-request sessions are exactly identical (576,443 bytes), tick 200/watermark 3/checksum `1afc6844`; corrupt latest checkpoint falls back only through complete committed evidence. Final recovery time 402.4 ms versus 1,982.8 ms controlled baseline.

Cross-runtime native checkpoint transfer: Node→Chromium ends `3cc91b8c`; Chromium→Node ends `aebb513e`, both exact source-context references. Fresh setup-only Long Rally still differs at tick0 due to Math.cos track geometry. Other engines/platforms are unverified. See the dedicated investigation; no numerical fix or golden update was made.

## Exact performance/diagnostic commands

```sh
BNT_PERF_OUT=<out> node scripts/m2-e/performance/profile.mjs
BNT_PERF_LABEL=baseline BNT_PERF_OUT=<out> node scripts/m2-e/performance/browser.mjs
BNT_PERF_LABEL=candidate BNT_PERF_OUT=<out> node scripts/m2-e/performance/browser.mjs
BNT_PERF_LABEL=candidate BNT_PERF_CASE=eight-long-late BNT_PERF_OUT=<out> node scripts/m2-e/performance/browser.mjs
node scripts/m2-e/performance/subsystems.mjs
node scripts/m2-e/performance/codec-compare.mjs
node scripts/m2-e/performance/raw-late.mjs
node scripts/m2-e/performance/journal.mjs
node scripts/m2-e/performance/cross-runtime.mjs
node scripts/m2-e/performance/cross-detail.mjs
node scripts/m2-e/performance/portability.mjs
```

Run the Node profiler from the baseline archive for baseline measurements, from the final checkout for candidate measurements. Baseline late browser uses label `baseline`. Development scripts contain the documented managed-workspace paths; prerequisites and reproduction notes are in README. Controlled before/after timings, subsystem sample caveats, memory samples, clone/IDB measurements and target misses are in the profiling report. Evidence includes compressed Node CPU profiles and machine-readable operations.

## Build and standalone

Both `dist/Blood_and_Thunder.html` and `dist/Blood-and-Thunder-Track-Test.html`: **1,047,085 bytes**, SHA-256 **`8a9b73409a84517f2b0c72c265499434afcf14d94037a645bec553a6b1cba9a3`**. Two captured builds reproduce each other and the runtime commit. Baseline artifact was 1,042,502 bytes, SHA `79a99ed587cef45c47f911bf59caf50c9f73bb9abb84f2f9fba2de6c73997ab5`. Delta +4,583 bytes. Inline worker and application are embedded; no external runtime dependencies were added.

Windows, Edge, Firefox and Safari were unavailable. Managed Chromium direct `file://` navigation fails `ERR_BLOCKED_BY_ADMINISTRATOR`; HTTP tests do not waive local Windows acceptance. Follow WINDOWS_ACCEPTANCE.md with the new hash before owner acceptance.

## Nonpassing/setup evidence disposition

The first `verify.mjs` launch raced archive extraction and failed `MODULE_NOT_FOUND` before the script existed in the temporary copy. The later actual verification and comparison both completed successfully; the failed setup log is retained, not represented as a product failure. An intermediate full Node run was stopped before freezing final source and is not counted as a completed suite. Only completed frozen baseline/final runs above establish the full-suite result.

No known legacy runner was repaired or removed under this task. No implementation changes were made after the frozen runtime; only diagnostic script/report/evidence additions follow it. Source and implementation commit inventory is in `evidence/source-verification.json`; evidence file hashes are in `evidence/MANIFEST.json`.
'''
(dest/'BNT_M2-E4_Optimization_Test_Evidence.md').write_text(text)
print('generated',base,final,'browser',len(results))
