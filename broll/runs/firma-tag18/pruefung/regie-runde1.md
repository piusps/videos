# Prüfung Regie · Folge 18 · Runde 1 · 2026-11-01
Prüfer: frischer Agent (firma-pruefer, Stufe regie). Geprüft: voice.mp3, words.json, beats.json, regieplan.md, musik.txt, regie/musik-abschnitt.mp3, regie/gap-final.txt gegen script.txt, briefing.md, tagesbriefing-2026-11-01.md, firma-tag9/tagesbriefing-2026-10-30.md, design/lauf/LAUF.md; Vergleich firma-tag17/beats.json, firma-tag13/beats.json, firma-tag19/script.txt. Gemini/OpenRouter nicht genutzt (402) → alles manuell. Nichts an den Prüflingen geändert.

## Eigene Messungen
| Messung | Wert | Vorgabe | |
|---|---|---|---|
| Wörter | 100 (script.txt, words.json 100 Einträge) | 85–100 | ✓ (Obergrenze) |
| voice.mp3 (ffprobe) | 43,55 s; letztes Wort endet 43,19 | – | |
| Folge (beats.json seconds) | 44,51 s | 40–48 | ✓ |
| wpm | 134,8 über die Folge (100/44,51); nur Stimme 137,9 | 120–135 | ✓ knapp, s. Hinweis |
| Rückblick „Die“ → Ende „extra.“ | 6,48 s (words.json 7,12–13,60); eigenes STT 7,18–13,54 = 6,36 | ≤ 6,5 | ✓ |
| „Heute“ | 14,01 (eigenes STT 14,04) | ≤ 14,5 | ✓ |
| Tempo TTS | 1,0 laut regieplan/el.mjs, kein atempo | 1,0 | ✓ |
| STT eigen (ElevenLabs scribe_v1, de, 2 Läufe auf voice.mp3, /tmp/pr18/stt0/1.json) | beide 100/100 Wörter wortgleich; einzig Satzzeichen „Tag fünf**:**“, „Claude,“, „Web-Suche“ | wortgleich | ✓ |
| words.json vs. eigenes STT | Wortstarts weichen ≤ 0,07 s ab | – | ✓ |
| Musik explizit (eigener Lauf music-explicit-check) | 0 (nur „My love's gone … wake up from … Gone.“) | 0 | ✓ |
| Musikstart | 50,85, Ende 50,85+44,51 = 95,36 ≤ 96,85; Stem bis 96,05 | im Fenster | ✓ |
| Gap Stimme/Musik | ≥ 18,2 dB je Akt (gap-final.txt) | ≥ 15 | ✓ |
| Übergabe | F17 endet „Was zahlt sie für das gestickte Shirt?“ → F18 „Heute rechnet sie ihre Marge.“; F18 „Stimmt die Versandzeile?“ → F19 script „Heute prüft sie ihre Versandzeile.“ | Kette | ✓ |

## 0–6-s-Raster (Ereignis-Starts aus Karten/Bild/SFX/Kamera)
0,00 / 0,03 · 0,17–0,40 · 0,74 · 1,09 · 1,58 · 2,00 · 2,40 · 2,83 · 3,15 · 3,32/3,38 · 3,66 · 3,99 · **— nichts zwischen 3,99 und 4,60 —** · 4,60 · 4,90/4,95 · 5,12 · 5,58 · 6,11 · 6,42.
Fenster **[4,0; 4,5) ohne Ereignis-Start** (Lücke 0,61 s). Der Punch-in auf „führt?“ startet 3,99, die Preisschild-Pulse liegen auf 4,6 (B03 events `4.6`, SFX `t 4.6`).

## Lücken > 1,5 s ohne sichtbare Änderung (nach dem Hook)
- 10,33 → 11,97 (1,64 s) B06 „steht“, nur Banner auf „bestickt“, nichts auf „Bestellung“.
- 26,69 → 28,46 (1,77 s) B12: auf „Dort“ (27,80) kein Ereignis.
- 29,11 → 30,70 (1,58 s) B12/B13: Pfeil 29,90 → 21,80 ohne Anker.
- 21,76 → 23,29 (1,53 s) B10/B11 knapp (Akt-Pause 0,86 s).

## Noten
| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | STT = Skript | 10 | eigenes STT 2/2 wortgleich + 12 Läufe der Regie (voice.stt0–3, v-f1.stt0–7) |
| 2 | Länge/Tempo/Rückblick/Heute (K.-o.-Werte) | 9 | alle Werte in den Grenzen; Abzug: wpm 134,8 nur 0,2 unter 135, erreicht durch gedehnte Naht-Pausen 0,86 s („Einkaufspreis. → Ihren“) und 0,96 s („Versandzeile? → Kommentiere“); reine Stimme 137,9 wpm |
| 3 | Warum-Beat mit Grund-Karten | 9 | B12 WARUM? + „8 € RABATT“ (vs 21,80 statt 29,90), B13 „AB 17 € NICHTS“ – je ein eigener Beat, ≥ 1,2 s Abstand |
| 4 | Roter Faden / Akte / Ortswechsel | 7 | 7 Akte ✓, Story-Objekt Shirt ✓. Aber B10 (Satz „Ohne Printful-Konto findet sie keinen Einkaufspreis.“, 2,7 s): SHOT02 → SHOT09-Kopf → Stempel PREIS FEHLT „auf dem leeren Preisschild des Shirts“, obwohl das Shirt laut story_objekt im Claude-Akt „off (Paper-Fenster)“ ist = zwei Wechsel in einem Satz und Bruch mit „selbes Fenster“ (regieplan Akt 5) |
| 5 | Storyline / Bibel / gestern–morgen | 9 | Kette 17→18→19 sauber, Board-Stand (WERBEBRIEF current, Badge 5ER OFFEN), kein „gestern“, Menschen-Schritt Konto nicht erzählt |
| 6 | Hook-Takt + kein Beat > 1,5 s ohne Änderung | 6 | 0–6-s-Fenster [4,0; 4,5) leer (s. Raster) = **K.-o. laut Auftrag**; vier Lücken > 1,5 s (s. o.) |
| 7 | Frame 1 = ganze Frage + Ergebnis-Objekt | 7 | Frage + Shirt mit „? €“ ✓. Aber B01 plant zusätzlich die volle SHOT06-Zeile „Damit gehst du bei der ersten 5er-Bestellung bei 17,15 € netto Printful-Preis pro Shirt auf null.“ = 15 lesbare Wörter (Regel ≤ ~12 je Screenshot) + 9 Wörter Frage = 24 Wörter in Frame 0; F17-Frame-0 hob nur 2 Wörter hervor |
| 8 | Mehrwert-Beats mit echter Claude-UI | 9 | SHOT01/07/02/09/08/06 aus dem echten Lauf, Crops angegeben, Sidebar/„Wieder am Start“ verboten |
| 9 | Textregeln (ein Block, ≤ 4 Wörter, ≥ 1,2 s) | 7 | B10: SHOT02-Kernsatz (bis 12 Wörter) ab 19,81, SHOT09-Kopf „Was ich ohne Printful-Konto nicht sehen kann“ schon auf „Printful-Konto“ 20,16 = 0,35 s später zweiter Textblock. B08: Pill „HEUTE: MARGE“ 14,01, auf „Marge“ 15,04 neues Text-Bild „29,90 €“ + „Einkauf ? · Versand · Rest ?“ = 1,03 s Abstand und > 4 Wörter |
| 10 | Ton-Plan (Musikbett, SFX) | 9 | Mulde vor „Warum?“, Akzent auf 26,69, Explizit 0 (eigener Lauf), Gap ≥ 18 dB, SFX wechseln, Stempel nur 2× |
| 11 | beats.json vollständig, Anker Wort + after | 8 | jeder Satz abgedeckt ✓; B01 und B09 `wort_start {"w": null}` (B09 hätte „Claude“ als Anker); B08 SFX „Marge“/„Marge:end“ ohne @-Zeit trotz eigener Kollisionsliste (15,04 / 38,36) |
| 12 | Betonungsrisiken | 8 | nicht abgehört (kein Ohr), eigenes STT sauber für Marge, Tag fünf, Fünferpack, siebzehn, Verkaufspreis; Regie-Messungen plausibel. Hinweis: STT setzt 2/2 „Tag fünf**:**“ statt Punkt → Kadenz evtl. nicht ganz fallend, im Final-QC anhören |
| 13 | Faktenschutz (Lauf gedeckt, verbotene Beträge) | 7 | 5,75 nirgends lesbar ✓, 21,80/29,90/109/8,10 gedeckt ✓. Aber „17,15 €“ lesbar in Frame 0 (B01) und B13 (Beleg SHOT06): LAUF.md Z. 38 – Schwelle 17,15 hängt an den unbestätigten 5,75 € (Spanne 17,00–17,71), „gesprochen daher nur siebzehn Euro (gerundet)“. Bildschirm zeigt die unbelegte Präzision |

Durchschnitt 8,1 · niedrigste Note 6.

## K.-o.-Liste
1. **0–6 s: Fenster 4,0–4,5 s ohne Ereignis** (beats.json B03, events `führt` 3,99 → `4.6`). Trivial behebbar, aber nach Auftrag K.-o.

Alle anderen Pflichtregeln eingehalten: 100 Wörter, TTS 1,0, 134,8 wpm, 44,51 s, Rückblick 6,48 s, Heute 14,01 s, STT wortgleich, Musik explizit 0, Musikstart im Fenster, Maskottchen-Regeln in den Verboten, 5,75 nicht geplant, Übergabe passt zu F17/F19.

## Gesamturteil
**Nicht bestanden** (K.-o. 1; Kriterien 4, 6, 7, 9, 13 < 8). Ton, Stimme und Storyline sind fertig – keine neue TTS nötig. Alle Tickets sind reine beats.json/regieplan-Korrekturen.

## Tickets
```
TICKET regie-R1-01 → firma-regie
Kriterium: Hook-Takt 0–6 s · Note: 6/10
Beleg: beats.json B03 events ["ganz@3","alleine","führt",4.6], SFX t 4.6; words.json führt? 3,994–4,331, Ich 4,949
Problem: Zwischen 3,99 und 4,60 startet kein Ereignis, das 0,5-s-Fenster 4,0–4,5 ist leer (K.-o.).
Soll: Preisschild-Puls + Tick auf „führt:end“ (≈ 4,35 s) statt 4,6; jedes Fenster 0–6 s hat ≥ 1 Ereignis-Start, Liste im regieplan nachgewiesen.
```
```
TICKET regie-R1-02 → firma-regie
Kriterium: kein Beat > 1,5 s ohne Änderung · Note: 6/10
Beleg: beats.json B06 (10,33→11,97), B12 (26,69→28,46 und 29,11→30,70), B10/B11 (21,76→23,29)
Problem: Vier Strecken von 1,53–1,77 s ohne sichtbares neues Ereignis.
Soll: Ereignis auf „Bestellung“ (11,06, z. B. Nadel-/Stick-Tick im Banner), auf „Dort“ (27,80, Marker/Puls auf dem Fünferpack), auf „pro Shirt“ (29,49, Pfeil 29,90→21,80 verankert) und auf „Einkaufspreis:end“/Stempel-Nachschwung (≈ 22,5); danach keine Lücke > 1,5 s zwischen 7,12 und 43,19.
```
```
TICKET regie-R1-03 → firma-regie
Kriterium: Frame 1 / Faktenschutz · Note: 7/10
Beleg: beats.json B01 bild + shot (SHOT06 Zeile, 15 Wörter, „17,15 €“); B13 Beleg SHOT06; LAUF.md Z. 38
Problem: Frame 0 zeigt 24 lesbare Wörter und die unbelegte Präzision 17,15 € (hängt an den unbestätigten 5,75 €).
Soll: In Frame 0 neben der Hook-Frage nur Shirt + „? €“ und höchstens ein kurzer Marker-Ausschnitt (≤ 4 Wörter, z. B. „… auf null.“); „17,15“ nirgends lesbar (Zeile weichzeichnen oder nur als Textur), Zahl auf dem Bildschirm nur als „17 €“ wie gesprochen.
```
```
TICKET regie-R1-04 → firma-regie
Kriterium: Textregeln · Note: 7/10
Beleg: beats.json B10 (SHOT02 19,81 → SHOT09-Kopf auf „Printful-Konto“ 20,16); B08 (HEUTE: MARGE 14,01 → „29,90 €“ + „Einkauf ? · Versand · Rest ?“ auf „Marge“ 15,04)
Problem: Zwei neue Textblöcke 0,35 s bzw. 1,03 s nacheinander, das Rechen-Bild hat > 4 Wörter.
Soll: B10 nur EIN Screenshot-Text (SHOT02-Kernsatz; SHOT09 streichen oder nur Schloss-Icon ohne Text); B08 Rechen-Bild ≥ 1,2 s nach der Pill (frühestens 15,25) oder die Abzugs-Zeilen ohne Text (nur Icons), ≤ 4 Wörter.
```
```
TICKET regie-R1-05 → firma-regie
Kriterium: Roter Faden / Ortswechsel · Note: 7/10
Beleg: beats.json B10 bild „Stempel 'PREIS FEHLT' … auf dem leeren Preisschild des Shirts“; story_objekt „Claude+0.15: off (Paper-Fenster)“; regieplan Akt 5 „selbes Fenster“
Problem: Im Satz „Ohne Printful-Konto …“ wechselt das Bild Fenster → zweiter Screenshot → Shirt, das im Akt gar nicht im Bild ist.
Soll: Höchstens ein Ortswechsel pro Satz: Stempel PREIS FEHLT im Paper-Fenster (z. B. auf den Kernsatz) ODER Shirt sichtbar im Fenster-Akt eingeplant (story_objekt-Platz ergänzt); Akt 5 bleibt an einem Ort.
```
```
TICKET regie-R1-06 → firma-regie
Kriterium: beats.json Anker · Note: 8/10 (Pflege, kein Bestehenshindernis)
Beleg: beats.json B01/B09 wort_start w null; B08 SFX „Marge“, „Marge:end“
Problem: Zwei Beats ohne Wortanker, Kollisionswort ohne @-Zeit.
Soll: B09 wort_start {"w":"Claude","after":15.8}; B08 „Marge@14.9“ / „Marge@14.9:end“.
```

Hinweise ohne Ticket: wpm-Puffer 0,2 – Design darf `seconds` nicht kürzen; „Tag fünf“ im Final-QC mit Kopfhörer auf fallende Kadenz prüfen (STT setzt Doppelpunkt).
