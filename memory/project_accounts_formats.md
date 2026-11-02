---
name: project-accounts-formats
description: Since 2026-10-01 two IG accounts × two formats each (FP-N, FP-S, GPT-N, GPT-S), separate skills per format, router skill reel-formate
metadata:
  type: project
---

Structure set up 2026-10-01 at Pius' request ("komplett voneinander separiert, zwei unterschiedliche Skills"):
- **@florent_preusser** (B2B, Superkind): FP-N normal (blue look `42a2318d…`, orchestrator `heygen-video-generator`, scripts `video-script`) and FP-S satire (seated calm look Niklas Office, orchestrator `fp-satire-reel`, ideas/scripts `ki-satire` + `ki-satire-skript`).
- **@florentgpt** (new, B2C, AI hype for consumers): GPT-N hype (blue look, same edit as FP-N, orchestrator `gpt-normal-reel`, scripts `gpt-hype-script`, guide `--brand florentgpt`, no Superkind) and GPT-S satire for consumers (seated look, orchestrator `gpt-satire-reel`, ideas/scripts `gpt-satire`), alternating day by day between "atzig/fotzig" and normal; 1 hype + 1 satire per day.
- Satire edit identical on both accounts (`video-satire-edit`); normal edit identical on both (`video-post-production`). Router/matrix: `reel-formate`; satire engagement without trigger words: `reel-formate/references/satire-engagement.md`. Data for GPT: `~/.claude/florentgpt/`.
- Fully automated up to the Freigabe-Paket before upload (manual check), per the standing autonomous go.

**Why:** two audiences (Unternehmer vs. Endkonsument) and two tones must not bleed into each other.

**How to apply:** pick the orchestrator via `reel-formate`; write `format.json` in every run dir. Open: @florentgpt not yet connected in InstantDM; Pius still sends satire editing templates (to go into `video-satire-edit`). Related: [[project-office-format]], [[user-florent-niklas]], [[feedback-dm-tone]].

**Style models (2026-10-01, Pius: "1:1 übernehmen"):** GPT-N copies @mavgpt (edit spec `gpt-normal-reel/references/mavgpt-edit-style.md`, topics `gpt-themen/references/mavgpt-themen.md` + idea DB `~/.claude/florentgpt/ideen-datenbank.xlsx`, craft templates T1-T6 `gpt-hype-script/references/mavgpt-machart.md`, briefings in `~/.claude/florentgpt/hype/backlog.md`); GPT-S copies @help.hannaa (`gpt-satire/references/hanna-analyse.md`, edit details in `video-satire-edit` "Nachmessung 2026-10-01", 5 briefings in `~/.claude/florentgpt/satire/backlog.md`). Scraped data + videos + contact sheets: `/Users/pius/LinkedIn Generator/research/creators/` (Apify `apify/instagram-reel-scraper`, ~0.50 USD for 200 reels). Still to build on first runs: `AppScreenKit` (mavgpt screen B-roll) and the typewriter serif hook / calculation board in SatireKit.

**Update 2026-10-01 evening (Pius):** GPT-N = only Claude (no ChatGPT/other tools), broadest audience, everyday-life topics first (cheapest flights, travel coupons, letters from authorities, holiday planning); B-roll = exact click paths in real Claude UI so anyone can follow; @florentgpt guides in the plainest German, no foreign words or jargon; Superkind never mentioned. GPT-S gets a new Hanna-style HeyGen scenery with a handheld mic (being created; add the look id in video-avatar-render when it exists). FP-S stays on the seated calm look (Pius, 2026-10-01).

**2026-10-02:** GPT-N topic finding split from scripting (Pius): `gpt-themen` (scores Markt × privater Schmerz × Beleg, maintains DB + backlog, re-scrapes models) → `gpt-hype-script` (script only, T1 tutorial "Ich zeig dir, wie du X machst" as default, plays the click path in Claude first). Pius' older note said "Claude oder ChatGPT"; the newer rule "nur Claude" is applied.

**2026-10-02, visual separation (Pius: "damit florentgpt und florent_preusser nicht identisch aussehen"):** GPT-N always renders with `render-pipeline.mjs --preset gpt`. That gives one-word Montserrat Black captions (GptCaptions), a white hook box with emoji (GptHook), hard jump cuts up to 128 % instead of the FP push-ins, and B-roll that pops in. GPT B-roll is full-frame ScreenFlow with red `accent={[239,68,68]}`, never Glass or the Explainer split. @florentgpt profile picture and bio live in ~/Desktop/Florent GPT Videos/Instagram Profil/ (real cap selfie from ~/Downloads/IMG_7144.MOV, mirrored, on a violet gradient #7C3AED).

**2026-10-02, cap looks (Pius: "ab jetzt alle Videos auf Florent GPT mit der Cap"):** This replaces the blue look and the Hanna-scenery plan for @florentgpt.
- **GPT-N** uses the cap worn **forwards**: HeyGen look „Niklas Office -- 3“ `98e4ba1a4b64440184f567e336eaf0eb` (light-grey cap, white shirt, white wall, selfie angle).
- **GPT-S** uses the cap worn **backwards**. That look does not exist yet; Pius has to record a ~15 s reference clip. Until then, render no GPT-S video and fall back to no other look.
- The cap looks never appear on @florent_preusser.
- Binding table: `video-avatar-render` → „Looks per format“.


**2026-10-05: @florentgpt normal videos (GPT-N) use look "Niklas gpt normal" c4f527e4e42a44d5accef91353df798f** (no cap, navy zip shirt, office wall, tripod framing) with the nikstudio voice 6cc88d5a…, never the look's own default voice. Replaces the cap look 98e4ba1a for GPT-N. If a look name Pius mentions isn't in the list, ask instead of guessing (Pius was angry when the cap look was used twice).
