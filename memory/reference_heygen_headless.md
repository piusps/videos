---
name: reference-heygen-headless
description: When HeyGen MCP tools are missing in the session, call them via headless `claude -p --allowedTools "mcp__heygen__*"` (local heygen MCP, plan credits)
metadata:
  type: reference
---
2026-10-29: the claude.ai Heygen connector vanished after an account switch (session ran as pius@boilr.ai). Pius authenticated the local user-scope MCP `heygen` (https://mcp.heygen.com/mcp/v1/) via `/mcp` in a real terminal (T3's /mcp can't do OAuth). The running session still didn't load the tools, but `claude -p '<instructions>' --allowedTools "mcp__heygen__*"` from Bash worked for create_speech and create_video_from_avatar. Status polling still via the read-only API key (stage-a-run.sh). Related: [[feedback-heygen-connector-only]].
