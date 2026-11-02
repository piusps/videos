# Prüfung autor · Folge 12 „Betriebe“ · Runde 1

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-30. Auftrag: Fehler finden. An den Autor-Dateien nichts geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md.
Maßstab: bewertung.md „autor“; briefing.md (Slot 21:00, nicht erste Folge, Chef-Hinweise K.-o.); firma-tag9/tagesbriefing-2026-10-30.md inkl. Chef-Entscheide (100 Wörter hart, Sätze ≤ 12, Rückblick ≤ 6,5 s, „Heute“ ≤ 14,5 s, Chemnitz darf genannt werden, Hamburg nie); firma-autor SKILL (Regeln, CTA-Formel „Kommentiere „<WORT>“, und ich schick dir <genaue Lieferung>. Damit hast du in <Zeit> <greifbares Ergebnis> für dein eigenes Business.“).
Belege: design/lauf/LAUF.md, bericht.md, liste-text.txt; Vorfolge firma-tag11/script.txt; Folgelauf firma-tag13/design/lauf/LAUF.md; Fehlerbilder firma-tag10 und firma-tag11 pruefung/autor-runde1.md (+ firma-tag10 autor-runde2.md); Zeitkalibrierung firma-tag10/regie/words.json (letzte echte Messung bei Tempo 1,0) und public/firma-ep/tag9/words.json.

## Messwerte
- script.txt: **100 Wörter** (`wc -w`), harte Obergrenze genau erreicht, null Reserve.
- Sätze: fest 15/4/15; frei 1–11 Wörter (längster: CTA-Damit-Satz 11) ✓. Ein Gedanke pro Satz ✓.
- `grep -ic`: „hamburg“ 0 in allen vier Zuschauer-Dateien ✓ · „tag drei“ 0 ✓ · „gestern“ 0 im Skript ✓ · „vier“ 0 in script/caption ✓ (hooks/prompt nur als Verbotshinweis) · „chemnitz“ **0 im Skript**, 1 in caption, 1 in hooks (Bildbeschreibung), 3 in prompt.
- Betriebs-/Personennamen: alle Namensteile der Spalte „Firma“ aus liste-text.txt (27 Tokens, u. a. Knauth, Tillmann, Demeter, Fabrice, Müller, Metzler, JuniusBau, Pflugbeil) per Wortgrenzen-Regex: 0 Treffer in script, caption, hooks, prompt, thema ✓. „Cosuno“/„carport“: 0 ✓.
- Emojis: 0 (Symbol-Scan > U+2000: nur „≈ ≤ € →“ in hooks/prompt) ✓.
- caption.txt: **1999 Zeichen** (1998 ohne Schluss-Umbruch) < 2100 ✓. Endet mit „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags ✓. „Keine Rechtsberatung.“ ✓.
- „du“/Imperativ im Skript außerhalb CTA: 0 ✓. „Claude“ im Skript: **0**.
- `grep -c "\[BERUF\]" prompt-fuer-kommentare.md` = 0 ✓; Variante ohne Anhang vorhanden ✓.
- **Zeit (echte Messung statt thema.md-Schätzung):** firma-tag10/regie/words.json (Tempo 1,0, gleicher Rückblick-Satz 1): „Die“ 6,807 → „Bestellung.“ 11,533 = **4,73 s** (thema.md:60 rechnet mit 4,26 s aus der F8-Kalibrierung ×1,15, die schon F10 autor-R2-01 als widerlegt markiert hat). F10 Satz 2 „Logo: dunkelblauer Block.“ (7 Silben) = 1,54 s inkl. Doppelpunkt, Satzpause dort 0,17 s → Rückblick F10 = 6,44 s.
  - F12: 4,73 + Satzpause + „Gewerbe macht nur ein Mensch.“ (7 Silben, ≈ 1,3–1,5 s) → mit 0,17 s Pause **≈ 6,2–6,4 s ✓**, mit der in thema.md:60 vorgegebenen Regie-Pause 0,4–0,5 s **≈ 6,4–6,7 s → 6,5 s nicht gesichert**.
  - „Heute“-Start: F10 13,84 s bei identischem Aufbau → F12 ≈ 13,7–14,1 s ≤ 14,5 s ✓.
  - Gesamt: F10 = 100 Wörter in 45,2 s = 133 wpm → F12 bei 100 Wörtern ≈ 44–47 s, 128–135 wpm ✓.

## Faktenabgleich
| Gesprochen | Lauf | Urteil |
|---|---|---|
| „Gewerbe macht nur ein Mensch.“ | F11 „Als Erstes: das Gewerbe. … Haken: Das kann nur ein Mensch.“; Prompt Lauf 12 „…Gewerbeanmeldung, und die kann nur ein Mensch machen.“ (LAUF.md:13) | ✓ inhaltlich = Ergebnis F11; Wortlaut verkürzt „anmelden“ weg (s. Rückblick) |
| „Heute sucht sie zwanzig Betriebe.“ | „Finde dort mit der Websuche zwanzig echte … Betriebe“; Datei 20 Zeilen (LAUF.md:13, :68) | ✓; Region fehlt (s. Thema) |
| „Letztes Ergebnis als Anhang, Websuche, Excel-Liste.“ | Anhang „Shirt-Firma Ergebnis Gewerbe.md“ (LAUF.md:8), 26 Websuchen (:17), .xlsx (:21) | ✓ belegt, aber verblose Stichwortreihe (s. Mehrwert) |
| „Die KI würde fünf zuerst ansprechen.“ | „**Zuerst ansprechen würde ich** …“ (LAUF.md:42) | ✓ 1:1, Konjunktiv korrekt |
| „Warum? Das Shirt ist beim Kunden sichtbar.“ | Top 5 Rang 1 Grund 3 wörtlich; Rang 2 „sichtbar von der Straße“, Rang 4 „tagelang sichtbar“, Rang 5 „in Wohnungen und Häusern“; „Warum diese fünf“: Tiefbau zurückgestellt, „weil ihr Team seltener beim Endkunden auftritt“ | ✓ gilt für die Auswahl insgesamt |
| „Wer einstellt, braucht Kleidung für neue Leute.“ | Top 5 **nur Rang 1**, Grund 2 („Sucht laut Anzeige einen Maler …“); Anzeige „über 30 Tage“ alt, offen nicht geprüft | **Bezug verschoben:** direkt nach „fünf … Warum?“ gehört klingt es wie ein Grund für alle fünf. Gilt für 1 von 5. Nur eine kleine Regie-Karte („1 MALER STELLT EIN“, thema.md:51) rettet den Bezug, im Ton fehlt er. |
| „Haken: Teamgröße meist nur laut Verzeichnis.“ | 17/20 „Branchenverzeichnis“, Formel = 3 (liste-text.txt Z. 23–25); Chat „vier“ = Widerspruch, korrekt vermieden | ✓ |
| „Als Nächstes: Was schreibt sie den fünf?“ | Lauf 12 schreibt nichts, bietet nur an (LAUF.md:54); Lauf 13: „Meine Entscheidung: der Brief.“ + Kolonnenshirt_Werbebrief.docx, Prompt „fünf davon spreche ich zuerst an … Schreib dann den ersten Werbebrief“ | ✓ von Lauf 12 offen, von Lauf 13 beantwortet |
| CTA „für Frage und Listenvorlage“ | prompt-fuer-kommentare.md:4–6: Frage A/B + Listenvorlage + Prüfpunkte | ✓ Lieferteile stimmen |
| CTA „in zehn Minuten Wunschkunden für dein eigenes Business“ | prompt-fuer-kommentare.md:7 „Wunschkunden heißt: mögliche Kunden mit Quelle, die man noch selbst prüft“; :26 „Wer an Privatleute verkauft, bekommt mit dieser Frage keine Kundenliste“ | **Überversprechen**: Der Guide muss das Wort erst umdeuten; für B2C-Gründer (große Teil der Zielgruppe „etwas Eigenes aufbauen“) nicht lieferbar. |
| Caption „Ein Maler sucht gerade Leute“ | Anzeige sucht **einen** Maler, „über 30 Tage“ online | leicht ungenau (Plural, „gerade“) |
| Caption „Testregion: Chemnitz mit Umland, denn Sachsen … 50 … 38,4“ | LAUF.md:22, :31 | ✓ |
| Caption „17 von 20 … genauer belegt ist sie bei 3“ | liste-text.txt Formel | ✓ |

## Bewertung
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung wörtlich, ohne „Tag drei.“ (Folge 12 nicht erste des Tages, briefing.md:1) ✓ |
| Neueinstieg/Rückblick (Produkt + Stand, ≤ 6,5 s, „Heute“ ≤ 14,5 s) | 7 | script.txt:2 Satz 2 „Gewerbe macht nur ein Mensch.“ 7 Silben ✓, Ergebnis F11 ✓. Abzug: (a) thema.md:60–61 rechnet mit der widerlegten 4,26-s-Kalibrierung; gemessen sind 4,73 s (firma-tag10/regie/words.json). Die dort vorgegebene Regie-Satzpause 0,4–0,5 s ergibt 6,4–6,7 s → 6,5 s nicht gesichert (gleiches Fehlerbild wie F10 autor-R2-01). (b) „Gewerbe macht nur ein Mensch“ ist umgangssprachlich verkürzt; direkt nach „ganz alleine führt“ kann ein Fremder „Gewerbe“ als „das Geschäft“ hören („das Geschäft macht nur ein Mensch“ = Widerspruch zur Prämisse). „anmelden“ fehlt. |
| Mehrwert: nachbaubare Schritte mit Claude, Beginn ≤ 14 s | 7 | script.txt:4 „Letztes Ergebnis als Anhang, Websuche, Excel-Liste.“ Belegt ✓, Beginn ≈ 15 s (knapp nach 14 s, wie F10). Abzug: drei Substantive ohne Verb und ohne Werkzeug. Fremder beim ersten Hören: Anhang woran? Wer sucht? „Claude“ fällt im ganzen Skript nie. Der wichtigste Teil des Prompts (KI wählt selbst eine Testregion) ist nicht im Weg. Im Vergleich: F11 „Letztes Ergebnis angehängt, Websuche: dreizehn Punkte als Word-Checkliste.“ hat Partizip + Ergebnis; F10 R2 verlangte „anhängen“ als hörbare Handlung. Hier fällt das hinter F11 zurück. Die Screenshots 01/07/06 im Takt (thema.md:49) tragen den Weg im Bild; im Ton bleibt es eine Stichwortliste. |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild; Inhalt „zwanzig Betriebe, Testregion Chemnitz, Excel-Liste“ | 7 | Schmerz „Wo finde ich meine ersten Kunden?“ ✓, Bild Liste + Pins ✓, zwanzig Betriebe ✓, Excel-Liste ✓. **Testregion/Chemnitz: im Ton 0**, Begründung (50 statt 38) nur „darf kurz“ (thema.md:48) und klein. hooks.md:10 legt in Frame 1 eine „schlichte Karte der Testregion Chemnitz“ hinter/neben die Liste, aber **ohne lesbare Beschriftung** (einziger Zusatz-Stempel „TOP 5“, hooks.md:11). Damit ist Chemnitz in Frame 1 nicht gesichert; ein Fremder sieht 20 Pins in einer unbekannten Gegend. Die Regionswahl ist Claudes erste Entscheidung im Lauf (LAUF.md:22) und kommt im Ton gar nicht vor. thema.md:79 nennt das selbst als Risiko. |
| Hook: Satz 2 + Frame 1 erzeugen Frage, Muster belegt | 8 | hooks.md:8–12: Ergebnis zuerst (M-002), echte Liste + 5 gelb, Stempel aus Datei-Wortlaut ✓, kein „17 von 20“ in Frame 1 ✓ (F11-Lehre übernommen). Abzug: liste-anonym.png zeigt pro Zeile Gewerk, Ort, „Cosuno-Verzeichnis: 5-9 Beschäftigte“, „Branchenverzeichnis“ → weit über ~12 Wörter Bildschirmtext in Frame 1 neben Text-Hook + 2 Stempeln (Tagesbriefing Z. 19). |
| Entscheidung der KI klar erkennbar und 1:1 | 8 | script.txt:5 „Die KI würde fünf zuerst ansprechen.“ = Lauf, Subjekt KI ✓. Welche fünf (zwei Maler, Dach, Zimmerei, Elektro) nur im Bild; Region-Entscheidung im Ton nicht vorhanden. |
| Warum: 2–3 konkrete Gründe 1:1, verständlich | 6 | script.txt:6 Grund 1 trägt die Auswahl ✓. script.txt:7 Grund 2 ist wörtlich, gilt aber nur für Rang 1 (liste-text.txt Z. 29); als zweiter Grund für „fünf“ gesprochen ist das hörbar falsch verallgemeinert. thema.md:51/81 gesteht ein, dass nur die Regie-Karte den Bezug herstellt. Im Datei-Blatt gibt es einen echten Grund für alle fünf: „Sie decken vier Gewerke ab … So siehst du im Test, welches Gewerk am besten anspricht.“ (liste-text.txt Z. 34), dazu „Tiefbau … zurückgestellt, weil ihr Team seltener beim Endkunden auftritt“. |
| Haken korrekt, nicht verkürzt-falsch | 8 | script.txt:8 korrekt (17/20), „vier“ vermieden ✓. Telegrammstil ohne Verb, aber verständlich. |
| Schritt-Kette + Übergabe | 9 | Eingabe = Ergebnis F11 als Anhang (LAUF.md:8) ✓; „Heute …“ + „Die KI würde fünf zuerst ansprechen.“ beantwortet F11 „Wen spricht sie zuerst an?“ (firma-tag11/script.txt:8) ✓; Rückblick-Satz 2 = Haken F11 ✓; Übergabe von Lauf 13 beantwortet (Brief + .docx) ✓. |
| CTA: konkreter Wert, nur Lieferbares, Formel | 6 | script.txt:10–11. Lieferteile „Frage und Listenvorlage“ ✓. Abzug: (a) „Wunschkunden für dein eigenes Business“ verspricht mehr als lieferbar: Ergebnis ist eine ungeprüfte Kandidatenliste (17/20 Größe nur Verzeichnis), prompt-fuer-kommentare.md:7 muss das Wort umdeuten, und für Gründer mit Privatkunden liefert die Frage laut :26 gar keine Liste. (b) Formel aus SKILL („, und ich schick dir …“) verkürzt zu „für Frage und Listenvorlage“, gehört: unklar, was man bekommt und wie (F11 hatte die Formel vollständig). |
| Kommentar-Mechanik (prompt-fuer-kommentare.md) | 8 | F10/F11-Fehler behoben: kein [BERUF] ✓, Variante B ohne Anhang ✓, Hamburg 0 + Abnahmekriterium ✓, keine Betriebe ✓, Prüfpunkte aus „Nicht geprüft“ ✓, B2C-Grenze ehrlich ✓. Abzug: Variante A :13 „Mein letztes Ergebnis: [STAND]. **Bis dahin** will ich wissen …“ – „Bis dahin“ stammt aus dem Lauf-Kontext (bis das Gewerbe angemeldet ist) und hängt mit beliebigem [STAND] in der Luft (Variante B hat es korrekt entfernt). |
| Länge/Satzregeln/Bildschirmtext | 8 | 100 Wörter ✓, Sätze ✓, Karten ≤ 4 Wörter geplant ✓, TTS-Risikowörter gelistet ✓, wpm laut F10-Messung ✓. Abzug: Zeitrechnung auf falscher Kalibrierung (s. Rückblick), null Wortreserve für nötige Korrekturen. |
| Caption | 7 | 1999 Zeichen ✓, Schluss ✓, Chemnitz + Begründung ✓, Haken 17/3 ✓, UWG ✓. Abzug: (a) caption.txt:6–7 Schritt 1 „ohne Datei geht es auch“, aber die Frage in Schritt 2 enthält keinen Satz zu Produkt/Zielgruppe („Betriebe aus **meiner Zielgruppe**“) → ohne Datei weiß Claude nicht, wen es suchen soll; die Anleitung funktioniert so nicht. (b) „Wähl eine Testregion in Deutschland“ ohne „unabhängig von meinem Standort“ (Lauf-Prompt) – genau dieser Zusatz hat im Lauf die Standortstadt verhindert. (c) caption.txt:10 „Ein Maler sucht gerade Leute“ – Anzeige sucht einen Maler, über 30 Tage alt. |
| Claude-Behauptungen belegt | 8 | Alle gesprochenen Aussagen haben eine Lauf-Zeile ✓ (Tabelle). Abzug: Grund 2 im Bezug verschoben (s. Warum). |
| Keine private Info, keine Ansprache | 9 | Hamburg 0, Namen 0, Straßen/Telefon 0, Screenshot-02-Beschnitt + *-anonym.png vorgeschrieben (hooks.md:12) ✓; kein „du“ außerhalb CTA ✓. |

## K.-o.-Check
| K.-o. | Ergebnis |
|---|---|
| > 100 Wörter | nein, 100 ✓ |
| Satz > 12 Wörter (außer fest) | nein ✓ |
| „Tag drei“ / Tag im Gesprochenen | nein ✓ |
| Hamburg in script/caption/hooks/prompt | nein ✓ |
| Betriebs-/Personennamen | nein ✓ |
| Emojis | nein ✓ |
| Caption ≥ 2100 / falsches Ende | nein ✓ |
| Imperativ/„du“ außerhalb CTA (Skript) | nein ✓ |
| „vier“ als Zahl genauer Belege | nein ✓ |
| Zuschauer direkt angesprochen | nein ✓ |
| Ergebnis nicht aus echtem claude.ai-Lauf | nein, Chat 5d98b9cd, 5 min 20 s ✓ |
| Unbelegte Claude-Behauptung | nein (Grund 2 belegt, aber Bezug verschoben → Note 6 Warum) |
| ChatGPT statt Claude | nein ✓ |
| KI-Entscheidung ohne Warum | Top-5-Entscheidung hat Warum ✓. Die Region-Entscheidung erscheint nur im Bild; wird sie dort wie geplant als Entscheidung gezeigt, braucht sie ihr Warum sichtbar („50 STATT 38“ ist nur „darf“) → **Risiko für die Regie-/Design-Stufe**, s. T-03 |
| Versprechen, das wir nicht liefern können | **grenzwertig**: „Wunschkunden für dein eigenes Business“ (s. CTA). Nicht als K.-o. gewertet, weil Frage + Listenvorlage geliefert werden und der Guide die Grenze offen nennt; Note 6. |
| Erwähnung, dass niemand kommentiert hat | nein ✓ |
| Rückblick ≤ 6,5 s | **droht** bei der Regie-Vorgabe aus thema.md:60 (6,4–6,7 s); auf Autor-Stufe als Note 7 gewertet |

## Gesamt
**Nicht bestanden.** Kein K.-o. verletzt. Durchschnitt ≈ 7,7, Mindestnote 6.
Unter 8: Warum (6), CTA (6), Rückblick (7), Mehrwert (7), Thema/Testregion (7), Caption (7).
Die F10/F11-Fehlerbilder sind formal behoben ([BERUF] weg, Fallback da, Weg-Satz existiert, CTA nennt Lieferteile), aber zwei kehren in neuer Form zurück: der Weg-Satz ist eine verblose Stichwortliste ohne Werkzeug, und der CTA verspricht mit „Wunschkunden“ wieder mehr als lieferbar. Neu: Grund 2 wird hörbar auf alle fünf verallgemeinert, und Chemnitz/Testregion, ein Kern der Folge, ist weder gesprochen noch in Frame 1 lesbar gesichert. Alle Korrekturen müssen innerhalb von 100 Wörtern bleiben; Sparpotenzial z. B. „Die KI würde fünf zuerst ansprechen.“ → „Zuerst würde sie fünf ansprechen.“ (−1), „Haken: Teamgröße meist nur laut Verzeichnis.“ → „Haken: Größe meist nur geschätzt.“ (−1, nur wenn „Verzeichnisklasse“ im Bild steht).

## Tickets
```
TICKET autor-R1-01 → firma-autor
Kriterium: Warum · Note: 6/10
Beleg: script.txt:5–7; liste-text.txt Z. 29 (Grund 2 nur Rang 1), Z. 34 („Warum diese fünf: Sie decken vier Gewerke ab … Tiefbau … zurückgestellt, weil ihr Team seltener beim Endkunden auftritt“); thema.md:51, :81
Problem: „Wer einstellt, braucht Kleidung für neue Leute.“ gilt nur für einen der fünf, klingt nach „fünf … Warum?“ aber wie ein Grund für alle.
Soll: Beide gesprochenen Gründe gelten laut Datei für die Auswahl der fünf, ODER Grund 2 ist im Ton selbst auf einen Betrieb bezogen (z. B. „Einer stellt gerade ein, braucht also Kleidung.“). Jeder Grund steht mit wörtlicher Lauf-/Datei-Zeile in der thema.md-Faktentabelle; kein Grund hängt mehr an einer Regie-Karte; script.txt ≤ 100 Wörter, Sätze ≤ 12.
```
```
TICKET autor-R1-02 → firma-autor
Kriterium: CTA · Note: 6/10
Beleg: script.txt:10–11; prompt-fuer-kommentare.md:7 („Wunschkunden heißt: mögliche Kunden mit Quelle, die man noch selbst prüft“), :26 (B2C bekommt keine Liste); firma-autor SKILL CTA-Formel
Problem: „Wunschkunden für dein eigenes Business“ verspricht mehr, als die Frage liefert (ungeprüfte Kandidaten, nur für Firmenkunden), und die Formel „, und ich schick dir …“ fehlt.
Soll: Das Ergebnis im Damit-Satz benennt, was die Frage wirklich liefert, ohne Umdeutung im Guide (z. B. „mögliche Firmenkunden mit Quelle“ / „eine Liste möglicher Firmenkunden“). Der Liefersatz folgt der SKILL-Formel „Kommentiere „Kunden“, und ich schick dir …“ ODER thema.md begründet die Kurzform mit Chef-Entscheid. caption.txt:14 und prompt-fuer-kommentare.md:3/:7 wortgleich angepasst; script.txt ≤ 100 Wörter.
```
```
TICKET autor-R1-03 → firma-autor
Kriterium: Thema/Testregion · Note: 7/10
Beleg: script.txt (Chemnitz 0×); hooks.md:10–11 (Karte ohne lesbare Beschriftung, einziger Stempel „TOP 5“); thema.md:48 („klein“, „50 STATT 38“ nur „darf“), :79; LAUF.md:22 (Regionswahl = Claudes Entscheidung mit Gründen)
Problem: Die Testregion Chemnitz, ein Kern der Folge und Claudes erste Entscheidung, ist weder gesprochen noch in Frame 1 lesbar gesichert, und ihr Warum ist nur optional.
Soll: Entweder fällt „Chemnitz“ (oder „Testregion Chemnitz“) im Ton (script.txt ≤ 100 Wörter), ODER hooks.md schreibt für Frame 1 eine lesbare Ortsbeschriftung der Karte aus dem Lauf-Wortlaut (≤ 4 Wörter, z. B. „TESTREGION CHEMNITZ“) als Pflicht vor, ohne die Ein-Textblock-Regel zu brechen (dann ersetzt sie „TOP 5“ oder kommt im Heute-Beat in Normalgröße). In beiden Fällen ist die Region-Karte mit Warum („50 STATT 38“ + Quelle) in thema.md als Pflicht, nicht als „darf“, festgelegt.
```
```
TICKET autor-R1-04 → firma-autor
Kriterium: Mehrwert · Note: 7/10
Beleg: script.txt:4 „Letztes Ergebnis als Anhang, Websuche, Excel-Liste.“; Skript ohne „Claude“; F11 script.txt:4; F10 autor-R2-02
Problem: Der Weg ist eine verblose Stichwortreihe ohne Werkzeug; ein Fremder hört nicht, wer was womit macht.
Soll: Der Weg-Satz enthält mindestens eine hörbare Handlung (Verb oder Partizip, z. B. „angehängt“/„sucht“) und nennt das Werkzeug Claude, ohne Imperativ/„du“, ≤ 12 Wörter; alle Teile weiter mit LAUF.md belegt (Faktentabelle angepasst); script.txt ≤ 100 Wörter. Prüfung: Ein Fremder kann nach einmaligem Hören sagen „Claude bekommt das letzte Ergebnis, sucht im Web und macht eine Excel-Liste“.
```
```
TICKET autor-R1-05 → firma-autor
Kriterium: Neueinstieg/Rückblick · Note: 7/10
Beleg: thema.md:60–61 (Satz 1 = 4,26 s, Regie-Pause 0,4–0,5 s); firma-tag10/regie/words.json (Satz 1 = 4,73 s, Pause 0,17 s, Rückblick 6,44 s); script.txt:2 „Gewerbe macht nur ein Mensch.“
Problem: Die Zeitrechnung nutzt die widerlegte Kalibrierung; mit der Messung und der vorgegebenen Pause reißt der Rückblick 6,5 s. „Gewerbe macht“ ist mehrdeutig.
Soll: thema.md „Länge“ rechnet mit Satz 1 = 4,73 s (Quelle firma-tag10/regie/words.json) und gibt eine Satzpause vor, mit der der Rückblick ≤ 6,5 s bleibt (z. B. ≤ 0,2 s wie F10). Satz 2 sagt hörbar „anmelden“ (z. B. „Gewerbe anmelden kann nur ein Mensch.“, 10 Silben ≤ 11) und die Rechnung weist damit ≤ 6,5 s aus; sonst bleibt Satz 2 und thema.md begründet, warum „Gewerbe macht“ eindeutig ist. script.txt ≤ 100 Wörter.
```
```
TICKET autor-R1-06 → firma-autor
Kriterium: Caption · Note: 7/10
Beleg: caption.txt:6–7 („ohne Datei geht es auch“, Frage ohne Produkt/Zielgruppe, ohne „unabhängig von meinem Standort“); caption.txt:10 „Ein Maler sucht gerade Leute“; LAUF.md:13; liste-text.txt Z. 21/29
Problem: Ohne Datei funktioniert die Caption-Frage nicht (Zielgruppe unbekannt), der Standort-Zusatz fehlt, und der Stellen-Grund ist ungenau.
Soll: Die Caption-Frage beginnt mit „Ich verkaufe [Produkt] an [Zielgruppe].“ und enthält „unabhängig von meinem Standort“; Z. 10 lautet sinngemäß „Ein Maler sucht laut Anzeige einen Maler“. Caption weiter < 2100 Zeichen (Wert in thema.md), Ende unverändert.
```
```
TICKET autor-R1-07 → firma-autor
Kriterium: Kommentar-Mechanik · Note: 8/10 (Hinweis)
Beleg: prompt-fuer-kommentare.md:13 „Mein letztes Ergebnis: [STAND IN EINEM SATZ]. Bis dahin will ich wissen …“
Problem: „Bis dahin“ stammt aus dem Gewerbe-Kontext des Laufs und ergibt mit beliebigem Stand keinen Sinn.
Soll: Variante A enthält kein „Bis dahin“ (z. B. „Ich will wissen, wen ich zuerst anspreche.“ wie Variante B).
```
```
TICKET autor-R1-08 → firma-autor
Kriterium: Hook · Note: 8/10 (Hinweis)
Beleg: hooks.md:9–11; design/lauf/liste-anonym.png (Spalten Gewerk, Ort, Größenangabe, Art der Größenquelle lesbar); Tagesbriefing Z. 19
Problem: Frame 1 zeigt Text-Hook + 2 Stempel + eine lesbare 20-Zeilen-Tabelle, weit über ~12 neue Wörter Bildschirmtext.
Soll: hooks.md legt fest, dass die Liste in Frame 1 als Bild-Objekt (Zeilen erkennbar, Text nicht als Lesetext, z. B. weich/klein, nur die gelben Zeilen betont) erscheint und erst im Entscheidungs-/Haken-Beat lesbar wird.
```

Hinweis an den Chef (nicht Autor): briefing.md:1 setzt Folge 12 auf 21:00, briefing.md:17 nennt für Folge 13 ebenfalls 21:00; Tagesbriefing Z. 13–14 hat 18:00/21:00. Slot von Folge 13 klären.
