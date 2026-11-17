# M2-C Windows owner acceptance checklist

M2-B was owner-accepted on Windows. That acceptance does not cover this new M2-C HTML. Managed Chromium blocks direct `file://` navigation; HTTP functional tests with the browser offline after loading do not prove file-origin storage or durable downloads.

1. Keep your accepted M2-B HTML and export a valid career backup. Download the new `dist/Blood_and_Thunder.html`, then double-click it in a modern Windows browser. No Node installation, server, network or adjacent files should be required. Record browser/version, artifact SHA-256 and actual `file://` origin.
2. Verify offline racing controls, track selection, pause/step, commentary, replay and developer configuration tools still work. Management actions do not enter a stable RU into a race.
3. Open **Developer → Career State / Save Management**. A loaded M1 or M2-B save must not migrate automatically. An M1 save can use its existing explicit schema-2 migration. New careers use **M2-B starting stable → Create empty schema-2 career**, then explicitly initialize one approved package.
4. Open **M2-C stable economy**. Preview migration; verify no stored state changes. Export the read-only preview if useful. Cancel confirmation once, then confirm. The migration should preserve Gold/IDs/native assets/assignments and gameplay revision, advance maintenance once, add contracts/basis metadata and create exactly 23 offers.

| Package | Starting Gold | Drivers | Beasts | Chariots | Equipment | Grandfathered wages |
|---|---:|---:|---:|---:|---:|---|
| Traditional | 1200 | 1 | 2 | 1 | 2 | 35 |
| Beastmaster | 850 | 1 | 3 | 1 | 2 | 35 |
| Mechanist | 800 | 1 | 2 | 1 | 2 | 35 |
| Veteran | 650 | 2 | 2 | 1 | 2 | 60, 35 |
| Scrappy | 750 | 2 | 3 | 1 | 2 | 35, 20 |

5. Verify market totals **9 Budget / 10 Standard / 4 Premium**; equipment has 3 Budget and 3 Standard, no Premium. Refresh at the same HTML path: offers, prices, contracts and availability must persist; no new migration or market refresh occurs.
6. Inspect the roster, native condition/fatigue/strain versus integrity/wear, XP, immutable basis, assignments and future contract wages. Descriptive starting facilities, including Workshop Shed, confer no upgrade benefit.
7. Select a management action and inspect its read-only quote. Cancel an irreversible-action confirmation once. For personnel, verify recruitment price plus signing surcharge and capacity; a specialist requires Staff Quarters first.
8. Attempt to sell installed starting equipment: it must reject until an explicit detach. Detach then sell: 40 G for a starting item. A chariot must be unassigned and have all equipment detached before resale. Personnel cannot be resold.
9. Verify M2-B RU disassembly/reassembly still works after migration. Gold, XP and time must not change. No automatic disassembly occurs due to an ineligible condition.
10. Purchase an affordable upgrade and verify the cost and exact benefit; repeat purchase must reject. Gold is finite in ordinary M2-C play. To test all upgrades/operations on a disposable career, use the existing explicit developer treasury tool and confirm the resulting permanent developer-edited status. Do not mistake developer-funded tests for ordinary progression.
11. Test repair on a purchased chariot with integrity below 100: only management integrity/status should change. Native condition/wear remain distinct. Most starting assets have no fatigue/injury/wear; zero-effect services should reject without charging. Do not modify a JSON save to manufacture injuries or XP.
12. Verify engineering quotes incremental Gold costs and caps at ten lifetime increments. Training requires existing XP; no XP awards occur in M2-C, so ordinary starter careers should report insufficient XP. Funded/injured synthetic reducer tests are development evidence, not hidden gameplay grants.
13. Export the complete game save and actually save it. Reload; then stage an import, cancel once and confirm. Career JSON must remain separate from developer configuration JSON. Import replaces the whole Owner Profile, never merges Legacy.
14. On a disposable backed-up career, restore an older pre-migration file into the same session: migration protection must remain, and there must be no second market/grant. Restore a valid post-migration backup to continue. Older schema-3 files must not make known purchased offers available again or recreate absent assets.
15. If browser storage is denied, verify explicit MANUAL mode and export/saved-checkpoint acknowledgment between changes. A download click is not proof of disk durability. If denial/quota cannot be safely reproduced, record that case as untested; do not claim it passed.
16. Repeat migration checks for all five packages using separate disposable careers. Preserve failure diagnostics and your only valid backups.

Report PASS/FAIL per case with protocol, browser version, artifact hash, package, save mode, visible notice and reproduction. No management cycles, wage payments, XP accrual, contract expiry, market restock, championship or Legacy progression should appear.

Owner acceptance and any merge/push remain separate decisions; M2-D/E and M3 require separate authorization.
