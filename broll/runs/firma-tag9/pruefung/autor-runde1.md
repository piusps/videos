# Prüfung autor · Folge 9 „Logo“ · Runde 1

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-29. Auftrag: Fehler finden. Nichts an den Autor-Dateien geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md.
Maßstab: bewertung.md „autor“, briefing.md, tagesbriefing-2026-10-30.md (Neu ab Folge 9), firma-tag4/tagesbriefing-2026-10-29.md (Regeln 1–8), firma-autor SKILL (Z. 24, 25, 37–42). Beleg: design/lauf/LAUF.md + bericht.md (Lauf 2). Vergleich Folge 8 (script/caption/words.json). Übergabe gegen firma-tag10/design/lauf/LAUF.md.

## Messwerte
- script.txt: 100 Wörter (`wc -w`), Obergrenze genau erreicht. Sätze: fest 15/15 Wörter, sonst max. 10 (CTA). Silben-Heuristik ≈ 172.
- Kein „du“/„dir“ außerhalb CTA (script.txt:10, caption.txt:15; caption.txt:7 nur im zitierten Prompt). Keine Emojis.
- caption.txt: 2067 Zeichen (< 2100, Reserve nur 33). Endet mit „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags ✓.
- Kalibrierung aus Folge 8 (words.json, TTS_SPEED 1.15): 135 Wörter in 44,2 s = 183 wpm; „Heute …“-Satz endet bei 12,5 s; Rückblick-Satz 1 (15 Wörter) = 3,74 s. Hochgerechnet auf Tempo 1,0 (×1,15): Folge 9 ≈ 100/135 × 44,2 × 1,15 ≈ 37–38 s + Regiepausen ≈ 39–41 s, ≈ 155–160 wpm. Bei Pius' Zieltempo 120–135 wpm dagegen 44–50 s und „Heute baut sie ihr Logo“ erst bei ≈ 20 s. Beide Annahmen kollidieren mit einer Regel (s. T-07).

## Bewertung
| Kriterium | Note | Beleg (Datei:Zeile) |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung + „Tag drei.“ (tagesbriefing-2026-10-30:10) ✓ |
| Mehrwert: nachbaubare Schritte, Beginn ≤ 14 s | 7 | script.txt:4 Weg beginnt erst nach 45 Wörtern (≈ 15 s bei 1,0 laut F8-Kalibrierung, ≈ 20 s bei 135 wpm); Satz packt drei Handlungen in einen Satz (gegen „ein Gedanke pro Satz“, NEU K.-o.); Folge 8 hat den Weg auf Einzelsätze verteilt (firma-tag8/script.txt:4) |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 9 | thema.md:5 „Logo ohne Designer, funktioniert es auf dem Produkt?“; hooks.md:9 Shirt-Brust mit Siegerlogo ✓ |
| Hook: Satz 2 + Frame 1 erzeugen Frage, Muster belegt | 7 | hooks.md:9 Stempel „LÜCKEN ZU ENG“ steht nicht im Lauf (Lauf: „zu schmal“/„schmaler als 6,35 mm“, LAUF.md:30, :46) → Lehre „Stempel-Wörter kommen aus dem Lauf“ (K.-o., tagesbriefing-2026-10-30:26); thema.md:51 übernimmt es. Rest ok (M-002, Satz 2 = 10 Silben) |
| Warum: 2–3 konkrete Gründe aus dem Lauf, verständlich | 6 | script.txt:6–7: Zahl „gut sechs Millimeter“ ist belegt (6,35 mm, LAUF.md:30) und „Nur der Block“ ist belegt („der einzige der drei“, LAUF.md:24). Aber der Mechanismus fehlt: Der Block *hat* keine 6-mm-Lücken, er *füllt* sie mit Blau (LAUF.md:46, „genau das empfiehlt Printful selbst“). „Nur der Block schafft das“ klingt, als hätte der Block breitere Lücken → falsches Bild. Zuschauer kann nicht erklären, warum der Block besteht. |
| Verständlichkeit 16-Jähriger / keine Fachwörter ohne Bild | 6 | script.txt:6 „Lücken im Stick brauchen gut sechs Millimeter“: Was eine Lücke im Stick ist (Stelle, an der der Stoff durchscheint, z. B. im O) und dass „brauchen“ = „müssen mindestens so breit sein“ heißt, ist beim ersten Hören unklar; der Autor räumt das selbst ein (thema.md:66 „nur mit Bild eindeutig“) und schiebt es an die Regie. script.txt:4 „Stick-Vorgaben“ Fachwort. |
| Belegtreue jeder Zahl/Aussage | 8 | thema.md:14–27 Abgleich korrekt; „passt auf jede Shirtfarbe“ (script.txt:7) ist Paraphrase von „Gleicher Look auf jeder Shirtfarbe“ (LAUF.md:48), Claude schränkt selbst ein „nur am Bildschirm“ (LAUF.md:55) – vertretbar, „sieht auf jeder Shirtfarbe gleich aus“ wäre 1:1. Haken script.txt:8 belegt (LAUF.md:53). |
| Schritt-Kette + Übergabe | 5 | Start bei Ergebnis Folge 8 (Name) und nächster Schritt Logo ✓ (tagesbriefing-2026-10-30:38). Übergabe script.txt:9 „Wo finden Betriebe die Firma?“ wird von Lauf 10 NICHT beantwortet: Lauf 10 baut eine private, nicht veröffentlichte Startseite und entscheidet, welche drei Dinge oben stehen (firma-tag10/design/lauf/LAUF.md:20, :73); zu Auffindbarkeit (Google, Kanäle) sagt er nichts, Domain/Hosting nennt Claude nicht (:68). Verstößt gegen firma-autor SKILL Z. 42. thema.md:26 „Lauf 10 lag nicht vor“ ist inzwischen überholt. |
| Kommentar-Mechanik / CTA konkret | 6 | script.txt:10 ohne Pflicht-Satz „Damit hast du in <Zeit> <Ergebnis> …“ (firma-autor SKILL Z. 25; Folge 8 hat ihn, firma-tag8/script.txt:10). thema.md:27 „Kein Zeitversprechen“ ist eine Abweichung von der Formel, keine Begründung. „Entwürfe“ = Kolonnenshirt-Entwürfe, für den Zuschauer nur Beispiel; der greifbare Nutzen (eigenes Logo stickbar prüfen) wird nicht gesagt. Lieferbarkeit selbst ✓ (prompt-fuer-kommentare.md:7–31). |
| Länge 85–100 Wörter / 40–48 s / Sätze ≤ 12 | 7 | 100 Wörter ✓, Sätze ✓. thema.md:58–59 Rechnung fehlerhaft: Rückblick-Satz 1 „≈ 3,85 s“ entspricht 234 wpm, passt nicht zur eigenen Annahme 120–135 wpm (dann 6,7–7,5 s → Rückblick ≈ 9 s > 6,0 s). Mit F8-Kalibrierung bei 1,0 eher 39–41 s (Untergrenze). Kein Puffer für einen CTA-Satz. |
| Keine Ansprache/Imperativ außerhalb CTA | 9 | script.txt:1–9 ✓; Infinitive in script.txt:4 wie Folge 8 akzeptiert. caption.txt:7 Imperative nur im zitierten Prompt ✓ |
| Caption (Regeln, Länge, Inhalt) | 7 | 2067 Zeichen ✓, Ende ✓, keine Emojis ✓. caption.txt:7 Prompt-Kurzfassung lässt „Lücken“ weg („Farben, Schrifthöhe, Linien“) – genau das Kriterium, das die Entscheidung trägt; wer die Caption-Frage kopiert, bekommt die Lücken-Prüfung evtl. nicht (Guide-Prompt prompt-fuer-kommentare.md:7 hat sie). caption.txt:17 übernimmt die falsche Übergabefrage. |
| Guide-Lieferung (prompt-fuer-kommentare.md) | 9 | Frage mit Platzhaltern, Prüfliste 1–8 mit Quelle, Entwürfe + Tabelle 1:1 aus LAUF.md:35–41; kein Garantie-Versprechen ✓. Klein: „Dateierstellung muss an sein“ (Z. 5) ist Schluss des Autors, im Lauf nicht als Einstellung belegt. |

## K.-o.-Check
| K.-o. | Status | Beleg |
|---|---|---|
| Zuschauer direkt angesprochen außerhalb CTA | nein ✓ | script.txt:1–9 |
| Ergebnis nicht aus echtem claude.ai-Lauf | nein ✓ | LAUF.md:4 Lauf 2 |
| Unbelegte Claude-Behauptung | nein ✓ (Paraphrase Shirtfarbe grenzwertig) | script.txt:7 |
| ChatGPT statt Claude | nein ✓ | – |
| Versprechen, das wir nicht liefern | nein ✓ | prompt-fuer-kommentare.md |
| Warum mit 2–3 Gründen fehlt | formal nein (2 Gründe), inhaltlich schwach | script.txt:6–7 |
| Schritt-Kette / Übergabe (SKILL Z. 42) | **verletzt** | script.txt:9 vs firma-tag10/design/lauf/LAUF.md:20 |
| Ein Gedanke pro Satz (NEU ab Folge 9, K.-o.) | **verletzt** | script.txt:4 (drei Handlungen) |
| Stempel-Wörter aus dem Lauf (Lehre, K.-o.) | **verletzt** | hooks.md:9, thema.md:51 „LÜCKEN ZU ENG“ |
| Neuer versteht bis 14 s Projekt + heutigen Schritt | **Risiko** (Regie misst) | „Heute …“ endet bei Wort 45: ≈ 14,4 s bei 1,0 laut F8-Kalibrierung, ≈ 20 s bei 135 wpm |
| Rückblick ≤ 6,0 s | **Risiko** | thema.md:59 Rechnung falsch, s. Länge |

## Gesamt: NICHT BESTANDEN
Noten unter 8: Mehrwert 7, Hook 7, Warum 6, Verständlichkeit 6, Kette/Übergabe 5, CTA 6, Länge 7, Caption 7. Drei K.-o.-Verletzungen.

## Tickets

```
TICKET autor-R1-01 → firma-autor
Kriterium: Schritt-Kette / Übergabe · Note: 5/10
Beleg: script.txt:9, caption.txt:17, thema.md:26/40 vs firma-tag10/design/lauf/LAUF.md:13, :20, :68, :73
Problem: „Wo finden Betriebe die Firma?“ beantwortet Lauf 10 nicht (private Startseite, Entscheidung „welche drei Dinge oben stehen“, nichts zu Auffindbarkeit/Online).
Soll: Übergabefrage ist eine Frage, die Lauf 10 wörtlich beantwortet und Lauf 9 nicht, z. B. „Als Nächstes: Was muss oben auf ihre Website?“; identisch in script.txt und caption.txt; thema.md:26 nennt den Beleg aus Lauf 10 mit Zeile.
```

```
TICKET autor-R1-02 → firma-autor
Kriterium: Warum + Verständlichkeit · Note: 6/10
Beleg: script.txt:6–7, LAUF.md:30, :46
Problem: „Lücken im Stick brauchen gut sechs Millimeter. Nur der Block schafft das.“ erklärt weder, was eine Lücke ist, noch warum der Block besteht (er füllt die Lücken, statt sie breit zu machen).
Soll: Warum-Sätze sagen beim ersten Hören (a) was die Lücke ist (Stelle, wo der Stoff durchscheint) mit „mindestens gut sechs Millimeter breit“, (b) dass sie bei den anderen Entwürfen schmaler sind, (c) dass der Block sie mit Blau füllt (Printful empfiehlt das selbst) – jede Aussage 1:1 aus LAUF.md:30/46, je Satz ≤ 12 Wörter, ein Gedanke. Grund Shirtfarbe möglichst 1:1: „sieht auf jeder Shirtfarbe gleich aus“.
```

```
TICKET autor-R1-03 → firma-autor
Kriterium: CTA konkret · Note: 6/10
Beleg: script.txt:10, firma-autor SKILL Z. 25, firma-tag8/script.txt:10
Problem: Pflicht-Satz „Damit hast du in <Zeit> <Ergebnis> …“ fehlt; der Nutzen für das eigene Business wird nicht genannt.
Soll: CTA = „Kommentiere „Logo“, und ich schick dir <Lieferung>. Damit <prüfst/hast> du in <Zeit, belegt durch Lauf 4 min 23 s, z. B. fünf Minuten> <ein Logo, das sich sticken lässt / drei geprüfte Logo-Entwürfe> für dein eigenes Business.“; nur Guide-Inhalt versprochen, keine Stick-Garantie.
```

```
TICKET autor-R1-04 → firma-autor
Kriterium: Mehrwert / ein Gedanke pro Satz · Note: 7/10
Beleg: script.txt:4
Problem: „Ergebnis anhängen, Stick-Vorgaben suchen, drei Entwürfe prüfen.“ = drei Handlungen in einem Satz plus Fachwort.
Soll: Weg in kurze Einzelsätze wie Folge 8 (je ein Schritt), Alltagswort statt „Stick-Vorgaben“ oder dessen Bedeutung im selben Beat gesagt; Gesamtskript trotz T-02/T-03 weiter 85–100 Wörter (`wc -w`) – gekürzt bei Nebeninfos (z. B. „noch“, „Haken“-Formulierung), nie beim Warum.
```

```
TICKET autor-R1-05 → firma-autor
Kriterium: Hook / Stempel-Wörter · Note: 7/10
Beleg: hooks.md:9, thema.md:43, :51
Problem: Stempel „LÜCKEN ZU ENG“ steht so nicht im Lauf.
Soll: Stempel-Text wörtlich aus dem Lauf, z. B. „LÜCKEN ZU SCHMAL“ (LAUF.md:30 „Ist eine Lücke zu schmal“), überall gleich in hooks.md und thema.md.
```

```
TICKET autor-R1-06 → firma-autor
Kriterium: Caption · Note: 7/10
Beleg: caption.txt:7, :17
Problem: Kopier-Frage nennt die Lücken-Vorgabe nicht, die die Entscheidung trägt; Übergabefrage s. T-01.
Soll: caption.txt:7 nennt „Lücken“ in der Vorgaben-Aufzählung (wie prompt-fuer-kommentare.md:7); Caption nach allen Änderungen weiter < 2100 Zeichen (gezählt, Wert in thema.md).
```

```
TICKET autor-R1-07 → firma-autor (Kopie an firma-chef)
Kriterium: Länge / Rückblick / 14-s-Regel · Note: 7/10
Beleg: thema.md:58–59; firma-tag8/words.json (Satz 1 = 3,74 s bei 1.15; „Firmennamen.“ endet 12,46 s)
Problem: Längen- und Rückblick-Rechnung ist in sich widersprüchlich (3,85 s für 15 Wörter = 234 wpm, Annahme aber 120–135 wpm). Bei 120–135 wpm sind Rückblick ≤ 6,0 s und „Heute …“ ≤ 14 s mit den festen Sätzen nicht erreichbar; bei realem Keno-Tempo 1,0 (≈ 160 wpm) landet die Folge eher bei 39–41 s.
Soll: thema.md rechnet mit dem gemessenen Tempo (F8 words.json ÷ 1.15) und weist Gesamtlänge, Rückblick-Dauer und Zeitpunkt „Heute …“ aus; Chef entscheidet den Regelkonflikt (120–135 wpm vs. Rückblick ≤ 6 s / 14 s mit festen 15-Wort-Sätzen) vor dem Regie-Lauf.
```
