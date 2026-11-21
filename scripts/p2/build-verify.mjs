import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const hash=b=>createHash('sha256').update(b).digest('hex');
const files=['dist/Blood-and-Thunder-P2-Playable.html','dist/Blood-and-Thunder-P2-Durable-Proof.html','dist/p2-durable/Blood_and_Thunder.html','dist/p2-durable/Blood-and-Thunder-Track-Test.html'];
const rows=[];
execFileSync(process.execPath,['scripts/p2/build.mjs']);
const first=await Promise.all(files.map(f=>readFile(f)));
execFileSync(process.execPath,['scripts/p2/build.mjs']);
for(let i=0;i<files.length;i++){const b=await readFile(files[i]);assert.deepEqual(b,first[i]);rows.push({file:files[i],bytes:b.length,sha256:hash(b),reproducible:true});}
assert.deepEqual(first[1],first[2]);assert.deepEqual(first[1],first[3]);
const old=await readFile('/workspace/deliverables/bnt-p2/evidence/baseline/P1.5-reference.html','utf8'),candidate=first[0].toString();
function worker(s){const m=s.match(/globalThis\.__BNT_WORKER_SOURCE__\s*=\s*("(?:[^"\\]|\\.)*")\s*;/);assert.ok(m,'Embedded Worker assignment');return JSON.parse(m[1]);}
assert.equal(worker(old),worker(candidate));
const protectedPaths=['src/sim','src/ai','src/track','src/replay','src/core','src/career','src/persistence','src/prototype'];
assert.equal(execFileSync('git',['diff','5d556f3','--',...protectedPaths],{encoding:'utf8'}),'');
const report={rows,workerSHA256:hash(worker(candidate)),workerByteParity:true,protectedSourceDiffEmpty:true,externalDependencies:'Build rejects resource URLs, fetch and dynamic imports; images/CSS/Worker embedded.'};
await writeFile('/workspace/deliverables/bnt-p2/evidence/build-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
