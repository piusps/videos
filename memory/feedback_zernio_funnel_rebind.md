---
name: feedback-zernio-funnel-rebind
description: Funnels attached at scheduling time (Zernio post id) are NOT remapped to the IG media id on publish; rebind right after go-live
metadata:
  type: feedback
---

2026-10-21: the "100 Agenten Tag 1" reel was scheduled with `zernio-schedule.mjs --run …`, which attaches the funnel to the Zernio post id and claims Zernio remaps it on publish. It did not. The automation kept platformPostId = Zernio id, saw zero comments, and Pius found out himself ("die Automation geht nicht"). Fix: `PATCH /v1/comment-automations/<id> {"platformPostId": "<IG media id>"}`, then catch up early commenters (private-reply with guide link + public reply).

**Why:** a dead funnel on a live reel loses every lead from the first minutes, and Pius was rightly furious.
**How to apply:** after every scheduled post goes live, fetch GET /v1/posts/<id> → platforms[].platformPostId, check the automation's platformPostId, rebind if needed, and verify with a real comment or the automation stats before telling Pius it works. Never report "funnel aktiv" from the schedule output alone. See [[feedback-zernio-automations]], [[reference-zernio]].

**Since 2026-10-22 (Tag 2):** schedule with `--no-funnel`, then run `scripts/zernio-golive-arm.mjs` in the background (caffeinate). It waits for go-live, creates the funnel on the IG media id, sets publicReplyPolicy=always (every comment gets the public reply even if the DM fails), catches up early commenters and for --watch minutes hand-replies to any top-level comment without an owner reply after 3 min. Log: runs/<run>/golive.log. Only report "works" after its SUMMARY shows answered commenters.

**2026-10-23 (Amazon Opus reel):** fp2 funnel armed correctly (bound to IG id, config identical to the working Abmahnung funnel), but 0 workflow executions: no "Ja, schick rüber" tap reached Zernio. Pius: "man kriegt keinen guide". Fix applied: the comment automation DM now carries the guide as a direct URL button (no postback step). The private reply per comment is used up, so earlier commenters can't be DMed again. Before trusting the postback step again, verify a real tap starts an execution.

**2026-10-23 (Tag 3):** the background `zernio-golive-arm.mjs` died 2 min after start on a DNS blip (ENOTFOUND zernio.com), unnoticed until 21:34 → funnel was off ~20 min after go-live. Script now retries network errors ~1 h. Always pair the arm with a one-off scheduled check ~20 min after go-live, and read golive-arm.log right after starting it.
