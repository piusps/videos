# Prüfung final · Folge 14 „Empfängerliste“ · Runde 1 (Slot 2026-10-31, eigentlich 12:00, Serientag 4, NICHT erste Folge des Tages)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-10-31, Eilauftrag. Nichts geändert.
Gemini-Review (`scripts/review-video.mjs`) gestartet → **OpenRouter 402** („requires at least $1.00 in balance for video“, `final-r1/gemini-review.txt`) → manuell Frame für Frame. ffmpeg nur `node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge: `firma-tag14-final.mp4` (45,700 s, 1080×1920, 30 fps, AAC 48 kHz stereo), `firma-tag14-final-handy.mp4` (45,718 s), `cover.jpg`, `kontaktbogen-2fps.jpg`, `caption.txt`, `replies.json`, `adressen-guide.pdf` (8 S., `guide-pages/p01–p08.png`), `format.json`.

## Belege (alle in `pruefung/final-r1/`)
- `hook-0-6s-4fps.jpg` (exakte Frames n = round(k·7,5)), `hook-2.0-3.1-10fps.jpg`, `frame0-30fps.jpg` (Master-Frames 0–2 + Handy-Frames 0–1), `hook-top-0-1s.jpg`
- `rest-2fps-01.jpg` (6–25,5 s), `rest-2fps-02.jpg` (26–45,5 s): exakte Frames alle 15 (`f/h_NNN.jpg`, NNN = Zeit·2)
- Schlüsselframes: `keys-a.jpg` (0 / 13 / 14,5 / 16 s), `keys-b.jpg` (18 / 19 / 20,5 / 24,5 s), `keys-c.jpg` (28,5 / 33,5 / 35,5 / 38 s), `keys-d.jpg` (40,5 / 42,5 / 44 / 45,5 s)
- `maskottchen-24-34.jpg`, `board-9-12-38.5.jpg`, `sync-heute-warum-30fps.jpg`
- Vergleich: `vergleich-f13-oben-f14-unten.jpg` (3 / 13,5 / 26 / 42 s), `cover-f14-f13.jpg`, `cover-f10-f12-f11.jpg`, `cover-kante.jpg`, `guide-seiten.jpg`
- Ton: `final-audio.mp3`, `stt-final-mix.json` (ElevenLabs-STT der fertigen Mischung)

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge final / handy | 45,700 s / 45,718 s | 40–48 s ✓ |
| Wörter / Tempo | words.json 99 = script.txt 99; 99 / 45,7 s = **130 wpm** | 85–100, 120–135 ✓ |
| Rückblick „Die“ 6,25 → „steht.“ ≈ 12,4 | ≈ 6,2 s | ≤ 6,5 s ✓ |
| „Heute“ | 13,14 s | ≤ 14,5 s ✓ |
| Pausen > 0,5 s | 11 Stück, 0,52–0,75 s, alle an Satzgrenzen; vor „Warum?“ 0,75 s | ✓ |
| STT fertige Mischung | wortgleich mit script.txt (nur Schreibweisen „probiere/schicke“, „Claude,“ statt „Claude:“, Zahlen ausgeschrieben); kein Gesang erkannt („[Hintergrundmusik]“) | ✓ |
| Lautheit final / handy | **−14,0 LUFS**, True Peak −0,9 dBFS, LRA 2,0 / −14,1 LUFS, TP −1,0 | −14 ±0,5 ✓ |
| Stimme vs. Musik | Musik allein in Sprechpausen (RMS): 12,45–13,05 −34,1 · 15,2–15,75 −38,0 · 19,9–20,45 −37,1 · 31,2–31,8 −38,5 dB; Stimme im Mix −17,6 (16–19 s) / −17,7 (25,3–27,5 s) / −15,7 dB (CTA) → **≈ 17–21 dB** | ≥ 15 dB ✓ |
| Musik am Stück | musik.txt: GONE ab 106,65 s, 45,7 s, kein Loop, Mute 0–0,75 s (explizites Wort), Explizit-Check 0 | ✓ |
| Untertitel-Sync | „Heute“ Bild 13,13 / words 13,137; „Warum“ Bild 23,97 / words 23,966 | ≤ 0,1 s ✓ |
| Handy-Fassung | SSIM zum Master 0,988 (5 fps), Frame 0 identisch | ✓ |
| Caption | 2076 Zeichen; Ende „(Fiktives Experiment, keine echten Umsätze.)“ + nur 6 Hashtags; keine Zeichen > U+2100; Menüpfad „neuer Chat … über „+“ … anhängen“; kein „Tag“ | < 2100 ✓ |
| replies.json | 1 + 5 Antworten, alle enden mit „?“, keine Emojis, Bezug zu Folge/Guide | ✓ |

## K.-o.-Liste
| K.-o. | verletzt? | Beleg |
|---|---|---|
| Frame 0: ganze Frage + Ergebnis-Objekt | nein | `frame0-30fps.jpg`: „Wie viel Umsatz macht eine KI in 100 Tagen?“ + Empfängerliste 1× BELEGT, 3× PRÜFEN, 1× WIDERSPRUCH + Briefkopf |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | nein | 0,25 Maskottchen fällt von oben ins Bild, Marker Zeile 1 · 0,5 Landung · 0,75 Ring BELEGT · 1,0–1,25 Ringe PRÜFEN · 1,75 Ring WIDERSPRUCH · 2,0 Rahmen Briefkopf · 2,8 Glanz-Wisch · 3,1 Rahmen Statusspalte · 3,75 „GANZ ALLEINE.“ · 4,25 Stempel kippt · 5,0 Gründungsplan · 5,5 Plan leuchtet · 5,75 Maskottchen hüpft. Knappstes Fenster 2,0–2,5 (nur Rahmen 2,0) |
| Hook-Objekt nie über dem Gründungsplan | nein | 4,75 Liste, 5,0 Plan allein |
| Nicht-Erstfolge: kein gesprochenes „Tag“, kein TAG-Slam | nein | words.json/STT ohne „Tag“; kein Slam; nur HUD-Badge „TAG 4“ oben links (wie F10/F12-Muster), Cover-Badge klein wie F10–F12 |
| Kein Umsatz-Zähler, Kasse 0 | nein | ganze Länge, Board 9 ERSTER UMSATZ offen |
| ≤ 1 neuer Textblock, Karten ≤ 4 Wörter, Text ≥ 1,2 s, ≤ ~12 neue Wörter | nein (knapp, s. Text-Regeln) | Karten: HEUTE: ADRESSEN (2), DIE QUELLE. (2), WARUM? (1), IST PFLICHT / PFLEGT DER BETRIEB / FRÜHERE ADRESSEN (2–3), NUR EINE BELEGT. (3), „Welche Adresse stimmt?“ (3). Briefkörper 13–15 s nur unscharfe Textur |
| **Maskottchen ganz im Bild oder höchstens 1/3 angeschnitten** | **JA** | **31,6–34,9 s (≈ 3,3 s):** Status-Tabelle schiebt sich über das Maskottchen, sichtbar ist nur ein Streifen der Unterkante + Füße + Lichtkegel (≈ 80 % verdeckt), `maskottchen-24-34.jpg` Bilder 32,0 / 33,0 / 34,0 s, `keys-c.jpg` Bild 2. Wirkt wie ein Glitch. (Im Warum 24–31 s nur Kopfoberkante ≈ 20–25 % unter dem Panel: ok.) |
| Fakten 1:1 aus dem Lauf, Zahlen nicht gegen Bibel | nein | Chips-Reihenfolge = Claudes Tabelle (1 Belegt, 3 Prüfen, 1 Widerspruch); „Eine Datei geteilt, das Web durchsucht und 9 weitere Schritte“ = LAUF; XLSX-Karte „Kolonnenshirt empfaenger serienbrief · Tabellenkalkulation · XLSX“ = LAUF; „IST PFLICHT · Anschrift muss rein“, „PFLEGT DER BETRIEB · selbst“, „FRÜHERE ADRESSEN · bei 2 von 5“ = Gründe 1/2; „NUR EINE BELEGT.“ = Kernsatz; Grund 3 (Register) nicht gezeigt ✓ |
| Datenschutz | nein | Tabelle nur Balken; Briefkopf nur Platzhalter „[Firmenname laut Impressum] [Straße Hausnummer] [PLZ Ort]“ (unscharf), Brief „[Dein Name] … [Telefon] [E-Mail]“; Anhang-Karten nur Dateinamen („Shirt-Firma Ergebnis Betriebe.md“, „Kolonnenshirt_Werbebrief.docx“); Claude-Fenster ohne Sidebar/Chatliste, Prompttext unscharf; Token-Scan (alle Namen/Straßen/PLZ/Orte aus LAUF + Hamburg, Fabrice, Müller, HRA, webvalid, boilr, Pius, Niklas, Mailmuster) über caption.txt, replies.json, Guide-Text: **0 Treffer** |
| Caption ≤ 2100 / Ende / Emojis | nein | s. Messwerte |
| Zuschauer außerhalb CTA nicht angesprochen | nein | script.txt Z. 1–9 ohne du/Imperativ; Endkarte „deine · Empfängerliste“ liegt im CTA |
| Guide liefert CTA „Adresse“ (Frage + Tabellenvorlage) | nein | S. 2 Frage Variante A (= prompt-fuer-kommentare.md, endet „Erfinde nichts.“), S. 3 Variante B als „Nicht getestet“, S. 5 drei Blätter mit Spalten, Musterzeilen (Muster GmbH/Musterweg/01234), Status-Regeln 1:1, Kopfzeilen zum Kopieren; S. 6 Quellen-Reihenfolge + „amtliches Register nicht abgefragt“; S. 7 Nicht geprüft + Datenschutz; „Folg @pickthecompany“ 1× (S. 8) |

**Ein K.-o. verletzt: Maskottchen 31,6–34,9 s fast ganz verdeckt.**

## Noten je Kriterium
| Kriterium | Note | Beleg |
|---|---|---|
| Hook (0–6 s) | 9 | Ergebnisbild mit Spannung (warum nur eine grün?) ab Frame 0, dichte Ereignisse; stärker als F13, weil der Hook die Folgefrage schon zeigt. Fenster 2,0–2,5 s am dünnsten |
| Serienrahmen Nicht-Erstfolge | 9 | Eröffnung wortgleich ohne Tag, kein Slam, HUD-Badge klein, Caption ohne „Tag“ |
| Ton: Stimme, Tempo, Aussprache | 9 | 130 wpm, STT der Mischung wortgleich, „Impressum“/„Verzeichnisse“ sauber, Pausen nur an Satzgrenzen |
| Musik + Lautheit | 9 | −14,0 LUFS / TP −0,9; 17–21 dB Abstand; Mute 0–0,75 s, Musik am Stück |
| Untertitel | 9 | Wortfolge = Skript, Sync ≤ 1 Frame (sync-heute-warum) |
| Text-Regeln | 8 | Karten ≤ 4 Wörter. Abzug: 34,9–35,5 s zwei neue Blöcke in ~0,5 s (ALS NÄCHSTES-Karte, dann WIDERSPRUCH-Mini-Karte darüber); Unterzeilen „Anschrift muss rein“, „selbst“, „bei 2 von 5“, „laut Claude“, „„… Erfinde nichts.“ · Excel“ ≈ 1,3–1,6 % Bildhöhe (< 3 %), auf dem Handy kaum lesbar (wie F13, dort toleriert) |
| **Bildfluss / Maskottchen** | **6** | K.-o. oben (31,6–34,9 s). Sonst flüssig: Brief → Briefstapel 13–15 s, Claude-Shots 16–20 s, Karten-Duell 20,5–23,9 s mit Durchstrich, Warum-Karten nacheinander. Endkarte 45,0–45,7: Maskottchen hüpft mit dem Kopf unter die „in 10 Minuten“-Karte (klein) |
| Fakten / Board / Kette | 8 | Fakten sauber (s. K.-o.). Abzug: Board-Feld 8 Beschriftung „WERBEBRIEF + ADRESSEN“ kollidiert mit dem „?“ und ist abgeschnitten („WERBEBRIE?·ADI“, `board-9-12-38.5.jpg`, sichtbar 11–13 s und 38–40 s); GEWERBE weiter ohne „MENSCH“-Marker (beats.json-Notiz verlangt ihn, F13-Hinweis H3 offen) |
| Anonymisierung | 9 | 0 Treffer; Briefkopf-Platzhalter unscharf gelb – fast lesbar, aber harmlos (nur Platzhalter); wirkt eher wie Weichzeichner-Fehler als wie Absicht |
| CTA + Guide + Funnel | 8 | CTA nennt Lieferung + Ergebnis, Guide liefert beides; replies passen. Abzug: DM-Karte „· Excel“ verspricht eine Excel-Datei, der Guide liefert eine Vorlage zum Nachbauen (Tabellen + Kopfzeilen), keine .xlsx |
| Look vs. Folge 13 | 8 | gleiche Bildsprache, Warum-Panel 24,0–25,3 s wieder fast leer (F13-Hinweis H2 nicht umgesetzt), sonst gleichwertig |
| Cover / Caption | 8 | Cover-Aussage stark („5 Adressen gesucht, nur eine belegt“) mit Beweis. Abzug: WIDERSPRUCH-Chip stößt rechts bündig an die Karten-Kante, rechte Rundung wird von der Kartenecke angeschnitten (`cover-kante.jpg`; im Video gleich: Frame 0 und 33,5 s Chip überlappt den orangen Innenrahmen); kleine orange Serien-Pill unter dem Titel fehlt (F10–F13 haben sie, `cover-f10-f12-f11.jpg`). Caption 9 |

**Scroller-Test:** 1 s: Frage + Ampel-Liste (1 grün, 3 gelb, 1 rot) mit Ringen → „was ist da rot?“ → bleibt. 3 s: Rahmen um Statusspalte, „GANZ ALLEINE.“ kommt → bleibt. 10 s: Rückblick-Board mit Shirt-Karte, schwächster Moment; ab 13,1 s Brief + HEUTE: ADRESSEN → knapp bleibt.

## Vergleich mit Folge 13 (final 8,5)
- Hook: F14 ≥ F13 (Ergebnis + offene Frage im selben Bild).
- Klarheit ohne Ton: gleich (Karten-Duell Impressum vs. Verzeichnisse mit Durchstrich, Warum-Karten, Stempel).
- Look: gleich, aber F14 hat den Maskottchen-Fehler 31,6–34,9 s und das Board-Label-Problem; Warum-Einstieg gleich leer wie F13.
- Ton/Lautheit/Untertitel: gleich gut.

## Gesamtnote
**7,5 / 10** (Schnitt der Kriterien ≈ 8,3, aber ein K.-o. verletzt und Bildfluss 6 < 8).

## Urteil
**Nicht bestanden** (Runde 1). Einziger Blocker ist das Maskottchen 31,6–34,9 s; die Korrektur ist ein kleiner Design-Eingriff mit Neu-Render von höchstens diesem Akt. Alles andere (Ton, Fakten, Datenschutz, Caption, Guide, replies) ist abnahmefähig und muss nach dem Fix nicht neu gebaut werden.

## Tickets
```
TICKET final-R1-01 → firma-design   (PFLICHT, K.-o.)
Kriterium: Bildfluss / Maskottchen · Note: 6/10
Beleg: 00:31,6–00:34,9 · pruefung/final-r1/maskottchen-24-34.jpg (32,0/33,0/34,0 s), keys-c.jpg Bild 2
Problem: Die Status-Tabelle im Haken-Akt deckt das Maskottchen zu ≈ 80 % ab, nur Unterkante + Füße schauen unten heraus.
Soll: In jedem Frame 31,5–35,0 s ist das Maskottchen entweder ganz sichtbar (Kopf + Augen frei, ≤ 1/3 verdeckt, z. B. Tabelle höher/kleiner wie das Warum-Panel 24–31 s) oder gar nicht im Bild (vorher aus dem Bild gehüpft); Beleg 2-fps-Bogen 31–35,5 s. Ton, Untertitel, Länge 45,7 s unverändert; danach Handy-Fassung + Kontaktbogen neu.
```
```
TICKET final-R1-02 → firma-design   (empfohlen, im selben Render)
Kriterium: Fakten / Board · Note: 8/10
Beleg: 00:11–00:13 und 00:38–00:40 · pruefung/final-r1/board-9-12-38.5.jpg
Problem: Feld 8 „WERBEBRIEF + ADRESSEN“ läuft in das „?“-Symbol und wird abgeschnitten; GEWERBE ohne „MENSCH“-Marker.
Soll: Feld-8-Titel vollständig lesbar ohne Überlappung (z. B. „ADRESSEN“ allein oder kleiner zweizeilig, „?“ rechts daneben); Feld 6 „GEWERBE · MENSCH“ mit Personen-Symbol, ohne Haken.
```
```
TICKET final-R1-03 → firma-design   (empfohlen)
Kriterium: Cover / Kante · Note: 8/10
Beleg: cover.jpg · pruefung/final-r1/cover-kante.jpg; Video 00:00 und 00:33,5 (Chip auf dem orangen Innenrahmen)
Problem: WIDERSPRUCH-Chip reicht bis an die rechte Karten-Kante bzw. über den Innenrahmen; kleine orange Serien-Pill unter dem Cover-Titel fehlt.
Soll: Rechts ≥ 16 px Abstand zwischen Chip-Ende und Karten-/Rahmenkante (Chip kleiner oder Statusspalte breiter), auf Cover und im Video; Serien-Pill unter dem Titel wie F10–F13.
```
```
TICKET final-R1-04 → firma-design   (empfohlen, eine Zeile)
Kriterium: CTA + Guide · Note: 8/10
Beleg: 00:40,3–00:45,7 · keys-d.jpg; guide-pages/p05.png
Problem: DM-Unterzeile „„… Erfinde nichts.“ · Excel“ verspricht eine Excel-Datei, der Guide liefert Tabellenvorlage + Kopfzeilen, keine .xlsx; Zeile ≈ 1,5 % Bildhöhe.
Soll: Unterzeile „„… Erfinde nichts.“ · 3 Blätter“ (oder „für Excel“), Schrifthöhe ≥ 3 % Bildhöhe (≥ 58 px Versalhöhe-Bezug) – alternativ dem Guide eine leere Vorlage-.xlsx beilegen. „Erfinde nichts.“ stimmt mit prompt-fuer-kommentare.md Variante A überein.
```
Hinweise (nicht blockierend, Design-Backlog): H1 Unterzeilen der Warum-Karten (≈ 1,3 %) auf ≥ 3 % Bildhöhe; H2 Briefkopf-Platzhalter entweder scharf lesbar oder als saubere Balken statt Weichzeichner; H3 Warum-Panel 24,0–25,3 s nicht größer als sein Inhalt (wie F13-H2); H4 WIDERSPRUCH-Mini-Karte erst ≥ 1,2 s nach der ALS-NÄCHSTES-Karte.
