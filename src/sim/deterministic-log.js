// Deterministic evaluation of ln(x) for the existing exponential incident clock.
// Range reduction uses exact powers of two; the atanh identity converges with
// |z| <= 1/3. Forty terms put truncation below double precision. These are
// mathematical constants/series terms, not gameplay balance coefficients.
export const INCIDENT_CLOCK_VERSION='m2e-exponential-clock-v1';
export function deterministicLog(x){
 if(!Number.isFinite(x)||x<=0)throw Error('Deterministic log requires positive finite input');
 let exponent=0,m=x;
 while(m<1){m*=2;exponent--;}
 while(m>=2){m/=2;exponent++;}
 const z=(m-1)/(m+1),square=z*z;let term=z,sum=0;
 for(let n=1;n<=79;n+=2){sum+=term/n;term*=square;}
 return 2*sum+exponent*0.6931471805599453;
}
