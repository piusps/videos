---
name: video-script
description: Phase 1 of the Superkind reel pipeline — turns a topic into the spoken HeyGen script. Resolves the strategic core (core message, takeaway, cost of status quo, viewer action), picks Template A or B, applies the retention architecture (first-3-seconds hook, promised step count, felt payoff, re-hooks), writes the 110-140-word German script in HeyGen-safe spelling, picks the trigger word, and runs the mandatory script gate + scroller simulation. Writes brief.md and script.txt to broll/runs/<topic>/. Use for "schreib mir ein Skript zu X", "neues Skript", "Hook verbessern", "Skript kürzen", or as step 1 of heygen-video-generator. Also the home of the hook/creator research and the performance log in references/. Only for @florent_preusser normal videos (FP-N); @florentgpt hype scripts come from gpt-hype-script, satire scripts from ki-satire-skript / gpt-satire.
---

## Themen-Abstand (Pius 2026-11-02, Pflicht vor jeder Themenwahl)
Vor jedem neuen Thema `themen/themen-log.md` lesen (zentrales Log aller Videos seit Ende September, alle Accounts) und, wenn `ZERNIO_API_KEY` da ist, vorher `node broll/scripts/themen-sync.mjs` laufen lassen und `themen/zernio-posts.md` mitlesen.
- **Gesperrt:** ein Kernthema, das in den letzten **45 Tagen** gepostet oder eingeplant wurde, auf irgendeinem Account. Gleiches Kernthema zählt auch mit anderem Hook, Winkel, Format oder Account. Ab 45 Tagen erlaubt, dann mit neuem Winkel.
- Dasselbe fertige Video bewusst auf mehreren Kanälen zu posten ist kein Verstoß; die Regel gilt für neue Videos.
- Im Zweifel (ähnlich, nicht gleich) ein anderes Thema nehmen. Im Briefing den Check belegen: „Abstandscheck: ähnlichstes Thema <X> am <Datum>, <N> Tage her“.
- Sobald ein Video eingeplant ist: eine Zeile in `themen/themen-log.md` ergänzen (Datum, Account, Format, Kernthema, Link).

# Video Script — Phase 1

**Input:** a topic keyword (plus any context the user gives).
**Output (in `/Users/pius/LinkedIn Generator/broll/runs/<topic-slug>/`):**
- `brief.md` — Core Message, Key Takeaway, Cost of Status Quo, Viewer Action, Trigger Word, then 2-4 lines "Why this works" (template, hook formula, trigger axis cost/time/fear).
- `script.txt` — the spoken script only, one flowing paragraph, nothing else. This is the single source of truth: HeyGen reads it, captions take their spelling from it, the social copy and guidebook build on it.

**Out of scope here:** captions and text hooks (`video-social-copy`), guidebook (`video-guidebook`), voice/motion cues and rendering (`video-avatar-render`).

Niche and brand: see `~/.claude/skills/heygen-video-generator/SKILL.md` and its `references/brand.md`.

Research depth (consult for a second opinion, not required to run this phase):
- `references/hook-formulas.md` — hook-formula rationale
- `references/creator-script-templates.md` — full template rationale + filled examples
- `references/swipe-file.md` — segmented competitor reels
- `references/ai-tool-stack-playbook.md` — the real tool stack per topic, plus which topics are accuracy-sensitive
- `references/performance-log.md` — how our own reels performed (retention, 3 s hold). **Read this before writing a hook**; it's the only data that beats predictions.

## Step 1 — Strategic core

If the topic matches a preset, use it (sharpen the number if the user gives context). Otherwise derive the four points the same way: **Core Message, Key Takeaway, Cost of Status Quo** (a real number or vivid specific scenario, never a vague "spart Zeit"), **Desired Viewer Action**. Propose your best default rather than asking.

### Preset — Steuerberater
- Core Message: KI übernimmt die zeitintensive Vorarbeit für die Steuererklärung/Buchhaltung, die bisher an einen teuren Steuerberater ausgelagert wird.
- Key Takeaway: Die KI ersetzt nicht die rechtliche Prüfung, aber die komplette Beleg-Organisation, Vorsortierung und Aufbereitung, also den Teil, für den der Steuerberater am meisten Zeit (und Honorar) verbraucht.
- Cost of status quo: oft vierstelliges bis niedrig fünfstelliges Honorar pro Jahr allein für Vorbereitung/Abstimmung; an die echte Unternehmensgröße anpassen, wenn bekannt.
- **Accuracy caveat (carry into the script):** Die KI darf nie als vollständiger, unbeaufsichtigter Ersatz für die steuerliche Prüfung dargestellt werden. Framing: "übernimmt die Vorarbeit/Organisation", nicht "macht deine Steuererklärung komplett allein". Siehe `ai-tool-stack-playbook.md`, "Tax Filing".
- Template **A**: Belege hochladen → analysieren/kategorisieren → gegen Regeln prüfen → aufbereitete Übergabe an den Steuerberater.
- Trigger word: Steuer

### Preset — Sekretariat
- Core Message: Eine KI übernimmt heute die Arbeit einer Sekretärin (Mails, Kalender, Korrespondenz) für einen Bruchteil der Kosten.
- Key Takeaway: Keine Zukunftsvision, heute in unter einer Stunde aufgesetzt.
- Cost of status quo: 50.000 €/Jahr für eine Vollzeit-Sekretärin (user-validiert, siehe `swipe-file.md`).
- Template **A**, optional mit Template-B-Setup-Schritten für einen dauerhaften Agenten; die drei Ausbaustufen stehen in `ai-tool-stack-playbook.md`, "Secretary / Email & Calendar Automation".
- Trigger word: Sekretariat (validiert, nicht ändern)

### Preset — Buchhaltung
- Core Message: KI übernimmt die laufende Buchhaltung (Belege sortieren, Kategorien zuordnen, gegen Richtlinien prüfen) jeden Monat automatisch.
- Key Takeaway: Der Wert liegt darin, dass es jeden Monat ohne erneuten Aufwand wieder läuft.
- Cost of status quo: Stunden pro Woche für manuelle Belegerfassung, häufige Fehler/Rückfragen.
- Template **B** (dauerhaftes System, kein Einmal-Prompt).
- Trigger word: Buchung oder Belege

### Any other topic
Infer the four points the same way. If the topic touches a category `ai-tool-stack-playbook.md` flags as not yet researched or accuracy-sensitive (tax, legal, anything with compliance stakes), say so in the response and keep claims conservative.

## Step 2 — Pick the template (don't blend them)

**Template A — Prompt-Chain Tutorial** (a multi-step task inside one AI chat, escalating from simple to autonomous):
1. **Hook (≤4 s):** see Step 3, usually "Was passiert, wenn du Claude bittest, …?"
2. **Retain:** 3 escalating steps: analyse → rewrite/fix → optional self-verification → escalation into autonomy (connector, the AI acts in the real world). Every beat boundary gets a spoken pivot: "Und jetzt wird's verrückt." / "Aber jetzt kommt der größte Trick."
3. **Reward:** one sentence framing the result as effortless: "[Tool] erledigt [die Sache], während du schläfst."
4. **CTA:** trigger word stacked with the follow ask in the same sentence.

**Template B — Problem-Reframe-Numbered-Steps** (a build/setup with a tangible finished result: an app, an agent, a lasting system):
1. **Hook (≤4 s):** see Step 3, usually "So baust du dir …" or "Claude hat … ersetzt".
2. **Retain:** numbered steps counted out loud ("Schritt eins … Schritt zwei …"), one sentence each. Inside the word cap: 3 tight steps beat 4 long ones.
3. **Reward:** one sentence with a concrete, checkable result (deadline, percentage, number).
4. **CTA:** same stack as A, optionally two angles in one sentence (pain avoidance OR gain).

Delivery is dense (200-260 wpm at the source creators). Don't write for slow reading.

## Step 3 — Retention architecture (mandatory; learned from run 1 "Website", 2026-09-24, and the real analytics of 2026-09-25)

**What the data says:** the Website reel lost almost everything in the first 2-3 s (100% → ~50% at 2 s → ~35% at 3 s → ~25% at 5 s), then stayed almost flat to the end. The predicted drop at ~10 s (jargon) never happened. So the first 3 seconds get more effort than anything else. **Target: ≥60% still watching at 3 s.** **Benchmark to beat (Abmahnung, 2026-10-01, account record 15.5k plays): 46% still watching at 6 s** (Website reel: ~25% at 5 s). Its first three sentences = event with a threat → amount + deadline → resolution, nothing explained or announced (details in `references/performance-log.md`). Once past ~5 s the structure below holds viewers; don't over-rework the middle.

1. **The hook (first ~4 s) decides the reel.** Write 10 candidates from at least 3 of these patterns (real reels, views vs. the creator's median):
   - "Was passiert, wenn du [KI] bittest, [fast zu gutes Ergebnis]?" — 65x ("… deinen gesamten digitalen Fußabdruck aus dem Internet zu löschen?"), 17x ("… dich auf fünfhundert Jobs zu bewerben?")
   - "So baust du dir [etwas, das man haben will] in [kurzer Zeit]." — 42x ("So baust du dir deinen eigenen Jarvis an einem Wochenende.")
   - "Claude hat [bekanntes Produkt oder Job] ersetzt." — 14x ("Claude hat Duolingo ersetzt.")
   - A real, attributable quote from someone known — 10x ("Der Typ, der bei Anthropic Claude Code leitet, hat gerade gesagt …")

   Pick the one where a 50-year-old owner thinks "das will ich auch, wie geht das?": a result they *want*, not a cost they're told about. Note the two runner-ups in `brief.md`. The next sentence already does the thing (first step or first result); never announce ("Ich zeig dir drei Schritte …"). A result in the hook ("Ich hab's ausprobiert: …") only if it really happened.
2. **The payoff is something the viewer *feels*** (money, hours, risk, "never again"), never a technical step. Test: would a non-technical 50-year-old owner say "wait, what?" (Run 1: "ein Befehl, live" ✗ → "danach kostet dich die Seite null Euro im Monat" ✓.)
3. **Show the result early:** the sentence right after the hook (~3-6 s) describes the finished outcome, so `video-broll` can put the "das will ich auch" animation there.
4. **Outcomes on screen, tools in the guide:** at most **one** named tool in the spoken script (usually "Claude"). Say what each step does for the viewer, not what it's called. Tool names, skills and prompts are the Guidebook's value; say so in the CTA ("die genauen Prompts stehen im Guide"). This overrides the older "name concrete tools" rule.
5. **Re-hook every ~7-8 s:** each step ends by escalating or opening the next loop ("… und das ist noch nicht mal das Krasseste").
6. **Payoff → CTA → end.** Trigger word once inside the CTA, nothing after it.
7. **Spoken hook and text hook split the job (learned 2026-10-03, @pic_josh 47k plays + kallaway text-hook guide):** the spoken first sentence names the **problem/threat**, the on-screen text hook names the **solution/outcome** (or the other way round), never the same sentence twice. Both together put the full context into the first 3 s ("ich sage das Problem und schreibe die Lösung"). Reference: Mahnbescheid spoken "Ein gelber Brief vom Gericht …" + text "Mahnbescheid 2 Wochen / Claude 5 Minuten".
8. **Never hold the solution back for suspense.** Naming a problem alone doesn't hold anyone; people follow accounts that offer solutions. Give a preview of the solution in the first 3 s, the *how* comes later (@pic_josh: the most common mistake).
9. **The CTA is woven into the last point, not appended** (@jun_yuh 1.09M plays: the last line is the punchline and the follow ask at once). Promise a concrete **quantity** in the lead magnet where it's true ("alle fünf Prompts", "die Checkliste mit zwölf Punkten"); quantity CTAs drew 3.9k comments on @rico.incarnati ("100 proven hooks PDF") and 772 on @kallawaymarketing.
10. **Lists/steps: say the count up front and make progress visible** ("Drei Briefe, die du nie ignorieren darfst. Nummer eins …"). A known end point keeps viewers to the last item (@rico.incarnati, @jeffreylouiis 70k plays in 15 s).

11. **No invented first-person story in the hook (re-confirmed 2026-10-05, Betriebsprüfung):** "Der Steuerberater wollte zweitausend Euro …" reads as our own experience. If it didn't happen, phrase it as a market fact ("Für die Vorbereitung zahlst du schnell zweitausend Euro").
12. **CTA names the quantity of what's in the guide** ("alle drei Nachrichten und die Unterlagen-Checkliste"), never just "die genauen Prompts stehen im Guide".
13. **Shares sind der Hebel, nicht Kommentare (Zernio-Analyse 2026-10-28, 53 FP-N-Reels).** Reels mit ≥7k Views hatten im Schnitt 9,8 Shares pro 1.000 erreichte Konten, 2–7k nur 3,7, unter 2k nur 2,2. Watch Time unterscheidet die Gruppen kaum (9,7 / 10,1 / 8,5 s), die Skip-Rate trennt nur nach unten (unter 2k: 65 %). Trigger-Wort-Kommentare bringen keine Reichweite. Deshalb vor dem Skript-Gate die Frage: **An wen schickt der Zuschauer das weiter, und warum?** Alle Ausreißer (Jahresabschluss 45,6k, Browser-Belege 22,9k, Arbeitsvertrag 19,3k, Ausschreibungen 12,1k, NDA 10,6k, AGB 8,4k) haben dasselbe Muster: **ein bezahlter Profi (Steuerberater, Anwalt) oder ein großer Geldtopf, mit konkretem Eurobetrag im ersten Satz, gegen Claude mit konkreter Zeit** („Mein Anwalt wollte sechshundert Euro … Claude hat ihn in zehn Minuten geschrieben“). Das ist weiterleitbar an Mitgründer, Partner, Buchhaltung. Schwach liefen allgemeine Produktivität (Postfach 396), Google-Bewertungen (1,3k) und die 100-Tage-Serie (Ø 1,5k, 1,5 Shares/1k, 65 % Skip). Ohne Profi + Eurobetrag + Claude-Zeit in den ersten zwei Sätzen nur, wenn der Nutzer das Thema ausdrücklich so will.

13. **Hook mechanism rotation (Pius 2026-10-26: "die Hooks der letzten Videos haben alle so ein Langweiligkeits-Muster").** The worn-out pattern: "Du warst/hast [Situation]. [Betrag]. Und [Verlust, keinen Cent]." (Bewirtung, Reisekosten, Amazon, Google Maps v1): the viewer as victim, three slow declarative sentences, the number as an abstract spoken amount, no surprise. **Banned as the opening:** "Du hast/warst …", "Dein [X] ist …", a bare amount as its own sentence, "keinen Cent". Instead pick one of these mechanisms, **never the same one as the last two FP-N videos** (check `brief.md` of the latest runs, each brief names its mechanism):
    - **Selbsttest:** the viewer can check it right now ("Google mal deinen Beruf und deine Stadt. Bist du unter den ersten drei?").
    - **Ein-Ding-Geheimnis:** one single field, word or line decides everything ("Ein einziges Feld in deinem Google-Profil entscheidet, ob Kunden dich anrufen.").
    - **Absurde Szene:** a concrete, slightly ridiculous real-world image in the first five words ("Der Maler steht bei Google als Farbengeschäft drin.").
    - **Kontra:** contradicts what the viewer believes, only if it's true ("Mehr Bewertungen helfen dir da nicht.").
    - **Ergebnis zuerst:** the finished result as the first sentence, then how ("Dieses Google-Profil hat Claude in einer Viertelstunde geschrieben.").
   The first sentence has at most ten words and carries the twist itself; the trick of the video may move into the hook (rule 8), the "Und jetzt kommt der Trick" beat then reveals the second-best point.

## Step 4 — Write the script

German (or the user's language). Single flowing prose, no markup. Include one short "wake-up" sentence after several longer ones ("Nicht irgendwann. Heute.").

**Hard duration cap: 30-35 s = 110-140 words**, CTA included (confirmed 2026-09-23: 53-57 s scripts roughly doubled HeyGen cost). If the topic needs more, cut scope (3 steps instead of 4, less connective tissue), never pacing. Count with `wc -w` before moving on. Reference: 121 words → 44.8 s raw → 36.5 s after silence cut → 33.3 s after the 1.1x ramp.

**Trigger word:** one short, on-topic, easy-to-type word, distinct per topic. Exactly once, inside the CTA sentence ("Kommentiere Frist, und folg mir."), nothing after it (user rule 2026-09-24: no trailing repeat).

**HeyGen-safe spelling (user rule 2026-09-28, verified on the E-Rechnung render).** HeyGen has spelled out ALL-CAPS words letter by letter, and recently normal words too; such a render goes in the bin.
- Every word in normal case, **including the trigger word** ("Kommentiere Postfach"). Uppercase only on screen (hooks, captions), never in `script.txt`. Only acronyms that are spoken letter by letter anyway (PDF, KI, CRM) stay in caps.
- **No digits:** "ab dem ersten Januar", "fünfzigtausend Euro", "elf Wochen".
- **No dashes**, only commas and periods.
- No `<break>` tags or emphasis markup of any kind (retired: unreliable, once ruined a paid render).
- Claude is pronounced "Klod" by the voice; that's accepted.

> **Claude-Teil früh (Henri 2026-10-13, nach FP-N „Eingliederungszuschuss“):** Bei Themen, die schon inhaltlich ziehen (Förderung, Recht, Steuer, Geld vom Staat), kommt der Claude-Teil, also wie man es konkret in Claude macht, **früh**: spätestens im zweiten oder dritten Satz nach dem Hook, nicht erst nach Wer/Wie viel. Der Zuschauer soll sofort merken, dass hier kein Anwalt oder Steuerberater spricht, sondern ein Claude-Experte. Die Fakten zum Thema laufen danach über das, was Claude prüft oder liefert („Claude sagt dir, ob …, wie viel …, bis wann …“).

## Step 5 — Script gate (mandatory before anything is rendered)

Fix and re-check until every line passes:
- [ ] Follows Template A or B exactly.
- [ ] 110-140 words (`wc -w script.txt`).
- [ ] Hook: best of 10 candidates (Step 3), ≤4 s, a result the viewer wants; the next sentence already does something.
- [ ] Hook mechanism (rule 13) named in `brief.md` and different from the last two FP-N videos; no "Du hast/warst … keinen Cent" opener.
- [ ] Payoff is felt (money/hours/risk), passes the 50-year-old-owner test.
- [ ] Share test (Step 3 rule 13): paid expert or money pot with a euro amount + Claude with a time, both in the first two sentences; you can name who the viewer forwards it to.
- [ ] At most one named tool spoken; CTA points to the guide for tools/prompts.
- [ ] A re-hook at least every ~8 s; one short wake-up sentence.
- [ ] CTA stacks trigger word + follow ask; trigger word once, inside the CTA, nothing after.
- [ ] HeyGen-safe: no all-caps words (except spoken acronyms), no digits, no dashes.
- [ ] Claude part early: on topics that pull on their own (funding, law, tax), the "how in Claude" part starts by sentence 2–3 after the hook.
- [ ] Accuracy: no invented tool capabilities; accuracy-sensitive topics framed conservatively.
- [ ] **Scroller simulation:** at 0 s, 3 s, 8 s, 15 s and the payoff ask "why would I keep watching *right now* instead of swiping?" Each checkpoint needs a concrete answer (a promise, a number, a visual, an open loop). A checkpoint without one → rewrite that part.

The Studio app enforces the mechanical parts of this gate in `broll/studio/lib/skill.mjs` (`gate()`). Keep it in sync when you add a rule here.

## Worked example — "Sekretariat" (current rules)

`brief.md`:
- Core Message: Eine KI übernimmt heute die Routine einer Sekretärin (Mails, Kalender, Erinnerungen) für einen Bruchteil der Kosten.
- Key Takeaway: Keine Zukunftsvision, an einem Nachmittag aufgesetzt.
- Cost of Status Quo: 50.000 €/Jahr für eine Vollzeit-Sekretärin.
- Viewer Action: Sekretariat kommentieren und folgen.
- Trigger Word: Sekretariat
- Why this works: Template B, "So baust du dir"-Hook: ein Ergebnis, das man haben will, plus kurze Zeit. Die Kostenzahl kommt erst als Kontrast am Ende.
- Runner-ups: "Was passiert, wenn du Claude die Routine deiner Sekretärin gibst?" / "Claude hat meine Sekretärin ersetzt."

`script.txt`:
"So baust du dir an einem Nachmittag eine Sekretärin, die kein Gehalt will. Schritt eins: Du verbindest Claude mit deinem Postfach, und es schreibt dir zu jeder Standardanfrage eine fertige Antwort in deinem Ton. Du drückst nur noch auf Senden. Schritt zwei: Claude liest deinen Kalender mit und schlägt für jede Terminanfrage passende Zeiten vor. Kein Hin und Her mehr. Und jetzt kommt der eigentliche Trick. Schritt drei: Du gibst Claude einmal deine Regeln, was dringend ist, wie du schreibst, wer Vorrang hat, und ab dann hält es sich bei jeder einzelnen Mail daran. Eine Vollzeitkraft dafür kostet dich rund fünfzigtausend Euro im Jahr. Das hier kostet dich einen Nachmittag. Die genauen Prompts stehen im Guide. Kommentiere Sekretariat, und folg mir."
