---
name: project-office-format
description: "Second video format from 2026-09-29 — seated office scene with projector and plants, calm and premium, real talk about entrepreneur life and AI, not the fast reel style"
metadata:
  node_type: memory
  type: project
  originSessionId: 2426d8f8-711c-4b24-a616-b3bbe7be68ed
  modified: 2026-09-29T09:47:04.272Z
---

Since 2026-09-29 there is a second format next to the fast Superkind reels (red-light room, standing, heygen-video-generator skill). Its source is the digital twin recorded in `~/Downloads/IMG_7084.mov`: seated at a conference table, with a laptop, plants and a projector showing "Starte mit Superkind." in the background.

The digital twin was created 2026-09-29 as a separate avatar, "Niklas Office": group `46d869abd2214a45abaa23eb0767cc5c`, look `fc009bc15eb7276b9438c614324e5f89`. It was uploaded as Apple's avconvert 1080p SDR version, because the connector limit is 200 MiB and the source was 4K HLG HDR. Consent accepted and training completed on 2026-09-29. Voice `161b261919184b77b7460bdc05114cfa`, engines avatar_v, avatar_iv and avatar_iii.

**Why:** The user wants a calmer, more luxurious feel: "realer Klartext" about entrepreneur life, AI and business, not an "ADHS-Skript".

**How to apply (revised same day):** The user then asked for the normal reel package for this avatar too: hard hook, trigger word, per-beat B-roll (including one in the hook), speed cuts, text hooks and ≥50% hold at 3 s. So run the standard heygen-video-generator pipeline with this avatar. Only the calm, premium look is different, which means somewhat calmer seated gestures in the motion prompt. First video: topic Postfach (2026-09-29). The old reel pipeline and its rules stay unchanged for the red-room format. Related: [[feedback-heygen-connector-only]], [[feedback-video-run1]].

**Edit settings learned 2026-09-29 (Postfach A/B reels):**
- Render push-ins with `render-pipeline.mjs --zoom-focus 0.70,0.49`, which is Niklas's face point in this avatar's 1080×1920 frame. The user asked for zooms onto the face, not the frame centre.
- Hook B-rolls must start their content below ~440 px. The intro text-hook pills sit roughly at 150–380 px and would cover B-roll headers.
- Measured cost for this avatar: 36.5 s raw → 30 credits; hook-only render 6.5 s → 6 credits.
- A/B hook test: Reel A opens with "11 Wochen im Jahr nur E-Mails" (pain), Reel B with "Ich zeig dir, wie Claude dein Postfach in drei Schritten übernimmt" (proactive). Both share the same body, cut at "Schritt eins" (tightened 8.60 s in A).


**Update 2026-10-01 (Pius):** this seated calm look is now the **satire look for both accounts** (FP-S on @florent_preusser, GPT-S on @florentgpt), no longer a normal-reel format. Normal videos on both accounts use the blue look `42a2318d…`. See [[project-accounts-formats]].

**Update 2026-10-02 (Pius):** FP-S satire uses the **white-wall office look** `f4f3ac11af8f444e9904645e6cbacc5f` (Niklas centred at the table, white wall, navy jumper with shirt collar, hands folded at the start), not `fc009bc…` with the orange light and the Superkind projector. Satire also gets funny music now (Fluffing a Duck, ducked ~14 dB under the voice). On the white wall, serif titles must be dark ink (`SerifTitle ink`), white is unreadable. First video: `broll/runs/fps-chef-ki-kurs` (B-002).
