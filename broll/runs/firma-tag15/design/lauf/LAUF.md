# Echter claude.ai-Lauf Folge 15 (Welche Adresse stimmt?), 2026-10-31, 12:01:21–12:04:23 (MEZ)
Chat: https://claude.ai/chat/5bd7f186-a054-426d-b3b4-3153705d7f97 (T3-Preview-Profil "Chrome", Organisation = Pius' eigene Pro-Organisation 77f569ac…, Cookie lastActiveOrg vor dem Senden geprüft, stand bereits richtig), Modell Opus 5.5 Mittel (Composer "Opus 5.5 Mittel", Chat-API effort_level "medium")
Chat-Titel (von claude.ai vergeben): "Empfängeradressen für Werbebrief prüfen"
Weg: neuer Tab (claude.ai/new, Composer leer) -> Plus-Menü geprüft -> Gedächtnis für diesen Chat aus -> 1 Datei angehängt (verstecktes input[type=file], DataTransfer; Datei per lokalem Server 127.0.0.1 in den Tab) -> Prompt per Paste (vor dem Senden 1:1 mit prompt.txt verglichen: identisch, 705 Zeichen) -> "Nachricht senden". KEIN Research ("Recherche" aria-checked=false, blieb aus). Kein eigener Websuche-Schalter; Chat-API settings.enabled_web_search = true, Claude hat gesucht.
**Gedächtnis: für diesen Chat AUS.** "Gedächtnis" im Plus-Menü stand auf an, einmal geklickt, erneut geöffnet: aria-checked=false. Chat-API: settings.chat_memory_mode = "disabled". /api/account vorher und nachher gesichert: vollständig identisch (keine Abweichung in irgendeinem Feld). Kein memory-Aufruf im Protokoll.
**Konnektoren:** nichts angefasst. In den Chat-Einstellungen sind Konnektor-Werkzeuge (u. a. HeyGen, InstantDM, Apify) als verfügbar gelistet (Konto-Standard, nicht von mir geändert); im Protokoll **kein einziger Konnektor-Aufruf**, keine Freigabe-Abfrage, kein Dialog.
Nichts verbunden, nichts gekauft, nirgends angemeldet, nichts geteilt, nichts versendet. Am Composer "Manuell". Login/Geld verlangt: nein. Rückfragen: keine.
Anhang (liegt hier als `Anhang_Kolonnenshirt_Empfaenger_Serienbrief_Lauf14.xlsx`): Claudes Excel-Datei aus Lauf 14 unverändert (11256 Byte); Karte "XLSX".
Erster Satz: "Ich lese zuerst die Excel-Datei und prüfe dann jede Adresse über öffentliche Quellen."

## Prompt (wörtlich, auch prompt.txt)
Im Anhang ist mein letztes Ergebnis: die Empfängerliste für meinen ersten Werbebrief als Excel-Datei. Fünf Betriebe, aber eindeutig belegt ist nur eine Adresse. Bei drei soll ich noch prüfen, bei einem widersprechen sich Impressum und eine Abschrift aus dem Handelsregister. Klär mit der Websuche über öffentliche, möglichst amtliche Quellen, welche Adresse je Betrieb stimmt. Zum Beispiel Handelsregister oder Unternehmensregister, sofern ohne Login einsehbar. Markiere, welche Briefe sicher rausgehen können und welche nicht. Nenn je Adresse die Quelle. Nimm nur Firmenangaben, keine privaten Daten. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts. Gib mir die aktualisierte Excel-Datei zurück.

## Ergebnis
Dauer: ca. 3 min (gesendet 12:01:21, erster Block 12:01:22, letzter Block 12:04:16, Nachricht fertig 12:04:23; Chat-API).
Werkzeuge laut Chat-API: 1 Read (Excel), **18 Websuchen**, **5 Seitenabrufe (WebFetch), davon 2 fehlgeschlagen** (webvalid-Abschrift und Tillmann-Impressum: "URL was not in any prior search result") -> **3 Seiten wirklich gelesen**: North-Data-Firmenseite HRA 7974, North-Data-Registereintrag Nr. 3, postleitzahl-finden.de (PLZ 09126). UI-Zeile: "Eine Datei geteilt, das Web durchsucht und 15 weitere Schritte" (während des Laufs "5 Seiten gelesen", zählt die Fehlversuche mit). 2 TaskCreate, 3 TaskUpdate, 1 Skill (xlsx), 4 Bash (openpyxl), 1 SendUserFile (Bildunterschrift: "Neue Spalten im Blatt „Empfaenger“: Versand, Quelle_Adresse, Geprueft_am. Neue Belege unten im Blatt „Belege“ (Abrufdatum 31.10.2026)."). Kein Konnektor.
**Amtliches Register NICHT geöffnet.** Claude wörtlich: "Die amtlichen Seiten handelsregister.de und Unternehmensregister selbst: Deren Suche läuft über ein Formular, das ich nicht bedienen kann. Den [Betrieb]-Eintrag habe ich nur über die Wiedergabe bei North Data gelesen." Die Registerangaben stammen also von einem Drittanbieter (North Data), nicht vom Register selbst.

Datei (Karte "Kolonnenshirt empfaenger serienbrief · Tabellenkalkulation · XLSX"): `Kolonnenshirt_Empfaenger_Serienbrief.xlsx` (13636 Byte, über die Datei-API des Tabs unverändert geladen). Blatt "Empfaenger" jetzt 12 Spalten: + **Versand**, **Quelle_Adresse**, **Geprueft_am** (31.10.2026). Adressstatus jetzt bei allen fünf "Belegt". Versand: **4 × "Ja", 1 × "Ja mit Vorbehalt"**, 0 × "Nein". "Belege" 36 Zeilen (Lauf-14-Zeilen "Vorrecherche" + 13 neue mit Abrufdatum). "Legende und Offen" neu (Versand-Regeln + 6 nicht geprüfte Punkte). Volltext: liste-text.txt (enthält Namen/Adressen, nur intern).

**Kernsatz:** "Vier Briefe können ohne Einschränkung raus. Einer kann raus, wenn du vorher kurz die PLZ prüfst. Den Widerspruch bei [Betrieb] konnte ich klären."
**Widerspruch (Übergabe Folge 14) geklärt, laut Claude:** Brief an die Impressum-Adresse. "Die [Register-Abschrift-Adresse] ist die Anschrift aus der Ersteintragung von 2014. [...] Danach wurde im Handelsregister eine neue Anschrift eingetragen: Eintragung Nr. 3 nennt als Geschäftsanschrift [Impressum-Adresse], eingetragen am 08.09.2015. Seitdem gab es keine weitere Änderung der Anschrift. Die letzte Veröffentlichung im Register stammt vom 18. Februar 2026 (Jahresabschluss 2024). Das Impressum mit dem Vermerk von 2010 stimmt also noch." (Quelle: North-Data-Wiedergabe.)
**Die drei "prüfen"-Fälle:**
- Betrieb mit nur einer Quelle + abweichendem Namen: "Versand ja." Zweite Bestätigung über 11880 ("vom Inhaber bestätigt"), Das Örtliche, Sellwerk (überwiegend Suchtreffer, Seiten nicht abgerufen); Namensfrage über eigene Website + BNI-Verzeichnis "geklärt" (Datei: "sehr wahrscheinlich derselbe Betrieb").
- Betrieb mit zwei Anschriften im Impressum: "Versand ja, an den Sitz" (außerhalb Chemnitz). Das Örtliche und 11880 bestätigen den Sitz.
- Betrieb mit PLZ-Abweichung: "Versand ja, aber mit Vorbehalt." Straße hat Abschnitte mit zwei PLZ, Nachbarnummern sprechen für die Impressum-PLZ; "Für die Hausnummer [...] selbst habe ich die PLZ aber nicht bestätigt. Prüf sie vor dem Druck kurz in der PLZ-Suche der Deutschen Post."
- Der schon belegte Betrieb: "Versand ja. Ich habe keine neue Quelle gefunden, die etwas anderes sagt."
**Nicht prüfen (laut Claude):** amtliches Handelsregister/Unternehmensregister selbst (Formular), PLZ des einen Betriebs, ob zwei Anschriften Geschäftsräume oder Wohnungen sind ("Beide Betriebe veröffentlichen sie selbst als Firmenanschrift"), Zustellbarkeit, ob ein Betrieb Post lieber an die Betriebsstätte hätte. In der Datei zusätzlich: Handwerksrolle der HWK nicht öffentlich abfragbar.
**Claudes Tipp für den amtlichen Weg (Datei):** "handelsregister.de > Normale Suche > Registerart HRA, Nummer [...], Gericht Chemnitz > „AD“ (aktueller Abdruck, kostenlos)." Nicht von Claude ausprobiert.
**Für den Serienbrief (Datei, Legende):** "Blatt „Empfaenger“ als Datenquelle; Filter auf Versand. Felder: Firmenname, Zusatz, Strasse, PLZ, Ort, Quelle_im_Brief."
**Kein "Als Nächstes" im Chat.** Claudes offene Handlungen: PLZ in der Post-Suche prüfen; Serienbrief mit Blatt "Empfaenger" als Datenquelle. Übergabe-Vorschlag Folge 16 daraus: "Als Nächstes: Wie kommen die Adressen in den Brief?" (Serienbrief = Brief aus Lauf 13 + diese Liste; Drucken/Porto/Einwerfen = Menschen-Schritt).
Quellen in der Antwort: 9 Links (2 × North Data, webvalid, Demeter-Impressum, Das Örtliche, M3-Website, 11880, BNI, plzplz.de; fast alle mit Betriebsnamen im Linktext).

## Auffälligkeiten (nur festgehalten, nichts korrigiert)
- **"Amtlich" ist es nicht:** Die Klärung stützt sich auf North Datas Wiedergabe des Registers. Nie "im Handelsregister geprüft" erzählen, sondern "Registereintrag, gelesen bei einem Datendienst".
- Der Status springt von 1 × "Belegt" auf 5 × "Belegt", teils nur durch Suchtreffer-Verzeichnisse (11880, Das Örtliche). Für den belegten Betrieb gab es heute keine neue Quelle (nur ein Suchtreffer, nichts Neues).
- Zwei Fehlabrufe (Permissions-Error) wiederholt Claude nicht direkt; Impressum des Widerspruch-Betriebs heute nicht neu gelesen.
- Personenbezug wie Lauf 14: 4 von 5 Einzelunternehmen, Firmenname = Inhabername. Keine Namen, Straßen, PLZ, Orte außer "Chemnitz" lesbar in Video, Caption, Guide. Der Sitz-Ort außerhalb Chemnitz wird nicht genannt. Registernummer nicht zeigen (führt zum Betrieb).
- Leak-Check Klon: 0 × Pius/Niklas/Florent/boilr/Hamburg; der eine Treffer "Superkind" (sr-only Statuszeile "Claude Desktop … zu Superkind gewechselt") vor dem Rendern entfernt; nav/aside entfernt, aria-labels "Weitere Optionen für …" entfernt. Datei-Vorschau-Panel (öffnete sich nach dem Lauf rechts) vor dem Klon geschlossen.

## Screenshots (echte claude.ai-Pixel, DOM-Klon ohne Sidebar, Dark Mode, headless Chrome 1280 px breit × 1,5, Chat-Spalte zugeschnitten)
| Bild | Inhalt | Video |
|---|---|---|
| 01-prompt-mit-anhang.png | Anhang-Karte "Kolonnenshirt_Empfaenger_Serienbrief.xlsx · XLSX" + Prompt (ohne Composer/Begrüßung) | ok |
| 07-schritte-zeile.png | erster Satz + "Eine Datei geteilt, das Web durchsucht und 15 weitere Schritte" | ok |
| 03-kernsatz(-anonym).png | "Vier Briefe können ohne Einschränkung raus. Einer kann raus, wenn du vorher kurz die PLZ prüfst. Den Widerspruch bei [ ] konnte ich klären." | nur -anonym |
| 05-register-widerspruch(-anonym).png | Absatz zum Widerspruch (Ersteintragung 2014 / Eintragung Nr. 3 vom 08.09.2015 / "Das Impressum … stimmt also noch") | nur -anonym |
| 02-versand-ergebnis(-anonym).png | ganze Antwort Kernsatz + 5 Betriebe mit "Versand ja"/"Versand ja, aber mit Vorbehalt" | nur -anonym |
| 04-nicht-pruefen(-anonym).png | "Was ich nicht prüfen konnte" (Formular, North Data, PLZ, Wohnung, Zustellbarkeit) | nur -anonym |
| 09-einzelunternehmen(-anonym).png | "Die vier anderen Betriebe sind Einzelunternehmen …" | nur -anonym |
| 08-quellen(-anonym).png | Sources (9 Links, anonym komplett geschwärzt) | nur -anonym |
| 06-datei-karte.png | Datei-Karte "Kolonnenshirt empfaenger serienbrief · Tabellenkalkulation · XLSX" | ok |
Noch NICHT gebaut: lokale Ansicht der neuen Excel-Datei (wie Folge 12/14). Design rendert sie aus der .xlsx: Spalten Firmenname/Zusatz/Strasse/PLZ/Ort/Quelle_im_Brief/Pruefhinweis/Quelle_Adresse geschwärzt, **Adressstatus + Versand lesbar** (4 × "Ja" grün, 1 × "Ja mit Vorbehalt" gelb), Geprueft_am "31.10.2026" ok.

## Ein Satz an den Autor
Mit Websuche (18 Suchen, 3 Seiten wirklich gelesen, Gedächtnis aus, kein Konnektor) klärt Claude in rund 3 Minuten den Widerspruch – die Register-Abschrift zeigte nur die Anschrift der Ersteintragung 2014, ein späterer Registereintrag von 2015 nennt die Impressum-Adresse – und gibt per aktualisierter Excel-Datei vier Briefe frei („Versand Ja“) und einen mit Vorbehalt (Postleitzahl vor dem Druck prüfen); das amtliche Handelsregister selbst konnte Claude nicht bedienen (Formular), den Eintrag las es nur bei einem Datendienst (North Data).
