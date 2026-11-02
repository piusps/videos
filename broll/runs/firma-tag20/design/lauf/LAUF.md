# Echter claude.ai-Lauf Folge 20 (Mit oder ohne Umsatzsteuer?), 2026-10-31, 16:41:25–16:42:56 (MEZ)
Chat: https://claude.ai/chat/0a4627da-c7c3-47fe-b76b-511b9e434ce8 (T3-Preview-Profil "Chrome", eigener neuer Tab im Hintergrund, kein fremder Tab offen/angefasst; Organisation = Pius' eigene Pro-Organisation 77f569ac…, Cookie lastActiveOrg vor dem Einfügen und direkt vor dem Senden geprüft, stand bereits richtig), Modell Opus 5.5 Mittel (Composer "Opus 5.5 Mittel", Chat-API model claude-opus-5-5, effort_level "medium")
Chat-Titel (von claude.ai vergeben): "Kleinunternehmer oder Umsatzsteuer"
Weg: neuer Tab (claude.ai/new, Composer leer) -> Plus-Menü geprüft -> Gedächtnis für diesen Chat aus -> 1 Datei angehängt (verstecktes input[type=file], DataTransfer; Datei per lokalem Server 127.0.0.1:47820 in den Tab) -> Prompt per Paste (vor dem Senden 1:1 mit prompt.txt verglichen: identisch, 615 Zeichen) -> "Nachricht senden". KEIN Research ("Recherche" aria-checked=false, vor dem Senden erneut gelesen). Websuche an (Konto-Standard, settings.enabled_web_search = true), Claude hat gesucht.
**Gedächtnis: für diesen Chat AUS.** "Gedächtnis" im Plus-Menü stand auf an, einmal geklickt, erneut gelesen: aria-checked=false (vor dem Senden noch einmal: false). Chat-API: settings.chat_memory_mode = "disabled". /api/account vorher und nachher gesichert: byte-identisch (cmp + SHA-256 1ee1770b0e6309e1…, derselbe Wert wie vor Lauf 19).
**Konnektoren:** nichts angefasst (in den Chat-Einstellungen als verfügbar gelistet = Konto-Standard, nicht geändert). Im Protokoll **kein Konnektor-Aufruf**, kein Dialog, keine Freigabe-Abfrage.
Nichts verbunden, gekauft, angemeldet, geteilt, versendet. Kein Printful-Konto, kein Finanzamt-/ELSTER-Kontakt. Am Composer "Manuell". Login/Geld verlangt: nein. Rückfragen: keine.
Anhang (liegt hier): `Kolonnenshirt_Marge.md` (1287 Byte, 24 Zeilen). Inhalt nur aus den Läufen 18/19: Angebot 109 € brutto für 5 / 29,90 € Einzelshirt, Stick in Standardgröße im Produktpreis, Digitalisierung 2,95–6,50 € (Printful-Seite, Gegenprüfung Lauf 18), Versand laut Testbericht 4,49 € + 1,25 € netto, Euro-Einkaufspreis ohne Konto nicht gefunden, ohne USt-ID +19 %, Rechnung netto (91,60 € / 18,32 € pro Shirt / 25,13 €), Null-Grenze „rund 17 €“ (bewusst nicht 17,15, weil 5,75 € unbestätigt), offen: Umsatzsteuer. Karte "Kolonnenshirt_Marge.md · 24 Zeilen · MD".

## Prompt (wörtlich, auch prompt.txt)
Ich gründe gerade eine kleine Firma. Im Anhang stehen mein Angebot und meine Marge-Rechnung: 109 Euro brutto für fünf gestickte Shirts, 29,90 Euro für ein Einzelshirt, Einkauf bei Printful, das ohne USt-ID 19 % Umsatzsteuer aufschlägt. Prüf mit der Websuche, ob ich als Kleinunternehmer starten soll oder mit Umsatzsteuer, jeweils mit Quelle (Gesetz, Finanzverwaltung, IHK). Rechne für 109 Euro und 29,90 Euro aus, was das jeweils für mich bedeutet. Entscheide dich für einen Weg, mit zwei bis drei konkreten Gründen. Sag mir, was du nicht prüfen kannst. Erfinde nichts. Ich weiß, dass das keine Steuerberatung ist.

## Ergebnis
Dauer: **1 min 31 s** (gesendet 16:41:25, Antwort fertig 16:42:56; Chat-API). Im Video: „anderthalb Minuten“.
Werkzeuge laut Chat-API: **5 Websuchen** („§ 19 UStG Kleinunternehmer gesetze-im-internet“ | „BMF Kleinunternehmerregelung 2025 Umsatzgrenze 25.000 100.000“ | „IHK Kleinunternehmerregelung Vorsteuerabzug Verzicht fünf Jahre“ | „Printful VAT Germany VAT ID reverse charge“ | „Kleinunternehmer innergemeinschaftlicher Erwerb USt-IdNr Erwerbsschwelle 12.500 kein Vorsteuerabzug IHK“), **3 Seitenabrufe** (support.printful.com VAT-ID-Artikel ok; gesetze-im-internet.de § 19 → **abgelehnt** „URL not in prior search“; ecom-tools.de/en/printful-review ok). Anhang ohne eigenes Read-Tool gelesen (Text-Anhang im Kontext). Kein Bash, keine Datei erzeugt, kein Konnektor. UI-Zeile: „Das Web durchsucht, 3 Seiten gelesen“.
Erster Satz: „Ich recherchiere die Regeln zur Kleinunternehmerregelung (Gesetz, BMF, IHK) und Printfuls Umsatzsteuer-Praxis und rechne danach beide Wege durch.“

**Entscheidung (Claude, wörtlich):** „Meine Entscheidung: Starte mit Umsatzsteuer, also mit Verzicht auf die Kleinunternehmerregelung. Deine Kunden sind Firmen, und dein Einkauf läuft über Printful. Bei beidem ist die Kleinunternehmerregelung hier eher ein Nachteil.“

**Rechtslage laut Claude (Kurzfassung, Quellen im Chat):**
- Grenzen: Vorjahr ≤ 25.000 €, laufendes Jahr ≤ 100.000 € (§ 19 UStG); Gründungsjahr: tatsächlicher Umsatz ≤ 25.000 € (IHK München); BMF-Erlass 18.03.2025 (IHK Ostwürttemberg).
- Kein Vorsteuerabzug (§ 19 Abs. 1 i. V. m. § 15 Abs. 2 UStG, Hinweisblatt DWS).
- Verzicht bindet mindestens fünf Jahre (IHK); sinnvoll, wenn man überwiegend an Unternehmer leistet (IHK).
- Printful (laut Testbericht): Abrechnung aus Lettland/Spanien; mit geprüfter EU-USt-ID 0 % + Reverse Charge; ohne USt-ID 19 % auf Produkt, Versand, Services, nicht zurückholbar.
- USt-ID als Kleinunternehmer hilft nicht: gilt als Verzicht auf die Erwerbsschwelle (UStAE 1a.1), bindet zwei Jahre, dann schuldet man die 19 % selbst ohne Vorsteuerabzug.

**Rechnung (Claude, P = Printful-Nettopreis pro besticktem Shirt, unbekannt):**
| | Regelbesteuerung (USt-ID, Printful 0 %) | Kleinunternehmer (Printful +19 %) |
|---|---|---|
| 5er 109 € | 91,60 € − 5 × P | 109 € − 5,95 × P |
| Digitalisierung | 2,95–6,50 € | 3,51–7,74 € |
| Null-Marge bei P = | 18,32 € (mit 6,50 € Digitalisierung rund 17,02 €) | genauso |
| Einzelshirt 29,90 € | 25,13 € − P | 29,90 € − 1,19 × P |
| Null-Marge bei P = | 25,13 € | genauso |
| Was ein Handwerker mit Vorsteuerabzug effektiv zahlt | 91,60 € bzw. 25,13 € | 109 € bzw. 29,90 € |
Lesart (Claude): Bei gleichem Endpreis 109 € ist die Null-Grenze gleich, „Als Kleinunternehmer ist deine Marge sogar 19 % höher. Dafür ist dein Angebot für einen vorsteuerabzugsberechtigten Handwerker aber 17,40 € pro Paket teurer (beim Einzelshirt 4,77 €).“ Bei gleichen Kosten für den Kunden (109 € netto = 129,71 € brutto) liegt die Regelbesteuerung um 0,95 × P pro Paket vorn. Versand als Kleinunternehmer: 9,49 € netto → 11,29 € (Testbericht).

**Drei Gründe (Claude, wörtlich gekürzt):**
1. „Deine Kunden sind Betriebe. Wer vorsteuerabzugsberechtigt ist, bekommt deine Umsatzsteuer zurück. Für ihn bist du mit ausgewiesener Steuer günstiger oder gleich teuer, nie teurer.“
2. „Printful wird für dich als Kleinunternehmer dauerhaft 19 % teurer. Das gilt ohne USt-ID und auch mit USt-ID, weil dir der Vorsteuerabzug fehlt.“
3. „Dein Angebot passt schon so. Es ist bereits als „brutto“ formuliert. Als Kleinunternehmer dürftest du keine Umsatzsteuer ausweisen. Tust du es doch, schuldest du sie trotzdem (§ 14 Abs. 3 UStG).“
„Der Preis dafür: Du bist fünf Jahre gebunden und musst Umsatzsteuer-Voranmeldungen abgeben.“

**Was Claude nicht prüfen konnte (5 Punkte):** Euro-Preis des bestickten Shirts (nur Formeln/Null-Grenzen); ob die Kunden wirklich vorsteuerabzugsberechtigt sind („Ein Handwerker, der selbst Kleinunternehmer ist, zahlt bei dir immer brutto. Für ihn kippt Grund 1.“); Printfuls eigene Aussage zu Kleinunternehmern (19 % nur aus Testbericht); Gesetzestext auf gesetze-im-internet.de und BMF-Schreiben 18.03.2025 nicht direkt abgerufen (IHK + Fachquellen); Jahresumsatz, Bearbeitungszeit USt-ID, Ertragsteuern.
Quellen (11): service.berlin.de, IHK München, IHK Ostwürttemberg, IHK Schwarzwald-Baar-Heuberg, IHK Nürnberg (Merkblatt), UStAE 1a.1 (steuerschroeder.de), Merkblatt Kleinunternehmer (steuerschroeder.de), Hinweisblatt DWS, BFH XI B 87/08 (NWB), ecom-tools.de Printful-Test, support.printful.com (VAT ID).
**Kein „Als Nächstes“ im Chat.** Claude sagt „keine Steuerberatung“ nicht selbst (der Prompt sagt es). Offen laut Lauf: Einkaufspreis (Konto = Pius), Vorsteuerabzug der Kunden, Printfuls eigene Aussage, Preis 109 € brutto lassen oder 109 € netto verlangen (Claude rechnet beide Fälle, entscheidet nicht). Menschen-Schritte (nicht erzählen als erledigt): Verzicht gegenüber dem Finanzamt erklären, USt-ID beantragen, USt-Voranmeldungen.
Übergabe-Vorschlag Folge 21: „Als Nächstes: Was muss auf ihre Rechnung?“ (Rechnungsvorlage mit ausgewiesener Umsatzsteuer, Pflichtangaben § 14 UStG, ohne Login als Word-Datei machbar; Claude nennt § 14 Abs. 3 im Lauf). Alternative: „Hundertneun Euro brutto oder netto?“ (Lauf rechnet beide, entscheidet nicht; Grund 3 „Dein Angebot passt schon so“ könnte als halbe Antwort gelesen werden → Rechnung ist sauberer).

## Gegenprüfung (von mir, 2026-10-31 ~16:55, WebFetch, nicht im Chat)
- gesetze-im-internet.de § 19 UStG: Vorjahr 25 000 €, laufendes Jahr 100 000 € ✓; Abs. 3 „Der Verzicht bindet den Unternehmer mindestens für fünf Kalenderjahre.“ ✓
- IHK München: Grenzen ✓, Gründungsjahr ≤ 25.000 € tatsächlicher Umsatz ✓, „Kleinunternehmer sind grundsätzlich vom Vorsteuerabzug ausgeschlossen (§ 15 Abs. 2 UStG)“ ✓, Verzicht „für fünf Jahre an die Regelbesteuerung gebunden“ ✓. Die Aussage „sinnvoll bei Unternehmerkunden“ steht NICHT bei IHK München.
- IHK Schwarzwald-Baar-Heuberg: Verzicht kann sinnvoll sein, wenn man „selbst überwiegend an andere Unternehmer und nicht an Privatkunden leistet“ ✓; „bindet den Unternehmer für fünf Kalenderjahre“ ✓. → Quelle für Grund 1 im Guide = IHK Schwarzwald-Baar-Heuberg.
- Rechnungen nachgerechnet: 109 − 91,60 = 17,40 ✓; 29,90 − 25,13 = 4,77 ✓; 109 × 1,19 = 129,71 ✓; 109 / 5,95 = 18,32 ✓; (91,60 − 6,50) / 5 = 17,02 ✓; 6,50 × 1,19 = 7,74, 2,95 × 1,19 = 3,51 ✓; 9,49 × 1,19 = 11,29 ✓.
- 19 % Printful-Aufschlag ohne USt-ID: nur Testbericht (wie Lauf 18/19), Printfuls eigene Seite nicht bestätigt → gesprochen nur als Folge für die Firma, nicht als Printful-Zitat mit Quelle.
- Nicht geprüft: UStAE 1a.1 / Erwerbsschwelle (Nebeninfo, nicht sprechen).

## Auffälligkeiten (nur festgehalten)
- Abruf gesetze-im-internet.de abgelehnt (URL nicht aus Suchergebnis); Claude sagt das offen unter „Was ich nicht prüfen konnte“.
- Claude zeigt ehrlich die Gegenseite: bei gleichem Bruttopreis wäre die eigene Marge als Kleinunternehmer 19 % höher. Die Entscheidung gilt nur, wenn die Kunden vorsteuerabzugsberechtigt sind.
- „Finanzverwaltung“ nur indirekt (BMF-Erlass über IHK Ostwürttemberg, service.berlin.de), kein BMF-Dokument selbst gelesen.
- Leak-Check Klon: 0 × Pius/Niklas/Florent/boilr/Superkind/Hamburg/Chemnitz/Mail; Begrüßung „Wieder am Start, Pius“ → „Wieder am Start“ (nur in 01); nav/aside entfernt, „Weitere Optionen für …“ entfernt. Keine Betriebsnamen im Chat → keine -anonym-Fassungen nötig.

## Screenshots (echte claude.ai-Pixel, DOM-Klon ohne Sidebar, Dark Mode, headless Chrome 800 px × 1,5, Chat-Spalte zugeschnitten)
| Bild | Inhalt | Video |
|---|---|---|
| 01-prompt-mit-anhang.png | Karte „Kolonnenshirt_Marge.md · 24 Zeilen · MD“ + Prompt vor dem Senden, „Projekt“, „Opus 5.5 Mittel“, „Manuell“ | ok |
| 07-schritte-zeile.png | erster Satz + „Das Web durchsucht, 3 Seiten gelesen“ | ok |
| 02-entscheidung.png | „Meine Entscheidung: Starte mit Umsatzsteuer, also mit Verzicht auf die Kleinunternehmerregelung …“ | ok (Hauptbild Entscheidung) |
| 03-grenzen-25000.png | Grenzen 25.000/100.000, Gründungsjahr, BMF-Erlass | ok |
| 04-vorsteuer-verzicht-5-jahre.png | Kein Vorsteuerabzug + Verzicht fünf Jahre (IHK) | ok (Haken) |
| 05-printful-19-prozent.png | Printful: Testbericht, 0 % mit USt-ID, 19 % ohne | ok (Warum 2), Label „laut Testbericht“ sichtbar lassen |
| 06-ustid-hilft-nicht.png | USt-ID als Kleinunternehmer hilft nicht | nur ohne Zoom (Nebeninfo) |
| 08-rechnung-tabelle.png | Tabelle mit P-Formeln, Null-Marge, „effektiv zahlt 91,60 € / 109 €“ | ok (Zeile „effektiv zahlt“ = Warum 1) |
| 09-so-liest-sich.png | 17,40 € pro Paket teurer, 109 € netto = 129,71 €, Versand 11,29 € | ok (Warum 1, „17,40 €“) |
| 10-drei-gruende.png | Drei Gründe + „Der Preis dafür: … fünf Jahre gebunden“ | ok (Warum + Haken) |
| 11-nicht-pruefen.png | Was ich nicht prüfen konnte (5 Punkte) | ok |
| 12-quellen.png | „Sources:“ (11 Links) | ok |

## Ein Satz an den Autor
In 1 min 31 s entscheidet Claude per Websuche (Gesetz, IHK, Testbericht) „Starte mit Umsatzsteuer, also mit Verzicht auf die Kleinunternehmerregelung“, weil vorsteuerabzugsberechtigte Betriebe bei 109 € die 17,40 € Umsatzsteuer zurückbekommen (als Kleinunternehmer wäre das Paket für sie 17,40 € teurer) und Printful für einen Kleinunternehmer dauerhaft 19 % teurer bliebe; der Haken: fünf Jahre Bindung und Voranmeldungen, und ohne Einkaufspreis gibt es nur Formeln, keine Marge in Euro.
