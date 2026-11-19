# BNT E4 Stage 1 — final Windows direct-file proof

This is a small architecture acceptance test, **not full E4 acceptance**. Stage 2 is not implemented or authorized by this follow-up. The owner performs this test on Windows; managed HTTP checks do not establish Windows acceptance.

## 1. Identify the exact artifact

Use `Blood-and-Thunder-E4-Stage1-Proof.html`, byte-identical to `dist/Blood_and_Thunder.html`:

- Runtime revision: `1cde0b0a6d6f49fc3a87ca886e87fd79cd501948`.
- File size: **988319 bytes**.
- SHA-256: **`5d03542c2f7c45cf76a920a5a0591047b4c571535960864ea2d41bce84135a51`**.

Optional read-only PowerShell check, using your actual path:

```powershell
Get-FileHash -Algorithm SHA256 'C:\YourFolder\Blood-and-Thunder-E4-Stage1-Proof.html'
(Get-Item 'C:\YourFolder\Blood-and-Thunder-E4-Stage1-Proof.html').Length
```

Keep the file at the same path throughout. Use a normal Chrome or Edge profile, not a private session. Record Windows/browser versions. Close other copies, disconnect the network, double-click the file, and confirm its address starts `file:///`. No Node, server, adjacent assets, or internet is required. Do not disable administrator restrictions if access is denied.

## 2. Create the dedicated empty proof checkpoint

Open Developer Tools → Console. Paste the complete block. It prints a JSON record explicitly, so intermediate console-expression outputs are not required. It uses only a dedicated empty proof database, never your career database. Existing nonempty records in that proof database cause rejection rather than replacement.

```js
await (async () => {
  const environment = {
    protocol: location.protocol,
    secure: isSecureContext,
    webLocks: typeof navigator.locks?.request === 'function',
    userAgent: navigator.userAgent
  };
  const proof = await BNT.e4.open({name:'BNT-E4-Windows-Stage1-Proof'});
  try {
    const probe = await proof.probe();
    const before = await proof.backend.snapshot();
    if (before.records.length || before.migration || before.migrationStage) {
      throw Error('Proof database contains nonempty authority; do not replace it.');
    }
    const committed = await proof.backend.commit({
      expectedGeneration: before.generation,
      readSet: before.records,
      records: []
    });
    window.e4Stage1Initial = {environment, probe, committed};
    console.log('BNT_E4_INITIAL', JSON.stringify(window.e4Stage1Initial, null, 2));
    if (!committed.durable) throw Error('No durable commit acknowledgment.');
  } finally {
    proof.close();
  }
})();
```

Save the printed `BNT_E4_INITIAL` JSON outside the browser. Record **N = committed.generation**, a positive integer. The probe's `durable:false` is correct: a probe is not a save acknowledgment. The separate commit must return `durable:true` after completion. Expected environment: `protocol:"file:"`, `secure:true`, `webLocks:true`; expected probe: `worker:true`, `typedSentinels:true`, `indexedDB:true`.

This operation creates no career, Gold, assets, registration, race result, reward or settlement. Do not change the database name to your ordinary career database.

## 3. Fully close and reopen

Exit the browser completely, including background operation if enabled. Remain offline. Reopen the exact same HTML at the same path and profile. Confirm `file:///` again. Open Console and paste this block. Enter N from the first saved output when prompted; cancellation or invalid input rejects.

```js
await (async () => {
  const answer = prompt('Enter committed.generation N from your saved BNT_E4_INITIAL output:');
  if (answer === null || !/^[1-9]\d*$/.test(answer.trim())) {
    throw Error('A positive recorded generation N is required.');
  }
  const expectedGeneration = Number(answer.trim());
  if (!Number.isSafeInteger(expectedGeneration)) throw Error('Invalid generation N.');
  const proof = await BNT.e4.open({name:'BNT-E4-Windows-Stage1-Proof'});
  try {
    const probe = await proof.probe();
    const checks = {
      directFile: location.protocol === 'file:',
      secureContext: isSecureContext,
      webLocks: typeof navigator.locks?.request === 'function',
      indexedDB: probe.indexedDB === true,
      embeddedWorker: probe.worker === true,
      typedSentinels: probe.typedSentinels === true,
      generation: probe.generation === expectedGeneration
    };
    window.e4Stage1Reopened = {expectedGeneration, probe, checks};
    console.log('BNT_E4_REOPENED', JSON.stringify(window.e4Stage1Reopened, null, 2));
    if (!Object.values(checks).every(Boolean)) {
      throw Error('Direct-file acceptance checks failed; preserve outputs for review.');
    }
  } finally {
    proof.close();
  }
})();
```

All seven checks must be true. A disappearing generation, denied IndexedDB/worker, missing Web Locks, protocol mismatch or console error is a failed/unresolved proof. Do not restart the proof to conceal a lost generation; report it. Repeating the first block intentionally increments the empty proof generation, so use the most recent recorded N.

## 4. Return evidence

Provide file hash/size, Windows/browser versions, fixed path/profile, confirmation that networking stayed disconnected, full browser exit/reopen, both printed JSON outputs, and any console errors. The repository's managed HTTP snippet check is API verification only: its `directFile` check must be false and it is not Windows acceptance.

Even a successful result proves only this small Stage 1 capability in the tested browser. Full-field quotas, periodic race checkpoints, coordinated backup/restore, complete recovery UI and final E4 acceptance remain separate. No final owner acceptance is inferred automatically.
