---
name: feedback-funnel-every-comment
description: Since 2026-10-23 every comment gets the DM (repeatPolicy every_comment) and tap workflows have cooldownHours 1; replies must be instant
metadata:
  type: feedback
---
2026-10-23 Pius: "automatisier jede fucking Nachricht, egal wer wie oft kommentiert hat … immer sofort antworten. Außer die Follow-Up-Nachricht, die 2 Minuten nach dem Guide kommt."

Applied: all active Zernio comment automations → `repeatPolicy: {mode: "every_comment"}` (no cooldown); all zfunnel tap workflows → trigger `cooldownHours: 1` (Zernio default is 24). Script defaults in zernio-funnel.mjs / zernio-automation.mjs changed accordingly. Exception: @pickthecompany vote automations keep their 12 h cooldown.

**Why:** Pius tests by re-commenting and expects a reply every time; waiting feels broken.
**How to apply:** never set dmDelaySeconds / commentReplyDelaySeconds. Keep the tap step (Meta allows one message before the commenter interacts, so guide + 2-min follow-up needs the tap). Comment→DM latency (9 s–2 min) is Meta webhook, not configurable; the 2-min delay node actually fires after ~5 min. See [[feedback-zernio-funnel-rebind]], [[feedback-zernio-automations]].
