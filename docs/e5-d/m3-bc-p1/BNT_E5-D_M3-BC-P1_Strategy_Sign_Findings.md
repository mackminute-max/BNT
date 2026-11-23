# Blood and Thunder — M3-BC-P1 Strategy Sign Findings

## Measured finding

Native `issueSign` cost in the controlled browser fixtures was about 0.1–0.3ms. The old full request cost was 84.4ms (Oval), 179.1ms (Circuit), and 493.9ms (eight-entrant Rally); the candidate measured 2.4, 2.6 and 4.6ms. Persistence/reconstruction dominated. An invasive native boundary algorithm change was not justified.

## Implemented optimization

Use the same native Sign implementation in the same worker, retain pending instructions in memory, and deliver immediate explicit unsaved feedback. Remove per-Sign durable commits and management reconstruction. The buffered input-delay command remains in the accepted native transcript; replay preserves acceptance order and crossing behavior. Rejected native inputs are retained where they affect native diagnostics/state.

## Rules preserved

- Existing default opportunity count, replacement cost, cancellation without refund and diagnostics.
- Existing starting-signal activation; subsequent Oval/Circuit start-finish crossing activation.
- Existing actual Rally Sign Points: Short50%, Medium thirds, Long25/50/75%. The authorization's approximate quarters describes Long Rally; geometry for other lengths was not changed.
- No immediate activation on arbitrary ticks, narrow input window, extra opportunity, refund or competing queue.
- Same native AI response, RNG consumption, journal replay semantics and full-state checksums.
- Pause, speed changes and same-worker navigation preserve accepted order. Browser/worker loss may lose the unfinished attempt's inputs as explicitly authorized.

## Executed coverage

The additive Node tests compare queue/replace/cancel accounting and terminal transcript replay; actual native Oval, Circuit and Rally races assert exact activation tick, no unrelated activation and complete replay-state equality. The long eight-entrant Rally test validates full native terminal parity. Browser tests exercise queued Signs, native pause barriers, playback speed, radio preference rebasing without native mutation, closure/restart and final publication. Full historical reference and payroll-context checks remain unchanged.

This work does not claim every possible driver/compliance outcome is an exhaustive new test. Existing native regression groups continue covering the accepted priority and compliance rules; their source and golden references were not weakened.
