# BNT — P1.2 Competitive Baseline (pre-tuning)

Baseline source: `74d7e73458fc01abc43cfb8f193832c04a3b3b9b`. Current branch `feat/p1-2-competitive-feedback`. Baseline focused suites: 44 passed, zero failed. Only timing instrumentation was added before browser profiling; no numerical parameter was changed before this report.

## Matrix

16 specialist races: Oval/C01/Short Rally/Long Rally × seeds 17/145 × Pure/Combat. Seed 17 uses four entrants/Clear; seed 145 uses eight entrants/Extreme Heat. These factors are paired, not fully factorial; attribution and significance are limited. Four additional eight-entrant Clear/Pure races inspect the current default roster. All use ordinary autonomous AI, native tracks and P1.1 endurance tuning. No forced winner or edited post-start attributes.

Specialists are diagnostic frozen native builds: balanced all ratings 55; speed beasts speed65/endurance35/power60; endurance speed49/endurance80/power51; handling agility70/speed51/power50/chariot maneuverability70/protection47; contact combat75/protection70/stability65/weight200/beast speed51/agility48. Other fields retain base55, full condition and zero fatigue/strain/wear. Driver personalities are the existing native deterministic profiles, not overwritten. Actual full inputs and derived statistics are in baseline-competitive.json.

## Native results

| Course | Seed | Format | Winner | Second-place gap seconds | Native status |
|---|---:|---|---|---:|---|
| oval | 17 | Pure | endurance | 0.792 | Ended |
| oval | 17 | Combat | endurance | 0.792 | Ended |
| oval | 145 | Pure | balanced | 0.732 | Ended |
| oval | 145 | Combat | balanced | 0.732 | Ended |
| C01 | 17 | Pure | balanced | 7.493 | Ended |
| C01 | 17 | Combat | balanced | 7.493 | Ended |
| C01 | 145 | Pure | handling | 1.377 | Ended |
| C01 | 145 | Combat | handling | 1.377 | Ended |
| rally-short | 17 | Pure | balanced | 0.748 | Ended |
| rally-short | 17 | Combat | balanced | 0.764 | Ended |
| rally-short | 145 | Pure | speed | 0.417 | Ended |
| rally-short | 145 | Combat | speed | 0.417 | Ended |
| rally-long | 17 | Pure | balanced | 3.435 | Ended |
| rally-long | 17 | Combat | endurance | 0.823 | Ended |
| rally-long | 145 | Pure | speed | 0.534 | Ended |
| rally-long | 145 | Combat | speed | 0.774 | Ended |

Win counts: {'endurance': 3, 'balanced': 7, 'handling': 2, 'speed': 4}. Counts are not equal-opportunity estimates: duplicate profiles and grid/personality assignment vary by fixture.

Mean recorded positions: {'endurance': 4.625, 'handling': 3.5, 'contact': 5.062, 'balanced': 3.458, 'speed': 2.312}. Raw rows include every entrant, gap, actual pace distribution, fatigue trace, contact/attack/damage counts, condition, strain/wear and unresolved outcomes. Finishing gaps and classifications are native; speed/pace sampling is a resolved-tick approximation.

## Findings and disposition before tuning

- Four distinct specialties won; speed had the strongest mean placement and won both eight-field long-route cases. Endurance is useful but not universally best. Contact did not win: it sacrifices speed/weight for defensive/combat capability, with few engagement opportunities in these fixtures. Do not grant it artificial speed to manufacture equal wins.
- The current default field is not dominated by one universal RU: RU1 won Oval, RU7 won the inspected circuit/rallies; RU1 was close on Oval/Short Rally, with longer-route gaps. Last-place native gaps were approximately 13.1s Oval, 19.7s C01, 7.1s Short Rally and 26.1s Long Rally. The sample does not justify a new default matchmaking policy. Keep the current roster; do not normalize the selected player.
- P1.1 already makes AI conserve as fatigue rises. Its impairment is linear and coupled across beast fatigue, driver strain and chariot wear. Do not increase that global weight again. A bounded beast-only smooth exhaustion multiplier, enabled only by new optional prototype tuning, is the compatible candidate to test above severe fatigue. Compare all fixtures rather than claim it solves every long-route advantage.
- No sign-strength increase or scripted pacing phases are justified. No new AI architecture is necessary based on this sample. Remaining-distance-aware utility is not currently present and is not silently invented.
- Contact/attack scarcity is a feedback/physical opportunity issue as well as build economics; active Engage Rivals must say Seeking Opportunity without fabricating a hit.

## Evidence limits

This is a representative two-seed baseline, not final balance. Pure/Combat pairs can have identical outcomes when no attack opportunity occurs. No combat is inferred from closeness. No data or nonfinishers are filtered. Rendering performance is assessed separately from this competitive matrix.

## Pre-optimization frame diagnosis

Instrumented P1.1 4-second windows at 2×/4× showed circuit maximum frame intervals 116.7/133.3 ms correlated with native digest ticks 128.6/138.4 ms. Main draw and HUD submission means were below 0.4 ms. Setup/warm-up intervals were excluded after detecting initial contamination; a follow-up phase-aligned run includes a digest at 1× as well. Do not blame complex track drawing or change native dt/hash fidelity. Bounded view caching and differential DOM updates are suitable low-risk improvements, but cannot eliminate an indivisible digest tick.

## Candidate decision record

The baseline ordinary-AI peak fatigue was only 11.6–24.3 across the specialist fixtures. Drivers already back off before exhaustion, so a severe-fatigue curve alone is unlikely to change ordinary placements substantially. Test a small continuous public own-progress/resource utility as well, preserving personality and conflicting active Sign priority. This uses no scripted race phase or hidden competitor data. Keep the roster and global impairment unchanged; report negligible or adverse competitive changes honestly.

The pre-optimization frame figures above are the phase-800 exploratory run; final phase-850 matched windows with exact debt sampling are reported in the Performance report.
