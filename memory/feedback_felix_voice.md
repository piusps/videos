---
name: feedback-felix-voice
description: Felix HeyGen voice must not sound monotone or rattled off; test voice settings before every render
metadata:
  type: feedback
---

Felix' twin voice in Ep. 1 (2026-10-06) sounded monotone and rattled off. For every next Felix render: compare 2–3 `create_speech` probes with different voiceSettings (slower speed ~0.93, ElevenLabs stability ~0.4 / style ~0.3 if applicable), pick the most lively, pass the same settings to the render; write shorter sentences with a full stop before key numbers.

**Why:** Pius found the flat delivery obvious; SFX were added to mask it.
**How to apply:** rule lives in `video-avatar-render` (Felix row) and `boilr-recruiter-reel`; related [[project-felix-boilr-brand]].
