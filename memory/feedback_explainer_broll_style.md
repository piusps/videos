---
name: feedback-explainer-broll-style
description: "Since 2026-09-29 a second B-Roll style (light whiteboard, isometric, split-screen) lives in its own skill video-broll-explainer; the glass skill must stay untouched"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 37cbb5a6-77c0-4746-9390-a1f21082cb13
  modified: 2026-09-29T15:21:59.323Z
---

User (2026-09-29) sent the @bradfordmarais reel (instagram.com/reel/DdWcjF7Ky__) and wanted its B-Roll/animation style adopted completely, but in a **new skill so the working one isn't overwritten**. Built as `~/.claude/skills/video-broll-explainer/` + `broll/src/components/ExplainerKit.tsx`; `video-broll` and `GlassKit.tsx` stay as they are.

**Why:** the glass style works and is in use; the user wants to choose per video, not lose it.

**How to apply:** never edit GlassKit/video-broll to chase the explainer look; style changes for the new look go into the explainer skill/kit. Open questions in that skill (tile colour, overlays on the speaker vs [[feedback-autonomous-video-runs]] "no overlays on avatar", caption reference pending). Related: [[feedback-broll-unique]], [[feedback-video-skills-per-phase]].

Captions for the launch/"Vision" video (same day): sleek style from instagram.com/reel/DbHkVlPAIPr, key words tinted in a *light* Superkind orange, explicitly not the loud orange karaoke box. Implemented as opt-in `--caption-style vision` in render-pipeline.mjs; karaoke stays the default for tutorial reels.
Vision captions keep ONE fixed height (y 0.77) for the whole video; the user rejected position changes every 1-2 s. B-Roll windows only add a dark pill, never a new position.
