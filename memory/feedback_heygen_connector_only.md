---
name: feedback-heygen-connector-only
description: "Render HeyGen videos and create avatars only via the Claude HeyGen connector (plan credits), never via the HeyGen API key / wallet"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 2426d8f8-711c-4b24-a616-b3bbe7be68ed
  modified: 2026-09-29T08:22:14.594Z
---

Decided 2026-09-29: all HeyGen work (renders, digital twin uploads, consent links) goes through the HeyGen MCP connector, which bills the subscription plan credits. Do not use `HEYGEN_API_KEY` from broll/.env for renders or uploads.

**Why:** The API bills a separate USD wallet. Avatar V costs about $0.05/s there (~$2.40 per ~48 s raw video), versus roughly 25–30 plan credits (~$1.20–1.50) through the connector. The plan is paid anyway.

**How to apply:** The key may still be used for free read-only checks (quota, voice or avatar lists). The Superkind Studio app can't render without API wallet funds. Don't suggest topping up the wallet unless the user wants Studio to run without a Claude session. Related: [[project-superkind-studio]].
