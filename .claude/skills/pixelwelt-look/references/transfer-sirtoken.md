# Transfer: claudebyseb format → our reels

Read this in branch B (scene plan). It maps every element of `design-regeln.md` to what we can produce locally with Remotion, without HeyGen and without paid video models.

## Element map

| claudebyseb | Ours | Built with |
|---|---|---|
| Clawd pixel sprite | **Sir Token** pixel sprite (gold coin, top hat, monocle, moustache); expressions `normal`, `happy`, `shocked` | `PixelMascot` / `sirTokenRows()` in `broll/src/components/PixelKit.tsx` |
| 3D voxel layer (hook, hub, verdict) | **2.5D layer**: the cut-out 3D Sir Token poses (`broll/public/sirtoken/*.png`) large in frame, with a slow push-in, parallax background and glow. A real voxel render can't be made locally, so this layer only has to *feel* like a second depth, not imitate voxels | Remotion `Img` + `interpolate` on scale/translate |
| "Bauplan" hub (3×3 grid) | **topic board**, named after the trophy: TRAININGSPLAN, BEWERBUNGS-SETUP, APP-BAUPLAN … with one tile per script step | `MiniGrid` (corner) + a large hub version of the same grid |
| one world per reel (lab, court, market) | **one world per topic**, derived from where the daydream happens: gym, office, kitchen, stage, desk. Pick or add a theme in `THEMES` | `Stage` + `THEMES` |
| props as stickers | stickers of the script's nouns (emoji or simple SVG inside a white die-cut card); real logos only from `broll/public/logos` | `Sticker`, `Slot` |
| odometer, stamp, speech bubble | the same, filled with the topic's numbers (price of the gatekeeper, number of agents, minutes) | `Odometer`, `Stamp` |
| end card with keyword | comment field types our keyword, checklist of the topic board ticks off, "✓ gesendet" | `CommentCard`, `Checklist` |
| captions (gold/green pills) | identical, German, Rubik ExtraBold | `PillCaptions` with ElevenLabs word timings |

## Beat → scene recipe

For each script sentence, decide one row:

| Script beat | Scene |
|---|---|
| Hook (price of the gatekeeper, the daydream) | 2.5D layer: big Sir Token pose + price sticker → stamp "0 €" / "GRATIS" |
| "Step N: …" | 2D stage: `StepBadge` N + `MiniGrid` → Sir Token walks in → one `Slot` per spoken noun fills → check/stamp on the payoff word |
| Multi-agent or "many at once" beat | row of 3-4 slots that fill in quick succession plus an `Odometer` counting up |
| Between every 2-3 steps | 1-2 s hub: the topic board large, the finished tiles ticked, the next one glowing gold |
| CTA | `CommentCard` with the keyword + `Checklist` of all steps + Sir Token `happy` |

## Fixed values for our reels

- Canvas 1080×1920, 30 fps; floor line at `FLOOR_Y` (1230), captions at `CAPTION_Y` (1400). Keep stickers and badges above the floor line and away from the caption band.
- Voice: ElevenLabs "Keno - Casual Radio Host" `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, speed ~1.15, `/with-timestamps` → `words.json`.
- Music bed quiet (~0.08-0.1); SFX: pop on every sticker, light whoosh on stage changes, stamp sound on stamps, chime on checks. Light UI whooshes only, no heavy hits.
- Loudness: final mix `loudnorm I=-14:TP=-1` with ffmpeg from `broll/node_modules`.
- One folder per video: `~/Desktop/Superkind Videos/<Datum> <Thema>/` with `Versionen/`, `Rohmaterial/`, `cover.jpg`, `caption.txt`.

## Density and motion (learned 2026-10-21, trainer reel)

The first pass had a filled wall but an empty floor, and the user rejected it. Reference build: `broll/src/compositions/SirTokenPixelReel.tsx`.
- **Side-scroller:** one station per beat, 1080 px apart, the camera pans between them; 4 parallax layers (wall 0.55, mid 0.8, floor 1.0, foreground 1.3) so something always moves.
- **Fill every band:** wall props + neon + bunting; a mid layer (racks, cooler, bench); floor props in two rows (in front of the line and under the captions); a dimmed foreground row at the bottom.
- **Constant ambient motion:** dust, a twinkling skyline, flickering neon, an LED chaser on the floor line, camera drift and breathing between punch zooms.
- **Dopamine layer:** Sir Token collects coins on every pan, hits ? blocks that release the stickers, a HUD coin counter, confetti and coin bursts on payoffs.
- **Sir Token:** use `SirTokenHD` from `broll/src/components/PixelSir.tsx` (shaded coin, poses, walk cycle, shadow, reflection, rim light), not the old `PixelMascot`.

## Known gaps

- Sir Token is code-drawn (`PixelSir.tsx`, 46×50 grid). Replace it with a hand-made pixel sheet once one exists.
- The real 3D voxel look would need a paid video or 3D model; the 2.5D layer is the agreed substitute until the user says otherwise.
