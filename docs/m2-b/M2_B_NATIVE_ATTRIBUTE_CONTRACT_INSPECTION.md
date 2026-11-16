# Blood and Thunder — M2-B Native Attribute Contract Inspection

Date: 2026-11-16  
Inspected revision: `5e93b2c23ed74000b42d4658c1232cdc10d0f0fb` (M2-A)  
Purpose: document the native attribute contract for owner approval of the M2-B starting-package catalog.

## Scope and status

The owner approved Option B: the existing racing engine's attributes, ranges and formulas are authoritative. This report records the preceding read-only inspection. Exporting this report adds documentation only; production code, tests, dependencies, builds and save schemas remain unchanged. No tests or builds were executed for this inspection.

**Native ratings use a 0–100 scale, not a 1–10 scale.** Chariot weight and capacity have separate physical ranges. M2-B implementation remains paused pending the approved numerical catalog. M2-C, M2-D, M2-E and M3 remain unauthorized.

Source paths below are relative to the repository root. Line references refer to the inspected revision.

## 1. Driver attributes

| Native field | Type | Minimum | Maximum | Constructor default |
|---|---|---:|---:|---:|
| `driving` | Number | 0 | 100 | 50 |
| `beastHandling` | Number | 0 | 100 | 50 |
| `combat` | Number | 0 | 100 | 50 |
| `awareness` | Number | 0 | 100 | 50 |
| `nerve` | Number | 0 | 100 | 50 |
| `condition` | Number | 0 | 100 | 100 |
| `strain` | Number | 0 | 100 | 0 |

Definitions and defaults: `src/model/ru.js:10`, `driverAttributes`; `:24`, `component()`; `:30`, `defaultRU()`.

Optional `personality` contains `aggression`, `caution`, `patience`, `opportunism`, `staminaManagement`, and `tacticalDiscipline`. When supplied, all six must be finite numbers within 0–100, and unknown keys are rejected (`src/model/ru.js:85`, `validateRU()`).

`defaultRU()` does not assign personality. Race construction supplies a deterministic personality when absent, using the numeric portion of the RU ID (`src/sim/race.js:103`). `personality(index)` uses:

```js
25 + ((index * 23 + tendencyIndex * 17) % 61)
```

Source: `src/ai/driver.js:8–19`. At index zero the tendencies, in the order above, are 25, 42, 59, 76, 32 and 49. This is an algorithmic fallback, not a flat default of 50.

Driver **strain** is the native racing field. There is no native driver `fatigue` field. Management fatigue must remain distinct until an explicit mapping is approved.

## 2. Beast attributes

| Native field | Type | Minimum | Maximum | Constructor default |
|---|---|---:|---:|---:|
| `speed` | Number | 0 | 100 | 50 |
| `power` | Number | 0 | 100 | 50 |
| `agility` | Number | 0 | 100 | 50 |
| `endurance` | Number | 0 | 100 | 50 |
| `discipline` | Number | 0 | 100 | 50 |
| `toughness` | Number | 0 | 100 | 50 |
| `condition` | Number | 0 | 100 | 100 |
| `fatigue` | Number | 0 | 100 | 0 |

Source: `src/model/ru.js:2`, `beastAttributes`; `:30`, `defaultRU()`.

The engine validator permits **1–8 beasts** (`src/model/ru.js:59`). The factory creates two. Exactly two distinct owned beasts is therefore a management assembly requirement, not the engine's native team-size constraint.

There are no native species, breed, compatibility or familiarity fields in this component contract.

## 3. Chariot attributes and load semantics

| Native field | Type | Minimum | Maximum | Constructor default |
|---|---|---:|---:|---:|
| `stability` | Number | 0 | 100 | 50 |
| `durability` | Number | 0 | 100 | 50 |
| `protection` | Number | 0 | 100 | 50 |
| `rollingEfficiency` | Number | 0 | 100 | 50 |
| `maneuverability` | Number | 0 | 100 | 50 |
| `condition` | Number | 0 | 100 | 100 |
| `wear` | Number | 0 | 100 | 0 |
| `weight` | Number | 1 | 5,000 | 180 |
| `capacity` | Number | 1 | 10,000 | 400 |

Definitions: `src/model/ru.js:17`; defaults: `:30`; explicit weight/capacity validation: `:104–105`.

`derive()` defines:

```text
mass = chariot.weight + driverMass
       + beastCount × beastLoadMass + equipment.mass

load = (driverMass + equipment.mass) / chariot.capacity
```

Source: `src/model/ru.js:160–165`.

- Weight contributes to total movement mass.
- Capacity is a carried-load denominator, not a beast count, roster capacity or equipment-slot count.
- A load ratio above 1 is permitted. It incurs performance penalties through `max(1, load)`; it is not rejected as an incompatible assembly.
- Configuration explicitly labels mass inputs in kilograms (`src/config/config.js:23–26`). Capacity's interpretation as a comparable mass capacity follows from its use in the load formula; the component validator itself supplies no unit annotation.
- Default global allowances are `driverMass: 75` and `beastLoadMass: 10` per beast (`src/config/config.js:38–73`). There is no individual beast body-mass attribute or passenger mass field in this contract.
- `condition` and `wear` are separate numeric fields. A chariot `integrity` field is not accepted.

## 4. Shared validation contract

`src/model/ru.js:47–113`, `bounded()` and `validateRU()`, explicitly enforce:

- Finite JavaScript numbers. Strings, `NaN`, infinities and missing numeric fields fail.
- Inclusive numeric bounds. Fractional values are allowed; component ratings do not require integers.
- Required driver, chariot, beast and equipment fields.
- Rejection of unknown keys inside driver, beast, chariot and equipment components. This is not a blanket exact-key validation of the top-level RU object.
- An RU ID matching `[a-zA-Z0-9_-]{1,64}`, excluding the reserved ID `all`.
- A beast array containing 1–8 entries.

Defaults are supplied by constructors, not by `validateRU()`. Missing fields are not silently repaired.

The numeric validator accepts condition zero, but this does not establish race eligibility or continued operability. `updateControl()` has separate disablement/retirement checks (`src/sim/consequences.js:171`). Default thresholds include driver/chariot `disabledCondition: 5` and `minimumTeamCondition: 10` (`src/sim/consequences.js:41–42`). These are configurable consequence defaults, not alternative attribute bounds or management injury categories.

## 5. Equipment slots, effects and restrictions

The native engine consumes one aggregate equipment object:

| Field | Type | Enforced range | Default |
|---|---|---|---:|
| `equipment.mass` | Number | 0–10,000 | 0 |
| `equipment.combat` | Number | 0–100 | 0 |

Both fields are required; extra keys are rejected (`src/model/ru.js:106–112`).

Mass increases total mass and load. Combat contributes to derived combat effectiveness:

```text
combat = (driver.combat × combatSkill
          + equipment.combat × combatEquipment
          + control × combatControl) × driverCondition
```

Source: `src/model/ru.js:199–203`. Default weights are 0.6, 0.2 and 0.2 respectively (`src/config/config.js:75–102`).

**No native item-slot contract exists.** There are no item classes, weapon-slot requirements, species restrictions or equipment-count limits in this model. `eligibleCombat()` does not require an equipped weapon or a nonzero aggregate equipment Combat value (`src/sim/consequences.js:427`).

M2-A has reciprocal `chariots.equipment` / `equipment.installedOn` references (`src/career/registries.js:4–14`, `:44–45`). These are ownership-reference scaffolding, not implemented item slots, effect aggregation or compatibility rules. No additional restrictions or bonuses should be inferred from them.

## 6. Racing Unit construction and derived performance

`createRace()` (`src/sim/race.js:80–175`) clones supplied RU definitions, fills absent personality, derives validated statistics and creates runtime movement, AI, control and Strategy Sign state. RU IDs must be unique in the field (`:122–123`).

The native component payload contains a driver, a beast array, a chariot and aggregate equipment. Persistent component IDs, names and management metadata are not accepted inside those strictly validated component objects. Management integration needs an adapter rather than adding unrecognized fields to them.

`derive()` (`src/model/ru.js:114–229`) calculates:

| Stage | Existing relationship |
|---|---|
| Effective beast attributes | Each base rating multiplied by individual condition and fatigue impairment |
| Team Speed and Agility | Configurable blend of mean and minimum effective rating |
| Team Power | Sum of effective Power, multiplied by coordination |
| Team Endurance and Toughness | Mean effective rating |
| Team Discipline | Minimum effective Discipline |
| Coordination | Effective Discipline, driver Beast Handling and team mismatch |
| Handling | Agility, Maneuverability, Driving and Stability, with condition impairment |
| Control | Discipline, Driving, Beast Handling and Stability, with condition and morale effects |
| Maximum speed | Speed, Rolling Efficiency, mass and chariot condition/wear |
| Acceleration | Power, mass, grip and Handling, capped by acceleration limit |
| Endurance | Team Endurance divided by overload penalty |
| Resilience | Toughness, Protection and Durability, with chariot condition/wear |
| Combat | Driver Combat, equipment Combat and Control, with driver condition/strain |
| Other outputs | Braking, lateral movement, fatigue rate, recovery, collision resistance, effective Awareness and Nerve |

Key formulas include:

```text
effectiveBeastAttribute = base × condition/100 × (1 − impairment × fatigue/100)
driverCondition = condition/100 × (1 − impairment × strain/100)
chariotCondition = condition/100 × (1 − impairment × wear/100)

attributeMultiplier(x) = 1 + attributeStrength × (x/100 − 0.5)
massFactor = (referenceMass/mass)^massExponent / max(1, load)
```

See `src/model/ru.js:118–167`. Coefficients are centralized in `src/config/config.js`, including `tuningDefaults` at line 75; these remain configurable.

Weather and the current surface are applied by `deriveAt()` (`src/sim/race.js:399–408`), which adjusts grip and rolling resistance before deriving performance. A bare `derive()` call does not alone represent all live environmental effects.

Individual beast fatigue, driver strain and chariot wear evolve separately in `integrateCondition()` (`src/sim/environment.js:105–131`). No management fatigue, injury-category or equipment conversion has been approved or introduced.

## 7. Whether proposed 1–10 values can be used directly

**They pass numeric validation for rating fields, but do not preserve a conventional 1–10 scale meaning.** Native Speed 10 means 10 out of 100, substantially below the constructor benchmark of 50. There is no automatic normalization or multiplication by ten.

For example, with default `attributeStrength: 0.8`, the existing multiplier yields:

| Native rating | Multiplier |
|---:|---:|
| 1 | 0.608 |
| 5 | 0.640 |
| 10 | 0.680 |
| 50 | 1.000 |

Other relationships also use ratings directly, so this multiplier is illustrative rather than a complete performance conversion. Source: `src/model/ru.js:118`; default coefficient: `src/config/config.js:38–73`.

The owner-approved catalog must specify explicit native ratings. No automatic conversion is recommended as an implicit rule or implemented. Weight and capacity require separately chosen physical values.

## 8. Existing defaults and templates for catalog balancing

| Existing source | Values | Interpretation |
|---|---|---|
| `src/model/ru.js:30`, `defaultRU(id)` | Ratings 50; full condition; two beasts; weight 180; capacity 400; zero fatigue, strain, wear and equipment effects | Engine construction benchmark, not an approved career package |
| `src/sim/race.js:80–86`, default field | Eight RUs with uniform component ratings 46, 48, 50, 52, 54, 56, 58 and 60 | Default opponent-field template |
| `scripts/evaluation/scenarios.mjs:5–13` | Specialized beast archetypes using equal total attribute investment | Research fixtures, not approved starting assets or prices |
| `tests/fixtures.js:3–4` | General entrant helper defaults to rating 50 | Regression fixture benchmark |
| `tests/fixtures.js:53–66` | Specialized fractional ratings and deliberately damaged components | Diagnostic cases, not starter balance guidance |

The evaluation beast archetypes, in native order Speed / Power / Agility / Endurance / Discipline / Toughness, are:

| Archetype | Ratings | Total per beast |
|---|---|---:|
| Speed | 80 / 40 / 45 / 35 / 50 / 50 | 300 |
| Power | 45 / 85 / 40 / 35 / 45 / 50 | 300 |
| Handling | 45 / 40 / 80 / 40 / 60 / 35 | 300 |
| Endurance | 45 / 40 / 45 / 90 / 45 / 35 | 300 |
| Balanced | 50 / 50 / 50 / 50 / 50 / 50 | 300 |

Equal investment in these fixtures is an experimental control, not proof of equal competitive strength or a package-pricing rule.

**M2-A contains no approved persistent starting-asset catalog.** Foundation career creation supplies zero treasury (`src/career/legacy-state.js:92–96`), and `emptyManagement()` creates empty registries with `initialized: false` (`src/career/registries.js:16–17`). The registry module explicitly identifies itself as scaffolding without assets, prices or packages (`:3`).

## Owner review conclusion

The final package catalog should provide explicit native driver and beast ratings, chariot ratings plus weight/capacity, and any intended aggregate equipment effects. Constructor defaults and research fixtures provide comparison points only. They do not approve starting prices, package strength or equivalence.

The pristine-career initialization policy and protected initialization history remain applicable. No grants, conversions, management fatigue mappings, injury conversions, new equipment restrictions or production changes are implemented by this inspection or report export.
