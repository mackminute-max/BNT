// Shared component checks used by complete native assembly and partial Barn selection.
// Keep legacy reason ordering and schema-specific condition semantics unchanged.
export function componentReasons(state,kind,key,assignmentId=null){
 const a=state.management.registries[kind][key],reasons=[];
 if(state.schema>=3){
  if(!a||a.ownerCareerId!==state.career.id)return ['Missing/foreign component'];
  if(a.references.assignment?.some(k=>k!==assignmentId))reasons.push('Exclusive assignment conflict');
  if(!a.available||['Major','Critical'].includes(a.injury)||['Critical','Destroyed'].includes(a.status))reasons.push('Unavailable/ineligible component: '+a.name);
 }else{
  if(!a||a.ownerCareerId!==state.career.id)return ['Missing or foreign owned '+kind+': '+String(key)];
  if((a.references.assignment??[]).some(k=>k!==assignmentId))reasons.push('Asset already exclusively assigned: '+a.name);
  if(!a.available)reasons.push('Asset unavailable: '+a.name);
  if(['Severe','Dead'].includes(a.injury)||['Critical','Destroyed'].includes(a.status))reasons.push('Ineligible condition: '+a.name);
 }
 return reasons;
}
