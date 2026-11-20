# P1.3 review package

Local implementation only; no merge, push, deployment, P2 work or owner acceptance is implied.

- [Endurance and pacing](BNT_P1_3_Endurance_and_Pacing.md)
- [Driver obedience](BNT_P1_3_Driver_Obedience.md)
- [Action costs](BNT_P1_3_Action_Costs.md)
- [112-race competitive validation](BNT_P1_3_Competitive_Validation.md)
- [Implementation, test results, performance and Windows instructions](BNT_P1_3_Implementation_and_Delivery.md)

Runtime commit `43928df0c1cfb7f5cb9c1ff903ef3db740b39983`; validation supplement `1c978ec6f2ddfab7d674c6d67e8b184a32f1cf39`. The documentation commit changes no runtime. The P1.3 HTML defaults to the new policy; programmatic session APIs preserve the earlier P1.2 default for compatibility.

Build: `node scripts/p1/build.mjs`. Output: `dist/Blood-and-Thunder-P1-Playable.html`. Review copy: `Blood-and-Thunder-P1.3-Playable.html`, 210,999 bytes, SHA-256 `da93655c5ff145afd4a5a0f092c03ae75019a5132cdf7a36c07cb488d202051e`.

Run `npm test` and `node --test tests/p1-3.test.js`. Matrix commands, browser commands and actual results are recorded in the delivery report. Diagnostic scripts default to `/workspace/deliverables/bnt-p1-3/evidence`; competitive/browser scripts accept `BNT_P13_OUT`. Keep baseline and candidate files together before invoking `scripts/p1-3/verify.mjs`.

Evidence is isolated here; earlier milestone references were not overwritten. Large raw JSON is losslessly gzip-compressed with deterministic headers. It includes all initial RUs, native full-precision finishes, trajectories, events, costs and profile settings. Browser logs disclose their caught managed `file://` limitation despite process exit0. Node full-suite logs are test results, not controlled timing benchmarks. `performance.json.gz` is the separately measured sequential sample.

Remaining acceptance: Windows Chrome/Edge offline direct-file tests, owner endurance/obedience balance review, and disposition of the measured 4–30% early-batch CPU regression and inherited long-history digest hitch. No claim of full Long Rally cross-runtime portability is made.
