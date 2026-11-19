export function recoveryStatus(view){
 const s=view?.state,x=s?.championshipFoundation?.instances?.[s.championshipFoundation.activeId];
 if(view?.restoreStage?.state==='PREPARED')return {code:'RESTORE_PENDING',action:'Revalidate and resume the staged restore; no mixed generation is active.'};
 if(view?.migrationStage?.state==='PREPARED'&&!view?.migration)return {code:'MIGRATION_PENDING',action:'Resume the explicitly confirmed legacy migration; original bytes remain unchanged.'};
 if(!s)return {code:view?.hasAuthority?'CAREER_RECOVERY_REQUIRED':'LEGACY_OR_EMPTY',action:view?.reason??'Explicitly migrate a career or restore a complete backup.'};
 if(x?.phase==='SETTLEMENT_PENDING')return {code:'SETTLEMENT_PENDING',action:'E5 settlement is not enabled; management and registration stay locked.'};
 if(x?.phase==='RACE_START_PENDING')return {code:'INTERRUPTED_BIRTH',action:'Complete creation from the frozen setup; never reroll an established race.'};
 if(view.reason)return {code:'RECOVERY_REQUIRED',action:view.reason+' — validate repair or supply a matching complete backup.'};
 if(x?.phase==='NO_STARTERS_PENDING')return {code:'NO_STARTERS_PENDING',action:'Publish the authoritative eligibility outcome; no native entrants are fabricated.'};
 if(['RECOVERY_REQUIRED','RACE_CLEARANCE_BLOCKED'].includes(x?.phase))return {code:x.phase,action:x.blockedReason??'Validated retry only; no forced clearance.'};
 if(view.operational==='RESULT_COMMITTED'&&!x?.raceResults.some(r=>r.raceId===x.raceId))return {code:'NATIVE_PREPARED',action:'Native proof is durable; publish official career consequences once.'};
 if(view.frame?.status==='Ended')return {code:'CLEARANCE_PENDING',action:'Native processing ended; explicit D5 publication remains required.'};
 if(view.frame?.status==='Stalled')return {code:'RACE_CLEARANCE_BLOCKED',action:'Physical processing is stalled; do not remove wrecks or invent retirements.'};
 if(view.frame)return {code:view.runtime?.paused?'PAUSED':'ACTIVE_RESUME_REQUIRED',action:view.warning??'Latest durable checkpoint and journal loaded; resume explicitly after reopen.'};
 return {code:x?.phase??'STABLE_PREPARATION',action:'No automatic event start or settlement.'};
}
