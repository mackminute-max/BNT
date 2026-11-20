import {freeze} from '../career/assets.js';
// Versioned prototype balance only. Native defaults / historical setups are unchanged.
export const PACING_VERSION='p1.3-tactical-v1';
const priorProfiles=freeze({
 legacy:{autonomous:{},tuning:{}},
 endurance:{autonomous:{fatigueRate:.32,recoveryRate:.7,exertionConserve:.15,exertionMaintain:.4,exertionPush:2.5,exertionSprint:4.5,recoveryThreshold:.25,utility:{pushFatigue:8,sprintFatigue:14,conserveFatigueBase:3,conserveStamina:8}},tuning:{impairment:.85,paceConserve:.75,pacePush:.98}},
});
export const competitiveProfile=freeze({autonomous:{...priorProfiles.endurance.autonomous,utility:{...priorProfiles.endurance.autonomous.utility,finishUrgency:1.5}},tuning:{...priorProfiles.endurance.tuning,beastExhaustionStart:.65,beastExhaustionStrength:.5}});
export const tacticalProfile=freeze({autonomous:{...competitiveProfile.autonomous,exertionMaintain:.6,exertionPush:2.8,exertionSprint:5,directiveAuthority:1,obedienceDisciplineCeiling:30,obedienceResistanceThreshold:80,accelerationFatiguePerSpeed:.08,weaponStrainCost:.3,ramStrainCost:.15,ramFatigueCost:.35},tuning:{...competitiveProfile.tuning,beastExhaustionStrength:.65}});
export const pacingProfiles=freeze({...priorProfiles,competitive:competitiveProfile,tactical:tacticalProfile});
export const fatigueDisplayRules=Object.freeze({working:20,fatigued:50,exhausted:80,trendEpsilon:1e-6});
export const meanFatigue=ru=>ru.beasts.reduce((sum,b)=>sum+b.fatigue,0)/ru.beasts.length;
export function fatigueDisplay(ru,previous=null){
 const fatigue=meanFatigue(ru),remaining=100-fatigue,delta=previous===null?0:fatigue-previous;
 const status=fatigue>=fatigueDisplayRules.exhausted?'Exhausted':fatigue>=fatigueDisplayRules.fatigued?'Fatigued':fatigue>=fatigueDisplayRules.working?'Working':'Fresh';
 return {fatigue,remaining,status,trend:Math.abs(delta)<=fatigueDisplayRules.trendEpsilon?'stable':delta>0?'increasing':'decreasing',individual:ru.beasts.map(b=>b.fatigue)};
}
