# M6 checkpoint 1 — foundation proof (in progress)

Baseline source `41ed977f56be53f690adc53622688dcb12609e38`; the accepted manifest matched all 876 entries. The baseline Node suite executed 1349 tests, all passing, exit 0. Existing owner artifacts remain unchanged. No commit or push has been created.

The isolated M6 schema8 family uses current-state conservation, a bounded 64-command acknowledgment window, monotonic instance/closed-instance sequences, compact completed championship summaries and one immutable native initialization proof. Existing saves retain their original readers. The new family has its own slot/backend namespaces. Detailed native evidence remains authoritative until terminal choices close; current-root references are then retired atomically, and the previous root still retains its complete authority until superseded.

Executed proofs (raw files in `/workspace/deliverables/bnt-m6/evidence`):

- `node --test tests/m6-current.test.js`: 15 passing, exit 0 before the latest acknowledgment-request extension; rerun required.
- `node scripts/m6/idb-proof.mjs`: 19 checks passing, exit 0 before the latest initialization/acknowledgment extensions; rerun required.
- `node scripts/m6/foundation-proof.mjs`: two actual native races, D5 publication, Run selection, unpaid final review, terminal choice and cold reconstruction; exit 0 before latest extensions, rerun required.
- `node scripts/m6/worker-faults.mjs`: 32 checks passing against actual Chromium IndexedDB and the inline Worker, including two actual native races, zero ordinary playback writes, publication abort/retry, pending-final-review Gold/payroll invariance, final-choice commit abort, atomic final settlement/choice/compaction, lost acknowledgment retry and current-root session retirement. Exit 0.
- `node scripts/m6/creation-browser.mjs`: packaged management UI creation succeeds with Sundaran nationality, Greenvale starting nation, High Elf ancestry and Female Owner metadata. Schema8, no page errors, exit 0. Rebuild/rerun after subsequent source edits required.

Fault testing exposed and corrected two M6 adapter omissions: initialization-provenance lookup and duplicate terminal-choice acknowledgment before live-capability creation. Neither test failure was treated as success. Native old-rule behavior is not redefined.

This is foundation evidence, not full M6 acceptance. National boards, interaction changes, practice, gambling, capacity, full regression and final two-build reproducibility remain outstanding.
