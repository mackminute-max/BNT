import {exact} from '../career/legacy-state.js';
export const coachingAxes=Object.freeze(['aggression','conservation','positioning','riskTolerance']);
export const coachingDefaults=Object.freeze({aggression:0.5,conservation:0.5,positioning:0.5,riskTolerance:0.5});
export function validateCoaching(c){if(c===undefined||c===null)return;exact(c,['version','axes','weights']);if(c.version!==1)throw Error('Unsupported coaching version');exact(c.axes,coachingAxes);exact(c.weights,coachingAxes);for(const k of coachingAxes)if(!Number.isFinite(c.axes[k])||c.axes[k]<-1||c.axes[k]>1||!Number.isFinite(c.weights[k])||c.weights[k]<0||c.weights[k]>2)throw Error('Coaching values outside bounded contract');}
export function coachingProfile(axes={}){const c={version:1,axes:Object.fromEntries(coachingAxes.map(k=>[k,axes[k]??0])),weights:{...coachingDefaults}};validateCoaching(c);return c;}
const preference={
 aggression:{attack:1,ram:1,defendCombat:-1,disengage:-1},
 conservation:{Conserve:1,Push:-1,Sprint:-1},
 positioning:{inward:1,outward:1,overtake:1,hold:-1,defend:-1},
 riskTolerance:{Sprint:1,Push:1,ram:1,inward:1,outward:1,Conserve:-1,avoid:-1,yield:-1,defendCombat:-1},
};
// Suppress only conflicting coaching channels; Signs still influence autonomous
// judgment through their native scorer, never forced action or attribute bonuses.
const conflicts={
 'Push the Pace':{conservation:1,riskTolerance:-1},
 'Conserve Strength':{conservation:-1,riskTolerance:1},
 'Seek Open Track':{positioning:-1},
 'Race Defensively':{aggression:1,conservation:-1,riskTolerance:1},
 'Engage Rivals':{aggression:-1,riskTolerance:-1},
 'Hold Position':{positioning:1,riskTolerance:1},
};
export function coachingUtility(c,action,sign){validateCoaching(c);if(!c)return 0;let sum=0;for(const k of coachingAxes){const axis=c.axes[k];if(conflicts[sign]?.[k]===Math.sign(axis))continue;sum+=axis*c.weights[k]*(preference[k][action]??0);}return sum;}
