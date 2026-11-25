from pathlib import Path
import json,hashlib
from jsonschema import Draft202012Validator
R=Path(__file__).resolve().parents[2];P=R/'content/m5/v1.1';A=R/'content/m5/amendments/d2-v1'
def strict(path):
 def pairs(rows):
  result={}
  for k,v in rows:
   if k in result:raise ValueError('Duplicate key '+k)
   result[k]=v
  return result
 return json.loads(path.read_text(),object_pairs_hook=pairs,parse_constant=lambda s:(_ for _ in()).throw(ValueError(s)))
checked=0
for base in[P,P/'core-v1.0']:
 for line in(base/'SHA256SUMS.txt').read_text().splitlines():
  h,n=line.split(None,1);f=base/n.strip().lstrip('*');assert hashlib.sha256(f.read_bytes()).hexdigest()==h,f;checked+=1
for file,schema in [('competition-catalog-v1.1.json','BNT_M5_Proposed_Competition_Content_Schemas.json'),('owner-policy-mapping.json','owner-policy-mapping.schema.json'),('regional-market-profiles.json','regional-market-profiles.schema.json')]:Draft202012Validator(strict(P/'schemas'/schema)).validate(strict(P/file))
C=strict(P/'competition-catalog-v1.1.json')['records'];assert sum(map(len,C.values()))==310
ids={r['id'] for v in C.values() for r in v};assert len(ids)==310
for family,rows in C.items():
 for row in rows:
  for source in row['sources']:
   p=P/source['file'];assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==source['sha256'],source['file']
F=strict(A/'affinity-v1.json');assert len(F['matrix'])==13 and all(len(r)==9 for r in F['matrix'].values());assert sum(len(r)for r in F['matrix'].values())==117
for ancestry,row in F['matrix'].items():
 assert ancestry in F['ancestries'] and all(k in F['species']and v in F['modifiers']for k,v in row.items());assert row['B01'] in ['primary','neutral']
M={f.stem:strict(f)for f in(P/'core-amendments').glob('*.json')if not f.name.endswith('.operation.json')}
for f in(P/'core-amendments').glob('*.operation.json'):
 op=strict(f);assert hashlib.sha256((P/op['original']).read_bytes()).hexdigest()==op['originalSha256'];assert hashlib.sha256((P/'core-amendments'/f.name.replace('.operation.json','')).read_bytes()).hexdigest()==op['newSha256']
payload={'competition':C,'policy':strict(P/'owner-policy-mapping.json'),'regional':strict(P/'regional-market-profiles.json'),'bindings':strict(P/'native-binding-map.json'),'amendments':M,'integration':strict(A/'integration-v1.json'),'affinity':F};encoded=json.dumps(payload,sort_keys=True,separators=(',',':'),ensure_ascii=False);pin={'version':'m5-d2-content-v1','digest':hashlib.sha256(encoded.encode()).hexdigest(),'coreVersion':'1.0.0','supplementalVersion':'m5-competition-v1.1','compatibility':'m5-affinity-v1'}
(R/'src/career/m5/d2/content.generated.js').write_text('// Generated from byte-preserved catalogs plus versioned amendments.\nexport const D2_PIN='+json.dumps(pin,separators=(',',':'))+';\nexport const D2_CONTENT='+encoded+';\n')
(R/'src/model/affinity.generated.js').write_text('// Generated from owner-approved affinity-v1.json.\nexport const AFFINITY_RULES='+json.dumps(F,separators=(',',':'),ensure_ascii=False)+';\n')
print(json.dumps({'sourceChecksumEntries':checked,'supplementalRecords':310,'families':len(C),'affinityCells':117,'pin':pin}))
