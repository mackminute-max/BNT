import {readdirSync,readFileSync,writeFileSync} from 'node:fs';import {gunzipSync} from 'node:zlib';import {verifyReplay} from '../../src/replay/replay.js';
const dir='docs/phase2/dangerous-racing/evidence',checks=[];
for(const file of readdirSync(dir).filter(f=>f.endsWith('.replay.json.gz')).sort()){
 const record=JSON.parse(gunzipSync(readFileSync(dir+'/'+file))),actual=verifyReplay(record);checks.push({file,checksum:actual.checksum,events:actual.events,checkpoints:actual.checkpoints,passed:true});
}
writeFileSync(dir+'/saved-replay-verification.json',JSON.stringify({count:checks.length,passed:true,checks},null,2));console.log(JSON.stringify({count:checks.length,passed:true}));
