---
name: feedback-vision-cinematic
description: Superkind vision/brand films - cinematic real-looking B-roll over animation, no FP caption style, MiniMax Hailuo 3 Max only as emergency fallback after stock (2026-10-20)
metadata:
  type: feedback
---

Henri on the Vision Schwarm v3 (2026-10-20): do NOT reuse the FP caption/subtitle style (orange mono pill) for the vision film; use far fewer animated B-rolls and rely on cinematic, real-looking shots instead — they work better. Claude/Arena-style pixel/card animations only where they are genuinely needed for understanding.

**Why:** animation-heavy cuts read as explainer/AI, the film should feel like a cinematic brand film.

**How to apply:** stock first — Pexels (no watermark; via built-in browser fetch('/search/videos/<q>/') + __NEXT_DATA__, curl download), archive.org, own image film. Old 480p archive footage is fine. Generate ONLY in an emergency (Henri: "nur im Notfall"): when stock lacks the needed quality or only has watermarked versions. Then use MiniMax Hailuo 3 via OpenRouter (`minimax/hailuo-3` 2K ~0.13 $/s, `minimax/hailuo-3-max` 768p ~0.08 $/s, first/last frame supported; endpoint /api/v1/videos). Key OPENROUTER_API_KEY in broll/.env, set via broll/scripts/set-openrouter-key.sh. Related: [[project-vision-schwarm]].
