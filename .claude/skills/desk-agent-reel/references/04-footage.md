# Phase 4: Footage beschaffen

Ziel: Für jede Shotlist-Zeile liegt passendes, sauberes Material im Run-Ordner. Ausgabe: `stock/`, `gen/`, `footage.md` (Datei → Lizenz/Quelle → wofür → Schnittpunkte).

## 4A Stock (Pexels)
- **Suchen** auf pexels.com/videos (Browser-Tab). Gute Begriffe: „typing laptop top view“, „hands macbook overhead“, „man sitting down desk laptop“, „closing laptop“, „stretching at desk“, „coffee laptop morning“. Die Video-URLs stehen im HTML der Video-Seite; Download mit Browser-UA in `scratchpad/pex/` (ungeprüfte Downloads), erst nach Prüfung nach `runs/…/stock/`.
- **Prüfen vor Verwendung** (Kontaktbogen alle 0,5 s):
  1. kein Wasserzeichen, ≥ 1080p, kein Flackern
  2. Split-Material: Ist die obere Tastaturkante sichtbar und lässt sie sich auf die Naht legen? Wenn nein, dann nur Modus B/C.
  3. Tastatur-Layout (QWERTZ/QWERTY ok, kyrillisch o. Ä. nein), keine Marken
  4. **Bewegungsprofil:** `tblend=all_mode=difference,signalstats` und YAVG pro Frame. Ruhige Stellen (Hände liegen) und Aktionen (Druck, Klick) mit Zeitstempel notieren. Dauertippen ist für den Split unbrauchbar.
- **Zuschneiden:** Gegenüber-Perspektive 180° drehen (`hflip,vflip`), skalieren, dann `crop=1080:960:x:y` so, dass die Tastaturkante bei y≈0–30 der unteren Hälfte liegt. Geschwindigkeit per `setpts` anpassen (Ruhe darf 0,6–0,7× laufen), dann `fps=25`. Grade passend zur Szene (Abend: `eq=gamma`, warm; Morgen: `colortemperature`).

## 4B KI-Motion-B-Roll (MiniMax Hailuo 3 Max über OpenRouter)
Für Handlungen, die es nicht als Stock gibt. Pius' Beispiel: die Diktier-/fn-Taste am MacBook drücken.

**Ablauf:**
1. **Startbild aus echtem Footage** ziehen: der Frame, in den der KI-Clip später überblendet. Gleich gedreht und gegradet, im Seitenverhältnis des Modells (4:3 1024×768 für Tisch-Shots, 9:16 für Ganzkörper-Vollbild). Hände, Licht und Laptop passen dann automatisch.
2. `node scripts/gen-motion-broll.mjs --first gen/first.png --prompt "…" --out gen/<name>.mp4 --dur 5 --aspect 4:3`. Vorher `--dry` zeigt Kontostand und Kosten.
3. Prompt-Anatomie (Englisch): **Kamera** („static overhead camera, no camera movement“) + **genau eine Handlung mit Zeitablauf** („the right hand lifts from the trackpad, the index finger presses the microphone key in the top row once and holds it, then the hand settles back on the keys“) + **was NICHT passiert** („no typing, left hand stays still, no text appears“) + **Look** („same warm evening light, realistic skin, shallow depth of field“).
4. Prüfen (Kontaktbogen 0,25 s + Bewegungsprofil): Fingerzahl, keine schmelzenden Tasten, keine erfundene Schrift, Handlung zur geplanten Sekunde. Den Kontakt-Frame (Finger trifft Taste) notieren, das ist der Sync-Punkt.
5. Einbau: KI-Clip zuerst, dann `xfade=fade:duration=0.3–0.4` in den echten Clip an einer Stelle mit ähnlicher Handhaltung (Vergleichsbild KI-Endframe vs. echte Frames bauen). Bei Bedarf `tpad=stop_mode=clone`, wenn der Clip die Segmentlänge nicht ganz füllt.

**Grenzen und Kosten:**
- Nur **ein** Keyframe (first_frame), last_frame geht nicht.
- 5–15 s, 768p, ~0,08 $/s (5 s ≈ 0,40 $). `aigc_watermark: false` setzt das Skript selbst.
- Die Fn-Taste liegt oft unter der linken Hand. Dann die **Mikrofon-Taste (F5)** in der oberen Reihe nehmen, sie ist sichtbar und ist die Diktier-Taste. Wenn Pius ausdrücklich Fn will: ein Startbild suchen, auf dem die Fn-Ecke frei ist, oder ein schräges Makro (Modus B) generieren.
- Keine echten, erkennbaren Personen (Niklas) als Startbild. Echte-Personen-Videos nie an Seedance.
- Gute KI-Shots: Tastendruck-Makro schräg, Laptop aufklappen (Startbild = zugeklappter Laptop), Person kommt an den Tisch (Startbild = leerer Tisch mit Stuhl), Hand greift zur Tasse, Fehler-Moment (Hände gehen hoch, Kopf in die Hände).

## 4C Eigene Animation
- Bildschirm-Inhalt immer in Remotion (Phase 5).
- Vollbild-Inserts ohne Kamera (große Fehlermeldung, Zähler, Logo-Makro) in Remotion oder HyperFrames, im selben Look (weiß/orange, Inter).

## 4D Ganzkörper
Pexels, Modus C. Eine Person (Gesicht nicht zwingend) im Büro- oder Homeoffice-Licht, das zur Szene passt. Gleiche Kleidung wie die Hände (Ärmel, Uhr) ist nice-to-have. Kein Gesicht zeigen ist sicherer als ein falsches.

**Gate:** Jede Shotlist-Zeile hat eine Datei. Alle Split-Clips bestehen den Scharnier-Check. KI-Clips sind auf Hände/Tasten geprüft. `footage.md` hat Quelle + Lizenz für die Texte-Datei.

## 4.x Lessons from Desk Agent v3 (2026-10-20)
- **OpenRouter:** the key limit ($/day) is only a cap. Billing always comes out of the account balance. At balance $0 every video job returns 402, so Pius has to top up at openrouter.ai/settings/credits himself. Check `/credits` before every job.
- AI MP4s from OpenRouter contain an audio track. Always measure duration with `-select_streams v` and render with `-an`.
- Render reversed or speed-changed parts **one file each** (with `fps=25` per part), then concat them. Chained trim/reverse/setpts in one graph produced the wrong length.
- zsh: write `${1}` / `${VAR}` in filter strings (`$1:e` and `$VAR[v]` are zsh modifiers/subscripts).
- **Hands-off shot from the lid clip:** the empty keyboard segment (hands gone, lid open, moving shadow) is the best bottom shot while the agent works. Build it as forward/reverse ping-pong, with "hands leave" at the start and "hands come back" (reversed) at the end, so the hands are on the trackpad exactly at the human click.

## 4.x Hand clips via HeyGen image_to_video (v4, 2026-10-21)
- Method: a still from the real overhead footage with hands RESTING (palm rest left/right of the trackpad) as the start frame → HeyGen connector `image_to_video` (heygen-video-1, plan credits, ~1 min). Name the key position explicitly in the prompt ("top row, the microphone key directly above the 5 key, left of center"); otherwise the model hits a neighbouring key.
- Clips needed: rest (ping-pong for any length), dictation press (lift → one press → back to rest pose = match on rest frame 0), Return press, person sitting upright with hands on the table.
- Check every clip frame by frame: right key, 5 fingers, end pose = rest pose. Morning variants = same clips with the MORN grade.
