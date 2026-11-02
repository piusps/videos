# Regieplan · Folge 14 „Empfängerliste“ (Serientag 4, **nicht** erste Folge des Tages, Slot 2026-10-31 ~12:00, Eilauftrag)

firma-regie, 2026-10-31. Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag14/`), `beats.json` (erzeugt von `regie/make_beats.py`), `musik.txt`, Bibel-Zeile (`wirtschaftsbuch-v2.md`, `regie/bibel_eintrag.py`). Arbeitsdateien/Tests in `regie/`. Keine Grafik, kein Render.

## Messwerte
| Messung | Wert | Vorgabe |
|---|---|---|
| Länge voice.mp3 | **45,03 s** (letztes Wort endet 44,71) + 1,0 s Endkarte = **45,7 s** (`beats.json seconds`) | 40–48 s ✓ |
| Sprechtempo | **130,0 wpm** über die Folge inkl. Endkarte (99 / 45,7 s); nur voice.mp3 131,9 wpm | 120–135 ✓ |
| Rückblick „Die“ → Ende „steht.“ | **6,19 s** (6,25–12,44) | ≤ 6,5 s ✓, nicht beschleunigt |
| „Heute“ beginnt bei | **13,14 s** | ≤ 14,5 s ✓ (Puffer 1,36 s) |
| Tempo TTS | 1,0 überall, kein atempo | ✓ |
| STT (scribe_v1, de) Endfassung | **15/15 Läufe 99/99 Wörter identisch** mit script.txt (12 Läufe auf der bytegleichen Variante `regie/var/t12-g035*.mp3` + 3 auf `voice.mp3`, `regie/voice.stt*.json`) | ✓ |
| Musik explizit | **0** (2 Läufe auf dem Abschnitt mit Mute), Mute im Stem −91 dB | ✓ |
| Pausen | keine > 0,7 s außer vor dem Warum (0,75 s Stille „Verzeichnisse. → Warum?“) | ✓ |

## Storyline-Check (Bibel v2 + Kette)
- Folge 13 endet mit „Als Nächstes: Wohin gehen die Briefe?“ → Folge 14 „Heute sucht sie Adressen für fünf Briefe.“ Rückblick-Satz 2 „Der Werbebrief steht.“ = Ergebnis Folge 13. Kein „Tag“, kein „gestern“ (nicht erste Folge des Tages).
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Nichts abgeschickt. GEWERBE weiter offen (Mensch), WEBSITE weiter „Entwurf“.
- Board: Folge 13 hatte 9 Felder ohne Adress-Schritt. Vorschlag `beats.json plan_vorschlag`: neues Feld ADRESSEN (Index 8), ERSTER UMSATZ → 9, Indizes 0–7 unverändert; WERBEBRIEF wird im Rückblick abgehakt. Fallback, falls 9 Felder bleiben müssen: WERBEBRIEF bleibt current mit Unterzeile „ADRESSEN“ (Entscheidung Chef/Design).
- Übergabe Folge 15: „Welche Adresse stimmt?“ (Widerspruch-Betrieb). Kein Widerspruch zu früheren Folgen, kein Ticket an firma-autor.

## Stimme
- Serienstimme Keno `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **Tempo 1,0** (`regie/el.mjs` = Settings von `scripts/eleven-tts.mjs`). TTS-Text `regie/script-tts.txt` = script.txt (keine Sonderschreibung nötig).
- 6 Volltakes (`regie/voice-raw1–6.mp3`): **alle** im STT mit „probiere“ und „schicke“ (bekanntes Problem, Lehre 13). Take 4 ist der langsamste (Mitte 21,75 s reine Sprechzeit) und der einzige mit steigendem „Warum?“ (111 → 291 Hz) **und** steigendem „stimmt?“ (162 → 219 Hz); Take 1 „Warum?“ fällt, Take 3 „stimmt?“ fällt.
- **Zusammenbau (`regie/assemble.py`, gleiche Stimme/Settings, Schnitte nur in Stille an Satzgrenzen, 3-ms-Fades):**
  - A Eröffnung bis „aus.“ = **Folge 12 `voice.mp3`** (veröffentlicht, STT-sauber „probier“). Getestet gegen Folge 10/11-Eröffnung und 8 neue Eröffnungs-Takes (`regie/retake/`) im Kontext der ganzen Datei (`regie/sttmany.mjs`, `regie/var/`): Folge 10/11 0/5, neue Takes 0–4/4, Folge 12 + 0,35 s Naht 12/12.
  - 0,35 s | B Rückblick „Die … steht.“ = Take 6 (kürzester Rückblick, 6,19 s nach Pausenkürzung)
  - 0,70 s | C „Heute … stimmt?“ = Take 4
  - 0,70 s | D CTA = Betonungs-Take `regie/betonung/cta2.mp3` (STT „schick“), −0,9 dB an die Mitte angeglichen.
  - Pegel A/B/C/D −17,2 / −16,7 / −17,2 / −16,9 dB RMS.
- words.json: Zeiten aus TTS-Alignment (A aus Folge-12-words.json), durch Schnitte/Pausen verschoben, Wortenden auf Stille nachgezogen (`regie/snap_words.py`). Caption-Ziffern: hundert → 100, fünf → 5, zwei → 2, zehn → 10. 99 Wörter.
- **Für spätere Änderungen nach firma-pruefer (Lehre 10):** nur den betroffenen Teil neu erzeugen und in `regie/assemble.py` ersetzen; Eröffnung (A) und Rückblick (B) bleiben dann unverändert.

### Betonungstest (Satzkontext, Tempo 1,0; `regie/betonung.mjs`, je 2 Takes in `regie/betonung/`, Silben `regie/stress14.py`, Kontur `regie/contour.py`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| „Claude:“ | STT „Claude“ in allen Läufen; Pause „Claude: → Brief“ roh gelassen (0,24 s in der Endfassung, Lehre 12) | ok |
| Websuche | isoliert STT 2/2 „Websearch“ (kurzer Testsatz), im Volltext Take 4 in 15/15 Endläufen „Websuche“; in 2 von 60 Varianten-Läufen „Websearch“ (andere Eröffnung) | ok, **Restrisiko** |
| Excel-Datei | STT korrekt 2/2 + 15/15; DA-/-tei tragen | ok |
| Impressum | Tonhöhengipfel und längste Silbe auf -PRES- (154/158 Hz vs 109–116, 0,21 s vs 0,08–0,10 s) = Im-PRES-sum | ok |
| Verzeichnisse | -ZEICH- trägt (157/133 Hz, längste Silbe) | ok |
| Warum? / stimmt? | Take 4 beide steigend (s. o.) | ok |
| Eindeutig | EIN- trägt (Dauer 0,22 s) | ok |
| Kommentiere „Adresse“ | kom-men-TIE-re (höchster Ton 211 Hz in cta2); STT „Kommentiere Adresse“ (Anführungszeichen = Schreibweise) | ok |
| Tabellenvorlage | Ta-BEL-len: -bel- längste Silbe, -vor- trägt im Kompositum | ok |
| Empfängerliste | emp-FÄN-ger (korrekt), -liste fällt am Satzende | ok |
Kein Wort musste umgeschrieben werden.

### Pausen (Stille < −45 dBFS; Karte `regie/assemble.py`)
| Stelle | roh | neu |
|---|---|---|
| aus. → Die (Naht A/B, Rückblick) | – | 0,35 |
| Betriebe, → bestickt | 0,36 | 0,15 |
| Bestellung. → Der Werbebrief (Rückblick ≤ 6,5 s) | 0,36 | 0,15 |
| steht. → Heute (Naht B/C, Fahrt zu ADRESSEN) | – | 0,70 |
| Briefe. → Claude (neuer Akt) | 0,64 | 0,65 |
| Claude: → Brief | 0,36 | roh (Lehre 12) |
| angehängt, → Websuche (Shot 01 → 07) | 0,03 | 0,35 |
| Websuche, → Excel-Datei (Shot 07 → 06) | 0,10 | 0,35 |
| Excel-Datei. → Sie (Entscheidung) | 0,59 | 0,65 |
| **Verzeichnisse. → Warum?** | 0,61 | **0,85** (Stille gemessen 0,75) |
| Warum? → Es | 0,42 | 0,55 |
| Pflicht. → Der Betrieb (Karte 1 → 2) | 0,24 | 0,45 |
| selbst. → Verzeichnisse (Grund → Befund) | 0,08 | 0,55 |
| Adressen. → Der Haken | 0,45 | 0,65 |
| Haken: → Eindeutig | 0,16 | 0,30 |
| eine. → Als Nächstes | 0,25 | 0,65 |
| Nächstes: → Welche | 0,15 | 0,30 |
| stimmt? → Kommentiere (Naht C/D) | – | 0,70 |
| „Adresse“, → ich | 0,09 | 0,35 |
| Tabellenvorlage. → Damit | 0,20 | 0,60 |

## Akte (roter Faden)
Durchgehendes Story-Objekt: **die echte Empfängerliste** (Claudes xlsx bzw. `design/lauf/02-empfaenger-tabelle-anonym.png`, Namen/Adressen schwarz, Status-Chips Belegt/Prüfen/Widerspruch). Frame 1 zeigt sie, im Heute-Beat ist das leere Empfängerfeld des Briefs ihre Lücke, in der Entscheidung liegt sie klein neben den Quellen-Karten, im Haken kommt sie groß zurück (Status-Spalte), in der Übergabe fährt die Kamera auf die Widerspruch-Zeile, in der Endkarte ist sie die Vorlage.
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook | 0–6,25 | Liste groß mit Status-Chips, Brief klein | hook (Story-Objekt) |
| 2 Rückblick | 6,25–13,14 | Gründungsplan, Produkt-Karte, WERBEBRIEF abgehakt, Fahrt zu ADRESSEN | recap |
| 3 Heute | 13,14–16,00 | Feld ADRESSEN → Brief mit leerem Empfängerfeld ×5 | Story-Objekt |
| 4 Claude-Weg | 16,00–20,55 | echte Shots 01 → 07 → 06 | claudeShot ×3 |
| 5 Entscheidung | 20,55–23,97 | Karten IMPRESSUM · VERZEICHNISSE, Stempel IMPRESSUM | Karten |
| 6 Warum | 23,97–31,86 | Impressum-Karte oben, 3 Karten nacheinander | why |
| 7 Haken | 31,86–35,09 | Liste groß, Status-Spalte, Stempel NUR EINE BELEGT | Story-Objekt |
| 8 Als Nächstes | 35,09–38,06 | Widerspruch-Zeile mit „?“ | question |
| 9 CTA | 38,06–45,70 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json; Anker immer Wort + after (beats.json). Neue Textblöcke ≥ 1,2 s auseinander (kleinster Abstand 1,23 s), Karten ≤ 4 Wörter.

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,74 | Wie viel Umsatz | **Frame 1 = Ergebnis:** Hook-Frage ab Frame 0; Empfängerliste mit Chips 1× grün, 3× gelb, 1× rot; Brief klein mit leerem Empfängerfeld; Marker-Wisch über die grüne Zeile auf „Umsatz“ | Push-in, Drop-Punch | Warum nur eine grün? | Pop, Whoosh, Page, Bump; Musik stumm bis 0,75 | M-002 |
| 0,74–3,38 | macht ein Unternehmen … lang | nur Ereignisse: Chips pulsen nacheinander, Empfängerfeld blinkt, Punch „100“, Licht-Sweep | atmet | Was ist das für eine Liste? | Ticks, Pops | 0,5-s-Regel |
| 3,38–4,95 | ganz alleine führt? | Stempel GANZ ALLEINE.; Puls grüne Zeile in der Pause | Punch-in 4 % | Wirklich ohne Mensch? | Clack, Bump | M-011 |
| 4,95–6,25 | Ich probier das aus. | Liste raus, Gründungsplan ein, Maskottchen hüpft; kein TAG-Slam | Pull-back | Was ist das Experiment? | Whoosh, Pop, Klick | Serienrahmen |
| 6,25–9,69 | Die Firma … kleine Betriebe, | Board voll, Karte SHIRTS MIT LOGO, Handwerker-Silhouetten | ruhig | Worum geht es? | Whoosh, Pop | Rückblick |
| 9,69–11,40 | bestickt erst auf Bestellung. | Banner „erst auf Bestellung bestickt“ | steht | Ohne Lager? | Page | Rückblick |
| 11,40–13,14 | Der Werbebrief steht. | WERBEBRIEF leuchtet, Haken auf „steht.“, Brief-Miniatur; Fahrt zu ADRESSEN (gold) in der Pause | Push-in, Fahrt | Und wer bekommt ihn? | Power, Check, Whoosh | Rückblick |
| 13,14–16,00 | Heute sucht sie Adressen für fünf Briefe. | Pill HEUTE: ADRESSEN; Empfängerfeld pulst; auf „5“ fächern 5 Brief-Kopien auf | Fahrt auf den Brief | Woher – und stimmen die? | Chime, Tick, Page | Heute |
| 16,00–17,66 | Claude: Brief angehängt, | Shot 01, Rahmen DOCX-Karte, Zeiger auf „+“ | Push-in | Womit fängt sie an? | Page, Pop, Klick | M-004 |
| 17,66–18,91 | Websuche, | Shot 07 Zeile „… das Web durchsucht …“, Glanz | Push-in | Wo sucht sie? | Whoosh kurz, Typing | M-004 |
| 18,91–20,55 | Excel-Datei. | Shot 06 Datei-Karte XLSX, Klick | Push-in, Halt | Woher die Adressen? | Pop, Klick | M-004 |
| 20,55–23,97 | Sie nimmt das Impressum, nicht Verzeichnisse. | Karten IMPRESSUM · VERZEICHNISSE; Stempel IMPRESSUM; VERZEICHNISSE gestrichen; Halt in der Mulde | Push-in, Halt | Warum das Impressum? | Power, Clack, Tick; Musik-Mulde 0,022 | M-011 |
| 23,97–26,77 | Warum? Es ist Pflicht. | Pill WARUM?; Karte 1 IMPRESSUM IST PFLICHT (unter: Anschrift muss rein) | Fahrt zu den Karten | Warum stimmt das eher? | Airy, Pop; Akzent im Stück | Warum-Beat |
| 26,77–28,28 | Der Betrieb pflegt es selbst. | Karte 2 PFLEGT ER SELBST (vs: Verzeichnis übernimmt ✗); Haken an Impressum-Karte | leichter Push-in | Und die Verzeichnisse? | Pop, Check | Warum-Beat |
| 28,28–31,86 | Verzeichnisse hatten bei zwei Betrieben frühere Adressen. | Karte 3 VERZEICHNIS: FRÜHERE ADRESSEN (unter: bei 2 von 5); 2 von 5 Punkten heben sich, alte Etiketten | Push-in, Halt | Sind die Impressums-Adressen alle sicher? | Pop, Tick, Roll | Warum-Beat |
| 31,86–35,09 | Der Haken: Eindeutig belegt ist nur eine. | Liste groß, Chips leuchten nacheinander; Marker grüne Zeile; Stempel NUR EINE BELEGT auf „belegt“ | Push-in Status-Spalte | Und die anderen? | Whoosh, Roll, Page, Clack | M-011 |
| 35,09–38,06 | Als Nächstes: Welche Adresse stimmt? | Pill ALS NÄCHSTES; Widerspruch-Zeile, zwei unlesbare Etiketten + „?“; Karte WELCHE ADRESSE STIMMT? auf „Adresse“ | Push-in, Halt | Impressum oder die andere? | Airy, Pop, Tick | Übergabe |
| 38,06–45,70 | Kommentiere „Adresse“ … Empfängerliste. | Endkarte: Keyword Adresse, FRAGE + TABELLENVORLAGE, EMPFÄNGERLISTE IN 10 MINUTEN, Puls; Bot-Hüpfer 45,2 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Chime, Tick; Musik 0,06 → 0 | M-007 |

## Ton-Regie
Musik siehe `musik.txt` (GONE ab 106,65 s, 45,7 s, musicMute 0–0,75 s, 0 explizite Wörter, frei gegenüber Folgen 9–13). Leiser Einstieg (Musik erst ab 0,75 s), Mulde vor dem Warum, Akzent auf „Warum?“, Endkarte etwas lauter, Fade. SFX abwechslungsreich (Pop/Tick/Clack/Check/Chime/Page/Roll/Power/Airy, keine schweren Whooshes). Abstand Stimme–Musik je Akt ≥ 16,1 dB. Ziel −14 LUFS (firma-mix).

## Risiken
- „Websuche“: im kurzen Testsatz 2/2 „Websearch“, in der Endfassung 15/15 korrekt. Bei jedem Neusprechen der Mitte erneut im Volltext prüfen.
- STT-Entscheidung „probier/schick“ hängt an der Eröffnung: nur die Folge-12-Eröffnung mit 0,35-s-Naht ist stabil. Naht nicht verlängern.
- Board-Feld ADRESSEN ist ein Vorschlag (Nummerierung ERSTER UMSATZ ändert sich).
- Grund 1 hat keinen belegten Gegenwert (bewusst leer, nichts erfinden).
