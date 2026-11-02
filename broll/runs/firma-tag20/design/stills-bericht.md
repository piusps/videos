# Folge 20 · Stills-Bericht (firma-design, Stufe 1)

Stand 2026-11-01 nachmittags. Quelle: `runs/firma-tag20/beats.json` + `regieplan.md` (Regie R2 9,0). Kein Voll-Render.

## Dateien
- Generatoren: `runs/firma-tag20/design/gen/gen.py` (63 Shots) und `ep.py` (episode.json). Vorlage: Folge 19, die auf Folge 17 aufbaut.
- Episode: `public/firma-ep/tag20/episode.json` + `shots/`. beats.json, musik.txt und regieplan.md dort sind ersetzt durch die geprüfte Fassung aus runs/firma-tag20. voice.mp3 und words.json waren schon identisch.
- Style-Frames: `runs/firma-ep/tag20/style-frames/` (78 Bilder), Übersicht `runs/firma-ep/tag20/style-frames.jpg`.
- Vergleich Seite an Seite (Zeile 1 = F17, Zeile 2 = F19, Zeile 3 = F20; Spalten Frame 0 / Hook-Ende / Rückblick / Claude-Start / Briefe / Warum / Als Nächstes / CTA): `runs/firma-ep/tag20/vergleich-f17-f19-f20.jpg`.
- Engine: **keine Änderung**. Genutzt sind nur die vorhandenen optionalen Felder proof.x, proof.bare, end.planeTo und end.sentIcon.

## Still-Zeiten
- 0–6 s alle 7,5 Frames (4 fps), dazu Frame 27.
- 7,5 · 9,6 · 11,0 · 11,9 · 12,6 · 13,6 · 14,5 · 15,6 · 15,97 · 16,1 · 16,9 · 17,6 · 18,3 · 19,1 · 19,8 · 20,4 · 21,3 · 22,2 · 23,2 · 24,0 · 24,9 · 25,6 · 26,3 · 27,9 · 28,7 · 29,5 · 30,0 · 31,0 · 31,6 · 32,6 · 33,2 · 33,7 · 34,3 · 34,8 · 36,0 · 36,7 · 38,0 · 39,0 · 40,3 · 41,0 · 42,0 · 43,0 · 44,4 s.
- Dazu je Shot und Akt ein Auto-Frame.

## Selbstcheck K.-o.-Liste
| Punkt | Ergebnis |
|---|---|
| Frame 0 | Ganze Frage und STEUER-TAFEL stehen ab Frame 0. Inhalt: „Betrieb zahlt effektiv / mit Vorsteuerabzug“, MIT USt 91,60 € (oranger Rahmen + Haken), OHNE USt 109 €. |
| 0–6 s Ereignis je 0,5 s | Stufen bei 0,40 / 0,74 / 0,87 (Kameraschnitt) / 1,09 / 1,5 / 1,9 / 2,40 / 2,83 / 3,15 / 3,38 + 3,66 (Stempel GANZ ALLEINE.) / 3,99 / 4,53 / 4,85 (Board) / 5,12 / 5,41 / 5,58 / 6,05 s. Größte Lücke 0,47 s (3,99 → 4,53). |
| Maskottchen im Hook (4 fps geprüft) | 0–0,87 s ganz sichtbar, Augen frei; die Pills „Wie viel Umsatz“ und „macht ein“ liegen über dem Kopf, nicht auf den Augen. Fix: der Kameraschnitt kommt 0,2 s früher (hook.at.ein = „Unternehmen-0.2“). Vorher legte sich die zweite Untertitelzeile „Unternehmen“ bei 0,97–1,0 s halbtransparent auf die Stirn. Von 0,9 bis 4,85 s ist das Maskottchen ganz aus dem Bild (wie im Folge-19-Final), nie halb. Ab 4,85 s steht es ganz im Bild; „Ich probier das aus“ steht über dem Kopf. |
| Maskottchen sonst | Überall ganz sichtbar, Augen frei. Fix: die Bauchbinde KEINE STEUERBERATUNG lag auf y 1200 über den Augen und steht jetzt auf y 240, 0,4 s nach dem Ende der WARUM?-Pill. |
| Textgröße ≥ 58 px | Karten 64–86 px. Screenshot-Text gemessen: Versalhöhe 16 px Quelle ≈ 22-px-Schrift; mit Zoom × Overlay-Skala ergibt das: Anhang-Zeile 64, Websuche/Quellen 78, Entscheidungssatz 69, 91,60 € / 109 € 63, „19 % teurer.“ 72, „mindestens / fünf Jahre“ 63 px (vorher 50 px, jetzt zweizeilig). „Erfinde nichts.“ 71 px. „gesendet“ nur als Haken-Icon. Die Shot-08-Zeile „mit Vorsteuerabzug“ ist bewusst weich. |
| Ein Textblock, Karten ≤ 4 Wörter, ≥ 1,2 s, ≤ 12 neue Wörter | Erfüllt. Größte Menge im Bild: B12 mit 8 neuen Wörtern + Bauchbinde 2. Karten 17,40 € (27,63 s), +19 % (30,61 s), 5 JAHRE (32,96 s) liegen ≥ 1,2 s auseinander. |
| Panelwechsel = Schnitt, keine Mischframes | Panelwechsel immer hart auf einem Frame. Akt-Übergänge enden hart vor dem nächsten Akt: Hook bis Ich-0,10, Rückblick bis Briefe-0,07, Heute bis Claude+0,03, Claude ab Claude+0,11, Entscheidung → Tafel bis Umsatzsteuer-0,04, Warum bis Als-0,19, Als Nächstes bis Kommentiere-0,19. |
| CTA | Board zeigt den Stand nach der Folge: Badges „5ER OFFEN“ (DRUCK + PREIS) und „MIT UST“ (GEWERBE), kein Haken, kein Umsatz-Zähler. Danach Panel PROMPT + „Erfinde nichts.“, dann „10 MIN: BEIDE WEGE“. Panel ist voll. |
| Fakten | Shot 01: „24 Zeilen“ abgedeckt. Shot 07: „3 Seiten gelesen“ unlesbar weich. Shot 08: nur 91,60 € / 109 € scharf, „bzw.“-Werte abgedeckt ab x 330. Shot 10: nur „19 % teurer.“. Shot 04: nur „mindestens fünf Jahre“. Shot 03/06/09 nie. Keine Sidebar, Namen, Orte oder Mails. KEINE STEUERBERATUNG: Marker in Shot 01 (16,7–18,0 s) + Bauchbinde 29,33–33,86 s. |
| B09 offset | Der Beat beginnt bei 15,95 s (Claude+0,15); das Overlay fliegt ab Claude+0,11 ein. |

## Vergleich F17 / F19
Gleiche Bildsprache:
- Board, Rückblick-Karte und Briefe-Vollbild mit Maskottchen klein unten rechts.
- WARUM?-Pill über dem Panel, Frage-Karte „Als Nächstes“ mit Objekt darüber.
- CTA mit gleicher Struktur.

Neu in F20: Story-Objekt STEUER-TAFEL statt Briefzeile. Frame 0 ist klarer als F19 (zwei Zahlen statt durchgestrichener Beträge).

## Offene Punkte
1. Rückblick-Board ohne Badges „UST ?“ / „5ER OFFEN“ (Regieplan wünscht sie, F19 hatte sie im Rückblick auch nicht). Das ist die einzige Abweichung vom Regieplan.
2. Plan-Labels wie F17/F19 („GEWERBE MENSCH“, „BRIEF + ADRESSEN“) statt „OFFEN“/„WERBEBRIEF“, für die Serien-Konsistenz.
3. „3 Seiten gelesen“ aus Shot 07 ist unlesbar, weil 3 keine Freigabe-Zahl ist.
4. Warum-Akt zum Start (23,7–24,6 s) recht leer: kompakte Tafel, Betriebs-Kachel ab 24,6 s.
5. Hook ab 0,9 s ohne Maskottchen (Engine-Kamera, wie F19).

## Runde 2: Umsetzung der Design-Tickets R1 (Stills neu, 100 Bilder)
- **R1-01 HUD:** Heute-Karten tiefer (gen.py heute: y 282, Höhe 760). Gemessen mit Hilfslinien: HUD-Unterkante (Plan-HUD) ≈ y 200, Kartenoberkante ≥ 243 (auch die angehobene „heiße“ Karte, 13,6 / 14,5 s), ruhend ≈ 272. Kein Frame mit Überlappung 13,0–15,9 s. Titel 86 px × 1,08. Maskottchen ganz sichtbar. Der Claude-Rahmen ab 15,97 s beginnt bei ≈ 227.
- **R1-02 Warum-Anfang:** 91,60 € / 109 € (92 px × 0,96 ≈ 88 px) und Betriebs-Kachel stehen ab dem ersten Warum-Frame (23,70 s), keine grauen Platzhalter-Balken mehr. Auf „Betriebe“ (24,6 s) leuchtet die Kachel. Die Fläche rechts neben der Kachel bleibt bis „Vorsteuerabzug“ (25,2 s) frei; dort kommt der Beleg.
- **R1-03 Frame-0-Kopf:** „Mit Vorsteuerabzug zahlt:“ (3 Wörter, eine Zeile, 64 px × 0,94 = 60 px, Versalhöhe ≈ 44 px). Frage, Beträge, Spalten und Maskottchen in Frame 0 sind unverändert.
- **H1:** Neues Ereignis bei 4,37 s: das Wertfeld 91,60 € kippt auf Orange, die Shirts hüpfen. Die Lücke lag vorher bei ~0,7 s; ein zu kurzes Overlay-Fenster blendete hook-9 nie ein. Jetzt sind die Lücken 3,99 → 4,37 → 4,85 s. Die Korrektur gilt auch für den Puls bei 1,09 s: fitfont klemmte die Größe, deshalb jetzt Farbwechsel. Weitere Fenster unter 0,36 s, die nie sichtbar wurden, sind bereinigt: heute-3, ent-0 und hak-3, next-3 enden jetzt hart, statt Bilder anzuhängen, die nie zu sehen waren.
- **H2:** Rückblick-Board mit Plaketten „5ER OFFEN“ (ab 6,5 s) und „UST ?“ (ab 8,0 s, auf „Logo“). Beide sitzen rechts in der Nummernzeile; Feldnummer und Text bleiben frei. Ohne Engine-Änderung (partners/proof.bare).
- **H3:** „19 % teurer.“ ohne doppelte Leerstelle.
- **H4:** CTA-„5ER OFFEN“ rechts in der Nummernzeile von Feld 2 (x 572). Die Nummer „2“ ist frei, der Haken ist bedeckt. Alle Plaketten jetzt in DIN Condensed 60 px wie F19.
- Engine weiterhin unverändert.
