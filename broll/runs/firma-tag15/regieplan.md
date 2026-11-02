# Regieplan · Folge 15 „Welche Adresse stimmt?“ (Serientag 4, **nicht** erste Folge des Tages, Slot 2026-10-31 15:00)

firma-regie, 2026-10-31. Grundlage: script.txt nach Autor-Runde 2 (`pruefung/autor-runde2-kurz.md`, 100 Wörter). Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag15/`), `beats.json` (`regie/make_beats.py`), `musik.txt`, Bibel-Zeile (`wirtschaftsbuch-v2.md`, `regie/bibel_eintrag.py`). Arbeitsdateien/Tests in `regie/`. Keine Grafik, kein Render.

## Messwerte
| Messung | Wert | Vorgabe |
|---|---|---|
| Länge | voice.mp3 **44,40 s**, letztes Wort endet 44,01 + 1,0 s Endkarte = **45,0 s** (`beats.json seconds`) | 40–48 s ✓ |
| Sprechtempo | **133,3 wpm** über die Folge inkl. Endkarte (100 / 45,0 s); nur voice.mp3 135,1 wpm | 120–135 ✓ (voice-only an der Kante, 100 Wörter) |
| Rückblick „Die“ → Ende „sicher.“ | **5,97 s** (6,25–12,22) | ≤ 6,5 s ✓, nicht beschleunigt |
| „Heute“ beginnt bei | **13,03 s** | ≤ 14,5 s ✓ |
| Tempo TTS | 1,0 überall, kein atempo | ✓ |
| STT (scribe_v1, de) Endfassung | **17/17 Läufe 100/100 Wörter identisch** mit script.txt (11 Läufe auf der bytegleichen Variante `regie/var/c2-0.2*.mp3`, 6 auf `regie/var/final2.mp3` = voice.mp3; `regie/voice.stt0–5.json`) | 0 Abweichungen ✓ |
| Musik explizit | **0** (2 Läufe auf dem Abschnitt), kein Mute nötig | ✓ |
| Pausen > 0,7 s | „Impressum. → Warum?“ 0,89 (gewollt); Nähte „sicher. → Heute“ 0,82 und „Brief? → Kommentiere“ 0,83 (Akt-Wechsel mit Kamerafahrt bzw. Endkarte) | siehe Risiken |

## Storyline-Check (Bibel v2 + Kette)
- Folge 14 endet mit „Als Nächstes: Welche Adresse stimmt?“ → Folge 15 „Heute prüft sie die Adressen.“ Rückblick-Satz 2 „Fünf Briefe, einer sicher.“ = Ergebnis Folge 14 (nur eine Adresse eindeutig belegt). Kein „Tag“, kein „gestern“.
- Eingabe = Excel aus Lauf 14 (unverändert angehängt). Ergebnis: 4 × Versand „Ja“, 1 × „Ja mit Vorbehalt“ (PLZ). Widerspruch geklärt über North Data (nicht amtlich, gesprochen „Laut Firmendatenbank“).
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Nichts gedruckt, nichts verschickt (Drucken/Porto = Mensch, nur Caption). GEWERBE weiter offen, WEBSITE „Entwurf“.
- Board: `public/firma-ep/tag14/episode.json` gab es beim Regie-Lauf noch nicht (nur voice/words). Anschluss deshalb an `firma-tag14/beats.json plan_vorschlag` (ADRESSEN = Index 8 current). Folge 15: ADRESSEN bleibt current, Haken im Ergebnis-Beat (Vorschlag, gelber Punkt für den PLZ-Vorbehalt). Design gleicht mit tag14/episode.json ab, sobald vorhanden.
- Übergabe Folge 16: „Wie kommen die Adressen in den Brief?“ (Serienbrief aus Brief Folge 13 + Liste Folge 15). Kein Widerspruch zu früheren Folgen, kein Ticket an firma-autor.

## Stimme
- Serienstimme Keno `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **Tempo 1,0** (`regie/el.mjs`, jetzt mit 429-Retry wegen Concurrency-Limit). TTS-Text `regie/script-tts.txt` = script.txt.
- 6 Volltakes (`regie/voice-raw1–6.mp3`): STT sauber 2, 4, 5; Take 1/3/6 „probiere“, 1/3 „schicke“, 3 „Websearch“.
- **Zusammenbau (`regie/assemble.py`, Schnitte nur in Stille an Satzgrenzen, 3-ms-Fades):**
  - A Eröffnung bis „aus.“ = **Folge 12 `voice.mp3`** (stabile Eröffnung wie Folge 14)
  - 0,35 s | B Rückblick „Die … sicher.“ = **Take 6** (kürzester Rückblick, Pausen Betriebe/Bestellung roh 0,07/0,12 statt verlängert)
  - 0,70 s | C „Heute … Brief?“ = **Take 4** (langsamster Take, „Warum?“ steigt 86 → 216 Hz)
  - 0,70 s | D CTA = Betonungs-Take `regie/betonung/cta1.mp3` (STT „schick“), Pegel auf C angeglichen.
  - Pegel A/B/C/D −17,2 / −16,6 / −16,8 / −16,8 dB RMS.
- **„Websuche“:** Pause „angehängt, → Websuche.“ bei 0,30 s → STT 3/6 „Websearch“; roh 0,08 → 1/5; **0,20 s → 17/17 sauber** (gewählt). Varianten in `regie/var/`.
- words.json: Zeiten aus TTS-Alignment (A aus Folge-12-words.json), durch Schnitte verschoben, Wortgrenzen auf Stille gezogen (`regie/snap_words.py`). Caption-Ziffern: hundert → 100, Fünf → 5, Vier → 4, zehn → 10. 100 Wörter.
- **Für spätere Änderungen (Lehre 10):** nur den betroffenen Teil neu erzeugen und in `assemble.py` ersetzen; A und B bleiben. Achtung: jede Änderung an C/D oder an Nähten braucht neue STT-Serie (eine Naht-Variante G2 0,6 kippte 2/8 Läufe).

### Betonungstest (Satzkontext, Tempo 1,0; `regie/betonung.mjs`, je 2 Takes in `regie/betonung/`, Silben `regie/stress15.py`)
| Wort (thema.md + Prüfer H-3) | Ergebnis | Entscheidung |
|---|---|---|
| „Claude:“ | STT „Claude“ in allen Läufen; Pause „Claude: → Liste“ roh (0,17 s) | ok |
| Fünf Briefe, einer sicher | Komma als kurze Pause (BRIE-fe, 0,40 s), EI-ner, STT 2/2 | ok |
| Impressum | -PRES- längste Silbe (0,20 s) | ok |
| Register / Register-Abschrift | -GIS- trägt (0,17 s, im Kompositum 224 Hz Gipfel); Bindestrich keine Pause; STT „Registerabschrift“ (= Schreibweise) | ok |
| Firmendatenbank | FIR- höchster Ton (219 Hz), Kompositum flüssig, STT 2/2 | ok |
| Eintrag | EIN- trägt | ok |
| Postleitzahl-Check | POST- trägt, „Check“ englisch; STT „Postleitzahlcheck“ (= Schreibweise) | ok |
| Kommentiere „Versand“ | kom-men-TIE-re (221 Hz), Ver-SAND (0,37 s); STT ohne Anführungszeichen | ok |
| Prüffrage | PRÜF- längste Silbe | ok |
| „Wie kommen die Adressen in den Brief?“ | Endton der Frage schwach steigend (Messung unsicher) | ok, **Restrisiko** |
| „streiten“ | entfällt nach Autor-R2 | – |
Kein Wort musste umgeschrieben werden.

### Pausen (Stille < −45 dBFS; `regie/assemble.py`)
| Stelle | roh | neu |
|---|---|---|
| aus. → Die (Naht A/B) | – | 0,35 |
| Betriebe, → bestickt | 0,33 | 0,07 (roh-Ziel) |
| Bestellung. → Fünf | 0,35 | 0,12 |
| sicher. → Heute (Naht B/C, Fahrt) | – | 0,70 (Wortlücke 0,82) |
| Adressen. → Claude | 0,12 | 0,70 |
| Claude: → Liste | 0,17 | roh |
| angehängt, → Websuche | 0,08 | 0,20 |
| Websuche. → Ein | 0,37 | 0,70 |
| Betrieb: → Impressum | 0,15 | 0,35 |
| Register. → Sie | 0,48 | 0,70 |
| **Impressum. → Warum?** | 0,44 | **0,90** |
| Warum? → Die | 0,54 | 0,65 |
| alt. → Laut | 0,26 | 0,65 |
| Impressum. → Vier | 0,49 | 0,70 |
| raus, → einer | 0,14 | 0,40 |
| Postleitzahl-Check. → Als | 0,61 | 0,70 |
| Nächstes: → Wie | 0,34 | 0,35 |
| Brief? → Kommentiere (Naht C/D) | – | 0,70 (Wortlücke 0,83) |
| „Versand“, → ich | 0,08 | 0,40 |
| Prüffrage. → Damit | 0,09 | 0,70 |

## Akte (roter Faden)
Durchgehendes Story-Objekt: **die Empfängerliste mit Spalte Versand** (lokal aus Claudes neuer xlsx, Namen/Adressen schwarz). Frame 1 zeigt sie fertig (4 × Ja, 1 × Vorbehalt), im Rückblick sind es fünf Briefe mit einem Haken, im Ergebnis kommt sie groß zurück, in der Übergabe liegt sie neben dem Brief, in der Endkarte ist sie die Miniatur.
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook | 0–6,25 | Liste groß, Versand-Spalte, Briefstapel klein | hook (Story-Objekt) |
| 2 Rückblick | 6,25–13,03 | Gründungsplan, Produkt-Karte, 5 Briefe (1 ✓) an ADRESSEN | recap |
| 3 Heute | 13,03–15,18 | 4 Briefe mit „?“, Lupe | Story-Objekt |
| 4 Claude-Weg | 15,18–18,12 | echte Shots 01 → 07 | claudeShot ×2 |
| 5 Streit | 18,12–21,19 | Karten IMPRESSUM ≠ REGISTER | Karten |
| 6 Entscheidung | 21,19–23,23 | Stempel IMPRESSUM, Musik-Mulde | Karten |
| 7 Warum | 23,23–31,09 | Impressum-Karte oben, 2 Karten nacheinander (Beleg Shot 05-anonym) | why |
| 8 Ergebnis | 31,09–34,68 | Liste groß, Versand-Chips, PLZ PRÜFEN | Story-Objekt |
| 9 Als Nächstes | 34,68–37,85 | Brief + Liste + „?“ | question |
| 10 CTA | 37,85–45,0 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json; Anker Wort + after (beats.json). Neue Textblöcke ≥ 1,2 s auseinander (kleinster Abstand 1,23 s), Karten ≤ 4 Wörter.

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,74 | Wie viel Umsatz | **Frame 1 = Ergebnis:** Hook-Frage ab Frame 0; Excel-Liste, Versand 4 × Ja grün, 1 × Vorbehalt gelb; Briefstapel; Marker-Wisch auf „Umsatz“ | Push-in, Drop-Punch | Wer darf raus? | Pop, Whoosh, Page, Bump | M-002 |
| 0,74–3,38 | macht … lang | nur Ereignisse: Chips pulsen, gelber Chip wackelt auf „100“, Licht-Sweep | atmet | Warum einer gelb? | Ticks, Pops | 0,5-s-Regel |
| 3,38–4,95 | ganz alleine führt? | Stempel GANZ ALLEINE. | Punch-in 4 % | Wirklich ohne Mensch? | Clack, Bump | M-011 |
| 4,95–6,25 | Ich probier das aus. | Liste raus, Gründungsplan ein, Maskottchen; kein TAG-Slam | Pull-back | Was ist das Experiment? | Whoosh, Pop, Klick | Serienrahmen |
| 6,25–9,41 | Die Firma … Betriebe, | Board, Karte SHIRTS MIT LOGO, Handwerker-Silhouetten | ruhig | Worum geht es? | Whoosh, Pop | Rückblick |
| 9,41–10,79 | bestickt erst auf Bestellung. | Banner „erst auf Bestellung bestickt“ | steht | Ohne Lager? | Page | Rückblick |
| 10,79–13,03 | Fünf Briefe, einer sicher. | 5 Brief-Miniaturen fächern an ADRESSEN auf, 1 grüner Haken, 4 grau „?“ | Push-in auf ADRESSEN | Und die anderen vier? | Page, Check, Whoosh | Rückblick |
| 13,03–15,18 | Heute prüft sie die Adressen. | Pill HEUTE: ADRESSEN PRÜFEN; Lupe über den 4 Briefen | Fahrt auf die Briefe | Wie prüft sie das? | Chime, Tick | Heute |
| 15,18–16,74 | Claude: Liste angehängt, | Shot 01, Rahmen XLSX-Karte, Zeiger auf „+“ | Push-in | Womit fängt sie an? | Page, Pop, Klick | M-004 |
| 16,74–18,12 | Websuche. | Shot 07 Zeile „… das Web durchsucht …“, Glanz | Push-in | Wo sucht sie? | Whoosh kurz, Typing | M-004 |
| 18,12–21,19 | Ein Betrieb: Impressum gegen Register. | Karten IMPRESSUM ≠ REGISTER (Adressen schwarz), 1 Betriebs-Icon | Push-in | Welche stimmt? | Whoosh, Pop hoch/tief | Streit |
| 21,19–23,23 | Sie glaubt dem Impressum. | Stempel IMPRESSUM auf „Impressum“, REGISTER dimmt; Halt in der Mulde | Push-in, Halt | Warum dem Impressum? | Power, Clack; Musik-Mulde (Stück pausiert) | M-011 |
| 23,23–26,51 | Warum? Die Register-Abschrift war alt. | Pill WARUM?; Karte ABSCHRIFT VON 2014 (unter: Ersteintragung); Blatt vergilbt auf „alt“ | Fahrt zu den Karten | Woher weiß sie das? | Airy, Pop, Roll; Stück setzt auf „Warum?“ ein | Warum-Beat |
| 26,51–31,09 | Laut Firmendatenbank bestätigt ein neuerer Eintrag das Impressum. | Karte EINTRAG 2015: IMPRESSUM (unter: gelesen bei North Data; vs: Abschrift 2014 ✗); Pfeil zur Impressum-Karte, Haken | Push-in, Tilt | Und die anderen Briefe? | Whoosh kurz, Pop, Tick, Check | Warum-Beat |
| 31,09–34,68 | Vier Briefe können raus, einer nach Postleitzahl-Check. | Liste groß: 4 Ja-Chips grün nacheinander, 4 Briefe fliegen aus dem Stapel; gelber Chip; Karte PLZ PRÜFEN; ADRESSEN-Haken | Push-in Versand-Spalte | Wie kommen die Adressen in den Brief? | Roll, Power, Tick, Stamp | Ergebnis |
| 34,68–37,85 | Als Nächstes: Wie kommen die Adressen in den Brief? | Pill ALS NÄCHSTES; Brief mit leerem Empfängerfeld + Liste, Pfeil, „?“; Karte ADRESSEN IN DEN BRIEF? | Push-in, Halt | Wie macht sie fünf Briefe? | Airy, Pop, Pop tief | Übergabe |
| 37,85–45,0 | Kommentiere „Versand“ … sichere Adressen. | Endkarte: Keyword Versand, PRÜFFRAGE, 10 MINUTEN: SICHERE ADRESSEN, Puls | ruhiger Push-in | – | Pop, Typing, Check, Chime, Tick; Musik 0,05 → 0 | M-007 |

## Ton-Regie
Musik siehe `musik.txt` (GONE ab 303,5 s, Vortags-Bereich Folge 9/12, 0 explizite Wörter, kein Mute). Stück hat eine eigene Pause Clip 22,85–23,15 genau vor „Warum?“ und setzt auf „Warum?“ wieder ein (Kurve: Mulde 0,022, Akzent 0,05). Endkarte 0,05, Fade. SFX abwechslungsreich (Pop/Tick/Clack/Check/Chime/Page/Roll/Power/Airy/Stamp, keine schweren Whooshes). Abstand Stimme–Musik je Akt ≥ 18,4 dB. Ziel −14 LUFS (firma-mix).

## Risiken
- **100 Wörter = Tempo-Kante:** 133,3 wpm inkl. Endkarte, voice-only 135,1. Mehr Pausen kosteten STT-Stabilität; nicht weiter verlängert.
- **Zwei Naht-Pausen 0,82/0,83 s** (> 0,7): Akt-Wechsel mit Kamerafahrt bzw. Endkarte; Kürzung (G2 0,6) kippte STT 2/8 (probiere/schicke, Websearch) → bewusst gelassen. Design füllt beide mit Bewegung.
- **STT-Stabilität „Websuche“** hängt an der 0,20-s-Pause und am Kontext; jede Audio-Änderung → neue STT-Serie (≥ 6 Läufe).
- Board-Feld ADRESSEN + Haken ist Vorschlag; `public/firma-ep/tag14/episode.json` fehlte beim Regie-Lauf.
- Shot 05-anonym enthält das Wort „Handelsregister“ und die Branche „Dachdeckerei“ → nur als Textur mit markierten Bereichen, nie lesbar groß.
- Karte „gelesen bei North Data“ ist die einzige sichtbare Quellen-Ehrlichkeit im Video (gesprochen nur „Firmendatenbank“) – Design darf sie nicht weglassen.
