---
name: feedback-gestures-cam2
description: "Never ask the avatar to count with fingers in motion prompts; never use the local (crop + handheld drift) second camera, skip Cam 2 instead"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 2426d8f8-711c-4b24-a616-b3bbe7be68ed
  modified: 2026-09-29T12:39:21.465Z
---

Three things the user rejected on 2026-09-29 (Postfach reels):

1. **Counting gestures.** The motion prompt said "fingers lightly indicating three" / "fingers lightly counting the steps". Avatar V then showed ten open fingers for 3 s and a peace sign on "der dritte". The user was angry ("Was macht er da für eine Scheiße mit seinen Händen").
   **How to apply:** Never mention counting, numbers or fingers in a motion prompt. Use only open-palm explaining gestures, hands opening and closing, and relaxed rest. Check the raw render's hands on a 0.2 s contact sheet before cutting.

2. **Local Cam 2.** The free local second camera (tighter angled crop with handheld drift) "sieht mega kacke aus und vibriert".
   **How to apply:** Never fall back to local. Since 2026-09-29 Cam 2 is off entirely unless the user explicitly asks for it (see [[feedback-camera-angle-switches]]).

3. **SFX.** In the SFX pass, the user rejected only the heavy sounds: the long whooshes (whoosh-airy, whoosh-short) and the sub-hit, which starts with a heavy whoosh. They explicitly want every light UI sound kept: pops, chimes, clicks, typing, and the short whoosh-quick on flying mails and calendar chips. Removing all whooshes was wrong; it also killed the UI sounds.
   **How to apply:** Drop heavy whooshes and sub-hits only, and keep the light whoosh-quick on UI motion.

**Why:** Each made the reels look cheaper or faker and cost a re-edit. Rules are also recorded in the video-avatar-render, video-cam2 and video-post-production skills. Related: [[feedback-video-run1]], [[project-office-format]].
