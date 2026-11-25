import {writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';
import {createRace,step,digest} from '../../src/sim/race.js';
import * as accepted from '/workspace/bnt-m5-d2-baseline/src/sim/race.js';
import {prototypeRally} from '../../src/prototype/session.js';import {defaultRU} from '../../src/model/ru.js';
const cases=[['short-one','short-oval',1,'Pure'],['circuit-four','C01',4,'Pure'],['oval-eight','oval',8,'Combat'],['long-rally-eight',prototypeRally('long',991),8,'Combat']],rows=[];
for(const[name,course,count,format]of cases){const setup={seed:991,course,format,overrides:{laps:1},entrants:Array.from({length:count},(_,i)=>({ru:defaultRU('perf-'+i,55)}))};const measured=[];let checksum=null;
 for(const [label,engine]of [['accepted-D1',accepted],['M5-source',{createRace,step,digest}]]){const before=process.memoryUsage(),start=performance.now(),s=engine.createRace(setup),creationMs=performance.now()-start,first=performance.now();for(let i=0;i<100;i++)engine.step(s);const first100Ms=performance.now()-first;const rest=performance.now();while(['Ready','Running'].includes(s.status)&&s.tick<30000)engine.step(s);const totalRemainingMs=performance.now()-rest,actual=engine.digest(s);if(checksum)assert.equal(actual,checksum);else checksum=actual;measured.push({label,creationMs,first100Ms,totalRemainingMs,tick:s.tick,status:s.status,checksum:actual,heapBefore:before.heapUsed,heapAfter:process.memoryUsage().heapUsed,events:s.events.length});}
 rows.push({name,format,count,measured});console.log(name,measured.map(r=>({label:r.label,first100Ms:r.first100Ms,status:r.status,ticks:r.tick})));
}
await writeFile('/workspace/deliverables/bnt-m5-d2/evidence/native-performance.json',JSON.stringify({environment:process.version,rows,concurrentLoad:process.env.BNT_CONTROLLED_PERFORMANCE!=='1',exactParity:true},null,2));
