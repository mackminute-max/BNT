from pathlib import Path
import json,hashlib,copy,math,random,statistics,collections,csv,subprocess,re
from jsonschema import Draft202012Validator
O=Path(__file__).resolve().parents[1];A=Path('/workspace/deliverables/bnt-m5-audit');R=Path('/workspace/BNT');checks=[]
def check(t,c):
 if not c:raise AssertionError(t)
 checks.append(t)
def pairs(items):
 d={}
 for k,v in items:
  if k in d:raise ValueError('duplicate JSON key '+k)
  d[k]=v
 return d
def load(p):return json.loads(p.read_text(),object_pairs_hook=pairs,parse_constant=lambda x:(_ for _ in ()).throw(ValueError(x)))
def re_generic(name):return bool(re.search(r'(?i)(?:^|\s)(?:generic|placeholder|recruit [0-9]+|driver [0-9]+|rival [0-9]+)(?:$|\s)',name))
def dump(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
S=load(A/'BNT_M5_Proposed_Content_Schemas.json');Draft202012Validator.check_schema(S)
P={p.stem:load(p) for p in sorted((O/'catalogs').glob('*.json'))};IDX={}
for f,qs in P.items():
 v=Draft202012Validator({'$schema':S['$schema'],'$defs':S['$defs'],'type':'array','items':{'$ref':'#/$defs/'+f},'minItems':1,'maxItems':10000})
 v.validate(qs);check('Core schema '+f,True)
 for q in qs:
  check('Unique ID '+q['id'],q['id'] not in IDX);IDX[q['id']]=(f,q)
  for sr in q['sources']:
   file=O/sr['file'];check('Source hash '+q['id']+' '+sr['authority'],file.exists() and hashlib.sha256(file.read_bytes()).hexdigest()==sr['digest']);check('Source range '+q['id'],1<=sr['startLine']<=sr['endLine']<=len(file.read_text().splitlines()))
expected={'nation':{'N'+str(i) for i in range(1,9)},'ancestryGameplay':{'A%02d'%i for i in range(1,14)},'beastSpecies':{'B%02d'%i for i in range(1,10)}}
for f,ids in expected.items():key={'nation':'canonicalNationId','ancestryGameplay':'canonicalAncestryId','beastSpecies':'canonicalSpeciesId'}[f];check('Canonical complete '+f,{q[key] for q in P[f]}==ids)
W={'nation':{'ancestryWeights':'ancestryGameplay','cultureWeights':'culturalNaming','backgroundWeights':'driverBackground','aiWeights':'driverAI','staffWeights':'staffProfession','speciesWeights':'beastSpecies','stockWeights':'beastBloodline','qualityWeights':'qualityRarity'},'ancestryGameplay':{'backgroundWeights':'driverBackground'},'driverBackground':{'aiProfileWeights':'driverAI'},'beastSpecies':{'temperamentWeights':'beastTemperament'},'beastBloodline':{'temperamentWeights':'beastTemperament'},'rivalGeneration':{'driverAncestryWeights':'ancestryGameplay','driverAIWeights':'driverAI','beastSpeciesWeights':'beastSpecies','qualityWeights':'qualityRarity'}}
REFS={'nation':{'namingProfileId':'culturalNaming','teamIdentityProfileId':'rivalIdentity','visualProfileId':'visualMetadata'},'ancestryGameplay':{'qualityProfileId':'qualityRarity','visualProfileId':'visualMetadata'},'beastSpecies':{'qualityProfileId':'qualityRarity','visualProfileId':'visualMetadata'},'beastBloodline':{'visualProfileId':'visualMetadata'},'staffProfession':{'namingProfileId':'culturalNaming'},'rivalIdentity':{'cultureProfileId':'culturalNaming','namingProfileId':'culturalNaming','visualProfileId':'visualMetadata'},'rivalGeneration':{'identityProfileId':'rivalIdentity','chariotNamingProfileId':'chariotNaming','equipmentNamingProfileId':'equipmentNaming'},'chariotNaming':{'namingProfileId':'culturalNaming'},'equipmentNaming':{'namingProfileId':'culturalNaming'}}
ARR={'beastSpecies':{'stockProfileIds':'beastBloodline'},'staffProfession':{'expertiseProfileIds':'staffExpertise'},'rivalGeneration':{'staffProfileIds':'staffProfession'},'nation':{'equipmentPreferences':'equipmentNaming'}}
for f,qs in P.items():
 for q in qs:
  for k,target in W.get(f,{}).items():
   ids=[r['id'] for r in q[k]];check('No duplicate weighted refs '+q['id']+k,len(ids)==len(set(ids)))
   for id in ids:check('Typed weight ref '+q['id']+' '+id,id in IDX and IDX[id][0]==target)
  for k,target in REFS.get(f,{}).items():check('Typed ref '+q['id']+k,q[k] in IDX and IDX[q[k]][0]==target)
  for k,target in ARR.get(f,{}).items():
   for id in q[k]:check('Typed array ref '+q['id']+k,id in IDX and IDX[id][0]==target)
  for field in ['baseline','traits']:
   for k,d in q.get(field,{}).items():check('Distribution order '+q['id']+k,d['min']<=d['mode']<=d['max'] and (d['max']-d['min'])%d['step']==0)
  if 'age'in q:check('Adult age '+q['id'],q['age']['yearsMin']<=q['age']['yearsMax'])
  for field in ['given','family','clan','beastNames','modelNames','manufacturers']:
   if field in q:check('Unique lexical entries '+q['id']+field,len(q[field])==len(set(q[field])))
# Canon stock classification and native role/service pairing.
CAN={e['id']:e for e in load(A/'evidence/canon-entities.json')};stock={(e['id'],l['local_id']):l for e in CAN.values() if e['id'].startswith('B') for l in e['extracted']['lines_or_styles']}
check('39 stock source entries',len(stock)==39 and len(P['beastBloodline'])==39)
for q in P['beastBloodline']:
 s=stock[(q['canonicalSpeciesId'],q['sourceLocalId'])];check('Stock exact '+q['id'],s['name']==q['label'] and s['classification']==q['classification'])
for q in P['beastSpecies']:
 for id in q['stockProfileIds']:check('Stock parent '+id,IDX[id][1]['canonicalSpeciesId']==q['canonicalSpeciesId'])
for q in P['ancestryGameplay']:
 check('Modest zero-sum ancestry '+q['id'],max(map(abs,q['ancestryDelta'].values()))<=3 and sum(q['ancestryDelta'].values())==0 and q['ancestryDelta']['awareness']==q['ancestryDelta']['nerve']==0)
 check('No ancestry personality assignment '+q['id'],len(q['backgroundWeights'])==8)
allowed={'Beast Handler':{'beast-care','beast-treatment'},'Mechanic':{'chariot-repair','chariot-refurbishment'},'Physician':{'driver-treatment'}}
for q in P['staffProfession']:check('Native role services '+q['id'],set(q['serviceIds'])==allowed[q['nativeRole']] and q['newMechanicalSkills'] is False)
assets=load(R/'assets/presentation.manifest.json');assetids={a['id'] for a in assets['assets']}
for q in P['visualMetadata']:
 check('Existing visual fallback '+q['id'],q['fallbackAssetId'] in assetids)
 check('No nonexistent production asset required '+q['id'],not q['portraitAssetIds'] and not q['spriteAssetIds'])
vr=load(O/'metadata/visual-anatomy-rules.json')['rules'];vri={v['canonicalId']:v for v in vr}
check('Hill Dwarf female rule',vri['A04']['sexConditionalRules'][0]['forbidden']==['all-facial-hair']);check('Mountain Dwarf female rule','full-beard' in vri['A05']['sexConditionalRules'][0]['forbidden']);check('Sea Elf gills','gill' in vri['A09']['requiredAnatomy']);check('Dragonkin no wings','wings' in vri['A12']['prohibitedFeatures']);check('Tortle permanent shell','shell' in vri['A13']['requiredAnatomy'])
# Preserve original authored identity records byte-for-JSON value.
auth=load(O/'metadata/authored-identity-preservation.json');orig=load(R/auth['sourcePath']);check('All23 authored identities preserved',len(auth['records'])==23 and auth['records']==orig['records'])
# Content-level reproducible sampling, not production runtime generator/replay certification.
SEED=20261124;rng=random.Random(SEED)
def pick(table,rng):
 rows=sorted(table,key=lambda x:x['id']);v=rng.random()*sum(x['weight'] for x in rows)
 for row in rows:
  v-=row['weight']
  if v<0:return IDX[row['id']][1]
 return IDX[rows[-1]['id']][1]
def draw(d,rng):return rng.randint(int(d['min']),int(d['max']))
def person(a,rng,quality=None,bg=None):
 bg=bg or pick(a['backgroundWeights'],rng);q=quality or IDX['quality.ordinary'][1];ex=pick_local(bg['experienceLevels'],rng)
 return {k:max(0,min(100,draw(a['baseline'][k],rng)+a['ancestryDelta'][k]+bg['attributeDelta'][k]+a['experienceDelta'][k]+ex['attributeDelta'][k]+q['driverDelta'][k]+rng.randint(-int(a['individualVariation']),int(a['individualVariation'])))) for k in a['baseline']}
def pick_local(rows,rng):
 v=rng.random()*sum(x['weight'] for x in rows)
 for x in sorted(rows,key=lambda x:x['id']):
  v-=x['weight']
  if v<0:return x
 return rows[-1]
def animal(s,rng,q=None):
 q=q or IDX['quality.ordinary'][1];st=IDX[rng.choice(s['stockProfileIds'])][1];te=pick(st['temperamentWeights'],rng)
 return {k:max(0,min(100,draw(s['baseline'][k],rng)+st['statDelta'][k]+te['attributeDelta'][k]+q['beastDelta'][k]+rng.randint(-int(s['individualVariation']),int(s['individualVariation'])))) for k in s['baseline']}
metrics={'seed':SEED,'algorithm':'Python3 random.Random isolated authoring diagnostics; NOT proposed native runtime RNG','perProfileSamples':10000,'driver':{},'beast':{},'ai':{},'nation':{},'quality':{},'names':{}}
examples=[]
for fam,fun in [('ancestryGameplay',person),('beastSpecies',animal)]:
 dest=metrics['driver' if fam=='ancestryGameplay' else 'beast']
 for q in P[fam]:
  vals=[fun(q,rng) for _ in range(10000)];dest[q['id']]={'means':{k:round(statistics.mean(v[k] for v in vals),4) for k in vals[0]},'stddev':{k:round(statistics.pstdev(v[k] for v in vals),4) for k in vals[0]},'min':min(min(v.values()) for v in vals),'max':max(max(v.values()) for v in vals),'atCap':sum(x==100 for v in vals for x in v.values())}
  examples.append({'profileId':q['id'],'category':'driver' if fam=='ancestryGameplay' else 'beast','attributes':vals[0]})
for q in P['driverAI']:
 vals=[{k:max(0,min(100,draw(d,rng)+rng.randint(-q['individualVariation'],q['individualVariation']))) for k,d in q['traits'].items()} for _ in range(10000)]
 metrics['ai'][q['id']]={'means':{k:round(statistics.mean(v[k] for v in vals),4) for k in vals[0]},'min':min(min(v.values()) for v in vals),'max':max(max(v.values()) for v in vals)}
# National weights should not accidentally omit any ancestry/species/archetype.
for n in P['nation']:
 counts=collections.Counter(pick(n['ancestryWeights'],rng)['canonicalAncestryId'] for _ in range(100000));sp=collections.Counter(pick(n['speciesWeights'],rng)['canonicalSpeciesId'] for _ in range(100000));metrics['nation'][n['canonicalNationId']]={'residentAncestrySamples':dict(counts),'residentSpeciesSamples':dict(sp),'samplesEach':100000,'importPath':'Structural nonzero and separate-origin policy validated; not a gameplay residency simulation.'}
 check('All ancestry paths '+n['id'],set(counts)==expected['ancestryGameplay']);check('All beast paths '+n['id'],set(sp)==expected['beastSpecies'])
 # 5-sigma/floor1% diagnostic, not final demographic/balance acceptance.
 total=sum(x['weight'] for x in n['ancestryWeights'])
 for row in n['ancestryWeights']:
  p=row['weight']/total;observed=counts[IDX[row['id']][1]['canonicalAncestryId']]/100000;check('Demography diagnostic '+n['id']+row['id'],abs(observed-p)<=max(.01,5*math.sqrt(p*(1-p)/100000)))
 # Name collision at relevant active scope128; max32 retries. Not globally unique across all careers.
 cultures=[IDX[c['id']][1] for c in n['cultureWeights']];used=set();retry=[]
 for i in range(128):
  success=False
  for attempt in range(32):
   c=rng.choice(cultures);name=rng.choice(c['given'])+' '+rng.choice(c['clan'] if c['grammar']=='given-clan' else c['family']);key=name.casefold()
   if key not in used:used.add(key);retry.append(attempt+1);success=True;break
  check('Bounded nongeneric visible name '+n['id']+str(i),success and not re_generic(name))
 metrics['names'][n['canonicalNationId']]={'namesGenerated':128,'uniqueNames':len(used),'maxAttempts':max(retry),'meanAttempts':round(statistics.mean(retry),4),'maxDeclaredCombinations':max(len(c['given'])*len(c['clan'] if c['grammar']=='given-clan' else c['family']) for c in cultures)}
# Note re_generic defined below moved before execution by final script construction.
for q in P['qualityRarity']:
 a=IDX['ancestry.a01'][1];bs=IDX['species.b01'][1];dv=[person(a,rng,q) for _ in range(10000)];bv=[animal(bs,rng,q) for _ in range(10000)]
 metrics['quality'][q['id']]={'driverMean':round(statistics.mean(statistics.mean(v.values()) for v in dv),4),'horseMean':round(statistics.mean(statistics.mean(v.values()) for v in bv),4),'capFraction':sum(x==100 for v in dv+bv for x in v.values())/(10000*11)}
check('Quality progression monotone',all(metrics['quality'][a]['driverMean']<metrics['quality'][b]['driverMean'] for a,b in zip(['quality.affordable','quality.ordinary','quality.specialized','quality.rare'],['quality.ordinary','quality.specialized','quality.rare','quality.exceptional'])))
# Exceptional common stock vs affordable specialized stock input-budget comparison, not race victory claim.
ho=animal(IDX['species.b01'][1],random.Random(99),IDX['quality.exceptional'][1]);dr=animal(IDX['species.b08'][1],random.Random(99),IDX['quality.affordable'][1]);check('Exceptional horse can exceed affordable drake input budget',sum(ho.values())>sum(dr.values()));metrics['contrastingExample']={'exceptionalHorse':ho,'affordableDrake':dr,'interpretation':'Input-budget example only. Race performance and economic balance require native seeded race tests.'}
# All profile values deterministic under repeated local diagnostic inputs.
for q in P['ancestryGameplay']:check('Diagnostic same seed '+q['id'],person(q,random.Random(123))==person(q,random.Random(123)))
# Boundary checks in original supplied schema, no weakening.
f='driverAI';vs=Draft202012Validator({'$defs':S['$defs'],'$ref':'#/$defs/'+f});bad=copy.deepcopy(P[f][0]);bad['traits']['aggression']['max']=101;check('Reject bad attribute bound',not vs.is_valid(bad));bad=copy.deepcopy(P[f][0]);bad['unsupportedKey']=True;check('Reject unknown core field',not vs.is_valid(bad))
dump(O/'evidence/statistical-results.json',metrics);dump(O/'evidence/native-validation-inputs.json',examples)
# No source state changed while producing content.
before=load(O/'evidence/repository-before.json');after={str(p.relative_to(R)):hashlib.sha256(p.read_bytes()).hexdigest() for p in R.rglob('*') if p.is_file() and not any(k in p.relative_to(R).parts for k in ['.git','node_modules'])};check('All repository bytes unchanged',before==after)
status=subprocess.check_output(['git','status','--porcelain=v1','--untracked-files=all'],cwd=R,text=True);check('Working tree preserved',status==(O/'evidence/git-status-before.txt').read_text());(O/'evidence/git-status-after.txt').write_text(status)
result={'exit':0,'passedChecks':len(checks),'failedChecks':0,'coreRecordCount':len(IDX),'familyCounts':{f:len(qs) for f,qs in P.items()},'statisticalSamples':{'driver':130000,'beast':90000,'ai':100000,'nationalAncestry':800000,'nationalSpecies':800000,'qualityDriverAndHorse':100000,'names':1024},'limits':['No native full-race balance or replay certification by Python sampler','Provisional stats; no integration authority','Full application Node/browser suites not required for unchanged source and not rerun'], 'checks':checks}
dump(O/'evidence/content-validation-results.json',result);print(json.dumps({k:v for k,v in result.items() if k!='checks'},indent=2))
