# Racing prototype acceptance record — 0.4.2-corrective

**Status: B01–B04 corrected; ready for owner review, not finally accepted.** This is corrective maintenance of the racing prototype.

## Automated verification

- [x] Baseline suite executed before edits: 114 passed, none failed/skipped.
- [x] Current complete suite: 144 passed, none failed/skipped, including 30 corrective cases.
- [x] Decision-linked intentions, effective actions, physical outcomes and sign-relevant compliance; blocked/control/combat cases and replay covered.
- [x] Segment hazardModifier defaults to 1, validates 0..2, affects relative placement; disabled/zero random incidents and configuration/replay invariants covered.
- [x] Individual historical fatigue captured at finish; live overrides/export/clearance/replay cannot rewrite it.
- [x] Named photo fixture produces a real official tie; tighter configured tolerance separates places without changing timestamps.
- [x] Retained coverage for occupancy, simultaneous claims, chronological events, weather/fatigue, legal combat, persistent wrecks, laps, finish times and physical clearance.
- [x] One embedded HTML rebuilt after the final runtime source changes; static external-resource checks pass.
- [x] Historical audits/evidence and numbered establishment documents preserved unchanged.

## Managed-browser verification

- [x] 23 functional checks, including all corrective UI workflows and exact browser/headless parity.
- [x] Configuration, replay, denied storage, pause/step, batch responsiveness, results and commentary flows preserved.
- [x] Zero reported page errors or additional runtime resource requests in HTTP diagnostic mode.
- [ ] Direct offline file navigation independently verified by managed Chromium. Still denied by administrator policy; the browser command correctly returns a blocked/nonzero result.

## Owner-reported offline operation

- [x] Owner confirms the pre-corrective v0.4.1 standalone HTML launches and operates offline on their local computer.
- [x] Owner evidence is distinguished from managed-browser evidence; no owner browser/version/hash attestation is invented.
- [ ] Owner confirms direct offline operation of the newly rebuilt 0.4.2 artifact/hash.
- [ ] Final owner acceptance of the corrected prototype.

## Deliverable and remaining independent checks

[dist/Blood_and_Thunder.html](dist/Blood_and_Thunder.html), 163,579 bytes; SHA-256 `30cea713001b2e1dfdc0b818605161ba5951d15a44e4b87b2210493451354002`.

The new file still requires direct-file verification in a permitted local browser; a second-browser check is not claimed. Read [the corrective report](docs/audits/CORRECTIVE_PASS_0_4_2.md) for commands, failures encountered and corrected, replay/version compatibility, reference evidence and scope. Passing tests does not establish universal correctness or authorize publication. No remote push, deployment or final acceptance was performed.
