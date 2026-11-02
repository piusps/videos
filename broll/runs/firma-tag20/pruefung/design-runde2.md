# Prüfung Design (Style-Frames) · Folge 20 „Mit oder ohne Umsatzsteuer?“ · Runde 2

Prüfer: firma-pruefer, 2026-11-01. Grundlage: `design-runde1.md` (7,8; R1-01/02/03, H1–H6) und `design/stills-bericht.md` § „Runde 2“.
Prüflinge: `runs/firma-ep/tag20/style-frames/` (100 Stills), `style-frames.jpg`, `public/firma-ep/tag20/episode.json`; Anschluss gegen `public/firma-ep/tag19/episode.json`, `runs/firma-tag19/regieplan.md`, `runs/firma-tag19/firma-tag19-final.mp4` (nur gelesen).
Gemini nicht genutzt, alles manuell und per Pixelmessung (PIL). 52 Zusatz-Frames selbst gerendert (`--frames=131…1200`), nach `design-r2/eigen/` kopiert; `style-frames/` danach aus Sicherung wiederhergestellt (wieder 100 Dateien, `style-frames.jpg` zurückkopiert).

## Belege (`pruefung/design-r2/`)
- `eigen/` 52 Einzelframes (12,9–16,0 s dicht, 23,47–24,67 s, alle vier harten Schnitte, Rückblick 6,5–10 s, H1 4,37 s)
- `warum-start.jpg` (23,47–24,60 s), `schnitte-heute-ent.jpg`, `schnitte-hak-next.jpg`, `hook-h1.jpg`, `rueckblick-h2.jpg`, `cta.jpg`, `mask-a.jpg`, `mask-b.jpg` (Maskottchen-Durchgang 10,9–44,4 s), `mask-225.png`, `mask-300.png`
- `h1-kopf-131.png`, `r1-03-kopf-f0.png`, `heute-pill-462/474/475.png`, `heute-pill-exit.jpg`, `ent-uebergang-629-vs-632.png`
- `f19-cta-40s.png`, `h4-f19-vs-f20-board.jpg` (CTA-Board F19 vs. F20 nebeneinander)

## Tickets und Hinweise aus Runde 1
| Punkt | Soll | Messung | Urteil |
|---|---|---|---|
| R1-01 HUD | 12,9–15,9 s keine Überlappung, Karte ≥ 20 px unter HUD, Titel ≥ 58 px | 23 Frames 387–480 gemessen. TAG-Plakette Unterkante y 184 (+Schatten ≈ 195), Plan-HUD y 196 (≈ 205). Kartenoberkante unter TAG: 248–282 (Minimum 248 bei 13,6–13,8 s, „heiße“ Karte) → Abstand ≥ 53 px. Unter Plan-HUD: 234–270 (Minimum 234 bei 14,2–15,0 s) → ≥ 29 px. Ab 15,87 s Claude-Rahmen (Rahmen beginnt unter dem HUD). Titel „MIT USt“ Versalhöhe 68 px (≈ 90 px Schrift). Maskottchen unten rechts ganz sichtbar | **erfüllt** |
| R1-02 Warum-Start | ab 23,7 s 91,60 € / 109 € lesbar, keine Platzhalter-Balken | Panel steht schon ab 23,57 s (f707) mit 91,60 € / 109 € (Ziffernhöhe ≈ 70 px) und Betriebs-Kachel; f707–f740 kein grauer Balken | **erfüllt**. Rest: rechts/unten bleibt bis 25,2 s ≈ 50 % der Panelfläche dunkel leer (Ticket-Alternative „≤ 25 %“ nicht nötig, da Beträge + Kachel stehen) → Hinweis H7 |
| R1-03 Frame 0 | ≤ 4 Wörter mit „Vorsteuerabzug“, jede Zeile ≥ 58 px | „Mit Vorsteuerabzug zahlt:“ = 3 Wörter, eine Zeile; Versalhöhe „M“ 43 px (y 749–791) ≈ 60 px Schrift; gleiche Größe bei 4,37 s. Frage, Beträge, Maskottchen in f0 unverändert ganz | **erfüllt** (knapp über Grenze) |
| H1 | Ereignis 4,37 s; jedes 0,5-s-Fenster 0–6 s | f131 (4,37 s): Wertfeld 91,60 € kippt auf Orange gefüllt, sichtbar gegenüber f129. Fenster 4,0–4,5: „führt“-Pop + 4,37; 4,5–5,0: Board-Schnitt 4,85–4,93. Größte Lücke 0,48 s | **erfüllt** |
| H2 + Anschluss F19 | Plaketten im Rückblick, passend zum F19-Ende | f195 (6,5 s) Feld 2 noch mit Haken, f204 (6,8 s) „5ER OFFEN“ steht; f240 (8,0 s) „UST ?“ an Feld 6. F19-Ende (Regieplan B16, Final 40 s): DRUCK „5ER OFFEN“, GEWERBE „UST ?“, BRIEF current „?“, 1/3/4/7 ✓, 5 in Arbeit; Plan-Objekt in F19 und F20 identisch (`done [0,1,2,3,6]`, `wip [4]`, `current 7`) | **erfüllt**, Anschluss korrekt |
| H3 | „19 % teurer.“ ohne Doppel-Leerzeichen | f930/f948 einfach | erfüllt |
| H4 | CTA-Board zeigt lesbar, was erledigt ist | Feld 2: Nummer „2“ frei, „DRUCK + PREIS“ frei, grüne Zelle wie 1/3/4/7, Haken bedeckt (nur Rand des Kreises unter der Plakette). Plan-HUD oben rechts zeigt Feld 2 weiter mit Haken. Gegenüber F19 (bestanden) besser: dort war auch die „2“ verdeckt (`h4-f19-vs-f20-board.jpg`) | lesbar, Grün = erledigt, Plakette = Rest offen. Kein Ticket; schöner wäre Haken sichtbar (Hinweis H8) |

## Regressionen (harte Schnitte) und Maskottchen
| Stelle | Frames | Befund |
|---|---|---|
| Heute → Claude (heute-3 hart bis 15,83) | f456, f474–f480 | sauberer Schnitt 15,83 → 15,87. Aber: Pill „HEUTE: UMSATZSTEUER?“ schrumpft 15,80–15,83 s auf ≈ 15 px Schrifthöhe (unlesbarer Rest, 2–3 Frames, `heute-pill-474.png`) → H9 |
| Entscheidung (ent-0 / ent-1 hart bis 20,98) | f600–f632 | Schnitte sauber, kein Zwischenbild. 20,97–21,00 s (f629/f630) liegt unter der Tafel noch ein zweiter Panelrand (Doppelrahmen ≈ 40 px, `ent-uebergang-629-vs-632.png`), ab f632 weg → H10 |
| ent-5 hart bis 23,525 | f704–f709 | sauber: f706 Tafel, f707 Warum-Panel |
| Haken (hak-3 hart bis 34,35) | f1028–f1033 | sauber; 34,43 s „Als Nächstes“-Karte poppt klein ein (Animation, 1 Frame), normal |
| Als Nächstes (next-3 hart bis 37,59) | f1125–f1130 | sauber; 37,67 s CTA |
| Maskottchen ganzer Film | alle 100 Stills + 52 eigene | nirgends > 1/3 bedeckt, Augen überall frei. Rückblick: Pills „Shirts“/„auf“ < 10 % an Arm/Unterkante (`mask-225.png`, `mask-300.png`). CTA 37,7–44,4: Untertitel-Pills enden an der Kopfoberkante, Augen frei. 0,9–4,85 s ganz weg (wie R1). Gesicht weiter überstrahlt (Alt-H6) |

## Fakten
- Shot 08 (25,6 s, f768): nur 91,60 € und 109 € lesbar, Kopfzeilen unlesbar klein ✓
- Shot 10 (31,0–31,6 s): nur „19 % teurer.“ ✓
- Shot 04 (33,2–34,4 s): nur „mindestens fünf Jahre“ ✓
- Claude-Fenster: nur Kopf „Claude“, keine Sidebar, keine Namen; Websuche-Snip oben unlesbar ✓
- „KEINE STEUERBERATUNG“: Marker im Snip 15,87–17 s und Bauchbinde 29,5–33,7 s, nicht auf dem Maskottchen ✓
- Rechnung: 17,40 € = 109 × 19/119 ✓; 109 / 91,60 = 1,19 ✓

## Noten
| Kriterium | Note | Kurzbeleg |
|---|---|---|
| Frame 0 / Hook 0–6 s | 9 | Kopf 3 Wörter ≈ 60 px, Ereignis 4,37 s sichtbar, größte Lücke 0,48 s |
| Maskottchen (K.-o.-Durchgang) | 9 | nirgends > 1/3, Augen frei, auch CTA |
| Lesbarkeit / HUD | 9 | Abstand ≥ 29 px (Plan) / ≥ 53 px (TAG) in 12,9–15,9 s |
| Text-Regeln | 8 | alle Blöcke ≤ 4 Wörter, ≥ 58 px; Kopf knapp (≈ 60); Pill-Rest 15,80–15,83 (H9) |
| Keine leere Karte / kein Platzhalter | 8 | Beträge ab 23,57 s, keine Balken; Panel halb leer bis 25,2 s (H7); CTA-Balken (Alt-H5) |
| Fakten / Datenschutz / Disclaimer | 9 | alle Freigaben eingehalten |
| CTA + Board-Stand | 8 | Stand korrekt, Nummer frei, Haken Feld 2 verdeckt (H8) |
| Look + Serienanschluss | 9 | Rückblick-Plaketten wie F19-Ende, gleiche Bildsprache |
| Regressionen harte Schnitte | 8 | vier Schnitte sauber; Doppelrahmen 20,97–21,00 s (H10) |

**Gesamtnote 8,6 / 10.** Kein Kriterium unter 8, kein K.-o. verletzt.

## Urteil
**Bestanden (Runde 2).** Weiter zum vollen Render. Keine Tickets.

## Hinweise (nicht blockierend, im finalen Prüfgang nachsehen)
- H7 Warum 23,57–25,2 s: rechts neben der Betriebs-Kachel ≈ 50 % Panelfläche leer, bis der Beleg auf „Vorsteuerabzug“ kommt. Optional: Panel bis dahin kompakter.
- H8 CTA: „5ER OFFEN“ bedeckt den Haken von Feld 2. Optional Plakette unter die Feldnummer oder Haken links neben die Plakette, damit „erledigt + Rest offen“ ohne Farbcode lesbar ist.
- H9 15,80–15,83 s: Rest der HEUTE-Pill schrumpft unlesbar klein; im Final-Video prüfen, ob es als Flackern auffällt, sonst Pill hart mit dem Schnitt beenden.
- H10 20,97–21,00 s: Doppelrahmen unter der Entscheidungs-Tafel (2 Frames); im Final-Video prüfen.
- Alt-H5 (graue Balken über „Erfinde nichts.“ 40,3–41 s) und Alt-H6 (Gesicht überstrahlt) unverändert.
