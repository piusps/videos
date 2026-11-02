---
name: pixelwelt-look
description: Pixelwelt = the 2D pixel side-scroller reel look of @claudebyseb (mascot sprite on a glowing floor line, sticker props, gold/green word pills, step badges, keyword end card). Use it to analyze such a reference reel frame by frame, to turn one of our scripts into a Pixelwelt scene plan and Remotion render with Sir Token, or to check a render against the rules.
---

# pixelwelt-look

**Pixelwelt** is a format where each script step becomes **one small game level**: a flat themed stage with a glowing floor line, a pixel mascot standing on it, and props that pop in as stickers on the spoken nouns, until a check or stamp closes the step. Gold and green word pills run underneath. The look carries retention; the topic still has to carry reach (topics come from `superkraft-themen`).

The measured rules live in `references/design-regeln.md`. The Remotion building blocks live in `broll/src/components/PixelKit.tsx` (project `/Users/pius/LinkedIn Generator/broll`). The skill is written in English; everything on screen and every message to the user is in German.

Pick the branch that fits the request.

## A · Analyze a reference reel

1. **Get the file.** Instagram reel: open it in the in-app browser, take the `.mp4` URL from `document.documentElement.innerHTML` (regex `"(?:video_url|url)":"(https:\\/\\/[^"]+?)"`), download it with curl into `~/Desktop/Superkind Videos/Referenzen/<account>/<NN Thema Views>/original.mp4`.
   *Done when:* the mp4 plays, with audio, in its own folder.
2. **Break it down.** `python3 ~/.claude/skills/pixelwelt-look/scripts/analyze_reel.py original.mp4 analyse` (plain `python3`, no `-I`).
   *Done when:* `analyse/` holds `meta.json`, `sheet_*.png` and `shots.png`.
3. **Read every sheet.** Go through all contact sheets in order, then zoom into single frames for colours, sizes and positions. Write down what each element does over time, not only how it looks.
   *Done when:* every sheet has been viewed, and every claim has a timestamp.
4. **Disprove before declaring.** Before a new rule goes into `design-regeln.md`, look for a frame in the other reference reels that contradicts it. A rule seen in only one reel goes in as a reel-specific variant.
   *Done when:* each new or changed rule has been checked against at least one other reel.
5. **Update the rules.** Edit `references/design-regeln.md` in place (adding the reel to the table at the top) and add new building blocks to `PixelKit.tsx` when a rule needs one.
   *Done when:* the file reflects the new reel and nothing in it contradicts the frames.

## B · Turn our script into a Pixelwelt reel

Read `references/transfer-sirtoken.md` first. It maps every claudebyseb element to ours (Sir Token, topic board, one world per topic, 2.5D instead of voxel).

1. **Script and voice.** Final German script, then ElevenLabs TTS with word timings (`words.json`, voice and settings in the transfer file).
   *Done when:* `voice.mp3` and `words.json` are in `broll/public/<reel>/` and in the video folder under `Rohmaterial/`.
2. **Scene plan.** One row per script beat: time span, layer (2.5D or 2D stage), world/theme, props per spoken noun with their timestamp, completion beat (check, stamp, counter), Sir Token expression, SFX. Use the beat → scene recipe in the transfer file.
   *Done when:* every beat has a row, something changes at least every 0.5-1 s, and the hook ends and step 1 begins by ~4 s.
3. **Build.** A new composition in `broll/src/compositions/` that uses only `PixelKit` blocks plus the 2.5D Sir Token poses; register it in `src/Root.tsx`. Add a missing block to `PixelKit.tsx` rather than inside the composition, so the next reel can reuse it.
   *Done when:* `npx remotion still` renders the hook, one step and the end card without errors.
4. **Render and mix.** Full render, then `loudnorm I=-14:TP=-1` with ffmpeg from `broll/node_modules`.
   *Done when:* the final mp4 sits in `~/Desktop/Superkind Videos/<Datum> <Thema>/Versionen/` at about −14 LUFS.
5. **Check it** with branch C before sending anything to the user.

## C · Check a render against the rules

1. **Break the render down** with `analyze_reel.py`, the same as a reference reel.
   *Done when:* contact sheets for the render exist.
2. **Go through the checklist.** For each item, note the timestamp where it is met or broken:
   - floor line at ~64 %, the sprite stands on it, and props stay above it
   - captions at ~73 %, one pill per word, synced to the voice, never covered
   - step badge + mini grid on every step; a hub at least every 2-3 steps
   - every prop arrives on its spoken word; nothing static for longer than 1 s
   - no empty zone: wall (posters, neon, windows, shelves), floor in front of the line, the band under the captions and a foreground row are all filled and moving (user feedback 2026-10-21: "die Wand leer, der Boden leer")
   - the mascot sits in the world: contact shadow, floor reflection, rim light, idle breathing; never a flat cut-out
   - one world per reel; no real people or real product UIs; real logos only
   - end card: keyword typed, "✓ gesendet", ticked checklist
   *Done when:* every item has a timestamp and a verdict.
3. **Fix and re-render** every broken item, then run step 2 again.
   *Done when:* every item passes.
