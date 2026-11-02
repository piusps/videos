---
name: project-instantdm-to-zernio
description: 2026-10-20 all IG DM funnels (FP waitlist, GPT guide, Felix demo funnel) rebuilt in Zernio; old posts paused until InstantDM is off
metadata:
  type: project
---
On 2026-10-20 Pius said to build the Felix funnels, make the waitlist flow live and switch everything from InstantDM to Zernio so InstantDM can be cancelled.

Built with `scripts/zernio-funnel.mjs` (comment automation with a button that starts a tap-only workflow), registry in `broll/funnel/registry.json`, migration script `funnel/migration/migrate.py`. 36 posts in total:
- Live right away: 5 FP posts that were already on Zernio (Datenschutz, Angebot, Aufträge, IBAN, Wissen) with the waitlist funnel, plus Felix "repost" with the demo funnel. Their old simple Zernio automations are paused.
- Created paused (they still run on InstantDM, so activating now would send double DMs): 17 older FP posts, 9 GPT posts, Felix leaders, job-cuts, before-the-ad and uni-job.
- Felix dropout and salary keep their simple Zernio guide automations.

**How to apply:** once Pius has switched off or cancelled InstantDM, run `node scripts/zernio-funnel.mjs on --all`. Not yet tested end to end from a second account. Posts older than the last 25 per account (except AGB and Gewerbemiete) were not migrated. See [[reference-zernio]] and [[feedback-zernio-automations]].
