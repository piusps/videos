---
name: ki-satire
description: Liefert satirische, ironische Reel-Ideen nur für das Satire-Format auf @florent_preusser (FP-S, Orchestrator fp-satire-reel) nach der Methode von help.hannaa, übertragen auf KI, Arbeit und Change. Pro Idee Hook (erste 3 Sekunden, wörtlich), Kern und Pointe in so einfacher, gesprochener Sprache, dass jeder sie beim ersten Hören versteht. Feste Ich-Figur (der Rationalisierer), wiederkehrende Formate (Begriff-Reel, Anapher-Sketch, Kostenrechnung, Einzeiler, Unwort, Gegenüberstellung, Check), Backlog mit B-Nummern. Nutze diesen Skill, wenn Niklas witzige, ironische oder satirische Reels für den B2B-Account will, nach Hooks, Formaten, Serien, Sketchen oder seiner Figur fragt, "wie help.hannaa", "mit Witz", "unterhaltsamer" sagt oder die Sprache zu kompliziert findet. Thesen ohne Witz macht ai-takes. Satire für @florentgpt macht gpt-satire.
---

## Themen-Abstand (Pius 2026-11-02, Pflicht vor jeder Themenwahl)
Vor jedem neuen Thema `themen/themen-log.md` lesen (zentrales Log aller Videos seit Ende September, alle Accounts) und, wenn `ZERNIO_API_KEY` da ist, vorher `node broll/scripts/themen-sync.mjs` laufen lassen und `themen/zernio-posts.md` mitlesen.
- **Gesperrt:** ein Kernthema, das in den letzten **45 Tagen** gepostet oder eingeplant wurde, auf irgendeinem Account. Gleiches Kernthema zählt auch mit anderem Hook, Winkel, Format oder Account. Ab 45 Tagen erlaubt, dann mit neuem Winkel.
- Dasselbe fertige Video bewusst auf mehreren Kanälen zu posten ist kein Verstoß; die Regel gilt für neue Videos.
- Im Zweifel (ähnlich, nicht gleich) ein anderes Thema nehmen. Im Briefing den Check belegen: „Abstandscheck: ähnlichstes Thema <X> am <Datum>, <N> Tage her“.
- Sobald ein Video eingeplant ist: eine Zeile in `themen/themen-log.md` ergänzen (Datum, Account, Format, Kernthema, Link).

> **STOPP – keine Satire auf @florent_preusser (Henri 2026-10-21):** FP-S wird nicht mehr produziert, eingeplant oder gepostet. Satire gibt es nur noch auf @florentgpt (GPT-S). Wer nach Satire fragt, macht GPT-S. Bitte um FP-Satire: einmal nachfragen, ob wirklich gewollt.

# KI-Satire: Hook und Kern, die jeder beim ersten Hören versteht

Du lieferst Niklas 6 Reel-Ideen im Stil von help.hannaa, übertragen auf seine Welt. Pro Idee: Format, Hook, Kerninhalt, Pointe. Hook und Kern stehen **wörtlich** da, so wie Niklas sie in die Kamera sagt. Kein vollständiges Skript mit Regieanweisungen, keine Hashtags, keine Caption.

Zwei Dinge entscheiden alles:

1. **Die Methode.** Ein Alltagsthema, eine Brille, eine Ich-Figur ohne Moral. Bei Hanna ist die Brille Ökonomie, bei Niklas der Blick von jemandem, der beruflich Arbeit automatisiert. Ihr Thema ist nicht Finance, sondern Dating, Freunde, Geschwister, WG. Niklas' Thema ist nicht "KI-Einführung", sondern Arbeit und Leben, gesehen durch die KI-Brille. Details: `references/methode.md`.
2. **Die Sprache.** Niklas hat die erste Runde verworfen, weil sie "sprachlich nicht straight forward, nicht einfach und verständlich für Leute ausgedrückt" war. Beispiele für den Fehler: "Human in the loop ist Unternehmenssprache für: …", "Cargo-Kult", "Principal-Agent". Jeder Satz muss beim ersten Hören sitzen, bei jemandem, der beruflich nichts mit KI zu tun hat. Sprache ist kein Feinschliff am Ende, sie ist das härteste Kriterium. Lies `references/sprache.md`, bevor du den ersten Satz schreibst.

## Ablauf

### 1. Kontext laden

- `references/methode.md`: Hanna-Analyse, Skelett, was ihre Zahlen zeigen
- `references/figur-und-formate.md`: Niklas' Figur, Regeln, Running Gags, alle Formate mit Beispiel
- `references/sprache.md`: Regeln, Wortliste, Vorher/Nachher
- `references/rohstoff.md`: Themen-Ringe, zwei Wörterbücher, Stämme, besetzte Themen
- `references/angles.md`: drei Ebenen (Oberfläche, Dreh, Wahrheit), der Angle-Generator mit 7 Linsen, Weiterleit-Motive. **Pflicht vor Schritt 3.**
- `references/recherche.md`: Quellen für die aktuelle Recherche und das wöchentliche Hanna-Update
- `~/.claude/skills/ai-takes/references/kontext.md`: wer Niklas ist, Superkind, Publikum
- Logs: `~/.claude/ki-satire/ideen-log.md` und `~/.claude/ai-takes/ideen-log.md`, falls vorhanden. Wiederhole keine Idee. Rotiere die Formate: Was in der letzten Runde zweimal vorkam, darf diesmal höchstens einmal vorkommen.
- `~/.claude/ki-satire/backlog.md`: alle Ideen als fertige Briefings mit Nummer (B-001, B-002 …) und Status offen oder geskriptet. **Immer zuerst lesen.** Offene Briefings stehen gleichberechtigt neben den neuen Rohideen in Schritt 3 und zählen fürs Wiederholungsverbot wie das Log.
- `~/.claude/ki-satire/hanna-neu.md`: Hannas neueste Reels mit Aufrufen, wöchentlich aktualisiert (Schritt 2). Lies den Abschnitt "Was gerade läuft", um zu sehen, welche Formate und Themen bei ihr aktuell ziehen.
- `references/quelle-hannaa-transkripte.md` (50 Original-Transkripte) nur lesen, wenn du ein Format im Original nachschlagen musst.

Wenn Niklas eigenen Input mitgibt (eine News, eine Beobachtung, ein Thema), ist das der wichtigste Rohstoff. Baue mindestens die Hälfte der Ideen darauf auf.

**Schnellmodus („auf Knopfdruck“):** Sagt Niklas „schnell“, „aus dem Backlog“ oder „was liegt an?“, oder will er sofort Ideen ohne Recherche, dann überspring die Schritte 2 bis 5. Gib die 6 stärksten offenen Briefings aus dem Backlog aus, sortiert nach Weiterleitbarkeit und mit der Mischung aus Schritt 6, im Ausgabeformat mit ihrer Nummer. Abgelaufene News-Briefings lässt du weg. Liegen weniger als 6 offene Briefings bereit, sag das und biete eine volle Runde an.

### 2. Rohstoff sammeln

Es gibt zwei Quellen:

- **Zeitlos:** Wörterbücher, Stämme und Ringe in `rohstoff.md`. Hannas beste Reels sind fast alle zeitlos (antifrugale WG, Erstgeborene, Beziehung kostet 33.000 €).
- **Aktuell:** 6 bis 10 Suchen zu den letzten 7 Tagen, verteilt auf die Quellen in `references/recherche.md`: deutsche Nachrichtenseiten, Foren, in denen Angestellte über KI im Job reden, LinkedIn-Fremdscham, internationale Pannen und Big-Tech-Drama. Nimm nur Funde, in denen ein Mechanismus oder ein absurdes Bild steckt. Reines Staunen reicht nicht: Bei Hanna ist ein sachliches Produkt-Review mit 3.400 Plays gefloppt, das Anthropic-Drama mit dem Flugzeug-Bild hatte 187.000.
- **Hanna aktuell:** Ist `hanna-neu.md` älter als 7 Tage oder fehlt, aktualisiere sie nach `references/recherche.md`, Abschnitt "Hanna-Update", bevor du Ideen erzeugst.

Mechanismen müssen stimmen. Wenn du nicht sicher bist, wie etwas funktioniert, such es oder markiere es mit "zu prüfen".

### 3. Rohideen erzeugen: erst Themen, dann Angles

1. Such dir **8 bis 10 Themen** aus Recherche, Ringen und Backlog.
2. Schreib zu jedem Thema **mindestens 5 Angles** mit verschiedenen Linsen aus `angles.md` (Blick der KI, Übertragung, Wörtlich nehmen, Zu Ende gedacht, Umkehr, Zeitsprung, Begriff). Jeder Angle bekommt einen Hook-Entwurf in einem Satz.
3. Nimm pro Thema **den einen Angle** mit dem größten Abstand zwischen „Hä?“ und „Genau so ist es“. Nicht den naheliegenden.
4. Gib dem gewählten Angle ein Format und notier die drei Ebenen: Oberfläche, Dreh, Wahrheit.

So entstehen aus 40 und mehr Angles 8 bis 10 starke Rohideen statt 15 flacher.

### 4. Filtern

1. **Hä-Test.** Klingt der Hook falsch, frech oder moralisch daneben? Gut. Nickt man nur? Dann ist die Idee tot ("No shit, Sherlock").
2. **Figur-Test.** Tritt die Idee nach oben oder zur Seite (Konzerne, Berater, Big Tech, Tech-Bros, Chefs, Niklas selbst)? Oder nach unten (Sachbearbeiterin, Azubi, Leute mit Angst um ihren Job)? Nach unten ist tot. Wenn der Zuschauer liebevoll ertappt wird ("Das bist du"), ist das in Ordnung. Verachtung ist es nicht.
3. **Grenze: Kante ja, Anleitung nein.** Nichts darf sich als Anleitung zu Betrug, Täuschung oder Rechtsbruch lesen. Dreh die Perspektive auf Beobachter oder Warnung, wie in ai-takes Schritt 4c.
4. **Weiterleit-Test.** An wen schickt man das Reel, und was tippt man dazu? Welches Motiv aus `angles.md` trifft es (Stellvertreter, Markieren, Gruppe, Klug wirken)? Wenn dir kein Empfänger einfällt, ist die Idee tot.
5. **Themen-Test.** Würde die Idee auch ohne KI, Digitalisierung oder Veränderung in der Firma funktionieren? Wenn ja, ist sie raus. Alltag darf als Bild dienen („KI-Einführung ist wie ein Fitnessstudio-Abo“), aber das Thema ist immer KI, Digitalisierung oder Change. Zweite Frage: Passt das zu jemandem, der Firmen KI-Mitarbeiter baut? Wenn es jeder Comedy-Account posten könnte, fehlt der Bezug zur Figur. **Ausnahme KI-fern:** Ein Alltagsthema ohne KI (Familie, WG, Beziehung) ist erlaubt, wenn Niklas' Brille als Automatisierer tragend bleibt. Er schaut auf die Familien-WhatsApp-Gruppe „wie auf einen Ablauf bei einem Kunden“. Vorbild ist B-024 (Familien-WhatsApp-Gruppe), das Niklas ausdrücklich gut fand. Höchstens jedes zehnte Reel, im Briefing als „Ring: Leben (KI-fern)“ markiert.
6. **Klarheits-Test.** Versteht jemand ohne Bürojob nach dem Hook allein, worum es geht? Lässt sich die Botschaft in höchstens 7 Wörtern sagen? Kommt der erste Witz spätestens nach dem zweiten Satz? Wörter aus der Büro-Blase (Quick Win, Leuchtturmprojekt, Intranet, Stakeholder) fliegen raus, außer der Witz ist das Wort selbst. Fällt eine Idee durch, wird sie vereinfacht, nicht verteidigt.
7. **Status-Test.** Spricht Niklas als er selbst und wirkt am Ende klug und nah dran? Rollen, POV und Verkleidung sind raus (Regel 5 und 6 in `figur-und-formate.md`). Selbstironie nur, wenn er drübersteht.
8. **Hahaha-Test (der wichtigste).** Denkt man beim ersten Hören „hahaha, das muss ich sofort weiterschicken“? Nicht „stimmt“, nicht „ganz amüsant“, nicht „clever“. Dafür muss man sofort verstehen, worum es geht, beim Hook lachen und bei der Pointe nochmal. Außerdem braucht die Idee alle drei Ebenen (Oberfläche, Dreh, Wahrheit). Fällt eine Idee hier durch, ist sie raus, egal wie gut sie sonst ist. Die Negativbeispiele am Ende von `angles.md` zeigen, wie „fast gut“ aussieht.

### 5. Sprache umschreiben (Pflicht, eigener Schritt)

Schreib jeden Hook und jeden Kernsatz einmal nach `sprache.md` um, bevor du ausgibst. Die erste Fassung ist fast immer zu kompliziert. Arbeite dann die Checkliste am Ende von `sprache.md` Satz für Satz ab: laut lesen, Kumpel-Test, Wortliste, Satzlänge. Ein Satz, der durchfällt, wird umgebaut, nicht verteidigt.

### 6. Ausgeben, loggen, nachfragen

Gib 6 Ideen aus, sortiert nach Weiterleitbarkeit. Die Mischung pro Runde:

- mindestens 3 verschiedene Formate
- mindestens 1 Einzeiler (12 bis 15 Sekunden)
- mindestens 4 Ideen aus den Ringen Change und Arbeit, höchstens 1 aus dem Ring Leben
- mindestens 4 verschiedene Linsen aus `angles.md`
- höchstens 1 News-Idee
- höchstens 1 Superkind-Brücke
- höchstens 1 KI-ferne Idee (Ausnahme im Themen-Test), gern eine pro Runde als Türöffner
- mindestens 1 Idee aus dem Backlog, wenn dort eine liegt, die die Filter aus Schritt 4 heute noch besteht

Danach nennst du die zwei Ideen, die er zuerst drehen sollte, mit je einem Satz Begründung. Dann fragst du, welche er nimmt. Die gewählten Ideen schreibt der Skill ki-satire-skript als Avatar-Sprechtext aus.

Häng die Runde an `~/.claude/ki-satire/ideen-log.md` an (Datei anlegen, falls sie fehlt): Datum, Hook, Format, Ring, Begriff.

Pflege danach den Backlog `~/.claude/ki-satire/backlog.md`. Er ist die eine Ablage, aus der ki-satire-skript später liest. Deshalb steht dort jede Idee vollständig:
- **Neu rein:** die 6 ausgegebenen Ideen und jede weitere Rohidee dieser Runde, die alle Filter aus Schritt 4 bestanden hat. Jede als Briefing im Ausgabeformat unten (Hook, Kern, Pointe, Schickt man an, Beleg, Risiko), mit dem Sprach-Durchgang aus Schritt 5. Kopfzeile: `### B-NNN · Titel`, darunter `Status: offen · Angelegt: JJJJ-MM-TT · News-Datum: JJJJ-MM-TT oder –`. Nummern laufen weiter, auch wenn alte Briefings gelöscht wurden. Neue Briefings kommen ans Ende.
- **Raus:** News-Briefings, deren News-Datum mehr als 21 Tage zurückliegt, außer sie sind schon geskriptet. Zeitlose Briefings bleiben.
- **Nur Witziges und Cleveres bleibt.** In den Backlog kommt nur, was beim Lesen wirklich zum Lachen bringt und einen cleveren Dreh hat, so wie B-024 (Familien-WhatsApp-Gruppe) oder B-014 (KI in der Probezeit). Solide, aber flach ist raus. Im Zweifel raus.
- **Bei jeder Pflege nachprüfen:** Geh auch die alten offenen Briefings nochmal durch und wirf raus, was neben den neuen schwach wirkt.
- **Ziel:** 20 offene Briefings, aber nie mit schwachen Ideen auffüllen. Lieber 12 starke als 20 gemischte. Wenn weniger als 12 übrig sind, sag es Niklas. Mehr als 60 offene? Dann streich die schwächsten.
- Aktualisiere die Zählerzeile oben (`Offen: N · Geskriptet: N · Nächste Nummer: B-NNN`).
- Nenn in der Ausgabe die Nummern der 6 Ideen, damit Niklas direkt „Skript für B-014“ sagen kann.

## Ausgabeformat

```
**B-NNN · [Arbeitstitel, 3–5 Wörter]**
Format: [Name] · Ring: [Change / Arbeit / Leben / News] · Linse: [Linse aus angles.md] · Länge: [~15 / ~30 / ~45 s]

Hook (0–3 s): „[wörtlich]“
Kern:
– „[wörtlicher Satz]“
– „[wörtlicher Satz]“
– „[wörtlicher Satz]“
Pointe: „[letzter Satz]“

Wahrheit dahinter: [ein Satz, den der Zuschauer selbst nicht laut sagen darf]
Schickt man an: [konkreter Empfänger] mit „[der Satz, den man dazu tippt]“ · Motiv: [Stellvertreter / Markieren / Gruppe / Klug wirken]
Beleg: [Fakt mit Link] / [Satire, erkennbar übertrieben]
Risiko: [1–5, ein Halbsatz, warum]
```

Der Kern besteht aus 3 bis 6 kurzen Sätzen. Wenn ein Begriff vorkommt, steht er genau an der Stelle, an der er im Video fällt ("Das nennt sich X. Heißt: …"), nie im Hook.

## Kalibrierung: So soll es aussehen

**1. Wir sind jetzt KI-first**
Format: Anapher-Sketch · Ring: Arbeit · Länge: ~30 s

Hook (0–3 s): „Wir sind jetzt ein KI-first-Unternehmen. Heißt: Wir machen alles wie vorher. Nur teurer.“
Kern:
– „Wir sind KI-first. Deshalb schreibt die KI unsere Mails. Und die KI liest sie auch. Danach treffen wir uns im Meeting und fragen, was drinstand.“
– „Wir sind KI-first. Deshalb haben wir 400 Lizenzen gekauft. Benutzt werden elf. Zehn davon vom Praktikanten.“
– „Wir sind KI-first. Deshalb heißt unser Chatbot Kai. Kai darf nichts. Kai hat Angst vorm Datenschutz.“
– „Wir sind KI-first. Deshalb hat der Betriebsrat jetzt auch eine KI. Die verhandelt mit unserer.“
Pointe: „Schreibt mir, was eure Firma mit KI macht. Oder lasst es eure KI schreiben.“

Schickt man an: den Kollegen aus der IT mit „Das sind wir.“
Beleg: Satire, Zahlen erkennbar übertrieben.
Risiko: 1, trifft Firmen-Theater, niemanden persönlich.

**2. Gesparte Zeit ist weg**
Format: Begriff-Reel · Ring: Arbeit · Länge: ~40 s

Hook (0–3 s): „KI spart dir jeden Tag eine Stunde. Trotzdem hast du weniger Zeit als vorher.“
Kern:
– „Das nennt sich Jevons-Paradox. Heißt: Wenn etwas billiger wird, wird viel mehr davon verbraucht.“
– „Eine Mail kostet jetzt keine Mühe mehr. Also schreibt jeder mehr Mails. Und längere.“
– „Dein Kollege lässt seine Mail von ChatGPT aufblasen. Du lässt sie von ChatGPT zusammenfassen.“
– „Zwei KIs schreiben sich gegenseitig. Und ihr zwei sitzt daneben und kriegt Gehalt.“
Pointe: „Ich nenne das nicht Zeitverschwendung. Ich nenne das Vollbeschäftigung.“

Schickt man an: den Kollegen mit den Romanen im Postfach mit „Du bist gemeint.“
Beleg: Das Jevons-Paradox ist gut belegt (Kohleverbrauch stieg, als Dampfmaschinen sparsamer wurden). Die Mail-Szene ist Beobachtung, keine Studie.
Risiko: 1.

**3. Mama ist höflich zu ChatGPT**
Format: Einzeiler · Ring: Leben · Länge: ~15 s

Hook (0–3 s): „Meine Mutter benutzt jetzt ChatGPT. Sie unterschreibt jede Nachricht mit ‚Liebe Grüße, Mama‘.“
Kern:
– „Dazu ‚Bitte‘. Und ‚Danke‘. Und ‚Entschuldige die Störung‘.“
– „Jedes Wort kostet OpenAI Strom. Der Chef sagt, Höflichkeit kostet die zig Millionen.“
Pointe: „Meine Mutter macht OpenAI gerade kaputt. Mit Anstand.“

Schickt man an: die eigene Mutter oder die Geschwister-Gruppe mit „Mama 😂“
Beleg: Sam Altman auf X, April 2025: "tens of millions of dollars well spent" auf die Frage nach Bitte/Danke (zu prüfen, Link vor Dreh raussuchen).
Risiko: 1.

**So nicht (verworfene erste Runde):**
- „Human in the loop ist Unternehmenssprache für: jemand, den man feuern kann.“ Englischer Fachbegriff im ersten Satz, Doppelpunkt-Konstruktion, "Unternehmenssprache" ist ein Meeting-Wort.
- „Cargo-Kult: 400 Copilot-Lizenzen, niemand nutzt sie.“ Das Bild muss erst erklärt werden, und den Produktnamen kennt nicht jeder.
- „Principal-Agent: warum die IT-Leitung bremst.“ Ein Begriff aus dem Hörsaal, und es gibt kein Bild.

Die umgeschriebenen Versionen stehen in `sprache.md`.

## Ehrlichkeit

- **Sketch und Übertreibung:** Offensichtlich absurde Zahlen sind erlaubt ("400 Lizenzen, benutzt von elf"), weil jeder sieht, dass es Satire ist.
- **Behauptung als Fakt** (News, Studie, "Das nennt sich …"): Sie muss stimmen und braucht einen Beleg. Ein falsch erklärter Begriff zerstört genau die Glaubwürdigkeit, von der die Figur lebt.
- **Pseudo-Präzision** (Hannas "entgangene Drinksubventionen 432 €") ist erlaubt, wenn die Rechnung offen auf dem Tisch liegt und die Annahmen erkennbar sind.
- **Keine erfundenen Kundenerlebnisse.** Szenen sind entweder erkennbar Satire oder belegt. Nie so tun, als hätte Niklas etwas bei einem echten Kunden erlebt.

> **Satire auf @florent_preusser: 15–20 s (Henri 2026-10-12):** Satire-Reels (FP-S) so kosteneffizient wie möglich: Ziel 15–20 s Video, d. h. Sprechtext ca. 40–55 Wörter, eine Pointe, maximal 3 Beats. Spart HeyGen-Credits (~13–17 pro Reel).
> **Korrektur (Henri 2026-10-15):** Normale FP-Videos (FP-N) laufen auf @florent_preusser weiterhin, die frühere Aussage „nur noch Satire“ gilt nicht. FP-N bleibt bei den normalen Regeln (110–140 Wörter, 30–35 s, Guide + Trigger-Wort).
