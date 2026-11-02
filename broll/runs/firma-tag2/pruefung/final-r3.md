GESAMTNOTE: 7/10

# Finale Prüfung R3: Folge „Kunde“ (firma-tag2), tag2-kunde-v3.mp4

Geprüft am 2026-10-28 von einem frischen Prüfer. Geprüft wurden nur die offenen Punkte aus R2. Datei: 44,0 s, 1080x1920, 30 fps. Der Ton ist laut Auftrag gleich wie in v2, deshalb gelten die R2-Werte weiter (−14,0 LUFS, Sync ≤ 0,07 s, STT wortgleich).

Belege in `pruefung/r3/`:
- `full.png`: das ganze Video mit 1 fps, 11 Bilder pro Zeile. Bild i zeigt Sekunde i, gezählt ab 0 oben links.
- `q.png`: 34,3–38,0 s mit 5 fps. Bild i zeigt 34,3 + 0,2·i s.
- `warum.png`: 22–31 s mit 2 fps. Bild i zeigt 22 + 0,5·i s.
- `keys.png`: 2,0 / 2,25 / 2,5 / 31,5 / 32,5 / 33,5 s
- `still.png`: Kartenbereich bei 35,85 / 36,6 / 37,4 / 37,85 s
- `c.png`: Cover-Ausschnitte, y 260–640 und y 1440–1640
- `card.raw`: Bilddifferenz von Frame zu Frame im Kartenbereich y 250–1350, also ohne Untertitel, für 34,0–38,2 s

**Ergebnis: knapp nicht bestanden.** Das Cover und die beiden Hinweise sind sauber gelöst. Die Reste der Branchenkarten sind weg. Allerdings wurde „ALS NÄCHSTES“ von 36,3 auf 35,63 s vorgezogen. Dadurch ist hinten eine neue Standstelle von ≈ 2,2 s entstanden (35,77–37,93 s), in der sich im Bild nur die Karte leicht bewegt. Damit gilt die Regel „kein Abschnitt > 1,5 s ohne Bildänderung“ wieder nicht. Zur Behebung reicht ein einziges Bild-Ereignis. Ton und Skript bleiben unverändert.

## Geprüfte Punkte

| Punkt | Note | Beleg |
|---|---|---|
| R2-1a: keine Branchenkarten-Reste 34,3–38,0 s | 9 | `q.png`, alle 19 Bilder: Hinter der Fragekarte „Was nervt Betriebe beim Bestellen?“ ist nur die leere Wand zu sehen. Keine Kante und kein Rest von FRISEURE oder Kfz. Ab 37,93 s kommt der harte Schnitt zur Kommentar-Szene mit Board |
| R2-1b: Änderung zwischen 34,9 und 35,8 s | 8 | `card.raw`: Bei 35,63 s springt die Differenz auf 23,4, weil die Pill „ALS NÄCHSTES“ einspringt (`q.png` Bild 7 = 35,7 s). Das Unterstreichen von „nervt“ gibt es nicht, ist aber nicht nötig. Abweichung vom R2-Soll: Die Pill sollte bei 36,3 s bleiben und kommt jetzt 0,67 s früher. Inhaltlich ist das unschädlich |
| R2-1c: kein Abschnitt > 1,5 s ohne Bildänderung (34,3–38,0 s) | 6 | `card.raw`: Bild-Ereignisse gibt es bei 34,10 s (Karte springt ein, bis 34,57 s) und bei 35,63 s (Pill). Danach kommt erst bei 37,93 s der Schnitt. Dazwischen liegt die Differenz durchgehend bei 0,4–3,1, das ist nur das leichte Schweben der Karte (≈ 20 px, `still.png`). Über **35,77–37,93 s ≈ 2,2 s** kommt kein neues Ereignis. Zwischen 36,76 und 38,07 s ist auch eine Sprechpause, dort steht sogar der Untertitel „Betriebe beim Bestellen“ still (`still.png` Bild 3–4). Die Lücke 34,6–35,6 s ≈ 1,0 s ist ok |
| R2-2a: Titel und Stempel ganz zwischen y 300 und 1620 | 9 | `cover.png` / `c.png`: Die Oberkante der Titelzeile 1 liegt bei y ≈ 312, die Unterkante des Stempels bei y ≈ 900 |
| R2-2b: Stempel ≥ 20 px Abstand zum Board-Titel | 9 | Die unterste Stempel-Ecke liegt bei y ≈ 900, der Board-Rahmen bei y ≈ 958, der Text „GRÜNDUNGSPLAN“ bei y ≈ 995. Abstand ≥ 55 px |
| R2-2c: Board-Titel ganz sichtbar oder ganz verdeckt | 10 | „GRÜNDUNGSPLAN · 9 SCHRITTE“ ist ganz zu sehen, kein Wortrest |
| R2-2d: Sticker „Wer kauft die Shirts?“ verdeckt nichts | 8 | Der Sticker liegt bei y ≈ 1495–1616, der Board-Rahmen und die Neonlinien enden bei y ≈ 1488. Er verdeckt nichts, liegt aber nur ≈ 7 px unter dem Board und ≈ 4 px innerhalb der Grenze von 1620. Er ist im 4:5-Raster zu sehen. Hinweis: Er bekommt etwas mehr Luft, wenn man ihn 10–15 px kleiner macht |
| Hinweis „9 SCHRITTE“ mit Abstand | 9 | `keys.png` Bild 2–3 (2,25 / 2,5 s): Das Label steht klein mit ≈ 8–10 px Abstand hinter „GRÜNDUNGSPLAN“ und klebt nicht mehr am Rahmen. Bei 2,0 s ist es noch nicht eingeblendet |
| Hinweis Claude-Fenster auf Inhaltshöhe | 9 | `keys.png` Bild 4–6 (31,5–33,5 s): Das Fenster endet direkt unter dem Zitat, ohne weiße Leerfläche. Der Bot steht frei darunter |

## Gegenprobe

| Punkt | Note | Beleg |
|---|---|---|
| Kontaktbogen 1 fps, ganzes Video | 8 | `full.png`: Die Abfolge ist gleich wie in v2: Hook, Board, Kiste, Claude, Prompt, Branchenwand, Handwerk-Stempel, Warum, Zitat, Fragekarte, Kommentar-CTA. Es fehlt kein Beat und es ist kein Bild leer oder kaputt |
| Warum-Beat 22–31 s ruhig, 3 Grund-Karten | 9 | `warum.png`: Die Handwerk-Karte steht. 300.000+ kommt bei ≈ 23,0 s, Shirt = Werbung bei ≈ 26,0 s, 1–2× pro Jahr bei ≈ 28,5 s. Keine fremden Karten |
| Keine Überlappung von Untertiteln und Karten | 8 | `full.png`: Die Untertitel liegen in allen Szenen unter den Karten. Bei ≈ 12 s steht die Pill „brauchen“ weiter knapp am Sticker. Das ist unverändert gegenüber R2 und war dort schon nur ein Hinweis |
| Kein Lesetext | 9 | 31–34 s: nur die Statuszeile und ein Zitat mit 3 Zeilen. Am Prompt-Tippen 11–15 s hat sich nichts geändert |

## Übernommene R2-Noten (nicht geändert)
- Hook: 8
- Kamera: 8, jetzt mit Board und Claude-Fenster besser
- Lesetext: 8
- ohne Ton verständlich: 8
- Musik: 8
- CTA: 8
- Vergleich mit Tag 1 v7: 8
- LUFS/Sync: 9
- Scroller-Test: 8
- Caption: 9
- Fakten: ok
- Begleitdateien: 9

Neu bewertet:
- Cover: 9 (vorher 7)
- regie + design bestätigt: 7, wegen R2-1c

**Gemini-Review:** offen. OpenRouter hat kein Guthaben (402). Das ist kein K.-o., nach dem Aufladen nachholen mit `node scripts/review-video.mjs --video runs/firma-tag2/tag2-kunde-v3.mp4`.

## Korrektur-Ticket

```
TICKET final-R3-1 → firma-design
Kriterium: kein Beat > 1,5 s ohne Bildänderung · Note: 6/10
Beleg: 0:35,77–0:37,93, q.png Bild 8–18, still.png, card.raw (Differenz im Kartenbereich nur 0,4–3,1 = Schweben)
Problem: Nach dem Einsprung von „ALS NÄCHSTES“ (35,63 s) steht die Fragekarte ≈ 2,2 s ohne neues Ereignis bis zum Schnitt. In der Sprechpause 36,76–38,07 s steht auch der Untertitel still.
Soll: Zwischen 35,8 und 37,93 s gibt es mindestens ein sichtbares Bild-Ereignis, sodass kein Abschnitt in 34,3–38,0 s länger als 1,5 s ohne Ereignis ist. Vorschlag: bei ≈ 36,7 s ein Unterstreichen oder Marker auf „nervt“, oder ein Puls am Fragezeichen. Weiterhin keine Branchenkarten-Reste, „ALS NÄCHSTES“ bleibt bei ≈ 35,6 s, Ton, Untertitel und alle anderen Beats bleiben unverändert. Das Cover bleibt, wie es ist.
```

Hinweis, kein Ticket: Der Cover-Sticker liegt mit ≈ 7 px sehr knapp unter dem Board-Rahmen. Wer ohnehin neu rendert, kann ihn um 10–15 px verkleinern.
