GESAMTNOTE: 6/10 (nicht bestanden, K.-o. Schritt-Kette im echten Lauf)

# Finale Prüfung R3: Folge „Ärger“ (firma-tag3), tag3-aerger-v4.mp4

Geprüft am 2026-10-28 von einem frischen Prüfer. Verglichen wurde v4 mit v3 (R2 bestanden, 8/10). Belege liegen in `pruefung/r3/`:
- `psnr.log`: PSNR pro Frame zwischen v3 und v4
- `cmp-*.png`: v3 links, v4 rechts, bei 2,0 / 5,5 / 6,2 / 7,5 / 8,6 / 9,2 / 20,0 / 40,0 s
- `v4-tile-5.5-9.5.png`: 5 fps über den Hook
- `v4-10-16.png`: 2 fps über den Prompt-Beat

## 1. Ist v4 außerhalb von 5–9,5 s gleich wie v3?
- **Ton:** Die MD5 des Audio-Streams ist in v3 und v4 gleich, decodiert und als Copy. Der Ton ist bitgleich.
- **Bild:** Die Dateien sind nicht bitgleich, weil v4 neu encodiert wurde. Pro Sekunde liegt der PSNR außerhalb von 5,93–8,97 s überall bei ≥ 44,9 dB (Minimum), meist bei 47–52 dB. Das ist reines Encoder-Rauschen und mit dem Auge nicht zu sehen. Die Seite-an-Seite-Bilder bei 2,0 / 20,0 / 40,0 s bestätigen das.
- **Bereich mit echter Änderung:** von 5,93 s bis 8,97 s (PSNR ≈ 25 dB). Er liegt ganz im erlaubten Fenster.
- **Befund: ja.** Praktisch gleich.

## 2. Kachel: Lesbarkeit, Verdeckung, Passung zum Ton
- **Ablauf (`v4-tile-5.5-9.5.png`):** Die Kachel fliegt ab ≈ 5,9 s aus dem Board, also auf „Ihr“ (5,86 s). Sie ist grün mit „2“ in Gold, „KUNDE“ klein darüber, „HANDWERK“ groß und einem grünen ✓. Das Häkchen bleibt über „Kunde steht: kleine Handwerksbetriebe“ (6,0–7,82 s) stehen. Bei ≈ 8,9 s wird es zum gelben „?“. Das Wort „nervt“ fällt bei 8,64–8,82 s, der Wechsel kommt also 0,1–0,25 s später, auf „die“. Ab ≈ 9,3 s kommt das Claude-Fenster.
- **Lesbarkeit:** Die Kachel ist gut lesbar. „HANDWERK“ steht weiß auf Dunkelgrün mit hohem Kontrast. „KUNDE“ ist klein, aber lesbar. Note 9.
- **Verdeckung:** Die Kachel verdeckt nichts. Sie liegt im oberen Drittel, die Untertitel stehen auf Bodenhöhe, Badge und HUD bleiben frei (`cmp-6.2.png`, `cmp-8.6.png`).
- **Passung zum Ton:** „Kunde steht“ passt zu ✓ HANDWERK, „Was nervt die“ passt zum „?“. Note 8.
- **Hinweis 1 (kein Ticket):** In den letzten ≈ 0,4 s steht „HANDWERK ?“ auf grünem Grund. Wer nur kurz hinschaut, kann das als Zweifel an der Wahl lesen. Besser wäre, wenn das „?“ in einem eigenen Pill erscheint, etwa „ÄRGER?“, und das ✓ bleibt.
- **Hinweis 2 (kein Ticket):** Im Board (bis 5,5 s) und im HUD oben rechts steht Schritt 2 weiter als offen („?“, gelb). Das passt, solange „Kunde“ als Schritt mit Unterpunkten gilt. Es widerspricht aber leicht dem grünen ✓ eine Sekunde später.

## 3. Schritt-Kette
| Prüfpunkt | Befund | OK |
|---|---|---|
| Start beim Ergebnis der Vorfolge, sichtbar | Tag 2 endet mit „Die KI nimmt das Handwerk … Offen bleibt: Was nervt diese Betriebe beim Bestellen?“ (`firma-tag2/script.txt`). Tag 3 beginnt mit „Ihr Kunde steht: kleine Handwerksbetriebe. Was nervt die beim Bestellen?“, dazu die Kachel ✓ HANDWERK. Sprechtext und Bild schließen genau an | ja |
| Nächster logischer Schritt, kein Sprung, keine Wiederholung | Nach der Wahl des Kunden kommt der Schmerz des Kunden. Danach nennt die Folge als offene Frage den Preis der Konkurrenz. Die Reihenfolge ist logisch | ja |
| Eingabe des echten Laufs = Ergebnis der Vorfolge | **Nein.** Der Prompt in `LAUF.md` und `02-prompt.png` lautet „…an **Betriebe unter zehn Leuten** … Was nervt **kleine Betriebe** …“. Das Wort Handwerk kommt nicht vor. Der Bericht aus Tag 2 ist nicht angehängt, obwohl Tag 2 selbst „ersten Bericht anhängen“ gemacht hat. `LAUF.md` sagt außerdem: „Viele Bewertende sind Privatkunden.“ Die Quellen sind Spreadshirt, Vistaprint, Shirtigo und gutefrage.net. Handwerksbetriebe kommen dort nicht gezielt vor | **nein** |
| Im Video sichtbar? | Ja, und zwar deutlich. `v4-10-16.png` zeigt 11,5–15 s den Prompt im Claude-Fenster, Wort für Wort getippt und markiert: „an Betriebe unter zehn Leuten“ und „Was nervt kleine Betriebe“. Das kommt etwa 4 s nachdem die Kachel HANDWERK gezeigt hat. Auch der Kopier-Prompt im Guide (`guidebook.json:27`) nennt „Betriebe unter zehn Leuten“ | – |

**Ehrliche Bewertung:** Es reicht nicht.
- **Schritt-Kette:** Die Regel in firma-autor sagt ausdrücklich: „Eingabe von Folge N+1 = Ergebnis von Folge N (…) aus dem echten Lauf“. Hier steht das Ergebnis nur im Sprechtext und auf der Kachel, im echten Lauf fehlt es.
- **Inhalt:** Der Sprechtext behauptet sinngemäß „Das nervt die Handwerksbetriebe: Platz eins Druck blättert“. Der Lauf hat aber nach kleinen Betrieben allgemein gefragt, und die Antwort stützt sich zum großen Teil auf Privatkunden. Das Ergebnis für die Handwerker stammt also nicht aus einem echten claude.ai-Lauf. Das berührt den zweiten K.-o.-Punkt aus `bewertung.md` (autor).
- **Sichtbarkeit:** Der Bruch ist im Video selbst zu sehen: erst HANDWERK, vier Sekunden später „Betriebe unter zehn Leuten“. Ein aufmerksamer Zuschauer oder ein Kommentar wie „Wo ist da das Handwerk?“ deckt ihn auf.
- **Note Schritt-Kette: 5/10 → K.-o.**

```
TICKET final-R3-1 → firma-autor (Lauf über firma-chef, danach firma-design)
Kriterium: Schritt-Kette · Note: 5/10 (K.-o.)
Beleg: design/lauf/LAUF.md "Prompt (wörtlich)"; design/lauf/02-prompt.png; Video 11,5–15,0 s (pruefung/r3/v4-10-16.png) vs. Kachel 5,9–9,0 s (v4-tile-5.5-9.5.png); guidebook.json:27
Problem: Der echte Research-Lauf fragt nach "Betriebe unter zehn Leuten" statt nach dem Ergebnis von Tag 2 (kleine Handwerks-/Baubetriebe). Video und Guide zeigen das, und das Handwerker-Ergebnis ist damit nicht belegt.
Soll (alles prüfbar):
 1. Neuer echter claude.ai-Lauf (Research an). Der Prompt nennt wörtlich "kleine Handwerks- und Baubetriebe" (gern mit "unter zehn Leuten" als Zusatz) und hängt den Tag-2-Bericht an oder zitiert ihn. LAUF.md wird mit Prompt, Chat-Link, Quellenzahl, Dauer und Top 5 wörtlich ersetzt.
 2. Alle Zahlen und Ränge in script.txt, Untertiteln, Karten, caption.txt und guidebook.json stammen 1:1 aus dem neuen Lauf (Quellenzahl, Fundstellen/Anbieter, Platz 1–3, Grenze/Disclaimer). Wenn sich Platz 1 ändert, ändert sich der Sprechtext entsprechend (neue TTS mit Betonungstest).
 3. Der Prompt-Beat im Video (ca. 10–15 s) zeigt den neuen Prompt mit sichtbarem "Handwerk". Der Kopier-Prompt im Guide hat [Handwerks- und Baubetriebe] als Platzhalter-Beispiel.
 4. Wenn der neue Lauf sagt, dass die Belege trotzdem überwiegend von Privatkunden stammen, sagt der Sprechtext oder der Disclaimer-Beat das in einem Halbsatz.
 5. Erneute finale Prüfung (frischer Prüfer): STT = Skript, LUFS −14 ±0,5, Musikabstand ≥ 15 dB je Abschnitt, Zahlen gegen das neue LAUF.md.
```

## Gesamtnoten
Die Noten aus R2 gelten für alles Unveränderte: Ton bitgleich, Bild außerhalb von 5,9–9,0 s visuell gleich.

| Kriterium | Note | Beleg |
|---|---|---|
| Hook nicht statisch | 8 | wie R2. Die Kachel ist ein zusätzliches Ereignis auf „Kunde steht“ und „nervt“ |
| Kamera ruhig, Board/Fenster im Bild | 9 | wie R2 |
| Kein Lesetext | 9 | wie R2 |
| Zweite Hälfte ohne Ton verständlich | 9 | wie R2 |
| Musik am Stück, ≥ 15 dB | 8 | wie R2 (Ton bitgleich) |
| CTA mit Wert, kein Direkt-Ansprechen | 9 | wie R2 |
| Vergleich Tag 1 v7 | 8 | wie R2 |
| Regie + Design | 8 | wie R2. Neue Kachel 8–9 (siehe Punkt 2) |
| Untertitel verdecken nichts | 9 | wie R2. Die Kachel überschneidet sich nicht |
| LUFS / Sync | 9 | wie R2 (−14,1 LUFS). Der Kachel-Wechsel liegt ≤ 0,25 s nach „nervt“ |
| Scroller-Test | 8 | wie R2 |
| Caption | 9 | wie R2. Sie nennt „kleine Handwerksbetriebe“, ist also vom Ticket betroffen |
| K.-o. Fakt/Zahl | 10 | Die Zahlen stimmen mit LAUF.md überein. Ob der Lauf zur Aussage passt, steht unter Schritt-Kette |
| Cover | 8 | wie R2 |
| Guide | 9 → betroffen | Der Kopier-Prompt nennt „Betriebe unter zehn Leuten“ |
| Gemini-Review | offen | wie R2 |
| **Kachel v4 (neu)** | **8** | gut lesbar, verdeckt nichts, passt zum Ton. Siehe Hinweise 1 und 2 |
| **Schritt-Kette (neu)** | **5 (K.-o.)** | siehe Punkt 3 und Ticket final-R3-1 |

**Ergebnis:** Die Kachel in v4 ist technisch sauber und verbessert den sichtbaren Anschluss an „Kunde“. Die Folge besteht trotzdem nicht. Der Grund ist nicht das Video-Handwerk, sondern der echte Lauf: Er macht den Schritt für „kleine Betriebe“ allgemein, nicht für das Handwerk, das Tag 2 gewählt hat. Nach der Zuständigkeitsregel geht die Folge an firma-autor zurück, nicht an firma-design.
