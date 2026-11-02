# Schnitt-Stil GPT-N = @mavgpt (gemessen 2026-10-01)

> **Ersetzt seit 2026-10-15** durch `gpt-look-2026-10-15.md` (Henri: Weiß + Dunkelgrün, Glas, FP-Untertitel in Grün, kein Branding). Diese Datei nur noch als Recherche/Historie; Messwerte zu Tempo (Wechsel alle 3–4 s, viel Bildschirm-Inhalt) bleiben als Orientierung.

Pius (2026-10-01): Die normalen Videos auf @florentgpt kopieren den Stil von @mavgpt (Editing, Text-Hooks, Captions, B-Roll). Diese Datei **ersetzt für GPT-N** die FP-N-Vorgaben zu Zooms, Untertiteln und B-Roll. Render, Silence Cut und Encode bleiben wie in `video-post-production`.

Datengrundlage: 100 Reels (2026-09-08 bis 10-01, Median 11.200 Plays, Top 1,5 Mio.), 10 Top-Reels heruntergeladen, Schnitte per ffmpeg gezählt, Kontaktbögen Bild für Bild. Rohdaten: `/Users/pius/LinkedIn Generator/research/creators/` (`reels-meta.json`, `mavgpt/*.mp4`, `sheets/`).

## Messwerte

| Wert | @mavgpt |
|---|---|
| Länge | Median 44 s (Top-Reels 29 bis 60 s) |
| Schnitte | 8 bis 30 pro Reel, im Schnitt alle **3 bis 4 s** ein Wechsel Gesicht ↔ Bildschirm |
| Anteil Bildschirm (B-Roll) | **50 bis 70 %** der Laufzeit; Gesicht nur Hook, Zwischen-Hook und CTA |
| Kamera | Selfie, handgehalten, Nahaufnahme, natürliches Licht, Vorhang-Hintergrund; **keine** Keyframe-Zooms |
| Ton | „Original audio“, Sprache trägt; keine erkennbare Musik-Spur in den Metadaten. **Bei uns trotzdem Musik (Pius, 2026-10-02):** leiser Musik-Teppich unter der Stimme, wie bei allen Reels (Abschluss-Checkliste), plus leise Klick-/Pop-Sounds auf den Klicks |

## Text-Hook (Frame 0, Thumbnail)

- **Weiße Box, schwarze Schrift**, abgerundete Ecken (Instagram-„Classic“-Optik), halbfett (SF Pro / Inter SemiBold), zwei Zeilen, zentriert, **über dem Kopf** (y ≈ 0,08–0,14 der Höhe).
- **Ein Emoji am Ende** der zweiten Zeile: 😳 🤯 😏 👉 🤑 (nur auf dem Bildschirm, nie gesprochen).
- Inhalt = das Versprechen als Fakt oder Ergebnis: „ChatGPT can now edit videos for you 😳“, „Secret Image Codes for ChatGPT 😳“, „My entire website was built with AI 🤯“, „5 things to build with Claude in a weekend 🤯“. Deutsch: „Claude schneidet jetzt deine Videos 😳“, „10 geheime Codes für ChatGPT 😳“.
- Steht ca. 3 bis 5 s, dann weg.
- Umgesetzt (2026-10-02): `broll/src/components/GptHook.tsx`, aktiv über `render-pipeline.mjs --preset gpt`. Das ist bewusst **nicht** der schwarze „Strong“-Pill-Hook von @florent_preusser.

## Zwischen-Boxen (gleicher Stil)

- **Listen-Nummer** beim Wechsel zum nächsten Punkt, über dem Kopf: „4. /devil“, „4. Branding Kit“, „10. REWIRE“.
- **Re-Hook** mitten im Video: „How to set this up 👉“, „Just ask it 😏“. Deutsch: „So richtest du's ein 👉“, „Frag einfach 😏“.

## Untertitel

- **Ein Wort**, GROSSBUCHSTABEN, weiß, sehr fett (Montserrat/Inter Black), dezenter dunkler Schatten, **ohne Box, ohne Farbe**, Höhe y ≈ 0,79 (Brust). Auch über B-Roll an derselben Stelle.
- Ersetzt für GPT-N die Anton-Karaoke-Captions mit oranger Box. Umgesetzt in `broll/src/components/GptCaptions.tsx` (Montserrat Black, Mitte bei 75 % Höhe, kurzer Pop pro Wort), aktiv über `--preset gpt`.

## Schnitt (Pius 2026-10-02: „nicht identisch mit florent_preusser“)

- Keine weichen Keyframe-Push-ins wie bei FP-N. Stattdessen **harte Jump-Cuts** auf max. 128 % an denselben Satzgrenzen, das wirkt wie ein Selfie-Schnitt. Das macht `--preset gpt` automatisch.
- B-Roll setzt mit einem kurzen Pop ein (106 % auf 100 % in 5 Frames), nicht mit einem nackten harten Schnitt.

## B-Roll

**Pius, 2026-10-06: ChatGPT statt Claude, helle UI + echte Logos.** Pius, 2026-10-01 (Vorrang, Tool jetzt ChatGPT): Die B-Roll zeigt die **exakten Klickpfade in Claude**, wie eine Anleitung. Jeder, der das Video sieht, muss es danach selbst nachklicken können: wo man klickt (Cursor/Finger + roter Rahmen um den Knopf), was man eintippt (die Nachricht tippt sich sichtbar ein), was dann kommt. Grundlage sind **echte, aktuelle Screenshots/Aufnahmen von claude.ai bzw. der Claude-App**, keine erfundene Oberfläche. Ablauf pro Video: Klickpfad in Claude durchspielen (in Pius' Chrome, mit seinem OK), jeden Schritt screenshotten, daraus die B-Roll-Sequenz bauen; Menüpunkte genau so beschriften, wie sie in Claude heißen. Kein ChatGPT, keine anderen Tools.


- **Echte Bildschirm-Aufnahmen** der App, um die es geht (ChatGPT, Claude, Lovable, Browser): Prompt wird getippt (Tastatur sichtbar am Handy oder Desktop-Eingabefeld), Antwort läuft, Ergebnis wird gezeigt.
- Zwei Layouts im Wechsel: **Vollbild-Screen** (Desktop/Handy-UI über die ganze Höhe) und **Screen oben, Gesicht unten angeschnitten** (Screen-Karte ~60 % der Höhe, darunter der Sprecher).
- **Rote Rechtecke** um die entscheidende Stelle (Befehl, Zahl, Ergebnis-Zeile), Linie ~4 px, rot `#E53935`, poppen auf dem Wort.
- **Ergebnis im Vollbild:** das generierte Bild, die fertige Website, das Upgrade-Ergebnis. Das „das will ich auch“ steht ~2 bis 4 s allein.
- Wechsel hart (Cut), keine Blenden, keine Glass-Animationen.
- Umsetzung bei uns: Remotion-Nachbau der App-Oberfläche (Chat-Eingabe tippt, Antwort streamt, roter Rahmen, Vollbild-Ergebnis) plus echte Ergebnis-Bilder/Screenshots. Für Superkind gilt „keine echte Produkt-UI“, für Claude/ChatGPT/Lovable bei GPT-N nicht. Basis ist `broll/src/components/ScreenFlow.tsx` (echte Screenshots plus Cursor, Tippen und Kamerafahrt; Aufnahme mit `scripts/capture-flow.mjs`). Für GPT-N immer mit `accent={[239,68,68]}` (rote Rahmen), im Vollbild und **nie** im Explainer-Split oder Glass-Stil von @florent_preusser.

## Outro / CTA

- Letzte 3 bis 5 s Gesicht, Box über dem Kopf: „Follow and comment “Edit” and I’ll DM you“. Deutsch: „Folg mir und kommentier „Edit“, dann schick ich's dir 👇“ (Trigger-Wort in Anführungszeichen, normal geschrieben).
- Gesprochen: „Kommentiere Edit, dann schick ich dir …“ (siehe `gpt-hype-script`).

## Was wir NICHT übernehmen

- Keine erfundenen „Geheimcodes“, die nicht funktionieren. Slash-Befehle wie „/human“ sind **Prompt-Kürzel, die Claude/ChatGPT als Anweisung versteht**, keine eingebauten Funktionen; so formulieren („Schreib /human vor deinen Prompt, dann …“) und jeden vorher testen.
- Keine Fake-Zahlen („800.000 Besucher“) ohne eigenen Beleg.


## Update 2026-10-05 (Pius)
- **Zooms:** keine harten Jump-Cuts mehr. Schneller, aber sichtbarer Push-in (~0,3 s, ease) auf max. 120 %, Rückweg ~0,4 s (render-pipeline.mjs `toJumpCuts`). "Zu hart und abrupt, wirkt unedel."
- **Bildausschnitt:** Kopf ins obere Drittel, Oberkörper sichtbar, wenig Wand: bei viel Weißraum `tightened.mp4` vorab croppen (z. B. scale 1.35, unten anliegend) und Untertitel auf den Gesichts-Einstellungen auf y 0.80 (captionZones), damit sie nie im Gesicht stehen.
- **Look:** "Niklas gpt normal" c4f527e4, Cap-Look gesperrt.

## Dopamin-Dichte (Pius 2026-10-07, Gehalt v2)
- Das grüne Bubble-Maskottchen steht nie still: zwischen allen Keyframes hüpft es alle ~0,45 s (`busy()` in GptGehaltBrolls.tsx).
- In jedem Panel driften und drehen sich passende Emojis im Hintergrund (`Floaters`).
- SFX dicht: Whoosh auf jedem Panelwechsel, Pop/Klick/Ping auf jedem Element, Tippen beim Schreiben, Tick-Serie beim Hochzählen, leise Pops auf den Maskottchen-Hüpfern (~60 Effekte auf 30 s). Keine schweren Booms.
- Dazu (v3): Konfetti-Burst + kurzer Screen-Shake auf jedem Höhepunkt, Live-Reaktionen (🔥💯😱) steigen rechts durchgehend auf, pulsierender Glow hinter den Karten (`Burst`, `Reactions`, `Wrap bursts` in GptGehaltBrolls.tsx). Für jedes neue GPT-N-Video übernehmen.
