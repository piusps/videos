---
name: project-fpq-qualifying-funnel
description: "2026-10-22 qualifying DM funnel for @florent_preusser (kind fpq) - solo + private → Superkind abo (no price), team/GmbH → custom AI employees waitlist; test workflow only, not live yet"
metadata:
  node_type: memory
  type: project
  originSessionId: a0366f7f-636e-49dd-9c4e-46029865967c
  modified: 2026-10-22T09:58:48.777Z
---

Pius (2026-10-22): FP DM funnel asks after the guide (tap) [Allein / Freelancer] [Firma mit Team] [Angestellt] [Privat]. Solo, team and employed each get their own pitch and go onto the Superkind waitlist; Privat is irrelevant and only gets a friendly goodbye. Never name a price; Superkind = basically a really good ChatGPT subscription, makes most sense at work. Team pitch = individual AI employees.

Built as `--kind fpq` in `broll/scripts/zernio-funnel.mjs` (88 nodes), texts in `broll/funnel/fpq-funnel.json`. Form per segment: name → company (solo "dein Business", employed "bei welcher Firma") → mail (solo accepts Gmail/info@, team+employed need personal business mail) → phone optional ("Lieber nur Mail"). Pitch answer saved as pitch_solo / pitch_team / pitch_emp so the sync knows the type. Unclear free text at the segment question → employed path. Every question gets one reminder after 20 h (IG 24 h window).

Sheet "Waitlist Superkind" (Tabellenblatt1) has column I "Typ" since 2026-10-22 (Allein / Freelancer, Firma mit Team, Angestellt, "unbekannt (alter Funnel)" for older Instagram rows, empty for website rows). `zernio-leads-sync.mjs` writes it and now counts every run with a valid mail, not just completed ones; scheduled task zernio-leads-to-waitlist updated. Note: WAITLIST_WEBHOOK_URL is not set in .env, so leads only reach the sheet via this sync, not live.

Baseline before (old fp funnel, 9 active posts, measured 2026-10-22): ~339 welcome DMs → 159 taps (47 %) → 151 saw pitch → 40 answered (26 %) → 32 yes → 6 leads (1.8 %).

Status: test workflow "FPQ Test" 6ad9e1096904991aa63ef187 on @florent_preusser, starts on DM "SKTEST". Not on any post yet; new reels still use kind fp until Pius OKs. Name live funnels "FPQ Funnel <Thema>" (sync matches ^FPQ? Funnel, skips names with "test").

**How to apply:** after Pius tests, switch new FP reels to `--kind fpq` (and the default in the scheduling/autofunnel scripts); compare against the baseline above. See [[project-instantdm-to-zernio]], [[feedback-dm-tone]].
