# FP-N „Opus-Stil“ – Stand 2026-10-15 (Arena + Google-Bewertung, beide gepostet)

Vorlage für alle neuen @florent_preusser-Normalvideos. Baut auf `broll/runs/STIL-2026-10-12-neue-regeln.md` auf (gilt weiter).
Referenz-Code: `broll/src/opus/GoogleBewertungOpus.tsx` (Standard) und `broll/src/opus/ArenaOpus.tsx` (mit Vollbild-Szenen).
Referenz-Runs: `broll/runs/fpn-google-bewertung/` (v2 = final, 28,2 s) und `broll/runs/arena/` (34,8 s).
Desktop: `~/Desktop/Superkind Videos/2026-10-15 Arena/`.

## Grundprinzip
- **Ein einziges Remotion-Composition-File pro Video** (`src/opus/<Thema>Opus.tsx` + `<Thema>Root.tsx` + `<thema>-entry.ts`), kein render-pipeline.mjs, keine einzelnen B-Roll-Clips. Avatar, Panel, Untertitel, Hook, CTA, Guide-Scroll laufen alle in dieser einen Komposition.
- **Alle Zeiten an Wortzeiten verankert:** `captions.json` (tightened Timeline) wird importiert, `at("wort", n)` liefert die Startzeit. Keine Sekunden von Hand.
- Danach: Speed-Ramp **1.1x** (`sped.mp4`), Musikbett + SFX (`make-sfx.mjs` erzeugt `sfx.json`, Zeiten durch 1.1 geteilt), **−14 LUFS**, Upload-Datei **≤ 9,8 MB**.

## Layout
- **Split ab Frame 0** (kein Vollbild-B-Roll am Anfang; Henri 14.10.: wirkt weniger vertrauenswürdig, Facecheck braucht in jedem Frame ein Gesicht).
- **Panel oben**, Off-White `#F4F3EF` mit feinem Raster (28 px, `rgba(0,0,0,0.045)`), das langsam driftet. Höhe 960 px (Google-Bewertung, 50 %) bzw. 820 px (Arena). Max. 52 % der Höhe.
- **Avatar unten** im blauen Look (42a2318d), Skala ~1.0 mit Schultern, Fokus aus `facefocus.txt`; Gesichtsoberkante unter der Untertitel-Pille. Hautton leicht entschärft (`tightened-skin.mp4`, Filter aus der Stil-Datei vom 12.10.).
- Leichter Push pro Satz am Avatar (abwechselnd rein/raus, max. +3,5 %), Panel-Inhalt mit „Kamera“-Push pro Satz (max. +3 %) und kleinem Sinus-Drift (6 px). Nichts steht still.
- **Arena-Variante:** zwei Vollbild-Szenen (Pixel-Art-Kolosseum mit eigenen Gladiator-Sprites, nie das Claude-Maskottchen) für die emotionalen Höhepunkte („KAMPF!“, Turnier-Runden), Rest im Split.

## Hook (0 bis ~3,8 s, bis zum ersten Szenenwechsel)
- **Text-Hook im Panel oben, auf Frame 0 voll sichtbar** (= Thumbnail): Zeile 1 schwarz auf hell, Zeile 2 weiß auf schwarzer Box (`fonts.bold` 70 px). Akzentwort kann in orange Box stehen („nur *1 Antwort* überlebt“).
- Gesprochen = Problem, Text-Hook = Lösung/Zuspitzung.
- Dichte Bewegung: alle 0,2–0,4 s ein Ereignis (Karte fliegt ein, Zahl rollt 4,8 → 4,1, Tag „− AUFTRÄGE“, Telefon klingelt und verstummt), jedes mit SFX, Shake bei Treffern.

## Panel-Szenen
- Pro Satz/Gedanke eine Szene (`SCENES = [{from, to, origin, El}]`), Wechsel exakt auf Wortzeiten.
- Bausteine: weiße Karten (Radius 18, weicher Schatten), schwarze Label-Chips mit farbigem Punkt, Mono-Tags (JetBrains Mono 800, Caps, Buchstabenabstand 0.12em), Stempel (Mono, Rahmen, Rotation, „scale 1.8 → 1“ mit Back-Easing), Häkchen/Kreuze mit Strich-Animation, Zähler, Spinner, getippter Text, echte Logos (`logoPaths.ts`), nachgebaute Claude-/Google-UI hell.
- Schritte als nummerierte Karten „In 3 Schritten“ (1 → 2 → 3 mit grünen Häkchen).
- Dramaturgie-Karten mit Durchstreichen: „Hinnehmen? → Nein.“, „Gelöscht? entscheidet Google“.
- Klick-Cursor: **eigene Pixel-Figur** (z. B. Lupen-Detektiv oder Gladiator aus ArenaOpus), hüpft im Bogen von Ziel zu Ziel, oranger Ripple + Klick-SFX. Ab 2026-10-19 nicht mehr das Claude-Code-Maskottchen nachzeichnen (fremde Markenfigur), sondern immer eine eigene Figur.
- Farben: Claude-Orange `#D97757` (Akzent), Grün `#1E9E57` (gut), Rot `#E5484D` (schlecht), Tinte `#151515`, Grau `#8A877F`.

## Untertitel
- **Orange Pille `#D97757`, weiße Mono-Caps (JetBrains Mono 700, 46 px, 0.14em)**, 2–3 Wörter pro Chunk (max. ~20 Zeichen, Satzzeichen brechen um).
- **Aktives Wort in schwarzer Pille `#111`**, die wortgenau weiterwandert (~0,08 s Übergang).
- Position: **genau auf der Kante** Panel/Avatar; im Vollbild auf Brusthöhe (y ≈ 1610), beim Übergang ausgeblendet, nie über Mund/Augen.

## CTA + Guide-Scroll (Ende)
- Bei „Kommentier…“: Panel fährt nach oben weg, Avatar wird Vollbild mit langsamem Push.
- **Trigger-Pille:** links schwarz „KOMMENTIERE:“ (Mono 34), rechts orange das Wort (Mono 54), darunter Chip „Vorlage … · per DM“ mit grünem Punkt.
- Bei „Vorlage/Guide“: Panel fährt wieder rein mit **schrägem, schnellem Scroll durch die echten Guide-Seiten** (PDF-Seiten als PNG, perspektivisch gekippt, Motion Blur aus 8 Samples), Kopfzeile „<Name>.pdf“ + „SEITE n/N“, Tag „N SEITEN“ grün. Danach kurz Avatar Vollbild bis zum Ende.

## Ton
- Musikbett aus dem Run (`bed.m4a`), unter der Stimme.
- SFX über `make-sfx.mjs`: jede Cue nennt eine **Familie** (pop, tap, whoosh, ok, stamp, roll, typing, page), der Picker nimmt die am wenigsten benutzte Datei, nie zweimal dieselbe hintereinander, max. 3× pro Datei; Peak-Offsets, damit der Knall auf dem Bild landet. Lautstärken klein (0.06–0.15).
- Dichte: Hook ~8 Cues in 4 s, danach jedes sichtbare Ereignis.

## Ablauf für ein neues Video
1. Skript/Render wie gewohnt (blauer Look, nikstudio). Stage A → `tightened.mp4`, `captions.json`, `facefocus.txt`, Haut-Filter → `tightened-skin.mp4` nach `public/<run>/`.
2. `GoogleBewertungOpus.tsx` kopieren, Anker-Liste `A` auf die neuen Wörter umstellen, Szenen neu bauen (Hook-Szene, je Schritt eine Szene, Ergebnis), Guide-Seiten als PNG in `public/<run>/`.
3. Render der Komposition → `raw.mp4`, Speed 1.1x → `sped.mp4`, `make-sfx.mjs` → Mix mit Bett → loudnorm −14 → `<run>-final.mp4`, Upload ≤ 9,8 MB, Cover = Frame 0.
4. QC: Kontaktbogen, Frame 0 = lesbarer Hook, kein Frame ohne Gesicht, Untertitel nie über dem Gesicht.
5. InstantDM: Automation vorab über „Go to Automation Setup“ am geplanten Post, Lead Gen „FP Guide + Waitlist-Flow“, **All Comments**, 4–5 eigene Kommentar-Antworten, PDF tauschen.

## Vollbild-Szenen und Schritte: hell, Superkind weiß/orange, echte Claude-Klickpfade (Pius 2026-10-22, nach FP-N „Abmahnung“)
- Die Ritter-Arena (ArenaOpus/BelegeOpus) ist **keine Standardwelt** („das passt ja nicht zu jedem Video“), nur auf ausdrücklichen Wunsch bei Kampf-Themen.
- **Keine dunklen Vollbild-Szenen.** Der dunkle Kanzlei-Schreibtisch mit Waage und Münzen wurde abgelehnt („ganz schlechte Karten“, „sehr stock icon image behaftet“). Vollbild = heller Grund (Raster + oranger Glow), weiße Karten, oranger §-Tile, Mono-Tags. Clean, elegant, modern.
- **Schritte = echter Klickpfad in Claude**, nicht nur „Claude-UI“: nachgebautes helles claude.ai mit Mauszeiger (gleitet, Klick-Dip + oranger Ripple). Zeigen, was man macht: Begrüßung + Composer („+“, „Opus 5.5“, oranger Senden-Knopf), Prompt tippen, „+“ → „Add files or photos“ → Datei-Chip, Senden, Antwort mit „Fetched …“-Chip/Haken/§-Box, Artifact-Panel mit „Kopieren“ → „Kopiert“, Ergebnis (z. B. Seite ✓ ONLINE). Echte englische Menü-Labels.
- Referenz-Code: `src/opus/AbmahnungOpus.tsx` (v2): `Pointer`, `Composer`, `ClaudeWin`, `FileChip`, `StatusPill`, `LightBg`, Szenen `FullCheck`, `SceneStep1`, `SceneStep2`, `FullTrick`, `FullUmkehr`.
- Keine Münzen, Waagen, Clipart-Icons, Emojis in der UI. Personen als Initialen-Kreise, Dokumente als Datei-Chips.

## Fertige Helfer statt Hand-Ketten (Henri 2026-10-23: „hab doch mal da nh hand dran dass das sauber läuft“)
- Render abholen: `node fetch-avatar.mjs <run>` (Status, Download, Rohcheck, Kontaktblatt).
- Stage A: `scripts/stage-a-run.sh <run> <video_id> <public-ziel.mp4>` (Silence-Cut, Transcribe mit Skript, Skin-Filter + 1 s Hold nach public/, Facefocus).
- Finish: `MUSVOL=0.11 scripts/finish-run.sh <run> <musik.mp3> <entry-name>` (wartet auf den Remotion-Render, 1.1x, Musik 0,11 + sfx.json, loudnorm −14 @ 48 kHz, Upload-Encode, Cover). Nicht hinter `| tail` hängen, sonst verschwindet der Exit-Code.
- Referenz-Lauf komplett mit diesen Helfern: `runs/fpn-amazon/` + `src/opus/AmazonOpus.tsx` (nachgebautes amazon.de mit Claude-in-Chrome-Seitenleiste, CTA bleibt Split mit Guide-Scroll im Panel).
