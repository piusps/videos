---
name: feedback-heygen-look-source
description: "HeyGen looks made from untrimmed iPhone HDR clips come out tomato-red and in the selfie pose; always trim + SDR-convert first, check the look's reference frame before using it"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 37cbb5a6-77c0-4746-9390-a1f21082cb13
  modified: 2026-10-05T12:54:36.426Z
---

2026-10-05: "Niklas Office -- 5" (db57a8ac…, made directly in the HeyGen app, not by Claude) renders with a handheld selfie pose (arm stretched out) and red skin, although the source was shot on a tripod with both hands free. Pius was upset ("rot wie eine Tomate", "warum Selfie-Perspektive").

**Why:** HeyGen picks a reference frame from the uploaded clip (preview `best_frame_selection` image) and Avatar V copies its pose; the frame came from the start/end where Niklas reaches for the phone. iPhone HDR (HLG) uploaded unconverted gets tone-mapped badly → red skin (reference frame R/G 1.44, render 1.57). Likely the same cause for the red cap look 98e4ba1a.

**How to apply:** Before using any look, open its `preview_image_url` and check pose + skin. When creating looks: trim the first/last seconds (phone handling), convert HDR → SDR 1080p (avconvert Preset1920x1080), upload via connector. Stopgap for a red render: `colorbalance=rs=-0.09:rm=-0.12:rh=-0.04:gm=0.03:bm=0.02,huesaturation=saturation=-0.22:colors=r+y` on tightened.mp4. Related: [[feedback-camera-angle-switches]], [[project-pius-twin]].
