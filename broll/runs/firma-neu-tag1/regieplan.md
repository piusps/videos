# Regieplan · Tag 1 (Neustart) · „Heute sucht die KI ihr Produkt“

firma-regie, 2026-10-26 abends. Grundlage: script.txt (FINAL, unverändert), hooks.md, konzept.md, design/lauf-tag1 (echter Lauf, englische UI, Dark Mode, „Research“, 314 Quellen), design/design-notizen.md (ShirtWorld3D / FirmaShirtsTag1).

## Stimme
- ElevenLabs, Serienstimme „Keno“ `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **speed 1.15** (wie `scripts/eleven-tts.mjs`, sk100d*).
- TTS-Text = script.txt wörtlich. Keine Ersatzschreibung nötig (Betonungstest unten).
- voice.mp3 = 35,47 s (letztes Wort endet 35,30 s). Video mit End-Halt: **36,3 s**.
- STT (scribe_v1, de) gegen Skript: 103/103 Wörter. Einzige Abweichung „probier“ → STT schreibt „probiere“; in der Hüllkurve gibt es kein angehängtes e („probier“ 0,24 s, direkt in „das“), das ist die Normalisierung des STT.
- words.json: Wort-Timings aus dem TTS-Alignment (`{i, w, s, e}`); für die Captions „Tag eins“ → „Tag 1.“, „dreihundert“ → „300“. „Erstens/Zweitens/Drittens“ bleiben Wörter (die Zahl steht in der Schritt-Leiste).

### Betonungstest (einzeln, im Satzkontext, Tempo 1,15; STT + Silbenanalyse Tonhöhe/Lautstärke/Dauer)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| Research | englisch erkannt; Varianten „Riesörtsch“/„Ri-sörtsch“ kippen auf deutsche Erstbetonung | **Original „Research“** behalten |
| Claude | englisch, einsilbig „Klohd“ (STT: Claude) | Original |
| Firmenshirts | Akzent auf FIR-, „shirts“ englisch | Original |
| Drucksachen | Akzent auf DRUCK- (im finalen Take Tonhöhe ≈ gleich, kein Kippen auf -sachen) | Original |
| Arbeitskleidung | Akzent auf AR- | Original |
| Kommentiere | Tonhöhen-Gipfel auf -TIE- | Original |
| „Ich probier das aus“ | ohne angehängtes e, flüssig | Original |
Gemini-Hörprüfung über OpenRouter war nicht möglich (Guthaben unter 0,50 $). **Pius sollte die zwei Stellen „Research“ (10,07 s) und „Drucksachen“ (21,89 s) einmal kurz anhören.**

## Beat-Plan
Zeiten aus words.json. Anker immer Wort + Mindestzeit (`after`), siehe beats.json.

| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–3,18 | Was passiert, wenn eine KI ganz alleine ein Unternehmen aufbaut? | **Hook = Produkt-Wand** „WAS VERKAUFEN WIR?“, 9 Karten bildfüllend ab Frame 1, oranger Gründer davor. Lichtkegel springt über Karten (0,95 / 1,58 / 2,11 / 2,55). Text-Hook „KI GRÜNDET EINE FIRMA“ + Pill „GANZ ALLEINE“ | langsamer Push-in auf die Wand | Was verkauft sie? | Pop, Ticks, Bump; Musik leise | M-001, M-002, M-003 |
| 3,18–4,33 | Ich probier das aus. | Pull-back: Gründer-Insel kommt ins Bild, Zähler „KASSE 0 €“ am Tisch rollt auf | Pull-back Wand → Wand + Insel | Klappt das echt? | leichter Whoosh, Counter-Roll kurz | M-005 |
| 4,33–5,30 | Tag 1. | „TAG 1“ stempelt (orange), Hook fährt raus | steht | – | Stamp-Clack | M-011 |
| 5,30–6,60 | Sie hat noch kein Produkt. | alle Karten drehen auf „?“, Zähler „PRODUKT: ?“ | kurzer Push-in | Welches denn? | Page-Turn, Bump | M-009 |
| 6,60–8,20 | Heute sucht sie es mit Claude. | Gründer läuft zum Laptop, Sticker „HEUTE: PRODUKT FINDEN“, echtes Claude-Logo auf dem Screen | Fahrt zum Laptop | Wie macht sie das? | Pop, Whoosh leicht, Chime | M-003 |
| 8,20–11,15 | Erstens: unten aufs Plus, Research an. | Schritt-Leiste 1·2·3 (1 aktiv). Claude-Paper mit **s1** (nur Eingabefeld + Plus-Menü). Zeiger auf „+“ (8,82), Klick (9,38), Zeiger auf „Research“ + oranger Rahmen (10,07), Haken (10,50) | Paper vorn, Welt unscharf; Shot-Zoom auf das Menü | Wo finde ich das? | Klick, Klick, Check | M-004, M-008 |
| 11,15–16,15 | Zweitens: Schreib deine Regeln dazu. Kein Lager, keine Maschine, nur kleine Betriebe als Kunden. | Schritt 2. **s2** (echte Prompt-Blase) tippt sich ab „Schreib“ ein; Markierung + Chip je Regel: „kein eigenes Lager“ (13,26), „keine eigene Maschine“ (13,94), „kleine Betriebe …“ (14,93) | Pan im Shot mit der Markierung | Was schreibe ich genau? | Page-Turn, Typing, drei verschiedene Pops | M-004, M-009 |
| 16,15–19,30 | Drittens: Frag, was diese Betriebe immer wieder kaufen. | Schritt 3. s2 scrollt auf „Recherchiere: Welche zehn Produkte …“ (17,08), Markierung „immer wieder“ (18,14), Senden-Klick (18,59) | Pan nach unten, Push-in | Und was kommt raus? | Pop, Tick, Chime, Klick | M-004 |
| 19,30–21,15 | Claude prüft über 300 Quellen. | **s3** „169 sources and counting…“, Zähler am Objekt rollt 0 → 169; bei „dreihundert“ Wechsel auf **s4** „Research complete • 314 sources • 5m 30s“, Zähler 314 (echter Wert), Rahmen | Push-in auf die Quellenzeile | So viele? | Counter-Roll, Ping | M-005 |
| 21,15–23,72 | Am besten passen Drucksachen und Arbeitskleidung mit Logo. | **s5** (Bericht-Kopf). Ergebnis-Satz markiert: „Drucksachen“ (21,89), dann „Arbeitskleidung mit Logo“ orange (22,56) | Zoom auf die zwei Zeilen | Welches nimmt sie? | Page-Turn, Pop-Low, Check; **Musik hoch** | M-004, M-011 |
| 23,72–25,72 | Ein Partner druckt sie schon ab einem Stück. | zurück in die Welt: blaue Partner-Insel leuchtet, Maschine läuft (24,27), genau ein Shirt fällt, Zähler „AB 1 STÜCK“ (25,09), Sticker „PARTNER DRUCKT“ | Fahrt zur Partner-Insel | Ohne Lager geht das? | Whoosh hoch/leicht, Click-Low, Jump | M-003, M-005 |
| 25,72–28,30 | Die KI nimmt die Kleidung: Firmenshirts. | zurück zur **Produkt-Wand** (Bogen zum Hook): Karten werden durchgestrichen (25,9–26,9), nur Shirt bleibt; kurze Musikstille; bei „Firmenshirts“ (27,23) Sticker „FIRMENSHIRTS“, Gründer hält Shirt hoch, Zähler „PRODUKT: FIRMENSHIRTS“, kleiner Weißblitz | Fahrt zur Wand, harter Push-in auf die Shirt-Karte | – (Auflösung) | Paper-Tear, Stamp, Power-up; **Stille 26,95–27,2, dann Akzent** | M-002 (Bogen), M-011 |
| 28,30–32,28 | Nur eins findet Claude nirgends: wie oft Betriebe nachbestellen. Das klärt sie morgen. | **s6** (letzter Satz der echten Antwort): „in keiner Statistik gefunden“ rot markiert (29,25), „Wie oft Kleinstbetriebe …“ (30,49); ab „Das klärt“ (31,36) zurück zur Insel, Hängeschild „TAG 2 · NACHBESTELLUNG?“ | Zoom auf die letzte Zeile, dann Pull-back | Und wie oft? → morgen | Pop, Bump, Tick, Whoosh hoch/leicht, Chime-Asc | M-009 |
| 32,28–36,30 | Kommentiere „Produkt“, und ich schick dir den Guide. | **End-Karte**: Keyword „Produkt“ tippt sich ein (32,90), Kommentar-Bubble + Haken (33,89), „Guide per DM“ (34,44), PDF fliegt in DM-Blase (34,90); Gründer winkt; Halt bis 36,3 | ruhiger Push-in, letzte Sekunde Halt | – | Pop, Typing, Check, Pop-High, Chime, Pop | M-007, M-011 |

Prüfung M-009: aus beats.json gerechnet, längste Strecke ohne neue Änderung **1,46 s** (34,90 → 36,30, End-Halt). Alle anderen Abstände < 1,5 s.

## Shots (echte claude.ai-Ausschnitte, schon zugeschnitten)
Ordner `broll/public/firma-neu-tag1/shots/`. Keine Sidebar, keine Chat-Liste und keine Chat-Titel sind sichtbar (s1 ist links neben den Vorschau-Kacheln abgeschnitten, s5 oberhalb des Mauszeigers).
- s1-plus-research.png ← 01 (x 0–470): Eingabefeld + Plus-Menü mit „Research“
- s2-prompt.png ← 07: Prompt-Blase komplett
- s3-research-laeuft.png ← 04: „169 sources and counting… · 53s“
- s4-research-complete.png ← 05 (y 225–440): „Research complete • 314 sources • 5m 30s“
- s5-ergebnis.png ← 06 (y 0–520): Titel + Ergebnis-Absatz („… Drucksachen … Arbeitskleidung mit Logo …“)
- s6-keine-statistik.png ← 05 (y 470–722): Antwort-Absatz bis „… in keiner Statistik gefunden.“
Markierungs-Rechtecke in Pixeln des Ausschnitts stehen in beats.json (`marken` exakt, `marken_ca` ungefähr, im Style-Frame nachziehen).

## Ton
- Musik: Serienbett `firma-neu-tag1/music.mp3` (= sk100d6 „Loser“-Instrumental). Leiser Einstieg (0,16), leicht hoch ab Schritt 1 (0,2), Akzent beim Ergebnis 21,2 (0,28), **Stille 26,95–27,2 vor „Firmenshirts“**, Akzent 0,3, CTA 0,22, Fade 35,6–36,3. Endmix −14 LUFS.
- SFX: 23 verschiedene Dateien (Pop-Familie in mehreren Varianten, Klicks, Check, Chime/Chime-Asc, Ping, Counter-Roll, Page-Turn, Paper-Tear, Stamp, Jump, Power-up, Typing). Whooshes nur „quick“ bei 0,2–0,25. Keine Boom-, Sub-Hit- oder schweren Whoosh-Dateien. Pfade in beats.json → `sfx_dateien`.

## Hinweise an firma-design
1. **Text-Hook:** SeriesHook2D zeigt noch die alte Eröffnung („KI BAUT EIN UNTERNEHMEN VON NULL“). Der neue stumme Hook laut hooks.md ist „KI GRÜNDET EINE FIRMA“ + „GANZ ALLEINE“ + „TAG 1“.
2. **Schritt-Labels:** „PLUS → RESEARCH“, „REGELN“, „FRAGE“ (statt WEBSUCHE / FRAGE 1 / FRAGE 2).
3. **Alte Platzhalter-Sticker** fallen weg: „SO PRÜFST DU JEDE IDEE“, „KI MACHT DEN REST“, „für Betriebe unter 10 Leuten“ (wird in dieser Folge nicht gesagt).
4. **Wand-Karten:** Die Wand ist Brainstorm, kein Ergebnis. Wenn möglich soll unter den durchgestrichenen Karten „DRUCKSACHEN“ stehen (echter Zweitplatz aus dem Lauf). Die Shirt-Karte heißt bis 27,2 s „?“ und erst dann „FIRMENSHIRTS“.
5. **Captions:** echte `words.json` statt SAMPLE_WORDS.

## Storyline-Check (Bibel v2)
- Kasse 0 € → 0 €, Produkt gefunden: Firmenshirts mit Logo, passt zur Geldregel.
- **Ticket an firma-autor (nicht still korrigiert):** Das Skript öffnet für morgen „wie oft Betriebe nachbestellen“, laut Bibel Abschnitt 6 und konzept.md ist Tag 2 aber „findet sie ihren Kunden (welche Branche zuerst)“. Entweder Tag 2 nimmt die Nachbestell-Frage in die Kunden-Suche auf, oder der Plan wird angepasst. Das muss der Chef entscheiden.
- Kleiner Hinweis: Laut Bibel kommt die Partner-Insel ab Tag 5. Das Skript nennt den Partner schon heute („ab einem Stück“), deshalb erscheint sie in B11 kurz als Ausblick. Beleg im Lauf: Printful druckt „ohne Mindestmenge“ (Tabellenzeile 2, LAUF.md).
