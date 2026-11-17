"""Standalone research figure; development-only matplotlib, no runtime asset."""
import json
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
root=Path('docs/phase2')
a=json.loads((root/'data/analysis.json').read_text())
s=json.loads((root/'supplement/analysis.json').read_text())
fig,ax=plt.subplots(2,3,figsize=(17,10),constrained_layout=True)
colors=['#386cb0','#e08214']
weather=list(a['weather']['Pure']);x=np.arange(len(weather))
for i,f in enumerate(['Pure','Combat']):
 vals=[a['weather'][f][w]['summary']['duration']['mean']for w in weather]
 sd=[a['weather'][f][w]['summary']['duration']['sd']for w in weather]
 ax[0,0].bar(x+(i-.5)*.35,vals,.35,label=f,color=colors[i],yerr=sd,capsize=2)
ax[0,0].set_xticks(x,['Clear','Rain','Mud','Dust/Wind','Heat'],rotation=20)
ax[0,0].set_ylabel('Race duration (s); error bars = SD')
ax[0,0].set_title('A: default races, n=100 per format');ax[0,0].legend()
for i,f in enumerate(['Pure','Combat']):
 rows=a['archetypes'][f];v=[r['winRate']['mean']*100 for r in rows]
 ci=[r['winRate']['ci95']for r in rows]
 err=np.array([[v[j]-ci[j][0]*100 for j in range(len(v))],[ci[j][1]*100-v[j] for j in range(len(v))]])
 ax[0,1].bar(np.arange(5)+(i-.5)*.35,v,.35,color=colors[i],yerr=np.maximum(0,err),capsize=2,label=f)
ax[0,1].set_xticks(range(5),[r['name'].capitalize()for r in a['archetypes']['Pure']],rotation=20)
ax[0,1].set_ylabel('Wins per entry (%)');ax[0,1].set_title('B: 160 entries/type/format; seed-cluster CI')
rows=a['personalities']['Pure'];bottom=np.zeros(5)
for p,c in zip(['Conserve','Maintain','Push','Sprint'],['#66c2a5','#8da0cb','#fc8d62','#e78ac3']):
 values=np.array([r['paceShares'][p]['mean']*100 for r in rows]);ax[0,2].bar(range(5),values,bottom=bottom,label=p,color=c);bottom+=values
ax[0,2].set_xticks(range(5),[r['name'].capitalize()for r in rows],rotation=20)
ax[0,2].set_ylabel('Issued pace-preference time (%)');ax[0,2].set_title('C: Pure profiles; n=160 entries/profile');ax[0,2].legend(fontsize=8)
for panel,panel_data,title in [(ax[1,0],a,'D: front-row sign effects (20 pairs)'),(ax[1,1],s,'Supplement: rear-row sign effects (10 pairs)')]:
 rows=[r for r in panel_data['signs']['Combat']if not r['arm'].startswith('lifecycle')]
 for j,r in enumerate(rows):
  z=r['comparison']['metrics']['time'];ci=z['ci95'];panel.errorbar(z['mean'],j,xerr=[[max(0,z['mean']-ci[0])],[max(0,ci[1]-z['mean'])]],fmt='o',color='#386cb0',capsize=3)
 panel.set_yticks(range(len(rows)),[r['arm']for r in rows]);panel.axvline(0,color='gray',ls='--',lw=1)
 panel.set_xlabel('Paired finish-time change (s); negative = faster')
 panel.set_title(title+'\nCombat; 95% paired bootstrap CI',fontsize=10)
attrs=a['sensitivity']['Pure'];x=np.arange(len(attrs))
for i,f in enumerate(['Pure','Combat']):
 vals=[r['comparison']['metrics']['time']['mean']for r in a['sensitivity'][f]]
 ax[1,2].bar(x+(i-.5)*.35,vals,.35,color=colors[i],label=f)
ax[1,2].set_xticks(x,[r['attribute'].replace('beasts.','Beast ').replace('driver.','Driver ')for r in attrs],rotation=25,ha='right')
ax[1,2].set_ylabel('Paired time change for +10 attribute (s)')
ax[1,2].set_title('S: exploratory, only four paired conditions/attribute')
fig.suptitle('Blood and Thunder Phase 2 — measurement only; no gameplay tuning',fontsize=15)
for p in ax.flat:p.spines[['top','right']].set_visible(False)
(root/'figures').mkdir(exist_ok=True)
fig.savefig(root/'figures/phase2-summary.svg')
fig.savefig(root/'figures/phase2-summary.png',dpi=150)
