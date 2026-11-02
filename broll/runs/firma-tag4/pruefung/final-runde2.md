GESAMTNOTE: 8/10, BESTANDEN (kein K.-o. verletzt, final-R1-1 erfüllt; ein Wunsch-Ticket offen, kein Render nötig)

# Finale Prüfung Runde 2 · Folge 4 „Druck / Verfahren für 60 °C“ · Slot 2026-10-29 09:00 (erste Folge des Tages)
Prüfer: firma-pruefer, 2026-10-28. Geprüft: runs/firma-tag4/firma-tag4-final.mp4 (41,50 s, 1080×1920, 30 fps, AAC 48 kHz), cover.jpg, kontaktbogen-2fps.jpg, design/hook-0-6s-4fps-r2.jpg, mix-info.json, public/firma-ep/tag4/episode.json (Diff gegen design/episode-r1.json), caption.txt, druck-guide.pdf, replies.json, format.json.
Maßstab: script.txt, words.json, regieplan.md, design/lauf/LAUF.md + bericht.md, tagesbriefing-2026-10-29.md, final-runde1.md.

## Belege (alle in pruefung/final-r2/)
- `frame0.png`; `h4/` + `hook4.jpg` (0–6 s, 4 fps); `f2/` 83 Frames 2 fps + `sheet1–3.jpg`; `claude-shots.jpg` (13,0–19,5 s, obere Bildhälfte voll aufgelöst)
- `motion-hook-10fps.txt`: mittlere Helligkeitsdifferenz aufeinanderfolgender Frames bei 10 fps (270×480, Graustufen), 0–6 s
- LUFS: ebur128 über das Finale. Gemini-Review: nicht gelaufen (OpenRouter-Guthaben, wie R1), Vorbehalt bleibt

## Ticket final-R1-1 (Pflicht) – erfüllt
- (a) Frame 0 zeigt die ganze Hook-Frage in zwei Zeilen („Wie viel Umsatz macht / eine KI in 100 Tagen?“), beide Etiketten (95 Stick ✓, 30 Digitaldruck ✗), Maschine, Board-HUD. ✓
- (b) Ereignisse 1,0–3,25 s im 0,25-s-Raster: 1,25 Zähler 30 °C · 1,5 40 °C + Maskottchen fällt · 1,75 50 °C + Landung · 2,0 55 °C · 2,25 60 °C + Stempel „ZU HEISS“ · 2,5 Stempel „HÄLT“ + Push-in · 2,75 Maschine fliegt raus · 3,0 Plan erscheint · 3,25 Kacheln + „GANZ ALLEINE.“. Bewegung: kein 10-fps-Schritt unter 1,7 (Minimum 4,2 s = 1,74, 3,0 s = 2,21), Spitzen 25–65 an jedem Ereignis. Kein Stillstand > 0,5 s. ✓
- (c) Maschine und Plan überlappen nicht mehr: Maschine schrumpft 2,75 s und ist weg, bevor der Plan ab 3,0 s kommt. ✓
- **2,75–3,0 s „nur Titel vor leerer Wand“:** gemessen ist es eher 0,2 s (Diff 39,7 bei 2,8 s = Maschine fliegt raus, 2,2 bei 3,0 s, 56,9 bei 3,1 s = Plan kommt). Das ist ein Szenenwechsel und kein Stillstand. Er liegt zwischen zwei starken Ereignissen, und der Ton läuft weiter („lang | ganz“). Zulässig, kein Ticket.
- Nebenbefund 4,0–4,8 s: Das Board steht 0,8 s, es bewegen sich nur das Maskottchen (^^ → Augen) und die Pills „aus / Tag“. Messwert 1,7–7, also kein Stillstand. Das ist der Anlauf vor dem Slam „TAG 2“ (4,9 s). Vertretbar.

## Ticket final-R1-2 (Wunsch) – teilweise
- Shirt-Karte: Banner „erst auf Bestellung gedruckt“ kommt 0,25 s nach der Karte (Shirts+0,25), nicht mehr 1,6 s leer. ✓
- Endkarte: Board unter den DM-Karten abgedunkelt (dimBoard), Balken „in 10 Minuten“ schneidet nichts mehr an. ✓
- Maskottchen im Rückblick 6,5–11,5 s: weiter etwa zur Hälfte aus dem rechten Rand (bot dx 1,6). Offen, kleiner Abzug.

## K.-o.-Checks
| # | Check | Ergebnis | Note |
|---|---|---|---|
| 1 | Kein privater Name, kein Chat-Titel, keine Sidebar | ✓ Alle Claude-Frames 13,0–19,4 s (`claude-shots.jpg`): Papier-UI „How can I help you today?“, das +‑Menü (Skills, Connectors, Design system, Add plugins, Devices, Research, Memory), der Anhang-Chip „Shirt-Firma Ergebnis Ärger.md / Ergebnis von gestern“, der Prompt, „Opus 5.5 Medium“ und der Research-Kopf „60-°C-feste Textilveredelung im Vergleich · 246 sources · 5m 21s · Given access to: Google Sheets“. Keine Sidebar, kein Chat-Titel, kein Name | 10 |
| 2 | Kein Umsatz-Zähler | ✓ Das HUD ist das Mini-Board (✓ ✓ 3). „9 ERSTER UMSATZ“ ist eine Plan-Kachel. „Umsatz“ steht nur im Hook-Titel | 10 |
| 3 | „Tag zwei“ / „TAG 2“ | ✓ Gesprochen 4,88–5,64 s. Slam „TAG 2“ groß 4,9–5,6 s, danach das kleine HUD-Badge. Das Cover zeigt „TAG 2“ groß unten rechts. Sonst keine Tageszahl. Die Caption sagt „Tag 2:“: Das ist dieselbe, erlaubte Tageszahl der 9-Uhr-Folge, also kein Verstoß | 10 |
| 4 | Eröffnung wörtlich | ✓ Voice-Spur unverändert gegenüber R1 (voice.mp3/words.json nicht neu, Musik-Offset 57,26 s gleich). STT R1 wortgleich. Der Titel im Bild ist eine Kurzform („… eine KI in 100 Tagen?“) und nicht gesprochen. Zulässig | 10 |
| 5 | Rückblick ≤ 6 s, Neuer versteht bis 14 s | ✓ Gesprochen 5,73–11,68 s = 5,95 s. Die Engine-Warnung „recap 7,72 s“ betrifft nur den Bild-Akt 5,65–13,37 s. Er trägt zusätzlich „Heute sucht sie ein Logo, das 60 Grad aushält“ mit dem Banner „HEUTE: LOGO FÜR 60 °C“ ab ≈ 11,8 s auf Kachel 3 DRUCK. Ein Neuer kennt Projekt (Board + Shirt-Karte) und heutigen Schritt vor 13,4 s, also innerhalb der 14 s. Abzug: Maskottchen halb angeschnitten | 8 |
| 6 | Warum-Karten ≥ 1,2 s auf dem Wort | ✓ Die Act-Timings sind gegenüber R1 unverändert (episode.json-Diff betrifft nur Hook, Rückblick-Bot, Shirt-Banner, Endkarte). Standzeiten 1,35 / 1,35 / 1,40 / 1,30 s, in f2 bestätigt (21,5–28,5 s) | 9 |
| 7 | Zahlen 1:1 aus dem Lauf | ✓ 246 Quellen; Stick 95 / Digitaldruck 30 (Spreadshirt, LAUF.md Z. 18, 46, 48, 59); ab 1 Stück; Siebdruck ab 50 (Siluri, Z. 50/60); Wand-Werte aus der Tabelle; Caption 4,85/5,85 € (workwear one, Z. 61). Neu im Hook: Zähler rollt 20→60 °C (Waschtemperatur Bau aus Folge 3) und die Stempel „HÄLT“ unter 95 °C und „ZU HEISS“ unter 30 °C. **„ZU HEISS“ ist abgeleitet, nicht erfunden.** 60 °C > 30 °C stimmt, Claude sagt selbst „Für die eigenen Druckverfahren nennt Spreadshirt nur 30 bzw. 40 °C“, und das Etikett zeigt „bis 30 °C“. Die Formulierung ist aber zweideutig: Direkt unter „bis 30 °C“ liest man „30 °C ist zu heiß“. Gemeint ist „60 °C ist zu heiß für diesen Druck“. Die Stempel stehen nur 2,25–2,9 s im Bild. Keine falsche Zahl, deshalb kein K.-o. → Wunsch-Ticket | 8 |
| 8 | Untertitel frei | ✓ Pills auf dem Wort, sie verdecken keine Karte und kein Etikett. Kleinigkeit wie R1: Auf der Endkarte (≈ 37,5–39,8 s) liegen die Pills „die passenden Verfahren“ / „mit Quellen“ auf dem Gesicht des Maskottchens | 8 |
| 9 | Länge, LUFS, Musik | ✓ 41,50 s (Regel 40–48). ebur128: −14,0 LUFS, TP −1,2 dBFS, LRA 1,2. mix-info: Abstand je Akt 16,0–24,3 dB, Minimum Warum 16,0, alle ≥ 15. Musik am Stück ab 57,26 s, Ende ausgeblendet. Hinweis: Die Tonspur ist nicht bitgleich zu R1 (SFX im Hook neu getimt). Die Abstände stammen aus dem Engine-Mixer, nicht aus einer eigenen Rückrechnung wie in R1. Methode und Musik sind gleich, deshalb glaubwürdig | 9 |
| 10 | Keine Emojis, Caption-Ende | ✓ Caption und Replies ohne Emoji. Die Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“, danach nur eine Hashtag-Zeile. Superkind fehlt in der Caption, kein Preis, Du nur im CTA. Unverändert seit R1 (20:34) | 9 |
| 11 | Guide hält den CTA | ✓ druck-guide.pdf unverändert seit R1. „Die Frage zum Kopieren“ und „Vergleichstabelle aller acht Verfahren aus unserem Lauf“ sind enthalten, wie Video-CTA und Caption versprechen. Reste wie R1: „⚡ Quick Win“-Template, Folgesatz auf S. 10 doppelt | 9 |
| 12 | replies.json / format.json | ✓ 1 + 5 Antworten, keine Emojis, jede endet mit „?“. format.json = PTC | 10 |

## Pius-Checkliste
| Punkt | Ergebnis | Note |
|---|---|---|
| Hook nicht statisch (0–6 s) | ✓ siehe oben, Ereignis alle 0,25 s bis 3,25 s, dann „GANZ ALLEINE.“, Rückfahrt, Slam | 9 |
| Board/Fenster ganz im Bild | ✓ Keine Überlappung mehr im Hook. Ab 3,0 s steht der Plan ganz im Bild | 9 |
| Kein Lesetext | Shot 01 wie R1 (0,9 s Prompt-Block, dann Markierung „60 Grad Wäsche dauerhaft“). Grenzwertig, unverändert | 8 |
| Zweite Hälfte ohne Ton | ✓ | 9 |
| CTA nennt Wert | ✓ | 9 |
| Vergleich Folge 3 v8 | Frame 0 jetzt mindestens gleichwertig (ganze Frage, starkes fremdes Bild mit zwei Etiketten). Cover: Titel, „GANZ ALLEINE.“, 60 °C, Etiketten, „TAG 2“, klar | 9 |
| Scroller-Test | 1 s: Waschmaschine 60 °C + rotes ✗-Etikett, Frage oben, ich bleibe. 3 s: Zähler ist auf 60 gerollt, Stempel, Maschine fliegt raus, Plan baut sich auf, kein Loch. 10 s: Shirt-Firma, „Bau wäscht 60 °C“, klar. 14 s: heute Logo für 60 °C, klar | – |

## Noten je Kriterium
| Kriterium | Note |
|---|---|
| 1 Privatsphäre | 10 |
| 2 Kein Umsatz-Zähler | 10 |
| 3 Tag 2 | 10 |
| 4 Eröffnung wörtlich | 10 |
| 5 Rückblick | 8 |
| 6 Warum-Karten | 9 |
| 7 Zahlen 1:1 | 8 |
| 8 Untertitel | 8 |
| 9 Länge/Ton | 9 |
| 10 Text | 9 |
| 11 Guide | 9 |
| 12 Replies/Format | 10 |
| P1 Hook / Board / Frame 0 | 9 |
| P2 Vergleich Folge 3 | 9 |

**Gesamt 8/10, bestanden.** Alle Kriterien ≥ 8, kein K.-o. verletzt. Freigabe für Slot 2026-10-29 09:00 aus Prüfersicht. Vorbehalt: kein Gemini-Review (Guthaben).

## Tickets
```
TICKET final-R2-1 → firma-design (Wunsch, kein Render allein dafür; beim nächsten Render oder für Folge 5 ff. mitnehmen)
Kriterium: Zahlen 1:1 / Lesbarkeit Stempel · Note: 8/10
Beleg: Video 0:02,25–0:02,9 · pruefung/final-r2/h4/009.png–011.png; episode.json hook.stamps[0] "ZU HEISS"
Problem: Der Stempel „ZU HEISS“ direkt unter „DIGITALDRUCK bis 30 °C“ liest sich als „30 °C ist zu heiß“ statt „60 °C ist zu heiß für diesen Druck“.
Soll: Stempeltext „HÄLT NICHT“ als Gegenstück zu „HÄLT“ unter 95 °C; Zahlen im Bild unverändert.
```
```
TICKET final-R2-2 → firma-design (Wunsch, Rest aus final-R1-2)
Kriterium: Rückblick · Note: 8/10
Beleg: Video 0:06,5–0:11,5 · pruefung/final-r2/sheet1.jpg Reihe 2–4 rechts
Problem: Das Maskottchen hängt im Rückblick weiter etwa zur Hälfte aus dem rechten Rand.
Soll: ganz im Bild oder klar angeschnitten (≤ ⅓ sichtbar).
```
