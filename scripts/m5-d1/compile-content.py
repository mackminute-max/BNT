from pathlib import Path
import json, hashlib
from jsonschema import Draft202012Validator
root=Path(__file__).resolve().parents[2];root=root.resolve();p=root/'content/m5/v1'
def pairs(rows):
 d={}
 for k,v in rows:
  if k in d: raise ValueError('Duplicate JSON key '+k)
  d[k]=v
 return d
def read(f):return json.loads(f.read_text(),object_pairs_hook=pairs,parse_constant=lambda x:(_ for _ in ()).throw(ValueError(x)))
m=read(p/'CATALOG_VERSION_MANIFEST.json');s=read(p/'schemas/M5_Audit_Content_Schemas.json');data={};checks=0
for row in m['coreCatalogs']:
 f=p/row['file'];assert hashlib.sha256(f.read_bytes()).hexdigest()==row['sha256'];rows=read(f)
 assert len(rows)==row['recordCount'];v=Draft202012Validator({'$defs':s['$defs'],'type':'array','items':{'$ref':row['schemaRef']}});v.validate(rows)
 data[row['family']]=rows;checks+=len(rows)
ids={r['id'] for rows in data.values() for r in rows};assert len(ids)==256
for row in m['files']:
 f=p/row['file']
 if f.exists():assert hashlib.sha256(f.read_bytes()).hexdigest()==row['sha256'],row['file']
for rows in data.values():
 for r in rows:
  for source in r['sources']:
   f=p/source['file'];assert f.exists() and hashlib.sha256(f.read_bytes()).hexdigest()==source['digest'],source['file']
  def weighted_refs(o):
   if isinstance(o,list):
    for v in o:weighted_refs(v)
   elif isinstance(o,dict):
    if set(o)=={'id','weight'} and not o['id'].startswith('experience.'):assert o['id'] in ids,o['id']
    for v in o.values():weighted_refs(v)
  weighted_refs(r)
meta={n:read(p/'metadata'/f'{n}.json') for n in ['provisional-balance-policy','name-reservations','authored-identity-preservation','championship-difficulty-bindings','regional-cultural-affinities']}
pin={'version':m['version'],'digest':hashlib.sha256(json.dumps({'catalogs':data,'metadata':meta},sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()}
output='// Generated from pinned candidate v1.0. Do not edit.\nexport const CONTENT_PIN='+json.dumps(pin)+';\nexport const CATALOGS='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\nexport const METADATA='+json.dumps(meta,ensure_ascii=False,separators=(',',':'))+';\n'
(root/'src/career/m5/content.generated.js').write_text(output)
print(json.dumps({'validatedRecords':checks,'families':len(data),'pin':pin}))
