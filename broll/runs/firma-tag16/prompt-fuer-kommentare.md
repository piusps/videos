# Folge „Wie kommen die Adressen in den Brief?“: Serienbrief-Anleitung (Lieferung für Kommentare „Serienbrief“)

## Was der Guide liefern muss
Gesprochen verspricht das Skript: „ich schick dir die Anleitung. Damit hast du in zehn Minuten eigene Serienbriefe.“ Genau das, nicht mehr:
1. **Der Serienbrief-Prompt zum Kopieren**, zwei Varianten: A mit zwei Anhängen (eigener Brief als Word-Datei mit Platzhaltern + Empfängerliste als Excel), B mit einem Anhang (nur Liste, Brieftext in die Frage).
2. **Der Weg in claude.ai** (siehe unten), mit dem Tipp „Gedächtnis für diesen Chat aus“.
3. **Die Regel aus dem Lauf:** Claude füllt nur Felder, die in der Liste stehen (im Lauf: Firmenname, Straße, PLZ und Ort, Quelle der Anschrift). Alles andere bleibt gelb markiert. Claude wörtlich: „Das Prüfdatum 31.10.2026 habe ich bewusst nicht als Briefdatum genommen.“
4. **Den Rest selbst füllen:** Claudes Tipp wörtlich: „In Word kannst du sie am schnellsten mit Suchen und Ersetzen in allen fünf Briefen auf einmal füllen.“ Dazu eine kurze Liste typischer offener Felder: Absender, Telefon, E-Mail, Ort und Datum, Versandkosten/Lieferzeit, Link zur Datenschutzerklärung.
5. **Tipp Empfängerliste:** eine Spalte „Versand“ (Ja / Ja mit Vorbehalt / Nein) in der Liste; im Prompt „Nimm nur die Firmen, die laut Liste rausgehen können“. Im Lauf nahm Claude auch den Brief mit Vorbehalt auf und sagte, welche Seite man herausnehmen kann.
6. **Was Claude nicht prüft (laut Lauf, verallgemeinert):** ob die Briefe ankommen, ob der Brieftext (Preise, Widerspruchs- und Datenschutzhinweise) rechtlich reicht, ob eine Firma Werbung schon abgelehnt hat oder auf einer Sperrliste steht, ob eine Anschrift Geschäft oder Wohnung ist. Keine Rechtsberatung.

Nicht versprechen: versandfertige Briefe, Versand, Porto, rechtlich geprüfte Briefe, Adressrecherche (das war Folge 15). Nichts versenden.

## 1:1 außer … (K.-o. für die Guide-Stufe)
| Stelle | Behandlung |
|---|---|
| Betriebsnamen, Inhabernamen, Straßen, PLZ, Orte, Websites der Betriebe (Antwort, Datei, siehe design/lauf/LAUF.md und briefe-text.txt) | Nie in den Guide. Mit „[Firma]“ / „bei einem Betrieb“ ersetzen. |
| Ort außerhalb der Testregion (Sitz eines Betriebs, steht in briefe-text.txt) | nicht nennen; nur „Chemnitz“ erlaubt. |
| Name des Datendienstes aus Lauf 15 | nicht nötig, weglassen. |
| Screenshots | nur 01, 03, 04, 06, 07 und *-anonym.png. |
| Briefansicht | nur mit geschwärztem Empfängerblock und geschwärzter Website im Datenschutzsatz. |
**Abnahme über den fertigen Guide-Text:** Abgleich gegen Firmenname/Strasse/PLZ/Ort aus `design/lauf/briefe-text.txt` = 0 Treffer; Stadtname aus Lauf 11 = 0 (Name absichtlich nicht hier); `grep -ic boilr` = 0; `grep -c "\[BERUF\]"` = 0; Bilder visuell ohne Namen/Adressen.

## Weg
claude.ai → neuer Chat → „+“ → Gedächtnis für diesen Chat aus → „Dateien hochladen oder hinzufügen“: Brief (Word) + Liste (Excel) → Prompt einfügen → senden. Keine Websuche nötig (Lauf: 0 Suchen), Research aus. Die fertige Datei erscheint als Karte „Dokument · DOCX“.
Nötige Einstellungen (geprüft in Folge 13 am 30.10.2026): Dateien erstellen (support.claude.com/en/articles/12111783-create-and-edit-files-with-claude); Anhänge (support.claude.com/en/articles/8241126-upload-files-to-claude).
Zeit: Lauf ca. 1 min; mit Anhängen, Lesen und Suchen-und-Ersetzen ≈ 10 Minuten.

## Variante A: zwei Anhänge – echter Lauf-Prompt, verallgemeinert
> Im Anhang sind mein Werbebrief als Word-Datei mit Platzhaltern und meine Empfängerliste als Excel-Datei. Mach daraus fertige Serienbriefe, einen pro Firma. Nimm nur die Firmen, die laut Liste rausgehen können. Füll nur die Platzhalter, für die es in Brief oder Liste einen Beleg gibt. Sag mir, welche Platzhalter offen bleiben, zum Beispiel Absender oder Versandkosten. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts. Gib mir die Briefe als Word-Datei zurück.

## Variante B: nur Liste anhängen, Brief in die Frage
> Im Anhang ist meine Empfängerliste als Excel-Datei. Hier ist mein Brief, Platzhalter in eckigen Klammern: [BRIEFTEXT EINFÜGEN]. Mach daraus Serienbriefe als Word-Datei, einen pro Firma und eine Seite pro Brief. Füll nur Platzhalter, die in der Liste stehen, und markier die übrigen gelb. Sag mir, welche offen bleiben und was du nicht prüfen kannst. Erfinde nichts.
(Variante B ist nicht gelaufen; im Guide: „ungetestete Abwandlung des echten Prompts“.)

## Beispiele nach Beruf (wofür der Serienbrief passt, keine Lauf-Daten)
- **Gebäudereiniger:** Angebotsbrief an zwanzig Arztpraxen, je Praxis Name und Anschrift.
- **Fotografin:** Brief an Kitas für den Fototag, Ansprechpartner aus der Liste.
- **Kaffeerösterin:** Probenbrief an Büros, Lieferadresse je Büro.
- **IT-Techniker:** Wartungsangebot an Steuerkanzleien, Kanzleiname und Ort aus der Liste.

## Echter Lauf (31.10.2026, Chat 2cd3876f…, ca. 1 min, Opus 5.5 Mittel, Gedächtnis aus, kein Research, 0 Websuchen)
- Ergebnis: „In der Datei Kolonnenshirt_Serienbriefe.docx stehen fünf fertige Briefe, einer pro Seite. Layout, Logo und Formatierung sind aus deinem Brief übernommen.“
- Gefüllt: Firmenname, Straße, PLZ und Ort, Quelle im Datenschutzsatz. Offen (gelb): Absender, Ort/Datum, Versandkosten und Lieferzeit, Telefon/E-Mail, Gruß, Datenschutz-Link.
- Grenze: Zustellbarkeit, rechtliche Prüfung des Brieftexts, Sperrlisten nicht geprüft.
