# Wirtschaftsbuch v2 · „KI baut mein Unternehmen“ (@pickthecompany)

Stand: 2026-10-26 abends, Neustart ab Tag 1. Angepasst an den Format-Entscheid Pius (briefing.md, firma-neu-tag1).
Die Fassung vor dem Format-Entscheid liegt als Kopie in `broll/runs/firma-neu-tag1/_verworfen-r2/wirtschaftsbuch-v2-vor-format.md`. Die alte `wirtschaftsbuch.md` ist nur Material und wird nicht fortgeschrieben.
Fiktives Experiment: Firma, Kunden und Zahlen sind erfunden, bis echte Läufe sie liefern. Jede Aussage über Claude ist mit support.claude.com, Herstellerdoku oder GitHub belegt.
Konzept mit Quellen: `broll/runs/firma-neu-tag1/konzept.md`.

## 1. Prämisse und Leitfrage
**Was passiert, wenn eine KI ganz alleine ein komplettes Unternehmen aufbaut?**
Die KI startet ohne Produkt, ohne Kunden und ohne Geld. In den ersten Folgen findet sie nachvollziehbar ihr Geschäft, und zwar das von Pius gewählte:
- **Firmenshirts mit Logo**
- **Druck auf Bestellung**
- **für Betriebe unter 10 Leuten**

Ein Druckpartner druckt und verschickt. Die KI macht alles am Schreibtisch.
Jede Folge ist **ein einziger, kleinster Gründungsschritt**. Er wird so gezeigt, wie ihn ein Unternehmer für die eigene Firma mit Claude nachmacht. Die Werkzeuge stehen im Guide (Kommentar → DM).
Der Firmenname ist bis Tag 8 offen. Bis dahin heißt sie „die Shirt-Firma“.

## 1b. Was die Firma besser macht als Selbstbestellen (Hypothese, Story)
Einwand jedes Unternehmers: „Warum nicht selbst bei einem Druckanbieter ohne Mindestmenge bestellen?“
Unsere Hypothese **„Logo schicken, fertig“** sieht so aus:
- Logo aufbereiten
- Größen beim Team einsammeln
- eine Sammelbestellung
- eine Rechnung an den Betrieb
- Nachbestellung auf Zuruf

Sie wird in **Tag 3** in einem echten Research-Lauf geprüft. Fällt sie durch, ändert die KI ihr Angebot sichtbar in der Folge.

## 2. Regeln (gelten jede Folge)
- **Eröffnung (Vorschlag, Chef entscheidet):** „Was passiert, wenn eine KI ganz alleine ein Unternehmen aufbaut? Ich probier das aus. Tag <N>.“ Die alte Eröffnung „KI baut ein Unternehmen von Null. Ganz alleine. Tag <N>.“ bleibt als Variante.
- **Erzähler „ich“:** erzählt in ganzen Sätzen, hält sich raus, erfindet keine Gefühle oder Erlebnisse. Persönliches nur aus echten Momenten.
- **Länge:** 30–38 s, 85–105 Wörter, Zahlen als Wörter im Skript.
- **Aufbau:**
  1. Leitfrage + Tag
  2. Stand in einem Satz
  3. „Heute …“ (ein Schritt)
  4. So geht das mit Claude (höchstens 3 Schritte)
  5. echtes Ergebnis
  6. Entscheidung der KI
  7. offene Frage für morgen
  8. „Kommentiere <WORT>, dann schick ich dir den Guide mit …“
- **Echtes Ergebnis statt Behauptung:** Jede Folge braucht einen echten, abfotografierten claude.ai-Lauf. Bis dahin steht im Skript `[ECHTES ERGEBNIS: …]`. Keine wörtlichen Claude-Antworten, keine Rechnungen und keine Zahlen der KI ohne Lauf. Die Entscheidung der KI ist Story, muss aber zum echten Ergebnis passen.
- **Sprache:** gesprochenes Deutsch, das ein Handwerksmeister selbst so sagen würde. Kein Telegramm-Stil, kein „Claude antwortet mit Quellen“ ohne Inhalt. Im Gesprochenen „Gmail verbinden“, nicht „MCP“. Fachbegriffe (Skill, MCP, Repo) gehören in den Guide.
- **Nur Claude**, nie ChatGPT. Superkind höchstens leise (im Guide als zweiter Weg, im Video höchstens ein Logo).
- **Guide pro Folge** nach video-guidebook v3 (Quick Win, Klickpfade, ≥ 6 Prompts, 6–12 verifizierte GitHub-Repos, Konsole, eigener SKILL.md, Stolperfallen). Lieferung per Zernio-DM an alle, die das Wort kommentieren.
- **Caption:** kurzer Text mit Klickpfad, danach „(Fiktives Experiment, keine echten Umsätze.)“, danach nur noch Hashtags. Keine Emojis, kein Superkind-Preis.
- Nie erwähnen, dass keiner kommentiert hat. Keine erfundenen echten Personen, Handles oder Kommentare.

## 3. Figuren
- **Die KI / Gründer-Agent** (Superkind-Figur, orange): Hauptfigur. Startet mit nichts, plant, entscheidet. Einzige orange Figur.
- **Ich** (Erzähler, ohne Gesicht): gibt die Aufgabe, hält sich raus, muss bei Unterschrift, Amt und Bank selbst ran. Im Bild höchstens als Hand, die etwas hinlegt oder zurückzieht.
- **Druckpartner** (Bot in Palettenfarbe, z. B. blau, an der Druckmaschine): erscheint ab Tag 5. Kein echter Firmenname im Bild, außer der echte Lauf wählt einen und Pius gibt ihn frei.
- **Kunden** (Bots in gemischten Palettenfarben mit Berufs-Requisit): erscheinen ab Tag 16, jeder auf einer eigenen Insel.
- **Claude** nur als echte Oberfläche (claude.ai, echtes Logo), nie als nachgebaute Figur.

## 4. Welt (TrainerWorld3D-Look, Superkind Weiß/Orange)
- **Gründer-Tisch** im leeren Holzraum: Laptop mit claude.ai-Fenster. Bis Tag 1 endet, liegt dort nichts außer einem Fragezeichen-Schild „Produkt?“.
- **Partner-Insel** mit Druckmaschine ab Tag 5. Die Maschine gehört dem Partner, nicht der KI.
- **Laufband** vom Partner zu den Kunden-Inseln ab Tag 18.
- **Zähler am Objekt (M-005):** „KASSE“ am Tisch (0 € bis zum ersten bezahlten Auftrag) und „TAG <N>“ an der Wand. Ab Tag 17 kommt „SHIRTS VERKAUFT“ auf dem Stapel dazu.
- **Fortschritt der Gründung:** eine Leiste mit 20 Kästchen an der Wand, je Folge eins abgehakt (M-008). Pro Folge eine Schritt-Leiste „1 · 2 · 3“, Schlüsselwort orange (M-011).

## 5. Geldmechanik
- Die Kasse zeigt **Rohertrag**. Sie steht bei **0 €**, bis der erste Auftrag bezahlt ist: **frühestens Tag 14, geplant Tag 17**.
- **Preise werden nicht erfunden.** Tag 5 holt im echten Lauf die Partnerpreise, Tag 7 rechnet daraus in einer echten Excel-Datei Verkaufspreis und Rohertrag je Shirt. Erst dann kommen die Zahlen hierher in Abschnitt 5b. (Die frühere Annahme „25 € je Shirt / ≈ 35 € Rohertrag pro Auftrag“ ist gestrichen.)
- Pro Folge höchstens ein Auftrag oder ein Rückschlag. Nie ein Sprung über 1.000 €. Nie unter 0 €.
- Pro 10 Folgen mindestens ein Rückschlag. Geplant: Tag 15 Absagen, Tag 19 Reklamation. Rückschläge haben immer eine Claude-Lösung.
- Werkzeugkosten (Claude-Plan, Domain, Stripe-Gebühren) zeigen wir nur mit Quelle.

### 5b. Zahlen aus echten Läufen
| Wert | Zahl | Aus Lauf (Tag, Datum, Screenshot) |
|---|---|---|
| Einkaufspreis je Shirt beim Partner | offen | Tag 5 |
| Verkaufspreis je Shirt | offen | Tag 7 |
| Rohertrag je typischem Auftrag | offen | Tag 7 |

## 6. Folgenplan Tag 1–20 (Details, Claude-Wege und Quellen in konzept.md)
| Tag | „Heute …“ | Wichtigste Claude-Funktion |
|---|---|---|
| 1 | findet die KI ihr Produkt | Research + eigene Regeln + Bewertungstabelle (Excel) |
| 2 | findet sie ihren Kunden (welche Branche zuerst) | Projekt mit Projektwissen + Research |
| 3 | prüft sie, was Betriebe beim Bestellen nervt | Research in Bewertungen und Foren |
| 4 | schaut sie sich Konkurrenz und Preise an | Websuche + Excel |
| 5 | findet sie einen Druckpartner | Claude in Chrome + Excel |
| 6 | entwirft sie das Muster-Shirt | Canva-Connector |
| 7 | rechnet sie ihren Preis | Excel mit Formeln |
| 8 | sucht sie einen Namen | Websuche (DPMA prüft der Mensch) |
| 9 | baut sie ihr Logo | Canva-Connector |
| 10 | baut sie ihre Website | Skill frontend-design + Netlify-Connector (Herstellerangabe) |
| 11 | will sie ein Gewerbe anmelden und braucht mich | Research + Checkliste als Word-Datei |
| 12 | richtet sie das Bezahlen ein | Stripe-Connector (Zahlungslink) |
| 13 | findet sie 20 Betriebe in der Region | Apify-MCP (Google Maps) + Excel |
| 14 | macht sie ihre erste Werbung | Canva-Connector |
| 15 | spricht sie die ersten Betriebe an | Brief + Anruf-Leitfaden als Word-Datei |
| 16 | bekommt sie die erste Anfrage | Gmail + Google Kalender |
| 17 | verdient sie ihren ersten Euro | Stripe-Rechnung oder PDF |
| 18 | sammelt sie Größen ein und bestellt | Excel + Gmail-Entwurf an den Partner |
| 19 | bekommt sie die erste Reklamation | Gmail |
| 20 | bittet sie um eine Bewertung und zieht Bilanz | Gmail + Excel mit Diagramm |

## 7. Tatsächlicher Verlauf
| Tag | Gepostet am | Schritt | Echtes Ergebnis (Lauf) | Kasse danach | Shirts verkauft | Notiz |
|---|---|---|---|---|---|---|
| 1 (Serientag 1) | 2026-10-28 15:00 | findet die KI ihr Produkt (Research, eigene Regeln, eine Frage) | Research complete, 314 Quellen, 5m 30s: am besten passen Drucksachen und Logo-Arbeitskleidung (Printful/Shirtee Cloud, Printful ohne Mindestmenge); Nachbestell-Häufigkeit in keiner Statistik gefunden. KI wählt Firmenshirts. | 0 € | 0 | Offener Faden für morgen: wie oft Betriebe nachbestellen (Ticket an Autor: Tag 2 im Plan = Kunde/Branche). Regie 2026-10-26. |
| 2 (Serientag 1, „Kunde“) | 2026-10-28 18:00 (Reel DfC7KXhEb9A) | findet sie ihren Kunden (Research, Tag-1-Bericht angehängt) | Research complete, 264 Quellen, 7m 0s (Chat 0bf4be50…): vorne Bau-/Ausbauhandwerk (335.272 Betriebe < 10 Beschäftigte, Destatis 2024), Gastronomie, Friseure; Handwerk bestellt etwa ein- bis zweimal im Jahr nach; ehrlich: keine Statistik, begründete Schätzung. KI nimmt das Handwerk. | 0 € | 0 | Offener Faden: Was nervt diese Betriebe beim Bestellen? Nachgetragen vom Chef 2026-10-28 abends. |
| 3 (Serientag 1, „Ärger“) | 2026-10-28 21:00 | prüft sie, was Handwerksbetriebe beim Shirt-Bestellen nervt (Research nur Bewertungen/Foren/Ratgeber) | Research complete, 301 Quellen, 6m 50s (Chat 912070ab…): Logo falsch 14, Service 14, Größen 12, Lieferverzug 12, Druck löst sich beim Waschen 10 Belege. KI klärt zuerst das Waschen (Empfehlung 1 des Berichts): Bau 60 °C, gängige Drucke für kleine Mengen ~30 °C. Grenze: nur 1 Beleg ausdrücklich aus dem Handwerk. | 0 € | 0 | Hypothese „Logo schicken, fertig“ nicht direkt widerlegt, aber Waschfestigkeit wird Pflicht. Offener Faden: Welcher Druck hält 60 Grad? Nachgetragen vom Chef 2026-10-28 abends. |
| 4 (Serientag 2, „Druck“) | 2026-10-29 09:00 (geplant) | findet sie den Druck, der 60 Grad aushält (Research, Bericht Folge 3 angehängt) | Research complete, 246 Quellen, 5m 21s (Chat 798a28cb…): 8 Verfahren verglichen; nur Stickerei ist ab 1 Stück bestellbar und für 60 °C und mehr freigegeben (gleicher Anbieter: Stick 95 °C, Digitaldruck 30 °C; Siebdruck lohnt erst ab 50, Transfers ab 10/20; Stick ca. 1 € Aufpreis). KI nimmt Stickerei. Grenze: fast alle Gradzahlen sind Anbieterangaben, eigener Waschtest (10–20× 60 °C) offen. | 0 € | 0 | Folge 3 korrigiert: 30 °C sind Pflegeangaben, keine Materialgrenze. Ab Folge 5 Rückblick „bestickt erst auf Bestellung“. Offen für später: Brustlogo als Stick max. ca. 8–9 cm, 3–6 Farben (Logo-Folge); Stückpreis Shirtigo nicht gefunden (Partner-Folge). Offener Faden: Was verlangt die Konkurrenz für bestickte Shirts? Regie 2026-10-28 abends. |
| 5 (Serientag 2, „Konkurrenz“) | 2026-10-29 12:00 (geplant) | vergleicht sie Konkurrenzpreise (Research, Bericht Folge 4 angehängt) | Research complete, 295 Quellen, 7m 19s (Chat 38be4ae6…): 14 Anbieter; fünf bestickte Shirts ab rund 110 € inkl. Einrichtung und Versand (Spreadshirt 109,95 €, workwear one 110,85 €, beide von Claude addiert), andere 150 bis über 200 €; fünf Anbieter nehmen fünf Stück nicht an (ab 10–30), selbst der günstigste Workwear-Shop stickt erst ab 5. KI hält beim Preis mit und setzt auf einzelne Nachbestellungen ohne neue Einrichtung. Grenze: fast alle Summen sind Untergrenzen, von Claude addiert. | 0 € | 0 | Rückblick ab hier „bestickt erst auf Bestellung“ + „Zuletzt nahm sie Stick, bis 95 Grad“. Board: DRUCK erledigt, PREIS current bis Folge 7. Bild trennt Stick-Garn 95 °C und Shirt-Stoff 60 °C. Offen für später: Spreadshirt-Stick im Preis? (n. g.); Lieferzeit < 10 Werktage als Vorteil. Offener Faden: Welcher Partner stickt Sechzig-Grad-Shirts einzeln, ohne Neueinrichtung? Regie 2026-10-28 abends. |
| 6 (Serientag 2, „Partner“) | 2026-10-29 15:00 (geplant) | sucht sie einen Partner, der einzeln stickt und direkt verschickt (Research, Bericht Folge 5 angehängt) | Research complete, 294 Quellen, 5m 56s (Chat c874de02…): 7 Partner in der Tabelle (A61, Printful, Shirtigo, Gelato, Spreadconnect, Customwear, Printify). KI nimmt A61 (a61partner.de) unter Vorbehalt bis zum Händlerangebot: nur dort ein besticktes 60-°C-Arbeitsshirt belegt (HAKRO MIKRALINAR No. 281 „Wäsche 60°C“, ab 29,90 €), Bestellung ab 1 Stück; Dropshipping eingebaut (nur Caption/Guide). Haken: zum Ladenpreis 5 Shirts 151,40 € inkl. Versand gegen rund 110 € am Markt (−41,40 €). Grenze: Händlerpreise, Einrichtungs-/Stickprogramm-Kosten, Lieferzeit bei A61 nicht gefunden. Zweite Wahl Printful (Marge belegbar, Nachbestellung ohne neue Einrichtung, aber kein 60-°C-Shirt belegt). | 0 € | 0 | Übergabefrage aus Folge 5 zu 2 von 3 belegt (60 °C, ab 1 Stück), Einrichtung offen. Rückblick-Satz 2 „Ihre Lücke: Shirts einzeln nachbestellen.“ Board: PREIS bleibt in Arbeit, PARTNER als neuer Schritt dahinter (current), Folge 7 setzt PARTNER (unter Vorbehalt) erledigt und schließt PREIS ab. Story-Objekt A61-Karte mit roter Rechnung und Feldern „Händlerpreis: ?“ / „Einrichtung: ?“. Keine angekündigte Anfrage (Mail-Connector nicht freigegeben, Notiz an Pius in thema.md). Musik GONE ab 100,16 s (Refrain-Einsatz auf „A61“). Offener Faden: Bleibt pro Shirt überhaupt etwas übrig? (Folge 7 rechnet mit A61-Ladenpreis als Obergrenze und Printful-Kosten; Händlerpreis und Einrichtung als offene Posten). Regie 2026-10-28 abends. |

### Zählung ab 2026-10-28
Spalte „Tag“ oben = laufende Folge (`folge`). Der gezeigte „Tag N“ ist der Kalendertag (Serientag): 2026-10-28 = Serientag 1 (Folgen 1–3), 2026-10-29 = Serientag 2 (Folgen 4–8, 9:00–21:00). Kette für Serientag 2 und Korrektur der Folgenliste: `broll/runs/firma-tag4/tagesbriefing-2026-10-29.md`.
