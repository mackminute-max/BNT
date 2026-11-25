# BNT — M5 Provisional Mechanical Balance v1.0

**24 November 2026 • Content production only • Accepted M4 gameplay and repository unchanged.** Mechanical numbers are provisional authoring candidates, not accepted balance. No native generation engine, persistence migration or art has been implemented.

## Status and composition

All numerical tendencies/weights below are **provisional**. Canon supplies identity/anatomy, not these stats. Native five-driver and six-beast keys are unchanged; no physics, AI utility/cadence/error model, RNG, condition mapping, Sign opportunities or economy formula is modified. `metadata/provisional-balance-policy.json` states exact composition, single quality application, context selection and valuation projection.

Shared driver baseline per field: uniform42..68, mean55; one final individual uniform offset−7..7; source-capped0..100. Background adds a zero-sum specialization; developing/practiced/veteran experience contributes −3/0/+3 to all fields with25/60/15 weights, independent of biological age. Ancestry.experienceDelta explicitly0; no duplicate experience application. Quality adds one selected grade, not a second random baseline.

### Modest ancestry deltas

| ID | Ancestry | driving | beastHandling | combat | awareness | nerve |
| --- | --- | --- | --- | --- | --- | --- |
| A01 | Human | 0 | 0 | 0 | 0 | 0 |
| A02 | Orc | -1 | -1 | 2 | 0 | 0 |
| A03 | Goliath | -2 | -1 | 3 | 0 | 0 |
| A04 | Hill Dwarf | 1 | 0 | -1 | 0 | 0 |
| A05 | Mountain Dwarf | 1 | -2 | 1 | 0 | 0 |
| A06 | Halfling | 2 | 0 | -2 | 0 | 0 |
| A07 | Forest Elf | 1 | 1 | -2 | 0 | 0 |
| A08 | High Elf | 0 | 1 | -1 | 0 | 0 |
| A09 | Sea Elf | 2 | -1 | -1 | 0 | 0 |
| A10 | Gnome | 2 | 1 | -3 | 0 | 0 |
| A11 | Goblin | 1 | 1 | -2 | 0 | 0 |
| A12 | Dragonkin | -1 | -1 | 2 | 0 | 0 |
| A13 | Tortle | -2 | 0 | 2 | 0 | 0 |


Each ancestry delta sums0 and has magnitude≤3, small relative to~9-point sampled per-stat standard deviation and professional/quality differences. Awareness/nerve have no ancestry bias; personality selection has no ancestry term. These small physical/ergonomic starting-point hypotheses are not fixed competence classes or approved biological advantages. Native driverMass remains configured, not the canonical body weight. Each ancestry supports every background and archetype.

### Background tradeoffs

| Background | Driving | Handling | Combat | Awareness | Nerve |
| --- | --- | --- | --- | --- | --- |
| Road Courier | 3 | 1 | -3 | 2 | -3 |
| Circuit Apprentice | 5 | 0 | -4 | 1 | -2 |
| Working Team Handler | -1 | 5 | -3 | 0 | -1 |
| Arena Veteran | -2 | -2 | 6 | -3 | 1 |
| Rally Scout | 1 | 0 | -3 | 4 | -2 |
| Former Track Marshal | 0 | 1 | -2 | 3 | -2 |
| Festival Racer | 1 | 0 | -2 | -1 | 2 |
| Caravan Hauler | -1 | 4 | -2 | 0 | -1 |


Specialization is supplied by this distribution plus behavior/context, not a fictional new skill. Raw equal point budgets do not imply equal real performance; native handling/control/combat are nonlinear and require race tests.

### AI centers (each trait has uniform±13, final variation±5)

| Archetype | Aggression | Caution | Patience | Opportunism | Stamina | Discipline |
| --- | --- | --- | --- | --- | --- | --- |
| Technical Racer | 40 | 69 | 64 | 55 | 57 | 67 |
| Brawler | 78 | 34 | 36 | 65 | 39 | 45 |
| Daredevil | 80 | 24 | 33 | 74 | 32 | 39 |
| Endurance Specialist | 35 | 62 | 68 | 48 | 82 | 62 |
| Opportunist | 56 | 43 | 51 | 83 | 48 | 51 |
| Defensive Racer | 35 | 79 | 68 | 41 | 64 | 64 |
| Disciplined Professional | 45 | 59 | 62 | 51 | 61 | 83 |
| Showboat | 66 | 37 | 41 | 72 | 42 | 43 |
| Front Runner | 67 | 40 | 46 | 60 | 47 | 59 |
| Patient Pursuer | 40 | 62 | 81 | 71 | 67 | 64 |


Showboat is a risk/opportunity persona with theatrical biography; there is no crowd-seeking utility. Front Runner has no new lead-conditional hook; Patient Pursuer has no new target-memory planner. High tacticalDiscipline affects existing Sign behavior, not general skill. National/background tables multiply selection probabilities and normalize in stable order; no trait is forced by nationality/ancestry.

### Beast baseline centers (uniform±12, final individual variation±7)

| ID | Species | Speed | Power | Agility | Endurance | Discipline | Toughness |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B01 | Horse | 55 | 55 | 55 | 55 | 55 | 55 |
| B02 | Storm Elk (Hroven) | 58 | 60 | 50 | 57 | 46 | 59 |
| B03 | Crown Boar (Brond) | 48 | 63 | 53 | 52 | 53 | 61 |
| B04 | Meadowstrider (Vellin) | 63 | 48 | 62 | 55 | 56 | 46 |
| B05 | Racing Ram | 51 | 59 | 58 | 52 | 55 | 55 |
| B06 | Grun’Jho | 50 | 67 | 45 | 53 | 51 | 64 |
| B07 | Dire Wolf | 63 | 47 | 61 | 53 | 53 | 53 |
| B08 | Wingless Drake | 51 | 61 | 50 | 52 | 53 | 63 |
| B09 | Sunhorn (Saelor) | 60 | 50 | 57 | 63 | 51 | 49 |


All six-center sums are330. Power-oriented Grun’Jho and low-center Crown Boar trade speed/agility/control tendencies; Meadowstrider/Dire Wolf favor motion at lower pulling/resilience budgets; Sunhorn favors endurance with tradeoffs. These are provisional game profiles, not copied numerical canon. Native summed power, minimum discipline, speed/agility bottleneck and mismatch remain decisive; equal stat sums cannot certify cross-species balance.39 stock modifiers are small zero-sum tradeoffs, not cumulative breed upgrades. Horse styles retain descriptive status. Species body size remains visual metadata, not additional collision mass.

### Temperament deltas

| Temperament | Speed | Power | Agility | Endurance | Discipline | Toughness |
| --- | --- | --- | --- | --- | --- | --- |
| Steady | -2 | 0 | -2 | 0 | 4 | 0 |
| Spirited | 3 | 0 | 2 | 0 | -5 | 0 |
| Aggressive | 0 | 4 | 0 | 0 | -4 | 0 |
| Nervous | 2 | 0 | 2 | 0 | -4 | 0 |
| Stubborn | 0 | 2 | 0 | 0 | -3 | 1 |
| Eager | 3 | 0 | 0 | -2 | -1 | 0 |
| Tireless | -2 | -3 | 0 | 5 | 0 | 0 |
| Docile | -3 | -2 | 0 | 0 | 5 | 0 |


These adjectives change only supported statistical tendencies; no creature-controlled tactics, nerve field, infinite stamina, automatic calmness, breath weapon or magical immunity is implied. Age metadata has no decay/bonus effect. Positive partner compatibility is native stat-projection legality only; extreme visual size mismatch remains art layout review.

### Quality and observed ordinary sampling

| Grade | Tier | Stat delta | Q | Personnel wageQ | Base weight | Sample driver mean | Sample Horse mean |
| --- | --- | --- | --- | --- | --- | --- | --- |
| quality.affordable | Budget | -13 | 0.93 | 0.96 | 58 | 41.6856 | 41.9805 |
| quality.ordinary | Standard | 0 | 1 | 1 | 32 | 54.7006 | 54.9978 |
| quality.specialized | Standard | 3 | 1.08 | 1.04 | 7 | 57.6979 | 57.9931 |
| quality.rare | Premium | 12 | 1.08 | 1.06 | 2.7 | 66.7289 | 66.9813 |
| quality.exceptional | Premium | 20 | 1.15 | 1.1 | 0.3 | 74.6804 | 74.9715 |


Only exceptional sampled grade hit100, at~0.0418% of pooled driver/Horse attribute values in this fixture; no other sampled grade saturated. Ordinary ancestry/species samples did not saturate. Affordable/ordinary/specialized/rare/exceptional demonstrate escalating input budgets, not final calibrated prices. Specialization also depends on selected background/stock/temperament. No new rarity-driven fee multiplier.

Illustrative same-seed comparison: exceptional Horse stats sum444, affordable Wingless Drake sum246. This shows possible input-budget superiority of common stock, **not** proof of winning a race or universal raw-stat superiority under every random draw. Full race outcomes remain untested for this comparison.

## Native economics and difficulty

Valuation inputs use existing Budget/Standard/Premium, Q.85–1.15 and personnel wageQuality.9–1.1. Nonpersonnel wageQuality projects to null. Keep native health/conditionFactor, nearest5 half-up pricing, term surcharge, wages, acquisition basis and protected receipts. Profile Q is a provisional within-band input, not permission to change financial formulas. Staff expertise uses only native terms/15-point role discount with existing cap; higher-price staff do not secretly repair better.

Five existing championship contexts reference increasingly strong quality mixtures in `championship-difficulty-bindings.json`; the same coherent team grade should inform member generation without summoning new offscreen finance. No qualification, schedule, fee, scoring, reward or catalog content changes are supplied. Iron Gauntlet is not expanded; its integration mapping requires explicit existing-event handling. Final budget→price/difficulty mapping must be checked by Codex against native quotations and matched races before shipping.

## Required next balancing work

10,000-per-profile diagnostics are complete. Next: at least30 matched seeds/scenario across Pure/Combat Oval/Circuit/Rally and tiers, escalating100+ for close decisions; compare finish/DNF, time distribution, contact/damage, late fatigue, maneuver diagnostics, input agency and cost per performance. Include all13 ancestries,9 species, mixed pairs, ten archetype approximations, eight temperaments, exceptional Horse, M4 Run/Legacy modifiers/caps and Sign compliance. Use pairwise coverage plus explicit extremes, not exhaustive Cartesian explosion.

No universal best ancestry/species, no market domination at one price band, no cap inflation and no knowingly overpriced inert staff should pass final acceptance. Quantitative win-rate/economic thresholds are not approved here. If substantive native mechanics or financial-formula changes are needed, request owner approval rather than silently editing profiles/code to conceal a conflict.
