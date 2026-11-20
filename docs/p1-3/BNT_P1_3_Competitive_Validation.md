# BNT P1.3 — Competitive Validation

Measured native races, not predicted outcomes. Runtime implementation `43928df0c1cfb7f5cb9c1ff903ef3db740b39983`; validation supplement `1c978ec6f2ddfab7d674c6d67e8b184a32f1cf39`.

## Matrix and method

Eight contexts × seven schedules × two profiles = **112 completed, D5-cleared races**, no Error, Stalled, DNF or unresolved results in this sample. Three repeated P1.3 full races match exactly. Fixed contexts combine—not fully cross—seeds 17/29/145, Pure/Combat, four/eight entrants, Clear/Rain/Extreme Heat, player Endurance 30/55/80. Courses are Standard Oval, technical C01, Short Rally and Long Rally. Ovals/circuit use two laps. Rally has no wrapping.

All schedule inputs use native queued Signs: before the starting signal and, for mixed schedules, queuing the second Sign after 40% progress. Activation waits for the next legal crossing. Queuing a second Sign before a crossing does not change the active order immediately. Mixed schedules spend two opportunities; sustained schedules one; autonomous schedules none. Rivals and initial assets match within each seven-schedule comparison except the explicitly selected player personality. Native racer specializations are disclosed in each saved initial RU. Player ratings are 55 except the specified Endurance. No forced pace, late asset edits, position edits, boosts or finish-time edits.

`baseline-competitive.json` is a fresh P1.2-policy measurement made with the opt-in extensions disabled. Six accepted earlier-profile full-race hashes independently verify compatibility. Measurements began with an uncommitted tree; raw sourceHEAD fields identify only the contemporaneous Git HEAD, not a clean-tree claim. Collection provenance is separately recorded in evidence/provenance.json. The frozen runtime reproduces candidate checksums. Raw JSON includes full initial RUs, classifications/gaps, fatigue/speed/acceleration/progress trajectories, action costs, opportunities and native overtakes/lead changes.

## Results

Times/gaps are native seconds. Rank is official final order; fatigue is final player mean. Displayed decimals here are rounded only for reporting. Native classification retains full precision.

| Context | Schedule | P1.2 time | P1.3 time | P1.3 rank | Gap to winner | Final fatigue |
|---|---|---|---|---|---|---|
| oval/17 | neutral | 76.671 | 77.822 | 1 | 0.000 | 17.9 |
| oval/17 | sustained-push | 80.135 | 80.805 | 2 | 1.814 | 100.0 |
| oval/17 | push-conserve | 79.791 | 83.000 | 4 | 4.010 | 49.1 |
| oval/17 | conserve-push | 77.645 | 72.738 | 1 | 0.000 | 61.9 |
| oval/17 | sustained-conserve | 79.765 | 79.766 | 2 | 0.776 | 0.0 |
| oval/17 | autonomous-aggressive | 77.912 | 78.930 | 1 | 0.000 | 25.1 |
| oval/17 | autonomous-disciplined | 76.551 | 77.995 | 1 | 0.000 | 14.4 |
| oval/29 | neutral | 82.982 | 83.724 | 1 | 0.000 | 14.4 |
| oval/29 | sustained-push | 85.618 | 75.336 | 1 | 0.000 | 94.1 |
| oval/29 | push-conserve | 85.245 | 80.715 | 1 | 0.000 | 8.6 |
| oval/29 | conserve-push | 83.182 | 76.761 | 1 | 0.000 | 39.9 |
| oval/29 | sustained-conserve | 86.884 | 86.869 | 2 | 0.665 | 0.0 |
| oval/29 | autonomous-aggressive | 84.586 | 84.923 | 2 | 0.944 | 23.8 |
| oval/29 | autonomous-disciplined | 82.971 | 83.651 | 1 | 0.000 | 13.6 |
| C01/145 | neutral | 143.547 | 146.440 | 5 | 6.207 | 18.4 |
| C01/145 | sustained-push | 145.626 | 147.401 | 6 | 7.167 | 100.0 |
| C01/145 | push-conserve | 147.011 | 160.210 | 8 | 19.977 | 38.3 |
| C01/145 | conserve-push | 145.436 | 133.904 | 1 | 0.000 | 95.1 |
| C01/145 | sustained-conserve | 148.956 | 147.534 | 6 | 7.301 | 0.0 |
| C01/145 | autonomous-aggressive | 146.300 | 148.073 | 6 | 7.840 | 25.3 |
| C01/145 | autonomous-disciplined | 142.997 | 145.453 | 4 | 5.220 | 14.6 |
| C01/17 | neutral | 154.966 | 158.259 | 4 | 11.430 | 21.8 |
| C01/17 | sustained-push | 161.018 | 171.564 | 4 | 24.735 | 100.0 |
| C01/17 | push-conserve | 160.026 | 189.413 | 4 | 42.584 | 79.0 |
| C01/17 | conserve-push | 155.684 | 157.032 | 4 | 10.203 | 100.0 |
| C01/17 | sustained-conserve | 154.788 | 154.804 | 2 | 7.975 | 0.0 |
| C01/17 | autonomous-aggressive | 158.405 | 161.259 | 4 | 14.431 | 29.5 |
| C01/17 | autonomous-disciplined | 153.951 | 157.693 | 4 | 10.864 | 16.9 |
| rally-short/29 | neutral | 54.626 | 55.504 | 2 | 2.852 | 13.6 |
| rally-short/29 | sustained-push | 54.902 | 55.567 | 2 | 2.915 | 97.3 |
| rally-short/29 | push-conserve | 57.019 | 58.901 | 4 | 6.249 | 23.0 |
| rally-short/29 | conserve-push | 54.064 | 54.372 | 2 | 1.720 | 41.7 |
| rally-short/29 | sustained-conserve | 59.682 | 59.682 | 4 | 7.030 | 0.0 |
| rally-short/29 | autonomous-aggressive | 55.300 | 56.468 | 3 | 3.816 | 23.6 |
| rally-short/29 | autonomous-disciplined | 54.793 | 55.433 | 2 | 2.781 | 13.2 |
| rally-long/145 | neutral | 198.085 | 200.884 | 2 | 2.730 | 18.4 |
| rally-long/145 | sustained-push | 203.912 | 230.133 | 7 | 31.979 | 100.0 |
| rally-long/145 | push-conserve | 205.209 | 225.506 | 7 | 27.352 | 3.5 |
| rally-long/145 | conserve-push | 200.375 | 205.193 | 3 | 7.039 | 100.0 |
| rally-long/145 | sustained-conserve | 204.618 | 204.619 | 3 | 6.465 | 0.0 |
| rally-long/145 | autonomous-aggressive | 200.588 | 203.528 | 3 | 5.374 | 26.1 |
| rally-long/145 | autonomous-disciplined | 197.469 | 199.679 | 2 | 1.525 | 14.7 |
| rally-long/17 | neutral | 199.787 | 204.948 | 2 | 3.972 | 20.9 |
| rally-long/17 | sustained-push | 212.485 | 247.679 | 4 | 46.703 | 100.0 |
| rally-long/17 | push-conserve | 209.640 | 267.705 | 4 | 66.728 | 72.1 |
| rally-long/17 | conserve-push | 203.408 | 214.904 | 4 | 13.928 | 100.0 |
| rally-long/17 | sustained-conserve | 200.616 | 200.621 | 1 | 0.000 | 0.0 |
| rally-long/17 | autonomous-aggressive | 205.132 | 209.514 | 4 | 8.538 | 30.0 |
| rally-long/17 | autonomous-disciplined | 198.627 | 203.589 | 2 | 2.613 | 16.2 |
| rally-short/145 | neutral | 60.190 | 60.998 | 2 | 0.381 | 11.5 |
| rally-short/145 | sustained-push | 60.919 | 53.850 | 1 | 0.000 | 73.5 |
| rally-short/145 | push-conserve | 63.398 | 58.569 | 1 | 0.000 | 12.3 |
| rally-short/145 | conserve-push | 60.186 | 56.669 | 1 | 0.000 | 29.3 |
| rally-short/145 | sustained-conserve | 63.323 | 63.323 | 4 | 2.706 | 0.0 |
| rally-short/145 | autonomous-aggressive | 59.918 | 60.860 | 2 | 0.244 | 20.8 |
| rally-short/145 | autonomous-disciplined | 60.567 | 60.998 | 2 | 0.381 | 11.5 |

## Native reversals and counterexamples

- Four-RU Oval, seed 17, Endurance 30: sustained Push leads from 6.35 s, reaches 100 fatigue, and RU2 overtakes at 72.7 s. Player finishes second at 80.805 s; winner 78.990 s. RU2 retains 17.76 fatigue and staminaManagement 78; it is not secretly boosted.
- Explicit two-RU disciplined-opponent fixture: Push regains the lead at 5.8 s, loses it at 63.95 s, and loses 80.805 vs 78.487 s. Opponent fatigue 13.97. Four-RU Long Rally disciplined-opponent fixture: Push leads at 8.8 s, loses the lead at 30 s, finishes fourth at 229.465 vs winner 187.424 s. These are additional native diagnostic rosters, not scripted demonstrations.
- Eight-RU Combat Oval, seed 29, Endurance 80: sustained Push **wins** at 75.336 s with 94.1 fatigue; neutral takes 83.724 s. Short Combat Rally seed 145: sustained Push wins at 53.846 s versus neutral 61.000 s. Aggression remains useful.
- Long Combat Rally seed 145: sustained Push falls to seventh at 230.133 s, versus neutral second at 200.884 s. Early Push then Conserve still finishes seventh, even after recovering to 3.5 fatigue: lost time does not magically return.
- Long Pure Rally seed 17, Extreme Heat, Endurance 30: sustained Conserve wins at 200.616 s; sustained Push finishes fourth at 247.679 s. This is a favorable endurance scenario, not evidence Conserve is universally best: it loses every other sampled context.
- Aggregate winner identities: player 14, speed-specialist rival 20, handling-specialist rival 9, balanced rival 13. Endurance/contact rivals do not win in this matrix. This is not a balanced tournament or proof that every specialization is viable everywhere; player Endurance and rival assignment are deliberately not equalized.

## Measurement limits

Pace durations use resolved-tick attribution, not exact subevent integration. Trajectory samples are every 200 ticks (10 s) plus finish. Sample ranks sort progress; official placements use native classification. Native OVERTAKE/LEAD_CHANGED events themselves are tick-boundary observations. Added-cost receipts are actual clamped resource spend; source counters count resolved physical subevents, not Sign uses. Compliance rolls each decision forward through its latest physical execution result. Counts measure decisions, not seconds or independent random trials.

No accepted checksum changed. The sample contains no DNFs, so it cannot establish new injury/DNF rates. Weather, seed, field size and Endurance are coupled; do not attribute all differences between contexts to Endurance. A separate matched-Endurance experiment controls these factors. Balance needs owner playtesting, particularly low-Endurance long-race Push, very strong perpetual Conserve recovery, and exceptional headstrong refusal frequency.

Reproduce with `BNT_P13_TAG=baseline BNT_P13_PACING=competitive node scripts/p1-3/competitive.mjs`, then candidate/tactical, followed by `node scripts/p1-3/verify.mjs`, `node scripts/p1-3/endurance.mjs`, and `node scripts/p1-3/tortoise.mjs`. Default diagnostic outputs are `/workspace/deliverables/bnt-p1-3/evidence`; `competitive.mjs` accepts `BNT_P13_OUT`.
