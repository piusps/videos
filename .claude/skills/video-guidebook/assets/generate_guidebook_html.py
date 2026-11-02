#!/usr/bin/env python3
"""
Superkind Guidebook v2 — HTML/CSS layout printed to PDF with headless Chrome.

Replaces the plain reportlab layout (generate_guidebook.py) for new guides
(user feedback 2026-09-29: "mehr Mehrwert, erklär wie man die Skills selbst
baut, designtechnisch schöner"). Dark full-bleed cover, section numbers,
cards, numbered steps, dark code blocks for SKILL.md files, prompt boxes,
callouts, and a dark CTA box. Page numbers use Chrome's @page margin boxes.

Usage:
    python3 generate_guidebook_html.py --json content.json --out guide.pdf [--html-out guide.html] [--brand superkind|florentgpt|boilr]

--brand (default superkind) switches logo, credit, footer, accent and the CTA box:
superkind = Florent Preusser × Superkind with the Calendly button (B2B account @florent_preusser);
florentgpt = "Florent GPT", no Superkind, no Calendly, CTA = follow the account (B2C account).
boilr = English guide "Felix × boilr" (format BX-C), boilr green, "b" logo, CTA button = HubSpot demo link.

CONTENT SPEC (v2):
{
  "topic": "Postfach", "trigger_word": "POSTFACH",
  "cover": {
    "kicker": "Guidebook · Postfach",
    "title": "Dein Postfach auf Autopilot",
    "subtitle": "…",
    "stat": {"value": "440 h", "label": "…"},
    "outcomes": ["…", "…", "…"]
  },
  "sections": [
    {"kicker": "Teil 1", "title": "…", "intro": "…", "break_before": false,
     "blocks": [
        {"type": "p", "text": "…"},
        {"type": "cards", "items": [{"num": "01", "title": "…", "text": "…"}]},
        {"type": "steps", "items": [{"title": "…", "text": "…"}]},
        {"type": "code", "label": "SKILL.md", "text": "…"},
        {"type": "prompt", "label": "…", "text": "…"},
        {"type": "callout", "tone": "tip|warn", "title": "…", "text": "…"},
        {"type": "checklist", "items": ["…"]},
        {"type": "facts", "items": [{"k": "…", "v": "…"}]},
        # v3 (2026-10-22) console + value blocks:
        {"type": "terminal", "title": "Terminal · Claude Code", "lines": ["# comment", "$ command", "output line"]},
        {"type": "repos", "items": [{"kind": "SKILL|MCP|PROMPTS|PLUGIN|REPO", "repo": "owner/name",
            "text": "what it gives the reader", "install": "optional one-line command", "stars": "optional, e.g. 183k"}]},
        {"type": "paths", "items": [{"badge": "Mit Superkind", "title": "…", "steps": ["…"]},
                                    {"badge": "Mit Claude", "title": "…", "steps": ["…"]}]},
        {"type": "callout", "tone": "win", "title": "Quick Win · 5 Minuten", "text": "…"},
        # 2026-10-28: comparison table {"type": "table", "head": [...], "rows": [[...]], "widths": [...], "caption": "…"}
        # 2026-10-26: screenshot, embedded as data URI; crop private UI (sidebar!) before
        {"type": "image", "src": "img/shot.png", "caption": "…", "width": "80%"}
     ]}
  ],
  "cta": {"title": "…", "text": "…", "foot": "optional, replaces the brand's follow line", "button": false (optional, hides the brand button)},
  "fineprint": "optional small note under the CTA (legal disclaimer, sources)"
}
Inline markup in any text: **bold**, `code`, [label](https://url). Line breaks with \n.
The cover gets an automatic console that counts the value inside (prompts, repos, MCP servers, skills,
terminal setups); override its lines with cover.console = ["$ …", "✓ …"].
"""

import argparse
import html
import json
import os
import re
import subprocess
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
JSON_DIR = os.getcwd()  # set from --json in main(); image blocks resolve relative paths against it
PROMPT_CHIP = "Prompt"
CONSOLE_PROMPTS = False
FONT_DIR = os.path.join(HERE, "fonts")
LOGO_PATH = os.path.join(HERE, "superkind-logo.svg")
CALENDLY_URL = "https://calendly.com/henri-superkind/30min"
BOILR_DEMO_URL = "https://meetings-eu1.hubspot.com/felix-hermann"
BOILR_LOGO = os.path.join(HERE, "boilr-b.png")

ARCADE_CSS = r"""
/* ---------- florentgpt-arcade (2026-10-28): neo-brutal look from the GPT-S pixel reels ---------- */
:root{--accent:#141414;--ink:#141414;--dark:#141414;--surface:#FFF6D6;--rule:#141414;--muted:#6B665C;--gold:#FFC83D;--red:#D8463A;--blue:#3E7CC9;--green:#4C9A5A;--paper:#FFFDF6}
@page{ @bottom-left{ font: 700 7pt Menlo, monospace; color:#141414; letter-spacing:.06em } @bottom-right{ font: 700 7pt Menlo, monospace; color:#141414 } }
.glow{display:none}
h2,.cover-title,.stat-v,.card-num,.cta-title,.brand{font-family:'Inter Tight',Inter,sans-serif}
.cover{background:var(--paper);color:var(--ink);padding:14mm 15mm 13mm;
  background-image:radial-gradient(rgba(20,20,20,.09) .35mm, transparent .4mm);background-size:5mm 5mm}
.cover-top{display:flex;justify-content:space-between;align-items:center}
.brand{background:#141414;color:#fff;border-radius:99px;padding:2mm 4.5mm 2mm 3.4mm;font-family:Menlo,monospace;font-size:9.5pt;font-weight:700;letter-spacing:.02em;gap:2.4mm}
.brand::before{content:'';width:2.6mm;height:2.6mm;border-radius:50%;background:var(--gold)}
.cover-sticker{background:var(--gold);border:.7mm solid #141414;box-shadow:1.4mm 1.4mm 0 #141414;font-family:Menlo,monospace;font-weight:700;font-size:8.6pt;letter-spacing:.05em;text-transform:uppercase;padding:2mm 3.6mm 1.8mm;transform:rotate(3deg)}
.cover-art{margin-top:8mm;border:.8mm solid #141414;box-shadow:2mm 2mm 0 #141414;line-height:0;background:#9FD3F0}
.cover-art svg{width:100%;height:auto;display:block}
.cover-kicker{display:none}
.cover-title{font-weight:900;font-size:40pt;line-height:.98;letter-spacing:-.035em;margin:9mm 0 0;color:#141414;max-width:178mm}
.cover-title strong{font-weight:900;margin:0 1.2mm 0 0;background:var(--gold);color:#141414;padding:0 1.6mm;box-decoration-break:clone;-webkit-box-decoration-break:clone;border:.7mm solid #141414;box-shadow:1.2mm 1.2mm 0 #141414}
.cover-sub{color:#3A372F;font-size:11pt;margin-top:6mm;max-width:165mm}
.stat{margin-top:8mm;background:#141414;border:none;border-radius:0;box-shadow:2mm 2mm 0 var(--gold);padding:5mm 7mm;max-width:178mm}
.stat-v{color:var(--gold);font-weight:900;font-size:38pt}
.stat-l{color:rgba(255,255,255,.85)}
.outcomes{margin-top:8mm}
.outcomes-h{font-family:Menlo,monospace;font-weight:700;color:#141414;letter-spacing:.1em}
.outcome{color:#141414;font-size:10.8pt}
.tick{border-radius:0;background:var(--gold);color:#141414;border:.5mm solid #141414;font-size:7.5pt}
.cover-foot{color:#6B665C}.cover-foot strong{color:#141414}
.trigger-pill{background:#141414;color:#fff;border:none;border-radius:99px;font-family:Menlo,monospace;font-weight:700;letter-spacing:.04em;padding:2.2mm 4.6mm}
.trigger-pill b{color:var(--gold)}
/* sections */
.sec-kicker{font-family:Menlo,monospace;font-weight:700;font-size:7.6pt;letter-spacing:.08em;color:#fff;background:#141414;padding:1mm 2.6mm .8mm;display:inline-block}
.sec-kicker::before{content:'';display:inline-block;width:1.8mm;height:1.8mm;background:var(--gold);margin-right:1.8mm;vertical-align:.2mm}
h2{font-weight:900;font-size:20pt;letter-spacing:-.03em;color:#141414;margin-top:2.5mm}
.sec-intro{color:#3A372F}
.card{background:#fff;border:.6mm solid #141414;border-radius:0;box-shadow:1.4mm 1.4mm 0 #141414}
.cards .card:nth-child(4n+1){box-shadow:1.4mm 1.4mm 0 var(--gold)}
.card-num{display:inline-block;background:var(--gold);color:#141414;border:.5mm solid #141414;padding:1mm 2mm .6mm;font-weight:900;font-size:15pt}
.step{border-bottom:.4mm dashed #141414}
.step-num{border-radius:0;background:var(--gold);color:#141414;border:.5mm solid #141414;box-shadow:.8mm .8mm 0 #141414;font-family:Menlo,monospace}
.prompt{background:#fff;border:.6mm solid #141414;border-left:.6mm solid #141414;border-radius:0;box-shadow:1.6mm 1.6mm 0 #141414;padding:0;overflow:hidden}
.prompt-head{background:#141414;margin:0;padding:2.2mm 4mm}
.prompt-label{color:#fff;font-family:Menlo,monospace;font-size:8.6pt}
.chip{background:var(--gold);color:#141414;border-radius:0;font-family:Menlo,monospace}
.prompt-text{padding:3.6mm 4.6mm 4mm;font-size:9.2pt}
.callout{border-radius:0}
.callout.tip{background:var(--surface);border:.6mm solid #141414}
.callout.warn{background:#fff;border:.6mm solid var(--red);box-shadow:1.4mm 1.4mm 0 var(--red)}
.callout.warn .callout-title{color:var(--red)}
.callout.win{background:var(--gold);border:.6mm solid #141414;box-shadow:1.4mm 1.4mm 0 #141414}
.callout.win .callout-title{color:#141414}
.box{border:.5mm solid #141414;border-radius:0;background:#fff}
.fact{background:#fff;border:.6mm solid #141414;border-radius:0;box-shadow:1.2mm 1.2mm 0 var(--gold)}
.fact-k{font-family:Menlo,monospace;color:#6B665C}
.fact-v{font-weight:800}
code{background:var(--surface);border-color:#141414;border-radius:0}
.cta{background:#141414;border-radius:0;box-shadow:2mm 2mm 0 var(--gold)}
.cta-title{color:var(--gold);font-weight:900;font-size:18pt}
.cta-text{color:rgba(255,255,255,.85)}
.cta-foot .acc{color:var(--gold)}
.cta-art{position:absolute;right:7mm;top:6mm;width:30mm;line-height:0}
.shot img{border:.6mm solid #141414;border-radius:0;box-shadow:1.4mm 1.4mm 0 #141414}
"""

BRANDS = {
    "superkind": {
        "wordmark": "Superkind", "logo": True, "prompt_chip": "Kopieren", "console": True, "cover_console": True, "accent": "#FF6B35", "rgb": "255,107,53",
        "credit": "Ein Guide von <strong>Florent Preusser</strong> × Superkind",
        "footer": "Superkind · TOPIC-Guide",
        "cta_title": "Willst du das nicht selbst aufsetzen?",
        "cta_button": ("Kostenloses Erstgespräch buchen →", CALENDLY_URL),
        "cta_foot": "Folg <strong>Florent Preusser</strong> für mehr Guides wie diesen. Nächstes Mal einfach das Trigger-Wort unter dem Video kommentieren.",
    },
    "florentgpt": {
        "wordmark": "Florent GPT", "logo": False, "prompt_chip": "Zum Kopieren", "accent": "#0B3D2C", "rgb": "11,61,44",
        "credit": "Ein Guide von <strong>Florent GPT</strong>",
        "footer": "Florent GPT · TOPIC-Guide",
        "cta_title": "Mehr davon?",
        "cta_button": None,
        "cta_foot": "Folg <strong>Florent GPT</strong> auf Instagram für den nächsten Guide. Einfach das Trigger-Wort unter dem nächsten Video kommentieren.",
        # GPT-N look "Weiß + Dunkelgrün" (2026-10-15, gpt-normal-reel/references/gpt-look-2026-10-15.md):
        # white base, dark green #0B3D2C, mint #BFE3D2 only as flat shapes, tint #EAF2EE, Inter Tight titles,
        # no gradients, no glow, no other accent colours. Shapes never sit behind text.
        "extra_css": ":root{--dark:#0B3D2C;--ink:#0F1F19;--surface:#EAF2EE;--rule:#D6E7DE;--muted:#5C7268}"
                     ".glow{display:none}"
                     ".cover{background:#fff;color:#0B3D2C}"
                     ".cover::before{content:'';position:absolute;width:120mm;height:120mm;border-radius:50%;background:#BFE3D2;right:-45mm;top:-50mm}"
                     ".cover::after{content:'';position:absolute;width:70mm;height:70mm;border-radius:50%;border:6mm solid #EAF2EE;right:-30mm;top:180mm}"
                     ".brand{font-family:'Inter Tight',Inter,sans-serif;font-weight:800;letter-spacing:-.01em}"
                     ".cover-title,h2,.stat-v,.card-num,.cta-title{font-family:'Inter Tight',Inter,sans-serif}"
                     ".cover-title{font-weight:800;color:#0B3D2C;letter-spacing:-.03em}"
                     ".cover-sub{color:#3E5A50}.stat-l,.outcome{color:#0F1F19}.outcomes-h{color:#5C7268}"
                     ".stat{background:#EAF2EE;border:1px solid #D6E7DE}.stat-v{font-weight:900}"
                     ".cover-foot{color:#5C7268}.cover-foot strong{color:#0B3D2C}"
                     ".trigger-pill{background:#0B3D2C;border:none;color:#fff}"
                     "h2{font-weight:800;color:#0B3D2C}.card-num{font-weight:900}"
                     ".card{background:#fff}.step-num{background:#0B3D2C}"
                     ".dot{background:rgba(255,255,255,.22)}.dot:first-child{background:#BFE3D2}.c-k{color:#BFE3D2}"
                     ".prompt{background:#EAF2EE;border-color:#D6E7DE;border-left-color:#0B3D2C}"
                     ".callout.warn{background:#fff;border:1.5px solid #0B3D2C}.callout.warn .callout-title{color:#0B3D2C}"
                     ".cta::after{content:'';position:absolute;width:44mm;height:44mm;border-radius:50%;border:4mm solid rgba(191,227,210,.22);right:-20mm;top:-26mm}"
                     ".cta-title{font-weight:800}.cta-text{color:rgba(255,255,255,.8)}.cta-foot .acc{color:#BFE3D2}",
    },
    "florentgpt-arcade": {
        "wordmark": "Florent GPT", "logo": False, "prompt_chip": "Kopieren", "accent": "#141414", "rgb": "20,20,20",
        "credit": "Ein Guide von <strong>Florent GPT</strong>",
        "footer": "FLORENT GPT · TOPIC",
        "cta_title": "Mehr davon?",
        "cta_button": None,
        "cta_foot": "Folg <strong>Florent GPT</strong> auf Instagram. Unter jedem Satire-Video gibt's das nächste Gegenmittel.",
        "arcade": True, "trigger_label": "Schreib",
        # neo-brutal look from the GPT-S pixel reels (Pius 2026-10-28: "nicht so Pixel, aber die Richtung, richtig geil"):
        # paper #FFFDF6, ink #141414, gold #FFC83D, hard offset shadows, Inter Tight 900 + Menlo labels, pixel art strip on the cover.
        "extra_css": ARCADE_CSS,
    },
    "boilr": {
        "wordmark": "boilr", "logo": "img", "prompt_chip": "Copy & paste", "accent": "#0A5F45", "rgb": "10,95,69",
        "credit": "A guide by <strong>Felix</strong> × boilr",
        "footer": "boilr · Claude for Recruiters · TOPIC",
        "cta_title": "Want this running 24/7 instead?",
        "cta_button": ("Book a 20-min demo →", BOILR_DEMO_URL),
        "cta_foot": "Follow <strong>Felix</strong> for the next episode of Claude for Recruiters. Just comment under the next video.",
        "lang": "en", "outcomes_h": "What you'll have at the end", "trigger_label": "Trigger word",
        # brand green is too dark on the dark cover/CTA: brighter mint-green there, no orange glow
        "extra_css": ".cover-kicker,.stat-v,.cta-foot .acc{color:#5FD3A0}.tick{background:#1F8F63}"
                     ".g2{background:radial-gradient(circle,rgba(95,211,160,.18),rgba(95,211,160,0) 65%)}"
                     ".g1{background:radial-gradient(circle,rgba(31,143,99,.55),rgba(31,143,99,0) 65%)}"
                     ".trigger-pill{border-color:rgba(95,211,160,.6)}.cta-btn{background:#1F8F63}",
    },
}

CHROME_CANDIDATES = [
    "/Users/pius/LinkedIn Generator/broll/node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]


def inline(text: str) -> str:
    t = html.escape(text)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"`(.+?)`", r"<code>\1</code>", t)
    t = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a class="lnk" href="\2">\1</a>', t)
    return t.replace("\n", "<br>")


GH_ICON = ('<svg class="gh" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 '
           '5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 '
           '1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 '
           '0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 '
           '0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>')


def term_line(line: str) -> str:
    e = html.escape(line)
    if line.startswith("$ "):
        return f'<div class="tl"><span class="t-ps">$</span> <span class="t-cmd">{e[2:]}</span></div>'
    if line.startswith("> ") or line.startswith("› "):
        return f'<div class="tl"><span class="t-ps">›</span> <span class="t-cmd">{e[2:]}</span></div>'
    if line.startswith("#"):
        return f'<div class="tl t-com">{e}</div>'
    if line.startswith("✓"):
        return f'<div class="tl"><span class="t-ok">✓</span>{e[1:]}</div>'
    if line.startswith("→"):
        return f'<div class="tl t-acc">{e}</div>'
    return f'<div class="tl t-out">{e or "&nbsp;"}</div>'


def console(title: str, lines: list, cls: str = "") -> str:
    return (f'<div class="term {cls}"><div class="code-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span>'
            f'<span class="code-label">{html.escape(title)}</span></div><div class="term-body">{"".join(term_line(l) for l in lines)}</div></div>')


def value_lines(c: dict) -> list:
    n = {"prompt": 0, "repo": 0, "mcp": 0, "skill": 0, "term": 0}
    for s in c.get("sections", []):
        for b in s.get("blocks", []):
            t = b["type"]
            if t == "prompt": n["prompt"] += 1
            elif t == "terminal": n["term"] += 1
            elif t == "code" and "skill" in b.get("label", "").lower(): n["skill"] += 1
            elif t == "repos":
                for i in b["items"]:
                    n["repo"] += 1
                    if i.get("kind", "").upper() == "MCP": n["mcp"] += 1
    topic = c.get("topic", "")
    out = [f'$ superkind guide "{topic}"']
    if n["prompt"]: out.append(f'✓ {n["prompt"]} Prompts, fertig zum Kopieren')
    if n["repo"]: out.append(f'✓ {n["repo"]} GitHub-Repos: Skills, MCPs, Prompts')
    if n["mcp"]: out.append(f'✓ {n["mcp"]} MCP-Server zum Anschließen')
    if n["skill"]: out.append(f'✓ {n["skill"]} fertiger Skill (SKILL.md)')
    if n["term"]: out.append(f'✓ {n["term"]} Setups für die Konsole')
    out.append("→ geladen. Los geht's.")
    return out


def logo_svg() -> str:
    svg = open(LOGO_PATH, encoding="utf-8").read()
    svg = re.sub(r"<\?xml[^>]*>", "", svg)
    svg = svg.replace('fill="#000000"', 'fill="currentColor"')
    svg = re.sub(r'width="100%"', 'width="100%" height="100%"', svg, count=1)
    return svg


def block_html(b: dict) -> str:
    t = b["type"]
    if t == "p":
        return f'<p class="body">{inline(b["text"])}</p>'
    if t == "cards":
        items = "".join(
            f'<div class="card"><div class="card-num">{html.escape(i.get("num", ""))}</div>'
            f'<div class="card-title">{inline(i["title"])}</div><div class="card-text">{inline(i["text"])}</div></div>'
            for i in b["items"]
        )
        return f'<div class="cards cols-{len(b["items"])}">{items}</div>'
    if t == "steps":
        items = "".join(
            f'<div class="step"><div class="step-num">{n}</div><div class="step-body">'
            f'<div class="step-title">{inline(i["title"])}</div><div class="step-text">{inline(i["text"])}</div></div></div>'
            for n, i in enumerate(b["items"], start=1)
        )
        return f'<div class="steps">{items}</div>'
    if t == "code":
        body = html.escape(b["text"])
        # soft highlight: markdown headings, frontmatter keys, bullets
        body = re.sub(r"^(#{1,3} .*)$", r'<span class="c-h">\1</span>', body, flags=re.M)
        body = re.sub(r"^(name|description):", r'<span class="c-k">\1</span>:', body, flags=re.M)
        body = re.sub(r"^(---)$", r'<span class="c-m">\1</span>', body, flags=re.M)
        if b.get("label", "").endswith(".json"):
            body = re.sub(r'(&quot;[^&]*?&quot;)(\s*:)', r'<span class="c-k">\1</span>\2', body)
        return (f'<div class="code"><div class="code-bar"><span class="dot"></span><span class="dot"></span>'
                f'<span class="dot"></span><span class="code-label">{html.escape(b.get("label", ""))}</span></div>'
                f'<pre>{body}</pre></div>')
    if t == "prompt" and CONSOLE_PROMPTS:
        return (f'<div class="term prompt-term"><div class="code-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span>'
                f'<span class="code-label">{inline(b["label"])}</span><span class="copy">{PROMPT_CHIP} ⧉</span></div>'
                f'<div class="term-body"><span class="t-ps">claude ›</span> <span class="p-body">{inline(b["text"])}</span></div></div>')
    if t == "prompt":
        return (f'<div class="prompt"><div class="prompt-head"><span class="chip">{PROMPT_CHIP}</span>'
                f'<span class="prompt-label">{inline(b["label"])}</span></div>'
                f'<div class="prompt-text">{inline(b["text"])}</div></div>')
    if t == "callout":
        tone = b.get("tone", "tip")
        return (f'<div class="callout {tone}"><div class="callout-title">{inline(b["title"])}</div>'
                f'<div class="callout-text">{inline(b["text"])}</div></div>')
    if t == "checklist":
        items = "".join(f'<li><span class="box"></span><span>{inline(i)}</span></li>' for i in b["items"])
        return f'<ul class="checklist">{items}</ul>'
    if t == "facts":
        items = "".join(
            f'<div class="fact"><div class="fact-k">{inline(i["k"])}</div><div class="fact-v">{inline(i["v"])}</div></div>'
            for i in b["items"]
        )
        return f'<div class="facts">{items}</div>'
    if t == "terminal":
        return console(b.get("title", "Terminal"), b["lines"])
    if t == "repos":
        cards = []
        for i in b["items"]:
            url = i.get("url") or f'https://github.com/{i["repo"]}'
            kind = html.escape(i.get("kind", "REPO").upper())
            stars = f'<span class="repo-stars">★ {html.escape(i["stars"])}</span>' if i.get("stars") else ""
            inst = f'<div class="repo-inst"><span class="t-ps">$</span> {html.escape(i["install"])}</div>' if i.get("install") else ""
            cards.append(f'<a class="repo" href="{url}"><div class="repo-top"><span class="kind k-{kind.lower()}">{kind}</span>{stars}</div>'
                         f'<div class="repo-name">{GH_ICON}<span>{html.escape(i["repo"])}</span></div>'
                         f'<div class="repo-text">{inline(i["text"])}</div>{inst}</a>')
        return f'<div class="repos">{"".join(cards)}</div>'
    if t == "paths":
        cols = []
        for k, i in enumerate(b["items"]):
            steps = "".join(f'<li><span class="pn">{n}</span><span>{inline(x)}</span></li>' for n, x in enumerate(i["steps"], 1))
            cols.append(f'<div class="path p{k}"><span class="path-badge">{inline(i["badge"])}</span>'
                        f'<div class="path-title">{inline(i["title"])}</div><ol>{steps}</ol></div>')
        return f'<div class="paths">{"".join(cols)}</div>'
    if t == "table":
        # {"type": "table", "head": ["…"], "rows": [["…"]], "widths": ["18%", …] (optional), "caption": "optional"}
        ws = b.get("widths")
        cg = "<colgroup>" + "".join(f'<col style="width:{html.escape(w)}">' for w in ws) + "</colgroup>" if ws else ""
        th = "".join(f"<th>{inline(h)}</th>" for h in b["head"])
        trs = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in b["rows"])
        cap = f'<div class="tbl-cap">{inline(b["caption"])}</div>' if b.get("caption") else ""
        return f'<table class="tbl">{cg}<thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>{cap}'
    if t == "image":
        # {"type": "image", "src": "path (abs or relative to the json)", "caption": "…", "width": "80%"}
        import base64, mimetypes
        src = b["src"] if os.path.isabs(b["src"]) else os.path.join(JSON_DIR, b["src"])
        mime = mimetypes.guess_type(src)[0] or "image/png"
        data = base64.b64encode(open(src, "rb").read()).decode()
        cap = f'<figcaption>{inline(b["caption"])}</figcaption>' if b.get("caption") else ""
        return (f'<figure class="shot"><img src="data:{mime};base64,{data}" style="width:{html.escape(b.get("width", "100%"))}">'
                f'{cap}</figure>')
    raise ValueError(f"unknown block type {t}")


CSS = """
@font-face { font-family: Inter; font-weight: 400; src: url('FONTDIR/Inter-Regular.ttf'); }
@font-face { font-family: Inter; font-weight: 500; src: url('FONTDIR/Inter-Medium.ttf'); }
@font-face { font-family: Inter; font-weight: 600; src: url('FONTDIR/Inter-SemiBold.ttf'); }
@font-face { font-family: Inter; font-weight: 700; src: url('FONTDIR/Inter-Bold.ttf'); }
@font-face { font-family: 'Inter Tight'; font-weight: 100 900; src: url('FONTDIR/InterTight-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Inter Tight'; font-weight: 100 900; src: url('FONTDIR/InterTight-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
:root { --accent:#FF6B35; --ink:#111111; --dark:#0A0A0A; --muted:#6B7280; --surface:#F4F4F5; --rule:#E5E5E5; }
@page { size: A4; margin: 16mm 17mm 17mm 17mm;
  @bottom-left { content: "Superkind · TOPIC-Guide"; font: 500 7.5pt -apple-system, Helvetica, Arial, sans-serif; color: #9CA3AF; }
  @bottom-right { content: counter(page); font: 600 7.5pt -apple-system, Helvetica, Arial, sans-serif; color: #9CA3AF; } }
@page cover { margin: 0; @bottom-left { content: none; } @bottom-right { content: none; } }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { margin: 0; padding: 0; }
body { font-family: Inter, sans-serif; color: var(--ink); font-size: 9.2pt; line-height: 1.5; }
strong { font-weight: 600; }
code { font-family: Menlo, 'SF Mono', monospace; font-size: 0.88em; background: var(--surface); border: 1px solid var(--rule); border-radius: 4px; padding: 0.5px 4px; }

/* Cover */
.cover { page: cover; width: 210mm; height: 297mm; background: var(--dark); color: #fff; position: relative; overflow: hidden; padding: 22mm 20mm; display: flex; flex-direction: column; break-after: page; }
.glow { position: absolute; border-radius: 50%; filter: blur(60px); }
.g1 { width: 150mm; height: 150mm; right: -50mm; top: -40mm; background: radial-gradient(circle, rgba(255,107,53,.55), rgba(255,107,53,0) 65%); }
.g2 { width: 120mm; height: 120mm; left: -45mm; bottom: 10mm; background: radial-gradient(circle, rgba(255,140,60,.32), rgba(255,140,60,0) 65%); }
.cover > *:not(.glow) { position: relative; }
.brand { display: flex; align-items: center; gap: 3mm; font-weight: 700; font-size: 13pt; }
.brand .logo { width: 7.5mm; height: 7.5mm; color: #fff; }
.cover-kicker { margin-top: 38mm; font-weight: 600; font-size: 9pt; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
.cover-title { font-weight: 700; font-size: 38pt; line-height: 1.04; letter-spacing: -.025em; margin: 5mm 0 0; max-width: 160mm; }
.cover-sub { font-size: 12pt; line-height: 1.5; color: rgba(255,255,255,.72); margin-top: 7mm; max-width: 145mm; }
.stat { margin-top: 14mm; display: flex; align-items: center; gap: 7mm; padding: 7mm 8mm; border-radius: 5mm; background: linear-gradient(145deg, rgba(255,255,255,.1), rgba(255,255,255,.03)); border: 1px solid rgba(255,255,255,.14); max-width: 160mm; }
.stat-v { font-weight: 700; font-size: 40pt; letter-spacing: -.03em; color: var(--accent); white-space: nowrap; line-height: 1; }
.stat-v.long { font-size: 25pt; }  /* long values like "bis 50 % · bis 12 Monate" */
.stat-l { font-size: 10.5pt; line-height: 1.45; color: rgba(255,255,255,.8); }
.outcomes { margin-top: 12mm; }
.outcomes-h { font-weight: 600; font-size: 9pt; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.5); margin-bottom: 3mm; }
.outcome { display: flex; gap: 3.5mm; align-items: flex-start; font-size: 11pt; margin: 2.6mm 0; color: rgba(255,255,255,.9); }
.tick { flex: none; width: 5.5mm; height: 5.5mm; border-radius: 50%; background: var(--accent); color: #fff; font-weight: 700; font-size: 8pt; display: grid; place-items: center; margin-top: .3mm; }
.cover-foot { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; font-size: 9pt; color: rgba(255,255,255,.55); }
.cover-foot strong { color: #fff; }
.trigger-pill { border: 1px solid rgba(255,107,53,.6); color: #fff; border-radius: 99px; padding: 1.8mm 4mm; font-weight: 600; }

/* Sections */
section { margin-bottom: 7mm; }
.sec-top { break-inside: avoid; }
.sec-top.more { break-after: avoid; }  /* only when blocks follow; on a one-block section it pushed the whole section a page too far */
section.break { break-before: page; }
.sec-head { display: flex; align-items: baseline; gap: 4mm; margin-bottom: 1mm; }
.sec-kicker { font-weight: 600; font-size: 8pt; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
h2 { font-weight: 700; font-size: 18pt; line-height: 1.15; letter-spacing: -.02em; margin: 1mm 0 2.5mm; break-after: avoid; }
.sec-intro { font-size: 10pt; line-height: 1.5; color: #374151; margin: 0 0 4mm; max-width: 160mm; }
.body { margin: 0 0 3.5mm; }

.cards { display: grid; gap: 4mm; margin: 2mm 0 5mm; break-inside: avoid; }
.cols-2 { grid-template-columns: 1fr 1fr; } .cols-3 { grid-template-columns: 1fr 1fr 1fr; } .cols-4 { grid-template-columns: 1fr 1fr; }
.card { border: 1px solid var(--rule); border-radius: 4mm; padding: 4mm; background: linear-gradient(180deg, #fff, #FAFAFA); }
.card-num { font-weight: 700; font-size: 18pt; color: var(--accent); letter-spacing: -.02em; line-height: 1; }
.card-title { font-weight: 700; font-size: 11pt; margin: 3mm 0 1.5mm; }
.card-text { font-size: 9pt; line-height: 1.5; color: #4B5563; }

.steps { margin: 1mm 0 5mm; }
.step { display: flex; gap: 4.5mm; padding: 2.8mm 0; border-bottom: 1px solid var(--rule); break-inside: avoid; }
.step:last-child { border-bottom: none; }
.step-num { flex: none; width: 8mm; height: 8mm; border-radius: 50%; background: var(--ink); color: #fff; font-weight: 700; font-size: 9.5pt; display: grid; place-items: center; }
.step-title { font-weight: 700; font-size: 10.8pt; margin: .8mm 0 1mm; }
.step-text { font-size: 9.4pt; color: #374151; line-height: 1.55; }

.code { background: var(--dark); border-radius: 4mm; margin: 2mm 0 5mm; overflow: hidden; break-inside: avoid; }
.code-bar { display: flex; align-items: center; gap: 1.6mm; padding: 3mm 4.5mm; border-bottom: 1px solid rgba(255,255,255,.08); }
.dot { width: 2.4mm; height: 2.4mm; border-radius: 50%; background: rgba(255,255,255,.18); }
.dot:first-child { background: var(--accent); }
.code-label { margin-left: 2.5mm; font-family: Menlo, monospace; font-size: 8pt; color: rgba(255,255,255,.6); }
.code pre { margin: 0; padding: 3.5mm 5mm 4mm; font-family: Menlo, 'SF Mono', monospace; font-size: 7.2pt; line-height: 1.5; color: rgba(255,255,255,.86); white-space: pre-wrap; word-break: break-word; }
.c-h { color: #fff; font-weight: 700; } .c-k { color: var(--accent); } .c-m { color: rgba(255,255,255,.4); }

.prompt { border: 1px solid var(--rule); border-left: 3px solid var(--accent); border-radius: 3mm; padding: 4mm 5mm; margin: 2mm 0 4mm; background: #FFFBF8; break-inside: avoid; }
.prompt-head { display: flex; align-items: center; gap: 3mm; margin-bottom: 2mm; }
.chip { font-weight: 700; font-size: 7pt; letter-spacing: .1em; text-transform: uppercase; background: var(--accent); color: #fff; border-radius: 99px; padding: .8mm 2.6mm; }
.prompt-label { font-weight: 700; font-size: 10pt; }
.prompt-text { font-size: 9pt; line-height: 1.6; color: #1F2937; }

.shot { margin: 2mm 0 5mm; break-inside: avoid; text-align: center; }
.shot img { display: block; margin: 0 auto; border-radius: 3mm; border: 1px solid var(--rule); }
.shot figcaption { font-size: 8pt; color: var(--muted); margin-top: 1.6mm; }
.callout { border-radius: 3.5mm; padding: 4mm 5mm; margin: 2mm 0 5mm; break-inside: avoid; }
.callout.tip { background: var(--surface); }
.callout.warn { background: #FFF4EE; border: 1px solid rgba(255,107,53,.35); }
.callout-title { font-weight: 700; font-size: 10pt; margin-bottom: 1mm; }
.callout.warn .callout-title { color: #C2410C; }
.callout-text { font-size: 9.2pt; color: #374151; }

.checklist { list-style: none; padding: 0; margin: 1mm 0 5mm; }
.checklist li { display: flex; gap: 3mm; align-items: flex-start; margin: 2mm 0; font-size: 9.6pt; break-inside: avoid; }
.box { flex: none; width: 4mm; height: 4mm; border: 1.5px solid var(--accent); border-radius: 1.2mm; margin-top: .6mm; }

.facts { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin: 2mm 0 5mm; break-inside: avoid; }
.fact { background: var(--surface); border-radius: 3mm; padding: 3.5mm 4.5mm; }
.fact-k { font-weight: 600; font-size: 7.6pt; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.fact-v { font-weight: 600; font-size: 10pt; margin-top: 1mm; }
.tbl { width: 100%; border-collapse: collapse; table-layout: fixed; margin: 2mm 0 2mm; font-size: 7.6pt; line-height: 1.38; }
.tbl th { background: var(--dark); color: #fff; text-align: left; font-weight: 600; font-size: 7pt; letter-spacing: .06em; text-transform: uppercase; padding: 2mm 2.2mm; }
.tbl td { border-bottom: 1px solid var(--rule); padding: 2mm 2.2mm; vertical-align: top; word-wrap: break-word; overflow-wrap: anywhere; }
.tbl tr { break-inside: avoid; }
.tbl tbody tr:nth-child(even) td { background: var(--surface); }
.tbl td:first-child { font-weight: 700; }
.tbl-cap { font-size: 7.5pt; color: var(--muted); margin: 0 0 5mm; }

.cta { background: var(--dark); color: #fff; border-radius: 5mm; padding: 7mm 8mm; position: relative; overflow: hidden; break-inside: avoid; margin-top: 6mm; }
.cta .glow { width: 90mm; height: 90mm; right: -30mm; top: -40mm; background: radial-gradient(circle, rgba(255,107,53,.5), rgba(255,107,53,0) 65%); }
.cta > *:not(.glow) { position: relative; }
.cta-title { font-weight: 700; font-size: 16pt; letter-spacing: -.01em; }
.cta-text { font-size: 10pt; color: rgba(255,255,255,.72); margin: 2.5mm 0 5mm; max-width: 135mm; }
.cta-btn { display: inline-block; background: var(--accent); color: #fff; font-weight: 700; font-size: 10pt; border-radius: 99px; padding: 3mm 6mm; text-decoration: none; }
.cta-foot { margin-top: 6mm; font-size: 9pt; color: rgba(255,255,255,.6); }
.fineprint { margin-top: 4mm; font-size: 7.5pt; color: var(--muted); }
.cta-foot strong { color: #fff; } .cta-foot .acc { color: var(--accent); font-weight: 700; }

/* ---------- v3 (2026-10-22): consoles, repos, paths, value console ---------- */
a.lnk { color: var(--accent); font-weight: 600; text-decoration: none; border-bottom: 1px solid rgba(255,107,53,.35); }
.term { background: #0B0B0D; border-radius: 4mm; margin: 2mm 0 5mm; overflow: hidden; break-inside: avoid; border: 1px solid #1F1F23;
  box-shadow: 0 2mm 6mm rgba(0,0,0,.12); }
.term .code-bar { background: #141417; }
.term-body { padding: 3.6mm 5mm 4.2mm; font-family: Menlo, 'SF Mono', monospace; font-size: 7.6pt; line-height: 1.62; color: rgba(255,255,255,.88); white-space: pre-wrap; word-break: break-word; }
.tl { min-height: 1em; }
.t-ps { color: var(--accent); font-weight: 700; }
.t-cmd { color: #fff; font-weight: 600; }
.t-com { color: rgba(255,255,255,.4); }
.t-out { color: rgba(255,255,255,.72); }
.t-ok { color: #4ADE80; font-weight: 700; margin-right: .2em; }
.t-acc { color: var(--accent); font-weight: 700; }
.copy { margin-left: auto; font-family: Inter, sans-serif; font-weight: 700; font-size: 6.6pt; letter-spacing: .1em; text-transform: uppercase;
  color: var(--accent); border: 1px solid rgba(255,107,53,.5); border-radius: 99px; padding: .6mm 2.4mm; }
.prompt-term .term-body { font-size: 8pt; line-height: 1.62; }
.prompt-term .p-body { color: rgba(255,255,255,.92); }
.prompt-term .p-body code { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.15); color: #fff; }
.prompt-term .p-body strong { color: var(--accent); }

.repos { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5mm; margin: 2mm 0 5mm; }
.repo { display: block; text-decoration: none; color: var(--ink); border: 1px solid var(--rule); border-radius: 3.5mm; padding: 3.6mm 4mm;
  background: linear-gradient(180deg, #fff, #FAFAFA); break-inside: avoid; position: relative; overflow: hidden; }
.repo::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1.1mm; background: var(--accent); }
.repo-top { display: flex; align-items: center; justify-content: space-between; }
.kind { font-weight: 800; font-size: 6.4pt; letter-spacing: .12em; border-radius: 99px; padding: .6mm 2.2mm; background: var(--dark); color: #fff; }
.kind.k-mcp { background: var(--accent); } .kind.k-skill { background: #111; color: var(--accent); border: 1px solid var(--accent); }
.kind.k-prompts { background: #FFE9DF; color: #C2410C; } .kind.k-plugin { background: #F4F4F5; color: #111; border: 1px solid #D4D4D8; }
.repo-stars { font-size: 7.4pt; font-weight: 600; color: var(--muted); }
.repo-name { display: flex; align-items: center; gap: 1.6mm; margin: 2.4mm 0 1.2mm; font-family: Menlo, monospace; font-size: 8.4pt; font-weight: 700; word-break: break-all; }
.gh { width: 3.6mm; height: 3.6mm; flex: none; }
.repo-text { font-size: 8.4pt; line-height: 1.45; color: #4B5563; }
.repo-inst { margin-top: 2.4mm; background: #0B0B0D; color: #fff; border-radius: 2mm; padding: 1.6mm 2.6mm; font-family: Menlo, monospace; font-size: 6.6pt; line-height: 1.4; word-break: break-all; }

.paths { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin: 2mm 0 5mm; break-inside: avoid; }
.path { border-radius: 4mm; padding: 4.5mm 5mm; border: 1px solid var(--rule); background: #fff; }
.path.p0 { background: var(--dark); color: #fff; border-color: var(--dark); }
.path-badge { display: inline-block; font-weight: 800; font-size: 6.8pt; letter-spacing: .12em; text-transform: uppercase; border-radius: 99px; padding: .8mm 2.6mm; background: var(--accent); color: #fff; }
.path.p1 .path-badge { background: #F4F4F5; color: #111; border: 1px solid #D4D4D8; }
.path-title { font-weight: 700; font-size: 11pt; margin: 2.6mm 0 2mm; line-height: 1.25; }
.path ol { list-style: none; padding: 0; margin: 0; }
.path li { display: flex; gap: 2.4mm; font-size: 8.8pt; line-height: 1.45; margin: 1.8mm 0; }
.path.p0 li { color: rgba(255,255,255,.85); }
.path.p0 code { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.18); color: #fff; }
.pn { flex: none; width: 4.4mm; height: 4.4mm; border-radius: 50%; background: var(--accent); color: #fff; font-weight: 700; font-size: 7pt; display: grid; place-items: center; margin-top: .3mm; }
.path.p1 .pn { background: #111; }

.callout.win { background: linear-gradient(135deg, #FFF1EA, #FFFFFF 70%); border: 1.5px solid var(--accent); position: relative; }
.callout.win .callout-title { color: var(--accent); font-size: 10.5pt; }
.callout.win .callout-title::before { content: '⚡ '; }

/* Superkind cover: grid + value console */
.cover.sk { background-color: #0A0A0A;
  background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
  background-size: 9mm 9mm; }
.cover.sk .cover-kicker { margin-top: 16mm; font-family: Menlo, monospace; letter-spacing: .06em; }
.cover.sk .cover-kicker::before { content: '> '; }
.cover.sk > * { flex-shrink: 0; }
.cover.sk { padding-top: 18mm; }
.cover.sk .cover-title { font-family: 'Inter Tight', Inter, sans-serif; font-weight: 800; font-size: 33pt; line-height: 1.05; }
.cover.sk .cover-sub { font-size: 11pt; margin-top: 5mm; }
.cover.sk .stat { padding: 5mm 7mm; }
.cover.sk .stat-v { font-size: 32pt; }
.cover.sk .stat { margin-top: 9mm; }
.cover-term { margin: 6mm 0 0; max-width: 160mm; border-color: rgba(255,107,53,.35); box-shadow: 0 0 12mm rgba(255,107,53,.18); }
.cover-term .term-body { font-size: 8.6pt; }
.cover.sk .outcomes { margin-top: 6mm; }
.cover.sk .outcome { font-size: 10.5pt; margin: 2mm 0; }

/* Superkind section heads */
.sec-num { font-family: Menlo, monospace; font-weight: 700; color: #fff; background: var(--accent); border-radius: 1.4mm; padding: .3mm 1.6mm; margin-right: 2mm; letter-spacing: 0; }
.sec-slash { font-family: Menlo, monospace; color: var(--accent); margin-right: .4mm; }
"""


def build_html(c: dict, brand: str = "superkind") -> str:
    global PROMPT_CHIP, CONSOLE_PROMPTS
    b = BRANDS[brand]
    PROMPT_CHIP = b["prompt_chip"]
    CONSOLE_PROMPTS = b.get("console", False)
    cover = c["cover"]
    if b["logo"] == "img":
        logo = f'<img class="logo" style="border-radius:1.6mm" src="file://{BOILR_LOGO}">'
    else:
        logo = f'<span class="logo">{logo_svg()}</span>' if b["logo"] else ""
    outcomes = "".join(f'<div class="outcome"><span class="tick">✓</span><span>{inline(o)}</span></div>' for o in cover.get("outcomes", []))
    stat = cover.get("stat")
    stat_cls = " long" if stat and len(stat["value"]) > 10 else ""
    stat_html = f'<div class="stat"><div class="stat-v{stat_cls}">{html.escape(stat["value"])}</div><div class="stat-l">{inline(stat["label"])}</div></div>' if stat else ""
    cover_con = console("superkind — zsh", cover.get("console") or value_lines(c), "cover-term") if b.get("cover_console") else ""
    cover_cls = "cover sk" if b.get("cover_console") else "cover"
    if b.get("arcade"):
        art = ""
        if cover.get("art"):
            ap = cover["art"] if os.path.isabs(cover["art"]) else os.path.join(JSON_DIR, cover["art"])
            art = f'<div class="cover-art">{open(ap, encoding="utf-8").read()}</div>'
        cover_top = (f'<div class="cover-top"><div class="brand">{b["wordmark"]}</div>'
                     f'<div class="cover-sticker">{html.escape(cover.get("kicker", ""))}</div></div>{art}')
    else:
        cover_top = f'<div class="brand">{logo}{b["wordmark"]}</div>'
    parts = [f"""
<div class="{cover_cls}"><div class="glow g1"></div><div class="glow g2"></div>
  {cover_top}
  <div class="cover-kicker">{html.escape(cover.get("kicker", "Guidebook"))}</div>
  <h1 class="cover-title">{inline(cover["title"])}</h1>
  <div class="cover-sub">{inline(cover.get("subtitle", ""))}</div>
  {stat_html}
  {cover_con}
  <div class="outcomes"><div class="outcomes-h">{b.get("outcomes_h", "Das hast du am Ende")}</div>{outcomes}</div>
  <div class="cover-foot"><div>{b["credit"]}</div>
    <div class="trigger-pill">{b.get("trigger_label", "Trigger-Wort")}: <b>{html.escape(c.get("trigger_word", ""))}</b></div></div>
</div>"""]
    for i, s in enumerate(c["sections"]):
        cls = "break" if s.get("break_before") else ""
        intro = f'<p class="sec-intro">{inline(s["intro"])}</p>' if s.get("intro") else ""
        # kicker + title + intro + first block stay together, so a heading never ends a page alone
        first = block_html(s["blocks"][0]) if s.get("blocks") else ""
        rest = "".join(block_html(b) for b in s.get("blocks", [])[1:])
        top_cls = "sec-top more" if rest else "sec-top"
        kick = html.escape(s.get("kicker", ""))
        if b.get("console"):
            kick = f'<span class="sec-num">{i + 1:02d}</span><span class="sec-slash">//</span> {kick}'
        parts.append(f'<section class="{cls}"><div class="{top_cls}"><div class="sec-head"><span class="sec-kicker">{kick}</span></div>'
                     f'<h2>{inline(s["title"])}</h2>{intro}{first}</div>{rest}</section>')
    cta = c.get("cta", {})
    btn = f'<a class="cta-btn" href="{b["cta_button"][1]}">{b["cta_button"][0]}</a>' if b["cta_button"] else ""
    if cta.get("button") is False:  # quiet CTA without the brand button (2026-10-26, Firma-Serie)
        btn = ""
    parts.append(f"""
<div class="cta"><div class="glow"></div>
  <div class="cta-title">{inline(cta.get("title", b["cta_title"]))}</div>
  <div class="cta-text">{inline(cta.get("text", ""))}</div>
  {btn}
  <div class="cta-foot">{cta.get("foot", b["cta_foot"])}</div>
</div>""")
    if c.get("fineprint"):  # optional small legal note under the CTA (e.g. "Keine Rechtsberatung …")
        parts.append(f'<p class="fineprint">{inline(c["fineprint"])}</p>')
    css = (CSS.replace("Superkind · TOPIC-Guide", b["footer"]).replace("--accent:#FF6B35", "--accent:" + b["accent"]).replace("255,107,53", b["rgb"])
           .replace("FONTDIR", "file://" + FONT_DIR).replace("TOPIC", html.escape(c.get("topic", "")))) + b.get("extra_css", "")
    return f'<!doctype html><html lang="{b.get("lang", "de")}"><head><meta charset="utf-8"><title>{html.escape(cover["title"])}</title><style>{css}</style></head><body>{"".join(parts)}</body></html>'


def print_pdf(html_path: str, out_pdf: str):
    chrome = next((p for p in CHROME_CANDIDATES if os.path.exists(p)), None)
    if not chrome:
        raise SystemExit("No Chrome found for printing")
    subprocess.run([chrome, "--headless", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files",
                    f"--print-to-pdf={out_pdf}", "file://" + html_path], check=True, capture_output=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--html-out")
    ap.add_argument("--brand", choices=sorted(BRANDS), default="superkind")
    a = ap.parse_args()
    global JSON_DIR
    JSON_DIR = os.path.dirname(os.path.abspath(a.json))
    content = json.load(open(a.json, encoding="utf-8"))
    html_path = os.path.abspath(a.html_out) if a.html_out else tempfile.mktemp(suffix=".html")
    open(html_path, "w", encoding="utf-8").write(build_html(content, a.brand))
    print_pdf(html_path, os.path.abspath(a.out))
    print("Built:", a.out)


if __name__ == "__main__":
    main()
