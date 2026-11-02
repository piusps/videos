# Prüfung Autor · Folge 16 (firma-tag16) · Runde 1

Prüfer: frischer Prüf-Agent (firma-pruefer, Subagent), 2026-10-31. Nur geprüft, nichts am Autor-Text geändert.
Geprüft: briefing.md, thema.md, hooks.md, script.txt, caption.txt, prompt-fuer-kommentare.md, replies.json, design/lauf/LAUF.md + bericht.md (+ prompt.txt), gegen runs/firma-tag9/tagesbriefing-2026-10-30.md, runs/firma-tag15/script.txt + design/lauf/LAUF.md, runs/firma-tag13/design/lauf/LAUF.md, references/bewertung.md (autor).

## Messwerte
- script.txt: 98 Wörter (`wc -w`) ✓ (85–100).
- Sätze: frei max. 8 Wörter („Als Nächstes: Was kostet der Versand der Shirts?“, „Damit hast du in zehn Minuten eigene Serienbriefe.“); feste Sätze 15 ✓.
- Kein „Tag“, kein „gestern“ (grep 0) ✓.
- Caption 1962 Zeichen ✓ (≤ 2100), Ende „(Fiktives Experiment, keine echten Umsätze.)“ + Leerzeile + nur Hashtags ✓, 0 Emojis ✓.
- Außerhalb des CTA kein Imperativ/„du“ ✓.

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer Zuschauer versteht in 5 s, worum es geht | 9 | script.txt:1 (feste Eröffnung) |
| Neueinstieg / Rückblick (Produkt + Stand, Projekt + heutiger Schritt bis 14 s) | **7** | script.txt:2 „Fünf Briefe, Adressen geprüft.“ → Ticket T-01 |
| Schritt-Kette (startet beim Ergebnis Folge 15, genau nächster Schritt) | 9 | Übergabe Folge 15 „Wie kommen die Adressen in den Brief?“ = script.txt:3 wörtlich; Lauf 16 Eingabe = Brief Lauf 13 + Liste Lauf 15 |
| Mehrwert (nachbaubar mit Claude, Beginn ≤ 14 s, heute umsetzbar) | 9 | script.txt:4; Caption Schritte 1–3; Guide Variante A = echter Prompt |
| Thema/Schmerz (Copy-Paste von Adressen), Ergebnis in einem Bild | 9 | thema.md „Schmerz“; Frame 1 fünf Briefseiten |
| Hook (Satz 2 + Frame 1 erzeugen Frage, Muster) | 8 | hooks.md Frame 1 (gelbe Lücken → warum?), M-002/M-011 |
| KI-Entscheidung mit Warum (2–3 Gründe) | 8 | script.txt:6–8: Entscheidung „nur vier Felder“, Gründe „Nur die stehen in der Liste“ + „Absender, Datum, Versandkosten fehlen in beiden Dateien“ (LAUF.md „Pro Brief nur Felder aus der Empfängerliste“, „Weder Brief noch Liste nennen …“) |
| Nur Belegtes / Fakten | 9 | Faktentabelle thema.md vollständig gegen LAUF.md geprüft: 1 min (12:14:16–12:15:16), 5 Briefe, 4 von 14 Platzhaltern, 10 gelb, Prüfdatum nicht als Briefdatum ✓. Nie „versandfertig“, „vier Briefe“, „amtlich“ ✓ |
| Übergabe (offene Frage mit Objekt, sauber abgeleitet, hörbar eindeutig) | 8 | siehe Sonderpunkt 1 |
| Kommentar-Mechanik / CTA mit konkretem Wert | 9 | script.txt:10; prompt-fuer-kommentare.md fertig, verspricht nur Prompt + Weg + Regel; replies.json 6 Antworten, je eine Frage, keine Emojis |
| Länge / Sätze / Tempo-Plan | 9 | 98 Wörter, Schätzung ≈ 44 s / ≈ 133 wpm, „Heute“ ≈ 13,5–14 s |
| Caption | 9 | Menüpfad („+“, Word + Excel anhängen), Prompt, Haken, Fiktiv-Hinweis, Hashtags ✓ |
| K.-o.-Kriterien | keins verletzt | kein Zuschauer-Direktansprache außerhalb CTA, echter Lauf, Claude (nicht ChatGPT), kein unlieferbares Versprechen, keine Kommentar-Erwähnung |

**Ergebnis: nicht bestanden (1 Kriterium = 7).** Ein Ticket an firma-autor.

## Sonderpunkt 1: Übergabe „Als Nächstes: Was kostet der Versand der Shirts?“
- **Ableitung sauber:** Sie ist nicht wörtlich aus Lauf 16 (dort kein „Als Nächstes“), aber direkt aus dem offenen Platzhalter „Versand: [Versandkosten und Lieferzeit ergänzen]“ (LAUF.md 16, „Was offen bleibt“), der schon im Brief aus Lauf 13 steht. Lauf 13 sagt dazu wörtlich „Versandkosten und Lieferzeit: Die kenne ich nicht. Ohne sie wirkt „109 €“ womöglich wie ein Endpreis.“ und führt „Versandkosten/Lieferzeit (Printful)“ als offenen Punkt. Der Platzhalter meint also eindeutig den Versand der Shirts an den Kunden, nicht das Briefporto. Die Übergabe ist eine Frage, keine Behauptung; der Zusatz „den die KI selbst klären kann“ steht nur intern (bericht.md), nicht im Video ✓.
- **Hörbar eindeutig:** „der Versand der Shirts“ nennt das Objekt; Porto der Briefe kann man darin nicht hören ✓. Restrisiko liegt eine Zeile davor: „Absender, Datum, Versandkosten fehlen in beiden Dateien.“ In einem Satz über Briefe kann ein Hörer „Versandkosten“ kurz als Briefporto verstehen. Die Übergabe direkt danach löst das auf, und ein Umbau kostet 2 Wörter (Budget 100). **Kein Ticket**, aber Auflage an Regie/Design: Karte auf „Versandkosten“ zeigt den Brief-Platzhalter „[Versandkosten und Lieferzeit]“ neben einem Shirt/Paket, nie Briefmarke/Porto/Umschlag. Note 8.

## Sonderpunkt 2: „Fünf Briefe, Adressen geprüft.“
- **„geprüft“ stimmt mit Folge 15:** Folge 15 sagt selbst „Heute prüft sie die Adressen.“; die Excel aus Lauf 15 hat Spalte „Geprueft_am“ (31.10.2026), alle fünf „Belegt“, Versand 4 × Ja, 1 × Ja mit Vorbehalt. „Geprüft“ beschreibt die Tätigkeit, behauptet weder „amtlich“ (nur North Data) noch „alle sicher“. Der PLZ-Vorbehalt geht verloren, ist aber Nebeninfo und steht in der Caption („Bei einem Brief soll die Postleitzahl vor dem Druck noch geprüft werden.“). Akzeptabel ✓.
- **„Fünf Briefe“ ist beim reinen Zuhören falsch verstehbar (Lehre 13):** Stand nach Folge 15 ist EIN Werbebrief (Word mit Platzhaltern) und eine Liste mit fünf Adressen, nicht fünf Briefe. Wer nur hört, versteht: fünf Briefe gibt es schon, Adressen sind geprüft. Dann klingt „Heute kommen die Adressen in den Brief.“ (Singular) wie ein Widerspruch, und das Ergebnis „Nach einer Minute: fünf Briefe.“ wie kein Fortschritt, weil der Rückblick die fünf Briefe schon genannt hat. Damit ist der heutige Schritt bis 14 s nicht eindeutig. → Ticket T-01.

## TICKET autor-R1-01 → firma-autor
Kriterium: Neueinstieg / Rückblick · Note: 7/10
Beleg: script.txt:2 „Fünf Briefe, Adressen geprüft.“ (hooks.md Variante A)
Problem: Der Rückblick nennt „fünf Briefe“ als Stand, obwohl erst heute aus einem Brief fünf werden; beim Hören wirken „in den Brief“ und „Nach einer Minute: fünf Briefe“ dadurch widersprüchlich bzw. ohne Fortschritt.
Soll: Rückblick-Satz 2 nennt den echten Stand (ein Brief + fünf geprüfte Adressen), ≤ 8 Silben, Zahl an ein Substantiv gebunden, kein „Ihr/Ihre“, kein „sicher/amtlich“; Vorschlag „Ein Brief, fünf Adressen geprüft.“ (5 Wörter, 8 Silben). Script bleibt 85–100 Wörter (dann 99), hooks.md/thema.md (Faktentabelle, Risikowörter, Selbstprüfung) nachgezogen; Caption-Stand passt bereits.

## Auflagen an Regie/Design (kein Ticket)
- „Versandkosten“-Beat: Shirt-/Paket-Versand zeigen, nie Briefporto (siehe oben).
- Rückblick ≤ 6,5 s bei 8 Silben knapp: Pause nach Satz 1 kurz halten, nicht beschleunigen.
- „Aber sie füllt nur vier Felder.“: „vier Felder pro Brief“ im Bild klar machen (eine Briefseite, 4 grün), damit niemand „vier Briefe“ hört.
