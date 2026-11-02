---
name: project-gpts-gegenmittel
description: "Since 2026-10-27 every GPT-S satire (topics + effect 100 % unchanged) gets a matching evergreen \"Gegenmittel\" guide + outro + Zernio follow-gate funnel; per-video gegenmittel.json + log is a render gate"
metadata:
  node_type: memory
  type: project
  originSessionId: af482d1f-310b-456f-8c8f-591682dc74da
  modified: 2026-10-27T13:52:57.964Z
---

2026-10-27: @florentgpt had 5 followers after ~45.6k views (satire 1.4–2.6k views, ~0 comments; GPT-N "Kommentiere X" tutorials stuck at ~120 views). Pius: "aus den Videos einen Nutzen springen lassen … Guides, die zum Kontext passen und die die Leute wirklich immer haben wollen … wir brauchen viel Community".

Rules live in `~/.claude/skills/gpt-satire-reel/references/nutzen-bruecke.md`: satire stays 0,0 unchanged (same topics, effect still named — Pius: "an der Art der Themen darf sich 0,0 ändern"); AFTER the script, map its everyday situation to a guide from the Ewig-Wünsche table (17 existing GPT-N guides in broll/runs/gpt-*); never pick/drop/rewrite a topic because of a guide; hook stays pure satire, outro after the pointe (≤~28 words, concrete value, see feedback below); guide = "Gegenmittel #N"; `zernio-schedule.mjs` now attaches a `gpt` funnel for GPT-S with texts `funnel/gpts-funnel.json` (follow ask + closing question). Per video mandatory before render: `gegenmittel.json` in run folder + row in `~/.claude/florentgpt/satire/gegenmittel-log.md`. Backups of changed skills in ~/.claude/skill-backups/*-2026-10-27.

**Why:** satire gets reach but gives no reason to follow; evergreen guides were never seen.
**How to apply:** evaluate after 6 reels (skip at outro vs. follows from IG app). See [[project-reach-diagnosis]], [[project-gpt-gruender-satire]].

**2026-10-27 feedback on reel #1 (Neuer Teppich v1):** "mega arsch, keine Clarity, keine Value Proposition". v2: named figure + clear chain + damage number (200 € → 2.000 €), outro states concretely what you send ChatGPT and what you get back (with a number). Rule added to nutzen-bruecke.md §2 (outro now up to ~28 words).

**v4 feedback (2026-10-27):** viewer = Lenas Freund from sentence 1 ("Deine Freundin Lena …", pointe "Sei froh. Noch."). Outro must give a reason to comment: promise the ready-made messages + result vs damage (unter 100 € statt 2.000 €) + extra (Kauf-Bremse); never give away the do-it-yourself tip. Outro up to ~40 words.
**v5 feedback (2026-10-27):** outro in telegraph style was incomprehensible ("Bro, was ist das für ein Wording"). Outro = plain full sentences like talking to a friend: what I built for you, what it does for you (with number), comment word. No guide jargon.
