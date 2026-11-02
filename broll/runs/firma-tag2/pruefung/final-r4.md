GESAMTNOTE: 8/10

# Finale Prüfung R4 (Ausnahme): Folge „Kunde“ (firma-tag2), tag2-kunde-v4.mp4

Am 2026-10-28 hat ein frischer Prüfer nur Ticket final-R3-1 und dessen Umfeld geprüft. Die Datei ist 44,0 s lang, 1080x1920 bei 30 fps.

Belege liegen in `pruefung/r4/`:
- `q4.png`: 34,3–38,0 s mit 5 fps. Bild i zeigt 34,3 + 0,2·i s.
- `f370.png` (37,0 s), `f3785.png` (37,85 s), `f381.png` (38,1 s): Vollbilder
- `v3_card.txt` / `v4_card.txt`: Bilddifferenz von Frame zu Frame im Kartenbereich y 250–1350, ohne Untertitel, 34,0–38,2 s

**Ergebnis: bestanden.** Der Marker schließt die Lücke. Es gibt keine neuen Überdeckungen, und außerhalb des Markers ist v4 gleich wie v3.

## Geprüfte Punkte

| Punkt | Note | Beleg |
|---|---|---|
| R3-1: Bild-Ereignis zwischen 35,8 und 37,93 s, kein Abschnitt > 1,5 s ohne Ereignis (34,3–38,0 s) | 8 | Für v4 gegen v3 wurden Pixel mit einer Abweichung > 20 im Kartenbereich gezählt. Bis 36,93 s sind es 0 Pixel. Ab **36,97 s** zeichnet sich der orange Marker von links nach rechts (231 → 817 px), bei ≈ 37,27 s ist er fertig. Er liegt bei y 930–954 und x 168–908. Er kommt damit ≈ 0,27 s später als die angekündigten ≈ 36,7 s. Das ist unkritisch, weil er so direkt nach dem Wortende von „Bestellen?“ (36,757 s) in der Sprechpause sitzt. Die Ereignisse in der Folge: Karte 34,10–34,57, Pill 35,63–35,73, Marker 36,97–37,27, Schnitt 37,93. Die längste Lücke ist **1,24 s** (35,73–36,97). Danach folgen 0,66 s und 1,06 s. Damit liegt alles unter 1,5 s. In der Frame-zu-Frame-Differenz hebt sich das Zeichnen kaum vom Schweben ab (≈ 3,0 gegen 2,8, `v4_card.txt`). Mit bloßem Auge ist der Marker aber klar zu sehen (`q4.png` Bilder 13–17, `f370.png`). Deshalb 8 und nicht höher: Das Ereignis ist eher leise, eine wachsende Linie ohne Puls oder Sound |
| Untertitel-Sync 33–40 s (Stichproben) | 9 | Der Ton ist bitgleich mit v3 (Audio-MD5 6be7a821…, identisch). Die Untertitelzone ist im Vollbildvergleich bei 33,5 / 35 / 36,5 / 37,5 / 39 s ohne Abweichung. Stichproben aus `words.json` gegen `q4.png`: „Offen bleibt“ (34,20–34,81) steht bei 34,3–34,9. „Was nervt“ (34,99–35,51) steht bei 35,1–35,5. „Betriebe“ (ab 35,735) ist bei 35,7 aktiv. „Bestellen“ (ab 36,234) ist bei 36,3 aktiv. „Kommentiere“ (ab 38,069) ist bei 38,1 aktiv (`f381.png`). Die R2-Werte (≤ 0,07 s) gelten weiter |
| Keine neuen Überdeckungen | 9 | `f370.png` / `f3785.png`: Der Marker liegt unter der Grundlinie von „beim Bestellen?“ und berührt keinen Buchstaben, denn die Zeile hat keine Unterlängen. Er bleibt innerhalb der Karte (x 168–908 bei einer Kartenbreite bis ≈ 960). Bis zur Pill „ALS NÄCHSTES“ (Oberkante ≈ y 1180) sind es ≈ 225 px, bis zu den Untertiteln (ab ≈ y 1390) noch mehr |
| Übergang zur Endkarte | 8 | Der harte Schnitt bei 37,93 s ist gleich wie in v3. In der Endkarte bleibt kein Marker-Rest (`f381.png`, Vollbildvergleich 39 s = 0 px). Der alte Untertitel „Betriebe beim Bestellen“ steht noch ≈ 0,14 s über der Endkarte, bis „Kommentiere“ bei 38,07 s kommt (`q4.png` letztes Bild). Das ist unverändert seit v3 und war dort akzeptiert |
| v4 außerhalb 34–38 s gleich wie v3 | 10 | Vollbilder in halber Auflösung, Schwelle 25: 0 abweichende Pixel bei 2,5 / 12 / 25 / 33,5 / 35 / 36,5 / 39 / 42 s. Nur bei 37,5 s weichen Pixel ab, und zwar allein im Marker-Band y 928–956. Im PSNR über das ganze Video liegt das Minimum außerhalb von 34–38,2 s bei 44,9 dB, das ist nur Encoder-Rauschen. Der Ton ist bitgleich |

## Übernommene R3-Noten (nicht geändert)
Hook 8 · Kamera 8 · Lesetext 8 · ohne Ton verständlich 8 · Musik 8 · CTA 8 · Vergleich Tag 1 v7 8 · LUFS/Sync 9 · Scroller-Test 8 · Caption 9 · Fakten ok · Begleitdateien 9 · Cover 9 · R2-1a 9 · R2-1b 8 · R2-2a–d 9/9/10/8.
Bisher stand „regie + design bestätigt“ wegen R2-1c auf 7, jetzt auf **8**. R2-1c ist durch R3-1 gelöst und steht ebenfalls auf **8**.

Alle Kriterien liegen bei ≥ 8, kein K.-o.-Kriterium ist verletzt.

**Gemini-Review:** weiter offen, weil OpenRouter kein Guthaben hat. Das ist kein K.-o. Nach dem Aufladen nachholen mit `node scripts/review-video.mjs --video runs/firma-tag2/tag2-kunde-v4.mp4`.

Hinweise ohne Ticket:
1. Der Marker kommt bei 36,97 s und nicht wie angekündigt bei 36,7 s. Das ist gut so, aber es sollte in den Design-Notizen nachgetragen werden.
2. Der Untertitel-Rest über der Endkarte (37,93–38,07 s) ist seit v3 bekannt. Bei einem späteren Re-Render kann man die Untertitel am Schnitt leeren.
