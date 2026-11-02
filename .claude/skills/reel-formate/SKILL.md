---
name: reel-formate
description: Übersicht und Weiche für alle Reel-Formate auf beiden Instagram-Accounts von Florent/Niklas. @florent_preusser (B2B, Superkind) hat zwei Formate - Normal (blauer Look, heygen-video-generator) und Satire (sitzender ruhiger Look, fp-satire-reel). @florentgpt (B2C, KI-Hype) hat zwei Formate - Normal/Hype (gpt-normal-reel) und Satire als Gründer-Figur (gpt-satire-reel mit gpt-gruender-satire, atzig nur auf Zuruf). Nutze diesen Skill, wenn unklar ist, für welchen Account oder welches Format ein Video gemacht werden soll ("mach ein Video", "Video zu X" ohne Account/Format, "welche Formate haben wir", "Content-Plan", "was posten wir heute auf welchem Account", "Formate/Accounts/Pipeline-Übersicht"), und bevor ein Orchestrator startet, wenn Account oder Format nicht eindeutig genannt sind. Dazu seit 2026-10-06 Felix (boilr.ai, Englisch) mit „Claude for Recruiters“ (BX-C, boilr-recruiter-reel). Er produziert selbst nichts, er wählt den richtigen Orchestrator.
---

> **STOPP – keine Satire auf @florent_preusser (Henri 2026-10-21):** FP-S wird nicht mehr produziert, eingeplant oder gepostet. Satire gibt es nur noch auf @florentgpt (GPT-S). Wer nach Satire fragt, macht GPT-S. Bitte um FP-Satire: einmal nachfragen, ob wirklich gewollt.

# Reel-Formate: welcher Account, welches Format, welcher Skill

Seit 2026-10-01 gibt es zwei Accounts mit je zwei Formaten. Die vier Formate sind **komplett getrennte Abläufe** mit eigenem Orchestrator und eigenem Ideen-/Skript-Skill. Sie teilen sich nur die Produktions-Skills (Render, Schnitt, QC, Upload), und die bekommen Account und Format immer ausdrücklich übergeben.

## Die Matrix

| | Account | Format | Orchestrator | Ideen + Skript | Look (HeyGen) | Schnitt | Kommentar-Trigger |
|---|---|---|---|---|---|---|---|
| **FP-N** | @florent_preusser (B2B, Unternehmer, Superkind) | Normal: „Claude hat X ersetzt“, Tutorials, Think in Public | `heygen-video-generator` | `ersetzt-radar` / `ai-takes` → `video-script` | **blauer Look** `42a2318d…` (stehend, Hand am Kinn) | `video-post-production` + `video-broll` / `video-broll-explainer` | ja, Guide-PDF + Superkind-Lead-Gen |
| **FP-S** | @florent_preusser | Satire (help.hannaa-Stil, KI/Arbeit/Change, Unternehmer + Angestellte) | `fp-satire-reel` | `ki-satire` → `ki-satire-skript` | **sitzender ruhiger Look** (Niklas Office) | `video-satire-edit` | ja seit 2026-10-27: Gegenmittel-Guide nach der Pointe + Funnel mit Follow-Bitte (`gpt-satire-reel/references/nutzen-bruecke.md`) |
| **GPT-N** | @florentgpt (B2C, Endkonsument, KI-Hype) | Normal/Hype/Tutorial: Alltag mit Claude, Codes-Listen, „Was passiert, wenn“ | `gpt-normal-reel` | `gpt-themen` (Thema) → `gpt-hype-script` (Skript) | **„Niklas gpt normal“** (`c4f527e4…`, ohne Cap; Cap-Look 98e4ba1a gesperrt) | **GPT-Look Weiß + Dunkelgrün** (seit 2026-10-15, `gpt-normal-reel/references/gpt-look-2026-10-15.md`) | ja, Guide-PDF (Marke Florent GPT, kein Superkind) |
| **GPT-S** | @florentgpt | Gründer-Satire (seit 2026-10-05), **atzig** nur auf Zuruf | `gpt-satire-reel` | `gpt-gruender-satire` (atzig: `gpt-satire`) | **Cap rückwärts** (Look fehlt noch in HeyGen, bis dahin kein GPT-S rendern) | `video-satire-edit` (identisch zu FP-S) | nein, Engagement-Mechanik statt Trigger |
| **BX-C** | Felix (boilr.ai, UK-Recruitment-Agenturen, **Englisch**) | „Claude for Recruiters“: Firmen mit Hiring-Signalen und Kandidaten in Claude finden und filtern, mit Klickpfad | `boilr-recruiter-reel` | `boilr-themen` → `boilr-script` | **„Felix“** `40b22473…`, Stimme Felix `a4d894b7…` | `--preset gpt --lang en`, ScreenFlow in boilr-Grün | ja, **jeder Kommentar** → Guide → Vorqualifizierung → HubSpot-Demo |

Regeln, die für alle gelten:
- **Satire-Schnitt ist accountübergreifend gleich** (`video-satire-edit`, Vorbild @help.hannaa). Normal-Schnitt: FP-N nach `video-post-production`, GPT-N im Look „Weiß + Dunkelgrün“ mit `GptGreenKit` (Henri, 2026-10-15; vorher @mavgpt-Stil).
- **Satire nie im blauen Look, Normal nie im sitzenden Look** (Pius, 2026-10-01).
- **@florentgpt immer mit Cap** (Pius, 2026-10-02): Normal = Cap vorwärts, Satire = Cap rückwärts. Die Cap-Looks gibt es nur auf @florentgpt, nie auf @florent_preusser.
- **Ideen und Skripte nie über Kreuz:** `ki-satire`/`ki-satire-skript` nur für FP-S, `gpt-gruender-satire` und `gpt-satire` nur für GPT-S, `video-script` nur für FP-N, `gpt-themen` + `gpt-hype-script` nur für GPT-N, `boilr-themen` + `boilr-script` nur für BX-C (Felix, Englisch).
- **Automatisch bis zur manuellen Zwischenprüfung, bei jedem Format:** Thema → Skript (mit automatischem Skript-Gate) → Render → Schnitt → QC → Desktop-Ordner laufen ohne Stopp (stehende Freigabe von Pius seit 2026-09-24, HeyGen-Credits vorab freigegeben, solange das Gate besteht). Dann stoppt jeder Orchestrator beim **Freigabe-Paket** (`video-publish` §0: Video, Cover, Caption, ggf. Trigger + DMs) und wartet auf Pius' „approved“. Erst danach Upload. Will Pius für ein Format zusätzlich das Skript vorher sehen („Skript erst zeigen“), stoppt der Orchestrator nach dem Skript.
- **Run-Ordner:** `broll/runs/<slug>/`, Präfix je Format: `fp-` (Normal, ältere Runs ohne Präfix), `fps-`, `gpt-`, `gpts-`, `bx-` (Felix). In jedem Run-Ordner liegt `format.json` (`{"account": "...", "format": "FP-N|FP-S|GPT-N|GPT-S|BX-C", "variante": "normal|gruender|atzig|null"}`), damit jede Phase weiß, wofür sie arbeitet.
- **Desktop-Ordner:** FP → `~/Desktop/Superkind Videos/<Datum> <Thema>/`, GPT → `~/Desktop/Florent GPT Videos/<Datum> <Thema>/`. Satire-Ordner bekommen den Zusatz `(Satire)`.

**Zusatzformat SD „Desk Agent“ (seit 2026-10-20, @florent_preusser):** Split-Screen im @_heyclicky-Stil. Oben der Mac-Bildschirm als Klickdummy, unten Hände am MacBook (Stock + KI-B-Roll MiniMax H3 Max), Superkind arbeitet als Agent in Outlook/SAP/Teams. Kein Avatar-Render. Orchestrator und alle Phasen: `desk-agent-reel`. Run-Präfix `sd-`.

## Wie du wählst

1. Nennt Pius Account und Format („Satire für Florent GPT“, „normales Video für florent_preusser“) → direkt den Orchestrator laden.
2. Nennt er nur ein Thema: Ein Business-Thema (Steuerberater, Mahnwesen, Abmahnung) ist FP-N. Ein Konsumenten-/Hype-Thema (Website bauen, Geld verdienen, Side Hustle, App in 10 Minuten) ist GPT-N. Klingt es nach Witz/Satire → FP-S oder GPT-S nach Publikum (Firma/Job = FP-S, Alltag/Konsum = GPT-S).
3. Bleibt es offen: einmal kurz fragen (Account + Format), nicht raten. Eine falsche Zuordnung kostet einen Render.

## Tagesplan (Standard)

- @florent_preusser: 2 Videos/Tag, Mischung Normal/Satire nach Plan von Pius.
- @florentgpt: 2 Videos/Tag = 1 Hype-Video (GPT-N) + 1 Satire-Video (GPT-S). Die Satire kommt seit 2026-10-05 aus `gpt-gruender-satire`; die atzig/normal-Rotation ist pausiert.

## Offen (Stand 2026-10-01)

- @florentgpt ist noch nicht in InstantDM verbunden (Upload + Automation dort erst nach Verbindung, siehe `video-publish`).
- Eigener Avatar-Look für @florentgpt ist entschieden (2026-10-02): die Cap. Offen ist nur noch der Look mit Cap rückwärts für GPT-S. Sobald es ihn gibt, die ID in `video-avatar-render` eintragen und hier in der Matrix nachziehen.
- Editing-Vorlagen für die Satire von Pius kommen noch → in `video-satire-edit` einarbeiten.

> **Satire auf @florent_preusser: 15–20 s (Henri 2026-10-12):** Satire-Reels (FP-S) so kosteneffizient wie möglich: Ziel 15–20 s Video, d. h. Sprechtext ca. 40–55 Wörter, eine Pointe, maximal 3 Beats. Spart HeyGen-Credits (~13–17 pro Reel).
> **Korrektur (Henri 2026-10-15):** Normale FP-Videos (FP-N) laufen auf @florent_preusser weiterhin, die frühere Aussage „nur noch Satire“ gilt nicht. FP-N bleibt bei den normalen Regeln (110–140 Wörter, 30–35 s, Guide + Trigger-Wort).
