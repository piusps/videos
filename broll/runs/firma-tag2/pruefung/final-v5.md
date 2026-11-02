GESAMTNOTE: 8/10 · K.-o.: keins verletzt · Tickets: keine · Ergebnis: v5 darf v4 ersetzen

# Finale Prüfung v5 (Neueinstieg): Folge „Kunde“ (firma-tag2), tag2-kunde-v5.mp4

Geprüft am 2026-10-28 um 16:47 von einem frischen Prüfer. Die Datei ist 46,90 s lang, 1080x1920 bei 30 fps, AAC 48 kHz.
Belege liegen in `pruefung/v5/`:
- `q_splice.png`: 4,4–12,2 s mit 5 fps. Das Label im Bild ist die Zeit ab 4,4 s.
- `splice_full.png`: v5 bei 6,9 / 8,0 / 9,2 / 10,1 s, zum Vergleich v4 bei 5,0 s
- `v4_hook_4.6-8.0.png`: der alte Abschnitt in v4
- `card_8.0_crop.png`: die Rückblick-Karte in voller Auflösung
- `cmp_v4_v5_shift.png`: v4 bei t, darunter v5 bei t+2,88 s
- `ssim_shift.txt`, `hook_diff_4.5-6.5.txt`, `diff_events.txt`, `diff_6.4-8.7.txt`: Bild-Ereignisse und Differenzen
- `stt-final.json`: whisper medium auf der finalen Tonspur
- `sync_spot.png`: Stichproben zu den Untertiteln
- `env.mjs`: Pegelhüllkurve

## Geänderter Abschnitt (≈ 4,5–12 s)

| Punkt | Note | Beleg |
|---|---|---|
| Text und STT | 9 | whisper auf dem Final: „Ihre Firma verkauft Logo-Shirts an kleine Betriebe, gedruckt erst auf Bestellung. Was noch fehlt? Der erste Kunde. Heute sucht sie ihn.“ Das ist wortgleich zu `script.txt`. „Logo-Shirts“ wird sauber erkannt. Der Rest der Tonspur entspricht dem Skript. Die einzige Abweichung ist „Kloth“ für „Claude“, ein bekannter Whisper-Fehler, der Anlaut ist klar |
| Vorgaben des Koordinators | 9 | Produktsatz 5,40–8,62 s und Stand-Satz 8,67–10,24 s, zusammen **4,84 s** (≤ 6 s). Danach folgt „Heute sucht sie ihn“ (10,45–11,47). Die Fakten stimmen mit `Tag-1-Ergebnis.md` überein: „Firmenshirts mit Logo, Druck auf Bestellung über einen Partner, Betriebe unter 10 Leuten“ |
| Neueinstieg (K.-o.-Regel: nach 10 s Projekt und heutiger Schritt) | 8 | Das Projekt steht bei 0–5 s, das Produkt bei 5,4–8,6 s. Die Kachel „2 KUNDE ?“ steht ab 8,8 s im Bild, „der erste Kunde“ ist bei 10,24 s gesagt. Das ist knapp, aber erfüllt, weil das Bild den heutigen Schritt schon ab 8,8 s zeigt. Die Mehrwert-Schritte beginnen bei 11,69 s („Plus“), also vor 14 s |
| Rückblick-Akt im Bild | 8 | `q_splice.png` / `splice_full.png`: Die LOGO-SHIRTS-Karte mit Shirt-Icon springt bei 6,0 s ein, genau auf „Logo-Shirts“ (6,23 s) mit popHi-SFX. Das Tag „erst auf Bestellung gedruckt“ kommt bei ≈ 7,5 s auf „gedruckt“ (7,51 s). Das Board GRÜNDUNGSPLAN zeigt Schritt 1 PRODUKT mit Haken. Bei 8,63 s folgt ein harter Schnitt zur Kachel „2 KUNDE ?“: Die Kachel springt bei 8,8–9,0 s ein, die leere Kiste öffnet sich bei 9,1–9,5 s und Papier fliegt heraus. Bei 10,30 s kommt der Schnitt zu Claude auf „Heute“ (10,45 s). Alles, was gesagt wird, ist im selben Moment zu sehen. Nur „kleine Betriebe“ hat kein eigenes Bild. Abzüge siehe Hinweise 1–3 |
| Takt im Hook-Bereich (bis „Heute“) | 8 | `hook_diff`, `diff_events`: Die Ereignisse liegen bei 4,97–5,30, 6,00–6,40, ≈ 7,5, 8,63, 8,8–9,5 und 10,30 s. Lücken ohne Bild-Ereignis gibt es bei **5,33–6,00 (0,67 s)**, ≈ 6,4–7,5 (1,1 s) und ≈ 7,6–8,63 (1,0 s). In diesen Lücken wechseln nur die Untertitel-Pills Wort für Wort. Das entspricht dem Maßstab aus R2: Dort waren 1,25 s mit nur Pills bei 3,5–4,75 s als 8 akzeptiert. Es bleibt unter der 1,5-s-Regel. Bei 0–6 s gibt es streng genommen eine Stelle mit 0,67 s ohne neues Bild-Ereignis (5,33–6,00). Weil die Pills dort wechseln, werte ich das nicht als K.-o. |
| Schnittstellen im Ton | 9 | `env.mjs` auf `voice.mp3`: Beide Schnitte liegen in digitaler Stille, bei 5,15–5,38 s und 11,49–11,61 s (−inf dB). Davor und danach liegt nur Rauschen bei ≤ −58 dB. Im Mix liegt dort das Musikbett (≈ −35 dB), also gibt es keinen Klick und kein Pump-Loch. Den größten Sample-Sprung findet man nur in Sprache, nicht an den Schnitten. Die Lautheit ist gleich: neu (5,4–11,4 s) −17,9 LUFS, alter Teil −17,8 / −18,2 / −18,4 LUFS. Rauschfarbe: Der neue Teil liegt bei ≈ −100 dB, der alte bei ≈ −60 dB. Das ist unter dem Bett nicht hörbar |
| Satzpause im neuen TTS | 8 | Zwischen „Bestellung.“ und „Was noch fehlt“ liegen nur **≈ 0,08 s** Pause (Stimme < −35 dB von 8,62 bis 8,70 s). Der Bildschnitt bei 8,63 s trennt die Sätze aber sichtbar. Zwischen „Kunde.“ und „Heute“ sind es ≈ 0,22 s. Ich konnte das nicht abhören, siehe Hinweis 4 |

## Gesamtes Video

| Punkt | Note | Beleg |
|---|---|---|
| Länge 40–48 s | 9 | 46,90 s. Die Sprache endet bei 45,88 s, die Endkarte steht noch ≈ 1 s |
| LUFS | 10 | −14,0 LUFS integriert, True Peak −1,2 dBFS, LRA 2,1 (v4: −14,0 / −1,2 / 2,0) |
| Untertitel-Sync (≤ 0,1 s) | 9 | `words.json` gegen die Stimm-Einsätze nach Pausen (17 Stellen über das ganze Video): Abweichung 0,00–0,06 s, darin ≈ 0,025 s MP3-Versatz. Die Stimme liegt im Mix ohne Delay. Die Komposition verankert alle Zeiten über `at(Wort, after)`, die Hinweise sind um +2,88 s verschoben. `sync_spot.png`: Bei 12,15 / 28,72 / 31,21 / 37,13 / 40,99 / 45,27 s ist jeweils das richtige Wort aktiv (Research, Beim, Und, Offen, Kommentiere, findest). Die whisper-Wortzeiten (−ml 1) streuen bis 0,8 s und taugen nicht für den Sync, deshalb habe ich die Einsätze geprüft |
| Musik ≥ 15 dB unter der Stimme | 9 | Im neuen Abschnitt liegt das Bett höchstens bei 0,2·0,5 (−36,4 LUFS) gegen −17,9 LUFS Stimme, also ≈ 18,5 dB Abstand. Ein Stück, kein Loop, so wie in v4 |
| Keine Rückschritte gegen v4 | 9 | `cmp_v4_v5_shift.png`: 9 Zeitpunkte (v4 9,5 bis 42,5 s gegen v5 +2,88 s) sind inhaltlich gleich: Claude-Fenster, 264 Quellen, Handwerk, Warum-Karten, Statistik-Zitat, NOCH OFFEN mit Marker-Pill, CTA, Endkarte. SSIM über 35 s liegt im Mittel bei 0,93. Einbrüche gibt es nur an Schnitten (Versatz von 0,4 Frames, weil 2,88 s = 86,4 Frames) und bei Kamerafahrten. Die SFX-Anker in `mix.mjs` sind alle über Wörter verschoben, plus ein neuer popHi auf „Logo-Shirts“ |
| Cover | 9 | `cover.png` ist unverändert. Der Cover-Zeitpunkt `COVER_HK = 4,3` liegt vor dem geänderten Abschnitt |
| Übernommene Noten aus R3/R4 | ≥ 8 | Kamera 8 · Lesetext 8 · ohne Ton verständlich 8 · CTA 8 · Vergleich Tag 1 v7 8 · Caption 9 · Fakten ok · Begleitdateien 9 |

**Gemini-Review:** weiter offen, weil OpenRouter kein Guthaben hat. Das ist kein K.-o., aber es sollte nachgeholt werden.

## Hinweise ohne Ticket
1. Der Stempel „GANZ ALLEINE.“ bleibt in v5 bis 8,63 s stehen (in v4 nur bis ≈ 5,4 s). Er liegt dadurch 3,3 s lang über dem Produkt-Rückblick, gleichzeitig mit Karte und Tag. Das ist kein Fehler, weil zur selben Zeit nur ein neues Label kommt. Beim nächsten Render sollte er beim Einsprung der Karte (≈ 6,0 s) ausblenden.
2. Die Karte verdeckt rechts das Board: die Hälfte von „GRÜNDUNGSPL|AN“, das „?“ von Kachel 2 und die Kacheln 3/6/9. Schritt 1 mit Haken bleibt sichtbar, die Vorgabe ist also erfüllt. Schöner wäre die Karte etwas tiefer oder kleiner.
3. Lesbarkeit: „LOGO-SHIRTS“ hat ≈ 1,9 % Versalhöhe, das Tag ≈ 1,6 % (`card_8.0_crop.png`). Beides liegt unter der 3-%-Regel, aber auf Serienniveau (die Warum-Karten sind ähnlich). Das Gesagte steht zeitgleich im Untertitel, und das Shirt-Icon trägt die Aussage.
4. Pius sollte kurz 8,3–9,0 s abhören. Zwischen „Bestellung.“ und „Was noch fehlt“ liegen nur 0,08 s. Wenn es gehetzt klingt, reicht eine Pause von 0,25 s in `voice.mp3`. Das verschiebt aber alles um 0,25 s und braucht einen neuen Render. Für heute 18:00 nicht nötig.
5. In der Musikkurve `mix.mjs` ist der Knoten `[7.5, 0.2]` nicht um +2,88 s verschoben. Das Bett steigt dadurch etwas früher an (0,16 → 0,2). Hörbar ist das kaum, der Abstand bleibt ≈ 18 dB. Beim nächsten Mix sollte der Knoten auf 10,4 gesetzt werden.
6. Das Skript hat jetzt 129 Wörter. Die Autor-Regel verlangt 100–120, v4 hatte schon 120. Das kommt aus der Vorgabe des Koordinators, die Länge von 46,9 s hält die 40–48 s ein. Für die nächsten Folgen sollte der Rückblick anderswo Wörter einsparen.

Alle Kriterien liegen bei ≥ 8, kein K.-o.-Kriterium ist verletzt. **v5 ist freigegeben als Ersatz für v4 im Slot 18:00.**
