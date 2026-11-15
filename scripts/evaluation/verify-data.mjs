import {readFile,writeFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {buildJobs,buildSupplementJobs} from './scenarios.mjs';
import {execute} from './measure.mjs';
const records=[];
for(const [directory,jobs,experiments] of [['data',buildJobs(),['A','B','C','S','D','E']],['supplement',buildSupplementJobs(),['Drear']]]){
 const rows=gunzipSync(await readFile('docs/phase2/'+directory+'/races.jsonl.gz')).toString().trim().split('\n').map(JSON.parse);
 for(const experiment of experiments){const job=jobs.find(j=>j.experiment===experiment),saved=structuredClone(rows.find(r=>r.id===job.id));
  const observed=execute(job,{includeReplay:true});assert.equal(observed.replay.checksum,observed.result.checksum);
  const checkFinite=x=>{if(typeof x==='number')assert.ok(Number.isFinite(x));else if(x&&typeof x==='object')for(const v of Object.values(x))checkFinite(v);};
  checkFinite(observed.result);
  const fresh=JSON.parse(JSON.stringify(observed.result));delete saved.wallSeconds;delete fresh.wallSeconds;
  // The primary export preceded the explicit playerId metadata field; its complete
  // normalized configuration already specifies RU1. No metric or engine data change.
  saved.playerId??=observed.config.setup.playerId;
  assert.deepEqual(fresh,saved);
  records.push({id:job.id,checksum:fresh.checksum,eventsSHA256:fresh.eventsSHA256,deepMetricEquality:true,freshAuthoritativeChecksum:true});
 }
}
await writeFile('docs/phase2/evidence/independent-rerun-checks.json',JSON.stringify(records,null,2));console.log(JSON.stringify({passed:records.length,failed:0}));
