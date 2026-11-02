# Prüfung Regie · Folge 18 · Runde 2 · 2026-11-01
Prüfer: frischer Agent (firma-pruefer, Stufe regie, Runde 2). Geprüft: beats.json (12:18) gegen regie/beats.r1.json (diff), regieplan.md (ganzer Text inkl. Abschnitt „Korrektur nach Prüfung Regie Runde 1“), words.json. Ereigniszeiten per Skript aus Ankern (Wort[@after][:end][±x]) gegen words.json aufgelöst. Zur Bestätigung 12 Frames aus runs/firma-ep/tag18/render/tag5-folge18.mp4 (12:17, also 1 min ÄLTER als beats.json) bei 0,05 / 2,2 / 4,3 / 8,3 / 9,0 / 9,4 / 21,0 / 22,9 / 31,2 / 32,0 / 33,5 / 36,8 s (/tmp/pr18r2/sheet.jpg, sheet2.jpg). Stimme/words.json/Musik unverändert → nicht neu gemessen; keine Regression (seconds 44,51, audio-Block identisch). Gemini nicht genutzt. Nichts geändert außer diesem Bericht.

## Ticket-Abgleich Runde 1
| Ticket | Status | Beleg |
|---|---|---|
| R1-01 Fenster 4,0–4,5 | **erfüllt** | B03 `führt?:end-0.1` = 4,33−0,1 = **4,23 s** (tick + REST-Zeile); Render 4,3 s: REST-Zeile hell |
| R1-02 vier Lücken | **erfüllt** (alle vier) | Bestellung 11,06 · Einkaufspreis:end+0,25 = 22,78 · Dort 27,80 · pro@29.4 = 29,49; neue Abstände 10,33→11,06→11,97, 21,76→22,78→23,29, 26,69→27,80→28,46, 29,11→29,49→30,70 alle ≤ 1,21 s |
| R1-03 Frame 0 / 17,15 | **teilweise** | B01 jetzt Rechen-Karte, nur „17 €“ ✓ (Render 0,05 s bestätigt). ABER B13 `beleg` (beats.json Z. ~1013) und B13 `bild` (Z. 968) planen weiter die lesbare SHOT06-Zeile „… bei 17,15 € netto … auf null“ mit Marker. Soll war „17,15 nirgends lesbar“. Render 31,2/32,0/33,5 s zeigt die Zeile nicht → Plan und Render widersprechen sich |
| R1-04 Textblöcke | **erfüllt** | B10 shot2 (SHOT09) gelöscht; B08 Abzugszeilen auf Marge+0,25 = 15,29 s, 1,28 s nach Pill 14,01, 3 Wörter |
| R1-05 Ortswechsel B10 | **in B10 erfüllt, Restwiderspruch** | B10 bild: Stempel im Fenster ✓, Render 22,9 s ✓. story_objekt.plaetze `["Einkaufspreis@21.6","Stempel PREIS FEHLT aufs Schild"]` steht unverändert |
| R1-06 Anker | **erfüllt** | B01 w „Wie“, B09 w „Claude“ after 15,8 (→ 16,08), B08 „Marge@14.9“ (→ 15,04, nicht 38,36) |

## 0–6-s-Raster (aufgelöst)
0,00 · 0,03 · 0,18 · 0,40 · 0,44 | 0,74 | 1,09 | 1,58 | 2,00 · 2,40 | 2,83 | 3,15 · 3,32 · 3,38 | 3,66 · 3,99 | **4,23** | 4,90 · 4,95 | 5,12 | 5,58 | (6,11 · 6,42).
Alle 12 Fenster [0;0,5) … [5,5;6) haben ≥ 1 Ereignis-Start ✓.

## Lücken > 1,5 s zwischen 7,12 und 43,19 (Karten/SFX/Events, aufgelöst)
- **8,06 → 9,67 = 1,61 s** (B05): Karte „SHIRTS MIT LOGO“ + popHi auf „verkauft“ 8,05; nächstes Ereignis tick/Silhouetten auf `Betriebe@9.5` = „Betriebe,“ **9,67** (nicht 9,5). Render 8,3 und 9,4 s: Bild identisch bis auf Untertitel. In Runde 1 übersehen, besteht seit R1.
- Grenzfall 35,66 → 37,16 = 1,50 s (B14→B15): nur SFX-pop `Kommentiere-0.15`; erste sichtbare Änderung ist der Beat-Wechsel 37,31 (1,65 s). Rein rechnerisch nicht > 1,5, sichtbar schon.
- Alle anderen Abstände ≤ 1,36 s.

## Neue Widersprüche / Regressionen
1. **B13 plant 17,15 lesbar** (s. R1-03) – Faktenregel „nur 17 €, nie 17,15“ im Plan verletzt.
2. **Veraltete Hook-Beschreibungen nach Umbau B01** (Shirt + Lauf-Zeile → Rechen-Karte): B01 `kamera` „Push-in auf die Lauf-Zeile“; B02 `bild` „Marker pulst, Preisschild schwingt, Stick-Logo glitzert, Licht-Sweep über die Lauf-Zeile, Shirts fächern als Fünferpack“; B04 `bild` „Shirt + Lauf-Zeile fliegen raus“; story_objekt `["0","hook: Shirt mit leerem Preisschild + Lauf-Zeile 17,15 €"]`. Im Render (2,2 s) gibt es weder Shirt-Objekt noch Lauf-Zeile – Design hat improvisiert; die B02-Ereignisse sind im Plan nicht mehr baubar beschrieben.
3. **regieplan.md Haupttabellen nicht nachgezogen**: Akt 1 „Shirt + Lauf-Zeile „17,15 € … auf null““ (Z. 53), Akt 5 „Shot 02 (+09-Kopf)“ (Z. 57), Beat-Tabelle B01 (17,15-Lauf-Zeile), B03 („in der Pause danach (4,6)“), B08 („Auf 'Marge' Rechen-Bild“), B10 („kurz SHOT09-Kopf“). Nur der Anhang am Ende stimmt. Der Regieplan widerspricht damit sich selbst und beats.json.
4. B03 bild doppelt „(kein neuer Text) (kein neuer Text)“ – kosmetisch.
5. Frame 0: Rechen-Karte = 4 Zeilen-Labels + 2 Beträge + Fußzeile „Claudes Rechnung, netto“ neben der 9-Wort-Frage. Weicht vom R1-03-Soll („höchstens ≤ 4 Wörter Marker-Ausschnitt“) ab, ist aber eine Grafik, kein Lesetext, und im Render gut lesbar → akzeptiert, kein Ticket.
6. Keine Regression bei Fakten sonst: 5,75 nirgends geplant ✓, Karten alle ≤ 4 Wörter (+ Unterzeile) ✓, Kartenabstände ≥ 1,2 s (kleinster 41,39−40,03 = 1,36) ✓.

Hinweis an Design (nicht Regie): Render 22,9 s und 36,8 s – Maskottchen unten rechts am Bildrand angeschnitten; in der finalen Prüfung gezielt auf > 1/3 prüfen.

## Noten
| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | STT = Skript | 10 | unverändert, R1 |
| 2 | Länge/Tempo/Rückblick/Heute | 9 | unverändert (44,51 s, 134,8 wpm, 6,48 s, 14,01) |
| 3 | Warum-Beat mit Grund-Karten | 9 | B12/B13 unverändert, + Ereignisse Dort/pro |
| 4 | Roter Faden / Ortswechsel | 8 | B10 an einem Ort ✓; Rest-Widerspruch story_objekt „aufs Schild“ |
| 5 | Storyline / Bibel | 9 | unverändert |
| 6 | Hook-Takt + kein Beat > 1,5 s | 7 | 0–6 s lückenlos ✓; **B05 8,06→9,67 = 1,61 s** |
| 7 | Frame 1 | 8 | Frage + Ergebnis-Karte „REST 0 €“, nur „17 €“ (Render 0,05 s) |
| 8 | Echte Claude-UI | 9 | SHOT01/07/02/08 bleiben |
| 9 | Textregeln | 8 | B08/B10 behoben; Frame-0-Karte grenzwertig dicht |
| 10 | Ton-Plan | 9 | unverändert |
| 11 | beats.json vollständig + konsistent, Anker | 6 | Anker ✓, aber story_objekt, B01 kamera, B02/B04 bild veraltet; regieplan-Tabellen widersprechen beats.json |
| 12 | Betonungsrisiken | 8 | unverändert |
| 13 | Faktenschutz | 6 | B13 beleg/bild planen „17,15 € netto“ lesbar (Render zeigt es nicht) |

Durchschnitt 8,2 · niedrigste 6.

## K.-o.-Liste
1. **Faktenschutz im Plan:** B13 schreibt die lesbare Zeile „17,15 € netto“ vor (Auftrag: nie 17,15). Render derzeit sauber, aber jeder Neu-Render nach Plan würde es zeigen.

(Das 0–6-s-K.-o. aus Runde 1 ist behoben.)

## Gesamturteil
**Nicht bestanden** (K.-o. 1; Kriterien 6, 11, 13 < 8). Alles reine Text-/Ankerpflege in beats.json + regieplan.md, keine neue Stimme/Musik nötig; der aktuelle Render erfüllt R1-03 bereits sichtbar.

## Tickets
```
TICKET regie-R2-01 → firma-regie
Kriterium: Faktenschutz · Note: 6/10
Beleg: beats.json B13 bild („Beleg SHOT06 Zeile '17,15 € netto … auf null'“) und B13 beleg.hinweis („Marker auf '17,15 € netto … auf null'“)
Problem: Der Plan verlangt in B13 weiter die lesbare Präzision 17,15 €.
Soll: B13 ohne lesbare SHOT06-Zeile (beleg nur als Quelle wie B01-shot: „Screenshot nicht im Bild“); grep „17,15“ in beats.json trifft nur noch Verbote/Quellenhinweise, nie eine Bild-Anweisung.
```
```
TICKET regie-R2-02 → firma-regie
Kriterium: kein Beat > 1,5 s ohne Änderung · Note: 7/10
Beleg: beats.json B05 sfx „Betriebe@9.5“ → words.json „Betriebe,“ 9,669; vorher popHi „verkauft“ 8,055 (Render 8,3/9,4 s gleich)
Problem: 1,61 s ohne Ereignis im Rückblick.
Soll: Ereignis auf „Logo“ (8,91) oder „kleine“ (9,38) (z. B. Logo-Stick-Glanz auf der Produkt-Karte + tick); zusätzlich Ereignis auf „Versandzeile?:end“ (≈ 36,35) gegen den 1,50/1,65-s-Grenzfall; danach keine Lücke ≥ 1,5 s zwischen 7,12 und 43,19.
```
```
TICKET regie-R2-03 → firma-regie
Kriterium: beats.json/regieplan konsistent · Note: 6/10
Beleg: beats.json story_objekt.plaetze[0] und [5], B01 kamera, B02 bild, B04 bild; regieplan.md Akte Z. 53/57 und Beat-Tabelle B01/B03/B08/B10
Problem: Nach dem Umbau Shirt+Lauf-Zeile → Rechen-Karte beschreiben Hook-Beats, Story-Objekt und Regieplan-Tabellen noch die alte Fassung (Lauf-Zeile 17,15, Stempel aufs Schild, SHOT09-Kopf, 4,6 s).
Soll: B01–B04 + story_objekt beschreiben nur die Rechen-Karte (B02-Ereignisse an deren Zeilen/Beträgen, B04 „Rechen-Karte fliegt raus“), story_objekt „Einkaufspreis@21.6: Stempel im Paper-Fenster“; regieplan Akte + Beat-Tabelle aus der aktuellen beats.json neu erzeugt, kein Satz widerspricht beats.json.
```
