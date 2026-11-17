import {writeFileSync} from 'node:fs';import {gzipSync} from 'node:zlib';import {defaultRU} from '../../src/model/ru.js';import {createRace,step,capture,classification,digest} from '../../src/sim/race.js';import {verifyReplay} from '../../src/replay/replay.js';
const root='docs/phase2/dangerous-racing',rows=[],replays=[];
for(const context of ['healthyEqualSpeed','protectedClosing','exposedClosing','wornRivalClosing'])for(let seed=1;seed<=32;seed++)for(const action of ['none','attack','ram']){
 const a=defaultRU('A'),b=defaultRU('B');a.driver.combat=90;a.equipment.combat=60;b.driver.combat=25;b.driver.driving=25;
 if(context!=='healthyEqualSpeed'){a.chariot.protection=context==='exposedClosing'?10:90;a.chariot.durability=80;b.chariot.protection=10;}
 if(context==='wornRivalClosing')b.chariot.condition=20;
 const s=createRace({seed,format:'Combat',driverMode:'reference',checkpointInterval:10000,entrants:[{ru:a,lane:0,q:-2.5,speed:18},{ru:b,lane:1,q:-2.5,speed:context==='healthyEqualSpeed'?18:8}]});
 while(!['Ended','Stalled','Error'].includes(s.status)&&s.tick<30000)step(s,s.tick===0&&action!=='none'?[{type:'attack',id:'A',target:'B',action}]:[]);
 const record=capture(s);rows.push({id:`NI-${context}-${seed}-${action}`,name:context,seed,action,diagnosticMovingStart:true,setup:s.setup,status:s.status,checksum:digest(s),official:classification(s),events:s.events.filter(e=>['ATTACK','DAMAGE','CONTACT','CONTROL_CHANGED','RU_RETIRED','WRECK_CREATED','WRECK_IMPACT','INCIDENT','INCIDENT_IMPACT'].includes(e.type)),final:s.entrants.map(r=>({id:r.id,physical:r.physical,control:r.control,ru:r.ru}))});
 if(context==='wornRivalClosing'&&seed===1){verifyReplay(record);writeFileSync(root+'/evidence/'+rows.at(-1).id+'.replay.json.gz',gzipSync(JSON.stringify(record)));replays.push({id:rows.at(-1).id,checksum:record.checksum});}
}
writeFileSync(root+'/mechanisms/ram-niches.json.gz',gzipSync(JSON.stringify(rows)));writeFileSync(root+'/evidence/niche-replays.json',JSON.stringify(replays,null,2));console.log(JSON.stringify({diagnosticNicheRaces:rows.length,ended:rows.filter(r=>r.status==='Ended').length,stalled:rows.filter(r=>r.status==='Stalled').length,errors:rows.filter(r=>r.status==='Error').length}));
