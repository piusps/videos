# Regieplan · Folge 5 „Konkurrenz“ (Serientag 2, nicht erste Folge des Tages, Slot 2026-10-29 12:00)

firma-regie, 2026-10-28 abends. Grundlage: script.txt (bestanden, Runde 3, Wortlaut unverändert), ../firma-tag4/tagesbriefing-2026-10-29.md, briefing.md, thema.md („Für die Regie“), hooks.md, pruefung/autor-runde3.md (Hinweise 1–3), design/lauf/LAUF.md + bericht.md (Chat 38be4ae6…, 295 Quellen, 7m 19s, 14 Anbieter), Vorlage Folge 4 (regieplan/beats/musik) und Engine-Schema `src/components/firma/schema.ts`.
Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag5/`), `beats.json`, `musik.txt`, Arbeitsdateien in `regie/`.

## Storyline-Check (Bibel v2)
- Kette: Folge 4 endete mit „Was verlangt die Konkurrenz für bestickte Shirts?“ → Folge 5 beantwortet genau das (ab rund 110 € für fünf, Lücke = einzelne Nachbestellungen ohne neue Einrichtung) → Folge 6 „Welcher Partner stickt Sechzig-Grad-Shirts einzeln, ohne Neueinrichtung?“. Kein Sprung, keine Wiederholung, kein „gestern“, kein Tag gesprochen.
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Kein neuer Kunde, kein neues Produkt; Angebot wird geschärft (Gleichstand beim Preis + Nachbestellen ab 1).
- Rückblick-Satz 1 „… bestickt erst auf Bestellung.“ (Chef-Entscheid ab Folge 5) ✓.
- **95 °C gegen 60 °C (Prüfer-Hinweis 1):** Im Bild getrennte Objekte. Rückblick „Stick, bis 95 Grad“ = **Garnrolle/Stick-Emblem „Garn 95 °C“** am Board-Schritt DRUCK. „Als Nächstes … Sechzig-Grad-Shirts“ = **Shirt mit Pflegeetikett „Shirt-Stoff 60 °C“**. Nie dasselbe Objekt, nie dieselbe Farbe/Form.
- Board: wie Folge 4, DRUCK jetzt erledigt, `today.step: 3` (PREIS). PREIS bleibt current bis Folge 7 (Konkurrenz → Partner/Einkauf → Verkaufspreis), Vorschlag in `beats.json → plan_vorschlag`.

## Stimme
- Gleiche Stimme und Settings wie Folge 4: `scripts/eleven-tts.mjs`, Keno `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **TTS_SPEED=1.15**.
- **TTS-Text:** `regie/script-tts.txt` = script.txt mit einer Änderung: „Stick,“ → „Schtick,“ (Rückblick-Satz 2). words.json/Untertitel „Stick“. Sonst kein Wort geändert, Ausweichtext für Satz 2 nicht nötig.
- Rohtake `regie/voice-raw.mp3` (45,23 s). Rückblick dort zu lang (Die → Grad. = 6,8 s, Satz 1 allein 4,2 s, keine Pause nach „aus.“). Darum Rückblick neu: 6 Takes mit `previous_text`/`next_text` (`regie/recap.mjs`, `regie/recap/take1–6`), genommen **Take 4** (schnellster, STT sauber, „Schtick“ Anlaut 3,6 kHz = sch). Eingesetzt per `regie/splice.py` (Karte `regie/splice-map.json`).
- Rückblick-Sätze mit **atempo 1,04** (nur Take-4-Teil, ≤ 4 % ✓), Pausen im Rückblick gekürzt (s. u.).

### Betonungstest (im Satzkontext, Tempo 1,15; STT + Silbenanalyse Pegel/Tonhöhe/Dauer, `regie/stress.py`, Takes in `regie/betonung/`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| fünfundneunzig Grad | FÜNF- höchste Tonhöhe (182 Hz), NEUN- zweitlautest, „Grad.“ längste Silbe 0,25 s fallend; STT „fünfundneunzig Grad“ | Original |
| Sechzig-Grad-Shirts | SECH- höchste Tonhöhe (165 Hz), „Shirts“ englisch, STT „60 Grad Shirts“ | Original |
| Neueinrichtung | NEU- lautester Teil (−14,0 dB), fällt danach ab = NEU-einrichtung ✓ | Original |
| Workwear(-Shop) | WORK- höchste Tonhöhe (160 Hz), englisch „Wörkwer“, STT „Workwear-Shop“ | Original |
| Konkurrenz / Konkurrenzpreise | -renz längste Silbe (0,30 s im CTA), kein Anfangsakzent-Ausreißer; STT jeweils korrekt | Original |
| Stick (als „Schtick“) | Anlaut-Schwerpunkt 3,6 kHz (sch-Bereich wie „Shirts“ 4,5 / „stickt“ 3,1–3,5 kHz, `regie/fric.py`) | „Schtick“ im TTS-Text |
| zweihundertfünfundneunzig, hundertzehn, Untergrenzen | STT „295“, „110“, „Untergrenzen“ | Original |

### STT (scribe_v1, de) Wort für Wort gegen script.txt (`regie/cmp.py`, `regie/stt-final.json`)
- **138/138 Tokens, 136 identisch.** Zwei Abweichungen sind dieselbe STT-Normalisierung wie in Folge 2–4, kein Sprechfehler: „probier“ → „probiere“, „schick“ → „schicke“.
- Alle Zahlen erkannt (100, 95, 5, 295, 110, 5, 5, 5, 60, 10).

### Pausen (Schnitt in echten Pausen < −45 dBFS, 3-ms-Fades, `regie/splice.py`)
| Stelle | roh | neu |
|---|---|---|
| führt? → Ich | 0,29 | 0,25 |
| aus. → Die | ~0,02 | 0,15 (Stille eingesetzt) |
| Betriebe, → bestickt | 0,15 | 0,08 |
| Bestellung. → Zuletzt | 0,38 | 0,12 |
| Schtick, → bis | 0,15 | 0,08 |
| Grad. → Heute | – | 0,20 |
| Shirts? → Claude | 0,52 | 0,27 |
| **an. → Selbst (zwischen den Gründen)** | 0,15 | **0,30** |
| „Konkurrenz“, → und | 0,36 | 0,22 |
| Preistabelle. → Damit | 0,42 | 0,31 |
- **Rückblick:** „Die“ Einsatz 4,98 s → „Grad.“ Ende 10,74 s = **5,76 s** (Energie gemessen; laut words.json 4,94 → 10,84 = 5,90 s). ≤ 6,0 ✓, Puffer 0,24 s.
- **„Heute“ beginnt 10,91 s** (< 14 ✓), „Plus“ 12,57 s.
- **Länge:** voice.mp3 43,80 s (letzte Silbe hörbar bis 43,47) + 1,0 s Endkarte = **44,8 s** (40–48 ✓).
- words.json: Wortzeiten aus dem TTS-Alignment, mitverschoben. Für Captions: hundert→100, fünfundneunzig→95, zweihundertfünfundneunzig→295, hundertzehn→110, zehn→10, fünf/Fünf→5, „fünf.“→5., Sechzig-Grad-Shirts→60-Grad-Shirts, Schtick→Stick.

## Akte (roter Faden)
Story-Objekt ab der Ergebnis-Hälfte = **die Preiswand**, aus der das **orange Schild „1 SHIRT · OHNE NEUE EINRICHTUNG“** nach vorn fliegt und bis Ende Warum oben stehen bleibt.
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook | 0–4,85 | Preisschild „5 bestickte Shirts · ab rund 110 €“ + fünf „ERST AB“-Stempel; kein TAG-Slam, nur HUD-Badge TAG 2 | hook (neues result: priceTags) |
| 2 Rückblick | 4,85–10,88 | Gründungsplan + Shirt-Karte, DRUCK leuchtet „STICK BIS 95 °C“ + Garnrolle | recap |
| 3 Heute + Auftrag | 10,88–16,80 | Fahrt zu PREIS, Pill „HEUTE: KONKURRENZPREISE“; Claude-Paper (Shot 01a) → echter Shot 01b | recap + claude + claudeShot |
| 4 Suche | 16,80–18,80 | echter Shot 02 „295 sources • 7m 19s“ (nur Research-Block) | claudeShot |
| 5 Preiswand | 18,80–20,85 | Wand: 110/110/126/151 € + offener Pfeil „150 € bis über 200 €“ + 5× „ERST AB“ | wall |
| 6 Entscheidung | 20,85–24,75 | „=“ auf 110 €, dann oranges Schild „1 SHIRT · OHNE NEUE EINRICHTUNG“ vor, Stempel „NACHBESTELLEN AB 1“ | winner |
| 7 Warum | 24,75–31,00 | orange Schild oben, 2 Grund-Karten mit Gegenwert | why |
| 8 Haken | 31,00–33,90 | Claude-Zitat „… Untergrenzen“ | question |
| 9 Als Nächstes | 33,90–37,95 | Frage-Karte + Shirt „Shirt-Stoff 60 °C“ (eigenes Objekt) | question |
| 10 CTA | 37,95–44,8 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json. Anker immer Wort + after, siehe beats.json (181 Anker gegen words.json geprüft, `regie/make_beats.py`).

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,96 | Wie viel Umsatz macht ein | **Frame 1 = Ergebnis, nur Belegtes:** Preisschild „5 bestickte Shirts · **ab rund 110 €**“ grün, ohne Obergrenze; dahinter fünf Shop-Schilder. Titel fällt auf „Umsatz“ | langsamer Push-in | Was kosten Firmenshirts – und warum verkauft eine KI sie? | Pop, Whoosh hoch leicht, Bump | M-002 |
| 0,96–2,84 | Unternehmen, das eine KI 100 Tage lang | Stempel „ERST AB 10 / 10 / 15 / 20 / 30“ knallen nacheinander auf die Schilder (0,96 → 2,11) | steht | Warum nehmen die keine 5 Stück? | Whoosh kurz, Clack, Tick | M-005 |
| 2,84–3,86 | ganz alleine führt? | Stempel „GANZ ALLEINE.“ | Punch-in 4 % | Wirklich ohne Mensch? | Whoosh quick, Stamp | M-011 |
| 3,86–4,85 | Ich probier das aus. | Hand legt Auftrag hin. **Kein TAG-Slam**, HUD-Badge „TAG 2“ klein | kleiner Pull-back | Was für ein Experiment? | Klick, Klick-hoch | Serienrahmen |
| 4,85–6,36 | Die Firma der KI verkauft Shirts mit | **Rückblick:** Board ganz im Bild, PRODUKT ✓ KUNDE ✓ DRUCK ✓; Shirt-Karte „SHIRTS MIT LOGO“ fliegt **unter** das Board (5,97) | steht | Worum geht es? | Whoosh hoch leicht, Pop-hoch | Rückblick-Akt |
| 6,36–8,71 | Logo an kleine Betriebe, bestickt erst auf Bestellung. | Logo als Stick aufs Karten-Shirt (6,36), Banner „erst auf Bestellung bestickt“ (7,45) | steht | Ohne Lager? | Tick, Page-Turn | – |
| 8,71–10,88 | Zuletzt nahm sie Stick, bis 95 Grad. | Schritt 3 DRUCK leuchtet grün, hüpft, Label groß **„STICK BIS 95 °C“**; auf „95“ (9,92) Puls + **Garnrolle „Garn 95 °C“** | leichter Push-in auf Schritt 3 | Und was kostet das woanders? | Check, Pop-tief | Rückblick-Akt |
| 10,88–12,50 | Heute vergleicht sie Konkurrenzpreise. | **Fahrt zu Schritt 4 PREIS**, gold, Shirt-Karte raus, Pill **„HEUTE: KONKURRENZPREISE“**, Preisschild-Stapel an der Zeile (11,86) | Fahrt auf Zeile 4 | Wie findet sie die Preise? | Whoosh quick, Chime, Pop-tief | M-003 |
| 12,50–14,60 | Plus, Research an, Ergebnis anhängen. | Claude-Paper nach Shot 01a: Zeiger „+“, Klick (12,57), Research (13,12), Pill an (13,42), Chip „Shirt-Firma Ergebnis Druck.md · 34 lines“ (13,70). Chips RESEARCH · ANHANG · FRAGE | Paper vorn, Zoom aufs Menü, dann Chip | Wo klicke ich? | Klick, Klick, Check, Pop-tief | M-004, M-008 |
| 14,60–16,80 | Frage: Was kosten 5 bestickte Shirts? | **Echter Shot 01b** (Anhang + Prompt + Research-Pill). Gelb „fünf T-Shirts mit seinem Logo als Stick“ (15,72), orange „Gesamtpreis für fünf Stück inklusive Einrichtung und Versand“ (16,32), Re-Hook „Die Frage zum Kopieren → am Ende“, Senden 16,62 | Pan entlang Markierung, Push-in | Was genau frage ich? | Tick, Typing, Pop-hoch, Klick-hoch | M-004 |
| 16,80–18,80 | Claude prüft 295 Quellen. | **Echter Shot 02**, nur Research-Block: Rahmen + Zähler 0→295 auf „295“ (17,36) | Push-in auf Quellenzeile | So viele? | Whoosh quick, Counter-Roll, Ping | M-005 |
| 18,80–20,85 | Am günstigsten: rund 110 Euro. | **Preiswand** füllt sich mit Inhalt (18,66): 110 · 110 · 126 · 151 € + offener Pfeil „150 € bis über 200 €“ (Claude-Zitat) + 5× „ERST AB“. Auf „günstigsten“ dimmen 126/151/Pfeil, auf „110“ (19,82) Rahmen + Puls, Stempel „AB RUND 110 €“ | Pull-back, dann Push-in auf 110 € | Ist 110 € viel? | Page-Turn, Tick, Roll, Pop-hoch; **Bett still (Pause im Stück)** | M-002 |
| 20,85–22,20 | Die KI hält beim Preis mit | 110-€-Schilder bleiben vorn, auf „mit“ (21,86) **„=“** zwischen „UNSER PAKET“ und „RUND 110 €“ | harter Push-in | Nur gleich teuer? | Whoosh hoch, Tick; **Bett kommt auf „Die“ zurück** | M-011 |
| 22,20–24,75 | und setzt auf einzelne Nachbestellungen ohne neue Einrichtung. | auf „setzt“ dimmt die Wand, auf „einzelne“ (22,68) fliegt **orange Schild „1 SHIRT“** vor, „OHNE NEUE EINRICHTUNG“ (23,67), Stempel **„NACHBESTELLEN AB 1“** (24,10) | Push-in aufs orange Schild | Warum ist das die Lücke? | Power-up, Pop-tief, Stamp | M-011 |
| 24,75–25,41 | Warum? | **Warum-Beat:** orange Schild oben, Pill „WARUM DIE LÜCKE?“ | 0,3-s-Fahrt nach oben, dann ruhig | Warum? | Whoosh quick, Pop | Warum-Beat |
| 25,41–27,36 | 5 Anbieter nehmen 5 Stück nicht an. | **Grund-Karte 1** (25,41): Shirt-Stapel, groß „5 Stück“, klein „Erstauftrag“; auf „nicht“ (26,70) Gegenwert „erst ab 10–30“ rot ✗, klein „5 Anbieter“. Steht 1,95 s | ruhig | Lehnen die wirklich ab? | Pop-tief, Bump | Warum-Beat |
| 27,36–31,00 | Selbst der günstigste Workwear-Shop stickt kein einzelnes Shirt, erst ab 5. | **Grund-Karte 2** (27,36, nach 0,30 s Pause): einzelnes Shirt „neuer Geselle“, groß „1 Shirt“, klein „nachbestellen“; Wackler auf „einzelnes“ (29,46); auf „erst“ (30,19) Gegenwert „erst ab 5“ rot ✗, klein „günstigster Workwear-Shop“. Steht 3,64 s | ruhig, minimaler Push-in | Und ein einzelnes Shirt? | Pop-tief, Tick, Pop-hoch | Warum-Beat |
| 31,00–33,90 | Haken: Fast alle Summen sind Untergrenzen, von Claude addiert. | Pill „HAKEN“, Claude-Zitat-Karte „Die übrigen Werte habe ich aus Einzelpreisen selbst zusammengerechnet. Es sind meist ‚ab'-Preise, also Untergrenzen.“ (31,56), Stempel „UNTERGRENZEN“ (32,38), Marker „selbst zusammengerechnet“ (33,38) | Push-in aufs Zitat | Kann man den Preisen trauen? | Page-Turn, Bump, Tick | – |
| 33,90–37,95 | Als Nächstes: Welcher Partner stickt 60-Grad-Shirts einzeln, ohne Neueinrichtung? | Pill „ALS NÄCHSTES“, Frage-Karte (34,58), **Shirt mit Pflegeetikett „Shirt-Stoff 60 °C“** (35,62, anderes Objekt als die Garnrolle), Chip „1×“ (36,48), Chip „keine neue Einrichtung“ (37,12), Partner als Fragezeichen-Silhouette | leichter Push-in | Gibt es so einen Partner? | Whoosh airy, Pop, Pop-tief, Tick | offener Faden |
| 37,95–44,8 | Kommentiere „Konkurrenz“, … Preistabelle. Damit hast du in 10 Minuten deine Konkurrenzpreise. | Endkarte: Keyword tippt (38,53), Haken, Flieger (39,38), Items „Die Frage“ (40,14) und „Die Preistabelle“ mit Ausschnitt aus **Shot 03** (40,67), „in 10 Minuten“ (42,09), „deine Konkurrenzpreise“ (42,77), Preisschild-Chips (43,22), Bot-Hüpfer 43,97, Halt bis 44,8 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Whoosh hoch, 2× Pop-hoch, Chime, Pop | M-007, M-011 |

Prüfung M-009 (≤ 1,5 s ohne Änderung): längste Strecken 23,67 → 24,10 → 24,80; 26,70 → 27,36 (0,66); 30,19 → 31,07 (0,88); 37,12 → 38,05 (0,93); 43,97 → 44,8. Warum-Karten: Karte 1 1,95 s, Karte 2 3,64 s (je ≥ 1,2 ✓), Pause zwischen den Gründen 0,30 s ✓.

## Shots (echte claude.ai-Ausschnitte, `public/firma-ep/tag5/shots/`)
- 01a-plus-menu-research.png → Vorlage fürs Paper (Plus-Menü, Research)
- 01b-prompt-mit-anhang.png → Beat 14,60–16,80 (Begrüßung „Good evening, …“ oben abschneiden)
- 02-research-fertig.png → Beat 16,80–18,80, **nur Research-Block** (y ≤ ca. 240 px): darunter steht „Sechs Anbieter“, gesprochen wird „Fünf“
- 03-ergebnis-tabelle.png → Werte der Preiswand + Endkarten-Item „Preistabelle“
- 04-luecke.png → optional Beleg-Kachel beim orangen Schild („Marktlücke …“, Grund 1 „neuer Geselle, ein Shirt“)
Keine Sidebar, keine privaten Chats (laut LAUF entfernt).

## Ton
- Musik: GONE-Original ab **3,47 s**, 44,8 s am Stück, nie geloopt (Details `musik.txt`). Ruhiger Einstieg, natürliche Pause im Stück unter „rund 110 Euro“, Wiedereinstieg genau auf die Entscheidung („Die“, 20,88), am Ende tiefer gedückt. Jeder Akt 18,8–32,7 dB unter der Stimme (≥ 15 ✓, vor dem finalen Mix). Ziel −14 LUFS, TP −1.
- SFX: dieselbe Bibliothek wie Folge 4 (21 Dateien, `beats.json → sfx_dateien`), Whooshes nur 0,2–0,25, keine Boom-/Sub-Hits. Stamp nur 2× („alleine“, „NACHBESTELLEN AB 1“), Clack für die ERST-AB-Stempel im Hook, Bump auf „Untergrenzen“.

## Hinweise an firma-design
1. **Frame 1 (neu):** Hook-`result` kennt nur `washer`. Gebraucht wird ein Preisschild-Objekt `priceTags` (in `src/components/firma/`): großes Schild „5 bestickte Shirts · ab rund 110 €“ grün, **keine Obergrenze**, fünf kleinere Shop-Schilder mit Stempeln „ERST AB 10/10/15/20/30“ (Anker in `beats.json → hook_wunsch`). Keine Namen, keine 208 €.
2. **Preiswand:** 10 Karten (4 Preise + offener Pfeil + 5 „ERST AB“). Falls die Wand nur 8 fasst: die 5 „ERST AB“ als eine Reihe kleiner Stempel-Schilder unter den Preisen. Der Pfeil „150 € bis über 200 €“ läuft rechts offen aus, kein Schild mit Endwert.
3. **Gleichstand-„=“** auf „mit“ (21,86) zwischen „UNSER PAKET“ und „RUND 110 €“: Winner-Akt hat dafür kein Feld (`engine_akte → winner.wunsch_gleich`).
4. **95 °C ≠ 60 °C:** Garnrolle „Garn 95 °C“ im Rückblick, Shirt mit Pflegeetikett „Shirt-Stoff 60 °C“ in „Als Nächstes“ (`question.wunsch_objekte`). Question-Akt hat dafür kein Feld.
5. **Shot 02:** Kamera nur auf den Research-Block, „Sechs Anbieter“ darf nicht sichtbar sein (auch nicht im Haken-Akt, falls dort statt der Paper-Karte der echte Ausschnitt genommen wird).
6. **Warum-Karten:** `vs` mit `bad: true` (rot ✗, nicht durchgestrichen) ist im Schema vorhanden, Werte stehen in `engine_akte → why.cards`.
7. **Kein TAG-Slam** (`ersteFolgeDesTages: false`), HUD-Badge „TAG 2“ bleibt. Kein Umsatz-Zähler (0 €).
8. **Rückblick:** Akt 4,85 → 10,88 = 6,0 s inkl. Fahrt-Auftakt, gesprochen 5,76 s. Shirt-Karte unter dem Board.
