# Prüfung autor · Folge 15 „Welche Adresse stimmt?“ · Runde 1

Prüfer: firma-pruefer (fremder Agent, nicht der Autor), 2026-10-31, Eilauftrag. Maßstab: bewertung.md „autor“ (inkl. K.-o.), `runs/firma-tag9/tagesbriefing-2026-10-30.md` (inkl. Chef-Entscheid Rückblick ≤ 6,5 s, Z. 56), `briefing.md`, Textregeln 2026-10-30. Beleg des Laufs: `design/lauf/LAUF.md`, `bericht.md`, `prompt.txt`, `liste-text.txt` (nur Abgleich). Vergleich: `runs/firma-tag14` (R1 bestanden 8,5), Zeitmessung aus `firma-tag13/words.json` und `firma-tag14/words.json`. Muster M-002/M-004/M-007/M-011 in `SPY/muster.md:29/45/69/101` vorhanden.
Nicht geprüft (Eile): Kommentare der Vorfolgen, Support-Links nicht neu geöffnet (keine neue Funktionsbehauptung im Skript).

## Messwerte
- `wc -w script.txt` = **99** (85–100 ✓).
- Satzlängen (frei): max. 9 Wörter („Als Nächstes: Wie kommen die Adressen in den Brief?“, script.txt:10); feste Sätze 15/15, CTA 7/8 ausgenommen. Alle ≤ 12 ✓.
- „Tag“/„gestern“ in script.txt und caption.txt: 0 ✓. „du“/Imperativ außerhalb CTA: 0 ✓.
- Caption: `wc -m` = **1960** < 2100 ✓; endet mit „(Fiktives Experiment, keine echten Umsätze.)“, danach nur Hashtags ✓.
- Zeichen > U+2500 (Emoji-Check) in allen 7 Dateien: 0, außer „✓“ (U+2713, Dingbat, kein Emoji) in thema.md – nur intern, nicht öffentlich ✓.
- Namen/Orte/Registernummer (Abgleich `liste-text.txt`: 5 Betriebsnamen, Inhaber, Sitz-Ort außerhalb Chemnitz, HRA-Nummer, PLZ; dazu Hamburg, boilr) in script/caption/hooks/prompt/replies: **0 Treffer** ✓. „North Data“ nur in thema.md (intern, Design-Karte) ✓.
- **Rückblick-Zeit (Befund):** hooks.md:16 und thema.md:28/75 zählen „Eine von fünf Adressen sicher.“ mit **8** Silben. Richtig sind **9** (Ei-ne | von | fünf | A-dres-sen | si-cher). Kalibrierung an echten Wortzeiten: Folge 13 Rückblick („Die“ 6,588 → „Betriebe.“ 12,85) = 6,26 s bei 7 Silben in Satz 2; Folge 14 („Die“ 6,251 → „steht.“ 12,437) = 6,19 s bei 5 Silben; Satz 1 allein 4,86 s, Satz 2 ≈ 0,2–0,25 s/Silbe. → 9 Silben ≈ 1,9–2,1 s → **Rückblick ≈ 6,8–7,0 s > 6,5 s** (Chef-Regel tagesbriefing Z. 56). „Heute“ ≈ 13,6–13,8 s (< 14,5 ✓).
- „1.8.2022 / gebührenfrei“ (grep über alle Dateien inkl. design/lauf): **1 Treffer**, prompt-fuer-kommentare.md:12. Nicht im Lauf belegt (LAUF.md:29 / liste-text.txt:54 sagen nur Claudes „AD (aktueller Abdruck, kostenlos)“, „Nicht von Claude ausprobiert“). Nicht in Caption/Skript ✓.

## Faktenabgleich Skript ↔ Lauf
| Skript | Lauf | ok |
|---|---|---|
| Eine von fünf Adressen sicher. | Lauf 14: „Eindeutig belegt ist allerdings nur eine.“ | ✓ inhaltlich, ✗ hörbar (s. Neueinstieg) |
| Heute prüft sie nach. | prompt.txt „Klär … welche Adresse je Betrieb stimmt“ | ✓ |
| Claude: Liste angehängt, Websuche. | LAUF.md:4/8 XLSX-Anhang, 18 Websuchen | ✓ |
| Bei einem streiten Impressum und Register. | Lauf 14 LAUF.md:23 „Impressum … vs. Abschrift Handelsregister-Bekanntmachung **bei Drittanbieter**“ | ✓ belegt, aber „Register“ klingt amtlich |
| Sie glaubt dem Impressum. | LAUF.md:22 „Das Impressum … stimmt also noch.“ | ✓ |
| Warum? Die Register-Abschrift war alt. | LAUF.md:22 „Anschrift aus der Ersteintragung von 2014“ | ✓ |
| Ein neuerer Eintrag bestätigt das Impressum. | LAUF.md:22 „Eintragung Nr. 3 … 08.09.2015“, **gelesen nur bei North Data** (LAUF.md:17) | ✓ Inhalt, ✗ Quelle beim Hören unsichtbar → Hörer macht „im Handelsregister nachgesehen“ daraus |
| Vier Briefe können raus, einer nach Postleitzahl-Check. | LAUF.md:21 Kernsatz; Excel 4 × „Ja“, 1 × „Ja mit Vorbehalt“ | ✓ (Hinweis: 5 × „Belegt“ teils nur über Verzeichnis-Suchtreffer, LAUF.md:36 – nicht gesprochen, ok) |
| Als Nächstes: Wie kommen die Adressen in den Brief? | Lauf beantwortet es nicht; Legende „Blatt Empfaenger als Datenquelle“ | ✓ offene Frage mit Objekt |

## Hörtest (nur Ton, kein Bild)
- script.txt:2 „…an kleine Betriebe, bestickt erst auf Bestellung. Eine von fünf Adressen sicher.“ → Ein Neuer weiß nicht, wessen Adressen und wofür (Kunden? Filialen? Lieferadressen?). Das Wort „Brief“ fällt zum ersten Mal in script.txt:9 (≈ 33 s). Ohne Verb zusätzlich abgehackt.
- script.txt:3 „Heute prüft sie nach.“ → Objekt fehlt; was geprüft wird, ergibt sich nur aus dem unklaren Satz davor. Projekt + heutiger Schritt sind bei 14 s nur halb verstanden (Schritt = „etwas nachprüfen“).
- script.txt:4 „Claude: Liste angehängt, Websuche.“ → Serien-Konvention aus Folge 14, „Liste“ verständlich, sobald „Adressen“ klar ist. ok.
- script.txt:5 „Bei einem streiten …“ → „einem“ hat kein hörbares Bezugswort (letzte Nomen: Liste, Websuche – feminin). Erst „Betriebe“ aus Satz 2 (≈ 15 s zurück) passt. Zusätzlich TTS-Risiko „streiten/streichen“ (thema.md:69).
- script.txt:6 „Sie glaubt dem Impressum.“ → „Sie“ = die KI (Serien-Konvention), nach „Impressum und Register“ eindeutig. ok.
- script.txt:8 „Ein neuerer Eintrag …“ → Hörer ergänzt „im Register“, also amtlich. Der Haken (nur Datendienst) steht nur in Bild und Caption.
- script.txt:9 „einer nach Postleitzahl-Check“ → verständlich („ein Brief erst nach PLZ-Prüfung“). ok.

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 9 | script.txt:1 feste Eröffnung wortgleich |
| Neueinstieg ≤ 14 s (Projekt + heutiger Schritt), hörbar eindeutig | **7** | script.txt:2–3: „Adressen“ ohne Brief-Bezug, „Heute prüft sie nach.“ ohne Objekt; erstes „Brief“ erst script.txt:9; thema.md:79 räumt ein, dass nur das Bild es trägt (Lehre 13 verlangt: beim Zuhören eindeutig) |
| Mehrwert: nachbaubar, Beginn ≤ 14 s, heute umsetzbar | **7** | caption.txt:7 Prompt ist gekürzt gegenüber prompt.txt, ohne „Gib mir die aktualisierte Excel-Datei zurück.“, aber caption.txt:8 verlangt „Die neue Spalte „Versand“ lesen“ – mit dem Caption-Prompt nicht garantiert (ungetestete Abwandlung). Guide Variante A = echter Prompt ✓ |
| Thema: Schmerz + Ergebnis in einem Bild | 8 | „Zwei Quellen, zwei Adressen – welche, bevor ich Porto zahle?“ (thema.md:5) eher Gründer- als Handwerker-Schmerz; Ergebnisbild Versand-Spalte 4 × grün/1 × gelb stark (hooks.md:9) |
| Hook (Satz 2 + Frame 1, Muster) | 8 | Frame 1 = fertige Liste, Ton = „nur eine sicher“ → Frage „wie?“; M-002/M-011 vorhanden. Satz 2 hörbar schwach (s. o.) |
| Entscheidung + Warum (2–3 konkrete Gründe) | 8 | script.txt:6–8: Alternative hörbar, 2 Gründe (Abschrift alt, neuerer Eintrag). Eigentlich ein Argument in zwei Hälften; „seitdem keine Änderung“ (LAUF.md:22) nur in Caption |
| Schritt-Kette | 9 | Übergabe F14 „Welche Adresse stimmt?“ (firma-tag14/script.txt:9) → genau dieser Schritt; Eingabe = XLSX aus Lauf 14 unverändert (LAUF.md:8) |
| Faktentreue / Quellenart (nur North Data) | **6** | script.txt:5/8 klingt nach Handelsregister, Quelle nie gesprochen; caption.txt:3 „Abschrift aus dem Handelsregister“ (in Lauf 14 eine Bekanntmachung bei Drittanbieter, firma-tag14 LAUF.md:23); caption.txt:14 „Registereintrag“ ohne Zusatz, Klärung erst caption.txt:16; prompt-fuer-kommentare.md:12 „seit 1.8.2022 gebührenfrei“ aus dem Gedächtnis; prompt-fuer-kommentare.md:7 Versand-Ja-Regel „zusätzlich Handelsregister“ 1:1 ohne Hinweis, dass das North Data war |
| Kommentar-Mechanik / CTA | 8 | script.txt:11 Lieferung „Prüffrage“ = Guide Punkt 1–2 (prompt-fuer-kommentare.md:5–10) ✓, Caption „Versand-Regeln“ = Guide Punkt 2 ✓. „sichere Adressen“ leicht optimistisch (Folge zeigt selbst 1 × Vorbehalt, kein amtlicher Abruf) |
| Länge / Satzlänge / Tempo / Rückblick-Zeit | **7** | 99 Wörter ✓, max. 9 Wörter/Satz ✓, ≈ 44–45 s ✓; aber Rückblick-Satz 2 hat 9 statt 8 Silben (hooks.md:16 falsch gezählt) → Rückblick ≈ 6,8–7,0 s > 6,5 s (Kalibrierung firma-tag13/14 words.json) |
| Serien-Regeln (Eröffnung ohne Tag, kein gestern, kein du außerhalb CTA, Stand, offene Frage) | 9 | script.txt:1 wortgleich, 0 × Tag/gestern, kein Umsatz-Zähler (hooks.md:9) |
| Caption-Regeln | 8 | 1960 Zeichen, Ende korrekt, keine Emojis, Menüpfad („neuer Chat“, „+“), Haken + Menschen-Schritt (caption.txt:16) |
| replies.json | 9 | alle 6 Antworten enden mit „?“, keine Emojis/Namen, Bezug zur Folge |
| Datenschutz (Namen/Adressen) | 10 | 0 Treffer (s. Messwerte); Guide-Abnahme mit Grep-Checks (prompt-fuer-kommentare.md:27) |

## K.-o.-Liste
| K.-o. | verletzt? |
|---|---|
| Zuschauer außerhalb CTA direkt angesprochen | nein |
| „Tag N“/„gestern“ in Nicht-Erstfolge | nein |
| > 100 Wörter / freier Satz > 12 | nein |
| Ergebnis nicht aus echtem Lauf | nein |
| Unbelegte Claude-Behauptung | nein im Skript/Caption (Inhalt belegt); **Grenzfall** prompt-fuer-kommentare.md:12 (Autor-Behauptung „seit 1.8.2022 gebührenfrei“, intern, noch nicht veröffentlicht) → Ticket, kein K.-o. |
| ChatGPT statt Claude | nein |
| Unlieferbares Versprechen | nein (Prüffrage + Versand-Regeln liegen vor) |
| Erwähnung „niemand kommentiert“ | nein |
| Echte Namen/Adressen / Hamburg / Registernummer | nein |
| Caption ≥ 2100 / falsches Ende / Emojis | nein |
| Rückblick ≤ 6,5 s (Chef-Regel) | **Risiko** (Schätzung 6,8–7,0 s, Regie misst) → Ticket |
| Neueinstieg ≤ 14 s | **Grenzfall** (nur mit Bild verständlich) → Ticket |

## Tickets (Note < 8)

TICKET autor-R1-01 → firma-autor
Kriterium: Neueinstieg ≤ 14 s, hörbar eindeutig + Rückblick-Zeit · Note: 7/10
Beleg: script.txt:2–3, hooks.md:16, thema.md:28/75
Problem: „Eine von fünf Adressen sicher.“ sagt beim reinen Hören nicht, dass es um Briefadressen geht, hat 9 (nicht 8) Silben und schiebt den Rückblick auf ≈ 6,8–7,0 s; „Heute prüft sie nach.“ hat kein Objekt.
Soll: script.txt:2 Satz 2 → „Fünf Briefe, einer sicher.“ (4 Wörter, 7 Silben = Folge-13-Länge, Rückblick ≈ 6,3 s); script.txt:3 → „Heute prüft sie die Adressen.“ (5 Wörter). Netto ±0 Wörter. hooks.md/thema.md Silbenzahl korrigieren. Prüfbar: „Brief“ fällt vor 14 s, Rückblick („Die“ bis Satzende 2) ≤ 6,5 s in words.json.

TICKET autor-R1-02 → firma-autor
Kriterium: Faktentreue / Quellenart (Skript) · Note: 6/10
Beleg: script.txt:5, script.txt:8; LAUF.md:17
Problem: „Bei einem streiten …“ hat kein hörbares Bezugswort, und „Ein neuerer Eintrag bestätigt das Impressum.“ lässt den Hörer „im Handelsregister nachgesehen“ verstehen, obwohl Claude den Eintrag nur bei North Data las.
Soll: script.txt:5 → „Ein Betrieb: Impressum gegen Register.“ (5 Wörter, −1, „streiten“-TTS-Risiko entfällt); script.txt:8 → „Laut Firmendatenbank bestätigt ein neuerer Eintrag das Impressum.“ (8 Wörter, +2). Zusammen mit R1-01: **100 Wörter** (wc -w der Gesamtfassung geprüft), alle freien Sätze ≤ 8 Wörter. Regie: Pausen so setzen, dass ≤ 135 wpm bleibt (≈ 44,5–46 s).

TICKET autor-R1-03 → firma-autor
Kriterium: Faktentreue / Quellenart (Caption) + Mehrwert · Note: 7/10
Beleg: caption.txt:3, caption.txt:7–8, caption.txt:14; firma-tag14 LAUF.md:23
Problem: Die Caption nennt zwei Drittanbieter-Quellen „Abschrift aus dem Handelsregister“/„Registereintrag“ ohne Zusatz, und der Caption-Prompt fordert keine Excel-Datei zurück, obwohl Schritt 3 die Spalte „Versand“ voraussetzt.
Soll: caption.txt:3 „eine Abschrift aus dem Handelsregister verschiedene“ → „eine Register-Abschrift bei einem Drittanbieter verschiedene“; caption.txt:7 vor dem schließenden „““ ergänzen: „ Gib mir die aktualisierte Excel-Datei zurück.“; caption.txt:14 → „- Ein späterer Registereintrag von 2015, gelesen bei einem Datendienst, nennt die Adresse aus dem Impressum. Seitdem keine Änderung.“ Ergebnis: **2047 Zeichen** (< 2100, gerechnet), Ende unverändert.

TICKET autor-R1-04 → firma-autor
Kriterium: Faktentreue (Guide-Übergabe) · Note: 6/10
Beleg: prompt-fuer-kommentare.md:12, prompt-fuer-kommentare.md:7
Problem: „Abruf laut handelsregister.de seit 1.8.2022 gebührenfrei“ ist aus dem Gedächtnis ergänzt und im Lauf nicht belegt; die Versand-Ja-Regel „(… zusätzlich Handelsregister)“ wird 1:1 übernommen, obwohl Claude das Register nur über North Data las.
Soll: Z. 12 Klammer ersetzen durch „(Lauf hat es nicht ausprobiert; „kostenlos“ ist Claudes Angabe. Gebührenfreiheit nur nennen, wenn die Guide-Stufe sie auf handelsregister.de findet und die URL verlinkt, sonst streichen.)“; Z. 7 nach „zusätzlich Handelsregister“ einfügen „ [im Lauf: gelesen bei North Data, nicht im amtlichen Register]“. Prüfbar: `grep -c "2022" prompt-fuer-kommentare.md` = 0 oder mit Quell-URL daneben.

## Hinweise (keine Pflicht, Kriterien ≥ 8)
- **H-1 (Autor, CTA):** „Damit hast du in zehn Minuten sichere Adressen.“ ist an der Kante (1 × Vorbehalt, kein amtlicher Abruf). Soll, falls Wortbudget nach R1-01/02 es zulässt (sonst so lassen): „Damit weißt du in zehn Minuten, welche Briefe raus können.“ (+2 → 102, also nur mit Kürzung an anderer Stelle; derzeit nicht Pflicht). Caption caption.txt:20 analog „…weißt du in 10 Minuten, welche deiner Briefe raus können.“
- **H-2 (Autor, Warum):** Dritter Grund liegt im Lauf („Seitdem gab es keine weitere Änderung der Anschrift.“, LAUF.md:22) und steht schon in caption.txt:14 – im Skript nicht nötig, Warum-Karten der Regie dürfen ihn als dritte Karte „SEITDEM KEINE ÄNDERUNG“ (3 Wörter) zeigen.
- **H-3 (Regie):** Bei 100 Wörtern Tempo-Kante: Pausen 0,4–0,7 s, vor „Warum?“ bis 0,9 s; „Firmendatenbank“ (FIR-men-da-ten-bank) und „Fünf Briefe, einer sicher“ (Komma als kurze Pause) per create_speech testen; „Register“ (Re-GIS-ter).
- **H-4 (Design):** Karte „gelesen bei North Data“ (thema.md:57) bleibt, passt jetzt zum gesprochenen „Laut Firmendatenbank“.
- **H-5 (intern):** briefing.md:6 zitiert „Zwölf-Uhr-Video“ (aus Folge 14 übernommen), Slot ist 15:00 (briefing.md:1) – nur Doku-Unschärfe.

## Urteil
**Nicht bestanden.** Gesamtnote **7,5/10** (Folge 14: 8,5). Kein harter K.-o., aber vier Kriterien < 8 (Neueinstieg 7, Mehrwert 7, Faktentreue 6, Länge/Rückblick 7). Tickets autor-R1-01 bis -04 an firma-autor; alle Soll-Texte wörtlich, Skript nach Umsetzung 100 Wörter, Caption 2047 Zeichen.
