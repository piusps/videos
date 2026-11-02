---
name: feedback-portrait-generation
description: "Profile pictures of Niklas/Florent — use real photos composited locally (macOS Vision cut-out), not AI; AI faces and AI logos were rejected"
metadata:
  node_type: memory
  type: feedback
  originSessionId: ef4b8e54-c3f8-4d81-8708-5a99ef39ba39
  modified: 2026-10-01T15:37:14.954Z
---

2026-10-01: Pius called the AI-generated portraits of Niklas bad (wrong face, logo looked fake) and asked for them to be built "lokal", meaning a real photo of Niklas cut out with no AI.

The local pipeline lives in ~/Desktop/Superkind Videos/Instagram Profil/Werkzeug/:
- `segment` is a Swift tool using macOS Vision VNGenerateForegroundInstanceMask. It runs offline and turns an image into a mask PNG.
- `compose.py` (PIL only) does the crop, the radial orange gradient (cream centre to orange edges), the black-and-white grade, removal of the Polo pony, and the real Superkind smiley as embroidery.

Real source material: ~/Desktop/nikvideo/*.mp4 (4K, white Polo shirt, harsh red light, so colour looks bad and black-and-white works) and ~/Desktop/niklasvisage.jpeg (stage photo, 800 px, arms raised).

**Why:** a real face and the real logo matter more to him than the exact pose.

**How to apply:** for a new pose or outfit (fleece, crossed arms), ask for a real photo and run it through the pipeline rather than generating one. Fallback only: OpenRouter `google/gemini-3-pro-image-preview` (the Gemini key has no image quota). Related: [[user-florent-niklas]].
