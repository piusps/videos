---
name: gpt-hype-script
description: Skripterstellung NUR für die normalen Videos (Hype/Tutorial) auf @florentgpt (B2C) - macht aus einem Themen-Briefing aus gpt-themen (H-NNN) den gesprochenen HeyGen-Text im Stil von @mavgpt, sinngemäß auf Deutsch, ChatGPT zuerst, einfachste Sprache. Wählt die passende Vorlage (T1 Tutorial "Ich zeig dir, wie du X machst" als Standard, T2 Liste, T3 "Was passiert, wenn", T4 Angst + Lösung, T5 "Ich hab gebaut", T6 "Claude kann jetzt"), spielt den Klickpfad in Claude durch, schreibt Hook-Kandidaten, Skript (90-160 Wörter, HeyGen-sicher), Trigger-Wort, Versprechen und Skript-Gate und legt brief.md, script.txt und format.json in broll/runs/gpt-<slug>/. Findet KEINE Themen (das macht gpt-themen). Nutze diesen Skill bei "Skript für H-0xx", "schreib das Florent-GPT-Skript", "Skript für den GPT-Account" oder als Schritt 2 von gpt-normal-reel. Nicht für @florent_preusser (video-script) und nicht für Satire (gpt-satire).
---

# GPT-N · Skript für @florentgpt (Hype/Tutorial)

**Input:** ein Briefing `H-NNN` aus `~/.claude/florentgpt/hype/backlog.md` (von `gpt-themen`). Nennt Pius nur ein Thema ohne Briefing, zuerst `gpt-themen` dafür ein Briefing schreiben lassen. Ohne Vorgabe: das offene Briefing mit dem höchsten Score.
**Output (in `/Users/pius/LinkedIn Generator/broll/runs/gpt-<slug>/`):** `format.json`, `brief.md`, `script.txt`. Im Backlog: Status → gemacht; Zeile in `ideen-log.md`.

**Getrennt von der Themenfindung (Pius, 2026-10-02):** Dieser Skill wählt keine Themen, bewertet keine Themen und pflegt die Ideen-Datenbank nicht. Das ist `gpt-themen`.

**Abgrenzung:** Das ist **nicht** `video-script`. Kein Mittelstand, kein Superkind, kein „Claude hat den Steuerberater ersetzt“, kein 50-jähriger Unternehmer als Maßstab. Gemeinsam ist nur die Render-Schreibweise (unten verlinkt).

## Leitplanken von Pius (2026-10-01, haben Vorrang)

- **Breiteste Zielgruppe überhaupt:** Themen, die jeden betreffen und den Alltag leichter machen (Reisen, Flüge, Gutscheine und Rabatte, Einkaufen, Wohnung, Behörden-Briefe verstehen, Haushalt, Familie, Job). Maßstab: Würde es auch die eigene Mutter nutzen?
- **ChatGPT zuerst (Pius 2026-10-06, ersetzt „nur Claude“).** Klickpfade, B-Roll und Guide zeigen die ChatGPT-App bzw. chatgpt.com. Claude nur, wenn es dort klar besser geht und ohne Installation (Themen kommen aus dem neuen `gpt-themen`). Kein Gemini, keine Drittanbieter-Tools.
- **Superkind kommt nicht vor.** Nirgends.
- **Jede Anleitung muss ein Laie nachmachen können:** Die B-Roll zeigt die exakten Klickpfade in ChatGPT, der Guide erklärt jeden Klick. Gesprochen und geschrieben ohne Fremdwörter und Fachsprache (kein „Prompt“, „Connector“, „Workflow“ ohne Erklärung; lieber „Nachricht an Claude“, „Verbindung“, „Ablauf“).

## Machart (Vorlagen)

Die Machart von @mavgpt ist als sechs Vorlagen in `references/mavgpt-machart.md` konserviert (immer lesen): **T1 Tutorial „Ich zeig dir, wie du X machst“ (Standard)**, T2 Liste, T3 „Was passiert, wenn“, T4 Angst + Lösung, T5 „Ich hab X gebaut“, T6 „Claude kann jetzt X“. Das Briefing nennt die Vorlage; passt sie nicht, T1 nehmen. Dort stehen auch die zehn B-Roll-Bausteine für Abwechslung; im Beat-Plan pro Beat einen Baustein notieren.

## Ehrlichkeit (harte Grenze, auch beim Hype)

- **Keine Einkommensversprechen.** Nie „du verdienst“, „garantiert“, „passives Einkommen ohne Arbeit“. Zahlen nur belegt (Quelle in `brief.md`) oder erkennbar als Frage. Irreführende Verdienstversprechen sind nach UWG und Meta-Werberichtlinien angreifbar und zerstören den Account.
- **Nichts vorführen, was nicht funktioniert.** Jede Fähigkeit muss mit dem aktuellen Claude/Tool wirklich gehen (im Zweifel selbst testen oder als „zu prüfen“ markieren, nicht rendern).
- **Keine Anleitungen zu Spam, Fake-Bewertungen, Abzocke, Prüfungsbetrug, Urheberrechtsklau.** Dreh solche Themen auf Warnung oder Beobachter-Perspektive.
- **Keine fremden Creator imitieren**, keine echten Personen in falschem Licht.

## Ablauf

1. **Kontext laden:** das Briefing, `references/mavgpt-machart.md`, `~/.claude/florentgpt/hype/ideen-log.md` (letzte Hooks nicht wiederholen). HeyGen-Schreibweise: `video-script` → Step 4 „HeyGen-safe spelling“ (nur dort gepflegt).
2. **Klickpfad in ChatGPT durchspielen** (in Pius' Chrome, chatgpt.com, mit seinem OK pro Session): jeden Schritt ausführen, Screenshot pro Schritt nach `broll/runs/gpt-<slug>/klickpfad/NN-name.png`, Menüpunkte exakt so notieren, wie sie dastehen. Geht etwas nicht wie im Briefing: Skript an die Wirklichkeit anpassen oder Briefing an `gpt-themen` zurückgeben.
3. **10 Hook-Kandidaten** nach der Vorlage (Satz 1 ist schon Vorführung, Fakt, Frage mit fast zu gutem Ergebnis oder Warnung). Gewinner + 2 Zweitplatzierte in `brief.md`.
4. **Skript schreiben** nach der Vorlage:
   - **90 bis 140 Wörter** (T2-Listen bis 160). `wc -w`. Kürzer ist besser (seine viralsten: ~105 Wörter).
   - Beweis/Ergebnis spätestens in Satz 2 (Platz für das Vollbild-Ergebnis).
   - Schritte im Imperativ mit den echten Menünamen („Tipp unten links auf das Plus“).
   - **CTA:** „Wenn du [konkretes Versprechen, mit Menge wenn möglich] willst, folg mir und schreib [Wort] in die Kommentare.“ Trigger-Wort einmal, nichts danach; das Versprechen muss im Guide wirklich drin sein.
   - **Sprech-Hook ≠ Text-Hook** (gelernt 2026-10-03, @pic_josh/@kallawaymarketing): einer nennt das Problem, der andere die Lösung oder das Ergebnis; nie zweimal derselbe Satz. Lösung nie für später aufheben.
   - **Listen (T2):** Anzahl im ersten Satz, Fortschritt sichtbar machen („Nummer drei, und die ist die beste“); der CTA ist der letzte Punkt selbst, nicht ein angehängter Satz (@jun_yuh 1,09 Mio. Plays).
   - **Einfache Sprache:** keine Fremd- und Fachwörter (kein „Prompt“, „Tool“, „Setup“, „Workflow“).
   - Ton: Du, direkt, leicht frech, kein Cringe-Slang. Listen: jeder Punkt beginnt mit der Nummer.
5. **Beat-Plan** in `brief.md`: Sekunde, Satz, B-Roll-Baustein (aus den zehn), Screenshot-Datei, Text-Box.
6. **Skript-Gate** (jede Zeile muss bestehen, sonst umschreiben):
   - [ ] Wortzahl passt zur Vorlage, HeyGen-sicher.
   - [ ] Hook ≤ 4 s, bester von 10; Satz 2 liefert schon.
   - [ ] Gefühltes Ergebnis (Geld, Zeit, Angst weg, „krass“), kein technischer Schritt.
   - [ ] Ehrlichkeitsregeln eingehalten, Zahlen mit Quelle in `brief.md`.
   - [ ] ChatGPT zuerst (Claude nur wenn klar besser), kein Superkind, keine Fremd- oder Fachwörter.
   - [ ] Klickpfad in Claude durchgespielt, Screenshots vorhanden.
   - [ ] CTA mit konkretem Versprechen + Follow, Trigger einmal.
   - [ ] Scroller-Simulation bei 0, 3, 6, 15 s und am Ende: Warum jetzt weiterschauen? (Messlatte aus FP-N: 46 % nach 6 s.)
7. **Schreiben:** `format.json` = `{"account":"florentgpt","format":"GPT-N","variante":null}`; `brief.md` (Briefing-Nr., Vorlage, Hook-Kandidaten, Beat-Plan, Klickpfad mit Screenshot-Liste, Trigger, Versprechen, Guide-Inhalt in Stichpunkten, Quellen); `script.txt` (nur Sprechtext).
8. **Abschluss:** Briefing im Backlog auf `Status: gemacht → runs/gpt-<slug>/`; Zeile in `ideen-log.md` (Datum, H-Nr., Videoart, Hook, Trigger, Run).

## Kalibrierung (Beispiel, Säule 1)

```
So baust du dir in zehn Minuten eine eigene Website, ohne eine Zeile Code. Und zwar eine, die aussieht, als hätte sie zweitausend Euro gekostet.
Schritt eins. Du sagst Claude in einem Satz, wer du bist und was die Seite können soll.
Schritt zwei. Claude baut dir die komplette Seite, mit Texten, Bildern und Kontaktformular. Du siehst sie sofort.
Und jetzt kommt der Trick. Schritt drei. Mit einem Klick ist sie online, unter deinem eigenen Namen. Kostet dich null Euro im Monat.
Und das Beste, genau so verdienen gerade Leute Geld. Sie bauen solche Seiten für den Friseur um die Ecke.
Kommentiere Website, dann schick ich dir den kompletten Guide mit allen Prompts. Und folg mir für mehr.
```
(„Null Euro im Monat“ und „Leute verdienen Geld damit“ müssen zum Zeitpunkt des Videos stimmen; Hosting-Weg im Guide belegen.)

> **Claude-Teil früh (Henri 2026-10-13, nach FP-N „Eingliederungszuschuss“):** Bei Themen, die schon inhaltlich ziehen (Förderung, Recht, Steuer, Geld vom Staat), kommt der Claude-Teil, also wie man es konkret in Claude macht, **früh**: spätestens im zweiten oder dritten Satz nach dem Hook, nicht erst nach Wer/Wie viel. Der Zuschauer soll sofort merken, dass hier kein Anwalt oder Steuerberater spricht, sondern ein Claude-Experte. Die Fakten zum Thema laufen danach über das, was Claude prüft oder liefert („Claude sagt dir, ob …, wie viel …, bis wann …“).
