# Echter claude.ai-Lauf Folge 16 (Wie kommen die Adressen in den Brief?), 2026-10-31, 12:14:16–12:15:16 (MEZ)
Chat: https://claude.ai/chat/2cd3876f-7d47-444a-9a91-d173ed1288da (T3-Preview-Profil "Chrome", eigener neuer Tab, kein fremder Tab offen/angefasst; Organisation = Pius' eigene Pro-Organisation 77f569ac…, Cookie lastActiveOrg vor dem Senden geprüft, stand bereits richtig), Modell Opus 5.5 Mittel (Composer "Opus 5.5 Mittel", Chat-API effort_level "medium")
Chat-Titel (von claude.ai vergeben): "Serienbriefe aus Werbebrief und Liste"
Weg: neuer Tab (claude.ai/new, Composer leer) -> Plus-Menü geprüft -> Gedächtnis für diesen Chat aus -> 2 Dateien angehängt (verstecktes input[type=file], DataTransfer; Dateien per lokalem Server 127.0.0.1:47817 in den Tab) -> Prompt per Paste (vor dem Senden 1:1 mit prompt.txt verglichen: identisch, 518 Zeichen) -> "Nachricht senden". KEIN Research ("Recherche" aria-checked=false). Websuche in den Chat-Einstellungen an (Konto-Standard), **Claude hat nicht gesucht** (0 Websuchen).
**Gedächtnis: für diesen Chat AUS.** "Gedächtnis" im Plus-Menü stand auf an, einmal geklickt, erneut geöffnet: aria-checked=false. Chat-API: settings.chat_memory_mode = "disabled"; Kopfzeile "Gedächtnis ist für diesen Chat deaktiviert". /api/account vorher und nachher gesichert: byte-identisch.
**Konnektoren:** nichts angefasst. Konnektor-Werkzeuge (HeyGen, InstantDM, Apify) als verfügbar gelistet (Konto-Standard, nicht geändert); im Protokoll **kein Konnektor-Aufruf**, kein Dialog.
Nichts verbunden, gekauft, angemeldet, geteilt, versendet. Am Composer "Manuell". Login/Geld verlangt: nein. Rückfragen: keine.
Anhänge (liegen hier): `Anhang_Kolonnenshirt_Werbebrief_Lauf13.docx` (37107 Byte, Brief aus Lauf 13 unverändert) + `Anhang_Kolonnenshirt_Empfaenger_Serienbrief_Lauf15.xlsx` (13636 Byte, Claudes Datei aus Lauf 15 unverändert). Karten "DOCX" und "XLSX".
UI-Hinweis: Die Antwort war laut Chat-API nach ca. 1 min fertig (letzte Änderung 12:15:16); die Seite zeigte noch minutenlang "Claude denkt nach" (Anzeige hing), erst nach Neuladen die fertige Antwort. Für das Video nur die echte Dauer nennen: rund eine Minute.

## Prompt (wörtlich, auch prompt.txt)
Im Anhang sind meine letzten zwei Ergebnisse: mein erster Werbebrief als Word-Datei mit Platzhaltern und die geprüfte Empfängerliste als Excel-Datei. Mach daraus fertige Serienbriefe, einen pro Betrieb. Nimm nur die Betriebe, die laut Liste rausgehen können. Füll nur die Platzhalter, für die es in Brief oder Liste einen Beleg gibt. Sag mir, welche Platzhalter offen bleiben, zum Beispiel Absender oder Versandkosten. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts. Gib mir die Briefe als Word-Datei zurück.

## Ergebnis
Dauer: ca. 1 min (gesendet 12:14:16, Antwort beginnt 12:14:32, fertig 12:15:16; Chat-API).
Werkzeuge laut Chat-API: 3 Read (Brief, Liste, 1 Vorschaubild Seite 4), 1 Skill (docx), 4 Bash (Python: Brief entpacken, Platzhalter suchen, 5 Briefe bauen, Bild-IDs korrigieren, Validierung "All validations PASSED!", PDF-Vorschau 5 Seiten), 1 SendUserFile (Bildunterschrift: "5 Serienbriefe, ein Brief pro Seite. Offene Platzhalter sind weiter gelb markiert."). **0 Websuchen**, kein Konnektor. UI-Zeile: "Eine Datei geteilt, 3 Dateien gelesen, 4 Befehle ausgeführt".
Erster Satz: "Ich lese zuerst den Brief und die Empfängerliste, dann baue ich die Serienbriefe als Word-Datei."
Datei (Karte "Kolonnenshirt serienbriefe · Dokument · DOCX"): `Kolonnenshirt_Serienbriefe.docx` (37872 Byte, über die Datei-API des Tabs unverändert geladen). 5 Seiten, ein Brief pro Seite (Seitenumbruch), Logo + Layout des Briefs aus Lauf 13 übernommen. Volltext: briefe-text.txt (Namen/Adressen, nur intern).
**Kernsatz:** "In der Datei Kolonnenshirt_Serienbriefe.docx stehen fünf fertige Briefe, einer pro Seite. Layout, Logo und Formatierung sind aus deinem Brief übernommen."
**Auswahl:** "Alle fünf Betriebe aus der Liste können laut Spalte „Versand“ rausgehen, also habe ich alle fünf aufgenommen." Der Betrieb mit "Ja mit Vorbehalt" ist drin: "Deine Legende sagt dazu: Brief kann raus, aber vor dem Druck die PLZ prüfen. Deshalb ist der Brief drin. Wenn du ihn erst nach der Prüfung willst, nimm Seite 2 heraus."
**Gefüllt (je Brief 4 von 14 Platzhaltern), "Pro Brief nur Felder aus der Empfängerliste":** Firmenname (bei einem Betrieb + Zeile aus Spalte Zusatz), Straße, PLZ und Ort, die Quelle im Datenschutzsatz ("Ihre Firmenanschrift stammt aus Ihrem Impressum auf [Website]").
**Offen (10 Platzhalter je Brief, weiter gelb), Claude wörtlich gruppiert:** Absenderzeile [Dein Name], [Straße, PLZ Ort], [Telefon], [E-Mail]; [Ort, Datum] ("Weder Brief noch Liste nennen ein Versanddatum oder deinen Ort. Das Prüfdatum 31.10.2026 habe ich bewusst nicht als Briefdatum genommen."); Versand: [Versandkosten und Lieferzeit ergänzen]; Kontakt im Text [Telefon] oder [E-Mail]; Gruß [Dein Name]; Datenschutz [Link oder Hinweis zur Datenschutzerklärung]. Tipp: "In Word kannst du sie am schnellsten mit Suchen und Ersetzen in allen fünf Briefen auf einmal füllen."
**Nicht prüfen (laut Claude):** PLZ des einen Betriebs (Post-PLZ-Suche); Zustellbarkeit; ob ein Betrieb Post lieber an die Betriebsstätte möchte; ob zwei Anschriften Geschäftsräume oder Wohnungen sind; Registereintrag nur über North Data; ein Betrieb ohne neue Quelle; "Inhalt des Briefs: Ob die Preise, die Angaben im Text und die Widerspruchs- und Datenschutzhinweise rechtlich reichen, habe ich nicht geprüft. Ich habe sie unverändert übernommen."; "Widersprüche: Ob einer der Betriebe schon Werbung von dir abgelehnt hat oder auf einer Sperrliste steht. Dazu enthält die Liste nichts."
**Kein "Als Nächstes" im Chat.** Von den offenen Platzhaltern sind Absender, Telefon, E-Mail, Ort/Datum, Datenschutz-Link Menschen-Daten; der einzige, den Claude recherchieren/rechnen kann, ist **„Versandkosten und Lieferzeit“** (der Shirts, Partner aus Folge 6/7). Übergabe-Vorschlag Folge 17: "Als Nächstes: Was kostet der Versand der Shirts?" (Chef prüft gegen die Kette; Drucken/Porto/Einwerfen der Briefe bleibt Menschen-Schritt.)

## Auffälligkeiten (nur festgehalten)
- Keine Websuche, keine neue Prüfung: Claude füllt nur aus Liste + Brief, so wie verlangt. Nichts erfunden (Prüfdatum ausdrücklich nicht als Briefdatum).
- Der Vorbehalt-Brief ist drin (nicht weggelassen), mit Hinweis "Seite 2 heraus". Nie erzählen "nur vier Briefe" oder "alle geprüft".
- Briefe sind NICHT versandfertig: Absender, Kontakt, Datum, Versandkosten, Datenschutz-Link fehlen (gelb). Nie "fertig zum Einwerfen" erzählen.
- Personenbezug wie Lauf 14/15: Firmennamen = Inhabernamen; Briefe enthalten volle Anschriften. Im Video nur geschwärzt.
- Leak-Check Klon: 0 × Pius/Niklas/Florent/boilr/Hamburg/E-Mail; "Superkind" 2 × (sr-only Status + aria-label "Claude Desktop … zu Superkind gewechselt") vor dem Rendern entfernt; nav/aside entfernt, "Weitere Optionen für …"-Labels entfernt.

## Screenshots (echte claude.ai-Pixel, DOM-Klon ohne Sidebar, Dark Mode, headless Chrome 1280 px × 1,5, Chat-Spalte zugeschnitten)
| Bild | Inhalt | Video |
|---|---|---|
| 01-prompt-mit-anhang.png | Karten "Kolonnenshirt_Werbebrief.docx · DOCX" + "Kolonnenshirt_Empfaenger_Serienbrief.xlsx · XLSX" + Prompt | ok |
| 07-schritte-zeile.png | erster Satz + "Eine Datei geteilt, 3 Dateien gelesen, 4 Befehle ausgeführt" | ok |
| 03-kernsatz.png | "… stehen fünf fertige Briefe, einer pro Seite. Layout, Logo und Formatierung sind aus deinem Brief übernommen." | ok (keine Namen) |
| 02-briefe-ergebnis(-anonym).png | Kernsatz + "Welche Betriebe drin sind" (5 Namen) + Vorbehalt-Absatz | nur -anonym |
| 08-gefuellt(-anonym).png | "Was ich gefüllt habe" (Beispiel-Website im Datenschutzsatz) | nur -anonym |
| 04-offen-platzhalter.png | "Was offen bleibt (weiter gelb markiert)" + Suchen-und-Ersetzen-Tipp | ok (keine Namen) |
| 05-nicht-pruefen(-anonym).png | "Was ich nicht prüfen kann" (8 Punkte) | nur -anonym |
| 06-datei-karte.png | Karte "Kolonnenshirt serienbriefe · Dokument · DOCX" | ok |
Noch NICHT gebaut: lokale Ansicht der fünf Briefe (wie brief-ansicht Folge 13). Design rendert sie aus der .docx: Empfängerblock (Firmenname/Straße/PLZ Ort) und Website im Datenschutzsatz schwärzen, gelbe Platzhalter lesbar lassen, 5 Seiten nebeneinander.

## Ein Satz an den Autor
In rund einer Minute macht Claude aus Brief (Folge 13) und Liste (Folge 15) eine Word-Datei mit fünf Briefen, einer pro Seite: alle fünf Betriebe dürfen laut Liste raus (einer mit Postleitzahl-Vorbehalt, trotzdem drin), gefüllt sind nur Firmenname, Straße, PLZ/Ort und die Quelle der Anschrift, zehn Platzhalter je Brief bleiben gelb (Absender, Kontakt, Datum, Versandkosten, Datenschutz-Link), weil weder Brief noch Liste sie belegen – und Claude sagt, dass es weder Zustellbarkeit noch die rechtliche Prüfung des Brieftexts noch Sperrlisten prüfen kann.
