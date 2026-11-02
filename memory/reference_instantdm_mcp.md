---
name: reference-instantdm-mcp
description: InstantDM MCP (Instagram comments/DMs/insights/ads for @florent_preusser) added 2026-10-01 at user scope as "instantdm"
metadata:
  type: reference
---

InstantDM hosted MCP server, added with `claude mcp add --transport http --scope user instantdm "https://openapi.instantdm.com/mcp?auth=<key>"` (key lives in ~/.claude.json, never repeat it in chat). Account: @florent_preusser, unlimited plan (2,000 credits shown). 23 tools: whoami, list_posts, list_comments, reply_to_comment, send_dm, list_conversations, get_conversation, get_contact_profile, get_account_insights, get_post_insights, list_ad_accounts, list_ads, list_ad_comments, reply_to_ad_comment, FB page tools, trigger_flow, create_or_update_contact, create_post, publish_post, disable_automation.

Read tools (insights, comments, posts) are free and safe; anything that sends/publishes messages real people → show exact text + target and get Pius' explicit OK per action. Useful for: reel performance (instead of Apify), checking trigger-word comments (VORLAGE, ABMAHNUNG …), ad comments. Related: [[project-workload-ads]], [[reference-content-idea-skills]].

Since 2026-10-01 the pipeline has Phase 9 `video-publish`: upload via create_post (after OK), comment automation built in the InstantDM dashboard via Claude in Chrome (MCP/API can't create automations): trigger word on this post → DM1 "Hey 👋 danke für deinen Kommentar! Hier ist dein Guide:", DM2 the PDF as file, DM3 "Viel Spaß damit 🙌 Wenn du Fragen hast, schreib mir einfach." Activation after OK, then check comments vs. delivered DMs. Since 2026-10-01 (later same day) the standard flow for EVERY video is: Ask-Follow gate (+1 timed reminder) → guide PDF → 90 s → "Hast du ein Unternehmen?" → Superkind waitlist pitch (200 € Startguthaben) → lead capture name/firma/mail/nummer → webhook into the Superkind waitlist Google Sheet via standalone Apps Script (video-publish/assets/waitlist-webhook.gs); full texts in the video-publish skill. Pius creates a non-follower test account. Hosting for create_post decided 2026-10-01: tmpfiles.org signed links (~5 min valid), details in video-publish §1; create_post may 504 but still publish, check list_posts before any retry. First upload: satire reel Dd93nBRnyKS (2026-10-01).

**@florentgpt (2026-10-02):** connected in the InstantDM dashboard (trial, 500 credits). Pius got an API key for it and registers a second MCP server `instantdm-gpt` himself (keys never written by Claude). After that: whoami on both servers before any upload; automations still only via the dashboard in Chrome.

**Limits found 2026-10-03:** get_post_insights returns "Application does not have permission for this action" for every post (no insights scope), so reel views come from Apify `apify/instagram-reel-scraper` (videoPlayCount, ~0.1 USD per full-account run). create_post has no trial-reel option; trial reels are uploaded by Pius manually in the IG app. Related: [[project-trial-reels]].
