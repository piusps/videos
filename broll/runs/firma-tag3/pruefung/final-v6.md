GESAMTNOTE: 7/10 (nicht bestanden: K.-o. durch gesprochenes „gestriges Ergebnis“, sonst alle Kriterien ≥ 8)

# Finale Prüfung: Folge „Ärger“ (firma-tag3), tag3-aerger-v6.mp4

Prüfer: frischer firma-pruefer, 2026-10-28, Slot 21:00. Grundlage: `bewertung.md` (final + Pius-Checkliste) und die Regeln des Koordinators. Ich habe v6 komplett neu geprüft und den v5-Bericht nur genutzt, um die vier Tickets zu verifizieren.

Belege liegen in `pruefung/final-v6/`:
- `sheet-01..04.png`: Kontaktbogen mit 2 fps. Die Zeiten sind relativ zum Bogen, Bogen N beginnt bei (N−1)·12 s.
- `hook-4fps.png`: 0–6 s mit 4 fps
- `hud-1fps.png`, `badge-tl-1fps.png`: HUD und Badge, 1 fps über die ganze Länge
- `pair-14-20.png`, `f-*.png`: Einzelbilder
- `vs-tag1v7.png`: Vergleich mit Tag 1 v7 (oben) bei Frame 15 / 180 / 600 / 1200
- `stt.json`: whisper.cpp medium auf der finalen Tonspur
- `stt-music.json`: Musikbett allein
- `voice-stem.wav`, `music-stem.wav`, `*-S.txt`: Pegel-Analyse
- `aerger-guide.pdf.png`: Guide Seite 1

Nicht ausgeführt: das Gemini-Review (`review-video.mjs`), weil der Auftrag keinen externen Dienst erlaubt.

## Technik
- 1080×1920, 30 fps, 45,50 s. Das liegt im Ziel von 40–48 s.
- 120 Wörter, das ist die Obergrenze.
- Lautheit: −14,0 LUFS integriert, True Peak −1,2 dBFS, LRA 1,9 LU. ✓
- Musik: `public/firma-tag3/music.mp3` habe ich in 2-s-Fenstern alle 3 s gegen `gone-original.mp3` ab 312 s korreliert: r = 0,99–1,00, Versatz 0. Das ist ein Stück am Stück, ohne Loop und ohne Sprung. ✓
- Stimme gegen Musik:
  - Integriert: Stimme −18,0, Musik −34,3 LUFS, Abstand 16,3 LU. ✓
  - Kurzzeit-Lautheit (3 s): Der Abstand sinkt stellenweise auf 13,5–14,1 dB, und zwar bei ≈ 16–18 s (Musik-Anhebung 17,8 s), 32–34 s und 39–41 s.
  - Ich werte nach dem integrierten Wert wie in den Vorprüfungen. Hinweis siehe unten.
  - Im Musikbett erkennt whisper keine Gesangswörter.
- STT = Skript, Wort für Wort, inklusive „301“, „60 Grad“, „30“. „**Kommentiere. Ärger.**“ wird jetzt sauber erkannt (39,48 s). ✓
- Keine claude.ai-Seitenleiste. Das Claude-Fenster zeigt nur Kopf, Eingabe und Bericht-Karte. ✓
- Kein Umsatz-Zähler, kein €-Betrag. ✓

## Verifikation der v5-Tickets
| Ticket | Status | Beleg |
|---|---|---|
| 1 HUD vs. Board | **behoben** | `hud-1fps.png`: Das HUD zeigt in allen 46 Sekunden-Bildern „✓ ✓ 3“, ohne Wechsel. Cover ebenso ✓ ✓. Board und Kachel „2 ✓ KUNDE HANDWERK“ passen dazu |
| 2 „Rest“ + montiertes Zitat | **behoben** | Gesprochen „Meist: Privatkunden oder unklar“ (34,32 s). Das Bild-Zitat besteht jetzt aus zwei wörtlichen, ungekürzten Sätzen: „Nur eine Beschwerde stammt ausdrücklich von einem Handwerksbetrieb.“ (Chat-Antwort) und „Die Belege stammen aber ganz überwiegend von Privatkunden oder von Kunden, die nicht zuzuordnen sind.“ (Bericht), siehe sheet-03 ab 8,0 s. Caption und Kommentar-Prompt sind korrigiert |
| 3 Produkt in den ersten 12 s | **behoben** | Label „LOGO-SHIRTS“ ab 5,5 s am Karton (`hook-4fps.png`, `f-7.0.png`), gesprochen „Shirt-Bestellen“ (8,38 s) |
| 4 Aussprache „Kommentiere“ | **behoben** (laut STT) | whisper hört „Kommentiere. Ärger.“, nicht mehr „Kommentare“ |

## Pflichtregeln des Koordinators
| Regel | Beleg | OK |
|---|---|---|
| Eröffnung wörtlich, kein „Tag N“ danach | words.json 0,00–4,79 s, STT gleich | ✓ |
| HUD „TAG 1“, Hook-Text, Stempel | `badge-tl-1fps.png` (ab 5 s „TAG 1“), Hook-Text 0–1,25 s, „GANZ ALLEINE.“ ab 3,25 s | ✓ |
| „als Nächstes“ statt „morgen“ | Pill „ALS NÄCHSTES“ ≈ 37,5–39,4 s. „morgen“ kommt in keiner Datei vor | ✓ |
| **Keine Tages-Sprache, die der Serien-Zählung widerspricht** (Sinn der Regeln „TAG 1“ / „als Nächstes“) | **Gesprochen „gestriges Ergebnis dran“ (10,81 s), dazu das Pill-Wort „gestriges“. Im Bild steht der Prompt „Im Anhang ist mein Ergebnis von gestern“ (12,0–15,5 s, `pair-14-20.png`)** | **✗ → K.-o., Ticket 1** |
| Warum sofort, 2–3 Gründe mit echten Zahlen, Karten ≥ 1,2 s | „Warum?“ 26,52 s. Karte 1 „60 °C · Wäsche auf dem Bau“ ≈ 27,3–35,5 s, Karte 2 „30 °C · vertragen gängige Drucke für kleine Mengen“ ≈ 29,5–35,5 s | ✓ (2 Gründe, Minimum) |
| Echter Lauf: Prompt „kleine Handwerks- und Baubetriebe“ + Tag-2-Anhang | LAUF.md Prompt wörtlich, Anhang „Shirt-Firma Ergebnis Kunde.md“ | ✓ |
| Prompt-Beat zeigt „Handwerk“ | `pair-14-20.png` links: „kleine Handwerks- und Baubetriebe unter zehn Leuten“ orange markiert, Datei-Chip sichtbar | ✓ |
| Kein „HANDWERK ?“ am Kachel-Ende | Die Kachel steht ab 5,5 s mit ✓ bis zum Schnitt bei 8,0 s | ✓ |
| Schritt 2 im Board/HUD erledigt | siehe Ticket-Verifikation 1 | ✓ |
| Zahlen/Ränge 1:1 aus LAUF.md | Karten „#1 · 14“ Logo falsch, „#1 · 14“ Service, „#3 · je 12“ Größe · Lieferung, „#5 · 10“ Druck löst sich. 301 Quellen, 6m 50s, 60 °C / 30 °C, „Nur 1 Beleg aus dem Handwerk“ (= Chat-Antwort). Caption, Kommentar-Prompt und Guide gleich | ✓ |
| Halbsatz Privatkunden | „Meist: Privatkunden oder unklar.“ + Zitat | ✓ |
| Keine Emojis, 6 Replies mit Frage, Caption-Ende | Zeichen-Scan aller Texte: keine Emojis. replies.json: 1 + 5, alle enden mit „?“. Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags | ✓ |
| Musik am Stück, leise, −14 LUFS | siehe Technik | ✓ |
| Keine Seitenleiste mit privaten Chats | sheets 1–3 | ✓ |

## Noten je Kriterium
| # | Kriterium | Note | Beleg / Begründung |
|---|---|---|---|
| 1 | Eröffnung, Frame 1, Serienrahmen | 8 | Frame 0 zeigt die Hook-Frage und einen leeren Plan mit „?“. Die Eröffnung ist wörtlich |
| 2 | Hook nicht statisch (0–6 s, 4 fps) | 8 | Bis 3,25 s gibt es alle ≤ 0,5 s ein Ereignis. 3,5–5,0 s ist knapp: Stempel und Plan stehen, neu sind nur Wort-Pills, das Board-Glühen bei 4,75 s und das Badge bei 5,0 s. Gleich wie v5, gerade bestanden |
| 3 | Schritt-Kette (K.-o.-Prüfung) | 9 | Tag 2 endet mit „Was nervt diese Betriebe beim Bestellen?“, Tag 3 macht genau das. Der Lauf baut auf dem Tag-2-Anhang auf. Kein Sprung, keine Wiederholung |
| 4 | Board/HUD-Konsistenz | 9 | Durchgehend ✓ ✓, auch auf dem Cover |
| 5 | **Fakten- und Serien-Treue** | **5** | Alle Zahlen stimmen. Aber **„gestriges Ergebnis“ ist falsch**: Die Folge „Kunde“ läuft um 18:00 am selben Kalendertag. Laut Briefing sind „18:00 und 21:00 beide noch Serientag 1“, das HUD zeigt „TAG 1“, und die nächste Folge kommt „am selben Abend“. Auch der echte Tag-2-Lauf war am 2026-10-28. Wer um 18:00 geschaut hat, hört drei Stunden später „gestern“ und sieht „TAG 1“. Das ist neu in v6, v5 hatte „Plus, Research an.“ ohne „gestern“. Das Bild-Prompt „von gestern“ war schon in v5 (wörtlicher Prompt aus dem Lauf). Gesprochen und als Pill wiederholt wird es erst in v6 zur Aussage der Folge |
| 6 | Warum-Beat | 9 | Ruhig, Überschrift „WARUM ERST WASCHEN?“, 2 nummerierte Karten, groß und lange stehend, Zahlen aus dem Bericht. „trotzdem“ (Platz 5 zuerst) erzeugt Spannung und wird sofort erklärt |
| 7 | Klarheit für neue Zuschauer | 8 | Ab 5,5 s „LOGO-SHIRTS“ und „Shirt-Bestellen“. Klein: „vertragen dreißig“ ohne „Grad“ ist gesprochen elliptisch, die Karte zeigt aber „30 °C“ |
| 8 | Kein Lesetext, höchstens ein neues Label gleichzeitig | 8 | Der Prompt (12–15,5 s) wird getippt und im Takt markiert. Das Zitat (32–36,5 s) hat 6 Zeilen, wird aber Wort für Wort markiert. Die drei Schritt-Karten der Endkarte kommen gestaffelt. Grenzwertig, ok |
| 9 | Kamera ruhig, Plan/Claude-Fenster ganz im Bild | 9 | Keine Ruckler. Fenster und Board sind immer ganz zu sehen |
| 10 | Kein Beat > 1,5 s ohne Änderung / zweite Hälfte ohne Ton | 8 | Die Ärger-Wand steht 16–23,5 s. Änderungen kommen über Rahmen-Highlights pro Karte, Gesichts-Wechsel und Pills, das ist sparsam. Die zweite Hälfte versteht man ohne Ton: graue Karten, „→ ZUERST KLÄREN“, Konfetti, Warum-Karten, markiertes Zitat, „NOCH OFFEN“, Kommentar-Karte |
| 11 | Ton: Musik, SFX, Aussprache | 8 | LUFS, Musikstück und Aussprache sind ✓. Die SFX sind abwechslungsreich und auf Wort-Anker gelegt (`mix.mjs`). Abzug: Kurzzeit-Abstand der Musik stellenweise 13,5–14 dB (siehe Hinweis) |
| 12 | Untertitel synchron | 9 | Stichproben 20,22 s „14“, 28,39 s „60“, 34,78 s „Privatkunden“, 40,08 s „Ärger“: Die Pill erscheint im selben Frame wie das Wort |
| 13 | CTA mit konkretem Wert | 8 | „…damit du in zehn Minuten weißt, was deine Kunden nervt“. Bild: „→ was deine Kunden nervt · mit Quelle · in 10 Min“ + 3 Schritte. Der Lauf dauerte 6m 50s, die zehn Minuten sind also gedeckt. Das „du“ ist Serienstandard |
| 14 | Caption, Replies, Guide, Kommentar-Prompt | 8 | Menüpfad, Pläne, Zahlen, Fiktiv-Hinweis sind korrekt. Die Guide-Details (Bots/Textbausteine, Größentabelle) sind jetzt in LAUF.md belegt. Hinweise: Die Kopier-Vorlage in Guide und Kommentar-Prompt beginnt mit „Im Anhang ist mein Ergebnis von gestern“, für Nutzer besser „mein bisheriges Ergebnis“. Der Guide-Satz „In der mobilen App nutzt Research nur das Web“ ist in LAUF.md nicht belegt, also gegen den verlinkten Support-Artikel prüfen |
| 15 | Look vs. Tag 1 v7 | 9 | `vs-tag1v7.png`: dieselbe Welt, dasselbe Licht. Die Ärger-Wand mit Rang-Badges ist klarer als die Ideen-Wand. Nicht schwächer |
| 16 | Cover | 9 | Hook-Frage, Stempel, Plan ✓1 ✓2, HUD ✓ ✓, „TAG 1“, „Was nervt die Kunden?“ |
| 17 | Gemini-Review | – | Nicht gelaufen (kein externer Dienst erlaubt) |

## Scroller-Test
- **1 s:** Ja. Die große Umsatz-Frage und ein leerer Plan mit Fragezeichen.
- **3 s:** Ja. Der Plan füllt sich, dann kommt „GANZ ALLEINE.“
- **10 s:** Ja. „LOGO-SHIRTS“ + „Was nervt die beim Shirt-Bestellen?“ ist eine klare Frage, und das Claude-Fenster öffnet sich mit Klickpfad. Ein Stammzuschauer der 18:00-Folge stolpert aber bei 10,8 s über „gestriges“, obwohl das Badge „TAG 1“ zeigt.

## K.-o.-Status
**K.-o.: „Fakt im Video falsch“.** Der gesprochene Satz „gestriges Ergebnis dran“ (10,81–11,9 s, als Pill wiederholt) widerspricht der Serien-Zählung: Die Folge „Kunde“ lief am selben Tag, beide sind „TAG 1“. Der Fehler ist neu in v6.

Wer das milder liest (Erzählzeit statt Fakt), kommt trotzdem auf Note 5 bei Kriterium 5 und darf nicht einplanen.

Alle anderen K.-o.-Punkte sind bestanden:
- Schritt-Kette
- Zahlen 1:1
- echter Lauf
- keine erfundenen Zahlen
- keine Seitenleiste
- kein ChatGPT
- keine direkte Lebenslagen-Ansprache

## Tickets

```
TICKET final-v6-1 → firma-autor (Wort), dann firma-regie (TTS-Satz) und firma-design (Pill + Prompt-Fenster)
Kriterium: Fakten- und Serien-Treue · Note: 5/10 (K.-o.)
Beleg: Video 0:10.81–0:11.9 gesprochen + Pill „gestriges Ergebnis dran“ (sheet-01 11,0–11,5 s); Bild-Prompt „Im Anhang ist mein Ergebnis von gestern“ 0:12.0–0:15.5 (pair-14-20.png); briefing.md „18:00 und 21:00 sind beide noch Serientag 1“
Problem: Die Folge sagt „gestern“, obwohl die Vorfolge drei Stunden vorher am selben Serientag „TAG 1“ lief.
Soll:
(a) Gesprochen „Plus, Research an, gestriges Ergebnis dran.“ → „Plus, Research an, letztes Ergebnis dran.“ (oder „Kunden-Ergebnis dran“). Die Wortzahl bleibt 120. Nur diesen Satz per create_speech neu, mit Betonungstest. words.json, Pills und Wort-Anker in mix.mjs nachziehen (T.anh = neues Wort), neu mischen auf −14 LUFS.
(b) Im Prompt-Fenster das Wort „gestern“ nicht zeigen. Das Tippen beginnt bei „Ich verkaufe Firmenshirts mit Logo an …“, der Datei-Chip bleibt. Das ist eine Kürzung am Satzanfang, keine Änderung am Wortlaut, und nichts wird erfunden.
    Alternative: Den Prompt im echten Lauf nicht nachstellen, sondern ehrlich lassen und nur (a) umsetzen. Dann darf nichts gesprochen oder markiert auf „gestern“ zeigen. Bevorzugt ist (b).
(c) Guide-Kopiervorlage und prompt-fuer-kommentare.md: „mein Ergebnis von gestern“ → „mein bisheriges Ergebnis“ (Nutzer-Vorlage, nicht der Lauf-Beleg).
Prüfbar: STT ohne „gestrig/gestern“, kein „gestern“ im Bild 0–46 s, Badge „TAG 1“ unverändert.
```

Kein Ticket, aber Pflicht vor dem Einplanen:
- Gemini-Review nachholen (ohne `fix_first`) oder bewusst weglassen und das im Bericht an Pius sagen.
- Guide-Satz „In der mobilen App nutzt Research nur das Web“ gegen support.claude.com/en/articles/11088861 prüfen oder streichen.
- Musik nicht weiter anheben. Kurzzeit-Abstand bei 16–18 s, 32–34 s und 39–41 s ist nur 13,5–14 dB. Wenn ohnehin neu gemischt wird (Ticket 1): den Keyframe `[17.8, 0.2]` auf 0.17 senken und `[T.komm, 0.14]` auf 0.12. Dann liegt die CTA sicher ≥ 15 dB.

## Entscheidung
**Nicht einplanen.**

v6 hat alle vier v5-Tickets sauber gelöst und ist sonst auf 8–9er-Niveau. Neu ist ein einziger Fehler: das gesprochene „gestriges“. Die Korrektur braucht:
- 1 Wort im Text,
- 1 Satz TTS,
- neue Pill und gekürzten Prompt-Anfang,
- neuen Mix.

Danach prüft ein frischer Prüfer erneut. Nach der Korrektur erwarte ich 8/10.
