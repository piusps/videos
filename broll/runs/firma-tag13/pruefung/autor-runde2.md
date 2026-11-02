# Prüfung autor · Folge 13 „Werbebrief“ · Runde 2

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-30. Auftrag: Fehler finden. An den Autor-Dateien nichts geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md (Fassung R1 in pruefung/*-r1.*).
Maßstab: bewertung.md „autor“; firma-tag9/tagesbriefing-2026-10-30.md inkl. Chef-Entscheide; firma-tag4/tagesbriefing-2026-10-29.md Regeln 1–8; firma-tag13/briefing.md; firma-autor SKILL (Z. 17–44, CTA-Formel Z. 25).
Belege: design/lauf/LAUF.md, bericht.md, brief-text.txt; Vorfolge firma-tag12/script.txt; Maßstab firma-tag8/9/10/11/12 script.txt + words.json; Präzedenz firma-tag12/pruefung/autor-runde3.md.

## Messwerte
- `wc -w script.txt` = **100** (hart ≤ 100 ✓, null Reserve).
- Sätze (Wörter): fest 15 / 4 / 15; frei 3 · 6 · 7 · 7 · 1 · 6 · 3 · 5 · 3 · 6 · 8 · **11** (CTA-Satz 2) → alle ≤ 12 ✓. „du/dir“ nur in script.txt:11–12 (CTA) ✓. Kein „Tag drei“ ✓ (Slot 21:00, nicht erste).
- Rückblick-Satz 2 „Liste: zwanzig Betriebe.“ = 7 Silben ✓ (≤ 11).
- Zeit, Autor-Rechnung (thema.md:73–78): Rückblick 6,0–6,4 s, „Heute“ 12,4–13,4 s, gesamt 45,3–47,9 s bei Pausen 0,4–0,6 s. Gegenprobe mit echten words.json der 100-Wort-Folgen: „Die“ startet bei 6,46 / 6,52 / 6,81 s (F12/F11/F10; Autor-Modell 6,0–6,3 s, also zu knapp angesetzt), „Heute“ bei 12,93 / 13,23 / 13,84 s, Satz 2 dort 6–8 Silben wie hier → Rückblick ≈ 5,9–6,3 s ✓ (≤ 6,5), „Heute“ ≈ 13,0–13,5 s ✓ (≤ 14,5). Gesamtlänge der 100-Wort-Folgen: 44,19 / 44,48 / 45,43 s = **135,8 / 134,9 / 132,1 wpm** → 40–48 s ✓, 120–135 wpm nur knapp (F12 lag mit 135,8 schon drüber). Plausibel, aber Regie darf die Pausen nicht unter ~0,5 s mitteln (Hinweis H-03).
- caption.txt: **2074 Zeichen** (Python `len`, ohne Schluss-Umbruch; 2075 mit) ✓ < 2100. Endet mit „(Fiktives Experiment, keine echten Umsätze.)“ + Leerzeile + 6 Hashtags ✓.
- Emojis: script/hooks/caption/prompt 0 ✓ (thema.md nur „✓“ in internen Notizen, nicht für Zuschauer).
- `grep -i hamburg` in allen 5 Prüflingen: 0 ✓. Personenname aus LAUF.md:43 (Vor-/Nachname): 0 ✓. Betriebsnamen: 0 ✓. `[BERUF]`: 0 ✓. „boilr“ nur in Verbotszeilen (thema.md:69, prompt-fuer-kommentare.md:23) ✓.
- LAUF.md-Zitate in thema.md (Z. 8, 10, 13, 16, 17, 25, 29–31, 34–36, 41, 45, 48) und brief-text.txt Z. 12/13 nachgeprüft: korrekt ✓.

## Die vier Kürzungen
1. **Gesprochener Haken entfallen** (script-r1.txt:9 „Haken: Versandkosten fehlen.“ → nur Bild/Caption). **Laut Skill/Briefing keine Pflicht:** Weder firma-autor SKILL, bewertung.md „autor“, Tagesbriefing 10-30, Regeln 1–8 (10-29) noch briefing.md verlangen einen gesprochenen „Haken:“-Satz (grep über alle firma-Skills: kein Treffer). Pflicht ist „Grenzen von ‚ganz alleine‘ ehrlich zeigen“ (SKILL:27) und „nichts als erledigt erzählen“. Das bleibt erfüllt: Nichts wird als abgeschickt erzählt, CTA sagt „Briefentwurf“ (script.txt:12), die Übergabe „Wohin gehen die Briefe?“ (script.txt:10) macht hörbar, dass der Brief noch nicht rausgehen kann, Caption:17 nennt Versand + Absender/Empfänger-Platzhalter. Abweichung von der Serien-Gewohnheit (F8–F12 sprechen alle „Haken:“) und vom Briefing-Gefühl „Ein Brief, den ich so abschicken könnte“ (briefing.md:8) → kein Ticket, aber Note 8 und Hinweis H-01 zum Bildplan (das unvertonte „ERGÄNZEN“-Bild kollidiert mit dem Warum-Beat).
2. **CTA ohne „und“, „fürs eigene Business“**: Formabweichung von SKILL:25 („…, und ich schick dir … für dein eigenes Business“). Inhaltlich unverändert: Wort, Lieferung (Frage + Briefvorlage, Guide Punkt 1–2), Zeit, greifbares Ergebnis, „eigenes Business“. Hörbar natürlich. Präzedenz: F9/F10 wichen stärker ab und bestanden. Kein K.-o. Aber thema.md:49 begründet mit „Chef-Vorgabe“ für CTA-Füllwörter; eine solche Vorgabe steht in keinem Briefing/Skill (grep „Füllw“: nur thema.md) → als unbelegt markiert (H-02). Caption:21 behält die volle Formel ✓.
3. **Weg-Satz „Claude: Liste und Logo angehängt, Websuche, Word-Datei.“**: für Zuhörer verständlich, gleiche Bauart wie F12 („Claude: letztes Ergebnis angehängt, Websuche, Excel-Liste.“, dort Note 8 und bestanden, firma-tag12/pruefung/autor-runde3.md:50). „Liste“ ist durch script.txt:2 eingeführt, „Logo“ ist Alltagswort. Wegfall von „zur Rechtslage“ unkritisch, weil script.txt:5–6 sofort Mail/Anruf/Einwilligung bringen. Belegt: LAUF.md:8 (2 Anhänge), :17 (5 Websuchen), :20 (DOCX). Note 8.
4. **„Anruf braucht Anlass beim Betrieb. Sie sieht keinen.“**: verständlich; Regel + Befund sind jetzt beide gesprochen (R1-03 erfüllt). Nicht wörtlich 1:1, sondern treue Verdichtung von LAUF.md:30 („konkreter Grund aus dem Interessenbereich des Angerufenen“) und :35 („bei keinem der fünf Betriebe einen konkreten Grund, der aus seinem Interesse kommt“). „Sie sieht keinen“ ist vorsichtiger als der Lauf (Einschätzung statt Tatsache), also nicht zugespitzt ✓. Rest-Risiko: „Anlass“ gesprochen, Warum-Karte 3 sagt „KEIN KONKRETER GRUND“ (thema.md:65), andere Wörter in Ton und Bild; Kartenwort kommt laut Regel aus dem Lauf, also zulässig. Note 8.

Weitere Fragen:
- **„sie“ nach „Claude:“**: „Heute schreibt sie …“ (script.txt:3) folgt direkt auf „Liste: …“, „Sie wählt …“ (:5) direkt auf „… Word-Datei.“; grammatisch wären „Liste“/„Word-Datei“ die nächsten weiblichen Bezugswörter, inhaltlich löst jeder Hörer auf „die KI“ auf (eine Liste schreibt nicht, eine Datei wählt nicht). Gleiches Muster wie F12 (dort als „kleines Risiko“ mit 8 bestanden). Kein Ticket.
- **Rückblick-Satz 2 „Liste: zwanzig Betriebe.“** = Ergebnis F12 (firma-tag12/script.txt:3 „zwanzig Betriebe in Chemnitz“, :5 „Fünf …“) ✓; „Liste:“ trennt hörbar von „Kunden“ (R1-01 erfüllt). „fünf zuerst“ fällt weg; unschädlich, weil „Sie sieht keinen“ nicht an „fünf“ hängt.
- **Übergabe** „Als Nächstes: Wohin gehen die Briefe?“ = offene Frage aus dem Lauf (LAUF.md:48 Claudes Angebot Impressums-Adressen; :45 „weiter offen“; :97) ✓, vom Lauf 13 nicht beantwortet ✓, Lauf 14 existiert noch nicht (Chef prüft dann).

## Notentabelle
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung wörtlich, ohne Tag |
| Neueinstieg/Rückblick (Produkt + Stand, ≤ 6,5 s, „Heute“ ≤ 14,5 s) | 8 | script.txt:2 „Liste: zwanzig Betriebe.“ (Stand als Liste hörbar); Zeiten ✓ (Messwerte, words.json F10–F12); „sie“ in :3 hinter „Liste“ kleines Bezugsrisiko |
| Mehrwert: nachbaubare Schritte, Beginn ≤ 14 s | 8 | script.txt:4 Anhang, Websuche, Word-Datei hörbar; Beginn ≈ 15–16 s wie F11/F12 |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 9 | thema.md:5 „Darf ich Firmen einfach anschreiben?“; echter Brief + gestrichene Wege (hooks.md:9–10) |
| Hook: Satz 2 + Frame 1 erzeugen Frage, Muster belegt | 8 | hooks.md:8–10, M-002/M-011; Frame 1 trägt Text-Hook + Stempel + Brief + 2 Karten, Regie muss staffeln (thema.md:58) |
| Entscheidung der KI klar und 1:1 | 8 | script.txt:5 „Sie wählt Brief statt Mail oder Anruf.“ = LAUF.md:25, alle drei Wege gehört (R1-02 erledigt); artikelloses „Brief“ telegrafisch |
| Warum: 2–3 konkrete Gründe 1:1, verständlich | 8 | script.txt:6–9 ↔ LAUF.md:29/:34, :36, :30/:35; Anruf jetzt mit Befund; Telegrammstil ohne Artikel |
| Haken korrekt, nichts als erledigt erzählt | 8 | nicht mehr gesprochen (keine Pflicht, s. o.); Ehrlichkeit über script.txt:10/:12 + caption.txt:17; Bildplan thema.md:67 lässt „ERGÄNZEN“ unvertont unter „Sie sieht keinen.“ laufen (H-01) |
| Schritt-Kette + Übergabe | 9 | Eingabe = Ergebnis F12 als Anhang (LAUF.md:8), beantwortet F12 „Was schreibt sie?“; script.txt:10 aus LAUF.md:48 (R1-04 erledigt) |
| CTA: konkreter Wert, nur Lieferbares, Formel | 8 | script.txt:11–12 zwei greifbare Teile, „Briefentwurf“ ehrlich; Formabweichung („und“, „fürs eigene“), Begründung „Chef-Vorgabe“ thema.md:49 unbelegt (H-02) |
| Kommentar-Mechanik (prompt-fuer-kommentare.md) | 9 | Variante A/B + Teil-Fallbacks (:31–37), 4 Berufe (:41–46), Namen-Streichung (:15), Einstellungen mit Quelle (:28) |
| Länge/Satzregeln/Bildschirmtext | 8 | 100 Wörter, Sätze ≤ 11; wpm-Fenster laut echten F10–F12 nur knapp (H-03); Karten thema.md:63–66 ≤ 4 Wörter + Kleinzeilen |
| Caption | 9 | 2074 Zeichen, Ende + Hashtags korrekt, Gründe 1:1 mit „grundsätzlich“, Quellenart, „kein Anwalt“, keine Emojis |
| Claude-Behauptungen belegt | 8 | thema.md:11–15 support.claude.com-Quellen je Funktion (R1-06 erledigt), ehrlich als „Suchtreffer, nicht geöffnet“ markiert; .md/.svg nur durch Lauf belegt, Guide-Ausweg vorhanden |
| Rechtliche Aussagen 1:1, nicht zugespitzt, mit Quelle | 9 | thema.md:22–36, kein „verboten“/Paragraf gesprochen; „laut Claude · keine Rechtsberatung“ im Bild (thema.md:66, R1-05 erledigt) |
| Keine private Info, keine Ansprache | 10 | grep-Werte oben; 05 nur anonym (thema.md:69); Impressums-Warnung F14 (thema.md:54) |

**Mittel: 8,5/10** (136/16), niedrigste Einzelnote 8.

## K.-o.-Liste
| K.-o. | verletzt? |
|---|---|
| Zuschauer direkt angesprochen außerhalb CTA | nein |
| Ergebnis nicht aus echtem claude.ai-Lauf | nein (LAUF.md, Chat b0fbcaf2…) |
| Unbelegte Claude-Behauptung | nein |
| ChatGPT statt Claude | nein |
| Versprechen nicht lieferbar | nein („Briefentwurf“, Guide Punkt 1–2) |
| „Niemand hat kommentiert“ | nein |
| Warum fehlt | nein (3 Gründe) |
| Neuer versteht bis 14 s Projekt + heutigen Schritt | ja, erfüllt |
| Sprung/Wiederholung in der Kette | nein |
| „Tag drei“ in nicht-erster Folge | nein |
| > 100 Wörter | nein (100) |
| Umsatz-Zähler/Umsatz oder Versand als erledigt | nein |
| Hamburg/Betriebs-/Personenname in Zuschauer-Texten oder Guide-Pfad | nein |
| Caption ≥ 2100 / falsches Ende / Emojis | nein |

## Status der R1-Tickets
| Ticket | Status | Beleg |
|---|---|---|
| R1-01 Rückblick als Liste hörbar | erledigt | script.txt:2 „Liste: zwanzig Betriebe.“; hooks.md:16; thema.md:59 |
| R1-02 drei Wege gesprochen, nicht zirkulär | erledigt | script.txt:3 „erste Werbung“, :5 „Brief statt Mail oder Anruf“ |
| R1-03 Anruf: Regel + Befund | erledigt | script.txt:8–9; thema.md:30 belegt gegen LAUF.md:30/:35 |
| R1-04 Übergabe mit Bezug | erledigt | script.txt:10 „Wohin gehen die Briefe?“; thema.md:52, :68 |
| R1-05 „laut Claude · keine Rechtsberatung“ im Bild | erledigt | thema.md:66 |
| R1-06 Doku-Quellen Claude-Funktionen | erledigt | thema.md:11–15; prompt-fuer-kommentare.md:28 |

## Gesamturteil
**Bestanden.** Gesamtnote **8,5/10**, kein K.-o., alle 16 Kriterien ≥ 8, alle 6 R1-Tickets erledigt. Die vier Kürzungen sind vertretbar; keine davon verletzt eine schriftliche Regel. Die Folge ist am Wortbudget hart auf Kante (100/100) und im Telegrammstil (F12-Niveau), deshalb überall 8 statt 9.

## Hinweise (nicht bestehensrelevant, an firma-autor bzw. zur Weitergabe an firma-regie)
```
HINWEIS autor-R2-H-01 → firma-autor (thema.md, Regie-Hinweis)
Kriterium: Haken · Note: 8/10
Beleg: thema.md:67 „Ergebnis-/Haken-Beat (läuft unter „Sie sieht keinen.“ → „Als Nächstes“) … Stempel „ERGÄNZEN““ vs. thema.md:65 Warum-Karte 3 auf derselben Stelle
Problem: Der unvertonte Haken-Stempel teilt sich ≈ 1–1,5 s mit Warum-Karte 3 und dem Übergang; zwei neue Textblöcke gleichzeitig bzw. Karte 3 < 1,2 s möglich, und der Stempel hat kein gesprochenes Wort.
Soll: thema.md:67 legt fest, dass Warum-Karte 3 bis Ende „Sie sieht keinen.“ allein steht (≥ 1,2 s) und der Brief-Zoom mit gelbem Versand-Feld erst im Übergabe-Beat zusammen mit dem Empfängerfeld kommt (ein Stempel, ein Textblock), oder der „ERGÄNZEN“-Stempel entfällt im Video (bleibt in Caption).
```
```
HINWEIS autor-R2-H-02 → firma-autor
Kriterium: CTA · Note: 8/10
Beleg: thema.md:49 „gekürzt (CTA-Füllwörter, Chef-Vorgabe)“
Problem: Eine Chef-Vorgabe zu CTA-Füllwörtern ist in keinem Briefing/Skill belegt; die Formel aus SKILL:25 wird ohne Beleg verlassen.
Soll: thema.md:49 nennt die Quelle der Vorgabe oder sagt ehrlich „Autor-Kürzung wegen Wortgrenze“; falls ein Wort frei wird, zuerst „und“ in script.txt:11 zurück.
```
```
HINWEIS autor-R2-H-03 → firma-regie (über Chef)
Kriterium: Länge · Note: 8/10
Beleg: thema.md:75–78 (Eröffnung 5,60 s, 45,3–47,9 s) vs. firma-tag10/11/12/words.json (100 Wörter = 45,43 / 44,48 / 44,19 s = 132,1 / 134,9 / 135,8 wpm)
Problem: Das Autor-Modell setzt die Eröffnung ~0,5–0,8 s zu kurz an; echte 100-Wort-Folgen landen am oberen wpm-Rand, F12 schon über 135.
Soll: Regie hält die Gesamtlänge ≥ 44,5 s (≤ 135 wpm), Pausen im Mittel ≥ 0,5 s, „Heute“ weiter ≤ 14,5 s nachmessen.
```
