// Execute original assertions, redirect only output evidence; never overwrite
// accepted P2.2 logs or change golden values. Temporary sibling retains imports.
import {readFile,writeFile,unlink,mkdir} from 'node:fs/promises';import {spawnSync} from 'node:child_process';
const out='/workspace/deliverables/bnt-e5-a1/evidence/existing';await mkdir(out,{recursive:true});const rows=[];
for(const name of ['references','layout-browser','interface-browser','browser-native','checkpoint-compat']){
 const original=await readFile(`scripts/p2-2/${name}.mjs`,'utf8'),source=original.replaceAll('/workspace/deliverables/bnt-p2-2/evidence',out),tmp=`scripts/e5-a1/.audit-${name}.mjs`;
 await writeFile(tmp,source);let result;try{result=spawnSync(process.execPath,[tmp],{encoding:'utf8',maxBuffer:8*1024*1024,timeout:240000});}finally{await unlink(tmp);}
 await writeFile(`${out}/${name}.log`,(result.stdout??'')+(result.stderr??''));rows.push({name,exit:result.status,signal:result.signal,error:result.error?.message??null});console.log(JSON.stringify(rows.at(-1)));
}
await writeFile(out+'/exits.json',JSON.stringify(rows,null,2));if(rows.some(r=>r.exit!==0))process.exitCode=1;
