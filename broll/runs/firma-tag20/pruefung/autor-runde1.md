# Prüfung Autor · Folge 20 (firma-tag20) · Runde 1 · 2026-10-31
Prüfer: frischer Prüf-Agent (nicht Ersteller). Geprüft: briefing.md, ../firma-tag18/tagesbriefing-2026-11-01.md, thema.md, hooks.md, script.txt, caption.txt, prompt-fuer-kommentare.md, replies.json, design/lauf/LAUF.md (inkl. Gegenprüfung), design/lauf/bericht.md. Regeln: runs/firma-tag9/tagesbriefing-2026-10-30.md, firma-pruefer/references/bewertung.md (autor). Übergabe „Was muss auf ihre Rechnung?“ vom Chef bestätigt. Alt-Fassung Skript: pruefung/script-r1.txt.

## Harte Prüfungen
| Punkt | Befund | ok |
|---|---|---|
| Wörter | `wc -w script.txt` = 99 | ✓ |
| Sätze ≤ 12 | längster freier Satz 9 W. (script.txt:6), feste Sätze 15 ausgenommen | ✓ |
| Slot 15:00, nicht erste Folge | kein „Tag“, kein „gestern“ (grep 0) | ✓ |
| Rückblick ↔ Folge 19 final | F19: „Fünf Briefe, Einkaufspreis fehlt.“ … „Hundertneun Euro Verkaufspreis für fünf Shirts? Bleibt offen.“ … „Als Nächstes: Mit oder ohne Umsatzsteuer?“ → F20 „Briefe stehen, Preis offen.“ + „Heute: Mit oder ohne Umsatzsteuer?“ (wörtliche Übergabe) | ✓ Kette ohne Sprung |
| Caption | 2043 Zeichen (≤ 2100); Ende „(Fiktives Experiment, keine echten Umsätze.)“ danach nur Hashtags; keine Emojis; Menüpfad claude.ai → „+“ → anhängen; „keine Steuerberatung“ ✓ | ✓ |
| „Keine Steuerberatung“ sichtbar | thema.md Bild-Hinweise: Karte „KEINE STEUERBERATUNG“ am Warum/Entscheidung + Caption | ✓ (Regie/Design muss es umsetzen) |
| Echter Lauf | Chat 0a4627da…, 16:41:25–16:42:56, Gedächtnis aus, kein Research, kein Konnektor, kein Login/Kauf; Screenshots 01–12 | ✓ |
| Entscheidung + Warum | „Sie wählt: mit Umsatzsteuer, nicht Kleinunternehmer.“ = LAUF 02 wörtlich sinngemäß; 2 Gründe + Haken | ✓ |
| Menschen-Schritte | Verzicht/USt-ID/Anmeldung nicht als erledigt erzählt; Board „gewählt“, nicht „angemeldet“ | ✓ |
| Kommentar-Mechanik | prompt-fuer-kommentare.md fertig (A/B, Rechenweg, beide Seiten, Checkliste, 1:1-außer); replies.json 1 + 5, je mit leichter Frage, keine Emojis | ✓ |
| Kein „du“ außerhalb CTA | ✓ | ✓ |

## Die vier Sonderfragen
1. **„Betriebe holen sich von hundertneun Euro siebzehn Steuer zurück.“** Reicht ungesagt nicht. Der Lauf sagt ausdrücklich „Wer vorsteuerabzugsberechtigt ist …“ (LAUF.md, Grund 1) und listet den Vorsteuerabzug der Kunden unter „nicht prüfen konnte“ („Ein Handwerker, der selbst Kleinunternehmer ist, zahlt bei dir immer brutto. Für ihn kippt Grund 1.“). thema.md verbietet selbst „alle Betriebe holen Steuer zurück“ – das nackte „Betriebe holen sich …“ wird genau so gehört. Kundengruppe sind kleine Betriebe < 10 Leute (Bibel), also gerade die, unter denen Kleinunternehmer vorkommen. „Die meisten Betriebe“ ist **nicht belegt** (Claude quantifiert nicht). Belegt ist nur „Betriebe mit Vorsteuerabzug“ → T-01. Das Fachwort ist zulässig, weil derselbe Satz es erklärt („holen Steuer zurück“) und die Karte „17,40 € ZURÜCK“ das Bild liefert.
2. **Grund 2 einseitig?** „Ihr Einkauf bliebe sonst neunzehn Prozent teurer.“ ist wörtlich Claudes Grund 2 und für sich wahr (Einkauf, nicht Marge). Die Gegenseite (bei gleichem Bruttopreis wäre die eigene Marge als Kleinunternehmer 19 % höher) sagt das Skript nicht, die Caption aber ausdrücklich („Die Gegenseite, ehrlich“) und der Guide (Punkt 4). Gesprochen wird keine Marge- oder Gewinnbehauptung → **nicht irreführend**, knapp. Soll an Regie/Design (kein Autor-Ticket): Karte zu Grund 2 nur „+19 % EINKAUF“ mit Label „laut Testbericht“, nie „mehr Gewinn“/„spart“.
3. **19 % Printful nur aus Testbericht:** Skript nennt keine Quelle für die 19 % und zitiert Printful nicht ✓; Caption „Printfuls eigene Aussage zu den 19 % (nur Testbericht)“ ✓; Guide 1:1-außer ✓. Bild-Label „laut Testbericht“ in thema.md ✓.
4. **IHK-Zuordnung:** prompt-fuer-kommentare.md: „Verzicht sinnvoll bei Unternehmerkunden“ = IHK Schwarzwald-Baar-Heuberg, ausdrücklich „nicht IHK München“ ✓ (deckt sich mit LAUF-Gegenprüfung). thema.md Quellen ✓. Caption nennt nur „mehrere IHK-Seiten“ ✓. Aber caption.txt:10 „Quellen: § 19 UStG“ – der Abruf von gesetze-im-internet.de wurde im Lauf abgelehnt, § 19 steht nicht unter Claudes 11 Quellen → T-03 (klein).

## Noten
| Kriterium | Note | Beleg / Begründung |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 9 | script.txt:1 feste Frage |
| Mehrwert (nachbaubar, ≤ 14 s, heute umsetzbar) | 8 | „Heute“ ≈ 13,1 s geschätzt, Weg direkt danach; Prompt + Rechenweg im Guide |
| Thema (Schmerz, ein Bild) | 9 | „Kleinunternehmer ja/nein“ kennt jeder Gründer; Bild zwei Spalten, eine gewählt |
| Hook (Satz 2 + Frame 1 → Frage, Muster) | 7 | M-002/M-011 ✓, Frage „warum freiwillig Steuer?“ ✓; aber Frame-1-Zeile „Betrieb zahlt effektiv 91,60 €“ (hooks.md:9) gilt nur mit Vorsteuerabzug (LAUF.md Tabelle: „Was ein Handwerker mit Vorsteuerabzug effektiv zahlt“) → T-02 |
| Kommentar-Mechanik | 9 | Guide ehrlich beidseitig, Platzhalter, Zeit begründet |
| Länge / Satzbau / Serienregeln | 9 | 99 W., Schätzung ≈ 44–46 s / 130 wpm; Entscheidung mit 2 Gründen + Haken |
| **Beim reinen Zuhören eindeutig (wer zahlt wem was)** | **7** | netto/brutto hörbar (17 von 109 zurück ⇒ 109 inkl. Steuer) ✓, „Ihr Einkauf“ = was die Firma Printful zahlt ✓; aber „Betriebe“ ohne Bedingung → T-01 |
| Fakten / nur Belegtes | 7 | T-01 (Verallgemeinerung gegen Lauf), T-03 |
| Caption / Replies | 7 | caption.txt:13 „Zahlt ein Betrieb 109 €, holt er sich 17,40 € … zurück“ ohne Bedingung (zwei Zeilen tiefer korrekt eingeschränkt) → T-03 |

K.-o.: keines verletzt. **Nicht bestanden** (vier Kriterien < 8).

## Tickets
```
TICKET autor-R1-01 → firma-autor
Kriterium: Zuhören eindeutig / Fakten · Note: 7/10
Beleg: script.txt:6 „Betriebe holen sich von hundertneun Euro siebzehn Steuer zurück.“; LAUF.md Grund 1 „Wer vorsteuerabzugsberechtigt ist …“ + „Für ihn kippt Grund 1“; thema.md „Nie sagen: alle Betriebe holen Steuer zurück“
Problem: Gehört gilt die Aussage für alle Betriebe, belegt ist sie nur für Betriebe mit Vorsteuerabzug.
Soll: Satz nennt die Bedingung „mit Vorsteuerabzug“ (nicht „die meisten“, unbelegt); ≤ 12 Wörter; Skript bleibt 85–100 Wörter; Zahlen 109/17 unverändert.
```
```
TICKET autor-R1-02 → firma-autor
Kriterium: Hook · Note: 7/10
Beleg: hooks.md:9 + thema.md Bild-Hinweise „Betrieb zahlt effektiv 91,60 € | 109 €“
Problem: Frame-1-Zeile verallgemeinert dieselbe Bedingung im Bild.
Soll: Zeile heißt „Betrieb zahlt effektiv“ mit Unterzeile „mit Vorsteuerabzug“ (Karte ≤ 4 Wörter je Zeile); in hooks.md und thema.md gleich.
```
```
TICKET autor-R1-03 → firma-autor
Kriterium: Caption · Note: 7/10
Beleg: caption.txt:13 „Zahlt ein Betrieb 109 €, holt er sich 17,40 € Umsatzsteuer vom Finanzamt zurück.“; caption.txt:10 „Quellen: § 19 UStG, mehrere IHK-Seiten“
Problem: Bedingung fehlt; § 19 UStG nicht als von Claude gelesene Quelle belegt (Abruf abgelehnt).
Soll: „Zahlt ein Betrieb mit Vorsteuerabzug 109 € …“; Quellenangabe = was Claude tatsächlich nutzte (Websuche zu § 19 UStG, mehrere IHK-Seiten, ein Testbericht); Caption ≤ 2100, Ende unverändert.
```

Hinweise ohne Ticket (an Regie/Design): Grund-2-Karte „+19 % EINKAUF“ + „laut Testbericht“, keine Gewinnaussage; „KEINE STEUERBERATUNG“ sichtbar am Entscheidungs-/Warum-Beat. TTS-Risiko neu nach Umsetzung: „Vorsteuerabzug“ (VOR-steu-er-ab-zug).
