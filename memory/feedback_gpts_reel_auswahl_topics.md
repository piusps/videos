---
name: feedback_gpts_reel_auswahl_topics
description: GPT-S topics come from Pius' daily "Reel-Auswahl florentgpt satire" HTML (Plätze + Fassungen), not invented ad hoc
metadata:
  type: feedback
---

Since 2026-10-30, new @florentgpt satire scripts take their topic from the daily page "Reel-Auswahl florentgpt satire" (HTML with `const TAG = {...}`: plaetze → fassungen with kennung, hook, text, belege, test flag, notes like "Hook unklar"). Pius: "nimm die sonst zur geilen Themenfindung". Copies are kept in ~/.claude/florentgpt/satire/auswahl/.

**Why:** that page holds topics that were fact-checked, rated for hook clarity and measured against reel performance. Topics drafted ad hoc kept repeating old ones ([[feedback_gpts_no_repeat_topics]]).

**How to apply:**
- Use the latest Auswahl first, starting from Platz 1, and fix the notes it flags (e.g. "brutto" removed).
- Still check for repeats against runs, Desktop and logs. Example: Pfandbon/Steuer was already produced on 2026-10-30 as gpts-house-money.
- Then add the Gegenmittel part (guide, trigger word, "schick ihm das Video") following [[project_gpts_gegenmittel]].
- If no current Auswahl exists, ask Pius for it before inventing topics.
