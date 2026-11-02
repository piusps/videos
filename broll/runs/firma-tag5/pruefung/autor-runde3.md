# Prüfung Autor · Folge 5 „Konkurrenz“ · Runde 3 (letzte Runde, frischer Prüfer, 2026-10-28)

Geprüft: `script.txt` (Stand 20:32), `caption.txt` (Stand 20:34), `thema.md`, `hooks.md`, `prompt-fuer-kommentare.md` gegen `design/lauf/LAUF.md`, `design/lauf/bericht.md`, `pruefung/autor-runde1.md`, `autor-runde2.md`, `pruefung/script-vor-R2.txt`, `../firma-tag6/design/lauf/LAUF.md`, `../firma-tag6/script.txt` (Stand 20:34), `../firma-tag4/tagesbriefing-2026-10-29.md` (Regeln 1–8 + Chef-Entscheide), `../firma-tag4/words.json`.

**Gesamturteil: bestanden.** Beide Tickets aus Runde 2 sind erfüllt, kein K.-o. verletzt, alle Kriterien ≥ 8. Keine neuen Tickets. Drei nicht blockierende Hinweise unten.

## Runde-2-Tickets
| Ticket | Soll | Ergebnis | Beleg |
|---|---|---|---|
| R2-1 Übergabe | Frage, die Lauf 5 nicht beantwortet und Lauf 6 beantwortet, Wortzahl gleich | ✓ „Als Nächstes: Welcher Partner stickt Sechzig-Grad-Shirts einzeln, ohne Neueinrichtung?“ 9 Wörter wie vorher (diff gegen script-vor-R2.txt: nur Zeile 10), Skript weiter **135 W** (`wc -w`). Lauf 5 beantwortet sie nicht: 60 °C belegt nur bei workwear one (ab 5), a61 (ab 1, Stickprogramm n. g.), VistaPrint (keine Mindestmenge, Einrichtung n. g.), Flyeralarm (ab 1, Preis n. g.); Jochems/stickbetrieb.de/Spreadshirt ohne 60-°C-Angabe. Lauf 6 beantwortet sie mit A61 (60 °C + ab 1), und Folge 6 sagt jetzt ehrlich „Händlerpreise und Einrichtungskosten findet Claude dort nicht.“ (tag6 script.txt:9) → der Einrichtungs-Teil der Frage wird offen und belegt beantwortet | script.txt:10; bericht.md:26–36, 52; tag6 LAUF.md:17, 19, 32, 68–69 |
| R2-1 Caption | „Offen bleibt“ gleichlautend | ✓ „Welcher Partner stickt 60-Grad-Shirts einzeln, ohne neue Einrichtung, und zu welchem Einkaufspreis?“ | caption.txt:14 |
| R2-1 thema.md | neuer Wortlaut mit Beleg, Stand-Satz-Vorschlag F6, keine falsche Caption-Behauptung, TTS-Liste | ✓ thema.md:24, 38, 40; Caption enthält jetzt 60-Grad-Shirt, Logo-Grenzen und Grund 3 (caption.txt:10), also stimmen thema.md:30/34; „Sechzig-Grad-Shirts“ und „Neueinrichtung“ in TTS-Liste (thema.md:49) | |
| R2-2 Frame 1 | keine Obergrenze, die der Lauf widerlegt; kein 208-€-Schild | ✓ „ab rund 110 €“ ohne Obergrenze (hooks.md:9, thema.md:5, 48). Preiswand: 110 € / 126 € / 151 € + offener Pfeil mit Claude-Zitat „150 € bis über 200 €“, keine 208 € (thema.md:46). 126 € = a61 126,40, 151 € = a61 150,90, Zitat = LAUF.md:17 | |

## Ist etwas Neues kaputtgegangen?
Nein.
- Silben Übergabe: 19 → 20 (+ Komma-Pause), ca. +0,3 s. Gesamt ca. 45,5–47,5 s, im Rahmen 40–48 s.
- Rückblick unverändert. Kalibrierung `firma-tag4/words.json`: Satz 1 „Die Firma … Bestellung.“ 5,732–9,562 s = **3,83 s**; Satz 2 (11 Silben) ca. 1,9–2,0 s → Rückblick **ca. 5,8–5,9 s** ≤ 6 s ✓ (Puffer nur ca. 0,1 s, Regie misst).
- Caption wurde parallel (20:34) neutralisiert: „So geht das für die eigene Firma mit Claude:“, „das letzte Ergebnis“, „[typischer Kunde]“ = Chef-Entscheid tagesbriefing:50. Du-Form nur noch in caption.txt:12 (CTA) ✓.

## K.-o.-Regeln (Pius, tagesbriefing:16–24)
| Regel | Ergebnis | Beleg |
|---|---|---|
| Eröffnung wörtlich, ohne Tag, ohne „gestern“ | ✓ (grep: kein „gestern“, kein „Tag N“ in Skript/Caption) | script.txt:1 |
| Rückblick ≤ 6 s, Satz 2 ≤ 11 Silben | ✓ „Zu-letzt-nahm-sie-Stick-bis-fünf-und-neun-zig-Grad“ = 11, ca. 5,8–5,9 s | script.txt:2 |
| Rückblick-Satz 1 fest („bestickt“) | ✓ | script.txt:2, tagesbriefing:48 |
| Warum mit 2–3 belegten Gründen | ✓ 2 gesprochen mit Zahl (fünf Anbieter / erst ab fünf), Grund 3 in Caption + Guide | script.txt:7–8; bericht.md:58, 62 |
| Ansprache nur im CTA, keine Emojis | ✓ Skript: du/dir nur Z. 11; Caption: nur Z. 12; keine Emojis | |
| Caption: Fiktiv-Hinweis, danach nur Hashtags | ✓ | caption.txt:16–18 |
| Länge 110–135 W | ✓ 135 | |
| Kein Umsatz-Zähler / kein Geld erfunden | ✓ | hooks.md:9 |

## Zahlen 1:1 (Skript, Caption, Frame 1)
| Aussage | Beleg | |
|---|---|---|
| 295 Quellen, 7 min 19 s, 14 Anbieter | LAUF.md:12, 14, 17 | ✓ |
| rund 110 € (109,95 / 110,85 brutto inkl. Einrichtung + Versand) | LAUF.md:17 | ✓ |
| 150 bis über 200 € | LAUF.md:17 | ✓ |
| Fünf Anbieter nehmen 5 Stück nicht an (10–30) | bericht.md:7, 39–41 (Workline 20, Stoiber 15, Shirtlabor 30, stickbetrieb.de 10, CUVIO 10) | ✓ (Chat sagt „Sechs“, Abweichung in thema.md:21 begründet) |
| Workwear-Shop erst ab fünf | bericht.md:14, 26 | ✓ |
| Fast alle Summen Untergrenzen, von Claude addiert | bericht.md:45, LAUF.md:19 | ✓ |
| Spreadshirt max. 3 Farben, Shirtigo max. 9 × 9 cm, keine 60-°C-Angabe | bericht.md:52, 62; LAUF.md:21 | ✓ |
| Frame 1 / Wand: 110 / 126 / 151 € | bericht.md:26–28 | ✓ |
| 95 Grad (Folge 4) | tag4 Lauf, LAUF.md:9 | ✓ |

## Anschluss Folge 6
- Rückblick-Satz 2 Folge 6: „Ihre Lücke: Shirts einzeln nachbestellen.“ = 11 Silben, kein „nicht der Preis“, kein „gestern“ ✓ (tag6 script.txt:2). Deckt sich mit Folge 5 Z. 6 („einzelne Nachbestellungen“).
- Frage Folge 5 → Antwort Folge 6: 60 Grad (tag6 Z. 6), einzeln (Z. 7), Einrichtung offen (Z. 9), Marktpreis „rund hundertzehn“ (Z. 8) = Folge 5 Z. 5 ✓.

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 8 | Feste Eröffnung, script.txt:1 |
| Mehrwert: nachbaubar, Beginn ≤ 14 s | 8 | Weg ab ca. 12,6 s, Caption-Schritte 1–3 neutral und belegt |
| Thema: Schmerz bekannt, Ergebnis in einem Bild | 8 | „Bin ich zu teuer?“; Preisschild + „ERST AB“-Stempel |
| Hook (Satz 2 + Frame 1) | 8 | R2-2 erfüllt, Frame 1 ohne Obergrenze, alle Werte belegt |
| Warum (2–3 Gründe mit Zahl) | 8 | script.txt:7–8 |
| Faktentreue Skript | 9 | Jede gesprochene Zahl und Aussage 1:1 belegt, inkl. Übergabe |
| Kommentar-Mechanik | 9 | prompt-fuer-kommentare.md:7–21 unverändert gut |
| Länge 110–135 / 40–48 s | 8 | 135 W, ca. 45,5–47,5 s, Rückblick ca. 5,8–5,9 s, kein Puffer nach oben |
| Schritt-Kette / Anschluss / Übergabe | 8 | R2-1 erfüllt; Folge 6 beantwortet alle drei Teile der Frage (Einrichtung ehrlich als „nicht gefunden“) |
| Caption | 8 | Fakten korrekt, neutral, Grund 3 drin, „Offen bleibt“ angepasst |
| Pflicht-Ausgaben vollständig | 8 | Alle 5 Dateien stimmig untereinander |

## Tickets
Keine.

## Hinweise (nicht blockierend)
1. **Regie/TTS:** Nach „bis fünfundneunzig Grad“ (Stick) kommt am Ende „Sechzig-Grad-Shirts“ (Stoff). Ein Neuer könnte das als Widerspruch hören. Kein Platz im Wortbudget; Regie kann es im Bild lösen (Karte „Shirt-Stoff: 60 °C“ auf das Wort). „Sechzig-Grad-Shirts“ und „Neueinrichtung“ im Betonungstest prüfen.
2. **Caption:** „Die KI hält deshalb beim Preis mit“ (caption.txt:10): „deshalb“ bezieht sich auf die Ablehnungen davor, logisch passt eher „Die KI hält beim Preis mit und setzt deshalb auf …“. Kosmetik, kein Faktenfehler.
3. **thema.md:24** zählt VistaPrint (60 °C, keine Mindestmenge, Einrichtung n. g.) nicht mit auf. Ändert das Ergebnis nicht (Einrichtung n. g.), nur der Vollständigkeit halber. thema.md:40 schlägt „ein Shirt nachbestellen“ vor, Folge 6 nutzt „Shirts einzeln nachbestellen“; beides regelkonform.
