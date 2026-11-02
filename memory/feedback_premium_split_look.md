---
name: feedback-premium-split-look
description: "FP-N split B-rolls looked generic; Pius loves the PremiumKit look (paper, ink stamps, glass, 2.5D court, blinds light, grid kept) since 2026-10-27"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0f60623d-523b-4534-a4a7-dfdde59d1c34
  modified: 2026-10-27T15:28:53.295Z
---

Pius 2026-10-27 (FP-N Klage): the white-box-on-grid split animations "wirken mittlerweile zu generisch und zu einfach". The PremiumKit look (`broll/src/opus/PremiumKit.tsx`) got "richtig richtig gut":
- warm cream stage with orange key light, **grid pattern kept** (he asked for it back),
- window-blind shadows and light shafts, floating bokeh dust, warm grade/vignette,
- real paper (gradient, contact shadows, light sweep), ink stamps, hand-drawn marker strikes/highlights,
- 2.5D courthouse, frosted glass chips, depth of field on back layers, parallax layers in the master.

**Why:** generic cards look cheap; editorial still-life lighting makes the B-rolls feel premium.

**How to apply:** build new FP-N Opus split scenes from PremiumKit (reference `src/opus/KlageOpus.tsx`), not plain Panel/LightBg. Real Claude UI windows stay as they are, only the stage around them changes. Related: [[feedback-fullframe-theme-world]], [[feedback-real-platform-ui-25d]]

**Update 2026-10-27 evening:** Pius then found the CSS objects (Courthouse, Ruler, VelvetRope cards) still "flach, veraltet Android". Real three.js 3D (`broll/src/opus/KlageCourt3D.tsx`, `@remotion/three`) got "gut": fluted ceramic columns, polished brass posts, velvet rope, curled paper bill with canvas-texture text, RoomEnvironment reflections, ACES, soft shadows (key light front-left high so shadows land on wall/steps), warm gradient sky, low monumental camera. Render with `--gl=angle`; check stills at full res (`scripts/stills-hq.mjs`); delete `$TMPDIR/remotion-*` bundles after renders (disk filled up once, Pius OK'd deleting them).
