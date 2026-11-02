# Prüfung final · Folge 12 „Betriebe“ · Runde 2 (2026-10-30, Slot 21:00)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final). Gemini fällt aus → manuell Frame für Frame, nur `node_modules/ffmpeg-static/ffmpeg`.
Prüfling: `firma-tag12-final.mp4` (Neu-Render 15:26, 45,57 s, 1080×1920, 30 fps) + `-handy.mp4` (45,57 s). Alte Fassung liegt in `v1/`.
Nicht-Video-Teile (Cover, Caption, Guide, replies, format) bestanden in Runde 1 → nur K.-o.-Gegenprüfung.

## Belege (alle in `pruefung/`)
- `final-r2-2fps-1/2/3.jpg` (ganze Länge @ 2 fps, 92 Frames, Zeitstempel im Bild)
- `final-r2-hook-0-6s-4fps.jpg` (0–6 s @ 4 fps)
- `final-r2-13.0-16.2-10fps.jpg` (Zeitstempel relativ, +13,0 s), `final-r2-12.4-13.4-30fps.jpg`, `final-r2-14.25-14.75-30fps.jpg`
- `final-r2-32.8-34.8-10fps.jpg` (Zeitstempel relativ, +32,8 s), `final-r2-28.5-29.7-10fps.jpg`
- `final-r2-maskottchen.jpg` (0,6 / 5,5 / 21,5 / 23,5 / 38,0 s), `final-r2/crop32.3.png` (Haken), `final-r2/cmp-14.png` (14,5 / 15,0 / 13,0 s), `final-r2-handy-stichprobe.jpg`

## Tickets aus Runde 1
| Ticket | Soll | Befund | Status |
|---|---|---|---|
| final-R1-01 (Leere 33,2–34,5 s) | Karte „ALS NÄCHSTES“ spätestens 33,40 s voll im Bild; 33,0–34,6 s jeder Frame Claude-Fenster oder Karte; Ton/Länge gleich | `final-r2-32.8-34.8-10fps.jpg`: 32,8–33,1 s Claude-Fenster „BRANCHENVERZEICHNIS“ + „17 VON 20“; 33,2 s Fenster klein abgehend + Karte „ALS NÄCHSTES · Was schreibt sie?“ schon im Einflug; **33,3 s Karte voll** (Wort „Als“ 33,29 s, words.json); bleibt bis 35,5 s+. Kein Frame nur HUD + Untertitel + Maskottchen. Länge 45,57 s. Ton: Differenz alte/neue Tonspur −44,1 dB RMS bei −17,3 dB Signal (= gleicher Mix, nur Neu-Encode) | **erledigt** |
| final-R1-02 (Plan-Fragment 13,2–16,0 s) | Plan ganz oder gar nicht; kein Titelstreifen; Region-Karte ≥ 1,3 s | `final-r2-12.4-13.4-30fps.jpg`: Plan bis 12,90 s ganz im Bild, ab 12,93 s fliegt die Karte aus Zelle 7 auf und deckt ihn ab; `final-r2-13.0-16.2-10fps.jpg`: 13,0–16,2 s kein Plan, kein „…NDUNGSPLAN“-Streifen zwischen den HUD-Kacheln, kein angeschnittener Plan bei 15,6–15,9 s (Karte schrumpft direkt ins Claude-Fenster). „HANDWERK: 50 STATT 38“ voll lesbar 14,33–15,85 s ≈ 1,5 s | **erledigt** |

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge | 45,57 s (final + handy) | 40–48 s |
| Wörter / Tempo | 100 Wörter (words.json = script.txt), 131,7 wpm | 85–100, 120–135 |
| Rückblick („Die“ 6,46 → „Mensch.“ 12,26) | 5,80 s | ≤ 6,5 s |
| „Heute“ | 12,93 s | ≤ 14,5 s |
| Lautheit (ebur128) final / handy | −14,0 LUFS, Peak −1,3 dBFS / −14,1 LUFS, Peak −1,2 | −14 ±0,5 |
| Tonspur vs. Runde 1 | inhaltlich identisch (Differenz −44 dB) → STT-Abgleich R1 (100/100 Wörter, Versatz ≤ 0,08 s, kein „Tag drei“) gilt weiter; render2.log: Musik-Gain 2,3, min. Abstand 17,0 dB | ≥ 15 dB |
| Untertitel im Bild | Bögen 2 fps vollständig gelesen: Wortfolge = script.txt (Ziffern 100/20/5/10 statt Zahlwörter, wie R1) | wörtlich |

## K.-o.-Check
| K.-o. | Ergebnis | Beleg |
|---|---|---|
| Länge, wpm, Rückblick, „Heute“ | ok | Messwerte |
| Kein „Tag drei“ gesprochen | ok | Ton unverändert, STT R1; nur HUD-Badge „TAG 3“ |
| ≤ 1 neuer Textblock, Karten ≤ 4 Wörter, ≥ 1,2 s, ≤ ~12 neue Wörter | ok | Region-Karte 1,5 s; „BEIM KUNDEN SICHTBAR“ 25,5 → „STELLT EIN · LAUT ANZEIGE“ 27,2 s nacheinander; „17 VON 20“ ab 30,5; „ALS NÄCHSTES“ ab 33,3; größter Block „Eine Datei geteilt, das Web durchsucht und 24 weitere Schritte“ (11 Wörter, 18,0 s); CTA-Blöcke wie Folge 11 nacheinander (38,5 / 40,5 s) |
| Untertitel = gesprochenes Wort | ok | 2-fps-Bögen |
| Frame 1 ganze Frage + Ergebnis-Objekt | ok | hook-4fps 0,0: „Wie viel Umsatz macht eine KI in 100 Tagen?“ + „TESTREGION CHEMNITZ“ mit 20 Pins |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | ok | Lupe 0,75/1,0/1,25/1,5/1,75/2,75/3,0/3,25, Titelband 2,0–2,5, „GANZ ALLEINE“ 3,75, Karte ab 4,5 weg, Plan 5,0, Maskottchen 0,5/5,0 |
| Hook-Objekt nie über dem Plan | ok | 4,75 s Karte weg, 5,0 s Plan allein |
| Maskottchen ganz / ≤ 1/3 angeschnitten | ok | final-r2-maskottchen.jpg: 0,6/5,5 s ganz bzw. Unterkante < 1/4; 21,5 s rechts unten ganz; 38,0 s CTA unten < 1/3 |
| Kein Umsatz-Zähler | ok | ganze Länge |
| Board laut Tagesbriefing/Folge 11 | ok | 6,5–12,5 s und 36–38 s: 1 PRODUKT+KUNDE ✓, 2 DRUCK+PREIS ✓, 3 PARTNER+NAME ✓, 4 LOGO ✓, 5 WEBSITE ENTWURF „in Arbeit“ (nicht grün), 6 GEWERBE OFFEN → „MENSCH“ ab 11,0 s ohne Haken, 7 BETRIEBE „?“ current, 8 WERBEBRIEF, 9 ERSTER UMSATZ; HUD-Mini-Board gleich |
| Nirgends lesbar: Hamburg, Betriebsnamen, Personen, Straßen, Tel., Mail, Sidebar | ok | Hook-/Cover-Tabelle geschwärzt; Excel 21,0 s nur Balken; Top 5 nur Gewerke (Maler, Dachdeckerei, Maler, Zimmerei, Elektroinstallation); Dateiname „Kolonnenshirt testregion chemnitz“ = eigene Firma + erlaubte Region; Claude-Fenster ohne Sidebar; Haken-Tabelle nur „Branchenverzeichnis“ |
| Haken 17 Zellen, „17 VON 20“, nie „vier“ | ok | crop32.3.png: Zeilen 1–16 + 18 markiert, 17 grau („+ eigene Website“), 19/20 grau; Stempel „17 VON 20“ |
| Musik ohne explizite Wörter, ≈ −14 LUFS, Stimme klar | ok | Musik unverändert (R1: 0 explizit, 328–373,6 s am Stück), −14,0 LUFS, Abstand ≥ 17 dB |

**Gegenprüfung Nicht-Video:** Token-Abgleich aller Namensteile (Spalte Firma, `liste-text.txt`, 32 Tokens) + „Hamburg“ gegen caption.txt, replies.json, guidebook.html/json, prompt-fuer-kommentare.md: 0 Treffer. Emojis in Caption/replies: 0. Caption 2090 Zeichen, endet „Offen bleibt: Was schreibt sie den fünf? … (Fiktives Experiment, keine echten Umsätze.)“ + Hashtags. format.json `{ "format": "PTC" }`. replies.json: commentReply + 5 Variationen = 6, alle enden mit Frage. Cover: Frage „Wen spricht die KI zuerst an?“, Karte, Tabelle geschwärzt, HUD-Stand korrekt. **Kein K.-o. verletzt.**

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Hook (0–6 s) | 8 | unverändert gut; 4,5–4,75 s nur „GANZ ALLEINE“ + leerer Raum (Übergang), unkritisch |
| Ton: Stimme, Tempo, Aussprache | 9 | 131,7 wpm, STT wörtlich (R1, Ton identisch) |
| Musik + Lautheit | 9 | −14,0 / −14,1 LUFS, ≥ 17 dB Abstand |
| Untertitel | 9 | wortgleich, synchron |
| Text-Regeln | 9 | Region-Karte jetzt ~1,5 s (vorher 1,27), ein Block zur Zeit |
| Bildfluss / keine Leere / Plan ganz im Bild | 8 | Beide Lücken behoben (33,3 s Karte, 13–16 s ohne Fragment). Rest: 29,1–29,2 s ~0,2 s Übergang fast leer (final-r2-28.5-29.7); zwei 1–2-Frame-Blitzer eines dünnen roten Rahmens (13,17–13,20 s über der Karte, 14,53–14,57 s über „HANDWERK“, cmp-14.png links); 14,40–14,53 s „38“ beim Überschwingen am rechten Rand; CTA 38,5–45,5 s Bildmitte leer (wie R1-Hinweis D-23) |
| Fakten / Board / Kette | 9 | wie R1; Board korrekt |
| Anonymisierung | 9 | siehe K.-o. |
| Vergleich Referenz (Folge 11 final, Tag 1 v7) | 8 | „ALS NÄCHSTES“ sitzt jetzt wie in Folge 11 auf „Als“; Hook, Claude-Akt, Warum-Akt auf Folge-11-Niveau. Schwächer bleibt nur die leere CTA-Mitte nach 38,5 s |
| Cover | 9 | unverändert |
| Caption | 9 | unverändert, 2090 Zeichen |
| Guide | 9 | unverändert, 0 Namen/Hamburg |
| replies / Kommentar-Prompt | 9 | unverändert |

## Scroller-Test
- 1 s: Frage + Chemnitz-Karte mit Pins + Lupe → bleibt.
- 3 s: Lupe springt über Pins, „GANZ ALLEINE“ → bleibt.
- 10 s: Plan mit GEWERBE → „MENSCH“, Shirt-Karte → bleibt. Kritische Stelle 33 s aus Runde 1 ist jetzt geschlossen (Cliffhanger-Karte sofort da).

## Gesamt
**Gesamtnote 8/10 · BESTANDEN** (kein K.-o., kein Kriterium < 8; final-R1-01 und -02 erledigt).

## Tickets
Keine.

Hinweise ans Design-Backlog (kein Ticket, für Folge 13):
- Dünner roter Rahmen blitzt 1–2 Frames bei 13,17 s und 14,53 s (Lupen-/Fokus-Overlay beim Szenenwechsel) – Ursache finden und entfernen.
- CTA: Plan nach 38,5 s fast unsichtbar (D-23), Bildmitte leer – schwächer dimmen oder Plan stehen lassen wie Folge 11.
