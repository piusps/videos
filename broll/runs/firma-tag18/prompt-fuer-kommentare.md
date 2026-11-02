# Folge „Was zahlt sie für das gestickte Shirt?“: Marge-Rechenweg (Lieferung für Kommentare „Marge“)

## Was der Guide liefern muss
Gesprochen verspricht das Skript: „ich schick dir den Rechenweg. In zehn Minuten weißt du, was dir bleibt.“ Genau das, nicht mehr:
1. **Der Marge-Prompt zum Kopieren** (Variante A: mit Anhang Brief/Angebot; Variante B: ohne Anhang), Platzhalter [BERUF], [PRODUKT], [ANBIETER], [PREIS], [MENGE].
2. **Der Weg in claude.ai** (siehe unten), mit dem Tipp „Gedächtnis für diesen Chat aus“.
3. **Der Rechenweg aus dem Lauf, verallgemeinert:**
   Verkaufspreis netto (brutto ÷ 1,19) + Versand, den der Kunde zahlt (netto) − Versand an den Anbieter − Einmalgebühren (z. B. Digitalisierung beim ersten Auftrag) = was für die Ware bleibt. Geteilt durch die Stückzahl = **Schwelle: so viel darf ein Stück im Einkauf höchstens kosten, sonst bleibt nichts.**
   Beispiel aus dem Lauf (Claudes Rechnung, Annahme netto mit USt-IdNr.): 5 Shirts für 109 € → erste Bestellung bei 17,15 € Einkauf pro Shirt auf null; Einzelshirt für 29,90 € → Grenze 25,01 €. Die Digitalisierungsgebühr ist im Lauf mit 5,75 € angesetzt; Printful selbst nennt 2,95–6,50 € pro Design (einmalig) → Schwelle dann 17,00–17,71 €.
4. **Die Entscheidung aus dem Lauf:** Einzelpreis bleibt; Paketpreis erst festlegen, wenn der echte Einkaufspreis bekannt ist. Claude wörtlich: „Den 5er für 109 € würde ich erst festlegen, wenn du den echten Stickpreis im Konto gesehen hast.“ Grund: Mengenrabatt („Im 5er kostet ein Shirt 21,80 € statt 29,90 €“).
5. **Was Claude ohne Anbieter-Konto nicht sehen kann (laut Lauf, verallgemeinert):** echter Einkaufspreis für Modell/Farbe/Größe, Fertigungsort und Währung, Aufpreise für Sondergrößen oder große Motive, tatsächlicher Versand und Steuer im Checkout. Tipp aus dem Lauf: im eigenen (kostenlosen) Anbieter-Konto eine Testbestellung bis zur Kasse durchklicken, nicht bezahlen, Preis in den Prompt einsetzen.
6. **Ehrlicher Hinweis:** Nicht abgezogen sind Zahlungsgebühren, Retouren, Größenaufpreise und die eigene Zeit. Keine Steuerberatung; Kleinunternehmer rechnen anders (Anbieter-Steuer nicht erstattbar) → mit Steuerberater klären.

Nicht versprechen: den Einkaufspreis eines Anbieters, Gewinn, „fertige Kalkulation“, Steuer- oder Rechtsberatung. Nichts bestellen, nicht bezahlen.

## 1:1 außer … (K.-o. für die Guide-Stufe)
| Stelle | Behandlung |
|---|---|
| Betriebsnamen, Inhabernamen, Straßen, PLZ, Orte, Websites der Betriebe (in der angehängten Briefdatei, siehe runs/firma-tag17/design/lauf/briefe-text.txt) | Nie in den Guide. Der Chat von Lauf 18 enthält keine. |
| Ort außerhalb der Testregion | nicht nennen; nur „Chemnitz“ erlaubt. |
| Digitalisierung „5,75 €“ | nur mit Zusatz „laut Claude; Printful nennt 2,95–6,50 € pro Design“ (LAUF.md Gegenprüfung). |
| Angenommene Shirtpreise 12/14/16 € (Screenshot 10) | nur als „Annahmen aus dem Lauf, keine gefundenen Preise“. |
| Claudes Satz „Als Kleinunternehmer kommt … praktisch dasselbe heraus“ | weglassen (zweifelhaft, siehe LAUF.md). |
| USD-Wert 14,25 (STTU169) | weglassen (unklar, ob Druck oder Stick). |
| Screenshots | 01–04, 06–09, 11, 12 frei; 05 nur mit obigem Zusatz; 10 nur mit Label „Annahmen“. |
**Abnahme über den fertigen Guide-Text:** Abgleich gegen Firmenname/Straße/PLZ/Ort aus der Briefdatei = 0 Treffer; Stadtname aus Lauf 11 = 0 (Name absichtlich nicht hier); `grep -ic boilr` = 0; `grep -c "\[BERUF\]"` = 0 im fertigen Guide.

## Weg
claude.ai → neuer Chat → „+“ → Gedächtnis für diesen Chat aus → „Dateien hochladen oder hinzufügen“: eigener Angebotsbrief (Word) → Prompt einfügen → senden. Websuche muss in den Einstellungen an sein (im Lauf Konto-Standard an), Research aus.
Nötige Funktionen (geprüft in Folge 13 am 30.10.2026): Anhänge (support.claude.com/en/articles/8241126-upload-files-to-claude).
Zeit: Lauf 1 min 55 s; mit Anhang, Lesen und eigenem Nachrechnen ≈ 10 Minuten.

## Variante A: mit Anhang – echter Lauf-Prompt, verallgemeinert
> Im Anhang ist mein Angebotsbrief mit der Versandzeile. Mein Angebot: [PREIS] brutto für [MENGE] [PRODUKT], [PREIS] für ein einzelnes Stück, hergestellt erst auf Bestellung über [ANBIETER], Kunden in Deutschland. Finde mit der Websuche heraus, was mich ein Stück bei [ANBIETER] im Einkauf kostet: Grundpreis, Veredelung und mögliche Einmalgebühren, jeweils mit Quelle. Rechne dann mit dem Versand aus meinem Brief aus, was von meinem Paketpreis und vom Einzelpreis übrig bleibt. Sag mir, ob die Preise so bleiben können, mit zwei bis drei Gründen. Sag mir, was du ohne [ANBIETER]-Konto nicht sehen kannst. Erfinde nichts.

## Variante B: ohne Anhang
> Ich bin [BERUF] und verkaufe [PRODUKT] für [PREIS] pro Stück und [PREIS] für [MENGE] Stück, Versand [VERSAND] extra, hergestellt über [ANBIETER]. Mein Einkaufspreis pro Stück ist [EINKAUF] (oder: unbekannt, dann such ihn mit der Websuche, mit Quelle). Rechne aus, was mir pro Bestellung bleibt und ab welchem Einkaufspreis pro Stück nichts mehr übrig ist. Sag mir, ob mein Paketpreis so bleiben kann, mit zwei bis drei Gründen, und was du nicht prüfen kannst. Erfinde nichts.
(Variante B ist nicht gelaufen; im Guide: „ungetestete Abwandlung des echten Prompts“.)

## Beispiele nach Beruf (wofür die Rechnung passt, keine Lauf-Daten)
- **Kaffeerösterin:** Abo mit 3 Beuteln vs. Einzelbeutel, Einkauf Rohkaffee + Verpackung.
- **Grafikerin mit Print-on-Demand-Postern:** 3er-Set vs. Einzelposter, Druckpreis beim Anbieter.
- **Hundefriseur mit Merch:** bestickte Caps fürs Team-Set vs. Einzelcap.
- **Tischler:** 4 Schneidebretter im Paket vs. eins, Holz + Gravur pro Stück.

## Echter Lauf (31.10.2026, Chat 682aa15b…, 1 min 55 s, Opus 5.5 Mittel, Gedächtnis aus, kein Research, 5 Websuchen + 3 Seitenabrufe)
- Ergebnis: „Den Einkaufspreis des bestickten Shirts in Euro habe ich bei Printful nicht öffentlich gefunden. … Deshalb kann ich dir nur eine Rechnung mit Platzhalter für den Shirtpreis geben, keine fertige Marge.“
- Gefunden: Stick in Standardgröße im Produktpreis enthalten; Digitalisierung einmalig.
- Entscheidung: Einzelpreis tragfähig, 5er-Preis offen bis zum echten Preis; Versandzeile im Brief anpassen.
