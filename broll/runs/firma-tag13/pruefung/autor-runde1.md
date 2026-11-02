# Prüfung autor · Folge 13 „Werbebrief“ · Runde 1

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-30. Auftrag: Fehler finden. An den Autor-Dateien nichts geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md.
Maßstab: bewertung.md „autor“; firma-tag9/tagesbriefing-2026-10-30.md inkl. Chef-Entscheide; firma-tag4/tagesbriefing-2026-10-29.md Regeln 1–8; briefing.md; firma-autor SKILL (Z. 19–44, CTA-Formel Z. 25).
Belege: design/lauf/LAUF.md, bericht.md, brief-text.txt; Vorfolge firma-tag12/script.txt; Ton firma-tag8/script.txt, firma-tag9/script.txt; Fehlerbilder firma-tag10/11/12 pruefung/autor-runde*.md.

## Messwerte
- script.txt: **100 Wörter** (`wc -w`), Obergrenze genau erreicht, null Reserve.
- Sätze: fest 15/4/15; frei 1–12 (längster: Damit-Satz 12, Weg-Satz 9) ✓. Kein „du“/Imperativ außerhalb Z. 11–12 ✓. Kein „Tag drei“ ✓ (Folge 13 nicht erste, Tagesbriefing Slots Z. 14).
- Rückblick-Satz 2 „Zwanzig Betriebe in Chemnitz.“ = 8 Silben ✓ (≤ 11). Passt zum aktuellen Ergebnis Folge 12 (firma-tag12/script.txt:3 „Heute sucht sie zwanzig Betriebe in Chemnitz.“, :5 „Fünf würde sie zuerst ansprechen.“) ✓.
- Zeit (Kalibrierung F8 words.json ×1,15, 5,9 Silben/s): Rückblick 4,26 + 0,4–0,7 + 1,36 = **6,0–6,3 s** ✓ (≤ 6,5). „Heute“-Start 5,60 + 4,26 + 1,36 + 3 Pausen à 0,4–0,7 = **12,4–13,3 s** ✓ (≤ 14,5; thema.md:73 rechnet 12,9–13,8, konservativer, auch ok). Weg-Satz beginnt ≈ 14,7–16,0 s (strukturell wie F11/F12, dort akzeptiert).
- Gesamt: 100 / 155 wpm = 38,7 s + 14 Satzgrenzen + 3 Doppelpunkte. Für 120–135 wpm sind 44,4–50 s nötig, für ≤ 48 s Pausen-Schnitt 0,41–0,64 s → **erreichbar, aber schmales Fenster** (thema.md:74 ✓).
- caption.txt: **2074 Zeichen** (Python `len`, ohne Schluss-Umbruch) ✓ < 2100. Endet mit „(Fiktives Experiment, keine echten Umsätze.)“ + 1 Zeile Hashtags (6) ✓. Emoji-Scan (> U+2000 außer „“–…‘’) leer ✓.
- Privat: `grep -inE "hamburg|fabrice|müller|boilr|\[BERUF\]"` in allen 5 Prüflingen: nur Abnahme-/Verbotszeilen (prompt-fuer-kommentare.md:23, thema.md:65), kein Stadt-, Personen- oder Betriebsname ✓. Personenname aus bericht.md:26 im Guide-Pfad ausdrücklich gestrichen (prompt-fuer-kommentare.md:15) ✓; Quellenliste (bericht.md:34–44) enthält keinen Hamburg-Link ✓.
- LAUF.md-Zeilenzitate in thema.md (Z. 8, 10, 13, 16, 17, 25, 29–31, 34–36, 41, 45, 48) stichprobenweise alle korrekt ✓.

## Faktenabgleich Recht/Gründe
| Gesprochen | Lauf (LAUF.md) | Urteil |
|---|---|---|
| Z. 6 „Werbe-Mail braucht Einwilligung, auch bei Firmen.“ | :29 „ohne vorherige … Einwilligung … grundsätzlich unzulässig. Das UWG unterscheidet … nicht zwischen B2C und B2B.“; :34 Grund 1 | ✓ nicht zugespitzt, kein „verboten“ |
| Z. 7 „Ein Brief nicht.“ | :36 „Der Brief ist ohne Einwilligung erlaubt.“ | ✓ wörtlich sinngleich |
| Z. 8 „Anruf braucht einen konkreten Grund.“ | :30 „konkreter Grund aus dem Interessenbereich des Angerufenen“; :35 Grund 2 „bei keinem der fünf Betriebe einen konkreten Grund, der aus seinem Interesse kommt. „Firmenshirts sind nützlich für Handwerker“ reicht … nicht.“ | **halbiert**: gesprochen nur die Regel, nicht der Befund („gibt es bei keinem“) und nicht „aus Sicht des Betriebs“. Alltagssprachlich hat sie einen konkreten Grund (Shirts verkaufen) → der Grund trägt die Entscheidung beim Hören nicht (T-03) |
| Z. 9 „Haken: Versandkosten fehlen.“ | :41, brief-text.txt:13 | ✓ |
| Z. 10 „Als Nächstes: Welche Adressen?“ | :48 Claudes Angebot Impressums-Adressen, :45 „weiter offen“ | ✓ offen, nicht beantwortet; Formulierung unklar (T-04) |
| Caption Z. 11–13, 17, 19 | :29–31, :34–36, :41, :25 | ✓ 1:1, „grundsätzlich“, „laut Claude“, „kein Anwalt“, „keine Rechtsberatung“, Quellenart ehrlich |
Quellen je Rechtsaussage in thema.md:22–27 ✓. Kein Versand, kein Umsatz als erledigt erzählt ✓ (thema.md:4, :34).

## Bewertung
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung wörtlich, ohne Tag ✓ |
| Neueinstieg/Rückblick (Produkt + Stand, ≤ 6,5 s, „Heute“ ≤ 14,5 s) | 7 | Zeiten ✓ (Messwerte). Aber script.txt:2 „… verkauft Shirts mit Logo an kleine Betriebe, bestickt erst auf Bestellung. Zwanzig Betriebe in Chemnitz.“ – direkt nach „verkauft … an kleine Betriebe“ hört ein Neuer: „Sie hat zwanzig Betriebe (Kunden) in Chemnitz.“ Nichts sagt hörbar, dass das nur eine gefundene Liste ist (kein Verb, kein „Liste“). Widerspricht der Kasse 0 € und der Regel „Stand-Satz = Ergebnis der Vorfolge“, das Ergebnis war eine Suche. hooks.md:15 kennt das Problem nicht; die Karte „20 Betriebe · Chemnitz“ (thema.md:55) löst es auch nicht. |
| Mehrwert: nachbaubare Schritte mit Claude, Beginn ≤ 14 s | 8 | script.txt:4 Anhang, Websuche, Word-Datei hörbar (Fehlerbild F11 R1-01 behoben) ✓. Telegrammstil wie F12 (dort 8). „Liste“ ist durch Z. 2 gedeckt. Beginn ≈ 15–16 s, strukturell wie F11/F12. |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 9 | thema.md:5 „Darf ich Firmen einfach anschreiben?“; echter Brief mit Logo + durchgestrichene Wege ✓; Kette F12 → F13 laut Tagesbriefing Z. 42 ✓ |
| Hook: Satz 2 + Frame 1 erzeugen Frage, Muster belegt | 8 | hooks.md:9–10 durchgestrichene „E-Mail“/„Anruf“ erzeugen „Warum nicht?“ ✓, M-002/M-011 ✓. Abzug: Frame 1 trägt Text-Hook + Stempel + Briefseite + zwei Karten gleichzeitig (Regel „ein neuer Textblock“) – Regie muss staffeln. |
| Entscheidung der KI klar erkennbar und 1:1 | 7 | script.txt:5 „Sie wählt den Brief.“ = Lauf :25 ✓, Handelnde ✓. Aber nur hörend: Die Alternativen (Mail, Anruf) fallen vor der Entscheidung nie; Z. 3 hat den Werbebrief schon angekündigt → „wählt den Brief“ klingt zirkulär (wählt ihn statt was?). Die drei Wege tragen nur Karten (thema.md:56 „erst am Ende des Satzes“). Erst die Gründe in Z. 6–8 lassen die Wahl rückwirkend erraten. |
| Warum: 2–3 konkrete Gründe 1:1 aus dem Lauf, verständlich | 7 | Z. 6–7 ✓ (s. Faktenabgleich). Z. 8 Anruf nur als Regel, ohne Lauf-Befund „bei keinem der fünf“ und ohne „aus Sicht/Interesse des Betriebs“ → 16-Jährigen-Test scheitert: Er kann nicht erklären, warum der Anruf rausfällt. Gekürzt wurde am Warum (Regel: „nie beim Warum“). |
| Haken korrekt, nichts als erledigt erzählt | 9 | script.txt:9 ✓; Abschicken nicht erzählt ✓; „Briefentwurf“ statt „fertiger Brief“ ✓ |
| Schritt-Kette + Übergabe | 7 | Kette ✓ (Eingabe = Ergebnis F12 als Anhang, LAUF.md:8; beantwortet F12-Übergabe „Was schreibt sie?“). Übergabe script.txt:10 „Welche Adressen?“: ohne Bezug, und direkt nach „Werbe-Mail braucht Einwilligung“ liegt „E-Mail-Adressen“ nahe. Die Caption (Z. 23) sagt es richtig: „An welche Adressen gehen die Briefe?“. Nicht vom eigenen Lauf beantwortet ✓, Lauf 14 existiert noch nicht. |
| CTA: konkreter Wert, nur Lieferbares, Formel | 9 | script.txt:11–12 Formel komplett, zwei greifbare Teile „Frage und Briefvorlage“ (Fehlerbild F10/F11 „nur die Frage“ behoben) ✓; „Briefentwurf“ verspricht nicht mehr als lieferbar ✓; zehn Minuten plausibel (Lauf 2:25 + Anhängen/Füllen), gilt dank Variante B auch ohne Anhang ✓ |
| Kommentar-Mechanik (prompt-fuer-kommentare.md) | 9 | Variante A + B + Teil-Fallbacks (Z. 33) ✓, [BERUF] 0, Beispiele für 4 Berufe ✓, Original-Prompt ✓, Namen-Streichung festgelegt (Z. 15) ✓, Anhang nie in den Guide (Z. 16) ✓, „ungetestete Abwandlung“ markiert ✓ |
| Länge/Satzregeln/Bildschirmtext | 8 | 100 Wörter ✓ (hart), Sätze ≤ 12 ✓, Karten geplant (thema.md:59–61). Abzug: null Reserve; Karten „BRIEF: OHNE EINWILLIGUNG ERLAUBT“ = 4 Wörter + Kleinzeile, an der Grenze; Weg-Satz = Aufzählung in einem Satz (Grenzfall, wie F12). |
| Caption | 9 | 2074 ✓, Fiktiv-Ende + Hashtags ✓, keine Emojis ✓, Menüpfad „+“ ✓, Gründe 1:1 mit „grundsätzlich“ ✓, Quellenart + „kein Anwalt“ + „keine Rechtsberatung“ ✓, Übergabe klar formuliert ✓ |
| Claude-Behauptungen belegt | 8 | Alle Zahlen (2 min 25 s, 5 Websuchen, 0 Seiten, 11 Links, 14 Platzhalter) stimmen mit LAUF.md:16–20, :89 ✓. Abzug wie F10: Claude-Funktionen („+“, Websuche ohne Schalter, Word-Datei als Ergebnis) nur über Screenshots/Lauf belegt, keine support.claude.com-Quelle in thema.md:11 (SKILL Ablauf 2), u. a. ob Websuche und Dateierstellung für jeden Plan verfügbar sind. |
| Rechtliche Aussagen 1:1, nicht zugespitzt, mit Quelle | 8 | Wortlaut ✓, Quellen ✓, kein Paragraf/„verboten“/„rechtssicher“ ✓ (thema.md:34). Abzug: drei Rechtsregeln in Erzählerstimme, im Video kein „laut Claude/keine Rechtsberatung“ geplant (thema.md:62 nur Quellenzeile) – Fehlerbild F11 „Rechtliche Aussagen“ in abgeschwächter Form. |
| Keine private Info, keine Ansprache | 10 | grep ✓, Personenname nur gestrichen, 05 nur anonym (thema.md:65), Impressums-Warnung für F14 (thema.md:50) ✓ |

## K.-o.-Check
| K.-o. | Ergebnis |
|---|---|
| Zuschauer direkt angesprochen außerhalb CTA | nein ✓ |
| Ergebnis nicht aus echtem claude.ai-Lauf | nein, Chat b0fbcaf2, 2 min 25 s, docx per API ✓ |
| Unbelegte Claude-Behauptung | nein ✓ (Anruf-Grund verkürzt, nicht erfunden → Note 7) |
| ChatGPT statt Claude | nein ✓ |
| Versprechen nicht lieferbar | nein ✓ („Briefentwurf“, Guide Punkt 1–2) |
| „Niemand hat kommentiert“ | nein ✓ |
| Warum fehlt | nein, 3 Gründe ✓ |
| Neuer versteht bis 14 s Projekt + heutigen Schritt | ja, aber Stand missverständlich (T-01, Note 7, kein K.-o.) |
| Sprung/Wiederholung in der Kette | nein ✓ |
| „Tag drei“ in nicht-erster Folge | nein ✓ |
| > 100 Wörter | nein, genau 100 ✓ |
| Umsatz/Versand als erledigt | nein ✓ |
| Hamburg/Betriebs-/Personenname in Zuschauer-Texten oder Guide-Pfad | nein ✓ |

## Gesamt
**Nicht bestanden.** Gesamtnote **8,3/10** (Mittel der 16 Kriterien), kein K.-o. verletzt, aber 4 Kriterien bei 7: Rückblick (T-01), Entscheidung (T-02), Warum (T-03), Übergabe (T-04). Alle vier sind dasselbe Fehlerbild: Der Satz stimmt mit dem Lauf, ist aber **nur hörend** missverständlich bzw. unvollständig. Caption, Guide-Vorlage, CTA, Rechts-Faktentreue und Privatsphäre sind gut.
Wortbudget: Die Tickets kosten zusammen ca. +4 bis +8 Wörter. Ausgleich z. B.: Satz 2 „Liste: zwanzig Betriebe.“ (−1), Weg-Satz ohne „zur Rechtslage“, wenn die Wege-Frage hörbar wird (−2). Gekürzt wird nie am Warum.

## Tickets
```
TICKET autor-R1-01 → firma-autor
Kriterium: Neueinstieg/Rückblick · Note: 7/10
Beleg: script.txt:2 „… verkauft Shirts mit Logo an kleine Betriebe, bestickt erst auf Bestellung. Zwanzig Betriebe in Chemnitz.“; hooks.md:15
Problem: Ohne Verb/„Liste“ klingt Satz 2 nach Satz 1 so, als hätte die Firma schon zwanzig Betriebe als Kunden; das Ergebnis von Folge 12 war nur eine gefundene Liste (Kasse 0 €).
Soll: Satz 2 macht hörbar, dass es eine Liste/ein Suchergebnis ist (z. B. „Liste: zwanzig Betriebe.“ 7 Silben oder „Zwanzig Betriebe auf der Liste.“ 9 Silben), ≤ 9 Silben, damit der Rückblick auch mit 0,7 s Pause ≤ 6,5 s bleibt; Rechnung in thema.md „Länge“ und Rückblick-Karte (thema.md:55) angepasst.
```
```
TICKET autor-R1-02 → firma-autor
Kriterium: Entscheidung der KI · Note: 7/10
Beleg: script.txt:3–5 „Heute schreibt sie ihren ersten Werbebrief. / Claude: … Websuche zur Rechtslage, Word-Datei. / Sie wählt den Brief.“; thema.md:56 (Wege nur als Karten)
Problem: Die Alternativen Mail und Anruf fallen vor der Entscheidung nie hörbar; nach angekündigtem Werbebrief klingt „wählt den Brief“ zirkulär.
Soll: Vor oder in der Entscheidung sind die drei Wege gesprochen (z. B. „Mail, Anruf oder Brief? Sie wählt den Brief.“ oder „Sie wählt Brief statt Mail oder Anruf.“), Satz ≤ 12 Wörter, ohne Imperativ; Regie-Hinweis thema.md:56–57 auf den neuen Wortlaut.
```
```
TICKET autor-R1-03 → firma-autor
Kriterium: Warum · Note: 7/10
Beleg: script.txt:8 „Anruf braucht einen konkreten Grund.“ vs. LAUF.md:35 „bei keinem der fünf Betriebe einen konkreten Grund, der aus seinem Interesse kommt. „Firmenshirts sind nützlich für Handwerker“ reicht … nicht.“
Problem: Gesprochen ist nur die Regel; dass der Grund aus Sicht des Betriebs kommen muss und bei keinem der fünf vorliegt, fehlt, sodass ein Zuhörer (sie hat ja einen Grund: Shirts verkaufen) nicht versteht, warum der Anruf rausfällt.
Soll: Grund 2 enthält hörbar beides: Grund aus Sicht/Interesse des Betriebs + Befund „gibt es (bei keinem) nicht“ (z. B. „Anruf braucht einen Anlass beim Betrieb. Keiner hat einen.“), Wortlaut in thema.md-Faktentabelle gegen LAUF.md:30/:35 belegt, nicht zugespitzt („verboten“ bleibt verboten); Warum-Karte 3 unverändert passend.
```
```
TICKET autor-R1-04 → firma-autor
Kriterium: Schritt-Kette + Übergabe · Note: 7/10
Beleg: script.txt:10 „Als Nächstes: Welche Adressen?“ vs. caption.txt:23 „An welche Adressen gehen die Briefe?“; LAUF.md:48
Problem: Ohne Bezug ist die Frage beim Hören unklar und liegt direkt nach dem Mail-Grund als „E-Mail-Adressen“ nahe.
Soll: Die gesprochene Übergabe nennt die Briefe bzw. Empfänger (z. B. „Als Nächstes: Wohin gehen die Briefe?“), bleibt eine vom Lauf 13 unbeantwortete Frage; thema.md:48 und Regie-Hinweis :64 angeglichen.
```
```
TICKET autor-R1-05 → firma-autor (Hinweis, nicht bestehensrelevant)
Kriterium: Rechtliche Aussagen · Note: 8/10
Beleg: thema.md:62 (nur Quellenzeile geplant), script.txt:6–8 drei Rechtsregeln in Erzählerstimme
Problem: Im Video fehlt jeder Hinweis, dass das Claudes Zusammenfassung ist und keine Rechtsberatung.
Soll: Regie-Vorgabe in thema.md:62 ergänzt um kleine Zeile „laut Claude · keine Rechtsberatung“ beim Warum-Beat (≤ 4 Wörter je Zeile, kein neuer großer Textblock).
```
```
TICKET autor-R1-06 → firma-autor (Hinweis, nicht bestehensrelevant)
Kriterium: Claude-Behauptungen belegt · Note: 8/10
Beleg: thema.md:11 (nur Screenshots als Beleg für „+“, Websuche, Word-Datei)
Problem: Keine Doku-Quelle, dass Websuche und Dateierstellung (Word) für den Zuschauer-Plan verfügbar/eingeschaltet sind; der CTA verspricht „in zehn Minuten“.
Soll: thema.md:11 nennt je Funktion eine support.claude.com-Quelle (Websuche, Dateien erstellen, Anhänge) oder der Guide-Weg (prompt-fuer-kommentare.md:27) nennt die nötige Einstellung.
```
