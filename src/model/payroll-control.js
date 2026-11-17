import {clamp} from '../core/determinism.js';
const MULTIPLIERS=Object.freeze({Current:1,Overdue:1,Delinquent:.95,Critical:.9,Default:.85});
export function validatePayrollContext(context){
 if(context===undefined)return;
 const fields=['version','rulesVersion','careerId','championshipId','status','multiplier'];
 if(!context||typeof context!=='object'||Array.isArray(context)||Object.keys(context).length!==fields.length||fields.some(k=>!Object.hasOwn(context,k))||context.version!==1||context.rulesVersion!=='payroll-control-v1'||!Object.hasOwn(MULTIPLIERS,context.status)||context.multiplier!==MULTIPLIERS[context.status]||!['careerId','championshipId'].every(k=>typeof context[k]==='string'&&/^[a-zA-Z0-9_-]{1,128}$/.test(context[k])))throw Error('Invalid versioned payroll racing context');
}
export function applyPayrollControl(derived,context){validatePayrollContext(context);if(context===undefined||context.multiplier===1)return derived;return {...derived,control:clamp(derived.control*context.multiplier,0,100)};}
