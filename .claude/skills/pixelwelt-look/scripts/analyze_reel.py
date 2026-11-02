#!/usr/bin/env python3
"""Frame-by-frame breakdown of one reference reel.

usage (no -I, it hides Pillow):
      python3 analyze_reel.py <video.mp4> <out_dir> [--step 0.5]

Writes into out_dir:
  meta.json      duration, size, fps, shot cuts, shot-length stats, palette
  frames/        one PNG every --step seconds (t_XX.XX.png)
  sheet_NN.png   contact sheets, 4x3 frames each, timestamp burned in
  shots.png      first frame of every shot, labelled with start time and length
Tools: ffmpeg/ffprobe from broll/node_modules (ffmpeg-static, @ffprobe-installer), Pillow.
"""
import json, os, re, subprocess, sys, glob, statistics
from PIL import Image, ImageDraw, ImageFont

BROLL = "/Users/pius/LinkedIn Generator/broll"
FFMPEG = subprocess.check_output(["node", "-p", "require('ffmpeg-static')"], cwd=BROLL, text=True).strip()
FFPROBE = subprocess.check_output(["node", "-p", "require('@ffprobe-installer/ffprobe').path"], cwd=BROLL, text=True).strip()


def run(args):
    return subprocess.run(args, capture_output=True, text=True)


def probe(video):
    out = run([FFPROBE, "-v", "error", "-select_streams", "v:0", "-show_entries",
               "stream=width,height,r_frame_rate:format=duration", "-of", "json", video]).stdout
    j = json.loads(out)
    s = j["streams"][0]
    num, den = s["r_frame_rate"].split("/")
    return {"width": s["width"], "height": s["height"], "fps": round(int(num) / int(den), 2),
            "duration": round(float(j["format"]["duration"]), 2)}


def cuts(video, threshold):
    err = run([FFMPEG, "-hide_banner", "-i", video, "-vf", f"select='gt(scene,{threshold})',showinfo",
               "-an", "-f", "null", "-"]).stderr
    return [round(float(m), 2) for m in re.findall(r"pts_time:([0-9.]+)", err)]


def font(size):
    for p in ["/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/System/Library/Fonts/Helvetica.ttc"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def label(im, text):
    d = ImageDraw.Draw(im)
    f = font(max(14, im.width // 14))
    d.rectangle([0, 0, im.width, f.size + 10], fill=(0, 0, 0))
    d.text((6, 4), text, fill=(255, 230, 0), font=f)
    return im


def grab(video, t, path, width=360):
    run([FFMPEG, "-loglevel", "error", "-y", "-ss", f"{t:.2f}", "-i", video, "-frames:v", "1",
         "-vf", f"scale={width}:-2", path])


def sheet(paths, labels, out, cols=4):
    ims = [label(Image.open(p).convert("RGB"), l) for p, l in zip(paths, labels)]
    w, h = ims[0].size
    rows = (len(ims) + cols - 1) // cols
    s = Image.new("RGB", (cols * w, rows * h), "white")
    for i, im in enumerate(ims):
        s.paste(im, ((i % cols) * w, (i // cols) * h))
    s.save(out)


def palette(paths, n=10):
    counts = {}
    for p in paths:
        im = Image.open(p).convert("RGB").resize((90, 160))
        q = im.quantize(colors=8, method=Image.Quantize.MEDIANCUT)
        pal = q.getpalette()
        for count, idx in q.getcolors():
            r, g, b = pal[idx * 3: idx * 3 + 3]
            key = (r // 16 * 16, g // 16 * 16, b // 16 * 16)
            counts[key] = counts.get(key, 0) + count
    top = sorted(counts.items(), key=lambda kv: -kv[1])[:n]
    total = sum(counts.values())
    return [{"hex": "#%02X%02X%02X" % k, "share": round(v / total, 3)} for k, v in top]


def main():
    video, out = sys.argv[1], sys.argv[2]
    step = float(sys.argv[sys.argv.index("--step") + 1]) if "--step" in sys.argv else 0.5
    os.makedirs(f"{out}/frames", exist_ok=True)
    meta = probe(video)

    cut_list = cuts(video, 0.32)
    bounds = [0.0] + cut_list + [meta["duration"]]
    shots = [{"start": bounds[i], "len": round(bounds[i + 1] - bounds[i], 2)} for i in range(len(bounds) - 1)]
    lens = [s["len"] for s in shots]
    meta["shots"] = shots
    meta["shot_stats"] = {"count": len(shots), "median_s": round(statistics.median(lens), 2),
                          "mean_s": round(statistics.mean(lens), 2), "min_s": min(lens), "max_s": max(lens)}

    t, frames = 0.0, []
    while t < meta["duration"] - 0.05:
        p = f"{out}/frames/t_{t:05.2f}.png"
        grab(video, t, p)
        frames.append((t, p))
        t = round(t + step, 2)
    for i in range(0, len(frames), 12):
        chunk = frames[i:i + 12]
        sheet([p for _, p in chunk], [f"{t:.1f}s" for t, _ in chunk], f"{out}/sheet_{i // 12:02d}.png")

    shot_paths = []
    for i, s in enumerate(shots):
        p = f"{out}/frames/shot_{i:02d}.png"
        grab(video, s["start"] + 0.04, p, width=240)
        shot_paths.append(p)
    sheet(shot_paths, [f"{s['start']:.1f}s +{s['len']:.1f}" for s in shots], f"{out}/shots.png", cols=8)

    meta["palette"] = palette([p for _, p in frames])
    json.dump(meta, open(f"{out}/meta.json", "w"), indent=1)
    print(json.dumps({k: meta[k] for k in ["duration", "width", "height", "fps", "shot_stats"]}))
    print("palette", [c["hex"] for c in meta["palette"]])


if __name__ == "__main__":
    main()
