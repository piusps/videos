# Folge „Gewerbe“: Frage + echte Checkliste (Lieferung für Kommentare „Gewerbe“)

Stand R2 (2026-10-30, Tickets autor-R1-03/-04/-05). In dieser Datei steht der Stadtname aus dem Lauf bewusst nicht; er heißt hier überall **[Ort]**.

## Was der Guide liefern muss
Das Skript verspricht: „ich schick dir Frage und echte Checkliste. Damit hast du in zehn Minuten deine Startliste für dein eigenes Business.“ Die Caption verspricht dazu Mensch/Claude-Markierung und Quellen. Also genau:
1. **Die Frage zum Kopieren** (unten, Vorlage A mit Anhang, Vorlage B ohne Anhang).
2. **Die echte Checkliste aus dem Lauf** (13 Punkte, 3 Phasen, Spalten Aufgabe · Wer · Quelle) mit den Stempeln „Mensch“ (9) und „Claude“ (4), Quellen mit Kennzeichnung Behörde/Kammer vs. „nicht amtlich“ wie in der Datei. **1:1 außer den [Ort]-Stellen** (Tabelle unten).
3. **„Was als Erstes kommt“ + Claudes drei Gründe** und **„Was Claude nicht prüfen konnte“**, ebenfalls 1:1 außer den [Ort]-Stellen.

Kein Versprechen, dass die Liste vollständig oder rechtssicher ist (Claude nennt selbst „Weitere mögliche Pflichten, die ich nicht recherchiert habe“). Kein Wort „Pflicht-Checkliste“. **Keine Rechts- oder Steuerberatung** (Claude: „Ich bin kein Anwalt und kein Steuerberater.“). Nicht erzählen, dass irgendetwas angemeldet wurde. Claudes Bitte um Name/Anschrift am Ende des Chats nicht zeigen.

## [Ort]-Stellen und Behandlung (K.-o., Chef-Entscheid: Stadt nie in Video, Caption, Guide, Replies)
| # | Fundstelle | Original (Ort ersetzt) | Behandlung im Guide |
|---|---|---|---|
| 1 | Datei, Grund 3 (checkliste-text.txt Z. 8) | „Sie ist schnell und günstig. 25 € in [Ort], einreichbar beim Bezirksamt oder bei der Handelskammer. Kein anderer Punkt …“ | **Gekürzt:** „Sie ist schnell und günstig. Kein anderer Punkt der Liste hängt an so wenig Vorarbeit.“ Betrag, Ort, „Bezirksamt“, „Handelskammer“ **weglassen**. |
| 2 | Datei, Titel Punkt 1 (Z. 18) | „Gewerbe in [Ort] anmelden (zuerst)“ | **Neutral:** „Gewerbe anmelden (zuerst)“. |
| 3 | Datei, Punkt 1 Text (Z. 19) | „… Zuständig ist das Bezirksamt deines Betriebssitzes; die Handelskammer [Ort] nimmt Anmeldungen ebenfalls an. Gebühr laut Handelskammer: 25 €.“ | Erster Satz („Pflicht nach § 14 GewO: …anzeigen.“) bleibt; Zuständigkeit + Gebühr **weglassen**. Redaktionelle Fußnote (als unsere, nicht als Claudes Aussage): „Zuständigkeit und Gebühr hat Claude im Lauf für eine einzelne Stadt genannt; wir lassen sie weg. Auskunft gibt die Gewerbebehörde vor Ort.“ |
| 4 | Datei, Quelle Punkt 1 (Z. 24) + Chat-Quellenliste | „Handelskammer [Ort]: Gewerbeanmeldung“ (URL handelskammer-[ort].de) | **Weglassen** (Name und URL). Punkt 1 behält Quelle „§ 14 GewO (Gesetze im Internet)“. |
| 5 | Datei, Quelle Punkt 9 (Z. 95) + Chat-Quellenliste | Landesdatenschutz-Quelle mit Ortskürzel im Namen („[Ort-Kürzel]BfDI: Datenschutzkonformer Internetauftritt“, URL datenschutz-[ort].de, PDF) | **Weglassen** (Kürzel, Name und URL). Punkt 9 ohne Quelle, Zusatz „Quelle im Lauf: Landesdatenschutzbehörde (ortsbezogen, entfernt)“. |
| 6 | Datei „Was ich nicht prüfen konnte“ (Z. 131) + Chat-Nicht-prüfen-Liste | „Den offiziellen [Ort]-Service-Eintrag … konnte ich nicht direkt öffnen. Gebühr und Zuständigkeit stammen von der Handelskammer [Ort].“ | **Weglassen** (ganzer Punkt). |
| 7 | Chat-Schlussantwort, Überschrift | „Als Erstes kommt die Gewerbeanmeldung in [Ort]“ | **Neutral:** „Als Erstes kommt die Gewerbeanmeldung“. |
| 8 | Chat-Schlussantwort, Grund 3 | „Sie kostet 25 €, und du kannst sie beim Bezirksamt oder bei der Handelskammer abgeben.“ | **Weglassen**; nur „Sie ist schnell und günstig.“ |
| 9 | LAUF.md, Websuchen-Liste (1. und 5. Suche) | „Gewerbeanmeldung [Ort] online“, „[ort].de Gewerbeanzeige …“ | Nicht in den Guide; im Guide nur „18 Websuchen“. |
| 10 | Bilder: `05-nicht-pruefen.png` (Nicht-prüfen-Liste, Ortsname 2× im Punkt zum Ortsportal/Kammer), `03-entscheidung-gruende.png` (Zeile endet mit Ort, Grund 3), `02-quellen.png` (Quellenliste), `04-nur-ein-mensch-word.png` + `checkliste-ansicht.png` (Punkt 1, Gebühr-Zeile) | Ort steht als Pixel im Bild | Nur **beschnitten oder abgedeckt** verwenden; jede Guide-Seite als Bild ansehen (grep findet keine Pixel). |

**Gebühr: Entscheid = ganz weglassen.** Die einzige Quelle für „25 €“ ist die Kammer-Seite mit dem Ortsnamen im Titel und in der URL; ohne sie wäre die Zahl im Guide unbelegt. „Je nach Stadt verschieden“ steht nicht im Lauf und wäre unsere Aussage ohne Quelle. Deshalb nur die neutrale Fußnote aus Zeile 3 (Verweis auf die Gewerbebehörde vor Ort, ohne Betrag). Chef-Vorgabe „sonst nicht nennen“ ist damit erfüllt.

**Abnahmekriterien für den fertigen Guide-Text (guidebook.json/HTML):** Suche ohne Groß-/Kleinschreibung nach dem Ortsnamen und nach dem Ortskürzel der Datenschutzquelle (beide stehen in `design/lauf/LAUF.md`, Abschnitt „Auffälligkeiten“, erster Punkt, bzw. in den Sources) = 0 Treffer; dazu `grep -ic bezirksamt` = 0, `grep -c "25 €"` = 0 (falls der Betrag nirgends sonst vorkommt), `grep -c "\[Ort\]"` = 0; alle eingebundenen Bilder (auch 05) visuell ohne Ortsnamen.

## Weg (Guide-Text)
claude.ai → neuer Chat → „+“ → letztes Ergebnis anhängen (z. B. Website-Entwurf oder Angebot) → Frage einfügen → senden. Websuche läuft ohne eigenen Schalter (Lauf 29.10.2026: 18 Suchen), Research nicht nötig. Die Word-Datei erscheint als Karte im Chat („Dokument · DOCX“). Dauer im Lauf: 4 min 52 s; mit Ausfüllen und Lesen ≈ 10 Minuten. Ohne Datei zum Anhängen: Vorlage B. Tipp aus dem Lauf: Gedächtnis für den Chat ausschalten, wenn private Daten nicht einfließen sollen (Plus-Menü, Häkchen „Gedächtnis“).

## Vorlage A (mit Anhang)
> Im Anhang ist mein letztes Ergebnis. Ich verkaufe [PRODUKT] an [ZIELGRUPPE], [WIE/ÜBER WEN GELIEFERT WIRD]. Mein letztes Ergebnis: [STAND IN EINEM SATZ, z. B. Website steht als Entwurf, Impressum fehlt]. Eine angemeldete Firma habe ich noch nicht. Finde mit der Websuche heraus, was ich in Deutschland vor dem ersten Verkauf anmelden oder klären muss, jeweils mit offizieller Quelle. Entscheide, was davon als Erstes kommt, und begründe es mit zwei bis drei konkreten Gründen. Markiere, was du selbst erledigen kannst und was nur ein Mensch machen kann. Mach daraus eine Checkliste als Word-Datei. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts.

## Vorlage B (ohne Anhang)
Erster Satz entfällt, der Stand steht nur im Text:
> Ich verkaufe [PRODUKT] an [ZIELGRUPPE], [WIE/ÜBER WEN GELIEFERT WIRD]. Mein Stand: [STAND IN EINEM SATZ, z. B. Preisliste steht, noch keine Website]. Eine angemeldete Firma habe ich noch nicht. Finde mit der Websuche heraus, was ich in Deutschland vor dem ersten Verkauf anmelden oder klären muss, jeweils mit offizieller Quelle. Entscheide, was davon als Erstes kommt, und begründe es mit zwei bis drei konkreten Gründen. Markiere, was du selbst erledigen kannst und was nur ein Mensch machen kann. Mach daraus eine Checkliste als Word-Datei. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts.

(Original im Lauf: „Ich verkaufe Firmenshirts mit gesticktem Logo an kleine Handwerks- und Baubetriebe unter zehn Leuten, gestickt erst auf Bestellung über Printful, unter dem Namen Kolonnenshirt. Mein letztes Ergebnis: Die Startseite steht als Entwurf, aber bevor sie online geht, fehlen unter anderem Impressum, Datenschutz und die Frage, ob ich nur an Firmen verkaufe.“)

## Beispiele nach Beruf (Platzhalter [PRODUKT] / [ZIELGRUPPE] / [WIE/ÜBER WEN GELIEFERT WIRD] / [STAND])
- **Hundefriseurin:** [Hundepflege im Salon] an [Hundehalter im Stadtteil], [im eigenen Salon], Stand [Preisliste steht, Räume noch nicht gemietet] → Vorlage B.
- **Fliesenleger:** [Badsanierung] an [Eigentümer von Altbauwohnungen], [selbst vor Ort, Material vom Großhandel], Stand [erstes Angebot geschrieben] → Vorlage A, Angebot anhängen.
- **Kaffeerösterin:** [Kaffee mit eigenem Etikett] an [Büros], [Versand im eigenen Paket], Stand [Etikett und Preis stehen] → Vorlage A oder B.
- **Fotografin:** [Bewerbungs- und Teamfotos] an [kleine Firmen], [Termine beim Kunden], Stand [Website als Entwurf] → Vorlage A, Entwurf anhängen.

## Echter Lauf (29.10.2026, Chat 6358742d…, 4 min 52 s, Opus 5.5, Gedächtnis aus, 18 Websuchen, 17 Quellenlinks, Word-Datei, nichts angemeldet)
- **Als Erstes (Claudes Entscheidung):** die Gewerbeanmeldung. Gründe: (1) Pflicht ab dem ersten Tag (§ 14 GewO). (2) Die anderen Schritte bauen darauf auf: Fragebogen beim Finanzamt → Steuernummer → Registrierung im Verpackungsregister LUCID; der Umsatzsteuer-Status entscheidet, ob „brutto“ auf der Seite stehen darf. (3) Schnell und günstig (Betrag und Ort weggelassen, s. o.). Parallel: entscheiden, ob nur an Firmen verkauft wird.
- **„Mensch“ (9):** Gewerbe anmelden · ELSTER-Konto + Fragebogen zur steuerlichen Erfassung · Kleinunternehmer ja/nein · nur an Firmen oder auch an Verbraucher · Name bei DPMA/EUIPO prüfen · LUCID-Registrierung · Vertrag duales System + Mengenmeldung · Widerrufsbelehrung + Widerrufsbutton (nur bei Verbrauchern; Claude kann den Button technisch einbauen) · AGB (Claude kann einbinden).
- **„Claude“ (4):** Impressum (sobald Daten da sind, Prüfung durch Anwalt empfohlen) · Datenschutzerklärung · Preis- und Produktangaben · keinen Link zur abgeschalteten OS-Plattform.
- **Neuerung laut Claude:** Seit 12. August 2026 neues Verpackungsrecht (PPWR + VerpackDG); laut Printful reicht deren LUCID-Nummer für Händler nicht mehr.
- **Nicht prüfen konnte Claude:** wer beim Verpackungsrecht als Hersteller zählt (Händler oder Printful), ob die GPSR bei reinem B2B greift, ob die Widerrufs-Ausnahme für Shirts mit Kundenlogo gilt (nur Kanzlei-Quellen), § 36 VSBG; nicht recherchiert: Berufsgenossenschaft, Handwerkskammer, Gewerbesteuer, EUIPO-Suche, Rechte an Kundenlogos. (Punkt zum Ortsportal weggelassen, s. Tabelle Nr. 6.)
