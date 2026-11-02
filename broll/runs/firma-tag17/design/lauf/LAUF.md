# Echter claude.ai-Lauf Folge 17 (Was kostet der Versand der Shirts?), 2026-10-31, 12:36:55–12:38:34 (MEZ)
Chat: https://claude.ai/chat/67f53de4-160d-4ea0-8f89-6b1e0c1d26f1 (T3-Preview-Profil "Chrome", eigener neuer Tab, kein fremder Tab offen/angefasst; Organisation = Pius' eigene Pro-Organisation 77f569ac…, Cookie lastActiveOrg vor dem Senden geprüft, stand bereits richtig), Modell Opus 5.5 Mittel (Composer "Opus 5.5 Mittel", Chat-API effort_level "medium")
Chat-Titel (von claude.ai vergeben): "Printful Versandkosten Deutschland"
Weg: neuer Tab (claude.ai/new, Composer leer) -> Plus-Menü geprüft -> Gedächtnis für diesen Chat aus -> 1 Datei angehängt (verstecktes input[type=file], DataTransfer; Datei per lokalem Server 127.0.0.1:47817 in den Tab) -> Prompt per Paste (vor dem Senden 1:1 mit prompt.txt verglichen: identisch, 761 Zeichen) -> "Nachricht senden". KEIN Research ("Recherche" aria-checked=false). Websuche in den Chat-Einstellungen an (Konto-Standard, settings.enabled_web_search = true), Claude hat gesucht.
**Gedächtnis: für diesen Chat AUS.** "Gedächtnis" im Plus-Menü stand auf an, einmal geklickt, erneut gelesen: aria-checked=false. Chat-API: settings.chat_memory_mode = "disabled". /api/account vorher und nachher gesichert: byte-identisch (cmp).
**Konnektoren:** nichts angefasst. Konnektor-Werkzeuge (HeyGen, InstantDM, Apify) als verfügbar gelistet (Konto-Standard, nicht geändert); im Protokoll **kein Konnektor-Aufruf**, kein Dialog.
Nichts verbunden, gekauft, angemeldet, geteilt, versendet. **Kein Printful-Konto**, kein Printful-Login, kein Versandrechner im Konto. Am Composer "Manuell". Login/Geld verlangt: nein. Rückfragen: keine.
Anhang (liegt hier): `Anhang_Kolonnenshirt_Serienbriefe_Lauf16.docx` (37872 Byte, Claudes Datei aus Lauf 16 unverändert). Karte "Kolonnenshirt_Serienbriefe.docx · DOCX".

## Prompt (wörtlich, auch prompt.txt)
Im Anhang sind meine fünf Serienbriefe aus dem letzten Schritt. Mein Angebot: 109 Euro brutto für fünf Shirts, 29,90 Euro für ein nachbestelltes Einzelshirt, gestickt erst auf Bestellung über Printful, Kunden in Deutschland. Im Brief ist der Platzhalter „Versandkosten und Lieferzeit“ noch offen. Finde mit der Websuche heraus, was der Versand bei Printful nach Deutschland für eine Bestellung von fünf Shirts und für ein Einzelshirt kostet, jeweils mit Quelle. Rechne aus, ob der Versand in meinen Preisen von 109 Euro und 29,90 Euro noch drin ist oder ob ich die Versandkosten im Brief extra nennen muss. Trag das Ergebnis in die Briefe ein, wo der Platzhalter steht, und gib sie mir als Word-Datei zurück. Sag mir, was du nicht prüfen kannst. Erfinde nichts.

## Ergebnis
Dauer: **1 min 39 s** (gesendet 12:36:55, Antwort fertig 12:38:34; Chat-API). Im Video: „knapp zwei Minuten“.
Werkzeuge laut Chat-API: 1 Read (Briefe), **5 Websuchen** („Printful Versandkosten Deutschland T-Shirt“ | „Printful shipping rates Germany apparel additional item“ | „printful.com/de Versand Versandkosten Europa T-Shirts Einzelprodukt zusätzliches Produkt“ | „Euro Dollar Wechselkurs heute“ | „Printful besticktes T-Shirt Preis Euro Stickerei“), **1 Seitenabruf** (WebFetch printful.com/shipping), 1 Skill (docx), 3 Bash (Datei entpacken, Platzhalter suchen, 5× ersetzen, Validierung „All validations PASSED!“), 1 SendUserFile (Bildunterschrift „Alle fünf Briefe mit ausgefüllter Versandzeile“). Kein Konnektor. UI-Zeile: „Eine Datei geteilt, das Web durchsucht und 5 weitere Schritte“.
Erster Satz: „Ich lese zuerst die Briefe und recherchiere dann die Printful-Versandkosten nach Deutschland.“
Datei (Karte „Kolonnenshirt serienbriefe · Dokument · DOCX“): `Kolonnenshirt_Serienbriefe.docx` (37885 Byte, über die Datei-API des Tabs unverändert geladen). Gleich wie Lauf 16, nur der Platzhalter ist in allen 5 Briefen ersetzt und nicht mehr gelb. Volltext: briefe-text.txt (Namen/Adressen, nur intern). Gelbe Platzhalter je Brief jetzt 9 statt 10.

**Neue Zeile im Brief (wörtlich, 5×):** „Versand: zzgl. 11,20 Euro brutto bei 5 Shirts, zzgl. 5,20 Euro brutto bei einem Einzelshirt. Lieferung in der Regel 4 bis 10 Werktage nach Bestellung.“

**Kernsatz Chat:** „In allen fünf Briefen steht jetzt: „Versand: zzgl. 11,20 Euro brutto bei 5 Shirts, zzgl. 5,20 Euro brutto bei einem Einzelshirt. Lieferung in der Regel 4 bis 10 Werktage nach Bestellung.“ Die gelbe Markierung ist entfernt, sonst ist nichts geändert.“

**Printful-Versand laut Claude:** „Laut Printfuls offizieller Versandseite (heute abgerufen) kostet die Kategorie „Shirts“ (T-Shirts, Polos, Longsleeves usw.) nach Europa 4,99 $ für das erste Produkt und 1,45 $ für jedes weitere.“ 5 Shirts: 4,99 $ + 4 × 1,45 $ = 10,79 $ ≈ 9,39 €; 1 Shirt: 4,99 $ ≈ 4,34 €. Kurs 1 $ = 0,87 € „vom Juli 2026, einen tagesaktuellen Kurs habe ich nicht gefunden“. Testbericht (ecom-tools): ohne geprüfte USt-IdNr. schlägt Printful 19 % deutsche USt auf → ≈ 11,17 € / 5,17 €.

**Entscheidung (Claude): Versand steht im Brief extra („zzgl.“).** Wörtlich: „Weil ich nicht belegen kann, dass der Versand in deinen Preisen drin ist, steht er im Brief separat. Die Beträge 11,20 € und 5,20 € decken Printfuls Versandkosten in beiden Steuerfällen ab, aufgerundet auf 10 Cent. Das Aufrunden ist meine Entscheidung. Wenn dein Shirt-Einkaufspreis klar unter den Werten in der Tabelle liegt, kannst du die Zeile auch auf „Versand innerhalb Deutschlands inklusive“ ändern.“
**Warum (Claude):** „Passt der Versand in 109 € und 29,90 €? Das kann ich nicht sicher beantworten. Dafür fehlt mir dein Printful-Einkaufspreis für das gestickte Shirt.“ Tabelle „höchstens Einkaufspreis pro Shirt, damit nach Versand nichts draufgeht“: mit USt-Ausweis (netto) 16,44 € (5er) / 20,79 € (Einzel); Kleinunternehmer (brutto) 19,57 € / 24,73 €. „Das ist der Punkt, an dem du ohne Gewinn rauskommst. Beim Einzelshirt frisst der Versand etwa 17 % des Nettopreises.“
**Lieferzeit (Claude):** Produktion meist 2–5 Werktage, Versand nach Deutschland meist 2–4 Werktage (deutsche Printful-Seite) → „4 bis 10 Werktage“; „Printful selbst sagt, dass die geschätzte Lieferzeit nur eine Schätzung und keine Garantie ist.“
**Nicht prüfen (laut Claude, 6 Punkte):** eigener Shirt-Einkaufspreis bei Printful (Modell, Stickgröße, Digitalisierungsgebühr) – „Davon hängt ab, ob sich das Angebot überhaupt rechnet.“; Abrechnung in Euro oder Dollar + Kurs; ob Stickerei länger dauert als Druck; ob die Tabelle der USA-Seite fürs Konto gilt („Eine ältere Fassung derselben Seite nannte noch 4,79 $ / 1,45 $. Den genauen Preis zeigt dir Printful im Checkout oder im Versandrechner deines Kontos.“); Steuerstatus/USt-IdNr.; rechtliche Preisangaben („Ich bin kein Anwalt.“).
Quellen (6): printful.com/shipping, help.printful.com (Versandkosten bei mehreren Teilen), printful.com/de/print-on-demand-t-shirts, printful.com/de/print-on-demand-deutschland, ecom-tools.de (Printful Review 2026), goldpricez.com (Kurs; Link-Pfad endet fehlerhaft auf „usd-usd“).
**Kein „Als Nächstes“ im Chat.** Die offene Frage, die Claude selbst als entscheidend nennt: **der Printful-Einkaufspreis des gestickten Shirts**. Übergabe-Vorschlag Folge 18: „Als Nächstes: Was zahlt sie für das gestickte Shirt?“ (öffentliche Printful-Produktseiten zeigen Preise ohne Login; Lauf 18 muss das bestätigen.)

## Gegenprüfung (von mir, 2026-10-31 ~12:42, WebFetch printful.com/shipping, nicht im Chat)
- Meine Abfrage bekam die Seite **in Euro**: Europa, „T-shirts, tank tops, long sleeve shirts, etc.“ **4,49 € erstes Teil, +1,25 € je weiteres**; Europa Flat Rate „5–20 business days after fulfillment“, Fertigung „2–5 business days“. Keine Angabe zur USt. Surcharge 15.10.2026–17.01.2027 nur für US-Adressen.
- Damit: 5 Shirts = 9,49 €, 1 Shirt = 4,49 €. **Mit 19 % USt wären das 11,29 € / 5,34 €, also mehr als Claudes 11,20 € / 5,20 € im Brief.** Claudes Aussage „decken … in beiden Steuerfällen ab“ gilt nur für seine Dollar-Umrechnung. Welcher Preis für ein deutsches Konto gilt, zeigt nur der Checkout (Login) → nicht prüfbar ohne Pius.
- Lieferzeit: Claude sagt Versand nach Deutschland „meist 2–4 Werktage“ (deutsche Seite, von mir nicht geöffnet); die englische Versandseite nennt für Europa Flat Rate 5–20 Werktage nach Fertigung. „4 bis 10 Werktage“ im Brief ist damit **nicht sicher belegt**.
- Folge: Im Video nur sagen, was Claude entscheidet und warum (Versand extra, Einkaufspreis fehlt, 17 % beim Einzelshirt). Die Beträge 11,20 €/5,20 € höchstens als Bild der Briefzeile, nie als „Printful verlangt 11,20 €“. Keine Lieferzeit sprechen.

## Auffälligkeiten (nur festgehalten)
- Claude füllt den Platzhalter vollständig und entfernt die Markierung, obwohl es die Kernfrage (passt der Versand in den Preis?) selbst nicht beantworten kann. Der Brief ist dadurch nicht versandfertig (9 gelbe Platzhalter bleiben: Absender, Kontakt, Datum, Datenschutz-Link).
- Aufrunden auf 11,20/5,20 ist laut Claude „meine Entscheidung“. Nie „Printful-Preis“ nennen.
- Wechselkurs vom Juli 2026, nicht tagesaktuell (Claude sagt das selbst).
- 17 % = Versand (≈ 4,34 €) / Nettopreis Einzelshirt (29,90 / 1,19 ≈ 25,13 €). Bezogen auf 29,90 € brutto wären es ≈ 15 %.
- Leak-Check Klon: 0 × Pius/Niklas/Florent/boilr/Hamburg/E-Mail; „Superkind“ 2 × (sr-only Status + aria-label „Claude Desktop …“) vor dem Rendern entfernt; nav/aside entfernt, „Weitere Optionen für …“-Labels entfernt. Chattext enthält **keine** Betriebsnamen/Adressen → keine -anonym-Fassungen nötig. Rechts im Klon stand die Datei-Vorschau (nur Titel „Kolonnenshirt serienbriefe · DOCX“), in keinem Ausschnitt enthalten.

## Screenshots (echte claude.ai-Pixel, DOM-Klon ohne Sidebar, Dark Mode, headless Chrome 1280 px × 1,5, Chat-Spalte zugeschnitten)
| Bild | Inhalt | Video |
|---|---|---|
| 01-prompt-mit-anhang.png | Karte „Kolonnenshirt_Serienbriefe.docx · DOCX“ + Prompt vor dem Senden („Projekt“, „Opus 5.5 Mittel“, „Manuell“) | ok |
| 07-schritte-zeile.png | erster Satz + „Eine Datei geteilt, das Web durchsucht und 5 weitere Schritte“ | ok |
| 02-kernsatz-versand.png | „In allen fünf Briefen steht jetzt: „Versand: zzgl. 11,20 Euro …““ | ok |
| 03-printful-versandpreis.png | „Was Printful für den Versand verlangt“ (4,99 $ / 1,45 $, Rechnung, Kurs, 19 %) | ok, aber Beträge nicht sprechen (s. Gegenprüfung) |
| 04-passt-preis-tabelle.png | „Passt der Versand in 109 € und 29,90 €? Das kann ich nicht sicher beantworten. Dafür fehlt mir dein Printful-Einkaufspreis …“ + Tabelle + „17 %“ | ok (Hauptbild Warum) |
| 05-entscheidung-extra.png | „Weil ich nicht belegen kann … steht er im Brief separat …“ | ok |
| 09-lieferzeit.png | Lieferzeit-Absatz | lieber nicht (Lieferzeit unsicher) |
| 10-nicht-pruefen.png | „Was ich nicht prüfen konnte“ (6 Punkte) | ok |
| 08-quellen.png | „Sources:“ (6 Links) | ok |
| 06-datei-karte.png | Karte „Kolonnenshirt serienbriefe · Dokument · DOCX“ | ok |
Noch NICHT gebaut: lokale Briefansicht mit neuer Versandzeile (wie Folge 16 aus der .docx; Empfängerblock + Website im Datenschutzsatz schwärzen, Versandzeile lesbar).

## Ein Satz an den Autor
In 1 min 39 s findet Claude per Websuche Printfuls Versandtarif für Shirts nach Europa (laut Claude 4,99 $ erstes, 1,45 $ jedes weitere Shirt, ≈ 9,39 € für fünf, ≈ 4,34 € für eins), kann aber nicht sagen, ob das in 109 € / 29,90 € passt, weil ihm der Printful-Einkaufspreis des gestickten Shirts fehlt – deshalb schreibt es in alle fünf Briefe „Versand: zzgl. 11,20 Euro brutto bei 5 Shirts, zzgl. 5,20 Euro … bei einem Einzelshirt“ und rechnet vor, dass der Versand beim Einzelshirt etwa 17 % des Nettopreises frisst; Achtung: meine Gegenprüfung sah die Seite in Euro (4,49 € + 1,25 €), mit USt läge das knapp über Claudes Beträgen, und die Lieferzeit „4 bis 10 Werktage“ ist nicht sicher belegt.
