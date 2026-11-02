---
name: static-ad
description: Baut Instagram/Meta Static Ads (Lead-Gen) für Pius' Marken in Serie – aus bewährten Vorlagen (HTML → PNG via headless Chrome), mit Primärtext + Headline pro Ad, und lernt aus Ads-Manager-Zahlen (CPL, CTR). Start mit boilr.ai. Nutze diesen Skill immer, wenn Pius nach Static Ads, Bild-Ads, Creatives, "neue Ads", "Ad-Varianten", "frische Motive", "Anzeigen für boilr", "Werbemüdigkeit / Frequenz zu hoch", "Batch Ads" fragt, oder Ads-Manager-Zahlen/Screenshots schickt, um Gewinner und Verlierer auszuwerten. Nicht für Video-Reels (dafür heygen-video-generator).
---

# Static Ads

Ziel: Pius sagt „6 neue boilr Ads“ → er bekommt 6 fertige PNGs (4:5 Feed + 9:16 Story) plus texte.txt mit Headline und Primärtext, die direkt in den Ads Manager gehen. Maßstab ist **CPL ≤ 30 € (max. 32 €)**, nicht Schönheit.

## Ablauf

1. **Brand + Lage lesen:** `references/brands/<brand>.md` (Angebot, Zielgruppe, Copy-Formel, Verbote) und `references/performance-log.md` (was gewinnt, was verliert).
2. **Vorlage wählen:** Gewinner zuerst. Pro Batch mind. 4 Varianten auf der besten Vorlage, max. 2 Experimente. Ansätze, die im Log als Verlierer stehen, nicht wiederholen.
3. **Varianten schreiben:** Pro Ad ändert sich **eine** Sache deutlich (Hook-These, Signal-Set, Angebot, Zeitachse) – so bleibt das Testergebnis lesbar.
4. **batch.json schreiben** in den Ausgabe-Ordner, dann rendern:
   `python3 ~/.claude/skills/static-ad/assets/render.py "<Ordner>/batch.json"`
5. **Kontaktbogen prüfen** (ffmpeg hstack/vstack aus broll/node_modules/ffmpeg-static, dann ansehen): Text abgeschnitten? Karten-Titel > 2 Zeilen? Zahlen in der Serif richtig? 9:16 Safe Zones frei (oben/unten 250 px)?
6. **texte.txt** schreiben: pro Ad Name, Headline, Primärtext in der Copy-Formel der Marke.
7. **Übergabe:** Ordner `~/Desktop/Static Ads/<YYYY-MM-DD> <Marke> <Vorlage>/` mit PNGs, batch.json, texte.txt. Kurz sagen, in welche Anzeigengruppe was gehört.

## Namenskonvention

`<audience>-static-<vorlage>-v<N>-<slug>`, z. B. `emp-static-signalscard-v2-lastsignal`. Der Dateiname = Anzeigenname im Ads Manager, damit Zahlen später eindeutig zuordenbar sind.

## Vorlagen (assets/render.py)

| template | Basis | Felder |
|---|---|---|
| `signal-cards` | emp-static-signalscard (bester Static-CPL) | headline, accent (grüne Serif-Zeile), sub, cards[4]{label,title,body,tone: white/mint/green}, cta (optional, schwarzer Balken), badge, accent_size, h1_size |
| `sticker-photo` | emp-static-pointing (meiste Leads) | photo (echtes Foto OHNE Text), pills[]{text (\n = neue Zeile), color white/red/yellow/green, top, left/right, size, italic} |

Regeln `signal-cards`: Karten-Titel max. 2 Zeilen à ~22 Zeichen, Label = Kategorie oder „Zeit · Kategorie“, genau eine grüne Karte (die Pointe, meist unten rechts). Signale plausibel und generisch (keine echten Firmennamen, keine erfundenen Kundenzitate).

Regeln `sticker-photo`: Nur mit echten Fotos von Pius/Gründer (Pius liefert sie; keine KI-generierten Personen). Reihenfolge der Pills wie im Gewinner: weiß = Zielgruppe („For recruitment agencies“), rot = Schmerz, gelb = Lösung, grün = CTA mit ⬇️.

Neue Vorlage = neue Funktion in render.py + Zeile in dieser Tabelle + Referenzbild in `references/<brand>-reference/`.

## Lernschleife

Wenn Pius Zahlen schickt (CSV oder Screenshots aus dem Ads Manager auf **Anzeigen-Ebene**; der CSV-Export scheitert dort oft → Screenshots reichen):
1. Pro Anzeige Leads, CPL, CTR, CPC(Link) in `references/performance-log.md` eintragen (Datum, Zeitraum).
2. Urteil erst ab ~5 Leads oder ~150 € Spend; darunter „offen“.
3. Gewinner/Verlierer-Muster oben im Log als eine Zeile festhalten und die Vorlagen-Priorität anpassen.

## Neue Marke anlegen

`references/brands/<brand>.md` (Angebot, Link, Zielgruppe, Sprache, Copy-Formel, Verbote), Farben + Logo in `assets/brands/<brand>/` und im `BRAND`-Dict in render.py. Quellen selbst ziehen: Website (WebFetch), Meta Ad Library (Apify `apify/facebook-ads-scraper` mit Ad-Library-URL `q=<domain>`), lokale Creatives unter `~/Desktop/02 Bilder & Creatives/`.
