# Phase 5: Screen-Animation (oben, Remotion)

Ziel: Der Bildschirm erzählt die Story Schritt für Schritt, im Takt von Sprechtext und Händen. Basis: `broll/src/compositions/SuperkindDesk.tsx` in eine neue Datei `<Name>Desk.tsx` kopieren und in `Root.tsx` registrieren (fps 25, 1080×1920).

## 5.1 Bausteine im Kit
- **MenuBar** (aktive App), Wallpaper Abend/Morgen, **LockClock** für Zeitsprünge
- **MailWindow** (Outlook-Look: Posteingang, Suche, Entwürfe), Ordner, Suchfeld mit Tipp-Animation
- **ListenPill** (weiß, orange Welle), **AgentPanel** (weiß, BrandStrip „superkind“, Schritte mit Häkchen), **DonePanel** (großes Ergebnis, dockt in die Ecke), **Notification**
- **AgentCursor** (orange Pfeil, Label-Pill, Klick-Ringe, Geisterspur bei schnellen Wegen) und **Cursor** (schwarz, Mensch)
- **ContextChips** (App-Logo + Info), **Captions**, **EndCard**

## 5.2 Zustandsmaschine des Agenten (pro Frage)
`idle → hört zu (ab Tastendruck) → denkt (Frage zu Ende +0,1 s, 0,3–0,6 s lang) → arbeitet (ab „Klar.“) → Hürde? → erledigt (mit Satz „Erledigt …“) → Freigabe beim Menschen`
- **hört zu:** Pill + Welle, die auf die Stimme reagiert. Optional ein schwarzer Mensch-Cursor, der sich nur bewegt, wenn sich unten die Hand bewegt. **Kein** Agent-Cursor, keine Klicks, keine Chips, keine Panels.
- **denkt:** Pill wechselt auf „denkt …“, kleiner Spinner. Alles andere still.
- **arbeitet:** Jetzt erst erscheint der orange Agent-Cursor. Pro 0,5–1 s ein Ereignis (Klick, Suche tippt, Treffer, Häkchen). Die Kamera folgt dem Cursor (siehe Phase 6).
- **Hürde:** roter/oranger Fehler-Dialog in der echten App-Optik. Der Cursor stoppt kurz, dann löst der Agent es sichtbar (Feld füllt sich, Dialog geht zu, Label „löst …“).
- **erledigt:** DonePanel mit konkretem Ergebnis + „Du musst nur noch freigeben“, danach Beweis in der App (Entwürfe-Ordner zählt hoch).

## 5.3 Regeln
- Weiß + Orange (`colors.accent`), Inter, Superkind-Branding nur im Agent-UI. Die Apps sehen aus wie die Apps, mit echten Logos aus `broll/public/logos`.
- Keine echte Superkind-Oberfläche nachbauen. Alles ist Vision, erfundene Firmen (Müller Bau …).
- Labels/Chips klappen links vom Cursor auf, sobald x > 760 (sonst laufen sie aus dem Bild). Labels nie über Panel-Schritten (leeres Label, wenn der Cursor im Panel ist).
- Alle Zeiten kommen aus einem `T`-Objekt, abgeleitet aus `words.json` (Wort-Timings). Keine magischen Zahlen im JSX.

**Gate:** Stills alle 1 s und an jedem Zustandswechsel anschauen. Der Agent tut nichts, solange die Person spricht. Jede Sekunde der Arbeitsphase hat ein sichtbares Ereignis.

## v7: ein Fenster (Pius, 2026-10-21)
- Der Mac-Screen zeigt nur EIN Superkind-Fenster (fast vollflächig). Alles passiert darin: Chat-Ansicht (proaktive Karte, Diktat als Bubble Wort für Wort, Geplant-Karte mit Schalter), Eingang/Tabelle, Entwurf-Panel (einer nach dem anderen), Freigabe-Leiste mit return-Taste, Ergebnis-Karte. Kein Fenster-Gewitter.

## v9: Teams-first, Apple-Look (Pius, 2026-10-21)
**Fehler in v8:** Die halbe Story lief in einem Outlook-Postfach. Die Fenster waren flach und webartig, die Schrift zu klein. Bewertet wurde nur an 40-%-Stills.

**Teams statt Postfach**
- Superkind ist ein angehefteter Kontakt im Teams-Chat.
- Alle Ergebnisse kommen als Karten in diesen Chat.
- Outlook/SAP erscheinen nur als Werkzeug-Chip oder Logo in der Karte.
- Mails „per Mail“ zu erzählen heißt nicht, ein Mail-Programm zu zeigen.

**Apple-Look (Pflicht)**
- Systemschrift `-apple-system` (= SF Pro, rendert lokal).
- Mesh-Gradient-Wallpaper; Glas-Material mit `backdrop-filter: blur(40px) saturate(190%)` für Sidebar, Pills und Benachrichtigungen.
- Fenster-Radius 24, tiefer Schatten in zwei Lagen, Haarlinien `rgba(0,0,0,.08)`.
- Lockscreen im macOS-Stil: große abgerundete Uhrzeit, Glas-Benachrichtigung mit echtem App-Logo.

**Chat-Scroll**
- Nachrichten am unteren Rand verankern, jede mit fester Höhe.
- Neue Nachrichten wachsen von 0 auf ihre Höhe, dadurch scrollt der Chat weich nach oben.

**Hook**
- Derselbe Chat im Endzustand (`tt = 99`).
- Rückblende per weichem Blur und Glas-Pill „Gestern, 16:52“. Kein Fensterwechsel, kein weißer Blitz, kein Clipwechsel unten.

**Lesbarkeit**
- Fließtext ≥ 16 px, Ergebnis-Titel ≥ 26 px, Kernzahl ≥ 38 px.
- Stills prüfen in Scale ≥ 0,6, nie nur als Kontaktbogen.

## v10: Claude-UI in Superkind-Branding — ersetzt v9 (Pius, 2026-10-21)
Pius zu v9: „Mach den Screen nicht so overload … stell dir das Claude-UI vor und brande es mit Superkind … nur die Chats, nicht so viele Buttons, nicht so viele Profilbilder … sleek und elegant … wie eine geile Ad, nicht wie ein billiger nachgedrehter Kurzfilm.“
- Bühne = EIN Vollbild-Chat im Claude-Stil: warmes Elfenbein #FAF9F6, keine Sidebar, keine Chatliste, keine Avatare, kein Menübalken. Oben nur Ampel-Punkte + kleines Superkind-Mark + „superkind“.
- Leerer Chat zu Beginn = Claude-Greeting: oranges Mark + Serif-Zeile „Hallo Florent.“ (füllt das Cover, fährt weg, sobald der Thread wächst).
- Agent-Turns: kleines oranges Mark + „Superkind“ + Uhrzeit, Text in Serif (ui-serif/New York, 31 px) wortgenau mit Avas Stimme eingeblendet. Fragen fett.
- Florent = rechte Bubble (#EFECE6) – erscheint erst beim Senden (stop), nie parallel zur Live-Diktat-Anzeige.
- Diktat läuft im Composer unten („Schreib Superkind …“, Mic → Waveform, orangener Senden-Knopf). Keine schwebenden Pills.
- Ergebnisse = ruhige weiße Karten (radius 20, Hairline, weicher Schatten), max. eine pro Turn, keine Deko-Stapel. Ergebnis-Karte braucht keinen zusätzlichen Fließtext, wenn die Stimme dasselbe sagt.
- Nacht = schwarzer Screen, nur Wochentag, Uhr 16:58→17:00, eine Zeile „Deine Liste ist da.“
- Composer-Unterkante ≥ 70 px über der Naht, damit die Naht-Captions nichts verdecken.
