# Prüfung final · Folge 13 „Werbebrief“ · Runde 1 (Slot 2026-10-31 09:00, Serientag 4, erste Folge des Tages)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-10-30. Gemini-Review fällt aus (OpenRouter ohne Guthaben), deshalb manuell Frame für Frame, nur `node_modules/ffmpeg-static` + `@ffprobe-installer`. STT nicht neu gelaufen (Regie R3: 10/10 Läufe 100/100 Wörter); Untertitel gegen `public/firma-ep/tag13/words.json` und die Bögen geprüft.
Prüflinge: `firma-tag13-final.mp4` (45,000 s, 1080×1920, 30 fps, AAC 48 kHz), `firma-tag13-final-handy.mp4` (45,014 s), `cover.jpg`, `caption.txt`, `werbebrief-guide.pdf` (Seiten `guide-pages/p01–p10.png`), `replies.json`, `format.json`.

## Belege (alle in `pruefung/final-r1/`)
- `hook-0-6s-4fps.jpg`: 0–6 s @ 4 fps (24 Frames, Zeitstempel im Bild)
- `rest-2fps-01.jpg`, `rest-2fps-02.jpg`: 6–45 s @ 2 fps (78 Frames), zusammen mit dem Hook-Bogen der Kontaktbogen über die ganze Länge
- Übergänge: `tr-heute-13.3-14.0-30fps.jpg`, `tr-warum-24.2-24.8-30fps.jpg`, `tr-claude-15.8-16.4-20fps.jpg`, `tr-entsch-20.9-21.5-20fps.jpg`, `tr-naechstes-33.8-34.6-15fps.jpg`, `artefakt-34.1-34.3-30fps.jpg`, `tr-cta-36.8-37.6-15fps.jpg`, `tr-endkarte-38.6-40.4-10fps.jpg`, `tr-board-4.3-4.9-20fps.jpg`
- Schlüsselframes in voller Auflösung: `keys-a.jpg` (0 / 0,6 / 6,2 / 11,6 s), `keys-b.jpg` (16,6 / 18,8 / 20,2 / 22,8 s), `keys-c.jpg` (25,6 / 32,5 / 35,5 / 44,9 s), Einzelbilder in `f/full_*.png`
- Maskottchen: `maskottchen-22-26-31-35.jpg`
- Seite an Seite: `vergleich-f12-oben-f13-unten.jpg` (0 / 3 / 26 / 44 s), `cover-f12-f9-f13.jpg`, `guide-seiten.jpg`

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge final / handy | 45,000 s / 45,014 s | 40–48 s ✓ |
| Wörter / Tempo | words.json 100 Wörter = script.txt 100 Wörter, 0 Abweichungen (Ziffern 100/20/4/10); 100 / 45,0 s = **133,3 wpm** | 85–100, 120–135 ✓ |
| „Tag vier“ gesprochen | words.json „Tag“ 5,70 s, „4.“ 5,96 s; Regie-STT 10/10 „Tag vier“ | ✓ |
| Rückblick „Die“ 6,59 → „Betriebe.“ | 6,26 s | ≤ 6,5 s ✓ |
| „Heute“ | 13,52 s | ≤ 14,5 s ✓ |
| Längste Sprechpause | 0,86 s (vor „Warum?“) | geplant 0,9 ✓ |
| Lautheit final / handy / F12 | −14,0 LUFS, True Peak −1,2 dBFS / −14,1 LUFS / −14,0 LUFS | −14 ±0,5 ✓ |
| Stimme vs. Musik | Musik allein in der Sprechpause 20,65–21,25 s: −36,5 dB RMS im Mix; Stimme im Mix ≈ −15,4 dB → **≈ 21 dB Abstand** | ≥ 15 dB ✓ |
| Musik-Mute 19,92–20,62 s | `episode.json audio.musicMute [[19.92, 20.62]]`; `regie/musik-abschnitt.mp3` im Fenster −59,0 dB (davor/danach −22 / −17,3 dB); im Mix liegt dort nur Stimme (−15,4 dB, Stimme allein −17,3 + Normierung). „Shit“ (Track 20,16–20,34) damit auf 0. Grenze der Messung: keine Subtraktion Mix − Stimme möglich (numpy fehlt), Beleg indirekt; selbst ohne Mute läge die Musik dort ≈ 21 dB unter der Stimme | ✓ |
| Handy-Fassung | SSIM zum Master 0,994 (5 fps), gleiche Länge, 1080×1920, 30 fps | ✓ |
| Caption | 2082 Zeichen (2081 ohne Schluss-Umbruch), Ende „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags, Menüpfad „über „+“ … anhängen“ | < 2100 ✓ |

## K.-o.-Liste
| K.-o. | verletzt? | Beleg |
|---|---|---|
| Frame 0: ganze Frage + Ergebnis-Objekt | nein | keys-a 0,0 s: „Wie viel Umsatz macht eine KI in 100 Tagen?“ + echter Brief (Logo, Kernzeile „Gestickt wird erst, wenn Sie bestellen.“) + E-Mail/Anruf-Symbole |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | nein | hook-4fps: 0,25 Marker auf Kernzeile · 0,5 Maskottchen · 0,75 E-Mail gestrichen · 1,0 Anruf gestrichen · 1,75 Logo-Rahmen · 2,0 Kamera auf Brief · 2,5 Kernzeile groß · 3,0 Haken · 3,5 „GANZ ALLEINE.“ · 4,25 Brief raus · 4,5 Plan + Maskottchen · 5,0 Maskottchen freut sich · 5,75 TAG-Slam |
| Hook-Objekt nie über dem Gründungsplan | nein | tr-board 4,30–4,45: Brief weg, nur Stempel; 4,50 Plan allein |
| „Tag vier“ gesprochen + „TAG 4“ | nein | 5,75–6,0 s Slam „TAG 4“, HUD-Badge „TAG 4“ ab 6,5 s bis Ende |
| ≤ 1 neuer Textblock gleichzeitig, Karten ≤ 4 Wörter, Text ≥ 1,2 s, ≤ ~12 neue Wörter | nein | Heute: Pill 13,67 (2 Wörter) auf Brief mit Betreff (7) = 9; Claude-Shots 16,2 / 18,3 / 19,53 s (1,23 / 1,76 s); E-MAIL·ANRUF·BRIEF 21,25 → „DER BRIEF.“ ~22,6; WARUM? 24,27 → Karte 1 ~25,9 → Karte 2 28,75 → Karte 3 30,48 (allein bis 34,1); „ALS NÄCHSTES · Wohin gehen die Briefe?“ 34,13; Endkarte DM-Karte 39,2 → „in 10 Minuten · eigener Briefentwurf“ ~41,0 (5 Wörter wie F12 „in 10 Minuten mögliche Firmenkunden“) |
| Maskottchen ganz oder ≤ 1/3 angeschnitten | nein | keys-a 0,6 / 6,2 s Unterkante < 1/4; maskottchen-22-26-31-35: im Warum ganz unter dem Panel; Endkarte 37–45 s ganz mit Ring |
| Kein Umsatz-Zähler | nein | ganze Länge |
| Board: BETRIEBE erledigt, WERBEBRIEF aktuell, WEBSITE Entwurf, GEWERBE nicht grün | nein | keys-a 11,6 s: 1–4 grün, 5 WEBSITE ENTWURF „in Arbeit“ (rot-braun), 6 GEWERBE OFFEN (blau), 7 BETRIEBE ✓ „LISTE: 20“, 8 WERBEBRIEF gold „?“, 9 ERSTER UMSATZ offen; HUD-Mini-Board gleich |
| Keine Betriebs-/Personennamen, kein „Hamburg“, keine Sidebar/privaten Chats/Mailadressen | nein | Video: Brief nur Platzhalter, Anhang-Karte „Shirt-Firma Ergebnis Betriebe.md“ ohne Inhalt, Claude-Fenster ohne Sidebar (keys-b). Token-Scan (31 Namens-Tokens aus `firma-tag12/design/lauf/liste-text.txt` + Hamburg + „Fabrice“/„Müller“ + Mailmuster) über caption.txt, replies.json, guidebook.html/json, prompt-fuer-kommentare.md: 0 Treffer. Cover: Brief-Miniatur nur Platzhalter |
| Fakten/Rechtsaussagen 1:1 aus dem Lauf | nein | „FÄLLT GANZ WEG · ohne Einwilligung · auch B2B“ = LAUF Grund 1 + „UWG unterscheidet nicht B2C/B2B“; „OHNE EINWILLIGUNG ERLAUBT · mit Widerspruchshinweis“ = Grund 3; „KEIN KONKRETER GRUND · bei keinem der 5“ = Grund 2; Fußzeile „laut Claude · keine Rechtsberatung“; Betreff „Werbung: Firmenshirts mit Ihrem gestickten Logo“ = Brieftext |
| Länge 40–48 s, 120–135 wpm | nein | 45,0 s, 133,3 wpm |
| Caption ≤ 2100, Ende korrekt, nur Hashtags | nein | s. Messwerte |
| Keine Emojis (Caption, replies, Guide) | nein | Scan > U+2190: Caption/replies leer; Guide nur „─“ (Konsolenlinie) und „⧉“ (Kopier-Symbol), keine Emojis |
| replies.json 6 Antworten mit leichter Frage | nein | commentReply + 5 Variationen = 6, alle enden mit „?“ |
| format.json PTC | nein | `{ "format": "PTC" }` |
| Guide liefert CTA (Frage + Briefvorlage) | nein | S. 2 Frage Variante A, S. 3 Variante B (als ungetestet markiert), S. 7 echter Brief, S. 8 Briefvorlage als Text, S. 5 drei Wege mit Claudes Wortlaut, S. 9 nicht Geprüftes; „Folg @pickthecompany“ 1× (S. 10) |
| Zuschauer außerhalb CTA nicht angesprochen | nein | script.txt Z. 1–10 ohne „du“/Imperativ |

**Kein K.-o. verletzt.**

## Noten je Kriterium
| Kriterium | Note | Beleg |
|---|---|---|
| Hook (0–6 s) | 9 | Ergebnis-Objekt + Frage ab Frame 0, dichte Ereignisse (s. K.-o.), Brief als roter Faden ist stärker als F12-Karte; Übergang 4,3–4,45 s kurz nur Stempel im leeren Raum (wie F12) |
| Serienrahmen erste Folge | 9 | „Tag vier.“ gesprochen, Slam „TAG 4“ 5,75–6,3 s, HUD ab 6,5 s, Caption „Tag 4: Heute …“, Cover „TAG 4“ |
| Ton: Stimme, Tempo, Aussprache | 9 | 133,3 wpm, Regie-STT 10/10 wortgleich, Pausen nur an Satzgrenzen |
| Musik + Lautheit | 9 | −14,0 LUFS / TP −1,2; ≈ 21 dB Abstand; Mute aktiv (indirekt belegt) |
| Untertitel | 9 | Wortfolge = script.txt, Einsatz synchron: „Heute“ 13,50 Bild / 13,52 words.json, „Warum“ 24,23 / 24,25 (tr-heute, tr-warum) |
| Text-Regeln | 9 | ein Block zur Zeit, Abstände ≥ 1,2 s, größter Bildtext 9–10 Wörter |
| Bildfluss / Übergänge | 8 | 13,3–14,0 s: Brief wächst 13,50–13,60 aus Feld 8, kein Fremd-Quadrat, Pill 13,67 auf dem Brief (nicht über „SHIRTS MIT LOGO“); 24,2–24,8 s: sauber, kein Quadrat. Abzug: 34,10–34,23 s Kamerasprung + 3 Frames, in denen das schrumpfende Warum-Panel durch die neue Frage-Karte scheint, Rest der „WARUM?“-Pill als orangener Strich (artefakt-34.1-34.3-30fps.jpg); 16,20–16,30 s Brief schrumpft halbtransparent über die Anhang-Karten (tr-claude) |
| Fakten / Board / Kette | 9 | s. K.-o.; Übergabe „Wohin gehen die Briefe?“ = Lauf („Impressums-Adressen“), Empfängerfeld nur Platzhalter. Kleinigkeit: GEWERBE ohne „MENSCH“-Marker (Regie-Hinweis 1, F12 hatte ihn) |
| Anonymisierung | 10 | s. K.-o. |
| CTA + Guide + Funnel | 9 | CTA nennt Lieferung (Frage + Briefvorlage) und Ergebnis (Briefentwurf in 10 Min.), Guide liefert beides, replies passen zum Guide |
| Look vs. Folge 12 | 8 | gleiche Bildsprache; Warum-Akt 24,3–25,9 s: großes dunkles Panel mit kleinem Brief, wirkt leerer als F12-Warum (vergleich-f12…, Bild 3) |
| Cover / Caption | 9 | Cover-Aussage mit Beweis (E-Mail/Anruf gestrichen, „DER BRIEF.“), TAG 4, Serien-Pill wie F9/F12 |

**Scroller-Test:** 1 s: Frage + Brief + gestrichene Mail-/Telefon-Symbole, Neugier „warum ein Brief?“ → bleibt. 3 s: Kernzeile groß + Haken, „GANZ ALLEINE.“ → bleibt. 10 s: Rückblick-Board mit Produktkarte, schwächster Moment, aber nach 3,5 s kommt „HEUTE: WERBEBRIEF“ mit großem Brief → knapp bleibt.

## Vergleich mit Folge 12 (final-runde2, 8/10 bestanden)
- Hook: F13 ≥ F12 (durchgehendes Story-Objekt statt Karte, Ergebnis wird im Hook schon aufgelöst).
- Klarheit ohne Ton: F13 ≥ F12 (Entscheidung als drei Karten mit Stempel, Warum-Karten je ≤ 3 Wörter Titel).
- Look: gleich; Warum-Einstieg bei F13 leerer, Übergang 34,1 s etwas unsauberer als F12 nach Ticket R1-01.
- Ton/Lautheit/Untertitel: gleich gut.

## Gesamtnote
**8,5 / 10** (kein Kriterium unter 8, kein K.-o.).

## Urteil
**Bestanden** (Runde 1).

## Tickets
Keine Pflicht-Tickets (kein Kriterium < 8). Hinweise für das Design-Backlog, nicht blockierend:
```
HINWEIS final-R1-H1 → firma-design
Kriterium: Bildfluss · Note: 8/10
Beleg: 00:34,10–00:34,23 · pruefung/final-r1/artefakt-34.1-34.3-30fps.jpg
Problem: Kamerasprung beim Wechsel Warum → Als Nächstes; schrumpfendes Warum-Panel scheint 3 Frames durch die Frage-Karte, Rest der WARUM?-Pill bleibt als Strich.
Soll: Panel ist vor dem Einflug der Karte ganz weg (oder Karte deckend), kein Kamerasprung > 1 Frame; im 30-fps-Bogen 34,0–34,4 s kein Doppelbild.
```
```
HINWEIS final-R1-H2 → firma-design
Kriterium: Look vs. Referenz · Note: 8/10
Beleg: 00:24,3–00:25,9 · keys-c.jpg Bild 1
Problem: Warum-Panel vor Karte 1 fast leer (kleiner Brief auf großer dunkler Fläche).
Soll: Panel nicht größer als sein Inhalt oder Brief füllt ≥ 60 % der Panelbreite, bis Karte 1 kommt.
```
```
HINWEIS final-R1-H3 → firma-design
Kriterium: Fakten / Board · Note: 9/10
Beleg: 00:06,5–00:13,5 und 00:37–00:39 · keys-a.jpg Bild 4
Problem: Feld 6 GEWERBE zeigt nur „OFFEN“, ohne den „MENSCH“-Marker aus Folge 12 / Regie-Hinweis 1.
Soll: ab der nächsten Folge GEWERBE wieder mit „MENSCH“ + Personen-Symbol, ohne Haken.
```
