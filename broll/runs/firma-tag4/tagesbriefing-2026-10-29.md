# Tagesbriefing · Serientag 2 (2026-10-29) · Folgen 4–8 · @pickthecompany

Chef: firma-chef, 2026-10-28 abends. Gilt für alle Stufen aller 5 Folgen. Jede Folge hat zusätzlich ihr eigenes `briefing.md`.
Grundlage weiter gültig: `runs/firma-neu-tag1/briefing.md`, `runs/firma-neu-tag1/konzept.md`, Maßstab Tag 1 v7 und Folge 3 v8 (`runs/firma-tag3/tag3-aerger-v8.mp4`, final-v8.md 8/10).
Serien-Bibel: `~/Desktop/Superkind Videos/_Serie Superkind baut Firma/wirtschaftsbuch-v2.md` (die alte `wirtschaftsbuch.md` ist laut v2 nur Material und wird nicht fortgeschrieben).

## Slots
| Folge | Ordner | Slot (Europe/Berlin) | erste Folge des Tages |
|---|---|---|---|
| 4 | runs/firma-tag4 | 2026-10-29 09:00 | ja: „… Ich probier das aus. Tag zwei.“ + „TAG 2“-Slam im Hook |
| 5 | runs/firma-tag5 | 2026-10-29 12:00 | nein |
| 6 | runs/firma-tag6 | 2026-10-29 15:00 | nein |
| 7 | runs/firma-tag7 | 2026-10-29 18:00 | nein |
| 8 | runs/firma-tag8 | 2026-10-29 21:00 | nein |

## Regeln von Pius (2026-10-28, alle K.-o.)
1. **Eröffnung wörtlich:** „Wie viel Umsatz macht ein Unternehmen, das eine KI hundert Tage lang ganz alleine führt? Ich probier das aus.“ Nur Folge 4 (9 Uhr) hängt „Tag zwei.“ an und zeigt „TAG 2“ groß im Hook. Folgen 5–8 nennen keinen Tag, zählen nicht hoch, kein „Tag 5/6 …“ in Bild, Cover, Caption. Kleines HUD-Badge „TAG 2“ ist ok.
2. **Neueinstieg:** direkt nach der Eröffnung Rückblick in 2 kurzen Sätzen, höchstens 6 s. Satz 1 (fest): „Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, gedruckt erst auf Bestellung.“ (nie „Ihre Firma“). Satz 2: wie weit sie ist = Ergebnis der Vorfolge. Erst danach „Heute …“. Bild: gleich aufgebauter Rückblick-Akt (Shirt-Karte + Gründungsboard mit Haken, zuletzt erledigter Schritt leuchtet, dann Kamerafahrt zum heutigen Schritt). Ein Neuer versteht spätestens bei 14 s Projekt + heutigen Schritt.
3. **Schritt-Kette:** jede Folge startet sichtbar beim Ergebnis der Vorfolge und macht genau den nächsten logischen Gründerschritt. Kein Sprung, keine Wiederholung, nicht zurück. Innerhalb des Tages nie „gestern“ für eine Folge vom selben Tag („als Nächstes“, „letztes Ergebnis“). Nur Folge 4 darf „gestern“ sagen (Folge 3 lief am 28.).
4. **Warum:** nach jeder KI-Entscheidung sofort 1–2 Sätze Warum mit 2–3 konkreten Gründen, möglichst mit Zahl aus dem echten Lauf. Eigener ruhiger Warum-Beat: Grund-Karten nacheinander, je ≥ 1,2 s.
5. **Umsatz-Zähler** unsichtbar, solange Umsatz 0 € (heute ganzer Tag 0 €). Kein Geld erfunden.
6. **Echter claude.ai-Lauf pro Folge** (T3-Preview-Profil „Chrome“). Prompt nennt das Ergebnis der Vorfolge wörtlich und hängt den Vorbericht an. Alle Zahlen/Ränge 1:1 aus dem Lauf, in `design/lauf/LAUF.md` mit Prompt, Chat-Link, Quellenzahl, Dauer. Ohne Lauf keine Folge. Nie die Sidebar mit privaten Chats zeigen, fremde Composer-Entwürfe nicht anfassen. Login-Connector (Canva, Stripe, Gmail, Apify, Claude in Chrome), Gewerbe oder Geld → Folge vorziehen und im Bericht notieren.
7. **Länge/Ton:** 110–135 Wörter, verbindlich 40–48 s. −14 LUFS. Musik am Stück aus dem Original, je Akt ≥ 15 dB unter der Stimme. TTS mit Betonungstest + STT-Abgleich, Stimme und Settings wie Folge 2/3. Pausen zwischen Gründen ca. 0,3 s.
8. **Text:** Zielgruppe nie direkt ansprechen. Keine Emojis. Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“, danach nur Hashtags. Superkind nur leise, kein Preis, nicht „KI-Mitarbeiter“.

## Kette (Chef, Folgenliste als Kette gelesen und korrigiert)
Stand nach Folge 3: Produkt = Shirts mit Logo, Druck auf Bestellung über Partner; Kunde = kleine Handwerks-/Baubetriebe; Ärger-Recherche: Waschen zuerst klären (Bau 60 °C, gängige Drucke für kleine Mengen ~30 °C). Offen: „Welcher Druck hält 60 Grad?“

| Folge | Schritt („Heute …“) | Eingabe (Ergebnis der Vorfolge) | Claude-Weg (ohne Login) | Ausgabe = Eingabe der nächsten |
|---|---|---|---|---|
| 4 | findet sie den Druck, der 60 Grad aushält | Folge 3: Bau wäscht 60 °C, DTF/DTG/Flex ~30 °C | Research, Bericht Folge 3 angehängt | gewähltes Verfahren + Warum |
| 5 | schaut sie, was die Konkurrenz für genau solche Shirts verlangt | Verfahren aus Folge 4 | Research/Websuche, Ergebnis als Tabelle | Preisspanne Konkurrenz für Kleinmengen + Lücke |
| 6 | findet sie einen Druckpartner, der das ab einem Stück kann | Verfahren + Konkurrenzpreise | Research (statt Claude in Chrome, das bräuchte die Erweiterung) | Partner + echter Einkaufspreis + Lieferzeit |
| 7 | rechnet sie ihren Preis | Einkaufspreis Folge 6 + Konkurrenzpreise Folge 5 | Excel mit Formeln über Dateierstellung (wenn aus: Rechnung als Tabelle im Chat, ehrlich so benannt) | Verkaufspreis + Rohertrag je Auftrag (nur gerechnet, nicht verdient) |
| 8 | sucht sie einen Firmennamen | Angebot + Preis stehen | Websuche: Namensideen, freie Treffer prüfen; DPMA macht der Mensch | Name (Kandidat) |

Korrektur zum Konzept: Konzept-Tag 4 (Konkurrenz) wird Folge 5, weil Folge 3 die Frage „Welcher Druck hält 60 Grad?“ offen gelassen hat (Zwischenschritt = eigene Folge). „Muster-Shirt mit Canva“ (Konzept-Tag 6) wandert hinter Name und Logo, weil es den Canva-Login braucht und ein Muster erst mit Name/Logo Sinn ergibt. Pius muss dafür vor Tag 3 den Canva-Connector freigeben.
Entscheidung der KI = die Empfehlung, die Claude im Lauf selbst gibt (wie Folge 3). Jeder Prompt verlangt deshalb: eine Empfehlung + 2–3 Gründe mit Zahl/Quelle + was offen bleibt.

## Lehren aus Tag 1 (Prüfberichte Folge 2/3)
- Rückblick ≤ 6 s ist mit fester Eröffnung knapp: Satz 2 kurz halten (≤ 2,5 s).
- „Heute:“ klang als Frage (Folge 3). Lieber „Heute findet sie …“ als Satz.
- Pause zwischen den Warum-Gründen war in Folge 3 nur 0,15 s → Ziel 0,3 s.
- Musik muss je Akt ≥ 15 dB unter der Stimme liegen (Folge 3: ein Satz bei 14,0 dB).
- Shirt-Karte im Rückblick verdeckte die rechte Board-Spalte (Folge 3).

## Chef-Entscheide während der Produktion
- Rückblick-Satz 1 ab Folge 5: „Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, bestickt erst auf Bestellung.“ (Folge 4 wählt Stickerei; „gedruckt“ wäre danach falsch.) An Pius gemeldet.
- Geldregel zählt nach Folgen (erster Umsatz frühestens Folge 14), nicht nach Serientagen.
- Caption-Anleitung neutral („So geht das für die eigene Firma mit Claude:“, „das letzte Ergebnis“); Du-Form nur im CTA „Kommentiere …, dann schick ich dir …“ (Regel 8, Hinweis Prüfer F6). Gilt für Folgen 4–8.
- Folge 6: kein angekündigter Menschen-Schritt („frage ich an“), stattdessen Befund aus dem Lauf („Händlerpreise und Einrichtungskosten findet Claude dort nicht.“).
- Für die finalen Prüfer: F5 – Spreadshirt 109,95 € stammt aus der Vorrecherche (Anhang), nicht aus Claudes Lauf; das Video darf sie nicht als Claude-Ergebnis zeigen („rund 110 €“ ist über workwear one 110,85 € aus dem Lauf belegt). F6 – Printful-Marge nur mit angenommenem Kurs 1 USD ≈ 1 € (im Guide als Annahme markiert, nicht im Skript). F7 – Kurs 0,8666 € (EZB 15.09.2026) muss im Guide/Caption als Annahme mit Datum stehen. Wenn Regie voice/words neu erzeugt: Desktop-Rohmaterial neu kopieren.
- Abschluss je Folge (Chef): voice.mp3/words.json, Video, Cover, pruefbericht.md in den Desktop-Ordner kopieren (F5/F6/F8 Rohmaterial ggf. veraltet). F8: RDAP DENIC kolonnenshirt.de = 404 (Pius-Info, nicht im Video).
- F7 final: HAKRO-281-Werte nur in der Datei, nicht in Claudes Chat-Tabelle; 29,90 € Einzelshirt = Claude-Vorschlag, kein Konkurrenzpreis. Guide-Build: runs/firma-tag7/guide/f7build/build.py
