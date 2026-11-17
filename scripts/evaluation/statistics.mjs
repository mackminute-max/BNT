// Analysis-only statistics. No simulator RNG or balance state is used.
export const mean=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
export function quantile(values,p){if(!values.length)return null;const a=[...values].sort((x,y)=>x-y),t=(a.length-1)*p,i=Math.floor(t);return a[i]+(a[Math.min(a.length-1,i+1)]-a[i])*(t-i);}
export function describe(values){const a=values.filter(Number.isFinite),m=mean(a);return {n:a.length,mean:m,median:quantile(a,.5),sd:a.length>1?Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1)):null,p10:quantile(a,.1),p90:quantile(a,.9),p95:quantile(a,.95),min:a.length?Math.min(...a):null,max:a.length?Math.max(...a):null};}
function rng(seed){let x=seed>>>0||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296;};}
function labelSeed(text){let h=2166136261;for(const c of text)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function clustered(records,fn,label='metric',key=r=>r.seed,reps=1000){
 const groups=new Map();for(const r of records){const v=fn(r);if(!Number.isFinite(v))continue;const k=key(r);const g=groups.get(k)??{sum:0,n:0};g.sum+=v;g.n++;groups.set(k,g);}
 const a=[...groups.values()],random=rng(labelSeed(label)),samples=[];
 if(a.length>1)for(let b=0;b<reps;b++){let sum=0,n=0;for(let j=0;j<a.length;j++){const g=a[Math.floor(random()*a.length)];sum+=g.sum;n+=g.n;}samples.push(sum/n);}
 return {...describe(records.map(fn)),clusters:a.length,ci95:samples.length?[quantile(samples,.025),quantile(samples,.975)]:null,smallClusterSample:a.length<8,method:'seed-cluster bootstrap mean, 1000 resamples'};
}
export function wilson(k,n){if(!n)return null;const z=1.959963984540054,p=k/n,d=1+z*z/n,c=(p+z*z/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return[Math.max(0,c-h),Math.min(1,c+h)];}
export function paired(treatment,control,metrics,{key=r=>r.block,label='paired'}={}){
 const controls=new Map(control.map(r=>[key(r),r])),pairs=treatment.filter(r=>controls.has(key(r))).map(r=>({seed:r.seed,t:r,c:controls.get(key(r))}));
 return {pairs:pairs.length,uniqueSeeds:new Set(pairs.map(r=>r.seed)).size,metrics:Object.fromEntries(Object.entries(metrics).map(([name,fn])=>{
 const values=pairs.map(p=>{const t=fn(p.t),c=fn(p.c);return{seed:p.seed,delta:Number.isFinite(t)&&Number.isFinite(c)?t-c:null};});
 const stat=clustered(values,r=>r.delta,label+'-'+name);return[name,{...stat,dz:stat.sd>0?stat.mean/stat.sd:null}];
 }))};
}
