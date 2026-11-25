# BNT M5 — Track and Venue Contracts

**M5 competition readiness audit • 24 November 2026 • Investigation/design only.** Accepted M4 source/artifact and M5 Content Candidate v1.0 unchanged. EXISTING denotes verified code; PROPOSED denotes unimplemented contracts. Examples are explicitly UNAPPROVED.

## Verified geometry catalog

EXISTING `src/track/catalog.js:3–32`:3 oval presets and12 circuits. `course.js:107–112` also retains2 legacy circuits and2 fixed rallies. Thus19 inspected fixed preset entries, not19 distinct new catalog circuits. `technical-circuit`/C01 and `fast-circuit`/C05 share geometry but may differ in surface assignment; do not alias full physics merely from equal lengths.

| Native ID | Name | Kind | Reference metres | Lane0/1/2/3 metres | Segments | Cells | Default grid max≤64 | Intermediate checkpoints |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| short-oval | Short Oval | Oval | 330.796 | 330.796/355.929/381.062/406.195 | 4 | 56 | 12 | 0 |
| oval | Standard Oval | Oval | 539.911 | 539.911/565.044/590.177/615.31 | 4 | 80 | 20 | 0 |
| grand-oval | Grand Oval | Oval | 936.991 | 936.991/962.124/987.257/1012.389 | 4 | 126 | 36 | 0 |
| C01 | Broken Crown | Circuit | 952.186 | 952.186/927.053/901.92/876.788 | 16 | 125 | 24 | 0 |
| C02 | Serpent's Coil | Circuit | 1783.942 | 1783.942/1758.81/1733.677/1708.544 | 24 | 231 | 44 | 0 |
| C03 | Ironhook | Circuit | 1902.314 | 1902.314/1877.181/1852.049/1826.916 | 12 | 242 | 64 | 0 |
| C04 | Blackstone Run | Circuit | 1435.274 | 1435.274/1410.142/1385.009/1359.876 | 20 | 188 | 36 | 0 |
| C05 | Thunder's Bend | Circuit | 1473.385 | 1473.385/1448.252/1423.119/1397.987 | 12 | 189 | 48 | 0 |
| C06 | Widowmaker | Circuit | 1679.566 | 1679.566/1654.434/1629.301/1604.168 | 20 | 221 | 40 | 0 |
| C07 | Ashen Ring | Circuit | 1509.466 | 1509.466/1484.333/1459.2/1434.067 | 16 | 197 | 44 | 0 |
| C08 | King's Gauntlet | Circuit | 1836.624 | 1836.624/1811.491/1786.358/1761.226 | 24 | 240 | 52 | 0 |
| C09 | Red Fang | Circuit | 1694.265 | 1694.265/1669.132/1643.999/1618.867 | 18 | 219 | 48 | 0 |
| C10 | The Labyrinth | Circuit | 1803.212 | 1803.212/1778.08/1752.947/1727.814 | 28 | 239 | 44 | 0 |
| C11 | Stormbreaker | Circuit | 1787.925 | 1787.925/1762.792/1737.659/1712.527 | 16 | 228 | 52 | 0 |
| C12 | Devil's Spine | Circuit | 1820.15 | 1820.15/1795.017/1769.885/1744.752 | 22 | 236 | 60 | 0 |
| technical-circuit | Technical Circuit | Circuit | 952.186 | 952.186/927.053/901.92/876.788 | 16 | 125 | 24 | 0 |
| fast-circuit | Fast Circuit | Circuit | 1473.385 | 1473.385/1448.252/1423.119/1397.987 | 12 | 189 | 48 | 0 |
| mixed-rally | Mixed-Terrain Rally | Rally | 840 | 840/839.651/839.302/838.953 | 9 | 108 | 64 | 3 |
| technical-rally | Technical Rally | Rally | 514 | 514/514.349/514.698/515.047 | 10 | 66 | 64 | 3 |


These lengths are computed from actual compiled geometry/default four lanes4m wide. The grid column probes createRace counts1..64 with default gridGap2 tiles/gridOffset.5.64 means the native input ceiling was reached, not proof of capacity beyond64. Championship field remains1..8 (`championships/offers.js:11–16`). Actual changed width/grid configuration needs validation again; all catalog tracks accept the current8-entrant field.

## Physical contracts

- `track/oval.js:6–44`: two straights/two semicircular turns; shared longitudinal cells; start/finish halfway through a straight. Lane radius=innerRadius+lane*laneWidth, lap length=2*straightLength+2π*radius. Default oval per-source configuration differs between Short/Standard/Grand. Global config permits lanes1..8, but M5 default4.
- `track/course.js:17–77`: id ASCII native-safe≤64/name≤100, kind Circuit/Rally, closed iff Circuit, **lanes exactly4**,2..128 segments. Each segment: unique id, length1..2000m, tiles1..256, turn−180..180°, correct next linkage; first segment straight with≥8 tiles; Rally final straight. Native turn radius must fit all lane offsets. Closed seam position tolerance1e−6m/heading1e−7rad.
- Course lane length uses radius−sign(angle)*lane*laneWidth; right/left relative lanes differ. This is not the oval convention of monotonically longer outer-lane laps. Circuit start offset=floor(firstStraight.tiles/2); Rally offset0 and open endpoint extensions. `coursePoint`, `courseLocation`, `courseDistance`, `oval.point/location/finishQ` serve physics/rendering/progress.
- `validateFootprint(track,config)` samples the road corridor and detects distant overlap/ambiguous proximity. **createRace/freezeOffer do not automatically call this full corridor test**; generator does. The authoring compiler must call it on every resolved new configuration, not just accept JSON/connectivity.
- Race setup stores the resolved normalized course and full native config/entrants/surfaces/weather/environment metadata (`sim/race.js:235–263`). Freeze exact setup/hash at race birth; never reconstruct an established race from mutable current defaults.

## Surface and environment

| Terrain | Grip | Roughness | Rolling resistance | Hazard placement weight |
| --- | --- | --- | --- | --- |
| dirt | 1 | 0.12 | 1 | 1 |
| stone | 1.1 | 0.03 | 0.95 | 0.7 |
| gravel | 0.8 | 0.3 | 1.08 | 1.3 |
| sand | 0.7 | 0.4 | 1.2 | 0.9 |
| mud | 0.6 | 0.5 | 1.25 | 1.4 |


Coefficient bounds from `track/surfaces.js`: grip.1..2, roughness0..2, rollingResistance.1..2, hazardModifier0..2. First M5 content should select existing terrain presets rather than author arbitrary coefficients. Dirt is not neutral oval surface: oval defaults are1/0/1/1 until patched. Course segments merge defaults→terrain→explicit surface. When changing terrain on a previously normalized segment, old explicit coefficients can override the new terrain; compile from fresh template, clear derived overrides or deliberately compute final patches. Do not alter frozen active segments.

`createRace({surfaces:{segmentId:patch}})` supports per-segment patches for oval and courses; every segment can receive one terrain preset's coefficients. Course definitions also carry terrain per segment. Uniform/all, straight/corner patterns and explicit keyed segment maps are feasible compiler operations; seeded weighted pattern selection is a new generation adapter. Oval surface patch changes coefficients, not an existing terrain-name field. UI venue metadata must label intended surface correctly.

| Weather | Grip | Visibility | Fatigue | Recovery | Rolling | Crowd |
| --- | --- | --- | --- | --- | --- | --- |
| Clear | 1 | 1 | 1 | 1 | 1 | 1 |
| Rain | 0.8 | 0.8 | 1.1 | 0.95 | 1.05 | 1 |
| Heavy Rain/Mud | 0.55 | 0.6 | 1.35 | 0.8 | 1.3 | 1 |
| Dust/Wind | 0.9 | 0.45 | 1.15 | 0.9 | 1.1 | 1 |
| Extreme Heat | 0.95 | 0.9 | 1.7 | 0.55 | 1.05 | 1 |


Weather preset values from `sim/environment.js:4–44`; overrides finite.1..3 but first M5 should use presets. `race.js:421–430` combines surface/environment grip and rolling; environment.js:105–132 uses fatigue/recovery/roughness/wear; AI perception uses visibility. `incidents.js:92–106` hazardModifier weights eligible placement cells, **not global incident-clock frequency**. Incident types debris/animal/spectator exist; regional snow/ice, gust lateral forces, flooding, magic terrain or crowd-driven physics do not. Cold national architecture can be visual with existing Clear/Rain conditions; no snow traction approximation claimed as native ice mechanics.

## Rally generator

`rally-generator.js:9–77` has17 chunk IDs, categories short6/medium12/long22 chunks, terrain profiles balanced/road/rugged, safe-integer seed, optional weights0..100 nonnegative/nonzero, turnFrequency/turnSeverity0..1, chunks4..24, attempts1..32(default12), laneWidth1..4(default4), custom chunk library≤64 entries/1..5 segments with length1..200, turn±170. M5 need not expose custom chunks. Each generated route has80m endpoints, full resolved geometry, generation.version1/seed/options/attempt/fallback/chunk list. Bounded attempts then deterministic straight fallback are existing behavior, not arbitrary reroll success.

90 fresh seeded samples (30/category) repeated exactly and pass corridor validation; fallback0 in that sample. Median generation/validation short0.637ms, medium1.558ms, long4.163ms; observed long maximum20.292ms. Existing deliberate-fallback tests also pass in the executed suite. Names like `wide-passing`, `narrow-passage`, `rough-section` are **chunk labels**: no variable per-segment lane count/width or guaranteed rough surface follows from the name.

Seed alone is insufficient for permanent prestige reconstruction: pin generator version, ordered terrain/chunk recipe/catalog digest and fixed seed, validate/cache static resolved definition. Native metadata preserves full options, and import treats resolved geometry authoritative. Object iteration order influences native weighted chunk/terrain choices; do not re-sort old native recipes or update defaults under the same version. New content compiler uses a declared stable native terrain order and keeps exact resolved active geometry.

## Checkpoints / Signs / distance

Base generateRally always emits3 quarter-route checkpoints. Accepted `prototype/session.js:9–11` wrapper creates category Sign Points short1@1/2, medium2@1/3,2/3, long3@1/4,1/2,3/4; `normalizeCourse` validates the explicit policy and fractional distances. These are distinct configured paths, not proof every career Rally currently uses category-dependent points. M5 compiler should reuse the approved explicit policy for new generated courses and preserve old configurations unchanged.

`race.js:451–459,962–976` stops subevents at marker arrival and processes ordered crossed points in a while loop. Multi-marker/tick advance cannot skip queued activation if existing logic is reused. Pause/step changes playback, not tick order; crossing an activation point does not itself spend an opportunity—the queue command does. Default budget3 remains, with existing M4 modification. Point-to-point finishQ ignores lap multiplier; current Iron Gauntlet advertises laps2 even on fixed Rally, but its native Rally still runs once. Preserve that historical behavior; new Rally authoring declares one point-to-point traversal, not fake multi-lap open courses.

## Venue separation and prestige plan

PROPOSED geometryRef→venue identity/config→event setup. Embed16 prestige definitions (2/N planning target), share existing geometry refs and versioned surface/environment profiles. Store only venue/template versions in idle offers; freeze full resolved native setup at registration/start where native replay requires. No bespoke geometry/physics is needed for signature combinations. Generated venue IDs come from a separate career/epoch/context RNG domain, proper names from regional pools with bounded collision retries. Retain generated identity through the championship, compact historical name/region/geometry digest afterward; no ever-growing active venue registry.

Keep geometry template IDs and venue/event IDs separate. Existing renderer geometry cache/track sampling can draw every template. Oval template names and native reporter track tokens are not venue-aware; extend display metadata/projection without rewriting accepted reporter events or mutating old presets. Do not claim renamed geometry is a separate new physical circuit. Signature terrain/weather/architecture is feasible; narrow variable-width tracks, jumps, ice, magic obstacles and procedural circuit synthesis are deferred.
