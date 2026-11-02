---
name: feedback-superkraft-test-topics
description: "While testing skill superkraft-themen, never output topics from Pius' own example list"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 9659f335-56a5-4b4d-8a4c-b39d2d71f782
  modified: 2026-10-21T10:16:14.852Z
---

While the skill `superkraft-themen` (~/.claude/skills/superkraft-themen) is not yet verified, test runs must not return topics from Pius' example list: Traumjob finden, Websites erstellen, Videos cutten, Business-Ideen bewerten, kostenlose KI-Zertifikate, Claude programmiert wie ein Dev, eigene Apps erstellen (incl. games built with Claude), Apps reverse-engineeren/nachbauen. Those are parked in ~/Documents/content-themen/log-superkraft.md (S-001, S-002, S-004, S-006, S-008).

**Why:** The test should show whether the skill finds topics *like* his examples on its own, not reproduce them (2026-10-21).
**How to apply:** Filter these out at step 1 of every test run; lift the rule once Pius says the skill is verified. Related: [[project-accounts-formats]]
