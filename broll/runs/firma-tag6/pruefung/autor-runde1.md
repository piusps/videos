# Prüfung autor · Folge 6 „Partner“ · Runde 1 (frischer Prüfer, 2026-10-28)

Geprüft: `script.txt`, `caption.txt`, `thema.md`, `hooks.md`, `prompt-fuer-kommentare.md`, `briefing.md` gegen `../firma-tag4/tagesbriefing-2026-10-29.md` (Regeln 1–8 + Chef-Entscheide), `design/lauf/LAUF.md` + `bericht.md`, `../firma-tag5/script.txt` + `../firma-tag5/thema.md`, `../firma-neu-tag1/konzept.md`, Bewertung firma-pruefer „autor“.

**Ergebnis: NICHT bestanden** (2 Kriterien < 8, ein K.-o.-Punkt verletzt: Erzähler-Handlung angekündigt, die nicht stattgefunden hat und so nicht sicher lieferbar ist).

## Noten

| Kriterium | Note | Beleg |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 9 | script.txt:1 feste Eröffnung wörtlich; Rückblick-Satz 1 (script.txt:2) = Chef-Entscheid „bestickt“ wörtlich. |
| Mehrwert, Beginn ≤ 14 s, heute umsetzbar | 8 | script.txt:4 Klickweg „Plus, Research an, Ergebnis anhängen“ beginnt nach „Heute …“ (≈ 12,8 s laut thema.md:55); Research-Pläne in caption.txt:6 belegt (support.claude.com). |
| Thema (Schmerz, ein Bild) | 8 | thema.md:5 „Wer stellt das für mich her, ohne Lager?“; Bild 151 € rot vs 110 € grau, eindeutig. |
| Hook (Satz 2 + Frame 1 → Frage) | 8 | hooks.md:9 Frame 1 = Partner-Wand + rote Rechnung 151 € vs 110 € → „warum teurer als der Markt?“; Muster M-002/M-005 benannt. |
| Kommentar-Mechanik | 9 | CTA script.txt:11 verspricht nur „Frage + Partnertabelle … mögliche Partner im Vergleich“; prompt-fuer-kommentare.md liefert genau das, inkl. „n. g.“-Stellen (Z. 18). |
| Länge / Eröffnung / kein Tag / kein „gestern“ / Rückblick ≤ 6 s | 9 | 132 Wörter (wc). Kein Tag, kein „gestern“ (Skript + Caption: „In der letzten Folge“). Kalibrierung `firma-tag4/regie/words.json`: Satz 1 = 5,732→9,562 s = 3,83 s, Lücke 0,06 s; Satz 2 „Ihre Lücke: Shirts einzeln nachbestellen.“ = 11 Silben ≈ 1,9 s (Folge 4: 12 Silben ≈ 2,06 s) → ≈ 5,8 s. Knapp: der Doppelpunkt nach „Lücke“ kann eine TTS-Pause erzeugen; Regie muss messen. |
| Imperativ/Ansprache nur im CTA | 8 | script.txt:4 „Frage: …“ als Infinitiv/Telegramm wie Folge 5, keine Ansprache; „du“ nur in script.txt:11 (CTA). Caption „So machst du das …“ siehe Hinweis H3. |
| Warum: 2–3 konkrete Gründe mit Zahl aus dem Lauf | 8 | script.txt:6–7 = Bericht „Entscheidung“ Grund 1 und 2 wörtlich sinngemäß (bericht.md:67–68): „Einziger belegter Partner … 60-°C-Workwear“, „Preisstaffel beginnt bei 1 Stück“. Zahlen 60 °C / 1 Stück. Schwäche: Grund 2 unterscheidet A61 nicht (alle sechs Plattformen der Tabelle haben Mindestmenge 1/1, LAUF.md Tabelle), siehe Ticket 1. |
| Schritt-Kette / Anschluss an Folge 5 | **6** | Folge 5 Ergebnis (firma-tag5/script.txt:6): „hält beim Preis mit und setzt auf einzelne Nachbestellungen **ohne neue Einrichtung**“, offene Frage (firma-tag5/script.txt:10): „Welcher Partner stickt Einzelstücke **ohne neue Einrichtung**?“. Folge 6 kürzt auf „Shirts einzeln nachbestellen“ (script.txt:2) und lässt das Kriterium bewusst weg (thema.md:23: „Bewusst nicht gesagt: ‚ohne neue Einrichtung‘, denn die Stickprogramm-Kosten bei A61 sind ‚n. g.‘“). Genau diese Verkürzung war in Folge 5 schon Ticket autor-R1-1 (firma-tag5/thema.md:20: „Stick ab 1 Stück allein ist keine Lücke … deshalb ‚ohne neue Einrichtung‘“). Im Lauf erfüllt das Kriterium belegt nur Printful (Zweitwahl), bei A61 ist es offen (bericht.md: „Einmalige Stickprogramm-Kosten und ob sie bei Nachbestellungen erneut anfallen“ → anfragen). Ergebnis: Die offene Frage aus Folge 5 wird im Skript nicht beantwortet, und Rückblick + Grund 2 lassen A61 so aussehen, als schließe es die Lücke. |
| Fakten 1:1 / Erzähler erfindet nichts | **5** | script.txt:9 „Die Händlerpreise frage ich an.“ – siehe Chef-Bedenken 1 und Ticket 2. Rest 1:1: 294 Quellen (LAUF.md:12), A61 „mit Vorbehalt bis zum Händlerangebot“ (bericht.md:66), 151,40 € vs 110 € (LAUF.md Chat-Antwort, Beispielrechnung 5 × 28,90 + 6,90). „am Markt hundertzehn“ = Claude „die Konkurrenz verlangt 110 €“; Folge 5 sagte „rund“ (Hinweis H2). caption.txt:10 „stehen nirgends“ überzieht „n. g.“ (Ticket 3). |

## K.-o.-Check

| K.-o. | Status |
|---|---|
| Zuschauer direkt angesprochen (außer CTA) | ok |
| Eröffnung wörtlich, kein Tag, kein „gestern“, Satz 1 „bestickt“ | ok |
| Rückblick ≤ 6 s | ok rechnerisch (≈ 5,8 s), Regie misst |
| Warum mit 2–3 Gründen | ok (2 Gründe, je mit Zahl) |
| Ergebnis aus echtem claude.ai-Lauf | ok (Chat c874de02…, Screenshots 01a–04) |
| Unbelegte Behauptung / Versprechen, das wir nicht liefern können | **verletzt**: „Die Händlerpreise frage ich an.“ kündigt eine Menschen-Handlung an, die nicht stattgefunden hat und nirgends geloggt ist; sie wäre ohne Gewerbe (Konzept: Gewerbe erst Folge 12) kaum ehrlich durchführbar und kann bis Folge 7 (18:00) keine Antwort bringen. |
| Schritt-Kette: startet beim Ergebnis der Vorfolge | **teilweise verletzt**: Ergebnis von Folge 5 verkürzt um das entscheidende Kriterium; offene Frage aus Folge 5 bleibt im Skript unbeantwortet (Ticket 1). |
| Übergabe Folge 7 | ok: „Als Nächstes rechnet sie: Bleibt pro Shirt überhaupt etwas übrig?“ = Tagesbriefing Folge 7 „rechnet sie ihren Preis“. |

## Chef-Bedenken, ausdrücklich bewertet

**(1) „Die Händlerpreise frage ich an.“ – nicht ehrlich in dieser Form, auch die vorgeschlagene neutrale Fassung reicht nicht ganz.**
- Konzept (`firma-neu-tag1/konzept.md:11`): Erzähler „sagt ehrlich, wenn ich selbst ran muss“, „erfindet keine … Erlebnisse“. Die Anfrage ist bisher nicht passiert (kein Beleg in LAUF.md/bericht.md), „frage ich an“ ist also eine Ankündigung, die das Video als Tatsache setzt.
- Bibel-Widerspruch: Konzept Z. 23/72 und 128 setzt den **ersten** Moment, „in dem ich ran muss“, bewusst auf die Gewerbe-Folge. Ein beiläufiges „ich frage an“ in Folge 6 nimmt diesen Wendepunkt vorweg.
- Lieferbarkeit: A61 fragt laut Bericht selbst „ob ein Gewerbenachweis nötig ist“; ohne Gewerbe (erst Folge 12) ist eine echte Händleranfrage kaum ehrlich möglich, und Folge 7 (drei Stunden später) hat keine Antwort → offener Faden, den keine Folge einlösen kann.
- Tagesbriefing Regel 6: Braucht ein Schritt Gmail o. ä. → im Bericht an Pius notieren, nicht still durch den Menschen ersetzen.
- „Die Händlerpreise muss sie erst anfragen.“ ist besser (kein erfundenes Erlebnis), verspricht aber wieder eine Handlung, die die KI ohne Mail-Zugang nicht ausführen kann. **Am ehrlichsten ist ein reiner Befund aus dem Lauf**, der zugleich Folge 7 übergibt: „Händlerpreise und Einrichtungskosten findet Claude dort nicht.“ (1:1: bericht.md:3 „Händlerpreise und die Kosten für das Stickprogramm … nicht zu finden (n. g.) und müssen angefragt werden“). Das schließt auch die offene Frage aus Folge 5 ehrlich (Einrichtung bei A61: unbekannt).
- Folgepflicht: Regie-Notiz „Menschen-Moment: Hand legt Brief ‚Anfrage: Händlerpreise‘“ (thema.md:46) und caption.txt:10 „Die Anfrage schicke ich …“ müssen mit.

**(2) „Ihre Lücke: Shirts einzeln nachbestellen.“ – Kern richtig, als Ergebnis-Kurzform aber unvollständig an der entscheidenden Stelle.**
- Richtig: Folge 5 „setzt auf einzelne Nachbestellungen“; „Lücke“ ist Claudes eigenes Wort im Lauf 5 (firma-tag5/prompt-fuer-kommentare.md:18) und im Lauf-6-Prompt. Für Neue verständlich, ≤ 11 Silben.
- Unvollständig: Folge 5 hat ausdrücklich „ohne neue Einrichtung“ gesagt und genau danach gefragt; „einzeln nachbestellen“ allein ist laut Folge-5-Ticket keine Lücke (fast alle Plattformen können 1 Stück, LAUF.md Tabelle: 6 von 7 mit 1/1). Das Weglassen ist laut thema.md:23 bewusst geschehen, weil A61 das Kriterium nicht belegt – das glättet den Lauf.
- Bewertung: Satz 2 darf so bleiben, **wenn** das Kriterium im Skript an anderer Stelle ehrlich auftaucht (Ticket 1 + 2 lösen das in einem Satz). Alternative im Rückblick (11 Silben, 5 Wörter): „Ihr Ziel: Nachbestellen ohne Einrichtung.“ – dann ist „Einrichtung“ für Neue aber weniger greifbar; der Prüfer empfiehlt Variante über den Grenze-Satz.

## Tickets

```
TICKET autor-R1-1 → firma-autor
Kriterium: Schritt-Kette / Anschluss Folge 5 · Note: 6/10
Beleg: script.txt:2 und :7; thema.md:23; ../firma-tag5/script.txt:6 + :10; ../firma-tag5/thema.md:20; bericht.md:3 + Entscheidung (offene Punkte A61)
Problem: Das Ergebnis von Folge 5 („einzelne Nachbestellungen ohne neue Einrichtung“) wird auf „einzeln nachbestellen“ verkürzt, und die offene Frage aus Folge 5 („Welcher Partner stickt Einzelstücke ohne neue Einrichtung?“) bleibt unbeantwortet, obwohl der Lauf die Antwort hat (A61: offen, nur Printful belegt).
Soll: Das Skript nennt das Kriterium „Einrichtung“ und sagt 1:1 aus dem Lauf, dass es bei A61 nicht gefunden wurde; kein Satz legt nahe, A61 schließe die Lücke aus Folge 5 belegt. Rückblick bleibt ≤ 11 Silben, Gesamt 110–135 Wörter.
Formulierungsvorschlag: Rückblick-Satz 2 unverändert lassen und script.txt:9 ersetzen durch „Händlerpreise und Einrichtungskosten findet Claude dort nicht.“ (7 Wörter, Skript dann 134). Alternativ Rückblick „Ihr Ziel: Nachbestellen ohne Einrichtung.“ (11 Silben) + Grenze-Satz wie oben. TTS-Betonungstest für „Einrichtungskosten“.
```

```
TICKET autor-R1-2 → firma-autor
Kriterium: Fakten 1:1 / Erzähler erfindet nichts (K.-o. „Versprechen, das wir nicht liefern können“) · Note: 5/10
Beleg: script.txt:9 „Die Händlerpreise frage ich an.“; thema.md:7, :25, :46; konzept.md:11, :23; tagesbriefing Regel 6
Problem: Der Erzähler kündigt eine echte Anfrage an, die nicht stattgefunden hat, ohne Gewerbe kaum ehrlich machbar ist, bis Folge 7 keine Antwort bringen kann und den in der Bibel gesetzten „ersten Moment, in dem ich ran muss“ (Gewerbe) vorwegnimmt.
Soll: Kein Satz in Skript, Caption oder Regie-Notizen behauptet oder kündigt eine Handlung des Menschen an, die nicht in LAUF.md belegt ist; die Lücke wird als Befund aus dem Lauf formuliert. thema.md „Grenze von ganz alleine“ (Z. 7) und „Menschen-Moment“ (Z. 46) entfernt bzw. auf den Befund umgeschrieben; der Bedarf an einem Mail-Connector steht als Notiz an Pius im Bericht (Tagesbriefing Regel 6).
Formulierungsvorschlag: „Händlerpreise und Einrichtungskosten findet Claude dort nicht.“ (deckt Ticket 1 mit ab). Kürzere Alternative ohne Einrichtung: „Die Händlerpreise sind nicht öffentlich.“ (Claude wörtlich: „Händlerpreisen, die nicht öffentlich sind“). Nicht: „Die Händlerpreise muss sie erst anfragen.“ (wieder eine Handlung, die die KI ohne Mail-Zugang nicht ausführen kann). Regie-Bild statt Hand mit Brief: Feld „Händlerpreis: ?“ / „Einrichtung: ?“ auf der A61-Karte.
```

```
TICKET autor-R1-3 → firma-autor
Kriterium: Fakten 1:1 (Caption) · Note: 6/10
Beleg: caption.txt:10 „Händlerpreise, Stickprogramm-Kosten und Lieferzeit stehen nirgends. Die Anfrage schicke ich, das kann die KI ohne Mail-Zugang nicht.“
Problem: „stehen nirgends“ überzieht „n. g. / nicht zu finden“, und „Die Anfrage schicke ich“ behauptet dieselbe nicht belegte Menschen-Handlung wie script.txt:9.
Soll: Caption sagt „nicht gefunden“ statt „nirgends“, nennt ausdrücklich, dass offen ist, ob bei A61 bei Nachbestellung neue Einrichtung anfällt, und enthält keine angekündigte Handlung des Erzählers.
Formulierungsvorschlag: „Händlerpreise, Stickprogramm-Kosten (also auch, ob bei Nachbestellungen neue Einrichtung anfällt) und Lieferzeit hat Claude bei A61 nicht gefunden; die müssten angefragt werden.“
```

## Hinweise (kein Ticket, an Chef)
- **H1 Folge 7:** Tagesbriefing erwartet aus Folge 6 „Partner + echter Einkaufspreis + Lieferzeit“. Der Lauf liefert für A61 weder Händler-Einkaufspreis noch Lieferzeit, nur Endkundenpreis 28,90/29,90 € brutto bzw. Printful 9,95 USD netto (Kurs nicht belegt). Folge 7 muss ehrlich mit diesen Werten rechnen und das so sagen; Briefing Folge 7 entsprechend anpassen.
- **H2:** „am Markt hundertzehn“ → Folge 5 sagte „Am günstigsten: rund hundertzehn“. 110 € ist der günstigste Paketpreis, nicht „der“ Marktpreis. Claude sagt allerdings selbst „Marktpreis“; optional „am Markt rund hundertzehn“ (+1 Wort).
- **H3:** caption.txt:5/7 sprechen den Leser an („So machst du das für deine Firma“, „dein letztes Ergebnis“). Tagesbriefing Regel 8 „Zielgruppe nie direkt ansprechen“ ist allgemein formuliert; Folge 5 hatte dasselbe Muster. Chef entscheidet einheitlich für die Serie.
- **H4 Neueinstieg:** Grund 1 („Sechzig-Grad-Arbeitsshirt“) setzt voraus, dass man weiß, warum 60 °C zählt (Bau wäscht heiß, Folge 3/4); im Rückblick steht das nicht. Regie sollte es im Bild klären (z. B. Pflegeetikett „60 °C · Bauwäsche“), Wortbudget reicht nicht für einen Zusatzsatz.
- **H5 Rückblick-Timing:** rechnerisch ≈ 5,8 s; der Doppelpunkt in „Ihre Lücke:“ kann 0,1–0,2 s Pause erzeugen. Regie misst nach TTS, > 6,0 s → zurück an Autor (thema.md:51).
