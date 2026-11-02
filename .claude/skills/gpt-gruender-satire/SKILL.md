---
name: gpt-gruender-satire
description: Gründer-Satire NUR für @florentgpt (GPT-S) - Standard-Quelle für Idee und Sprechtext jedes Satire-Videos auf dem GPT-Account (Schritt 1 von gpt-satire-reel). Schreibt kurze, nonchalant-witzige Reel-Skripte, gelernt von help.hannaa, aber als eigene Figur - der Gründer, der die KI baut, die gerade den Alltag aller umkrempelt, und dem Chaos kalt und gierig zuschaut. Themen privat und beruflich gemischt (Freunde, Dating, Geld, Freizeit, Büro, Firma führt KI ein), echte Beobachtung für 22 bis 35, bewertet aus falscher Täter-Haltung, oft mit fachlich korrektem Mechanismus aus Ökonomie oder Psychologie. Nutze diesen Skill bei "Satire für Florent GPT", "Satire-Video für den GPT-Account", "Gründer-Satire", "Hanna-Style für florentgpt", "nonchalant", "mit Edge", "zum Weiterschicken" wenn @florentgpt gemeint ist. NIE für @florent_preusser (dort bleiben ki-satire / ki-satire-skript / fp-satire-reel unverändert). Die atzige Variante nur auf ausdrücklichen Wunsch über gpt-satire.
---

## Themen-Abstand (Pius 2026-11-02, Pflicht vor jeder Themenwahl)
Vor jedem neuen Thema `themen/themen-log.md` lesen (zentrales Log aller Videos seit Ende September, alle Accounts) und, wenn `ZERNIO_API_KEY` da ist, vorher `node broll/scripts/themen-sync.mjs` laufen lassen und `themen/zernio-posts.md` mitlesen.
- **Gesperrt:** ein Kernthema, das in den letzten **45 Tagen** gepostet oder eingeplant wurde, auf irgendeinem Account. Gleiches Kernthema zählt auch mit anderem Hook, Winkel, Format oder Account. Ab 45 Tagen erlaubt, dann mit neuem Winkel.
- Dasselbe fertige Video bewusst auf mehreren Kanälen zu posten ist kein Verstoß; die Regel gilt für neue Videos.
- Im Zweifel (ähnlich, nicht gleich) ein anderes Thema nehmen. Im Briefing den Check belegen: „Abstandscheck: ähnlichstes Thema <X> am <Datum>, <N> Tage her“.
- Sobald ein Video eingeplant ist: eine Zeile in `themen/themen-log.md` ergänzen (Datum, Account, Format, Kernthema, Link).

# Gründer-Satire · nur @florentgpt (GPT-S)

> **Gegenmittel (seit 2026-10-27):** An diesem Skill ändert sich 0,0: gleiche Themen, gleicher Aufbau, Effekt/Mechanismus wird weiter genannt. Erst wenn das Skript steht, ordnet `gpt-satire-reel` einen passenden Guide zu und hängt nach der Pointe ein Outro an (höchstens 18 Wörter, `~/.claude/skills/gpt-satire-reel/references/nutzen-bruecke.md`). Kein Thema wegen eines Guides wählen, verwerfen oder umbauen.

**Abgrenzung (Pius, 05.10.2026):** Dieser Skill gehört ausschließlich zum Satire-Format auf @florentgpt. Er schreibt nie in Dateien von @florent_preusser (`~/.claude/ki-satire/`), und FP-S nutzt ihn nie. Die Handwerks-Referenzen unter `~/.claude/skills/ki-satire*/references/` (Sprache, Hanna-Transkripte, Avatar-Satzzeichen) werden nur gelesen. Daten liegen in `~/.claude/florentgpt/satire/gruender/`, Übergabe an die Produktion als `script.txt` + `brief.md` im Run-Ordner `broll/runs/gpts-<slug>/` (siehe `gpt-satire-reel`).

## Die Figur in einem Satz

**Niklas baut die KI, die gerade den Alltag aller umkrempelt, und schaut dem Chaos kalt und ein bisschen gierig zu.** Man soll sich fragen: Warnt er vor dem KI-Alltag, oder verkauft er ihn gerade? Das löst er nie auf.

Hanna hat ihren Kontrast (junge Frau, eiskalte Finanzsprache). Niklas ohne KI ist nur ein Tech-Bro mit Ökonomie-Sprüchen. Deshalb ist die KI sein Kontrast und nicht sein Thema. Details zur Figur, Persona-Fakten, echte Geschichten und die Sperrliste stehen in `references/figur.md`.

## Die sechs Kernregeln

1. **Echte Beobachtung, nie ausgedachte Prämisse.** Es geht um etwas, das es auch ohne Niklas gibt und bei dem ein Zuschauer jemanden markiert: „Das bist du.“ Wenn es das schon als Meme, Tweet oder Stand-up-Nummer gibt, braucht es einen Grund oder eine Folge, die noch keiner gesagt hat. Gibt es die nicht, fliegt es raus.

2. **Niklas ist der Täter.** Der Hook ist eine Ich-Haltung, die man so nicht sagen darf: Er wünscht sich etwas Schlechtes, nutzt es aus oder fordert mehr davon. Danach zeigt die Beobachtung auf „du“, „jeder“ und „alle“. Er bewertet todernst, ohne Zwinkern. Kante nur gegen Gleiche und Höhere (Berater, Gründer-Bubble, Konzern, Boomer-Chefs). Nie gegen Leute, die durch KI ihren Job verlieren, und nie gegen die eigenen Kunden. Er kommt einmal schlecht weg, aber durch Arroganz, Gier oder Faulheit, nie durch Mitleid.
   **Pflicht für die Figur:** In mindestens 3 von 6 Skripten profitiert Niklas sichtbar vom Chaos oder hat es selbst mitgebaut (Superkind, KI-Mitarbeiter, eigener Umsatz). Das steht pro Skript in der Ausgabezeile „Täter-Beat“.

3. **Der Mechanismus ist ein Motor, kein Etikett.** Wenn es einen gibt (Ökonomie, Psychologie, Spieltheorie), dann gilt:
   - Der Fachbegriff wird genannt, denn der Zuschauer soll merken, dass er etwas gelernt hat (Niklas, 05.10.2026). Dafür gibt es genau zwei kurze Sätze: Im ersten fällt der Name, im zweiten steht, was er in Alltagssprache bedeutet. Direkt danach geht es mit einem konkreten Bild weiter, nicht mit einem dritten Erklärsatz (kein „Früher war das …“, kein „Das zählt, weil …“).
   - **Seit 07.10.2026:** Das Format „Dating-Story → Effekt mit englischem Namen → echtes Business-Beispiel → Story schließt sich“ hat einen eigenen Skill: `gpt-effekt-satire`. Wenn Pius so ein Video will, dort arbeiten.
   - Danach wird **jeder Beat in seinen Wörtern bewertet**, und die Logik eskaliert Schritt für Schritt bis zur absurden Forderung (Hanna: Externalität, Pigou-Steuer, Emissionszertifikat für Menschen).
   - Er muss fachlich stimmen. Jeden Mechanismus vor der Ausgabe per Websuche gegen eine Definition prüfen. Pflichtzeile pro Skript: „Gilt hier, weil … (Quelle)“. Ist die Lage unklar, kommt ein anderer Mechanismus oder keiner. In Runde 10 und 11 lagen Regression zur Mitte, Arrow, Akerlof und Spence daneben, obwohl sie plausibel klangen.
   - Hannas Mechanismen werden nicht wiederverwendet (Liste in `references/hanna-vorbilder.md`).
   - Nicht jedes Reel braucht einen. Ihr größtes hat keinen.

4. **Echte Details tragen den Witz:** mindestens zwei pro Skript, also Marke, App, Zahl, Ort oder Floskel. Das Detail ist oft der Lacher.

5. **Der letzte Beat ist der stärkste.** 3 bis 5 Beats, jeder konkreter oder absurder als der vorige, keine Liste von Gleichwertigem. Am Ende steht die absurde Folge aus der eigenen Logik (Forderung, Regel, Plan, Geständnis), dann hört es auf. Steht der stärkste Satz weiter vorne, wird das Skript um ihn herum neu gebaut.
   **Spannungsbogen:** Der Hook öffnet eine Frage, die erst die Pointe beantwortet. Das kann zum Beispiel ein Täter-Satz sein, der noch nicht verständlich ist („Ich verdien an beiden Seiten“, aber welche Seiten?). Danach kommt der Fachbegriff als Aha, dann die Eskalation. In der Pointe wird die Frage aus dem Hook eingelöst. Danach folgt höchstens ein Satz, der den Empfänger oder den Zuschauer ertappt. Kein Beat darf nur erklären, ohne die Geschichte weiterzubringen.

6. **Der Empfänger steckt im Hook** (Niklas, 05.10.2026). Im ersten Satz steht ein Typ, den jeder in seinem Umfeld hat: „Jeder Freundeskreis hat einen, der …“, „An alle, die dieses Jahr Trauzeuge sind …“, die Single-Freundin, der Kumpel mit dem Depot. Beim Hören soll man sofort an eine bestimmte Person denken und das Gefühl haben: Das muss ich der schicken. So funktionieren Hannas große Reels (WG, Erstgeborene, „jede männliche Wohnung“).
   - **Nie aussprechen.** Kein „Schick das an …“, „Markier jemanden …“ oder „Kennst du so einen?“, weder im Hook noch am Schluss. Das wäre peinlich und würde den Effekt kaputt machen. Der Zuschauer soll von selbst darauf kommen.
   - Die Pointe trifft am besten auch diesen Typ, nicht Niklas. Handelt die Pointe nur von Niklas, schickt man das Reel nicht weiter (Runde 12b: „Eine Jurorin“).
   - Findet sich kein Typ, wird der Hook umgebaut. Bleibt das Reel trotzdem ohne Empfänger, fliegt es raus.

**Niklas' Geschmack (keine Regel aus Daten, aber bindend):**
- keine Gleichung „X ist eigentlich Y“
- kein „Gründer behandelt sein Leben wie ein Start-up“
- kein angehängter Gag
- Saint Tropez höchstens im Nebensatz, der ihn lächerlicher macht
- keine Kostenrechnung über Privates (das ist Hannas Markenzeichen)

## KI: Ursache, nicht Thema

KI taucht auf, wenn sie erklärt, **warum sich Menschen gerade anders verhalten.** Das Aha lautet: „Ach, deshalb machen das jetzt alle.“
- **Gut:** KI-Notetaker machen Meetings billiger, also gibt es mehr davon (Jevons). Seit alles glatt nach ChatGPT klingt, sind Fehler der einzige Echtheitsbeweis. Was KI nicht kann, wird teuer (Baumol), und Niklas bekommt keinen Klempner mehr.
- **Schlecht** (Runde 3 und 4): KI-News erklärt, KI-Modelle mit Menschen verglichen, Technik-Vortrag, „ChatGPT schleimt“.
- **Dosis (seit 05.10.2026):** Niklas' Follower interessieren sich für KI. Deshalb ist KI in 4 von 6 Skripten die Ursache für etwas im Privatleben (Dating, Freunde, Familie, Geld, Reisen), dazu kommt höchstens eine News. Ein Skript ganz ohne KI ist höchstens einmal pro Runde dabei. Es bringt Reichweite, aber keine Positionierung. Vorbild ist „Cheap Talk beim Daten“ (Runde 12): privat, jeder erkennt sich wieder, und es zeigt, was KI gerade mit Menschen macht. KI nie als Erklärung oder Vergleich, immer als Ursache für menschliches Verhalten.
- **Folgen statt Nutzung (Niklas, 05.10.2026):** Die Szene „jemand benutzt ChatGPT für X“ (Dating-Text, Aktie, Geheimtipp, Rede) kommt höchstens einmal pro Runde vor. Sonst wird sie zur Schablone, und „alle benutzen ChatGPT“ ist selbst schon ein Meme. Die anderen KI-Skripte zeigen eine **Folge, die man so noch nicht gehört hat**: was sich für alle anderen ändert (der Elektriker zahlt jetzt beim Essen, im Call sitzen sieben KI-Protokollschreiber und ein Praktikant, nach dem Date sieht er anders aus als auf dem KI-Foto). Und nicht immer ChatGPT: auch KI-Fotos, Protokollschreiber im Call, Chatbots im Kundenservice, Bewerbungsfilter, der Algorithmus.
- **Oberstes Ziel:** Sehr viele Leute denken „haha, so ist das immer“. Leute ein bisschen hops nehmen ist ausdrücklich erwünscht, am besten den Empfänger aus dem Hook („Und bevor du jetzt über ihn lachst …“). Liebevoll ertappen ja, verachten nie.
- **Die Firma von innen gehört dazu** (seit dem Zusammenlegen mit ki-satire): Firmen, die KI einführen, Lizenzen, die keiner nutzt, der Chef nach dem KI-Kurs, heimliche Nutzung. Hier ist Niklas am glaubwürdigsten, weil er genau das verkauft. Es gelten dieselben fünf Kernregeln: Er ist der Täter, der daran verdient, nicht der Beobachter, der über den Chef lästert. Pointen nur gegen den Chef sind sicher und lösen Nicken aus (Vergleich vom 05.10.2026: fünf reine Firmen-Skripte lagen bei 3,5 bis 6,5 von 10).

## Der Mix pro Runde (6 Skripte)

| Slot | Anzahl | Was |
|---|---|---|
| Beobachtung mit Mechanismus, ohne KI | höchstens 1 | Leben, Freunde, Geld, Büro |
| KI als Ursache | 4 | Privates Verhalten, das durch KI entsteht, jeweils mit einem Mechanismus. Höchstens eins davon darf in einer Firma spielen, die KI einführt |
| Reaktion auf eine aktuelle News | 0 bis 1, nur statt des Einzeilers | KI- oder Tech-News per Websuche. Die News steht in höchstens einem Satz. Danach nur noch: Was machen Menschen jetzt deshalb anders, und wie verdient Niklas daran? Ein Satz, der erklärt, wie die Technik funktioniert, ist verboten. Ein eigenes Erlebnis mit dem Produkt zählt auch (Vorbild: Hannas „Claude ist anti-Grok“) |
| Einzeiler, Creator-Alltag oder News | 1 | unter 20 Sekunden, Kommentare, DMs, oder eine KI-News nach den Regeln aus der Zeile darüber |

Gibt es in `figur.md` echte Geschichten, ersetzt eine davon einen Beobachtungs-Slot (Aufbau 3). Gibt es noch keine, fragt der Skill einmal am Anfang nach 5 kleinen echten Geschichten und trägt sie dort ein. Niklas kann auch ablehnen, dann geht es ohne weiter.

Pro Runde kommen mindestens drei der fünf Aufbauten aus `hanna-vorbilder.md` vor. Keine zwei Skripte haben dasselbe Gerüst aus Hook-Art, Mechanismus-Einstieg, Stelle der Selbstironie und Art des Schlusses.

## Woher die Beobachtungen kommen

Das sind Felder, keine fertigen Themen. Die naheliegende Pointe ist jeweils verbraucht.
- **Büro der Freunde:** Hard Stop, Kamera aus, Outlook-Blocker, Dienstwagen, Notetaker im Call
- **Gründer-Bubble:** pre-revenue, Stealth, Hyrox, Padel, der Freund, der „gerade was aufbaut“
- **Kundentermine:** nur Niklas' eigene Peinlichkeit im Termin (er erklärt KI, und der Juniorchef ist schneller), nie der Kunde als Pointe
- **Freundeskreis Ende 20:** Hochzeiten, Gruppenchat, „wir müssen uns unbedingt mal sehen“, Essen gehen
- **Geld:** Trade Republic, ETF-Gespräche, getrennt zahlen
- **KI im Alltag:** ChatGPT-Mails, Reden, Bewerbungen, Leute, die beim Essen ChatGPT fragen, Notetaker
- **Creator-Alltag:** Kommentare, DMs, „Link in Bio“
- **Firma von innen:** KI-Einführung, Lizenzen, KI-Beauftragter, Pilotprojekt, Betriebsrat, Datenschutz. Rohstoff in `~/.claude/skills/ki-satire/references/rohstoff.md` (Ring Change, zwei Wörterbücher) und in den offenen G-Briefings im Backlog `~/.claude/florentgpt/satire/backlog.md`

## Ablauf

1. **Lesen:** `references/figur.md`, `references/hanna-vorbilder.md`, `references/abgelehnt.md`, das Log `~/.claude/florentgpt/satire/gruender/ideen-log.md` und den Backlog `~/.claude/florentgpt/satire/backlog.md` (offene Briefings zählen fürs Wiederholungsverbot). Sprachregeln: `~/.claude/skills/ki-satire/references/sprache.md`. Für den News-Slot per Websuche aktuelle KI- und Tech-News der letzten zwei Wochen suchen.
2. **Sammeln:** 15 Kandidaten, jeder in einem Satz. Den Meme-Test (Regel 1) per Websuche auf die Top-Kandidaten anwenden.
3. **Auswählen:** 6 Themen nach dem Mix oben, und pro Skript einen Aufbau.
4. **Schreiben:** Gesprochen und schlampig, Sätze unterschiedlich lang, eigene Stimme statt Hannas Floskeln. Nichts aus der Sperrliste. Klingt ein Satz geschrieben, wird er umformuliert.
   **Für den Avatar gebaut (Niklas, 05.10.2026: Ein KI-Avatar liest vor, keine Mimik, keine Ironie in der Stimme):**
   - Die Wörter sind locker, der Satzbau ist einfach. Umgangssprache ist erwünscht („find's“, „kannst du's“, „ne“), aber jeder Satz hat genau einen Gedanken und meistens 6 bis 15 Wörter.
   - Keine Einschübe und keine Schachtelsätze („und kauft sich, und jetzt kommt's, bei mir eine KI“). Was eingeschoben werden müsste, wird ein eigener Satz.
   - Keine Füllwörter, die nur mit Betonung funktionieren („ehrlich gesagt“, „jetzt kommt's“, „also“ am Satzanfang). Gesprochen klingen sie locker, beim Avatar klingen sie unecht.
   - Der Witz steckt im Inhalt, nicht im Tonfall. **Navi-Test:** Ist der Satz noch lustig, wenn ein Navi ihn vorliest? Wenn nicht, wird er umgebaut.
   - Einwortsätze nur an der Pointe, höchstens drei bis vier pro Skript. Ein durchgehendes Stakkato klingt beim Avatar abgehackt.
   - **Länge:** 90 bis 110 Wörter, also etwa 35 bis 40 Sekunden. Ein Avatar hält die Aufmerksamkeit schlechter als ein Mensch, deshalb gilt Hannas Spanne von 36 bis 95 Sekunden hier nicht. Gekürzt werden zuerst Sätze, die etwas wiederholen, was ein Bild oder die Pointe schon sagt.
   - Den Fachbegriff erklären wie beim Bier, nicht wie im Lehrbuch. Die Formulierung wechselt von Skript zu Skript, damit keine Schablone entsteht.
5. **Prüfen:**
   - Pro Skript die sechs Kernregeln durchgehen, dazu die Zeile „Gilt hier, weil …“ und den Lacher-Satz. Ohne Lacher fliegt das Skript raus.


   - **Spannungs-Check:** In welchem Satz wird die Frage aus dem Hook beantwortet? Liegt er vor dem letzten Drittel, wird umgebaut. Entweder rutscht die Antwort nach hinten, oder ab dort ist jeder Satz schlimmer als der vorige.
   - Den Sprechtext einmal laut und ohne Betonung lesen. Hängt ein Satz, besteht er den Navi-Test nicht oder bringt ein Beat die Geschichte nicht weiter, wird er umgeschrieben.
   - Für die Runde die Gerüst-Zeilen nebeneinanderlegen. Die beiden KI-Ursache-Skripte dürfen weder mit „Seit“ noch mit „Wegen KI“ beginnen und brauchen verschiedene Aufbauten.
   - Dazu der Figuren-Test: Könnte das auch Hanna sagen? Wenn ja, fehlt Niklas' Kontrast. Das gilt nicht für jedes Skript, aber für mindestens die Hälfte der Runde.
6. **Ausgeben:** Das stärkste Skript zuerst. Speichern unter `~/.claude/florentgpt/satire/gruender/skripte/JJJJ-MM-TT-titel.md` und das Log ergänzen. Verbrauchte starke Sätze kommen in die Sperrliste in `figur.md`.
7. **Nach Niklas' Urteil:** Ablehnungen mit Begründung in `abgelehnt.md` eintragen. Eine Regel ändert sich erst, wenn ein Muster in mehr als einer Runde auftaucht.

**Bewerten (blind, Pflicht nach jeder Runde):** Ob es lustig ist, entscheidet Niklas. Zur Unterstützung bewertet ein unabhängiger Agent. Damit er wirklich unabhängig ist:
- Er bekommt nur die nackten Sprechtexte. Keine Titel, keine Slots, keine Lacher-Zeile, keinen Täter-Beat, keine Begründung, keine Info, wer sie geschrieben hat oder was gewollt war.
- Die eigenen Skripte werden mit 3 Hanna-Transkripten gemischt (eins aus ihren Top 5, eins aus dem Mittelfeld, eins aus den Flops, aus `~/.claude/skills/ki-satire/references/quelle-hannaa-transkripte.md`). Ohne Plays, ohne Namen, in zufälliger Reihenfolge, nummeriert als Text A, B, C … Der Schlüssel bleibt beim Hauptlauf.
- Der Prompt ist neutral: „Bewerte diese deutschen Reel-Sprechtexte für Instagram, Zielgruppe 22 bis 35.“ Kein Lob, keine Erwartung, kein Hinweis auf Hanna oder Niklas.
- Kriterien je 1 bis 10: lustig beim ersten Hören, weiterschicken (an wen, wie dringend), clevere Beobachtung, „das bin ich“-Gefühl. Dazu pro Text die stärkste und die schwächste Zeile wörtlich. Keine Umschreib-Vorschläge, denn Kritik-Agenten drücken Richtung Erklären.
- Erst danach löst der Hauptlauf den Schlüssel auf und zeigt Niklas die Tabelle. Liegen die Hanna-Texte nicht vorn, ist der Agent als Richter unbrauchbar, und das wird gesagt.

Für den Avatar gilt `~/.claude/skills/ki-satire-skript/references/avatar-sprechtext.md` komplett, also Satzzeichen, Zahlen, Rhythmus und Aussprache. Bei Widerspruch gehen die Avatar-Regeln aus Schritt 4 vor.

## Vorbilder von Niklas (bestätigt am 05.10.2026)

So soll eine Runde klingen. Volltexte stehen in `~/.claude/florentgpt/satire/gruender/skripte/2026-10-05-runde13-folgen.md`. Nachmachen sollst du die Bauweise, nicht die Sätze.
- **Der Elektriker zahlt** (Baumol): Im Hook steht der Empfänger, danach kommen eine Folge statt der Nutzung und der Täter-Beat „Ich bau KI, die Bürojobs billiger macht“. Am Ende wird der BWL-Freund hops genommen.
- **Sieben KIs und ein Praktikant** (Trittbrettfahrer): Die Logik eskaliert Schritt für Schritt bis zum absurden Bild, die Pointe ist ein Satz aus dem Protokoll.
- **Auf den Fotos anders** (Referenzpunkt): Am Ende wird der Empfänger selbst ertappt („Er sagt über dich gerade genau dasselbe.“).

## Ausgabeformat

````
## [Titel] · [Slot] · ~[X] s
Beobachtung: [ein Satz] · Mechanismus: [Name oder keiner] · Gilt hier, weil: [ein Satz] ([Quelle]) · Aha: [neuer Grund oder neue Folge]
Täter-Beat: [der Satz, in dem Niklas profitiert oder mitverursacht, falls vorhanden]
```
[Sprechtext]
```
Lacher: [Satz] · Schickt man an: [wen, mit welchem Satz] · [prüfen]: [falls nötig]
````
