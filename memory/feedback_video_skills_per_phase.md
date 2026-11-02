---
name: feedback-video-skills-per-phase
description: "Video pipeline is split into one skill per production phase (2026-09-29); new rules go into the owning phase skill only, never back into one monolith"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 404df5d5-633f-4031-b384-b36cfb8d8960
  modified: 2026-09-29T12:37:21.658Z
---

On 2026-09-29 the user asked to split the monolithic heygen-video-generator skill so that every video-production process has its own, cleanly scoped skill. It is now an orchestrator plus video-script, video-social-copy, video-guidebook, video-avatar-render, video-post-production, video-broll and video-qc-delivery; video-cam2 exists but is opt-in only since 2026-09-29. They hand off through fixed files in broll/runs/<topic>/.

**Why:** one 320-line file mixed every phase, so rules conflicted and were hard to find.

**How to apply:** put new feedback into the one phase skill that owns it. Keep the orchestrator free of production rules. If a phase gets a new output file, add it to the orchestrator's phase map. The pre-split backup is in ~/.claude/skill-backups/. Related: [[project-superkind-studio]], [[feedback-autonomous-video-runs]].
