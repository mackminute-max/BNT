# BNT — E5-A.1 Developer Tools Accessibility Audit

Source: `7e78f70cb707a58527ce5d989aa47ff5d79553d2`.

## Access boundary and preservation

Developer Tools is absent from the Home Stable top menu. The fixed bottom Developer Tools button is its sole stable entry. Its dedicated workspace has Overview, Component Editor, Bulk Editor, M2 Career Tools, Race & Simulation, Save & Recovery and Logs & Diagnostics. Return to Stable restores the previous player page, uncommitted selection and even an existing practice iframe. No race is restarted and no career operation is performed by navigation.

The original DOM controls are moved, not cloned or reimplemented. IDs, handlers, values and original careerSaves guard ancestry remain intact. The old hidden wrapper is not used as a scrolling player menu. The single shared Component/Bulk editor is moved once: its two navigation tabs expose the same functioning editor; bulk editing remains the original All RUs scope / beasts.* wildcard, not a new career editor.

Every one of161 original legacy button/input/select/textarea IDs from the accepted E5-A artifact is present in the new workspace. The current inventory has162 IDs including Return to Stable. This verifies connection/reachability, not an invented claim that every dangerous operation was executed.

## Functional evidence

- Component Editor: changed the sandbox RU1 driver's native driving to62 using the original New race handler.
- Bulk Editor: original all-RU beasts.* speed edit set64 on all sandbox beasts.
- Both operations left the stable career bytes/records unchanged. They edit the original race test configuration, not owned career assets.
- M2 Career Tools: actual protected treasury adjustment+1 persisted and marked the disposable career developer-edited. Ordinary player setup/purchases did not mark it edited.
- E4 regression: nine existing migration/checkpoint/reload/restore/fault/worker/publication groups pass in the retained advanced Save & Recovery view.
- Workspace entry/page changes/return preserve exact career and sandbox setup/tick when paused; practice retains the identical iframe and native Worker.

## Tool groups

| Group | Actual retained functionality |
|---|---|
| Overview | Existing developer status/error feedback, current sandbox status/tick and career status projection |
| Component / Bulk | Scope/component/attribute/value/mode/apply controls; individual RU and all-RU/wildcard editing |
| M2 Career Tools | Controlled treasury/provenance, metadata inspection, M2-B initialization/assembly, M2-C market/services/facilities, M2-D contracts/payroll/viability, original legacy championship panel where eligible |
| Race & Simulation | Native race/track/rally setup, weather/format, sandbox controls, configuration/lineup JSON, coefficients, surfaces/diagnostics, batch, replay/config imports/exports |
| Save & Recovery | Original profile/save creation/import/export, migrations, manual acknowledgement, corrupted-save recovery; E4 durable controller/checkpoint/backup/restore controls |
| Logs & Diagnostics | Native event log, inspection/derived/AI diagnostics and related original panels |

Some controls remain conditionally hidden/disabled by their original rules: migrated careers use E4 rather than the legacy controller; missing profiles, active championships, quota/recovery blocks, expired contracts, replay mode and geometry format keep their established restrictions. A disabled conditional tool is not a removed tool. DeveloperStatus is visible across workspace pages so errors do not disappear into another tab.

## Complete original control mapping

| Original control ID | New workspace location | Connected |
|---|---|---|
| `raceKind` | Race & Simulation | Yes |
| `trackPreset` | Race & Simulation | Yes |
| `lapCount` | Race & Simulation | Yes |
| `seed` | Race & Simulation | Yes |
| `weather` | Race & Simulation | Yes |
| `format` | Race & Simulation | Yes |
| `reset` | Race & Simulation | Yes |
| `play` | Race & Simulation | Yes |
| `step` | Race & Simulation | Yes |
| `speed` | Race & Simulation | Yes |
| `rallySeed` | Race & Simulation | Yes |
| `rallyCategory` | Race & Simulation | Yes |
| `rallyTerrain` | Race & Simulation | Yes |
| `rallyTurns` | Race & Simulation | Yes |
| `rallyComplexity` | Race & Simulation | Yes |
| `regenerateRally` | Race & Simulation | Yes |
| `cameraMode` | Race & Simulation | Yes |
| `sign` | Race & Simulation | Yes |
| `queueSign` | Race & Simulation | Yes |
| `cancelSign` | Race & Simulation | Yes |
| `lowerSign` | Race & Simulation | Yes |
| `resultsView` | Race & Simulation | Yes |
| `exportResults` | Race & Simulation | Yes |
| `replayFile` | Race & Simulation | Yes |
| `verifyReplay` | Race & Simulation | Yes |
| `restartReplay` | Race & Simulation | Yes |
| `signStrength` | Race & Simulation | Yes |
| `fatigueRate` | Race & Simulation | Yes |
| `damageScale` | Race & Simulation | Yes |
| `incidentRate` | Race & Simulation | Yes |
| `complete` | Race & Simulation | Yes |
| `export` | Race & Simulation | Yes |
| `fullLog` | Logs & Diagnostics | Yes |
| `commentaryEnabled` | Race & Simulation | Yes |
| `inspect` | Logs & Diagnostics | Yes |
| `componentScope` | Component Editor / Bulk Editor (shared original controls) | Yes |
| `componentObject` | Component Editor / Bulk Editor (shared original controls) | Yes |
| `componentField` | Component Editor / Bulk Editor (shared original controls) | Yes |
| `componentValue` | Component Editor / Bulk Editor (shared original controls) | Yes |
| `componentMode` | Component Editor / Bulk Editor (shared original controls) | Yes |
| `applyComponent` | Component Editor / Bulk Editor (shared original controls) | Yes |
| `parameterGroup` | Race & Simulation | Yes |
| `parameterField` | Race & Simulation | Yes |
| `parameterValue` | Race & Simulation | Yes |
| `parameterMode` | Race & Simulation | Yes |
| `applyParameter` | Race & Simulation | Yes |
| `surfaceSegment` | Race & Simulation | Yes |
| `surfaceField` | Race & Simulation | Yes |
| `surfaceValue` | Race & Simulation | Yes |
| `applySurface` | Race & Simulation | Yes |
| `e4Migrate` | Save & Recovery | Yes |
| `e4Reload` | Save & Recovery | Yes |
| `e4Repair` | Save & Recovery | Yes |
| `e4Restart` | Save & Recovery | Yes |
| `e4Enable` | Save & Recovery | Yes |
| `e4Offers` | Save & Recovery | Yes |
| `e4Offer` | Save & Recovery | Yes |
| `e4Register` | Save & Recovery | Yes |
| `e4-coach-aggression` | Save & Recovery | Yes |
| `e4-coach-conservation` | Save & Recovery | Yes |
| `e4-coach-positioning` | Save & Recovery | Yes |
| `e4-coach-riskTolerance` | Save & Recovery | Yes |
| `e4Coach` | Save & Recovery | Yes |
| `e4Start` | Save & Recovery | Yes |
| `e4Play` | Save & Recovery | Yes |
| `e4Pause` | Save & Recovery | Yes |
| `e4Step` | Save & Recovery | Yes |
| `e4Speed` | Save & Recovery | Yes |
| `e4Cadence` | Save & Recovery | Yes |
| `e4Settings` | Save & Recovery | Yes |
| `e4Sign` | Save & Recovery | Yes |
| `e4Queue` | Save & Recovery | Yes |
| `e4Lower` | Save & Recovery | Yes |
| `e4Publish` | Save & Recovery | Yes |
| `e4Retry` | Save & Recovery | Yes |
| `e4Withdraw` | Save & Recovery | Yes |
| `e4Backup` | Save & Recovery | Yes |
| `e4Legacy` | Save & Recovery | Yes |
| `e4RestoreFile` | Save & Recovery | Yes |
| `e4Restore` | Save & Recovery | Yes |
| `e4ResumeRestore` | Save & Recovery | Yes |
| `careerOwnerName` | Save & Recovery | Yes |
| `careerName` | Save & Recovery | Yes |
| `careerCreate` | Save & Recovery | Yes |
| `careerMigrate` | Save & Recovery | Yes |
| `careerTreasuryDelta` | M2 Career Tools | Yes |
| `careerEditReason` | M2 Career Tools | Yes |
| `careerAdjust` | M2 Career Tools | Yes |
| `careerExport` | Save & Recovery | Yes |
| `careerAcknowledge` | Save & Recovery | Yes |
| `careerImportFile` | Save & Recovery | Yes |
| `careerImportMigrate` | Save & Recovery | Yes |
| `careerImportApply` | Save & Recovery | Yes |
| `careerRecover` | Save & Recovery | Yes |
| `careerRawExport` | Save & Recovery | Yes |
| `stableNewCareer` | M2 Career Tools | Yes |
| `stablePackage` | M2 Career Tools | Yes |
| `stableInitialize` | M2 Career Tools | Yes |
| `stableDriver` | M2 Career Tools | Yes |
| `stableBeastA` | M2 Career Tools | Yes |
| `stableBeastB` | M2 Career Tools | Yes |
| `stableChariot` | M2 Career Tools | Yes |
| `stableAssemble` | M2 Career Tools | Yes |
| `stableDisassemble` | M2 Career Tools | Yes |
| `cyclePreviewMigration` | M2 Career Tools | Yes |
| `cycleConfirmMigration` | M2 Career Tools | Yes |
| `cyclePreviewSettlement` | M2 Career Tools | Yes |
| `cycleConfirmSettlement` | M2 Career Tools | Yes |
| `cyclePayment` | M2 Career Tools | Yes |
| `cyclePay` | M2 Career Tools | Yes |
| `cyclePerson` | M2 Career Tools | Yes |
| `cycleTerm` | M2 Career Tools | Yes |
| `cycleRenew` | M2 Career Tools | Yes |
| `cycleResolveAssignment` | M2 Career Tools | Yes |
| `cycleRelease` | M2 Career Tools | Yes |
| `cycleEmergency` | M2 Career Tools | Yes |
| `cycleFailure` | M2 Career Tools | Yes |
| `economyPreviewMigration` | M2 Career Tools | Yes |
| `economyConfirmMigration` | M2 Career Tools | Yes |
| `economyExportPreview` | M2 Career Tools | Yes |
| `economyAction` | M2 Career Tools | Yes |
| `economyOffer` | M2 Career Tools | Yes |
| `economyTerm` | M2 Career Tools | Yes |
| `economyAsset` | M2 Career Tools | Yes |
| `economyUpgrade` | M2 Career Tools | Yes |
| `economyService` | M2 Career Tools | Yes |
| `economyAmount` | M2 Career Tools | Yes |
| `economyAttribute` | M2 Career Tools | Yes |
| `economyPoints` | M2 Career Tools | Yes |
| `economyCommit` | M2 Career Tools | Yes |
| `champFoundation` | M2 Career Tools | Yes |
| `champEnable` | M2 Career Tools | Yes |
| `champEnableE3` | M2 Career Tools | Yes |
| `champRetry` | M2 Career Tools | Yes |
| `champOfferSelect` | M2 Career Tools | Yes |
| `champRegister` | M2 Career Tools | Yes |
| `champStart` | M2 Career Tools | Yes |
| `champStep` | M2 Career Tools | Yes |
| `champComplete` | M2 Career Tools | Yes |
| `champStage` | M2 Career Tools | Yes |
| `champWithdraw` | M2 Career Tools | Yes |
| `champ-aggression` | M2 Career Tools | Yes |
| `champ-conservation` | M2 Career Tools | Yes |
| `champ-positioning` | M2 Career Tools | Yes |
| `champ-riskTolerance` | M2 Career Tools | Yes |
| `champApplyCoach` | M2 Career Tools | Yes |
| `champSign` | M2 Career Tools | Yes |
| `champQueue` | M2 Career Tools | Yes |
| `champLower` | M2 Career Tools | Yes |
| `setupJSON` | Race & Simulation | Yes |
| `applySetup` | Race & Simulation | Yes |
| `resetSetup` | Race & Simulation | Yes |
| `captureSetup` | Race & Simulation | Yes |
| `saveSetup` | Race & Simulation | Yes |
| `loadSetup` | Race & Simulation | Yes |
| `exportSetup` | Race & Simulation | Yes |
| `setupFile` | Race & Simulation | Yes |
| `batchSeeds` | Race & Simulation | Yes |
| `batchRun` | Race & Simulation | Yes |
| `batchCancel` | Race & Simulation | Yes |
| `batchExport` | Race & Simulation | Yes |

## Unsupported / deferred

No new custom asset editor, roster override, hidden developer bypass, bulk career mutation or simulated diagnostics were invented. No separate production team editor exists. Bulk and component editing retain their original sandbox versus persistent-career boundary. All five approved P3 refinements remain outstanding: player1×/2×/4× exposure; convenient Component/Bulk/M2 access with final P3 acceptance; shortest-practical racing line; Seek Open Track versus Race Defensively distinction; hide player-facing lane marks. This pass improves access but does not claim P3 refinement2 acceptance or implement the other racing changes.
