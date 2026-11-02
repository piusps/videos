# Thema Folge „Was zahlt sie für das gestickte Shirt?“ (Folge 18, intern firma-tag18, Serientag 5, Slot 2026-11-01 09:00 · ERSTE Folge des Tages: „… Ich probier das aus. Tag fünf.“ + Einblender „TAG 5“, kein „gestern“)

Gründungsschritt: „Heute rechnet sie ihre Marge.“ Beantwortet die Übergabe von Folge 17 (finales script.txt: „Als Nächstes: Was zahlt sie für das gestickte Shirt?“).
Kettenprüfung: Folge 17 hat den Versand extra in die fünf Briefe geschrieben und offen gesagt, dass der Einkaufspreis des gestickten Shirts fehlt. Ein echter Gründer sucht jetzt genau diesen Preis und rechnet, was übrig bleibt. Eingabe = Briefdatei aus Lauf 17 als Anhang (design/lauf/LAUF.md). Kein Sprung: Konto anlegen/Testbestellung ist Menschen-Schritt mit Login (Pius) und wird nicht erzählt als erledigt.
Schmerz, den jeder kennt: „Ich habe einen Preis gemacht, weiß aber nicht, was mir davon bleibt.“ Überraschung: Den Einkaufspreis gibt es ohne Konto nicht; die KI rechnet trotzdem die Schwelle aus (ab rund 17 € Einkauf bleibt beim ersten Fünferpack nichts) und lässt deshalb ihren Verkaufspreis fürs Fünferpack offen, während das Einzelshirt hält.
Muster: M-002 (Frame 1 = Ergebnis: Chat-Satz „… nicht öffentlich gefunden …“ bzw. Rechnungstabelle), M-004 (Screenshots), M-007 (Ein-Wort-CTA mit Lieferung), M-011 (Stempel).
Hinweis Eile: Kommentare (zernio-comments) nicht gelesen. Claude-Doku nicht erneut geöffnet (keine neue Funktionsbehauptung; Anhang + Websuche wie Folge 13–17 belegt).

## 5 Kandidaten (Kette gibt das Thema vor, Winkel-Auswahl)
| # | Winkel | Ergebnis-Bild | Gewählt |
|---|---|---|---|
| A | Preis ohne Konto unsichtbar → Verkaufspreis Fünferpack offen, Schwelle 17 € | Chat „nicht öffentlich gefunden“ + Tabelle „17,15 € … auf null“ | **ja** (Entscheidung + Warum mit Zahl + ehrliche Grenze) |
| B | Stick kostet nichts extra (Standardgröße im Produktpreis) | Screenshot 04 | Bild/Caption, nicht gesprochen (Wortbudget) |
| C | Digitalisierung 5,75 € einmalig | Screenshot 05 | **nein** gesprochen (nicht bestätigt, Printful nennt 2,95–6,50 €) |
| D | Versandzeile im Brief um Cents zu niedrig | Screenshot 08 Grund 2 | als Übergabe („Stimmt die Versandzeile?“) |
| E | Rechnung mit angenommenen Preisen 12/14/16 € | Tabelle 10 | **nein** (Annahmen, kein Ergebnis) |

## Quellen
- Echter Lauf: `design/lauf/LAUF.md` + `bericht.md` + `chat.json`, Chat https://claude.ai/chat/682aa15b-671f-4950-bf7d-f12e541e6bbf, 2026-10-31 16:17:44–16:19:39 MEZ (1 min 55 s), Opus 5.5 Mittel, kein Research, Gedächtnis aus, 5 Websuchen + 3 Seitenabrufe (1 abgelehnt), keine Datei.
- Printful: https://www.printful.com/pricing und https://www.printful.com/de/printful-plus (Stick in Standardgröße im Produktpreis; Digitalisierung 2,95–6,50 € einmalig) – von mir gegengeprüft. ecom-tools.de/printful (Versand 4,49 € + 1,25 €, 2XL +1,30 €) – gegengeprüft.
- Claude-Funktionen (geprüft in Folge 13 am 30.10.2026): https://support.claude.com/en/articles/8241126-upload-files-to-claude (Anhänge); Websuche als Konto-Einstellung wie Lauf 13–17.

## Faktentabelle (gesprochen ↔ Lauf wörtlich)
| Gesprochen | Lauf |
|---|---|
| Eröffnung mit „Tag fünf.“ | Briefing: erste Folge Serientag 5 (Start 28.10. = Tag 1 → 01.11. = Tag 5) |
| Rückblick 1 (fest) | Chef, seit Folge 5 |
| „Werbebrief: Versand extra.“ (7 Silben, Muster „Liste: zwanzig Betriebe.“ aus Folge 13) | Lauf 17: „Versand: zzgl. …“ in allen fünf Briefen |
| „Heute rechnet sie ihre Marge.“ | Prompt: „was … übrig bleibt“; Claude: „keine fertige Marge“, „Der Mengenrabatt frisst die Marge.“ |
| „Claude: Brief angehängt, Websuche bei Printful.“ | Karte DOCX (01); 5 Websuchen, Abrufe printful.com + ecom-tools |
| „Ohne Printful-Konto findet sie keinen Einkaufspreis.“ (R2) | „Den Einkaufspreis des bestickten Shirts in Euro habe ich bei Printful nicht öffentlich gefunden. Die Produktseiten laden den Preis erst im Browser bzw. im Konto.“ (02); „Was ich ohne Printful-Konto nicht sehen kann: Den Euro-Preis des bestickten Shirts …“ (09) |
| „Ihren Verkaufspreis fürs Fünferpack lässt sie offen.“ (R2, Ticket autor-R1-01: Verkauf vs. Einkauf hörbar) | „Den 5er für 109 € würde ich erst festlegen, wenn du den echten Stickpreis im Konto gesehen hast.“ (08) |
| „Warum? Dort gibt sie acht Euro Rabatt pro Shirt.“ (R2, Ticket autor-R1-02: Rabatt an den Kunden; „Dort“ = Fünferpack aus dem Satz davor) | „Der Mengenrabatt frisst die Marge. Im 5er kostet ein Shirt 21,80 € statt 29,90 €.“ (08); 29,90 − 21,80 = 8,10 € |
| „Ab siebzehn Euro Einkauf pro Shirt bleibt nichts.“ (R2, Ticket autor-R1-03: Bezug Einkauf hörbar) | „Damit gehst du bei der ersten 5er-Bestellung bei 17,15 € netto Printful-Preis pro Shirt auf null.“ (06). Gerundet; bei Digitalisierung 2,95–6,50 € liegt die Schwelle bei 17,00–17,71 € → „siebzehn“ hält. Bezug Fünferpack kommt aus dem Satz davor. Gilt mit Claudes Annahme netto/USt-IdNr. (Caption nennt „netto“). |
| „Als Nächstes: Stimmt die Versandzeile?“ | Lauf beantwortet das nicht, empfiehlt es aber: „Deine Versandzeile deckt die aktuellen Tarife nicht ganz … Ich würde die Zeile vor dem Versand der Briefe anpassen.“ (08). Ohne Login machbar. |
| CTA „Rechenweg. In zehn Minuten weißt du, was dir bleibt.“ (R2: „Damit“ gestrichen, Ticket autor-R1-04) | Guide: Prompt + Rechenweg (Preis netto + Versand vom Kunden − Versand an Anbieter − Einmalgebühr) ÷ Stück = Schwelle; Lauf 1 min 55 s + Lesen/Einsetzen ≈ 10 min |

Nie sagen/zeigen als Behauptung: „5,75 €“ als Printful-Preis (nicht bestätigt), angenommene Preise 12/14/16 € als gefunden, „Gewinn“, irgendein Umsatz, „Konto angelegt“/„Testbestellung gemacht“, Claudes Kleinunternehmer-Satz. Kasse 0 € (Marge ist kein Umsatz), kein Zähler.

## Bild-Hinweise für Regie/Design
- Frame 1: Screenshot 02 (Kernsatz „… nicht öffentlich gefunden …“) oder Ausschnitt aus 06 mit „17,15 € netto Printful-Preis pro Shirt auf null“; Stempel-Kandidaten aus dem Lauf: „PREIS FEHLT“ / „AUF NULL“ (≤ 4 Wörter).
- Heute/Weg: 01, 07. Ergebnis: 02, 09. Entscheidung + Warum 1: 08 (Zeile „21,80 € statt 29,90 €“), Karte „8 € BILLIGER“. Warum 2: 06, Karte „AB 17 € NICHTS“.
- Übergabe: Briefzeile „Versand: zzgl. …“ (aus Folge 17) mit Fragezeichen; Beträge nicht vergrößern.
- 05 (5,75 €) nicht lesbar zeigen; 10 (Annahmen) nur mit Label „Annahmen“ oder gar nicht. 04 (Stick inklusive) frei.
- Nie zeigen: Namen, Straßen, PLZ, Orte außer Chemnitz, Websites der Betriebe.

## TTS-Risikowörter (vor der finalen Stimme per create_speech testen)
- „Tag fünf.“ (fallend, abschließend; nicht „Tag für“)
- „Werbebrief:“ (WER-be-brief, Doppelpunkt = kurze Pause, nicht „Werbe Brief“)
- „Versand extra“ (Betonung EX-tra)
- „Marge“ (französisch „MAR-sche“, nicht „Mar-ge“ mit hartem g) – auch im CTA „Kommentiere „Marge““, Anführungszeichen nicht vorlesen
- „Claude:“ (Klohd, danach 0,2 s Pause)
- „Printful“ / „Printful-Konto“ (englisch „Print-full“, kein Bruch am Bindestrich)
- „Einkaufspreis“ (EIN-kaufs-preis)
- „Fünferpack“ (FÜNF-er-, nicht „Fünf er“; „-pack“ kurz)
- „Verkaufspreis“ (Ver-KAUFS-preis, klar gegen „Einkaufspreis“)
- „Rabatt“ (Ra-BATT)
- „siebzehn“ (nicht „siebzig“)
- „Versandzeile“ (Ver-SAND-zei-le)

## Länge
script.txt (R2 nach Prüfer-Tickets autor-R1-01..04): **100 Wörter** (`wc -w`, „Printful-Konto“ als ein Wort). Längster freier Satz 9 Wörter („Warum? Dort gibt sie acht Euro Rabatt pro Shirt.“), feste Sätze 15. Schätzung (Rohtempo ~155 wpm + 0,4–0,7 s Satzpausen, 15 Sätze): **≈ 45 s, ≈ 133 wpm** ✓ (Korridor 40–48 s).
Rückblick: „Werbebrief: Versand extra.“ = 7 Silben wie Folge 17 („Fünf Briefe, Versandpreis fehlt.“, gemessen Rückblick ≈ 6,3 s) → ≈ 6,3 s ✓ (≤ 6,5 s).
„Heute“: Folge 17 gemessen 13,80 s ohne Tag; „Tag fünf.“ kostet ~0,8 s → ungünstig 14,6 s. **Regie-Hinweis wie Folge 13:** Pause nach „Tag fünf.“ ≤ 0,40 s, vor „Heute“ ≤ 0,45 s → ≈ 14,1 s ✓ (Folge 13 erreichte so 13,52 s). Nie Tempo > 1,0.

## Selbstprüfung als Fremder (nur hörend)
- Nach 6 s: KI führt 100 Tage allein eine Firma, gemessen wird Umsatz, heute Tag 5. ✓
- Nach 14 s: Logo-Shirts für kleine Betriebe; ein Werbebrief steht, Versand kommt extra; heute rechnet sie, was ihr bleibt. ✓
- Wie? Claude bekommt den Brief und sucht bei Printful. ✓
- Ergebnis + Entscheidung + Warum: Einkaufspreis gibt es ohne Konto nicht → Verkaufspreis fürs Fünferpack offen, weil sie dort acht Euro Rabatt pro Shirt gibt und ab siebzehn Euro Einkauf pro Shirt nichts bleibt. ✓
- Übergabe mit Objekt: die Versandzeile (im Werbebrief, aus dem Rückblick bekannt). ✓
- Kommentieren? Rechenweg, in zehn Minuten wissen, was einem bleibt. ✓
- Privat: kein Stadtname aus Lauf 11, keine Betriebs-/Personennamen in script/caption/hooks/prompt-fuer-kommentare/thema.
