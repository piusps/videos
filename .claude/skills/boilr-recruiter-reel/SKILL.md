---
name: boilr-recruiter-reel
description: Orchestrator NUR für Felix' Serie "Claude for Recruiters" (Format BX-C, boilr.ai, alles Englisch, Zielgruppe UK-Recruitment-Agenturen). Läuft automatisch vom Briefing bis zum fertigen Reel mit Felix' HeyGen-Twin, echten Claude-Klickpfaden mit grünen boilr-Rahmen, englischem Guide-PDF (--brand boilr) und dem DM-Funnel Guide → Vorqualifizierung → HubSpot-Demo, und stoppt beim Freigabe-Paket vor dem Upload. Kette - boilr-themen → boilr-script → video-social-copy (Account felix) → video-guidebook (--brand boilr) → video-avatar-render (Felix-Look) → video-post-production A → video-broll (ScreenFlow grün) → video-post-production B (--preset gpt --lang en) → video-qc-delivery → video-publish (felix). Nutze ihn bei "Felix-Video", "Claude for Recruiters Episode", "boilr-Reel", "mach R-0xx als Video". Nicht für @florent_preusser oder @florentgpt.
---

# BX-C · Claude for Recruiters (Felix × boilr) — Orchestrator

**Format-Kürzel:** BX-C · **Account:** Felix (neue Accounts, Pius legt sie an; Handles in `~/.claude/boilr/accounts.md` eintragen, sobald bekannt) · **Sprache:** alles UK-Englisch (Skript, Captions, Guide, DMs) · **Look:** HeyGen „Felix“ `40b224730934da6d42a3d70def3ef9fd` (Gruppe `457a3e6a…`) · **Stimme:** „Felix“ `a4d894b726424281a492f118e6b21f81` (englischer Klon) · **Demo:** https://meetings-eu1.hubspot.com/felix-hermann

Enthält nur Reihenfolge, Übergaben und was für BX-C anders ist. Übersicht aller Formate: `reel-formate`.

## Abgrenzung

- Thema nur aus `boilr-themen`, Skript nur aus `boilr-script`. Nie `video-script`, `gpt-hype-script`, `ai-takes`, Satire-Skills.
- **Kein Superkind, kein Florent, kein Niklas.** Felix ist eine eigene Person und Marke.
- **boilr ist ein fertiges Live-Produkt mit 100+ Kunden** (anders als Superkind): Ziel des Funnels ist eine **gebuchte Demo**, keine Warteliste.
- **Im Video nur Mehrwert**, der Pitch läuft im DM-Funnel (`references/dm-funnel.md`).

## Ablauf (Run-Ordner `broll/runs/bx-<slug>/`)

| # | Skill | Was für BX-C gilt |
|---|---|---|
| 0 | `boilr-themen` | Nur wenn kein offenes Briefing passt; sonst höchster Score |
| 1 | `boilr-script` | Klickpfad in claude.ai (englische Oberfläche) durchspielen, Skript, Gate; `format.json` mit `"account":"felix","lang":"en"` |
| 2 | `video-social-copy` | Abschnitt „Account felix“: englische Hook-Box ohne Emoji-Spam (max. 1), IG- und TikTok-Caption auf Englisch, LinkedIn-Text zusätzlich |
| 3 | `video-guidebook` | Englischer Guide, `--brand boilr` (Grün, Felix × boilr, Demo-Button). Inhalt: alle Prompts zum Kopieren, Klickpfad Schritt für Schritt, ein Abschnitt „Doing this every day?“ mit der ehrlichen Grenze der Handarbeit → boilr |
| 4 | `video-avatar-render` | Felix-Look + Felix-Stimme (Tabelle „Looks per format“), Motion-Prompt ruhig-souverän (Gründer erklärt einem Kollegen), kein Superkind-Glossar. Vor dem Render Vorschaubild öffnen |
| 5 | `video-post-production` Stage A | unverändert; Wortzeiten mit `transcribe.mjs --lang en` |
| 6 | `video-broll` | **nur** `ScreenFlow` mit echten claude.ai-Screenshots aus `klickpfad/`, `accent={[10,95,69]}` (boilr-Grün), Vollbild oder Screen oben/Gesicht unten, Wechsel alle 3–4 s. Kein GlassKit, kein Explainer-Split. Ergebnis-Tabellen gut lesbar heranzoomen |
| 7 | `video-post-production` Stage B | `render-pipeline.mjs --preset gpt --lang en --end-hook "Comment <WORD>\nfor the prompts"` (Ein-Wort-Captions, Hook-Box, harte Punch-ins). Musik: ruhiges, modernes Instrumental; nie die Beds von @florent_preusser oder Vivaldi von @florentgpt. Länge bis ~45 s |
| 8 | `video-qc-delivery` | Desktop-Ordner `~/Desktop/boilr Felix Videos/<Datum> <Thema>/`; zusätzlich prüfen: jede Zahl/Firma im Screen stimmt, keine echten Kandidatendaten |
| 9 | `video-publish` | Freigabe-Paket (Stopp) → Upload auf Felix' IG → Automation nach `references/dm-funnel.md` (**jeder Kommentar** löst aus) |

**Parallel:** 2, 3 und B-Roll-Bau laufen, während HeyGen rendert. 5 → 6 → 7 → 8 strikt nacheinander.
**Automatisch bis zum Freigabe-Paket** (stehende Freigabe, Credits frei, sobald das Skript-Gate besteht). Stopp bei `video-publish` §0.

## Gelernt in Ep. 1 (R-001 Signals, 2026-10-06), gilt ab jetzt

- **Sprachprobe vor dem Render:** Skript zuerst mit `create_speech` (Felix-Stimme) erzeugen und mit `transcribe.mjs --lang en` ohne `--script` prüfen; Trigger-Wort im Render-Text klein schreiben („Signals“, sonst buchstabiert die Stimme). Kostet fast nichts und spart Video-Credits.
- **Stimme nicht monoton und nicht abgerattert (Pius 2026-10-06 nach Ep. 1):** vor jedem Render 2–3 Sprachproben mit unterschiedlichen `voiceSettings` (speed ~0.93, bei ElevenLabs-Stimme stability ~0.4 / style ~0.3) vergleichen, die lebendigste nehmen und dieselben Settings im Render übergeben. Skript dafür mit kurzen Sätzen und Punkt vor Schlüsselzahlen schreiben (Pausen + Betonung). Details: `video-avatar-render` → Felix-Zeile.
- **Musik Ep. 1 final:** lovibe „a good man with a broken heart“ (`~/Downloads/lovibe_a_good_man_with_a_broken_heart_KLICKAUD.mp3`) mit `--music-volume 0.11`, dazu ~40 SFX (vary-sfx), dann loudnorm -14 LUFS.
- **Felix-Schnitt ohne Rattern (Pius 2026-10-06, Ep. 1 v5):** Silence Cut mit `--pad 0.1` (kurze Atempausen bleiben), Render mit `--speed-factor 1.0` (kein 1.1x), Schlüsselwörter (Zahlen, Verben der Pointe, Trigger) +3 dB per `volume`-Ausdruck, dazu Präsenz-EQ (+2,5 dB @3,2 kHz, −1,5 dB @180 Hz) und `acompressor` 2,5:1 auf der Avatar-Spur vor dem Crop. Ergebnis: 3,5 statt 4,1 Wörter/s.
- **Kleine Sprechfehler lokal flicken statt neu rendern:** Ep. 1 sagte „all free prompt“ statt „three prompts“. Fix: genau diese Wörter aus der sauberen Sprachprobe in `avatar.mp4` einsetzen (`avatar-fixed.mp4`, Energie-Hüllkurve für Schnittpunkte, ggf. leichtes `atempo`), danach erneut transkribieren. Geht, wenn die Lippenbilder ähnlich sind (th/f, End-s).
- **Untertitel-Skript mit Ziffern:** `script-captions.txt` (£12,000, 100th, 90, $21M, LemonEdge, SIGNALS) für `transcribe.mjs --script`, damit Captions keine ausgeschriebenen Zahlen zeigen.
- **Bildausschnitt Felix:** der Look hat viel Wand über dem Kopf → `tightened.mp4` vorab croppen: `crop=900:1600:90:320,scale=1080:1920:flags=lanczos` (Kopf ins obere Drittel). Captions per `captionZones` y 0.8.
- **Hook-Dauer = Start der ersten B-Roll** (`--hook-seconds`), sonst liegt die Box über der B-Roll; `--end-hook-seconds` ≈ 3.6.
- **B-Roll:** `src/compositions/BxSignalsBrolls.tsx` ist die Vorlage (ClaudeKit in `<ClaudeLang.Provider value="en">`, Tabellen mit fester Zeilenhöhe + `rowTop()` für exakte grüne Rahmen `#5FD3A0`, keine seitlichen Kamera-Zooms > 1.03 auf Tabellen, Inhalt mittig). Erst Stills prüfen, dann rendern.
- **Musik Ep. 1:** „I Need A Dollar“ Instrumental (`~/Documents/02_VIDEO_EDITING/Media_Library/Music/I_Need_A_Dollar_Instrumental_KLICKAUD.mp3`) — passt zum Geld-Hook; kommerzielle Aufnahme, Content-ID-Risiko einmal erwähnt.
- **review-video.mjs** bewertet nach der breiten Superkind-Rubrik („zu nischig“); Recruiter-Nische ist hier gewollt, Punkte einzeln am Material prüfen.

## Plattformen

IG über InstantDM (mit Funnel). TikTok und YT Shorts: Pius lädt manuell hoch, Caption aus `texte.txt`. LinkedIn: Video nativ hochladen, Text mit „Comment <WORD> and I'll DM you the prompts“; die DMs dort von Hand (keine Automation), Antwort-Vorlage steht in `texte.txt`.

## Offene Voraussetzungen (Stand 2026-10-06)

- Felix' Accounts existieren noch nicht (Pius legt sie an) → Handles in `~/.claude/boilr/accounts.md`.
- Felix' IG muss in InstantDM verbunden werden (Pius loggt sich selbst ein). Eigener MCP-Server `instantdm-felix` mit eigenem Key; vor jedem Upload `whoami` prüfen. Bis dahin endet BX-C nach Schritt 8, Pius lädt selbst hoch.
- claude.ai-Oberfläche für die Klickpfade auf Englisch (Pius' Account-Einstellung oder eigener Felix-Claude-Account, nur mit Pius' OK ändern).

## B-Roll-Stil ab 2026-10-08 (Henri)

Hook und alle B-Rolls als Dopamin-Split-Panels (HookKit/DopamineHook, Casino-/Slot-Icon-Stil, Grunddesign weiß/grün/orange). Siehe video-broll → „Dopamin-Split-B-Rolls als Standard“. Hat Vorrang vor älteren Stil-Angaben in diesem Skill.

> **Guide-Scroll-B-Roll (Henri 2026-10-12):** Wird am Ende der Guide/das Guidebook/PDF erwähnt (CTA „steht im Guide“, „Kommentiere X …“), dort eine B-Roll mit dem echten Guide-PDF einblenden: alle Seiten (meist 7–8) als Seiten-Renderings (z. B. `pdftoppm -r 80`) schnell durchscrollen, leicht schräg/3D, mit Tempo und Motion Blur im normalen Schnittstil, damit der Zuschauer sieht, wie viel Wert er bekommt (optional Seitenzähler „8 Seiten“). Nur wenn es zeitlich und inhaltlich passt: Wird in dem Moment noch etwas Wichtiges gesagt oder gezeigt, hat das Vorrang. Gilt für alle Reels mit Guide (FP-N, GPT-N, Felix).
> Guide-Scroll Dauer: ca. 1,5–3 s. Echte Guide-Seiten, falls vorhanden; sonst sauberer Nachbau mit Titel und Kapiteln. Gilt für alle Accounts.

> **Guide-Scroll ist Pflicht, kein Export ohne (Henri 2026-10-13):** Bei FP-N „Eingliederungszuschuss“ ging v1 ohne Guide-PDF und ohne Scroll raus, obwohl die Regel vom 12.10. galt. Deshalb: Guide-PDF (video-guidebook) **vor** dem Schnitt bauen, und jedes Reel mit Trigger-Wort/Guide-CTA bekommt den Guide-Scroll am Ende. Auch bei eigenen Opus-Kompositionen außerhalb der render-pipeline. Referenz-Umsetzung: `PdfScroll` in `broll/src/opus/EingliederungOpus.tsx` (PDF-Fenster fährt von unten ein, echte Seiten, Motion Blur über 8 Samples, Seitenzähler, Trigger-Pille bleibt oben; Swish + `sfx/heygen/extra/page-turn.mp3`). Ohne Guide-Scroll gilt das Reel als nicht fertig.

> **Claude-Klickpfad = echte claude.ai-Oberfläche (Pius 2026-10-20, bx-dropout v3):** Den Claude-Teil nie als grünes Dopamin-Panel nachbauen („grüne Slop-Scheiße“), auch nicht mit Chips/Stempeln/grünen Rahmen. Stattdessen Klickpfad wirklich in claude.ai spielen (Pius' Chrome, normaler Chat), Screens per `computer zoom` mit `save_to_disk` (Spalte 480 px breit → 936 px, scharf), lange Antworten per JS-`scrollTop` in Streifen aufnehmen und stitchen. Im Video nur Bewegung dazu: Tipp-Reveal über dem echten Prompt-Text, Cursor-Klicks, Scrollen durch die echte Antwort synchron zu den Wörtern. Lokal im Tab vor dem Screenshot: Begrüßungsname → „Felix“, Aircall-Pillen (`.aircall-extension-button`) per CSS neutralisieren. Eingabefeld über der Caption-Naht halten. Referenz: `BxDropoutBrolls.tsx` (ClaudeStep1–3, `Shot`/`TypeCover`/`ScrollShot`). Hook/Payoff dürfen im Split-Stil bleiben.

> **Felix-Augenbraue (Pius 2026-10-20, bx-search):** Beim Felix-Look ist seine rechte Braue (Bildseite rechts) durch das Licht fast weg. Nach Stage A, vor der B-Roll: `scripts/facecheck/brows` (Vision-Landmarks auf 540×960-Frames) → `python3 scripts/facecheck/brow_video.py tightened-eq.mp4 brows.txt tightened-eq-brow.mp4 0.6 --mirror 0.7` (spiegelt die Haarstruktur der linken Braue auf die rechte, Pius wollte sie voller; nur 0.85 ohne --mirror war ihm zu wenig) und diese Datei als Avatar-Quelle (public/render-…-tightened.mp4 und `--avatar`) nehmen. Wirkt nur auf Haar-Pixel, kein grauer Schatten. Vorher/Nachher-Sheet prüfen.

> **Skiprate-Standard (Henri 2026-10-26, nach Analyse von 131 Reels, `~/.claude/boilr/skiprate-analyse.md`). Gilt für jedes Felix-Reel, Vorrang vor älteren Hook-Angaben:**
> 1. **Bild 0 ist fertig.** Headline und Hook-Karte stehen in Bild 0 vollständig, ohne `pop()`/Fade/Slide-in. Bewegung kommt *im* fertigen Bild (Strich läuft, Zahl zählt, Karte wackelt leicht), nicht *vor* dem Bild.
> 2. **Headline ≥ 64 px, max. 6 Wörter, 2 Zeilen**, ohne Ton in < 1 s lesbar. Kleindruck (Ort, DOE …) erst nach 1 s oder weglassen.
> 3. **Caption ab Bild 0:** in `captions.json` `startMs` des ersten Worts auf 0 setzen.
> 4. **Pointe vor 1.5 s:** Kontrast oder Zahl muss in 1.5 s stehen; der Rest des Hooks darf nachlegen.
> 5. **Thema nach Alltagsschmerz:** Situationen, die Jobsuchende gerade erleben (Absage, Schweigen, Angebot, Gehalt, Chef), schlagen Methoden-Themen (Job-Boards, Bewerbungszahl). Tutorial-Teil bleibt, aber der Einstieg ist die Situation.
> 6. **QC-Pflicht:** Bild 0 des Upload-MP4 ansehen (`ffmpeg -frames:v 1`). Leeres/halbes Panel oder fehlende Caption = nicht fertig.
> 7. **Messen:** 48 h nach Post `reelsSkipRate` über Zernio `/analytics` holen und in `ideen-log.md` eintragen.
