// Recreate immutable historical inputs without checking out or changing this tree.
import {execFileSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const out='/workspace/deliverables/bnt-p2/evidence';
for(const [sha,path] of [['04df5efba874b5889bb1c8e8e6920918c8df00e1','/tmp/bnt-p2-reference'],['3b0d043d0ca3b8e06bd0894ebff37d89be76e97e','/tmp/bnt-p15-reference']]){
 await mkdir(path,{recursive:true});
 const archive=execFileSync('git',['archive',sha,'src','package.json'],{maxBuffer:32*1024*1024});
 execFileSync('tar',['-x','-C',path],{input:archive});
}
await mkdir(out+'/baseline',{recursive:true});
await writeFile(out+'/baseline/P1.5-reference.html',execFileSync('git',['show','04df5ef:dist/Blood-and-Thunder-P1.5-Playable.html'],{maxBuffer:4*1024*1024}));
console.log('Frozen P1.5 HTML and P1.4 native source prepared; owner saves untouched. Benchmark fixture generation remains scripts/p1-5/fixtures.mjs.');
