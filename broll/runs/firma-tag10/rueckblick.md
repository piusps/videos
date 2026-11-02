# Rückblick Folge 10 „Website“ (2026-10-30, Serientag 3)

Slot: Zuerst 12:00, dann 15:00, dann laut Pius' neuer Ansage wieder 12:00. Eingeplant am 2026-10-30 um 11:30 für 12:00, Zernio-Post 6ae471d999bb2a4f132cf0b0. Finale Note 8/10.

## Runden je Stufe
| Stufe | Runden | Noten / Ergebnis |
|---|---|---|
| Autor | 3 | R1 nicht bestanden (5 Kriterien < 8), R2 nicht bestanden (min 6), R3 bestanden (min 8, Schnitt 8,6) |
| Regie | 1 + Nachaufnahme | v1 45,16 s; v2 nur Zeile 4 und CTA neu eingesprochen: 45,43 s Sprache, 132 wpm, Rückblick 6,44 s, „Heute“ 13,84 s |
| Design | Stills, v1–v3, v4 | v4 nach den Final-Tickets |
| Final | 2 | R1 7/10 (K.-o.: Prompt-Volltext lesbar, Board angeschnitten; formal: zwei DMs gleichzeitig), R2 8/10 |

## Ursachen und wohin die Lehre ging
- **Autor, die meisten Runden:**
  - Die Zeitschätzung rechnete Folge 8 mit dem Faktor 1,15 hoch. Die echte Stimme mit Tempo 1,0 spricht langsamer.
  - Gründe waren gegenüber dem Lauf verkürzt („zuerst“, „passt aufs Handy nicht“).
  - Der Weg-Satz ließ den Auftrag weg oder klang zweideutig („Auftrag“).
  - Lösung: R2-01 entschied der Chef über die echte Messung (6,44 s). Regel steht in `firma-autor`.
- **Design, finale Runde 1:**
  - Der Prompt-Screenshot zeigte rund 90 Wörter lesbar.
  - Die Kamerafahrt der Engine zu „Heute“ schnitt den Gründungsplan an.
  - Die Endkarte zeigte zwei DMs, die Engine staffelt sie nur um 0,22 s.
  - Regel steht in `firma-design`.
- **Regie:** Der Anker „Ganz“ traf zuerst das „ganz“ im Hook. Bei geänderten Sätzen wird nur der betroffene Satz neu eingesprochen. Regel steht in `firma-regie`.
- **Chef:** Regie lief parallel zur Autor-Prüfung, Design parallel zur Nachaufnahme, Guide und Cover parallel zum Design. Ohne diese Parallelität wäre 12:00 nicht zu schaffen gewesen.

## Offen / Hinweise
- Der Prüfer hat optional angemerkt: Ab 40,25 s verdeckt die DM-Karte den oberen Board-Rand. Von 16,75 bis 18,75 s ist das Claude-Fenster groß und fast leer.
- Die Engine kann kein Logo-Bild auf der LOGO-Kachel zeigen und kein Wort „ENTWURF“ auf der WEBSITE-Kachel. Das gehört ins Design-Backlog, als Code-Upgrade.
- Das Cover stammt aus dem Engine-Stand v3. Die Kopfzeile und das Handy sind dort gleich wie in v4.
- Zahlen nach dem Posten werden auf Pius' Wunsch nachgetragen.
