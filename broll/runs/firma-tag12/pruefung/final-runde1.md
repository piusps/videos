# Prüfung final · Folge 12 „Betriebe“ · Runde 1 (2026-10-30, Slot 21:00)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final). Gemini-Review fällt aus (OpenRouter ohne Guthaben), deshalb manuell Frame für Frame.
Prüflinge: `firma-tag12-final.mp4` (45,57 s, 1080×1920, 30 fps) + `-handy.mp4` (45,57 s), `cover.jpg`, `caption.txt`, `betriebe-guide.pdf` (guide-pages p01–p06, guide-img/liste-anonym.png), `replies.json`, `format.json`, `prompt-fuer-kommentare.md`.

## Belege (alle in `pruefung/`)
- `final-r1-hook-0-6s-4fps.jpg` (0–6 s @ 4 fps), `final-r1-2fps-1/2/3.jpg` (ganze Länge @ 2 fps, 91 Frames)
- `final-r1-12.5-16.5-6fps.jpg`, `final-r1-28.5-35-6fps.jpg`, `final-r1-leer-33-34.6.png` (10 fps), `final-r1/card-in.png`, `card-out.png` (30 fps)
- `final-r1-key-a.jpg`, `final-r1-key-b.jpg` (Schlüsselframes in voller Größe), Crops in `final-r1/` (crop18, crop20.8, crop0map, crop0table, crop1.6, crop32.3, guide-liste-crop)
- Referenzen: `final-r1-ref11-1fps.jpg`, `final-r1-ref11-als-naechstes.jpg` (Folge 11 final), `final-r1-ref-tag1v7.jpg` (Tag 1 v7)
- STT: `final-r1/stt-final.json` (ElevenLabs scribe_v1 auf der finalen Tonspur), `final-r1/final-audio.mp3`

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge | 45,57 s (beide Fassungen) | 40–48 s |
| Wörter / Tempo | 100 Wörter (words.json = script.txt), 131,7 wpm über die ganze Folge | ≤ 100, 120–135 |
| Rückblick („Die“ 6,46 → „Mensch.“ 12,26) | 5,80 s | ≤ 6,5 s |
| „Heute“ | 12,93 s | ≤ 14,5 s |
| Lautheit final / handy | −14,0 LUFS, TP −1,2 dBFS / −14,1 LUFS, TP −1,0 | −14 ±0,5 |
| STT vs. Skript | 100/100 Wörter identisch (nur Schreibweise „hundert/zwanzig/fünf/zehn“ statt Ziffern, Doppelpunkt/Komma), Chemnitz, Websuche, Claude, Teamgröße, Excel-Liste korrekt erkannt; kein „Tag drei“ | wörtlich |
| Untertitel-Sync (STT-Start vs. words.json) | Median +0,016 s, max 0,082 s | ≤ 0,1 s |
| Musik explizit | `music-explicit-check.mjs` auf `final-check/musik-abschnitt-mix.mp3`: nur „I said go / Thank you for the love … fall in love again“ → 0 explizite Wörter; am Stück 328,0–373,58 s (musik.txt) | 0 |
| Stimme über Musik | RMS Sprache −15,5 … −16,8 dB, Pausen −27 … −38 dB; Regie-Gap je Akt ≥ 17,9 dB (regie/gap-final.txt, render.log 17,0 dB) | ≥ 15 dB |
| Caption | 2090 Zeichen (Python len), 0 Emojis | ≤ 2100 |

## K.-o.-Check
| K.-o. | Ergebnis | Beleg |
|---|---|---|
| Länge 40–48 s, 120–135 wpm, Rückblick ≤ 6,5 s, Heute ≤ 14,5 s | ok | Messwerte oben |
| Kein „Tag drei“ gesprochen; Aussprache | ok | STT; HUD-Badge „TAG 3“ erlaubt |
| ≤ 1 neuer Textblock, Karten ≤ 4 Wörter, ≥ 1,2 s, ≤ ~12 neue Wörter | ok | „HANDWERK: 50 STATT 38“ voll lesbar 14,30–15,57 s (card-in/out, 30 fps) = 1,27–1,3 s; „BEIM KUNDEN SICHTBAR“ 25,5 → „STELLT EIN · LAUT ANZEIGE“ 27,3 nacheinander; „17 VON 20“ ab 30,6; „BRANCHENVERZEICHNIS“ 31,8–33,15; größter neuer Block „Eine Datei geteilt, das Web durchsucht und 24 weitere Schritte“ (11 Wörter, 18,0 s). Haken-Tabelle 29,5–33,1 zeigt 17× dasselbe Wort „Branchenverzeichnis“ als Muster, kein Lesetext |
| Untertitel = gesprochenes Wort | ok | 2-fps-Bögen, STT |
| Frame 1 ganze Frage + Ergebnis-Objekt | ok | key-a 0,0 s: „Wie viel Umsatz macht eine KI in 100 Tagen?“ + Karte „TESTREGION CHEMNITZ“ mit 20 Pins (5 gelb) |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | ok | hook-0-6s: Zoom-Lupen 0,75/1,0/1,5/1,75/3,0/3,25/4,0, Badge 2,0, „GANZ ALLEINE“ 3,75, Karte ab 4,75, Plan 5,0, Maskottchen 0,5/5,0 |
| Hook-Objekt überlappt nie den Plan | ok | 4,75 Karte weg, 5,0 Plan allein |
| Maskottchen ganz / ≤ 1/3 angeschnitten | ok | 0,6 s (key-a), 9–15 s, 33,5 s ganz, CTA 36–45 s wie Folge 11 (Unterkante, < 1/3) |
| Kein Umsatz-Zähler | ok | ganze Länge |
| Board laut Tagesbriefing | ok | 6,5–12,5 s: 1–4 abgehakt, 5 WEBSITE ENTWURF „in Arbeit“ (nicht grün), 6 GEWERBE OFFEN → „MENSCH“ ab 11,0 s ohne Haken, 7 BETRIEBE „?“ current, 8 WERBEBRIEF, 9 ERSTER UMSATZ |
| Nirgends lesbar: Hamburg, Betriebsnamen, Personen, Straßen, Telefon, Mail, Sidebar, private Chats | ok | Video: Tabellen auf Karte/Excel nur „Betrieb N“ + Balken + Blur (crop0table, crop1.6, strip21), Claude-Fenster ohne Sidebar (key-b), Denkzeile geblurrt (crop18: Inhalt harmlos). Token-Abgleich aller Namensteile aus liste-text.txt Spalte Firma gegen caption, replies, prompt-fuer-kommentare, guidebook.html/json: 0 Treffer, „Hamburg“ 0 Treffer. Cover: nur Karte + geschwärzte Tabelle. Guide p4: liste-anonym (Betrieb 1–20, Kontakt geschwärzt). Screenshot 02 nicht verwendet |
| Haken: 17 Zellen, „17 VON 20“, nie „vier“ | ok | crop32.3: Zeilen 1–16 + 18 markiert = 17, 17/19/20 grau; Stempel „17 VON 20“; Caption/Guide „17 von 20 … genauer bei 3“ |
| Musik ohne explizite Wörter, ≈ −14 LUFS, Stimme verständlich | ok | Messwerte |
| Caption ≤ 2100, Schluss, keine Emojis, CTA „Kunden“ | ok | 2090; endet „(Fiktives Experiment, keine echten Umsätze.)“ + Leerzeile + nur Hashtags; Menüpfad „+“ |
| Guide liefert CTA, Variante ohne Anhang, keine erfundenen Zahlen | ok | p2 Variante A, p3 Variante B + 4 Berufsbeispiele, p4 Listenvorlage (5 Blätter), p5 Prüfpunkte; Zahlen gegen LAUF.md/liste-text geprüft (5 min 20 s, 26 Websuchen, 50,03 vs. 38,4, 587, 18 Stadt/2 Umland, „über 30 Tage online“, 17/3) |
| replies.json | ok | 1 + 5 = 6, keine Emojis, alle enden mit Frage, Florent-Ton |
| format.json | ok | `{ "format": "PTC" }` |

**Kein K.-o. verletzt.**

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Hook (0–6 s) | 8 | Frage + Ergebnis-Karte in Frame 0, dichte Ereignisse; 4,75 s ein Viertel-Sekunden-Übergang fast leer (nur „GANZ ALLEINE“), unkritisch |
| Ton: Stimme, Tempo, Aussprache | 9 | STT wörtlich, 131,7 wpm, Pausen an Satzgrenzen |
| Musik + Lautheit | 9 | −14,0 LUFS, am Stück, 0 explizit, Abstand ≥ 17 dB |
| Untertitel | 9 | wortgleich, ≤ 0,08 s Versatz |
| Text-Regeln (ein Block, ≤ 4 Wörter, ≥ 1,2 s) | 8 | Region-Karte 1,27–1,3 s (knapp an Chef-Soll 1,3) |
| Bildfluss / keine Leere / Plan ganz im Bild | **6** | **33,2–34,5 s fast leeres Bild (nur HUD, Untertitel „Als Nächstes“, kleines Maskottchen) ≈ 1,3 s**, nicht 0,3 s wie von Design gemeldet (final-r1-leer-33-34.6.png, final-r1-28.5-35-6fps.jpg: Karte „ALS NÄCHSTES“ erst ab 34,4–34,6 s). Dazu 15,57–15,83 s Plan links/oben angeschnitten (card-out.png) und 13,2–15,6 s Plan-Titelstreifen „…NDUNGSPLAN · 12 SCH…“ zwischen den HUD-Kacheln (wirkt wie Glitch) |
| Fakten / Board / Kette | 9 | Top 5 Gewerke = Lauf; „Einer stellt ein“ = BA-Anzeige; Übergabe Folge 11 („Wen spricht sie zuerst an?“) → „Fünf würde sie zuerst ansprechen“; nächste Folge „Was schreibt sie?“ |
| Anonymisierung | 9 | siehe K.-o.; Rest: Guide p4 nennt Gewerk + Ort je Zeile (z. B. „Flöha + Chemnitz, 8 Mitarbeiter“), Ort-Ebene ist erlaubt |
| Vergleich Referenz (Folge 11 final, Tag 1 v7) | 7 | Look, Hook, Claude-Akte, Warum-Akt auf Folge-11-Niveau. Schwächer: Folge 11 zeigt die „ALS NÄCHSTES WEN?“-Karte exakt auf „Als“ (final-r1-ref11-als-naechstes.jpg), Folge 12 hat dort 1,3 s Leere; im CTA bleibt bei Folge 11 der Plan sichtbar, bei Folge 12 ist er ab 38,5 s fast unsichtbar gedimmt (D-23), die Bildmitte bleibt 38,5–45,5 s leer |
| Cover | 9 | Frage „Wen spricht die KI zuerst an?“ + Chemnitz-Karte, Tabelle geschwärzt, HUD-Stand korrekt |
| Caption | 9 | alle Pflichtteile, Fakten belegt, 2090 Zeichen (knapp) |
| Guide | 9 | hält das CTA-Versprechen, beide Varianten, Quellen, keine Namen |
| replies / Kommentar-Prompt | 9 | Ton passt, Fragen leicht |

## Zu den von Design gemeldeten Punkten
- **~0,3 s freier Plan 15,6–15,85 s:** bestätigt (15,57–15,83 s), Plan dabei links/oben angeschnitten. Allein nicht notenrelevant, aber Teil des Bildfluss-Mangels.
- **~0,3 s fast leeres Bild um 33,0 s:** **zu klein gemeldet.** Tatsächlich 33,2 → 34,5 s ≈ 1,3 s ohne Objekt; drückt die Note (siehe Ticket 01).
- **Plan-Titelstreifen neben HUD 13,2–15,6 s:** sichtbar, wirkt wie Fragment; drückt leicht.
- **Engine-WARN Recap-Akt 9,46 s:** drückt nicht. Gesprochener Rückblick 5,80 s (words.json), Regel ≤ 6,5 s seit Chef-Entscheid; die Engine-Grenze 6 s stammt aus Tempo 1,15.

## Scroller-Test
- 1 s: Frage + Karte mit 20 Pins + Lupen-Zoom → bleibt.
- 3 s: Lupe auf Pins, „GANZ ALLEINE“ kommt → bleibt.
- 10 s: Plan mit offenem GEWERBE/„MENSCH“ und Shirt-Karte, klare Serie → bleibt. Kritisch nur 33,2–34,5 s (Leere direkt vor dem Cliffhanger).

## Gesamt
**Gesamtnote 7,5/10 · NICHT BESTANDEN** (kein K.-o., aber Bildfluss 6 und Referenzvergleich 7 < 8).
Alles außer dem Video ist abnahmefähig (Cover, Caption, Guide, replies, format, Kommentar-Prompt unverändert lassen). Die Korrektur ist ein reiner Design-/Timing-Fix mit Neu-Render (~100 s laut render.log); Stimme, Musik, Mix bleiben.

## Tickets
```
TICKET final-R1-01 → firma-design
Kriterium: Bildfluss / keine Leere · Note: 6/10
Beleg: firma-tag12-final.mp4 00:33,2–00:34,5 · pruefung/final-r1-leer-33-34.6.png, final-r1-28.5-35-6fps.jpg
Problem: Nach dem Abgang von Claude-Fenster/„BRANCHENVERZEICHNIS“ (33,15 s) steht ~1,3 s nur leere Bühne; die Karte „ALS NÄCHSTES · Was schreibt sie?“ kommt erst 34,4–34,6 s, Folge 11 zeigt sie exakt auf „Als“.
Soll: Karte „ALS NÄCHSTES“ (Inhalt unverändert, ≤ 4 Wörter) ist spätestens 33,40 s voll im Bild (≤ 0,1 s nach „Als“ 33,29); 10-fps-Streifen 33,0–34,6 s zeigt in jedem Frame Claude-Fenster oder die Karte, kein Frame nur HUD + Untertitel + Maskottchen; Ton/Mix unverändert, Länge 45,57 s.
```
```
TICKET final-R1-02 → firma-design (im selben Render, kein eigener Grund zum Durchfallen)
Kriterium: Plan ganz im Bild · Note: 7/10
Beleg: 00:15,57–00:15,83 · pruefung/final-r1/card-out.png; 00:13,2–00:15,6 · final-r1-12.5-16.5-6fps.jpg (Titelstreifen)
Problem: Zwischen Region-Karte und Claude-Fenster blitzt der Plan angeschnitten auf (links/oben aus dem Bild), davor hängt der Plan-Titelstreifen „…NDUNGSPLAN · 12 SCH…“ zwischen den HUD-Kacheln.
Soll: Im Bereich 13,2–16,0 s ist der Plan entweder ganz im Bild oder gar nicht sichtbar (kein Titelstreifen-Fragment, kein angeschnittener Plan); Region-Karte bleibt ≥ 1,3 s voll lesbar (aktuell 14,30–15,57).
```
Hinweis (kein Ticket, Backlog Design): CTA 38,5–45,5 s – der gedimmte Plan (D-23) ist fast unsichtbar, Bildmitte leer; Folge 11 ließ den Plan sichtbar. Für Folge 13 prüfen, ob D-23 schwächer gedimmt werden soll.

Nach dem Fix: Runde 2 mit frischem Prüfer nur auf Video (Streifen 13–16 s und 33–35 s @ 10 fps, LUFS, Länge, Hash von Ton gleich).
