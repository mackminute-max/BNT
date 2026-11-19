import subprocess, pathlib, concurrent.futures, json, os
root=pathlib.Path('/workspace/deliverables/e4-optimization/regression');root.mkdir(exist_ok=True)
legacy=['scripts/m2-d/browser.mjs','scripts/m2-c/browser.mjs','scripts/m2-b-browser.mjs','scripts/m2-a-browser.mjs','scripts/persistence-browser.mjs','scripts/browser-test.mjs','scripts/track-expansion/browser.mjs','scripts/circuit-rally/browser.mjs','scripts/combat-ai-refinement/browser.mjs','scripts/m2-e/browser.mjs','scripts/m2-e/e2-e3-browser.mjs','scripts/m2-e/e3-completion-browser.mjs','scripts/m2-e/championship-clock-parity.mjs','scripts/m2-e/clock-parity.mjs']
modern=['stage2-browser','stage2-files','stage2-reopen','stage2-quota','stage2-retained','stage1-browser','stage1-faults']
def run(item):
 kind,path=item;name=path.replace('/','_').replace('.mjs','');out=root/name;out.mkdir(exist_ok=True);env=os.environ.copy();env['BNT_E4_STAGE2_OUT']=str(out);env['BNT_E4_STAGE1_OUT']=str(out)
 with (out/'process.log').open('w') as f:r=subprocess.run(['node',path],cwd='/tmp/bnt-perf-regression' if kind=='legacy' else '/workspace/BNT',env=env,stdout=f,stderr=subprocess.STDOUT)
 (out/'process.exit').write_text(str(r.returncode));print(name,r.returncode,flush=True);return {'script':path,'exit':r.returncode,'output':str(out)}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(run,[('legacy',p) for p in legacy]+[('modern','scripts/m2-e/e4/'+p+'.mjs') for p in modern]))
(root/'results.json').write_text(json.dumps(results,indent=2))
