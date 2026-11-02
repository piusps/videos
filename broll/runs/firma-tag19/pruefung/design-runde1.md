# Prüfung Design / Style-Frames · Folge 19 „Versandzeile“ · Runde 1 (Slot 2026-11-01 18:00, nicht erste Folge des Tages)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe design), 2026-11-01. Nichts geändert außer dieser Datei und den Belegen in `pruefung/design-r1/`.
Gemini nicht genutzt → manuell Frame für Frame + Pixelvergleich (PIL).
Prüflinge: `runs/firma-ep/tag19/style-frames/` (57 Stills), `public/firma-ep/tag19/episode.json` + `shots/`, `design/stills-bericht.md`.
Eigene Frames (scale 0,5, `scripts/firma-ep-frames.mjs`, Ausgabe nur `pruefung/design-r1/frames/`): 2, 4, 6, 10, 12, 26, 27, 28, 31, 32, 34, 230, 239, 245, 251, 256, 355, 365, 372, 1020, 1026, 1032, 1110, 1128, 1135, 1180, 1195.

## Belege (`pruefung/design-r1/`)
- `kontakt-0-6s.jpg` (Style-Frames 0–6 s @ 4 fps), `kontakt-akte.jpg`, `kontakt-cta.jpg`, `kontakt-eigene.jpg`
- `f0-zoom-zeilen.png` (Artefakte Frame 0), `f0-zoom-logo.png`
- `hook-maskottchen.jpg` (f8 / f15 / f29 / f38), `maskottchen-akte.jpg`, `f1100-maskottchen.png`, `f1100-hud.png`
- `ereignis-1217.png`, `ereignis-342-376.png`, `shots-off-next.jpg`, `shots-off2-5.jpg`, `claude-warum.jpg`, `f320-brief.png`

## K.-o.-Liste
| Punkt | Befund | Urteil |
|---|---|---|
| Frame 0 Frage + Ergebnis | Frage 2-zeilig groß, Ergebnis-Objekt (Beträge gestrichen + neue Zeile grün unterstrichen) scharf; außer Frage 4 + 8 = 12 Wörter (+ Pills „Wie/viel“) | ✓ |
| **Maskottchen Hook-Einflug** | f6–f10 (≈ 0,2–0,35 s): Maskottchen fällt von oben **hinter** Frage, Lampe und Brief-Panel: f6/f8 Auge hinter Lampe/„Umsatz“, f10 nur Kopfoberkante über dem Panel, > 2/3 verdeckt (`kontakt-eigene.jpg` f-0006/f-0010, `hook-maskottchen.jpg` f8) | **K.-o.** |
| **Maskottchen unter Pills** | f27–f33 (≈ 0,9–1,1 s): Pill „Unternehmen“ (einblendend, halbtransparent) liegt quer über beiden Augen (`hook-maskottchen.jpg` f29, `kontakt-eigene` f-0028/31/32) | **K.-o.** |
| Maskottchen Akte | Recap f219–f280 ganz sichtbar, Augen frei; Brief/Heute klein unten rechts frei; Claude/Warum/Offen/Als unter den Panels frei (`f1100-maskottchen.png` ganz im Bild); CTA groß, Pills über dem Kopf, Augen frei, Flieger f1215 am Board, nicht am Auge | ✓ |
| Namen/Adressen/Websites | Brief: nur Platzhalter [Dein Name]/[Straße, PLZ Ort], Empfänger geschwärzt; „Kolonnenshirt“ = eigene Firma der Serie; Claude ohne Sidebar | ✓ |
| Kein Zähler, kein Tag-Slam, kein „gestern“ | HUD „TAG 5“ + Mini-Board, sonst nichts | ✓ |
| Lieferzeit / 18,32 / 4,49 / „Versand extra“ | in keinem Still lesbar; Claude-Fenster zeigt nur den „kein Beleg“-Satz, Rest weich | ✓ |
| „NUR DOLLAR“ nur mit „im Lauf“ | f780/f820 immer mit „im Lauf: Versandseite“ | ✓ |
| Falsche Zahl | 11,20/5,20 (Brief), 109 € / 5, 10 Minuten: alle wie Skript. Hinweis H3 (29,90 €) | ✓ |

## Regie-Tickets (Runde 2/3)
| Ticket | Soll | Befund | Urteil |
|---|---|---|---|
| R1-01 Frame 0 ≤ 12 Wörter | Beträge scharf gestrichen, Rest weich, neue Zeile 9 W. | 12 Wörter ✓, aber **Reste der weichgezeichneten Zeilen sichtbar**: graue Unterlängen-/Komma-Fragmente bei y ≈ 1140 und ≈ 1245 zwischen den Zeilen (`f0-zoom-zeilen.png`); gleiche Karte wiederholt in Warum (f736–f820) und Ergebnis (f700) | teilweise → Ticket 03 |
| R1-02 34,2 s (Status+0,85) | Badge UST ? am Feld GEWERBE blinkt | Umgesetzt als Wechsel off-6 → off-7 (f1026–f1037). Unterschied der beiden Shots: max. 24 Tonwerte nur im Glow des STEUER-Chips, mittlere Differenz < 1 (`shots-off-next.jpg`, f1020/1026/1032 Δ 1,4 = Kamera-Drift). **Kein sichtbares Ereignis**; effektiv Stillstand 33,33 (STEUER leuchtet) → 35,01 (Schnitt Als) = 1,68 s > 1,5 s | **nicht erfüllt** → Ticket 04 |
| R1-02 37,6 s | GEWERBE pulst / popLo | next-3 kippt sichtbar (f1110→f1128 Δ 10,7) | ✓ (als STEUER-Chip, nicht Board) |
| R1-03 B12 ohne Gegenwert | nur „im Lauf: Versandseite“ | f780/f820 kein „€-Preis: kein Beleg“ | ✓ |
| R1-04 B09 Claude@15.0 | | Claude-Fenster ab f450-Bereich, Still f600 ok | ✓ (Timing aus Stills nicht exakt messbar) |
| R2-01 7,98 / 8,38 | Logo-Glanz, Silhouetten | f239 Glanzstern auf dem Shirt-Logo, f251 fünf Figuren unter der Karte | ✓ |
| R2-01 12,17 | Preisschild wackelt | f355→f365→f372 EINKAUF-FEHLT-Schild kippt (`ereignis-1217.png`) | ✓ |

## Textregeln
| Punkt | Befund | Urteil |
|---|---|---|
| ≤ 1 neuer Textblock | **Einkaufspreis@32 (≈ 32,3 s): „EINKAUF ?“ und „STEUER ?“ kommen im selben Frame** (off-4 → off-5, `shots-off2-5.jpg`), zwei Blöcke gleichzeitig | Verstoß → Ticket 04 |
| Karten ≤ 4 W. | SHIRTS MIT LOGO, EINKAUF FEHLT, HEUTE: VERSANDZEILE, KEIN BELEG, NUR DOLLAR, UMRECHNEN = GERATEN, VERKAUF: 109 € / 5, PRÜF-PROMPT | ✓ |
| ≥ 58 px | Karten 72–80 px, Claude-Satz ≈ 70 px ✓. **Warum-Akt (f736–f820): Zitatkarte „Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“ nur ≈ 40 px**, Beträge ≈ 40 px (`claude-warum.jpg`) | Verstoß (Wiederholung, aber aussagend) → Ticket 05 |
| ≤ 12 neue Wörter / Frame | Frame 0 12, Claude-Satz 11, sonst ≤ 4 | ✓ |

## CTA-Board (Stand nach der Folge)
Inhaltlich richtig (8 BRIEF + ADRESSEN „?“, DRUCK Badge „5ER OFFEN“, GEWERBE Badge „UST ?“, 1/3/4/7 ✓). Aber entgegen Bericht („Badges über Zellnummer, Feldtitel frei“): **„5ER OFFEN“ verdeckt die obere Hälfte von „DRUCK“ und schneidet „GRÜNDUNGSPLAN“; „UST ?“ verdeckt die Oberkante von „GEWERBE“ und die Unterzeile „+ NAME“ von Feld 3** (f1160–f1215, `kontakt-cta.jpg`, f-1180/f-1195). Zusätzlich schneidet das Kommentarfeld die Oberkante von „GRÜNDUNGSPLAN“. → Ticket 06.
Prompt-Snip f1230–f1250 = graue Platzhalterbalken (bewusst, wie F17) – Hinweis H1.

## Look vs. Folge 17
Gleiche Bühne, Licht, Kartenfamilie, Board, Endkarte; Claude-Satz groß und ruhig, Ergebnis-Akt mit 5 Brief-Thumbnails gut. Abzüge: Maskottchen-Gesicht in Recap/Claude/Warum weiter überstrahlt (F16-R2-03), Warum-Panel f736 zu 2/3 leer bis „NUR DOLLAR“ kommt, Als-Akt: kleines STEUER-?-Panel oben + große Frage-Karte doppeln sich, Panel-Ecke läuft unter das HUD-Mini-Board (`f1100-hud.png`, HUD selbst frei).

## Noten
| Kriterium | Note | Beleg / Abzug |
|---|---|---|
| Frame 0 / Hook 0–6 s | 7 | Frage + Ergebnis ✓, Ereignis pro 0,5 s ✓; Artefakte unter den Beträgen, Maskottchen-Einflug hinter Panel |
| Maskottchen | **K.-o.** | f6–f10 hinter Frage/Panel, f27–f33 Pill über den Augen |
| Text-Regeln / Lesbarkeit | 7 | zwei Chips gleichzeitig, Warum-Zitat ≈ 40 px |
| Regie-Tickets umgesetzt | 7 | 34,2-s-Ereignis unsichtbar (Lücke 1,68 s); Rest ✓ |
| Fakten / Zahlen / Faktenschutz | 9 | sauber; H3 |
| Anonymisierung | 9 | sauber |
| CTA + Board-Stand | 7 | Inhalt ✓, Badges verdecken Feldtitel |
| Look vs. Folge 17 | 8 | gleichwertig, Abzüge oben |
| Bewegung / Schnitte (aus Stills) | 8 | Panel-Wechsel hart, keine Mischframes in den 4-fps-Stills; voller Check erst final |

## Gesamtnote
**7,0 / 10** (Schnitt ≈ 7,8, gedeckelt wegen K.-o.)

## Urteil
**Nicht bestanden.** Zwei Maskottchen-K.-o.-Stellen im Hook, dazu blockierend 03–06.

## Tickets
```
TICKET design-R1-01 → firma-design
Kriterium: Maskottchen (K.-o.) · Note: K.-o.
Beleg: 00:00,20–00:00,35 · pruefung/design-r1/frames/f-0006.png, f-0010.png; style-frames/sf-0008-f8.png
Problem: Das Maskottchen fällt von oben durch Frage und Lampe und hinter das Brief-Panel; Augen verdeckt bzw. > 2/3 verdeckt.
Soll: In keinem Frame 0–1,2 s liegt das Maskottchen hinter Frage, Lampe oder Panel; Auftritt nur im Bodenbereich unter dem Panel (Pop/Steigen von unten wie F17), ≤ 1/3 verdeckt, Augen frei – geprüft mit 30-fps-Streifen 0–0,6 s.
```
```
TICKET design-R1-02 → firma-design
Kriterium: Maskottchen (K.-o.) · Note: K.-o.
Beleg: 00:00,90–00:01,10 · style-frames/sf-0029-h1.png, sf-0030-f30.png; frames/f-0028/31/32.png
Problem: Untertitel-Pill „Unternehmen“ liegt (halbtransparent einblendend) quer über beiden Augen.
Soll: Hook-Pills liegen in jedem Frame oberhalb der Kopfoberkante (oder das Maskottchen ist ganz weg, bevor „Unternehmen“ einblendet); 30-fps-Streifen 0,8–1,2 s ohne Überdeckung der Augen.
```
```
TICKET design-R1-03 → firma-design
Kriterium: Frame 0 / Artefakte · Note: 7/10
Beleg: 00:00,00 · pruefung/design-r1/f0-zoom-zeilen.png (y ≈ 1140 und ≈ 1245); gleiche Karte f700, f736–f820
Problem: Unter den gestrichenen Beträgen und zwischen den Zeilen stehen graue Unterlängen-/Komma-Reste der weichgezeichneten Briefzeilen.
Soll: Karte zwischen und um die drei Zeilen herum einfarbig (Kartenfarbe), keine Fragmente; Zoom 3× auf Frame 0, f700, f780 zeigt nur Beträge, Strich, neue Zeile, grüne Linie.
```
```
TICKET design-R1-04 → firma-design
Kriterium: Regie-Ticket R1-02 + Textregel · Note: 7/10
Beleg: 00:32,3 (shots/off-5.png: EINKAUF ? + STEUER ? gleichzeitig) · 00:34,2 (off-6 vs off-7 max. Δ 24 Tonwerte, f1020/1026/1032)
Problem: Beide Chips kommen im selben Frame; das 34,2-s-Ereignis ist unsichtbar, daher 1,68 s ohne Ereignis (33,33 → 35,01).
Soll: „EINKAUF ?“ auf Einkaufspreis@32, „STEUER ?“ erst auf Umsatzsteuer-Status (33,33); auf Status+0,85 (≈ 34,2 s) ein klar sichtbares Ereignis am STEUER-Chip (Pop ≥ 8 % Scale oder Kippen wie next-3, mit tick); Lücke zwischen 33,33 und 35,01 ≤ 1,5 s, mit Frames 1000/1026/1040 belegt.
```
```
TICKET design-R1-05 → firma-design
Kriterium: Lesbarkeit · Note: 7/10
Beleg: 00:24,5–00:27,5 · style-frames/sf-0736-why-a2.png, sf-0780, sf-0820; pruefung/design-r1/claude-warum.jpg
Problem: Zitatkarte im Warum-Akt („Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“ + Beträge) nur ≈ 40 px, Panel darunter zu 2/3 leer.
Soll: Zitatkarte ≥ 58 px Schrift (Karte breiter/Kamera näher) oder durch eine ≤ 4-Wort-Karte ersetzt (z. B. „ALTE ZEILE“ mit gestrichenen Beträgen ≥ 58 px); Panel bei f736 ohne große Leerfläche.
```
```
TICKET design-R1-06 → firma-design
Kriterium: CTA-Board · Note: 7/10
Beleg: 00:38,7–00:40,5 · style-frames/sf-1160 … sf-1215; frames/f-1180.png, f-1195.png
Problem: Badge „5ER OFFEN“ verdeckt „DRUCK“ und schneidet „GRÜNDUNGSPLAN“, „UST ?“ verdeckt die Oberkante von „GEWERBE“ und „+ NAME“ von Feld 3; Kommentarfeld schneidet die Board-Überschrift.
Soll: Alle neun Feldtitel und „GRÜNDUNGSPLAN“ vollständig lesbar; Badges sitzen auf der Zellnummer/Ecke der eigenen Zelle, ohne Nachbarzelle oder Titel zu berühren; Kommentarfeld endet über der Board-Oberkante.
```

## Hinweise (nicht blockierend)
- H1 CTA-Prompt-Snip f1230–f1250 = Platzhalterbalken; Bewertung „kein Platzhalter“ – besser ein echter, weich gestellter Prompt-Crop.
- H2 Maskottchen-Gesicht in Recap/Claude/Warum überstrahlt (wie F16/F17).
- H3 Brief-Fließtext im Brief-Akt (f320–f372) ist bei 1080 px scharf, nicht „weich/gedimmt“ wie im Bericht; enthält „29,90 Euro“ (Nachbestellung, nicht im Skript). Am Handy ≈ 16 px, nicht lesbar, daher kein K.-o.; trotzdem weicher stellen.
- H4 Als-Akt: STEUER-?-Panel oben doppelt die Frage; Panel-Ecke tangiert das HUD-Mini-Board.
- H5 Stills-Bericht hakt Punkte ab, die nicht stimmen (Badges/Feldtitel, Brief weich, Maskottchen frei) – vor der nächsten Runde Haken nur mit Frame-Beleg.
