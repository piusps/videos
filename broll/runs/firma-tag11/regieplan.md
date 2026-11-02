# Regieplan · Folge 11 „Gewerbe“ (Serientag 3, nicht erste Folge, Slot 2026-10-30 18:00)

firma-regie, 2026-10-30. Grundlage: script.txt (Autor Runde 2, bestanden, **100 Wörter, Wortlaut unverändert**), briefing.md (inkl. Chef-Hinweise), ../firma-tag9/tagesbriefing-2026-10-30.md (alle Regeln K.-o., Chef-Entscheide „Rückblick bei Tempo 1,0“ und „Wortgrenze vs. Länge“), thema.md („Für die Regie“), hooks.md (Variante F), pruefung/autor-runde2.md (Ticket **autor-R2-03** an die Regie), design/lauf/LAUF.md + Screenshots 01–07 + checkliste-ansicht.png. Vorlagen Folge 8/10 (runs/firma-tag8/, runs/firma-tag10/) und public/firma-ep/tag9/.
Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag11/`), `beats.json` (erzeugt von `regie/make_beats.py`), `musik.txt`, Arbeitsdateien/Tests in `regie/`, Bibel-Zeile Folge 11 (wirtschaftsbuch-v2.md, `regie/bibel_eintrag.py`).

## Storyline-Check (Bibel v2 + Kette Tagesbriefing)
- Folge 10 endet mit „Als Nächstes: Was muss sie anmelden?“ → „Heute: Was muss sie anmelden?“ wörtlich → Lauf 11: Gewerbeanmeldung zuerst, „Das kann nur ein Mensch.“ → Übergabe „Wen spricht sie zuerst an?“ (Lauf 12 beantwortet sie; Folge-12-Rückblick „Gewerbe macht nur ein Mensch.“ passt). Kein Sprung, kein „gestern“, kein Tag gesprochen.
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Kein neuer Kunde/kein neues Produkt. Neu: Checkliste (13 Punkte, 9 Mensch / 4 Claude). Gewerbe **nicht** angemeldet, nicht als erledigt/angekündigt erzählt.
- Kein Widerspruch zu früheren Folgen. Kein Ticket an firma-autor.

## Stimme
- Serienstimme wie Folge 2–10: `scripts/eleven-tts.mjs`, ElevenLabs „Keno“ `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **TTS_SPEED=1.0** (kein atempo, keine Beschleunigung). TTS-Text `regie/script-tts.txt` = script.txt (keine Sonderschreibung; „Word“ bleibt, s. Betonungstest).
- 3 Volltakes (`regie/voice-raw1–3.mp3`), gewählt **Take 1** (alle Satzgrenzen richtig: STT setzt nach „offline.“ einen Punkt, Take 2 hörte „offline heute.“; „Haken:“ fallend 152 → 73 Hz = Aussage; „Warum?“ steigt 81 → 276 Hz; „Gewerbe.“ fällt).
- **Rückblick ersetzt** (Ticket autor-R2-03): Take 1 roh 6,62 s (Alignment) / 6,45 s (Pegel) – an der Grenze. 6 Rückblick-Takes (`regie/retake/rueck1–6`, `regie/rstat.py`), gewählt **rueck2**: 5,95 s am Pegel, „Bestellung.“ fällt (225 → 83 Hz), „Website-Entwurf“ WEB- höchste Tonhöhe (172 Hz), „offline.“ fällt (99 → 77 Hz), STT wörtlich „Website-Entwurf offline“. Pegel an Take 1 angeglichen (+0,51 dB), Schnitt nur in Stille (`regie/assemble.py` → `voice-raw1b.mp3`).

### Betonungstest (Satzkontext, Tempo 1,0; `regie/betonung.mjs`, Takes in `regie/betonung/`, Silben `regie/stress11.py`, Vokal `regie/formant.py`, Verlauf `regie/wordcontour.py`/`rcontour.py`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| offline | OFF- höher (147 Hz) vor -line (99 Hz), englisch „off-lain“, fällt als Satzende; STT „offline“ (Test, 3 Volltakes, Retake, Endfassung) | Retake rueck2 |
| Word-Checkliste | **„Wörd“, nicht „Wort“:** Vokal-F2 im Test 1347 Hz, in der Endfassung 1240–1360 Hz (englisches/ö-artiges „Word“), Gegenprobe „Wort-Checkliste“ F2 760–980 Hz (deutsches o). STT „Word-Checkliste“ in 3/3 Tests, 3/3 Volltakes, 6/6 Endläufen. Schreibvarianten „Wörd“/„Wörrd“ brachten nichts Besseres (F2 1856 bzw. 1330) → Originalschreibung | Take 1 |
| Website-Entwurf | WEB- höchste Tonhöhe (164 Hz Test, 172 Hz Endfassung), Ent-wurf tiefer; STT „Website-Entwurf“ | Retake rueck2 |
| Business | BUS- trägt (−15,7 dB) vor -ness (−25 dB), englisch „Bis-nis“; STT „Business“ überall | Take 1 |
| Gewerbe | Ge-WER-be: im CTA -wer- lautester Teil (−13,6 dB); im Entscheidungssatz Einsatz hoch auf Ge-, Gewicht auf -wer- (0,19 s), Satzende fällt (183 → 70 Hz); STT korrekt | Take 1 |
| Websuche | WEB- trägt (−16,9 dB); STT „Websuche“ 3/3 Tests, 4/4 Ausschnitt-Läufe, Endfassung 5/6 (1× „Websearch“, s. STT) | Take 1 |
| dreizehn / anmelden / Kommentiere / Startliste | DREI-zehn, AN-melden, kommen-TIE-re, START-liste; STT korrekt | Take 1 |
| anmelden? | W-Frage fallend (106 → 70 Hz), STT 6/6 „Was muss **sie** anmelden?“ (Folge-10-Fehler „die“ tritt nicht auf) | Take 1 |
| Haken: | fallend 152 → 73 Hz = Aussage, STT „Haken“ | Take 1 |

### STT (scribe_v1, de) Wort für Wort gegen script.txt (`regie/cmp.py`, `regie/stt-final1–6.json`)
- **6 Läufe über die Endfassung:** 2× 100/100 identisch; 3× „probier/schick“ → „probiere/schicke“ (bekannter STT-Fehler der Serie, s. Folge 10; Ausschnitt „Ich probier das aus“ und „ich schick dir“ isoliert je 3/3 korrekt); 1× zusätzlich „Websuche“ → „Websearch“ (Ausschnitt isoliert 4/4 „Websuche“). Sonst keine Abweichung.

### Pausen (nur an Satz-/Doppelpunktgrenzen, Stille < −45 dBFS, 3-ms-Fades; `regie/splice.py`, Karte `regie/splice-map.json`)
| Stelle | roh | neu |
|---|---|---|
| führt? → Ich | 0,52 | 0,70 |
| aus. → Die | 0,67 | 0,70 |
| Betriebe, → bestickt (Rückblick) | 0,09 | 0,09 (unverändert) |
| **Bestellung. → Website-Entwurf (Rückblick, Autor-Vorgabe ≤ 0,25)** | 0,18 | **0,18** |
| **Website-Entwurf, → offline (keine Zusatzpause)** | 0,04 | **0,04** (unverändert) |
| offline. → Heute | 0,58 | 0,70 |
| Heute: → Was | 0,47 | 0,55 |
| anmelden? → Letztes (neuer Akt) | 0,43 | 0,70 |
| angehängt, → Websuche | 0,12 | 0,35 |
| Websuche: → dreizehn | 0,43 | 0,50 |
| Word-Checkliste. → Als Erstes | 0,26 | 0,70 |
| Erstes: → das Gewerbe | 0,45 | 0,55 |
| **Gewerbe. → Warum (vor dem Warum)** | 0,14 | **0,90** |
| Warum? → Pflicht | 0,48 | 0,70 |
| Tag. → Die anderen (Grund 1 → 2) | 0,38 | 0,70 |
| auf. → Haken | 0,30 | 0,70 |
| Haken: → Das | 0,20 | 0,55 |
| Mensch. → Als Nächstes | 0,37 | 0,70 |
| Nächstes: → Wen | 0,49 | 0,55 |
| an? → Kommentiere | 0,45 | 0,70 |
| „Gewerbe“, → und | 0,12 | 0,40 |
| Checkliste. → Damit | 0,38 | 0,70 |

Grund 1 → 2 mit 0,70 statt ~0,3 s, weil Karte 1 ≥ 1,2 s stehen muss, bevor die Pfeilkette genau auf „Die anderen …“ kommt. Keine Pause > 0,7 s außer vor dem Warum (0,9).

### Messwerte Endfassung
- **Länge:** voice.mp3 **44,79 s** (Datei 44,83 s mit MP3-Auffüllung) + 1,0 s Endkarte = **45,79 s** (40–48 ✓).
- **Sprechtempo:** 100 Wörter / 44,79 s = **134,0 wpm** (nur Stimme), **131,0 wpm** über die ganze Folge mit Endkarte (120–135 ✓).
- **Rückblick** „Die“ → Ende „offline.“: **6,06 s** (Alignment 6,52–12,58), **5,95 s** am Pegel (≤ 6,5 ✓, nicht beschleunigt). Pause nach „Bestellung.“ 0,18 s ✓, Komma 0,04 s ✓.
- **„Heute“ beginnt bei 13,23 s** (Pegel 13,27; ≤ 14,5 ✓).
- Stimme −18,2 LUFS integriert (vor dem Mix).
- words.json: Zeiten aus dem TTS-Alignment, durch Retake/Schnitte mitverschoben, Wortenden auf Stille nachgezogen (`regie/snap_words.py`). Caption-Ziffern: hundert → 100, dreizehn → 13, zehn → 10. 100 Caption-Wörter.

## Akte (roter Faden)
Durchgehendes Story-Objekt: **die echte Checkliste aus Claudes Word-Datei** mit Stempel „MENSCH“. Sie ist Frame 1, geht für Rückblick/Claude-Lauf aus dem Bild, kommt aus der Datei-Karte (Shot 06) zurück und bleibt von der Entscheidung bis zum Haken stehen (Ausschnitt → oben → ganz mit 13 Punkten).
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook (ohne Tag) | 0–6,52 | Checkliste Punkte 1–2 + MENSCH, Hook-Frage; HUD TAG 3 klein | hook (Story-Objekt) |
| 2 Rückblick | 6,52–15,87 | Gründungsplan (12 Felder), Produkt-Karte, WEBSITE „ENTWURF“, Fahrt zu GEWERBE | recap |
| 3 Claude-Lauf | 15,87–21,62 | echte Shots 01 (Anhang) → 02 (Quellen-Band) → 13 PUNKTE → 06 (Datei-Karte DOCX) | claudeShot ×3 |
| 4 Entscheidung | 21,62–24,57 | Checkliste groß, Band „Als Erstes kommt die Gewerbeanmeldung“, Punkt 1 gold | Story-Objekt + Marks |
| 5 Warum | 24,57–30,08 | Checkliste oben, Karte PFLICHT AB BEGINN, Pfeilkette | why + Overlays |
| 6 Haken | 30,08–32,81 | ganze Checkliste, 9 Mensch-Zellen zählen, 9 VON 13 | question (card:false) |
| 7 Als Nächstes | 32,81–36,27 | Board klein, BETRIEBE „?“, Frage-Karte | question |
| 8 CTA | 36,27–45,79 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json. Anker immer Wort + after (beats.json).

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,43 | Wie viel | **Frame 1 = Ergebnis:** Hook-Frage komplett ab Frame 0; echte Checkliste (Kopf + Punkte 1–2, orange „Mensch“-Zellen der Datei, Kästchen leer, Ort geschwärzt), Stempel „MENSCH“ auf Punkt 1 ab Frame 0; HUD TAG 3 | langsamer Push-in auf Punkt 1 | Warum „Mensch“, wenn die KI allein ist? | Pop | M-002, M-011 |
| 0,43–3,33 | Umsatz macht ein Unternehmen, das eine KI 100 Tage lang | je ein Ereignis pro 0,5 s, kein neuer Text: Drop auf „Umsatz“, Zelle 1 glüht („macht“), Zelle 2 pulst („Unternehmen“), Kästchen 1 blinkt leer („das“), Stempel wackelt („KI“), Punch „100“, Licht-Sweep („Tage“), Kamera rutscht („lang“) | Punch auf „Umsatz“, Mini-Punch „100“ | Kann eine KI das allein? | Whoosh hoch, Bump, Tick, Pop tief, Klick, Tick, Pop hoch, Tick, Whoosh kurz | |
| 3,33–4,87 | ganz alleine führt? | Stempel „GANZ ALLEINE.“ (gegen MENSCH darunter), Punch-in, MENSCH stößt nach (4,35) | Punch-in 4 % | Wirklich ohne Mensch? | Whoosh, Clack, Bump, Tick | M-011 |
| 4,87–6,52 | Ich probier das aus. | Checkliste raus, Board ein, Maskottchen hüpft. Kein Slam | Pull-back | Was ist das Experiment? | Whoosh, Pop, Klick | Serienrahmen |
| 6,52–9,84 | Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, | Board: PRODUKT–LOGO abgehakt, WEBSITE neutral, GEWERBE … ERSTER UMSATZ offen; Karte „SHIRTS MIT LOGO“ auf „verkauft“ | ruhig | Worum geht es? | Whoosh hoch leicht, Pop | Rückblick |
| 9,84–11,23 | bestickt erst auf Bestellung. | Banner „erst auf Bestellung bestickt“ | steht | Ohne Lager? | Page | Rückblick |
| 11,23–13,23 | Website-Entwurf, offline. | WEBSITE leuchtet kurz (zuletzt bearbeitet), Etikett „ENTWURF“ schlägt auf; „offline“ = Symbol ohne Text. Nie grün | leichter Push-in auf WEBSITE | Was fehlt noch? | Stamp, Pop tief | Rückblick |
| 13,23–15,87 | Heute: Was muss sie anmelden? | Fahrt zu GEWERBE (gold, current), Pill „HEUTE: ANMELDEN“, GEWERBE pulst auf „anmelden“ | Fahrt auf GEWERBE | Was muss man anmelden? | Whoosh, Chime, Tick | Rückblick |
| 15,87–17,58 | Letztes Ergebnis angehängt, | echter Shot 01: Anhang-Karte „Shirt-Firma Ergebnis Website.md · 39 Zeilen“ orange gerahmt („Ergebnis“), Zeiger auf „+“ („angehängt“) | Push-in auf die Karte | Womit fängt sie an? | Page, Pop tief, Klick | M-004 |
| 17,58–18,61 | Websuche: | echter Shot 02, nur Quellen-Band (8 Behörden-/Kammer-Quellen, kein Ort), Fenster 3 Zeilen, scrollt nach oben | Pan nach oben | Woher weiß sie das? | Whoosh kurz, Typing | M-004 |
| 18,61–19,96 | 13 Punkte als | 13 Kästchen-Zeilen (Miniatur, unlesbar) zählen durch, Karte „13 PUNKTE“ | leichter Push-in | Als was? | Roll, Tick | |
| 19,96–21,62 | Word-Checkliste. | echter Shot 06: Datei-Karte „… · Dokument · DOCX“ gerahmt, Klick → Karte klappt zur Checkliste auf | Push-in, Übergang | Was steht drin? | Pop hoch, Klick | M-004 |
| 21,62–23,16 | Als Erstes: das | Checkliste groß; echtes Band „Als Erstes kommt die Gewerbeanmeldung“ oben (hart vor „in [Ort]“ beschnitten); **Musik-Mulde**, Bild steht (nur Push-in) | langsamer Push-in auf Punkt 1 | Was zuerst? | Page | Stille vor der Pointe |
| 23,16–24,57 | Gewerbe. | Punkt 1 gold gerahmt + Badge „1“, Mini-Board GEWERBE leuchtet (Musik-Schlag genau hier); 0,9-s-Pause: steht | Halt | Warum ausgerechnet das? | Power, Check | M-002 |
| 24,57–27,67 | Warum? Pflicht ab dem ersten Tag. | Checkliste oben, Pill „WARUM?“, Karte „PFLICHT AB BEGINN“ (25,78; klein „§ 14 GewO“, grau „ohne: Verstoß“), Pfeil auf Punkt 1, Beleg-Kachel Grund 1 klein | kurze Fahrt nach oben, ruhig | Warum Pflicht? | Whoosh airy, Pop, Pop tief, Tick | Warum-Beat |
| 27,67–30,08 | Die anderen Schritte bauen darauf auf. | Pfeilkette als ein Block „GEWERBE → FINANZAMT → STEUERNUMMER → VERPACKUNG“ genau auf „Die“, Stationen färben sich je Wort (anderen/Schritte/bauen/darauf), Klammer zurück auf GEWERBE auf „auf.“ | leichter Pull-back | Welche Schritte? | Whoosh kurz, Pop tief, 3× Tick, Check | Warum-Beat |
| 30,08–31,48 | Haken: Das kann | Pill „HAKEN“, Karten raus, ganze Checkliste (13 Punkte) fährt ein, 9 orange Mensch-Zellen leuchten nacheinander, 4 grüne Claude-Zellen gedimmt | Pull-back auf ganze Liste | Was kann sie nicht? | Whoosh, Page, Roll | Grenze als Befund |
| 31,48–32,81 | nur ein Mensch. | Zähler „9 VON 13“ auf „nur“; auf „Mensch.“ schlägt MENSCH auf Punkt 1 nach. Kein Haken im Kästchen, keine Hand | Push-in auf Punkt 1 | Und dann? | Pop hoch, Stamp | M-011 |
| 32,81–36,27 | Als Nächstes: Wen spricht sie zuerst an? | Pill „ALS NÄCHSTES“, Board klein (WEBSITE ENTWURF, GEWERBE gold mit Personen-Symbol, ohne Haken), BETRIEBE „?“; Karte „WEN ZUERST ANSPRECHEN?“ auf „Wen“ | leichter Push-in auf BETRIEBE | Wen spricht sie an? | Whoosh airy, Pop, Tick, Pop tief | offener Faden |
| 36,27–45,79 | Kommentiere „Gewerbe“, … deine Startliste für dein eigenes Business. | Endkarte: Keyword tippt, Haken, Flieger; Items „Die Frage“ (38,75), „Echte Checkliste“ (39,97, Snip mit Schwärzung); Block „STARTLISTE IN 10 MINUTEN“ (41,22), Puls auf „Startliste“; Halt bis 45,79 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Whoosh hoch, 2× Pop hoch, Chime, Pop | M-007 |

**Textregel-Prüfung** (neue Textblöcke ohne Untertitel, `make_beats.py`): Abstände 3,58 / 3,83 / 2,43 / 1,39 / 2,00 / 5,38 / 3,01 / 2,95 / 1,21 / 1,89 / 2,41 / 1,40 / 1,33 / 1,32 / 2,90 / 1,71 / 1,23 / 1,25 s → alle ≥ 1,2 s; Karten ≤ 4 Wörter (Ausnahme: feste Hook-Frage; Beleg-Band = Screenshot). Einzige Gleichzeitigkeit: Frame 0 (Hook-Frage + Stempel MENSCH), wie ENTWURF in Folge 10 und vom Chef verlangt („Frame 0 ganze Frage + Ergebnis-Objekt mit Mensch-Stempel“). Keine Karte mit „TAG“: Grund 1 = „PFLICHT AB BEGINN“ (Datei: „gleichzeitig mit dem Beginn“). Screenshots so beschnitten, dass nie > ~12 Wörter gleichzeitig lesbar sind.
**Hook 0–6 s:** jedes 0,5-s-Fenster hat ein Ereignis (Prüfung in `make_beats.py`, Ergebnis: keine Lücke).
**M-009 (≤ 1,5 s ohne Änderung):** längste Strecke 21,62 → 23,16 (Musik-Mulde, bewusst; langsamer Push-in läuft) und 42,7 → 45,79 (Endkarte; Bot-Hüpfer ~44,0 einplanen).

## Shots (nur design/lauf/, Ausschnitte in Original-px; Vorschauen mit Abdeckung in `regie/crops/`, OCR-Prüfung „Hamburg/Hmb/Bezirksamt/25 €/Handelskammer“ = 0 Treffer in allen Vorschauen)
- **04-nur-ein-mensch-word.png** (Frame 1, Entscheidung, Warum, Endkarten-Snip): crop x 258 y 70 w 895 h 860 (Spalten Kästchen + Aufgabe + Wer, Punkte 1–2). Abdeckung: **Schwärzungsbalken x 498 y 148 w 156 h 38** über „in [Ort]“ im Titel Punkt 1; **papierweiß x 346 y 226 w 526 h 192** über den 1. Absatz von Punkt 1 (Bezirksamt, Kammer mit Ortsname, Gebühr 25 €). Spalte „Quelle“ (x ≥ 1153) nie.
- **checkliste-ansicht.png** (Haken, 13-Punkte-Miniatur): crop x 258 y 1133 w 895 h 5430; dieselben Abdeckungen + 1120 px in y (04 = Ansicht ab y 1120, pixelgleich geprüft). Nie über y 1133 (Gründe-Block: Ort + 25 €) und nie ab y 6563 („Was ich nicht prüfen konnte“: Ort 2×). Wer-Zellen (x 878–1151) je Punkt in beats.json (`wer_zellen`): orange 1–7, 10, 11; grün 8, 9, 12, 13.
- **01-prompt-mit-anhang.png**: crop x 40 y 150 w 990 h 560 (ohne „Abendgedanken“, ohne Fußzeile), Rahmen Anhang-Karte x 52 y 160 w 180 h 180; Prompt nur als Textur. Endkarten-Snip: Zeilen „Mach daraus eine Checkliste als“ (x 643 y 628) + „Word-Datei.“ (x 56 y 662).
- **02-quellen.png**: NUR Band x 40 y 128 w 660 h 300 (LfSt Bayern … IHK Chemnitz). Zeile 2 (Kammer mit Ort, y 100–126) und „HmbBfDI“ (y 430–456) nie, auch nicht beim Scrollen.
- **03-entscheidung-gruende.png**: nur Bänder „als_erstes“ x 30 y 66 w 456 h 44 (rechte Kante x 486 hart, danach „in [Ort]“), „grund1“ x 48 y 116 w 392 h 38, „grund2“ x 48 y 186 w 460 h 38. Grund 3 (25 €, Bezirksamt) nie.
- **06-datei-karte.png**: crop x 30 y 10 w 790 h 102, Rahmen um die Karte.
- **07-schritte-zeile.png**: optional nur Zeile y 36–76.
- **05-nicht-pruefen.png: nicht verwenden** (Ort 2× in zwei Zeilen; Inhalt wird nicht erzählt).

## Ton
- Musik: GONE-Original (wie Folge 8–10) ab **153,15 s**, 45,79 s am Stück bis 198,94 s, nie geloopt. Heute keine Überschneidung mit Folge 9 (276,36–322,8) und Folge 10 (57,5–103,66); Bereich überschneidet Folge 8 vom Vortag (154,8–199,96) – Vortags-Wiederverwendung wie Folge 8/10. Tabu 200–276 und die „shit“-Stellen ~20,2 / ~107 liegen außerhalb. Suche `regie/musik_suche.py`.
- **Explizit-Check:** `node scripts/music-explicit-check.mjs .env runs/firma-tag11/regie/musik-abschnitt.mp3` 2× → **0 explizite Wörter** („Abandoned is falling, my friend / Keep it going / And now I'm scarred for life / My love is gone“).
- Struktur: ruhiger Einstieg (Clip 0–5 leiser als 25–40), natürliche Mulde 21,95–23,05 unter „Erstes: das“, Schlag 23,10 genau auf „Gewerbe.“ (23,16), zweiter Akzent ~31,8 auf „Mensch.“, ab 29 lauterer Teil → niedrigerer Faktor.
- Kurve (audio.musicCurve): [0, 0.05] [21.7, 0.05] [21.95, 0.018] [23.05, 0.018] [23.1, 0.065] [23.8, 0.04] [28.8, 0.04] [29.0, 0.033] [44.79, 0.033] [45.79, 0].
- Abstand Stimme ↔ Musik je Akt (`regie/gap.py`, `regie/gap-final.txt`): Hook 24,4 · Rückblick 24,3 · Claude-Lauf 24,5 · Entscheidung 26,9 · Warum 23,8 · Haken 21,6 · Als Nächstes 22,4 · CTA 22,8 dB (jeder Akt ≥ 15 ✓). firma-mix misst nach dem Render erneut, Ziel −14 LUFS, TP −1.
- SFX: Palette wie Folge 8 (`beats.json → sfx_dateien`), Stempel nur Clack/Stamp, Zähler mit Roll, keine Boom-/Sub-Hits, Whooshes 0,18–0,22.

## Hinweise an firma-design
1. **Story-Objekt `checkliste`:** echte, lokal aus Claudes .docx gerenderte Checkliste (keine claude.ai-Pixel; so auch im Guide benennen), Stempel „MENSCH“ ab Frame 0 auf Punkt 1, Plätze hook → off → groß (aus Datei-Karte) → top → ganz (13 Punkte) → off. Abdeckungen exakt wie oben/beats.json; Schwärzung als ehrlicher Balken, nicht als Unschärfe (Ortsname in keinem Frame, auch nicht halb).
2. **Board (12 Felder):** done 0–6 (bis LOGO), WEBSITE = Entwurf (Etikett „ENTWURF“, nie grün), GEWERBE current (gold), BETRIEBE, WERBEBRIEF, ERSTER UMSATZ offen; BETRIEBE bekommt im Übergabe-Beat „?“. Layout für 12 Felder entscheidet Design, Look bleibt. Kein Haken an GEWERBE, kein Umsatz-Zähler.
3. **Rückblick ohne neues Bild:** Bilder nur aus design/lauf/ (Folge 11) → WEBSITE-Feld mit „ENTWURF“ + Offline-Symbol. Das Handy aus Folge 10 nur nach Chef-Freigabe als Serien-Asset.
4. **Warum:** Karte 1 „PFLICHT AB BEGINN“ (+ „§ 14 GewO“, grau „ohne: Verstoß“); Karte 2 = Pfeilkette als ein Block, Stationen färben sich je Wort, nicht nacheinander einblenden (sonst mehrere neue Blöcke). Nie „TAG“ allein.
5. **Haken:** 9 VON 13 erst auf „nur“ (31,48), Reihenfolge der Zellen 1–7, 10, 11; Claude-Zellen 8, 9, 12, 13 gedimmt, nicht verschwinden.
6. **Endkarte:** Snip „Echte Checkliste“ = SHOT04 mit Schwärzung; keine Gebühr, kein Ort.

## Ticket autor-R2-03 → erledigt
- Rückblick „Die“ bis Ende „offline.“ **6,06 s** (Alignment) / 5,95 s (Pegel) ≤ 6,5 ✓; „Heute“ **13,23 s** ≤ 14,5 ✓; Pause nach „Bestellung.“ 0,18 ≤ 0,25 ✓; Komma 0,04 ✓; Tempo 1,0, nicht beschleunigt ✓.
- „Word-Checkliste“ hörbar „Wörd“ (F2 ~1300 Hz statt ~850 bei „Wort“, STT 6/6 „Word“) ✓.
- Warum-Karte Grund 1 ohne „TAG“ ✓ („PFLICHT AB BEGINN“). Pfeilkette Grund 2 liegt genau auf „Die anderen Schritte bauen darauf auf.“ (27,67–29,40) ✓.

## Auffälligkeiten für Chef/Autor (nichts am Skript geändert)
- Slot: briefing.md/thema.md 18:00, Tagesbriefing-Tabelle noch 15:00 (Folge 10 dort 12:00). Regie nimmt 18:00 (briefing.md, Chef 2026-10-30).
- STT hört in 1/6 Endläufen „Websearch“ statt „Websuche“ (isoliert 4/4 korrekt). Kein Retake, da Aussprache WEB-su-che deutsch und Endfassung 5/6; Prüfer kann Neutake des Weg-Satzes verlangen.
- Musik 153,15–198,94 ist für Folge 12/13 heute belegt (frei noch 108,5–153,15 = 44,6 s, 322,8–375,46 = 52,7 s).
