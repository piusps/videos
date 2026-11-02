# Folge „Mit oder ohne Umsatzsteuer?“: Steuer-Prompt (Lieferung für Kommentare „Steuer“)

## Was der Guide liefern muss
Gesprochen verspricht das Skript: „ich schick dir den Prompt. In zehn Minuten rechnest du beide Wege durch.“ Genau das, nicht mehr:
1. **Der Prompt zum Kopieren** (Variante A: mit Anhang Angebot/Kalkulation; Variante B: ohne Anhang), Platzhalter [BERUF], [PRODUKT], [PREIS], [MENGE], [LIEFERANT], [KUNDEN].
2. **Der Weg in claude.ai** (siehe unten), mit Tipp „Gedächtnis für diesen Chat aus“.
3. **Der Rechenweg aus dem Lauf** zum Selbsteintragen: P = eigener Einkaufspreis netto. Mit Umsatzsteuer: Brutto ÷ 1,19 − Einkauf. Kleinunternehmer: Brutto − Einkauf × 1,19 (wenn der Lieferant 19 % aufschlägt). Kunde mit Vorsteuerabzug zahlt effektiv netto (Beispiel Lauf: 109 € → 91,60 €, Unterschied 17,40 €).
4. **Die Abwägung aus dem Lauf (ehrlich beide Seiten):** Mit Umsatzsteuer lohnt sich eher bei Geschäftskunden mit Vorsteuerabzug und Lieferanten, die Umsatzsteuer berechnen. Kleinunternehmer kann bei Privatkunden besser sein: Im Lauf wäre bei gleichem Bruttopreis die eigene Marge als Kleinunternehmer 19 % höher. Verzicht bindet fünf Jahre (§ 19 Abs. 3 UStG), dann Umsatzsteuer-Voranmeldungen.
5. **Checkliste „Das prüft ein Mensch“:** eigener Einkaufspreis, ob die Kunden vorsteuerabzugsberechtigt sind, erwarteter Jahresumsatz (Grenzen 25.000 € Vorjahr / 100.000 € laufendes Jahr), Anmeldung/Verzicht beim Finanzamt, USt-ID.
6. **Ehrlicher Hinweis, gut sichtbar:** keine Steuerberatung. Claude ist kein Steuerberater; vor der Anmeldung mit Steuerberatung oder Finanzamt klären.

Nicht versprechen: richtige Steuerentscheidung, „spart Steuern“, Rechtssicherheit, fertige Anmeldung, Marge in Euro. Nichts anmelden, nichts bezahlen.

## 1:1 außer … (K.-o. für die Guide-Stufe)
| Stelle | Behandlung |
|---|---|
| 19 % Printful-Aufschlag | nur „laut Testbericht (ecom-tools.de), nicht von Printful bestätigt“ |
| „Verzicht sinnvoll bei Unternehmerkunden“ | Quelle IHK Schwarzwald-Baar-Heuberg (nicht IHK München, dort steht es nicht; LAUF.md Gegenprüfung) |
| BMF-Erlass 18.03.2025 | nur „laut IHK Ostwürttemberg“, nicht als gelesen |
| UStAE 1a.1 / Erwerbsschwelle | weglassen (Nebeninfo, nicht gegengeprüft) |
| 17,02 € Null-Grenze | nur mit „bei 6,50 € Digitalisierung, ohne Versand“ |
| Begrüßung mit Namen | in Screenshot 01 entfernt; nie zeigen |
| Screenshots | 01–05, 07–12 frei; 06 nur klein |
**Abnahme über den fertigen Guide-Text:** `grep -ic boilr` = 0; `grep -c "\[BERUF\]"` = 0; kein Ortsname außer IHK-Bezeichnungen in Quellen; „keine Steuerberatung“ ≥ 1.

## Weg
claude.ai → neuer Chat → „+“ → Gedächtnis für diesen Chat aus → „Dateien hochladen oder hinzufügen“: eigenes Angebot/Kalkulation → Prompt einfügen → senden. Websuche muss an sein (im Lauf Konto-Standard an), Research aus.
Nötige Funktionen (geprüft in Folge 13 am 30.10.2026): Anhänge (support.claude.com/en/articles/8241126-upload-files-to-claude).
Zeit: Lauf 1 min 31 s; mit Anhängen, Lesen und Eintragen des eigenen Einkaufspreises ≈ 10 Minuten.

## Variante A: mit Anhang – echter Lauf-Prompt, verallgemeinert
> Ich gründe gerade eine kleine Firma. Im Anhang stehen mein Angebot und meine Kalkulation: [PREIS] brutto für [MENGE] [PRODUKT], [PREIS] für ein einzelnes Stück, Einkauf bei [LIEFERANT]. Meine Kunden sind [KUNDEN]. Prüf mit der Websuche, ob ich als Kleinunternehmer starten soll oder mit Umsatzsteuer, jeweils mit Quelle (Gesetz, Finanzverwaltung, IHK). Rechne für meine Preise aus, was das jeweils für mich bedeutet. Entscheide dich für einen Weg, mit zwei bis drei konkreten Gründen. Sag mir, was du nicht prüfen kannst. Erfinde nichts. Ich weiß, dass das keine Steuerberatung ist.

## Variante B: ohne Anhang
> Ich bin [BERUF] und verkaufe [PRODUKT] für [PREIS] brutto an [KUNDEN]. Mein Einkauf: [EINKAUF] netto pro Stück bei [LIEFERANT]. Prüf mit der Websuche, ob ich als Kleinunternehmer starten soll oder mit Umsatzsteuer, mit Quelle (Gesetz, IHK). Rechne beide Wege für meinen Preis durch, entscheide dich mit zwei bis drei Gründen und sag mir, was du nicht prüfen kannst. Erfinde nichts. Ich weiß, dass das keine Steuerberatung ist.
(Variante B ist nicht gelaufen; im Guide: „ungetestete Abwandlung des echten Prompts“.)

## Beispiele nach Beruf (wofür die Frage passt, keine Lauf-Daten)
- **Webdesignerin für Arztpraxen:** Geschäftskunden mit Vorsteuerabzug, kaum Wareneinkauf, aber Software-Abos mit Umsatzsteuer.
- **Hundetrainer:** fast nur Privatkunden, da kann Kleinunternehmer der bessere Weg sein.
- **Schreiner mit Einzelstücken:** Holzeinkauf mit Umsatzsteuer, Kunden gemischt privat/gewerblich.
- **Fotografin:** Hochzeiten privat, Firmenshootings gewerblich, Kamerakauf mit Umsatzsteuer.

## Echter Lauf (31.10.2026, Chat 0a4627da…, 1 min 31 s, Opus 5.5 Mittel, Gedächtnis aus, kein Research, 5 Websuchen + 3 Seitenabrufe)
- Entscheidung: „Starte mit Umsatzsteuer, also mit Verzicht auf die Kleinunternehmerregelung.“
- Gründe: Kunden sind Betriebe (Vorsteuerabzug, 17,40 € pro Paket); Printful als Kleinunternehmer dauerhaft 19 % teurer; Angebot schon brutto formuliert. Haken: fünf Jahre, Voranmeldungen.
- Nicht geprüft: Einkaufspreis, Vorsteuerabzug der Kunden, Printfuls eigene Aussage, Gesetz/BMF direkt.
