import json,pathlib,hashlib,random,itertools,collections,jsonschema,math
p=pathlib.Path(__file__).resolve().parents[1]
def load(f):return json.loads((p/f).read_text())
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
b=load('competition-catalog-v1.1.json');r=b['records'];jsonschema.Draft202012Validator(load('schemas/BNT_M5_Proposed_Competition_Content_Schemas.json')).validate(b)
for f in ['owner-policy-mapping','regional-market-profiles']:jsonschema.Draft202012Validator(load('schemas/'+f+'.schema.json')).validate(load(f+'.json'))
for line in (p/'core-v1.0/SHA256SUMS.txt').read_text().splitlines():
 h,f=line.split(maxsplit=1);assert sha(p/'core-v1.0'/f.lstrip('*'))==h
core={x['id']:x for f in (p/'core-v1.0/catalogs').glob('*.json') for x in json.loads(f.read_text())};core.update({x['id']:x for x in load('core-v1.0/metadata/championship-difficulty-bindings.json')['records']})
idx={x['id']:x for a in r.values() for x in a};assert len(idx)==sum(map(len,r.values()));allids=set(idx)|set(core)
for x in idx.values():
 for s in x['sources']:
  f=p/s['file'];assert sha(f)==s['sha256'];assert 1<=s['startLine']<=s['endLine']<=len(f.read_text().splitlines())
 for k,v in x.items():
  if k.endswith('Weights') and isinstance(v,list) and v and 'id' in v[0]:
   assert len({a['id'] for a in v})==len(v);assert all(a['id'] in allids and math.isfinite(a['weight']) and a['weight']>0 for a in v)
  if k in ['culturalNamingProfileId','regionId','environmentId','namingProfileId','presentationId','tierBindingId','strengthReference','localProfileId','rivalPopulationPolicyId','renewalPolicyId','worldVisualProfileId']:assert v in allids,(k,v)
  if isinstance(v,dict) and 'min' in v and 'max' in v:assert v['min']<=v['max']
  if k=='regionIds':assert set(v)<=set(core)
prest=[v for v in r['venue'] if v['permanence']=='prestige'];assert collections.Counter(v['nationId'] for v in prest)=={f'N{i}':2 for i in range(1,9)};assert len({v['properName'] for v in prest})==16
native=load('native-binding-map.json'); sig={s['id']:s for s in native['signatures']};assert len(sig)==6
for t in r['tier']:
 o=sig[t['nativeCatalogId']]['offer']['value'];assert t['fieldSize']==o['fieldSize'] and t['raceCount']==len(o['schedule'])
for e in r['event']:
 for v in e['venueWeights']:
  v=idx[v['id']];assert e['format'] in v['supportedFormats'];assert all((idx[g['id']]['kind']=='Rally')==(e['distanceMode']=='point-to-point') for g in v['geometryWeights'])
reserved={v['properName'].casefold() for v in prest}|{s['offer']['value']['name'].casefold() for s in sig.values()}|{x['displayName'].casefold() for x in load('core-v1.0/metadata/name-reservations.json')['records']}
namefixtures=[]
for x in r['naming']:
 pool=sorted({' '.join(t) for t in itertools.product(x['roots'],x['endings'])}-set());pool=[n for n in pool if n.casefold() not in reserved];assert len(pool)>=128
 def draw():
  rng=random.Random(20261124);used=set();out=[];retries=0
  for _ in range(64):
   for j in range(x['maxRetries']):
    n=rng.choice(pool)
    if n not in used:used.add(n);out.append(n);break
    retries+=1
   else:raise AssertionError('exhausted')
  return out,retries
 a=draw();assert a==draw();namefixtures.append(dict(id=x['id'],capacity=len(pool),sample=a[0],retries=a[1]))
def sample_once(c,seed):
 rng=random.Random(seed);t=idx[c['tierBindingId']];pat=native['schedulePatterns'][t['contextId']];out=[];used=collections.Counter()
 for a in pat:
  opts=[idx[w['id']] for w in c['eventWeights'] if idx[w['id']]['format']==a['format'] and idx[w['id']]['grid']==a['grid'] and w['id'].split('.')[2]==a['kind'].lower()];assert opts
  opts=[e for e in opts if any(used[w['id']]<c['venueRepeatLimit'] for w in e['venueWeights'])];assert opts; e=rng.choices(opts,weights=[next(w['weight'] for w in c['eventWeights'] if w['id']==e['id']) for e in opts])[0];v=rng.choice([idx[w['id']] for w in e['venueWeights'] if used[w['id']]<c['venueRepeatLimit']]);used[v['id']]+=1;g=rng.choice(v['geometryWeights'])['id'];out.append(dict(event=e['id'],venue=v['id'],geometry=g,seed=v['pinnedSeed'] if v['seedPolicy']=='pinned' else rng.randrange(2**31),nation=v['nationId']))
 assert len(out)==t['raceCount'];assert t['fieldSize']-1-2>=1
 return out
def sample(c,seed):
 for attempt in range(c['maxAttempts']):
  a=sample_once(c,seed*64+attempt)
  if c['geographicScope']!='international' or len({x['nation'] for x in a})>=2:return a
 raise AssertionError('schedule exhausted')
fixtures=[]
for c in r['championship']:
 for seed in range(10):
  a=sample(c,seed);assert a==sample(c,seed);fixtures.append(dict(profile=c['id'],seed=seed,schedule=a))
pol=load('owner-policy-mapping.json');assert pol['recruiters']['legacyPoints']==6;assert pol['generatedProgression']['signatureTrophy']==False;assert pol['rivals']['adaptiveScaling']==False
assert {k for k,v in pol['homeAndOpportunityRenewal'].items() if v}=={'normalCompletion','involuntaryEliminationAfterParticipation'}
result=dict(status='AUTHORING_CHECKS_PASS',records={k:len(v) for k,v in r.items()},fullOriginalSchemaPass=True,coreChecksumPass=True,namePools=len(namefixtures),namesSampled=sum(len(x['sample']) for x in namefixtures),nameRetries=sum(x['retries'] for x in namefixtures),scheduleSamples=len(fixtures),nativeRuntimeTestsExecuted=0,limitations=['schedule samples are profile references, not native resolved courses','weighted event sampling and international coverage tested; native RNG and full field birth not tested','policy assertions are not transaction tests','Iron Gauntlet completion tier requires native confirmation'])
for f,d in [('name-fixtures',namefixtures),('schedule-fixtures',fixtures),('results',result)]: (p/'validation'/f'{f}.json').write_text(json.dumps(d,indent=2)+'\n')
print(json.dumps(result,indent=2))
