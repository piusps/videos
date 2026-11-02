# Prüfung final · Folge 16 „Wie kommen die Adressen in den Brief?“ · Runde 2 (Slot 2026-10-31 18:00)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-10-31. Nichts geändert (nur Belege in `pruefung/final-r2/` angelegt).
Gemini/OpenRouter nicht genutzt (R1: 402) → manuell Frame für Frame. ffmpeg nur `broll/node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge (Stand 15:01): `firma-tag16-final.mp4` (44,130 s, 1080×1920, 30 fps, h264 10,2 Mbit/s, AAC), `firma-tag16-final-handy.mp4` (44,139 s, 1,78 Mbit/s), `cover.jpg` (1080×1920), `kontaktbogen-2fps.jpg`. Caption, replies.json, Guide seit R1 unverändert (12:26 / 14:21) → R1-Ergebnis gilt, nur Stichprobe.
Maßstab: `runs/firma-tag14/pruefung/final-runde2.md` (8,5).

## Belege (alle in `pruefung/final-r2/`)
- `full-4fps-01…08.jpg`: ganzes Video lückenlos 4 fps (je 6 s, Zeitstempel absolut)
- 30-fps-Streifen an allen Übergängen: `t30-hook` (0,87–1,23), `t30-0490` (Hook→Plan), `t30-0600` (Plan-Zoom), `t30-1200`, `t30-1240`, `t30-1280` (Rückblick→Heute, 11,97–13,13), `t30-1590` (Heute→Claude), `t30-1845` (Claude→Minute), `t30-2145` (Briefe→Seite), `t30-2400` (4 VON 14→Warum), `t30-3190`, `t30-3220` (Warum→Als Nächstes), `t30-3600` (→CTA), `t30-3890`, `t30-3920-dmkarte`, `t30-3970`, `t30-4010` (CTA, DM-Karte, Flieger)
- Vollbilder: `full_<s>.png` (8,0 / 12,1 / 12,5 / 13,0 / 14,0 / 16,0 / 16,1 / 17,0 / 20,0 / 23,0 / 27,0 / 30,0 / 33,0 / 36,3 / 37,5 / 38,5 / 39,0 / 40,25 / 42,0 / 42,5 / 43,9)
- Ausschnitte: `hook-mask-0.9-1.07.jpg`, `cta-42.5-oben.png`, `crop-steht-30.png`
- Ton: `final-audio.mp3`, `stt-final-mix.json` (ElevenLabs Scribe der fertigen Mischung)

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge final / handy | 44,130 / 44,139 s (wie R1) | unverändert ✓ |
| STT fertige Mischung | wortgleich mit script.txt (nur „probiere/schicke“, Zahlen ausgeschrieben, „[Musik]“ am Ende); kein „Tag“ | ✓ |
| Ton vs. R1 | Mono-16-kHz-Korrelation zu `final-r1/final-audio.mp3` 0,994 bei Versatz 0; Restdifferenz über die ganze Länge konstant (Pegel-/Codec-Versatz der R1-mp3). **Einzige echte Änderung: 12,5–13,2 s** (Sprechpause vor „Heute“) neues/verschobenes Whoosh-SFX, Fensterpegel −17 dBFS statt −43 (Stimme dort −9 bis −15) → zum neuen Szenenwechsel 12,43, nicht störend. Stimme, Musik, Timing unverändert | ✓ |
| Lautheit final / handy | −14,0 LUFS, LRA 2,2 / −14,1 LUFS | −14 ±0,5 ✓ |
| Handy-Fassung | SSIM zum Master 0,991 (5 fps) | ✓ |
| Leere/eingefrorene Frames | blackdetect 0, freezedetect (≥ 0,6 s) 0 | ✓ |
| Kontaktbogen-2fps | deckt sich mit dem neuen Master (Heute-Akt Maskottchen frei, Untertitel CTA unten, Mini-Brief+Liste ab 10,5) | ✓ |
| Caption / replies (Stichprobe) | unverändert seit R1 (1962 Zeichen, Fiktiv-Hinweis, 6 Hashtags; 1+5 Antworten mit „?“) | ✓ |

## R1-Tickets – Abnahme
| Ticket | Ergebnis | Beleg |
|---|---|---|
| **R1-01 Maskottchen 12,4–18,6 (K.-o.)** | **erledigt.** Heute-Panel sitzt oben (Unterkante y ≈ 950), Pill bei y ≈ 1000–1100, Maskottchen unten rechts in jedem Frame ganz sichtbar, Augen frei (`full_14.0.png`). Claude-Fenster endet bei y ≈ 1385, Maskottchen darunter ganz sichtbar, Oberkante berührt die Fensterkante (`full_17.0.png`, `full-4fps-03.jpg` 16,0–17,75, `full-4fps-04.jpg` 18,0–18,25) | ✓ |
| **R1-02 CTA-Untertitel auf den Augen (K.-o.)** | **erledigt.** Untertitel 36,2–40,07 liegen unterhalb der Augen auf Mund/Unterkörper (y ≈ 1625–1860 bei Maskottchen y ≈ 1305–1880): Augen in jedem Frame frei, Verdeckung ≈ 30 % (Fläche, Arme frei) – knapp unter 1/3. Ab 40,1 Untertitel über dem Kopf (y ≈ 1220). Hook 0,93–1,07: die halbtransparente „Unternehmen“-Pill liegt auf der Stirn, Augen frei (`hook-mask-0.9-1.07.jpg`) | ✓ (knapp) |
| R1-03 Lesbarkeit | weitgehend erledigt. Versalhöhe gemessen an 1080×1920: SHIRTS MIT LOGO ≈ 60–75 px, ≈ 1 MINUTE ≈ 65, 4 VON 14 GEFÜLLT ≈ 75, STEHT IN / DER LISTE ≈ 58–60, FEHLT IN / BEIDEN DATEIEN ≈ 58, „Versand der Shirts?“ ≈ 65, HEUTE-Pill ≈ 60, „in 10 Minuten“ ≈ 65, „eigene · Serienbriefe“ ≈ 55. Unterzeilen „erst auf Bestellung bestickt“, „Erfinden ×“, „Brief × · Liste ×“ und Pill „ALS NÄCHSTES“ entfernt (Sprechtext trägt sie). Rest < 58 px: DM-Karte „Anleitung“ ≈ 48, „Prompt · Word-Schritte“ ≈ 45, Chip „gesendet“ ≈ 35 (Engine, wie F14-R2-02). Leerzeichenfehler „eigene ·Serienbriefe“ nur noch während des Pulses 42,0–42,6, ab 42,75 korrekt (`cta-42.5-oben.png`) | ✓ (Rest Backlog) |
| R1-04 Doppelpanels 24,03 / 32,07–32,23 | erledigt. 24,0→24,03 harter Panel-Wechsel ohne Doppelbild; Kamera folgt aber erst 24,10 (2 Frames neues Panel mit alter Kamera, gestaffelter Schnitt, `t30-2400`). 31,93→31,97 Panel raus + Kamera-Schnitt im selben Frame, Frage-Karte wächst allein, Lauf-Zitat ab 32,2 darüber ohne Überlappung (`t30-3190`, `t30-3220`) | ✓ |
| R1-05 Hook-Abgang | **nicht umgesetzt** (wie gemeldet): 1,067→1,100 verschwinden Raum, Stuhl, Hebel und Maskottchen in einem Frame, Briefe bleiben (`t30-hook`) | offen → Backlog |
| R1-06 Look | teilweise. ✓ Mini-Brief + Mini-Liste (4 JA, 1 VORBEHALT) ab 10,75 in der Shirt-Karte; ✓ CTA-Mitte ab 40,4 mit Ergebnis-Block (leer nur noch 39,1–40,4); ✓ beide Anhang-Karten 16,1–16,4 und 17,7–18,5 ganz im Fenster (16,6–17,3 schneidet der Push-in die XLSX-Karte bewusst an, `full_17.0.png`). ✗ Logo „KOLONNEN SHIRT“: zweite Zeile „SHIRT“ im Ergebnis-/Warum-Akt 21,5–31,9 weiter von grauem Balken überdeckt (`full_23.0.png`, `full_30.0.png`) | teilweise |

## Maskottchen-Durchgang (ganzes Video, ≤ 1/3 verdeckt, Augen frei, keine Untertitel auf den Augen)
| Zeit | Zustand | Urteil |
|---|---|---|
| 0,0–0,4 | steigt von unten auf | ok (Ereignis) |
| 0,5–1,07 | ganz sichtbar; 0,93–1,07 „Unternehmen“-Pill halbtransparent auf der Stirn, Augen frei | ok |
| 1,10–4,90 | ganz weg (Hook-Karte, Raum ausgeblendet) | ok (ganz weg) |
| 4,90–6,13 | ganz sichtbar, „Ich probier“-Pill auf der Kopfoberkante (≈ 10 %) | ok |
| 6,17–12,40 | Halbprofil unten rechts, ganz im Bild; Untertitel-Pill streift die Oberkante (≈ 10 %, `full_8.0.png`) | ok |
| 12,43–16,07 | unten rechts, ganz sichtbar, Augen frei (`full_12.5.png`, `full_14.0.png`) | ok – R1-K.-o. behoben |
| 16,10–18,50 | unter dem Claude-Fenster ganz sichtbar, Augen frei (`full_17.0.png`) | ok – R1-K.-o. behoben |
| 18,53–36,17 | klein unten rechts bzw. unter dem Panel, ganz im Bild, Augen frei; „?“-Blase darüber (`full_20.0`, `full_23.0`, `full_30.0`, `full_33.0`) | ok |
| 36,20–40,07 | groß, Untertitel auf Mund/Unterkörper, Augen frei, ≈ 30 % (`full_37.5`, `full_38.5`) | ok (knapp) |
| 39,23 | DM-Karte startet 1 Frame auf der Kopfoberkante, fliegt nach oben (`t30-3920-dmkarte`) | ok (1 Frame, Augen frei) |
| 39,9–40,6 | Papierflieger-Symbol (≈ 20 × 40 px) landet auf der Stirn zwischen den Augen | ok, aber unschön (Hinweis) |
| 40,10–44,13 | Untertitel über dem Kopf, Maskottchen ganz sichtbar, Hüpfer am Ende | ok |

**Kein Maskottchen-K.-o. mehr.** Vollbild-Einschübe: keine halben Zustände (Hook 1,10–4,90 ganz weg).

## Übergänge 30 fps – Befund
- Sauber: Plan-Zoom 6,13→6,17 (harter Schnitt), Briefe→Seite 21,43→21,47, 4 VON 14→Warum 24,0→24,03, Warum→Frage 31,93→31,97, Frage→CTA 36,17→36,20.
- Restschwächen (keine K.-o., Backlog):
  1. **12,43–12,97 s:** Heute-Brief/Liste-Panel oben + alte SHIRTS-Karte darunter gleichzeitig (≈ 0,55 s, gestapelt, nicht überlappend); dazwischen 12,43–12,73 (**≈ 10 Frames**, nicht 0,1 s) die angeschnittene untere Board-Reihe „BETRIEBE · + ADRESSEN · UMSATZ“; 12,77–12,97 schaut die HEUTE-Pill orange hinter der SHIRTS-Karte hervor; 13,0 SHIRTS-Karte in einem Frame weg (`t30-1240`, `t30-1280`, `full_12.5.png`). HEUTE-Pill steht ab 13,0, gesprochen „Heute“ 13,47 (0,47 s vorher).
  2. 16,067: 1 Frame altes Brief-Panel über dem Claude-Fenster (`t30-1590`).
  3. 18,53–18,57: 2 Frames Uhr-Panel über dem noch sichtbaren Claude-Fenster, Kamera-Schnitt erst 18,60 (`t30-1845`).
  4. 24,03–24,07: neues Panel, Kamera springt erst 24,10 (gestaffelter Doppelschnitt).
  5. 4,90–4,93: Raum + Maskottchen kehren 2 Frames vor dem Abgang der Brief-Karte zurück (`t30-0490`).
  6. Hook-Abgang 1,10 (R1-05).

## K.-o.-Liste
| K.-o. | verletzt? | Beleg |
|---|---|---|
| Frame 0: ganze Frage + Ergebnis-Objekt | nein | `full-4fps-01.jpg` 0,0: Frage + 5 Briefseiten, gelbe Platzhalter |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | nein | unverändert ggü. R1 (`full-4fps-01.jpg`) |
| Nicht-Erstfolge: kein gesprochenes „Tag“, kein TAG-Slam | nein | STT ohne „Tag“; nur HUD-Badge „TAG 4“ wie F13–F15 |
| Kein Umsatz-Zähler | nein | ganze Länge; Board-Feld 9 ERSTER UMSATZ offen |
| Maskottchen ≤ 1/3, Augen frei, keine Untertitel auf den Augen | **nein** (R1-Verstöße behoben) | Tabelle oben |
| Keine echten Namen/Adressen/Websites lesbar | nein | Empfängerblock + Website im Datenschutzsatz grün/schwarz balkiert (`full_23.0`, `full_30.0`, Cover); Liste nur Balken + JA/VORBEHALT; Dateinamen „Kolonnenshirt_…“ ohne Personenbezug; Mini-Bild in der Shirt-Karte unlesbar klein + balkiert |
| Keine Sidebar | nein | Claude-Fenster 16,1–18,5 nur Titelzeile + Anhang-Karten + unscharfer Text |
| Fakten 1:1, keine Zahl gegen Bibel | nein | s. unten |
| Briefe nie versandfertig | nein | gelbe Platzhalter in jedem Briefbild, Board-Feld 8 bleibt „?“ |
| Versand-Beat = Shirt-Paket, keine Briefmarke | nein | 29–36 s Paket mit Shirt + „? €“ |

**Kein K.-o. verletzt.**

## Fakten der neuen Bilder gegen LAUF.md
- **SHIRTS MIT LOGO** (Produkt-Karte 7,2–12,97): LAUF/Brief „Firmenshirts mit gesticktem Logo, gemacht für kleine Handwerks- und Baubetriebe“ ✓; Sprechtext „Shirts mit Logo … bestickt erst auf Bestellung“ = Brief „Gestickt wird erst, wenn Sie bestellen“ ✓.
- **Mini-Brief + Mini-Liste** in der Karte (ab 10,75): 1 Brief (Lauf 13), Liste 5 Zeilen, 4× JA / 1× VORBEHALT = LAUF „Ja mit Vorbehalt“ ✓; Haken „geprüft“ ✓.
- **≈ 1 MINUTE** = LAUF 12:14:16 → 12:15:16 ✓; **5 Briefseiten** ✓; **4 VON 14 GEFÜLLT** = „je Brief 4 von 14 Platzhaltern“ ✓; Lauf-Zitat „Versand: [Versandkosten und Lieferzeit ergänzen]“ wörtlich ✓.
- **Ergebnis-Box CTA** „in 10 Minuten · eigene · Serienbriefe“ = Sprechtext + Guide-Quick-Win „10 Minuten“ ✓; DM-Karte „Anleitung · Prompt · Word-Schritte“ = Guide S. 2/5–6 ✓.
- Hinweis: Frage-Karte „Versand der Shirts?“ steht schon ab 31,97 (gesprochen „Versand“ ≈ 34,5; beats.json B14 sah „auf Versand@34.5“ vor) – inhaltlich korrekt, nur 2,5 s vor dem Wort.

## Noten je Kriterium
| Kriterium | Note | Beleg / Abzug |
|---|---|---|
| Hook (0–6 s) | 8 | unverändert; Abgang 1,10 in einem Frame (R1-05 offen) |
| Serienrahmen Nicht-Erstfolge | 9 | unverändert |
| Ton: Stimme, Tempo, Aussprache | 9 | STT wortgleich, Stimme unverändert |
| Musik + Lautheit | 9 | −14,0 LUFS; neues SFX nur in der Pause 12,5–13,2, unauffällig |
| Untertitel | 8 | Augen überall frei, CTA ≈ 30 % auf dem Unterkörper (knapp); Positionssprünge an Kamera-Schnitten 12,5 / 24,1 / 40,1 |
| Text-Regeln / Lesbarkeit | 8 | alle Aussage-Karten jetzt ≈ 58–75 px; DM-Karte 45–48 px, „eigene · Serienbriefe“ ≈ 55 px, Puls-Leerzeichen 42,0–42,6 |
| Bildfluss / Maskottchen | 8 | K.-o. behoben, Doppelpanels 24/32 weg; Abzug: Heute-Übergang 12,43–12,97 (Karte gestapelt + 10 Frames Board-Reihen-Geist + Pill dahinter), 1–2-Frame-Reste 16,07 / 18,53 / 24,03 / 4,90, Hook-Abgang |
| Fakten / Board / Kette | 9 | neue Bilder = LAUF; Feld 6 weiter ohne Personen-Symbol |
| Anonymisierung | 9 | unverändert sauber |
| CTA + Guide + Funnel | 9 | Ergebnis-Box füllt die Mitte, Guide unverändert |
| Look vs. Folge 13 | 8 | Mini-Brief/Liste und CTA-Mitte gelöst; Rest: Logo „SHIRT“ verdeckt 21,5–31,9; Warum-Panel 24,0–26,4 untere Hälfte leer; Frage-Karte 32–36 sehr groß mit leerer Unterhälfte; Maskottchen im Rückblick/Heute stark überstrahlt (Gesicht fast weiß) |
| Cover / Caption | 9 | Cover „5 Briefe in 1 Minute, aber nur 4 Felder voll“, Maskottchen ganz, Schwärzung ok |

**Scroller-Test:** 1 s Frage + 5 Briefe mit gelben Lücken → bleibt knapp; 3 s „GANZ ALLEINE.“ → bleibt; 10 s Board + Shirt-Karte, ab 10,75 Mini-Brief/Liste → besser als R1; 12,5 Brief + Liste groß → bleibt.

## Vergleich mit Folge 14 R2 (8,5)
Ton, Fakten, Datenschutz, Guide gleichwertig; Lesbarkeit jetzt besser als F14 (Karten ≥ 3 %). Bildfluss etwas unter F14-R2: dort ein 5-Frame-Zucken, hier ein 0,5-s-Rest am Heute-Übergang plus mehrere 1–2-Frame-Reste und der offene Hook-Abgang.

## Gesamtnote
**8,0 / 10** (Schnitt der Kriterien ≈ 8,6, alle ≥ 8, kein K.-o.; wegen der vielen kleinen Übergangs-Reste auf 8,0 gesetzt, knapp unter F14-R2).

## Urteil
**Bestanden** (Runde 2, knapp). Video kann an Pius. Kein Neu-Render für diese Folge nötig; Restpunkte als Backlog.

## Tickets (nicht blockierend, Design-Backlog ab Folge 17)
```
TICKET final-R2-01 → firma-design   (Backlog, Engine)
Kriterium: Bildfluss · Note: 8/10
Beleg: 00:12,43–00:12,97 · pruefung/final-r2/t30-1240.jpg, t30-1280.jpg, full_12.5.png
Problem: Beim Wechsel Rückblick→Heute bleibt die SHIRTS-Karte 0,55 s unter dem neuen Panel stehen, dazwischen ≈ 10 Frames die angeschnittene untere Board-Reihe, danach schaut die HEUTE-Pill hinter der Karte hervor; Karte verschwindet dann in einem Frame.
Soll: Board + Produkt-Karte verlassen das Bild im selben Frame wie (oder ≥ 2 Frames vor) dem Einflug des Heute-Panels; im 30-fps-Streifen 12,3–13,1 kein Frame mit Board-Resten oder zwei Szenen; HEUTE-Pill frühestens 0,1 s vor „Heute“.
```
```
TICKET final-R2-02 → firma-design   (Backlog, Engine)
Kriterium: Bildfluss · Note: 8/10
Beleg: 00:01,07–00:01,10 (t30-hook.jpg) · 00:04,90–00:04,93 (t30-0490.jpg) · 00:16,067 (t30-1590.jpg) · 00:18,53–00:18,57 (t30-1845.jpg) · 00:24,03–00:24,10 (t30-2400.jpg)
Problem: Panel-Wechsel und Kamera-/Raum-Wechsel laufen 1–3 Frames versetzt (altes Panel über neuem Fenster, neue Karte mit alter Kamera); Hook-Abgang des Raums in einem Frame (R1-05 offen).
Soll: Panel-Tausch und Kamera-Schnitt auf demselben Frame (Engine: gemeinsamer Schnitt-Anker); Hook-Raum verlässt das Bild sichtbar (≥ 6 Frames) oder bewusster Schnitt mit SFX. Beleg: 30-fps-Streifen ±0,2 s an jedem Akt-Wechsel ohne Mischframe.
```
```
TICKET final-R2-03 → firma-design   (Backlog)
Kriterium: Look vs. Folge 13 · Note: 8/10
Beleg: 00:21,5–00:31,9 · full_23.0.png, full_30.0.png; 00:06,2–00:16,0 · full_8.0.png, full_14.0.png; 00:39,9–00:40,6 · t30-3970.jpg, t30-4010.jpg
Problem: Logo-Zeile „SHIRT“ von der Platzhalter-Markierung überdeckt (R1-06-Rest); Maskottchen im Rückblick/Heute so stark angestrahlt, dass das Gesicht fast weiß wirkt; Papierflieger landet 0,7 s auf der Maskottchen-Stirn.
Soll: Logo in jedem Frame vollständig lesbar; Maskottchen-Front in allen Akten im Orange-Ton wie CTA (keine ausgefressenen Flächen); Flieger endet an der DM-Karte, nicht auf dem Maskottchen.
```
```
TICKET final-R2-04 → firma-design   (Backlog, Engine – wie F14-R2-02)
Kriterium: Text-Regeln · Note: 8/10
Beleg: 00:39,3–00:44,1 · cta-42.5-oben.png
Problem: DM-Karte „Anleitung“ ≈ 48 px, „Prompt · Word-Schritte“ ≈ 45 px, Chip „gesendet“ ≈ 35 px; „eigene · Serienbriefe“ ≈ 55 px mit Puls-Leerzeichenfehler 42,0–42,6.
Soll: DM-Karte und Ergebnis-Unterzeile ≥ 58 px Versalhöhe; Puls skaliert den Block als Ganzes, Abstände bleiben konstant.
```
Hinweise: H1 Frage-Karte „Versand der Shirts?“ 2,5 s vor dem Wort (Regie-Abweichung von B14, inhaltlich ok); H2 Board-Feld 6 „GEWERBE · MENSCH“ ohne Personen-Symbol (seit F14 offen); H3 Caption-Schritt 2 als „sinngemäß“ kennzeichnen (R1-H1, unverändert); H4 CTA-Untertitel liegen mit ≈ 30 % knapp unter der 1/3-Grenze – ab F17 Band 30–50 px tiefer oder Maskottchen 5 % kleiner, damit Luft bleibt.
