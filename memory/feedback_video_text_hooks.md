---
name: feedback-video-text-hooks
description: How to derive and style the on-screen text hook overlay for the first 5s of a HeyGen/Reels video in this project
metadata:
  node_type: memory
  type: feedback
  originSessionId: abf86cdc-c6cd-4beb-990e-6701791ed9d8
  modified: 2026-09-23T16:51:07.301Z
---

When adding an on-screen text hook to the first 5 seconds of a video in this project, derive the hook text from the script's own Core Message / spoken hook line — don't invent a separate tagline. Example given by the user (2026-09-23) for the Mahnwesen script (spoken hook: "Claude hat unsere Mahnsoftware ersetzt..."): on-screen hook text **"So ersetzt Claude unsere Mahnsoftware"** — a short, punchy rephrasing of the same claim, not a verbatim copy of the spoken sentence.

**Why:** the text hook's job is to catch **silent/muted scrollers** — most Reels/Shorts viewers watch with sound off for the first few seconds — so the hook must carry the core value prop on its own, without relying on the audio at all. This is a permanent, general rule for every future video in this project, not a one-off for Mahnwesen: [[project_linkedin_generator]].

**Style (Instagram "Strong" caption preset look, locked spec, confirmed against a real IG editor screenshot 2026-09-23):**
- Bold white sans-serif text (Inter-Bold stands in for IG's own proprietary caption font — closest available match, not pixel-identical).
- **Each line gets its OWN independent black rounded-corner pill**, sized tight to that line's own text width — NOT one shared box stretched around every line. Multi-line text is passed as a literal `"\n"`, each segment renders as its own pill.
- Adjacent pills **slightly OVERLAP vertically (negative gap)** — confirmed explicitly wrong to leave a visible gap between them; IG's own pills touch/overlap, they read as one continuous "brick" of chips.
- Position: **upper third of frame**, ~8% from the top (raised once already from an initial 13% per feedback) — stays clear of the avatar's face, which sits center/lower in a 9:16 talking-head frame.
- One hook per video is the intro (first 5s, sound-off scroll-stopper). A single line is fine for a short claim; multi-line (via `\n`) for a longer one, per the worked example.
- Deliberately does NOT use the Superkind brand palette — this mimics a native platform caption sticker on purpose, not a branded overlay.

**Outro hook — now a DEFAULT for every video, not just the intro (confirmed 2026-09-23):** every video this pipeline produces also gets a second hook near the end, same visual style, reading **"Kommentiere:\n\<TRIGGERWORD\>"** — the trigger word is always that specific script's own trigger word (individual per video, set in the video-script skill), never a fixed word. Skip the outro hook only when the user explicitly says a specific video doesn't need it (e.g. it already has a custom outro, or a specific one-off render request).

**Tooling:** implemented in `/Users/pius/LinkedIn Generator/broll/` — `src/components/TextHookBadge.tsx` (the visual component, takes `startFrame`/`endFrame` so it works for both intro and outro), `src/compositions/HookOverlay.tsx` (generic composition, any source video), `composite-hook.mjs` (CLI: `--video`, `--text` (intro, use `\n` for multi-line), `--trigger WORD` (adds the outro hook), `--seconds`/`--end-seconds` to adjust durations, `--no-end-hook` to skip the outro for one video). Full usage documented at the top of that script and in the video-social-copy skill (wording) and the video-post-production skill (visual spec).

**How to apply:** when generating a script via [[heygen-video-generator]] (or fixing an existing video), always propose BOTH the intro hook text and the outro "Kommentiere: WORT" hook as their own labeled outputs — phrased as a standalone, sound-off-readable claim derived from the Core Message/hook, not just the first sentence of the spoken script verbatim. Don't wait to be asked for the outro hook going forward.
