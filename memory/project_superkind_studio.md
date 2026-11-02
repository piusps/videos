---
name: project-superkind-studio
description: "Local web app (broll/studio, localhost:4747) that runs the whole heygen-video-generator pipeline from topic to delivered reel"
metadata:
  node_type: memory
  type: project
  originSessionId: e8ab139b-76df-442f-9d89-9ccff3375f63
  modified: 2026-09-29T08:19:18.102Z
---

Built 2026-09-27 at the user's request: "Superkind Studio", an HTML app they reopen via `Superkind Studio.command` (Desktop + broll/). It finds relevant topics with live web research, then one click produces script, captions, Guidebook PDF, HeyGen render, B-Roll, optional camera switches, QC and a folder in ~/Downloads/Superkind Videos.

**Why:** the user wants the skill's pipeline fully automated, without a Claude session per video.

**How to apply:** the app reads the SKILL.md files of heygen-video-generator and the phase skills video-script, -social-copy, -guidebook, -avatar-render, -broll, -cam2 (plus video-script/references) live (list: SKILL_FILES in broll/studio/lib/skill.mjs), so skill edits change the app's behaviour. Keep `broll/studio/lib/skill.mjs` (schema + gate) in sync with new hard rules. It needs `HEYGEN_API_KEY` and a funded `OPENROUTER_API_KEY` in broll/.env; the OpenRouter account ran out of credits on 2026-09-27. HeyGen key added 2026-09-29, but the HeyGen API wallet is separate from the subscription plan credits and was at $0 then — API renders fail until it is topped up, while the Claude HeyGen connector keeps using plan credits. Camera switches (Aleph) are still unproven, see [[feedback-camera-angle-switches]]. Related: [[feedback-autonomous-video-runs]].
