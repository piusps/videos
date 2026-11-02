---
name: heygen-video-generator
description: Orchestrator for format FP-N only - normal Superkind reels on @florent_preusser in the blue look (Mittelstand topics like Steuerberater, Mahnwesen, Abmahnung, Postfach). Send a bare business topic word and it runs the whole production end to end by chaining the phase skills - video-script → video-social-copy → video-guidebook → video-avatar-render → video-post-production (Stage A) → video-broll → video-post-production (Stage B) → video-qc-delivery → video-publish - and hands back one finished, postable package (video, Guidebook PDF, texts), stopping only at the Freigabe-Paket before upload. Use for "ein fertiges Video", "das komplette Paket", "Video zu <Business-Thema>". For a single phase, use that phase skill. Not for satire (fp-satire-reel) and not for @florentgpt (gpt-normal-reel / gpt-satire-reel); if account or format is unclear, use reel-formate first.
---

# Superkind Video Pipeline — Orchestrator

Input: one topic keyword or short phrase. Output: a finished reel plus its Guidebook PDF and texts, delivered in one Desktop folder.

This skill holds no production rules of its own. It holds only what every phase shares: the niche, the phase order, the handoff contract between phases, and the autonomous-run mandate. Every rule about *how* a phase is done lives in exactly one phase skill. When a rule changes, change it there, never here and never in two places.

## The niche (default context, override if the user says otherwise)

AI agents/AI employees taking over tedious, expensive or error-prone business work that a human (often an expensive one) currently does by hand, for Mittelstand decision-makers (owners, ops/finance leads). The signature emotional trigger: name a large, concrete, relatable cost the viewer already recognizes, then reveal that AI now does the same job, with a specific number the viewer can compare against their own spend. Two other validated trigger axes: **time saved** (a concrete hours/week figure) and **fear/loss of control** (privacy, compliance risk, data exposure; this axis produced the single best-performing example in all creator research, 65x the source creator's median views).

Brand (colors, type, logo, motion feel) for every visual phase: `references/brand.md`.

## Phase map

| # | Phase skill | Does exactly this | Needs | Writes to the run dir |
|---|---|---|---|---|
| 1 | `video-script` | Strategic core, template, retention architecture, the spoken script, trigger word, script gate | topic | `brief.md`, `script.txt` |
| 2 | `video-social-copy` | Intro/outro text-hook wording, Instagram caption, TikTok caption, `texte.txt` | `brief.md`, `script.txt` | `hooks.json`, `texte.txt` |
| 3 | `video-guidebook` | The lead-magnet PDF the trigger word promises | `brief.md`, `script.txt`, trigger word | `guidebook.json`, `<topic>-guidebook.pdf` |
| 4 | `video-avatar-render` | Voice/performance cues, motion prompt, HeyGen render with locked defaults, raw-audio check | `script.txt` | `avatar.mp4`, `heygen.json`, `rawcheck.txt` |
| 5 | `video-post-production` **Stage A** | Silence cut + word timings on the tightened timeline | `avatar.mp4`, `script.txt` | `tightened.mp4`, `captions.json` |
| 6 | `video-broll` | One new Remotion animation per beat, windows picked from the word timings | `script.txt`, `captions.json` | `broll-N.mp4`, `broll-windows.json`, `brolls-sheet.png` |
| 7 | `video-post-production` **Stage B** | Zooms, captions, B-Roll cut-ins, text hooks, speed ramp, music → final | everything above | `<topic>-final.mp4` |
| 8 | `video-qc-delivery` | Automated + scroller QC, fix loop, Desktop folder, report to user | final + all texts | `~/Desktop/Superkind Videos/<date> <Thema>/` |
| 9 | `video-publish` | Upload the reel via InstantDM (after OK), build the comment-to-DM automation in the InstantDM dashboard (trigger word → DM 1 short, DM 2 PDF file, DM 3 short), activate after OK, check it delivers | Desktop folder, trigger word | live reel, `publish.json` |

**Run dir:** `/Users/pius/LinkedIn Generator/broll/runs/<topic-slug>/` (lowercase, no spaces, e.g. `postfach`, `erechnung`). Every phase reads its inputs from and writes its outputs to this folder under the file names above. That contract is what lets any single phase be re-run on its own ("mach nur die B-Rolls neu") without touching the others.

**Parallelism that saves wall-clock time:** phases 2, 3 and the B-Roll *building* (not the window picking) run while HeyGen renders phase 4. Phases 5 → 6 → 7 → 8 are strictly sequential.

**No second camera (user decision 2026-09-29: "Cam 2 macht gar keinen Sinn").** Cam 2 is not part of the pipeline anymore. `video-cam2` only runs when the user explicitly asks for a camera switch on a specific video.

## Running a full video

1. Load `video-script` and produce `brief.md` + `script.txt`. Its script gate must pass before anything that costs money.
2. Load `video-avatar-render` and submit the HeyGen render right away (it takes minutes).
3. While it renders: `video-social-copy`, then `video-guidebook`, then start `video-broll` compositions from the script beats.
4. When the avatar is back: `video-post-production` Stage A → `video-broll` windows + renders → `video-post-production` Stage B.
5. `video-qc-delivery`: QC, fix loop, **Abschluss-Checkliste (music, varied SFX, PDF, cover, both captions)**, Desktop folder, final report with every file sent and both captions pasted.
6. `video-publish`: upload via InstantDM, DM automation with the PDF, delivery check. Every upload and every activation needs Pius' explicit OK.

Load each phase skill only when you reach it, and follow it fully. Don't paraphrase a phase's rules from memory.

## Autonomous mode (standing user go, 2026-09-24)

The user has authorized end-to-end autonomous runs: topic in → finished video out, **no script-approval stop**, HeyGen spend pre-approved. That makes the script gate in `video-script` mandatory, since nobody reviews the script before credits are spent. No clarifying questions unless the topic is genuinely unguessable from one word, or it's accuracy-sensitive (tax, legal) in a way where a guess would mislead.

Outside autonomous mode (the user explicitly asks to review the script first), stop after phase 1 and wait for approval before phase 4.

## Format and look (since 2026-10-01)

This orchestrator is **FP-N only**: normal videos on @florent_preusser. Write `format.json` = `{"account":"florent_preusser","format":"FP-N","variante":null}` into the run dir first. Look: the **blue look** `42a2318d57c0439c81ef02e02c11d6c0` (standard since ~2026-09-30, details in `video-avatar-render` → "Looks per format"). The seated office look is reserved for satire now. All four formats on both accounts: `reel-formate`.

Phase 9 (`video-publish`) builds the full Lead-Gen automation (follow gate → guide → Superkind waitlist capture), not the old 3-DM flow.

## Superkind Studio app (built 2026-09-27)

The same pipeline also runs as a local web app with no Claude session: `broll/studio/server.mjs` at http://localhost:4747, started by `Superkind Studio.command` (Desktop or `broll/`). The app reads the SKILL.md files of this skill and of `video-script`, `video-social-copy`, `video-guidebook`, `video-avatar-render`, `video-broll`, `video-cam2` (for the optional camera step), plus `video-script/references/`, fresh for every call (list in `broll/studio/lib/skill.mjs`, `SKILL_FILES`). Rule changes in those skills reach the app automatically. When you add a new output or a new hard rule to a phase, keep `PACKAGE_SCHEMA` and `gate()` in `broll/studio/lib/skill.mjs` in sync.
- Flow per video (`studio/lib/jobs.mjs`): script package via OpenRouter + deterministic gate (max 3 drafts, never renders a failing script) → Guidebook PDF → HeyGen v3 REST render → silence cut + transcribe → UI B-Roll via the data-driven `TopicBroll` composition → optional Cam 2 (off by default) → `render-pipeline.mjs --skip-silence-cut` → Gemini QC → delivery folder.
- Jobs resume where they stopped; the HeyGen video_id is saved at submit, so a render is never paid twice.
- The app renders through the HeyGen **API wallet**, which is separate from the plan credits the connector uses (see `video-avatar-render`).

## Learning loop

One knowledge base for all phases, no separate logs per skill:
- Competitor examples and hook research → `~/.claude/skills/video-script/references/swipe-file.md`, `hook-formulas.md`.
- How a posted video performed (retention curve, 3 s hold, views) → `~/.claude/skills/video-script/references/performance-log.md` (the `video-qc-delivery` skill describes what to log).
- New user feedback on a phase → into that phase's SKILL.md (and, for QC-relevant rules, `broll/scripts/lib/rubrics.mjs`).

Previous monolithic version of this skill (before the split on 2026-09-29): `~/.claude/skill-backups/heygen-video-generator-2026-09-29/`.

## B-Roll-Stil ab 2026-10-08 (Henri)

Hook und alle B-Rolls als Dopamin-Split-Panels (HookKit/DopamineHook, Casino-/Slot-Icon-Stil, Grunddesign weiß/grün/orange). Siehe video-broll → „Dopamin-Split-B-Rolls als Standard“. Hat Vorrang vor älteren Stil-Angaben in diesem Skill.

> **Satire auf @florent_preusser: 15–20 s (Henri 2026-10-12):** Satire-Reels (FP-S) so kosteneffizient wie möglich: Ziel 15–20 s Video, d. h. Sprechtext ca. 40–55 Wörter, eine Pointe, maximal 3 Beats. Spart HeyGen-Credits (~13–17 pro Reel).
> **Korrektur (Henri 2026-10-15):** Normale FP-Videos (FP-N) laufen auf @florent_preusser weiterhin, die frühere Aussage „nur noch Satire“ gilt nicht. FP-N bleibt bei den normalen Regeln (110–140 Wörter, 30–35 s, Guide + Trigger-Wort).

> **Guide-Scroll-B-Roll (Henri 2026-10-12):** Wird am Ende der Guide/das Guidebook/PDF erwähnt (CTA „steht im Guide“, „Kommentiere X …“), dort eine B-Roll mit dem echten Guide-PDF einblenden: alle Seiten (meist 7–8) als Seiten-Renderings (z. B. `pdftoppm -r 80`) schnell durchscrollen, leicht schräg/3D, mit Tempo und Motion Blur im normalen Schnittstil, damit der Zuschauer sieht, wie viel Wert er bekommt (optional Seitenzähler „8 Seiten“). Nur wenn es zeitlich und inhaltlich passt: Wird in dem Moment noch etwas Wichtiges gesagt oder gezeigt, hat das Vorrang. Gilt für alle Reels mit Guide (FP-N, GPT-N, Felix).
> Guide-Scroll Dauer: ca. 1,5–3 s. Echte Guide-Seiten, falls vorhanden; sonst sauberer Nachbau mit Titel und Kapiteln. Gilt für alle Accounts.

> **Guide-Scroll ist Pflicht, kein Export ohne (Henri 2026-10-13):** Bei FP-N „Eingliederungszuschuss“ ging v1 ohne Guide-PDF und ohne Scroll raus, obwohl die Regel vom 12.10. galt. Deshalb: Guide-PDF (video-guidebook) **vor** dem Schnitt bauen, und jedes Reel mit Trigger-Wort/Guide-CTA bekommt den Guide-Scroll am Ende. Auch bei eigenen Opus-Kompositionen außerhalb der render-pipeline. Referenz-Umsetzung: `PdfScroll` in `broll/src/opus/EingliederungOpus.tsx` (PDF-Fenster fährt von unten ein, echte Seiten, Motion Blur über 8 Samples, Seitenzähler, Trigger-Pille bleibt oben; Swish + `sfx/heygen/extra/page-turn.mp3`). Ohne Guide-Scroll gilt das Reel als nicht fertig.
