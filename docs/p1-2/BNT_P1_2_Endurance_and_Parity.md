# BNT — P1.2 Endurance and Parity Changes

Branch `feat/p1-2-competitive-feedback`; baseline `74d7e73458fc01abc43cfb8f193832c04a3b3b9b` (P1.1 runtime `fce3ae7e87ba4a6c3b0877431c6c890fe5ee0287`). Implementation `53a0e4b122010ce44fee820a4b66e80cab060169`. No merge, push, release or deployment.

## Evidence-led disposition

The pre-tuning baseline report was written before numerical changes. It found four winning specialties and useful fatigue-aware AI; it did not justify rubber-banding, an attribute normalization policy or larger Sign strength. The default roster is retained. The player's selected attributes/build remain unchanged, and no opponent base attributes change after race creation.

Baseline ordinary-AI peak fatigue was 24.26. Candidate peak was 30.93 in the same representative matrix. A severe-fatigue curve is therefore a stress/overexertion safeguard, not the explanation for all changed ordinary placements. A small continuous remaining-distance/resource utility encourages use of otherwise unused late-race endurance without scripted phases or guaranteed attack/pacing outcomes.

## Versioned profiles and every numerical change

`legacy` preserves native defaults; `endurance` preserves P1.1 `p1.1-endurance-v1`; new default `competitive` is `p1.2-competitive-v1` in `src/prototype/pacing.js`. All P1.1 generation, recovery, exertion, impairment, pace and existing utility coefficients are retained. Only these optional settings are added:

| Parameter | P1.1 / historical default | P1.2 | Meaning / bounds |
|---|---|---:|---|
| `tuning.beastExhaustionStart` | Absent; no curve | 0.65 | Fractional fatigue start; finite 0≤start<1 |
| `tuning.beastExhaustionStrength` | Absent; no curve | 0.5 | Maximum extra beast-effective-attribute reduction; finite 0–1 |
| `autonomous.utility.finishUrgency` | Absent | 1.5 | Bounded existing-utility contribution from own progress/resources; validated 0–100 |

Core integration: `src/model/ru.js` adds `beastExhaustionFactor`; `src/config/config.js` recognizes optional curve keys without adding them to old default objects; `src/ai/finish-utility.js` and a conditional scorer hook in `src/ai/driver.js` add the optional utility; `src/ai/weights.js` accepts the optional coefficient. No default key is inserted into legacy snapshots, and the legacy arithmetic path is retained exactly.

Curve: x=clamp((fatigue/100−start)/(1−start),0,1); factor=1−strength×x²×(3−2x). Multiply only existing effective beast attributes by this factor, after their current condition/fatigue impairment. Factor is 1 up to fatigue65, smoothly falls to 0.5 at fatigue100, and has no cliff at either boundary. No new fatigue state or direct speed subtraction. Speed, power, agility, handling and acceleration still derive through native formulas. Driver strain/chariot wear do not receive this extra multiplier.

Finish utility: weight×progress⁴×(1−meanFatigue/100)×(0.5+opportunism/200)×intent, with intent Push=1, Sprint=.8, Conserve=−.5, others0. Progress is own public longitudinal progress relative to the known course/lap finish, clamped 0–1. This is a smooth utility term throughout the race, not scheduled phases. It uses no hidden rivals, rank-based boost, RNG or attribute change. It is suppressed for conflicting active Conserve Strength, Race Defensively and Hold Position. Existing personality, corner/terrain assessment, fatigue utility, driver errors and Sign priorities remain.

Coupled impairment remains **0.85**, not raised. Over the matched matrix, mean observed driver-strain delta was +0.1496 (max absolute +0.7518 on a 0–100 scale), and wear delta +0.0065 (max absolute +0.0338), from changed actual pacing/duration. Accumulation rules/rates are unchanged. Fixed-input tests verify that the new curve does not alter strain/wear impairment itself.

## All specialist outcomes, including unfavorable results

The 16 specialist fixtures per stage pair field/weather with seed (17: four/Clear; 145: eight/Extreme Heat), so they are representative rather than fully factorial. Profile duplication, grid and personality assignment differ; counts are not equal-opportunity win probabilities. Four additional current-roster checks are retained in raw data.

| Specialty | Baseline wins / appearances | Candidate wins / appearances | Baseline mean place | Candidate mean place |
|---|---:|---:|---:|---:|
| balanced | 7 / 24 | 7 / 24 | 3.458 | 3.375 |
| speed | 4 / 16 | 4 / 16 | 2.312 | 2.625 |
| endurance | 3 / 24 | 3 / 24 | 4.625 | 4.625 |
| handling | 2 / 16 | 2 / 16 | 3.500 | 3.312 |
| contact | 0 / 16 | 0 / 16 | 5.062 | 5.062 |

No winner-count distribution was forced. Speed remains strong; contact has no race wins in this sample. The controlled defensive check below shows a genuine benefit, not an attempt to give it artificial racing speed. Balanced, handling and endurance retain situational wins. Keep these unfavorable/inconclusive limits visible rather than declare perfect parity.

| Course / seed / format | Baseline winner / second gap s | Candidate winner / second gap s |
|---|---|---|
| oval / 17 / Pure | endurance / 0.792 | endurance / 0.571 |
| oval / 17 / Combat | endurance / 0.792 | endurance / 0.571 |
| oval / 145 / Pure | balanced / 0.732 | balanced / 0.822 |
| oval / 145 / Combat | balanced / 0.732 | balanced / 0.822 |
| C01 / 17 / Pure | balanced / 7.493 | balanced / 7.404 |
| C01 / 17 / Combat | balanced / 7.493 | balanced / 7.404 |
| C01 / 145 / Pure | handling / 1.377 | handling / 0.497 |
| C01 / 145 / Combat | handling / 1.377 | handling / 0.497 |
| rally-short / 17 / Pure | balanced / 0.748 | balanced / 1.190 |
| rally-short / 17 / Combat | balanced / 0.764 | balanced / 1.317 |
| rally-short / 145 / Pure | speed / 0.417 | speed / 0.289 |
| rally-short / 145 / Combat | speed / 0.417 | speed / 0.289 |
| rally-long / 17 / Pure | balanced / 3.435 | balanced / 3.566 |
| rally-long / 17 / Combat | endurance / 0.823 | endurance / 0.482 |
| rally-long / 145 / Pure | speed / 0.534 | speed / 1.862 |
| rally-long / 145 / Combat | speed / 0.774 | speed / 1.951 |

All 20 baseline and 20 candidate races reached Ended and passed native clearance. Raw per-entrant classifications, finishing gaps, actual pace durations, sampled fatigue/speed, damage, condition, strain/wear, overtakes, lead changes and DNF/unresolved status are retained without filtering. Ordinary matrix inputs were frozen at race creation. Tick-sampled speed/pace time is labeled an approximation; classification and event counts are authoritative.

## Multi-RU tortoise-and-hare stress fixtures

Eight additional native diagnostic races compare P1.1/P1.2 over four/eight entrants and two seeds, eight-lap Standard Oval. Requested pacing intents repeat Push/Maintain/Sprint/Conserve→late Push; AI cadence is initially held only for isolation, while native safety can still change actual pace. These are internal diagnostics, not unlimited player Sign inputs. Actual pace distributions and every result/trace are included.

| Profile | Field | Seed | R0 sustained Push time | R1 disciplined Maintain time | Native status |
|---|---:|---:|---:|---:|---|
| endurance | 4 | 17 | 346.884 | 314.380 | Ended |
| endurance | 4 | 145 | 346.884 | 314.380 | Ended |
| endurance | 8 | 17 | 346.884 | 314.380 | Ended |
| endurance | 8 | 145 | 346.884 | 310.156 | Ended |
| competitive | 4 | 17 | 355.125 | 314.380 | Ended |
| competitive | 4 | 145 | 355.125 | 314.380 | Ended |
| competitive | 8 | 17 | 355.125 | 314.380 | Ended |
| competitive | 8 | 145 | 355.125 | 310.318 | Ended |

The pusher leads early in sampled shared progress, then falls behind the disciplined racer. Native finish times determine placement; no teleportation, leader penalties, trailing boosts or result edits. Severe exhaustion further reduces the pusher's recovery/acceleration in P1.2. This is a possible dynamic, not a requirement that every conservative racer wins every race. `controlled-competition.json` preserves the complete sampled position/fatigue/speed progression and unfavorable Sprint outcomes.

## Contact tradeoff — five-seed defensive check

A matched native weapon fixture holds the attacker fixed and compares balanced/contact targets over 10 simulated seconds. This is not a race-win statistic or a test of identical engagement exposure: native movement/defense can change the number of attacks.

| Seed | Balanced damage / attacks | Contact damage / attacks |
|---:|---:|---:|
| 17 | 36.528 / 7 | 24.275 / 6 |
| 19 | 34.703 / 7 | 25.371 / 7 |
| 23 | 36.202 / 7 | 23.623 / 6 |
| 29 | 35.230 / 7 | 22.619 / 6 |
| 145 | 30.375 / 6 | 19.311 / 5 |

The contact build sustained less actual damage in each sampled duel, while still paying its race-speed cost. Do not generalize this small, deliberately targeted sample into guaranteed survival or wins. No new combat rule was introduced.

## Remaining limitations

Only two main matrix seeds and paired field/weather factors; further seed/grid rotations and owner playtesting are needed. Standard AI already avoids severe fatigue, so ordinary winner counts did not change; do not claim the severe curve alone transformed everyday competition. Endurance is valuable but not dominant. No new default matchmaking or roster-generation policy was justified. Native Sprint corner exemption/risk, fatigue generation/recovery, Sign strength and opportunity semantics are preserved. No historical references were overwritten.

## Matched normal-AI Strategy Sign response

Sixteen additional four-RU Combat races compare P1.1/P1.2 across C01/Long Rally with neutral, Push, Conserve and Engage Rivals. Seed17/Clear and the same specialist field are frozen; RU1 is the endurance specialist. Each nonneutral case queues once before the starting signal and spends exactly one of three native opportunities. No extra pacing commands or inferred attacks. Full baseline/candidate pace durations and native activation records are in sign-check.json.

| Course | Sign | P1.1 player finish s | P1.2 player finish s / place | P1.2 actual pace seconds | Own attacks |
|---|---|---:|---|---|---:|
| C01 | Neutral | 146.519 | 146.474 / 4 | Maintain 146.5 | 0 |
| C01 | Push the Pace | 149.918 | 150.121 / 4 | Push 109.1, Conserve 41.0 | 0 |
| C01 | Conserve Strength | 153.312 | 153.312 / 4 | Conserve 153.4 | 0 |
| C01 | Engage Rivals | 146.519 | 146.474 / 4 | Maintain 146.5 | 0 |
| rally-long | Neutral | 188.970 | 188.642 / 1 | Maintain 187.2, Conserve 1.5 | 0 |
| rally-long | Push the Pace | 191.580 | 191.760 / 4 | Push 133.0, Conserve 58.8 | 0 |
| rally-long | Conserve Strength | 198.949 | 198.949 / 4 | Conserve 199.0 | 0 |
| rally-long | Engage Rivals | 188.970 | 188.642 / 1 | Maintain 187.2, Conserve 1.5 | 0 |

Engage may legitimately produce no attack when this driver/field offers no chosen legal engagement. That is an explicit unfavorable/inconclusive outcome, not a reason to manufacture combat or increase Sign strength. The separate native browser fixture demonstrates an actual player HIT with damage and matching radio feedback.

All-entrant status distribution, baseline: `{'Finished': 128}` (including four default-roster checks).

All-entrant status distribution, candidate: `{'Finished': 128}` (including four default-roster checks).
