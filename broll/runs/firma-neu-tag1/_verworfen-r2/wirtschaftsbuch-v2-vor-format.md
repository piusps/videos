# Wirtschaftsbuch v2 · „KI baut ein Unternehmen von Null“ (@pickthecompany)

Stand 2026-10-26, Neustart ab Tag 1. Geschäft von Pius gewählt. Die alte `wirtschaftsbuch.md` ist nur Material und wird nicht fortgeschrieben.
Fiktives Experiment: Firma, Kunden und Zahlen sind erfunden. Jede Aussage über Claude ist mit support.claude.com belegt.

## 1. Prämisse
Eine KI gründet ab Tag 1 eine einzige Firma: **Firmenshirts mit Logo, Druck auf Bestellung, für Betriebe unter 10 Leuten.** Ein Druckpartner (Print-on-Demand) druckt und verschickt. Die KI macht alles am Schreibtisch: Idee prüfen, Name, Logo, Preis, Website, Kunden finden, Angebot, Rechnung, Reklamation, Werbung.
Jede Folge = **ein echter Schritt dieser Firma**, und genau dieser Schritt wird mit Claude gezeigt, so dass der Zuschauer (Selbstständige, Mittelstand, eher älter) ihn für die eigene Firma nachbaut.
Der Firmenname ist noch offen (wird in einer Folge gefunden). Bis dahin: „die Shirt-Firma“.

## 1b. Was die Firma besser macht als Selbstbestellen (Hypothese, Story)
Einwand jedes Unternehmers: „Warum nicht selbst bei einem Druckanbieter ohne Mindestmenge bestellen?“ (Solche Anbieter gibt es, z. B. Spreadshirt laut eigenem Profil ohne Mindestbestellmenge.) Unsere Hypothese, als Story markiert und in **Tag 2** mit Claude geprüft: Selbstbestellen heißt für einen Chef mit fünf Leuten, das Logo druckfähig zu machen, das Shirt im Online-Editor selbst zu gestalten, bei jedem Mitarbeiter die Größe abzufragen, alles einzeln zu bestellen und bei jedem Neuen von vorn anzufangen. Die Firma verkauft **„Logo schicken, fertig“**: Logo aufbereiten, Größen beim Team einsammeln, eine Sammelbestellung, eine Rechnung an den Betrieb, Nachbestellung auf Zuruf. Hält die Hypothese der Prüfung in Tag 2 nicht stand, ändert die KI das Angebot sichtbar in der Folge (ehrlicher Story-Schritt, kein Rückzieher im Hintergrund).

## 2. Regeln (gelten jede Folge)
- Eröffnung wörtlich: „KI baut ein Unternehmen von Null. Ganz alleine. Tag N.“ Danach ein Satz: Kasse + Schritt des Tages.
- 30–35 s, 85–95 Wörter, Zahlen als Wörter im Skript.
- Mehrwert bis Sekunde 14: höchstens 3 Schritte mit Claude, echte claude.ai-Oberfläche, Prompt lesbar im Bild.
- Eine kleine Geschichte pro Folge: Plan → Prüfung/Schritt mit Claude → Entscheidung der KI. Keine Aufzählung.
- **Keine wörtlichen Claude-Antworten als Tatsache**, solange sie nicht in einem echten, abfotografierten Lauf (mit Pius' OK) entstanden sind. Gezeigt wird, *was man fragt* und *welche Art Antwort* kommt. Die Entscheidung der KI ist Story und darf erfunden sein.
- Echte Marktfakten nur mit Quelle in `thema.md`.
- Kommentar-Aufruf: ein Keyword, Lieferung im Satz, eine Zernio-DM für alle mit einem Prompt zum Selbstausfüllen (Platzhalter). Nichts versprechen, was nicht automatisch geht.
- Caption: Schritte mit Menüpfad aus der Doku, Fiktiv-Hinweis „(Fiktives Experiment, keine echten Umsätze.)“, 5–6 Hashtags, keine Emojis, kein Superkind-Preis.
- Superkind höchstens leise, nie als „KI-Mitarbeiter“. Nie erwähnen, dass keiner kommentiert hat. Keine erfundenen echten Personen oder Handles.

## 3. Figuren
- **Der Gründer-Agent** (Superkind-Figur, orange): denkt laut, plant, entscheidet. Einzige orange Figur.
- **Druckpartner** (Bot in Palettenfarbe, z. B. blau, an der Druckmaschine): produziert, meldet Probleme. Kein echter Firmenname.
- **Kunden** (Bots in gemischten Palettenfarben, je mit Berufs-Requisit: Pinsel, Schere, Brötchen, Schraubenschlüssel): jeder erfundene Betrieb bekommt eine Insel.
- **Claude** erscheint nur als echte Oberfläche (claude.ai-Fenster, echtes Logo), nicht als nachgebaute Figur.

## 4. Welt (TrainerWorld3D-Look, Superkind Weiß/Orange)
- **Gründer-Tisch** im Holzraum: Laptop mit claude.ai-Paper-Fenster, leerer Shirt-Stapel.
- **Partner-Insel** mit Druckmaschine (gehört dem Partner, nicht der KI).
- **Laufband/Weg** vom Partner zu den Kunden-Inseln, Pakete wandern darauf.
- **Kunden-Inseln**: erscheinen erst mit dem ersten Auftrag; jede trägt ein Mini-Shirt mit erfundenem Logo.
- **Zähler am Objekt (M-005):** „KASSE“ als Etikett auf dem Paket/der Kasse am Tisch, „SHIRTS VERKAUFT“ als Zahl auf dem Stapel. Kein separates Dashboard.
- Sticker, Schritt-Leiste „1 · 2 · 3“ oben (M-008), Schlüsselwort orange (M-011).

## 5. Geldmechanik (feste kleine Schritte)
- Fiktiver Serienpreis: 25 € je Shirt (nicht Superkinds Preis). Typischer Auftrag: 5 Shirts = 125 € Umsatz, **≈ 35 € Rohertrag** nach Druck und Versand.
- Die Kasse zeigt Rohertrag. Sie steht bei **0 €**, bis der erste Auftrag kommt (frühestens Tag 10, geplant Tag 11).
- Pro Folge höchstens: ein Auftrag (+20 € bis +120 € Rohertrag) oder ein Rückschlag (Reklamation/Storno, −10 € bis −60 €). Nie ein Sprung über 1.000 €. Nie unter 0 €.
- Pro 10 Folgen mindestens ein Rückschlag (Druck verrutscht, falsche Größe, Paket verspätet, Kunde springt ab), immer mit Claude-Lösung.
- Grobe Kurve (nur Orientierung): Tag 20 ≈ 100–200 €, Tag 50 ≈ 600–1.000 €, Tag 100 ≈ 2.500–4.000 €. Ziel als Zähler: „10 Betriebe“, dann „50 Betriebe“.
- Kosten für Werkzeuge (Claude, Domain …) werden nur gezeigt, wenn der Preis mit Quelle belegt ist.

## 6. Folgen-Schema (30–35 s)
1. Eröffnung (fest) · 2. Kasse + Plan des Tages (ein Satz) · 3. Haken/Umkehrung (der Plan ist riskant oder falsch) · 4. „Das geht mit jeder Firma/Idee“ (Übertrag, spätestens s 12) · 5. Schritt 1–3 mit Claude · 6. Entscheidung der KI, sichtbares Ergebnis in der Welt · 7. Keyword-Aufruf mit Lieferung.
Frame 1 spielt den Plan des Tages (M-002), Zähler sichtbar.

## 7. Themenplan
| Tag | Schritt der Firma | Claude-Funktion | Quelle |
|---|---|---|---|
| 1 | Idee prüfen: eigene Maschine oder Druckpartner? | Websuche mit Quellen | https://support.claude.com/en/articles/10684626-enable-and-use-web-search |
| 2 | Lücke prüfen: Was nervt kleine Betriebe beim Selbstbestellen? (Hypothese „Logo schicken, fertig“) | Websuche mit Quellen (Bewertungen, Foren, Ratgeber) | 10684626 |
| 3 | Konkurrenz und Preise als Tabelle | Websuche + Excel-Datei | 10684626 + https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude |
| 4 | Druckpartner vergleichen (Mindestmenge, Lieferzeit, Druckart) | Websuche + Excel-Datei | 10684626 + 12111783 |
| 5 | Firmenname finden, Treffer im Netz prüfen | Websuche (Markenprüfung beim DPMA macht der Mensch) | 10684626; DPMA offen |
| 6 | Logo der eigenen Firma | Canva-Connector („Create and edit designs“) | https://support.claude.com/en/articles/13454812-use-interactive-connectors-in-claude |
| 7 | Preis pro Shirt kalkulieren | Excel mit Formeln | 12111783 |
| 8 | Einfache Angebotsseite | Artifact erstellen und teilen | https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them + https://support.claude.com/en/articles/9547008-share-artifacts |
| 9 | 20 passende Betriebe in der Region finden | Websuche → Excel-Liste | 10684626 + 12111783; Kaltakquise-Recht (UWG) offen, Anruf/Brief statt Kalt-Mail |
| 10 | Angebot für den ersten Betrieb (5 Shirts) | Word-Datei + Gmail-Entwurf | 12111783 + https://support.claude.com/en/articles/10166901-use-google-workspace-connectors |
Tag 11: erster Auftrag + Rechnung als PDF (+35 € Rohertrag; 12111783; Rechnungs-Pflichtangaben offen).
Ab Tag 12 Ideen (unbelegt, vor Nutzung prüfen): Größen beim Kunden abfragen, Logo-Datei vom Kunden bereinigen, Reklamation beantworten, Bewertung erbitten, Social Post, Newsletter, Nachbestell-Erinnerung, zweiter Partner, Stick, Vereine.

## 8. Tatsächlicher Verlauf
| Tag | Gepostet am | Schritt | Kasse danach | Shirts verkauft | Notiz |
|---|---|---|---|---|---|
