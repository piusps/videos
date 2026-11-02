---
name: project-trial-reels
description: Trial-reel recuts of old @florent_preusser 100k+ reels (started 2026-10-03) - sources, constraints, folder
metadata:
  type: project
---

2026-10-03: Pius wants old @florent_preusser reels with >100k views recut locally and uploads them himself as IG trial reels. Five qualify (public play count): DXToPUNCIQl Buchhalter/Excel 134k (2026-04-19), DYHTYu6o6oi 4 GitHub Repos 124k (05-09), DXM2y8YjiKK Website-Redesign 10k 124k (04-16), DXpJEvbiKVr Steuerberater/DATEV 118k (04-27), DYiLaFAorjb 5 Claude Skills 117k (05-19). Everything else peaks at 84k (DZqx09XI1DD).

Originals downloaded to ~/Desktop/Superkind Videos/Trial Reels/<NN Thema (views)>/Original.mp4. They are real-footage reels of Niklas (not HeyGen), IG-compressed 720p (DATEV one 1080p VP9 without audio track, audio must be fetched separately), with burned-in one-word captions, top hook titles and B-Roll. No raw footage on this Mac: CapCut drafts + ~/Documents/03_CONTENT/Raw_Footage are Pius' own other content.

**Why:** reuse proven winners for reach to non-followers without new production.
**How to apply:** recuts work from the finished file - new hook covering the old title area, cold open with a later strong line, cuts at sentence boundaries, zooms, speed. Each variant must differ visibly from the original. No guide trigger word in trial captions unless a per-post automation is built. Related: [[reference-instantdm-mcp]], [[project-hyperframes-hooks]].

**Prototype 2026-10-03 (Buchhalter):** tooling = `broll/runs/trial-<topic>/cut.py` (ffmpeg, one input per segment, cut points snapped to frames and checked against the audio envelope, first/last clean frame held over old flash transitions) + Remotion composition `TrialRecut` (Marker VisionHook, `hookScale`, optional dark title card hiding the old burned-in title; a blur band was rejected because it smeared the forehead). Variants: A = cold open with the payoff + original body, B = short ~27 s. Delivered to the Desktop folder with covers and `Trial – Texte.txt`; waiting for Pius' style OK before doing the other four.
