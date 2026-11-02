# Phase 6: Schnitt & Sync

Ziel: Bild, Hände, Cursor und Ton rasten an denselben Frames ein. Bewegung ist motiviert, nicht dekorativ. Ausgabe: Render `vN-raw.mp4` → `vN.mp4` (Loudnorm).

## 6.1 Sync-Regeln (frame-genau, 25 fps)
1. **Tastendruck:** Finger trifft Taste (Kontakt-Frame aus Phase 4) = Klick-SFX = Pill erscheint. Toleranz ±1 Frame.
2. **Trackpad-Klick:** Finger drückt = Cursor-Klickring oben = Klick-SFX.
3. **Trackpad-Gleiten:** Der Mensch-Cursor bewegt sich nur, solange sich die Hand unten bewegt, gleichzeitig und in dieselbe Richtung (POV: Finger nach rechts = Cursor nach rechts). Ruht die Hand, ruht der Mensch-Cursor.
4. **Agent-Cursor:** bewegt sich nur in Arbeitsphasen, nie während die Person spricht. Unten ruhen die Hände dann, oder die Person ist weg bzw. lehnt sich zurück (Modus C).
5. **Captions:** Wort-Timings aus `words.json`, Chunk-Pop-in, genau mittig auf der Naht.

## 6.2 Zooms (oben) und Punch-ins (unten)
- Oben gibt es pro Arbeitsschritt höchstens einen Push-in (1,0 → 1,15–1,35) auf das Ziel, wo der Cursor gerade klickt. Dazwischen langsam zurück. Nie zoomen, während nichts passiert. Nie auf einen Bereich zoomen, der gleich aus dem Bild wandert.
- Während der Frage (hört zu) gibt es oben **keine** Kamerafahrt, höchstens ein ruhiges Driften (≤ 2 %). Die Ruhe erzählt das Zuhören.
- Unten nur ein kurzer Punch-in (+15–20 %, 0,2 s) auf den Tastendruck/Klick, Ursprung auf dem Finger. Danach zurück auf die Totale, damit das Scharnier an der Naht bleibt. Ein Punch-in darf die Tastaturkante nicht unter die Naht schieben.
- Oben und unten nicht gleichzeitig in gegensätzliche Richtungen zoomen.
- Energie lieber über **Schnitte** als über Zooms: Ein harter Cut auf ein Makro wirkt stärker als jeder digitale Zoom.

## 6.3 Schnittrhythmus und Übergänge
- Hook: 3–5 Inserts à 0,3–0,8 s auf Musik-Beats, dann harter Cut in den ersten Split auf den Tastendruck.
- Szenenwechsel gestalten:
  - **Laptop zuklappen** (KI- oder Stock-Clip, Vollbild) → Schwarz/Uhr → **aufklappen** am Morgen (Match-Cut auf den Deckel).
  - **Wischer** über eine Textur (Holz, Fensterlicht) wie bei Clicky.
  - **Match-Cut** auf die Hand: Abend-Hand legt sich ab, Morgen-Hand kommt an derselben Stelle ins Bild.
- Mindestens ein Moduswechsel (A/B/C/D) alle 4 s.
- End-Klammer: dasselbe Makro wie im Hook, dann End-Card.

## 6.4 Render
```bash
cd broll && npx remotion render <Comp> runs/sd-<slug>/vN-raw.mp4 --log=error --concurrency=8
node_modules/ffmpeg-static/ffmpeg -i runs/sd-<slug>/vN-raw.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k runs/sd-<slug>/vN.mp4
```
Vorschau mit `--scale=0.5`. Nach jedem Render einen Kontaktbogen der unteren Hälfte (0,25 s) an jedem Sync-Punkt anschauen.

**Gate:** Jeder Sync-Punkt der Shotlist ist im Bogen frame-genau getroffen. Kein Agent-Cursor während einer Frage. Zooms haben ein Ziel.

## 6.5 Hands during the work phase (Pius feedback v2→v3)
While the agent clicks, **no hand may lie on the trackpad or keys**, otherwise it looks like the person is doing it themselves. Order: question (hands on the keyboard, still) → "denkt" → hands leave (person leans back) → agent works → hands come back → human click on the trackpad in sync with the cursor. The human cursor only shows up once the hand is there, sits on the button and only clicks.

## 6.6 Control logic and pacing (Pius brief v4, 2026-10-21; replaces 6.5 where it conflicts)
- Exactly ONE dictation activation per scene: the finger presses the real mic key (F5), the camera follows the finger to the key (digital follow-move to ~1.75×, then back to the wide shot). Then both hands lie completely still on the palm rest, NOT on keys or trackpad. No typing, no trackpad clicks by the human.
- The only other manual input is an **Enter press for approvals**: approval button on screen + "return ⏎" key cap, bottom cut to a keyboard close-up, finger hits Return on the same frame the button turns green.
- Strictly one task at a time: instruction → acknowledgement → visible execution → result → only then the next task. Steps appear in the agent panel only once they start; the panel docks small at the top right so the current task window has the stage.
- Every window must belong to the current action (e.g. the SAP window opens on the frame "Kundenauftrag anlegen" starts). No simultaneous pop-ups, no notifications without a reason.
- No frustration reaction from the person (no swearing, no inserts). The hurdle (e.g. a missing SAP field) is solved by the agent.
- Top camera: smooth push-in per step on the current element (cursor-follow), then back to the wide shot. Calm overall: each result stays ≥ 1.5 s, lists ≥ 4 s.
- Hook insert dropped: the film opens on the lid opening.
- Variation shot during long work phases: person sitting upright and relaxed, hands on the table, watching (no feet on the desk).
- End card is the top layer (zIndex 100, above grain/overlay/captions); once fully opaque, stop rendering the split, so the outro is pure white.

## 6.7 Own keyboard footage and toggled dictation (Pius, 2026-10-21; replaces the HeyGen hand clips)
- Desk hands come from Pius' own iPhone recording (template: IMG_7427, tripod top-down). The same take serves evening AND morning; only the grade differs (evening warm/dark, morning cool/bright).
- Prep: HLG→SDR tonemap, crop the laptop without the tripod (keyboard + palm rest, hinge at the seam), dark gradient over the bottom ~28 % against tripod legs. Return sits at the right edge: shift the approval clips' crop right so the index finger on ↩ is fully visible.
- **Dictation key toggles:** 1st press = "hört zu" + listen sound; **2nd press right after the last spoken word** = dictation over → pill switches to "denkt …" on the same frame (key + tick). Every dictation therefore has two presses. No speech after the 2nd press.
- Measure contact frames on a 25 fps sheet of the key region (thumb covers the key label), cut each clip so the contact lands exactly on the T value, ±1 frame. Check on the render with a sheet around every press.
- Rest phases: ping-pong loop from a calm stretch, ending on the frame where the next press clip starts (no jump).
- (Pius round 5) Crop off everything below the laptop's front edge (tripod legs start right there): solid black from the edge down, never just a soft fade. Expose the keyboard lower and compress highlights; it should not shine, just be there.
- Masters at native crop resolution (e.g. 1710x1520), not 1080x960: the 1.75× follow zooms stay sharp.
- Enter for approval comes early: the first right after the agent's last word, the second already on "freigeben" (Pius presses before the sentence is over).
- Night transition from real footage only (own recording, e.g. IMG_7428): Touch ID lock (screen goes black on the press) → close the lid → closed lid, evening grade melting into morning grade → open the lid → Touch ID unlock (lock screen 07:58 disappears, desktop on the press). Never cut from own footage to AI/stock MacBooks, never a stranger as a variation shot. Align a second recording to the first crop (scale/offset from key positions). Skip stretches where the arm/sleeve crosses the frame.

- (Pius v7) Enter-Sync: Der Finger LANDET in IMG_7427 bei 33.32 s auf ↩, drückt aber erst ~0,55 s später (Clip own-ret-m: Landung 1,25 s, Druck 1,80 s). Immer den sichtbaren Druck-Frame (Finger flacht ab) messen, nicht die erste Berührung. Button-Wechsel, Key-SFX und Druck im selben Frame; kein Cursor-Klick auf den Button, die Freigabe kommt nur von der Taste.

## v9: Film-Grade unten (Pius, 2026-10-21: „Hollywood-Filter, aber sachte“)
Wird auf den gesamten Desk-Container angewendet, nicht pro Clip (`FilmGrade` in SuperkindDesk.tsx):
- `filter: contrast(1.07) saturate(0.86) brightness(0.98)`
- Soft-Light-Verlauf: Highlights warm (oben rechts), Schatten blaugrün (unten links), Deckkraft 0,55.
- Schwarzwerte leicht angehoben (lighten 0,12).
- Tiefenunschärfe am oberen und unteren Rand (backdrop blur 2,6 px mit Maske).
- Vignette höchstens 0,32.
- Grain-Deckkraft 0,13.
- Hook und erste Szene laufen auf einem durchgehenden Ruhe-Clip, kein Schnitt in Sekunde 1–3.

## v10: Erster Satz = Agent, B-Roll-Ende sauber (Pius, 2026-10-21)
- Kein Rückblende-Hook mehr mit Florent-Satz: das Video startet direkt mit Superkinds Satz („Ich hab gemerkt: in den letzten drei Wochen …“). Ergebnis-im-ersten-Frame liefert die 3×/4×-Karte.
- Nach dem Enter darf die Hand NICHTS mehr drücken. Rohclips nach dem Key-down bis zur Ruhephase schneiden und danach nur die ruhige Spanne ping-pongen (own-ret-m9 = own-ret-m7 0–3,7 s + Ping-Pong 3,0–3,7 s). Bei jedem neuen Return-Clip das Ende auf zufällige Tastendrücke prüfen.
