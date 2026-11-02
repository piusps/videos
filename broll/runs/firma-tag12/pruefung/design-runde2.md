# Prüfung design · Folge 12 „Betriebe“ · Runde 2 (2026-10-30)

Prüfer: frischer Agent. Angesehen: `runs/firma-tag12/design/runde2-pruefframes.jpg` (0/7,5/9/14,7/15,5/16,0/16,6/18,5/19,5/30,8/32,2/33,0/44 s), `hook-0-6s-4fps.jpg`, Einzelframes sf-0270, sf-0441, sf-0477, sf-0498, sf-0555, sf-0966, sf-1320 sowie zusätzlich gerenderte Stills sf-0221 (7,37 s), sf-0453 (15,1 s), sf-0580 (19,33 s) über `firma-episode-render.mjs --stills` (Hinweis: dieser Lauf hat `runs/firma-ep/tag12/style-frames.jpg` mit diesen 3 Frames überschrieben; die Einzel-PNGs aus Runde 2 sind unverändert). Daten: `episode.json`, `words.json`, `design-backlog.md` (Abschnitt Folge 12), `briefing.md` Z. 24.

## Tickets aus Runde 1

| Ticket | Status | Beleg |
|---|---|---|
| R1-01 Region-Karte ≤ 4 Wörter, ≥ 1,3 s | **erledigt** | sf-0441 (14,7 s): genau „HANDWERK: 50 STATT 38“, 50 grün, 38 grau, keine Einheit/Quelle. Standzeit Chemnitz−0,45 (14,23) → Claude−0,33 (15,56) = 1,33 s |
| R1-02 alle 17 Haken sichtbar, Stempel nicht über Zeilen/Untertitel | **erledigt** | sf-0966 (32,2 s): Stempel BRANCHENVERZEICHNIS bei y≈365–500 über der Tabelle; orange 1–10, 11–16, 18 = 17; 17/19/20 grau; „17 VON 20“. 33,0 s gleich. Kein Fragment im Untertitelband |
| R1-03 keine leere Rückblick-Karte, kein Geisterbild | **erledigt** | sf-0221 (7,37 s): Banner „erst auf Bestellung bestickt“ poppt bereits auf; sf-0270 voll. sf-0477 (15,9) / sf-0480 (16,0): kein Pixel der Region-Karte |
| R1-04 Claude-Akte nicht im Schwarz, Backlog-Upgrade | **teilweise** | Backlog-Eintrag Folge 12 vorhanden (D-23 dimBoard + Verlaufs-Composite). sf-0498 (16,6) gut gefüllt. Aber sf-0555 (18,5) und sf-0580/0585 (19,3–19,5): scharf nur eine Zeile, unteres Drittel des Fensters (y≈1050–1380) reines Schwarz, Rest dunkle Unschärfe → wirkt weiter wie leeres Fenster. „tei geteilt“ weg (Zeile beginnt sauber „Eine Datei geteilt,“) |
| R1-05 GEWERBE offen statt IN ARBEIT | **erledigt** | sf-0270: Feld 6 „GEWERBE OFFEN“, WEBSITE „IN ARBEIT · ENTWURF“; sf-1320: Feld 6 „MENSCH“ |
| R1-06 Plan in Heute-Einstellung ganz oder weg, kein HUD über Titel | **nicht erledigt** | sf-0441 / 15,5 s: Plan bleibt hinter der Region-Karte halb sichtbar (Reihe „BETRIEBE · WERBEBRIEF · ERSTER UMSATZ“ unter der Karte, „ERSTER“ angeschnitten, Feldreste „F +“, „EN“ links/rechts); TAG-3-Badge liegt auf der linken oberen Kartenecke, HUD-Board auf der rechten oberen Ecke |

## K.-o.-Check

| K.-o. | Ergebnis | Beleg |
|---|---|---|
| Ein neuer Textblock gleichzeitig | ok | 14,7 s: nur Region-Karte neu (HEUTE: BETRIEBE steht schon); 30,65 „17 VON 20“, 31,94 BRANCHENVERZEICHNIS nacheinander |
| Karten/Stempel ≤ 4 Wörter | ok | Region-Karte 4; Endkarte wie Folge 10/11 (freigegebenes Muster) |
| Text ≥ 1,2 s | ok | Region 1,33 s; BRANCHENVERZEICHNIS 31,94–33,14 = 1,20 s (knapp) |
| ≤ ~12 neue Wörter/Frame | ok | Frame 0: 10 Wörter; Haken-Tabelle = Muster |
| Frame 1 = ganze Frage + Chemnitz-Karte | ok | Prüfframe 0,0 s |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | ok | hook-0-6s-4fps: Fall 0,27, Landung 0,5, Zoom 1,0/1,27, Liste 1,73, Label 2,27, „100“ 2,5, Pins 3,0, GANZ ALLEINE 3,73, Zoom 4,27, Schrumpfen 4,73, Plan 5,0, Glow 5,5, „aus“ 6,0 |
| Hook-Objekt überlappt nie den Plan | ok | 4,73 s Karte klein, 5,0 s Plan allein |
| Maskottchen ganz / ≤ 1/3 angeschnitten | ok | hook 0,27 (fällt, ganz), sf-0270, sf-0441, sf-1320 |
| Kein Umsatz-Zähler | ok | nirgends |
| Board | ok | NAME (3) / LOGO (4) abgehakt, WEBSITE ENTWURF, GEWERBE OFFEN → MENSCH ohne Haken, BETRIEBE current „?“, WERBEBRIEF, ERSTER UMSATZ (sf-0270, sf-1320) |
| Nichts lesbar (Namen, Personen, Straßen, Tel., Hamburg, Sidebar) | ok | Haken-Spalte nur Quellenart (sf-0966), Datei „Kolonnenshirt testregion chemnitz“ (sf-0580), Prompt geblurrt (sf-0498), kein Sidebar; kein Treffer „Hamburg“ in episode.json |
| Haken 17 Zellen, „17 VON 20“, nie „vier“ | ok | sf-0966 |

**Kein K.-o. verletzt.**

## Noten (design)

| Kriterium | Note | Beleg |
|---|---|---|
| Seite an Seite mit Referenz | 7 | Hook, Board, Region-Karte, Haken, Endkarte auf Folge-11-Niveau. Schwach: 18,5–19,5 s Claude-Fenster zu ~80 % dunkel/schwarz mit einer scharfen Zeile (sf-0555, sf-0580); Region-Karte klebt an/unter dem HUD |
| Lesbarkeit | 7 | R1-02 gelöst. Offen: sf-0441 HUD (TAG-Badge, Board) liegt über Kartenecken; Plan-Fragmente angeschnitten rund um die Karte |
| Keine leere Karte / Platzhalter / Fantasie-UI, echte Logos | 8 | Rückblick-Karte und Geisterbild gelöst; Claude-Stern echt |
| Bewegung | 8 | Hook-Zooms motiviert; bekannte Engine-Grenzen (0,2 s Fahrt nach „Heute“, Mint-Glühen GEWERBE) nur vermerkt |
| Backlog-Upgrade | 8 | design-backlog.md Folge 12: D-23 dimBoard umgesetzt (sf-1320, Plan nur noch schwach durchscheinend), Claude-Verlauf-Composite dokumentiert |

**Gesamt: nicht bestanden** (kein K.-o., aber 2 Kriterien bei 7).

## Tickets

```
TICKET design-R2-01 → firma-design
Kriterium: Lesbarkeit / Referenz · Note: 7/10
Beleg: sf-0441-f441.png (14,7 s), Prüfframe 15,5 s; episode.json overlays partners proof region.png (y 60, w 940)
Problem: Region-Karte liegt unter TAG-Badge und HUD-Board, und der Gründungsplan schaut rundherum angeschnitten durch (R1-06 offen).
Soll: Nur über episode.json (proof y/w/sx/sy/sw/sh, ggf. region.png mit dunklem Vollrand neu erzeugen): Karte beginnt unter dem HUD (Oberkante ≥ y 215, kein Pixel von TAG-Badge/Board auf der Karte) und deckt den Plan vollständig ab, d. h. in den Stichframes 14,3 / 14,7 / 15,5 s ist kein Plan-Feldtext („BETRIEBE“, „WERBEBRIEF“, „ERSTER UMSATZ“, Feldkanten) mehr sichtbar; Text unverändert „HANDWERK: 50 STATT 38“, Standzeit ≥ 1,3 s.
```

```
TICKET design-R2-02 → firma-design
Kriterium: Seite an Seite mit Referenz · Note: 7/10
Beleg: sf-0555-f555.png (18,5 s), sf-0580-f580.png / Prüfframe 19,5 s; claudeShot weg-B (cam 1,55 @ 345/876) und weg-C (cam 1,35 @ 400/990)
Problem: Unteres Fensterdrittel reines Schwarz, sichtbarer scharfer Inhalt nur eine Zeile, Rest dunkle Unschärfe → wirkt leer.
Soll: Nur über episode.json-cam bzw. shots/weg-B.png/weg-C.png: in 18,5 und 19,5 s kein schwarzer Bereich > 15 % der Fensterhöhe (z. B. cam-Mittelpunkt so setzen, dass die markierte Zeile/Anhang-Zeile in der Fenstermitte liegt und darunter Textur/Folgeblock steht, oder höherer Zoom, ≥ 1,8, auf die Markierung); markierte Zeile ≥ 3 % Bildhöhe und nicht angeschnitten („das“/„und“ nicht vom Markierungsrahmen überdeckt).
```
