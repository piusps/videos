---
name: reference-firma-spy
description: "firma-spy data lives in _Serie Superkind baut Firma/spy/; Apify reel scraper at monthly limit, use logged-out in-app browser fallback"
metadata:
  node_type: memory
  type: reference
  originSessionId: 9659f335-56a5-4b4d-8a4c-b39d2d71f782
  modified: 2026-10-26T15:20:20.029Z
---

firma-spy (series @pickthecompany) keeps kanaele.md (18 channels), reels.csv, analysen/, muster.md (M-001..M-011) in `~/Desktop/Superkind Videos/_Serie Superkind baut Firma/spy/`. First run 2026-10-26.

- Apify `apify/instagram-reel-scraper` hit the monthly limit on 2026-10-26.
- Fallback: in-app browser, logged out, `/<handle>/reels/`. Take a screenshot first (the hidden pane does not render the grid otherwise), then read the views from the anchors with JS.
- Never log in.
- Exclude paid ads: `INSTAGRAM.AD` in the efg of the mp4 URL, plus likes far below the views.
- Closest style matches to @claudebyseb: @lorisbot01, @opusjake, @buildwithomkar, @99hud.

Related: [[project-firma-serie]]
