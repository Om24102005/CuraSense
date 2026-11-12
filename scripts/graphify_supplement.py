# Adds graphify can't parse (CSS, env/lock/config files) as file-level nodes. Idempotent; run from repo root after graphify update.
import json, re, os
R='.'
g=json.load(open('graphify-out/graph.json'))
ids={n['id'] for n in g['nodes']}
def nid(p): return re.sub(r'[^a-z0-9]+','_',os.path.splitext(p)[0].lower()).strip('_')
def fid(p): return re.sub(r'[^a-z0-9]+','_',p.lower()).strip('_')
def node(i,label,p,ft='code',**kw):
    if i in ids: return
    ids.add(i); g['nodes'].append(dict(id=i,label=label,file_type=ft,source_file=p,source_location=None,_origin='supplement',community=None,community_name=None,norm_label=label.lower(),**kw))
def edge(s,t,rel,p,conf='EXTRACTED',score=1.0):
    if s in ids and t in ids: g['links'].append(dict(source=s,target=t,relation=rel,_origin='supplement',confidence=conf,confidence_score=score,source_file=p,source_location=None,weight=1.0))
css=[]
for r,ds,fs in os.walk('.'):
    ds[:]=[d for d in ds if d not in('node_modules','.git','graphify-out','dist')]
    for f in fs:
        if f.endswith('.css'): css.append(os.path.relpath(os.path.join(r,f)))
tsx=[]
for r,ds,fs in os.walk('frontend/src'):
    for f in fs:
        if f.endswith(('.tsx','.ts')): tsx.append(os.path.join(r,f))
tsxtxt={p:open(p,errors='ignore').read() for p in tsx}
for p in css:
    t=open(p,errors='ignore').read(); me=nid(p)
    node(me,os.path.basename(p),p,vars_defined=len(set(re.findall(r'(--[\w-]+)\s*:',t))))
    for m in re.findall(r'@import\s+[\'"]\.?/?([^\'"]+)',t):
        tgt=nid(os.path.join(os.path.dirname(p),m)) if not m.startswith('tailwind') else None
        if tgt: edge(me,tgt,'imports',p)
    for k in set(re.findall(r'@keyframes\s+([\w-]+)',t)):
        i=me+'_kf_'+re.sub(r'\W','_',k.lower()); node(i,'@keyframes '+k,p); edge(me,i,'defines',p)
    for k in set(re.findall(r'font-family:\s*[\'"]?([\w ]+)[\'"]?\s*;',t))if 'font-face' in t else []:
        i=me+'_font_'+re.sub(r'\W','_',k.lower()); node(i,'@font-face '+k,p); edge(me,i,'defines',p)
    # tsx -> css: import, and cs-* class usage
    base=os.path.basename(p)
    classes={c for c in re.findall(r'\.(cs-[\w-]+)',t)}
    for tp,tt in tsxtxt.items():
        s=nid(tp)
        if re.search(r'import\s+[\'"][^\'"]*'+re.escape(base),tt): edge(s,me,'imports',tp)
        used=[c for c in classes if c in tt]
        if used: edge(s,me,'references',tp,'INFERRED',0.85)
# other uncovered files: file-level nodes
extra={
 'frontend/run-dev.bat':'code','frontend/run-serve-dist.ps1':'code','.gitignore':'document',
 'frontend/.env.example':'document','backend/python/.env.example':'document',
 'frontend/.env':'document','backend/.env':'document',
 '.claude/settings.local.json':'document','pnpm-lock.yaml':'document','package-lock.json':'document',
 'frontend/package-lock.json':'document','backend/node/package-lock.json':'document',
 'pnpm-workspace.yaml':'document','package.json':'document','frontend/package.json':'document',
 'backend/node/package.json':'document','frontend/tsconfig.json':'document','backend/python/requirements.txt':'document',
 'start-dev.sh':'code','frontend/index.html':'document','frontend/src/legacy/_unused/lottie/pulse-dot.json':'document'}
for p,ft in extra.items():
    if os.path.exists(p): node(fid(p),os.path.basename(p),p,ft,note='env file: name only, contents never read' if p.endswith('.env') else None)
# legacy html -> css
edge(nid('frontend/src/legacy/_unused/_stray_sport-future.index.html'),nid('frontend/src/legacy/_unused/_stray_sport-future.style.css'),'references','frontend/src/legacy/_unused/_stray_sport-future.index.html','INFERRED',0.85)
# env example <-> env, package locks
for a,b in [('frontend/.env','frontend/.env.example'),('package-lock.json','package.json'),('frontend/package-lock.json','frontend/package.json'),('backend/node/package-lock.json','backend/node/package.json'),('pnpm-lock.yaml','package.json')]:
    edge(fid(a),fid(b),'derived_from' if 'lock' in a else 'conforms_to','.','INFERRED',0.85)
mx=max((n['community'] for n in g['nodes'] if n.get('community') is not None),default=0)+1
for n in g['nodes']:
    if n.get('community') is None: n['community']=mx; n['community_name']='Styles & Project Config'
json.dump(g,open('graphify-out/graph.json','w'),indent=1)
print('supplement:',len(g['nodes']),'nodes',len(g['links']),'links')
