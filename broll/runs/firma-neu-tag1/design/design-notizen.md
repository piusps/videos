# Design-Notizen Tag 1 (Vorbau) – "Heute findet die KI ihr Produkt"

Stand 2026-10-26. Nur Welt und Style-Frames gebaut, kein Voll-Render, kein Timing auf Worte.

## Dateien
- `broll/src/components/ShirtWorld3D.tsx`: wiederverwendbare Bausteine für alle Folgen.
  - Räume und Inseln: ShirtRoom, Island (mit ghost für leere Kunden-Slots).
  - Figuren: Agent (der Gründer ist der einzige orange, Partner blau, Kunden in Palettenfarben).
  - Objekte: ShirtStack (mit Zähler am Objekt), PrintMachine, Pallet, Conveyor/Parcel, Laptop, ProductWall/drawProductWall.
  - Overlays und Karten: ClaudePaper (Platzhalter für den echten claude.ai-Screenshot), StepBar 1·2·3, KeywordCard, SeriesHook2D, WordSticker.
  - Texturen: makeWorldTex.
- `broll/src/compositions/FirmaShirtsTag1.tsx`: die Folge. Props `hook` ("produkt" ist Default, "maschine" ist die Alternative) und `keyword` (Default "Keyword" als Platzhalter).
- `broll/src/index-firma1.tsx`: eigener Einstieg.
- `broll/src/Root.tsx`: Composition `FirmaShirtsTag1` registriert, sonst nichts geändert.

## Render
```
cd broll
npx remotion still src/index-firma1.tsx FirmaShirtsTag1 out.png --frame=N --gl=angle
npx remotion still src/index-firma1.tsx FirmaShirtsTag1 out.png --frame=78 --gl=angle --props='{"hook":"maschine"}'
```

## Stills (design/)
| Datei | Frame | Inhalt |
|---|---|---|
| 01-hook-produkt.png | 78 | Produkt-Wand + Serien-Hook |
| 02-hook-produkt-ende-firmenshirts.png | 225 | Wand durchgestrichen, Firmenshirt bleibt |
| 03-schritt-claude-paper.png | 400 | Claude-Paper-Fenster + Schritt-Leiste |
| 04-entscheidung-partner.png | 700 | Partner-Insel, Laufband |
| 05-endkarte-keyword.png | 855 | End-Karte, Keyword-Platzhalter, "Guide per DM" |
| 06/07/08-*maschine*.png | 78/630/700 | Maschinen-Variante (Hook, durchgestrichen, Partner leuchtet) |

Übersichten: `styleframes-uebersicht.png`, `maschine-variante-uebersicht.png`. Die Vergleiche mit claudebyseb liegen in `vergleich/v01…v06`.

## Hängt am Final-Render noch an Wort-Timings und Inhalten
- **Beat-Zeiten:** Alle Zeiten in `B` sind Platzhalter-Sekunden. Sie müssen per `at("Wort", after)` aus words.json verankert werden. Das betrifft auch die crossAt-Verteilung der Produkt-Wand und die Kamera-Holds.
- **Platzhalter-Texte:** SAMPLE_WORDS sind Platzhalter-Captions, die durch echte words.json ersetzt werden. Ebenso Platzhalter sind die Sticker-Texte ("WELCHES PRODUKT?", "PARTNER DRUCKT", "KI MACHT DEN REST", "für Betriebe unter 10 Leuten") und die Schritt-Labels (WEBSUCHE / FRAGE 1 / FRAGE 2). Die Prompt-Texte und die Hervorhebungen (promptKey) im ClaudePaper-Fenster folgen dem Skript.
- **Keyword:** über die Prop `keyword`.
- **Screenshots:** Die echten claude.ai-Screenshots für s1–s3 fehlen (`SHOTS` → `public/firma1/…`). Sie brauchen einen Lauf mit Pius' OK. Das UI-Label "Websuche" bzw. "Web search" ist ungeprüft.
- **Ton:** Voice, Musik, SFX und loudnorm fehlen. Danach Kamera-Feintiming auf die Worte.

## Selbstbewertung (~7/10, noch nicht 8)
- **Hook:** Die Kartenbeschriftung ist auf dem Handy zu klein (~2 % der Bildhöhe, Ziel ≥3 %). Der 0-€-Zähler und die Caption überdecken die unteren Karten. Es fehlt echte Tiefenschärfe und Lampenlicht wie bei Gericht.
- **Maschinen-Variante:** Der schiebende Gründer ist hinter der Maschine kaum sichtbar.
- **End-Karte:** Der Hintergrund hinter der Karte ist noch unruhig.
- **Design-Backlog D-3:** teilweise umgesetzt (Rim-Light, Fokus-Blur hinter Panels).
