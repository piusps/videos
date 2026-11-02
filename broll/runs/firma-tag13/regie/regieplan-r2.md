# Regieplan · Folge 13 „Werbebrief“ (Serientag 3, nicht erste Folge, letzte des Tages, Slot 2026-10-30 21:00)

firma-regie, 2026-10-30. Grundlage: script.txt (Autor R2 final, 8,5/10, **100 Wörter, Wortlaut unverändert**), thema.md („Für die Regie/Design“, „Länge“), hooks.md, briefing.md, pruefung/autor-runde2.md (H-01, H-03), ../firma-tag9/tagesbriefing-2026-10-30.md (alle Regeln K.-o. inkl. Chef-Entscheide), ../firma-tag4/tagesbriefing-2026-10-29.md, design/lauf/LAUF.md + Screenshots. Vorlagen Folge 8–12 (runs/firma-tag8/, firma-tag10/, firma-tag12/, public/firma-ep/tag11/, tag12/).
Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag13/`), `beats.json` (erzeugt von `regie/make_beats.py`), `musik.txt`, Arbeitsdateien/Tests in `regie/`, Bibel-Zeile Folge 13 (wirtschaftsbuch-v2.md, `regie/bibel_eintrag.py`). Keine Grafik, kein Render.

## Messwerte (Endfassung)
| Messung | Wert | Vorgabe |
|---|---|---|
| Länge voice.mp3 | **44,90 s** (letztes Wort endet 44,67) + 1,0 s Endkarte = **45,90 s** | 40–48 s, ≥ ~44,5 s (H-03) ✓ |
| Sprechtempo | **133,6 wpm** über voice.mp3 inkl. aller Pausen (100 / 44,90 s); 134,3 bis Ende „Business.“; **130,7 wpm** über die ganze Folge inkl. Endkarte | 120–135 ✓ |
| Rückblick „Die“ → Ende „Betriebe.“ | **6,26 s** (Alignment 6,89–13,15), **6,20 s** am Pegel | ≤ 6,5 s ✓, nicht beschleunigt |
| „Heute“ beginnt bei | **13,82 s** (Pegel 13,86) | ≤ 14,5 s ✓ |
| Pausen an Satzgrenzen | 13 Satzgrenzen außerhalb des Rückblicks 0,50–0,70 s, vor „Warum?“ 0,90 s; **Mittel 0,685 s** (0,646 s inkl. der kurzen Rückblick-Grenze 0,15 s) | 0,4–0,7 s, Warum ≤ 0,9, Mittel ≥ 0,5 ✓ |
| Tempo TTS | 1,0 (kein atempo, keine Beschleunigung, keine Verlangsamung) | 1,0 ✓ |
| Stimme integriert | −18,3 LUFS (vor dem Mix) | Mix-Ziel −14 LUFS |
| STT (scribe_v1, de) | **6/6 Läufe 100/100 Wörter identisch** mit script.txt, 0 Abweichungen | ✓ |
| Musik explizit | **0** explizite Wörter (2 Läufe) | 0 ✓ |

## Storyline-Check (Bibel v2 + Kette Tagesbriefing)
- Folge 12 endet mit „Als Nächstes: Was schreibt sie?“ → Folge 13 „Heute schreibt sie ihre erste Werbung.“ (Lauf 13: Brief). Rückblick-Satz 2 „Liste: zwanzig Betriebe.“ = Ergebnis Folge 12. Kein „gestern“, kein Tag gesprochen.
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Nichts abgeschickt, kein Kunde. GEWERBE weiter offen (Mensch), WEBSITE weiter „Entwurf“.
- Übergabe Folge 14 (Serientag 4, 9:00): „Wohin gehen die Briefe?“ → Impressums-Adressen (Lauf 13 Z. 48). Achtung F14: Adressen = Betriebs-/Personennamen, nie lesbar.
- Kein Widerspruch zu früheren Folgen, kein Ticket an firma-autor.

## Stimme
- Serienstimme wie Folge 2–12: ElevenLabs „Keno“ `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **TTS_SPEED=1.0** über `scripts/eleven-tts.mjs`. TTS-Text `regie/script-tts.txt` = script.txt (keine Sonderschreibung nötig).
- 12 Volltakes (`regie/voice-raw1–12.mp3`). STT-sauber nur Take 2 und 6 (sonst „probiere“/„schicke“). Alle Takes sind schnell (Sprechzeit ohne Pausen 31,1–33,3 s): mit Take 6 allein kam die Folge bei voll ausgereizten 0,7-s-Pausen nur auf 44,0 s. Deshalb **Hybrid `voice-raw65h.mp3` (`regie/hybrid.py`)**: Eröffnung + CTA aus Take 6, Mitte „Die … Briefe?“ aus Take 5 (langsamer gesprochen, 32,8 s; im Mittelteil STT-sauber). Schnitte nur in der Stille an den Satzgrenzen „aus. | Die“ und „Briefe? | Kommentiere“, 5-ms-Fades; Pegel Eröffnung −17,1 / Mitte −17,4 / CTA −17,9 dB (gleiche Stimme, gleiche Settings, kein hörbarer Sprung).
- Prosodie Take 5 (Mitte): „Warum?“ steigt 100 → 308 Hz; „Wohin gehen die Briefe?“ steigt am Ende 118 → 244 Hz; „Sie sieht keinen.“ fällt 144 → 81 Hz; „Liste:“ mit Doppelpunkt-Absatz.

### Betonungstest (Satzkontext, Tempo 1,0; `regie/betonung.mjs`, je 2 Takes in `regie/betonung/`, Silben `regie/stress13.py`, Vokal `regie/formant.py`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| „Claude:“ | englisch: F2 925–1124 Hz (dunkles o, „Klohd“), kein au-Gleitlaut; STT „Claude“ 2/2 Test, 6/6 Endläufe; Doppelpunkt-Pause 0,25 s | ok |
| Werbe-Mail | WER- trägt (−14,8 / −14,9 dB), „Mail“ englisch („Meil“); STT „Werbemail“ 2/2 (nur Bindestrich-Schreibung), Endläufe „Werbe-Mail“ | ok |
| Word-Datei | „Word“ F2 1220–1418 Hz = ö/ɜ („Wörd“), nicht deutsches „Wort“ (F2 ~800); WORD- trägt; STT „Word-Datei“ | ok |
| Einwilligung | EIN- trägt (−14,9 / −15,6 dB, höchster Ton 125–128 Hz), -gung fällt; STT korrekt | ok |
| „Anruf braucht Anlass beim Betrieb.“ | AN-ruf und AN-lass je erste Silbe lauter (−14,5…−15,4 vs −17…−19 dB); Be-TRIEB Satzende fallend; STT 2/2 wörtlich | ok |
| Briefvorlage | BRIEF- mit höchstem Ton (172 / 134 Hz vs 91–109), „vor“ etwas lauter (Pegel), hörbar als Kompositum BRIEF-vorlage; STT 2/2 + 6/6 | ok |
| Briefentwurf | BRIEF- höchster Ton (131 / 127 Hz), -wurf am Satzende tragend lauter; STT 2/2 + 6/6 | ok |
| Kommentiere „Brief“ | kom-men-TIE-re; STT setzt „Kommentiere Brief.“ (Anführungszeichen = nur Schreibweise) | ok |
| Warum? / Sie sieht keinen. / Liste: | Warum steigt; „keinen“ fällt kurz; „Liste:“ trägt LIS- | ok |
Kein Wort musste umgeschrieben werden.

### STT (scribe_v1, de) gegen script.txt (`regie/cmp.py`-Logik, `regie/stt-final1–6.json`)
- **6/6 Endläufe 100/100 identisch, 0 Abweichungen.** „Claude: → Liste“ 0,25 s (thema: ~0,2 s) – keine „Websearch“-Falle wie in Folge 12 (dort direkt Websuche nach dem Doppelpunkt).

### Pausen (nur an Satz-/Komma-/Doppelpunktgrenzen, Stille < −45 dBFS, 3-ms-Fades; `regie/splice.py`, Karte `regie/splice-map.json`)
| Stelle | roh | neu |
|---|---|---|
| führt? → Ich | 0,55 | 0,70 |
| aus. → Die (Rückblick beginnt) | 0,43 | 0,70 |
| Betriebe, → bestickt (Rückblick Satz 1) | 0,17 | 0,15 |
| **Bestellung. → Liste (Rückblick Satz 1 → 2)** | 0,31 | **0,15** (kurz wegen Rückblick ≤ 6,5 s, wie F12 0,12) |
| Liste: → zwanzig | 0,12 | 0,12 |
| Betriebe. → Heute (Fahrt zu WERBEBRIEF) | 0,35 | 0,70 |
| Werbung. → Claude (neuer Akt) | 0,23 | 0,70 |
| Claude: → Liste | 0,10 | 0,25 |
| angehängt, → Websuche (Shot 01 → 07) | 0,07 | 0,40 |
| Websuche, → Word-Datei (Shot 07 → 06) | 0,08 | 0,40 |
| Word-Datei. → Sie (Entscheidung) | 0,44 | 0,70 |
| **Anruf. → Warum (vor dem Warum)** | 0,36 | **0,90** |
| Warum? → Werbe-Mail | 0,60 | 0,65 |
| Einwilligung, → auch | 0,04 | 0,20 |
| Firmen. → Ein (Grund 1 → 2) | 0,13 | 0,55 |
| nicht. → Anruf (Grund 2 → 3, Karte 2 ≥ 1,2 s) | 0,15 | 0,70 |
| Betrieb. → Sie sieht keinen | 0,22 | 0,50 |
| keinen. → Als Nächstes (Karte 3 steht allein) | 0,13 | 0,70 |
| Nächstes: → Wohin | 0,19 | 0,35 |
| Briefe? → Kommentiere | 0,15 | 0,70 |
| „Brief“, → ich | 0,28 | 0,40 |
| Briefvorlage. → Damit | 0,56 | 0,70 |
Keine Pause > 0,7 s außer vor dem Warum (0,9). Hybrid roh 39,24 s → 44,90 s nur über Pausen.
words.json: Zeiten aus dem TTS-Alignment, durch Hybrid-Schnitt und Pausen verschoben, Wortenden auf Stille nachgezogen (`regie/snap_words.py`). Caption-Ziffern: hundert → 100, zwanzig → 20, zehn → 10. 100 Caption-Wörter.

## Akte (roter Faden)
Durchgehendes Story-Objekt: **der echte Brief** (`design/lauf/04-brief-word.png`, lokal aus Claudes .docx gerendert). Frame 1 zeigt ihn, im Heute-Beat kommt er aus dem Board-Feld WERBEBRIEF, in der Entscheidung ist er die BRIEF-Karte, im Warum steht er klein oben, in der Übergabe fährt die Kamera auf sein Empfängerfeld, in der Endkarte ist er die Vorlage.
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook (ohne Tag) | 0–6,89 | Brief groß, Kernzeile markiert, Stapel E-MAIL/ANRUF (gestrichen) | hook (Story-Objekt) |
| 2 Rückblick | 6,89–13,82 | Gründungsplan, Produkt-Karte, BETRIEBE abgehakt + Listen-Karte, Fahrt zu WERBEBRIEF | recap |
| 3 Heute | 13,82–16,48 | Feld WERBEBRIEF → Brief mit Betreff | Story-Objekt |
| 4 Claude-Weg | 16,48–21,59 | echte Shots 01 → 07 → 06 | claudeShot ×3 |
| 5 Entscheidung | 21,59–24,55 | drei Karten E-MAIL · ANRUF · BRIEF, Stempel DER BRIEF. | Story-Objekt + Karten |
| 6 Warum | 24,55–34,56 | Brief oben klein, 3 Karten nacheinander, Fußzeile „laut Claude · keine Rechtsberatung“ | why |
| 7 Als Nächstes | 34,56–37,48 | Brief groß, Empfängerfeld | question |
| 8 CTA | 37,48–45,90 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json; Anker immer Wort + after (beats.json).

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,89 | Wie viel Umsatz | **Frame 1 = Ergebnis:** Hook-Frage komplett ab Frame 0; echter Brief (Logo oben rechts, gelbe Platzhalter); links EIN Kartenstapel „E-MAIL / ANRUF“; auf „Umsatz“ Textmarker-Wisch über „Gestickt wird erst, wenn Sie bestellen.“; HUD TAG 3 | langsamer Push-in, Punch +4 % auf „Umsatz“ | Was ist das für ein Brief? | Pop, Whoosh hoch, Page, Bump | M-002 |
| 0,89–3,71 | macht ein Unternehmen, das eine KI 100 Tage lang | kein neuer Text, je ein Ereignis pro 0,5 s: E-MAIL gestrichen („macht“), ANRUF gestrichen („Unternehmen“), Logo-Glanz („das“), Brief setzt sich („KI“), Punch „100“, Licht-Sweep („Tage“), Kamera auf Kernzeile („lang“) | Mini-Punch „100“ | Warum nicht Mail oder Anruf? | Tick, Tick, Pop hoch, Klick, Pop hoch, Tick, Whoosh kurz | M-011 |
| 3,71–5,26 | ganz alleine führt? | Stempel „GANZ ALLEINE.“, Punch-in, Kernzeile pulst (4,80) | Punch-in 4 % | Wirklich ohne Mensch? | Whoosh, Clack, Bump, Tick | M-011 |
| 5,26–6,89 | Ich probier das aus. | Brief + Stapel raus, Board ein (überlappt nie), Maskottchen hüpft (ganz im Bild). Kein Slam | Pull-back | Was ist das Experiment? | Whoosh, Pop, Klick | Serienrahmen |
| 6,89–10,25 | Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, | Board: PRODUKT … LOGO grün, WEBSITE „ENTWURF“, GEWERBE offen + MENSCH, BETRIEBE gold, WERBEBRIEF/ERSTER UMSATZ offen; Karte „SHIRTS MIT LOGO“ auf „verkauft“; Handwerker-Silhouetten auf „Betriebe“ | ruhig | Worum geht es? | Whoosh hoch leicht, Pop, Tick | Rückblick |
| 10,25–11,75 | bestickt erst auf Bestellung. | Banner „erst auf Bestellung bestickt“ | steht | Ohne Lager? | Page | Rückblick |
| 11,75–13,82 | Liste: 20 Betriebe. | BETRIEBE leuchtet (zuletzt erledigt) + grüner Haken auf „Liste:“; Karte „20 BETRIEBE · CHEMNITZ“, klein „5 zuerst“ (Miniatur liste-anonym, Textur); in der Pause Fahrt zu WERBEBRIEF (gold) | Push-in BETRIEBE, Fahrt zu WERBEBRIEF | Zwanzig Betriebe – und jetzt? | Check, Roll, Whoosh | Rückblick |
| 13,82–16,48 | Heute schreibt sie ihre erste Werbung. | Pill „HEUTE: WERBEBRIEF“; Cursor im Feld („schreibt“); auf „Werbung“ kommt der Brief nach vorn, Betreff leuchtet | Fahrt durch das Feld auf den Brief | Darf sie Betriebe einfach anschreiben? | Whoosh, Chime, Typing, Page | Heute |
| 16,48–18,60 | Claude: Liste und Logo angehängt, | echter **Shot 01**: Rahmen auf „Shirt-Firma Ergebnis Betriebe.md“ („Liste“), dann „Kolonnenshirt-Logo.svg“ („Logo“), Zeiger tippt „+“ („angehängt“); Prompt nur Textur (2,12 s) | Push-in auf die Anhang-Karten | Womit fängt sie an? | Page, Pop tief, Pop hoch, Klick | M-004 |
| 18,60–19,83 | Websuche, | echter **Shot 07**: nur Denkblock-Titel „Suche nach UWG-Regeln für E-Mail-Werbung im B2B-Bereich“, Glanz auf „Websuche“ (1,23 s) | leichter Push-in | Was darf man eigentlich? | Whoosh kurz, Typing | M-004 |
| 19,83–21,59 | Word-Datei. | echter **Shot 06**: „Kolonnenshirt werbebrief · Dokument · DOCX“, Rahmen auf „Word-Datei“, Klick; Pause: steht (1,76 s) | Push-in, Halt | Und wie verschickt sie es? | Pop hoch, Klick | M-004 |
| 21,59–24,55 | Sie wählt Brief statt Mail oder Anruf. | Datei-Karte klappt zum Brief auf; EIN Block „E-MAIL · ANRUF · BRIEF“ auf „Sie“; „Brief“ hebt sich, „Mail“ gestrichen, Stempel „DER BRIEF.“ auf Mail-Ende (22,92), „Anruf“ gestrichen; 0,9-s-Pause: steht, Musik-Mulde | Push-in auf die Brief-Karte, Halt | Warum ausgerechnet ein Brief? | Whoosh, Power, Tick, Clack, Tick; Mulde 23,75–24,45 | M-011 |
| 24,55–29,05 | Warum? Werbe-Mail braucht Einwilligung, auch bei Firmen. | Brief klein oben; Pill „WARUM?“ mit gedimmter Fußzeile **„laut Claude · keine Rechtsberatung“** (ein Block, bleibt bis 34,56); Karte 1 „E-MAIL: FÄLLT GANZ WEG“ auf „braucht“, klein „ohne Einwilligung · auch B2B“, grau „per Mail fragen ✗“; Puls auf „auch B2B“ bei „Firmen“ | kurze Fahrt zu den Karten, ruhig | Auch bei Firmen? Und der Brief? | Whoosh airy, Pop (Musik-Akzent), Pop tief, Tick | Warum-Beat |
| 29,05–30,78 | Ein Brief nicht. | Karte 2 „BRIEF: OHNE EINWILLIGUNG ERLAUBT“, klein „mit Widerspruchshinweis“, grau „E-Mail ✗“; Haken an der Brief-Miniatur (1,73 s) | leichter Push-in | Und warum nicht anrufen? | Pop hoch, Check | Warum-Beat |
| 30,78–34,56 | Anruf braucht Anlass beim Betrieb. Sie sieht keinen. | **H-01:** Karte 3 „ANRUF: KEIN KONKRETER GRUND“, klein „bei keinem der 5“, grau „„Shirts sind nützlich“ ✗“ – steht **allein 3,78 s**; 5 Betriebs-Punkte auf „Betrieb“, grauen auf „keinen“ aus. Kein Brief-Zoom, kein Versand, kein ERGÄNZEN | Push-in Karte 3, Halt | Und wohin jetzt mit dem Brief? | Pop tief, Tick, Pop tief, Roll | Warum-Beat |
| 34,56–37,48 | Als Nächstes: Wohin gehen die Briefe? | Karten + Fußzeile raus; Pill „ALS NÄCHSTES“; Brief groß zurück, Kamera auf Empfängerblock: gelbe Platzhalter pulsen („Wohin“), Versand-Zeile pulst mit (vorhandener Brief-Text, kein Stempel); Karte „WOHIN GEHEN DIE BRIEFE?“ auf „gehen“ | Push-in Empfängerfeld, Halt | An welche Adressen? | Whoosh airy, Pop, Tick, Pop hoch, Pop tief | offener Faden |
| 37,48–45,90 | Kommentiere „Brief“, … fürs eigene Business. | Endkarte: Keyword „Brief“ tippt, Haken, Flieger; Block „FRAGE + BRIEFVORLAGE“ auf „Frage“ (Anhang-Karten + Brief-Miniatur unlesbar); Block „BRIEFENTWURF IN 10 MINUTEN“ auf Damit+0,05; Puls „Briefentwurf“; Bot-Hüpfer ~44,3; Halt bis 45,90 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Whoosh hoch, Pop hoch, Chime, Tick, Pop, Tick | M-007 |

**Textregel-Prüfung** (neue Textblöcke ohne Untertitel, `make_beats.py`): Abstände 3,98 / 3,92 / 2,35 / 1,50 / 2,07 / 1,40 / 1,26 / 2,12 / 1,23 / 1,76 / 1,32 / 1,64 / 1,68 / 2,82 / 1,73 / 3,78 / 1,53 / 2,10 / 1,25 / 1,94 s → alle ≥ 1,2 s. Karten/Stempel ≤ 4 Wörter (+ kleine Unterzeile; Ausnahme feste Hook-Frage). Einzige Gleichzeitigkeit: Frame 0 (Hook-Frage + Stapel E-MAIL/ANRUF, 2 Wörter), wie Folge 10–12. Pill „WARUM?“ + gedimmte Fußzeile = ein Block (Fußzeile klein, kein großer Text, R1-05).
**Warum-Karten (H-01):** 1 = 26,23–29,05 (2,82 s), 2 = 29,05–30,78 (1,73 s), **3 = 30,78–34,56 allein (3,78 s)**. ERGÄNZEN-Stempel entfällt im Video (bleibt in Caption/Guide); Versand-Feld nur als Puls im Übergabe-Beat zusammen mit dem Empfängerfeld, ohne eigenen Textblock.
**Stempel-Wörter aus dem Lauf:** GANZ ALLEINE. (Serie), DER BRIEF. (Z. 25), FÄLLT GANZ WEG (Z. 34), OHNE EINWILLIGUNG ERLAUBT (Z. 36), KEIN KONKRETER GRUND (Z. 35), keine Rechtsberatung (Z. 25), 20 BETRIEBE · CHEMNITZ (Lauf 12/Prompt 13).
**Weg-Beat:** 01 16,48–18,60 (2,12 s, deckt „Liste und Logo angehängt“), 07 18,60–19,83 (1,23 s, deckt „Websuche“ 18,91–19,61), 06 19,83–21,59 (1,76 s, deckt „Word-Datei“ 20,04–20,95) ✓.
**Hook 0–6 s:** Ereignisse 0,03 / 0,23 / 0,45 / 0,49 / 0,89 / 1,33 / 1,89 / 2,37 / 2,86 / 3,23 / 3,52 / 3,65 / 3,98 / 4,32 / 4,80 / 5,21 / 5,53 / 6,00 → jedes 0,5-s-Fenster belegt (Prüfung `make_beats.py`).
**M-009 (≤ 1,5 s ohne Änderung):** längste Strecken 22,92 → 24,55 (Stempel, dann 0,9-s-Pause, Anruf-Strich 23,19 dazwischen) und 41,38 → 42,08 → 42,91 (Tick auf „10“ eingeplant).

## Shots (nur design/lauf/, Ausschnitte in Original-px, Details in beats.json → shots)
- **04-brief-word.png** (1590 × 1335, Story-Objekt): Logo x 1083 y 135 w 332 h 125; Empfänger x 173 y 362 w 393 h 110; Betreff y 588–630; Preise y 803–888; **Kernzeile** x 190 y 893 w 560 h 40; **Versand** x 190 y 938 w 675 h 40. Kein Name im Brief.
- **01-prompt-mit-anhang.png** (1040 × 830): crop x 36 y 112 w 984 h 640; lesbar nur die Anhang-Karten (x 53/245, y 132, je 178 × 178), „+“ bei x 52 y 702; Prompt Textur; „Abendgedanken“ und Fußzeile nie.
- **07-schritte-zeile.png** (1206 × 205): nur Titelzeile y 8–48 („Suche nach UWG-Regeln …“). Die Zeile „… 15 weitere Schritte“ sagt nicht „Web durchsucht“.
- **06-datei-karte.png** (1206 × 170): crop x 38 y 20 w 785 h 102.
- **02-rechtslage-quellen.png**: optional nur „Meine Entscheidung: der Brief.“ (x 40 y 4 w 330 h 36) als Teil des Stempels.
- **03-entscheidung-gruende.png**: optional unlesbare Textur hinter den Warum-Karten.
- Nie: 05-nicht-pruefen.png (Personenname), Anhang-Inhalt „Shirt-Firma Ergebnis Betriebe.md“ (Betriebsnamen, Hamburg), claude.ai-Sidebar.

## Ton
- Musik: GONE-Original (wie Folge 8–12) ab **107,5 s**, 45,9 s am Stück bis 153,4 s, nie geloopt. Heute frei war nur 108,5–153,15 (44,65 s, zu kurz); Start direkt hinter „shit“ (Track 107,10–107,28). Ende überlappt Folge 11 um 0,25 s nur im Fade. Vortag Folge 6 = 100,16–146,91 (Vortags-Wiederverwendung wie F8/10/11/12). Details `musik.txt`.
- **Explizit-Check:** `node scripts/music-explicit-check.mjs .env runs/firma-tag13/regie/musik-abschnitt.mp3` 2× → **0 explizite Wörter**.
- Struktur: Abschnitt laut → niedrige Faktoren (0,035 / 0,026 / 0,028); Kurven-Mulde 23,75–24,45 in der Pause vor „Warum?“ (Stille vor der Pointe), Akzent 24,55; ruhiger Ausklang im Stück ab 43,2; Endkarte angehoben.
- Kurve (audio.musicCurve): [0,0.035] [13.4,0.035] [13.7,0.026] [23.75,0.026] [23.95,0.012] [24.45,0.012] [24.55,0.05] [25.3,0.028] [42.9,0.028] [43.3,0.045] [44.7,0.045] [44.9,0.08] [45.4,0.08] [45.9,0].
- Abstand Stimme ↔ Musik je Akt (`regie/gap.py`, `regie/gap-final.txt`): Hook 21,2 · Rückblick 21,5 · Heute 18,5 · Claude-Weg 19,8 · Entscheidung 21,2 · Warum 19,1 · Als Nächstes 18,4 · CTA 20,3 dB (jeder Akt ≥ 15 ✓). firma-mix misst nach dem Render neu, Ziel −14 LUFS, TP −1.
- SFX: Palette wie Folge 8 (`beats.json → sfx_dateien`), Stempel nur Clack, Streichungen Tick, keine Boom-/Sub-Hits, Whooshes 0,18–0,22.

## Hinweise an firma-design
1. **Board:** Layout tag11/tag12 (9 Felder). done [0,1,2,3,6] (BETRIEBE wird auf „Liste:“ abgehakt), WEBSITE „ENTWURF“ (nie grün), GEWERBE offen mit MENSCH + Personen-Symbol (kein Haken, wie Folge 12), WERBEBRIEF current (gold ab Ende „Betriebe.“), ERSTER UMSATZ offen. Engine: `current 7, done [0,1,2,3,6], wip [4,5]`. Kein Umsatz-Zähler.
2. **Brief:** nur aus 04-brief-word.png/brief-ansicht.png; je Beat nur der genannte Bereich lesbar (Kernzeile / Betreff / Empfänger), Rest Textur. Kein Kuvert, keine Briefmarke, keine Hand.
3. **Warum-Akt:** Fußzeile „laut Claude · keine Rechtsberatung“ klein + gedimmt über den Untertiteln, 24,55–34,56. Karte 3 steht allein ≥ 3,7 s (H-01). Kein Paragraf, nie „Gesetz“/„verboten“ groß.
4. **Übergabe:** kein ERGÄNZEN-Stempel; Empfängerfeld + Versand-Zeile nur als Puls, eine Frage-Karte.
5. **Endkarte:** zwei Blöcke („FRAGE + BRIEFVORLAGE“, „BRIEFENTWURF IN 10 MINUTEN“), weil „Frage“ → „Briefvorlage“ nur 0,5 s auseinander liegen.

## Auffälligkeiten für Chef/Autor (nichts am Skript geändert)
- Die Serienstimme spricht dieses Skript schnell (12 Takes, Sprechzeit 31,1–33,3 s). ≥ 44,5 s war nur mit Hybrid-Take + Satzpausen fast durchgehend 0,7 s erreichbar (Mittel 0,685). Spielraum nach oben ist praktisch null; ein kürzeres Skript würde < 44,5 s landen.
- 10 von 12 Takes: STT hört „probiere“ statt „probier“ (feste Eröffnung) und teils „schicke“ statt „schick“ – Sprecher-Tendenz zum Schwa; gewählt nur STT-saubere Teile.
- Musik: Für einen sechsten GONE-Abschnitt am selben Tag gibt es keinen ganz freien Bereich ≥ 45,9 s mehr (0,25 s Ausklang-Überlappung mit Folge 11).
- Bibel v2: Zeilen 10–12 tragen abweichende Slot-Zeiten (10 = „15:00“, 11/12 = „18:00“, Tagesbriefing: 12:00/15:00/18:00) – nicht von mir geändert, nur gemeldet.
