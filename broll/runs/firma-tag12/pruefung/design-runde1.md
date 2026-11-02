# Prüfung design · Folge 12 „Betriebe“ · Runde 1 (2026-10-30)

Prüfer: frischer Agent, nur Ausgaben + Maßstab gelesen. Geprüft: `public/firma-ep/tag12/episode.json` + `shots/`, `runs/firma-ep/tag12/style-frames/*.png` (einzeln angesehen: f0, f8, f142, recap-a0, f330, f420, f445, claude f481, a1 f518, f560, f600, f640, f700, f830, f940, f960, f990, end-a8 f1280), `style-frames.jpg`, `runs/firma-tag12/design/hook-0-6s-4fps.jpg`, Wortzeiten `words.json`. Maßstab: Tagesbriefing 2026-10-30, `briefing.md`, `regieplan.md`, Design-Backlog, Referenz Folge 11 `runs/firma-ep/tag11/style-frames.jpg`.

## K.-o.-Check

| K.-o. | Ergebnis | Beleg |
|---|---|---|
| Höchstens ein neuer Textblock gleichzeitig | ok | Frame 0 nur Hook-Frage + „TESTREGION CHEMNITZ“ (wie Folge 10/11 freigegeben); Warum-Pills kommen 25,44 / 27,19 s nacheinander; „17 VON 20“ 30,65 s, „BRANCHENVERZEICHNIS“ 31,94 s |
| Karten/Stempel ≤ 4 Wörter | **VERLETZT** | sf-0445-f445.png: Region-Karte „HANDWERK JE 10.000 EINWOHNER / 50 STATT 38 / SACHSEN · BUND“ = 8 Wörter/Token. Alle anderen ok („BEIM KUNDEN SICHTBAR“ 3, „STELLT EIN · LAUT ANZEIGE“ 4, „erst auf Bestellung bestickt“ 4, „17 VON 20“, „HEUTE: BETRIEBE“) |
| Jeder Text ≥ 1,2 s | ok, knapp | Region-Karte Chemnitz−0,06 → Claude−0,02 = 14,62–15,87 s = 1,25 s (Regie verlangt ≥ 1,3 s); BRANCHENVERZEICHNIS 31,94–33,14 = 1,20 s. Liste-gelb (21,09–21,54 = 0,45 s) ist reine Textur, nicht lesbar (sf-0640) → ok |
| Kein Frame > ~12 neue Wörter (ohne Untertitel) | ok | Frame 0: 10 Wörter. Haken-Tabelle (sf-0940) = 20× dieselbe Spaltenzelle, wird als Muster gelesen, kein Lesetext |
| Frame 1 = ganze Frage + Ergebnis-Objekt | ok | sf-0000-f0.png: „Wie viel Umsatz macht eine KI in 100 Tagen?“ + Karte TESTREGION CHEMNITZ, 20 Pins (15 blau, 5 gelb gezählt) + anonyme Liste |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | ok | hook-0-6s-4fps.jpg: 0,27 Maskottchen fällt, 0,5 Umsatz-Pill/Landung, 1,0–1,27 Zoom Karte, 1,73 Listen-Highlight, 2,27 Label-Zoom, 2,5/3,0 „100“/Zoom gelbe Pins, 3,73 GANZ ALLEINE., 4,27 Zoom, 4,73 Karte schrumpft, 5,0 Plan, 5,5 Plan-Glow, 6,0 „aus“ |
| Hook-Objekt überlappt nie den Gründungsplan | ok | 4,73 s Karte nur noch Daumennagel, 5,0 s Plan allein (sf-0142, sf-0150) |
| Maskottchen ganz im Bild oder ≤ 1/3 angeschnitten | ok | sf-0008 (Fall, ganz im Bild), sf-0445, sf-0640, sf-0830, sf-1280 |
| Kein Umsatz-Zähler | ok | nirgends |
| Board | ok mit Anmerkung | sf-0227/0330: 1–4 abgehakt (NAME in 3, LOGO 4), 5 WEBSITE ENTWURF, 6 GEWERBE → ab „Anmelden“ „MENSCH“ (sf-0445), 7 BETRIEBE current „?“, 8 WERBEBRIEF, 9 ERSTER UMSATZ. Aber GEWERBE trägt „IN ARBEIT“ (siehe Ticket 05) |
| Nichts lesbar: Betriebsnamen, Personen, Straßen, Telefon, „Hamburg“, Sidebar | ok | Liste nur „Betrieb N“ + Balken (sf-0640, hook-karte.png), Top 5 nur Gewerke (sf-0700), Haken-Spalte nur Quellenart (sf-0940); region.png ohne Hamburg-Zeile; Claude-Fenster ohne Sidebar (sf-0481) |
| Haken: genau 17 Zellen, „17 VON 20“, nie „vier“ | ok (Daten), Sicht gestört | episode.json 17 marks = Zeilen 1–16 + 18, Zeile 17/19/20 grau, deckt sich mit liste-text.txt; Pill „17 VON 20“ (sf-0940). ABER sf-0990: Stempel BRANCHENVERZEICHNIS verdeckt Zeilen 2/3/12/13 → nur 13 Markierungen sichtbar (Ticket 02) |
| Stempelwörter aus dem Lauf | ok | GANZ ALLEINE. (Serie), MENSCH, TESTREGION CHEMNITZ, BRANCHENVERZEICHNIS, BEIM KUNDEN SICHTBAR / STELLT EIN · LAUT ANZEIGE (Blatt Top 5 Rang 1, Gründe 2+3), 50/38,4 (Blatt Testregion, Grund 1) |
| Kein „Tag drei“-Slam | ok | nur HUD-Badge TAG 3 |
| Text sagt nichts anderes als die Stimme | ok | 50 statt 38 ist Zusatz, kein Widerspruch; Top-5-Rang 1 = Maler mit Stellenanzeige = „Einer stellt ein“ |

**K.-o. verletzt: 1 (Region-Karte 8 Wörter).**

## Noten (design)

| Kriterium | Note | Beleg |
|---|---|---|
| Seite an Seite mit Referenz (Licht, Tiefe, Farbe, Fokus) | 7 | Hook, Board, Warum, Haken, CTA auf Folge-11-Niveau. Schwächer: drei Claude-Akte sind zu ~85 % schwarze Fläche mit einem dünnen Streifen (sf-0518, sf-0560, sf-0600); Rückblick-Karte „SHIRTS MIT LOGO“ steht leer (sf-0227) |
| Lesbarkeit (≥ 3 % Höhe, nichts überdeckt, nichts angeschnitten) | 6 | sf-0990 Stempel verdeckt 4 der 17 Haken; sf-0445/0420 Plan links angeschnitten („NDUNGSPLAN“, „PRO + KU“), TAG-Badge über Plan-Titel; sf-0560 „tei geteilt“ links abgeschnitten; sf-0960 Fragment „ICI“ zwischen Untertitel-Pills (Stempel taucht hinter den Untertiteln auf) |
| Keine leere Karte, kein Platzhalter, keine Fantasie-UI, echte Logos | 6 | Leere Karte „SHIRTS MIT LOGO“ 7,34–9,69 s (sf-0227); Geisterbild „50·38“ mitten im Claude-Stern (sf-0481, Region-Karte nicht sauber ausgeblendet); Claude-Fenster als leere schwarze Flächen (s. o.). Logo Claude-Stern echt ok |
| Bewegung (Kamera mit Absicht, keine Ruckler/Sprünge) | 8 | Hook-Zooms motiviert; 4,73 s fast leeres Bild (Karte als Daumennagel, sf-0142) als Übergang vertretbar |
| Mindestens ein Backlog-Upgrade umgesetzt | 5 | Kein Eintrag Folge 12 in design-backlog.md; offene Punkte „Claude-Datei-Karte schwimmt im Schwarz / ClaudeShot fit“ (Folge 7) und D-23 (Plan schaut unter Endkarte durch, sf-1280) weiter offen |

**Gesamt: nicht bestanden** (1 K.-o., 4 Kriterien < 8).

## Tickets

```
TICKET design-R1-01 → firma-design (Info an firma-regie: Regieplan Z. 103/141 verlangt die 8-Wort-Karte)
Kriterium: K.-o. Karten ≤ 4 Wörter · Note: K.-o.
Beleg: sf-0445-f445.png, 14,62–15,87 s, shots/region.png
Problem: Region-Karte hat 8 Wörter/Token und steht nur 1,25 s.
Soll: Karte = genau „HANDWERK: 50 STATT 38“ (4 Token; 50 groß grün, 38 groß grau), ohne Zeile „JE 10.000 EINWOHNER“ und ohne „SACHSEN/BUND“ (Einheit + Quelle nur in Caption/Guide); Standzeit ≥ 1,3 s (Regie), Plan dabei ganz im Bild oder ausgeblendet.
```

```
TICKET design-R1-02 → firma-design
Kriterium: Lesbarkeit · Note: 6/10
Beleg: sf-0990-f990.png (33,0 s), sf-0960-f960.png („ICI“-Fragment hinter Untertiteln)
Problem: Stempel BRANCHENVERZEICHNIS liegt über Tabellenzeilen 2/3/12/13 und verdeckt 4 der 17 Markierungen; beim Einblenden erscheint er hinter den Untertiteln.
Soll: In jedem Frame 29,4–33,3 s sind alle 17 orangen Zellen ganz sichtbar (Stempel oberhalb der Tabelle, y < 440, oder unter der Tabelle über „17 VON 20“, nie über Zeilen); Stempel poppt an seiner Endposition auf, kein Pixel davon im Untertitelband y 1380–1520.
```

```
TICKET design-R1-03 → firma-design
Kriterium: Keine leere Karte / Platzhalter · Note: 6/10
Beleg: sf-0227-recap-a0.png (7,34–9,69 s), sf-0481-claude.png (16,0 s)
Problem: Karte „SHIRTS MIT LOGO“ steht 2,3 s mit leerer rechter Hälfte; Region-Karte hinterlässt Geisterbild „50·38“ im Claude-Stern.
Soll: Rückblick-Karte erscheint erst mit Inhalt (Banner „erst auf Bestellung bestickt“ schon bei „verkauft“ oder Karte nur so breit wie Shirt + Titel); ab Claude−0,02 ist kein Pixel der Region-Karte mehr sichtbar (Stichframes 15,9 / 16,0 / 16,1 s).
```

```
TICKET design-R1-04 → firma-design
Kriterium: Referenz-Vergleich + Backlog-Upgrade · Note: 7/10 bzw. 5/10
Beleg: sf-0518, sf-0560, sf-0600; design-backlog.md Z. 39 (Folge 7, „ClaudeShot fit“), D-23; sf-1280
Problem: Claude-Akte zeigen einen dünnen Streifen in einem großen schwarzen Fenster; kein Backlog-Upgrade in dieser Folge umgesetzt/dokumentiert.
Soll: Backlog Z. 39 umgesetzt: Fensterhöhe passt sich dem Crop an, sichtbarer Inhalt (Datei-Karte, Schritte-Zeile, Anhang) füllt ≥ 40 % der Fensterfläche, keine Zeile links angeschnitten („tei geteilt“ weg); Eintrag „Folge 12: umgesetzt“ in design-backlog.md mit Vorher/Nachher-Frame.
```

```
TICKET design-R1-05 → firma-design
Kriterium: Board (Briefing: GEWERBE offen „Mensch“) · Note: 7/10 (unter Lesbarkeit/Inhalt)
Beleg: sf-0227, sf-0330, sf-1280: Feld 6 „IN ARBEIT · GEWERBE“ bzw. „IN ARBEIT GEWERBE MENSCH“
Problem: „IN ARBEIT“ erzählt einen Menschen-Schritt als laufend, Briefing verlangt „offen“.
Soll: Feld 6 zeigt ab Rückblick „OFFEN“ (oder kein Status) + nach „Anmelden“ „MENSCH“, nicht „IN ARBEIT“; WEBSITE bleibt „ENTWURF“.
```

```
TICKET design-R1-06 → firma-design (niedrig, nicht bestehensrelevant allein)
Kriterium: Lesbarkeit · Note: 6/10
Beleg: sf-0420, sf-0445 (13,7–15,9 s)
Problem: Plan links angeschnitten, TAG-3-Badge liegt über dem Plan-Titel, Karte deckt den halben Plan.
Soll: In der Heute-Einstellung ist der Plan entweder ganz im Bild (alle 9 Felder + Titel lesbar) oder ganz weg; kein HUD über dem Plan-Titel.
```

## Nachprüfung Runde 2
Neue Style-Frames bei 0,0 / 7,5 / 9,0 / 14,7 / 15,5 / 16,0 / 16,6 / 18,5 / 19,5 / 30,8 / 32,2 / 33,0 / 44 s plus Hook-Kontaktbogen 0–6 s; alle K.-o.-Punkte erneut.
