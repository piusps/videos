---
name: project-superkind-editor
description: CapCut-style editor in Superkind Studio (localhost:4747/editor) since 2026-10-21 — cut sequences, edit music/SFX/B-roll, prompt B-roll, ffmpeg export
metadata:
  type: project
---

Built on 2026-10-21 at Pius's request. It is an editor with a timeline (timestamps mm:ss:ff), where he can do the following himself:
- cut out sequences (ripple)
- edit music beds and SFX
- swap or insert B-rolls
- request B-rolls by prompt

Code:
- `broll/studio/lib/editor.mjs`: projects in studio/data/editor/<id>/project.json, ffmpeg export with loudnorm −14.
- `broll/studio/public/editor.html`
- Routes in studio/server.mjs.

Time model:
- Cuts, SFX and B-roll are anchored to source time.
- Music sits on the output timeline.

Separate stems need a preset importer. The first one is `studio/presets/desk-agent.mjs`: it parses the sfx() calls and T{} from SuperkindDesk.tsx and creates project "Superkind Desk Agent v4" e246352f. Any other video can be imported by path; its sound then becomes "Originalton". Captions are burned into the picture, so a B-roll over the top half covers part of the seam caption.

Prompt B-roll has two engines:
- **"claude":** a placeholder with status "offen – Claude baut". When Pius says "bau die offenen B-Roll-Prompts im Editor", read project.json, build the clip and set `file` + status "fertig".
- **"ai":** Hailuo via OpenRouter, using gen-motion-broll.mjs. OpenRouter is at $0.

**How to apply:** for every new reel, offer an editor project, ideally with stems via a preset importer.
