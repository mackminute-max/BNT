# M2-D — Payroll, Contracts and Confirmed Career Failure

**Implemented for owner review. Not owner-accepted, merged, pushed or deployed.** M2-E/M3 and the championship controller are not implemented.

Date: 2026-11-17 (America/Los_Angeles). Authority: [Implementation Authorization Revision 1](authority/00_START_HERE.md); all six supplied Markdown files passed the supplied SHA-256 checks.

## Source and delivery identity

- Dedicated branch: `feat/m2-d-payroll-lifecycle`.
- Implementation commit: **`c8371a8e26115c04f86ff91e7f45f2cda4bafb13`**. This report/evidence follow in a documentation-only commit; the final delivery response identifies that commit.
- Starting accepted M2-C: `f66ec90a6659dd6bb675815bff4cc33e9850a643`, tree `4173d9427b2c79d03ddd5ebd00bc0cb4b8c445f9`, file-identical to accepted implementation `79447d84a73f4d95eb65974cc79c59d191b111e7`.
- Initial working tree: tracked source clean; only the previous `docs/m2-d/` read-only preflight/evidence was untracked. Those reports/evidence were preserved unchanged and are included with this delivery.
- Original HTML: 380462 bytes, SHA-256 `13b2b1e3898c5df30f5b97b9b37c2bb033fc01c5ae9f43fd64bd89a3fc3e938f`.
- New standalone aliases: **436032 bytes each**, SHA-256 **`d1a586a64066b40e40fb540e090c61d48b975d89cecca92e1377aa5b4af3a1a7`**.

## Delivered behavior

1. Explicit, pure preview and confirmed one-time schema-3→4 migration. It retains Gold, native assets, assignments and all original receipts, advances maintenance once and creates no payroll, cycle, recovery, reward or market refresh.
2. Strict future championship-completion interface with private runtime capability, owner/result/rule/roster fingerprints, and **test-only** synthetic producer. Arbitrary completion JSON cannot execute a new settlement. No production reward input, fixture producer, championship button or invented purse schedule is shipped.
3. Pure settlement quote and once-per-championship atomic confirmation: authorized income, old-first wage allocation, all active driver/reserve/specialist wages, persistent per-creditor claims, debt streak/status, recovery, final-wage-before-expiry, deterministic Default departure/defer decision and immutable statement.
4. Separate voluntary wage payments, immediate debt-clear reset, graduated authoritative spending restrictions, and preserved M2-C essential service/sale/termination costs.
5. Explicit expired-contract renewal on Short/Standard/Long terms with signing charge, new contract identity and retained historic contract; explicit expired release with assignment-resolution confirmation. No automatic renewal or silent deletion of an assigned driver.
6. Driver-only explicit emergency assistance: fixed five ratings 40/six tendencies 50, 100 condition, Healthy, zero strain/fatigue/XP, zero signing Gold, one cycle and 20 G next-return wage. Existing capacity/entry rules apply; one active max; no ordinary renewal or market RNG draw. No other resources are granted.
7. Conservative Operational/Blocked/FailurePending assessment and explicitly confirmed, protected Failed state with retained assets, wage claims and history. Failed careers reject gameplay edits and permit inspection/export.
8. Versioned per-entrant payroll control snapshot, applied after native derivation and clamped to the verified 0–100 effective-control range at initial/dynamic/paused-override paths. Missing context preserves historical bytes/numbers. Native driver ratings, condition, strain, personality and other entrants are unchanged.
9. Minimal integrated M2-D panel, existing M2-C market/actions and developer save workbench retained; truthful completion-unavailable message, pure quotes/blocked reasons, payroll statement/creditor archive, renewal/release/emergency/failure controls and explicit migration.
10. Fail-closed import/recovery for missing known post-migration financial/lifecycle effects. Newer complete checkpoints remain importable; unsafe older checkpoints cannot erase debt, restore consumed grants or bypass Failed state. No hypothetical recovery transaction or income replay.

## Architecture and interfaces

See [SCHEMA_AND_TRANSACTION_API.md](SCHEMA_AND_TRANSACTION_API.md) for concrete versions, record shapes, command examples, future-controller seam and restoration rules.

| Files | Purpose |
|---|---|
| `src/career/cycles/contracts.js` | Exact command-v3, protected maintenance/gameplay variants, integer Gold arithmetic, stable business identities, fail-closed restore guard |
| `cycles/completion.js` | Strict terminal completion shape, active-contract snapshot and future authority verifier/capability seam |
| `cycles/schema4.js` | Pure 3→4 base/preview, origin-anchored receipt reconstruction, lifecycle graph validation, v1/v2/v3 dispatch, authoritative economic restriction wrapper |
| `cycles/reducers.js` | Pure cycle quotes; staged settlement, payments, renewal/release, emergency and confirmed failure effects |
| `cycles/policy.js` | Debt/restriction rules, legal driver/RU checks and conservative sound failure assessment |
| `cycles/racing-adapter.js`, `src/model/payroll-control.js` | Immutable championship entrant context and versioned effective-control adapter |
| `career/state.js`, `economy/protected-registry.js`, `persistence/{envelope,career-store}.js` | Additive version dispatch, explicit migration API, preserved atomic/manual persistence and safe history overlay |
| `sim/race.js`, `dev/overrides.js` | Only the authorized per-entrant context serialization/control wrapper at all native derivation sites |
| `ui/{stable-cycles,stable-economy,stable-foundation,career-saves}.js`, `ui/index.html` | New panel, schema-4 compatibility and terminal/expiry restrictions in existing tools |
| `tests/m2-d-*.js`, `tests/data/m2-d-payroll-v1.json` | 58 new cases plus fixed independent expected wage/debt/term/emergency numbers |
| `scripts/m2-d/{verify,browser}.mjs` | Repeatable replay/native-adapter/golden evidence and browser acceptance tooling; never runtime dependencies |
| `dist/*.html` | Identical offline standalone aliases rebuilt by existing pipeline |

The following accepted modules remain byte-for-byte unchanged: M1 `legacy-state.js`, M2-A/B `schema2.js` and original `history.js`; M2-C `schema3.js`, `validation.js`, `base.js`, `maintenance-history.js`, `reducers.js`; native `model/ru.js`; AI, config, track and replay modules; dependency manifests and build script. No new framework/dependency/server, source balance change, race-result application, Strategy Sign timing change or track-generation change was introduced.

New versions: career/registry 4; driver/contract record 3; cycle/completion/obligation/statement 1; command 3; independently discriminated 3→4 maintenance record 1. Original envelope/history stay 1 after mixed-version tests. Other records keep their original versions. Original M2-C 2→3 migration manifests/history are not rewritten. Limits remain 1000 receipts, 2000 total protected identities, 8 MiB envelope.

## Approved gate resolutions in code

- **Morale:** existing native control definition is a derived value clamped 0–100 (`model/ru.js`), compatible with the approved adapter. Separate payroll multiplier, not crowd morale; frozen championship snapshot, not a live stable lookup. No native-formula rewrite was required.
- **Completion:** the absence of a controller is intentional. The subsystem consumes a validated future authority record; only development fixtures currently produce one. Standalone race completion does not settle or charge payroll. The completion record's terminal state and immutable statement represent this boundary; full championship-active orchestration remains deferred.
- **Debt restoration:** reject old primary/import/recovery checkpoints missing known effects before publication. Existing M2-C consumed-offer logic is insufficient on its own and was not reused as a substitute for liabilities. User can retain/export current valid state/raw diagnostic or explicitly import a complete newer backup.
- **Default:** first automatic departure opportunity is unpaid settlement five. At most one; assigned candidates deferred, last currently eligible contracted driver protected, claims archived independently of live FK references.
- **Failure:** only proven supply exhaustion of indispensable beasts/chariots qualifies. The finite predicate counts every owned asset, even damaged/ineligible, and every remaining offer, even unaffordable/restricted, as potentially usable. If this optimistic superset has <2 beasts or <1 chariot, no permitted recovery sequence can work because M2-D has no breeding/new supply/refresh/other assistance. Other uncertain states remain Blocked. Current property limits bound legal-team enumeration to at most 90 driver/chariot/beast-pair combinations; no unbounded search.
- **FailurePending presentation:** derived and revalidated on every render/quote; no terminal state is written until explicit protected confirmation. A changed state cannot reuse an old source fingerprint. No automatic failure for debt, zero Gold, injuries, expiry or an unassembled RU.
- **Recovery ordering:** after wage/status computation, before term decrement and Default selection. Driver management fatigue and beast native fatigue reduce separately; Major→Minor/Minor→Healthy; Critical and chariot integrity/wear/native driver strain unchanged.
- **Emergency contracts:** ordinary M2-C terms do not include an emergency early-termination fee. No fee was invented: ordinary termination/renewal rejects that special term, while explicit release is available after one-cycle expiry. This does not change existing ordinary contracts or their legal termination costs.

## Staged test gates and actual commands

Runtime: Node `v24.22.1`, npm `11.9.0`, Chromium `156.0.8078.79`; existing esbuild/playwright-core only. No dependency installation/configuration change was needed.

| Gate / actual command | Result |
|---|---|
| Accepted-source checks: `git rev-parse HEAD HEAD^{tree}`, `git diff --exit-code 79447d8 HEAD`, artifact SHA/size | Exact accepted M2-C source and artifact before changes |
| Baseline `npm test` | **351 passed**, 0 failed/skipped; ~105.5 s |
| `node --test tests/m2-d-maintenance.test.js` before enabling persistent migration | **11 first-gate cases passed**: five package preservation, strict mixed maintenance, stale/ownership rejection, transport compatibility, reconstruction rejection, failed publication and shared 2000 limit |
| Stage-1 `npm test` | **362 passed**, 0 failed/skipped, before persistent 3→4 store API enabled |
| Initial focused M2-D runs | 48 passed, then expanded to **56 passed**; final suite adds two more racing-path/commitment tests |
| First full implementation `npm test` | **399 passed**, 0 failed/skipped |
| Final `npm test` | **409 passed**, **0 failed**, **0 skipped**; 351 retained + 58 new; ~116.2 s |
| `npm run build` | Existing dependency guard passed; identical 436032-byte standalone aliases |
| `node scripts/m2-d/verify.mjs` | **12/12 accepted historical replays**, **5/5 native migration adapters**, **5 fixed zero-income numeric cycles**, **2 new payroll-context full-race captures/replays** passed |
| `node scripts/m2-d/browser.mjs` | **14 new functional groups passed**, no page errors/runtime requests; direct-file policy block, exit 1 |
| Existing M2-C browser runner | **20 passed**; file-policy exit 1 |
| Existing M2-B browser runner with isolated evidence directory | **13 passed**; file-policy exit 1 |
| Existing M2-A browser runner with isolated evidence directory | **12 passed**; file-policy exit 1 |
| Existing persistence browser runner with isolated evidence directory | **18 passed**; file-policy exit 1 |
| `npm run test:browser` | **23 racing/workbench groups passed**, exact bundled/Node parity; file-policy exit 1 |
| `sha256sum -c SHA256SUMS.txt` in authority directory | All supplied authority files match |
| Scoped `git diff --exit-code f66ec90 -- …` and `git diff --check` | Old validators/native formulas/AI/tracks/replay/config/dependencies/build script unchanged; implementation-source whitespace check clean (raw failure logs retain generated whitespace) |

Browser total **100 functional groups** = 86 retained +14 new. These are **HTTP diagnostic results**, not unrestricted file-origin acceptance. Existing browser runners were executed in an isolated current-source copy under `/tmp/bnt-m2d-current`, using the exact rebuilt HTML checksum, so none of their historical default evidence paths in the real repository were overwritten. New runner evidence is under this stage only.

All browser runners attempted real `file://` navigation and received `ERR_BLOCKED_BY_ADMINISTRATOR`. Existing disclosed HTTP fallback was used, with offline contexts after document loading where supported. Their policy exit code 1 was retained and documented; no administrator restriction was bypassed. There are no unresolved automated assertion failures in the final runs. **Windows local file-origin persistence/download acceptance is owner-pending.** Prior owner acceptance applies to M2-C, not this new artifact.

### Acceptance coverage

- A01–A04: pure repeated previews, trust/source/dual-revision checks, exact retry/conflict/tombstone identity, zero/partial payroll, all-personnel liabilities, old-first/tie allocation, voluntary repayment/reset, claims after release, overflow conservation.
- A05–A09: all debt thresholds and authoritative discretionary gating, essential paths retained, all morale derivation paths and snapshot isolation, final wage/expiry, all renewal terms, fifth-settlement departure/defer/last-driver logic, fixed emergency profile/limits/capacity/recruitment checks and expiry.
- A10–A12: Operational/Blocked/FailurePending/Failed, full transaction-backed exhausted-supply proof and terminal read-only/export, synthetic nonzero injury/fatigue recovery, denial/rollback/manual checkpoint, corrupt-primary unsafe recovery rejection, complete newer backup import, older checkpoint refusal, strict versions/limits and protected result tampering.
- A13–A14: original suites and manifests, five native adapter comparisons, 12 historical replay vectors, standalone architecture, no runtime fixture authority or controller, trusted terminal withdrawal/disqualification fixtures, no per-race/departure payroll or fabricated reward schedule. Windows direct-file gate remains pending.

### Development failures retained honestly

Early transaction test expected a stale-fingerprint message but received a contract-snapshot mismatch first; fingerprint validation was moved before snapshot validation so stale previews report the direct cause. An added paused-override fixture passed a boolean instead of the existing `{paused:true}` API; its fixture was corrected without weakening the paused requirement. The first new browser script used a nonexistent import-confirm checkbox; it was corrected to the existing confirmation dialog/button. Failure logs are retained in `evidence/implementation/development-*.log`. Final tests reran successfully; no production rule or retained test was deleted/relaxed to obtain a pass.

## Evidence and reproducibility

- [Verification manifest](evidence/implementation/manifest.json): commands/outcomes, versions, artifact, scope and browser limitations.
- [Final automated log](evidence/implementation/full-tests.log), [first gate](evidence/implementation/first-gate.log), [stage-1 full suite](evidence/implementation/stage1-full-tests.log), [focused tests](evidence/implementation/focused-tests.log).
- [Replay, migration and numeric evidence](evidence/implementation/verification.json), [verification command log](evidence/implementation/verify.log), two new `payroll-*.json.gz` replays, and `tests/data/m2-d-payroll-v1.json` (fixed manually specified expected amounts/terms/profile, not regenerated by tests).
- [M2-D browser report](evidence/implementation/browser/browser.json); retained-stage reports/logs in `m2c-browser`, `m2b-browser`, `m2a-browser`, `m1-browser`, `racing-browser`.
- All championship records, nonzero-condition fixtures, funded careers and terminal supply-exhaustion cases are explicitly **synthetic development evidence**, not ordinary live championship outcomes. Development fixture helpers and authority creation are absent from the production HTML.

## Standalone review and limitations

Use [WINDOWS_ACCEPTANCE.md](WINDOWS_ACCEPTANCE.md). Open either HTML alias directly; no adjacent assets/server/Node/internet is needed by the runtime architecture. The build guard and HTTP-offline functional checks verify packaging, not independent Windows `file://` operation.

Remaining limitations are intentional and explicit:

- No live championship completion source, schedule, purses, race-to-career results application or progression. Settlement controls remain disabled without a trusted future completion capability. Ordinary standalone races do not accrue wages, injuries or XP to careers.
- Failure reachability is conservative: irrecoverability outside the proven supply-exhaustion cases can remain Blocked, rather than falsely killing a recoverable career. This is the approved fallback, not a universal viability solver.
- Unsafe recovery may require a newer external backup; no local identity registry can recover missing full economic state or unknown cross-device history. Client checksums/capabilities are not backend authentication.
- Full origin/receipt reconstruction and immutable archives grow with history. Existing hard limits remain and reject atomically; browser quotas may be smaller. No compaction, unlimited-career performance or durable-download guarantee is claimed.
- The additional strict emergency term does not invent early-termination economics; explicit expired release is supported.
- Managed file-origin navigation remains policy-blocked. This build requires owner Windows acceptance. Passing the executed tests does not prove universal correctness.

**Delivery assessment:** M2-D's authorized subsystem, integration, tests and standalone build are complete for owner review, with the approved controller/failure-search limitations and pending Windows acceptance above. No merge, push, deployment, owner acceptance or later-stage implementation was performed.
