# Prüfung autor · Folge 9 „Logo“ · Runde 2

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-29. Auftrag: Fehler finden. An den Autor-Dateien nichts geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md. Runde 1: pruefung/autor-runde1.md (T-01…T-07).
Maßstab: bewertung.md „autor“; briefing.md; tagesbriefing-2026-10-30.md inkl. Chef-Entscheide (Z. 56, 57, 60); firma-tag4/tagesbriefing-2026-10-29.md; firma-autor SKILL (Z. 21, 24, 25, 42).
Belege: design/lauf/LAUF.md, bericht.md, chat.json (Lauf 2); Folgelauf firma-tag10/design/lauf/LAUF.md; Vergleich firma-tag8/script.txt.

## Messwerte
- script.txt: **100 Wörter** (`wc -w`), Obergrenze genau. Sätze: fest 15/4/2/15, sonst max. 8 Wörter ✓.
- Wörter vor „Heute“: 39. Schätzung „Heute“-Beginn (F8-Kalibrierung, thema.md:60) ≈ 12,4 s + Pausen 0,8–1,4 s ≈ 13,2–13,8 s ≤ 14,5 s ✓ (Regie misst).
- Rückblick: 15 Wörter ≈ 4,3 s + „Name: Kolonnenshirt, ungeprüft.“ ≈ 1,9 s ≈ 6,2 s ≤ 6,5 s ✓ (knapp, Regie misst).
- Gesamt: 100 W ÷ 155 wpm = 38,7 s + ~12 Satzgrenzen × 0,4–0,7 s ≈ 43–47 s, ≈ 128–140 wpm ✓ (Chef-Entscheid Z. 60).
- caption.txt: **2056 Zeichen** (Python `len`, inkl. Schluss-Umbruch) < 2100 ✓. Endet mit Fiktiv-Hinweis + nur Hashtags ✓. Keine Emojis ✓.
- „du/dir“ nur im CTA (script.txt:16–17) ✓.
- Echter Lauf-Prompt (chat.json, Nachricht 0) nennt „Farbanzahl, kleinste Schrifthöhe und feine Linien“, **nicht „Lücken“**. Caption-Frage und Guide-Frage enthalten jetzt „Lücken“ (T-06) = ungetestete, aber unkritische Erweiterung.

## Ticket-Abgleich Runde 1
| Ticket | Status | Beleg |
|---|---|---|
| T-01 Übergabe | **erfüllt** | script.txt:15 = caption.txt:17 „Was muss oben auf ihre Website?“; Lauf 10 beantwortet (firma-tag10/…/LAUF.md:20 „Die drei Dinge ganz oben“), Lauf 9 nicht; thema.md:25 nennt Beleg mit Zeile. |
| T-02 Warum + Verständlichkeit | **nicht erfüllt** | Soll (a) „was die Lücke ist (Stoff scheint durch)“ wird nicht gesprochen; (b) „bei den anderen schmaler“ wird nicht gesprochen, thema.md:22 begründet das mit „Chef-Entscheid“, der in tagesbriefing-2026-10-30.md (Chef-Entscheide Z. 53–61) und briefing.md **nicht existiert**; (c) „füllt blau, wie Printful rät“ ✓ (LAUF.md:46). Grund Shirtfarbe (R1 noch gesprochen) gestrichen → „nie beim Warum kürzen“ (tagesbriefing-2026-10-30:17) verletzt. |
| T-03 CTA | **formal erfüllt, inhaltlich nicht** | Damit-Satz + Zeit da (script.txt:17). Aber „prüfst du dein Logo“ liefert der Guide so nicht, s. neues Ticket R2-03. |
| T-04 Weg in Einzelsätzen | **erfüllt** | script.txt:7–9 je ein Schritt, „Stickregeln“ Alltagswort, 100 Wörter. (Kürzung traf aber das Warum, s. T-02.) |
| T-05 Stempel aus dem Lauf | **erfüllt** | hooks.md:9, thema.md:42/47/49 „LÜCKEN ZU SCHMAL“ (LAUF.md:30 „zu schmal“), „EMPFEHLUNG“ (LAUF.md:24 „Ich empfehle“). Kein „LÜCKEN ZU ENG“ mehr (grep). |
| T-06 Caption | **weitgehend erfüllt** | caption.txt:7 nennt „Lücken“ ✓, 2056 Zeichen ✓; Soll „Wert in thema.md“ fehlt (grep „Zeichen“ in thema.md: 0 Treffer). Kleinigkeit. |
| T-07 Länge/Rechnung | **erfüllt** | thema.md:55–60 rechnet mit 155 wpm + Pausen und F8-Messwerten; Chef hat den Konflikt entschieden (tagesbriefing-2026-10-30:56, :60). Pausenvorschlag 0,3 s (thema.md:58) liegt unter Chef-Korridor 0,4–0,7 s, Regie-Sache. |

## Bewertung
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1–3 feste Eröffnung + „Tag drei.“ (tagesbriefing-2026-10-30:10) |
| Neueinstieg ≤ 14 s (Projekt + heutiger Schritt) | 8 | script.txt:4–6; Schätzung 13,2–13,8 s, knapp, Regie misst |
| Mehrwert: nachbaubare Schritte, Beginn ≤ 14 s | 8 | script.txt:7–9, Einzelsätze, belegt durch Prompt (chat.json); Beginn ≈ 14–15 s, Grenzfall |
| Thema: Schmerz bekannt, Ergebnis in einem Bild | 9 | thema.md:5, hooks.md:9 |
| Hook: Satz 2 + Frame 1, Muster belegt | 8 | hooks.md:9 Siegerlogo + A/B mit „LÜCKEN ZU SCHMAL“ (Lauf-Wort), Satz 2 = 9 Silben, M-002 |
| **Entscheidung hörbar („Sie nimmt den Block.“)** | **5** | script.txt:10. „den Block“ mit bestimmtem Artikel für etwas, das nie eingeführt wurde. Ohne Bild weiß ein Neuer nicht, dass einer der drei Entwürfe ein Block ist, und nicht, was am Block ist (blaue Fläche, weiße Schrift). Der Satz funktioniert nur mit Bild. |
| **Warum: 2–3 konkrete Gründe, verständlich** | **6** | script.txt:11–13. Gedeckt durch den Lauf: „zulaufen“ = Claudes Wort (LAUF.md:52 „Ob die Lücken bei A und B tatsächlich zulaufen“), Mindestbreite/Füllen (LAUF.md:30), „C füllt diese Lücken mit Navy, und genau das empfiehlt Printful selbst“ (LAUF.md:46) ✓. Aber: gesprochen ist es **ein** Grund (Lücken) plus Autorität (Printful); keine Zahl, kein Vergleich („bei den anderen schmaler“ fehlt), Grund Shirtfarbe/Abstand gestrichen (F8 hatte 3 Gründe, firma-tag8/script.txt:6). Beim ersten Hören unklar: Lücken *wo*? („im Logo/zwischen den Buchstaben“ fehlt). „Er füllt sie“: Bezug „Er“ = Block steht zwei Sätze zurück, dazwischen „Lücken“ – verständlich, aber holprig. Logiklücke für Neue: Wenn der Block die Lücken füllt, warum hatten die anderen ein Problem? Nur das Bild sagt es. |
| **Haken eindeutig („Das zeigt erst ein Probeshirt.“)** | **6** | script.txt:14. „Das“ hat keinen hörbaren Bezug: nächster Satz davor ist „Er füllt sie blau, wie Printful rät.“ → klingt, als müsse ein Probeshirt erst zeigen, *ob der Block blau füllt*. Gemeint (thema.md:24) ist „wie es gestickt wird / ob Lücken zulaufen“ (LAUF.md:52). Inhalt belegt, Formulierung mehrdeutig. |
| Verständlichkeit 16-Jähriger / keine unerklärten Namen | 7 | „Printful“ (script.txt:13) wird gesprochen, aber im Skript nie eingeführt (F8 führte es im Rückblick ein: „Printful stickt“). thema.md:53 behauptet „Printful ist im Skript nicht mehr gesprochen“ → falsch, TTS-Liste dadurch widersprüchlich. |
| Belegtreue jeder Aussage | 8 | thema.md:14–26 korrekt bis auf den erfundenen „Chef-Entscheid“ (thema.md:22) und die falsche Printful-Notiz (thema.md:53). „wie Printful rät“ ist Claudes Wiedergabe; Seitentext im Lauf nicht nachgeprüft (bericht.md, Auffälligkeiten) – vertretbar. |
| Schritt-Kette + Übergabe | 9 | Start bei Name (F8), nächster Schritt Logo, Übergabe von Lauf 10 beantwortet (LAUF 10:20) ✓ |
| **Kommentar-Mechanik / CTA konkret + lieferbar** | **6** | script.txt:16–17 „die Prüfliste. Damit prüfst du dein Logo in fünf Minuten.“ (1) Der Guide (prompt-fuer-kommentare.md:7) lässt Claude **drei neue Entwürfe zeichnen**; einen Prompt „prüf mein vorhandenes Logo“ gibt es nicht, und im Lauf wurde kein fremdes Logo geprüft. (2) Die Prüfliste allein verlangt Messungen in Millimetern (Lücken ≥ 6,35 mm, Linien ≥ 1,27 mm), die ein Mensch ohne Werkzeug nicht in 5 min macht. (3) „Fünf Minuten“ stützt sich auf 4 min 23 s für *Suchen + Zeichnen + Messen durch Claude* (LAUF.md:15), nicht auf „dein Logo prüfen“. Ergebnis und Zeit passen also nicht zur gleichen Handlung. prompt-fuer-kommentare.md:3 behauptet weiter, das Skript verspreche „Frage, Prüfliste und Entwürfe“ – das Skript sagt nur „die Prüfliste“. |
| Länge / Sätze / Tempo | 9 | 100 W hart ✓, Sätze ≤ 12 ✓, Schätzung 43–47 s ✓ |
| Keine Ansprache/Imperativ außerhalb CTA | 9 | script.txt:1–15 ✓ |
| Caption (Regeln, Länge, passt zum Skript) | 8 | 2056 Zeichen ✓; „Tag 3: Heute baut sie ihr Logo“ ✓; Übergabe identisch ✓ (caption.txt:17); Warum mit allen 3 Lauf-Gründen inkl. „sieht auf jeder Shirtfarbe gleich aus“ (LAUF.md:48 1:1) ✓; Lücken-Werte = Stempel-Aussage „schmaler als 6,35 mm (bis 5,8 und 4,1 mm)“ ✓. Abweichung: Caption-CTA (caption.txt:15) nennt Guide-Inhalt, aber nicht den Skript-Wert „in fünf Minuten“; wird mit R2-03 ohnehin angepasst. |
| Guide-Lieferung (prompt-fuer-kommentare.md) | 8 | Frage, Prüfliste 1–8 mit Quelle, Entwürfe + Tabelle 1:1 aus LAUF.md ✓; aber kein Baustein für „eigenes Logo prüfen“, den der CTA verspricht. |

## K.-o.-Check
| K.-o. | Status | Beleg |
|---|---|---|
| Zuschauer direkt angesprochen außerhalb CTA | nein ✓ | script.txt:1–15 |
| Ergebnis nicht aus echtem claude.ai-Lauf | nein ✓ | LAUF.md:1–4 Lauf 2 |
| Unbelegte Claude-Behauptung | nein ✓ | script.txt:11–14 durch LAUF.md:30/46/52 gedeckt |
| ChatGPT statt Claude | nein ✓ | – |
| Versprechen, das wir nicht liefern | **Risiko** | script.txt:17 „prüfst du dein Logo“ – Guide hat keinen Prüf-Prompt für ein vorhandenes Logo (R2-03) |
| Warum mit 2–3 Gründen | **grenzwertig** (1 Grund + Autorität, gekürzt gegenüber R1) | script.txt:11–13; tagesbriefing-2026-10-30:17 „nie beim Warum“ |
| Neuer versteht bis 14 s | ✓ (Schätzung 13,2–13,8 s, Regie misst) | thema.md:60 |
| Rückblick ≤ 6,5 s | ✓ (≈ 6,2 s, knapp) | thema.md:59 |
| Schritt-Kette / Übergabe | ✓ | LAUF 10:20 |
| Ein Gedanke pro Satz / ≤ 12 Wörter / ≤ 100 Wörter | ✓ | Messwerte |
| Stempel-Wörter aus dem Lauf | ✓ | hooks.md:9, thema.md:47–49 |
| Caption < 2100 | ✓ 2056 | caption.txt |

## Gesamt: NICHT BESTANDEN
Noten unter 8: Entscheidung hörbar 5, Warum 6, Haken eindeutig 6, CTA 6, Verständlichkeit 7. Kein harter K.-o., aber zwei Risiken (CTA-Versprechen, Warum dünn).
Kernproblem: Die Kürzung auf 100 Wörter hat genau die Sätze getroffen, die ohne Bild verstanden werden müssen (Entscheidung, Warum, Haken). Bei 2 × 15 festen Wörtern + 3 Weg-Sätzen + 16 CTA-Wörtern bleiben ≈ 30 Wörter für Entscheidung + Warum + Haken + Übergabe. Ohne Umverteilung lassen sich R2-01 bis R2-03 kaum zugleich lösen → Kopie an firma-chef.

## Tickets

```
TICKET autor-R2-01 → firma-autor
Kriterium: Entscheidung hörbar · Note: 5/10
Beleg: script.txt:10 „Sie nimmt den Block.“
Problem: „den Block“ ist für einen Neuen ohne Bild nicht zuzuordnen (nie eingeführt, Aussehen unbekannt).
Soll: Der Entscheidungssatz sagt hörbar, welcher der drei Entwürfe es ist und wie er aussieht, z. B. „Sie nimmt den blauen Block mit weißer Schrift.“ (8 Wörter, LAUF.md:21/24); ≤ 12 Wörter.
```

```
TICKET autor-R2-02 → firma-autor
Kriterium: Warum · Note: 6/10
Beleg: script.txt:11–13; LAUF.md:30, :46, :48; tagesbriefing-2026-10-30:17; thema.md:22 (Chef-Entscheid nicht auffindbar)
Problem: Gesprochen ist nur ein Grund plus „wie Printful rät“; der Vergleich zu den anderen Entwürfen und ein zweiter echter Grund fehlen, Lücken „wo“ bleibt offen.
Soll: Gesprochen stehen mindestens zwei verschiedene Gründe aus dem Lauf, davon einer als Vergleich „bei den anderen (zwei) sind die Lücken in der Schrift zu schmal“ (LAUF.md:46) und einer zusätzlich (Shirtfarbe 1:1 „sieht auf jeder Shirtfarbe gleich aus“, LAUF.md:48, oder Zahl 6,35 mm / „gut sechs Millimeter“, LAUF.md:30); jeder Satz ≤ 12 Wörter, ein Gedanke; der Bezug von „er/sie“ ist jeweils im selben oder direkt vorigen Satz genannt. thema.md:22 streicht den Verweis auf einen nicht existierenden Chef-Entscheid.
```

```
TICKET autor-R2-03 → firma-autor
Kriterium: CTA konkret + lieferbar · Note: 6/10
Beleg: script.txt:16–17; prompt-fuer-kommentare.md:3, :7; LAUF.md:15
Problem: „Damit prüfst du dein Logo in fünf Minuten“ verspricht das Prüfen eines vorhandenen Logos; der Guide liefert einen Prompt, der drei neue Entwürfe zeichnet, und die 4 min 23 s belegen nur diesen Weg.
Soll: Ergebnis und Zeit im CTA beschreiben dieselbe Handlung, die der Guide enthält und der Lauf belegt, z. B. „Damit hast du in fünf Minuten drei geprüfte Logo-Entwürfe.“ ODER der Guide bekommt einen eigenen Prompt „prüf mein Logo im Anhang gegen die Vorgaben“ und das ist in einem echten Lauf getestet (Dauer in LAUF notiert). Lieferung im Skript ≠ Teilmenge-Widerspruch: prompt-fuer-kommentare.md:3 nennt exakt die im Skript gesprochene Lieferung. Caption-CTA (caption.txt:15) nennt denselben Wert.
```

```
TICKET autor-R2-04 → firma-autor
Kriterium: Haken eindeutig · Note: 6/10
Beleg: script.txt:14; LAUF.md:52, :55
Problem: „Das zeigt erst ein Probeshirt.“ – „Das“ bezieht sich hörbar auf „Er füllt sie blau“, gemeint ist, wie der Stick wirklich aussieht.
Soll: Der Haken-Satz nennt sein Subjekt selbst, z. B. „Haken: Wie es gestickt aussieht, zeigt erst ein Probeshirt.“ (9 Wörter, LAUF.md:52); kein „das/es“ ohne Bezug im selben Satz.
```

```
TICKET autor-R2-05 → firma-autor
Kriterium: Verständlichkeit / Belegtreue thema.md · Note: 7/10
Beleg: script.txt:13 „wie Printful rät“; thema.md:53; firma-tag8/script.txt:2
Problem: Printful wird gesprochen, aber nie eingeführt; thema.md:53 behauptet das Gegenteil, die TTS-Liste ist dadurch widersprüchlich.
Soll: Entweder „Printful“ wird beim ersten Hören erklärt (z. B. „wie der Stick-Anbieter Printful rät“) oder durch ein Alltagswort ersetzt („wie der Anbieter rät“); thema.md:53 sagt korrekt, ob Printful gesprochen wird, und führt es dann als TTS-Risikowort. Caption-Zeichenzahl (2056 bzw. neuer Wert) steht in thema.md (Rest T-06).
```

```
TICKET autor-R2-06 → firma-chef (Kopie firma-autor)
Kriterium: Wortbudget vs. Verständlichkeit · Note: –
Beleg: script.txt (100 W: fest 36, Weg 7, CTA 16 → ≈ 30 W für Entscheidung, Warum, Haken, Übergabe); tagesbriefing-2026-10-30:17, :60
Problem: R2-01, R2-02 und R2-04 brauchen zusammen ≈ +12–15 Wörter; bei 100 hart muss woanders gekürzt werden, und die einzigen freien Stellen sind Weg-Sätze oder CTA (beides bewertet).
Soll: Chef legt vor Runde 3 fest, wo gekürzt werden darf (z. B. CTA auf einen Satz „Kommentiere „Logo“: Damit hast du in fünf Minuten drei geprüfte Logo-Entwürfe.“ oder „Ergebnis anhängen.“ nur in Caption), damit script.txt ≤ 100 Wörter UND R2-01/02/04 erfüllt.
```
