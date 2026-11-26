# Authority, documentation and evidence index

All paths below are repository-relative. source-snapshot/ preserves the same relative paths for included text/source files; supporting-evidence/ carries the latest complete M6-P1 set. GitHub contains excluded older media/archives at the audited commit.

| Subject | Location |
|---|---|
| Current complete delivery | `docs/m6-p1/README.md`, `docs/m6-p1/reports/` |
| Exact implementation/test hashes | `docs/m6-p1/BNT_M6_P1_Source_Manifest.json`, `evidence/frozen-acceptance-source.json`, `evidence/final-source-verification.json` |
| Full Node test log/exits | `docs/m6-p1/evidence/acceptance-node.log`, `.exit`; frozen baseline and preceding iterations clearly separate |
| Commands/changed files/action map | `docs/m6-p1/BNT_M6_P1_{Command_Ledger,Changed_Files,Player_Action_Reachability,Validation_Matrix}.csv` |
| Emergency detailed schema/authority | `docs/m6-p1/reports/BNT_M6_P1_Emergency_Compatibility_Correction.md`, `src/career/m6/emergency.js`, `tests/m6-p1-emergency.test.js` |
| Nine-species/expiry/UI emergency | `docs/m6-p1/evidence/emergency-{native,employment,browser,idb}.json` |
| Packaged regression/Den proof | `docs/m6-p1/evidence/{barn-browser,den-browser,recruitment-browser,regional-hire-browser,smoke-browser}.json` |
| Exactly-once/fault/IDB/quota | `docs/m6-p1/evidence/{worker-faults,real-quota,idb-proof,retention-idb}.json` |
| Historical browser raw exits | `docs/m6-p1/evidence/historical-accepted/`; outer wrapper success is not all nested scripts success |
| Determinism/current benchmarks | `docs/m6-p1/evidence/{references,legacy-continuity,controlled-performance}.json`, `championship-clock/parity.json` |
| Original M6 contracts | `docs/m6/Persistence_Design.md`, `docs/m6/reports/BNT_M6_{Persistence_Contract,Implementation_Report,Career_World_Report,Race_Interaction_Report,Practice_and_Gambling_Report}.md` |
| M6 source/catalogs | `docs/m6/reports/BNT_M6_Source_Manifest.json`, `docs/m6/catalogs/`, `content/m6/` |
| M5 D1/D2 policy | `docs/m5-d1/{OWNER_POLICY,IMPLEMENTATION,ACCEPTANCE}.md`; `docs/m5-d2/{OWNER_POLICY,IMPLEMENTATION,COMPATIBILITY,ACCEPTANCE}.md` |
| M5 authored catalogs | `content/m5/`; original v1.0 and supplemental v1.1 preserved with versioned amendments; workspace authoring delivery `/workspace/deliverables/bnt-m5-content-v1` exists but is not a runtime dependency |
| UI consolidation/recruitment/radio | `docs/e5-d/` M3-A, Main M3, M3-BC, M3-UI/M3-UI-P1 reports; `content/presentation/`, `src/presentation/content/` |
| Original payroll/settlement authority | `docs/m2-d/`, `src/career/cycles/`, `src/career/economy/` |
| Earlier championship/D1-D5 foundation | `docs/m2-e/`, `docs/e5-b/`, `src/career/championships/` |
| E4 architecture and performance | `docs/m2-e/e4/{stage1,stage2,performance,architecture-prototypes}/`; `experiments/e4-architecture/` nonproduction |
| Inherited trig discrepancy | `docs/m2-e/e4/performance/BNT_M2-E4_Cross_Runtime_Determinism.md` and `evidence/cross-runtime/` |
| Buffered playback ancestry | `docs/p1-5/`, `src/prototype/buffered/`, `docs/e5-d/m3-bc-p1/` where present |
| M7 preproduction audit | `docs/m7/BNT_M7_PreProduction_Audit.zip` — retained in repository, not an implementation authorization |
| Windows manual acceptance | `docs/m6-p1/reports/BNT_M6_P1_Windows_Acceptance_Checklist.md` |

## Packaging exclusions

No node_modules, .git history, personal browser save databases, credentials or transient absolute-path frozen test worktrees are packaged. source-snapshot/ includes all committed files outside ancillary document/media/archive roots; within docs/reports/exports it includes text/JSON/CSV/log/exit/replay/reference files, with omitted large historical media/archives listed in SNAPSHOT_INDEX.json. Complete M6-P1 evidence is separately included, including screenshots and actual fixtures. This is a thread handoff plus runnable artifact/source reference, not a bit-for-bit full Git repository clone. Remote object SHA identifies the complete repository.

The ZIP payload manifest hashes each included file; original content and runtime bytes are copied, not regenerated. Audit-generated reports describe observed current state and are separate from preserved historical evidence. No instructions to implement subsequent milestones are included.
