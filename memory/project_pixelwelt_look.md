---
name: pixelwelt-look
description: Skill pixelwelt-look (2026-10-21) — claudebyseb 2D pixel look analysed frame by frame, transferred to Sir Token via broll PixelKit.tsx
metadata:
  type: project
---
Skill `~/.claude/skills/pixelwelt-look/` since 2026-10-21. Rules measured from 3 claudebyseb reels (Referenzen/claudebyseb/01-03). Remotion kit `broll/src/components/PixelKit.tsx`, demo comp `PixelKitDemo`. Sir Token pixel sprite is a code-drawn placeholder; 3D voxel layer replaced by 2.5D cut-out poses.

**Why:** Pius wants the claudebyseb look reusable for our topic reels (superkraft-themen).
**How to apply:** Pixel-look reels go through branch B of the skill; new look findings go into design-regeln.md. Related: [[superkraft-test-topics]]

**Update 2026-10-21 (Pius feedback):** 2D scenes with hard cuts = "langweilig". Reels in this look are ONE continuous toy-3D world (oblique top view, BlockBuddy creatures, Sir Token 3D): each script step is an island, the camera zooms in, pulls out and flies to the next one (holds + Bezier transits), Claude click paths on 3D monitors with live canvas textures, only captions in 2D. Reference implementation: `broll/src/compositions/TrainerWorld3D.tsx` (uses the Scene from TrainerTable3D with `world`).
