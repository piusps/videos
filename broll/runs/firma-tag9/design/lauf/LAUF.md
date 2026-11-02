# Echter claude.ai-Lauf Tag 9 (Folge "Logo"), 2026-10-29, 18:37:09-18:41:32 (MEZ)
> Lauf 1 (Chat https://claude.ai/chat/03c5dc7f-1196-400e-9201-bb85033c094d, 18:29) lief ohne Websuche in der Team-Organisation "Superkind" (Websuche vom Admin gesperrt) und ist verworfen; Dateien in `_lauf1-ohne-websuche/`. Dieser Lauf 2 ist gültig.

Chat: https://claude.ai/chat/53c3ab1e-5d6d-4577-b77c-405f96c8837f (T3-Preview-Profil "Chrome", Organisation = Pius' eigene Pro-Organisation 77f569ac…, Cookie lastActiveOrg vor dem Senden geprüft), Modell Opus 5.5 Mittel (API: claude-opus-5-5)
Chat-Titel (von claude.ai vergeben): "Kolonnenshirt Brustlogo Entwürfe"
Weg: neuer Chat (claude.ai/new, Modus "Claude", Composer leer, kein fremder Text) -> Datei angehängt (verstecktes input[type=file], DataTransfer) -> Prompt per Paste -> "Nachricht senden". KEIN Research (Plus-Menü: "Recherche" aus, blieb aus). Einen eigenen Websuche-Schalter gibt es in dieser Organisation nicht (wie Lauf 8); Claude nutzte die Websuche von selbst, Chat-API: settings.enabled_web_search = true. Nichts umgeschaltet, nichts verbunden, nichts gekauft, nirgends angemeldet, kein Canva. Am Composer steht "Manuell" (Berechtigungsmodus); es kam trotzdem keine Freigabe-Abfrage.
Anhang: "Shirt-Firma Ergebnis Name.md" = Titelzeile "# Shirt-Firma · Ergebnis Firmenname (letzter Schritt)" + Schlussantwort aus Lauf 8 wörtlich (47 Zeilen, 5490 Byte); identisch mit Lauf 1; liegt in diesem Ordner.
Rückfragen: keine. Login/Connector/Geld verlangt: nein.
Erster Satz: "Ich suche zuerst die Stick-Vorgaben von Printful heraus, zeichne dann drei SVG-Entwürfe und prüfe jeden dagegen."

## Prompt (wörtlich)


## Ergebnis
Dauer: 4 min 23 s (gesendet 18:37:09, Antwort fertig 18:41:32)
Werkzeuge laut Chat-API: 17 Aufrufe = 3 Websuchen, 1 Seitenabruf (WebFetch), 8 Befehle (Bash in Claudes Sandbox; 3 davon mit Exit-Code 1: Werkzeug-Check, cairosvg nicht installierbar, ein Skriptfehler, danach repariert), 1 Datei geschrieben (build_logos.py), 3 Bildansichten (Read check_A/B/C.png), 1 Dateiausgabe (SendUserFile, 3 SVGs, Anzeige "render"). Chat-Zeile: "Eine Datei erstellt, 3 Dateien geteilt und 15 weitere Schritte".
Websuchen: Printful embroidery file guidelines minimum text height line thickness colors | Printful embroidery thread colors maximum number of colors | Printful left chest embroidery area size 4 x 4 inches
Seitenabruf: https://help.printful.com/hc/en-us/articles/28727397325340-How-should-I-prepare-my-design-for-embroidery
Quellen in der Antwort: 2 Links (Printful Help "How should I prepare my design for embroidery?", Printful Blog "T-shirt design placement guide").
Dateien (Karten im Chat "Kolonnenshirt a zweizeilig / b symbol / c block · Bild · SVG" + "Alles herunterladen"): kolonnenshirt_A_zweizeilig.svg, _B_symbol.svg, _C_block.svg; über die claude.ai-API des Tabs (/api/organizations/77f569ac…/files/<uuid>/contents) unverändert heruntergeladen: entwurf-1.svg (= A), entwurf-2.svg (= B), entwurf-3.svg (= C), sieger.svg (= C). (Anders als Lauf 1 kein C2PA-Block in den Dateien.)
Gewählter Entwurf: **C "Block mit heller Schrift": Navy-Fläche #333366 mit weißer Schrift KOLONNEN / S H I R T, 88 × 35 mm, 2 Farben.** A (Zweizeilig mit Balken) und B (Symbol + einzeilig) fallen laut Claude beim Negativraum durch.

Chat-Schlussantwort (wörtlich, vollständig; auch in bericht.md):
"Ich empfehle **Entwurf C (Block mit heller Schrift)**. Er ist der einzige der drei, der alle Printful-Vorgaben erfüllt, die ich messen konnte.

**Printful-Vorgaben für Flachstick (mit Quelle)**
- **Farben:** Beim Standardstick sind bis zu 6 Garnfarben pro Design aus einer Palette von 15 möglich, und Farben in Hintergrundflächen zählen mit. Ich habe nur diese Palette verwendet: Navy #333366, Orange #E25C27, Schwarz und Weiß.
- **Schrifthöhe:** mindestens 0,25" (≈6,35 mm). Buchstaben unter 0,1" (≈2,54 mm) können beim Digitalisieren ganz entfernt werden.
- **Linienstärke:** mindestens 0,05" (≈1,27 mm). Dünnere Linien werden eventuell zu Steppstich umgewandelt oder entfernt.
- **Negativraum (Lücken, durch die der Stoff scheint):** mindestens 0,25" (≈6,35 mm) breit. Ist eine Lücke zu schmal, gibt es laut Printful meist ein besseres Ergebnis, wenn man sie mit einer Garnfarbe füllt.
- **Sonstiges:** keine Verläufe, transparenter Hintergrund. Die maximale Fläche für Linke-Brust-Stick ist 4″ × 4″ (≈101 mm). Alle drei Entwürfe passen hinein.

**Prüfung** (gemessen am gerasterten Entwurf in Endgröße)

| | A · Zweizeilig mit Balken | B · Symbol + einzeilig | C · Block mit heller Schrift |
|---|---|---|---|
| Größe | 88 × 38 mm | 90 × 31 mm | 88 × 35 mm |
| Farben (max. 6) | 2 ✓ | 2 ✓ | 2 ✓ |
| Kleinste Schrifthöhe (≥ 6,35 mm) | 9,0 mm ✓ | 7,2 mm ✓ (knapp) | 9,5 mm ✓ |
| Dünnster Strich (≥ 1,27 mm) | 1,68 mm ✓ | 1,36 mm ✓ (knapp) | 1,76 mm ✓ |
| Lücken unter 6,35 mm | ✗ in und zwischen den Buchstaben (bis 5,8 mm) | ✗ in und zwischen den Buchstaben (bis 4,1 mm) | ✓ keine, die Lücken sind mit Navy gefüllt |

Bei allen drei war das Ende des schrägen K-Arms als kleine Spitze unter 1,27 mm. Das betrifft nur eine Ecke, nicht einen ganzen Strich.

**Warum C:**
1. **Kein Problem mit dem Negativraum.** Bei A und B sind die Innenräume der Buchstaben (O, R) und die Abstände zwischen ihnen schmaler als 6,35 mm. Das lässt sich bei acht bis neun Zentimetern Breite gar nicht anders lösen. C füllt diese Lücken mit Navy, und genau das empfiehlt Printful selbst.
2. **Der größte Abstand zu den Mindestwerten.** C hat 9,5 mm Schrifthöhe und 1,76 mm Strich. Bei B liegen beide Werte nur knapp über der Grenze, weil 13 Buchstaben in eine Zeile müssen.
3. **Gleicher Look auf jeder Shirtfarbe.** C bringt seinen Hintergrund mit. A (Navy-Schrift) und B (schwarze Schrift) würden auf dunklen Shirts verschwinden, und du bräuchtest eine zweite Farbvariante.

**Was ich nicht prüfen konnte:**
- **Stichzahl und Tragegefühl:** Die geschlossene Fläche bei C braucht viele Stiche. Eine Stichgrenze oder einen Aufpreis dafür habe ich bei Printful nicht gefunden. Wie steif die Fläche auf dem Shirt wird, kann ich ebenfalls nicht beurteilen.
- **Wie Printful digitalisiert:** Ob die Lücken bei A und B tatsächlich zulaufen und wie die K-Spitze gestickt wird, zeigt erst eine echte Stickprobe. Printful empfiehlt selbst, eine Probe zu bestellen.
- **Produktgrenzen:** Die erlaubte Stickfläche ist je nach Shirt unterschiedlich. Ich habe nur den allgemeinen Wert von 4″ × 4″ gefunden, nicht die Vorlage für dein konkretes Modell.
- **Shirtfarben und Kontrast:** Die habe ich nur am Bildschirm gesehen, nicht auf Stoff.
- **Schutzrechte:** Ob es ähnliche Logos oder eingetragene Bildmarken gibt, habe ich nicht geprüft. Der Name selbst ist laut deinem letzten Ergebnis auch noch ungeprüft (DPMA, EUIPO).
- **Schrift:** Die Entwürfe nutzen Inter ExtraBold, umgewandelt in Pfade. Die Lizenz habe ich nicht nachgeschlagen.

Nächster Schritt: C bei Printful hochladen, die Vorschau im Design Maker prüfen und vor dem Verkaufsstart ein Probeshirt bestellen.

Sources:
- [Printful Help: How should I prepare my design for embroidery?](https://help.printful.com/hc/en-us/articles/28727397325340-How-should-I-prepare-my-design-for-embroidery)
- [Printful Blog: T-shirt design placement guide](https://printful.com/blog/t-shirt-design-placement-guide)"

## Auffälligkeiten (nur festgehalten, nichts korrigiert)
- **Belegte Printful-Vorgaben (laut Claude, Quelle Printful Help-Artikel, Flachstick):** bis 6 Garnfarben pro Design aus einer Palette von 15, Hintergrundfarben zählen mit; Schrifthöhe ≥ 0,25" (≈ 6,35 mm), unter 0,1" (≈ 2,54 mm) evtl. entfernt; Linienstärke ≥ 0,05" (≈ 1,27 mm), dünnere evtl. Steppstich oder entfernt; Negativraum ≥ 0,25" (≈ 6,35 mm), zu schmale Lücken besser mit Garnfarbe füllen; keine Verläufe, transparenter Hintergrund; Linke-Brust-Stick max. 4" × 4" (≈ 101 mm). Welche Zahl aus welcher der zwei Quellen stammt, sagt die Antwort nicht einzeln (4" × 4" kam aus einer eigenen Suche nach "left chest … 4 x 4"). Der Seiteninhalt des Abrufs ist in der Chat-API nicht gespeichert (nur URL/Metadaten), die Zahlen sind daher hier nicht gegen den Seitentext nachgeprüft.
- **Nicht gefunden (Claude selbst):** Stichzahl-Grenze oder Aufpreis für große Stickflächen, produktspezifische Stickfläche für das konkrete Shirt, Lizenz der Schrift (Inter ExtraBold).
- Garnfarben: Claude sagt, Navy #333366, Orange #E25C27, Schwarz, Weiß seien aus Printfuls Palette; die Hex-Werte der Palette sind in der Antwort nicht einzeln belegt und hier nicht nachprüfbar.
- **Nachmessung im SVG-Code / lokal gerastert (20 px/mm, headless Chrome):**
  - A (entwurf-1.svg): Füllfarben #333366 + #E25C27 = 2, keine Verläufe, keine <text>-Elemente (Schrift als Pfade), nur path. viewBox 88 × 37,688 mm (Claude: 88 × 38). Zeile KOLONNEN 10,7 mm hoch inkl. O-Überhang, S H I R T 9,2 mm (Claude: kleinste Schrifthöhe 9,0 mm Versalhöhe), Balken 2,2 mm hoch, 85 mm lang.
  - B (entwurf-2.svg): #000000 + #E25C27 = 2, keine Verläufe, Pfade. 90 × 30,7 mm. Schriftzug 7,4 mm inkl. Überhang (Claude: 7,2 mm), drei "Pfosten" je 5,0 mm breit.
  - C (entwurf-3.svg, sieger.svg): #333366 (Fläche) + #FFFFFF (Schrift) = 2, keine Verläufe, Pfade. SVG 88 × 35 mm, Navy-Fläche selbst 85 × 32 mm (1,5 mm Rand). Weiße Schrift je Zeile 9,7 mm inkl. Überhang (Claude: 9,5 mm).
  - Alle drei: Farbanzahl ≤ 6 ✓, Schrift ≥ 6,35 mm ✓, Breite 88–90 mm = innerhalb "acht bis neun Zentimeter" und < 101 mm ✓. Strichstärke und Negativraum habe ich nicht selbst nachgemessen; Claude hat sie in der Sandbox per Rasterung gemessen (dünnster Strich A 1,68 / B 1,36 / C 1,76 mm; Lücken < 6,35 mm: A 26 Stellen, B 27, C 0).
- Claude hat nach der ersten Messung Entwurf A geändert (Abstand zum Balken vergrößert, Höhe 30,7 -> 37,7 mm); A blieb trotzdem beim Negativraum durchgefallen. Claudes eigene Prüfbilder (07-claude-pruefbilder.png) zeigen A noch in der Fassung VOR dieser Änderung; entwurf-1.svg ist die finale Fassung.
- Der Sieg von C beruht vor allem auf dem Negativraum-Kriterium: Laut Claude lassen sich Buchstaben-Innenräume < 6,35 mm "bei acht bis neun Zentimetern Breite gar nicht anders lösen"; C füllt sie mit Navy ("genau das empfiehlt Printful selbst").
- Grund 3 für C (gleicher Look auf jeder Shirtfarbe) ist eine Gestaltungsaussage, kein Printful-Wert.
- Alle drei: K-Arm-Spitze < 1,27 mm (Claude: "nur eine Ecke, nicht einen ganzen Strich").
- Claude nennt als Grenzen: Stichzahl/Tragegefühl der vollen Fläche bei C, wie Printful digitalisiert (nur Probe zeigt es), produktspezifische Fläche, Shirtfarben nur am Bildschirm, Schutzrechte (ähnliche Logos, Name DPMA/EUIPO), Schriftlizenz.
- Nächster Schritt laut Claude: C bei Printful hochladen, Vorschau im Design Maker prüfen, vor Verkaufsstart ein Probeshirt bestellen (= Menschen-/Geld-Schritt, im Lauf nicht gemacht).
- Kein Login, kein Connector, kein Geld verlangt.

## Screenshots und Bilder
Echte claude.ai-Pixel (DOM-Klon ohne Sidebar/nav/aside, Dark Mode, headless Chrome; Leak-Check: keine Sidebar-Chat-Titel, keine Namen/Mails im Bild):
- 01-prompt-mit-anhang.png: Composer mit Anhang "Shirt-Firma Ergebnis Name.md" (47 Zeilen, MD) + Prompt, vor dem Senden (darunter "Projekt", "Opus 5.5 Mittel", "Manuell")
- 02-vorgaben-quellen.png: Zwischentext, Schritt-Zeile mit Mini-Vorschauen, Empfehlung C, "Printful-Vorgaben für Flachstick (mit Quelle)"
- 03-entwuerfe-pruefung.png: Prüftabelle A/B/C (Größe, Farben, Schrifthöhe, Strich, Lücken) + K-Spitzen-Hinweis
- 04-entscheidung.png: "Warum C" mit 3 Gründen
- 05-nicht-pruefen.png: "Was ich nicht prüfen konnte" + nächster Schritt
- 06-quellen-dateien.png: Sources (2 Printful-Links) + Datei-Karten a/b/c + "Alles herunterladen"
- 07-claude-pruefbilder.png: Claudes eigene Prüfbilder check_A/B/C (in Claudes Sandbox mit matplotlib gerastert, grauer Hintergrund), über die claude.ai-Datei-API geladen und untereinander gesetzt; echte Bilder aus dem Lauf, A in der Fassung vor der Änderung. Die Mini-Vorschauen in 02 sind dieselben Bilder (im Klon als data-URL eingesetzt, weil die API-Bilder ohne Login nicht laden).
Hinweis: Die Artifact-Seitenleiste (SVG-Anzeige "Kolonnenshirt c block") blieb im DOM-Klon weiß/leer und ist abgeschnitten.
Lokal gerendert (headless Chrome aus Claudes SVG-Code, weißer Rand, 2000 px breit; KEINE claude.ai-Pixel):
- entwurf-1.png (= A), entwurf-2.png (= B), entwurf-3.png (= C), sieger.png (= C)

## Ein Satz an den Autor
Mit Websuche findet Claude in 4 min 23 s Printfuls Stick-Vorgaben (bis 6 Garnfarben aus 15, Schrift ≥ 6,35 mm, Linien ≥ 1,27 mm, Lücken ≥ 6,35 mm, Brustlogo max. 4" × 4") mit Quelle, zeichnet drei SVG-Logos, misst sie nach und empfiehlt **Entwurf C, den Navy-Block mit weißer Schrift KOLONNEN / SHIRT**, weil nur er keine zu schmalen Lücken hat (Printful rät selbst, sie mit Garn zu füllen), den größten Abstand zu den Mindestwerten hat (9,5 mm Schrift, 1,76 mm Strich) und auf jeder Shirtfarbe gleich aussieht; ehrlich offen: Stichzahl/Steifigkeit der Fläche, wie Printful wirklich digitalisiert (nur Probeshirt zeigt es), Schutzrechte.
