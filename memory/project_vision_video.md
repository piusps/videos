---
name: project-vision-video
description: Superkind vision/launch reel (pinned on IG) delivered 2026-09-29; open real-footage B-roll spots and how it was built
metadata:
  node_type: memory
  type: project
  originSessionId: 37cbb5a6-77c0-4746-9390-a1f21082cb13
  modified: 2026-09-29T18:01:18.074Z
---

Delivered 2026-09-29 to ~/Desktop/Superkind Videos/2026-09-29 Superkind Vision/ (94 s). Built in broll/runs/launch: HeyGen look f4f3ac11 (bright office), Niklas VOICE tuned (ElevenLabs stability 0.62, style 0.1, speed 1.1, pipeline --speed-factor 1.0), brand glossary 43a14e6b (superkind=Super-kaind, KI=Ka-I), Explainer B-rolls in src/compositions/LaunchBrolls.tsx, vision captions + vision hooks (VisionHook.tsx), Skyfall instrumental edited by runs/launch/music/build_music.py (piano start, chorus drop on "superkind" at 45.35 s), mixed with sidechain ducking, loudnorm -14 LUFS.

**Why:** it is the pinned profile video for the coming months, so quality over speed.

**How to apply:** open items, waiting on the company image film: speaker-only stretches at ~9.9-13.3 s ("Persönlich. Als Team. … Sehr gut sogar.") and ~73-79 s ("Unser Team ist an deiner Seite … gelernt haben") want real team/client footage, no stock. Skyfall is copyrighted; suggest also picking it from the IG music library when posting. Related: [[feedback-explainer-broll-style]], [[user-florent-niklas]].

**v2 (2026-09-29 evening):** 57 s, script v4 (217 words), voice nikstudio 6cc88d5a, lively motion prompt, captions centred at 50 % during B-Roll, logos/flags/illustrated faces, SFX only on B-Roll events, delivered with and without Skyfall (music 16-20 dB under the voice). User asked to be cost-efficient: 1 HeyGen render per revision, everything else local, no voice test loops.

**v3 (2026-09-30):** 70.0 s, same HeyGen render as v2 (no new credits). Anti-monotony done locally: gentle silence cut (--min-silence 0.38 --pad 0.13 keeps natural pauses), no speed ramp, hand-made jump-cut/push-in zoom plan (runs/launch/zooms-vision.json via new render-pipeline --zooms), presence EQ on the voice, 3 short (~1 s) image-film shots (meeting, client over shoulder, team) in the split on "KI in Unternehmen bringen. Persönlich. Als Team." Image-film B-roll (19 silent clips, no interviews) is on the Desktop. Real fix for monotony remains: Niklas records the audio himself (audioUrl lipsync) or a new, more energetic look.
