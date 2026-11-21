# BNT — E5-A.1 Windows Acceptance Checklist

Artifact: `Blood-and-Thunder-E5-A1-Playable-Stable.html`.

Size: **1,727,933 bytes**. SHA-256:

`e60d9e7ae55025d4aedb50b81629038051ae4262e4e73ce7f29b475c7b310cb1`

Source: `7e78f70cb707a58527ce5d989aa47ff5d79553d2`. No merge/push/release or owner acceptance is implied. Test a disposable career/profile and back up any existing owner career first.

## 1. Offline direct-file launch

- Download the single HTML into a stable folder. No ZIP, server, npm, adjacent assets or network is required.
- Optional PowerShell verification: `Get-FileHash '.\Blood-and-Thunder-E5-A1-Playable-Stable.html' -Algorithm SHA256`.
- Open directly in current Windows Chrome/Edge. Confirm `file:///` address and disconnect the network.
- Home Stable should show player navigation; **Developer Tools must not be in that top menu**. Its button should be visible at the bottom-right, even on a longer page.
- Do not move/rename the file or change browser profile during save/reload testing; local-file storage rules can differ by path/browser.

Managed Linux Chromium blocked file navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`). HTTP/offline tests are not Windows acceptance. If storage/Worker/Web Locks are denied, record the exact message rather than clearing storage or treating a manual session as saved.

## 2. Career initialization and stable overview

- Click the contextual **Start your stable** action, or open Save & Recovery.
- Create an empty career with zero Gold/assets. Choose one of the existing five packages and review/confirm the original one-time grant.
- Verify no market catalog is granted for free. Starting package funds, assets and native effects must match the approved package.
- Explicitly enable the existing economy/payroll service steps, reading confirmations. Neither migration should charge a wage cycle or create extra grants.
- Enable durable saves explicitly. Reload and verify the same career, Gold, roster and RU.
- Dashboard should answer who is racing, what needs attention and what next action is available. No raw format/revision/generation counters should dominate it.

## 3. Roster, actual content and legal assembly

- Roster shows real owned driver, two beasts, chariot and equipment, with attributes/condition/availability/contracts. Starter labels remain approved original labels.
- Recruitment cards show provisional identities attached to the **existing23 offers**:5 drivers,6 beasts,3 chariots,3 specialists,6 neutral equipment offers. Expanded target counts and authored opposing teams are not implemented.
- Review an affordable beast purchase, confirm its actual quote and verify the Gold debit. No price/stat/ancestry bonus is inferred from the biography.
- Reload: the purchased individual and its provisional identity should remain recognizable. It should be selectable for your owned RU.
- Select the same beast twice: assembly must disable with a reason. Select two distinct eligible owned beasts and confirm assembly. No extra fee/fatigue/time should be charged.
- Assigned, unavailable, injured and contract-restricted assets retain the existing legality restrictions.

## 4. Staff, workshop and finances

- Staff screen shows real employees and available specialists; missing specialist capacity is explained by the existing quote.
- Workshop lists the seven existing facility improvements. On a funded disposable career, buy an affordable improvement and verify exactly its original cost/capacity change. No descriptive starter facility should gain a new bonus.
- Recruit a specialist only if capacity, Gold and existing rules permit it. Existing supported roles are Beast Handler, Mechanic and Physician; no extra professions are invented.
- From asset cards, review treatment/recovery/training/repair/detach/sale or employment options where available. Unavailable actions should explain why when expanded.
- Healthy assets should not receive a paid treatment with no effect. Repairs require existing prerequisites and use actual native/management semantics; equipment has no invented durability/repair.
- Insufficient funds/XP, missing prerequisites and active-championship restrictions must block transactions without a false success message.
- Cancel a confirmation: no debit or state change. No wages/recovery/time should advance by browsing or previewing.

## 5. Championship and records inspection

- Inspect real available offers, eligibility, fees, schedules, next event and standings where the existing controller is configured.
- Current-event review opens actual event/eligibility details. Existing registration/preparation controls use the original controller; they do not add a new catalog or settlement system.
- On a disposable registered/unsettled championship, inspect player screens. Management remains read-only with a clear explanation; no substitution, repair, hire, training or between-race recovery.
- `SETTLEMENT_PENDING` remains locked. No E5-B rewards, payroll settlement, trophy/XP/RP award or career-to-P2.2 integration is expected in this pass.
- Records must show actual retained data, not fictional victories, trophies, teams or Legacy progress.

## 6. Dedicated Developer Tools

- Use **only the bottom Developer Tools button**. Confirm a distinct workspace with its own navigation and **Return to Stable**.
- Visit Overview, Component Editor, Bulk Editor, M2 Career Tools, Race & Simulation, Save & Recovery, Logs & Diagnostics. No unrelated-tool scrolling should be required to locate an editor.
- Component/Bulk use the original shared editor: individual RU scope, or All RUs / beasts.* wildcard. On the disposable sandbox, apply a driver rating and a bulk beast rating. Verify configuration/native sandbox values change appropriately.
- These component/bulk tools edit the race test configuration, not your owned career assets. They must not accidentally charge treasury or mutate roster ownership.
- M2 Career Tools retain controlled career editing/inspection and existing M2 panels. If testing a treasury developer edit, expect irreversible developer-edited provenance and use only a disposable career.
- Native race parameters, surfaces/rally, lineup JSON, configuration import/export, batch and replay tools remain available. Conditional tools retain original disabled/format/recovery restrictions.
- Advanced Save & Recovery retains profile/game-save import/export, migrations, manual acknowledgement, corrupt-save recovery and the E4 durable controller/checkpoint/complete-backup/restore tools.
- Return to Stable must restore the previous player section and selection. Merely opening/changing developer tabs must not change Gold, career state, paused sandbox tick/setup or persistence authority.

## 7. Save/reload and practice

- Commit a valid purchase/assembly, close the browser and reopen the same file/profile. Completed management choices must remain.
- Ordinary career export and complete championship backup remain available. A download request is not proof that a file was durably saved; verify it yourself.
- Complete backups are needed for separate race-session evidence. Do not substitute career-only JSON for a resumable active championship. Use the original confirmed advanced restore workflow; unrelated/newer authority must not be overwritten.
- In manual mode, exported-checkpoint acknowledgement is required before another change; the interface must never describe in-memory changes as durable.
- Open independent P2.2 practice offline. Its accepted layout, map, Signs, radio, countdown and controls should be unchanged, with no career rewards/effects.
- Enter Developer Tools from the bottom button and return while practice is open. It should return to the same iframe/session rather than restart. Closing practice deliberately discards it.

## 8. Layout and acceptance report

Check1920×1080 and1366×768, keyboard focus, card text, expanded unavailable reasons, quote confirmations and bottom-button visibility. Long finite rosters/market cards may scroll; no horizontal overflow is expected.

All five P3 refinements remain pending: player1×/2×/4×; convenient editor access with final P3 acceptance; shortest practical route; distinct Open Track/Defensive tactics; removal of visible lane marks. Do not mark P3 accepted from this test.

Report Windows/browser versions, artifact hash, file path/profile, outcomes for sections1–8, exact errors/screenshots, any unexpected saved-state change, and whether you accept E5-A.1 with the disclosed content limits. Stop before E5-B or publishing without separate authorization.
