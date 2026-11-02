# Prüfung final · Runde 2 · Folge 11 „Gewerbe“ (firma-tag11)
Prüfer: derselbe Prüf-Agent wie Runde 1, 2026-10-30 ~15:35, manuelle Prüfung (Gemini fällt aus). Nichts an den Prüflingen geändert.
Prüfling: `runs/firma-ep/tag11/render/tag3-folge11.mp4` (15:13, + `-handy.mp4`), alt `tag3-folge11-r1.mp4`; Log `runs/firma-tag11/render2.log`.
Belege in `pruefung/final-r2/`: `c2fps-1.jpg` / `c2fps-2.jpg` (ganze Folge, 2 fps), `end-36-42-4fps.jpg` (Endkarte 36–42 s @ 4 fps), `claude-16-20-4fps.jpg` (16–20 s @ 4 fps). Die dort schon liegenden Bögen `cta-36-42s-4fps.jpg` und `websuche-17-19.5s-4fps.jpg` stammen nicht von mir.

## Ticket aus Runde 1
| Ticket | Befund | Beleg | Status |
|---|---|---|---|
| final-R1-01 ≤ 1 neuer Textblock (Endkarte) | episode.json `end.items` = 1 Karte „Frage + Checkliste“ / „13 Punkte · Mensch oder Claude“ (7 Wörter). Erscheint ~39,0 s auf „Frage“, der nächste neue Block „in 10 Minuten · deine Startliste“ erst ~41,0 s (≈ 2 s später). Danach nur noch Wort-Akzente im selben Band. Nie zwei neue Blöcke im selben 0,5-s-Fenster. | end-36-42-4fps Z. 2 Sp. 6 → Z. 4 Sp. 4 | **erledigt** |
| optional: Websuche ≥ 1,2 s | Websuche-Shot 17,5 → 18,75 s ≈ 1,25 s, Liste „13 PUNKTE“ ab ~18,75 s | claude-16-20-4fps Z. 1 Sp. 7 → Z. 2 Sp. 4 | **erledigt** |
| optional: Offline-Symbol, Endkarte D-23 | nicht umgesetzt (kein K.-o.) | c2fps-1 12,0 s · c2fps-2 44,5 s | offen, Backlog |

## Regressionsprüfung (ganze Folge)
| Prüfung | Wert | ok |
|---|---|---|
| Länge | 45,50 s (Handy 45,50 s) | ja |
| Lautheit | −14,0 LUFS, TP −1,2 dBFS, LRA 2,1 (Handy −14,1 LUFS) | ja |
| Mix | Stimme/Musik mindestens 23,3 dB Abstand (render2.log), gleiche Musikstelle 153,15 s | ja |
| Untertitel-Sync | neue STT (ElevenLabs Scribe) der finalen Tonspur: 100 Wörter, wortgleich mit dem Skript, Abweichung Median +0,02 s, max 0,10 s | ja |
| Hook 0–6 s | unverändert zu R1 (Frame 0 Frage + Checkliste mit MENSCH-Stempel, jedes 0,5-s-Fenster ein Ereignis, Board ab 4,75 s) | ja |
| Board | WEBSITE orange „Entwurf“ (nie grün), GEWERBE gold „?“, kein Umsatz-Zähler, Board 6,5–12,5 s ganz im Bild | ja |
| Claude-Akt / Warum / Haken / Übergabe | unverändert, Zeitachse nach 18,75 s identisch zu R1 („9 VON 13“ 31,5 s, „WEN?“ 33 s, „KOMMENTIERE“ 36,5 s) | ja |
| Ortsname / Sidebar / Lesetext | keine neuen Bildinhalte; Endkarte jetzt 7 statt ~17 neue Wörter | ja |
| Cover `runs/firma-tag11/cover.jpg` | „Was muss die KI anmelden?“ + echte Checkliste (Titel ohne Ort, Fließtext unscharf) + MENSCH-Stempel, HUD 5 grau / 6 gold, Maskottchen ganz im Bild, keine Emojis/kein Ort. Klein: leere orange Pille über der Tabelle wirkt wie ein Rest (kosmetisch). | ja (9/10) |

## Bewertung (Stufe final)
| Kriterium | Note | Beleg |
|---|---|---|
| Hook nicht statisch, Frame 0 | 9 | c2fps-1 Z. 1–2 |
| Kamera ruhig, Board/Fenster ganz im Bild | 9 | c2fps-1 Z. 2–3 |
| Kein Lesetext / ein Label gleichzeitig | 9 | Endkarte eine Karte; Websuche 1,25 s |
| Zweite Hälfte ohne Ton verständlich | 9 | c2fps-2 |
| Musik/Ton | 9 | −14,0 LUFS, ≥ 23,3 dB |
| CTA konkreter Wert, Guide hält Versprechen | 9 | „Frage + Checkliste · 13 Punkte · Mensch oder Claude“ + „in 10 Minuten deine Startliste“; Guide S. 2–5 |
| Untertitel | 9 | STT = Skript, ≤ 0,10 s |
| Fakten / Bibel / Lauf | 9 | wie R1 |
| Look vs. Folge 8/9 | 8 | wie R1 (Offline-Symbol fehlt, D-23) |
| Caption / Replies / Cover | 9 | unverändert ok, Cover ok |
| Scroller-Test | 8 | 1 s / 3 s / 10 s wie R1; Mittelteil 16,5–18,75 s jetzt ruhiger lesbar |

**Gesamtnote: 9/10 · BESTANDEN** (kein K.-o., alle Kriterien ≥ 8, Ticket final-R1-01 erledigt).

## Tickets
Keine. Backlog (firma-design, kein K.-o.): Offline-Symbol am WEBSITE-Feld auf „offline.“; Endkarte D-23 (Board-Reihe „7 8 9 ERSTER“ schaut zwischen den Karten durch); Cover: leere orange Pille über der Tabelle entfernen.
Hinweis an firma-chef (wie R1): Board-Nummerierung (LOGO 4, WEBSITE 5, GEWERBE 6, „12 Schritte“) in Folgen 12/13 beibehalten.
