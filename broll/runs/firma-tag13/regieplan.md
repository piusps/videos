# Regieplan · Folge 13 „Werbebrief“ (Serientag 4, **erste Folge des Tages**, Slot 2026-10-31 09:00) · R3 Tag-Umplanung

firma-regie, 2026-10-30. **R3:** Folge 13 läuft jetzt 2026-10-31 09:00 als erste Folge von Serientag 4. script.txt an zwei Stellen geändert (Autor R3, Vergleich pruefung/script-r2.txt): Eröffnung endet mit „Ich probier das aus. Tag vier.“, letzter CTA-Satz „Damit hast du in zehn Minuten deinen eigenen Briefentwurf.“ (100 Wörter, Wortlaut sonst unverändert). Nur diese zwei Stellen neu eingesprochen und samplegenau eingesetzt (Lehre Folge 10); Rückblick bis „Briefvorlage.“ = R2-Samples, nur um −0,30 s verschoben.
R2-Fassung gesichert: `regie/regieplan-r2.md`, `regie/beats-r2.json`, `regie/voice-r2.mp3`, `regie/words-r2.json`, `regie/musik-r2.txt`, `regie/curve-r2.json`, `regie/splice-map-r2.json`, `regie/make_beats_r2.py`.
Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag13/`), `beats.json` (erzeugt von `regie/make_beats.py`), `musik.txt`, Arbeitsdateien/Tests in `regie/`. Keine Grafik, kein Render.

## Messwerte (Endfassung R3)
| Messung | Wert | Vorgabe |
|---|---|---|
| Länge voice.mp3 | **43,99 s** (letztes Wort endet 43,68) + 1,0 s Endkarte = **45,0 s** (`beats.json seconds`) | 40–48 s, Ziel ≥ 44,5 s ✓ |
| Sprechtempo | **133,3 wpm über die ganze Folge inkl. Pausen und Endkarte** (100 / 45,0 s); nur voice.mp3 136,4 wpm (100 / 43,99 s) | 120–135 ✓ (Folge) |
| Rückblick „Die“ → Ende „Betriebe.“ | **6,26 s** (6,59–12,85; R2-Samples unverändert) | ≤ 6,5 s ✓, nicht beschleunigt |
| „Heute“ beginnt bei | **13,52 s** | ≤ 14,5 s ✓ (Puffer 0,98 s) |
| Tempo TTS | 1,0 (kein atempo, keine Beschleunigung) | 1,0 ✓ |
| STT (scribe_v1, de) Endfassung | **10/10 Läufe 100/100 Wörter identisch** mit script.txt, 0 Abweichungen (`regie/stt-r3-1..3.json` + 7 Testläufe derselben Datei) | ✓ |
| „Tag vier“ | STT 3/3 isoliert „Tag vier“ (`regie/retake/open4-tagvier.mp3`), im Volltext 10/10 „Tag vier“; Vokal F2 ≈ 2140–2320 Hz = i (vier), nicht ü (für) (`regie/vier_check.py`) | ✓ |
| Musik explizit | **0** explizite Wörter (2 Läufe auf dem Abschnitt mit Mute) | 0 ✓ |

## R3 · Was sich geändert hat
- **Eröffnung neu:** 35 Takes der ganzen Eröffnung (Serienstimme, Tempo 1,0, `regie/retake2.mjs` = Settings aus `regie/el.mjs`; 8 Takes mit next_text-Kontext `regie/retake3.mjs` nur als Test, nicht verwendet). Isoliert hört STT bei allen Takes – auch bei der R2-Eröffnung – „probiere“; maßgeblich ist der Volltext. 12 Kandidaten im Volltext getestet → **Take `regie/retake/open4.mp3`** (Settings wie R2, „Tag vier.“ fallend) = 10/10 sauber. Pausen roh: führt? → Ich 0,40 · aus. → Tag 0,32 (Stille-Messung 0,29 s; mit auf 0,55 aufgefüllter Pause hörte STT 2/7× „probiere“ → roh gelassen).
- **CTA-Satz 2 neu:** 5 Takes beider CTA-Sätze (Prosodie im Zusammenhang), verwendet nur „Damit … Briefentwurf.“ aus **`regie/retake/cta1.mp3`** (STT 3/3 isoliert). Betonung (`regie/cta_stress.py`): Höchster Ton auf „zehn“ (155 Hz), „deinen“ 94 Hz, „eigenen“ 107 Hz < „Minuten“ 121 Hz → „eigenen“ nicht überbetont; „Briefentwurf“ fällt (86 Hz).
- **Schnitt (`regie/splice_r3.py`, Karte `regie/splice-map.json`):** Take open4 0–6,265 s | 0,35 s Stille | R2 6,915–40,695 s (unverändert) | 0,65 s Stille | cta1 3,885 s–Ende. Nahtpausen am Pegel: „4.“ → „Die“ 0,40 s, „Briefvorlage.“ → „Damit“ 0,70 s (= R2). 3-ms-Fades, 25 ms Raumton je Seite. Kreuzkorrelation Mitte R3 vs. R2: 0,99998 bei 1 Sample Versatz. Pegel Eröffnung −18,0 / R2-Mitte −17,6 / CTA −17,6 dB RMS.
- **words.json:** Eröffnung und CTA-Satz 2 aus den STT-Wortzeiten der Takes, Mitte = R2-words.json − 0,30 s. Ziffern: hundert → 100, zwanzig → 20, zehn → 10, **vier → 4** („Tag 4.“ wie Folge 9 „Tag 3.“). 100 Wörter.
- **beats.json/Plan:** alle Anker ab dem Rückblick um −0,30 s nachgezogen, Hook B04 mit Tages-Slam **TAG 4** (wie Folge 9), Kopf `serientag 4`, `ersteFolgeDesTages true`, `date 2026-10-31`, `slot 2026-10-31 09:00`, `seconds 45.0`, neue Musik (musicStart 0,10 + musicMute).

## Storyline-Check (Bibel v2 + Kette Tagesbriefing)
- Folge 12 endet mit „Als Nächstes: Was schreibt sie?“ → Folge 13 „Heute schreibt sie ihre erste Werbung.“ (Lauf 13: Brief). Rückblick-Satz 2 „Liste: zwanzig Betriebe.“ = Ergebnis Folge 12. Kein „gestern“. Tag nur in der Eröffnung: „Tag vier.“ (erste Folge Serientag 4, wie Folge 9 „Tag drei.“).
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Nichts abgeschickt, kein Kunde. GEWERBE weiter offen (Mensch), WEBSITE weiter „Entwurf“.
- Übergabe Folge 14 (Serientag 4, nach Folge 13, ohne Tag in der Eröffnung): „Wohin gehen die Briefe?“ → Impressums-Adressen (Lauf 13 Z. 48). Achtung F14: Adressen = Betriebs-/Personennamen, nie lesbar.
- Kein Widerspruch zu früheren Folgen, kein Ticket an firma-autor.

## Stimme (R2-Mitte; R3-Änderungen oben)
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

### Pausen R2 (gelten für die Mitte „Die … Briefvorlage.“ unverändert; Eröffnung/CTA R3 siehe oben) (nur an Satz-/Komma-/Doppelpunktgrenzen, Stille < −45 dBFS, 3-ms-Fades; `regie/splice.py`, Karte `regie/splice-map.json`)
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
Keine Pause > 0,7 s außer vor dem Warum (0,9). R3 (STT-Wortzeiten): führt? → Ich 0,40 · aus. → Tag 0,32 · 4. → Die 0,39 · Briefvorlage. → Damit 0,71.
words.json: Zeiten aus dem TTS-Alignment, durch Hybrid-Schnitt und Pausen verschoben, Wortenden auf Stille nachgezogen (`regie/snap_words.py`). Caption-Ziffern: hundert → 100, zwanzig → 20, zehn → 10. 100 Caption-Wörter.

## Akte (roter Faden)
Durchgehendes Story-Objekt: **der echte Brief** (`design/lauf/04-brief-word.png`, lokal aus Claudes .docx gerendert). Frame 1 zeigt ihn, im Heute-Beat kommt er aus dem Board-Feld WERBEBRIEF, in der Entscheidung ist er die BRIEF-Karte, im Warum steht er klein oben, in der Übergabe fährt die Kamera auf sein Empfängerfeld, in der Endkarte ist er die Vorlage.
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook (mit TAG 4) | 0–6,59 | Brief groß, Kernzeile markiert, Stapel E-MAIL/ANRUF (gestrichen) | hook (Story-Objekt) |
| 2 Rückblick | 6,59–13,52 | Gründungsplan, Produkt-Karte, BETRIEBE abgehakt + Listen-Karte, Fahrt zu WERBEBRIEF | recap |
| 3 Heute | 13,52–16,18 | Feld WERBEBRIEF → Brief mit Betreff | Story-Objekt |
| 4 Claude-Weg | 16,18–21,29 | echte Shots 01 → 07 → 06 | claudeShot ×3 |
| 5 Entscheidung | 21,29–24,25 | drei Karten E-MAIL · ANRUF · BRIEF, Stempel DER BRIEF. | Story-Objekt + Karten |
| 6 Warum | 24,25–34,26 | Brief oben klein, 3 Karten nacheinander, Fußzeile „laut Claude · keine Rechtsberatung“ | why |
| 7 Als Nächstes | 34,26–37,17 | Brief groß, Empfängerfeld | question |
| 8 CTA | 37,17–45,00 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json; Anker immer Wort + after (beats.json).

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,76 | Wie viel Umsatz | **Frame 1 = Ergebnis:** Hook-Frage komplett ab Frame 0; echter Brief (Logo oben rechts, gelbe Platzhalter); links EIN Kartenstapel „E-MAIL / ANRUF“; auf „Umsatz“ Textmarker-Wisch über „Gestickt wird erst, wenn Sie bestellen.“; HUD TAG 4 | langsamer Push-in, Punch +4 % auf „Umsatz“ | Was ist das für ein Brief? | Pop, Whoosh hoch, Page, Bump | M-002 |
| 0,76–3,24 | macht ein Unternehmen, das eine KI 100 Tage lang | kein neuer Text, je ein Ereignis pro 0,5 s: E-MAIL gestrichen („macht“), ANRUF gestrichen („Unternehmen“), Logo-Glanz („das“), Brief setzt sich („KI“), Punch „100“, Licht-Sweep („Tage“), Kamera auf Kernzeile („lang“) | Mini-Punch „100“ | Warum nicht Mail oder Anruf? | Tick, Tick, Pop hoch, Klick, Pop hoch, Tick, Whoosh kurz | M-011 |
| 3,24–4,52 | ganz alleine führt? | Stempel „GANZ ALLEINE.“, Punch-in, Kernzeile pulst (4,30, Pause nach „führt?“) | Punch-in 4 % | Wirklich ohne Mensch? | Whoosh, Clack, Bump, Tick | M-011 |
| 4,52–6,59 | Ich probier das aus. Tag 4. | Brief + Stapel raus, Board ein (überlappt nie), Maskottchen hüpft auf „probier“; **Tages-Slam „TAG 4“** auf „Tag“ (5,70) / „4.“ (5,96) wie Folge 9, steht bis „Die“ | Pull-back | Was ist das Experiment? Tag 4 von 100? | Whoosh, Pop, Klick („aus“), Whoosh hoch („Tag“), Clack („4“) | Serienrahmen |
| 6,59–9,95 | Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, | Board: PRODUKT … LOGO grün, WEBSITE „ENTWURF“, GEWERBE offen + MENSCH, BETRIEBE gold, WERBEBRIEF/ERSTER UMSATZ offen; Karte „SHIRTS MIT LOGO“ auf „verkauft“; Handwerker-Silhouetten auf „Betriebe“ | ruhig | Worum geht es? | Whoosh hoch leicht, Pop, Tick | Rückblick |
| 9,95–11,45 | bestickt erst auf Bestellung. | Banner „erst auf Bestellung bestickt“ | steht | Ohne Lager? | Page | Rückblick |
| 11,45–13,52 | Liste: 20 Betriebe. | BETRIEBE leuchtet (zuletzt erledigt) + grüner Haken auf „Liste:“; Karte „20 BETRIEBE · CHEMNITZ“, klein „5 zuerst“ (Miniatur liste-anonym, Textur); in der Pause Fahrt zu WERBEBRIEF (gold) | Push-in BETRIEBE, Fahrt zu WERBEBRIEF | Zwanzig Betriebe – und jetzt? | Check, Roll, Whoosh | Rückblick |
| 13,52–16,18 | Heute schreibt sie ihre erste Werbung. | Pill „HEUTE: WERBEBRIEF“; Cursor im Feld („schreibt“); auf „Werbung“ kommt der Brief nach vorn, Betreff leuchtet | Fahrt durch das Feld auf den Brief | Darf sie Betriebe einfach anschreiben? | Whoosh, Chime, Typing, Page | Heute |
| 16,18–18,30 | Claude: Liste und Logo angehängt, | echter **Shot 01**: Rahmen auf „Shirt-Firma Ergebnis Betriebe.md“ („Liste“), dann „Kolonnenshirt-Logo.svg“ („Logo“), Zeiger tippt „+“ („angehängt“); Prompt nur Textur (2,12 s) | Push-in auf die Anhang-Karten | Womit fängt sie an? | Page, Pop tief, Pop hoch, Klick | M-004 |
| 18,30–19,53 | Websuche, | echter **Shot 07**: nur Denkblock-Titel „Suche nach UWG-Regeln für E-Mail-Werbung im B2B-Bereich“, Glanz auf „Websuche“ (1,23 s) | leichter Push-in | Was darf man eigentlich? | Whoosh kurz, Typing | M-004 |
| 19,53–21,29 | Word-Datei. | echter **Shot 06**: „Kolonnenshirt werbebrief · Dokument · DOCX“, Rahmen auf „Word-Datei“, Klick; Pause: steht (1,76 s) | Push-in, Halt | Und wie verschickt sie es? | Pop hoch, Klick; Musik-Mute 19,92–20,62 (gesungenes Schimpfwort, unter der Stimme) | M-004 |
| 21,29–24,25 | Sie wählt Brief statt Mail oder Anruf. | Datei-Karte klappt zum Brief auf; EIN Block „E-MAIL · ANRUF · BRIEF“ auf „Sie“; „Brief“ hebt sich, „Mail“ gestrichen, Stempel „DER BRIEF.“ auf Mail-Ende (22,61), „Anruf“ gestrichen; 0,87-s-Pause: steht, natürliche Pause im Stück | Push-in auf die Brief-Karte, Halt | Warum ausgerechnet ein Brief? | Whoosh, Power, Tick, Clack, Tick; Pause im Stück 22,8–24,25 | M-011 |
| 24,25–28,75 | Warum? Werbe-Mail braucht Einwilligung, auch bei Firmen. | Brief klein oben; Pill „WARUM?“ mit gedimmter Fußzeile **„laut Claude · keine Rechtsberatung“** (ein Block, bleibt bis 34,26); Karte 1 „E-MAIL: FÄLLT GANZ WEG“ auf „braucht“, klein „ohne Einwilligung · auch B2B“, grau „per Mail fragen ✗“; Puls auf „auch B2B“ bei „Firmen“ | kurze Fahrt zu den Karten, ruhig | Auch bei Firmen? Und der Brief? | Whoosh airy, Pop (Wiedereinsatz des Stücks), Pop tief, Tick | Warum-Beat |
| 28,75–30,48 | Ein Brief nicht. | Karte 2 „BRIEF: OHNE EINWILLIGUNG ERLAUBT“, klein „mit Widerspruchshinweis“, grau „E-Mail ✗“; Haken an der Brief-Miniatur (1,73 s) | leichter Push-in | Und warum nicht anrufen? | Pop hoch, Check | Warum-Beat |
| 30,48–34,26 | Anruf braucht Anlass beim Betrieb. Sie sieht keinen. | **H-01:** Karte 3 „ANRUF: KEIN KONKRETER GRUND“, klein „bei keinem der 5“, grau „„Shirts sind nützlich“ ✗“ – steht **allein 3,78 s**; 5 Betriebs-Punkte auf „Betrieb“, grauen auf „keinen“ aus. Kein Brief-Zoom, kein Versand, kein ERGÄNZEN | Push-in Karte 3, Halt | Und wohin jetzt mit dem Brief? | Pop tief, Tick, Pop tief, Roll | Warum-Beat |
| 34,26–37,17 | Als Nächstes: Wohin gehen die Briefe? | Karten + Fußzeile raus; Pill „ALS NÄCHSTES“; Brief groß zurück, Kamera auf Empfängerblock: gelbe Platzhalter pulsen („Wohin“), Versand-Zeile pulst mit (vorhandener Brief-Text, kein Stempel); Karte „WOHIN GEHEN DIE BRIEFE?“ auf „gehen“ | Push-in Empfängerfeld, Halt | An welche Adressen? | Whoosh airy, Pop, Tick, Pop hoch, Pop tief | offener Faden |
| 37,17–45,00 | Kommentiere „Brief“, … deinen eigenen Briefentwurf. | Endkarte: Keyword „Brief“ tippt, Haken, Flieger; Block „FRAGE + BRIEFVORLAGE“ auf „Frage“ (Anhang-Karten + Brief-Miniatur unlesbar); Block „BRIEFENTWURF IN 10 MINUTEN“ auf Damit+0,05 (41,13); Puls „Briefentwurf“ (43,06); Bot-Hüpfer ~44,3; Halt bis 45,00 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Whoosh hoch, Pop hoch, Chime, Tick, Pop, Tick | M-007 |

**Textregel-Prüfung** (neue Textblöcke ohne Untertitel, `make_beats.py`, R3): Abstände 3,50 / 2,20 (TAG 4) / 1,90 / 2,35 / 1,50 / 2,07 / 1,40 / 1,26 / 2,12 / 1,23 / 1,76 / 1,32 / 1,64 / 1,68 / 2,82 / 1,73 / 3,78 / 1,53 / 2,10 / 1,25 / 1,99 s → alle ≥ 1,2 s. Karten/Stempel ≤ 4 Wörter (+ kleine Unterzeile; Ausnahme feste Hook-Frage). Einzige Gleichzeitigkeit: Frame 0 (Hook-Frage + Stapel E-MAIL/ANRUF, 2 Wörter), wie Folge 10–12. Pill „WARUM?“ + gedimmte Fußzeile = ein Block (Fußzeile klein, kein großer Text, R1-05).
**Warum-Karten (H-01):** 1 = 25,93–28,75 (2,82 s), 2 = 28,75–30,48 (1,73 s), **3 = 30,48–34,26 allein (3,78 s)**. ERGÄNZEN-Stempel entfällt im Video (bleibt in Caption/Guide); Versand-Feld nur als Puls im Übergabe-Beat zusammen mit dem Empfängerfeld, ohne eigenen Textblock.
**Stempel-Wörter aus dem Lauf:** GANZ ALLEINE. (Serie), DER BRIEF. (Z. 25), FÄLLT GANZ WEG (Z. 34), OHNE EINWILLIGUNG ERLAUBT (Z. 36), KEIN KONKRETER GRUND (Z. 35), keine Rechtsberatung (Z. 25), 20 BETRIEBE · CHEMNITZ (Lauf 12/Prompt 13).
**Weg-Beat:** 01 16,18–18,30 (2,12 s, deckt „Liste und Logo angehängt“), 07 18,30–19,53 (1,23 s, deckt „Websuche“ 18,61–19,31), 06 19,53–21,29 (1,76 s, deckt „Word-Datei“ 19,74–20,65) ✓.
**Hook 0–6 s:** Ereignisse 0,03 / 0,18 / 0,40 / 0,44 / 0,76 / 1,12 / 1,66 / 2,10 / 2,48 / 2,78 / 3,04 / 3,18 / 3,50 / 3,86 / 4,30 / 4,47 / 4,66 / 5,16 / 5,70 / 5,96 → jedes 0,5-s-Fenster belegt (Prüfung `make_beats.py`).
**M-009 (≤ 1,5 s ohne Änderung):** längste Strecken 22,61 → 24,25 (Stempel, dann 0,87-s-Pause, Anruf-Strich 22,89 dazwischen) und 41,13 → 41,76 → 43,06 (Tick auf „10“, Puls „Briefentwurf“).

## Shots (nur design/lauf/, Ausschnitte in Original-px, Details in beats.json → shots)
- **04-brief-word.png** (1590 × 1335, Story-Objekt): Logo x 1083 y 135 w 332 h 125; Empfänger x 173 y 362 w 393 h 110; Betreff y 588–630; Preise y 803–888; **Kernzeile** x 190 y 893 w 560 h 40; **Versand** x 190 y 938 w 675 h 40. Kein Name im Brief.
- **01-prompt-mit-anhang.png** (1040 × 830): crop x 36 y 112 w 984 h 640; lesbar nur die Anhang-Karten (x 53/245, y 132, je 178 × 178), „+“ bei x 52 y 702; Prompt Textur; „Abendgedanken“ und Fußzeile nie.
- **07-schritte-zeile.png** (1206 × 205): nur Titelzeile y 8–48 („Suche nach UWG-Regeln …“). Die Zeile „… 15 weitere Schritte“ sagt nicht „Web durchsucht“.
- **06-datei-karte.png** (1206 × 170): crop x 38 y 20 w 785 h 102.
- **02-rechtslage-quellen.png**: optional nur „Meine Entscheidung: der Brief.“ (x 40 y 4 w 330 h 36) als Teil des Stempels.
- **03-entscheidung-gruende.png**: optional unlesbare Textur hinter den Warum-Karten.
- Nie: 05-nicht-pruefen.png (Personenname), Anhang-Inhalt „Shirt-Firma Ergebnis Betriebe.md“ (Betriebsnamen, Hamburg), claude.ai-Sidebar.

## Ton
- **Musik R3:** GONE-Original ab **0,10 s**, 45,0 s am Stück bis 45,10 s, nie geloopt = **Abschnitt von Folge 5 (2026-10-29, 3,47–48,27)**, um 3,37 s vorgezogen, damit die natürliche Pause im Stück (Track 22,9–24,35) unter die Pause vor „Warum?“ fällt und der Wiedereinsatz (Track 24,35) genau auf „Warum?“ (24,25) – Stille vor der Pointe ohne künstliche Mulde. Heute (2026-10-30) frei kein Abschnitt ≥ 45,6 s mehr; Folge 12 = 328,0–373,58 → kein Grenzen (Abstand > 280 s); keine Überschneidung mit Folge 9–12 (Folge 10 beginnt 57,325). Details `musik.txt`.
- **Explizit:** „Shit“ (Track 20,16–20,34) liegt im Abschnitt → `audio.musicMute [[19.92, 20.62]]` (Clip-Sekunden, firma-mix setzt 0 + 80-ms-Rampen, wie Folge 5) – liegt unter „Word-Datei.“. **Explizit-Check:** `node scripts/music-explicit-check.mjs .env runs/firma-tag13/regie/musik-abschnitt.mp3` (Abschnitt inkl. Mute) 2× → **0 explizite Wörter**.
- Struktur: ruhigerer Teil des Stücks (−12 bis −20 dB) → Faktor 0,09 wie Folge 5; Pause im Stück vor „Warum?“ auf 0,07, Wiedereinsatz-Akzent 0,11 auf „Warum?“, danach 0,08; Endkarte 0,06 (Stück wird ab Track ~44 lauter), Fade auf 0 bis 45,0.
- Kurve (audio.musicCurve): [0,0.09] [22.7,0.09] [23.0,0.07] [24.2,0.07] [24.25,0.11] [25.0,0.08] [43.7,0.08] [44.0,0.06] [44.5,0.06] [45.0,0].
- Abstand Stimme ↔ Musik je Akt (`regie/gap_r3.py`, `regie/gap-final.txt`, Musik mit Mute): Hook 17,5 · Rückblick 21,9 · Heute 21,9 · Claude-Weg 33,5 (Mute senkt den Mittelwert) · Entscheidung 23,9 · Warum 19,4 · Als Nächstes 20,3 · CTA 21,5 dB (jeder Akt ≥ 15 ✓). firma-mix misst nach dem Render neu, Ziel −14 LUFS, TP −1.
- SFX: Palette wie Folge 8 (`beats.json → sfx_dateien`), Stempel nur Clack, Streichungen Tick, keine Boom-/Sub-Hits, Whooshes 0,18–0,22.

## Hinweise an firma-design
1. **Board:** Layout tag11/tag12 (9 Felder). done [0,1,2,3,6] (BETRIEBE wird auf „Liste:“ abgehakt), WEBSITE „ENTWURF“ (nie grün), GEWERBE offen mit MENSCH + Personen-Symbol (kein Haken, wie Folge 12), WERBEBRIEF current (gold ab Ende „Betriebe.“), ERSTER UMSATZ offen. Engine: `current 7, done [0,1,2,3,6], wip [4,5]`. Kein Umsatz-Zähler.
2. **Brief:** nur aus 04-brief-word.png/brief-ansicht.png; je Beat nur der genannte Bereich lesbar (Kernzeile / Betreff / Empfänger), Rest Textur. Kein Kuvert, keine Briefmarke, keine Hand.
3. **Warum-Akt:** Fußzeile „laut Claude · keine Rechtsberatung“ klein + gedimmt über den Untertiteln, 24,25–34,26. Karte 3 steht allein ≥ 3,7 s (H-01). Kein Paragraf, nie „Gesetz“/„verboten“ groß.
4. **Übergabe:** kein ERGÄNZEN-Stempel; Empfängerfeld + Versand-Zeile nur als Puls, eine Frage-Karte.
5. **Endkarte:** zwei Blöcke („FRAGE + BRIEFVORLAGE“, „BRIEFENTWURF IN 10 MINUTEN“), weil „Frage“ → „Briefvorlage“ nur 0,5 s auseinander liegen.

## Auffälligkeiten für Chef/Autor (nichts am Skript geändert)
- R3: STT hört „probier“ nur im Volltext sauber; isoliert wird jede Eröffnung (auch R2) zu „probiere“. Von 35 neuen Eröffnungs-Takes waren im Volltext nur 3 sauber, 1 davon 10/10 (open4, verwendet). Pause „führt? → Ich“ deshalb roh 0,40 statt R2-Ziel 0,55.
- R3: voice.mp3 allein 136,4 wpm (> 135); über die ganze Folge mit Endkarte 133,3 wpm ✓ – Puffer nach oben ohne neue Takes nur ~0,4 s.
- Musik: Folge 5 lief am 29.10. mit „Shit“ 18,8 dB unter der Stimme; hier per Mute auf 0.
- Bibel v2: Zeilen 10–12 tragen abweichende Slot-Zeiten (10 = „15:00“, 11/12 = „18:00“, Tagesbriefing: 12:00/15:00/18:00) – nicht von mir geändert, nur gemeldet. Folge-13-Zeile (Slot 21:00 → 2026-10-31 09:00) nicht angefasst (Auftrag: nur Stimme/Plan/Musik).
