export class BoundedCache{
 constructor({maxBytes=24*1024*1024,maxEntries=32,dispose=value=>value?.close?.()}={}){if(!Number.isSafeInteger(maxBytes)||maxBytes<1||!Number.isSafeInteger(maxEntries)||maxEntries<1)throw Error('Invalid cache bounds');this.maxBytes=maxBytes;this.maxEntries=maxEntries;this.dispose=dispose;this.entries=new Map();this.bytes=0;this.hits=0;this.misses=0;this.evictions=0;this.peakBytes=0;}
 get(key){const x=this.entries.get(key);if(!x){this.misses++;return null;}this.hits++;this.entries.delete(key);this.entries.set(key,x);return x.value;}
 set(key,value,bytes){if(!Number.isSafeInteger(bytes)||bytes<0)throw Error('Invalid decoded byte estimate');if(bytes>this.maxBytes){this.dispose(value);return null;}if(this.entries.has(key))this.remove(key);while(this.entries.size>=this.maxEntries||this.bytes+bytes>this.maxBytes)this.remove(this.entries.keys().next().value);this.entries.set(key,{value,bytes});this.bytes+=bytes;this.peakBytes=Math.max(this.bytes,this.peakBytes);return value;}
 remove(key){const x=this.entries.get(key);if(!x)return;this.entries.delete(key);this.bytes-=x.bytes;this.evictions++;this.dispose(x.value);}
 clear(){for(const k of this.entries.keys())this.remove(k);}
 stats(){return {entries:this.entries.size,bytes:this.bytes,peakBytes:this.peakBytes,hits:this.hits,misses:this.misses,evictions:this.evictions,maxBytes:this.maxBytes,maxEntries:this.maxEntries};}
}
export function canvasSurface(width,height){const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(width));c.height=Math.max(1,Math.ceil(height));return c;}
export function disposeSurface(value){if(value?.close)value.close();else if(value?.getContext){value.width=0;value.height=0;}}
