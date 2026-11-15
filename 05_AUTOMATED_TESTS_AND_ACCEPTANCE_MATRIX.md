# Blood and Thunder — Automated Tests and Acceptance Matrix

**Status:** Mandatory test coverage. Tests should run headlessly from modular JS and validate the **bundled offline HTML** separately.

## Testing standards
- Use fixed seeds, stable entrant IDs, explicit scenario fixtures and expected invariants; report exact seed/config for failures.
- Unit-test formulas, config validation, sign transitions, component effects, and event ordering.
- Integration-test complete ticks and race outcomes; test within-tick event chronology and simultaneous-group resolution.
- Test permutation invariance by shuffling entrant storage order while retaining IDs, seeds, and commands.
- Use property/invariant tests for occupancy, bounded values, nonnegative time, persistent wrecks, deterministic logs, and no NaN/Infinity.
- Batch-test varied seeds/AI/builds and compare distributions; never substitute statistical plausibility for hard correctness.
- Re-run complete regression suite at every milestone. Keep test IDs stable and link failures to fixes.

## Mandatory acceptance cases
| ID | Scenario | Pass condition | Gate |
|---|---|---|---|
| T01 | Identical seed/config/commands | Exact matching authoritative events and classification | M1–M4 |
| T02 | Entrant storage permutation | Same outcomes, barring explicitly documented stable-ID tie behavior | M1 |
| T03 | Two RUs claim one tile | Legal deterministic conflict, no illegal overlap | M1 |
| T04 | Simultaneous lane swap | Swept paths checked; legal result/contact | M1 |
| T05 | Overspeed corner | Geometry/grip/control risk evaluated, not hard-capped | M1 |
| T06 | Mismatched beasts | Bottleneck and coordination alter derived performance | M1 |
| T07 | Sustained Sprint | Per-beast fatigue increases according to conditions | M2 |
| T08 | Conserve/recovery | Limited conditional fatigue recovery | M2 |
| T09 | All weather presets | Appropriate grip/visibility/fatigue modifiers | M2 |
| T10 | Offensive action in Pure | Rejected/never selected; incidental contact remains | M3 |
| T11 | Offensive action in Combat | Contest and defense reaction budget enforced | M3 |
| T12 | RU disabled | Retired plus stationary persistent one-tile wreck | M3 |
| T13 | Approach wreck | Legal avoidance/braking/contact, never phasing | M3 |
| T14 | Secondary wreck impact | Damage recorded once per new impact; wreck remains stationary | M3 |
| T15 | All lanes blocked | Explicit stalled-race termination, no fabricated finish | M3 |
| T16 | Queued sign | Activates on next line crossing; pre-race at signal | M2 |
| T17 | Pending replacement | Costs additional use, Active unchanged until activation | M2 |
| T18 | Pending cancellation | No allowance refund | M2 |
| T19 | Rear-row first crossing | Starts lap 1, not a completed lap | M1 |
| T20 | Same-time finish | Ties within configured tolerance | M1 |
| T21 | RU finishes | Locked time, continues to safe exit before removal | M4 |
| T22 | Paused developer override | Applied at boundary, old/new values logged | M4 |
| T23 | Replay reconstruction | Matching events/checkpoints/final checksum | M4 |
| T24 | Invalid configuration | Rejected with diagnostic, no silent coercion of critical values | M1 |
| T25 | Bundled HTML via file:// | Runs offline, no runtime imports/network/server | Every milestone |

## Additional mandatory edge cases
| ID | Scenario | Pass condition |
|---|---|---|
| E01 | High speed crosses several tiles/tick | Intervening occupied tiles checked |
| E02 | RU blocked for multiple ticks | No stored movement burst |
| E03 | Multiple same-time contacts | Simultaneous-group outcome independent of array order |
| E04 | Collision halfway through tick | Consequences affect remaining subinterval |
| E05 | Stationary contact persists | No fresh collision damage every tick |
| E06 | Secondary collision disables another RU | Second wreck persists and blocks path |
| E07 | All entrants retired | Race ends with valid retirement classification |
| E08 | Player RU retires with pending sign | Sign not activated, use not refunded |
| E09 | Engage Rivals in Pure Racing | Rejected without consuming use |
| E10 | Active sign lowered while paused | Immediate state change, replay command recorded |
| E11 | Finish and collision at nearly same time | Chronological ordering, official time and consequences correct |
| E12 | Exit crowded by multiple finishers | No premature removal or impossible occupancy |
| E13 | Incident generated on occupied tile | Eligibility/placement constraints enforced |
| E14 | Unavailable localStorage | Gameplay works; user can export config/replay |
| E15 | Corrupt imported configuration | Validation error, existing valid state preserved |
| E16 | NaN/Infinity or event-loop overflow | Explicit integrity error and diagnostic context |
| E17 | Renderer at different FPS | Same authoritative results |
| E18 | Commentary generation enabled/disabled | Same authoritative results and RNG progression |
| E19 | Same seed with paused live overrides | Exact replay of changes and resulting race |
| E20 | Short and long track segments | Correct lane-specific travel and finish timestamps |

## Test fixtures
Create reusable named scenarios: `empty_track`, `grid_eight`, `lane_conflict`, `lane_swap`, `fast_corner`, `mismatched_team`, `fatigue_sprint`, `rain_turn`, `pure_contact`, `combat_duel`, `single_wreck`, `wreck_chain`, `four_lane_blockage`, `finish_photo`, `rear_row_laps`, `finish_exit_queue`, `sign_replace`, `sign_before_retirement`, `override_replay`, `all_retired`. Each fixture stores seed, entrants, config snapshot, expected invariants, and ideally expected event/checksum snapshots with versioning.

## Batch statistics
Support configurable sample sizes and seed lists; log finish rate, winning distribution, overtakes, collisions, offensive attacks, successful defenses, component damage, DNFs, wreck count, incident count, fatigue at finish, race duration, sign compliance, and stalled races. Validate reproducibility and investigate pathological outcomes (zero passing, perpetual lane swapping, implausible 100% retirements, nonterminating races). No arbitrary target win rate is approved; report evidence rather than inventing a balance mandate.

## Evidence standard
Every release report must include test command(s), environment/browser, counts passed/failed/skipped, seed for failures, standalone artifact path, and explicit limitations. Do not mark an unexecuted GUI test as passed.
