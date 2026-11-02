---
name: video-guidebook
description: Phase 3 of the Superkind reel pipeline — builds the branded Superkind Guidebook PDF (credited "Florent Preusser × Superkind") that the trigger word promises. Since v3 (2026-10-22) every Superkind guide is a high-value playbook in console look - quick win, Superkind-vs-Claude paths, prompt library as consoles, verified GitHub links to skills/MCPs/prompts, terminal setups - plus the principle, requirements, exact click paths, fill-in templates, how to build the Claude skill yourself (interview prompt + complete SKILL.md), daily routine, pitfalls, CTA. Uses the v2 HTML→PDF generator in this skill's assets/, checks page breaks, writes guidebook.json + <topic>-guidebook.pdf to broll/runs/<topic>/. Use for "mach das Guidebook", "Lead Magnet PDF", "Guide zu X", or as step 3 of heygen-video-generator. Brand per account - --brand superkind for @florent_preusser, --brand florentgpt for @florentgpt, --brand boilr for Felix (BX-C, English).
---

# Video Guidebook — Phase 3 (the actual lead magnet)

The trigger-word CTA promises a real deliverable; this phase makes that promise true. The PDF is what the DM/comment automation (external to this skill) sends to everyone who comments the trigger word.

**Input (from `/Users/pius/LinkedIn Generator/broll/runs/<topic-slug>/`):** `brief.md`, `script.txt`, the trigger word.
**Output (same folder):** `guidebook.json` (content), `<topic>-guidebook.pdf`, plus page-check PNGs. `video-qc-delivery` copies the PDF into the Desktop folder as `<Thema> – Guidebook.pdf`.

**Out of scope:** the script and captions. Don't change the trigger word here; it must match `script.txt` exactly.

## Guidebook v3 — the bar for every Superkind guide (Pius, 2026-10-22, binding)

Pius' words: "die Guides sollen immer richtig krass sein mit crazy gutem Value, GitHub-Links zu Skills, MCPs und Prompts, alles in geilem Superkind-Branding mit Konsolen." The guide is the thing people screenshot and send to colleagues. A guide that only repeats the video fails, even if it's correct.

**Must be in every Superkind guide (`--brand superkind`):**
1. **Quick Win in 5 minutes**: a `callout` with `tone: "win"` right at the start. One prompt or one step that gives a real result before the reader reads on.
2. **Two ways side by side**: a `paths` block, "Mit Superkind" (tag `@Superkind` in Slack/Teams, the agent knows the context) vs "Mit Claude" (claude.ai or Claude Code, step by step). Anyone who doesn't know Superkind must feel it works with Claude too.
3. **Prompt library**: at least 6 complete `prompt` blocks (they render as consoles `claude ›`). They build on each other: research → check → produce → follow up → weekly improvement. Fill-in fields in `[brackets]`, output format stated, "erfinde nichts" wherever facts are involved.
4. **Stack with GitHub links**: one or two `repos` blocks with 6-12 repos, picked for the topic. Mix: at least 1 official Anthropic repo (skills/cookbooks), 2-4 MCP servers that fit (with the README install line), 1-2 prompt/skill collections. **Only verified repos**, see `references/link-library.md`, and its rules for adding new ones.
5. **Console setup**: at least one `terminal` block. Example: connect the MCP servers in Claude Code (`claude mcp add …`), install skills (`/plugin marketplace add anthropics/skills`), create your own skill folder. Comments (`# …`) explain each line in German. For readers without a terminal, give the claude.ai click path next to it.
6. **Build your own skill**: a complete `SKILL.md` as a `code` block (label contains "SKILL.md", so the cover counter counts it), plus the interview prompt that builds it for you.
7. **Pitfalls + rules** (`callout warn` / `checklist`): what goes wrong, limits (e.g. LinkedIn ~20 manual messages a day), data protection.
8. **CTA**: Superkind does it 24/7 in Slack/Teams.

**Look (built into the generator for `--brand superkind`, don't restyle per guide):** dark cover with a grid, kicker in console style `> …`, and a **value console** on the cover that counts the content automatically ("✓ 8 Prompts · ✓ 10 GitHub-Repos · ✓ 4 MCP-Server · ✓ 1 Skill"). Override it only via `cover.console`. Section heads look like `01 // TEIL 1`. Prompts are dark consoles with a "Kopieren" chip. Repo cards carry a GitHub icon, a kind badge (SKILL/MCP/PROMPTS/PLUGIN/REPO), stars, the install line, and are clickable in the PDF. Links in text: `[label](https://…)`. Typical length 8-12 pages.

**Self-check before handing on:** Would a founder forward this PDF to their team without being asked? Does every page give something to copy, click or install? If a page is only explanation, cut it or turn it into a prompt, console or checklist.

The other brands (`florentgpt`, `boilr`) keep their own rules below. `terminal`/`repos`/`paths` blocks work there too, but florentgpt guides stay jargon-free (no GitHub, no terminal).

## What every guide must contain (Guidebook v2, still valid as the base)

User feedback: "wirklich Mehrwert, erklär wie man die Skills selbst baut, designtechnisch schöner". We don't hand out skills ourselves, so the guide teaches the reader to build them:
- **The principle:** Connector (access), rules and tone (knowledge), Skill (work instruction).
- **Requirements:** plan, tools and time needed.
- **Setup with exact click paths:** Settings → Connectors; Settings → Capabilities → Code execution and file creation; Skills upload.
- **Fill-in templates:** the rule and tone files as ready `code` blocks.
- **Building the skill yourself, both ways:** A) a prompt that makes Claude interview the reader and build the skill ZIP; B) a complete, copy-paste `SKILL.md` (frontmatter `name` + `description`) plus the folder tree, the ZIP step and the upload.
- **Daily routine and weekly improvement prompt.**
- **Pitfalls:** description not triggering, tone, data protection.
- **CTA box.**

Full depth, not the script's tease: the real Claude skills and connectors (from `~/.claude/skills/video-script/references/ai-tool-stack-playbook.md`), actual menu paths, the exact copy-paste prompts. Typical length 7-8 pages.

**Accuracy rule:** if a topic's tool stack isn't researched in the playbook, or it's accuracy-sensitive (tax, legal), say so and keep claims conservative. A lead magnet with a fabricated tool name or a false capability claim is worse than a shorter, honest one.

## Branding (fixed, built into the template; don't re-derive)

Branded **Superkind**, credited **"Ein Guide von Florent Preusser × Superkind"**. Accent `#FF6B35`, body `#111111`, dark CTA box `#0A0A0A`, Inter, Superkind smiley logo (`assets/superkind-logo.svg`). Full brand: `~/.claude/skills/heygen-video-generator/references/brand.md`.

## Account florentgpt (format GPT-N)

For `"account": "florentgpt"` in `format.json`: render with `--brand florentgpt` (wordmark "Florent GPT", credit "Ein Guide von Florent GPT", no Superkind logo, no Calendly button, CTA = follow the account). **GPT-S Gegenmittel-Guides since 2026-10-28: `--brand florentgpt-arcade`** (neo-brutal look from the pixel reels, optional `cover.art` SVG, see gpt-satire-reel/references/nutzen-bruecke.md §4).

**Look since 2026-10-15 = the GPT-N video look "Weiß + Dunkelgrün"** (spec `~/.claude/skills/gpt-normal-reel/references/gpt-look-2026-10-15.md`), so the guide scroll at the end of the reel matches the video: white cover and pages, dark green `#0B3D2C` as the one main colour (titles, kicker, step numbers, chips, trigger pill, code blocks, CTA box), mint `#BFE3D2` only as flat background shapes (cover circle, CTA ring, never behind text), tint `#EAF2EE` for stat card, prompt boxes, facts and tip callouts. Titles, stat value and card numbers in **Inter Tight** 800/900 (`assets/fonts/InterTight-*.woff2`), body Inter. No gradients, no glow, no violet (the old `#7C3AED` look is retired), no other accent colours. All of it lives in the brand's `extra_css` in the generator; don't restyle per guide. Reference render: `broll/runs/gpt-zinsen/zinsen-guidebook.pdf` (3 pages). Content for consumers: free/cheap way first, every prompt copy-paste ready, no company setup (no connectors to Outlook/SAP), no Superkind mention; the `cta` object in `guidebook.json` gets a B2C text (e.g. "Folg mir für den nächsten Guide"). Income topics: realistic, no promises (see `gpt-hype-script`).

## Account felix (format BX-C, boilr)

For `"account": "felix"`: render with `--brand boilr` (English UI strings, boilr green `#0A5F45`, "b" logo, credit "A guide by Felix × boilr", CTA button "Book a 20-min demo" → HubSpot https://meetings-eu1.hubspot.com/felix-hermann). Content **in UK English** for agency professionals: every prompt copy-paste ready, the exact click path in claude.ai, a short "What to check" part (Claude can be wrong about funding dates/headcount: open the source links), UK GDPR note for candidate episodes (public sources, anonymised CVs), and a final section "Doing this every day?" that honestly says the manual way works but takes time, and boilr runs it 24/7 for 100+ agencies. The `cta` object: title e.g. "Want the signals every morning instead?", text one sentence on boilr.

**Plain-language rule for @florentgpt guides (Pius, 2026-10-01, binding):** written so that someone who has never used Claude can follow it alone. Claude only. Every step = one click or one input, with the exact click path as it appears on screen ("Unten links auf das Plus tippen → „Datei hochladen“"), a screenshot per step where possible (`image` blocks if added to the generator, otherwise a precise description), and the exact text to type in a copy box. No foreign words or jargon: no "Prompt", "Connector", "Workflow", "Setup", "Tool" — say "Nachricht an Claude", "Verbindung", "Ablauf", "Einrichtung", "Programm". If a Claude button is labelled in English, quote it exactly and explain it in German right after. Read every page with the question: would my mother get stuck here? If yes, rewrite.

## How to generate it

1. Write `guidebook.json` following the CONTENT SPEC in the header of `assets/generate_guidebook_html.py`: a dark `cover` (kicker, title, subtitle, stat, outcomes), `sections` built from blocks (`p`, `cards`, `steps`, `code`, `prompt`, `callout` incl. `tone: "win"`, `facts`, `checklist`, and since v3 `terminal`, `repos`, `paths`), and a `cta`. **v3 reference content: `broll/runs/fpn-100-agenten-tag2/guide3/guidebook.json`** (leads + LinkedIn). Old v2 reference: `broll/runs/postfach/guidebook-v2.json`.
2. Render (headless Chrome prints the PDF):
   ```
   python3 ~/.claude/skills/video-guidebook/assets/generate_guidebook_html.py --json guidebook.json --out <topic>-guidebook.pdf --html-out guidebook.html
   ```
   Missing Python modules on first use: `python3 -m pip install -r ~/.claude/skills/video-guidebook/assets/requirements.txt`.
3. **Check the page breaks:** render every page to PNG with PyMuPDF and look at each one (no orphaned headings, no code block split awkwardly, no half-empty page before a `break_before`). Fix with `break_before` and re-render.
4. Send the PDF to the user with SendUserFile when this phase runs on its own; inside a full run, `video-qc-delivery` hands it over.

## Legacy generator

`assets/generate_guidebook.py` (reportlab, 2-3 pages, spec in its header: `topic`, `title`, `trigger_word`, `intro`, `skills`, `connectors`, `steps`, `prompts`, `tips`) is the old v1 layout. Only the Superkind Studio app still uses it (`broll/studio/lib/jobs.mjs`). Don't use it for new guides unless the user asks.

## Check before handing on

- [ ] Trigger word in the PDF = trigger word in `script.txt`.
- [ ] Every section from the list above is present; every prompt is complete and copy-paste ready.
- [ ] No invented tools or capabilities.
- [ ] (Superkind) Quick Win, `paths` Superkind vs Claude, ≥6 prompts, 6-12 verified repos, ≥1 terminal, own SKILL.md: the cover counter shows it.
- [ ] Every GitHub link verified (link-library.md or checked in this run); install lines word for word from the README.
- [ ] Page renders checked visually.
