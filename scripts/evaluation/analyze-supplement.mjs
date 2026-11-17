import {readFile,writeFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {createReadStream} from 'node:fs';
import {createGunzip} from 'node:zlib';
import {createInterface} from 'node:readline';
import {paired,describe,mean} from './statistics.mjs';
const path='docs/phase2/supplement/',rows=gunzipSync(await readFile(path+'races.jsonl.gz')).toString().trim().split('\n').map(JSON.parse).sort((a,b)=>a.id.localeCompare(b.id));
const execution=JSON.parse(await readFile(path+'execution.json','utf8')),byId=new Map(rows.map(r=>[r.id,r])),attacks=new Map();
for(const r of rows)for(const u of r.ru)u.combatDamageDealt=0;
const input=createInterface({input:createReadStream(path+'events.jsonl.gz').pipe(createGunzip()),crlfDelay:Infinity});
for await(const line of input){const e=JSON.parse(line),x=e.effects;if(e.type==='ATTACK')attacks.set(e.raceId+':'+x.attackId,x.attacker);
 if(e.type==='DAMAGE'&&['attack','ram'].includes(x.kind)){const id=[x.parentId,x.contactId].find(x=>x?.startsWith('attack:'));const attacker=attacks.get(e.raceId+':'+id);if(attacker&&e.participants[0]!==attacker)byId.get(e.raceId).ru.find(r=>r.id===attacker).combatDamageDealt+=x.amount;}
}
const player=r=>r.ru.find(u=>u.id===r.playerId),pace=(u,p)=>u.competitiveSeconds>0?(u.paceSeconds[p]??0)/u.competitiveSeconds:null;
const metrics={position:r=>player(r).finishPlace,time:r=>player(r).officialTime,fatigue:r=>player(r).finishFatigue?mean(player(r).finishFatigue):null,
 damage:r=>player(r).damage,combatDamageDealt:r=>player(r).combatDamageDealt,attacks:r=>player(r).attacks,overtakes:r=>player(r).overtakes,laneSuccesses:r=>player(r).laneSuccesses,blockedSeconds:r=>player(r).blockedSeconds,
 fastPaceShare:r=>(pace(player(r),'Push')??0)+(pace(player(r),'Sprint')??0)};
const analysis={n:rows.length,countsByFormat:execution.countsByFormat,excluded:rows.filter(r=>r.bounded||r.status==='Error').map(r=>r.id),control:{},signs:{}};
for(const format of ['Pure','Combat']){
 const a=rows.filter(r=>r.format===format&&!r.bounded&&r.status!=='Error'),control=a.filter(r=>r.arm==='none');
 analysis.holdVersusPush??={};analysis.holdVersusPush[format]=paired(a.filter(r=>r.arm==='Hold Position'),a.filter(r=>r.arm==='Push the Pace'),metrics,{label:'rear-Hold-versus-Push-'+format});
 analysis.control[format]={n:control.length,position:describe(control.map(r=>player(r).finishPlace)),time:describe(control.map(r=>player(r).officialTime))};
 analysis.signs[format]=[...new Set(a.filter(r=>r.arm!=='none').map(r=>r.arm))].map(arm=>{
 const group=a.filter(r=>r.arm===arm),compliance={};for(const r of group)for(const [k,v]of Object.entries(player(r).signCompliance))compliance[k]=(compliance[k]??0)+v;
 const total=Object.values(compliance).reduce((a,b)=>a+b,0),applicable=total-(compliance.Inapplicable??0)-(compliance.Unresolved??0);
 return{arm,n:group.length,compliance,fullComplianceRate:applicable?(compliance.Followed??0)/applicable:null,inapplicableRate:total?(compliance.Inapplicable??0)/total:null,
 comparison:paired(group,control,metrics,{label:'rear-'+format+arm})};
 });
}
await writeFile(path+'analysis.json',JSON.stringify(analysis,null,2));console.log(JSON.stringify({n:analysis.n,counts:analysis.countsByFormat,excluded:analysis.excluded}));
