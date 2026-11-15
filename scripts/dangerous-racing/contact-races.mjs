import {readFileSync,writeFileSync} from 'node:fs';import {gzipSync,gunzipSync} from 'node:zlib';
import {createRace,step,capture,classification,digest} from '../../src/sim/race.js';import {verifyReplay} from '../../src/replay/replay.js';
const out='docs/phase2/dangerous-racing',panel=JSON.parse(gunzipSync(readFileSync(out+'/mechanisms/physical.json.gz'))),rows=[],replays=[];
for(const name of ['heavyIntoLight','lightIntoHeavy','closing20','strongAttacker'])for(let seed=1;seed<=8;seed++)for(const action of ['none','attack','ram']){
 const p=panel.find(r=>r.name===name&&r.seed===seed&&r.action===action),s=createRace(p.setup);while(!['Ended','Stalled','Error'].includes(s.status)&&s.tick<30000)step(s,s.tick===0&&action!=='none'?[{type:'attack',id:'A',target:'B',action}]:[]);
 rows.push({id:`CR-${name}-${seed}-${action}`,diagnosticMovingStart:true,name,seed,action,setup:s.setup,checksum:digest(s),status:s.status,time:s.time,official:classification(s),final:s.entrants.map(r=>({id:r.id,q:r.q,control:r.control,physical:r.physical,ru:r.ru,finishSnapshot:r.finishSnapshot})),events:s.events.filter(e=>['ATTACK','DAMAGE','CONTROL_CHANGED','RU_RETIRED','WRECK_CREATED','WRECK_IMPACT','INCIDENT','INCIDENT_IMPACT','RU_FINISHED'].includes(e.type))});
 if(seed===1&&name==='closing20'){const rec=capture(s);verifyReplay(rec);writeFileSync(`${out}/evidence/CR-${name}-${seed}-${action}.replay.json.gz`,gzipSync(JSON.stringify(rec)));replays.push({name,seed,action,checksum:rec.checksum});}
}
writeFileSync(out+'/mechanisms/contact-races.json.gz',gzipSync(JSON.stringify(rows)));writeFileSync(out+'/evidence/contact-race-replays.json',JSON.stringify(replays,null,2));console.log(JSON.stringify({movingStartDiagnosticRaces:rows.length,ended:rows.filter(r=>r.status==='Ended').length}));
