# BNT — P1.1 Pacing Balance Report

Branch: `feat/p1-1-pacing-presentation`. P1 baseline: `11fdec4f433850ac1272666b9fb4505cf18f8526` (runtime `bb39003c93d353cb35a8f4a853ab11ecca8b7976`). P1.1 implementation: `fce3ae7e87ba4a6c3b0877431c6c890fe5ee0287`. No merge, push or deployment.

## Method and scope

`node scripts/p1-1/pacing.mjs`: 120 matched diagnostic races = two profiles × three courses × endurance 30/80 × Clear/Extreme Heat × five intent schedules. Same seed 17, player/base ratings 55, native equipment/condition, one entrant and Pure format. Short Oval and C01 have two laps; generated Long Rally is point-to-point. Terrain uses the actual fixed circuit/rally data. Incidents are disabled only in diagnostic fixtures to isolate pacing.

The diagnostic controller keeps native autonomous physics/condition and selects intended pace/hold through high existing utility bases; half-route schedules change only those diagnostic utilities. Actual pace time is measured, not assumed. These are explicit internal test controls, not player Sign commands and not a new racing engine. Native driver errors/control/corner rules still apply. These diagnostic config switches are not claimed as player replay records.

A separate 30-race layer uses ordinary autonomous AI and legal pre-race/queued Signs: neutral, Push, Conserve, Push→Conserve and Conserve→Push across both profiles and three courses, endurance 55/Clear. Switch requests occur after 40% progress and wait for the next native eligible activation boundary. They consume at most two of the three native opportunities. Full queue/activation times and actual mode durations are retained.

The original reference-driver test mode was rejected for this experiment because source inspection confirmed it does not integrate fatigue. An initial zero-fatigue diagnostic was discarded, not interpreted as a gameplay defect. Final evidence uses autonomous integration throughout. No race outcome was post-processed to select a winner.

## Baseline versus revised matched results

Each row shows native finish seconds and final mean fatigue on 0–100. All 150 measured races reached native Ended. Average tick-sampled/peak speeds, 10-second fatigue/speed traces, recovered fatigue and actual pace durations are in `evidence/pacing.json`. Tick-sampled average speed is an approximation; finish time is native full precision. Do not treat one seed as universal balance proof.

| Course | Endurance | Weather | Intent | Baseline seconds / fatigue | P1.1 seconds / fatigue |
|---|---:|---|---|---:|---:|
| short-oval | 30 | Clear | Maintain | 53.81 / 8.4 | 54.02 / 8.3 |
| short-oval | 30 | Clear | Push | 52.38 / 14.3 | 55.00 / 52.8 |
| short-oval | 30 | Clear | PushThenConserve | 56.86 / 5.0 | 56.10 / 13.3 |
| short-oval | 30 | Clear | ConserveThenPush | 56.16 / 6.8 | 54.00 / 23.9 |
| short-oval | 30 | Clear | Sprint | 39.33 / 18.4 | 43.77 / 75.6 |
| short-oval | 30 | Extreme Heat | Maintain | 55.83 / 14.8 | 56.21 / 14.7 |
| short-oval | 30 | Extreme Heat | Push | 54.50 / 25.3 | 60.30 / 98.4 |
| short-oval | 30 | Extreme Heat | PushThenConserve | 59.27 / 14.3 | 60.56 / 42.5 |
| short-oval | 30 | Extreme Heat | ConserveThenPush | 58.30 / 13.0 | 56.42 / 42.9 |
| short-oval | 30 | Extreme Heat | Sprint | 41.35 / 32.9 | 51.39 / 100.0 |
| short-oval | 80 | Clear | Maintain | 53.68 / 4.9 | 53.80 / 4.8 |
| short-oval | 80 | Clear | Push | 52.15 / 8.3 | 53.41 / 29.9 |
| short-oval | 80 | Clear | PushThenConserve | 56.62 / 0.0 | 54.80 / 0.0 |
| short-oval | 80 | Clear | ConserveThenPush | 56.11 / 3.9 | 53.70 / 13.7 |
| short-oval | 80 | Clear | Sprint | 38.99 / 10.6 | 40.95 / 41.3 |
| short-oval | 80 | Extreme Heat | Maintain | 55.60 / 8.6 | 55.81 / 8.5 |
| short-oval | 80 | Extreme Heat | Push | 54.09 / 14.6 | 56.84 / 54.1 |
| short-oval | 80 | Extreme Heat | PushThenConserve | 58.84 / 5.5 | 58.02 / 15.1 |
| short-oval | 80 | Extreme Heat | ConserveThenPush | 58.14 / 6.9 | 55.84 / 24.5 |
| short-oval | 80 | Extreme Heat | Sprint | 40.70 / 18.9 | 46.07 / 79.0 |
| C01 | 30 | Clear | Maintain | 142.33 / 23.6 | 144.50 / 23.5 |
| C01 | 30 | Clear | Push | 137.99 / 40.0 | 170.40 / 100.0 |
| C01 | 30 | Clear | PushThenConserve | 153.95 / 12.8 | 163.39 / 34.8 |
| C01 | 30 | Clear | ConserveThenPush | 151.08 / 19.2 | 148.53 / 73.7 |
| C01 | 30 | Clear | Sprint | 105.62 / 52.1 | 141.77 / 100.0 |
| C01 | 30 | Extreme Heat | Maintain | 150.34 / 42.3 | 154.60 / 42.8 |
| C01 | 30 | Extreme Heat | Push | 147.63 / 72.7 | 186.59 / 100.0 |
| C01 | 30 | Extreme Heat | PushThenConserve | 164.18 / 39.3 | 189.67 / 79.3 |
| C01 | 30 | Extreme Heat | ConserveThenPush | 158.65 / 38.0 | 162.98 / 100.0 |
| C01 | 30 | Extreme Heat | Sprint | 116.52 / 97.8 | 153.66 / 100.0 |
| C01 | 80 | Clear | Maintain | 141.02 / 13.6 | 142.22 / 13.5 |
| C01 | 80 | Clear | Push | 135.64 / 22.9 | 154.74 / 91.9 |
| C01 | 80 | Clear | PushThenConserve | 151.70 / 0.0 | 149.00 / 0.0 |
| C01 | 80 | Clear | ConserveThenPush | 150.55 / 11.1 | 144.34 / 40.5 |
| C01 | 80 | Clear | Sprint | 103.84 / 29.9 | 129.49 / 100.0 |
| C01 | 80 | Extreme Heat | Maintain | 147.88 / 24.3 | 150.15 / 24.3 |
| C01 | 80 | Extreme Heat | Push | 143.05 / 41.1 | 176.43 / 100.0 |
| C01 | 80 | Extreme Heat | PushThenConserve | 160.04 / 14.4 | 170.68 / 40.2 |
| C01 | 80 | Extreme Heat | ConserveThenPush | 156.90 / 19.7 | 154.34 / 76.4 |
| C01 | 80 | Extreme Heat | Sprint | 110.84 / 54.3 | 147.88 / 100.0 |
| rally-long | 30 | Clear | Maintain | 183.41 / 33.4 | 187.10 / 33.5 |
| rally-long | 30 | Clear | Push | 176.67 / 56.3 | 212.70 / 100.0 |
| rally-long | 30 | Clear | PushThenConserve | 207.66 / 20.0 | 220.33 / 40.2 |
| rally-long | 30 | Clear | ConserveThenPush | 200.64 / 25.6 | 192.05 / 100.0 |
| rally-long | 30 | Clear | Sprint | 155.34 / 84.8 | 207.96 / 100.0 |
| rally-long | 30 | Extreme Heat | Maintain | 195.24 / 60.3 | 203.33 / 61.9 |
| rally-long | 30 | Extreme Heat | Push | 190.96 / 100.0 | 228.78 / 100.0 |
| rally-long | 30 | Extreme Heat | PushThenConserve | 227.37 / 58.9 | 247.83 / 73.1 |
| rally-long | 30 | Extreme Heat | ConserveThenPush | 212.92 / 53.3 | 209.06 / 100.0 |
| rally-long | 30 | Extreme Heat | Sprint | 172.62 / 100.0 | 224.41 / 100.0 |
| rally-long | 80 | Clear | Maintain | 181.25 / 19.2 | 183.23 / 19.1 |
| rally-long | 80 | Clear | Push | 173.28 / 32.2 | 202.10 / 100.0 |
| rally-long | 80 | Clear | PushThenConserve | 202.28 / 0.0 | 194.46 / 0.0 |
| rally-long | 80 | Clear | ConserveThenPush | 199.92 / 14.8 | 184.76 / 54.5 |
| rally-long | 80 | Clear | Sprint | 149.33 / 47.6 | 197.36 / 100.0 |
| rally-long | 80 | Extreme Heat | Maintain | 190.90 / 34.4 | 194.91 / 34.6 |
| rally-long | 80 | Extreme Heat | Push | 183.58 / 58.0 | 221.19 / 100.0 |
| rally-long | 80 | Extreme Heat | PushThenConserve | 217.19 / 22.3 | 231.01 / 44.3 |
| rally-long | 80 | Extreme Heat | ConserveThenPush | 209.63 / 26.4 | 200.53 / 100.0 |
| rally-long | 80 | Extreme Heat | Sprint | 163.11 / 88.3 | 218.06 / 100.0 |

## Findings

- The baseline already had some non-dominant Push cases, especially on technical corners; fatigue was not absent. P1.1 strengthens the consequences rather than claiming the old mechanic was entirely missing.
- Always Push is not universally dominant: on long routes its accumulated fatigue loses to Maintain and to saving endurance for later aggression. Superior endurance delays the cost; hot/rough conditions amplify it through existing formulas.
- Short-race Sprint can still win decisively, but it accumulates fatigue rapidly and retains native corner risk. It is not fatigue-free Sprint and it is not a new always-safe pace. Push often gains little on corners because it shares safe-corner caps with Maintain; do not promise an unconditional Push benefit on every track.
- Conserve has meaningful actual recovery. Mixed strategies can remove accumulated fatigue or preserve capacity for a late push; no strategy is forced to win an equal number of cases.
- Actual Sign-driven AI changes pace as fatigue rises even while Push the Pace remains active. An active Sign is a utility influence, not an override of fatigue or physical limits. Actual mode-time evidence records this distinction.

## Actual two-RU lead reversal

Native Standard Oval, eight laps, equal ratings/endurance 55, parallel lanes: inner EarlyPush versus outer Disciplined Maintain. Diagnostic cadence is held only to isolate these intentions; native movement/condition/finishes remain. The pusher led by 1.73 shared progress cells at 20 seconds, but was behind by 27.07 cells at 200 seconds. Finish times: 346.88 versus 314.38 seconds; fatigue 100 versus about 38.2. This demonstrates the requested possible early lead and late surrender without teleportation, damage injection or adjusted finishing times. Lane-distance differences are native, and the pusher even had the shorter inside lane. This is an isolated controlled illustration, not a universal head-to-head outcome claim.

## Limitations and reproducibility

Three representative low-endurance sustained-Push scenarios were rerun and matched exact checksum in `verification.json`. All 30 normal-Sign scenarios respect the opportunity budget. Existing legacy replay references are checked separately, not replaced with these diagnostics. Further balancing should use more seeds, fields, combat, weather and player feedback; this is a justified initial profile, not final game balance. No change to Sprint's existing corner semantics or full AI architecture was needed.
