# E5-C source preflight and integration disposition

Baseline branch `feat/m2-e5-b-championship-progression`, HEAD `ee6963c41accad23a09981007eb1daa78f56f912`, runtime `4322672749091d8f0c7121d7f2d14f3d5bba67a7`. The accepted E5-B HTML hash matches `d9f909a59a78ad3c3a688ce15be6e6d77c2164fde2f16469ade9530cddbae6b8`. The existing untracked M2-E audit is preserved. Dedicated branch: `feat/m2-e5-c-integrated-career-loop`.

## Verified seams before production changes

| Source | Interface and disposition |
|---|---|
| `src/career/championships/controller.js` | `makeControllerCommand`, `activeChampionship`: frozen setup, manual birth, unchanged E3/D2 publication and coaching. Reuse. |
| `src/career/championships/orchestrator.js` | `ChampionshipRunner.ensure/advance/sign/publish/retry`: authoritative native producer. Reuse; never synthesize a displayed result. |
| `src/career/championships/e5/{schema6,capabilities,rewards}.js` | Strict reconstruction, final M2-D settlement and mandatory Run/Legacy lifecycle. Reuse unchanged. |
| `src/persistence/e4/{client,worker-service,indexeddb}.js` | Prepare → generation/read-set checked commit → acknowledge. Add bounded presentation packets to this same authority; no second simulator or new save format. |
| `src/persistence/race/session-store.js` | Existing native journal executes actual ticks. Add an optional internal read-only tick observer for P2.2 projections, and support the already-existing native versioned buffered-Sign delay action in paused journals. Preserve old input meaning, full validation, limits and synchronous store methods. |
| `src/prototype/buffered/{client,projection}.js` | Reuse accepted P1.5/P2.2 buffered chronology, interpolation, frame/event validation and visual protocol. Adapt transport, not native simulation. |
| `src/presentation/{bootstrap,renderer,player,fullscreen}` | Reuse accepted P2.2 modules and embedded artwork via checked build-time adapter. Keep exact accepted standalone practice artifact unchanged. |
| `src/management/{playable,championship-e5}.js` | Existing queued port, normal navigation, confirmations and protected actions. Add explicit assignment disclosure, preparation, continuation, official results, recovery and race launch. |

## Engineering reconciliation

Launching the independent P2.2 NativeWorkerHost would create a second race authority and lose E4 durability. Instead the owned viewer uses the same accepted buffered client/view modules with a transport to the E4 inline Worker. Read-only projections are captured during actual accepted native execution, returned only after the coordinator's durable commit, and presented chronologically. Window/MessagePort bindings include career, instance, event, frozen setup and source revisions. No caller result is trusted.

A buffered input may arrive just after a visible boundary. Reuse `eligibleBoundary` and native `buffer-delay-v1` exactly as the accepted P2.2 host does. This requires an additive paused-journal action validator entry, not a new mechanic or a new save version. Native validation still rejects invalid delay proofs. Queue and delay records are published in one E4 transaction, never acknowledged from an uncommitted worker mirror.

On restoration the viewer presents the newest durable native head, paused; it does not restart the race. Stale view references or worker failure require explicit reopen/recovery. Headless AI continuation uses the same controller/simulator with durable progress, including typed zero-starter publication. E5-B reward gating, final-only financials and owner-approved elimination/Legacy rules are unchanged.

The presentation guidelines remain binding: top-down follow view, separate map, radio, queued Signs, dynamic readable state and offline packaging. No P3/P4 art, AI or mechanical work is included. The performance cost of existing durable commits remains a measured risk; buffering must hold honestly rather than invent motion or bypass persistence.
