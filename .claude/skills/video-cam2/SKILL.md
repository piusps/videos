---
name: video-cam2
description: OPT-IN ONLY, not part of the default Superkind reel pipeline (user decision 2026-09-29) — run only when the user explicitly asks for a second camera angle on a specific video. The second camera perspective - Cuts exactly one sentence after the hook to a visibly different camera angle (Wan 3.0 image-to-video from the avatar's approved Cam-2 still, lips on the original audio, 4-frame dissolves, no local fallback — skipped when Wan isn't possible), with audio-measured cut points. Also holds the rules for re-angling real footage (Runway Aleph via reangle-segments.mjs; Seedance rejects real people). Reads tightened.mp4 + broll-windows.json, writes tightened-cam2.mp4 + cam2-window.json to broll/runs/<topic>/. Use for "zweite Kamera", "Cam 2", "anderer Kamerawinkel", "Perspektivwechsel", never automatically inside a heygen-video-generator run.
---

# Video Cam 2 — opt-in only

**Not part of the pipeline anymore (user, 2026-09-29: "Cam 2 macht gar keinen Sinn").** The Wan clip never matched the twin 1:1 and the local fallback vibrated. Don't run this in a normal video run, don't suggest it, and don't build new Cam-2 stills. Use it only when the user explicitly asks for a camera switch on a specific video; the rules below are kept so that request is done right.

**Input (from `/Users/pius/LinkedIn Generator/broll/runs/<topic-slug>/`):** `tightened.mp4`, `broll-windows.json`.
**Output (same folder):** `tightened-cam2.mp4` (the tightened clip with the Cam-2 sentence swapped in), `cam2-window.json` (`[{startSec, endSec, mode, sentence}]`, passed to Stage B as `--no-zoom` so no push-in lands on the already-upscaled segment).

**Out of scope:** zooms, B-Roll, captions. This phase only swaps picture on one sentence; the original audio always stays.

## How it works when explicitly requested (original rule from 2026-09-28, E-Rechnung reel)

Exactly one cut to a visibly different camera angle on one sentence.

```
node scripts/cam2.mjs --video runs/<topic>/tightened.mp4 --out runs/<topic>/tightened-cam2.mp4 \
  --window-out runs/<topic>/cam2-window.json --avoid runs/<topic>/broll-windows.json \
  --still assets/cam2/<avatar>.png --mode auto
```
(`--sentence "…"` to force a sentence; the Studio app runs this as its "Zweite Kamera" step.)

- **Where:** the first sentence after the hook that is 1.6-3.4 s long (typically the pain line, e.g. "Dein Kunde kann sie zurückweisen, und du wartest auf dein Geld."), starting after 2.5 s, ending ≥8 s before the end. Not in the hook, not in a B-Roll window, not in the CTA.
- **Cut points are measured in the audio:** whisper-cli medium on a short excerpt around the sentence + the quietest 10 ms at each boundary. Never caption/`transcribe.mjs` timings; they were ~0.7 s late and put the first Cam-2 cut mid-word.
- **Look:** a fixed, approved start still per avatar, `broll/assets/cam2/<avatar>.png` (9:16, 1080×1920). Same room from a second camera position (Niklas: whiteboard on the right, cabinet only as an edge, torso slightly angled, head into the lens), same outfit, same red key light from frame-left. Built once with Seedream from the HeyGen still, `Gesicht-Referenz einzeln.png` and `Hemd-Referenz.png`; a square Seedream result is extended to 9:16 locally with wall on top. Framing must match the main shot's scale: he doesn't fill the frame, only a little wall above him. No still exists yet for a new avatar (e.g. Niklas Office) → skip Cam 2; building a still is a separate, user-approved step.
- **Clip:** Wan 3.0 (`alibaba/wan-3.0` on OpenRouter), image-to-video with the still as first frame, 9:16, 1080p, **sound on** so the lips form the real German sentence, duration = sentence + ~0.6 s (~$0.85 per 3 s clip, measured 2026-09-28). Prompt template lives in `cam2.mjs`. The speech span is time-fitted onto the original sentence; the original audio stays underneath.
- **Keep Wan's own brightness and colours.** The user rejected every darkened or "matched" grade ("Scheißbelichtung runtergepackt"). Only crop and scale, never grade.
- **Transitions:** 4-frame dissolves in and out; no hard jump.
- **No local fallback (user rule 2026-09-29, Postfach reels: "sieht mega kacke aus und vibriert die ganze Zeit"):** the local second camera (tighter angled crop with handheld drift) is rejected. If there's no approved still or no OpenRouter credit, **skip Cam 2 entirely** and render from `tightened.mp4` without `--no-zoom`. Never run `cam2.mjs --mode local` or `auto` into local. Say in the report that Cam 2 was skipped and why.
- **Limits:** the face is only as close to the twin as the approved still (Seedream never got it 1:1). Lips are tempo-fitted, not phoneme-synced; exact sync needs HeyGen Lipsync as an extra pass. The only guaranteed 1:1 route is a second real HeyGen look recorded from the side.

**Check:** contact-sheet the Cam-2 segment plus 1 s either side; the cut lands in a pause, the person is recognisably the same, the angle visibly differs, the dissolves are clean.

## Re-angling real footage (multi-switch, user rule 2026-09-25; still unproven in production)

Only when the user asks for several camera switches on a real-person or avatar clip.

- **Seedance can't do it:** BytePlus rejects any input video that may show a real person with a 400 at submit (`InputVideoSensitiveContentDetected.PrivacyInformation`), before any charge. Don't retry or work around it. (If ever used on non-person footage: the source goes in as a public HTTPS `video_url` in `input_references`, and **never** together with `frame_images`, or OpenRouter silently drops the video reference; that cost $2.09 for a random stranger on 2026-09-25. Billing at plain `video_tokens` instead of `video_tokens_with_video_input` means the reference was ignored.)
- **Use `broll/scripts/reangle-segments.mjs`** (default `runway/aleph-2` on OpenRouter): one job per segment, one angle each, prompts ≤1000 chars, frame-accurate cuts, original audio underneath, brightness/colour check per segment. `--only N` to test one segment first; `--reuse-raw` to re-assemble without new costs; `--upload-tmpfiles` only with the user's OK (tmpfiles links expire after ~5 min, so upload right before submitting).
- **Placement:** max 2-3 switches per ~9 s, each cut in a real speech pause right before a new beat's first word (word timestamps + loudness envelope). Vary the actual direction, not just the zoom: e.g. 60° from the subject's right at eye level, high-angle wide from 45° left, low-angle frontal medium close-up with eye contact for the core message.
- **Aleph prompt:** the camera instruction leads and dominates, one short sentence ("Change the camera angle: low-angle medium close-up …"), plus only "Keep the location, dialogue and actions identical." A long "keep everything identical" lock block made it change nothing (same angle, a chair removed, $1.40 wasted). Refer only to "the person in the reference video", never describe their looks (invites a lookalike).
- **Aleph facts (2026-09-25):** rejects clips <2 s (the script pads and trims back); bills ≥5 s per job (~$1.40 even for 3 s); returns 612×1088 at the input fps, ≤720p/24 fps, identity and timing kept exactly. Set `duration` to the full clip, `generate_audio: false`, put the original audio back.
- **Locks enforced in post, not in the prompt:** exposure/brightness, lighting, colour grade, white balance, skin tones, contrast, sharpness, resolution (upscale to native 1080×1920, 25 fps), grain, compression. No angle may look brighter, softer or more "AI" than the others. First and last frame of each segment must match the original at that timestamp (pose, hands, mouth, head), nothing mid-motion at a cut: it should feel like one continuous multi-camera take. `FINAL_RUBRIC` item 4b checks this.
