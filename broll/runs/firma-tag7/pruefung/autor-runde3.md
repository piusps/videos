# Prüfung autor · Folge 7 „Preis“ · Runde 3 (letzte Runde, Prüfer, 2026-10-28)

Geprüft: `script.txt` (134 Wörter, unverändert), `caption.txt`, `thema.md`, `hooks.md`, `prompt-fuer-kommentare.md`, `guide/kalkulationsvorlage.md`, `guide/Kalkulationsvorlage-leer.xlsx` (selbst mit openpyxl gelesen: Formeln, Cache-Werte, Regex-Grep über alle Zellen) gegen `pruefung/autor-runde1.md` und `autor-runde2.md`, `design/lauf/LAUF.md` (inkl. Excel-Abschrift 1:1), `design/lauf/bericht.md`, `../firma-tag8/script.txt`, `../firma-tag4/tagesbriefing-2026-10-29.md` (Regeln 1–8, alle K.-o.) und `broll/scripts/zernio-golive-arm.mjs`.

**Ergebnis: BESTANDEN.** Alle Kriterien liegen bei 8 oder höher, kein K.-o. ist verletzt, es gibt keine Tickets.

## Noten

| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Ticket R2-1 erfüllt (kein Excel-Versprechen, Vorlage als PDF-Tabelle) | 9 | (a) caption.txt:15 lautet jetzt „die Frage und die Kalkulationsvorlage mit allen Formeln“, „Excel-Datei“ kommt im CTA nicht mehr vor. Das „Excel-Datei“ in caption.txt:6/8 meint die Datei, die die eigene Claude-Sitzung des Zuschauers baut, und lässt sich so liefern. Skript Z. 12 ist unverändert. (b) prompt-fuer-kommentare.md:4–5: Die Vorlage steht im Guide-PDF als kopierbare Tabelle, 1:1 aus `guide/kalkulationsvorlage.md`. Es gibt keinen Download-Link und keine xlsx im Funnel, die xlsx ist nur intern. (c) thema.md:29 ist nachgezogen. |
| 2 | Ticket R2-2 erfüllt (Vorlage neutral, IFERROR) | 9 | openpyxl: 75 Formeln (wie im Lauf). Grep `a61\|printful\|hakro\|gildan\|shirt\|stick\|110\|9,95\|6,50\|4,99\|1,45\|6,90\|109\|29,9\|0,8666\|1,1539\|28,9\|151\|usd\|dollar\|ezb` über alle Zellen: 0 Treffer. Auch in kalkulationsvorlage.md: 0 Treffer. Formeln mit „/“ ohne IFERROR: 0. Leer geöffnet: Teiler Eingaben!B6/B7/B8 und VK leer → B24/B29/B33/B36–B38/D41/D42 geben "" zurück. Das sind Endzellen, auf die keine Formel weiterrechnet, also kein #DIV/0! und kein #VALUE!. Eingaben B6–B23 sind leer, nur B5 = 0,19 ist vorbelegt (Regelsatz, als Hinweis dokumentiert). Keine Cache-Werte. Einheiten jetzt „Fremdwährung/Stk“, Zeilen allgemein („Stück“, „Veredelung“, „Einrichtung“). Die Rechenweg-Spalte enthält nur Platzhalter-Formeln. Abzug −1: nicht vermerkt ist, dass bei einem Euro-Partner B als Kurs „1“ einzutragen ist (H1). |
| 3 | Nichts Neues kaputt | 9 | Skript unverändert (134 Wörter, wc). Ketten-Anschluss Folge 8: tag8 script.txt:2 „Printful stickt, Vorschlag: hundertneun für fünf.“ = F7 Z. 5 + Z. 9. Das „Vorschlag“ aus F7 wird übernommen, also kein Umsatz (H3 aus R2 erledigt). tag8 Z. 3 „Heute sucht sie einen Firmennamen.“ = F7-Übergabe Z. 11 „Wie heißt die Firma?“. Der CTA ist parallel gebaut (F8 „Damit prüfst du … in zehn Minuten“). Die xlsx-Logik ist identisch zum Lauf, nur in IFERROR gefasst; B24/B29 waren vorher `IF(x=0,0,…)` und sind gleichwertig ersetzt. Abzug −1: Das Guide-PDF selbst gibt es noch nicht (`guide/` enthält nur md + xlsx), die Übernahme 1:1 ist also erst in der finalen Prüfung belegbar. |
| 4 | Pius-Regeln 1–8 gelten weiter | 9 | R1: script.txt:1 wörtlich, grep „gestern\|Tag N“ in Skript und Caption = 0. R2: Rückblick-Satz 1 mit „bestickt“ (Chef-Entscheid), Satz 2 hat 11 Silben, rechnerisch ≈ 5,8–6,0 s, die Regie misst. R3: Die Kette Folge 6 → 7 → 8 hält. R4: 2 gesprochene Gründe, der 3. steht in der Caption. R5: Rohertrag als „Vorschlag/pro Auftrag“, Caption „(netto, geplant, nicht verdient)“, kein Zähler. R6: echter Lauf in LAUF.md mit Prompt, Chat-Link, Dauer und Quellenzahl. R7: 134 Wörter, Sekunden misst die Regie. R8: du/dir/dein nur im CTA (Skript Z. 12, Caption Z. 15; caption.txt:8 ist der Prompt an Claude). 0 Emojis in Skript, Caption, Guide-md und Prompt-Datei. Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“ + Hashtags, kein Superkind. Abzug −1: 134 Wörter, 1 Wort unter der Grenze. |
| 5 | Zahlen 1:1 mit dem Lauf | 9 | 151 / 151,40 = B10 151,4 · 110 = Eingaben B7 · 69 / 69,14 = D10 69,1353 · „rund fünfzehn“ / 15,41 = D18 15,4069 · 109 = B22 · 29,90 = B23 · +33,50 = D23 33,4998 · −35,63 = B23 −35,6303 · 17,16 = B36 17,1597 · 39,86 / Kurs 0,8666 vom 15.09.2026 / 75 Formeln / 3 min / 1 Websuche = LAUF.md:15–18 + Schlussantwort. Abzug −1 wie bisher: „hunderteinundfünfzig“ ohne „rund“, unkritisch. |
| 6 | CTA-Versprechen über genau ein PDF lieferbar | 9 | zernio-golive-arm.mjs:14/80 hängt genau ein `--pdf` an, Catch-up-DM Z. 119 schickt den einen `guideUrl`. Versprochen sind „die Frage und die Kalkulationsvorlage (mit allen Formeln)“. Beides ist Text bzw. Tabelle und passt in ein PDF: Prompt in prompt-fuer-kommentare.md:10, Tabelle in kalkulationsvorlage.md. „In zehn Minuten rechnen“ ist ehrlich, weil der Lauf 3 min dauerte und Eintippen plus Kursprüfung dazukommen. Abzug −1: Der Catch-up-Text Z. 119 sagt „hier sind die Prompts“, das ist generisch und kein Widerspruch (H2). Das PDF muss vor Go-live gebaut sein. |
| 7 | Tabelle in kalkulationsvorlage.md rechnerisch korrekt | 10 | Mit den Lauf-Werten (MwSt 0,19, Kurs 0,8666, Menge 5, A: 28,90 / Versand 6,90 / Einrichtung 0; B: 9,95 / 6,50 / 0 / 4,99 / 1,45; VK 109 / 29,90; Konkurrenz 110) nach den md-Formeln nachgerechnet: A Paket brutto **151,40** (netto 127,2269) · B Paket brutto **69,14** (69,1353; Kontrolle 67,04 USD) · B Einzelstück brutto **15,41** (15,4069; Kontrolle 14,94 USD) · B Rohertrag Paket **+33,50** (33,4998, Quote 36,6 %). Weitere Stichproben ebenfalls exakt: A Rohertrag −35,63, beim Konkurrenzpreis −34,79 / +34,34, Verhältnis 137,6 %, Verhandlungsziel 17,16 / 10,46, B Einzel-Rohertrag +12,18. Die md-Zeilen entsprechen 1:1 den xlsx-Formeln (Zeilen 5–43). |

## K.-o.-Check
| K.-o. | Status |
|---|---|
| Eröffnung wörtlich / kein Tag / kein „gestern“ | ok |
| Rückblick ≤ 6 s | ok rechnerisch (≈ 5,8–6,0 s, Regie misst) |
| Warum mit 2–3 Gründen | ok |
| Ansprache nur im CTA | ok |
| Keine Emojis / Fiktiv-Hinweis + Hashtags | ok |
| 110–135 Wörter / 40–48 s | ok (134; Sekunden misst die Regie) |
| Kein Geld erfunden / kein Umsatz-Zähler | ok |
| Ergebnis aus echtem Lauf, Zahlen 1:1 | ok |
| Versprechen, das wir nicht liefern können | ok (ein PDF: Frage + Tabelle) |

## Tickets
Keine.

## Hinweise (kein Ticket, für Guide/Regie/Final)
- **H1 Euro-Partner:** In kalkulationsvorlage.md Teil 1 beim Wechselkurs ergänzen: „Partner B rechnet in Euro: Kurs = 1, Preise netto eintragen.“ Dann passt die Vorlage auch für die Kerzen-, Kaffee- und Tassen-Beispiele ohne Fremdwährung.
- **H2 Funnel-Text:** Die Catch-up-DM in zernio-golive-arm.mjs:119 sagt „hier sind die Prompts“. Für F7 passt die DM-Kopie aus replies.json besser („die Frage und die Kalkulationsvorlage“). Beim Scharfschalten auf replies.json achten.
- **H3 Final:** Das Guide-PDF gibt es noch nicht. Die finale Prüfung prüft, dass das PDF Prompt + Tabelle 1:1 aus kalkulationsvorlage.md enthält, alle gelben Annahmen nennt, keine xlsx und keinen Download-Link verspricht und dass genau dieses PDF an `--pdf` hängt.
- Weiter für die Regie (aus R1/R2): Rückblick und Gesamtlänge messen (> 6,0 s bzw. > 48 s → Kürzung nach thema.md:59). A61 35,80 € grau neben „rund fünfzehn“, Frame 1 mit „gerechnet, nicht verdient“, Printful 69 nur als zweiter Balken auf der Karte „EINKAUF 5 SHIRTS“.
