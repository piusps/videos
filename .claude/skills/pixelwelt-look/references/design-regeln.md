# Pixelwelt design rules (measured)

Source: frame-by-frame breakdown of 3 @claudebyseb reels at 0.5 s steps, 2026-10-21 (`scripts/analyze_reel.py`).
Files: `~/Desktop/Superkind Videos/Referenzen/claudebyseb/<NN Thema>/analyse/` (sheets, shots.png, meta.json).

| Reel | Views | Length | Hard cuts | Median shot |
|---|---|---|---|---|
| 01 Jarvis | 91k | 51.5 s | 11 | 4.3 s |
| 02 Gericht | 58k | 35.5 s | 6 | 5.5 s |
| 03 Kosten | 1.9k | 38.4 s | 8 | 4.4 s |

The look is identical on hit and flop, so the look carries retention, the topic carries reach.

## 1. Two layers, one world per reel

- **3D voxel layer** (hook, hub, verdict): mascot as a large voxel block, camera always moving (push-in, orbit), depth of field, glow. Hard cuts are rare; motion replaces cuts.
- **2D pixel layer** (every step): a flat side-scroller stage. This is the "Pixelwelt" and the core of the format.
- Each reel has **one themed world** whose palette and props appear in both layers: Jarvis = night tech lab (navy + cyan), Gericht = courtroom (bottle green + parchment + gold), Kosten = supermarket "Token-Markt" (warm white + red).

## 2. The 2D stage

| Element | Rule | Measured |
|---|---|---|
| Background | flat, theme colour, faint pattern (hex grid, paper grain), soft vignette | night `#151F2C`/`#111723`; parchment `#E6E1D4` |
| Floor line | one horizontal line across the full width at **~64 % of the height**, 2-4 px, glowing in the accent colour | cyan `#B8E3E7`; on parchment a dashed hairline |
| Floor | below the line a darker band in the theme colour, slight perspective grid | navy `#0D1621`; green `#164533` |
| Mascot | **pixel sprite** (hard pixels, no anti-aliasing, 1-2 px dark outline) standing **on** the floor line, ~18-25 % of the frame width; it walks, hops, swaps facial expression (eyes ▪▪ → ^^ → glowing) | Clawd sprite `#D57657` with darker shade `#A06840` |
| Props | **stickers**: flat illustrations with a **white die-cut border** (6-10 px) and a soft drop shadow, slightly rotated (±3-6°), label strip in CAPS in a dark sans on white | "ALTER LAPTOP", "GEDÄCHTNIS", "RECHNUNG" |
| Slots | dashed outline boxes with a "?" that fill one by one with stickers, synced to the spoken word; a green check badge appears on completion | Jarvis step 1: 3 slots → laptop, Mac mini, Mietserver |
| Counters | odometer/scoreboard digits that roll up (`0000 → 1284`), boxed in the theme dark with a gold frame | "GESPRÄCHE", "SCHULDIG 5 : 7" |
| Stamps | big rotated word stamp in the accent colour with a rough edge ("EHRLICH") on the payoff word | |
| Speech bubble | white rounded bubble with an accent-colour border and a check icon for the payoff line ("Erledigt, Chef! ✓") | |

Each step builds **one** scene that fills up over ~4-6 s: empty stage → sprite enters → props pop in one by one on the spoken nouns → completion beat (check, stamp, counter). A new prop or state change happens **every 0.5-1 s**; the background never changes inside a step.

## 3. Step navigation

- **Step badge** top-left: a big digit (~11 % of the width) in a dark rounded square with a gold frame, rotated slightly.
- **Mini grid** top-right: a 3×3 (or n) map of all steps; done = filled, current = gold, upcoming = dim.
- **Hub screen** between steps (Jarvis "Bauplan"): the full grid large, current tile glows gold, done tiles get a check. It shows up 3-4 times per reel and gives the viewer the sense of progress.

## 4. Captions (identical in all three reels)

| Rule | Value |
|---|---|
| Position | centred, **~73 % of the height** (below the floor line) |
| Unit | one word per pill, pills appear **word by word on the spoken word**, max 3 per line, wrap to a 2nd line for compounds |
| Pill colours | two fills, gold `#C8A14C` (light top edge `#D6C596`) and bottle green `#335A3F`; text dark `#161921` on gold, cream `#F0E6C8` on green |
| Pill shape | rounded rectangle (radius ~25 % of the height), 2-3 px dark outline, hard drop shadow down 4-6 px, slight random rotation (±2°) and vertical offset |
| Font | heavy rounded grotesque (closest Google font: Rubik ExtraBold), sentence case, ~5 % of the frame height |
| Motion | each pill pops in (scale 0.6 → 1.05 → 1 in ~6 frames); the upcoming word can show as a faint ghost pill at 30-40 % opacity |
| Reset | the line clears at every phrase boundary (punctuation or 3 words) |

## 5. End card

1. A checklist sticker of all steps, every line ticked ("WOCHENEND-SETUP 1-9 ✓").
2. An Instagram comment field types the keyword letter by letter (`JAR|` → `JARVIS`), the send button pulses, hearts fly, a green "✓ gesendet" chip appears.
3. A paper plane with "DM" flies from the comment to the checklist, which drops into the mascot's hands; confetti.
4. Captions keep running underneath ("…schicke ich dir direkt").
Comment avatars use the viewer ("DU") or mascot-themed handles (`kunde_clawd`), never real people.

## 6. Pacing

- Hook (3D) 2-4 s, then step 1 starts with its badge by ~4 s.
- Steps last 3-6 s each; hub interludes 1-3 s.
- Something changes at least every **0.5-1 s** (prop, expression, counter, pill), even when the camera holds.
