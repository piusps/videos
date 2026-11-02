# Echter claude.ai-Lauf Folge 18 (Was zahlt sie für das gestickte Shirt?), 2026-10-31, 16:17:44–16:19:39 (MEZ)
Chat: https://claude.ai/chat/682aa15b-671f-4950-bf7d-f12e541e6bbf (T3-Preview-Profil "Chrome", eigener neuer Tab im Hintergrund, kein fremder Tab offen/angefasst; Organisation = Pius' eigene Pro-Organisation 77f569ac…, Cookie lastActiveOrg vor dem Senden geprüft, stand bereits richtig), Modell Opus 5.5 Mittel (Composer "Opus 5.5 Mittel", Chat-API model claude-opus-5-5, effort_level "medium")
Chat-Titel (von claude.ai vergeben): "Printful-Kosten für bestickte Shirts"
Weg: neuer Tab (claude.ai/new, Composer leer) -> Plus-Menü geprüft -> Gedächtnis für diesen Chat aus -> 1 Datei angehängt (verstecktes input[type=file], DataTransfer; Datei per lokalem Server 127.0.0.1:47818 in den Tab) -> Prompt per Paste (vor dem Senden 1:1 mit prompt.txt verglichen: identisch, 761 Zeichen) -> "Nachricht senden". KEIN Research ("Recherche" aria-checked=false, vor dem Senden erneut gelesen). Websuche in den Chat-Einstellungen an (Konto-Standard, settings.enabled_web_search = true), Claude hat gesucht.
**Gedächtnis: für diesen Chat AUS.** "Gedächtnis" im Plus-Menü stand auf an, einmal geklickt, erneut gelesen: aria-checked=false (direkt vor dem Senden noch einmal: false). Chat-API: settings.chat_memory_mode = "disabled". /api/account vorher und nachher gesichert: byte-identisch (cmp + SHA-256 im Tab).
**Konnektoren:** nichts angefasst. Im Protokoll **kein Konnektor-Aufruf**, kein Dialog, keine Freigabe-Abfrage (DOM während des Laufs geprüft).
Nichts verbunden, gekauft, angemeldet, geteilt, versendet. **Kein Printful-Konto**, kein Printful-Login. Am Composer "Manuell". Login/Geld verlangt: nein. Rückfragen: keine.
Anhang (liegt hier): `Anhang_Kolonnenshirt_Serienbriefe_Lauf17.docx` (37885 Byte, Claudes Datei aus Lauf 17 unverändert, mit Versandzeile), hochgeladen als `Kolonnenshirt_Serienbriefe.docx`. Karte "Kolonnenshirt_Serienbriefe.docx · DOCX".

## Prompt (wörtlich, auch prompt.txt)
Im Anhang sind meine fünf Serienbriefe aus dem letzten Schritt, mit der Versandzeile. Mein Angebot: 109 Euro brutto für fünf Shirts, 29,90 Euro für ein nachbestelltes Einzelshirt, Firmenlogo auf der Brust gestickt, erst auf Bestellung über Printful, Kunden in Deutschland. Finde mit der Websuche heraus, was mich ein besticktes Shirt bei Printful im Einkauf kostet: Grundpreis des Shirts, Preis für den Stick und eine mögliche Gebühr fürs Digitalisieren des Logos, jeweils mit Quelle. Rechne dann mit dem Versand aus meinem Brief aus, was von 109 Euro für fünf Shirts und von 29,90 Euro für ein Einzelshirt übrig bleibt. Sag mir, ob die Preise so bleiben können, mit zwei bis drei Gründen. Sag mir, was du ohne Printful-Konto nicht sehen kannst. Erfinde nichts.

## Ergebnis
Dauer: **1 min 55 s** (gesendet 16:17:44, Antwort fertig 16:19:39; Chat-API). Im Video: „knapp zwei Minuten“.
Werkzeuge laut Chat-API: 1 Read (Briefe), **5 Websuchen** („Printful embroidery pricing digitization fee“ | „Printful embroidered t-shirt price EUR“ | „Printful besticktes T-Shirt Stanley/Stella Creator Stickerei Preis €“ | „Printful Versandkosten Deutschland T-Shirt erstes Produkt zusätzliches“ | „printful.com embroidered t-shirt Stanley/Stella Creator 2.0 price“ (nur printful.com)), **3 Seitenabrufe** (printful.com/de/custom/mens/embroidered-shirts → abgelehnt „URL not in prior search“; ecom-tools.de/printful; printful.com STTU169-Produktseite). Keine Datei erzeugt, kein Bash, kein Konnektor. UI-Zeile: „Das Web durchsucht, 3 Seiten gelesen, eine Datei gelesen“.
Erster Satz: „Ich lese zuerst die Versandzeile aus deinen Briefen und suche dann die Printful-Preise.“

**Kernsatz Chat (wörtlich):** „Kurz vorweg: Den Einkaufspreis des bestickten Shirts in Euro habe ich bei Printful nicht öffentlich gefunden. Die Produktseiten laden den Preis erst im Browser bzw. im Konto. Deshalb kann ich dir nur eine Rechnung mit Platzhalter für den Shirtpreis geben, keine fertige Marge.“

**Gefunden (laut Claude):**
- Grundpreis: kein Euro-Preis. STTU169 nennt in den Seitendaten nur 14,25 USD, unklar ob Druck oder Stick, unklar ob EU-Fertigung. Testbericht (ecom-tools, Sept. 2026) nur für *bedruckte* Shirts: Bella+Canvas 3001 10,46 €, Stanley/Stella Crafter 9,54 € netto inkl. Druck.
- Stick: „Printful rechnet ihn nicht separat ab. Laut Printful ist im Produktpreis eine Stickerei in Standardgröße enthalten“; extra nur weitere Platzierung (2,95 €) oder große Stickerei (nach Stichzahl).
- Digitalisierung: „5,75 € einmalig pro neuem Motiv“ (Printful-Hilfe), auf das erste Produkt aufgeschlagen.
- Versand (Testbericht, nicht direkt Printful): 4,49 € erstes Shirt, +1,25 € je weiteres, netto; Erhöhung zum 27.08.2026 um 20–30 Cent.

**Rechnung (Claude, Annahme: USt-IdNr. hinterlegt, netto):** 5 Shirts: 91,60 € + 9,41 € Versand vom Kunden − 9,49 € Versand an Printful − 5,75 € Digitalisierung = **85,77 € für die Shirts** (Folgebestellung 91,52 €). Einzelshirt: 25,13 + 4,37 − 4,49 = **25,01 €**. „Damit gehst du bei der ersten 5er-Bestellung bei **17,15 € netto Printful-Preis pro Shirt** auf null. Bei einem Einzelshirt liegt diese Grenze bei 25,01 €.“ Tabelle mit **angenommenen** Shirtpreisen 12/14/16 € (ausdrücklich „Annahmen, keine gefundenen Werte“). Nicht abgezogen: Zahlungsgebühren, Retouren, Größenaufpreise, Zeit. Rechnung von mir nachgerechnet: stimmt.

**Entscheidung (Claude, wörtlich):** „Den Einzelpreis von 29,90 € halte ich für tragfähig. Den 5er für 109 € würde ich erst festlegen, wenn du den echten Stickpreis im Konto gesehen hast. Liegt er bei 14 € oder darüber, ist der 5er zu knapp.“
**Gründe (Claude):** (1) „Der Mengenrabatt frisst die Marge. Im 5er kostet ein Shirt 21,80 € statt 29,90 €. Bei 14 € Einkauf bleiben im ersten Auftrag gut 3 € pro Shirt, beim Einzelshirt rund 11 €.“ (2) „Deine Versandzeile deckt die aktuellen Tarife nicht ganz. Mit Steuer liegt Printfuls Versand bei etwa 5,34 € bzw. 11,29 €. Dein Brief nennt 5,20 € bzw. 11,20 €. … Ich würde die Zeile vor dem Versand der Briefe anpassen.“ (3) Nicht pauschal planbar: Aufpreis ab 2XL 1,30 € je Stufe, Retouren auf eigene Kosten.
**Ohne Printful-Konto nicht sichtbar (Claude, 4 Punkte):** Euro-Preis des bestickten Shirts (Modell/Farbe/Größen); Fertigungsort (Riga/Barcelona/USA) + Wechselkurs; ob das Logo in die Standardgröße passt oder nach Stichzahl abgerechnet wird; tatsächlicher Versand im Checkout + Steuersatz.
**Claudes Vorschlag:** „im kostenlosen Konto das Shirt mit deinem Logo anlegen und eine Testbestellung mit fünf Shirts an eine deutsche Adresse bis zur Kasse durchklicken“ → **Menschen-Schritt (Login/Konto = Pius), nicht gemacht, nicht erzählen als erledigt.**
Quellen (7): help.printful.com (Digitization fees, /jp/-Pfad), printful.com/pricing, printful.com/printful-pro, printful.com/de/printful-plus, printful.com STTU169, printful.com/custom/product/662, ecom-tools.de/printful.
**Kein „Als Nächstes“ im Chat.** Offene Punkte aus dem Lauf: (a) echter Stickpreis nur im Printful-Konto (Pius), (b) Versandzeile im Brief um Cents zu niedrig, Claude empfiehlt Anpassung (ohne Login machbar). Übergabe-Vorschlag Folge 19: „Als Nächstes: Stimmt die Versandzeile?“ (Chef entscheidet; Alternative Printful-Konto braucht Pius).

## Gegenprüfung (von mir, 2026-10-31 ~16:25, WebFetch, nicht im Chat)
- printful.com/pricing: „One standard-size embroidery design (placement of your choice)“ im Produktpreis ✓; „Digitization fee – $2.95-$6.50 per design (one-time)“; „$2.95 per additional placement“; große Stickerei nach Stichzahl.
- printful.com/de/printful-plus: „Ein Stickereimotiv (Standardgröße, Platzierung frei wählbar)“ im Produktpreis ✓; Digitalisierung „einmalige Gebühr von 2,95 € - 6,50 € pro Design“, auf das erste Produkt aufgeschlagen.
- **5,75 € nicht bestätigt:** Die von Claude genannte Hilfeseite liefert mir 403 (en und jp). Belegt ist nur die Spanne 2,95–6,50 €. Schwelle „17,15 €“ hängt daran: mit 2,95 € → 17,71 €, mit 6,50 € → 17,00 €. **Gesprochen daher nur „siebzehn Euro“ (gerundet), nie „5,75“.**
- ecom-tools.de/printful (Stand 09.09.2026): Bella+Canvas 3001 10,46 €, Crafter 9,54 € (bedruckt, netto) ✓; Versand 4,49 € + 1,25 € ✓; Erhöhung 27.08.2026 um 20–30 Cent ✓; 2XL +1,30 € je Stufe ✓; ohne USt-IdNr. +19 % ✓. Kein Stickpreis.
- Claudes Satz „Als Kleinunternehmer kommt im Ergebnis netto praktisch dasselbe heraus“ ist zweifelhaft (Kleinunternehmer zahlen Printfuls 19 % ohne Vorsteuerabzug, verkaufen ohne USt-Ausweis) → nicht sprechen, nicht in den Guide.
- 21,80 € = 109 € ÷ 5 ✓; 29,90 − 21,80 = 8,10 € („acht Euro billiger“) ✓.

## Auffälligkeiten (nur festgehalten)
- Erster WebFetch abgelehnt (URL nicht aus Suchergebnis); Claude hat danach gesucht und anders abgerufen.
- Claude bestätigt selbst die Lücke aus Lauf 17 (Briefbeträge 11,20/5,20 knapp unter 11,29/5,34) – deckt sich mit meiner Gegenprüfung aus Lauf 17.
- Leak-Check Klon: 0 × Pius/Niklas/Florent/boilr/Hamburg/Chemnitz; Begrüßung „Wieder am Start, Pius“ → „Wieder am Start“; „Superkind“ (Status-/aria-Texte) entfernt; nav/aside entfernt, „Weitere Optionen für …“-Labels entfernt. Chattext ohne Betriebsnamen/Adressen → keine -anonym-Fassungen nötig.

## Screenshots (echte claude.ai-Pixel, DOM-Klon ohne Sidebar, Dark Mode, headless Chrome 1280 px × 1,5, Chat-Spalte zugeschnitten)
| Bild | Inhalt | Video |
|---|---|---|
| 01-prompt-mit-anhang.png | Karte „Kolonnenshirt_Serienbriefe.docx · DOCX“ + Prompt vor dem Senden („Projekt“, „Opus 5.5 Mittel“, „Manuell“) | ok |
| 07-schritte-zeile.png | erster Satz + „Das Web durchsucht, 3 Seiten gelesen, eine Datei gelesen“ | ok |
| 02-kernsatz-kein-preis.png | „Kurz vorweg: Den Einkaufspreis des bestickten Shirts in Euro habe ich … nicht öffentlich gefunden …“ | ok (Hauptbild Ergebnis) |
| 03-grundpreis-kein-euro.png | „Grundpreis des Shirts: Kein Euro-Preis gefunden …“ | ok |
| 04-stick-inklusive.png | „Preis für den Stick: Printful rechnet ihn nicht separat ab …“ | ok |
| 05-digitalisierung.png | „Digitalisierung des Logos: … 5,75 € …“ | nur unscharf/ohne Zoom auf 5,75 (nicht bestätigt) |
| 06-rechnung-tabelle.png | Rechnung-Tabelle + „17,15 € netto Printful-Preis pro Shirt auf null“ | ok (Hauptbild Warum 2) |
| 10-annahmen-tabelle.png | Tabelle mit angenommenen Shirtpreisen 12/14/16 € | nur mit Label „Annahmen“ sichtbar, sonst nicht |
| 08-entscheidung-gruende.png | „Können die Preise so bleiben?“ + 3 Gründe (21,80 statt 29,90) | ok (Entscheidung + Warum 1) |
| 09-ohne-konto-nicht-sehen.png | „Was ich ohne Printful-Konto nicht sehen kann“ (4 Punkte) | ok |
| 11-konto-testbestellung.png | Vorschlag kostenloses Konto + Testbestellung | ok als Haken (Menschen-Schritt) |
| 12-quellen.png | „Sources:“ (7 Links) | ok |

## Ein Satz an den Autor
In 1 min 55 s findet Claude per Websuche heraus, dass Printful den Stick in Standardgröße im Produktpreis enthält und das Logo einmalig digitalisiert wird, findet den Euro-Einkaufspreis des bestickten Shirts ohne Konto aber nicht; es rechnet deshalb mit Platzhalter (erste 5er-Bestellung bei rund 17 € netto Einkauf pro Shirt auf null, Einzelshirt bei 25 €), hält 29,90 € für tragfähig, lässt die 109 € für fünf offen („Mengenrabatt frisst die Marge“, 21,80 statt 29,90 je Shirt) und rät, die Versandzeile im Brief anzupassen.
