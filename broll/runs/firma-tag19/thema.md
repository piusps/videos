# Thema Folge „Stimmt die Versandzeile?“ (Folge 19, intern firma-tag19, Serientag 5, Slot 2026-11-01 12:00 · NICHT erste Folge: kein „Tag“, kein „gestern“)

Gründungsschritt: „Heute prüft sie ihre Versandzeile.“ Beantwortet die Übergabe von Folge 18 (finales script.txt: „Als Nächstes: Stimmt die Versandzeile?“).
Kettenprüfung: Folge 18 hat gezeigt, dass der Einkaufspreis ohne Printful-Konto fehlt, und Claude riet dort selbst, die Versandzeile im Brief vor dem Versand anzupassen. Das ist ohne Login machbar. Eingabe = Briefdatei aus Lauf 17 (Versandzeile 11,20 € / 5,20 €) als Anhang (design/lauf/LAUF.md). Kein Sprung, kein Stillstand: neue Ausgabe = korrigierte Word-Datei + neue offene Frage (Umsatzsteuerstatus).
Schmerz, den jeder kennt: „In meinem Angebot steht eine Zahl, die ich nicht belegen kann.“ Überraschung: Die KI rechnet nicht schön um, sondern streicht die Beträge, weil ein geschätzter Kurs geraten wäre – und findet dabei die nächste echte Frage (ohne USt-ID schlägt Printful 19 % auf).
Muster: M-002 (Frame 1 = Ergebnis: alte Zeile durchgestrichen → neue Zeile), M-004 (Screenshots), M-007 (Ein-Wort-CTA mit Lieferung), M-011 (Stempel).
Hinweis Eile: Kommentare (zernio-comments) nicht gelesen. Claude-Doku nicht erneut geöffnet (keine neue Funktionsbehauptung; Anhang + Websuche + Datei zurück wie Folge 13–18 belegt).

## 5 Kandidaten (Kette gibt das Thema vor, Winkel-Auswahl)
| # | Winkel | Ergebnis-Bild | Gewählt |
|---|---|---|---|
| A | Beträge ohne Beleg → gestrichen, weil nur Dollar und kein geratener Kurs | alte Zeile durchgestrichen → neue Zeile (02) + 03 „keinen Beleg gefunden“ | **ja** (Entscheidung + Warum mit Fakt) |
| B | Lieferzeit: 2–5 Werktage vs. 5–20 Werktage, nur „in der Regel“ | 04 | **nein** gesprochen (Quellen widersprechen sich, Fulfillment-Hilfeseite für mich 403) |
| C | 109 € für fünf weiter offen, netto 18,32 € pro Shirt | 05 | kurz gesprochen („Bleibt offen“), Zahl nur Bild/Caption |
| D | Ohne USt-ID 19 % Aufschlag, Steuerstatus fehlt | 06, 09 | als Übergabe („Mit oder ohne Umsatzsteuer?“) |
| E | Digitalisierung gratis ab 25 Stück | 06 | **nein** (Nebeninfo) |

## Quellen
- Echter Lauf: `design/lauf/LAUF.md` + `bericht.md` + `chat.json`, Chat https://claude.ai/chat/0c969b98-17ed-414b-a3e6-8accc983cec3, 2026-10-31 16:28:14–16:30:02 MEZ (1 min 48 s), Opus 5.5 Mittel, kein Research, Gedächtnis aus, 6 Websuchen + 2 Seitenabrufe (1 abgelehnt), 1 Datei zurück.
- Printful (von mir gegengeprüft): https://www.printful.com/shipping (bei mir Euro 4,49 € + 1,25 €; Europa 5–20 Werktage nach Fertigung; Fertigung 2–5 Werktage), https://www.printful.com/de/print-on-demand-deutschland („2 bis 5 Werktage – nach Abschluss der Produktion“), https://www.printful.com/embroidery-digitizing (gratis ab 25 Stück pro Bestellung).
- Claude-Funktionen (geprüft in Folge 13 am 30.10.2026): https://support.claude.com/en/articles/8241126-upload-files-to-claude (Anhänge); Websuche als Konto-Einstellung wie Lauf 13–18.

## Faktentabelle (gesprochen ↔ Lauf wörtlich)
| Gesprochen | Lauf |
|---|---|
| Eröffnung ohne „Tag“ | Briefing: Slot 12:00, nicht erste Folge |
| Rückblick 1 (fest) | Chef, seit Folge 5 |
| „Fünf Briefe, Einkaufspreis fehlt.“ (7 Silben, Muster Folge 17 „Fünf Briefe, Versandpreis fehlt.“) | Lauf 16/17: fünf Serienbriefe; Lauf 18: „Den Einkaufspreis des bestickten Shirts in Euro habe ich bei Printful nicht öffentlich gefunden.“ |
| „Heute prüft sie ihre Versandzeile.“ | Prompt: „Prüf die Versandzeile …“ |
| „Claude: Briefe angehängt, Websuche bei Printful.“ | Karte DOCX (01); 6 Websuchen, Abruf printful.com/shipping (07) |
| „Versandpreise im Brief: kein Beleg.“ (R2, Ticket autor-R1-02) | „Für die 11,20 € und 5,20 € habe ich keinen Beleg gefunden.“ (03) |
| „Sie streicht die Beträge.“ | „Deshalb steht in der Zeile jetzt kein Betrag mehr.“ (03); neue Zeile ohne Betrag in allen fünf Briefen (02, Datei-Diff) |
| „Warum? Printful nennt ihr nur Dollar.“ | „Printfuls offizielle Versandseite nennt für Shirts nach Europa nur Dollarbeträge … Einen Euro-Preis direkt von Printful habe ich nicht gefunden.“ (03). „ihr“ = im Lauf; meine Abfrage sah Euro → nie verallgemeinern. |
| „Umrechnen wäre geraten.“ | „… und ich rechne Dollar nicht mit einem angenommenen Kurs um.“ (03) |
| „Hundertneun Euro Verkaufspreis für fünf Shirts? Bleibt offen.“ (R2, Ticket autor-R1-01) | „Können die 109 € bleiben? Das kann ich ohne deinen Einkaufspreis nicht entscheiden.“ (05) |
| „Ihr fehlen Einkaufspreis und Umsatzsteuer-Status.“ | „Wenn du mir deinen Printful-Preis pro gesticktem Shirt in Euro und deinen Umsatzsteuerstatus nennst, rechne ich dir die Marge … genau aus.“ (09) |
| „Als Nächstes: Mit oder ohne Umsatzsteuer?“ | Lauf beantwortet das nicht: „Achtung Umsatzsteuer: Wenn du keine geprüfte USt-ID bei Printful hinterlegt hast, schlägt Printful 19 % … auf … Das gilt auch für Kleinunternehmer“ (06); „Für die Umsatzsteuerfrage frag am besten deinen Steuerberater.“ (09). Ohne Login recherchierbar (Kleinunternehmerregel vs. Regelbesteuerung); Anmeldung selbst = Menschen-Schritt. |
| CTA „Prompt … In zehn Minuten prüfst du deine Versandzeile.“ | Guide: Prüf-Prompt aus dem Lauf, verallgemeinert; Lauf 1 min 48 s + Anhängen/Lesen/Gegencheck ≈ 10 min |

Nie sagen/zeigen als Behauptung: „Printful hat keine Euro-Preise“ (Gegenprüfung: Seite zeigt je nach Abruf Euro), eine Lieferzeit als sicher, „Versand extra“ als neue Zeile (wörtlich: „Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung“), 4,49 € als Printful-Preis aus dem Lauf (Claude: Testbericht, keine Printful-Quelle), Steuerrat, irgendein Umsatz. Kasse 0 €, kein Zähler.

## Bild-Hinweise für Regie/Design
- Frame 1: Briefzeile alt „Versand: zzgl. 11,20 Euro … 5,20 Euro …“ durchgestrichen → von der neuen Zeile NUR „Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“ (Lieferzeit-Teil abgeschnitten/abgedeckt, keine Werktage im Bild; Ticket autor-R1-04) (Bildquelle 02 bzw. lokale Briefansicht aus beiden .docx; Empfängerblock/Website schwärzen). Stempel-Kandidat aus dem Lauf: „KEIN BELEG“ (≤ 4 Wörter).
- Weg: 01, 07. Ergebnis + Entscheidung: 02 (neue Zeile), Stempel „GESTRICHEN“. Warum: 03 (Zeile „nur Dollarbeträge“ / „keinen Beleg gefunden“), Karte „NUR DOLLAR“.
- 109: 05 („nicht entscheiden“), Karte „109 € OFFEN“. Fehlende Dinge: 09, Karte „STEUERSTATUS FEHLT“ (≤ 4 Wörter).
- Übergabe: 06 Zeile „Achtung Umsatzsteuer … 19 %“, Karte „MIT ODER OHNE?“.
- 04 (Lieferzeit) nicht zoomen. 08 Quellen, 10 Datei-Karte frei.
- Nie zeigen: Namen, Straßen, PLZ, Orte außer Chemnitz, Websites der Betriebe (stehen in der Briefdatei).

## TTS-Risikowörter (vor der finalen Stimme per create_speech testen)
- „Fünf Briefe,“ (kurze Pause nach dem Komma)
- „Einkaufspreis“ (EIN-kaufs-preis)
- „Versandzeile“ (Ver-SAND-zei-le)
- „Claude:“ (Klohd, danach 0,2 s Pause)
- „Printful“ (englisch „Print-full“)
- „Versandpreise im Brief: kein Beleg.“ (Doppelpunkt = Pause, „Beleg“ be-LEHG, nicht „Belag“)
- „Dollar“ (DOL-lar, deutsch)
- „Umrechnen wäre geraten“ (ge-RA-ten = geraten wie „raten“, nicht „misslungen“; Betonung auf RA)
- „Hundertneun Euro Verkaufspreis“ (nicht „hundertneunzig“; VER-kaufs-preis, Gegenpaar zu EIN-kaufs-preis)
- „Umsatzsteuer-Status“ (UM-satz-steu-er-STA-tus, kein Bruch am Bindestrich; „Status“ deutsch SCHTAH-tus/STAH-tus)
- „Beleg“ im CTA (Anführungszeichen nicht vorlesen)

## Länge
script.txt (R2): **100 Wörter** (`wc -w`, Bindestrichwörter als ein Wort). Längster freier Satz 9 Wörter („Claude: Briefe angehängt, Websuche bei Printful.“ 6; „Hundertneun Euro Verkaufspreis für fünf Shirts?“ 6), feste Sätze 15. 16 Sätze. Schätzung (Rohtempo ~155 wpm + 0,4–0,7 s Satzpausen): **≈ 46 s, ≈ 130 wpm** ✓ (Korridor 40–48 s).
Rückblick: „Fünf Briefe, Einkaufspreis fehlt.“ = 7 Silben wie Folge 17 (gemessen ≈ 6,3 s) → ≈ 6,3 s ✓ (≤ 6,5 s). „Heute“: Folge 17 gleiche Eröffnung + 7-Silben-Rückblick, gemessen 13,80 s → ≈ 13,8 s ✓ (≤ 14,5 s).

## Selbstprüfung als Fremder (nur hörend)
- Nach 6 s: KI führt 100 Tage allein eine Firma, gemessen wird Umsatz. ✓
- Nach 14 s: Logo-Shirts für kleine Betriebe; fünf (Werbe-)Briefe stehen, der Einkaufspreis fehlt; heute wird die Versandzeile darin geprüft. ✓
- Wie? Claude bekommt die Briefe und sucht bei Printful. ✓
- Ergebnis + Entscheidung + Warum: Versandpreise im Brief ohne Beleg → Beträge gestrichen, weil Printful ihr nur Dollar zeigt und Umrechnen geraten wäre. ✓
- 109 € Verkaufspreis für fünf: offen, weil Einkaufspreis und Umsatzsteuer-Status fehlen. ✓
- Übergabe mit Objekt: Umsatzsteuer (eben gehört). ✓
- Kommentieren? Prüf-Prompt, in zehn Minuten die eigene Versandzeile geprüft. ✓
- Kein „du“/Imperativ außerhalb CTA ✓, kein „Tag“/„gestern“ ✓, keine Orte/Namen ✓.
