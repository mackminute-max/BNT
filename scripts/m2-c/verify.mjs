import {mkdir,readFile,writeFile} from 'node:fs/promises';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';import {gzipSync} from 'node:zlib';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
import * as current from '../../src/sim/race.js';import {verifyReplay} from '../../src/replay/replay.js';
import {previewRU} from '../../src/career/assembly.js';import {previewRU3} from '../../src/career/economy/reducers.js';
import {STARTING_PACKAGES} from '../../src/career/packages.js';import {load,starter,migrationRequest} from '../../tests/m2-c-helpers.js';
const out='docs/m2-c/evidence/implementation',baselineRoot=process.env.BNT_M2B_REFERENCE_DIR;if(!baselineRoot)throw Error('Set BNT_M2B_REFERENCE_DIR to an isolated export of accepted commit 105bce8');await mkdir(out,{recursive:true});
const baseline=await import(pathToFileURL(resolve(baselineRoot,'src/sim/race.js')).href),references=[],migrations=[];
for(const packageId of Object.keys(STARTING_PACKAGES)){
 const source=starter(packageId,'manifest-'+packageId),{store}=load(source),preview=store.previewEconomy(),request=migrationRequest(source,preview,'migration-'+packageId);store.migrateEconomy(request);const target=store.state,a=Object.values(source.management.registries.assignments)[0];
 const before=previewRU(source,a,{assignmentId:a.id}),after=previewRU3(target,a,{assignmentId:a.id});assert.deepEqual(after.native,before.native);assert.deepEqual(after.derived,before.derived);
 migrations.push({packageId,source,preview,request,acknowledgment:store.migrateEconomy(request).acknowledgment,target,nativeAdapterParity:true});
}
await writeFile(out+'/five-package-migrations.json',JSON.stringify(migrations,null,2));
for(const driverMode of ['reference','autonomous'])for(const format of ['Pure','Combat'])for(const course of ['oval','C01','mixed-rally']){
 const setup={seed:145,format,course,overrides:{laps:1},driverMode};const old=baseline.run(baseline.createRace(setup)),next=current.run(current.createRace(setup)),record=current.capture(next);assert.deepEqual(record,baseline.capture(old));const replay=verifyReplay(record);assert.equal(replay.checksum,current.digest(next));const bytes=gzipSync(JSON.stringify(record)),file=`replay-${driverMode}-${format}-${course}.json.gz`;await writeFile(out+'/'+file,bytes);
 const entry={setup,status:next.status,ticks:next.tick,baselineChecksum:baseline.digest(old),currentChecksum:current.digest(next),replayChecksum:replay.checksum,replayFile:file,replayBytes:bytes.length,replaySHA256:createHash('sha256').update(bytes).digest('hex')};references.push(entry);console.log(entry);
}
const html=await readFile('dist/Blood_and_Thunder.html');assert.deepEqual(html,await readFile('dist/Blood-and-Thunder-Track-Test.html'));
await writeFile(out+'/parity.json',JSON.stringify({baselineRevision:'105bce8a2a8f639b56c703cd75c56ce212471021',fiveNativeAdaptersMatched:true,references,artifact:{bytes:html.length,sha256:createHash('sha256').update(html).digest('hex')}},null,2));
