# Prüfung autor · Folge 10 „Website“ · Runde 2

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-30. Auftrag: Fehler finden. Nichts an den Autor-Dateien geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md (Vergleich mit pruefung/script-r0.txt und autor-runde1.md).
Maßstab: bewertung.md „autor“; briefing.md (Slot 15:00, Chef-Hinweise K.-o.: boilr-Zeile aus Screenshot 04, Domain/Hosting nennt Claude nicht); firma-tag9/tagesbriefing-2026-10-30.md inkl. Chef-Entscheide (100 Wörter hart, Sätze ≤ 12, Rückblick ≤ 6,5 s, „Heute“ ≤ 14,5 s, Länge über Pausen); firma-tag4/tagesbriefing-2026-10-29.md Regeln 1–8; Skill firma-autor. Belege: design/lauf/LAUF.md, bericht.md, chat.json (Schlussantwort = bericht.md wörtlich); Vorfolge firma-tag9/script.txt; Folgelauf firma-tag11/design/lauf/LAUF.md (nur gelesen); Maßstab firma-tag8/script.txt. **Neu in dieser Runde:** Messwerte der echten Tempo-1,0-Stimme aus `public/firma-ep/tag9/words.json` (Folge 9, veröffentlicht).

## Messwerte
- `wc -w script.txt`: **100** (Grenze genau erreicht) ✓.
- Satzlängen: fest 15 / 4 / 15; frei: 3 · 5 · 6 · 9 · 1 · 5 · 7 · 7 · 6 · CTA 9 + 8. Alle frei geschriebenen ≤ 12 ✓.
- Caption: **2027 Zeichen** ohne Schluss-Zeilenumbruch (2028 mit), < 2100 ✓. Letzte Zeilen: „(Fiktives Experiment, keine echten Umsätze.)“, Leerzeile, nur Hashtags ✓.
- Emoji-Scan (Zeichen > U+2000 außer Typografie „“–…→≤≥×·✓€°): script, caption, hooks, prompt-fuer-kommentare 0 Treffer; thema.md nur „≈“ (intern) ✓.
- `grep -i "boilr|hamburg|@…\.…"` in allen 5 Prüflingen: 0 Treffer ✓. „Domain/Hosting“ nur als Verbot/Hinweis (thema.md:7,26; hooks.md:9 „kein Adressfeld mit Domain“; prompt-fuer-kommentare.md:33) ✓.
- „du/dir/dein“ und Imperativ: script.txt nur Z. 10 (CTA) ✓; caption.txt nur Z. 13 (CTA) und im zitierten Prompt Z. 7 (wie Folge 8) ✓. „anhängen“/„Fragen:“ Infinitiv/Nomen ✓.
- **Zeit, gemessen statt geschätzt (Folge 9, TTS 1,0, words.json):** Rückblick-Satz 1 „Die … Bestellung.“ = **5,34 s** (6,792–12,132), nicht 4,3 s. Folge 8 (Tempo 1,15) hatte 3,70 s → Faktor real 1,44, nicht 1,15. Folge-9-Rückblick gesamt 7,65 s, „Heute“ bei 14,50 s. Satz 2 F9 „Name: Kolonnenshirt, ungeprüft.“ 9 Silben = 2,22 s (≈ 0,245 s/Silbe), Pause zwischen Satz 1 und 2 nur 0,09 s.
  - Hochrechnung Folge 10: Satz 2 „Logo: dunkelblauer Block.“ 7 Silben ≈ 1,7 s → **Rückblick ≈ 5,34 + 0,09 + 1,7 ≈ 7,1 s (> 6,5 s)**. thema.md:58 weist „≈ 5,9–6,4 s ≤ 6,5 s ✓“ aus, auf Basis der widerlegten ×1,15-Rechnung.
  - „Heute“-Start ≈ 14,50 − 0,87 („Tag 3.“ entfällt) − 0,5 (Satz 2 kürzer) ≈ **13,1 s** ≤ 14,5 s ✓. Weg-Satz („Auftrag …“) beginnt ≈ 15,0 s.
  - Gesamt: Folge 9 mit 100 Wörtern = 46,3 s (≈ 130 wpm) → Folge 10 bei gleicher Wortzahl ≈ 45–47 s, 128–133 wpm ✓.
- Claude-Aussagen 1:1 (gesprochen ↔ LAUF.md/bericht.md Schlussantwort):

| Gesprochen | Lauf (wörtlich) | Urteil |
|---|---|---|
| „Ganz oben stellt sie: Firmenshirts für Betriebe, Preis, Bestellknopf.“ | „1. Was es ist und für wen: „Firmenshirts mit gesticktem Logo. Für Handwerks- und Baubetriebe …“ 2. Der Preis … 3. Der Bestell-Button.“ | ✓ zulässig verdichtet |
| „Das wollen Betriebe schnell wissen.“ | „Ein Betrieb, der dich prüft, will drei Fragen schnell beantwortet haben“ | ✓ |
| „Mehr passt nicht in den ersten Blick.“ | „Auf dem Handy passt nur wenig in den ersten Blick. … reicht der Platz für Satz, Preis und Button, aber nicht für eine Prozessbeschreibung.“ | ✓ |
| „Ohne Impressum und Datenschutzerklärung nicht online.“ | „Was fehlt, bevor die Seite online gehen darf“ → „Impressum“, „Datenschutzerklärung“ | ✓ (ohne „darf“, aber nicht falsch) |
| „Auftrag mit Logo: Startseite fürs Handy.“ | Prompt: „Im Anhang sind mein Logo als SVG … Bau mir eine einfache Startseite … fürs Handy gedacht.“ | inhaltlich ✓, hörbar mehrdeutig (s. R2-02) |
| Übergabe „Was muss sie anmelden?“ | Lauf 10 beantwortet nicht; Lauf 11: „Als Erstes kommt die Gewerbeanmeldung“ | ✓ |
| Caption Z. 9/11 (Gründe, Haken-Liste, „kein Anwalt“) | Schlussantwort | ✓ 1:1 |

## Ticket-Abgleich Runde 1
| Ticket | Soll erfüllt? | Beleg |
|---|---|---|
| R1-01 „ersten Blick“ + Regie-Beschnitt | **ja** | script.txt:7; thema.md:48 (Bild unter „Jetzt bestellen“ beschnitten/gedimmt, „So funktioniert's“ nicht sichtbar) |
| R1-02 „schnell“, ohne Bild verständlich, Zitat in thema.md | **ja** | script.txt:6; thema.md:23 |
| R1-03 Subjekt KI, „ganz oben“, Punkt 1 = was + für wen, ≤ 12 | **ja** | script.txt:5 (9 Wörter) |
| R1-04 Auftrag „Startseite fürs Handy“ hörbar, ohne Imperativ, Weg vor 14,5 s | **teilweise** | „Startseite fürs Handy“ ✓, kein Imperativ ✓; Weg beginnt gemessen ≈ 15,0 s; „Auftrag mit Logo“ mehrdeutig → R2-02 |
| R1-05 kein „Ihr“, Rückblick/„Heute“ inkl. Pausen ≤ 6,5 / ≤ 14,5 s ausgewiesen | **teilweise** | „Ihr“ weg ✓ (script.txt:2); Rechnung thema.md:58 nutzt widerlegte Kalibrierung, Rückblick real ≈ 7,1 s → R2-01 |
| R1-06 CTA ≥ 2 Guide-Teile, Formel, Variante ohne Logo | **ja** | script.txt:10 „Frage und Online-Checkliste … Damit hast du in wenigen Minuten …“; prompt-fuer-kommentare.md:14–18 (ehrlich als ungetestet markiert). Rest-Hinweis R2-03 |
| R1-07 „Datenschutzerklärung“ | **ja** | script.txt:8 |
| R1-08 Überschrift Platzhalter | **ja** (Rest s. R2-04) | prompt-fuer-kommentare.md:22; aber Z. 4 nennt noch „[BERUF]-Platzhalter“ |

## Bewertung
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung wörtlich, kein Tag (Folge 10 nicht erste Folge, Slot 15:00) ✓ |
| Neueinstieg/Rückblick (Produkt + Stand, ≤ 6,5 s, „Heute“ ≤ 14,5 s) | **6** | Inhalt ✓ (Satz 1 fest, „Logo: dunkelblauer Block.“ = Ergebnis Folge 9, kein „Ihr“). Dauer: gemessen an Folge 9 (words.json, Satz 1 = 5,34 s) ≈ 7,1 s > 6,5 s; thema.md:58 „5,9–6,4 s ✓“ beruht auf ×1,15-Hochrechnung, die die veröffentlichte Folge 9 (Rückblick 7,65 s) widerlegt. „Heute“ ≈ 13,1 s ✓. |
| Mehrwert: nachbaubare Schritte, Beginn ≤ 14 s | **7** | script.txt:4 „Auftrag mit Logo: Startseite fürs Handy.“ – direkt nach „verkauft Shirts mit Logo“ (Z. 2) klingt „Auftrag mit Logo“ nach Kunden-Auftrag für ein Logo-Shirt; das Anhängen der Logo-Datei an Claude (Lauf: „Im Anhang sind mein Logo als SVG“) ist nicht als Handlung hörbar. Serienmuster Folge 8/9 („Ergebnis anhängen.“) wäre eindeutig. Weg-Beginn ≈ 15,0 s; „Heute baut sie ihre Website“ ≈ 13,1 s als Schritt-Ansage ok. |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 9 | thema.md:5; hooks.md:9 echtes Handy-Bild + „ENTWURF“ ✓ |
| Hook: Satz 2 + Frame 1 erzeugen Frage, Muster belegt | 8 | hooks.md:7–10 Ergebnis zuerst (M-002, M-011), Stempel-Wort aus dem Lauf ✓; Spannung erst ab „Haken“ (hooks.md:23) |
| Entscheidung der KI klar erkennbar und 1:1 | 8 | script.txt:5 Subjekt „sie“, „ganz oben“, drei Punkte 1:1 verdichtet ✓; „stellt sie:“ leicht ungelenk, verständlich |
| Warum: 2–3 konkrete Gründe 1:1 aus dem Lauf | 8 | script.txt:6–7 beide Lauf-Wörter („schnell“, „ersten Blick“) ✓; Grund 1 ohne die drei Fragen etwas abstrakt, Karten tragen sie (thema.md:47) |
| Haken korrekt, nicht verkürzt-falsch | 8 | script.txt:8 ✓; „darf“ des Laufs fehlt, Aussage bleibt richtig; Domain/Hosting nirgends ✓ |
| Schritt-Kette ab Folge 9 + Übergabe | 9 | Eingabe = sieger.svg byte-gleich + Ergebnis 9 (LAUF.md Anhänge); beantwortet „Was muss oben auf ihre Website?“ (firma-tag9/script.txt:8); „Was muss sie anmelden?“ von Lauf 11 beantwortet („Als Erstes kommt die Gewerbeanmeldung“), Folge-11-Skript nimmt es auf ✓ |
| CTA: konkreter Wert, nur Lieferbares, Formel | 8 | script.txt:10 zwei Guide-Teile ✓, Formel ✓, „wenigen Minuten“ (Lauf 2 min 12 s) ✓; Ergebnis „deinen Entwurf“ ohne Objekt (Entwurf wovon?) → Hinweis R2-03 |
| Kommentar-Mechanik (prompt-fuer-kommentare.md) | 8 | Lieferliste Z. 3–7, Lauf-Original Z. 20, 4 Berufe Z. 22–26, Variante ohne Logo Z. 14–18 ✓; Restfehler Z. 4 „[BERUF]-Platzhalter“ (gibt es nicht), Z. 14 „gleiche Dauer“ vs. Z. 18 „nicht getestet“ → R2-04 |
| Länge/Satzregeln/Bildschirmtext | 8 | 100 Wörter ✓, Sätze ✓, Karten ≤ 4 Wörter (thema.md:47–49) ✓, Gesamtlänge laut Folge-9-Messung ≈ 45–47 s ✓. Abzug: Zeitrechnung thema.md:56–59 auf falscher Kalibrierung (Rückblick s. o.); Kopf thema.md:1 / hooks.md:1 „Slot 12:00“ statt 15:00 (briefing.md:1) → R2-05 |
| Caption | 9 | 2027 Zeichen ✓, Fiktiv-Ende + nur Hashtags ✓, keine Emojis ✓, Gründe/Haken 1:1 ✓, Du nur im CTA ✓ |
| Claude-Behauptungen belegt | 8 | alle gesprochenen Aussagen 1:1 (Tabelle oben) ✓; „+“ zum Anhängen weiterhin nur über Screenshot 01 belegt, keine Doku-Quelle (wie Runde 1) |
| Keine private Info, keine Ansprache | 10 | grep 0 Treffer; Screenshot 04 gesperrt bzw. nur beschnitten (thema.md:49) ✓ |

## K.-o.-Check
| K.-o. | Ergebnis |
|---|---|
| Zuschauer direkt angesprochen außerhalb CTA | nein ✓ |
| Ergebnis nicht aus echtem claude.ai-Lauf | nein, Lauf f92c3fa6, 2 min 12 s ✓ |
| Unbelegte Claude-Behauptung | nein ✓ (R1-01/R1-02 behoben) |
| ChatGPT statt Claude | nein ✓ |
| Versprechen nicht lieferbar | nein ✓ (Guide-Inhalt in prompt-fuer-kommentare.md:3–7 deckt „Frage und Online-Checkliste“) |
| „Niemand hat kommentiert“ | nein ✓ |
| Private boilr-Zeile / Hamburg (Chef) | nein ✓ |
| Domain/Hosting als Claude-Ergebnis | nein ✓ |
| Warum fehlt | nein ✓ |
| Sprung/Wiederholung in der Kette | nein ✓ |
| > 100 Wörter | nein, genau 100 ✓ |
| Neuer versteht bei 14 s Projekt + heutigen Schritt | ja, „Heute“ ≈ 13,1 s ✓ (knapp) |
| Rückblick ≤ 6,5 s (Chef-Entscheid, K.-o. in der finalen Prüfung) | **droht**: Prognose ≈ 7,1 s nach Messung Folge 9; auf Autor-Stufe als Note 6 gewertet, nicht als K.-o. |

## Gesamt
**Nicht bestanden.** Kein K.-o. verletzt, Mindestnote 6, Durchschnitt 8,2. Unter 8: Rückblick (6), Mehrwert (7).
Sechs von acht Tickets aus Runde 1 erfüllt; R1-04 und R1-05 nur teilweise. Kern: (1) Die Zeitrechnung für den Rückblick stützt sich auf eine Kalibrierung, die die veröffentlichte Folge 9 widerlegt (Satz 1 allein 5,34 s), damit reißt der Rückblick die 6,5 s. (2) Der Weg-Satz „Auftrag mit Logo“ ist beim ersten Hören mehrdeutig, und das Anhängen ist keine hörbare Handlung. Beide Korrekturen gehen wortneutral (Beispiele in den Tickets), die 100 Wörter bleiben.

## Tickets
```
TICKET autor-R2-01 → firma-autor (Kopie firma-chef: Regelkonflikt prüfen)
Kriterium: Neueinstieg/Rückblick · Note: 6/10
Beleg: thema.md:58 „Satz 1 … ×1,15 ≈ 4,3 s … ≈ 5,9–6,4 s ≤ 6,5 s ✓“ vs. public/firma-ep/tag9/words.json (Tempo 1,0): Satz 1 = 5,34 s, Pause 0,09 s, 0,245 s/Silbe; Folge-9-Rückblick 7,65 s
Problem: Mit der echten Tempo-1,0-Stimme dauert der Rückblick mit „Logo: dunkelblauer Block.“ (7 Silben) ≈ 7,1 s und reißt die Chef-Grenze 6,5 s; die Rechnung in thema.md nutzt die widerlegte ×1,15-Kalibrierung.
Soll: thema.md „Länge“ rechnet Rückblick, „Heute“-Start und Weg-Start mit den Messwerten aus firma-tag9 words.json (Satz 1 = 5,34 s, ≈ 0,245 s/Silbe) und weist Rückblick ≤ 6,5 s aus; dafür hat Satz 2 höchstens 4 Silben (z. B. „Das Logo steht.“, 3 Wörter, Wortzahl bleibt 100, Logo-Bild zeigt das Ergebnis) – ODER ein schriftlicher Chef-Entscheid in briefing.md/tagesbriefing erlaubt ausdrücklich einen Rückblick > 6,5 s mit dem 7-Silben-Satz.
```
```
TICKET autor-R2-02 → firma-autor
Kriterium: Mehrwert/nachbaubare Schritte · Note: 7/10
Beleg: script.txt:4 „Auftrag mit Logo: Startseite fürs Handy.“ nach script.txt:2 „verkauft Shirts mit Logo“; LAUF.md Prompt „Im Anhang sind mein Logo als SVG … Bau mir eine einfache Startseite … fürs Handy gedacht.“; Serienmuster firma-tag8/script.txt:4, firma-tag9/script.txt:4 „Ergebnis anhängen.“
Problem: „Auftrag mit Logo“ klingt im Shirt-Kontext nach einem Kundenauftrag, und dass das Logo an Claude angehängt wird, ist nicht als Handlung hörbar.
Soll: Der Weg-Satz enthält nicht das Wort „Auftrag“, nennt das Anhängen als Handlung („Logo anhängen.“) und die Bitte „Startseite fürs Handy“, ohne Imperativ/„du“, Sätze ≤ 12 Wörter, script.txt bleibt ≤ 100 Wörter (z. B. „Logo anhängen. Bitte: Startseite fürs Handy.“ = 6 Wörter wie bisher); thema.md-Faktentabelle Z. 21 entsprechend angepasst.
```
```
TICKET autor-R2-03 → firma-autor
Kriterium: CTA · Note: 8/10 (Hinweis, nicht bestehensrelevant)
Beleg: script.txt:10 „Damit hast du in wenigen Minuten deinen Entwurf.“; firma-autor SKILL Z. 25 (greifbares Ergebnis); Runde 0 „Startseiten-Entwurf“
Problem: „deinen Entwurf“ sagt nicht, wovon; das greifbare Ergebnis ist schwächer als in R0.
Soll: Ergebnis-Wort nennt das Objekt, wortneutral (z. B. „deinen Startseiten-Entwurf“ oder „deinen Website-Entwurf“); Wortzahl bleibt ≤ 100.
```
```
TICKET autor-R2-04 → firma-autor
Kriterium: Kommentar-Mechanik · Note: 8/10 (Hinweis)
Beleg: prompt-fuer-kommentare.md:4 „mit [BERUF]-Platzhaltern“ (die Vorlage hat keinen [BERUF]); Z. 14 „gleiche Dauer“ vs. Z. 18 „nicht im Lauf getestet“; Z. 22 Platzhalterliste ohne [FIRMENNAME] (Z. 16)
Problem: Restwidersprüche: nicht existierender Platzhalter, unbelegte Dauer-Aussage für die ungetestete Variante, unvollständige Platzhalterliste.
Soll: Z. 4 nennt die echten Platzhalter; „gleiche Dauer“ entfällt oder wird als Erwartung ohne Test markiert; Z. 22 führt auch [FIRMENNAME] (Variante) auf.
```
```
TICKET autor-R2-05 → firma-autor
Kriterium: Länge/Satzregeln (Dokumentation) · Note: 8/10 (Hinweis)
Beleg: thema.md:1 und hooks.md:1 „Slot 2026-10-30 12:00“ vs. briefing.md:1 „Slot 2026-10-30 15:00 (verschoben, Chef 2026-10-30)“
Problem: Kopfzeilen nennen den alten Slot; Regie/Design lesen daraus.
Soll: thema.md:1 und hooks.md:1 nennen 15:00 (weiter „nicht erste Folge“, kein Tag im Gesprochenen).
```
