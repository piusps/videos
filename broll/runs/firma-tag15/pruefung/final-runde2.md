# Prüfung final · Folge 15 „Welche Adresse stimmt?“ · Runde 2

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-10-31. Nichts geändert.
Gemini 402 → manuell Frame für Frame. ffmpeg nur `broll/node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge (Stand 14:23–14:32): `firma-tag15-final.mp4` (45,000 s, 1080×1920, 30 fps, AAC 48 kHz stereo), `firma-tag15-handy.mp4` (45,014 s, 1,99 Mbit/s), `cover.jpg`, `kontaktbogen-2fps.jpg`, `versand-guide.pdf` (7 S., `guide-pages/p01–p07.png`, `guide-img/*`). Hinweis: `firma-tag15-final-handy.mp4` (12:56) ist die **alte R1-Handy-Fassung** – nicht ausliefern, Lieferdatei ist `firma-tag15-handy.mp4`.
Caption (12:17), replies.json (12:12) seit R1 unverändert → nur Stichprobe. Maßstab: `runs/firma-tag14/pruefung/final-runde2.md` (8,5).

## Belege (alle in `pruefung/final-r2/`)
- `full-4fps-01…08.jpg`: ganzes Video lückenlos 4 fps (je 6 s), `f/q_NNN.jpg` Einzelbilder 4 fps
- 30-fps-Streifen: `hook-0.8-1.4-30fps.jpg`, `t30-4.83` (Hook→Plan), `t30-15.13` (Briefe→Claude), `t30-22.93` (Duell→Warum), `t30-30.73` (Warum→Liste), `t30-34.43` (Liste→Frage-Karte), `t30-37.63` (Frage→CTA); Sammelbilder `tr-a.jpg`, `tr-b.jpg`
- Maskottchen: `mask-a.jpg` (13,3 / 14,5 / 34,5 / 36,9 s), `mask-b.jpg` (38,5 / 40,1 / 43,0 / 44,6 s), `rueckblick-augen-5fps.jpg` (6–13 s), **`cta-augen-5fps.jpg` (37,7–45,0 s), `augen-cta.jpg` (38,5 / 44,6 s, Vollauflösung mit 50-px-Raster)**
- Text/Board: `board-feld8-39.5.jpg`, `board-feld8-9.0.jpg`, `cta-card-43.9.jpg`
- `cover-small.jpg`, `kb-small.jpg`, `guide-s3-s5.jpg`; Vollbilder `full/t_<s>.jpg`

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge final / handy | 45,000 / 45,014 s (wie R1) | unverändert ✓ |
| Ton unverändert | Differenzsignal neue Mischung − R1-Handy-Ton: −41,0 dB mittel bei Signal −17,3 dB (≈ 24 dB, = Codec-Rest); gegen R1-`final-audio.mp3` −37,5 dB → **gleiche Mischung**, R1-STT (wortgleich script.txt, kein „Tag“, kein Gesang) gilt | ✓ |
| Lautheit final / handy | −14,0 LUFS, TP −1,3 dBFS, LRA 2,7 / −14,1 LUFS | −14 ±0,5 ✓ |
| Handy-Fassung | SSIM zum Master 0,990 (5 fps) | ✓ |
| Kontaktbogen-2fps | deckt sich mit neuem Master (Maskottchen 31–34 s sichtbar, Feld 8 „4 + 1 PLZ-CHECK“, große Warum-Karten) | ✓ |
| Szenenwechsel (scene > 0,2) | 1,07 / 3,67 / 4,93 / 6,2 / 15,23 / 16,77 / 18,03 / 23,03 + 23,13 / 30,83 / 34,53 + 34,67 / 37,73 | s. Übergänge |
| Caption (Stichprobe) | 2047 Zeichen, 0× „Tag“, Ende 6 Hashtags | ✓ |
| Guide-Text-Scan | 71 Streams entpackt, 0 Treffer Chemnitz/Dachdeck/Zimmerei/Malermeister/webvalid/Flöha; guidebook.html 0 Treffer | ✓ |

## R1-Tickets – Abnahme
| Ticket | Ergebnis | Beleg |
|---|---|---|
| **R1-01 Maskottchen 30,8–34,7 (K.-o.)** | **erledigt.** Liste sitzt oben, Maskottchen in jedem Frame 30,83–34,5 ganz sichtbar, Augen ^ ^ frei | `full-4fps-06.jpg`, `t30-30.73` |
| **R1-02 Maskottchen 12,4–15,2 (K.-o.)** | **erledigt.** HEUTE-Panel endet über dem Maskottchen, Maskottchen rechts ganz im Bild, Augen frei; Pille „prüft“ berührt nur die linke Kopfkante | `mask-a.jpg` 1–2, `full-4fps-03.jpg` |
| R1-03 CTA-Board Feld 8 | Inhalt erledigt: CTA-Board Feld 8 „4 + 1 PLZ-CHECK“, Rückblick 6–12 s weiter alter Stand ✓. Rest: Titel jetzt nur winziger Kicker „ADRESSEN“ (≈ 16 px, 0,8 %), letzter Buchstabe läuft unter das „?“; Unterzeile ≈ 20 px Versalhöhe. Feld 6 weiter nur Text „GEWERBE MENSCH“ (wie F14 akzeptiert) | `board-feld8-39.5.jpg` |
| R1-04 Lesbarkeit | Warum-Karten erledigt: „ABSCHRIFT VON 2014“, „GELESEN BEI NORTH DATA“, „EINTRAG 2015“ ≈ 60 px Versalhöhe, North Data gut lesbar 26,75–30,8 s ✓. DM-Unterzeile weiter ≈ 32 px (Engine, wie F14 akzeptiert). „in 10 Minuten“ ≈ 40 px Versalhöhe, „sichere · Adressen“ ≈ 30 px | `full-4fps-05/06.jpg`, `cta-card-43.9.jpg` |
| R1-05 Hook 1,07 s | teilweise: Maskottchen blendet 0,93–1,07 s aus (4 Frames), dann 1-Frame-Raumwechsel 1,067→1,10 (Stuhl/Hebel weg, Liste springt größer). Wirkt weiter wie ein kleiner Ruck | `hook-0.8-1.4-30fps.jpg` |
| R1-06 Guide S. 3/5 | erledigt: Gewerke, Städte, Daten, Registernummern geschwärzt (auch Jahreszahlen); Bildunterschrift S. 5 nennt North Data | `guide-s3-s5.jpg`, `guide-img/*` |

## Maskottchen im ganzen Video
| Zeit | Zustand | Urteil |
|---|---|---|
| 0,4–0,93 | steigt auf, ganz sichtbar | ok |
| 0,93–1,07 | blendet aus, Untertitel „Unternehmen“ liegt auf den Augen (4 Frames) | Kleinigkeit |
| 1,1–4,9 | nicht im Bild (Hook-Liste) | ok |
| 4,93–6,0 | ganz sichtbar, Pille „Ich probier“ auf der Stirn, Augen frei | ok |
| 6,2–13,0 | Seitenansicht rechts, Augen frei, Pillen links daneben | ok |
| 13,0–15,2 | unter dem HEUTE-Panel ganz sichtbar, Augen frei | ok (R1-02 behoben) |
| 15,23–18,0 | Claude-Vollbild, Maskottchen nicht im Bild | ok |
| 18,0–23,1 | klein unten, ganz sichtbar | ok |
| 23,13–30,8 | unter Warum-Panel, Kopfoberkante ≈ 15–20 % verdeckt, Augen frei | ok |
| 30,83–34,5 | ganz sichtbar | ok (R1-01 behoben) |
| 34,53–37,7 | klein unten rechts, ganz im Bild | ok |
| **37,73–41,9** | **Groß-Nahaufnahme CTA: Untertitel-Pillen („Brief“, „Kommentiere Versand“, „ich schick dir“, „die Prüffrage“, „Damit“) liegen auf den Augen; bei 1920 px Pillen-Unterkante ≈ y 1495, Augen ≈ y 1450–1545 → obere Augenhälfte verdeckt, ≈ 4,2 s** | **verletzt „Augen frei / keine Untertitel auf den Augen“** |
| 42,1–44,4 | Endkarte, Pillen über den Augen, Augen frei | ok |
| **44,5–44,75** | **Hüpfer: Maskottchen sinkt, „sichere Adressen“ verdeckt die ^ ^-Augen zu ≈ 70 %** | verletzt (kurz) |

Körper nie > 1/3 verdeckt (Pillen ≈ 10–15 % der Fläche) – die ≤-1/3-Regel ist eingehalten, aber das im Auftrag ausdrücklich verlangte „Augen frei, keine Untertitel auf den Augen – auch im CTA/Endkarte“ nicht (R1-H1 nicht umgesetzt, in der CTA-Nahaufnahme jetzt 4 s statt in F14 0,3 s).

## Übergänge 30 fps
- 4,90→4,93 Hook→Plan: harter Schnitt, sauber.
- 15,20→15,23 Briefe→Claude: sauber.
- **23,03–23,10 (3 Frames):** Warum-Panel steht schon, Hintergrund/Maskottchen/Untertitel noch in der Duell-Einstellung, Kamerasprung erst 23,13. Kurzes Zucken.
- 30,80→30,83 Warum→Liste: sauber, Maskottchen bleibt.
- **34,53–34,63 (4 Frames):** Kamera-Schnitt (Maskottchen nach unten rechts, Untertitel springt hoch) unter der noch stehenden Liste, 34,63 weiße Frage-Karte schaut unter der Liste hervor; ab 34,67 sauber. Gleiches Muster wie F14 R2-01 (dort als Backlog akzeptiert).
- 37,70→37,73 Frage→CTA: harter Schnitt, sauber; „KOMMENTIERE“ baut sich 37,73–37,9 auf.
- Keine Schwarzbilder, keine Doppelbilder außer den genannten.

## K.-o.-Liste
| K.-o. | verletzt? | Beleg |
|---|---|---|
| Frame 0: ganze Frage + Ergebnis-Objekt | nein | `full-4fps-01.jpg` 0,0 |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | nein | unverändert ggü. R1 |
| Nicht-Erstfolge: kein gesprochenes „Tag“, kein TAG-Slam | nein | Ton identisch zu R1; nur HUD-Badge „TAG 4“ wie F13/F14 |
| Kein Umsatz-Zähler | nein | ganze Länge, Feld 9 „ERSTER UMSATZ“ offen |
| Maskottchen ≤ 1/3 verdeckt | nein | s. Tabelle (R1-K.-o. beide behoben) |
| **Augen frei / keine Untertitel auf den Augen (Auftrag R2)** | **JA** | 37,73–41,9 s und 44,5–44,75 s, `cta-augen-5fps.jpg`, `augen-cta.jpg` |
| Fakten / Board-Stand | nein | CTA-Board „4 + 1 PLZ-CHECK“ = Ergebnis der Folge |
| Keine echten Namen/Adressen lesbar | nein | Video: Liste nur Balken, Briefe Platzhalter, Dateiname „Kolonnenshirt_Empfaenger_Serienbrief.xlsx“ (eigene Firma); Guide geschwärzt, Text-Scan 0 |
| Keine Sidebar | nein | Claude-Fenster 15,2–18,0 ohne Sidebar/Chatliste |
| North-Data-Hinweis lesbar | nein (erfüllt) | „GELESEN BEI NORTH DATA“ ≈ 60 px, 26,75–30,8 s |

## Noten je Kriterium
| Kriterium | Note | Beleg / Abzug |
|---|---|---|
| Hook (0–6 s) | 9 | unverändert stark; Abzug 1-Frame-Raumwechsel 1,07 s |
| Serienrahmen Nicht-Erstfolge | 9 | unverändert |
| Ton: Stimme, Tempo, Aussprache | 9 | Mischung identisch zu R1 |
| Musik + Lautheit | 9 | −14,0 LUFS / TP −1,3 |
| Untertitel | 8 | synchron; Abzug: liegen 37,7–41,9 s auf den Maskottchen-Augen |
| Text-Regeln / Lesbarkeit | 8 | Warum-Karten jetzt groß; Rest: Feld-8-Kicker „ADRESSEN“ winzig + am „?“, DM-Unterzeile 32 px (Engine) |
| **Bildfluss / Maskottchen** | **7** | beide R1-K.-o. behoben, sauber; aber CTA-Nahaufnahme 4,2 s mit Untertiteln über den Augen + Hüpfer 44,5; 3-Frame-Zucken 23,03 und 4-Frame-Zucken 34,53; Hook 1,07 |
| Fakten / Board / Kette | 9 | Board-Stand richtig |
| Anonymisierung | 9 | Guide sauber geschwärzt, Video/Caption 0 Treffer |
| CTA + Guide + Funnel | 9 | unverändert |
| Look vs. Folge 13 | 8 | gleichwertig; Warum-Einstieg 23,1–24,4 s weiter fast leeres Panel |
| Cover / Caption | 9 | Cover unverändert gut (Maskottchen ganz, Augen frei, Pill, Liste) |

**Scroller-Test:** 1 s Frage + 4× grün / 1× gelb → bleibt; 3 s Rahmen/Glanz + „GANZ ALLEINE.“ → bleibt; 10 s Rückblick-Board, schwächster Moment, ab 12,25 Briefe + Lupe → knapp bleibt.

## Vergleich mit Folge 14 R2 (8,5)
Hook, Ton, Lesbarkeit der Warum-Karten und Guide besser als F14; Maskottchen-Panels jetzt sauber. Schwächer: CTA-Nahaufnahme mit Untertiteln auf den Augen über 4 s (F14: 0,3 s am Hüpfer).

## Gesamtnote
**7,5 / 10** (Schnitt ≈ 8,6, aber Bildfluss/Maskottchen 7 < 8 und Auftragskriterium „Augen frei, keine Untertitel auf den Augen – auch im CTA/Endkarte“ verletzt).

## Urteil
**Nicht bestanden** (Runde 2) – knapp, ein eng begrenzter Punkt. Alle R1-K.-o. sind behoben, Ton/Guide/Cover/Caption abnahmefähig. Nötig nur: Untertitel-Lage (oder Maskottchen-Lage) im CTA 37,73–45,0 s neu, Ton/Länge/Rest unverändert; danach Handy-Fassung + Kontaktbogen neu. Runde 3 prüft nur 37,7–45,0 s (30 fps) + Ton-Identität.

## Tickets
```
TICKET final-R2-01 → firma-design   (PFLICHT)
Kriterium: Bildfluss / Maskottchen (Augen frei) · Note: 7/10
Beleg: 00:37,73–00:41,9 und 00:44,5–00:44,75 · pruefung/final-r2/cta-augen-5fps.jpg, augen-cta.jpg (38,5 s: Pillen-Unterkante y≈1495, Augen y≈1450–1545; 44,6 s: ^ ^ zu ≈ 70 % hinter „sichere Adressen“)
Problem: In der CTA-Nahaufnahme liegen die Untertitel-Pillen ≈ 4,2 s auf der oberen Augenhälfte, beim Hüpfer 44,5 s verdecken sie die Augen fast ganz.
Soll: In jedem Frame 37,73–45,0 s Pillen-Unterkante ≥ 20 px über der Augen-Oberkante (Augen inkl. ^ ^ beim Hüpfer vollständig sichtbar) – z. B. Untertitel im CTA ≈ 120–150 px höher (zwischen Gründungsplan-/DM-Karte und Kopf) oder Maskottchen entsprechend tiefer; „in 10 Minuten“-Karte und Pillen überlappen sich nicht. Ton, Länge, Untertitel-Timing unverändert. Beleg: 10-fps-Bogen 37,6–45,0 s.
```
```
TICKET final-R2-02 → firma-design   (empfohlen, im selben Render, nicht blockierend)
Kriterium: Bildfluss · Note: 7/10
Beleg: 00:23,03–00:23,10 und 00:34,53–00:34,63 · tr-a.jpg; 00:00,93–00:01,10 · hook-0.8-1.4-30fps.jpg
Problem: Panel-Wechsel und Kamera-Schnitt liegen 3 bzw. 4 Frames auseinander (Zucken, 34,63 Frage-Karte hinter der Liste); 0,93–1,07 Untertitel „Unternehmen“ auf den Augen, 1,07→1,10 1-Frame-Raumwechsel.
Soll: Kamera-Schnitt und Panel-Wechsel auf demselben Frame (23,03 bzw. 34,53); im 30-fps-Streifen ±0,3 s kein Frame mit zwei Szenen. Wenn ohne Risiko machbar: Raum 1,07 s weich wechseln.
```
```
TICKET final-R2-03 → firma-design   (Backlog)
Kriterium: Text-Regeln · Note: 8/10
Beleg: 00:37,73–00:40,3 · board-feld8-39.5.jpg
Problem: Feld-8-Titel „ADRESSEN“ nur ≈ 16 px und läuft unter das „?“; „4 + 1 PLZ-CHECK“ ≈ 20 px Versalhöhe.
Soll: Feldtitel in gleicher Größe wie die anderen Felder (z. B. „ADRESSEN“ zweizeilig wie F14 „BRIEF + ADRESSEN“), „?“ ohne Überlappung.
```
Hinweise (Backlog): H1 Warum-Einstieg 23,1–24,4 s leeres Panel (F13-H2/F14-H3/R1-H2 offen); H2 alte Datei `firma-tag15-final-handy.mp4` (R1) löschen/umbenennen, damit nicht versehentlich ausgeliefert; H3 Feld 6 „GEWERBE MENSCH“ ohne Personen-Symbol.
