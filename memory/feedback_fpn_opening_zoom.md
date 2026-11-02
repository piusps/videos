---
name: feedback-fpn-opening-zoom
description: FP-N (blue look) opening push-in max ~130 %, whole face visible; hard 186 % zooms only later
metadata:
  type: feedback
---
The opening zoom on @florent_preusser normal reels (blue look) stays gentle: ~130 %, hair to chin in frame. Zooming at the start is wanted, just not the 186 % face-only crop.

**Why:** Pius on the Mahnbescheid reel (2026-10-03): "nicht am Anfang so krass in sein Gesicht reinzoomen … sein ganzes Gesicht soll noch zu sehen sein".

**How to apply:** `broll/scripts/compute-zooms.mjs` OPEN_SCALE = 1.3 for the push-in from frame 0; rule lives in `video-post-production` → Zooms. QC check via `scripts/watch-reel.mjs` hook-sheet. Related: [[feedback-video-run1]]
