# Prüfung final · Runde 1 · Folge 10 „Website“ (firma-tag10)
Prüfer: frischer Agent, 2026-10-30 ~11:25. Gemini-Review entfällt (Ausfall) → manuelle Frame-Prüfung.
Belege: `kontaktbogen-2fps.jpg`, `pruefung/hookcheck/hook-0-6s-4fps.jpg`, eigene Frames `pruefung/final-frames/` (t*.jpg, sheetA/B/C.jpg, guide.jpg).

## Messwerte
| Messung | Wert | Soll | ok |
|---|---|---|---|
| Länge | 46,4 s (Sprache 0,00–45,43 s) | 40–48 s | ja |
| Wörter / Tempo | 100 W. / 132 wpm (words.json) | 85–100 / 120–135 | ja (Grenze 100) |
| Rückblick „Die“–„Block.“ | 6,81–13,24 s = 6,44 s | ≤ 6,5 s | ja |
| „Heute“-Start | 13,84 s | ≤ 14,5 s | ja |
| Lautheit final | −14,0 LUFS, TP −1,2 dBFS, LRA 2,4 | −14 ±0,5 | ja |
| Stimme/Musik-Abstand | 18,8–23,3 dB je Akt (regie/gap-final.txt), Musik 46,43 s am Stück, kein Loop (musik.txt) | ≥ 15 dB | ja |
| Caption | 2061 Byte (< 2061 Zeichen), endet „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags, keine Emojis | ≤ 2100 | ja |
| Guide | 7 Seiten; enthält Frage zum Kopieren, 3 Dinge für ganz oben, Online-Checkliste, Entwurf als Bild; 0 Treffer „boilr/Hamburg/Adresse/Domain/Hosting“ | CTA-Versprechen | ja |

## K.-o.-Check
| Regel | Befund | Beleg |
|---|---|---|
| Frame 0 = Frage + Ergebnis-Objekt | ok: Titel-Frage + Handy-Entwurf (ENTWURF, 109 €) | hookcheck f01 |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | ok (Wort-Pills, Zoom-Callouts Headline/Preis/Button, „GANZ ALLEINE.“, Logo-Callout, Board-Einflug) | hook-0-6s-4fps.jpg |
| Hook-Objekt überlappt nie Gründungsplan | ok: Handy weg bei 4,25 s, Board ab 5,0 s | hookcheck f18–f22 |
| Board LOGO abgehakt / WEBSITE current nicht grün | ok (7 grün „BLAUER BLOCK“, 8 gold „?“) | t14.3, t38.6 |
| Kein Umsatz-Zähler, kein gesprochener Tag | ok (nur HUD „TAG 3“) | alle Frames |
| **Plan-Board ganz im Bild** | **VERLETZT**: 14,0–15,0 s Board links und oben angeschnitten („NDUNGSPLAN“, Spalte 1 abgeschnitten) während der Fahrt zu „HEUTE: WEBSITE“ | t14.3.jpg, Kontaktbogen Zeile 3 Sp. 5–7 |
| **Kein Frame > ~12 neue Wörter / kein Lesetext** | **VERLETZT**: ca. 17,4–18,6 s voller Prompttext (~90 Wörter, 9 Zeilen, eine Zeile gelb markiert) im Claude-Fenster | t17.6.jpg, t18.0.jpg (sheetA Bild 2) |
| **≤ 1 neuer Textblock gleichzeitig** | **formal VERLETZT**: Endkarte DM 1 „Die Frage“ und DM 2 „Online-Checkliste“ erscheinen im selben 0,5-s-Fenster (~38,6→39,0 s), wie Folge 9 | Kontaktbogen Zeile 7 Sp. 6–7, t39.0 |
| Karten ≤ 4 Wörter, Text ≥ 1,2 s | ok („HEUTE: WEBSITE“, „WARUM DIESE DREI?“, „HAKEN“, „IMPRESSUM?“, „DATENSCHUTZ?“, „Was muss sie anmelden?“ ≥ 2 s) | Kontaktbogen Z. 5–6 |
| Maskottchen ganz oder ≤ 1/3 angeschnitten | ok (0,75–1,25 s und Endkarte Füße unten angeschnitten, ≈ 1/3) | hookcheck f03–f05, t45.9 |
| Screenshot 04 / „Deine Adresse bei boilr“ | ok: in keinem geprüften Frame, nicht im Guide-Text | final-frames, guide.jpg |
| Keine Sidebar / private Chats / Namen / Mails / „Hamburg“ | ok; Hinweis: Statuszeile „Dateien erstellt, Erinnerung gelesen, Artefakte verwendet“ bei 18,8 s sichtbar (kein privater Inhalt) | t18.8.jpg |
| Domain/Hosting nicht als Claude-Ergebnis | ok: Haken nennt nur Impressum + Datenschutz (beides von Claude genannt) | Kontaktbogen Z. 6, script.txt |
| Keine erfundenen Zahlen | ok: 109 €, 29,90 € aus Lauf; Platzhalter „[VERSANDKOSTEN]“ ehrlich sichtbar | t30.0 |

## Bewertung (Stufe final)
| Kriterium | Note | Beleg |
|---|---|---|
| Hook nicht statisch, Frame 0 | 9 | hookcheck 0–6 s: jedes Fenster ein Ereignis, Ergebnis-Objekt in Frame 0 |
| Kamera ruhig, Board/Fenster ganz im Bild | 5 | 14,0–15,0 s Board angeschnitten (t14.3); Rest ruhig, Claude-Fenster immer ganz |
| Kein Lesetext / ein Label gleichzeitig | 4 | 17,4–18,6 s ~90-Wörter-Prompt (t18.0); Endkarte 2 DMs zugleich (39,0 s) |
| Zweite Hälfte ohne Ton verständlich | 8 | Phone-Entwurf → „ERSTER BLICK“ → 3 Fragen-Liste → HAKEN/IMPRESSUM?/DATENSCHUTZ? → „Was muss sie anmelden?“ (Z. 5–6) |
| Musik/Ton | 9 | −14,0 LUFS, Abstand ≥ 18,8 dB, ein Stück |
| CTA konkreter Wert, Guide hält Versprechen | 9 | Endkarte DM1 Frage + DM2 Checkliste + „in wenigen Minuten dein Startseiten-Entwurf“; Guide S. 2–6 |
| Untertitel | 8 | Stichproben 1,2/17,3/24,9/29,6/45,9 s passen zu words.json; Pill-Takt sauber; ≤ 0,1 s nicht frame-genau messbar |
| Fakten / Bibel / Lauf | 9 | Haken nur Claude-Punkte, Preise aus Lauf, kein Domain/Hosting |
| Look vs. Folge 8/9 | 8 | gleiche 3D-Raum-Sprache, Board/HUD konsistent; Website-Entwurf als echtes Objekt stark. Bekannte Abweichungen: LOGO-Kachel „BLAUER BLOCK“ statt Bild = stört nicht (deckt sich mit gesprochenem „dunkelblauer Block“, lesbar); WEBSITE gold „?“ statt ENTWURF = stört nicht, passt zu „current, nicht grün“ |
| Caption / Replies | 9 | Menüpfad, Fiktiv-Satz, Hashtags, keine Emojis; Replies enden auf Frage |
| Scroller-Test | 8 | 1 s: Frage + echtes Handy → bleiben. 3 s: Zoom auf 109 € → bleiben. 10 s: Rückblick mit Board, kurz → bleiben; Risiko 17–19 s Textwand (Abspringen) |

**Gesamtnote: 7/10 · NICHT bestanden** (2 harte K.-o. + 1 formaler K.-o.; Kriterien < 8).

## Tickets
```
TICKET final-R1-01 → firma-design
Kriterium: Kein Lesetext · Note: 4/10
Beleg: 17,4–18,6 s, final-frames/t17.6.jpg, t18.0.jpg
Problem: Der komplette Prompt (~90 Wörter) steht lesbar im Claude-Fenster.
Soll: In keinem Frame 16,7–19,5 s mehr als 12 lesbare Wörter Bildschirmtext außer Untertiteln: nur Anhang-Chips + die eine markierte Zeile („Startseite … fürs Handy“), restlicher Prompttext abgeschnitten/ausgeblendet. Kontaktbogen 4 fps 16–20 s als Beleg.
Aufwand: ~20 min + Re-Render (~10 min)
```
```
TICKET final-R1-02 → firma-design (Kamera-Umsetzung; firma-regie nur falls beats.json die Fahrt so vorgibt)
Kriterium: Board ganz im Bild · Note: 5/10
Beleg: 14,0–15,0 s, final-frames/t14.3.jpg
Problem: Bei der Fahrt zu „HEUTE: WEBSITE“ ist der Gründungsplan links/oben angeschnitten.
Soll: Board inkl. Titel „GRÜNDUNGSPLAN“ und aller 3 Spalten in jedem Frame 13,0–16,0 s vollständig im 1080×1920-Bild (4-fps-Frames als Beleg).
Aufwand: ~10 min (Kamera-Keyframe/Zoom-Ziel) + derselbe Re-Render
```
```
TICKET final-R1-03 → firma-design
Kriterium: ≤ 1 neuer Textblock gleichzeitig · Note: 6/10
Beleg: ~38,6–39,0 s, Kontaktbogen Zeile 7 Sp. 6–7
Problem: DM 1 und DM 2 erscheinen fast gleichzeitig (wie Folge 9).
Soll: DM 2 erscheint ≥ 1,2 s nach DM 1 (DM 1 auf „Frage“ ~40,0 s, DM 2 auf „Online-Checkliste“ ~41,1 s laut words.json).
Aufwand: ~5 min, im selben Re-Render
```
Optional (kein K.-o.): 30,0 s roter Rahmen um die winzige Zeile „[WIE GESTELLT WIRD …]“ am Handy-Unterrand ist auf dem Handy unlesbar → entweder weg oder vergrößern (firma-design, 5 min).

Nach Fix: Runde 2 mit frischem Agent, Fokus 13–20 s und 38–42 s; Ton/Caption/Guide brauchen keine Neuprüfung.
