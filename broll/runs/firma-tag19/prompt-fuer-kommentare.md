# Folge „Stimmt die Versandzeile?“: Prüf-Prompt (Lieferung für Kommentare „Beleg“)

## Was der Guide liefern muss
Gesprochen verspricht das Skript: „ich schick dir den Prompt. In zehn Minuten prüfst du deine Versandzeile.“ Genau das, nicht mehr:
1. **Der Prüf-Prompt zum Kopieren** (Variante A: mit Anhang Angebot/Brief; Variante B: ohne Anhang), Platzhalter [BERUF], [PRODUKT], [ANBIETER], [PREIS], [MENGE].
2. **Der Weg in claude.ai** (siehe unten), mit Tipp „Gedächtnis für diesen Chat aus“.
3. **Die Regel aus dem Lauf:** In die Versandzeile kommt nur, was eine Quelle des Anbieters belegt. Kein Beleg → Betrag raus („Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“). Fremdwährung nicht mit geschätztem Kurs umrechnen. Lieferzeit nur mit „in der Regel“, kein festes Datum.
4. **Vorher/Nachher aus dem Lauf:** alt „zzgl. 11,20 Euro brutto bei 5 Shirts, zzgl. 5,20 Euro brutto bei einem Einzelshirt. Lieferung in der Regel 4 bis 10 Werktage nach Bestellung.“ → neu (Versandteil) „Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“ Den Lieferzeit-Teil der neuen Zeile hat Claude im Lauf selbst eingesetzt; die Quellen widersprechen sich (2–5 vs. 5–20 Werktage, LAUF.md) – im Guide nicht als Vorbild zeigen und nicht übernehmen, nur als Beispiel „Lieferzeit nie fest zusagen“.
5. **Gegencheck-Liste (3 Punkte):** Zahl im Checkout/Versandrechner des eigenen Anbieter-Kontos ansehen; Steuer-Aufschlag des Anbieters prüfen (im Lauf: ohne geprüfte USt-ID schlägt Printful 19 % auf); widersprüchliche Lieferzeiten (im Lauf 2–5 vs. 5–20 Werktage) nie als Zusage schreiben.
6. **Ehrlicher Hinweis:** Claude ist kein Steuer- oder Rechtsberater; Preisangaben-Pflichten im Zweifel prüfen lassen.

Nicht versprechen: korrekte Versandpreise eines Anbieters, Rechtssicherheit, Steuerrat, „fertiges Angebot“. Nichts bestellen, nicht bezahlen.

## 1:1 außer … (K.-o. für die Guide-Stufe)
| Stelle | Behandlung |
|---|---|
| Betriebsnamen, Inhabernamen, Straßen, PLZ, Orte, Websites der Betriebe (in der angehängten Briefdatei, siehe runs/firma-tag19/design/lauf/briefe-text.txt) | Nie in den Guide. Der Chat von Lauf 19 enthält keine. Briefansicht nur mit geschwärztem Empfängerblock/Website. |
| Ort außerhalb der Testregion | nicht nennen; nur „Chemnitz“ erlaubt. |
| „nur Dollarbeträge“ | nur als „im Lauf zeigte die Versandseite Claude Dollar“; nicht „Printful hat keine Euro-Preise“ (LAUF.md Gegenprüfung). |
| 4,49 € (Testbericht) | nur mit „laut Testbericht, keine Anbieterquelle“. |
| Lieferzeiten 2–5 / 5–20 Werktage | nur als Beispiel für widersprüchliche Quellen, nie als Zusage. |
| Claudes Satz „In der neuen Zeile steht zwar, dass der Versand extra kostet“ | nicht zitieren (Zeile sagt wörtlich „nenne ich Ihnen vor Ihrer Bestellung“). |
| Screenshots | 01–03, 05–10 frei; 04 nur klein. |
**Abnahme über den fertigen Guide-Text:** Abgleich gegen Firmenname/Straße/PLZ/Ort aus der Briefdatei = 0 Treffer; Stadtname aus Lauf 11 = 0 (Name absichtlich nicht hier); `grep -ic boilr` = 0; `grep -c "\[BERUF\]"` = 0 im fertigen Guide.

## Weg
claude.ai → neuer Chat → „+“ → Gedächtnis für diesen Chat aus → „Dateien hochladen oder hinzufügen“: eigenes Angebot/Brief (Word) → Prompt einfügen → senden. Websuche muss an sein (im Lauf Konto-Standard an), Research aus. Claude gibt die korrigierte Word-Datei als Karte zurück.
Nötige Funktionen (geprüft in Folge 13 am 30.10.2026): Anhänge (support.claude.com/en/articles/8241126-upload-files-to-claude).
Zeit: Lauf 1 min 48 s; mit Anhängen, Lesen und Gegencheck im eigenen Konto ≈ 10 Minuten.

## Variante A: mit Anhang – echter Lauf-Prompt, verallgemeinert
> Im Anhang ist mein Angebot mit der Versandzeile. Mein Angebot: [PREIS] brutto für [MENGE] [PRODUKT], [PREIS] für ein einzelnes Stück, hergestellt auf Bestellung über [ANBIETER], Kunden in Deutschland. Prüf die Versandzeile mit der Websuche gegen die aktuellen Versandpreise und Lieferzeiten von [ANBIETER] nach Deutschland, in Euro, jeweils mit Quelle. Korrigier die Zeile so, dass nur Belegtes drinsteht, und trag sie überall im Dokument ein. Sag mir, ob mein Paketpreis so bleiben kann, oder was du ohne meinen Einkaufspreis nicht entscheiden kannst. Erfinde nichts. Gib mir die korrigierte Word-Datei zurück.

## Variante B: ohne Anhang
> Ich bin [BERUF] und verkaufe [PRODUKT], hergestellt über [ANBIETER], an Kunden in Deutschland. In meinem Angebot steht diese Versandzeile: „[ZEILE]“. Prüf sie mit der Websuche gegen die aktuellen Versandpreise und Lieferzeiten von [ANBIETER] nach Deutschland, in Euro, mit Quelle. Schreib mir eine korrigierte Zeile, in der nur Belegtes steht, und sag mir, was du nicht prüfen kannst. Erfinde nichts.
(Variante B ist nicht gelaufen; im Guide: „ungetestete Abwandlung des echten Prompts“.)

## Beispiele nach Beruf (wofür die Prüfung passt, keine Lauf-Daten)
- **Kaffeerösterin:** „Versand 4,90 €, Lieferung in 2 Tagen“ im Abo-Angebot gegen den Paketdienst prüfen.
- **Grafikerin mit Print-on-Demand-Postern:** Versand- und Lieferzeile im Shop gegen die Anbieterseite prüfen.
- **Schreiner mit Schneidebrettern:** Speditions-/Paketpreis im Angebot gegen die Preisliste prüfen.
- **Fotograf mit Fotobüchern:** Lieferzeit-Zusage im Angebot gegen die Druckerei prüfen.

## Echter Lauf (31.10.2026, Chat 0c969b98…, 1 min 48 s, Opus 5.5 Mittel, Gedächtnis aus, kein Research, 6 Websuchen + 2 Seitenabrufe)
- Ergebnis: „Für die 11,20 € und 5,20 € habe ich keinen Beleg gefunden. … Deshalb steht in der Zeile jetzt kein Betrag mehr.“
- Entscheidung: Beträge gestrichen, Lieferzeit nur „in der Regel“; 109 € für fünf ohne Einkaufspreis nicht entscheidbar; für die Marge fehlen Einkaufspreis und Umsatzsteuerstatus.
