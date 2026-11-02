---
name: video-social-copy
description: Phase 2 of the Superkind reel pipeline — writes all on-screen and post texts for a finished script - the intro text hook (sound-off scroll-stopper), the outro CTA hook, the Instagram caption (6-part formula + hashtags) and the TikTok caption (2-4 lines + hashtags), and bundles everything into texte.txt. Reads brief.md + script.txt from broll/runs/<topic>/, writes hooks.json + texte.txt. Use for "schreib die Captions", "Instagram/TikTok Text", "Text-Hook für das Video", "texte.txt", or as step 2 of heygen-video-generator. Handles both normal formats (FP-N and GPT-N, see section "Account florentgpt"); satire captions come from the satire orchestrators.
---

# Video Social Copy — Phase 2

**Input (from `/Users/pius/LinkedIn Generator/broll/runs/<topic-slug>/`):** `brief.md`, `script.txt` (from `video-script`; the trigger word is already fixed there).
**Output (same folder):**
- `hooks.json` — `{"intro": "Zeile 1\nZeile 2", "outro": "Kommentiere POSTFACH\nfür den Guide!"}`, consumed by `video-post-production` (`--hook`, `--end-hook`).
- `texte.txt` — everything the user copies when posting (format below).

**Out of scope:** the spoken script (`video-script`), how the hook pills look and are rendered (`video-post-production`).

## 1. Intro text hook (first ~5 s, for muted scrollers)

Most viewers watch the first seconds with sound off, so this text carries the core claim on its own. It's also the thumbnail (frame 0).
- **FP-N text hook = Profi-Preis gegen Claude-Zeit (Zernio-Analyse 2026-10-28):** die Ausreißer hatten alle eine Gegenüberstellung mit zwei Zahlen („Anwalt *600 €*\nClaude *10 Minuten*“, „AGB vom Anwalt 1.500 €\nClaude in *15 Minuten*“, Abmahnung „2.000 € / 5 Minuten“). Text-Hooks ohne Zahl („Kunde zahlt nicht / Claude *klagt*“) nur, wenn das Thema keinen Profi-Preis hat.
- **Vision hooks (FP-N): write a comparison as two accents**, old value first, new value last: `Mahnbescheid *2 Wochen*\nClaude *5 Minuten*`. The marker animation strikes the first accent and highlights the last (`video-post-production` → Vision intro hook). One accent = it gets the marker.
- **State the hook's result as a done fact**, like the top reels ("ChatGPT hat meine digitale Identität gelöscht", "Claude macht deinen Lebenslauf unablehnbar"). Don't copy the spoken sentence.
- Two lines via `\n`, each ≤ ~22 characters (the pill uses `nowrap`; a long line runs off-frame).
- **Text-hook writing rules (@kallawaymarketing guide, 2026-10-03):** subject + one of pain-point reminder / dream-outcome teaser / future state change; as specific as possible ("22 Tage" > "ein paar Wochen", "2.700 €" > "ein paar Tausend"); 1-3-word power words; no filler or transition words ("aber", "und", "deshalb"); **no punctuation except parentheses and quotation marks** (no colons, no exclamation marks); break the line where the phrase naturally breaks, never split a word pair that's read as one.
- **Text hook ≠ spoken hook:** if the script's first sentence names the problem, the text hook names the solution/outcome, and vice versa (`video-script` Step 3, rule 7).
- Digits and caps are fine here (on screen only, never spoken).
- Examples: Sekretariat → "Claude hat meine\nSekretärin ersetzt"; Mahnwesen → "So ersetzt Claude\nunsere Mahnsoftware!"

## 2. Outro CTA hook (last ~5 s)

Mirrors the script's own CTA wording + trigger word in caps: script ends "Kommentiere Website, um mein Guidebook zu erhalten" → "Kommentiere WEBSITE,\num mein Guidebook zu erhalten!". Break into 3 lines if a line would exceed ~22 characters. Minimal fallback: "Kommentiere:\nWORT". Always this script's trigger word, never a fixed one. Default on for every video; skip only if the user says so.

## 3. Instagram caption — 6-part formula (validated across every @alan.buildz post analyzed, same order every time)

1. **Problem awareness:** "Die meisten realisieren gar nicht, dass [Tool] heute schon [überraschende Fähigkeit]."
2. **Empathy/relatable pain:** "Du hast es selbst gespürt: [sehr konkreter, alltäglicher Schmerzpunkt]."
3. **Reframe:** "Der Punkt, den fast alle übersehen: [eigentliche Ursache statt offensichtliches Problem]."
4. **Common-mistake callout:** "Aber der Fehler, den fast alle machen: [spezifische, vermeidbare Fehlerquelle]."
5. **Steps restated briefly** + exclusivity line: "Den Teil hat gerade noch fast niemand auf dem Schirm."
6. **Lead-magnet justification + trigger-word CTA:** "Weil [Grund, warum es einen Guide braucht], hab ich dir einen kompletten Guide gemacht: [was drin ist]. Wenn du ihn willst: Kommentiere [WORT], folge mir, und ich schick ihn dir garantiert zu."

If the script uses a computed number (e.g. "elf Wochen"), add the calculation as one line so it's verifiable. End with 3-8 hashtags mixing niche tags (#ki #claude) and topic tags (#buchhaltung).

## 4. TikTok caption

Same trigger word and CTA, compressed to 2-4 lines: one hook-echo line, one pain line, one trigger-word + follow CTA line, then hashtags (broader trend-adjacent tags mixed with niche tags).

## 5. `texte.txt` format (reference: `broll/runs/postfach/texte.txt`)

```
THEMA: <Thema>
AVATAR: <Niklas | Niklas Office> (Digital Twin, Avatar V)
TRIGGER-WORT: <WORT>

STRATEGIC BRIEF
- Core Message: …
- Key Takeaway: …
- Cost of Status Quo: …
- Viewer Action: …

SKRIPT
<script.txt verbatim>

TEXT-HOOKS IM VIDEO
Intro: <Zeile 1> / <Zeile 2>
Outro: <Zeile 1> / <Zeile 2>

INSTAGRAM-CAPTION
<caption>

#hashtags

TIKTOK-CAPTION
<caption>
#hashtags
```

## Account florentgpt (format GPT-N, since 2026-10-01)

Read `format.json` in the run dir. For `"account": "florentgpt"` everything above applies, with these changes:
- **Audience is B2C (18-35, private use)**, not owners.
- **Caption = @mavgpt formula, not the 6-part formula** (Pius 2026-10-01, details `gpt-themen/references/mavgpt-themen.md`): line 1 `Kommentiere „WORT“ und ich schick dir [50 weitere / alle Prompts / den kompletten Guide] 👇`, optional 2-5 short lines (hook restated, steps, „Das Beste: …“), then 3-5 hashtags. Top reels often have only line 1 + hashtags.
- **Intro hook:** white box, black text, emoji at the end of line 2 (on screen only). **Outro hook:** `Folg mir und kommentier\n„WORT“, dann schick ich's dir 👇`. List reels also get one box per item (`hooks.json` → `"items": ["1. /human", …]`) and an optional mid re-hook box (`"mid": "So richtest du's ein 👉"`).
- **No Superkind** anywhere, no "Mittelstand", no company language.
- Hashtags B2C: 3-5, e.g. #ki #claude #chatgpt + one topic tag (#websitebauen #bewerbung).
- Income topics: no promises in hooks or captions (rules in `gpt-hype-script` → Ehrlichkeit).
- Satire formats (FP-S, GPT-S) don't use this skill; their caption comes from `reel-formate/references/satire-engagement.md`.

## Account felix (format BX-C, boilr, since 2026-10-06)

For `"account": "felix"` in `format.json` (Felix × boilr, "Claude for Recruiters", orchestrator `boilr-recruiter-reel`):
- **Everything in UK English.** Audience = UK recruitment agency owners and consultants; peer tone, no hype, max. one emoji per box.
- **Intro hook:** result + number ("12 UK companies about to hire. No job ad yet."); spoken hook ≠ text hook. **Outro hook:** `Comment "WORD"\nfor the prompts 👇`.
- **IG caption:** line 1 `Comment "WORD" and I'll send you [exact promise] 👇`, then 2-4 short lines (the 3 steps), one line `Claude for Recruiters · Ep. N`, then 3-5 hashtags (#recruitment #recruiter #recruitmentagency #claude #ai).
- **TikTok caption:** 2-3 lines + same hashtags. **LinkedIn text** (extra block in `texte.txt`): hook line, 3 steps as short lines, `Comment WORD and I'll DM you the prompts.`, no hashtag spam (max 3), plus a ready reply template for LinkedIn DMs (guide + soft boilr line + demo link https://meetings-eu1.hubspot.com/felix-hermann).
- **No pitch in video or caption**; boilr appears only in the DM funnel (`boilr-recruiter-reel/references/dm-funnel.md`). Never Superkind, Florent or Niklas.

## Check before handing on

- [ ] Trigger word identical in script, outro hook, both captions and (later) the guidebook.
- [ ] Every hook line ≤ ~22 characters.
- [ ] Instagram caption has all 6 parts in order; TikTok caption ≤ 4 lines + hashtags.
- [ ] No claim in the captions that the script or guidebook doesn't back up.
