# Blood and Thunder — Game Vision and Overall Structure

**Document type:** Project-wide game design and development guide  
**Version:** 2.0 — Standalone HTML redevelopment, 2026-11-14  
**Purpose:** Define the complete intended game, its principal systems, and the technical constraints for redevelopment as a self-contained browser game.  
**Status:** High-level design authority, not a complete numerical mechanics specification or a claim that any particular feature is already implemented.

## 1. Executive concept

**Blood and Thunder is a fantasy chariot-racing roguelite combining autonomous racing, auto-battler combat, and stable management.** The player is the owner and manager of a racing stable, not the person steering the chariot. They recruit and develop drivers and draft beasts, acquire and configure chariots, choose equipment and strategies, enter competitions, and manage the consequences.

Races unfold through an autonomous simulation. Drivers make moment-to-moment decisions according to their abilities, personalities, instructions, competitors, track, and conditions. The player influences their own entry through a limited number of **Strategy Signs**, but never directly drives it.

The experience should combine the anticipation of motorsport, the unpredictable spectacle of fantasy chariot racing, the planning of a management game, and the risk/reward decisions of a roguelite.

### Design pillars

1. **Management over reflexes.** Roster building, preparation, development, and strategic decisions matter more than reaction speed.
2. **Distinct autonomous competitors.** Driver personality, skill, beasts, and equipment create recognizable behavior.
3. **Consistent and understandable simulation.** Speed, positioning, fatigue, handling, contact, damage, and outcomes have explainable causes.
4. **Limited, meaningful intervention.** Strategy Signs have a noticeable influence without guaranteeing obedience.
5. **Consequential runs.** Each series of races involves escalating choices, losses, and opportunities; the home stable provides continuity.
6. **Emergent drama.** Overtakes, risky maneuvers, crashes, surprises, and rivalries arise from game systems rather than scripted outcomes.
7. **Mechanics before visual polish.** Readability, balance, and reliable behavior take precedence over expensive graphics.
8. **Standalone distribution.** The complete playable release must be one offline-capable HTML file.

## 2. Setting and identity

Blood and Thunder is set in a **fantasy racing world**, not a strict recreation of ancient Rome. Chariots can be drawn by different beasts, driven by characters with distinctive skills and temperaments, and equipped with unusual or potentially magical gear. Racing can be brutal, but not every competition allows deliberate violence.

The setting should accommodate different stables, venues, rivalries, equipment traditions, and competition formats. Specific nations, factions, currencies, leagues, named characters, and magic lore are **not yet finalized** and should not be invented as fixed canon by a coding agent.

## 3. The player's role

The player manages a **persistent stable** with multiple potential drivers, beasts, and chariots. They enter **one Racing Unit (RU) per race**, assembling it from available assets.

| Phase | Player decisions |
|---|---|
| Home stable | Maintain roster, assets, inventory, readiness, and long-term development |
| Start of run | Select a team and commit resources to a series of races |
| Pre-race | Examine track, rules, conditions, opponents, equipment, and opening strategy |
| During race | Watch the autonomous race and queue a limited number of Strategy Signs |
| Post-race | Review classification, performance, rewards, fatigue, damage, and injuries |
| Between races | Repair, recover, upgrade, respond to events, and prepare for the next contest |
| End of run | Resolve rewards and lasting consequences; return to the home stable |

The player's most important agency is in preparation and resource management, with a smaller but consequential tactical role during races.

## 4. Core gameplay loop

```text
HOME STABLE
  Roster • chariots • beasts • equipment • persistent development
       |
       v
START RUN / ASSEMBLE RACING UNIT
       |
       v
PRE-RACE PREPARATION
  Rules • track • rivals • conditions • opening Strategy Sign
       |
       v
AUTONOMOUS RACE
  AI racing • optional combat • queued Strategy Signs • commentary
       |
       v
RESULTS AND CONSEQUENCES
  Placement • rewards • damage • fatigue • injuries
       |
       +-----------------------+
       |                       |
       v                       v
MORE RACES                RUN COMPLETE
  Events • repairs          Permanent rewards
  Temporary upgrades        Lasting consequences
  Resource decisions        Return to home stable
       |
       v
NEXT RACE
```

The **race** is the dramatic centerpiece. The **stable and run** provide the strategic context that makes race outcomes meaningful. The full game must connect all three.

## 5. Racing Units and component design

An **RU** consists of a **driver, chariot, draft beasts, equipment, and current condition**. These parts contribute to derived performance and can be affected independently by damage and upgrades.

### Draft beasts

Each beast has attributes including **Speed, Power, Agility, Endurance, Discipline, and Toughness**. These influence acceleration, pace, maneuverability, responsiveness, fatigue tolerance, and resilience. Beasts can suffer individual injuries or damage; team fatigue may be modeled collectively where appropriate.

### Chariot

Core attributes include **Weight, Stability, Durability, Protection, Rolling Efficiency, Maneuverability, and Capacity**. Builds should trade speed, handling, protection, and combat capability against one another.

### Driver

Core attributes include **Driving, Beast Handling, Combat, Awareness, and Nerve**. Drivers also have personalities, risk preferences, and tactical tendencies that shape their autonomous decisions.

### Equipment and modifications

Equipment, upgrades, and potentially magical components should create meaningful alternatives. Exact catalogs, equipment slots, crafting systems, and acquisition methods remain open design decisions.

**Balance principle:** No single RU configuration should dominate every track, weather condition, and race format. Attributes included in the game must have a genuine, testable gameplay effect.

## 6. Two race formats

Both formats use the same fundamental racing and movement rules. A race configuration determines which deliberate actions are legal.

### Combat Racing

- Offensive attacks and deliberate ramming are permitted.
- Drivers may select offensive actions when legal and tactically appropriate.
- Component damage, injury, and disablement can alter race outcomes.
- Racing position and finishing remain central; combat is a means, not a replacement objective.

### Pure Racing

- Deliberate attacks and offensive ramming are prohibited.
- Drivers prioritize pace, passing, positioning, handling, and endurance.
- **Incidental contact remains possible** and may cause normal collision consequences.
- Weather, fatigue, track hazards, and racing risks remain active.

The formats should be configured as rule sets within **one race simulation**, not implemented as separate games. Additional race formats are not approved by this document.

## 7. Race simulation and on-track behavior

The race simulation is the mechanical authority for what happens. It must operate independently from drawing, animation, interface input timing, and commentary. The same starting data, seed, and recorded player commands should produce the same results under the supported runtime assumptions.

### Track and movement

- Model tracks with **segments and lanes**, including corners, direction, and lane-dependent travel effects.
- Each RU occupies one discrete `(segment, lane)` tile at a time.
- Speed, acceleration, braking, fractional movement, and lane selection affect progress.
- Movement across multiple tiles must check intervening occupancy and constraints.
- Simultaneous movement conflicts must be resolved consistently, without bias from the order in which RUs happen to be stored.
- A blocked RU does not retain unusable movement progress for a later burst.
- Favorable routine lane changes should not incur arbitrary penalties unless actual conditions justify them.
- The initial reference venue is a **four-lane oval**, with the data model designed to accommodate other tracks.

### Driver AI

Drivers choose among plausible actions using an understandable decision model informed by skill, personality, race context, conditions, perceived opponents, and the player's strategy. Possible decisions include pace adjustment, lane change, overtaking, defending position, and legal combat actions. Drivers are neither perfectly obedient nor random.

### Contact, combat, and damage

Distinguish **movement conflict**, **incidental physical contact**, and **deliberate attack or ram**. Offensive chariot rams are principally lateral engagements, since the draft beasts are ahead of the vehicle. Damage can affect beasts, driver, and chariot differently; serious damage can reduce performance or disable an RU. Pure Racing disables deliberate offensive behavior, not the consequences of accidental collisions.

### Conditions and events

Weather, track surface, fatigue, and occasional outside incidents can influence racing. Examples include debris, animals, or spectators entering the course. Random incidents are **not required every race**. Crowd effects may influence morale or performance but should not directly interfere with an RU.

### Race lifecycle and classification

Use a standing, **aligned, non-staggered starting grid** and one common race clock. Track positions, lap accounting, standings, finishing order, and DNFs must be internally consistent. A rear-row competitor's first crossing of the start/finish line begins lap 1 rather than awarding a completed lap. Finish timing may resolve within a simulation tick. Disabled RUs ordinarily remain on track for a configurable removal delay rather than disappearing immediately.

### Reproducibility and analysis

Use an explicit seeded random-number generator and record relevant race inputs and commands. Support repeatable scenarios, race replays or deterministic reconstruction, event logs, and batch simulation for balance work. Never use graphics frame rate or wall-clock timing to decide authoritative race outcomes.

## 8. Strategy Signs: queued tactical influence

Strategy Signs are the player's principal direct intervention during a race. They represent instructions shown to the driver as the chariot passes the start/finish line. They **influence** driver AI; they do not directly control the RU or guarantee obedience.

### Approved behavior

1. The base allowance is **three sign raises/replacements per race**; this may be adjusted by explicitly supported upgrades, events, or developer tuning.
2. The player may select a sign at any time. It enters a **Pending** state.
3. A pending sign becomes **Active when the player's RU next crosses the start/finish line**.
4. A sign queued before the race activates **at the starting signal**.
5. An active sign persists until lowered or replaced by a subsequently activated queued sign.
6. Queuing a replacement **does not immediately cancel** the currently active sign.
7. Lowering the active sign is **free and immediate**.
8. Raising or replacing a sign consumes one allowance; lowering does not.
9. Sign influence should be **noticeable**, while remaining subject to driver autonomy.
10. Developer controls must permit adjustment of **global sign influence** and **per-sign influence**, with diagnostic feedback showing what the driver considered and did.

The race interface must clearly distinguish **Pending** and **Active** signs. The exact sign catalog and numerical effects remain configurable design/balance matters.

## 9. Roguelite run structure

A **run** is a sequence of races, with inter-race choices and events that shape the player's opportunities and risks. A run begins with a setup chosen from the permanent stable.

**Temporary run progression** includes upgrades, event effects, and situational resources that expire when the run ends.

**Permanent progression** includes stable assets, roster development, unlocks, and any lasting rewards or consequences designated by the eventual progression rules.

Between races, the player may face choices involving repair, recovery, equipment, upgrades, scarce resources, and risk. Decisions should involve tradeoffs rather than automatic optimal purchases.

**Still open:** races per run, branching structure, economy, shops, injury recovery, permanent asset loss, progression currencies, run failure conditions, and long-term objectives. These should not be treated as finalized.

## 10. Home stable and long-term management

The home stable is the persistent management hub. Its eventual responsibilities include:

- Maintaining multiple drivers, beasts, and chariots while entering one RU per race.
- Assembling and comparing different RU configurations.
- Managing condition, repairs, recovery, and readiness.
- Equipping assets and selecting upgrades.
- Tracking results, performance, development, and possible rivalries.
- Choosing which assets to commit to a new run.

Multiple stable locations or base options are a possible future feature, but their benefits and mechanics are not settled. Management systems must influence races in tangible ways rather than exist as disconnected menus.

## 11. Player experience and presentation

The race is **watched and managed**, not driven. It should be exciting to follow and easy to interpret.

### Canvas race viewer

Render the race using **HTML5 Canvas** in a two-dimensional top-down view. Show positions, lanes, movement, passes, collisions, major condition changes, and other important events. Animation may interpolate between authoritative simulation states for smoothness but must never determine game rules. Use a clear, readable presentation before pursuing visual complexity.

### Race commentary

A prominent scrolling **radio-style, horse-race-inspired commentary** feed translates authoritative race events into drama. Prioritize starts, passes, attacks, crashes, critical damage, strategy activations, and finishes. Commentary must not invent events absent from the simulation.

### Player controls and feedback

Provide readable standings, RU status, race format, lap progress, Strategy Sign Pending/Active state, and results. Include pause and adjustable playback speed; step-by-step advancement is particularly useful in developer mode. The player should understand what instruction was given, what the driver actually did, and why outcomes occurred.

### Interface technology

Use **HTML5 and CSS3** for menus, stable management, HUD panels, controls, logs, and developer tools. Use **Canvas** for race graphics. Do not require a framework or third-party rendering/game engine.

## 12. Mandatory technical and distribution requirements

These requirements supersede any older implementation assumptions or references to previous codebases.

### Runtime technology

- **Vanilla JavaScript (ES6+)** for all distributed game logic.
- **HTML5** for document structure and interactive controls.
- **CSS3** for layout and styling.
- **HTML5 Canvas 2D** for race graphics.
- **No framework or external game engine** unless the project owner explicitly approves one.
- No TypeScript or other transpiled language is required or presumed for the new implementation.

### Standalone release artifact

The deliverable is **one self-contained `.html` file** containing everything necessary to play: HTML, CSS, JavaScript, and required graphics and other assets. The file must:

1. Launch by **double-clicking it** in a modern desktop browser (`file://` execution).
2. Run **without Node.js**, a local development server, or an internet connection.
3. Make **no required network requests**, including for scripts, stylesheets, fonts, images, data, or audio.
4. Use **inline or embedded assets** (for example, inline SVG, Canvas-generated graphics, or data URLs) and not depend on neighboring files.
5. Support game startup, gameplay, and saves without relying on APIs that commonly require an HTTP origin, such as service workers or network-fetched ES modules.
6. Avoid runtime `fetch()` for local configuration or assets. Package necessary game data into the HTML artifact.
7. Be tested by opening the **actual built HTML file via `file://`**, not merely through a development server.

**Development and build:** Keep development source modular and maintainable. Node.js may be used for scripts, tests, asset preparation, and bundling, but it is **not a runtime dependency**. The build must embed or bundle modules into a single executable inline script compatible with direct file opening. Do not assume an unbundled `<script type="module">` with imported local files will work under `file://` restrictions.

**Storage:** Use browser **`localStorage`** for appropriate persistent saves and settings. Use versioned save data, validation, error handling, and export/import options. Browser behavior and persistence for `file://` documents can vary; the game must handle unavailable or blocked storage gracefully, and exported save files should provide a portable backup path. Do not assume saves are shared between browsers, machines, or renamed/moved HTML files.

### Architectural separation

Even though the release is one HTML file, keep development code organized into independent responsibilities:

```text
STABLE / RUN MANAGEMENT
  roster • equipment • economy • events • progression • saves
                |
                v
RACE SETUP AND VALIDATION
  track • RU components • format • conditions • seed • strategy
                |
                v
DETERMINISTIC RACE SIMULATION
  AI • movement • occupancy • contact • combat • fatigue • events
                |
                v
AUTHORITATIVE STATE AND EVENT RECORDS
           /                 \
          v                   v
CANVAS VIEWER + HTML UI    TESTING / REPLAY / BALANCE TOOLS
COMMENTARY + RESULTS
```

The simulation must not depend on Canvas drawing calls, DOM layout, animation frames, or browser storage. UI and commentary read simulation outputs; they do not secretly recalculate or override race outcomes. The build may combine these modules into one file without combining their responsibilities.

### Performance and portability

Target modern desktop browsers, with no mandatory mobile support initially. Keep race simulation efficient enough for ordinary play and repeated headless-style batch execution in the browser or development test harness. Avoid unnecessarily large embedded media. Gracefully handle missing optional browser capabilities. Test the distributable in more than one browser when practical.

## 13. Developer tools and balance workflow

The game depends on interacting simulation systems, so **developer tuning and diagnostics are foundational**. Provide an accessible developer mode in the standalone game; do not require source-code edits for routine balance adjustments.

Required development capabilities include:

- Edit individual RU and component attributes and inspect derived values.
- **Apply a selected attribute value to every RU at once**, with clear validation and scope; retain individual edits.
- Select **Combat Racing** or **Pure Racing**.
- Adjust AI tendencies, physics, contact/combat parameters, fatigue, and conditions where supported.
- Adjust **global and per-sign Strategy Sign strength** and inspect Pending/Active transitions and AI responses.
- Pause, step ticks, vary playback speed, and inspect intentions, outcomes, and structured events.
- Save, import, and export test configurations or scenarios using browser-compatible mechanisms.
- Repeat seeded races and compare runs/batches on finishes, overtakes, collisions, attacks, damage, DNFs, sign compliance, and race duration.
- Surface errors, warnings, and useful diagnostic detail without corrupting race state.

**Balancing principle:** Correctness comes first, followed by meaningful build diversity, readable driver behavior, viable approaches in both race formats, sensible pacing, and interesting risk/reward decisions. Batch statistics reveal patterns; manual playtests determine whether the experience is engaging.

## 14. Redevelopment sequence

The previous prototype and audit are **design and testing references**, not implementation dependencies. Do not port legacy framework code, package structure, rendering assumptions, or build requirements into the new project by default.

### Stage A — Standalone foundation

Create the modular vanilla-JavaScript development structure, HTML/CSS shell, Canvas viewer shell, deterministic RNG, basic data validation, and **single-file build**. Prove immediately that the built HTML launches through `file://` without a server or network.

### Stage B — Race simulation

Implement RU derivation, track/lane movement, simultaneous occupancy handling, driver AI, standing starts, laps, standings, and results. Test with a repeatable reference race and deterministic seeds.

### Stage C — Race rules and tactics

Implement Combat Racing and Pure Racing, incidental contact, component damage, weather/events, and queued line-activated Strategy Signs. Add developer tuning and regression tests alongside each mechanic.

### Stage D — Playable race presentation

Implement the Canvas race viewer, HTML/CSS race HUD, commentary, signs controls, pause/speed, results, and accessible developer inspectors. Confirm the **bundled offline HTML** behaves the same as the development build.

### Stage E — Balance and validation

Run controlled batches and manual tests. Fix movement/contact defects, inactive attributes, weak strategy influence, missing metrics, and confusing UI behavior before expanding the management game. Audit for old assumptions that could break standalone execution.

### Stage F — First complete run

Add the smallest functional home stable, pre-race setup, short race series, inter-race choices, rewards, temporary improvements, permanent outcomes, and versioned `localStorage` saves with export/import.

### Stage G — Content and polish

Expand beasts, drivers, chariots, equipment, tracks, events, progression, and setting. Improve usability, visuals, audio (if included), performance, onboarding, and cross-browser reliability. Rebuild and test the single HTML artifact at each milestone.

Stages are directional, not promises of completed functionality. Every stage should yield a testable artifact and should preserve the ability to distribute one working HTML file.

## 15. Open design decisions

| Area | Still to be decided |
|---|---|
| Run structure | Series length, event cadence, branching, failure/success conditions |
| Stable economy | Currencies, hiring, repairs, upkeep, purchasing, resource scarcity |
| Persistence | Which injuries, losses, upgrades, and rewards persist between runs |
| Progression | Advancement, unlocks, asset development, long-term goals |
| Content | Beasts, chariot classes, equipment, magic, tracks, rivals, factions |
| Competition | Leagues, seasons, entry requirements, prizes, special events |
| Strategy Signs | Final sign catalog and tuned effect coefficients |
| Optional mechanics | Pit stops or additional tactical interventions are not approved |
| Presentation | Final visual identity, sound, accessibility, and UI details |

If a decision is unresolved, a coding agent should either ask for direction or document a reversible, configurable provisional choice needed for the next playable increment.

## 16. Anti-goals and scope boundaries

Blood and Thunder must not become a reflex-based steering game, a direct-action combat game, or a management spreadsheet disconnected from visible races. It does not need realistic continuous physics or elaborate artwork to be convincing. It should not generate unexplained random outcomes, duplicate simulation rules in presentation code, or make tactical instructions into guaranteed remote control.

For the new codebase specifically, **do not introduce a framework, external game engine, runtime package manager, web server requirement, CDN dependency, or multi-file distribution** without explicit approval. Do not sacrifice source modularity merely because the release is a single file. Do not assume browser storage is infallible.

## 17. Definition of the intended complete game

A complete Blood and Thunder game lets the player build a persistent stable, assemble a distinctive RU, enter varied fantasy chariot races, watch autonomous drivers make consequential decisions, issue limited queued Strategy Signs, manage losses and resources between races, and carry selected rewards and consequences into future runs.

Races should differ because of team composition, driver behavior, race rules, track layout, conditions, and player choices. Players should be able to understand **what happened, why it happened, and what they might do differently**.

The complete game is delivered as **one self-contained HTML file** that can be opened offline in a modern desktop browser.

## 18. Document authority and development-agent guidance

This document answers **what game to build and what delivery constraints to respect**. It replaces the older game-vision document's technology and distribution assumptions. It does **not** require reusing any prior source code, folder structure, or engine architecture.

For future development:

1. Follow the owner's latest explicit decisions first.
2. Use this document for overall game identity, system boundaries, and mandatory standalone HTML requirements.
3. Consult earlier design specifications only for **gameplay rules** that have not been superseded. Treat legacy implementation instructions, framework references, dependencies, and build guidance as obsolete.
4. Preserve approved game rules such as the two race formats and queued Strategy Sign activation.
5. Treat numerical balance values and unresolved game systems as provisional unless approved.
6. Document new design decisions and verify the **actual built single-file HTML** after changes.

**One-sentence project statement:** *Blood and Thunder is an offline, standalone-HTML fantasy chariot-racing stable-management roguelite in which players build and prepare teams, influence autonomous races with queued tactical signs, and navigate dangerous competitions with temporary and lasting consequences.*
