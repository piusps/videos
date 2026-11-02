---
name: feedback-camera-angle-switches
description: Re-angle prompts must lock exposure/light/colour/resolution to the original and match first/last frames at every cut
metadata:
  node_type: memory
  type: feedback
  originSessionId: e8ab139b-76df-442f-9d89-9ccff3375f63
  modified: 2026-09-28T15:17:33.230Z
---

When writing video-model prompts that re-angle a talking-head clip: 2-3 switches per ~9s placed in real speech pauses, real direction changes (not just zooms), and explicitly lock exposure, lighting, colour grade, white balance, skin tones, sharpness, resolution (1080×1920, 25 fps), grain and quality to the original. First and last frame of every re-angled segment must match the original at that timestamp, so no gesture is mid-motion at a hard cut. Always end with "Keep the location, dialogue and actions identical."

**Why:** user wants cuts to read as one continuous multi-cam take; mismatched metrics or mid-motion cuts look fake.
**How to apply:** rule lives in the video-cam2 skill and FINAL_RUBRIC item 4b; follow it for every angle-switch prompt. Related: [[feedback-video-run1]]

**Reversed 2026-09-29:** the user said "Cam 2 macht gar keinen Sinn". Cam 2 is no longer part of the pipeline and runs only on explicit request (video-cam2 is opt-in; Studio toggle off by default). Earlier decision (2026-09-28): one "Cam 2" sentence per video via broll/scripts/cam2.mjs, using Wan 3.0 on OpenRouter with a fixed per-avatar start still in broll/assets/cam2/<avatar>.png. Keep Wan's colours: the user hated darkened grades. The framing should match the main shot (not filling the frame, little wall above him). Cut points are measured from audio, not captions. Full rule in the video-cam2 skill.

Tooling fact (2026-09-25): Seedance on OpenRouter cannot take real-person footage at all. BytePlus rejects the input video with a 400 `InputVideoSensitiveContentDetected.PrivacyInformation`. Two earlier Seedance runs silently ignored the video, one because `frame_images` overrides `input_references`, and invented a stranger. Use a video-editing model such as `runway/aleph-2` for re-angling real footage. The user wants OpenRouter, never HeyGen, for this.
