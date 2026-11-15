import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {verifyReplay} from '../../src/replay/replay.js';
const directory='docs/combat-ai-refinement/evidence',checks=[];
for(const name of readdirSync(directory).filter(name=>name.endsWith('.replay.json.gz')).sort()){
 const record=JSON.parse(gunzipSync(readFileSync(directory+'/'+name)));
 const actual=verifyReplay(record);
 checks.push({name,checksum:actual.checksum,events:actual.events,passed:true});
}
writeFileSync(directory+'/saved-replay-readback.json',JSON.stringify({count:checks.length,checks},null,2));
console.log(JSON.stringify({count:checks.length,passed:true}));
