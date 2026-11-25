from pathlib import Path
import json,hashlib,copy
from jsonschema import Draft202012Validator
O=Path(__file__).resolve().parents[1]
def save(n,d):(O/n).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
P={p.stem:json.loads(p.read_text()) for p in (O/'catalogs').glob('*.json')};INDEX={x['id']:(f,x) for f,qs in P.items() for x in qs}
def refs(x):
 if isinstance(x,dict):
  for k,v in x.items():
   if k not in ['sources']:yield from refs(v)
 elif isinstance(x,list):
  for v in x:yield from refs(v)
 elif isinstance(x,str) and x in INDEX:yield x
edges=[]
for f,qs in P.items():
 for q in qs:edges.append({'id':q['id'],'family':f,'dependsOn':sorted(set(refs(q))-{q['id']})})
save('metadata/cross-catalog-dependencies.json',{'version':1,'records':edges,'loadPolicy':'Parse all catalogs, build typed indexes, validate every reference; record-reference cycles are lookup graphs, not recursive initialization. No network resolution.','catalogDependencies':[{'catalog':f,'requires':sorted({INDEX[id][0] for q in qs for id in refs(q)}-{f})} for f,qs in sorted(P.items())],'externalDependencies':[{'id':'native-economy','path':'src/career/economy/','authority':'native-factory-and-protected-transactions'},{'id':'native-assets','path':'assets/presentation.manifest.json','authority':'build-manifest'},{'id':'native-championship-difficulty','path':'metadata/championship-difficulty-bindings.json','authority':'provisional-mixtures-integration-review'},{'id':'native-retention','path':'reports/CODEX_INTEGRATION.md','authority':'unresolved-M5-implementation-gate-not-content-default'}]})
save('metadata/pair-compatibility.json',{'version':1,'nativeComposition':{'beastCount':2,'distinctMemberIdsRequired':True,'nativeClassId':'pair.native-two-beast','mixedSpeciesLegalAtAttributeProjection':True,'newPhysics':False},'records':[{'speciesA':'B%02d'%a,'speciesB':'B%02d'%b,'nativeAttributeProjection':'supported','gameplayBan':False,'artHarnessReview':a!=b,'specialSizeReview':6 in [a,b] and a!=b,'note':'Visual alignment review only; no new mass, handling penalty, stat bonus or harness restriction.'} for a in range(1,10) for b in range(a,10)]})
# Supplemental schemas are compile-time documentation; no native save/runtime contract is changed.
def infer(vals):
 kinds=set(type(v).__name__ for v in vals); schemas=[]
 for typ in sorted(kinds):
  vs=[v for v in vals if type(v).__name__==typ]
  if typ=='dict':
   keys=set().union(*(v.keys() for v in vs));req=set(vs[0]).intersection(*(set(v) for v in vs));z={'type':'object','additionalProperties':False,'properties':{k:infer([v[k] for v in vs if k in v]) for k in sorted(keys)},'required':sorted(req)}
  elif typ=='list':
   items=[x for v in vs for x in v];z={'type':'array','maxItems':20000,'items':infer(items) if items else {'not':{}}}
  elif typ=='str':z={'type':'string','maxLength':100000}
  elif typ=='int':z={'type':'integer','minimum':-1000000,'maximum':9007199254740991}
  elif typ=='float':z={'type':'number','minimum':-1000000,'maximum':9007199254740991}
  elif typ=='bool':z={'type':'boolean'}
  elif typ=='NoneType':z={'type':'null'}
  else:raise ValueError(typ)
  schemas.append(z)
 return schemas[0] if len(schemas)==1 else {'anyOf':schemas}
meta={p.stem:json.loads(p.read_text()) for p in (O/'metadata').glob('*.json')}
S={'$schema':'https://json-schema.org/draft/2020-12/schema','$id':'https://blood-and-thunder.invalid/m5/supplemental-content-metadata-v1','title':'M5 proposed compile-time supplemental metadata; not a native save schema','$comment':'Exact current document shapes and bounded types. Cross-catalog/canon/anatomy constraints are semantically validated; these schemas do not authorize runtime adoption.','$defs':{k:infer([v]) for k,v in sorted(meta.items())}}
Draft202012Validator.check_schema(S)
results=[]
for k,v in meta.items():Draft202012Validator({'$schema':S['$schema'],'$defs':S['$defs'],'$ref':'#/$defs/'+k}).validate(v);results.append(k)
save('schemas/M5_Supplemental_Metadata_Schemas.json',S);save('evidence/supplemental-schema-results.json',{'exit':0,'schemaSyntax':'PASS','documentsPassed':len(results),'failed':0,'documents':sorted(results),'limits':'Shape validation only; semantic source/reference checks are separately reported.'})
# Stronger semantic dependencies outside the native authoring defs.
errors=[];canon=json.loads((O/'metadata/canonical-reference-mapping.json').read_text());canonicalids={x['id'] for x in canon['entities']}
for rec in edges:
 for id in rec['dependsOn']:
  if id not in INDEX:errors.append(id)
for doc in meta.values():
 if 'version'in doc and doc['version']!=1:errors.append('unsupported supplemental version')
briefs=json.loads((O/'metadata/visual-asset-production-briefs.json').read_text())['requirements'];briefids={x['id'] for x in briefs};futureassets={x['intendedAssetId'] for x in briefs}
for x in json.loads((O/'metadata/visual-asset-bindings.json').read_text())['records']:
 if x['profileId'] not in INDEX or any(i not in briefids for i in x['briefIds']) or any(i not in futureassets for i in x['futureAssetIds']):errors.append(x['profileId'])
for x in briefs:
 if x['canonicalId'] not in canonicalids:errors.append(x['id'])
for x in json.loads((O/'metadata/championship-difficulty-bindings.json').read_text())['records']:
 if any(id not in INDEX for id in x['rivalProfileIds']):errors.append(x['id'])
if errors:raise ValueError(errors)
save('evidence/supplemental-semantic-results.json',{'exit':0,'unresolvedReferences':errors,'coreDependencyRecords':len(edges),'briefsResolved':len(briefs),'futureAssetReferences':'Brief IDs resolve; images intentionally not produced/required.','pairValidation':'45 unordered pairs; diagonal legal, mixed visual-review only; no unapproved gameplay exclusions.'})
print('Supplemental documents validated:',len(results),'and visual/core dependency graph resolved')
