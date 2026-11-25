import {sha256} from '../../career/economy/fingerprint.js';
// Private exact-text cache, never a digest/token supplied by the caller. A body
// is still read from IndexedDB on every validation boundary, so missing/corrupt
// storage remains detectable even after a warm read. Bounded by UTF-16 bytes.
export function exactByteHasher({maxBytes=16*1024*1024,maxEntries=128}={}){
 const entries=new Map();let bytes=0,hits=0,misses=0;
 return {hash(text,{cache=true}={}){if(typeof text!=='string')throw Error('Expected immutable text');const hit=cache?entries.get(text):undefined;if(hit!==undefined){entries.delete(text);entries.set(text,hit);hits++;return hit;}misses++;const hash=sha256(text),size=text.length*2;if(cache&&bytes+size<=maxBytes&&entries.size<maxEntries){entries.set(text,hash);bytes+=size;}return hash;},clear(){entries.clear();bytes=0;},stats(){return {bytes,entries:entries.size,hits,misses,maxBytes,maxEntries};}};
}
