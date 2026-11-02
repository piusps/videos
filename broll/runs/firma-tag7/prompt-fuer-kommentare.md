# Folge „Preis“: Frage + Kalkulationsvorlage (Lieferung für Kommentare „Preis“)

Was der Guide liefern muss (genau das verspricht das Skript: „Damit rechnest du deinen Preis in zehn Minuten.“): **die Frage zum Kopieren** und **die Kalkulationsvorlage mit allen Formeln**, beides Pflicht.
- Die Vorlage steht **im Guide-PDF als kopierbare Tabelle**: alle Eingabezeilen und jede Rechenzeile mit ihrer Formel als Text (z. B. „Einkauf Paket netto = Stück + Einrichtung + Versand“). Vorlage 1:1 aus `guide/kalkulationsvorlage.md` übernehmen.
- Kein Download-Link, keine xlsx im Funnel (der Funnel verschickt genau ein PDF). `guide/Kalkulationsvorlage-leer.xlsx` ist nur intern die Grundlage der Tabelle.
- Dazu das echte Ergebnis mit allen gelb markierten Annahmen. Versprochen wird die Rechnung, kein fertiger Preis.

Weg: claude.ai → Settings > Capabilities → „Code execution and file creation“ an (alle Pläne, Q-FC) → neuer Chat → „+“ → „Upload or add files“ → letztes Ergebnis anhängen (z. B. Partner- oder Lieferantenvergleich mit Preisen) → Frage einfügen → senden. Kommt „Permission request: Terminal“: „Allow once“ (nur dieser Befehl).

> Im Anhang ist mein letztes Ergebnis. Ich verkaufe [PRODUKT] an [ZIELGRUPPE]. Mein letztes Ergebnis: Als Partner kommen [PARTNER A] und [PARTNER B] infrage. Die Konkurrenz verlangt für [MENGE/PAKET] etwa [KONKURRENZPREIS] brutto. Rechne jetzt meinen Preis, als Excel-Datei mit Formeln: Was kostet mich [PAKET] und [EINZELNE NACHBESTELLUNG] bei beiden Partnern, mit [KOSTENPOSTEN, z. B. Ware, Veredelung, Einrichtung, Versand] und Mehrwertsteuer? Nimm nur Zahlen aus dem Anhang, und wenn du einen Wert schätzen oder umrechnen musst, schreib dazu, woher er kommt. Schlag mir dann einen Verkaufspreis für [PAKET] und für [EINZELNE NACHBESTELLUNG] vor, zeig den Rohertrag pro Auftrag, entscheide dich und begründe es mit zwei bis drei konkreten Gründen mit Zahlen. Erfinde nichts.

## Kalkulationsvorlage (Kurzfassung; maßgeblich für das PDF ist `guide/kalkulationsvorlage.md`)
**Blatt „Eingaben“** (blau = änderbar, gelb = geschätzt/Platzhalter): Mehrwertsteuersatz · Wechselkurs (falls Fremdwährung, mit Quelle und Datum) · Konkurrenzpreis brutto · Stück pro Paket · je Partner: Stückpreis, Einrichtung einmalig, Einrichtung bei Nachbestellung (ja/nein), Versand erstes Stück, Versand je weiteres Stück · Verkaufspreis Paket (Vorschlag) · Verkaufspreis Einzelstück (Vorschlag).
**Blatt „Kalkulation“** (eine Spalte je Partner):
1. Paket: Ware netto = Menge × Stückpreis · + Einrichtung · + Versand · = Einkauf netto · + MwSt. · = Einkauf brutto
2. Einzelstück nachbestellt: dasselbe für 1 Stück, Einrichtung × (0/1)
3. Verkaufspreis brutto → netto (÷ 1,19) · Rohertrag = VK netto − Einkauf netto · Rohertragsquote = Rohertrag ÷ VK netto
4. Vergleich: Rohertrag bei genau dem Konkurrenzpreis · Einkauf brutto ÷ Konkurrenzpreis (> 100 % = teurer als die Konkurrenz verkauft)
5. Verhandlungsziel: max. Einkaufspreis je Stück für Rohertrag 0 = (VK netto − Einrichtung − Versand) ÷ Menge
6. Kontrollzeilen gegen den Anhang (müssen exakt stimmen)

Hinweis: Rohertrag ist nicht Gewinn (Werbung, Gebühren, Steuern fehlen). Ohne Vorsteuerabzug (Kleinunternehmer) mit Brutto-Einkauf rechnen.

Beispiele:
- **Kerzen-Shop:** [Duftkerzen mit Firmenlogo] an [Hotels und Praxen], Paket [12 Kerzen], Kostenposten [Kerze, Etikett, Druckvorlage, Versand].
- **Kaffeerösterin:** [Kaffee mit eigenem Etikett] an [Büros], Paket [5 kg], Kostenposten [Rohkaffee, Röstung, Verpackung, Versand].
- **Grafikerin mit Merch:** [Tassen mit Kundenmotiv] an [Vereine], Paket [20 Tassen], Kostenposten [Tasse, Druck, Einrichtung, Versand].
- **Bauzubehör:** [Warnwesten mit Logo] an [Baubetriebe], Paket [10 Westen], Kostenposten [Weste, Druck, Einrichtung, Versand].

## Echter Lauf (28.10.2026, Chat cbe32aee…, 3 min 01 s, kein Research, 1 Websuche, 1 zitierte Quelle nur für den Dollarkurs)
- Entscheidung: **Printful statt A61**. Vorschlag 109 € brutto für fünf, 29,90 € brutto für ein Einzelshirt.
- Einkauf Fünferpaket brutto: A61 HAKRO 293 151,40 € · A61 HAKRO 281 156,40 € · Printful 69,14 € (67,04 USD netto). Einzelshirt brutto: 35,80 € · 36,80 € · 15,41 €.
- Rohertrag netto pro Auftrag: Fünferpaket A61 −35,63 €, Printful +33,50 € (37 %); Einzelshirt A61 −4,96 €, Printful +12,18 € (48 %).
- Gründe: A61-Einkauf = 138 % des Konkurrenzpreises (Printful 63 %); A61 bräuchte Händlerpreis < 17,16 € netto je Shirt (gleicher Rohertrag erst < 10,46 €); Nachbestellen bei Printful 15,41 €, Stickdatei wird wiederverwendet.
- Haken: kein 60-°C-Versprechen mit Printful (Gildan „machine wash warm“).
- Gelb markiert: Dollarkurs 1 USD = 0,8666 € (EZB 15.09.2026, goldesel.de), Stickprogramm A61 = 0 € (n. g.), A61-Versand = Endkundenversand, Printful 1,45 USD je weiteres Shirt ohne eigene Quelle, kein A61-Staffelpreis für 5, Vorsteuerabzug angenommen (Kleinunternehmer: 39,86 € bzw. 14,49 €), kein Konkurrenzpreis fürs Einzelshirt.
