---
name: gpt-gruender-satire
description: Since 2026-10-05 GPT-S satire scripts come from skill gpt-gruender-satire (founder figure), strictly separate from FP-S
metadata:
  type: project
---
Pius installed the "Gründer-Satire" skill (2026-10-05) for @florentgpt only, as skill `gpt-gruender-satire`; it is step 1 of `gpt-satire-reel`. Data in ~/.claude/florentgpt/satire/gruender/. normal/atzig rotation paused; `gpt-satire` only for explicitly atzig videos.

**Why:** Pius wants the founder satire completely separated from the @florent_preusser satire (ki-satire / fp-satire-reel stay unchanged).
**How to apply:** never use gpt-gruender-satire for FP-S; never write into ~/.claude/ki-satire/ from it. See [[project-accounts-formats]].

**v5 staged (2026-10-12), not live yet:** "/Users/pius/LinkedIn Generator/skill-staging/gpt-gruender-satire-v5" (+ portable `gruender-satire-skill-v5.zip` there). Adds "klar" (klarheit.md, test viewers sentence by sentence) and "menschlich" (npc-muster.md, scripts/npc-check.py). Pius chose: build separately, blind A/B test (3 topics, his ZIP v4 vs v5) before replacing ~/.claude/skills/gpt-gruender-satire, because the 07:00 automation uses the local skill. He kept the agent laugh-judges and Hanna as yardstick. On deploy: back up the old folder first. See [[satire-klar-und-menschlich]].

**Blind test result (2026-10-12):** v5 lost 0:2 against Pius' ZIP v4 (gruender-satire-skill (4).zip). The NPC reels (Fünf Tische 06.10. … Barnum 10.10.) all came from the old local skill (last changed 07.10.), which lacks the 09.10./12.10. rules. Do not deploy v5 as is; proposal pending: v4 + only the clarity part (klarheit.md) as v5.1, then install locally.
