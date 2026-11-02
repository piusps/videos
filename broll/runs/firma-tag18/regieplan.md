# Regieplan · Folge 18 „Was zahlt sie für das gestickte Shirt?“ (Serientag 5, **erste Folge des Tages**, Slot 2026-11-01 09:00)

firma-regie, 2026-10-31. Grundlage: script.txt nach Autor-Runde 2 (`pruefung/autor-runde1.md`, `pruefung/autor-runde2-kurz.md`, 100 Wörter). Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag18/`), `beats.json` (`regie/make_beats18.py`), `musik.txt`, Musik-Tagesplan in `tagesbriefing-2026-11-01.md`, Bibel-Zeile (`wirtschaftsbuch-v2.md`, `regie/bibel_eintrag.py`). Arbeitsdateien/Tests in `regie/`. Keine Grafik, kein Render.

## Messwerte
| Messung | Wert | Vorgabe |
|---|---|---|
| Länge | voice.mp3 **43,51 s** (letztes Wort endet 43,19, Ausklang 0,31 s) + 1,0 s Endkarte = **44,51 s** (`beats.json seconds`) | 40–48 s ✓ |
| Sprechtempo | **134,8 wpm** (100 / 44,51 s); nur voice.mp3 137,9 | 120–135 ✓ (knapp) |
| Rückblick „Die“ → Ende „extra.“ | **6,48 s** (7,12–13,60) | ≤ 6,5 s ✓, nicht beschleunigt |
| Pause „fünf.“ → „Die“ | **0,40 s** (Stille < −45 dBFS) | ≤ 0,40 ✓ |
| Pause „extra.“ → „Heute“ | **0,45 s** | ≤ 0,45 ✓ |
| „Heute“ beginnt bei | **14,01 s** | ≤ 14,5 s ✓ (Reserve-Rückblick nicht nötig) |
| Tempo TTS | 1,0 überall, kein atempo | ✓ |
| STT (scribe_v1, de) | **12/12 Läufe der Endfassung 100/100 Wörter identisch** (8 auf `regie/v-f1.mp3` + 4 auf der bytegleichen `voice.mp3`); Vorstufen aus denselben Teilen mit anderen Pausen: v-open2/4/5 je 6/6, v-open4-Fassung 12/12 – „probier“, „Tag fünf“, „Websuche“, „schick“, „Marge“ immer sauber | 0 Abweichungen ✓ |
| Musik explizit | **0** (2 Läufe auf dem Abschnitt), kein Mute | ✓ |
| Musik-Abstand | jeder Akt ≥ 18,2 dB unter der Stimme (`regie/gap-final.txt`) | ≥ 15 ✓ |

## Storyline-Check (Bibel v2 + Kette)
- Folge 17 endet (finales script.txt) „Als Nächstes: Was zahlt sie für das gestickte Shirt?“ → Folge 18 „Heute rechnet sie ihre Marge.“ Rückblick-Satz 2 „Werbebrief: Versand extra.“ = Ergebnis Folge 17. Erste Folge des Serientags 5: Eröffnung endet „Tag fünf.“ + Slam TAG 5; kein „gestern“.
- Eingabe = Serienbriefe Lauf 17 (unverändert angehängt). Ergebnis: Einkaufspreis ohne Konto nicht gefunden; Entscheidung Verkaufspreis Fünferpack offen, Einzelpreis hält. Kasse 0 € → 0 €, kein Umsatz-Zähler. Marge ≠ Umsatz.
- Board: Nummerierung wie `public/firma-ep/tag13–17`; WERBEBRIEF + ADRESSEN bleibt current, kein Haken; DRUCK + PREIS behält Haken, bekommt Badge „5ER OFFEN“ (CTA-Board = Stand nach der Folge).
- Übergabe Folge 19: „Stimmt die Versandzeile?“ – Lauf 18 empfiehlt die Anpassung selbst (5,20/11,20 € vs. etwa 5,34/11,29 €), ohne Login machbar. Für Pius: echter Stickpreis nur im Printful-Konto (Menschen-Schritt, nicht erzählt).
- Faktenschutz: 5,75 € nie lesbar (Shot 05 nie, Shot 06 nie im Bild, nur „17 €“ als Grafik), Kleinunternehmer-Satz nie, Tabelle 10 nie ohne „ANNAHMEN“. Kein Widerspruch zu früheren Folgen, kein Ticket an firma-autor.

## Stimme
- Serienstimme Keno `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **Tempo 1,0** (`regie/el.mjs`, Takes `regie/take.mjs` → `regie/t/`). TTS-Text = script.txt (kein Wort umgeschrieben).
- Takes je Satzgruppe: open ×6, rueck ×4, weg ×8, warum ×8, cta ×8 (+ Einzelsätze s1–s7 ×3 als Tempo-Test: nicht langsamer, s2 einmal „Websearch“ → verworfen). Alle Eröffnungs-Takes hört STT als „probiere“ → Eröffnung aus Folge 12 (Lehre 13/17).
- **Zusammenbau (`regie/assemble18.py`, Parameter `regie/final.env`; Schnitte nur in Stille an Satz-/Komma-/Doppelpunktgrenzen, 3-ms-Fades, Segmentränder auf echte Sprache getrimmt, damit Nahtpausen = gemessene Stille; Pegel aller Teile auf −17,2 dB RMS):**
  - A Eröffnung bis „aus.“ = **Folge 12 `voice.mp3`** | 0,32 s
  - T „Tag fünf.“ = **Take `t/open5`** (fallend: Tag 86 Hz → fünf 92 Hz, längste ruhigste Variante) | 0,40 s
  - B Rückblick „Die … extra.“ = **Take `t/rueck2`** (Betriebe 0,20, Bestellung 0,35 Stille) | 0,45 s
  - C1 „Heute … Einkaufspreis.“ = **Take `t/weg2`** (langsamster) | 0,90 s (Akt-Wechsel Ergebnis → Entscheidung)
  - C2 „Ihren … Versandzeile?“ = **Take `t/warum1`** (langsamster) | 1,00 s (Endkarte, wie F17 0,94)
  - D CTA = **Take `t/cta3`** (langsamster, STT „schick“)
- words.json: Zeiten aus TTS-Alignment, durch Schnitte verschoben, Wortgrenzen auf Stille gezogen (`regie/snap_words.py`). Ziffern: hundert → 100, fünf → 5 („Tag 5.“), acht → 8, siebzehn → 17, zehn → 10. 100 Wörter.

### Betonungstest (Satzkontext, Tempo 1,0; Silben `regie/stress18.py`, Marge `regie/marge.py`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| „Marge“ (MAR-sche) | Reibelaut im Teil „-ge“: Energieanteil > 2,5 kHz 0,7–0,97 über 40–90 ms in allen 8 Takes (weg/cta) = wie Referenz „Marsche“ (0,6–0,9); Referenz „Marga“ (hartes g) 0,0–0,09. STT „Marge“ in allen Takes | ok, kein Umschreiben |
| „Werbebrief:“ | WER- lauter (−13,9 / −15,7 / −18,1 dB), -brief fällt; STT „Werbebrief“ (rueck2 mit Doppelpunkt) | ok |
| „Tag fünf.“ | STT 6/6 Takes + alle Volltests „Tag fünf“ (nie „für“); open5 fallend, lang (Tag 0,33 s, fünf 0,29 s) | ok |
| „Fünferpack“ | FÜN- höchster Ton (158–170 Hz), -pack kurz (0,19–0,21 s); STT 8/8 | ok |
| „Verkaufspreis“ | ver-KAUFS-preis: -kaufs höchster Ton (162–190 Hz) und längste Silbe (0,27 s), klar gegen „Einkaufspreis“ (EIN- trägt) | ok |
| „Rabatt“ | ra-BATT: -batt länger (0,17–0,20 vs 0,10–0,12 s) | ok |
| „siebzehn“ | SIEB- höchster Ton (159–188 Hz), zweisilbig 0,16/0,15 s; STT nie „siebzig“ | ok |
| „Printful-Konto“ | PRINT- höchster Ton (141–204 Hz), kein Bruch am Bindestrich; STT „Printful-Konto“ | ok |
| „Versandzeile?“ | ver-SAND-zei-le, Frage steigt am Ende (le 133–182 Hz in warum1–3) | ok |
| „Claude:“ / „Websuche“ | Doppelpunkt-Pause 0,30 s, danach „Brief“; im Volltext immer „Websuche“ | ok |

## Akte (roter Faden, Story-Objekt = Shirt mit Preisschild)
1. **Hook** 0–7,12 · Rechen-Karte „EINKAUF 17 € = REST 0 €“ → Board, Slam TAG 5
2. **Rückblick** 7,12–14,01 · Gründungsplan, Produkt-Karte, Briefseite F17 mit „Versand: zzgl.“
3. **Heute** 14,01–16,23 · Shirt mit 29,90-€-Schild + Abzugs-Icons
4. **Claude-Weg** 16,23–19,81 · ein Paper-Fenster: Shot 01 → 07
5. **Ergebnis** 19,81–23,39 · selbes Fenster: nur Shot 02 (Kernsatz), Stempel PREIS FEHLT im Fenster
6. **Entscheidung + Warum** 23,39–34,03 · Fünferpack 109 € + Einzelshirt; 5ER-PREIS: OFFEN → WARUM? → 8 € RABATT → AB 17 € NICHTS
7. **Als Nächstes + CTA** 34,03–44,51 · Briefseite zurück (VERSANDZEILE?) → Endkarte „Marge“

## Beat-Plan (Details, Anker, Shots, Verbote: `beats.json`)
| Zeit | Beat | Bild (was ändert sich) | Kamera | Frage im Kopf | Karten | SFX |
|---|---|---|---|---|---|---|
| 0.00–0.74 | B01 hook | Frame 1 = Ergebnis (hooks.md, M-002/M-011): Hook-Frage oben ab Frame 0. Darunter EINE Rechen-Karte als Grafik (kein Screenshot): PREIS − VERSAND − EINKAUF 17 € = REST 0 €, Fußzeile 'Claudes Rechnung, netto'. Auf dem Bild… | langsamer Push-in auf die Rechen-Karte; Drop-Punch +4 % auf 'Umsatz' | Ab wann bleibt nichts – und was macht sie jetzt? | Wie viel Umsatz macht / eine KI in 100 Tagen? | pop, wqh, page, bump |
| 0.74–3.38 | B02 hook | Nur Ereignisse, kein neuer Text, alles an der Rechen-Karte: Marker pulst ('macht'), Preisschild-Icon schwingt ('Unternehmen'), Glanz über EINKAUF ('das@1.5'), Licht-Sweep über die Karte ('KI@1.9'), Punch auf '17 €' ('100… | steht, atmet; Mini-Punch auf '100' | Was kostet so ein Shirt? | – | tick, tick, popHi, click, page, tick, wshort |
| 3.38–4.95 | B03 hook | Stempel 'GANZ ALLEINE.' oben auf 'alleine'; Punch-in auf 'führt?'; auf 'führt:end' (≈ 4,23) leuchtet die REST-Zeile der Rechnung auf (kein neuer Text) (kein neuer Text). Stempel-Kandidat 'AUF NULL' NICHT hier (nur ein Te… | Punch-in 4 % auf 'führt?' | Wirklich ohne Mensch? | GANZ ALLEINE. | wq, clack, bump, tick |
| 4.95–7.12 | B04 hook | Rechen-Karte fliegt raus (outAt 'Ich'), Gründungsplan blendet ein (planFrom 'Ich-0.05'), Maskottchen hüpft auf 'probier' (ganz im Bild, Augen frei). ERSTE Folge des Serientags 5 → Tages-Slam wie Folge 13: 'TAG' auf 'Tag@… | Pull-back zum Board | Was ist das für ein Experiment? | TAG 5 | wq2, popHi, click, wqh, clack |
| 7.12–10.33 | B05 rueckblick | Gründungsplan ganz im Bild (wie Folge 13–17): WERBEBRIEF + ADRESSEN gold (current). Produkt-Karte 'SHIRTS MIT LOGO' auf 'verkauft'; auf 'Betriebe@9.5' kleine Handwerker-Silhouetten mit Shirt (kein Text). Auf 'Logo' hüpft… | ruhig, Board voll | Worum geht es hier? | SHIRTS MIT LOGO | wqh, popHi, tick |
| 10.33–11.97 | B06 rueckblick | Banner 'erst auf Bestellung bestickt' in der Produkt-Karte. | steht | Ohne Lager? | erst auf Bestellung / bestickt | page |
| 11.97–14.01 | B07 rueckblick | Am Feld WERBEBRIEF + ADRESSEN: auf 'Werbebrief' fliegt EINE Briefseite aus Folge 17 heraus (Empfänger schwarz, Logo oben); auf 'Versand@12.5' Marker auf 'Versand: zzgl.' (Beträge normal klein, nicht vergrößert), auf 'extra' kleine… | leichter Push-in auf die Versandzeile | Und was bleibt ihr vom Preis? | – | page, popLo, tick |
| 14.01–16.23 | B08 heute | Pill 'HEUTE: MARGE' auf 'Heute' (unter der Rechen-Liste, kein Überlappen). Ab 'Heute' Shirt mit Preisschild '29,90 €' (Bibel-Angebot). Erst auf 'Marge+0.25' (≥ 1,2 s nach der Pill) drei Abzugs-Zeilen EINKAUF ? · VERSAND … | Fahrt vom Brief zum Shirt mit Preisschild | Wie rechnet sie das? | HEUTE: MARGE | wq2, chime, wshort, tick |
| 16.23–19.81 | B09 claude | Echter Shot 01 im Paper-Fenster (SHOT01), Einstieg 'Claude+0.15': nur die Anhang-Karte DOCX. Auf 'Brief@16.6' orange Rahmen + Zeiger tippt '+', Karte hüpft. Auf 'Websuche' Wechsel IM SELBEN Fenster auf SHOT07 (Marker 'Das Web durc… | Push-in auf Anhang-Karte, dann ruhiger Scroll im Fenster (kein Ortswechsel) | Findet sie den Preis? | Shot 01 Anhang-Karte DOCX (Screenshot, ≤ 4 lesbare Wörter) · Shot 07 Schritte-Zeile (Screenshot, ≤ 12 Wörter) | page, popHi, click, typing, popLo |
| 19.81–23.39 | B10 ergebnis | Im selben Paper-Fenster: NUR SHOT02 Kernsatz ('… nicht öffentlich gefunden.' markiert, ≤ 12 Wörter). Auf 'Printful-Konto' Marker wandert im Kernsatz (kein zweiter Screenshot). Auf 'Einkaufspreis@21.6' Stempel 'PREIS FEHL… | Halt auf dem Kernsatz, kleiner Push-in auf 'nicht öffentlich gefunden' | Und jetzt? Preis raten? | PREIS FEHLT | wshort, click, tick, stamp |
| 23.39–26.69 | B11 entscheidung | Entscheidung: Fünf Logo-Shirts als Fünferpack mit SEINEM Verkaufs-Preisschild '109 €' (Bibel-Angebot, deutlich als Verkauf: Kassen-/Kunden-Seite, nicht Printful); auf 'Verkaufspreis' Marker aufs Schild, auf 'lässt' Stempel '5ER-PR… | Pull-back auf Fünferpack + Einzelshirt, Halt | Warum nicht einfach festlegen? | 5ER-PREIS: OFFEN | wq2, popHi, page, stamp, tick |
| 26.69–30.70 | B12 warum | Fünferpack rückt ins obere Drittel und bleibt. Pill 'WARUM?' auf 'Warum?'. Grund 1 auf '8': Karte '8 € RABATT', Gegenwert grau '21,80 statt 29,90' (Lauf 08: 'Im 5er kostet ein Shirt 21,80 € statt 29,90 €'); Bild: Preisschild 29,90… | kurze Fahrt nach unten zu den Karten, Halt | Bleibt dann noch genug? | WARUM? · 8 € RABATT | airy, pop, popLo, tick |
| 30.70–34.03 | B13 warum | Grund 2 auf '17': Karte 'AB 17 € NICHTS', Unterzeile 'Einkauf pro Shirt' (Grafik, kein Screenshot); Balken 'Rest pro Shirt' schrumpft auf null; auf 'nichts' leert sich der Balken (Tick). Auf dem Bildschirm nur '17 €' wie… | leichter Push-in auf den Balken, Halt in der 0,8-s-Pause | Was kostet das Shirt wirklich? | AB 17 € NICHTS | wshort, clack, popLo, tick |
| 34.03–37.31 | B14 als_naechstes | Pill 'ALS NÄCHSTES' auf 'Als'. Die Briefseite aus B07 kommt zurück, Marker auf 'Versand: zzgl.' (Beträge klein); auf 'Versandzeile' Fragezeichen-Badge an der Zeile + Frage-Karte 'VERSANDZEILE?'. Beleg optional SHOT08 Ber… | Push-in auf die Versandzeile, Halt | Ist der Brief falsch? | ALS NÄCHSTES · VERSANDZEILE? | airy, pop, tick, popHi |
| 37.31–44.51 | B15 cta | Endkarte wie Folge 9–17 (end-Akt, itemTag 'DM'): Keyword 'Marge' tippt auf '„Marge“', Haken, Flieger. EIN Block 'RECHENWEG' auf 'Rechenweg' (Snip: Mini-Rechnung 'Preis − Versand − Einkauf = Rest', ohne Zahlen). Ergebnis-Block '10 … | ruhiger Push-in, Halt | – | Marge (Keyword) · RECHENWEG · 10 MINUTEN: WAS BLEIBT · Puls auf BLEIBT (kein neuer Text) | pop, typing, check, wqh, popHi, chime, tick, pop, tick |

## Ton
- Musik: GONE ab 50,85 s am Stück (Abschnitt 1/5 Serientag 5), Kurve: leiser Einstieg 0,04, Mulde 0,025 in der Pause „offen. → Warum?“ (Stück fällt selbst auf −25…−29 dB), Akzent 0,05 auf „Warum?“ (Wiedereinsatz des Stücks genau dort), danach 0,03, Endkarte 0,05, Fade auf 0. Details `musik.txt`.
- SFX abwechselnd (pop/wq/clack/page/tick/stamp/airy/chime/typing/check), keine schweren Whooshes; Stempel nur auf PREIS FEHLT und 5ER-PREIS: OFFEN. Ziel −14 LUFS über firma-mix.

## Risiken
- 134,8 wpm liegt 0,2 unter der Obergrenze; Rückblick 6,48 s 0,02 unter 6,5. Jede Kürzung von Pausen/Endkarte reißt eine Grenze.
- Damit 135 wpm hält, liegen mehrere Pausen über 0,7 s: Akt-Nähte „Einkaufspreis. → Ihren“ 0,90 und „Versandzeile? → Kommentiere“ 1,00 (Präzedenz F17: 1,22/0,94), „nichts. → Als“ 0,80, „Rechenweg. → In“ 0,87. Das Bild bewegt sich in allen vier Pausen (Stempel/Fahrt/Endkarte).
- „Tag fünf.“ stammt aus einem anderen Take als die F12-Eröffnung (gleiche Stimme/Settings, Pegel angeglichen); STT 22/22 sauber, Prosodie fallend – im Final-QC einmal mit Kopfhörer anhören.
- Fenster F19–F22 sind Reservierungen; Explizit-Check je Folge bleibt Pflicht.

## Korrektur nach Prüfung Regie Runde 1 (2026-11-01, beats.json; alte Fassung regie/beats.r1.json)
- R1-01: B03 Ereignis auf „führt?:end-0.1“ (≈ 4,23 s, REST-Zeile leuchtet + tick) statt 4,6 → Fenster 4,0–4,5 belegt.
- R1-02: Ereignisse ergänzt: „Bestellung“ 11,06 (Maskottchen-Hüpfer + tick), „Dort“ 27,80 (Fünferpack-Wechsel + Hüpfer + tick), „pro@29.4“ 29,49 (Hüpfer + popLo), „Einkaufspreis:end+0.25“ 22,78 (Stempel-Nachschwung + tick).
- R1-03: Frame 0 = Rechen-Karte als Grafik, nur „17 €“ lesbar (wie gesprochen), 17,15 und 5,75 nie im Bild.
- R1-04: B10 nur SHOT02 (SHOT09 gestrichen); B08 Abzugs-Zeilen erst auf „Marge+0.25“ (15,29 s, 1,23 s nach der Pill), 3 Wörter.
- R1-05: Stempel PREIS FEHLT im Paper-Fenster auf dem Kernsatz, Akt 5 an einem Ort.
- R1-06: B01 Anker „Wie“, B09 Anker „Claude“ after 15,8, Marge-SFX mit @-Zeit.
Stimme, words.json, Musik unverändert.

## Korrektur nach Prüfung Regie Runde 2 (beats.json; Fassung davor regie/beats.r2.json)
- R2-01: B13 ohne Screenshot im Bild, nur „17 €“; 17,15 steht in keiner Bild-Anweisung mehr (nur als Faktenbeleg).
- R2-02: Ereignis auf „Logo“ (8,91 s, Maskottchen-Hüpfer + tick) und auf „Versandzeile:end“ (36,35 s, Hüpfer + tick).
- R2-03: story_objekt, B01/B02/B04 und die Akt-/Beat-Tabellen oben an die Rechen-Karte angepasst.

## Nachpflege nach Regie Runde 3 (ohne neue Prüfrunde, 3 Runden erreicht; Fassung davor regie/beats.r3.json)
- R3-01: Shot-Katalog „06“ nur noch Faktenbeleg, nie im Bild; Faktenschutz-Zeile oben angepasst; SHOT09 im Katalog als gestrichen markiert.
- R3-02: B01-Kamera, Akt 5, Korrekturnotiz R2-03 und B03-Dopplung bereinigt; B12 „Dort“ = Hüpfer (Fünferpack steht schon), B14-Karte = „Stimmt die Versandzeile?“ wie im Render.
