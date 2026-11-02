# Prüfung autor · Folge 12 „Betriebe“ · Runde 3 (letzte)

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-30. Auftrag: Fehler finden, nur mit prüfbarem Soll. An den Autor-Dateien nichts geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md (Stand Autor R4).
Maßstab: bewertung.md „autor“; firma-tag9/tagesbriefing-2026-10-30.md inkl. Chef-Entscheide; briefing.md (Slot 18:00, nicht erste Folge); firma-autor SKILL.
Belege: design/lauf/LAUF.md, bericht.md, liste-text.txt; firma-tag11/script.txt (aktueller Stand); firma-tag13/design/lauf/LAUF.md.

## Messwerte
- script.txt: **100 Wörter** (`wc -w`) ✓, Grenze erreicht.
- Sätze: fest 15/4/15; frei 1–12 (längster: Damit-Satz 12) ✓. Weg-Satz 6, Grund 2 = 5, Haken 6.
- Greps (script/caption/hooks/prompt): „hamburg“ 0 ✓ · „tag drei“ 0 ✓ · Emojis (> U+2600) 0 ✓.
- Namensteile Spalte „Firma“ aus liste-text.txt (29 Tokens nach Abzug von Gattungswörtern/„Chemnitz“, u. a. Knauth, Tillmann, Demeter, Fabrice, Müller, Metzler, JuniusBau, Pflugbeil, Seidel, Witt, Liebscher, Winkler, Grätsch, Barthel, Andreas, Jens, Dirk, Daniel, Heil, PFALZ), Wortgrenzen-Regex: 0 Treffer in allen vier Dateien ✓. „Chemnitz“ per Chef-Entscheid erlaubt.
- caption.txt: **2090 Zeichen** (Python `len`) < 2100 ✓. Endet „(Fiktives Experiment, keine echten Umsätze.)“ + eine Zeile nur Hashtags ✓.
- „du“/Imperativ im Skript nur in den CTA-Zeilen 10–11 ✓. `[BERUF]` 0 ✓, Variante B ohne Anhang ✓.
- Rückblick unverändert gegenüber R2 (Satz 1 gemessen 4,73 s + Pause ≤ 0,2 s Regie-Pflicht thema.md:54 + „Anmelden muss ein Mensch.“ ≈ 1,25–1,4 s) ≈ **6,15–6,33 s ≤ 6,5 s** ✓; „Heute“ ≈ 13,6–13,8 s ≤ 14,5 s ✓ (die R4-Änderungen liegen alle nach „Heute“).

## Anschluss an Folge 11 (aktueller Stand firma-tag11/script.txt)
- F11 Ergebnis: „Als Erstes: das Gewerbe. … Haken: Das kann nur ein Mensch.“ → F12 Rückblick-Satz 2 „Anmelden muss ein Mensch.“ ✓ (Ergebnis, nicht als erledigt erzählt; Chef-Regel „neutral“ eingehalten).
- F11 Übergabe: „Als Nächstes: Wen spricht sie zuerst an?“ → F12 „Heute sucht sie zwanzig Betriebe in Chemnitz.“ + „Fünf würde sie zuerst ansprechen.“ ✓ beantwortet.
- F12 Übergabe „Als Nächstes: Was schreibt sie?“ → Lauf 12 schreibt nichts (bietet nur an), Lauf 13 „Meine Entscheidung: der Brief.“ + Kolonnenshirt_Werbebrief.docx ✓.

## Tickets → Erledigung
| Ticket | Erledigt? | Beleg |
|---|---|---|
| R1-01 Warum (Grund 2 nur Rang 1) | ja | script.txt:7 „Einer stellt ein, braucht Kleidung.“ = liste-text.txt Top 5 Rang 1 „Wer einstellt, braucht Kleidung für neue Leute.“, hörbar auf einen Betrieb bezogen. |
| R1-02 CTA Formel + Lieferbarkeit | ja | script.txt:10–11 SKILL-Formel; caption.txt:14 und prompt:3 wortgleich. |
| R1-03 Testregion | ja | script.txt:3 „in Chemnitz“; hooks.md:10 Pflicht „TESTREGION CHEMNITZ“; thema.md:34/:55 Region-Karte „50 STATT 38“ + Quelle Pflicht. |
| R1-04 Weg hörbar | ja (über R2-01) | script.txt:4 „Claude: letztes Ergebnis angehängt, Websuche, Excel-Liste.“ Werkzeug + Partizip + Websuche + Excel hörbar; R1-04-Prüftest erfüllt. |
| R1-05 Rückblick-Zeit + „anmelden“ | ja | „Anmelden“ hörbar; Rechnung thema.md:67 mit 4,73 s; Pause ≤ 0,2 s Pflicht (thema.md:54). |
| R1-06 Caption-Frage | ja | caption.txt:7 „Ich verkaufe [Produkt] an [Zielgruppe].“ + „unabhängig von meinem Standort“; caption.txt:10 „ein Maler sucht laut Anzeige einen Maler“. |
| R1-07 „Bis dahin“ | ja | prompt-fuer-kommentare.md:13 ohne „Bis dahin“. |
| R1-08 Liste in Frame 1 nur Bild-Objekt | ja | hooks.md:11. |
| R2-01 Weg-Satz | ja | script.txt:4 und :7 exakt Prüfer-Soll; `wc -w` = 100; thema.md:23 Faktentabelle mit Anhang/26 Websuchen/.xlsx belegt. |
| R2-02 Haken „Teamgröße“ | ja | script.txt:8 „Haken: Teamgröße meist nur laut Verzeichnis.“; thema.md:27 + TTS-Liste :62 („Teamgröße“). |
| R2-03 Konsistenz Regie-Vorlage | ja | Prüf-grep `grep -n "sucht online, baut\|Anmelden kann nur\|2093" thema.md` = 0 Treffer ✓. thema.md:56 Weg-Beat auf neuen Satz mit ≥ 1,2-s-Lösung (Pause 0,5–0,7 s, 06 läuft in „Fünf würde …“), :66 Weg-Satz 6, :67 Rechnung 6 Silben, :76 Selbstprüfung = gesprochener Satz, :70 Caption 2090 = gemessen, :38–50 Tickettabelle R4. hooks.md:26 ordnet die Übergabe jetzt der Entscheidung zu. |

## Faktenabgleich (Änderungen gegenüber R2)
| Gesprochen | Lauf | Urteil |
|---|---|---|
| „Claude: letztes Ergebnis angehängt, Websuche, Excel-Liste.“ | Prompt „Im Anhang ist mein letztes Ergebnis.“ (LAUF.md:13); „26 Websuchen“ (:17); Datei-Karte „XLSX“, Kolonnenshirt_Testregion_Chemnitz.xlsx (:21) | ✓ |
| „Einer stellt ein, braucht Kleidung.“ | Top 5 Rang 1 Grund 2 „Sucht laut Anzeige einen Maler … Wer einstellt, braucht Kleidung für neue Leute.“ | ✓ (ohne „gerade“, korrekt, da Anzeige-Status ungeprüft) |
| „Haken: Teamgröße meist nur laut Verzeichnis.“ | 17× „Branchenverzeichnis“, genauer belegt 3 (LAUF.md:70, liste-text.txt Blatt „Betriebe“) | ✓ |
| Caption: Top 5 = zwei Maler, Dachdecker, Zimmerei, Elektro; „Ungefragt kam der Hinweis … § 7 UWG“ | liste-text.txt Top 5 Rang 1–5; LAUF.md:24 „Kontaktweg (ungefragt, mit IHK-Quellen)“ | ✓ |

## Bewertung
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung ohne „Tag drei.“ ✓ |
| Neueinstieg/Rückblick (≤ 6,5 s, „Heute“ ≤ 14,5 s) | 8 | Ergebnis F11 ✓, Zeit ✓; Objekt von „Anmelden“ nur implizit (die Firma aus Satz 1), trägt. |
| Mehrwert: nachbaubare Schritte mit Claude, Beginn ≤ 14 s | 8 | script.txt:4 Werkzeug, Anhang, Websuche, Excel hörbar; Bild-Takt thema.md:56 passt. Satz ist telegrafisch (Stichwortreihe nach „Claude:“), aber durch das Partizip eindeutig. |
| Thema (Schmerz, Ergebnisbild, zwanzig Betriebe, Testregion, Excel-Liste) | 9 | zwanzig + Chemnitz + Excel-Liste im Ton, Region-Warum Pflicht im Bild. |
| Hook (Satz 2 + Frame 1) | 8 | hooks.md:9–11 ✓, ~13 Wörter Bildschirmtext an der ~12-Grenze (unverändert). |
| Entscheidung der KI klar und 1:1 | 8 | script.txt:5 Konjunktiv wie LAUF.md:42; „sie“ direkt nach „Claude:“ bleibt kleines Risiko (thema.md:85 selbst benannt). |
| Warum: 2–3 Gründe 1:1, verständlich | 8 | script.txt:6–7 ✓; „Einer“ ohne „von ihnen“, trägt mit Regie-Karte „STELLT EIN“ auf der Maler-Zeile. |
| Haken korrekt, nicht verkürzt-falsch | 9 | „Teamgröße“ beseitigt die Kleidergrößen-Lesart; „meist“ = 17/20 ✓, keine Zahl „vier“. |
| Schritt-Kette + Übergabe | 9 | Eingabe = Ergebnis F11, Übergabe F11 beantwortet, Übergabe F12 von Lauf 13 beantwortet. |
| CTA: konkreter Wert, nur Lieferbares, Formel | 9 | Formel ✓, Lieferteile prompt:4–6 ✓, „zehn Minuten“ (Lauf 5 min 20 s + Einfügen) ✓, B2C-Grenze prompt:26 ✓. |
| Kommentar-Mechanik | 9 | Varianten A/B, Platzhalter mit 4 Berufsbeispielen, Prüfpunkte, Abnahmekriterien ✓. |
| Länge/Satzregeln/Bildschirmtext | 8 | Wörter/Sätze ✓, Regie-Vorlage jetzt konsistent (R2-03-grep 0). Reststellen s. Hinweise. |
| Caption | 9 | 2090 ✓, Ende ✓, alle Zahlen belegt, UWG + „Keine Rechtsberatung.“ ✓. |
| Claude-Behauptungen belegt | 9 | jede gesprochene und Caption-Aussage mit LAUF.md/liste-text.txt belegt. |
| Keine private Info, keine Ansprache | 9 | Hamburg 0, Namen 0, *-anonym.png Pflicht, Screenshot 02 nur beschnitten ✓. |

## K.-o.-Check
| K.-o. | Ergebnis |
|---|---|
| > 100 Wörter | nein, 100 ✓ |
| Satz > 12 Wörter (außer fest) | nein ✓ |
| „Tag drei“ im Gesprochenen | nein ✓ |
| Hamburg in script/caption/hooks/prompt | nein ✓ |
| Betriebs-/Personennamen | nein ✓ |
| Emojis | nein ✓ |
| Caption ≥ 2100 / falsches Ende | nein (2090, Ende korrekt) ✓ |
| Imperativ/„du“ außerhalb CTA | nein ✓ |
| Unbelegte Claude-Behauptung | nein ✓ |
| Versprechen nicht lieferbar | nein ✓ |
| Fallback ohne Anhang fehlt | nein, Variante B ✓ |
| [BERUF] ohne Gegenstück | nein, 0 ✓ |
| Rückblick > 6,5 s | nein (≈ 6,15–6,33 s bei Pause ≤ 0,2 s) ✓ |

## Gesamt
**Bestanden.** Gesamtnote 8,5/10 (Mittel 8,6; niedrigste Einzelnote 8). Kein K.-o. verletzt, alle 11 Tickets (R1-01…08, R2-01…03) erledigt. Keine neuen Tickets.

Hinweise ohne Ticket (für Regie, keine Autor-Korrektur nötig):
- hooks.md:3 nennt noch „Auftrag Chef 21:00“, briefing.md:1 sagt 18:00. Für den Autor egal (nicht erste Folge in beiden Fällen), Slot gilt laut briefing.md.
- hooks.md:18 Variante A trägt noch „**Gewählt (R2).**“; gültig ist Variante F (hooks.md:15, :23). Regie liest F.
- thema.md zitiert LAUF.md-Zeilen durchgehend um +1 versetzt (z. B. Prompt :14 statt :13, Testregion :31 statt :30, „Zuerst ansprechen“ :43 statt :42). Die Zitate selbst stimmen wörtlich.
- Regie muss die Satzpause Rückblick ≤ 0,2 s und die Weg-Beat-Lösung (thema.md:54, :56) tatsächlich einhalten, sonst reißt 6,5 s bzw. die 1,2-s-Regel.
