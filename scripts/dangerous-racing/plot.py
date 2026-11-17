import json,pathlib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
r=pathlib.Path('docs/phase2/dangerous-racing');a=json.loads((r/'analysis.json').read_text());cohorts=list(a['cohorts']);v=[a['cohorts'][k]['combat'] for k in cohorts]
plt.rcParams.update({'font.size':10,'svg.fonttype':'none'})
fig,axs=plt.subplots(1,3,figsize=(12,4.5),layout='constrained');colors=['#326b8f','#be8831','#a34747']
m=[x['metrics']['damage']['mean'] for x in v];lo=[m[i]-x['metrics']['damage']['ci95'][0] for i,x in enumerate(v)];hi=[x['metrics']['damage']['ci95'][1]-m[i] for i,x in enumerate(v)]
axs[0].bar(cohorts,m,color=colors,yerr=[lo,hi],capsize=4);axs[0].set(title='Condition damage per race',ylabel='Mean summed condition points')
y=[x['naturalRetirementRaces']/200*100 for x in v];axs[1].bar(cohorts,y,color=colors);axs[1].set(title='Races with damage retirement',ylabel='Observed races (%)');
for i,x in enumerate(v):axs[1].text(i,y[i]+1,f"{x['naturalRetirementRaces']}/200",ha='center')
y=[x['reactionFlips']/x['attackContests']*100 for x in v];axs[2].bar(cohorts,y,color=colors);axs[2].set(title='Same-state reaction threshold flips',ylabel='Fraction of actual contests (%)');axs[2].set_ylim(0,65)
for ax in axs:ax.spines[['top','right']].set_visible(False);ax.tick_params(axis='x',rotation=15)
fig.suptitle('Dangerous Racing: unchanged baseline, 200 Combat races per cohort',fontsize=14)
fig.supxlabel('Damage error bars: 95% seed-cluster bootstrap (40 seed blocks). Other bars are descriptive; reaction contrast is not a defense-off race.',fontsize=8)
(r/'figures').mkdir(exist_ok=True);fig.savefig(r/'figures/dangerous-racing-summary.svg');fig.savefig(r/'figures/dangerous-racing-summary.png',dpi=180)
