import json,pathlib
R=pathlib.Path('docs/circuit-rally');S=json.loads((R/'evidence/smoke-summary.json').read_text());V=json.loads((R/'evidence/verification.json').read_text())
def table(headers,rows):return '| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(map(str,row))+' |' for row in rows)+'\n'
summary=table(['Preset','Races Pure / Combat','Finished / entries','Mean duration s','Lane changes / overtakes','Damage points','Checkpoints','Stalls / integrity / invalidated offense'],[[k,f"{v['pure']} / {v['combat']}",f"{v['finishes']} / 160",f"{v['meanDuration']:.3f}",f"{v['laneChanges']} / {v['overtakes']}",f"{v['damage']:.3f}",v['checkpointCrossings'],f"0 / {v['integrityFailures']} / {v['invalidatedAttacks']}"] for k,v in S['tracks'].items()])
report=f'''# Circuit and Rally implementation report

**Implemented: simulation0.5.0-courses, package0.5.0.** Existing Oval, Technical Circuit, Fast Circuit, Mixed-Terrain Rally and Technical Rally are selectable in one authoritative simulation and one standalone HTML. Ready for owner review with the verification limitations below. No deployment, publication or remote push performed.

## Baseline and authority

Latest source baseline: `6651ef9917fb3d4c5f33edbad6685b3ae6469d29`, simulation0.4.3-combat-ai. All **178 existing tests passed before changes**. The previous standalone is169883 bytes, SHA256 `29d3b74f0503f7a0538e7e4ee16728af82f9f5f6cb9c93bc6eacbedd28e765ac`. Executable source/tests/tools/package/artifact archive: `baseline/source.tar.gz`; revision/hash/test logs are adjacent. Four full oval reference recordings cover seed145, Pure/Combat and Clear/Heavy Rain-Mud; official outcomes/RNG/checksums are retained in `baseline/references.json`.

Original establishment documents and the latest Combat AI implementation were reviewed. This owner's latest request explicitly authorizes new course topology and Rally checkpoints, superseding the original oval-only prototype scope and line-only activation rule for Rally. It does not authorize a second physics engine, new combat or balance work. Historical audits and Phase2/2.1/refinement reports remain unchanged.

## Architecture: one engine, generalized track adapter

`src/track/oval.js` retains the original oval path for absent/null/`oval` definitions and the existing location/key/point/nextDistance APIs. Only non-oval definitions delegate to new `src/track/course.js`. Original default oval segment lengths/radii/surfaces, line placement, aligned rows, lap counting and finish clearance remain unchanged. Four exact baseline comparisons match **serialized complete events, RNG progression and official classification**; version/configuration metadata legitimately changes whole-state checksums.

Every format uses the same createRace→step chronological solver, movement integration, occupied-tile/lateral resolution, utility driver, contests, impact/damage, fatigue, condition, control, retirement, wrecks, finish snapshots, reporting and replay. Topology-aware gap/key helpers replace modulo assumptions in perception, combat range, hazard occupancy, contact persistence and safe clearing. Open courses never alias a terminal tile to a start tile. Closed courses retain cyclic neighbors/occupancy, including the original oval adapter.

Config adds one optional top-level `course` field, either a preset ID or complete validated definition. Pure/Combat remains an independent `format` dimension. Normalized course definition is stored in setup; compiled geometry/checkpoint cursor are authoritative state and included in checksums. There is no alternate circuit/rally engine, decorative-only geometry, continuous steering, terrain damage or elevation model.

## Track data and geometry

A definition contains:

```json
{{
  "id": "custom-rally", "name": "Custom Rally",
  "kind": "Rally", "closed": false, "lanes": 4,
  "segments": [
    {{"id":"start", "length":80, "tiles":10, "turn":0,
      "terrain":"dirt", "surface":{{"grip":1}}, "next":"finish"}},
    {{"id":"finish", "length":80, "tiles":10, "turn":0,
      "terrain":"stone", "next":null}}
  ],
  "checkpoints": [
    {{"id":"CP1","distance":40}},
    {{"id":"CP2","distance":80}},
    {{"id":"CP3","distance":120}}
  ]
}}
```

`length` is reference-lane metres (validated1..2000), `tiles` integer1..256, `turn` signed degrees−180..180,0 for straight. Positive is a right turn in Canvas coordinates; negative left. Arc radius = length/|angle|. Compiled segments carry ordered/cumulative cells/metres, direction/curvature-equivalent radius, start pose, end pose and next ID. Connections must match array order; final connection is first ID for Circuit and null for Rally. Four-lane geometry/radii must remain positive and fit validated lane offsets. Start must be straight with at least8 cells; Rally terminal must be straight. At most128 segments. Closed endpoints and headings must join within explicit small geometric tolerance. Invalid/duplicate/reserved IDs, malformed numbers/surfaces/connections/topology/checkpoints and nonclosing loops reject before replacing the current race.

Generic lane0 is the leftmost reference path; increasing lane index offsets right along its local normal. Therefore right-turn inner lanes have larger indices and shorter/tighter paths; left-turn inner lanes have smaller indices. Legacy action labels inward/outward retain their lane-index−1/+1 API; the new geometry-aware distance term selects the actual inside direction. The oval retains its established lane semantics and formulas.

Canvas points and authoritative lane-cell lengths derive from the **same analytic straight/arc definition**. For an arc, lane radius is `referenceRadius − direction × lane × laneWidth`; each lane's actual arc distance is |angle|×its radius. Position/heading are continuous at adjoining segments, including left-to-right sequences. Unit tests compare the numerical derivative of rendered points with actual lane travel length, as well as loop closure and boundary continuity. Runtime actual movement remains continuous speed/acceleration converted to the current lane-cell metric.

Closed courses place the common start line in the middle of the initial straight, leaving real approach space for aligned rows. Entry/full-physical-lap semantics are retained. Rally starts at reference distance0 with the same standing rows behind it; negative starting q is the approved grid approach, not backwards racing. Its first straight extends behind the start; the terminal straight extends beyond the finish to the exit. Neither extension wraps. No individual clock or grid-relative distance credit is introduced.

Raw q remains a longitudinal cell/cross-section coordinate. `courseDistance()` maps Rally q to reference-lane metres for progress display; lane-specific physical travel remains determined by location(). Checkpoints are common physical cross-sections, not separate lane-normalized finish credits.

## Presets and terrain

| Preset | Topology / purpose | Reference length / cells |
| --- | --- | --- |
| Existing Oval | Original four-lane oval; unchanged geometry | Original configured lengths/cells |
| Technical Circuit |8 rounded polygon corners, concave compound left/right sections, shorter straights |952.186m /125 cells |
| Fast Circuit |6 gentler corners, longer straights, one concave section |1473.385m /189 cells |
| Mixed-Terrain Rally |9 connected straight/arc sectors with all five terrain types |840m /108 cells |
| Technical Rally |10 sectors with frequent alternating turns and short passing windows |514m /66 cells |

Circuits are deterministic filleted polygons, not procedural tracks. Length/turn/next values are exported as ordinary editable configuration. Rally passing is constrained by short straights, corners, terrain and existing occupancy; no fake lane reduction or extra obstruction system was added. All four lanes remain physically available.

New provisional terrain defaults (existing surface parameters only):

| Terrain | Grip | Roughness | Rolling resistance | Hazard modifier |
| --- | --- | --- | --- | --- |
| Packed dirt (`dirt`) |1|.12|1|1|
| Stone/paved (`stone`) |1.1|.03|.95|.7|
| Loose gravel (`gravel`) |.8|.3|1.08|1.3|
| Sand (`sand`) |.7|.4|1.2|.9|
| Mud (`mud`) |.6|.5|1.25|1.4|

Segment surface overrides and existing global weather interactions remain supported. Values are provisional, configurable and validated through existing surface ranges. Hazard modifier continues weighting eligible incident placement, not raising the global incident clock. Existing oval neutral surfaces and every global weather/fatigue/damage coefficient remain unchanged.

## Movement, completion and checkpoints

The solver continues processing earliest within-tick boundary/contact/control events and recomputing affected remaining trajectories. Segment boundaries are tile boundaries, so the existing swept resolver automatically visits every intervening segment/tile, including several in one tick. Lateral changes preserve longitudinal cross-section/speed with the same occupancy legality. New progress keys and forward gaps prevent open-course teleportation, endpoint contacts or wrapped hazards. Surface-derived performance refreshes in the existing autonomous boundary path.

A shared finish-lock function captures full-precision crossing time and immutable individual-beast fatigue. Oval/Circuit call it after initial entry plus the configured full-lap count. Rally calls it at q=totalCells after initial start entry, with no completed-lap requirement. Same physical terminal line, tie tolerance, classification and retired-progress sorting apply to everyone. Rally ignores closed-lap configuration, including AI racing-position cost; an exact events/RNG/result regression compares laps1 versus7. No false lap/final-lap events occur in Rally.

Rally checkpoints are **three ordered reference-distance markers** (default25/50/75%), validated strictly inside the course. Their distances convert to possibly fractional q positions. Each actor has a cursor; swept progress triggers each marker at most once. A checkpoint inside a tile schedules an arrival subevent on the same authoritative clock, rather than polling render position or waiting for another integer tile. Blocked movement does not activate a checkpoint beyond the obstruction. Chronological physics and disablement remain authoritative before further tactical reactions.

Pre-race Pending activates at the signal in every format. During Rally, crossing the start entry line does not activate a subsequently queued sign; only the next checkpoint does. Crossing without a pending sign changes no sign state/use count. Replacements, pending cancellation/no refund, free lowering, existing active persistence, three successful queue uses and five compliance categories remain unchanged. A queue after the final checkpoint remains pending through finish and cannot activate there. The six existing signs and Pure prohibition of Engage are unchanged. A checkpoint activation triggers the established same-tick decision reaction via SIGN_ACTIVATED; telemetry still distinguishes intended/effective/physical outcomes.

Finishers continue physically to `finishQ + exitTiles`. Rally's exit is an unwrapped terminal extension; classification/time/snapshot stay locked. Disabled units remain anchored one-tile wrecks. A forced terminal obstruction regression produces explicit Stalled with a Finished unit still Clearing and a persistent wreck, preserving official time. Lethal-before/after-terminal tests demonstrate the original outcome precedence. No obstacle is teleported, cleaned up or silently bypassed.

## Autonomous course awareness

New tracks expose static current/next-corner information within an8-cell layout preview. Dynamic hazards/rival condition remain perception-filtered; no hidden opponent knowledge was added. New utility weights in `src/ai/weights.js` are provisional and validated0..100:

- `courseCornerRisk=2`: penalizes Push/Sprint projected overspeed relative to known lane curvature, weighted by Caution.
- `courseTerrainRisk=1`: penalizes high effort on current rough/low-grip terrain, weighted by Stamina Management.
- `courseLaneRisk=.4`: weighs tighter-lane corner exposure against the shorter-path preference.

These features are evaluated **only for generalized courses**. Straightaways lose the corner penalty, providing opportunities for existing pace/utility choices. Known direction reverses the old fixed inward bonus where right-hand geometry makes a larger lane index shorter. The underlying corner-speed/braking, driver-error, fatigue and combat formulas remain unchanged. Combat scoring only receives the final-checkpoint phase for Rally instead of an irrelevant final-lap estimate; no combat weight or physical coefficient was retuned.

## Interface, rendering and reporting

The main interface now selects Oval/Circuit/Rally, a matching preset and closed-course lap count. Lap input disables for Rally. Existing pause/step/speeds, radio, signs, inspection, results, developer controls, configuration storage/export and replay remain available. Developer surface options follow active segment IDs; full versioned JSON exposes segment length/turn/tiles/surface/next/checkpoint edits. Invalid imports preserve the current valid race. No graphical track editor was added.

Camera framing fits sampled analytic lane edges plus start/terminal runway to the Canvas. Terrain colors, lane lines, start/finish and cyan CP markers follow the actual route; all shapes use the same point mapping as motion lengths. Static framing supports longer courses without a new camera system. Rally standings use reference-metre Course% and checkpoint guidance instead of fictitious laps; results show checkpoint count/course fraction. The sign strip names the next eligible CP and its distance, including "none before finish". Selected track/type/weather are reported in the legend and technical metadata. Replay/configuration loads synchronize selection/geometry.

SEGMENT_ENTERED, COURSE_ENTERED and CHECKPOINT_CROSSED events support terrain/turn/checkpoint commentary. Segment radio messages are globally throttled to one per3s; checkpoint/finish/retirement messages remain priority events. Commentary consumes authoritative events and never changes state/RNG.

## Test evidence

- Before implementation: **178/178 retained automated tests pass**.
- Final suite: **203 pass,0 fail,0 skipped**, including25 new course regressions.
- Four old oval references: exact complete serialized event SHA256, RNG and official outcomes preserved across Pure/Combat, Clear/Mud. Whole-state hashes change with version/default metadata as expected; old checksums were not overwritten.
- Geometry tests: lane-distance derivatives, left/right inner reversal, continuous joins/closure, valid grid, malformed definitions, no open wrapping, multiple segments/checkpoints/terminal exit in one tick and legal lateral crossing at a boundary.
- Race/sign tests: common-line rear-row disadvantage, full precision/ties, terminal behavior, incidental/real ram consequences, Pure legality, surfaces/fatigue, wreck blockage, before/after-finish lethal contact, pre-signal/line/checkpoint activation, replacements/late pending/accounting/compliance, lap-independent Rally and exact permutation/replay.
- **25 verification checks**:4 old oval baseline comparisons,4 campaign accounting checks and **17 exported replay readbacks** (4 current oval,8 smoke representatives,5 UI-course records), full events/checkpoints/final checksum reconstructed.
- Browser: **23 retained +7 new functional checks pass**, including UI selection, step/sign/finish, Rally progress/checkpoint display, invalid config preservation and exact bundled/Node capture parity for every preset. No page errors or additional runtime resource requests. Screenshots under evidence were visually inspected for irregular geometry/terrain/checkpoints.

{summary}

The required final campaign has **80/80 Ended,640/640 finishers**,40 Pure/40 Combat across five weather presets, with no stalls, integrity errors, tool errors, bounds or invalidated attacks. Two seeds per weather/format/preset. Seeds701..720 are shared across tracks, so this is80 smoke executions, not80 independent balance trials. Raw setups/seeds/classification/condition/fatigue/events hashes/RNG/diagnostics are in `smoke-jobs.json`/`smoke-results.json`; the summary is reproducible with `scripts/circuit-rally/summarize.mjs`. Maximum within-tick event groups was18, well below the existing1024 default guard.

No autonomous offense occurred in this healthy/default-personality smoke campaign; positive-value Combat ram scenarios execute bilaterally on all four new geometries in focused tests. Incidental damage/terrain fatigue and overtaking occur in the full races. These counts do not establish combat frequency, lethality, optimal builds, technical passing balance or universal correctness. This is a smoke test, not a new balance study.

## Replay/configuration compatibility

New captures/configuration documents identify0.5.0-courses. Same-version reconstruction contains the selected course and checkpoint cursor/geometry. Raw legacy oval setups still default to the adapter. `parseConfiguration()` explicitly accepts the latest0.4.3-combat-ai **oval** configuration documents and normalizes them to current version; falsely labeled old-version course documents reject. Old replay records remain simulation-version-specific: use the archived0.4.3 source for old state checksums, not silent event/checksum migration. Actual old oval outcomes/events/RNG are separately proven unchanged. Older-than-latest config formats were not newly migrated.

## Artifact and direct offline verification

[dist/Blood_and_Thunder.html](../../dist/Blood_and_Thunder.html), **{V['artifact']['bytes']} bytes**, one vanilla-JS/HTML/CSS/Canvas file with inline bundled track definitions and no runtime libraries, server, network or adjacent assets.

SHA256:

`{V['artifact']['sha256']}`

`npm run build` passes the established embedded-runtime dependency guard. Both browser campaigns attempted direct file execution; managed Chromium denied it with administrator policy, then ran the explicitly labeled HTTP diagnostics. **Direct offline/double-click verification of this new hash remains outstanding** in a permitted browser. No restriction bypass or false HTTP-as-file claim. Prior owner confirmation of an older artifact is not extended to this release. Owner acceptance remains separate.

## Development failures, scope review and limitations

A first preset probe exposed missing surface defaults because string presets bypassed the normalizer; fixed by applying the same normalization/validation path as custom definitions. Integration review caught Rally's use of a closed-lap near-finish estimate; added the final-checkpoint context and exact lap-setting invariance regression, then reran the campaign. Initial smoke results are retained under development and excluded from final totals. Combined replay verification was OS-killed for memory (exit137); final isolated sequential child processes cap heaps at1024MiB with180s watchdog and verify all recordings without removing checks/replacing references. Details are retained in development/NOTES.md and replay-memory-limit.md.

Scope review confirms unchanged RU derivation, kinematics, weather/fatigue, Strategy Sign implementation, telemetry/compliance and replay modules; consequence constants/damage/impact/contests remain unchanged except topology-aware eligibility distance. Oval adapter remains the original model. New numeric values are limited to approved new terrain profiles and course-aware AI preferences. No progression, new action, staggered start, individual clock, dynamic weather, procedural generation, track editor, elevation or new vehicle physics was introduced.

Limitations: circular arcs/straights rather than splines, four lanes, static weather/geometry, short AI layout preview, existing discrete cross-section occupancy and instantaneous adjacent lane changes. Extreme valid custom geometries/tick/velocity combinations can still encounter explicit subevent/time safeguards; no silent teleport/finish repair is offered. Closed custom edits must preserve actual closure; the editor does not auto-solve geometry. Large custom definitions may cost more render/replay memory than the delivered presets. Symmetric physical rams and conservative opponent priors retain the previous refinement's limits. Blocked terminal clearance remains intentionally explicit. No new natural blocked-clearance outcome occurred in the80 final smoke races; forced regressions verify the behavior.

Ready for owner review of the five presets, checkpoint UX and new standalone. No final balance or owner acceptance is declared. No deployment, publication or push performed.
'''
# Keep identifiers/code intact while spacing prose numbers.
for old,new in [('simulation0.','simulation 0.'),('package0.','package 0.'),('is169883','is 169883'),('seed145','seed 145'),('least8','least 8'),('most128','most 128'),('validated1..2000','validated 1..2000'),('integer1..256','integer 1..256'),('degrees−180','degrees −180'),(',0 for',', 0 for'),('lane0','lane 0'),('lane-index−1/+1','lane-index −1/+1'),('|8 rounded','| 8 rounded'),('|6 gentler','| 6 gentler'),('|9 connected','| 9 connected'),('|10 sectors','| 10 sectors'),('default25/50/75%','default 25/50/75%'),('laps1 versus7','laps 1 versus 7'),('an8-cell','an 8-cell'),('validated0..100','validated 0..100'),('per3s','per 3s'),('pass,0 fail,0 skipped','pass, 0 fail, 0 skipped'),('including25','including 25'),('checks**:4','checks**: 4'),('comparisons,4','comparisons, 4'),('(**4','(** 4'),('(4 current oval,8 smoke','(4 current oval, 8 smoke'),('representatives,5 UI','representatives, 5 UI'),('640/640 finishers**,40','640/640 finishers**, 40'),('Seeds701','Seeds 701'),('is80 smoke','is 80 smoke'),('not80 independent','not 80 independent'),('was18','was 18'),('existing1024','existing 1024'),('identify0.','identify 0.'),('latest0.','latest 0.'),('archived0.','archived 0.'),('heaps at1024','heaps at 1024'),('with180s','with 180s'),('exit137','exit 137'),('in the80','in the 80')]:report=report.replace(old,new)
(R/'CIRCUIT_AND_RALLY_IMPLEMENTATION_REPORT.md').write_text(report)
