import {readFile,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {execute} from './measure.mjs';
import {buildJobs,buildSupplementJobs} from './scenarios.mjs';
import {verifyReplay} from '../../src/replay/replay.js';
const root='docs/phase2/';
const original=JSON.parse(await readFile(root+'baseline/references.json','utf8'));
const study=JSON.parse(await readFile(root+'baseline/study-references.json','utf8'));
const records=[];
for(const ref of original){
  const job={id:ref.id,setup:ref.results.setup,format:ref.format,seed:ref.results.seed,weather:'Clear',schedule:ref.intervention==='none'?[]:[{on:'start',action:'queue',sign:ref.intervention}]};
  const observed=execute(job).result;
  assert.equal(observed.checksum,ref.checksum);assert.equal(observed.eventsSHA256,ref.eventsChecksum);assert.deepEqual(observed.rng,ref.rng);assert.deepEqual(observed.official,ref.results.official);
  records.push({id:ref.id,cadence:100,checksum:observed.checksum,eventsSHA256:observed.eventsSHA256,baselineParity:true});
}
for(const ref of study){
  const observed=execute({id:ref.format+'-study',setup:ref.setup}).result;
  assert.equal(observed.checksum,ref.checksum);assert.equal(observed.eventsSHA256,ref.eventsSHA256);assert.deepEqual(observed.rng,ref.rng);
  records.push({id:ref.format+'-study',cadence:10000,checksum:observed.checksum,baselineParity:true});
}
const jobs=[...buildJobs(),...buildSupplementJobs()];
for(const [experiment,arm,format] of [['D','lifecycle-replace','Pure'],['D','Engage Rivals','Combat'],['E','degraded','Combat'],['Drear','Engage Rivals','Combat']]){
  const job=jobs.find(j=>j.experiment===experiment&&j.arm===arm&&j.format===format);
  const a=execute(job,{includeReplay:true}),b=execute(job,{instrument:false});
  assert.equal(a.result.checksum,b.result.checksum);assert.equal(a.result.eventsSHA256,b.result.eventsSHA256);assert.deepEqual(a.result.rng,b.result.rng);
  assert.equal(verifyReplay(a.replay).checksum,a.result.checksum);
  await writeFile(root+'evidence/'+experiment+'-'+format+'-reference.json.gz',gzipSync(JSON.stringify(a.replay)));
  records.push({id:job.id,cadence:10000,checksum:a.result.checksum,eventsSHA256:a.result.eventsSHA256,observedUnobservedParity:true,replayVerified:true});
}
await writeFile(root+'evidence/instrumentation-parity.json',JSON.stringify(records,null,2));console.log(JSON.stringify({passed:records.length,failed:0}));
