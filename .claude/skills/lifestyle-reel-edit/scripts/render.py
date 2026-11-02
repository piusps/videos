#!/usr/bin/env python3
"""Lifestyle-Reel-Renderer (NL-Format). Plan-JSON -> fertiges 1080x1920 MP4 + Version ohne Musik.

python3 -I render.py plan.json            # rendert
python3 -I render.py --beats music.mp3     # nur Beat-Analyse (BPM, erster Beat)

Plan (alle Zeiten in Sekunden):
{
  "library": "~/Documents/niklas-lifestyle",      # clips.json + library/
  "music": "~/Documents/niklas-lifestyle/music/x.mp3",
  "music_offset": 0.0,                            # Startpunkt im Song (auf Beat legen)
  "voice_lufs": -14, "music_under": 20,           # Voiceover: Stimme auf -14 LUFS, Musik 20 dB darunter (music_gain = Feintrimm)
  "overlay": "~/…/subs.mov",                     # optional: transparente Ebene (z. B. Remotion-Untertitel)
  "ambient": 0.12,                                # Originalton der Clips (0 = aus)
  "grade": "riviera",                             # riviera | alpine | night | none
  "shots": [ {"clip":"NL22","in":0.4,"beats":4,"speed":1.0,"push":1.06,"flip":false} ],
  "texts": [ {"from":0.0,"to":3.0,"text":"freiheit ist kein ort.","style":"statement"} ],
  "out": "~/Desktop/.../final.mp4"
}
Shot-Länge = beats * 60/bpm, damit jeder Schnitt auf einem Beat liegt.
"""
import json, os, re, subprocess, sys, array, math, tempfile, shutil

BROLL = "/Users/pius/LinkedIn Generator/broll"
FF = BROLL + "/node_modules/ffmpeg-static/ffmpeg"
FP = BROLL + "/node_modules/@ffprobe-installer/darwin-arm64/ffprobe"
FONTS = {
    "statement": "/Users/pius/LinkedIn Generator/broll/public/fonts/Inter-Medium.ttf",
    "serif": "/System/Library/Fonts/Supplemental/Georgia Italic.ttf",
    "bold": "/Users/pius/LinkedIn Generator/broll/public/fonts/Inter-SemiBold.ttf",
    "sub": "/Users/pius/LinkedIn Generator/broll/public/fonts/Inter-SemiBold.ttf",
    "lux": "/Users/pius/Documents/niklas-lifestyle/fonts/CormorantGaramond-SemiBold.ttf",
    "lux-i": "/Users/pius/Documents/niklas-lifestyle/fonts/CormorantGaramond-SemiBoldItalic.ttf",
}
W, H, FPS = 1080, 1920, 30

GRADES = {
    # warm Highlights, kühle Schatten, leicht gefadete Schwärzen, Rot runter (Haut)
    "riviera": "eq=contrast=1.07:saturation=0.94:gamma=0.98,"
               "colorbalance=rs=-0.03:gs=0.0:bs=0.04:rm=0.01:bm=-0.01:rh=0.05:gh=0.02:bh=-0.04,"
               "curves=all='0/0.035 0.5/0.5 1/0.97',hue=s=1",
    "alpine":  "eq=contrast=1.05:saturation=0.9:gamma=0.97,"
               "colorbalance=rs=-0.02:bs=0.05:rh=0.04:gh=0.01:bh=-0.02,"
               "curves=all='0/0.04 0.5/0.5 1/0.96'",
    "night":   "eq=contrast=1.04:saturation=0.9:gamma=1.12:brightness=0.03,"
               "colorbalance=rs=-0.02:bs=0.05:rh=0.05:bh=-0.03,curves=all='0/0.05 1/0.95'",
    # "cinema" (seit 2026-10-29, Pius: "gutes Colorgrading, cinematisch, alle B-Rolls kamera- und farbtechnisch gleich"):
    # Filmkurve mit angehobenen Schwärzen und weicher Highlight-Schulter, Teal in den Schatten, warme Highlights,
    # Sättigung runter. Läuft NACH dem Per-Clip-Abgleich (match_filter), dadurch sehen alle Clips gleich aus.
    "cinema":  "curves=r='0/0.035 0.25/0.215 0.5/0.505 0.78/0.80 1/0.955':"
               "g='0/0.045 0.25/0.225 0.5/0.50 0.78/0.785 1/0.95':"
               "b='0/0.075 0.25/0.255 0.5/0.49 0.78/0.755 1/0.915',"
               "eq=contrast=1.05:saturation=0.86,colorbalance=rs=-0.03:bs=0.025:rh=0.025:bh=-0.02",
    "none": "null",
}
FINISH = "unsharp=5:5:0.55:5:5:0.0,noise=alls=5:allf=t,vignette=angle=PI/5.5"
FINISH_LIGHT = "unsharp=5:5:0.5:5:5:0.0,noise=alls=3:allf=t,vignette=angle=PI/7"
# cinema: Schärfe kommt schon per cas pro Clip, hier nur feines Filmkorn + Vignette
FINISH_CINEMA = "noise=alls=4:allf=t+u,vignette=angle=PI/6"


def x(p): return os.path.expanduser(p)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit("ffmpeg-Fehler:\n" + r.stderr[-3000:])
    return r


def beats(path, lo=80, hi=160):
    """Einfache Beat-Analyse ohne numpy: Onset-Hüllkurve bei 100 Hz + Autokorrelation."""
    raw = subprocess.run([FF, "-v", "error", "-i", path, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"],
                         capture_output=True).stdout
    a = array.array("h", raw)
    hop = 80  # 10 ms
    env = [sum(abs(v) for v in a[i:i + hop]) / hop for i in range(0, len(a) - hop, hop)]
    on = [max(0.0, env[i] - env[i - 1]) for i in range(1, len(env))]
    n = min(len(on), 3000)
    best, bpm = -1, 120.0
    for lag in range(int(6000 / hi), int(6000 / lo) + 1):
        s = sum(on[i] * on[i + lag] for i in range(n - lag))
        if s > best: best, bpm = s, 6000.0 / lag
    per = 6000.0 / bpm
    # Phase: Gitter-Offset mit maximaler Onset-Summe
    ph = max(range(int(per)), key=lambda o: sum(on[int(o + k * per)] for k in range(int((n - o) / per))))
    return round(bpm, 2), round(ph / 100.0, 3)


def esc(t):
    return t.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")


def text_filter(t):
    st = t.get("style", "statement")
    size = {"statement": 50, "serif": 58, "bold": 54, "sub": 56, "lux": 68, "lux-i": 72}[st]
    y = t.get("y", "(h*0.40)")
    fi, fo = t["from"], t["to"]
    lux = st.startswith("lux")
    if st == "sub":
        alpha = "1"
    elif lux:  # weiches Einblenden 0,18 s, hartes Ende (nächster Chunk übernimmt)
        alpha = f"if(lt(t,{fi}+0.18),(t-{fi})/0.18,1)"
    else:
        alpha = f"if(lt(t,{fi}+0.25),(t-{fi})/0.25,if(gt(t,{fo}-0.25),({fo}-t)/0.25,1))"
    color = "0xF3E6C4" if st == "lux-i" else "white"
    txt = t["text"]
    if lux and "\n" not in txt and len(txt) > 22:  # ausgewogen auf 2 Zeilen umbrechen
        ws = txt.split(); best = min(range(1, len(ws)), key=lambda i: abs(len(" ".join(ws[:i])) - len(" ".join(ws[i:]))))
        txt = " ".join(ws[:best]) + "\n" + " ".join(ws[best:])
    lines = txt.split("\n")
    out = []
    for k, ln in enumerate(lines):
        yy = f"{y}+{k}*{int(size * 1.15)}"
        if lux:  # steigt 12 px auf, während es einblendet
            yy = f"{yy}+12*(1-min(1,(t-{fi})/0.25))"
        extra = ("borderw=1:bordercolor=black@0.5:" if st == "sub" else
                 "borderw=1:bordercolor=black@0.18:" if lux else "")
        shadow = "shadowcolor=black@0.45:shadowx=0:shadowy=3:" if lux else "shadowcolor=black@0.6:shadowx=0:shadowy=2:"
        if lux:  # weicher dunkler Halo unter der Schrift (statt CapCut-Kontur)
            for bw, a in ((14, 0.07), (8, 0.10), (4, 0.14)):
                out.append(f"drawtext=fontfile='{FONTS[st]}':text='{esc(ln)}':fontsize={size}:fontcolor=black@0:"
                           f"x=(w-text_w)/2:y='{yy}':borderw={bw}:bordercolor=black@{a}:"
                           f"enable='between(t,{fi},{fo})':alpha='{alpha}'")
        out.append(f"drawtext=fontfile='{FONTS[st]}':text='{esc(ln)}':fontsize={size}:fontcolor={color}:"
                   f"x=(w-text_w)/2:y='{yy}':{shadow}" + extra +
                   f"enable='between(t,{fi},{fo})':alpha='{alpha}'")
    return ",".join(out)


def match_filter(src, ss, dur, strength=0.6):
    """Per-Clip-Abgleich vor dem Grade: Belichtung auf Ziel-Luma, Farbstich halb neutralisieren (Gray World)."""
    rs = gs = bs = 0.0; n = 0
    for k in range(3):
        raw = subprocess.run([FF, "-v", "error", "-ss", f"{ss + dur * (k + 0.5) / 3:.3f}", "-i", src, "-frames:v", "1",
                              "-vf", "scale=36:64", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
        for i in range(0, len(raw) - 2, 3):
            rs += raw[i]; gs += raw[i + 1]; bs += raw[i + 2]; n += 1
    if not n: return "null"
    r, g, b = rs / n / 255, gs / n / 255, bs / n / 255
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    m = (r + g + b) / 3
    gain = lambda c: max(0.88, min(1.12, (m / max(c, 1e-3)) ** (0.5 * strength)))
    tgt = 0.40 if y < 0.40 else 0.46 if y > 0.46 else y  # nur zu dunkle/zu helle Clips anfassen
    gam = max(0.8, min(1.35, (math.log(max(y, 0.02)) / math.log(tgt)) ** strength)) if y > 0.02 else 1.0
    return (f"colorchannelmixer=rr={gain(r):.3f}:gg={gain(g):.3f}:bb={gain(b):.3f},"
            f"eq=gamma={gam:.3f}")


def main(plan_path):
    P = json.load(open(plan_path))
    lib = x(P.get("library", "~/Documents/niklas-lifestyle"))
    clips = {c["id"]: c for c in json.load(open(lib + "/clips.json"))}
    music = x(P["music"])
    bpm = P.get("bpm") or beats(music)[0]
    spb = 60.0 / bpm
    grade = GRADES[P.get("grade", "riviera")]
    tmp = tempfile.mkdtemp(prefix="nl-")
    segs, total = [], 0.0
    for i, s in enumerate(P["shots"]):
        c = clips[s["clip"]]
        dur = s.get("dur") or s["beats"] * spb
        sp = s.get("speed", 1.0)
        push = s.get("push", 1.0 if dur < 1.5 else 1.04)
        src = f"{lib}/library/{c['file']}"
        zoom, cy = s.get("zoom", 1.0), s.get("cy", 0.5)  # statischer Ausschnitt (z. B. Schild oben wegcroppen)
        crop = f"crop={W}:{H}:(iw-{W})/2:(ih-{H})*{cy}"
        if push > 1.0 or zoom > 1.0:
            sc = (f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,"
                  f"scale=w='{W}*{zoom}*(1+({push}-1)*t/{dur:.3f})':h=-2:eval=frame:flags=lanczos,{crop}")
        else:
            sc = f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,{crop}"
        # Qualität: vor dem Hochskalieren Kompressionsrauschen glätten, danach adaptiv schärfen
        lowres = int(str(c.get("aufloesung", "1080x1920")).split("x")[0]) < 1000
        pre = "hqdn3d=2.5:2:5:4," if lowres else "hqdn3d=1.2:1:3:3,"
        mt = match_filter(src, s.get("in", 0), dur * sp) if P.get("match", True) else "null"
        vf = (f"setpts=PTS/{sp},fps={FPS},{pre}{sc},setsar=1,cas=0.55,{mt},{grade}"
              + (",hflip" if s.get("flip") else ""))
        af = f"atempo={sp}" if sp != 1.0 and 0.5 <= sp <= 2 else "anull"
        o = f"{tmp}/s{i:03d}.mp4"
        run([FF, "-v", "error", "-y", "-ss", str(s.get("in", 0)), "-t", f"{dur * sp + 0.2:.3f}", "-i", src,
             "-vf", vf, "-af", af + ",aresample=48000", "-t", f"{dur:.3f}",
             "-c:v", "libx264", "-crf", "12", "-preset", "fast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
             "-ac", "2", o])
        segs.append(o); total += dur
    lst = f"{tmp}/list.txt"
    open(lst, "w").write("".join(f"file '{s}'\n" for s in segs))
    cat = f"{tmp}/cat.mp4"
    run([FF, "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", cat])
    fin = {"light": FINISH_LIGHT, "cinema": FINISH_CINEMA}.get(P.get("finish"), FINISH)
    vf = fin + "".join("," + text_filter(t) for t in P.get("texts", []))
    out = x(P["out"]); os.makedirs(os.path.dirname(out), exist_ok=True)
    amb = P.get("ambient", 0.12)
    fade = f"afade=t=out:st={total - 1.2:.2f}:d=1.2"
    mo = P.get("music_offset", 0.0)
    mg = P.get("music_gain", 0.9)
    enc = ["-c:v", "libx264", "-crf", "16", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p",
           "-movflags", "+faststart", "-c:a", "aac", "-b:a", "256k", "-ar", "48000"]
    voice = x(P["voice"]) if P.get("voice") else None
    vd = int(P.get("voice_delay", 0) * 1000)
    def lufs(f, ss=0.0, t=None):  # integrierte Lautheit eines Abschnitts (EBU R128)
        r = subprocess.run([FF, "-hide_banner", "-nostats", "-ss", str(ss), *(["-t", str(t)] if t else []), "-i", f,
                            "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
        return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1])
    # Mix seit 2026-10-29 (Pius: "Musik viel zu laut und schepprig, Stimme zu leise"): Stimme und Song erst einzeln
    # auf feste Lautheit einmessen, Musik liegt dann music_under dB (Standard 20) unter der Stimme. Kein loudnorm
    # auf dem Gesamtmix mehr (das hat gepumpt), nur ein Limiter.
    VL = P.get("voice_lufs", -14.0)
    vg = 10 ** ((VL - lufs(voice)) / 20) if voice else 1.0
    vchain = (f"[2:a]{P.get('voice_filter', 'anull')},highpass=f=70,volume={vg:.3f},"
              f"acompressor=threshold=0.25:ratio=2.5:attack=5:release=120:makeup=1,"
              f"adelay={vd}|{vd},aresample=48000,aformat=channel_layouts=stereo,asplit=2[vo][vs];")
    if voice:  # Musik-Pegel relativ zur Stimme; music_gain bleibt als Feinregler (1.0 = neutral)
        ml = lufs(music, mo, total)
        mg = 10 ** ((VL - P.get("music_under", 20.0) - ml) / 20) * P.get("music_gain", 1.0)
        mus_eq = "equalizer=f=3000:t=q:w=1:g=-4,lowpass=f=14000,"
    else:
        mus_eq = ""
    norm = "alimiter=limit=0.89:attack=5:release=60"
    # 1) mit Musik (bei Voice: Musik per Sidechain unter die Stimme geduckt)
    ins = ["-i", cat, "-ss", str(mo), "-i", music] + (["-i", voice] if voice else [])
    if voice:
        fc = (f"[0:v]{vf}[v];[0:a]volume={amb}[a0];{vchain}"
              f"[1:a]{mus_eq}volume={mg:.4f},afade=t=in:d=0.05,{fade}[m0];[m0][vs]sidechaincompress=threshold=0.05:ratio=2:attack=30:release=400[a1];"
              f"[a0][a1][vo]amix=inputs=3:normalize=0,{norm}[a]")
    else:
        fc = (f"[0:v]{vf}[v];[0:a]volume={amb}[a0];[1:a]volume={mg},afade=t=in:d=0.05,{fade}[a1];"
              f"[a0][a1]amix=inputs=2:normalize=0,alimiter=limit=0.89[a]")
    def with_overlay(fc, ins):  # transparente Untertitel-Ebene (Remotion, ProRes 4444) obendrauf
        if not P.get("overlay"): return fc, ins
        k = ins.count("-i")
        return fc.replace("[0:v]" + vf + "[v]", f"[0:v]{vf}[vb];[{k}:v]format=yuva444p10le[ov];[vb][ov]overlay=0:0:format=auto[v]", 1), ins + ["-i", x(P["overlay"])]
    fc, ins = with_overlay(fc, ins)
    run([FF, "-v", "error", "-y", *ins, "-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-t", f"{total:.3f}", *enc, out])
    # 2) ohne Musik (für den Song in der App): Stimme + Atmo
    if voice:
        fc2 = (f"[0:v]{vf}[v];[0:a]volume={amb}[a0];{vchain.replace('[2:a]', '[1:a]')}[vs]anullsink;"
               f"[a0][vo]amix=inputs=2:normalize=0,{fade},{norm}[a]")
        ins2 = ["-i", cat, "-i", voice]
    else:
        fc2 = f"[0:v]{vf}[v];[0:a]volume={amb},{fade}[a]"; ins2 = ["-i", cat]
    fc2, ins2 = with_overlay(fc2, ins2)
    run([FF, "-v", "error", "-y", *ins2, "-filter_complex", fc2, "-map", "[v]", "-map", "[a]", "-t", f"{total:.3f}", *enc,
         out.replace(".mp4", "_ohne-musik.mp4")])
    # Gesamtpegel auf Ziel (-14 LUFS) ziehen: Ton messen, statisch verstärken, Limiter, Video nur kopieren
    if voice:
        for f in (out, out.replace(".mp4", "_ohne-musik.mp4")):
            g = P.get("target_lufs", -14.0) - lufs(f)
            if abs(g) > 0.3:
                t2 = f"{tmp}/lvl.mp4"
                run([FF, "-v", "error", "-y", "-i", f, "-map", "0", "-c:v", "copy", "-af",
                     f"volume={g:.2f}dB,alimiter=limit=0.89:attack=5:release=60:level=disabled",
                     "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart", t2])
                shutil.move(t2, f)
    shutil.rmtree(tmp)
    print(json.dumps({"out": out, "bpm": bpm, "dauer": round(total, 2), "shots": len(segs)}))


if __name__ == "__main__":
    if sys.argv[1] == "--beats":
        print(beats(x(sys.argv[2])))
    else:
        main(sys.argv[1])
