---
name: reference-content-idea-skills
description: Content-idea skills installed 2026-09-30 (ersetzt-radar, ki-satire, ki-satire-skript, ai-takes) and where their data lives
metadata:
  type: reference
---

Installed 2026-09-30 from the user's packages (ersetzt-radar-paket.zip, ki-satire-paket.zip):
- `~/.claude/skills/ersetzt-radar` — scores "Claude ersetzt [Pflicht-Experte]" topics; data in `~/Documents/ersetzt-radar/` (radar.xlsx, config.json), script `scripts/radar.py` (needs openpyxl, installed with pip --user). Top on install: Arbeitsvertrag, AGB, Gewerbemietvertrag (score 90).
- `~/.claude/skills/ki-satire`, `ki-satire-skript`, `ai-takes` — help.hannaa-style satire ideas and avatar scripts; shared backlog/log/scripts in `~/.claude/ki-satire/` (backlog.md B-NNN briefings).

Satire scripts use their own avatar punctuation rules; when one goes into the reel pipeline, still apply the HeyGen-safe spelling from [[project-linkedin-generator]]'s video-script skill (no digits, no caps). Related: [[project-workload-ads]].
