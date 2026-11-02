# Prüfung Autor · Folge 4 „Druck“ · Runde 2 (frischer Prüfer, 2026-10-28)

Geprüft: `script.txt`, `caption.txt`, `thema.md`, `hooks.md`, `prompt-fuer-kommentare.md` gegen `design/lauf/LAUF.md`, `design/lauf/bericht.md`, `tagesbriefing-2026-10-29.md`, `briefing.md`, `../firma-tag3/script.txt`, `spy/muster.md`, `bewertung.md` Abschnitt „autor“ und die 6 Tickets aus `autor-runde1.md`.

**Gesamturteil: bestanden.** Alle 6 Ticket-„Soll“ sind wahr, kein K.-o. verletzt, alle Kriterien ≥ 8. Keine neuen Tickets. Unten stehen Hinweise, die nicht blockieren (für Regie, Chef und den Autor von Folge 5).

## Tickets aus Runde 1: Soll erfüllt?
| Ticket | Soll | Ergebnis | Beleg |
|---|---|---|---|
| R1-1 CTA-Versprechen | Kein „prüfst, ob … hält“. Der Wert beschreibt nur, was Frage + Tabelle liefern | ✓ „Damit hast du in zehn Minuten die passenden Verfahren mit Quellen.“ Das deckt sich mit der Lieferung (prompt-fuer-kommentare.md:3) und mit dem Lauf (5 Min 21 s, LAUF.md:12) | script.txt:10 |
| R1-2 Grund 1 | Vergleich beim selben Anbieter, kein „gängige Drucke“. Caption-Stand eingeschränkt | ✓ „Beim selben Anbieter: Stick bis fünfundneunzig Grad, Digitaldruck bis dreißig.“ = bericht.md:16 („Digital-, Polyester- und Flexdruck … bis 30 °C … Stick bis 95 °C“) und bericht.md:56. Caption nennt jetzt „laut Händlern … Pflegeangaben der Anbieter, keine Grenzen des Materials“ (= LAUF.md:20, bericht.md:12). Keine Wiederholung des Folge-3-Satzes mehr | script.txt:6, caption.txt:3 |
| R1-3 Imperativ | Kein Du/Imperativ außer im CTA | ✓ „Frage: Was hält sechzig Grad ab einem Stück?“ Die Infinitive „Research an, Ergebnis anhängen“ sind neutral wie in Folge 3. `grep` findet du/dir/dein nur in Zeile 10 (CTA) | script.txt:4, 10 |
| R1-4 Frame 1 | Nur Belegtes, kein zerfallender Druck | ✓ Waschtrommel + 60-°C-Zähler, Etiketten „Digitaldruck: 30 °C“ / „Stick: 95 °C“, ausdrücklich kein Bröckeln | hooks.md:8 |
| R1-5 Klarheit | (a) Ziel und Ergebnis passen, (b) „Stick geht“, (c) Haken mit Bezugswort, 110–135 W, Rückblick unverändert | ✓ (a) „Heute sucht sie ein Logo, das sechzig Grad aushält.“ (b) „Stick geht ab einem Stück“ (c) „Fast alle Gradzahlen sind Anbieterangaben.“ 133 W, Rückblick identisch mit Runde 1 | script.txt:2, 3, 7, 8 |
| R1-6 thema.md | Liegt vor mit Schritt, Begründung, Muster, Lauf-Verweis, Quelle je Claude-Behauptung | ✓ Schritt + Kette (thema.md:3–5), Muster M-002/004/005/007/011 (alle in muster.md vorhanden: Z. 22, 38, 46, 62, 94), Lauf + Chat-Link (thema.md:10), Research-Pläne/„+“/Websuche mit wörtlichen Zitaten aus support.claude.com (thema.md:11–12), „Upload or add files“ mit Screenshot-Beleg (thema.md:13), Faktentabelle Satz für Satz (thema.md:15–26) | thema.md |

## K.-o.-Check
| Regel | Ergebnis | Beleg |
|---|---|---|
| Eröffnung wörtlich + „Tag zwei.“ (nur Folge 4) | ✓ | script.txt:1, tagesbriefing:17 |
| Rückblick Satz 1 wörtlich (nicht „Ihre Firma“), Satz 2 = Ergebnis der Vorfolge, ≤ 6 s | ✓ (ca. 5,8 s, knapp) | script.txt:2, tagesbriefing:18 |
| „Heute …“ als Satz nach dem Rückblick, Projekt + Schritt bis 14 s | ✓ (Ende „Heute“-Satz ca. 13,9 s) | script.txt:3 |
| Schritt-Kette: Start bei „Welcher Druck hält sechzig Grad?“, genau ein Schritt, Übergabe Folge 5 | ✓ | tag3 script.txt:9 → script.txt:3, 9 → tagesbriefing:32, briefing.md:18 |
| „gestern“ nur in Folge 4 | ✓ | script.txt:2 |
| Warum sofort nach der Entscheidung, 2–3 Gründe mit Zahl | ✓ 2 Gründe (95/30 °C, 1/50 Stück) in 2 Sätzen | script.txt:6–7 |
| Keine direkte Ansprache außer CTA-Muster | ✓ | script.txt:4, 10 |
| Kein Versprechen, das wir nicht liefern | ✓ | script.txt:10, prompt-fuer-kommentare.md:3 |
| Ergebnis aus echtem claude.ai-Lauf, keine unbelegte Claude-Behauptung | ✓ | LAUF.md:2, 12; thema.md:11–13 |
| Kein ChatGPT, kein Geld erfunden, kein Umsatz-Zähler | ✓ | hooks.md:8 |
| Keine Erwähnung fehlender Kommentare | ✓ | |
| Caption: Fiktiv-Hinweis am Ende, danach nur Hashtags, keine Emojis, Superkind leise/ohne Preis | ✓ (Byte-Suche nach 4-Byte-Zeichen: keine Treffer; Superkind nicht erwähnt) | caption.txt:16–18 |
| 110–135 Wörter | ✓ 133 (`wc -w`) | |

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 8 | Feste Eröffnung trägt (script.txt:1). Produkt und Stand folgen bei ca. 6–12 s |
| Mehrwert: nachbaubar, Beginn ≤ 14 s, heute umsetzbar | 8 | Weg „Plus, Research an, Ergebnis anhängen, Frage …“ = LAUF.md:3. Start nach Schätzung ca. 14,2 s. Der „Heute“-Satz hat jetzt 13 statt 12 Silben (+ ca. 0,15 s). Wegen fester Eröffnung + Pflicht-Rückblick ist das nur über Regie-Pausen lösbar (siehe Hinweis 1) |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 9 | Logo, das die 60-Grad-Wäsche nicht übersteht, kennt jeder Betrieb. Bild: 95 °C gegen 30 °C beim selben Anbieter (thema.md:6) |
| Hook (Satz 2 + Frame 1, Muster) | 8 | Satz 2 nimmt das Ergebnis der Vorfolge mit Zahl auf (hooks.md:13). Frame 1 zeigt nur Belegtes und das Ergebnis zuerst (M-002, M-005 in muster.md:22, 46). Kleiner Abzug: „Digitaldruck: 30 °C (rot, durchgestrichen)“ (hooks.md:8). Durchgestrichen liest sich wie „Angabe falsch“, gemeint ist „reicht nicht“ (Hinweis 2) |
| Warum (2–3 konkrete Gründe mit Zahl) | 8 | Zwei Gründe, je eigener Satz, Bezüge jetzt eindeutig (script.txt:6–7). Abzug: „Siebdruck lohnt erst ab fünfzig“ stützt sich auf einen einzigen Anbieter (Siluri, bericht.md:8, 57). Das ist dieselbe Art Verallgemeinerung, die R1-2 bei Grund 1 korrigiert hat. Durch „lohnt“ (statt „geht“) und den Zusatz „laut Anbieter“ in der Caption (caption.txt:10) bleibt es vertretbar. Außerdem erfährt der Zuschauer nicht, warum ausgerechnet Siebdruck die Alternative ist (er hält 60 °C, bericht.md:38). Der Satz funktioniert trotzdem als Mengen-Grund |
| Faktentreue Skript (1:1 aus Lauf) | 9 | 246 Quellen (LAUF.md:12) ✓ · Stickerei (LAUF.md:18, bericht.md:53) ✓ · Stick 95 / Digitaldruck 30 beim selben Anbieter (bericht.md:16) ✓ · Stick ab 1 Stück (bericht.md:16 „keinen Mindestbestellwert – auch nicht beim Stick“) ✓ · Siebdruck „ab 50 Stück pro Motiv wirtschaftlich“ (bericht.md:8) ✓ · Haken (LAUF.md:36) ✓ · Folge 5 (tagesbriefing:32) ✓ |
| Klarheit Ziel → Ergebnis | 8 | „Ein Logo, das sechzig Grad aushält“ → Stickerei passt ohne Extra-Erklärung (script.txt:3, 5). Kleiner Rest: „sucht sie ein Logo“ kann man beim ersten Hören kurz als Logo-Entwurf verstehen. Der Relativsatz und der Rückblick („Shirts mit Logo“, „sechzig Grad“) lösen das sofort auf (Hinweis 3) |
| Kommentar-Mechanik (Nutzen, Datei fertig) | 9 | Versprechen = Lieferung: Frage + echtes Ergebnis + Tabelle (script.txt:10, caption.txt:12, prompt-fuer-kommentare.md:3). Prompt-Vorlage mit Platzhaltern und 4 Berufsbeispielen (Z. 7–13). Zahlen 1:1 (Z. 15–19 gegen bericht.md:8, 16, 57–58, LAUF.md:36) |
| Länge 110–135 / 40–48 s | 9 | 133 W, ca. 214 Silben, Schätzung 43–45 s |
| Schritt-Kette / Anschluss | 9 | Kein wiederholter 30-°C-Satz mehr. Start bei der offenen Frage aus Folge 3, ein Schritt, Übergabe an Folge 5 passt zur Kette |
| Caption | 8 | Menüpfad mit Quelle (caption.txt:6–7, thema.md:11–13), alle Zahlen 1:1 (246 / 5 Min 21 s / acht Verfahren, 95 vs. 30 „Flex- und Digitaldruck“, „laut Anbieter ab 50“, 4,85 € / 5,85 € netto bei einem Anbieter = bericht.md:58), Muster vor dem 60-Grad-Versprechen (bericht.md:70). Kleinigkeiten: „Fast alle Temperaturangaben stammen von den Anbietern selbst“ (caption.txt:10). Der Lauf sagt „von Anbietern oder Händlern“ (LAUF.md:36). „So machst du das …“ ist Du-Form wie in Folge 3 (dort akzeptiert) |
| Pflicht-Ausgaben vollständig | 9 | Alle 5 Dateien liegen vor. thema.md mit Quellen, Faktentabelle, Grund-Karten, TTS-Liste und Selbstprüfung |

## Tickets
Keine. Alle Kriterien ≥ 8, kein K.-o.

## Hinweise (nicht blockierend)
1. **Regie, Timing:** „Plus, Research an“ beginnt nach Schätzung bei ca. 14,2 s. Ziel ≤ 14 s nur mit kurzen Pausen: nach „führt?“ und vor „Tag zwei.“ jeweils ≤ 0,3 s, zwischen Rückblick und „Heute“ ≤ 0,25 s. Nach der TTS messen. Liegt der Start über 14,3 s, hat der Autor eine Kürzung ohne Sinnverlust: „Heute sucht sie ein Logo für sechzig Grad.“ (−2 Silben).
2. **Regie/Design, Frame 1:** Das Etikett „Digitaldruck: 30 °C“ rot mit ✗ oder „zu wenig“ zeigen, nicht durchgestrichen. Durchgestrichen hieße „die Angabe stimmt nicht“, dabei ist sie die echte Freigabe des Anbieters.
3. **TTS:** „Stick“ muss deutsch klingen („Schtick“, steht schon in thema.md:49). Kommt es englisch („stick“) heraus, kippt Grund 1 und 2 ins Unverständliche.
4. **Autor Folge 5 / Chef:** Der vorgeschlagene Stand-Satz für Folge 5 „Als Veredelung hat sie Stickerei gewählt, die hält fünfundneunzig Grad.“ (thema.md:38) behauptet mehr als der Lauf. Belegt ist „freigegeben bis 95 °C (Anbieter- und Herstellerangabe)“, nicht „hält“, und Claude rät ausdrücklich zum Waschtest (bericht.md:70). Besser z. B. „Als Veredelung hat sie Stickerei gewählt, freigegeben bis fünfundneunzig Grad.“
5. **Trigger-Wort:** „Druck“ passt zum Folgentitel, aber das Ergebnis ist „gar kein Druck“. Funktioniert, weil das Wort im CTA klar steht. Nur ändern, wenn der Funnel noch nicht angelegt ist (Alternative „Stick“).
