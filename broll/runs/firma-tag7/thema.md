# Thema Folge „Preis“ (Folge 7, intern firma-tag7, Serientag 2, Slot 2026-10-29 18:00, nicht erste Folge)

Gründungsschritt: „Heute rechnet sie ihren Preis.“ Baut direkt auf Folge 6 auf (Partner A61 mit Vorbehalt, zweite Wahl Printful; Haken dort: fünf Shirts 151 € zum Ladenpreis gegen rund 110 € am Markt; Übergabefrage dort: „Bleibt pro Shirt überhaupt etwas übrig?“ → hier beantwortet: bei A61 nein, bei Printful ja).
Kettenprüfung: Nach Produkt, Kunde, Verfahren, Marktpreis und Partner rechnet ein echter Gründer, ob sein Preis trägt, bevor er Namen, Logo oder Werbung macht. Eingabe = Ergebnis Folge 6 als Anhang („Shirt-Firma Ergebnis Partner.md“). Kein Sprung, kein „gestern“, kein Tag.
Themenwahl: von der Kette festgelegt (Tagesbriefing, briefing.md). Schmerz, den jeder Gründer kennt: „Bleibt bei meinem Preis überhaupt was übrig?“ Story: Die Rechnung kehrt den Vorbehalt aus Folge 6 um. Bild: Kalkulationsblatt +33,50 € gegen −35,63 €.
Muster: M-002 (Frame 1 = Ergebnis-Zeile im Blatt), M-004 (Screenshots 01–04), M-005 (Zahl am Objekt, kein Umsatz-Zähler), M-007 (Ein-Wort-CTA mit Lieferung), M-011 (Stempel „PRINTFUL STATT A61“).
Grenzen ehrlich: Haken 60 °C gesprochen; gelb markierte Annahmen (Dollarkurs, Stickprogramm A61 = 0 €, Vorsteuerabzug) in Caption und Guide. Menschen-Moment im Lauf: einmal „Allow once“ für die Terminal-Abfrage (Caption-Schritt).

## Quellen
- Echter Lauf: `design/lauf/LAUF.md` + `design/lauf/bericht.md`, Chat https://claude.ai/chat/cbe32aee-e3f3-47fb-af51-b8e2e5f7d6fc, 2026-10-28 20:30:08–20:33:09 (3 min 01 s inkl. Wartezeit auf „Allow once“), kein Research, 1 Websuche (9 Treffer), 1 zitierte Quelle (goldesel.de, EZB-Referenzkurs 15.09.2026, nur für den Dollarkurs). Datei `design/lauf/Shirt-Firma_Preiskalkulation.xlsx` (2 Blätter, 75 Formeln, Kontrollsummen = Anhang). Screenshots 01, 02a, 02b, 03, 04.
- Dateierstellung: Q-FC https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude (Konzept Z. 89): Excel mit Formeln, „Settings > Capabilities → Code execution and file creation“, alle Pläne. Im Lauf vorab nur angesehen: an (LAUF.md:5).
- „Upload or add files“: wie Folge 2/6, abfotografiert in `design/lauf/01-prompt-mit-anhang.png`.
- „Permission request: Terminal“ mit „Decline“/„Allow once“: im Lauf aufgetreten (LAUF.md:8), einmal „Allow once“.

## Faktenabgleich Skript ↔ Lauf
| Gesprochen | Beleg |
|---|---|
| „Partner: A einundsechzig, mit Vorbehalt.“ | Folge 6 Bericht: „A61 …, mit Vorbehalt bis zum Händlerangebot“; Folge-6-Skript „unter Vorbehalt“. 11 Silben. |
| „Heute rechnet sie ihren Preis.“ | Tagesbriefing Folge 7 |
| „Ergebnis anhängen. Frage: Was kosten A einundsechzig und Printful, als Excel mit Formeln?“ (Ticket autor-R1-1: Printful fällt vor dem Wechsel) | Prompt (LAUF.md): Anhang + „Rechne jetzt meinen Preis, als Excel-Datei mit Formeln: Was kostet mich … bei beiden Partnern“. Neutral, kein Imperativ. |
| „Die KI wechselt: Printful statt A einundsechzig.“ | Schlussantwort: „Mit den Zahlen aus dem Anhang lohnt sich A61 nicht … **Ich entscheide mich für Printful**“ |
| „Fünf Shirts kosten bei A einundsechzig im Einkauf hunderteinundfünfzig Euro. Konkurrenzpreis: hundertzehn.“ | „Dort kostet dich ein Fünferpaket schon im Einkauf 151,40 € brutto, die Konkurrenz verlangt 110 €.“ (B10 = 151,4) |
| „Bei Printful: neunundsechzig.“ | Tabelle „Fünferpaket brutto … Printful 69,14 €“ (D10 = 69,1353). Brutto gegen brutto, wie A61 und Konkurrenz. |
| „Ein Shirt nachbestellt: rund fünfzehn.“ | Grund 3: „Ein einzelnes Shirt kostet 15,41 € brutto, weil die Stickdatei wiederverwendet wird.“ (D18) |
| „Vorschlag: hundertneun Euro für fünf.“ | „mit 109 € brutto für das Fünferpaket“ (Eingaben B22 „Vorschlag“) |
| „Rohertrag pro Auftrag: dreiunddreißig Euro fünfzig.“ | „Fünferpaket für 109 € brutto … Printful **+33,50 € (37 %)**“ (D23 = 33,4998, netto, Annahme Vorsteuerabzug). Als „Vorschlag“ + „pro Auftrag“ gekennzeichnet, kein Umsatz. |
| „Haken: Sechzig-Grad-Wäsche verspricht Printful nicht.“ | „Der Haken: Mit Printful kannst du laut Anhang keine 60-°C-Wäsche versprechen. Beim Gildan-Shirt steht nur „machine wash warm“.“ |
| „Als Nächstes: Wie heißt die Firma? Ohne Namen kein Logo, kein Muster, keine Werbung.“ | Lauf 7 nennt keinen Namen (grep bericht.md: kein Namensvorschlag). Folge 8 briefing: „Ohne Namen gibt es kein Logo, kein Muster-Shirt, keine Werbung. Heute sucht die KI per Websuche einen Firmennamen“. LAUF.md Folge 8 existiert noch nicht → Chef prüft nach Lauf 8, dass er einen Namen liefert. |
| CTA „die Frage und die Kalkulationsvorlage. Damit rechnest du deinen Preis in zehn Minuten.“ (Ticket autor-R1-2: Rechnung, kein fertiger Preis) | Guide-PDF = Prompt + Kalkulationsvorlage als kopierbare Tabelle (Eingabezeilen + jede Rechenzeile mit Formel als Text, 1:1 aus `guide/kalkulationsvorlage.md`) + echte Werte (prompt-fuer-kommentare.md). Kein xlsx-Download (Funnel verschickt nur ein PDF, Ticket autor-R2-1); `guide/Kalkulationsvorlage-leer.xlsx` nur intern, neutralisiert (Ticket autor-R2-2). Lauf 3 min + Tippen/Kurs prüfen → zehn Minuten ehrlich. |

## Entscheidung + Gründe
- **Entscheidung der KI** = Claudes Entscheidung im Lauf: Printful statt A61. Vorschlag 109 € brutto Fünferpaket, 29,90 € brutto Einzelshirt.
- **Warum** (gesprochen 2 Gründe, Regie je ca. 0,3 s Pause):
  1. Einkauf Fünferpaket brutto: A61 151,40 € > Konkurrenzpreis 110 € (138 %), Printful 69,14 € (63 %).
  2. Nachbestellen bei Printful 15,41 € brutto, Stickdatei wird wiederverwendet (A61: 35,80 €).
  3. (nur Caption/Guide) Für A61 bräuchte es einen Händlerpreis unter 17,16 € netto je besticktem Shirt (Rohertrag 0), für gleichen Rohertrag wie Printful unter 10,46 €; unbesticktes HAKRO 293 kostet laut Anhang schon 12,50 € netto Industriepreis.
- **Haken (gesprochen):** kein 60-°C-Versprechen mit Printful (Gildan nur „machine wash warm“).
- **Weitere Grenzen (gelb in der Datei, nur Caption/Guide):** Dollarkurs 1 USD = 0,8666 € vom 15.09.2026 (EZB, goldesel.de; vor Start aktualisieren); Stickprogramm A61 mit 0 € angesetzt (n. g.); Rohertrag netto unter Annahme Vorsteuerabzug, als Kleinunternehmer 39,86 € (Fünferpaket) bzw. 14,49 € (Einzelshirt); A61-Versand = Endkundenversand; Printful 1,45 USD je weiteres Shirt ohne eigene Quelle; kein A61-Staffelpreis für 5; kein Konkurrenzpreis fürs Einzelshirt.

## Offene Fäden
- **60 °C (nicht versprechen, nur vermerkt):** Mit Printful ist 60 °C nicht belegt. Der Faden bleibt offen und wird später mit dem Muster-Waschtest geklärt (Konzept-Folge 11, „bestellt sie ein Muster und lässt es bei sechzig Grad waschen“). Im Skript und in der Caption wird kein Test angekündigt.
- A61 bleibt nur Option, falls ein Händlerangebot unter 17,16 € netto je Shirt kommt; keine Anfrage angekündigt (Lehre Folge 6).
- Übergabe Folge 8: „Wie heißt die Firma?“ → Stand-Satz Folge 8 (≤ 11 Silben), Vorschlag „Partner Printful, Preis hundertneun Euro.“ (Part·ner·Print·ful·Preis·hun·dert·neun·Eu·ro = 10) oder „Ihr Preis: hundertneun Euro für fünf.“ (9).

## Für die Regie
- **Grund-Karten** (nacheinander, je ≥ 1,2 s, auf das Wort, ca. 0,3 s Pause dazwischen):
  1. „EINKAUF 5 SHIRTS“: Balken A61 **151 €** (rot) ragt über die graue Linie **„Konkurrenzpreis 110 €“**. Wort: „hunderteinundfünfzig“ → Linie auf „hundertzehn“.
  2. Gleiche Karte, zweiter Balken Printful **69 €** (grün) deutlich unter der Linie. Wort: „neunundsechzig“.
  3. „NACHBESTELLEN 1 SHIRT“: **15 €** grün, daneben grau A61 **35,80 €** (bericht.md), Untertitel „Stickdatei bleibt“ (klein). Wort: „fünfzehn“.
- **Vorschlag-Beat:** Preisschild **„Vorschlag: 109 € für 5“**, darunter Zeile **„Rohertrag pro Auftrag: +33,50 €“** (grün, Beschriftung „pro Auftrag“ gut lesbar). Kein Umsatz-Zähler.
- **Wechsel-Beat:** Auf „Die KI wechselt“ rutscht der orange Stempel „MIT VORBEHALT“ von der A61-Karte, Printful-Karte schiebt nach vorn, Stempel „PRINTFUL STATT A61“. Screenshot 02a („Ich entscheide mich für Printful“) als Beweis.
- **Haken-Beat:** Pflegeetikett mit **„60 °C“** durchgestrichen, daneben „machine wash warm“ (Zitat aus dem Lauf). Für Neue im Bild: kleine Zeile „Bau wäscht heiß“ (Folge 3/4).
- **Weg-Beat:** Auf „A einundsechzig und Printful“ stehen beide Partner-Karten nebeneinander (A61 mit Stempel „MIT VORBEHALT“, Printful als zweite Wahl). Screenshot 01 (Anhang + Prompt), dann 03 (Rechentabelle). Excel-Vorschau ging im DOM-Klon nicht (LAUF.md) → Tabelle im Chat, Datei-Karte 02b.
- **Frame 1:** Kalkulationsblatt +33,50 € gegen −35,63 € (hooks.md), Zeile zusätzlich „gerechnet, nicht verdient“ (Prüfer H3).
- **„Bei Printful: neunundsechzig.“** nur auf derselben Karte „EINKAUF 5 SHIRTS“ als zweiter Balken zeigen, damit es nicht als Verkaufspreis gehört wird (Prüfer H4).
- **TTS-Test (riskante Wörter):** „Printful“ (englisch: Print-ful, nicht „Print-full“ deutsch; 4× im Skript), „A einundsechzig“ (Untertitel „A61“; „A“ als Buchstabe, nicht als Artikel), „Rohertrag“ (Roh-ertrag, nicht „Rohr-“), „hunderteinundfünfzig“, „dreiunddreißig Euro fünfzig“, „neunundsechzig“, „Excel“, „Sechzig-Grad-Wäsche“, „Konkurrenzpreis“, „Kalkulationsvorlage“, „Fünferpaket“ (nicht mehr im Skript, nur Caption).

## Länge
134 Wörter (`wc -w`, Ziel 110–135; Runde 1: Z. 4 +3, Z. 8 −3, CTA +1). Heuristik-Silben 245 (Folge 6: 243 ≈ 44,5 s Sprechzeit) → ca. 44,5–45 s + Regie-Pausen ≈ 46–47,5 s (Grenze 48 s; bei > 48 s zuerst „Ein Shirt nachbestellt: rund fünfzehn.“ kürzen auf „Nachbestellt: rund fünfzehn.“). Rückblick: Satz 1 ≈ 3,85 s + Satz 2 (11 Silben) ≈ 1,9 s ≈ 5,8 s; Doppelpunkt nach „Partner“ kann 0,1–0,2 s Pause machen, Regie misst, > 6,0 s → zurück an Autor.

## Selbstprüfung als Fremder
- **Nach 5 s:** Eine KI führt 100 Tage allein eine Firma, gemessen wird Umsatz. ✓
- **Nach 14 s:** Logo-Shirts für kleine Betriebe, bestickt auf Bestellung; Partner steht nur mit Vorbehalt; heute rechnet sie den Preis. ✓
- **Nach 20 s:** Weg: Ergebnis anhängen, Frage nach Kosten je Partner als Excel mit Formeln. ✓
- **Nach dem Warum:** Ich kann erklären, warum Printful: A61 ist im Einkauf schon teurer als die Konkurrenz verkauft (151 gegen 110), Printful 69; Nachbestellen nur rund 15. Haken: keine 60 Grad. ✓
- **Kommentieren?** Ja, wenn ich einen Preis rechnen muss: Frage + Kalkulationsvorlage. ✓
- Lehren angewandt: kein Imperativ außer CTA, kein „gestern“/Tag, Rückblick-Satz 2 = 11 Silben, Zahlen 1:1, Rohertrag als „Vorschlag“/„pro Auftrag“, Übergabefrage von Lauf 7 nicht beantwortet, keine angekündigte Menschen-Handlung, 60-°C-Faden nicht versprochen.
