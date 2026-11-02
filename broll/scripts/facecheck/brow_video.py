# usage: brow_video.py <in.mp4> <brows.txt (540x960 landmarks)> <out.mp4> [amt] [--mirror strength]
# --mirror: transfer the mirrored image-left brow hair onto the right brow (fuller), then mild darkening
import sys, subprocess, re
import numpy as np
from PIL import Image
sys.path.insert(0, __import__("os").path.dirname(__file__))
from brow_fix import fix
from brow_mirror import fuller
FF = "/Users/pius/LinkedIn Generator/broll/node_modules/ffmpeg-static/ffmpeg"
src, lm, out = sys.argv[1:4]; amt = float(sys.argv[4]) if len(sys.argv) > 4 and not sys.argv[4].startswith("--") else 0.85
MIR = float(sys.argv[sys.argv.index("--mirror") + 1]) if "--mirror" in sys.argv else None
rows = sorted(l for l in open(lm) if " R " in l)
P = np.array([[list(map(float, p.split(","))) for p in l.split(" R ")[1].split()] for l in rows]) * 2.0  # frames x 6 x 2, full res
PL = np.array([[list(map(float, p.split(","))) for p in l.split(" L ")[1].split(" | ")[0].split()] for l in rows]) * 2.0
# temporal smoothing (centered 5-frame mean) against landmark jitter
K = 2
S = np.array([P[max(0, i - K):i + K + 1].mean(axis=0) for i in range(len(P))])
SL = np.array([PL[max(0, i - K):i + K + 1].mean(axis=0) for i in range(len(PL))])
W, H = 1080, 1920
dec = subprocess.Popen([FF, "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen([FF, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "25", "-i", "-", "-i", src,
                        "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "copy", out], stdin=subprocess.PIPE)
i = 0
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    img = Image.frombytes("RGB", (W, H), buf)
    poly = [tuple(p) for p in S[min(i, len(S) - 1)]]
    j = min(i, len(S) - 1)
    if MIR is not None: fuller(img, [tuple(p) for p in SL[j]], poly, MIR, amt)
    else: fix(img, poly, amt)
    enc.stdin.write(img.tobytes()); i += 1
enc.stdin.close(); enc.wait(); print("frames", i)
