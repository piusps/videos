# Prüfung autor · Folge 7 „Preis“ · Runde 2 (Prüfer, 2026-10-28)

Geprüft: `script.txt` (134 Wörter), `caption.txt`, `thema.md`, `hooks.md`, `prompt-fuer-kommentare.md`, `guide/Kalkulationsvorlage-leer.xlsx` (openpyxl, Formeln + data_only) gegen `pruefung/autor-runde1.md`, `design/lauf/LAUF.md`, `design/lauf/bericht.md`, `design/lauf/Shirt-Firma_Preiskalkulation.xlsx`, `../firma-tag6/script.txt`, `../firma-tag8/script.txt`, `../firma-tag4/tagesbriefing-2026-10-29.md`, Kalibrierung `../firma-tag4/words.json` + `../firma-tag6/regie/words*.json`, Funnel `broll/scripts/zernio-golive-arm.mjs`.

**Ergebnis: NICHT BESTANDEN** (2 Kriterien bei 7, kein K.-o. verletzt). 2 Tickets an firma-autor. Runde 3 ist die letzte.

## Noten

| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Ticket R1-1 erfüllt (Printful vor „Die KI wechselt“) | 9 | script.txt:4 „Was kosten A einundsechzig und Printful, als Excel mit Formeln?“ steht vor Z. 5; der Zuschauer hört zwei Kandidaten, bevor der Wechsel kommt. Ausgleich Z. 8 „Ein Shirt nachbestellt: rund fünfzehn.“ ist umgesetzt. thema.md:20/24/56 nachgezogen (Printful 4×, TTS-Liste). |
| 2 | Ticket R1-2 erfüllt (CTA = Rechnung, Vorlage wirklich im Guide) | **7** | (a) erfüllt: script.txt:12 und caption.txt:15 „Damit rechnest du deinen Preis in zehn Minuten.“ (b) Die Datei existiert, „optional“ ist gestrichen (prompt-fuer-kommentare.md:3–5). **Liefern lässt sich das so nicht:** `zernio-golive-arm.mjs` hat nur `--pdf` und verschickt genau ein PDF (Z. 14, 80). Es gibt keinen gehosteten Link zur xlsx. caption.txt:15 verspricht trotzdem „leere Excel-Datei mit allen Formeln“. → Ticket R2-1 |
| 3 | Kalkulationsvorlage: Formeln da, Eingaben leer, nichts erfunden | **7** | Formeln: 75 in „Kalkulation“, identisch zur Lauf-Datei. Eingaben B6–B23 sind leer, nur B5 = 0,19 ist vorbelegt (dokumentiert). Keine Cache-Werte, also keine Lauf-Zahlen geleakt. Erfunden ist nichts. **Neutral ist die Vorlage aber nicht**, obwohl prompt-fuer-kommentare.md:4 „Spalten neutral Partner A/B“ verspricht. In den Texten stehen noch Lauf-Werte und Namen: Kalkulation!E5 („Printful: 5 × 9,95 USD × Kurs“), E6 („6,50 USD“), E7 („6,90 € … 4,99 + 4 × 1,45 USD“), E14, A31 („110 € brutto für 5 Shirts“), E32 („110 / 1,19“), A35 („A61-Händlerangebot“), A37 („wie Printful“), Eingaben!D5 („Bei Printful offen …“). Die Einheiten in Eingaben!C16–C20 sind fest auf „USD“, die Zeilen auf „Shirts/Stick/Stickdatei“. Für die Guide-Beispiele (Kerzen, Kaffee, Tassen) passt das nicht. Leer geöffnet zeigt die Datei #DIV/0! in B33:D33, B36:C38 und D41:D42 (Teiler Eingaben!B6/B7/B8 leer). → Ticket R2-2 |
| 4 | Nichts Neues kaputt | 8 | Die Kette ist logisch: Rückblick → „Heute rechnet sie ihren Preis.“ → Frage mit beiden Partnern → Wechsel → 2 Gründe → Vorschlag/Rohertrag → Haken → Übergabe. Anschluss Folge 8 passt: tag8 script.txt:2 „Printful stickt, fünf Shirts für hundertneun Euro.“ = Folge-7-Ende (Printful, Vorschlag 109 € für fünf). tag8 Z. 3 „Heute sucht sie einen Firmennamen.“ = Übergabe Z. 11. Abzug: 10 Doppelpunkte und 20 Satzenden (Folge 6: 4/17), dadurch mehr Pausen, siehe Kriterium 11. |
| 5 | Eröffnung wörtlich, kein Tag, kein „gestern“ | 10 | script.txt:1 wörtlich. grep über Skript und Caption: kein „gestern“, kein „Tag N“. Rückblick-Satz 1 ist der Chef-Wortlaut mit „bestickt“. |
| 6 | Rückblick ≤ 6 s | 8 | Unverändert zu R1. Satz 1 = 3,83 s (tag4 words.json 5,732→9,562), Satz 2 hat 11 Silben, ca. 1,9–2,1 s, zusammen ≈ 5,8–6,0 s. Kein Puffer, die Regie misst. |
| 7 | Warum mit 2–3 Gründen | 8 | Gesprochen 2 Gründe: 151 > 110 / Printful 69 (Z. 6–7) und Nachbestellen rund 15 (Z. 8). Der 3. Grund (17,16 €) steht in der Caption. Abzug wie R1: Grund 2 hat gesprochen keinen Vergleichswert, die Regie-Karte mit A61 35,80 € ist Pflicht (thema.md:49). |
| 8 | Ansprache nur im CTA | 9 | Skript: du/dir/dein nur in Z. 12. Caption: „dich“ in Z. 8 steht im Prompt an Claude, „dir/du“ in Z. 15 ist der CTA. Die Anleitung ist neutral. |
| 9 | Keine Emojis, Fiktiv-Hinweis plus Hashtags | 10 | In Skript, Caption, Guide-md und hooks.md keine Zeichen ≥ U+2600 (nur ✓ in der internen thema.md). caption.txt:19 „(Fiktives Experiment, keine echten Umsätze.)“, danach nur Hashtags (Z. 21). Superkind wird nicht genannt. |
| 10 | 110–135 Wörter / 40–48 s | 8 | 134 Wörter (wc -w), also im Rahmen, aber nur 1 Wort Luft. Silben-Heuristik: 246 (Folge 6: 245). Folge 6 lag roh bei 47,7/48,3 s (regie/words-raw*.json) und nach dem Schnitt bei 45,75 s (regie/words.json). Folge 7 hat mehr Doppelpunkt- und Satzpausen, Schätzung final ≈ 46–47,5 s. Die Kürzung für > 48 s ist vorbereitet (thema.md:59). |
| 11 | Zahlen 1:1 mit dem Lauf | 9 | 151 = B10 151,40 · 110 = Konkurrenz (Prompt/Schlussantwort) · 69 = D10 69,14 · „rund fünfzehn“ = D18 15,41 (richtig gerundet, mit „rund“) · 109 = Eingaben B22 · 33,50 = D23 33,4998. Caption: 151,40 / 69,14 / 15,41 / 29,90 / +33,50 / −35,63 / 17,16 / 39,86 / 75 Formeln / 3 min / 1 Websuche = bericht.md:23–45 + LAUF.md:15–18. Abzug: „hunderteinundfünfzig“ ohne „rund“, unkritisch. |
| 12 | Rohertrag als Vorschlag/Plan, nicht Umsatz | 8 | script.txt:9 „Vorschlag: hundertneun Euro für fünf. Rohertrag pro Auftrag: …“. caption.txt:11 „(netto, geplant, nicht verdient)“. Frame 1 mit „gerechnet, nicht verdient“ ist Pflicht (hooks.md:12, thema.md:54). Abzug: Der gesprochene Rohertrag-Satz selbst hat kein „geplant“, die Kennzeichnung hängt am Vorsatz und am Bild. |
| 13 | Kurs mit Datum als Annahme in der Caption | 10 | caption.txt:13 „Annahme Dollarkurs 1 US-Dollar = 0,8666 Euro (EZB-Referenzkurs vom 15.09.2026, vor dem Start aktualisieren)“ = bericht.md:40, Chef-Entscheid F7. |

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
| Versprechen, das wir nicht liefern können | **verletzt in der Caption** (Excel-Datei über einen Funnel, der nur ein PDF schickt) → Ticket R2-1. Das ist schnell zu beheben, deshalb als Note 7 geführt und nicht als K.-o. |

## Tickets

```
TICKET autor-R2-1 → firma-autor
Kriterium: Ticket R1-2 erfüllt / CTA verspricht nur Lieferbares · Note: 7/10
Beleg: caption.txt:15 „(leere Excel-Datei mit allen Formeln)“; prompt-fuer-kommentare.md:4 „als Download-Link im Guide“; broll/scripts/zernio-golive-arm.mjs:14,80 (nur --pdf, genau ein PDF)
Problem: Der Funnel verschickt nur ein PDF und es gibt keinen gehosteten xlsx-Link, die Caption verspricht aber eine Excel-Datei.
Soll: (a) caption.txt:15 verspricht „die Frage und die Kalkulationsvorlage mit allen Formeln“, ohne „Excel-Datei“. Skript Z. 12 bleibt.
  (b) prompt-fuer-kommentare.md: Die Vorlage steht im Guide-PDF als kopierbare Tabelle, jede Rechenzeile mit ihrer Formel als Text (z. B. „Einkauf netto = Menge × Stückpreis + Einrichtung + Versand“), dazu die Eingabezeilen. Punkt 1 „Download-Link“ entfällt. Ausnahme nur, wenn die xlsx unter einer öffentlichen URL liegt, die im PDF verlinkt und vor dem Go-live per curl (HTTP 200, Content-Type xlsx) geprüft ist; die Caption bleibt auch dann ohne „Excel-Datei“.
  (c) thema.md:29 entsprechend anpassen.
```

```
TICKET autor-R2-2 → firma-autor
Kriterium: Kalkulationsvorlage neutral und leer nutzbar · Note: 7/10
Beleg: guide/Kalkulationsvorlage-leer.xlsx, Kalkulation!E5, E6, E7, E14, A31, E32, A35, A37; Eingaben!D5, C16:C20; leer geöffnet #DIV/0! in Kalkulation!B33:D33, B36:C38, D41:D42
Problem: In der „leeren, neutralen“ Vorlage stehen noch Lauf-Werte und Namen in den Texten (9,95/6,50/4,99/1,45 USD, 6,90 €, 110 €, A61, Printful). Die Einheiten sind fest auf USD, und leer zeigt die Datei #DIV/0!.
Soll: Kein Text in der Vorlage nennt A61, Printful, HAKRO, Gildan oder eine Zahl aus dem Lauf. grep -i "a61|printful|hakro|gildan|110|9,95|6,50|4,99|1,45|6,90" über alle Zellen findet 0 Treffer. Die Rechenweg-Spalte beschreibt nur Formeln mit Platzhaltern („Menge × Stückpreis ÷ (1 + MwSt.)“). Die Fremdwährungs-Einheit lautet „Fremdwährung/Stk“, die Zeilen heißen allgemein („Stück“, „Veredelung“, „Einrichtung“). Die 75 Formeln bleiben, alle Divisionen in IFERROR(…;"") gefasst, damit die leere Datei keinen Fehler zeigt. Danach dieselbe neutrale Tabelle ins PDF (Ticket R2-1 b).
```

## Hinweise (kein Ticket)
- **H1 Länge:** 134 Wörter, 1 Wort unter der Grenze. Wenn die Regie > 48 s misst, wie in thema.md:59 kürzen; keine weiteren Wörter dazu.
- **H2 Rohertrag gesprochen:** Wenn die Regie Luft hat, wäre „Rohertrag pro Auftrag, gerechnet:“ eindeutiger. Kein Muss, solange Frame 1 und der Vorschlag-Beat „gerechnet, nicht verdient“ zeigen.
- **H3 Folge 8:** „Printful stickt, fünf Shirts für hundertneun Euro.“ trägt; „für hundertneun Euro“ ist dort der geplante Verkaufspreis, bei Folge 8 nicht als Umsatz bebildern.
- Hinweise H2–H4 aus Runde 1 (A61 35,80 € grau, Frame-1-Zeile, Printful-69 als zweiter Balken) gelten weiter für die Regie.
