---
name: project-fp4-guide-gegen-mail
description: fp4 test funnel (2026-10-28) = guide only after a business mail; role mail after 1 push, freemail -> website -> address; not live yet
metadata:
  type: project
---

2026-10-28 Pius: "Guide hinter der Mail verstecken", as little friction as possible, personal business mails, no Gmail/info@.
fp4 (`zernio-funnel.mjs create --kind fp4`, config `broll/funnel/fp4-funnel.json`, buildFp4): comment -> welcome "für dich und dein Team" -> mail first -> business mail = lead -> guide -> name -> phone (fp3 3-step push). info@ etc.: one push, then taken silently (sync Typ "Rollenmail (Notfall)"). Freemail: ask website, then "deine Adresse bei <site>"; still refusing -> guide anyway (Typ "Teil-Lead (Freemail + Website)", without site no lead, tag guide-ohne-mail). Second answers in lead_email_retry. No voice note. Sync (zernio-leads-sync.mjs) knows fp4; rebuild includes kind fp4.
Test workflow "FP4 Test FP4TEST" 6ae2077b401025dcb4eed123 (DM FP4TEST). Plan: first only on the next FP-N reel, 1 week vs fp3; measure leads AND intent (pitch yes / credits / call), not just mails ([[project-fp3-voice-funnel]]).
**Why:** guides were given away before the ask; 19/25 stopped at the fp3 pitch, ~1 real lead/day.
**How to apply:** don't switch existing posts to fp4 without Pius' OK; open: {{lead_company}} interpolation in Zernio texts untested, mail delivery of the guide (Resend/lemlist) not built.
