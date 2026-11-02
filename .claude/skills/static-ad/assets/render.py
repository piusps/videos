#!/usr/bin/env python3
"""
Static-ad renderer: batch JSON -> HTML templates -> PNG via headless Chrome.

Usage: python3 render.py batch.json
batch.json = {"brand": "boilr", "out_dir": "...", "ads": [{"id": "...", "template": "signal-cards", ...}]}
Each ad renders at 1080x1350 (4:5 feed). Add "formats": ["4x5", "9x16"] to an ad for story too.
"""
import html, json, os, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
FONTS = HERE / "fonts"
BRANDS = HERE / "brands"
SIZES = {"4x5": (1080, 1350), "9x16": (1080, 1920), "1x1": (1080, 1080)}
CHROME_CANDIDATES = [
    "/Users/pius/LinkedIn Generator/broll/node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]

BRAND = {
    "boilr": {
        "name": "boilr.ai",
        "logo": BRANDS / "boilr" / "boilr-b.png",
        "green": "#005032", "green_card": "#0A5F45", "mint": "#DDEBE3",
        "bg": "#F5F5F1", "ink": "#111416", "muted": "#55575B", "label": "#3F6B58",
        "badge": "TRUSTED BY 100+ RECRUITMENT AGENCIES",
    },
}

e = html.escape


def br(text):
    """Escape, then turn \\n into <br>."""
    return e(text).replace("\n", "<br>")


def font_css():
    f = FONTS.as_uri()
    return f"""
@font-face{{font-family:Inter;src:url('{f}/Inter-Regular.ttf');font-weight:400}}
@font-face{{font-family:Inter;src:url('{f}/Inter-Medium.ttf');font-weight:500}}
@font-face{{font-family:Inter;src:url('{f}/Inter-SemiBold.ttf');font-weight:600}}
@font-face{{font-family:Inter;src:url('{f}/Inter-Bold.ttf');font-weight:700 900}}
@font-face{{font-family:Playfair;src:url('{f}/PlayfairDisplay-Italic.ttf');font-style:italic;font-weight:400 900}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}}
"""


# ---------------------------------------------------------------- templates

def signal_cards(ad, b, w, h):
    """Winner template (emp-static-signalscard, CPL 24.85 EUR): headline + 2x2 grid of dated signal cards."""
    tones = {
        "white": ("#FFFFFF", b["ink"], b["muted"], b["label"], "#E4E4E0"),
        "mint": (b["mint"], "#0F3B2A", "#35594A", "#2F5A48", "#C3D8CC"),
        "green": (b["green_card"], "#FFFFFF", "#D9ECE2", "#A9D9BF", "#2E7A5E"),
    }
    cards = []
    for c in ad["cards"][:4]:
        bg, ti, bo, la, rule = tones[c.get("tone", "white")]
        cards.append(f"""<div class="card" style="background:{bg}">
  <div class="lab" style="color:{la}">{e(c['label'])}</div>
  <div class="rule" style="background:{rule}"></div>
  <div class="ct" style="color:{ti}">{br(c['title'])}</div>
  <div class="cb" style="color:{bo}">{br(c.get('body',''))}</div></div>""")
    story = h > 1400
    top_pad = 250 if story else 40
    cta = ad.get("cta")
    cta_html = f"""<div class="cta"><span>{e(cta)}</span><span class="arrow">→</span></div>""" if cta else ""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{font_css()}
body{{width:{w}px;height:{h}px;background:{b['bg']};font-family:Inter;color:{b['ink']};position:relative;overflow:hidden}}
.wrap{{position:absolute;inset:{top_pad}px 72px 0 72px}}
.top{{display:flex;justify-content:space-between;align-items:center;margin-left:8px}}
.logo{{display:flex;align-items:center;gap:16px;font-weight:600;font-size:33px;letter-spacing:-.5px}}
.logo img{{width:64px;height:64px;border-radius:12px}}
.badge{{background:{b['mint']};color:#2F5A48;font-weight:600;font-size:14.5px;letter-spacing:1.6px;padding:17px 25px;border-radius:40px}}
h1{{margin-top:50px;font-weight:700;font-size:{ad.get('h1_size',62)}px;line-height:1.02;letter-spacing:-2.6px}}
h1 em{{display:block;font-family:Playfair;font-variant-numeric:lining-nums;font-feature-settings:"lnum" 1;font-style:italic;font-weight:800;color:{b['green']};font-size:{ad.get('accent_size',80)}px;letter-spacing:-2px;line-height:1.02;margin-top:-4px}}
.sub{{margin-top:22px;font-size:25px;line-height:1.45;color:{b['muted']};max-width:620px}}
.grid{{margin-top:{ad.get('grid_gap_top',56)}px;display:grid;grid-template-columns:1fr 1fr;gap:34px 36px}}
.card{{border-radius:26px;padding:40px 40px 44px;min-height:{ad.get('card_h',294)}px}}
.lab{{font-weight:600;font-size:16.5px;letter-spacing:2.2px;text-transform:uppercase}}
.rule{{height:2px;margin:26px 0 20px}}
.ct{{font-weight:700;font-size:29px;line-height:1.24;letter-spacing:-.4px}}
.cb{{margin-top:14px;font-size:18.5px;line-height:1.38}}
.cta{{position:absolute;left:72px;right:72px;bottom:{250 if story else 64}px;height:92px;border-radius:46px;background:{b['ink']};color:#fff;
  display:flex;align-items:center;justify-content:space-between;padding:0 46px;font-weight:600;font-size:28px;letter-spacing:-.3px}}
.arrow{{font-size:34px}}
</style></head><body><div class="wrap">
<div class="top"><div class="logo"><img src="{b['logo'].as_uri()}">{e(b['name'])}</div><div class="badge">{e(ad.get('badge', b['badge']))}</div></div>
<h1>{br(ad['headline'])}<em>{br(ad['accent'])}</em></h1>
<div class="sub">{br(ad['sub'])}</div>
<div class="grid">{''.join(cards)}</div></div>{cta_html}</body></html>"""


def sticker_photo(ad, b, w, h):
    """Volume winner template (emp-static-pointing, 35 leads): real founder photo + IG-sticker text pills.
    ad["photo"] = path to a photo WITHOUT text. ad["pills"] = [{"text", "color": white|red|yellow|green, "top", "left"|"right", "italic"}]"""
    colors = {"white": ("#FFFFFF", "#0B0B0B"), "red": ("#F2150F", "#FFFFFF"),
              "yellow": ("#FFC83D", "#FFFFFF"), "green": ("#46C23A", "#FFFFFF")}
    pills = []
    for p in ad["pills"]:
        bg, fg = colors[p.get("color", "white")]
        side = f"left:{p['left']}px" if "left" in p else f"right:{p.get('right', 40)}px"
        style = "italic" if p.get("italic", p.get("color") != "red") else "normal"
        lines = "".join(f'<span style="background:{bg};color:{fg}">{e(l)}</span><br>' for l in p["text"].split("\n"))
        pills.append(f'<div class="pill" style="top:{p["top"]}px;{side};font-style:{style};font-size:{p.get("size", 62)}px">{lines}</div>')
    photo = Path(ad["photo"]).expanduser().resolve().as_uri()
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{font_css()}
body{{width:{w}px;height:{h}px;background:#000 url('{photo}') center/cover no-repeat;font-family:Inter;overflow:hidden;position:relative}}
.pill{{position:absolute;font-weight:900;line-height:1.28;letter-spacing:-1.2px;max-width:{w-80}px}}
.pill span{{display:inline;padding:4px 22px 8px;border-radius:14px;-webkit-box-decoration-break:clone;box-decoration-break:clone}}
</style></head><body>{''.join(pills)}</body></html>"""


TEMPLATES = {"signal-cards": signal_cards, "sticker-photo": sticker_photo}


# ---------------------------------------------------------------- render

def render(html_str, out_png, w, h, chrome):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(html_str)
        tmp = f.name
    subprocess.run([chrome, "--headless", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
                    "--force-device-scale-factor=1", f"--window-size={w},{h}", "--virtual-time-budget=3000",
                    f"--screenshot={out_png}", Path(tmp).as_uri()],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.unlink(tmp)


def main():
    batch = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    chrome = next((p for p in CHROME_CANDIDATES if os.path.exists(p)), None)
    if not chrome:
        sys.exit("No Chrome / chrome-headless-shell found")
    brand = BRAND[batch["brand"]]
    out = Path(batch["out_dir"]).expanduser()
    out.mkdir(parents=True, exist_ok=True)
    for ad in batch["ads"]:
        for fmt in ad.get("formats", ["4x5"]):
            w, h = SIZES[fmt]
            png = out / f"{ad['id']}_{fmt}.png"
            render(TEMPLATES[ad["template"]](ad, brand, w, h), str(png), w, h, chrome)
            print(png)


if __name__ == "__main__":
    main()
