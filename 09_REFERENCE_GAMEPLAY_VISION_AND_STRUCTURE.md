# Blood and Thunder — Game Vision, Gameplay Design & Structure

**Document type:** Game design vision and structural reference  
**Scope:** Player experience, gameplay systems, progression, and design principles only  
**Status:** High-level direction. Open decisions are explicitly identified; numerical values are not final.

## 1. Game concept

**Blood and Thunder** is a fantasy chariot-racing roguelite combining stable management, autonomous racing, and—where competition rules permit—violent chariot combat. The player owns and manages a racing stable rather than directly steering a chariot. They recruit and develop drivers and draft beasts, acquire and equip chariots, assemble racing teams, choose competitions, and manage the rewards and consequences of each race.

On the track, drivers make their own decisions based on ability, temperament, race conditions, opponents, and the instructions they have received. The player can influence those decisions through a limited number of **Strategy Signs**, but cannot take direct control.

The race provides the spectacle; stable management and a sequence of consequential competitions provide the strategy.

## 2. Core design pillars

1. **Management over reflexes.** Preparation, team composition, and resource decisions matter more than rapid inputs.
2. **Autonomous personalities.** Drivers should feel distinct through their skills, tendencies, judgment, and willingness to take risks.
3. **Understandable outcomes.** Pace, positioning, fatigue, damage, and finishing results should have identifiable causes.
4. **Limited but meaningful influence.** Strategy Signs should noticeably affect behavior without guaranteeing obedience.
5. **Meaningful tradeoffs.** Faster, tougher, more agile, and more aggressive teams should each have advantages and liabilities.
6. **Consequential runs.** Success, injury, equipment damage, upgrades, and resource use shape the remainder of a competition series.
7. **Emergent racing drama.** Overtakes, rivalries, tactical mistakes, crashes, and surprising victories should arise from interacting systems.
8. **Race-centered management.** Stable decisions must produce visible differences on the track; races must matter beyond their finishing order.

## 3. Setting and tone

The setting is a distinctive **fantasy world built around chariot racing**, not a strict historical recreation. Teams may use different draft beasts, unusual equipment, and potentially magical enhancements. Drivers, stables, venues, and rivalries should contribute personality and atmosphere.

Racing ranges from sporting competition to dangerous, openly violent contests. The tone can be brutal, energetic, and theatrical, but racing performance and the pursuit of victory remain central.

Named nations, factions, leagues, currencies, prominent characters, and detailed magical traditions have **not** been finalized.

## 4. Player role and decisions

The player is the **owner/manager of a persistent stable** with a roster of drivers, beasts, chariots, and equipment. The player enters **one Racing Unit (RU) per race**, assembled from their available assets.

| Phase | Player activity |
|---|---|
| Home stable | Manage roster, equipment, repairs, recovery, and long-term development |
| Start a run | Select a team and commit resources to a sequence of races |
| Pre-race | Study the course, competition rules, opponents, and conditions; choose setup and opening instructions |
| Race | Observe autonomous competition and queue limited Strategy Signs |
| Results | Review placement, performance, rewards, fatigue, damage, and injuries |
| Between races | Make repair, recovery, upgrade, and event decisions |
| End of run | Resolve temporary improvements, permanent rewards, and lasting consequences |

The player should feel responsible for a team's readiness and tactical identity without being expected to micromanage every maneuver.

## 5. Overall gameplay loop

```text
HOME STABLE
  Recruit • develop • repair • equip • manage resources
        |
        v
CHOOSE A RUN AND ASSEMBLE ONE RACING UNIT
        |
        v
PRE-RACE PREPARATION
  Study rules • track • rivals • conditions • opening sign
        |
        v
AUTONOMOUS CHARIOT RACE
  Racing • positioning • optional combat • Strategy Signs
        |
        v
RESULTS AND CONSEQUENCES
  Placement • rewards • fatigue • injuries • damage
        |
        +------------------------------+
        |                              |
        v                              v
BETWEEN-RACE DECISIONS             RUN CONCLUDES
  Repairs • recovery                 Resolve rewards
  Events • temporary upgrades        Lasting consequences
  Resource tradeoffs                 Return to home stable
        |
        v
NEXT RACE
```

The three central layers are **stable management**, **the roguelite run**, and **the individual race**. All three should reinforce one another.

## 6. Racing Units (RUs)

An RU consists of a **driver, a chariot, a team of draft beasts, equipment, and their current condition**. Components contribute distinct strengths and weaknesses. Damage, fatigue, and upgrades can change an RU's effectiveness during a race or across a run.

### Draft beasts

Key attributes: **Speed, Power, Agility, Endurance, Discipline, Toughness**.

These affect pace, acceleration, maneuvering, responsiveness, fatigue resistance, and resilience. Individual beasts can be injured or damaged, while some fatigue effects may apply to the team collectively.

### Chariot

Key attributes: **Weight, Stability, Durability, Protection, Rolling Efficiency, Maneuverability, Capacity**.

Chariots should involve tradeoffs among speed, handling, protection, load, and combat effectiveness. A heavy armored chariot should not simply outperform a light racing build in every situation.

### Driver

Key attributes: **Driving, Beast Handling, Combat, Awareness, Nerve**.

Drivers also have personalities, risk tolerances, tactical preferences, and behavioral tendencies. A cautious technical driver should approach the same situation differently from an aggressive opportunist.

### Equipment and enhancements

Equipment, upgrades, and potential magical enhancements should create strategic choices and distinctive team builds. The final equipment catalog, slots, acquisition rules, and crafting options remain open.

**Design requirement:** Every attribute presented as meaningful should affect gameplay. No single RU build should dominate all tracks, conditions, and race formats.

## 7. Race formats

### Combat Racing

- Deliberate attacks and offensive ramming are legal.
- Drivers may choose aggressive actions based on opportunity, personality, strategy, and competition context.
- Damage to beasts, drivers, or chariots can alter performance or end a competitor's race.
- Winning the race remains the principal objective; combat is a tactical means to that end.

### Pure Racing

- Deliberate attacks and offensive ramming are prohibited.
- Drivers focus on speed, overtaking, lane choice, positioning, endurance, and defensive racing.
- **Incidental contact remains possible**, including resulting damage or loss of control.
- Weather, fatigue, track hazards, and other ordinary racing risks still apply.

Both formats share the same underlying principles of racing and physical contact. The difference is what deliberate actions are permitted. Additional competition formats remain possible but are not yet defined.

## 8. On-track racing

### Tracks, lanes, and movement

Races take place on courses divided into track segments and lanes. Corners, lane choice, course geometry, surface conditions, and the distance traveled through each lane affect performance. The initial reference course is a **four-lane oval**, with other venue layouts intended for later expansion.

RUs accelerate, brake, choose lines, overtake, defend position, and respond to obstructions. Space matters: two competitors cannot simply pass through the same occupied location. Movement conflicts, incidental contact, and deliberate attacks are distinct occurrences. A blocked competitor should not gain an artificial burst of stored movement afterward. Routine favorable lane changes should not be arbitrarily penalized.

### Driver decision-making

Drivers evaluate their situation and select plausible actions based on skill, personality, the race, nearby opponents, hazards, fatigue, and instructions. They may choose to conserve energy, press the pace, seek a passing opportunity, defend a line, or—when legal—attack. Drivers should be capable of mistakes without behaving incoherently or randomly.

### Contact, combat, and damage

Contact can arise accidentally from contested space or deliberately from legal combat maneuvers. Chariot ramming is principally a **lateral engagement**, because the draft beasts are positioned ahead of the vehicle. Damage may affect beasts, driver, or chariot separately. Injuries and component failures can reduce performance, create danger, or disable an RU.

### Conditions and unexpected incidents

Weather, track condition, fatigue, and occasional external events alter racing circumstances. Examples include debris, an animal on the course, or a spectator entering the track. Such events are possible, **not mandatory in every race**. The crowd may affect morale and performance but should not directly interfere with competitors.

### Race start, laps, and results

Races use a **standing, aligned, non-staggered starting grid** and one common start clock. The first start/finish crossing of an RU that began behind the line starts its first lap; it does not count as completing a lap. Finishing order and timing should reflect actual progress, including close finishes. Disabled competitors ordinarily remain on the course for a delay before removal, making wrecks part of the ongoing race environment.

Results should explain not only placement but also relevant performance, contact, damage, fatigue, and the causes of major outcomes.

## 9. Strategy Signs — limited tactical intervention

Strategy Signs are the player's primary way to influence a driver during a race. The player **queues an instruction**, and the driver receives it at the start/finish line. Signs alter priorities and behavior; they do **not** grant direct control or guaranteed obedience.

**Approved rules:**

1. The base allowance is **three sign raises or replacements per race**, subject to explicitly supported upgrades or event modifiers.
2. A sign can be queued at any time and becomes **Pending**.
3. It becomes **Active when the player's RU next crosses the start/finish line**.
4. A sign queued before the race activates **at the starting signal**.
5. An active sign persists until lowered or replaced by a subsequently activated sign.
6. Queuing a replacement does **not** immediately cancel the active sign.
7. Lowering an active sign is **free and immediate**.
8. Raising or replacing a sign consumes one of the available uses; lowering does not.
9. The effect should be **substantial and noticeable**, while driver skill, judgment, personality, and circumstances continue to matter.
10. Players should be able to distinguish pending instructions from active ones and understand whether the driver followed them.

The final sign catalog and exact strength of each effect are still to be determined and balanced.

## 10. The roguelite run

A **run** is a sequence of races connected by decisions, consequences, and opportunities. The player starts with assets selected from their persistent stable, then attempts to navigate the series as circumstances evolve.

**Temporary progression** includes upgrades, bonuses, and situational advantages gained during the run that expire when it concludes.

**Permanent progression** includes designated stable assets, roster growth, unlocks, and lasting rewards or consequences that carry forward into future runs.

Between races, the player may need to balance repairs against upgrades, recovery against continued risk, and short-term gains against long-term stability. Inter-race events should introduce choices rather than only random rewards or punishments.

The exact number of races, series structure, branching paths, economy, failure conditions, and persistence of injuries or asset loss are **open design questions**.

## 11. Home stable and long-term management

The stable provides continuity between runs. Its intended functions include:

- Recruiting, retaining, and developing drivers and draft beasts.
- Acquiring and maintaining multiple chariots and equipment sets.
- Assembling one RU for each race from the available roster.
- Managing repairs, recovery, injuries, fatigue, and readiness.
- Comparing builds and choosing which assets to risk in a run.
- Tracking records, performance, rivalries, and long-term progress.
- Unlocking or improving stable capabilities through sustained success.

Multiple stable locations or home-base options may eventually be available, but their exact benefits have not been defined.

## 12. Player experience and race presentation

The race should feel like a sporting event the player has a stake in, not a passive spreadsheet. It should be clear who is leading, who is gaining, which teams are struggling, and what caused important changes.

A **top-down race view** emphasizes track position, movement, overtakes, collisions, and condition changes. A prominent **radio-style, horse-race-inspired commentary feed** dramatizes starts, passing attempts, attacks, wrecks, tactical shifts, and finishes. Commentary should reflect actual events, not invent them.

Players should be able to follow standings, laps, their RU's condition, the race format, and the status of Strategy Signs. Race pacing should support both watching the action and examining important moments. Results should provide enough context for the player to make better decisions before the next race.

Visual sophistication is secondary to clarity, personality, and meaningful feedback.

## 13. Strategic depth and balance principles

A satisfying game should reward informed decisions without eliminating uncertainty.

- **Build diversity:** Different combinations of beasts, drivers, chariots, and equipment should be viable for different purposes.
- **Format diversity:** Combat Racing and Pure Racing should reward meaningfully different strengths and strategies.
- **Driver identity:** Skills and personalities should create recognizable behavior and influence outcomes.
- **Tactical relevance:** Strategy Signs should create noticeable opportunities and tradeoffs without functioning as absolute commands.
- **Consequences:** Fatigue, injury, equipment damage, and resource scarcity should make each race matter beyond the finish.
- **Readable drama:** The player should usually understand why an overtake, crash, victory, or defeat occurred.
- **Variety without chaos:** Unexpected incidents should add tension without overwhelming preparation or skill.

Exact numerical balance is not established by this document.

## 14. Intended progression of the game experience

The player begins with a modest stable and limited options. Early play emphasizes learning how team composition and driver behavior affect race outcomes. As the stable develops, the player gains access to different assets, more demanding competitions, and meaningful choices about risk and specialization.

Individual races become part of a larger story: a skilled driver recovers from an injury, a favored beast becomes exhausted, a chariot survives a dangerous collision, or a risky upgrade pays off in the final race of a run. Progress should arise from both deliberate management and the consequences of competition.

The intended complete experience is a repeating cycle of **build → prepare → race → assess → adapt → progress**.

## 15. Open design decisions

| Area | Unresolved questions |
|---|---|
| Run structure | Number of races, branching paths, event frequency, victory and failure conditions |
| Economy | Currencies, prizes, entry costs, repairs, upkeep, hiring, and purchasing |
| Long-term consequences | Which injuries, losses, assets, and improvements persist across runs |
| Advancement | Driver/beast development, stable upgrades, unlocks, and long-term objectives |
| Content | Beast types, chariot classes, equipment, magical enhancements, venues, rivals |
| Competition | Leagues, seasons, special events, entry requirements, and prize structures |
| Strategy Signs | Final set of instructions, their tradeoffs, and their tuned effects |
| Stable identity | Locations, home-base options, factions, and setting-specific traditions |
| Presentation | Final visual identity, audio direction, and accessibility choices |

These are opportunities for future design, **not finalized rules**.

## 16. Boundaries of the concept

Blood and Thunder is **not** a reflex-based steering game, a direct-control combat game, or a management game whose races are disconnected from the player's choices. It does not need strict historical realism or elaborate visuals to succeed. Combat should not replace the central importance of racing, and tactical instructions should not erase driver autonomy.

The game's distinctive identity depends on the relationship between **the stable the player builds, the autonomous racer they send onto the track, and the consequences they must manage afterward**.

## 17. Definition of the intended complete game

A complete Blood and Thunder experience allows the player to build and develop a persistent fantasy racing stable, assemble distinctive chariot teams, enter varied competitions, watch drivers race autonomously, influence them with queued Strategy Signs, manage race-by-race injuries and resources, and carry selected rewards and consequences through repeated roguelite runs.

Races should differ because of team composition, driver personality, course design, weather, competition rules, and player decisions. The player should be able to answer three questions after each race: **What happened? Why did it happen? What should I change next time?**

**One-sentence vision:** *Blood and Thunder is a fantasy chariot-racing stable-management roguelite in which players build teams, influence autonomous competitions through limited tactical instructions, and navigate a series of dangerous races with temporary advantages and lasting consequences.*
