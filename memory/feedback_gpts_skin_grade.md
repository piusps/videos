---
name: gpts-skin-grade
description: GPT-S cap look 57ae6dc3 renders red skin/yellow teeth; grade tightened clip to a normal warm tone (not desaturated) before edit
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5ae411f4-4505-4dd2-99af-208851ec1e05
  modified: 2026-10-07T13:35:30.607Z
---

Look 57ae6dc3 (GPT-S Cap rückwärts) kommt aus HeyGen mit sehr rotem Gesicht. Abgenommener Grade (Pius, 2026-10-07, „normaler Hautton“), angewendet auf `tightened-hold.mp4` vor Remotion: `selectivecolor=reds=0.12 -0.04 0.08 0:whites=0 0 -0.08 0,huesaturation=saturation=-0.12:colors=r:strength=1.5`.

**Why:** Ohne Grade wirkt die Haut „rot wie ne Tomate“. Die starke Entsättigung (`huesaturation=saturation=-0.45` + `whites=-0.22`) ließ ihn „aussehen wie ne Leiche“ und machte die Wand lila. Siehe [[heygen-look-source]].
**How to apply:** Bei jedem GPT-S-Run nur die Avatar-Ebene graden, Overlays bleiben unberührt. Vorher/Nachher-Frame prüfen. Der Grade steht auch im Skill gpt-effekt-satire.
