---
name: feedback-real-logos
description: "Only original app logos in videos (official SVGs in broll/public/logos via BrandLogo), never self-drawn marks"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 8115312c-9f4c-4e34-9433-cedaa347847b
  modified: 2026-10-20T16:11:19.959Z
---

Pius 2026-10-20: the hand-drawn Slack hash in BrandMarks.tsx read like a swastika in the vision video. Always use the real logos of the real apps.

**Why:** a self-drawn mark can look wrong or offensive, and fake logos look cheap.

**How to apply:** BrandLogo now renders official SVGs from broll/public/logos (slack, teams, outlook, gmail, sheets, drive, calendar, whatsapp, chatgpt, claude, sap, dropbox; from Wikimedia Commons) and falls back to Simple Icons (hubspot, datev …). For a new app, download its official SVG into public/logos and check a thumbnail before use. Related: [[project-vision-schwarm]].
