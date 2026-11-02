# Folge „Was kostet der Versand der Shirts?“: Versand-Anleitung (Lieferung für Kommentare „Versand“)

## Was der Guide liefern muss
Gesprochen verspricht das Skript: „ich schick dir die Anleitung. Damit rechnest du in zehn Minuten deinen Preis durch.“ Genau das, nicht mehr:
1. **Der Versand-Prompt zum Kopieren** (Variante A: mit Anhang Brief/Angebot; Variante B: ohne Anhang, Angebot in die Frage), Platzhalter [BERUF], [ANBIETER], [PREIS].
2. **Der Weg in claude.ai** (siehe unten), mit dem Tipp „Gedächtnis für diesen Chat aus“.
3. **Der Rechenweg aus dem Lauf, verallgemeinert:** Versand bei vielen Anbietern = Preis fürs erste Teil + Aufschlag je weiteres Teil; Steuer prüfen (mit/ohne USt); Schwelle „höchstens so viel darf ein Teil im Einkauf kosten, damit nach Versand nichts draufgeht“ = (Verkaufspreis netto bzw. brutto bei Kleinunternehmer − Versand) ÷ Stückzahl. Beispiel aus dem Lauf: 5er-Paket max. 16,44 € (netto) bzw. 19,57 € (Kleinunternehmer) pro Shirt, Einzelshirt 20,79 € / 24,73 €.
4. **Die Entscheidung aus dem Lauf:** Kann Claude nicht belegen, dass der Versand im Preis steckt, schreibt es ihn als „zzgl.“ in den Brief. Claude wörtlich: „Weil ich nicht belegen kann, dass der Versand in deinen Preisen drin ist, steht er im Brief separat.“
5. **Was Claude nicht prüfen kann (laut Lauf, verallgemeinert):** eigenen Einkaufspreis, Abrechnungswährung und Kurs, ob der öffentliche Tarif fürs eigene Konto gilt (verbindlich nur im Checkout/Versandrechner des Kontos), Steuerstatus, Lieferzeit bei Sonderfertigung, rechtliche Preisangaben. Keine Rechtsberatung.
6. **Ehrlicher Hinweis:** Versandseiten zeigen je nach Land/Währung andere Zahlen (im Lauf sah Claude Dollar, eine Gegenprüfung Euro). Immer im eigenen Konto gegenchecken.

Nicht versprechen: den richtigen Versandpreis für jeden Anbieter, Gewinn, Lieferzeiten, versandfertige Briefe, Steuer- oder Rechtsberatung. Nichts bestellen, kein Konto anlegen.

## 1:1 außer … (K.-o. für die Guide-Stufe)
| Stelle | Behandlung |
|---|---|
| Betriebsnamen, Inhabernamen, Straßen, PLZ, Orte, Websites der Betriebe (in der Briefdatei, siehe design/lauf/briefe-text.txt) | Nie in den Guide. Briefansicht nur mit geschwärztem Empfängerblock und geschwärzter Website. |
| Ort außerhalb der Testregion | nicht nennen; nur „Chemnitz“ erlaubt. |
| Briefbeträge 11,20 € / 5,20 € | nur als „Claudes aufgerundeter Eintrag im Lauf“, nie als Printful-Preis. |
| Lieferzeit „4 bis 10 Werktage“ | weglassen (nicht sicher belegt, siehe LAUF.md Gegenprüfung). |
| Printful-Tarif 4,99 $ / 1,45 $ | nur mit Zusatz „laut Claude im Lauf; Seite zeigte bei einer Gegenprüfung 4,49 € / 1,25 €; verbindlich ist der Checkout“. |
| Screenshots | 01–08, 10. Nicht 09. |
**Abnahme über den fertigen Guide-Text:** Abgleich gegen Firmenname/Straße/PLZ/Ort aus `design/lauf/briefe-text.txt` = 0 Treffer; Stadtname aus Lauf 11 = 0 (Name absichtlich nicht hier); `grep -ic boilr` = 0; `grep -c "\[BERUF\]"` = 0 im fertigen Guide.

## Weg
claude.ai → neuer Chat → „+“ → Gedächtnis für diesen Chat aus → „Dateien hochladen oder hinzufügen“: eigener Brief/Angebot (Word) → Prompt einfügen → senden. Websuche muss in den Einstellungen an sein (im Lauf Konto-Standard an), Research aus. Die fertige Datei erscheint als Karte „Dokument · DOCX“.
Nötige Funktionen (geprüft in Folge 13 am 30.10.2026): Dateien erstellen (support.claude.com/en/articles/12111783-create-and-edit-files-with-claude); Anhänge (support.claude.com/en/articles/8241126-upload-files-to-claude).
Zeit: Lauf 1 min 39 s; mit Anhängen, Lesen und Einsetzen ≈ 10 Minuten.

## Variante A: mit Anhang – echter Lauf-Prompt, verallgemeinert
> Im Anhang ist mein Angebotsbrief. Mein Angebot: [PREIS] für [MENGE] [PRODUKT], hergestellt/verschickt über [ANBIETER], Kunden in Deutschland. Im Brief ist der Platzhalter „Versandkosten“ noch offen. Finde mit der Websuche heraus, was der Versand bei [ANBIETER] nach Deutschland für [MENGE] und für ein einzelnes Teil kostet, jeweils mit Quelle. Rechne aus, ob der Versand in meinem Preis noch drin ist oder ob ich die Versandkosten im Brief extra nennen muss. Trag das Ergebnis in den Brief ein, wo der Platzhalter steht, und gib ihn mir als Word-Datei zurück. Sag mir, was du nicht prüfen kannst. Erfinde nichts.

## Variante B: ohne Anhang
> Ich bin [BERUF] und verkaufe [PRODUKT] für [PREIS], verschickt über [ANBIETER] nach Deutschland. Finde mit der Websuche die Versandkosten für ein Teil und für [MENGE] Teile, mit Quelle. Rechne aus, wie viel mich ein Teil im Einkauf höchstens kosten darf, damit nach dem Versand nichts draufgeht, einmal mit und einmal ohne Umsatzsteuer. Sag mir, ob ich den Versand extra nennen sollte und was du nicht prüfen kannst. Erfinde nichts.
(Variante B ist nicht gelaufen; im Guide: „ungetestete Abwandlung des echten Prompts“.)

## Beispiele nach Beruf (wofür die Rechnung passt, keine Lauf-Daten)
- **Kaffeerösterin:** 250-g-Beutel im Abo, Versand pro Paket vs. Preis pro Beutel.
- **Kerzenmacher:** Geschenkset mit 3 Kerzen, Versand für schwere Glasgläser.
- **Fotografin:** gedruckte Fotobücher über einen Druckdienst, Versand pro Buch.
- **Tischler:** Schneidebretter im Onlineshop, Versand über Paketdienst bei 1 vs. 4 Stück.

## Echter Lauf (31.10.2026, Chat 67f53de4…, 1 min 39 s, Opus 5.5 Mittel, Gedächtnis aus, kein Research, 5 Websuchen + 1 Seitenabruf)
- Ergebnis: „In allen fünf Briefen steht jetzt: „Versand: zzgl. 11,20 Euro brutto bei 5 Shirts, zzgl. 5,20 Euro brutto bei einem Einzelshirt. …““
- Entscheidung: Versand extra, weil der Einkaufspreis fehlt. „Beim Einzelshirt frisst der Versand etwa 17 % des Nettopreises.“
- Grenze: Einkaufspreis, Währung/Kurs, Konto-Tarif, Steuerstatus, Lieferzeit, Recht nicht geprüft.
