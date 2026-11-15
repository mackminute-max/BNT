# Test failures encountered during this corrective pass

The baseline suite passed all 114 tests. An initial 27-test corrective run passed 24 and failed three. This is a summary of that development run, not a retained verbatim console log.

- Two B01 forward-blockage cases (Pure and Combat) failed authoritative replay at tick 1/event 1. Expected SIGN_QUEUED, regenerated RU_RETIRED. Root cause: issueSign applied outside a tick was reconstructed inside the boundary after retirement. The fix records phase=paused and replays those signs before boundary condition effects. The assertions remain; both now pass.
- The new batch-report test used maxRaceTime=0.1, below the approved minimum of 1 second, so validation correctly rejected the fixture. It now tests the real summary aggregation using a resolved sign sample and linked interleaved decision events. A separate complete batch test verifies actual historical finish measurements. No configuration bound was weakened.

The expanded focused suite contains 30 passing cases; the final full suite contains 144 passing cases. The browser command's nonzero result for policy-blocked file navigation is recorded separately from its functional checks and is not suppressed.

A final auxiliary dependency scan initially reported a CSS-reference assertion failure because its whole-HTML, case-insensitive `url(` regex also matched JavaScript ObjectURL functions. The check was corrected to inspect CSS style blocks/attributes rather than JavaScript text; no runtime source or artifact changed. The corrected scan passes and the browser independently reports no additional runtime requests.
