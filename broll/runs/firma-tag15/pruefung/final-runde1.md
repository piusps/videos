# Prüfung final · Folge 15 „Welche Adresse stimmt?“ · Runde 1 (Slot 2026-10-31 15:00, Serientag 4, NICHT erste Folge des Tages)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-10-31. Nichts geändert.
Gemini/OpenRouter liefert 402 → manuell Frame für Frame. ffmpeg nur `broll/node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge: `firma-tag15-final.mp4` (45,000 s, 1080×1920, 30 fps, AAC 48 kHz stereo), `firma-tag15-final-handy.mp4` (45,014 s), `cover.jpg`, `kontaktbogen-2fps.jpg`, `caption.txt`, `replies.json`, `versand-guide.pdf` (7 Seiten, `guide-pages/p01–p07.png`), `format.json` (PTC).
Maßstab: Folge 13 (final 8,5) und Tickets `runs/firma-tag14/pruefung/final-runde1.md`.

## Belege (alle in `pruefung/final-r1/`)
- `hook-0-6s-4fps.jpg`, `hook-0.8-1.4-30fps.jpg`, `maskottchen-hook-0.5-1.25.jpg`
- `rest-2fps-01.jpg` (6–25,5 s), `rest-2fps-02.jpg` (26–44,5 s), Einzelbilder `f/q_NNN.jpg` (4 fps), `full/t_<s>.jpg` (Vollauflösung)
- Maskottchen: `maskottchen-12.5-15.jpg`, `maskottchen-12.3-12.8-30fps.jpg`, `maskottchen-30-34.4.jpg`, `maskottchen-30.5-31.0-30fps.jpg`, `maskottchen-sonst.jpg` (6 / 9 / 21 / 23 / 25 / 38 / 42 / 44,9 s)
- Board: `board-feld8-8s-11s.jpg`, `board-cta-39.5.jpg`, `board-8-11s.jpg`
- Text: `warum-29.6.jpg`, `warum-karten-30s.jpg`, `ergebnis-33s.jpg`, `cta-43.5.jpg`
- Übergänge: `uebergaenge-30fps.jpg` (alle 9 Szenenwechsel, je 6 Frames)
- Sync: `sync-heute-12.9-13.2.jpg`, `sync-warum-23.1-23.4.jpg`
- Cover: `cover-pill.jpg`, `cover-f13-f12-f14-f15.jpg`; Guide: `guide-seiten.jpg`
- Ton: `final-audio.mp3`, `stt-final-mix.json` (ElevenLabs Scribe der fertigen Mischung)

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge final / handy | 45,000 s / 45,014 s | 40–48 s ✓ |
| Wörter / Tempo | script.txt 100 = words.json 100; 100 / 45,0 s = **133 wpm** | 85–100, 120–135 ✓ |
| Rückblick „Die“ 6,25 → „sicher.“ 12,22 | **5,97 s**; Satz 2 „Fünf Briefe, einer sicher.“ = 7 Silben | ≤ 6,5 s, ≤ 11 Silben ✓ |
| „Heute“ | 13,03 s | ≤ 14,5 s ✓ |
| Engine-Warnung „recap 9,04 s“ | = 3,99 („führt?“) → 13,03 („Heute“), misst also Eröffnungssatz 2 „Ich probier das aus.“ + Pause + Rückblick mit. Nach Regel (Chef-Entscheid Folge 9: „Die“ bis Ende Satz 2 ≤ 6,5 s, „Heute“ ≤ 14,5 s) **kein Verstoß**; F14 lag mit „Heute“ 13,14 s gleich | Hinweis, kein Ticket |
| Pausen > 0,5 s | 12, 0,56–0,89 s, alle an Satzgrenzen; vor „Warum?“ 0,89 s | ✓ |
| STT fertige Mischung | wortgleich mit script.txt (nur „probiere/schicke“, „Claude,“ statt „Claude:“, Zahlen ausgeschrieben, „Web-Suche“); kein Gesang erkannt, nur „[Outro-Jingle]“; kein gesprochenes „Tag“ | ✓ |
| Lautheit final / handy | **−14,0 LUFS**, TP −1,3 dBFS, LRA 2,7 / −14,1 LUFS | −14 ±0,5 ✓ |
| Stimme vs. Musik (RMS) | Stimme −18,0 (16–19 s) / −16,8 (25–28 s) / −16,8 dB (40–43 s); Pausen 4,4–4,9 −38,9 · 12,3–12,95 −34,4 · 14,45–14,95 −41,6 · 22,4–23,15 −46,4 · 37,2–37,8 −34,1 dB (34,05–34,6 −28,7 = Übergangs-SFX) → **≈ 16–28 dB** | ≥ 15 dB ✓ |
| Musik am Stück | musik.txt: GONE ab 303,5 s, 45 s, kein Loop, kein Abschnitt von F13/F14, Explizit-Check 0 | ✓ |
| Untertitel-Sync | „Heute“ Bild 13,033 / words 13,03; „Warum“ Bild 23,233 / words 23,23 | ≤ 0,1 s ✓ |
| Handy-Fassung | SSIM zum Master 0,995 (5 fps) | ✓ |
| Leere Frames / Doppelbilder | blackdetect: 0; 9 harte Schnitte (3,67 / 4,93 / 6,2 / 15,23 / 16,77 / 18,03 / 23,03 / 30,8 / 34,67 / 37,73) ohne Doppelbild | ✓ (Sprung 1,1 s s. u.) |
| Caption | 2047 Zeichen (2087 Byte); Ende „(Fiktives Experiment, keine echten Umsätze.)“ + nur 6 Hashtags; keine Emojis/Zeichen > U+2100; Menüpfad „neuer Chat … über „+“ … anhängen“; kein „Tag“ | ≤ 2100 ✓ |
| replies.json | 1 + 5 Antworten, alle enden mit „?“, keine Emojis, Bezug Prüffrage/Versand-Regeln/Impressum vs. Register | ✓ |

## K.-o.-Liste
| K.-o. | verletzt? | Beleg |
|---|---|---|
| Frame 0: ganze Frage + Ergebnis-Objekt | nein | `f/q_001.jpg`: „Wie viel Umsatz macht eine KI in 100 Tagen?“ + Excel-Liste mit Versand-Spalte 4× JA, 1× VORBEHALT + 5 Brief-Miniaturen |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | nein | 0,4 Maskottchen steigt auf · 0,75 Rahmen Versand-Spalte/Chip 1 · 1,1 Raum-Wechsel · 1,25 Chip 3 · 1,75 Chip 4/5 · 2,25 VORBEHALT-Ring · 2,75 Rahmen · 3,25 Glanz · 3,67 „GANZ ALLEINE.“ · 4,25 Stempel kippt · 4,93 Gründungsplan + Maskottchen · 5,5 Plan leuchtet |
| Hook-Objekt nie über dem Gründungsplan | nein | 4,9 harter Schnitt Liste → Plan |
| Nicht-Erstfolge: kein gesprochenes „Tag“, kein TAG-Slam | nein | words/STT ohne „Tag“, kein Slam; nur HUD-Badge „TAG 4“ und Cover-Badge wie F13/F14 |
| Kein Umsatz-Zähler | nein | ganze Länge; Feld 9 ERSTER UMSATZ offen |
| ≤ 1 neuer Textblock, Karten ≤ 4 Wörter | nein | HEUTE: ADRESSEN PRÜFEN (3), IMPRESSUM/REGISTER, GEGLAUBT., WARUM?, VON 2014, NORTH DATA, 2015, PLZ PRÜFEN., „Adressen in den Brief?“ (4), KOMMENTIERE/VERSAND, „in 10 Minuten“. Abstände ≥ 1,2 s. Lesbarkeit s. Text-Regeln (Note 7) |
| **Maskottchen ganz im Bild oder höchstens 1/3 verdeckt** | **JA (2×)** | **(a) 30,8–34,6 s (≈ 3,8 s):** Excel-Liste des Ergebnis-Akts liegt über dem Maskottchen, sichtbar nur ein Streifen der Unterkante + Lichtkegel (≈ 85 % verdeckt) – exakt der K.-o. aus Folge 14 (`maskottchen-30-34.4.jpg`, `maskottchen-30.5-31.0-30fps.jpg`: ab Frame 30,80 weg). **(b) ≈ 12,9–15,2 s (≈ 2,3 s):** HEUTE-Panel (Briefe + Lupe) reicht bis über Kopf und Augen, sichtbar nur rechte untere Ecke + Arm, dazu Untertitel davor (≈ 60–70 % verdeckt, `maskottchen-12.5-15.jpg` Bilder 13,0/13,5/14,0/14,5/14,9). Im Warum 23–30,8 s nur Oberkante ≈ 20–25 % unter dem Panel: ok |
| Fakten 1:1 aus dem Lauf, keine Zahl gegen Bibel | **JA (Bild)** | Gesprochen/Karten korrekt (s. Note Fakten). Aber **CTA 37,6–40,3 s zeigt das Board mit Feld 8 „1 VON 5 SICHER“** (`board-cta-39.5.jpg`) – Stand vor dieser Folge; das Ergebnis der Folge (4 raus, 1 nach PLZ-Check) steht 4 s vorher im Bild. Widerspricht dem eigenen Ergebnis |
| Klärung nur über North Data sichtbar, nichts „amtlich“ | nein | gesprochen „Laut Firmendatenbank …“; Karte „GELESEN BEI · NORTH DATA“ ab 27,0 s bis 30,8 s; kein „amtlich“, kein Handelsregister-Logo im Video; Caption „gelesen bei einem Datendienst“ + „Der Haken: Das amtliche Handelsregister konnte Claude nicht selbst bedienen“; Guide S. 5 Warnkasten „Das amtliche Register hat Claude nicht bedient“, S. 6 „„Ja“ heißt belegt, nicht amtlich geprüft“ |
| Datenschutz Video/Caption | nein | Liste nur Balken + Nr./Versand; Brief-Miniaturen nur Platzhalter; Claude-Fenster ohne Sidebar/Chatliste, nur Anhang-Karte, Schritte-Zeile, Datei-Karte; Warum-Hintergrund (Shot 05) unscharf. Token-Scan (5 Firmennamen, Inhaber, Straßen, PLZ, Flöha, HRA/7974, Hamburg, Pius/Niklas/boilr, Mailmuster) über caption, replies, prompt-fuer-kommentare, episode.json, Guide-Text: **0 Treffer** |
| Caption ≤ 2100 / Ende / Emojis | nein | s. Messwerte |
| Zuschauer außerhalb CTA nicht angesprochen | nein | script.txt Z. 1–10 ohne du/Imperativ |
| Guide liefert CTA „Versand“ (Prüffrage) | nein | S. 2 Variante A (= Lauf-Prompt, nur erster Satz verallgemeinert, endet „Erfinde nichts. Gib mir die aktualisierte Excel-Datei zurück.“), S. 3 Variante B „Nicht getestet“, S. 4 Versand-Regeln + 3 neue Spalten, S. 5 Widerspruchs-Regel, S. 6 Nicht geprüft + Datenschutz, S. 7 Ausblick; „Folg @pickthecompany“ 1× |

**Verletzt: Maskottchen (2 Fenster, Wiederholung des F14-K.-o.) und ein Bild-Fakt (CTA-Board „1 VON 5 SICHER“).**

## Noten je Kriterium
| Kriterium | Note | Beleg |
|---|---|---|
| Hook (0–6 s) | 9 | Ergebnisbild ab Frame 0 (4 grün, 1 gelb → „warum gelb?“), dichte Ereignisse. Abzug-Hinweis: bei 1,1 s verschwinden Raum (Stuhl, Hebel) und Maskottchen in einem Frame, Liste bleibt stehen (`hook-0.8-1.4-30fps.jpg`) – wirkt wie ein Ebenen-Glitch |
| Serienrahmen Nicht-Erstfolge | 9 | Eröffnung ohne Tag, kein Slam, HUD-Badge, Rückblick 5,97 s, „Heute“ 13,03 s, Übergabe F14 „Welche Adresse stimmt?“ beantwortet, neue Übergabe „Wie kommen die Adressen in den Brief?“ aus dem Lauf |
| Ton: Stimme, Tempo, Aussprache | 9 | 133 wpm, STT wortgleich, „Firmendatenbank“, „Postleitzahl-Check“, „Register-Abschrift“ sauber |
| Musik + Lautheit | 9 | −14,0 LUFS / TP −1,3; 16–28 dB Abstand; Musik am Stück, Mulde + Akzent auf „Warum?“ hörbar |
| Untertitel | 9 | Wortfolge = Skript, Sync ≤ 1 Frame |
| Text-Regeln / Lesbarkeit | 7 | ≤ 4 Wörter und ein Block gleichzeitig eingehalten. Aber < 3 % Bildhöhe (Soll ≥ 58 px): Warum-Karten Hauptzeilen „VON 2014“ / „NORTH DATA“ / „2015“ ≈ 38 px = 2,0 %, Kicker „REGISTER-ABSCHRIFT“ / „GELESEN BEI“ / „EINTRAG“ ≈ 22 px = 1,1 %, Unterzeilen „Ersteintragung“ / „wie Impressum“ ≈ 1,1 % (`warum-karten-30s.jpg`); DM-Unterzeile „„… Erfinde nichts.“ · Excel“ ≈ 25 px = 1,3 % (`cta-43.5.jpg`, F14-Ticket 04 Schriftgröße nicht umgesetzt); Board-Feld 8 Titel „WERBEBRIEF + AD…“ läuft ins „?“ und über den Feldrand (11–12,5 s und 37,6–40,3 s, F14-Ticket 02 nicht umgesetzt) |
| **Bildfluss / Maskottchen** | **5** | 2 K.-o.-Fenster (oben), dazu Sprung 1,1 s. Sonst flüssig: Claude-Shots 15,2–18 s, Karten-Duell mit ≠ und GEGLAUBT.-Stempel, Warum-Karten nacheinander mit Pfeil zur Impressum-Karte, Ergebnis-Chips nacheinander |
| Fakten / Board / Kette | 6 | Gesprochenes, Karten, Cover, Caption = LAUF (Ersteintragung 2014, Eintrag 2015 laut Datendienst, 4 × Ja / 1 × Vorbehalt PLZ, „15 weitere Schritte“, Datei-Karte XLSX, Zeile 2 = Vorbehalt, Zeile 5 = früherer Widerspruch). Abzug: CTA-Board zeigt alten Stand „1 VON 5 SICHER“; Feld-8-Label abgeschnitten; GEWERBE weiter ohne MENSCH-Marker (F14-Ticket 02) |
| Anonymisierung | 8 | Video/Caption 0 Treffer. Guide-Bilder (S. 3 Shot 02, S. 5 Shot 05) zeigen Gewerk + Ort + Daten: „Dachdeckerei … Chemnitz … Eintragung Nr. 3 … eingetragen am 08.09.2015 … Veröffentlichung 18. Februar 2026 … Vermerk von 2010“, „Malermeister … selbstständig seit 2021, Sitz Chemnitz“, „Zimmerei“, „webvalid“ – keine Namen/Adressen, aber bei Einzelunternehmen über Registerdatum + Gewerk + Stadt per North-Data-Suche rückverfolgbar |
| CTA + Guide + Funnel | 9 | CTA nennt Lieferung (Prüffrage) + Ergebnis (10 Minuten, sichere Adressen); Guide liefert Prüffrage, Versand-Regeln, Versand-Spalte, ehrliche Grenze; DM-Karte „Prüffrage + Versand-Spalte · Excel“ passt jetzt (Claude gibt die Excel zurück); replies passend |
| Look vs. Folge 13 | 8 | gleiche Bildsprache, Ergebnis-Liste aus der echten xlsx sehr klar; Warum-Einstieg 23,0–24,4 s wieder fast leeres Panel (F13-H2/F14-H3 offen) |
| Cover / Caption | 9 | Cover „4 Briefe können raus, einer nach PLZ-Check“ + Liste + Maskottchen ganz; Serien-Pill da (F14-Ticket 03 erledigt), Chips mit Abstand zum Rand. Caption ehrlich, Menüpfad, Fiktiv-Hinweis, 2047 Zeichen. Kleinigkeit: der zitierte Prompt in Schritt 2 ist eine Kurzfassung des Lauf-Prompts (Handelsregister-Beispiel und „Nimm nur Firmenangaben“ fehlen), steht aber in Anführungszeichen |

**Scroller-Test:** 1 s: Frage + Liste 4× grün / 1× gelb → „warum gelb?“ → bleibt. 3 s: Rahmen + Glanz, „GANZ ALLEINE.“ bei 3,7 → bleibt. 10 s: Rückblick-Board mit Shirt-Karte, schwächster Moment; bei 12,5 Briefe + Lupe → knapp bleibt.

## Vergleich mit Folge 13 (8,5) und Folge 14 (R1 7,5)
- Hook, Ton, Musik, Untertitel, Caption: ≥ F13.
- Klarheit ohne Ton: gut (Impressum ≠ Register → Stempel → Warum-Karten → grüne Chips → PLZ PRÜFEN.).
- Look: wie F13, aber derselbe Fehler wie F14 (Maskottchen unter dem Ergebnis-Panel) plus ein zweites Fenster im Heute-Akt; F14-Tickets 02 (Feld-8-Label, MENSCH-Marker) und 04 (Schriftgröße DM-Unterzeile) nicht übernommen, 03 (Cover) übernommen.

## Gesamtnote
**7,0 / 10** (Schnitt der Kriterien ≈ 8,1, aber K.-o. Maskottchen 2× verletzt, Bildfluss 5 und Fakten/Board 6 < 8).

## Urteil
**Nicht bestanden** (Runde 1). Alles Hörbare (Stimme, Mix, Lautheit, STT), Caption, replies und Guide-Inhalt sind abnahmefähig und müssen nicht neu gebaut werden. Nötig ist ein Design-Neu-Render der Bildspur (Ton, Untertitel, Länge 45,0 s unverändert), danach Handy-Fassung, Kontaktbogen und ggf. Cover neu.

## Tickets
```
TICKET final-R1-01 → firma-design   (PFLICHT, K.-o.)
Kriterium: Bildfluss / Maskottchen · Note: 5/10
Beleg: 00:30,8–00:34,6 · pruefung/final-r1/maskottchen-30-34.4.jpg, maskottchen-30.5-31.0-30fps.jpg
Problem: Die Excel-Liste im Ergebnis-Akt deckt das Maskottchen zu ≈ 85 % ab (nur Unterkante + Lichtkegel sichtbar) – derselbe Fehler wie F14 final-R1-01.
Soll: In jedem Frame 30,8–34,7 s ist das Maskottchen entweder ganz sichtbar (Kopf + Augen frei, ≤ 1/3 verdeckt; z. B. Liste kleiner/höher so dass ihr Unterrand über dem Maskottchenkopf endet, wie das Warum-Panel 24–30 s) oder vorher aus dem Bild gehüpft und gar nicht da. Beleg: 10-fps-Bogen 30,5–35,0 s.
```
```
TICKET final-R1-02 → firma-design   (PFLICHT, K.-o.)
Kriterium: Bildfluss / Maskottchen · Note: 5/10
Beleg: ≈ 00:12,9–00:15,2 · pruefung/final-r1/maskottchen-12.5-15.jpg (13,0 / 13,5 / 14,0 / 14,5 / 14,9 s)
Problem: Das HEUTE-Panel (Briefe + Lupe) reicht über Kopf und Augen des Maskottchens, sichtbar bleibt nur die rechte untere Ecke (≈ 60–70 % verdeckt).
Soll: In jedem Frame 12,4–15,2 s Maskottchen-Augen frei und ≤ 1/3 verdeckt (Panel-Unterkante höher oder Maskottchen tiefer/seitlich, Untertitel nicht über den Augen) oder Maskottchen nicht im Bild. Beleg: 10-fps-Bogen 12,3–15,3 s.
```
```
TICKET final-R1-03 → firma-design   (PFLICHT, Fakt im Bild)
Kriterium: Fakten / Board · Note: 6/10
Beleg: 00:37,6–00:40,3 · pruefung/final-r1/board-cta-39.5.jpg; 00:11,0–00:12,5 und 00:37,6–00:40,3 · board-feld8-8s-11s.jpg
Problem: Das Board im CTA zeigt Feld 8 noch mit „1 VON 5 SICHER“, obwohl die Folge gerade „4 raus, 1 nach PLZ-Check“ gezeigt hat; der Feldtitel „WERBEBRIEF + ADRESSEN“ läuft in das „?“ und über den Feldrand (F14 final-R1-02 offen).
Soll: CTA-Board Feld 8 Unterzeile = Stand nach Folge 15 (z. B. „4 + 1 PLZ-CHECK“ oder „5 VON 5 BELEGT“, ≤ 4 Wörter, kein Haken – Werbebrief nicht verschickt); im Rückblick 6–12,5 s darf „1 VON 5 SICHER“ bleiben. Feldtitel vollständig lesbar ohne Überlappung (z. B. nur „ADRESSEN“ oder zweizeilig kleiner, „?“ daneben). Feld 6 „GEWERBE · MENSCH“ mit Personen-Symbol, ohne Haken.
```
```
TICKET final-R1-04 → firma-design   (PFLICHT, Lesbarkeit)
Kriterium: Text-Regeln / Lesbarkeit · Note: 7/10
Beleg: 00:24,4–00:30,8 · warum-karten-30s.jpg, warum-29.6.jpg; 00:40,5–00:45,0 · cta-43.5.jpg
Problem: Warum-Karten-Hauptzeilen („VON 2014“, „NORTH DATA“, „2015“) nur ≈ 2,0 % Bildhöhe, Kicker/Unterzeilen („REGISTER-ABSCHRIFT“, „GELESEN BEI“, „Ersteintragung“, „wie Impressum“) ≈ 1,1 %, DM-Unterzeile „„… Erfinde nichts.“ · Excel“ ≈ 1,3 %.
Soll: Jeder Text, der etwas aussagt, ≥ 3 % Bildhöhe (≥ 58 px Schrifthöhe bei 1920): Hauptzeilen ≥ 58 px; Kicker „GELESEN BEI“ + „NORTH DATA“ zusammen gut lesbar (North Data ist die Quelle, die sichtbar sein muss); Unterzeilen entweder ≥ 58 px oder weglassen (Sprechtext trägt sie). DM-Unterzeile ≥ 58 px oder weglassen. Weiterhin ≤ 4 Wörter je Block, ein neuer Block gleichzeitig.
```
```
TICKET final-R1-05 → firma-design   (empfohlen, im selben Render)
Kriterium: Hook / Übergänge · Note: 9/10
Beleg: 00:01,07–00:01,10 · hook-0.8-1.4-30fps.jpg
Problem: Raum (Stuhl, Hebel, Lampenlicht) und das gerade aufgestiegene Maskottchen verschwinden in einem Frame, die Liste bleibt stehen – wirkt wie ein Glitch.
Soll: Maskottchen verlässt das Bild sichtbar (hüpft/sinkt in ≥ 6 Frames) und der Hintergrund bleibt bis zum Schnitt 4,93 s gleich, oder der Wechsel ist ein bewusster harter Schnitt mit Kamerabewegung + SFX.
```
```
TICKET final-R1-06 → firma-design (Guide)   (empfohlen)
Kriterium: Anonymisierung · Note: 8/10
Beleg: versand-guide.pdf S. 3 (guide-img/02-versand-ergebnis-anonym.png) und S. 5 (guide-img/05-register-widerspruch-anonym.png)
Problem: Gewerk + Stadt + Registerdaten bleiben lesbar („Dachdeckerei … Chemnitz … Eintragung Nr. 3 … 08.09.2015 … 18. Februar 2026 … Vermerk von 2010“, „Malermeister … selbstständig seit 2021, Sitz Chemnitz“, „Zimmerei“) – bei Einzelunternehmen über North Data rückverfolgbar.
Soll: In beiden Guide-Bildern Gewerke (Dachdeckerei, Zimmerei, Malermeister) und konkrete Daten (08.09.2015, 18. Februar 2026, 2010, seit 2021) geschwärzt; Aussage „Ersteintragung 2014 → späterer Eintrag 2015 nennt Impressum-Adresse“ bleibt lesbar. Danach Guide-PDF neu, Token-Scan 0.
```
Hinweise (nicht blockierend, Design-Backlog): H1 Untertitel liegen bei 1,0 s und 42–45 s über den Maskottchen-Augen (Pills höher oder Maskottchen tiefer); H2 Warum-Einstieg 23,0–24,4 s leeres Panel (wie F13-H2/F14-H3); H3 Caption-Schritt 2 als Kurzfassung kennzeichnen („sinngemäß“) oder den vollen Lauf-Prompt nehmen; H4 Engine-Prüfung „recap“ auf „Die“ → Ende Satz 2 umstellen, damit sie nicht fälschlich warnt (hier 5,97 s statt 9,04 s).
