// Exact decimal rationals. Convert the canonical decimal spelling, never round native inputs.
export function rational(value){
  if(typeof value!=='number'||!Number.isFinite(value))throw Error('Expected finite decimal number');
  const [mantissa,exp='0']=String(value).toLowerCase().split('e'),negative=mantissa.startsWith('-');
  const unsigned=mantissa.replace('-',''),[a,b='']=unsigned.split('.');let n=BigInt(a+b)*(negative?-1n:1n),d=10n**BigInt(b.length),e=Number(exp);
  if(e>=0)n*=10n**BigInt(e);else d*=10n**BigInt(-e);return {n,d};
}
const R=x=>typeof x==='number'?rational(x):x;
export function add(a,b){a=R(a);b=R(b);return {n:a.n*b.d+b.n*a.d,d:a.d*b.d};}
export function mul(a,b){a=R(a);b=R(b);return {n:a.n*b.n,d:a.d*b.d};}
export function div(a,b){a=R(a);b=R(b);if(b.n===0n)throw Error('Zero divisor');return {n:a.n*b.d,d:a.d*b.n};}
export function compare(a,b){a=R(a);b=R(b);const n=a.n*b.d-b.n*a.d;return n<0n?-1:n>0n?1:0;}
export function rounded(value,mode='half-up',unit=1){const x=div(value,unit);if(x.n<0n||x.d<=0n)throw Error('Economic rounding requires nonnegative amount');let n=x.n/x.d,rem=x.n%x.d;if((mode==='ceil'&&rem>0n)||(mode==='half-up'&&2n*rem>=x.d))n++;else if(!['floor','ceil','half-up'].includes(mode))throw Error('Unknown rounding mode');const result=n*BigInt(unit);if(result>BigInt(Number.MAX_SAFE_INTEGER))throw Error('Economic value exceeds safe integer');return Number(result);}
export function decimal(x){x=R(x);const sign=x.n<0n?'-':'';let n=x.n<0n?-x.n:x.n;const whole=n/x.d;let rem=n%x.d,tail='';for(let i=0;rem&&i<360;i++){rem*=10n;tail+=(rem/x.d).toString();rem%=x.d;}return Number(sign+whole.toString()+(tail?'.'+tail:''));}
export function mean(values){return div(values.reduce((s,v)=>add(s,v),rational(0)),values.length);}
export const qualityFromRatings=attributes=>add(0.85,mul(0.003,mean(Object.values(attributes))));
export const conditionFactor=health=>add(0.70,mul(0.003,health));
