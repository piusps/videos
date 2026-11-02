# Prüfung Design (Style-Frames) · Folge 20 „Mit oder ohne Umsatzsteuer?“ · Runde 1

Prüfer: firma-pruefer, 2026-11-01 (Slot 21:00, Serientag 5). Prüflinge: `runs/firma-ep/tag20/style-frames/` (78 Stills), `style-frames.jpg`, `vergleich-f17-f19-f20.jpg`, `runs/firma-tag20/design/stills-bericht.md`, `public/firma-ep/tag20/episode.json`. Maßstab: beats.json, regieplan.md, script.txt, words.json, K.-o.-Liste F17 final R1/R2, F19 design R1/R2.
Gemini nicht genutzt → manuell Still für Still. 25 Zusatz-Frames selbst gerendert (26–32, 130–147, 231/240, 711–735, 912–926, 984–992); Stand `runs/firma-ep/tag20/style-frames` danach wiederhergestellt (wieder 78 Dateien, `style-frames.jpg` zurückkopiert).

## Belege (`pruefung/design-r1/`)
- `hook-0-3s.jpg`, `hook-3-6s.jpg` (alle Hook-Stills mit Zeit), `eigen-hook.jpg` (0,87–1,07 s und 4,33–4,90 s), `eigen/` (Einzelframes)
- `rest-a.jpg`, `rest-b.jpg` (7,3–44,4 s), `mask-durchgang.jpg`, `entsch-22.2-pill.png`
- `heute-13.6-top.png`, `heute-15.6-top.png` (HUD-Kollision)
- `warum-24.0-leer.png`, `warum-24.0.png`, `warum-27.9.png`, `warum-31.0.png`, `warum-33.2.png`, `eigen-warum.jpg` (30,4–33,07 s)
- `schriftmessung.png` (1:1-Ausschnitte neben Lineal: rot 42 px Versalhöhe = 58 px Schrift, blau 46 px = 64 px), `grid.jpg`
- `cta-38.0-board.png`, `cta-39.0-board.png`, `cta-40.3-prompt.png`

## Pflicht-Messungen
| Messung | Ergebnis | Urteil |
|---|---|---|
| Frame 0 | Frage „Wie viel Umsatz macht eine KI in 100 Tagen?“ + STEUER-TAFEL (MIT USt 91,60 € ✓ / OHNE USt 109 €) ab f0, Maskottchen ganz sichtbar | ✓ |
| 0,5-s-Fenster 0–6 s | 0–0,5 Pills · 0,5–1 Kamera/Schnitt 0,90 · 1–1,5 109 € graut aus (1,07) · 1,5–2 „Unternehmen“/Glanz · 2–2,5 Shirt-Reihe · 2,5–3 „100 Tage“ · 3–3,5 „ganz“ · 3,5–4 Stempel GANZ ALLEINE. (3,66) · 4–4,5 „führt“-Pop (≈ 4,0–4,1) · 4,5–5 Board-Schnitt 4,85 · 5–5,5 „Ich probier“ · 5,5–6 „aus“ | ✓ je Fenster. Aber: 4,10–4,85 s sichtbar nichts Neues (Diff f130→f144 nur 0,4–0,9 % Pixel = Stempel-Wackeln). Das im Bericht genannte Ereignis 4,53 s ist nicht zu sehen; die Rechnung „größte Lücke 0,47 s (3,99→4,53)“ ist falsch (0,54 s), real ≈ 0,7 s ohne Ereignis → H1 |
| Maskottchen ≤ 1/3, Augen frei (alle 78 + 25 eigene Stills) | Hook 0–0,87 ganz, 0,90–4,85 ganz weg (harter Abgang, kein Teilbild), ab 4,90 ganz; Pills über dem Kopf. Rückblick 7,27: Pill „Shirts“ auf Arm/Unterkörper, Augen frei. Briefe/Heute/Claude/Entscheidung/Warum/Als: ganz sichtbar, Pills darüber (`mask-durchgang.jpg`). CTA 38–44,4: Untertitel über dem Kopf, Augen frei | ✓ kein K.-o. Gesicht 10–37 s weiter überstrahlt (Alt-H2) |
| Schrift ≥ 58 px (Pixel) | Frame-0 „Betrieb zahlt effektiv“ ≈ 61, **„mit Vorsteuerabzug“ ≈ 54–56** · Warum 91,60/109 ≈ 64 · 17,40 € ZURÜCK ≈ 61 · +19 % EINKAUF ≈ 78, „als Kleinunternehmer“ ≈ 63 · 19 % teurer ≈ 64 · 5 JAHRE BINDUNG ≈ 61, mindestens/fünf Jahre ≈ 65 · Marge.md / „keine Steuerberatung“ ≈ 64 · Entscheidung ≈ 68 · Erfinde nichts ≈ 66 | 1 Unterschreitung (Frame 0, aussagend: Bedingung der Rechnung) |
| ≤ 1 neuer Textblock | eingehalten; 30,60 s und 32,93 s kommen Karte + Beleg-Snip im selben Kasten (je ein Block, inhaltlich doppelt: „+19 % EINKAUF“ und „19 % teurer.“) | ✓ (H3) |
| Karten ≤ 4 Wörter | alle ✓ außer **Frame-0-Kopf „Betrieb zahlt effektiv / mit Vorsteuerabzug“ = 5 Wörter** | ✗ (klein) |
| Fakten | Shot 08 nur 91,60/109 scharf (25,6 s), Shot 10 nur „19 % teurer.“, Shot 04 nur „mindestens fünf Jahre“, 03/06 nicht gesehen, „3 Seiten“ nicht lesbar. 17,40 € = 109 × 19/119 ✓; 109/91,60 = 1,19 ✓ | ✓ |
| Datenschutz | Claude-Fenster nur Kopf „Claude“, keine Sidebar, keine Namen/Mails; Briefe unlesbar | ✓ |
| KEINE STEUERBERATUNG | Markierung im Snip 16,9 s + Bauchbinde 29,5–33,7 s, nicht auf dem Maskottchen | ✓ |
| CTA-Board | GEWERBE nur Plakette „MIT UST“, kein Haken; DRUCK „5ER OFFEN“; Feld 9 ohne Zähler | ✓ (H4) |
| Look vs. F17/F19 | gleiche Bildsprache, Frame 0 klarer als F19; Heute-Akt und Warum-Start schwächer (s. Tickets) | ✓ mit Abzug |

## Offene Punkte aus stills-bericht.md
1. **Rückblick-Board ohne Plaketten:** F19 endete mit „5ER OFFEN“ + „UST ?“; F20-Rückblick (7,3–9,6 s) zeigt sie nicht, CTA dann „5ER OFFEN“ + „MIT UST“. Anschlussfehler, aber für Neu-Zuschauer unsichtbar; Regieplan wünscht sie → H2 (empfohlen, nicht blockierend).
2. **Feldnamen wie F17/F19:** richtig so (Serienkonsistenz vor Regieplan-Wortlaut). Kein Abzug.
3. **„3 Seiten“ unlesbar:** korrekt (nicht freigegeben).
4. **Warum-Anfang 23,7–24,6 leer:** bestätigt und schlimmer als beschrieben: großes dunkles Panel mit zwei grauen Platzhalter-Balken statt Beträgen (`warum-24.0-leer.png`) → Ticket 02.
5. **Hook ab 0,9 s ohne Maskottchen:** wie F19-Final (bestanden), ganz weg statt halb → ok.

Neu gefunden: **Heute-Akt 13,6–15,6 s**: TAG-Plakette liegt auf dem Kopf der Karte „MIT USt“, Plan-HUD auf der Ecke von „OHNE USt“ (`heute-13.6-top.png`, `heute-15.6-top.png`) → Ticket 01.

## Noten
| Kriterium | Note | Kurzbeleg |
|---|---|---|
| Frame 0 / Hook 0–6 s | 8 | Frage + Tafel ab f0, jedes Fenster ein Ereignis; 4,1–4,85 ruhig (H1) |
| Maskottchen (K.-o.-Durchgang) | 8 | nirgends > 1/3 oder Augen bedeckt; Gesicht überstrahlt |
| Lesbarkeit / HUD | 7 | Heute-Karten kollidieren mit TAG- und Plan-HUD (13,6–15,6 s) |
| Text-Regeln (Größe, ≤ 4 Wörter, 1 Block) | 7 | Frame-0-Kopf 5 Wörter, „mit Vorsteuerabzug“ ≈ 55 px |
| Keine leere Karte / kein Platzhalter | 7 | Warum-Start 23,7–24,6 leeres Panel + Platzhalter-Balken; CTA-Prompt-Balken (Alt-H1 F19) |
| Fakten / Datenschutz / Disclaimer | 9 | alle Freigaben eingehalten, Rechnung stimmt |
| CTA + Board-Stand | 8 | Stand korrekt; Plakette „5ER OFFEN“ deckt Nr. + Haken von Feld 2 (H4) |
| Look vs. F17/F19 + Backlog-Upgrade | 8 | STEUER-TAFEL neu und stark; Rückblick-Plaketten fehlen (H2) |

**Gesamtnote 7,8 / 10.** Kein K.-o. verletzt.

## Urteil
**Nicht bestanden (Runde 1).** Drei Kriterien bei 7. Alle Korrekturen lokal in gen.py/ep.py bzw. den Overlays, ohne Ton/Timing/Skript anzufassen. Runde 2 mit frischem Agent an neuen Stills 13,6/14,5/15,6, 23,7/24,0/24,3/24,6 und Frame 0.

## Tickets
```
TICKET design-R1-01 → firma-design
Kriterium: Lesbarkeit / HUD · Note: 7/10
Beleg: Stills 13,6 / 14,5 / 15,6 s (sf-0408, sf-0435, sf-0468); design-r1/heute-13.6-top.png, heute-15.6-top.png
Problem: Die Karten MIT USt / OHNE USt reichen bis an den oberen Rand; TAG-Plakette liegt auf „MIT USt“, Plan-HUD auf der Ecke von „OHNE USt“.
Soll: In 12,9–15,9 s beginnt jede Karte ≥ 20 px unter der Unterkante von TAG-Plakette (≈ y 150) und Plan-HUD; keine Überlappung von HUD und Karte in einem einzigen Frame; Kartentitel bleiben ≥ 58 px, Maskottchen unten weiter ganz sichtbar.

TICKET design-R1-02 → firma-design
Kriterium: Keine leere Karte / kein Platzhalter · Note: 7/10
Beleg: Still 24,0 s (sf-0720) + eigen/sf-0711, sf-0720, sf-0726, sf-0735; design-r1/warum-24.0-leer.png
Problem: Warum-Panel steht 23,7–24,6 s als große leere Fläche mit zwei grauen Platzhalter-Balken statt Beträgen.
Soll: Ab dem ersten Frame des Warum-Akts stehen 91,60 € / 109 € lesbar (≥ 58 px) in den Kopffeldern und die Betriebs-Kachel ist im Panel (oder das Panel ist so kompakt, dass keine Leerfläche > 25 % der Panelfläche bleibt); in 23,7–24,9 s kein grauer Platzhalter-Balken sichtbar.

TICKET design-R1-03 → firma-design
Kriterium: Text-Regeln · Note: 7/10
Beleg: Frame 0 (sf-0000) und alle Hook-Stills 0–4,8 s; design-r1/schriftmessung.png (oberste Zeile)
Problem: Kopf der STEUER-TAFEL hat 5 Wörter („Betrieb zahlt effektiv / mit Vorsteuerabzug“), die Bedingung „mit Vorsteuerabzug“ ist nur ≈ 55 px.
Soll: Tafelkopf ≤ 4 Wörter und behält die Bedingung (z. B. „Betrieb mit Vorsteuerabzug:“ oder „Effektiv für Betriebe“ + Vorsteuer-Hinweis erst im Warum-Akt); jede Zeile des Kopfs ≥ 58 px Schrift (Versalhöhe ≥ 42 px); Frage, MIT/OHNE-Beträge und Maskottchen bleiben in Frame 0 unverändert ganz sichtbar.
```

## Hinweise (nicht blockierend)
- H1 Hook 4,10–4,85 s: kein sichtbares neues Ereignis (≈ 0,7 s). Formal jedes 0,5-s-Fenster erfüllt, aber für die finale „keine 0,5 s ohne Ereignis“-Prüfung riskant. Vorschlag: kleiner Puls auf 91,60 € oder Shirt-Reihe bei ≈ 4,45 s. Bericht-Zahl „0,47 s“ korrigieren.
- H2 Rückblick-Board 7,3–10,4 s: Plaketten „5ER OFFEN“ (DRUCK) und „UST ?“ (GEWERBE) wie im F19-Ende zeigen, falls die Engine das im Rückblick ohne Änderung kann; sonst Backlog.
- H3 30,6 s und 32,93 s: Karte und Beleg-Snip sagen dasselbe zweimal („+19 % EINKAUF“ / „19 % teurer.“). Ok als ein Block; im Snip steht doppelte Leerstelle „19  %“.
- H4 CTA-Board: „5ER OFFEN“ deckt Nummer „2“ und Haken von Feld 2 und ragt bis an Feld 1 (`cta-38.0-board.png`). Wie F19 akzeptiert; besser rechts in der Nummernzeile.
- H5 CTA 40,3–41,0 s: zwei graue Balken über „Erfinde nichts.“ (Alt-H1 F19, Engine/Backlog).
- H6 Maskottchen-Gesicht 10–37 s überstrahlt (Alt-H2).
