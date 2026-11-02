GESAMTNOTE: 7/10 (nicht bestanden: 4 Kriterien unter 8, kein K.-o.)

# Finale Prüfung: Folge „Ärger“ (firma-tag3), tag3-aerger-v5.mp4

Prüfer: frischer firma-pruefer, 2026-10-28. Ich habe die früheren Versionen nicht gesehen. Grundlage sind `bewertung.md` (final + Pius-Checkliste) und die Regeln des Koordinators.
Belege liegen in `pruefung/final-v5/`:
- `sheet-01..04.png`: Kontaktbogen mit 2 fps
- `hook-4fps.png`: 0–6 s mit 4 fps
- `hud-1fps.png`: HUD oben rechts, 1 fps
- `f-*.png`: Einzelbilder
- `vs-tag1v7.png`: Vergleich mit Tag 1 v7 bei 0,5 / 6 / 20 / 40 s
- `stt.json`, `stt-end.json`, `stt-tag2-end.json`: lokale Spracherkennung mit whisper.cpp medium
- `music-stem.wav`: Musik mit der Lautstärke-Kurve aus `mix.mjs`

Nicht ausgeführt: das Gemini-Review (`review-video.mjs`), weil der Auftrag keinen externen Dienst erlaubt. Das muss vor dem Einplanen nachgeholt werden oder bewusst entfallen.

## Technische Eckdaten
- 1080×1920, 30 fps, 45,50 s. Das liegt im Ziel von 40–48 s.
- Das Skript hat 120 Wörter. Das ist die Obergrenze, also noch ok.
- Lautheit: −14,0 LUFS integriert, True Peak −1,2 dBFS, LRA 1,8 LU. ✓
- Musik: `gone-original` ab 312 s, ein einziges `atrim` ohne Loop und ohne Sprung (`mix.mjs`, Zeile mit `[1:a]…atrim=0:45.5`). ✓
  - Die Musik liegt 16,0 LU unter der Stimme (Stimme −18,2, Musik −34,2 LUFS).
  - Lokal gemessen (Mittelwert in dB): 17,5–20,5 s: 17,8 dB Abstand. 25,5–27,5 s (Aufschwung nach der Entscheidung): 15,0 dB, genau an der Grenze. 39–45 s: 18,2 dB. ✓
- Kein Umsatz-Zähler, kein €-Betrag im Bild. ✓
- Keine claude.ai-Seitenleiste mit Chats. Das Claude-Fenster zeigt nur Kopf, Eingabe und Bericht-Karte. ✓

## Pflichtregeln des Koordinators

| Regel | Beleg | OK |
|---|---|---|
| Eröffnung wörtlich, kein „Tag N“ danach | words.json 0,00–5,00 s. STT „…führt? Ich probiere das aus.“ („probiere“ ist Whisper-typisch, words.json hat „probier“) | ✓ |
| HUD „TAG 1“, Hook-Text, Stempel „GANZ ALLEINE.“ | `badge-tl.png`, `hook-4fps.png` 0–1,25 s Hook-Text, ab 3,25 s Stempel | ✓ |
| „als Nächstes“ statt „morgen“ | Pill „ALS NÄCHSTES“ 37,5–39,4 s. Caption: „Das klärt die KI als Nächstes.“ Das Wort „morgen“ kommt nirgends vor | ✓ |
| Warum direkt nach der Entscheidung, 2–3 Gründe mit echten Zahlen, jede Karte ≥ 1,2 s | „Warum?“ 26,41 s. Karte 60 °C ist 27,5–32,4 s zu sehen (≈ 4,9 s), Karte 30 °C 29,4–32,4 s (≈ 3,0 s), `f-30.5.png` | ✓ (2 Gründe, das Minimum) |
| Echter Lauf: Prompt nennt „kleine Handwerks- und Baubetriebe“, Tag-2-Ergebnis hängt an | LAUF.md Prompt + Anhang „Shirt-Firma Ergebnis Kunde.md“ (Inhalt = Tag-2-Ergebnis, 335.272 Betriebe, Destatis) | ✓ |
| Prompt-Beat zeigt „Handwerk“ sichtbar | `f-13.0.png`: „kleine Handwerks- und Baubetriebe unter zehn Leuten“ orange markiert, Datei-Chip „Shirt-Firma Ergebnis Kunde.md“ | ✓ |
| Kein „HANDWERK ?“ am Ende der Kachel | sheet-01 5,5–8,0 s: ✓ bleibt stehen, dann Schnitt aufs Claude-Fenster | ✓ |
| Schritt 2 in Board/HUD erledigt | Board ✓ (1,75–5,25 s und 39,5 s+). **HUD zeigt „2“ gelb/offen von 0 bis ≈ 25,9 s** (`hud-1fps.png`), ebenso auf dem Cover | **✗ → Ticket 1** |
| Zahlen/Ränge 1:1 aus LAUF.md | Karten #1·14, #1·14, #3·je 12 (Größe · Lieferung), #5·10 (`f-17.8.png`), 301 Quellen, 6m 50s, 60/30 °C. Alles korrekt | ✓ |
| Halbsatz Privatkunden | „Rest: Privatkunden oder unklar.“ ist da, aber ungenau | ⚠ → Ticket 2 |
| Keine Emojis; 6 Replies mit Frage; Caption endet mit Fiktiv-Hinweis + nur Hashtags | replies.json: 1 + 5 Antworten, alle enden mit „?“. caption.txt ✓ | ✓ |

## Noten je Kriterium

| # | Kriterium | Note | Beleg / Begründung |
|---|---|---|---|
| 1 | Eröffnung, Frame 1, Serienrahmen | 8 | Frame 0 zeigt Hook-Frage + leeren Plan (`f-0.0.png`) = offene Frage. Wörtliche Eröffnung. Etwas leer ist es bei 1,5–3,0 s ohne Headline, aber dort füllt sich der Plan |
| 2 | Hook nicht statisch (0–6 s, 4 fps) | 8 | Bis 3,25 s gibt es alle 0,25–0,5 s ein Ereignis (Plan füllt sich, Zoom, Stempel). 3,5–5,25 s ist knapp: Plan und Stempel stehen still, neu sind nur die Wort-Pills, der Hebel (4,0 s), ein Board-Glühen (4,5 s) und das TAG-1-Badge (5,0 s). Gerade noch bestanden |
| 3 | Schritt-Kette (K.-o.-Prüfung) | 9 | Tag 2 endet mit „Offen bleibt: Was nervt diese Betriebe beim Bestellen?“, Tag 3 steigt genau dort ein. Der echte Lauf baut auf dem Tag-2-Ergebnis auf (Anhang + Prompt). Kein Sprung, keine Wiederholung. **Kein K.-o.** |
| 4 | Board/HUD-Konsistenz | **6** | Im selben Bild (z. B. 2,0–5,25 s, `hook-4fps.png`) zeigt der große Plan „2 ✓ KUNDE“, das HUD daneben „2“ gelb/offen. Bei 5,5 s kommt die Kachel „2 ✓ HANDWERK“, das HUD bleibt aber bis ≈ 25,9 s gelb und springt erst bei der Wasch-Entscheidung auf ✓. So wirkt es, als würde Schritt 2 erst in dieser Folge fertig. Das widerspricht der Regel „Schritt 2 erledigt“ und dem Board. Das Cover (`cover.png`) hat denselben Widerspruch |
| 5 | Fakten-Treue | **7** | Alle Zahlen und Ränge stimmen. Aber „Rest: Privatkunden oder unklar“ (34,43–36,41 s) und das Bild-Zitat „…Handwerksbetrieb … Der Rest stammt von Privatkunden oder lässt sich nicht zuordnen.“ (`f-33.8.png`) lassen den Satz dazwischen weg: „Etwa sechs Belege kommen von anderen gewerblichen Kunden…“ (LAUF.md, Chat-Antwort). Im Original bezieht sich „Der Rest“ auf die Belege nach 1 + 6. So montiert, stimmt der Satz nicht mehr ganz. Der Bericht deckt nur „**ganz überwiegend** von Privatkunden oder nicht zuzuordnen“. Caption und prompt-fuer-kommentare.md übernehmen den Fehler, der Guide (guidebook.json „Wer sich beschwert“) hat es richtig. Ich werte das als ungenau, nicht als falsch im Kern, deshalb kein K.-o. Es muss aber vor dem Posten korrigiert werden, weil es genau die Ehrlichkeitsstelle der Folge ist |
| 6 | Warum-Beat | 9 | Ruhig, mit 2 nummerierten Karten, groß, lange stehend, Zahlen aus dem Bericht. „Trotzdem“ (Platz 5 zuerst) macht neugierig und wird sofort erklärt |
| 7 | Klarheit für neue Zuschauer | **7** | Was die Firma verkauft (Logo-Shirts), wird nie gesagt. „Ihr Kunde steht: kleine Handwerksbetriebe. Was nervt die beim Bestellen?“ Was wird bestellt? Im Bild steht bei 5,5–9,3 s nur ein leerer Karton. Das Wort „Firmenshirts“ taucht erst bei ≈ 12,5 s klein im Prompt auf, „Logo-Shirts“ erst bei 32,5 s. Ab 16 s erschließt es sich über die Shirt-Icons, aber in den ersten 10 s fehlt das Produkt |
| 8 | Kein Lesetext, höchstens ein neues Label gleichzeitig | 8 | Der Prompt (12–15,5 s, ~10 Zeilen) wird getippt und im Takt der Stimme markiert. Das Zitat (32,5–36,5 s, 5 Zeilen) wird Wort für Wort markiert. Auf der Endkarte 41,9–42,5 s kommen 3 Schritt-Karten in 0,6 s, das ist dicht, aber gestaffelt. Grenzwertig, ok |
| 9 | Kamera ruhig, Plan/Claude-Fenster ganz im Bild | 9 | Keine Ruckler. Fenster und Plan sind immer ganz zu sehen (sheets 1–4). Auf der Endkarte verdecken die Schritte das Board absichtlich |
| 10 | Zweite Hälfte ohne Ton verständlich | 9 | Entscheidung: Karten werden grau, „→ ZUERST KLÄREN“, Konfetti. Dann „WARUM ERST WASCHEN?“ mit 2 Karten, danach Zitat mit markierten Kernwörtern, „NOCH OFFEN“ und die CTA-Karte. Jeder Akt ist ohne Ton klar |
| 11 | Ton: Musik, SFX, Aussprache | **7** | LUFS, Abstand und Musikstück sind ✓. Die SFX sind abwechslungsreich und liegen auf den Wörtern (`mix.mjs`). **Aussprache-Verdacht:** whisper.cpp hört bei „Kommentiere“ zweimal unabhängig „**Kommentare**, Ärger?“ (`stt.json`, `stt-end.json`). Dieselbe Engine hört bei Tag 2 sauber „Kommentiere“ (`stt-tag2-end.json`). Das Trigger-Satzglied klingt also wahrscheinlich anders als bei Tag 2. Plausibel, das muss noch jemand anhören. Dazu kommt „Claude“ → „Clot“ (16,0 s), bei Whisper üblich, mit niedrigem Risiko |
| 12 | Untertitel synchron | 9 | Die Pills liegen auf den words.json-Zeiten (Stichproben 18,5 / 20,5 / 33,5 / 42,5 s), Abweichung kleiner als die Frame-Auflösung. Inhalt = Ton |
| 13 | CTA mit konkretem Wert | 8 | „…damit du in zehn Minuten weißt, was deine Kunden nervt“. Bild: „→ was deine Kunden nervt · mit Quelle · in 10 Min“ + 3 Schritte. Das „du“ in der CTA folgt dem Serienstandard (Tag 2 genauso), keine Ansprache der Lebenslage des Zuschauers. Der echte Lauf dauerte 6m 50s, „zehn Minuten“ ist also gedeckt |
| 14 | Caption, Replies, Guide, Kommentar-Prompt | 8 | Menüpfad, Pläne, Fiktiv-Hinweis und Hashtags stimmen, keine Emojis, alle 6 Replies enden mit einer Frage. Abzug: Der „Rest“-Satz (siehe 5). Außerdem stehen im Guide Details, die LAUF.md nicht belegt: „Nur Bots, Textbausteine oder gar keine Antwort“ (Service) und „Größen weichen von der Tabelle ab“. Bitte im vollen Bericht des Chats 912070ab nachsehen oder streichen. Kein Ticket, aber Pflicht-Check |
| 15 | Look vs. Tag 1 v7 | 9 | `vs-tag1v7.png`: dieselbe Welt, dasselbe Licht. Die Ärger-Wand ist voller und klarer als die Ideen-Wand von Tag 1. Nicht schwächer |
| 16 | Cover | 7 | Starke Hook-Frage, Stempel, Plan mit ✓1 ✓2, „Was nervt die Kunden?“. HUD-Widerspruch wie bei 4 (→ Ticket 1) |
| 17 | Gemini-Review | – | Nicht gelaufen (kein externer Dienst erlaubt) |

## Scroller-Test
- **1 s:** Ja. Die große Frage „Wie viel Umsatz macht eine KI in 100 Tagen?“ und ein leerer Plan mit Fragezeichen.
- **3 s:** Ja. Der Plan füllt sich und es kommt „GANZ ALLEINE.“
- **10 s:** Eher ja. „Was nervt die beim Bestellen?“ ist eine Frage. Wer aber nicht weiß, dass es um Logo-Shirts geht, hat wenig Bild dazu (Ticket 3). Ab dem Claude-Fenster (8,5 s) steigt der Zug wieder.

## K.-o.-Status
**Kein K.-o.**
- Schritt-Kette ok.
- Zahlen 1:1.
- Echter Lauf mit Handwerk-Prompt und Anhang.
- Keine erfundenen Zahlen.
- Keine private Seitenleiste.

Die Ungenauigkeit bei „Rest“ werte ich als Ticket, nicht als falschen Fakt. Wer es strenger auslegt, nennt es einen falschen Fakt, dann wäre es K.-o.

## Tickets

```
TICKET final-v5-1 → firma-design
Kriterium: Board/HUD-Konsistenz · Note: 6/10
Beleg: Video 0:00–0:25.9 (hud-1fps.png, hook-4fps.png 2,0–5,25 s), cover.png
Problem: Das HUD zeigt Schritt 2 gelb/offen, während Board und Kachel „2 ✓“ zeigen. Bei 25,9 s springt das HUD auf ✓, so wirkt die Wasch-Entscheidung wie der Abschluss von „Kunde“.
Soll: Das HUD zeigt ab Frame 0 bis zum Ende „1 ✓ 2 ✓“, ohne Zustandswechsel bei 25,9 s. Wenn ein aktiver Schritt markiert werden soll, dann höchstens die 3 (wie bei Tag 1: nächster Schritt aktiv), nie die 2. Cover neu exportieren mit demselben HUD. Nur Neu-Render, Ton bleibt gleich.
```

```
TICKET final-v5-2 → firma-autor (Text), danach firma-regie (1 Wort TTS) und firma-design (Zitat)
Kriterium: Fakten-Treue · Note: 7/10
Beleg: Video 0:34.4–0:36.4 („Rest: Privatkunden oder unklar“), Bild-Zitat 0:32.5–0:36.5 (f-33.8.png); caption.txt Absatz „Ergebnis im echten Lauf“; prompt-fuer-kommentare.md letzter Satz; LAUF.md Chat-Antwort („Etwa sechs Belege kommen von anderen gewerblichen Kunden…“)
Problem: Die Auslassung „…“ fällt genau auf den Satz mit ~6 anderen gewerblichen Belegen. Dadurch behauptet „Der Rest“ mehr, als der Bericht sagt.
Soll:
(a) Gesprochen „Rest: Privatkunden oder unklar.“ → „Meist: Privatkunden oder unklar.“ (Wortzahl bleibt 120). Das Wort mit create_speech testen, nur diesen Satz neu einsetzen, words.json und Pills nachziehen.
(b) Bild-Zitat in zwei echte, ungekürzte Zitate teilen:
    „Nur eine Beschwerde stammt ausdrücklich von einem Handwerksbetrieb.“
    „Die Belege stammen aber ganz überwiegend von Privatkunden oder von Kunden, die nicht zuzuordnen sind.“
    Markierung auf „Nur eine Beschwerde“ / „Privatkunden“.
(c) Caption und Kommentar-Prompt: „…der Rest von Privatkunden oder…“ → „…etwa sechs von anderen gewerblichen Kunden, die meisten von Privatkunden oder nicht zuzuordnen.“
```

```
TICKET final-v5-3 → firma-design (nur Bild; firma-autor nur falls Sprechtext gewünscht)
Kriterium: Klarheit für neue Zuschauer · Note: 7/10
Beleg: Video 0:05.5–0:09.3 (f-7.0.png, sheet-01 5,5–8,0 s): leerer Karton, kein Produkt; „Firmenshirts“ erst bei ≈ 12,5 s klein im Prompt
Problem: Ein neuer Zuschauer erfährt in den ersten 12 s nicht, was bestellt wird.
Soll: Ab „Ihr Kunde steht“ (5,53 s) liegt ein Logo-Shirt sichtbar im/auf dem Karton, oder der Karton trägt ein Label „LOGO-SHIRTS“ (≥ 3 % Bildhöhe), bis „Bestellen?“ (9,30 s). Optional im Sprechtext: „Was nervt die beim Shirt-Bestellen?“ (Wortzahl gleich), dann mit TTS-Betonungstest.
```

```
TICKET final-v5-4 → firma-regie
Kriterium: Ton / Aussprache · Note: 7/10 (Verdacht, muss angehört werden)
Beleg: Video 0:39.45–0:41.15; stt.json und stt-end.json hören „Kommentare, Ärger?“, Tag 2 mit derselben Engine „Kommentiere“ (stt-tag2-end.json)
Problem: Das Trigger-Verb klingt wahrscheinlich wie „Kommentare“, und „Ärger“ mit Frage-Melodie. Das schwächt die CTA.
Soll: Pius oder ein Mensch hört 39,4–41,2 s an. Klingt es nicht eindeutig nach „Kommentiere ‚Ärger‘“, nur diesen Satzteil neu sprechen (create_speech, Betonungstest), Mix neu, −14 LUFS halten.
```

Kein Ticket, aber Pflicht vor dem Einplanen:
- Gemini-Review nachholen, ohne `fix_first`-Punkte.
- Guide-Details „Nur Bots, Textbausteine…“ und „Größen weichen von der Tabelle ab“ gegen den vollen Bericht prüfen.
- Der Musik-Aufschwung bei 25,5–27,5 s liegt mit 15,0 dB genau an der Grenze. Keine Erhöhung mehr.

## Entscheidung
**Nicht einplanen.**
- Tickets 1 und 3 sind reine Bild-Neu-Render.
- Ticket 2 braucht 1 Wort TTS, eine neue Zitat-Karte und eine Text-Korrektur.
- Ticket 4 ist ein Anhör-Check.

Nach der Korrektur prüft ein frischer Prüfer dieselbe Stufe neu. Die Zeit bis 21:00 reicht realistisch, wenn Ticket 4 sich als Fehlalarm erweist.
