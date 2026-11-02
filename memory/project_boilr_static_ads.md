---
name: project_boilr_static_ads
description: "boilr.ai Meta static ads — what exists (local creatives, Ad Library pull 2026-09-30), style and copy formula; basis for a static-ad skill"
metadata:
  node_type: memory
  type: project
  originSessionId: efa3e981-13c6-43b9-acfa-28eb45ba3765
  modified: 2026-09-30T13:25:56.571Z
---

boilr.ai = AI sales employee for UK recruitment agencies (hiring signals before the job ad). Lead magnet: boilr.ai/20-hiring-signal-leads, CTA "Learn more", English copy.

- Local creatives: ~/Desktop/02 Bilder & Creatives/ (2026-09-02 to 09-09): native iOS-UI mockups (calendar "Without/With boilr", WhatsApp chat, lockscreen notifications, Gmail thread, Screen Time), plus Piccadilly billboard with a person pointing. 1092x1440 / 2048x2048, look AI-generated (ChatGPT images). Brand: dark green + white, "b" app icon.
- Public Ad Library (Apify apify/facebook-ads-scraper, query boilr.ai, 22 ads): copy formula = one-line tension hook → "Boilr does the watching…" → 2 bullets → "Trusted by 100+ recruitment agencies." → "What you get" 3 ✔️ → one-line aphorism → "👉 … Takes 60 seconds." → "To your next placement, Felix". Headlines two short parallel sentences ("Earlier signal. Quieter call.").
- Ad-set export 2026-08-31 to 09-29 (~/Downloads/-oilr-Meta-Ads-Ad-sets-…csv): broad-uk-employment 2,922 € / 96 leads = CPL 30.44 €, frequency 3.5; test-video 19.71 € (10 leads); test-timing-signal 27.43 € (7); test-zeit 79.69 € (1, off). Ad-level (screenshots, CSV export fails at ad level): emp-static-signalscard (light card grid of 4 dated signals: "Signals first. Job ads later.") 6 leads @ 24.85 €, CTR 1.79% = best static; emp-static-billboard 1 @ 42.91 €; emp-static-chat (iMessage "AI research employee") CTR 0.91%, CPC 8 € = worst; emp-static-calendar CTR 1.42%, in test-zeit (off); emp-static-100th (founder photo + red/yellow/green IG-sticker pills "you will be the 100th calling") in main set 7 @ 27.45 €; emp-static-pointing (founder pointing at camera + sticker pills "another agency has already called") 35 @ 33.57 € = volume winner, now off; emp-static-8signals (neon arrow on product screen) 1 @ 58.50 €. Main-set videos: leadquality 25 @ 21.28 €, tenthagency 28 @ 32.36 €. Videos: emp-video-talk-v2 10 @ 19.58 €; emp-video-tenthagency CTR 3.02%. "Signal before the job ad" angle beats "save time".

**Why:** Pius wants a repeatable static-ad skill ([[project_workload_ads]]); this is the starting material.
**How to apply:** Use the static-ad skill; its references/performance-log.md is the live source for winners. Ad-level numbers come as Ads Manager screenshots.

Skill `static-ad` (~/.claude/skills/static-ad/) built 2026-09-30: render.py (templates signal-cards, sticker-photo), brand file, performance-log.md. First batch: 6 signal-cards v2 in ~/Desktop/Static Ads/2026-09-30 boilr Signal-Cards/. Delivery folder convention: ~/Desktop/Static Ads/<Datum> <Marke> <Vorlage>/.

**Video ads analysed 2026-09-30** (5 unique videos from the Ad Library, transcribed): leadquality = walking office "100 calls, 50 LinkedIn messages, nobody replies" → rooftop talking head, offer "8 leads with real intent, if not no problem" (CPL 21.28 €, click→lead ~11 %); talk-v2 (probably the rooftop-only "You are a recruitment agency owner looking for new leads") CPL 19.58 € (~15 %); tenthagency = headset cold-call skit hook → phone-filmed laptop demo → selfie "free trial" CTA, CTR 3.02 % but CPL 32.36 € (~4 % click→lead: curiosity clicks, unreadable product tour, CTA/LP mismatch, 57 s). No numbers yet for "outdated data / restaurant" skit (skit hook + winning body) and the green "HIRING" demo video. Lesson: skit hooks buy clicks, the talking-head body + risk-free lead offer buys leads.
