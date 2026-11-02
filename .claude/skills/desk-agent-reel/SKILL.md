---
name: desk-agent-reel
description: Format "Desk Agent" (SD) für Superkind: Split-Screen-Reel im Stil von @_heyclicky — oben der Mac-Bildschirm als Klickdummy (Remotion), unten die Hände am MacBook von oben (Stock + KI-Motion-B-Roll mit MiniMax H3 Max), dazwischen Kino-Inserts, Ganzkörper-B-Roll und harte Cuts. Ein Mensch sagt dem Agenten per Diktat, was er will, der Agent hört erst zu und arbeitet dann sichtbar in Outlook/SAP/Teams. Führt phasenweise von Auftrag → Story → Bildaufbau/Shotlist → Footage (Stock, KI-generiert, Animation) → Screen-Animation → Schnitt & Sync → Audio → QC & Abgabe. Nutze den Skill für "Desk-Agent-Video", "Clicky-Video", "Video wie heyclicky", "Split-Screen mit Händen unten", "Agent-Demo-Reel", "Superkind arbeitet am Mac", "Motion-B-Roll mit Minimax/h3max", oder wenn ein Agent-Use-Case als Bildschirm + Hände erzählt werden soll.
---

# Desk Agent Reel (SD)

Ein Use-Case-Reel, in dem Superkind als Agent auf dem Rechner einer Person arbeitet. Vorlage ist @_heyclicky „i wanna be a good agent“ (`~/Desktop/Superkind Videos/Referenzen/2026-10-20 heyclicky good agent/`: Original, Kontaktbögen alle 0,5 s, Analyse in `references/clicky-analyse.md`). Erstes Beispiel ist `broll/runs/superkind-desk/` mit `broll/src/compositions/SuperkindDesk.tsx` (v2 = Render v6, 2026-10-20).

Arbeite **Phase für Phase**. Jede Phase hat eine eigene Datei in `references/`, eine Ausgabedatei im Run-Ordner und ein Gate. Lies die Referenz einer Phase erst, wenn du dort ankommst, und gehe erst weiter, wenn ihr Gate besteht.

## 0. Grundverständnis: warum dieses Format funktioniert

Lies das vor jeder Phase einmal. Fast jeder Fehler in v1/v2 kam daher, dass einer dieser Punkte nicht verstanden war.

**1. Die Illusion: zwei Bilder ergeben einen Laptop.** Das 1080×1920-Bild sind zwei gestapelte 1080×960-Bilder. Unten sieht man die Tastatur von oben, oben den Bildschirm. Die Naht bei y = 960 ist das **Scharnier**. Der Zuschauer glaubt „das oben ist der Bildschirm von dem Laptop unten“ nur dann, wenn die Oberkante der Tastatur (Scharnier, F-Tasten-Reihe) direkt an der Naht liegt und die Kamera senkrecht von oben schaut.
- *Warum Abend (v2) funktioniert:* Die Tastatur ist oben abgeschnitten und läuft genau in die Naht. Darüber wirkt der Bildschirm wie die Fortsetzung.
- *Warum Morgen (v2) nicht funktioniert:* Unten sind nur Trackpad und Tee, kein Scharnier an der Naht. Der Bildschirm oben hängt dann in der Luft und wirkt wie eine Collage, nicht wie „dein Computer“.

**2. Das Raster: jede Hälfte ist ein eigenes 3×3-Bild.** Kameras blenden Drittel-Linien ein, damit man weiß, was in welchem Feld sitzt. Hier gilt das für jede Hälfte einzeln (Linien bei x 360/720, y 320/640 innerhalb der Hälfte):

| Feld | Oben (Bildschirm) | Unten (Tisch) |
|---|---|---|
| oberes Drittel | Menüleiste, Zuhör-Pill, Agent-Panel oben rechts | Scharnier + Tastatur (liegt an der Naht) |
| mittleres Drittel | Hauptfenster (Outlook …), Cursor-Wege, Zoom-Ziele | Trackpad, Finger in Aktion |
| unteres Drittel | Fensterrand, Dock oder Verlauf zur Naht | Handgelenke/Unterarme als POV, die eigenen Arme des Zuschauers |
| Naht (y 900–1020) | **Captions**, genau 50/50 über der Naht | |

Die Instagram-Oberfläche verdeckt rechts ~120 px und unten ~300 px. Dort sitzt nie etwas Wichtiges (unten liegen dort nur Unterarme, das passt).

**3. Ursache unten, Wirkung oben, im selben Frame.** Der Zuschauer liest jedes Bild quer über die Naht als Ursache und Wirkung:
- Drückt der Finger unten, klickt der Cursor oben **im selben Frame** (±1).
- Gleitet der Finger übers Trackpad, bewegt sich der Cursor gleichzeitig und in dieselbe Richtung.
- Was sich oben ohne Ursache unten bewegt, muss klar der Agent sein: orange Cursor, Label „Superkind …“, und erst nachdem der Mensch fertig gesprochen hat.

**4. Erst zuhören, dann arbeiten.** Solange die Person spricht, passiert oben nur „Superkind hört zu“ (Pill + Wellenform). Die Hände liegen still, kein Agent-Cursor, keine Klicks. Nach dem letzten Wort kommen 0,3–0,6 s „denkt …“, dann „Klar.“, dann Arbeit. Arbeitet der Agent schon während der Frage, denkt der Zuschauer, die Person macht das nebenbei am Trackpad. Dann ist die ganze Pointe weg.

**5. Outcome-First (Pius, 2026-10-21, nach Instinct-Analyse `~/Downloads/Warum Instinct viral geht.md`).** Niemand sieht 64 s. Der typische Zuschauer bleibt ~6 s. Deshalb:
- **Das Ergebnis steht im ersten Frame** (Hook = fertiges Ergebnis, dann „gestern, 16:52“ zurückspulen).
- **Superkind meldet sich selbst** („Du ziehst diese Woche schon zum vierten Mal … Soll ich das ab jetzt jeden Tag machen?“). Proaktivität nimmt das Daran-Denken ab.
- **Der Mensch sagt höchstens 6 Wörter** („Ja, mach.“ / „Schreib denen eine persönliche Mail.“). Keine Spezifikation, Superkind kennt das aus dem Company Brain.
- **Aufwand andeuten, nicht abspielen:** Zähler/Zeitraffer ≤ 2 s, eine Zeile „unterwegs gelöst“. Keine Klickstrecken, keine Fehler-Dialoge, kein Fluchen.
- **Ergebnis-Treffer alle 2–3 s** (Liste da → Entwürfe da → gesendet → unterwegs gelöst). Das ist das Dopamin, nicht Cursor-Klicks.
- **Freigabe bleibt im Bild** (Enter), sobald etwas nach außen geht. Das ist das Versprechen „fragt, bevor etwas rausgeht“.
- **Nur zeigen, was Superkind heute kann.** Das gezeigte Ergebnis muss im Trial wieder eintreten.
- Die lange Prozessversion (60–90 s) ist nur für Website, Demo-Follow-up und Retargeting. Im Feed läuft die Outcome-Version (≤ 30 s, mit zwei Aufgaben ≤ 35 s).

**5b. Superkind-Botschaft (Website, Stand 2026-10-21), Pflicht vor jedem Skript:**
- Superkind = KI-Mitarbeiter für dein Team. Man schreibt ihm **in Outlook, Teams oder Slack wie einem Kollegen**.
- Er erledigt die Aufgabe in deinen Tools und **fragt, bevor etwas rausgeht**.
- Was man einmal erklärt, **läuft danach als Routine**. Er lernt ab Tag 1 (Company Brain).
- DSGVO, Hosting in Europa, kein Modell-Training: höchstens eine Zeile, nie als Erklärteil.
- **Kanal im Video:** jede Aufgabe über einen echten Kanal, Superkind ist dort ein Kontakt (z. B. Aufgabe 1 im Teams-Chat, Aufgabe 2 als Antwort auf Superkinds Mail in Outlook). Ein eigenes Superkind-Fenster nur, wenn Pius es ausdrücklich will.

**6. Cuts und Typwechsel sind das Dopamin.** Die Vorlage startet mit 3 s Kino-Inserts im Vollbild, bevor der Split überhaupt kommt. Danach wechseln Split, Vollbild-Insert, Makro und Ganzkörper alle 2–4 s, und oben passiert alle 0,5–1 s etwas Neues. Bewegung entsteht durch Cuts und Ereignisse, nicht durch Dauer-Zoom.

## Phasen

| Phase | Was | Ausgabe in `broll/runs/sd-<slug>/` | Referenz | Gate |
|---|---|---|---|---|
| 1 | Auftrag verstehen | `auftrag.md` | `references/01-auftrag.md` | ein Satz Versprechen, ein Use-Case, eine App-Welt |
| 2 | Story & Skript | `story.md` (Beats + Sprechtext) | `references/02-story.md` | Outcome-Gate (Ergebnis bis Sek. 2, Mensch ≤ 6 Wörter, ≥ 3 Ergebnis-Treffer, ≤ 30–35 s) |
| 3 | Bildaufbau & Shotlist | `shotlist.md` (Tabelle pro Schnitt) | `references/03-bildaufbau.md` | jeder Schnitt hat Modus, Raster, Quelle, Sync-Punkt |
| 4 | Footage beschaffen | `stock/`, `gen/`, `footage.md` | `references/04-footage.md` | Scharnier-Check, kein Wasserzeichen, KI-Hände sauber |
| 5 | Screen-Animation | `<Name>Desk.tsx` | `references/05-screen.md` | Zustände folgen dem Skript (hört zu → denkt → arbeitet → erledigt) |
| 6 | Schnitt & Sync | Render `vN.mp4` | `references/06-schnitt-sync.md` | Finger = Cursor = SFX im selben Frame, Zooms motiviert |
| 7 | Audio | `voice.wav`, SFX, Musik | `references/07-audio.md` | Stimmen natürlich, SFX premium, −14 LUFS |
| 8 | QC & Abgabe | Desktop-Ordner | `references/08-qc-abgabe.md` | Checkliste komplett, Gemini-QC ≥ 8 |

Audio (Phase 7) läuft praktisch ab Phase 2 mit, weil die Stimmen-Timings den Schnitt bestimmen. Sprechtexte sofort nach dem Story-Gate erzeugen und Wort-Timings holen, dann Phase 3.

Pius sieht standardmäßig das fertige Video. Will er vorher die Story sehen („Story erst zeigen“), stoppe nach Phase 2. Neue KI-Clips kosten echtes Geld (OpenRouter). Den Kontostand prüft `gen-motion-broll.mjs --dry`. Reicht er nicht, frag Pius vor Phase 4 nach Aufladen, statt Shots heimlich zu streichen.

## Harte Regeln (Kurzfassung, Details in den Phasen)

- Agent-UI weiß + orange mit Superkind-Branding (superkind.ai: #FF6B35, Inter). Superkind tritt als Kontakt in Teams/Outlook auf (orange Avatar), seine Nachrichten sind Ergebnis-Karten (Kern in der ersten Zeile, screenshotfähig). Pro Moment nur EIN Fenster auf dem Screen, kein Fenster-Gewitter. Echte App-Logos aus `broll/public/logos`. Die App-Struktur (Chat/Arbeit, Eingang, Geplant …; Vorlage `~/Downloads/02 Bilder/superkind video.png`) nur, wenn ein Superkind-Fenster gewollt ist (v7).
- Agent-Stimme ist ElevenLabs „Ava“ `AnvlJBAqSLDzEevYr9Ap`, nie „Lisa“. Die Person spricht mit Niklas' Stimme (HeyGen create_speech, nikstudio) und heißt im Video „Florent“.
- Captions genau mittig auf der Naht, ohne Logo. Agent-Wörter hellorange, Mensch weiß.
- Hände: ein Druck auf die Diktier-Taste, dann ruhen, reden oder gestikulieren. Nie Dauertippen.
- Footage nur ohne Wasserzeichen und in hoher Qualität. Keine fremden Tastaturlayouts (kyrillisch …), keine fremden Marken.
- Echte Personen-Videos nie an Seedance. MiniMax H3 Max nur mit anonymen Händen/Personen aus Stock-Frames.
- SFX luxuriös: weiche Glas-/Holz-Ticks, keine Spielzeug-Pops, keine schweren Whooshes oder Sub-Hits.
- Abgabe nach der Abschluss-Checkliste: Video, Cover, IG/TikTok-Caption eingefügt, Desktop-Ordner `~/Desktop/Superkind Videos/<Datum> <Thema>/` mit Versionen und Rohmaterial.

## Werkzeuge

- Remotion-Basis: `broll/src/compositions/SuperkindDesk.tsx` (Cursor, Panels, Outlook-Fenster, Captions, DeskShot, Audio-Cues). Für ein neues Video kopieren, nicht überschreiben.
- KI-B-Roll: `node broll/scripts/gen-motion-broll.mjs --first <frame.png> --prompt "…" --out <clip.mp4> [--dur 5] [--aspect 4:3] [--dry]`
- ffmpeg/ffprobe: `broll/node_modules/ffmpeg-static/ffmpeg`, `broll/node_modules/@ffprobe-installer/darwin-arm64/ffprobe`. In zsh Filter-Strings mit `bash -c` bauen.
- QC: `mcp__instagram-video-analyzer__analyze_local_video`. Immer mit konkreten Fragen und Zeitstempeln prompten, sonst kommt eine generische Zusammenfassung (oft auf Portugiesisch).
