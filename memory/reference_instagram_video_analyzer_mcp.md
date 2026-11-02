---
name: reference-instagram-video-analyzer-mcp
description: "Where the Instagram Video Analyzer MCP server lives and how it's configured (installed 2026-09-24)"
metadata:
  node_type: memory
  type: reference
  originSessionId: abf86cdc-c6cd-4beb-990e-6701791ed9d8
  modified: 2026-09-24T08:27:01.075Z
---

Installed 2026-09-24 from a zip the user provided (`~/Downloads/instagram-video-analyzer-mcp-master.zip`, originally from github.com/Morfeu333/instagram-video-analyzer-mcp). Analyzes Instagram Reels (or any local video file) with Gemini (transcription, visual scene-by-scene description, content insights) — useful for [[project_linkedin_generator]] competitor/reference research, feeds the same kind of swipe-file work the `heygen-hook-script-writer` skill's reference files track.

**Location:** `/Users/pius/mcp-servers/instagram-video-analyzer-mcp/` (moved out of Downloads to a permanent home). Two parts:
- `backend/` — FastAPI server, must be running on `localhost:8000` for the **Instagram URL** tools (`analyze_instagram_video`) to work. Python 3.11 venv at `backend/.venv`. Start with `./start-backend.sh` from the project root.
- `mcp-server/` — the actual MCP bridge, registered with Claude Code at **user scope** (`claude mcp add -s user instagram-video-analyzer ...`), so available in every project/session. `analyze_local_video` talks to Gemini directly (no backend needed) but needs `GEMINI_API_KEY` set in the **MCP server's own env** (`claude mcp add ... --env GEMINI_API_KEY=...`), separately from `backend/.env` — the two are not shared automatically.

**Working as of 2026-09-24**: a real Gemini key is now set in both `backend/.env` and the MCP server's registered env. Model was bumped from the deprecated `gemini-2.5-flash` (404 "no longer available to new users" on this key — it's tied to a project that only has 3.x-generation models) to **`gemini-3.5-flash-lite`** in both `backend/app/services/video_analyzer.py` and the mcp-server's `GEMINI_MODEL` default — this model reliably handles video upload+analysis, whereas `gemini-3.6-flash`/`gemini-flash-latest` returned persistent 503 "high demand" errors on this key when tested. If Gemini API calls start failing again, try listing available models (`client.models.list()`) and prefer whatever `*-flash-lite` variant is current, rather than the newest preview model.

**Instagram anonymous scraping is rate-limited hard**: `analyze_instagram_video` / `get_video_info` hit IG's `401 "Please wait a few minutes before you try again"` frequently since there's no IG login configured (deliberate choice — see below). This isn't a config bug; expect to fall back to **downloading the reel manually and using `analyze_local_video` on the file** when this happens — that path bypasses IG entirely and works reliably.

Instagram login (`INSTAGRAM_USERNAME`/`PASSWORD`) was deliberately left blank/commented out — the user chose to start without it (works for public Reels, avoids the risk of an unofficial scraper login getting a personal IG account rate-limited or flagged). If they later want authenticated downloads, recommend a throwaway/secondary IG account, not their main one, and they should add the credentials to the `.env` file directly themselves, never by telling Claude the password in chat.

**Tools it exposes**: `analyze_instagram_video`, `get_job_status`, `list_recent_analyses`, `cancel_job`, `get_system_stats`, `get_video_info` (need backend running), `analyze_local_video` (direct Gemini, no backend needed, up to 2GB/3h) — plus MCP resources `analysis://{job_id}`, `jobs://recent`, `stats://system`.

**To use the Instagram-URL path:** the backend must be started manually each session it's needed (`~/mcp-servers/instagram-video-analyzer-mcp/start-backend.sh`) — it is not an auto-starting system service (deliberately not set up as a launchd/systemd service, to avoid a persistent background process the user didn't ask for). `analyze_local_video` doesn't need this.

**Gotcha:** changing the MCP server's registered env (`claude mcp add -s user ... --env ...`) only takes effect for *new* sessions — a session that already connected to the server keeps the old env until restarted (no in-session reconnect tool exists for user-scoped stdio servers).
