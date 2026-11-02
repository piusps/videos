---
name: reference-openrouter-video
description: OpenRouter video generation (MiniMax Hailuo 3 Max) for specific motion B-roll no stock clip covers; helper and limits
metadata:
  type: reference
---

Pius wants OpenRouter video generation for specific motion B-roll that no stock footage covers, e.g. pressing the MacBook dictation key (2026-10-20). The model is minimax/hailuo-3-max ("h3max").

- Key in broll/.env; helper in broll/scripts/lib/openrouter.mjs.
- Flow: POST /api/v1/videos, poll polling_url, download unsigned_urls[0].
- 768p/480p, 5–15 s, about $0.08/s at 768p (5 s ≈ $0.40). Use passthrough aigc_watermark:false.
- Only ONE keyframe is allowed: first_frame. last_frame alone fails.
- Best practice: use a real stock frame (graded and cropped) as the first_frame, then crossfade the generated clip into the real stock clip.
- The key limit (e.g. $50/day) is NOT money. Every job is billed from the account balance; at $0 you get 402 'Insufficient credits'. Pius tops up himself at openrouter.ai/settings/credits. The balance was $0 on 2026-10-20 after the lid clip.
- Generated MP4s contain an audio stream; probe with -select_streams v and use -an.

Related: [[project-superkind-desk]].
