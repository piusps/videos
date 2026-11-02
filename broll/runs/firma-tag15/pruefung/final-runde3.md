# Prüfung final · Folge 15 „Welche Adresse stimmt?“ · Runde 3 (letzte Runde)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-10-31. Nichts am Video geändert.
Gemini 402 → manuell Frame für Frame plus Pixelmessung (Python/PIL auf 30-fps-PNGs). ffmpeg nur `broll/node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge (Stand 15:10): `firma-tag15-final.mp4` (45,000 s, 1080×1920, 30 fps, AAC 48 kHz stereo, 10,9 Mbit/s), `firma-tag15-handy.mp4` (45,014 s, 1,99 Mbit/s), `kontaktbogen-2fps.jpg`.
Umfang laut Auftrag: R2-01 (37–45 s, 30 fps, Pixelabstände), R2-02 (Schnitte 23,03 / 34,66 s), Schnelldurchgang Maskottchen + Regressionen, Ton, Lautheit. Rest war in R1/R2 abnahmefähig.

## Belege (alle in `pruefung/final-r3/`)
- `f/c_1110…c_1349.png`: 37,000–44,967 s, alle 240 Frames in voller Auflösung (Frame-Nr. n ↔ t = 37 + (n−1110)/30)
- `messung-30fps.txt`: Pixelmessung je Frame (Augen-Oberkante, Unterkante des nächsten Hindernisses darüber inkl. Schlagschatten, Kante ohne Schatten)
- `cta-10fps-37-45.jpg` (10-fps-Bogen 37–45 s), `crops4.jpg` (37,73 / 38,5 / 41,9 / 44,6 s), `zoom-knapp.png`, `zoom-1to3.png` (3×-Pixelzoom 39,2 / 41,33 / 44,7 s mit 10-px-Raster)
- `karte-pillen-40.6-42.1.jpg` (Karte „in 10 Minuten“ vs. Pillen, 30 fps), `brief-board-37.5.jpg` („Brief“-Pille vs. Plan-Board, 30 fps)
- `t30-22.83.jpg`, `t30-34.43.jpg` (30-fps-Streifen um die Schnitte)
- `q/q_001…180.jpg` + `ssim-r2-r3.txt` (4 fps, SSIM gegen R2-Frames `final-r2/f/`), `uebersicht-2fps-22.5-45.jpg`

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge final / handy | 45,000 / 45,014 s | unverändert ✓ |
| Ton unverändert | Differenz neue Mischung − R1-`final-audio.mp3`: −37,0 dB mittel bei Signal −17,3 dB (R2: −37,5 dB gegen dieselbe Referenz) → **gleiche Mischung**, R1-STT (wortgleich script.txt) gilt | ✓ |
| Lautheit final / handy | −14,0 LUFS, TP −1,3 dBFS, LRA 2,7 / −14,1 LUFS | −14 ±0,5 ✓ |
| Handy-Fassung | SSIM zum Master 0,995 (5 fps) | ✓ |
| Kontaktbogen-2fps | deckt sich mit neuem Master (CTA: Pillen oben auf dem Kopf, „Brief“ unter dem Board, Endkarte „sichere Adressen“ über ^ ^) | ✓ |
| Szenenwechsel (scene > 0,2) | 1,07 / 3,67 / 4,93 / 6,2 / 15,23 / 16,77 / 18,03 / **23,03** / 30,83 / **34,67** / 37,73 (R2: Doppel 23,03+23,13 und 34,53+34,67) | ✓ |
| Regression gegen R2 | SSIM ≥ 0,97 in allen 4-fps-Frames außer 23,0 (Schnitt), 34,5–34,75 (Schnitt), 37,5–45,0 (CTA) – genau die beauftragten Stellen | ✓ |

## R2-01 – Pixelmessung 37,73–45,0 s (30 fps)
Augen im CTA sind in **jedem** Frame zu 100 % sichtbar, keine Pille liegt auf einem Auge (R2: 4,2 s obere Augenhälfte verdeckt, Hüpfer ≈ 70 %). Abstände Augen-Oberkante → nächstes Element darüber:

| Zeit | Augen-OK y | Pillen-Kante y | Abstand Pillen-Kante | Abstand inkl. Schlagschatten | Urteil |
|---|---|---|---|---|---|
| 37,73–37,83 | 1310–1394 | 1275–1319 | 34–74 px | 28–74 px | ✓ |
| 37,87–38,87 | 1444–1478 | 1417 | 25–40 px | 21–36 px | ✓ |
| 38,90–39,47 („Kommentiere Versand“) | 1440–1442 | 1417 | **23–25 px** | 17–19 px | ✓ Kante / Schatten knapp |
| 39,50–40,60 | 1444–1468 | 1397–1439 | 25–57 px | 21–51 px | ✓ |
| 40,63 (Einflug „Prüffrage“, schräg) | 1468 | 1445 | ≈ 22 px | 17 px | ✓ Kante |
| 40,73–41,43 („die Prüffrage“, schräg) | 1462–1468 | 1440–1443 | **≈ 18–22 px** (3×-Zoom 41,33 s: 20 px) | 14–20 px | grenzwertig |
| 41,47–41,83 | 1462–1466 | DM-Symbol (blau, fliegt zum Maskottchen) bei 1443–1449; Pille ≈ 1432 | Pille ≈ 28 px; DM-Symbol 12–17 px | – | ✓ (Symbol berührt die Augen nicht) |
| 41,87–42,07 | 1466–1472 | 1419–1433 | 31–45 px | 31–45 px | ✓ |
| 42,10–43,53 (□-Augen, weiß) | ≈ 1505 | ≈ 1415–1425 | ≈ 80–90 px (Sicht, 20-px-Raster `zoom-knapp.png`) | – | ✓ |
| 43,57–44,63 | 1452–1566 | 1418 | 33–148 px | 27–138 px | ✓ |
| **44,67–44,77 (Hüpfer-Scheitel, 4 Frames)** | **1429–1440** | **1415 (Pille), Schatten bis 1423** | **≈ 14–22 px** (3×-Zoom 44,70 s: 14 px) | **7–15 px** | **Soll knapp verfehlt** |
| 44,80–45,0 | 1452–1576 | 1418 | 33–160 px | 27–134 px | ✓ |

- **„in 10 Minuten“-Karte vs. Pillen:** Karte erscheint 41,73 s (Pop-in), Unterkante ≈ y 1270–1285, Pillen-Oberkante ≥ y 1310–1330 → in keinem Frame Überlappung (`karte-pillen-40.6-42.1.jpg`, `crops4.jpg`). ✓
- **„Brief“-Pille vs. Plan-Board (Design-Hinweis):** 37,73–37,80 s (3 Frames) liegt die Pille auf dem unteren Board-Rahmen, unter Feld 7/8; Feldtexte „BETRIEBE“/„4 + 1 PLZ-CHECK“ bleiben frei. 37,83–37,87 dasselbe kurz mit der einfliegenden „Kommentiere“-Pille. Nur 0,1–0,15 s, keine Text-Verdeckung → Kleinigkeit.

**Ergebnis R2-01:** im Sinn erfüllt (Augen inkl. ^ ^ beim Hüpfer in jedem Frame vollständig sichtbar, Karte überlappt nicht). Die Zahl „≥ 20 px“ wird gegen die Pillen-Kante in 37,73–44,63 eingehalten bzw. 41,27–41,43 auf ≈ 18–20 px getroffen; **am Hüpfer-Scheitel 44,67–44,77 (4 Frames = 0,13 s) nur ≈ 14 px (Schatten 7 px)**. Gegen die Schatten-Unterkante gemessen läge auch 38,9–39,47 und 40,73–41,83 unter 20 px. Kein K.-o.: nichts verdeckt, die Lücke ist sichtbar.

## R2-02 – Schnitte
- **23,03 s:** Panel-Wechsel (Duell → Warum-Rahmen), Kamera und Maskottchen springen auf demselben Frame (22,83+0,200 s = 23,03); davor/danach je eine saubere Einstellung, kein Mischframe (`t30-22.83.jpg`). ✓
- **34,66 s:** Liste → „Als Nächstes“-Karte, Kamera, Untertitel und Maskottchen auf demselben Frame (34,43+0,233 = 34,66); kein Frame mit Liste hinter der Frage-Karte mehr (`t30-34.43.jpg`). ✓
- Hook 1,07 s unverändert (war optional) – bleibt Kleinigkeit.

## Maskottchen im ganzen Video (Schnelldurchgang)
0–37,5 s per SSIM identisch zu R2 außer den beiden Schnitten → R2-Tabelle gilt (überall ≤ 1/3 verdeckt, Augen frei; 0,93–1,07 s Untertitel „Unternehmen“ kurz über den Augen, 4 Frames, unverändert). Schnitte 23,03 / 34,66 geprüft: Maskottchen ganz sichtbar. 37,73–45,0 s s. Messung: ganz im Bild, nie > 1/3 verdeckt (Pillen liegen nur auf der Kopfoberkante), Augen frei. Endkarte 42,1–45,0 s: ✓.

## K.-o.-Kriterien
| K.-o. | verletzt? | Beleg |
|---|---|---|
| Maskottchen > 1/3 verdeckt | nein | ganze Länge, s. o. |
| Augen bedeckt / Untertitel auf den Augen (auch CTA/Endkarte) | **nein** | `messung-30fps.txt`, `zoom-1to3.png` |
| Ton geändert / Gesang / „Tag“-Slam | nein | Differenz −37 dB = Codec-Rest |
| Übrige (Umsatz-Zähler, Namen/Adressen, Sidebar, Fakten) | nein | unverändert zu R2 (SSIM) |

## Noten je Kriterium
| Kriterium | Note | Beleg / Abzug |
|---|---|---|
| Hook (0–6 s) | 9 | unverändert |
| Serienrahmen Nicht-Erstfolge | 9 | unverändert |
| Ton: Stimme, Tempo, Aussprache | 9 | Mischung identisch |
| Musik + Lautheit | 9 | −14,0 LUFS / TP −1,3 |
| Untertitel | 8 | Augen jetzt frei; Abzug: Pillen sitzen sehr eng auf dem Kopf, „Brief“ 3 Frames auf dem Board-Rahmen |
| Text-Regeln / Lesbarkeit | 8 | unverändert (Feld-8-Kicker „ADRESSEN“ klein, R2-03 Backlog) |
| **Bildfluss / Maskottchen** | **8** | R2-01 im Sinn behoben, R2-02 behoben (je ein Schnitt-Frame); Abzug: Hüpfer-Scheitel 0,13 s nur 14 px Luft, Hook 1,07 |
| Fakten / Board / Kette | 9 | unverändert |
| Anonymisierung | 9 | unverändert |
| CTA + Guide + Funnel | 9 | unverändert; CTA-Nahaufnahme jetzt sauber lesbar |
| Look vs. Folge 13 | 8 | Warum-Einstieg 23,03–24,4 s weiter fast leeres Panel (H1) |
| Cover / Caption | 9 | unverändert |

## Vergleich mit Folge 14 R2 (8,5)
Gleichwertig bis besser: Hook, Ton, Warum-Karten, Guide besser; CTA-Nahaufnahme jetzt ohne Augen-Verdeckung (F14: 0,3 s am Hüpfer verdeckt, F15 R3: 0 Frames verdeckt, nur 4 Frames mit < 20 px Luft).

## Gesamtnote
**8,5 / 10** (Schnitt ≈ 8,7; kein Kriterium < 8, kein K.-o.)

## Urteil
**Bestanden** (Runde 3). Lieferdateien: `firma-tag15-final.mp4`, `firma-tag15-handy.mp4`, `kontaktbogen-2fps.jpg` (passt). Ehrlich vermerkt: das Zahlen-Soll „≥ 20 px“ aus R2-01 ist am Hüpfer-Scheitel 44,67–44,77 s (4 Frames) mit ≈ 14 px nicht ganz erreicht; die Augen sind dort aber vollständig sichtbar, daher kein Blocker.

## Tickets (nicht blockierend, Backlog)
```
TICKET final-R3-01 → firma-design   (Backlog, ab Folge 16)
Kriterium: Bildfluss / Maskottchen · Note: 8/10
Beleg: 00:44,67–00:44,77 · pruefung/final-r3/zoom-1to3.png (oben), messung-30fps.txt Frames 1340–1343; 00:41,27–00:41,43 ≈ 18–20 px
Problem: Beim Hüpfer steigt das Maskottchen bis 14 px (Schatten 7 px) an die festen CTA-Pillen heran; Pillen-Schlagschatten wird nicht als Abstand mitgerechnet.
Soll: Abstand Pillen-Unterkante inkl. Schlagschatten → Augen-Oberkante in jedem Frame ≥ 20 px, auch am Hüpfer-Scheitel (Hüpfhöhe begrenzen oder captionY im CTA/Endkarte ≈ 15 px höher). Prüfregel in firma-pruefer: Abstand immer inkl. Schatten messen.
```
```
TICKET final-R3-02 → firma-design   (Backlog)
Kriterium: Untertitel · Note: 8/10
Beleg: 00:37,73–00:37,87 · pruefung/final-r3/brief-board-37.5.jpg
Problem: „Brief“- und einfliegende „Kommentiere“-Pille liegen 3–4 Frames auf dem unteren Rahmen des Plan-Boards.
Soll: Beim CTA-Kamerawechsel Pillen und Board ohne Überlappung (Board 20 px höher oder Pille erst nach dem Schnitt).
```
Weiter offen aus R2 (Backlog): R2-03 Feld-8-Titel „ADRESSEN“ zu klein/unter dem „?“; H1 Warum-Einstieg 23,03–24,4 s leeres Panel; H3 Feld 6 ohne Personen-Symbol; Hook 1,07 s Raumwechsel. Hinweis: alte R1-Datei `firma-tag15-final-handy.mp4` ist nicht mehr im Ordner (H2 erledigt).
