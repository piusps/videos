---
name: feedback-broll-unique
description: "Every B-Roll must be a new local Remotion animation that shows its script beat, not the reused landing-page template"
metadata:
  node_type: memory
  type: feedback
  originSessionId: e8ab139b-76df-442f-9d89-9ccff3375f63
  modified: 2026-09-28T08:44:20.952Z
---

User (2026-09-28): "immer wieder dieselbe B-Roll". Each B-Roll must be its own new animation in Superkind glass style that visualises exactly what that script beat says (e.g. inbox with an XML attachment, a Pflichtangaben scan checklist, XML morphing into a readable invoice, invoices flying into folders). Build them locally in Remotion, never via HeyGen, each 2–3 s (max 4 s), with the avatar in frame most of the time.

**Why:** the generic TopicBroll/WebsiteScrollBroll landing-page scroll looked the same in every cut and didn't relate to the words.

**How to apply:** put a new file per video in broll/src/compositions (see ERechnungBrolls.tsx) and use the shared src/components/GlassKit.tsx. TopicBroll is only a fallback; the Studio app still uses it, see [[project-superkind-studio]].
