---
name: video-qc-delivery
description: Phase 8 of the Superkind reel pipeline — quality control and handover. Contact-sheets the final reel, runs the automated Gemini review (review-video.mjs, FINAL_RUBRIC), the scroller simulation and the frame-0/thumbnail check, sends failures back to the responsible phase skill, then builds the one Desktop folder per video (~/Desktop/Superkind Videos/<Datum> <Thema>/ with Video, Guidebook, Texte, Versionen, Rohmaterial, B-Roll) and reports with an honest 1-10 score. Also logs posted-reel analytics (retention curve, 3 s hold) into the performance log. Use for "prüf das Video", "QC", "liefer das Video aus", "Ordner anlegen", "hier ist die Retention-Kurve", or as step 8 of heygen-video-generator. Serves all four formats (FP-N, FP-S, GPT-N, GPT-S); Desktop root per account, see "Accounts and formats".
---

# Video QC & Delivery — Phase 8

**Input:** `/Users/pius/LinkedIn Generator/broll/runs/<topic-slug>/` with `<topic>-final.mp4` (latest version), `<topic>-guidebook.pdf`, `texte.txt`, plus all intermediates.
**Output:** `<final>.review.json`, `final-sheet.png`, `frame0.png`, the Desktop delivery folder, and the report to the user.

**Out of scope:** fixing things yourself inside this phase. A failure goes back to the phase that owns it (table in step 3), then QC runs again.

## 1. Look at it yourself

- `ffmpeg -i <final> -vf "fps=1,scale=216:-1,tile=6x6" -frames:v 1 final-sheet.png` and view it.
- Extract frame 0 (`frame0.png`) and the last frame (`frameEnd.png`) and view them.
- **Frame 0 = thumbnail:** hook pill 100% opaque and readable, strong framing, no awkward gesture (run 1: half-transparent hook and a pen stabbed at the lens).
- Motion within the first 0.5 s (push-in already running).
- Every B-Roll window shows what's said in it; captions readable, in the safe band, never on the face.
- Outro pill carries the right trigger word; nothing after the CTA.
- Listen to the audio: no clipped words at cuts, music under the voice, not over it; no spelled-out words.

## 1a. Watch the export (local, free, every format; added 2026-10-03)

```
cd "/Users/pius/LinkedIn Generator/broll" && node scripts/watch-reel.mjs --video runs/<run>/<run>-final.mp4 --raw runs/<run>/tightened.mp4 --cover runs/<run>/cover.jpg
```
Writes `runs/<run>/watch/` (~20 s): `cuts-sheet.png` (one frame per visual cut with its time), `hook-sheet.png` (0-3 s at 4 fps), `early-sheet.png` (3-10 s), `safezone-sheet.png` (Instagram's top bar, right action column and bottom caption block in red) and `report.md` (pacing, first visual change, first word, tail after the last word, possible audio clicks to listen to, LUFS/true peak, face saturation final/cover vs raw). View all four sheets and work through the review checklist from the @omgluka editing kit:
- **First second:** hook readable before anyone can swipe, whole face in frame (opening zoom ≤ 130 %).
- **Cuts:** no cut inside a word, no click/pop (listen at every time the report lists).
- **Text:** big on a phone, out of the red IG zones (caption, buttons on the right, top bar).
- **Colour:** skin looks like skin; face saturation within ±20 % of the raw clip, cover included (GPT cover 2026-10-02 was oversaturated).
- **Ending:** ends on the payoff/CTA; tail after the last word ≤ ~1.2 s (outro pill needs reading time).
- **Second opinion:** `review-video.mjs` (step 2) or the Instagram Video Analyzer MCP.

Report findings in the QC report; style changes (B-Roll, captions, cuts) only with the user's go.

## 2. Automated review

```
cd "/Users/pius/LinkedIn Generator/broll" && node scripts/review-video.mjs --video runs/<topic>/<topic>-final.mp4
```
Sends frame 0 + a 540p proxy to `google/gemini-2.5-flash` with `FINAL_RUBRIC` (`broll/scripts/lib/rubrics.mjs`) and writes `<video>.review.json` with `score`, `hold_3s_estimate`, `fix_first`. Needs OpenRouter credit; if it's unavailable, say so and deliver with your own review only.

**Scroller simulation on the final** (second pass after the script-stage one): at 0 s, 3 s, 8 s, 15 s and the payoff, "why would I keep watching *right now*?" Every checkpoint needs a concrete answer on screen or in the audio.

## 3. Fix loop

If `fix_first` or your own review names a problem, fix it in the owning phase and re-run Stage B + QC. Max two fix loops, then deliver and name the remaining issue.

| Problem | Owning skill |
|---|---|
| Weak hook, wording, pacing, spelled-out word in the script | `video-script` (+ re-render in `video-avatar-render`, costs credits: say so) |
| Frozen head, repeated gesture, voice | `video-avatar-render` |
| B-Roll off-topic, static, stock-looking, bad window | `video-broll` |
| Zooms, captions, hook pills, music, encode, silence cut | `video-post-production` |
| Caption/hook text wrong | `video-social-copy` |

## 4. Delivery folder (user rule 2026-09-28)

Everything for a video goes into `~/Desktop/Superkind Videos/<YYYY-MM-DD> <Thema>/`, never loose in ~/Downloads. `broll/runs/<topic>/` stays the working directory; the Desktop folder is what the user opens.

```
<YYYY-MM-DD> <Thema>/
├── <Thema> – Video.mp4          ← latest final
├── <Thema> – Guidebook.pdf
├── <Thema> – Texte.txt          ← texte.txt
├── (<Thema> – Cover/Thumbnail *.png, if made)
├── Versionen/                   ← every earlier final and preview
├── Rohmaterial/                 ← raw HeyGen avatar.mp4, tightened cut-outs
└── B-Roll/                      ← broll-N.mp4
```
Copy (don't move) from the run dir. The Studio app's deliver step writes the same structure.

## 4a. Accounts and formats (since 2026-10-01)

Read `format.json` in the run dir:
- **Desktop root:** @florent_preusser → `~/Desktop/Superkind Videos/`; @florentgpt → `~/Desktop/Florent GPT Videos/`; Felix (BX-C) → `~/Desktop/boilr Felix Videos/` (create if missing). Satire formats (FP-S, GPT-S) get the suffix ` (Satire)` in the folder name; GPT-S also the variant, e.g. `2026-10-02 Sprachnachrichten (Satire atzig)`.
- **Satire deliveries** have no Guidebook and no trigger word; the Abschluss-Checkliste items "PDF" and "trigger word in captions" are replaced by "caption + first comment per `reel-formate/references/satire-engagement.md`". Music: satire uses no music bed (only light UI pops), per `video-satire-edit`.
- **Normal formats** (FP-N, GPT-N): unchanged checklist; for GPT-N check that nothing mentions Superkind.

## 4b. Abschluss-Checkliste (mandatory before every delivery, user 2026-10-01: "mach alles, was ich dir sage")

Tick every line; anything open goes back to its phase before the report:
- [ ] **Music bed** under the voice (`pipeline.log` must NOT say "no music"; satire reels excepted).
- [ ] **Right music for the account:** @florentgpt = Vivaldi „Summer“ (never Eminem, never Fluffing a Duck); @florent_preusser = Eminem (FP-N) / Fluffing a Duck (FP-S); Felix (BX-C) = calm modern instrumental, none of the other accounts' beds. Check the `--music` path in `pipeline.log` or the satire ffmpeg finish.
- [ ] **SFX varied** (`vary-sfx.mjs` ran; no sample twice in a row, none more than 3×; no whoosh-airy / sub-hit).
- [ ] **Spoken trigger word** at the end + outro pill, identical in captions and guide.
- [ ] **Guidebook PDF** rendered and page-checked.
- [ ] **Cover PNG** (frame 0 + hook, LaunchCover with kicker "").
- [ ] **texte.txt** with Instagram + TikTok caption, trigger word correct in both.
- [ ] Loudness −14 LUFS, captions aligned to the very last word.
- [ ] Desktop folder complete (Video, Guidebook, Texte, Cover, Versionen, Rohmaterial, B-Roll).

## 5. Report to the user

**Always deliver the complete package in the same message, never only point to the folder (user rule 2026-10-01: "du vergisst immer alles"):**
1. SendUserFile the video (`display: "render"`).
2. SendUserFile the guidebook PDF and the cover PNG.
3. Paste the Instagram caption and the TikTok caption in the reply as copy-ready code blocks, plus the trigger word for the DM automation.

Then a short report:
- Where the folder is.
- The automated QC `score`, `hold_3s_estimate` and anything in `fix_first` still open.
- An honest 1-10 scroller score with the 0/3/8/15 s/payoff checkpoints.
- Costs: HeyGen credits used (from `heygen.json`), any OpenRouter spend (Wan/Seedance/QC).
- Ask for the retention chart once the reel is posted.

## 5b. Next: publishing

After the report, offer the upload + DM automation (`video-publish`). Don't publish without an explicit OK.

## 6. After posting: log the performance (learning loop)

When the user shares analytics for a posted reel, append an entry to `~/.claude/skills/video-script/references/performance-log.md` following its existing format: topic, date, hook type (template + hook formula + trigger axis), the first sentence verbatim, the retention curve points (especially **3 s hold**; target ≥60%), views, and one line on what to learn. Compare the 3 s hold across videos to see which hook types work, and if a pattern is clear, update the hook guidance in `video-script`.

Real data so far (Website reel, 2026-09-25): 100% → ~50% at 2 s → ~35% at 3 s → ~25% at 5 s, then almost flat (~20% → ~13%) to the end, a small normal dip at the CTA. The whole loss happened in the first 2-3 seconds.

> **Guide-Scroll ist Pflicht, kein Export ohne (Henri 2026-10-13):** Bei FP-N „Eingliederungszuschuss“ ging v1 ohne Guide-PDF und ohne Scroll raus, obwohl die Regel vom 12.10. galt. Deshalb: Guide-PDF (video-guidebook) **vor** dem Schnitt bauen, und jedes Reel mit Trigger-Wort/Guide-CTA bekommt den Guide-Scroll am Ende. Auch bei eigenen Opus-Kompositionen außerhalb der render-pipeline. Referenz-Umsetzung: `PdfScroll` in `broll/src/opus/EingliederungOpus.tsx` (PDF-Fenster fährt von unten ein, echte Seiten, Motion Blur über 8 Samples, Seitenzähler, Trigger-Pille bleibt oben; Swish + `sfx/heygen/extra/page-turn.mp3`). Ohne Guide-Scroll gilt das Reel als nicht fertig.

> **Bild-0-Check (2026-10-26, alle Accounts):** Vor der Auslieferung Bild 0 des Upload-MP4 extrahieren und ansehen. Hook-Headline muss komplett stehen, Caption sichtbar, kein angeschnittenes oder leeres Panel. Seit 2026-10-26 poppt in `FinalVideo.tsx` kein B-Roll-Segment mehr, das bei Bild 0 beginnt. Skiprate-Daten: `~/.claude/boilr/skiprate-analyse.md`.
