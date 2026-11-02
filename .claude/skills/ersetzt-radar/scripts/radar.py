#!/usr/bin/env python3
"""Ersetzt-Radar: Kandidaten fuer "Claude hat X ersetzt"-Reels verwalten, scoren, kalibrieren.

Alle Daten liegen in einer Excel-Datei (Standard: ~/Documents/ersetzt-radar/radar.xlsx),
Gewichte und Einstellungen in config.json daneben. Claude sammelt die Rohdaten (Apify,
Websuche, eigene Bewertung) und uebergibt sie als JSON-Datei; dieses Skript rechnet.

Befehle:
  init                         Excel + config anlegen (idempotent)
  add FILE                     Kandidaten hinzufuegen  [{"name","typ","quelle","notiz"}]
  pending                      zeigt, welchen Kandidaten welches Signal fehlt
  set-trends FILE              [{"terms":[Anker, t1..t4], "averages":[..]}]  (Anker zuerst)
  set-insta FILE               {"Name": [{"plays":int,"shares":int,"ai":bool}, ...]}
  set-rubrik FILE              {"Name": {"schmerz":1-5,"reichweite":1-5,"glaubwuerdig":1-5,"begruendung":"..."}}
  score                        alle Scores neu berechnen
  top [N]                      beste noch nicht gepostete Kandidaten
  sync-posts FILE              eigene Reels [{"code","datum","caption","plays","likes","comments","shares"}]
  link CODE NAME               Reel einem Kandidaten zuordnen
  report                       gepostete Ersetzt-Reels: Score vs. echte Performance
  calibrate [--apply]          Signale gegen Performance pruefen, Gewichte vorschlagen/setzen
  status NAME STATUS           Status setzen (neu|vorgeschlagen|gepostet|verworfen)
"""
import json
import math
import os
import re
import statistics
import sys
from datetime import date

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill
from openpyxl.utils import get_column_letter

DATA_DIR = os.path.expanduser(os.environ.get("ERSETZT_RADAR_DIR", "~/Documents/ersetzt-radar"))
XLSX = os.path.join(DATA_DIR, "radar.xlsx")
CONFIG = os.path.join(DATA_DIR, "config.json")

DEFAULT_CONFIG = {
    "instagram_handle": "",
    "trends_anker": "Steuerberater",
    # v2 (29.9.2026): nach Abgleich mit 52 eigenen Reels. Bekanntheit/Schmerz/Reichweite in der
    # Gesamtbevoelkerung sagten nichts voraus; Hits waren bezahlte, sichtbare Dinge als Ich-Story.
    "gewichte": {"preisschild": 0.45, "ich_story": 0.35, "sichtbar": 0.10, "content": 0.10,
                 "bekanntheit": 0.0, "schmerz": 0.0, "reichweite": 0.0},
    "glaubwuerdig_faktor": {"1": 0.3, "2": 0.6, "3": 1.0, "4": 1.0, "5": 1.0},
    "ausschluss_faktor": 0.5,
    "kalibrierung_min_posts": 8,
}

# Signal -> (Spalte, Art). "mess" ist schon 0..100, "rubrik" ist 1..5.
SIGNALS = {
    "preisschild": ("P_preisschild", "rubrik"),
    "sichtbar": ("V_sichtbar", "rubrik"),
    "ich_story": ("I_ich_story", "rubrik"),
    "content": ("C_content", "mess"),
    "bekanntheit": ("B_bekanntheit", "mess"),
    "schmerz": ("S_schmerz", "rubrik"),
    "reichweite": ("R_reichweite", "rubrik"),
}
RUBRIK_KEYS = {"preisschild": "P_preisschild", "sichtbar": "V_sichtbar", "ich_story": "I_ich_story",
               "schmerz": "S_schmerz", "reichweite": "R_reichweite", "glaubwuerdig": "G_glaubwuerdig"}

K_COLS = ["name", "typ", "status", "score", "P_preisschild", "V_sichtbar", "I_ich_story", "C_content",
          "B_bekanntheit", "S_schmerz", "R_reichweite", "G_glaubwuerdig", "ausschluss", "begruendung",
          "headline", "briefing", "trends_ratio", "insta_p75_plays", "insta_max_ki_plays", "insta_n",
          "quelle", "notiz", "hinzugefuegt", "gescored_am", "post_code", "perf_index"]
P_COLS = ["code", "datum", "alter_tage", "kandidat", "plays", "likes", "comments", "shares",
          "perf_index", "url", "caption"]
L_COLS = ["datum", "aktion", "details"]
SHEETS = {"Kandidaten": K_COLS, "Posts": P_COLS, "Laeufe": L_COLS}


# ---------- Speicher ----------

def load_config():
    if not os.path.exists(CONFIG):
        return dict(DEFAULT_CONFIG)
    with open(CONFIG) as f:
        cfg = json.load(f)
    for k, v in DEFAULT_CONFIG.items():
        cfg.setdefault(k, v)
    return cfg


def save_config(cfg):
    with open(CONFIG, "w") as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)


def load():
    if not os.path.exists(XLSX):
        sys.exit(f"Keine Datei unter {XLSX}. Erst 'init' ausfuehren.")
    wb = load_workbook(XLSX)
    data = {}
    for sheet, cols in SHEETS.items():
        ws = wb[sheet]
        rows = []
        header = [c.value for c in ws[1]]
        for r in ws.iter_rows(min_row=2, values_only=True):
            if all(v is None for v in r):
                continue
            row = dict(zip(header, r))
            rows.append({c: row.get(c) for c in cols})
        data[sheet] = rows
    return data


def save(data):
    wb = Workbook()
    wb.remove(wb.active)
    head_font = Font(bold=True, color="FFFFFF")
    head_fill = PatternFill("solid", fgColor="333333")
    for sheet, cols in SHEETS.items():
        ws = wb.create_sheet(sheet)
        ws.append(cols)
        for c in ws[1]:
            c.font, c.fill = head_font, head_fill
        for row in data[sheet]:
            ws.append([row.get(c) for c in cols])
        ws.freeze_panes = "B2"
        for i, c in enumerate(cols, 1):
            width = 60 if c in ("begruendung", "caption", "notiz", "details") else max(10, len(c) + 2)
            ws.column_dimensions[get_column_letter(i)].width = width
        if sheet == "Kandidaten":
            ws.auto_filter.ref = ws.dimensions
    wb.save(XLSX)


def log(data, aktion, details):
    data["Laeufe"].append({"datum": date.today().isoformat(), "aktion": aktion, "details": details})


def norm(s):
    return re.sub(r"[^a-z0-9äöüß]+", "", (s or "").lower())


def find(data, name):
    n = norm(name)
    for k in data["Kandidaten"]:
        if norm(k["name"]) == n:
            return k
    return None


def read_json(path):
    with open(path) as f:
        return json.load(f)


# ---------- Signale -> 0..100 ----------

def clamp(x):
    return max(0.0, min(100.0, x))


def bekanntheit(ratio):
    """Trends-Durchschnitt relativ zum Anker. Anker = 70, doppelt so gross = 90, halb = 50."""
    if ratio is None:
        return None
    if ratio <= 0:
        return 0.0
    return round(clamp(70 + 20 * math.log2(ratio)), 1)


def views_score(plays):
    """1k Views = 0, 10k = 33, 100k = 67, 1M = 100 (logarithmisch)."""
    if not plays or plays <= 0:
        return 0.0
    return clamp((math.log10(plays) - 3) / 3 * 100)


def rubrik(x):
    return None if x is None else (float(x) - 1) * 25


def signal_value(k, s):
    col, art = SIGNALS[s]
    v = k.get(col)
    return rubrik(v) if art == "rubrik" else v


def ist_ausschluss(k):
    """Keine Pflicht-Rechnung (Agentur, Tool, E-Mail): floppt bei Niklas' Publikum auch mit Preis-Hook."""
    p = k.get("P_preisschild")
    return p is not None and p <= 2


def compute(k, cfg):
    w = cfg["gewichte"]
    active = [s for s in SIGNALS if w.get(s, 0) > 0]
    avail = {s: signal_value(k, s) for s in active if signal_value(k, s) is not None}
    if not avail:
        return None
    wsum = sum(w[s] for s in avail)
    score = sum(w[s] * v for s, v in avail.items()) / wsum
    g = k.get("G_glaubwuerdig")
    if g is not None:
        score *= cfg["glaubwuerdig_faktor"][str(int(g))]
    if ist_ausschluss(k):
        score *= cfg.get("ausschluss_faktor", 0.5)
    # fehlendes Gewicht kostet anteilig, damit Luecken nicht nach oben rutschen
    missing_w = sum(w[s] for s in active if s not in avail) / sum(w[s] for s in active)
    score *= 1 - 0.5 * missing_w
    return round(score, 1)


# ---------- Befehle ----------

def cmd_init():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(CONFIG):
        save_config(DEFAULT_CONFIG)
    if not os.path.exists(XLSX):
        save({s: [] for s in SHEETS})
        print(f"Angelegt: {XLSX}")
    else:
        print(f"Existiert bereits: {XLSX}")


def cmd_add(path):
    data = load()
    added, skipped = [], []
    for c in read_json(path):
        if find(data, c["name"]):
            skipped.append(c["name"])
            continue
        data["Kandidaten"].append({
            "name": c["name"], "typ": c.get("typ"), "status": "neu", "quelle": c.get("quelle"),
            "notiz": c.get("notiz"), "hinzugefuegt": date.today().isoformat()})
        added.append(c["name"])
    log(data, "add", f"{len(added)} neu, {len(skipped)} schon vorhanden")
    save(data)
    print(f"Neu ({len(added)}): {', '.join(added) or '-'}")
    print(f"Schon vorhanden ({len(skipped)}): {', '.join(skipped) or '-'}")


def cmd_pending():
    data = load()
    open_ = [k for k in data["Kandidaten"] if k["status"] not in ("verworfen",)]
    for label, col in (("trends", "trends_ratio"), ("insta", "insta_n"), ("rubrik", "S_schmerz")):
        missing = [k["name"] for k in open_ if k.get(col) is None]
        print(f"{label} fehlt ({len(missing)}): {json.dumps(missing, ensure_ascii=False)}")


def cmd_set_trends(path):
    data, cfg = load(), load_config()
    anchor = norm(cfg["trends_anker"])
    n = 0
    for batch in read_json(path):
        terms, avgs = batch["terms"], batch["averages"]
        if norm(terms[0]) != anchor:
            sys.exit(f"Erster Begriff jedes Batches muss der Anker '{cfg['trends_anker']}' sein.")
        a = avgs[0]
        if not a:
            print(f"Warnung: Anker hat 0 in Batch {terms}, uebersprungen.")
            continue
        if a < 10:
            print(f"Warnung: Anker nur {a} in Batch {terms}. Ein Begriff dominiert, Werte ungenau "
                  f"(Rundung ±{0.5 / a:.0%}). Dominanten Begriff pruefen (mehrdeutig?) und ggf. separat abfragen.")
        for t, v in zip(terms[1:], avgs[1:]):
            k = find(data, t)
            if not k:
                print(f"Warnung: '{t}' ist kein Kandidat, uebersprungen.")
                continue
            k["trends_ratio"] = round(v / a, 3)
            k["B_bekanntheit"] = bekanntheit(k["trends_ratio"])
            n += 1
        k = find(data, terms[0])
        if k:
            k["trends_ratio"], k["B_bekanntheit"] = 1.0, bekanntheit(1.0)
    log(data, "set-trends", f"{n} Kandidaten")
    save(data)
    print(f"Trends gesetzt fuer {n} Kandidaten.")


KI_RE = re.compile(r"\b(ki|claude|chatgpt|gpt|ai|agent|agenten|automatisier\w*|künstliche intelligenz)\b", re.I)
DE_RE = re.compile(r"\b(der|die|das|und|ist|nicht|ich|du|mit|für|deine?n?|wie|auf|sich|oder)\b", re.I)


def relevant(item, name, keys):
    """Zaehlt nur deutsche Reels, deren Caption X wirklich erwaehnt (Suche liefert sonst viel Rauschen)."""
    cap = item.get("caption") or ""
    if len(DE_RE.findall(cap)) < 2:
        return False
    return any(re.search(r"\b" + re.escape(k) + r"\w*", cap, re.I) for k in keys)


def cmd_set_insta(path):
    """Eingabe: {"Name": {"keys": ["sap"], "items": [{"plays","shares","caption"}]}} oder {"Name": [items]}."""
    data = load()
    n = 0
    for name, entry in read_json(path).items():
        k = find(data, name)
        if not k:
            print(f"Warnung: '{name}' ist kein Kandidat, uebersprungen.")
            continue
        items = entry["items"] if isinstance(entry, dict) else entry
        keys = entry.get("keys") if isinstance(entry, dict) else None
        keys = keys or [name.split()[0]]
        rel = [i for i in items if relevant(i, name, keys)]
        plays = sorted(int(i.get("plays") or 0) for i in rel)
        ki = [int(i.get("plays") or 0) for i in rel if KI_RE.search(i.get("caption") or "")]
        print(f"  {name}: {len(rel)}/{len(items)} relevant, davon {len(ki)} mit KI-Winkel")
        german = sum(1 for i in items if len(DE_RE.findall(i.get("caption") or "")) >= 2)
        if german < 3:
            # Suche hat fast nur fremdsprachige Treffer geliefert: Query-Problem, kein echtes Null-Signal
            k["insta_n"], k["C_content"] = None, None
            print(f"    -> nur {german} deutsche Treffer, Signal verworfen. Mit deutscherer Query neu suchen.")
            continue
        p75 = plays[int(0.75 * (len(plays) - 1))] if plays else 0
        mx = max(ki) if ki else 0
        k["insta_n"] = len(plays)
        k["insta_p75_plays"] = p75
        k["insta_max_ki_plays"] = mx
        # Thema zieht generell (p75) + KI-Winkel auf das Thema zieht (bestes KI-Reel)
        k["C_content"] = round(0.5 * views_score(p75) + 0.5 * views_score(mx), 1)
        n += 1
    log(data, "set-insta", f"{n} Kandidaten")
    save(data)
    print(f"Content-Signal gesetzt fuer {n} Kandidaten.")


def cmd_set_rubrik(path):
    data = load()
    n = 0
    for name, r in read_json(path).items():
        k = find(data, name)
        if not k:
            print(f"Warnung: '{name}' ist kein Kandidat, uebersprungen.")
            continue
        # nur mitgelieferte Felder ueberschreiben, damit Nachbewertungen einzelner Signale moeglich sind
        for key, col in RUBRIK_KEYS.items():
            if key not in r:
                continue
            v = int(r[key])
            if not 1 <= v <= 5:
                sys.exit(f"{name}: {key} muss 1-5 sein")
            k[col] = v
        for key in ("begruendung", "headline", "briefing"):
            if r.get(key):
                k[key] = r[key]
        n += 1
    log(data, "set-rubrik", f"{n} Kandidaten")
    save(data)
    print(f"Rubrik gesetzt fuer {n} Kandidaten.")


def cmd_score(quiet=False):
    data, cfg = load(), load_config()
    today = date.today().isoformat()
    for k in data["Kandidaten"]:
        k["score"] = compute(k, cfg)
        k["ausschluss"] = "ja" if ist_ausschluss(k) else None
        k["gescored_am"] = today
    data["Kandidaten"].sort(key=lambda k: -(k["score"] or -1))
    log(data, "score", f"{len(data['Kandidaten'])} Kandidaten, Gewichte {cfg['gewichte']}")
    save(data)
    if not quiet:
        print("Scores aktualisiert.")


def fmt(v):
    return "-" if v is None else (f"{v:.0f}" if isinstance(v, float) else str(v))


def cmd_top(n=10):
    data = load()
    rows = [k for k in data["Kandidaten"] if k["status"] in ("neu", "vorgeschlagen") and k["score"] is not None]
    rows.sort(key=lambda k: -k["score"])
    print("| # | X | Score | Preis | Sichtbar | Ich | Content | Glaubw. | Headline |")
    print("|---|---|---|---|---|---|---|---|---|")
    for i, k in enumerate(rows[:n], 1):
        flag = " ⛔" if k.get("ausschluss") else ""
        print(f"| {i} | {k['name']}{flag} | **{fmt(k['score'])}** | {fmt(k.get('P_preisschild'))} | "
              f"{fmt(k.get('V_sichtbar'))} | {fmt(k.get('I_ich_story'))} | {fmt(k['C_content'])} | "
              f"{fmt(k['G_glaubwuerdig'])} | {k.get('headline') or '-'} |")


REIFE_TAGE = 7


def alter_tage(p):
    try:
        return (date.today() - date.fromisoformat(str(p.get("datum"))[:10])).days
    except ValueError:
        return None


FENSTER = 8  # Nachbar-Reels je Seite fuer den Vergleichs-Median


def perf_indices(posts):
    """Views / Median der zeitlichen Nachbar-Reels (je 8 davor und danach).

    Die Reichweite des Accounts schwankt stark (Median Apr-Mai ~32k, Jul-Sep ~5k). Ein globaler
    Median wuerde alte Reels zu Hits und neue zu Flops machen. Reels unter 7 Tagen: noch kein Index.
    """
    for p in posts:
        p["alter_tage"] = alter_tage(p)
        p["perf_index"] = None
    reif = sorted([p for p in posts if (p["alter_tage"] or 0) >= REIFE_TAGE and p.get("plays")],
                  key=lambda p: str(p.get("datum")))
    for i, p in enumerate(reif):
        nb = [reif[j]["plays"] for j in range(max(0, i - FENSTER), min(len(reif), i + FENSTER + 1)) if j != i]
        if nb:
            p["perf_index"] = round(p["plays"] / statistics.median(nb), 2)


def cmd_sync_posts(path):
    data = load()
    by_code = {p["code"]: p for p in data["Posts"]}
    new = 0
    for r in read_json(path):
        p = by_code.get(r["code"])
        if not p:
            p = {"code": r["code"]}
            data["Posts"].append(p)
            by_code[r["code"]] = p
            new += 1
        for c in ("datum", "caption", "plays", "likes", "comments", "shares"):
            if r.get(c) is not None:
                p[c] = r[c]
        p["url"] = f"https://www.instagram.com/reel/{r['code']}/"
    perf_indices(data["Posts"])
    sync_links(data)
    log(data, "sync-posts", f"{new} neue Reels")
    save(data)
    # Nur Vorschlaege: ein Name in der Caption heisst nicht, dass das Reel "Claude hat X ersetzt" ist
    # (z. B. erwaehnt das Buchhaltungs-Reel den Steuerberater nur nebenbei). Zuordnen per `link`.
    names = sorted(data["Kandidaten"], key=lambda k: -len(k["name"]))
    print(f"{new} neue Reels. Unverknuepft (mit Namens-Treffern als Vorschlag):")
    for p in data["Posts"]:
        if p.get("kandidat"):
            continue
        cap = norm(p.get("caption"))
        hits = [k["name"] for k in names if len(norm(k["name"])) >= 3 and norm(k["name"]) in cap]
        print(f"  {p['code']} ({p.get('datum')}, {p.get('plays')} Views)"
              f"{' Vorschlag: ' + ', '.join(hits[:3]) if hits else ''}: {(p.get('caption') or '')[:90]!r}")


def sync_links(data):
    """Kandidat bekommt den Median-Index seiner reifen Reels (ein Thema kann mehrere Reels haben)."""
    by_k = {}
    for p in data["Posts"]:
        if p.get("kandidat"):
            by_k.setdefault(norm(p["kandidat"]), []).append(p)
    for k in data["Kandidaten"]:
        posts = by_k.get(norm(k["name"]))
        if not posts:
            if k.get("status") == "gepostet":
                k["status"], k["post_code"], k["perf_index"] = "vorgeschlagen", None, None
            continue
        reif = [p["perf_index"] for p in posts if p.get("perf_index") is not None]
        k["status"] = "gepostet"
        k["post_code"] = ", ".join(p["code"] for p in posts)
        k["perf_index"] = round(statistics.median(reif), 2) if reif else None


def cmd_link(code, name):
    """Reel einem Kandidaten zuordnen; NAME '-' hebt die Zuordnung auf."""
    data = load()
    p = next((p for p in data["Posts"] if p["code"] == code), None)
    if not p:
        sys.exit("Reel-Code nicht gefunden.")
    if name.strip() == "-":
        p["kandidat"] = None
        target = "-"
    else:
        k = find(data, name)
        if not k:
            sys.exit("Kandidat nicht gefunden.")
        p["kandidat"] = target = k["name"]
    sync_links(data)
    log(data, "link", f"{code} -> {target}")
    save(data)
    print(f"{code} -> {target} (perf_index {p.get('perf_index')})")


def ranks(xs):
    order = sorted(range(len(xs)), key=lambda i: xs[i])
    r = [0.0] * len(xs)
    i = 0
    while i < len(xs):
        j = i
        while j + 1 < len(xs) and xs[order[j + 1]] == xs[order[i]]:
            j += 1
        for m in range(i, j + 1):
            r[order[m]] = (i + j) / 2
        i = j + 1
    return r


def spearman(a, b):
    if len(a) < 3:
        return None
    ra, rb = ranks(a), ranks(b)
    ma, mb = statistics.mean(ra), statistics.mean(rb)
    cov = sum((x - ma) * (y - mb) for x, y in zip(ra, rb))
    va = math.sqrt(sum((x - ma) ** 2 for x in ra))
    vb = math.sqrt(sum((y - mb) ** 2 for y in rb))
    return None if va == 0 or vb == 0 else cov / (va * vb)


def cmd_calibrate(apply=False):
    data, cfg = load(), load_config()
    pts = [k for k in data["Kandidaten"] if k.get("perf_index") is not None]
    print(f"Verknuepfte Reels mit Performance: {len(pts)}")
    sig = {s: col for s, (col, _) in SIGNALS.items()}
    rhos = {}
    print("| Signal | n | Spearman mit Performance | Gewicht jetzt |")
    print("|---|---|---|---|")
    for s, col in sig.items():
        pairs = [(k[col], k["perf_index"]) for k in pts if k.get(col) is not None]
        rho = spearman([x for x, _ in pairs], [y for _, y in pairs]) if pairs else None
        rhos[s] = rho
        print(f"| {s} | {len(pairs)} | {'-' if rho is None else f'{rho:+.2f}'} | {cfg['gewichte'].get(s, 0):.2f} |")
    scores = [(k["score"], k["perf_index"]) for k in pts if k.get("score") is not None]
    rho_total = spearman([x for x, _ in scores], [y for _, y in scores]) if scores else None
    print(f"\nGesamtscore vs. Performance: {'-' if rho_total is None else f'{rho_total:+.2f}'}")
    if len(pts) < cfg["kalibrierung_min_posts"]:
        print(f"Zu wenig Daten fuer neue Gewichte (min. {cfg['kalibrierung_min_posts']}).")
        return
    if rho_total is not None and rho_total <= 0:
        print("ACHTUNG: Der Score sagt die Performance nicht voraus (Korrelation <= 0). Gewichte umzuverteilen "
              "hilft dann nicht; es fehlt ein Signal. Keine Gewichte vorgeschlagen, Signale ueberdenken.")
        return
    raw = {s: max(0.05, r if r is not None else 0.05) for s, r in rhos.items()}
    tot = sum(raw.values())
    neu = {s: round(0.5 * cfg["gewichte"].get(s, 0) + 0.5 * raw[s] / tot, 3) for s in raw}
    norm_ = sum(neu.values())
    neu = {s: round(v / norm_, 3) for s, v in neu.items()}
    print(f"Vorgeschlagene Gewichte (50/50 mit alten gemischt): {neu}")
    if apply:
        cfg["gewichte"] = neu
        save_config(cfg)
        log(data, "calibrate", f"neue Gewichte {neu}, n={len(pts)}")
        save(data)
        cmd_score(quiet=True)
        print("Gewichte uebernommen und Scores neu berechnet.")


def cmd_report():
    """Gepostete Ersetzt-Reels: Score (Vorhersage) neben echter Performance."""
    data = load()
    rows = []
    for p in data["Posts"]:
        if not p.get("kandidat"):
            continue
        k = find(data, p["kandidat"]) or {}
        rows.append((p, k))
    rows.sort(key=lambda r: -(r[0].get("perf_index") or -1))
    print("| X | Score | Views | Perf-Index | Alter (Tage) | Urteil | Reel |")
    print("|---|---|---|---|---|---|---|")
    for p, k in rows:
        pi = p.get("perf_index")
        urteil = ("reift noch" if pi is None else "Hit" if pi >= 2 else "gut" if pi >= 1.2
                  else "normal" if pi >= 0.8 else "Flop")
        print(f"| {p['kandidat']} | {fmt(k.get('score'))} | {p.get('plays')} | {'-' if pi is None else pi} | "
              f"{p.get('alter_tage')} | {urteil} | {p.get('url')} |")
    reif = [p for p, _ in rows if p.get("perf_index") is not None]
    print(f"\n{len(rows)} Ersetzt-Reels verknuepft, {len(reif)} reif (>= {REIFE_TAGE} Tage). "
          f"Kalibrierung ab {load_config()['kalibrierung_min_posts']} reifen Reels.")


def cmd_status(name, status):
    data = load()
    k = find(data, name)
    if not k:
        sys.exit("Kandidat nicht gefunden.")
    k["status"] = status
    log(data, "status", f"{k['name']} -> {status}")
    save(data)
    print(f"{k['name']}: {status}")


def main():
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    c = a[0]
    if c == "init":
        cmd_init()
    elif c == "add":
        cmd_add(a[1])
    elif c == "pending":
        cmd_pending()
    elif c == "set-trends":
        cmd_set_trends(a[1])
    elif c == "set-insta":
        cmd_set_insta(a[1])
    elif c == "set-rubrik":
        cmd_set_rubrik(a[1])
    elif c == "score":
        cmd_score()
    elif c == "top":
        cmd_top(int(a[1]) if len(a) > 1 else 10)
    elif c == "sync-posts":
        cmd_sync_posts(a[1])
    elif c == "link":
        cmd_link(a[1], " ".join(a[2:]))
    elif c == "calibrate":
        cmd_calibrate("--apply" in a)
    elif c == "report":
        cmd_report()
    elif c == "status":
        cmd_status(" ".join(a[1:-1]), a[-1])
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
