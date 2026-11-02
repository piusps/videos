# Prüfung Autor · Folge 5 „Konkurrenz“ · Runde 1 (frischer Prüfer, 2026-10-28)

Geprüft: `script.txt`, `caption.txt`, `thema.md`, `hooks.md`, `prompt-fuer-kommentare.md` gegen `../firma-tag4/tagesbriefing-2026-10-29.md` (inkl. Chef-Entscheide), `briefing.md`, `design/lauf/LAUF.md`, `design/lauf/bericht.md`, `../firma-tag4/script.txt`, `../firma-tag4/pruefung/autor-runde1.md` + `-runde2.md`, `../firma-tag4/regie/words.json` (echte Wortzeiten Folge 4 zur Kalibrierung), `bewertung.md` Abschnitt „autor“.

**Gesamturteil: nicht bestanden.** Ein K.-o.-Punkt (Rückblick nach Messwerten von Folge 4 ca. 6,7 s statt ≤ 6 s) und vier Kriterien unter 8. Der inhaltliche Kern ist schief: Die gesprochene Lücke „Nachbestellen ab einem Shirt“ gibt es laut eigener Tabelle schon bei mehreren Anbietern (und Folge 4 hat selbst gesagt „Stick geht ab einem Stück“). Das eigentliche Unterscheidungsmerkmal laut Bericht, „ohne erneute Einrichtung“, fehlt im Skript. Dazu ist „Sechs Anbieter“ in der mitgelieferten Tabelle nicht nachzählbar (dort stehen fünf).

## Sprechdauer (kalibriert an der echten STT von Folge 4, `firma-tag4/regie/words.json`)
- Folge 4: 133 W = 40,6 s. Folge 5: 130 W (`wc -w`), also ca. 40–42 s ✓.
- Folge 4 Rückblick echt: Satz 1 „Die Firma … Bestellung.“ 5,73–9,60 s = **3,87 s** (25 Silben). Satz 2 „Gestern lernte sie: Der Bau wäscht mit 60 Grad.“ 9,69–11,76 s = **2,07 s** (12 Silben). Rückblick gesamt **6,03 s**, also schon in Folge 4 auf der Grenze.
- Folge 5: Satz 1 hat ebenfalls 25 Silben („bestickt“ = „gedruckt“) → ca. 3,87 s. Satz 2 „Zuletzt fand sie: Stick ist bis fünfundneunzig Grad freigegeben.“ hat **16 Silben** → bei gleichem Tempo ca. 2,75 s. Rückblick gesamt **ca. 6,7 s** ✗. thema.md:54 schätzt 5,8 s, hooks.md:14 „ca. 2,1 s“ für Satz 2. Beides ist zu optimistisch. Die Lehre aus dem Tagesbriefing (Z. 41: Satz 2 ≤ 2,5 s) ist nicht eingehalten.
- „Heute …“ beginnt bei ca. 11,6 s und endet bei ca. 13,5 s ✓ (vor 14 s).

## K.-o.-Check
| Regel | Ergebnis | Beleg |
|---|---|---|
| Eröffnung wörtlich, ohne „Tag zwei.“ | ✓ | script.txt:1 |
| Kein Tag, kein Hochzählen, kein „gestern“ in Skript/Caption/Cover | ✓ (grep: keine Treffer in script/caption; hooks.md nur „HUD-Badge TAG 2 ok“) | script.txt, caption.txt, hooks.md:3 |
| Rückblick Satz 1 wörtlich „… bestickt erst auf Bestellung.“ | ✓ | script.txt:2, tagesbriefing:48 |
| Rückblick ≤ 6 s | **✗ ca. 6,7 s** (Satz 2 16 Silben, siehe oben) | script.txt:2, firma-tag4/regie/words.json |
| „Heute …“ als Satz vor 14 s | ✓ (ca. 11,6 s) | script.txt:3 |
| Schritt-Kette (Start bei Folge-4-Ergebnis, ein Schritt) | ✓ formal; inhaltlich Widerspruch zu Folge 4, siehe Ticket 1 | tag4 script.txt:9 → script.txt:3 |
| Keine direkte Ansprache / kein Imperativ außer CTA | ✓ („Frage: …“, Infinitive „Research an, Ergebnis anhängen“ wie Folge 4 R2 akzeptiert) | script.txt:4, 11 |
| Warum mit 2–3 Gründen mit Zahl | ✓ formal (2 Gründe: „Sechs“, „ab fünf“); inhaltlich tragen sie die Entscheidung nicht (Ticket 1) | script.txt:7–8 |
| 110–135 Wörter | ✓ 130 | |
| Echter claude.ai-Lauf | ✓ | LAUF.md:2, 12 |
| Kein Geld erfunden, kein Umsatz | ✓ | |
| Versprechen lieferbar | ✓ mit Einschränkung (Tabelle hat 18 Namen, Caption verspricht „aller 14“, Ticket 4) | script.txt:11, caption.txt:12 |
| Caption-Ende Fiktiv-Hinweis, dann nur Hashtags; keine Emojis; Superkind leise | ✓ (4-Byte-Suche: keine Treffer) | caption.txt:16–18 |

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 8 | Feste Eröffnung trägt (script.txt:1) |
| Mehrwert: nachbaubar, Beginn ≤ 14 s | 8 | Weg = LAUF.md:3. „Plus, Research an“ ab ca. 13,7 s |
| Thema: Schmerz bekannt, Ergebnis in einem Bild | 8 | „Bin ich zu teuer?“ kennt jeder; Preiswand ist ein Bild. Der Dreh (Lücke) ist aber unklar (Ticket 1) |
| Hook (Satz 2 + Frame 1) | 6 | Satz 2 zu lang (K.-o., Ticket 2). Frame 1 (hooks.md:9): „208 €“ ist Stick-Manufaktur **zzgl. Versand** (bericht.md:31), die gestellte Frage war „inkl. Versand“; derselbe Anbieter hat laut Tabelle eine widersprüchliche Mindestmenge „Starting at 15 pieces“, steckt also vermutlich auch in den „sechs ERST AB“-Schildern. Das Bild zählt ihn dann doppelt (Ticket 3) |
| Warum (2–3 konkrete Gründe mit Zahl) | 6 | Grund 2 „Selbst der günstigste Workwear-Shop stickt erst ab fünf Stück“ (script.txt:8): Gefragt waren fünf Shirts, also hört der Zuschauer „geht doch“. Dass ein **einzelnes** Shirt dort nicht geht (bericht.md:14), wird nicht gesagt. Grund 1 betrifft den Erstauftrag, nicht das Nachbestellen. Keiner der Gründe trägt „ohne neue Einrichtung“, das laut Bericht der Kern ist |
| Faktentreue Skript (1:1 aus Lauf) | 5 | ✓ 295 Quellen (LAUF.md:12). ✓ „rund hundertzehn Euro“ = 5 Shirts gesamt, brutto, inkl. Einrichtung und Versand (LAUF.md:17; Untergrenze, Spreadshirt-Stick „n. g.“, workwear one mit Aktionscode, ohne Aktion 115,61 €). Für den gesprochenen Satz ok, weil er auf „Was kosten fünf …?“ folgt und der Haken Untergrenzen nennen soll. ✗ **„Die KI setzt aufs Nachbestellen ab einem Shirt, nicht auf den Preis.“** (script.txt:6): Ab 1 Stück sticken laut Tabelle schon Spreadshirt („keine“), a61 („ab 1 Stück“), ShirtStore („ab dem ersten Stück“), Jochems, Flyeralarm (bericht.md:27–36), und Folge 4 sagte selbst „Stick geht ab einem Stück“ (tag4 script.txt:7). Die Empfehlung lautet „Paketpreis … unter ca. 110 € … damit **Gleichstand** … Dazu eine garantierte Nachbestellung ab 1 Stück **ohne erneute Einrichtung**, ein 60-°C-Textil …“ (bericht.md:64). „nicht auf den Preis“ verschweigt den Gleichstand, „ab einem Shirt“ ohne „ohne Einrichtung“ ist keine Lücke. ✗ **„Sechs Anbieter nehmen fünf Stück nicht an.“** (script.txt:7): Claude sagt „Sechs“ (LAUF.md:17, bericht.md:3), zählt aber in TL;DR und Grund 1 selbst nur **fünf** auf: Workline 20, Stoiber 15, Shirtlabor 30, stickbetrieb.de 10, CUVIO 10 (bericht.md:7, 58; Tabelle Z. 39–41 „nicht möglich“). Ein sechster ist nur Stick-Manufaktur mit **widersprüchlicher** Angabe, und deren Preis für 5 Stück (208,55 €) nutzen wir zugleich als Preisobergrenze. Wer die versprochene Tabelle bekommt, zählt fünf. ✓ „Selbst der günstigste Workwear-Shop stickt erst ab fünf Stück“: workwear one „Mit Logo ab 5 Stück“ (bericht.md:14, 26), billigster Workwear-Shop (Kansas/Strauss teurer) ✓, aber ohne die Folge für ein einzelnes Shirt nichtssagend. ✗ **„Haken: Viele Summen hat Claude selbst addiert.“** (script.txt:9): untertrieben und ohne Folge. Selbst die beiden „günstigsten“ sind „Berechnung“ (bericht.md:26–27), vollständige Anbieterangabe ist nur Stick-Manufaktur. Das Problem ist nicht das Addieren, sondern „‚ab‘-Preise, also Untergrenzen“ (LAUF.md:19, bericht.md:45). Rückblick „Stick ist bis fünfundneunzig Grad freigegeben“ ✓ (Folge 4: „beim selben Anbieter“, Haken „Anbieterangaben“; „freigegeben“ ist vertretbar) |
| Kommentar-Mechanik (Nutzen, Datei fertig) | 8 | Prompt-Vorlage mit Platzhaltern, 4 Berufsbeispiele, Kennzeichnung selbst addierter Summen (prompt-fuer-kommentare.md:7–13) ✓. Mängel: Z. 19 nennt ShirtStore-58,59 € ohne den Selbstwiderspruch (bericht.md:48, 44 € „bei jedem Auftrag“ gegen „35 € einmalig“). thema.md:27 behauptet „mit Einschränkung“, das stimmt nicht (Ticket 4) |
| Länge 110–135 / 40–48 s | 8 | 130 W, ca. 40–42 s ✓; Rückblick-Teil s. K.-o. |
| Schritt-Kette / Anschluss / Übergabe | 7 | Start bei Folge-4-Frage ✓, ein Schritt ✓, „Zuletzt“ statt „gestern“ ✓. Aber: Lücke „ab einem Shirt“ widerspricht Folge 4 („Stick geht ab einem Stück“). Übergabe „Welcher Partner stickt ab einem Stück?“ (script.txt:10) ist laut eigener Tabelle schon beantwortet (a61, Flyeralarm, Jochems, ShirtStore …). Offen ist laut LAUF.md:115 „ob der eigene Partner das unter 110 € und unter 10 Werktagen schafft“, laut briefing.md:17 „für Wiederverkäufer“, laut Bericht „ohne erneute Einrichtung“ |
| Caption | 7 | Gut: brutto/inkl. Einrichtung und Versand, „ohne neue Einrichtung“, „Untergrenzen“, Spreadshirt-Unsicherheit (caption.txt:10), Menüpfad mit Quelle (thema.md:10–11). Mängel: „Sechs Anbieter“ (s. o.); „Preistabelle aller 14 Anbieter“ (caption.txt:12): Die Tabelle nennt 18 Namen in 16 Zeilen, Printerado „in dieser Recherche nicht geprüft“ (bericht.md:38). „Die meisten Summen“ (caption) gegen „Viele“ (Skript): uneinheitlich. Du-Form „So machst du das“ wie Folge 3/4 akzeptiert, nur Hinweis |
| Pflicht-Ausgaben vollständig | 9 | Alle 5 Dateien da, thema.md mit Faktentabelle, Quellen, Grund-Karten, TTS-Liste. Abzug: Zeitschätzung thema.md:54 und Aussage thema.md:27 falsch |

## Tickets

```
TICKET autor-R1-1 → firma-autor
Kriterium: Faktentreue Skript / Warum / Schritt-Kette · Note: 5/10
Beleg: script.txt:6–8 gegen bericht.md:14, 26–36, 56, 58, 64 und firma-tag4/script.txt:7
Problem: Die gesprochene Entscheidung „Nachbestellen ab einem Shirt, nicht auf den Preis“ ist keine Lücke (Spreadshirt, a61, ShirtStore, Jochems, Flyeralarm sticken laut Tabelle ab 1, Folge 4 sagte „Stick geht ab einem Stück“), verschweigt den empfohlenen Preis-Gleichstand (~110 €) und lässt den eigentlichen Unterschied „ohne erneute Einrichtung“ weg; Grund 2 sagt nicht, dass ein einzelnes Shirt dort nicht geht.
Soll: (a) Der Entscheidungssatz enthält „ohne (neue) Einrichtung“ und widerspricht dem Gleichstand nicht (kein nacktes „nicht auf den Preis“), z. B. „Die KI hält beim Preis mit und setzt auf einzelne Nachbestellungen ohne Einrichtung.“ (b) Grund 2 nennt das Einzelstück ausdrücklich, z. B. „Selbst der günstigste Workwear-Shop stickt kein einzelnes Shirt, erst ab fünf.“ (c) Übergabe ist eine Frage, die der Lauf NICHT schon beantwortet, z. B. „Als Nächstes: Welcher Partner stickt Einzelstücke ohne neue Einrichtung?“ (oder mit Einkaufspreis). thema.md-Faktentabelle und Regie-Hinweise (thema.md:20, 22, 41–44) entsprechend nachziehen.
```

```
TICKET autor-R1-2 → firma-autor
Kriterium: K.-o. Rückblick ≤ 6 s / Hook Satz 2 · Note: 6/10
Beleg: script.txt:2; firma-tag4/regie/words.json (Satz 1 = 3,87 s, 12-Silben-Satz-2 = 2,07 s, Rückblick 6,03 s); thema.md:54, hooks.md:14
Problem: Satz 2 hat 16 Silben (≈ 2,75 s), der Rückblick landet bei ca. 6,7 s; die Schätzung 5,8 s in thema.md ist nicht kalibriert.
Soll: Satz 2 hat höchstens 11 Silben (Ziel ≤ 1,9 s, Rückblick ≤ 5,9 s nach Folge-4-Tempo), nennt weiter das Ergebnis der Vorfolge ohne „gestern“, z. B. „Zuletzt wählte sie Stick, bis fünfundneunzig Grad.“ thema.md/hooks.md enthalten die kalibrierte Schätzung mit Verweis auf words.json Folge 4. Regie misst nach TTS; > 6,0 s → zurück an Autor.
```

```
TICKET autor-R1-3 → firma-autor
Kriterium: Faktentreue Zahl „Sechs“ / Hook Frame 1 · Note: 6/10
Beleg: script.txt:7, caption.txt:10, hooks.md:9, thema.md:32, 42, 46 gegen bericht.md:3, 7, 31, 39–41, 50, 58
Problem: Die gelieferte Tabelle weist nur fünf Anbieter aus, die 5 Stück nicht annehmen (Workline 20, Stoiber 15, Shirtlabor 30, stickbetrieb.de 10, CUVIO 10); der mögliche sechste (Stick-Manufaktur, widersprüchlich „Starting at 15 pieces“ / Preistabelle ab 1) liefert gleichzeitig die 208 € im Frame 1, die zudem „zzgl. Versand“ sind.
Soll: Gesprochene Zahl, Caption und Anzahl der „ERST AB“-Schilder sind in der gelieferten Tabelle nachzählbar und kein Anbieter steht zugleich als Preis und als Ablehnung im Bild. Variante A: „Warum? Fünf Anbieter nehmen fünf Stück nicht an.“ + fünf Stempel (10, 10, 15, 20, 30). Variante B: bei „Sechs“ (Claude-Wortlaut) nennt thema.md den sechsten mit Beleg, und Frame 1 zeigt 208 € nicht oder als „208 € + Versand, Mindestmenge unklar“. Screenshot mit „Sechs Anbieter …“ dann nicht unter einer gesprochenen „Fünf“ zeigen.
```

```
TICKET autor-R1-4 → firma-autor
Kriterium: Faktentreue Haken / Kommentar-Mechanik / Caption · Note: 7/10
Beleg: script.txt:9; caption.txt:10, 12; prompt-fuer-kommentare.md:3, 19; thema.md:27; bericht.md:26–27, 38, 45, 48
Problem: „Viele Summen hat Claude selbst addiert“ ist untertrieben (auch beide „günstigsten“ sind Berechnung) und nennt nicht die Folge (Untergrenzen); „Preistabelle aller 14 Anbieter“ passt nicht zur Tabelle (18 Namen, Printerado nicht geprüft); der Guide nennt ShirtStore-58,59 € ohne den Selbstwiderspruch, obwohl thema.md:27 „mit Einschränkung“ behauptet.
Soll: (a) Haken nennt Menge und Folge, z. B. „Haken: Fast alle Summen sind Untergrenzen, von Claude addiert.“ (Skript und Caption gleichlautend „fast alle/die meisten“). (b) Caption/Guide sagen „die Preistabelle aus dem Lauf“ oder „14 Anbieter laut Claude“, nicht „aller 14“. (c) prompt-fuer-kommentare.md:19 ergänzt „(ShirtStore widerspricht sich: auf der Polo-Seite 35 € einmalig)“ oder streicht das Beispiel.
```

## Vorschlag Skript (134 Wörter, deckt Tickets 1–4 ab, Rückblick-Satz 1 unverändert)
```
Wie viel Umsatz macht ein Unternehmen, das eine KI hundert Tage lang ganz alleine führt? Ich probier das aus.
Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, bestickt erst auf Bestellung. Zuletzt wählte sie Stick, bis fünfundneunzig Grad.
Heute vergleicht sie Konkurrenzpreise.
Plus, Research an, Ergebnis anhängen. Frage: Was kosten fünf bestickte Shirts?
Claude prüft zweihundertfünfundneunzig Quellen. Am günstigsten: rund hundertzehn Euro.
Die KI hält beim Preis mit und setzt auf einzelne Nachbestellungen ohne Einrichtung.
Warum? Fünf Anbieter nehmen fünf Stück nicht an.
Selbst der günstigste Workwear-Shop stickt kein einzelnes Shirt, erst ab fünf.
Haken: Fast alle Summen sind Untergrenzen, von Claude addiert.
Als Nächstes: Welcher Partner stickt Einzelstücke ohne neue Einrichtung?
Kommentiere „Konkurrenz“, und ich schick dir die Frage und die Preistabelle. Damit hast du in zehn Minuten deine Konkurrenzpreise.
```
TTS-Test zusätzlich: „Einzelstücke“, „Untergrenzen“, „Nachbestellungen“, „Stick“ (deutsch).

## Hinweise (nicht blockierend)
1. Chef/Regie: Schon Folge 4 lag beim Rückblick echt bei 6,03 s (words.json 5,73–11,76). Die Pause zwischen Satz 1 und 2 gering halten.
2. Caption: „bei teureren Anbietern 150 bis über 200 Euro“ ist Claude-Wortlaut, a61 (126,40 €) liegt dazwischen. Ok, aber „über 200“ = zzgl. Versand und Mindestmenge unklar.
3. Folge 6 (Chef): Der Stand-Satz-Vorschlag thema.md:38 „Zuletzt fand sie ihre Lücke: Nachbestellen ab einem Shirt.“ übernimmt den Fehler aus Ticket 1. Besser „… einzelne Nachbestellungen ohne Einrichtung.“
