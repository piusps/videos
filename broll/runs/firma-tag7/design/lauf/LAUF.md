# Echter claude.ai-Lauf Tag 7 (Folge "Preis": was kostet mich ein Auftrag, welcher Verkaufspreis, welcher Partner), 2026-10-28, 20:30:08-20:33:09 (MEZ)
Chat: https://claude.ai/chat/cbe32aee-e3f3-47fb-af51-b8e2e5f7d6fc (T3-Preview-Profil "Chrome"), Modell Opus 5.5 Medium
Chat-Titel (von claude.ai vergeben): "Kalkulation Firmenshirts Fünferpaket"
Weg: neuer Chat (claude.ai/new, Composer leer, kein fremder Text) -> Datei angehängt -> Prompt gesendet. KEIN Research.
Anhang: "Shirt-Firma Ergebnis Partner.md" (Ergebnis Folge Partner / Tag 6; liegt in diesem Ordner)
Vorab-Check (nur angesehen, nichts umgeschaltet): Einstellungen > Capabilities zeigte "Code execution and file creation" (Run code in the cloud) = an, Artifacts = an, Network egress = an. Deshalb steht im Prompt unverändert "als Excel-Datei mit Formeln".
Rückfragen von Claude: keine. Erster Satz: "Ich rechne beide Partner in einer Excel-Datei mit Formeln durch. Im Anhang fehlt der Dollar-Kurs, deshalb schlage ich ihn kurz nach und schreibe die Quelle dazu."
Ablauf laut Chat: 1 Websuche ("Euro Dollar Wechselkurs EZB Referenzkurs") -> Skill xlsx geladen -> Python/openpyxl baut die Datei, Formel-Neuberechnung (recalc.py: 75 Formeln, 0 Fehler) -> Kontrollsummen gegen den Anhang -> Datei geteilt -> Schlussantwort.
Hinweis Freigabe: Mitten im Lauf hielt claude.ai mit einer Abfrage "Permission request: Terminal" (Befehl: build.py ausführen + Neuberechnung + Kontrollausgabe in Claudes Cloud-Sandbox) an, Buttons "Decline" / "Allow once". Ich habe einmalig "Allow once" geklickt (gilt nur für diesen einen Befehl, keine Einstellung geändert, nichts verbunden). Die Gesamtdauer enthält diese Wartezeit (ca. 1-2 min, bis die Abfrage bemerkt wurde).

## Prompt (wörtlich)
Im Anhang ist mein letztes Ergebnis. Ich verkaufe Firmenshirts mit gesticktem Logo an kleine Handwerks- und Baubetriebe unter zehn Leuten. Mein letztes Ergebnis: Als Partner kommt A61 infrage, weil er als einziger ein besticktes Shirt mit 60 Grad Wäsche ab einem Stück hat, zweite Wahl ist Printful. Die Konkurrenz verlangt für fünf bestickte Shirts ab etwa 110 Euro brutto. Rechne jetzt meinen Preis, als Excel-Datei mit Formeln: Was kostet mich ein Paket mit fünf Shirts und ein einzeln nachbestelltes Shirt bei beiden Partnern, mit Shirt, Stick, Stickdatei, Versand und Mehrwertsteuer? Nimm nur Zahlen aus dem Anhang, und wenn du einen Wert schätzen oder umrechnen musst, schreib dazu, woher er kommt. Schlag mir dann einen Verkaufspreis für das Fünferpaket und für ein Einzelshirt vor, zeig den Rohertrag pro Auftrag, entscheide dich und begründe es mit zwei bis drei konkreten Gründen mit Zahlen. Erfinde nichts.

## Ergebnis
Dauer: 3 min 01 s (gesendet 20:30:08, fertig 20:33:09; inkl. Wartezeit auf "Allow once")
Websuche: 1 Suche, 9 Treffer, 1 Quelle zitiert (goldesel.de, EZB-Referenzkurs 1 € = 1,1539 USD vom 15.09.2026)
Datei: "Shirt-Firma_Preiskalkulation.xlsx" (Karte im Chat: "Shirt firma preiskalkulation · Spreadsheet · XLSX"), heruntergeladen, liegt in diesem Ordner. 2 Blätter: "Kalkulation", "Eingaben". 75 Formeln.
Entscheidung: **Printful** (nicht A61). Vorschlag VK: 109 € brutto Fünferpaket, 29,90 € brutto Einzelshirt. Rohertrag netto: Fünferpaket +33,50 € (37 %), Einzelshirt +12,18 € (48 %).

Chat-Schlussantwort (wörtlich, vollständig; auch in bericht.md):
"Mit den Zahlen aus dem Anhang lohnt sich A61 nicht: Dort kostet dich ein Fünferpaket schon im Einkauf 151,40 € brutto, die Konkurrenz verlangt 110 €. **Ich entscheide mich für Printful**, und zwar mit 109 € brutto für das Fünferpaket und 29,90 € brutto für ein nachbestelltes Einzelshirt. Die Rechnung steht in der Datei Shirt-Firma_Preiskalkulation.xlsx.

**Was dich ein Auftrag kostet** (Shirt, Stick, Stickdatei, Versand)

| | A61 HAKRO 293 | A61 HAKRO 281 | Printful |
|---|---|---|---|
| Fünferpaket netto | 127,23 € | 131,43 € | 58,10 € (67,04 USD) |
| Fünferpaket brutto | 151,40 € | 156,40 € | 69,14 € |
| Einzelshirt netto | 30,08 € | 30,92 € | 12,95 € (14,94 USD) |
| Einzelshirt brutto | 35,80 € | 36,80 € | 15,41 € |

**Rohertrag pro Auftrag (netto)**

| | A61 HAKRO 293 | Printful |
|---|---|---|
| Fünferpaket für 109 € brutto | −35,63 € | **+33,50 € (37 %)** |
| Einzelshirt für 29,90 € brutto | −4,96 € | **+12,18 € (48 %)** |

**Warum Printful:**
1. **A61 ist teurer als die Konkurrenz, bevor du etwas verdienst.** Bei A61 kostet dich das Fünferpaket 138 % des Konkurrenzpreises, bei Printful 63 %. Wenn du wie die Konkurrenz 110 € nimmst, bleiben dir bei Printful +34,34 € netto, bei A61 machst du −34,79 €.
2. **Für A61 bräuchtest du einen sehr niedrigen Händlerpreis.** Bei 109 € Verkaufspreis darf ein Shirt mit Stick höchstens 17,16 € netto kosten, damit du nichts verlierst. Damit A61 so viel abwirft wie Printful, dürften es nur 10,46 € sein. Laut Anhang kostet aber schon das *unbestickte* HAKRO 293 im Industriepreis 12,50 € netto (ab 10 Stück).
3. **Nachbestellen bleibt bei Printful billig.** Ein einzelnes Shirt kostet 15,41 € brutto, weil die Stickdatei wiederverwendet wird. 29,90 € liegen deutlich unter dem A61-Endkundenpreis für ein geliefertes Shirt von 35,80 €.

**Der Haken:** Mit Printful kannst du laut Anhang keine 60-°C-Wäsche versprechen. Beim Gildan-Shirt steht nur „machine wash warm“. Schick die Händleranfrage an A61 trotzdem raus. Liegt das Angebot unter 17,16 € netto je Shirt inklusive Stick, rechnet sich das Fünferpaket bei 109 €. Mit gleichem Rohertrag wie bei Printful wird es erst unter 10,46 €.

**Diese Werte stehen nicht im Anhang, sie sind in der Datei gelb markiert:**
- **Wechselkurs 1 USD = 0,8666 €:** Das ist der letzte EZB-Referenzkurs, den ich gefunden habe. Die EZB setzt den Euro-Referenzkurs am 15. September 2026 auf 1,1539 US-Dollar. Setz bitte vor dem Start den aktuellen Kurs ein.
- **Stickprogramm bei A61:** im Anhang „n. g.“, deshalb mit 0 € gerechnet. Kostet es etwas, wird A61 noch teurer.
- **A61-Versand 6,90 €:** stammt aus der Beispielrechnung im Anhang. Das ist der Endkunden-Versand, der Dropshipping-Tarif ist offen.
- **Printful 1,45 USD je weiteres Shirt:** steht nur in der Beispielrechnung des Anhangs, ohne eigene Quelle.
- **Kein Mengenrabatt für 5 Shirts:** Für A61 gibt der Anhang keinen Staffelpreis für 5 Stück an, deshalb habe ich den Preis ab 1 Stück genommen.
- **Rohertrag ohne Mehrwertsteuer:** Ich habe angenommen, dass du die Vorsteuer abziehen kannst. Als Kleinunternehmer musst du mit den Brutto-Einkaufspreisen rechnen. Dann bleiben dir bei Printful vom Fünferpaket für 109 € noch 39,86 €, beim Einzelshirt 14,49 €.
- **Kein Konkurrenzpreis fürs Einzelshirt:** Dafür gibt es im Anhang keinen Wert. Die 29,90 € sind mein Vorschlag, gemessen am A61-Shoppreis.

Sources:
- [EZB setzt Euro-Referenzkurs auf 1,1539 US-Dollar (goldesel.de)](https://goldesel.de/aktien/news/eurusd-ezb-setzt-euro-referenzkurs-auf-11539-us-dollar)"

## Excel-Datei 1:1 (Zelle, Formel -> berechneter Wert aus der Datei; Zahlen ungerundet auf 4 Stellen)
Hinweis: Werte so, wie Claude sie nach seiner Neuberechnung in der Datei gespeichert hat; nur gelesen, nichts geändert.

```
### Blatt Kalkulation
A1   Einkaufskosten, Verkaufspreis und Rohertrag pro Auftrag (alle Beträge in €)
A2   Rohertrag = Netto-Verkaufspreis − Netto-Einkauf (Annahme: du bist umsatzsteuerpflichtig und ziehst die Vorsteuer ab).
A3   Position
B3   A61 – HAKRO 293
C3   A61 – HAKRO 281
D3   Printful – Gildan 64000
E3   Rechenweg
A4   1) Fünferpaket – Erstauftrag
A5   5 Shirts inkl. Stick (netto)
B5 =Eingaben!$B$8*Eingaben!$B$10/(1+Eingaben!$B$5) → 121.4286
C5 =Eingaben!$B$8*Eingaben!$B$11/(1+Eingaben!$B$5) → 125.6303
D5 =Eingaben!$B$8*Eingaben!$B$16*Eingaben!$B$6 → 43.1133
E5   A61: 5 × Brutto-Stückpreis / 1,19 · Printful: 5 × 9,95 USD × Kurs
A6   Stickdatei / Stickprogramm (netto)
B6 =Eingaben!$B$13/(1+Eingaben!$B$5) → 0
C6 =Eingaben!$B$13/(1+Eingaben!$B$5) → 0
D6 =Eingaben!$B$17*Eingaben!$B$6 → 5.6329
E6   A61: n. g., Platzhalter 0 · Printful: 6,50 USD × Kurs
A7   Versand (netto)
B7 =Eingaben!$B$12/(1+Eingaben!$B$5) → 5.7983
C7 =Eingaben!$B$12/(1+Eingaben!$B$5) → 5.7983
D7 =(Eingaben!$B$19+(Eingaben!$B$8-1)*Eingaben!$B$20)*Eingaben!$B$6 → 9.3506
E7   A61: 6,90 € / 1,19 · Printful: (4,99 + 4 × 1,45 USD) × Kurs
A8   Einkauf Fünferpaket netto
B8 =SUM(B5:B7) → 127.2269
C8 =SUM(C5:C7) → 131.4286
D8 =SUM(D5:D7) → 58.0969
A9   + Mehrwertsteuer
B9 =B8*Eingaben!$B$5 → 24.1731
C9 =C8*Eingaben!$B$5 → 24.9714
D9 =D8*Eingaben!$B$5 → 11.0384
E9   19 % auf netto
A10   Einkauf Fünferpaket brutto
B10 =B8+B9 → 151.4
C10 =C8+C9 → 156.4
D10 =D8+D9 → 69.1353
A12   2) Ein einzelnes Shirt nachbestellt
A13   1 Shirt inkl. Stick (netto)
B13 =Eingaben!$B$10/(1+Eingaben!$B$5) → 24.2857
C13 =Eingaben!$B$11/(1+Eingaben!$B$5) → 25.1261
D13 =Eingaben!$B$16*Eingaben!$B$6 → 8.6227
A14   Stickdatei bei Nachbestellung (netto)
B14 =Eingaben!$B$13*Eingaben!$B$14/(1+Eingaben!$B$5) → 0
C14 =Eingaben!$B$13*Eingaben!$B$14/(1+Eingaben!$B$5) → 0
D14 =Eingaben!$B$18*Eingaben!$B$6 → 0
E14   A61: n. g. · Printful: Wiederverwendung kostenlos
A15   Versand (netto)
B15 =Eingaben!$B$12/(1+Eingaben!$B$5) → 5.7983
C15 =Eingaben!$B$12/(1+Eingaben!$B$5) → 5.7983
D15 =Eingaben!$B$19*Eingaben!$B$6 → 4.3243
E15   Printful: Versand erstes Shirt
A16   Einkauf Einzelshirt netto
B16 =SUM(B13:B15) → 30.084
C16 =SUM(C13:C15) → 30.9244
D16 =SUM(D13:D15) → 12.947
A17   + Mehrwertsteuer
B17 =B16*Eingaben!$B$5 → 5.716
C17 =C16*Eingaben!$B$5 → 5.8756
D17 =D16*Eingaben!$B$5 → 2.4599
A18   Einkauf Einzelshirt brutto
B18 =B16+B17 → 35.8
C18 =C16+C17 → 36.8
D18 =D16+D17 → 15.4069
A20   3) Verkaufspreis und Rohertrag pro Auftrag
A21   VK Fünferpaket brutto
B21 =Eingaben!$B$22 → 109
C21 =Eingaben!$B$22 → 109
D21 =Eingaben!$B$22 → 109
E21   Vorschlag, auf Blatt Eingaben änderbar
A22   VK Fünferpaket netto
B22 =B21/(1+Eingaben!$B$5) → 91.5966
C22 =C21/(1+Eingaben!$B$5) → 91.5966
D22 =D21/(1+Eingaben!$B$5) → 91.5966
A23   Rohertrag Fünferpaket (netto)
B23 =B22-B8 → -35.6303
C23 =C22-C8 → -39.8319
D23 =D22-D8 → 33.4998
E23   VK netto − Einkauf netto
A24   Rohertragsquote Fünferpaket
B24 =IF(B22=0,0,B23/B22) → -0.389
C24 =IF(C22=0,0,C23/C22) → -0.4349
D24 =IF(D22=0,0,D23/D22) → 0.3657
E24   Rohertrag / VK netto
A26   VK Einzelshirt brutto
B26 =Eingaben!$B$23 → 29.9
C26 =Eingaben!$B$23 → 29.9
D26 =Eingaben!$B$23 → 29.9
E26   Vorschlag, auf Blatt Eingaben änderbar
A27   VK Einzelshirt netto
B27 =B26/(1+Eingaben!$B$5) → 25.1261
C27 =C26/(1+Eingaben!$B$5) → 25.1261
D27 =D26/(1+Eingaben!$B$5) → 25.1261
A28   Rohertrag Einzelshirt (netto)
B28 =B27-B16 → -4.958
C28 =C27-C16 → -5.7983
D28 =D27-D16 → 12.179
A29   Rohertragsquote Einzelshirt
B29 =IF(B27=0,0,B28/B27) → -0.1973
C29 =IF(C27=0,0,C28/C27) → -0.2308
D29 =IF(D27=0,0,D28/D27) → 0.4847
A31   4) Vergleich mit der Konkurrenz (110 € brutto für 5 Shirts)
A32   Rohertrag, wenn du genau 110 € brutto nimmst (netto)
B32 =Eingaben!$B$7/(1+Eingaben!$B$5)-B8 → -34.7899
C32 =Eingaben!$B$7/(1+Eingaben!$B$5)-C8 → -38.9916
D32 =Eingaben!$B$7/(1+Eingaben!$B$5)-D8 → 34.3401
E32   110 / 1,19 − Einkauf netto
A33   Dein Einkauf brutto im Verhältnis zum Konkurrenzpreis
B33 =B10/Eingaben!$B$7 → 1.3764
C33 =C10/Eingaben!$B$7 → 1.4218
D33 =D10/Eingaben!$B$7 → 0.6285
E33   >100 % = dein Einkauf ist teurer als der Verkaufspreis der Konkurrenz
A35   5) Verhandlungsziel für das A61-Händlerangebot (Fünferpaket zum VK oben)
A36   Max. Händler-EK je Shirt inkl. Stick (netto) für Rohertrag 0
B36 =(B22-B6-B7)/Eingaben!$B$8 → 17.1597
C36 =(C22-C6-C7)/Eingaben!$B$8 → 17.1597
E36   (VK netto − Stickprogramm − Versand) / 5
A37   Max. Händler-EK je Shirt inkl. Stick (netto) für gleichen Rohertrag wie Printful
B37 =(B22-$D$23-B6-B7)/Eingaben!$B$8 → 10.4597
C37 =(C22-$D$23-C6-C7)/Eingaben!$B$8 → 10.4597
E37   (VK netto − Printful-Rohertrag − Stickprogramm − Versand) / 5
A38   Zum Vergleich: heutiger Shop-Preis je Shirt (netto)
B38 =B5/Eingaben!$B$8 → 24.2857
C38 =C5/Eingaben!$B$8 → 25.1261
E38   Anhang. Richtwert HAKRO-Industriepreis unbestickt No. 293: 12,50 € netto ab 10 Stk (portal.hakro.com, laut Anhang)
A40   Kontrolle gegen den Anhang
A41   Printful Fünferpaket in USD netto (Anhang: 67,04)
D41 =D8/Eingaben!$B$6 → 67.04
E41   muss 67,04 ergeben
A42   Printful Einzelshirt in USD netto (Anhang: 14,94)
D42 =D16/Eingaben!$B$6 → 14.94
E42   muss 14,94 ergeben
A43   A61 HAKRO 293 Fünferpaket brutto (Anhang: 151,40)
B43 =B10 → 151.4
E43   muss 151,40 ergeben (bei Stickprogramm 0)
### Blatt Eingaben
A1   Eingaben – alle Zahlen aus dem Anhang „Ergebnis Schritt 6 Partner“, sonst mit Quelle
A2   Blaue Zahlen = Eingabe (änderbar). Gelb = geschätzt, umgerechnet oder Platzhalter, bitte prüfen/ersetzen.
A3   Größe
B3   Wert
C3   Einheit
D3   Herkunft / Hinweis
A4   Allgemein
A5   Mehrwertsteuersatz
B5   0.19
C5   %
D5   Anhang, Beispielrechnungen (110 / 1,19; „19 % MwSt“). Bei Printful offen, mit welcher MwSt. für DE abgerechnet wird (Anhang, offene Punkte).
A6   Wechselkurs: 1 USD in €
B6   0.8666
C6   €
D6   NICHT im Anhang („Wechselkurs nicht belegt“). EZB-Referenzkurs 15.09.2026: 1 € = 1,1539 USD → 1 USD = 0,8666 € (goldesel.de, Meldung zum EZB-Referenzkurs). Vor Entscheidung auf aktuellen Kurs setzen.
A7   Konkurrenzpreis 5 bestickte Shirts (brutto)
B7   110
C7   €
D7   Anhang: „Marktpreis Konkurrenz ca. 110 € brutto für 5 bestickte Shirts“. Ein Konkurrenzpreis für 1 Einzelshirt steht nicht im Anhang.
A8   Shirts pro Paket
B8   5
C8   Stk
D8   Deine Vorgabe
A9   A61 / a61partner.de (Endkundenshop-Preise, Händlerpreis n. g.)
A10   HAKRO Heavy No. 293, bestickt, ab 1 Stk (brutto)
B10   28.9
C10   €/Stk
D10   Anhang: „ab 28,90 € brutto“ inkl. Stick. 60 °C laut Hersteller (portal.hakro.com). Staffelpreis für 5 Stk n. g. → 1-Stk-Preis angesetzt (ab 10 Stk: 21,39 €).
A11   HAKRO MIKRALINAR No. 281, bestickt, ab 1 Stk (brutto)
B11   29.9
C11   €/Stk
D11   Anhang: „ab 29,90 € brutto“, bei A61 als „Wäsche 60°C“ ausgewiesen. Staffel 5 Stk n. g. (ab 10 Stk: 22,13 €).
A12   A61 Versand pro Sendung (brutto)
B12   6.9
C12   €
D12   Anhang, Beispielrechnung („+ 6,90 Versand“) = Endkunden-Versand. Dropshipping-Versand pro Paket n. g. (offener Punkt).
A13   A61 Stickprogramm einmalig (brutto)
B13   0
C13   €
D13   n. g. im Anhang („ob das Stickprogramm extra berechnet wird: n. g.“). Platzhalter 0 – nach Anfrage eintragen. Zum Vergleich im Anhang: Shirtigo 7,50 € netto, Customwear 29,50–44,25 € netto, stickbetrieb.de 30 €.
A14   A61 Stickprogramm bei Nachbestellung erneut? (1 = ja, 0 = nein)
B14   0
D14   n. g. im Anhang. Platzhalter 0.
A15   Printful (USD netto, exkl. MwSt.)
A16   Shirt bestickt (Gildan 64000)
B16   9.95
C16   USD/Stk
D16   Anhang: „ab 9,95 USD netto (exkl. MwSt. und Digitalisierung)“. 60 °C-Etikett: n. g. („machine wash warm“).
A17   Stickdatei einmalig
B17   6.5
C17   USD
D17   Anhang: 6,50 USD (Text 3,95 USD); ab 25 Stück gratis.
A18   Stickdatei bei Nachbestellung
B18   0
C18   USD
D18   Anhang: „Wiederverwendung für denselben Produkttyp kostenlos“.
A19   Versand erstes Shirt
B19   4.99
C19   USD
D19   Anhang: „4,99 USD Versand für das erste Shirt“.
A20   Versand je weiteres Shirt
B20   1.45
C20   USD
D20   Anhang, nur in der Beispielrechnung („4 × 1,45“) ohne eigene Quellenangabe – bei Printful gegenprüfen.
A21   Dein Verkaufspreis (Vorschlag, änderbar)
A22   VK Fünferpaket (brutto, inkl. Versand)
B22   109
C22   €
D22   Vorschlag: knapp unter dem Konkurrenzpreis von 110 € brutto.
A23   VK Einzelshirt-Nachbestellung (brutto, inkl. Versand)
B23   29.9
C23   €
D23   Vorschlag: unter A61-Endkundenpreis für 1 Shirt geliefert (28,90 + 6,90 = 35,80 € brutto, Anhang).
```

## Auffälligkeiten (nur festgehalten, nichts korrigiert)
- Claude dreht die Entscheidung aus Folge 6 um: A61 ist mit den Anhang-Zahlen im Einkauf schon teurer (151,40 € brutto für 5) als der Konkurrenzpreis (110 €), deshalb Printful. A61 bleibt Option, falls das Händlerangebot unter 17,16 € netto je Shirt inkl. Stick liegt (gleicher Rohertrag wie Printful erst unter 10,46 €).
- Zahl, die nicht aus dem Anhang stammt: Wechselkurs 1 USD = 0,8666 € (per Websuche, EZB-Referenzkurs 15.09.2026, Quelle goldesel.de; das Datum ist sechs Wochen alt, Claude schreibt selbst "vor dem Start den aktuellen Kurs einsetzen").
- Platzhalter/Annahmen, in der Datei gelb markiert und im Chat genannt: A61-Stickprogramm 0 € (n. g.), A61-Versand 6,90 € = Endkundenversand, Printful 1,45 USD je weiteres Shirt nur aus Beispielrechnung, kein Staffelpreis für 5 Stück bei A61, Rohertrag netto unter der Annahme Vorsteuerabzug (als Kleinunternehmer: Printful 39,86 € bzw. 14,49 €, laut Chat), kein Konkurrenzpreis für das Einzelshirt.
- Spalte "A61 HAKRO 281" steht in Kosten-Tabelle und Datei, in der Rohertrag-Tabelle im Chat fehlt sie (in der Datei: −39,83 € / −5,80 €).
- Das 60-°C-Versprechen geht mit Printful verloren (Gildan nur "machine wash warm"); Claude nennt das als "Der Haken".
- Kontrollzeilen in der Datei treffen den Anhang exakt: 67,04 USD, 14,94 USD, 151,40 €.

## Screenshots (DOM-Klon ohne Sidebar/nav/aside, Dark Mode, Leak-Check leer)
- 01-prompt-mit-anhang.png: Composer mit Anhang "Shirt-Firma Ergebnis Partner.md" + Prompt, vor dem Senden, Opus 5.5 Medium, kein Research
- 02a-antwort-kopf.png: Antwort-Kopf: "Ich rechne beide Partner in einer Excel-Datei…", Block "Shared a file, searched the web, ran a command", erster Absatz mit "Ich entscheide mich für Printful" und 109 € / 29,90 €
- 02b-datei-karte.png: Datei-Karte "Shirt firma preiskalkulation · Spreadsheet · XLSX" (claude.ai setzt sie ans Ende der Antwort, nicht an den Kopf; deshalb zwei Ausschnitte statt einem) mit Quellenzeile darüber
- 03-rechentabelle.png: die beiden Tabellen im Chat ("Was dich ein Auftrag kostet", "Rohertrag pro Auftrag (netto)"). Die Excel-Vorschau öffnet sich in claude.ai in einem fremden iframe (claudeusercontent.com), den der DOM-Klon nicht abbilden kann, und ein echter Tab-Screenshot lief zweimal in ein Timeout. Deshalb die Tabelle im Chat (Zahlen identisch mit der Datei).
- 04-entscheidung.png: "Warum Printful:" mit 3 Gründen + "Der Haken"

## Ein Satz an den Autor
Claude rechnet in einer echten Excel-Datei mit Formeln (2 Blätter, 75 Formeln, Kontrollsummen = Anhang) und entscheidet sich gegen A61 für **Printful**: Fünferpaket kostet bei Printful 69,14 € brutto im Einkauf, bei A61 151,40 € (138 % des Konkurrenzpreises von 110 €); Vorschlag 109 € brutto fürs Fünferpaket (+33,50 € Rohertrag netto, 37 %) und 29,90 € fürs Einzelshirt (+12,18 €, 48 %); Haken: mit Printful kein 60-°C-Versprechen, A61 nur noch, wenn das Händlerangebot unter 17,16 € netto je besticktem Shirt liegt; einziger Fremdwert ist der Dollarkurs 0,8666 € per Websuche.
