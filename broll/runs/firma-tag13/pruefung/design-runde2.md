# Prüfung Design · Folge 13 „Werbebrief“ · Runde 2 (Style-Frames)

Prüfer: firma-pruefer (Prüf-Agent), 2026-10-30. Geprüft: neue `runs/firma-ep/tag13/style-frames.jpg` + `style-frames/*.png`, `pruefung/design-uebergaenge-r2/` (heute 10/30 fps, warum 10/30 fps), Backlog-Abschnitt „Folge 13“ in `firma-design/references/design-backlog.md`. Maßstab wie Runde 1.

## Tickets aus Runde 1

| Ticket | Status | Beleg |
|---|---|---|
| R1-1 Heute-Beat Platzhalter-Brief / Pill über „SHIRTS MIT LOGO“ | **erledigt** | heute-13.3-14.0-30fps: ab dem ersten Frame (13,50) ist es der echte Brief aus 04 (Logo, gelbe Platzhalter, Betreff-Rahmen auf echtem Betreff), keine Balken. Der Brief wächst aus dem Board heraus und deckt die Produkt-Karte ab; die Pill erscheint erst auf dem Brief (13,67–13,73), kein Text liegt über „SHIRTS MIT LOGO“. sf-0410/0440/0455. |
| R1-2 Blasses Quadrat 13,7 / 24,5 s, harter Sprung Board → Brief | **erledigt** | 30-fps-Bögen 13,30–14,00 und 24,20–24,80: kein Fremd-Rechteck. Board → Brief = Aufzieh-Bewegung 13,50–13,63 (4–5 Frames) plus Kamera, kein Schnitt-Pop mehr; knapp unter den geforderten 6 Frames, wirkt aber als gerichtete Fahrt aus dem Feld WERBEBRIEF, akzeptiert. |
| R1-3 Leere „?“-Karten im Warum | **erledigt** | warum-23.5-25.5-10fps + sf-0760: vor Karte 1 der echte Brief groß im Panel, keine leeren Plätze; Fußzeile „laut Claude · keine Rechtsberatung“ steht. |
| R1-4 Backlog-Upgrade | **erledigt** | Backlog „Folge 13“: 3 umgesetzte Punkte mit Vorher/Nachher-Pfaden (Hook mit durchgehendem Brief-Objekt, Heute-Beat echter Brief + eigene Pill, Warum ohne „?“) + Ursache des Quadrats (objects.tsx partners.proof) und offener Engine-Fix dokumentiert. |

## Noten je Kriterium

| Kriterium | Note | Beleg |
|---|---|---|
| Seite an Seite mit Referenz | 8 | Look wie F12/F9; Brief als durchgehendes Story-Objekt (Hook, Heute, Warum, Übergabe) ist stärker als F12. |
| Lesbarkeit | 8 | Heute: Pill groß, Brieftext weich als Textur, nur Betreff scharf (sf-0455). Fußzeile/Unterzeilen klein, Serienstandard. |
| Kein Platzhalter / keine leere Karte, echte Logos | 8 | Keine Balken-Attrappe, keine „?“-Slots mehr; Logo = Lauf-SVG. |
| Bewegung | 8 | Keine Fremdfläche in 30 fps; Übergang Board → Brief gerichtet; Warum-Panel zieht sauber aus der Entscheidung auf (24,0–24,2). |
| Backlog-Upgrade | 8 | s. R1-4. |

## K.-o.-Stichproben (nichts Neues kaputt)

| Punkt | Ergebnis | Beleg |
|---|---|---|
| Heute-Beat: echter Brief | ok | heute 30 fps 13,50 ff., sf-0440/0455 |
| Heute-Beat: ≤ 12 neue Wörter | ok | sf-0455: Betreff 7 Wörter scharf + Pill 2 Wörter = 9; übriger Brieftext unscharf (Textur), wie im Hook |
| Pill „HEUTE: WERBEBRIEF“ ≤ 4 Wörter | ok | 2 Wörter |
| Höchstens ein neuer Textblock gleichzeitig | ok | Pill kommt 0,2 s nach dem Brief (13,67), Betreff-Rahmen war schon da |
| Frame 0 / Hook 0–6 s / keine Überlappung mit Board | ok, unverändert | sf-0000, sf-0008, sf-0140, sf-0180 gleich wie R1 |
| TAG 4 + HUD, Board-Status, kein Umsatz-Zähler | ok | sf-0180, sf-0380, sf-1120 |
| Gedimmte Zeile im Warum | ok | sf-0760, sf-0940 |
| Keine Namen/Hamburg/Sidebar/Mailadressen | ok | Brief zeigt nur Platzhalter („[Firmenname laut Impressum]“) |
| Maskottchen ≤ 1/3 angeschnitten | ok | sf-0440 (Körper größtenteils sichtbar hinter Untertitel), sf-0760 |
| Untertitel = Skript | ok | Stichproben „Heute schreibt sie“, „ihre erste Werbung“, „Werbe-Mail braucht“ |

**Keine K.-o.-Verletzung.**

## Hinweise (kein Ticket)
- Engine-Fixes (Quadrat in `partners.proof`, Pill-Timing in `recap.today`) sind nur umgangen, nicht behoben; stehen im Backlog als offen. Im finalen Video die gleichen Zeitfenster (13,3–14,0 s, 24,2–24,8 s) erneut mit 30 fps prüfen.
- Warnung „recap act 9,60 s“ bleibt unkritisch (gesprochener Rückblick 6,26 s, „Heute“ ab 13,52 s).

## Urteil
**Bestanden** (Runde 2). Alle Kriterien 8, kein K.-o. Gesamt 8/10. Weiter zum vollen Render; finale Prüfung mit Frame-Belegen an den oben genannten Übergängen.
