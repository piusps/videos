---
name: video-avatar-render
description: Phase 4 of the Superkind reel pipeline — renders the talking-head avatar in HeyGen and nothing else. Writes the Voice Director cues, the Avatar Performance cues and the single motion prompt (living head/face, varied realistic gestures; calmer seated variant for the Office avatar), submits via the HeyGen MCP connector with the locked Superkind defaults (Niklas / Niklas Office digital twin, cloned voice, Avatar V, 9:16, 1080p, cover, SRT sidecar, no music, no B-Roll), downloads the result and checks the raw audio for spelled-out words. Reads script.txt, writes avatar.mp4 + heygen.json + rawcheck.txt to broll/runs/<topic>/. Use for "render das Video in HeyGen", "Avatar neu rendern", "Motion Prompt", "Voice Director Cues", or as step 4 of heygen-video-generator. Look per format (since 2026-10-01) - normal videos on both accounts = blue look, satire = seated calm look (Niklas Office), @florentgpt GPT-N = look "Niklas gpt normal" c4f527e4… (no cap; the cap look 98e4ba1a is banned since 2026-10-05), GPT-S cap backwards = 57ae6dc3…; see "Looks per format".
---

# Video Avatar Render — Phase 4

**Input:** `/Users/pius/LinkedIn Generator/broll/runs/<topic-slug>/script.txt` (passed `video-script`'s gate).
**Output (same folder):**
- `avatar.mp4` — raw HeyGen render, untouched.
- `heygen.json` — `video_id`, avatar look, engine, raw duration, credits used, `subtitle_url`.
- `rawcheck.txt` — raw-audio transcript + verdict of the spelling check.
- Voice Director cues and Avatar Performance cues go into the chat report (and into `texte.txt` if the user wants them kept).

**Out of scope:** everything after the raw render (silence cut, B-Roll, captions, music) and anything visual laid over the avatar. HeyGen renders **only the avatar**.

## Spending rule

**Pre-render check (Pius, 2026-10-05, after ~135 wasted credits):** before every render (1) confirm the topic has no existing run dir in `broll/runs/` and no `publish.json`/post for it (don't trust the radar/backlog status alone), (2) confirm the look ID is the one for the format (GPT-N = c4f527e4; the cap look 98e4ba1a is banned) and open its preview image; if a look name Pius mentions isn't found, ask instead of guessing.

HeyGen credits are real money. In autonomous mode (`heygen-video-generator`) the spend is pre-approved **only after the script gate passed**. Outside autonomous mode, never render before the user approved the script. Never re-render a video that already has a `video_id` in `heygen.json`; download that one instead.

**Connector only (user decision 2026-09-29):** render and upload through the HeyGen MCP connector (`create_video_from_avatar`), which bills the subscription plan credits. Never render with `HEYGEN_API_KEY` from `broll/.env`: the API bills a separate USD wallet at roughly twice the cost. The key may be used for free read-only checks (e.g. `GET /v2/user/remaining_quota` before/after to measure credits).

**Measured cost (2026-09-29):** Avatar V digital twin, 1080p, 9:16 ≈ **0.82 plan credits per raw second** (109 words → 36.5 s raw → 30 credits; Mahnwesen 53.4 s → 44 credits).

## 1. Voice Director cues (for the user's manual use)

One short line per script beat in natural language ("Hook: nüchtern, dann kurzer Energie-Schub" / "Schritte: ruhig, erklärend" / "CTA: warm, einladend, kein Verkaufsdruck"), plus the reminder that this only works in HeyGen's editor via the `/` Voice Director menu with the Panda Voice Engine + a compatible voice. **The API/connector can't send these**, so they don't affect the render; they're reference only.

## 1b. Sprechmelodie briefen (Henri 2026-10-20, Pflicht vor jedem Render)

Feedback: eine normale Sprachnachricht hat „immer ein bisschen melodischen Flow“, unsere Avatare klingen „eher wie ein Block … ultra robotisch“. Wie ein Mensch spricht: **bei Aufzählungen und Einschüben schneller, vor einem neuen Gedanken eine kurze Pause, am Satzende geht die Stimme runter.** Das Absinken der Stimme ist ein Render-Thema; der Schnitt (`video-post-production` → „Der Schnitt folgt dem Transkript“) kann es nur erhalten, nicht erzeugen. Da der Connector keine Voice-Director-Cues schickt, wird die Melodie über den Text gebrieft, den die TTS bekommt:
- **Satzenden mit Punkt, nicht mit Komma:** lange Komma-Ketten in kurze Sätze teilen. Ein Punkt lässt die Stimme fallen und landen; Kommas halten sie oben (= Block).
- **Neuer Gedanke = neuer Absatz** in `script.txt` (Leerzeile zwischen Beats). Die TTS setzt dort eine längere Pause; der Schnitt nutzt dieselben Absätze als Ankerpunkte.
- **Aufzählungen als eine fließende Zeile** mit Kommas („Mails, Rechnungen und Termine.“), nicht als einzelne Sätze, damit sie schneller abrollen. Kurze Einschübe mit Gedankenstrich oder Komma, nicht als eigener Satz.
- **Fragen nur, wo die Stimme hochgehen soll.** Rhetorische Fragen, die flach klingen würden, als Aussage mit Punkt schreiben (wie bei Satire).
- **Voice-Einstellungen nicht auf „monoton stabil“ ziehen:** keine hohe Stability, die jede Satzmelodie glättet; aber auch nicht sing-song (siehe Voice-Tuning-Zeile in Abschnitt 4). Bei Unsicherheit 2 kurze `create_speech`-Proben eines Absatzes mit Listen-Satz und Satzende vergleichen, bevor Avatar-Credits ausgegeben werden.
- **Im Raw-Check (Abschnitt 5) mitprüfen:** Geht die Stimme am Satzende hörbar runter? Rollen Listen schneller ab? Gibt es vor neuen Gedanken eine Pause? Wenn alles gleich klingt, erst das Skript nach den Regeln oben umschreiben, dann (nach Hinweis auf die Credits) neu rendern.

## 2. Avatar Performance cues (Avatar IV/V only)

One line per script beat: Expression + Gesture + Gaze, matched to what the beat does rhetorically. Presets:
- **Expression:** calm, enthusiastic, serious, warm, confident, sincere, sad, intense
- **Gesture:** wave, point, thumbs up, hand on heart, peace sign, crossed arms, OK sign, namaste, open arms, fist pump, salute, clapping, shrug
- **Gaze:** look at camera, look away, look off-camera

Hook's surprising claim → intense + a strong gesture; payoff → warm/sincere + look at camera; CTA → enthusiastic + open arms. A mismatched gesture reads as noise. On Instant/Avatar III the performance can't be directed; say so instead of pretending.

## 3. Motion prompt (the one that actually goes into the render)

The connector takes one `motionPrompt` string for the whole clip, so compress the per-beat cues into one English paragraph covering the arc (hook → steps → payoff → CTA).

**User feedback, binding (run 1, 2026-09-24):**
- "Firm pointing gesture" / "counting hand gestures" made the avatar repeat the same pen-stab at the lens for 5-8 s. The fix is not fewer gestures, it's **realistic variety**: never the same movement twice in a row, never pointing at the lens on loop.
- **Never mention counting, numbers of fingers or "indicating three" in the motion prompt (user feedback 2026-09-29, Postfach hook B).** "Fingers lightly indicating three" made Avatar V hold up both open hands (ten fingers) for 3 s, then a peace sign on "der dritte". It cost a paid hook render and had to be covered with B-roll. Describe only open-palm explaining gestures, hands opening and closing, and relaxed rest. The avatar cannot count correctly.
- Lip-sync was perfect but the head was frozen while the hands moved: the single most "AI-looking" artifact. The prompt must ask for head nods, tilts, turns, leaning in, eyebrow raises and expression changes that follow the gestures.
- Benchmark for good gesture/mimic: `nikvideo2final 2.MP4` (Mahnwesen).

**Template (standing avatar, Niklas):**
> A real person talking animatedly to a friend on camera. The whole head and face are alive and move with the speech and the hands: natural head nods on key words, small head tilts, the head turns slightly left and right, leans in toward the camera on important points and back again, eyebrows raise on surprising numbers, a knowing half-smile, eyes widen with excitement at the reveal. Head and face movement always follow the hand gestures, never a frozen head on a moving body. Hand gestures are natural, realistic and varied, never the same movement twice in a row: opens the arms, then brings them back together, small open-palm explaining gestures, an occasional point to the side, relaxed rest in between. Emotional arc: [hook: confident, slightly provocative] → [steps: engaged, explaining] → [payoff: genuinely excited] → [CTA: warm, inviting]. Mostly looking into the camera.

**Seated avatars must stay alive (user feedback 2026-09-29, vision video v1):** a "calm authority, minimal, hands rest folded on the table" prompt produced a stiff, gimbal-like avatar that kept its hands clasped the whole time and had no facial expression. Never write "folded/clasped" or "minimal"; write "hands almost always apart and moving … never keep the hands folded, clasped or interlocked" and describe constant, changing facial expression (eyebrows, smiles, frown, grin) plus head nods/tilts/turns/leans. The prompt used for vision v2 (`runs/launch`, video 51ec3620…) is the reference.

**Seated variant (Niklas Office):** same template with somewhat calmer seated gestures (user decision 2026-09-29: calmer, more premium look, same reel energy otherwise). The exact wording used for the first office video (Postfach) wasn't saved, so treat smaller hand movements at table height and leaning in on key points as a starting point, and save the prompt you use in `heygen.json` so the next run can build on it. Keep the living head and face exactly as above.

## Looks per format (binding since 2026-10-01, Pius)

| Format | Account | Look | Voice | Motion prompt |
|---|---|---|---|---|
| FP-N normal | @florent_preusser | **blue look** `42a2318d57c0439c81ef02e02c11d6c0` (standing, blue light, hand-at-chin start) | nikstudio `6cc88d5a154d467f9e32495c2ceb5ee3` (default settings) | lively template (section 3) |
| GPT-N normal/hype | @florentgpt | **"Niklas gpt normal" `c4f527e4e42a44d5accef91353df798f`** (Pius 2026-10-05): no cap, navy zip shirt, office wall, tripod framing. **The cap look `98e4ba1a…` is banned, never use it.** Never the blue look on @florentgpt | nikstudio `6cc88d5a…` (never the look's own default voice) | lively template, a bit more energy/excitement; selfie framing, so no stepping out of frame |
| BX-C Claude for Recruiters | Felix (boilr) | **"Felix" `40b224730934da6d42a3d70def3ef9fd`** (group `457a3e6a21ce45eb84518e079c36dbc5`): grey zip knit, green-lit wall, ficus, close selfie-ish framing, clip mic visible. Never any Niklas look | **"Felix" `a4d894b726424281a492f118e6b21f81`** (English clone) | **Voice must not sound monotone or rattled off (Pius 2026-10-06, Ep. 1 sounded flat and too fast):** before the render, test 2–3 `create_speech` variants (e.g. `speed` 0.92–0.95; if the voice is ElevenLabs-backed: stability ~0.4, style ~0.3, similarity 0.9) and pick the most varied one; write the script with more sentence breaks, short punchy sentences and a full stop before key numbers so the TTS pauses and stresses. Motion: calm, confident founder explaining to a peer: small nods, open-palm gestures at chest height, no big arm moves (close framing), occasional slight lean in on numbers; never counting on fingers |
| FP-S satire | @florent_preusser | **seated satire look: Niklas Office (white wall)** `f4f3ac11af8f444e9904645e6cbacc5f` (Pius 2026-10-02: centred at the table, white wall, dark jumper with shirt collar, hands folded at the start; NOT `fc009bc…` with the orange light and the Superkind projector) | nikstudio | seated deadpan (below); the folded hands are only the start pose, they open from the first sentence |
| GPT-S satire | @florentgpt | **Cap look, cap worn backwards** (Pius, 2026-10-02, replaces the planned „Hanna scenery“ as the defining feature): same Niklas with the cap turned around. **Look "Niklas Office -- 4" `57ae6dc381e843e3b99a80c5e3b17e13`** (Pius 2026-10-06): light cap backwards, green jacket over striped shirt, grey wall, selfie framing, small handheld mic in the right hand. Never fall back to the seated look | nikstudio | Hanna-style deadpan (below); a handheld mic only if it is in the reference clip |

**Never** satire in the blue look, never a normal video in the seated look. **@florentgpt is always with a cap** (Pius, 2026-10-02): GPT-N cap forwards, GPT-S cap backwards. Never mix them up, and never use a look without a cap on @florentgpt. The cap looks never go on @florent_preusser. **FP-S stays on the seated calm look** (Pius, 2026-10-01). Read the format from `format.json` in the run dir. Pass `brandGlossaryId` only if the script says "Superkind" (never the case for @florentgpt).

**Seated deadpan (satire):** "A real person sitting at a table, telling dry jokes to a friend on camera. Calm, controlled, slightly judging expression; one eyebrow lifts on each absurd point, a tiny pause and a flat look into the camera before the punchline, an almost invisible half-smile on the very last sentence. Head alive: small nods, slow tilts, a slight lean toward the camera on key words. Hands rest apart on the table and make small, calm open-palm gestures at table height; never folded, clasped or interlocked, never pointing at the lens. Mostly looking into the camera." **Atzig addition:** "a bit more attitude: short head shake of disbelief, a quick eye roll, leans back with a cocky half-grin on the punchline." Save the exact prompt used in `heygen.json`; refine after the first seated satire render.

## 4. Locked render defaults (verified 2026-09-23; don't re-derive per video)

| Setting | Value |
|---|---|
| Avatar (standard reel) | **Niklas** — look `faf76fdac020454bb3663b964eafb85b` (group `5c3bb7684d244e11bd737a9dc39dc6bf`), digital twin, portrait |
| Voice (standard reel) | **"Niklas VOICE"** `0f77447f702d4a6ca943a49985399f73` (German, male, private) |
| Avatar (office format) | **Niklas Office** — look `fc009bc15eb7276b9438c614324e5f89` (group `46d869abd2214a45abaa23eb0767cc5c`), seated at the conference table with projector |
| Voice (office format) | `161b261919184b77b7460bdc05114cfa` |
| Avatar (vision/launch, bright office) | **Niklas Office** look `f4f3ac11af8f444e9904645e6cbacc5f` (same group), created 2026-09-29, centred at the table, hands folded; used for the pinned Superkind vision video |
| Brand glossary | **Superkind** `43a14e6be222499db46e73b047d5b1b8` — "superkind" is spoken **"Super-kaind"** (English "kind"; user decision 2026-09-29, the voice said "Supercount" without it). Always pass `brandGlossaryId` when the script names the brand. |
| Voice tuning (vision video, user feedback 2026-09-29) | Niklas VOICE is ElevenLabs-backed, so `voiceSettings.engine_settings` works. "More expression" must NOT become sing-song: low stability (0.32) + style 0.45 sounded melodic and rhyming, rejected. Wanted: clear, precise, not monotone, speed 1.1 → start from stability ~0.6, style ~0.1, similarity 0.9, speaker boost on. With HeyGen speed 1.1, run the pipeline with `--speed-factor 1.0` (no second ramp). |
| Voice (vision v2, user pick 2026-09-29) | **"nikstudio - Voice"** `6cc88d5a154d467f9e32495c2ceb5ee3` (German), rendered with its own default settings; the tuned Niklas VOICE sounded monotone/robotic |
| Brand kit | Superkind `a3c9d63e3135420e86b782f5ec223f34` |
| Engine | `{"type": "avatar_v"}`; fall back to `avatar_iv` only if a render errors on eligibility, and tell the user |
| Aspect ratio | `"9:16"` always |
| Fit | `"cover"`, never `"contain"` |
| Resolution | `"1080p"` (Avatar V is native 1080p; 4K only upscales at extra cost, only on explicit request) |
| Background | unset (the twin's recorded room) |
| Captions | `caption: {"file_format": "srt"}` with **no `style`** (sidecar only, nothing burned in; without it `subtitle_url` comes back null) |
| Music | never in HeyGen |
| B-Roll | never in HeyGen (no Video Agent, no Seedance through HeyGen) |
| `motionPrompt` | the paragraph from section 3 |

Never substitute another avatar or voice unless the user asks. After `create_video_from_avatar` returns a `video_id`, write it to `heygen.json` immediately, then call `show_video` once so the user can watch it render.

## 5. Download + raw-audio check (before any post-production)

1+2. **One command, no hand-built loops (Henri 2026-10-23, after a self-written zsh poll loop crashed silently and ffmpeg/whisper had to be searched):** right after `show_video`, start in the background (`run_in_background`):
   `cd "/Users/pius/LinkedIn Generator/broll" && node fetch-avatar.mjs <run-dir>`
   It polls the status (read-only API key, free), downloads `avatar.mp4` + `avatar.srt`, transcribes the raw audio with whisper medium (German, no script) into `rawcheck.txt`, builds `rawcheck-sheet.jpg` (contact sheet) and fills `raw_duration_s` in `heygen.json`. Paths: ffmpeg = `node_modules/ffmpeg-static/ffmpeg` (there is no ffmpeg on PATH), whisper = `whisper.cpp/build/bin/whisper-cli`, model = `whisper.cpp/ggml-medium.bin`. When the job notifies: check its exit code and output; on a failure, fix it and re-run, don't tell the user "läuft" while nothing runs. Then read the sheet, write the VERDICT into `rawcheck.txt`, add credits via `get_current_user`, and **continue straight into the next phase** (no stop after the render, unless the user asked for the render only).
3. Look for single letters or spelled-out words (e.g. "P O S T F A C H"), mispronounced trigger word, dropped sentences. If found: fix the spelling in `script.txt` per the HeyGen-safe rules in `video-script` and re-render (the user loses those credits, so say so).
4. Check the first seconds for a frozen head on a moving body and for a repeated gesture.
5. Check the speech melody per section 1b (voice drops at sentence ends, lists faster, pause before new thoughts) and note the verdict in `rawcheck.txt`.

**Open issue (run 1):** the voice sounded less real than the reference. Cause not isolated (HeyGen TTS delivery, the silence cut clipping breath tails, or the 1.1x atempo). Diagnose by comparing raw `avatar.mp4` audio against the final before changing anything; ask the user how the reference was voiced if unclear.

## New avatar / new persona

Avatar V is built from a ~15 s reference video of the real person's motion. Create twins via the connector (`open_avatar_creator` / `create_digital_twin`); a twin costs ~1 credit. The connector upload limit is 200 MiB: convert 4K HDR sources to 1080p SDR first (e.g. Apple `avconvert`). Add the new look/voice IDs to the table above.
