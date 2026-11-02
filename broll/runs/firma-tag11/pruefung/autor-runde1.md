# Prüfung autor · Folge 11 „Gewerbe“ · Runde 1

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-29. Auftrag: Fehler finden. An den Autor-Dateien nichts geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md.
Maßstab: bewertung.md „autor“; briefing.md; firma-tag9/tagesbriefing-2026-10-30.md inkl. Chef-Entscheide; firma-tag4/tagesbriefing-2026-10-29.md Regeln 1–8; firma-autor SKILL (Regeln Z. 19–46, CTA-Formel Z. 25).
Belege: design/lauf/LAUF.md, bericht.md, checkliste-text.txt; Vorfolge firma-tag10/script.txt; Folgelauf firma-tag12/design/lauf/LAUF.md; Fehlerbilder firma-tag9 und firma-tag10 pruefung/autor-runde1.md; Zeitkalibrierung firma-tag8/words.json.

## Messwerte
- script.txt: **100 Wörter** (`wc -w`), Obergrenze genau erreicht. Jede Korrektur muss woanders Wörter sparen.
- Sätze: fest 15/4/15; sonst 1–10 Wörter ✓. Ein Gedanke pro Satz ✓.
- „Hamburg“ in script.txt, caption.txt, prompt-fuer-kommentare.md: 0 Treffer (`grep -ic`) ✓. Nur als Abdeck-Hinweis in thema.md/hooks.md (intern).
- caption.txt: **2063 Zeichen** ohne Schluss-Umbruch (2064 mit), < 2100 ✓. Endet mit „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags ✓. Keine Emojis (Scan > U+2000 leer) ✓. „Keine Rechtsberatung.“ steht drin ✓.
- Datei-Stempel gezählt (checkliste-text.txt, Zeilen exakt „Mensch“/„Claude“): **9 / 4** ✓ → „neun von dreizehn“ belegt.
- Zeit (Kalibrierung firma-tag8/words.json, Tempo 1,15, ×1,15 für Tempo 1,0): Satz 1 „Die … Bestellung.“ 4,91–8,61 s = 3,70 s → **4,26 s**. „Website: Entwurf, nicht online.“ 7 Silben ≈ 1,3 s + Doppelpunkt-Pause (thema.md:50 verlangt sie) ≈ 0,3 s + Satzpause 0,4–0,7 s → **Rückblick 6,3–6,6 s** (Grenze 6,5 s). thema.md:55 rechnet 6,0 s, weil Satzpause und Doppelpunkt-Pause fehlen bzw. zu knapp sind (dasselbe Fehlerbild wie F10 autor-R1-05).
- „Heute“-Start: F8 „Heute“ nach 40 Wörtern bei 11,04 s (Tempo 1,15) → hier 38 Wörter ≈ 12,0 s bei 1,0 + 4 Regiepausen à 0,3–0,6 s Mehrlänge → **13,2–14,4 s** (≤ 14,5 s, knapp ✓).
- Gesamt: 100 Wörter / 155 wpm = 38,7 s + ~12 Pausen ≈ 44–46 s → 130–136 wpm ✓ (Regie muss pausieren).
- Wort „Claude“ im Skript: 0. Wort „Checkliste“ vor dem CTA: 0. Wort „Datei“/„anhängen“/„Websuche“: 0.

## Faktenabgleich (Stichproben)
| Gesprochen | Lauf | Urteil |
|---|---|---|
| „Als Erstes: Gewerbe anmelden.“ | „Als Erstes kommt die Gewerbeanmeldung“ (LAUF.md, Schlussantwort) | ✓ 1:1 |
| „Pflicht ab dem ersten Tag.“ | „Sie ist Pflicht ab dem ersten Tag.“ | ✓ wörtlich |
| „Erst danach gibt es die Steuernummer.“ | Chat: „Danach folgt der Fragebogen beim Finanzamt, und **erst dann** bekommst du eine Steuernummer.“ Datei Z. 7: „Danach folgt der Fragebogen beim Finanzamt und damit die Steuernummer. Die braucht die LUCID-Registrierung …“ | **verkürzt**: Im Lauf bezieht sich „erst dann“ auf den Fragebogen, nicht auf die Gewerbeanmeldung. Gesprochen wird ein Zwischenschritt weggelassen und das „erst“ auf das Gewerbe verschoben. Außerdem fehlt, wozu die Steuernummer gebraucht wird (Lauf: Verpackungsregister). Allgemein gehört klingt der Satz wie eine Rechtsregel („ohne Gewerbe keine Steuernummer“), die so nicht stimmt und so nicht im Lauf steht. |
| „Das kann nur ein Mensch.“ | Datei Punkt 1 „Mensch – Du reichst ein und zahlst.“; Legende „Mensch = nur du (oder ein Anwalt/Steuerberater) kannst es erledigen“ | ✓ (Beleg = Datei, Chef-Entscheid) |
| „neun von dreizehn Punkten“ | Datei 9× Mensch, 4× Claude | ✓, aber „Punkte“ wovon, hört man nicht (s. T-01) |
| Übergabe „Wen spricht sie zuerst an?“ | Lauf 12: Prompt „wen ich zuerst anspreche“, Antwort „Zuerst ansprechen würde ich …“ (Top 5); Lauf 11: keine Kunden | ✓ beantwortet Lauf 12, nicht Lauf 11 |
| Caption Z. 10 „die Gebühr ist je nach Stadt verschieden“ (als Teil von „Die Gründe:“) | Lauf: „Sie kostet 25 €“; „je nach Stadt“ steht nirgends im Lauf | Chef-Formel für den Guide, in der Caption aber als Claudes Grund formuliert (s. T-06) |

## Bewertung
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung wörtlich, kein Tag (Folge 11 ist nicht die erste des Tages) ✓ |
| Neueinstieg/Rückblick (Produkt + Stand, ≤ 6,5 s, „Heute“ ≤ 14,5 s) | 7 | script.txt:2 inhaltlich gut (4 Wörter, 7 Silben, Stand aus Lauf 10 ✓). Zeitschätzung thema.md:55 „≈ 6,0 s“ ohne realistische Satz- und Doppelpunkt-Pause; mit Kalibrierung F8 6,3–6,6 s → 6,5 s nicht gesichert. Gleiches Fehlerbild wie F10 autor-R1-05. |
| Mehrwert: nachbaubare Schritte mit Claude, Beginn ≤ 14 s | 5 | Gesprochen gibt es **keinen Weg-Satz**: kein Anhängen, keine Websuche, keine Word-Datei, das Wort „Claude“ fällt nie (script.txt:3–6). Wer nur zuhört, weiß nicht, wie das Ergebnis entsteht und dass es eine Checkliste mit 13 Punkten gibt; „neun von dreizehn Punkten“ (Z. 6) bezieht sich auf etwas, das nie genannt wurde. thema.md:61 räumt ein, dass nur das Bild den Weg trägt. F10 hatte noch „Logo und Ergebnis anhängen. Frage: …“; F10 autor-R1-04 verlangte sogar mehr Weg, nicht weniger. |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 9 | thema.md:5 „Was muss ich anmelden, bevor ich was verkaufe?“; Bild = echte Checkliste mit „Mensch“-Stempeln ✓. Kette 10 → 11 passt (Tagesbriefing-Kette Zeile Folge 11) ✓ |
| Hook: Satz 2 + Frame 1 erzeugen Frage, Muster belegt | 8 | hooks.md:8–10: „GANZ ALLEINE.“ gegen „Mensch“-Stempel = echte Spannung, M-002/M-011 ✓, Hamburg-Abdeckung vorgeschrieben ✓. Abzug: Frame 1 trägt Text-Hook + Stempel + Checklisten-Text + Zähler „9 von 13“ gleichzeitig (Regel: ein neuer Textblock) und verrät die Pointe von ~22 s schon in Frame 1. |
| Entscheidung der KI klar erkennbar und 1:1 | 8 | script.txt:4 „Als Erstes: Gewerbe anmelden.“ = Lauf ✓. Kein Handelnder (F10 autor-R1-03 bemängelte dasselbe); durch „Heute klärt sie:“ davor noch verständlich. Infinitiv „anmelden“ klingt leicht nach Anweisung an den Zuschauer. |
| Warum: 2–3 konkrete Gründe 1:1 aus dem Lauf, verständlich | 7 | Grund 1 wörtlich ✓. Grund 2 script.txt:5 „Erst danach gibt es die Steuernummer.“ verkürzt (s. Faktenabgleich): „erst“ steht im Lauf beim Fragebogen; wozu die Steuernummer nötig ist, fehlt → ein 16-Jähriger kann nicht erklären, warum das der Grund ist. Als allgemeine Rechtsaussage gehört ist der Satz zu absolut. |
| Haken korrekt, nicht verkürzt-falsch, nichts als erledigt erzählt | 9 | script.txt:6 neutral „Das kann nur ein Mensch.“ ✓ (Chef-Formel), 9/13 aus der Datei gezählt ✓, kein „ich melde an“, kein Haken am Board (thema.md:47) ✓ |
| Schritt-Kette + Übergabe | 9 | Eingabe = Ergebnis Lauf 10 als Anhang (LAUF.md:7) ✓; beantwortet Übergabe F10 „Was muss sie anmelden?“ ✓; Übergabe „Wen spricht sie zuerst an?“ von Lauf 12 beantwortet, von Lauf 11 nicht ✓ |
| CTA: konkreter Wert, nur Lieferbares, Formel | 7 | script.txt:8 „ich schick dir die Frage“ – Guide liefert laut prompt-fuer-kommentare.md:4–6 Frage + echte Checkliste + Gründe + „nicht prüfen“, gesprochen wird nur „die Frage“ (F10 autor-R1-06 gleiches Fehlerbild). „deine Pflicht-Checkliste“ verspricht eine vollständige Liste der Pflichten, genau das schließt prompt-fuer-kommentare.md:7 aus („Kein Versprechen, dass die Liste vollständig oder rechtssicher ist“), und Claude selbst nennt nicht recherchierte Pflichten (checkliste-text.txt, „Weitere mögliche Pflichten …“). Formel-Teil „für dein eigenes Business“ fehlt (SKILL Z. 25). „zehn Minuten“ = Schätzung (Lauf 4:52 + Anhängen + Lesen), plausibel ✓, gilt aber nur mit vorhandenem „letzten Ergebnis“ (s. T-05). |
| Kommentar-Mechanik (prompt-fuer-kommentare.md) | 7 | Fertig, mit Lauf-Original, Beispielen, Weg und Gedächtnis-Tipp ✓. Mängel: (a) Z. 4 und Z. 15 „[BERUF]“-Platzhalter, die Vorlage Z. 11 hat keinen [BERUF] (exakt F10 autor-R1-08, nicht übernommen). (b) Vorlage beginnt „Im Anhang ist mein letztes Ergebnis“, keine Variante ohne Anhang (F10 autor-R1-06 verlangt Fallback). (c) Z. 5 „mit … allen Quellen“ und Z. 6 „‚Was Claude nicht prüfen konnte‘ 1:1“ – die Quellen enthalten „Handelskammer Hamburg“ (handelskammer-hamburg.de) und „HmbBfDI“ (datenschutz-hamburg.de), die Nicht-prüfen-Liste den Satz „Die Seite von Hamburg Service …/Handelskammer Hamburg“. Wer den Guide so baut, bringt Hamburg in den Guide (Chef-Entscheid: nie in Guide) → K.-o.-Risiko für die Guide-Stufe. |
| Länge/Satzregeln/Bildschirmtext | 8 | 100 Wörter ✓ (hart), Sätze ≤ 12 ✓, Warum-Karten ≤ 4 Wörter geplant (thema.md:46) ✓, TTS-Risikowörter gelistet ✓. Abzug: Zeitrechnung Rückblick zu optimistisch; null Wortreserve. |
| Caption | 8 | 2063 Zeichen ✓, Fiktiv-Ende + nur Hashtags ✓, neutraler Weg mit „+“ ✓, Gründe und Mensch-Liste aus Lauf/Datei ✓, „Keine Rechtsberatung.“ ✓. Abzug: Z. 10 „die Gebühr ist je nach Stadt verschieden“ steht als Teil von Claudes Gründen, ist aber nicht aus dem Lauf (Lauf: 25 €). Z. 12 „Claude kann dort nur vorbereiten“ leicht unscharf (Punkt 10: Claude kann den Button „technisch einbauen“, Punkt 11 „einbinden“). |
| Claude-Behauptungen belegt | 8 | Alles aus LAUF.md/Datei ✓; Werte (18 Websuchen, 17 Links, 4:52, 13 Punkte) stimmen ✓. Abzug: Steuernummer-Satz und Gebühr-Formel (s. o.) verschieben Claudes Aussagen. |
| Rechtliche Aussagen nicht als Rechtsberatung | 7 | Caption/Guide mit Hinweis ✓. Im Video gibt es keinen Hinweis, dafür zwei absolut klingende Rechtsaussagen in Erzählerstimme: „Erst danach gibt es die Steuernummer.“ (nicht Claudes Wortlaut) und „deine Pflicht-Checkliste“ (Vollständigkeits-/Rechtsversprechen an den Zuschauer). |
| Keine private Info, keine Ansprache | 9 | Hamburg 0 in Zuschauer-Texten ✓, kein boilr ✓, kein Imperativ/„du“ außerhalb CTA im Skript ✓. Abzug nur für das Guide-Risiko (Kommentar-Mechanik c). |

## K.-o.-Check
| K.-o. | Ergebnis |
|---|---|
| Zuschauer direkt angesprochen außerhalb CTA | nein ✓ |
| Ergebnis nicht aus echtem claude.ai-Lauf | nein, Chat 6358742d, 4 min 52 s, Datei per API geladen ✓ |
| Unbelegte Claude-Behauptung | knapp nicht: Steuernummer-Satz ist verkürzt, nicht erfunden (Note 7); Gebühr-Formel in der Caption nicht aus dem Lauf (Note 8) |
| ChatGPT statt Claude | nein ✓ |
| Versprechen nicht lieferbar | knapp nicht: „Pflicht-Checkliste“ suggeriert Vollständigkeit, die der Guide ausdrücklich nicht verspricht (T-03) |
| „Niemand hat kommentiert“ | nein ✓ |
| Warum fehlt | nein, 2 Gründe ✓ |
| Sprung/Wiederholung in der Kette | nein ✓ |
| > 100 Wörter | nein, genau 100 ✓ |
| Tag genannt / „gestern“ | nein ✓ |
| Hamburg in Video/Caption/Guide | in Video/Caption nein ✓; Guide-Vorgabe führt hinein (T-04), Risiko für die Guide-Stufe |
| Etwas als erledigt erzählt | nein ✓ |

## Gesamt
**Nicht bestanden.** Kein K.-o. verletzt, aber 6 Kriterien unter 8: Mehrwert 5, Rückblick 7, Warum 7, CTA 7, Kommentar-Mechanik 7, Rechtliche Formulierung 7. Kern: Gesprochen fehlt jeder Weg-Satz. Wer nur zuhört, erfährt nicht, wie das Ergebnis entsteht und dass es eine Checkliste mit 13 Punkten ist. Grund 2 verschiebt Claudes „erst dann“ vom Fragebogen auf das Gewerbe. Im CTA wird eine vollständige „Pflicht-Checkliste“ versprochen. Zwei Fehlerbilder aus F10 (nur „die Frage“ im CTA, [BERUF]-Platzhalter ohne Gegenstück) sind wieder da. Alle Korrekturen müssen bei ≤ 100 Wörtern bleiben. Wortreserve z. B. „Das gilt für neun von dreizehn Punkten.“ → „Bei neun von dreizehn Punkten.“ (−2) und „Heute klärt sie: Was ist vor dem ersten Verkauf Pflicht?“ straffen.

## Tickets
```
TICKET autor-R1-01 → firma-autor
Kriterium: Mehrwert/nachbaubare Schritte · Note: 5/10
Beleg: script.txt:3–6 (kein Anhängen, keine Websuche, keine Word-Datei, kein „Claude“, „Checkliste“ erst im CTA); thema.md:61; firma-tag10/pruefung/autor-runde1.md T-04
Problem: Der Claude-Weg wird nicht gesprochen, und „neun von dreizehn Punkten“ bezieht sich auf eine Checkliste, die vorher nie genannt wird.
Soll: Zwischen „Heute klärt sie …“ und „Als Erstes …“ steht ein Weg-Satz ohne Imperativ und ohne „du“, ≤ 12 Wörter, ein Gedanke. Er nennt hörbar das angehängte letzte Ergebnis und das Ergebnis „Checkliste“ (z. B. als Word-Datei mit dreizehn Punkten), alles belegt mit LAUF.md. „Heute …“ beginnt laut thema.md-Rechnung weiter ≤ 14,5 s. script.txt ≤ 100 Wörter (`wc -w`).
```
```
TICKET autor-R1-02 → firma-autor
Kriterium: Warum · Note: 7/10
Beleg: script.txt:5 „Erst danach gibt es die Steuernummer.“ vs. LAUF.md Grund 2 „Danach folgt der Fragebogen beim Finanzamt, und erst dann bekommst du eine Steuernummer. Die brauchst du für die Anmeldung im Verpackungsregister LUCID.“
Problem: Das „erst“ wandert vom Fragebogen zum Gewerbe. Der Satz klingt wie eine allgemeine Rechtsregel und sagt nicht, wozu die Steuernummer gebraucht wird.
Soll: Grund 2 entspricht einer Lauf-Aussage ohne verschobenes „erst“. Entweder Claudes Überschrift wörtlich: „Die anderen Schritte bauen darauf auf.“ (6 Wörter, Kette Gewerbe → Finanzamt → Steuernummer → Verpackungsregister auf der Karte). Oder: Fragebogen und Steuernummer in Lauf-Reihenfolge. thema.md-Faktentabelle zitiert die verwendete Lauf-Zeile wörtlich. ≤ 12 Wörter, ≤ 100 Wörter gesamt.
```
```
TICKET autor-R1-03 → firma-autor
Kriterium: CTA / Rechtliche Formulierung · Note: 7/10
Beleg: script.txt:8 „ich schick dir die Frage. Damit hast du in zehn Minuten deine Pflicht-Checkliste.“; prompt-fuer-kommentare.md:4–7 (Guide = Frage + echte Checkliste + Gründe; „Kein Versprechen, dass die Liste vollständig oder rechtssicher ist“); checkliste-text.txt „Weitere mögliche Pflichten, die ich nicht recherchiert habe“; firma-autor SKILL Z. 25; F10 autor-R1-06
Problem: Gesprochen wird nur „die Frage“ geliefert, „Pflicht-Checkliste“ verspricht Vollständigkeit, und „für dein eigenes Business“ fehlt.
Soll: Die Lieferung im CTA nennt Frage und echte Checkliste aus dem Lauf (Kurzform, z. B. „die Frage und die echte Checkliste“). Das Ergebnis im Damit-Satz verspricht keine Vollständigkeit (z. B. „eine Checkliste mit Quellen für dein eigenes Business“, kein „Pflicht-Checkliste“). Die Formel „Damit hast du in <Zeit> <Ergebnis> für dein eigenes Business“ ist erfüllt. script.txt ≤ 100 Wörter.
```
```
TICKET autor-R1-04 → firma-autor
Kriterium: Kommentar-Mechanik / private Info · Note: 7/10
Beleg: prompt-fuer-kommentare.md:5 „mit … allen Quellen“, :6 „‚Was Claude nicht prüfen konnte‘ 1:1“; checkliste-text.txt Punkt 1 „Handelskammer Hamburg: Gewerbeanmeldung“, Punkt 9 „HmbBfDI: Datenschutzkonformer Internetauftritt“, Nicht-prüfen „Den offiziellen Hamburg-Service-Eintrag … Handelskammer Hamburg“; LAUF.md Sources (handelskammer-hamburg.de, datenschutz-hamburg.de); Chef-Entscheid „Die Stadt steht nie in Video, Caption oder Guide“
Problem: Die Guide-Vorgabe verlangt alle Quellen und die Nicht-prüfen-Liste 1:1. Beide enthalten Hamburg, also käme Hamburg über Quellennamen/URLs in den Guide.
Soll: prompt-fuer-kommentare.md listet jede Hamburg-Stelle (Punkt-1-Titel, Gebühr-Zeile, Quelle Handelskammer Hamburg, Quelle HmbBfDI inkl. URL, Nicht-prüfen-Satz Hamburg-Service) mit der genauen Behandlung (weglassen oder neutral ohne Ortsnamen/URL) und schreibt dafür „1:1 außer Hamburg-Stellen“. `grep -i hamburg` über den späteren Guide-Text = 0 ist als Abnahmekriterium genannt.
```
```
TICKET autor-R1-05 → firma-autor
Kriterium: Kommentar-Mechanik · Note: 7/10
Beleg: prompt-fuer-kommentare.md:4 „mit [BERUF]-Platzhaltern“, :15 „Beispiele für [BERUF]“ vs. Vorlage :11 ([PRODUKT], [ZIELGRUPPE], [WIE/ÜBER WEN GELIEFERT WIRD], [STAND IN EINEM SATZ]); Vorlage beginnt „Im Anhang ist mein letztes Ergebnis.“; F10 autor-R1-06/-08
Problem: Platzhalter-Verweis ohne Gegenstück (F10-Fehler wiederholt). Wer keine Datei zum Anhängen hat, kann die Vorlage nicht nutzen, die „zehn Minuten“ gelten dann nicht.
Soll: Überschriften nennen die echten Platzhalter oder „Beispiele nach Beruf“, kein „[BERUF]“ mehr in der Datei (`grep -c "\[BERUF\]"` = 0). Es gibt eine Vorlage-Variante ohne Anhang (erster Satz entfällt, Stand nur im Text).
```
```
TICKET autor-R1-06 → firma-autor
Kriterium: Neueinstieg/Rückblick · Note: 7/10
Beleg: thema.md:55 „Satz 2 … ≈ 1,4 s + Pause ≈ 6,0 s“; firma-tag8/words.json Satz 1 = 3,70 s @1,15 → 4,26 s @1,0; thema.md:50 verlangt Pause nach „Website:“; F10 autor-R1-05
Problem: Die Rückblick-Rechnung lässt Doppelpunkt- und Satzpause praktisch weg. Realistisch sind es 6,3–6,6 s bei einer Grenze von 6,5 s.
Soll: thema.md „Länge“ rechnet den Rückblick mit 4,26 s + Satzpause 0,4–0,7 s + Satz 2 inkl. Doppelpunkt-Pause und weist eine Spanne aus, deren Obergrenze ≤ 6,5 s liegt. Falls nicht, gibt es eine kürzere Regie-Vorgabe (Doppelpunkt ohne Zusatzpause, Satzpause 0,4 s), die die Regie übernimmt. Gleiche Rechnung für den „Heute“-Start (≤ 14,5 s).
```
```
TICKET autor-R1-07 → firma-autor
Kriterium: Caption · Note: 8/10 (Hinweis)
Beleg: caption.txt:10 „Und sie ist schnell und günstig, die Gebühr ist je nach Stadt verschieden.“ vs. LAUF.md Grund 3 „Sie kostet 25 €“; caption.txt:12 „Claude kann dort nur vorbereiten.“ vs. checkliste-text.txt Punkt 10 „Claude kann den Button technisch einbauen“
Problem: Die Gebühr-Formel steht als Teil von Claudes Gründen, kommt aber nicht aus dem Lauf. „nur vorbereiten“ ist leicht ungenau.
Soll: Caption kennzeichnet „je nach Stadt verschieden“ nicht als Claudes Aussage (z. B. Grund 3 nur „Und sie ist schnell und günstig.“) und schreibt „vorbereiten oder einbauen“. Weiter < 2100 Zeichen (gezählt, Wert in thema.md).
```
```
TICKET autor-R1-08 → firma-autor
Kriterium: Hook · Note: 8/10 (Hinweis)
Beleg: hooks.md:8–9 (Text-Hook + Stempel „GANZ ALLEINE.“ + Checkliste + Stempel „Mensch“ + Zähler „9 von 13“ in Frame 1); Tagesbriefing „höchstens ein neuer Textblock gleichzeitig“
Problem: Frame 1 stapelt mehrere Textblöcke und nimmt die 9-von-13-Pointe vorweg.
Soll: hooks.md streicht den Zähler „9 von 13“ aus Frame 1 (er kommt erst im Haken-Beat) oder begründet die Ausnahme mit Muster-ID.
```
