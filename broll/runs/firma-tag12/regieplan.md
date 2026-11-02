# Regieplan · Folge 12 „Betriebe“ (Serientag 3, nicht erste Folge, Slot 2026-10-30 18:00)

firma-regie, 2026-10-30. Grundlage: script.txt (Autor R4 final, **100 Wörter, Wortlaut unverändert**), thema.md („Für die Regie“, „Länge“), hooks.md, briefing.md (Chef-Hinweise), ../firma-tag9/tagesbriefing-2026-10-30.md (alle Regeln K.-o.), design/lauf/LAUF.md + Screenshots (nur `*-anonym.png`/`liste-anonym.png` für Betriebe). Vorlagen Folge 8–11 (runs/firma-tag8/, firma-tag10/, firma-tag11/, public/firma-ep/tag9/, tag11/).
Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag12/`), `beats.json` (erzeugt von `regie/make_beats.py`), `musik.txt`, Arbeitsdateien/Tests in `regie/`, Bibel-Zeile Folge 12 (wirtschaftsbuch-v2.md, `regie/bibel_eintrag.py`).

## Messwerte (Endfassung)
| Messung | Wert | Vorgabe |
|---|---|---|
| Länge voice.mp3 | **44,58 s** (+ 1,0 s Endkarte = **45,58 s**) | 40–48 s ✓ |
| Sprechtempo | **134,6 wpm** nur Stimme (100 / 44,58 s), **131,6 wpm** über die ganze Folge inkl. Endkarte | 120–135 ✓ |
| Rückblick „Die“ → Ende „Mensch.“ | **5,91 s** (Alignment 6,46–12,26), 5,75 s am Pegel | ≤ 6,5 s ✓ (nicht beschleunigt) |
| Satzpause Rückblick-Satz 1 → 2 („Bestellung.“ → „Anmelden“) | **0,12 s** Stille (Alignment-Lücke 0,08 s) | ≤ 0,2 s ✓ |
| „Heute“ beginnt bei | **12,93 s** (Pegel 12,96) | ≤ 14,5 s ✓ |
| Tempo TTS | 1,0 (kein atempo, keine Beschleunigung, keine Verlangsamung) | 1,0 ✓ |
| Stimme integriert | −18,2 LUFS (vor dem Mix) | Mix-Ziel −14 LUFS |
| STT (scribe_v1, de) | **6/6 Läufe 100/100 Wörter identisch** mit script.txt, „Chemnitz“ 6/6 | jedes Wort ✓ |
| Musik explizit | **0** explizite Wörter (2 Läufe) | 0 ✓ |

## Storyline-Check (Bibel v2 + Kette Tagesbriefing)
- Folge 11 endet mit „Als Nächstes: Wen spricht sie zuerst an?“ → Folge 12 „Fünf würde sie zuerst ansprechen.“ (Lauf: „Zuerst ansprechen würde ich …“). Rückblick-Satz 2 „Anmelden muss ein Mensch.“ = Ergebnis Folge 11. Kein „gestern“, kein Tag gesprochen.
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Kein Kunde gewonnen, nichts angeschrieben. Gewerbe weiter offen (Mensch), nicht als erledigt erzählt.
- Übergabe Folge 13: „Was schreibt sie?“ → Lauf 13 (Werbebrief). Kein Widerspruch zu früheren Folgen, kein Ticket an firma-autor.

## Stimme
- Serienstimme wie Folge 2–11: ElevenLabs „Keno“ `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **TTS_SPEED=1.0** über `scripts/eleven-tts.mjs`. TTS-Text `regie/script-tts.txt` = script.txt (keine Sonderschreibung nötig).
- 3 Volltakes (`regie/voice-raw1–3.mp3`), gewählt **Take 1**: STT 100/100 (Take 2/3: „probiere/schicke“); Rückblick roh 6,15 s, Satzpause 0,12 s (Take 2: 7,22 s und 0,65 s ✗); „Warum?“ steigt 90 → 184 Hz; „Haken:“ fällt 145 → 85 Hz (Aussage); „Chemnitz“ CHEM- trägt.

### Betonungstest (Satzkontext, Tempo 1,0; `regie/betonung.mjs`, Takes in `regie/betonung/`, Silben `regie/stress12.py`, Vokal `regie/formant.py`, Verlauf `regie/wordcontour.py`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| Chemnitz | CHEM- lauter (−16,9 / −14,6 dB) als -nitz (−27 / −22 dB) = KEM-nitz; STT „Chemnitz“ 2/2 Test, 3/3 Volltakes, 6/6 Endfassung | Take 1 |
| „Claude:“ | englisch: Vokal F1 ~250–420 / F2 750–1000 Hz (dunkles o, „Klohd“), kein au-Gleitlaut; STT „Claude“ überall. Doppelpunkt: kurze Pause, s. Pausen | Take 1 |
| Websuche | WEB- trägt, „su“ = deutsches u (F1 ~220, F2 ~720–820 Hz in allen 9 Takes). STT hört je nach Pausensetzung „Websearch“ (s. STT) | Take 1, Pause nach „Claude:“ roh |
| Excel-Liste | EX- trägt (−17 dB, höchster Ton), -Liste tiefer; STT „Excel-Liste“ überall | Take 1 |
| angehängt | AN- trägt, -hängt fällt; STT korrekt | Take 1 |
| Teamgröße | TEAM- höchster Ton (178/189 Hz) = „Tiem-größe“, nicht Kleidergröße; STT „Teamgröße“ 2/2 + alle Volltakes | Take 1 |
| Verzeichnis | Ver-ZEICH-nis (−nis −22 dB), fällt als Satzende | Take 1 |
| Anmelden | AN- trägt (Satzanfang); STT „Anmelden muss ein Mensch“ | Take 1 |
| Kommentiere | kom-men-TIE-re; STT korrekt | Take 1 |
| Listenvorlage | LIS-ten-vor-la-ge; STT 6/6 Endläufe Wort korrekt; scribe schreibt dabei „Frage- und Listenvorlage“ (Ergänzungsstrich = nur Schreibweise, Wortfolge identisch) | Take 1 |
| Firmenkunden | FIR- trägt (−14,2 dB); STT korrekt | Take 1 |
| Business | BUS- trägt, „Bis-nis“; STT korrekt | Take 1 |
| Warum? / Haken: / Als Nächstes: | Warum steigt; Haken fällt (Aussage, STT setzt Komma/Punkt); „Nächstes:“ mit 0,55 s Pause | Take 1 |

### STT (scribe_v1, de) gegen script.txt (`regie/cmp.py`, `regie/stt-final1–6.json`)
- **6/6 Endläufe 100/100 identisch.** Gegenprobe: Mit 0,35 s Pause nach „Claude:“ hörte STT in 5 von 13 Läufen „Websearch“ (englischer Kontext direkt nach der Pause); mit der rohen 0,13-s-Pause 15/15 Testläufe + 6/6 Endläufe „Websuche“. Deshalb bleibt „Claude:“ → „letztes“ roh.

### Pausen (nur an Satz-/Komma-/Doppelpunktgrenzen, Stille < −45 dBFS, 3-ms-Fades; `regie/splice.py`, Karte `regie/splice-map.json`)
| Stelle | roh | neu |
|---|---|---|
| führt? → Ich | 0,14 | 0,70 |
| aus. → Die (Rückblick beginnt) | 0,58 | 0,70 |
| Betriebe, → bestickt (Rückblick Satz 1) | 0,39 | 0,15 |
| **Bestellung. → Anmelden (Rückblick Satz 1 → 2)** | 0,12 | **0,12** |
| Mensch. → Heute (Fahrt zu BETRIEBE) | 0,66 | 0,70 |
| Chemnitz. → Claude (neuer Akt, Region-Karte steht) | 0,15 | 0,70 |
| Claude: → letztes | 0,13 | 0,13 (STT, s. o.) |
| angehängt, → Websuche (Shot 01 → 07) | 0,28 | 0,35 |
| Websuche, → Excel-Liste (Shot 07 → 06) | 0,15 | 0,35 |
| Excel-Liste. → Fünf (Musik-Mulde) | 0,66 | 0,70 |
| **ansprechen. → Warum (vor dem Warum)** | 0,27 | **0,90** |
| Warum? → Das | 1,37 | 0,70 |
| sichtbar. → Einer (Grund 1 → 2, Karten ≥ 1,2 s) | 0,14 | 0,70 |
| ein, → braucht (Komma hörbar) | 0,00 | 0,25 (am Energie-Minimum, 10-ms-Fades) |
| Kleidung. → Haken | 0,13 | 0,70 |
| Haken: → Teamgröße | 0,22 | 0,55 |
| Verzeichnis. → Als Nächstes | 0,79 | 0,70 |
| Nächstes: → Was | 0,15 | 0,55 |
| sie? → Kommentiere | 0,40 | 0,70 |
| „Kunden“, → und | 0,41 | 0,50 |
| Listenvorlage. → Damit | 0,37 | 0,70 |

Keine Pause > 0,7 s außer vor dem Warum (0,9). Roh 40,54 s → 44,58 s nur über Pausen.
words.json: Zeiten aus dem TTS-Alignment, durch die Schnitte verschoben, Wortenden auf Stille nachgezogen (`regie/snap_words.py`). Caption-Ziffern: hundert → 100, zwanzig → 20, Fünf → 5, zehn → 10. 100 Caption-Wörter.

## Akte (roter Faden)
Durchgehendes Story-Objekt: **Karte der Testregion (20 Pins, 5 gelb) + anonyme Liste** (`liste-anonym.png`). Frame 1 zeigt beides, im Heute-Beat kommt die Karte aus dem Board-Feld BETRIEBE zurück, ab der Entscheidung ist die Liste das Hauptobjekt bis zum Haken.
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook (ohne Tag) | 0–6,46 | Karte 20 Pins / 5 gelb + TESTREGION CHEMNITZ, Liste als Bild-Objekt | hook (Story-Objekt) |
| 2 Rückblick | 6,46–12,93 | Gründungsplan, Produkt-Karte, GEWERBE + MENSCH, Fahrt zu BETRIEBE | recap |
| 3 Heute | 12,93–15,89 | Karte aus BETRIEBE, Pins fallen, Region-Karte 50 STATT 38 | Story-Objekt + Karte |
| 4 Claude-Weg | 15,89–21,14 | echte Shots 01 → 07 → 06 | claudeShot ×3 |
| 5 Entscheidung | 21,14–23,48 | Liste groß, Top-5-Zeilen, Mini-Karte | Story-Objekt |
| 6 Warum | 23,48–29,39 | Liste oben, 2 Karten | why |
| 7 Haken | 29,39–33,29 | ganze Liste, Spalte Größenquelle, 17 VON 20 | question (card:false) |
| 8 Als Nächstes | 33,29–35,91 | Board klein, WERBEBRIEF „?“ | question |
| 9 CTA | 35,91–45,58 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json; Anker immer Wort + after (beats.json).

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,40 | Wie viel | **Frame 1 = Ergebnis:** Hook-Frage komplett ab Frame 0; Karte Chemnitz + Umland, 20 Pins (Ort-Ebene), 5 gelb; Beschriftung „TESTREGION CHEMNITZ“; Liste klein/weich dahinter (20 Streifen, 5 gelb, kein Lesetext); HUD TAG 3 | langsamer Push-in auf die gelben Pins | Wer sind die 20, warum fünf gelb? | Pop | M-002 |
| 0,40–3,38 | Umsatz macht ein Unternehmen, das eine KI 100 Tage lang | kein neuer Text, je ein Ereignis pro 0,5 s: Drop („Umsatz“), Pin 1 pulst („macht“), Welle durch 20 Pins („Unternehmen“), gelbe Streifen glühen („das“), Beschriftung wackelt („KI“), Punch „100“, Licht-Sweep („Tage“), Kamera rutscht („lang“) | Punch auf „Umsatz“, Mini-Punch „100“ | Kann eine KI das allein? | Whoosh hoch, Bump, Tick, Pop tief, Klick, Tick, Pop hoch, Tick, Whoosh kurz | |
| 3,38–4,95 | ganz alleine führt? | Stempel „GANZ ALLEINE.“, Punch-in, gelbe Pins hüpfen (4,35) | Punch-in 4 % | Wirklich ohne Mensch? | Whoosh, Clack, Bump, Tick | M-011 |
| 4,95–6,46 | Ich probier das aus. | Karte + Liste raus, Board ein, Maskottchen hüpft (ganz im Bild). Kein Slam | Pull-back | Was ist das Experiment? | Whoosh, Pop, Klick | Serienrahmen |
| 6,46–9,69 | Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, | Board: PRODUKT … LOGO grün, WEBSITE „ENTWURF“, GEWERBE … ERSTER UMSATZ offen; Karte „SHIRTS MIT LOGO“ auf „verkauft“ | ruhig | Worum geht es? | Whoosh hoch leicht, Pop | Rückblick |
| 9,69–11,09 | bestickt erst auf Bestellung. | Banner „erst auf Bestellung bestickt“ | steht | Ohne Lager? | Page | Rückblick |
| 11,09–12,93 | Anmelden muss ein Mensch. | GEWERBE leuchtet kurz (zuletzt bearbeitet), Stempel „MENSCH“ schlägt auf „Anmelden“ auf, stößt auf „Mensch.“ nach; Personen-Symbol, kein Haken. In der Pause: Fahrt zu BETRIEBE, das gold wird | Push-in GEWERBE, Fahrt zu BETRIEBE | Was macht die KI, solange ein Mensch anmeldet? | Stamp, Bump, Whoosh | Rückblick |
| 12,93–14,62 | Heute sucht sie 20 Betriebe in | BETRIEBE öffnet sich zur Karte (Story-Objekt) mit „TESTREGION CHEMNITZ“; auf „20 Betriebe“ fallen 20 Pins nacheinander | Fahrt durch das Feld in die Karte | Wo sucht sie? | Whoosh, Chime, Roll | Heute |
| 14,62–15,95 | Chemnitz. | **Region-Karte (Pflicht) in Normalgröße:** „50 STATT 38“, klein „Handwerksbetriebe je 10.000 Einwohner · Sachsen vs. Bund · Aroundhome 2026“, steht 1,33 s | leichter Push-in auf die Karte | Warum Chemnitz? | Pop tief | Entscheidung 1 |
| 15,95–17,85 | Claude: letztes Ergebnis angehängt, | echter **Shot 01**: Anhang-Karte „Shirt-Firma Ergebnis Gewerbe.md · 44 Zeilen“, orange Rahmen auf „Ergebnis“, Zeiger tippt „+“ auf „angehängt“; Prompt nur Textur (1,9 s) | Push-in auf die Anhang-Karte | Womit fängt sie an? | Page, Pop tief, Klick | M-004 |
| 17,85–19,10 | Websuche, | echter **Shot 07**: nur Zeile „Eine Datei geteilt, das Web durchsucht und 24 weitere Schritte“, Glanz auf „das Web durchsucht“ (1,25 s) | leichter Push-in | Woher hat sie die Betriebe? | Whoosh kurz, Typing | M-004 |
| 19,10–21,14 | Excel-Liste. 5 | echter **Shot 06**: Datei-Karte „Kolonnenshirt testregion chemnitz · Tabellenkalkulation · XLSX“, Rahmen auf „Excel-Liste“; Musik-Mulde, Bild steht; Klick auf „5“ (2,0 s) | Push-in, Halt | Was steht drin? | Pop hoch, Stille, Klick + Musik-Akzent | M-004 |
| 21,14–23,48 | würde sie zuerst ansprechen. | Karte klappt zur Liste auf, 5 gelbe Zeilen leuchten, Mini-Karte: 5 Pins springen gelb; auf „zuerst“ Push-in: lesbar nur Rang 1–5 + erstes Gewerk-Wort (Maler, Dachdeckerei, Maler, Zimmerei, Elektroinstallation); 0,9 s Pause: steht | Push-in auf die gelben Zeilen, Halt | Warum diese fünf? | Whoosh, Power, Check | M-002 |
| 23,48–26,91 | Warum? Das Shirt ist beim Kunden sichtbar. | Liste oben; Pill „WARUM?“; Karte 1 „BEIM KUNDEN SICHTBAR“ auf „Kunden“ (Bild: Shirt mit Logo beim Handwerker am Kundenhaus), grau „Tiefbau ✗“; Pfeil auf alle 5 gelben Zeilen | kurze Fahrt nach oben, ruhig | Warum zählt Sichtbarkeit? | Whoosh airy, Pop, Pop tief, Tick | Warum-Beat |
| 26,91–29,39 | Einer stellt ein, braucht Kleidung. | Karte 2 „STELLT EIN“ + klein „laut Anzeige“ auf „stellt“, Pfeil nur auf Zeile Rang 1 (Maler); „Kleidung“: Shirt-Icon wird zu zwei | leichter Push-in auf Rang 1 | Und die anderen? | Tick, Pop hoch, Pop tief | Warum-Beat |
| 29,39–31,94 | Haken: Teamgröße meist nur laut | Pill „HAKEN“; ganze Liste, Spalte „Art der Größenquelle“; ab „Teamgröße“ leuchten die 17 Zellen „Branchenverzeichnis“ (Zeilen 1–16, 18) nacheinander, 17/19/20 grau; Zähler „17 VON 20“ auf Teamgröße+0,22 | Pull-back auf ganze Liste | Stimmt die Größe? | Whoosh, Page, Roll, Pop hoch | Grenze als Befund |
| 31,94–33,29 | Verzeichnis. | Stempel „BRANCHENVERZEICHNIS“ (Datei-Wort) schräg über die Spalte | Push-in auf die Spalte | Und jetzt? | Clack | M-011 |
| 33,29–35,91 | Als Nächstes: Was schreibt sie? | Pill „ALS NÄCHSTES“; Board klein: WEBSITE ENTWURF, GEWERBE offen + Person, BETRIEBE gold, WERBEBRIEF „?“; Karte „WAS SCHREIBT SIE?“ auf Was+0,05 | leichter Push-in auf WERBEBRIEF | Was schreibt sie den fünf? | Whoosh airy, Pop, Tick, Pop tief | offener Faden |
| 35,91–45,58 | Kommentiere „Kunden“, … für dein eigenes Business. | Endkarte: Keyword „Kunden“ tippt, Haken, Flieger; ein Block „FRAGE + LISTENVORLAGE“ auf „Frage“ (Snip Anhang-Karte + Listen-Miniatur unlesbar); ein Block „FIRMENKUNDEN IN 10 MINUTEN“ auf Damit+0,05, Puls auf „Firmenkunden“; Halt bis 45,58 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Whoosh hoch, Pop hoch, Chime, Pop | M-007 |

**Textregel-Prüfung** (neue Textblöcke ohne Untertitel, `make_beats.py`): Abstände 3,66 / 3,68 / 2,35 / 1,40 / 1,84 / 1,69 / 1,33 / 1,90 / 1,25 / 2,49 / 1,89 / 1,96 / 1,75 / 2,20 / 1,26 / 1,29 / 1,35 / 1,25 / 2,27 / 1,75 / 2,08 s → alle ≥ 1,2 s. Karten/Stempel ≤ 4 Wörter (Ausnahme: feste Hook-Frage; Screenshots ≤ 10 lesbare Wörter, Prompt in Shot 01 nur Textur). Einzige Gleichzeitigkeit: Frame 0 (Hook-Frage + Beschriftung TESTREGION CHEMNITZ), wie Folge 10/11.
**Stempel-Wörter aus dem Lauf:** GANZ ALLEINE. (Serie), MENSCH (Prompt Lauf 12 / Datei Lauf 11), TESTREGION CHEMNITZ (Datei-Blatt + Chat), BRANCHENVERZEICHNIS (Datei-Spalte), STELLT EIN / laut Anzeige (Blatt Top 5: „Sucht laut Anzeige … Wer einstellt“), BEIM KUNDEN SICHTBAR (Blatt Top 5, Rang 1, Grund 3).
**Weg-Beat:** 01 15,95–17,85 (1,90 s, deckt „angehängt“), 07 17,85–19,10 (1,25 s, deckt „Websuche“ 18,18–18,83), 06 19,10–21,14 (2,04 s, deckt „Excel-Liste“) ✓.
**Hook 0–6 s:** jedes 0,5-s-Fenster hat ein Ereignis (Prüfung `make_beats.py`: keine Lücke).
**M-009 (≤ 1,5 s ohne Änderung):** längste Strecken 21,59 → 23,48 (Halt nach der Entscheidung, Check auf „ansprechen“ 22,03 → 1,45 s) und Endkarte 42,37 → 45,58 (Bot-Hüpfer ~44,0 einplanen).

## Shots (nur design/lauf/, Ausschnitte in Original-px, Details in beats.json → shots)
- **liste-anonym.png** (2850 × 1362, Story-Objekt): Spalten-x Nr 30–80, Firma 80–373 („Betrieb N“), Gewerk 373–701, Ort 701–931, Adresse 931–1243 (Balken), Größenangabe 1243–1530, **Art der Größenquelle 1530–1753**, Quelle 1753–2115 (Balken), Weitere Quelle 2115–2392, Top-5-Rang 2392–2490, Hinweis 2490–2820. Zeilen-y Kopf 68–128, dann 128/188/247/307/367/427/486/546/606/666/726/785/845/905/965/1025/1084/1144/1204/1264/1300. Gelb (Top 5): Zeilen 19 (Rang 1), 17 (2), 20 (3), 2 (4), 6 (5). „Branchenverzeichnis“ exakt: Zeilen 1–16 und 18 (= 17); Zeile 17 „Branchenverzeichnis + eigene Website“ zählt **nicht** (Datei-Formel: 3 mit anderer Quelle).
- **01-prompt-mit-anhang.png**: crop x 36 y 34 w 984 h 640; lesbar nur Anhang-Karte (x 52 y 52 w 180 h 178), „+“ bei x 52 y 622; Prompt Textur; Fußzeile nie.
- **07-schritte-zeile.png**: nur Zeile y 168–208.
- **06-datei-karte.png**: crop x 20 y 12 w 790 h 102.
- **02-region-begruendung.png**: optional, nur bis y 190 (Titel + Grund 1 bis „38,4.“); Hamburg-Zeile beginnt danach → lieber weglassen.
- **04-top5-gruende-anonym.png**: optional Beleg-Kacheln (Bänder „Zuerst ansprechen würde ich“, „sucht gerade einen Maler“), nicht zum Lesen.
- Nie: liste-ansicht.png, 03/04/05/08 ohne „-anonym“, PLZ/Straßen/Telefon, claude.ai-Sidebar.

## Ton
- Musik: GONE-Original (wie Folge 8–11) ab **328,0 s**, 45,58 s am Stück bis 373,58 s, nie geloopt. Keine Überschneidung mit Folge 9 (276,36–322,9), 10 (57,325–103,755), 11 (153,15–198,94); Vortag Folge 7 nutzte 327,63 (Vortags-Wiederverwendung wie Folge 8/10/11). Tabu 200–276 und „shit“-Stellen ~20,2 / ~107 außerhalb. Suche `regie/musik_suche.py`.
- **Explizit-Check:** `node scripts/music-explicit-check.mjs .env runs/firma-tag12/regie/musik-abschnitt.mp3` 2× → **0 explizite Wörter** („I said go / Thank you for the love … the joy / But I don't ever wanna fall in love again / Thank you for your time … your mind“).
- Struktur: ruhiger Einstieg (Faktor 0,032), natürliche Mulde 20,35–20,55 im Stück + Kurven-Mulde 20,2–20,72 in der Pause vor „Fünf“, Akzent 20,85 auf „Fünf“ (20,80), ab Warum leiserer Teil (Faktor 0,042).
- Kurve (audio.musicCurve): [0, 0.032] [19.9, 0.032] [20.2, 0.016] [20.72, 0.016] [20.8, 0.055] [21.5, 0.03] [23.3, 0.03] [23.6, 0.042] [44.58, 0.042] [45.58, 0].
- Abstand Stimme ↔ Musik je Akt (`regie/gap.py`, `regie/gap-final.txt`): Hook 22,4 · Rückblick 21,5 · Heute 18,6 · Claude-Weg 17,9 · Entscheidung 18,4 · Warum 21,9 · Haken 20,1 · Als Nächstes 21,6 · CTA 26,4 dB (jeder Akt ≥ 15 ✓). firma-mix misst nach dem Render neu, Ziel −14 LUFS, TP −1.
- SFX: Palette wie Folge 8 (`beats.json → sfx_dateien`), Stempel nur Clack/Stamp, Zähler mit Roll, keine Boom-/Sub-Hits, Whooshes 0,18–0,22.

## Hinweise an firma-design
1. **Story-Objekt Karte + Liste:** Karte nur mit „Chemnitz“ als Ortsname, Pins auf Ort-Ebene (keine Straßen). Liste ausschließlich `liste-anonym.png`, Balken bleiben schwarz. Frame 1: Liste nur Textur.
2. **Board:** Layout tag11 (9 Felder). done 0–3, WEBSITE „ENTWURF“ (nie grün), GEWERBE offen mit MENSCH + Personen-Symbol (kein Haken), BETRIEBE current (gold ab Ende „Mensch.“), WERBEBRIEF „?“ im Übergabe-Beat. Kein Umsatz-Zähler.
3. **Region-Karte (Pflicht):** „50 STATT 38“ groß + Quellzeile klein, ≥ 1,3 s (14,62–15,95). Shot 02 nur ohne Hamburg-Zeile oder gar nicht.
4. **Entscheidung:** lesbar nur Rang + erstes Gewerk-Wort je gelber Zeile (≤ 12 Wörter).
5. **Haken:** genau 17 Zellen (Zeilen 1–16, 18) leuchten, 17/19/20 grau; Zähler „17 VON 20“, nie „vier“/„16“.
6. **Endkarte:** zwei Blöcke („FRAGE + LISTENVORLAGE“, „FIRMENKUNDEN IN 10 MINUTEN“), weil „Frage“ → „Listenvorlage“ nur 0,5 s auseinander liegen.

## Auffälligkeiten für Chef/Autor (nichts am Skript geändert)
- STT-Falle „Websuche“: Nach „Claude:“ hört scribe bei längerer Pause „Websearch“ (Aussprache ist deutsch, u-Formanten belegt). Gelöst über die rohe 0,13-s-Pause nach „Claude:“; Prüfer kann das mit `regie/stt-final*.json` nachvollziehen.
- Chattext Lauf 12 sagt „16 … nur Cosuno / bei vier genauer“, Datei zählt 17/3. Skript („meist“) und Bild (17 VON 20) folgen der Datei.
- hooks.md nennt „Auftrag Chef 21:00“, briefing/thema 18:00 → Regie nimmt 18:00.
- Musik für Folge 13: Heute ist kein freier GONE-Bereich ≥ 45,6 s mehr übrig (frei nur 108,5–153,15 = 44,65 s). Folge 13 braucht einen Vortags-Bereich oder ≤ 44,65 s Gesamtlänge.
