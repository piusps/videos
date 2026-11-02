# Prüfung autor · Folge 10 „Website“ · Runde 3 (letzte erlaubte)

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-30. Auftrag: Fehler finden. Nichts an den Autor-Dateien geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md (Diff gegen pruefung/script-r1.txt, Tickets aus autor-runde2.md).
Maßstab: bewertung.md „autor“; briefing.md inkl. **Chef-Entscheide 2026-10-30** (Slot 15:00, nicht erste Folge; R2-01 durch Messung entschieden); firma-tag9/tagesbriefing-2026-10-30.md inkl. Chef-Entscheide (100 Wörter hart, Sätze ≤ 12, Rückblick ≤ 6,5 s, „Heute“ ≤ 14,5 s); firma-tag4/tagesbriefing-2026-10-29.md Regeln 1–8; Skill firma-autor. Belege: design/lauf/LAUF.md, chat.json (Volltextsuche), firma-tag9/script.txt, firma-tag11/design/lauf/LAUF.md (nur gelesen), **runs/firma-tag10/words.json** (echte Stimme Folge 10, Tempo 1,0).

## Messwerte
- `wc -w script.txt`: **100** ✓ (Grenze genau erreicht, unverändert zu R2).
- Diff zu script-r1.txt: nur Z. 4 („Auftrag mit Logo: Startseite fürs Handy.“ → „Logo anhängen. Bitte: Startseite fürs Handy.“, 6 → 6 Wörter) und Z. 10 („deinen Entwurf.“ → „deinen Startseiten-Entwurf.“, 8 → 8 Wörter) ✓. Rückblick und „Heute“-Satz unverändert ✓.
- Satzlängen: fest 15 / 4 / 15; frei 3 · 5 · 2 · 4 · 9 · 1 · 5 · 7 · 7 · 6; CTA 9 + 8. Alle frei geschriebenen ≤ 12 ✓.
- **words.json (selbst nachgemessen):** „Die“ s = 6,807 s, „Block.“ e = 13,242 s → **Rückblick 6,435 s ≤ 6,5 s ✓** (Reserve 0,065 s). „Heute“ s = **13,835 s ≤ 14,5 s ✓**. Letztes Wort „Entwurf.“ e = 45,156 s → 100 Wörter / 45,16 s = **132,9 wpm** ✓ (Korridor 120–135, 40–48 s). Die Werte im Chef-Entscheid (briefing.md) und in thema.md:57–59 stimmen mit der Datei überein ✓.
  - Hinweis: words.json ist noch die alte Aufnahme (enthält „Auftrag mit Logo:“ i = 42–44 und „deinen Entwurf.“). Neue Z. 4 und CTA sind gleich viele Wörter; „Startseiten-Entwurf“ hat +3 Silben (≈ +0,7 s), „Logo anhängen. Bitte:“ eine Satzgrenze mehr. Prognose gesamt ≈ 45,5–46,5 s, ≈ 129–132 wpm ✓. Rückblick/„Heute“ sind von der Neuaufnahme nicht betroffen.
- Caption: **2027 Zeichen** ohne, 2028 mit Schluss-Zeilenumbruch, < 2100 ✓. Ende: „(Fiktives Experiment, keine echten Umsätze.)“, Leerzeile, nur Hashtags ✓.
- Emoji-Scan (Zeichen > U+2000 außer Typografie „“–…→≤≥×·✓€°): script, caption, hooks, prompt-fuer-kommentare 0 Treffer; thema.md nur „≈“, „↔“ (intern) ✓.
- `grep -iE "boilr|hamburg|<mail>"` in allen 5 Prüflingen: **0 Treffer** ✓. „Domain/Hosting“ nur als Verbot/Hinweis (thema.md:7,26; hooks.md:9; prompt-fuer-kommentare.md:33) ✓.
- „du/dir/dein“ und Imperativ: script.txt nur Z. 10 (CTA) ✓; „Logo anhängen.“ Infinitiv, „Bitte:“ Nomen/Partikel mit Doppelpunkt (Serienmuster „Frage:“ Folge 8, „Ergebnis anhängen.“ Folge 9) ✓. caption.txt nur Z. 13 (CTA) und im zitierten Prompt Z. 7 (wie Folgen 8/9) ✓.
- Claude-Aussagen 1:1 (gesprochen ↔ LAUF.md, Volltext in chat.json gefunden: „schnell beantwortet“, „in den ersten Blick“, „online gehen darf“, „Datenschutzerklärung“, „Bestell-Button“, „fürs Handy gedacht“ jeweils True):

| Gesprochen | Lauf (wörtlich) | Urteil |
|---|---|---|
| „Logo anhängen. Bitte: Startseite fürs Handy.“ | LAUF.md:13 „Im Anhang sind mein Logo als SVG … Bau mir eine einfache Startseite … fürs Handy gedacht.“ | ✓ Handlung + Bitte, eindeutig |
| „Ganz oben stellt sie: Firmenshirts für Betriebe, Preis, Bestellknopf.“ | LAUF.md:20/25–29 „Was es ist und für wen … der Preis … Der Bestell-Button.“ | ✓ verdichtet |
| „Das wollen Betriebe schnell wissen.“ | LAUF.md:32 „will drei Fragen schnell beantwortet haben“ | ✓ |
| „Mehr passt nicht in den ersten Blick.“ | LAUF.md:33 „Auf dem Handy passt nur wenig in den ersten Blick.“ | ✓ |
| „Ohne Impressum und Datenschutzerklärung nicht online.“ | LAUF.md:41–45 „Was fehlt, bevor die Seite online gehen darf“ → Impressum, Datenschutzerklärung | ✓ |
| „Als Nächstes: Was muss sie anmelden?“ | Lauf 10 beantwortet nicht; firma-tag11 LAUF.md:21/26 „Als Erstes kommt die Gewerbeanmeldung“ | ✓ (Ortsname aus Lauf 11 nirgends übernommen) |
| CTA „in wenigen Minuten … Startseiten-Entwurf“ | LAUF.md:16 Dauer 2 min 12 s; LAUF.md:23 „Handy-Entwurf“ | ✓ |
| Caption Z. 9/11 (drei Gründe, Haken-Liste, „kein Anwalt“) | LAUF.md:32–33, 67–68 | ✓ 1:1 |

## Ticket-Abgleich Runde 2
| Ticket | Soll erfüllt? | Beleg |
|---|---|---|
| R2-01 Rückblick ≤ 6,5 s gemessen oder Chef-Entscheid | **ja** | briefing.md „Chef-Entscheide 2026-10-30“ (Satz 2 bleibt); words.json selbst nachgemessen 6,435 s / „Heute“ 13,835 s; thema.md:54–60 rechnet mit Messwerten, ×1,15-Schätzung gestrichen |
| R2-02 Weg-Satz ohne „Auftrag“, Anhängen als Handlung, „Startseite fürs Handy“, kein Imperativ, ≤ 100 Wörter, thema.md Z. 21 angepasst | **ja** | script.txt:4; thema.md:21 |
| R2-03 CTA-Ergebnis mit Objekt, wortneutral | **ja** | script.txt:10 „deinen Startseiten-Entwurf“; caption.txt:13 und prompt-fuer-kommentare.md:3 gleichlautend |
| R2-04 echte Platzhalter, „gleiche Dauer“ weg, Liste mit [FIRMENNAME] | **ja** | prompt-fuer-kommentare.md:4 (echte Platzhalter + [FIRMENNAME] für Variante), :14 „nicht getestet, Dauer unbekannt“, :22 |
| R2-05 Slot 15:00 in thema.md/hooks.md | **ja** | thema.md:1, hooks.md:1 |

## Bewertung
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung wörtlich, kein Tag (nicht erste Folge) ✓ |
| Neueinstieg/Rückblick (Produkt + Stand, ≤ 6,5 s, „Heute“ ≤ 14,5 s) | 9 | Produkt (Satz 1 fest) + Stand Folge 9 („Logo: dunkelblauer Block.“, 7 Silben ≤ 11); gemessen 6,435 s / 13,835 s ✓. Reserve nur 0,065 s: Regie darf hier nichts verlängern (steht in briefing.md und thema.md:57) |
| Mehrwert: nachbaubare Schritte, Beginn ≤ 14 s | 8 | script.txt:4 jetzt eindeutig (Anhängen + Bitte), Serienmuster ✓; Schritt-Ansage „Heute baut sie ihre Website“ bei 13,84 s, eigentlicher Weg-Satz erst ≈ 16,0 s (wie in R2 akzeptiert); Menüpfad mit „+“ nur in Caption |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 9 | thema.md:5; hooks.md:9 echtes Handy-Bild + Stempel „ENTWURF“ |
| Hook: Satz 2 + Frame 1 erzeugen Frage, Muster belegt | 8 | hooks.md:7–10 Ergebnis zuerst (M-002, M-011); Frage „warum nicht online?“ erst ab „Haken“ (hooks.md:23) |
| Entscheidung der KI klar und 1:1 | 8 | script.txt:5 drei Punkte 1:1 verdichtet; „stellt sie:“ etwas ungelenk |
| Warum: 2–3 konkrete Gründe 1:1 | 8 | script.txt:6–7, Lauf-Wörter „schnell“, „ersten Blick“; Grund 3 nur Caption/Guide (zulässig, 2 gesprochen) |
| Haken korrekt | 8 | script.txt:8 ✓; „darf“ fehlt, Aussage bleibt richtig; Domain/Hosting nirgends behauptet ✓ |
| Schritt-Kette ab Folge 9 + Übergabe | 9 | beantwortet firma-tag9/script.txt:8 „Was muss oben auf ihre Website?“; Eingabe = Logo-SVG + Ergebnis 9 (LAUF.md:13); Übergabe „Was muss sie anmelden?“ von Lauf 11 beantwortet |
| CTA: konkreter Wert, nur Lieferbares, Formel | 9 | script.txt:10 zwei Guide-Teile + „Damit hast du in wenigen Minuten deinen Startseiten-Entwurf“ (2 min 12 s belegt) ✓ |
| Kommentar-Mechanik | 9 | prompt-fuer-kommentare.md vollständig, Platzhalter konsistent, Variante ehrlich als ungetestet, 4 Berufe, Lauf-Original |
| Länge/Satzregeln/Bildschirmtext | 8 | 100 Wörter (hart, auf der Grenze), Sätze ≤ 12 ✓, Karten ≤ 4 Wörter (thema.md:47–49) ✓, 45,16 s / 132,9 wpm gemessen (alte Aufnahme), Prognose neue Aufnahme ≈ 46 s ✓; thema.md:59 nennt die Gesamtzeit der alten Aufnahme ohne diesen Vermerk |
| Caption | 9 | 2027 Zeichen, Fiktiv-Ende + nur Hashtags, keine Emojis, Menüpfad mit „+“, Du nur im CTA ✓ |
| Claude-Behauptungen belegt | 8 | alle gesprochenen Aussagen 1:1 (Tabelle); „+“ zum Anhängen nur über Screenshot 01 belegt (wie R1/R2) |
| Keine private Info, keine Ansprache | 10 | grep 0 Treffer; Screenshot 04 nur beschnitten/gar nicht (thema.md:49) |

## K.-o.-Check
| K.-o. | Ergebnis |
|---|---|
| Zuschauer direkt angesprochen außerhalb CTA | nein ✓ |
| Ergebnis nicht aus echtem claude.ai-Lauf | nein, Lauf f92c3fa6, 2 min 12 s ✓ |
| Unbelegte Claude-Behauptung | nein ✓ |
| ChatGPT statt Claude | nein ✓ |
| Versprechen nicht lieferbar | nein ✓ (prompt-fuer-kommentare.md:3–7 deckt „Frage und Online-Checkliste“ + Entwurf) |
| „Niemand hat kommentiert“ | nein ✓ |
| Private boilr-Zeile / Hamburg / Mailadresse | nein ✓ |
| Domain/Hosting als Claude-Ergebnis | nein ✓ |
| Warum fehlt | nein ✓ |
| Sprung/Wiederholung in der Kette | nein ✓ |
| > 100 Wörter | nein, genau 100 ✓ |
| Neuer versteht bei 14 s Projekt + heutigen Schritt | ja, „Heute“ 13,835 s gemessen ✓ |
| Rückblick ≤ 6,5 s | ja, 6,435 s gemessen ✓ |

## Gesamt
**Bestanden.** Alle 15 Kriterien ≥ 8, kein K.-o. Mindestnote 8, Durchschnitt 8,6 (129/15).
Alle fünf Tickets aus Runde 2 erfüllt. R2-01 ist durch Chef-Entscheid und die selbst nachgeprüfte Messung der echten Stimme erledigt (6,435 s / 13,835 s).

## Hinweise (keine Tickets, nicht autor-zuständig oder nicht bestehensrelevant)
- **firma-regie:** Nach der Neuaufnahme von Z. 4 und CTA words.json neu schreiben und prüfen: Rückblick weiter ≤ 6,5 s (Reserve nur 0,065 s, Pausen nicht verlängern), „Heute“ ≤ 14,5 s, gesamt 40–48 s, 120–135 wpm. Betonungstest für „Bitte:“ (als Nomen mit Pause, darf nicht wie eine höfliche Bitte an den Zuschauer klingen) und „Startseiten-Entwurf“.
- **firma-chef:** briefing.md „Nächste Folge: Folge 11 (15:00)“ kollidiert mit dem neuen Slot von Folge 10 (15:00); Tagesbriefing-Tabelle nennt noch 12:00 für Folge 10. Slot von Folge 11 klären.
- **firma-autor (optional):** thema.md:59 „Stimme gesamt: 45,16 s“ als „alte Aufnahme“ kennzeichnen und nach der Neuaufnahme aktualisieren.
