# Prüfung final · Runde 2 · Folge 10 „Website“ (firma-tag10)
Prüfer: frischer Agent, 2026-10-30 ~11:30. Prüfling: `firma-tag10-final.mp4` (v4, 11:28).
Belege in `pruefung/final-r2/`: `sheet-13-20.jpg` (4 fps, 13,0–19,75 s, a_01…a_28 = 13,0 + (n−1)·0,25 s), `sheet-37-42.jpg` (4 fps, 37,5–42,25 s, b_01…b_20 = 37,5 + (n−1)·0,25 s), Stichproben `s_<t>.jpg` + `stich.jpg`, Ausschnitt `check.jpg`.

## Ticket-Abgleich
| Ticket | Soll | Befund | Status |
|---|---|---|---|
| final-R1-01 Lesetext 16,7–19,5 s | ≤ 12 lesbare Wörter außer Untertiteln | 16,75–17,25 s: zwei Anhang-Chips („Shirt-Firma Ergebnis Logo.md 42 Zeilen MD“, „Kolonnenshirt-Logo.svg 6 Zeilen TEXT“, ≈ 11 Wörter). 17,5–17,75 s: genau eine Zeile „Startseite als Vorschau hier im Chat, mit meinem Logo, für…“ (≈ 10 Wörter), gelb markiert; Nachbarzeilen nur als unlesbare Anschnitt-Streifen. 18,0–18,75 s: nur Chat-Eintrag „Kolonnenshirt Startseite“ (winzig). Ab 19,0 s Handy-Entwurf (Ergebnis-Objekt, wie R1 ok). Kein voller Prompt mehr. | **erledigt** (a_19–a_24, check.jpg) |
| final-R1-02 Board 13,0–16,0 s ganz im Bild | Titel + 3 Spalten in jedem Frame vollständig | 13,0–13,75 s Board komplett inkl. „GRÜNDUNGSPLAN · 9 SCHRITTE“ und Spalten 1–3, Rand knapp (~10 px links) aber nicht angeschnitten. Ab 14,0 s harter Wechsel ins Claude-Fenster (Board nicht mehr im Bild, also auch nicht angeschnitten). Keine Kamerafahrt mit Anschnitt mehr. | **erledigt** (a_01–a_05) |
| final-R1-03 DM 2 ≥ 1,2 s nach DM 1 | nicht zwei DMs zugleich | Gelöst durch Zusammenlegung: eine einzige Karte „DM 1 · Frage + Online-Checkliste“ (+ Kurzzeile „Bau mir eine Startseite …“ · Impressum · Datenschutz) erscheint 40,25 s auf „Frage“ (40,28 s). Nächster neuer Block „in wenigen Minuten dein Startseiten-Entwurf“ erst ~43 s. Nie 2 neue Blöcke gleichzeitig. | **erledigt** (b_12–b_20, s_44) |

## Messwerte
| Messung | Wert | Soll | ok |
|---|---|---|---|
| Länge | 46,40 s, 1080×1920, 30 fps | 40–48 s | ja |
| Lautheit | −14,1 LUFS, TP −1,2 dBFS, LRA 2,4 LU | −14 ±0,5 | ja |
| „Heute“-Start | 13,84 s (words.json) | ≤ 14,5 s | ja |
| Untertitel-Sync (Stichproben) | 14,0 „Heute“ (13,84), 16,0 „Logo anhängen“ (15,97/16,35), 17,75 „Startseite“ (17,81), 19,5 „Ganz oben“ (19,46/19,78), 40,25 „dir Frage“ (40,14/40,28), 41,0 „Online-Checkliste“ (41,10) | ≤ ~0,25 s | ja |

Ton, Caption, Guide, Hook, Board-Zustand: Stichprobe ohne Verschlechterung (Frame 0 Frage + Handy-Entwurf; 3 s Zoom 109 €; 6 s Board; LOGO grün, WEBSITE gold „?“, ERSTER UMSATZ offen; Lautheit wie R1).

## K.-o.-Check
| Regel | Befund | Beleg |
|---|---|---|
| ≤ 1 neuer Textblock gleichzeitig | ok (13–20 s: Pills + je ein Objekt; Endkarte nur eine DM-Karte) | sheets |
| Karten ≤ 4 Wörter | ok („HEUTE: WEBSITE“, „HAKEN“, „IMPRESSUM ?“, „Was muss sie anmelden?“); DM-Karte = Funnel-Element, Titel 3 Wörter | s_30, b_01 |
| Text ≥ 1,2 s | ok („HEUTE: WEBSITE“ 14,0–15,0 s + Rest im Feld bis ~15,0; markierte Zeile 17,5–17,75 s ist Teil des Klickpfads, gesprochen „Startseite fürs Handy“) | a_05–a_21 |
| Kein Frame > ~12 neue Wörter außer Untertiteln | ok (max. ≈ 11) | check.jpg |
| Board ganz im Bild | ok, wenn sichtbar nie angeschnitten. Hinweis: ab 40,25 s verdeckt die DM-Karte Titel + Ziffernzeile des Boards (Overlay, kein Bildanschnitt) | b_12 |
| Maskottchen ganz / ≤ 1/3 angeschnitten | ok (Endkarte unten ≈ 1/3, wie R1) | b_02–b_20 |
| Kein Umsatz-Zähler | ok (nur Titelfrage „Wie viel Umsatz …“, Board „ERSTER UMSATZ“ offen) | s_0, s_46 |
| Kein Screenshot 04 / boilr / Hamburg / Sidebar / private Namen | ok; Chips zeigen nur Dateinamen der Serie (Shirt-Firma, Kolonnenshirt) | a_17–a_24 |
| Kein gesprochener Tag | ok (nur HUD „TAG 3“) | — |

## Bewertung (Stufe final)
| Kriterium | Note | Beleg |
|---|---|---|
| Hook nicht statisch, Frame 0 | 9 | s_0, s_3 unverändert |
| Kamera ruhig, Board/Fenster ganz im Bild | 8 | a_01–a_05: Board komplett, harter Schnitt statt Anschnitt-Fahrt |
| Kein Lesetext / ein Label gleichzeitig | 8 | max. eine Zeile Prompt, eine DM-Karte |
| Zweite Hälfte ohne Ton verständlich | 8 | wie R1 |
| Musik/Ton | 9 | −14,1 LUFS, TP −1,2 |
| CTA konkreter Wert, Guide | 9 | DM-Karte „Frage + Online-Checkliste“ + „in wenigen Minuten dein Startseiten-Entwurf“ |
| Untertitel | 8 | Sync-Stichproben oben |
| Fakten / Bibel / Lauf | 9 | unverändert |
| Look vs. Folge 8/9 | 8 | konsistent; dunkles Claude-Fenster 16,75–18,75 s wirkt leer-ish, aber ruhig |
| Caption / Replies | 9 | unverändert (R1) |
| Scroller-Test | 8 | Textwand 17–19 s weg; 16,75–18,75 s viel dunkle Fläche = leichtes Restrisiko |

**Gesamtnote: 8/10 · BESTANDEN** (kein K.-o., alle Kriterien ≥ 8, alle 3 Tickets erledigt).

## Optionale Hinweise (kein K.-o., keine Pflicht-Tickets)
- 40,25–46 s: DM-Karte überdeckt Board-Titel und obere Ziffernzeile; schöner wäre Karte oberhalb/Board leicht tiefer (firma-design, 5 min).
- 16,75–18,75 s: großes dunkles leeres Claude-Fenster mit sehr kleinem Inhalt (Chips/Chat-Eintrag) – auf dem Handy klein; künftig näher zoomen.
- Optional aus R1 (roter Rahmen um winzige Zeile am Handy-Unterrand bei 30 s) nicht erneut geprüft.
