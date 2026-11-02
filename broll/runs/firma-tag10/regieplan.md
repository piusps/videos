# Regieplan · Folge 10 „Website“ (Serientag 3, nicht erste Folge, Slot 2026-10-30 15:00)

firma-regie, 2026-10-30. Grundlage: script.txt (Stand Autor Runde 2, 100 Wörter, Wortlaut unverändert), briefing.md, ../firma-tag9/tagesbriefing-2026-10-30.md (inkl. Chef-Entscheide), thema.md („Für die Regie“), hooks.md (Variante F), design/lauf/LAUF.md + Screenshots 01–05 + website-handy.png. Vorlagen Folge 8 (runs/firma-tag8/) und Folge 9 (public/firma-ep/tag9/).
Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag10/`), `beats.json`, Arbeitsdateien und Hilfsskripte in `regie/` (`make_beats.py` erzeugt beats.json aus words.json).

## REGIE v2 (2026-10-30, Skriptänderung Autor nach Prüfung Runde 2)
- Geändert nur zwei Sätze (alles andere = v1, Audio bis zur Pause nach „Website.“ samplegenau aus v1, `regie/assemble_v2.py`):
  - Zeile 4: „Auftrag mit Logo: Startseite fürs Handy.“ → **„Logo anhängen. Bitte: Startseite fürs Handy.“** (Retake **weg1** von 5: „anhängen.“ fällt 170 → 71 Hz = Satzende, „Bitte:“ Ankündigung; Pausen 0,50 s nach „anhängen.“, 0,20 s nach „Bitte:“, am Pegel gemessen)
  - CTA: „… deinen Entwurf.“ → **„… deinen Startseiten-Entwurf.“** (Retake **damit1** von 5; Betonungstest: Hauptton auf START- (109 → 137 Hz), Ende fällt; STT „Startseitenentwurf“ in allen Takes)
  - Einsetzen wie „sie anmelden?“: `regie/prep_retake2.py` (Pegel angeglichen 0,919 / 0,895) → `splice.py` (Pausen 43: 0,50, 44: 0,20) → `assemble_v2.py` → `snap_words.py` (Wortgrenzen ab Wort 42 an echte Stille angepasst; Wörter 0–41 exakt v1).
- **Unverändert:** Rückblick 6,44 s, „Heute“ 13,84 s, Wörter 0–41 in words.json byte-gleich v1.
- **Neu:** Weg-Start („Logo“) 15,98 s, „Ganz“ 19,46 s, CTA-Ende (Sprache „Startseiten-Entwurf.“) 45,43 s, voice.mp3 45,70 s, Folge mit Endkarte **46,43 s**. Tempo 100 / 45,43 s = **132,1 wpm** (Sprache), 129,2 wpm über die ganze Folge.
- STT: 8 Läufe über die Endfassung, 5× 100/100, 3× 98/100 („probier“ → „probiere“, „schick“ → „schicke“; beide Stellen liegen im unveränderten v1-Teil bzw. CTA-Anfang, akustisch ohne Schwa, bekannter STT-Fehler wie Folge 8). Neue Sätze in 8/8 Läufen korrekt.
- Musik: Start auf **57,325 s** verschoben (Schlag im Stück wieder genau auf „Firmenshirts“ 20,98), 46,43 s bis 103,755; Explicit-Check `regie/musik-abschnitt-v2.mp3` 2× **0 explizite Wörter**. Kurve [0, 0.05] [19.1, 0.05] [19.35, 0.018] [20.85, 0.018] [20.95, 0.06] [21.7, 0.035] [45.43, 0.035] [46.43, 0].
- beats.json neu aus `regie/make_beats.py`: B09 beginnt auf „Logo@15.5“ (Chip-Rahmen auf „anhängen“, Tick auf „Bitte“, Prompt-Markierung auf „Startseite“); Endkarten-Block jetzt „STARTSEITEN-ENTWURF IN MINUTEN“ (3 Wörter). Alle Abstände neuer Textblöcke ≥ 1,2 s (außer Pill → Karte 1 wie v1). Zeitangaben unten im Beat-Plan sind v1-Stand; nach „Website.“ verschieben sich alle um ~+0,07–0,10 s, maßgeblich sind die Anker in beats.json.
- v1-Stände: `regie/voice-v1.mp3`, `regie/words-v1.json`, `regie/beats-v1.json`, `regie/regieplan-v1.md`.

## Storyline-Check (Bibel v2 + Kette Tagesbriefing)
- Folge 9 endete mit „Als Nächstes: Was muss oben auf ihre Website?“ → Folge 10 beantwortet genau das (drei Dinge oben) → Übergabe „Was muss sie anmelden?“ wird von Lauf 11 beantwortet (Gewerbeanmeldung zuerst). Kein Sprung, kein „gestern“, kein Tag gesprochen.
- Kasse 0 € → 0 €, kein Umsatz-Zähler. Kein neuer Kunde/kein neues Produkt. Neu: Website-Entwurf (privat, nicht online).
- Rückblick-Satz 2 „Logo: dunkelblauer Block.“ = Ergebnis Folge 9; Bild = das echte Logo landet auf LOGO.
- Kein Widerspruch zu früheren Folgen gefunden. Kein Ticket an firma-autor.

## Stimme
- Serienstimme wie Folge 2–9: `scripts/eleven-tts.mjs`, ElevenLabs „Keno“ `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **TTS_SPEED=1.0**. TTS-Text `regie/script-tts.txt` = script.txt (keine Sonderschreibung).
- 3 Volltakes (`regie/voice-raw1–3.mp3`), gewählt **Take 3** (beste Betonung: „Website.“ fällt als Aussage, „Bestellknopf“ trägt auf -stell-, „Haken:“ fällt, Rückblick schon roh 6,46 s).
- **Ein Satz ersetzt:** „Als Nächstes: Was muss sie anmelden?“. Grund: nach dem Pausenschnitt hörte STT in 6/6 Läufen „Was muss **die** anmelden?“ (im Rohtake „sie“; Pausenvariation an „Nächstes:“ änderte nichts, also Lautgrenze „muss sie“). 6 Retakes (`regie/retake/frage1–6`), gewählt **frage3** (STT 3/3 „sie“ in der Endfassung, leichter Anstieg am Ende von „anmelden?“ 94 → 108 Hz = Frage-Melodie, Pegel angeglichen, Faktor 0,897; `regie/prep_retake.py` → `voice-raw3b.mp3`).

### Betonungstest (Satzkontext, Tempo 1,0; `regie/betonung.mjs`, Takes in `regie/betonung/`, Silben `regie/stress10.py`, Volltake-Verlauf `regie/wordcontour.py`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| Website | WEB- lauter/höher (−16,8 dB/113 Hz vs −21,4), englisch; im Volltake 3 fallend (Aussage). STT korrekt | Take 3 |
| Startseite | START- höchste Tonhöhe (168 Hz), STT korrekt | Take 3 |
| Online-Checkliste | ON- höchste Tonhöhe, englisch „on-lain“, „Check“ vor „lis“; STT „Online-Checkliste“ | Take 3 |
| Datenschutzerklärung | DA- lautester Teil (−13,8 dB), flüssig ohne Stocken, STT korrekt | Take 3 |
| Bestellknopf | be-STELL-knopf (-stell- länger/lauter, im Volltake 3 Tonhöhe 209–234 Hz), kein Stocken, STT korrekt | Take 3 |
| Impressum | Im-PRES-sum: Anstieg auf -pres- (141–163 Hz), Spitze nachlaufend; STT korrekt | Take 3 |
| dunkelblauer | DUN- höchste Tonhöhe (172 Hz), STT korrekt | Take 3 |
| Kommentiere | kommen-TIE-re (Tonhöhe auf -tie-), STT korrekt | Take 3 |
| Haken: | im Einzeltest steigend (Doppelpunkt-Spannung), im Volltake 3 **fallend** 144 → 86 Hz = Aussage | Take 3 |
| anmelden? | W-Frage: hoher Einsatz, Fall, leichter Anstieg am Ende | **frage3** |
| probier / schick | in den finalen STT-Läufen korrekt („probier“, „schick“); frühere Läufe „probiere/schicke“ = bekannter STT-Fehler | – |

### STT (scribe_v1, de) Wort für Wort gegen script.txt (`regie/cmp.py`)
- **100/100 Wörter identisch in 3 von 3 Läufen** über die Endfassung (`regie/stt-final*.json`).

### Pausen (nur an Satz-/Doppelpunktgrenzen, Stille < −45 dBFS, 3-ms-Fades; `regie/splice.py`, Karte `regie/splice-map.json`)
| Stelle | roh | neu |
|---|---|---|
| führt? → Ich | 0,44 | 0,70 |
| aus. → Die | 0,62 | 0,70 |
| Betriebe, → bestickt (Rückblick) | 0,23 | 0,15 |
| Bestellung. → Logo: (Rückblick, kurz wegen ≤ 6,5 s) | 0,09 | 0,20 |
| Logo: → dunkelblauer (Rückblick) | 0,17 | 0,12 |
| Block. → Heute | 0,49 | 0,70 |
| Website. → Auftrag | 0,33 | 0,70 |
| Logo: → Startseite | 0,03 | 0,40 |
| Handy. → Ganz | 0,20 | 0,70 |
| sie: → Firmenshirts | 0,33 | 0,50 |
| Betriebe, → Preis, → Bestellknopf (Liste) | 0,11 / 0,08 | 0,25 / 0,25 |
| **Bestellknopf. → Warum (vor dem Warum)** | 0,18 | **0,90** |
| Warum? → Das | 0,33 | 0,70 |
| wissen. → Mehr (Grund 1 → 2) | 0,23 | 0,70 |
| Blick. → Haken: | 0,32 | 0,70 |
| Haken: → Ohne | 0,25 | 0,45 |
| online. → Als | 0,41 | 0,70 |
| Nächstes: → Was | 0,04 | 0,45 |
| anmelden? → Kommentiere | 0,33 | 0,70 |
| „Website“, → und | 0,29 | 0,30 |
| Online-Checkliste. → Damit | 0,44 | 0,70 |

Kein Tempo-Eingriff, kein atempo. Die Pause zwischen Grund 1 und 2 ist 0,70 statt ~0,3 s, weil die drei Fragekarten je 1,2 s brauchen (Karte 3 kommt in dieser Pause).

### Messwerte Endfassung
- **Länge:** voice.mp3 45,16 s (Datei 45,19 s mit MP3-Auffüllung) + 1,0 s Endkarte = **46,16 s** (40–48 ✓).
- **Sprechtempo:** 100 Wörter / 45,16 s = **132,9 wpm** (nur Stimme), 130,0 wpm über die ganze Folge mit Endkarte (120–135 ✓).
- **Rückblick** „Die“ → „Block.“: **6,44 s** (Alignment), 6,26 s am Pegel (≤ 6,5 ✓, nicht beschleunigt).
- **„Heute“ beginnt bei 13,84 s** (Pegel 13,87; ≤ 14,5 ✓).
- Stimme −18,5 LUFS integriert (vor dem Mix).
- words.json: Zeiten aus dem TTS-Alignment, durch Retake und Schnitte mitverschoben. Caption-Ziffer: „hundert“ → 100. 100 Caption-Wörter.

## Akte (roter Faden)
Durchgehendes Story-Objekt: **das Handy mit der echten Website-Vorschau** (website-handy.png, Stempel „ENTWURF“). Es ist Frame 1, geht für Rückblick und Claude-Lauf aus dem Bild, kommt aus der Artifact-Karte zurück und bleibt von der Entscheidung bis „Als Nächstes“ stehen (groß → oben → klein).
| Akt | Zeit | Ort / Hauptobjekt | Engine-Typ |
|---|---|---|---|
| 1 Hook (ohne Tag) | 0–6,81 | Handy mit Website + ENTWURF, Hook-Frage; HUD TAG 3 klein | hook (Story-Objekt im Platz hook) |
| 2 Rückblick | 6,81–15,99 | Gründungsplan, Produkt-Karte, Logo landet auf LOGO, Fahrt zu WEBSITE | recap |
| 3 Claude-Lauf | 15,99–19,36 | echter Shot 01 (Anhang + Prompt-Zeile), Shot 05 (Artifact-Karte) | claudeShot ×2 |
| 4 Entscheidung | 19,36–24,87 | Handy groß, drei Zonen nacheinander | Story-Objekt + Marks |
| 5 Warum | 24,87–30,43 | Handy oben, 3 Fragekarten, dann Falz unter dem Button + ERSTER BLICK | why (bare) + Overlays |
| 6 Haken | 30,43–34,74 | Handy, Felder IMPRESSUM / DATENSCHUTZ, ENTWURF schlägt nach | question (card:false) |
| 7 Als Nächstes | 34,74–37,70 | Board klein: WEBSITE „ENTWURF“, neues „?“-Feld, Frage-Karte | question |
| 8 CTA | 37,70–46,16 | Endkarte | end |

## Beat-Plan
Zeiten aus words.json. Anker immer Wort + after (beats.json).

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–1,20 | Wie viel Umsatz macht ein | **Frame 1 = Ergebnis:** Handy mit echter Vorschau (Logo, „Firmenshirts mit gesticktem Logo.“, 109 € für 5, 29,90 €, „Jetzt bestellen“, [VERSANDKOSTEN] sichtbar), Stempel „ENTWURF“, Hook-Frage komplett ab Frame 0, Drop auf „Umsatz“, HUD TAG 3 | langsamer Push-in, Punch auf „Umsatz“ | Ist die Seite echt? | Pop, Whoosh hoch, Bump, Tick | M-002, M-011 |
| 1,20–3,65 | Unternehmen, das eine KI 100 Tage lang | Logo-Zone glimmt, Seite federt, Preisbox pulsiert, Button drückt sich ein (je ein Ereignis pro 0,5 s, kein neuer Text) | steht, Mini-Punch auf „100“ | Kann eine KI das allein? | Whoosh kurz, Tick, Pop, Klick | |
| 3,65–5,28 | ganz alleine führt? | Stempel „GANZ ALLEINE.“, Punch-in, ENTWURF wackelt nach | Punch-in 4 % | Wirklich ohne Mensch? | Whoosh, Clack, Bump, Tick | M-011 |
| 5,28–6,81 | Ich probier das aus. | Handy raus, Board blendet ein, Maskottchen hüpft. Kein Slam | Pull-back | Was ist das Experiment? | Whoosh, Pop, Klick | Serienrahmen |
| 6,81–10,21 | Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, | Board: PRODUKT–NAME abgehakt; Karte „SHIRTS MIT LOGO“ auf „verkauft“ | ruhig | Worum geht es? | Whoosh hoch leicht, Pop | Rückblick |
| 10,21–11,70 | bestickt erst auf Bestellung. | Banner „erst auf Bestellung bestickt“ | steht | Ohne Lager? | Page | Rückblick |
| 11,70–13,84 | Logo: dunkelblauer Block. | echtes Logo fliegt auf LOGO, Haken, Zeile leuchtet (zuletzt erledigt) | leichter Push-in | Und jetzt? | Whoosh, Check, Pop tief | Rückblick |
| 13,84–15,99 | Heute baut sie ihre Website. | Fahrt zu WEBSITE (gold), Pill „HEUTE: WEBSITE“ | Fahrt auf die Zeile | Was kommt auf so eine Seite? | Whoosh, Chime | Rückblick |
| 15,98–18,24 (v2) | Logo anhängen. Bitte: Startseite | echter Shot 01 (Begrüßung weggeschnitten): Chip „Kolonnenshirt-Logo.svg“ orange (auf „anhängen“), Tick auf „Bitte“, Prompt-Zeile „Bau mir eine einfache Startseite … fürs Handy gedacht.“ gelb (auf „Startseite“) | Push-in auf Chip, Pan in den Prompt | Was genau hat sie gefragt? | Page, Pop tief, Typing | M-004 |
| 18,14–19,36 | fürs Handy. | Senden-Klick, Schnitt auf Shot 05: Artifact-Karte „Kolonnenshirt Startseite · Nur du“ gerahmt, Klick, Karte wächst zum Handy | Push-in, Übergang | Was kommt raus? | Klick hoch, Whoosh, Klick | M-004 |
| 19,36–20,88 | Ganz oben stellt sie: | Handy groß, Beleg-Kachel Shot 02 (Band „Was ganz oben steht und warum“) klein oben rechts; **Musik fast still** | langsamer Push-in aufs obere Drittel | Was kommt nach oben? | Page | Stille vor der Pointe |
| 20,88–23,20 | Firmenshirts für Betriebe, Preis, | Zone 1 (Satz + Zielgruppe) gerahmt, Badge 1 orange (Musik-Schlag im Stück genau hier); Zone 2 Preisbox auf „Preis“ | Push-in Zone 1, Fahrt zur Preisbox | Und der Preis? | Power, Pop tief, Pop hoch | M-002 |
| 23,20–24,87 | Bestellknopf. | Zone 3 „Jetzt bestellen“ gerahmt, Button drückt sich ein; 0,9-s-Pause: Bild steht | Halt | Warum genau diese drei? | Klick, Check | |
| 24,87–28,11 | Warum? Das wollen Betriebe schnell wissen. | Handy oben, Pill „WARUM DIESE DREI?“; Karten „IST DAS FÜR MICH?“ (25,50 → Zone 1), „WAS KOSTET ES?“ (26,70 → Zone 2), „WIE BESTELLE ICH?“ (27,90 → Zone 3), stapeln | kurze Fahrt nach oben, ruhig | Warum? | Whoosh airy, Pop, 3× Pop tief | Warum-Beat |
| 28,11–30,43 | Mehr passt nicht in den ersten Blick. | Handy-Bild **direkt unter „Jetzt bestellen“ beschnitten** (Original-y 1745), darunter abgedunkelt, gestrichelte Falz-Linie; „So funktioniert's“ nie sichtbar. Karte „ERSTER BLICK“ auf „ersten“ (29,21, steht 1,22 s bis HAKEN) | leichter Pull-back, ganzes Handy mit Falz im Bild | Passt nicht mehr drauf? | Whoosh kurz, Pop hoch | Warum-Beat |
| 30,43–31,27 | Haken: | Pill „HAKEN“, Fragekarten raus | Push-in aufs Handy | Was ist der Haken? | Whoosh, Page | Grenze als Befund |
| 31,27–34,74 | Ohne Impressum und Datenschutzerklärung nicht online. | Felder „IMPRESSUM“ (31,53) und „DATENSCHUTZ“ (32,76) gestrichelt mit „?“; auf „online“ schlägt „ENTWURF“ nach. **Kein Screenshot 04**, kein „NICHT ONLINE“, keine Domain/Hosting | ruhig, leichter Push-in | Warum darf sie nicht online? | 2× Pop hoch, Stamp | Grenze als Befund |
| 34,74–37,70 | Als Nächstes: Was muss sie anmelden? | Pill „ALS NÄCHSTES“, Board klein: WEBSITE mit „ENTWURF“ (nicht grün), neues gestricheltes Feld nur mit „?“ (poppt auf „anmelden“); Frage-Karte „WAS MUSS SIE ANMELDEN?“ (35,95) | leichter Push-in aufs „?“ | Was muss man anmelden? | Whoosh airy, Pop, Tick, Pop tief | offener Faden |
| 37,77–46,43 (v2) | Kommentiere „Website“, … Damit hast du in wenigen Minuten deinen Startseiten-Entwurf. | Endkarte: Keyword tippt, Haken, Flieger; Items „Die Frage“ (40,24) und „Online-Checkliste“ (41,46; nur Lauf-Punkte, ohne Kontakt-Mail-Zeile); Block „STARTSEITEN-ENTWURF IN MINUTEN“ (42,73), Puls auf „Minuten“; Halt bis 46,43 | ruhiger Push-in, Halt | – | Pop, Typing, Check, Whoosh hoch, 2× Pop hoch, Chime, Pop | M-007 |

**Textregel-Prüfung** (neue Textblöcke, ohne Untertitel): Abstände 1,20 / 1,20 / 1,31 / 2,32 / 1,23 / 3,19 / 4,29 / 1,22 / 1,26 s; Karten ≤ 4 Wörter; nie zwei neue Blöcke im selben Moment. Einzige enge Stelle: Pill „WARUM DIESE DREI?“ (24,87) → Karte 1 (25,50) = 0,63 s, wie Folge 8 (Pill + erste Grundkarte); beide bleiben stehen. Fallback, falls der Prüfer 1,2 s auch hier verlangt: Pill weglassen (why.bare), Karte 1 trägt.
**M-009 (≤ 1,5 s ohne Änderung):** längste Strecken 23,20 → 24,87 (Glanz bei 23,7 dazwischen) und 43,70 → 46,16 (Endkarte, Bot-Hüpfer ~44,6 einplanen).

## Shots (echte claude.ai-Ausschnitte aus design/lauf/, nach `public/firma-ep/tag10/shots/` kopieren)
- 01-prompt-mit-anhang.png → B09/B10 (crop y 225–770 im Original 1050 px: ohne „Abendgedanken“-Begrüßung und Projekt-Hinweis), Endkarten-Item „Die Frage“.
- 05-artifact-karte.png → B10 (Karte „Kolonnenshirt Startseite · Nur du“).
- 02-entscheidung-gruende.png → Beleg-Kachel B11, nur Band y 120–315.
- 03 → nicht gebraucht. **04 → nie** (private Zeile, Chef K.-o.).
- website-handy.png = lokal aus Claudes Code gerendert (keine claude.ai-Pixel), so im Guide benennen.

## Ton
- Musik: GONE-Original (wie Folge 8/9) ab **57,50 s**, 46,16 s am Stück bis 103,66 s, nie geloopt. Heute keine Überschneidung mit Folge 9 (276,36–322,8); Abschnitt liegt im Bereich von Folge 4 (29.10., 57,26–98,76) – Vortags-Wiederverwendung wie Folge 8. Tabu 200–276 und die „shit“-Stellen ~20,2 / ~107 liegen außerhalb. Suche `regie/musik_suche.py`.
- **Explizit-Check:** `node scripts/music-explicit-check.mjs .env runs/firma-tag10/regie/musik-abschnitt.mp3` 2× → **0 explizite Wörter** (Gesang: „I'm all alone / It's just a dream … wake up from / My love's gone / I know love was all I had / I just-“).
- Struktur: ruhiger Einstieg (Clip 0–3 leiser als die Mitte), natürliche Mulde im Stück 19,2–19,95 unter „Ganz oben stellt sie:“, Schlag bei 20,8 genau auf „Firmenshirts“, ab 21,5 lauterer Teil → niedriger Faktor.
- Kurve (audio.musicCurve): [0, 0.05] [18.9, 0.05] [19.15, 0.018] [20.75, 0.018] [20.85, 0.06] [21.6, 0.035] [45.16, 0.035] [46.16, 0].
- Abstand Stimme ↔ Musik je Akt (`regie/gap.py`, RMS 400 ms, sprachgegatet, vor Loudnorm, `regie/gap-final.txt`): Hook 23,3 · Rückblick 20,4 · Auftrag 19,2 · Entscheidung 21,3 · Warum 18,8 · Haken 19,1 · Als Nächstes 19,1 · CTA 21,2 dB (jeder Akt ≥ 15 ✓). firma-mix misst nach dem Render erneut, Ziel −14 LUFS, TP −1.
- SFX: Palette wie Folge 8 (`beats.json → sfx_dateien`), Stempel nur Clack/Stamp, keine Boom-/Sub-Hits, Whooshes 0,18–0,22.

## Hinweise an firma-design
1. **Story-Objekt `websiteHandy`:** Handy-Mockup mit website-handy.png (nur der erste Bildschirm, nie website-handy-voll.png), Stempel „ENTWURF“ ab Frame 0, Zonen-Rahmen + Badges 1/2/3 (Koordinaten in beats.json, Original-px 1170 × 2532), Beschnitt/Abdunklung mit Falz bei y 1745, Plätze hook → off → groß → top → small → off. Kein Adressfeld/keine URL.
2. **Board:** done 0–6, current 7 (WEBSITE). LOGO = zuletzt erledigt, leuchtet mit dem echten Logo (Kolonnenshirt-Logo.svg). WEBSITE nie grün, ab Haken Etikett „ENTWURF“. Im Übergabe-Beat neues gestricheltes Feld nach WEBSITE nur mit „?“ (GEWERBE wird erst in Folge 11 beschriftet).
3. **Warum:** why.bare + 3 Fragekarten im 1,2-s-Raster, Pfeile auf die Zonen; danach Karte 4 „ERSTER BLICK“ an der Falz. Karten 1–3 vor HAKEN raus (whyOutLead), Karte 4 bis „Ohne“.
4. **Haken:** Felder statt Screenshot 04. Kein „NICHT ONLINE“, kein zweiter Stempel.
5. **Endkarte:** Snip „Online-Checkliste“ ohne die Zeile „Eine Kontakt-E-Mail … boilr …“.
6. **Umsatz-Zähler:** keiner (0 €).

## Auffälligkeiten für Chef/Autor (nichts am Skript geändert)
- Slot: briefing.md sagt 15:00 (verschoben), Tagesbriefing-Tabelle noch 12:00, thema.md/hooks.md 12:00. Regie nimmt 15:00 (Auftrag Chef).
- Tagesbriefing-Kette Folge 10 erwähnt „Domain, Hosting“ als fehlend; Lauf nennt das nicht → im Bild nirgends gezeigt (wie thema.md).
- „Warum?“-Antwort ist mit zwei kurzen Sätzen sehr knapp; die Fragekarten brauchen deshalb die 0,7-s-Pause nach „wissen.“, sonst stünden sie unter „Mehr passt nicht …“.
