---
name: reference-zernio
description: Zernio API connected 2026-10-16 for scheduling posts; script broll/scripts/zernio-schedule.mjs, key ZERNIO_API_KEY in broll/.env
metadata:
  type: reference
---
Zernio (docs.zernio.com, base https://zernio.com/api/v1, Bearer key) is connected since 2026-10-16. Key: `ZERNIO_API_KEY` in broll/.env (set via broll/scripts/set-zernio-key.sh, which strips paste escape codes and validates). Connected account: Instagram @florent_preusser (accountId 6ad1f3276d875a165b145114). @florentgpt connected 2026-10-16 (accountId 6ad2402d2cb8b401414c7b16). @moustacherecruiter (Felix) connected (6ad37573ed0fd3de6bd7bf19). @pickthecompany (Superkind-baut-Firma vote series) connected 2026-10-21 (6ad902418ceebdfb359dd0f7); Tag 1 v7 posted 2026-10-21 20:23 (post 6ad9029ad8ba06b467922385). Connect links: GET /v1/connect/instagram?profileId=6ad10bb001681e77d331a87a (Pius must switch to the target IG account first).

Use `node scripts/zernio-schedule.mjs --video … --cover … --caption-file … --at "YYYY-MM-DD HH:MM"` (Europe/Berlin; presign upload → POST /v1/posts, cover via instagramThumbnail, optional --trial, --first-comment, --draft); `accounts`, `list`, `delete <id>`. Network calls need the sandbox disabled. Posting/scheduling still needs Pius' OK per video. InstantDM comment automation is separate (not in Zernio). See [[feedback-instantdm-all-comments]].
