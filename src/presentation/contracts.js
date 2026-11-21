const positivePair=x=>Array.isArray(x)&&x.length===2&&x.every(n=>Number.isSafeInteger(n)&&n>0&&n<=8192);
const finitePair=x=>Array.isArray(x)&&x.length===2&&x.every(Number.isFinite);
export function validateManifest(m){
 if(!m||m.kind!=='BNT-presentation-assets'||m.version!==1||typeof m.styleVersion!=='string'||!Array.isArray(m.assets)||m.assets.length>64)throw Error('Unsupported presentation manifest');
 const ids=new Map();for(const a of m.assets){if(!a||typeof a.id!=='string'||!/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*\.v[1-9][0-9]*$/.test(a.id)||ids.has(a.id))throw Error('Invalid or duplicate asset ID');ids.set(a.id,a);if(a.version!==1||!['builtin','png','svg'].includes(a.format)||a.status!=='temporary-proof')throw Error('Unsupported asset version/format/proof status');if(!a.license||!['author','source','licenseId','notice'].every(k=>typeof a.license[k]==='string'&&a.license[k].length>0))throw Error('Asset source/license metadata required');if(a.format==='builtin')continue;
 if(!positivePair(a.sourceSize)||!positivePair(a.runtimeSize)||a.runtimeSize.some(n=>n>2048)||!Array.isArray(a.frames)||!a.frames.length)throw Error('Invalid asset dimensions/frames');if(!/^[a-f0-9]{64}$/.test(a.sha256??'')||typeof a.path!=='string'||a.path.includes('\\')||a.path.startsWith('/')||a.path.split('/').some(x=>x==='..'||x===''))throw Error('Invalid asset path/hash');
 for(const frame of a.frames){const r=frame.rect;if(!Array.isArray(r)||r.length!==4||!r.every(Number.isSafeInteger)||r[0]<0||r[1]<0||r[2]<=0||r[3]<=0||r[0]+r[2]>a.runtimeSize[0]||r[1]+r[3]>a.runtimeSize[1]||!Number.isFinite(frame.durationMs)||frame.durationMs<0)throw Error('Invalid frame rectangle/timing');}
 if(!finitePair(a.anchor)||a.anchor.some((n,i)=>n<0||n>a.frames[0].rect[i+2]))throw Error('Invalid anchor');
 if(a.visualBounds){const b=a.visualBounds;if(b.length!==4||!b.every(Number.isFinite)||b[0]<0||b[1]<0||b[2]<=0||b[3]<=0||b[0]+b[2]>a.frames[0].rect[2]||b[1]+b[3]>a.frames[0].rect[3])throw Error('Invalid visual bounds');}
 if(a.anchors&&!Object.values(a.anchors).every(p=>finitePair(p)&&p.every((n,i)=>n>=0&&n<=a.runtimeSize[i])))throw Error('Invalid attachment anchor');if(!Array.isArray(a.paletteRoles)||a.paletteRoles.some(x=>!['ink','paper','primary','secondary','shadow','highlight'].includes(x)))throw Error('Invalid palette role');
 }
 for(const a of m.assets){const seen=new Set([a.id]);let next=a.fallback;while(next){if(!ids.has(next)||seen.has(next))throw Error('Missing/cyclic fallback '+a.id);seen.add(next);next=ids.get(next).fallback;}}
 return m;
}
