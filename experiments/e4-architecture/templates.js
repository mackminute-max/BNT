// EXPERIMENT ONLY. Intern exact node templates, retain original alias indices in
// each snapshot. No merging distinct object identities, dropped events or hashes.
import{graphPack,graphUnpack,compress,decompress}from'./graph-primitives.js';import{digestText}from'./pages.js';
export class TemplateGraphs {
 constructor(){this.dictionary=new Map();this.chunks=[];this.count=0;this.rawCacheBytes=0;this.storedBytes=0;}
 async encode(state){const begin=performance.now(),graph=graphPack(state),graphMs=performance.now()-begin,added=[],layout=[];
  for(const node of graph.wire.nodes){const refs=[],rows=node[2].map(([k,v,...flags])=>{if(v&&typeof v==='object'&&Object.hasOwn(v,'r')){const slot=refs.length;refs.push(v.r);return [k,{slot},...flags];}return [k,v,...flags];}),text=JSON.stringify([node[0],node[1],rows]);let id=this.dictionary.get(text);if(id===undefined){if(this.count>=200000||this.rawCacheBytes+text.length*2>64*1024*1024)throw Error('Experimental dictionary capacity; no eviction of authoritative data');id=this.count++;this.dictionary.set(text,id);this.rawCacheBytes+=text.length*2;added.push(text);}layout.push([id,refs]);}
  if(added.length){const text=JSON.stringify(added),data=compress(text),hash=await digestText(text),chunk={start:this.count-added.length,count:added.length,hash,data};this.storedBytes+=JSON.stringify(chunk).length;if(this.storedBytes>64*1024*1024)throw Error('Experimental stored capacity');this.chunks.push(chunk);}
  const text=JSON.stringify({kind:'BNT-EXPERIMENT-templates',version:1,templateCount:this.count,root:graph.wire.root,nodes:layout}),manifest={hash:await digestText(text),data:compress(text)};
  return {manifest,prepareMs:performance.now()-begin,graphMs,addedTemplates:added.length,nodeCount:layout.length};
 }
 async decode(manifest){const text=decompress(manifest.data);if(await digestText(text)!==manifest.hash)throw Error('Corrupt layout');const m=JSON.parse(text);if(m.kind!=='BNT-EXPERIMENT-templates'||m.version!==1||!Number.isInteger(m.templateCount)||m.templateCount>200000||!Array.isArray(m.nodes)||m.nodes.length>200000)throw Error('Invalid layout');const templates=[];for(const c of this.chunks){if(c.start>=m.templateCount)break;if(c.start!==templates.length)throw Error('Missing template chunk');const raw=decompress(c.data);if(await digestText(raw)!==c.hash)throw Error('Corrupt template chunk');const rows=JSON.parse(raw);if(rows.length!==c.count)throw Error('Template count mismatch');for(const t of rows)templates.push(JSON.parse(t));}if(templates.length<m.templateCount)throw Error('Missing templates');
  const nodes=m.nodes.map(([id,refs])=>{if(!Number.isInteger(id)||id<0||id>=m.templateCount||!Array.isArray(refs))throw Error('Invalid template reference');const n=templates[id];return[n[0],n[1],n[2].map(([k,v,...flags])=>[k,v&&typeof v==='object'&&Object.hasOwn(v,'slot')?{r:refs[v.slot]}:v,...flags])];});return graphUnpack({version:1,root:m.root,nodes});
 }
 bytes(){return JSON.stringify(this.chunks).length;}
 evictCache(){this.dictionary.clear();this.rawCacheBytes=0;}
 async rebuildCache(){this.dictionary.clear();this.rawCacheBytes=0;for(const c of this.chunks){const text=decompress(c.data);if(await digestText(text)!==c.hash)throw Error('Corrupt dictionary');for(const [i,t]of JSON.parse(text).entries()){if(this.rawCacheBytes+t.length*2>64*1024*1024)throw Error('Experimental cache capacity');this.dictionary.set(t,c.start+i);this.rawCacheBytes+=t.length*2;}}}
}
