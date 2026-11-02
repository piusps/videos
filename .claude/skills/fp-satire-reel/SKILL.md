---
name: fp-satire-reel
description: Orchestrator NUR für das Satire-Format auf @florent_preusser (B2B-Account, KI/Arbeit/Change, Unternehmer und Angestellte, help.hannaa-Stil). Läuft komplett automatisch von der Idee bis zum fertigen Reel im sitzenden ruhigen Look (Niklas Office, nie der blaue Look) und stoppt nur beim Freigabe-Paket vor dem Upload. Kette - ki-satire (Idee, Hook) → ki-satire-skript (Sprechtext) → video-avatar-render (Satire-Variante, sitzend, deadpan) → video-satire-edit → video-qc-delivery → video-publish (ohne Trigger-Wort, mit Engagement-Mechanik). Nutze diesen Skill bei "Satire-Video für florent_preusser", "Satire für den Florent-Preußer-Account", "mach B-0xx als Video", "Satire-Reel" wenn der B2B-Account gemeint ist. Nicht für @florentgpt (dafür gpt-satire-reel) und nicht für normale Videos (dafür heygen-video-generator).
---

> **STOPP – keine Satire auf @florent_preusser (Henri 2026-10-21):** FP-S wird nicht mehr produziert, eingeplant oder gepostet. Satire gibt es nur noch auf @florentgpt (GPT-S). Wer nach Satire fragt, macht GPT-S. Bitte um FP-Satire: einmal nachfragen, ob wirklich gewollt.

# FP-S · Satire auf @florent_preusser — Orchestrator

**Format-Kürzel:** FP-S · **Account:** @florent_preusser · **Look:** sitzend, weiße Wand, zentral (Niklas Office `f4f3ac11…`, Pius 2026-10-02) · **Musik:** lustig (Fluffing a Duck), Pflicht · **Schnitt:** `video-satire-edit` · **Kein Trigger-Wort.**

Dieser Skill enthält keine Produktionsregeln, nur Reihenfolge, Übergaben und was für FP-S anders ist. Jede Regel, *wie* eine Phase gemacht wird, steht in genau einem Phasen-Skill. Übersicht aller Formate: `reel-formate`.

## Abgrenzung (damit nichts kollidiert)

- Ideen und Skripte **nur** aus `ki-satire` und `ki-satire-skript` (Figur: der Rationalisierer, Themen KI/Arbeit/Change). Nie `gpt-satire`, nie `video-script`.
- Look **nur** der sitzende ruhige Look (bleibt so, auch wenn GPT-S den Cap-rückwärts-Look nutzt; Pius 2026-10-01) aus `video-avatar-render` → „Satire (beide Accounts)“. Nie der blaue Look (Pius, 2026-10-01; das erste Satire-Video `satire-chatgpt-mail` lief noch im blauen Look, das gilt nicht mehr).
- Schnitt **nur** `video-satire-edit`. Nie `render-pipeline.mjs`, keine Vision-Captions, keine Hook-Pills, kein Outro.
- Kein Guide, keine Kommentar-Automation, kein Superkind-Lead-Gen.

## Ablauf

| # | Skill | Was | Schreibt nach `broll/runs/fps-<slug>/` |
|---|---|---|---|
| 0 | – | Run-Ordner anlegen, `format.json` = `{"account":"florent_preusser","format":"FP-S","variante":null}` | `format.json` |
| 1 | `ki-satire` | Wenn Pius keine Idee nennt: Schnellmodus („aus dem Backlog“) und **selbst** das stärkste offene Briefing nehmen (nach Weiterleitbarkeit, Format-Rotation beachten). Nennt er B-0xx oder ein Thema, das nehmen. | – (Backlog `~/.claude/ki-satire/backlog.md`) |
| 2 | `ki-satire-skript` | Sprechtext + Overlay + Beat-Plan + Hook B; Retention-Check muss bestehen. Zusätzlich **einen Engagement-Mechanismus** aus `reel-formate/references/satire-engagement.md` (Teil A) einbauen und im Skript markieren. | `script.txt` (nur Sprechtext), `brief.md` (Overlay, Beat-Plan, Mechanismus, Zu prüfen) |
| 3 | `video-avatar-render` | Satire-Variante: sitzender Look, nikstudio-Stimme, deadpan-Motion-Prompt (sitzend) | `avatar.mp4`, `heygen.json`, `rawcheck.txt` |
| 4 | `video-satire-edit` | Stage A (Silence Cut 0.35/0.1, Transkript), Cues, Komposition mit SatireKit, Stills, Render, Finish | `<slug>-final.mp4`, Cover = Frame 0 |
| 5 | `video-qc-delivery` | QC + Satire-Lieferung: Desktop `~/Desktop/Superkind Videos/<Datum> <Thema> (Satire)/`, `texte.txt` mit Hanna-Caption (Teil B der Engagement-Datei) + erstem Kommentar (Teil C) | Desktop-Ordner |
| 6 | `video-publish` | Freigabe-Paket (Stopp, wartet auf Pius) → Upload → ersten Kommentar posten → erste-Stunde-Antworten (Teil D), **keine** Automation | `publish.json` |

**Parallel:** Während HeyGen rendert (Schritt 3): Sticker-Assets und die Komposition aus dem Beat-Plan vorbereiten (Schritt 4 ohne Wortzeiten).

**Skript-Gate statt Stopp:** Vor Schritt 3 muss das Skript die Checklisten aus `ki-satire-skript` (Retention-Check) und `ki-satire` (Hahaha-, Figur-, Klarheits-Test) bestehen. Fällt es durch, umbauen, nicht rendern. Nur wenn Pius „Skript erst zeigen“ sagt, nach Schritt 2 stoppen.

## Was im Freigabe-Paket steht (Satire)

Video, Cover, Caption (ein Satz Dreh + ein Satz Aufforderung, max. 3 Hashtags), der erste Kommentar zum Anpinnen, der eingebaute Engagement-Mechanismus in einem Satz. Kein Trigger, keine DMs.

## Nach dem Posten

Nach 48 h Zahlen holen (`get_post_insights`) und ins `~/.claude/ki-satire/ideen-log.md` beim Briefing eintragen: Aufrufe, Kommentare, Shares, Saves, Mechanismus. Das füttert die Auswahl in `ki-satire`.

> **Satire auf @florent_preusser: 15–20 s (Henri 2026-10-12):** Satire-Reels (FP-S) so kosteneffizient wie möglich: Ziel 15–20 s Video, d. h. Sprechtext ca. 40–55 Wörter, eine Pointe, maximal 3 Beats. Spart HeyGen-Credits (~13–17 pro Reel).
> **Korrektur (Henri 2026-10-15):** Normale FP-Videos (FP-N) laufen auf @florent_preusser weiterhin, die frühere Aussage „nur noch Satire“ gilt nicht. FP-N bleibt bei den normalen Regeln (110–140 Wörter, 30–35 s, Guide + Trigger-Wort).

> **Untertitel-Pille @florent_preusser (Henri 2026-10-12):** Untertitel als Pille im Claude-Orange (ca. #D97757) mit weißer Schrift, Claude-Stil. Position wie gehabt: im Split genau auf der Kante, im Vollbild auf Brusthöhe, nie über Mund/Augen. Gilt für @florent_preusser (FP-S und ggf. FP-N); @florentgpt bleibt bei seinem eigenen Untertitel-Look.
