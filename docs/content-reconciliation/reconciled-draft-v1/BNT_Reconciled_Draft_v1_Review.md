# Blood and Thunder — Batches 02–04 Reconciled Draft v1 Review

November 22, 2026 (America/Los_Angeles). **Read-only review complete. Conditionally acceptable as content drafts; not ready for runtime integration.**

## Authority, source and scope

The latest message supplies a reconciliation handoff/package, rather than a separate implementation instruction. The attached `CODEX_RECONCILIATION_HANDOFF.md` explicitly requests a read-only review and a separate presentation-only integration proposal. That is the scope followed. Its authoring-waiver statement is applied as a content-authoring disposition, not as independent approval of every biography, illustration, canon mapping or runtime change.

Repository: `mackminute-max/BNT`, local `/workspace/BNT`; branch `feat/m2-e5-c1-navigation-correction`; HEAD `a70ec6e836b765488dbe793606e8c103b8dad3da`. This matches the package's source revision. The working tree already contains the previous uncommitted E5-D M1 delivery and the pre-existing M2-E audit. They were preserved.

Compared with the prior exact-source inventory, three listed inspection sources differ: `src/management/playable.js`, `src/persistence/e4/worker-service.js`, `src/ui/durable-championships.js`. These are the pre-existing M1 UI/scoping/read-only-preview seams. The content/market/economy/package, track, native Sign/weather/reporting contracts under this review remain unchanged. Live exports and current source were checked; old inventory assertions alone were not accepted as proof. The new M1 slot/navigation metadata is not an approved presentation-pack pin.

No source, test, configuration, save, submitted draft, asset or build was modified. No migration, branch, commit, merge, push or deployment. Before/after SHA-256 comparison verified **all 2,611 tracked/untracked repository files unchanged**, with identical working-tree status. Reports, extracted references and diagnostics are outside the repository at `/workspace/deliverables/bnt-reconciled-draft-v1`.

## Record disposition

`ACCEPT_DRAFT` means technically compatible *candidate* under its named consumer guard, not installed content, owner creative approval, or canonical release certification. `REVISE` identifies an actual remaining draft correction. Runtime prerequisites are tracked separately so a correctly deferred feature is not mislabeled as an authored defect.

| Batch | Content records | ACCEPT_DRAFT | REVISE | Disposition |
|---|---:|---:|---:|---|
| 02 — copy/metadata | 75 | 60 | 15 | Five previously flagged copy records fixed; fifteen track flags remain |
| 03 — recruitment identities | 23 | 23 | 0 | Source slots/names match; original references available; runtime pack activation remains blocked |
| 04 — race copy | 37 | 37 | 0 | Prior eleven record corrections present; no runtime formatter/selector installed |
| **Total** | **135** | **120** | **15** | Draft review only |

Separately: **37 art briefs**, 36 acceptable as draft concepts and one needing cross-file clarification; **all 37 remain unregistered** without files, rights, approved IDs and consumers. The Batch04 root `kind` label also needs minor metadata cleanup. Commentary has **66 ordinary variants plus one fixed resistance sentence = 67**, reduced from 69 by removing the two unsupported resistance alternatives.

Of the prior 31 content-record `REVISE` dispositions, **16 are resolved and 15 remain**. The five driver-characterization secondary issues are additionally addressed by explicit disclaimers. The prior 17 missing-canon-authority holds no longer apply as missing-source holds; the originals are now available. This does not promote fictional character biographies to established canon.

Individual decisions, source references and display guards for every content record are in [Record Review CSV](BNT_Reconciled_Draft_Record_Review.csv) and [Record Review JSON](BNT_Reconciled_Draft_Record_Review.json).

## Remaining non-canon findings

### F01 — Required correction: fifteen primary tracks still claim `not_an_alias: false`

The handoff says the flags were removed, but `batch02/TRACK_COPY.json` is unchanged from the previous submission. The first example is `short-oval` at line16. All three ovals and C01–C12 retain the false flag.

The definitions are actual independent catalog entries in `src/track/catalog.js:3–26`; separately defined legacy courses remain in `src/track/course.js:107–112`. There is no declared alias relationship that makes the primary entries aliases.

**Requested author correction:** remove this ambiguous flag for the fifteen primary entries, or use an explicitly defined correct independent-definition flag. Do not create redirects, rename course IDs or change geometry. The four legacy rows already use `not_an_alias: true` and need no change for this finding.

Affected keys: `short-oval`, `oval`, `grand-oval`, `C01`, `C02`, `C03`, `C04`, `C05`, `C06`, `C07`, `C08`, `C09`, `C10`, `C11`, `C12`.

### F02 — Clarification: heavy-rain art instructions are inconsistent across files

The revised `batch04/WEATHER.json` correctly says terrain is unchanged and explicitly excludes newly created mud/standing-water hazards. Its separate art brief, `batch04/VISUAL_ASSET_BRIEFS.json:105`, still says “Dense rain, dark mud spatters, saturated wheel ruts”.

That is **not proof of a mechanics contradiction**: mud can be pre-existing or purely icon decoration. It is an avoidable production ambiguity if artists assume every rain-affected track must become mud. `src/sim/environment.js:21–28` supplies weather coefficients, while the catalog separately specifies surfaces (`src/track/catalog.js:9–20`).

**Recommended author clarification:** use rain/visibility cues consistently, or explicitly restrict mud/ruts to existing mud terrain/cosmetic icon detail. No terrain-conversion feature or environment renderer change is authorized.

### F03 — Minor metadata cleanup: visual briefs labeled nonvisual

`batch04/VISUAL_ASSET_BRIEFS.json:2` declares `kind: "nonvisual-production-briefs"`, although all fourteen records request SVG concepts/PNG derivatives. There is no current native loader for this draft schema, so this is not an application defect.

**Recommended correction:** use an unambiguous visual-brief draft kind in the authoring contract before implementing a compiler. Do not rename it to the native presentation manifest kind: these records are not native runtime assets.

## Corrections confirmed against source

| Revision | Verified disposition / evidence |
|---|---|
| Workshop | Description now states the existing eligible-service discount, not a new service unlock. Discount uses the service's workshop flag; no engineering discount is implied. `economy/reducers.js:17–20,57–75` |
| Treatment Ward | Describes existing eligible treatment discount; does not invent a mandatory ward prerequisite. Same reducer/service flags |
| Training Grounds | Describes existing XP training discount and no automatic XP/attributes. `economy/reducers.js:26–29,69–75`. Future UI should still obtain the actual rounded price from the authoritative quote |
| Repair versus refurbishment | Repair now restores integrity, not wear. Existing D2 repair/native restoration and separate refurbishment remain authoritative. `economy/reducers.js:58–68`; `championships/condition.js:34–37` |
| Mechanist package | Tuned native chariot, two neutral equipment records, descriptive Workshop Shed are distinguished. `career/packages.js:10,26–29` |
| Driver characterization | All five driver drafts carry an explicit native-AI disclaimer. It must accompany the biography/personality in the future consumer, not be silently dropped during `biography`→`bio` projection. Current consumer is `management/player-pages.js:17–18` |
| Six Signs | All six activation notes include pre-start signal, closed-course crossing and Rally checkpoint; activation cue is explicitly `SIGN_ACTIVATED` only. Engage Rivals tooltip says Combat-only. `ai/signs.js:19–47`; `sim/race.js:449–485,916–922` |
| Buffered Sign behavior | Revised general timing copy is not permission to remove versioned buffered-delay acknowledgment/diagnostics. Keep the existing physical boundary proof and presentation chronology. `ai/buffered-signs.js:5–30` |
| Heavy Rain/Mud copy | Weather description/cue no longer invent terrain conversion; all five native multiplier objects match live source exactly. `sim/environment.js:4–45`. Separate art ambiguity is F02 |
| WRECK_CREATED v3 | Stationary wreck wording no longer declares the racer “out”. A finished entrant can leave a wreck; native status must not be overwritten by prose. `sim/consequences.js:135–170` |
| RU_EXITED v2 | Now says the subject cleared the exit while others may remain; no universal exit-clear assertion. `sim/race.js:846–853` |
| RACE_STALLED v2 | Explicitly denies implied official settlement/advancement. Stalled is not an invented finish, DNF or successful D5 clearance. `sim/foundation/checkpoint.js:46–50` |
| DIRECTIVE_RESISTANCE | Exactly one native-compatible sentence, no selector. Actual source remains AI_DECISION-derived, enabled, Resisting, no execution/stress error, eight-time-unit per-subject guard. `reporting/commentary.js:71` |
| Ordinary commentary | All22 native source excerpts match; 66 candidate strings have exact allowed token sets. Native callable factories/hash/throttles remain unchanged. `reporting/commentary.js:69–88` |

Numbers, package grants, costs, targets, reward-placeholder definitions, terms, trophies and IDs are verified reference mirrors, not proposed mechanical inputs. All nine Batch02 key sets and all23 recruitment slot/name/category/tier/ordinal matches passed the live-source audit.

## Canon/reference verification

The earlier uploaded AI Database v2 ZIP contains all three original Markdown sources. Their bytes were retained under `world-reference/Blood_and_Thunder_AI_Database_v2/sources/` outside the repository. Originals outrank JSON extracts. The separately uploaded Nations document is byte-identical to the ZIP's original Nations document.

| Original | SHA-256 |
|---|---|
| Vaern Eight Nations Canon v1.0(3) | `5b7f151fddd3c43c69e31e1f8a26d85452eddd6d9bf8d24f92d9e322f33707c5` |
| Ancestry Reference Bible Canon v1.0(3) | `44ff83d890f7ee1bf06f7e34d795bd2b6cef7e7a6c747adabdebe96044b29c57` |
| Draft Beast and Racing Stock Bible Canon v1.0(2) | `7273d84556c7a204a9a458eabf626a6eea01cba2b2b7a0f00b862ad52c37cbce` |

The derived index's30 entity IDs/names were checked against actual original Markdown headings/source hashes. Across the17 enriched records, **25 explicit ancestry/nation/species references match original IDs and names**. The six generic equipment identities carry no such explicit reference. See [Canon Mapping CSV](BNT_Canon_Mapping_Verification.csv) for every mapping and original start/end line.

Examples checked directly against prose: Mountain Dwarf compact/angular anatomy (ancestry original258–303); antlerless Meadowstrider (beast original300–326); gray-brown Storm Elk and harness clearance (beast original136–162). No observed coarse anatomy contradiction was identified in the supplied briefs. Typical dimensions, morphology variations and new catalog bloodline qualifications remain source-qualified guidance, not hard engine limits or guarantees.

This verification certifies referenced ID/name identity and reviewed compatibility, **not every new personal biography, garment, nationality assignment, cultural design choice or proposed illustration as established canon**. They remain authored drafts under the handoff's waiver. Ancestry does not determine nationality, job or personality; species does not create nation exclusivity or native performance bonuses. The native owned species remains `generic_draft_beast` (`career/packages.js:25`; `career/economy/validation.js:13–30`).

## Runtime prerequisites remain open, not silently solved

1. **Durable presentation-pack policy:** current `management/content.js:3–31` is an unversioned-per-career resolver over sourceOfferId; it has no approved new-pack pin. Globally swapping its table would alter old/unmarked biographies/ancestry. M1 slot IDs/timestamps are navigators, not pack authorizations or portable save metadata.
2. **Strict persistence:** `career/championships/e5/schema6.js:36–38` reconstructs exact supported state/history; `persistence/envelope.js:25` and `persistence/e4/backup.js:6–13` enforce versioned exact formats. A new arbitrary profile field or external-only pin is not already supported. Required integrity proof covers ordinary/career-only/complete export-import, previous checkpoints and coordinated restore.
3. **No native JSON formatter:** native commentary calls functions at `reporting/commentary.js:79`. Plain JSON arrays/strings are not that API. Replacing the native pools would also change selected prose; exported results contain native narrative (`reporting/results.js:79–87`). Legacy reporter/narrative must stay exact.
4. **No registered art:** all37 briefs remain proposals. Current manifest requires bounded, hashed, licensed PNG/SVG/builtin proof records (`presentation/contracts.js:3–12`); the image cache is24 entries/8MiB and preloads imports (`presentation/assets.js:4–9`). A manifest-count pass alone would not prove image-cache capacity. Actual artwork is outside the recommended first copy-only slice.

These are explicit future integration gates acknowledged by the revised package. They are not a reason to reimpose the waived missing-source authoring hold or invent a new gameplay rule. The separate [Presentation Integration Proposal](BNT_Reconciled_Draft_Presentation_Integration_Proposal.md) keeps the initial implementation small.

## Verification executed for this review

| Command / check | Actual result | Exit |
|---|---|---:|
| `node /workspace/deliverables/bnt-reconciled-draft-v1/audit.mjs` | All live keys/numeric mirrors;23 identities;67 token sets;22 exact excerpts;8 native formatter witnesses; hash/priority/throttle/resistance guards | 0 |
| `python /workspace/deliverables/bnt-reconciled-draft-v1/review.py` | 17 JSON files, duplicate/nonfinite checks;135 record decisions;37 brief reviews;30 original entity headings/source hashes;25 explicit references | 0 |
| `node --test tests/m2-b.test.js tests/m2-c-numeric.test.js tests/e5-b-foundation.test.js tests/e5-b-lifecycle.test.js tests/e5-b-awards.test.js tests/prototype.test.js tests/autonomous.test.js tests/p1-3.test.js` | **117 passed,0 failed,0 skipped**;19,671ms | 0 |
| `node /workspace/deliverables/bnt-reconciled-draft-v1/references.mjs` | **12 historical +2 payroll replay checksums matched**, no golden updates | 0 |
| Repository before/after hash/status comparison | **2,611 files unchanged**, all pre-existing work retained | 0 |

Node v24.22.1. Diagnostic reporter witnesses use explicitly synthetic events and execute the **existing** Commentary; no replacement formatter was prototyped. An early audit-script assumption incorrectly lowercased neither the native capitalized tier nor its sourceOfferId segment; that diagnostic was corrected to match `economy/market.js:20`, not by changing supplied content/source.

No full761-test rerun, browser/Windows test, new HTML build, content import, runtime art registration or implementation acceptance is claimed for this audit. The previous M1 evidence remains historical evidence, separate from these fresh checks. Logs/scripts/source comparison/unchanged-tree proof are in `evidence/` and this report's directory.

## Recommended next action

Correct F01 in the authoring package; align/clarify F02 and tidy F03. Retain the remaining source-compatible drafts and authoring waiver without treating them as an import format. Review the copy-only proposal, then separately authorize any implementation. Identity pack activation, alternate radio display and asset binding remain disabled until their stated approval and compatibility proofs exist.

**STOP — Read-only reconciliation and proposal delivered. No integration or save migration performed.**
