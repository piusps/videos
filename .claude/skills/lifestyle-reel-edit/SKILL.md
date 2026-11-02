---
name: lifestyle-reel-edit
description: Schnitt für Niklas' privaten Lifestyle/LARP-Business-Instagram-Account (Format NL) - macht aus Skript oder Statement plus echten B-Rolls aus Niklas' Leben (Bibliothek ~/Documents/niklas-lifestyle, Brain in BRAIN.md) ein cinematic Reel - Clip-Auswahl nach Story-Funktion, Schnitte exakt auf dem Beat, Riviera/Alpine-Grade, sanfte Push-ins, Grain, ruhige Statement-Texte, eigenes lizenzfreies Musikbett (ElevenLabs Music) plus eine Version ohne Musik für Trending-Audio. Nutze den Skill bei "Lifestyle-Reel", "Niklas privat", "LARP-Video", "mach aus dem Skript ein Lifestyle-Video", "welche B-Roll passt zu X", "neue B-Rolls einsortieren". Nicht für @florent_preusser, @florentgpt oder Avatar-Reels.
---

# Lifestyle-Reel-Edit (Format NL)

Privater Account von Niklas: echtes Leben (Reisen, Bühne, Workation, Firma bauen) plus Business-Learnings. Der Wert für den Zuschauer ist das Learning, die B-Roll liefert den Status und die Stimmung dazu. Es gibt keinen Avatar, keine KI-Grafik und keine Superkind-UI.

## Quellen
- `~/Documents/niklas-lifestyle/BRAIN.md`: Welten, Story-Funktionen, fertige Sequenzen, Nutzungsregeln und Drehliste. **Vor jeder Clip-Auswahl lesen.**
- `clips.json`: pro Clip ID, Ort, Szene, ob Niklas zu sehen ist, Shot-Art, beste Sekunden, Qualität 1–5 und Themen-Tags.
- `library/NLxx_slug.mp4`: die nutzbaren Clips. `usage.json` loggt, welcher Clip in welchem Video lief.
- Neue B-Rolls: in einen eigenen Ordner unter `raw/` laden, mit `tools/probe.py` prüfen, Contact-Sheets ansehen (8 Frames pro Clip), dann in `tools/build_library.py` eintragen (fortlaufende NL-ID) und BRAIN.md aktualisieren.

## Formate
1. **Statement-Reel (7–16 s):** 1–3 kurze Textzeilen auf einer Beat-Montage. Ein Gedanke, kleine Schrift, kleingeschrieben. Standard, solange es keine Skripte gibt.
2. **Voiceover-Reel (20–45 s):** Niklas' Stimme (echte Aufnahme bevorzugt, sonst Stimme aus dem Studio) über B-Roll. Kleine Untertitel, Musik geduckt auf etwa -18 dB unter der Stimme, Schnitte auf Satzgrenzen und Beats.
3. **Listen-Reel ("3 Dinge, die …"):** pro Punkt ein neuer Clip mit Nummer und Zeile. Der Cut liegt auf dem Downbeat.

## Schnittregeln
- **Frame 1 zeigt Status oder einen Bruch:** Bademantel mit Laptop, Sénéquier-Turn, voller Saal, Pool-Villa. Kein Establishing-Leerlauf.
- **Shot-Länge = Beats:** 4 Beats (≈2 s bei 118 BPM) als Standard. 2 Beats für Tempo-Passagen, 8 Beats für das Schlussbild. Der Renderer rechnet das automatisch.
- **Jeder Shot braucht Bewegung:** entweder eigene Kamerabewegung im Clip oder einen Push-in von 1,03–1,10. Über 1,12 wird das 720p-Material matschig.
- **Bewegungsrichtung beim Schnitt mitnehmen** (Walk von links → nächster Shot mit Bewegung nach rechts/vorne). Turn-around- und Wink-Momente liegen auf dem Beat.
- **Welten nicht wild mischen:** maximal 2–3 Welten pro Reel, außer der Kontrast ist die Aussage (Sommer ↔ Winter, Bühne ↔ Bademantel).
- **Texte:** Inter Medium 50 px, weiß, weicher Schatten, kleingeschrieben, höchstens 2 Zeilen à ~28 Zeichen. Position im ruhigen Bildteil (Himmel, Wand), **nie über Folien, Schriftzügen oder Gesichtern**. Serif-Akzent (Georgia Italic) nur für die letzte Zeile und nur auf ruhigem Hintergrund. Jede Zeile steht mindestens 1,8 s plus 0,3 s pro Wort.
- **Grade:** `riviera` für Sommer, Business und Bühne, `alpine` für Schnee und Holz, `night` für dunkle Clips. Immer Finish mit Schärfen, Grain und Vignette.
- **Originalton** leise mischen (ambient 0.10–0.15). Wellen, Hafen und Schritte machen es echt.
- **Ehrlichkeit:** Text und Caption behaupten nichts, was der Clip nicht ist (keine fremde Villa als "mein Haus"). Kunden, Crew und Fremde erscheinen nur nach Freigabe (siehe BRAIN.md).

## Voiceover-Reels (Pius-Feedback 2026-10-28, Reel 1 v1 → v3 = freigegebener Standard)
- **Länge:** 30–40 s, ~90–100 Wörter. Nur Hook, Autorität in 1 Satz, die 3 konkreten Punkte, eine Prüffrage zum Mitnehmen, CTA. Alles Erzählerische raus. v1 mit 56 s war "viel zu lang, zu wenig bummsiger Mehrwert".
- **Schnitt nach INHALT, nicht nach Beat.** Ein Shot pro Inhalts-Einheit (Satz oder Halbsatz), der Cut liegt am Wortanfang der neuen Einheit (−0,04 s). Ziel Ø 2–3 s pro Shot, Schlussbild 4–5 s. Ein Cut auf jedem Beat (v1, 1 s) war "zu viele schnelle Cuts". Der Song läuft nur drunter; einzige Kopplung: `music_offset` so, dass der Drop auf dem Autoritäts-Cut landet.
- **Clip-Wahl über `labels.json`:** Jeder Clip-Abschnitt hat "bild" + "passt_zu" (Aussage-Tags wie geld-umsatz, telefon-deal, ironie-fassade, kreislauf-system, cta-abschluss; Quelle `tools/labels_src.py`). Jede Einheit bekommt einen Tag, der Selector nimmt das beste noch ungenutzte Segment. Regeln: kein Clip doppelt, **nie zweimal hintereinander derselbe Ort** (`clips.json` → ort), feste Wahl nur für Hero-Momente. Vorlage: `scripts/build_plan_content.py`.
- **Stimme (freigegeben):** ElevenLabs `eleven_v4`, Niklas-IVC `yQjmbBmq3NDPiZt6tgKR`, stability 0.4, style 0.3, speed 1.05, danach `atempo=1.04` (Wort-Timings /1.04). Die v3-Variante mit `[nonchalant]` und langsamerem Tempo war laut Pius "mega Arsch", nicht wieder verwenden. Eine echte Aufnahme von Niklas schlägt jede KI-Stimme.
- **Untertitel = Remotion-Ebene `NLSubs`** (seit 2026-10-28, Referenz `~/Documents/niklas-lifestyle/referenz-untertitel/03_DfC83cJIpXx`): Wort für Wort aufbauen (Blur-/Fade-in 0,16 s), pro Chunk höchstens 1 Schlüsselwort groß (96 px), Füllwörter klein (44 px), Rest 66 px, Inter Tight 600/700 mit enger Laufweite, weicher Schatten, Block bei y 1240. `build_plan_content.py` schreibt `subs_props.json`, dann `npx remotion render src/index-nl-subs.tsx NLSubs <reel>/subs.mov --props=<reel>/subs_props.json --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --concurrency=6 --timeout=120000` im broll-Ordner (~5 min), Plan-Key `overlay` = subs.mov, `texts` leer. Der Serif-Stil `lux` (v3) und `sub` (v1) sind abgelöst.
- **Ton:** B-Rolls stumm (`ambient: 0`), Musik eingebrannt. `_ohne-musik.mp4` nur als Ersatz, falls Instagram den Song stummschaltet.
- **Mix (seit 2026-10-29, Pius: "Musik viel zu laut und schepprig, Stimme viel zu leise"):** render.py misst Stimme und Song-Abschnitt einzeln (EBU R128), Stimme auf -14 LUFS, Musik fest `music_under` dB darunter (Pius-Wert 17, 20 war ihm einen Ticken zu leise), Musik bei 3 kHz abgesenkt, nur leichtes Ducking, kein loudnorm auf dem Gesamtmix (das pumpte), am Ende statisch auf -14 LUFS / -1 dBTP. `music_gain` ist nur noch Feintrimm (1.0). Kommerzielle Songs sind auf ca. -10 LUFS gemastert; ein fester Faktor wie 0.8 legt sie über die Stimme. QC: Musik-Rest (Final minus ohne-Musik) muss ~18–20 dB unter dem Final liegen.
- **Nur ästhetische Abschnitte (Pius 2026-10-29):** Keine Gesichts-Selfies oder Close-ups, keine Whips oder Wackler, keine erkennbaren Fremden. Jeden neuen Clip mit 2 fps Bild für Bild sichten (Strips), bevor Labels entstehen. 4 Übersichts-Frames reichen nicht: NL42 wurde als "Ausblick" gelabelt, war aber ein Selfie. Labels decken nur das saubere Fenster ab, und der Selector nimmt nur Fenster, die ≥ der Shot-Länge sind.
- **Look = `"grade": "cinema", "finish": "cinema"`:** render.py gleicht jeden Clip vorher an (Belichtung auf Luma 0.40–0.46, Farbstich halb neutralisiert), glättet Kompression (hqdn3d, bei 720p stärker), schärft adaptiv (cas), danach eine gemeinsame Filmkurve (angehobene Schwärzen, Teal-Schatten, warme Highlights, Sättigung 0.86), feines Korn und Vignette. Störende Bildteile mit `zoom` + `cy` pro Shot wegcroppen (z. B. NL60 zoom 1.3, cy 1).
- **QC-Fallen:** Makro-Shots aus Laptop-Push-ins (Katzenfell, Unschärfe) rauswerfen. Weißer Text auf weißer Wand → Untertitel tiefer setzen.

## Musik
- **Zuerst `~/Documents/niklas-lifestyle/MUSIK.md` lesen:** 15 Referenz-Songs von Pius mit Ranking, BPM, Startsekunde, Mood, Story und B-Rolls. Seit 2026-10-28 (Pius-Wunsch) wird der Song ins Final eingebrannt; `_ohne-musik.mp4` plus Startsekunde liegt als Ersatz bei.
- Standard: eigenes Bett per ElevenLabs Music (`POST https://api.elevenlabs.io/v1/music`, Key in broll/.env, `music_length_ms` = Reel + 3 s). Der Prompt enthält immer "Instrumental only, no vocals", ein festes BPM, "no long intro" und die Stimmung der Welt:
  - Sommer/Riviera: melodic deep house 118 BPM, felt piano, warm pads
  - Alpen/Ruhe: ambient piano 80–90 BPM, soft strings
  - Bühne/Ehrgeiz: cinematic hybrid, pulsing low strings 100 BPM, building drums
- Generator: `~/Documents/niklas-lifestyle/tools/gen_music.sh <name> <ms> "<prompt>"`. Höchstens 2 Anfragen gleichzeitig, **keine Künstler- oder Songnamen im Prompt** (sonst 400 copyrighted_material).
- Vorhandene Betten (2026-10-28): riviera-house, afro-house-riviera, french-disco, old-money-strings, dark-piano-phonk, cinematic-epic, lofi-alpine. Der Vergleich liegt in `tests/musik-vergleich/`. Pius' Favoriten hier eintragen.
- Ablage in `~/Documents/niklas-lifestyle/music/`, mit BPM im Dateinamen. Beats prüfen mit `render.py --beats`.
- Es wird **immer** zusätzlich `_ohne-musik.mp4` geliefert, damit Pius in der App einen Trending-Sound drauflegen kann (das bringt oft mehr Reichweite).

## Ablauf
1. Skript oder Statement lesen und in Beats zerlegen (pro Gedanke 1 Shot).
2. Pro Beat den Clip aus BRAIN.md und clips.json wählen: zuerst nach Story-Funktion, dann nach Qualität ≥ 4, dann danach, ob er zuletzt in usage.json vorkam.
3. Musik generieren oder wählen, `--beats` laufen lassen, `bpm` und `music_offset` in den Plan schreiben.
4. Plan-JSON schreiben (Format siehe Kopf von `scripts/render.py`) und rendern:
   `python3 -I ~/.claude/skills/lifestyle-reel-edit/scripts/render.py plan.json` (dauert ca. 3–4 min für 16 s).
5. QC: Contact-Sheet (1 Frame pro Shot) ansehen. Prüfen, ob jeder Text lesbar ist, kein Text auf Gesicht oder Folie liegt, die Schnitte auf dem Beat sitzen und kein Shot matschig wirkt. Bei Bedarf korrigieren und neu rendern.
6. Auslieferung: ein Ordner `~/Desktop/Niklas Lifestyle/<Datum> <Thema>/` mit Final, Ohne-Musik-Version, Caption und Plan-JSON. Dann den MP4-Pfad als Codeblock posten und usage.json ergänzen.

## Offen
- Account-Name, Caption-Stil und Posting-Rhythmus werden mit den ersten Skripten festgelegt.
- Für Voiceover-Reels wird der Untertitel-Stil noch bestimmt (Vorschlag: klein, weiß, Satz für Satz, kein Karaoke).
