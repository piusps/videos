# Prüfung final · Folge 18 „Was zahlt sie für das gestickte Shirt?“ · Runde 1 (Serientag 5, erste Folge, Slot 15:00)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-11-01. Am Video wurde nichts geändert. Belege liegen in `pruefung/final-r1/`.
**Gemini/OpenRouter liefert 402.** Deshalb habe ich manuell geprüft: alle Frames mit 4 fps (178 Frames, `f4/`, Bögen `sheet0–10.jpg`), alle Frames mit 30 fps (`f30/`, 1335 Frames), 30-fps-Streifen an allen 12 erkannten Schnitten (`cut_<s>.jpg`, scdet) und Vollbilder an den Schlüsselstellen (`full/`).
Prüflinge: `firma-tag18-final.mp4` (44,500 s, 1080×1920, 30 fps, AAC), `cover.jpg` (1080×1920), `caption.txt`, `script.txt`, `marge-guide.pdf` (8 Seiten, `guide-pages/`, `guidebook.json`), `replies.json`, `prompt-fuer-kommentare.md`, `briefing.md`, `regieplan.md`, `design/lauf/` (LAUF.md, bericht.md, Shots 01–12).

## Ergebnis
**Gesamtnote 7/10 · nicht bestanden.** Zwei K.-o.-Kriterien sind verletzt: Karten haben mehr als 4 Wörter (drei Stellen), und an zwei Stellen kommen zwei neue Textblöcke gleichzeitig. Alle anderen K.-o.-Punkte sind erfüllt. Die Fehler lassen sich mit reiner Grafikarbeit beheben. Stimme, words.json und Musik bleiben unverändert.

## Noten je Kriterium
| Kriterium | Note | Beleg |
|---|---|---|
| Maskottchen ≤ 1/3 verdeckt, Augen frei, keine Untertitel auf den Augen (eigener Durchgang über das ganze Video inkl. CTA) | 8 ✓ | siehe Durchgang unten. Keine Stelle über 1/3, Augen immer frei |
| Texte ≥ 58 px (Versalhöhe ≥ 42 px bei 1080×1920) | 8 ✓ | Karten und Pills ≈ 75–85 px (`full/t29.5.jpg`, `t42.0.jpg`, `t35.0.jpg`), Claude-Zeilen ≈ 60–80 px (`t18.5`, `t20.8`). Kleiner sind nur Serien-Standards: HUD, Board-Unterzeilen „12 SCHRITTE“/„IN ARBEIT“, Fenster-Label „Claude“ ≈ 35 px, Chip „gesendet“ ≈ 35 px (wie F14–F17) und der Brieftext, der absichtlich unlesbar ist |
| Höchstens ein neuer Textblock gleichzeitig, Karten ≤ 4 Wörter | **5 ✗ K.-o.** | Karten: „in 10 Minuten / was dir bleibt“ = 6 Wörter (41,25–44,5), „8 € RABATT / 21,80 statt 29,90“ = 6 (27,8–30,9), „AB 17 € NICHTS / Einkauf pro Shirt“ = 7 (30,9–33,87). Doppelte Blöcke: 33,90 („Versand: zzgl.“ und „Stimmt die Versandzeile?“ im selben Frame, `cut_33.9.jpg`) und 37,20/37,23 („KOMMENTIERE“ und Badge „5ER OFFEN“, `cut_37.167.jpg`) |
| Panel-Wechsel und Kamera-Schnitt auf demselben Frame | 9 ✓ | An den Kamera-Schnitten 7,067 / 11,933 / 26,600 / 33,900 / 37,167 wechseln Panel und Kamera im selben Frame. An den Panel-Wechseln bei ruhiger Kamera (5,033 / 13,900 / 16,000 / 19,700 / 23,300 / 39,967) gibt es keinen Mischframe und keinen leeren Frame. Einzige Kleinigkeit: Pill „ihre Marge“ läuft bei 16,000–16,033 zwei Frames ins Claude-Fenster |
| 85–100 Wörter, 120–135 wpm, Länge 40–48 s | 8 ✓ | 100 Wörter (script.txt = words.json = STT). Gemessen über die ganze Länge wie in der Serie: 44,50 s → 134,8 wpm. Nur über die Sprechspanne (0–43,19 s) gerechnet wären es 138,9 wpm. Kein Spielraum mehr für Kürzungen |
| Keine Emojis, keine erfundenen Zahlen | 9 ✓ | Video: 17 € (= 17,15 gerundet, mit Spanne 17,00–17,71 aus der Gegenprüfung immer noch „17“), 0 €, 8 € (29,90 − 21,80 = 8,10), 21,80/29,90, 109 €, 100, 5, 10 Minuten. Das Etikett „Claudes Rechnung, netto“ kennzeichnet die Zahlen. Caption: knapp 2 Minuten (1:55), rund 17 €, 21,80 statt 29,90. Alles in LAUF.md belegt. Guide: 5,75 € steht an allen Stellen mit „laut Claude; Printful nennt 2,95–6,50 €“, dazu der Kasten „Die 5,75 € sind nicht bestätigt“. 12/14/16 € sind als „Annahmen“ markiert, 17,00–17,71 kommen aus der Gegenprüfung. Keine Emojis in Caption, Replies oder Guide |
| Keine claude.ai-Sidebar, keine privaten Namen oder Mailadressen | 10 ✓ | Das Claude-Fenster zeigt nur die Chat-Spalte. Im Brief (11,93–13,9, `full/t12.6.jpg`) ist der Empfänger geschwärzt, der Rest sind unscharfe Platzhalter. Im Guide-HTML kommt „pius“ nur in den Schriftpfaden vor. Gesichtbarer Credit „Florent Preusser × Superkind“ = öffentliche Marke |
| Caption ≤ 2100 Zeichen, Fiktiv-Satz am Ende, danach nur Hashtags | 10 ✓ | 2049 Zeichen (2100 Byte). Endet mit „(Fiktives Experiment, keine echten Umsätze.)“ und 6 Hashtags. Menüpfad ist enthalten |
| Kein Umsatz-Zähler | 10 ✓ | Nur das Plan-HUD (Felder 1–9), kein Geldzähler |
| Ton: STT gegen Skript, Sync, LUFS | 9 ✓ | ElevenLabs scribe: voice.mp3 100/100 identisch. Finaler Mix: 2 Läufe; Lauf 2 ist 100/100 identisch, Lauf 1 hört „probiere“/„schicke“ (STT-Streuung, voice-only sauber), siehe `stt-final-mix*.json`, `stt-voice-r1.json`. Sync STT gegen words.json bei 12 Ankern ≤ 0,07 s. Untertitel-Pills liegen ≤ 0,07 s am Wort. Ebur128: **−14,1 LUFS**, True Peak −1,2 dBFS, LRA 1,9 |
| Hook (0–6 s nicht statisch, Ergebnis in Frame 1) | 8 ✓ | Frame 0 = Rechen-Karte „EINKAUF 17 € → REST 0 €“. Laufend Wort-Pills, Zeilen-Highlights EINKAUF/REST, Licht-Sweep, Stempel GANZ ALLEINE (3,67), Board (5,03), TAG-Slam (6,13). Das Maskottchen fehlt bei 1,07–4,9 ganz (Serien-Muster) |
| Echte Claude-UI | 7 | Bei 20,0–23,3 ist der Kernsatz aus Shot 02 neu zusammengesetzt. „Kurz vorweg: Den“ und „habe ich bei Printful“ sind entfernt, es bleiben sichtbare Lücken („nicht   öffentlich“, Schloss-Icon in der Lücke, `full/t20.8.jpg`), und das Ganze wirkt wie Claude-Pixel. Der Sinn bleibt richtig, aber das ist kein echter Ausschnitt mehr → Ticket 05 |
| Board-Lesbarkeit (Checkliste „Plan-Board immer ganz im Bild“) | 6 | Das Badge „5ER OFFEN“ verdeckt **37,23–39,93 (≈ 2,7 s, nicht 1,5 s)** Teile von 5 Feldern: „+ PREIS“ (2), „+ NAME“ (3), Haken (4), Nummer und „IN ARBEIT“ (5), Nummer (6) (`full/board38.jpg`) |
| Cover | 9 ✓ | „Ab 17 € Einkauf bleibt nichts“ + Rechen-Karte, Maskottchen ganz, Augen frei, TAG 5 |
| Guide / Replies / Prompt-Lieferung | 9 ✓ | 8 Seiten: Quick Win, Prompts A/B (B als „nicht getestet“ markiert), Rechenweg, echte Shots mit Kennzeichnung, „Nicht sichtbar“, „Was fehlt“, Nächstes: Versandzeile. Alle Replies enden mit einer Frage |

## Maskottchen-Durchgang (ganzes Video)
| Zeit | Zustand | Urteil |
|---|---|---|
| 0,00–0,47 | nicht im Bild (steigt auf) | ok |
| 0,50–0,90 | ganz sichtbar, Pills „Wie viel Umsatz“/„macht“ auf der Kopfoberkante, Augen frei | ok |
| **0,93–1,03** | halbtransparente Pill „Unternehmen“ auf der Stirn, Unterkante knapp über den Augen, Augen frei (`full/eyes_hook.jpg`, `s30_0.9.jpg`). Ab 1,067 ist das Maskottchen weg | ok (Hinweis H1) |
| 1,07–4,90 | ganz weg (Serien-Muster) | ok |
| 4,93–7,03 | ganz sichtbar, Pills auf der Kopfoberkante, Augen frei | ok |
| 7,07–37,13 | klein unten rechts, ganz im Bild unter den Panels, Augen frei. Das Gesicht ist überstrahlt (Lichtfleck zwischen den Augen, F16-R2-03 weiter offen) | ok (H3) |
| 37,17–39,93 | CTA groß, Untertitel auf Mund/Unterkörper ≈ 25 %, Augen frei | ok |
| **39,70–39,93** | Papierflieger + DM-Tag fliegt **zwischen den Augen** durch und kommt dem rechten Auge auf ≈ 10 px nahe, verdeckt es aber in keinem Frame (`full/plane.jpg`, `s30_39.8.jpg`) | ok (H2) |
| 39,97–44,50 | Untertitel bis 40,6 auf dem Unterkörper, danach über dem Kopf. Augen ab 39,97 hohl (Stilwechsel wie F17-H5), Hüpfer am Ende ganz im Bild | ok |

## Gezielt geprüfte Punkte des Design-Agents
1. **„5ER OFFEN“ verdeckt Board-Felder:** bestätigt, aber **≈ 2,7 s** (37,23–39,93) statt 1,5 s und über 5 Felder → Ticket 04.
2. **Halbtransparenter Untertitel über den Augen bei 0,9–1,1 s:** bestätigt für 0,93–1,03. Die Augen bleiben frei, also kein K.-o. → H1.
3. **Papierflieger nah am Gesicht bei 39,7 s:** bestätigt für 39,70–39,93 zwischen den Augen. Kein Auge wird verdeckt, also kein K.-o. → H2.
4. **„5,75“ im Guide als „laut Claude, nicht bestätigt“:** bestätigt, an allen 6 Stellen gekennzeichnet (Tabelle S. 4, Kasten S. 4, Bildunterschrift S. 5, Quellenzeile S. 8). Im Video taucht es nirgends auf ✓.

## Korrektur-Tickets
```
TICKET final-R1-01 → firma-design
Kriterium: Karten ≤ 4 Wörter (K.-o.) · Note: 5/10
Beleg: Video 41,25–44,50, full/t42.0.jpg; beats.json B15 verlangt „10 MINUTEN: WAS BLEIBT“
Problem: Die Ergebnis-Karte im CTA lautet „in 10 Minuten / was dir bleibt“ (6 Wörter) statt der geplanten 4.
Soll: Karte = „10 MINUTEN: WAS BLEIBT“ (≤ 4 Wörter), ≥ 58 px, Puls auf „bleibt“ bleibt erhalten.
```
```
TICKET final-R1-02 → firma-design
Kriterium: Karten ≤ 4 Wörter (K.-o.) · Note: 5/10
Beleg: Video 27,80–30,90 („8 € RABATT“ + Unterzeile „21,80 statt 29,90“), 30,93–33,87 („AB 17 € NICHTS“ + Unterzeile „Einkauf pro Shirt“), full/t29.5.jpg, full/t32.5.jpg
Problem: Beide Warum-Karten haben mit Unterzeile 6 bzw. 7 Wörter.
Soll: Jede Karte hat insgesamt ≤ 4 Wörter. Unterzeilen streichen (Sprechtext trägt sie), z. B. nur „8 € RABATT“ und nur „AB 17 € NICHTS“. Wer „21,80 statt 29,90“ behalten will, zeigt es als eigene Karte ≥ 0,5 s nach „8 € RABATT“ und nicht gleichzeitig.
```
```
TICKET final-R1-03 → firma-design
Kriterium: Höchstens ein neuer Textblock gleichzeitig (K.-o.) · Note: 5/10
Beleg: Video 33,900 (cut_33.9.jpg, full/t35.0.jpg)
Problem: „Versand: zzgl.“ und die Frage-Karte „Stimmt die Versandzeile?“ erscheinen im selben Frame. Die Versand-Karte überlappt außerdem rechts oben das Plan-HUD.
Soll: Bei 33,90 (Schnitt, „Als“) kommt nur „Versand: zzgl.“. Die Frage-Karte folgt frühestens 0,5 s später, am besten auf „Stimmt“ (≈ 35,5 s). Die Versand-Karte überlappt das HUD nicht mehr (Abstand ≥ 10 px).
```
```
TICKET final-R1-04 → firma-design
Kriterium: Ein neuer Textblock gleichzeitig (K.-o.) + Board ganz lesbar · Note: 6/10
Beleg: Video 37,20 „KOMMENTIERE“ / 37,23 Badge „5ER OFFEN“ (cut_37.167.jpg); Badge verdeckt 37,23–39,93 Teile der Felder 2–6 (full/board38.jpg)
Problem: Das Badge kommt praktisch gleichzeitig mit der CTA-Überschrift und deckt 2,7 s lang Beschriftungen von fünf Board-Feldern ab.
Soll: Alle 9 Feldbeschriftungen und Haken sind 37,17–39,93 voll lesbar. Den Status „5er offen“ entweder ganz aus dem CTA nehmen oder als kleines Badge an den Rand von Feld 2 setzen, ohne andere Felder zu berühren. Das Badge erscheint ≥ 0,5 s nach „KOMMENTIERE“ und bei ≥ 58 px.
```
```
TICKET final-R1-05 → firma-design
Kriterium: Echte Claude-UI · Note: 7/10
Beleg: Video 20,00–23,27, full/t20.8.jpg gegen design/lauf/02-kernsatz-kein-preis.png
Problem: Der Kernsatz ist aus Shot 02 neu zusammengeschnitten („Kurz vorweg: Den“ und „habe ich bei Printful“ fehlen) und hat sichtbare Lücken. Er wird aber als echter Claude-Ausschnitt gezeigt.
Soll: Ein zusammenhängender, unveränderter Ausschnitt der Originalzeilen aus Shot 02. Schlüsselteil „Einkaufspreis des bestickten Shirts in Euro … nicht öffentlich gefunden“ hell/markiert, Rest abgedunkelt (wie beats.json-Hinweis „Rest abgedunkelt“), ≥ 58 px, ≤ 12 lesbare Wörter, keine Lücken, kein eingesetztes Icon im Satz.
```
```
TICKET final-R1-06 → firma-design (niedrig, mit 01–05 erledigen)
Kriterium: Look/Lesbarkeit · Note: 7/10
Beleg: Video 26,70–33,87, full/t29.5.jpg
Problem: Die Pill „WARUM?“ steckt mit der unteren Buchstabenhälfte hinter der Karte.
Soll: „WARUM?“ ist ganz sichtbar über der Karte (eigene Ebene vor der Karte oder ≥ 10 px Abstand).
```

## Hinweise (kein Ticket)
- **H1** 0,93–1,03: Wer will, setzt die Pill „Unternehmen“ über den Kopf oder lässt sie erst ab 1,07 (Maskottchen weg) erscheinen.
- **H2** 39,70–39,93: Die Flugbahn des Fliegers könnte über dem Kopf liegen statt zwischen den Augen.
- **H3** Das Maskottchen-Gesicht ist bei 7–37 s weiter überstrahlt (F16-R2-03).
- **H4** wpm 134,8 nach Serienmessung. Keine Pause und nicht die Endkarte kürzen, sonst reißt die Grenze.
- **H5** Slot: `briefing.md`/`regieplan.md` nennen 09:00, laut Auftrag läuft die Folge um 15:00 als erste Folge von Serientag 5. Der Chef sollte bestätigen, dass keine frühere Folge heute schon „Tag fünf“ sagt (PTC-Regel: nur die erste Folge des Tages nennt den Tag).
- **H6** 16,000–16,033: Pill „ihre Marge“ läuft 2 Frames ins Claude-Fenster (wie F17, unkritisch).

## Nachprüfung nach der Korrektur
Nur Bild neu rendern. Danach prüfe ich in Runde 2 erneut: Ticket-Stellen mit 30 fps, Regression an allen anderen Zeitpunkten (Pixeldifferenz gegen `full/`), Maskottchen-Durchgang im CTA und Länge = 44,50 s.
