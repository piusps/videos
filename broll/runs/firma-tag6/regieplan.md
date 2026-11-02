# Regieplan · Folge 6 „Partner“ (Serientag 2, nicht erste Folge, Slot 2026-10-29 15:00)

firma-regie, 2026-10-28 abends. Grundlage: script.txt (bestanden, Wortlaut unverändert), tagesbriefing-2026-10-29.md (Regeln 1–8 + Chef-Entscheide), briefing.md, thema.md („Für die Regie“), hooks.md, pruefung/autor-runde2.md (H1–H5), design/lauf/LAUF.md + bericht.md (Chat c874de02…, 294 Quellen, 5m 56s), Vorlage Folge 4 (runs/firma-tag4/).
Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag6/`), `beats.json`, `musik.txt`, Arbeitsdateien und Hilfsskripte in `regie/`.

## Storyline-Check (Bibel v2)
- Kette: Folge 5 endete mit „Welcher Partner stickt Sechzig-Grad-Shirts einzeln, ohne Neueinrichtung?“ → Folge 6 beantwortet zwei von drei Bedingungen belegt (60 °C, ab 1 Stück), die dritte ehrlich offen („Einrichtungskosten findet Claude dort nicht“) → Folge 7 „Bleibt pro Shirt überhaupt etwas übrig?“ (Preis rechnen). Kein Sprung, keine Wiederholung, kein „gestern“, kein Tag.
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Kein neues Produkt, kein Kunde. Neu: Partner A61 (unter Vorbehalt), Zweitwahl Printful (nur Caption/Guide).
- Rückblick-Satz 1 „bestickt erst auf Bestellung“ (Chef-Entscheid ab Folge 5) ✓.
- **H1 („rund“ streichen):** nicht nötig. Gemessen: Folge 46,75 s (≤ 48), Rückblick 5,77 s (≤ 6,0). „rund“ bleibt, script.txt unverändert.
- **H3:** 60 Grad im Prompt-Screenshot 01b grün markiert (B10), bleibt stehen bis zum Shot-Wechsel.
- **H5:** keine Hand, kein Umschlag, keine Anfrage im Bild; Grenze nur als Befund (Felder „?“ auf der A61-Karte). Auch der Hook nutzt keine Hand (Folge 4 hatte dort „Hand legt Auftrag hin“; hier stattdessen Pull-back + HUD-Badge).

## Stimme
- Serienstimme wie Folge 2–4: `scripts/eleven-tts.mjs`, ElevenLabs „Keno“ `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **TTS_SPEED=1.15**. TTS-Text `regie/script-tts.txt` = script.txt (dort steht schon „A einundsechzig“; „Stick“ als eigenes Wort kommt nicht vor, s. u.).
- Rohtake `regie/voice-raw.mp3` (48,30 s). Ein Satz neu erzeugt (Haken), dann Pausenschnitt + Rückblick-Tempo → **voice.mp3 = 45,75 s, Video 46,75 s** (letztes Wort + 1,0 s Endkarte).
- **Haken-Satz neu:** Im Rohtake stieg „Haken“ wie eine Frage (F0 auf „-ken“ 190 → 250 Hz, STT „Haken?“). 4 Takes mit `previous_text`/`next_text` (`regie/haken.mjs`), gewählt Take 4 (F0 142 → 71 Hz fallend, STT „Haken:“, kürzester), +0,7 dB angeglichen, Pause „Euro, → am“ 0,41 → 0,21 s (`regie/prep_haken.py`).

### Betonungstest (Satzkontext, Tempo 1,15; STT + Pegel/Tonhöhe/Dauer je Silbe; `regie/betonung.mjs`, `stress.py`, `contour.py`, Takes in `regie/betonung/`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| A einundsechzig | STT „A einundsechzig“ (Test + Rohtake), „A“ deutsch, Zahl flüssig, kein „A sechs eins“ | Rohtake |
| Einrichtungskosten | EIN- trägt die Tonhöhenspitze (114 → 147 Hz), -kos- laut, Ende schwebend vor „findet“; STT korrekt | Rohtake |
| Händlerpreise | HÄND- lautester Teil (−11,4 dB), Aufzählungs-Anstieg zu „und“ | Rohtake |
| Sechzig-Grad-Arbeitsshirt | SECH- höchste Tonhöhe, GRAD und AR- tragen, „Shirt“ englisch wie überall; STT korrekt | Rohtake |
| hunderteinundfünfzig | HUN- und FÜNF- tragen, flüssig, STT korrekt (im Haken-Take) | Haken-Take 4 |
| Haken | Rohtake Frage-Melodie | **neu (Take 4)** |
| stickt / bestickt / besticktes | Zischlaut-Schwerpunkt 3,9 / 4,6 / 4,6 kHz = deutsches „scht“ (Vergleich „Shirts“ 4,4–4,6 kHz, „schick“ 3,6 kHz; englisches s ~6,5 kHz), `regie/fric.py`. Gegenprobe „schtickt“/„beschtickt“ klang nicht besser | Rohtake, keine Schtick-Schreibung nötig |
| zweihundertvierundneunzig, Research, Partnertabelle | STT korrekt, Research englisch wie Folge 2–4 | Rohtake |

### STT (scribe_v1, de) Wort für Wort gegen script.txt (`regie/cmp.py`, `regie/stt-final.json`)
- **135/135 Wörter identisch** (nach Normalisierung Groß/Klein, Satzzeichen, Zahlen). „probier“ diesmal auch als „probier“ erkannt, „schick“ als „schick“. „Haken.“ als Aussage, „Und bestellt …“ als eigener Satz.

### Pausen (Schnitte/Einfügungen nur in echten Pausen < −45 dBFS, 3-ms-Fades; `regie/splice.py`, Karte `regie/splice-map.json`)
| Stelle | roh | neu |
|---|---|---|
| führt? → Ich | 0,39 | 0,25 |
| Betriebe, → bestickt | 0,29 | 0,11 |
| Bestellung. → Ihre | 0,50 | 0,12 |
| nachbestellen. → Heute | 0,20 | 0,16 |
| dafür. → Plus | 0,33 | 0,17 |
| Frage: → Wer | 0,51 | 0,30 |
| direkt? → Claude | 1,31 | 0,35 |
| **belegt. → Und (zwischen den Gründen)** | 0,12 | **0,31** (Stille eingefügt) |
| nicht. → Als | 0,07 | 0,22 (Stille eingefügt, Befund setzt sich) |
- Rückblick-Sätze zusätzlich atempo 1,04 (nur „Die“ … „nachbestellen.“, Lehre 2026-10-29).
- **Rückblick: „Die“ 5,01 s → „nachbestellen.“ Ende 10,79 s = 5,77 s** (≤ 6,0 ✓).
- „Heute“ beginnt 10,86 s (< 14 ✓), „Plus“ 12,54 s.
- **Länge:** letztes Wort Ende 45,75 s + 1,0 s Endkarte = **46,75 s** (40–48 ✓).
- words.json: Zeiten aus dem TTS-Alignment, mitverschoben. Captions: „hundert“→100, „zweihundertvierundneunzig“→294, „hunderteinundfünfzig“→151, „hundertzehn.“→110., „zehn“→10; „A einundsechzig,“ → ein Caption-Wort **„A61,“** (20,64–21,57). „einem Stück“ bleibt ausgeschrieben. 134 Caption-Wörter.

## Akte (roter Faden)
Ab Akt 4 durchgehendes Story-Objekt = **die A61-Karte** (Wand → vorn → Stempel → oben im Warum → Rechnung hängt dran → bekommt die ?-Felder → bleibt klein bei „Als Nächstes“).
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook (ohne Tag) | 0–4,95 | Partner-Wand + A61-Karte mit roter Rechnung; HUD-Badge TAG 2 klein | hook |
| 2 Rückblick | 4,95–12,04 | Gründungsplan (1–3 ✓, 4 PREIS in Arbeit) + Shirt-Karte, Schritt 4 PREIS leuchtet mit Folge-5-Ergebnis, Fahrt zu Schritt 5 PARTNER | recap |
| 3 Claude-Lauf | 12,04–19,25 | Paper nach Shot 01a (Plus → Research → Anhang), echter Shot 01b mit 60-Grad-Markierung, echter Shot 02 „294 sources“ | claude + claudeShot ×2 |
| 4 Partner-Wand | 19,25–21,60 | 7 Partner-Karten, A61 grün „60 °C“, Rest grau „60 °C ?“; A61 fliegt vor auf „A61“ | wall + winner |
| 5 Entscheidung | 21,60–22,45 | Stempel „UNTER VORBEHALT“ auf der A61-Karte | winner (stamp) |
| 6 Warum | 22,45–27,98 | A61-Karte oben, 2 Grund-Karten mit Gegenwert | why |
| 7 Haken | 27,98–32,98 | rote Rechnung an der A61-Karte | question (bill) |
| 8 Grenze | 32,98–36,07 | A61-Karte bekommt „Händlerpreis: ?“ / „Einrichtung: ?“ | question (fields) |
| 9 Als Nächstes | 36,07–39,42 | offene Frage-Karte | question |
| 10 CTA | 39,42–46,75 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json. Anker immer Wort + after, siehe beats.json.

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–1,00 | Wie viel Umsatz macht ein | **Frame 1 = Ergebnis, nur Belegtes:** Partner-Wand, vorne A61-Karte mit grünem Etikett „60 °C“ + Stempel „AB 1 STÜCK“, darunter rot „5 Shirts: 151 €“ gegen grau „Markt: 110 €“. Titel fällt auf „Umsatz“ | langsamer Push-in | Warum ist der grüne Partner zu teuer? | Pop, Whoosh hoch leicht, Bump | M-002, M-005 |
| 1,00–3,00 | Unternehmen, das eine KI 100 Tage lang | „151 €“ pulsiert rot auf „100“ | steht, atmet | Lohnt sich das? | Whoosh kurz, Tick | M-005 |
| 3,00–3,98 | ganz alleine führt? | Stempel „GANZ ALLEINE.“ | Punch-in 4 % | Wirklich ohne Mensch? | Whoosh quick, Stamp-Clack | M-011 |
| 3,98–4,95 | Ich probier das aus. | Pull-back auf die ganze Wand, HUD-Badge „TAG 2“ klein (Engine). **Kein Slam, keine Hand** | Pull-back | Was ist das für ein Experiment? | Klick, Pop-hoch | Serienrahmen |
| 4,95–6,68 | Die Firma der KI verkauft Shirts mit | **Rückblick:** Board ganz im Bild, 1 PRODUKT ✓ 2 KUNDE ✓ 3 DRUCK ✓, 4 PREIS orange „in Arbeit“; Shirt-Karte „SHIRTS MIT LOGO“ fliegt **unter** das Board (Shirts 6,21) | steht | Worum geht es? | Whoosh hoch leicht, Pop-hoch | Rückblick-Akt |
| 6,68–8,90 | Logo an kleine Betriebe, bestickt erst auf Bestellung. | Logo als Stick auf dem Karten-Shirt (6,68), Banner „erst auf Bestellung bestickt“ (7,81) | steht | Ohne Lager? | Tick, Page-Turn | – |
| 8,90–10,80 | Ihre Lücke: Shirts einzeln nachbestellen. | Schritt 4 PREIS leuchtet (orange, in Arbeit), hüpft, klein „PREIS · MARKT 110 €“, groß **„LÜCKE: EINZELN NACHBESTELLEN“**; Einzel-Shirt-Icon springt dazu (9,81) | leichter Push-in auf Schritt 4 | Und wer macht das? | Check, Pop-tief | Rückblick-Akt |
| 10,80–12,04 | Heute sucht sie einen Partner dafür. | **Fahrt zu Schritt 5 PARTNER**, leuchtet gold, Shirt-Karte fliegt raus, Pill **„HEUTE: PARTNER FÜR EINZELSTÜCKE“** | Fahrt auf Zeile 5 | Wie findet sie den? | Whoosh quick, Chime | M-003 |
| 12,04–14,56 | Plus, Research an, Ergebnis anhängen. | Paper nach Shot 01a: Zeiger auf „+“, Klick (12,54), Menü, Research (12,94), Pill an (13,39), Datei-Chip „Shirt-Firma Ergebnis Konkurrenz.md“ fliegt rein (13,73). Chips RESEARCH · ANHANG · FRAGE | Paper vorn, Zoom aufs Menü, dann Chip | Wo klicke ich? | Klick, Klick, Check, Pop-tief | M-004, M-008 |
| 14,56–17,64 | Frage: Wer stickt einzeln und verschickt direkt? | **Echter Shot 01b.** **H3:** grün „60 Grad Wäsche aushalten“ (14,91, bleibt), orange „ab einem Stück“ (15,92), gelb „Versand direkt an meine Kunden“ (16,83), Re-Hook „Die Frage zum Kopieren → am Ende“ (15,35), Senden 17,33 | Push-in auf 60 Grad, Pan zu „ab einem Stück“, dann „Versand direkt“ | Was genau frage ich? | Tick, Pop-hoch, Typing, Tick, Klick-hoch | M-004 |
| 17,64–19,25 | Claude prüft 294 | **Echter Shot 02** „Research complete • 294 sources • 5m 56s“, Rahmen + Zähler 0→294 auf „294“ (18,30) | Push-in auf Quellenzeile | So viele? | Whoosh quick, Counter-Roll, Ping | M-005 |
| 19,25–20,60 | Quellen. Die KI nimmt | Partner-Wand mit Inhalt: A61 „60 °C“ grün, Printful/Shirtigo/Gelato/Spreadconnect/Customwear/Printify „60 °C ?“ grau; auf „nimmt“ (20,35) dimmen die 6 grauen | Pull-back auf die Wand | Welchen nimmt sie? | Page-Turn, 2 Ticks, Tick; **Musik fast still 19,45–20,55 (Kurve)** | – |
| 20,60–21,60 | A61, | **Ergebnis-Bild:** A61-Karte fliegt vor, grünes „60 °C“ leuchtet, andere hinten mit „60 °C ?“; optional Beleg-Kachel Shot 04 | harter Push-in auf A61 | Warum gerade A61? | Whoosh hoch, Power-up; **Refrain setzt genau auf „A61“ voll ein** | M-002 |
| 21,60–22,45 | unter Vorbehalt. | Stempel **„UNTER VORBEHALT“** orange auf der Karte | Mikro-Punch 3 % | Wieso nur unter Vorbehalt? | Stamp | M-011 |
| 22,45–23,00 | Warum? | **Warum-Beat:** A61-Karte (mit Stempel) oben, Pill „WARUM A61?“ | 0,3-s-Fahrt nach oben, dann ruhig | Warum? | Whoosh quick, Pop | Warum-Beat |
| 23,00–26,20 | Nur dieser Partner hat ein besticktes 60-Grad-Arbeitsshirt belegt. | **Grund-Karte 1** (23,02): Arbeitsshirt mit Pflegeetikett, groß grün „60 °C“ (Etikett-Pop 24,48), klein „nur hier belegt“ (Check 25,58). **Gegenwert** grau „60 °C ?“ / „6 andere Partner“ (24,78). Steht 3,22 s | ruhig | Und die anderen? | Pop-tief, Roll leise, Check | Warum-Beat |
| 26,20–27,98 | Und bestellt wird dort ab einem Stück. | **Grund-Karte 2** (26,24, nach 0,31 s Pause): ein einzelnes Shirt, Stempel „AB 1 STÜCK“ auf „einem“ (27,38). **Gegenwert** grau Stapel „ab 10“ / „Lohnstickereien“ (27,58). Steht 1,78 s | ruhig | Und kleine Bestellungen? | Pop-tief, Stamp leise | Warum-Beat |
| 27,98–32,98 | Haken: Zum Ladenpreis kosten fünf Shirts dort 151 Euro, am Markt rund 110. | Pill „HAKEN“, Kassenzettel an der A61-Karte: Titel „Zum Ladenpreis“ (28,84), **„5 Shirts: 151 €“ rot** (Zähler rollt, 30,36), **„Markt: 110 €“ grau** (32,29), **„−41 €“ blinkt** (32,89) | Push-in auf den Zettel | Wie kann der Beste zu teuer sein? | Page-Turn, Roll, Bump, Tick, Pop-tief | M-005 |
| 32,98–36,07 | Händlerpreise und Einrichtungskosten findet Claude dort nicht. | A61-Karte bekommt grau **„Händlerpreis: ?“** (33,11) und **„Einrichtung: ?“** (33,99), Chip „nicht gefunden“ mit Claude-Lupe (34,91), beide „?“ leuchten orange auf „nicht“ (35,61). Keine Hand, kein Umschlag | ruhig, leichter Push-in auf die Felder | Woher kommt dann der echte Preis? | Pop-hoch ×2, Ping | Grenze als Befund |
| 36,07–39,42 | Als Nächstes rechnet sie: Bleibt pro Shirt überhaupt etwas übrig? | Pill „ALS NÄCHSTES“, Frage-Karte (37,58), Marker „übrig“ (38,95); A61-Karte mit ?-Feldern klein oben | ruhig, leichter Push-in | Verdient sie überhaupt was? | Whoosh airy, Pop, Pop-tief | offener Faden |
| 39,42–46,75 | Kommentiere „Partner“, … Partnertabelle. Damit hast du in 10 Minuten mögliche Partner im Vergleich. | Endkarte: Keyword tippt (40,09), Haken, Flieger (40,75), Items „Die Frage“ (41,48, Snippet Shot 01b) und „Die Partnertabelle“ mit Ausschnitt **Shot 03** (42,19), „in 10 Minuten“ (43,75), „mögliche Partner im Vergleich“ (44,28), Bot-Hüpfer ~45,9, Halt bis 46,75 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Whoosh hoch, 2× Pop-hoch, Chime, Pop | M-007, M-011 |

Prüfung M-009 (≤ 1,5 s ohne Änderung): längste Strecken 28,84 → 30,36 = 1,52 (Zähler-Vorlauf läuft ab „fünf“ 29,66 sichtbar mit), 43,75 → 44,28 → 45,9 → 46,75. Warum-Karten: Karte 1 3,22 s, Karte 2 1,78 s (je ≥ 1,2 ✓); Pause zwischen den Gründen 0,31 s ✓.

## Shots (echte claude.ai-Ausschnitte, `public/firma-ep/tag6/shots/`, ohne Sidebar)
- 01a-plus-menu-research.png → Vorlage für das Paper in B09 (Plus-Menü mit „Research ✓“, Anhang-Chip)
- 01b-prompt-mit-anhang.png → B10 (60-Grad-Markierung H3) + Endkarten-Item „Die Frage“
- 02-research-fertig.png → B11 (294 sources), optional Zitat im Haken-Beat
- 03-ergebnis-tabelle.png → Wand-Inhalt + Endkarten-Item „Partnertabelle“
- 04-entscheidung.png → optional Beleg-Kachel bei „A61“ / „unter Vorbehalt“

## Ton
- Musik: GONE-Original ab **100,16 s**, 46,75 s am Stück, nie geloopt (Details `musik.txt`). Erste Wahl 3,72 s verworfen, weil Folge 5 parallel 3,47 s genommen hat (gleiche Pause im Stück, zwei Folgen hintereinander gleich). 100,16–146,91 überschneidet sich mit keinem genutzten Abschnitt (Folge 4 endet 98,76, Folge 2 beginnt 150,5); mit der Pauschale „je ca. 50 s“ ab 57,26 läge eine nominelle Überlappung von 7,1 s vor, ohne gemeinsamen Ton. 200–276 scheidet wegen expliziter Wörter im Gesang aus.
- Struktur: Refrain-Teil, durchgehend laut → niedriger Faktor (0,03 / 0,026). Stille vor der Pointe per Kurve 19,45–20,55 (unter „Quellen. Die KI nimmt“), Refrain-Einsatz genau auf „A61“ (Track 120,80) mit Akzent. „shit“ im Gesang (Clip 6,94) auf 0,006 gedückt. Gemessen jeder Akt 18,7–24,4 dB unter der Stimme (≥ 15 ✓, vor dem finalen Mix). Ziel −14 LUFS, TP −1.
- SFX: Palette wie Folge 4 (`beats.json → sfx_dateien`), 20 verschiedene Dateien, Whooshes nur 0,2–0,25, keine Boom-/Sub-Hits.

## Hinweise an firma-design
1. **Frame 1 / Story-Objekt:** Partner-Wand + A61-Karte mit Pflegeetikett „60 °C“, Stempel „AB 1 STÜCK“ und anhängbarem Kassenzettel. Wird in Hook, Wand, Gewinner, Warum, Haken und Grenze gebraucht → als ein Objekt in `src/components/firma/` bauen (nicht in der Einzel-Komposition). Hook ohne Tag-Slam, ohne Hand.
2. **Board:** braucht Schritt PARTNER. Laut Bibel (Folge 5) ist PREIS seit Folge 5 „current bis Folge 7“. Vorschlag `beats.json → plan_vorschlag`: PRODUKT, KUNDE, DRUCK, PREIS, **PARTNER**, NAME, LOGO, WEBSITE, WERBUNG, ERSTER UMSATZ (10 Schritte; falls nur 9 gehen: WERBUNG raus); done 0–2, PREIS (3) orange „in Arbeit“ mit dem Folge-5-Ergebnis, today 4. Indizes 0–3 bleiben wie in Folge 4/5. Engine braucht dafür einen Status „in Arbeit“ (`recap.last.status`). Mit dem Board von Folge 5 abgleichen.
3. **Warum-Karten mit Gegenwert:** `engine_akte → why.vs_wunsch` (Karte 1: grau „60 °C ?“ / „6 andere Partner“; Karte 2: „ab 10“ / „Lohnstickereien“). Neues Icon `careLabel60` (Pflegeetikett mit Waschbottich-Symbol 60), Fallback `thermoHot`.
4. **Rote Rechnung** (`bill_wunsch`) und **?-Felder auf der Karte** (`fields_wunsch`) sind neue Bausteine; Fallback: question-Akt mit `lines`.
5. **Markierung grün im Shot** (H3): falls die Engine nur gelb/orange kann, gelb nehmen.
6. **Rückblick-Länge:** Akt 4,95 → 10,80 bzw. bis „Heute“-Fahrt 12,04; gesprochen 5,77 s.
7. **Umsatz-Zähler:** keiner (0 €).
