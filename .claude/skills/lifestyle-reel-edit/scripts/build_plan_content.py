import json,re,os
LIB=os.path.expanduser('~/Documents/niklas-lifestyle')
D=0.15
a=json.load(open('voice/e_v4-wie-v1.align.json'))
ch,s,e=a['characters'],a['character_start_times_seconds'],a['character_end_times_seconds']
words=[];cur='';st=None
for c,cs,ce in zip(ch,s,e):
    if c.isspace():
        if cur: words.append([cur,st/1.04+D,last/1.04+D]); cur=''
        continue
    if not cur: st=cs
    cur+=c; last=ce
if cur: words.append([cur,st/1.04+D,last/1.04+D])
words=[w for w in words if not w[0].startswith('[')]
END=round(words[-1][2]+1.6,2)
# Inhalts-Einheiten: (Wörter, Aussage-Tag, optional fester Clip/In)
U=[(5,"hook-provokation",("NL16",1.0)),
   (5,"frage-nachdenken",None),
   (4,"autoritaet",("NL02",3.5)),
   (6,"autoritaet",("NL01",1.0)),
   (2,"freiheit",("NL04",0.5)),
   (11,"geld-umsatz",None),
   (5,"kunden-verkauf",None),
   (5,"telefon-deal",None),
   (5,"ironie-fassade",("NL21",0.3)),
   (8,"investoren-grossgeld",None),
   (6,"kreislauf-system",None),
   (7,"ironie-fassade",("NL32",2.0)),
   (5,"warnung-wahrheit",("NL01",10.0)),
   (7,"geld-umsatz",("NL09",3.0)),
   (6,"cta-abschluss",("NL22",0.8)),
   (9,"luxus-ergebnis",("NL12",0.5))]
assert sum(n for n,_,_ in U)==len(words),(sum(n for n,_,_ in U),len(words))
labels=json.load(open(f'{LIB}/labels.json'))
ORT={c['id']:c['ort'] for c in json.load(open(f'{LIB}/clips.json'))}
used=set(); shots=[]; i=0; starts=[]
for n,tag,fix in U: starts.append(0.0 if i==0 else round(words[i][1]-0.04,3)); i+=n
starts.append(END)
fixed={f[0] for _,_,f in U if f}
log=[]
for k,(n,tag,fix) in enumerate(U):
    d=round(starts[k+1]-starts[k],3)
    if fix: clip,inn=fix; why='fest'
    else:
        prev=shots[-1]['clip'] if shots else None
        cand=[l for l in labels if tag in l['passt_zu'] and l['clip'] not in used|fixed and l['clip']!=prev and (not prev or ORT[l['clip']]!=ORT[prev]) and l['bis']-l['von']>=d-0.3]
        cand.sort(key=lambda l:(-l['qualitaet'],l['passt_zu'].index(tag)))
        l=cand[0]; clip,inn=l['clip'],l['von']; why='label'
    used.add(clip)
    shots.append({"clip":clip,"in":inn,"dur":d})
    t0=sum(x for x,_,_ in U[:k]); log.append(f"{starts[k]:5.2f} {d:4.2f}s {clip}@{inn:<4} [{tag}/{why}] {' '.join(w[0] for w in words[t0:t0+n])}")
texts=[];cur=[]
for j,(w,a0,b0) in enumerate(words):
    cur.append((w,a0,b0))
    if re.search(r'[.,?!:]$',w) or j==len(words)-1 or (len(cur)>=4 and not re.search(r'[.,?!:]$',words[j+1][0])):
        texts.append([' '.join(x[0] for x in cur).rstrip(',:'),cur[0][1]]); cur=[]
KEY=re.compile(r'angelogen|Million|Testkunden|gekündigt|Gratis|Konto|UMSATZ|fünf Fragen')
T=[{"from":round(a0,3),"to":round(texts[j+1][1] if j+1<len(texts) else words[-1][2]+0.6,3),"text":t,"style":"lux-i" if KEY.search(t) else "lux","y":"(h*0.665)"} for j,(t,a0) in enumerate(texts)]
drop=starts[2]  # Drop von Timeless (24.036 s) auf den Autoritäts-Cut
plan={"music":f"{LIB}/music/referenz/timeless-instrumental.mp3","bpm":120,"music_offset":round(24.036-drop,3),
 "music_gain":0.8,"voice":f"{LIB}/reels/01-angelogen/v4/voice/voice_final.wav","voice_delay":D,
 "ambient":0,"grade":"riviera","finish":"light","shots":shots,"texts":[],"overlay":os.path.abspath("subs.mov"),
 "out":os.path.expanduser("~/Desktop/Niklas Lifestyle/2026-10-28 Du wirst angelogen/v4/01-angelogen-v4.mp4")}
json.dump(plan,open('plan.json','w'),indent=1,ensure_ascii=False)
print('\n'.join(log)); print(len(shots),'Shots,',END,'s, Ø',round(END/len(shots),2),'s/Shot')

# Untertitel-Ebene (Remotion NLSubs): Wort für Wort, pro Chunk max. 1 großes Schlüsselwort
BIG=['angelogen','Million','Millionen','Investoren','Testkunden','gekündigt','Gratis-Piloten','Investorengeld','KI-Firmen','Startup','Umsatz','Konto','UMSATZ','Fragen','Zahl','vollen','bezahlt']
SMALL=set('du in die der das den dem und es mit auf von ein eine einer zu da dir ich nur ins an als wenn oft hab wird wirst nicht mal zum dann denen jede deshalb immer davon steckt drin haben zwei knapp wie viel liegt schick nie es'.split())
chunks=[];cur=[]
for j,(w,a0,b0) in enumerate(words):
    cur.append((w,a0,b0))
    end=re.search(r'[.?!]$',w) or (re.search(r'[,:]$',w) and len(cur)>=2) or j==len(words)-1 or (len(cur)>=4 and not re.search(r'[.,?!:]$',words[j+1][0]))
    if end:
        ws=[];big=False
        for x,a1,b1 in cur:
            core=re.sub(r'[.,?!:]','',x)
            if not big and core in BIG: sz='big'; big=True
            elif core.lower() in SMALL: sz='small'
            else: sz='norm'
            ws.append({"t":x.rstrip(',:'),"s":round(a1,3),"e":round(b1,3),"size":sz})
        chunks.append({"from":round(cur[0][1]-0.03,3),"words":ws}); cur=[]
for j,c in enumerate(chunks): c["to"]=chunks[j+1]["from"] if j+1<len(chunks) else round(END,3)
json.dump({"chunks":chunks,"y":1240,"seconds":END},open('subs_props.json','w'),ensure_ascii=False)
print(' | '.join(' '.join(('**'+w['t'] if w['size']=='big' else w['t'].lower() if w['size']=='small' and False else w['t']) for w in c['words']) for c in chunks))
