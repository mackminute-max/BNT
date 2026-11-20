import {freeze} from '../career/assets.js';
// Versioned prototype balance only. Native defaults / historical setups are unchanged.
export const PACING_VERSION='p1.1-endurance-v1';
export const pacingProfiles=freeze({
 legacy:{autonomous:{},tuning:{}},
 endurance:{autonomous:{fatigueRate:.32,recoveryRate:.7,exertionConserve:.15,exertionMaintain:.4,exertionPush:2.5,exertionSprint:4.5,recoveryThreshold:.25,utility:{pushFatigue:8,sprintFatigue:14,conserveFatigueBase:3,conserveStamina:8}},tuning:{impairment:.85,paceConserve:.75,pacePush:.98}},
});
export const fatigueDisplayRules=Object.freeze({working:20,fatigued:50,exhausted:80,trendEpsilon:1e-6});
export const meanFatigue=ru=>ru.beasts.reduce((sum,b)=>sum+b.fatigue,0)/ru.beasts.length;
export function fatigueDisplay(ru,previous=null){
 const fatigue=meanFatigue(ru),remaining=100-fatigue,delta=previous===null?0:fatigue-previous;
 const status=fatigue>=fatigueDisplayRules.exhausted?'Exhausted':fatigue>=fatigueDisplayRules.fatigued?'Fatigued':fatigue>=fatigueDisplayRules.working?'Working':'Fresh';
 return {fatigue,remaining,status,trend:Math.abs(delta)<=fatigueDisplayRules.trendEpsilon?'stable':delta>0?'increasing':'decreasing',individual:ru.beasts.map(b=>b.fatigue)};
}
