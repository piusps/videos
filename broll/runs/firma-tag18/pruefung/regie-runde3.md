# Prüfung Regie · Folge 18 · Runde 3 (letzte) · 2026-11-01
Prüfer: frischer Agent (firma-pruefer, Stufe regie, Runde 3). Geprüft: beats.json (12:23) per diff gegen regie/beats.r2.json, regieplan.md (ganzer Text), words.json. Alle Ereignis-Anker (Karten, SFX, events, Beat-Starts) per eigenem Skript (/tmp/pr18r3/res.py, Wort[@after][:end][±x] → erstes passendes Wort mit s ≥ after) gegen words.json aufgelöst. Render runs/firma-tag18/firma-tag18-final.mp4 (12:29, 44,50 s, 1080×1920, 30 fps) mit node_modules/ffmpeg-static: Frames 0,05 / 2,20 / 4,05 / 4,40 / 8,75 / 9,10 / 10,95 / 11,30 / 22,90 / 27,65 / 28,00 / 29,35 / 29,75 / 31,50 / 36,20 / 36,60 s (/tmp/pr18r3/s1.jpg, s2.jpg, s3.jpg), REST-Zeile 3,90–4,50 s (rr.jpg) + YAVG-Verlauf der REST-Zeile 3,7–4,7 s. Stimme/words.json/Musik: Dateien unverändert (voice.mp3, words.json 31.10. 16:34), seconds 44,51 → keine Regression. Gemini nicht genutzt. Nichts geändert außer diesem Bericht.

## Ticket-Abgleich Runde 2
| Ticket | Status | Beleg |
|---|---|---|
| R2-01 Faktenschutz B13 | **im Beat erfüllt, Soll nicht ganz** | B13 bild/beleg ✓ (beats.json Z. 979, 1014: nur „17 €“, Screenshot nicht im Bild). Render 31,50 s: „AB 17 € NICHTS“, kein 17,15 ✓. ABER Soll war „grep 17,15 trifft nie eine Bild-Anweisung“: der Shot-Katalog `shots["06 (nur Schlusszeile)"]` (beats.json Z. 211–223) schreibt weiter vor: „NUR die Zeile … 17,15 € netto … (Marker auf '17,15 € netto … auf null')“ inkl. Crop. Kein Beat referenziert den Eintrag mehr, aber er ist eine baubare Bild-Anweisung. Dazu regieplan.md Z. 24: „Shot 06 nur Schlusszeile“ (= erlaubt lesbar). |
| R2-02 Lücke 8,06→9,67 + Grenzfall 36,35 | **erfüllt** | B05 events/sfx „Logo“ = 8,91 s, B14 sfx „Versandzeile:end“ = 36,35 s. Render: Maskottchen-Pose 8,75 ≠ 9,10 s, 36,20 ≠ 36,60 s ✓ |
| R2-03 Konsistenz | **teilweise** | ✓ story_objekt [0] Rechen-Karte, [5] „im Paper-Fenster“; B02/B04 bild auf Rechen-Karte; Akt 1 + Beat-Tabelle B03/B08/B10 neu. ✗ **B01 kamera** „langsamer Push-in auf die **Lauf-Zeile**“ (beats.json Z. 269 + regieplan Z. 64) – im Ticket ausdrücklich genannt. ✗ **regieplan Z. 57 Akt 5 „Shot 02 (+09-Kopf)“** – im Ticket ausdrücklich genannt. ✗ Korrekturnotiz regieplan Z. 102 behauptet „kein Shirt + Lauf-Zeile, kein SHOT09“ → sachlich falsch. ✗ B03 bild weiter „(kein neuer Text) (kein neuer Text)“. |

## Ereignis-Raster (aufgelöst aus beats.json)
- 0–6 s: alle 12 Fenster belegt: 0,00·0,03·0,17·0,40·0,43 | 0,74 | 1,09 | 1,58 | 2,00·2,40 | 2,83 | 3,15·3,32·3,38 | 3,66·3,99 | **4,23** | 4,90·4,95 | 5,12 | 5,58 ✓
- 7,12–43,19: größte Lücke **1,39 s** (42,82→44,21); weitere > 1,2 s: 14,06→15,29 (1,23), 18,52→19,81 (1,29), 20,16→21,43 (1,27), 29,48→30,70 (1,22), 31,65→32,91 (1,26), 40,03→41,39 (1,36), 41,59→42,82 (1,23). **Keine Strecke > 1,5 s** ✓ (B05 jetzt 8,05 → 8,91 → 9,67).

## Render-Abgleich neue Ereignisse
| Zeit | Plan | Render | ok |
|---|---|---|---|
| 4,23 | REST-Zeile leuchtet auf (führt?:end−0,1) | REST-Zeile ist schon ab ~2,2 s hinterlegt; im Bereich der Zeile springt die Helligkeit sprunghaft bei 4,20 s (YAVG 191,8 → 186,3), sonst konstant → ein diskretes Ereignis ist da, aber visuell schwach (kein deutliches „Aufleuchten“) | ja (knapp) |
| 8,91 Logo | Maskottchen hüpft + tick | Pose 8,75 vs 9,10 verschieden, Karte unverändert | ja |
| 11,06 Bestellung | Hüpfer + tick | Pose 10,95 vs 11,30 verschieden | ja |
| 27,80 Dort | Wechsel auf Fünferpack (Ereignis) + Hüpfer | Hüpfer ✓; Panel 27,65 vs 28,00 praktisch gleich (kein sichtbarer „Wechsel“) | Hüpfer ja, Wechsel nein (Design-Abweichung, Lücke trotzdem gedeckt) |
| 29,49 pro | Hüpfer | Pose 29,35 vs 29,75 verschieden | ja |
| 36,35 Versandzeile:end | Hüpfer | Pose 36,20 vs 36,60 verschieden | ja |

Weitere Render-Beobachtungen (an Design/Final, nicht Regie): Frage-Karte in B14 lautet „Stimmt die Versandzeile?“ statt Plan „VERSANDZEILE?“ (≤ 4 Wörter, ok, aber Plan ≠ Bild). Maskottchen bei 22,90 s und 36,20–36,60 s unten rechts am Bildrand angeschnitten (bei 36,2 ca. unteres Viertel) → in der finalen Prüfung auf > 1/3 messen. Frame 0 (0,05 s): Rechen-Karte, nur „17 €“ ✓; nirgends in den 16 Frames 17,15 oder 5,75 ✓.

## Noten
| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | STT = Skript | 10 | unverändert (R1) |
| 2 | Länge/Tempo/Rückblick/Heute | 9 | 44,51 s, 134,8 wpm, 6,48 s, Heute 14,01 – unverändert |
| 3 | Warum-Beat mit Grund-Karten | 9 | B12/B13, Render 28,00/31,50 |
| 4 | Roter Faden / Ortswechsel | 8 | Akte stimmen in beats.json; regieplan Akt 5 nennt noch „+09-Kopf“ |
| 5 | Storyline / Bibel | 9 | unverändert |
| 6 | Hook-Takt + kein Beat > 1,5 s | 9 | 0–6 s lückenlos, max. Lücke 1,39 s; 4,23 im Render schwach |
| 7 | Frame 1 | 8 | Frage + Rechen-Karte „REST 0 €“, nur „17 €“ (0,05 s) |
| 8 | Echte Claude-UI | 9 | SHOT01/07/02 im Paper-Fenster, Render 22,90 |
| 9 | Textregeln | 8 | Karten ≤ 4 Wörter, Abstände ≥ 1,2 s |
| 10 | Ton-Plan | 9 | unverändert; neue ticks leise (0,12) |
| 11 | beats.json/regieplan konsistent, Anker | **7** | Anker ✓; B01 kamera „Lauf-Zeile“ (beats Z. 269, regieplan Z. 64), Akt 5 „+09-Kopf“ (Z. 57), Korrekturnotiz Z. 102 falsch, B03 Doppeltext |
| 12 | Betonungsrisiken | 8 | unverändert |
| 13 | Faktenschutz | **7** | Beats + Render sauber; aber Shot-Katalog „06 (nur Schlusszeile)“ (beats.json Z. 211–223) + regieplan Z. 24 erlauben/fordern weiter die lesbare 17,15-Zeile mit Marker |

Durchschnitt 8,5 · niedrigste 7.

## K.-o.-Liste
Keine. (Der verbliebene 17,15-Eintrag ist ein unreferenzierter Katalogeintrag, kein Beat schreibt ihn vor, Render sauber → kein K.-o., aber Note 7.)

## Gesamturteil
**Nicht bestanden** (Kriterien 11 und 13 = 7). Runde 3 von 3 ausgeschöpft → laut Skill ehrlicher Bericht an Pius statt weiterer Runde. Inhaltlich ist die Folge fertig: Takt, Fakten im Bild und Render stimmen; offen sind nur Text-Reste in beats.json/regieplan.md (≈ 5 min, kein Neu-Render nötig, Stimme/Musik unberührt).

## Tickets (Rest, reine Textpflege)
```
TICKET regie-R3-01 → firma-regie
Kriterium: Faktenschutz · Note: 7/10
Beleg: beats.json Z. 211–223 shots["06 (nur Schlusszeile)"].hinweis/crop; regieplan.md Z. 24 „Shot 06 nur Schlusszeile“
Problem: Katalog und Regieplan erlauben/fordern weiter die lesbare Zeile „17,15 € netto … auf null“ mit Marker.
Soll: Shot 06 im Katalog als „nur Faktenbeleg, nie im Bild“ (ohne crop/Marker-Anweisung); regieplan Z. 24 „Shot 06 nie im Bild“; grep „17,15“ trifft nur Verbote/Quellenhinweise.
```
```
TICKET regie-R3-02 → firma-regie
Kriterium: beats.json/regieplan konsistent · Note: 7/10
Beleg: beats.json Z. 269 + regieplan Z. 64 (B01 kamera „Lauf-Zeile“); regieplan Z. 57 (Akt 5 „+09-Kopf“); regieplan Z. 102; B03 bild Doppeltext
Problem: R2-03 nur teilweise umgesetzt, Korrekturnotiz behauptet Vollständigkeit.
Soll: B01 kamera „Push-in auf die Rechen-Karte“; Akt 5 „Shot 02, Stempel PREIS FEHLT“; Doppeltext weg; grep „Lauf-Zeile|09-Kopf|SHOT09“ in beats.json/regieplan.md trifft nur Quellenhinweise/Korrekturhistorie.
```
Hinweise an firma-design (keine Regie-Tickets): 27,80 „Wechsel auf Fünferpack“ nicht sichtbar (nur Hüpfer); 4,23 REST-Aufleuchten schwach; B14-Karte „Stimmt die Versandzeile?“ ≠ Plan „VERSANDZEILE?“; Maskottchen-Anschnitt 22,9 / 36,2–36,6 s in der finalen Prüfung messen.
