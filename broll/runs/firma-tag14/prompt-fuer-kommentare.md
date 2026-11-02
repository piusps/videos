# Folge „Empfängerliste“: Frage + Tabellenvorlage (Lieferung für Kommentare „Adresse“)

## Was der Guide liefern muss
Gesprochen verspricht das Skript: „ich schick dir Frage und Tabellenvorlage. Damit hast du in zehn Minuten deine Empfängerliste.“ Die Caption nennt zusätzlich die Status-Regeln und die Quellen-Reihenfolge. Genau das, nicht mehr:
1. **Die Frage zum Kopieren**, zwei Varianten: A mit Anhang (Brief + eigene Firmenliste), B ohne Anhang (Firmennamen direkt in die Frage).
2. **Die Tabellenvorlage** = Aufbau von Claudes Excel-Datei aus dem Lauf, ohne die echten Zeilen: Blatt „Empfaenger“ mit den Spalten Nr, Firmenname, Zusatz, Strasse, PLZ, Ort, Adressstatus, Quelle_im_Brief, Pruefhinweis (PLZ als Text, damit die führende 0 bleibt); Blatt „Belege“ mit Betrieb, Quelle, Art der Quelle, Gefundene Anschrift, Stimmt mit Brief-Adresse überein?, Hinweis, URL; Blatt „Legende und Offen“ mit den Status 1:1 aus der Datei:
   - Belegt: Eigenes Impressum und mindestens eine unabhängige Quelle nennen dieselbe Anschrift.
   - Belegt, prüfen: Im Impressum belegt, aber eine Nebenquelle weicht ab, es gibt mehrere Anschriften oder nur eine Quelle.
   - Widerspruch: Impressum und Handelsregister (bzw. Verzeichnisse) nennen verschiedene Anschriften.
   - Nicht belegt: Keine Anschrift gefunden.
   Beispielzeilen nur ausgedacht und als Beispiel markiert („Musterbetrieb GmbH, Musterstraße 1, 12345 Musterstadt“), nie echte Daten aus dem Lauf.
3. **Claudes Quellen-Reihenfolge mit Gründen** (1:1, Namen gestrichen): Impressum zuerst („Das Impressum ist Pflicht. Der Betrieb muss dort eine Anschrift angeben, unter der er erreichbar ist.“ / „Der Betrieb pflegt die Angabe selbst. Branchenverzeichnisse übernehmen dagegen oft alte Daten.“), Handelsregister „bei Firmen wie GmbH oder KG … die amtlichere Quelle“, Einzelunternehmen stehen dort meist nicht (laut Lauf „vermutlich“). Hinweis: „Claude hat das amtliche Handelsregister im Lauf nicht selbst abgefragt.“
4. **Was Claude nicht prüfen konnte** (verallgemeinert, ohne Namen): Aktualität, amtliches Register, ob zwei Firmennamen derselbe Betrieb sind, Geschäftsraum oder Wohnung, welche von zwei Adressen für Post, Zustellbarkeit.
5. **Datenschutz-Hinweis aus dem Lauf:** Claude hat eine zweite Adresse einer Person aus einem Impressum bewusst nicht übernommen („weil es eine private Adresse sein könnte“). In die Frage gehört deshalb „keine privaten Daten“. Bei Einzelunternehmen steckt ein Personenname im Firmennamen; auf Folge „Werbebrief“ (Widerspruchshinweis im Brief) verweisen. Keine Rechtsberatung.

Nicht versprechen: fertige, geprüfte Adressen, Rechtssicherheit, Versand. Nichts versenden, nicht erzählen, dass Briefe raus sind.

## 1:1 außer … (K.-o. für die Guide-Stufe)
| Stelle | Behandlung |
|---|---|
| Alle Betriebsnamen, Inhabernamen, Straßen, PLZ, Orte aus Antwort, Excel, Sources (siehe design/lauf/LAUF.md, liste-text.txt) | Nie in den Guide. Gründe/Nicht-prüfen-Sätze mit „[ein Betrieb]“/„bei zwei Betrieben“ statt Namen. |
| Ort außerhalb der Testregion (Sitz eines Betriebs, steht in LAUF.md/liste-text.txt) | nicht nennen; nur „Chemnitz“ (Testregion) erlaubt. |
| Anhang „Shirt-Firma Ergebnis Betriebe.md“ (Namen + Stadtname aus Lauf 11) | nicht in den Guide, nicht als Bild. |
| Sources-Liste (10 Links, alle mit Betriebsnamen/Domains) | nicht verlinken. Nur Quellenarten nennen: eigenes Impressum, Innungsliste, Creditreform, Branchenverzeichnisse, Handelsregister-Abschrift (Drittanbieter). |
| Screenshots | nur 01, 06, 07 und *-anonym.png. |
| Englischer Zwischensatz im Lauf | nicht zitieren. |
**Abnahme über den fertigen Guide-Text:** Abgleich gegen die Namens-/Adressliste in `design/lauf/liste-text.txt` (Spalten Firmenname, Zusatz, Strasse, PLZ, Ort) = 0 Treffer; Stadtname aus Lauf 11 = 0 (Name absichtlich nicht hier); `grep -ic boilr` = 0; `grep -c "\[BERUF\]"` = 0; Bilder visuell ohne Namen/Adressen.

## Weg
claude.ai → neuer Chat → „+“ → Gedächtnis für diesen Chat aus (Tipp aus dem Lauf) → Brief (Word) und eigene Firmenliste anhängen → Frage einfügen → senden. Websuche ohne eigenen Schalter (Lauf 31.10.2026: 15 Suchen), Research nicht nötig. Die Excel-Datei erscheint als Karte „Tabellenkalkulation · XLSX“.
Nötige Einstellungen (mit Quelle, geprüft in Folge 13 am 30.10.2026): Websuche (support.claude.com/en/articles/10684626-enable-and-use-web-search; Team/Enterprise: Owner gibt frei); Dateien erstellen „Create and edit files“ / „Code execution and file creation“ (support.claude.com/en/articles/12111783-create-and-edit-files-with-claude); Anhänge (support.claude.com/en/articles/8241126-upload-files-to-claude; .md im Lauf angenommen, offiziell nicht gelistet → Liste notfalls als .txt/.docx/.csv).
Zeit: Lauf ca. 2 min 40 s; mit Anhängen und Lesen der Status-Spalte ≈ 10 Minuten. Prüfen der gelben/roten Zeilen ist ein eigener Schritt.

## Variante A: mit Anhang (Brief + eigene Liste)
> Im Anhang ist mein Werbebrief als Word-Datei und meine Liste mit [ANZAHL] Firmen, die ich zuerst anschreibe. Im Brief fehlen noch die Empfänger. Hol mit der Websuche die Postadressen dieser Firmen, aus dem Impressum oder anderen öffentlichen Quellen, jeweils mit Quelle. Bau daraus eine Empfängerliste für den Serienbrief als Excel-Datei. Markiere, welche Adresse belegt ist, welche nicht und wo sich Quellen widersprechen. Nimm nur Firmenangaben, keine privaten Daten und keine Ansprechpartner, die nicht im Impressum stehen. Sag mir, welche Quelle für Firmenadressen am verlässlichsten ist, mit zwei bis drei Gründen. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts.

## Variante B: ohne Anhang
> Ich will diese Firmen per Brief anschreiben: [FIRMENNAME 1, ORT], [FIRMENNAME 2, ORT], [FIRMENNAME 3, ORT]. Hol mit der Websuche ihre Postadressen, aus dem Impressum oder anderen öffentlichen Quellen, jeweils mit Quelle. Bau daraus eine Empfängerliste für einen Serienbrief als Excel-Datei mit den Spalten Firmenname, Zusatz, Strasse, PLZ, Ort, Adressstatus, Quelle. Markiere, welche Adresse belegt ist, welche nicht und wo sich Quellen widersprechen. Nimm nur Firmenangaben, keine privaten Daten. Sag mir, welche Quelle am verlässlichsten ist, mit zwei bis drei Gründen, und was du nicht prüfen kannst. Erfinde nichts.
(Variante B ist nicht gelaufen; im Guide: „ungetestete Abwandlung des echten Prompts“.)

## Beispiele nach Beruf (für die Firmenliste, keine Lauf-Daten)
- **Gebäudereiniger:** Arztpraxen und Kanzleien im Erdgeschoss der eigenen Stadt.
- **Fotografin:** Firmen mit 5–20 Leuten, die gerade Stellen ausschreiben.
- **Kaffeerösterin:** Büros und Coworking-Spaces im Umkreis.
- **IT-Techniker:** kleine Handwerksbetriebe ohne eigene IT.

## Echter Lauf (31.10.2026, Chat 5ffe5c38…, ca. 2 min 40 s, Opus 5.5 Mittel, Gedächtnis aus, kein Research, 15 Websuchen, 4 Seiten gelesen)
- Ergebnis: „Für alle fünf Betriebe habe ich eine Adresse aus dem Impressum gefunden. Eindeutig belegt ist allerdings nur eine. Bei drei Betrieben solltest du noch etwas prüfen, bei einem widersprechen sich die Quellen.“
- Entscheidung: „Die verlässlichste Quelle ist für deine fünf Betriebe das Impressum auf der eigenen Website.“
- Datei: Kolonnenshirt_Empfaenger_Serienbrief.xlsx, 3 Blätter (Empfaenger, Belege, Legende und Offen).
- Claudes nächster Schritt: Handelsregister beim Widerspruch nachsehen; bei zwei Betrieben ginge ein kurzer Anruf (macht nur ein Mensch).
