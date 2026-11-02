# Prüfung Autor · Folge 18 (firma-tag18) · Runde 1 · 2026-10-31
Prüfer: frischer Prüf-Agent (nicht Ersteller). Geprüft: tagesbriefing-2026-11-01.md, briefing.md, thema.md, hooks.md, script.txt, caption.txt, prompt-fuer-kommentare.md, replies.json, design/lauf/LAUF.md (inkl. Gegenprüfung), design/lauf/bericht.md. Regeln: runs/firma-tag9/tagesbriefing-2026-10-30.md, references/bewertung.md (autor), Auftrag Chef.

## Harte Prüfungen
| Punkt | Befund | ok |
|---|---|---|
| Wörter | `wc -w script.txt` = 100 (Grenze) | ✓ |
| Sätze ≤ 12 | längster freier Satz 9 (CTA); feste Sätze 15 ausgenommen | ✓ |
| Erste Folge Serientag 5 | „Ich probier das aus. Tag fünf.“ in Zeile 1; kein „gestern“ (grep 0 in script/caption) | ✓ |
| Rückblick ↔ Folge 17 final | F17: „Fünf Briefe, Versandpreis fehlt.“ → Ergebnis „im Brief: Versand extra“, Übergabe „Was zahlt sie für das gestickte Shirt?“. F18: „Werbebrief: Versand extra.“ + „Heute rechnet sie ihre Marge.“ | ✓ Kette ohne Sprung |
| Caption | 2049 Zeichen (< 2100); vorletzter Block „(Fiktives Experiment, keine echten Umsätze.)“, danach nur Hashtags; keine Emojis; Menüpfad (claude.ai → „+“ → Brief anhängen) vorhanden | ✓ |
| Nur Belegtes | 5,75 € nicht gesprochen, nicht in Caption ✓; „siebzehn Euro“ = 17,15 € Claude-Rechnung netto/USt-IdNr., Spanne 17,00–17,71 € mit Printful-Digitalisierung 2,95–6,50 € (LAUF.md Gegenprüfung) ✓; „acht Euro“ = 29,90 − 21,80 = 8,10 ✓; Kleinunternehmer-Satz nirgends, Guide-Tabelle schließt ihn aus ✓; Konto/Testbestellung nicht als erledigt erzählt ✓ | ✓ |
| Echter Lauf | Chat 682aa15b…, 16:17:44–16:19:39, Gedächtnis aus, kein Konnektor, kein Login; Screenshots 01–12 | ✓ |
| Kommentar-Mechanik | prompt-fuer-kommentare.md fertig (Prompt A/B, Rechenweg, Grenzen, 1:1-außer-Tabelle); replies.json 1 + 5 Varianten, jede mit leichter Frage, keine Emojis | ✓ |
| Kein direktes Ansprechen außerhalb CTA | „du“ nur im CTA | ✓ |

## Noten
| Kriterium | Note | Beleg / Begründung |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 9 | script.txt:1 feste Frage + „Tag fünf.“ |
| Mehrwert (nachbaubar, ≤ 14 s, heute umsetzbar) | 8 | script.txt:3–4 „Heute …“ ≈ 14 s, Weg „Brief angehängt, Websuche“ direkt danach; Guide liefert Prompt + Rechenweg |
| Thema (Schmerz, ein Bild) | 8 | „Was bleibt mir vom Preis?“ kennt jeder Selbstständige; Bild = Rechnungstabelle 06 / Kernsatz 02 |
| Hook (Satz 2 + Frame 1 → Frage, Muster) | 8 | hooks.md: M-002 + M-011, Stempel „AUF NULL“ / „PREIS FEHLT“ aus dem Lauf |
| Kommentar-Mechanik | 9 | s. o. |
| Länge / Satzbau / Serienregeln | 8 | 100 Wörter genau an der Grenze; Schätzung 45 s / 133 wpm plausibel; Entscheidung mit 2 Gründen |
| **Beim reinen Zuhören eindeutig (Einkauf vs. Verkauf)** | **5** | siehe Tickets |
| Fakten / nur Belegtes | 9 | s. o. |
| Caption / Replies | 9 | s. o. |

K.-o.: keines verletzt. **Nicht bestanden** (ein Kriterium < 8).

## Befund Zuhör-Test (nur Ton, als neuer Zuschauer)
Das Skript nennt nie, dass sie fünf Shirts zu einem Paketpreis **verkauft** (109 €) und ein Einzelshirt zu 29,90 €. Folge 17 hat das auch nicht gesagt. Damit:
1. **„Den Fünferpreis lässt sie offen.“** (script.txt:6) folgt direkt auf „Den Einkaufspreis findet sie … nicht.“ Ein Neuer hört „Fünferpreis“ als Fortsetzung des Einkaufs (Printful-Preis für fünf?) oder umgangssprachlich als „Fünfer“ = 5-Euro-Preis (kurz nach „Tag fünf“). Dass es ihr eigener Verkaufspreis ist, wird nicht hörbar.
2. **„Im Fünferpack ist ein Shirt acht Euro billiger.“** (script.txt:7) Billiger für wen? Gehört klingt es nach Mengenrabatt beim Einkauf (gute Nachricht), nicht nach Rabatt an den Kunden (Grund für knappe Marge). Das Warum kippt damit ins Gegenteil.
3. **„Zahlt sie siebzehn Euro pro Shirt, bleibt nichts.“** (script.txt:8) „Zahlt sie“ ohne Empfänger; nach Satz 7 (Kunde/Paket) unklar, ob sie zahlt oder der Kunde. Bezug „Einkauf“ fehlt.

## Tickets
```
TICKET autor-R1-01 → firma-autor
Kriterium: Beim Zuhören eindeutig · Note: 5/10
Beleg: script.txt:6 „Den Fünferpreis lässt sie offen.“
Problem: „Fünferpreis“ ist gehört nicht als ihr Verkaufspreis für fünf Shirts erkennbar (Einkauf-Fortsetzung oder „Fünfer“ = 5 €).
Soll: Der Entscheidungssatz nennt hörbar ihren VERKAUFSpreis für das Fünferpack (Wort „Verkaufspreis“ als Gegenpaar zu „Einkaufspreis“), ≤ 12 Wörter; Entscheidung „lässt sie offen“ bleibt.
```
```
TICKET autor-R1-02 → firma-autor
Kriterium: Beim Zuhören eindeutig · Note: 5/10
Beleg: script.txt:7 „Im Fünferpack ist ein Shirt acht Euro billiger.“
Problem: Ohne Subjekt/Richtung klingt es nach Mengenrabatt beim Einkauf statt nach Rabatt, den sie dem Kunden gibt.
Soll: Satz macht hörbar, dass SIE dem Kunden im Fünferpack pro Shirt acht Euro nachlässt (Beleg: „Mengenrabatt frisst die Marge … 21,80 € statt 29,90 €“, Screenshot 08); „acht Euro“ bleibt; ≤ 12 Wörter.
```
```
TICKET autor-R1-03 → firma-autor
Kriterium: Beim Zuhören eindeutig · Note: 6/10
Beleg: script.txt:8 „Zahlt sie siebzehn Euro pro Shirt, bleibt nichts.“
Problem: „Zahlt sie“ ohne Bezug Einkauf; Scope Fünferpack nur implizit.
Soll: Das Wort „Einkauf“ (oder „kauft … ein“) steht im Satz, „siebzehn Euro“ und „pro Shirt“ bleiben, Bezug Fünferpack über den Warum-Block klar; keine „5,75“, keine weitere Zahl.
```
```
TICKET autor-R1-04 → firma-autor
Kriterium: Länge · Note: 8/10 (Bedingung)
Beleg: script.txt (100 Wörter)
Problem: Tickets 01–03 brauchen Wörter, Grenze ist schon erreicht.
Soll: Nach Umsetzung `wc -w` 85–100, kein Satz > 12 Wörter (außer feste), feste Eröffnung/Rückblick-Satz 1/„Werbebrief: Versand extra.“/„Tag fünf.“ unverändert; Kürzung nur bei Nebeninfos (z. B. CTA „Damit“), nie beim Warum.
```
Vorschlag (nicht bindend): „Ohne Printful-Konto findet sie keinen Einkaufspreis. / Ihren Verkaufspreis fürs Fünferpack lässt sie offen. / Warum? Im Fünferpack gibt sie acht Euro Rabatt pro Shirt. / Ab siebzehn Euro Einkauf pro Shirt bleibt nichts. / … In zehn Minuten weißt du, was dir bleibt.“ = 100 Wörter.

Folgeänderungen: thema.md Faktentabelle, hooks.md „Danach“, TTS-Risikowörter (neu: „Verkaufspreis“, „Rabatt“; „Fünferpreis“ entfällt), prompt-fuer-kommentare.md Zitat CTA, Caption nur falls Wortlaut zitiert.
