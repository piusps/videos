# Regieplan · Folge 4 „Druck“ (Serientag 2, erste Folge des Tages, Slot 2026-10-29 09:00)

firma-regie, 2026-10-28 abends. Grundlage: script.txt (final, unverändert), tagesbriefing-2026-10-29.md, briefing.md, thema.md („Für die Regie“), hooks.md, design/lauf/LAUF.md (Chat 798a28cb…, 246 Quellen, 5m 21s), Vorbild Folge 3 v8 (final-v8.md) und Engine-Schema (recap/why).
Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag4/`), `beats.json`, `musik.txt`, Arbeitsdateien in `regie/`.

## Storyline-Check (Bibel v2)
- Kette: Folge 3 endete mit „Welcher Druck hält sechzig Grad?“ → Folge 4 beantwortet genau das (Stickerei) → Folge 5 „Was verlangt die Konkurrenz für bestickte Shirts?“. Kein Sprung, keine Wiederholung. „Gestern“ ist nur hier erlaubt und wird nur im Rückblick-Satz 2 benutzt.
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Kein neues Produkt, kein Kunde. Produkt wird präzisiert: Logo als Stick.
- Rückblick-Satz 1 sagt noch „gedruckt erst auf Bestellung“ (korrekt für den Stand vor der Entscheidung). Ab Folge 5 „bestickt“ (Chef-Entscheid).
- **Offener Punkt an Chef/firma-design:** Das Board hat keinen Schritt für das Verfahren. Vorschlag in `beats.json → plan_vorschlag`: `PRODUKT, KUNDE, DRUCK, PREIS, NAME, LOGO, WEBSITE, WERBUNG, ERSTER UMSATZ` (AKQUISE geht in WERBUNG auf), done [0,1], current 2. Der Rückblick braucht `today.step: 2`.

## Stimme
- Gleiche Stimme und Settings wie Folge 2/3: `scripts/eleven-tts.mjs`, ElevenLabs Serienstimme „Keno“ `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **TTS_SPEED=1.15**.
- Rohtake: `regie/voice-raw.mp3` (42,12 s). Ein Satz neu erzeugt (s. u.), dann Pausenschnitt → **voice.mp3 = 40,50 s, letztes Wort endet 40,50 s, Video 41,5 s**.
- Einsetzung Grund 2: Im Rohtake klang das zweite „Stick“ („Stick geht ab …“) wie englisch „stick“ (Anlaut-Schwerpunkt 6,5 kHz = s, deutsches sch liegt bei 3,5–4,6 kHz). Neu erzeugt mit `previous_text`/`next_text`, TTS-Text „Schtick geht ab einem Stück, …“ (Take `regie/grund2/s2.mp3`, +0,5 dB angeglichen). Jetzt 3,6 kHz = „Schtick“. Caption in words.json bleibt „Stick“. Erstes „Stick“ (4,7 kHz) und „Stickerei“ (4,6 kHz) liegen im sch-Bereich wie „Shirts“/„Stück“.

### Betonungstest (einzeln im Satzkontext, Tempo 1,15; STT + Silbenanalyse Pegel/Tonhöhe/Dauer, `regie/stress.py`, Takes in `regie/betonung/`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| Stickerei | -rei längste Silbe (0,21 s gegen 0,12), STT „Stickerei“ | Original |
| Stick | einzeln STT „Stich“, im Satz „Stick“; Anlaut s/sch schwankt je Take | Grund-2-Satz mit „Schtick“ neu (s. o.) |
| Digitaldruck | -TAL- lautester und längster Teil (−14,2 dB, 0,15 s) | Original |
| Siebdruck | SIEB- längste Silbe, höchste Tonhöhe | Original |
| Anbieterangaben | AN- betont, Ende fällt natürlich ab | Original |
| Gradzahlen | GRAD- längste Silbe | Original |
| zweihundertsechsundvierzig | flüssig, STT „246“ | Original |
| fünfundneunzig | FÜNF- und NEUN- tragen, STT „95“ | Original |
| Research | englisch erkannt (wie Folge 2/3) | Original |
| Heute (Satzanfang) | als Aussagesatz „Heute sucht sie …“, keine Frage-Melodie | Original |

### STT (scribe_v1, de) Wort für Wort gegen script.txt (`regie/cmp.py`, `regie/stt-final.json`)
- **133/133 Wörter, 131 identisch.** Zwei Abweichungen sind STT-Normalisierung, kein Sprechfehler:
  - „probier“ → „probiere“: wie bei Tag 1 und Folge 3 (STT des Folge-3-Tons schreibt ebenfalls „probiere“). Wort 0,23 s, direkt in „das“.
  - „schick“ → „schicke“: Wort 0,14 s ohne Vokal danach. Gegenprobe: derselbe Neu-Take wurde einzeln als „schick“ und im Ganzen als „schicke“ transkribiert, das Modell normalisiert also. Rohtake behalten.
- Alle Zahlen erkannt (hundert, sechzig ×3, 246, 95, 30, 50, zehn).

### Pausen (Schnitt in echten Pausen < −45 dBFS, Kanten-Sprung ≤ 0,005, kein Klick; `regie/splice.py`, Karte `regie/splice-map.json`)
| Stelle | roh | neu |
|---|---|---|
| führt? → Ich | 0,31 | 0,25 |
| aus. → Tag | 0,53 | 0,25 |
| zwei. → Die | 0,24 | 0,17 |
| Betriebe, → gedruckt | 0,23 | 0,11 |
| Bestellung. → Gestern | 0,46 | 0,12 |
| sie: → Der | 0,19 | 0,08 |
| Grad. → Heute | 0,19 | 0,16 |
| aushält. → Plus | 0,36 | 0,17 |
| **dreißig. → Stick (zwischen den Gründen)** | 0,45 | **0,30** |
- Rückblick-Sätze zusätzlich mit atempo 1,04 (nur 6,10–12,94 s roh, nicht hörbar; Silbentempo danach ≈ 6,2 Silben/s, im Rahmen des Rests).
- **Rückblick:** „Die“ 5,73 s → „Grad.“ Ende 11,68 s = **5,95 s** (Satz 1 3,83 s + Pause 0,06 laut words.json / 0,12 s echte Stille + Satz 2 2,06 s). ≤ 6,0 ✓
- **„Heute“ beginnt 11,77 s** (< 14 ✓). „Plus“ 14,09 s (Chef-Wunsch ≤ 14,2 ✓).
- **Länge:** letztes Wort Ende 40,50 s + 1,0 s Endkarte = **41,5 s** (40–48 ✓).
- words.json: Wortzeiten aus dem TTS-Alignment, mitverschoben. Für Captions: „hundert“→100, „zwei.“→2., „sechzig“→60, „zweihundertsechsundvierzig“→246, „fünfundneunzig“→95, „dreißig.“→30., „fünfzig.“→50., „zehn“→10. „einem Stück“ bleibt ausgeschrieben.

## Akte (roter Faden)
Ab der Entscheidung durchgehendes Story-Objekt = **die Stick-Karte** (Wand → Gewinner → bleibt im Warum oben stehen).
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook | 0–5,65 | Waschtrommel 60 °C + Etiketten, Slam TAG 2 | hook |
| 2 Rückblick | 5,65–11,77 | Gründungsplan + Shirt-Karte | recap |
| 3 Auftrag (Mehrwert) | 11,77–18,18 | Claude: Plus → Research → Anhang (Paper nach Shot 01), dann echter Shot 01 mit Prompt | claude + claudeShot |
| 4 Suche | 18,18–20,27 | echter Shot 02 „246 sources“, dann Wand der 8 Verfahren | claudeShot + wall |
| 5 Entscheidung | 20,27–21,69 | Wand → Stick-Karte vor, Stempel STICK | winner |
| 6 Warum | 21,69–28,69 | Stick-Karte oben, 2 Grund-Karten | why |
| 7 Haken | 28,69–31,65 | Claude-Zitat-Karte | question |
| 8 Als Nächstes | 31,65–34,67 | offene Frage-Karte | question |
| 9 CTA | 34,67–41,5 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json. Anker immer Wort + after, siehe beats.json.

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,97 | Wie viel Umsatz macht ein | **Frame 1 = Ergebnis, nur Belegtes:** Waschtrommel mit Thermometer-Zähler, Etiketten „Digitaldruck 30 °C“ **rot mit ✗ (nicht durchgestrichen)** und „Stick 95 °C“ grün. Titel fällt auf „Umsatz“ | langsamer Push-in | Was hat eine Waschmaschine mit einer KI-Firma zu tun? | Pop, Whoosh hoch leicht, Bump | M-002, M-005 |
| 0,97–2,91 | Unternehmen, das eine KI 100 Tage lang | Zähler rollt auf 60 °C (Ziel auf „100“), Trommel dreht an | steht | Hält das? | Whoosh kurz, Counter-Roll | M-005 |
| 2,91–3,83 | ganz alleine führt? | Stempel „GANZ ALLEINE.“ | Punch-in 4 % | Wirklich ohne Mensch? | Whoosh quick, Stamp-Clack | M-011 |
| 3,83–5,65 | Ich probier das aus. Tag 2. | Hand legt Auftrag hin, **Slam „TAG 2“** (Tag 4,88 / Zahl 5,21), Badge fliegt ins HUD | Slam-Zoom, Pull-back | Was ist heute dran? | Klick, Klick-hoch, Stamp, Pop-hoch; Musik-Stille unter dem Slam | Serienrahmen |
| 5,65–7,25 | Die Firma der KI verkauft Shirts mit | **Rückblick:** Board ganz im Bild, 1 PRODUKT ✓ 2 KUNDE ✓; Shirt-Karte „SHIRTS MIT LOGO“ fliegt **unter** das Board (Shirts 6,83) | steht | Worum geht es? | Whoosh hoch leicht, Pop-hoch | Rückblick-Akt |
| 7,25–9,69 | Logo an kleine Betriebe, gedruckt erst auf Bestellung. | Logo erscheint auf dem Karten-Shirt (7,25), Banner „erst auf Bestellung gedruckt“ (8,38) | steht | Ohne Lager? | Tick, Page-Turn | – |
| 9,69–11,77 | Gestern lernte sie: Der Bau wäscht mit 60 Grad. | Schritt 2 leuchtet grün, hüpft, Label groß **„BAU WÄSCHT 60 °C“**; „60“ pulsiert orange (11,11) | leichter Push-in auf Schritt 2 | Was heißt das für die Shirts? | Check, Pop-tief | Rückblick-Akt |
| 11,77–13,45 | Heute sucht sie ein Logo, das 60 Grad aushält. | **Fahrt zu Schritt 3 DRUCK**, leuchtet gold, Shirt-Karte fliegt raus, Pill **„HEUTE: LOGO FÜR 60 °C“** | Fahrt auf Zeile 3 | Wie findet sie das? | Whoosh quick, Chime | M-003 |
| 13,45–16,10 | Plus, Research an, Ergebnis anhängen. | Claude-Paper nach Shot 01: Zeiger auf „+“, Klick (14,09), Research (14,57), Pill an (14,98), Datei-Chip „Shirt-Firma Ergebnis Ärger.md“ fliegt rein (15,25). Chips RESEARCH · ANHANG · FRAGE | Paper vorn, Zoom aufs Menü, dann Chip | Wo klicke ich? | Klick, Klick, Check, Pop-tief | M-004, M-008 |
| 16,10–18,18 | Frage: Was hält 60 Grad ab einem Stück? | **Echter Shot 01** (Composer mit Anhang + Prompt + Research-Pill). Gelb „hält 60 Grad Wäsche dauerhaft aus“ (16,88), orange „schon ab einem Stück“ (17,74), Re-Hook „Die Frage zum Kopieren → am Ende“, Senden 17,94 | Pan entlang Markierung, Push-in | Was genau frage ich? | Tick, Typing, Pop-hoch, Klick-hoch | M-004 |
| 18,18–19,70 | Claude prüft 246 | **Echter Shot 02** „Research complete • 246 sources • 5m 21s“, Rahmen + Zähler 0→246 auf „246“ (18,75) | Push-in auf Quellenzeile | So viele? | Whoosh quick, Counter-Roll, Ping | M-005 |
| 19,70–20,27 | Quellen. | Wand der 8 Verfahren füllt sich mit Inhalt (Name + Waschtemperatur aus der Tabelle): STICK 95 °C · DTF 30–60 ? · DTG 30–40 °C · FLEX 30 °C · SIEBDRUCK ab 25–50 · TRANSFER ab 10 · SUBLIMATION nur Poly · PATCHES 30/60 ? | Pull-back auf die Wand | Welches nimmt sie? | Page-Turn, 2 Ticks; Musik-Pause | – |
| 20,27–21,69 | Die KI nimmt Stickerei. | auf „nimmt“ (20,80) dimmen 7 Karten, auf „Stickerei“ (20,99) fliegt Stick vor, Stempel **„→ STICK“**; optional Beleg-Kachel Shot 04 „Entscheidung: Stickerei“ | harter Push-in auf Stick | Warum gerade Stick? | Whoosh hoch, Tick, Stamp, Power-up; **Stille 20,08–20,33, Stab auf „Stickerei“** | M-011, M-002 |
| 21,69–23,20 | Warum? Beim selben Anbieter: | **Warum-Beat:** Stick-Karte oben, Pill „WARUM STICK?“ (21,69), Chip „gleicher Anbieter“ (22,23) | 0,3-s-Fahrt nach oben, dann ruhig | Warum? | Whoosh quick, Pop, Tick; **Drop 21,74** | Warum-Beat |
| 23,20–25,95 | Stick bis 95 Grad, Digitaldruck bis 30. | **Grund-Karte 1** (23,20): thermoHot, groß „95 °C“, klein „Stick“; auf „Digitaldruck“ (24,62) daneben „30 °C“ rot mit ✗, „Digitaldruck“. Steht 2,75 s | ruhig | Ist der Unterschied groß? | Pop-tief, Roll leise, Bump | Warum-Beat |
| 25,95–28,69 | Stick geht ab einem Stück, Siebdruck lohnt erst ab 50. | **Grund-Karte 2** (25,95): ein Shirt, groß „ab 1 Stück“, klein „Stick“; auf „Siebdruck“ (27,16) Stapel „ab 50 · Siebdruck lohnt“, „50“ pulsiert (28,19). Steht 2,74 s | ruhig | Und kleine Bestellungen? | Pop-tief, Pop-hoch, Tick | Warum-Beat |
| 28,69–31,65 | Haken: Fast alle Gradzahlen sind Anbieterangaben. | Pill „HAKEN“, Claude-Zitat-Karte „Fast alle Temperaturangaben stammen von Anbietern oder Händlern.“ (29,38), Marker „Temperaturangaben“ (29,83), Stempel „ANBIETERANGABEN“ (30,48) | Push-in aufs Zitat | Kann man den Zahlen trauen? | Page-Turn, Tick, Bump | – |
| 31,65–34,67 | Als Nächstes: Was verlangt die Konkurrenz für bestickte Shirts? | Pill „ALS NÄCHSTES“, Frage-Karte (32,41), Marker „Konkurrenz“ (33,06), Stick-Icon an „bestickte“ (33,68) | leichter Push-in | Was kostet das bei anderen? | Whoosh airy, Pop, Pop-tief | offener Faden |
| 34,67–41,5 | Kommentiere „Druck“, … Vergleichstabelle. Damit hast du in 10 Minuten die passenden Verfahren mit Quellen. | Endkarte: Keyword tippt (35,13), Haken, Flieger (35,71), Items „Die Frage“ (36,44) und „Die Vergleichstabelle“ mit Ausschnitt aus **Shot 03** (37,00), „in 10 Minuten“ (38,46), „passende Verfahren mit Quellen“ (39,44), Quellen-Chips (39,95), Bot-Hüpfer 40,8, Halt bis 41,5 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Whoosh hoch, 2× Pop-hoch, Chime, Pop | M-007, M-011 |

Prüfung M-009: längste Strecke ohne neue Änderung ≈ 1,5 s (24,62 → 25,95 = 1,33; 27,16 → 28,19 = 1,03; 39,95 → 40,8 → 41,5). Warum-Karten: 23,20 → 25,95 = 2,75 s, Karte 2 bis 28,69 = 2,74 s (je ≥ 1,2 ✓).

## Shots (echte claude.ai-Ausschnitte, `public/firma-ep/tag4/shots/`)
- 01-research-und-prompt.png → Beat 16,10–18,18 (und Vorlage für das Paper davor: blaue Research-Pill, Anhang-Chip)
- 02-research-fertig.png → Beat 18,18–19,70
- 03-ergebnis-tabelle.png → Wand-Inhalt (Werte) + Endkarten-Item „Vergleichstabelle“
- 04-empfehlung.png → optional Beleg-Kachel beim Gewinner
Keine Sidebar, keine privaten Chats (laut LAUF bereits entfernt).

## Ton
- Musik: GONE-Original ab **57,26 s**, am Stück, nie geloopt (Details `musik.txt`). Leiser Einstieg, Pause im Bett 20,08–20,33 vor der Pointe, Stab genau auf „Stickerei“, Drop auf „Warum?“, ab dann tiefer gedückt (zweite Hälfte des Stücks lauter). Gemessen jeder Akt 18,3–23,6 dB unter der Stimme (≥ 15 ✓, vor dem finalen Mix; firma-mix misst nach). Ziel −14 LUFS, TP −1.
- SFX: 21 verschiedene Dateien (Pop/Pop-hoch/Pop-tief, Klick/Klick-hoch, Tick, Check, Chime, Ping, Page-Turn, Typing, Counter-Roll, Stamp, Stamp-Clack, Power-up, Bump, Whoosh quick/kurz/airy/hoch), Whooshes nur 0,2–0,25. Keine Boom- oder Sub-Hits. Pfade in beats.json → `sfx_dateien`.

## Hinweise an firma-design
1. **Frame 1:** Waschtrommel + Thermometer-Zähler und zwei Freigabe-Etiketten. Der Hook-`prop` hat keine Trommel; dafür braucht es ein neues Objekt (in `src/components/firma/`, nicht in einer Einzel-Komposition). „Digitaldruck 30 °C“ rot mit ✗, nicht durchgestrichen (Chef). Kein bröckelnder Druck.
2. **Board:** Schritt für das Verfahren fehlt (s. Storyline-Check), `today.step: 2`.
3. **Warum-Karten mit Gegenwert:** Die Gründe sind Vergleiche (95 gegen 30, 1 gegen 50). In `beats.json → engine_akte → why.vs_wunsch` steht der Gegenwert je Karte mit eigenem Anker. Ohne `vs`-Feld: Fallback `small: "Stick · gleicher Anbieter"` bzw. „Stick“, Gegenwert dann als zweite Zeile.
4. **Rückblick-Länge:** Akt läuft 5,65 → 11,77 = 6,1 s inkl. Fahrt-Auftakt. Gesprochen 5,95 s. Die Engine-Warnung (> 6 s) ist dadurch knapp erwartbar.
5. **Shirt-Karte im Rückblick** unter dem Board (Lehre Folge 3), Board-Labels groß.
6. **Umsatz-Zähler:** keiner (0 €).
