---
name: use-ffmpeg
description: "User wants ffmpeg used for all video/audio work; there is no system ffmpeg, use the bundled binaries in broll/node_modules"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 232e8dfd-86fe-4fdf-80f9-cc36106af814
  modified: 2026-09-29T19:20:23.284Z
---

Use ffmpeg/ffprobe for every video/audio step (cut, probe, mux, encode, frames). User asked explicitly on 2026-09-29.

**Why:** User wants ffmpeg to be the standard tool for the reel pipeline.

**How to apply:** There is NO system ffmpeg (`which ffmpeg` is empty, no Homebrew install). Use the bundled binaries:
- ffmpeg 6.0: `broll/node_modules/ffmpeg-static/ffmpeg` (in scripts: `import ffmpegPath from "ffmpeg-static"`)
- ffprobe: `broll/node_modules/@ffprobe-installer/darwin-arm64/ffprobe` (in scripts: `import ffprobePath from "@ffprobe-installer/ffprobe"`)
The pipeline scripts (render-pipeline, silence-cut, mux-music, speed-ramp, cam2, studio/lib/jobs) already do this. Related: [[superkind-studio]]
