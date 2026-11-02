---
name: boilr-script
description: Skripterstellung NUR für Felix' Serie "Claude for Recruiters" (Format BX-C, boilr.ai). Macht aus einem Briefing R-NNN aus boilr-themen den gesprochenen englischen HeyGen-Text für Felix' Twin - Tutorial, wie man in Claude Firmen mit Hiring-Signalen oder Kandidaten ganz konkret findet und filtert. Spielt den Klickpfad in claude.ai durch (Screenshots), schreibt Hook-Kandidaten, Skript (100-140 Wörter, UK-Englisch), Trigger-Wort, Versprechen, Beat-Plan und Skript-Gate und legt format.json, brief.md, script.txt in broll/runs/bx-<slug>/. Nutze ihn bei "Skript für R-0xx", "Felix-Skript", "Claude for Recruiters Skript" oder als Schritt 1 von boilr-recruiter-reel. Nicht für @florent_preusser (video-script) oder @florentgpt (gpt-hype-script).
---

## Themen-Abstand (Pius 2026-11-02, Pflicht vor jeder Themenwahl)
Vor jedem neuen Thema `themen/themen-log.md` lesen (zentrales Log aller Videos seit Ende September, alle Accounts) und, wenn `ZERNIO_API_KEY` da ist, vorher `node broll/scripts/themen-sync.mjs` laufen lassen und `themen/zernio-posts.md` mitlesen.
- **Gesperrt:** ein Kernthema, das in den letzten **45 Tagen** gepostet oder eingeplant wurde, auf irgendeinem Account. Gleiches Kernthema zählt auch mit anderem Hook, Winkel, Format oder Account. Ab 45 Tagen erlaubt, dann mit neuem Winkel.
- Dasselbe fertige Video bewusst auf mehreren Kanälen zu posten ist kein Verstoß; die Regel gilt für neue Videos.
- Im Zweifel (ähnlich, nicht gleich) ein anderes Thema nehmen. Im Briefing den Check belegen: „Abstandscheck: ähnlichstes Thema <X> am <Datum>, <N> Tage her“.
- Sobald ein Video eingeplant ist: eine Zeile in `themen/themen-log.md` ergänzen (Datum, Account, Format, Kernthema, Link).

# BX-C · Skript für Felix (Claude for Recruiters)

**Input:** Briefing `R-NNN` aus `~/.claude/boilr/backlog.md`. Nur ein Thema genannt → erst `boilr-themen` ein Briefing schreiben lassen. Ohne Vorgabe: offenes Briefing mit höchstem Score.
**Output (`/Users/pius/LinkedIn Generator/broll/runs/bx-<slug>/`):** `format.json`, `brief.md`, `script.txt`, `klickpfad/NN-name.png`. Backlog-Status → gemacht; Zeile in `~/.claude/boilr/ideen-log.md`.

## Leitplanken

Alle aus `boilr-themen` gelten. Zusätzlich:

- **Sprache: UK-Englisch**, gesprochen, direkt, Peer-to-Peer („you“). Felix ist Gründer und kennt das Agentur-Business, kein Guru-Ton, keine Ausrufezeichen-Hype. Recruiter-Vokabular ist erlaubt (BD, spec, placement, fee, retained), Tech-Jargon nicht.
- **boilr wird im Video nicht verkauft.** Höchstens ein halber Satz Kontext („I run boilr, we do this for 100+ agencies“) in maximal jeder dritten Episode. Der Pitch läuft im DM-Funnel.
- **Ehrlichkeit:** nur vorführen, was in Claude wirklich geht (durchgespielt). Keine erfundenen Zahlen, keine Fee-Versprechen. „100+ agencies“ ist belegt, sonst nichts behaupten.

## Hook-Regel (Pius, 2026-10-06, Vorrang)

- **Emotional + finanzieller Schaden:** Der Hook nennt, was der Zuschauer gerade **verliert**, in Geld. Beispiel: „Once the job ad is live, that twelve-thousand-pound commission for you is already gone.“
- **Wort „commission“, nie „fee“** (Pius 2026-10-06: „fee“ klingt negativ). Alternativ „placement“, „deal“.
- **Immer Zahlen** (Commission in £, Anzahl konkurrierender Agenturen, Tage zu spät, Funding-Summe). Jede Zahl braucht einen Beleg oder eine ausgewiesene Rechnung in `brief.md` (z. B. £12k = 20 % auf £60k, marktüblich 15–25 %).
- **Der konventionelle Weg ist immer der Verlierer:** Job-Boards abtelefonieren, auf Anzeigen warten, Kaltakquise ohne Anlass = die Agenturen, die nicht gewinnen. Die Gewinner lesen Signale. Botschaft: so wie bisher wirst du nicht erfolgreich.
- Grenze: Der Verlierer ist die **Methode**, nie der Recruiter als Mensch und nie „KI ersetzt dich“. Keine erfundenen Statistiken.

## Machart (T1 Tutorial, Standard)

| Sek. | Beat | Beispiel | B-Roll |
|---|---|---|---|
| 0–3 | Hook = finanzieller Schaden + Zahl | „Once the job ad is live, that twelve-thousand-pound commission for you is already gone.“ | Gesicht, harter Punch-in, Text-Box |
| 3–7 | Alter Weg = Verlierer, neuer Weg = Gewinner | „You're the hundredth agency calling. The agencies that win read funding rounds.“ | Gesicht |
| 7–30 | 3 Schritte im Imperativ, echte Menünamen | „Step one. Open Claude and turn on web search …“ | Klickpfad: Klick-Rahmen → Prompt tippt → Antwort läuft |
| 30–36 | Trick-Satz | „And here's the trick. Ask it for the signal, not the company.“ | Ergebnis mit Rahmen |
| 36–42 | CTA | „Comment SIGNALS and I'll send you the exact prompts.“ | Gesicht, Outro-Box |

## Ablauf

1. **Kontext:** Briefing, `ideen-log.md` (letzte Hooks nicht wiederholen). HeyGen-Schreibweise: Zahlen als Wörter, Abkürzungen ausgeschrieben, wo die Stimme sie sonst buchstabiert (BD → „business development“ beim ersten Mal; „CV“ bleibt „CV“).
2. **Klickpfad in claude.ai durchspielen** (Pius' Chrome, mit seinem OK pro Session): jeden Schritt ausführen, Screenshot nach `klickpfad/NN-name.png`, Menüpunkte exakt wie auf dem Bildschirm. **Oberfläche muss Englisch sein** (sonst Screens unbrauchbar). Ergebnis auf Stimmigkeit prüfen: Claude darf keine Firmen oder Signale erfinden, Stichproben der Quellen-Links öffnen. Für Kandidaten-Episoden nur erfundene/anonymisierte CVs hochladen.
3. **10 Hook-Kandidaten** (Satz 1 = Ergebnis, Fakt oder Warnung). Gewinner + 2 Zweitplatzierte in `brief.md`. **Sprech-Hook ≠ Text-Hook** (einer Problem, einer Ergebnis).
4. **Skript:** 100–140 Wörter (`wc -w`), Ergebnis spätestens in Satz 2, Schritte mit echten Menünamen, CTA: „Comment [WORD] and I'll send you [konkretes Versprechen].“ Trigger einmal, nichts danach. Das Versprechen muss im Guide stehen.
5. **Beat-Plan** in `brief.md`: Sekunde, Satz, B-Roll (Screenshot-Datei), Text-Box.
6. **Skript-Gate** (jede Zeile muss bestehen):
   - [ ] 100–140 Wörter, HeyGen-sicher, UK-Englisch.
   - [ ] Hook ≤ 4 s, bester von 10, nennt finanziellen Schaden mit Zahl (belegt/gerechnet); alter Weg als Verlierer; Satz 2 liefert.
   - [ ] Gefühltes Ergebnis für eine Agentur (früher beim Kunden, Fee, Zeit), kein reiner Tech-Schritt.
   - [ ] Klickpfad durchgespielt, Screenshots in Englisch, Ergebnis stichprobengeprüft.
   - [ ] UK GDPR: keine echten Kandidatendaten.
   - [ ] Kein „AI replaces recruiters“, kein Pitch im Video, kein Anthropic-Logo.
   - [ ] CTA mit konkretem Versprechen, Trigger einmal.
   - [ ] Scroller-Simulation bei 0, 3, 6, 15 s und am Ende.
7. **Schreiben:** `format.json` = `{"account":"felix","format":"BX-C","variante":null,"lang":"en"}`; `brief.md` (R-Nr., Hook-Kandidaten, Beat-Plan, Klickpfad + Screenshot-Liste, Trigger, Versprechen, Guide-Inhalt, boilr-Brücke für DM 3, Quellen); `script.txt` (nur Sprechtext).
8. **Abschluss:** Backlog-Status `gemacht → runs/bx-<slug>/`; Zeile in `ideen-log.md` (Datum, R-Nr., Säule, Hook, Trigger, Run).

## Kalibrierung

```
Once the job ad is live, that twelve-thousand-pound commission for you is already gone.
Because now you're the hundredth agency calling, with the same CVs as everyone else.
The agencies that actually win don't wait for job ads. They read funding rounds.
Step one. Open Claude (it searches the web by itself).
Step two. Paste this: find UK fintechs that raised money in the last ninety days, with fifty to two hundred staff.
Step three. Ask it to add the signal, the source, and who's likely hiring the role.
And here's the trick. Don't ask for companies. Ask for the reason they'll hire. That's your opening line.
Comment SIGNALS and I'll send you the exact prompts.
```
(Rund 95 Wörter, Zahlen ausgeschrieben. Funding-Daten vor dem Render in Claude gegenprüfen.)

> **Claude-Teil früh (Henri 2026-10-13, nach FP-N „Eingliederungszuschuss“):** Bei Themen, die schon inhaltlich ziehen (Förderung, Recht, Steuer, Geld vom Staat), kommt der Claude-Teil, also wie man es konkret in Claude macht, **früh**: spätestens im zweiten oder dritten Satz nach dem Hook, nicht erst nach Wer/Wie viel. Der Zuschauer soll sofort merken, dass hier kein Anwalt oder Steuerberater spricht, sondern ein Claude-Experte. Die Fakten zum Thema laufen danach über das, was Claude prüft oder liefert („Claude sagt dir, ob …, wie viel …, bis wann …“).
