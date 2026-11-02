# Prüfung design · Runde 1 · Folge 11 „Gewerbe“ (firma-tag11)

Prüfer: frischer firma-pruefer-Agent, 2026-10-30. Stufe design (Style-Frames/Stills, kein voller Render), regie nur soweit im Bild relevant.
Geprüft: `public/firma-ep/tag11/episode.json`, alle 6 Dateien in `public/firma-ep/tag11/shots/` (einzeln angesehen), `runs/firma-tag11/design/stills/01–12 + vergleich-brett.jpg`, `pruefung/hookcheck/hook-0-6s-4fps.jpg`, Style-Frames `runs/firma-ep/tag11/style-frames/`. Selbst gezogen: `/tmp/pr11/` Frames 4, 8, 12, 130–158 (alle 4 Frames), 700, 980 (`node scripts/firma-ep-frames.mjs … --scale=0.5`, 30 fps).
Maßstab: Tagesbriefing 2026-10-30 (alle Regeln K.-o.), briefing.md, regieplan.md, beats.json, script.txt, Referenz Folge 10 (Vergleichsbrett), design-backlog.md.

## Messwerte
| Messung | Wert | Soll |
|---|---|---|
| Ortsname/HmbBfDI/Bezirksamt/Handelskammer/25 € in shots/ (Sichtprüfung aller 6 PNG) + `checkliste-text.txt` gegen gezeigte Spalten | 0 Treffer im Bild (HmbBfDI nur in Spalte „Quelle“, die nie gezeigt wird) | 0 |
| Sidebar, Personennamen, Mails | keine gesehen | 0 |
| Hook-Textkarten („Lupen“) 0–4,5 s, Standzeit je | `overlays` partners/proof: macht→das@1.5 ≈ 0,55 s, das@1.5→KI ≈ 0,45 s, KI→Tage ≈ 0,5 s, Tage→ganz ≈ 0,7 s | jeder Text ≥ 1,2 s; Regieplan 0,43–3,33: „kein neuer Text“ |
| Lesbare Wörter (ohne Untertitel) neu im Frame | 07-entscheidung ≈ 50 (Band 5 + Checklisten-Fließtext ≈ 45, Schrift ≈ 30 px); 08-warum ≈ 70 (Checkliste ≈ 20 px); 10-haken: 13 fette Punkt-Titel ≈ 50 Wörter + Fließtext halb lesbar | ≤ ~12 |
| Hook 0,5-s-Fenster ohne Ereignis | keins leer; 4,5–5,0 s: Checkliste schrumpft (4,47–4,73), Board ein 4,87 → Ereignis da; 5,0–5,5 s nur Board-Aufhellung + Untertitel (dünn) | jedes Fenster ein Ereignis |
| Hook-Objekt ∩ Gründungsplan | 4,73 s Checkliste weg, 4,87 s Board ein → keine Überlappung | nie |
| Maskottchen | 0,27 s (Frame 8): von oben eingefallen, ≈ 2/3 außerhalb; 35,33 s (11): ≈ 30 % unten weg; sonst ganz | ganz oder ≤ 1/3 |
| Doppelter Stempel | 4,47 s (Frame 134): zwei MENSCH-Stempel gleichzeitig (eingebrannt in check-hook/liste-ganz + Lupen-Stempel) | genau einer |
| Board-Anschnitt | 03-heute 15,67 s: Rahmen links (x≈0) und rechts (GEWERBE-Kachel x≈1075) angeschnitten, HUD-Minibrett überdeckt rechte obere Board-Ecke | Board ganz im Bild, HUD frei |
| Abstände neue Textblöcke ab 5 s (Regie-Messung, nachgerechnet an episode.json) | 13 PUNKTE 18,61→19,84 = 1,23 s; PFLICHT AB BEGINN 25,78→27,52 ≈ 1,7 s; ZUERST GEWERBE + Kette ab 27,67 (5 Wörter in einem Block) | ≥ 1,2 s, ≤ 4 Wörter |

## Bewertung je Kriterium

| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Seite an Seite mit Referenz (Licht, Tiefe, Farben, Fokus; Look = Folge 8/9/10) | 7 | Hook, Board, Warum, Haken, CTA im gleichen Look wie F10 (vergleich-brett). Claude-Lauf-Akt deutlich schwächer: 04 (Anhang-Karte klein, ~40 % des Fensters schwarz), 05 (3 Links schwimmen im schwarzen Fenster), 06 (Datei-Karte als Streifen, 70 % schwarz). Bekannt offen im Backlog (Folge 7: „ClaudeShot fit“). |
| 2 | Lesbarkeit / nichts angeschnitten / nichts überdeckt HUD | 5 | 03: Board links+rechts angeschnitten, HUD liegt auf Board-Ecke. 06: Datei-Karte links (Icon) und rechts („…erster verk“) abgeschnitten. 07: rechte Spalte „Du reichs / Claude k / Tätigkeit“ abgeschnitten, Band „…Gewerbeanmeldung“ stößt an den Rand. 10: Phase-2-Überschrift „(nach der Steuernummer, vor“ abgeschnitten, Punkt 7 unten aus dem Fenster. 10/980: Pill „HAKEN“ klebt am/überdeckt „Claude“-Titel. MENSCH-Stempel überdeckt Wer-Spalte in liste-ganz („…st ein und zahlst“, „…ann den“) und „Tätigkeit z. B.“ in allen Checklisten-Frames. |
| 3 | Keine leere Karte / kein Platzhalter / keine Fantasie-UI / echte Logos | 7 | Logos echt (Claude-Stern). Leere schwarze Fensterflächen 04/05/06. Lokal gerenderte .docx steckt in 05b/07/10 in einem „Claude“-Fenster – Regie verlangt „keine claude.ai-Pixel“; Rahmen suggeriert Claude-UI (vertretbar als Serien-Papierfenster, aber knapp). |
| 4 | Bewegung (Kamera mit Absicht, keine Ruckler/Sprünge) | 7 | Maskottchen-Einfall von oben 0,27 s (≈ 2/3 außerhalb). Doppelstempel 4,47 s (Glitch). Datei-Shot Zoom 1,85 schneidet Karte. Sonst ruhig, Board-Fahrt sauber. |
| 5 | Backlog-Upgrade umgesetzt | 7 | Hook-Lupen (Antwort auf F8-Lehre „großes Ereignis pro Beat“) und 9-Kachel-Board mit Paaren sind neu, aber nicht im design-backlog.md dokumentiert; die Lupen brechen zudem die Textregel (s. 6). |
| 6 | Textregeln Tagesbriefing (ein Block, ≤ 4 Wörter, ≥ 1,2 s, ≤ ~12 neue Wörter) | **4 · K.-o.** | Hook-Lupen je 0,45–0,7 s mit 5–8 lesbaren Wörtern („Mensch / Du reichst ein und zahlst.“, „Mensch / Konto und Absenden nur“, „2. ELSTER-Konto + Fragebogen zur steuerlichen Erfassung“) = Text < 1,2 s, gegen Regieplan „kein neuer Text“. 07 und 08: Checkliste in Lesegröße (≈ 45–70 Wörter Fließtext). 10: 13 Titel lesbar. |
| 7 | Hook (Frame 0, Ereignisse, Überlappung, Maskottchen) | 6 | Frame 0 ✓ (ganze Frage + Checkliste + MENSCH, Maskottchen ganz). Ereignisse in jedem Fenster ✓ (4,5–5,0 knapp über Schrumpfen + Board-Einflug, 5,0–5,5 dünn). Keine Überlappung ✓. Aber: Ereignisse 1,0–3,3 s sind Text-Lupen (Regelbruch), Maskottchen 0,27 s zu 2/3 außerhalb, Doppelstempel 4,47 s. |
| 8 | Schwärzungsbalken „1. Gewerbe ▇▇ anmelden“ | 5 | 01/08/check-hook: fast schwarzer Balken bündig an „anmelden“, ohne Abstand → liest sich als „zensiert, hier wird etwas versteckt“ und zieht genau den Blick auf die Stelle. 07: unter der gelben Markierung wird der Balken olivbraun (Highlight liegt darüber) → wirkt wie Druckfehler/Fleck. Dazu großes weißes Loch unter dem Titel (papierweiße Abdeckung), in dem nur der Stempel sitzt – sauber genug, weil der Stempel es füllt. |
| 9 | Board (WEBSITE nie grün, GEWERBE current, Rest danach, Paare lesbar, kein Zähler) | 8 | ✓ WEBSITE orange „IN ARBEIT / ENTWURF“, GEWERBE gold mit „?“, BETRIEBE/WERBEBRIEF/ERSTER UMSATZ dunkel, Paare „PRODUKT + KUNDE“ usw. gut lesbar, kein Umsatz-Zähler, HUD 4 grün / 5 grau / 6 gold konsistent. Schwächen: Kachel 5 trägt groß „ENTWURF“, „WEBSITE“ nur klein (≈ 25 px) – Neuer liest „5 ENTWURF“; „12 SCHRITTE“ über 9 Kacheln (durch Paare erklärbar). |
| 10 | Bild zeigt, was gesagt wird (Beat für Beat, words.json) | 7 | ✓ Rückblick, „Heute: anmelden“, „angehängt“, „13 Punkte“, „Word-Checkliste“, „Als Erstes das Gewerbe“, Warum-Karte, Kette auf „Die anderen Schritte bauen darauf auf“, „9 VON 13“ auf „nur“, Übergabe-Frage, CTA. ✗ „offline“ (12,5 s) ohne sichtbares Offline-Symbol (Regieplan). ✗ „Websuche“ zeigt nur 3 Links, kein Such-Moment. ✗ „Als Nächstes“: Board mit BETRIEBE „?“ fehlt (Regieplan, Board-Absatz). ✗ Haken: Punkt 7 nicht im Bild, „9 VON 13“ am Bild nicht nachzählbar (8 orange Rahmen sichtbar). Kettenkacheln „2/3/4“ kollidieren mit Checklisten-Nummern (3 = Kleinunternehmer, 6 = LUCID) und Board-Nummern. |

„LfSt Bayern“ / „Finanzamt BW“ (05): kein K.-o.; inhaltlich unauffällig, wirkt aber zusammen mit dem leeren Fenster wie eine zufällige Linkliste statt „Websuche“.

## K.-o.-Check
| K.-o. | Ergebnis |
|---|---|
| Hamburg / HmbBfDI / Bezirksamt / Handelskammer mit Ort / 25 € in Frame oder Shot | bestanden (0) |
| Sidebar, Namen, Mails | bestanden |
| Falsches/selbstgemaltes Logo | bestanden |
| Text, der etwas anderes sagt als die Stimme | bestanden |
| Höchstens ein neuer Textblock, ≥ 1,2 s, ≤ ~12 neue Wörter | **verletzt** (Hook-Lupen < 1,2 s; 07/08/10 Lesetext) |
| Hook: Frame 0, 0,5-s-Fenster, keine Überlappung | bestanden (Fenster 5,0–5,5 dünn) |
| Maskottchen ganz oder ≤ 1/3 angeschnitten | **verletzt** bei 0,27 s (Einfall von oben, ≈ 2/3 draußen) |
| Board WEBSITE nie grün, kein Umsatz-Zähler | bestanden |
| Board ganz im Bild (Final-Regel, schon hier sichtbar) | **verletzt** in 03 (15,67 s) |

## Gesamt
**Nicht bestanden.** Noten: 7 · 5 · 7 · 7 · 7 · 4 · 6 · 5 · 8 · 7. K.-o. verletzt: Textregel (Hook-Lupen, Lesetext 07/08/10), Maskottchen-Anschnitt 0,27 s, Board-Anschnitt 03.

## Tickets

```
TICKET design-R1-01 → firma-design
Kriterium: Textregeln / Hook · Note: 4/10
Beleg: episode.json overlays[1–5] (partners/proof macht…ganz-0.05); hookcheck 1,00–3,27 s
Problem: Die Hook-Lupen zeigen 0,45–0,7 s lang neue lesbare Sätze aus der Checkliste („Du reichst ein und zahlst.“, „Konto und Absenden nur“, Punkt-2-Titel).
Soll: 0,43–3,33 s kein neuer lesbarer Text außer Untertiteln (Regieplan); die Ereignisse sind nicht-textlich (Zelle 1 glüht, Zelle 2 pulst, Kästchen blinkt, Stempel wackelt, Punch „100“, Licht-Sweep, Kamera-Rutsch). Kontaktbogen 0–6 s @ 4 fps zeigt weiter in jedem 0,5-s-Fenster ein Ereignis, auch 5,0–5,5 s (z. B. Maskottchen-Hüpfer oder GEWERBE-Kachel-Puls).
```

```
TICKET design-R1-02 → firma-design
Kriterium: Textregeln (≤ ~12 neue lesbare Wörter) · Note: 4/10
Beleg: stills/07-entscheidung.png (24,0 s), 08-warum-pflicht.png (26,0 s), 10-haken.png (32,0 s); Hook Frame 0
Problem: Die Checkliste steht in Lesegröße (≈ 45–70 Wörter Fließtext in 07/08, 13 Titel in 10).
Soll: In jedem Frame außer Frame 0 sind ohne Untertitel ≤ 12 Wörter lesbar: Fließtext der Checkliste (Aufgabe-Absätze und Wer-Text) auf ≤ 40 % Deckkraft + Unschärfe ≥ 3 px, scharf bleiben nur Titel Punkt 1 („1. Gewerbe … anmelden“), die Zellenwörter „Mensch“/„Claude“ und die Karte/das Band des Beats; in 10 alle Punkt-Titel ebenfalls weich, nur Nummern + farbige Wer-Zellen erkennbar. Frame 0: gleiche Behandlung des Fließtexts (Frage + Objekt + Stempel bleiben).
```

```
TICKET design-R1-03 → firma-design
Kriterium: Schwärzungsbalken · Note: 5/10
Beleg: stills/01-hook.png, 07-entscheidung.png (Balken olivbraun unter Gelb), shots/check-hook.png, liste-ganz.png
Problem: Der dunkle Balken bündig vor „anmelden“ wirkt wie Zensur, unter der Gelbmarkierung wie ein Fleck.
Soll: Kein dunkler Balken. Entweder (a) Ortswort papierweiß abdecken und „anmelden“ an „Gewerbe“ heranrücken (ein Wortabstand, gleiche Grundlinie) → Titel liest „1. Gewerbe anmelden (zuerst)“; oder (b) neutrale Platzhalter-Pille „Ort“ (#E6E1D8, Text #6B6B6B in der Dokumentschrift, Höhe = Versalhöhe +20 %, je ein Wortabstand links/rechts). Abdeckung wird über allen Markierungen (Gelb, Orange, Rosa) gezeichnet, Farbe ändert sich in keinem Frame. Ortsname in keinem Frame, auch nicht halb.
```

```
TICKET design-R1-04 → firma-design
Kriterium: Lesbarkeit / Board ganz im Bild / HUD · Note: 5/10
Beleg: stills/03-heute.png (15,67 s)
Problem: Fahrt auf GEWERBE schneidet das Board links und rechts an, das HUD-Minibrett liegt auf der Board-Ecke.
Soll: Board-Rahmen in jedem Frame 13,2–15,9 s vollständig mit ≥ 24 px Rand im Bild, kein Überlappen mit HUD-Rechteck (x 885–1045, y 40–200) oder TAG-Badge; Betonung von GEWERBE über Glow/Puls/Pill statt Zoom > Board-Breite.
```

```
TICKET design-R1-05 → firma-design
Kriterium: Look Claude-Akt / leere Fläche / Anschnitt · Note: 7/10
Beleg: stills/04-weg-anhang.png, 05-websuche.png, 06-datei.png (15,9–21,6 s); Backlog Folge 7 „ClaudeShot fit“
Problem: Kurze Shots schwimmen in großen schwarzen Fenstern; die Datei-Karte ist bei Zoom 1,85 links und rechts abgeschnitten.
Soll: Fensterhöhe/Zoom so, dass der Shot ≥ 60 % der Fensterfläche füllt; Datei-Karte komplett sichtbar inkl. Icon und vollem Dateinamen „Kolonnenshirt checkliste erster verkauf“; Websuche-Beat zeigt einen erkennbaren Such-Moment (z. B. das Band scrollt ein + Zähler/Marke „Websuche“ als Teil des echten Bands), nicht drei Links im Schwarz.
```

```
TICKET design-R1-06 → firma-design
Kriterium: Hook-Maskottchen / Bewegung · Note: 6/10
Beleg: /tmp/pr11/f-0008.png (0,27 s), f-0134.png (4,47 s)
Problem: Maskottchen fällt mit ≈ 2/3 außerhalb des Bildes ein; bei 4,47 s sind zwei MENSCH-Stempel gleichzeitig zu sehen.
Soll: Maskottchen in jedem Frame ganz im Bild oder ≤ 1/3 angeschnitten (Einstieg von unten/seitlich oder ab Frame 0 stehend); in jedem Frame höchstens ein MENSCH-Stempel (eingebrannten Stempel aus check-hook.png/liste-ganz.png entfernen und nur als Overlay zeichnen, oder Lupen-Stempel weglassen).
```

```
TICKET design-R1-07 → firma-design
Kriterium: Bild = Gesagtes / Haken · Note: 7/10
Beleg: stills/10-haken.png, f-0980.png (32,67 s)
Problem: Punkt 7 liegt unter dem Fensterrand (nur 8 orange Rahmen sichtbar zu „9 VON 13“), Phase-2-Überschrift abgeschnitten, Pill „HAKEN“ klebt am „Claude“-Titel.
Soll: Alle 13 Punkte mit allen 9 orangen Wer-Zellen im Fenster sichtbar (Kamera weiter raus oder zwei Spalten in der Höhe ausgeglichen); keine abgeschnittene Überschrift; Pill „HAKEN“ mit ≥ 20 px Abstand zum Fenstertitel (z. B. über dem Fenster wie WARUM?).
```

```
TICKET design-R1-08 → firma-design
Kriterium: Bild = Gesagtes · Note: 7/10
Beleg: stills/02-rueckblick-board.png (12,5 s), 11-als-naechstes.png (35,33 s), 09-warum-kette.png
Problem: „offline“ hat kein Bild; die Übergabe zeigt kein Board mit BETRIEBE „?“; Kettenkacheln tragen Nummern 2/3/4, die mit Checklisten- und Board-Nummern kollidieren.
Soll: Auf „offline“ (11,9–12,6 s) erscheint am WEBSITE-Feld ein Offline-Symbol ohne Text; im Übergabe-Beat ist das Board klein sichtbar (WEBSITE Entwurf, GEWERBE gold ohne Haken, BETRIEBE mit „?“), Frage-Karte ganz im Bild (linker Rand nicht angeschnitten, zentriert); Kettenkacheln ohne Ziffern (nur Schloss + Wort). Kachel 5 im Board: „WEBSITE“ als Hauptwort groß, „ENTWURF“ als Etikett.
```

Zur Kenntnis (kein Ticket, Backlog D-23): Endkarte 12-cta – Board schaut zwischen den Karten durch, „ERSTER“ halb vom Ergebnis-Band verdeckt.
