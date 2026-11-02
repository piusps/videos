---
name: gpt-normal-reel
description: Orchestrator NUR für das Normal/Hype-Format auf @florentgpt (B2C-Account, KI-Hype für Endkonsumenten - Websites bauen, mit Claude Geld verdienen, Tool-Hacks, KI im Alltag). Läuft komplett automatisch vom Thema (oder Backlog) bis zum fertigen Reel im GPT-Look „Weiß + Dunkelgrün“ (seit 2026-10-15: Glas-Karten, viel saubere Animation, FP-Untertitel in Grün, kein Branding im Video), inklusive Guide-PDF in der Marke "Florent GPT" (ohne Superkind), und stoppt nur beim Freigabe-Paket vor dem Upload. Kette - gpt-themen (Thema) → gpt-hype-script (Skript) → video-social-copy (Account florentgpt) → video-guidebook (--brand florentgpt) → video-avatar-render (blauer Look) → video-post-production A → video-broll → video-post-production B → video-qc-delivery → video-publish (florentgpt). Nutze diesen Skill bei "Video für Florent GPT", "Hype-Video", "normales Video für den GPT-Account", "mach ein florentgpt-Video zu X". Nicht für @florent_preusser (dafür heygen-video-generator) und nicht für Satire (dafür gpt-satire-reel).
---

# GPT-N · Normal/Hype auf @florentgpt — Orchestrator

**Format-Kürzel:** GPT-N · **Account:** @florentgpt · **Look:** „Niklas gpt normal“ (`c4f527e4e42a44d5accef91353df798f`, seit 2026-10-05, ohne Cap; Stimme immer nikstudio `6cc88d5a…`, nie die Look-Stimme) · **Schnitt:** GPT-Look „Weiß + Dunkelgrün“ (`references/gpt-look-2026-10-15.md`, seit 2026-10-15; ersetzt den @mavgpt-Schnitt und den Dopamin-Casino-Stil) · **Trigger-Wort + Guide:** ja, Marke Florent GPT.

Dieser Skill enthält keine Produktionsregeln, nur Reihenfolge, Übergaben und was für GPT-N anders ist als für FP-N. Übersicht aller Formate: `reel-formate`.

> **Look ab 2026-10-15 (Henri) – hat Vorrang vor allen älteren Schnitt-/B-Roll-Angaben in diesem Skill:** Weiß + Dunkelgrün `#0B3D2C`, Glas-Karten, keine Fotos/Clipart/Münzen/Violett, **kein „Florent GPT“-Branding im Video**, Untertitel = @florent_preusser-Pille in Weiß mit grüner Schrift. Schnitt als eigene Opus-Komposition mit `broll/src/components/GptGreenKit.tsx` statt `render-pipeline.mjs --preset gpt`. Alles in `references/gpt-look-2026-10-15.md`, Referenz-Reel `broll/src/opus/GptZinsenGreen.tsx`.

## Abgrenzung

- Thema **nur** aus `gpt-themen`, Skript **nur** aus `gpt-hype-script` (getrennt, Pius 2026-10-02). Nie `video-script`, `ersetzt-radar`, `ai-takes` (die sind B2B).
- **ChatGPT zuerst (Pius 2026-10-06), Alltagsnutzen:** B-Roll = exakte Klickpfade in ChatGPT (heller Nachbau der ChatGPT-App mit echtem Logo; Claude nur, wenn das Thema es klar braucht), Guide in einfachster Sprache ohne Fremd- und Fachwörter. Details in `gpt-hype-script` (Leitplanken), `references/mavgpt-edit-style.md` (B-Roll) und `video-guidebook` (Plain-language rule).
- **Kein Superkind:** kein Superkind im Skript, in Captions, im Guide, in den DMs. Keine Superkind-Lead-Gen-Abfrage, kein Calendly.
- ~~Schnitt = @mavgpt-Stil~~ (ersetzt seit 2026-10-15 durch `references/gpt-look-2026-10-15.md`; alter Text nur zur Historie) (Pius, 2026-10-01, ersetzt die frühere Ansage „wie FP-N“): weiße Hook-Box mit Emoji, Ein-Wort-Untertitel in Großbuchstaben, 50–70 % Bildschirm-B-Roll mit roten Markierungsrahmen, keine Keyframe-Zooms, Outro-Box „Folg mir und kommentier …“. Alle Details und Messwerte: `references/mavgpt-edit-style.md`. Diese Datei hat für GPT-N Vorrang vor den FP-N-Regeln in `video-post-production` und `video-broll`; Silence Cut, Encode, QC bleiben gleich.

## Ablauf (Run-Ordner `broll/runs/gpt-<slug>/`)

| # | Skill | Was für GPT-N gilt |
|---|---|---|
| 0 | `gpt-themen` | Nur wenn kein passendes offenes Briefing im Backlog liegt: Themen finden und bewerten, Briefing H-NNN schreiben. Sonst das Briefing mit dem höchsten Score nehmen. |
| 1 | `gpt-hype-script` | Aus dem Briefing: Klickpfad in ChatGPT durchspielen (Screenshots), Hook, Skript, Gate, Trigger-Wort; schreibt `format.json`, `brief.md`, `script.txt` |
| 2 | `video-social-copy` | Abschnitt „Account florentgpt“: jüngerer Ton, Caption ohne Superkind, Hashtags B2C |
| 3 | `video-guidebook` | Inhalt für Konsumenten (Schritt-für-Schritt, alle Prompts, kostenlose Wege zuerst), Render mit `--brand florentgpt` |
| 4 | `video-avatar-render` | „Niklas gpt normal“ `c4f527e4e42a44d5accef91353df798f` (seit 2026-10-05, ohne Cap, Stativ). **Cap-Look 98e4ba1a ist gesperrt (Pius 2026-10-05), nie verwenden.** Nie der blaue Look auf @florentgpt., nikstudio-Stimme, lebendiger Motion-Prompt; **kein** Superkind-Glossar nötig, außer das Skript nennt Superkind (soll es nicht) |
| 5 | `video-post-production` Stage A | unverändert |
| 6 | `video-broll` | **Seit 2026-10-15:** Szenen als Opus-Komposition mit `GptGreenKit` bauen (`references/gpt-look-2026-10-15.md`, Ablauf 1–3); die folgende alte Angabe gilt nicht mehr: **nicht** GlassKit und **kein** Explainer-Split (beides ist @florent_preusser): echte ChatGPT-Klickpfade (hell, echte Logos, echte App-UI wie WhatsApp hell in GptChatBrolls.tsx) mit `ScreenFlow` (`accent={[239,68,68]}`, rote Rahmen statt Superkind-Orange), Vollbild; Bildschirm-B-Roll nach `references/mavgpt-edit-style.md` (App-Nachbau mit tippendem Prompt, streamender Antwort, roten Rahmen, Vollbild-Ergebnis; Layout Vollbild oder Screen oben/Gesicht unten), Wechsel alle 3–4 s |
| 7 | `video-post-production` Stage B | **Seit 2026-10-15:** Opus-Render → SFX-Cue-Sheet → `speed-ramp.mjs` → `prepare-music.mjs` (Vivaldi) → `mux-music.mjs` (`references/gpt-look-2026-10-15.md`, Ablauf 3–5). Alt, nicht mehr verwenden: **`render-pipeline.mjs --preset gpt`** (seit 2026-10-02): Ein-Wort-Untertitel (Montserrat Black, weiß), weiße Hook-/Outro-Box mit Emoji, harte Jump-Cuts statt Keyframe-Zooms, B-Roll setzt mit Pop ein. Nie mit den FP-N-Standards rendern, Pius will die Accounts klar unterscheidbar; Länge bis ~45 s erlaubt |
| 8 | `video-qc-delivery` | Desktop-Ordner `~/Desktop/Florent GPT Videos/<Datum> <Thema>/` |
| 9 | `video-publish` | Freigabe-Paket (Stopp) → Upload auf @florentgpt → Automation „Account florentgpt“ (Follow-Gate + Guide, ohne Superkind-Pitch) |

**Parallel:** 2, 3 und der B-Roll-Bau laufen, während HeyGen rendert (wie FP-N). 5 → 6 → 7 → 8 strikt nacheinander.

**Automatisch bis zum Freigabe-Paket.** Stehende Freigabe von Pius gilt auch hier: Skript-Gate statt Skript-Stopp, HeyGen-Credits vorab freigegeben, solange das Gate besteht. Stopp nur bei `video-publish` §0. Sagt Pius „Skript erst zeigen“, nach Schritt 1 stoppen.

## Voraussetzung, die noch fehlt (Stand 2026-10-01)

@florentgpt ist noch nicht in InstantDM verbunden (Dashboard zeigt „1/50 connected“ = nur florent_preusser). Bis dahin endet GPT-N nach Schritt 8: Freigabe-Paket schicken, Pius lädt selbst hoch. Sobald verbunden: in `video-publish` die Account-Zeile ergänzen und Schritt 9 läuft voll.

## B-Roll-Stil ab 2026-10-08 (Henri) – ersetzt seit 2026-10-15

Nur noch Historie, siehe `references/gpt-look-2026-10-15.md`. Hook und alle B-Rolls als Dopamin-Split-Panels (HookKit/DopamineHook, Casino-/Slot-Icon-Stil, Grunddesign weiß/grün/orange). Siehe video-broll → „Dopamin-Split-B-Rolls als Standard“. Hat Vorrang vor älteren Stil-Angaben in diesem Skill.

> **Guide-Scroll-B-Roll (Henri 2026-10-12):** Wird am Ende der Guide/das Guidebook/PDF erwähnt (CTA „steht im Guide“, „Kommentiere X …“), dort eine B-Roll mit dem echten Guide-PDF einblenden: alle Seiten (meist 7–8) als Seiten-Renderings (z. B. `pdftoppm -r 80`) schnell durchscrollen, leicht schräg/3D, mit Tempo und Motion Blur im normalen Schnittstil, damit der Zuschauer sieht, wie viel Wert er bekommt (optional Seitenzähler „8 Seiten“). Nur wenn es zeitlich und inhaltlich passt: Wird in dem Moment noch etwas Wichtiges gesagt oder gezeigt, hat das Vorrang. Gilt für alle Reels mit Guide (FP-N, GPT-N, Felix).
> Guide-Scroll Dauer: ca. 1,5–3 s. Echte Guide-Seiten, falls vorhanden; sonst sauberer Nachbau mit Titel und Kapiteln. Gilt für alle Accounts.

> **Guide-Scroll ist Pflicht, kein Export ohne (Henri 2026-10-13):** Bei FP-N „Eingliederungszuschuss“ ging v1 ohne Guide-PDF und ohne Scroll raus, obwohl die Regel vom 12.10. galt. Deshalb: Guide-PDF (video-guidebook) **vor** dem Schnitt bauen, und jedes Reel mit Trigger-Wort/Guide-CTA bekommt den Guide-Scroll am Ende. Auch bei eigenen Opus-Kompositionen außerhalb der render-pipeline. Referenz-Umsetzung: `PdfScroll` in `broll/src/opus/EingliederungOpus.tsx` (PDF-Fenster fährt von unten ein, echte Seiten, Motion Blur über 8 Samples, Seitenzähler, Trigger-Pille bleibt oben; Swish + `sfx/heygen/extra/page-turn.mp3`). Ohne Guide-Scroll gilt das Reel als nicht fertig.
