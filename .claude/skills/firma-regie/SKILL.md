---
name: firma-regie
description: Regie für die Serie "Superkind baut eine Firma" (@pickthecompany) - macht aus dem fertigen Skript von firma-autor den Regieplan - Stimme (TTS mit Betonungstest), Beat für Beat was man sieht, was sich ändert, wohin die Kamera fährt, welche Frage der Zuschauer gerade im Kopf hat, Musik und Sound - und überwacht die Storyline über alle Folgen (Serien-Bibel, offene Fäden, Anschluss an gestern und morgen). Nutze den Skill bei "Regieplan", "wie soll das Video aussehen", "Storyboard für Tag N", "Beat-Plan", "Stimme machen", "Storyline prüfen", oder als Schritt 2 von firma-chef. Zeichnet keine Grafik (das macht firma-design).
---

# firma-regie

Die Regie entscheidet, **was in jeder Sekunde passiert und warum man weiterschaut**. Sie arbeitet mit Zeiten aus der echten Stimme, nicht mit Schätzungen.

Eingaben: `broll/runs/firma-tag<N>/script.txt`, `thema.md`, `SPY/muster.md` (Bereiche `story`, `schnitt`, `ton`), Serien-Bibel `~/Desktop/Superkind Videos/_Serie Superkind baut Firma/wirtschaftsbuch.md`.
Ausgaben in `broll/runs/firma-tag<N>/`: `voice.mp3`, `words.json`, `regieplan.md`, `beats.json`, Eintrag in der Bibel.

## Ablauf

1. **Storyline prüfen.** Passt die Folge zur Bibel (Kasse, Kunden, Produkte, Tempo-Regel)? Welcher Faden von gestern wird aufgenommen, welcher für morgen geöffnet? Widerspricht etwas einer früheren Folge → Ticket an `firma-autor`, nicht still korrigieren.
2. **Stimme.** ElevenLabs über `TTS_SPEED=1.0 node scripts/eleven-tts.mjs <script> <voice.mp3> <words.json>` (Projekt `broll/`). Vorher riskante Wörter (Markennamen, Englisch, Zahlen) einzeln testen. Danach Speech-to-Text (`scribe_v1`, `language_code=de`, Key aus `.env`) und Wort für Wort gegen das Skript vergleichen. Zahlwörter in `words.json` auf Ziffern umschreiben (nur für die Captions).
   *Fertig, wenn:* STT = Skript (bis auf Groß-/Kleinschreibung und Satzzeichen), die Länge inklusive Pausen 40–48 s ist und das Sprechtempo im Korridor 120–135 Wörter pro Minute liegt (Pius 2026-10-29: „nicht zu langsam werden“ – unter 120 wirkt es zäh: dann Pausen kürzen, keine Pause > 0,7 s außer vor dem Warum, Tempo nie unter 1,0) (Wörter / Länge in Minuten; Pius 2026-10-29: langsamere Stimme, Tempo 1,0 statt 1,15). Kommt das Skript über 48 s, geht ein Ticket an `firma-autor` zum Kürzen, nie das Tempo wieder hochdrehen.
3. **Beat-Plan.** Für jeden Satzteil eine Zeile in `regieplan.md`:

   | Zeit (aus words.json) | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf des Zuschauers | Ton (SFX/Musik) | Muster |

   Regeln:
   - Frame 1 zeigt das **Ergebnis** der Folge oder eine offene Frage, nie eine leere Welt.
   - Höchstens 1,5 s ohne sichtbare Änderung. Karten erscheinen **mit Inhalt**, nie leer.
   - Mehrwert-Teil (die 3 Schritte) zeigt **echte Claude-Oberfläche** (Screenshots/Aufnahmen von claude.ai mit Zeiger und Klickpfad), keine nachgebauten Fantasie-Panels.
   - Jeder Beat hat genau eine Hauptsache im Bild. Was gesagt wird, ist im selben Moment zu sehen.
   - Kamera: Bewegung mit Absicht (Push-in auf das Wichtige, Fahrt zum nächsten Ort), keine Fahrt nur um der Bewegung willen.
   - **Fester roter Faden (Pius 2026-10-28, Tag 1 v6: „nach der Hälfte verliert es an Übersichtlichkeit, alles zu schnell“).** Vor dem Beat-Plan die Folge in 5–7 Akte schreiben (Hook → Auftrag → Suche → Entscheidung → Wie es funktioniert → offene Frage → CTA). Jeder Akt hat **einen** Ort/ein Hauptobjekt, das bis zum Aktende stehen bleibt; ab der Ergebnis-Hälfte gibt es ein durchgehendes Story-Objekt (z. B. die Kandidaten-Wand), auf das jeder Akt zurückkommt, statt alle 1,5 s an einen neuen Ort zu schneiden. Höchstens ein Ortswechsel pro Satz.
   - **Tempo nach Schwierigkeit, nicht nur nach Takt.** Ein neuer Sachverhalt (wie ein Geschäftsmodell funktioniert, z. B. „Partner druckt ab einem Stück“) bekommt mindestens 3,5–4,5 s als Schritt-für-Schritt-Ablauf (Pfeil-Kette mit 3 Stationen, je Station erst Bild, dann Label), plus 0,4–0,7 s Pause in der Stimme davor oder danach. Pausen setzt die Regie durch Schneiden der `voice.mp3` an Satzgrenzen und Verschieben von `words.json`. Lange Claude-Antworttexte nie als Lesetext zeigen: ein markierter Satz oder eine Karte mit der Kernaussage.
   - **Rückblick-Akt (Pius 2026-10-28):** Nach dem Hook zeigt ein ruhiger Akt (≤ 6 s) das Projekt für Neue: das Produkt als ein Bild (Shirt mit Logo) und das Gründungsboard mit den schon erledigten Schritten als Haken, der zuletzt erledigte Schritt leuchtet kurz auf, dann fährt die Kamera zum heutigen offenen Schritt. Gleicher Aufbau in jeder Folge, damit Wiederkehrer ihn wiedererkennen und Neue ihn verstehen.
   - **Warum-Beat (Pius 2026-10-28):** Jede Begründung einer KI-Entscheidung bekommt einen eigenen ruhigen Beat direkt nach der Entscheidung: das gewählte Objekt bleibt stehen, daneben erscheinen die 2–3 Gründe nacheinander als Karten (Bild + 1–3 Wörter, z. B. „Kein Lager“, „Kein Startgeld“, „Kauft jedes Jahr nach“), je Grund mindestens 1,2 s.
   - **Lehren 2026-10-29:** Rückblick nach TTS messen („Die“ bis Satzende ≤ 6,0 s); notfalls nur die Rückblick-Sätze um ≤ 4 % beschleunigen und Pausen auf ~0,12 s kürzen. Zwischen den Gründen ~0,3 s Pause. „Stick“ im TTS-Text als „Schtick“ schreiben (Untertitel bleibt „Stick“), „A61“ als „A einundsechzig“. Je Warum-Karte den Gegenwert (z. B. „Digitaldruck 30 °C ✗“) in beats.json mitgeben.
   - **Musik ohne explizite Wörter (2026-10-29):** GONE singt u. a. „shit“ (ab 3,47 s: bei ~20,2 s Track; ab 100,16 s: bei ~107 s Track) und 200–276 s mit N-Wort. Vor jeder Musikwahl den Abschnitt solo per STT prüfen: `node scripts/music-explicit-check.mjs .env <abschnitt.mp3>`; jedes explizite Wort auf 0 (Lücke + Crossfade), nicht nur absenken.
   - **Lehre Folge 10 (2026-10-30):** Wird nach der Autor-Prüfung nur ein Satz geändert, nur diesen Satz einzeln neu erzeugen (mehrere Takes, STT 3/3) und samplegenau einsetzen; Rückblick und „Heute“-Start bleiben so unverändert und müssen nicht neu geprüft werden. Wort-Anker, die im Hook schon vorkommen („ganz“), immer mit Mindestzeit (`Ganz@19`).
   - **Lehre Folge 13 (2026-10-30):** Die Eröffnung wird von STT oft als „probiere“ statt „probier“ erkannt (auch in alten Takes). Takes deshalb im Kontext der ganzen eingesetzten Datei prüfen (mehrere STT-Läufe) und nur den Take nehmen, der dort immer sauber ist; längere Pause „führt? → Ich“ fördert den Fehler. Kein freier Musikabschnitt ≥ Folgenlänge mehr am Tag: einen Vortags-Abschnitt nehmen, der nicht an die Vorfolge grenzt, explizite Stellen per `musicMute` stummschalten und den Mute im Stem messen (−90 dB).
   - **Lehre Folge 12 (2026-10-30):** Jede Karte im Regieplan schon ≤ 4 Wörter planen; Quellenzeilen und Einheiten („je 10.000 Einwohner · Sachsen vs. Bund“) gehören in Caption/Guide, nicht auf die Karte (Folge 12: 8-Wort-Region-Karte = Design-K.-o., Chef-Fassung „HANDWERK: 50 STATT 38“). Steht nach einem Doppelpunkt ein englisch klingendes Wort („Claude: … Websuche“), Pause dort roh lassen (~0,13 s), sonst kippt die Aussprache zu „Websearch“.
   - Die 0,5-s-Ereignis-Regel gilt für den Hook; in Erklär-Akten zählt „man versteht, was gerade passiert“ vor Tempo.
4. **Ton-Regie.** Musikbett mit Struktur: leiser Einstieg, Drop oder Akzent beim Ergebnis, kurze Stille vor der Pointe. SFX abwechslungsreich (nicht fünfmal derselbe Pop), keine schweren Whooshes. Ziel −14 LUFS.
5. **beats.json.** Maschinenlesbar für `firma-design`: `[{ "id", "von", "bis", "wort_start", "bild", "kamera", "karten": [...], "sfx": [...] }]`. Zeiten immer über Wort + Mindestzeit (`after`) verankern, nie nur über das Wort (Kollisionen wie „Schreib“/„schreibt“, „Drei“ im Hook und in Schritt 3).
6. **Bibel nachtragen.** Absatz für Tag N: was passiert ist, Kasse alt → neu, neuer Kunde/Produkt, offener Faden für morgen.

Bei einem Korrektur-Ticket von `firma-pruefer`: nur die genannten Beats ändern, `regieplan.md` und `beats.json` neu abgeben und im Plan vermerken, was sich geändert hat.

## Lehre 2026-10-31 (Folgen 14–17 an einem Tag)
Das Serien-Musikstück hat pro Serientag nur Platz für ~4 nicht überlappende 44–45-s-Abschnitte. Am Tagesbeginn alle Abschnitte des Tages auf einmal vergeben (Liste im Tagesbriefing), Vortags-Abschnitte erlaubt, solange sie keinen heutigen berühren. STT „probier/schick“ bleibt nur mit der Eröffnung aus Folge 12 stabil; Stimme an Satzgrenzen aus Teilen bauen ist der schnellste Weg.

## Lehre Folge 19 (2026-11-01, Regie 3 Runden)
- Vor der Abgabe die Ereignis-Lücken per Skript über die GANZE Folge rechnen (6,2 s bis Ende Sprache; alle Beat-Starts, Karten-at, sfx-Anker, events gegen words.json), nicht Beat für Beat schätzen: Folge 19 fiel zweimal durch Lücken 1,55–1,82 s, die erst im zweiten Durchlauf auftauchten. Ergebnis (größte Lücke) in regieplan.md nennen.
- Frame 0 im Beat B01 mit Wortbudget festlegen: außer der Hook-Frage ≤ 12 lesbare Wörter, und schreiben, welche Wörter scharf sind (Folge 19: nur „11,20 € · 5,20 €“ gestrichen + neue Zeile).
- Jeder Beat außer B01 hat `wort_start` mit Wort + after (nie `w: null`). Grund-Karten ohne grauen Gegenwert, wenn Karte + Unterzeile + Screenshot-Satz sonst > 12 neue Wörter ergeben.

## Lehre Folge 20 (2026-11-01, Regie 2 Runden, final Backlog Ton)
- STT immer auch auf der fertigen MISCHUNG prüfen, nicht nur auf voice.mp3: „Websuche“ war auf der Stimme 3/3, in der Mischung nur 3/6 bzw. 7/12 („Websearch“). SFX nie auf Wörter mit englischem Klang legen (≥ 0,15 s nach Wortende) und die musicCurve unter solchen Wörtern um ≥ 3 dB absenken.
- Grund-Karten ohne Gegenwert, der dem Lauf widerspricht (F20: „MIT USt-ID: 0 %“ widersprach Shot 10); jeden Gegenwert gegen den Lauf-Wortlaut prüfen.
