# BNT — P1 Experimental Build Comparison

Baseline: `de1bd66990a2bd390294a152f886b31e5bb8ac04`, accepted native runtime ancestor `b8c090057052ac03bbed73d9487093da61381451`. Branch: `feat/p1-playable-race`. Implementation commit: `bb39003c93d353cb35a8f4a853ab11ecca8b7976`. No merge, push, release or deployment. The pre-existing untracked M2-E readiness document remains untouched.

## Policy and numerical contract

These are experimental configurable development presets, not approved permanent balance, an acquired upgrade catalog, rewards or career assets. UI base ratings are 45, 55 (default) or 65; all supported native attribute ratings use that player baseline. Driver personality, equipment, condition/strain/fatigue/wear, opponents and their grid remain unchanged. Chariot baseline weight is the native 180; capacity 400. Other native fields retain engine defaults. Every race compiles a fresh clone and validates it; switching builds never modifies the prior compiled RU.

| Target / native field | Contact Specialist delta | Handling / Endurance delta | Default resulting A / B from rating 55 |
|---|---:|---:|---|
| Driver combat | +12 | −6 | 67 / 49 |
| Every beast endurance | −4 | +12 | 51 / 67 |
| Every beast agility | 0 | +10 | 55 / 65 |
| Every beast power | 0 | −4 | 55 / 51 |
| Chariot protection | +10 | −6 | 65 / 49 |
| Chariot stability | +8 | 0 | 63 / 55 |
| Chariot weight | +20 | 0 | 200 / 180 |
| Chariot rollingEfficiency | −5 | 0 | 50 / 55 |
| Chariot maneuverability | 0 | +10 | 55 / 65 |

Driver/beast/chariot ratings clamp to native 0–100; weight to 1–5000. Existing capacity and equipment validation remain. No condition is restored by build compilation. Contact trades endurance/rolling/load for combat/protection/stability; Handling trades power/protection/combat for agility/endurance/maneuverability.

Player-only coaching axes `(aggression, conservation, positioning, riskTolerance)`:

- Contact: `(0.8, −0.3, 0.4, 0.5)`.
- Handling: `(−0.5, 0.8, 0.8, −0.5)`.
- Existing coaching version 1 and weight 0.5 per axis; validated axes −1..1 and weights 0..2. Active native Signs suppress conflicting coaching channels through the existing scorer. No attribute bonus is granted by coaching itself.

Optional UI coaching overrides apply when preparing an ordinary selected race. The controlled A/B pair deliberately uses each preset's specified coaching and no Sign commands, as disclosed in the UI, so its build comparison is stable. Global AI/physics tuning is unchanged. Pure still forbids Engage Rivals/combat actions.

## Controlled results

`node scripts/p1/compare.mjs`: four entrants, Combat, Clear weather, one lap, fixed player grid and unchanged rivals; two courses × two seeds × two builds × two independent complete runs = **16 races**. All cleared; each repeated build/setup produced the same checksum. No result was adjusted to favor a build.

| Course / seed | Build | Checksum | Finish time | Executed decision-label distribution |
|---|---|---|---:|---|
| short-oval / 17 | contact | `44d92ffd` | 28.506806 | {"Maintain": 46, "hold": 56, "Push": 10} |
| short-oval / 17 | handling | `81915e77` | 28.023453 | {"Maintain": 55, "defendCombat": 13, "hold": 42} |
| short-oval / 145 | contact | `425fb8c7` | 28.489276 | {"Maintain": 46, "hold": 56, "Push": 10} |
| short-oval / 145 | handling | `c98e5797` | 28.023453 | {"Maintain": 56, "defendCombat": 13, "hold": 43} |
| C01 / 17 | contact | `e279eace` | 73.240052 | {"Maintain": 138, "hold": 143, "Push": 5} |
| C01 / 17 | handling | `9de6383e` | 72.151311 | {"Maintain": 135, "defendCombat": 13, "hold": 128, "Conserve": 6} |
| C01 / 145 | contact | `359d9bca` | 73.200298 | {"Maintain": 138, "hold": 143, "Push": 5} |
| C01 / 145 | handling | `e7855921` | 72.698522 | {"Maintain": 134, "defendCombat": 13, "hold": 129, "Conserve": 8} |

Decision counts derive from native `AI_DECISION.effects.executed` (fallback `chosen`). They describe execution-label telemetry, not proof a physical maneuver succeeded. Overtakes/contacts/attacks separately count native events involving the player; overtakes specifically identify the passer. No unsupported overtaking-attempt success ratio, cornering-error count or inferred race award is displayed. Final fatigue, native condition, wear, Sign activations, finish status/time and official classification are included in metrics.

The controlled figures show repeatable tactical differentiation: Contact selected Push in these fixtures; Handling showed different conserve/defensive behavior and fatigue outcomes. This is not a claim that either build dominates every course/seed, or that one-entrant tests prove contact success. Full four-entrant fixtures supplement the one-entrant browser UI pair. Raw individual outcomes/fatigue/contact counts are in `evidence/comparison.json`.

Legacy no-modifier references and native formulas were not changed. Existing twelve historical replay checks and two payroll references still match. No permanent assets or run progression are created.
