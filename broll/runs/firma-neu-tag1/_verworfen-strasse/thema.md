# Tag 1 · Thema

Serie: „Die Straße“ (wirtschaftsbuch-v2.md). Tag 1 = Kunde 1, Kasse 0 → 49 € im Monat.

## 5 Kandidaten
| # | Kunde | Schmerz in einem Satz | Nachbaubare Lösung mit Claude | Sichtbares Ergebnis | Muster |
|---|---|---|---|---|---|
| A | Malermeister | Sonntagabend schreibt er Angebote, und die Aufträge gehen an den, der schneller war. | Gmail + Google Drive: Claude liest die Anfragen und die Preisliste und schreibt jedes Angebot als Mail-Entwurf. | Anfragen 9 → 0, Entwürfe 0 → 9 | M-001 (Preis → Tempo), M-002 (Küchentisch mit Stapel), M-005 |
| B | Steuerkanzlei | 80 Mails am Morgen, die Frist steckt irgendwo dazwischen. | Gmail: sortieren nach Frist / Rückfrage / kann warten | Ungelesen 80 → 3 | M-005 stark, M-001 schwächer („mehr Personal“ → „nein“) |
| C | Friseurin | Absagen per Mail, der Kalender stimmt nie. | Gmail + Calendar: Absage lesen, Termin freigeben | Lücken 6 → 0 | M-002 gut, Nutzen kleiner |
| D | Autowerkstatt | Den ganzen Tag „Ist mein Auto fertig?“ am Telefon. | Drive-Sheet + Gmail: Fertig-Mails als Entwürfe | Rückrufe 14 → 0 | M-005 gut, Setup (Sheet) erklärungsbedürftig |
| E | Physiotherapie | Serientermine von Hand eintragen | Calendar: Serie aus einem Satz | Einträge 10 → 1 | schnell, aber kleiner Schmerz |

## Gewählt: A · Malermeister, Angebote aus dem Postfach
- **Schmerz, den jeder Handwerker sofort kennt:** Angebote schreibt man abends oder am Wochenende, und wer zu spät antwortet, verliert den Auftrag. Er betrifft direkt das Geld, nicht nur Ordnung. Das ist für ältere Unternehmer der stärkste Hebel.
- **Ein Bild:** Küchentisch, Sonntagabend, ein Stapel mit 9 Anfragen (Zähler am Stapel), die Uhr steht kurz vor Viertel nach acht. Der Stapel läuft auf 0, im Postfach stehen 9 Entwürfe.
- **Umkehrung bis Sekunde 5:** „verliert Aufträge, nicht am Preis. Am Tempo.“ Das ist die Annahme des Kunden (ich bin zu teuer) plus Dreh.
- **Story-Wert für Tag 1:** Der erste Kunde ist der Prototyp des Zielpublikums (Handwerksmeister, eher älter). Seine Aufgabe ist die, die das meiste Geld bringt. Tag 6 bringt ihn als Rückkehrer zurück (Nachfassen).
- **Connectors statt Copy-Paste:** Gmail (Anfragen lesen, Entwürfe schreiben) + Google Drive (Preisliste lesen). Pius' Wunsch „loggt sich in dein Gmail ein“ ist erfüllt.
- **Abgrenzung alter Tag 4:** Dort hat Claude die Preisliste nur aus Drive gelesen und das Angebot im Chat ausgegeben. Neu: Claude holt die Anfragen selbst aus Gmail und legt die Angebote als Mail-Entwürfe ab. Das ist ein Schritt mehr, und der Mensch macht nur noch den Klick.

## Fakten (geprüft am 2026-10-26)
Quelle 1: https://support.claude.com/en/articles/10166901-use-google-workspace-connectors (Use Google Workspace connectors, „Updated this week“)
- Connector-Namen: **Gmail**, **Google Drive**, **Google Calendar**.
- Plan: „available for all users on Claude and Claude Desktop“, also auch Free. Bei Team/Enterprise muss ein Owner die Connectors zuerst freischalten.
- Gmail: Claude kann Mails suchen und lesen, **Entwürfe schreiben** sowie senden, antworten und weiterleiten. „By default, Claude asks for your approval before each of these actions.“
- Gmail-Grenze: **Anhänge sind nicht lesbar** („Attachment content is not directly accessible through Gmail (metadata only)“). Die Anfrage muss also im Mailtext stehen. Fotos und PDF-Anhänge der Kunden liest Claude über Gmail nicht.
- Google Drive: liest Google Docs, **Sheets**, Slides, PDFs, MS-Office-Dateien (nur Text, eingebettete Bilder nicht). Die Preisliste darf also ein Sheet, ein Doc, eine PDF oder eine Excel-Datei sein.
- Wiederverbinden/Verwalten: „Customize > Connectors“.

Quelle 2: https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities (Use connectors to extend Claude's capabilities)
- Menüpfad: **Customize → Connectors → „+“ → Connector wählen → Connect**, dann bei Google anmelden.
- Web-Connectors gibt es für alle Pläne inklusive Free.

**Was Claude darf / nicht darf (für Skript und Caption):**
- Darf: Anfragen im Postfach finden und lesen, Preisliste aus Drive lesen, Angebot als Mail-Entwurf anlegen.
- Darf nicht ohne Freigabe: senden (Standard ist Freigabe pro Aktion). Im Prompt steht zusätzlich „nur Entwürfe, nichts senden“.
- Kann nicht: Anhänge in Gmail lesen. Wenn Maße oder Infos fehlen, soll Claude „[?]“ einsetzen statt zu raten (steht im Prompt).

**Noch offen (vor dem Schnitt im echten claude.ai klicken, Aufgabe firma-design):**
- Deutsche Menübeschriftungen der Oberfläche (Anpassen/Customize, Konnektoren/Connectors) sind nicht belegt. Im Bild gilt, was der echte Screenshot zeigt. In der Caption stehen die belegten englischen Namen.
- Ob der Entwurf sichtbar im Gmail-Ordner „Entwürfe“ landet, ist laut Doku wahrscheinlich („draft emails“), aber per Testlauf zu bestätigen, bevor das Ergebnis-Bild „9 Entwürfe im Postfach“ gebaut wird. Fallback-Formulierung im Skript ist schon neutral: „Claude schreibt nur Entwürfe.“

**Bewusst nicht behauptet:** keine Preise für Claude-Pläne, keine Statistik zu verlorenen Aufträgen (die Umkehrung ist die Erfahrung des fiktiven Kunden, keine Studie), kein M-006-Preisvergleich (keine belegte Quelle für Kosten einer Bürokraft).

## TTS-Risikowörter (für die Stimm-Stufe markiert)
Gmail, Google Drive, Claude, Tatort, Malermeister, neunundvierzig. „Drive“ englisch („draiv“), „Claude“ englisch („klod“).

## Selbstprüfung als Fremder (script.txt, 93 Wörter, ca. 32–34 s bei Tempo 1,15)
- **Weiß ich nach 5 s, worum es geht?** Ja. Eine KI baut eine Firma, heute ist Tag eins, der erste Kunde verliert Aufträge, weil er zu langsam ist. Dazu zeigt das Bild Stapel, Uhr und „VERGEBEN“.
- **Habe ich nach 20 s etwas zum Ausprobieren?** Ja. Wort 32 (ca. s11) ist „So baust du dir das selbst“, bei Wort 58 (ca. s20) stehen alle drei Schritte inklusive Prompt.
- **Glaube ich es?** Ja, weil der Einwand beantwortet wird („Claude schreibt nur Entwürfe. Senden tust du.“, belegt: Freigabe vor dem Senden ist Standard).
- **Will ich kommentieren?** Ja, wenn ich kein Maler bin, aber Angebote schreibe. „Beruf“ bringt mir meinen eigenen Prompt (Lieferung im Satz).
- **Stolperstellen:** „Kunde eins von hundert“ erklärt das Ziel nur im Nebensatz. Das HUD „Kunde 1 / 100“ muss ab Frame 1 stehen. „Tatort“ funktioniert nur für deutsche Zuschauer, das ist die Zielgruppe. Wer Kundenanfragen nur als PDF-Anhang bekommt, für den geht es über Gmail nicht. Das steht im Prompt und in der Caption als Hinweis.
- Jeder Satz ist ein Bild: Firma/Tag (Straße, Haus 1 dunkel) · Brief fliegt zur Konkurrenz · Küchentisch mit Stapel 9 · Claude-Fenster öffnet sich · Connector-Seite · Preisliste fliegt in Drive · Prompt wird getippt · 9 Entwürfe, Senden-Knopf beim Menschen · Uhr 20:14, Fernseher geht an · Kasse 0 → 49 €, Haus 1 geht an · Kommentarfeld mit „Maler“.
