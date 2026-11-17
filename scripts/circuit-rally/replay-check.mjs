import {readFileSync,writeFileSync} from 'node:fs';import {gzipSync,gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
import {createRace,run,capture,classification} from '../../src/sim/race.js';import {verifyReplay} from '../../src/replay/replay.js';
const [mode,file]=process.argv.slice(2),root='docs/circuit-rally',record=JSON.parse(gunzipSync(readFileSync(file)));
if(mode==='baseline'){
 const s=run(createRace(record.setup)),refs=JSON.parse(readFileSync(root+'/baseline/references.json')),ref=refs.find(x=>x.format===s.format&&x.weather===s.weather),sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
 assert.equal(sha(s.events),sha(record.events));assert.deepEqual(s.rng,ref.rng);assert.deepEqual(classification(s),ref.official);
 const rec=capture(s),out=root+'/evidence/oval-'+file.split('/').at(-1);writeFileSync(out,gzipSync(JSON.stringify(rec)));console.log(JSON.stringify({file,ovalEventsIdentical:true,rngIdentical:true,officialIdentical:true,checksum:rec.checksum}));
}else{
 const actual=verifyReplay(record);console.log(JSON.stringify({file,replay:true,checksum:actual.checksum,events:actual.events}));
}
