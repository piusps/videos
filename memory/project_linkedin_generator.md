---
name: LinkedIn Post Generator Project
description: Full-stack Next.js app built for personal branding agency - LinkedIn post automation tool
type: project
---

Built a complete LinkedIn Post Generator application at /Users/pius/LinkedIn Generator/.

**Why:** User owns a personal branding agency for entrepreneurs. Wants to automate LinkedIn posting for clients so they only spend 2 hours/month but stay fully visible online.

**Tech Stack:**
- Next.js 15 (App Router) + TypeScript
- better-sqlite3 (SQLite database at data/app.db)
- @anthropic-ai/sdk 0.128 + zod structured outputs; model from ANTHROPIC_MODEL (default claude-opus-5), server-side fallbacks enabled
- LinkedIn OAuth 2.0 (custom, no NextAuth) with scopes: openid, profile, email, w_member_social
- LinkedIn REST API v202406 for posting (/rest/posts endpoint)
- node-cron for automated scheduled posting (runs via custom server.ts)
- JWT sessions (jose library) stored in httpOnly cookies
- Tailwind CSS dark theme with brand-600 purple accent

**Key Files:**
- server.ts - Custom server that starts Next.js + cron scheduler
- lib/db.ts - SQLite schema + helpers (accounts, posts, images, settings tables)
- lib/claude.ts - generateLinkedInPosts() and improvePost() functions
- lib/linkedin.ts - OAuth flow, createTextPost(), createImagePost()
- lib/scheduler.ts - Runs every minute, publishes scheduled posts
- lib/session.ts - JWT session management (async cookies API for Next.js 15)

**Rebuild 2026-09-28:** Content refocused on 4 pillars defined in lib/pillars.ts — Recruiting, KI-Integration, Personal Branding, Performance Marketing (Meta Ads) — each with subtopics, expert knowledge and angles; plus post formats, tones, a per-pillar "Ideen" generator, first-comment + image-idea output, and a `pillar` column on posts. Added local mode (/api/auth/local) so the generator works without LinkedIn OAuth. broll/ is excluded from tsconfig (it broke typechecking). better-sqlite3 must be built for native Node (npm rebuild better-sqlite3); electron:dev now rebuilds for Electron itself.

**How to apply:** When the user asks about this project, it's a complete working app. Start with `npm run dev` after creating .env.local from .env.example.

**Autopilot 2026-10-02:** lib/autopilot.ts + /autopilot page. Writes each post ~30 h before its slot (default 3×/week Mo/Mi/Fr 12:30 Europe/Berlin, from settings posts_per_week/default_post_time), macOS notification, goes live unless stopped (veto model). Every 2nd post = new pillar `young_founder` ("Mit 18 im Startup": Pius is 18, value for peers); personal posts only use real entries from the Story-Bank (stories table), never invented ones. Guards: only auto-publishes while the toggle is on, no [Platzhalter], ≥60 min review window, missed slot (>2 h, Mac off) → draft. First comment is posted via socialActions. LinkedIn API version bumped to 202609 (202406 was sunset). Open as of 2026-10-02: ANTHROPIC_API_KEY in .env.local was empty (Pius must add it), LinkedIn not yet connected, server not yet a launchd agent, profile text in settings is a draft from memory facts Pius must confirm. Frequency 3× chosen because the 12:00 video is also cross-posted to LinkedIn daily.
