import {readFile,writeFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const root='docs/phase2/',directory=process.argv.includes('--supplement')?'supplement':'data',data=root+directory+'/',rows=gunzipSync(await readFile(data+'races.jsonl.gz')).toString().trim().split('\n').map(JSON.parse);
const jobs=JSON.parse(gunzipSync(await readFile(data+'jobs.json.gz'))),configs=JSON.parse(gunzipSync(await readFile(data+'configurations.json.gz')));
assert.equal(rows.length,directory==='supplement'?130:1000);assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
let entryCount=0,maxPaceError=0,maxDamageError=0;
for(const r of rows){assert.ok(jobs.some(j=>j.id===r.id));assert.ok(configs[r.configId]);assert.equal(r.ru.length,8);
 assert.equal(r.race.finishes+r.race.dnfs+r.race.dns,8);
 assert.equal(r.ru.reduce((n,u)=>n+u.overtakes,0),r.race.overtakes);
 assert.equal(r.ru.reduce((n,u)=>n+u.lostPositions,0),r.race.overtakes);
 for(const u of r.ru){entryCount++;const p=Math.abs(Object.values(u.paceSeconds).reduce((s,x)=>s+x,0)-u.competitiveSeconds);maxPaceError=Math.max(maxPaceError,p);assert.ok(p<1e-6);
  assert.ok(u.blockedSeconds>=0&&u.blockedSeconds<=u.competitiveSeconds+1e-6);assert.ok(u.sampledAverageSpeed===null||u.maxObservedSpeed+1e-8>=u.sampledAverageSpeed);
  const lost=[u.finalCondition.driver,u.finalCondition.chariot,...u.finalCondition.beasts].reduce((s,v)=>s+100-v,0);maxDamageError=Math.max(maxDamageError,Math.abs(lost-u.damage));assert.ok(Math.abs(lost-u.damage)<1e-6);
  if(u.officialTime!==null){assert.ok(u.finishFatigue!==null);assert.equal(u.finishSnapshot.time,u.officialTime);}
  assert.equal(Object.values(u.decisions).reduce((s,x)=>s+x,0)-u.decisions.total,u.decisions.total);
 }
}
const result={races:rows.length,entries:entryCount,uniqueRaceIds:rows.length,allConfigurationReferencesResolve:true,allMassBalanceAndPaceChecksPass:true,maxPaceSecondsError:maxPaceError,maxDamageTelescopingError:maxDamageError};
await writeFile(root+'evidence/'+(directory==='supplement'?'supplement-':'')+'dataset-validation.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
