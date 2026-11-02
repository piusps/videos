# Prüfung Autor · Folge 5 „Konkurrenz“ · Runde 2 (frischer Prüfer, 2026-10-28)

Geprüft: `script.txt`, `caption.txt`, `thema.md`, `hooks.md`, `prompt-fuer-kommentare.md` gegen `design/lauf/LAUF.md`, `design/lauf/bericht.md`, `../firma-tag4/tagesbriefing-2026-10-29.md`, `../firma-tag4/script.txt`, `../firma-tag4/words.json` (identisch mit `regie/words.json` und `public/firma-ep/tag4/words.json`, md5 b98a87e4…), `briefing.md`, `../firma-tag6/briefing.md` + `../firma-tag6/design/lauf/LAUF.md` (für die Übergabe), `autor-runde1.md`, `bewertung.md` Abschnitt „autor“.

**Gesamturteil: nicht bestanden (knapp).** Kein K.-o. verletzt. Alle vier Tickets aus Runde 1 sind im Skript umgesetzt, und alle gesprochenen Zahlen stimmen mit dem Lauf. Zwei Kriterien liegen bei 7: (1) Die neue Übergabefrage beantwortet die eigene Preistabelle schon, und sie passt nicht zu dem, was Folge 6 tatsächlich entscheidet. (2) Frame 1 zeigt als Spanne „rund 110 € … 151 €“, Caption und Guide sagen „150 bis über 200 Euro“. Beide Fixes sind klein und ändern die Wortzahl nicht.

## Runde-1-Tickets: Ist jedes Soll wahr?
| Ticket | Soll | Ergebnis | Beleg |
|---|---|---|---|
| R1-1 (a) | Entscheidung mit „ohne (neue) Einrichtung“, kein „nicht auf den Preis“ | ✓ „Die KI hält beim Preis mit und setzt auf einzelne Nachbestellungen ohne neue Einrichtung.“ = Empfehlung „Gleichstand … garantierte Nachbestellung ab 1 Stück ohne erneute Einrichtung“ | script.txt:6, bericht.md:64 |
| R1-1 (b) | Grund 2 nennt das Einzelstück | ✓ „stickt kein einzelnes Shirt, erst ab fünf“ = „Ein einzelnes Shirt … lässt sich mit Logo also nicht nachbestellen“ | script.txt:8, bericht.md:14 |
| R1-1 (c) | Übergabe ist eine Frage, die der Lauf NICHT schon beantwortet | **✗** „Welcher Partner stickt Einzelstücke ohne neue Einrichtung?“ beantwortet die eigene Tabelle schon: Stickerei Jochems („ab 1 Stk“, „Stickprogramm nur beim ersten Auftrag“), stickbetrieb.de („Nachbestellungen auch darunter“, „Stickprogramm entfällt bei Nachbestellung“), Spreadshirt (Mindestmenge „keine“, Stickdatei 0 €). Der Fehler steckte schon im Formulierungsvorschlag von Runde 1. → Ticket R2-1 | script.txt:10, bericht.md:27, 32, 40 |
| R1-1 Rest | thema.md nachgezogen | ✓ Faktentabelle, Regie-Karten, Folge-6-Hinweis | thema.md:20, 41–46 |
| R1-2 | Satz 2 ≤ 11 Silben, kalibrierte Schätzung mit Verweis auf words.json | ✓ „Zu-letzt nahm sie Stick, bis fünf-und-neun-zig Grad“ = 11 Silben. Verweis in thema.md:50, hooks.md:15 | script.txt:2 |
| R1-3 | „Fünf“ nachzählbar, kein Anbieter zugleich Preis und Ablehnung | ✓ Fünf Stempel 10/10/15/20/30 = Workline, Stoiber, Shirtlabor, stickbetrieb.de, CUVIO; 208 € aus dem Bild genommen; Hinweis „Chat-Screenshot mit ‚Sechs‘ nicht unter diesem Satz“ | script.txt:7, hooks.md:9, thema.md:21, bericht.md:39–41 |
| R1-4 (a) | Haken nennt Menge und Folge | ✓ „Fast alle Summen sind Untergrenzen, von Claude addiert.“ Bis auf Stick-Manufaktur (Anbieterangabe) ist jede Summe „Berechnung“; „Die Summen sind deshalb Untergrenzen“ | script.txt:9, bericht.md:26–41, 45 |
| R1-4 (b) | „14 Anbieter laut Claude“ / „Preistabelle aus dem Lauf“ | ✓ | caption.txt:10, 12; prompt-fuer-kommentare.md:3, 15 |
| R1-4 (c) | ShirtStore-Widerspruch im Guide | ✓ „Einschränkung: Dieser Anbieter widerspricht sich, auf seiner Polo-Seite stehen 35 € einmalig.“ | prompt-fuer-kommentare.md:19, bericht.md:48 |

## Sprechdauer, kalibriert an `firma-tag4/words.json`
- Folge 4, Satz 1 „Die Firma … Bestellung.“: 5,732–9,562 s = **3,83 s**. Satz 2 „Gestern lernte sie: Der Bau wäscht mit 60 Grad.“ (12 Silben): 9,625–11,683 s = **2,06 s** (5,8 Silben/s). Lücke zwischen den Sätzen: 0,06 s. Rückblick Folge 4 echt: **5,95 s** (in Runde 1 als 6,03 s angegeben, das Wort „Grad.“ endet aber bei 11,683 s).
- Folge 5: Satz 1 gleich lang („bestickt“ und „gedruckt“ haben je 2 Silben), also ca. 3,83 s. Satz 2 hat 11 Silben, also ca. 1,9 s, mit Komma-Pause nach „Stick,“ ca. 2,0 s. Rückblick **ca. 5,8–5,9 s** ✓ (Puffer ca. 0,1 s).
- Weil „Tag zwei.“ wegfällt, beginnt der Rückblick bei ca. 4,9 s, „Heute vergleicht sie Konkurrenzpreise.“ endet bei ca. 12,5 s, „Plus, Research an …“ beginnt bei ca. 12,6 s ✓ (< 14 s).
- Länge: 135 Wörter (`wc -w`), also genau an der Obergrenze. 239 Silben, Hochrechnung ca. 43–44 s Sprechzeit plus Pausen, also 45–47 s ✓.

## K.-o.-Check
| Regel | Ergebnis | Beleg |
|---|---|---|
| Eröffnung wörtlich, ohne „Tag zwei.“ | ✓ | script.txt:1 |
| Kein Tag, kein Hochzählen, kein „gestern“ (Skript/Caption) | ✓ (grep: kein „gestern“, kein „Tag N“; Caption sagt „In der letzten Folge“) | script.txt, caption.txt:3 |
| Rückblick-Satz 1 wörtlich (Chef-Entscheid „bestickt“) | ✓ | script.txt:2, tagesbriefing:48 |
| Rückblick ≤ 6 s | ✓ geschätzt 5,8–5,9 s (Regie muss nach TTS messen) | s. o. |
| Neuer Zuschauer kennt bei 14 s Projekt + heutigen Schritt | ✓ ca. 12,5 s | script.txt:1–3 |
| Schritt-Kette: Start beim Ergebnis von Folge 4, genau ein Schritt | ✓ Folge 4 endet mit „Was verlangt die Konkurrenz für bestickte Shirts?“, Folge 5 beginnt mit „Heute vergleicht sie Konkurrenzpreise.“ | tag4 script.txt:9 → script.txt:3 |
| Warum mit 2–3 konkreten Gründen | ✓ 2 Gründe mit Zahl („Fünf Anbieter“, „erst ab fünf“) | script.txt:7–8 |
| Keine Ansprache außer CTA | ✓ („Plus, Research an, Ergebnis anhängen. Frage: …“ ohne Du, wie in Folge 4 akzeptiert; „dir/du/deine“ nur in script.txt:11 = CTA) | |
| 110–135 Wörter | ✓ 135 | |
| Echter claude.ai-Lauf, Zahlen 1:1 | ✓ | LAUF.md:2, 12, 17 |
| Kein Geld erfunden, kein Umsatz-Zähler | ✓ | hooks.md:9 |
| Versprechen lieferbar | ✓ Frage + Preistabelle stehen in prompt-fuer-kommentare.md; 7 min 19 s Lauf → „zehn Minuten“ ehrlich | |
| Caption: Fiktiv-Hinweis, danach nur Hashtags, keine Emojis, kein „KI-Mitarbeiter“ | ✓ (Zeichen > U+FFFF: keine in allen vier Textdateien) | caption.txt:16–18 |
| Erwähnung, dass niemand kommentiert hat | ✓ keine | |

## Faktenabgleich gesprochen ↔ Lauf (1:1)
| Satz | Beleg | Ergebnis |
|---|---|---|
| „Zuletzt nahm sie Stick, bis fünfundneunzig Grad.“ | tag4 script.txt:5–6 („nimmt Stickerei“, „Stick bis fünfundneunzig Grad“) | ✓ |
| „Claude prüft zweihundertfünfundneunzig Quellen.“ | LAUF.md:12 | ✓ |
| „Am günstigsten: rund hundertzehn Euro.“ | LAUF.md:17 (109,95 / 110,85 € brutto inkl. Einrichtung und Versand) | ✓ |
| „Die KI hält beim Preis mit und setzt auf einzelne Nachbestellungen ohne neue Einrichtung.“ | bericht.md:64 | ✓ (60-°C-Textil und uneingeschränktes Logo aus der Empfehlung fehlen gesprochen, s. Ticket R2-1) |
| „Fünf Anbieter nehmen fünf Stück nicht an.“ | bericht.md:7, 58, 39–41 | ✓ (genau: „beim Erstauftrag“; stickbetrieb.de nimmt Nachbestellungen unter 10. Gesprochen vertretbar, weil die Frage „fünf Shirts“ = Erstauftrag war) |
| „Selbst der günstigste Workwear-Shop stickt kein einzelnes Shirt, erst ab fünf.“ | bericht.md:14, 26; a61 (126,40 €), Kansas/Strauss teurer | ✓ |
| „Haken: Fast alle Summen sind Untergrenzen, von Claude addiert.“ | bericht.md:45, LAUF.md:19 | ✓ |
| „Als Nächstes: Welcher Partner stickt Einzelstücke ohne neue Einrichtung?“ | bericht.md:27, 32, 40; firma-tag6 LAUF.md:19–20, 32, 142 | ✗ s. Ticket R2-1 |

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 8 | Feste Eröffnung (script.txt:1) |
| Mehrwert: nachbaubar, Beginn ≤ 14 s | 8 | Weg ab ca. 12,6 s (script.txt:4), Caption-Schritte 1–3 mit belegtem Menüpfad (thema.md:10–11) |
| Thema: Schmerz bekannt, Ergebnis in einem Bild | 8 | „Bin ich zu teuer?“ kennt jeder Betrieb; Preiswand + „ERST AB“-Stempel |
| Hook (Satz 2 + Frame 1) | **7** | Satz 2 jetzt kurz und korrekt ✓. Frame 1 (hooks.md:9, thema.md:5, 46): Beschriftung „5 bestickte Shirts: rund 110 € … 151 €“ liest sich als Marktspanne mit Obergrenze 151 €. Laut Lauf geht es bis „über 200 €“ (LAUF.md:17; Strauss ≥ 168,44 € brutto ohne Textil, bericht.md:30), und genau so steht es in Caption (caption.txt:10) und Guide (prompt-fuer-kommentare.md:16). Bild und Text widersprechen sich → Ticket R2-2 |
| Warum (2–3 konkrete Gründe mit Zahl) | 8 | script.txt:7–8, beide Gründe tragen „einzelne Nachbestellungen“; der Preis-Teil wird von „rund hundertzehn Euro“ (script.txt:5) getragen |
| Faktentreue Skript | 8 | Alle gesprochenen Zahlen und Aussagen 1:1 belegt (Tabelle oben). Abzug nur für die Übergabefrage |
| Kommentar-Mechanik (Nutzen, Datei fertig) | 9 | Vorlage mit Platzhaltern, 4 Berufsbeispiele, „Kennzeichne, welche Summen du selbst zusammengerechnet hast“, echtes Ergebnis mit allen Einschränkungen (prompt-fuer-kommentare.md:7–20) |
| Länge 110–135 / 40–48 s | 8 | 135 W, ca. 45–47 s, Rückblick ca. 5,8–5,9 s. Kein Puffer mehr nach oben |
| Schritt-Kette / Anschluss / Übergabe | **7** | Anschluss an Folge 4 ✓. Übergabe ✗: (1) Die Frage beantwortet die eigene Tabelle schon (Jochems, stickbetrieb.de, Spreadshirt), das Soll R1-1(c) ist also nicht erfüllt. (2) Der echte Lauf 6 entscheidet über **60 Grad**: „Alle drei Punkte … bietet nur A61“, „einziger belegter Partner mit 60-°C-Workwear“, und bei A61 ist ausgerechnet das Stickprogramm „n. g.“ (tag6 LAUF.md:19, 32, 142). Auf die gesprochene Frage „ohne neue Einrichtung“ ist A61 deshalb keine Antwort. Printful wäre eine, ist aber nur zweite Wahl (tag6 LAUF.md:20). Mit „sechzig Grad“ in der Frage schließt Folge 6 sauber an, und Lauf 5 beantwortet die Frage nicht (workwear one 60 °C, aber ab 5; a61/Flyeralarm 60 °C, Einrichtung n. g.) |
| Caption | 8 | Fakten korrekt, Untergrenzen, Spreadshirt-Unsicherheit, „Fünf Anbieter … als Erstauftrag“, „14 Anbieter laut Claude“. Die „Offen bleibt“-Zeile (caption.txt:14) muss an Ticket R2-1 angepasst werden. Du-Form „So machst du das“ wie in Folge 3/4 akzeptiert |
| Pflicht-Ausgaben vollständig | 8 | Alle 5 Dateien da. Kleine Fehler: thema.md:30 und :34 behaupten, die Caption enthalte 60-°C-Arbeitsshirt, Logo ohne Farbgrenze und Grund 3. caption.txt enthält davon nichts (kein „60“, keine 3 Farben, kein 9 × 9 cm). Grund 3 mit Zahlen fehlt auch im Guide, dort steht nur die Lücken-Zeile (prompt-fuer-kommentare.md:18). thema.md:58 zitiert noch „Viele Summen“ |

## Tickets

```
TICKET autor-R2-1 → firma-autor
Kriterium: Schritt-Kette / Übergabe · Note: 7/10
Beleg: script.txt:10, caption.txt:14, thema.md:24, 37–38 gegen bericht.md:27, 32, 40 (Jochems ab 1 Stk + Stickprogramm nur beim Erstauftrag; stickbetrieb.de Nachbestellung unter 10 + Stickprogramm entfällt; Spreadshirt keine Mindestmenge, Stickdatei 0 €) und firma-tag6/design/lauf/LAUF.md:19, 20, 32, 142 (Entscheidung A61 = einziger belegter 60-°C-Partner, Stickprogramm n. g.; „keine neue Einrichtung“ belegt nur Printful = zweite Wahl)
Problem: Die Übergabefrage „Welcher Partner stickt Einzelstücke ohne neue Einrichtung?“ beantwortet die eigene Preistabelle schon (Soll R1-1(c) nicht erfüllt), und der echte Lauf von Folge 6 entscheidet nach 60 Grad, nicht nach der Einrichtung.
Soll: Die gesprochene Übergabe ist eine Frage, die Lauf 5 nicht beantwortet und auf die Lauf 6 antwortet, bei gleicher Wortzahl (135), z. B. „Als Nächstes: Welcher Partner stickt Sechzig-Grad-Shirts einzeln, ohne neue Einrichtung?“. Die „Offen bleibt“-Zeile in caption.txt:14 sagt dasselbe (gern mit „und zu welchem Einkaufspreis“). In thema.md:24 und 37–38 steht der neue Wortlaut mit Beleg aus tag6 LAUF.md, dazu ein Stand-Satz-Vorschlag für Folge 6 (≤ 11 Silben, ohne „gestern“, ohne „nicht der Preis“). thema.md:30/34 behaupten nichts mehr, was nicht in der Caption steht: entweder einen kurzen Satz zu 60 °C und Logo-Grenze (Spreadshirt höchstens 3 Farben, Shirtigo höchstens 9 × 9 cm, bericht.md:62) in die Caption aufnehmen oder „(Caption)“ streichen. „Sechzig-Grad-Shirts“ kommt in die TTS-Testliste.
```

```
TICKET autor-R2-2 → firma-autor
Kriterium: Hook Frame 1 · Note: 7/10
Beleg: hooks.md:9, thema.md:5, 46 („rund 110 € … 151 €“) gegen LAUF.md:17 („150 € bis über 200 €“), bericht.md:30–31, caption.txt:10, prompt-fuer-kommentare.md:16
Problem: Die Frame-1-Beschriftung zeigt 151 € als obere Grenze, Lauf, Caption und Guide sagen „150 bis über 200 Euro“. Das Bild unterschlägt also die teure Hälfte des Markts.
Soll: Frame 1 und die Preiswand nennen keine Obergrenze, die der Lauf widerlegt. Entweder „ab rund 110 €“ (grün) plus die fünf „ERST AB“-Stempel, oder die 151 € mit dem Zusatz „… bis über 200 €“. Den Zusatz nicht als 208-€-Schild von Stick-Manufaktur zeigen, sonst gilt Ticket R1-3 wieder. hooks.md und thema.md sagen dasselbe.
```

## Hinweise (nicht blockierend)
1. **Chef / Folge 6:** Der Prompt von Lauf 6 zitiert als Ergebnis von Folge 5 noch die alte Formulierung aus Runde 1: „Die Lücke ist nicht der Preis, sondern …“ (tag6 LAUF.md:9). Gesprochen heißt es jetzt „hält beim Preis mit“. Der Rückblick-Satz 2 von Folge 6 darf „nicht der Preis“ nicht übernehmen. Der Lauf selbst bleibt gültig, weil der Prompt den Gleichstand nicht bestreitet („ab etwa 110 Euro“).
2. **Regie:** Der Rückblick hat nur ca. 0,1 s Puffer. Nach dem Komma in „Stick,“ höchstens eine kurze Pause, zwischen Satz 1 und 2 wie in Folge 4 ≤ 0,1 s. Wenn die Messung nach TTS über 6,0 s liegt, ist „Zuletzt: Stick, bis fünfundneunzig Grad.“ (9 Silben) die Ausweichvariante, ohne neue Fakten.
3. **Länge:** Mit 135 Wörtern ist kein Puffer mehr da. Bei Ticket R2-1 darf die Wortzahl nicht steigen.
