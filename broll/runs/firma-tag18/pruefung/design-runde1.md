# Prüfung DESIGN · Folge 18 „Was zahlt sie für das gestickte Shirt?“ · Runde 1

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe design), 2026-11-01. Nichts geändert außer diesem Bericht + Belegen in `pruefung/design-r1/`.
Prüfling: `firma-tag18-final.mp4` (44,50 s, 1080×1920, 30 fps). Maßstab: Folge 17 final R2 (`firma-tag17/pruefung/final-runde2.md`), Folge 13 (Slam).
Gemini nicht genutzt (402 laut Auftrag) → manuell: 10-fps-Durchgang über das ganze Video (`s10-00…11.jpg`, Einzelbilder `f10/`), 30-fps-Streifen ±0,4 s an allen Akt-Übergängen (`s30-uebergang-<t>.jpg`), Hüpfer/Flieger (`s30-hop-8.5.jpg`, `s30-plane-39.4.jpg`), Pixel-Diff Hook 3,5–5,0 s, Vollbild-Montagen `b-*.jpg`, F13-Slam `ref-f13-slam-4.5-7.7.jpg`.

## Noten je Kriterium

| Kriterium | Note | Beleg |
|---|---|---|
| Seite an Seite mit Referenz (Licht, Tiefe, Farben, Fokus) | **7,5** | Hook-Karte und Slam auf F13-Niveau (`s10-00/01`, `ref-f13-slam…`). Schwächer: Maskottchen-Gesicht 7,1–12,0 s und 16–37 s vom Spot ausgebrannt (fast weiß, Augen nur noch Striche; F13 6,6 s orange) `b-6.9-7.5-8.0.jpg`, `b-9.0-10.5.jpg`; Heute 14,0–15,4 s ~40 % leere Creme-Fläche zwischen Shirt und Pill `b-12.5-14.5-15.6.jpg`; Endkarte 40,0–41,3 s untere Panelhälfte leer `s10-10.jpg`. |
| Lesbarkeit (≥ 58 px, nichts überdeckt HUD/Untertitel, nichts angeschnitten) | **6** | Badge „5ER OFFEN“ 37,23–39,95 s verdeckt „+ PREIS“ (Feld 2), „+“ von Feld 3, Nummer „5“ + „IN ARBEIT“ + Oberkante „WEBSITE“ (Feld 5), Nummer „6“ + Oberkante „GEWERBE“ (liest sich „CEWERBE“), halben Haken Feld 4 → `b-38.5-board-crop.jpg`, `b-37.2-38.5-39.7.jpg`. Pill „WARUM?“ 26,7–33,6 s: untere Buchstabenkante hinter Panel-Oberkante `b-29.0-31.6-crop.jpg`. Ergebnis 19,7–23,3 s: „bestickten“ stößt an den rechten Fensterrand `b-21.5-22.5-23.7.jpg`. Karte „Versand: zzgl.“ 33,9–37,2 s schiebt sich unter die HUD-Kachel `b-33.9-34.0-35.7.jpg`. Endkarte 40–44,5 s an beiden Seiten angeschnitten `f10/0421.jpg`. Größen ok: Warum-Unterzeilen ≈ 65–68 px, „erst auf Bestellung bestickt“ ≈ 60 px, Claude-Zeilen ≈ 62–84 px. |
| Keine leere Karte / Platzhalter / Fantasie-UI, echte Logos | **8** | Echte Lauf-Shots 01/07/02; Umbruch „Serienbriefe.do / cx“ ist echt (wie F17). Abzug: Ergebnis-Fenster 19,7 s verliert die Kopfzeile „✳ Claude“ (Shot 01/07 haben sie) → wirkt wie ein anderes Fenster `b-16.1-18.7-19.8.jpg`. Brief 11,9–13,9 s: Adresse/Footer mit **dunklen Balken** geschwärzt (Lehre F11: papierweiß) `b-13.0-brief.jpg`. |
| Bewegung / Schnitte (Absicht, keine Ruckler, Panel+Kamera auf einem Frame) | **6** | 4,917–5,017 s: Kamera schon zurückgezogen (Boden + Maskottchen), Hook-Karte steht noch, Board erst 5,050 → 4 Mischframes `s30-uebergang-4.95.jpg`, `b-4.0-4.9.jpg`. 19,700–19,766: doppelte Fensterunterkante (Geisterrahmen) `s30-uebergang-19.8.jpg`. 33,893–34,026: „Versand: zzgl.“ und Frage-Karte poppen im selben Moment `s30-uebergang-34.06.jpg`. 40,9 s: Untertitel springen von unter den Augen über den Kopf `s10-10.jpg`. Saubere Schnitte: 7,05 / 11,94 / 13,91 / 16,01 / 23,29 / 26,59 / 37,17 / 39,98. |
| Backlog-Upgrade umgesetzt | **8** | D-24 (Shot 01 startet klein) faktisch gelöst: Anhang-Karte ab 16,01 s fensterfüllend (`s30-uebergang-16.08.jpg`); im Backlog aber noch „offen“ → nachtragen. |
| K.-o. design: falsches Logo / Text ≠ Stimme | ok | Kein Logo, Texte decken sich mit der Stimme. |

**Durchschnitt 7,1 · niedrigste Note 6.**

## K.-o.-Liste

| Punkt | Ergebnis | Beleg |
|---|---|---|
| Frame 0: ganze Frage + Ergebnis-Objekt | ✓ Frage zweizeilig + Rechen-Karte „EINKAUF 17 € / REST 0 €“ voll lesbar | `f10/0001.jpg` |
| 0–6 s: jedes 0,5-s-Fenster ein Ereignis | ✓ (knapp): Ereignisse 0,2 / 0,7 / 1,1 / 1,6 / 2,4 / 2,8 / 3,1 / 3,67 / 4,17 / 4,9 / 5,0 / 5,5 / 6,1. Lücke 4,23–4,90 (0,67 s nur Untertitel) ist über die Fenstergrenze verteilt (Pixel-Diff 0,03–0,04) | `s10-00/01`, Diff-Tabelle unten |
| TAG-5-Slam (erste Folge des Tages) | ✓ wie F13: Weißblitz 6,1, „TAG“ leer → „5“ wächst 6,4–6,5, Flug in die Ecke 6,9–7,05 | `s10-01.jpg`, `ref-f13-slam…` |
| Maskottchen ≤ 1/3 verdeckt, Augen frei, keine Untertitel auf Augen, Einschübe ganz/ganz weg | ✓ (knapp): 1,1–4,9 ganz weg; Hüpfer 8,9–9,3 Kopfoberkante ≈ 20–25 % hinter SHIRTS-Karte, Augen frei `s30-hop-8.5.jpg`; CTA 37,17–37,9 zweizeilige Untertitel auf Unterkörper ≈ 30 %, Augen frei; Flieger 39,7–39,9 zwischen den Augen, nicht darauf `s30-plane-39.4.jpg`; Endkarte Untertitel über dem Kopf | `s10-*.jpg` |
| Aussagende Texte ≥ 58 px | ✓ | siehe Lesbarkeit |
| Ein neuer Textblock gleichzeitig, Karten ≤ 4 Wörter, ≤ ~12 neue Wörter | **✗** 33,89–34,03: Karte „Versand: zzgl.“ und Frage-Karte „Stimmt die Versandzeile?“ kommen gleichzeitig (2 Blöcke). Sonst ok (Pill 14,1 → Liste 15,5 = 1,4 s Abstand, kein Überlappen) | `s30-uebergang-34.06.jpg` |
| Panel-Wechsel und Kamera-Schnitt auf demselben Frame, keine Mischframes | **✗** 4,917–5,017 (4 Frames Hook-Karte über zurückgezogener Kamera). In F17 als Backlog toleriert, laut K.-o.-Liste dieser Prüfung aber verletzt | `s30-uebergang-4.95.jpg` |
| CTA-Board zeigt Stand nach der Folge | ✓ inhaltlich (Feld 2 Haken + „5ER OFFEN“, Feld 8 „?“) – aber Badge verdeckt Nachbarfelder (Ticket 01) | `b-38.5-board-crop.jpg` |
| Kein Umsatz-Zähler | ✓ | ganzes Video |
| Keine Namen/Adressen/Sidebar lesbar | ✓ (Platzhalter „[Dein Name]“, Adresse geschwärzt – falsche Technik, Ticket 05) | `b-13.0-brief.jpg` |
| Nur „17 €“, nie 17,15 / 5,75 | ✓ (Brief-Zeile zeigt unscharf 11,20/5,20, kein 5,75) | `f10/0001`, `b-29.0-31.6-crop.jpg` |

Diff Kartenbereich (Mittel |Δ| Graustufe, 30 fps): 3,667 21,6 (Stempel) · 4,167 6,0 (Punch) · 4,233–4,867 0,03–0,13 · 4,900 9,7 (Schnitt).

## Gesamturteil
**Nicht bestanden.** Note **6/10** (Lesbarkeit 6, Schnitte 6), zwei K.-o.-Punkte verletzt (Mischframes 4,92–5,02; zwei Textblöcke 33,89).

## Tickets

```
TICKET design-R1-01 → firma-design
Kriterium: Lesbarkeit · Note: 6/10
Beleg: 0:37,23–0:39,95 · pruefung/design-r1/b-38.5-board-crop.jpg (ep.py Z. 72/76: badge.png w 370, y 775)
Problem: Badge „5ER OFFEN“ (370 px breit) liegt über Feld 2/3/5/6 und verdeckt „+ PREIS“, die Nummern 5 und 6, „IN ARBEIT“ und die Oberkanten von WEBSITE/GEWERBE.
Soll: Badge liegt vollständig innerhalb der Kachel 2 (oder direkt über ihrer Oberkante außerhalb des Rasters); in jedem Frame 37,2–39,95 sind alle 9 Feldnummern und Feldtitel (inkl. „DRUCK + PREIS“) ungestört lesbar; Badge-Schrift ≥ 58 px.
```
```
TICKET design-R1-02 → firma-design
Kriterium: Bewegung/Schnitte (K.-o. Mischframe) · Note: 6/10
Beleg: 0:04,917–0:05,017 · pruefung/design-r1/s30-uebergang-4.95.jpg (ep.py Z. 39 hook-9 bis „Ich+0.03“)
Problem: Kamera ist schon auf Board-Einstellung zurückgezogen (Boden + Maskottchen), die Hook-Karte steht aber noch 4 Frames darüber.
Soll: Hook-Karte verschwindet auf genau dem Frame, auf dem Kamera-Pull-back und Gründungsplan erscheinen; im 30-fps-Streifen 4,8–5,2 s kein Frame mit Hook-Karte + Boden/Maskottchen.
```
```
TICKET design-R1-03 → firma-design
Kriterium: Ein neuer Textblock gleichzeitig (K.-o.) · Note: 6/10
Beleg: 0:33,89–0:34,03 · pruefung/design-r1/s30-uebergang-34.06.jpg, b-33.9-34.0-35.7.jpg
Problem: Karte „Versand: zzgl.“ und Frage-Karte „Stimmt die Versandzeile?“ poppen im selben Moment.
Soll: Erst ein Block (z. B. „Versand: zzgl.“ auf „Als“), der zweite frühestens 1,2 s später (auf „Versandzeile“), oder nur die Frage-Karte; nie zwei neue Textblöcke innerhalb 1,2 s.
```
```
TICKET design-R1-04 → firma-design
Kriterium: Lesbarkeit (überdeckt/angeschnitten) · Note: 6/10
Beleg: 0:26,7–0:33,6 b-29.0-31.6-crop.jpg · 0:19,7–0:23,3 b-21.5-22.5-23.7.jpg · 0:33,9–0:37,2 b-33.9-34.0-35.7.jpg · 0:40–0:44,5 f10/0421.jpg
Problem: Pill „WARUM?“ steckt mit der Unterkante hinter dem Panel; „bestickten“ stößt an den Fensterrand; Karte „Versand: zzgl.“ schiebt sich unter die HUD-Kachel; Endkarten-Panel links/rechts angeschnitten.
Soll: „WARUM?“ ganz sichtbar (≥ 10 px Abstand zur Panelkante oder davor); jede Textzeile im Claude-Fenster ≥ 24 px Innenabstand zum Rahmen; keine Karte überlappt TAG-Badge oder HUD-Kachel; Endkarte mit beiden Seitenrändern im Bild.
```
```
TICKET design-R1-05 → firma-design
Kriterium: Keine Fantasie-UI / Lehre F11 · Note: 8/10
Beleg: 0:11,94–0:13,90 · pruefung/design-r1/b-13.0-brief.jpg
Problem: Empfängeradresse und Footer-Zeile sind mit dunklen Balken geschwärzt (wirkt wie Zensur), Fließtext nur leicht weich (Listen/Footer fast lesbar), Markierung beginnt mitten im Wort („ersand: zzgl.“).
Soll: Abdeckungen papierweiß (keine dunklen Balken), Fließtext auf F11-Niveau weich (Blur ~3 px, ~35 % Kontrast), Markierung umfasst „Versand: zzgl.“ vollständig.
```
```
TICKET design-R1-06 → firma-design
Kriterium: Seite an Seite (Licht) · Note: 7,5/10
Beleg: 0:07,1–0:12,0 b-9.0-10.5.jpg; 0:16–0:37 b-25.5-26.7-27.0.jpg
Problem: Spot brennt die Maskottchen-Front fast weiß aus (Augen nur Striche, Orange weg), deutlich schwächer als F13/F17.
Soll: Maskottchen-Front in allen Akten mit sichtbarem Orange (Gesicht nicht heller als die Hook-Fassung 0,5 s), Augen als klare Rechtecke.
```
```
TICKET design-R1-07 → firma-design
Kriterium: Bewegung / Konsistenz · Note: 6/10
Beleg: 0:19,70–0:19,77 s30-uebergang-19.8.jpg; 0:19,7 b-16.1-18.7-19.8.jpg
Problem: Beim Wechsel auf Shot 02 doppelte Fensterunterkante für 3 Frames und Kopfzeile „✳ Claude“ fehlt danach.
Soll: Shot 01 → 07 → 02 im selben Fensterrahmen mit Kopfzeile; im 30-fps-Streifen 19,4–20,2 s kein Doppelrahmen.
```
Hinweise ohne Ticket: Heute 14,0–15,4 und Endkarte 40,0–41,3 haben viel leere Fläche (Backlog); D-24 im Backlog auf „erledigt (F18)“ setzen.
