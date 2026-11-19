# BNT E4 Stage 1 — Windows direct-file architecture proof

**Not final E4 acceptance.** The ordinary racing/championship UI is still the accepted E3 workflow. Automatic E4 checkpoints, complete recovery and coordinated backup/restore are not yet integrated. Use the dedicated proof database below; do not migrate your only career through the diagnostic API.

## Artifact and setup

Download `Blood-and-Thunder-E4-Stage1-Proof.html` from the delivery package. It is a byte-identical copy of the standalone build, not a server URL. Keep it at a fixed path while testing; file-origin storage behavior can depend on browser/profile/path. Close other copies. Use normal Windows Chrome or Edge and record exact version. Private-browsing retention is a separate test, not the primary persistence claim.

1. Disconnect the network.
2. Double-click the HTML. Confirm the address begins `file:///`, with no server running.
3. Check ordinary controls and track selection. Open Developer Tools → Console.
4. Run this block once. It creates **only a separate empty diagnostic database**, not a new career, registration, reward or settlement:

```js
({protocol:location.protocol, secure:isSecureContext, webLocks:typeof navigator.locks?.request==='function'});
// Expected file:, secure:true, webLocks:true for coordinated legacy migration.
window.e4Proof = await BNT.e4.open({name:'BNT-E4-Windows-Stage1-Proof'});
await e4Proof.probe();
// Expected: version:1, worker:true, typedSentinels:true, indexedDB:true.
// durable:false describes the probe; it is not a save acknowledgment.
window.proofSnapshot = await e4Proof.backend.snapshot();
await e4Proof.backend.commit({
  expectedGeneration: proofSnapshot.generation,
  readSet: proofSnapshot.records,
  records: []
});
// Expected only AFTER commit completion: durable:true, generation:N.
e4Proof.close();
```

Record N. There are no adjacent assets and no worker network URL. The worker is constructed from the embedded Blob bundle.

## Browser close/reopen

Close every browser window, reopen the same HTML at the same path/profile while still offline, and run:

```js
window.e4Proof = await BNT.e4.open({name:'BNT-E4-Windows-Stage1-Proof'});
await e4Proof.probe();
```

The generation must equal N; `worker`, `typedSentinels` and `indexedDB` must remain true. Close with `e4Proof.close()`.

A script error, unavailable Web Locks for migration, denied IndexedDB/Blob worker, disappearing generation, changed file origin or storage cleared by browser settings is a failed/unresolved proof. Record the exact message rather than retrying by starting a server. Do not disable administrator restrictions.

## Return evidence

Send browser/version, Windows version, fixed file path, `file:///` confirmation, offline status, environment/Web Locks output, both probe outputs, commit output and reopened generation, plus any console errors. A successful small proof establishes basic B3 compatibility in that browser; it does **not** establish full-field quota, career recovery, automatic checkpoints or final E4 owner acceptance.

## Later E4 acceptance (not available in this artifact)

After Stage 2 implementation, the full Windows checklist must additionally cover real active championships, periodic checkpoints, paused/queued Signs, interrupted birth/native prepare/official publication, complete championship backup/restore, quota handling, eight entrants/twelve events and terminal SETTLEMENT_PENDING without E5 rewards. Do not mark those tests passed from this Stage 1 probe.
