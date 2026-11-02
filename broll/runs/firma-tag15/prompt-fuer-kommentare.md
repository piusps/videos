# Folge „Welche Adresse stimmt?“: Prüffrage + Versand-Regeln (Lieferung für Kommentare „Versand“)

## Was der Guide liefern muss
Gesprochen verspricht das Skript: „ich schick dir die Prüffrage. Damit hast du in zehn Minuten sichere Adressen.“ Die Caption nennt zusätzlich die Versand-Spalte und den Weg zum amtlichen Abdruck. Genau das, nicht mehr:
1. **Die Prüffrage zum Kopieren**, zwei Varianten: A mit Anhang (eigene Empfängerliste als Excel), B ohne Anhang (Firmen + gefundene Adressen direkt in die Frage).
2. **Die Versand-Regeln** 1:1 aus Claudes Datei (Blatt „Legende und Offen“, Namen gestrichen):
   - Versand = Ja: „Anschrift durch Impressum und mindestens eine unabhängige Quelle belegt (bei [Firmen im Register] zusätzlich Handelsregister [im Lauf: gelesen bei North Data, nicht im amtlichen Register]). Brief kann raus.“
   - Versand = Ja mit Vorbehalt: „Anschrift belegt, ein Detail (hier: PLZ) nicht amtlich bestätigt. Vor Druck 1 Minute in der PLZ-Suche der Deutschen Post prüfen.“
   - Versand = Nein: kein Fall im Lauf (Regel trotzdem anlegen: Anschrift nicht belegt oder Widerspruch offen).
   Dazu die drei neuen Spalten aus dem Lauf: Versand, Quelle_Adresse, Geprueft_am.
3. **Die Widerspruchs-Regel aus dem Lauf** (verallgemeinert): Bei Impressum gegen Register-Abschrift zuerst schauen, von wann die Abschrift ist. Im Lauf zeigte die Abschrift nur die Anschrift der Ersteintragung; ein späterer Registereintrag nannte die Impressum-Adresse. Also: den **neuesten** Registereintrag suchen, nicht irgendeine Abschrift.
4. **Grenze ehrlich:** Claude konnte das amtliche Handelsregister nicht selbst bedienen (Suche = Formular) und las den Eintrag bei einem Datendienst (Drittanbieter). Wer es amtlich will, macht den Schritt selbst. Claudes Weg aus der Datei: „handelsregister.de > Normale Suche > Registerart, Nummer, Gericht > „AD“ (aktueller Abdruck, kostenlos)“. **Vor Aufnahme in den Guide von der Guide-Stufe gegenprüfen** (Lauf hat es nicht ausprobiert; „kostenlos“ ist Claudes Angabe. Gebührenfreiheit nur nennen, wenn die Guide-Stufe sie auf handelsregister.de findet und die URL verlinkt, sonst streichen.).
5. **Was Claude nicht prüfen konnte** (verallgemeinert, ohne Namen): amtliches Register selbst, Postleitzahl einer Hausnummer, ob eine Anschrift Geschäftsraum oder Wohnung ist, Zustellbarkeit, an welche von zwei Anschriften ein Betrieb lieber Post bekommt.
6. **Datenschutz-Hinweis:** nur Firmenangaben, keine privaten Daten (steht in der Frage). Bei Einzelunternehmen steckt der Inhabername im Firmennamen. Keine Rechtsberatung.

Nicht versprechen: amtlich geprüfte Adressen, Zustellung, Versand, fertige Serienbriefe. Nichts versenden, nicht erzählen, dass Briefe raus sind.

## 1:1 außer … (K.-o. für die Guide-Stufe)
| Stelle | Behandlung |
|---|---|
| Alle Betriebsnamen, Inhabernamen, Straßen, PLZ, Orte, Registernummer aus Antwort, Excel, Sources (siehe design/lauf/LAUF.md, liste-text.txt) | Nie in den Guide. Mit „[ein Betrieb]“ / „bei einem Betrieb“ ersetzen. |
| Ort außerhalb der Testregion (Sitz eines Betriebs, steht in LAUF.md/liste-text.txt) | nicht nennen; nur „Chemnitz“ (Testregion) erlaubt. |
| Name des Datendienstes | als „Datendienst (Drittanbieter)“; der Anbietername darf genannt werden, aber nie mit Firmen-Link. |
| Sources-Liste (9 Links, fast alle mit Betriebsnamen/Domains) | nicht verlinken. Nur Quellenarten nennen: eigenes Impressum, Registereintrag (über Datendienst), Telefon- und Branchenverzeichnisse, PLZ-Verzeichnisse. |
| Screenshots | nur 01, 06, 07 und *-anonym.png. |
| Daten aus Registereintrag (Datum der Eintragung, Jahresabschluss) | nur als „späterer Eintrag“ / Jahreszahlen ohne Firmenbezug. |
**Abnahme über den fertigen Guide-Text:** Abgleich gegen die Namens-/Adressliste in `design/lauf/liste-text.txt` (Spalten Firmenname, Zusatz, Strasse, PLZ, Ort) = 0 Treffer; Registernummer aus LAUF/liste-text = 0; Stadtname aus Lauf 11 = 0 (Name absichtlich nicht hier); `grep -ic boilr` = 0; `grep -c "\[BERUF\]"` = 0; Bilder visuell ohne Namen/Adressen.

## Weg
claude.ai → neuer Chat → „+“ → Gedächtnis für diesen Chat aus (Tipp aus dem Lauf) → eigene Empfängerliste (Excel) anhängen → Prüffrage einfügen → senden. Websuche ohne eigenen Schalter (Lauf 31.10.2026: 18 Suchen), Research nicht nötig. Die aktualisierte Excel-Datei erscheint als Karte „Tabellenkalkulation · XLSX“.
Nötige Einstellungen (Quelle, geprüft in Folge 13 am 30.10.2026): Websuche (support.claude.com/en/articles/10684626-enable-and-use-web-search; Team/Enterprise: Owner gibt frei); Dateien erstellen (support.claude.com/en/articles/12111783-create-and-edit-files-with-claude); Anhänge (support.claude.com/en/articles/8241126-upload-files-to-claude).
Zeit: Lauf ca. 3 min; mit Anhängen und Lesen der Versand-Spalte ≈ 10 Minuten. Die Postleitzahl-Prüfung bei der Post und der amtliche Abdruck sind eigene Schritte (Mensch).

## Variante A: mit Anhang (eigene Empfängerliste) – echter Lauf-Prompt, verallgemeinert
> Im Anhang ist meine Empfängerliste für einen Werbebrief als Excel-Datei. Bei einigen Firmen ist die Adresse unsicher oder Quellen widersprechen sich. Klär mit der Websuche über öffentliche, möglichst amtliche Quellen, welche Adresse je Firma stimmt. Zum Beispiel Handelsregister oder Unternehmensregister, sofern ohne Login einsehbar. Markiere, welche Briefe sicher rausgehen können und welche nicht. Nenn je Adresse die Quelle. Nimm nur Firmenangaben, keine privaten Daten. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts. Gib mir die aktualisierte Excel-Datei zurück.

## Variante B: ohne Anhang
> Ich will diese Firmen per Brief anschreiben. Zu jeder habe ich eine Adresse, bin aber unsicher: [FIRMENNAME 1, ADRESSE, WOHER], [FIRMENNAME 2, ADRESSE, WOHER]. Klär mit der Websuche über öffentliche, möglichst amtliche Quellen, welche Adresse je Firma stimmt. Wenn sich Quellen widersprechen, such den neuesten Eintrag. Bau mir eine Excel-Tabelle mit den Spalten Firmenname, Strasse, PLZ, Ort, Versand (Ja / Ja mit Vorbehalt / Nein), Quelle_Adresse, Geprueft_am. Nimm nur Firmenangaben, keine privaten Daten. Sag mir, was du nicht prüfen kannst. Erfinde nichts.
(Variante B ist nicht gelaufen; im Guide: „ungetestete Abwandlung des echten Prompts“.)

## Beispiele nach Beruf (wofür die Prüffrage passt, keine Lauf-Daten)
- **Gebäudereiniger:** Praxen, deren Adresse auf der Website anders steht als im Branchenbuch.
- **Fotografin:** Firmen, die gerade umgezogen sind (Stellenanzeige nennt neuen Ort).
- **Kaffeerösterin:** Büros mit zwei Standorten – welcher bekommt die Probe?
- **IT-Techniker:** GmbHs, bei denen Impressum und Registerauszug verschiedene Straßen nennen.

## Echter Lauf (31.10.2026, Chat 5bd7f186…, ca. 3 min, Opus 5.5 Mittel, Gedächtnis aus, kein Research, 18 Websuchen, 3 Seiten gelesen)
- Ergebnis: „Vier Briefe können ohne Einschränkung raus. Einer kann raus, wenn du vorher kurz die PLZ prüfst. Den Widerspruch bei [ein Betrieb] konnte ich klären.“
- Entscheidung: Brief an die Impressum-Adresse; Abschrift = Ersteintragung, späterer Eintrag nennt die Impressum-Adresse („Das Impressum … stimmt also noch.“).
- Datei: Kolonnenshirt_Empfaenger_Serienbrief.xlsx, Spalten Versand, Quelle_Adresse, Geprueft_am neu; Blätter Empfaenger, Belege, Legende und Offen.
- Grenze: „Deren Suche läuft über ein Formular, das ich nicht bedienen kann.“
