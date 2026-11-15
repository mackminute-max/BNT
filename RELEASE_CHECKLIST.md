# Racing prototype release review — 0.4.1-m4

Status: **implementation reviewable; final acceptance blocked by direct offline launch verification**.

- [x] One authoritative headless simulator; vanilla JavaScript/HTML/CSS/Canvas.
- [x] Component attributes, derived calculations, independent fatigue/condition and tunable coefficients.
- [x] Continuous kinematics, analytic braking envelopes, swept occupancy and deterministic grouped conflicts.
- [x] Aligned grid, common-line entry/full laps, unrounded finish times/ties and official classification.
- [x] Autonomous utility AI, six tendencies, filtered perception and separate error categories.
- [x] Pure/Combat legality, contested attacks/reactions, physical damage, control and stationary persistent wrecks.
- [x] Five weather presets, surface modifiers, crowd morale/performance and weighted optional incidents.
- [x] Six queued signs, correct accounting/activation/cancel/lower behavior and compliance diagnostics.
- [x] Legal post-finish clearing, crowded queues, blocked-exit safeguards and locked official results.
- [x] Prominent event-driven commentary, standings/conditions, pause/speed/step and three result views.
- [x] Component/bulk editing, derived/AI inspection, global/model/environment/combat tuners and setup/lineup JSON.
- [x] Validated paused live edits, command ordering, old/new audit records and deterministic replay.
- [x] Versioned configuration save/load/reset/import/export; denied storage preserves play and backups.
- [x] Authoritative replay, periodic checksums, event comparison, first divergence, pause/step/restart and read-only playback.
- [x] Safe-integer and cumulative seed validation before range expansion.
- [x] All twenty required named scenarios include normalized setups and expected invariants.
- [x] Lateral incident blocking and executed-pace compliance regressions pass.
- [x] Responsive seeded batches, cancellation, completed samples, distributions and technical statistics.
- [x] Automated scenarios covering T01–T24 and applicable E01–E20; 114 executed tests passed, none failed/skipped.
- [x] Current bundled browser engine matches Node for Pure and Combat-with-sign reference records.
- [x] 16 full default reference races (seeds 1..8, each format) completed without integrity errors or stalls after the braking fix.
- [x] One embedded HTML, no external runtime resource/server/Node requirement detected; zero runtime requests/errors in functional browser diagnostics.
- [x] Final HTML rebuilt and browser-checked after the final source change.
- [ ] **T25: actual built HTML launches directly via `file://` offline.** Managed Chromium rejects the URL with `ERR_BLOCKED_BY_ADMINISTRATOR`; HTTP diagnostic checks are not a substitute.
- [ ] Independent desktop double-click/offline verification and a second browser: not executed here.

The earlier milestones also retained the same unresolved direct-file gate; this checklist does not retroactively mark those offline checks passed. No final release acceptance or environment publication is claimed. Numerical balance and presentation remain owner-review matters; stable economy/campaign systems were expressly deferred from this racing prototype.

Current update evidence: `reports/MILESTONE_4_UPDATE.md`; 19 functional browser checks passed. The original audit remains a historical snapshot; its three defects no longer reproduce, while its offline verification blocker remains open.
