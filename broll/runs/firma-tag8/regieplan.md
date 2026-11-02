# Regieplan · Folge 8 „Firmenname“ (Serientag 2, nicht erste Folge, Slot 2026-10-29 21:00)

firma-regie, 2026-10-28 abends. Grundlage: script.txt (bestanden, 135 Wörter, Wortlaut unverändert), tagesbriefing-2026-10-29.md (Regeln 1–8 + Chef-Entscheide), thema.md („Für die Regie“), hooks.md (Variante F), pruefung/autor-runde1.md + autor-runde2.md (H6–H9, Chef: H8 übernommen), design/lauf/LAUF.md + bericht.md (Chat 86d0f42a…, 19 Websuchen, 20 Seitenabrufe, 1 min 54 s), Screenshots 01–04, Vorlage Folge 6 (runs/firma-tag6/), Anschluss Folge 7 (runs/firma-tag7/beats.json).
Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag8/`), `beats.json`, `musik.txt`, Arbeitsdateien und Hilfsskripte in `regie/`.

## Storyline-Check (Bibel v2)
- Kette: Folge 7 endete mit „Wie heißt die Firma? Ohne Namen kein Logo, kein Muster, keine Werbung.“ → Folge 8 sucht den Namen, Ergebnis Kolonnenshirt als Kandidat (Domain/Marke offen) → Folge 9 „Wie sieht ein Logo aus, das sich sticken lässt?“. Kein Sprung, kein „gestern“, kein Tag.
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Kein neues Produkt, kein Kunde. Neu: Name „Kolonnenshirt“ (Kandidat, ungeprüft).
- Rückblick-Satz 1 „bestickt erst auf Bestellung“ ✓, Satz 2 „Printful stickt, Vorschlag: hundertneun für fünf.“ = Ergebnis Folge 7 (Partnerwechsel + Preisvorschlag), Bildkarte „Vorschlag 109 € · 5 Shirts“ nicht grün.
- **Wortlaut:** unverändert, inkl. „hat die KI nicht geprüft“ (H8). Die Ausnahme „die KI“ → „sie“ war nicht nötig: Rohtake-Rückblick 7,0 s, aber nach Take-Wechsel + Pausen **5,88 s**; Folge **45,16 s**. (Hinweis: „die KI“ in Zeile 8 hätte den Rückblick ohnehin nicht verkürzt.)

## Stimme
- Serienstimme wie Folge 2–7: `scripts/eleven-tts.mjs`, ElevenLabs „Keno“ `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **TTS_SPEED=1.15**. TTS-Text `regie/script-tts.txt` = script.txt (keine Sonderschreibung nötig).
- Rohtake `regie/voice-raw.mp3` (45,65 s). Drei Stellen ersetzt (alle mit denselben Settings), Pegel angeglichen (`regie/prep_rueck.py`, `regie/prep_retakes.py`):
  1. **Rückblick** (Rohtake 7,0 s > 6,0): 11 Takes (`regie/rueck.mjs`, `rueck2.mjs`, Netto-Sprechzeit je Satz `regie/rstat.py`), gewählt **take9** (6,30 s brutto, Satz 1 3,57 s, Satz 2 1,96 s netto; „Betriebe,“ fällt, „Vorschlag:“ kündigt an; Pegel −16,5 vs −16,6 dB, keine Anpassung). Kein atempo nötig.
  2. **„Frage: Zehn Namen, per Websuche geprüft. Schon belegt?“**: STT im Rohtake „Websearch“. 10 Takes (inkl. Schreibung „Web-Suche“), gewertet mit wiederholtem STT über die ganze Datei (`regie/score.sh`, STT ist nicht deterministisch), gewählt **web3** (Websuche 14/16 Läufe in der Endfassung).
  3. **„Die anderen zwei: Allerweltswörter.“**: STT im Rohtake „aller Weltwörter“. 8 Takes, gewählt **aw6** (Allerweltswörter 18/18 Läufe).
- **Haken:** im Rohtake schon Aussage: F0 auf „-ken“ 166 → 96 Hz fallend, STT „Haken:“ (Endfassung 147 → 99 Hz). Kein Neutake nötig (anders als Folge 6).
- „zwei:“ steigt vor dem Doppelpunkt (Ankündigungs-Melodie 106 → ~200 Hz), STT „zwei:“, nicht „zwei?“; gilt als Doppelpunkt-Spannung, nicht als Frage.

### Betonungstest (Satzkontext, Tempo 1,15; `regie/betonung.mjs`, Takes in `regie/betonung/`, Silbenanalyse `regie/stress.py` → `betonung/stress.txt`, Zischlaute `regie/fric.py`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| Kolonnenshirt | Ko-LON-nen-shirt: Tonhöhenspitze auf -lon- (153 Hz im Rohtake), „shirt“ englisch, Zischlaut 4,6 kHz wie „Shirts“ (sch); STT „Kolonnenshirt“ | Rohtake |
| Kolonne | KO-/LON- tragen, STT korrekt | Rohtake |
| Kluft | kurzes u, eine Silbe, STT „Kluft“ (Test + Endfassung) | Rohtake |
| Printful | Print-ful englisch, STT „Printful“ | take9 |
| Arbeitskleidungs-Shop | AR- lautester Teil, „Shop“ englisch; STT korrekt | Rohtake |
| Allerweltswörter | AL- laut + hoch; Rohtake verschluckt „-welts-“ → Neutake | **aw6** |
| Markenregister | MAR- lautester Teil, STT korrekt | Rohtake |
| Handelsregister | HAN- trägt, STT korrekt | Rohtake |
| Vorschlag | VOR- trägt, nach Doppelpunkt kurze Pause (0,15 s nach Schnitt) | take9 |
| hundertneun | HUN- trägt, flüssig; STT „hundert neun“/„109“ (= ein Zahlwort) | take9 |
| Fünferpaket | FÜN- höchste Tonhöhe, STT korrekt | Rohtake |
| Websuche | im Rohtake von STT oft „Websearch“ gehört → Neutake | **web3** |

### STT (scribe_v1, de) Wort für Wort gegen script.txt (`regie/cmp.py`, `regie/stt-final.json`)
- **134/135 Wörter identisch** (nach Normalisierung Groß/Klein, Satzzeichen, Zahlen, Komposita). Rest: „probier“ → STT „probiere“; akustisch kein Schwa (durchgehende Stimme bis zum d-Verschluss von „das“). Ist bekannt aus früheren Folgen und ein STT-Fehler. „schick“ kam in früheren STT-Läufen als „schicke“; akustisch nicht vorhanden (i → k-Verschluss → d), im finalen Lauf korrekt.

### Pausen (Schnitte/Einfügungen in echten Pausen < −45 dBFS, 3-ms-Fades; `regie/splice.py`, Karte `regie/splice-map.json`)
| Stelle | roh | neu |
|---|---|---|
| führt? → Ich | 0,44 | 0,25 |
| Betriebe, → bestickt (Rückblick) | 0,17 | 0,10 |
| Bestellung. → Printful (Rückblick) | 0,21 | 0,12 |
| Vorschlag: → hundertneun (Rückblick) | 0,41 | 0,15 |
| fünf. → Heute | 0,41 | 0,20 |
| Firmennamen. → Ergebnis (neuer Akt) | 0,03 | 0,22 |
| Kluft. → Die KI wählt | 0,55 | 0,35 |
| Kolonnenshirt. → Warum | 0,17 | 0,35 |
| Warum? → Kolonne | 0,40 | 0,35 |
| **Fünferpaket. → Firma (zwischen Grund 1 und 2)** | 0,34 | **0,31** |
| **gefunden. → Die (zwischen Grund 2 und 3)** | 0,20 | **0,30** |
| Allerweltswörter. → Haken (Karte 3 steht ≥ 1,2 s, Haken setzt sich) | 0,21 | 0,55 |
| Nächstes: → Wie | 0,36 | 0,25 |
| Prüfliste. → Damit | 0,40 | 0,25 |
- **Rückblick: „Die“ 4,99 s → „fünf.“ Ende 10,87 s = 5,88 s** (≤ 6,0 ✓, gemessen an der Stille, nicht am Alignment).
- „Heute“ 11,04 s (< 14 ✓), „Firmennamen“ 11,88 s.
- **Länge:** voice.mp3 44,16 s + 1,0 s Endkarte = **45,16 s** (40–48 ✓).
- words.json: Zeiten aus dem TTS-Alignment, mitverschoben. Captions: „hundert“→100, „hundertneun“→109, „fünf.“→5., „Zehn“/„zehn“→10, „Sieben“→7, „vier“→4, „zwei:“→2:. „Fünferpaket“ bleibt ausgeschrieben. 135 Caption-Wörter.

## Akte (roter Faden)
Ab Akt 4 durchgehendes Story-Objekt: **Namenswand → Kolonnenshirt-Karte → Shirt-Brust mit gesticktem „Kolonnenshirt“** (Wand → Wahl → oben im Warum → bekommt die Haken-Felder → klein mit „Logo?“ bei „Als Nächstes“). Die Shirt-Brust ist auch Frame 1.
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook (ohne Tag) | 0–4,88 | Shirt-Brust „Kolonnenshirt“ + Zettel mit Streichungen + gelb „Domain: nicht bestätigt · Marke: nicht geprüft“; HUD TAG 2 klein | hook |
| 2 Rückblick | 4,88–12,62 | Gründungsplan (1–5 ✓), Shirt-Karte, PARTNER → „PRINTFUL“, PREIS leuchtet mit „Vorschlag 109 € · 5 Shirts“, Fahrt zu Schritt 6 NAME | recap |
| 3 Claude-Lauf | 12,62–16,75 | echter Shot 01 (Anhang, Prompt-Markierungen, Senden), echter Shot 02 kurz | claudeShot ×3 |
| 4 Namenswand | 16,75–20,55 | 10 Namenskarten aus Shot 02, 7 Striche (3 einzeln, 4 Kluft gleichzeitig) | wall |
| 5 Entscheidung | 20,55–22,35 | 3 übrig, Kolonnenshirt wird auf die Brust gestickt, Stempel „EMPFEHLUNG“ | winner |
| 6 Warum | 22,35–30,62 | Shirt-Brust oben, 3 Grund-Karten stapeln sich (bleiben stehen) | why |
| 7 Haken | 30,62–35,95 | 3 Prüf-Felder an der Shirt-Brust: Domain / Markenregister / Handelsregister | question (fields) |
| 8 Als Nächstes | 35,95–38,70 | Frage-Karte Logo, „Logo?“ gestrichelt auf der Brust | question |
| 9 CTA | 38,70–45,16 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json. Anker immer Wort + after, siehe beats.json.

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–1,11 | Wie viel Umsatz macht ein | **Frame 1 = Ergebnis, nur Belegtes:** dunkles Arbeitsshirt, Brust mit gesticktem „Kolonnenshirt“; rechts Zettel ~~Kluftwerk~~ ~~Teamkluft~~ ~~Stichfest~~ ~~Logostich~~ ~~Meistershirt~~, „7 von 10 gestrichen“; unten gelb „Domain: nicht bestätigt · Marke: nicht geprüft“. Titel fällt auf „Umsatz“ | langsamer Push-in | Warum gerade dieser Name? | Pop, Whoosh hoch leicht, Bump | M-002, M-011 |
| 1,11–2,98 | Unternehmen, das eine KI 100 Tage lang | gelbe Zeile pulsiert auf „100“ | steht, atmet | Ist der Name überhaupt frei? | Whoosh kurz, Tick | M-005 |
| 2,98–3,93 | ganz alleine führt? | Stempel „GANZ ALLEINE.“ | Punch-in 4 % | Wirklich ohne Mensch? | Whoosh quick, Stamp-Clack | M-011 |
| 3,93–4,88 | Ich probier das aus. | Pull-back, HUD-Badge „TAG 2“ klein. **Kein Slam, keine Hand** | Pull-back | Was ist das für ein Experiment? | Klick, Pop-hoch | Serienrahmen |
| 4,88–6,45 | Die Firma der KI verkauft Shirts | Gründungsplan, 1–5 abgehakt (PRODUKT, KUNDE, DRUCK, PREIS, PARTNER), NAME offen; Shirt-Karte „SHIRTS MIT LOGO“ unter dem Board (auf „Shirts“) | ruhig, Board voll | Worum geht es hier? | Whoosh hoch leicht, Pop-hoch | Rückblick |
| 6,45–8,65 | mit Logo an kleine Betriebe, bestickt erst auf Bestellung. | Logo-Stick auf der Karte („Logo“), Banner „erst auf Bestellung bestickt“ („bestickt“) | steht | Ohne Lager? | Tick, Page | Rückblick |
| 8,65–11,00 | Printful stickt, Vorschlag: 109 für 5. | PARTNER-Label wechselt auf **„PRINTFUL“** (auf „Printful“); zuletzt erledigter Schritt **PREIS leuchtet** mit Karte **„Vorschlag 109 € · 5 Shirts“** (neutral, nicht grün, kein €-Zähler) | leichter Push-in | Und wie heißt die Firma? | Check, Pop-tief, Tick | Rückblick, Ticket autor-R1-1 |
| 11,00–12,62 | Heute sucht sie einen Firmennamen. | Fahrt zu Schritt 6 NAME (gold), Pill „HEUTE: FIRMENNAME“, NAME-Feld „?“ | Fahrt auf Zeile 6 | Wie findet sie einen? | Whoosh, Chime | Rückblick |
| 12,62–13,55 | Ergebnis anhängen. | **echter Shot 01**: Zeiger klickt „+“, Chip „Shirt-Firma Ergebnis Preis.md“ orange gerahmt | Push-in auf den Chip | Wo klicke ich? | Klick, Pop-tief | M-004 |
| 13,55–15,95 | Frage: 10 Namen, per Websuche geprüft. | Shot 01: Markierung „Schlag mir zehn deutsche Namen vor“ (auf „10“), „Prüf für jeden mit der Websuche“ (auf „Websuche“); Pill „Die Frage zum Kopieren → am Ende“ | Pan im Prompt | Was genau frage ich? | Tick, Pop-hoch, Typing | M-004 |
| 15,95–16,75 | Schon belegt? | Markierung „.de-Domain offensichtlich belegt“, Senden-Klick, Schnitt auf **echten Shot 02**, „Read 20 pages, searched the web“ gerahmt | Senden, Schnitt | Und, was kommt raus? | Tick, Klick hoch, Whoosh | M-004 |
| 16,75–17,70 | 7 fliegen raus, | Tabellenzeilen aus Shot 02 werden 10 Namenskarten (mit Inhalt); Striche: STICHFEST „Stickerei in Österreich“ (fliegen), LOGOSTICH „Shop für bestickte Firmenkleidung“ (raus), MEISTERSHIRT „Domain belegt · Fußball-Begriff“ (raus+0,25); Zähler 0 → 3 | Pull-back auf die Wand | Welche fliegen raus? | Page, 3× Clack | M-011 |
| 17,70–19,00 | 4 davon zu nah am | 4 Kluft-Karten leuchten orange, „KLUFT“ unterstrichen (auf „nah“) | Push-in auf die vier | Was ist an denen falsch? | Pop-hoch, Tick | |
| 19,00–20,55 | Arbeitskleidungs-Shop Kluft. | Mini-Karte „Kluft.de · Arbeitskleidung · dieselben Kunden“; auf „Kluft“ 4 Striche gleichzeitig, je Etikett **„zu nah an Kluft“**; Zähler **7 von 10**; Beleg-Kachel Shot 03 | steht | Was bleibt übrig? | Pop-tief, Stamp, Roll | M-011 |
| 20,55–21,40 | Die KI wählt: | 7 Gestrichene dimmen, 3 übrig hell. **Musik fast still** (Mulde im Stück) | langsamer Push-in | Welchen nimmt sie? | Tick | Stille vor der Pointe |
| 21,40–22,35 | Kolonnenshirt. | Kolonnenshirt-Karte fliegt auf die Shirt-Brust, Name wird gestickt, Stempel „EMPFEHLUNG“; Musik-Schlag genau hier | harter Push-in | Warum gerade der? | Whoosh hoch, Power, Stamp | M-002 |
| 22,35–23,00 | Warum? | Shirt-Brust fährt nach oben, Pill „WARUM KOLONNENSHIRT?“ (Musik-Schlag) | kurze Fahrt, ruhig | Warum? | Whoosh 2, Pop | Warum-Beat |
| 23,00–26,10 | Kolonne heißt auf dem Bau Arbeitstrupp, passend zum Fünferpaket. | **Karte 1** mit Inhalt (auf „Kolonne“): fünf Arbeiter in einer Reihe, „KOLONNE = ARBEITSTRUPP“, „Fünferpaket für den Trupp“ (auf „Fünferpaket“), winzig „Quelle: LEO“; Gegenwert grau „Elektriker: eher „Team““. Steht 3,09 s bis Karte 2 | ruhig | Versteht das jeder? | Pop-tief, Check, Tick | Warum-Beat |
| 26,10–28,50 | Firma oder Shop mit dem Namen: keine gefunden. | **Karte 2** (Pause davor 0,31 s): Lupe über „Kolonnenshirt“, „Firma: keine gefunden“ / „Shop: keine gefunden“, auf „keine gefunden“ orange markiert; Gegenwert grau „Kluft.de: gefunden · Logostich: gefunden“. Steht 2,39 s bis Karte 3 | ruhig | Ist der Name dann frei? | Pop-tief, Tick, Check | Warum-Beat |
| 28,50–30,62 | Die anderen 2: Allerweltswörter. | **Karte 3** (Pause davor 0,30 s): HANDWERKERHEMD, BETRIEBSSHIRT gehen in einer Trefferliste unter, Stempel „ALLERWELTSWÖRTER“ (29,42 → 30,68 = 1,26 s); Gegenwert grau „Produktart · beschreibt nur die Ware“ | ruhig | Und die anderen zwei? | Pop-tief, Stamp | Warum-Beat |
| 30,62–33,15 | Haken: Die Domain ist nicht als frei bestätigt. | Pill „HAKEN“ (Aussage), Feld „kolonnenshirt.de“ mit gelbem „?“ (auf „Domain“), „nicht bestätigt“ (auf „bestätigt“), klein grau „DENIC-Abfrage brach ab“ | Push-in auf die Felder | Ist die Domain frei? | Page, Typing, Ping | Grenze als Befund |
| 33,15–35,95 | Markenregister und Handelsregister hat die KI nicht geprüft. | Felder „Markenregister“ / „Handelsregister“ grau (auf ihre Wörter), auf „nicht geprüft“ zwei graue Stempel „NICHT GEPRÜFT“; Beleg klein Shot 04 unten. Keine Hand | ruhig, leichter Push-in | Und wenn es den Namen schon gibt? | Pop-hoch ×2, Stamp | Grenze als Befund |
| 35,95–38,70 | Als Nächstes: Wie sieht ein Logo aus, das sich sticken lässt? | Pill „ALS NÄCHSTES“, Frage-Karte (auf „Wie“), gestrichelt „Logo?“ auf der Brust (auf „Logo“), Marker „sticken“ | ruhig, leichter Push-in | Wie wird das Logo? | Whoosh airy, Pop, Tick, Pop-tief | offener Faden |
| 38,70–45,16 | Kommentiere „Name“, … Prüfliste. Damit prüfst du deinen Firmennamen in 10 Minuten. | Endkarte: Keyword tippt (auf „Name“), Haken, Flieger, Items „Die Frage“ (Shot 01, 40,49) und „Die Prüfliste“ (Domain · DPMA · EUIPO · Handelsregister · Social, 40,97), „deinen Firmennamen prüfen“ (42,69), „in 10 Minuten“ (43,40), Bot-Hüpfer ~44,3, Halt bis 45,16 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Whoosh hoch, 2× Pop-hoch, Chime, Pop | M-007 |

Prüfung M-009 (≤ 1,5 s ohne Änderung): längste Strecken 17,75 → 19,01 = 1,26 (dazwischen „nah“ 18,54), 40,97 → 41,75 → 42,69, 43,40 → ~44,3 → 45,16. Warum-Karten (stapeln, bleiben bis Haken stehen): Karte 1 3,09 s, Karte 2 2,39 s, Karte 3 1,26 s auf ihrem Wort (je ≥ 1,2 ✓); Pausen zwischen den Gründen 0,31 / 0,30 s ✓.

## Shots (echte claude.ai-Ausschnitte, `public/firma-ep/tag8/shots/`, ohne Sidebar, Dark Mode)
- 01-prompt-mit-anhang.png → B09–B11 (Chip, 3 Markierungen, Senden) + Endkarten-Item „Die Frage“
- 02-antwort-tabelle.png → B11 Ende („Read 20 pages, searched the web“), Quelle der Namenswand B12, Beleg Zeile 10 „Empfehlung“ in B16
- 03-streichungen.png → Beleg-Kachel B14 (Kluft-Absatz)
- 04-entscheidung.png → Beleg B22 („Was ich nicht prüfen konnte“), optional B18–B20 („Warum Kolonnenshirt“)

## Ton
- Musik: GONE-Original ab **154,80 s**, 45,16 s am Stück, nie geloopt; **Abschnitt von Folge 2 wiederverwendet** (Chef-Entscheid, kein freier Abschnitt mehr), keine Überschneidung mit Folgen 4–7, Tabu 200–276 eingehalten (Details `musik.txt`).
- Struktur: ruhiger Einstieg, natürliche Mulde unter „Die KI wählt:“ (Kurve 20,15–21,30 auf 0,018), harter Schlag im Stück genau auf „Kolonnenshirt“ (Clip 21,40, Akzent 0,065), zweiter auf „Warum?“, danach lauterer Teil auf 0,04. Gemessen jeder Akt 19,9–27,2 dB unter der Stimme (≥ 15 ✓, vor dem finalen Mix). Ziel −14 LUFS, TP −1.
- SFX: Palette wie Folge 4/6 (`beats.json → sfx_dateien`), Clack/Stamp für Striche und Stempel, keine Boom-/Sub-Hits, Whooshes 0,2–0,25.

## Hinweise an firma-design
1. **Story-Objekt `nameShirt`:** Shirt-Brust mit Stick-Schriftzug + Zettel mit Streichungen + gelber Status-Zeile. Wird in Hook, Entscheidung, Warum, Haken und „Als Nächstes“ gebraucht → als ein Objekt in `src/components/firma/`. Stick-Animation für „Kolonnenshirt“ (B16) und gestricheltes „Logo?“ (B23). Hook ohne Tag-Slam, ohne Hand.
2. **Namenswand** (B12–B15): 10 Karten aus den Tabellenzeilen von Shot 02 (Übergang Zeile → Karte), Strich-Animation mit Grund-Etikett, Zähler „x von 10 gestrichen“, Mini-Karte Kluft.de. Gründe nur aus dem Lauf (stehen wörtlich in beats.json → engine_akte.wall.strikes).
3. **Board:** `plan_vorschlag` done 0–4, current 5 (NAME). Neu im Rückblick: `recap.relabel` (PARTNER A61 → PRINTFUL) und PREIS als „last“ mit Karte „Vorschlag 109 € · 5 Shirts“ in **neutraler** Farbe (nicht grün). Mit Board von Folge 7 abgleichen (dort PARTNER = „A61 · MIT VORBEHALT“).
4. **Warum-Karten stapeln** (`why.stack`): Karte 1 rückt klein zur Seite, wenn Karte 2 kommt, alle drei bleiben bis „Haken“ sichtbar. Neue Icons `crew5` (fünf Arbeiter), `searchLens`, `searchList`; Gegenwerte in `vs_wunsch`.
5. **Haken-Felder** (`fields_wunsch`): 3 Felder an der Shirt-Brust, Domain gelb „?“, Register grau mit Stempel „NICHT GEPRÜFT“. Fallback: question-Akt mit `lines`.
6. **Rückblick-Länge:** Akt 4,88 → 12,62; gesprochen 5,88 s.
7. **Umsatz-Zähler:** keiner (0 €).
