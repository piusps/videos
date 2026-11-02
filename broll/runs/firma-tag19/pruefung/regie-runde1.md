# Prüfung Regie · Folge 19 „Stimmt die Versandzeile?“ · Runde 1 · 2026-11-01

Prüfer: firma-pruefer (frisch, nicht Ersteller). Slot jetzt 18:00 (beats.json/Bibel nennen 12:00 = Metadaten, laut Chef ok). Nicht erste Folge: kein „Tag“, kein „gestern“ geprüft ✓.
Geprüft: voice.mp3, words.json, beats.json, regieplan.md, musik.txt, regie/ (Takes, STT, gap-final.txt, musik-abschnitt.mp3, final.env), Bibel Zeile 122 (wirtschaftsbuch-v2.md). Grundlage: script.txt (Autor R2 bestanden), design/lauf/LAUF.md, briefing.md, tagesbriefing-2026-11-01.md (Fenster F19 276,0–323,0), tagesbriefing-2026-10-30.md (Textregeln), firma-tag18/script.txt.
Gemini nicht nötig (Stufe Regie, kein Video).

## Eigene Messungen (Belege in pruefung/regie-r1/)
- **STT selbst:** ElevenLabs scribe_v1, de, 3 Läufe auf voice.mp3 (`regie-r1/stt1-3.json`): 3/3 wortgleich mit script.txt. Einzige Abweichung Schreibweise („Web-Suche“ in 2/3, „Umsatzsteuerstatus“ zusammen, „Kommentiere: Beleg.“) – keine Wortabweichung. „probier“, „Briefe“, „Beleg“, „Hundertneun“, „schick“, „Printful“ sauber. voice.mp3 per `cmp` bytegleich mit regie/vb.mp3 ✓.
- **Länge:** voice.mp3 44,30 s (ffprobe), + 1 s Endkarte = 45,27 s ✓ (40–48). **132,5 wpm** (100 W. / 45,27 s) ✓.
- **Rückblick** „Die“ 6,17 → „fehlt.“ Ende 12,54 = **6,37 s** ✓ (≤ 6,5). **„Heute“ 13,10 s** ✓ (≤ 14,5).
- **Pausen (words.json):** führt?→Ich 0,62 · aus.→Die 0,34 · fehlt.→Heute 0,56 · Versandzeile.→Claude 0,57 · Printful.→Versandpreise 0,60 · Beleg.→Sie 0,46 · Beträge.→Warum? **0,86** (≤ 0,9 vor Warum ✓) · geraten.→109 0,56 · offen.→Ihr 0,51 · Status.→Als 0,59 · Umsatzsteuer?→Kommentiere **0,96** (Akt-Naht, Präzedenz F18 1,00) · Prompt.→In 0,62. Kein atempo, Tempo 1,0.
- **Musik:** Start 276,95 + Stem 46,00 s (ffprobe) → Ende 322,95 ≤ 323,0 ✓ im Fenster, Tabu 200–276 nicht berührt, nie geloopt. `node scripts/music-explicit-check.mjs .env runs/firma-tag19/regie/musik-abschnitt.mp3` einmal: **exit 0, keine expliziten Wörter** (`regie-r1/explicit.txt`; Gesang „Thank you for the love … fall in love again“, harmlos). gap-final.txt: jeder Akt ≥ 18,6 dB unter Stimme ✓. Kurve mit Mulde vor/Akzent auf „Warum?“ ✓.
- **Faktenschutz:** Lieferzeit in keinem Beat lesbar (Shot 04 NIE, Shot 02 Crop nur bis „Bestellung.“, Briefansicht Lieferzeit abgedeckt) ✓. 18,32 € nie (Shot 05 nur Kopf) ✓. „NUR DOLLAR“ immer mit Unterzeile „im Lauf: Versandseite“ ✓, Liste `verboten` vollständig. „Versand extra“ nie ✓. Kein Widerspruch zu LAUF.md:23–27.
- **Kette/Bibel:** F18 endet „Als Nächstes: Stimmt die Versandzeile?“ → F19 „Heute prüft sie ihre Versandzeile.“ ✓; Rückblick-Satz 2 = Ergebnis F18 ✓; Übergabe F20 „Mit oder ohne Umsatzsteuer?“ in Bibel Z. 122 als offener Faden ✓.

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| STT = Skript | 10 | regie-r1/stt1-3.json, 3/3 |
| Länge / Tempo / Rückblick / Heute | 9 | s. o. |
| Pausen | 8 | 0,96 CTA-Naht (Präzedenz), 0,34 in fester Eröffnung |
| Warum-Beat mit Grund-Karten | 9 | beats.json B12, NUR DOLLAR / UMRECHNEN = GERATEN, je ≥ 1,5 s |
| Roter Faden (7 Akte, Ort je Akt, ≤ 1 Ortswechsel/Satz) | 9 | regieplan.md „Akte“, B13 einziger Wechsel im Satz |
| Storyline / Bibel / Faden gestern–morgen | 9 | Bibel Z. 122 |
| Hook + Frame 1 | **7** | B01 – Ticket 1 |
| Nach Hook kein Beat > 1,5 s ohne Änderung | **7** | B14/B15 – Ticket 2 |
| Karten ≤ 4 Wörter / ein Textblock / ≤ 12 neue Wörter | **7** | B12 – Ticket 3 |
| Echte Claude-UI in Mehrwert-Beats | 9 | Shots 01/07/03/02/05/09/06 mit Crops |
| Ton-Plan (Musikstruktur, SFX-Vielfalt) | 9 | musik.txt, sfx je Beat, 21 SFX-Dateien |
| beats.json vollständig, Anker Wort@Zeit | **7** | B09 – Ticket 4 |
| Faktenschutz | 8 | Shot 03 „nur_dollar“ zeigt Claudes Satz „Printfuls offizielle Versandseite nennt … nur Dollarbeträge“ – nur ok, weil Unterzeile „im Lauf“ gleichzeitig steht (Design muss das halten) |

K.-o.: keins verletzt.

## Tickets

TICKET regie-R1-01 → firma-regie
Kriterium: Hook + Frame 1 · Note: 7/10
Beleg: beats.json B01 „bild“/„brief“; hooks.md Frame 1; autor-runde2-kurz.md R1-04 („Frame-1-Text ≤ 12 neue Wörter“)
Problem: Frame 0 zeigt neben der Hook-Frage (9 W.) die ganze alte Zeile (~15 W.) plus die neue Zeile (9 W.) lesbar = ~33 Wörter im ersten Frame.
Soll: In B01 ist außer der Serien-Hook-Frage höchstens ~12 Wörter lesbar: alte Zeile nur als groß durchgestrichene Beträge „11,20 € · 5,20 €“ lesbar (Rest weiche Textur), neue Zeile „Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“ – im Feld „bild“ und „brief.hinweis“ ausdrücklich so festgelegt.

TICKET regie-R1-02 → firma-regie
Kriterium: kein Beat > 1,5 s ohne sichtbare Änderung · Note: 7/10
Beleg: beats.json B14 (letztes Ereignis „Umsatzsteuer-Status“ 33,33 → B15 „Als“ 35,15 = 1,82 s); B15 („Umsatzsteuer@36.8“ 36,88 → „Kommentiere“ 38,53 = 1,65 s)
Problem: zwei Lücken ohne verankertes Ereignis; „kleiner Push-in“/„GEWERBE pulst“ ohne Anker zählen nicht.
Soll: B14 bekommt ein verankertes Ereignis bei ~34,2 (z. B. Board-Badge GEWERBE „UST ?“ blinkt auf „Status“-Ende, Anker „Umsatzsteuer-Status+0.85“), B15 eins bei ~37,6 (GEWERBE pulst, Anker „Umsatzsteuer@36.8+0.7“); keine Lücke > 1,5 s zwischen 6,17 und 43,95.

TICKET regie-R1-03 → firma-regie
Kriterium: Textregel (ein Textblock, ≤ 4 W. + kleine Unterzeile, ≤ 12 neue Wörter) · Note: 7/10
Beleg: beats.json B12 „bild“: Karte „NUR DOLLAR“ + Unterzeile „im Lauf: Versandseite“ + grauer Gegenwert „€-Preis: kein Beleg“ + markierter Shot-03-Bereich, zugleich Briefzeile oben
Problem: drei Textelemente an einer Karte plus Screenshot-Satz → ~15 neue Wörter auf „Dollar“.
Soll: Gegenwert „€-Preis: kein Beleg“ gestrichen (Unterzeile „im Lauf: Versandseite“ bleibt Pflicht); Shot-03-Bereich „nur_dollar“ nur weiche Textur mit Marker auf „nur Dollarbeträge“; Briefzeile oben abgedunkelt. Neue lesbare Wörter auf „Dollar“ ≤ 12.

TICKET regie-R1-04 → firma-regie
Kriterium: beats.json vollständig, Anker Wort+after · Note: 7/10
Beleg: beats.json B09 `"wort_start": {"w": null, "after": 0}` bei von 15,41
Problem: Beat-Start nicht verankert (nur B01 darf null sein).
Soll: B09 `wort_start` = {"w": "Claude", "after": 15.0} (+0,15 wie Karte), alle 16 Beats außer B01 mit Wort + after.

## Hinweise (kein Ticket)
- Slot in beats.json („2026-11-01 12:00“) und Bibel Z. 122 („Slot 12:00“) steht noch auf 12:00; Chef aktualisiert beim Planen auf 18:00.
- Pause „aus.“ → „Die“ 0,34 s liegt knapp unter 0,4 (feste Eröffnung F12, unverändert lassen).
- Musikfenster wurde für F19 vergeben, als der Slot 12:00 war; bei 18:00 kollidiert es nicht mit F21 (325,0–375,46), Abstand zu F18 bleibt > 170 s.

## Ergebnis
Gesamtnote **8,3/10** (Mittel), aber 4 Kriterien bei 7 → **nicht bestanden**. Alle Tickets sind reine beats.json/regieplan-Änderungen; Stimme, words.json, STT, Musik und Bibel bleiben. Runde 2 = Kurzprüfung der 4 Tickets.
