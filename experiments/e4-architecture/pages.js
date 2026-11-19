// Isolated representation experiment; not a career/save/checkpoint format.
import {graphPack,graphUnpack,compress,decompress} from './graph-primitives.js';
const utf8=new TextEncoder();
export async function digestText(text){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',utf8.encode(text))),b=>b.toString(16).padStart(2,'0')).join('');}
export class GraphPages {
 constructor({pageNodes=64}={}){if(!Number.isInteger(pageNodes)||pageNodes<1||pageNodes>512)throw Error('Invalid page size');this.pageNodes=pageNodes;this.blocks=new Map();this.hits=0;this.misses=0;this.retainedBytes=0;}
 async encode(state){
  const started=performance.now(),g=graphPack(state),graphMs=performance.now()-started,hashStart=performance.now(),pages=[],added=[];
  for(let i=0;i<g.wire.nodes.length;i+=this.pageNodes){const text=JSON.stringify(g.wire.nodes.slice(i,i+this.pageNodes)),id=await digestText(text);pages.push(id);if(this.blocks.has(id)){this.hits++;continue;}const payload=compress(text);const size=utf8.encode(JSON.stringify(payload)).length;if(this.blocks.size>=20000||this.retainedBytes+size>64*1024*1024)throw Error("Experimental archive capacity reached; no eviction");this.retainedBytes+=size;this.blocks.set(id,payload);added.push([id,payload]);this.misses++;}
  const manifest={kind:'BNT-EXPERIMENT-graph-pages',version:1,graphVersion:1,root:g.wire.root,nodeCount:g.wire.nodes.length,pageNodes:this.pageNodes,pages};
  return {manifest,added,graphMs,prepareMs:performance.now()-started,indexAndCompressMs:performance.now()-hashStart,legacyGraphBytes:g.bytes.length};
 }
 async decode(manifest){
  if(manifest.kind!=='BNT-EXPERIMENT-graph-pages'||manifest.version!==1||manifest.graphVersion!==1||!Number.isInteger(manifest.nodeCount)||manifest.nodeCount>200000||!Array.isArray(manifest.pages)||manifest.pages.length>200000)throw Error('Unsupported manifest');
  const nodes=[];let bytes=0;for(const id of manifest.pages){const block=this.blocks.get(id);if(!block)throw Error('Missing block');const text=decompress(block);bytes+=utf8.encode(text).length;if(bytes>32*1024*1024)throw Error('Decoded graph limit');if(await digestText(text)!==id)throw Error('Corrupt block');const page=JSON.parse(text);if(!Array.isArray(page)||page.length>manifest.pageNodes)throw Error('Invalid page');for(const n of page)nodes.push(n);}
  if(nodes.length!==manifest.nodeCount)throw Error('Missing/extra graph nodes');return graphUnpack({version:1,root:manifest.root,nodes});
 }
 bytes(){return utf8.encode(JSON.stringify([...this.blocks])).length;}
 clear(){this.blocks.clear();this.retainedBytes=0;}
}
// Byte-exact raw-record factoring uses the same trusted bytes but a different,
// experimental backup/container representation; does not prune original evidence.
export class RecordArchive {
 constructor(){this.blocks=new Map();this.bytes=0;}
 async encode(records){const refs=[];for(const[k,text]of records){const id=await digestText(text),old=this.blocks.get(id);if(old!==undefined&&old!==text)throw Error('Digest conflict');if(old===undefined){const size=utf8.encode(text).length;if(this.blocks.size>=20000||this.bytes+size>64*1024*1024)throw Error("Experimental archive capacity reached");this.bytes+=size;}this.blocks.set(id,text);refs.push([k,id]);}return refs;}
 async decode(refs){const out=[];for(const[k,id]of refs){const text=this.blocks.get(id);if(typeof text!=='string'||await digestText(text)!==id)throw Error('Missing/corrupt raw record');out.push([k,text]);}return out;}
}
