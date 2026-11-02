# usage: facefocus.py <avatar.mp4> [panelFrac]  -> JSON avatar framing for split layouts (focus, scale, faceAt) + safety stats
import sys, subprocess, tempfile, glob, os, json, statistics as st
FF='/Users/pius/LinkedIn Generator/broll/node_modules/ffmpeg-static/ffmpeg'
FACE=os.path.join(os.path.dirname(os.path.abspath(__file__)),'face')
vid=sys.argv[1]; pf=float(sys.argv[2]) if len(sys.argv)>2 else 0.48
d=tempfile.mkdtemp()
subprocess.run([FF,'-v','error','-i',vid,'-vf','fps=2,scale=540:960',f'{d}/f%04d.png'],check=True)
rows=[l.split() for l in subprocess.run([FACE]+sorted(glob.glob(f'{d}/*.png')),capture_output=True,text=True).stdout.splitlines() if l and not l.endswith('none')]
cx=[(float(r[1])+float(r[3])/2)/540 for r in rows]; cy=[(float(r[2])+float(r[4])/2)/960 for r in rows]; fh=[float(r[4])/960 for r in rows]
H=1920; PH=round(H*pf); h0=H-PH
fy=st.median(cy); fhh=max(fh)
# face box centre at 50% of the speaker panel (eyes ≈ upper third), check head room / chin over the whole clip
faceAt=0.5
top=PH+h0*faceAt-fy*H  # video top in frame coords (scale 1)
worst_top=min(PH, *(top+(c-1.0*f/1)*H for c,f in zip(cy,fh)))
lo=min(top+(c-f/2)*H for c,f in zip(cy,fh)); hi=max(top+(c+f/2)*H for c,f in zip(cy,fh))
print(json.dumps({"focus":{"x":round(st.median(cx),3),"y":round(fy,3)},"scale":1.0,"faceAt":faceAt,"panelFrac":pf,
  "stats":{"frames":len(rows),"faceH_px":round(fhh*H),"faceTop_min":round(lo),"chin_max":round(hi),"panelBottom":PH,"x_range":[round(min(cx),3),round(max(cx),3)],"y_range":[round(min(cy),3),round(max(cy),3)]}}))
