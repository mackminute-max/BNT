import { gzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdir,writeFile,readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import * as current from '../src/sim/race.js';
import {verifyReplay} from '../src/replay/replay.js';
const baselineRoot=process.env.BNT_M2A_REFERENCE_DIR;
if(!baselineRoot)throw Error('Set BNT_M2A_REFERENCE_DIR to an isolated export of M2-A source');
const baseline=await import(pathToFileURL(resolve(baselineRoot,'src/sim/race.js')).href);
const out='docs/m2-b/evidence/implementation';await mkdir(out,{recursive:true});
const records=[];
for(const driverMode of ['reference','autonomous'])for(const format of ['Pure','Combat'])for(const course of ['oval','C01','mixed-rally']) {
 const setup={seed:145,format,course,overrides:{laps:1},driverMode};
 const old=baseline.run(baseline.createRace(setup)),next=current.run(current.createRace(setup)),record=current.capture(next);
 const expected=baseline.capture(old);assert.deepEqual(record,expected);
 const replay=verifyReplay(record);assert.equal(replay.checksum,current.digest(next));
 const entry={setup,baselineChecksum:baseline.digest(old),currentChecksum:current.digest(next),replayChecksum:replay.checksum,ticks:next.tick,status:next.status};records.push(entry);
 await writeFile(out+`/replay-${driverMode}-${format}-${course}.json.gz`,gzipSync(JSON.stringify(record)));console.log(entry);
}
const html=await readFile('dist/Blood_and_Thunder.html');
await writeFile(out+'/parity.json',JSON.stringify({baselineRevision:'5e93b2c23ed74000b42d4658c1232cdc10d0f0fb',references:records,artifact:{bytes:html.length,sha256:createHash('sha256').update(html).digest('hex')}},null,2));
