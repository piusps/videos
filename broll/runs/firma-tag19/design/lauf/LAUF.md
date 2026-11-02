# Echter claude.ai-Lauf Folge 19 (Stimmt die Versandzeile?), 2026-10-31, 16:28:14–16:30:02 (MEZ)
Chat: https://claude.ai/chat/0c969b98-17ed-414b-a3e6-8accc983cec3 (T3-Preview-Profil "Chrome", eigener neuer Tab im Hintergrund, kein fremder Tab offen/angefasst; Organisation = Pius' eigene Pro-Organisation 77f569ac…, Cookie lastActiveOrg vor dem Senden zweimal geprüft, stand bereits richtig), Modell Opus 5.5 Mittel (Composer "Opus 5.5 Mittel", Chat-API model claude-opus-5-5, effort_level "medium")
Chat-Titel (von claude.ai vergeben): "Serienbriefe Versandzeile Printful"
Weg: neuer Tab (claude.ai/new, Composer leer) -> Plus-Menü geprüft -> Gedächtnis für diesen Chat aus -> 1 Datei angehängt (verstecktes input[type=file], DataTransfer; Datei per lokalem Server 127.0.0.1:47819 in den Tab) -> Prompt per Paste (vor dem Senden 1:1 mit prompt.txt verglichen: identisch, 619 Zeichen) -> "Nachricht senden". KEIN Research ("Recherche" aria-checked=false, direkt vor dem Senden erneut gelesen). Websuche an (Konto-Standard, settings.enabled_web_search = true), Claude hat gesucht.
**Gedächtnis: für diesen Chat AUS.** "Gedächtnis" im Plus-Menü stand auf an, einmal geklickt, erneut gelesen: aria-checked=false (direkt vor dem Senden noch einmal: false). Chat-API: settings.chat_memory_mode = "disabled". /api/account vorher und nachher gesichert: byte-identisch (cmp + SHA-256 1ee1770b0e6309e1…).
**Konnektoren:** nichts angefasst (in den Chat-Einstellungen als verfügbar gelistet = Konto-Standard, nicht geändert). Im Protokoll **kein Konnektor-Aufruf**, kein Dialog, keine Freigabe-Abfrage.
Nichts verbunden, gekauft, angemeldet, geteilt, versendet. Kein Printful-Konto, kein Printful-Login. Am Composer "Manuell". Login/Geld verlangt: nein. Rückfragen: keine.
Anhang (liegt hier): `Anhang_Kolonnenshirt_Serienbriefe_Lauf17.docx` (37885 Byte, Claudes Datei aus Lauf 17 unverändert, byte-gleich mit runs/firma-tag17/design/lauf/Kolonnenshirt_Serienbriefe.docx), hochgeladen als `Kolonnenshirt_Serienbriefe.docx`. Karte "Kolonnenshirt_Serienbriefe.docx · DOCX".

## Prompt (wörtlich, auch prompt.txt)
Im Anhang sind meine fünf Serienbriefe mit der Versandzeile. Mein Angebot: 109 Euro brutto für fünf Shirts, 29,90 Euro für ein Einzelshirt, Logo gestickt, auf Bestellung über Printful, Kunden in Deutschland. Prüf die Versandzeile mit der Websuche gegen Printfuls aktuelle Versandpreise und Lieferzeiten nach Deutschland, in Euro, jeweils mit Quelle. Korrigier die Zeile so, dass nur Belegtes drinsteht, und trag sie in alle fünf Briefe ein. Sag mir, ob 109 Euro für fünf Shirts so bleiben können, oder was du ohne meinen Einkaufspreis nicht entscheiden kannst. Erfinde nichts. Gib mir die korrigierte Word-Datei zurück.

## Ergebnis
Dauer: **1 min 48 s** (gesendet 16:28:14, Antwort fertig 16:30:02; Chat-API). Im Video: „knapp zwei Minuten“.
Werkzeuge laut Chat-API: 1 Read (Briefe), **6 Websuchen** („Printful Versandkosten Deutschland Euro T-Shirt“ | „Printful shipping rates Germany EUR“ | „Printful Versand T-Shirts Europa erstes Produkt zusätzliches Produkt € 2026“ | „Printful embroidery fulfillment time business days“ | „Printful shipping price updates 2026 Europe apparel“ | „printful.com/de Versandkosten Lieferzeiten Shirts Europa …“ (nur printful.com)), **2 Seitenabrufe** (printful.com/shipping ok; printful.com/de/shipping → abgelehnt „URL not in prior search“), 2 Bash (Datei entpacken, Zeile 5× ersetzen, Kontrolle „10 0“ = neue Zeile da, kein „11,20“ mehr), 1 SendUserFile („Versandzeile in allen fünf Briefen ersetzt, sonst nichts geändert.“). Kein Konnektor. UI-Zeile: „Eine Datei geteilt, das Web durchsucht und 5 weitere Schritte“.
Erster Satz: „Ich lese zuerst die Briefe und prüfe dann Printfuls Versandpreise und Lieferzeiten nach Deutschland.“
Datei (Karte „Kolonnenshirt serienbriefe · Dokument · DOCX“): `Kolonnenshirt_Serienbriefe.docx` (39138 Byte, über /api/organizations/77f569ac…/files/9fa64cca-…/contents unverändert geladen). Text-Diff gegen den Anhang: **nur die Versandzeile in allen 5 Briefen geändert**, sonst nichts (Platzhalter-Markierungen wie vorher). Volltext: briefe-text.txt (Namen/Adressen, nur intern).

**Alte Zeile (Lauf 17):** „Versand: zzgl. 11,20 Euro brutto bei 5 Shirts, zzgl. 5,20 Euro brutto bei einem Einzelshirt. Lieferung in der Regel 4 bis 10 Werktage nach Bestellung.“
**Neue Zeile (wörtlich, 5×):** „Versand: Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung. Gestickt wird in der Regel innerhalb von 2 bis 5 Werktagen, der Versand nach Deutschland dauert danach in der Regel 2 bis 5 Werktage.“

**Warum die alte Zeile raus musste (Claude, wörtlich gekürzt):**
- Versandpreise: „Für die 11,20 € und 5,20 € habe ich keinen Beleg gefunden. Printfuls offizielle Versandseite nennt für Shirts nach Europa nur Dollarbeträge: $4.99 für das erste Produkt und +$1.45 für jedes weitere. … Einen Euro-Preis direkt von Printful habe ich nicht gefunden. Ein Testbericht vom September 2026 nennt 4,49 € … netto. Das ist aber keine Printful-Quelle, und ich rechne Dollar nicht mit einem angenommenen Kurs um. Deshalb steht in der Zeile jetzt kein Betrag mehr. Schau in deinem Printful-Konto nach, was dir in Euro berechnet wird.“
- Lieferzeit: Fertigung „im Schnitt 2 bis 5 Werktage, auch beim Sticken“; deutsche Printful-Seite: Versand nach Deutschland „in der Regel 2 bis 5 Werktage, gerechnet ab dem Ende der Produktion“. „Printfuls Hilfeseite nennt aber für Europa im Standardversand 5 bis 20 Werktage nach der Fertigung, und Printful nennt seine Lieferzeiten ausdrücklich nur eine Schätzung … Deshalb steht „in der Regel“ in der Zeile. Ein festes Lieferdatum solltest du nicht zusagen.“

**109 € für fünf (Claude, wörtlich):** „Das kann ich ohne deinen Einkaufspreis nicht entscheiden.“ Sicher sagt es: mit USt-Ausweis bleiben von 109 € brutto 91,60 € netto = 18,32 € pro Shirt (Einzelshirt 25,13 € netto). Davon zu zahlen: 5 × Printful-Preis des gestickten Shirts; der Versand, falls nicht extra berechnet („$10,79 bei fünf Shirts“); einmalige Digitalisierungsgebühr je neuem Logo, „Kostenlos … erst ab 25 bestickten Produkten in einer Bestellung“. **„Achtung Umsatzsteuer:** Wenn du keine geprüfte USt-ID bei Printful hinterlegt hast, schlägt Printful 19 % deutsche Umsatzsteuer auf jede Rechnung auf. Das gilt auch für Kleinunternehmer und macht deinen Einkauf teurer.“ „Ein offener Punkt: In der neuen Zeile steht zwar, dass der Versand extra kostet, aber kein Betrag. Wenn du den Versand nicht extra berechnen willst, muss er in den 109 € stecken. Diese Entscheidung liegt bei dir.“
Schluss: „Ich bin kein Steuer- oder Finanzberater. Für die Umsatzsteuerfrage frag am besten deinen Steuerberater. Wenn du mir deinen Printful-Preis pro gesticktem Shirt in Euro und deinen Umsatzsteuerstatus nennst, rechne ich dir die Marge für beide Angebote genau aus.“
Quellen (7): printful.com/shipping, printful.com/de/print-on-demand-deutschland, help.printful.com (fulfillment time), help.printful.com (shipping options), printful.com/embroidery-digitizing, ecom-tools.de/printful, ecom-tools.de/en/printful-review.
**Kein „Als Nächstes“ im Chat.** Offen laut Lauf: (a) Einkaufspreis (nur im Printful-Konto = Pius), (b) **Umsatzsteuerstatus** (mit USt-ID/Regelbesteuerung oder Kleinunternehmer) – Claude braucht ihn für die Marge und warnt vor 19 % Aufschlag ohne USt-ID, (c) Versand extra oder in den 109 €. Übergabe-Vorschlag Folge 20: „Als Nächstes: Mit oder ohne Umsatzsteuer?“ (ohne Login recherchierbar; Anmeldung selbst = Menschen-Schritt).

## Gegenprüfung (von mir, 2026-10-31 ~16:33, WebFetch, nicht im Chat)
- printful.com/shipping (meine Abfrage): Europa, „T-shirts, tank tops, …“ **€4.49 erstes Produkt, +€1.25 je weiteres**; Europa Flat Rate „5–20 business days after fulfillment“; „It takes 2–5 business days to create a product and fulfill an order“. → Die Seite liefert je nach Abrufort Euro oder Dollar. Claudes „nur Dollarbeträge“ stimmt für **seinen** Abruf, nicht allgemein. Gesprochen daher nur „Printful nennt ihr nur Dollar“ (ihr = im Lauf), nie „Printful hat keine Euro-Preise“. Mit 19 % wären es 11,29 € / 5,34 € – die alten 11,20 € / 5,20 € waren also wirklich nicht belegt bzw. zu knapp (wie Lauf 17/18).
- printful.com/de/print-on-demand-deutschland: „In der Regel dauert der Versand nach Deutschland 2 bis 5 Werktage – nach Abschluss der Produktion.“ ✓ Keine Euro-Versandpreise auf der Seite ✓.
- printful.com/embroidery-digitizing: „if you order any 25+ embroidery products in a single order, we'll digitize all your embroidery designs for free“ ✓; Gebührenhöhe nicht auf der Seite.
- help.printful.com (Fulfillment-Zeit): 403 für mich. „auch beim Sticken“ daher nicht bestätigt; belegt ist nur die allgemeine Fertigungszeit 2–5 Werktage (printful.com/shipping). Lieferzeit im Video nicht sprechen.
- 109 / 1,19 = 91,60 ✓; ÷ 5 = 18,32 ✓; 29,90 / 1,19 = 25,13 ✓.
- Claude widerspricht sich leicht: „In der neuen Zeile steht zwar, dass der Versand extra kostet“ – wörtlich steht dort nur „Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung“ (sinngemäß extra, aber ohne „zzgl.“). Nicht als „Versand extra“ sprechen.

## Auffälligkeiten (nur festgehalten)
- Claude streicht die Beträge statt sie zu korrigieren, obwohl ein Testbericht 4,49 € nennt – begründet mit „keine Printful-Quelle“ + kein angenommener Kurs. Genau das verlangte der Prompt („nur Belegtes“).
- Die Briefe sind weiter nicht versandfertig (gelbe Platzhalter für Absender, Datum usw. bleiben wie seit Lauf 16).
- Erster Abruf printful.com/de/shipping abgelehnt (URL nicht aus Suchergebnis), Claude hat danach gesucht.
- Leak-Check Klon: 0 × Pius/Niklas/Florent/boilr/Hamburg/Chemnitz/Betriebsname; „Superkind“ (sr-only/aria Status Claude Desktop) entfernt; nav/aside entfernt, „Weitere Optionen für …“ entfernt; Begrüßung „Wieder am Start“ ohne Namen. Chattext ohne Betriebsnamen/Adressen → **keine -anonym-Fassungen nötig**. Rechts im Klon stand die leere Datei-Vorschau, in keinem Ausschnitt enthalten.

## Screenshots (echte claude.ai-Pixel, DOM-Klon ohne Sidebar, Dark Mode, headless Chrome 1280 px × 1,5, Chat-Spalte zugeschnitten)
| Bild | Inhalt | Video |
|---|---|---|
| 01-prompt-mit-anhang.png | Karte „Kolonnenshirt_Serienbriefe.docx · DOCX“ + Prompt vor dem Senden (unten abgeschnitten; Projekt/Opus-Zeile nicht im Ausschnitt) | ok |
| 07-schritte-zeile.png | erster Satz + „Eine Datei geteilt, das Web durchsucht und 5 weitere Schritte“ | ok |
| 02-neue-versandzeile.png | „In Kolonnenshirt_Serienbriefe.docx steht jetzt … dieselbe neue Versandzeile:“ + neue Zeile | ok (Hauptbild Ergebnis) |
| 03-versandpreise-kein-beleg.png | „Warum die alte Zeile raus musste“ + „Für die 11,20 € und 5,20 € habe ich keinen Beleg gefunden … nur Dollarbeträge …“ | ok (Hauptbild Warum) |
| 04-lieferzeit.png | Lieferzeit-Absatz (2–5 / 5–20 Werktage, Schätzung) | nur ohne Zoom; Lieferzeit nicht sprechen |
| 05-109-nicht-entscheiden.png | „Können die 109 € bleiben? Das kann ich ohne deinen Einkaufspreis nicht entscheiden.“ + 18,32 € pro Shirt netto | ok |
| 06-kosten-umsatzsteuer.png | Was bezahlt werden muss, „Achtung Umsatzsteuer“ 19 %, offener Punkt | ok (Übergabe) |
| 09-steuer-angebot-rechnen.png | „Ich bin kein Steuer- oder Finanzberater … Umsatzsteuerstatus nennst …“ | ok (Übergabe) |
| 08-quellen.png | „Sources:“ (7 Links) | ok |
| 10-datei-karte.png | Karte „Kolonnenshirt serienbriefe · Dokument · DOCX“ | ok |
Noch NICHT gebaut: lokale Briefansicht alt → neu (Versandzeile durchgestrichen → neue Zeile) aus den beiden .docx; Empfängerblock und Datenschutz-Website schwärzen.

## Ein Satz an den Autor
In 1 min 48 s findet Claude für die alten Versandbeträge 11,20 € / 5,20 € keinen Beleg (Printfuls Versandseite zeigte ihm nur Dollar, einen geschätzten Kurs nimmt es nicht), streicht deshalb die Beträge aus allen fünf Briefen („Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“) und setzt die Lieferzeit nur mit „in der Regel“ ein; ob 109 € für fünf bleiben, kann es ohne Einkaufspreis nicht entscheiden, und es warnt: ohne USt-ID schlägt Printful 19 % auf – für die Marge braucht es Einkaufspreis und Umsatzsteuerstatus.
