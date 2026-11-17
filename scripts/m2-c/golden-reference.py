"""Independent Python reference for market-generator-v1; never run automatically by tests.
Freeze output deliberately; compare Node/browser against the checked-in golden fixture.
"""
import json, sys
from decimal import Decimal, ROUND_HALF_UP
MASK = 0xffffffff
ALGORITHM = 'fnv1a32-utf8-mulberry32-rejection-v1'
COUNTS = {'driver':[2,2,1], 'beast':[2,3,1], 'chariot':[1,1,1], 'specialist':[1,1,1], 'equipment':[3,3,0]}
TIERS = ['Budget','Standard','Premium']
KEYS = {'driver':['driving','beastHandling','combat','awareness','nerve'], 'beast':['speed','power','agility','endurance','discipline','toughness'], 'chariot':['stability','durability','protection','rollingEfficiency','maneuverability']}
PRICES = {'driver':[200,400,800], 'beast':[150,325,650], 'chariot':[375,625,1150], 'specialist':[200,375,625], 'equipment':[100,275,425]}
def seed_integer(text):
    value = 2166136261
    for byte in text.encode('utf-8'):
        value = ((value ^ byte) * 16777619) & MASK
    return value
class Stream:
    def __init__(self, seed): self.state = seed
    def word(self):
        self.state = (self.state + 0x6d2b79f5) & MASK
        t = self.state
        t = ((t ^ (t >> 15)) * (t | 1)) & MASK
        t ^= (t + (((t ^ (t >> 7)) * (t | 61)) & MASK)) & MASK
        return (t ^ (t >> 14)) & MASK
    def draw(self, lo, hi):
        size = hi-lo+1
        limit = (2**32 // size) * size
        word = self.word()
        while word >= limit: word = self.word()
        return lo + word % size
def fixture(career):
    material = 'BNT|M2-C|market-generator-v1|' + career
    seed = seed_integer(material)
    raw = Stream(seed)
    first_words = [raw.word() for _ in range(8)]
    rng, offers = Stream(seed), {}
    for category, counts in COUNTS.items():
        for index, count in enumerate(counts):
            tier = TIERS[index]
            for ordinal in range(1,count+1):
                key = f'm2c-offer-{category}-{tier.lower()}-{ordinal}'
                if category in KEYS:
                    lo, hi = [(30,49),(50,69),(70,89)][index]
                    template = {'attributes': {k:rng.draw(lo,hi) for k in KEYS[category]}, 'condition': rng.draw(70,100)}
                    if category == 'driver': template.update(strain=0,fatigue=0,injury='Healthy',xp=0)
                    if category == 'beast': template.update(species='generic_draft_beast',fatigue=0,injury='Healthy',xp=0)
                    if category == 'chariot': template.update(integrity=rng.draw(70,100),wear=0,weight=180,capacity=400,xp=0)
                elif category == 'specialist': template = {'role':['Beast Handler','Mechanic','Physician'][index], 'injury':'Healthy'}
                else: template = {'mass':0,'combat':0}
                q = Decimal(rng.draw(85,115)) / 100
                w = Decimal(rng.draw(90,110)) / 100 if category in ['driver','specialist'] else None
                h = template['integrity'] if category == 'chariot' else template['condition'] if category in ['driver','beast'] else None
                c = Decimal('0.70') + Decimal('0.003')*h if h is not None else Decimal(1)
                price = int((Decimal(PRICES[category][index])*q*c/5).quantize(Decimal(1),rounding=ROUND_HALF_UP)*5)
                name = f'{"Basic" if tier == "Budget" else "Standard"} equipment {ordinal}' if category == 'equipment' else f'{tier} {category} {ordinal}'
                offers[key] = {'id':key,'ownerCareerId':career,'references':{},'recordVersion':2,'name':name,'category':category,'tier':tier,'ordinal':ordinal,'generatorVersion':'market-generator-v1','algorithm':ALGORITHM,'seedMaterial':material,'quality':float(q),'wageQuality':float(w) if w is not None else None,'health':h,'price':price,'available':True,'template':template}
    return {'careerId':career,'seedMaterial':material,'seed':seed,'firstWords':first_words,'offers':offers}
if __name__ == '__main__':
    data = {'algorithm':ALGORITHM,'reference':'Independent Python unsigned arithmetic and Decimal half-up', 'vectors':[fixture(x) for x in ['career','A','career_42','a'*64]]}
    with open(sys.argv[1], 'w', encoding='utf-8') as f: json.dump(data,f,indent=2);f.write('\n')
