import sys, subprocess, os, tempfile, glob
from PIL import Image
FACE=os.path.join(os.path.dirname(os.path.abspath(__file__)),'face')
def panel_bottom(im):
    # rows from top that are mostly light/flat (white panel); return y where they end
    w,h=im.size; px=im.convert('L').load(); y=0
    while y<h*0.7:
        row=[px[x,y] for x in range(0,w,8)]
        if sum(v>225 for v in row)/len(row)<0.6: break
        y+=2
    return y if y>h*0.15 else 0
for vid in sys.argv[1:]:
    d=tempfile.mkdtemp()
    subprocess.run(['/Users/pius/LinkedIn Generator/broll/node_modules/ffmpeg-static/ffmpeg','-v','error','-i',vid,'-vf','fps=1,scale=540:960',f'{d}/f%03d.png'],check=True)
    fr=sorted(glob.glob(f'{d}/*.png'))
    out=subprocess.run([FACE]+fr,capture_output=True,text=True).stdout.split('\n')
    bad=[]
    for i,line in enumerate(l for l in out if l):
        p=line.split(); f=p[0]
        im=Image.open(f); pb=panel_bottom(im)
        if p[1]=='none': bad.append((i,'no face',pb)); continue
        x,y,w,h=map(float,p[1:5])
        head_top=y-0.45*h; chin=y+h*1.05
        if pb and (head_top<pb or chin>960): bad.append((i,f'face y{y:.0f}-{y+h:.0f} headtop {head_top:.0f} panel {pb}',pb))
        elif not pb and (x<0 or x+w>540 or y<0 or y+h>958): bad.append((i,'face out of frame',pb))
    print(os.path.basename(vid), f'{len(fr)} frames, {len(bad)} bad')
    for b in bad: print('   t=%ds %s'%(b[0],b[1]))
