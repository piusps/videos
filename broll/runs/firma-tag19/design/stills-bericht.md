# Folge 19 – Stills-Bericht (Design, 2026-11-01)

Grundlage: episode.json aus gen/gen.py + gen/ep.py, Vorlage = zuletzt bestandene Folge 17 (Endkarte, Recap/Heute-Schnitt, Kamera). Stills: runs/firma-ep/tag19/style-frames/ (Akt-Frames + 0–6 s @4 fps + CTA-Frames 1160–1280).

## Lehre 2026-10-29 (Folge 4)
- [x] Frame 0: ganze Hook-Frage + Ergebnis-Objekt (alte Briefzeile 11,20/5,20 rot gestrichen → neue Zeile „Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“), alles scharf, ~13 Wörter neben der Frage.
- [x] 0–6 s: Ereignis pro 0,5-s-Fenster (Glow, Strich, Wackeln, Marker, Sweep, Spread, Haken, Stempel „GANZ ALLEINE.“ auf führt, Hops auf jedem Hook-Wort, Board-Schnitt auf „Ich“, Recap-Karte auf „verkauft“). Kontaktbogen 0–6 s @4 fps angesehen.
- [x] Hook-Objekt und Plan überlappen nie (hook-9 endet hart auf Ich-0.10, Plan ab Ich-0.05).
- [x] Board-Felder nach Folge-11-Nummerierung.

## Lehre 2026-10-30 (Folge 10)
- [x] Kein lesbarer Prompt-Volltext: Weg-Beat = Anhang-Karte (echter Crop) + eine markierte Zeile „das Web durchsucht“; Ergebnis = ein markierter Satz.
- [x] Board bis „Heute“ ganz, dann harter Schnitt + Pill „HEUTE: VERSANDZEILE“.
- [x] Endkarte: ein DM-Eintrag („PRÜF-PROMPT“), Keyword „Beleg“.
- [x] Keine kleinen roten Rahmen.

## Lehre 2026-10-30 (Folge 11)
- [x] Aus F17 (zuletzt bestanden) abgeleitet.
- [x] Brief-Fließtext weich/gedimmt, im Zoom nur alte Zeile + Logo scharf (nach Still-Fix).
- [x] Firmennamen/Adressen nicht lesbar (Platzhalter des Laufs, Lupen nur auf Betragszeile).
- [x] Hook-Lupen zeigen nur Frame-0-Text.
- [x] Board 3×3 mit 12-Schritte-Untertitel.

## Lehre 2026-10-30 (Folge 12)
- [x] Question-Akt „Als@35-0.14“, Karte vor „Als“+0.1 ganz im Bild.
- [x] Hohe Karten bei y −60 randlos (Brief/Heute), keine Titelstreifen zwischen HUD-Kacheln.
- [x] 10-fps-Streifen an Heute, Claude-Weg, Ergebnis→Entscheidung, Warum, Offen→Als, CTA: kein leerer Frame, kein angeschnittener Plan.

## Lehre Folge 13
- [x] Echte Lauf-Bilder ab dem ersten Frame (keine Platzhalter-Balken außer bewusst im CTA-Prompt-Snip).
- [x] Pop ≤ 0,25 s, danach harte Schnitte (seq/hard aus F17).
- [x] Keine leeren „?“-Slots vor Warum-Karten (why bare, Karten aus Asset).

## Lehre Folgen 14–16
- [x] Maskottchen: in Claude/Warum/Offen/Als unter den Panels ganz frei; in Vollbild-Einschüben (Briefe/Heute) klein unten rechts ganz sichtbar; CTA-Untertitel bei y 1215 über dem Kopf, Augen frei; Flieger zielt auf (540,600), nie über die Augen.
- [x] Aussagende Texte ≥ 58 px (Karten 72–80 px, SHIRTS MIT LOGO 78 px, Zeilen im Claude-Fenster ×3,6 per Push-in).
- [x] Panel-Wechsel = Kamera-Schnitt auf demselben Frame.
- [x] CTA-Board = Stand nach der Folge: WERBEBRIEF + ADRESSEN ohne Haken, DRUCK + PREIS Badge „5ER OFFEN“, GEWERBE Badge „UST ?“ (Badges über Zellnummer, Feldtitel frei).
- [x] Nur eigene Ordner beschrieben.

## F17-Final-Tickets (von Anfang an)
- [x] SHIRTS-Karte ≥ 58 px · [x] Claude-Zeilen ≥ 58 px · [x] keine kleinen Zitate · [x] Chip „gesendet“ = Haken-Icon (sentIcon) · [x] Hook-Abgang hart · [x] keine Mischframes Board→Briefe · [x] Stempel vor dem Panel (Hook-Panel y 650) · [x] CTA-Panel gefüllt (Ergebnis-Karte) · [x] Flieger nie über den Augen · [x] CTA-Untertitel nicht auf dem Körper.

## Faktenschutz
- [x] Lieferzeit nie im Bild; 18,32 € / 4,49 € nie; Claude-„Versand extra“-Satz nie lesbar.
- [x] „NUR DOLLAR“ immer mit „im Lauf: Versandseite“; Briefbeträge nie „Printful-Preise“ genannt.
- [x] Kein Tag-Slam, kein Umsatzzähler, kein „gestern“.

## Still-Fixes dieser Runde
1. Heute-Zoom: Brieftext war lesbar → weich gestellt.
2. „UMRECHNEN = GERATEN“ lief über → zweizeilig.
3. CTA-Badges verdeckten DRUCK/GEWERBE → kleiner, auf Zellnummer gesetzt.

## Engine (rückwärtskompatibel, optional)
- schema.ts/objects.tsx: proof.x (Mitte, Default 540)
- schema.ts/overlays.tsx: end.planeTo, end.sentIcon

## Design-Prüfung R1 (7,0) – Fixes (Belege: runs/firma-ep/tag19/style-frames/, Lauf 2)
- R1-01 K.-o. Maskottchen-Einflug: hook.at.ki = "Wie-0.6" → Landung vor Frame 0, Maskottchen steht ab f0 im Bodenbereich unter dem Panel, Augen frei (sf-0000 … sf-0039 alle 3 Frames).
- R1-02 K.-o. Pill über den Augen: Hook-Hops entfernt, Hook-Panel 940 breit (Unterkante ~1380), captionY 1350 im Hook → „Unternehmen“ liegt über der Kopfoberkante (sf-0027/0030/0033/0036).
- R1-03 Zeilenreste: Crops oben papierweiß abgeschnitten (LCUT_T), Haken neben Zeile 2 statt über „ich“ (sf-0000, sf-0700).
- R1-04: off-5 nur EINKAUF ? (Einkaufspreis@32), off-6 + STEUER ? (Umsatzsteuer-Status), off-7 STEUER-Chip kippt −7° und wächst 12 % (Status+0,85), zurück bei +1,25 → Ereignisse 33,33 / 34,18 / 34,58 / 35,01 (sf-0968, 1000, 1026, 1040).
- R1-05: Warum-Panel 1000×700 (statt 800), oben gestrichene Beträge in voller Größe (74 px), darunter weiche Textur + 5 Mini-Briefe, keine Leerfläche (sf-0736 … 0820).
- R1-06: Badges rahmenlos (neues optionales Feld proof.bare), DIN Condensed 66 px, in der Nummernzeile von Feld 2 und 6; alle 9 Feldtitel + GRÜNDUNGSPLAN frei (sf-1180, sf-1195).
- H3: Brief-Fließtext auch ohne Zoom weich (3 px, 35 %), Fächer-Seiten weich (sf-0330).
- Offen (Hinweise): H1 Prompt-Snip-Balken, H2 Gesichts-Überstrahlung, H4 STEUER-Panel im Als-Akt – nicht geändert.
