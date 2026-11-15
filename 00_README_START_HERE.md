# Blood and Thunder — Codex Handoff Package

**Release:** Implementation handoff v1.0 | **Date:** 2026-11-14 | **Status:** Approved gameplay/integration baseline; no code generated.

## Objective
Build the **mechanically complete racing prototype** of *Blood and Thunder*, a fantasy chariot-racing stable-management roguelite. The player manages an RU (Racing Unit) and influences autonomous racing with limited, queued Strategy Signs. This handoff concerns the racing prototype, not the complete stable economy and roguelite campaign.

## Read these files in order

1. `01_CODEX_MASTER_IMPLEMENTATION_BRIEF.md` — authoritative task, scope, constraints, and completion contract.
2. `02_APPROVED_GAMEPLAY_AND_RACE_RULES.md` — approved mechanics and race lifecycle.
3. `03_SIMULATION_ARCHITECTURE_AND_NUMERICAL_MODEL.md` — subsystem boundaries, numerical model, deterministic update semantics.
4. `04_FOUR_MILESTONE_IMPLEMENTATION_PLAN.md` — work order, gates, deliverables, and reporting.
5. `05_AUTOMATED_TESTS_AND_ACCEPTANCE_MATRIX.md` — minimum mandatory regression and integration suite.
6. `06_UI_DEVELOPER_TOOLS_AND_REPLAY.md` — viewer, commentary, tuning, telemetry, storage, replay.
7. `07_RELEASE_CHECKLIST_AND_CODEX_REPORTING.md` — offline packaging, QA, signoff, and response template.
8. `08_REFERENCE_GAME_VISION_STANDALONE_HTML.md` — original high-level standalone game vision (reference; superseded details noted below).
9. `09_REFERENCE_GAMEPLAY_VISION_AND_STRUCTURE.md` — original gameplay vision (reference; not authority over later approvals).

## Precedence
1. User's latest explicit approval or correction.
2. This handoff's approved requirements (files 01–07; specific rules override general summaries).
3. `08_REFERENCE_GAME_VISION_STANDALONE_HTML.md` v2.0 for high-level game vision and technical contract.
4. `09_REFERENCE_GAMEPLAY_VISION_AND_STRUCTURE.md` for compatible high-level design only.
5. Codex's **documented, reversible, configurable engineering defaults** for gaps not specified above.

**Known superseded statements:** Wrecks are **not** cleared after a timer; they remain stationary one-tile obstacles until race end. Grid rows are **not staggered**. Race distance is **not** normalized by grid position: all competitors use a common physical finish line and completed-lap requirement. Finished competitors continue to an exit; eliminated competitors remain as wrecks. Old TypeScript/Phaser or server-based distribution directions are obsolete.

## Approval vs. implementation choices
The architectural approaches and game rules described here are approved. Example constants, thresholds, coefficients, and suggested reference algorithms are **not balance canon**: choose initial validated defaults, centralize them, expose them in developer tools, and document them. Do not silently simplify a required mechanic or invent new game canon.

## Codex operating instructions
- Read all files before changing source.
- Produce a short implementation plan and assumptions ledger first.
- Work through milestones 1–4, test and build a standalone HTML at **each** milestone.
- If existing source is provided, inspect and audit it; do not assume legacy code is required or correct.
- Prefer modular vanilla JS development sources, then bundle into a **single inline-script HTML**.
- Never claim a test or offline verification passed unless actually executed. If browser GUI automation is unavailable, state that limitation explicitly and provide the closest verified alternative.
- No generated source or build artifacts are included in this handoff; this package is specifications only.

## Deliverable
A single `Blood_and_Thunder.html` that opens directly via `file://` in a modern desktop browser, works offline without adjacent files or a server, and contains all mandatory prototype mechanics, interface, developer tools, and replay. Source and tests may be supplied separately as development materials; the **end-user runtime** must remain one HTML file.
