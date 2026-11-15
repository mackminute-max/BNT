import {writeFileSync} from 'node:fs';import {gzipSync} from 'node:zlib';import {createRace,step,capture} from '../../src/sim/race.js';
import {defaultRU} from '../../src/model/ru.js';import {profile} from './scenarios.mjs';import {diagnose} from './measure.mjs';
const rows=[];
for(const personality of ['aggressive','cautious'])for(const skill of [20,50,80])for(const protection of [10,90])for(const defending of [false,true])for(let seed=1;seed<=32;seed++){
 const entrants=['A','B','C'].map((id,i)=>{const ru=defaultRU(id);profile(ru,id==='C'?personality:'aggressive');if(id==='C'){for(const k of ['driving','beastHandling','combat','awareness','nerve'])ru.driver[k]=skill;ru.chariot.protection=protection;}else{ru.driver.combat=80;ru.equipment.combat=40;}return{ru,lane:[0,2,1][i],q:-.5};});
 const s=createRace({seed,format:'Combat',driverMode:'reference',entrants,checkpointInterval:10000});s.entrants[2].defending=defending;
 step(s,[{type:'attack',id:'A',target:'C',action:'attack'},{type:'attack',id:'B',target:'C',action:'attack'}]);const record=capture(s);
 rows.push({id:`DE-${personality}-${skill}-${protection}-${defending}-${seed}`,personality,skill,protection,defending,forcedDefenseState:defending,setup:s.setup,danger:diagnose(record),events:s.events.filter(e=>['REACTION','ATTACK','DAMAGE','CONTROL_CHANGED'].includes(e.type))});
}
writeFileSync('docs/phase2/dangerous-racing/mechanisms/defenses.json.gz',gzipSync(JSON.stringify(rows)));console.log(JSON.stringify({simultaneousGroups:rows.length,attacks:rows.reduce((n,r)=>n+r.danger.contests.length,0)}));
