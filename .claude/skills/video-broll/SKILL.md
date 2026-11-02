---
name: video-broll
description: Phase 6 of the Superkind reel pipeline — builds the B-Roll. One new, self-coded Remotion animation per script beat in the Superkind glass style (GlassKit), showing exactly what that sentence says; Seedance image-to-video via OpenRouter only for cinematic motion Remotion can't draw. Picks the 2-4 s windows from the word timings on the tightened timeline, renders each clip at its window length, contact-sheets every clip, writes broll-N.mp4 + broll-windows.json to broll/runs/<topic>/. Use for "mach die B-Rolls", "neue B-Roll für Satz X", "B-Roll passt nicht zum Gesagten", or as step 6 of heygen-video-generator.
---

# Video B-Roll — Phase 6

**Input (from `/Users/pius/LinkedIn Generator/broll/runs/<topic-slug>/`):** `script.txt` (beats), `captions.json` + `tightened.mp4` (word timings from `video-post-production` Stage A).
**Output (same folder):** `broll-1.mp4 … broll-N.mp4`, `broll-windows.json`, `brolls-sheet.png` (or `sheet-N.png`), and one new composition file in `broll/src/compositions/`.

**Out of scope:** cutting the clips in (that's `video-post-production` Stage B), anything over the avatar footage.

The building part (steps 1-2) can start from `script.txt` while HeyGen renders; the timing part (steps 3-4) needs `captions.json`.

## Hard rules (user rules 2026-09-24 → 2026-09-28)

- **A new animation per beat that shows exactly what is being said** (user: "immer wieder dieselbe B-Roll"). E-Rechnung example: an inbox with an XML attachment, a Pflichtangaben scan checklist, XML morphing into a readable invoice, invoices flying into folders. Never the same B-Roll twice, neither inside one video nor across videos; never an unrelated generic landing-page scroll.
- **Short cut-ins:** each clip **2-3 s, max 4 s**. The avatar stays in frame most of the video; B-Roll is not a second main track. Typically 3-4 clips per 30 s reel.
- **Animated throughout:** constant motion (elements building, sliding, counting, scrolling), never a held still. Content visible from frame 0 for a clean hard cut-in.
- **One consistent Superkind look across all videos:** clean Apple-style UI, glassmorphism/frosted-glass cards, soft depth, drifting orange glow orbs on a dark base, `#FF6B35` accent, Inter-like type, staggered blur-to-sharp reveals. Brand tokens: `~/.claude/skills/heygen-video-generator/references/brand.md`.
- **Never stock-footage look:** no rooms, desks, offices, people, hands, generic "business" scenes (run 1: a white card on a desk read as a stock image, explicitly unwanted). Techy software/startup UI only: apps, dashboards, inboxes, documents, terminals, data.
- **No real brand names/logos** in the UI; short texts that fit.
- **Never rendered by HeyGen** (no Video Agent, no Seedance through HeyGen). HeyGen renders only the avatar.

## 1. Plan the beats

List the script sentences that get a B-Roll and what each clip shows:

| Beat | Treatment |
|---|---|
| First sentence (hook, frame 0 → ~1.5 s) | Talking head + intro hook pill. The hook stops the scroll on a face. |
| Right after the first sentence (~1.5-6 s) | **"Finished result" or pain clip**: the "das will ich auch" moment (script rule: show the result early). |
| Each numbered step | Its own animation of exactly what that step does for the viewer (the UI, the document, the process). |
| Counter/contrast moment | Stays on the talking head; a zoom carries it (no counter card). |
| Plain connective sentences, payoff sentence, CTA | Talking head (the outro pill carries the trigger word). |

## 2. Build — Type A: Remotion (default, 1 file per video, zero cost)

- New file `broll/src/compositions/<Topic>Brolls.tsx` (reference: `ERechnungBrolls.tsx`), built from `src/components/GlassKit.tsx` (glass cards, glow, easing, `useClip`). The look originated in `WebsiteScrollBroll.tsx`; reuse the kit, never its content.
- Register every clip in `src/Root.tsx`, 1080×1920, 25 fps, `durationInFrames` = window length (75 = 3 s). Set the final length after step 3.
- Render: `npx remotion render src/index.ts <Id> runs/<topic>/broll-N.mp4 --crf=10 --jpeg-quality=100` (near-lossless; only the final encode compresses).
- Motion per brand: one easing curve (ease-out-expo), text = fade + small rise, cards = soft scale, counters count over the full hold.
- `TopicBroll` (data-driven landing page) is only the Studio app's fallback; don't use it in a Claude run.

## 2b. Build — Type B: Seedance via OpenRouter (only what Remotion can't draw)

For cinematic motion, 3D depth, camera moves, light/reflections. Still bound by the no-stock rule.
- Preferred: **image-to-video** — render the start frame as a Remotion still (`npx remotion still …`), then let Seedance animate it with a camera move. Pure text-to-video only for abstract tech visuals.
- `node scripts/generate-broll.mjs …` (header has the CLI): `POST /api/v1/videos`, async submit → poll → download, `frame_images` first frame as data URL, `aspect_ratio "9:16"`, `resolution "1080p"`, `generate_audio: false`. The model is resolved at runtime from `GET /api/v1/videos/models` (newest Seedance; `--model` to pin). The Superkind style + no-stock "Avoid" block is appended automatically.
- Key: `OPENROUTER_API_KEY` in `broll/.env` (never pasted into chat). Costs money; the OpenRouter account ran dry once (2026-09-27), so check credit first.
- QC is built in: the start still is checked (`STILL_RUBRIC`) before paying for video; every clip is reviewed (`BROLL_RUBRIC`, `google/gemini-2.5-flash`). A failed clip is regenerated once with a new seed, then falls back to Type A.

## 3. Pick the windows (needs `captions.json`)

- Windows are `[startSec, endSec]` on the **tightened** timeline (before the 1.1x ramp; the pipeline ramps them together).
- Start and end on word boundaries from `captions.json`, covering the sentence the clip illustrates.
- 2-3 s, max 4 s; avatar visible between any two windows (never two B-Rolls back to back). Don't split a rapid run of steps into hard cuts that land on nothing; if steps are read back to back with no gap, give that stretch one clip.
- Keep out of the first sentence and the CTA.
- Then set each clip's `durationInFrames` to its window length and render.

`broll-windows.json`:
```json
[{"startSec": 1.50, "endSec": 4.20, "file": "/Users/pius/LinkedIn Generator/broll/runs/<topic>/broll-1.mp4"}]
```

## 4. Check every clip

- Contact sheet per clip: `ffmpeg -i broll-N.mp4 -vf "fps=2,scale=270:-1,tile=6x1" -frames:v 1 sheet-N.png`, then look at it.
- It shows **exactly** what's said in its window (read the sentence next to the sheet), it moves in every frame, the text is crisp and fits, frame 0 is already full content, nothing looks like stock.
- A clip that fails → rebuild before handing on.

When the user gives new B-Roll feedback, add it here and to `broll/scripts/lib/rubrics.mjs` so the automated QC learns the same rule.


## Lessons 2026-10-05 (Betriebsprüfung self-review, Pius: "merk dir den Rest für upcoming videos")
- **Result on screen at 3-6 s:** the sentence right after the hook gets a full-board "result" B-Roll (finished checklist, finished document), never 5+ s of plain face after the hook.
- **Never two split-screen windows back to back:** leave a ~1 s talking-head beat between them (e.g. on "Schritt zwei"), or make one of them a full board, otherwise it reads as one 10+ s shot.
- **Split graphics big:** content fills the top half (cards ~990 px wide, body text 34-42 px). No small card floating in grey space.
- **The trick beat is the busiest visual:** several elements in quick succession (e.g. three questions flying in), not one static card.
- **Closing board mirrors the spoken line exactly** (said "Steuerberater fängt nicht bei null an" → board "Steuerberater prüft statt sucht").
- **Split titles max ~24 characters** at size 78 so they stay on one line.

## Hook-Dopamin-B-Roll (Henri 2026-10-08)

- **Gilt für alle normalen Videos (FP-N, GPT-N, BX-C), nie für Satire.** Komponente `src/components/HookKit.tsx`, Komposition `DopamineHook` (1080x1920, 25 fps, Dauer = `seconds`, ~3-5 s).
- **Ab 0 s im Bild, spätestens bei 2 s alles voll sichtbar und in Bewegung:** schwarzer Slot-Zähler (`counterFrom/To`, `counterPrefix/Suffix`, `counterLabel`) + Progress-Bar(s) (`bars`, Zahl zählt mit) + ruhige Mengen-Bewegung um eine Logo-Kachel (`pile`: coins/cards/receipts, `logo`: openai/claude/null) + Wort-für-Wort-Typo unten (`words`, `em` = Serifen-Kursiv für Zahlen/Schlüsselwort; Timings aus `captions.json`, Helfer `wordsFromCaptions`). Optional `waffle` (Punkt-Raster + %), `people` (Personen-Reihe ab ~2 s). v2 (Henri „mehr animieren“): Kamera-Push/Drift mit Parallaxe (`camera`, an), Whip-out in den letzten 0,3 s (`whipOut`, an), Ziffern mit 3D-Flip + Motion-Blur + Glow, optional `ticks` (`{text:"+ €",every:0.5}`) und `chart` (Mini-Linien-Diagramm mit/ohne, „Beispiel“). Ziel: alle 0,3-0,5 s ein neues Ereignis.
- **Presets:** `preset: "fp"` (Creme + Superkind-Orange), `preset: "gpt"` (ChatGPT-Grün, kein Superkind). Oben `topSafe` (~420 px) frei lassen für die Text-Hook-Box der Pipeline.
- **Keine Explosionen, kein Konfetti, keine Smileys/Emojis**; nur Springs mit hoher Dämpfung und weiche Ease-outs. Zahlen ohne Quelle immer als „Beispiel“ beschriften.
- **Render:** `npx remotion render src/index.ts DopamineHook runs/<topic>/broll-1.mp4 --props=runs/<topic>/hook-props.json --concurrency 2 --muted`, dann als erstes Fenster `{"startSec":0,"endSec":<seconds>,"file":…,"comp":"DopamineHook","hideCaptions":true}` in `broll-windows.json` (`hideCaptions` blendet die Pipeline-Untertitel in diesem Fenster aus, die Wort-Typo der Komponente bleibt; Coordinator-Entscheidung 2026-10-08). Beispiel-Props: `broll/runs/_hook-test/dopamine-hook-zinsen-props.json`.
- **Split (Henri 2026-10-08: „am Anfang als Splitscreen“) = Standard für normale Reels:** Props `layout: "split"` (Standard; ohne `avatar` fällt es auf Vollbild zurück), `avatar: {src:"render-<tag>-tightened.mp4", startSec:<Fensterstart>, focus, scale:1.0, faceAt:0.42}` wie bei PanelSplit, `panelFrac` (0.52). Panel oben: Zähler, Kachel + Münztürme links, Balken-Karte rechts (Wort-Typo und Diagramm entfallen), Sprecher unten ab Frame 0, in den letzten 0,35 s fährt das Panel hoch und der Sprecher wächst exakt auf das Vollbild → unsichtbarer Schnitt zum Talking Head. Fenster: `{"startSec":0,"endSec":<seconds>,"file":…,"comp":"DopamineHook","layout":"split"}` – KEIN `hideCaptions`; die Pipeline setzt die Caption-Pille automatisch auf die Kante (y = panelFrac). Test: `broll/runs/_hook-test/dopamine-hook-zinsen-split-*`.
- Referenz: tonyma.ai Reel DeNai0koDUk, nur die Hook (0-5 s).
- **Freigegebener Stand (Henri 2026-10-08, „ja passt so“):** Split-Vorschau v5 `broll/runs/_hook-test/dopamine-hook-zinsen-split-preview.mp4` (Casino-Münzen fallen von ganz oben hinter Hook-Box/Zähler/Karte durch, ca. alle 0,07 s eine, 6 Türme, Slot-Zähler mit Walzen-Einrasten + Gold-Glow, weicher Panel-Fade in den Vollbild-Sprecher). Das ist die Messlatte.

## Dopamin-Split-B-Rolls als Standard (Henri 2026-10-08)

- **Ab jetzt gilt für ALLE B-Rolls der normalen Videos (FP-N, GPT-N, BX-C), nicht nur die Hook, nie für Satire:** Split-Screen (Panel oben ~50 %, Sprecher unten, Caption-Pille auf der Kante) mit dopamin-befriedigender Bewegung: Slot-/Walzen-Zähler, Progress-Bars mit Shimmer und mitlaufender Zahl, fallende und sich stapelnde Objekte (Münzen, Belege, Karten …), Pop-ins mit Overshoot, Glints beim Aufprall, Kamera-Drift. Etwa alle 0,3–0,5 s ein neues Ereignis, nichts steht still. Baukasten: `src/components/HookKit.tsx` (Zähler, Münzen, Balken, Kachel) für jedes Panel wiederverwenden bzw. erweitern.
- **Icon-/Objekt-Stil: Casino-/Slot-Game-UI als Vorbild** (Henri-Screenshot 2026-10-08: Slot-Game-UIs von Behance/Shutterstock): glossy 3D-Icons mit Bevel, dicker Goldrand bzw. Rand in Akzentfarbe, Glanzlicht-Sweep, weicher Schlagschatten, leichter Glow, „chunky“ Proportionen, Objekte wirken greifbar (Münzen, Edelsteine-artige Badges, Walzen, Buttons mit Tiefe). **Aber das Grunddesign bleibt:** heller/weißer Hintergrund, Akzente Grün (GPT) bzw. Orange (FP/Superkind) plus Gold nur für Geld/Münzen. Kein dunkles Casino-Lila, keine Neon-Farbwelt, keine Glücksspiel-Symbole (Kirschen, 7er, Würfel, Jackpot-Schriftzüge), keine Emojis/Smileys, keine Explosionen/Konfetti.
- Lesbarkeit geht vor: Hook-Box, Zähler, Zahlen und Karten liegen immer in der Ebene vor den fliegenden Objekten.

## Dopamin-Stufen pro Format (Henri 2026-10-08)

> **GPT-N seit 2026-10-15 anders (Henri):** kein Casino/Münzen/Gold/Slot-Walzen mehr, keine HookKit-Panels. Dopamin kommt aus sauberer Animation im Look „Weiß + Dunkelgrün“ mit Glas (Odometer mit Motion Blur, Ring-Wellen, Glints, Wort-Pop-ins, Panel-Slides) aus `src/components/GptGreenKit.tsx`. Spec: `gpt-normal-reel/references/gpt-look-2026-10-15.md`. Die GPT-N-Zeile unten ist Historie.

- **GPT-N (@florentgpt): volle Stufe** – wie freigegebene Zinsen-Hook v5: dichter Objekt-Regen (z. B. Münzen alle ~0,07 s), etwa alle 0,3–0,5 s ein neues Ereignis, Casino-/Slot-Effekte voll.
- **FP-N (@florent_preusser): mittlere Stufe** („mehr Dopamin, aber nicht so crazy wie bei GPT“) – Splitscreen und Bewegung bleiben, aber weniger Objekte gleichzeitig, kein dichter Regen, Takt etwa alle 0,6–0,8 s ein Ereignis, seriöser B2B-Look Weiß/Orange, Zähler und Balken klar und sauber. Auch die übrigen B-Rolls lebendiger als früher (Pop-ins, Zähler, leichter Kamera-Drift).
- **BX-C (Felix):** wie FP-N (mittlere Stufe), boilr-Grün.
- **FP-S (KI-Satire @florent_preusser): vorerst keine Dopamin-B-Roll.**
- **GPT-S (Satire @florentgpt): leichte Stufe (Henri 2026-10-09).** Satire-Schnitt bleibt (Sticker, Punch-in, rote Kreise), dazu **2–4 kurze Dopamin-Split-Panels à 1,5–3 s** nur auf Zahl-/Begriffs-Momenten (Slot-Zähler auf eine Zahl, Balken, Tickets/Karten fallen rein, Begriff als ruhige Serifen-Kachel). Stil ruhig: Panel flach weiß, klare Ink-Zahlen in Inter Bold, keine Glow-/Glitzer-/Gold-Effekte, kein Münzregen, keine Casino-Optik. Die Pointe bleibt ruhig und unverdeckt (kein Panel ab dem Schluss-Beat). Panels werden in der Satire-Komposition selbst gebaut (nicht über render-pipeline.mjs): Panel oben ~880 px fährt von oben rein, Sprecher rutscht ~330 px nach unten, Ein-Wort-Untertitel sitzt solange dunkel im Panel unten. Die Casino-/Slot-Regeln oben gelten für GPT-S NICHT. GPT-S v2-Referenz: `broll/src/compositions/SatireKostenV2.tsx`, Run `gpts-effekt-versunkene-kosten` (upload/…-v2.mp4, sources.txt).

> **Sprecher-Framing im Split (Henri 2026-10-09, Pflicht für GPT, FP, Felix/boilr):** Der Avatar darf im Split nie untergehen. Sprecher-Bereich unten ≥ ca. 48 % der Höhe (panelFrac max. 0.52). Gesicht horizontal mittig, Gesichts-Box mittig im Sprecher-Bereich (faceAt 0.5, Augen im oberen ~40 %), etwas Luft über dem Kopf, Kinn und Mund nie abgeschnitten, eine feste Einstellung pro Reel (Median über alle Frames, damit Kopfbewegungen sicher drin bleiben). Untertitel-Pille und Panels nie über dem Gesicht. **Nie die Default-Werte focus {x:0.52,y:0.45} verwenden** – unsere Avatar-Quellen haben das Gesicht bei y≈0.59–0.64. Vor dem Rendern der Split-Clips messen: `python3 "/Users/pius/LinkedIn Generator/broll/scripts/facecheck/facefocus.py" <run>/tightened.mp4 0.52` → focus/scale/faceAt in jedes props-*.json (scale 1.0 wenn focus.x 0.47–0.55, sonst 1.1–1.15 zum Zentrieren). **Export-Gate:** `python3 ".../scripts/facecheck/check.py" <final.mp4>` (1 Frame/s, Vision-Gesichts-Box) muss 0 bad zeigen, sonst nicht exportieren.
> Erfahrung 2026-10-09: Mit Caption-Pille auf der Naht faceAt eher 0.55–0.58 statt 0.5 (sonst liegt die Pille auf den Haaren / Haarspitze an der Panelkante); Kinn trotzdem im Contact-Sheet prüfen. Bei seitlich sitzendem Gesicht (focus.x < 0.47) scale 1.1–1.15.

> **Untertitel-Position (Henri 2026-10-12, Pflicht):** Im Fullscreen sitzen die Untertitel auf Brust-/Schulterhöhe, nie über Mund oder Augen. Im Splitscreen sitzen sie genau auf der Kante zwischen B-Roll-Panel und Avatar. Vor dem Export im Frame-Sheet prüfen.

> **Retention-Hook (Henri 2026-10-12, Pflicht für alle Reels):** 0–3 s maximal Dopamin in der B-Roll (mehrere Ebenen gleichzeitig in Bewegung, alle 0,2–0,4 s ein Pop/Stagger/Zähler/Push, passende SFX, Text-Hook groß integriert), danach bis ca. 15 s alle 1,5–2 s ein neuer visueller Reiz. Ziel: nicht nach 3 s die Hälfte verlieren, sondern frühestens nach 10–15 s. Clean bleiben (kein Slop).

> **Split-Framing weiter (Henri 2026-10-12):** Im Split nicht nur das Gesicht zeigen, sondern Kopf mit Cap, Schultern und die Hand mit dem Mikro (Skala ~1.0–1.05, keine Seitenränder; Gesicht darf leicht außermittig sein). Push-ins im Vollbild sanft (max. ~1.06).

> **Untertitel-Pille @florent_preusser (Henri 2026-10-12):** Untertitel als Pille im Claude-Orange (ca. #D97757) mit weißer Schrift, Claude-Stil. Position wie gehabt: im Split genau auf der Kante, im Vollbild auf Brusthöhe, nie über Mund/Augen. Gilt für @florent_preusser (FP-S und ggf. FP-N); @florentgpt bleibt bei seinem eigenen Untertitel-Look.

> **Guide-Scroll-B-Roll (Henri 2026-10-12):** Wird am Ende der Guide/das Guidebook/PDF erwähnt (CTA „steht im Guide“, „Kommentiere X …“), dort eine B-Roll mit dem echten Guide-PDF einblenden: alle Seiten (meist 7–8) als Seiten-Renderings (z. B. `pdftoppm -r 80`) schnell durchscrollen, leicht schräg/3D, mit Tempo und Motion Blur im normalen Schnittstil, damit der Zuschauer sieht, wie viel Wert er bekommt (optional Seitenzähler „8 Seiten“). Nur wenn es zeitlich und inhaltlich passt: Wird in dem Moment noch etwas Wichtiges gesagt oder gezeigt, hat das Vorrang. Gilt für alle Reels mit Guide (FP-N, GPT-N, Felix).
> Guide-Scroll Dauer: ca. 1,5–3 s. Echte Guide-Seiten, falls vorhanden; sonst sauberer Nachbau mit Titel und Kapiteln. Gilt für alle Accounts.

> **Stil-Iterationen schnell (Henri 2026-10-12):** Bei Look-/Stil-Änderungen zuerst nur eine kurze Draft-Vorschau der betroffenen Stellen rendern (z. B. erste 3 s + eine Beispielszene + Ende, halbe Auflösung, ~10–15 min), Henri zeigen, erst nach seinem OK das ganze Video in voller Qualität.

> **Keine geposteten Reels umschneiden (Henri 2026-10-12):** Neue Stile/Regeln nie an einem schon geposteten Reel ausprobieren oder es als Beispiel neu schneiden. Immer ein frisches, noch nicht gepostetes Reel nehmen, das danach auch raus kann. Vorher in InstantDM/Run-Ordnern prüfen, ob es schon online ist.

> **Arena-Opus-Stil ist freigegebener FP-N-Standard (Pius 2026-10-19: „Das war geil“):** Eigene Opus-Komposition statt render-pipeline, Referenz `broll/src/opus/ArenaOpus.tsx` (Run `arena`): Split ab Frame 0 mit Creme-Grid-Panel oben (PH 820), Sprecher unten (facefocus), Claude-orange Naht-Pille mit schwarzer Aktiv-Wort-Pille, pro Satz eine neue Panel-Szene mit Karten/Terminal/Stempeln/Zählern, 1–2 Vollbild-Szenen für die stärksten Momente (Arena: Pixel-Kolosseum mit eigenen Gladiator-Figuren, nie fremde Maskottchen), Guide-Scroll + Kommentier-Pille + Folgen-Chip am Ende. Draft in halber Auflösung zuerst, dann final; SFX per make-sfx.mjs an Wort-Ankern, 1.1x, Eminem-Bett, loudnorm mit -ar 48000.
