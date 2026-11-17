import {freeze} from '../assets.js';
import {id} from '../legacy-state.js';
import {debtStatus,moraleMultiplier,previewRU4,requirePreparation} from './policy.js';
// Future entrant-commit seam: returned immutable snapshot is passed with this entrant,
// not read from mutable stable state during the championship.
export function commitEntrant(s,championshipId,selection,options={}){
 requirePreparation(s);id(championshipId);const p=previewRU4(s,selection,options);if(!p.eligible)throw Error(p.reasons.join('; '));const status=debtStatus(s.cycles.streak);
 return freeze({ru:structuredClone(p.native),payrollContext:{version:1,rulesVersion:'payroll-control-v1',careerId:s.career.id,championshipId,status,multiplier:moraleMultiplier(status)}});
}
