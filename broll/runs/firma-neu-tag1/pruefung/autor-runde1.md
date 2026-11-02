# Prüfung · Stufe autor · Runde 1 · Neustart Tag 1 (Firmenshirts)

Prüfer: firma-pruefer (fremder Agent), 2026-10-26. Maßstab: `~/.claude/skills/firma-pruefer/references/bewertung.md` Abschnitt „## autor“ + briefing.md (v. a. „Richtungsentscheid Pius“, „Geschäft entschieden“) + wirtschaftsbuch-v2.md.
Geprüft: konzept.md, thema.md, hooks.md, script.txt, prompt-fuer-kommentare.md, caption.txt. Referenzen: spy/muster.md, Zerlegung opusjake Trader 2.3M (Frame 1 + Mehrwert ab 2,0 s, CTA 29,1 s).
Chef-Regeln beachtet (kein Ticket): Caption = Fiktiv-Hinweis, danach nur Hashtags. Keine konkrete Claude-Antwort im Skript, Entscheidung „keine Maschine“ = Story.

Quellen selbst geöffnet am 2026-10-26:
- Q1 https://support.claude.com/en/articles/10684626-enable-and-use-web-search
  - „Click on the "+" button in the lower left corner of the chat window.“ → „Web search“ im Dropdown, Häkchen.
  - „If you have the new Claude experience, there's no web search toggle. Claude searches the web when it helps.“
  - Team/Enterprise: „An Owner or Primary Owner must first enable web search for the entire workspace in Organization settings > Capabilities.“
  - „Every response includes citations, so you can easily verify sources yourself.“
- Q1-de https://support.claude.com/de/articles/10684626-websuche-aktivieren-und-verwenden
  - „Klicken Sie auf die Schaltfläche „+“ in der unteren linken Ecke des Chat-Fensters.“ / „Suchen Sie „Websuche“ in der Dropdown-Liste“.
  - „Ein Besitzer oder Hauptbesitzer muss zunächst die Websuche … in **Organisationseinstellungen > Funktionen** aktivieren.“
  - „Wenn Sie die neue Claude-Oberfläche haben, gibt es keinen Websuche-Schalter.“

Zeitachse (93 Wörter, Ziel ≈ 32,5 s → ≈ 2,86 Wörter/s, kumuliert aus script.txt):
Z1 Ende Wort 10 ≈ 3,5 s · Z2 „Firmenshirts“ Wort 16 ≈ 5,6 s, Ende Wort 20 ≈ 7,0 s · Z3 Ende Wort 25 ≈ 8,7 s · Z4 „Zum Glück“ Wort 26 ≈ 9,1 s, „Das geht mit jeder Idee“ ab Wort 33 ≈ 11,5 s · Z5 „Schritt eins“ Wort 38 ≈ 13,3 s · Z9 Entscheidung Wort 74 ≈ 25,9 s · Z10 CTA Wort 85 ≈ 29,7 s.

## Gesamtentscheidung: NICHT BESTANDEN (knapp)

Kein K.-o. verletzt. 4 von 8 Kriterien bei 7, alle mit kleinen, klar lösbaren Korrekturen.

| # | Kriterium | Note |
|---|---|---|
| 1 | Fakten / K.-o.-Prüfung (Skript, Caption, DM gegen Q1/Q1-de) | **7** |
| 2 | Neuer Zuschauer versteht in 5 s, worum es geht | 8 |
| 3 | Mehrwert: nachbaubar, Beginn ≤ 14 s, heute umsetzbar | 8 |
| 4 | Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | **7** |
| 5 | Hook: Satz 2 + Frame 1 erzeugen eine Frage, gestützt auf muster.md | **7** |
| 6 | Kommentar-Mechanik: konkreter Nutzen, Prompt liegt fertig vor, lieferbar | 8 |
| 7 | Länge 85–95, Sprechbarkeit, Serien-Regeln | 8 |
| 8 | Konzept (trägt 100 Folgen, Fremde, Superkind-Regel, Richtungsentscheid) | **7** |

Alte Tickets aus dem verworfenen Konzept, Wiederholung geprüft:
- Falsche/unbelegte Claude-Funktionsbehauptung: **nicht wieder aufgetreten** (alle Funktionssätze durch Q1 gedeckt; nur Ungenauigkeiten, siehe 1).
- Implizierter Superkind-Preis: **nicht aufgetreten** (Superkind kommt in Skript/Caption nicht vor; 25 €/Shirt ist als fiktiver Serienpreis markiert, wirtschaftsbuch-v2.md:37).
- Story-Widerspruch in Frame 1: **nicht aufgetreten** (Maschine rollt als „erster Plan“ herein, wird verworfen, Partner-Insel erscheint; passt zu wirtschaftsbuch-v2.md:30).
- Nicht automatisch lieferbarer Kommentar-Prompt: **behoben** (eine DM für alle, Platzhalter, prompt-fuer-kommentare.md:3).
- Schwer sprechbare Sätze: **nicht aufgetreten**; eine Hör-Doppeldeutigkeit („Ihre Entscheidung“, siehe 7).
- Konzept trägt keine 100 Folgen: **weitgehend behoben** (Phasenplan konzept.md:14, Themen 1–10 mit Quellen), Restlücke USP, siehe 8.

---

## 1 · Fakten · 7/10

Belegt und korrekt:
- script.txt:5 „Im Chat aufs Plus, Websuche an.“ = Q1 + Q1-de wörtlich. Das deutsche Label „Websuche“ ist durch die deutsche Hilfeseite belegt (vom Autor als Risiko genannt, thema.md:41 → damit geklärt, Screenshot im Design-Lauf bleibt trotzdem Pflicht).
- script.txt:7 „Claude sucht im Netz und antwortet mit Quellen.“ = Q1 „Every response includes citations“.
- Keine wörtliche Claude-Antwort, keine Anbieterzahl, keine Preise im Skript (thema.md:27). Regelkonform (wirtschaftsbuch-v2.md:16).
- Marktplausibilität (thema.md:24, Q2 geldmarie, Q3 awin/Spreadshirt) nur im Konzept, nicht im Skript. In Ordnung.

Ungenau:
- caption.txt:6 und prompt-fuer-kommentare.md:8 „Im Team-Konto muss **der Admin** …“: Q1 sagt „An Owner or Primary Owner“, Q1-de „Ein Besitzer oder Hauptbesitzer“, und es gilt für Team **und** Enterprise. Wer einem Admin ohne Besitzerrolle Bescheid gibt, kommt nicht weiter.
- caption.txt:6 nennt den Pfad englisch „Organization settings > Capabilities“ und das Label „Web search“, prompt-fuer-kommentare.md:8 ebenso „Web search“. Das Skript sagt „Websuche“. Ein deutscher Zuschauer mit deutscher Oberfläche sieht laut Q1-de „Websuche“ und „Organisationseinstellungen > Funktionen“. Caption, DM und Skript widersprechen sich im Label.
- caption.txt:6 „Ohne Schalter sucht Claude von selbst.“ / prompt-fuer-kommentare.md:8 „sucht Claude von selbst“: Q1 sagt „when it helps“, also nicht bei jeder Frage. Kleine Überdehnung; da der Prompt ausdrücklich „Such im Web“ enthält, praktisch harmlos, aber genauer formulierbar.

## 2 · Neuer Zuschauer versteht in 5 s · 8/10
- Frame 1 (hooks.md:7): Agent schiebt riesige Druckmaschine in leeren Raum, „0 €“ am leeren Shirt-Stapel. Shirt + Kasse + Maschine sind ohne Ton lesbar. Vergleichbar mit Trader 00:00 (Krebs am Stecker).
- Ton: Bis 5 s nur Eröffnung + „Kasse: null Euro“; das Geschäft „Firmenshirts“ fällt bei ≈ 5,6 s. Das Bild trägt die ersten 5 s, deshalb 8 und nicht höher.
- Eröffnung „KI baut ein Unternehmen von Null“ + konkretes Geschäft löst das alte Problem „welche Firma?“ vollständig.

## 3 · Mehrwert · 8/10
- Übertrag „Das geht mit jeder Idee“ ab ≈ 11,5 s (Bibel: spätestens s 12, wirtschaftsbuch-v2.md:45) ✓.
- „Schritt eins“ bei ≈ 13,3 s: innerhalb ≤ 14 s, aber ohne Puffer. Jede Pause beim Schnitt nach der Eröffnung schiebt es über 14 s. Regie muss das halten (Hinweis, kein Ticket).
- 3 Schritte, heute umsetzbar, ohne Setup, für jede eigene Idee übertragbar (thema.md:17) ✓. DM-Prompt ist allgemeiner und stärker (Frage 3 „geht es ohne meinen ersten Plan“, „sag ehrlich“) ✓.
- Schwäche: Schritt 1 „Websuche an“ trifft für Nutzer der neuen Oberfläche nicht zu (kein Schalter, Q1). Caption und DM fangen das ab, das Skript nicht. Akzeptabel, weil im Bild das echte UI gezeigt wird.

## 4 · Thema · 7/10
- Schmerz stark und bekannt: Geld in Ausrüstung stecken, bevor klar ist, ob es sich lohnt (Anhänger, Maschine, Lagerhalle; prompt-fuer-kommentare.md:22–25). Ergebnis in einem Bild: Maschine fliegt von der Palette, Partner-Insel erscheint (thema.md:8) ✓.
- **Payoff ohne Begründung:** script.txt:9 „Ihre Entscheidung: keine Maschine.“ folgt direkt auf zwei Fragen, deren Antwort nie fällt. Der Zuschauer hört nicht, *warum* die Prüfung gegen die Maschine spricht. Damit wirkt die Prüfung wie Deko: Plan → Fragen → Entscheidung ohne Brücke. Die Story-Regel (wirtschaftsbuch-v2.md:15, „Plan → Prüfung → Entscheidung“) verlangt, dass die Prüfung die Entscheidung trägt. Eine Begründung als *Überlegung der KI-Figur* (Story, kein Claude-Zitat) ist erlaubt und mit Q2 (Siebdruck bei kleinen Auflagen nur eingeschränkt rentabel, Fixkosten unabhängig von Stückzahl) plausibel.
- **Frage 3 bleibt offen:** script.txt:8 „Was fehlt Betrieben unter zehn Leuten?“ wird gestellt, aber weder Skript noch Caption sagt, was die Firma daraus macht. Das ist genau die Lücke Firma vs. Spreadshirt ohne Mindestmenge (Autor-Risiko). Der Zuschauer denkt: „Dann bestell ich halt selbst bei so einem Partner.“

## 5 · Hook · 7/10
- M-002 (Frame 1 spielt die Aussage) stark erfüllt, M-005 (Zähler „0 €“ am Stapel) ✓.
- **M-001 verfehlt:** muster.md:14–19 verlangt Annahme + Umkehrung bis s 5, Umkehrung in Satz 2. Hier enthält Satz 2 keine Umkehrung; der Plan steht bei ≈ 8,7 s, der Dreh „Zum Glück prüft sie vorher“ bei ≈ 9,1 s (hooks.md:13 gesteht das selbst ein). Zudem ist „Zum Glück prüft sie vorher“ nur ein halber Dreh: Es sagt nicht, dass der Plan falsch ist, nur dass geprüft wird. Die Frage „wieso ist die Maschine falsch?“ entsteht erst, wenn der Dreh klar sagt, dass der Plan ein Fehler ist.
- Die feste Eröffnung kostet ≈ 3,5 s; s 5 ist mit ihr kaum erreichbar. Realistisches Soll: Plan + klarer Dreh bis Wort 22 (≈ s 7,5), indem Satz 2 und 3 verschmelzen.

## 6 · Kommentar-Mechanik · 8/10
- Keyword „Idee“, Lieferung im Satz („ich schick dir den Prompt zum Ausfüllen“, script.txt:10) = M-007 (Trader 00:29, 64K Kommentare) ✓.
- Eine Zernio-DM für alle, Platzhalter, keine manuelle Anpassung (prompt-fuer-kommentare.md:3) → automatisch lieferbar ✓. Vier Berufsbeispiele für die Zielgruppe ✓.
- Kleinigkeit: prompt-fuer-kommentare.md:6 „der Prompt aus dem Video“, der DM-Prompt hat aber drei Fragen + Region, das Video zwei. Besser „der Prompt zum Video“. Labels/Admin siehe Ticket 01.

## 7 · Länge, Sprechbarkeit, Serien-Regeln · 8/10
- 93 Wörter ✓ (85–95). Zahlen als Wörter ✓. Eröffnung wörtlich (wirtschaftsbuch-v2.md:12) ✓, danach Kasse + Schritt ✓. Kasse 0 € bis Tag 10 ✓. Caption ohne Emojis, 6 Hashtags, Fiktiv-Hinweis vor den Hashtags (Chef-Format) ✓. Kein Superkind, kein „KI-Mitarbeiter“, nichts zu fehlenden Kommentaren ✓.
- Hör-Doppeldeutigkeit script.txt:9 „**Ihre** Entscheidung“: gesprochen am Satzanfang klingt das wie die Sie-Anrede („Ihre Entscheidung“ = Ihre, des Zuschauers), im Untertitel steht es großgeschrieben genauso. Bricht mit der Du-Form (script.txt:6, 10). Wird in Ticket 02 mit erledigt.

## 8 · Konzept · 7/10
- Richtungsentscheid umgesetzt: eine Firma, ein Geschäft, jede Folge ein echter Firmenschritt (konzept.md:24–36) ✓. Kunden = Zuschauer-Typen ✓. „Ganz alleine“ mit Druckpartner glaubhaft erklärt (konzept.md:11) ✓. Geldmechanik langsam und ehrlich (wirtschaftsbuch-v2.md:36–42) ✓. Rückschläge als Story mit Claude-Lösung ✓. Themenplan 1–10 jeweils mit support.claude.com-Quelle ✓.
- **Lücke im Geschäftsmodell:** Weder konzept.md noch wirtschaftsbuch-v2.md sagen, warum ein Betrieb bei der KI-Firma kauft statt direkt bei einem Print-on-Demand-Anbieter ohne Mindestmenge (thema.md:32 belegt selbst, dass es den gibt). Über 100 Folgen ist das der erste Einwand jedes Unternehmers in den Kommentaren, und ohne Antwort wirkt die Firma überflüssig. Das muss nicht in Tag 1 gelöst werden, aber die Bibel braucht die Hypothese und die Folge, in der sie geklärt wird.
- Tag 11+ nur als unbelegte Ideenliste (wirtschaftsbuch-v2.md:61); für Neustart akzeptabel, da Phasenplan existiert.

---

## Korrektur-Tickets

```
TICKET autor-R1-01 → firma-autor
Kriterium: Fakten · Note: 7/10
Beleg: caption.txt:6, prompt-fuer-kommentare.md:8 (gegen Q1 + Q1-de)
Problem: „der Admin“ statt Besitzer/Hauptbesitzer, nur „Team“ statt Team/Enterprise, englische Labels („Web search“, „Organization settings > Capabilities“) gegen das deutsche „Websuche“ im Skript, und „sucht von selbst“ statt „wenn es hilft“.
Soll: Caption und DM nennen dasselbe Label wie das Skript („Websuche“, englisch höchstens in Klammern), den Pfad „Organisationseinstellungen > Funktionen“, die Rolle „Besitzer“ (Team- oder Enterprise-Konto) und formulieren den Fall ohne Schalter als „Claude sucht selbst im Netz, wenn es hilft“ (oder „… sobald du im Prompt ‚Such im Web‘ schreibst“). Jede dieser Aussagen steht wörtlich gedeckt in Q1-de.
```

```
TICKET autor-R1-02 → firma-autor
Kriterium: Thema · Note: 7/10
Beleg: script.txt:8–9
Problem: Die Entscheidung „keine Maschine“ kommt ohne Begründung, Frage 3 („Was fehlt?“) bleibt unbeantwortet, und „Ihre Entscheidung“ klingt nach Sie-Anrede.
Soll: Satz 9 enthält eine kurze Begründung als Überlegung der KI-Figur (kein Claude-Zitat, keine Zahl ohne Quelle in thema.md), z. B. „Die KI rechnet: Für fünf Shirts pro Betrieb lohnt keine Maschine.“; das Subjekt ist eindeutig „die KI“ (kein „Ihre“/„sie“ am Satzanfang); entweder Skript oder Caption nennt in einem Halbsatz, was die Firma kleinen Betrieben zusätzlich bietet (Hypothese aus Frage 3), oder Frage 3 wird als ausdrücklicher Faden für Tag 2/3 angekündigt. Skript bleibt 85–95 Wörter.
```

```
TICKET autor-R1-03 → firma-autor
Kriterium: Hook (M-001) · Note: 7/10
Beleg: script.txt:2–4, hooks.md:7+13
Problem: Der Dreh kommt erst bei ≈ 9 s und sagt nur „sie prüft vorher“, nicht dass der Plan ein Fehler ist; muster.md M-001 verlangt Umkehrung in Satz 2 bis s 5.
Soll: Plan und klarer Dreh stehen im Skript bis spätestens Wort 22 (≈ s 7,5 bei 93 Wörtern), der Dreh benennt den Plan als (fast) teuren Fehler ohne unbelegte Zahl (z. B. „Kasse null Euro, Idee Firmenshirts, erster Plan: eine eigene Druckmaschine. Das wäre fast der erste teure Fehler.“), und hooks.md weist die Wortposition des Drehs neu aus. Frame 1 bleibt die Maschine im leeren Raum.
```

```
TICKET autor-R1-04 → firma-autor
Kriterium: Konzept · Note: 7/10
Beleg: konzept.md:5–14, wirtschaftsbuch-v2.md:6–9, thema.md:32
Problem: Es fehlt die Antwort, warum ein Betrieb bei der KI-Firma kauft statt selbst bei einem Print-on-Demand-Anbieter ohne Mindestmenge.
Soll: wirtschaftsbuch-v2.md und konzept.md enthalten einen Absatz „Was die Firma besser macht als Selbstbestellen“ mit einer Hypothese (z. B. Logo-Aufbereitung, Größen einsammeln, Sammelbestellung, Rechnung an den Betrieb, Nachbestellung), markiert als Story/Hypothese, und der Themenplan nennt die Folge (≤ Tag 3), in der die Firma diese Lücke mit Claude prüft.
```

## Hinweise ohne Ticket
- Regie: „Schritt eins“ liegt bei ≈ 13,3 s ohne Puffer; nach der Eröffnung keine Kunstpause, sonst Verstoß gegen „Mehrwert ≤ 14 s“.
- Design: echtes UI-Label im Screenshot zeigen (thema.md:41); wenn der Testaccount die neue Oberfläche ohne Schalter hat, muss Schritt 1 im Skript angepasst werden → Rückmeldung an Autor.
- DM: „Prompt aus dem Video“ → „Prompt zum Video“ (prompt-fuer-kommentare.md:6).
