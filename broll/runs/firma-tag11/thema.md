# Thema Folge „Gewerbe“ (Folge 11, intern firma-tag11, Serientag 3, Slot 2026-10-30 18:00, nicht erste Folge)

Gründungsschritt: „Heute: Was muss sie anmelden?“ Beantwortet wörtlich die Übergabe aus Folge 10 „Als Nächstes: Was muss sie anmelden?“ (firma-tag10/script.txt:9) mit Claudes Entscheidung „Als Erstes kommt die Gewerbeanmeldung“ (design/lauf/LAUF.md:26).
Kettenprüfung: Website steht als Entwurf, nicht online; vor „online“ fehlen laut Lauf 10 Impressum und Datenschutz (firma-tag10/design/lauf/LAUF.md:41, :73, :92), und ein Impressum braucht eine Firma. Ein echter Gründer klärt als Nächstes, was er anmelden muss. Eingabe = Ergebnis Folge 10 als Anhang „Shirt-Firma Ergebnis Website.md“ (LAUF.md:7). Kein Sprung, kein Tag, kein „gestern“.
Themenwahl: von der Kette festgelegt (tagesbriefing-2026-10-30, briefing.md). Schmerz, den jeder Gründer kennt: „Was muss ich eigentlich anmelden, bevor ich was verkaufe?“ Bild: echte Checkliste aus der Word-Datei mit orangen Stempeln „Mensch“.
Kern: die ehrliche Grenze von „ganz alleine“. Anmelden kann nur ein Mensch; die Datei stempelt 9 von 13 Punkten „Mensch“ (LAUF.md:67–68; gesprochen nur „Das kann nur ein Mensch.“, der Zähler 9/13 läuft im Bild). Nie erzählt, dass es erledigt ist oder dass ich es mache; neutral „Das kann nur ein Mensch.“
Muster: M-002 (Frame 1 = Ergebnis), M-004 (Screenshots), M-007 (Ein-Wort-CTA mit Lieferung), M-011 (Stempel).

## Quellen
- Echter Lauf: `design/lauf/LAUF.md` + `bericht.md` + `checkliste-text.txt`, Chat https://claude.ai/chat/6358742d-8358-4f20-99f2-ad3ba7437460, 2026-10-29 19:00:21–19:05:13 (4 min 52 s), Opus 5.5 Mittel, kein Research, Gedächtnis aus, 18 Websuchen, 4 von 8 Seitenabrufen erfolgreich, 17 Quellenlinks, Word-Datei `Kolonnenshirt_Checkliste_erster_Verkauf.docx`.
- Claude-Funktionen: nur „+“ zum Anhängen (Screenshot 01, wie Lauf 8–10) und Word-Datei als Ergebnis (Screenshot 06, Datei-Karte „DOCX“). Kein Menüpfad gesprochen. Websuche ohne eigenen Schalter (LAUF.md:4).
- Übergabe gegen Lauf 12 geprüft: `../firma-tag12/design/lauf/LAUF.md:13` (Prompt „Bis dahin will ich wissen, wen ich zuerst anspreche“, „Entscheide, welche fünf du zuerst ansprechen würdest“) und :42 („Zuerst ansprechen würde ich …“, Top 5). Lauf 11 beantwortet die Frage nicht (nur Pflichten, keine Kunden).

## Tickets R1 → erledigt wie (Runde 2, 2026-10-30)
- **autor-R1-01 Weg-Satz:** neu „Letztes Ergebnis angehängt, Websuche: dreizehn Punkte als Word-Checkliste.“ (8 Wörter, kein Imperativ, kein „du“). Belege: Anhang „Shirt-Firma Ergebnis Website.md“ = Schlussantwort Lauf 10 (LAUF.md:7), 18 Websuchen (LAUF.md, Ergebnis), Datei `Kolonnenshirt_Checkliste_erster_Verkauf.docx` mit 13 Punkten (LAUF.md, „Inhalt: 13 Punkte in 3 Phasen“; checkliste-text.txt Punkte 1–13). Damit ist „dreizehn“ eingeführt; der Haken spricht keinen unerklärten Zähler mehr.
- **autor-R1-02 Grund 2:** „Erst danach gibt es die Steuernummer.“ → Claudes Überschrift wörtlich „Die anderen Schritte bauen darauf auf.“ (Chat-Schlussantwort Grund 2, LAUF.md). Kette Gewerbe → Fragebogen Finanzamt → Steuernummer → Verpackungsregister nur auf der Karte. Caption ebenfalls ohne verschobenes „erst“.
- **autor-R1-03 CTA:** „Kommentiere „Gewerbe“, und ich schick dir Frage und echte Checkliste. Damit hast du in zehn Minuten deine Startliste für dein eigenes Business.“ (R2-02: vorher „eine Checkliste“, Doppelung). Kein „Pflicht-Checkliste“, keine Vollständigkeit, SKILL-Formel erfüllt (10 + 12 Wörter).
- **autor-R1-04 Hamburg im Guide:** prompt-fuer-kommentare.md hat eine Tabelle mit allen 10 Ortsstellen (Datei Grund 3, Titel Punkt 1, Text Punkt 1, Quelle Kammer, Quelle Datenschutzbehörde mit Ortskürzel, Nicht-prüfen-Punkt, Chat-Überschrift, Chat-Grund 3, Websuchen, Bilder) mit Behandlung weglassen/neutral; „1:1 außer [Ort]-Stellen“; Abnahme `grep -ic hamburg` = 0 (plus hmb, bezirksamt, „25 €“) im Guide-Text + Bildsichtung. Gebühr: **ganz weggelassen** (einzige Quelle trägt den Ortsnamen in Titel und URL; „je nach Stadt verschieden“ steht nicht im Lauf), stattdessen redaktionelle Fußnote „Auskunft gibt die Gewerbebehörde vor Ort“ ohne Betrag. Die Datei selbst nennt die Stadt nur als „[Ort]“ (einzige Fundstelle von „hamburg“ = das Abnahmekriterium selbst).
- **autor-R1-05 [BERUF]:** `grep -c "\[BERUF\]"` = 0; Überschrift „Beispiele nach Beruf“ mit den echten Platzhaltern; neue Vorlage B ohne Anhang; jedes Beispiel sagt, ob A oder B.
- **autor-R1-06 Zeit:** neu kalibriert mit echter Tempo-1,0-Stimme von Folge 10 (`firma-tag10/regie/words.json`), s. „Länge“. Rückblick-Satz 2 von „Website: Entwurf, nicht online.“ (7 Silben, Doppelpunkt + Komma, real 6,5–6,9 s) auf „Website-Entwurf, offline.“ (6 Silben, eine Komma-Pause) → 6,2–6,45 s; „Heute“ ≈ 13,4–13,9 s.
- **autor-R1-07 Caption:** Grund 3 nur „Und sie ist schnell und günstig.“ (keine Gebühr-Formel), „Claude kann dort nur vorbereiten oder einbauen.“, Grund 2 als Claudes Überschrift + Lauf-Reihenfolge, CTA wie Skript inkl. Damit-Satz. **2079 Zeichen** (< 2100), Hamburg 0, Emojis 0, Ende „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags.
- **autor-R1-08 Frame 1:** Zähler „9 von 13“ aus Frame 1 gestrichen (hooks.md), kommt erst im Haken-Beat als Bild-Zähler; Textblöcke in Frame 1 nacheinander.

- **autor-R2-01:** Bild `05-nicht-pruefen.png` in die Abdeck-Tabelle (Nr. 10) aufgenommen; Prüfbefehl verweist auf den Ortsnamen in LAUF.md statt ihn zu nennen. Ortsname/Ortskürzel = 0 Treffer in prompt-fuer-kommentare.md, script.txt, caption.txt, hooks.md.
- **autor-R2-02:** Damit-Satz „… deine Startliste für dein eigenes Business.“ (12 Wörter) in Skript, Caption und Guide-Vorgabe; Skript 100 Wörter, Caption 2079 Zeichen.

## Faktenabgleich Gesprochen ↔ Beleg
| Gesprochen | Beleg |
|---|---|
| Eröffnung ohne Tag | Tagesbriefing 2026-10-30: Folge 11 nicht erste Folge. Zeile 1 wörtlich wie R1. |
| Rückblick Satz 1 (fest) | Vorgabe Chef. |
| „Website-Entwurf, offline.“ (6 Silben) | Lauf 10: „Die Startseite steht als Handy-Entwurf“ (LAUF 10:23), Artifact privat „Nur du“, nicht veröffentlicht (:4, :73), „Was fehlt, bevor die Seite online gehen darf“ (:41); Folge 10 endet „Ohne Impressum und Datenschutzerklärung nicht online.“ |
| „Heute: Was muss sie anmelden?“ | Übergabe Folge 10 wörtlich; Prompt Lauf 11: „was ich in Deutschland vor dem ersten verkauften Shirt anmelden oder klären muss“ (LAUF.md:12). |
| „Letztes Ergebnis angehängt, Websuche: dreizehn Punkte als Word-Checkliste.“ | Anhang = Ergebnis Lauf 10 (LAUF.md:7, Karte „39 Zeilen · MD“); „18 Websuchen“; Datei-Karte „Dokument · DOCX“ (Screenshot 06); „13 Punkte in 3 Phasen“. |
| „Als Erstes: das Gewerbe.“ | „Als Erstes kommt die Gewerbeanmeldung“ (Chat); Datei: „Was als Erstes kommt: die Gewerbeanmeldung“. |
| „Warum? Pflicht ab dem ersten Tag.“ | Grund 1 wörtlich: „Sie ist Pflicht ab dem ersten Tag.“ (§ 14 GewO, Paragraf nicht gesprochen). |
| „Die anderen Schritte bauen darauf auf.“ | Grund 2, Claudes fett gesetzte Überschrift wörtlich (Chat-Schlussantwort). |
| (Grund 3 „schnell und günstig“ nur Caption/Guide) | Chat Grund 3; Betrag/Ort weggelassen. |
| „Haken: Das kann nur ein Mensch.“ | Datei Punkt 1, Spalte „Wer“ = „Mensch“, „Du reichst ein und zahlst.“ (checkliste-text.txt Z. 21–22). Beleg = Word-Datei (Chef-Entscheid). Passt zu Rückblick Folge 12 „Gewerbe macht nur ein Mensch.“ |
| „Als Nächstes: Wen spricht sie zuerst an?“ | Lauf 11 beantwortet sie nicht. Lauf 12 beantwortet sie (firma-tag12 LAUF.md:13, :42, Top 5) = Folge 12 „Fünf spricht sie zuerst an.“ |
| CTA „Frage und echte Checkliste … in zehn Minuten eine Checkliste für dein eigenes Business“ | Guide = Vorlage A/B + echte Checkliste mit Mensch/Claude-Markierung und Quellen (prompt-fuer-kommentare.md). Lauf 4 min 52 s + Ausfüllen + Lesen ≈ 10 min. „eine Checkliste“ ohne Vollständigkeitsversprechen. |

## Entscheidung + Gründe
- **Entscheidung der KI** = Claudes Entscheidung im Lauf: als Erstes die Gewerbeanmeldung. Parallel: entscheiden, ob nur an Firmen verkauft wird (nur Caption/Guide).
- **Warum (gesprochen 2 Gründe):** Pflicht ab dem ersten Tag · die anderen Schritte bauen darauf auf. Grund 3 „schnell und günstig“ in Caption/Guide.
- **Grenze (gesprochen):** Das kann nur ein Mensch. Bild: 9 von 13 Punkten „Mensch“.

## Offene Fäden
- Claudes Bitte um Name/Anschrift wird nicht beantwortet und nicht erzählt (Chef-Entscheid).
- Hersteller-Rolle beim Verpackungsrecht (Printful oder Händler), GPSR bei B2B, Widerrufs-Ausnahme: laut Claude nicht geprüft → nur Caption (Hersteller-Rolle) und Guide.
- Gewerbe nicht angemeldet; Kasse 0 €. Kein Zähler.
- Übergabe Folge 12: „Wen spricht sie zuerst an?“ → Folge 12 hat Rückblick-Satz 2 „Gewerbe macht nur ein Mensch.“ und „Fünf spricht sie zuerst an.“ Beides passt zu „Haken: Das kann nur ein Mensch.“ + Übergabe hier.

## Für die Regie
- **Frame 1:** Checkliste aus der Word-Datei (`design/lauf/04-nur-ein-mensch-word.png` bzw. Ausschnitt aus `checkliste-ansicht.png`), Phase 1 mit den orangen Zellen **„Mensch“** als Stempel, **ohne** Zähler „9 von 13“ (R1-08). **Achtung K.-o.:** Punkt 1 trägt in der Datei den Ortsnamen, die Gebühr-Zeile nennt die Kammer mit Ortsnamen → abdecken/beschneiden; Stadt in keinem Frame. Bild ist lokal aus Claudes Datei gerendert (keine claude.ai-Pixel). Details hooks.md.
- **Rückblick-Karte (Satz 2 „Website-Entwurf, offline.“):** Handy mit Website-Vorschau aus Folge 10, Stempel „ENTWURF“ (Wort aus Lauf 10); Board: WEBSITE bleibt „Entwurf“, GEWERBE current.
- **Weg-Beat** (auf „Letztes Ergebnis angehängt, Websuche: dreizehn Punkte als Word-Checkliste.“): Screenshot 01 (Anhang-Karte + Prompt) auf „Letztes Ergebnis angehängt“, Seitenleiste/Quellen (02, beschnitten) auf „Websuche“, 06 Datei-Karte „DOCX“ auf „Word-Checkliste“. Ein Bild pro Satzteil, nacheinander.
- **Entscheidungs-Beat:** Screenshot 03 nur beschnitten (Zeile endet mit Ortsname → abdecken) oder Karte „ALS ERSTES: GEWERBE“.
- **Warum-Karten** (≤ 4 Wörter, nacheinander, je ≥ 1,2 s, vor dem Warum Pause bis 0,9 s): 1. „PFLICHT AB ERSTEM TAG“ (Lauf: „Pflicht ab dem ersten Tag“; klein „§ 14 GewO“). Nicht „TAG EINS“ (klingt nach Serientag). 2. „ALLES BAUT DARAUF AUF“ bzw. Datei-Wortlaut „SCHALTET SCHRITTE FREI“, darunter Pfeilkette Gewerbe → Finanzamt → Steuernummer → Verpackungsregister (Lauf-Reihenfolge).
- **Haken-Beat (Kern):** Stempel **„MENSCH“** knallt auf Punkt 1; dann zählen die 9 orangen „Mensch“-Zellen hoch, die 4 grünen „Claude“-Zellen bleiben gedimmt; erst jetzt Karte „9 VON 13“ (nur Bild). Keine Hand, kein Formular, das ausgefüllt aussieht, kein Haken an „Gewerbe“ auf dem Board.
- **Übergabe-Beat:** Board-Feld BETRIEBE mit Fragezeichen. Keine Betriebsnamen.
- **Kein Umsatz-Zähler** (0 €). Max. ein neuer Textblock gleichzeitig.
- **TTS-Risikowörter (vor der finalen Stimme per Test):** „offline“ (OFF-lain), „Website-Entwurf“ (WEB-sait-ent-wurf), „Word-Checkliste“ (WÖRD-tschek-lis-te; „Word“ nicht deutsch „Wort“), „Websuche“ (WEB-su-che), „Gewerbe“ (Ge-WER-be, auch im CTA), „anmelden“, „dreizehn“, „Business“ (BIS-nis), „Kommentiere“. Pausen-Vorgabe siehe „Länge“.

## Länge
**100 Wörter** (`wc -w`, hart). Sätze (ohne feste Eröffnung): 15 (Rückblick 1, fest)/2/5/8/4/1/5/6/6/7/10/12 – alle ≤ 12. Kein „du“/Imperativ außerhalb des CTA, kein Tag, kein „gestern“.
**Kalibrierung neu (R1-06):** echte Tempo-1,0-Stimme Folge 10 (`firma-tag10/regie/words.json`, gleiche Eröffnung, gleicher Rückblick-Satz 1): Eröffnung 0–6,29 s, Pause 0,52 s; Satz 1 „Die … Bestellung.“ 6,81–11,53 s = **4,73 s** (nicht 4,26 s); Satzpause dort 0,17 s; „Logo: dunkelblauer Block.“ (7 Silben, Doppelpunkt) = 1,54 s → ≈ 0,21 s/Silbe; Rückblick F10 gesamt 6,44 s; „Heute“ bei 13,84 s. Folge 10 gesamt: 100 Wörter = 45,16 s = 133 wpm.
**Rückblick hier:** 4,73 s + Satzpause 0,17–0,25 s + „Website-Entwurf, offline.“ (6 Silben ≈ 1,26 s + Komma 0,1–0,15 s) = **6,26–6,39 s**; ohne Pausen-Vorgabe schlimmstenfalls 4,73 + 0,35 + 1,45 = 6,53 s. **Regie-Vorgabe:** Satzpause nach „Bestellung.“ ≤ 0,25 s, Komma nach „Website-Entwurf“ ohne Zusatzpause (≤ 0,15 s) → ≤ 6,45 s. (R1-Fassung „Website: Entwurf, nicht online.“ hätte mit Doppelpunkt + Komma 6,5–6,9 s ergeben.)
**„Heute“-Start:** 6,81 + 6,26–6,45 + Pause 0,5–0,6 s = **13,6–13,9 s** (≤ 14,5 s ✓).
**Gesamt:** 100 Wörter wie Folge 10 → ≈ 44–46 s inkl. Regie-Pausen (0,4–0,7 s an Satzgrenzen, vor „Warum?“ bis 0,9 s) → ≈ 130–136 wpm; Regie misst, Ziel ≤ 135 wpm, Tempo nie < 1,0.
**Caption:** **2079 Zeichen** (Python `len` ohne Schluss-Umbruch, < 2100). Ortsname: script.txt 0, caption.txt 0; prompt-fuer-kommentare.md nennt die Stadt nur als „[Ort]“ (einziger Treffer = das Abnahmekriterium `grep -ic hamburg`). Klarname sonst nur intern: Abdeck-Hinweis hooks.md, Prüfwort in thema.md.

## Selbstprüfung als Fremder
- **Nach 6 s:** KI führt 100 Tage allein eine Firma, gemessen wird Umsatz. ✓
- **Nach 14 s:** Shirts mit Logo für kleine Betriebe; Website gibt es als Entwurf, aber offline; heute: was sie anmelden muss. ✓
- **Nach 18 s:** Weg gehört: letztes Ergebnis anhängen, Websuche, raus kommt eine Word-Checkliste mit dreizehn Punkten. Nachbaubar. ✓
- **Nach dem Warum:** Gewerbe zuerst, weil es ab dem ersten Tag Pflicht ist und die anderen Schritte darauf aufbauen (Karte zeigt welche). ✓
- **Grenze verstanden?** „Ganz alleine“ geht hier nicht: Das Gewerbe kann nur ein Mensch anmelden (Bild: 9 von 13 Punkten). ✓ Nichts als erledigt erzählt.
- **Kommentieren?** Ja, wer gründen will: Frage und echte Checkliste, in zehn Minuten eine eigene Checkliste. ✓ Keine Vollständigkeit versprochen.
- Fehler aus Folge 9/10 vermieden: Weg-Satz gesprochen; „Frage und …“ statt nur „die Frage“; kein [BERUF]; Vorlage ohne Anhang; Grund 2 wörtlich aus dem Lauf.
