---
name: firma-design
description: Design-Studio für die Serie "Superkind baut eine Firma" (@pickthecompany) - kümmert sich ausschließlich darum, dass die Grafik krass gut aussieht - pflegt das Design-System (Farben, Schrift, Karten, Licht, Kamera-Sprache, echte Claude-UI), baut aus beats.json von firma-regie die Remotion-Komposition, liefert Style-Frames vor dem vollen Render, vergleicht sie Seite an Seite mit den besten Referenzen aus firma-spy und führt ein Design-Backlog mit Upgrades. Nutze den Skill bei "Grafik verbessern", "sieht billig aus", "Look upgraden", "Style-Frames", "baue die Folge", "rendere Tag N", oder als Schritt 3 von firma-chef.
---

# firma-design

Das Design-Studio misst sich nicht an der letzten Version, sondern an den **besten Ausreißer-Reels** in `SPY/analysen/`. Ein Frame ist fertig, wenn er neben der Referenz nicht billiger aussieht.

Dateien:
- `references/design-system.md` – die gültigen Regeln (Farben, Typo, Kartenstile, Licht, Kamera, Logos, Captions, Erklär-Akte und Label-Lesbarkeit). Nur hier ändern, nie still in einer Komposition.
- `references/design-backlog.md` – offene Upgrades mit Priorität und Beleg.
- Code: `/Users/pius/LinkedIn Generator/broll/src/compositions/` (Serie bisher `SuperkindFirmaTag3.tsx`, eigener Einstieg `src/index-tag3.tsx`), Bausteine in `src/components/` (Voxel3D, PixelKit, ClaudeUI). Echte Logos aus `public/logos/`.

## Serien-Engine (seit 2026-10-28, Pflicht für jede neue Folge)

**Neue Folge = `episode.json` + `voice.mp3` + `words.json` in `broll/public/firma-ep/tag<N>/`, kein neuer Code.** Die Engine (`src/compositions/FirmaEpisode.tsx`, Einstieg `src/index-firma-episode.tsx`) baut daraus die Folge im Tag-1-v7-Stil. Schema, Anker-Grammatik, Akt-Typen, Tag/Folge-Regel und Umsatz-Regel: `references/episode-schema.md`.
- Render: `node scripts/firma-episode-render.mjs public/firma-ep/tag<N> [--stills]`. Liefert Style-Frames pro Akt, Brett, Voll-Render, Mix (−14 LUFS, Musik-Start pro Folge, nie geloopt), Handy-Version und Desktop-Kopie in ~1:45 min.
- Fehlt ein Baustein (neuer Akt, neues 3D-Objekt, neues Overlay): in `src/components/firma/` bauen, im Schema-Typ (`schema.ts`) und in `episode-schema.md` eintragen. Nie eine neue Einzel-Komposition pro Folge.
- Die alten Kompositionen (FirmaShirtsTag1 V1–V7, SuperkindFirmaTag2/3, FirmaTag2/3) bleiben unangetastet als Referenz.
- Schritte 2, 3 und 5 unten laufen über die Engine: Style-Frames = `--stills`, Komposition = episode.json, Voll-Render + Mix = Render-Skript.

## Weniger Text pro Zeit (Pius 2026-10-29, ab Folge 9)
Weniger Text im Bild, dafür jeder Text sofort verständlich. Höchstens **ein** neuer Textblock gleichzeitig (Karte, Pill oder Stempel), Karten und Stempel ≤ 4 Wörter, jeder Text mindestens 1,2 s voll lesbar, bevor der nächste kommt. Was die Stimme sagt, zeigt das Bild als Objekt oder Symbol, nicht noch einmal als Satz. Claude-Antworten nur als ein markierter Satz. Prüfung: Kontaktbogen 2 fps, in keinem Frame mehr als ~12 neue Wörter Bildschirmtext außer den Untertiteln.

## Ablauf

1. **Referenz-Brett.** Aus `SPY/analysen/` die 3 Ausreißer wählen, deren Grafik am nächsten an der Folge ist; je 3–4 Schlüsselframes in ein Brett legen (`broll/runs/firma-tag<N>/design/referenz.png`).
2. **Style-Frames zuerst.** Für 4 Schlüssel-Beats aus `beats.json` (Frame 1, Produkt, Mehrwert-Schritt, Ende) Stills rendern (`npx remotion still <entry> <Comp> out.png --frame=N --gl=angle`) und Seite an Seite mit dem Referenz-Brett montieren. Pro Frame bewerten: Lesbarkeit auf dem Handy (Text ≥ 3 % Bildhöhe), Tiefe/Licht, Farbharmonie, Fokus (eine Hauptsache), Wertigkeit. Unter 8/10 → verbessern, bevor irgendetwas voll gerendert wird.
3. **Komposition bauen.** Aus `beats.json`; Zeiten aus `words.json` über Wort + `after` verankern. Neue Bausteine in `src/components/` anlegen, damit die nächste Folge sie wiederverwendet. Jede Folge bekommt einen eigenen Einstieg `src/index-firma<N>.tsx`, damit fremde Kompositionen den Render nicht blockieren.
4. **Echte Oberflächen.** Klickpfade in Claude (Einstellungen → Connectors, Chat, Entwürfe) als echte Screenshots von claude.ai in Pius' Browser (nur ansehen, nichts ändern), dann mit Zeiger, Zoom und Hervorhebung animieren. Keine nachgezeichneten Fantasie-UIs, keine selbstgemalten Logos.
5. **Voll-Render und Mix.** Render im Hintergrund (`--concurrency=4`), Musik + `loudnorm=I=-14:TP=-1` mit ffmpeg aus `broll/node_modules/ffmpeg-static`. Kontaktbogen (`fps=1/2,tile=9x2`) selbst ansehen, bevor es an `firma-pruefer` geht.
6. **Backlog pflegen.** Alles, was dir neben der Referenz schwächer vorkommt und nicht in diese Folge passt, mit Beleg-Frame in `design-backlog.md`. Pro Folge mindestens ein Backlog-Punkt umgesetzt.

Bei einem Korrektur-Ticket von `firma-pruefer`: genau die genannten Frames fixen, Style-Frame der Stelle vorher/nachher zeigen, neu rendern.

## Lehre 2026-10-29 (Folge 4 final 7/10, K.-o. statischer Hook)
- Frame 0 zeigt die ganze Hook-Frage und das Ergebnis-Objekt voll lesbar (nicht Zeile für Zeile einblenden).
- 0–6 s: mindestens alle 0,5 s ein klar sichtbares Bildereignis (Push-in auf Schlüsselwort, Zähler, großer Stempel), kleine Stempel zählen nicht.
- Hook-Objekt und Gründungsplan überlappen nie; Plan erst nach dem Objekt oder klar getrennt.
- Vor jeder Abgabe Kontaktbogen 0–6 s @4 fps selbst ansehen und ablegen.
- Board ab Folge 5: PRODUKT, KUNDE, DRUCK, PREIS, PARTNER, NAME, LOGO, WEBSITE, ERSTER UMSATZ.

## Lehre 2026-10-30 (Folge 10 final R1 7/10, zwei K.-o.)
- Prompt-Screenshots nie mit lesbarem Volltext: nur Anhang-Chips, dann Ausschnitt auf die eine markierte Zeile (sonst > 12 neue Wörter, K.-o.). Vor dem Render Frames im Weg-Beat ansehen.
- Rückblick → „Heute“: Die Kamerafahrt der Engine auf den heutigen Schritt schneidet Titel/linke Spalte des Gründungsplans an. Board bleibt bis „Heute“ ganz im Bild, dann harter Schnitt ins Claude-Fenster mit Pill „HEUTE: <SCHRITT>“ als Overlay (Lösung Folge 10 v4).
- Endkarte: Die Engine staffelt End-Items nur 0,22 s → zwei DM-Einträge gelten als zwei Textblöcke gleichzeitig. Ein DM-Eintrag mit beiden Lieferteilen („DM 1 · Frage + Online-Checkliste“) statt zwei.
- Kleine rote Rahmen um auf dem Handy unlesbare Zeilen weglassen.

## Lehre 2026-10-30 (Folge 11: Design-Stills R1 nicht bestanden mit 8 Tickets, final R1 8/10 mit K.-o.)
- Ursache: Folge 11 wiederholte drei Fehler, die Folge 10 am selben Tag schon gelöst hatte (zwei DM-Karten, Board-Anschnitt bei „Heute“, lesbarer Fließtext). Neue Folge immer aus der **zuletzt bestandenen** episode.json ableiten (Endkarte, Recap/Heute-Schnitt, Kamera), nicht aus einer älteren Vorlage, und vor den Stills diesen Lehre-Abschnitt Punkt für Punkt gegen die Stills abhaken (im Bericht nennen).
- Dokument-Shots (Word/PDF aus dem Lauf): Fließtext schon im Asset weich + gedimmt (Blur ~3 px, ~35 % Kontrast); scharf nur Titel des gemeinten Punkts, Stempel-Wörter, Nummern, Kästchen. So bleibt jeder Frame ≤ ~12 lesbare neue Wörter.
- Zu verbergende Wörter (Ortsname u. ä.) nie mit dunklem Balken schwärzen (wirkt wie Zensur/Fleck): papierweiß abdecken, Folgewort heranrücken, Abdeckung über allen Markierungen.
- Hook-Lupen zeigen nur Text, der in Frame 0 schon scharf steht, und stehen ≥ 1,2 s.
- Board ab Folge 11 (Engine kann nur 3×3): PRODUKT+KUNDE, DRUCK+PREIS, PARTNER+NAME, LOGO (4), WEBSITE (5, „Entwurf“, nie grün bis online), GEWERBE (6), BETRIEBE (7), WERBEBRIEF (8), ERSTER UMSATZ (9), Untertitel „12 Schritte“. Diese Nummerierung in allen Folgefolgen halten.
- Backlog (nur mit Code): Offline-Symbol an Board-Kacheln, Zellen-Glow/Stempelwackeln im Hook, Heute-Flug ohne Board-Anschnitt, Endkarte D-23.

## Lehre 2026-10-30 (Folge 12: Design-Stills 3 Runden, final R1 7,5/10)
- Ursache final R1: (1) Die Übergabe-Karte („ALS NÄCHSTES“) startete 1,3 s nach „Als“ → fast leeres Bild 33,2–34,5 s. Question-Akt und Pop immer auf `Als@<t>-0.15`, Karte spätestens 0,1 s nach „Als“ ganz im Bild. (2) Karten über dem Plan mit Oberkante y ≥ 215 ließen den Titelstreifen „…NDUNGSPLAN“ zwischen den HUD-Kacheln stehen und der Plan blitzte zwischen zwei Karten auf. Lösung ohne Engine-Code: hohe Karten-Varianten bei y −60, randlos, HUD darüber; aufeinanderfolgende Karten überlappen, bis die nächste ganz steht.
- Vor dem vollen Render an jedem Akt-Übergang (Heute, Claude-Weg, Haken→Übergabe, CTA) einen 10-fps-Streifen ±1 s ansehen: kein Frame nur mit HUD + Untertitel + Maskottchen, kein angeschnittener Plan. Screenshots, die im Claude-Fenster zu klein/schwarz wirken, aus echten Crops zu einem fensterfüllenden Verlaufsbild setzen (Folge 12 `shots/weg-A/B/C.png`), bis die Engine eine fit-Option hat (Backlog).

## Lehre Folge 13 (2026-10-30, Design 2 Runden)
R1 fiel durch drei vermeidbare Dinge: (1) Platzhalter statt echtem Lauf-Bild im Heute-Beat (graue Balken) → ab dem ersten Frame das echte Ergebnis-Bild; (2) Bild-Overlays (`partners`) bauen 0,25–0,55 s nach dem Pop ein blasses, orange umrandetes Rechteck auf (Engine, `objects.tsx` `mk`) und die Heute-Pill poppt über den Abgang der Produkt-Karte (`overlays.tsx` RecapOverlay) → Pop ≤ 0,25 s, danach dasselbe Bild als harter Schnitt, oder ganz harte Schnitte; jeden Akt-Übergang mit 30-fps-Streifen ±0,4 s prüfen, bevor die Prüfung läuft; (3) leere „?“-Karten-Slots vor den Warum-Karten → keine leeren Plätze. Engine-Fix steht im Design-Backlog.

## Lehre Folgen 14–16 (2026-10-31, drei Mal K.-o. Maskottchen in Folge)
Folge 14 final R1 7,5, Folge 15 R1 7,0 / R2 7,5, Folge 16 R1 6,5: jedes Mal dasselbe Fehlerbild.
- **Maskottchen frei:** In jedem Frame höchstens 1/3 verdeckt und Augen frei, durch Panels, Listen, Claude-Fenster UND Untertitel, auch im CTA/Endkarte und beim Hüpfer. Panel-/Fensterunterkante über dem Kopf (Folge 14: Tabelle endet bei y≈1015; Folge 15: HEUTE-Panel 1200×1000, Maskottchen rechts). Vollbild-Einschübe: Maskottchen ganz weg oder ganz sichtbar, nie nur Füße/Lichtkegel. Vor der Abgabe einen 10-fps-Streifen über ALLE Akte gezielt auf Augen/Verdeckung ansehen, nicht nur die Übergänge.
- **Lesbarkeit:** Jeder aussagende Text ≥ 58 px (3 % Bildhöhe) im Video; Quelltext der Warum-Karten 84 px (Folge 15). Unterzeilen größer oder weglassen.
- **Schnitte:** Panel-Wechsel und Kamera-Schnitt auf denselben Frame; nie zwei Panels/Szenen gleichzeitig (auch nicht 2–6 Frames).
- **Board:** Feldtitel nie unter das „?“; im CTA den Stand NACH der Folge zeigen. 3×3-Limit: Feld 8 „BRIEF + ADRESSEN“, Feld 6 „GEWERBE MENSCH“.
- **Parallel-Arbeit:** Nur in public/firma-ep/tag<N>/ der eigenen Folge schreiben; Fixes in gen.py/ep.py ablegen, damit ein Neuerzeugen sie nicht löscht.

## Lehre Folge 19 (2026-11-01, Stills R1 7,0 mit zwei Maskottchen-K.-o. im Hook)
- Hook: Das Maskottchen darf in 0–1,2 s nicht von oben ins Bild fallen (es lief hinter Frage, Lampe, Panel). Landung vor Frame 0 (hook.at.ki früh), keine Hook-Hops; Hook-Wort-Pills mit Unterkante immer über der Kopfoberkante (captionY im Hook prüfen, 30-fps-Streifen 0–1,3 s als Beleg).
- Zwei Fragefelder („EINKAUF ?“/„STEUER ?“) nie im selben Frame: jedes auf sein Wort.
- CTA-Board-Badges rahmenlos in die Nummernzeile der Zelle (proof.bare), nie über Feldtitel oder Plan-Überschrift.
- Abgehakte Lehren im Stills-Bericht nur mit Frame-Beleg; Folge 19 hakte das Board ab, das in R1 durchfiel.
- Backlog aus final F19: Panels > 1 s mit > 50 % Leerfläche (Ergebnis, Offen, Fragekarte), gestrichene Beträge einheitlich und nicht angeschnitten, leeres oranges Pill auf dem Cover (y ≈ 545, auch F17).

## Lehre Folge 20 (2026-11-01, Stills 2 Runden, final R1 7,5 → R2 8,5)
- Bedingte Beträge tragen ihre Bedingung in JEDER Einstellung: Steht 91,60 € nur unter „mit Vorsteuerabzug“, steht die Kopfzeile („Mit Vorsteuerabzug zahlt:“, ≥ 58 px) auf jeder Tafel/Karte mit dem Betrag, nicht nur im Hook (final-R1-02, Fakten 7). Vor dem Render alle Stellen eines Betrags auflisten.
- Unterzeilen sind aussagender Text: „als Kleinunternehmer“ unter einer Karte lag bei 51 px → durchgefallen. Unterzeilen notfalls zweizeilig, ≥ 64 px Ziel.
- Hook-Planframes, die kürzer als ~0,36 s stehen, erscheinen im Render nie (Engine überspringt sie): Ereignisse im Hook als Farb-/Puls-Wechsel auf einem stehenden Element setzen und im 4-fps-Bogen belegen, nicht nur in ep.py planen.
- HUD (TAG-Badge, Plan-Board) ≈ bis y 200: Karten im Vollbild beginnen ≥ 20 px darunter.
- Handy-Fassung mit Limiter ≤ −1,0 dBTP (F20 hatte −0,4).

