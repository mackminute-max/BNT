import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const bundle=await build({entryPoints:['src/prototype/app.js'],bundle:true,format:'iife',platform:'browser',target:'es2020',write:false,legalComments:'none'});
const js=bundle.outputFiles[0].text.replaceAll('</script','<\\/script'),template=await readFile('src/prototype/index.html','utf8');
const html=template.replace('<!-- BUNDLE -->',`<script>${js}</script>`);
if(/<(?:script|link|img|iframe)\b[^>]*(?:src|href)\s*=\s*["'](?!data:|#)/i.test(html)||/\b(?:import\s*\(|fetch\s*\(|new\s+WebSocket\s*\()/m.test(js))throw Error('External runtime dependency');
await mkdir('dist',{recursive:true});await writeFile('dist/Blood-and-Thunder-P1-Playable.html',html);console.log(JSON.stringify({path:'dist/Blood-and-Thunder-P1-Playable.html',bytes:Buffer.byteLength(html),sha256:createHash('sha256').update(html).digest('hex')}));
