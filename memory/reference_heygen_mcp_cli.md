---
name: reference_heygen_mcp_cli
description: "HeyGen connector without the claude.ai integration - own OAuth client + mini MCP client in ~/.config/heygen-mcp (plan credits, not API wallet)"
metadata:
  node_type: memory
  type: reference
  originSessionId: 945b26ff-2764-4c22-8bd6-9cde6892a3e2
  modified: 2026-10-29T16:10:34.351Z
---

Since 2026-10-29 the claude.ai HeyGen connector was missing from the session. Workaround Pius approved by sending the URL https://mcp.heygen.com/mcp/v1/:
- `~/.config/heygen-mcp/` holds client.json (dynamic OAuth client), token.json (bearer, plan credits), auth.mjs (browser login, PKCE, localhost:8765 callback), mcp.mjs (`node mcp.mjs list` / `node mcp.mjs call <tool> '<json>'`).
- Network calls need the sandbox disabled. If the token expires, rerun `node auth.mjs` (Pius clicks Allow in the browser).
- Series voice: `create_speech_without_player` with voiceId 6cc88d5a154d467f9e32495c2ceb5ee3 → audio_url wav. The 100-Agenten series only needs the voice, no avatar.
Related: [[feedback_heygen_connector_only]]
