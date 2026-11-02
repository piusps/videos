# Regieplan · Folge 16 „Wie kommen die Adressen in den Brief?“ (Serientag 4, **nicht** erste Folge des Tages, Slot 2026-10-31 18:00)

firma-regie, 2026-10-31. Grundlage: script.txt nach Autor-Runde 2 (`pruefung/autor-runde2-kurz.md`, 99 Wörter). Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag16/`), `beats.json` (`regie/make_beats.py`), `musik.txt`, Bibel-Zeile (`wirtschaftsbuch-v2.md`, `regie/bibel_eintrag.py`). Arbeitsdateien/Tests in `regie/`. Keine Grafik, kein Render.

## Messwerte
| Messung | Wert | Vorgabe |
|---|---|---|
| Länge | letztes Wort endet 43,13 + 1,0 s Endkarte = **44,13 s** (`beats.json seconds`); voice.mp3 43,49 s | 40–48 s ✓ |
| Sprechtempo | **134,6 wpm** (99 / 44,13 s); nur Stimme bis letztes Wort 137,7 | 120–135 ✓ |
| Rückblick „Die“ → Ende „geprüft.“ | **6,19 s** (6,23–12,42, words.json); nach TTS-Alignment vor Wortgrenzen-Snap 6,47 s | ≤ 6,5 s ✓, nicht beschleunigt |
| „Heute“ beginnt bei | **13,47 s** | ≤ 14,5 s ✓ |
| Tempo TTS | 1,0 überall, kein atempo | ✓ |
| STT (scribe_v1, de) Endfassung | **38/38 Läufe 99/99 Wörter identisch** mit script.txt (32 auf der bytegleichen Variante `regie/var/u_c7.mp3`, 6 auf voice.mp3 = `regie/voice.stt0–5.json`) | 0 Abweichungen ✓ |
| Musik explizit | **0** (3 Läufe auf dem Abschnitt + Gegenprobe Vollspur), kein Mute | ✓ |
| Pausen > 0,7 s | „Felder. → Warum?“ 0,89 (gewollt, vor dem Warum); Nähte „geprüft. → Heute“ 1,05 (Akt-Wechsel, Kamerafahrt zum Brief), „Briefe. → Aber“ 0,83 (Wendung, Take-Naht 1/4), „Shirts? → Kommentiere“ 0,84 (Endkarte) | siehe Risiken |

## Storyline-Check (Bibel v2 + Kette)
- Folge 15 endet „Als Nächstes: Wie kommen die Adressen in den Brief?“ → Folge 16 „Heute kommen die Adressen in den Brief.“ (wörtlich). Rückblick-Satz 2 „Ein Brief, fünf Adressen geprüft.“ = Stand nach Folge 13 (ein Werbebrief) + 15 (fünf geprüfte Adressen). Kein „Tag“, kein „gestern“.
- Eingabe = Brief Lauf 13 + Excel Lauf 15 (unverändert angehängt). Ergebnis: 5 Briefe, je 4 von 14 Platzhaltern gefüllt, 10 gelb. Kasse 0 € → 0 €, kein Umsatz-Zähler. Nichts gedruckt/verschickt; Briefe nicht versandfertig.
- Board: Nummerierung aus `public/firma-ep/tag13–15/episode.json` (9 Felder, WERBEBRIEF + ADRESSEN = Index 7 current). Folge 16: bleibt current, **kein Haken** (offene Felder). GEWERBE offen, WEBSITE „Entwurf“.
- Übergabe Folge 17: „Was kostet der Versand der Shirts?“ = Platzhalter „[Versandkosten und Lieferzeit ergänzen]“ (Brief Folge 13; Lauf 13: „Die kenne ich nicht. Ohne sie wirkt „109 €“ womöglich wie ein Endpreis.“). Kein Widerspruch zu früheren Folgen, kein Ticket an firma-autor. Lauf 17 muss genau das beantworten (Versand Shirts → Betrieb, z. B. Printful).

## Stimme
- Serienstimme Keno `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **Tempo 1,0** (`regie/el.mjs`). TTS-Text `regie/script-tts.txt` = script.txt (kein Wort umgeschrieben).
- 8 Volltakes (`regie/voice-raw1–8.mp3`): alle im Volltext-STT „probiere“/„schicke“ (bekannt, Lehre 13/14); Take 2/3/5/8 zusätzlich „Claude,“ statt „Claude:“ bzw. „Minute fünf“ zusammengezogen. Rückblick der Volltakes 6,85–7,44 s roh (zu lang für ≤ 6,5).
- **Zusammenbau (`regie/assemble.py`, Parameter `regie/final.env`; Schnitte nur in Stille an Satzgrenzen, 3-ms-Fades):**
  - A Eröffnung bis „aus.“ = **Folge 12 `voice.mp3`** (Lehre 14: einzige stabile Eröffnung), Naht 0,35 s (nicht verlängert)
  - B Rückblick „Die … geprüft.“ = **Betonungs-Take `regie/betonung/rueck1.mp3`** (Pausen Betriebe/Bestellung/Brief auf 0,07/0,12/roh)
  - 0,80 s | C1 „Heute … Briefe.“ = **Take 1** (sauberes „Claude:“ und „Minute:“)
  - 0,70 s | C2 „Aber … Shirts?“ = **Take 4** (langsamster zweiter Teil; „Warum?“ steigt), Pegel auf C1 angeglichen
  - 0,70 s | D CTA = Betonungs-Take `regie/betonung/cta1.mp3` (STT „schick“), Pegel auf C.
  - Pegel A/B/C/D −17,2 / −16,7 / −16,7 / −16,7 dB RMS.
- **STT-Stabilität „probier/schick“:** hing in dieser Folge am Kontext, nicht an der Pause allein. Getestet (`regie/var/`, je 6–12 Läufe): Mitte nur Take 4 1–6/8; nur Take 1 13/16; Hybrid 1+4 mit Rückblick-Take 6 3–10/12; Eröffnung Folge 10/11/13 0–1/6; neue CTA-Takes cta2–6 0–3/6. **Rückblick-Take rueck1 + Hybrid + Pause „Brief. → Claude:“ 0,7 → 38/38.** Diagnose: schon A+B+„Heute kommen die Adressen in den Brief.“ allein kippt im STT zu „probiere“; nur die ganze Datei in genau dieser Fassung ist stabil.
- words.json: Zeiten aus TTS-Alignment (A aus Folge-12-words.json), durch Schnitte verschoben, Wortgrenzen auf Stille gezogen (`regie/snap_words.py`). Caption-Ziffern: hundert → 100, fünf → 5, vier → 4, zehn → 10. 99 Wörter.
- **Für spätere Änderungen (Lehre 10):** nur den betroffenen Teil neu erzeugen; jede Änderung an Nähten oder Pausen braucht eine neue STT-Serie (≥ 12 Läufe), siehe Varianten oben.

### Betonungstest (Satzkontext, Tempo 1,0; `regie/betonung.mjs`, je 2 Takes, Silben `regie/stress16.py`; Risikowörter aus thema.md)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| „Claude:“ | STT „Claude:“ 2/2, Pause danach roh 0,42–0,52 s → auf 0,25 s | ok |
| „Ein Brief, fünf Adressen geprüft.“ | Komma als Pause (Brief 0,42–0,46 s), FÜNF höchster Ton (200–211 Hz), ge-PRÜFT längste Silbe (0,34–0,36 s); STT 2/2 | ok |
| „Heute kommen die Adressen in den Brief.“ | BRIEF längste Silbe (0,28–0,30 s), STT 2/2 | ok |
| „Nach einer Minute:“ | „einer“ voll (EI 157–174 Hz), Doppelpunkt = Pause (STT 1× ohne Doppelpunkt, Wortlaut gleich) | ok |
| „vier Felder“ | FEL- trägt, STT „Felder“ 2/2 (nicht „Fälle“) | ok |
| „Absender, Datum, Versandkosten“ | Aufzählung mit Pausen 0,16–0,23 s; ver-SAND trägt (0,22 s, Lexikonbetonung; thema.md-Hinweis „VER-“ wäre falsch) | ok |
| „Versand der Shirts“ | „Shirts“ englisch, 0,34 s, STT 2/2 | ok |
| Kommentiere „Serienbrief“ | KOM-men-TIE-re, SE- längste Silbe in Serienbrief (0,23–0,24 s); Anführungszeichen nicht gesprochen | ok |
| „Serienbriefe“ am Ende | 5 Silben vollständig (Se-ri-en-brie-fe), STT „Serienbriefe“ 2/2 | ok |
Kein Wort musste umgeschrieben werden.

### Pausen (Stille < −45 dBFS)
| Stelle | roh | neu |
|---|---|---|
| aus. → Die (Naht A/B) | – | 0,35 |
| Betriebe, → bestickt | – | roh (keine Stille) |
| Bestellung. → Ein | 0,48 | 0,12 |
| geprüft. → Heute (Naht B/C, Fahrt) | – | 0,80 (Wortlücke 1,05) |
| Brief. → Claude: | 0,17 | 0,70 |
| Claude: → Brief | 0,52 | 0,25 |
| angehängt. → Nach | 0,23 | 0,70 |
| Minute: → fünf | 0,34 | 0,50 |
| Briefe. → Aber (Naht C1/C2) | – | 0,70 (Wortlücke 0,83) |
| Felder. → Warum? | 0,32 | 0,90 |
| Warum? → Nur | 0,24 | 0,65 |
| Liste. → Absender | 0,53 | 0,70 |
| Absender, → Datum, | 0,23 | 0,25 |
| Dateien. → Als | 0,46 | 0,70 |
| Nächstes: → Was | 0,12 | 0,50 |
| Shirts? → Kommentiere (Naht C/D) | – | 0,70 (Wortlücke 0,84) |
| „Serienbrief“, → ich | 0,47 | 0,50 |
| Anleitung. → Damit | 0,09 | 0,70 |

## Akte (roter Faden, ein Hauptobjekt je Akt)
| Akt | Zeit | Hauptobjekt | Story-Objekt |
|---|---|---|---|
| 1 Hook | 0–6,23 | fünf Briefseiten mit gelben Lücken | fünf Seiten |
| 2 Rückblick | 6,23–13,47 | Gründungsplan, dann EIN Brief + Liste getrennt | – |
| 3 Auftrag (Heute + Claude-Weg) | 13,47–18,63 | Adress-Balken → Brief, dann Shot 01 (Anhang-Karten) | – |
| 4 Ergebnis | 18,63–21,55 | Stoppuhr ≈ 1 Minute, fünf Seiten aus der Datei-Karte | fünf Seiten kehren zurück |
| 5 Entscheidung + Warum | 21,55–32,10 | EINE Briefseite (4 grün, 10 gelb), Grund-Karten | eine Seite vorn |
| 6 Offene Frage | 32,10–36,32 | Versand-Zeile → Paket mit Shirt + „? €“ | – |
| 7 CTA | 36,32–44,13 | Endkarte | Mini-Briefstapel |

## Beat-Plan
| Zeit (words.json) | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,74 | „Wie viel Umsatz“ | Hook-Frage oben ab Frame 0; fünf echte Briefseiten gefächert (Empfänger schwarz, gelbe Platzhalter lesbar); Wisch über Gelb auf „Umsatz“ | Push-in, Punch +4 % | Warum gelbe Lücken? | pop, wqh, page, bump | M-002 |
| 0,74–3,38 | „macht … ganz“ | gelbe Felder pulsen je Wort, Seiten blättern auf „100“, Licht-Sweep, Rutsch zur Versand-Zeile | steht, Mini-Punch | Was fehlt? | tick/popHi/click/page/wshort | Hook-Takt ≤ 0,5 s |
| 3,38–4,95 | „alleine führt?“ | Stempel GANZ ALLEINE. | Punch-in | Ohne Mensch? | wq, clack, bump, tick | M-011 |
| 4,95–6,23 | „Ich probier das aus.“ | Briefe raus, Board ein, Maskottchen hüpft | Pull-back | Welches Experiment? | wq2, popHi, click | Serienrahmen |
| 6,23–9,34 | „Die Firma … Betriebe,“ | Board, WERBEBRIEF + ADRESSEN gold; Karte SHIRTS MIT LOGO; Handwerker-Silhouetten | ruhig | Worum geht's? | wqh, popHi, tick | Rückblick-Akt |
| 9,34–10,70 | „bestickt erst auf Bestellung.“ | Banner „erst auf Bestellung bestickt“ | steht | Ohne Lager? | page | – |
| 10,70–13,47 | „Ein Brief, fünf Adressen geprüft.“ | EIN Brief (Folge 13, Feld gelb leer) + Liste Folge 15 (5 Zeilen, Chips) getrennt, Haken auf „geprüft“ | Push-in auf beide | Wie kommt das zusammen? | page, popLo, check, wq2 | – |
| 13,47–16,02 | „Heute kommen die Adressen in den Brief.“ | Pill HEUTE: ADRESSEN → BRIEF; Adress-Balken schweben zum Empfängerfeld | Fahrt Liste → Brief | Wie macht sie das? | wq2, chime, wshort, tick | – |
| 16,02–18,63 | „Claude: Brief und Liste angehängt.“ | echter Shot 01: Rahmen DOCX auf „Brief“, XLSX auf „Liste“, Zeiger auf „+“ | Push-in | Womit fängt sie an? | page, popHi, popLo, click | M-004 |
| 18,63–21,55 | „Nach einer Minute: fünf Briefe.“ | Karte ≈ 1 MINUTE + Stoppuhr; aus Datei-Karte (Shot 06) fächern fünf Seiten auf „5“ | Pull-back, alle Seiten ganz im Bild | Fertig? | wshort, tick, power, page | M-002 (Ergebnis) |
| 21,55–24,21 | „Aber sie füllt nur vier Felder.“ | EINE Seite vorn, 4 Stellen grün (geschwärzt), Gelb pulst; Karte 4 VON 14 GEFÜLLT; Halt in 0,89-s-Pause | Push-in, Halt | Warum nur vier? | wq2, clack, tick; Musik-Mulde | Entscheidung |
| 24,21–27,56 | „Warum? Nur die stehen in der Liste.“ | Seite oben klein; Pill WARUM?; Karte STEHT IN DER LISTE (vs „Erfinden ✗“), Linien zu Spaltenköpfen | Fahrt nach unten | Und der Rest? | airy, pop, popLo; Musik-Akzent | Warum-Beat |
| 27,56–32,10 | „Absender, Datum, Versandkosten fehlen in beiden Dateien.“ | gelbe Platzhalter leuchten je Wort; bei Versandkosten Shirt-Paket-Icon (kein Porto); Karte FEHLT IN BEIDEN DATEIEN (vs „Brief ✗ · Liste ✗“); Beleg Shot 04 | Push-in, Halt | Was macht sie damit? | tick, tick, popHi, stamp | Warum-Beat |
| 32,10–36,32 | „Als Nächstes: Was kostet der Versand der Shirts?“ | Pill ALS NÄCHSTES; Versand-Zeile → Karton mit Logo-Shirt + „? €“; Karte VERSAND DER SHIRTS? | Push-in, Halt | Was kostet das? | airy, pop, tick, popHi, popLo | Übergabe mit Objekt |
| 36,32–44,13 | CTA | Endkarte: Keyword Serienbrief, ANLEITUNG, 10 MINUTEN: EIGENE SERIENBRIEFE, Puls auf „eigene“ | ruhig, Halt | – | pop, typing, check, wqh, popHi, chime, tick, pop | M-007 |
Karten-Abstände (neue Textblöcke): min 1,30 s, alle ≤ 4 Wörter (Hook-Frage/Endkarte wie Serie). Längster Beat ohne Wortanker-Ereignis: B13 4,54 s, aber drei Wort-Ereignisse darin (≤ 1,5 s ohne Änderung).

## Ton-Regie
- Musik siehe `musik.txt`: GONE ab 53,3 s, leiser Einstieg (Faktor 0,04 auf leiserem Teil), Mulde vor „Warum?“, das Stück wird genau ab dem Warum lauter (Akzent 0,05, dann 0,03), Endkarte 0,05, Fade auf 0. Gap je Akt 20,5–24,5 dB (≥ 15).
- SFX abwechslungsreich (21 Dateien aus Folge 15, `sfx_dateien`), keine schweren Whooshes; Stempel nur zweimal (GANZ ALLEINE., FEHLT IN BEIDEN DATEIEN). Ziel −14 LUFS über firma-mix.

## Auflagen aus der Autor-Prüfung (in beats.json umgesetzt)
- „Versandkosten“/„Versand der Shirts“: Shirt-Paket, nie Briefmarke/Kuvert/Porto (B13, B14, verboten-Liste).
- „vier Felder“: eine Seite, vier grüne Stellen, Karte „4 VON 14 GEFÜLLT“ (B11) – niemand hört „vier Briefe“.
- Rückblick ≤ 6,5 s ohne Beschleunigung: 6,19 s.

## Risiken
- STT „probier/schick“ ist kontextabhängig: diese Datei 38/38; jede Änderung an Pausen/Nähten/Takes → neue STT-Serie (Varianten kippten auf 1–10/12).
- Nähte „geprüft. → Heute“ 1,05 s und „Briefe. → Aber“ 0,83 s Wortlücke: beide auf Akt-/Wende-Grenzen mit Kamerafahrt bzw. Bild-Ereignis; Design muss dort Bewegung zeigen, kein Standbild.
- Musik für Folge 17 (21:00) wird knapp: kein freier Vortags-Abschnitt ≥ 44 s mehr ohne Nachbarschaft zu F14/F15/F16 (siehe musik.txt).
- Briefseiten-Ansicht ist noch nicht gerendert (Design aus der .docx, Schwärzung prüfen).
