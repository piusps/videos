---
name: superkind-economy
description: "Money counter + sealed outcome table for the \"Superkind baut eine Firma\" vote series; phase 1 (votes Tag 1–4) every option wins, normal cycle from Tag 5"
metadata:
  node_type: memory
  type: project
  originSessionId: 9659f335-56a5-4b4d-8a4c-b39d2d71f782
  modified: 2026-10-21T18:14:03.813Z
---

Since 2026-10-21 the vote series has a fixed economy (Pius' request): HUD money counter ("KASSE" + bar to next upgrade), shop ladder (Domain 15 € … Firmenturm 1 Mio), risk/potential labels on every option, and outcomes sealed before posting.

**Why:** viewer decisions must visibly change what the company can buy and how it scales; first 5 videos reward every vote so people come back.
**How to apply:** data in `broll/src/compositions/superkindEconomy.ts` (SHOP + EPISODES), rules + Phase-1 outcome table in `~/Desktop/Superkind Videos/_Serie Superkind baut Firma/wirtschaftsbuch.md`. Each new episode: read the sealed outcome, show delta flying into the counter, tick shop items, add the bought thing to the world, enter both outcomes of the new vote before posting. Related: [[series-storybogen]].
