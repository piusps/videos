# Thema Folge „Betriebe“ (Folge 12, intern firma-tag12, Serientag 3, nicht erste Folge)

Slot: 2026-10-30 21:00 (briefing.md, verschoben vom Chef), nicht die erste Folge des Tages → kein „Tag drei“, kein „gestern“.
Fassung: **Autor R2** (2026-10-30) nach `pruefung/autor-runde1.md` (Tickets R1-01 bis R1-08). Vorstände: `pruefung/script-r0.txt` / `script-r1.txt`, `caption-r0.txt` / `caption-r1.txt`, `thema-r0.md` / `thema-r1.md`.

Gründungsschritt: „Heute sucht sie Betriebe in Chemnitz.“ Beantwortet die Übergabe aus Folge 11 „Als Nächstes: Wen spricht sie zuerst an?“ (firma-tag11/script.txt:7) mit der Entscheidung „Fünf würde sie zuerst ansprechen.“ (Lauf: „Zuerst ansprechen würde ich …“, LAUF.md Schlussantwort).
Kettenprüfung: Angebot, Name, Logo, Website-Entwurf und Pflichtliste stehen; das Gewerbe kann nur ein Mensch anmelden (Folge 11). Ohne Kunden kein Umsatz → ein echter Gründer sucht jetzt die ersten Betriebe seiner Zielgruppe (Bau-/Ausbauhandwerk unter zehn Leuten, Folge 2). Eingabe = Ergebnis Folge 11 als Anhang „Shirt-Firma Ergebnis Gewerbe.md“. Kein Sprung, kein Stillstand.
Themenwahl: von der Kette festgelegt (Tagesbriefing, briefing.md). Schmerz: „Wo finde ich meine ersten Kunden, ohne teure Listen?“ Bild: anonymisierte Liste, 20 Zeilen, Top 5 gelb + Karte mit 20 Pins.
Muster: M-002 (Frame 1 = Ergebnis), M-004 (Screenshots), M-007 (Ein-Wort-CTA mit Lieferung), M-011 (Stempel).

## Quellen
- Echter Lauf: `design/lauf/LAUF.md`, `bericht.md`, `liste-text.txt`, `*-anonym.png`; Chat 5d98b9cd…, 2026-10-29 19:15:08–19:20:28 (5 min 20 s), Opus 5.5 Mittel, kein Research, Gedächtnis aus, 26 Websuchen, 10 von 13 Seitenabrufen erfolgreich, kein Konnektor-Aufruf, Datei `Kolonnenshirt_Testregion_Chemnitz.xlsx` (5 Blätter).
- Claude-Funktionen: „+“ zum Anhängen (Screenshot 01), Websuche ohne eigenen Schalter (LAUF.md:5 „Kein eigener Websuche-Schalter; … Claude hat gesucht“), Excel als Datei-Karte „Tabellenkalkulation · XLSX“ (Screenshot 06). Kein Menüpfad gesprochen.
- Folgelauf: `../firma-tag13/design/lauf/LAUF.md` (Prompt „Schreib dann den ersten Werbebrief …“; Ergebnis „Meine Entscheidung: der Brief.“ + `Kolonnenshirt_Werbebrief.docx`).

## Faktentabelle Gesprochen ↔ Lauf (wörtlich) · R2
| Gesprochen | Lauf-Zeile (wörtlich) | Fundstelle |
|---|---|---|
| Eröffnung ohne Tag | — (Vorgabe) | briefing.md:1 „nicht erste Folge“ |
| Rückblick-Satz 1 (fest) | — (Vorgabe, wie Folge 11) | firma-tag11/script.txt:2 |
| „Anmelden kann nur ein Mensch.“ | „Mein letztes Ergebnis: Als Erstes kommt die Gewerbeanmeldung, und die kann nur ein Mensch machen.“; Folge 11 „Als Erstes: Gewerbe anmelden. … Haken: Das kann nur ein Mensch.“ | LAUF.md:14 (Prompt); firma-tag11/script.txt |
| „Heute sucht sie Betriebe in Chemnitz.“ | „**Testregion: Chemnitz mit nahem Umland (bis etwa 20 km)**“; „Finde dort mit der Websuche zwanzig echte … Betriebe“ | LAUF.md:31, :14 |
| „Claude bekommt das letzte Ergebnis, sucht online, baut eine Excel-Liste.“ | „Im Anhang ist mein letztes Ergebnis.“ · „26 Websuchen“ · „Die Excel-Datei „Kolonnenshirt_Testregion_Chemnitz.xlsx“ ist fertig.“ (Bash „Build Excel workbook …“) | LAUF.md:14, :18, :29 |
| „Fünf würde sie zuerst ansprechen.“ | „**Zuerst ansprechen würde ich** … [fünf Betriebe]“ | LAUF.md:43; Blatt „Top 5“ |
| „Warum? Das Shirt ist beim Kunden sichtbar.“ | „Arbeitet bei Kunden innen und außen – das Shirt ist beim Kunden sichtbar.“ (Rang 1); Rang 2 „Dachdecker arbeiten sichtbar von der Straße aus“, Rang 4 „das Team ist dort tagelang sichtbar“, Rang 5 „Monteure arbeiten in Wohnungen und Häusern“; „Warum diese fünf“: Tiefbau zurückgestellt, „weil ihr Team seltener beim Endkunden auftritt“ → gilt für die Auswahl | liste-text.txt Blatt „Top 5“ |
| „Einer stellt ein, braucht also Kleidung.“ | „Sucht laut Anzeige einen Maler, unbefristet ab sofort. Wer einstellt, braucht Kleidung für neue Leute.“ (nur Rang 1) → im Ton jetzt ausdrücklich auf **einen** Betrieb bezogen („Einer …“). „gerade“ bewusst weggelassen: Anzeige „über 30 Tage“ online, ob offen „nicht geprüft“. | liste-text.txt Blatt „Top 5“ Rang 1, Blatt „Nicht geprüft“ |
| „Als Nächstes: Was schreibt sie ihnen?“ | Lauf 12 schreibt nichts: „Als Nächstes könnte ich einen kurzen Werbebrief entwerfen …“. Lauf 13: Prompt „fünf davon spreche ich zuerst an … Schreib dann den ersten Werbebrief“ → „Meine Entscheidung: **der Brief.**“ + Word-Datei. „ihnen“ = die fünf aus dem Satz davor. | LAUF.md:55; firma-tag13 LAUF.md:13, Schlussantwort |
| CTA „Kommentiere „Kunden“, und ich schick dir Frage und Listenvorlage. Damit hast du in zehn Minuten mögliche Firmenkunden für dein eigenes Business.“ | SKILL-Formel vollständig. Guide = Frage A/B + Listenvorlage + Prüfpunkte (prompt-fuer-kommentare.md:3–7, wortgleich). Ergebnis der Frage im Lauf = Liste möglicher Firmenkunden mit Quelle („Nimm nur Firmenangaben“), daher „mögliche Firmenkunden“, kein „Wunschkunden“. Zeit: „Dauer: 5 min 20 s“ + Einfügen/Lesen ≈ 10 min; gilt dank Variante B auch ohne Anhang. | LAUF.md:14, :17 |

Nicht gesprochen (Wortbudget 100), Pflicht im Bild bzw. in Caption/Guide: Region-Warum (s. u.), Haken „Teamgröße meist nur laut Verzeichnis“ (17 von 20), UWG-Hinweis, nicht geprüfte Punkte.

## Entscheidungen + Gründe
- **Entscheidung 1 – Testregion (gesprochen „in Chemnitz“, Warum im Bild, PFLICHT):** Region-Karte im Heute-Beat in Normalgröße: „50 STATT 38“ + klein „Handwerksbetriebe je 10.000 Einwohner · Sachsen vs. Bund · Aroundhome 2026“ (Lauf: „Sachsen kommt auf 50,03 Handwerksbetriebe je 10.000 Einwohner, der bundesweite Durchschnitt liegt bei 38,4.“, LAUF.md:32). Gegenargument nur Caption/Guide.
- **Entscheidung 2 – Top 5 (gesprochen):** „Fünf würde sie zuerst ansprechen.“ Konjunktiv wie Lauf; „sie“ = die KI (Subjekt seit „Heute sucht sie“).
- **Warum (gesprochen):** Grund 1 gilt für die Auswahl („beim Kunden sichtbar“), Grund 2 ist hörbar einem Betrieb zugeordnet („Einer stellt ein …“). Kein Grund hängt an einer Regie-Karte.

## Tickets R1 → Lösung (R2)
| Ticket | Lösung |
|---|---|
| R1-01 Warum | Grund 2 → „Einer stellt ein, braucht also Kleidung.“ (Bezug auf einen Betrieb im Ton); Grund 1 gilt laut Datei für die Auswahl; beide Zeilen wörtlich in der Faktentabelle. |
| R1-02 CTA | SKILL-Formel vollständig: „Kommentiere „Kunden“, und ich schick dir Frage und Listenvorlage.“ Damit-Satz: „mögliche Firmenkunden“ statt „Wunschkunden“ = genau das, was die Frage liefert. caption.txt und prompt-fuer-kommentare.md:3/:7 wortgleich, „Wunschkunden“ 0×. |
| R1-03 Testregion | „Chemnitz“ im Ton („Heute sucht sie Betriebe in Chemnitz.“); hooks.md: Frame 1 Pflicht-Beschriftung „TESTREGION CHEMNITZ“ (ersetzt „TOP 5“); Region-Karte „50 STATT 38“ + Quelle jetzt Pflicht. |
| R1-04 Weg | „Claude bekommt das letzte Ergebnis, sucht online, baut eine Excel-Liste.“ – 3 Verben, Werkzeug Claude, kein Imperativ/„du“, 10 Wörter. |
| R1-05 Rückblick | Satz 2 „Anmelden kann nur ein Mensch.“ (7 Silben, „anmelden“ hörbar); Rechnung mit gemessenen 4,73 s (unten). „Gewerbe anmelden kann nur ein Mensch.“ (10 Silben) hätte 6,5 s gerissen. |
| R1-06 Caption | Frage beginnt „Ich verkaufe [Produkt] an [Zielgruppe].“, enthält „unabhängig von meinem Standort“; „Ein Maler sucht laut Anzeige einen Maler“. |
| R1-07 „Bis dahin“ | in Variante A ersetzt durch „Ich will wissen, wen ich zuerst anspreche.“ |
| R1-08 Frame 1 | hooks.md: Liste nur als Bild-Objekt (Zeilen als Streifen, gelbe betont, kein Lesetext), lesbar erst im Entscheidungs-/Haken-Beat. |

## Für die Regie
- **Frame 1:** siehe hooks.md (Karte 20 Pins, 5 gelb, „TESTREGION CHEMNITZ“; Liste nur als Bild-Objekt).
- **Rückblick-Karte (Satz 2):** Checkliste aus Folge 11 mit Stempel „MENSCH“ auf Gewerbe; Board: GEWERBE offen (kein grüner Haken), BETRIEBE current. **Satzpause zwischen Rückblick-Satz 1 und 2 ≤ 0,2 s** (wie F10 gemessen 0,17 s).
- **Heute-Beat (Pflicht):** Karte Chemnitz + Umland, Pins fallen; Region-Karte „50 STATT 38“ in Normalgröße, klein „Handwerksbetriebe je 10.000 Einwohner · Sachsen vs. Bund · Aroundhome 2026“.
- **Weg-Beat** (auf „Claude bekommt …, sucht online, baut eine Excel-Liste.“): Screenshot 01 (Anhang + Prompt) → 07 („… das Web durchsucht und 24 weitere Schritte“) → 06 Datei-Karte „XLSX“, im Takt der drei Verben. Screenshot 02 nur ohne die Dachdecker-Vergleichszeile.
- **Entscheidungs-Beat:** fünf Pins springen gelb, Liste jetzt lesbar auf Top-5-Zeilen; `04-top5-gruende-anonym.png`.
- **Warum-Karten** (≤ 4 Wörter, nacheinander, je ≥ 1,2 s; vor „Warum?“ Pause bis 0,9 s): 1. „BEIM KUNDEN SICHTBAR“; 2. „STELLT EIN“ auf der Maler-Zeile (Rang 1).
- **Haken-Bild (ohne Ton, Pflicht, unter Übergabe oder Warum-Ende ≥ 1,2 s):** Spalte „Art der Größenquelle“, 17 Zellen „Branchenverzeichnis“ leuchten, Zähler „17 VON 20“. Nie „vier“ oder „16“.
- **Übergabe-Beat:** Board-Feld WERBEBRIEF mit Fragezeichen, keine Betriebsnamen.
- Kein Umsatz-Zähler (0 €). Max. ein neuer Textblock gleichzeitig.
- **TTS-Risikowörter:** „Chemnitz“ (KEM-nitz), „Claude“ (englisch, „Klohd“), „online“, „Excel-Liste“ (EK-sel), „Anmelden“ (Betonung AN-), „Listenvorlage“, „Firmenkunden“, „Business“ (BIS-nis), „Kommentiere“. „Warum?“ steigend, nach „Als Nächstes:“ kurze Pause. Weg-Satz als Dreierreihe mit kurzen Kommapausen.

## Länge (Abschluss-Checks R2, 2026-10-30)
- **Wortzahl:** `wc -w script.txt` = **100** (hart, erreicht).
- **Längster Satz:** fest 15/15; frei **12** („Damit hast du in zehn Minuten mögliche Firmenkunden für dein eigenes Business.“), Weg-Satz 10, sonst 1–9.
- **Rückblick** („Die“ bis „Mensch.“), Kalibrierung `firma-tag10/regie/words.json` (Tempo 1,0): Satz 1 „Die“ 6,807 → „Bestellung.“ 11,533 = **4,73 s**; F10-Satzpause 0,17 s; F10-Satz 2 „Logo: dunkelblauer Block.“ (7 Silben inkl. Doppelpunkt) = 1,54 s. F12-Satz 2 „Anmelden kann nur ein Mensch.“ 7 Silben ohne Doppelpunkt ≈ 1,4–1,55 s → **4,73 + 0,17–0,2 + 1,4–1,55 ≈ 6,30–6,48 s ≤ 6,5 s** ✓ (nur mit Satzpause ≤ 0,2 s; Regie-Vorgabe oben).
- **„Heute“-Start:** F10 „Heute“ bei 13,835 s (Rückblick 6,44 s, Pause davor 0,59 s). F12 identischer Aufbau, Rückblick 6,30–6,48 s → **≈ 13,7–13,9 s** ≤ 14,5 s ✓.
- **Gesamt:** F10 gemessen 100 Wörter in 45,2 s = 133 wpm; F12 ebenfalls 100 Wörter → ≈ 44–47 s, 128–136 wpm (Regie hält ≥ 44,4 s über Pausen, Tempo nie < 1,0).
- **Caption:** **2093 Zeichen** (Python `len`) < 2100 ✓. Ende „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags ✓. CTA-Sätze wortgleich mit script.txt ✓.
- **Abschluss-Greps:** Stadt aus Lauf 11 (`grep -ic hamburg`) script/caption/hooks/prompt = 0 ✓ · Betriebs-/Personennamen (Tokens Spalte „Firma“) = 0 ✓ · Emojis = 0 ✓ · „vier“ script/caption = 0 ✓ · „Wunschkunden“ = 0 ✓ · `[BERUF]` = 0 ✓ · „Bis dahin“ = 0 ✓ · „du“/Imperativ außerhalb CTA = 0 ✓ · „Tag“/„gestern“ = 0 ✓.

## Selbstprüfung als Fremder
- **Nach 5 s:** KI führt 100 Tage allein eine Firma, gemessen wird Umsatz. ✓
- **Nach ~14 s:** Shirts mit Logo für kleine Betriebe; anmelden kann die Firma nur ein Mensch; heute: Betriebe in Chemnitz suchen. ✓
- **Weg gehört:** „Claude bekommt das letzte Ergebnis, sucht im Web, macht eine Excel-Liste.“ ✓
- **Warum:** Diese fünf, weil man ihr Shirt beim Kunden sieht; einer stellt ein und braucht Kleidung. ✓ (kein Grund für alle verallgemeinert)
- **Kommentieren?** Wer an Firmen verkauft: Frage + Listenvorlage → mögliche Firmenkunden in zehn Minuten. ✓

## Offene Risiken
- **Haken nicht gesprochen** (Wortbudget): „Teamgröße meist nur laut Verzeichnis“ steht nur als Pflicht-Bild (17 VON 20) und in Caption/Guide. Wenn der Prüfer ihn im Ton verlangt, kostet er ≥ 6 Wörter → dafür müsste z. B. „in Chemnitz“ wieder raus.
- **„zwanzig“ nicht gesprochen**, nur Bild (20 Pins) und Caption.
- Rückblick ≤ 6,5 s nur mit Satzpause ≤ 0,2 s.
- „sie“ in „Fünf würde sie …“ direkt nach dem Claude-Satz: gemeint ist die KI (= Claude im Lauf), kein Widerspruch, aber kein ausdrückliches „Die KI“.
- Caption 2093 Zeichen: nur 6 Zeichen Reserve.

## Offene Fäden
- Kontakt ist nicht passiert; nichts angeschrieben. Kasse 0 €, kein Zähler.
- Übergabe Folge 13: „Was schreibt sie ihnen?“ (Caption: „Was schreibt sie den fünf?“) → Vorschlag Rückblick-Satz 2 Folge 13: „Fünf Betriebe stehen fest.“ (6 Silben).
- Anonymität: Betriebsnamen, Personen, Straßen, Telefon nie lesbar.
