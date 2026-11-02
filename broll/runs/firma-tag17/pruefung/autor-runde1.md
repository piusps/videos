# Prüfung Autor · Folge 17 („Was kostet der Versand der Shirts?“) · Runde 1

Prüfer: frischer Agent, 2026-10-31. Geprüft: briefing.md, thema.md, hooks.md, script.txt, caption.txt, prompt-fuer-kommentare.md, replies.json, design/lauf/LAUF.md (inkl. Gegenprüfung), design/lauf/bericht.md. Regeln: runs/firma-tag9/tagesbriefing-2026-10-30.md, firma-pruefer/references/bewertung.md (autor).

## Messwerte
- `wc -w script.txt` = **100** (Grenze 85–100 ✓, auf Kante).
- Sätze (freie): längster 11 Wörter + „Warum?“ = 12 ✓. Feste Sätze 15/15 ausgenommen.
- Nicht erste Folge: kein „Tag“, kein „gestern“ ✓.
- Rückblick „Fünf Briefe, Versandpreis fehlt.“ passt zum finalen firma-tag16/script.txt („Ein Brief, fünf Adressen geprüft.“ → fünf Briefe; „Absender, Datum, Versandkosten fehlen“) ✓; „Heute klärt sie den Shirt-Versand.“ beantwortet die Übergabe „Was kostet der Versand der Shirts?“ ✓.
- Caption 2069 Zeichen (Python len) ✓, Ende „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags ✓, keine Emojis (auch replies.json) ✓.
- Lieferzeit „4–10 Werktage“: in script, caption, replies nicht vorhanden ✓; Guide-Vorgabe lässt sie weg ✓. **Aber**: sie steht in der Briefzeile, die Frame 1 zeigen soll (LAUF.md: „Versand: zzgl. … Einzelshirt. Lieferung in der Regel 4 bis 10 Werktage nach Bestellung.“) → T-04.

## Spezialfragen
1. **11,20 € / 5,20 € vs. printful.com/shipping (4,49 € + 1,25 €; mit USt 11,29 / 5,34):** Gesprochen wird kein Betrag ✓. Caption: „Claude findet Printfuls Versandtarif“ + „Die Beträge hat Claude selbst aufgerundet“ suggeriert, die Briefbeträge lägen sicher über Printfuls Preis. Laut Gegenprüfung liegen sie bei Euro-Tarif + USt darunter → irreführend (T-03).
2. **Briefzeile im Bild:** vertretbar als echtes Objekt aus Claudes Datei, **ohne** Zusatzlabel „Claudes Eintrag, abweichend“ (wäre zweiter Textblock, > 4 Wörter, erklärt nichts ohne Ton). Bedingungen (T-04): Lieferzeit-Satz nicht sichtbar; Hervorhebung/Zoom nur auf „Versand: zzgl.“, Beträge nicht vergrößert und nie im selben Bild mit Printful-Logo/-Wort; Screenshot 03 („Was Printful für den Versand verlangt“, 4,99 $ / 1,45 $) nicht mit lesbaren Beträgen im Video. Die Einordnung leistet die Caption.
3. **„siebzehn Prozent“ (wovon?):** Beim Hören nicht eindeutig. „frisst er siebzehn Prozent“ kann als 17 % vom Gewinn/der Marge verstanden werden (T-01). Sachlich: Claude 4,34 €/25,13 € netto = 17 %; brutto/brutto (5,17/29,90) ebenfalls 17 %; Gegenprüfung ≈ 18 %. „vom Einzelshirt-Preis“ ist in beiden Steuerfällen richtig.
4. **Übergabe „Was zahlt sie für das gestickte Shirt?“ ohne Login machbar?** Ja, mit Einschränkung. Selbst geprüft 2026-10-31: printful.com/pricing nennt öffentlich „Digitization fee – $2.95-$6.50 per design (one-time)“ und „$2.95 per additional placement“; Produktseite Bella+Canvas 3001 zeigt „12.25 USD“ ohne Login. Stickpreis je Produkt ist auf der Produktseite nicht ausgewiesen; Lauf 18 muss ehrlich sagen, wenn der gestickte Endpreis nur im Konto steht. Übergabe bleibt ✓.

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 9 | script.txt Z.1 fest + Frame 1 Brief |
| Mehrwert, nachbaubar, Beginn ≤ 14 s | 8 | Z.4 „Claude: Briefe angehängt, Websuche bei Printful.“ ≈ 14–15 s; Guide Variante A = echter Prompt |
| Thema (Schmerz, ein Bild) | 9 | „Ist der Versand drin oder lege ich drauf?“ |
| Hook (Satz 2 + Frame 1) | **6** | hooks.md: „die neue Zeile „Versand: zzgl. 11,20 Euro …“ als einziges hervorgehobenes Element“ → Betrag als Hero, Lieferzeit im selben Absatz (T-04) |
| Kommentar-Mechanik | 9 | prompt-fuer-kommentare.md vollständig, replies.json mit Fragen |
| Länge / Sätze / Klarheit | **7** | 100 Wörter ✓; Z.7 „Beim Einzelshirt frisst er siebzehn Prozent.“ wovon unklar (T-01) |
| Warum (2–3 Gründe) | 8 | Einkaufspreis fehlt + 17 % |
| Kette / Rückblick / Übergabe | 9 | s. o. |
| Fakten / nur Belegtes (Caption) | **6** | caption.txt „nur die Versandkosten fehlten noch“ widerspricht „Absender, Datum und Kontakt fehlen weiter“ (T-02); „findet Printfuls Versandtarif … selbst aufgerundet“ (T-03) |
| K.-o. | keins | kein „du“ außerhalb CTA, echter Lauf, keine unbelegte Claude-Funktion |

**Ergebnis: nicht bestanden (3 Kriterien < 8).**

## Tickets
```
TICKET autor-R1-01 → firma-autor
Kriterium: Länge/Klarheit · Note: 7/10
Beleg: script.txt Z.7 „Beim Einzelshirt frisst er siebzehn Prozent.“
Problem: Beim Hören bleibt offen, wovon 17 % (Preis? Gewinn?).
Soll: Der Satz nennt hörbar die Bezugsgröße Einzelshirt-Preis; script.txt bleibt 85–100 Wörter (wc -w), Satz ≤ 12 Wörter; thema.md-Faktentabelle angepasst.
```
```
TICKET autor-R1-02 → firma-autor
Kriterium: Fakten · Note: 6/10
Beleg: caption.txt Absatz „Stand“: „nur die Versandkosten fehlten noch“
Problem: „nur“ ist falsch (Absender, Datum, Kontakt fehlen auch; Caption sagt das selbst weiter unten).
Soll: Kein „nur“; Stand-Satz widerspricht dem „Haken“-Absatz nicht.
```
```
TICKET autor-R1-03 → firma-autor
Kriterium: Fakten · Note: 6/10
Beleg: caption.txt „Claude findet Printfuls Versandtarif … Die Beträge hat Claude selbst aufgerundet.“; LAUF.md Gegenprüfung (4,49 € + 1,25 € → mit USt 11,29 € / 5,34 €)
Problem: Caption legt nahe, 11,20/5,20 decken Printfuls Versand sicher ab; laut Gegenprüfung nicht.
Soll: Caption nennt 11,20/5,20 nur als Claudes Eintrag (Dollar-Tarif, Kurs Juli 2026, selbst aufgerundet) und sagt, dass die Printful-Seite bei einer Gegenprüfung Euro-Preise zeigte, mit Steuer etwas mehr; verbindlich nur der Checkout. Kein Betrag als „Printful-Preis“. ≤ 2100 Zeichen, Ende unverändert.
```
```
TICKET autor-R1-04 → firma-autor (Bild-Vorgabe für Regie/Design)
Kriterium: Hook · Note: 6/10
Beleg: hooks.md „Frame 1“; thema.md „Bild-Hinweise“ (Screenshots frei 01–08, 10); LAUF.md Briefzeile inkl. „Lieferung in der Regel 4 bis 10 Werktage“
Problem: Frame 1 macht die strittigen Beträge zum Hero und zeigt die unbelegte Lieferzeit mit; Screenshot 03 zeigt Claudes Dollar-Tarif als „Was Printful … verlangt“.
Soll: hooks.md + thema.md: Hervorhebung nur auf „Versand: zzgl.“ (+ Stempel VERSAND EXTRA), Beträge sichtbar, aber nicht vergrößert, nie neben Printful-Logo/-Wort; Lieferzeit-Satz abgeschnitten/abgedeckt; Screenshot 03 nicht mit lesbaren Beträgen (Websuche-Beat mit 07/08); kein Zusatzlabel nötig.
```
