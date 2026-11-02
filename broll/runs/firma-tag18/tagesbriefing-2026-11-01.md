# Tagesbriefing Serientag 5 · 2026-11-01 (Chef, erstellt 2026-10-31 abends auf Pius' Ansage „mach für morgen so viele wie möglich")

Gilt zusätzlich zu runs/firma-tag9/tagesbriefing-2026-10-30.md (alle Regeln K.-o.) und den Skills firma-*.

## Slots und Folgen
| Slot | Folge | Besonderheit |
|---|---|---|
| 09:00 | 18 | ERSTE Folge des Tages: Eröffnung „… Ich probier das aus. Tag fünf.“ + Einblender „TAG 5“ (wie Folge 13), Autor kürzt dafür 2 Wörter |
| 12:00 | 19 | kein „Tag“, kein „gestern“ |
| 15:00 | 20 | dto. |
| 18:00 | 21 | dto. |
| 21:00 | 22 | dto. |
Kette: jede Folge beantwortet das „Als Nächstes“ der Vorgängerin mit einem echten claude.ai-Lauf. Folge 17 endet mit „Als Nächstes: Was zahlt sie für das gestickte Shirt?“

## Stand
Kasse 0 €, kein Umsatz, kein Zähler. Abschicken/Porto/Anruf/Bestellen sind Menschen-Schritte mit Geld → nicht erzählen, nie vortäuschen. Braucht ein Schritt Pius (Login Printful, Geld, Gewerbe), Folge umplanen und im Bericht nennen.

## Textregeln (seit 2026-10-30)
85–100 Wörter, Sätze ≤ 12 Wörter, TTS 1,0, 120–135 wpm, 40–48 s, Rückblick ≤ 6,5 s, „Heute“ ≤ 14,5 s, ein neuer Textblock gleichzeitig, Karten ≤ 4 Wörter.

## Lehren 2026-10-31 (Pflicht für alle Stufen)
- Autor: beim reinen Zuhören eindeutig (Rückblick mit Bezug, Quelle hörbar, nichts aus dem Gedächtnis ergänzen).
- Regie: Musik für den ganzen Tag am Anfang vergeben (Serientag 5 = neues Stück-Fenster; fünf nicht überlappende Abschnitte, Liste in diese Datei unter „Musik“ eintragen). Eröffnung aus Folge 12 für STT-Stabilität; Folge 18 braucht neue Eröffnung mit „Tag fünf.“ (Folge 13 hat das schon gelöst, regie/ dort ansehen).
- Design (K.-o. dreimal am 31.10.): Maskottchen in jedem Frame ≤ 1/3 verdeckt, Augen frei, keine Untertitel auf den Augen (Engine-Option captionY, bot, big/resultY, pill:"" – episode-schema.md „Zusatzfelder (Folge 16)“); aussagende Texte ≥ 58 px (Ziel ≥ 64 px); Panel-Wechsel und Kamera-Schnitt auf demselben Frame; CTA-Board zeigt Stand nach der Folge; nur eigenen tag<N>-Ordner schreiben, Fixes in gen.py/ep.py. Vorlage: runs/firma-tag17/design/gen/.
- Prüfer: Gemini 402 → manuell.

## Musik
Vergeben von Regie Folge 18 (2026-10-31), GONE_GONE_THANK_YOU_KLICKAUD.mp3 (375,46 s). Fünf nicht überlappende Fenster je ≥ 46 s; jede Folge sucht ihren Startpunkt NUR innerhalb ihres Fensters (Stem ≤ Fensterende), immer `music-explicit-check` 2×. Tabu 200–276 (N-Wort, „shit“ 272,0).
| Folge | Fenster (Track-s) | Länge | Hinweis |
|---|---|---|---|
| 18 (09:00) | **50,85–96,85** (vergeben, Start 50,85) | 46,0 | Mulde vor „Warum?“, 0 explizit |
| 19 (12:00) | 276,0–323,0 | 47,0 | Einstieg leise, kein explizites Wort bekannt |
| 20 (15:00) | 152,0–199,95 | 47,95 | Ende ≤ 199,95 (Tabu ab 200) |
| 21 (18:00) | 325,0–375,46 | 50,46 | bis Track-Ende |
| 22 (21:00) | 99,0–150,0 | 51,0 | „some shit“ Track 106,92–107,28 → musicMute |
| Reserve | 0,0–48,0 | 48,0 | „Shit“ Track 20,16–20,34 → musicMute |
Kein Fenster grenzt an das der direkten Vorfolge (18↔19 > 170 s, 19↔20 > 75 s, 20↔21 > 125 s, 21↔22 > 175 s).
