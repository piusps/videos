GESAMTNOTE: 8/10 (bestanden: kein K.-o., alle Kriterien ≥ 8; Gemini-Review nicht gelaufen, siehe unten)

# Finale Prüfung: Folge „Ärger“ (firma-tag3), tag3-aerger-v7.mp4

Prüfer: frischer firma-pruefer, 2026-10-28, Slot 21:00 (Vorfolge „Kunde“ 18:00). Grundlage: `bewertung.md` (final + Pius-Checkliste) und die Koordinator-Regeln. v7 wurde komplett neu geprüft. Die Berichte zu v5/v6 dienten nur zum Abhaken ihrer Tickets.

Belege in `pruefung/final-v7/`:
- `sheet-01..04.png`: 2 fps, Bogen N beginnt bei (N−1)·12 s, 8 Bilder pro Zeile
- `hook-4fps.png`: 0–6 s
- `hud-1fps.png`, `badge-tl-1fps.png`: HUD und Badge über die ganze Länge
- `f-*.png`: Einzelbilder
- `sync-letztes.png`: Untertitel-Band 10,70–10,97 s, Bild für Bild
- `vs-tag1v7.png`: oben Tag 1 v7, unten v7 bei Frame 15 / 180 / 600 / 1200
- `stt.json`: whisper.cpp medium, ganze Tonspur
- `splice16.wav`, `splice-voice16.wav`, `spec-voice-9-12.png`, `wave-*.png`: Prüfung der Schnittstelle
- `voice-stem.wav`, `music-stem.wav`, `*-S.txt`, `stems.mjs`: Stems mit der Lautstärkekurve aus `mix.mjs` nachgebaut, Kurzzeit-Lautheit

Nicht ausgeführt: `review-video.mjs` (Gemini). Der Auftrag erlaubt keinen externen Dienst.

## Technik
- 1080×1920, 30 fps, 45,50 s (Ziel 40–48 s). Skript 120 Wörter, genau an der Obergrenze.
- −14,0 LUFS integriert, True Peak −1,2 dBFS, LRA 1,9 LU. ✓
- Musik: `music.mp3` in 1-s-Fenstern alle 3 s gegen `gone-original.mp3` korreliert.
  - Ergebnis: r = 0,96–1,00, Versatz konstant 312,000 s.
  - Ein Stück am Stück, kein Loop, kein Sprung. ✓
  - whisper hört im Bett nur „(upbeat music)“, keine Gesangswörter.
- Stimme gegen Musik:
  - Integriert: −18,3 gegen −34,7 LUFS, also **16,4 LU** Abstand. ✓
  - 16,0–18,5 s: 15,8 dB (v6: 13,5–14). ✓ behoben
  - 39,4–41,5 s (CTA): 18,8 dB. ✓ behoben
  - **32,0–34,5 s: 14,8 dB**, Kurzzeit stellenweise 13,5–14,0. Hier wurde nichts geändert, der Keyframe steht unverändert bei 0,13→0,12. Siehe Hinweis 2.
  - 25,4–27,0 s: 13,8 dB. Das ist der gewollte Aufschwung nach dem Stempel „Waschen“, er liegt fast ganz in der Sprechpause 25,89–26,29 s. Kein Problem unter Sprache.
- STT gegen Skript: Wort für Wort gleich. „letztes Ergebnis dran“ (10,55 s), „301“, „60°“, „30°“, „Kommentiere. Ärger.“ (39,40 s). „Research on“ hört whisper nur ohne Kontext, mit vollem Kontext „an“. ✓
- Keine claude.ai-Seitenleiste. Das Fenster zeigt Kopf, Eingabe, „+“-Menü und Bericht-Karte (sheet-01/02/03). ✓
- Kein Umsatz-Zähler: `UMSATZ = 0`, Gate `UMSATZ > 0` in FirmaTag3.tsx:1046. ✓
- Toter Code „MORGEN“ (FirmaTag3.tsx:347) wird nie gezeichnet, weil `next = 0` (Z. 1038). In keinem Bild zu sehen.

## Gespleißtes „letztes“ (9,5–12 s)
- **STT:** whisper hört das Wort 3× unabhängig als „letztes“, einmal auf dem Mix-Ausschnitt, zweimal auf der Stimme allein (davon einmal mit Temperatur 0,4).
- **Pegel (10 ms):** „an“ −12…−17 dB, „letztes“ −13…−25 dB, „Ergebnis“ −12…−23 dB. Kein Sprung. Die Lücken zwischen den Wörtern (−45 dB bei 10,75 s, −46 dB bei 10,91 s) gleichen den übrigen Wortgrenzen.
- **Schnittkanten:** Zwischen 9,50 und 11,88 s gibt es keine digitale Stille, die Einsetzung ist also verblendet. Die Stille-Läufe bei 9,25–9,50 und 11,88–11,97 s sind normale Silence-Cuts, wie an 15 anderen Stellen der Datei auch.
- **Klick-Test:** Die zweite Ableitung im Fenster 11,0–11,5 s liegt bei 12 289, das ist im Bereich normaler Sprachfenster (6,5 s: 12 491, 16,5 s: 12 570). Kein Ausreißer.
- **Spektrogramm** (`spec-voice-9-12.png`): Bei ≈ 11,15 s, an der Grenze „letztes“→„Ergebnis“, steht eine feine Breitband-Linie bis ~20 kHz. Pegel im Band > 16,5 kHz: −45 dBFS. Das liegt auf dem Niveau normaler Zischlaute (42,57 s: −43, 41,40 s: −45). Im fertigen Mix ist das Ereignis nicht unter den 10 lautesten HF-Ereignissen. Es wird von der Musik und dem popLo-SFX bei 10,86 s überdeckt.
- **Tonhöhe:** „an“ ≈ 120 Hz, Betonung auf „LETZ-“ steigt auf ≈ 170 Hz, „Ergebnis“ ≈ 90–165 Hz. Das ist ein natürlicher Listen-Tonfall, kein Stimmbruch.
- **Untertitel:** Die Pill „letztes“ erscheint bei 10,80 s, das Wort beginnt bei 10,805 s (`sync-letztes.png`). ✓
- **Urteil:** Keine hörbaren Artefakte nachweisbar. Ein menschliches Ohr (5 s, Kopfhörer) ist empfohlen, aber kein Blocker.

## Verifikation der Tickets aus v5/v6
| Ticket | Status | Beleg |
|---|---|---|
| HUD vs. Board | behoben | `hud-1fps.png`: alle 46 Sekundenbilder „✓ ✓ 3“. Cover gleich. Kachel „2 ✓ KUNDE HANDWERK“ 5,5–8,0 s |
| „Rest“ + montiertes Zitat | behoben | Gesprochen „Meist: Privatkunden oder unklar.“ (34,2 s). Bild: zwei getrennte Zitate, „Nur eine Beschwerde stammt ausdrücklich von einem Handwerksbetrieb.“ und „Die Belege stammen aber ganz überwiegend von Privatkunden oder von Kunden, die nicht zuzuordnen sind.“ (sheet-03, 32–36 s). Kleinigkeit: Im ersten Zitat ist der Doppelpunkt des Originals zu einem Punkt geworden. Der Wortlaut ist sonst unverändert |
| Produkt früh genannt | behoben | Label „LOGO-SHIRTS“ ab 5,5 s, gesprochen „Shirt-Bestellen“ 8,32 s |
| Aussprache „Kommentiere“ | behoben | STT „Kommentiere. Ärger.“ |
| „gestriges“/„von gestern“ | behoben | STT ohne „gestern/gestrig“. Das Prompt-Fenster beginnt bei „Ich verkaufe Firmenshirts …“ (`f-12.5.png`), der Datei-Chip bleibt. Der Rest des Prompts ist wörtlich wie in LAUF.md. Caption, Replies, Kommentar-Prompt, guidebook.json und guidebook.html enthalten kein „gestern“. Die Kopiervorlage heißt jetzt „mein bisheriges Ergebnis“ |
| Musik 16–18 / 32–34 / 39–41 s | teilweise | 16–18 s und 39–41 s ✓. 32–34,5 s unverändert, 14,8 dB (Hinweis 2) |
| Mobile-App-Satz im Guide | behoben | Kommt in guidebook.json, guidebook.html und PDF (4 Seiten, gleicher Zeitstempel 16:16) nicht mehr vor |

## Koordinator-Regeln
| Regel | Beleg | OK |
|---|---|---|
| Eröffnung wörtlich, kein „Tag N“ danach | STT 0,04–4,8 s: „…ganz alleine führt? Ich probier(e) das aus.“, danach „Ihr Kunde steht“ | ✓ |
| HUD „TAG 1“, Hook-Text, Stempel | Hook-Text 0–1,25 s, „GANZ ALLEINE.“ ab 3,0 s, Badge „TAG 1“ ab 4,75 s (`hook-4fps.png`). Cover gleich | ✓ |
| „als Nächstes“, nicht „morgen“ | Pill „ALS NÄCHSTES“ 37,5–39,4 s, Caption und Guide-CTA. „morgen“ nirgends sichtbar | ✓ |
| Warum sofort, 2–3 Gründe mit echten Zahlen, Karten ≥ 1,2 s | „Warum?“ 26,40 s direkt nach „zuerst das Waschen“. Karte 60 °C ≈ 27,0–32,0 s, Karte 30 °C ≈ 29,5–32,0 s (≈ 2,5 s). Überschrift „WARUM ERST WASCHEN?“ | ✓ (2 Gründe = Minimum) |
| Länge 100–120 Wörter, 40–48 s | 120 Wörter, 45,5 s | ✓ |
| Schritt-Kette | Tag 2 endet mit „Offen bleibt: Was nervt diese Betriebe beim Bestellen?“, Tag 3 beantwortet genau das. Der Lauf hängt das Tag-2-Ergebnis an. Prompt nennt „kleine Handwerks- und Baubetriebe“ | ✓ kein K.-o. |
| Prompt-Beat zeigt „Handwerk“ | `f-12.5.png`: „kleine Handwerks- und Baubetriebe unter zehn Leuten“ orange markiert | ✓ |
| Kein „HANDWERK ?“ am Kachel-Ende | Kachel steht mit ✓ bis zum Schnitt bei 8,0 s | ✓ |
| Schritt 2 in Board/HUD erledigt | Board ✓ ✓, HUD ✓ ✓ durchgehend | ✓ |
| Zahlen 1:1 aus LAUF.md | #1·14 Logo falsch, #1·14 Service, #3·je 12 Größe · Lieferung, #5·10 Druck löst sich, 301 Quellen, 6m 50s, 60 °C / 30 °C, „Nur ein Beleg aus dem Handwerk“. Caption, Kommentar-Prompt und Guide gleich | ✓ |
| Halbsatz Privatkunden | „Meist: Privatkunden oder unklar.“ + Zitat | ✓ |
| Keine Emojis, 6 Replies mit Frage, Caption-Ende | Zeichen-Scan: keine Emojis. replies.json: 1 + 5, alle mit „?“. Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“, danach nur die Hashtag-Zeile | ✓ |
| Musik am Stück, leise, −14 LUFS | siehe Technik | ✓ |
| Keine Seitenleiste mit privaten Chats | sheets 1–4 | ✓ |

## Noten je Kriterium
| # | Kriterium | Note | Begründung |
|---|---|---|---|
| 1 | Eröffnung, Frame 1, Serienrahmen | 8 | Frame 0 zeigt die Hook-Frage und einen leeren Plan mit „?“. Die Eröffnung ist wörtlich |
| 2 | Hook nicht statisch (0–6 s, 4 fps) | 8 | Bis 3,25 s kommt alle ≤ 0,5 s ein Ereignis. 3,5–4,75 s ist knapp: Stempel und Plan stehen, neu sind nur Wort-Pills, Hebel und Board-Glühen. Gerade bestanden, wie in v5/v6 |
| 3 | Schritt-Kette | 9 | Genau die offene Frage aus Tag 2, auf dem angehängten Ergebnis aufgebaut |
| 4 | Board/HUD-Konsistenz | 9 | Durchgehend ✓ ✓, Cover gleich |
| 5 | Fakten- und Serien-Treue | 8 | Alle Zahlen stimmen. Keine Tages-Sprache mehr. Abzüge: „vertragen dreißig“ ohne das „etwa“ aus dem Bericht. Im Bild-Zitat ein Punkt statt Doppelpunkt |
| 6 | Warum-Beat | 9 | Ruhig, 2 nummerierte Karten mit echten Zahlen. „trotzdem“ erzeugt Spannung und wird sofort aufgelöst |
| 7 | Klarheit für neue Zuschauer | 8 | Produkt ab 5,5 s, Kunde und Frage klar. Platz 3 („je 12“) steht nur klein im Bild |
| 8 | Kein Lesetext, höchstens ein neues Label gleichzeitig | 8 | Prompt und Zitat werden im Takt markiert. Die Endkarte mit 3 Schritten kommt gestaffelt. Grenzwertig, ok |
| 9 | Kamera ruhig, Fenster/Board ganz im Bild | 9 | Keine Ruckler, nichts angeschnitten |
| 10 | Kein Beat > 1,5 s ohne Änderung, zweite Hälfte ohne Ton | 8 | Die Ärger-Wand 16–23,5 s lebt nur von Rahmen-Highlights und Gesichtern, sparsam. „Welcher Druck hält 60 °C?“ 36,6–39,4 s: Änderungen bei 37,5 s (Pill) und 39 s (Unterstrich). Ohne Ton verständlich |
| 11 | Ton: Musik, SFX, Aussprache, Schnittstelle | 8 | Integrierter Abstand 16,4 LU, Musik am Stück, SFX abwechslungsreich und auf Wörter gelegt, Splice sauber. Abzug: 32–34,5 s nur 14,8 dB |
| 12 | Untertitel synchron | 9 | „letztes“ 10,80 s gegen 10,805 s. Stichproben 14 / 60 / Privatkunden / Ärger im selben Frame |
| 13 | CTA mit konkretem Wert | 8 | „…damit du in zehn Minuten weißt, was deine Kunden nervt“, Bild „mit Quelle · in 10 Min“ + 3 Schritte. 6m 50s deckt die 10 Min. Das „du“ ist Serienstandard |
| 14 | Caption, Replies, Guide, Kommentar-Prompt | 8 | Menüpfad „unten links „+“ → „Research““, Pläne mit Quelle, Zahlen 1:1, Fiktiv-Hinweis. Guide-Detailsätze sind in LAUF.md belegt. Klein und unbelegt, aber allgemein: Guide-Satz „Ohne Quellen-Grenze landen Werbetexte der Anbieter im Ergebnis“ |
| 15 | Look vs. Tag 1 v7 | 9 | `vs-tag1v7.png`: gleiche Welt, gleiches Licht, Ärger-Wand mindestens so klar. Nicht schwächer |
| 16 | Lesbarkeit (≥ 3 % Bildhöhe) | 8 | Hauptinfos sind groß (Pills, 301-Zähler, Warum-Karten, Endkarte). Rang-Badges „#1·14“, „#3·je 12“ ≈ 1,3 % und Kartentitel ≈ 1,5 % liegen darunter. Sie wiederholen aber nur Gesagtes, außer „je 12“ |
| 17 | Cover | 9 | Hook-Frage, Stempel, Plan ✓ ✓, HUD ✓ ✓, „TAG 1“, „Was nervt die Kunden?“ |
| 18 | Gemini-Review | – | Nicht gelaufen, weil kein externer Dienst erlaubt ist |

## Scroller-Test
- **1 s:** Ja. Die große Umsatz-Frage und ein leerer Plan mit Fragezeichen.
- **3 s:** Ja. Der Plan füllt sich, „GANZ ALLEINE.“ knallt rein.
- **10 s:** Ja. „LOGO-SHIRTS“ und „Was nervt die beim Shirt-Bestellen?“ sind eine klare Frage. Das Claude-Fenster öffnet sich mit Klickpfad. Kein Stolperer mehr bei „gestern“, das Badge „TAG 1“ passt zu „letztes Ergebnis“.

## K.-o.-Status
**Kein K.-o.**
- Schritt-Kette ok.
- Zahlen 1:1 aus LAUF.md.
- Echter Lauf mit Handwerk-Prompt und Tag-2-Anhang.
- Keine erfundenen Zahlen, keine Seitenleiste, kein ChatGPT.
- Keine Tages-Sprache gegen die Serienzählung.
- Kein Zähler bei 0 €.
- Kein falscher Fakt.

## Tickets
Kein Kriterium liegt unter 8, deshalb gibt es kein Pflicht-Ticket.

Nicht blockierende Hinweise, für die nächste Folge oder falls ohnehin neu gemischt wird:
1. **Gemini-Review** (`review-video.mjs`, FINAL_RUBRIC) ist nicht gelaufen. Vor dem Einplanen nachholen (ohne `fix_first`) oder Pius ausdrücklich sagen, dass es entfällt. Das ist ein Punkt der Pius-Checkliste.
2. **Musik 32,0–34,5 s** (Haken/Privatkunden): 14,8 dB unter der Stimme. Nächster Mix: Keyframe `[T.hw2 + 1.2, 0.13]` auf 0.11 und `[T.offen, 0.12]` auf 0.11, dann ≥ 15 dB. Kein Neu-Render nur dafür.
3. **Ohr-Check Splice** 10,4–11,6 s (5 s, Kopfhörer). Messtechnisch ist er sauber, nur bei 11,15 s gibt es einen sehr leisen HF-Transienten.
4. **firma-design Backlog:** Rang-Badges der Ärger-Wand auf ≥ 3 % Bildhöhe (≈ 58 px).
5. **firma-autor Backlog:** Zahlen-Formulierungen mit dem Vorbehalt des Berichts („etwa 30“). Zitate mit Original-Satzzeichen oder als Auszug markiert.

## Entscheidung
**Bestanden, 8/10, darf eingeplant werden.**

Vorbehalt: Das Gemini-Review fehlt (Hinweis 1). Die Note ist ehrlich knapp: Hook, Lesbarkeit und Musik-Abstand liegen genau auf 8. Alle Tickets aus v5/v6 sind erledigt, bis auf den Musik-Abstand bei 32–34 s, der ist nur teilweise behoben. Das gespleißte „letztes“ ist sauber.
