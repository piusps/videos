---
name: video-broll-explainer
description: Alternative Phase 6 of the Superkind reel pipeline, the "Explainer" B-Roll style copied from the @bradfordmarais reference reel (user decision 2026-09-29) — light-grey whiteboard, isometric tiles/cubes, tree diagrams with dashed connectors, dark chips, counters, card grids, and a hard 50/50 split with the speaker in the bottom half. Built in Remotion with ExplainerKit (broll/src/components/ExplainerKit.tsx); each clip embeds the speaker from the tightened avatar so it drops into render-pipeline.mjs like any B-Roll. Writes broll-N.mp4 + broll-windows.json to broll/runs/<topic>/. Use for "Explainer-Stil", "B-Roll wie im Referenz-Reel", "Split-Screen B-Roll", "isometrische Grafiken", or whenever the user picks this style for a video. The glass style stays in video-broll and is NOT replaced by this skill.
---

# Video B-Roll, Explainer style (alternative Phase 6)

**Why this exists:** on 2026-09-29 the user sent a reference reel (instagram.com/reel/DdWcjF7Ky__, @bradfordmarais, 57k plays, 2.7k comments) and asked to adopt its B-Roll/animation style **completely, in a new skill so the working glass style (`video-broll`, `GlassKit.tsx`) is not overwritten**. Pick this skill or `video-broll` per video, never mix both styles in one reel.

**Input:** `broll/runs/<topic>/script.txt`, `captions.json` + `tightened.mp4` (word timings from `video-post-production` Stage A).
**Output (same folder):** `broll-1.mp4 … broll-N.mp4`, `broll-windows.json`, a contact sheet per clip, one new file `broll/src/compositions/<Topic>Explainer.tsx`.
**Out of scope:** captions (a separate caption reference is pending from the user; captions stay owned by `video-post-production`), zooms, music.

Reference material kept locally: `broll/runs/launch/ref-broll/ref.mp4` + `sheet-1..5.jpg` (frame every 0.5 s, timestamped). Look at the sheets before building a new video; they are the ground truth, not this summary. Style test that passed: `broll/src/compositions/ExplainerDemo.tsx` → `runs/launch/explainer-test/`.

## 1. The system (measured on the reference, 50 s reel)

**Four screen modes**, alternating:

| Mode | Share of runtime | What it is |
|---|---|---|
| **Full board** | ~20 % | Light-grey whiteboard fills 9:16. A concept is introduced: heavy title builds word by word, an isometric object pops in under it. Usually 1-2.5 s, then it turns into a split. |
| **Split** | ~30 % | Hard horizontal cut at y = 960: board on top, speaker (tight head-and-shoulders crop) at the bottom. The diagram keeps building in the top half. 3-10 s. |
| **Speaker + overlay** | ~10 % | Full-frame speaker with one element over the upper third: big white title, a floating app-icon card, a dark UI window. See rule 6. |
| **Full speaker** | ~40 % | Plain talking head, never longer than ~5 s in one stretch. |

**Pacing:** something new appears on the board every **0.5-1 s** (next word of the title, next card, next connector, counter ticking). A board concept lasts 3-10 s in total (full → split), then the speaker gets a clean 2-5 s. Board/split together ≈ 50 % of the runtime.

**Look:**
- Board `#EDEDED` with a faint radial light in the middle, no texture, no glow orbs.
- Titles: heavy sans (Inter Bold, tracking −4.5 %), dark grey `#2A2A2A` with a white 2 px highlight underneath (slightly embossed), 110-130 px full-frame, ~0.8× in split. Always 1-3 words: the concept's name.
- Objects: **isometric** tiles (flat rhombus platform with an icon on top) and cubes (icons on the faces), 3-tone shading, soft drop shadow, idle float of a few px. Reference colour is yellow; ours default to Superkind orange (`ex.tileTop/Left/Right` in the kit, one-place swap).
- Diagram parts: dashed grey connectors that draw themselves, small **dark chips** (`#2B2B2B`, orange icon, light text), a tinted **row card** with white rows that stagger in, dark **card grids** (thumbnails/tiles popping in with 0.03-0.06 s stagger), dark **counter pill** that counts up, **status badge** with a green check, low-contrast gears turning in the background, dark chat bubble whose green lines type in.
- "Done/active" state: the cube's top face turns green with a green halo (`glow`).
- Camera: when a diagram grows, the whole board pans up / pushes in slightly instead of shrinking elements.

**Motion:** springy pop (scale 0.6→1 with a small overshoot + blur-to-sharp + small rise), stagger by index, constant idle motion (float, gears, counters). This deliberately differs from the glass style's "no spring" rule; it only applies inside this skill.

## 2. Hard rules

- **One beat, one concept, shown literally.** The title is the thing being said ("Company Brain", "Über 20 Unternehmen"), the objects are its parts. Never a generic decoration clip, never reused across videos (same rule as `video-broll`).
- **The speaker panel shows the face.** Crop is a tight head-and-shoulders; nothing of the background wall/projector may show at the panel's top edge. Face point per avatar: Niklas Office = `{x: 0.67, y: 0.51}`, scale 1.55, face at 30 % of panel height (kit defaults), so the fixed caption line sits on the chest, not the face. For another avatar, grab one frame (`ffmpeg -ss 5 -i tightened.mp4 -frames:v 1 f.png`), measure the face point, pass `focus`/`scale`.
- **No real product UI.** The user doesn't want superkind's interface shown (copy risk). Stylise: chips, cards, bubbles, cubes, never a screenshot of the app.
- **Text is German, short, and correct.** No English labels from the reference ("Layer 1", "Instructions") unless the script says them.
- **Content from frame 0:** the first title word is already popping at frame 0 (`at={-0.15}`), no empty board on a hard cut.
- **Rule 6, speaker overlays:** the reference puts titles/cards over the full-frame speaker. That conflicts with the standing rule from 2026-09-24 ("never text/icons over avatar footage"). **Use the overlay mode only after the user confirms it for this style**; until then, use full board / split / full speaker only.
- **Never rendered by HeyGen.** Remotion only; Seedance only for cinematic shots Remotion can't draw (see `video-broll` §2b), still bound by the look above.

## 3. ExplainerKit API (`broll/src/components/ExplainerKit.tsx`)

| Component | Use |
|---|---|
| `useT()` | `t`, `pop(sec)` (spring 0→1 from `sec`), `ramp(a, b)` (eased 0→1 between seconds) |
| `Split split={0..1} avatar={…}` | Board full-frame; speaker panel slides up to the bottom half as `split` goes 0→1. `split={1}` = hard cut straight into a split. |
| `Place top scale [left]` + `lerp(a, b, split)` | Positions a group; animate `top`/`scale` with `lerp` to move content from full-board into the top half (0-960) when the split comes in. |
| `Title text at size` | Word-by-word heavy title |
| `IsoTile icon`, `IsoCube top left right glow` | Isometric objects (`glow` 0→1 = active/green) |
| `AppIcon icon / logo` | Rounded 3D app tile (orange, white icon or the Superkind logo) |
| `Chip text icon big`, `StatusBadge text`, `CounterPill from to p suffix icon` | Dark labels, green-check badge, counting pill |
| `RowCard rows at step` | Tinted card whose rows stagger in (card grows with them) |
| `Connector from to p curve` | Dashed line drawing itself (board coordinates) |
| `CardGrid items cols at` | Dark panel, grid of tiles popping in |
| `PathDraw d p flags`, `Gear`, `ChatBubble p` | Winding road with flags, background gear, typing bubble |
| `Camera keys` | Pan/zoom the whole board over time |
| `FullSpeaker avatar` | Full-frame speaker (overlay mode, rule 6) |
| `Icon name` | 24×24 stroke icons: check, shield, book, bolt, mail, building, users, user, brain, euro, message, file, globe, lock, target, flag, search, code, info, clock |

`AvatarSource = { src, startSec, focus?, scale? }`. `src` is a file in `broll/public/`.

## 3b. App click paths (ScreenFlow, test built 2026-09-29)

For "so klickst du dich durch <App>" beats: a fake screen recording built from **real screenshots**, never a redrawn UI.
1. Describe the path in `runs/<topic>/flow-steps.json` and capture it: `node scripts/capture-flow.mjs --steps … --out runs/<topic>/flow` (headless Chrome, retina, exact element rects + typed-text widths in `flow.json`). **Every non-GET request is blocked**, so fake data never gets submitted (the Superkind waitlist POSTs on "Weiter"; the blocker caught it). Use placeholder data only (Max Mustermann, max@firma.de). Hide cookie banners locally with an `eval` step; never click consent. Leave the page's own content as it is (the user wants e.g. the 91/100 counter left visible).
2. Copy the PNGs to `public/<topic>/`, build the beat with `src/components/ScreenFlow.tsx`: `screens` (which shot from when), `typing` (character-wise reveal of the filled shot + caret), `cursor` keypoints (`click: true` → press + orange ring), `highlights` (orange focus ring on the element to use), `camera` (follow the cursor, zoom 2.0-2.25 so text reads on a phone; shots are 2× so ≤2.25 stays sharp). Put it in the split's top half (`box {x:40, y:64, w:1000, h:840}`).
3. Time the final click onto the spoken action word ("Senden"), add a quiet `sfx/heygen/click.mp3` (volume ~0.22) per click via `--sfx`.
Logged-in apps (Claude, Outlook …): the user logs in or supplies screenshots; blur personal data. Reference implementation: `src/compositions/ShowcaseTest.tsx` → `runs/showcase/Showcase Test.mp4`.

## 4. Workflow

1. **Plan the beats** from `script.txt`: pick the sentences that introduce a *concept, a number, a list or a structure*; those get a board. Aim for ~50 % board/split over the reel, full speaker for the hook sentence, emotional lines and the CTA. Write the plan as a table (sentence → mode → title → objects) and show it to the user before building when it's a flagship video.
2. **Stage the speaker:** `cp runs/<topic>/tightened.mp4 public/<topic>-tightened.mp4` (the clips read the avatar from there; `render-tightened.mp4` gets overwritten by every pipeline run, never point at it).
3. **Pick the windows** on the **tightened** timeline from `captions.json` word boundaries: 3-10 s per board beat (longer than glass clips, because the split keeps the face and lips on screen), at least 2 s of plain speaker between two windows, none in the first sentence or the CTA.
4. **Build** `src/compositions/<Topic>Explainer.tsx`, one component per beat, props `{ seconds, avatar }` with `avatar.startSec = window.startSec` (this keeps the embedded lips in sync with the voice track). Time every pop to the word it illustrates (word start − window start). Register each in `src/Root.tsx` (1080×1920, 25 fps, `calculateMetadata` from `seconds`), like the `ExplainerDemo*` entries.
5. **Render** `npx remotion render src/index.ts <Id> runs/<topic>/broll-N.mp4 --crf=10 --jpeg-quality=100`, write `broll-windows.json` (`[{startSec, endSec, file, captionZones}]`). With vision captions every window gets `"captionZones": [{"y": 0.5, "pill": true}]`: the caption sits **centred at 50 %** (the split seam) for the whole window (user feedback 2026-09-29). **Keep board content out of the caption band 880-1060 px** in full-board phases, and keep split boards above ~880 px. in split phases the band falls on the speaker's chest (the kit puts the face at 30 % of the panel), so the board itself is free.
6. **Hand over** to `video-post-production` Stage B unchanged: `render-pipeline.mjs --broll broll-windows.json` lays the clips full-frame and muted over the talking head, the voice keeps coming from the base track, and because each clip embeds the same frames of `tightened.mp4`, lips stay in sync. The push-in zooms don't apply inside a clip; set a `--no-zoom` window if a zoom keyframe would land mid-clip and look like a jump at the cut.

## 5. Check every clip

Contact sheet at 0.4 s steps (`ffmpeg -ss <t> -i broll-N.mp4 -frames:v 1` per step, tile with PIL; the Remotion-bundled ffmpeg lacks the `tile`/`drawtext` filters, run it with `DYLD_LIBRARY_PATH=node_modules/@remotion/compositor-darwin-arm64`). Check:
- It shows exactly the sentence in its window; title spelled right; German only.
- Frame 0 already has content; something moves or appears every 0.5-1 s.
- In split frames: nothing in the board is hidden behind the speaker panel (content stays in y 0-960), the face is centred, no wall/projector strip at the panel top.
- No empty containers (row card grows with its rows), nothing clipped at the frame edges.
- Side by side with `runs/launch/ref-broll/sheet-*.jpg`: same density, same scale of titles/objects.

A failing clip is rebuilt before handing on. New feedback on this style goes into this file (and `broll/scripts/lib/rubrics.mjs` if the automated QC should learn it), not into `video-broll`.

## SFX (user rule 2026-09-29)

SFX only where a B-Roll/animation is on screen, **never on the talking head**, and every sound sits on a visible event of the clip (element pops in → soft `ui-pop`, click → `click`, success badge → `ui-check`, cut into a full board → light `whoosh-airy`, phase change → light `whoosh-quick`, big reveal → `chime-asc`). Use many where it helps (every pop), volumes 0.1-0.2. Generate them from the same cues as the visuals (see `runs/launch/build_launch.py`), never placed by ear mid-word.

## Real marks (user request 2026-09-29)

Chips take `leading={<BrandLogo name="Outlook" />}` (Gmail/E-Mail, HubSpot, SAP, Datev from Simple Icons CC0; Slack, Teams, Outlook drawn in brand colours) or `leading={<Flag country="de" />}` (us, cn, de; same treatment for every country). Message senders get `FaceAvatar seed={n}` (illustrated, not real people), never one shared placeholder colour. All in `src/components/BrandMarks.tsx`.

## Open decisions (ask the user once, then record the answer here)

- Tile colour: Superkind orange (current default) or the reference's yellow.
- Speaker-overlay mode (rule 6): allowed for this style or not.
- Caption look: decided 2026-09-29, vision captions (see `video-post-production`), with the seam pill in split segments.

## SFX variety (user rule 2026-10-01)
SFX only on B-roll events, and never the same sample on every event. After writing `sfx.json`, run `node scripts/vary-sfx.mjs --in runs/<topic>/sfx.json` (rotates pop/whoosh/ping/check/click through `sfx/heygen/variants/`, no file twice in a row, max 3× per reel). No `whoosh-airy`, no sub-hits.
