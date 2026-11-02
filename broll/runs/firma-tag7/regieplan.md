# Regieplan · Folge 7 „Preis“ (Serientag 2, nicht erste Folge, Slot 2026-10-29 18:00)

firma-regie, 2026-10-28 abends. Grundlage: script.txt (bestanden, 134 Wörter, Wortlaut unverändert), tagesbriefing-2026-10-29.md (Regeln 1–8 + Chef-Entscheide), briefing.md, thema.md („Für die Regie“), hooks.md, pruefung/autor-runde1–3.md (Regie-Hinweise H1–H5 / R3-H), design/lauf/LAUF.md + bericht.md (Chat cbe32aee…, Excel mit 75 Formeln, 3 min 01 s), Vorlage Folge 6 (runs/firma-tag6/).
Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag7/`), `beats.json`, `musik.txt`, Arbeitsdateien und Hilfsskripte in `regie/`.

## Storyline-Check (Bibel v2)
- Kette: Folge 6 endete mit „Bleibt pro Shirt überhaupt etwas übrig?“ → Folge 7 beantwortet sie aus dem echten Lauf: bei A61 nein (−35,63 € pro Auftrag), bei Printful ja (+33,50 €, gerechnet). Die KI kehrt dafür die Partnerwahl aus Folge 6 um (A61 war nur „mit Vorbehalt“). Übergabe an Folge 8: „Wie heißt die Firma?“ (= Tagesbriefing-Kette). Kein Sprung, kein „gestern“, kein Tag.
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Rohertrag nur als „Vorschlag“ / „gerechnet, nicht verdient“ im Bild. Neu: Partner Printful (statt A61), Verkaufspreis-Vorschlag 109 € für 5, Einzelshirt 29,90 € (nur Caption/Guide).
- Rückblick-Satz 1 „bestickt erst auf Bestellung“ (Chef-Entscheid ab Folge 5) ✓, Satz 2 „Partner: A einundsechzig, mit Vorbehalt.“ = Ergebnis Folge 6 ✓.
- Kein Widerspruch zu früheren Folgen gefunden, kein Ticket an firma-autor. Offener Faden 60 °C bleibt offen (nicht versprochen).
- **thema.md:59 (Kürzung):** nicht nötig. Gemessen: Folge 47,85 s (≤ 48), Rückblick 5,88 s (≤ 6,0). „Ein Shirt nachbestellt: rund fünfzehn.“ bleibt, script.txt unverändert.

## Stimme
- Serienstimme wie Folge 2–6: ElevenLabs „Keno“ `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **TTS_SPEED=1.15** (`scripts/eleven-tts.mjs`). TTS-Text `regie/script-tts.txt` = script.txt (dort steht schon „A einundsechzig“; „Stick“ kommt nicht vor).
- 4 Volltakes (`regie/voice-raw.mp3`, `-t2/-t3/-t4`: 51,0 / 51,8 / 54,7 / 49,2 s, Rückblick 7,4 / 6,6 / 6,8 / 6,6 s). Basis = **t4** (kürzester, STT sauber).
- **Rückblick neu:** 8 Takes der beiden Rückblick-Sätze mit `previous_text`/`next_text` (`regie/rueck.mjs`), gewählt Take 4 (Sprache 6,28 s statt 6,55 s, STT korrekt, Pegel −16,3 vs −16,4 dB).
- **Haken-Satz neu:** Im t4 stieg „Haken“ wie eine Frage (F0 110 → 200 Hz). 6 Takes mit Kontext (`regie/haken.mjs`), gewählt **Take 2**: F0 auf „Haken“ fällt 157 → 82 Hz (Aussage), STT „Haken:“, kürzester Take (2,46 s), Pegel gleich (−16,9 dB). Einbau `regie/prep.py` → `voice-raw2.mp3`.

### Betonungstest (Satzkontext, Tempo 1,15; STT + Pegel/Tonhöhe/Dauer je Silbe; `regie/betonung.mjs`, `stress7.py`, `contour.py`, Takes in `regie/betonung/`, STT in `betonung/stt.txt`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| Printful | STT in allen Tests und im Ganzen „Printful“. Im Satzende („Bei Printful:“) PRINT lauter/höher (−15,2 dB, 176 Hz) als -ful; mitten im Satz steigt -ful nur als Weiterführung. Im verwendeten t4 „wechselt: Printful“ PRINT −10,7 dB = Hauptsilbe | Rohtake t4 |
| A einundsechzig | STT „A einundsechzig“ (Frage-Test, t4, Final); „A“ als Buchstabe (0,19 s, eigene Silbe), kein Artikel | Rohtake |
| Rohertrag | ROH lautester Teil (−14,6 dB), -er kurz abgesetzt, kein „Rohr-“; STT „Rohertrag“ | Rohtake |
| hunderteinundfünfzig | HUN höchste Tonhöhe (167 Hz), flüssig; STT im Abschnitt zweimal korrekt (Ganz-STT schreibt einmal „hundereine…“ = Schreibvariante des Modells) | Rohtake |
| neunundsechzig | im t4 NEUN 198–209 Hz, fällt zum Satzende (91 Hz) = Aussage; STT „neunundsechzig“ | Rohtake |
| dreiunddreißig Euro fünfzig | DREI (1.) und EU tragen, „fünfzig“ fällt, keine Pause zwischen Zahl und Euro; STT korrekt | Rohtake |
| Kalkulationsvorlage | -TIONS- längste Silbe (0,23 s) mit Tonhöhenspitze, VOR zweiter Akzent; STT korrekt | Rohtake |
| Sechzig-Grad-Wäsche | SECH, GRAD, WÄ tragen; STT „sechzig Grad Wäsche“ / „60-Grad-Wäsche“ | Haken-Take 2 |
| Haken | t4 Frage-Melodie | **neu (Take 2, fallend)** |

### STT (scribe_v1, de) Wort für Wort gegen script.txt (`regie/stt-final.json`, Abschnitts-Gegenproben `regie/stt-check/`)
- **134 Skriptwörter, 130 identisch im Ganz-STT**, alle 4 Abweichungen sind STT-Normalisierung, kein Sprechfehler:
  - „probier“ → „probiere“: wie Tag 1 und Folgen 3–5 (gleiche Eröffnung, gleiche Normalisierung, auch im Abschnitt 2×).
  - „schick“ → „schicke“: Abschnitts-STT 2× „schick“ (wie Folge 4).
  - „hunderteinundfünfzig“ → „hundereineundfünfzig“: Abschnitts-STT 2× „hunderteinundfünfzig“.
  - „Sechzig-Grad-Wäsche“ → „sechzig Grad Wäsche“ (Bindestriche).
- „Haken:“ als Aussage, „Konkurrenzpreis: hundertzehn.“ und „Bei Printful: neunundsechzig.“ als eigene Sätze erkannt.

### Pausen (Schnitte/Einfügungen nur in echten Pausen < −45 dBFS, 3-ms-Fades; `regie/splice.py`, Karte `regie/splice-map.json`)
| Stelle | roh | neu |
|---|---|---|
| führt? → Ich | 0,25 | 0,19 |
| aus. → Die | 0,41 | 0,21 |
| Bestellung. → Partner | 0,18 | 0,12 |
| Partner: → A | 0,23 | 0,12 |
| Vorbehalt. → Heute | 0,11 | 0,15 (Stille eingefügt) |
| Preis. → Ergebnis | 0,61 | 0,24 |
| anhängen. → Frage | 0,46 | 0,23 |
| Formeln? → Die | 0,37 | 0,25 |
| Einkauf → hunderteinundfünfzig | 0,33 | 0,14 |
| **hundertzehn. → Bei (Grund 1 → Balken 2)** | 0,18 | **0,31** (Stille eingefügt) |
| **neunundsechzig. → Ein (→ Grund 3)** | 0,30 | **0,29** (roh) |
| fünfzehn. → Vorschlag | 0,09 | 0,30 (Stille eingefügt, Warum → Vorschlag) |
| nicht. → Als | 0,09 | 0,23 (Stille eingefügt) |
| Firma? → Ohne | 0,12 | 0,22 (Stille eingefügt) |
| Namen → kein | 0,34 | 0,12 |
| Werbung. → Kommentiere | 0,31 | 0,24 |
| Kommentiere → „Preis“ | 0,31 | 0,11 |
| „Preis“, → und | 0,50 | 0,18 |
- Rückblick-Sätze zusätzlich atempo 1,04 (nur „Die“ … „Vorbehalt.“, Lehre 2026-10-29).
- **Rückblick: „Die“ 4,98 s → „Vorbehalt.“ Ende 10,86 s = 5,88 s** (Audio-Kanten, sil.py; words.json 4,95 → 10,89 = 5,94 s) ≤ 6,0 ✓.
- „Heute“ beginnt 10,98 s, „Ergebnis“ 12,39 s (< 14 ✓).
- **Länge:** Sprache endet 46,79 s, voice.mp3 = 46,85 s (Ausklang 0,06 s, 30-ms-Fade) + 1,0 s Endkarte = **47,85 s** (40–48 ✓, 0,15 s Luft).
- words.json: Zeiten aus dem TTS-Alignment, mitverschoben. Captions als Ziffern: 100, „A einundsechzig“ → ein Wort **„A61“** (4×), Fünf → 5, 151, 110., 69., 15., 109, fünf. → 5., „dreiunddreißig Euro fünfzig.“ → ein Wort **„33,50 €.“** (33,47–34,68), Sechzig-Grad-Wäsche → 60-Grad-Wäsche, zehn → 10. 128 Caption-Wörter.

## Akte (roter Faden)
Story-Objekte: **Kalkulationsblatt** (Frame 1, kommt im Vorschlag-Akt zurück und schließt den Kreis) und **Partner-Karten A61 + Printful** (ab Claude-Lauf: Mini-Karten → Kehrtwende → Printful-Karte oben im Warum → Pflegeetikett im Haken).
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook (ohne Tag) | 0–4,95 | Kalkulationsblatt: „Rohertrag pro Auftrag (Vorschlag 109 €)“ A61 −35,63 € / Printful +33,50 €, „gerechnet, nicht verdient“, keine Umsatzanzeige; HUD-Badge TAG 2 klein | hook |
| 2 Rückblick | 4,95–12,39 | Gründungsplan (1–3 ✓, 5 PARTNER ✓ leuchtet „A61 · mit Vorbehalt“) + Shirt-Karte, Fahrt nach oben zu Schritt 4 PREIS | recap |
| 3 Claude-Lauf | 12,39–17,26 | echter Shot 01 (Anhang + Prompt, Markierungen, Mini-Karten A61/Printful), echter Shot 02b Datei-Karte XLSX | claudeShot ×2 |
| 4 Kehrtwende | 17,26–20,29 | Partner-Karten: Stempel fällt von A61, Printful vor, Stempel „PRINTFUL STATT A61“, Beweis Shot 02a | winner |
| 5 Warum | 20,29–30,14 | Einkaufskarte (A61 151 € über Linie 110 €, Printful 69 € darunter) + Nachbestellkarte (rund 15 €, grau A61 35,80 €) | why |
| 6 Vorschlag | 30,14–34,84 | Kalkulationsblatt: Preisschild „Vorschlag 109 € für 5“, Zeile „Rohertrag pro Auftrag +33,50 €“ + „gerechnet, nicht verdient“ | result |
| 7 Haken | 34,84–37,44 | Pflegeetikett 60 °C durchgestrichen, „machine wash warm“ | question |
| 8 Als Nächstes | 37,44–41,48 | Board klein, NAME „Firma ???“, LOGO/MUSTER/WERBUNG gesperrt | question |
| 9 CTA | 41,48–47,85 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json. Anker immer Wort + after, siehe beats.json.

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton (SFX/Musik) | Muster |
|---|---|---|---|---|---|---|
| 0,00–1,07 | Wie viel Umsatz macht ein | **Frame 1 = Ergebnis:** Kalkulationsblatt, Zeile „Rohertrag pro Auftrag (Vorschlag 109 €)“: A61 **−35,63 €** rot, Printful **+33,50 €** grün; Zeile **„gerechnet, nicht verdient“**; kleiner Stempel „PRINTFUL STATT A61“. Titel fällt auf „Umsatz“. Kein Zähler | langsamer Push-in | Plus 33,50 – warum A61 im Minus? | Pop, Whoosh hoch leicht, Bump; Musik leiser Auftakt | M-002, M-005 |
| 1,07–2,93 | Unternehmen, das eine KI 100 Tage lang | „+33,50 €“ pulsiert auf „100“, −35,63 flackert | steht, atmet | Wieso Minus? | Whoosh kurz, Tick | M-005 |
| 2,93–3,92 | ganz alleine führt? | Stempel „GANZ ALLEINE.“ | Punch-in 4 % | Wirklich ohne Mensch? | Whoosh quick, Stamp-Clack | M-011 |
| 3,92–4,95 | Ich probier das aus. | Pull-back vom Blatt, HUD-Badge „TAG 2“ klein. Kein Slam, keine Hand | Pull-back | Was für ein Experiment? | Klick, Pop-hoch | Serienrahmen |
| 4,95–6,51 | Die Firma der KI verkauft Shirts mit | **Rückblick:** Board ganz im Bild, 1–3 ✓, 4 PREIS orange offen, 5 PARTNER ✓; Shirt-Karte „SHIRTS MIT LOGO“ fliegt **unter** das Board (Shirts 6,07) | steht | Worum geht es? | Whoosh hoch leicht, Pop-hoch | Rückblick-Akt |
| 6,51–8,93 | Logo an kleine Betriebe, bestickt erst auf Bestellung. | Logo als Stick (6,51), Banner „erst auf Bestellung bestickt“ (7,58) | steht | Ohne Lager? | Tick, Page-Turn | – |
| 8,93–10,98 | Partner: A61, mit Vorbehalt. | Schritt 5 PARTNER bekommt Haken und **leuchtet** (zuletzt erledigt), Label „A61“ (9,38), Mini-Stempel „MIT VORBEHALT“ (10,28) | leichter Push-in auf Schritt 5 | Partner steht – fertig? | Check, Stamp leise | Rückblick-Akt |
| 10,98–12,39 | Heute rechnet sie ihren Preis. | **Fahrt nach oben zu Schritt 4 PREIS**, leuchtet gold, Shirt-Karte raus, Pill **„HEUTE: PREIS RECHNEN“** | Fahrt auf Zeile 4 | Was kostet ein Shirt eigentlich? | Whoosh quick, Chime | M-003 |
| 12,39–13,39 | Ergebnis anhängen. | **Echter Shot 01** (ohne Begrüßungszeile): Zeiger auf Anhang-Chip „Shirt-Firma Ergebnis Partner.md · 65 lines“, oranger Rahmen auf „anhängen“. Chips ANHANG · FRAGE · EXCEL | Push-in auf den Chip | Wo klicke ich? | Whoosh quick, Klick | M-004, M-008 |
| 13,39–16,26 | Frage: Was kosten A61 und Printful, | Shot 01 Prompt: gelb „Was kostet mich ein Paket mit fünf Shirts“ (13,80), orange „A61“ (14,39), grün „zweite Wahl ist Printful“ (15,52); rechts schieben **Mini-Karten** A61 „MIT VORBEHALT“ (14,39) und Printful „ZWEITE WAHL“ (15,52) rein; Re-Hook „Die Frage zum Kopieren → am Ende“ | Push-in auf Prompt, Pan zu A61/Printful | Zwei Partner – welcher ist billiger? | Tick, Typing, Pop-tief, Pop-hoch | M-004 |
| 16,26–17,26 | als Excel mit Formeln? | Markierung „als Excel-Datei mit Formeln“ (16,26), Senden-Klick (16,72), Schnitt auf **echten Shot 02b**: Datei-Karte „Shirt firma preiskalkulation · Spreadsheet · XLSX“, Chip „2 Blätter · 75 Formeln“ | Push-in auf die Datei-Karte | Hat sie wirklich gerechnet? | Tick, Klick-hoch, Pop-hoch | M-004 |
| 17,26–18,57 | Die KI wechselt: Printful | **Kehrtwende:** Partner-Karten groß, A61 vorn; auf „wechselt“ (17,70) rutscht „MIT VORBEHALT“ ab, A61 grau nach hinten; auf „Printful“ (18,18) schiebt Printful vor, leuchtet grün | Schwenk A61 → Printful | Warum wirft sie den Partner um? | Whoosh quick, Page, Power-up; **Musik fast still 17,0–18,1, Akzent auf „Printful“** | M-002 |
| 18,57–20,29 | statt A61. | Stempel **„PRINTFUL STATT A61“** (18,57); Beweis-Kachel **Shot 02a**, „Ich entscheide mich für Printful“ orange markiert (19,23) | Mikro-Punch 3 %, dann ruhig | Ist das echt Claudes Entscheidung? | Stamp, Tick | M-011 |
| 20,29–20,90 | Warum? | Printful-Karte (mit Stempel) klein oben links, Pill „WARUM PRINTFUL?“ | 0,3-s-Fahrt, dann ruhig | Warum? | Whoosh quick, Pop | Warum-Beat |
| 20,90–26,21 | 5 Shirts kosten bei A61 im Einkauf 151 Euro. Konkurrenzpreis: 110. | **Grund-Karte 1 „EINKAUF 5 SHIRTS“** (20,90, mit Inhalt): Balken A61 wächst rot auf **„151 €“** (23,29), graue Linie **„Konkurrenzpreis 110 €“** (24,56, Wert 25,44), Balken ragt über die Linie. 151 € steht 6,6 s | ruhig, leichter Push-in | Teurer als die Konkurrenz verkauft? | Pop-tief, Roll, Bump, Tick, Pop-tief | Warum-Beat, M-005 |
| 26,21–27,91 | Bei Printful: 69. | **Gleiche Karte**, zweiter Balken Printful grün **„69 €“** (Wert 27,05) klar unter der Linie (H4: kein Verkaufspreis). Pause davor 0,31 s. 69 € steht bis 30,6 (3,6 s) | ruhig | Und Printful? | Pop-hoch, Check | Warum-Beat |
| 27,91–30,14 | Ein Shirt nachbestellt: rund 15. | **Grund-Karte 3 „NACHBESTELLEN 1 SHIRT“** rechts daneben (Pause davor 0,29 s): grün **„rund 15 €“** (28,95/29,32), klein „Stickdatei bleibt“; **Gegenwert grau „A61: 35,80 €“** (28,6). 15 € steht bis 30,6 (1,3 s ab „15“, 1,7 s ab „rund“) | ruhig, Schwenk nach rechts | Und Nachbestellungen? | Pop-tief, Tick, Check | Warum-Beat |
| 30,14–32,28 | Vorschlag: 109 Euro für 5. | Zurück zum **Kalkulationsblatt** (Warum-Karten dimmen erst auf „109“), Preisschild an der Printful-Spalte: **„VORSCHLAG“** (30,14), **„109 €“** (30,65), „für 5 Shirts“ (31,73) | Pull-back aufs Blatt, Push-in aufs Schild | Wie viel bleibt? | Whoosh hoch, Pop-hoch, Tick | M-005 |
| 32,28–34,84 | Rohertrag pro Auftrag: 33,50 €. | Zeile „Rohertrag pro Auftrag“ leuchtet, Wert rollt auf **„+33,50 €“** grün (33,47), grau „A61: −35,63 €“, Pflicht-Etikett **„gerechnet, nicht verdient“** (34,07). Kein Zähler | Push-in auf die Zeile | Ist das schon Geld? | Page, Roll, Check | M-005 |
| 34,84–37,44 | Haken: 60-Grad-Wäsche verspricht Printful nicht. | Pill „HAKEN“, Pflegeetikett **„60 °C“** an der Printful-Karte, rot durchgestrichen (35,25), Zitat **„machine wash warm“** (36,11), klein „Bau wäscht heiß“ (36,4), Puls auf „nicht“ | ruhig, Push-in aufs Etikett | Und die Bau-Kunden waschen heiß? | Page, Clack, Tick, Pop-tief; **Musik: Mulde 34,5–35,25, Wiedereinsatz auf „60-Grad-Wäsche“** | Haken |
| 37,44–41,48 | Als Nächstes: Wie heißt die Firma? Ohne Namen kein Logo, kein Muster, keine Werbung. | Pill „ALS NÄCHSTES“, Board klein, Schritt 6 NAME leuchtet mit Schild **„Firma ???“** (38,52); Schloss-Chips LOGO (39,88), MUSTER (40,37), WERBUNG (40,99) | ruhig, leichter Push-in auf NAME | Wie wird sie heißen? | Whoosh airy, Pop, 2× Tick, Pop-tief; Musik ruhiger Teil | offener Faden |
| 41,48–47,85 | Kommentiere „Preis“, … Kalkulationsvorlage. Damit rechnest du deinen Preis in 10 Minuten. | Endkarte: Keyword tippt (41,97), Haken, Flieger (42,61), Items „Die Frage“ (43,33, Snippet Shot 01 ohne Begrüßung) und „Die Kalkulationsvorlage“ (44,04, Ausschnitt Shot 03, „Vorlage im PDF“, **kein xlsx/Download**), „deinen Preis“ (45,88), „in 10 Minuten“ (46,29), Bot-Hüpfer ~46,9, Halt bis 47,85 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Whoosh hoch, 2× Pop-hoch, Chime, Pop; Stück endet selbst | M-007, M-011 |

Prüfung M-009 (≤ 1,5 s ohne Änderung): längste Strecken 23,29 → 24,56 = 1,27 (Balken-Roll + Bump auf „Euro“ 24,16), 46,29 → 46,9 → 47,85. Warum-Karten je ≥ 1,2 s auf ihrem Wort ✓ (151 € 6,6 s · 69 € 3,6 s · rund 15 € 1,3–1,7 s, Karten dimmen erst auf „109“ 30,65). Pausen zwischen den Gründen 0,31 / 0,29 s ✓.

## Shots (echte claude.ai-Ausschnitte, `public/firma-ep/tag7/shots/`, ohne Sidebar)
- 01-prompt-mit-anhang.png → B09/B10/B11 + Endkarten-Item „Die Frage“. **Oben die Begrüßung „Good evening, Henri/Jakob (SK)“ wegschneiden (Nutzername).**
- 02b-datei-karte.png → B11, nur die Datei-Karte (Text darüber mit 39,86 € / Quellen wegschneiden).
- 02a-antwort-kopf.png → B13 Beweis-Kachel („Ich entscheide mich für Printful“).
- 03-rechentabelle.png → Endkarten-Item „Die Kalkulationsvorlage“ (Ausschnitt), optional Vorlage für das Kalkulationsblatt (Werte 1:1).
- 04-entscheidung.png → optional im Warum-Akt als kleines Zitat („Nachbestellen bleibt bei Printful billig.“), nicht als Lesetext.

## Ton
- Musik: GONE-Original ab **327,63 s**, 47,85 s am Stück bis Track-Ende 375,48, nie geloopt (Details `musik.txt`). Kein freier Abschnitt ≥ 47,85 s mehr außerhalb der Tabuzone 200–276; diese Wahl überschneidet sich mit keiner Folge vom 29.10., nur 31,4 s mit Folge 3 (28.10.) bei anderer Lage im Clip. Folge 8 hatte bei Abgabe keine musik.txt.
- Struktur: leiser Auftakt, Refrain laut, Stille vor der Pointe per Kurve 17,0–18,1 (unter „Formeln? → Die KI wechselt:“), Akzent auf „Printful“; natürliche Mulde 34,5–35,25 und Wiedereinsatz auf „60-Grad-Wäsche“ (Haken); ab 37 s leiser Teil für Als Nächstes + CTA, das Stück endet selbst mit der Endkarte. Gemessen jeder Akt 21,0–25,8 dB unter der Stimme (≥ 15 ✓, vor dem finalen Mix, `regie/gap-final.txt`). Ziel −14 LUFS, TP −1.
- SFX: Palette wie Folge 4–6 (`beats.json → sfx_dateien`), viele verschiedene Dateien, Whooshes nur 0,2–0,25, keine Boom-/Sub-Hits.

## Hinweise an firma-design (offene Punkte)
1. **Neues Objekt Kalkulationsblatt** (`engine_akte → hook.prop = calcSheet`): Excel-Look, Zeile „Rohertrag pro Auftrag (Vorschlag 109 €)“ A61 −35,63 € / Printful +33,50 €, Pflicht-Zeile „gerechnet, nicht verdient“, Stempel „PRINTFUL STATT A61“. Wird in Hook und Vorschlag-Akt (B18/B19, `result`) gebraucht → in `src/components/firma/`. Engine kennt den Akt-Typ `result` bisher nicht (Fallback: question-Akt mit `lines`).
2. **Board:** wie Folge 5/6 mit PARTNER direkt nach PREIS (10 Schritte). `plan_vorschlag`: done [0,1,2,4], current 3, wip []. `recap.last.step = 4` (PARTNER leuchtet, „A61 · MIT VORBEHALT“), `recap.today.step = 3` → Fahrt geht eine Zeile **nach oben**. Prüfen, ob die Engine einen erledigten Schritt hinter dem current-Schritt korrekt zeichnet.
3. **Balken-Karte** (`why.bars_wunsch`): zwei Balken auf **einer** Karte „EINKAUF 5 SHIRTS“ mit grauer Linie „Konkurrenzpreis 110 €“; der 69-€-Balken darf nie als eigene Preis-Karte erscheinen (Prüfer H4). Nachbestellkarte mit grauem Gegenwert „A61: 35,80 €“ (`vs_wunsch`). Warum-Karten bleiben bis „109“ (30,65) sichtbar.
4. **Partner-Karten A61/Printful** als ein wiederverwendbares Objekt (Mini in B10 → groß in B12/B13 → klein oben in B14 → Etikett in B20). Stempel „MIT VORBEHALT“ muss abrutschen können.
5. **Pflegeetikett 60 °C durchgestrichen** + Zitat „machine wash warm“ (`label_wunsch`), Icon `careLabel60` aus Folge 6.
6. **Als Nächstes:** NAME-Schild „Firma ???“ + 3 Schloss-Chips (`board_wunsch`); Fallback question-Akt mit `lines`.
7. **Screenshots zuschneiden:** Shot 01 ohne Begrüßung mit Nutzernamen, Shot 02b nur Datei-Karte. Excel-Vorschau gibt es nicht (fremder iframe), deshalb Datei-Karte + Chat-Tabelle.
8. **Endkarte:** Kalkulationsvorlage nur als Tabelle/PDF zeigen, kein xlsx-Symbol, kein Download-Pfeil (Funnel schickt genau ein PDF).
9. **Umsatz-Zähler:** keiner (0 €). Rohertrag nie ohne „Vorschlag“/„gerechnet, nicht verdient“ im selben Bild.
10. Länge 47,85 s hat nur 0,15 s Luft bis 48 s: Endkarte nicht verlängern.
