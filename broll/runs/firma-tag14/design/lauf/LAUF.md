# Echter claude.ai-Lauf Folge 14 (Empfängerliste), 2026-10-31, 11:51:19–11:53:59 (MEZ)
Chat: https://claude.ai/chat/5ffe5c38-4ccf-4046-8b1a-88dbdb7276ff (T3-Preview-Profil "Chrome", Organisation = Pius' eigene Pro-Organisation 77f569ac…, Cookie lastActiveOrg vor dem Senden geprüft, stand bereits richtig), Modell Opus 5.5 Mittel (Composer-Anzeige "Opus 5.5 Mittel")
Chat-Titel (von claude.ai vergeben): "Empfängerliste Serienbrief Chemnitz"
Weg: neuer Tab (claude.ai/new, Composer leer) -> Plus-Menü geprüft -> Gedächtnis für diesen Chat aus -> 2 Dateien angehängt (verstecktes input[type=file], DataTransfer; Dateien per lokalem Server 127.0.0.1 in den Tab) -> Prompt per Paste (vor dem Senden 1:1 mit prompt.txt verglichen: identisch, 754 Zeichen) -> "Nachricht senden". KEIN Research ("Recherche" aria-checked=false, blieb aus). Kein eigener Websuche-Schalter; Chat-API settings.enabled_web_search = true, Claude hat gesucht.
**Gedächtnis: für diesen Chat AUS.** Häkchen "Gedächtnis" im Plus-Menü (stand auf an) einmal geklickt -> aria-checked=false. Chat-API: settings.chat_memory_mode = "disabled". /api/account vorher und nachher gesichert: settings unverändert. Kein memory-Aufruf im Protokoll.
**Konnektoren:** nichts angefasst; im Protokoll kein Konnektor-Aufruf, keine Freigabe-Abfrage, kein Dialog.
Nichts verbunden, nichts gekauft, nirgends angemeldet, nichts geteilt, nichts versendet. Am Composer "Manuell".
Anhänge (liegen in diesem Ordner): (1) "Kolonnenshirt_Werbebrief.docx" = Claudes Word-Datei aus Lauf 13 unverändert (37107 Byte); Karte "DOCX". (2) "Shirt-Firma Ergebnis Betriebe.md" = derselbe Anhang wie in Lauf 13 (Schlussantwort Lauf 12 mit den zwanzig Betrieben und den fünf zuerst; enthält Betriebsnamen und einmal "Hamburg"); Karte "41 Zeilen · MD".
Rückfragen: keine. Login/Connector/Geld verlangt: nein.
Erster Satz: "Ich suche jetzt die Impressums-Adressen der fünf Betriebe und baue daraus die Empfängerliste als Excel-Datei. Zuerst schaue ich, welche Felder der Brief erwartet."

## Prompt (wörtlich, auch prompt.txt)
Im Anhang ist mein letztes Ergebnis: der erste Werbebrief als Word-Datei. Dazu mein Ergebnis davor: zwanzig Betriebe in der Testregion Chemnitz, fünf davon spreche ich zuerst an. Im Brief fehlen noch die Empfänger. Hol mit der Websuche die Postadressen dieser fünf Betriebe, aus dem Impressum oder anderen öffentlichen Quellen, jeweils mit Quelle. Bau daraus eine Empfängerliste für den Serienbrief als Excel-Datei. Markiere, welche Adresse belegt ist, welche nicht und wo sich Quellen widersprechen. Nimm nur Firmenangaben, keine privaten Daten und keine Ansprechpartner, die nicht im Impressum stehen. Sag mir, welche Quelle für Firmenadressen am verlässlichsten ist, mit zwei bis drei Gründen. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts.

## Ergebnis
Dauer: ca. 2 min 40 s (gesendet 11:51:19, erster Inhaltsblock 11:51:20, letzter Block 11:53:31, Nachricht fertig 11:53:59; Chat-API).
Werkzeuge laut Chat-API: 1 Read (Werbebrief.docx, "welche Felder der Brief erwartet"), **15 Websuchen**, **6 Seitenabrufe (WebFetch), davon 2 fehlgeschlagen** (Tillmann-Firmenseite, Demeter-Startseite) -> **4 Seiten wirklich gelesen**: Knauth Startseite + Knauth Impressum, M3 Raumbau Startseite + M3 Raumbau Impressum (Anzeige: "15 Suchen, 4 Websites gelesen"). 1 Skill (xlsx), 2 Bash (Excel bauen mit openpyxl; PLZ-Spalte prüfen), 1 Dateiausgabe (SendUserFile, Bildunterschrift: "Empfängerliste für den Serienbrief. Blatt „Empfaenger“ ist die Datenquelle, „Belege“ enthält alle Quellen, „Legende und Offen“ erklärt die Status und listet, was offen ist."). Kein Konnektor. Chat-Zeile: "Eine Datei geteilt, das Web durchsucht und 9 weitere Schritte"; Denkblock-Kopf: "Listing five businesses and their sources".
**Wichtig:** Die Impressums-Adressen von Tillmann, Demeter und Metzler stammen aus Suchtreffern (Seiten nicht geöffnet bzw. Abruf fehlgeschlagen). Nur Knauth- und M3-Impressum wurden wirklich gelesen.
Zwischentext (auf Englisch, im eingeklappten Schritte-Bereich): "The postal codes are stored as text, so the leading 0 is kept. The 9117 in the preview came from the preview tool, not from the file."

Datei (Karte "Kolonnenshirt empfaenger serienbrief · Tabellenkalkulation · XLSX"): Kolonnenshirt_Empfaenger_Serienbrief.xlsx (11256 Byte, über die Datei-API des Tabs unverändert geladen). 3 Blätter: "Empfaenger" (5 Zeilen, Spalten Nr, Firmenname, Zusatz, Strasse, PLZ, Ort, Adressstatus, Quelle_im_Brief, Pruefhinweis), "Belege" (24 Zeilen Quelle je Betrieb mit Art, gefundener Anschrift, Übereinstimmung, URL), "Legende und Offen" (Status Belegt / Belegt, prüfen / Widerspruch / Nicht belegt + 6 offene Punkte). Volltext: liste-text.txt (enthält Namen/Adressen, nur intern).

**Status je Betrieb (Datei):** 1 × "Belegt" (Impressum + 3 weitere Quellen gleich), 3 × "Belegt, prüfen" (PLZ-Abweichung in Innungsliste / zwei Anschriften im Impressum, Sitz außerhalb Chemnitz im Umland / nur eine Quelle + abweichender Firmenname), 1 × "Widerspruch" (Impressum mit Vermerk Copyright 2010 vs. Abschrift Handelsregister-Bekanntmachung bei Drittanbieter). "Nicht belegt": kein Fall.
**Claudes Entscheidung (verlässlichste Quelle):** "Die verlässlichste Quelle ist für deine fünf Betriebe das Impressum auf der eigenen Website." Gründe wörtlich: (1) "Das Impressum ist Pflicht. Der Betrieb muss dort eine Anschrift angeben, unter der er erreichbar ist." (2) "Der Betrieb pflegt die Angabe selbst. Branchenverzeichnisse übernehmen dagegen oft alte Daten. Bei [zwei Betrieben] stehen dort noch frühere Adressen." (3) "Es gibt ein Impressum für alle fünf Betriebe. Das Handelsregister ist bei Firmen wie GmbH oder KG zwar die amtlichere Quelle. Von deinen fünf steht dort aber nur [einer]. Die anderen vier sind laut Creditreform oder eigener Angabe Einzelunternehmen."
**Kernsatz:** "Für alle fünf Betriebe habe ich eine Adresse aus dem Impressum gefunden. Eindeutig belegt ist allerdings nur eine. Bei drei Betrieben solltest du noch etwas prüfen, bei einem widersprechen sich die Quellen."
**Privates bewusst weggelassen (Claude):** Im Impressum eines Betriebs steht eine zweite Adresse der redaktionell verantwortlichen Person; "Diese Adresse habe ich nicht übernommen, weil es eine private Adresse sein könnte."
**Nicht prüfen (laut Claude):** Aktualität der Adressen (kein Prüfdatum), amtliches Handelsregister nicht selbst abgefragt (Angabe von Drittanbieter), ob zwei Firmennamen derselbe Betrieb sind, ob eine Anschrift Geschäftsraum oder Wohnung ist, welche von zwei Adressen ein Betrieb für Post bevorzugt, Zustellbarkeit.
**Claudes Schluss (= Übergabe Folge 15):** "Als Nächstes würde ich bei [dem Widerspruchs-Betrieb] im Handelsregister nachsehen. Bei [zwei Betrieben] ginge auch ein kurzer Anruf, mit der Frage, an welche Adresse du Post schicken sollst."
Quellen in der Antwort: 10 Links (4 eigene Impressen, 1 Innung, 1 BA-Jobbörse, 1 Drittanbieter-Registerabschrift, 2 Creditreform; alle mit Betriebsnamen im Linktext). In der Excel-Datei "Belege" weitere Verzeichnisse (11880, Gelbe Seiten, GoYellow, implisense u. a.), überwiegend aus Suchtreffern.

## Auffälligkeiten (nur festgehalten, nichts korrigiert)
- **Personenbezug:** 4 von 5 Betrieben sind laut Lauf Einzelunternehmen; Firmenname = Inhabername. Eine Adresse ist laut Claude evtl. eine Wohnung. Deshalb: keine Namen, Straßen, PLZ, Orte außer "Chemnitz" (Testregion) lesbar in Video, Caption, Guide. Der Ort außerhalb Chemnitz wird nicht genannt.
- "Belegt" heißt im Lauf: Impressum + mindestens eine unabhängige Quelle gleich. Nur 1 von 5.
- Claude unterscheidet nicht immer "Impressum gelesen" vs. "Impressum im Suchtreffer" (3 von 5 nur Suchtreffer). Nicht als "geprüft" erzählen.
- Grund 3 "steht dort nur [einer]" ist von Claude nicht im amtlichen Register geprüft (eigene Nicht-prüfen-Liste) -> nicht sprechen.
- Kein Brief verschickt, keine Adresse in den Brief eingesetzt (Serienbrief = Menschen-Schritt).
- Leak-Check Klon: 0 × Pius/Niklas/Florent/boilr/Hamburg/Superkind/Sidebar-Titel (aria-labels "Weitere Optionen für …" und "Claude Desktop … Superkind" vor dem Klon entfernt, nav/aside entfernt). Composer-Bild ohne Begrüßungszeile (enthält Vornamen, weggeschnitten). Datei-Vorschau-Panel vor dem Klon geschlossen.

## Screenshots (echte claude.ai-Pixel, DOM-Klon ohne Sidebar, Dark Mode, headless Chrome 800 px × 1,5)
| Bild | Inhalt | Video |
|---|---|---|
| 01-prompt-mit-anhang.png | Composer mit 2 Anhang-Karten (MD, DOCX) + Prompt, "Opus 5.5 Mittel", "Manuell" (ohne Begrüßung) | ok (Dateinamen ohne Betriebsnamen) |
| 07-schritte-zeile.png | Denkblock "Listing five businesses…", erster Satz, "Eine Datei geteilt, das Web durchsucht und 9 weitere Schritte" | ok |
| 02-empfaenger-tabelle.png | Tabelle Betrieb / Adresse / Status im Chat | NICHT fürs Video (Namen, Adressen) |
| 02-empfaenger-tabelle-anonym.png | dieselbe, Namen/Adressen als schwarze Balken, Status lesbar | ok |
| 03-quelle-gruende(-anonym).png | "Die verlässlichste Quelle … Impressum" + 3 Gründe | nur -anonym |
| 04-nicht-pruefen(-anonym).png | "Was ich nicht prüfen konnte" | nur -anonym |
| 05-als-naechstes(-anonym).png | "Als Nächstes würde ich … Handelsregister …" | nur -anonym |
| 08-quellen(-anonym).png | Sources (10 Links) | nur -anonym |
| 06-datei-karte.png | Datei-Karte "Kolonnenshirt empfaenger serienbrief · Tabellenkalkulation · XLSX" | ok |
Noch NICHT gebaut: lokale Ansicht der Excel-Datei (liste-anonym.png wie Folge 12). Design rendert sie aus der .xlsx, Spalten Firmenname/Zusatz/Strasse/PLZ/Ort geschwärzt, Spalte Adressstatus lesbar.

## Ein Satz an den Autor
Mit Websuche (15 Suchen, 4 Seiten gelesen, Gedächtnis aus, kein Konnektor) findet Claude in rund 2 min 40 s für alle fünf Betriebe eine Adresse aus dem Impressum und baut die Excel-Empfängerliste „Kolonnenshirt_Empfaenger_Serienbrief.xlsx“ mit Status, wählt das Impressum als verlässlichste Quelle („Das Impressum ist Pflicht“, „Der Betrieb pflegt die Angabe selbst“, Verzeichnisse hatten bei zwei Betrieben frühere Adressen) – aber eindeutig belegt ist nur eine Adresse, drei muss man prüfen, bei einer widersprechen sich Impressum und Handelsregister-Abschrift, und Claudes nächster Schritt ist das Handelsregister.
