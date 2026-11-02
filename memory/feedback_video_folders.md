---
name: feedback-video-folders
description: "Every video gets its own folder on the Desktop holding all versions, images, guidebook and raw files"
metadata:
  node_type: memory
  type: feedback
  originSessionId: e8ab139b-76df-442f-9d89-9ccff3375f63
  modified: 2026-09-28T15:25:36.575Z
---

User (2026-09-28): for every video create ONE folder, `~/Desktop/Superkind Videos/<YYYY-MM-DD> <Thema>/`, and keep everything for that video in it, so nothing lies around in Downloads:
- final video, guidebook PDF and texts at the top level
- `Versionen/` for earlier versions and previews
- `Cam 2 & Referenzen/` only if a Cam 2 was explicitly requested (off by default since 2026-09-29)
- `Rohmaterial/` for the raw HeyGen avatar and raw cut-outs
- `B-Roll/` for the B-Roll clips

**Why:** files were scattered across Downloads and runs/ and got hard to find.

**How to apply:** write every deliverable there from the start, never into ~/Downloads. broll/runs/<topic>/ stays the working directory. The Studio app's deliver step does the same (see [[project-superkind-studio]]).
