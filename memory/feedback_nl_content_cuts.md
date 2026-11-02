---
name: feedback-nl-content-cuts
description: "Niklas-Lifestyle reels — 30-40 s, cuts on content (sentence/clause) not every beat, varied labeled B-rolls, slower nonchalant voice (2026-10-28)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0c65c096-7333-4d55-92a9-545b89d5d732
  modified: 2026-10-29T21:03:34.602Z
---

Pius' feedback on NL reel 1 v1 (56 s, 1-s beat cuts):
- **Too long, too little punchy value:** 30–40 s maximum, only hook, one authority line, 3 concrete points, one takeaway question, CTA.
- **Cuts too fast:** cut when a sentence or clause ends, matching the content, not on every music beat.
- **Content labels:** every B-roll is labeled by content (labels.json, "passt_zu" statement tags) so clips match what is being said, with variety: no repeats, never the same location twice in a row.
- **Voice:** a v2 attempt (v3 + [nonchalant], slower) was "mega Arsch". Keep the v1 voice: eleven_v4, stability 0.4, style 0.3, speed 1.05, then atempo 1.04.
- **v3 additions:** burn the music into the final, mute all B-roll audio, and use luxury subtitles. The Cormorant serif version (v3) was then replaced on request by the reference style of IG reel DfC83cJIpXx: word-by-word reveal, one big key word per chunk, small filler words, Inter Tight with tight tracking, soft shadow. Built as the Remotion overlay NLSubs (v4).
- **Mix (2026-10-29):** reel 2 v1 had the music far too loud and harsh and the voice too quiet. Since then, the stems are loudness-matched: voice at -14 LUFS, music 17 dB below it (20 was a touch too quiet), no loudnorm on the full mix, final at -14 LUFS.
- **Only aesthetic parts (2026-10-29):** no face close-ups or selfies, no whips. Review new clips at 2 fps before labeling. Use the unified cinematic grade (render.py grade/finish "cinema", per-clip matching first) so all B-rolls look like one camera.
- **Script content (Niklas, 2026-10-29):**
  - Hard facts: "zwei KI-Startups innerhalb eines Jahres auf knapp eine Million Jahresumsatz, komplett ohne Investoren".
  - Avoid AI-sounding jargon such as "KPIs".
  - Never mock others for flexing while the lifestyle B-roll flexes, unless the script grounds it: "ohne Investoren zahle ich mein Team mit Cash, nicht mit Bullshit-Umsatz".
  - The intro uses "Ich bin Florent".
  - When the voice speaks slower, use atempo 1.22–1.25.
  - Music inaudible (reel 1 v6, 2026-10-29): Timeless is ~10 dB quieter before the drop and the mix levels on the loud part. For songs with a soft intro, pre-level the used segment (dynaudnorm, plus about +4.6 dB until the drop) and set music_under to 13. Measure the music stem before and after the drop.
  - iCloud can evict fresh files in ~/Documents (read timeouts). Fix with `brctl download <dir>`.

**Why:** He wants a calm, high-status "2metermane" feel. He perceives that feel as relaxed, even though 2metermane measures ~1.1 s shots and ~3.7–4.2 words/s.
**How to apply:** Skill lifestyle-reel-edit, section "Voiceover-Reels"; builder scripts/build_plan_content.py. Related: [[project-niklas-lifestyle]].
