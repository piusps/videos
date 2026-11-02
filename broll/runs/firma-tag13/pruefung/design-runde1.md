# Prüfung Design · Folge 13 „Werbebrief“ · Runde 1 (Style-Frames)

Prüfer: firma-pruefer (frischer Agent), 2026-10-30. Geprüft: `public/firma-ep/tag13/episode.json`, `runs/firma-ep/tag13/style-frames.jpg` + `style-frames/*.png`, `pruefung/hookcheck/hook-0-6s-4fps.jpg`, `pruefung/design-uebergaenge/*.jpg`. Maßstab: regieplan.md, beats.json, script.txt, Tagesbriefing 2026-10-30, Folge 12 + Folge 9 Style-Frames, LAUF.md.

## Noten je Kriterium (bewertung.md · design)

| Kriterium | Note | Beleg |
|---|---|---|
| Seite an Seite mit Referenz (Licht, Tiefe, Farben, Fokus) | 8 | Gleicher Look wie F12/F9 (Board, HUD, Endkarte mit dimBoard, Papier-Claude-Fenster). Echter Brief als Story-Objekt (sf-0000, sf-0486) ist stärker als F12-Karte. Abzug: Heute-Beat sieht flach aus (s. u.). |
| Lesbarkeit (≥ 3 % Höhe, nichts überdeckt, nichts angeschnitten) | 8 | Karten/Stempel groß und klar (sf-0940, sf-0690). Fußzeile „laut Claude · keine Rechtsberatung“ und Unterzeilen ~1,5 % Höhe – von der Regie bewusst klein/gedimmt, Serienstandard, akzeptiert. Kurz 13,6–13,8 s: Pill „HEUTE: WERBEBRIEF“ liegt über dem alten Titel „SHIRTS MIT LOGO“ (sf-0410, heute-10fps 13.7). |
| Keine leere Karte / kein Platzhalter / keine Fantasie-UI; echte Logos | **6** | (a) Heute-Beat 13,5–~15,1 s: Brief ist ein selbstgezeichneter Platzhalter – graue Balken, leeres rotes Betreff-Kästchen, kein echter Text (sf-0410 @13,67 s, sf-0440 @14,67 s, heute-10fps 13.5–14.5). Regie-Hinweis 2: „Brief nur aus 04-brief-word.png“. Echter Brief erst ab sf-0455 (15,17 s). (b) Warum 24,3–25,9 s: drei leere „?“-Karten ~1,6 s (sf-0760, warum-10fps 24.4–25.3). Logo Kolonnenshirt = Lauf-SVG, ok. |
| Bewegung (Kamera mit Absicht, keine Ruckler/harten Sprünge) | 7 | Blasses Quadrat 1–2 Frames bei 13,7 s (heute-10fps 13.7, auf dem Brief) und 24,5 s (warum-10fps 24.5, auf Karte 2) – im 10-fps-Bogen klar sichtbar, also im Video als Flackern. Board → Platzhalter-Brief springt bei 13,5 s hart ein (heute-10fps 13.4→13.5). Sonst ruhige Fahrten. |
| Mindestens ein Backlog-Upgrade umgesetzt | 7 | `firma-design/references/design-backlog.md` hat keinen Abschnitt Folge 13; neu sichtbar sind Hook-Stapel mit Streichungen und Brief-Fahrt, aber nicht als Upgrade belegt. Offener Engine-Punkt „Status MENSCH“ (GEWERBE) weiter offen (Board zeigt nur „GEWERBE OFFEN“, sf-1120). |

## K.-o.-Liste (alle geprüft)

| Punkt | Ergebnis | Beleg |
|---|---|---|
| Frame 0: ganze Frage + Ergebnis-Objekt | ok | sf-0000: Frage komplett, echter Brief, Stapel E-MAIL/ANRUF |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | ok | hookcheck: Streichung E-MAIL 0,73, ANRUF 1,27, Logo-Rahmen 2,00, Ikonen dimmen 2,27, Kernzeile 2,73, Haken 3,00, GANZ ALLEINE 3,73, Brief raus 4,27, Board 4,50, Hüpfer 4,73/5,27, TAG-Slam 5,73/6,00 |
| Hook-Objekt überlappt nie Gründungsplan | ok | 4,27 Brief klein allein, 4,50 Board ohne Brief |
| „TAG 4“ Einblender + HUD | ok | Slam 5,73–6,00; HUD-Badge ab Rückblick (sf-0200), wie Folge 9 |
| Board PRODUKT+KUNDE, DRUCK+PREIS, PARTNER+NAME, LOGO 4, WEBSITE 5 Entwurf, GEWERBE 6 nicht grün, BETRIEBE erledigt, WERBEBRIEF aktuell | ok | sf-1120/sf-0380; episode.json plan done [0,1,2,3,6], wip [4], current 7 |
| Kein Umsatz-Zähler | ok | keiner in Frames/episode.json |
| ≤ 1 neuer Textblock, Karten ≤ 4 Wörter, Text ≥ 1,2 s, kein Frame > ~12 neue Wörter | ok | Frame 0 = Frage + 2 Labels (Serienausnahme); Warum-Karten nacheinander; Endkarte zwei Blöcke nacheinander |
| Maskottchen ganz oder ≤ 1/3 angeschnitten | ok | sf-0690/1080 ganz; sf-0760/0940 hinter Karte ≤ 1/3; Drop-in 0,27 s hinter Frage nur durchlaufend (sf-0008) |
| Keine Betriebs-/Personennamen, kein Hamburg, keine Sidebar/Mailadressen | ok | Anhang nur als Karte; Empfänger = Platzhalter „[Firmenname laut Impressum]“ (sf-1080); episode.json ohne Treffer |
| Stempel aus dem Lauf | ok | DER BRIEF. / FÄLLT GANZ WEG / OHNE EINWILLIGUNG ERLAUBT / KEIN KONKRETER GRUND / bei keinem der 5 – alle in LAUF.md |
| Untertitel = Skript | ok | Stichproben „Ich probier das“, „Tag 4“, „Werbe-Mail braucht“, „Anruf braucht Anlass“, „deinen eigenen Briefentwurf“ |
| Gedimmte Zeile im Warum | ok | sf-0760/0940 |
| Falsches/selbstgemaltes Logo; Text ≠ Stimme | ok | – |

**Keine K.-o.-Verletzung.**

## Bekannte offene Punkte des Designers
- **Blasses Quadrat 13,7 s / 24,5 s:** gefährdet das Bestehen – sichtbar im Übergangsbogen, drückt „Bewegung“ unter 8. Muss vor dem vollen Render weg (Ticket 2).
- **Warnung „recap act 9,60 s“:** gefährdet nicht. Die Regel misst den gesprochenen Rückblick („Die“ → „Betriebe.“ = 6,26 s ≤ 6,5 s), „Heute“ startet 13,52 s ≤ 14,5 s. Die Engine-Zahl zählt Hook-Ende + Heute-Karte mit.

## Urteil
**Nicht bestanden** (Runde 1). Kein K.-o., aber „Platzhalter“ 6, „Bewegung“ 7, „Backlog-Upgrade“ 7. Gesamteindruck 7/10.

## Tickets

```
TICKET design-R1-1 → firma-design
Kriterium: Kein Platzhalter / keine Fantasie-UI · Note: 6/10
Beleg: sf-0410 (13,67 s), sf-0440 (14,67 s), design-uebergaenge/heute-10fps.jpg 13.5–14.5
Problem: Im Heute-Beat ist der Brief ~1,6 s ein selbstgezeichnetes Blatt mit grauen Balken und leerem Betreff-Kästchen statt des echten Briefs; dazu überdeckt die Pill kurz den alten Titel „SHIRTS MIT LOGO“.
Soll: Ab dem ersten Frame, in dem der Brief erscheint (13,5 s), ist es 04-brief-word.png (Text als unscharfe Textur, Betreff-Rahmen auf dem echten Betreff); Produkt-Karte ist weg, bevor die Pill einfliegt; kein Frame zeigt Balken-Platzhalter.
```

```
TICKET design-R1-2 → firma-design
Kriterium: Bewegung (keine Ruckler) · Note: 7/10
Beleg: design-uebergaenge/heute-10fps.jpg 13.7, warum-10fps.jpg 24.5
Problem: Blasses Quadrat für 1–2 Frames auf dem Brief (13,7 s) und auf Warum-Karte 2 (24,5 s), im Video als Flackern sichtbar; dazu harter Sprung Board → Brief bei 13,5 s.
Soll: Frame-genauer Übergangsbogen (30 fps) 13,3–14,0 s und 24,2–24,8 s ohne Fremdfläche; Board → Brief als Fahrt/Überblendung ≥ 6 Frames.
```

```
TICKET design-R1-3 → firma-design
Kriterium: Keine leere Karte · (Teil von Note 6)
Beleg: sf-0760 (25,3 s), warum-10fps.jpg 24.4–25.3
Problem: Drei leere „?“-Karten stehen ~1,6 s, bevor Karte 1 kommt.
Soll: Bis „braucht“ (25,93 s) entweder nur Pill + Brief-Miniatur + Fußzeile ohne leere Slots, oder Slots höchstens als dezente Umrisse ≤ 0,5 s.
```

```
TICKET design-R1-4 → firma-design
Kriterium: Mindestens ein Backlog-Upgrade umgesetzt · Note: 7/10
Beleg: ~/.claude/skills/firma-design/references/design-backlog.md (kein Abschnitt Folge 13)
Problem: Kein Upgrade für Folge 13 benannt und belegt.
Soll: Abschnitt „Folge 13“ im Backlog mit mindestens einem umgesetzten Upgrade + Vorher/Nachher-Frame (z. B. Hook-Stapel mit Streichungen oder echter Brief als Fahrt-Objekt; besser: Board-Status MENSCH für GEWERBE).
```
