# Prüfung autor · Folge 10 „Website“ · Runde 1

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-29. Auftrag: Fehler finden. Nichts an den Autor-Dateien geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md.
Maßstab: bewertung.md „autor“; briefing.md (Chef-Hinweise, boilr-Zeile K.-o.); firma-tag9/tagesbriefing-2026-10-30.md inkl. Chef-Entscheide; firma-tag4/tagesbriefing-2026-10-29.md Regeln 1–8; firma-autor SKILL (Z. 22–25, 37–44). Belege: design/lauf/LAUF.md, bericht.md, website-handy.png; Vorfolge firma-tag9/script.txt; Folgelauf firma-tag11/design/lauf/LAUF.md; Maßstab firma-tag8/script.txt + caption.txt.

## Messwerte
- script.txt: **100 Wörter** (`wc -w`), Obergrenze genau erreicht, kein Spielraum für Korrekturen ohne Kürzung an anderer Stelle.
- Satzlängen: fest 15/4/15, sonst 1–10 Wörter (längster: Haken, 10) ✓.
- „Heute …“ nach 38 Wörtern. Kalibrierung Folge 8 (40 Wörter bis „Heute“, Satzende 12,5 s bei Tempo 1,15) → bei Tempo 1,0 ≈ 12 s + 3 Regiepausen à 0,4–0,7 s ≈ 13,2–14,1 s. Unter 14,5 s, aber knapp; Autor-Schätzung 11,5–12 s ist ohne Regiepausen gerechnet.
- Rückblick („Die“ bis Ende Satz 2): Satz 1 ≈ 3,74 × 1,15 = 4,3 s + Satzpause 0,4–0,7 s + „Ihr Logo: dunkelblauer Block.“ (8 Silben + Doppelpunkt-Pause) ≈ 1,6–1,9 s = **6,3–6,9 s**. Grenze 6,5 s ist gefährdet; Autor-Wert 6,0–6,3 s rechnet die Pause zu knapp.
- Gesamttempo: für ≤ 135 wpm braucht es ≥ 44,4 s. Rohtempo ~155–159 wpm → 37,7–38,7 s + 14 Satzgrenzen à ~0,45 s ≈ 44–45 s. Machbar, nur wenn die Regie fast überall Pausen setzt.
- caption.txt: **2034 Zeichen** (ohne Schluss-Zeilenumbruch, `len`), < 2100 ✓. Endet mit „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags ✓. Keine Emojis (Zeichen-Scan > U+2000 außer „“–… leer) ✓.
- Privat: `grep -i "boilr|hamburg"` in allen 5 Prüflingen: 0 Treffer ✓. „Domain/Hosting“ nur in prompt-fuer-kommentare.md:27 als Verbot ✓.
- „du“/Imperativ außerhalb CTA: script.txt keine (Z. 4 „anhängen“ Infinitiv, „Frage:“ Nomen) ✓; caption.txt nur im zitierten Prompt (Z. 7) und im CTA (Z. 13), wie Folge 8 ✓.
- website-handy.png (390 × 844, erster Bildschirm): zeigt Satz/Zielgruppe, Preisbox, „Jetzt bestellen“ **und darunter noch** „So funktioniert's“ mit Schritt 1 und 2. Claudes Grund bezieht sich auf „rund 650 px sichtbare Höhe“ (LAUF.md, Grund 2), nicht auf 844 px.

## Bewertung
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung wörtlich, kein Tag (Folge 10 nicht erste, tagesbriefing-2026-10-30 Slots) ✓ |
| Neueinstieg/Rückblick (Produkt + Stand, ≤ 6,5 s, „Heute“ ≤ 14,5 s) | 7 | script.txt:2 „Ihr Logo: …“ – Satzanfang „Ihr“ hört sich beim ersten Hören wie Sie-Anrede an (exakt das Problem, das firma-autor SKILL Z. 31 bei „Ihre Firma“ verbietet). Rückblick-Dauer 6,3–6,9 s geschätzt (s. Messwerte), Grenze 6,5 s nicht sicher. „Heute“ ≈ 13,2–14,1 s ok. |
| Mehrwert: nachbaubare Schritte, Beginn ≤ 14 s | 6 | script.txt:4 „Logo und Ergebnis anhängen. Frage: Was gehört nach oben?“ – der eigentliche Auftrag des Laufs (LAUF.md Prompt: „Bau mir eine einfache Startseite als Vorschau hier im Chat … fürs Handy“) fehlt im Gesprochenen. Wer nur hört, weiß nicht, dass Claude die Seite baut; die Frage „Was gehört nach oben?“ allein liefert keine Seite. Folge 8 nennt den kompletten Auftrag (firma-tag8/script.txt:4). |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 9 | thema.md:6 „Was schreibe ich auf meine Website, und was zuerst?“; hooks.md:9 echtes Handy-Bild ✓; Kette 9→10 passt (tagesbriefing Kette Z. Folge 10) |
| Hook: Satz 2 + Frame 1 erzeugen Frage, Muster belegt | 8 | hooks.md:9 Frame 1 echtes Ergebnis + Stempel „ENTWURF“ (Lauf-Wort ✓, M-002/M-011). Satz 2 selbst erzeugt keine Frage, Spannung erst ab „Haken“. Ok. |
| Entscheidung der KI klar erkennbar und 1:1 | 6 | script.txt:5 „Oben: für wen, Preis, Bestellknopf.“ – kein Handelnder (Folge 8 „Die KI wählt: …“, Folge 9 „Sie nimmt …“), und Punkt 1 des Laufs heißt „**Was es ist** und für wen“ (LAUF.md, Schlussantwort 1.); „für wen“ allein als Listenpunkt ist beim ersten Hören kaum als „Satz, für wen das Angebot ist“ zu verstehen. „Oben“ ohne „ganz oben auf der Seite“ ist doppeldeutig. |
| Warum: 2–3 konkrete Gründe 1:1 aus dem Lauf, verständlich | 6 | script.txt:6 „Das prüft ein Betrieb zuerst.“ – Lauf sagt „Ein Betrieb, der dich prüft, will drei Fragen **schnell** beantwortet haben“; „zuerst“ steht nicht im Lauf, und gehört klingt der Satz zirkulär (oben steht, was man zuerst prüft). Die drei Fragen trägt nur das Bild (thema.md:73 räumt ein „nur gehört etwas knapp“). script.txt:7 „Mehr passt aufs Handy nicht.“ – verkürzt-falsch: Lauf sagt „Auf dem Handy passt nur wenig **in den ersten Blick**“ (~650 px); die Seite ist 1960 px lang und hat viel mehr Inhalt (website-handy-voll.png). Zudem zeigt das geplante Bild website-handy.png auf demselben Bildschirm schon „So funktioniert's“ → Bild widerspricht dem Satz. |
| Haken korrekt, nicht verkürzt-falsch | 8 | script.txt:8 vs. LAUF.md „Was fehlt, bevor die Seite online gehen **darf**“ → „Impressum“, „Datenschutzerklärung“ ✓ (Claude sagt „darf“ selbst, rechtlich mit „ich bin kein Anwalt“). „Datenschutz“ statt „Datenschutzerklärung“ ist ungenau (klingt nach allgemeinem Datenschutz); wortneutral korrigierbar. Domain/Hosting nirgends als Claude-Ergebnis ✓. |
| Schritt-Kette ab Folge 9 + Übergabe | 9 | Eingabe = Logo-SVG byte-gleich + Ergebnis 9 (LAUF.md Anhänge) ✓; beantwortet Übergabe 9 „Was muss oben auf ihre Website?“ ✓. „Was muss sie anmelden?“: Lauf 10 beantwortet es nicht (nur Namensprüfung DPMA/EUIPO = Prüfung), Lauf 11 schon („Als Erstes kommt die Gewerbeanmeldung“, LUCID, firma-tag11 LAUF.md:21,26,28) ✓. Kleiner Sprung Impressum → anmelden wird nicht hörbar verbunden, aber logisch. |
| CTA: konkreter Wert, nur Lieferbares, Formel | 7 | script.txt:10 „ich schick dir **die Frage**“ – dünn: der Guide liefert laut prompt-fuer-kommentare.md:3–7 Frage + drei Dinge oben + Liste „was bis online fehlt“ + Entwurf als Bild; Caption:13 nennt das auch, das Video nicht. Folge 8: „Frage und Prüfliste“. „Fünf Minuten“: Lauf 2 min 12 s (LAUF.md Ergebnis) + Anhängen/Lesen – plausibel, aber nur, wenn Logo + „letztes Ergebnis“ vorhanden sind; die Vorlage setzt beides voraus (prompt-fuer-kommentare.md:14), ein Fallback fehlt. |
| Kommentar-Mechanik (prompt-fuer-kommentare.md) | 8 | Fertig, mit Lauf-Original und Beispielen ✓. Mängel: Überschrift „Beispiele für [BERUF]“, aber die Vorlage hat keinen Platzhalter [BERUF] (Z. 20 vs. Z. 14); kein Hinweis, was ohne Logo/ohne letztes Ergebnis zu tun ist. |
| Länge/Satzregeln/Bildschirmtext | 8 | 100 Wörter ✓ (hart), Sätze ≤ 12 ✓, Karten ≤ 4 Wörter geplant (thema.md:57–60) ✓. Abzug: Zeitschätzung ohne Regiepausen (s. Messwerte), Rückblick knapp. |
| Caption | 9 | 2034 Zeichen ✓, Fiktiv-Ende + Hashtags ✓, keine Emojis ✓, Gründe 1:1 aus LAUF.md (drei Fragen, „in den ersten Blick“, „stärkste belegte Argument“) ✓, Haken-Liste 1:1 inkl. „kein Anwalt“ ✓, Menüpfad claude.ai → neuer Chat → „+“ ✓. |
| Claude-Behauptungen belegt | 8 | „privat, bis man sie teilt“ = Claudes eigene Aussage + „Nur du“ (LAUF.md) ✓. „+“ zum Anhängen: Lauf hängte per verstecktem input[type=file] an (LAUF.md Weg), „+“ nur über Screenshot 01/Lauf 8 gestützt; keine support.claude.com-Quelle in thema.md (firma-autor Ablauf Schritt 2). Akzeptabel, aber nicht doku-belegt. |
| Keine private Info, keine Ansprache | 10 | grep 0 Treffer boilr/Hamburg; Screenshot 04 in thema.md:62 ausdrücklich gesperrt ✓ |

## K.-o.-Check
| K.-o. | Ergebnis |
|---|---|
| Zuschauer direkt angesprochen außerhalb CTA | nein ✓ |
| Ergebnis nicht aus echtem claude.ai-Lauf | nein, Lauf f92c3fa6, 2 min 12 s ✓ |
| Unbelegte Claude-Behauptung | knapp nicht: „Mehr passt aufs Handy nicht“ und „zuerst“ sind verzerrte Lesarten des Laufs, keine erfundenen Aussagen → als Note 6 gewertet, nicht K.-o.; bleibt es so, ist es im Video ein falscher Fakt (final-K.-o.) |
| ChatGPT statt Claude | nein ✓ |
| Versprechen nicht lieferbar | nein, sofern Guide wie prompt-fuer-kommentare.md gebaut wird ✓ |
| „Niemand hat kommentiert“ | nein ✓ |
| Private boilr-Zeile (Chef) | nein ✓ |
| Warum fehlt | nein, 2 Gründe vorhanden (aber schwach, s. T-02) |
| Sprung/Wiederholung in der Kette | nein ✓ |
| > 100 Wörter | nein, genau 100 ✓ |

## Gesamt
**Nicht bestanden.** Kein K.-o. verletzt, aber 5 Kriterien unter 8 (Rückblick 7, Mehrwert 6, Entscheidung 6, Warum 6, CTA 7). Kern: Das gesprochene Warum ist nicht 1:1 aus dem Lauf („zuerst“, „aufs Handy“ statt „in den ersten Blick“) und der zweite Grund widerspricht dem geplanten Bild; der Weg verschweigt, dass Claude die Seite baut. Alle Korrekturen müssen innerhalb von 100 Wörtern bleiben; Kürzungsreserve z. B. bei „Logo und Ergebnis anhängen“ (→ „Logo anhängen“) und „Frage:“-Satz.

## Tickets
```
TICKET autor-R1-01 → firma-autor
Kriterium: Warum · Note: 6/10
Beleg: script.txt:7 „Mehr passt aufs Handy nicht.“ vs. LAUF.md Grund 2 „Auf dem Handy passt nur wenig in den ersten Blick“; website-handy.png zeigt unter dem Button noch „So funktioniert's“
Problem: Satz behauptet, aufs Handy passe nicht mehr, obwohl die Seite viel länger ist; Claude meint nur den ersten Blick (~650 px), und das geplante 844-px-Bild widerspricht dem Satz.
Soll: Der Satz enthält „ersten Blick“ (oder „ersten Bildschirm“) wie im Lauf; thema.md „Für die Regie“ verlangt, dass das Handy-Bild beim Satz auf Höhe unter dem Button beschnitten/gedimmt ist (kein „So funktioniert's“ sichtbar).
```
```
TICKET autor-R1-02 → firma-autor
Kriterium: Warum · Note: 6/10
Beleg: script.txt:6 „Das prüft ein Betrieb zuerst.“ vs. LAUF.md Grund 1 „will drei Fragen schnell beantwortet haben: Ist das für mich? Was kostet es? Wie bestelle ich?“
Problem: „zuerst“ steht nicht im Lauf, und gehört ist der Grund zirkulär; der konkrete Inhalt (die drei Fragen) existiert nur auf Karten.
Soll: Grund 1 nutzt das Lauf-Wort „schnell“ (nicht „zuerst“) und ist ohne Bild verständlich, z. B. „Genau das will ein Betrieb schnell wissen.“ oder die drei Fragen gesprochen; thema.md-Faktentabelle zitiert die Zeile wörtlich.
```
```
TICKET autor-R1-03 → firma-autor
Kriterium: Entscheidung der KI · Note: 6/10
Beleg: script.txt:5 „Oben: für wen, Preis, Bestellknopf.“; LAUF.md „1. Was es ist und für wen … 2. Der Preis … 3. Der Bestell-Button.“; Vergleich firma-tag8/script.txt:6, firma-tag9/script.txt:5
Problem: Satz ohne Handelnden und mit verkürztem Punkt 1; beim ersten Hören unklar, dass das Claudes Entscheidung ist und was „für wen“ meint.
Soll: Satz macht hörbar, dass die KI entscheidet (Subjekt „Sie“/„Die KI“), sagt „ganz oben“ statt „Oben“, und Punkt 1 deckt „was es ist und für wen“ ab (z. B. „Firmenshirts für kleine Betriebe“); ≤ 12 Wörter.
```
```
TICKET autor-R1-04 → firma-autor
Kriterium: Mehrwert/nachbaubare Schritte · Note: 6/10
Beleg: script.txt:4 „Logo und Ergebnis anhängen. Frage: Was gehört nach oben?“ vs. LAUF.md Prompt „Bau mir eine einfache Startseite als Vorschau hier im Chat … fürs Handy“
Problem: Der gesprochene Weg nennt nicht, dass Claude die Startseite baut; nachgebaut liefert die genannte Frage allein keine Seite.
Soll: Der Weg-Teil enthält hörbar den Auftrag „Startseite fürs Handy“ (bauen lassen) und bleibt in Einzelsätzen ohne Imperativ; Weg beginnt vor 14,5 s.
```
```
TICKET autor-R1-05 → firma-autor
Kriterium: Neueinstieg/Rückblick · Note: 7/10
Beleg: script.txt:2 „Ihr Logo: dunkelblauer Block.“; firma-autor SKILL Z. 31 („nicht „Ihre Firma“, das klingt nach Sie-Anrede“); Rückblick-Schätzung 6,3–6,9 s (Messwerte)
Problem: Satzanfang „Ihr“ klingt nach Sie-Anrede, und die Zeitschätzung rechnet ohne Satzpause, die Grenze 6,5 s ist nicht gesichert.
Soll: Satz 2 beginnt nicht mit „Ihr/Ihre“ (z. B. „Das Logo: dunkelblauer Block.“, 4 Wörter, 8 Silben); thema.md „Länge“ rechnet Rückblick und „Heute“-Start inkl. 0,4–0,7 s Regiepause und weist ≤ 6,5 s bzw. ≤ 14,5 s aus.
```
```
TICKET autor-R1-06 → firma-autor
Kriterium: CTA · Note: 7/10
Beleg: script.txt:10 „ich schick dir die Frage“; caption.txt:13 und prompt-fuer-kommentare.md:3–7 (Guide = Frage + drei Dinge oben + Liste bis online + Entwurf als Bild); firma-tag8/script.txt:10 „Frage und Prüfliste“
Problem: Gesprochene Lieferung „die Frage“ ist dünner und unkonkreter als der Guide; „fünf Minuten“ setzt Logo + letztes Ergebnis voraus, ohne Fallback.
Soll: CTA nennt mindestens zwei greifbare Teile des Guides (z. B. „Frage und Liste, was bis online fehlt“ in Kurzform) nach der Formel „… Damit hast du in <Zeit> <Ergebnis>“; prompt-fuer-kommentare.md enthält eine Variante ohne Logo/ohne letztes Ergebnis, damit die fünf Minuten für jeden gelten; Skript bleibt ≤ 100 Wörter.
```
```
TICKET autor-R1-07 → firma-autor
Kriterium: Haken · Note: 8/10 (Hinweis, nicht bestehensrelevant)
Beleg: script.txt:8 „Datenschutz“ vs. LAUF.md „Datenschutzerklärung“
Problem: „Datenschutz“ ist ungenauer als das Lauf-Wort.
Soll: „Datenschutzerklärung“ (wortneutral); Karte darf „DATENSCHUTZ“ bleiben.
```
```
TICKET autor-R1-08 → firma-autor
Kriterium: Kommentar-Mechanik · Note: 8/10 (Hinweis)
Beleg: prompt-fuer-kommentare.md:20 „Beispiele für [BERUF]“ vs. Vorlage Z. 14 ([PRODUKT], [ZIELGRUPPE], [PREIS UND MENGE], [TYPISCHER KUNDE], [WAS ICH NOCH NICHT VERSPRECHEN KANN])
Problem: Überschrift verweist auf einen Platzhalter, den es nicht gibt.
Soll: Überschrift nennt die echten Platzhalter oder „Beispiele nach Beruf“.
```
