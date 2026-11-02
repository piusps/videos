# Echter claude.ai-Lauf Tag 9 (Folge "Logo"), 2026-10-29, 18:29:04-18:30:44 (MEZ)
> Verworfen (2026-10-29): Lauf 1 lief in der Team-Organisation "Superkind", dort ist die Websuche vom Admin gesperrt. Gültig ist Lauf 2 in ../LAUF.md.
Chat: https://claude.ai/chat/03c5dc7f-1196-400e-9201-bb85033c094d (T3-Preview-Profil "Chrome"), Modell Opus 5.5 Mittel (API: claude-opus-5-5)
Chat-Titel (von claude.ai vergeben): "Kolonnenshirt Brustlogo für Handwerksbetriebe"
Weg: neuer Chat (claude.ai/new, Composer leer, kein fremder Text) -> Datei angehängt (verstecktes input[type=file], DataTransfer) -> Prompt per Paste -> "Nachricht senden". claude.ai-Oberfläche steht seit diesem Lauf auf Deutsch (Senden-Knopf = aria-label "Nachricht senden").
**WEBSUCHE WAR AUS.** Im Plus-Menü gibt es (anders als in Lauf 8) wieder einen eigenen Schalter "Websuche"; er stand vor dem Senden auf aus (aria-checked=false) und war ausgegraut (aria-disabled=true), ebenso "Recherche" (aus, ausgegraut). Nichts umgeschaltet (Vorgabe "nichts umschalten"; ausgegraut wäre es auch nicht gegangen). Chat-API bestätigt: settings enthält kein enabled_web_search (Lauf 8: enabled_web_search=true). Nichts verbunden, nichts gekauft, nirgends angemeldet, kein Canva.
Anhang: "Shirt-Firma Ergebnis Name.md" = Titelzeile "# Shirt-Firma · Ergebnis Firmenname (letzter Schritt)" + Schlussantwort aus Lauf 8 wörtlich (47 Zeilen, 5490 Byte); liegt in diesem Ordner.
Rückfragen: keine. Login/Connector/Geld verlangt: nein. Freigabe-Abfrage ("Einmal erlauben"): keine.
Erster Satz der Antwort: "Zuerst etwas Wichtiges: Die Printful-Vorgaben konnte ich nicht nachschlagen."

## Prompt (wörtlich)


## Ergebnis
Dauer: 1 min 40 s (gesendet 18:29:04, Antwort fertig 18:30:44)
Werkzeuge laut Chat-API: 7 Aufrufe = 0 Websuchen, 0 Seitenabrufe, 5 Befehle (bash_tool in Claudes Sandbox), 1 Bildansicht (view), 1 Dateiausgabe (present_files mit 3 SVG-Dateien). Chat-Zeile: "5 Befehle ausgeführt, hat eine Datei gelesen, dateien geteilt".
Ablauf laut API: (1) Schriften/Render-Werkzeuge prüfen + `curl -sI https://www.printful.com` -> (2) cairosvg installieren + printful.com erneut abrufen: HTTP-Code "000", Exit 1 = blockiert -> (3) gen.py: drei SVGs mit fontTools, Poppins Bold als Pfade, Maße in mm, Vorschau-PNGs mit cairosvg -> (4) Vorschauen zu einem Bild kombiniert -> (5) view: Claude sieht sich die Vorschau an -> (6) Kopie nach /mnt/user-data/outputs -> present_files.
Quellen: keine. In der Antwort kein einziger Quellenlink.
Dateien (Karten im Chat "Kolonnenshirt entwurf a/b/c · Bild · SVG" + "Alles herunterladen"): kolonnenshirt_entwurf_A.svg, _B.svg, _C.svg; über die claude.ai-API (wiggle/download-file) des eingeloggten Tabs heruntergeladen und hier gespeichert als entwurf-1.svg (= A), entwurf-2.svg (= B), entwurf-3.svg (= C), sieger.svg (= A). Die heruntergeladenen Dateien enthalten zusätzlich einen von claude.ai eingefügten C2PA-Herkunftsblock (<metadata><c2pa:manifest>…), der Zeichencode ist sonst unverändert Claudes Ausgabe.
Gewählter Entwurf: **A, zweizeilige Wortmarke "KOLONNEN / SHIRT" mit Balken dazwischen, eine Farbe (Dunkelblau #1F2A44), 85 × 27 mm.** Übrig: B (besteht knapp). Durchgefallen: C.

Chat-Schlussantwort (wörtlich, vollständig; auch in bericht.md):
"Zuerst etwas Wichtiges: **Die Printful-Vorgaben konnte ich nicht nachschlagen.** In diesem Chat steht mir keine Websuche zur Verfügung. Ein direkter Abruf von printful.com aus meiner Arbeitsumgebung wurde blockiert. Ich kann dir deshalb keine Printful-Zahlen mit Quelle nennen. Ich erinnere mich nur grob, dass Printful eine feste Garnpalette und Mindestgrößen für Text und Linien hat. Die genauen Werte nenne ich nicht, weil ich sie nicht belegen kann.

Damit du trotzdem weiterkommst, habe ich die Entwürfe gegen **eigene, vorsichtige Arbeitswerte** geprüft. Diese Werte stammen von mir, nicht von Printful:
- höchstens zwei Garnfarben
- keine Verläufe
- Großbuchstaben mindestens 7 mm hoch
- Linien und Abstände mindestens 1,5 mm

Alle drei Entwürfe sind 85 mm breit. Die Schrift (Poppins Bold, freie Lizenz SIL OFL) ist schon in Pfade umgewandelt. Das Logo sieht also überall gleich aus, auch wenn die Schrift auf einem Rechner nicht installiert ist.

| Entwurf | Größe | Farben | Buchstabenhöhe | Feinste Linie/Lücke | Ergebnis |
|---|---|---|---|---|---|
| A: zweizeilige Wortmarke mit Balken | 85 × 27 mm | 1 | 10,3 mm | 2,0 mm Balken, 2,2 mm Abstand | besteht |
| B: drei Balken + zweizeilig | 85 × 18 mm | 2 | 7,5 mm | 2,1 mm Lücke zwischen den Balken | besteht knapp |
| C: Rahmen mit Unterzeile | 85 × 19 mm | 2 | 6,1 mm, Unterzeile 2,6 mm | 1,0 mm Rahmen | fällt durch |

**Ich empfehle Entwurf A.**

1. **Die größte Schrift.** Mit 10,3 mm liegt A fast 50 % über meinem Mindestwert. B schafft nur 7,5 mm. Sollte Printfuls echte Grenze höher liegen als meine Annahme, hat A am meisten Luft.
2. **Nur eine Garnfarbe.** Du wählst je Shirtfarbe nur einen Faden, und es gibt keine kleinen Farbwechsel, die beim Sticken verrutschen können.
3. **Nichts, was falsch gelesen wird.** Die drei Balken in B sollen einen Trupp darstellen. Ehrlich gesagt sehen sie aber eher wie ein Balkendiagramm aus. A hat dieses Problem nicht.

**Was ich nicht prüfen konnte:**
- **Printfuls echte Vorgaben:** Mindesthöhe für Text, Linienbreite, maximale Farbanzahl, maximale Fläche für ein Brustlogo und mögliche Kosten für das Digitalisieren. All das fehlt mit Quelle.
- **Garnfarben:** Ob meine Farben (Dunkelblau #1F2A44, Orange #E8742A) in Printfuls Garnpalette vorkommen. Du müsstest beim Hochladen die nächstliegende Farbe wählen.
- **Das echte Stickbild:** Eine Vorschau am Bildschirm zeigt nicht, wie Stiche auf Stoff aussehen.
- **Dunkle Shirts:** Auf einem dunkelblauen Shirt wäre A unsichtbar. Dafür bräuchtest du eine helle Variante.
- **Ähnliche Logos:** Ob es schon ähnliche Logos gibt, habe ich nicht geprüft. Auch der Name „Kolonnenshirt“ ist laut deinem letzten Ergebnis noch nicht im DPMA- und EUIPO-Register geprüft.

Wenn du die Websuche in den Einstellungen einschaltest, suche ich die Printful-Stickvorgaben mit Quellen heraus und prüfe die Entwürfe erneut gegen die echten Werte. Alternativ findest du sie im Printful-Hilfecenter unter dem Stichwort „embroidery guidelines“."

## Auffälligkeiten (nur festgehalten, nichts korrigiert)
- **Die Kernaufgabe "Stick-Vorgaben von Printful per Websuche mit Quelle" ist NICHT erfüllt.** Websuche war in diesem Chat nicht verfügbar (Schalter aus + ausgegraut, nicht umgeschaltet). Claude versuchte printful.com direkt aus der Sandbox abzurufen (2 curl-Versuche), blockiert. Claude sagt das gleich im ersten Satz und nennt keine Printful-Zahl ("Die genauen Werte nenne ich nicht, weil ich sie nicht belegen kann").
- **Belegte Printful-Vorgaben: keine.** Nicht gefunden: Farbanzahl, kleinste Schrifthöhe, Linienbreite, maximale Brustlogo-Fläche, Digitalisierungskosten, Garnpalette. Einzige Andeutung ohne Zahl: "Ich erinnere mich nur grob, dass Printful eine feste Garnpalette und Mindestgrößen für Text und Linien hat" (aus Erinnerung, ohne Quelle).
- Geprüft wurde stattdessen gegen **Claudes eigene "Arbeitswerte"** (ausdrücklich "von mir, nicht von Printful"): ≤ 2 Garnfarben, keine Verläufe, Großbuchstaben ≥ 7 mm, Linien/Abstände ≥ 1,5 mm. Die Prüfung "besteht / besteht knapp / fällt durch" bezieht sich nur auf diese selbst gesetzten Werte.
- Die drei Gründe für A beziehen sich ebenfalls auf die eigenen Werte (10,3 mm = "fast 50 % über meinem Mindestwert"), auf 1 Garnfarbe und auf eine Geschmacksaussage (Balken in B "sehen eher wie ein Balkendiagramm aus").
- **Nachmessung im SVG-Code / lokal gerastert (20 px/mm, headless Chrome):**
  - Entwurf A (entwurf-1.svg, sieger.svg): Füllfarben im Code nur #1F2A44 (1 Farbe), keine Verläufe, Elemente nur path/rect, viewBox 85 × 26,96 (Einheit mm). Gemessen: Zeile "KOLONNEN" 10,4 mm hoch (mit Überhang der O; Claude: 10,3 mm Versalhöhe), Balken 2,0 mm, Abstände je 2,1 mm, "SHIRT" 10,4 mm. Stimmt mit Claudes Angaben.
  - Entwurf B (entwurf-2.svg): Farben #1F2A44 + #E8742A (2), keine Verläufe, 85 × 18,06 mm. Gemessen: Schrift 7,65 mm (Claude: 7,53 mm Versalhöhe), drei Balken je 4,6 mm breit, Lücken 2,1 mm. Stimmt.
  - Entwurf C (entwurf-3.svg): Farben #1F2A44 + #E8742A (2), 85 × 19,24 mm. Gemessen: Rahmen 1,0 mm (stroke-width="1.0"), "KOLONNENSHIRT" 6,25 mm, Unterzeile 2,7 mm (Claude: 6,14 / 2,6 mm). Stimmt; nach Claudes eigenen Werten durchgefallen (Rahmen < 1,5 mm, Schrift < 7 mm).
  - Alle drei 85 mm breit = innerhalb der verlangten 8–9 cm. Schrift in allen drei als Pfade (keine <text>-Elemente).
- Entwurf C trägt die Unterzeile "ARBEITSKLEIDUNG MIT LOGO"; das Wort "Arbeitskleidung" steht so nicht im Anhang (dort: Firmenshirts mit gesticktem Logo).
- Schrift: Poppins Bold (Claude: "freie Lizenz SIL OFL"; nicht nachgeprüft).
- Claude nennt selbst: A auf dunkelblauem Shirt unsichtbar (helle Variante nötig); Garnfarben nicht gegen Printful-Palette geprüft; Stickbild nicht simulierbar; ähnliche Logos nicht geprüft; Name noch nicht im DPMA/EUIPO geprüft.
- Claudes Vorschlag: "Wenn du die Websuche in den Einstellungen einschaltest, suche ich die Printful-Stickvorgaben mit Quellen heraus …" bzw. Printful-Hilfecenter "embroidery guidelines".
- Es wurde kein Login, kein Connector und kein Geld verlangt.

## Screenshots und Bilder
Echte claude.ai-Pixel (DOM-Klon ohne Sidebar/nav/aside, Dark Mode, headless Chrome; Leak-Check: keine Sidebar-Chat-Titel, keine Namen/Mails im Bild; Kopfzeile in 02–06 nicht enthalten):
- 01-prompt-mit-anhang.png: Composer mit Anhang "Shirt-Firma Ergebnis Name.md" (47 Zeilen, MD) + Prompt, vor dem Senden
- 02-keine-websuche-arbeitswerte.png: "5 Befehle ausgeführt …" + "Die Printful-Vorgaben konnte ich nicht nachschlagen" + eigene Arbeitswerte
- 03-entwuerfe-tabelle.png: Prüftabelle A/B/C (Größe, Farben, Buchstabenhöhe, feinste Linie, Ergebnis)
- 04-entscheidung.png: "Ich empfehle Entwurf A" + 3 Gründe
- 05-nicht-pruefen.png: "Was ich nicht prüfen konnte" + Hinweis Websuche einschalten
- 06-datei-karten.png: Datei-Karten "Kolonnenshirt entwurf a/b/c · Bild · SVG" + "Alles herunterladen" (nur Karten, die Logos selbst sind dort nicht zu sehen; die Artifact-Seitenleiste blieb im Klon weiß/leer)
- 07-claude-eigene-vorschau.png: Claudes eigenes Vorschaubild aller drei Entwürfe (in Claudes Sandbox mit cairosvg gerendert, per view angesehen), über die claude.ai-Datei-API geladen; echtes Bild aus dem Lauf, kein claude.ai-UI.
Lokal gerendert (headless Chrome aus Claudes SVG-Code, weißer Rand, 2000 px breit; KEINE claude.ai-Pixel):
- entwurf-1.png (= A), entwurf-2.png (= B), entwurf-3.png (= C), sieger.png (= A)

## Ein Satz an den Autor
Ohne Websuche (Schalter in diesem Chat aus und ausgegraut) fand Claude in 1 min 40 s keine einzige Printful-Stickvorgabe, sagt das ehrlich im ersten Satz, zeichnet trotzdem drei 85 mm breite SVG-Logos (A Wortmarke einfarbig, B drei Balken + Wortmarke, C Rahmen mit Unterzeile), prüft sie nur gegen selbst gesetzte Arbeitswerte (≤ 2 Farben, Schrift ≥ 7 mm, Linien ≥ 1,5 mm) und empfiehlt **Entwurf A** (größte Schrift 10,3 mm, nur eine Garnfarbe, nichts Missverständliches) — die echten Printful-Vorgaben fehlen also noch.
