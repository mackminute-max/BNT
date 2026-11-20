import {readFile,writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';import {pacingTrial} from './pacing.mjs';
const out=process.env.BNT_P11_OUT??'/workspace/deliverables/bnt-p1-1/evidence',data=JSON.parse(await readFile(out+'/pacing.json','utf8')),repeated=[];
for(const course of ['short-oval','C01','rally-long']){const original=data.rows.find(r=>r.course===course&&r.profile==='endurance'&&r.strategy==='Push'&&r.endurance===30&&r.weather==='Clear'),again=pacingTrial(original);assert.equal(again.checksum,original.checksum);repeated.push({course,checksum:again.checksum,matched:true});}
for(const r of data.signs){assert.ok(r.signEvents.filter(e=>e.type==='SIGN_QUEUED').length<=3);assert.ok(r.signEvents.filter(e=>e.type==='SIGN_ACTIVATED').length<=r.signEvents.filter(e=>e.type==='SIGN_QUEUED').length);}
const find=(strategy,endurance,weather)=>data.rows.find(r=>r.profile==='endurance'&&r.course==='rally-long'&&r.strategy===strategy&&r.endurance===endurance&&r.weather===weather);
assert.ok(find('Maintain',30,'Clear').finishTime<find('Push',30,'Clear').finishTime);assert.ok(find('ConserveThenPush',30,'Clear').finishTime<find('Push',30,'Clear').finishTime);
const report={repeated,signBudgetChecks:data.signs.length,alwaysPushNotUniversal:true};await writeFile(out+'/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
