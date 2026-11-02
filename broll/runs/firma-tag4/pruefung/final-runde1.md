GESAMTNOTE: 7/10, NICHT bestanden (Hook 1,2–3,3 s steht still, Pius-Checkliste „Hook nicht statisch“ ist K.-o.; alle 12 Pflicht-K.-o.-Punkte aus dem Auftrag bestehen)

# Finale Prüfung Runde 1 · Folge 4 „Druck / Verfahren für 60 °C“ · Slot 2026-10-29 09:00
Prüfer: firma-pruefer, 2026-10-28. Geprüft: runs/firma-tag4/firma-tag4-final.mp4 (41,50 s, 1080×1920, 30 fps, AAC 48 kHz) und Paket.
Maßstab: script.txt, words.json, regieplan.md, beats.json, design/lauf/LAUF.md + bericht.md, tagesbriefing-2026-10-29.md, Folge 3 v8 (final-v8.md = 8/10).

## Belege (alle in pruefung/final-r1/)
- `f2/` 83 Frames bei 2 fps über die ganze Länge, `sheet1–4.jpg` als Kontaktbögen
- `h4/` + `hook4.jpg`: 0–6 s bei 4 fps; `hookmid.jpg`: 1,2–3,4 s bei 5 fps
- `frame0.png`, `key4.jpg` (0,0 / 6,8 / 19,8 / 39,0 s), `sc.jpg` (alle Claude-Shots 15,0–19,2 s in voller Auflösung)
- `pt.jpg`: Warum-Karten 23,2–28,6 s
- `stt.json` (whisper medium, ganze Tonspur), `stt-haken.json` (28,4–31,6 s einzeln)
- `V48.wav`/`M48.wav`: Stimme und Musik aus dem Mix zurückgerechnet (Stimme = voice.mp3, Musik = GONE_GONE ab 57,26 s, je Akt per Least-Squares eingepasst, R² 0,79–0,99), dann EBU-R128 momentan, sprachgegatet (> −28 LUFS), Methode wie Folge 3 v8
- `gemini.txt`: review-video.mjs nicht gelaufen (OpenRouter 402, Guthaben < 1 $), wie bei Folge 3

## Pflicht-Checks (K.-o.)
| # | Check | Ergebnis | Note |
|---|---|---|---|
| 1 | Kein privater Name, Chat-Titel, Sidebar | ✓ Alle Claude-Frames 13,4–19,4 s geprüft (`sc.jpg`). Papier-UI zeigt nur „How can I help you today?“ und das +‑Menü. Shot 01 (16,0–17,9 s) ist ab dem Composer beschnitten: sichtbar sind Anhang „Shirt-Firma Ergebnis Ärger.md“, Prompt, „Project ˅“, „Opus 5.5 Medium“. Shot 02 (18,2–19,3 s) zeigt „Given access to: Google Sheets“, nicht privat. Keine Begrüßung, kein Chat-Titel, keine Sidebar | 10 |
| 2 | Kein Umsatz-Zähler | ✓ HUD oben rechts ist das Mini-Board (✓ ✓ 3). „9 ERSTER UMSATZ“ ist eine Plan-Kachel, kein Zähler | 10 |
| 3 | „Tag zwei“ + „TAG 2“ | ✓ gesprochen 4,88–5,64 s (STT „Tag 2.“). Slam „TAG 2“ groß 4,9–5,6 s, danach HUD-Badge. Cover „TAG 2“ groß. Sonst keine Tageszahl in Bild, Cover, Caption, Guide, Replies (nur „100 Tage“ = Serienrahmen, Board-Nummern 1–9 = Schritte) | 10 |
| 4 | Eröffnung wörtlich | ✓ STT: „Wie viel Umsatz macht ein Unternehmen, das eine KI hundert Tage lang ganz alleine führt? Ich probier das aus. Tag 2.“ | 10 |
| 5 | Rückblick ≤ 6 s + Akt, Neuer versteht bis 14 s | ✓ „Die Firma …“ 5,73 s bis „… Grad.“ 11,68 s = **5,95 s**. Board steht ab 4,5 s mit ✓ ✓ (wie Folge 3 v8, Board vor Karte), Shirt-Karte „SHIRTS MIT LOGO“ auf „Shirts“ (6,8 s), Banner „erst auf Bestellung gedruckt“ ≈ 8,4 s, Kachel 2 leuchtet + „BAU WÄSCHT 60 °C“ auf „Gestern“ (≈ 9,9 s), Kamerafahrt auf 3 DRUCK + Banner „HEUTE: LOGO FÜR 60 °C“ 12,0 s, gesprochen fertig 14,04 s. Lehre aus Folge 3 umgesetzt: Shirt-Karte liegt unter dem Board und verdeckt nichts. Abzug: Shirt-Karte ist 6,8–8,4 s eine leere weiße Fläche (nur Titel + Icon), Maskottchen halb aus dem rechten Rand | 8 |
| 6 | Warum-Karten | ✓ „95 °C Stick“ 23,2 s (Wort „Stick“ 23,20), „30 °C Digitaldruck“ 24,55 s („Digitaldruck“ 24,62), „ab 1 Stück“ 25,9 s („Stick“ 25,95), „ab 50 Siebdruck lohnt“ 27,3 s („Siebdruck“ 27,16). Solo-Standzeiten 1,35 / 1,35 / 1,40 / 1,30 s, alle ≥ 1,2 s. Gegenwert je Zeile mit „vs“. 30 °C rot mit ✗, nicht durchgestrichen | 9 |
| 7 | Zahlen 1:1 aus dem Lauf | ✓ 246 Quellen (LAUF.md), Stick 95 / Digitaldruck 30 beim selben Anbieter (Spreadshirt), ab 1 Stück, Siebdruck ab 50 (Siluri), Wand: DTF 30–60 ?, DTG 30–40, Flex 30, Siebdruck ab 25–50, Transfer ab 10, Sublimation nur Polyester, Patches 30/60 ? (alle aus der Tabelle). Caption 4,85/5,85 € (workwear one) ✓ | 9 |
| 8 | Untertitel lesbar, frei | ✓ Pills auf dem Wort (Stichproben 0–41 s), verdecken keine Karte. Kleinigkeit: 39,0–39,8 s liegt die Geister-Pille „Verfahren“ über den Augen des Maskottchens | 8 |
| 9 | Länge, LUFS, Musik | ✓ 41,50 s; −14,0 LUFS, TP −1,1 dBTP, LRA 1,2. Musik am Stück (ein fester Versatz passt über alle Akte, kein Sprung, kein Loop), Ende 40,8 → 41,5 s ausgeblendet. Abstand Stimme/Musik je Akt (LUFS, gegatet): Hook 23,8 / 25,2 / 17,1 · Rückblick 17,2 · Heute 17,2 · Shot 01 18,1 · Shot 02 20,1 · Wand 29,7 · Gewinner 21,1 · Warum 16,4 · Haken 17,4 · Als Nächstes 17,0 · CTA 16,9 dB. Kleinster Wert 16,4 (Warum), alle ≥ 15. Hinweis: ungewichtet (RMS) liegt die zweite Hälfte nur bei ≈ 13,5 dB, das Stück ist dort basslastiger. Nach der Serien-Methode (LUFS) bestanden | 8 |
| 10 | Text | ✓ Keine Emojis in Caption/Replies. Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags. Superkind in der Caption gar nicht, im Guide nur Footer + ein Satz „macht es direkt in Slack und Teams“, ohne Preis. Menüpfad ✓, Anleitung neutral, Du nur im CTA | 9 |
| 11 | Guide hält CTA | ✓ 10 Seiten: S. 2 „Die Frage zum Kopieren“ wörtlich mit Klammern, S. 5–6 Vergleichstabelle aller 8 Verfahren 1:1 mit Legende H/A/T, S. 7 alle 26 Quellen, S. 8 Vorlage + Beispiele. Kleinigkeiten: „⚡ Quick Win“ (Template, war in Folge 3 auch), S. 10 der Satz „Folg @pickthecompany für die nächste Folge.“ steht doppelt | 9 |
| 12 | replies.json | ✓ 1 + 5 = 6 Antworten, keine Emojis, jede endet mit „?“ | 10 |

STT gegen Skript: wortgleich (Zahlen als Ziffern). Im Gesamtlauf fehlt „Fast“ vor „alle Gradzahlen“ (29,38 s), im Einzellauf (`stt-haken.json`) ist es da. Das Wort ist leise, aber vorhanden. Kein Ticket.

## Pius-Checkliste (bewertung.md, final)
| Punkt | Ergebnis | Note |
|---|---|---|
| Hook nicht statisch (0–6 s, 4 fps) | **✗.** 0 / 0,25 / 0,5 / 1,0 s Ereignisse (Titel, Etikett 30 °C, 2. Titelzeile, Board hinter der Maschine). Dann **1,25–3,25 s = 2,0 s ohne neues Ereignis**: Komposition steht, nur Trommel dreht und Wort-Pills wechseln (`hookmid.jpg`). Der in regieplan.md Z. 75 geplante „Zähler rollt auf 60 °C (Ziel auf 100)“ fehlt, 60 °C steht ab Frame 0. Ab 3,25 s wieder gut („GANZ ALLEINE.“, Rückfahrt, Slam TAG 2) | 7 |
| Board/Fenster ganz im Bild | ✗ im Hook: 1,0–3,6 s liegt die Waschmaschine mitten auf dem Gründungsplan, sichtbar sind nur „GRÜN… / PRODU… / …UCK“. Sonst ✓ | 7 |
| Kein Lesetext | Shot 01 16,0–16,9 s: ganzer Prompt-Block ungezoomt (Schrift ≈ 1 % Bildhöhe), dann Zoom auf die Markierung. 0,9 s, getragen von Pill „Frage“. Grenzwertig, kein eigenes Ticket | 8 |
| Zweite Hälfte ohne Ton verständlich | ✓ Gewinner-Stempel, Warum-Karten, Haken-Karte, „Als Nächstes“-Karte, Endkarte | 9 |
| CTA nennt Wert, Zuschauer nicht direkt | ✓ „Die Frage“ + „Die Vergleichstabelle“ + „in 10 Minuten passende Verfahren mit Quellen“ | 9 |
| Vergleich Folge 3 v8 (`design/vergleich-folge3-v8.jpg`, `key4.jpg`) | Rückblick, Warum, CTA gleich gut oder besser (Board frei, Karten größer, Gegenwerte). **Frame 0 schwächer:** Folge 3 zeigt die ganze Hook-Frage in drei Zeilen + Plan, Folge 4 nur „Wie viel Umsatz macht“ und eine Maschine mit einem Etikett | 7 |
| Gemini-Review | nicht gelaufen (402), Vorbehalt wie Folge 3 | – |
| Scroller-Test | 1 s: Waschmaschine 60 °C + Etiketten ist ein starkes, fremdes Bild, ich bleibe. 3 s: Bild steht seit 2 s, nur die Trommel dreht, hier ist das Risiko. 10 s: Board + Shirt-Karte + „Bau wäscht 60 °C“, klar, worum es geht | – |

## Bekannte Schwächen laut Design, bewertet
- **Erster Screenshot 16,0–16,9 s ungezoomt:** vertretbar, 0,9 s Orientierung, der Zoom auf die gelbe Markierung kommt zum Wort „hält“. Kein Ticket, Wunsch im Ticket 2.
- **Verfahrens-Wand ≈ 0,9 s (19,35–20,22 s):** in Ordnung. Sie soll „acht Optionen“ zeigen, nicht gelesen werden; 246 groß und lesbar, Musik-Pause trägt. Kein Ticket.
- **Endkarte, Plan scheint durch:** Ab 36,4 s sieht man die Reihen PREIS/NAME/LOGO und 7/8/9 hinter den DM-Karten, „ERSTER“ wird vom Balken „in 10 Minuten“ angeschnitten. Gleiches Bild wie Folge 3 v8, unruhig, aber nicht schlechter als der Maßstab. Wunsch im Ticket 2.
- **Maskottchen im Rückblick halb am Rand (6,5–11,5 s):** sichtbar, wirkt angeschnitten statt gewollt. Wunsch im Ticket 2.
- **Haken-Karte sinngemäß:** Karte „Fast alle Gradzahlen kommen von Anbietern“ + Pille „ANBIETERANGABEN“ auf dem Wort. Inhalt stimmt, Stichwort steht wörtlich da. Kein Ticket.
- **Frame 0 nur erste Titelzeile:** zählt, siehe Ticket 1. Auch das rote 30-°C-Etikett fehlt in Frame 0 (kommt bei 0,25 s).
- **Musikkurve Engine-Standard:** gemessen ok (min 16,4 dB LUFS-gegatet). Kein Ticket.

## Noten je Kriterium
| Kriterium | Note |
|---|---|
| 1 Privatsphäre | 10 |
| 2 Kein Umsatz-Zähler | 10 |
| 3 Tag 2 | 10 |
| 4 Eröffnung wörtlich | 10 |
| 5 Rückblick | 8 |
| 6 Warum-Karten | 9 |
| 7 Zahlen 1:1 | 9 |
| 8 Untertitel | 8 |
| 9 Länge/Ton | 8 |
| 10 Text | 9 |
| 11 Guide | 9 |
| 12 Replies | 10 |
| P1 Hook nicht statisch / Board im Bild / Frame 0 | **7** |
| P2 Vergleich Folge 3 | 7 (wegen Frame 0) |

## K.-o.-Status
Alle 12 Auftrags-K.-o. bestanden. Pius-Checkliste „Hook nicht statisch“ verletzt (1,25–3,25 s), deshalb nicht bestanden. Behebung ist reine Grafik, Stimme/Musik/Mix bleiben.

## Tickets
```
TICKET final-R1-1 → firma-design
Kriterium: Hook nicht statisch / Board im Bild / Frame 0 · Note: 7/10
Beleg: Video 0:00–0:03,3 · pruefung/final-r1/frame0.png, hook4.jpg, hookmid.jpg
Problem: Von 1,25 bis 3,25 s steht die Komposition 2 s still (nur Trommel und Wort-Pills), die Waschmaschine verdeckt dabei den Gründungsplan, und Frame 0 zeigt nur „Wie viel Umsatz macht“ mit einem Etikett.
Soll: (a) Frame 0 zeigt die ganze Hook-Frage (beide Zeilen) und beide Etiketten (95 °C Stick ✓, 30 °C Digitaldruck ✗). (b) Zwischen 1,0 und 3,25 s mindestens alle 0,5 s ein neues Bildereignis, z. B. Zähler rollt auf 60 °C bis „100“ (2,16 s) wie in regieplan.md Z. 75, Etikett-Stempel auf „KI“ (1,80 s), Push-in auf „Tage“ (2,49 s). Kontaktbogen 0–6 s bei 4 fps belegt es. (c) Waschmaschine und Plan überlappen im Hook nicht: Plan entweder ganz sichtbar oder ganz aus dem Bild. Stimme, Musik und Mix unverändert; danach −14 LUFS und Abstand je Akt erneut messen.
```
```
TICKET final-R1-2 → firma-design (Wunsch, kein Grund für Runde 3)
Kriterium: Rückblick / Endkarte · Note: 8/10
Beleg: Video 0:06,8–0:08,4 und 0:06,5–0:11,5 (key4.jpg Bild 2); 0:36,4–0:41,5 (sheet4.jpg)
Problem: Shirt-Karte ist 1,6 s leer, Maskottchen hängt halb aus dem rechten Rand, und auf der Endkarte schneidet der Balken „in 10 Minuten“ die Board-Reihe 7/8/9 („ERSTER“) an.
Soll: Shirt-Karte hat ab ihrem ersten Frame Inhalt (Banner kleiner schon da oder Karte so groß wie ihr Inhalt); Maskottchen im Rückblick ganz im Bild oder klar angeschnitten (≤ ⅓ sichtbar); Endkarte ohne angeschnittene Board-Beschriftung (Board unter den DM-Karten ausblenden oder ganz abdunkeln). Optional: Shot 01 ab 16,0 s direkt mit Push-in starten.
```
