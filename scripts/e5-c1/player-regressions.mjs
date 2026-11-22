// Reuse the accepted general player assertions; change only artifact/evidence paths.
import {readFile,writeFile,unlink,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const out='/workspace/deliverables/bnt-e5-c1/evidence/player';await mkdir(out,{recursive:true});
const source=(await readFile('scripts/e5-c/browser.mjs','utf8')).replaceAll('/workspace/deliverables/bnt-e5-c/evidence',out).replaceAll('Blood-and-Thunder-E5-C-Playable.html','Blood-and-Thunder-E5-C1-Playable.html'),tmp='scripts/e5-c/.c1-player-regression.mjs';
await writeFile(tmp,source);let r;try{r=spawnSync(process.execPath,[tmp],{encoding:'utf8',timeout:240000,maxBuffer:8*1024*1024});}finally{await unlink(tmp);}
await writeFile(out+'/process.log',(r.stdout??'')+(r.stderr??''));await writeFile(out+'/exit.json',JSON.stringify({exit:r.status,signal:r.signal,error:r.error?.message??null}));console.log(JSON.stringify({exit:r.status}));if(r.status!==0)process.exitCode=1;
