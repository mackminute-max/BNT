import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {PROVISIONAL_CONTENT} from '../../../src/management/content.js';
export async function compilePresentation(){
 const read=async f=>{const j=JSON.parse(await readFile('content/e5-d/m3-bc/'+f,'utf8'));assert.equal(j.importable,false);return j.records;};
 const identities=await read('RECRUITMENT_IDENTITIES.json'),radio=await read('COMMENTARY_TEMPLATES.json'),special=await read('COMMENTARY_SPECIAL_PATH.json');
 assert.equal(identities.length,23);assert.equal(new Set(identities.map(x=>x.sourceOfferId)).size,23);assert.deepEqual(identities.map(x=>x.sourceOfferId).sort(),PROVISIONAL_CONTENT.map(x=>x.id).sort());
 for(const row of identities){const n=PROVISIONAL_CONTENT.find(x=>x.id===row.sourceOfferId);assert.equal(row.source_name,n.name);assert.equal(row.category,n.category);assert.equal(row.presentation_identity.name,n.name);}
 const native=await readFile('src/reporting/commentary.js','utf8'),keys=[...native.split('const priority')[0].matchAll(/^  ([A-Z_]+):/gm)].map(x=>x[1]);assert.equal(keys.length,23);assert.deepEqual(radio.map(x=>x.key).sort(),keys.sort());assert.equal(special.length,1);assert.equal(special[0].key,'DIRECTIVE_RESISTANCE');assert.equal(special[0].native_event_type,'AI_DECISION');assert.equal(special[0].variants.length,1);
 for(const r of [...radio,...special]){assert.ok(r.variants.length>0);assert.equal(new Set(r.allowed_tokens).size,r.allowed_tokens.length);for(const t of r.variants){assert.equal(typeof t,'string');for(const x of t.matchAll(/\{([a-z0-9_]+)\}/g))assert.ok(r.allowed_tokens.includes(x[1]),r.key+':'+x[1]);}}
 const data={identities:identities.map(x=>({sourceOfferId:x.sourceOfferId,presentation_identity:x.presentation_identity})),radio:radio.map(x=>({key:x.key,variants:x.variants,allowed_tokens:x.allowed_tokens})),special:special.map(x=>({key:x.key,variants:x.variants,allowed_tokens:x.allowed_tokens}))};
 const digest=createHash('sha256').update(JSON.stringify(data.identities)).digest('hex');
 const output='// Reviewed display-only whitelist. No runtime JSON importer.\nexport const PACK_DIGEST='+JSON.stringify(digest)+';\nexport const PACK_VERSION="m3-b-identities-v1";\nexport const DATA='+JSON.stringify(data)+';\n';
 await writeFile('src/presentation/content/m3-bc-data.js',output);return {identities:23,ordinary:22,special:1,identityPackDigest:digest};
}
