# Prüfung · Stufe autor · Runde 1 · Neustart Tag 1 („Die Straße“, Malermeister)

Prüfer: firma-pruefer (fremder Agent), 2026-10-26. Maßstab: `~/.claude/skills/firma-pruefer/references/bewertung.md` Abschnitt „## autor“ + briefing.md + wirtschaftsbuch-v2.md.
Geprüft: briefing.md, konzept.md, thema.md, hooks.md, script.txt, prompt-fuer-kommentare.md, caption.txt, wirtschaftsbuch-v2.md. Referenzen: spy/muster.md, Zerlegungen opusjake Trader 2.3M, 99hud TV 221k, lorisbot01 Aquarium 357k.

Quellen selbst geöffnet am 2026-10-26:
- Q1 https://support.claude.com/en/articles/10166901-use-google-workspace-connectors
- Q2 https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities

## Gesamtentscheidung: NICHT BESTANDEN

Grund: 6 von 8 Kriterien unter 8, und das K.-o.-Kriterium „unbelegte Claude-Behauptung / Versprechen, das wir nicht liefern können“ ist verletzt (siehe Kriterium 1, Tickets 01–03).

| # | Kriterium | Note |
|---|---|---|
| 1 | Fakten / K.-o.-Prüfung (Skript + Caption gegen Q1/Q2) | **5** · K.-o. |
| 2 | Neuer Zuschauer versteht in 5 s, worum es geht | 6 |
| 3 | Mehrwert: nachbaubar, Beginn ≤ 14 s, heute umsetzbar | 6 |
| 4 | Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 6 |
| 5 | Hook: Satz 2 + Frame 1 erzeugen eine Frage, gestützt auf muster.md | 7 |
| 6 | Kommentar-Mechanik: Lieferung im Satz, machbar, Prompt liegt vor | 7 |
| 7 | Länge, Sprechbarkeit, Serien-Regeln | 7 |
| 8 | Konzept (100 Folgen, ohne Kommentare, Fremde, Superkind-Regel) | 7 |

---

## 1 · Fakten / K.-o.-Prüfung · 5/10 · K.-o. verletzt

Belegt und korrekt:
- Connector-Namen Gmail, Google Drive, Google Calendar (Q1). thema.md:24 korrekt.
- Menüpfad „Customize > Connectors > + > Connector > Connect“ (Q2 wörtlich: „Go to Customize > Connectors, then click the "+" button“). caption.txt:6, prompt-fuer-kommentare.md:8 korrekt (englische Labels; deutsche UI-Labels sind offen, thema.md:41 vermerkt das richtig).
- Pläne: „available for all users on Claude and Claude Desktop“, Team/Enterprise Owner muss freischalten (Q1). thema.md:25 korrekt; Skript/Caption behaupten nichts zu Plänen.
- Gmail kann suchen, lesen, Entwürfe schreiben, senden/antworten/weiterleiten, Freigabe vor Senden „by default“ (Q1). Anhänge nur Metadaten (Q1). caption.txt:10 „Anhänge in Gmail liest Claude nicht“ korrekt.
- Drive liest „Sheets, Slides, PDFs, images, and MS Office files“, nur Text (Q1).

Falsch, unbelegt oder nicht gedeckt:
- **script.txt:8 „Claude schreibt nur Entwürfe.“** Als allgemeine Aussage falsch: der Gmail-Connector kann laut Q1 auch senden, antworten, weiterleiten (mit Freigabe per Standard). „Nur Entwürfe“ stimmt nur, wenn der Prompt es verlangt. Der gesprochene Prompt (script.txt:7 „Schreib zu jeder Anfrage ein Angebot nach meiner Preisliste.“) verlangt weder Entwürfe noch Gmail. Wer genau diesen Satz eintippt, bekommt sehr wahrscheinlich die Angebote als Text im Chat, nicht „Neun Angebote“ als Entwürfe im Postfach (script.txt:9). → Versprechen im Skript wird vom gezeigten Prompt nicht geliefert. **K.-o.**
- **caption.txt:7 „Preisliste in Google Drive legen (Sheet, Excel oder PDF)“ / prompt-fuer-kommentare.md:9,14 „Lies meine Preisliste in Google Drive (Datei „Preisliste [BERUF]“)“.** Q1 belegt Lesen dieser Typen, aber Suchen nur für Google Docs („Search and retrieve Google Docs from your Drive“). Dass Claude eine Excel/PDF/Sheet-Datei per Dateiname selbst findet, ist nicht belegt. „Excel“ ist zudem nur über „MS Office files“ abgeleitet (Q1 nennt .xlsx nicht). Ausgerechnet die Variante, die Q1 sicher deckt (Google Doc), fehlt in der Caption. **K.-o. (unbelegt), lösbar per echtem Testlauf oder Umstellung auf Google Doc / Datei per „+“ anhängen.**
- **caption.txt:12–14 „Er zahlt 49 € im Monat. … Ohne Einrichtung geht das auch mit Superkind.“** Direkt nebeneinander liest ein Fremder: Superkind kostet 49 €/Monat für diese Aufgabe. Für diesen Preis liegt keine Quelle vor (wirtschaftsbuch-v2.md:49 „Kosten werden nur gezeigt, wenn der Preis mit Quelle belegt ist“). Fiktiver Preis + echter Markenname = unbelegte Produktaussage. **K.-o.-nah, als Ticket.**
- prompt-fuer-kommentare.md:16 „Angebot als **Antwort-Entwurf** in Gmail“: Q1 nennt „Draft emails“ und „manage threads“, aber nicht ausdrücklich Antwort-Entwürfe im bestehenden Thread. Nicht belegt; per Test bestätigen oder „als Mail-Entwurf an den Kunden“ formulieren.
- caption.txt:10 „gesendet wird nichts ohne dein Okay“: stimmt nur „by default“; bei Team/Enterprise kann der Owner die Freigabe abschalten (Q1). Für die Zielgruppe meist zutreffend, Formulierung „standardmäßig“ wäre sauber. (Kein K.-o., Hinweis.)

## 2 · Neuer Zuschauer versteht in 5 s · 6/10
Gelesen als älterer Handwerksmeister ohne Serie und ohne KI-Wissen:
- script.txt:1 „KI baut eine Firma von Null. Tag eins.“ Welche Firma, was verkauft sie? Bleibt bis Zeile 10 offen und wird auch dort nicht gesagt (wofür zahlt er 49 €?).
- script.txt:2 „Kunde eins verliert Aufträge“: „Kunde“ und „Aufträge“ kollidieren. Für einen Handwerker vergibt der Kunde Aufträge, er verliert keine. Wessen Kunde? (der KI-Firma) – das sagt kein Wort. Erst Zeile 3 „Ein Malermeister.“ klärt die Person, ohne die Beziehung zu klären. Ich stolpere genau an Sekunde 2–5.
- „Am Tempo.“ ist abstrakt; welches Tempo (Antwort auf Anfragen) steht nirgends.
- hooks.md:18 behauptet Fremden-Note 5; die Doppelbedeutung von „Kunde“ wurde nicht erkannt.

## 3 · Mehrwert nachbaubar, ≤ 14 s, heute · 6/10
Zeitlich erfüllt: „So baust du dir das selbst“ beginnt bei Wort 25 (≈ s 8), „Schritt eins“ bei Wort 33 (≈ s 11). Inhaltlich fehlt, was ein Fremder zum Nachbauen braucht:
- **Per-Chat-Aktivierung fehlt.** Q2: „Connectors must be turned on for each conversation … Click the "+" button in the lower left of the chat interface … hover over Connectors“. Weder script.txt:5, caption.txt:6 noch prompt-fuer-kommentare.md:8 nennen das.
- **Nur mit Gmail-Postfach.** Ältere Handwerker nutzen oft T-Online, GMX, web.de oder Outlook. Das Rezept funktioniert dann gar nicht; weder Skript noch Caption sagen „wenn deine Anfragen in Gmail landen“.
- Der gesprochene Prompt (script.txt:7) nennt weder „in meinem Gmail“ noch „als Entwurf“ noch die Preislisten-Datei. Er ist zu dünn, um das gezeigte Ergebnis zu erzeugen (siehe 1).
- script.txt:4 „So baust du dir **das** selbst“: Das „das“ (Angebote automatisch aus Mails) wurde vorher nie benannt.

## 4 · Thema · 6/10
- Schmerz stark und bekannt (Angebote am Wochenende, Auftrag geht an den Schnelleren), betrifft Geld. Gut.
- **Logikbruch:** Die Ursache ist laut Skript „Tempo“ (er antwortet zu spät). Die Lösung lässt ihn aber weiter **Sonntagabend** arbeiten, nur schneller („fertig vor dem Tatort“, script.txt:9). Der Kunde, der Dienstag anfragt, wartet weiter bis Sonntag. Das Tempo-Problem ist nicht gelöst. Soll: Lösung = am selben Tag, jeden Abend 2 Minuten.
- **Bild widerspricht Mechanik:** hooks.md:10 und thema.md:16 planen in Frame 1 einen „Stapel Briefe“ auf dem Küchentisch. Papierbriefe kann Gmail nicht lesen. script.txt:3 „neun Anfragen offen“ sagt nicht „im Postfach“. Der Fremde sieht Papier und hört Gmail.
- Ergebnis in einem Bild (9 → 0, 9 Entwürfe) ist gut, aber noch unbestätigt (thema.md:42).

## 5 · Hook · 7/10
- M-001 (muster.md:14–20) korrekt angewendet: Annahme „Preis“ → Dreh „Tempo“. Ende des Satzes bei Wort 17 ≈ s 5,5–6 (hooks.md:18). muster.md verlangt bis s 5, die Bibel erlaubt 5–6 (wirtschaftsbuch-v2.md:13). Grenzwertig.
- M-002 Frame 1 (Brief segelt zur Konkurrenz, „VERGEBEN“) ist ein gutes Rätselbild wie T 00:00 (Krebs zieht Stecker), aber Papierbrief ≠ Mail (siehe 4).
- Satz 2 erzeugt wegen „Kunde eins verliert Aufträge“ eher Verwirrung als eine Frage (siehe 2). Vergleich Trader 2.3M: „Claude just killed day traders“ ist eindeutig in einem Atemzug.

## 6 · Kommentar-Mechanik · 7/10
- Lieferung im Satz: ja (script.txt:11 „ich schick dir den Prompt dafür“), entspricht M-007 (T 00:29, H 00:44). prompt-fuer-kommentare.md liegt fertig vor, mit Beispielzeilen für 4 Berufe plus Fallback. Gut.
- Machbarkeit offen: prompt-fuer-kommentare.md:3 „angepasst auf seinen Beruf“ und caption.txt:14 „den fertigen Prompt für deinen Betrieb“. Die Zernio-Automation schickt jedem Kommentar dieselbe DM; eine Anpassung an beliebige Freitext-Berufe ist weder automatisiert noch beschrieben. Bei vielen Kommentaren nicht lieferbar → Versprechen-Risiko (K.-o.-Kategorie „nicht lieferbar“), wenn nicht geklärt.
- „Versand erst nach OK von Pius“ (prompt-fuer-kommentare.md:3) widerspricht der stehenden Regel „jeder Kommentar bekommt sofort die DM“; Ablauf unklar.

## 7 · Länge, Sprechbarkeit, Serien-Regeln · 7/10
- 93 Wörter (gezählt: 8/9/7/8/7/7/12/7/6/10/12), im Ziel 85–95. Zahlen als Wörter. Bei Tempo 1,15 ≈ 32–34 s. OK.
- script.txt:7 „Schritt drei: Frag: Schreib zu …“: zwei Doppelpunkte hintereinander, drei Imperative (Frag/Schreib) – TTS und Hörer stolpern.
- „Tatort“ (script.txt:9): für Deutsche verständlich, aber Rätsel-Abkürzung für „Sonntag 20:15“; und es zementiert den Logikbruch aus 4.
- Eröffnung neu vorgeschlagen, begründet, alte als Variante B daneben (konzept.md:20–22, wirtschaftsbuch-v2.md:13–14). Regelkonform.
- **Regelbruch:** briefing.md:24 „Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)““. caption.txt:16 steht davor, danach folgt caption.txt:18 mit Hashtags.
- Geld-Tempo +49 € (klein) erfüllt briefing.md:15.

## 8 · Konzept · 7/10
Stark: Story braucht keine Kommentare (konzept.md:14), Rahmen passt in einen Satz plus HUD, Kunde = Stellvertreter des Zuschauers, langsames Geld, ehrliche Schwächenliste (konzept.md:119–125). Vergleich mit drei Gegenkonzepten nachvollziehbar.
Schwächen:
- **Widerspruch im Kern:** Der Zuschauer baut es in 3 Schritten gratis selbst (script.txt:4–7), der Malermeister zahlt dafür 49 € im Monat (script.txt:10). Warum zahlt er? Ohne einen Satz „weil er es nicht selbst einrichten will“ wirkt der Kunde dumm oder die Firma überflüssig. Genau dieser Satz wäre auch die Superkind-Brücke („ohne Setup“), fehlt aber im Video.
- **Superkind-Regel:** konzept.md:105 „Die Firma in der Story ist das Superkind-Modell“ + caption.txt:12–14 suggerieren einen Superkind-Preis von 49 € ohne Quelle (siehe 1).
- **100 Folgen:** konzept.md:122 sagt selbst, Gmail/Calendar/Drive tragen ≈ 30 Folgen; für Tag 31–100 gibt es keinen belegten Vorrat. Tragfähigkeit über 100 ist Behauptung, nicht Plan.
- Für Fremde: „Kunde N“ ist doppeldeutig (siehe 2) – das betrifft jede Folge, nicht nur Tag 1, also ein Konzeptproblem der Formel „Kunde N <Problem>“ (wirtschaftsbuch-v2.md:56).
- Gmail-only begrenzt die Zielgruppe „ältere Handwerker“ dauerhaft; Konzept nennt Outlook/Microsoft-365-Connector nicht als Weg.

---

## Korrektur-Tickets

```
TICKET autor-R1-01 → firma-autor
Kriterium: Fakten / K.-o. · Note: 5/10
Beleg: script.txt:7–9, caption.txt:8+10
Problem: „Claude schreibt nur Entwürfe“ ist allgemein falsch (Gmail-Connector kann senden, Q1), und der gesprochene Prompt verlangt weder Gmail noch Entwürfe, liefert also das gezeigte Ergebnis „neun Angebote im Postfach“ nicht.
Soll: Der gesprochene und in der Caption stehende Prompt nennt Gmail und „als Entwurf“ (z. B. „Schreib zu jeder Anfrage in meinem Gmail ein Angebot nach meiner Preisliste, als Entwurf.“); Satz 8 lautet sinngemäß „Claude legt nur Entwürfe an, senden tust du“ als Folge des Prompts, nicht als Eigenschaft von Claude; Caption sagt „standardmäßig fragt Claude vor dem Senden“. Bleibt bei 85–95 Wörtern.
```

```
TICKET autor-R1-02 → firma-autor
Kriterium: Fakten / K.-o. · Note: 5/10
Beleg: caption.txt:7, prompt-fuer-kommentare.md:9+14+16, thema.md:28
Problem: Dass Claude eine Sheet/Excel/PDF-Preisliste in Drive per Dateiname selbst findet und Antwort-Entwürfe im Thread anlegt, ist durch Q1 nicht belegt (Suche belegt nur für Google Docs, „Draft emails“ ohne Thread-Antwort).
Soll: Entweder (a) thema.md enthält einen echten claude.ai-Testlauf (Datum, Screenshot-Pfad) mit Gmail-Anfrage + Preisliste als Sheet/PDF → Entwurf im Gmail-Ordner „Entwürfe“, oder (b) Caption und Prompt empfehlen die belegte Variante (Preisliste als Google Doc) und sagen „Mail-Entwurf an den Kunden“ statt „Antwort-Entwurf“. Keine Dateityp-Aufzählung, die nicht belegt oder getestet ist.
```

```
TICKET autor-R1-03 → firma-autor
Kriterium: Fakten / K.-o. + Konzept · Note: 5/10
Beleg: caption.txt:12–14, konzept.md:105, script.txt:10
Problem: „Er zahlt 49 €“ direkt neben „geht auch mit Superkind“ suggeriert einen Superkind-Preis ohne Quelle; zudem bleibt offen, warum der Kunde für etwas zahlt, das der Zuschauer gratis in 3 Schritten baut.
Soll: Superkind-Satz steht in der Caption getrennt vom 49-€-Satz und nennt keinen Preis (oder der Preis ist mit Quelle belegt); Skript oder Caption enthält einen Halbsatz, warum der Kunde zahlt (z. B. „weil er's nicht selbst einrichten will“), ohne „KI-Mitarbeiter“; wirtschaftsbuch-v2.md hält fest, dass 49 € ein fiktiver Serienpreis ist, nicht Superkinds Preis.
```

```
TICKET autor-R1-04 → firma-autor
Kriterium: Neuer Zuschauer versteht in 5 s / Hook · Note: 6/10
Beleg: script.txt:1–3, hooks.md:10+18, wirtschaftsbuch-v2.md:56
Problem: „Kunde eins verliert Aufträge“ ist für Fremde doppeldeutig (wessen Kunde? Kunden vergeben Aufträge) und „Am Tempo“ abstrakt; was die KI-Firma verkauft, wird nie gesagt.
Soll: Bis Wort ~18 (≤ s 6) stehen Beruf, Schmerz und Dreh in Alltagssprache, ohne „Kunde eins“ als Subjekt (z. B. „Erster Kunde: ein Malermeister. Er verliert Aufträge, nicht weil er zu teuer ist. Weil sein Angebot zu spät kommt.“ – Wortzahl gegenrechnen); Test „älterer Handwerksmeister liest Satz 1–2 und kann sagen, wer welches Problem hat“ ist in thema.md dokumentiert; Formel in wirtschaftsbuch-v2.md:56 entsprechend angepasst.
```

```
TICKET autor-R1-05 → firma-autor
Kriterium: Thema · Note: 6/10
Beleg: script.txt:3+9, thema.md:16, hooks.md:10
Problem: Lösung lässt ihn weiter Sonntagabend arbeiten (Tempo-Problem ungelöst), und Frame 1 zeigt Papierbriefe, die Gmail nicht lesen kann.
Soll: Ergebnis-Satz zeigt, dass die Angebote am selben Tag rausgehen (z. B. „Jetzt geht jedes Angebot noch am selben Abend raus.“); Alltagsmoment und Frame-1-Vorgabe zeigen Mail-Anfragen (Handy/Laptop-Postfach mit Zähler 9), keine Papierbriefe; „Tatort“ nur, wenn es den Same-Day-Gedanken nicht verdrängt.
```

```
TICKET autor-R1-06 → firma-autor
Kriterium: Mehrwert nachbaubar · Note: 6/10
Beleg: script.txt:5–7, caption.txt:6, prompt-fuer-kommentare.md:7–9
Problem: Es fehlen die Per-Chat-Aktivierung (Q2: „+“ im Chat → Connectors → einschalten) und der Hinweis, dass das nur mit einem Gmail-Postfach geht.
Soll: Caption Schritt 1 und prompt-fuer-kommentare.md enthalten „im Chat unten links auf + → Connectors → Gmail und Google Drive einschalten“ mit Q2 als Quelle in thema.md; Caption und DM-Vorlage enthalten einen Satz „Funktioniert, wenn deine Anfragen in Gmail ankommen.“; script.txt:4 benennt, was gebaut wird („So schreibt Claude dir die Angebote selbst“), statt „das“.
```

```
TICKET autor-R1-07 → firma-autor
Kriterium: Kommentar-Mechanik · Note: 7/10
Beleg: prompt-fuer-kommentare.md:3, caption.txt:14
Problem: „angepasst auf deinen Beruf“ / „fertiger Prompt für deinen Betrieb“ ist bei beliebigen Freitext-Berufen über die Zernio-Automation nicht automatisch lieferbar, und „Versand erst nach OK von Pius“ widerspricht dem Sofort-DM-Ablauf.
Soll: prompt-fuer-kommentare.md beschreibt den echten Lieferweg (eine Zernio-DM für alle mit der Vorlage + Ausfüll-Anleitung für [BERUF]/[POSITIONEN] und den Beispielzeilen) und Caption/Skript versprechen nur das (z. B. „ich schick dir den Prompt, den du für deinen Beruf ausfüllst“), oder es ist dokumentiert, wer die Anpassung wann manuell macht.
```

```
TICKET autor-R1-08 → firma-autor
Kriterium: Länge, Sprechbarkeit, Serien-Regeln · Note: 7/10
Beleg: script.txt:7, caption.txt:16–18
Problem: „Schritt drei: Frag: Schreib …“ ist schwer sprechbar, und die Caption endet nicht mit dem Fiktiv-Hinweis (Hashtags danach).
Soll: Schritt 3 hat höchstens einen Doppelpunkt (z. B. „Schritt drei: Frag Claude: …“ mit Prompt als eigener Bildzeile); die letzte Zeile von caption.txt ist exakt „(Fiktives Experiment, keine echten Umsätze.)“ (Hashtags davor).
```

```
TICKET autor-R1-09 → firma-autor
Kriterium: Konzept · Note: 7/10
Beleg: konzept.md:122, wirtschaftsbuch-v2.md:81
Problem: Belegter Lösungsvorrat reicht nach eigener Aussage für ≈ 30 Folgen; „trägt 100 Folgen“ ist nicht gezeigt, und Nicht-Gmail-Betriebe (Outlook) sind dauerhaft ausgeschlossen.
Soll: wirtschaftsbuch-v2.md enthält eine Liste von mindestens 15 weiteren, jeweils mit support.claude.com-Link belegten Connectors/Funktionen (inkl. Microsoft 365/Outlook, falls belegt) für Tag 31–100, oder eine ehrliche Notiz, ab wann und wie nachgeplant wird.
```

## Was gut ist (bleibt)
- Konzept-Wahl K1 nachvollziehbar und ohne Kommentarzwang; Rahmen in einem Satz + HUD.
- Fakten in thema.md:22–44 fast vollständig gegen Q1/Q2 geprüft, Anhang-Grenze sauber erkannt und kommuniziert.
- 93 Wörter, Mehrwert ab ≈ s 8–11, Prompt-Vorlage mit Beispielzeilen und Fallback für Berufe ohne Angebote.
- Keine ChatGPT-Erwähnung, keine Erwähnung fehlender Kommentare, keine Emojis, Fiktiv-Hinweis vorhanden.
