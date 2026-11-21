# BNT P1.5 — Determinism and Compatibility

The reference is final P1.4 `3b0d043d0ca3b8e06bd0894ebff37d89be76e97e`, retaining native P1.3 tactical gameplay and P1.4 exact digest optimization. No historical checksum may be changed to accommodate this implementation.

## Compatibility contract

Worker scheduling affects when a live input is received, not how an already recorded input is replayed. Authoritative acceptance tick and native command order are recorded; deterministic reproduction requires identical setup and those identical accepted inputs. Identical mouse-click wall times across machines are not a deterministic input contract.

The delay-window exception is the owner-approved additional behavior. It is confined to an otherwise legal queue whose next still-visible activation boundary was already processed within the actual bounded lead. Native proof validation binds queue order, presented tick/time, next boundary event identity and accepted tick. Activation occurs at the ordinary AI decision gate, with no extra RNG draw, forced AI evaluation, rollback or additional opportunity cost.

Legacy schema-1 replay envelopes and native checkpoint graph containers are unchanged. An explicit `buffer-delay-v1` Sign-action payload and SIGN_DELAY_REQUESTED event describe the additional behavior. New commands require a P1.5-aware runtime. Older executables are not promised forward compatibility. Ordinary historical command records and native checkpoint wire structure are preserved.

A pending delayed instruction is derived exclusively from native command/event history. Restoring the existing checkpoint therefore restores its future activation authority. No main-thread clock, Worker wall time or private pending closure is required for native replay.

## Required proofs and evidence interpretation

`tests/p1-5.test.js` covers natural cadence, checkpoint/replay with a pending delayed request, malformed/expired/outside-window proofs, cancellation/replacement, normal/late dispositions, duplication/conflicting IDs, opportunity exhaustion, stale generations, protocol gaps/capacity failures, three-second countdown, future-event suppression, pause/tail/one-native-step, all Rally lengths, initialization from a native checkpoint, headstrong resistance and physical constraints. Some rare condition boundaries are controlled synthetic native fixtures, not complete viewer races.

`scripts/p1-5/native-equivalence.mjs` compares the actual Worker host with the frozen P1.4 engine across six complete native races. It compares intermediate native digests and the entire final replay, including events, RNG, classification, finish times and condition. `references.mjs` validates the 12 stored historical native and two payroll-context records without regenerating them.

`scripts/p1-5/sustained.mjs` compares complete Chromium C01/Long Rally Combat races across P1.4 reference, embedded Worker, and P1.5 synchronous mode. Same-browser equality is the relevant P1.5 separation proof. It is not a claim to resolve the inherited Node/Chromium Long Rally numerical discrepancy.

Browser smoke/fault evidence additionally exercises the actual embedded Worker, delay-window UI, no early active Sign, pause confirmation, tail drainage, native step, initialization fallback, explicit runtime stop, fresh-generation restart and offline operation. Direct-file availability is reported separately; managed HTTP results cannot establish Windows acceptance.

## Boundaries

- No movement, collision, combat, weather, fatigue, wear, AI utility, personality, native time-step, digest frequency or RNG policy change is authorized or implemented outside the approved delayed-Sign seam.
- Main-thread projections and compact AI presentation events are not native checkpoints or substitutes for native authoritative history.
- A Worker runtime failure abandons the in-memory race only after an explicit diagnostic. There is no transparent resume or silent replay. Manual restart is intentional and loses unfinished progress.
- Diagnostic checkpoint preparation starts at its saved native tick; automatic preservation of the pre-crash presentation buffer is not supplied.
- Existing production-career/E4 artifacts and storage remain separate. This milestone adds no career migrations or durable saves.

Final executed counts and command exits are in the Implementation report and the retained evidence manifest. Unexecuted Windows owner testing is not counted as a passing regression.

## Final executed results

Final application runtime `5d556f3adca146a6c17996234e34dcf4e98899db`: 630/630 configured Node tests passed, including 25 P1.5 tests. Final native, historical/payroll, earlier-profile, tactical, combat and browser probes all exited 0. Initial harness failures and their corrections remain identified in the Implementation report.

| Native fixture | Ticks | Status | Checksum | Full replay exact |
|---|---:|---|---|---|
| oval / Pure / 4 | 1775 | Ended | `fe2c019d` | yes |
| oval / Combat / 8 | 1841 | Ended | `7b871ef5` | yes |
| C01 / Pure / 8 | 3260 | Ended | `8101e90c` | yes |
| C01 / Combat / 8 | 3260 | Ended | `51624d65` | yes |
| rally-short / Combat / 8 | 1421 | Ended | `4d56ce44` | yes |
| rally-long / Combat / 8 | 4544 | Ended | `2c2d30ab` | yes |

The separate 18-state checkpoint probe compares P1.4 and P1.5 wire bytes, then full snapshots after ten restored native ticks; all match. Pending new delayed instructions also restore/replay in the P1.5-specific unit/browser proofs, including cancellation and exhausted/rejected input behavior.

For seed 145 tactical Long Rally Combat, the retained Node reference/current pair produces `2c2d30ab`; the retained Chromium reference/Worker pair produces `c5095aaa`. This inherited runtime difference is **not resolved or concealed**. The 100 clock states and three opt-in championship-context races passing cross-runtime probes do not establish universal physics portability. The supported identical-runtime replay contract is preserved.

The final browser pending-reset test queues and acknowledges a delayed instruction, restarts before activation, and verifies the prior command becomes abandoned-with-race while the new generation remains tick 0, three opportunities, no queued/active Sign. No command is silently replayed into the replacement race.
