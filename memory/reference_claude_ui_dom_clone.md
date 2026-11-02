---
name: reference-claude-ui-dom-clone
description: Fallback for real claude.ai click-path screenshots when the Chrome extension is not connected — T3 preview with Chrome profile + DOM clone rendered in headless Chrome
metadata:
  node_type: memory
  type: reference
  originSessionId: d0ae0b6d-aa0c-4bb1-95b1-b27b72216446
  modified: 2026-10-27T18:47:46.279Z
---

When `mcp__claude-in-chrome__*` is unavailable (2026-10-27, bx-interview): the T3 preview browser profile "Chrome" (`preview_open` with that profileId) is logged into claude.ai; the default profile is not. Its `preview_snapshot` screenshots time out, but `preview_evaluate` works: send prompts by dispatching a ClipboardEvent paste into the ProseMirror editor and clicking `button[aria-label="Send message"]`.

Screenshots: clone `document.documentElement` (drop scripts, nav/aside, add `<base href="https://claude.ai/">`), pull it out in 60 KB slices (results over the token limit land as files in tool-results), set every `data-mode="light"` to dark, and render it with `broll/node_modules/.remotion/chrome-headless-shell/...` `--window-size=800,5200 --force-device-scale-factor=1.5 --screenshot`. The chat column is then x 455–1160 (705 px wide). These are real claude.ai pixels, which satisfies [[feedback-claude-real-ui]].
