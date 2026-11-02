---
name: feedback-zernio-automations
description: Since 2026-10-17 comment-to-DM automations run via the Zernio API (scripts/zernio-automation.mjs), not the InstantDM dashboard
metadata:
  type: feedback
---

Since 2026-10-17, comment automations for Pius' reels are created through the Zernio API (`POST /v1/comment-automations`). We no longer use the InstantDM dashboard in Chrome for this.

The helper is `node scripts/zernio-automation.mjs create --account … --name … --pdf <guide.pdf> --config runs/<run>/automation.json (--platform-post-id <IG media id> | --post-id <Zernio post id>)`. Other commands: `list`, `logs <id>`, `pause`, `resume`, `delete`.

What `create` does:
- `keywords: []` means All Comments.
- Sends a DM with a URL button to the guide PDF (uploaded via Zernio's media presign to `media.zernio.com/temp/…`).
- Posts a public reply with 3–4 variations, only after the DM went out (`after_dm`).
- `repeatPolicy` is `once`.
- Can bind to a scheduled Zernio post via `--post-id`, so the automation arms itself when the post publishes.

**Why:** Pius asked on 10-17 "kannst du nicht über zernio automatisieren" while the Chrome extension was down. This works fully by API.

**How to apply:**
- For every reel with a trigger word, schedule it with zernio-schedule.mjs, then call zernio-automation.mjs with the returned postId.
- DM and replies follow the DM-tone rule (no emojis, sounds like Florent, ends with a question).
- Open question: does the `media.zernio.com/temp` PDF URL ever expire? Check that the link still works after a few days.

See [[reference-zernio]] and [[feedback-instantdm-all-comments]].
