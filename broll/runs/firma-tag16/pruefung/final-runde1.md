# Prüfung final · Folge 16 „Wie kommen die Adressen in den Brief?“ · Runde 1 (Slot 2026-10-31 18:00, Serientag 4, NICHT erste Folge des Tages)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-10-31. Nichts geändert.
Gemini/OpenRouter 402 → manuell Frame für Frame. ffmpeg nur `broll/node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge: `firma-tag16-final.mp4` (44,130 s, 1080×1920, 30 fps, AAC 48 kHz stereo), `firma-tag16-final-handy.mp4` (44,139 s), `cover.jpg`, `kontaktbogen-2fps.jpg`, `caption.txt`, `replies.json`, `serienbrief-guide.pdf` (8 Seiten, `guide-pages/p01–p08.png`), `format.json` (PTC).
Maßstab: Folge 13 (final 8,5), Tickets `runs/firma-tag14/pruefung/final-runde1.md` und `runs/firma-tag15/pruefung/final-runde1.md`.

## Belege (alle in `pruefung/final-r1/`)
- Hook: `hook-0-6s-4fps.jpg`, `hook-0.8-1.2-30fps.jpg`
- Rückblick/Heute/Claude: `rueckblick-6-13.jpg`, `heute-12-16.jpg`, `claude-15-23.jpg`, `maskottchen-12.2-18.8.jpg` (5 fps, Ausschnitt unten rechts)
- Warum/Als Nächstes/CTA: `warum-23-31.jpg`, `cta-35.5-44.jpg`
- Übergänge 30 fps: `ueb-23.7-30fps.jpg` (ent→why), `ueb-31.6-30fps.jpg`, `ueb-why-question-31.9-30fps.jpg` (why→question)
- Einzelbilder: `f/q_NNN.jpg` (4 fps), `full/t_<s>.jpg` (Vollauflösung: 0 / 8,0 / 14,0 / 17,0 / 22,7 / 30,5 / 34,8 / 37,5 / 42,5 u. a.)
- Lesbarkeit: `crop-steht-28.jpg`, `crop-4von14-22.7.jpg`, `crop-minute-20.5.jpg`
- Guide: `guide-seiten.jpg`
- Ton: `final-audio.mp3`, `stt-final-mix.json` (ElevenLabs Scribe der fertigen Mischung)

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge final / handy | 44,130 s / 44,139 s | 40–48 s ✓ |
| Wörter / Tempo | script.txt 99 = words.json 99; 99 / 44,13 s = **134,6 wpm** | 85–100, 120–135 ✓ (knapp an der Obergrenze) |
| Rückblick „Die“ 6,23 → „geprüft.“ 12,42 | **6,19 s**; Satz 2 „Ein Brief, fünf Adressen geprüft.“ = 8 Silben | ≤ 6,5 s, ≤ 11 Silben ✓ |
| „Heute“ | 13,47 s | ≤ 14,5 s ✓ |
| Engine-Warnung „Rückblick 9,9 s“ | misst ab Ende Eröffnungssatz 1 (≈ 3,99/4,33 „führt?“) bis „Heute“ 13,47 inkl. „Ich probier das aus.“ und Pausen. Nach Regel (Chef-Entscheid Folge 9: „Die“ bis Ende Satz 2 ≤ 6,5 s, „Heute“ ≤ 14,5 s) **kein Verstoß** | Hinweis, kein Ticket (wie F15-H4) |
| Pausen > 0,5 s | 13, 0,51–1,05 s, alle an Satzgrenzen; längste 12,42–13,47 (1,05 s, vor „Heute“), vor „Warum?“ 0,89 s | ✓ |
| STT fertige Mischung | wortgleich mit script.txt (nur „probiere/schicke“, „Claude,“ statt „Claude:“, Zahlen ausgeschrieben); kein Gesang erkannt („[Musik]“ am Ende); kein gesprochenes „Tag“ | ✓ |
| Lautheit final / handy | **−14,0 LUFS**, TP −1,1 dBFS, LRA 2,3 / −14,1 LUFS | −14 ±0,5 ✓ |
| Stimme vs. Musik (RMS) | Stimme −18,3 (16,9–18,9) / −16,9 (28–30) / −16,9 dB (40–42); Pausen 4,4–4,9 −43,6 · 12,55–13,4 −35,7 · 20,78–21,48 −33,9 · 23,4–24,15 −42,1 · 35,55–36,25 −34,0 dB → **≈ 16–26 dB**; regie/gap-final.txt je Akt 20,5–24,5 dB | ≥ 15 dB ✓ |
| Musik am Stück | musik.txt: GONE ab 53,3 s, 44,13 s, kein Loop, nicht F13/F14/F15-Abschnitt, Explizit-Check 0 (3 Läufe). Gesang im Abschnitt („My love's gone …“) liegt ≥ 20 dB unter der Stimme, STT der Mischung erkennt ihn nicht | ✓ |
| Untertitel-Sync | „Heute“ Bild 13,5 / words 13,47; „Warum“ Bild 24,23 / words 24,21 | ≤ 0,1 s ✓ |
| Handy-Fassung | SSIM zum Master 0,989 (5 fps) | ✓ |
| Leere/eingefrorene Frames | blackdetect 0, freezedetect (≥ 0,6 s) 0 | ✓ |
| Caption | 1962 Zeichen; Ende „(Fiktives Experiment, keine echten Umsätze.)“ + nur 6 Hashtags; keine Emojis/Zeichen > U+2100; Menüpfad „neuer Chat … über „+“ … anhängen“, Schritt 3 „Suchen und Ersetzen in Word“; kein „Tag“ | ≤ 2100 ✓ |
| replies.json | 1 + 5 Antworten, alle enden mit „?“, keine Emojis, alle Bezug Serienbrief/Liste/Felder | ✓ |

## K.-o.-Liste
| K.-o. | verletzt? | Beleg |
|---|---|---|
| Frame 0: ganze Frage + Ergebnis-Objekt | nein | `full/t_0.jpg`: „Wie viel Umsatz macht eine KI in 100 Tagen?“ + 5 Briefseiten aufgefächert, Empfänger grün geschwärzt, gelbe Platzhalter sichtbar |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | nein (knapp) | 0,4 Maskottchen steigt auf · 1,10 Raum-Wechsel · 1,25–2,5 Schwärzungen wandern über die Briefe · 2,75–3,25 leichter Push-in (schwächstes Fenster) · 3,66 „GANZ ALLEINE.“ · 4,0 Stempel kippt · 4,93 Gründungsplan + Maskottchen · 5,5 Plan leuchtet |
| Hook-Objekt nie über dem Gründungsplan | nein | 4,93 harter Schnitt Briefe → Plan |
| Nicht-Erstfolge: kein gesprochenes „Tag“, kein TAG-Slam | nein | words/STT ohne „Tag“, kein Slam; nur HUD-Badge „TAG 4“ wie F13–F15, Cover dito |
| Kein Umsatz-Zähler | nein | ganze Länge; Feld 9 ERSTER UMSATZ offen |
| ≤ 1 neuer Textblock, Karten ≤ 4 Wörter | nein | GANZ ALLEINE. · SHIRTS MIT LOGO · „erst auf Bestellung bestickt“ · HEUTE: ADRESSEN → BRIEF · ≈ 1 MINUTE · 4 VON 14 GEFÜLLT · WARUM? · STEHT IN DER LISTE (+ „Erfinden ×“) · FEHLT IN BEIDEN DATEIEN (+ „Brief × · Liste ×“) · ALS NÄCHSTES / Versand der Shirts? · KOMMENTIERE / SERIENBRIEF · DM-Karte · „in 10 Minuten / eigene · Serienbriefe“. Abstände ≥ 1,2 s. Lauf-Zitat „Versand: [Versandkosten und Lieferzeit ergänzen]“ (34–35,5 s) = Bild-Objekt (Lauf-Wortlaut, textregel beats.json). Lesbarkeit s. Note 6 |
| **Maskottchen ganz im Bild oder höchstens 1/3 verdeckt** | **JA** | **(a) ≈ 13,4–18,5 s (≈ 5 s, dritte Folge in Folge!):** Heute-Panel (13,4–15,8) liegt über Kopf/Oberseite, rechte Hälfte außerhalb des Bildes, sichtbar nur linke untere Ecke + Augen am Panelrand (≈ 60–70 % verdeckt, `full/t_14.0.jpg`); Claude-Fenster (15,9–18,5) deckt das Maskottchen fast ganz ab, sichtbar nur Unterkante + Lichtkegel (≈ 85–90 %, `full/t_17.0.jpg`, `maskottchen-12.2-18.8.jpg`). Exakt F15 final-R1-02 nicht behoben. **(b) 36,3–39,8 s:** zweizeilige Untertitel „Kommentiere / Serienbrief“, „ich schick dir / die Anleitung“ liegen über beiden Augen und ≈ 50 % der Vorderseite (`full/t_37.5.jpg`, `cta-35.5-44.jpg`); 40,5–43,1 s Untertitel zwischen/über den Augen. Ok: Rückblick 6–12,4 (rechts angeschnitten ≤ 1/3, `full/t_8.0.jpg`), Ergebnis/Warum/Als Nächstes 18,6–35,5 ganz sichtbar |
| Fakten 1:1 aus dem Lauf, keine Zahl gegen Bibel | nein | s. Note Fakten |
| Briefe nie versandfertig/verschickt/rechtlich geprüft | nein | Video: nur „fünf Briefe“, „füllt nur vier Felder“, „Absender, Datum, Versandkosten fehlen“, gelbe Platzhalter in jedem Briefbild; Caption „Versandfertig sind die Briefe noch nicht … ob der Brieftext rechtlich reicht … kann Claude nicht prüfen“; Guide S. 7 „Die Briefe sind danach nicht versandfertig“, „Claude prüft nicht, ob dein Text rechtlich reicht“ |
| Alle fünf drin, nur vier Felder | nein | Hook + 20,0–21,5 s 5 Briefseiten; Karte „4 VON 14 GEFÜLLT“ = LAUF „je Brief 4 von 14 Platzhaltern“; Guide-Tabelle S. 7 „Ja mit Vorbehalt: Brief trotzdem gebaut“; Caption „5 Briefen … Bei einem Brief soll die Postleitzahl vor dem Druck noch geprüft werden“ |
| Datenschutz Video/Caption/Guide | nein | Empfängerblock + Website im Datenschutzsatz in jedem Briefbild schwarz/grün balkiert, Liste nur Balken + JA/VORBEHALT; Claude-Fenster ohne Sidebar/Chatliste, nur Anhang-Karten (Dateinamen „Kolonnenshirt_…“, kein Personenbezug) + Datei-Karte. Token-Scan (5 Firmen-/Inhabernamen, Straßen, 5 PLZ, Orte außer Chemnitz, Pius/Niklas/boilr/Hamburg) über caption, replies, guidebook.json/html: **0 Treffer**. Guide-Bilder `brief-seite-geschwaerzt.png`, `05-nicht-pruefen-anonym.png`: Namen/Orte geschwärzt, nur „Chemnitzer Betriebsstätte“ (Testregion, erlaubt) |
| Versand-Beat zeigt Shirt-Paket, keine Briefmarke | nein | 27,6–31,8 s Paket mit Shirt auf dem Versandkosten-Platzhalter; 32,3–35,5 s Lauf-Zeile + Pfeil → Shirt-Paket + Preisschild „? €“ (`full/t_34.8.jpg`). Keine Briefmarke |
| Caption ≤ 2100 / Ende / Emojis | nein | s. Messwerte |
| Zuschauer außerhalb CTA nicht angesprochen | nein | script.txt Z. 1–9 ohne du/Imperativ |
| Guide liefert CTA „Serienbrief“ | nein | S. 2 Variante A (= Lauf-Prompt, erster Satz verallgemeinert, „Betriebe“→„Firma“) + Quick Win 10 Minuten + Klickpfad; S. 3 echter Brief geschwärzt; S. 4 Variante B „Nicht getestet“; S. 5 Regel 4 von 14 + Claude wörtlich; S. 5–6 Suchen und Ersetzen; S. 6 Versand-Spalte; S. 7 Nicht geprüft; S. 8 Ausblick „Was kostet der Versand der Shirts?“; „Folg @pickthecompany“ 1× |

**Verletzt: Maskottchen-K.-o., Fenster (a) 13,4–18,5 s eindeutig (Wiederholung F14/F15), Fenster (b) CTA-Untertitel über den Augen.**

## Noten je Kriterium
| Kriterium | Note | Beleg |
|---|---|---|
| Hook (0–6 s) | 8 | Ergebnisbild ab Frame 0 (5 Briefe, gelbe Lücken), „GANZ ALLEINE.“ 3,66. Abzug: Raum + Maskottchen verschwinden bei 1,10 s in einem Frame (`hook-0.8-1.2-30fps.jpg`, F15-Ticket 05 nicht umgesetzt); 2,75–3,6 s nur leichter Push-in; weniger Spannung als F15 (keine sichtbare „gelb vs. grün“-Frage, die Lücken sind klein) |
| Serienrahmen Nicht-Erstfolge | 9 | Eröffnung ohne Tag, kein Slam, HUD-Badge, Rückblick 6,19 s, „Heute“ 13,47, Übergabe F15 „Wie kommen die Adressen in den Brief?“ beantwortet, neue Übergabe „Was kostet der Versand der Shirts?“ = LAUF-Vorschlag |
| Ton: Stimme, Tempo, Aussprache | 9 | 134,6 wpm, STT wortgleich, „Versandkosten“, „Serienbrief“ sauber betont |
| Musik + Lautheit | 9 | −14,0 LUFS / TP −1,1; 16–26 dB Abstand; Abschnitt am Stück, Mulde + Akzent auf „Warum?“ |
| Untertitel | 8 | Wortfolge = Skript, Sync ≤ 1 Frame. Abzug: liegen 0,9–1,07 s, 36,3–39,8 s, 40,5–43,1 s über Maskottchen-Gesicht/Augen |
| Text-Regeln / Lesbarkeit | 6 | ≤ 4 Wörter und ein Block gleichzeitig eingehalten. Aber < 3 % Bildhöhe (Soll ≥ 58 px): „4 VON 14 GEFÜLLT“ ≈ 45 px = 2,3 %; „STEHT IN DER LISTE“, „FEHLT IN BEIDEN DATEIEN“, „SHIRTS MIT LOGO“ ≈ 40 px = 2,1 %; Unterzeilen „Erfinden ×“, „Brief × · Liste ×“ ≈ 35 px = 1,8 %; „erst auf Bestellung bestickt“ ≈ 20 px = 1,0 %; „ALS NÄCHSTES“ ≈ 30 px; CTA „in 10 Minuten“ ≈ 45 px, „eigene · Serienbriefe“ ≈ 35 px (dazu Leerzeichenfehler „eigene ·Serienbriefe“, `full/t_42.5.jpg`); DM-Unterzeile „Prompt · Word-Schritte“ ≈ 28 px (Engine-fix, bekannt). Gut lesbar nur HEUTE-Pill, WARUM?, „Versand der Shirts?“, KOMMENTIERE/SERIENBRIEF. F15-Ticket 04 damit erneut nicht umgesetzt |
| **Bildfluss / Maskottchen** | **4** | K.-o.-Fenster (a) ≈ 5 s und (b) CTA. Übergänge: ent→why 24,03/24,07 s 2 Frames Doppelpanel (Design-Meldung bestätigt, `ueb-23.7-30fps.jpg`); why→question schlechter als gemeldet: 31,97 s Kamera-/Bildsprung (Maskottchen + Untertitel springen, Panel bleibt), dann 32,07–32,23 s **6 Frames** Doppelpanel (weiße Frage-Karte wächst hinter dem alten Panel, ab 32,17 neues Lauf-Zitat-Panel über dem alten, `ueb-why-question-31.9-30fps.jpg`, auch im Kontaktbogen 32,0 sichtbar); Hook-Sprung 1,10 s. Sonst flüssig: Anhang-Karten nacheinander, Uhr → Briefe fächern, Warum-Platzhalter leuchten nacheinander auf |
| Fakten / Board / Kette | 9 | Gesprochenes, Karten, Cover, Caption, Guide = LAUF (≈ 1 Minute, 5 Briefe, 4 von 14 gefüllt, Absender/Datum/Versandkosten fehlen, Vorbehalt-Brief drin, Prüfdatum nicht als Briefdatum, 0 Websuchen). Board Feld 8 „BRIEF + ADRESSEN ?“ vollständig lesbar (F15-Ticket 03 erledigt), im CTA weiter „?“ = korrekt (nicht versandfertig). Rest: Feld 6 „GEWERBE · MENSCH“ weiter ohne Personen-Symbol; Logo „KOLONNEN SHIRT“ im Warum-Akt 22–31,8 s von der Platzhalter-Markierung angeschnitten („SHIRT“ verdeckt, `full/t_22.7.jpg`) |
| Anonymisierung | 9 | Video/Caption/Guide 0 Treffer, Briefbilder sauber geschwärzt, Guide-Bilder ohne Gewerk+Datum-Kombination (F15-Ticket 06 sinngemäß übernommen) |
| CTA + Guide + Funnel | 9 | CTA nennt Lieferung (Anleitung) + Ergebnis (10 Minuten, eigene Serienbriefe); Guide liefert genau das, ehrliche Grenzen, Variante B als ungetestet markiert; DM-Karte „Serienbrief-Anleitung · Prompt · Word-Schritte“ passt; replies passend |
| Look vs. Folge 13 | 7 | gleiche Bildsprache, Briefbilder aus der echten docx stark. Abzug: Rückblick 10,7–12,4 s zeigt zu „Ein Brief, fünf Adressen geprüft“ kein Bild (Board + Shirt-Karte stehen seit 9,3 s); Shirt-Karte 7,2–12,4 halb leer; CTA 39,3–44,1 s mittleres Drittel leer (Board ausgeblendet, nur Rahmen-Reste); Claude-Fenster 15,9–18,5 schneidet die XLSX-Karte rechts ab |
| Cover / Caption | 9 | Cover „5 Briefe in 1 Minute, aber nur 4 Felder voll“ + Briefe + Maskottchen ganz, Schwärzung ok. Caption ehrlich, Menüpfad, Fiktiv-Hinweis, 1962 Zeichen. Kleinigkeit wie F15-H3: Prompt in Schritt 2 ist gekürzt („Im Anhang sind meine letzten zwei Ergebnisse …“ und „zum Beispiel Absender oder Versandkosten“ fehlen), steht aber in Anführungszeichen |

**Scroller-Test:** 1 s: Frage + 5 Briefe mit gelben Lücken → verständlich, aber kein Reibungspunkt → bleibt knapp. 3 s: Schwärzungen wandern, „GANZ ALLEINE.“ bei 3,7 → bleibt. 10 s: Rückblick-Board + halbleere Shirt-Karte, schwächster Moment, bis 12,4 kein neues Bild → Abbruchrisiko; ab 12,5 Brief + Liste → bleibt.

## Vergleich mit Folge 13 (8,5), Folge 14 (R1 7,5), Folge 15 (R1 7,0)
- Ton, Musik, Lautheit, STT, Caption, replies, Guide, Datenschutz: ≥ F13.
- Klarheit ohne Ton: gut (Anhänge → 1 Minute → 5 Briefe → 4 VON 14 → STEHT IN DER LISTE → FEHLT IN BEIDEN DATEIEN → Versand der Shirts?).
- Look: unter F13. Derselbe Maskottchen-Fehler wie F14 und F15 (Panel/Fenster über dem Maskottchen, diesmal Heute-Akt + Claude-Weg), F15-Tickets 02 (Maskottchen Heute-Akt), 04 (Schriftgröße) und 05 (Hook-Sprung) nicht übernommen; 03 (Board-Feld 8) und 06 (Guide-Anonymisierung) übernommen.

## Gesamtnote
**6,5 / 10** (Schnitt der Kriterien ≈ 8,1, aber K.-o. Maskottchen verletzt, Bildfluss 4, Lesbarkeit 6, Look 7 < 8).

## Urteil
**Nicht bestanden** (Runde 1). Hörbares (Stimme, Mix, Lautheit, STT), Fakten, Caption, replies, Cover und Guide sind abnahmefähig und müssen nicht neu gebaut werden. Nötig ist ein Design-Neu-Render der Bildspur (Ton, Untertitel-Timing, Länge 44,13 s unverändert), danach Handy-Fassung + Kontaktbogen neu.

## Tickets
```
TICKET final-R1-01 → firma-design   (PFLICHT, K.-o.)
Kriterium: Bildfluss / Maskottchen · Note: 4/10
Beleg: 00:13,4–00:18,5 · pruefung/final-r1/full/t_14.0.jpg, full/t_17.0.jpg, maskottchen-12.2-18.8.jpg
Problem: Heute-Panel (13,4–15,8) und Claude-Fenster (15,9–18,5) liegen über dem Maskottchen; sichtbar nur Unterkante/Ecke (≈ 60–90 % verdeckt) – dritter gleicher Fehler nach F14-R1-01 und F15-R1-02.
Soll: In jedem Frame 12,4–18,6 s ist das Maskottchen entweder ≥ 2/3 sichtbar mit freien Augen (Panel-/Fensterunterkante über dem Maskottchenkopf wie im Warum-Akt 24–31 s, Maskottchen nicht über den rechten Bildrand hinaus) oder vorher sichtbar aus dem Bild gehüpft und nicht da. Engine-Regel ergänzen: Overlay-Rect ∩ Maskottchen-Rect ≤ 1/3 → sonst Render-Fehler. Beleg: 10-fps-Bogen 12,3–18,8 s.
```
```
TICKET final-R1-02 → firma-design   (PFLICHT, K.-o.)
Kriterium: Bildfluss / Maskottchen + Untertitel · Note: 4/10
Beleg: 00:36,3–00:39,8 und 00:40,5–00:43,1 · full/t_37.5.jpg, full/t_42.5.jpg, cta-35.5-44.jpg; 00:00,9–00:01,07 · hook-0.8-1.2-30fps.jpg
Problem: Zweizeilige Untertitel liegen im CTA über beiden Augen und rund der Hälfte der Maskottchen-Vorderseite.
Soll: Untertitel-Pills enden in jedem Frame oberhalb der Maskottchen-Augen (z. B. Untertitel-Band im CTA auf y ≈ 1150–1300, die dort leere Bildmitte 39,3–44 s nutzen) oder Maskottchen tiefer/kleiner; Augen nie verdeckt, Verdeckung ≤ 1/3.
```
```
TICKET final-R1-03 → firma-design   (PFLICHT, Lesbarkeit)
Kriterium: Text-Regeln / Lesbarkeit · Note: 6/10
Beleg: 00:07,2–00:12,4 (rueckblick-6-13.jpg, full/t_8.0.jpg) · 00:22,6 (full/t_22.7.jpg) · 00:26,5–00:31,8 (crop-steht-28.jpg, full/t_30.5.jpg) · 00:32,1 · 00:40,5–00:44 (full/t_42.5.jpg)
Problem: Fast alle Karten unter 3 % Bildhöhe: Hauptzeilen 40–45 px (2,1–2,3 %), Unterzeilen 20–35 px (1,0–1,8 %); „eigene ·Serienbriefe“ mit Leerzeichenfehler. F15-R1-04 nicht umgesetzt.
Soll: Jeder aussagende Text ≥ 58 px Versalhöhe (≥ 3 % von 1920): „4 VON 14 GEFÜLLT“, „STEHT IN DER LISTE“, „FEHLT IN BEIDEN DATEIEN“ (ggf. zweizeilig), „SHIRTS MIT LOGO“, „ALS NÄCHSTES“, „in 10 Minuten“; Unterzeilen („Erfinden ×“, „Brief × · Liste ×“, „erst auf Bestellung bestickt“, „eigene · Serienbriefe“) ≥ 58 px oder weglassen (Sprechtext trägt sie). Weiterhin ≤ 4 Wörter je Block, ein neuer Block gleichzeitig. Messung im Bericht pro Karte in px.
```
```
TICKET final-R1-04 → firma-design   (PFLICHT, Übergänge)
Kriterium: Bildfluss / Übergänge · Note: 4/10
Beleg: 00:24,03–00:24,07 · ueb-23.7-30fps.jpg; 00:31,97 und 00:32,07–00:32,23 · ueb-why-question-31.9-30fps.jpg, kontaktbogen-2fps.jpg (00:32,0)
Problem: ent→why 2 Frames Doppelpanel; why→question erst ein Bildsprung (Maskottchen + Untertitel springen, Panel bleibt), dann 6 Frames, in denen Frage-Karte und Lauf-Zitat-Panel über/hinter dem alten Warum-Panel liegen – mehr als die gemeldeten 2 Frames.
Soll: An beiden Übergängen in keinem 30-fps-Frame zwei Panels gleichzeitig: altes Panel ist raus (oder ≤ 1 Frame Kreuzblende), bevor das neue einfährt; kein Kamera-Sprung ohne harten Schnitt. Beleg: 30-fps-Streifen 23,9–24,3 und 31,8–32,4 s.
```
```
TICKET final-R1-05 → firma-design   (empfohlen, im selben Render)
Kriterium: Hook · Note: 8/10
Beleg: 00:01,07–00:01,10 · hook-0.8-1.2-30fps.jpg
Problem: Raum und Maskottchen verschwinden in einem Frame, die Briefe bleiben stehen (F15-R1-05 offen).
Soll: Maskottchen verlässt das Bild sichtbar (≥ 6 Frames) und Hintergrund bleibt bis 4,93 s gleich, oder bewusster harter Schnitt mit Kamerabewegung + SFX.
```
```
TICKET final-R1-06 → firma-design   (empfohlen, im selben Render)
Kriterium: Look vs. Folge 13 · Note: 7/10
Beleg: 00:10,7–00:12,4 (rueckblick-6-13.jpg); 00:39,3–00:44,1 (cta-35.5-44.jpg); 00:22–00:31,8 (full/t_22.7.jpg, t_30.5.jpg); 00:15,9–00:18,5 (full/t_17.0.jpg)
Problem: Zu „Ein Brief, fünf Adressen geprüft.“ kein Bild; CTA-Mitte 5 s leer; Platzhalter-Markierung verdeckt die zweite Logo-Zeile „SHIRT“; XLSX-Anhang-Karte rechts abgeschnitten.
Soll: Bei „Ein@10.7“ Mini-Brief + Mini-Liste (4 JA / 1 VORBEHALT) auf/neben die Shirt-Karte; CTA-Mitte mit Untertiteln (Ticket 02) oder Mini-Brief füllen; Logo im Warum-Akt frei; beide Anhang-Karten ganz im Fenster.
```
Hinweise (nicht blockierend): H1 Caption-Schritt 2 als „sinngemäß“ kennzeichnen oder vollen Lauf-Prompt nehmen (wie F15-H3); H2 Engine-Prüfung „Rückblick“ auf „Die“ → Ende Satz 2 umstellen (misst 9,9 s statt 6,19 s, wie F15-H4); H3 Feld 6 „GEWERBE · MENSCH“ mit Personen-Symbol (F14-R1-02 Rest); H4 Tempo 134,6 wpm liegt an der Obergrenze – keine weiteren Wörter.
