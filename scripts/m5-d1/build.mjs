import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
// Reuse the accepted standalone builder without editing or overwriting M4.
// Its integrity guards, embedded worker/viewer/practice and offline checks remain.
const prior=await readFile('dist/Blood-and-Thunder-E5-D-M4-Playable.html');if(createHash('sha256').update(prior).digest('hex')!=='d77e49e40457c5de0255e3c95779941bec67023a4760248a69760f60b7a8d60c')throw Error('Accepted M4 artifact changed');
const source=await readFile('scripts/e5-d/m4/build.mjs','utf8');
const adapted=source.replaceAll("from '../","from '../e5-d/")
 .replaceAll("from '../../e5-c/","from '../e5-c/")
 .replaceAll("from '../../p2/","from '../p2/")
 .replaceAll("BNT_M4_BUILD:'true'","BNT_M5_BUILD:'true',BNT_M4_BUILD:'true'")
 .replaceAll('dist/Blood-and-Thunder-E5-D-M4-Playable.html','dist/Blood-and-Thunder-M5-D1-Playable.html')
 .replaceAll('E5-D M4 —','M5 Delivery 1 —');
await writeFile('scripts/m5-d1/build.generated.mjs',adapted);
await import('./build.generated.mjs');
