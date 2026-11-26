# Application structure and responsibility map

## Technology and entry path

Vanilla JavaScript ES modules; no production npm runtime dependencies or server. Canvas2D race graphics; HTML/CSS headquarters and controls. esbuild creates a single HTML containing app, styles, practice viewer, career viewer and inline Blob Worker source. Source is modular; the distributed artifact is self-contained. Browser storage is separate from HTML bytes.

Latest build starts `src/management/startup/entry.js`, sets compile-time family flags, hides the legacy developer workbench and enters `startShell` from `startup/shell.js`. The application mounts only after career selection. `startup/slots.js` owns per-career discovery/reservation, not financial grants. `creation/model.js` and career package authority prepare the complete new-career candidate. `management/playable.js` is the main headquarters integration and page event wiring. `ui/app.js` retains the older developer/race UI behind that shell; it is not the latest startup contract by itself.

## Source integration map

| Responsibility | Source | Observed contract |
|---|---|---|
| Startup, profiles, Options | `src/management/startup/{entry,shell,slots}.js` | Start/continue/load/create, independent career databases, global preferences; no implicit financial operation on navigation |
| New career | `src/management/creation/`, `src/career/packages.js`, `src/career/m6/current.js:createM6` | Existing five starting packages, eligibility, protected initialization; owner nationality/ancestry/sex is persistent |
| Headquarters pages | `src/management/playable.js`, `player-pages.js`, `headquarters/` | Home, Barn, Market, Staff, Workshop, Finances, Services, Championships, Records; Save/Load and Help under Options |
| Active racing unit | `headquarters/active-team.js`, `src/persistence/active-team.js`, `career/assembly.js`, `component-eligibility.js` | Native legal composition/availability, explicit third-beast replacement; presentation sidecar-v2 selection; frozen registration unaffected by later selection |
| Current M6 reducer | `src/career/m6/current.js:transactM6` | Cold validation, exact identity/revision, protected native commands, acknowledgments, high-water marks and retired-record handling |
| Markets/identity | `career/m6/{markets,presentation,emergency}.js`, `career/m5/`, `presentation/content/m3-bc.js` | Generated and fixed source offers, provenance, immutable recruitment identity-pack pin, exact acquired identity continuity |
| World/progression | `career/m6/{world,world-content.generated}.js`, `management/m6-world.js` | National progression, native local/Prestige templates; Sundaran requires seven ordinary national Prestige victories |
| Championship | `career/championships/`, `career/m4/`, `management/championship-e5.js`, `management/career-race/host.js` | Frozen offer/team/setup; manual starts; official clearance/publication; condition, standings, AI continuation and final settlement/rewards |
| Current save-domain store | `persistence/m6/{store,envelope}.js` | Synchronous prepare semantics on a staged storage facade; not proof of IndexedDB completion |
| Durable backend | `persistence/e4/{client,indexeddb,runtime,worker-service,worker-entry,backup,recovery}.js` | Worker prepares/validates; revision/read-set checked IDB root activation determines durability |
| Career race host/session | `management/career-race/{host,buffered-session}.js`, `persistence/race/memory-attempt.js`, `career/championships/viewer.js` | Authoritative host, RPC viewer transport, accepted input ordering, in-memory ordinary advance and trusted finalization |
| Buffered playback | `src/prototype/buffered/{client,worker,projection,app}.js` | Worker advances native state; bounded presentation buffering; playback is not an independent results calculator |
| Simulator | `src/sim/race.js:createRace,step,classification,digest,capture,run,issueSign` | Native authoritative state, fixed tick order, seeded RNG, classification and command effects |
| Dynamics | `sim/{kinematics,consequences,environment,incidents,action-costs,m6-interaction}.js` | Movement/collisions, recovery/weather/incidents, costs, M6 Signs/abilities; no presentation authority |
| AI | `src/ai/{driver,weights,directives,signs,coaching,combat-value,finish-utility}.js` | Native candidate scoring, traits, cadence and tactical choices |
| Track | `src/track/{course,oval,rally-generator,catalog,validation,surfaces}.js` | Geometry compilation, native tracks/generated Rally and progress; not decorative coordinates |
| RU/affinity | `src/model/ru.js`, `src/model/affinity.js`, `career/m5/d2/compatibility.js` | Derived native attributes, canonical ordinary matrix, same-species requirement and provenance-gated emergency exception |
| Determinism/checkpoints | `core/determinism.js`, `sim/foundation/`, `sim/deterministic-log.js`, `replay/replay.js` | Existing hashes/replay codec, complete state including nonfinite sentinels; internal digest logic still exists despite no player mid-race save requirement |
| Viewer | `src/presentation/renderer.js`, `geometry.js`, `canvas.js`, `fullscreen/`, `player/` | Canvas world and map rendering, camera, overlays; body/live UI depends on embedded build adapters |
| Race Radio | `src/reporting/commentary.js`, `presentation/content/`, `presentation/race-names.js` | Native event acceptance/priorities plus optional deterministic display-only alternate text; frozen names across views |
| Gambling | `career/m6/{bookmaker,gambling,den,den-runtime}.js`, `management/{m6-betting,m6-den}.js` | Accepted quote/stake/setup, native races, protected official wager settlement |
| Den projection | `presentation/{spectator,spectator-radio,spectator-fatigue}.js` | Fitted map, named standings and actual-event radio; ephemeral resolved-tick fatigue observations, not native authoritative events |
| Content | `content/{e5-d,m5,m6,presentation}/` | Versioned source/catalog data and amendments; generated consumer modules are not a separate game authority |

## Runtime flows

**Ordinary decision:** page → existing preview/command → Worker staged domain store → native validation/reducer → expected-generation/read-set IDB transaction → authoritative durable response → UI refresh. A Worker return or `durable:false` domain result is not a completed disk save.

**Race:** frozen saved starting setup → host/native Worker → in-memory ticks and ordered inputs → buffered presentation/map/radio → native terminal boundary and D5 proof → durable native prepare → validated official career publication → persistent condition/standings/pending entitlements. Between-event choice gates and final settlement remain existing protected operations. Closing before official completion restarts from the saved seed, not the last displayed tick.

**Spectator:** protected stake and fixed setup → same native simulator → display projection → official result → exactly-once wager consequence. Den cannot grant unrelated championship/world/payroll/Legacy progress. Participant wagers follow official championship settlement authority.

## Presentation and world assets

Dark Deco Retro Cartoon is the intended direction. Current UI still mixes historical CSS/components and replaceable temporary art. SVG/raster placeholders are not evidence that the M7 asset registry or final Design Library is implemented. `assets/`, `art-source/`, `src/presentation/assets.js` and versioned content briefs contain existing support. M7 contains a documentation audit only, in `docs/m7/BNT_M7_PreProduction_Audit.zip`.
