import {readFileSync,writeFileSync} from 'node:fs';import {gunzipSync,gzipSync} from 'node:zlib';import {pathToFileURL} from 'node:url';
export function conditionAtStop(ru,events){
 const sorted=events.filter(e=>e.participants.includes(ru.id)).sort((a,b)=>a.id-b.id),stop=sorted.find(e=>['RU_FINISHED','RU_RETIRED'].includes(e.type));
 const condition={driver:ru.driver.condition,chariot:ru.chariot.condition,...Object.fromEntries(ru.beasts.map((b,i)=>['beast:'+i,b.condition]))};
 for(const e of sorted){if(stop&&e.id>=stop.id)break;if(e.type==='DAMAGE'&&e.participants[0]===ru.id)condition[e.effects.component]=e.effects.after;}
 return {status:stop?.type==='RU_FINISHED'?'Finished':stop?.type==='RU_RETIRED'?'Retired':null,stopTime:stop?.time??null,stopEventId:stop?.id??null,condition};
}
if(import.meta.url===pathToFileURL(process.argv[1]).href){
 const root='docs/phase2/dangerous-racing',output=[];let sameTimePostStop=0;
 for(const dir of ['data','personality-control']){
  const rows=gunzipSync(readFileSync(root+'/'+dir+'/races.jsonl.gz')).toString().trim().split('\n').map(JSON.parse),configs=JSON.parse(gunzipSync(readFileSync(root+'/'+dir+'/configurations.json.gz'))),by=new Map();
  for(const line of gunzipSync(readFileSync(root+'/'+dir+'/events.jsonl.gz')).toString().trim().split('\n')){const e=JSON.parse(line),a=by.get(e.raceId)??[];a.push(e);by.set(e.raceId,a);}
  for(const r of rows)for(const u of configs[r.configId].setup.entrants){const events=by.get(r.id)??[],s=conditionAtStop(u.ru,events);sameTimePostStop+=events.filter(e=>e.type==='DAMAGE'&&e.participants[0]===u.ru.id&&e.time===s.stopTime&&e.id>s.stopEventId).length;output.push({dataset:dir,raceId:r.id,id:u.ru.id,...s});}
 }
 writeFileSync(root+'/competitive-stop-condition.jsonl.gz',gzipSync(output.map(r=>JSON.stringify(r)).join('\n')+'\n'));writeFileSync(root+'/evidence/finish-condition.json',JSON.stringify({entries:output.length,sameTimePostStopDamage:sameTimePostStop,method:'Emitted event-ID chronology, damage before actual finish/retirement event only'},null,2));console.log(JSON.stringify({entries:output.length,sameTimePostStopDamage:sameTimePostStop}));
}
