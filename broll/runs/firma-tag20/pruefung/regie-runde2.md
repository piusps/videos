# Prüfung Regie · Folge 20 „Mit oder ohne Umsatzsteuer?“ · Runde 2 (Kurzprüfung) · 2026-11-01

Prüfer: firma-pruefer (frisch, nicht Ersteller). Geprüft: beats.json (neu, 12:29), regieplan.md „Änderungen Runde 1“, Lückenrechnung mit eigenem `regie-r1/gaps.py` gegen words.json, Pixelprofil Shot 08 für die Abdeckung.
Unverändert bestätigt: voice.mp3 md5 c9d261fe… (= R1), words.json und musik-abschnitt.mp3 Zeitstempel 12:15/12:16 (vor R1-Prüfung), seconds 44,60, musicStart 152,6, Slot 21:00.

## Tickets
| Ticket | Befund | Note |
|---|---|---|
| regie-R1-01 Faktenschutz | „MIT USt-ID: 0 %“ gestrichen und in `verboten` aufgenommen; B12 Shot 10 grund2 nur fetter Satz bis „… 19 % teurer.“ weich + Marker, Zeile „Das gilt ohne USt-ID …“ abgedunkelt; B11 Shot 08 lesbar nur 91,60 € / 109 €, Abdeckung „bzw. 25,13 €“ (x≈350–455) und „bzw. 29,90 €“ (x≈555–690). Pixelprofil Shot 08 (y 728–765): „25,13 €“ liegt bei x 384–452, „29,90 €“ bei 614–688 → beide Zahlen voll abgedeckt. Verbotsliste nennt die erlaubten Zahlen und „auch nicht in Screenshots“. | 9 |
| regie-R1-02 Takt | Eigene Rechnung: 0–6,13 keine Lücke > 0,5 s (B03 „führt:end+0.1“ 4,43); ab 6,13 größte Lücke 1,48 s (Mulde vor „Warum?“, Bild steht bewusst), B05 jetzt 0,92 / 0,95 / 0,47 / 0,29 s; Ende 42,73 → 43,57 → 44,30 (0,84 / 0,73). Neue Ereignisse ohne neuen Text. | 9 |
| regie-R1-03 Bildschirmtext | B11 Karte „17,40 € ZURÜCK“ ohne Unter-/Gegenzeile, Beträge fliegen aus Shot 08 in die Tafel und stehen nur einmal lesbar (8 neue Wörter); B12 Karte + „als Kleinunternehmer“, Shot 10 weich (10 W. inkl. Bauchbinde); B13 Shot 04 weich, Marker „mindestens fünf Jahre“ (6 W.). Kartenabstände unverändert ≥ 1,28 s. | 9 |
| regie-R1-04 Anker | B09 wort_start {"w":"Claude","after":15.5,"offset":0.15} → 15,80 + 0,15 = 15,95 = von ✓; alle anderen Beats außer B01 lösen auf ihren Start auf. | 9 |
| Regressionen | Keine: Karten, Beat-Grenzen, Stimme, Musik, Kurve unverändert; Board-Plakette „MIT UST“ jetzt erst in der CTA-Board-Ansicht (B15), B14 ohne Board (ein Ort je Satz) – wie in R1 empfohlen; Plakette im Stil „5ER OFFEN“, Feldtext „GEWERBE OFFEN“, kein Haken. JSON gültig. | 10 |

K.-o.: keins verletzt.

## Hinweise an Design (kein Ticket)
- Shot 08: die Abdeckung von „bzw. 25,13 €“ bei x≈330 statt 350 beginnen – sonst bleiben „bz“ von „bzw.“ (x 333–355) sichtbar. Keine Zahl betroffen.
- B09 nutzt ein neues Feld `offset` in wort_start; Design muss es auswerten (sonst Start 15,80 statt 15,95).

## Ergebnis
Alle R1-Kriterien jetzt ≥ 9, Gesamtnote Regie **9,0/10** → **bestanden**. Weiter an firma-design.
