# Prüfung autor · Folge 12 „Betriebe“ · Runde 2

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-30. Auftrag: Fehler finden, nur mit prüfbarem Soll. An den Autor-Dateien nichts geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md (Stand Autor R3 = Chef-Harmonie).
Maßstab: bewertung.md „autor“; firma-tag9/tagesbriefing-2026-10-30.md inkl. Chef-Entscheide; briefing.md (Slot 21:00, nicht erste Folge); firma-autor SKILL (CTA-Formel, Übergabe-Regel, Neueinstieg).
Belege: design/lauf/LAUF.md, bericht.md, liste-text.txt; firma-tag11/script.txt; firma-tag13/design/lauf/LAUF.md; Fehlerbilder firma-tag10 (R1/R2), firma-tag11 (R1).

## Messwerte
- script.txt: **100 Wörter** (`wc -w`), Grenze erreicht.
- Sätze: fest 15/4/15; frei 1–12 (längster: Damit-Satz 12) ✓.
- Greps (script/caption/hooks/prompt): „hamburg“ 0 ✓ · „tag drei“ 0 ✓ · Emojis 0 ✓ · „vier“ script/caption 0 ✓ (hooks/prompt nur als Verbotshinweis) · „cosuno“ 0 ✓.
- Namensteile Spalte „Firma“ aus liste-text.txt (32 Tokens, u. a. Knauth, Tillmann, Demeter, Fabrice, Müller, Metzler, JuniusBau, Pflugbeil, Seidel, Witt, Liebscher), Wortgrenzen-Regex: 0 Treffer außer „Chemnitz“ (Ortsteil eines Firmennamens, Chef-Entscheid: darf genannt werden) ✓.
- caption.txt: **2090 Zeichen** (Python `len`) < 2100 ✓ (10 Zeichen Reserve). Endet „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags ✓.
- „du“/Imperativ im Skript nur in den CTA-Zeilen 10–11 ✓.
- `[BERUF]` 0 ✓, Variante ohne Anhang vorhanden ✓, „Bis dahin“ 0 ✓, „Wunschkunden“ 0 ✓.
- Rückblick: Satz 1 gemessen 4,73 s (firma-tag10/regie/words.json) + Pause ≤ 0,2 s (jetzt Regie-Pflicht, thema.md:53) + „Anmelden muss ein Mensch.“ (6 Silben ≈ 1,25–1,4 s) ≈ **6,2–6,35 s ≤ 6,5 s** ✓; „Heute“ ≈ 13,6–13,8 s ≤ 14,5 s ✓.

## Tickets Runde 1 → Erledigung
| Ticket | Erledigt? | Beleg |
|---|---|---|
| R1-01 Warum (Grund 2 nur Rang 1) | **ja** | script.txt:7 „Einer stellt ein, braucht also Kleidung.“ bindet den Grund hörbar an einen Betrieb; Grund 1 gilt für die Auswahl (liste-text.txt „Top 5“ + „Warum diese fünf“). |
| R1-02 CTA Formel + Lieferbarkeit | **ja** | script.txt:10–11 SKILL-Formel vollständig, „mögliche Firmenkunden“ = was die Frage liefert; caption.txt:14 und prompt:3/:7 wortgleich. |
| R1-03 Testregion | **ja** | „in Chemnitz“ im Ton (script.txt:3), Frame-1-Beschriftung „TESTREGION CHEMNITZ“ Pflicht (hooks.md:10), Region-Karte „50 STATT 38“ + Quelle Pflicht (thema.md:35). |
| R1-04 Weg hörbar (Claude + Handlung, Fremder sagt „bekommt letztes Ergebnis, sucht im Web, macht Excel-Liste“) | **teilweise** | Claude + Verb ✓ (script.txt:4). Websuche nur indirekt über „Heute sucht sie“, Excel gar nicht im Ton; der R1-04-Prüftest ist beim Hören nicht erfüllt. thema.md:81 räumt das selbst ein. → R2-01 |
| R1-05 Rückblick-Zeit + „anmelden“ | **ja** | „anmelden“ hörbar; Rechnung mit 4,73 s; Pause ≤ 0,2 s als Regie-Pflicht (thema.md:53). Rest-Unschärfe s. Bewertung. Rechnungstext in thema.md:65–69 teils veraltet → R2-03 |
| R1-06 Caption-Frage | **ja** | caption.txt:7 „Ich verkaufe [Produkt] an [Zielgruppe].“ + „unabhängig von meinem Standort“; caption.txt:10 „ein Maler sucht laut Anzeige einen Maler“. |
| R1-07 „Bis dahin“ | **ja** | prompt-fuer-kommentare.md:13 „Ich will wissen, wen ich zuerst anspreche.“ |
| R1-08 Liste in Frame 1 nur Bild-Objekt | **ja** | hooks.md:11. |

## Faktenabgleich (nur Änderungen gegenüber Runde 1)
| Gesprochen | Lauf | Urteil |
|---|---|---|
| „Anmelden muss ein Mensch.“ | Prompt Lauf 12 „…Gewerbeanmeldung, und die kann nur ein Mensch machen.“ (LAUF.md:13); F11 „Haken: Das kann nur ein Mensch.“ | ✓ inhaltlich; Objekt nur implizit (die Firma aus Satz 1) |
| „Heute sucht sie zwanzig Betriebe in Chemnitz.“ | „Testregion: Chemnitz mit nahem Umland“ (LAUF.md:30), 20 Zeilen (:68) | ✓ |
| „Claude bekommt das letzte Ergebnis.“ | Anhang „Shirt-Firma Ergebnis Gewerbe.md“ (LAUF.md:8) | ✓ belegt; Websuche (26) und .xlsx (LAUF.md:17, :21) nicht im Ton |
| „Einer stellt ein, braucht also Kleidung.“ | Rang 1: „Sucht laut Anzeige einen Maler … Wer einstellt, braucht Kleidung für neue Leute.“ | ✓ |
| „Haken: Größe meist nur laut Verzeichnis.“ | 17/20 „Branchenverzeichnis“, Formel 3 | ✓ sachlich; **„Größe“ ohne „Team-“** direkt nach „Shirt … Kleidung“ (s. Haken) |
| „Als Nächstes: Was schreibt sie?“ | Lauf 12 schreibt nichts, bietet nur an (LAUF.md:54); Lauf 13: „Meine Entscheidung: der Brief.“ + Kolonnenshirt_Werbebrief.docx | ✓ offen in 12, beantwortet in 13 |

## Bewertung
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung ohne „Tag drei.“ ✓ |
| Neueinstieg/Rückblick (≤ 6,5 s, „Heute“ ≤ 14,5 s) | 8 | Ergebnis F11 ✓, Zeit ✓ (s. Messwerte). „Anmelden muss ein Mensch.“ direkt nach „Die Firma der KI verkauft …“ wird als „die Firma anmelden“ gehört; Restrisiko: „anmelden“ = „einloggen“ ist möglich, aber nicht falsch (auch Login ist in der Serie Menschensache). Kein Ticket. |
| Mehrwert: nachbaubare Schritte mit Claude, Beginn ≤ 14 s | **7** | script.txt:4 „Claude bekommt das letzte Ergebnis.“ Fremder hört: Claude bekommt etwas. „Bekommt das letzte Ergebnis“ kann auch als „erhält am Ende das Ergebnis“ verstanden werden. Websuche nur über „sucht“ (sucht wer, womit?), Excel nur im Bild. Bild trägt den Weg (Screenshot 01/07/06), aber thema.md:55 plant die drei Screenshots „im Takt der drei Verben“ eines Satzes, den es nicht mehr gibt; bei 5 Wörtern (≈ 1,6–1,9 s) sind drei Bilder à ≥ 1,2 s nicht unterzubringen. R1-04-Prüftest nicht erfüllt. Rückfall hinter F11 („Letztes Ergebnis angehängt, Websuche: …“). |
| Thema (Schmerz, Ergebnisbild, zwanzig Betriebe, Testregion, Excel-Liste) | 9 | zwanzig + Chemnitz im Ton ✓, Frame-1-Beschriftung ✓, Region-Warum Pflicht ✓. Excel-Liste nur Bild (s. Mehrwert). |
| Hook (Satz 2 + Frame 1) | 8 | hooks.md:9–11 ✓; Text-Hook 9 + Stempel 2 + Beschriftung 2 = 13 Wörter, an der ~12-Grenze. hooks.md:26 „Haken … beantwortet die Übergabe aus Folge 11“ ist sachlich falsch (die Entscheidung „Fünf würde sie zuerst ansprechen“ beantwortet sie) → R2-03 |
| Entscheidung der KI klar und 1:1 | 8 | script.txt:5 Konjunktiv wie Lauf ✓. „sie“ direkt nach dem einzigen „Claude“-Satz; trägt, weil „sie“ seit Z. 3 die KI ist. |
| Warum: 2–3 Gründe 1:1, verständlich | 8 | script.txt:6–7 ✓ (R1-01 erledigt). |
| Haken korrekt, nicht verkürzt-falsch | **7** | script.txt:8 „Haken: Größe meist nur laut Verzeichnis.“ folgt direkt auf „Das Shirt …“ / „braucht also Kleidung.“ Im Shirt-Kontext hört ein Fremder „Größe“ als **Kleidergröße**; dass die Teamgröße (Auswahlkriterium „unter zehn Leute“, nirgends gesprochen) gemeint ist, sagt nur das Haken-Bild. thema.md R1 und Caption (caption.txt:12 „Teamgröße“) hatten das Wort, R3 hat es verloren. |
| Schritt-Kette + Übergabe | 8 | Eingabe = Ergebnis F11 ✓; „Heute …“ + Entscheidung beantworten F11 „Wen spricht sie zuerst an?“ (firma-tag11/script.txt:8) ✓; „Was schreibt sie?“ hängt hörbar an „ansprechen“ (den fünf) und wird von Lauf 13 beantwortet (Brief + .docx) ✓. Objekt „den fünf“ nur in Caption; ausreichend. |
| CTA: konkreter Wert, nur Lieferbares, Formel | 9 | Formel ✓, Lieferteile = prompt:3–7 ✓, „zehn Minuten“ (Lauf 5 min 20 s + Einfügen) ✓, B2C-Grenze im Guide ✓. |
| Kommentar-Mechanik | 9 | Varianten A/B, Platzhalter mit Beispielen, kein [BERUF], kein „Bis dahin“, Abnahmekriterien ✓. |
| Länge/Satzregeln/Bildschirmtext | **7** | Wörter/Sätze ✓. Aber thema.md ist als Regie-Vorlage widersprüchlich: :55 Weg-Beat auf alten 3-Verben-Satz, :65 „Weg-Satz 10“, :67–68 Rechnung mit „Anmelden kann nur ein Mensch.“ (7 Silben), :76 Selbstprüfung „Weg gehört: … sucht im Web, macht eine Excel-Liste“ (stimmt nicht), :85 „Caption 2093“ vs. :70 „2090“ (gemessen 2090). Regie übernimmt sonst einen Beat-Takt, der die ≥ 1,2-s-Regel bricht. |
| Caption | 9 | 2090 ✓, Ende ✓, R1-06 ✓, Haken mit „Teamgröße“ und 17/3 ✓, UWG + „Keine Rechtsberatung.“ ✓. |
| Claude-Behauptungen belegt | 9 | alle gesprochenen Aussagen mit LAUF.md/liste-text.txt belegt ✓. |
| Keine private Info, keine Ansprache | 9 | Hamburg 0, Namen 0, *-anonym.png Pflicht ✓. |

## K.-o.-Check
| K.-o. | Ergebnis |
|---|---|
| > 100 Wörter | nein, 100 ✓ |
| Satz > 12 Wörter (außer fest) | nein ✓ |
| „Tag drei“ im Gesprochenen | nein ✓ |
| Hamburg in script/caption/hooks/prompt | nein ✓ |
| Betriebs-/Personennamen | nein ✓ |
| Emojis | nein ✓ |
| Caption ≥ 2100 / falsches Ende | nein ✓ |
| Imperativ/„du“ außerhalb CTA | nein ✓ |
| Unbelegte Claude-Behauptung | nein ✓ |
| Versprechen nicht lieferbar | nein ✓ |
| Rückblick > 6,5 s | nein (≈ 6,2–6,35 s bei Pause ≤ 0,2 s) ✓ |

## Gesamt
**Nicht bestanden.** Kein K.-o. verletzt. Drei Kriterien bei 7 (Mehrwert, Haken, Länge/Bildschirmtext-Konsistenz). Alle drei sind ohne Mehrwörter lösbar, die Fassung unten hat 100 Wörter (`wc -w` = 100) und behält Haken, „zwanzig“, „Chemnitz“ und die volle CTA-Formel.

Bewertung des Chef-Tauschs: Haken + „zwanzig … in Chemnitz“ im Ton sind richtig. „Claude bekommt das letzte Ergebnis.“ macht den Weg für einen Fremden aber nicht nachbaubar: Websuche ist nur über „sucht“ erahnbar, Excel nur im Bild, und der geplante Bild-Takt passt nicht mehr auf den Satz. Den Weg braucht es nicht länger, sondern dichter: ein Partizip-Satz wie in F11 bringt Anhang, Websuche und Excel in 6 Wörtern unter. Das eine Wort mehr kommt aus „also“ in Grund 2.

```
TICKET autor-R2-01 → firma-autor
Kriterium: Mehrwert · Note: 7/10
Beleg: script.txt:4 „Claude bekommt das letzte Ergebnis.“; thema.md:81 (eigenes Risiko); R1-04-Soll; LAUF.md:8, :17, :21; firma-tag11/script.txt:4
Problem: Der Weg nennt nur den Anhang; Websuche und Excel-Liste hört ein Fremder nicht, „bekommt das letzte Ergebnis“ ist mehrdeutig.
Soll: script.txt:4 = „Claude: letztes Ergebnis angehängt, Websuche, Excel-Liste.“ (6 Wörter, +1) und script.txt:7 = „Einer stellt ein, braucht Kleidung.“ (5 Wörter, −1; Grund bleibt 1:1 zu „Wer einstellt, braucht Kleidung“). script.txt danach `wc -w` = 100 (geprüft mit /tmp/t12-soll.txt). Kein Imperativ/„du“, Satz ≤ 12. Faktentabelle thema.md:27 mit LAUF.md:8 (Anhang), :17 (26 Websuchen), :21 (.xlsx) belegt. Alternative bei Einwand gegen das Streichen von „also“: „Claude: Ergebnis angehängt, Websuche, Excel-Liste.“ (5 Wörter, ±0), dann bleibt Z. 7 unverändert.
```
```
TICKET autor-R2-02 → firma-autor
Kriterium: Haken · Note: 7/10
Beleg: script.txt:7–8 („braucht also Kleidung.“ → „Haken: Größe meist nur laut Verzeichnis.“); caption.txt:12 „Teamgröße“; liste-text.txt Spalte „Art der Größenquelle“
Problem: Im Shirt-/Kleidungs-Kontext wird „Größe“ als Kleidergröße gehört; gemeint ist die Teamgröße der Betriebe.
Soll: script.txt:8 = „Haken: Teamgröße meist nur laut Verzeichnis.“ (6 Wörter, ±0; Gesamt bleibt 100). thema.md:30 Faktentabelle und TTS-Risikoliste („Teamgröße“) angepasst.
```
```
TICKET autor-R2-03 → firma-autor
Kriterium: Länge/Satzregeln/Bildschirmtext (Konsistenz der Regie-Vorlage) · Note: 7/10
Beleg: thema.md:45, :46, :55, :65, :67–68, :76, :85; hooks.md:26
Problem: thema.md und hooks.md beschreiben noch den R2-Weg-Satz und R2-Rückblick und eine falsche Übergabe-Zuordnung; Regie würde drei Screenshots im Takt eines nicht mehr vorhandenen Drei-Verben-Satzes planen.
Soll: (1) thema.md:55 Weg-Beat auf den Satz aus R2-01: Screenshot 01 auf „letztes Ergebnis angehängt“, 07 auf „Websuche“, 06 (XLSX) auf „Excel-Liste“; Regie-Hinweis, dass jedes Bild ≥ 1,2 s steht (bei Bedarf Pause nach dem Satz bzw. 06 bis in „Fünf würde …“ stehen lassen). (2) thema.md:65 Weg-Satz-Länge, :67–68 Rechnung mit „Anmelden muss ein Mensch.“ (6 Silben), :76 Selbstprüfung mit dem tatsächlich gesprochenen Satz, :85 Caption-Zahl = gemessene `len` (aktuell 2090). (3) Tabelle :45/:46 zeigt die gültige R3-Lösung. (4) hooks.md:26: Die Übergabe aus Folge 11 beantwortet „Fünf würde sie zuerst ansprechen.“, nicht der Haken. Prüfbar: `grep -n "sucht online, baut\|Anmelden kann nur\|2093" thema.md` = 0.
```

Hinweis (kein Ticket): „Anmelden muss ein Mensch.“ ist ausreichend klar. Wenn später Wörter frei werden, ist „Gewerbe anmelden muss ein Mensch.“ eindeutiger, kostet aber 3 Silben (Rückblick ≈ 6,8 s), deshalb jetzt nicht.
