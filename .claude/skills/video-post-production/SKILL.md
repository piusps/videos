---
name: video-post-production
description: Phases 5 and 7 of the Superkind reel pipeline — the edit. Stage A tightens the raw HeyGen avatar (silence cut that follows the transcript: tight in lists, short pause at new thoughts, sentence ends land) and gets word timings on the tightened timeline. Stage B runs the one-command render-pipeline.mjs — 3 hard keyframed push-in zooms, Anton karaoke captions with the orange active-word box, full-frame B-Roll cut-ins, IG-"Strong"-style intro/outro text-hook pills, flat 1.1x speed ramp, music bed muxed in last — into one final MP4 with the near-lossless encode chain. Use for "schneid das Video", "Captions/Zooms/Musik", "rendere das Finale neu", "Text-Hook ändern", "Silence Cut", or as steps 5 and 7 of heygen-video-generator.
---

# Video Post-Production — Phases 5 (Stage A) and 7 (Stage B)
> **FP-N seit 2026-10-15: Opus-Stil** (eine Remotion-Komposition pro Video, Split ab Frame 0, orange Mono-Untertitel auf der Kante, Guide-Scroll am Ende). Für alle neuen @florent_preusser-Normalvideos zuerst `references/fpn-opus-stil-2026-10-15.md` lesen; render-pipeline.mjs nur noch für ältere Formate.


All tools live in `/Users/pius/LinkedIn Generator/broll/` (Remotion project). Run commands from there. Run dir = `runs/<topic-slug>/`.

**Out of scope:** building B-Roll clips and picking their windows (`video-broll`), QC and delivery (`video-qc-delivery`). This skill only assembles what those phases hand over.

---

## Stage A — tighten + word timings (right after the avatar is downloaded)

**Input:** `runs/<topic>/avatar.mp4`, `script.txt`. **Output:** `tightened.mp4`, `keep.json`, `captions.json`.

```
node scripts/silence-cut.mjs --in runs/<topic>/avatar.mp4 --out runs/<topic>/tightened.mp4 --json runs/<topic>/keep.json --min-silence 0.15   # nur Detektion; Pausenlänge pro Stelle nach „Der Schnitt folgt dem Transkript“
node scripts/transcribe.mjs --in runs/<topic>/tightened.mp4 --out runs/<topic>/captions.json --script runs/<topic>/script.txt
```

**Silence cut (Mechanik):** `ffmpeg silencedetect`, noise floor `-35dB`, small padding on both sides so plosives aren't clipped. Video and audio are always cut together in one pass, never one track alone (lip-sync drift). Silence cut runs **first**; everything downstream is derived from the tightened timeline, so nothing needs a timestamp remap.

**Der Schnitt folgt dem Transkript, nicht einer festen Pausenlänge (Henri 2026-10-20, ersetzt das alte einheitliche „Ton an Ton“ mit 0,15 s für alle Lücken).** Feedback: „momentan ist das eher ein Block. Dadurch wirkt die Erzählung ultra robotisch.“ Eine echte Sprachnachricht hat melodischen Flow und wechselndes Tempo. Jede Lücke wird deshalb nach ihrer Stelle im Skript (`script.txt`, Satzzeichen und Absätze) behandelt, nicht nach ihrer Länge:

| Stelle im Skript | Ziel-Pause nach dem Schnitt | Warum |
|---|---|---|
| Innerhalb einer Phrase, zwischen Wörtern | Lücke komplett raus (wie bisher) | Kein totes Loch mitten im Gedanken |
| **Aufzählung / Einschub** (Kommas in Listen, „X, Y und Z“, Einschübe mit Gedankenstrich oder Klammer) | **sehr knapp, 0,03–0,08 s** | Beim Aufzählen und Einschieben spricht man schneller, die Punkte rollen ab |
| Komma zwischen Satzteilen (kein Listenkomma) | 0,10–0,15 s | Kurzes Luftholen, Fluss bleibt |
| **Satzende** (. ! ?) | **0,20–0,30 s** | Die Stimme geht runter und landet; der Satz braucht einen Moment zum Ausklingen |
| **Neuer Gedanke** (neuer Absatz/Beat im Skript, Wechsel Hook → Schritt → Payoff → CTA, „Und jetzt…“, „Der Trick:“) | **0,35–0,50 s** | Kurze Pause vor dem neuen Gedanken, das ist der Taktgeber der Erzählung |
| Vor der Pointe / Zahl, die wirken soll | 0,30–0,40 s | Spannung, dann Payoff |

Regeln dazu:
- **Satzende-Ausklang nie abschneiden:** am Satzende hinten mehr Padding lassen (~0,10–0,12 s statt 0,04 s), damit das Absinken der Stimme und das Ausatmen des letzten Worts drin bleiben. Abgeschnittene Satzenden klingen sofort nach KI.
- **Kein Block:** wenn nach dem Schnitt alle Pausen gleich lang sind, ist es falsch. Die Pausenlängen sollen sichtbar variieren (in `keep.json` prüfen).
- **Vorgehen, solange `silence-cut.mjs` nur eine feste Länge kann:** erst `transcribe.mjs --script` auf das **rohe** `avatar.mp4`, jede Lücke einem Skript-Satzzeichen zuordnen (Wort davor endet mit `,` `.` `!` `?` `:`, Absatzwechsel im Skript, Listenkontext), Ziel-Pause aus der Tabelle setzen, Keep-Segmente daraus bauen und in einem Durchgang schneiden (Bild + Ton zusammen). Pausen, die HeyGen kürzer gerendert hat als das Ziel, bleiben wie sie sind; nie künstlich Stille einfügen.
- **Satire bleibt etwas länger** (Timing ist Teil des Witzes, siehe `video-satire-edit`), folgt aber derselben Logik: Pause vor der Pointe am längsten.
- Der flache 1.1x-Speed-Ramp danach bleibt; er verkürzt alle Pausen gleichmäßig, die Unterschiede bleiben erhalten. Klingt es nach dem Ramp gehetzt, die Ziel-Pausen um ~10 % anheben, nicht den Ramp ändern.
- **Hörtest vor Stage B:** 10 s aus der Mitte anhören. Klingt es wie eine normale Sprachnachricht (schneller in Listen, kurze Pause bei neuem Gedanken, Stimme landet am Satzende)? Klingt es wie ein Block, neu schneiden.
- Das Absinken der Stimme selbst entsteht im Render, nicht im Schnitt: siehe `video-avatar-render` → „Sprechmelodie briefen“.

**Transcription:** local whisper.cpp (`@remotion/install-whisper-cpp`, one-time `npm run setup-whisper`, `medium` model) on the **already tightened** clip. HeyGen's `subtitle_url` is only phrase-level (2-4 words per cue), too coarse for karaoke. **Always pass `--script`:** Whisper mishears tool names ("Impackable") and writes numbers as digits; with the script, captions use the exact script spelling and Whisper only supplies timing.

Hand `captions.json` + `tightened.mp4` to `video-broll` (windows).

---

## Stage B — the final render (after the B-Roll is ready)

**Input:** `tightened.mp4`, `script.txt`, `hooks.json`, trigger word, `broll-windows.json`.
**Output:** `runs/<topic>/<topic>-final.mp4` (+ `pipeline.log`).

```
node scripts/render-pipeline.mjs \
  --avatar runs/<topic>/tightened.mp4 --skip-silence-cut \
  --script runs/<topic>/script.txt \
  --hook "<hooks.json intro>" --end-hook "<hooks.json outro>" --trigger <WORT> \
  --broll runs/<topic>/broll-windows.json \
  --music "<Musik pro Account, siehe Speed ramp + music>" \
  --out runs/<topic>/<topic>-final.mp4 \
  2>&1 | tee runs/<topic>/pipeline.log
```
Only if the user explicitly asked for a Cam-2 cut (`video-cam2`): use `tightened-cam2.mp4` as `--avatar` and add `--no-zoom cam2-window.json`. Office avatar: add `--zoom-focus 0.70,0.48` (he sits right of centre; push-ins land on the face). A re-run with new material writes `<topic>-final-v2.mp4` etc.; earlier versions stay for `video-qc-delivery` to archive.

The pipeline runs, in this exact order: (silence-cut) → transcribe → compute-zooms → `remotion render FinalVideo` → speed-ramp → prepare-music → mux-music. Full CLI in the header of `scripts/render-pipeline.mjs`. If Whisper drifts at the end (several words with the same timestamp), map the raw-audio word timings through the silence-cut segments (`silence-cut.mjs --json`) and pass them with `--captions captions.json` (added 2026-10-01). Don't collapse render, ramp and music into one step (music must never be sped up).

### Zooms (rebuilt 2026-09-24, user: "wirklich gut", don't change the mechanic)

The first run changed zoom on every sentence (14 small steps); the user called it "kleine, abgehackte Zooms". Matched to the reference edit `nikvideo2final 2.MP4`:
- **Wide by default** (`BASE_SCALE` 1.08, full torso, room visible).
- **Only 3 push-ins per video, HARD:** ~186% / 172% / 160%.
- **Opening push-in (from frame 0) stays gentle: 130 %** (user feedback 2026-10-03, Mahnbescheid: the 186 % opener showed only part of the face, "nicht so krass reinzoomen, sein ganzes Gesicht soll noch zu sehen sein"). Motion from frame 0 stays; hair to chin must be in frame. The hard 186 %/160 % push-ins go to the later picks. `compute-zooms.mjs` `OPEN_SCALE`.
- **Keyframed camera move, never a frame jump:** ease in ~550 ms, hold the whole sentence (≥1.8 s), ease out ~450 ms. Transform origin 50% 38% (or `--zoom-focus`).
- **The first push-in starts at frame 0** (from the real analytics: ~50% left within 2 s of a static opening). Never open on a static wide shot.
- **Placement by context:** cost/number claims, pivot/payoff words ("Trick", "niemand", "ersetzt"), the trigger-word CTA, bonus for the hook area. Never inside a B-Roll window or a `--no-zoom` range, ≥3 s apart.
- Code: `src/components/ZoomedVideo.tsx`, `scripts/compute-zooms.mjs`.

### Karaoke captions (matched 1:1 to the reference edit, Superkind orange)

- **Anton**, uppercase (`@remotion/google-fonts/Anton`), size `width × 0.085` with `font-size-adjust: cap-height 0.7`.
- White fill, ~5-6 px black outline (`-webkit-text-stroke` + `paint-order: stroke fill`), soft dark glow. **No plate behind the line.**
- **Active word in a rounded `#FF6B35` box**, text stays white; one word at a time; no box between words.
- 1-4 words per line, max ~22 characters; a sentence end closes a line ("3." doesn't); a line stays until the next starts; words appear instantly.
- **Placement:** lower third, line bottom at 22% / 19% / 25% of frame height, rotating every 3 lines, computed in px from the height. Never in the bottom ~14-17% UI dead zone, never in the right-hand icon column (centered, max 88% width), never above ~30% from the bottom (face).
- Code: `src/components/KaraokeCaptions.tsx`.

### @florentgpt look (`--preset gpt`, Pius 2026-10-02: the two accounts must not look identical)

> **Superseded for GPT-N since 2026-10-15 (Henri):** @florentgpt normal reels are no longer cut with `render-pipeline.mjs --preset gpt`. They are built as an Opus composition with `src/components/GptGreenKit.tsx` (white + deep green #0B3D2C, glass cards, @florent_preusser caption pill recoloured white/green, no account branding) and finished with speed-ramp → prepare-music → mux-music. Spec: `gpt-normal-reel/references/gpt-look-2026-10-15.md`. `--preset gpt` stays in the code because Felix (BX-C) still uses it.

Every GPT-N render passes `--preset gpt`. Never render @florentgpt with the FP-N defaults. The preset changes four things:

| | @florent_preusser (FP-N, default) | @florentgpt (`--preset gpt`) |
|---|---|---|
| Captions | Anton karaoke lines of 1-4 words, active word in an orange box | **one word at a time**, Montserrat Black, uppercase, white with a soft shadow, no box, short pop-in, centre at 75 % height (`GptCaptions.tsx`) |
| Text hook | black IG "Strong" pills | **one white rounded box with black Inter SemiBold**, emoji at the end (`GptHook.tsx`) |
| Cut | ~3 smooth keyframed push-ins up to 186 % | the same moments as **hard jump cuts** to max 128 %, no camera move |
| B-Roll entrance | plain hard cut | **pop**: from 106 % to 100 % over 5 frames |

Explicit `--caption-style` and `--hook-style` flags still override the preset. Silence cut, speed ramp, encode and music stay identical for both accounts. Comparison stills from 2026-10-02 are in the session scratchpad; regenerate with `npx remotion still … FinalVideo --frame=N`.

### Vision intro hook = Marker (user pick 2026-10-03, "nimm A")

`--hook-style vision` intro hooks animate after frame 0 (frame 0 stays the full, still thumbnail): with two `*accents*` the first gets a red hand-strike at ~0.45 s and dims, an orange Superkind marker sweeps under the last at ~0.95 s and its text turns white with a small pop; with one accent only the marker runs. Outro hook unchanged. Code: `VisionHook` prop `marker` (set for the intro in `FinalVideo`). Chosen from the HyperFrames test (`/Users/pius/LinkedIn Generator/hyperframes/hook-test`, variants in `~/Desktop/Superkind Videos/Hook-Test HyperFrames/`); a premium glass-card version D exists there but was not picked.

### Vision captions (opt-in: `--caption-style vision`, user decision 2026-09-29)

For the Superkind launch/"Vision" video and anything that should feel sleek rather than loud. Reference: instagram.com/reel/DbHkVlPAIPr (local copy + sheets in `runs/launch/ref-captions/`). Karaoke stays the default for the tutorial reels.
- **Inter Bold**, tracking −4.5 %, size `width × 0.066`, **sentence case with punctuation**, white, soft shadow only. No outline, no active-word box.
- **1-3 words per phrase** (max ~18 chars), a sentence end or comma/colon closes a phrase, phrases switch hard (2-frame fade), held until the next one, dropped after a long pause.
- **Key words in a light Superkind orange `#FFB08F`** (not the full `#FF6B35`). Pass them with `--keywords runs/<topic>/keywords.json` (JSON array; multi-word entries tint each word). Pick 1-2 per sentence at most: the concept names, numbers, the pain word, the trigger word. Too many and it stops being "sleek".
- **Position (user feedback 2026-09-29, supersedes the earlier "one fixed height" rule):** over the talking head the line centre sits at 77 % (on the chest). **During every B-Roll window the caption sits centred at exactly 50 % in a dark frosted pill**, i.e. on the split seam, like the @bradfordmarais reference; putting it at mouth height of the speaker panel was rejected. Windows carry `"captionZones": [{"y": 0.5, "pill": true}]`; the zone follows the shot on screen (not the phrase start), so the line moves with the hard cut, never mid-shot.
- Code: `src/components/VisionCaptions.tsx`; `FinalVideo` props `captionStyle`, `captionKeywords`, `captionZones`. Test render: `runs/launch/explainer-test/Vision-Untertitel Test.mp4`.

### Intro/outro text-hook pills (locked visual spec, tuned 2026-09-23)

Text comes from `hooks.json` (`video-social-copy`). The look mimics Instagram's native "Strong" caption sticker, deliberately not the Superkind brand, so it reads as an organic Reels hook:
- Each line its **own** black rounded pill sized to that line; adjacent pills **overlap slightly** vertically (one continuous "brick", no gap).
- Bold white Inter-Bold; upper third, ~8% from the top (clears the face).
- **Fully opaque on frame 0**, no fade-in: frame 0 is the thumbnail.
- Intro ~5 s, outro the last ~5 s.
- Code: `src/components/TextHookBadge.tsx` (shared by `HookOverlay.tsx` and `FinalVideo.tsx`). Quick one-off pass without the full pipeline: `node composite-hook.mjs --video <in.mp4> --text "<intro>" --trigger <WORT> --out <out.mp4>` (`--seconds`, `--end-seconds`, `--no-end-hook`).

### B-Roll cut-in mechanics

Each window from `broll-windows.json` is a bare full-frame `<OffthreadVideo>` layer over the talking head in `FinalVideo.tsx`: hard cut in, hard cut out, the avatar audio keeps playing, **nothing on top of it** (no label, logo or box). Captions stay visible over B-Roll.

### Speed ramp + music

- **1.1x flat**, picture + voice only (`setpts=PTS/1.1`, `atempo=1.1`), applied to `FinalVideo`'s own output, which carries no music (`scripts/speed-ramp.mjs`).
- **Music is mandatory in every reel (user 2026-10-01: "die Musik drunter vergisst du auch immer").** Always pass `--music`. If `pipeline.log` says "Final video (no music)", the reel is not finished. Satire reels (video-satire-edit) get funny music instead (Fluffing a Duck, ducked; since 2026-10-02), mixed in their own ffmpeg finish.
- **Music per account (user 2026-10-02: the @florentgpt reel "Brief vom Amt" had the Eminem track too; the two accounts must never sound alike):**
  - **@florent_preusser (FP-N):** seit 2026-10-19 (Pius) `/Users/pius/LinkedIn Generator/broll/music/tame-impala-loser-instrumental.mp3` (Tame Impala „Loser“ Instrumental, 3:43, erste ~1,2 s fast still → mit prepare-music 1,3 s überspringen). Vorher: Eminem „Without Me“ Instrumental.
  - **@florentgpt (GPT-N and GPT-S):** Vivaldi „Summer“ — `/Users/pius/Downloads/Vivaldi_Summer_KLICKAUD.mp3` (152 s, no leading silence). Alternative if a second track is wanted: `/Users/pius/Documents/02_VIDEO_EDITING/Media_Library/Music/Vivaldi_-_Storm_KLICKAUD.mp3` (skip 2.1 s of leading silence). **Never** the Eminem track and never Fluffing a Duck on @florentgpt; classical (Vivaldi or similar) only.
- **Music handling:** skip the first 1 s, trim/loop to the **sped-up** length, ~1 s fade-out (`scripts/prepare-music.mjs`), muxed last with `amix normalize=0` at volume 0.15 (`scripts/mux-music.mjs`). Music is never sped up. Licensing: a commercial recording risks a Content-ID mute on a business account; flag once per new track.
- **SFX variety is mandatory (user 2026-10-01: "ein SFX, der immer und immer wieder kommt, fuckt nach ner Zeit komplett ab").** After writing `sfx.json`, always run `node scripts/vary-sfx.mjs --in runs/<topic>/sfx.json`. It rotates each family (pop, whoosh, ping, check, click) through `sfx/heygen/variants/` so the same file never plays twice in a row and no file more than 3× per reel. Never hand-place 10× `ui-pop`.
- **SFX sound design is the default since 2026-09-29** (user: "mehr Feuer, mehr Leben und Interaction"). The library is `broll/sfx/heygen/`, high-quality 48 kHz stereo files from the HeyGen SFX catalog (`search_audio_sounds`, type `sound_effects`): whoosh-quick, ui-pop, synth-pop, chime, chime-asc, click, typing, sub-hit, boom, riser. Pass them via `--sfx sfx.json`; `atSec` is the file START on the tightened timeline. Set it to `hit − peak_offset × 1.1`, because SFX are not sped up. Cue pattern per reel (about 25–30 cues, densest in the first 10 s):
  - boom on frame 0 (0.45)
  - **no heavy whooshes, no sub-hits** (user 2026-09-29: "zu schwer, zu billig"). whoosh-airy, whoosh-short and sub-hit are out; sub-hit starts with a heavy whoosh. Keep the light whoosh-quick (0.29 s) on flying UI elements and B-roll exits (0.2–0.35); the user explicitly likes those.
  - **first 10 s get denser, clean UI pops (user 2026-09-29):** a pop on every other cell or row as a grid or list fills (0.16–0.2), a pop per step card, a chime when a counter reaches its target, and a soft synth-pop on "Schritt eins". Keep them clean and quiet, not overloaded.
  - ui-pop when a card or badge appears (0.25–0.3)
  - typing under typing animations (0.22)
  - click and chime on send or done moments (0.3–0.4)
  - synth-pop when the outro pill appears
  Reference cue sheets: `broll/runs/postfach/sfx.json` and `runs/postfach-b/sfx.json`.
- **Final loudness:** after the pipeline, run `ffmpeg -i final.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=9 -ar 48000 -c:a aac -b:a 256k` so the reel lands at about −14 LUFS (reel standard). The pipeline alone outputs about −19 LUFS. **Always `-ar 48000` after loudnorm (Henri 2026-10-15, Arena):** loudnorm resamples to 192 kHz internally; without `-ar` the AAC came out at 96 kHz and played **silent** on phone/web. Check `Audio: … 48000 Hz` before delivery.

### Encode quality (keeps the 186% push-ins sharp)

A 186% push-in on native 1080p is an upscale, so every extra compression generation shows. Intermediates near-lossless (silence cut crf 10, Remotion crf 10 + jpeg-quality 100); only the final speed-ramp encode compresses (crf 16, preset slow, light unsharp). **Never re-encode anywhere else.** HeyGen 4K is a last resort only.

### What never goes on the footage (policy 2026-09-24)

Only avatar footage, full-frame B-Roll, the karaoke captions and the two text-hook pills. Never a logo bug, `StepCounter`/`PromptCard`/`TriggerWordCard`-style card or any drawn box with text. Those components were deleted; don't resurrect them without an explicit new user decision.

### Code map (`broll/`)

`src/theme.ts` (brand tokens) · `src/loadFonts.ts` · `src/components/{KaraokeCaptions,ZoomedVideo,TextHookBadge,GlassKit}.tsx` · `src/compositions/FinalVideo.tsx` (master: zoomed talking head + B-Roll windows + captions + hooks, no audio bed) · `src/compositions/HookOverlay.tsx` · `scripts/{silence-cut,transcribe,setup-whisper,compute-zooms,speed-ramp,prepare-music,mux-music,render-pipeline}.mjs` · older standalone `composite.mjs` / `composite-hook.mjs`. The pipeline probes fps/resolution/duration with ffprobe; nothing is hardcoded to 1080×1920/25 fps.

## Check before handing on
- Split-Reels: `scripts/facecheck/check.py` auf das Final → 0 bad (Gesicht/Kinn komplett im Sprecher-Bereich), sonst kein Export.

- [ ] `pipeline.log` ends with "Final video:" and no errors.
- [ ] Final length ≈ tightened length / 1.1.
- [ ] Erzählfluss: Pausen variieren nach Skript (Listen knapp, Satzende ~0,2–0,3 s, neuer Gedanke ~0,35–0,5 s), Satzenden nicht abgeschnitten, kein „Block“.
- [ ] Frame 0: hook pill fully opaque, push-in already moving.

## Hook-Dopamin-B-Roll (Henri 2026-10-08)

- Alle normalen Videos (FP-N, GPT-N, BX-C), nicht Satire: das erste B-Roll-Fenster ist die Vollbild-Komposition `DopamineHook` (Komponente `src/components/HookKit.tsx`) ab 0 s, spätestens bei 2 s voll sichtbar; Zähler + Progress-Bar + ruhige Mengen-Bewegung; keine Explosionen/Smileys/Emojis/Konfetti. Gebaut in video-broll (Abschnitt "Hook-Dopamin-B-Roll").
- In Stage B einfach über `--broll broll-windows.json` mit `{"startSec":0,"endSec":<seconds>,…,"hideCaptions":true}` einsetzen; die Text-Hook-Box der Pipeline liegt im freien `topSafe`-Bereich oben. `hideCaptions: true` (render-pipeline.mjs, alle Caption-Stile) blendet in diesem Fenster die Pipeline-Untertitel aus - die Wort-für-Wort-Typo der Komponente ersetzt sie (wie in der Referenz). Fenster ohne das Flag bleiben unverändert.
- Split-Variante (Standard für normale Reels): Fenster mit `"layout":"split"` (optional `"panelFrac"`, Standard 0.52) – render-pipeline.mjs legt dann ohne eigene `captionZones` die Caption-Pille auf die Panel-Kante; kein `hideCaptions` im Split-Fenster (das gilt nur für `layout:"full"`). Das Ende des Split-Clips geht nahtlos in den Vollbild-Sprecher über.
- Referenz: tonyma.ai Reel DeNai0koDUk, nur Hook.
- **Ab 2026-10-08 (Henri, „ja passt so“):** alle B-Rolls normaler Videos als Dopamin-Split-Panels im Casino-/Slot-Icon-Stil, Grunddesign weiß/grün/orange bleibt. Details und freigegebene Vorschau: video-broll → „Dopamin-Split-B-Rolls als Standard“. Nie für Satire.
- **Dopamin-Stufen (Henri 2026-10-08):** GPT-N volle Stufe, FP-N und BX-C mittlere Stufe (Takt 0,6–0,8 s, weniger Objekte, seriöser B2B-Look), FP-S ohne, GPT-S leicht (seit 2026-10-09). Details: video-broll → „Dopamin-Stufen pro Format“.
- **GPT-S-Satire (Henri 2026-10-09):** 2–4 ruhige, flache Split-Panels (1,5–3 s) auf Zahl-/Begriffs-Momenten, Pointe unverdeckt; kein Münzregen, kein Glow. Keine Emoji-Karten, kein gezeichnetes Clipart für Personen/Szenen: echte Stock-Fotos (Unsplash/Pexels bzw. deren CC0-Spiegel auf Wikimedia Commons/Openverse, keine Promis), Personen freigestellt mit weißem Rand (`rembg`, sonst macOS Vision `VNGenerateForegroundInstanceMaskRequest`, sonst runde Fotokarte mit weißem Rand), Quellen in `sources.txt` im Run-Ordner. Max. zwei Schriften: Instrument Serif (Begriffe/Titel) + Inter (alles andere), keine Verläufe/Glow auf Satire-Stickern. Upload-Datei < 10 MB (InstantDM-Browser-Limit): `-crf 21 -maxrate 2300k -bufsize 2300k -preset slow` ergibt bei ~30 s ca. 7 MB. Details: gpt-satire-reel → „GPT-Satire Stil“.

> **Sprecher-Framing im Split (Henri 2026-10-09, Pflicht für GPT, FP, Felix/boilr):** Der Avatar darf im Split nie untergehen. Sprecher-Bereich unten ≥ ca. 48 % der Höhe (panelFrac max. 0.52). Gesicht horizontal mittig, Gesichts-Box mittig im Sprecher-Bereich (faceAt 0.5, Augen im oberen ~40 %), etwas Luft über dem Kopf, Kinn und Mund nie abgeschnitten, eine feste Einstellung pro Reel (Median über alle Frames, damit Kopfbewegungen sicher drin bleiben). Untertitel-Pille und Panels nie über dem Gesicht. **Nie die Default-Werte focus {x:0.52,y:0.45} verwenden** – unsere Avatar-Quellen haben das Gesicht bei y≈0.59–0.64. Vor dem Rendern der Split-Clips messen: `python3 "/Users/pius/LinkedIn Generator/broll/scripts/facecheck/facefocus.py" <run>/tightened.mp4 0.52` → focus/scale/faceAt in jedes props-*.json (scale 1.0 wenn focus.x 0.47–0.55, sonst 1.1–1.15 zum Zentrieren). **Export-Gate:** `python3 ".../scripts/facecheck/check.py" <final.mp4>` (1 Frame/s, Vision-Gesichts-Box) muss 0 bad zeigen, sonst nicht exportieren.
> Erfahrung 2026-10-09: Mit Caption-Pille auf der Naht faceAt eher 0.55–0.58 statt 0.5 (sonst liegt die Pille auf den Haaren / Haarspitze an der Panelkante); Kinn trotzdem im Contact-Sheet prüfen. Bei seitlich sitzendem Gesicht (focus.x < 0.47) scale 1.1–1.15.

> **Untertitel-Position (Henri 2026-10-12, Pflicht):** Im Fullscreen sitzen die Untertitel auf Brust-/Schulterhöhe, nie über Mund oder Augen. Im Splitscreen sitzen sie genau auf der Kante zwischen B-Roll-Panel und Avatar. Vor dem Export im Frame-Sheet prüfen.

> **Retention-Hook (Henri 2026-10-12, Pflicht für alle Reels):** 0–3 s maximal Dopamin in der B-Roll (mehrere Ebenen gleichzeitig in Bewegung, alle 0,2–0,4 s ein Pop/Stagger/Zähler/Push, passende SFX, Text-Hook groß integriert), danach bis ca. 15 s alle 1,5–2 s ein neuer visueller Reiz. Ziel: nicht nach 3 s die Hälfte verlieren, sondern frühestens nach 10–15 s. Clean bleiben (kein Slop).

> **Hautton (Henri 2026-10-12):** Avatar nicht zu rot/warm. Natürlicher, neutraler Hautton: auf die Avatar-Ebene (nicht die B-Rolls) eine leicht kühlere Farbkorrektur mit weniger Rot in Mitten/Lichtern und ca. −10–15 % Sättigung in den Rottönen. Vorher-Nachher-Standbild prüfen (keine roten/orangen Wangen, kein Grün- oder Graustich).
> Referenz-Filter Hautton (Australien v7, 12.10.): `colortemperature=temperature=6800:pl=1,colorbalance=rm=-0.05:rh=-0.04:bm=0.015,huesaturation=saturation=-0.10:colors=r` nur auf die Avatar-Quelle vor Remotion.

> **Untertitel-Pille @florent_preusser (Henri 2026-10-12):** Untertitel als Pille im Claude-Orange (ca. #D97757) mit weißer Schrift, Claude-Stil. Position wie gehabt: im Split genau auf der Kante, im Vollbild auf Brusthöhe, nie über Mund/Augen. Gilt für @florent_preusser (FP-S und ggf. FP-N); @florentgpt bleibt bei seinem eigenen Untertitel-Look.

> **Guide-Scroll-B-Roll (Henri 2026-10-12):** Wird am Ende der Guide/das Guidebook/PDF erwähnt (CTA „steht im Guide“, „Kommentiere X …“), dort eine B-Roll mit dem echten Guide-PDF einblenden: alle Seiten (meist 7–8) als Seiten-Renderings (z. B. `pdftoppm -r 80`) schnell durchscrollen, leicht schräg/3D, mit Tempo und Motion Blur im normalen Schnittstil, damit der Zuschauer sieht, wie viel Wert er bekommt (optional Seitenzähler „8 Seiten“). Nur wenn es zeitlich und inhaltlich passt: Wird in dem Moment noch etwas Wichtiges gesagt oder gezeigt, hat das Vorrang. Gilt für alle Reels mit Guide (FP-N, GPT-N, Felix).
> Guide-Scroll Dauer: ca. 1,5–3 s. Echte Guide-Seiten, falls vorhanden; sonst sauberer Nachbau mit Titel und Kapiteln. Gilt für alle Accounts.

> **Stil-Iterationen schnell (Henri 2026-10-12):** Bei Look-/Stil-Änderungen zuerst nur eine kurze Draft-Vorschau der betroffenen Stellen rendern (z. B. erste 3 s + eine Beispielszene + Ende, halbe Auflösung, ~10–15 min), Henri zeigen, erst nach seinem OK das ganze Video in voller Qualität.

> **Keine geposteten Reels umschneiden (Henri 2026-10-12):** Neue Stile/Regeln nie an einem schon geposteten Reel ausprobieren oder es als Beispiel neu schneiden. Immer ein frisches, noch nicht gepostetes Reel nehmen, das danach auch raus kann. Vorher in InstantDM/Run-Ordnern prüfen, ob es schon online ist.

> **Musik-Lautstärke FP (Pius 2026-10-19):** Tame-Impala-Bett mit `--music-volume 0.11` mischen (statt 0.15), „nur einen kleinen Ticken leiser, die Stimme bleibt vorne und die Musik betont sie“. Gilt ab dem Datenschutz-Reel für alle FP-N.

> **Upload in Max-Qualität (Pius 2026-10-19):** Für Zernio nie die 9-MB-Kopie hochladen (die 10-MB-Grenze galt nur für InstantDM im Browser). Stattdessen das Bild direkt aus dem fast verlustfreien Remotion-Render `raw.mp4` encoden und den fertigen Ton übernehmen, eine Kompressionsstufe weniger:
> `ffmpeg -i raw.mp4 -i <final>.mp4 -filter_complex "[0:v]setpts=PTS/1.1,unsharp=5:5:0.35:5:5:0[v]" -map "[v]" -map 1:a -c:v libx264 -profile:v high -level 4.2 -crf 12 -preset slow -pix_fmt yuv420p -g 50 -c:a copy -shortest -movflags +faststart <Thema>-MAX.mp4`, danach BT.709 setzen: `ffmpeg -i <Thema>-MAX.mp4 -c copy -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1 …`. Ergebnis ~16 Mbit/s, ~70 MB für 35 s, Zernio nimmt das an.
