# Design-System Firma-Serie (Stand 2026-10-26, Ausgang: Tag 3 v8)

Alles hier ist der **Ist-Stand**. Was sich gegen Referenzen als schwächer erweist, kommt ins Backlog und wird hier erst nach Umsetzung geändert.

## Welt
- 3D-Voxel-Welt (TrainerWorld3D-Raum-Look): Holzwand mit Fenstern, runde Bühne mit orangem Rand, grüne Straße mit Grundstücken.
- Agent = orange Block-Figur mit Antenne. Pius' Feedback: „nicht auf so einem geilen Level“ → Welt gilt als Upgrade-Kandidat (siehe Backlog).

## Farben
- Orange `OR` (Superkind), Grün `GREEN` (Erfolg/erledigt), Gold `GOLD` (Ziel), Rot für Dringend, Blau `#3E6FD8` für Kunde.
- Karten: Papier/Creme mit dunkler Kontur, Fenster-Leiste mit drei Punkten (paperWin).

## Schrift
- Rubik 800/900 für Karten, Serif (claudeSerif) für Fenstertitel, PixelKit-Pillen für Captions (gold/grün, ein Wort pro Pille).

## Elemente
- HUD oben: schmale dunkle Leiste „TAG N / 100 · Kasse / 1 Mio €“, erscheint nach dem Hook.
- Schritt-Badge unten mit Nummer und Farbe pro Kapitel.
- Hook-Overlay 2D: „KI BAUT EIN / UNTERNEHMEN / VON NULL / GANZ ALLEINE / TAG N / 100“, Wort für Wort.
- Echte Logos aus `public/logos/` (claude.svg, gmail.svg, outlook.svg …).

## Kamera
- Halte-Positionen mit Bezier-Übergängen über einen erhöhten Zwischenpunkt; Push-ins pro Beat.

## Erklär-Akte und Lesbarkeit (seit 2026-10-28, Tag 1 v7)
- Pro Akt EIN Story-Objekt und EIN Ort; der Ort wechselt höchstens einmal pro Satz (passt zu firma-regie "Fester roter Faden").
- Erklärketten ("so funktioniert es") = 3 Stationen in einem Raum, mindestens 4 s: jede Station erscheint auf ihrem Wort, erst das Bild, ~0.3 s später das Label; laufende Pfeile (wachsende Striche + Lichtpuls) verbinden sie, der Bot steht seitlich und zeigt, kein zweiter Bot ohne Erklärung.
- Kein Lesetext (kein Claude-Bericht als Fließtext): stattdessen eine Karte mit der Kernaussage oder ein Leuchten/Durchstreichen an der vorhandenen Wand.
- Höchstens EIN neuer Text-Sticker gleichzeitig; Labels nie über dem Objekt, das sie benennen, und nie im Untertitelband (~1300–1480 px).
- Labels: weiß mit dunkler Schrift (INK), Plate3D mit glow={0} und rough={1} (matt). Glänzende oder glühende Labels werden unter Lampen und Bloom blass; Farbe kommt über Pfeile und Objekte, nicht über farbige Label-Flächen. Für Erklär-/Kartenshots Blende ~0.1, damit Schrift scharf bleibt.
- Kein GlowRing direkt neben Labels: die Bloom-Aura wäscht die Schrift aus.

## Bekannte Schwächen (Ausgang fürs Backlog)
- Karten kommen teils ohne Inhalt; Mehrwert-Schritte sind gezeichnete Karten statt echter Claude-UI.
- Licht flach, keine Tiefenunschärfe, Figuren steif.
- Frame 1 zeigt die Welt, nicht das Ergebnis.
