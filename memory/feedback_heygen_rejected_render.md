---
name: feedback-heygen-rejected-render
description: A rejected/interrupted HeyGen create_video call can still render and cost credits — always check list_videos before claiming nothing was rendered
metadata:
  node_type: memory
  type: feedback
  originSessionId: 16ac0e8c-9e97-482f-9567-35139f85aa40
  modified: 2026-10-26T14:35:30.520Z
---

2026-10-26: Pius interrupted the "Werbung wirkt nicht" create_video_from_avatar call; the tool returned "rejected", I told him nothing was rendered — but HeyGen had rendered it (56bd7520…). Pius: "werbung wirkt nicht hat auch gerendert".

**Why:** wrong "not rendered" claims lead to double renders / wasted credits ([[feedback-heygen-connector-only]]).

**How to apply:** after any interrupted or errored HeyGen render call, run list_videos (title filter) before saying whether it rendered; if it did, save it into its own run folder (Stage A) instead of letting it go to waste.
