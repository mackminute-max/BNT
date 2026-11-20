// P1.3 opt-in. No new personality fields or random draws.
export const obedienceRules=Object.freeze({version:'p1.3-directives-v1',weights:Object.freeze({independence:.45,aggression:.25,incaution:.15,impatience:.15})});
export function independence(personality){const w=obedienceRules.weights;return w.independence*(100-personality.tacticalDiscipline)+w.aggression*personality.aggression+w.incaution*(100-personality.caution)+w.impatience*(100-personality.patience);}
export function paceDirective(s,r,candidates){
 if(!s.autonomous.directiveAuthority)return null;
 const requested=({'Push the Pace':'Sprint','Conserve Strength':'Conserve'})[r.signs.active];if(!requested)return null;
 const base={version:obedienceRules.version,sign:r.signs.active,requested,score:independence(r.ru.driver.personality),selected:requested,decision:'Obeying',reason:'Active pace directive takes priority over ordinary utility'};
 if(r.status!=='Racing'||r.physical!=='Live')return {...base,decision:'Inapplicable',reason:'RU is not an active racer'};
 if(r.control==='Out of Control')return {...base,selected:'Conserve',decision:'Constrained',reason:'Native loss of control requires braking'};
 if(!(r.derived.acceleration>0)||!(r.derived.maxSpeed>0))return {...base,decision:'Constrained',reason:'Native derived capability cannot accelerate'};
 const p=r.ru.driver.personality,eligible=p.tacticalDiscipline<=(s.autonomous.obedienceDisciplineCeiling??30)&&base.score>=(s.autonomous.obedienceResistanceThreshold??80);
 if(eligible){const own=candidates.filter(x=>['Conserve','Maintain','Push','Sprint'].includes(x.action)).map(x=>({action:x.action,score:x.score-(x.terms.sign??0)-(x.terms.noise??0)})).sort((a,b)=>b.score-a.score||a.action.localeCompare(b.action))[0];if(own&&own.action!==requested)return {...base,selected:own.action,decision:'Resisting',reason:`Headstrong independence ${base.score.toFixed(1)}; tactical discipline ${p.tacticalDiscipline}; deterministic own utility selects ${own.action}`};}
 return base;
}
export function directiveCompliance(d){
 if(!d.directive)return null;
 if(d.directive.decision==='Inapplicable')return 'Inapplicable';
 if(d.directive.decision==='Constrained'||d.executionError||d.stressError||d.physicalOutcome?.pace.status==='Prevented'||d.physicalOutcome?.movement.status==='Blocked')return 'Constrained';
 return d.directive.decision==='Resisting'?'Resisting':d.effective?.pace===d.directive.requested?'Obeying':'Constrained';
}
