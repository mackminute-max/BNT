import {canonical} from '../../core/determinism.js';
import {sha256} from '../../career/economy/fingerprint.js';
import {exact} from '../../career/legacy-state.js';
export const MAX_CHECKPOINT_BYTES=8*1024*1024;
export const wireHash=x=>sha256(canonical(x));
function graphPack(root){
  const nodes=[],seen=new Map(),active=new Set();
  function visit(x,depth=0){
    if(depth>128)throw Error('Checkpoint nesting limit');
    if(x===undefined)return {s:'undefined'};
    if(typeof x==='number'){
      if(Number.isNaN(x))throw Error('NaN cannot be checkpointed');
      if(!Number.isFinite(x))return {s:x===Infinity?'Infinity':'-Infinity'};
      if(Object.is(x,-0))return {s:'-0'};
    }
    if(x===null||['string','boolean','number'].includes(typeof x))return x;
    if(typeof x!=='object'||![Object.prototype,null,Array.prototype].includes(Object.getPrototypeOf(x)))throw Error('Unsupported checkpoint object');
    if(active.has(x))throw Error('Cyclic checkpoint');
    if(seen.has(x))return {r:seen.get(x)};
    const index=nodes.length;if(index>=200000)throw Error('Checkpoint node limit');seen.set(x,index);active.add(x);
    const n=[Array.isArray(x)?1:0,Object.isExtensible(x)?1:0,[]];nodes.push(n);
    for(const k of Object.getOwnPropertyNames(x)){
      if(['__proto__','constructor','prototype'].includes(k))throw Error('Unsafe checkpoint key');
      const d=Object.getOwnPropertyDescriptor(x,k);if(!Object.hasOwn(d,'value'))throw Error('Checkpoint accessors unsupported');
      const flags=(d.writable?4:0)|(d.enumerable?2:0)|(d.configurable?1:0),row=[k,visit(d.value,depth+1)];if(flags!==7)row.push(flags);n[2].push(row);
    }
    if(Object.getOwnPropertySymbols(x).length)throw Error('Checkpoint symbols unsupported');active.delete(x);return {r:index};
  }
  const wire={version:1,root:visit(root),nodes};if(new TextEncoder().encode(JSON.stringify(wire)).length>32*1024*1024)throw Error('Decoded checkpoint graph exceeds 32 MiB');return wire;
}
function graphUnpack(wire){
  exact(wire,['version','root','nodes'],'checkpoint codec');
  if(wire.version!==1||!Array.isArray(wire.nodes)||wire.nodes.length>200000||new TextEncoder().encode(JSON.stringify(wire)).length>32*1024*1024)throw Error('Unsupported/oversized checkpoint codec');
  const values=wire.nodes.map(n=>{if(!Array.isArray(n)||n.length!==3||![0,1].includes(n[0])||![0,1].includes(n[1])||!Array.isArray(n[2]))throw Error('Invalid codec node');return n[0]?[]:{};});
  function token(t){
    if(t===null||['number','string','boolean'].includes(typeof t)){if(typeof t==='number'&&!Number.isFinite(t))throw Error('Invalid numeric token');return t;}
    if(t&&Object.hasOwn(t,'r')){exact(t,['r']);if(!Number.isInteger(t.r)||t.r<0||t.r>=values.length)throw Error('Invalid checkpoint reference');return values[t.r];}
    exact(t,['s']);if(!['undefined','Infinity','-Infinity','-0'].includes(t.s))throw Error('Invalid checkpoint sentinel');return {undefined:undefined,Infinity:Infinity,'-Infinity':-Infinity,'-0':-0}[t.s];
  }
  wire.nodes.forEach((n,i)=>{
    const keys=new Set();for(const row of n[2]){
      if(!Array.isArray(row)||![2,3].includes(row.length))throw Error('Invalid property encoding');const[k,v,flags=7]=row;
      if(typeof k!=='string'||keys.has(k)||['__proto__','constructor','prototype'].includes(k)||!Number.isInteger(flags)||flags<0||flags>7)throw Error('Invalid property descriptor');keys.add(k);
      Object.defineProperty(values[i],k,{value:token(v),writable:!!(flags&4),enumerable:!!(flags&2),configurable:!!(flags&1)});
    }
    if(!n[1])Object.preventExtensions(values[i]);
  });
  const result=token(wire.root);
  if(JSON.stringify(graphPack(result))!==JSON.stringify(wire))throw Error('Noncanonical checkpoint graph');return result;
}
export const sealWire=value=>({value,hash:wireHash(value)});
export function unsealWire(s){exact(s,['value','hash']);if(typeof s.hash!=='string'||s.hash!==wireHash(s.value))throw Error('Checkpoint integrity mismatch');return s.value;}

// Fixed 16-bit LZW transport. The serialized 8 MiB limit is unchanged; decoded
// graph bytes are bounded at 32 MiB to reject decompression bombs. No dependency.
function compress(text){
  const bytes=new TextEncoder().encode(text);if(bytes.length>32*1024*1024)throw Error('Decoded checkpoint exceeds 32 MiB');
  // Prefix-code/byte pairs are exact LZW dictionary identities. Numeric keys
  // avoid allocating a new phrase string for every input byte. Code assignment,
  // reset markers and little-endian transport bytes remain lzw16-v1 unchanged.
  const dictionary=new Map(),codes=[];let next=257,word=bytes.length?bytes[0]:-1;
  for(let i=1;i<bytes.length;i++){
    const c=bytes[i],key=word*256+c,found=dictionary.get(key);
    if(found!==undefined){word=found;continue;}
    codes.push(word);
    if(next<65536)dictionary.set(key,next++);else{codes.push(256);dictionary.clear();next=257;}
    word=c;
  }
  if(word!==-1)codes.push(word);
  const packed=new Uint8Array(codes.length*2);
  for(let i=0;i<codes.length;i++){packed[i*2]=codes[i]&255;packed[i*2+1]=codes[i]>>>8;}
  let binary='';for(let i=0;i<packed.length;i+=8192)binary+=String.fromCharCode(...packed.subarray(i,i+8192));
  return {codec:'lzw16-v1',plainBytes:bytes.length,codes:codes.length,data:btoa(binary)};
}
function decompress(x){
  exact(x,['codec','plainBytes','codes','data']);if(x.codec!=='lzw16-v1'||!Number.isInteger(x.plainBytes)||x.plainBytes<0||x.plainBytes>32*1024*1024||!Number.isInteger(x.codes)||x.codes<0||x.codes>MAX_CHECKPOINT_BYTES||typeof x.data!=='string'||x.data.length>MAX_CHECKPOINT_BYTES)throw Error('Invalid compressed checkpoint bounds');
  const bytes=Uint8Array.from(atob(x.data),c=>c.charCodeAt(0));if(bytes.length!==Math.ceil(x.codes*16/8))throw Error('Truncated checkpoint compression');
  let dictionary,next;const reset=()=>{dictionary=Array.from({length:256},(_,i)=>String.fromCharCode(i));next=257;};reset();
  const result=new Uint8Array(x.plainBytes);let pos=0,word='';
  for(let i=0;i<x.codes;i++){const code=bytes[i*2]|(bytes[i*2+1]<<8);if(code===256){reset();word='';continue;}const entry=dictionary[code]??(code===next&&word?word+word[0]:null);if(entry===null||pos+entry.length>result.length)throw Error('Invalid compressed checkpoint code');for(let j=0;j<entry.length;j++)result[pos++]=entry.charCodeAt(j);if(word&&next<65536)dictionary[next++]=word+entry[0];word=entry;}
  if(pos!==result.length)throw Error('Truncated decoded checkpoint');return new TextDecoder('utf-8',{fatal:true}).decode(result);
}
export function pack(root){const wire={version:1,transport:compress(JSON.stringify(graphPack(root)))};if(new TextEncoder().encode(JSON.stringify(wire)).length>MAX_CHECKPOINT_BYTES)throw Error('Checkpoint exceeds 8 MiB');return wire;}
export function unpack(wire){exact(wire,['version','transport']);if(wire.version!==1)throw Error('Unsupported checkpoint codec');const text=decompress(wire.transport),graph=JSON.parse(text);return graphUnpack(graph);}
