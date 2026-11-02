# Wirtschaftsbuch v2 · „Superkind baut eine Firma“ · Die Straße

Neustart ab Tag 1, festgelegt am 2026-10-26 (firma-autor, Konzept-Wahl in `broll/runs/firma-neu-tag1/konzept.md`). Die alte `wirtschaftsbuch.md` ist nur noch Material und wird nicht fortgeschrieben. Abstimmungen, Rivale, Shop-Tafel und das Millionen-Ziel gelten nicht mehr.

Fiktives Experiment. Alle Kunden sind erfundene Betriebstypen ohne Namen echter Firmen oder Personen. Jede Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“.

## 1. Prämisse
Ein KI-Agent gründet eine Firma von Null. Sie nimmt kleinen Betrieben **genau eine** lästige tägliche Aufgabe ab, für **49 € im Monat**. Jede Folge ist ein Laden in der Straße des Agenten: ein Betrieb, ein Alltagsproblem, eine Lösung mit Claude. Ziel: **100 Kunden**.

Was der Agent dem Kunden baut, baut sich der Zuschauer in derselben Folge selbst mit Claude (höchstens 3 Schritte, über Connectors). Der Kunde ist der Stellvertreter des Zuschauers.

## 2. Regeln
1. **Eröffnung (Vorschlag A, Standard):** „KI baut eine Firma von Null. Tag <N>.“ Gleich danach folgt ein Satz mit Kunde und Umkehrung, die bis Sekunde 5–6 stehen muss.
   **Variante B (alte Eröffnung, falls Pius sie behält):** „KI baut ein Unternehmen von Null. Ganz alleine. Tag <N>.“
2. Das Ziel (100 Kunden) und der Stand stehen im HUD und werden nicht vorgelesen. Gesprochen wird höchstens „Kunde N von hundert“ am Ende.
3. Eine Folge = ein Kunde (oder ein Rückkehrer) = ein Problem = eine Claude-Lösung. Nie zwei Themen.
4. Mehrwert spätestens ab Sekunde 10–14, „Schritt eins / zwei / drei“, der Prompt ist eine einfache Frage und steht lesbar im Bild.
5. Nur Claude, nur belegte Funktionen (support.claude.com, Quelle in `thema.md`). Connectors statt Copy-Paste.
6. Claude schickt nie etwas ohne den Menschen: Entwürfe statt Versand, oder ausdrücklich „mit deinem Okay“.
7. Kommentar-Aufruf mit Lieferung im selben Satz: „Schreib deinen Beruf in die Kommentare, ich schick dir den Prompt dafür.“ Die Story braucht **keine** Kommentare. Kommentatoren werden nie zu Figuren, nie namentlich gezeigt, nie erwähnt, wenn keiner kommentiert hat.
8. Länge 30–35 s, 85–95 Wörter, Zahlen im Sprechtext als Wörter.
9. Superkind wird im Video höchstens leise genannt (Firmenschild, Agent). In der Caption steht er als Weg „ohne Setup“, nie als „KI-Mitarbeiter“.

## 3. Figuren
- **Der Agent:** Die einzige orange Figur. Ruhig, freundlich, macht kein Aufheben, arbeitet sichtbar (trägt Stapel weg, schaltet Licht an). Er spricht nicht selbst. Es gibt eine Erzählstimme.
- **Die Kunden:** je eine Figur pro Laden in gemischten Palettenfarben (nie orange), Berufs-Requisit als Sticker (Farbrolle, Schere, Brötchenkorb, Aktenordner, Schraubenschlüssel). Sie sind Typen, keine Namen: „der Malermeister“, „die Friseurin“. Sie sind eher älter, bodenständig und nie lächerlich.
- **Rückkehrer:** Bestandskunden kommen mit einer zweiten Aufgabe zurück. Ihr Haus leuchtet dann heller (zweites Fenster).
- **Kein Rivale, keine Abstimmung.**

## 4. Welt (für firma-regie / firma-design)
- TrainerWorld3D-Holzraum. Auf einer großen Tischinsel steht eine **Modell-Straße mit 100 kleinen Häusern**, die anfangs alle dunkel sind. Am Kopf der Straße liegt das Büro des Agenten mit Firmenschild und Claude-Paper-Fenster.
- Jede Folge folgt derselben Kamerafahrt: Straße (Hub) → Schaufenster des heutigen Ladens → Alltagsszene drinnen (Frame 1 spielt hier) → Claude-Fenster (echte claude.ai-Screenshots mit Zeiger) → zurück nach draußen → das Haus geht an.
- HUD dauerhaft: „Tag N“ · „Kunde N / 100“ · „Monatsumsatz X €“.
- Im Laden sitzt ein Problem-Zähler am Objekt selbst (Stapel, Kalender, Ordner), der im Ergebnis-Beat auf 0 läuft.
- Am Ende wird das Schaufenster des nächsten Ladens kurz angeleuchtet (nur ein Requisit, kein Text nötig) als Neugier auf morgen.

## 5. Geld- und Fortschrittsmechanik (feste kleine Schritte)
Pro Folge gibt es **genau einen** dieser Schritte:
| Schritt | Kasse (Monatsumsatz) | Straße | Häufigkeit |
|---|---|---|---|
| Neukunde | +49 € | neues Haus geht an | Standard |
| Zweite Aufgabe bei Bestandskunde | +49 € | zweites Fenster im selben Haus | etwa jede 5. Folge |
| Kündigung | −49 € | Licht geht aus, Grund in einem Satz (ehrlich, oft eine Lehre) | höchstens 1 pro 10 Folgen, nie zwei hintereinander, frühestens ab Tag 13 |
| Pflege-Folge (Fehler beheben, Einwand beantworten) | ±0 € | Haus blinkt kurz | höchstens 1 pro 10 Folgen |

- Die Kasse zeigt den **Monatsumsatz** (wiederkehrend), nicht angesammeltes Geld. So bleibt sie klein und ehrlich.
- Der Zähler „Kunde N / 100“ zählt Häuser mit Licht, er ist kein Folgenzähler. Tag und Kunde laufen auseinander, sobald es Rückkehrer und Kündigungen gibt. Das ist gewollt.
- Grobe Zielkurve: Tag 10 ≈ 9 Kunden, Tag 30 ≈ 24, Tag 60 ≈ 46, Tag 100 ≈ 75 Kunden (≈ 3.700 € im Monat). Das Ziel 100 wird bewusst knapp verfehlt oder erst mit einem Endspurt erreicht. Das ist erst ab Tag 80 zu entscheiden.
- Kosten werden nur gezeigt, wenn der Preis mit Quelle belegt ist.
- Jede Folge wird vor dem Posten unten in „Tatsächlicher Verlauf“ eingetragen und nicht mehr geändert.

## 6. Folgen-Schema (30–35 s)
| Zeit | Beat | Inhalt |
|---|---|---|
| 0–2 s | Eröffnung | „KI baut eine Firma von Null. Tag N.“ Das Bild zeigt schon den Alltagsmoment im Laden (M-002). |
| 2–6 s | Kunde + Umkehrung | „Kunde N <Problem>, nicht wegen X. Wegen Y.“ (M-001) |
| 6–10 s | Alltagsmoment | ein Bild-Satz: wer, wann, welcher Stapel (Zähler sichtbar, M-005) |
| 10–24 s | Mehrwert | „So baust du dir das selbst, mit Claude.“ → Schritt eins bis drei, der Prompt lesbar im Bild (M-004, M-008) |
| 24–28 s | Ergebnis + Sicherheit | Zähler läuft auf 0, „Senden tust du“ (Einwand beantwortet) |
| 28–31 s | Fortschritt | „Er zahlt neunundvierzig Euro im Monat. Kunde N von hundert.“ Das Haus geht an. |
| 31–34 s | Kommentar | „Schreib deinen Beruf in die Kommentare, ich schick dir den Prompt dafür.“ (M-007) |

Pflicht-Dateien pro Folge: thema.md (mit Quellen), hooks.md, script.txt, prompt-fuer-kommentare.md, caption.txt.

## 7. Themenplan Tag 1–10
| Tag | Kunde (Typ) | Alltagsproblem | Claude-Lösung (Connector) | Zähler im Laden | Schritt | Kasse danach |
|---|---|---|---|---|---|---|
| 1 | Malermeister | Sonntagabend 9 Anfragen offen, Angebote kommen zu spät | Gmail + Google Drive: Angebot aus Anfrage + Preisliste als Mail-Entwurf | Anfragen 9 → 0 | Neukunde | 49 € |
| 2 | Friseurin | Absagen per Mail, Kalender stimmt nie | Gmail + Google Calendar: Absage lesen, Termin verschieben/freigeben | Kalender-Lücken 6 → 0 | Neukunde | 98 € |
| 3 | Steuerkanzlei | 80 Mails am Morgen, Fristen gehen unter | Gmail: Frist / Rückfrage / kann warten | Ungelesen 80 → 3 dringend | Neukunde | 147 € |
| 4 | Autowerkstatt | „Ist mein Auto fertig?“-Anrufe | Google Drive (Auftrags-Sheet) + Gmail: Fertig-Mails als Entwürfe | Rückrufe 14 → 0 | Neukunde | 196 € |
| 5 | Physiotherapie-Praxis | Serientermine von Hand eintragen | Google Calendar: Serientermin aus einem Satz | Einträge 10 → 1 Satz | Neukunde | 245 € |
| 6 | Malermeister (Rückkehrer) | Angebote raus, keiner antwortet | Gmail: Angebote ohne Antwort finden, Nachfass-Entwurf | Offene Angebote 7 → 0 | 2. Aufgabe | 294 € |
| 7 | Bäckerei | Wer kann Samstag? | Google Calendar: gemeinsame Verfügbarkeit finden | Lücken im Plan 3 → 0 | Neukunde | 343 € |
| 8 | Hausverwaltung | Rohrbruch-Mail neben Parkplatzfrage | Gmail: Dringlichkeit + Antwort-Entwürfe | Notfälle oben | Neukunde | 392 € |
| 9 | Café | Reservierungen per Mail, Doppelbuchungen | Gmail + Calendar: eintragen + Bestätigung als Entwurf | Doppelbuchungen 2 → 0 | Neukunde | 441 € |
| 10 | Elektriker | Freitags Wochenbericht für Kunden | Calendar + Gmail: Woche zusammenfassen, Bericht als Entwurf | 10 Häuser an (Zwischenbilanz) | Neukunde | 490 € |

Jede Funktion wird pro Folge neu gegen support.claude.com geprüft (Stand 2026-10-26: Gmail lesen/suchen/Entwürfe/Senden mit Freigabe, Calendar Termine anlegen/ändern/gemeinsame Verfügbarkeit, Drive liest Docs/Sheets/PDFs; Quelle: https://support.claude.com/en/articles/10166901-use-google-workspace-connectors). Gmail kann **keine Anhänge lesen** (nur Metadaten). Themen, die Anhänge brauchen, fallen raus oder laufen über Drive.

Ab Tag 11: weitere Connectors aus dem Verzeichnis (jeweils einzeln belegen), Projekte, Skills. Erste mögliche Kündigung ab Tag 13 (zum Beispiel: Kunde kündigt, weil ein Entwurf einen falschen Preis hatte. Lehre: „Du prüfst immer. So machst du die Preisliste eindeutig.“).

## 8. Tatsächlicher Verlauf
| Folge | Datum gepostet | Kunde | Schritt | Kunden mit Licht | Monatsumsatz danach | Notiz |
|---|---|---|---|---|---|---|
