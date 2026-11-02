# AI Tool-Stack Playbook

Real, current (2026) technical substance behind the "how" teased in a script's Retain stage — and the actual content that goes into the lead magnet sent to people who comment the trigger word (see "Trigger-Word Lead Magnet CTA" in SKILL.md). A script that says "installier den Skill, gib ihm die Anweisung" needs this file to back it up with something genuine — otherwise the tease is a lie the DM follow-up can't pay off.

**Depth rule:** the script itself only needs enough of this to sound credible and specific (2-4 words naming the real mechanism — "Gmail-MCP", "Claude Skill", "Trigger-Word") — not a tutorial. The full depth below is for the DM/lead-magnet payload, not the spoken script.

## Secretary / Email & Calendar Automation (flagship — fully researched)

Three real tiers, by technical effort. Pick the one that matches the audience/CTA promise — don't oversell tier 3 complexity as if it were tier 1 setup time.

**Tier 1 — No-code, single person (~15 min setup):**
Claude's built-in Gmail and Google Calendar connectors (in Claude.ai / Claude Desktop settings → Connectors). Claude reads the inbox, drafts replies, checks/creates calendar events — sends require per-message approval by default, so nothing goes out without a human glancing at it first. This is the right tier for "probier's selbst aus" style CTAs.

**Tier 2 — No-code, multi-app (~30-60 min setup):**
Zapier's MCP endpoint, connected once to Claude, exposes Gmail, Google Calendar, and Zapier's wider catalog (9,000+ apps) through a single connection — useful when the "secretary" job spans more than just inbox + calendar (e.g. also touches a CRM or a scheduling tool). Good middle ground: still no custom code, more reach than the native connector.

**Tier 3 — Built, always-on agent (technical, agency/dev effort):**
A Gmail MCP server (Composio's is the most complete third-party option — full read/search/draft/organize/contacts access) wired into a standing agent built on the Claude Agent SDK or run via Claude Code, rather than a person opening a chat window each time. This is the actual "AI employee that never sleeps" tier — the one the biggest hook claims ("ersetzt deine Sekretärin") are really describing, and the one worth pointing high-intent leads toward in a follow-up call, not the first DM.

**The "Skill" layer, on top of any tier:** the connector/MCP only grants *access* — a Claude Skill (like the ones in this very project) is what encodes *how the secretary behaves*: which emails get auto-drafted vs. flagged for a human, the tone/voice to write in, what counts as urgent, a daily summary format. This is the literal, accurate answer to "welchen Skill installieren" in the script — write one Skill per client/use case, the same mechanism used to build the scripts skill itself.

## Image Generation

*Not yet researched in depth for this niche — before using specific tool names in a script or lead magnet, verify current options (this space moves fast: model releases change monthly). Placeholder note so this section isn't skipped silently.*

## Video Generation

*Ties directly into this project's own HeyGen pipeline (see `heygen-script-optimizer`) — for the video-generation-as-a-service angle (i.e. showing a Mittelstand business how to make its own AI videos), the tool stack is literally: this skill → HeyGen → editing tool. Worth building out as its own script topic once there's a concrete offer to describe.*

## Tax Filing (Steuererklärung)

*Higher stakes than the other categories — a wrong or outdated tool claim here isn't just an embarrassing correction, it can be genuinely misleading for a business's actual tax compliance. Do not name specific tax-automation tools or make capability claims in a script or lead magnet without verifying them first (current provider, actual certification/compliance status in Germany, what it can vs. can't legally do unsupervised). Flag this explicitly to the user rather than guessing when this topic comes up.*

## Expense Reports (Spesenabrechnung)

*Not yet researched in depth. The `heygen-video-generator` worked example for this topic (SKILL.md) uses a plausible, generic description (receipt OCR → category/cost-center matching → policy check → auto-submit) — accurate as a category of solution, but verify a specific real tool before naming one in a lead magnet.*

## Job Application / Résumé Automation (sourced from @gptmarlon, 2026-09-22 — creator-demonstrated, not independently re-verified beyond what's shown on screen)

**Caveat before using any of this in a script:** everything below is what the creator showed/claimed in their own videos, transcribed via Apify. Treat tool names as accurate (they're shown on-screen operating live) but treat outcome claims (interview counts, timeframes) as the creator's own unverified anecdote, not a guarantee — never restate their specific numbers as if we tested them ourselves.

- **Résumé gap analysis:** upload résumé + job description directly into a chat, prompt the model to role-play as a senior recruiter for that specific company and output a 0-100 match score, top missing keywords, and red flags a hiring manager would spot in under 10 seconds.
- **"Google-XYZ formula"** for rewriting bullet points: *Achieved X, measured by Y, through Z* — a real, nameable résumé-writing technique, safe to reference by name in a script (it's a known formula, not invented).
- **ATS-simulation prompt:** have the model role-play as both an ATS filter and a hiring manager skimming 200 résumés in one sitting, to find sections that would get skipped.
- **Claude Cowork:** used in-video to autonomously browse the user's LinkedIn profile and apply to matching jobs, tailoring each application to its job description.
- **Claude for Chrome:** used to walk through a list of job postings, open each application page, and fill in forms with the user's data — stopping before final submit so the human still clicks send.
- **Custom MCP connectors** (Customize → Connectors → Add Custom Connector in Claude's settings): the creator connected a Higgsfield MCP endpoint (`https://mcp.higgsfield.ai/mcp`) for résumé design/graphics, and an Indeed connector for live job search with match-scoring against the rewritten résumé.

## AI Text Humanization / Custom Skills via Skill Creator (sourced from @gptmarlon)

- Workflow shown: ask the model to list AI-generated-writing "tells" (referencing Wikipedia's own page on AI writing patterns as a citable source), instruct it to avoid every one of them going forward, then use Claude's **Skill Creator** (`/` slash command in-chat) to turn that one-off conversation into a persistent, reusable Skill — installed once, invoked afterward with a short slash command (the creator used `/human` or `/mensch`).
- This "turn a one-off chat into a permanent Skill so you never have to re-explain it" pattern is structurally identical to how this very project's own skills work — a credible, real mechanism worth actively building into future scripts as its own Retain/Reward beat, not just a tool mention.

## Personal AI Agent / "Jarvis" Setup (sourced from @alan.buildz)

*Higher uncertainty than other sections — these are less mainstream, faster-moving tools; verify current state before using in a lead magnet, same rule as Tax Filing below.*

- **Agent framework:** the creator used "Hermes Agent" (attributed to Nous Research, described as open-source) to turn a base model (Claude, Codex, or Gemini — model-agnostic) into a standing agent with persistent memory, rather than a person opening a chat window each time.
- **9-step setup shown:** give it a "home" (an old laptop, Mac Mini, or cloud server) → install the agent framework → pick a model → teach it who you are/your business → persistent memory → Skills → tool connections (email, calendar, documents, browser) → communication channels (Telegram, Slack, iMessage) + voice via "Hermes Voice" (attributed to ElevenLabs) → a custom UI built with Claude Design (claude.ai/design).

## Frontend/UI Design Skills for Claude Code (sourced from @alan.buildz)

Six named Claude Skills/MCP tools shown live improving Claude Code's frontend output, roughly in order of scope: **Impeccable** (20+ commands fixing typography/spacing/accessibility), **Taste** (pushes output away from generic "AI slop" toward deliberate design choices), **Awesome Design** (70+ real brand design systems — Airbnb, Apple, Nike, etc. — selectable and applied 1:1), **Skill UI** (reverse-engineers any website's design system from a URL), **21st.dev MCP** (library of ready-made UI components), **UI UX Pro Max** (50+ UI styles trained on 100+ UX guidelines). Real, checkable names — verify current availability/maintenance status before naming one as a specific recommendation, since community-maintained Claude Skills can go stale.

## Website / Webdesign (built from verified Claude Code capabilities + the Frontend/UI Design Skills section above)

Real, coherent four-stage workflow — each stage uses either an already-verified tool from this file or a standard, current Claude Code capability. Safe to reference in a script; full depth (exact commands, skill names) belongs in the DM lead magnet, not the video.

1. **Design-system extraction:** point Claude at a reference site (the client's existing site, a competitor, or just a Pinterest-style mood description) — **Skill UI** (already verified above) reverse-engineers the actual design system (colors, type scale, spacing, component patterns) from a URL, so the output isn't a generic template guess.
2. **Build, not drag-and-drop:** Claude Code writes the real site — HTML/CSS or a framework (Next.js, etc.) — page by page, directly in code. This is the credible point of contrast vs. Wix/Squarespace-style builders: it's bespoke code, not filled-in template slots, and it's also why it can match a specific brand system instead of looking like every other builder site.
3. **Self-review pass:** **Impeccable** (20+ commands fixing typography/spacing/accessibility) and **Taste** (pushes away from generic "AI slop" toward deliberate design choices) — both already verified above — run as a polish pass before anything ships; this is the real mechanism behind an "es prüft sich selbst" Reward-beat claim, not invented.
4. **Deploy:** Claude Code can run the actual deploy (e.g. `vercel deploy` / `netlify deploy` or pushing to a connected host) from the same session that built the site — "ein Befehl und die Seite ist live" is a literal, accurate claim, not exaggeration, for a standard static/Next.js site on a mainstream host.

**Cost-of-status-quo numbers for the hook (use real, defensible ranges, not the creator's own unverified anecdote):** German agency website builds commonly run **€3.000–€15.000** for a small business site, with **4–12 weeks** timelines and multiple revision rounds billed separately. DIY builders (Wix, Squarespace, Jimdo) are cheaper (~€10-30/month) but cost the owner's own hours and produce visibly template-based results — both are real, citable pain points, pick whichever the script's specific angle needs (cost vs. genericness vs. time).

**Caveat:** "matches a specific brand system" and "self-review pass" are real capabilities of the named tools, but final visual quality still varies by input quality and complexity — don't claim a guaranteed outcome (e.g. a specific conversion-rate or design-award claim) that these tools can't back up.

### No-code tier — same workflow, without Claude Code (real, current apps)

For a script angle aimed at non-technical viewers, or as the "wer nicht selbst coden will" aside: **Lovable**, **v0** (by Vercel), and **Bolt.new** (by StackBlitz) are real, current AI app/website builders that take the same "describe it, get a built site" prompt-in-chat approach as the Claude Code workflow above, without needing a code editor. All three: type a description or paste a reference URL/screenshot, get a live-editable site back, refine by chatting, one-click deploy. Weaker than the Claude Code + Skill UI/Impeccable/Taste stack on deep custom-brand-matching and fine control, stronger on speed-to-first-draft for someone who'd never open a terminal. Position as "same idea, easier entry point" in a script, not as inferior filler — it's a legitimate real alternative, not a strawman.

### SEO layer (technical, addable to the same build)

Real, standard technical-SEO elements Claude Code can generate directly as part of the same site build — not a separate tool, just additional output in the same session:
- **On-page basics:** unique `<title>`/meta-description per page, semantic heading structure (one `<h1>`, logical `<h2>`/`<h3>` nesting), descriptive alt-text on images, canonical URLs.
- **Structured data (schema.org):** JSON-LD markup for the business type (LocalBusiness, Organization, Product, FAQPage, etc.) — makes the site eligible for rich results in search, a genuine ranking/CTR factor, not cosmetic.
- **Technical must-haves:** auto-generated `sitemap.xml` and `robots.txt`, fast Core Web Vitals by virtue of hand-written code vs. bloated builder output (a real, defensible advantage over template builders, which ship a lot of unused CSS/JS by default).
- **Keyword/competitor research input:** feed Claude the target keywords and 2-3 competitor URLs directly in the prompt (via WebFetch/WebSearch or pasted content) and have it draft page copy and meta tags around them before the build — this is a prompting pattern, not a separate paid tool, safe to describe plainly in a script.
- **Verify before over-claiming:** "ranks higher" or "page 1 on Google" outcome claims are not something any of this guarantees — SEO is one input among many (backlinks, domain age, competition) the script/lead magnet should not promise a ranking result, only that the technical foundation is built correctly from day one.

**Example prompt (safe to paraphrase in a lead magnet):** "Baue die Seite technisch SEO-optimiert: eindeutige Title-Tags und Meta-Descriptions pro Unterseite, sauberes H1/H2-Grundgerüst, JSON-LD Schema für [Geschäftstyp], automatisch generierte sitemap.xml und robots.txt. Nutze außerdem diese 5 Ziel-Keywords: [Liste], und diese Wettbewerber als Referenz: [URLs]."

## Language Learning via Claude Projects (sourced from @alan.buildz)

Workflow shown: create a Claude Project, paste a system-instruction prompt so progress/level persists across sessions, then unlock 6 named "modes" via separate prompts within that project — Coach (daily practice question), Alltagsdrill (situational drilling: interviews, small talk, restaurants), Wording Check (native-speaker-level correction, 3 errors per pass), Vokabeldrop (5 new context-relevant vocab words/day), Stilspiegel (rewrite text as a native speaker would, with 5 takeaways), Notfallprompt (rapid pre-situation drilling, e.g. 2 minutes before a call). A clean, real pattern for "one Project + several named prompt-modes" that's directly reusable for other recurring-practice topics in our niche.

## Fitness/Habit Tracking via Claude Artifacts (sourced from @alan.buildz)

Workflow shown: a single long system-instruction prompt turns a new Claude Project into an interactive intake interview (one question per screen, React artifact UI) that computes calorie/macro targets (Mifflin-St Jeor formula, shown explicitly on screen) from the answers, then — once approved — that instruction block gets pasted into the Project's persistent instructions (not the chat) so a fresh chat in the same project can just be told "bau mir meinen Tracker" to generate a working calorie/macro tracker app, with meal logging via photo. Real, technically coherent pattern (Project instructions vs. chat messages matters for persistence) worth reusing for any "build me a personal tool" script in our niche.

---

*Add a new section here whenever a script's topic needs real backing — same accumulation principle as `swipe-file.md` and `performance-log.md`. Keep the depth rule in mind: this file can be as detailed as needed, the script itself never is.*
