# Architecture audit evidence

Assessed source `171ea008cebadcb183ba137c7d6f1bf887897aa0`, simulation `0.6.0-tracks`. Read the [architecture audit](../Blood-and-Thunder-Architecture-Audit.md) and [implementation readiness matrix](../Blood-and-Thunder-Implementation-Readiness.md).

Only audit Markdown/evidence was intentionally added. No production source, dependency/lock configuration, old audit or final artifact bytes changed. No push/commit was performed.

## Commands executed

From `/workspace/BNT`, in sequence for the heavier workloads:

```sh
npm ci --cache /workspace/.npm-cache
npm test
npm run build
npm run test:browser
npm run
npm ls --all
BNT_REPORT_TAG=../docs/architecture-audit/evidence/current npm run reference
node scripts/track-expansion/browser.mjs
sha256sum dist/*.html
git diff --check
git status --short
```

Outputs were redirected to the corresponding `.log`/JSON files under `evidence/`; `npm run test:browser` returned 1 because direct-file navigation is administrator-blocked. Its 23 functional checks passed, while the track runner's 10 groups passed with the same file-origin limitation separately reported. Typechecking/linting are not configured and were not run. The build and generated historical track-browser outputs remained byte-identical to HEAD. Their fresh report/screenshots were copied here, preserving historical content. The new pretty reference replay was gzip-compressed (mtime 0) and retained as `current-seed-145-replay.json.gz`; no historical replay was replaced.

`npm run reference` simulates/verifies the two reference formats, samples eight seeds/format, exercises a pre-race Combat sign and exports a further default reference. `reference-summary.json` records exact hashes, ticks, event/checkpoint counts and measured serialized sizes. Its batches are not a championship simulation. The previous track-expansion 60-race/36-exported-replay workload was not rerun in full during this audit.

## Interface probe command

The following Node ESM inspection was executed with stdout redirected to `evidence/interface-probes.json`. It mutates only local throwaway race/storage instances; no production files or real browser save were modified. It records observations rather than adding test cases to the 212-test suite.

```sh
node --input-type=module - <<'JS'
import {createRace,step,capture} from './src/sim/race.js';
import {defaultRU,validateRU} from './src/model/ru.js';
import {results} from './src/reporting/results.js';
import {configuration,parseConfiguration,saveConfiguration,loadConfiguration} from './src/dev/configuration.js';
import {startReplay} from './src/replay/replay.js';
const input={entrants:[{ru:defaultRU('player-entry')}]},s=createRace(input),p={};
s.entrants[0].ru.beasts[0].fatigue=12;
p.inputComponentsAreCopied=input.entrants[0].ru.beasts[0].fatigue===0;
const extra=defaultRU('asset-probe');extra.driver.id='driver-1';
try{validateRU(extra);p.componentIdAccepted=true;}
catch(e){p.componentIdAccepted=false;p.componentIdError=e.message;}
const x=results(s);
p.resultAliases={signs:x.technical.entrants[0].signs===s.entrants[0].signs,diagnostics:x.technical.diagnostics===s.diagnostics,setup:x.setup===s.setup};
p.liveJsonSerializable=typeof JSON.stringify(s)==='string';
p.captureRoundTrip=JSON.parse(JSON.stringify(capture(s))).kind;
let value;const storage={setItem(k,v){value=v;},getItem(){return value;}};
const doc=configuration({});saveConfiguration(storage,doc);
p.configurationStorageRoundTrip=loadConfiguration(storage).version===doc.version;
value='{broken';try{loadConfiguration(storage);}catch(e){p.corruptConfigurationRejected=e.message;}
p.corruptConfigurationPreserved=value==='{broken';
let replacementCalls=0;
p.storageWriteFailure=saveConfiguration({setItem(){replacementCalls++;throw Error('quota probe');}},doc);
p.writeCalls=replacementCalls;
const old=structuredClone(doc);old.version='0.5.0-courses';
p.supportedOldConfiguration=parseConfiguration(JSON.stringify(old)).version;
try{startReplay({...capture(createRace()),version:'0.5.0-courses'});}
catch(e){p.oldReplayRejection=e.message;}
const bounded=createRace();step(bounded,[{type:'disqualify',id:'RU1'}]);
p.disqualificationCommand={status:bounded.status,error:bounded.events.at(-1)?.effects.message};
console.log(JSON.stringify(p,null,2));
JS
```

`audit-manifest.json` records environment/version/artifact and browser outcomes. `source-index.txt` records inspected exported functions and persistence/rendering call sites. `project-files.txt` omits generated/history directories to make the application/tooling inventory readable. `FILES.sha256` in this directory covers both reports and the evidence; run `sha256sum -c docs/architecture-audit/FILES.sha256` from the repository root.

No file-origin storage test, actual career save, championship transaction, lint/typecheck, independently verified Windows launch or owner acceptance is claimed.
